#!/usr/bin/env python3
"""
Haczyk (pierwsze 2–3 s) filmu reklamowego na TikToka — ujęcie AI przez ToAPIs.

Dwa etapy, żeby nie palić kredytów na zły kadr:
  still  — kadr startowy 9:16 (gpt-image z referencją liska w stroju wyprawy)
  video  — ujęcie z kadru startowego (Kling v3 pro, 5 s, 9:16)

Film z tym ujęciem wymaga na TikToku etykiety „treść AI” (brand.md, zasada 4).

Wynik: marketing/out/ad-01/hook-still.png, hook.mp4

Uruchom:  python3 scripts/marketing/make-tiktok-hook.py still|outro-still [--force]
          python3 scripts/marketing/make-tiktok-hook.py video [hook|hook-push|outro …] [--force]
"""
import importlib.util, json, pathlib, sys

spec = importlib.util.spec_from_file_location("promo", "scripts/generate-promo.py")
promo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(promo)
outfit = promo.outfit

OUT = pathlib.Path("marketing/out/ad-01")
REF = pathlib.Path("assets/timo/outfits/water_friends/start.png")

STILL_PROMPT = (
    "Vertical 9:16 frame from a high-end 3D animated family film, soft volumetric light, rich colours, "
    "shallow depth of field. The character is EXACTLY the cute cartoon fox from the reference image — "
    "same face, big brown eyes, orange fur, cream chest, dark brown paws, green bandana, light blue "
    "diving mask pushed up on his forehead. No text, no letters, no logos, no watermark. "
    "Scene: the fox stands on a sunny tropical beach, turquoise sea behind him, and leans curiously "
    "toward the camera holding a big round magnifying glass in one paw, one eye looking huge through "
    "the lens, playful knowing expression. The fox fills the lower two thirds of the frame; the top "
    "third is calm bright sky (room for captions)."
)
# ujęcie → (kadr startowy, ruch). Kadr „hook-still.png” jest wspólny dla haczyków.
OUTRO_STILL = (
    "Vertical 9:16 frame from a high-end 3D animated family film, soft volumetric light, rich colours, "
    "shallow depth of field. The character is EXACTLY the cute cartoon fox from the reference image — "
    "same face, big brown eyes, orange fur, cream chest, dark brown paws, green bandana, light blue "
    "diving mask pushed up on his forehead. No text, no letters, no logos, no watermark. "
    "Scene: the fox stands on a sunny tropical beach at the water's edge, arms raised in joy, laughing, "
    "turquoise sea behind him with a friendly grey dolphin just jumping out of the water in an arc "
    "behind his shoulder. The fox fills the lower 60% of the frame; the top 40% is bright blue sky "
    "with a few soft clouds (room for a logo)."
)
MOTION_PUSH = (
    "The fox lifts the big magnifying glass and holds it right up to the camera, his huge curious eye "
    "looking through the lens. The camera smoothly pushes in toward the lens until the glass almost "
    "fills the whole frame. Gentle waves and sparkling water in the background."
)
MOTION_OUTRO = (
    "The dolphin leaps out of the sea in a graceful arc behind the fox and splashes back. The fox jumps "
    "up happily, turns to the camera and waves with a big warm smile. Sparkling water, gentle waves, "
    "slow cinematic camera pull-back, stable framing."
)
MOTION = (
    "The fox leans closer to the camera and peers through the magnifying glass with one huge curious "
    "eye, as if trying to read the viewer's mind. Then he lowers the glass, raises one eyebrow, smiles "
    "knowingly and taps his chin with his paw. Gentle waves, sparkling water, subtle slow push-in."
)


def still(force):
    dest = OUT / "hook-still.png"
    if dest.exists() and not force:
        return print(f"{dest} już jest (--force, żeby wygenerować ponownie)")
    k = outfit.key()
    ref = outfit.upload(k, REF)
    r = outfit.request("POST", "/images/generations", k, json.dumps({
        "model": outfit.MODEL, "prompt": STILL_PROMPT, "size": "9:16",
        "resolution": "2k", "n": 1, "reference_images": [ref]}).encode(),
        {"Content-Type": "application/json"})
    promo.poll(k, {dest: r["id"]}, "/images/generations", lambda r: r["result"]["data"][0]["url"])


SHOTS = {  # nazwa → (plik kadru, ruch)
    "hook": ("hook-still.png", None),
    "hook-push": ("hook-still.png", MOTION_PUSH),
    "outro": ("outro-still.png", MOTION_OUTRO),
}


def outro_still(force):
    dest = OUT / "outro-still.png"
    if dest.exists() and not force:
        return print(f"{dest} już jest")
    k = outfit.key()
    ref = outfit.upload(k, REF)
    r = outfit.request("POST", "/images/generations", k, json.dumps({
        "model": outfit.MODEL, "prompt": OUTRO_STILL, "size": "9:16",
        "resolution": "2k", "n": 1, "reference_images": [ref]}).encode(),
        {"Content-Type": "application/json"})
    promo.poll(k, {dest: r["id"]}, "/images/generations", lambda r: r["result"]["data"][0]["url"])


def video(force, name="hook"):
    still_name, motion = SHOTS[name]
    dest, src = OUT / f"{name}.mp4", OUT / still_name
    if dest.exists() and not force:
        return print(f"{dest} już jest (--force, żeby wygenerować ponownie)")
    k = outfit.key()
    frame = outfit.upload(k, src)
    r = outfit.request("POST", "/videos/generations", k, json.dumps({
        "model": "kling-v3", "prompt": motion or MOTION, "mode": "pro", "duration": 5,
        "aspect_ratio": "9:16", "audio": False,
        "image_with_roles": [{"url": frame, "role": "first_frame"}],
        "metadata": {"negative_prompt": promo.NEGATIVE, "watermark": False}}).encode(),
        {"Content-Type": "application/json"})
    tid = r.get("id") or r.get("task_id") or r.get("data", {}).get("id")
    promo.poll(k, {dest: tid}, "/videos/generations", promo.video_url)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    cmd, force = sys.argv[1], "--force" in sys.argv
    names = [a for a in sys.argv[2:] if not a.startswith("--")]
    if cmd == "still":
        still(force)
    elif cmd == "outro-still":
        outro_still(force)
    else:
        for n in names or ["hook"]:
            video(force, n)
