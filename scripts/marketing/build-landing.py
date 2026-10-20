#!/usr/bin/env python3
"""
Składa stronę zapisu na listę oczekujących (link w bio) do wgrania na hosting.

Bierze `marketing/landing/index.html`, wstawia adres i klucz `anon` Supabase
z `.env` (oba publiczne z założenia — danych pilnuje RLS), dokłada grafiki
z zasobów gry i zapisuje gotowy katalog statyczny.

Strony prawne i pomoc (prywatnosc.html, regulamin.html, pomoc.html) leżą obok
i dostają dane administratora z parametrów. Bez kompletu danych skrypt kończy
się błędem — pola „[[UZUPEŁNIJ: …]]” nie mogą trafić do sieci (podgląd: --draft).

Uruchom:  python3 scripts/marketing/build-landing.py --email=… --admin="…" --region="…" --date=…
          [--privacy=https://…] [--draft]
Wynik:    marketing/out/landing/  (index.html, prywatnosc.html, regulamin.html, pomoc.html,
          legal.css, timo.webp, bg.jpg, og.jpg, icon.png)
"""
import pathlib, shutil, sys

from PIL import Image

import kit
from kit import ROOT

OUT = ROOT / "marketing/out/landing"


def env(name):
    for line in open(ROOT / ".env", encoding="utf-8"):
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit(f"brak {name} w .env")


def main():
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    OUT.mkdir(parents=True, exist_ok=True)

    page = (ROOT / "marketing/landing/index.html").read_text(encoding="utf-8")
    page = page.replace("__SUPABASE_URL__", env("EXPO_PUBLIC_SUPABASE_URL").rstrip("/"))
    page = page.replace("__SUPABASE_ANON_KEY__", env("EXPO_PUBLIC_SUPABASE_ANON_KEY"))
    # Polityka leży obok strony zapisu — link względny, chyba że podano inny adres.
    page = page.replace("__PRIVACY_URL__", opts.get("privacy", "prywatnosc.html"))
    (OUT / "index.html").write_text(page, encoding="utf-8")

    fill = {
        "adres e-mail": opts.get("email"),
        "imię i nazwisko lub nazwa firmy, adres, NIP": opts.get("admin"),
        "region projektu z Supabase → Project Settings → General": opts.get("region"),
        "data publikacji": opts.get("date"),
    }
    missing = set()
    for name in ("prywatnosc.html", "regulamin.html", "pomoc.html"):
        doc = (ROOT / "marketing/landing" / name).read_text(encoding="utf-8")
        if opts.get("email"):
            doc = doc.replace("[[EMAIL]]", opts["email"])
        for label, value in fill.items():
            marker = f'<span class="todo">[[UZUPEŁNIJ: {label}]]</span>'
            if value:
                doc = doc.replace(marker, value)
        for label in fill:
            if f"[[UZUPEŁNIJ: {label}]]" in doc:
                missing.add(label)
        (OUT / name).write_text(doc, encoding="utf-8")
    shutil.copy(ROOT / "marketing/landing/legal.css", OUT / "legal.css")
    if missing and "draft" not in sys.argv[1:] and "--draft" not in sys.argv:
        sys.exit("BRAK DANYCH w stronach prawnych: " + ", ".join(sorted(missing))
                 + " — podaj --email, --admin, --region, --date (albo --draft do podglądu).")

    shutil.copy(ROOT / "assets/timo/character/timo-wave.webp", OUT / "timo.webp")
    Image.open(ROOT / "assets/images/icon.png").resize((192, 192), Image.LANCZOS).save(OUT / "icon.png")
    kit.backdrop("home-forest", (1080, 1920)).save(OUT / "bg.jpg", quality=82)

    # Obrazek podglądu linku (1200×630): tło gry, lisek i hasło.
    og = kit.backdrop("home-forest", (1200, 2100)).crop((0, 330, 1200, 960)).convert("RGBA")
    fox = Image.open(ROOT / "assets/timo/character/timo-idle.webp")
    fox.seek(0)
    fox = fox.convert("RGBA").resize((374, 550), Image.LANCZOS)
    og.alpha_composite(fox, (90, 60))
    head = kit.text_card("Pomyśl o zwierzęciu. Timo je zgadnie.", 600, 230, kit.UI["fox"], kit.UI["foxDeep"],
                         "#ffffff", start=64)
    og.alpha_composite(head, (510, 150))
    sub = kit.text_card("Gra dla dzieci · premiera wkrótce", 600, 96, kit.UI["surface"], kit.UI["line"],
                        kit.UI["text"], kind="bold", start=34, radius=48)
    og.alpha_composite(sub, (510, 420))
    og.convert("RGB").save(OUT / "og.jpg", quality=86)

    print(f"{OUT.relative_to(ROOT)}/ gotowe — podgląd: open {OUT.relative_to(ROOT)}/index.html")


if __name__ == "__main__":
    main()
