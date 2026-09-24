#!/usr/bin/env python3
"""
Makiety nowego wyglądu zakładki Kolekcja — trzy warianty przez ToAPIs.

Model: gpt-image-2.5-sunburst, wyższy wariant rodziny, którą sprawdziliśmy przy
assetach. Referencją jest zrzut obecnego ekranu, żeby makieta trzymała paletę,
styl zwierząt i — co ważne — NIETKNIĘTE dolne menu.

To wizualizacje do rozmowy, nie specyfikacja. Tekst z generatora bywa
zniekształcony i nie ma go co poprawiać na tym etapie.
"""
import json, os, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-sunburst"
# Wzorcem jest teraz wariant C (półki w chatce) — nowe widoki mają trzymać
# tę samą chatkę, drewno i dolne menu.
REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
       "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/b76f2b79-f6f3-4c70-9e45-fbfce88fc6f5.png")
OUT = pathlib.Path("docs/mockups")

COMMON = """Mobile app screen mockup for a Polish children's animal-guessing app, vertical phone screen.

Keep from the reference image: the warm sand and cream palette, the soft rounded
children's-book illustration style, the cute toy-like animal figures, and the
GREEN BOTTOM NAVIGATION BAR exactly as it is — four items with small drawn icons
labelled Menu, Wyprawy, Kolekcja, Odznaki, with Kolekcja highlighted.

Header stays a compact top bar with a round back button and the title
"Kolekcja zwierząt".

{BODY}

Clean flat UI illustration, soft shadows, no photorealism, no device frame, no
hands, no extra text beyond the labels described."""

VARIANTS = {
    "c1-pokoj": """The screen shows the COLLECTION ROOM overview — no long scrolling,
everything fits one screen. On the warm wooden cabin wall hang SEVEN small glass
display cabinets arranged in a tidy grid, two per row. Each cabinet has a brass
name plate and holds two or three tiny animal figurines plus empty spots, and a
small counter underneath. The plates read, in this order:
"Ssaki 34/241", "Ptaki 18/135", "Ryby 9/94", "Gady 7/65", "Owady 5/65",
"Plazy 3/24", "Inne 12/91".
A hanging lantern, a potted plant and a striped rug keep the cosy collector feel.
Each cabinet looks tappable, like a door that opens.""",

    "c2-polki-grupy": """The screen shows ONE GROUP opened — the mammals cabinet.
Under the header there is a row of small rounded filter pills with tiny drawn
icons, the first one highlighted: "Wszystkie", "Polski las", "Sawanna".
Below, warm wooden shelves fill the screen and continue past the bottom edge to
show the list scrolls. Each shelf holds four little animal figurines on round
wooden bases, with the animal name on a small label under each base. Figurines
the child owns are full colour; missing ones are pale flat silhouettes standing
in the same spot. A brass plate at the top of the shelves reads "Ssaki 34 / 241".""",
}


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


def main():
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for name, body in VARIANTS.items():
        r = call("/images/generations", {
            "model": MODEL, "prompt": COMMON.format(BODY=body),
            "size": "9:16", "resolution": "1k", "n": 1,
            "reference_images": [REF]}, k)
        tasks[name] = r["id"]
        print(f"  wyslano  {name:12} {r['id']}", flush=True)

    t0 = time.time()
    while tasks and time.time() - t0 < 900:
        time.sleep(8)
        for name, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], OUT / f"{name}.png")
                tasks.pop(name)
                print(f"  gotowe   {name:12} ({int(time.time()-t0)}s)", flush=True)
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {name:12} {r.get('error', {}).get('message', '')[:80]}", flush=True)
                tasks.pop(name)


if __name__ == "__main__":
    main()
