#!/usr/bin/env python3
"""
Ilustracje kart onboardingu — Timo w małych scenkach na gładkim kremowym tle
(`UI.page` = #fdf5ec), żeby ilustracja zlewała się z tłem ekranu jak w Finchu.

Ten sam lisek co w grze: referencją jest klatka startowa animacji
(`timo-talk-start.png`), a upload i odpytywanie bierzemy z generatora przebrań.

Wynik: assets/onboarding/_raw/<scena>-<n>.png (warianty do wyboru),
po wyborze kopiujemy zwycięzcę do assets/onboarding/<scena>.png.

Uruchom:  python3 scripts/generate-onboarding-art.py [--variants=2] [<scena> ...]
"""
import importlib.util, json, pathlib, sys, time, urllib.request

spec = importlib.util.spec_from_file_location("outfit", "scripts/generate-timo-outfit.py")
outfit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(outfit)

OUT = pathlib.Path("assets/onboarding/_raw")

STYLE = (
    "Use the reference image only for the character: the SAME cute cartoon fox Timo — same "
    "soft 3D children's-animation rendering, orange fur, cream chest and muzzle, dark brown "
    "paws and ear tips, big brown eyes, green bandana around the neck. Square illustration for "
    "a children's app onboarding screen. Scene: {S}. The whole background is ONE flat plain "
    "warm cream colour #FDF5EC edge to edge — no frame, no border, no gradient, no floor line, "
    "no text, no letters. Soft gentle contact shadow under the character only. Friendly, calm, "
    "lots of empty space around the scene, character centred and fully visible."
)

SCENES = {
    "hello": "Timo stands and waves hello with one paw, big happy smile, a few small floating "
             "orange paw-print shapes and green leaves around him",
    "guess": "Timo leans forward holding a big round magnifying glass, studying a trail of animal "
             "paw prints on the ground, three small soft question marks floating above his head",
    "ways": "Timo with a small explorer backpack holds an unfolded treasure map, next to a little "
            "wooden signpost with three arrows",
    "collect": "Timo proudly holds an open picture album full of cute animal stickers (a dolphin, "
               "an elephant, a parrot, a turtle), two shiny golden medal badges float beside him",
    "parent": "Timo gently hugs a big soft rounded shield with a red heart on it, calm and "
              "reassuring smile",
    "paywall": "Timo sits happily next to a big open wooden treasure chest that glows softly "
               "and is full of colourful animal picture cards and a few golden stars spilling out, "
               "he holds one card up proudly",
}

# Ekran „wyklucia” — bez liska (lisek to animacja wideo, która z tej sterty wyskakuje).
PROPS = {
    "leaf-pile": "a big round cosy pile of autumn leaves in orange, red, yellow and a few green "
                 "leaves, seen from the front, wide and fairly low, nothing else in the picture",
    "leaves": "exactly six separate single autumn leaves (two orange, two red, one yellow, one "
              "green) scattered with lots of empty space between them, none touching or "
              "overlapping, nothing else in the picture",
}
PROP_STYLE = (
    "Same soft 3D children's-animation rendering style as the reference picture of the fox, but "
    "WITHOUT the fox — no character at all. Square illustration: {S}. The whole background is ONE "
    "flat plain warm cream colour #FDF5EC edge to edge — no frame, no border, no gradient, no "
    "floor line, no shadow, no text."
)


def main(names, variants):
    k = outfit.key()
    ref = outfit.upload(k, outfit.MASTER)
    OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for name in names:
        for n in range(1, variants + 1):
            if (OUT / f"{name}-{n}.png").exists():
                continue
            prompt = STYLE.format(S=SCENES[name]) if name in SCENES else PROP_STYLE.format(S=PROPS[name])
            r = outfit.request("POST", "/images/generations", k, json.dumps({
                "model": outfit.MODEL, "prompt": prompt,
                "size": "1:1", "resolution": "1k", "n": 1, "reference_images": [ref]}).encode(),
                {"Content-Type": "application/json"})
            tasks[f"{name}-{n}"] = r["id"]
            print(f"  wyslano  {name}-{n}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for tag, tid in list(tasks.items()):
            try:
                s = outfit.request("GET", f"/images/generations/{tid}", k)
            except SystemExit:
                continue
            if s.get("status") == "completed":
                req = urllib.request.Request(s["result"]["data"][0]["url"], headers={"User-Agent": "timo-assets/1.0"})
                with urllib.request.urlopen(req, timeout=180) as rr:
                    (OUT / f"{tag}.png").write_bytes(rr.read())
                tasks.pop(tag)
                print(f"  gotowe   {tag}", flush=True)
            elif s.get("status") in ("failed", "cancelled"):
                print(f"  PADLO    {tag}: {str(s)[:200]}", flush=True)
                tasks.pop(tag)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    v = next((int(a.split("=")[1]) for a in sys.argv[1:] if a.startswith("--variants=")), 2)
    main(args or list(SCENES), v)
