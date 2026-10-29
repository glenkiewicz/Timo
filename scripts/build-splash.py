#!/usr/bin/env python3
"""
Ekran startowy: głowa Timo w kremowym kółku na pomarańczowym tle — ta sama
grafika na iOS i Androidzie (Android i tak przycina ikonę do koła o 2/3
boku, więc kółko ma dokładnie ten rozmiar).

Klatki z oryginału animacji idle (720×1280, białe tło): oczy otwarte z klatki
81, mrugnięcie z klatek 82–90. Z klatek mrugnięcia bierzemy TYLKO okolicę
oczu i wklejamy na klatkę 81 — w nagraniu głowa lekko się kołysze, a na
ekranie startowym ma stać nieruchomo.

Wyjście:
- assets/images/splash-icon.png — statyczny splash systemowy (1024×1024),
- assets/images/splash-eyes-{open,half,closed}.webp — trzy fazy mrugnięcia
  dla `AnimatedSplash`, który przejmuje ekran, gdy ruszy JS i przenika je
  płynnie (animowany WebP przełączał klatki skokowo i gubił je przy starcie).

Uruchom:  python3 scripts/build-splash.py
"""
import pathlib, subprocess, sys, tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from matte import foreground  # noqa: E402

SRC = "assets/timo/character/timo-idle.source.mp4"
OPEN = 81
CREAM = (0xFF, 0xF1, 0xDF)
HEAD = (101, 190, 612, 687)       # głowa z uszami i chustką w klatce 720×1280
EYES = (215, 375, 500, 570)       # okolica oczu i brwi
N = 1024
HALF, CLOSED = 84, 86


def frames(tmp):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, f"{tmp}/f%03d.png"], check=True)
    return lambda i: Image.open(f"{tmp}/f{i + 1:03d}.png").convert("RGB")


def eyes_onto(base, other):
    mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(mask).ellipse(EYES, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(14))
    return Image.composite(other, base, mask)


def icon(frame):
    rgb = np.asarray(frame).astype(np.uint8)
    fg, _ = foreground(rgb)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    fox = frame.convert("RGBA")
    fox.putalpha(alpha)
    head = fox.crop(HEAD)
    s = 640 / head.width
    head = head.resize((640, round(head.height * s)), Image.LANCZOS)
    disk = Image.new("RGBA", (N, N), CREAM + (255,))
    disk.alpha_composite(head, ((N - head.width) // 2, (N - head.height) // 2 + 10))
    mask = Image.new("L", (N, N), 0)
    ImageDraw.Draw(mask).ellipse((N / 6, N / 6, N * 5 / 6, N * 5 / 6), fill=255)
    out = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    out.paste(disk, (0, 0), mask)
    return out


def main():
    with tempfile.TemporaryDirectory() as tmp:
        get = frames(tmp)
        base = get(OPEN)
        still = icon(base)
        still.save("assets/images/splash-icon.png")
        for name, im in (("open", still),
                         ("half", icon(eyes_onto(base, get(HALF)))),
                         ("closed", icon(eyes_onto(base, get(CLOSED))))):
            im.resize((720, 720), Image.LANCZOS).save(
                f"assets/images/splash-eyes-{name}.webp", quality=90, method=6)
    print("ok")


if __name__ == "__main__":
    main()
