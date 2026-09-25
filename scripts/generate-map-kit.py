#!/usr/bin/env python3
"""
Elementy papierowej mapy kolekcji — generowane przez ToAPIs.

Ekran kolekcji składamy z POJEDYNCZYCH elementów: każda kraina to osobna wyspa
z kanałem alfa, a nie wycinek jednego dużego obrazka. Tylko tak da się je
przestawiać, dokładać i przewijać pojedynczo.

Uruchom:  python3 scripts/generate-map-kit.py [<nazwa> ...]
"""
import json, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"
MODEL = "gpt-image-2.5-sunburst"
# Referencja: makieta mapy od użytkownika (24.09.2026).
REF = ("https://d2ol7oe51mr4n9.cloudfront.net/"
       "user_3Jfs5KW36Va1vJpRSjNbeyS1TAY/0c8bdcba-8471-478b-8399-a84fdf32617b.png")
OUT = pathlib.Path("assets/map/_raw")

STYLE = ("Children's book illustration in exactly the same style as the reference image: "
         "hand-drawn treasure-map look, warm aged parchment, soft gouache shading, "
         "gentle rounded shapes, no photorealism, no outlines of a frame. ")
# Wyspy regionów kładziemy NA papierze, więc muszą mieć czyste tło do wycięcia.
ALPHA = " The shape sits alone on a plain pure white background, no parchment behind it, no frame, no text, no labels, no border."

