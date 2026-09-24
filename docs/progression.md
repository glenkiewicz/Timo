# Postęp gracza: poziomy, rangi i retencja

Ten dokument opisuje drabinę postępu w Timo — skąd się wzięły liczby, dlaczego
wyglądają tak, a nie inaczej, i czego w niej jeszcze brakuje. Mechanikę samej
rundy opisuje [game-design.md](game-design.md); tutaj zaczynamy w momencie, w
którym runda się skończyła i trzeba przyznać XP.

---

## 1. Cel, pod który to policzono

**Średni gracz ma dochodzić do maksymalnego poziomu przez 3–4 miesiące, przy
dziennym limicie 10 rund.**

To jest jedyne wejście do całej matematyki niżej. Limit dzienny nie jest
ograniczeniem doklejonym do krzywej — jest jej **założeniem**. Bez niego krzywa
nie broni się przed maratonem i dowolny gracz zjedzie ją w tydzień.

Limit ma też drugie zadanie: po wyczerpaniu dziennej puli gracz może kupić
kolejne rundy w sklepie. Sklep bez limitu nie ma czego sprzedawać.

> **Ani limit, ani sklep nie są jeszcze zaimplementowane.** Krzywa jest gotowa i
> przeliczona, ale jej warunek brzegowy jeszcze nie działa. Patrz §8.

---

## 2. Co było źle

Poprzedni system: **25 poziomów, 7 tytułów, krzywa 50 + 50·(*n*−1)**, łącznie
15 000 XP.

Dwa niezależne problemy:

**Za krótko.** 15 000 XP przy limicie 10 rund to ~33 dni. Trzy razy poniżej celu.

**Awans przeważnie nic nie znaczył.** Siedem tytułów rozciągniętych na 25
poziomów zmieniało się na poziomach 1, 3, 5, 8, 12, 17 i 25 — czyli osiemnaście
z dwudziestu czterech awansów nie zmieniało nazwy. Gracz na poziomie 5, 6 i 7
był tak samo „Detektywem". Numer rósł, tożsamość stała w miejscu.

---

## 3. Struktura: ranga + stopień

Drabina ma **84 poziomy: dwanaście rang po siedem stopni**.

Każdy poziom ma własną etykietę. Gracz nie jest „Detektywem" — jest
**„Detektywem 3"**. Osiemdziesiąt cztery poziomy dają osiemdziesiąt cztery
różne napisy, sprawdzone testem na unikalność.

Ostatni poziom traci numer: nie „Profesor Timo 7", tylko samo **„Profesor
Timo"**. Numer sugerowałby kolejny przystanek, a to koniec drabiny.

Podział jest też podziałem dramaturgicznym — patrz §7.

### Rangi

| # | Ranga | Poziomy | XP na wejściu | Dzień* |
| ---: | --- | --- | ---: | ---: |
| 1 | Mały tropiciel | 1–7 | 0 | 0 |
| 2 | Zwiadowca | 8–14 | 700 | 1 |
| 3 | Odkrywca | 15–21 | 2 030 | 4 |
| 4 | Czytacz śladów | 22–28 | 4 000 | 8 |
| 5 | Detektyw | 29–35 | 6 610 | 13 |
| 6 | Badacz polany | 36–42 | 9 850 | 19 |
| 7 | Mistrz polany | 43–49 | 13 730 | 26 |
| 8 | Strażnik lasu | 50–56 | 18 250 | 35 |
| 9 | Lisi mędrzec | 57–63 | 23 410 | 45 |
| 10 | Znawca zwierząt | 64–70 | 29 200 | 56 |
| 11 | Legenda lasu | 71–77 | 35 630 | 69 |
| 12 | Profesor Timo | 78–84 | 42 700 | 82 |

\* przy 52 XP na rundę i pełnych 10 rundach dziennie.

Zauważ rozkład: **pierwsze cztery rangi padają w ciągu ośmiu dni**, czyli jedna
trzecia drabiny w niecałych 10% czasu. To celowe. Dziecko, które odbije się od
gry, odbije się w pierwszym tygodniu — właśnie tam awanse muszą sypać się gęsto.

---

## 4. Krzywa XP

