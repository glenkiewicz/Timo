---
name: timo-content-week
description: Przygotowuje komplet postów Timo na kolejny tydzień (TikTok, Instagram, X) — plan, filmy, karuzele, podpisy i stronę podglądu do akceptacji. Użyj, gdy użytkownik prosi o „posty na tydzień”, „kontent na przyszły tydzień”, „przygotuj tydzień” albo gdy odpala się czwartkowy przebieg.
---

# Tydzień treści Timo

Wynikiem jest katalog `marketing/out/<rok>-W<nr>/` z plikiem `plan.json`,
mediami i stroną `podglad.html`. **Ta umiejętność niczego nie publikuje** —
wszystkie posty kończą ze statusem `draft` i czekają na właściciela.

Zanim zaczniesz, przeczytaj `marketing/brand.md` (ton, zasady twarde)
i `marketing/calendar.md` (siatka tygodnia, rejestr wykorzystanych tematów).

## 1. Ustal tydzień i tematy

- Tydzień docelowy to **następny** tydzień ISO (pon.–niedz.), chyba że użytkownik wskaże inny.
- Odśwież dane gry: `npx --yes tsx scripts/marketing/export-data.ts`.
- Wybierz zwierzęta i tematy według „Zasad doboru” w kalendarzu. Zwierzęta
  bierz wyłącznie z `marketing/.cache/data.json`; sprawdź w rejestrze, że nie
  wracają za wcześnie.
- Terminy weź z siatki tygodnia, jako ISO ze strefą polską (np. `2026-10-05T17:30:00+02:00`).

## 2. Wyprodukuj media

Katalog tygodnia podawaj jako `--out=marketing/out/<tydzień>`.

| Format | Polecenie |
| --- | --- |
| Zgadnij zwierzę (wideo) | `python3 scripts/marketing/make-guess-video.py <id> [<id>…] --out=…` |
| Ciekawostka (karuzela) | `python3 scripts/marketing/make-carousel.py --animal=<id> --out=…` |
| Dla rodzica / kulisy (karuzela) | napisz spec JSON (wzór w nagłówku skryptu), potem `make-carousel.py --spec=… --out=…` |
| Dziennik twórcy (X) | sam tekst; materiał z `git log --since="7 days ago"` i `docs/` |

Film „zgadnij” odrzuca zwierzę, dla którego nie ma 3 jednoznacznych pytań —
wtedy wybierz inne. Obok każdego pliku powstaje `.json` z danymi do podpisu.

Nowe ujęcia z generacji AI (kulisy, najwyżej jedno w miesiącu) rób wzorem
`scripts/generate-timo-talk.py` przez ToAPIs i zaznacz w `note`, że post wymaga
etykiety „treść AI”.

## 3. Napisz podpisy

- TikTok/Instagram: 1–3 zdania do rodzica, potem stałe wezwanie do działania
  i 3–5 hasztagów z `brand.md`. Przy filmie „zgadnij” pierwsze zdanie to
  zaczepka bez zdradzania odpowiedzi („Cztery podpowiedzi. Ile potrzebuje Twoje dziecko?”).
- X: do 270 znaków, pierwsza osoba, jeden konkret. Bez hasztagów.
- Liczby i fakty przepisuj z pliku `.json` obok medium, nie z pamięci.

## 4. Zapisz `plan.json`

```json
{
  "week": "2026-W41",
  "posts": [
    {
      "id": "w41-1",
      "title": "Zgadnij zwierzę: żyrafa",
      "format": "guess",
      "platforms": ["tiktok", "instagram"],
      "date": "2026-10-05T17:30:00+02:00",
      "caption": "…",
      "media": ["guess-giraffe.mp4"],
      "status": "draft",
      "note": ""
    }
  ]
}
```

`media` to ścieżki względem katalogu tygodnia (karuzela: wszystkie slajdy po
kolei, np. `fact-hedgehog/01.png`). `format`: `guess`, `fact`, `parent`,
`backstage`, `diary`. Post na X ma własny wpis, bo ma inny tekst.

## 5. Sprawdź własną pracę

Dla każdego posta, zanim pokażesz cokolwiek użytkownikowi:

- **Fakty**: każda liczba i stwierdzenie o zwierzęciu w podpisie i na grafice
  występuje w `data.json` dla tego zwierzęcia. Rozjazd → popraw albo usuń post.
- **Obraz**: wytnij klatki (`ffmpeg -ss <t> -i film.mp4 -frames:v 1 klatka.png`)
  z pytania, odsłony i planszy końcowej i obejrzyj je; slajdy karuzeli obejrzyj
  wszystkie. Szukaj uciętego tekstu, tekstu poza bezpieczną strefą, pustych kart.
- **Wideo**: `ffprobe` — 1080×1920, 15–30 s, jest ścieżka dźwiękowa.
- **Ton**: zgodny z tabelą Tak/Nie w `brand.md`; brak płci dziecka i rodzica.
- **Powtórki**: żaden temat z rejestru w `calendar.md` nie wraca za wcześnie.

## 6. Pokaż do akceptacji

`python3 scripts/marketing/make-preview.py marketing/out/<tydzień> --open`

Zakończ krótką listą postów (identyfikator, dzień, temat) i powiedz, że
czekają na decyzję. Gdy użytkownik odpowie, zmień w `plan.json` statusy na
`approved` / `rejected`, nanieś poprawki (po zmianie medium wyrenderuj je
ponownie), a wysyłkę zostaw umiejętności `timo-publish`.
