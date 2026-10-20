#!/usr/bin/env python3
"""
Wysyłka zatwierdzonych postów do harmonogramu Postiz (publiczne API).

Publikuje WYŁĄCZNIE posty ze statusem „approved” w `plan.json` danego tygodnia.
Po udanej wysyłce zapisuje identyfikatory z Postiz z powrotem do planu i zmienia
status na „scheduled”, więc ponowne uruchomienie niczego nie dubluje.

Klucz: `POSTIZ_API_KEY` w `.env` (Postiz → Settings → Public API).

Uruchom:
  python3 scripts/marketing/postiz.py channels                    # podłączone profile
  python3 scripts/marketing/postiz.py schedule marketing/out/2026-W41 [--dry-run] [--draft]

`--dry-run` pokazuje, co by poszło, bez wysyłania. `--draft` zapisuje posty
w Postiz jako szkice zamiast planować publikację.

Dokumentacja API: https://docs.postiz.com/public-api/introduction
"""
import json, mimetypes, pathlib, sys, urllib.error, urllib.request, uuid

ROOT = pathlib.Path(__file__).resolve().parents[2]
API = "https://api.postiz.com/public/v1"

# Nazwa platformy w planie → identyfikator providera w Postiz i jego ustawienia.
# Instagram ma w Postiz dwa warianty podłączenia (przez Facebooka i samodzielny).
PROVIDERS = {
    "tiktok": (("tiktok",), {"privacy_level": "PUBLIC_TO_EVERYONE", "duet": False, "stitch": False,
                             "comment": True, "autoAddMusic": "no", "brand_content_toggle": False,
                             "brand_organic_toggle": False, "content_posting_method": "DIRECT_POST"}),
    "instagram": (("instagram", "instagram-standalone"), {"post_type": "post", "is_trial_reel": False,
                                                          "collaborators": []}),
    "x": (("x",), {"who_can_reply_post": "everyone"}),
}


def key():
    for line in open(ROOT / ".env", encoding="utf-8"):
        if line.startswith("POSTIZ_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak POSTIZ_API_KEY w .env")


def request(method, path, k, body=None, headers=None):
    req = urllib.request.Request(API + path, data=body, method=method,
                                 headers={"Authorization": k, **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} dla {path}: {e.read().decode()[:400]}")


def upload(k, path):
    boundary = uuid.uuid4().hex
    ctype = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{path.name}\"\r\n"
            f"Content-Type: {ctype}\r\n\r\n").encode() + path.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    r = request("POST", "/upload", k, body, {"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return {"id": r["id"], "path": r["path"]}


def channels(k):
    found = {}
    for item in request("GET", "/integrations", k):
        provider = item.get("identifier") or item.get("providerIdentifier")
        for platform, (ids, _) in PROVIDERS.items():
            if provider in ids and not item.get("disabled"):
                found[platform] = {"id": item["id"], "provider": provider, "name": item.get("name", "")}
    return found


def schedule(week_dir, dry_run, draft):
    plan_path = week_dir / "plan.json"
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    todo = [p for p in plan["posts"] if p["status"] == "approved"]
    if not todo:
        sys.exit("brak postów ze statusem „approved” — nic do wysłania")
    for post in todo:
        missing = [m for m in post.get("media", []) if not (week_dir / m).exists()]
        if missing:
            sys.exit(f"{post['id']}: brak plików {missing}")
    if dry_run:
        for p in todo:
            print(f"{p['id']}  {p['date']}  {'+'.join(p['platforms'])}  {len(p.get('media', []))} plik(ów)  "
                  f"„{p['caption'][:60]}…”")
        return

    k = key()
    chans = channels(k)
    for post in todo:
        lacking = [pl for pl in post["platforms"] if pl not in chans]
        if lacking:
            sys.exit(f"{post['id']}: w Postiz nie ma podłączonego profilu dla {lacking}")
    for post in todo:
        media = [upload(k, week_dir / m) for m in post.get("media", [])]
        body = {"type": "draft" if draft else "schedule", "date": post["date"], "shortLink": False, "tags": [],
                "posts": [{"integration": {"id": chans[pl]["id"]},
                           "value": [{"content": post["caption"], "image": media}],
                           "settings": {"__type": chans[pl]["provider"], **PROVIDERS[pl][1]}}
                          for pl in post["platforms"]]}
        result = request("POST", "/posts", k, json.dumps(body).encode(), {"Content-Type": "application/json"})
        post["postiz"] = result
        post["status"] = "scheduled"
        # Zapis po każdym poście — przerwany przebieg nie wyśle niczego drugi raz.
        plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{post['id']}  → Postiz ({'szkic' if draft else post['date']})")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = {a for a in sys.argv[1:] if a.startswith("--")}
    if args[:1] == ["channels"]:
        for platform, c in channels(key()).items():
            print(f"{platform:10} {c['provider']:22} {c['name']}  ({c['id']})")
    elif args[:1] == ["schedule"] and len(args) == 2:
        week_dir = pathlib.Path(args[1])
        schedule(week_dir if week_dir.is_absolute() else ROOT / week_dir, "--dry-run" in flags, "--draft" in flags)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
