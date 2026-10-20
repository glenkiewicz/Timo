#!/usr/bin/env python3
"""
Zrzuty do App Store, wersja 2 — w stylu strony zgadujztimo.pl: ilustrowane
tło ze świata Timo, nagłówek z pomarańczową drugą linijką, telefon/iPad
w ramce z prawdziwym zrzutem i pergaminowe „powiadomienia” wychodzące za
krawędź urządzenia. Każdy slajd mówi, że to gra edukacyjna.

Każdy slajd to strona HTML renderowana w Chrome w dokładnym rozmiarze,
którego chce App Store Connect, potem spłaszczana do PNG bez kanału alfa:

  iphone  1320×2868  (6,9" — iPhone 18 Pro Max)
  medium  1206×2622  (6,3" — iPhone 17 Pro)
  ipad    2064×2752  (iPad 13")

Surowe zrzuty: marketing/store/raw2/<zestaw>-<ekran>.png
Wynik:         marketing/store/v2/<zestaw>/<NN>-<ekran>.png

Uruchom:  python3 scripts/store-screenshots-v2.py
"""
import pathlib
import subprocess

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "marketing/store/raw2"
OUT = ROOT / "marketing/store/v2"
BUILD = ROOT / "marketing/store/_build"
IMG = ROOT / "site/assets/img"
BG = ROOT / "assets/backgrounds"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SETS = {"iphone": (1320, 2868), "medium": (1206, 2622), "ipad": (2064, 2752)}

# (ekran, linia 1, linia 2 (pomarańczowa), podpis, tło, pozycja tła,
#  powiadomienia [(ikona, tytuł, tekst, strona, wysokość 0–1)], postać (plik, strona) albo None)
SLIDES = [
    ("game", "Pomyśl o zwierzęciu.", "Timo zgadnie!",
     "Gra edukacyjna, w której dziecko poznaje świat zwierząt",
     IMG / "hero-world.webp", "50% 100%",
     [("step-answer", "Tak, Nie, Nie wiem", "albo To zależy", "l", .18),
      ("icon-paws", "Timo zgadł!", "+25 tropów za wiedzę", "r", .42)],
     None),
    ("home", "Codziennie", "coś nowego",
     "Wyprawa Dnia to krótka lekcja przyrody na każdy dzień",
     IMG / "cta-forest.webp", "18% 100%",
     [("badge-daily_streak_7", "Wyprawa Dnia", "3 nowe propozycje", "l", .44),
      ("badge-streak_3", "Seria 3 dni!", "nagroda za codzienną naukę", "r", .2)],
     None),
    ("intro", "Poznaje zwierzęta", "z całego świata",
     "24 wyprawy: ocean, dżungla, sawanna, farma, lodowe krainy…",
     IMG / "expeditions-panorama.webp", "8% 100%",
     [("exp-water_friends", "24 wyprawy", "na każdą Timo się przebiera", "r", .16)],
     ("timo-ways", "l")),
    ("collection", "715 zwierząt", "do poznania",
     "Kolekcja uczy, gdzie na świecie żyje każde zwierzę",
     IMG / "hero-meadow.webp", "30% 100%",
     [("animal-panda", "Nowe zwierzę!", "panda trafia do kolekcji", "r", .2),
      ("badge-collector_25", "Kolekcjoner", "odznaka za 25 zwierząt", "l", .5)],
     ("timo-collect", "r")),
    ("animal", "Ciekawostki, rozmiar", "i mapa",
     "Każde zwierzę ma kartę z wiedzą na miarę dziecka",
     BG / "exp-water-friends.webp", "50% 70%",
     [("animal-lion", "Czy wiesz?", "ryk lwa słychać z 8 km", "l", .3)],
     None),
    ("expeditions", "Uczy przez zabawę.", "Bez reklam.",
     "Bezpieczna gra edukacyjna dla dzieci 4+",
     BG / "region-mountains.webp", "50% 80%",
     [("icon-sound", "Timo czyta na głos", "grają też dzieci, które nie czytają", "r", .16),
      ("badge-first_win", "Bez reklam i czatów", "zakupy tylko dla dorosłych", "l", .46)],
     ("timo-parent", "r")),
]