PIECES = {
 # ---- papier: kafel + dwie krawędzie ----



 # ---- regiony: wyspy z alfą ----
 "patch-forest": (STYLE + "A rounded island-shaped patch of Polish pine forest seen from "
                  "slightly above: dark green spruce and pine trees, a small winding blue "
                  "stream, grey boulders and mossy ground." + ALPHA, "1:1"),

 "patch-ocean": (STYLE + "A rounded island-shaped patch of open ocean seen from slightly "
                 "above: turquoise and deep blue water with soft white wave crests, a tiny "
                 "rocky islet and a few smooth stones." + ALPHA, "1:1"),

 "patch-arctic": (STYLE + "A rounded island-shaped patch of arctic landscape seen from "
                  "slightly above: white and pale blue snow, drifting ice floes, small "
                  "jagged icebergs and a few snow-covered fir trees." + ALPHA, "1:1"),

 "patch-savanna": (STYLE + "A rounded island-shaped patch of African savanna seen from "
                   "slightly above: golden dry grass, flat-topped acacia trees, scattered "
                   "rocks, small yellow shrubs and a little watering hole." + ALPHA, "1:1"),

 "patch-jungle": (STYLE + "A rounded island-shaped patch of tropical jungle seen from "
                  "slightly above: lush layered green canopy, broad leaves, lianas, a few "
                  "bright flowers and a small waterfall." + ALPHA, "1:1"),

 "patch-mountain": (STYLE + "A rounded island-shaped patch of mountains seen from slightly "
                    "above: grey rocky peaks with snowy caps, alpine meadow at the foot, "
                    "a few small conifers and boulders." + ALPHA, "1:1"),

 "patch-australia": (STYLE + "A rounded island-shaped patch of Australian outback seen from "
                     "slightly above: red-orange earth, dry spinifex tufts, eucalyptus trees "
                     "and a weathered rock formation." + ALPHA, "1:1"),

 "patch-river": (STYLE + "A rounded island-shaped patch of a freshwater lake and river seen "
                 "from slightly above: clear blue-green water, reeds and water lilies at the "
                 "banks, a fallen log and a few pebbles." + ALPHA, "1:1"),

 "patch-farm": (STYLE + "A rounded island-shaped patch of countryside farm seen from slightly "
                "above: tidy green and ochre crop fields, a small red barn, a wooden fence "
                "and a haystack." + ALPHA, "1:1"),

 "patch-meadow": (STYLE + "A rounded island-shaped patch of summer meadow seen from slightly "
                  "above: fresh green grass, clusters of small wildflowers, a few round "
                  "bushes and a flat stone." + ALPHA, "1:1"),

 "patch-legend": (STYLE + "A rounded island-shaped patch of a prehistoric land of legends seen "
                  "from slightly above: a small smoking volcano, giant ferns and cycads, a "
                  "dinosaur footprint in the mud, one mossy standing stone with a carved "
                  "swirl and a tiny ancient castle ruin." + ALPHA, "1:1"),

 "patch-americas": (STYLE + "A rounded island-shaped patch of the American West seen from "
                    "slightly above: red sandstone mesa and canyon, a tall saguaro cactus, "
                    "golden prairie grass, a few sagebrush tufts and a small creek." + ALPHA, "1:1"),

 "patch-asia": (STYLE + "A rounded island-shaped patch of Asian landscape seen from slightly "
                "above: a bamboo grove, a stepped green rice-terrace hill, a small red "
                "pagoda-style gate, a pink cherry-blossom tree and a lotus pond." + ALPHA, "1:1"),

 # ---- elementy powtarzalne i ozdobne ----
 "signpost": (STYLE + "A simple wooden signboard: one horizontal plank of warm brown timber "
              "with soft bevelled edges, nailed to two short posts, hanging slightly askew. "
              "The plank is completely BLANK — no carving, no letters, no words." + ALPHA, "16:9"),

 "banner": (STYLE + "A small horizontal parchment scroll banner with both ends rolled up, "
            "aged cream paper, soft curl and shadow. The middle is completely BLANK — no "
            "writing, no numbers, no letters." + ALPHA, "16:9"),



 # Jedna tarcza pod KAŻDE zwierzę — odkryte i nie. Odkryte miało wcześniej
 # kremowy pierścień, ale czytał się jak osobna grafika doklejona do rysunku;
 # wspólne tło spina siatkę w całość, a stan niesie sama zawartość krążka.
 "slot": (STYLE + "An empty circular slot for a sticker: a circle of sandy beige paper "
          "slightly darker than parchment, outlined with a dashed brown line, the inside "
          "empty and flat." + ALPHA, "1:1"),

 # Pigułka statystyk na Home, grze i wyniku — ta sama tekstura co `slot`,
 # tylko rozciągnięta w stadion, żeby liczniki leżały na tym samym papierze.
 "pill": (STYLE + "An empty horizontal pill-shaped slot (a long rounded capsule, about "
          "three times wider than tall) made of sandy beige paper slightly darker than "
          "parchment, outlined with a dashed brown line running evenly along the edge, the "
          "inside empty and flat." + ALPHA, "16:9"),

 # Karta wyprawy (Home i zakładka Wyprawy) — ten sam papier i obszycie co
 # `slot` i `pill`. Kształt prawie kwadratowy i duży, bo komponent składa kartę
 # z czterech rogów: z jednego arkusza wychodzi i szeroka karta, i wąski kafel,
 # a ściegi zostają niezniekształcone (rozciąganie wydłużało kreski).
 "card": (STYLE + "An empty rounded-rectangle card, slightly wider than tall (about 4 by 3), "
          "made of sandy beige paper slightly darker than parchment, with moderately "
          "rounded corners, outlined with a dashed brown stitched line running evenly "
          "along the edge, the inside empty and flat." + ALPHA, "4:3"),
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
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        # Bez treści odpowiedzi HTTP 400 nie mówi nic — a to zwykle zła proporcja
        # albo odrzucony prompt.
        raise SystemExit(f"HTTP {e.code} dla {path}: {e.read().decode()[:300]}")


def main(names):
    k = key(); OUT.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for n in names:
        prompt, ratio = PIECES[n]
        r = call("/images/generations", {
            "model": MODEL, "prompt": prompt, "size": ratio,
            "resolution": "1k", "n": 1, "reference_images": [REF]}, k)
        tasks[n] = r["id"]
        print(f"  wyslano  {n:16} {r['id']}", flush=True)

    t0 = time.time()
    while tasks and time.time() - t0 < 1200:
        time.sleep(8)
        for n, tid in list(tasks.items()):
            try:
                r = call(f"/images/generations/{tid}", None, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], OUT / f"{n}.png")
                tasks.pop(n); print(f"  gotowe   {n:16} ({int(time.time()-t0)}s)", flush=True)
            elif st in ("failed", "cancelled"):
                print(f"  PADLO    {n:16} {r.get('error', {}).get('message','')[:70]}", flush=True)
                tasks.pop(n)
    for n in tasks:
        print(f"  ZOSTALO  {n:16} {tasks[n]}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1:] or list(PIECES))
