#!/usr/bin/env python3
"""
SEO strony zgadujztimo.pl — składa <head> każdej podstrony (title, opis,
kanoniczny adres, Open Graph, Twitter, dane strukturalne JSON-LD) oraz
robots.txt, sitemap.xml i manifest. Pytania do schematu FAQPage czyta wprost
z <details> na stronie, więc schemat nie rozjedzie się z treścią.

Uruchom po każdej zmianie treści:  python3 scripts/build-site-seo.py
"""
import datetime
import hashlib
import html
import json
import pathlib
import re

SITE = "https://zgadujztimo.pl"
ROOT = pathlib.Path("site")
APP_ID = "6801108622"
APP_URL = f"https://apps.apple.com/pl/app/id{APP_ID}"
NAME = "Timo – zgadnij zwierzę"
OG_IMAGE = f"{SITE}/assets/img/og-image.jpg"
TODAY = datetime.date.today().isoformat()

PAGES = {
    "index.html": {
        "path": "/",
        "title": "Timo – zgadnij zwierzę | Gra dla dzieci po polsku",
        "desc": "Pomyśl o zwierzęciu, a lisek detektyw Timo zgadnie! Gra edukacyjna dla dzieci po polsku: 715 zwierząt, 24 wyprawy, głos Timo i kolekcja z ciekawostkami. Bez reklam.",
        "og_title": "Timo – zgadnij zwierzę. Gra dla dzieci po polsku",
        "priority": "1.0",
    },
    "pomoc/index.html": {
        "path": "/pomoc",
        "title": "Pomoc – najczęstsze pytania | Timo – zgadnij zwierzę",
        "desc": "Jak grać w Timo, co jest za darmo, jak anulować subskrypcję, przenieść postępy na nowy telefon i usunąć dane. Odpowiedzi na najczęstsze pytania rodziców.",
        "og_title": "Pomoc – Timo, zgadnij zwierzę",
        "priority": "0.6",
        "crumb": "Pomoc",
    },
    "regulamin/index.html": {
        "path": "/regulamin",
        "title": "Regulamin | Timo – zgadnij zwierzę",
        "desc": "Regulamin aplikacji Timo – zgadnij zwierzę: wersja darmowa i pełna, subskrypcja w App Store, konto, zwroty i reklamacje.",
        "og_title": "Regulamin – Timo, zgadnij zwierzę",
        "priority": "0.3",
        "crumb": "Regulamin",
    },
    "polityka-prywatnosci/index.html": {
        "path": "/polityka-prywatnosci",
        "title": "Polityka prywatności | Timo – zgadnij zwierzę",
        "desc": "Jakie dane przetwarza aplikacja Timo – zgadnij zwierzę, po co, komu je powierzamy i jak usunąć konto. Bez reklam, bez śledzenia, zdjęcia zostają na telefonie.",
        "og_title": "Polityka prywatności – Timo, zgadnij zwierzę",
        "priority": "0.3",
        "crumb": "Polityka prywatności",
    },
    "usun-konto/index.html": {
        "path": "/usun-konto",
        "title": "Usunięcie konta i danych | Timo – zgadnij zwierzę",
        "desc": "Jak usunąć konto i wszystkie dane w aplikacji Timo – zgadnij zwierzę: w aplikacji albo e-mailem, bez instalowania. Co usuwamy i jak anulować subskrypcję.",
        "og_title": "Usunięcie konta i danych – Timo, zgadnij zwierzę",
        "priority": "0.3",
        "crumb": "Usunięcie konta",
    },
}

PUBLISHER = {"@type": "Person", "@id": f"{SITE}/#autor", "name": "Grzegorz Lenkiewicz",
             "email": "kontakt@zgadujztimo.pl", "url": SITE}
WEBSITE = {"@type": "WebSite", "@id": f"{SITE}/#witryna", "url": f"{SITE}/", "name": NAME,
           "inLanguage": "pl-PL", "publisher": {"@id": f"{SITE}/#autor"}}
