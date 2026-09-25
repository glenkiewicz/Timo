#!/usr/bin/env python3
"""
Makiety ekranu Kolekcji — SKŁADANE z wygenerowanych elementów, nie rysowane.

Sens tego skryptu: udowodnić, że kafel papieru, wyspy regionów i ramki naprawdę
składają się w ekran, zanim napiszemy komponenty. Jeśli coś tu nie pasuje —
proporcje, kolory, przycięcia — to samo nie będzie pasować w Reactcie.

Powtarzalność papieru jest tu prawdziwa: tło powstaje przez KAFLOWANIE jednego
obrazka, dokładnie tak, jak zrobi to `repeat` przy przewijaniu. Gdyby kafel
miał szew, będzie go widać na makiecie.

Uruchom:  python3 scripts/compose-map-mockups.py
"""
import json, pathlib
from PIL import Image, ImageDraw, ImageFont

W, H = 720, 1280                      # ekran telefonu, jak referencja
KIT = pathlib.Path("assets/map")
ANIM = pathlib.Path("assets/animals")
OUT = pathlib.Path("docs/mockups")
FONT = ("node_modules/@expo-google-fonts/gabarito/700Bold/Gabarito_700Bold.ttf")

NAMES = json.loads(pathlib.Path(
    "/private/tmp/claude-501/-Users-grzegorzlenkiewicz-Apps-Timo/"
    "39687943-5925-4ce4-af0e-6f611516da9c/scratchpad/names.json").read_text())

PAGE = (253, 245, 236)                # UI.page
INK = (74, 55, 38)
DOCK = (92, 122, 62)                  # zieleń doku, jak w aplikacji


def load(name):
    p = KIT / f"{name}.webp"
    return Image.open(p).convert("RGBA") if p.exists() else None


def font(size):
    return ImageFont.truetype(FONT, size)


def tile(img, w, h):
    """Wypełnij obszar kaflowaniem — to samo, co `resizeMode: repeat`."""
    out = Image.new("RGBA", (w, h))
    for y in range(0, h, img.height):
        for x in range(0, w, img.width):
            out.paste(img, (x, y))
    return out


def fit(img, w, h=None):
    h = h or round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)


def centred(draw, xy, text, f, fill=INK):
    x, y = xy
    l, t, r, b = draw.textbbox((0, 0), text, font=f)
    draw.text((x - (r - l) / 2 - l, y - (b - t) / 2 - t), text, font=f, fill=fill)


