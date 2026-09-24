#!/usr/bin/env python3
"""
Generuje ikony wypraw przez bramkę ToAPIs (gpt-image-2.5-flare).

Styl bierze z ikon doku (`assets/icons/tab-*.png`) podanych jako referencja —
miękkie, lekko trójwymiarowe obiekty na przezroczystym tle. Referencją jest
arkusz czterech ikon, a nie pojedyncza: jedna narzucałaby modelowi swój temat.

Tło generator odda jako białe; kanał alfa wycinamy później wypełnieniem od
krawędzi, tak samo jak przy klipach Timo.

Uruchom:  python3 scripts/generate-icons.py [<id> ...]
"""
import json, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2da9886d-0bc7-4a76-83e8-7cda509fd8ea.png")
OUT = pathlib.Path("assets/icons/_raw")

SKEL = """A single app icon in EXACTLY the same style as the reference image: a soft, gently three-dimensional toy-like object with rounded shapes, warm friendly colours, soft shading and a subtle outline. Children's app icon, cute and simple, readable at small size.

Subject: {S}.

One single object centred in the frame, seen from a slight three-quarter angle, filling most of the square with a small even margin. Plain pure white background, completely flat and empty, no shadow on the ground, no scenery, no frame, no border, no text, no letters, no watermark."""

SUBJECTS = {
 "water_friends":     "a friendly smiling dolphin leaping",
 "farm_timo":         "a cheerful spotted cow",
 "green_jungle":      "a colourful toucan on a leafy branch",
 "forest_kids":       "a cute hedgehog",
 "flyers":            "a bright butterfly with open wings",
 "night_animals":     "a round sleepy owl under a crescent moon",
 "big_animals":       "a friendly grey elephant",
 "small_animals":     "a tiny cute mouse",
 "scary_animals":     "a friendly lion head with a big mane",
 "ice_land":          "a chubby penguin on a small ice floe",
 "home_pets_friends": "a happy puppy dog",
 "feathered":         "a single colourful feather with a small bird",
 "furry":             "a cuddly brown bear",
 "bugs_and_worms":    "a cheerful bumblebee",
 "savanna_kids":      "a striped zebra",
 "jumpers":           "a kangaroo mid-hop",
 "swimmers":          "a bright orange fish",
 "monkey_friends":    "a playful little monkey",
 "striped_spotted":   "a friendly tiger cub",
 "long_nose":         "an anteater with a long snout",
 "water_giants":      "a big blue whale",
 "dinos_myths":       "a friendly green dinosaur",
 "shelled":           "a smiling turtle",
 "colorful":          "a rainbow-coloured macaw parrot",
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
    if not ids:
        print("wszystko juz pobrane"); return
    tasks = {}
    for i in ids:
        try:
            r = call("/images/generations", {
                "model": MODEL, "prompt": SKEL.format(S=SUBJECTS[i]),
                "size": "1:1", "resolution": "1k", "n": 1,
                "reference_images": [STYLE_REF]}, k)
            tasks[i] = r["id"]; print(f"  wyslano  {i:20} {r['id']}")
        except Exception as e:
            print(f"  BLAD     {i:20} {e}")
    print(f"\nzadan w kolejce: {len(tasks)}\n")
    done, t0 = 0, time.time()
    while tasks and time.time() - t0 < 1200:
        time.sleep(8)
        for i, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], OUT / f"{i}.png")
                tasks.pop(i); done += 1
                print(f"  gotowe   {i:20} ({int(time.time()-t0)}s)")
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {i:20} {r}"); tasks.pop(i)
    if tasks: print("\nnie zdazyly:", ", ".join(tasks))
    print(f"\npobrano {done}/{len(ids)}")

if __name__ == "__main__":
    main(sys.argv[1:] or list(SUBJECTS))
