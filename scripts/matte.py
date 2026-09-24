#!/usr/bin/env python3
"""
Wycinanie kanału alfa z generowanych grafik na białym tle.

Tło bierzemy WYŁĄCZNIE z obszaru połączonego z krawędzią kadru — inaczej jasne
wnętrza (kremowy brzuch, biała głowa) też zostałyby uznane za tło.

Próg dobieramy adaptacyjnie. Stały próg 42 działał dla pomarańczowego liska, ale
przy albatrosie, adaksie i pingwinie przeciekał przez białe upierzenie i zostawało
samo ciemne skrzydło. Bierzemy więc największy próg, przy którym sylwetka nie
kurczy się względem progu najostrożniejszego.
"""
import cv2
import numpy as np
from PIL import Image

FLAGS = 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
LADDER = [8, 12, 16, 20, 28, 36, 42]
K3 = np.ones((3, 3), np.uint8)


def _bg(rgb, t):
    h, w, _ = rgb.shape
    m = np.zeros((h + 2, w + 2), np.uint8)
    work = rgb.copy()
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        cv2.floodFill(work, m, seed, (0, 0, 0), (t,) * 3, (t,) * 3, FLAGS)
    return m[1:-1, 1:-1] > 0


def foreground(rgb, tol=0.02):
    """Maska sylwetki + próg, przy którym ją wyznaczono."""
    base = (~_bg(rgb, LADDER[0])).sum()
    best, best_t = ~_bg(rgb, LADDER[0]), LADDER[0]
    for t in LADDER[1:]:
        fg = ~_bg(rgb, t)
        if fg.sum() < base * (1 - tol):
            break                      # próg zaczął zjadać sylwetkę
        best, best_t = fg, t
    n, lab, st, _ = cv2.connectedComponentsWithStats(best.astype(np.uint8), 8)
    if n > 1:                          # znaki wodne i odpryski odpadają
        best = lab == (1 + np.argmax(st[1:, 4]))
    return best, best_t


def cutout(path, size, margin=0.90):
    """RGBA wyśrodkowane w kwadracie `size`, z odjętą obwódką tła."""
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.uint8)
    fg, t = foreground(rgb)
    mask = cv2.morphologyEx(fg.astype(np.uint8), cv2.MORPH_CLOSE, K3)
    inner = cv2.erode(mask, K3, iterations=1)
    grown = cv2.inpaint(rgb, (mask - inner).astype(np.uint8), 3, cv2.INPAINT_TELEA)
    im = Image.fromarray(np.dstack([grown, (inner * 255).astype(np.uint8)]), "RGBA")
    bb = Image.fromarray((inner * 255).astype(np.uint8)).getbbox()
    im = im.crop(bb)
    s = int(size * margin)
    r = max(im.width, im.height)
    im = im.resize((round(im.width * s / r), round(im.height * s / r)), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return out, t

def cutout_raw(path):
    """RGBA w oryginalnym kadrze — bez docinania do sylwetki i bez kwadratu.

    Do elementów interfejsu: deska półki, rama gabloty czy tabliczka muszą
    zachować własne proporcje i marginesy, bo rozciągamy je potem na szerokość
    ekranu. `cutout` centruje w kwadracie, co przy nich niszczy geometrię.
    """
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.uint8)
    fg, t = foreground(rgb)
    mask = cv2.morphologyEx(fg.astype(np.uint8), cv2.MORPH_CLOSE, K3)
    inner = cv2.erode(mask, K3, iterations=1)
    grown = cv2.inpaint(rgb, (mask - inner).astype(np.uint8), 3, cv2.INPAINT_TELEA)
    return Image.fromarray(np.dstack([grown, (inner * 255).astype(np.uint8)]), "RGBA"), t
