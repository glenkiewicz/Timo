#!/usr/bin/env python3
"""
Zamiana kafla papieru w BEZSZWOWY — przesunięcie o pół i wtopienie szwu.

Model nie potrafi wygenerować kafla, który skleja się sam ze sobą: krawędzie
zawsze się różnią i przy przewijaniu mapy widać poziomą kreskę co ekran.
Robimy to więc rachunkiem, nie promptem.

Metoda: przesuwamy obraz cyklicznie o połowę w obu osiach (szwy lądują na
środku, gdzie je widać i można je zamalować), a potem wtapiamy w nie kopię
sprzed przesunięcia z maską o miękkich brzegach. Po tym zabiegu brzegi obrazu
są dokładnie tym, co było w jego środku — czyli pasują do siebie idealnie.

Uruchom:  python3 scripts/seamless.py assets/map/_raw/paper.png assets/map/paper.webp
"""
import sys, pathlib
import numpy as np
import cv2


def seamless(img: np.ndarray, feather: float = 0.25) -> np.ndarray:
    """`feather` — szerokość strefy wtapiania jako ułamek boku."""
    h, w = img.shape[:2]
    rolled = np.roll(np.roll(img, h // 2, axis=0), w // 2, axis=1)

    # Maska: 1 na środku przesuniętego obrazu, 0 przy jego krawędziach. Szwy
    # przesuniętej kopii leżą dokładnie przy krawędziach, więc maska je wycina.
    fy, fx = max(int(h * feather), 1), max(int(w * feather), 1)
    ramp_y = np.clip(np.minimum(np.arange(h), h - 1 - np.arange(h)) / fy, 0, 1)
    ramp_x = np.clip(np.minimum(np.arange(w), w - 1 - np.arange(w)) / fx, 0, 1)
    mask = (ramp_y[:, None] * ramp_x[None, :]).astype(np.float32)
    mask = cv2.GaussianBlur(mask, (0, 0), min(fy, fx) / 4)[..., None]

    out = rolled * mask + img * (1 - mask)
    return np.clip(out, 0, 255).astype(np.uint8)


def check(img: np.ndarray) -> tuple[float, float]:
    """Różnica między przeciwległymi krawędziami — im bliżej 0, tym lepiej."""
    a = img.astype(np.float32)
    return (float(np.abs(a[0] - a[-1]).mean()), float(np.abs(a[:, 0] - a[:, -1]).mean()))


if __name__ == "__main__":
    src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    img = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f"nie wczytam {src}")

    before = check(img)
    out = seamless(img)
    after = check(out)

    dst.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(dst), out, [cv2.IMWRITE_WEBP_QUALITY, 88])
    print(f"  szew poziomy: {before[0]:5.1f} -> {after[0]:5.1f}")
    print(f"  szew pionowy: {before[1]:5.1f} -> {after[1]:5.1f}")
    print(f"  zapisano {dst} ({dst.stat().st_size // 1024} KB)")
