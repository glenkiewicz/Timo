#!/usr/bin/env python3
"""
Generuje rysowane portrety zwierząt przez ToAPIs (gpt-image-2.5-flare).

Zastępuje fotografie w `assets/animals/`. Styl bierze z ikon doku — ten sam
wzorzec, co ikony wypraw — żeby kolekcja przestała być zlepkiem zdjęć i
rysunków.

Zwierzę musi zostać ROZPOZNAWALNE: pięciolatek ma odróżnić pekari od mrównika,
więc prompt prosi o poprawne cechy gatunku, a nie o dowolną słodką zwierzynę.

Opisy po angielsku siedzą w `animal_descriptions.py` — baza trzyma tylko polskie,
a model po polsku myli gatunki.

Uruchom:  python3 scripts/generate-animal-art.py <id> [<id> ...]
"""
import json, os, sys, time, urllib.request, pathlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2da9886d-0bc7-4a76-83e8-7cda509fd8ea.png")
OUT = pathlib.Path("assets/animals/_raw")

SKEL = """A single cute animal figure in EXACTLY the same style as the reference image: soft, gently three-dimensional and toy-like, rounded shapes, warm friendly colours, soft shading and a subtle outline. Children's app illustration, appealing and simple.

Animal: {S}. Keep the species clearly recognisable — correct body shape, correct markings, correct proportions — while staying cute and friendly. Full body, standing or sitting, seen from a slight three-quarter angle.

One single animal centred in the frame, filling most of the square with a small even margin. Plain pure white background, completely flat and empty, no shadow on the ground, no scenery, no frame, no border, no text, no watermark."""

from animal_descriptions import DESCRIPTIONS as ANIMALS

def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")

def fetch_file(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r, open(dest, "wb") as f:
        f.write(r.read())

def call(path, payload=None, k=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode() if payload else None,
        headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"},
        method="POST" if payload else "GET")
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)

def main(ids):
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    ids = [i for i in ids if not (OUT / f"{i}.png").exists()]
    if not ids:
        print("wszystko juz pobrane"); return
    tasks = {}
    for i in ids:
        try:
            r = call("/images/generations", {
                "model": MODEL, "prompt": SKEL.format(S=ANIMALS[i]),
                "size": "1:1", "resolution": "1k", "n": 1,
                "reference_images": [STYLE_REF]}, k)
            tasks[i] = r["id"]; print(f"  wyslano  {i:20} {r['id']}")
        except Exception as e:
            print(f"  BLAD     {i:20} {e}")
    print(f"\nzadan w kolejce: {len(tasks)}\n")
    done, t0 = 0, time.time()
    usage_total = 0.0
    while tasks and time.time() - t0 < 1200:
        time.sleep(8)
        for i, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], OUT / f"{i}.png")
                tasks.pop(i); done += 1
                u = r.get("usage") or r.get("result", {}).get("usage") or {}
                cost = u.get("total_usage") or u.get("total_cost") or u.get("cost")
                if cost is not None:
                    usage_total += float(cost)
                print(f"  gotowe   {i:20} ({int(time.time()-t0)}s)")
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {i:20} {r}"); tasks.pop(i)
    if tasks: print("\nnie zdazyly:", ", ".join(tasks))
    print(f"\npobrano {done}/{len(ids)}")
    if usage_total:
        print(f"total_usage (partia): {usage_total} centow")

if __name__ == "__main__":
    main(sys.argv[1:] or list(ANIMALS))
