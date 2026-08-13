# Timo — przegląd treści

Spis wszystkich danych użytkowych aplikacji: pytania, odpowiedzi, warianty, linie osobowości Liska, wyprawy, odznaki, mechanika zgadywania i nagród.

## Spis

1. [Statystyki — w liczbach](#1-statystyki--w-liczbach)
2. [Atrybuty zwierząt (38)](#2-atrybuty-zwierząt-38)
3. [Pytania (38) — wszystkie warianty](#3-pytania-38--wszystkie-warianty)
4. [Odpowiedzi dziecka (4)](#4-odpowiedzi-dziecka-4)
5. [Biblioteka Liska Timo — osobowość](#5-biblioteka-liska-timo--osobowość)
6. [Zwierzęta (500) — kategorie z liczbami](#6-zwierzęta-500--kategorie-z-liczbami)
7. [Wyprawy (45 — 24 guided + 21 expert)](#7-wyprawy-45--24-guided--21-expert)
8. [Odznaki (20)](#8-odznaki-20)
9. [Tytuły poziomów (7)](#9-tytuły-poziomów-7)
10. [Mechanika nagród](#10-mechanika-nagród)
11. [Mechanika zgadywania (silnik)](#11-mechanika-zgadywania-silnik)
12. [Ekrany i nawigacja](#12-ekrany-i-nawigacja)
13. [Notatki / do przeglądu](#13-notatki--do-przeglądu)

---

## 1. Statystyki — w liczbach

| Element | Ile |
|---|---|
| Zwierząt | **500** (w Free Play grywalne **483** — mityczne wyłączone) |
| Zdjęć zwierząt (`assets/animals/`) | **500** |
| Atrybutów | **38** |
| Pytań (każde z ~3 wariantami) | **38** |
| Wariantów pytań łącznie | **~125** |
| Wypraw | **45** — **24 guided** (widoczne w UI) + **21 expert** (ukryte flagą) |
| Odznak | **20** |
| Tytułów poziomów | **7** |
| Linii osobowości Liska | **~70** (prefixy + interludy + reakcje + powitania + zwycięstwa + porażki + strzały) |
| Plików głosowych (`assets/voices/*.mp3`) | **863** |
| Waga `assets/` | **~84 MB** |

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

## 7. Wyprawy (45 — 24 guided + 21 expert)

Wyprawy mają **dwa tryby**, sterowane polem `mode` w `src/data/expeditions.ts`.

| | `guided` — "Wyprawa z Timo" | `expert` — klasyczna kategoria |
|---|---|---|
| Widoczność w UI | **tak** | **nie** — `SHOW_EXPERT_EXPEDITIONS = false` |
| Adresat | dziecko | starszy gracz / przyszły tryb |
| Nazewnictwo | konkretne, dziecięce ("Wodne Zwierzaki") | abstrakcyjne ("Oceaniczna głębia") |
| Źródło puli | `inspirationRoster` — **18 zwierząt** | `roster` — pełna lista (14–138) |
| Karty inspiracji na `/expedition-intro/[id]` | 18 kart ze zdjęciami | brak |
| Fallback gdy pula się wyczerpie | `expeditionExpansionPool()` → 18 kart + rostery wypraw powiązanych (`GUIDED_EXPANSION_REFS`); UI raz pokazuje komunikat "poza kategorią" i kasuje flagę `didEscapeCategory` | zostaje w `roster` |
| `target_count` | **10** (jednolicie) | 4–8 |
| Nagroda | **150 🐾 / 300 ✨** | `target × 15` 🐾 / `target × 30` ✨ |

Pole `childTitle` istnieje przy każdej guided, ale w praktyce duplikuje `title` (jedyny wyjątek: `flyers` — `title: 'Latające Zwierzaki'`, `childTitle: 'Zwierzęta, które latają'`).

### 7.1 Guided (24) — widoczne w aplikacji

Wszystkie mają `target_count: 10`, `inspirationRoster` = 18 zwierząt, nagrodę **150 🐾 / 300 ✨**.

| ID | Tytuł | Hero | Rozszerzenie puli (`GUIDED_EXPANSION_REFS`) |
|---|---|---|---|
| `water_friends` | Wodne Zwierzaki | 🐬 | `ocean`, `freshwater` |
| `farm_timo` | Farma Timo | 🐄 | `farm` |
| `green_jungle` | Zielona Dżungla | 🌴 | `jungle` |
| `forest_kids` | Leśne Zwierzaki | 🦊 | `polish_forest`, `night_forest` |
| `flyers` | Latające Zwierzaki | 🦋 | `songbirds`, `polish_forest` |
| `night_animals` | Nocne Zwierzaki | 🌙 | `night_forest`, `polish_forest` |
| `big_animals` | Wielkie Zwierzęta | 🐘 | `giants` |
| `small_animals` | Małe Zwierzęta | 🐭 | `insects` |
| `scary_animals` | Groźne Zwierzaki | 🦁 | `predators` |
| `ice_land` | Lodowa Kraina | ❄️ | `arctic` |
| `home_pets_friends` | Domowi Pupile | 🐶 | `home_pets` |
| `feathered` | Z Piórami | 🪶 | `songbirds`, `polish_forest` |
| `furry` | Z Futrem | 🐻 | `polish_forest`, `savanna`, `arctic`, `home_pets` |
| `bugs_and_worms` | Owady i Robaki | 🐝 | `insects` |
| `savanna_kids` | Sawanna | 🦓 | `savanna` |
| `jumpers` | Skoczki | 🦘 | `polish_forest`, `savanna`, `australia` |
| `swimmers` | Pływające Zwierzaki | 🐟 | `ocean`, `freshwater` |
| `monkey_friends` | Małpki i Naczelne | 🐵 | `monkeys`, `jungle` |
| `striped_spotted` | Pasiaste i Cętkowane | 🐅 | `big_cats`, `savanna` |
| `long_nose` | Z Trąbą i Długim Nosem | 🐘 | `savanna`, `jungle` |
| `water_giants` | Wodne Olbrzymy | 🐋 | `ocean`, `giants` |
| `dinos_myths` | Dinozaury i Mity | 🦖 | `mythical` |
| `shelled` | Ze Skorupą | 🐢 | `ocean`, `reptiles` |
| `colorful` | Kolorowe Zwierzaki | 🦜 | `jungle` |

> Rostery expert wskazane w prawej kolumnie **nie są widoczne jako wyprawy** — służą wyłącznie jako zaplecze puli, gdy dziecko pomyśli o zwierzęciu spoza 18 kart.

### 7.2 Expert (21) — ukryte flagą `SHOW_EXPERT_EXPEDITIONS`

Kolumna `roster` = rzeczywista liczba zwierząt w puli.

**Biomowe (10)**

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP | roster |
|---|---|---|---|---|---|---|
| `polish_forest` | Polski las | 🌲 | 8 | 120 | 240 | 119 |
| `savanna` | Afrykańska sawanna | 🦁 | 6 | 90 | 180 | 54 |
| `ocean` | Oceaniczna głębia | 🌊 | 8 | 120 | 240 | 85 |
| `farm` | Wiejska farma | 🐄 | 5 | 75 | 150 | 17 |
| `jungle` | Amazońska dżungla | 🌴 | 6 | 90 | 180 | 93 |
| `arctic` | Arktyczna kraina | ❄️ | 5 | 75 | 150 | 29 |
| `australia` | Australijski busz | 🦘 | 4 | 60 | 120 | 17 |
| `night_forest` | Nocny las | 🌙 | 6 | 90 | 180 | 46 |
| `mountain` | Górska wyprawa | ⛰️ | 4 | 60 | 120 | 35 |
| `home_pets` | Domowi przyjaciele | 🏠 | 5 | 75 | 150 | 19 |

**Tematyczne (10)**

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP | roster |
|---|---|---|---|---|---|---|
| `predators` | Drapieżniki świata | 🐺 | 8 | 120 | 240 | 138 |
| `insects` | Świat owadów | 🦋 | 6 | 90 | 180 | 42 |
| `freshwater` | Słodkie wody Polski | 🎣 | 4 | 60 | 120 | 26 |
| `reptiles` | Gady i pancerze | 🐍 | 6 | 90 | 180 | 34 |
| `amphibians` | Świat płazów | 🐸 | 4 | 60 | 120 | 15 |
| `songbirds` | Ptaki śpiewające | 🎶 | 5 | 75 | 150 | 22 |
| `monkeys` | Małpy świata | 🐒 | 4 | 60 | 120 | 14 |
| `big_cats` | Wielkie koty | 🐯 | 5 | 75 | 150 | 15 |
| `giants` | Olbrzymy świata | 🐘 | 5 | 75 | 150 | 28 |
| `herbivores` | Roślinożerni | 🌿 | 7 | 105 | 210 | 81 |

**Specjalna (1)**

| ID | Tytuł | Hero | Target | 🐾 | ✨ XP | roster |
|---|---|---|---|---|---|---|
| `mythical` | Legendy i Mity | 🐉 | 5 | 75 | 150 | 17 |

> Pula `mythical` to 17 stworzeń (dinozaury + fantasy). `game-store.start()` odejmuje je z Free Play (`ANIMALS.filter(a => !mythicalIds.has(a.id))` → **483 zwierzęta**), żeby losowy "zgadnij zwierzę" pozostał realny. Do gry trafiają tylko przez wyprawę `mythical` (expert, ukryta) lub guided `dinos_myths`.

### 7.3 Wyprawa Dnia

`pickDailyGuided(todayKey())` losuje **3 wyprawy spośród guided**, hashując string daty — ten sam dzień daje ten sam zestaw na każdym urządzeniu. Wynik trafia do `profile-store.dailyChoice` i jest cache'owany do końca dnia.

Statusy kart na `/expeditions` (`CardStatus`): `completed` → `in_progress` → `available_today` (jedna z 3 dzisiejszych) → `locked` (reszta).

`pickDailyThree()` (losowanie ze **wszystkich** 45) zostało w kodzie jako fallback i zaplecze pod przyszły tryb Eksperta — obecnie nieużywane w praktyce.

⚠️ **`DEV_UNLOCK_ALL = __DEV__`** (`src/config/features.ts`) — w dev buildzie wszystkie wyprawy mają status `available_today` i cała kolekcja jest widoczna jako odkryta. W buildzie release (`preview`, `production`) flaga jest `false`, więc aplikacja startuje od zera.

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
| `explorer_all` | Globtroter | `completedCount >= 20` | 👑 |
| `night_owl` | Nocna sowa | Gra po 21:00 (lub przed 4:00) | 🦉 |
| `early_bird` | Ranny ptaszek | Gra między 5:00 a 8:00 | 🐤 |

**Gdzie odblokowywane:**

- `awardRound()` w `features/gamification/award.ts` — `first_*`, `streak_*`, `collector_*`, `fast_thinker` (wszystko, co da się policzyć z wyniku rundy).
- `profile-store.award()` — `lightning`, `daily_streak_*`, `night_owl`, `early_bird` (wymagają stanu profilu lub zegara).
- `profile-store.recordExpeditionDiscovery()` — `explorer_*` (odpalane w momencie ukończenia wyprawy).

⚠️ **Do poprawki:** opis `explorer_all` mówi *"Wszystkie 20 wypraw zaliczone!"*, a warunek to `completedCount >= 20` przy **24 widocznych** wyprawach guided. Odznaka jest zdobywalna, ale copy kłamie — albo podnieść próg do 24, albo zmienić tekst.

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

Ponieważ wszystkie widoczne wyprawy (guided) mają `target_count: 10`, w praktyce ukończenie wyprawy to zawsze **+150 🐾 / +300 ✨**.

### Krzywa levelu

- `xpForLevel(n) = 50 + 50 × (n − 1)` → 50, 100, 150, 200, 250…
- `totalXpToReach(n) = 25 × n × (n − 1)`

Poziomy: L1 (0–50), L2 (50–150), L3 (150–300), L4 (300–500), L5 (500–750), L6 (750–1050), L7 (1050–1400), L8 (1400–1800)…

### Streak

- 🔥 **Streak rund** — wygrane z rzędu. Reset przy porażce. +5 tropów bonus przy ≥3.
- 📅 **Streak dni** — codziennie zagrał ≥1 rundę. Reset przy pominiętym dniu. +50 tropów + odznaka przy 7.

### Gwiazdki ⭐ — wycofane

Pole `stars` żyje jeszcze w `profile-store` i w kształcie `lastReward` (`starsDelta`), ale `awardRound()` zawsze zwraca `0` i UI ich nie pokazuje. Zostawione wyłącznie dla zgodności ze schematem persystencji `timo-profile-v1`.

### Persystencja

Zustand + AsyncStorage, klucz **`timo-profile-v1`**. `partialize` zapisuje: `paws`, `stars`, `xp`, `streak`, `dailyStreak`, `lastPlayDate`, `fast_wins`, `collection`, `badges`, `dailyChoice`, `expeditionProgress`, `audioMuted`. Pola `lastReward` / `lastExpeditionReward` są **celowo nietrwałe** — to payload jednej rundy, z którego Home i Result czytają animacje count-up.

---

## 11. Mechanika zgadywania (silnik)

`src/features/game/guessing-engine.ts`. Stan silnika żyje w `lib/stores/game-store.ts` (Zustand, bez persystencji — runda ginie po restarcie).

### Stałe

| Stała | Wartość | Znaczenie |
|---|---|---|
| `MAX_QUESTIONS` | 20 | Twardy limit — potem Timo się poddaje |
| `MIN_QUESTIONS_BEFORE_GUESS` | 4 | Nie strzela wcześniej (chyba że został 1 kandydat) |
| `GUESS_SCORE_GAP` | 3 | Przewaga top-1 nad top-2 wystarczająca do strzału |
| `FORCED_GUESS_POOL` | 3 | Tylu kandydatów lub mniej → strzelaj mimo braku gapu |
| `DESPERATE_AFTER` | 13 | Po tylu pytaniach strzela, gdy pula ≤ 8 |

### Scoring kandydata (`scoreAnimal`)

Za każdą dotychczasową odpowiedź:

| Odpowiedź | Wartość atrybutu | Punkty |
|---|---|---|
| `yes` | `true` | **+3** |
| `yes` | `null` | +0.5 |
| `no` | `false` | **+3** |
| `no` | `null` | +0.5 |
| `hard` ("to zależy") | `null` | **+2** |
| `idk` | — | 0 (neutralne) |

Suma × **`popularityOf(id)`** — mnożnik **1.0–1.35** z `features/game/popularity.ts`, przesuwający do przodu zwierzęta, o których dziecko pomyśli najpierw (pies 1.35, kot 1.3, lew/tygrys 1.3–1.25, sowa 1.25…). Zakres był kiedyś do 1.8 i powodował, że "Pies" wygrywał strzał już po 3 pytaniach niezależnie od odpowiedzi — stąd obniżenie.

### Wybór pytania (`pickNextQuestion`)

Information gain liczony **nie na całej puli, tylko na top-K kandydatów** — inaczej drzewo marnowałoby pytania na rozdzielanie 500 zwierząt, z których 90% dawno odpadło.

| Faza | Okno kandydatów | Losowanie z top-N pytań |
|---|---|---|
| Q1 | cała pula | 5 |
| Q2 | cała pula | 3 |
| Q3–Q5 | top-30 | 3 (Q3+ → 2) |
| Q6+ | top-15 | 2 |

Score pytania: `|yes − no| + ambiguous × 0.7` (im niżej, tym lepiej — czyli podział 50/50 wygrywa, a atrybuty z dużą liczbą `null` dostają karę). Losowanie z top-N sprawia, że kolejne partie zaczynają się inaczej.

### Filtrowanie (`applyAnswer`)

`idk` i `hard` **nie filtrują** puli — wpływają tylko na scoring. `yes`/`no` odsiewa zwierzęta z przeciwną wartością; `null` **zawsze zostaje** (bo znaczy "czasem").

### Kiedy strzelać (`shouldAttemptGuess`)

1. Pusta pula → nie.
2. 1 kandydat → strzał.
3. `questionsAsked < 4` → nie.
4. Pula ≤ 3 → strzał.
5. `gap(top1, top2) ≥ 3` → strzał.
6. `questionsAsked ≥ 13` i pula ≤ 8 → strzał z desperacji.

Po odrzuceniu strzału zwierzę ląduje w `excludedAnimals` i gra wraca do pytań. Poddanie się: `questionsAsked >= 20` albo zero eligible kandydatów.

### Pule startowe

| Tryb | Pula |
|---|---|
| Free Play | 500 − 17 mitycznych = **483** |
| Wyprawa guided | `inspirationRoster` = **18**, z fallbackiem `expeditionExpansionPool()` |
| Wyprawa expert | pełny `roster` (14–138), fallback zostaje w `roster` |

W obu trybach wyprawy zwierzęta już odkryte (`excludeDiscovered`) startują w `excludedAnimals`.

---

## 12. Ekrany i nawigacja

Expo Router, `src/app/`. Root stack: `headerShown: false`, `animation: 'fade'`.

### Taby (`(tabs)/_layout.tsx`)

Custom `PuffyTabBar`. Kolejność w pasku: **Kolekcja 📒 · Wyprawy 🗺️ · Odznaki 🏅 · Menu 🏠**, ale `initialRouteName="index"` (Menu).

| Trasa | Plik | Zawartość |
|---|---|---|
| `/` | `(tabs)/index.tsx` | Polana — Timo z dymkiem ("TIMO MÓWI"), liczniki tropów/XP/streaku z animacją count-up po rundzie, CTA "Zagraj z Timo" / "Kontynuuj wyprawę", toggle głosu |
| `/collection` | `(tabs)/collection.tsx` | Album odkrytych zwierząt + `HabitatMap`, filtr "Wszystkie" |
| `/expeditions` | `(tabs)/expeditions.tsx` | Wyprawa Dnia (3 karty) + licznik `completedCount / visibleExpeditions.length` |
| `/badges` | `(tabs)/badges.tsx` | 20 odznak w 7 grupach |

### Poza tabami

| Trasa | Plik | Zawartość |
|---|---|---|
| `/game` | `game.tsx` | "TIMO PYTA" + 4 przyciski odpowiedzi; w fazie strzału "TIMO ZGADUJE" + "Tak!" / "Nie, pudło" |
| `/result` | `result.tsx` | Karta zwierzęcia, plakietka "Nowe!", przyrost 🐾/✨, nowe odznaki, "Zagraj jeszcze raz" / "Wróć na Polanę" |
| `/expedition-intro/[id]` | `expedition-intro/[id].tsx` | 18 kart inspiracji + "Mam zwierzę!" |
| `/animal/[id]` | `animal/[id].tsx` | Zdjęcie, ciekawostka, szczegóły z `animal-details.ts` |

### Warstwa wizualna i audio

- **Fonty:** Fredoka (400/500/600/700) — nagłówki i UI; Nunito (400/600/700/800/900) — treść.
- **Styling:** NativeWind 5 preview przez wrapper `src/tw/`. Tokeny: `paper`, `brand`, `brand-pale`, `brand-deep`, `ink-soft`, `rounded-card`, `rounded-chip`.
- **Audio:** `expo-audio`, `setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' })` — głos Timo gra także przy wyciszonym iPhonie i ścisza inne aplikacje. Wyciszenie z poziomu Menu (`audioMuted`, persystowane).
- **Voice pipeline:** `scripts/generate-timo-voices.ts` generuje `src/data/voice-manifest.ts` (863 pliki, klucze = hash treści). **Nie edytować manifestu ręcznie.** Odtwarzanie: `lib/audio/timo-voice.ts`.

---

## 13. Notatki / do przeglądu

Miejsce na uwagi po przeglądzie:

### Pytania
- [ ] Czy są dziurawe atrybuty (rzadko `true` lub `false`)? Sprawdzić rozkład — np. `has_long_ears` może mieć tylko 5 zwierząt z `true`, marginalny przyrost info gain.
- [ ] Czy `q_dangerous` jest dla dzieci zrozumiałe? "Bywa groźne dla ludzi" vs "jest niebezpieczne" vs "może ugryźć".
- [ ] Sprawdzić warianty pod kątem konfliktu z prefixami (np. wariant zaczynający się od "Hmm").

### Wyprawy
- [x] ~~Czy 20 wypraw to nie za dużo na MVP?~~ — rozwiązane podziałem na tryby: 24 guided widoczne, 21 expert ukryte za `SHOW_EXPERT_EXPEDITIONS`.
- [ ] **Kiedy odblokować tryb Ekspert?** Wymaga dorobienia ekranu wyboru ("Wyprawa z Timo" vs "Wyprawa Eksperta") — dziś flaga po prostu ukrywa 21 wypraw.
- [ ] `target_count: 10` przy 18 kartach inspiracji — czy to nie za długa sesja dla przedszkolaka? 10 wygranych rund na jedną wyprawę.
- [ ] Guided overlap jest duży z założenia (`furry` przecina `forest_kids`, `savanna_kids`, `ice_land`, `home_pets_friends`). Świadome — sprawdzić, czy nie nudzi.
- [ ] `childTitle` duplikuje `title` przy 23 z 24 guided. Albo wykorzystać pole na krótszy wariant do kart, albo usunąć.
- [ ] `pickDailyThree()` jest martwym kodem do czasu włączenia trybu Ekspert — zostawiamy czy usuwamy?

### Odznaki
- [ ] 20 odznak na MVP — czy są zbyt łatwe? Zbyt trudne?
- [ ] `night_owl` / `early_bird` — fajne ale wymagają zegara. Sprawdzić działanie.
- [ ] Brakuje odznaki "za szczęście" (np. zgadł z 2 zwierząt zostałych)?
- [ ] `explorer_all` — próg `>= 20` vs opis "Wszystkie 20 wypraw" przy 24 guided. Ujednolicić (patrz sekcja 8).

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

### Silnik zgadywania
- [ ] Zmierzyć realną skuteczność: ile pytań średnio do trafienia w Free Play (483 zwierzęta) vs guided (18)? Jest `features/game/game-log.ts` — użyć.
- [ ] Przy puli 18 zwierząt (guided) `MIN_QUESTIONS_BEFORE_GUESS = 4` może być za dużo — Timo mógłby trafić po 2–3 pytaniach.
- [ ] `popularity` pokrywa ~120 z 483 zwierząt. Reszta ma 1.0 — czy warto rozszerzyć, czy to już wystarcza?
- [ ] `hard` ("to zależy") daje +2 tylko zwierzętom z `null`. Czy dzieci w ogóle używają tego przycisku? Sprawdzić w logach.

---

> **Aktualizacja:** 2026-08-07 — dokument zweryfikowany względem kodu. Główna zmiana od poprzedniej wersji: wyprawy rozbite na tryby `guided`/`expert` (było 21, jest 45). Dodane sekcje 11 (silnik) i 12 (ekrany).
>
> Skrypty walidujące dane: `scripts/validate-animals.ts`, `scripts/validate-expeditions.ts`. Generatory: `generate-rosters.ts`, `generate-timo-voices.ts`, `generate-animal-images.ts`.
