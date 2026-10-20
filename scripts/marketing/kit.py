"""
Wspólne klocki grafik marketingowych Timo: paleta, czcionki, karty, tła.

Kolory to lustro `src/theme/ui.ts`, czcionki — te same pliki, których używa
aplikacja (Gabarito na nagłówki, Lexend na tekst). Dzięki temu post na
Instagramie wygląda jak ekran gry, a nie jak osobny projekt.
"""
import json, pathlib, subprocess, sys

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
CACHE = ROOT / "marketing/.cache/data.json"
FONTS = ROOT / "node_modules/@expo-google-fonts"

# Lustro `src/theme/ui.ts` — zmiana koloru w aplikacji = zmiana tutaj.
UI = {
    "canvas": "#f6f8ed", "surface": "#ffffff", "line": "#d2dbba",
    "panel": "#5d803d", "panelDeep": "#4a6830", "onLawnSoft": "#e4f1d2",
    "text": "#1e2a26", "textSoft": "#6e7e6c",
    "primary": "#1e9082", "primaryDeep": "#17756a",
    "fox": "#ec8e30", "foxDeep": "#ce7422", "foxPale": "#fdecd5",
    "gold": "#e9b42e", "goldDeep": "#c28f1b",
    "danger": "#d25e3e", "dangerDeep": "#b24528",
    "page": "#fdf5ec", "sand": "#e7dcc4",
}

# Bezpieczna strefa pionowego wideo: nad nią siedzi pasek aplikacji, pod nią
# opis i przyciski TikToka/Reels, po prawej kolumna ikon.
SAFE_TOP, SAFE_BOTTOM, SAFE_RIGHT = 200, 1540, 940


def font(size, kind="head"):
    name = {"head": "gabarito/800ExtraBold/Gabarito_800ExtraBold.ttf",
            "bold": "lexend/700Bold/Lexend_700Bold.ttf",
            "body": "lexend/500Medium/Lexend_500Medium.ttf"}[kind]
    return ImageFont.truetype(str(FONTS / name), size)


def load_data():
    """Dane gry ze zrzutu `export-data.ts`; odświeża zrzut, gdy go nie ma."""
    if not CACHE.exists():
        subprocess.run(["npx", "--yes", "tsx", "scripts/marketing/export-data.ts"], cwd=ROOT, check=True)
    return json.loads(CACHE.read_text(encoding="utf-8"))


def animal_by_id(data, animal_id):
    for a in data["animals"]:
        if a["id"] == animal_id:
            return a
    sys.exit(f"nie ma zwierzęcia o id „{animal_id}” w src/data/animals.ts")


def wrap(text, fnt, max_w):
    """Łamie tekst na linie mieszczące się w `max_w` pikseli."""
    lines, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if fnt.getlength(trial) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    # Jednoliterowy spójnik nie zostaje na końcu linii („i”, „w”, „z”…).
    for i in range(len(lines) - 1):
        head, _, last = lines[i].rpartition(" ")
        if head and len(last) == 1:
            lines[i], lines[i + 1] = head, f"{last} {lines[i + 1]}"
    return lines + [cur] if cur else lines


def fit(text, kind, max_w, max_h, start, floor=28, leading=1.18):
    """Największy rozmiar czcionki, przy którym tekst mieści się w polu."""
    size = start
    while True:
        fnt = font(size, kind)
        lines = wrap(text, fnt, max_w)
        if (len(lines) * size * leading <= max_h and all(fnt.getlength(l) <= max_w for l in lines)) or size <= floor:
            return fnt, lines, int(size * leading)
        size -= 2


def draw_lines(img, lines, fnt, line_h, box, fill, align="center"):
    """Rysuje linie wyśrodkowane w pionie w `box` = (x0, y0, x1, y1)."""
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = box
    y = y0 + ((y1 - y0) - len(lines) * line_h) / 2
    for line in lines:
        w = fnt.getlength(line)
        x = x0 + ((x1 - x0) - w) / 2 if align == "center" else x0
        d.text((x, y + (line_h - fnt.size) / 2 - fnt.size * 0.08), line, font=fnt, fill=fill)
        y += line_h


def card(w, h, fill, lip=None, radius=44, lip_h=12):
    """Zaokrąglona karta z ciemniejszą dolną krawędzią, jak przyciski 3D w grze."""
    s = 2  # rysowane 2× i zmniejszane — Pillow nie wygładza zaokrągleń
    img = Image.new("RGBA", (w * s, (h + lip_h) * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if lip:
        d.rounded_rectangle((0, lip_h * s, w * s - 1, (h + lip_h) * s - 1), radius * s, fill=lip)
    d.rounded_rectangle((0, 0, w * s - 1, h * s - 1), radius * s, fill=fill)
    return img.resize((w, h + lip_h), Image.LANCZOS)


def text_card(text, w, h, fill, lip, color, kind="head", start=64, pad=44, radius=44):
    img = card(w, h, fill, lip, radius)
    fnt, lines, lh = fit(text, kind, w - 2 * pad, h - 2 * pad * 0.6, start)
    draw_lines(img, lines, fnt, lh, (pad, 0, w - pad, h), color)
    return img


def backdrop(name, size=(1080, 1920)):
    """Tło sceny przycięte od góry — niebo i las u góry, trawa pod spodem, jak w grze."""
    src = Image.open(ROOT / f"assets/backgrounds/{name}.webp").convert("RGB")
    w, h = size
    scaled = src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
    if scaled.height < h:  # tła 9:16 (np. ocean) — wypełniamy kadr
        scaled = src.resize((round(src.width * h / src.height), h), Image.LANCZOS)
        x = (scaled.width - w) // 2
        return scaled.crop((x, 0, x + w, h))
    return scaled.crop((0, 0, w, h))


def habitat_backdrop(animal):
    """Tło pasujące do zwierzęcia — tylko na odsłonę, bo samo jest podpowiedzią."""
    a = animal["attributes"]
    for key, name in (("lives_in_arctic", "exp-ice-land"), ("lives_in_ocean", "exp-water-giants"),
                      ("lives_in_water", "exp-water-friends"), ("lives_in_jungle", "exp-green-jungle"),
                      ("lives_on_farm", "exp-farm-timo"), ("lives_in_africa", "exp-savanna-kids"),
                      ("lives_at_home", "exp-home-pets-friends"), ("lives_in_forest", "exp-forest-kids")):
        if a.get(key):
            return name
    return "result-forest"


def animal_art(animal, size):
    """Ilustracja zwierzęcia; bierze większy master z `gen/`, jeśli leży lokalnie."""
    master = ROOT / f"assets/animals/gen/{animal['id']}.png"
    path = master if master.exists() else ROOT / animal["image"]
    img = Image.open(path).convert("RGBA")
    box = img.getbbox()
    if box:
        img = img.crop(box)
    img.thumbnail((size, size), Image.LANCZOS)
    if max(img.size) < size:  # master mniejszy niż pole — powiększamy
        k = size / max(img.size)
        img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    return img


def short_fact(animal, limit=120):
    """Najkrótsza ciekawostka mieszcząca się w limicie — wprost z danych gry."""
    facts = sorted(animal["facts"], key=len)
    fitting = [f for f in animal["facts"] if len(f) <= limit]
    return fitting[0] if fitting else facts[0]