def animal_circle(canvas, cx, cy, d, animal_id=None, found=True):
    """Kółko ze zwierzęciem — ramka z assetu, portret z assets/animals."""
    # TA SAMA tarcza pod odkrytym i nieodkrytym — stan niesie zawartość krążka,
    # nie jego obwódka. Kremowy pierścień pod odkrytym czytał się jak osobna
    # grafika doklejona do rysunku.
    frame = load("slot")
    if frame is None:
        return
    frame = fit(frame, d, d)
    canvas.alpha_composite(frame, (cx - d // 2, cy - d // 2))

    if found and animal_id:
        p = ANIM / f"{animal_id}.webp"
        if p.exists():
            art = Image.open(p).convert("RGBA")
            art = fit(art, round(d * 0.66))
            canvas.alpha_composite(art, (cx - art.width // 2, cy - art.height // 2))
    elif animal_id:
        p = ANIM / f"{animal_id}.webp"
        if p.exists():
            # Nieodkryte = obrys. Działa tylko dzięki kanałowi alfa rysunku.
            art = fit(Image.open(p).convert("RGBA"), round(d * 0.56))
            sil = Image.new("RGBA", art.size, (150, 134, 110, 255))
            sil.putalpha(art.getchannel("A"))
            # Przycięcie do koła — bez tego kolce jeża wychodzą poza ramkę.
            clip = Image.new("L", (d, d), 0)
            ImageDraw.Draw(clip).ellipse([d * 0.10, d * 0.10, d * 0.90, d * 0.90], fill=255)
            layer = Image.new("RGBA", (d, d))
            layer.alpha_composite(sil, ((d - sil.width) // 2, (d - sil.height) // 2))
            layer.putalpha(Image.composite(layer.getchannel("A"),
                                           Image.new("L", (d, d), 0), clip))
            canvas.alpha_composite(layer, (cx - d // 2, cy - d // 2))


def dock(canvas, tint=None):
    """Dolny dok — tylko po to, żeby makieta miała prawdziwe proporcje ekranu."""
    d = ImageDraw.Draw(canvas)
    top = H - 150
    d.rectangle([0, top, W, H], fill=tint or DOCK)
    labels = ["Menu", "Wyprawy", "Kolekcja", "Odznaki"]
    icons = ["tab-home", "tab-expeditions", "tab-collection", "tab-badges"]
    for i, (lab, ic) in enumerate(zip(labels, icons)):
        cx = round(W * (i + 0.5) / 4)
        p = pathlib.Path(f"assets/icons/{ic}.png")
        if p.exists():
            ico = fit(Image.open(p).convert("RGBA"), 62)
            canvas.alpha_composite(ico, (cx - 31, top + 22))
        centred(d, (cx, top + 112), lab, font(20), (255, 255, 255))


# Układ mapy: region, pozycja i wielkość wyspy, oraz cztery przykładowe
# zwierzęta (id z bazy). Dwa pierwsze udajemy jako odkryte, dwa jako brakujące.
REGIONS = [
    ("patch-forest",   "Polski las",   ( 30,  120), 330, ["fox", "deer", "brown_bear", "badger"]),
    ("patch-savanna",  "Sawanna",      (390,  210), 300, ["elephant", "giraffe", "cheetah", "hippo"]),
    ("patch-ocean",    "Ocean",        ( 20,  520), 340, ["dolphin", "clownfish", "barracuda", "flounder"]),
    ("patch-arctic",   "Arktyka",      (380,  610), 310, ["arctic_fox", "beluga", "caribou", "king_penguin"]),
    ("patch-jungle",   "Dżungla",      ( 40,  880), 320, ["chimpanzee", "jaguar", "gorilla", "capybara"]),
    ("patch-mountain", "Góry",         (395,  940), 290, ["chamois", "ibex", "condor", "alpaca"]),
]


def view_region():
    """Wejście w region — kółka na tle wyprawy, jak przy tłach wypraw."""
    bg = pathlib.Path("assets/backgrounds/exp-forest-kids.webp")
    canvas = (Image.open(bg).convert("RGBA").resize((W, H), Image.LANCZOS)
              if bg.exists() else Image.new("RGBA", (W, H), (150, 180, 120, 255)))

    # Czytelność napisów na dowolnym tle — bez tego biały tekst ginie na jasnym niebie.
    veil = Image.new("RGBA", (W, 190), (0, 0, 0, 90))
    canvas.alpha_composite(veil, (0, 0))
    d = ImageDraw.Draw(canvas)
    centred(d, (W // 2, 60), "Polski las", font(40), (255, 255, 255))
    centred(d, (W // 2, 108), "62 / 172", font(24), (255, 255, 255))

    ids = ["fox", "deer", "brown_bear", "badger", "elk", "bison",
           "beaver", "hedgehog", "hare", "bat", "jay", "blackbird",
           "eagle_owl", "black_woodpecker", "kingfisher", "chamois"]
    cols, dia, gap = 3, 190, 24
    x0 = (W - cols * dia - (cols - 1) * gap) // 2
    for i, aid in enumerate(ids):
        r, c = divmod(i, cols)
        cx = x0 + c * (dia + gap) + dia // 2
        cy = 250 + r * (dia + gap + 34) + dia // 2
        if cy > H - 210:
            break
        animal_circle(canvas, cx, cy, dia, aid, found=i < 7)
        centred(d, (cx, cy + dia // 2 + 22),
                "?????" if i >= 7 else NAMES.get(aid, aid), font(19), (255, 255, 255))

    dock(canvas, "#5f7e3c")
    return canvas


def island(canvas, region_i, x, y, w, faded=False):
    """Jedna wyspa: teren, cztery kółka, tabliczka. `x` to LEWA krawędź."""
    patch_name, label, _pos, _size, ids = REGIONS[region_i % len(REGIONS)]
    patch = load(patch_name)
    if patch is None:
        return
    art = fit(patch, w)
    layer = Image.new("RGBA", (w, art.height))
    layer.alpha_composite(art)

    dia = round(w * 0.29)
    for i, (fx, fy) in enumerate([(0.24, 0.20), (0.76, 0.20), (0.24, 0.78), (0.76, 0.78)]):
        animal_circle(layer, round(w * fx), round(art.height * fy), dia,
                      ids[i] if i < len(ids) else None, found=i < 2)

    sign = fit(load("signpost"), round(w * 0.72))
    sx, sy = (w - sign.width) // 2, art.height // 2 - sign.height // 2
    layer.alpha_composite(sign, (sx, sy))
    d = ImageDraw.Draw(layer)
    centred(d, (w // 2, sy + sign.height // 2), label, font(round(w * 0.075)))

    if faded:
        layer.putalpha(layer.getchannel("A").point(lambda v: int(v * 0.55)))
    canvas.alpha_composite(layer, (x, y))
    return art.height


def view_map_swipe():
    """Ekran kolekcji: krainy wyśrodkowane w pionie, bez papieru w tle."""
    canvas = Image.new("RGBA", (W, H), PAGE + (255,))
    d = ImageDraw.Draw(canvas)

    # Te same liczby, co w komponencie: krok 0,84 szerokości, wyspa o 24 px węższa.
    step = round(W * 0.84)
    island_w = step - 24
    side = (W - step) // 2

    # Pion: wolna przestrzeń między nagłówkiem a dokiem, karuzela na jej środku.
    top, bottom = 150, H - 150
    block = fit(load("patch-forest"), island_w).height + 40 + 12
    y = top + (bottom - top - block) // 2

    # Sąsiedzi przygaszeni — to ONI mówią, że da się jechać w bok.
    island(canvas, 1, side + step, y, island_w, faded=True)
    island(canvas, len(REGIONS) - 1, side - step, y, island_w, faded=True)
    h = island(canvas, 0, side, y, island_w) or island_w

    banner = load("banner")
    if banner:
        b = fit(banner, 250)
        canvas.alpha_composite(b, (W - 275, 52))
        centred(d, (W - 275 + 125, 52 + b.height // 2), "209 / 715", font(30))
    centred(d, (200, 86), "Kolekcja zwierząt", font(38), INK)

    dots_y = y + h + 40
    cx0 = W // 2 - (11 * 16) // 2
    for i in range(11):
        r = 9 if i == 0 else 6
        d.ellipse([cx0 + i*16 - r//2, dots_y - r//2, cx0 + i*16 + r//2, dots_y + r//2],
                  fill=(107, 91, 79) if i == 0 else (223, 214, 203))

    dock(canvas)
    return canvas


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in [("collection-map", view_map_swipe),
                     ("collection-region", view_region)]:
        page = Image.new("RGBA", (W, H), DOCK + (255,))
        page.alpha_composite(fn())
        img = page.convert("RGB")
        p = OUT / f"{name}.png"
        img.save(p)
        print(f"  {p}  {img.width}x{img.height}  {p.stat().st_size // 1024} KB")
