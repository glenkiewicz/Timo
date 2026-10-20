#!/usr/bin/env python3
"""
Wycina zielone tło (#00FF00) z logotypu z scripts/generate-logo.py,
usuwa zielony poblask na krawędziach i przycina kadr.

Uruchom:  python3 scripts/key-logo.py <id>
Wynik:    site/assets/img/logo.webp + site/assets/img/logo.png (do og:image itp.)
"""
import sys
import numpy as np
from PIL import Image

name = sys.argv[1]
im = np.array(Image.open(f"site/_raw/logo/{name}.png").convert("RGB")).astype(np.float32)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# „Zieloność”: o ile zielony przewyższa silniejszy z pozostałych kanałów.
green = g - np.maximum(r, b)
alpha = np.clip(1 - (green - 30) / 90, 0, 1)
# Odbarwienie zielonego poblasku na brzegach.
spill = np.clip(green, 0, None) * (1 - alpha)
g2 = np.minimum(g, np.maximum(r, b) + 8)
out = np.dstack([r, np.where(alpha < 1, g2, g), b, alpha * 255]).astype(np.uint8)
img = Image.fromarray(out, "RGBA")
img = img.crop(img.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())
img.thumbnail((900, 900), Image.LANCZOS)
img.save("site/assets/img/logo.png")
img.save("site/assets/img/logo.webp", "WEBP", quality=88, method=6)
print("logo", img.size)