APP = {
    "@type": "MobileApplication",
    "@id": f"{SITE}/#aplikacja",
    "name": NAME,
    "description": "Gra edukacyjna dla dzieci: dziecko myśli o zwierzęciu, a lisek detektyw Timo zadaje pytania i próbuje je odgadnąć. 715 zwierząt z ciekawostkami, 24 tematyczne wyprawy, głos Timo po polsku, bez reklam.",
    "operatingSystem": "iOS, iPadOS",
    "applicationCategory": "GameApplication",
    "applicationSubCategory": "EducationalApplication",
    "inLanguage": "pl-PL",
    "audience": {"@type": "PeopleAudience", "suggestedMinAge": 4, "suggestedMaxAge": 9},
    "url": f"{SITE}/",
    "installUrl": APP_URL,
    "downloadUrl": APP_URL,
    "image": f"{SITE}/icon-512.png",
    "screenshot": [f"{SITE}/assets/img/{n}.webp" for n in ("shot-game", "shot-home", "shot-collection", "shot-animal")],
    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PLN", "availability": "https://schema.org/InStock"},
    "author": {"@id": f"{SITE}/#autor"},
    "publisher": {"@id": f"{SITE}/#autor"},
}


def version(rel):
    """Krótki skrót treści pliku — zmienia adres CSS/JS przy każdej zmianie,
    bo /assets ma w vercel.json pamięć podręczną na 30 dni."""
    return hashlib.md5((ROOT / rel).read_bytes()).hexdigest()[:8]


def text(fragment):
    """Treść HTML jako zwykły tekst (do JSON-LD)."""
    t = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def faq(page_html):
    items = re.findall(r"<details[^>]*>\s*<summary>(.*?)</summary>\s*<p>(.*?)</p>\s*</details>", page_html, re.S)
    return [{"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(a)}}
            for q, a in items]


def head(file, meta, page_html):
    url = SITE + meta["path"]
    graph = [WEBSITE, PUBLISHER]
    page = {"@type": "WebPage", "@id": f"{url}#strona", "url": url, "name": meta["title"],
            "description": meta["desc"], "inLanguage": "pl-PL", "isPartOf": {"@id": f"{SITE}/#witryna"},
            "primaryImageOfPage": OG_IMAGE, "dateModified": TODAY}
    if file == "index.html":
        graph.append(APP)
        page["about"] = {"@id": f"{SITE}/#aplikacja"}
    else:
        graph.append({"@type": "BreadcrumbList", "@id": f"{url}#okruszki", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Timo", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": meta["crumb"], "item": url}]})
        page["breadcrumb"] = {"@id": f"{url}#okruszki"}
    questions = faq(page_html)
    if questions:
        page["@type"] = ["WebPage", "FAQPage"]
        page["mainEntity"] = questions
    graph.append(page)
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    e = html.escape
    preload = ('<link rel="preload" href="/assets/img/hero-world.webp" as="image" fetchpriority="high">\n'
               if file == "index.html" else "")
    return f"""<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(meta["title"])}</title>
<meta name="description" content="{e(meta["desc"])}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Grzegorz Lenkiewicz">
<meta name="theme-color" content="#ec8e30">
<meta name="format-detection" content="telephone=no">
<meta name="apple-itunes-app" content="app-id={APP_ID}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{e(NAME)}">
<meta property="og:locale" content="pl_PL">
<meta property="og:title" content="{e(meta["og_title"])}">
<meta property="og:description" content="{e(meta["desc"])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{OG_IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Lisek Timo i napis: Pomyśl o zwierzęciu. Timo zgadnie!">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(meta["og_title"])}">
<meta name="twitter:description" content="{e(meta["desc"])}">
<meta name="twitter:image" content="{OG_IMAGE}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/Gabarito_700Bold.ttf" as="font" type="font/ttf" crossorigin>
{preload}<link rel="stylesheet" href="/assets/css/site.css?v={version("assets/css/site.css")}">
<script type="application/ld+json">
{ld}
</script>
</head>"""


def main():
    for file, meta in PAGES.items():
        p = ROOT / file
        s = p.read_text(encoding="utf-8")
        s = re.sub(r"<head>.*?</head>", lambda m: head(file, meta, s), s, count=1, flags=re.S)
        s = re.sub(r'src="/assets/js/site\.js[^"]*"', f'src="/assets/js/site.js?v={version("assets/js/site.js")}"', s)
        p.write_text(s, encoding="utf-8")
        print(f"  {file:34} FAQ: {len(faq(s))}")

    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    urls = "".join(
        f"  <url><loc>{SITE}{m['path']}</loc><lastmod>{TODAY}</lastmod><priority>{m['priority']}</priority></url>\n"
        for m in PAGES.values())
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n',
        encoding="utf-8")
    (ROOT / "site.webmanifest").write_text(json.dumps({
        "name": NAME, "short_name": "Timo", "lang": "pl", "start_url": "/", "display": "browser",
        "background_color": "#fdf5ec", "theme_color": "#ec8e30",
        "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
                  {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}],
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("  robots.txt, sitemap.xml, site.webmanifest")


if __name__ == "__main__":
    main()
