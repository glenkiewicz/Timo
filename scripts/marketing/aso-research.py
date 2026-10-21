#!/usr/bin/env python3
"""
Analiza słów kluczowych (ASO) dla polskiego App Store — na publicznych danych,
bez płatnych narzędzi. Daje PRZYBLIŻENIA, nie liczby wyszukiwań.

1. Frazy: podpowiedzi wyszukiwarki App Store (autouzupełnianie) dla słów
   bazowych i ich rozszerzeń „<słowo> a…z”.
2. Popularność (0–100): od ilu liter fraza pojawia się w podpowiedziach
   i na którym miejscu. Fraza widoczna po 3 literach na 1. miejscu ≈ bardzo
   popularna; widoczna dopiero po wpisaniu całości ≈ niszowa.
3. Trudność (0–100): siła aplikacji w top 10 wyników (log liczby ocen),
   plus to, ile z nich ma frazę w nazwie.

Wyniki: marketing/aso/keywords.csv i marketing/aso/report.md
Pamięć podręczna zapytań: marketing/aso/cache.json (ponowne uruchomienie
nie odpytuje Apple drugi raz).

Uruchom:  python3 scripts/marketing/aso-research.py
"""
import csv
import json
import math
import pathlib
import re
import time
import unicodedata
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "marketing/aso"
CACHE = OUT / "cache.json"
STOREFRONT = "143478-30,29"  # Polska, polski

SEEDS = [
    "zwierzęta", "zwierzaki", "gry zwierzęta", "gra zwierzęta", "zwierzęta dla dzieci",
    "gry dla dzieci", "gry edukacyjne", "gry edukacyjne dla dzieci", "gra edukacyjna",
    "gry dla dzieci 4", "gry dla dzieci 5", "gry dla dzieci 6", "gry dla przedszkolaków",
    "przedszkolak", "przedszkole", "dla dzieci", "nauka dla dzieci", "edukacja",
    "zagadki", "zagadki dla dzieci", "quiz", "quiz dla dzieci", "quiz zwierzęta",
    "zgadnij", "zgadnij zwierzę", "zgadnij kto to", "zgadywanka", "kalambury",
    "akinator", "lis", "lisek", "detektyw", "przyroda", "dinozaury", "farma",
    "odgłosy zwierząt", "atlas zwierząt", "encyklopedia", "ciekawostki", "wiedza",
    "logiczne myślenie", "gry logiczne dla dzieci", "gry bez reklam", "bez internetu",
    "mówiąca gra", "gry po polsku", "safari", "ocean", "kolekcja", "naklejki",
]


def fold(s: str) -> str:
    """Małe litery bez polskich znaków — podpowiedzi Apple często są bez ogonków."""
    s = s.lower().replace("ł", "l")
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


class Api:
    def __init__(self):
        self.cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
        self.dirty = 0

    def _get(self, key, url, headers, delay):
        if key in self.cache:
            return self.cache[key]
        for attempt in range(4):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", **headers})
                with urllib.request.urlopen(req, timeout=20) as r:
                    body = r.read().decode("utf-8", "replace")
                break
            except Exception:
                time.sleep(5 * (attempt + 1))
        else:
            return None
        self.cache[key] = body
        self.dirty += 1
        if self.dirty % 25 == 0:
            self.save()
        time.sleep(delay)
        return body

    def save(self):
        OUT.mkdir(parents=True, exist_ok=True)
        CACHE.write_text(json.dumps(self.cache, ensure_ascii=False))

    def hints(self, term):
        url = ("https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints"
               f"?clientApplication=Software&term={urllib.parse.quote(term)}")
        body = self._get("h:" + term, url, {"X-Apple-Store-Front": STOREFRONT}, 0.25) or ""
        terms = re.findall(r"<key>term</key>\s*<string>([^<]*)</string>", body)
        return [t.strip().lower() for t in terms]

    def search(self, term):
        url = ("https://itunes.apple.com/search?country=pl&entity=software&limit=10"
               f"&term={urllib.parse.quote(term)}")
        body = self._get("s:" + term, url, {}, 3.2)  # limit API ok. 20 zapytań/min
        try:
            return json.loads(body)["results"] if body else []
        except Exception:
            return []


