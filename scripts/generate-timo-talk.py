#!/usr/bin/env python3
"""
Pętle mówienia Timo — Kling v3 (image-to-video) przez ToAPIs.

Prompty czyta wprost z `docs/prompts-timo-talking.md` (sekcje „## N. … — `nazwa`”
i blok kodu pod każdą), żeby nie trzymać dwóch kopii, które się rozjadą.
Negative prompt — z sekcji „Negative prompt”.

Klatka startowa = pierwsza klatka `timo-idle.source.mp4`, wycięta z tła
i położona na czystej bieli: ta sama poza co idle, więc przejście
idle ↔ mówienie nie przeskakuje. Ta sama klatka idzie jako klatka KOŃCOWA
(`image_with_roles`: first_frame + last_frame) — pętla domyka się sama.

Wyniki: assets/timo/character/_raw/<nazwa>-<n>.mp4 (poza repo).

Uruchom:  python3 scripts/generate-timo-talk.py [<nazwa> ...] [--variants=3] [--mode=pro]
"""
import json, pathlib, re, sys, time, urllib.request, uuid

API = "https://toapis.com/v1"
MODEL = "kling-v3"
DOC = pathlib.Path("docs/prompts-timo-talking.md")
START = pathlib.Path("assets/timo/character/timo-talk-start.png")
OUT = pathlib.Path("assets/timo/character/_raw")


def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")


def prompts():
    text = DOC.read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r"^## \d+\..*?`([a-z-]+)`.*?```\n(.*?)```", text, re.S | re.M):
        out[m.group(1)] = m.group(2).strip()
    neg = re.search(r"## Negative prompt.*?```\n(.*?)```", text, re.S)
    return out, (neg.group(1).strip() if neg else "")


def request(method, path, k, body=None, headers=None):
    req = urllib.request.Request(API + path, data=body, method=method,
                                 headers={"Authorization": f"Bearer {k}", **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} dla {path}: {e.read().decode()[:400]}")


def upload(k, path):
    boundary = uuid.uuid4().hex
    data = path.read_bytes()
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{path.name}\"\r\n"
            f"Content-Type: image/png\r\n\r\n").encode() + data + f"\r\n--{boundary}--\r\n".encode()
    r = request("POST", "/uploads/images", k, body, {"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return r["data"]["url"]


def find_video_url(obj):
    """Odpowiedź zadania bywa różnie zagnieżdżona — szukamy pierwszego URL-a do .mp4."""
    if isinstance(obj, str):
        return obj if obj.startswith("http") and ".mp4" in obj else None
    if isinstance(obj, dict):
        for v in obj.values():
            u = find_video_url(v)
            if u:
                return u
    if isinstance(obj, list):
        for v in obj:
            u = find_video_url(v)
            if u:
                return u
    return None


def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--"))
    variants = int(opts.get("variants", 3))
    mode = opts.get("mode", "pro")

    all_prompts, negative = prompts()
    names = args or list(all_prompts)
    k = key()
    OUT.mkdir(parents=True, exist_ok=True)
    frame = upload(k, START)
    print(f"klatka startowa/końcowa: {frame}")

    tasks = {}
    for name in names:
        for n in range(1, variants + 1):
            dest = OUT / f"{name}-{n}.mp4"
            if dest.exists():
                continue
            r = request("POST", "/videos/generations", k, json.dumps({
                "model": MODEL,
                "prompt": all_prompts[name],
                "mode": mode,
                "duration": 5,
                "aspect_ratio": "9:16",
                "audio": False,
                "image_with_roles": [
                    {"url": frame, "role": "first_frame"},
                    {"url": frame, "role": "last_frame"},
                ],
                "metadata": {"negative_prompt": negative, "watermark": False},
            }).encode(), {"Content-Type": "application/json"})
            tid = r.get("id") or r.get("task_id") or r.get("data", {}).get("id")
            tasks[dest] = tid
            print(f"  wyslano  {dest.name:26} {tid}", flush=True)

    t0 = time.time()
    while tasks and time.time() - t0 < 3600:
        time.sleep(15)
        for dest, tid in list(tasks.items()):
            try:
                r = request("GET", f"/videos/generations/{tid}", k)
            except SystemExit:
                continue
            st = str(r.get("status") or r.get("data", {}).get("status") or "").lower()
            if st in ("completed", "succeeded", "success"):
                url = find_video_url(r)
                if not url:
                    print(f"  BRAK URL {dest.name}: {json.dumps(r)[:300]}")
                    tasks.pop(dest)
                    continue
                fetch(url, dest)
                tasks.pop(dest)
                print(f"  gotowe   {dest.name:26} ({int(time.time() - t0)}s)", flush=True)
            elif st in ("failed", "cancelled", "error"):
                print(f"  PADLO    {dest.name:26} {json.dumps(r)[:300]}", flush=True)
                tasks.pop(dest)
    for dest in tasks:
        print(f"  NIE ZDAZYLO {dest.name}")


if __name__ == "__main__":
    main()
