# Jak działa Timo

Teardown mechaniki, wrzesień 2026. Wersja do czytania w przeglądarce:
https://claude.ai/artifact/LSL1VGLTndxZvXRWsqB8Jr

Dziecko myśli o zwierzęciu, lis Timo zgaduje w dwudziestu pytaniach. Poniżej: co
dokładnie robi silnik, jak liczą się nagrody — i cztery miejsca, w których
mechanika działa przeciwko dziecku.

| | |
| --- | --- |
| zwierząt w bazie | 715 |
| ma zdjęcie | 501 |
| atrybutów i pytań | 38 |
| klipy głosu Timo | 862 |
| wypraw | 45 |
| odznak | 20 |

## Pętla jednej rundy

1. **Dziecko wybiera zwierzę w głowie.** Nigdzie go nie wpisuje — gra nie wie, o
   czym dziecko myśli, i nigdy się nie dowie, jeśli Timo nie trafi.
2. **Timo pyta.** Jedno pytanie na atrybut, każde w pięciu wariantach tekstu,
   poprzedzone losowym wtrętem osobowości. Odpowiedzi są cztery: tak, nie,
   czasem, nie wiem.
3. **Silnik zawęża pulę i punktuje kandydatów.** Dwa równoległe mechanizmy —
   twardy filtr i miękki ranking. To rozróżnienie jest kluczowe i wraca niżej.
4. **Timo strzela, gdy jest wystarczająco pewny.** Nie po ustalonej liczbie
   pytań, tylko gdy przewaga lidera nad drugim kandydatem przekroczy próg.
5. **Dziecko potwierdza albo zaprzecza.** Zaprzeczenie wyklucza zwierzę i wraca
   do pytań. Po dwudziestu pytaniach Timo się poddaje.
6. **Ekran wyniku nalicza nagrody.** Tropy, XP, poziom, seria, odznaki, postęp
   wyprawy, wynik tygodnia. Trafione zwierzę wpada do kolekcji i otwiera się
   jego karta.

Kod: `src/lib/stores/game-store.ts`, ekrany `src/app/game.tsx` i
`src/app/result.tsx`.

## Silnik: dwa systemy prawdy

Odpowiedź dziecka uruchamia dwie niezależne rzeczy. **Filtr** (`applyAnswer`)
decyduje, kto zostaje w puli. **Ranking** (`scoreAnimal`) decyduje, na kogo Timo
postawi — i liczy zupełnie inaczej.

| Odpowiedź | Co robi filtr | Punkty w rankingu |
| --- | --- | --- |
| Tak / Nie | wycina niezgodnych | +3 zgodność · +0,5 „zależy" |
| Czasem | nie wycina nikogo | +2 tylko dla „zależy" |
| Nie wiem | nie wycina nikogo | 0 |

Suma punktów jest mnożona przez popularność zwierzęcia (1,0–1,35) — ręczna lista
w `src/features/game/popularity.ts` obejmuje około 90 z 715 zwierząt, reszta ma
1,0.

### Kiedy Timo strzela

| Warunek | Próg | Skutek |
| --- | --- | --- |
| Została jedna możliwość | 1 | strzał natychmiast |
| Minimum pytań przed strzałem | 4 | wcześniej nie strzela |
| Mała pula | ≤ 3 | strzał bez względu na przewagę |
| Przewaga lidera nad drugim | ≥ 3 pkt | strzał |
| Desperacja | 13 pytań i pula ≤ 8 | strzał |
| Limit | 20 pytań | Timo się poddaje |

### Jak wybierane jest kolejne pytanie

Klasyczny zysk informacyjny, ale liczony tylko na czołówce rankingu: przez
pierwsze dwa pytania na całej puli, do piątego na trzydziestu najlepszych, potem
na piętnastu. Wygrywa pytanie najbliższe podziałowi pół na pół, z lekką karą za
kandydatów, dla których atrybut jest nieokreślony (`|yes − no| + 0,7 ×
ambiguous`). Wybór idzie losowo z kilku najlepszych — na starcie z pięciu,
później z dwóch — żeby kolejne partie nie zaczynały się tak samo.

## Tryby: swobodna gra i wyprawy

