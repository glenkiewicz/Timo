#!/usr/bin/env python3
"""
Szerokie ilustracje na stronę zgadujztimo.pl przez bramkę ToAPIs — ten sam
model i ta sama referencja stylu co tła wypraw (scripts/generate-backgrounds.py).
Tła z aplikacji są pionowe (9:16), a strona na komputerze potrzebuje poziomych.

Uruchom:  python3 scripts/generate-landing-art.py [<id> ...]
Wynik:    site/_raw/<id>.png  (potem optymalizacja do site/assets/img/)
"""
import json, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2d0a1f67-13b7-4854-ac5f-cc284c6da835.png")
OUT = pathlib.Path("site/_raw")

STYLE = """Children's book illustration in EXACTLY the same flat painterly vector style, palette, brushwork and lighting as the reference image: soft gouache shading, clean rounded shapes, gentle soft outlines, warm but not oversaturated colours, no photorealism, no 3D-looking gradients. No animals, no people, no characters, no text, no watermark, no UI elements."""

ART = {
 "hero-meadow": ("16:9", STYLE + """

Wide horizontal landscape: a sunny forest meadow in late morning. Soft blue sky with a few round clouds and a warm sun in the upper right. Leafy deciduous trees and ferns framing the far left and far right edges, rolling green hills and a distant blue tree line in the middle. The bottom third is an open, gently textured green lawn with a few small wildflowers and a couple of red toadstools near the edges. The centre of the image stays open and uncluttered."""),
 "expeditions-panorama": ("21:9", STYLE + """

Very wide horizontal panorama that changes biome smoothly from left to right, like one continuous journey: on the far left a calm turquoise ocean shore with a rocky beach, then a lush green jungle with big leaves and lianas, then a golden African savanna with flat-topped acacia trees, then a cosy farm with a red barn and wooden fence, and on the far right a snowy icy land with soft white hills. One continuous green-to-golden ground line runs across the whole bottom. Soft sky with light clouds across the top. Calm, readable, not busy."""),

 "hero-world": ("4:3", STYLE + """

Bird's-eye view, slightly tilted, of a cute small island world floating in a calm turquoise sea, like a children's adventure game map. On the island: a green forest with round trees, a golden savanna with flat-topped acacias, a small red farm, a patch of jungle with big leaves, and snowy hills at one end, all connected by a winding sandy path with little wooden bridges and signposts. A few tiny islets around. Soft light blue sky with light haze at the very top. The middle third of the image is calm and not too detailed (a phone will be placed over it)."""),
 "cta-forest": ("16:9", STYLE + """

Wide horizontal scene: a sunny forest clearing. On the far left a big old oak tree with a cosy fox den between its roots and a small round wooden door. On the far right a wooden signpost with three arrow-shaped boards pointing right, the boards are painted in orange, green and blue and are EMPTY with no letters. A sandy path winds from the bottom centre into the forest. Red toadstools, ferns, a few flowers, a magnifying glass lying in the grass near the path. Soft blue sky at the top. The centre of the image stays open (a phone will be placed there)."""),
 "sky-clouds": ("21:9", STYLE + """

Very wide horizontal strip: soft pale blue sky fading to almost white at the top, a few big fluffy round clouds, and at the very bottom a row of round green treetops and bushes forming a soft wavy edge. Calm and simple, mostly empty sky."""),
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

def main(ids):
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    ids = [i for i in ids if not (OUT / f"{i}.png").exists()]
    tasks = {}
    for i in ids:
        size, prompt = ART[i]
        try:
            r = call("/images/generations", {"model": MODEL, "prompt": prompt, "size": size,
                     "resolution": "2k", "n": 1, "reference_images": [STYLE_REF]}, k)
            tasks[i] = r["id"]; print(f"  wyslano  {i:22} {r['id']}", flush=True)
        except Exception as e:
            print(f"  BLAD     {i:22} {e}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for i, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                p = OUT / f"{i}.png"; fetch_file(r["result"]["data"][0]["url"], p); tasks.pop(i)
                print(f"  gotowe   {i:22} {p.stat().st_size//1024} KB ({int(time.time()-t0)}s)", flush=True)
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {i:22} {r}", flush=True); tasks.pop(i)
    if tasks: print("nie zdazyly:", ", ".join(tasks))

if __name__ == "__main__":
    main(sys.argv[1:] or list(ART))
