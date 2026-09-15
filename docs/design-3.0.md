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

## Trzy kierunki (decyzja podjęta: A)

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

**Decyzja: A — Polana.** Baza przyjęta. Do dopracowania zgłoszono cienie, tła
i gradienty — poniżej wynik tej pracy, gotowy do przepisania na tokeny.

## Światło i głębia

Jedno źródło światła: z góry, lekko z przodu. Cień nigdy nie jest czarny — to
atrament `#1E2A26` w niskiej alfie, dzięki czemu zostaje ciepły jak płótno i nie
brudzi bieli kart.

### Tło = trzy warstwy, zawsze w tej kolejności

1. **Kość** `#FBF9F6` — nigdy `#FFFFFF`. Biel zostaje wyłącznie dla kart, więc
   karta ma z czego się „podnieść".
2. **Poświata nieba** — `radial-gradient(120% 80% at 50% -10%, <ton>, transparent 62%)`,
   wysokość ~400 px. Ton niesie nastrój ekranu: Polana `#E4F0EE` (poranek),
   gra `#E2EDF2` (chłód skupienia), wynik `#FBEDDC` (słońce), kolekcja `#E9F1EC`.
3. **Horyzont** — elipsa `border-radius: 50% 50% 0 0 / 26% 26% 0 0`, gradient
   `#E7F1E5 → transparent`, na górnej krawędzi rant światła
   `1.5px rgba(46,128,121,0.14)`. Na Home dwa pasma (dalsze przy 55% krycia)
   dają głębię bez ilustracji.

Do tego **jeden** bloom „słońca" na ekran: koło poza kadrem, akcent przy
16–20% krycia. Dwa blomy czytają się jak plama, nie jak światło.

### Drabina cieni

Każdy stopień to dwie warstwy: twardy cień kontaktowy plus szerokie otoczenie z
ujemnym spreadem. To jest różnica między „przedmiotem leżącym na płótnie" a
rozmytą poświatą.

| Stopień | Zastosowanie | Wartość |
| --- | --- | --- |
| `e0` | czipy, statystyki, przyciski ikonowe | `0 1px 2px rgba(30,42,38,.04)`, `0 2px 8px rgba(30,42,38,.05)` |
| `e1` | karty, kafelki kolekcji, odpowiedzi | `0 1px 2px rgba(30,42,38,.04)`, `0 8px 24px -6px rgba(30,42,38,.10)` |
| `e2` | dymek Timo, karta pytania, okaz | `0 2px 4px rgba(30,42,38,.05)`, `0 16px 40px -10px rgba(30,42,38,.14)` |
| `e3` | dok nawigacji, modal | `0 4px 8px rgba(30,42,38,.06)`, `0 24px 56px -12px rgba(30,42,38,.18)` |

Powierzchnie na `e2`/`e3` dostają rant światła `inset 0 1px 0 rgba(255,255,255,.9)`.
Wklęsłe elementy (tor paska XP) odwracają kierunek: `inset 0 1px 2px rgba(30,42,38,.06)`.

**Poświata akcentu** — wyłącznie pod akcją główną:
`0 8px 20px -4px rgba(227,138,53,.45)`. Jedna na ekran. Wciśnięcie: skala `0.97`
i poświata do `0 3px 10px -2px` — przycisk „siada", zamiast chować półkę.

### Gradient ma pięć miejsc

Wolno: poświata nieba, horyzont, słońce, wypełnienie CTA, pasek postępu wraz z
awatarem poziomu. Nie wolno: tła kart, teksty, ikony, nakładki na zdjęcia
zwierząt, więcej niż dwa przystanki barwy.

Na Androidzie `boxShadow` z RN 0.85 renderuje obie warstwy poprawnie, ale
`elevation` nie zna ujemnego spreadu — kafelki kolekcji trzeba zmierzyć na
słabszym urządzeniu i w razie potrzeby zejść na tej liście do `e0`.

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