```
xpForLevel(n) = round((60 + 13·(n−1)) / 10) · 10
```

Liniowa, płaska, zaokrąglona do dziesiątek. Łącznie do maksa: **49 260 XP**.

### Dlaczego liniowa, a nie kwadratowa

Kwadratowa krzywa (standard w grach RPG) rozciągnęłaby końcówkę na tygodnie za
jeden awans. Tu ostatnie przejście, 83 → 84, kosztuje **1 130 XP** — niecałe
trzy dni pod limitem. Żaden poziom w całej grze nie trwa dłużej.

To wynika z tego, dla kogo jest ta gra. Pięciolatek nie ma cierpliwości na
poziom, który „się nie rusza"; długość sesji ma regulować limit dzienny, nie
rosnąca ściana XP.

### Dlaczego zaokrąglone

Bez zaokrąglenia Zwiadowca 1 kosztowałby **151 XP**. Taka liczba nie wygląda na
projekt — wygląda na błąd. Po zaokrągleniu koszty idą 60, 70, 90, 100, 110,
130, 140, **150**… i każdy kończy się zerem.

Zaokrąglenia znoszą się nawzajem: 49 260 XP wobec 49 219 przed zaokrągleniem,
czyli **0,08% różnicy**. Cel retencyjny pozostaje nietknięty.

Kosztem jest utrata wzoru zamkniętego na sumę ciągu arytmetycznego, więc koszty
i progi skumulowane trzymamy w dwóch tablicach policzonych raz przy starcie
modułu (`LEVEL_COSTS`, `CUMULATIVE`). Przy 84 poziomach to kilkaset bajtów.

---

## 5. Ile XP daje runda

