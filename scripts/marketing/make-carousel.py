#!/usr/bin/env python3
"""
Karuzele na Instagram — slajdy 1080×1350 (4:5) w stylu gry.

Dwa tryby:

  ciekawostka o zwierzęciu — wszystko z danych gry, bez pisania:
      python3 scripts/marketing/make-carousel.py --animal=hedgehog

  karuzela tekstowa („dla rodzica”, kulisy) — z pliku JSON napisanego przez agenta:
      python3 scripts/marketing/make-carousel.py --spec=marketing/out/2026-W41/parent-1.json

      { "slug": "parent-20-pytan-w-aucie",
        "cover": { "kicker": "Zabawa bez ekranu", "title": "20 pytań w aucie" },
        "slides": [ { "head": "Jak grać", "body": "Jedna osoba myśli o zwierzęciu…" } ],
        "cta": "Zapisz post na następną podróż" }

Ostatni slajd (plansza Timo z zaproszeniem na listę oczekujących) dokładany jest
zawsze i zawsze taki sam.

Wynik: <katalog>/<slug>/01.png … + <slug>.json (dane do opisu posta).
"""
import json, pathlib, sys

from PIL import Image

import kit
from kit import UI, ROOT

W, H = 1080, 1350
PAD = 80


def timo(height):
    # Klatka z pętli, nie `timo.png` — tamten ma wtopiony biały cień pod łapkami,
    # który na tle lasu wygląda jak plama.
    img = Image.open(ROOT / "assets/timo/character/timo-idle.webp")
    img.seek(0)
    img = img.convert("RGBA")
    return img.resize((round(img.width * height / img.height), height), Image.LANCZOS)


def page(n, total):
    """Kartka — tło slajdu z treścią: papier dziennika, numer strony, lisek w rogu."""
    img = Image.new("RGBA", (W, H), UI["page"])
    sheet = kit.card(W - 60, H - 72, UI["surface"], UI["sand"], 56)
    img.alpha_composite(sheet, (30, 30))
    fox = timo(250)
    img.alpha_composite(fox, (W - fox.width - 50, H - fox.height - 70))
    kit.draw_lines(img, [f"{n}/{total}"], kit.font(34, "bold"), 40, (PAD, H - 150, PAD + 120, H - 100),
                   UI["textSoft"], align="left")
    return img


def cover(kicker, title, animal=None):
    bg = kit.backdrop(kit.habitat_backdrop(animal) if animal else "home-forest", (W, H)).convert("RGBA")
    tag = kit.text_card(kicker, min(W - 2 * PAD, round(kit.font(46).getlength(kicker)) + 100), 100,
                        UI["panel"], UI["panelDeep"], "#ffffff", start=46, pad=40, radius=50)
    bg.alpha_composite(tag, ((W - tag.width) // 2, 70))
    if animal:
        plate = kit.card(640, 640, UI["page"], UI["sand"], 80)
        bg.alpha_composite(plate, ((W - 640) // 2, 220))
        art = kit.animal_art(animal, 540)
        bg.alpha_composite(art, ((W - art.width) // 2, 220 + (640 - art.height) // 2))
    else:
        fox = timo(620)
        bg.alpha_composite(fox, ((W - fox.width) // 2, 230))
    head = kit.text_card(title, W - 2 * PAD, 260, UI["fox"], UI["foxDeep"], "#ffffff", start=96)
    bg.alpha_composite(head, (PAD, 920))
    hint = kit.text_card("Przesuń dalej", 300, 84, UI["surface"], UI["line"], UI["text"], kind="bold", start=36,
                         pad=30, radius=42)
    bg.alpha_composite(hint, ((W - 300) // 2, 1215))
    return bg


def content(n, total, head, body):
    img = page(n, total)
    box_w = W - 2 * PAD - 40
    if head:
        fnt, lines, lh = kit.fit(head, "head", box_w, 240, 84, floor=48)
        kit.draw_lines(img, lines, fnt, lh, (PAD + 20, 110, W - PAD - 20, 110 + len(lines) * lh), UI["foxDeep"],
                       align="left")
        top = 110 + len(lines) * lh + 50
    else:
        # Sama ciekawostka — duża, na środku kartki.
        fnt, lines, lh = kit.fit(body, "head", box_w, H - 520, 84, floor=44, leading=1.25)
        kit.draw_lines(img, lines, fnt, lh, (PAD + 20, 110, W - PAD - 20, H - 330), UI["text"], align="left")
        return img
    fnt, lines, lh = kit.fit(body, "body", box_w, H - 330 - top, 56, floor=34, leading=1.35)
    kit.draw_lines(img, lines, fnt, lh, (PAD + 20, top, W - PAD - 20, top + len(lines) * lh), UI["text"],
                   align="left")
    return img


def closing(cta):
    bg = kit.backdrop("home-forest", (W, H)).convert("RGBA")
    fox = timo(560)
    bg.alpha_composite(fox, ((W - fox.width) // 2, 120))
    rows = ((cta, 190, UI["fox"], UI["foxDeep"], "#ffffff", "head", 60),
            ("Timo — gra w zgadywanie zwierząt dla dzieci", 150, UI["surface"], UI["line"], UI["text"], "head", 46),
            ("Premiera wkrótce · zapisz się przez link w bio", 110, UI["panel"], UI["panelDeep"], "#ffffff",
             "bold", 36))
    y = 740
    for text, h, fill, lip, color, kind, start in rows:
        c = kit.text_card(text, W - 2 * PAD, h, fill, lip, color, kind=kind, start=start)
        bg.alpha_composite(c, (PAD, y))
        y += h + 36
    return bg


def main():
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    if "animal" in opts:
        data = kit.load_data()
        animal = kit.animal_by_id(data, opts["animal"])
        spec = {"slug": f"fact-{animal['id']}", "format": "fact", "animal": animal["id"], "name": animal["name"],
                "cover": {"kicker": "Czy wiesz, że…", "title": animal["name"]},
                "slides": [{"head": "", "body": f} for f in animal["facts"][:4]],
                "cta": "Zapisz, żeby opowiedzieć dziecku"}
    elif "spec" in opts:
        animal = None
        spec = json.loads(pathlib.Path(opts["spec"]).read_text(encoding="utf-8"))
    else:
        sys.exit(__doc__)

    out_root = pathlib.Path(opts.get("out", "marketing/out/_test"))
    out_root = out_root if out_root.is_absolute() else ROOT / out_root
    out = out_root / spec["slug"]
    out.mkdir(parents=True, exist_ok=True)

    total = len(spec["slides"]) + 2
    slides = [cover(spec["cover"]["kicker"], spec["cover"]["title"], animal)]
    slides += [content(i, total, s.get("head", ""), s["body"]) for i, s in enumerate(spec["slides"], 2)]
    slides.append(closing(spec["cta"]))
    files = []
    for i, img in enumerate(slides, 1):
        path = out / f"{i:02d}.png"
        img.convert("RGB").save(path, optimize=True)
        files.append(str(path.relative_to(ROOT)))

    meta = {**spec, "format": spec.get("format", "text"), "files": files}
    (out_root / f"{spec['slug']}.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{out.relative_to(ROOT)}/  {len(files)} slajdów")


if __name__ == "__main__":
    main()
