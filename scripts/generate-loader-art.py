#!/usr/bin/env python3
"""
Grafiki ekranu „Timo pakuje plecak” — krótkie ładowanie przed wyprawą na
Androidzie, gdy przebranie liska jeszcze się pobiera (outfit-webp.android.ts).

Ten sam styl i ta sama referencja co generate-ui-kit.py; alfę wycina
matte.cutout_raw, a gotowe WebP lądują w assets/ui/.

Uruchom:  python3 scripts/generate-loader-art.py [<nazwa> ...]
"""
import importlib.util, pathlib, sys

spec = importlib.util.spec_from_file_location("uikit", pathlib.Path(__file__).with_name("generate-ui-kit.py"))
uikit = importlib.util.module_from_spec(spec); spec.loader.exec_module(uikit)

uikit.PIECES = {
 "backpack": (uikit.STYLE + "A cute small explorer backpack for a fox cub, warm orange-brown "
              "canvas with a rounded flap, two leather buckles, a rolled-up green blanket "
              "strapped on top, a tiny brass compass hanging from a side strap and a small "
              "paw-print patch on the front pocket. Seen from the front, standing upright. "
              "Plain pure white background, no shadow, no text.", "1:1"),
 "paw": (uikit.STYLE + "A single simple paw print of a fox: one rounded main pad and four "
         "small oval toe pads, solid warm orange colour with a soft darker edge. Flat, seen "
         "from above. Plain pure white background, no shadow, no text.", "1:1"),
}

if __name__ == "__main__":
    uikit.main(sys.argv[1:] or list(uikit.PIECES))
