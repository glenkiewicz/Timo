#!/usr/bin/env python3
"""
Surowe filmy mówienia Timo (_raw/*.mp4) → animowane WebP z alfą, w kadrze
IDENTYCZNYM z `timo-idle.webp` (435×640), żeby przełączanie idle ↔ mówienie
nie przesuwało liska ani łap (`CLIP_PAWS` w TimoStage).

Przekształcenie wyznaczone dopasowaniem kształtu liska z pierwszej klatki
`timo-idle.source.mp4` do pierwszej klatki `timo-idle.webp` (zgodność 96,8%):
webp = 0,680 · źródło(720×1280) + (−25, −124). Filmy z Klinga mają 1080×1920,
czyli 1,5× źródła, bo startują z tej samej klatki — stąd skala 0,680 / 1,5.

Tło: białe, tylko z generatora wideo — kompresja zostawia szum i szarości,
więc tłem jest wszystko jasne i prawie bezbarwne, połączone z krawędzią kadru
(futro i krem mają wyraźną barwę). Potem największy kształt, żeby odpadły
pojedyncze okruchy.

Cały 5-sekundowy klip: pierwsza i ostatnia klatka są prawie identyczne (Kling
dostał tę samą klatkę jako początek i koniec), więc pętla domyka się bez
przenikania. Ostatnią klatkę pomijamy, żeby w pętli nie było jej dwa razy.

Uruchom:  python3 scripts/process-timo-talk.py <plik.mp4> <wyjście.webp> [...]
"""
import subprocess, sys, tempfile, pathlib

import cv2
import numpy as np
from PIL import Image

SIZE = (435, 640)
SCALE = 0.680  # dla filmu 720 px szerokości; dla innych przeliczane w process()
OFFSET = (-25, -124)
FPS = 24
IDLE = 'assets/timo/character/timo-frame-ref.png'  # wzorzec kadru: pierwsza klatka PIERWOTNEGO idle


def frames(mp4: str) -> list[np.ndarray]:
    tmp = pathlib.Path(tempfile.mkdtemp())
    subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'fps={FPS}', str(tmp / '%04d.png')], check=True)
    return [np.asarray(Image.open(p).convert('RGB')) for p in sorted(tmp.glob('*.png'))]


def alpha(rgb: np.ndarray) -> np.ndarray:
    im = rgb.astype(int)
    chroma = im.max(2) - im.min(2)
    bright = im.max(2)
    cand = ((chroma <= 16) & (bright >= 150)).astype(np.uint8)
    _, lab = cv2.connectedComponents(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    bg = cv2.morphologyEx(bg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    fg = (~bg).astype(np.uint8)
    n, lab2, st, _ = cv2.connectedComponentsWithStats(fg)
    keep = (lab2 == (1 + np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
    # Krawędź futra jest wymieszana z białym tłem — zwężamy maskę o 2 px
    # (przy 1080p to ułamek piksela po skalowaniu), żeby nie było jasnej
    # otoczki na zielonej polanie.
    keep = cv2.erode(keep, np.ones((3, 3), np.uint8), iterations=2)
    return cv2.GaussianBlur(keep * 255, (5, 5), 0)


def defringe(rgb: np.ndarray, a: np.ndarray) -> np.ndarray:
    """Odejmij biel z półprzezroczystych krawędzi: C = (obs − (1−α)·255) / α."""
    al = (a.astype(np.float32) / 255.0)[..., None]
    c = rgb.astype(np.float32)
    safe = np.maximum(al, 0.05)
    out = np.where(al > 0, (c - (1 - al) * 255.0) / safe, c)
    return np.clip(out, 0, 255).astype(np.uint8)


def fit(first: np.ndarray, idle_alpha: np.ndarray, scale: float) -> np.ndarray:
    """
    Skala i przesunięcie tego filmu → kadr timo-idle, dopasowane kształtem
    liska z PIERWSZEJ klatki do pierwszej klatki idle. Kling lekko przekadrowuje
    obraz względem klatki wejściowej, więc wspólne przekształcenie dla
    wszystkich filmów przesuwało liska o kilka pikseli.
    """
    m = (alpha(first) > 128).astype(np.float32)
    target = idle_alpha > 128
    best = None
    for s in np.arange(scale * 0.95, scale * 1.05, scale * 0.002):
        for oy in range(OFFSET[1] - 24, OFFSET[1] + 25, 2):
            for ox in range(OFFSET[0] - 16, OFFSET[0] + 17, 2):
                M = np.float32([[s, 0, ox], [0, s, oy]])
                w = cv2.warpAffine(m, M, SIZE, flags=cv2.INTER_NEAREST) > 0.5
                iou = (w & target).sum() / max(1, (w | target).sum())
                if best is None or iou > best[0]:
                    best = (iou, s, ox, oy)
    iou, s, ox, oy = best
    print(f'  dopasowanie: IoU {iou:.3f}, skala {s:.4f}, przesunięcie ({ox}, {oy})')
    return np.float32([[s, 0, ox], [0, s, oy]])


def to_idle_frame(rgb: np.ndarray, M: np.ndarray) -> Image.Image:
    a = alpha(rgb)
    rgba = np.dstack([defringe(rgb, a), a])
    out = cv2.warpAffine(rgba, M, SIZE, flags=cv2.INTER_AREA, borderValue=(0, 0, 0, 0))
    return Image.fromarray(out, 'RGBA')


def process(mp4: str, out: str) -> None:
    fs = frames(mp4)[:-1]
    idle = Image.open(IDLE)
    idle.seek(0)
    # Tryb pro daje 1080 px, std 720 px — skala zależy od szerokości filmu.
    M = fit(fs[0], np.asarray(idle.convert('RGBA'))[..., 3], SCALE * 720 / fs[0].shape[1])
    imgs = [to_idle_frame(f, M) for f in fs]
    imgs[0].save(out, save_all=True, append_images=imgs[1:], duration=round(1000 / FPS),
                 loop=0, lossless=False, quality=80, method=4)
    print(f'{out}: {len(imgs)} klatek, {pathlib.Path(out).stat().st_size // 1024} KB')


if __name__ == '__main__':
    a = sys.argv[1:]
    for i in range(0, len(a), 2):
        process(a[i], a[i + 1])
