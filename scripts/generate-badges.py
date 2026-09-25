#!/usr/bin/env python3
"""
Ikony odznak — w ARKUSZACH, nie pojedynczo.

21 odznak to 21 wywołań API, jeśli zamawiać je osobno. Arkusz z siatką ikon to
jedno wywołanie na kilkanaście sztuk, a przy okazji wszystkie ikony z arkusza
dostają ten sam styl, światło i grubość obrysu — przy pojedynczych zamówieniach
każda wychodziła trochę inna.

Ceną jest rozdzielczość na ikonę, dlatego arkusz idzie w 2k.

Cięcie nie ufa, że model narysował równą siatkę: wycinamy tło jak przy innych
ikonach (`matte.foreground`), sklejamy odpryski (iskry płomienia, gwiazdki)
dylatacją i bierzemy spójne obszary w kolejności wierszy. Liczba obszarów musi
się zgadzać z liczbą tematów — inaczej arkusz odrzucamy zamiast przypisać
ikony do złych odznak.

Uruchom:  python3 scripts/generate-badges.py [gen|cut] [<arkusz> ...]
"""
import json, sys, time, urllib.request, pathlib

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, "scripts")
from matte import _bg, K3  # noqa: E402

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-flare"
# Ten sam arkusz referencyjny, co ikony wypraw (ikony doku).
STYLE_REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
             "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/2da9886d-0bc7-4a76-83e8-7cda509fd8ea.png")
RAW = pathlib.Path("assets/badges/_raw")
OUT = pathlib.Path("assets/badges")
SIZE = 256

SKEL = """A sheet of {N} separate app icons in EXACTLY the same style as the reference image: soft, gently three-dimensional toy-like objects with rounded shapes, warm friendly colours, soft shading and a subtle outline. Children's app icons, cute and simple, readable at small size. All icons share the same lighting, outline weight and level of detail.

Arrange them in a neat grid of {ROWS} rows with {COLS} icons per row{LAST}, reading left to right, top to bottom, in exactly this order:
{LIST}

Each icon is one single object, the same size as the others, centred in its own grid cell with generous empty white space between icons so that no two icons touch or overlap. Plain pure white background, completely flat and empty, no shadows on the ground, no scenery, no frames, no borders, no grid lines, no text, no letters, no numbers, no watermark."""

# Kolejność = kolejność w arkuszu. Obiekty bez liczb i napisów: model psuje cyfry,
# a dziecko i tak czyta obrazek, nie liczbę.
SHEETS = {
 "a": [
  ("first_win",       "a small green sprout with two leaves growing from a mound of soil"),
  ("first_loss",      "a single orange jigsaw puzzle piece"),
  ("streak_3",        "a bright orange flame"),
  ("streak_5",        "a brown detective hat lying next to a magnifying glass"),
  ("streak_10",       "a round gold medal on a red ribbon"),
  ("daily_streak_7",  "a small green tear-off desk calendar with one star on the page"),
  ("daily_streak_14", "a blue desk calendar with two stars on the page"),
  ("daily_streak_30", "a big red desk calendar with a golden crown on the page"),
  ("collector_5",     "a small brass telescope on a tripod"),
  ("collector_10",    "a red heart with a white paw print on it"),
  ("collector_25",    "a closed green photo album with a paw print on the cover"),
 ],
 "b": [
  ("collector_50",    "a stack of three colourful books"),
  ("collector_100",   "a shiny golden trophy cup with two handles"),
  ("fast_thinker",    "a yellow lightning bolt"),
  ("lightning",       "a small grey storm cloud with a yellow lightning bolt"),
  ("explorer_1",      "a rolled parchment treasure map tied with a string"),
  ("explorer_5",      "a small globe of the Earth on a wooden stand"),
  ("explorer_10",     "a brass compass with a red needle"),
  ("explorer_all",    "a golden crown with coloured gems"),
  ("night_owl",       "a crescent moon with a small sleepy owl sitting on it"),
  ("early_bird",      "a small yellow chick next to a rising sun"),
 ],
 # Ikony wysuwanych paneli z opisem (tropy, XP, poziom, zablokowana wyprawa).
 # Seria, dni, kolekcja i odznaki biorą gotowe ilustracje odznak.
 "info": [
  ("paws",   "an orange animal paw print"),
  ("xp",     "a shiny golden star with small sparkles around it"),
  ("level",  "a cute smiling orange fox head"),
  ("lock",   "a closed golden padlock"),
 ],
 # Przycisk głosu Timo na Home.
 "sound": [
  ("sound_on",  "a round orange loudspeaker with blue sound waves coming out of it"),
  ("sound_off", "the same round orange loudspeaker with a small red cross next to it and no sound waves"),
 ],
}
COLS = {"a": 3, "b": 3, "info": 2, "sound": 2}
# Ikony z zamkniętym otworem (kabłąk kłódki): zalewanie tła idzie od krawędzi
# i do środka nie dociera, więc otwór zostaje biały. Wycinamy w nich czystą
# biel zamkniętą w sylwetce — tylko tu, bo kremowe strony kalendarzy czy
# brzuszki zwierząt w innych ikonach są jasne, ale muszą zostać kryjące.
HOLES = {"lock"}
# Dokąd trafiają pocięte ikony — domyślnie odznaki.
OUT_DIR = {"info": pathlib.Path("assets/icons/info"), "sound": pathlib.Path("assets/icons/info")}


