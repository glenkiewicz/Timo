#!/usr/bin/env python3
"""
Postacie Timo z onboardingu na stronę: usuwa kremową „podłogę” pod łapkami
i przycina kadr ciasno do postaci.

Grafiki mają przezroczyste tło, ale pod stopami zostaje jasna plama. Na
kremowym tle aplikacji jej nie widać, na scenach strony wygląda jak biała
naklejka. Usuwamy tylko jasne, mało nasycone piksele w dolnym pasie kadru,
połączone z przezroczystym tłem — białe futro na głowie i ogonie zostaje.

Uruchom:  python3 scripts/clean-timo-art.py
Wynik:    site/_raw/timo/<nazwa>.png  (dalej scripts/build-site-assets.py)
"""
import pathlib

import cv2
import numpy as np
from PIL import Image

SRC = pathlib.Path("assets/onboarding")
OUT = pathlib.Path("site/_raw/timo")
NAMES = ["hello", "guess", "collect", "parent", "paywall", "ways"]
BAND = 0.32  # dolna część postaci, w której szukamy podłogi


def clean(name):
    im = np.array(Image.open(SRC / f"{name}.webp").convert("RGBA"))
    rgb, a = im[..., :3].astype(int), im[..., 3]
    ys, xs = np.where(a > 20)
    top, bottom = ys.min(), ys.max()
    light = (rgb.min(axis=2) > 196) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 55)
    clear = a < 30
    band = np.zeros_like(clear)
    band[int(bottom - (bottom - top) * BAND):, :] = True
    # Jasne piksele w pasie + przezroczystość; zostawiamy składowe, które
    # dotykają przezroczystego tła.
    cand = ((light & band) | clear).astype(np.uint8)
    n, lab = cv2.connectedComponents(cand, connectivity=4)
    touching = set(np.unique(lab[clear])) - {0}
    floor = np.isin(lab, list(touching)) & light & band
    floor = cv2.dilate(floor.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    a2 = a.copy()
    a2[floor & (rgb.min(axis=2) > 170)] = 0
    # Półprzezroczysty brzeg plamy: jasny i niepełny w pasie podłogi.
    a2[band & (a2 < 200) & (rgb.min(axis=2) > 150)] = 0
    # Drugie przejście: tło zamknięte między nogami. Oddzielał je od reszty
    # cień pod łapkami, więc pierwsze przejście go nie widziało. Bardzo blade
    # piksele (prawie biel) w wyższym pasie plus cień w samym dole kadru —
    # kremowe futro brzucha jest bardziej nasycone i zostaje.
    spread = (rgb.max(axis=2) - rgb.min(axis=2))
    tall = np.zeros_like(clear)
    tall[int(bottom - (bottom - top) * 0.45):, :] = True
    floor_rows = np.zeros_like(clear)
    floor_rows[int(bottom - (bottom - top) * 0.1):, :] = True
    pale = tall & (rgb.min(axis=2) > 222) & (spread < 38)
    shade = floor_rows & (rgb.min(axis=2) > 165) & (spread < 62)
    clear2 = a2 < 30
    cand = (pale | shade | clear2).astype(np.uint8)
    n, lab = cv2.connectedComponents(cand, connectivity=4)
    touching = set(np.unique(lab[clear2])) - {0}
    gap = np.isin(lab, list(touching)) & (pale | shade)
    gap = cv2.dilate(gap.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    a2[gap & (rgb.min(axis=2) > 160) & tall] = 0
    # Miękka krawędź po wycięciu.
    blur = cv2.GaussianBlur(a2, (3, 3), 0)
    a2 = np.minimum(a2, np.maximum(blur, (a2 > 250) * 255).astype(np.uint8))
    im[..., 3] = a2
    ys, xs = np.where(a2 > 24)
    pad = 6
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0),
           min(xs.max() + pad, im.shape[1]), min(ys.max() + pad, im.shape[0]))
    out = Image.fromarray(im).crop(box)
    OUT.mkdir(parents=True, exist_ok=True)
    out.save(OUT / f"{name}.png")
    print(f"  {name:10} podłoga {int(floor.sum()):6} px, tło między nogami {int(gap.sum()):6} px, kadr {out.size}")


if __name__ == "__main__":
    for n in NAMES:
        clean(n)
