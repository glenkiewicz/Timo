#!/usr/bin/env python3
"""
Ujęcia 3D (AI) do reklamy TikTok nr 2 „Poznaj Timo” — przez ToAPIs.

  intro   — Timo wyskakuje ze sterty jesiennych liści i macha (bez stroju)
  safari  — w kasku na sawannie, za nim żyrafa
  polar   — w czapce i szaliku wśród śniegu, obok pingwin
  jungle  — w wianku z kwiatem w dżungli, papuga na gałęzi

Dwa etapy, żeby nie palić kredytów na zły kadr:
  stills  — kadry startowe 9:16 (gpt-image z referencją stroju)
  videos  — ujęcia z kadrów (Kling v3 pro, 5 s, 9:16)

Film z tymi ujęciami wymaga na TikToku etykiety „treść AI” (brand.md, zasada 4).
Wynik: marketing/out/ad-02/<ujęcie>-still.png, <ujęcie>.mp4

Uruchom:  python3 scripts/marketing/make-ad-02-3d.py stills|videos [<ujęcie> ...] [--force]
"""
import importlib.util, json, pathlib, sys

spec = importlib.util.spec_from_file_location("promo", "scripts/generate-promo.py")
promo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(promo)
outfit = promo.outfit

OUT = pathlib.Path("marketing/out/ad-02")
OUTFITS = pathlib.Path("assets/timo/outfits")

STYLE = (
    "Vertical 9:16 frame from a high-end 3D animated family film, soft volumetric light, rich colours, "
    "shallow depth of field. The character is EXACTLY the cute cartoon fox from the reference image — "
    "same face, big brown eyes, orange fur, cream chest, dark brown paws, green bandana{O}. "
    "No text, no letters, no logos, no watermark. Scene: {S} The fox fills the lower 60% of the frame; "
    "the top 30% is calm background (room for captions)."
)

# ujęcie → (referencja, strój w opisie, scena, ruch)
SHOTS = {
    "intro": (
        promo.MASTER, "",
        "a big round pile of colourful autumn leaves in a cosy sunlit forest glade, the fox has just burst "
        "out of the top of the pile with arms raised, leaves flying around him, big happy smile.",
        "The fox bursts up out of the leaf pile, dozens of orange, red and yellow leaves fly into the air in "
        "slow motion and flutter down. He lands, looks straight into the camera and waves hello with a big "
        "warm smile. Stable framing, gentle push-in.",
    ),
    "safari": (
        OUTFITS / "savanna_kids/start.png", ", white safari pith helmet and small binoculars",
        "a golden African savanna at sunset, acacia tree, a friendly giraffe in the background.",
        "The fox lifts the binoculars, then lowers them and beams with excitement as the giraffe behind him "
        "turns its head. Warm golden light, grass sways, slow parallax camera move.",
    ),
    "polar": (
        OUTFITS / "ice_land/start.png", ", red knitted bobble hat and blue striped scarf",
        "a sparkling snowy polar landscape with ice floes and soft falling snowflakes, a cute penguin "
        "standing next to him.",
        "Snowflakes fall gently. The penguin waddles closer and the fox laughs and waves at it, his scarf "
        "fluttering in the breeze. Slow cinematic camera move, stable framing.",
    ),
    "jungle": (
        OUTFITS / "green_jungle/start.png", ", wreath of jungle leaves with a pink hibiscus flower on his head",
        "a lush green tropical jungle with hanging vines and sunbeams, a colourful parrot on a branch "
        "beside him.",
        "The parrot flaps its wings and hops onto the branch closer to the fox. The fox turns to the camera "
        "and gives a big joyful wave. Leaves sway, light rays shimmer, slow push-in.",
    ),
}


def stills(names, force):
    k = outfit.key()
    tasks = {}
    for name in names:
        dest = OUT / f"{name}-still.png"
        if dest.exists() and not force:
            continue
        ref, o, scene, _ = SHOTS[name]
        r = outfit.request("POST", "/images/generations", k, json.dumps({
            "model": outfit.MODEL, "prompt": STYLE.format(O=o, S=scene), "size": "9:16",
            "resolution": "2k", "n": 1, "reference_images": [outfit.upload(k, ref)]}).encode(),
            {"Content-Type": "application/json"})
        tasks[dest] = r["id"]
        print(f"  wyslano  {name}", flush=True)
    promo.poll(k, tasks, "/images/generations", lambda r: r["result"]["data"][0]["url"])


def videos(names, force):
    k = outfit.key()
    tasks = {}
    for name in names:
        dest, src = OUT / f"{name}.mp4", OUT / f"{name}-still.png"
        if (dest.exists() and not force) or not src.exists():
            continue
        r = outfit.request("POST", "/videos/generations", k, json.dumps({
            "model": "kling-v3", "prompt": SHOTS[name][3], "mode": "pro", "duration": 5,
            "aspect_ratio": "9:16", "audio": False,
            "image_with_roles": [{"url": outfit.upload(k, src), "role": "first_frame"}],
            "metadata": {"negative_prompt": promo.NEGATIVE, "watermark": False}}).encode(),
            {"Content-Type": "application/json"})
        tasks[dest] = r.get("id") or r.get("task_id") or r.get("data", {}).get("id")
        print(f"  wyslano  {name}", flush=True)
    promo.poll(k, tasks, "/videos/generations", promo.video_url)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    stage = sys.argv[1]
    names = [a for a in sys.argv[2:] if not a.startswith("--")] or list(SHOTS)
    {"stills": stills, "videos": videos}[stage](names, "--force" in sys.argv)
