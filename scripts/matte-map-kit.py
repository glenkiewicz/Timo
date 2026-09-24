#!/usr/bin/env python3
"""
Wycięcie białego tła z elementów mapy i zapis do assets/map/*.webp.

Model rysuje „plain pure white background" dosłownie — jako biały prostokąt,
a nie jako przezroczystość. Wyspy regionów położone tak na papierze dawały
białe kafelki zamiast wysp, więc alfę liczymy sami.

`paper` idzie osobną drogą: to jedyny element, który ma zostać pełnym
prostokątem, i przechodzi przez `seamless`, żeby dało się go kaflować.

Uruchom:  python3 scripts/matte-map-kit.py
"""
import pathlib, sys
import numpy as np
from PIL import Image

sys.path.insert(0, "scripts")
from matte import cutout_raw          # noqa: E402
from seamless import seamless, check  # noqa: E402
import cv2                            # noqa: E402

RAW = pathlib.Path("assets/map/_raw")
OUT = pathlib.Path("assets/map")

# Element -> czy ma ZOSTAĆ prostokątem (True) czy dostać alfę (False).
SOLID = {"paper"}

# Elementy w kształcie PIERŚCIENIA. Zalewanie idzie od krawędzi obrazu, więc
# białe wnętrze zamknięte obwódką zostaje kryjące — a przez ramkę ma być widać
# zwierzę. Dla nich zalewamy dodatkowo od środka.
RINGS = {"frame-found"}

# Górna krawędź papieru: model narysował „przezroczystość" jako szachownicę
# szarych kratek, a zalewanie o stałym zakresie nie radzi sobie z naprzemiennymi
# kolorami. Papier poznajemy jednak po CIEPŁYM odcieniu, więc dla każdej kolumny
# szukamy pierwszego piksela papieru i kasujemy wszystko nad nim.
EDGE_TOP = {"paper-top"}


def clear_above_paper(rgba: Image.Image) -> Image.Image:
    arr = np.asarray(rgba).copy()
    rgb = arr[..., :3].astype(np.int16)
    # Papier jest cieplejszy niż szarość: kanał R wyraźnie przewyższa B.
    warm = (rgb[..., 0] - rgb[..., 2]) > 18
    h, w = warm.shape
    for x in range(w):
        col = np.flatnonzero(warm[:, x])
        arr[: (col[0] if col.size else h), x, 3] = 0
    return Image.fromarray(arr, "RGBA")


def punch_centre(rgba: Image.Image) -> Image.Image:
    """Wytnij jednolite wnętrze pierścienia, startując ze środka obrazu."""
    import cv2 as _cv
    arr = np.asarray(rgba).copy()
    h, w = arr.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    _cv.floodFill(arr[:, :, :3].copy(), mask, (w // 2, h // 2), 0,
                  (12, 12, 12), (12, 12, 12),
                  _cv.FLOODFILL_FIXED_RANGE | _cv.FLOODFILL_MASK_ONLY | (255 << 8))
    inside = mask[1:-1, 1:-1] > 0
    # Zwężamy o piksel, żeby nie podgryźć wewnętrznej krawędzi obwódki.
    inside = _cv.erode(inside.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=1) > 0
    arr[..., 3][inside] = 0
    return Image.fromarray(arr, "RGBA")


def trim(img: Image.Image) -> Image.Image:
    """Przytnij do widocznej zawartości.

    Model rysuje każdy element w ramce 16:9 z szerokim pustym marginesem. Bez
    przycięcia proporcje pliku (1,78) nie mają nic wspólnego z proporcjami
    rysunku, więc komponent musiałby zgadywać, gdzie w kadrze leży deska.
    """
    box = img.getbbox()
    return img.crop(box) if box else img


def save(img: Image.Image, name: str):
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / f"{name}.webp"
    img.save(p, "WEBP", quality=90, method=6)
    return p


def alpha_ratio(img: Image.Image) -> float:
    a = np.asarray(img.getchannel("A"))
    return float((a > 8).mean())


def main():
    for src in sorted(RAW.glob("*.png")):
        name = src.stem
        if name in SOLID:
            img = cv2.imread(str(src), cv2.IMREAD_COLOR)
            before, after = check(img), None
            out = seamless(img)
            after = check(out)
            p = OUT / f"{name}.webp"
            OUT.mkdir(parents=True, exist_ok=True)
            cv2.imwrite(str(p), out, [cv2.IMWRITE_WEBP_QUALITY, 90])
            print(f"  {name:16} kafel  szew {before[0]:5.1f}/{before[1]:5.1f}"
                  f" -> {after[0]:5.1f}/{after[1]:5.1f}  {p.stat().st_size//1024} KB")
            continue

        # Model NIGDY nie zwraca kanału alfa — „white background" rysuje jako
        # biały prostokąt, a przezroczystość bywa wręcz szachownicą w pikselach.
        # Alfę liczymy więc zawsze sami.
        rgba, t = cutout_raw(src)
        if name in EDGE_TOP:
            rgba = clear_above_paper(rgba)
        rgba = trim(rgba)
        p = save(rgba, name)
        print(f"  {name:16} {alpha_ratio(rgba)*100:5.1f}% krycia  prog {t:<3} {p.stat().st_size//1024} KB")


if __name__ == "__main__":
    main()
