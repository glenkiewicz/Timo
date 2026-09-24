#!/usr/bin/env python3
"""
Wycina alfę z surowych rysunków zwierząt i zapisuje jako assets/animals/<id>.webp.

Wejście:  assets/animals/_raw/<id>.png  (z generate-animal-art.py)
Wyjście:  assets/animals/<id>.webp      (384x384, RGBA, tło wycięte matte.cutout)

Uruchom:  python3 scripts/cutout-animals.py <id> [<id> ...]
          python3 scripts/cutout-animals.py --all-raw   (wszystko z _raw bez gotowego webp)
"""
import sys, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from matte import cutout

RAW = pathlib.Path("assets/animals/_raw")
OUT = pathlib.Path("assets/animals")
SIZE = 384


def main(ids):
    if ids == ["--all-raw"]:
        ids = sorted(p.stem for p in RAW.glob("*.png") if not (OUT / f"{p.stem}.webp").exists())
    ok, bad = [], []
    for i in ids:
        src = RAW / f"{i}.png"
        if not src.exists():
            print(f"  BRAK RAW  {i}")
            bad.append(i)
            continue
        im, t = cutout(src, SIZE)
        im.save(OUT / f"{i}.webp", "WEBP", quality=90, method=6)
        print(f"  ciach    {i:24} prog={t}")
        ok.append(i)
    print(f"\nwyciete {len(ok)}/{len(ids)}" + (f", bez raw: {bad}" if bad else ""))


if __name__ == "__main__":
    main(sys.argv[1:])
