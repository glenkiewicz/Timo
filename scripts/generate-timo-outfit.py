#!/usr/bin/env python3
"""
Lisek Timo w przebraniu pod wyprawę — klatka startowa dla filmów Kling.

Bierze tę samą klatkę, z której powstały animacje v2 (`timo-talk-start.png`),
i dokłada akcesoria pasujące do wyprawy, nie ruszając pozy ani kadru — tylko
wtedy filmy z przebranego liska dają się wyrównać do `timo-frame-ref.png`
i stoją w scenie dokładnie tam, gdzie zwykły lisek.

Akcesoria NIE mogą zasłaniać łap ani zmieniać ich ułożenia: animacje mówienia
różnią się od idle tylko buzią i ogonem, a zakryte łapy rozjechałyby pozę.

Wynik: assets/timo/outfits/<wyprawa>/start.png (biel, 720×1280).

Uruchom:  python3 scripts/generate-timo-outfit.py <wyprawa>
"""
import json, pathlib, sys, time, urllib.request, uuid

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
MASTER = pathlib.Path("assets/timo/character/timo-talk-start.png")
OUT = pathlib.Path("assets/timo/outfits")

BASE = (
    "Edit the reference image. Keep EXACTLY the same cute cartoon fox character, the same "
    "rendering style, colours, proportions, facial expression, the same standing pose with "
    "both paws relaxed at the sides, the same position, size and framing in the image, and the "
    "same plain pure white background. Do NOT move the character, do NOT change the pose, do "
    "NOT cover the paws or the arms. Only add these accessories: {A}. Full body visible, no "
    "shadow, no floor, no text."
)

OUTFITS = {
    "water_friends": (
        "a light blue diving mask pushed up on the forehead with a small yellow snorkel "
        "attached to its side, and the green bandana stays around the neck"
    ),
}


def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")


def request(method, path, k, body=None, headers=None):
    req = urllib.request.Request(API + path, data=body, method=method,
                                 headers={"Authorization": f"Bearer {k}", **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} dla {path}: {e.read().decode()[:300]}")


def upload(k, path):
    boundary = uuid.uuid4().hex
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{path.name}\"\r\n"
            f"Content-Type: image/png\r\n\r\n").encode() + path.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    return request("POST", "/uploads/images", k, body,
                   {"Content-Type": f"multipart/form-data; boundary={boundary}"})["data"]["url"]


def main(exp):
    k = key()
    ref = upload(k, MASTER)
    r = request("POST", "/images/generations", k, json.dumps({
        "model": MODEL, "prompt": BASE.format(A=OUTFITS[exp]), "size": "9:16",
        "resolution": "1k", "n": 1, "reference_images": [ref]}).encode(),
        {"Content-Type": "application/json"})
    tid = r["id"]
    print(f"  wyslano  {exp}  {tid}", flush=True)
    t0 = time.time()
    while time.time() - t0 < 600:
        time.sleep(8)
        s = request("GET", f"/images/generations/{tid}", k)
        if s.get("status") == "completed":
            out = OUT / exp
            out.mkdir(parents=True, exist_ok=True)
            req = urllib.request.Request(s["result"]["data"][0]["url"], headers={"User-Agent": "timo-assets/1.0"})
            with urllib.request.urlopen(req, timeout=180) as rr:
                (out / "raw.png").write_bytes(rr.read())
            print(f"  gotowe   {out / 'raw.png'}")
            return
        if s.get("status") in ("failed", "cancelled"):
            sys.exit(f"PADLO: {s}")


if __name__ == "__main__":
    main(sys.argv[1])
