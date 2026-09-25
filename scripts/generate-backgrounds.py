#!/usr/bin/env python3
"""
Generuje tła wypraw przez bramkę ToAPIs (model gpt-image-2.5-flare).

Prompty składa z tego samego szkieletu, co `docs/prompts-expedition-backgrounds.md`.
Referencją stylu jest istniejące tło leśne pod publicznym URL-em — bramka NIE
przyjmuje base64, więc obrazek musi być osiągalny z sieci.

API jest asynchroniczne: POST zwraca `task_id`, potem odpytujemy o status.
Wysyłamy wszystkie zadania naraz, dopiero potem czekamy — inaczej 14 obrazów
schodziłoby po kolei.

Uruchom:  python3 scripts/generate-backgrounds.py <id> [<id> ...]
"""
import json, os, sys, time, urllib.request, pathlib, re

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2d0a1f67-13b7-4854-ac5f-cc284c6da835.png")
OUT = pathlib.Path("assets/backgrounds/_raw")

SKEL = """Children's book illustration background in EXACTLY the same flat painterly vector style, palette, brushwork and lighting as the reference image: soft gouache shading, clean rounded shapes, gentle soft outlines, warm but not oversaturated colours, no photorealism, no 3D-looking gradients.

Scene: {A}. Vertical portrait composition.
- Top area: {B}.
- Middle: {C}.
- Tall framing elements ONLY at the extreme left and right edges, leaving a wide open view through the middle.
- At about 54% of the image height the middle ground ends and an open {D} begins, running horizontally across the whole frame.
- Bottom 46% of the image: a wide, open, gently textured {D}, almost EMPTY - only a few small details near the left and right edges. The centre stays completely clear and uncluttered.

No animals, no people, no characters, no text, no watermark, no UI elements."""

SCENES = {
 "home_pets_friends": ("a cosy back garden behind a family house","soft blue sky with a few small clouds above the rooftop","a wooden porch with a swing, a little doghouse, flowerbeds, a white picket fence, a washing line","mown green lawn"),
 "feathered": ("a woodland edge full of birds' nests","open pale sky between the branches","birches and pines holding woven nests, a hollow trunk, soft feathers drifting down, a wooden birdhouse","green grass"),
 "furry": ("an autumn woodland in warm afternoon light","warm hazy sky glimpsed through an orange canopy","orange and red treetops, fallen leaves drifting, a cosy burrow between thick roots, acorns and pinecones","green ground thickly covered with fallen leaves"),
 "bugs_and_worms": ("a flower garden seen from close to the soil","a small patch of bright sky above the flower heads","huge daisies and poppies towering overhead, a wooden beehive, dewdrops on big glossy leaves, a curled fern","dark garden soil with patches of moss"),
 "savanna_kids": ("an African savanna at golden hour","warm golden sky with soft haze near the horizon","flat-topped acacia trees, a distant line of blue hills, tall dry grass catching the light, a termite mound","green-gold savanna grass, deep enough not to look pale"),
 "jumpers": ("a rocky outcrop above springy open grassland","wide pale blue sky with thin clouds","big rounded boulders stacked at the sides, tussock grass, low scrub, distant flat plains","springy green turf"),
 "swimmers": ("a calm river bank with clear shallow water","soft blue sky above willow branches","tall reeds, water lilies on a slow green river, a small wooden jetty, drooping willow branches","green river bank"),
 "monkey_friends": ("a jungle canopy high among the tree tops","warm light filtering down through layers of leaves","thick hanging lianas, huge mossy branches crossing the frame, big tropical leaves, glimpses of forest far below","broad mossy branch forming a wide flat platform"),
 "striped_spotted": ("a sunlit clearing filled with dappled light","bright sky broken by overlapping leaves","tall grass, slender trees casting long striped shadows across the scene, warm patches of light on the ground","dappled green grass with soft shadow stripes"),
 "long_nose": ("a watering hole on a warm open plain","hazy warm sky with soft clouds near the horizon","a shallow muddy pool with reeds around it, a few palms, cracked earth at the water's edge, distant flat hills","green-brown ground"),
 "water_giants": ("a wild ocean coast with high cliffs","big open sky with wind-torn clouds","tall dark cliffs on both sides, deep blue open sea stretching to the horizon, white spray on rocks","wet dark sand"),
 "dinos_myths": ("a prehistoric valley full of giant ferns","misty sky with a smoking volcano far in the distance","huge tree ferns and cycads, layered misty ridges, steaming ground vents, primitive horsetail plants","deep green ferny ground"),
 "shelled": ("a rocky beach with shallow tide pools","soft blue sky with light clouds over a calm sea","large round boulders, clear tide pools reflecting the sky, seaweed draped on rock, a calm sea behind","damp grey-green rock and coarse sand, clearly darker than the sky"),
 # ---- krainy kolekcji, które dotąd pożyczały tła wypraw tematycznych ----
 "region_mountains": ("a high mountain meadow below snowy peaks","clear cool blue sky above jagged snow-capped peaks","grey rocky slopes, dark fir trees and a few scattered boulders, a thin waterfall on a distant cliff, patches of snow","alpine meadow grass with small wildflowers"),
 "region_asia": ("an Asian valley with bamboo and rice terraces","soft warm sky with a pale misty mountain far away","tall bamboo groves at the edges, green stepped rice terraces on a hillside, a small red torii-style gate, a pink cherry-blossom tree","soft green grass"),
 "region_australia": ("the Australian outback at warm afternoon light","wide pale blue sky over a distant red rock monolith","red earth, silvery eucalyptus trees with pale trunks, spinifex grass tufts, low dusty bushes","reddish-brown outback ground with sparse dry grass"),
 "colorful": ("a bright tropical flower garden","clear blue sky with a soft rainbow arc","hibiscus, orchids and heliconia in strong colours, big glossy leaves, a stone path curving away","green garden grass"),
}

def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")

def fetch_file(url, dest):
    """Bramka odrzuca domyslny User-Agent urllib (403), wiec podajemy wlasny."""
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
    if not ids:
        print("wszystko juz pobrane"); return
    tasks = {}
    for i in ids:
        A, B, C, D = SCENES[i]
        try:
            r = call("/images/generations", {
                "model": MODEL, "prompt": SKEL.format(A=A, B=B, C=C, D=D),
                "size": "9:16", "resolution": "1k", "n": 1,
                "reference_images": [STYLE_REF]}, k)
            tasks[i] = r["id"]; print(f"  wyslano  {i:20} {r['id']}")
        except Exception as e:
            print(f"  BLAD     {i:20} {e}")
    print(f"\nzadan w kolejce: {len(tasks)}\n")

    done, t0 = {}, time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for i, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                url = r["result"]["data"][0]["url"]
                p = OUT / f"{i}.png"
                fetch_file(url, p)
                done[i] = p; tasks.pop(i)
                print(f"  gotowe   {i:20} {p.stat().st_size//1024} KB  ({int(time.time()-t0)}s)")
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {i:20} {r}"); tasks.pop(i)
    if tasks:
        print("\nnie zdazyly:", ", ".join(tasks))
    print(f"\npobrano {len(done)}/{len(ids)}")

if __name__ == "__main__":
    main(sys.argv[1:] or list(SCENES))