def popularity(api, phrase):
    """0–100: im mniej liter trzeba wpisać i im wyżej na liście, tym popularniejsza."""
    target = fold(phrase)
    for n in range(2, len(phrase) + 1):
        prefix = phrase[:n]
        if prefix.endswith(" "):
            continue
        hits = [fold(h) for h in api.hints(prefix)]
        if target in hits:
            rank = hits.index(target)
            # Ile liter z całości trzeba było wpisać (0 = od razu, 1 = całość).
            typed = (n - 2) / max(1, len(phrase) - 2)
            return round(max(5, 100 * (1 - typed) - rank * 3))
    return 0


def difficulty(results, phrase):
    if not results:
        return 0, 0, ""
    ratings = [r.get("userRatingCount", 0) for r in results[:10]]
    strength = sum(math.log10(1 + x) for x in ratings) / len(ratings)  # 0..~5
    words = [w for w in fold(phrase).split() if len(w) > 2]
    in_title = sum(1 for r in results[:10] if words and all(w[:5] in fold(r["trackName"]) for w in words))
    score = min(100, round(strength * 18 + in_title * 2.5))
    top = "; ".join(f'{r["trackName"]} ({r.get("userRatingCount", 0)})' for r in results[:3])
    return score, in_title, top


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    api = Api()

    # 1) Zbieranie fraz z podpowiedzi
    phrases = {}
    for seed in SEEDS:
        for h in api.hints(seed):
            phrases.setdefault(fold(h), h)
        for ch in "abcdefghijklmnoprstuwz":
            for h in api.hints(f"{seed} {ch}"):
                phrases.setdefault(fold(h), h)
        print(f"  {seed:30} fraz razem: {len(phrases)}", flush=True)
    api.save()

    # Tylko frazy związane z tematem gry — reszta (np. „zgadnij piłkarza”) to szum.
    topic = re.compile(r"zwierz|dzieci|dziec|edukac|przedszk|zagad|quiz|zgad|lis|przyrod|dino|farm|"
                       r"odglos|atlas|ciekaw|logicz|nauk|safari|ocean|detekt|akinator|kalambur|wiedz")
    candidates = [p for k, p in phrases.items() if topic.search(k)]
    print(f"\nfraz po filtrze tematu: {len(candidates)}", flush=True)

    # 2) Popularność dla wszystkich, trudność dla najpopularniejszych
    rows = [{"fraza": p, "popularnosc": popularity(api, p)} for p in candidates]
    api.save()
    rows.sort(key=lambda r: -r["popularnosc"])
    for i, r in enumerate(rows[:120]):
        d, in_title, top = difficulty(api.search(r["fraza"]), r["fraza"])
        r.update(trudnosc=d, w_nazwie_top10=in_title, top3=top)
        if i % 20 == 0:
            print(f"  trudność {i}/{min(120, len(rows))}", flush=True)
    api.save()
    for r in rows:
        r.setdefault("trudnosc", "")
        r.setdefault("w_nazwie_top10", "")
        r.setdefault("top3", "")
        if r["trudnosc"] != "":
            # Szansa: popularne i łatwe — prosty iloraz do sortowania listy.
            r["szansa"] = round(r["popularnosc"] * (100 - r["trudnosc"]) / 100)
        else:
            r["szansa"] = ""

    with open(OUT / "keywords.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["fraza", "popularnosc", "trudnosc", "szansa", "w_nazwie_top10", "top3"])
        w.writeheader()
        w.writerows(rows)
    print(f"\nzapisano {len(rows)} fraz → {OUT / 'keywords.csv'}")


if __name__ == "__main__":
    main()
