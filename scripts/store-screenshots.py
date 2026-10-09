#!/usr/bin/env python3
"""
Zrzuty do App Store: surowy zrzut z symulatora (marketing/store/raw) na
kolorowym tle z polskim podpisem u góry. Wymiary dokładnie takie, jakich
chce App Store Connect (bez przezroczystości):

  iphone  1320×2868  (Dynamic Island large — z iPhone 18 Pro Max)
  medium  1206×2622  (Dynamic Island medium — obowiązkowy, iPhone 17 Pro)
  ipad    2064×2752  (iPad 13" — obowiązkowy, bo aplikacja działa na iPadzie)

Wynik: marketing/store/<zestaw>/<NN>-<ekran>.png

Uruchom:  python3 scripts/store-screenshots.py
"""
import pathlib

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAW = pathlib.Path("marketing/store/raw")
OUT = pathlib.Path("marketing/store")

FONT_BOLD = "/Users/grzegorzlenkiewicz/Apps/Timo/node_modules/@expo-google-fonts/gabarito/700Bold/Gabarito_700Bold.ttf"
FONT_TEXT = "/Users/grzegorzlenkiewicz/Apps/Timo/node_modules/@expo-google-fonts/lexend/500Medium/Lexend_500Medium.ttf"

INK = (61, 45, 30)

# kolejność = kolejność w sklepie; (ekran, tytuł, podtytuł, tło)
SLIDES = [
    ("game", "Pomyśl o zwierzęciu.\nTimo zgadnie!", "Odpowiadasz, a lisek detektyw pyta", (253, 236, 213)),
    ("intro", "24 wyprawy\nz przebraniami", "Ocean, dżungla, farma, Afryka…", (219, 240, 250)),
    ("home", "Codziennie\nnowa przygoda", "Wyprawa Dnia i głos Timo po polsku", (218, 241, 235)),
    ("collection", "Ponad 700 zwierząt\ndo odkrycia", "Kolekcja z krainami całego świata", (234, 226, 247)),
    ("animal", "Ciekawostki\ni mapa zasięgu", "Każde zwierzę ma swoją kartę", (252, 241, 210)),
    ("expeditions", "Bez reklam.\nBezpiecznie dla dzieci", "Zakupy tylko za bramką dla dorosłych", (253, 236, 213)),
]

SETS = {
    "iphone": (1320, 2868),
    "medium": (1206, 2622),
    "ipad": (2064, 2752),
}


def rounded(im: Image.Image, r: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *im.size), r, fill=255)
    out = Image.new("RGBA", im.size)
    out.paste(im, (0, 0), mask)
    return out


def compose(kind: str, raw: Image.Image, title: str, sub: str, bg: tuple) -> Image.Image:
    W, H = SETS[kind]
    canvas = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(canvas)
    s = W / 1320 if kind != "ipad" else W / 1700

    tf = ImageFont.truetype(FONT_BOLD, int(104 * s))
    sf = ImageFont.truetype(FONT_TEXT, int(50 * s))
    y = int(150 * s)
    for line in title.split("\n"):
        w = d.textlength(line, font=tf)
        d.text(((W - w) / 2, y), line, font=tf, fill=INK)
        y += int(122 * s)
    y += int(14 * s)
    w = d.textlength(sub, font=sf)
    d.text(((W - w) / 2, y), sub, font=sf, fill=(111, 96, 73))
    top = y + int(110 * s)

    # zrzut pomniejszony tak, by zmieścił się pod tekstem, z cieniem
    avail_h = H - top
    scale = min((W * 0.86) / raw.width, (avail_h + raw.height * 0.12) / raw.height)
    shot = raw.convert("RGB").resize((int(raw.width * scale), int(raw.height * scale)), Image.LANCZOS)
    shot = rounded(shot, int(70 * s))
    x = (W - shot.width) // 2

    shadow = Image.new("RGBA", (shot.width + 120, shot.height + 120), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((60, 70, 60 + shot.width, 70 + shot.height), int(70 * s), fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    canvas.paste(shadow, (x - 60, top - 60), shadow)
    canvas.paste(shot, (x, top), shot)
    return canvas


def main():
    for kind in SETS:
        (OUT / kind).mkdir(parents=True, exist_ok=True)
        for n, (screen, title, sub, bg) in enumerate(SLIDES, 1):
            src = RAW / f"{kind}-{screen}.png"
            if not src.exists():
                print(f"  brak {src}")
                continue
            img = compose(kind, Image.open(src), title, sub, bg)
            assert img.size == SETS[kind]
            path = OUT / kind / f"{n:02d}-{screen}.png"
            img.save(path, optimize=True)
            print(f"  {path}  {img.size[0]}×{img.size[1]}")


if __name__ == "__main__":
    main()