def page(kind, idx, slide):
    W, H = SETS[kind]
    name, l1, l2, sub, bg, bgpos, toasts, char = slide
    ipad = kind == "ipad"
    s = W / 1320 if not ipad else 1.32           # skala typografii i ozdobników
    dev_w = 720 * W / 1320 if not ipad else 1300  # szerokość urządzenia
    dev_top = 760 * H / 2868 if not ipad else 860
    radius = dev_w * 0.16 if not ipad else 70
    pad = dev_w * 0.033 if not ipad else 30
    raw = RAW / f"{kind}-{name}.png"
    dev_h = (dev_w - 2 * pad) * Image.open(raw).height / Image.open(raw).width + 2 * pad
    toast_html = ""
    for icon, title, text, side, y in toasts:
        top = dev_top + (dev_h * y)
        pos = f"left:{24 * s:.0f}px" if side == "l" else f"right:{24 * s:.0f}px"
        rot = "-4deg" if side == "l" else "3deg"
        toast_html += (f'<div class="toast" style="{pos};top:{top:.0f}px;rotate:{rot}">'
                       f'<img src="{IMG / (icon + ".webp")}"><div><b>{title}</b><small>{text}</small></div></div>')
    char_html = ""
    if char:
        f, side = char
        pos = f"left:{-40 * s:.0f}px" if side == "l" else f"right:{-40 * s:.0f}px"
        char_html = f'<img class="char" style="{pos}" src="{IMG / (f + ".webp")}">'
    return f"""<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
@font-face {{ font-family: G; src: url('{ROOT}/site/assets/fonts/Gabarito_700Bold.ttf'); }}
@font-face {{ font-family: L; src: url('{ROOT}/site/assets/fonts/Lexend_600SemiBold.ttf'); }}
html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden}}
.s{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:url('{bg}') {bgpos}/cover;font-family:L;color:#4a3726}}
.s::before{{content:'';position:absolute;inset:0 0 auto 0;height:{dev_top + 520 * s:.0f}px;background:linear-gradient(rgba(224,244,253,.97) 0%,rgba(224,244,253,.93) 50%,rgba(224,244,253,0))}}
h1{{position:absolute;top:{170 * s:.0f}px;left:{40 * s:.0f}px;right:{40 * s:.0f}px;margin:0;text-align:center;font:700 {128 * s:.0f}px/1.02 G;letter-spacing:-1px}}
h1 em{{font-style:normal;color:#ce7422}}
p{{position:absolute;top:{455 * s:.0f}px;left:{110 * s:.0f}px;right:{110 * s:.0f}px;margin:0;text-align:center;font-size:{50 * s:.0f}px;line-height:1.35;color:#3d4f45}}
.dev{{position:absolute;left:50%;top:{dev_top:.0f}px;width:{dev_w:.0f}px;margin-left:{-dev_w / 2:.0f}px;border-radius:{radius:.0f}px;padding:{pad:.0f}px;box-sizing:border-box;background:#1b1612;box-shadow:0 0 0 {5 * s:.0f}px #3a2f26 inset,0 {80 * s:.0f}px {140 * s:.0f}px -{40 * s:.0f}px rgba(10,30,40,.65)}}
.dev img{{display:block;width:100%;border-radius:{radius - pad:.0f}px}}
.toast{{position:absolute;z-index:3;display:flex;align-items:center;gap:{24 * s:.0f}px;max-width:{560 * s:.0f}px;background:#fbeedb;border-radius:{50 * s:.0f}px;padding:{24 * s:.0f}px {36 * s:.0f}px {24 * s:.0f}px {24 * s:.0f}px;box-shadow:0 {14 * s:.0f}px 0 #c99a63,0 {50 * s:.0f}px {70 * s:.0f}px -{30 * s:.0f}px rgba(30,20,10,.55)}}
.toast img{{width:{112 * s:.0f}px;height:{112 * s:.0f}px;flex:none;border-radius:50%;background:#fff;border:{6 * s:.0f}px dashed #c99a63;padding:{10 * s:.0f}px;box-sizing:border-box;object-fit:contain}}
.toast b{{display:block;font:700 {46 * s:.0f}px/1.1 G}}
.toast small{{display:block;font-size:{32 * s:.0f}px;line-height:1.25;color:#6f6049;margin-top:{6 * s:.0f}px}}
.char{{position:absolute;z-index:2;bottom:{-10 * s:.0f}px;height:{660 * s:.0f}px;filter:drop-shadow(0 {30 * s:.0f}px {24 * s:.0f}px rgba(10,30,20,.4))}}
</style></head><body><div class="s">
<h1>{l1}<br><em>{l2}</em></h1>
<p>{sub}</p>
<div class="dev"><img src="{raw}"></div>
{toast_html}{char_html}
</div></body></html>"""


def main():
    BUILD.mkdir(parents=True, exist_ok=True)
    import sys
    only = sys.argv[1:] or list(SETS)
    for kind, (W, H) in SETS.items():
        if kind not in only:
            continue
        (OUT / kind).mkdir(parents=True, exist_ok=True)
        for i, slide in enumerate(SLIDES, 1):
            html = BUILD / f"{kind}-{i:02d}.html"
            html.write_text(page(kind, i, slide), encoding="utf-8")
            shot = BUILD / f"{kind}-{i:02d}.png"
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            "--force-device-scale-factor=1", f"--window-size={W},{H}",
                            "--virtual-time-budget=3000", "--allow-file-access-from-files",
                            f"--screenshot={shot}", f"file://{html}"],
                           check=True, capture_output=True)
            out = OUT / kind / f"{i:02d}-{slide[0]}.png"
            Image.open(shot).convert("RGB").save(out, optimize=True)
            print(f"  {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
