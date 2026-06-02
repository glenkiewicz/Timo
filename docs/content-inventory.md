# Timo — przegląd treści

Spis wszystkich danych użytkowych aplikacji: pytania, odpowiedzi, warianty, linie osobowości Liska, wyprawy, odznaki, mechanika nagród.

## Spis

1. [Statystyki — w liczbach](#1-statystyki--w-liczbach)
2. [Atrybuty zwierząt (38)](#2-atrybuty-zwierząt-38)
3. [Pytania (38) — wszystkie warianty](#3-pytania-38--wszystkie-warianty)
4. [Odpowiedzi dziecka (4)](#4-odpowiedzi-dziecka-4)
5. [Biblioteka Liska Timo — osobowość](#5-biblioteka-liska-timo--osobowość)
6. [Zwierzęta (500) — kategorie z liczbami](#6-zwierzęta-500--kategorie-z-liczbami)
7. [Wyprawy (21)](#7-wyprawy-21)
8. [Odznaki (20)](#8-odznaki-20)
9. [Tytuły poziomów (7)](#9-tytuły-poziomów-7)
10. [Mechanika nagród](#10-mechanika-nagród)
11. [Notatki / do przeglądu](#11-notatki--do-przeglądu)

---

## 1. Statystyki — w liczbach

| Element | Ile |
|---|---|
| Zwierząt | **500** |
| Atrybutów | **38** |
| Pytań (każde z ~3 wariantami) | **38** |
| Wariantów pytań łącznie | **~125** |
| Wypraw (10 biomowych + 10 tematycznych + 1 mityczna) | **21** |
| Odznak | **20** |
| Tytułów poziomów | **7** |
| Linii osobowości Liska | **~70** (prefixy + interludy + reakcje + powitania + zwycięstwa + porażki + strzały) |

---

## 2. Atrybuty zwierząt (38)

Klucze używane w drzewie decyzyjnym Timo. Każdy atrybut może mieć wartość `true / false / null` (czasem) dla każdego zwierzęcia.

**Taksonomia (6):** `is_mammal`, `is_bird`, `is_fish`, `is_reptile`, `is_amphibian`, `is_insect`

**Pokrycie ciała (4):** `has_fur`, `has_feathers`, `has_scales`, `has_shell`

**Anatomia (4):** `has_tail`, `has_legs`, `has_horns`, `has_long_ears`

**Rozmiar (2):** `larger_than_dog`, `smaller_than_cat`

**Dieta (3):** `is_predator`, `eats_plants`, `is_venomous`

**Środowisko (8):** `lives_in_water`, `lives_in_africa`, `lives_in_poland`, `lives_in_jungle`, `lives_in_ocean`, `lives_in_arctic`, `lives_in_forest`, `lives_on_farm`

**Pet/dom (1):** `lives_at_home`

**Zachowanie (4):** `is_dangerous`, `is_fast`, `is_nocturnal`, `lives_in_groups`

**Dyskryminujące (6):** `can_fly`, `barks`, `meows`, `is_rodent`, `is_primate`, `is_marsupial`

---

## 3. Pytania (38) — wszystkie warianty

Każde pytanie ma jedną główną formę (`text_pl`) + 2-4 warianty losowane podczas gry, żeby brzmienie się nie powtarzało.

### Środowisko

**🌊 `q_water` (lives_in_water)**
- Czy to zwierzę żyje w wodzie?
- Czy ono mieszka w wodzie?
- Czy spotkasz je w wodzie?

**🌍 `q_africa` (lives_in_africa)**
- Czy to zwierzę żyje w Afryce?
- Czy ono mieszka w Afryce?
- Czy spotkasz je na afrykańskiej sawannie?

**🇵🇱 `q_poland` (lives_in_poland)**
- Czy to zwierzę żyje dziko w Polsce?
- Czy ono mieszka w polskiej naturze?
- Czy spotkasz je dziko w Polsce?

**🌴 `q_jungle` (lives_in_jungle)**
- Czy to zwierzę żyje w dżungli?
- Czy ono mieszka w dżungli?
- Czy spotkasz je w gęstej dżungli?

**🐳 `q_ocean` (lives_in_ocean)**
- Czy to zwierzę żyje w oceanie?
- Czy ono mieszka w oceanie?
- Czy spotkasz je w morskiej głębinie?

**❄️ `q_arctic` (lives_in_arctic)**
- Czy to zwierzę żyje w lodowych krainach?
- Czy ono mieszka w arktycznym chłodzie?
- Czy spotkasz je na śniegu i lodzie?

**🐄 `q_farm` (lives_on_farm)**
- Czy to zwierzę żyje na farmie?
- Czy ono mieszka w gospodarstwie?
- Czy spotkasz je w wiejskiej zagrodzie?

**🌲 `q_forest` (lives_in_forest)**
- Czy to zwierzę mieszka w lesie?
- Czy ono żyje wśród drzew?
- Czy spotkasz je w głębi lasu?

**🏠 `q_home` (lives_at_home)**
- Czy ludzie trzymają to zwierzę w domu?
- Czy ono może mieszkać w domu?
- Czy bywa zwierzakiem domowym?

### Taksonomia

**🐺 `q_mammal` (is_mammal)** — Czy to ssak? / Czy to zwierzę jest ssakiem? / Czy mówimy o ssaku?
**🦅 `q_bird` (is_bird)** — Czy to ptak? / Czy to zwierzę jest ptakiem? / Czy mówimy o ptaku?
**🐟 `q_fish` (is_fish)** — Czy to ryba? / Czy to zwierzę jest rybą? / Czy mówimy o rybie?
**🦎 `q_reptile` (is_reptile)** — Czy to gad? / Czy to zwierzę jest gadem? / Czy mówimy o gadzie?
**🐸 `q_amphi` (is_amphibian)** — Czy to płaz? / Czy to zwierzę jest płazem? / Czy mówimy o płazie?
**🐛 `q_insect` (is_insect)** — Czy to owad? / Czy to zwierzę jest owadem? / Czy mówimy o owadzie?

### Pokrycie ciała

**🦱 `q_fur` (has_fur)** — Czy to zwierzę ma futro? / Czy ono ma futerko? / Czy pokryte jest futrem?
**🪶 `q_feathers` (has_feathers)** — Czy to zwierzę ma pióra? / Czy ono ma pióra? / Czy pokryte jest piórami?
**🐉 `q_scales` (has_scales)** — Czy to zwierzę ma łuski? / Czy ono ma łuski? / Czy jest pokryte łuskami?
**🐢 `q_shell` (has_shell)** — Czy to zwierzę ma twardą skorupę? / Czy ono jest schowane w skorupie? / Czy ma pancerz lub skorupę?

### Anatomia

**🦴 `q_tail` (has_tail)** — Czy to zwierzę ma ogon? / Czy ono ma ogon? / Czy ma jakiś ogonek lub ogon?
**🦵 `q_legs` (has_legs)** — Czy to zwierzę ma nogi? / Czy ono ma nogi? / Czy porusza się na nogach?
**🦌 `q_horns` (has_horns)** — Czy to zwierzę ma rogi lub poroże? / Czy ono ma rogi? / Czy widać u niego poroże?
**🐰 `q_long_ears` (has_long_ears)** — Czy to zwierzę ma długie uszy? / Czy ono ma duże, długie uszy? / Czy widać u niego sterczące długie uszy?

### Rozmiar

**🐘 `q_bigger_than_dog` (larger_than_dog)** — Czy to zwierzę jest większe od psa? / Czy ono jest większe niż pies? / Czy przerasta rozmiarem psa?
**🐭 `q_smaller_than_cat` (smaller_than_cat)** — Czy to zwierzę jest mniejsze od kota? / Czy ono jest mniejsze niż kot? / Czy zmieściłoby się obok kota?

### Dieta i zachowanie

**🦷 `q_predator` (is_predator)** — Czy to drapieżnik? / Czy to zwierzę jest drapieżnikiem? / Czy ono poluje na inne zwierzęta?
**🌿 `q_plants` (eats_plants)** — Czy to zwierzę je głównie rośliny? / Czy ono żywi się roślinami? / Czy zjada przede wszystkim trawę i liście?
**☠️ `q_venomous` (is_venomous)** — Czy to zwierzę jest jadowite? / Czy ono ma jad? / Czy potrafi ukąsić jadem?
**⚠️ `q_dangerous` (is_dangerous)** — Czy to zwierzę bywa groźne dla ludzi? / Czy ono może być niebezpieczne? / Czy lepiej trzymać się od niego z daleka?
**💨 `q_fast` (is_fast)** — Czy to zwierzę jest naprawdę szybkie? / Czy ono biega bardzo szybko? / Czy potrafi pędzić jak strzała?
**🦅 `q_fly` (can_fly)** — Czy to zwierzę potrafi latać? / Czy ono lata? / Czy umie latać? / Czy lata w powietrzu?
**🌙 `q_nocturnal` (is_nocturnal)** — Czy to zwierzę jest aktywne głównie w nocy? / Czy ono poluje i biega po zmroku? / Czy żyje przede wszystkim nocą?
**👥 `q_groups` (lives_in_groups)** — Czy to zwierzę żyje w stadzie? / Czy ono mieszka w grupie? / Czy trzyma się w stadzie lub kolonii?

### Dyskryminujące (specyficzne)

**🐕 `q_barks` (barks)** — Czy to zwierzę szczeka? / Czy ono szczeka? / Czy słychać u niego szczekanie?
**🐈 `q_meows` (meows)** — Czy to zwierzę miauczy albo mruczy? / Czy ono potrafi miauczeć lub mruczeć? / Czy słychać u niego miauczenie?
**🐀 `q_rodent` (is_rodent)** — Czy to gryzoń? / Czy to zwierzę jest gryzoniem? / Czy ono lubi gryźć i ma duże siekacze?
**🐒 `q_primate` (is_primate)** — Czy to małpa? / Czy to zwierzę jest małpą? / Czy mówimy o naczelnym?
**🦘 `q_marsupial` (is_marsupial)** — Czy to zwierzę nosi małe w kieszonce na brzuchu? / Czy ono ma torbę na brzuchu, w której nosi młode? / Czy jest torbaczem?

---

## 4. Odpowiedzi dziecka (4)

Cztery przyciski w trakcie pytania:

| Ikona | Label | Klucz | Co robi |
|---|---|---|---|
| ✓ | **Tak** | `yes` | Filtruje: zostają zwierzęta z `attr=true` lub `null` |
| ✕ | **Nie** | `no` | Filtruje: zostają zwierzęta z `attr=false` lub `null` |
| ? | **Nie wiem** | `idk` | Nie filtruje. Pytanie liczy się jako użyte, ale nie zawęża puli |
| ~ | **To zależy** | `hard` | Nie filtruje. Dodatkowo: zwierzęta z `attr=null` dostają boost +2 do score (Timo wie, że szukamy "niejednoznacznego") |

---

## 5. Biblioteka Liska Timo — osobowość

System odpowiedzi i wstępów Liska, podzielony na **fazy gry** i **mood** (tone humoru).

### 5.1 Prefiksy pytań

Wstawiane PRZED tekstem pytania. Globalny "prefix rate" zależy od fazy: **START 15%, EARLY 25%, MID 35%, LATE 45%** — reszta pytań idzie czysto.

Gdy prefix się pojawia, mood losowany według proporcji **normal 70% / funny 20% / crazy 10%**.

#### START (Q1) — brak sugestii pamięci

**Normal:**
- (puste — czyste pytanie)
- "Hmm, "
- "Sprawdźmy: "
- "Zaczynamy: "
- "Dobra, "
- "Lecimy: "

**Funny:**
- "Aha, lecimy: "
- "Spokojnie, zaczynamy. "
- "Lisi nos się rozgrzewa. "
- "Zaczynamy łowy. "
- "Pakuj lornetkę. "

**Crazy:**
- "Wskocz mi do norki na chwilę. "
- "Tylko między nami, lisami: "
- "Lisie wąsy mówią START. "

#### EARLY (Q2-Q3) — lekkie wnioskowanie

**Normal:**
- (puste)
- "Hmm, "
- "Aha, "
- "Dobra, "
- "Sprawdźmy: "
- "Idziemy dalej: "

**Funny:**
- "Lisi nos wietrzy. "
- "Otrzepuję futro: "
- "Lisi notes się otwiera. "
- "Mój ogon kiwa się leciutko. "

**Crazy:**
- "Tu się robi mistycznie. "
- "Naukowo rzecz biorąc, hehehe — "

#### MID (Q4-Q7) — Timo coś już wie

**Normal:**
- (puste)
- "Hmm, "
- "Aha, "
- "Tropimy dalej. "
- "Idziemy: "
- "Sprawdźmy jeszcze: "

**Funny:**
- "Lisi instynkt mówi… "
- "Coś mi się przypomina. "
- "Mój nos coś zwęszył… "
- "Ogon się kręci — "
- "Aha! Mała wskazówka pod łapką: "

**Crazy:**
- "To pytanie pachnie naleśnikiem. "
- "Ostrzegam, lisie wąsy mrugają: "
- "Tylko między nami, lisami: "

#### LATE (Q8+) — gorący trop

**Normal:**
- (puste)
- "Aha! "
- "Trop ciepły. "
- "Już prawie. "
- "Jeszcze chwila. "

**Funny:**
- "Czuję to w wąsach. "
- "Lisi notes się zapełnia. "
- "Mój ogon mówi: blisko, blisko. "
- "Słyszę szmer w futrze. "

**Crazy:**
- "Lisie wąsy w pełnym napięciu. "
- "Tu się robi gorąco jak naleśnik z pieca. "

### 5.2 Interludes — wtręty PRZED pytaniem

Krótkie zwroty bez funkcji informacyjnej. Tylko od MID (Q4+) i z bardzo niską częstotliwością: **MID 10%, LATE 15%**. Gdy interlude się pojawia, prefix MUSI być neutralny (anti-podwójne flavor).

**INTERLUDES_MID (Q4-Q7):**
- "Mój ogon się kręci z ciekawości. "
- "Czuję, że jesteśmy blisko. "
- "Lisi nos coś zwęszył. "
- "Trop ciepły, idziemy dalej. "
- "Coś tu jest na rzeczy. "

**INTERLUDES_LATE (Q8+):**
- "Mój ogon się kręci jak młynek. "
- "Bardzo blisko, czuję to. "
- "Lisi notes już wibruje. "
- "Tropimy go, tropimy. "

### 5.3 Reakcje (Faza 2 — przygotowane, jeszcze nie używane w UI)

**REACTION_YES** — po "Tak":
- Tak — trop ciepły!
- Świetnie, idziemy dalej.
- Aha, dobry kierunek.
- Mój nos to potwierdza.
- Lisi notes się cieszy.

**REACTION_NO** — po "Nie":
- OK, ten trop odpada.
- Hmm, nie ten kierunek.
- Nope, szukamy gdzie indziej.
- Lisi ogon kręci na bok.
- Dobrze wiedzieć — odpada.

**REACTION_IDK** — po "Nie wiem":
- Spokojnie, ja też czasem nie wiem.
- OK, ten trop pomijamy.
- Lisi nos się waha — idziemy bokiem.
- Bez problemu, sprawdzimy inaczej.

**REACTION_HARD** — po "To zależy":
- Świat jest skomplikowany, masz rację.
- Dobre stwierdzenie — bywa różnie.
- Wpisuję sobie w lisi notes: „czasem tak, czasem nie".
- Zgadza się, w naturze nic nie jest czarno-białe.

### 5.4 Powitania, zwycięstwa, porażki, strzały

**GREETINGS — start nowej rundy:**
- Pakuj lornetkę — tropimy!
- Pomyśl o zwierzęciu, a ja je znajdę.
- Lisi nos już się rozgrzewa.
- Gotów? Lisi mózg pracuje.

**VICTORY_LINES — po zgadnięciu:**
- Ha! Lisi nos miał rację!
- Brawo nam — udało się!
- Trafione, spryciarzu.
- Lisi notes ma kolejny wpis!

**GIVE_UP_LINES — po poddaniu się:**
- Oj, dziś lisi nos zawiódł.
- Przegrałem honornie. Powiedz mi, kogo wymyśliłeś!
- Nawet lis ma czasem zły dzień.

**GUESS_INTROS — przed strzałem:**
- Mój ogon coś mi szepcze… To
- Hmm, mój lisi nos zwęszył:
- Założę się, że to
- Mam przeczucie!
- Już wiem!
- Trop prowadzi mnie do:
- Lisi notes mówi:
- Czuję to w wąsach:

---

## 6. Zwierzęta (500) — kategorie z liczbami

### Podział według sekcji w `animals.ts`

Plik jest pisany w trzech batchach (`BATCH 1`, `BATCH 2 → 300`, `BATCH 3 → 500` + `BATCH 3B`). Poniższe liczby agregują wszystkie batche.

| Kategoria | Liczba | Przykłady |
|---|---|---|
| Ssaki domowe / pety | ~13 | Pies, Kot, Królik, Chomik, Świnka morska, Szczur ozdobny, Fretka, Mysz, Myszoskoczek, Szynszyla, Kanarek, Papużka falista, Gekon |
| Farma | ~16 | Krowa, Koń, Owca, Koza, Świnia, Osioł, Kura, Kogut, Kaczka, Gęś, Alpaka, Indyk, Perliczka, Muł, Lama, Jak |
| Dzikie Polski (ssaki) | ~35 | Wilk, Lis, Jeleń, Sarna, Dzik, Niedźwiedź brunatny, Ryś, Borsuk, Kuna, Łoś, Żubr, Bóbr, Wydra, Jeż, Wiewiórka, Gronostaj, Łasica, Mysz polna, Nietoperz, Kret, Ryjówka, Popielica, Kozica, Zając bielak, Zając szarak, Żbik, Nornica ruda, Rzęsorek, Tchórz, Soból, Norka europejska, Piżmak, Chomik europejski, Świstak, Koziorożec alpejski, Kret europejski, Żołędnica, Burunduk, Polatucha, Rosomak |
| Afryka (ssaki) | ~33 | Lew, Słoń, Żyrafa, Zebra, Lampart, Gepard, Hipopotam, Nosorożec, Antylopa, Gnu, Hiena, Szakal, Surykatka, Szympans, Goryl, Lemur, Mandryl, Gazela, Bawół, Guziec, Fenek, Mangusta, Dik-dik, Impala, Kudu, Eland, Oryks, Springbok, Likaon, Mrównik, Góralek, Serwal, Protel, Okapi, Łuskowiec, Miodożer, Sitatunga, Bongo, Karakal, Aj-aj, Żeneta, Zebra Grevy'ego, Adaks, Hieniak grzywiasty, Borsuk miodożerny |
| Dżungla / Azja / Ameryki (ssaki) | ~40 | Tygrys, Panda, Orangutan, Jaguar, Leniwiec, Mrówkojad, Kapibara, Gibon, Makak, Ocelot, Kangur, Koala, Dziobak, Jeżozwierz, Pancernik, Tygrys syberyjski, Panda mała, Niedźwiedź malajski/himalajski/wargacz, Langur, Makak japoński, Binturong, Słoń indyjski, Pantera śnieżna, Puma, Kojot, Grizzly, Bizon amerykański, Szop pracz, Oposum, Diabeł tasmański, Wombat, Kwokka, Kolczatka, Tapir, Nosacz sundajski, Pantera mglista, Serau, Takin, Dhole, Piżmowiec, Suhak, Jaguarundi, Wilk grzywiasty, Ostronos, Paka, Tamaryna, Marmozeta, Wikunia, Gwanako, Wydra olbrzymia, Jeleń pampasowy, Sichuanka, Pekari, Saola, Pancernik karłowaty, Skunks |
| Arktyka / Polarne (ssaki + ptaki) | ~15 | Niedźwiedź polarny, Mors, Foka, Lis polarny, Renifer, Piżmowół, Leming, Sowa śnieżna, Karibu, Wilk arktyczny, Zając rakietkowy, Lis śnieżny, Renifer Svalbardzki, Maskonur, Rybitwa popielata |
| Ssaki morskie | ~17 | Wieloryb (płetwal błękitny), Delfin, Orka, Manat, Narwal, Kaszalot, Morświn, Wieloryb biały (beluga), Wieloryb grenlandzki, Foka brodata, Płetwal karłowaty, Humbak, Wal biskajski, Wal szary, Diugoń, Lew morski, Słoń morski, Foka lampart |
| Ptaki Polski (śpiewające + wodne + leśne) | ~40 | Bocian, Jaskółka, Sikorka, Wróbel, Gołąb, Kruk, Sroka, Sójka, Kos, Słowik, Dudek, Dzięcioł, Kukułka, Czapla, Łabędź, Bogatka, Szpak, Skowronek, Mazurek, Krzyżówka, Perkoz, Drozd śpiewak, Kawka, Wrona, Gil, Zięba, Szczygieł, Kuropatwa, Bażant, Krzyżodziób, Czyż, Mysikrólik, Jemiołuszka, Zimorodek, Dzięcioł czarny, Sowa uszata, Grubodziób, Kulczyk, Perkoz dwuczuby, Pustułka |
| Ptaki drapieżne | ~12 | Orzeł, Sokół wędrowny, Jastrząb, Sowa, Puchacz, Kondor, Sęp, Bielik, Myszołów, Rybołów, Krogulec, Kobuz, Orzeł bielik amerykański |
| Ptaki egzotyczne | ~22 | Tukan, Flaming, Struś, Paw, Koliber, Papuga, Kakadu, Pelikan, Pingwin cesarski/królewski/mały/skalny, Kiwi, Emu, Kazuar (+ karłowaty), Nandu, Ara, Nimfa, Ibis, Marabut afrykański, Kwezal, Dzioborożec, Rajski ptak, Tukan tęczowy, Trzewikodziób, Sekretarz, Kakapo, Hoacyn, Liroogon, Głupiec niebieskonogi |
| Ryby słodkowodne | ~17 | Karp, Szczupak, Sum, Węgorz, Łosoś, Pstrąg, Lin, Okoń, Sandacz, Płoć, Brzana, Leszcz, Kleń, Karaś, Miętus, Jesiotr, Pielęgnica dyskowiec, Arowana, Koi |
| Ryby morskie / głębinowe | ~25 | Rekin, Manta, Tuńczyk, Makrela, Śledź, Dorsz, Miecznik, Konik morski (+ karłowaty), Barakuda, Ryba klaun, Murena, Flądra, Sardela, Pirania, Węgorz elektryczny, Rekin młot, Rekin wielorybi, Marlin, Mola mola/Samogłów, Sardynka, Halibut, Żabnica, Papugoryba, Wargacz, Skrzydlica, Synanceja, Blobfisz, Rozdymka, Najeżka |
| Gady | ~25 | Wąż, Kobra (+ królewska), Pyton (+ siatkowy), Anakonda (+ zielona), Grzechotnik, Jaszczurka zwinka, Gekon, Kameleon, Legwan, Waran z Komodo (+ smok Komodo), Żółw morski/lądowy/słoniowy/skorupiasty/aligatorzy, Krokodyl, Aligator, Boa dusiciel, Żmija zygzakowata, Zaskroniec, Padalec, Gawial, Krokodyl różańcowy, Frynozom, Bazyliszek, Mamba czarna, Moloch australijski, Agama kołnierzasta, Matamata, Waran stepowy |
| Płazy | ~12 | Żaba, Ropucha, Salamandra, Traszka, Aksolotl (+ różowy), Salamandra plamista, Drzewołaz, Rzekotka, Żaba rycząca, Robaczyca, Żaba szklana, Mantela, Salamandra olbrzymia, Skrytoskrzelnik |
| Owady | ~35 | Motyl, Biedronka, Mrówka, Pszczoła, Osa, Trzmiel, Komar, Mucha, Świerszcz (+ domowy), Konik polny, Ważka, Jętka, Świetlik, Ćma, Karaluch (+ azjatycki), Modliszka (+ olbrzymia), Patyczak (+ gigantyczny), Żuk, Jelonek rogacz, Termit, Szerszeń, Pchła, Wesz, Gąsienica, Szarańcza, Jedwabnik, Pawica atlas, Rohatyniec, Chrząszcz Herkules, Bogatek, Atlas, Morfej niebieski, Monarcha, Cykada, Pieniugnik, Weta gigantyczna, Chrząszcz Goliath, Rusałka pawik |
| Pajęczaki | ~9 | Pająk krzyżak, Skorpion, Tarantula, Kleszcz, Ptasznik, Roztocz, Kosarz, Czarna wdowa, Solfuga, Bicznik |
| Skorupiaki | ~10 | Krab, Rak, Krewetka, Langusta, Homar, Krab pustelnik, Krab kokosowy, Kryl, Pąkla, Krewetka modliszkowa, Skrzypłocz, Krab pajęczy |
| Mięczaki / inne bezkręgowce | ~20 | Ślimak winniczek, Ośmiornica (+ niebieskopierścieniowa), Kalmar (+ olbrzymi), Mątwa, Meduza, Rozgwiazda, Koralowiec, Ślimak nagi/morski, Małż, Ostryga, Jeżowiec, Ukwiał, Stonoga, Dżdżownica, Krocionóg, Łodzik, Wampirzyca, Stożek, Strzykwa, Pawik morski, Płaziniec, Chełbia modra |
| **Fantastyczne / mityczne** (tylko wyprawa `mythical`) | **17** | Tyranozaur, Brachiozaur, Welociraptor, Triceratops, Stegozaur, Mamut włochaty, Tygrys szablozębny, Smok, Jednorożec, Feniks, Syrena, Kraken, Yeti, Bigfoot, Potwór z Loch Ness, Sfinks, Gryf |

> Pełna lista 500 zwierząt: `src/data/animals.ts`. Każde zwierzę ma `id`, `name_pl`, `emoji`, `fun_fact_pl` i komplet 38 atrybutów.

### Mechanika atrybutów w pliku

- **`mk(id, name, emoji, fact, shorts)`** — base'owe wywołanie, używa krótkich kluczy (np. `mammal: 1`, `pol: 1`). Wszystko nie wymienione = `false`. Wartość `-1` = `null` ("czasem").
- **`EXTRAS`** — drugi pass, ustawia rzadsze atrybuty: `has_horns`, `is_nocturnal`, `lives_in_groups`, `is_venomous`, `lives_in_forest` (krócej niż dopisywać w każdym `mk()`).
- **`SPECIALS`** — trzeci pass: `barks` (psowate), `meows` (kotowate), `is_rodent`, `is_primate`, `has_long_ears`, `is_marsupial`, plus korekty `smaller_than_cat` / `lives_in_poland` dla pety zagranicznych i ptaków drapieżnych.

### System tagów wypraw

Każde zwierzę dostaje listę `expedition_tags` z trzech źródeł (merge'owanych przez `applyTags`):

1. **`TAGS`** — biomy/regiony (`polish_forest`, `savanna`, `ocean`, `arctic`, `australia`, `jungle`, `mountain`, `night_forest`, `farm`, `home_pets`, `mythical`).
2. **`SPECIAL_TAGS`** — grupy tematyczne (`songbirds`, `monkeys`, `big_cats`, `giants`, `freshwater`).
3. **`autoTagsFor(animal)`** — wyliczane z atrybutów: `predators` (is_predator), `insects` (is_insect), `reptiles` (is_reptile), `amphibians` (is_amphibian), `herbivores` (eats_plants && mammal/marsupial).

Zwierzęta `mythical` mają **tylko** ten tag — nie pojawiają się w Free Play ani w innych wyprawach.

---

## 7. Wyprawy (21)

### Biomowe (10)

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP |
|---|---|---|---|---|---|
| `polish_forest` | Polski las | 🌲 | 8 | 120 | 240 |
| `savanna` | Afrykańska sawanna | 🦁 | 6 | 90 | 180 |
| `ocean` | Oceaniczna głębia | 🌊 | 8 | 120 | 240 |
| `farm` | Wiejska farma | 🐄 | 5 | 75 | 150 |
| `jungle` | Amazońska dżungla | 🌴 | 6 | 90 | 180 |
| `arctic` | Arktyczna kraina | ❄️ | 5 | 75 | 150 |
| `australia` | Australijski busz | 🦘 | 4 | 60 | 120 |
| `night_forest` | Nocny las | 🌙 | 6 | 90 | 180 |
| `mountain` | Górska wyprawa | ⛰️ | 4 | 60 | 120 |
| `home_pets` | Domowi przyjaciele | 🏠 | 5 | 75 | 150 |

### Tematyczne (10)

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP |
|---|---|---|---|---|---|
| `predators` | Drapieżniki świata | 🐺 | 8 | 120 | 240 |
| `insects` | Świat owadów | 🦋 | 6 | 90 | 180 |
| `freshwater` | Słodkie wody Polski | 🎣 | 4 | 60 | 120 |
| `reptiles` | Gady i pancerze | 🐍 | 6 | 90 | 180 |
| `amphibians` | Świat płazów | 🐸 | 4 | 60 | 120 |
| `songbirds` | Ptaki śpiewające | 🎶 | 5 | 75 | 150 |
| `monkeys` | Małpy świata | 🐒 | 4 | 60 | 120 |
| `big_cats` | Wielkie koty | 🐯 | 5 | 75 | 150 |
| `giants` | Olbrzymy świata | 🐘 | 5 | 75 | 150 |
| `herbivores` | Roślinożerni | 🌿 | 7 | 105 | 210 |

### Specjalna (1)

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP |
|---|---|---|---|---|---|
| `mythical` | Legendy i Mity | 🐉 | 5 | 75 | 150 |

> Pula `mythical` to 17 stworzeń (dinozaury + fantasy) z `expedition_tags: ['mythical']` — wyłącznie ten tag, więc nie wpadają do Free Play ani do innych wypraw.

**Mechanika dnia:** codziennie z 21 wypraw losowane 3 propozycje (deterministyczne — ten sam zestaw cały dzień). Gracz wybiera jedną. Po ukończeniu — blok do jutra + nagroda. Reszta wypraw na `/expeditions` zablokowana.

---

## 8. Odznaki (20)

| ID | Tytuł | Warunek | Emoji |
|---|---|---|---|
| `first_win` | Pierwsza zagadka | Pierwsza wygrana | 🌱 |
| `first_loss` | Próba się liczy | Pierwsza przegrana | 🧩 |
| `streak_3` | Trójka pod rząd | 3 wygrane z rzędu | 🔥 |
| `streak_5` | Lisi Detektyw | 5 wygranych z rzędu | 🕵️ |
| `streak_10` | Niezatrzymywalny | 10 wygranych z rzędu | 🏅 |
| `daily_streak_7` | Tydzień z Timo | 7 dni z rzędu zagrane | 📅 |
| `daily_streak_30` | Miesiąc tropienia | 30 dni z rzędu | 🗓️ |
| `collector_5` | Młody Odkrywca | 5 różnych zwierząt | 🔭 |
| `collector_10` | Przyjaciel Zwierząt | 10 zwierząt | 🤝 |
| `collector_25` | Kolekcjoner | 25 zwierząt | 📔 |
| `collector_50` | Wielki tropiciel | 50 zwierząt | 📚 |
| `collector_100` | Encyklopedia | 100 zwierząt | 🏆 |
| `fast_thinker` | Szybki ogon | Zgadnięte w ≤4 pytaniach | ⚡ |
| `lightning` | Błyskawica | 3 wygrane w ≤3 pytaniach | 🌩️ |
| `explorer_1` | Pierwsza wyprawa | 1 wyprawa ukończona | 🗺️ |
| `explorer_5` | Podróżnik | 5 wypraw | 🌍 |
| `explorer_10` | Mistrz wypraw | 10 wypraw | 🎖️ |
| `explorer_all` | Globtroter | Wszystkie 20 wypraw | 👑 |
| `night_owl` | Nocna sowa | Gra po 21:00 | 🦉 |
| `early_bird` | Ranny ptaszek | Gra przed 8:00 | 🐤 |

---

## 9. Tytuły poziomów (7)

Pokazywane na Home pod avatarem ("Tytuł · L*N*").

| Od poziomu | Tytuł |
|---|---|
| L1 | Mały tropiciel |
| L3 | Odkrywca |
| L5 | Detektyw |
| L8 | Mistrz polany |
| L12 | Lisi mędrzec |
| L17 | Legenda lasu |
| L25 | Profesor Timo |

---

## 10. Mechanika nagród

### Tropy (🐾) — waluta wydawana w przyszłości

| Sytuacja | Tropy |
|---|---|
| Wygrana ≥10 pytań | +20 |
| Wygrana 5-9 pytań | +30 (×1.5) |
| Wygrana ≤4 pytań | +40 (×2) |
| Porażka | +5 |
| Pierwsze odkrycie zwierzęcia | dodatkowo +10 |
| Streak ≥3 | dodatkowo +5 |
| Wyprawa ukończona | bonus `target × 15` |
| 7. dzień daily streaku | +50 (jednorazowo per próg) |

### XP (✨) — progres do levelu (nigdy wydawane)

| Sytuacja | XP |
|---|---|
| Wygrana | +50 |
| Porażka | +15 |
| Pierwsze odkrycie zwierzęcia | dodatkowo +25 |
| Wyprawa ukończona | bonus `target × 30` |

### Krzywa levelu

- `xpForLevel(n) = 50 + 50 × (n − 1)` → 50, 100, 150, 200, 250…
- `totalXpToReach(n) = 25 × n × (n − 1)`

Poziomy: L1 (0–50), L2 (50–150), L3 (150–300), L4 (300–500), L5 (500–750), L6 (750–1050), L7 (1050–1400), L8 (1400–1800)…

### Streak

- 🔥 **Streak rund** — wygrane z rzędu. Reset przy porażce. +5 tropów bonus przy ≥3.
- 📅 **Streak dni** — codziennie zagrał ≥1 rundę. Reset przy pominiętym dniu. +50 tropów + odznaka przy 7.

---

## 11. Notatki / do przeglądu

Miejsce na uwagi po przeglądzie:

### Pytania
- [ ] Czy są dziurawe atrybuty (rzadko `true` lub `false`)? Sprawdzić rozkład — np. `has_long_ears` może mieć tylko 5 zwierząt z `true`, marginalny przyrost info gain.
- [ ] Czy `q_dangerous` jest dla dzieci zrozumiałe? "Bywa groźne dla ludzi" vs "jest niebezpieczne" vs "może ugryźć".
- [ ] Sprawdzić warianty pod kątem konfliktu z prefixami (np. wariant zaczynający się od "Hmm").

### Wyprawy
- [ ] Czy 20 wypraw to nie za dużo na MVP? Może wybrać 10 najlepszych?
- [ ] Tematyczne i biomowe overlap (np. `predators` przecina `polish_forest` i `savanna`). OK?
- [ ] Czy `target_count` powinien być proporcjonalny do puli, czy zawsze 3 dla łatwości?

### Odznaki
- [ ] 20 odznak na MVP — czy są zbyt łatwe? Zbyt trudne?
- [ ] `night_owl` / `early_bird` — fajne ale wymagają zegara. Sprawdzić działanie.
- [ ] Brakuje odznaki "za szczęście" (np. zgadł z 2 zwierząt zostałych)?

### Linie osobowości
- [ ] Reakcje (Faza 2) — czy w ogóle wprowadzać? Wpływa na flow gry (800ms delay).
- [ ] Czy crazy prefixy ("Wskocz mi do norki na chwilę", "Tylko między nami, lisami") dla małego dziecka są zrozumiałe?
- [ ] Lista mogłaby się rozszerzać — szczególnie warto dodać kategorię na okazjonalne "pojama style" jak w briefie ("Czy to jest pożama? — Brzmi jak piżama po przygodach").

### Tropy
- [ ] **Jak wydawać tropy?** — najważniejsza otwarta decyzja. Opcje:
  - Sklep z podpowiedziami w grze (pomiń pytanie, top-3 strzał, eliminacja kandydata)
  - Skiny Timo (kostiumy / chustki)
  - Naklejki do albumu kolekcji
  - Karmienie Timo (dekoracyjne, "stół z ciasteczkami")
- [ ] Może na razie pokazywać "Skarbonka tropów" bez sklepu? Dziecko zbiera, ucieszy się gdy sklep się pojawi.

### Poziomy
- [ ] Czy tytuł "Profesor Timo" na L25 to za dużo? L25 = ~7500 XP = ~150 wygranych. Realistyczne?
- [ ] Może dodać avatar / odznakę zmiany koloru / tła przy level up?
