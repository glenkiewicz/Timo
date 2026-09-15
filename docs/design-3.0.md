# UI 3.0 — wyjście ze stylu Duolingo

Makiety trzech kierunków: https://claude.ai/artifact/8acU231Rd9QWP9g7Vw91ES

## Diagnoza: dlaczego to wygląda jak Duolingo

Nie „przypomina" — w kilku miejscach to jest ten sam system:

| Element | Stan obecny | Skąd znajomy |
| --- | --- | --- |
| Paleta | `#58cc02`, `#1cb0f6`, `#ffc800`, `#ff4b4b`, `#ce82ff` | to są dokładne wartości z Duolingo |
| Przycisk | pełna płaszczyzna + ciemniejsza „półka" pod spodem, chowana przy wciśnięciu | sygnaturowy przycisk Duolingo |
| Karta | biel, `border: 2px`, `border-bottom: 4px` | ich karta 1:1 |
| Tło | `#ffffff` + `#f7f7f7` | ich płaskie płótno |
| Tab bar | rząd ikon w pastelowych pigułkach akcentu | ich nawigacja |
| Typografia | Fredoka Bold, wersaliki, `letter-spacing` | odpowiednik Feather Bold |

Wniosek: zmiana samych barw nic nie da — znajomy jest **mechanizm** (płaska
płaszczyzna, twarda ramka, półka 3D, sześć równorzędnych akcentów). Wyróżnik
musi siedzieć w konstrukcji ekranu, nie w odcieniu zieleni.

## Trzy kierunki

Pełne ekrany Home i paski DNA są w makiecie. W skrócie:

- **A — Polana.** Światło dnia, zaokrąglony horyzont, powietrze. Zero ramek,
  miękka głębia, jeden akcent wiodący (bursztyn) + teal. Gabarito + Lexend.
  Najbliżej briefu („nowoczesne i lekkie"), dobrze współgra z renderowanym 3D
  Timo. Koszt: żyje z cieni i gradientów, najbliżej mainstreamu iOS.
- **B — Atlas.** Dziennik przyrodnika: papier, włoskowate linie, numerowane
  okazy, serif. Young Serif + Lexend. Najmocniejsza własna historia, świetna
  oprawa dla kolekcji 500 zwierząt. Koszt: spokojniejszy, mniej instant-nagrody
  dla pięciolatka.
- **C — Tropy.** Plakat risograficzny: ziarno, nadruk dwóch kolorów, wielkie
  liczby, kontur. Bricolage Grotesque + Space Grotesk. Najbardziej zapadający w
  pamięć. Koszt: kontrast to nie jest „lekkie", wymaga własnych ilustracji,
  3D Timo wypada obco.

Rekomendacja: **A (Polana)** jako baza, z jednym zapożyczeniem z B — ciepły,
papierowy odcień płótna zamiast czystej bieli i numerowane „okazy" w kolekcji.
To daje lekkość z briefu i własną historię tam, gdzie dziecko spędza najwięcej
czasu.

## Plan wdrożenia (niezależny od wybranego kierunku)

Kolejność wynika z tego, jak kod jest ułożony: wszystkie ekrany czytają tokeny z
`src/global.css` i `src/theme/ui.ts`, a chrome siedzi w `src/components/ui/`.

1. **Tokeny.** Przepisać `src/global.css` + `src/theme/ui.ts` na nową skalę.
   Oba pliki muszą zostać zgodne — `ui.ts` jest hex-owym lustrem dla SVG i
   natywnych propsów. Nazwy tokenów zachować (`primary`, `fox`, `sky`…) albo
   zmienić w jednym commicie razem z użyciami; typ `Accent` trzyma to w ryzach.
2. **Typografia.** Wymienić rodziny w `src/app/_layout.tsx` (`useFonts`) i
   dorzucić paczki `@expo-google-fonts/*` — wszystkie kandydatury są dostępne
   (gabarito 0.4.2, young-serif 0.4.0, bricolage-grotesque 0.4.1, lexend 0.4.1,
   space-grotesk 0.4.1). Nazwy wariantów (`Fredoka-Bold` itd.) występują w
   ~20 plikach — zamiana wsadowa plus przegląd rozmiarów, bo nowe kroje mają
   inną wysokość x.
3. **Chrome.** `Button`, `Card`, `ProgressBar`, `Bubble`, `StatBadge`,
   `FilterChip`, `ScreenHeader`, `RewardTile` — tu znika półka 3D i ramka 2/4px.
   Ekrany nie powinny wymagać zmian poza układem.
4. **Nawigacja.** `src/app/(tabs)/_layout.tsx` — pływający dok zamiast rzędu
   pigułek. Uwaga na `insets.bottom` i na to, że dok nakłada się na treść:
   ekrany potrzebują `paddingBottom`.
5. **Atmosfera ekranów.** Horyzont/tło na Home, grze i wyniku. W
   `assets/backgrounds/` leżą już `home-bg`, `game-bg`, `result-bg` — do
   wymiany albo do zastąpienia warstwami CSS.
6. **Ikony.** `src/components/ui/Icon.tsx` — cieńszy stroke (2.6 → ~1.8) i
   spójna siatka 24px.
7. **Karta zwierzęcia i kolekcja.** `AnimalTradingCard`, `collection.tsx` —
   największy zysk wizualny, bo to 500 zdjęć na jednym ekranie.

Ryzyka: `react-native-css`/NativeWind czyta tokeny z `global.css` przy
buildzie — po zmianie trzeba wyczyścić cache Metro. Cienie są droższe od ramek
na Androidzie (`elevation` vs `boxShadow`), więc przy kierunku A warto zmierzyć
listę kolekcji na słabszym urządzeniu.

Zakres: ~25 plików, bez zmian w logice gry, storach i Supabase.
