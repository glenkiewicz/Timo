#!/usr/bin/env python3
"""
Elementy interfejsu kolekcji — chatka Timo, generowane przez ToAPIs.

Ekran składamy z GRAFIK, a nie z kolorowych prostokątów. Pierwsza wersja
rysowała półki `View`-ami i wyglądała jak szkic, nie jak wybrany projekt.

Każdy element powstaje osobno na białym tle, a alfę wycinamy `matte.cutout_raw`
— bez docinania do sylwetki, bo deska i rama muszą zachować własne proporcje.

Uruchom:  python3 scripts/generate-ui-kit.py [<nazwa> ...]
"""
import json, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-sunburst"
REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
       "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/b76f2b79-f6f3-4c70-9e45-fbfce88fc6f5.png")
OUT = pathlib.Path("assets/ui/_raw")

STYLE = ("Single game UI asset in exactly the same warm children's-book style as the "
         "reference image: soft rounded shapes, warm wood tones, gentle shading, "
         "clean flat illustration, no photorealism. ")

PIECES = {
 "wall": (STYLE + "A vertical wooden plank wall of a cosy log cabin, warm honey-brown "
          "timber with soft grain and subtle seams between the planks. Even lighting, "
          "completely EMPTY — no shelves, no objects, no furniture, no text. The texture "
          "fills the whole frame edge to edge.", "9:16"),

 "shelf": (STYLE + "A single horizontal wooden shelf board seen slightly from above, "
           "spanning the full width of the frame, with a visible front edge and a darker "
           "underside. Nothing standing on it. Plain pure white background around the "
           "board, no wall, no brackets, no text.", "3:2"),

 "cabinet": (STYLE + "An empty wooden display cabinet with a glass front and a soft brass "
             "latch, seen straight on. The inside is EMPTY and light, ready for figurines "
             "to be placed in it later. Plain pure white background around the cabinet, "
             "no wall, no shadow, no text.", "4:3"),

 "pedestal": (STYLE + "A small round wooden display pedestal for a figurine, seen slightly "
              "from above, like a low turned-wood disc with a soft bevel. Nothing on it. "
              "Plain pure white background, no shadow, no text.", "1:1"),

 "plate": (STYLE + "A long horizontal brass name plate with two small screws at the ends "
           "and a soft bevelled edge, completely BLANK with no engraving and no letters. "
           "Plain pure white background, no shadow.", "16:9"),

 "lantern": (STYLE + "A small hanging lantern with warm glowing light and a dark green "
             "metal frame, hanging from a short chain. Plain pure white background, no "
             "shadow, no text.", "2:3"),

 "plant": (STYLE + "A potted green houseplant with broad leaves in a cream ceramic pot "
           "decorated with a small paw print. Plain pure white background, no shadow, "
           "no text.", "2:3"),
}


def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")


def fetch_file(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r, open(dest, "wb") as f:
        f.write(r.read())


def call(path, payload=None, k=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode() if payload else None,
        headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"},
        method="POST" if payload else "GET")
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def main(names):
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for n in names:
        prompt, ratio = PIECES[n]
        r = call("/images/generations", {
            "model": MODEL, "prompt": prompt, "size": ratio,
            "resolution": "1k", "n": 1, "reference_images": [REF]}, k)
        tasks[n] = r["id"]
        print(f"  wyslano  {n:10} {r['id']}", flush=True)

    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for n, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], OUT / f"{n}.png")
                tasks.pop(n); print(f"  gotowe   {n:10} ({int(time.time()-t0)}s)", flush=True)
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {n:10} {r.get('error', {}).get('message','')[:70]}", flush=True)
                tasks.pop(n)


if __name__ == "__main__":
    main(sys.argv[1:] or list(PIECES))
