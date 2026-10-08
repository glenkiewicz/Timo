#!/usr/bin/env python3
"""
Ikona aplikacji i ekran startowy — głowa Timo w tym samym stylu co animacje
(referencja: timo-talk-start.png), spokojnie: jednolite tło, bez iskierek,
motyli i ramki. iOS sam przycina ikonę do zaokrąglonego kwadratu, więc
obraz idzie na pełny kadr — narysowana ramka dublowała się z systemową.

Wynik: assets/images/_icon/<wariant>.png (1024×1024) do wyboru.
Uruchom:  python3 scripts/generate-app-icon.py [<wariant> ...]
"""
import importlib.util, json, pathlib, sys, time, urllib.request

spec = importlib.util.spec_from_file_location("outfit", "scripts/generate-timo-outfit.py")
outfit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(outfit)

OUT = pathlib.Path("assets/images/_icon")

PROMPT = (
    "App icon. Use the reference image for the character: the SAME cute fox Timo in the same soft "
    "3D children's-animation style — orange fur, cream muzzle and cheeks, dark brown ear tips, big "
    "brown eyes, green bandana. Close-up portrait: the head and the top of the shoulders with the "
    "green bandana, facing the viewer, head very slightly tilted, warm friendly closed-mouth smile, "
    "centred, the head filling about 70% of the frame. Background: {BG} — one plain flat colour "
    "with only a very soft gentle radial light behind the head. Full-bleed square, NO border, NO "
    "frame, NO rounded corners, NO sparkles, NO flowers, NO butterflies, NO text. Calm, premium, "
    "simple, readable at small size."
)

VARIANTS = {
    "forest": "a deep calm forest green (#2f6b4f)",
    "cream": "a warm soft cream (#fdf1df)",
    "teal": "a calm muted teal (#2e8a85)",
    "night": "a deep calm midnight blue (#1f3557)",
}


def main(names):
    k = outfit.key()
    ref = outfit.upload(k, outfit.MASTER)
    OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for n in names:
        if (OUT / f"{n}.png").exists():
            continue
        r = outfit.request("POST", "/images/generations", k, json.dumps({
            "model": outfit.MODEL, "prompt": PROMPT.format(BG=VARIANTS[n]), "size": "1:1",
            "resolution": "2k", "n": 1, "reference_images": [ref]}).encode(),
            {"Content-Type": "application/json"})
        tasks[n] = r["id"]
        print(f"  wyslano  {n}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for n, tid in list(tasks.items()):
            try:
                s = outfit.request("GET", f"/images/generations/{tid}", k)
            except SystemExit:
                continue
            if s.get("status") == "completed":
                req = urllib.request.Request(s["result"]["data"][0]["url"], headers={"User-Agent": "timo-assets/1.0"})
                with urllib.request.urlopen(req, timeout=180) as rr:
                    (OUT / f"{n}.png").write_bytes(rr.read())
                tasks.pop(n)
                print(f"  gotowe   {n}", flush=True)
            elif s.get("status") in ("failed", "cancelled"):
                print(f"  PADLO    {n}: {str(s)[:200]}", flush=True)
                tasks.pop(n)


if __name__ == "__main__":
    main(sys.argv[1:] or list(VARIANTS))
