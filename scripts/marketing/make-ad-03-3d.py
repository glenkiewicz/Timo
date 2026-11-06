#!/usr/bin/env python3
"""
Ujęcia 3D (AI) do reklamy TikTok nr 3 „Czego uczy się dziecko?” — przez ToAPIs.
Ten sam mechanizm co make-ad-02-3d.py, inne ujęcia:

  atlas     — Timo z lupą nad wielkim otwartym atlasem zwierząt
  highfive  — Timo przybija piątkę z kamerą

Uruchom:  python3 scripts/marketing/make-ad-03-3d.py stills|videos [<ujęcie> ...] [--force]
"""
import importlib.util, pathlib, sys

spec = importlib.util.spec_from_file_location("ad2", pathlib.Path(__file__).with_name("make-ad-02-3d.py"))
ad2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ad2)

ad2.OUT = pathlib.Path("marketing/out/ad-03")
ad2.SHOTS = {
    "atlas": (
        ad2.promo.MASTER, "",
        "a cosy sunlit study corner in a forest den, the fox sits at a wooden table and leans over a huge "
        "open picture atlas of animals (colourful illustrated pages with a lion, a whale, a parrot and a "
        "world map), holding a big round magnifying glass over the page, fascinated expression.",
        "The fox moves the magnifying glass across the atlas page, then looks up at the camera with a big "
        "excited smile and taps the page with his paw as if saying 'look at this!'. Warm light, floating "
        "dust specks, gentle slow push-in, stable framing.",
    ),
    "highfive": (
        ad2.promo.MASTER, "",
        "a bright sunny forest clearing with flowers, the fox stands close to the camera with one paw raised "
        "toward the lens for a high five, big proud smile.",
        "The fox reaches his paw toward the camera and gives a high five to the lens, then laughs, jumps "
        "happily and gives a thumbs up. Sunbeams, leaves sway, stable framing, slight camera shake on the "
        "high five.",
    ),
}

if __name__ == "__main__":
    ad2.OUT.mkdir(parents=True, exist_ok=True)
    stage = sys.argv[1]
    names = [a for a in sys.argv[2:] if not a.startswith("--")] or list(ad2.SHOTS)
    {"stills": ad2.stills, "videos": ad2.videos}[stage](names, "--force" in sys.argv)
