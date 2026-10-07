#!/usr/bin/env python3
"""
Animacje liska → wideo H.264 „podwójne”: lewa połowa kadru to kolor, prawa
to maska przezroczystości (szarość = krycie). Aplikacja składa je z powrotem
shaderem Skii (`src/components/timo/AlphaVideo.tsx`).

Dlaczego nie animowany WebP: ten sam klip idle ważył 3,2 MB jako WebP
i 0,28 MB tak (−91%) przy praktycznie tej samej jakości (PSNR 37,8 dB),
a przy tym dekoduje go sprzętowo dekoder wideo telefonu.

Kolor pod przezroczystymi pikselami jest nieważny, ale kodek i tak go
koduje — zerujemy go, żeby nie marnować bitów na śmieci tła. Szerokość
musi być parzysta (YUV 4:2:0), więc 435 px dopełniamy do 436.

Uruchom:  python3 scripts/encode-alpha-video.py <wejście.webp|.mp4 klatki> <wyjście.mp4> [...]
          python3 scripts/encode-alpha-video.py --all   (wszystkie animacje liska)
"""
import glob, pathlib, subprocess, sys, tempfile

import numpy as np
from PIL import Image

FPS = 24
CRF = "22"


def webp_frames(path: str) -> list[np.ndarray]:
    im = Image.open(path)
    out = []
    for i in range(im.n_frames):
        im.seek(i)
        out.append(np.asarray(im.convert("RGBA")).copy())
    return out


def stacked(rgba: np.ndarray) -> np.ndarray:
    h, w, _ = rgba.shape
    pw = w + (w % 2)
    a = rgba[..., 3:4].astype(np.float32) / 255.0
    # kolor premultiplikowany zerem pod tłem — lżejszy dla kodeka
    color = (rgba[..., :3].astype(np.float32) * (a > 0)).astype(np.uint8)
    mask = np.repeat(rgba[..., 3:4], 3, axis=2)
    out = np.zeros((h, pw * 2, 3), np.uint8)
    out[:, :w] = color
    out[:, pw:pw + w] = mask
    return out


def encode(frames: list[np.ndarray], out: str) -> None:
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i, f in enumerate(frames):
        Image.fromarray(stacked(f)).save(tmp / f"{i:05d}.png")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(tmp / "%05d.png"),
        "-c:v", "libx264", "-crf", CRF, "-preset", "slow", "-pix_fmt", "yuv420p",
        "-tag:v", "avc1", "-movflags", "+faststart",
        # klatka kluczowa co sekundę — szybkie przewinięcie na początek
        "-g", str(FPS), out,
    ], check=True)


def convert(src: str, out: str) -> None:
    encode(webp_frames(src), out)
    print(f"{out}: {pathlib.Path(src).stat().st_size // 1024} KB → {pathlib.Path(out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--all"]:
        srcs = [p for p in glob.glob("assets/timo/character/timo-*.webp") if not p.endswith("timo-walk.webp")]
        srcs += glob.glob("assets/timo/outfits/*/*.webp")
        for s in sorted(srcs):
            convert(s, s[: -len(".webp")] + ".mp4")
    else:
        for i in range(0, len(args), 2):
            convert(args[i], args[i + 1])