| Tryb | Pula | Widoczność |
| --- | --- | --- |
| Swobodna | 715 minus mityczne | główny przycisk |
| Wyprawa z Timo (guided) | 18 kart inspiracji | 24 wyprawy, widoczne |
| Wyprawa eksperta | pełny roster kategorii | 21 wypraw, ukryte flagą `SHOW_EXPERT_EXPEDITIONS` |

Gdy pula spadnie do zera, silnik nie poddaje się od razu: w trybie prowadzonym
rozszerza się do wypraw pokrewnych tematycznie i mówi dziecku, że chyba
pomyślało o czymś spoza kategorii; w trybie eksperta zostaje w rosterze; w
swobodnym wraca do pełnej bazy. Wyprawa dnia losuje trzy propozycje
deterministycznie z daty — tego samego dnia każdy dostaje ten sam zestaw.

## Ekonomia

Nagroda należy się za to, co robi **dziecko**, nie za to, jak poradził sobie
Timo. Trafienie i poddanie się lisa liczą się tak samo — bo w obu wypadkach
dziecko opisywało swoje zwierzę.

| Zdarzenie | Tropy | XP |
| --- | --- | --- |
| Ukończona runda | 10 | 20 |
| Wiedza o zwierzęciu (udział pytań bez „nie wiem") | do +20 | do +20 |
| Rzadkość zwierzęcia | 0–10 | — |
| Pierwsze odkrycie zwierzęcia | +10 | +25 |
| Seria od trzeciej rundy | +5 | — |
| Siódmy dzień z rzędu | +50 | — |
| Ukończona wyprawa | cel × 15 | cel × 30 |

Premia za wiedzę liczy **udział**, nie liczbę odpowiedzi — inaczej opłacałoby się
przeciągać rundę. Rzadkość odwraca `popularity.ts`: im mniej oczywiste zwierzę,
tym większa premia, więc wybieranie „psa" przestaje być optymalne. Seria liczy
ukończone rundy, nie trafienia Timo, i nie zeruje się, gdy lis się podda.

Rozważano premię za **zgodność** odpowiedzi z atrybutami zwierzęcia — odrzucona
po pomiarze: mediana 6 jawnie opisanych atrybutów na 38, a `lives_in_forest` ma
wartość tylko u 9 z 715 zwierząt. Taka premia karałaby dziecko za prawdziwe
odpowiedzi tam, gdzie brakuje danych (patrz usterka 1).

Do rankingu tygodniowego trafia XP zdobyte w danym tygodniu ISO, pod pseudonimem
liczonym z ziarna — imię dziecka nie opuszcza urządzenia.

### Poziomy i rangi

Drabina ma **84 poziomy: dwanaście rang po siedem stopni**, więc każdy poziom ma
własną etykietę („Detektyw 3", nie samo „Detektyw"). Poziom *n* wymaga
60 + 13·(*n*−1) XP zaokrąglone do dziesiątek; do maksa jest 49 260 XP.

Krzywa jest policzona pod **średnią retencję 3–4 miesięcy przy dziennym limicie
10 rund** — limitu jeszcze nie ma w kodzie.

Pełny opis, wraz z tabelą rang, wyliczeniem retencji, decyzją o braku migracji i
tym, czego brakuje: **[progression.md](progression.md)**.

## Z czego zrobiony jest Timo

Każde pytanie dostaje wtręt w jednym z trzech nastrojów — zwykłym, śmiesznym
albo szalonym, w proporcji 70/20/10 — dobrany do fazy partii: inne na starcie,
inne po ośmiu pytaniach. Pamięć ostatnich trzech wtrętów blokuje powtórki.
Całość mówi 862 nagranymi klipami odtwarzanymi z przyspieszeniem 1,75; dziecko
może wyciszyć głos jednym przyciskiem.

## Gdzie mechanika działa przeciwko dziecku

### 1. Brak danych znaczy „nie", a nie „nie wiem" (dane)

Każde zwierzę startuje z wszystkimi 38 atrybutami ustawionymi na fałsz, a autor
nadpisuje tylko te, które wypełnił. Średnia to **sześć wypełnionych pól na
zwierzę** — pozostałe 32 to zaprzeczenia, których nikt nie sprawdził, a silnik
traktuje je jak pewną wiedzę. Wartość „zależy", która jako jedyna działa jak
dżoker, występuje w całej bazie 217 razy.

```
mk('owl', 'Sowa', … { bird: 1, feathers: 1, tail: 1, legs: 1, pol: 1, fly: 1, pred: 1 })
→ is_nocturnal = false
```

Dziecko myśli o sowie, słyszy „czy jest aktywne nocą?", mówi „tak" — sowa wypada
z puli.

### 2. Dwa pytania nie mają ani jednego prawdziwego zwierzęcia (dane)

„Czy szczeka?" i „Czy miauczy lub mruczy?" są w puli pytań, ale żadne z 715
zwierząt nie ma tych atrybutów ustawionych na prawdę — łącznie z psem i kotem.
Dziecko, które odpowie zgodnie z prawdą, własnoręcznie usuwa swoje zwierzę z
gry. Pies jest przy tym najsilniej premiowanym zwierzęciem w rankingu
popularności (1,35).

Pokrycie danych dla pytań o najsłabszej obsadzie — ile z 715 zwierząt ma
ustawione „tak":

| Pytanie | Zwierząt |
| --- | ---: |
| szczeka | 0 |
| miauczy | 0 |
| ma długie uszy | 1 |
| jest małpą | 4 |
| jest gryzoniem | 5 |
| torbacz | 7 |
| żyje w lesie | 9 |
| mieszka w domu | 11 |
| żyje na farmie | 13 |
| ma rogi | 13 |
| aktywne nocą | 46 |
| *(dla porównania)* ma ogon | 508 |

### 3. Pomyłka jest nieodwracalna i niewidoczna (silnik)

Filtr wycina kandydata na stałe. Jedyne, co przywraca wyciętych, to spadek puli
do zera — dopiero wtedy włącza się rozszerzenie. Pięciolatek, który raz zawaha
się przy „czy ma futro?", przegrywa rundę bez żadnego sygnału, że coś poszło nie
tak; Timo po prostu pyta dalej i po dwudziestu pytaniach się poddaje.

### 4. Nagroda zależy od Timo, nie od dziecka — NAPRAWIONE

Było: podwójna stawka tropów za odgadnięcie w czterech pytaniach, czyli za
szybkość Timo, na którą dziecko nie ma wpływu; stan nazwany w kodzie `won`
oznaczał, że lis zgadł, a dziecko przegrało pojedynek — i właśnie za to dostawało
najwięcej; kolekcja rosła wyłącznie wtedy, gdy Timo trafił.

Jest: fazy nazwane `timo_guessed` / `child_stumped`, mnożnik za szybkość
usunięty, nagroda liczona z wiedzy dziecka i rzadkości jego zwierzęcia, a po
poddaniu się lisa dziecko **wskazuje zwierzę** i to ono wpada do kolekcji.

## Pytania, od których zależy kierunek

To są rozwidlenia, a nie usterki — każde prowadzi do innej gry. Warto je
rozstrzygnąć przed kolejną linijką kodu.

- ~~**Kto ma wygrywać?**~~ **Rozstrzygnięte: wspólne tropienie.** Dziecko jest
  przewodnikiem, Timo uczniem. Punkty należą się za wiedzę o własnym zwierzęciu,
  a poddanie się lisa jest sukcesem dziecka, nie porażką.
- **Filtr czy prawdopodobieństwo?** Przejście na model bayesowski z tolerancją
  błędu usuwa ślepe uliczki, ale wymaga przepisania silnika i innych danych.
- **715 zwierząt to atut czy balast?** Dwieście bez zdjęcia i sześć wypełnionych
  atrybutów na sztukę. Węższa, rzetelnie opisana baza może grać lepiej niż duża.
- **Skąd wziąć brakujące atrybuty?** 27 tysięcy pól do wypełnienia. Generowanie
  modelem z weryfikacją, zawężenie bazy albo zawężenie pytań do tych pokrytych
  danymi.
- **Czy drugi tryb nie jest właściwym rdzeniem?** Timo myśli, dziecko pyta i
  zgaduje. Uczy zadawania pytań zamiast odpowiadania i nie wymaga kompletnej
  bazy atrybutów.
- **Co robi przegrana?** Dziś prawie nic: piętnaście XP i brak zwierzaka. Albo
  stawka ma znaczenie, albo znika — stan pośredni nie uczy niczego.
