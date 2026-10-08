#!/usr/bin/env python3
"""
Awatary dzieci — 12 portretów zwierząt w stylu kolekcji (pluszowy, miękki 3D).

Referencją każdego awatara jest grafika TEGO SAMEGO zwierzęcia z kolekcji
(assets/animals/<id>.webp), więc awatar wygląda jak z tej samej rodziny,
tylko kadrowany na głowę: rysujemy go w kółku na ekranie wyboru i profili.

Wynik: assets/avatars/_raw/<id>-<n>.png → po wyborze assets/avatars/<id>.webp
(320 px, kremowe tło zostaje — awatar zawsze rysujemy w kółku).

Uruchom:  python3 scripts/generate-avatars.py [--variants=1] [<id> ...]
"""
import importlib.util, io, json, pathlib, sys, time, urllib.request

from PIL import Image

spec = importlib.util.spec_from_file_location("outfit", "scripts/generate-timo-outfit.py")
outfit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(outfit)

OUT = pathlib.Path("assets/avatars/_raw")
TMP = pathlib.Path("/tmp/timo-avatar-refs")

# id awatara → grafika z kolekcji jako referencja
AVATARS = {
    "fox": "fox",
    "bear": "brown_bear",
    "bunny": "rabbit",
    "cat": "cat",
    "dog": "dog",
    "panda": "panda",
    "owl": "owl",
    "lion": "lion",
    "koala": "koala",
    "penguin": "king_penguin",
    "unicorn": "unicorn",
    "hedgehog": "hedgehog",
}

PROMPT = (
    "Use the reference image for the character and the rendering style: the same cute soft "
    "felt / plush 3D children's illustration style and the same animal. Draw a round avatar "
    "portrait: ONLY the head and the top of the shoulders, facing the viewer, big friendly eyes, "
    "happy closed-mouth smile, centred and filling most of the square frame. The whole background "
    "is ONE flat plain warm cream colour #FDF5EC edge to edge — no circle, no frame, no border, no "
    "shadow on the background, no text."
)


def ref_png(animal: str) -> pathlib.Path:
    """Grafika z kolekcji ma przezroczyste tło — model lepiej działa na białym."""
    TMP.mkdir(parents=True, exist_ok=True)
    out = TMP / f"{animal}.png"
    im = Image.open(f"assets/animals/{animal}.webp").convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    bg.convert("RGB").save(out)
    return out


def main(ids, variants):
    k = outfit.key()
    OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for aid in ids:
        ref = outfit.upload(k, ref_png(AVATARS[aid]))
        for n in range(1, variants + 1):
            if (OUT / f"{aid}-{n}.png").exists():
                continue
            r = outfit.request("POST", "/images/generations", k, json.dumps({
                "model": outfit.MODEL, "prompt": PROMPT, "size": "1:1", "resolution": "1k",
                "n": 1, "reference_images": [ref]}).encode(), {"Content-Type": "application/json"})
            tasks[f"{aid}-{n}"] = r["id"]
            print(f"  wyslano  {aid}-{n}", flush=True)
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
    v = next((int(a.split("=")[1]) for a in sys.argv[1:] if a.startswith("--variants=")), 1)
    main(args or list(AVATARS), v)