Pełną tabelę nagród opisuje [game-design.md](game-design.md#ekonomia). Do
krzywej liczą się trzy składniki XP:

| Składnik | XP |
| --- | ---: |
| Ukończona runda | 20 |
| Wiedza o zwierzęciu (udział pytań bez „nie wiem") | 0–20 |
| Pierwsze odkrycie zwierzęcia | 25 |

Stąd trzy scenariusze, które wyznaczają widełki retencji:

| Profil | XP/rundę | Dni do maksa | Miesiące |
| --- | ---: | ---: | ---: |
| Gra znane zwierzęta, nic nowego | 40 | 123 | **4,1** |
| Co druga runda to nowe zwierzę | 52 | 95 | **3,1** |
| Prawie zawsze nowe zwierzę | 65 | 76 | **2,5** |

Cel 3–4 miesięcy trafiony w środku pasma. Dolna granica (2,5 mies.) wymaga
odkrywania nowego zwierzęcia niemal co rundę przez ponad dwa miesiące, co przy
715 zwierzętach jest możliwe, ale mało prawdopodobne u dziecka wracającego do
ulubieńców.

---

## 6. Migracja: nie ma jej

Poziomy istniejących graczy przeliczą się po nowej krzywej i **urosną** — profil
z 900 XP był poziomem 6, jest poziomem 9. Jednocześnie **spadnie pozycja
względna**: poziom 6 z 25 to było 24% drabiny, poziom 9 z 84 to 11%.

Stare tytuły (Mały tropiciel, Odkrywca, Detektyw, Mistrz polany, Lisi mędrzec,
Legenda lasu, Profesor Timo) znikają jako siedmiostopniowa drabina i wracają
jako część nowej dwunastki, na innych pozycjach. Gracz może stracić tytuł bez
żadnego komunikatu.

Świadoma decyzja: baza graczy jest jeszcze przed premierą, więc koszt jest
zerowy, a kod migracyjny byłby długiem na starcie. **Po premierze ta sama zmiana
wymagałaby już ekranu wyjaśniającego.**

---

## 7. Ekran awansu

`LevelUpCelebration` ma trzy warianty, bo trzy zdarzenia mają różną wagę. Na 83
awanse w całej grze rozkładają się tak:

| Zdarzenie | Ile razy | Konfetti | Nagłówek |
| --- | ---: | ---: | --- |
| Awans stopnia | 71 | 36 | NOWY POZIOM |
| Awans rangi | 11 | 64 | NOWA RANGA + „Od teraz jesteś Strażnikiem lasu!" |
| Dojście do 84 | 1 | 64 | NAJWYŻSZA RANGA + „Nie ma wyżej!" |

Po to właśnie jest podział na rangę i stopień. Gdyby każdy awans wyglądał tak
samo, 83 identyczne konfetti zamieniłyby świętowanie w przerywnik do
przeklikania. Mocna wersja musi zostać rzadka, żeby coś znaczyła.

Trzeci wariant jest osobno, bo poziom 84 to **formalnie awans stopnia** — ranga
12 zaczyna się na poziomie 78, więc bez wyjątku koniec całej drabiny dostałby
najskromniejszą scenę.

Konfetti liczy Reanimated, bez biblioteki do cząsteczek: każdy kawałek ma własne
opóźnienie, czas lotu, dryf i obrót, losowane raz w `useMemo`. Bez losowania
wszystkie spadają jednym blokiem i widać pętlę.

Scena pokazuje się **po** naliczeniu nagród (~1,4 s), żeby nie zasłonić
liczących się kafelków — dokładnie ten błąd popełniała kiedyś automatycznie
otwierana karta zwierzaka.

---

## 8. Czego brakuje

**Limit 10 rund dziennie.** Warunek, pod który policzono całą krzywą, nie
istnieje w kodzie. Dopóki go nie ma, liczby z §5 opisują grę, która jeszcze nie
działa — przy nieograniczonym graniu maks pada wielokrotnie szybciej.

**Sklep.** Miejsce, w którym gracz kupuje kolejne rundy po wyczerpaniu dziennej
puli. Bez niego limit jest samą ścianą, bez wyjścia.

To jest następny krok i te dwie rzeczy trzeba zrobić razem.

---

## 9. Gdzie to siedzi w kodzie

| Plik | Co zawiera |
| --- | --- |
| `src/features/gamification/titles.ts` | `RANKS`, `MAX_LEVEL`, `titleFor`, `rankNameFor`, `stepFor`, `isRankUp` |
| `src/features/gamification/award.ts` | `LEVEL_COSTS`, `CUMULATIVE`, `xpForLevel`, `totalXpToReach`, `levelFromXp`, `xpProgress` oraz cała ekonomia rundy |
| `src/components/gamification/LevelUpCelebration.tsx` | trzy warianty sceny awansu |
| `src/app/(tabs)/index.tsx` | awatar z poziomem, tytuł, pasek XP |
| `src/app/result.tsx` | wykrycie awansu i odpalenie sceny |
| `src/data/info-tooltips.ts` | opis systemu dla gracza (`TOOLTIPS.level`) |

`MAX_LEVEL` jest eksportowany z `titles.ts` i importowany przez `award.ts`, a nie
odwrotnie — liczba poziomów wynika z liczby rang (`RANKS.length × 7`), więc
dopisanie trzynastej rangi automatycznie wydłuża krzywę.

---

## 10. Jak to sprawdzono

- **Wszystkie 84 koszty podzielne przez 10** — filtr na tablicy, zero wyjątków.
- **Spójność progów:** dla każdego poziomu *n* zachodzi `levelFromXp(próg(n)) === n`
  oraz `levelFromXp(próg(n) − 1) === n − 1`. Żaden poziom nie gubi ani nie
  zagarnia XP na granicy.
- **84 unikalne etykiety na 84 poziomy.**
- **Clamping:** poziom 0 → „Mały tropiciel 1", poziom 999 → „Profesor Timo".
- **Wykrywanie rangi:** `isRankUp(7, 8) === true`, `isRankUp(8, 9) === false`.
- **Profil 900 XP:** poziom 9, „Zwiadowca 2", pasek 50/160 XP.
- `npx tsc --noEmit`: 21 błędów, wszystkie w bazie zastanej
  (`scripts/generate-*`, `(tabs)/_layout.tsx`, `src/tw/index.tsx`), zero nowych.

Czego **nie** sprawdzono: sceny awansu na urządzeniu po tej zmianie. Ekrany są
za logowaniem Supabase, a emulator po ponownej instalacji nie ma sesji.
Poprzednia wersja sceny była weryfikowana wizualnie; od tego czasu zmieniły się
w niej napisy, liczba konfetti i jeden prop.
