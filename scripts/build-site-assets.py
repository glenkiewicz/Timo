#!/usr/bin/env python3
"""
Grafiki strony zgadujztimo.pl — kopiuje i zmniejsza do WebP to, co już jest
w aplikacji (Timo z onboardingu, ikony wypraw, zwierzęta, odznaki, zrzuty
ekranu), plus szerokie ilustracje z scripts/generate-landing-art.py.
Najpierw: python3 scripts/clean-timo-art.py

Uruchom:  python3 scripts/build-site-assets.py
Wynik:    site/assets/img/
"""
import pathlib
from PIL import Image

OUT = pathlib.Path("site/assets/img")
SHOT_HOME = pathlib.Path("site/_raw/shot-home.png")

# (źródło, nazwa, najdłuższy bok)
FILES = [
    # Postacie Timo po scripts/clean-timo-art.py — bez „podłogi”, kadr ciasno do postaci.
    ("site/_raw/timo/hello.png", "timo-hello", 640),
    ("site/_raw/timo/guess.png", "timo-guess", 640),
    ("site/_raw/timo/collect.png", "timo-collect", 640),
    ("site/_raw/timo/parent.png", "timo-parent", 640),
    ("site/_raw/timo/paywall.png", "timo-chest", 640),
    ("site/_raw/timo/ways.png", "timo-ways", 640),
    ("assets/icons/start/think.png", "step-think", 200),
    ("assets/icons/start/answer.png", "step-answer", 200),
    ("assets/icons/start/guess.png", "step-guess", 200),
    ("marketing/store/raw/iphone-game.png", "shot-game", 720),
    ("marketing/store/raw/iphone-collection.png", "shot-collection", 720),
    ("marketing/store/raw/iphone-animal.png", "shot-animal", 720),
    ("marketing/store/raw/iphone-expeditions.png", "shot-expeditions", 720),
    (str(SHOT_HOME), "shot-home", 720),
    ("site/_raw/hero-meadow.png", "hero-meadow", 2400),
    ("site/_raw/expeditions-panorama.png", "expeditions-panorama", 2400),
    ("site/_raw/hero-world.png", "hero-world", 2400),
    ("site/_raw/cta-forest.png", "cta-forest", 2400),
    ("site/_raw/sky-clouds.png", "sky-clouds", 2400),
    ("assets/icons/info/paws.png", "icon-paws", 160),
    ("assets/icons/info/sound_on.png", "icon-sound", 160),
    ("assets/icons/info/level.png", "icon-level", 160),
    ("assets/icons/info/xp.png", "icon-xp", 160),
    ("assets/images/icon.png", "app-icon", 256),
]
for e in ["savanna_kids", "water_friends", "green_jungle", "farm_timo", "ice_land", "dinos_myths",
          "night_animals", "home_pets_friends", "flyers", "bugs_and_worms"]:
    FILES.append((f"assets/icons/gen/{e}.png", f"exp-{e}", 200))
for a in ["lion", "elephant", "dolphin", "parrot", "panda", "giraffe", "owl", "turtle", "hedgehog", "koala"]:
    FILES.append((f"assets/animals/{a}.webp", f"animal-{a}", 240))
for b in ["first_win", "collector_25", "explorer_5", "daily_streak_7", "streak_3"]:
    FILES.append((f"assets/badges/{b}.png", f"badge-{b}", 160))


def anim(src, name, height=420, step=2):
    from PIL import ImageSequence
    im = Image.open(src)
    frames, durations = [], []
    for i, fr in enumerate(ImageSequence.Iterator(im)):
        if i % step:
            continue
        f = fr.convert("RGBA")
        f = f.resize((round(f.width * height / f.height), height), Image.LANCZOS)
        frames.append(f)
        durations.append(fr.info.get("duration", 42) * step)
    dest = OUT / f"{name}.webp"
    frames[0].save(dest, "WEBP", save_all=True, append_images=frames[1:], duration=durations,
                   loop=0, quality=72, method=6)
    print(f"  {dest.name:34} {frames[0].size[0]}x{frames[0].size[1]}  {len(frames)} klatek  {dest.stat().st_size // 1024} KB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for src, name, side in FILES:
        p = pathlib.Path(src)
        if not p.exists():
            print(f"  brak     {src}")
            continue
        im = Image.open(p)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        im.thumbnail((side, side), Image.LANCZOS)
        dest = OUT / f"{name}.webp"
        im.save(dest, "WEBP", quality=82, method=6)
        print(f"  {dest.name:34} {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024} KB")
    # Animowany Timo z aplikacji (animowane WebP z kanałem alfa) — mniejszy
    # i co druga klatka, żeby strona nie ważyła po 2 MB na postać.
    for src, name in [("assets/timo/character/timo-wave.webp", "timo-wave"),
                      ("assets/timo/character/timo-talk-happy.webp", "timo-talk")]:
        anim(src, name)
    # favicon, ikona dla iOS i do manifestu
    icon = Image.open("assets/images/icon.png").convert("RGB")
    icon.resize((180, 180), Image.LANCZOS).save("site/apple-touch-icon.png")
    icon.resize((512, 512), Image.LANCZOS).save("site/icon-512.png", optimize=True)
    icon.resize((32, 32), Image.LANCZOS).save("site/favicon-32.png")
    icon.save("site/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    main()