def prompt(sheet):
    items = SHEETS[sheet]
    cols = COLS[sheet]
    rows = -(-len(items) // cols)
    rest = len(items) - cols * (rows - 1)
    last = "" if rest == cols else f", except the last row which has {rest} icons centred"
    lst = "\n".join(f"{i + 1}. {s}" for i, (_, s) in enumerate(items))
    return SKEL.format(N=len(items), ROWS=rows, COLS=cols, LAST=last, LIST=lst)


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
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} dla {path}: {e.read().decode()[:300]}")


def generate(sheets):
    k = key(); RAW.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for s in sheets:
        rows = -(-len(SHEETS[s]) // COLS[s])
        size = "3:4" if rows == 4 else ("16:9" if rows == 1 else "1:1")
        res = "2k" if len(SHEETS[s]) > 4 else "1k"
        r = call("/images/generations", {
            "model": MODEL, "prompt": prompt(s), "size": size,
            "resolution": res, "n": 1, "reference_images": [STYLE_REF]}, k)
        tasks[s] = r["id"]; print(f"  wyslano  arkusz {s}  {r['id']}", flush=True)
    t0 = time.time()
    while tasks and time.time() - t0 < 1200:
        time.sleep(8)
        for s, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except SystemExit:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], RAW / f"sheet-{s}.png")
                tasks.pop(s); print(f"  gotowe   arkusz {s}  ({int(time.time() - t0)}s)", flush=True)
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    arkusz {s}  {r.get('error', {})}", flush=True); tasks.pop(s)


def cut(sheets):
    for s in sheets:
        out = OUT_DIR.get(s, OUT)
        out.mkdir(parents=True, exist_ok=True)
        items = SHEETS[s]
        rgb = np.asarray(Image.open(RAW / f"sheet-{s}.png").convert("RGB")).astype(np.uint8)
        # Nie `foreground`: ten zostawia tylko NAJWIĘKSZY kształt (jedna ikona
        # na obrazek), a tu chcemy wszystkie. Próg jak przy pozostałych ikonach.
        t = 42
        fg = ~_bg(rgb, t)
        mask = cv2.morphologyEx(fg.astype(np.uint8), cv2.MORPH_CLOSE, K3)
        h, w = mask.shape
        # Sklejamy odpryski jednej ikony, ale nie sąsiednie ikony.
        glue = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=max(4, w // 120))
        n, lab, stats, cent = cv2.connectedComponentsWithStats(glue)
        comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > (w * h) * 0.004]
        groups = [[i] for i in comps]
        if len(groups) > len(items):
            # Odpryski stojące dalej niż sięga klej (iskierki wokół gwiazdy)
            # łączymy po komórce siatki, w której leży ich środek.
            cols = COLS[s]
            rows_n = -(-len(items) // cols)
            cells = {}
            for i in comps:
                c = (int(cent[i][1] // (h / rows_n)), int(cent[i][0] // (w / cols)))
                cells.setdefault(c, []).append(i)
            groups = list(cells.values())
        if len(groups) != len(items):
            print(f"  arkusz {s}: {len(groups)} obszarow zamiast {len(items)} — nie tne")
            continue

        def centre(g):
            ys, xs = np.nonzero(np.isin(lab, g))
            return xs.mean(), ys.mean()
        gc = [centre(g) for g in groups]
        # Kolejność wierszami: grupujemy po wysokości środka, w wierszu po x.
        idx = sorted(range(len(groups)), key=lambda k: gc[k][1])
        rows, row = [], [idx[0]]
        for k in idx[1:]:
            if abs(gc[k][1] - gc[row[0]][1]) < h * 0.08:
                row.append(k)
            else:
                rows.append(row); row = [k]
        rows.append(row)
        order = [groups[k] for r in rows for k in sorted(r, key=lambda k: gc[k][0])]

        inner = cv2.erode(mask, K3, iterations=1)
        grown = cv2.inpaint(rgb, (mask - inner).astype(np.uint8), 3, cv2.INPAINT_TELEA)
        for (bid, _), g in zip(items, order):
            region_full = np.isin(lab, g)
            ys, xs = np.nonzero(region_full)
            y, x, bh, bw = ys.min(), xs.min(), ys.max() - ys.min() + 1, xs.max() - xs.min() + 1
            region = region_full[y:y + bh, x:x + bw]
            alpha = (inner[y:y + bh, x:x + bw] * region * 255).astype(np.uint8)
            if bid in HOLES:
                crop = rgb[y:y + bh, x:x + bw].astype(int)
                white = (crop.min(axis=2) >= 246).astype(np.uint8)
                k, hl, hs, _ = cv2.connectedComponentsWithStats(white)
                for j in range(1, k):
                    if hs[j, cv2.CC_STAT_AREA] > bw * bh * 0.01:
                        alpha[cv2.dilate((hl == j).astype(np.uint8), K3, iterations=2) > 0] = 0
            im = Image.fromarray(np.dstack([grown[y:y + bh, x:x + bw], alpha]), "RGBA")
            im = im.crop(im.getbbox())
            side = int(SIZE * 0.9)
            r = max(im.width, im.height)
            im = im.resize((round(im.width * side / r), round(im.height * side / r)), Image.LANCZOS)
            canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
            canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2), im)
            canvas.save(out / f"{bid}.png", optimize=True)
        print(f"  arkusz {s}: pociete {len(items)} ikon (prog {t}, {w}x{h})")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "gen"
    names = sys.argv[2:] or list(SHEETS)
    if mode == "gen":
        generate(names)
    cut(names)
