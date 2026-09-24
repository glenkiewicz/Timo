# Poprawki merytoryczne bazy zwierząt

Audyt wszystkich 715 zwierząt (`src/data/animals.ts`), opisów (`src/data/animal-details.ts`)
i wypraw (`src/data/expeditions.ts`). Liczba zwierząt bez zmian: **715**.

## 1. Błąd techniczny: gubione atrybuty
`SPECIALS` miał zduplikowane klucze (np. `fox`, `rabbit`, `beaver`, `hamster`, `guinea_pig`,
`hare`, `marten`) — w obiekcie JS późniejszy wpis nadpisywał wcześniejszy, więc np. lis „nie
szczekał”, królik „nie miał długich uszu”, a bóbr „nie był gryzoniem”.
`EXTRAS` i `SPECIALS` zostały wchłonięte do wywołań `mk()` — każde zwierzę ma teraz wszystkie
atrybuty w jednej linii.

## 2. Atrybuty (odpowiedzi w grze)
- Wszystkie owady, pajęczaki i skorupiaki mają `has_legs` (wcześniej „nie ma nóg”).
- Węże: `has_tail` = „czasem” (dla dziecka niejednoznaczne), grzechotnik — tak.
- Brakujące: gryzonie (świstak, szynszyla, myszoskoczek…), naczelne (aj-aj, tamaryna,
  marmozeta…), kotowate (żbik, karakal, pantera mglista…), rogi (koziorożec, karibu, adaks…).
- Pojedyncze: mors żyje w wodzie, hipopotam je rośliny, dzik/świnia/niedźwiedź są
  wszystkożerne, sowa śnieżna poluje za dnia, hiena nie szczeka, panda nie żyje w dżungli itd.

## 3. Wyprawy
- **Słodkie wody Polski** — usunięte zwierzęta spoza Polski (aksolotl, paletka, arowana, koi,
  matamata, trionyks, żółw sępi, skrytoskrzel, wydra olbrzymia); dodane polskie (boleń,
  wzdręga, lipień, głowacica, stynka, wydra, bóbr, zimorodek, zaskroniec, kumak, topik…).
- **Afrykańska sawanna** — bez zwierząt z Ameryki Pd. i Azji (wilk grzywiasty, jeleń
  pampasowy, nandu, pancernik karłowaty, suhak).
- **Arktyczna kraina → Lodowe krainy** (Arktyka + Antarktyda), bez pingwina małego (Australia).
- **Amazońska dżungla → Tropikalna dżungla**, bez pandy, pandki, makaka japońskiego itd.
- **Nocny las → Zwierzęta nocy**, bez zwierząt dziennych (lis polarny, sowa śnieżna…).
- **Wielkie koty → Dzikie koty**, **Małpy świata → Małpy i lemury**, **Australijski busz →
  Australia i Nowa Zelandia**.
- Guided: „Małpki i Naczelne” bez binturonga/leniwca/pandki/koali; „Z Futrem” bez jeża;
  „Nocne Zwierzaki” bez lisa polarnego i sowy śnieżnej; „Lodowa Kraina” bez pingwina małego.
- Walidator (`scripts/validate-expeditions.ts`) sprawdza teraz region/nocny tryb życia.

## 4. Duplikaty zamienione na inne gatunki
Te id opisywały **to samo zwierzę co inne id** — zmieniono je na nowe gatunki.
**Wymagają nowych zdjęć (`assets/animals/<id>.jpg`) i nowych nagrań nazw (Timo voice):**

| id | było | jest |
|---|---|---|
| `orca_killer` | Wieloryb biały (= beluga) | Płetwal zwyczajny |
| `aardwolf_kenya` | Hieniak (= protel) | Hiena pręgowana |
| `honey_badger` | Borsuk miodożerny (= ratel) | Zorilla |
| `binturong_indo` | „Niedźwiedź pszczelarz” | Łaskun |
| `moonfish` | Mola mola (= samogłów) | Strojnik |
| `snow_fox` | Lis śnieżny (= lis polarny) | Zając polarny |
| `aardvark_pig` | Pekari (= pekari obrożny) | Babirusa |
| `atlantic_puffin` | Maskonur atlantycki (= maskonur) | Alka krzywonosa |
| `green_anaconda` | Anakonda zielona (= anakonda) | Boa szmaragdowy |
| `komodo_juvenile` | Smok Komodo (= waran z Komodo) | Waran paskowany |
| `axolotl_pink` | Aksolotl różowy | Żaba moczarowa |
| `mole_eu` | Kret europejski (= kret) | Orzesznica |
| `atlas_butterfly` | Atlas (= pawica atlas) | Ornitoptera królowej Aleksandry |
| `morpho_blue` | Morfo niebieski (= morfej) | Modraszek ariom |
| `monarch_butterfly` | Monarcha amerykański (= monarcha) | Cytrynek |
| `orb_weaver` | Krzyżak (= pająk krzyżak) | Tygrzyk paskowany |
| `sun_spider` | Solfugi (= solfuga) | Topik |
| `vampire_squid_giant` | Wampirzyca olbrzymia (= wampirzyca) | Kalmar Humboldta |
| `mantis_shrimp_punching` | Ustonóg (= krewetka modliszkowa) | Krab bokser |
| `giant_anteater` | Mrówkojad olbrzymi (= mrówkojad) | Tamandua |
| `brook_trout` | Pstrąg potokowy (= pstrąg) | Głowacica |
| `isopod_giant` | Rajak głębinowy (= stonóg olbrzymi) | Stonoga murowa |
| `tortoise_giant` | Żółw słoniowy (= żółw galapagoski) | Żółw olbrzymi (Aldabra) |
| `tree_frog` | Rzekotka | Rzekotka czerwonooka (dżungla) |

Zmienione nazwy (też do ponownego nagrania): `beluga` → Białucha, `centipede` → Parecznik
(„stonoga” to skorupiak), `sea_pig` → Strzykwa świnka (kolizja ze świnką morską),
`softshell_turtle` → Trionyks, `alligator_snapping` → Żółw sępi, `klipspringer` → Koziołek
skalny, `jumping_spider` → Skakun, `wolf_spider` → Pogoniec, `crab_spider` → Kwietnik,
`carpenter_ant` → Gmachówka, `treehopper` → Garbik, `brittle_star` → Wężowidło,
`portuguese_man_of_war` → Żeglarz portugalski, `crested_gecko` → Gekon orzęsiony,
`galapagos_tortoise` → Żółw słoniowy, `silkworm` → Gąsienica jedwabnika,
`giant_isopod` → Stonóg olbrzymi, `whip_spider` → Tępoodwłokowiec.

Po podmianie zdjęć: `npx tsx scripts/generate-animal-images.ts > src/data/animal-images.ts`,
a nagrania nazw: `scripts/generate-timo-voices.ts`.

## 5. Ciekawostki i opisy
Poprawiono ok. 250 ciekawostek i ok. 200 zdań w opisach — mity („jeżozwierz strzela
kolcami”, „sępy szukają węchem”), błędy faktów („łoś to największy ssak Polski”, „koi żyje
226 lat”, „jaskółka pikuje 600 km/h”, „lis na każdym kontynencie”), literówki, zdania bez
sensu i angielskie wtrącenia.
