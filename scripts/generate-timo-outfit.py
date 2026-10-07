#!/usr/bin/env python3
"""
Lisek Timo w przebraniu pod wyprawę — klatka startowa dla filmów Kling.

Bierze tę samą klatkę, z której powstały animacje v2 (`timo-talk-start.png`),
i dokłada akcesoria pasujące do wyprawy, nie ruszając pozy ani kadru — tylko
wtedy filmy z przebranego liska dają się wyrównać do `timo-frame-ref.png`
i stoją w scenie dokładnie tam, gdzie zwykły lisek.

Akcesoria NIE mogą zasłaniać łap ani zmieniać ich ułożenia: animacje mówienia
różnią się od idle tylko buzią i ogonem, a zakryte łapy rozjechałyby pozę.

Wynik: assets/timo/outfits/<wyprawa>/start.png (biel, 720×1280). Istniejące pomija.

Uruchom:  python3 scripts/generate-timo-outfit.py [<wyprawa> ...]   (bez argumentów: wszystkie brakujące)
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
    "water_friends": "a light blue diving mask pushed up on the forehead with a small yellow snorkel attached to its side",
    "farm_timo": "a straw farmer hat with a small wheat stalk tucked into its band",
    "green_jungle": "a crown of bright tropical leaves on the head and a pink hibiscus flower behind one ear",
    "forest_kids": "a small brown forest-ranger hat with an oak leaf and an acorn pinned to its band",
    "flyers": "a brown leather aviator cap with round pilot goggles pushed up on the forehead",
    "night_animals": "a soft dark blue nightcap with little yellow stars and a crescent moon, its tip with a pompom",
    "big_animals": "an orange explorer hard hat and a yellow measuring tape hanging loosely around the neck",
    "small_animals": "a small round magnifying monocle over one eye and a tiny green cap",
    "scary_animals": "a short red superhero cape tied at the neck, falling behind the back",
    "ice_land": "a knitted red winter hat with a white pompom and a striped blue winter scarf",
    "home_pets_friends": "a small blue pet collar with a shiny golden heart-shaped tag",
    "feathered": "a colourful feather tucked behind one ear and a small birdwatcher bucket hat",
    "furry": "fluffy soft white earmuffs",
    "bugs_and_worms": "a headband with two springy antennae ending in little red balls",
    "savanna_kids": "a white safari pith helmet and a pair of small binoculars hanging on a strap on the chest",
    "jumpers": "a headband with two tall soft kangaroo ears in light brown, standing up between the fox ears",
    "swimmers": "a red-and-white striped lifeguard visor and a silver whistle on a cord around the neck",
    "monkey_friends": "a yellow bucket hat with a small banana pattern",
    "striped_spotted": "a black-and-orange striped knitted beanie and a spotted polka-dot bow tie",
    "long_nose": "a pair of round glasses resting on the snout and a tiny brass trumpet on a cord around the neck",
    "water_giants": "a navy-blue sea captain's hat with a golden anchor badge",
    "dinos_myths": "a headband with big, clearly visible bright green triangular dinosaur spikes running in a row over the top of the head",
    "shelled": "a cute cap shaped like a green turtle shell with a hexagon pattern, worn on top of the head",
    "colorful": "a painter's beret with rainbow paint splashes",
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


def normalize(raw, out):
    """Biel do krawędzi, 720×1280 — format klatki startowej dla Klinga."""
    import numpy as np, cv2
    from PIL import Image
    im = Image.open(raw).convert("RGB").resize((720, 1280), Image.LANCZOS)
    a = np.asarray(im).astype(int)
    chroma, bright = a.max(2) - a.min(2), a.max(2)
    cand = ((chroma <= 14) & (bright >= 150)).astype(np.uint8)
    _, lab = cv2.connectedComponents(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = (~np.isin(lab, list(border))).astype(np.uint8)
    _, l2, st, _ = cv2.connectedComponentsWithStats(fg)
    keep = cv2.GaussianBlur((l2 == (1 + np.argmax(st[1:, 4]))).astype(np.float32), (3, 3), 0)[..., None]
    Image.fromarray((a * keep + 255 * (1 - keep)).astype(np.uint8)).save(out)


def main(exps):
    k = key()
    ref = upload(k, MASTER)
    tasks = {}
    for exp in exps:
        if (OUT / exp / "start.png").exists():
            continue
        r = request("POST", "/images/generations", k, json.dumps({
            "model": MODEL, "prompt": BASE.format(A=OUTFITS[exp] + ", and the green bandana stays around the neck"),
            "size": "9:16", "resolution": "1k", "n": 1, "reference_images": [ref]}).encode(),
            {"Content-Type": "application/json"})
        tasks[exp] = r["id"]
        print(f"  wyslano  {exp}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for exp, tid in list(tasks.items()):
            try:
                s = request("GET", f"/images/generations/{tid}", k)
            except SystemExit:
                continue
            if s.get("status") == "completed":
                out = OUT / exp
                out.mkdir(parents=True, exist_ok=True)
                req = urllib.request.Request(s["result"]["data"][0]["url"], headers={"User-Agent": "timo-assets/1.0"})
                with urllib.request.urlopen(req, timeout=180) as rr:
                    (out / "raw.png").write_bytes(rr.read())
                normalize(out / "raw.png", out / "start.png")
                (out / "raw.png").unlink()
                tasks.pop(exp)
                print(f"  gotowe   {exp}", flush=True)
            elif s.get("status") in ("failed", "cancelled"):
                print(f"  PADLO    {exp}: {str(s)[:200]}", flush=True)
                tasks.pop(exp)


if __name__ == "__main__":
    main(sys.argv[1:] or list(OUTFITS))
