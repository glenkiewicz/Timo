#!/usr/bin/env python3
"""
Pojedyncze tła ekranów — ten sam język, co tła wypraw.

Wspólna zasada: nad tłem stoi ZAWARTOŚĆ, więc środek kadru ma zostać pusty
i niskokontrastowy. Tła wypraw mogą być mocne, bo nad nimi jest tylko Timo
i dymek; tła ekranów z siatką czy karuzelą muszą ustąpić.

Uruchom:  python3 scripts/generate-bg.py <nazwa> [<nazwa> ...]
"""
import json, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2da9886d-0bc7-4a76-83e8-7cda509fd8ea.png")
OUT = pathlib.Path("assets/backgrounds/_raw")

STYLE = ("children's book background illustration in the same warm style as the "
         "reference image. No animals, no characters, no text, no frame, no vignette. ")

PROMPTS = {
 # Ekran Kolekcji — pod karuzelę krain w mocnych kolorach.
 "collection": (
  "A soft, very light " + STYLE +
  "A calm distant landscape seen from far away: a pale cream-and-mint sky filling most "
  "of the frame, a low band of gentle rolling hills and soft rounded treetops along the "
  "very bottom, a few small pale clouds near the top. VERY LOW CONTRAST and desaturated, "
  "washed out, like a faded watercolour wash — this is only a backdrop. The entire MIDDLE "
  "of the image is empty open sky with nothing in it."),

 # Kraina Ocean. Poprzednie tło było PLAŻĄ — piach zajmował większość kadru,
 # więc ekran nie czytał się jako ocean.
 "ocean": (
  "An underwater " + STYLE +
  "An open ocean seen from below the surface: bright turquoise water at the top with "
  "sunbeams coming down through the surface, deepening to a calm deep blue towards the "
  "bottom, a few pale bubbles and soft light rays. A hint of sandy seabed with gentle "
  "ripples along the very bottom edge only. NO beach, NO sand dunes, NO shoreline, "
  "NO trees, NO horizon line. The middle of the frame is open water, uncluttered and "
  "low contrast."),
}


def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")


def call(path, payload, k):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode() if payload else None,
        headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"},
        method="POST" if payload else "GET")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code}: {e.read().decode()[:300]}")


def main(names):
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for n in names:
        r = call("/images/generations", {
            "model": MODEL, "prompt": PROMPTS[n], "size": "9:16",
            "resolution": "1k", "n": 1, "reference_images": [STYLE_REF]}, k)
        tasks[n] = r["id"]; print(f"  wyslano  {n:12} {r['id']}", flush=True)

    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for n, tid in list(tasks.items()):
            s = call(f"/images/generations/{tid}", None, k)
            if s.get("status") == "completed":
                url = s["result"]["data"][0]["url"]
                req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
                dest = OUT / f"{n}.png"
                with urllib.request.urlopen(req, timeout=180) as rr, open(dest, "wb") as f:
                    f.write(rr.read())
                tasks.pop(n)
                print(f"  gotowe   {n:12} ({int(time.time()-t0)}s)", flush=True)
            elif s.get("status") in ("failed", "cancelled"):
                tasks.pop(n); print(f"  PADLO    {n:12} {s.get('error')}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1:] or list(PROMPTS))
