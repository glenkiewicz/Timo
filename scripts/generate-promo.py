#!/usr/bin/env python3
"""
Film promocyjny Timo (nagłówek strony produktu w App Store, social media).

To NIE jest App Preview — Apple wymaga, by podgląd był nagrany z aplikacji.
Nagłówek strony produktu (Asset Library, od 5.10.2026) przyjmuje materiał
marki: wideo 21:9, 5–30 s, w pętli, wyciszone.

Dwa etapy, żeby nie palić kredytów na złe kadry:
  stills  — kadr startowy każdego ujęcia (gpt-image z referencją liska), 16:9
  videos  — ujęcie z kadru startowego (Kling v3 pro, 1080p, 5 s, 16:9)

Wynik: marketing/promo/stills/<ujęcie>.png, marketing/promo/clips/<ujęcie>.mp4

Uruchom:  python3 scripts/generate-promo.py stills [<ujęcie> ...]
          python3 scripts/generate-promo.py videos [<ujęcie> ...]
"""
import importlib.util, json, pathlib, sys, time, urllib.request

spec = importlib.util.spec_from_file_location("outfit", "scripts/generate-timo-outfit.py")
outfit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(outfit)

OUT = pathlib.Path("marketing/promo")
MASTER = pathlib.Path("assets/timo/character/timo-talk-start.png")

STYLE = (
    "Cinematic wide 16:9 frame from a high-end 3D animated family film, soft volumetric light, "
    "rich colours, shallow depth of field. The character is EXACTLY the cute cartoon fox from the "
    "reference image — same face, big brown eyes, orange fur, cream chest, dark brown paws, green "
    "bandana. No text, no letters, no logos, no watermark. Scene: {S}"
)

# ujęcie → (referencja, opis kadru, ruch w wideo)
SHOTS = {
    "1-hero": (
        MASTER,
        "close-up of the fox in a sunlit magical forest clearing, holding a big round magnifying "
        "glass up to one eye which looks huge and curious through the lens, golden morning light, "
        "floating dust specks",
        "Slow cinematic dolly-in toward the fox. He lowers the magnifying glass, tilts his head with "
        "curiosity and smiles warmly. Leaves sway gently, light rays shimmer.",
    ),
    "2-ocean": (
        pathlib.Path("assets/timo/outfits/water_friends/start.png"),
        "the fox wearing a light blue diving mask and yellow snorkel stands on a sunny tropical "
        "beach at the water's edge, turquoise sea behind him, a playful dolphin just breaking the "
        "surface in the background",
        "The dolphin leaps out of the water in an arc behind the fox. The fox turns, gasps in delight "
        "and waves at it. Gentle waves, sparkling water, slow camera pan.",
    ),
    "3-safari": (
        pathlib.Path("assets/timo/outfits/savanna_kids/start.png"),
        "the fox wearing a white safari pith helmet stands on a golden African savanna at sunset, "
        "looking through small binoculars, a giraffe and an elephant visible in the distance under "
        "an acacia tree",
        "The fox lowers the binoculars and beams with excitement as the giraffe turns its head toward "
        "him. Warm golden light, grass sways, slow parallax camera move.",
    ),
    "4-leaves": (
        MASTER,
        "a big round pile of colourful autumn leaves in a cosy forest glade, the fox's ears and eyes "
        "just peeking out of the top of the pile, warm afternoon light",
        "The fox bursts joyfully out of the leaf pile with arms up, dozens of orange, red and yellow "
        "leaves fly into the air in slow motion and flutter down around him. He laughs happily.",
    ),
    "5-collection": (
        MASTER,
        "the fox sits in a cosy glowing den holding a big open picture album full of cute animal "
        "cards — a lion, a dolphin, a parrot, a turtle, an elephant — the cards glow softly with "
        "magical light",
        "The album pages flip by themselves, animal cards glow and tiny sparkles rise. The fox looks "
        "up from the album straight into the camera and gives a big warm smile. Camera slowly pushes in.",
    ),
}

NEGATIVE = (
    "text, letters, subtitles, watermark, logo, extra limbs, deformed paws, extra tail, human, "
    "realistic fox, scary, blurry face, morphing, flicker"
)


def stills(names):
    k = outfit.key()
    (OUT / "stills").mkdir(parents=True, exist_ok=True)
    refs, tasks = {}, {}
    for name in names:
        dest = OUT / "stills" / f"{name}.png"
        if dest.exists():
            continue
        ref_path, scene, _ = SHOTS[name]
        if ref_path not in refs:
            refs[ref_path] = outfit.upload(k, ref_path)
        r = outfit.request("POST", "/images/generations", k, json.dumps({
            "model": outfit.MODEL, "prompt": STYLE.format(S=scene), "size": "16:9",
            "resolution": "2k", "n": 1, "reference_images": [refs[ref_path]]}).encode(),
            {"Content-Type": "application/json"})
        tasks[dest] = r["id"]
        print(f"  wyslano  {name}", flush=True)
    poll(k, tasks, "/images/generations", lambda r: r["result"]["data"][0]["url"])


def videos(names):
    k = outfit.key()
    (OUT / "clips").mkdir(parents=True, exist_ok=True)
    tasks = {}
    for name in names:
        dest = OUT / "clips" / f"{name}.mp4"
        still = OUT / "stills" / f"{name}.png"
        if dest.exists() or not still.exists():
            continue
        frame = outfit.upload(k, still)
        r = outfit.request("POST", "/videos/generations", k, json.dumps({
            "model": "kling-v3", "prompt": SHOTS[name][2], "mode": "pro", "duration": 5,
            "aspect_ratio": "16:9", "audio": False,
            "image_with_roles": [{"url": frame, "role": "first_frame"}],
            "metadata": {"negative_prompt": NEGATIVE, "watermark": False}}).encode(),
            {"Content-Type": "application/json"})
        tasks[dest] = r.get("id") or r.get("task_id") or r.get("data", {}).get("id")
        print(f"  wyslano  {name}", flush=True)
    poll(k, tasks, "/videos/generations", video_url)


def video_url(r):
    s = json.dumps(r)
    import re
    m = re.findall(r'https?://[^"]+?\.mp4[^"]*', s)
    return m[0] if m else None


def poll(k, tasks, path, url_of):
    t0 = time.time()
    while tasks and time.time() - t0 < 3600:
        time.sleep(10)
        for dest, tid in list(tasks.items()):
            try:
                r = outfit.request("GET", f"{path}/{tid}", k)
            except SystemExit:
                continue
            st = str(r.get("status") or r.get("data", {}).get("status") or "").lower()
            if st in ("completed", "succeeded", "success"):
                url = url_of(r)
                req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
                with urllib.request.urlopen(req, timeout=300) as rr:
                    dest.write_bytes(rr.read())
                tasks.pop(dest)
                print(f"  gotowe   {dest.name} ({int(time.time() - t0)}s)", flush=True)
            elif st in ("failed", "cancelled", "error"):
                print(f"  PADLO    {dest.name}: {json.dumps(r)[:300]}", flush=True)
                tasks.pop(dest)


if __name__ == "__main__":
    stage, *names = sys.argv[1:]
    {"stills": stills, "videos": videos}[stage](names or list(SHOTS))
