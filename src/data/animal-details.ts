import type { Animal } from '@/types/game';

/**
 * Regiony mapy świata wykorzystywane w `<HabitatMap />`.
 * Punkt `polska` to specjalny "marker" na Europie — używany razem z `europa`.
 * `oceans` highlightuje całe tło. `mythical` rysuje mapę skarbów.
 */
export type MapRegion =
  | 'polska'
  | 'europa'
  | 'africa-sub'
  | 'africa-north'
  | 'asia-east'
  | 'asia-se'
  | 'asia-cent'
  | 'america-n'
  | 'america-s'
  | 'australia'
  | 'arctic'
  | 'antarctica'
  | 'oceans'
  | 'worldwide'
  | 'mythical';

export type FactChip = {
  emoji: string;
  label: string;
};

export type AnimalDetails = {
  /** 2-5 krótkich zdań — pierwsze może wzbogacać oryginalny fun_fact_pl. */
  facts_pl: string[];
  /** Krótki przydomek pod nazwą: "król sawanny". */
  tagline_pl?: string;
  /** "Długość 2 m, waga do 250 kg" — wolny tekst, nie strukturyzowany. */
  size_pl?: string;
  /** "10–14 lat na wolności". */
  lifespan_pl?: string;
  /** Doprecyzowany opis diety, gdy potrzebny więcej niż chip. */
  diet_pl?: string;
  /** Opis środowiska, gdy auto-derywacja z tagów to za mało. */
  habitat_pl?: string;
  /** Override mapy — jak brak, wyliczamy z expedition_tags. */
  map_regions?: MapRegion[];
};

/**
 * Hand-pisane rozszerzenia. Brak wpisu = używamy fallbacku z fun_fact_pl
 * i atrybutów. Dodajemy wpisy iteracyjnie — zaczynamy od ikonicznych.
 */
export const ANIMAL_DETAILS: Record<string, AnimalDetails> = {
  // === Polska / dom ===
  fox: {
    tagline_pl: 'rudy spryciarz',
    facts_pl: [
      'Lisy potrafią słyszeć mysz pod śniegiem z 10 metrów.',
      'Mają nawet 40 różnych odgłosów — szczekają, piszczą, popłakują.',
      'Lis rudy ma największy zasięg ze wszystkich dzikich drapieżników — żyje w Europie, Azji, Afryce Północnej i Ameryce Północnej.',
    ],
    size_pl: 'Długość 70–90 cm + ogon do 50 cm. Waga 5–10 kg.',
    lifespan_pl: '3–5 lat dziko, do 14 w niewoli',
    diet_pl: 'Myszy, króliki, ptaki, owady, owoce — wszystkożerca.',
  },
  wolf: {
    tagline_pl: 'wódz watahy',
    facts_pl: [
      'Wycie wilka słychać z 10 kilometrów.',
      'Wilki żyją w watahach prowadzonych przez parę rodzicielską.',
      'Mówią ogonem — wysoki = pewny siebie, podwinięty = uległy.',
    ],
    size_pl: 'Długość 100–150 cm. Waga 30–60 kg.',
    lifespan_pl: '6–8 lat dziko',
    diet_pl: 'Jelenie, sarny, dziki — duża zwierzyna.',
  },
  hedgehog: {
    tagline_pl: 'kolczasty wędrowiec',
    facts_pl: [
      'Jeż ma do 7000 kolców na grzbiecie.',
      'W razie strachu zwija się w kulkę — kolce stoją wszędzie.',
      'Przesypia zimę 5–6 miesięcy w gnieździe z liści.',
    ],
    size_pl: 'Długość 20–30 cm. Waga 0,4–1,2 kg.',
    lifespan_pl: '3–5 lat dziko',
    diet_pl: 'Owady, ślimaki, dżdżownice, jaja, czasem żaby.',
  },
  squirrel: {
    facts_pl: [
      'Wiewiórki zakopują tysiące orzechów na zimę.',
      'Pamiętają większość kryjówek — reszta wyrasta jako młode drzewa.',
      'Skaczą do 6 metrów między gałęziami, używając ogona jako steru.',
    ],
    size_pl: 'Długość 20 cm + ogon. Waga 250–400 g.',
    lifespan_pl: '5–7 lat',
    diet_pl: 'Orzechy, nasiona szyszek, owoce, czasem jaja ptaków.',
  },
  brown_bear: {
    tagline_pl: 'władca Bieszczadów',
    facts_pl: [
      'Niedźwiedzie przesypiają zimę w gawrze — tracą do 30% wagi.',
      'Biegają 50 km/h, mimo wagi ponad 200 kg.',
      'W Polsce dziko żyje ich tylko ok. 110 — głównie w Bieszczadach i Tatrach.',
    ],
    size_pl: 'Długość 1,5–2,5 m. Waga 100–350 kg.',
    lifespan_pl: '20–30 lat dziko',
    diet_pl: 'Wszystkożerca — jagody, miód, ryby, ścierwo, młode ssaki.',
  },
  beaver: {
    facts_pl: [
      'Bobry budują tamy z gałęzi i błota — zmieniają cały krajobraz.',
      'Pływają używając płaskiego ogona jak ster.',
      'Ich siekacze rosną przez całe życie — muszą gryźć drewno, żeby nie urosły za długie.',
    ],
    size_pl: 'Długość 80–100 cm + ogon. Waga 15–30 kg.',
    lifespan_pl: '10–20 lat',
    diet_pl: 'Kora drzew, gałązki, rośliny wodne — wegetarianin.',
  },
  stork: {
    tagline_pl: 'polski bocian biały',
    facts_pl: [
      'Bociany przylatują do Polski w marcu z Afryki — 10 000 km drogi.',
      'Polska ma jedną z największych populacji bocianów na świecie.',
      'Nie mają strun głosowych — komunikują się klekotem dzioba.',
    ],
    size_pl: 'Wysokość 100–115 cm, rozpiętość skrzydeł do 2,2 m.',
    lifespan_pl: '20–30 lat',
    diet_pl: 'Żaby, jaszczurki, owady, drobne gryzonie.',
  },
  owl: {
    facts_pl: [
      'Sowy lecą bezgłośnie dzięki specjalnym pióram o postrzępionych krawędziach.',
      'Obracają głowę o 270° — bo nie mogą poruszać oczami w oczodołach.',
      'Słyszą tak dobrze, że łapią mysz pod śniegiem z 30 metrów.',
    ],
    size_pl: 'Zależy od gatunku — od 15 cm po 75 cm.',
    lifespan_pl: '4–10 lat',
    diet_pl: 'Myszy, norniki, owady, czasem małe ptaki.',
  },
  dog: {
    tagline_pl: 'najlepszy przyjaciel',
    facts_pl: [
      'Pies potrafi nauczyć się ponad 150 słów.',
      'Węch psa jest 10 000–100 000 razy lepszy od ludzkiego.',
      'Człowiek udomowił psa ponad 15 000 lat temu — pierwsze udomowione zwierzę.',
    ],
    size_pl: 'Od 1 kg (chihuahua) po 90 kg (mastif). Zależnie od rasy.',
    lifespan_pl: '10–15 lat',
    diet_pl: 'Mięso, suchy pokarm, czasem warzywa — wszystkożerca.',
  },
  cat: {
    facts_pl: [
      'Kot śpi nawet 16 godzin dziennie.',
      'Kot mruczy z częstotliwością 25–150 Hz — naukowcy badają, czy pomaga mu to w gojeniu ran.',
      'Każdy kot ma unikalny wzór na nosie — jak ludzki odcisk palca.',
    ],
    size_pl: 'Długość 45 cm + ogon 25 cm. Waga 3–5 kg.',
    lifespan_pl: '12–18 lat',
    diet_pl: 'Mięso — ścisły mięsożerca, bez mięsa nie byłby zdrowy.',
  },

  // === Sawanna ===
  lion: {
    tagline_pl: 'król sawanny',
    facts_pl: [
      'Ryk lwa słychać z 8 kilometrów.',
      'Samice robią 90% polowań — samce bronią terytorium.',
      'Stado lwów liczy 5–15 zwierząt: kilka samic z młodymi i 1–3 samce.',
    ],
    size_pl: 'Długość 1,7–2,5 m. Waga 120–250 kg.',
    lifespan_pl: '10–14 lat dziko',
    diet_pl: 'Antylopy, zebry, gnu, bawoły — poluje stadem.',
  },
  elephant: {
    tagline_pl: 'olbrzym Afryki',
    facts_pl: [
      'Słoń poznaje swoje odbicie w lustrze — to znak inteligencji.',
      'Trąba ma ponad 40 000 mięśni — może podnieść drzewo i zerwać trawkę.',
      'Słonie opłakują zmarłych — wracają do kości członków stada nawet po latach.',
    ],
    size_pl: 'Wysokość 3–4 m, waga 4–7 ton.',
    lifespan_pl: '60–70 lat',
    diet_pl: 'Trawa, liście, kora, owoce — 150 kg dziennie.',
  },
  giraffe: {
    facts_pl: [
      'Język żyrafy ma 50 cm długości — i jest niebieski.',
      'Serce żyrafy waży 11 kg — żeby pompować krew do głowy.',
      'Śpi tylko 30 minut na dobę, najczęściej na stojąco.',
    ],
    size_pl: 'Wysokość 5–6 m. Waga 800–1900 kg.',
    lifespan_pl: '25 lat',
    diet_pl: 'Liście akacji — głównie z koron drzew.',
  },
  cheetah: {
    tagline_pl: 'najszybszy sprinter świata',
    facts_pl: [
      'Gepard biega 110 km/h — najszybsze zwierzę lądowe.',
      'Od 0 do 100 km/h rozpędza się w 3 sekundy — szybciej niż Ferrari.',
      'Po sprincie musi odpoczywać 30 minut — bardzo szybko się przegrzewa.',
    ],
    size_pl: 'Długość 1,2 m + ogon. Waga 40–65 kg.',
    lifespan_pl: '8–12 lat',
    diet_pl: 'Gazele, impale, młode antylopy.',
  },
  zebra: {
    facts_pl: [
      'Pasy zebry działają jak indywidualny "kod kreskowy" — każdy ma inny wzór.',
      'Pasy mylą muchy końskie i drapieżniki w czasie biegu.',
      'Zebry biegają 65 km/h i kopią tak mocno, że łamią szczękę lwu.',
    ],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 200–450 kg.',
    lifespan_pl: '20–25 lat',
    diet_pl: 'Trawa, czasem liście i kora.',
  },

  // === Dżungla / Azja ===
  tiger: {
    tagline_pl: 'pasiasty samotnik',
    facts_pl: [
      'Każdy tygrys ma unikalny układ pasków — jak nasze odciski palców.',
      'Tygrysy świetnie pływają — uwielbiają chłodzić się w rzekach.',
      'Polują nocą w pojedynkę — w odróżnieniu od lwów.',
    ],
    size_pl: 'Długość 2–3 m. Waga 90–300 kg.',
    lifespan_pl: '10–15 lat',
    diet_pl: 'Sarny, dziki, bawoły — zabija ofiarę większą od siebie.',
  },
  panda: {
    facts_pl: [
      'Panda zjada 12 kg bambusa dziennie — przez 14 godzin nieprzerwanie.',
      'Ma "szósty palec" — kciuk z kości nadgarstka, do trzymania bambusa.',
      'Małe pandy ważą po urodzeniu zaledwie 100 g — 900 razy mniej niż mama.',
    ],
    size_pl: 'Długość 1,2–1,9 m. Waga 70–125 kg.',
    lifespan_pl: '20 lat dziko',
    diet_pl: '99% bambus, czasem drobne gryzonie i owady.',
  },
  sloth: {
    facts_pl: [
      'Leniwiec porusza się tak wolno, że glony rosną mu na futrze.',
      'Trawi liść 30 dni — najwolniejszy metabolizm wśród ssaków.',
      'Schodzi z drzewa raz w tygodniu — żeby zrobić kupę.',
    ],
    size_pl: 'Długość 60 cm. Waga 4–8 kg.',
    lifespan_pl: '20 lat',
    diet_pl: 'Liście, pąki, owoce — z koron drzew.',
  },

  // === Arktyka / morze ===
  polar_bear: {
    tagline_pl: 'władca lodów',
    facts_pl: [
      'Pod białym futrem niedźwiedź polarny ma czarną skórę.',
      'Pływa godzinami — zanotowano osobnika płynącego 9 dni bez przerwy.',
      'Wącha fokę przez 1 metr lodu z odległości kilometra.',
    ],
    size_pl: 'Długość 2,5–3 m. Waga 400–600 kg.',
    lifespan_pl: '25–30 lat',
    diet_pl: 'Foki — głównie pierścieniowe i brodate.',
  },
  whale: {
    tagline_pl: 'największe zwierzę w historii',
    facts_pl: [
      'Płetwal błękitny waży 150 ton — więcej niż 25 słoni.',
      'Jego serce jest wielkości małego samochodu.',
      'Pieśni płetwala niosą się 1500 km w głębinach.',
    ],
    size_pl: 'Długość do 30 m. Waga 150–180 ton.',
    lifespan_pl: '80–90 lat',
    diet_pl: 'Kryl — nawet 4 tony dziennie, choć jeden kryl ma tylko kilka centymetrów.',
  },
  dolphin: {
    facts_pl: [
      'Delfiny używają imion — każdy ma swój unikalny gwizd.',
      'Bawią się dla zabawy — robią bańki i bawią się falami.',
      'Pomagają tonącym ludziom i wskazują rybakom ławice.',
    ],
    size_pl: 'Długość 2–4 m. Waga 150–300 kg.',
    lifespan_pl: '40–60 lat',
    diet_pl: 'Ryby i kalmary — poluje stadem.',
  },
  shark: {
    facts_pl: [
      'Rekin ma kilka rzędów zębów — nowe ciągle wyrastają.',
      'Wyczuwa krew w wodzie z daleka — i słabe pole elektryczne ofiary.',
      'Istnieją od 400 milionów lat — dłużej niż drzewa.',
    ],
    size_pl: 'Zależy od gatunku — od 20 cm po 12 m.',
    lifespan_pl: '20–70 lat',
    diet_pl: 'Ryby, foki, żółwie morskie — szczyt łańcucha pokarmowego.',
  },
  penguin_emperor: {
    facts_pl: [
      'Pingwin cesarski wysiaduje jajo na własnych stopach — w –50°C.',
      'To jedyne zwierzę, które rozmnaża się zimą na Antarktydzie.',
      'Tata wysiaduje jajo 2 miesiące bez jedzenia — chudnie 40%.',
    ],
    size_pl: 'Wysokość 100–130 cm. Waga 20–40 kg.',
    lifespan_pl: '15–20 lat',
    diet_pl: 'Ryby, kalmary, kryl — nurkuje do 500 m.',
  },

  // === Polski las — dzikie ===
  deer: {
    tagline_pl: 'pan lasu',
    facts_pl: [
      'Poroże jelenia odrasta co roku — to najszybciej rosnąca tkanka u ssaków.',
      'Samce ryczą jesienią, żeby zaimponować łaniom — słychać je z kilometrów.',
      'Jelenie biegają nawet 60 km/h i skaczą ponad 2 metry w górę.',
    ],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 100–250 kg.',
    lifespan_pl: '10–15 lat dziko',
    diet_pl: 'Trawa, liście, pąki, kora, żołędzie.',
  },
  roe_deer: {
    facts_pl: [
      'Wystraszona sarna "szczeka" — jej głos brzmi jak szczekanie psa i ostrzega inne sarny.',
      'Są mniejsze niż jelenie — latem żyją samotnie, a zimą łączą się w małe stada.',
      'Samce zrzucają poroże w listopadzie, nowe odrasta do wiosny.',
    ],
    size_pl: 'Wysokość 65–80 cm. Waga 15–35 kg.',
    lifespan_pl: '10–12 lat',
    diet_pl: 'Trawa, pąki, młode pędy, jagody.',
  },
  wild_boar: {
    tagline_pl: 'leśny czołg',
    facts_pl: [
      'Dzik biega 40 km/h przez gęsty las — czołg na 4 nogach.',
      'Świetnie pływa — przepłynie nawet kilka kilometrów.',
      'Stado prowadzi najstarsza locha, samce żyją samotnie.',
    ],
    size_pl: 'Długość 1,2–1,8 m. Waga 60–200 kg.',
    lifespan_pl: '10–14 lat',
    diet_pl: 'Żołędzie, korzenie, owady, dżdżownice — wszystkożerca.',
  },
  lynx: {
    tagline_pl: 'cichy łowca z pędzelkami',
    facts_pl: [
      'Pędzelki na uszach rysia działają jak antena — wzmacniają dźwięki.',
      'Skacze do 4 metrów na ofiarę z zasadzki.',
      'W Polsce żyje ich tylko ok. 200 — głównie w Bieszczadach i Puszczy Białowieskiej.',
    ],
    size_pl: 'Długość 80–130 cm. Waga 18–30 kg.',
    lifespan_pl: '10–15 lat',
    diet_pl: 'Sarny, zające, gryzonie, ptaki.',
  },
  badger: {
    facts_pl: [
      'Borsuk kopie podziemne tunele długie na kilkanaście metrów — "borsuczyska".',
      'Żyje w rodzinnych klanach, sprząta swoje nory i wynosi śmieci.',
      'Aktywny głównie nocą — w dzień śpi pod ziemią.',
    ],
    size_pl: 'Długość 70–90 cm. Waga 10–18 kg.',
    lifespan_pl: '10–15 lat',
    diet_pl: 'Dżdżownice (do 200 dziennie), owady, gryzonie, owoce.',
  },
  elk: {
    tagline_pl: 'olbrzym bagien',
    facts_pl: [
      'Łoś to największy jeleń świata — samiec waży nawet pół tony.',
      'Świetnie pływa — przepływa jeziora, nurkuje za roślinami.',
      'Poroże samca jest "łopatowate" — rozkłada się na boki, nie do góry.',
    ],
    size_pl: 'Wysokość 1,8–2,1 m. Waga 350–600 kg.',
    lifespan_pl: '15–25 lat',
    diet_pl: 'Rośliny wodne, młode pędy, kora, liście.',
  },
  bison: {
    tagline_pl: 'symbol Puszczy Białowieskiej',
    facts_pl: [
      'Żubr to symbol Puszczy Białowieskiej — i największy ssak lądowy Europy.',
      'W latach 20. XX wieku wyginął na wolności — odtworzono populację z 50 osobników.',
      'Mimo wagi 800 kg potrafi biegać nawet 50 km/h.',
    ],
    size_pl: 'Wysokość 1,8–2 m. Waga 500–900 kg.',
    lifespan_pl: '20–25 lat',
    diet_pl: 'Trawa, liście, kora, żołędzie — 30 kg dziennie.',
  },
  otter: {
    facts_pl: [
      'Wydra zamyka nos i uszy, gdy nurkuje za rybami.',
      'Mają bardzo gęste futro — pod wodą między włoskami zostaje warstwa powietrza, która je grzeje.',
      'Polują też w nocy — wąsy wyczuwają ruch ryb pod wodą.',
    ],
    size_pl: 'Długość 60–90 cm + ogon. Waga 5–14 kg.',
    lifespan_pl: '8–12 lat',
    diet_pl: 'Ryby, raki, żaby, drobne ssaki.',
  },
  bat: {
    facts_pl: [
      'Nietoperz "widzi" uszami przez echolokację — wysyła ultradźwięki i słucha echa.',
      'To jedyny ssak, który naprawdę lata.',
      'Polska ma 25 gatunków — wszystkie zjadają owady, głównie komary.',
    ],
    size_pl: 'Rozpiętość skrzydeł 20–40 cm. Waga 5–30 g.',
    lifespan_pl: '5–30 lat (zależnie od gatunku)',
    diet_pl: 'Owady — jeden nietoperz zjada 3000 komarów w noc.',
  },

  // === Polski las — ptaki ===
  eagle_owl: {
    tagline_pl: 'największa sowa Polski',
    facts_pl: [
      'Puchacz to największa sowa Polski — rozpiętość skrzydeł do 1,8 m.',
      'Poluje na zające, lisy, a nawet młode sarny.',
      'Pohukuje basem słyszalnym na 4 kilometry.',
    ],
    size_pl: 'Wysokość 60–75 cm, rozpiętość 1,6–1,8 m.',
    lifespan_pl: '20 lat dziko',
    diet_pl: 'Ssaki średniej wielkości, ptaki, ryby.',
  },
  woodpecker: {
    facts_pl: [
      'Dzięcioł stuka w drzewo 20 razy na sekundę — nie boli go głowa dzięki "poduszce" w czaszce.',
      'Jego język jest tak długi, że w głowie owija się wokół czaszki.',
      'Stukaniem oznacza terytorium i szuka larw pod korą.',
    ],
    size_pl: 'Długość 20–45 cm.',
    lifespan_pl: '5–11 lat',
    diet_pl: 'Larwy, owady spod kory, mrówki, czasem orzechy.',
  },
  swallow: {
    facts_pl: [
      'Jaskółka łapie owady w locie — nawet pije w locie, muskając wodę dziobem.',
      'W poszukiwaniu owadów potrafi przelecieć nawet 200 km dziennie.',
      'Zimą migruje do Afryki — 9000 km w jedną stronę.',
    ],
    size_pl: 'Długość 17–19 cm.',
    lifespan_pl: '4–8 lat',
    diet_pl: 'Wyłącznie owady chwytane w locie.',
  },
  raven: {
    facts_pl: [
      'Kruki rozwiązują zagadki na poziomie dziecka 7-letniego.',
      'Rozpoznają ludzkie twarze i pamiętają je przez lata.',
      'Używają narzędzi — patyków, kamieni — i bawią się dla zabawy.',
    ],
    size_pl: 'Długość 60–70 cm, rozpiętość 1,2 m.',
    lifespan_pl: '10–15 lat dziko',
    diet_pl: 'Wszystkożerca — padlina, owady, jaja, owoce, ścierwo.',
  },
  swan: {
    facts_pl: [
      'Łabędzie są monogamiczne — łączą się w pary na całe życie.',
      'Łabędź broniący gniazda potrafi mocno uderzyć skrzydłem — lepiej trzymać się z daleka.',
      'Małe są szarobrązowe — bieleją dopiero w drugim roku życia.',
    ],
    size_pl: 'Długość 1,4–1,6 m, rozpiętość 2,5 m. Waga 10–15 kg.',
    lifespan_pl: '20–30 lat',
    diet_pl: 'Rośliny wodne, trawa, czasem drobne ślimaki.',
  },

  // === Polski las — płazy / gady ===
  frog: {
    facts_pl: [
      'Żaba nie pije ustami — wodę wchłania przez skórę.',
      'Skacze 20 razy długość własnego ciała.',
      'Najpierw jest kijanką w wodzie, dopiero potem żabą na lądzie.',
    ],
    size_pl: 'Długość 6–10 cm (większość polskich gatunków).',
    lifespan_pl: '5–10 lat',
    diet_pl: 'Owady, ślimaki, dżdżownice — łapie lepkim językiem.',
  },
  viper: {
    tagline_pl: 'jedyny jadowity wąż Polski',
    facts_pl: [
      'Żmija to jedyny jadowity wąż w Polsce — ostrzega zygzakiem na grzbiecie.',
      'Jej jad rzadko zabija człowieka, ale ukąszenie wymaga lekarza.',
      'Sama unika ludzi — ucieka pierwsza, gryzie tylko w obronie.',
    ],
    size_pl: 'Długość 50–70 cm.',
    lifespan_pl: '15–25 lat',
    diet_pl: 'Myszy, jaszczurki, młode ptaki.',
  },

  // === Farma ===
  cow: {
    facts_pl: [
      'Krowa ma najlepszych przyjaciół wśród innych krów — i stresuje się, gdy je rozdzielić.',
      'Pamięta twarze ludzi i krów przez lata.',
      'Pije nawet 100 litrów wody dziennie — wielką wannę.',
    ],
    size_pl: 'Wysokość 1,3–1,5 m. Waga 500–900 kg.',
    lifespan_pl: '15–25 lat',
    diet_pl: 'Trawa, siano, kiszonka — wegetarianka.',
  },
  horse: {
    facts_pl: [
      'Konie drzemią na stojąco — specjalny układ ścięgien blokuje im nogi, żeby się nie przewróciły.',
      'Rozpoznają emocje człowieka z mimiki twarzy.',
      'Galopują 70 km/h, a najszybsze rasy ponad 80.',
    ],
    size_pl: 'Wysokość 1,4–1,8 m. Waga 400–700 kg.',
    lifespan_pl: '25–30 lat',
    diet_pl: 'Trawa, siano, owies, jabłka — wegetarianin.',
  },
  pig: {
    facts_pl: [
      'Świnie są bardzo mądre — szybko uczą się swojego imienia i prostych sztuczek.',
      'Nie poci się — kąpie w błocie, żeby się ochłodzić.',
      'Ma świetny węch — używana do tropienia trufli.',
    ],
    size_pl: 'Długość 1–2 m. Waga 50–350 kg.',
    lifespan_pl: '15–20 lat',
    diet_pl: 'Wszystkożerca — pasza, warzywa, owoce, czasem mięso.',
  },
  chicken: {
    facts_pl: [
      'Kura rozróżnia ponad 100 twarzy — ludzi i innych kur.',
      'Składa średnio 250 jaj rocznie, niektóre rasy nawet 300.',
      'Kury, jak wszystkie ptaki, pochodzą od dinozaurów — to daleka rodzina T-Rexa!',
    ],
    size_pl: 'Wysokość 30–40 cm. Waga 1,5–4 kg.',
    lifespan_pl: '5–10 lat',
    diet_pl: 'Ziarno, owady, dżdżownice, resztki — wszystkożerca.',
  },
  sheep: {
    facts_pl: [
      'Owca rozpoznaje twarze przyjaciół po nawet 2 latach.',
      'Owce hodowlane trzeba strzyc raz w roku — ich wełna sama nie przestaje rosnąć.',
      'Owca widzi prawie wszystko dookoła — nawet to, co dzieje się za nią.',
    ],
    size_pl: 'Wysokość 80–120 cm. Waga 45–160 kg.',
    lifespan_pl: '10–12 lat',
    diet_pl: 'Trawa, siano — przeżuwa godzinami.',
  },
  goat: {
    facts_pl: [
      'Kozy mają prostokątne źrenice — widzą prawie 320° wokół siebie.',
      'Wspinają się po niemal pionowych skałach — i nawet po drzewach.',
      'Każda koza ma własny "akcent" w beczeniu.',
    ],
    size_pl: 'Wysokość 60–100 cm. Waga 20–140 kg.',
    lifespan_pl: '15–18 lat',
    diet_pl: 'Wszystko — trawa, gałązki, kora, czasem śmieci.',
  },
  rabbit: {
    facts_pl: [
      'Królik widzi prawie 360° dookoła siebie — tylko nos w martwej strefie.',
      'Skacze nawet metr w górę, a każde ucho może obracać osobno.',
      'Zęby królika rosną przez całe życie — musi je ścierać gryzieniem.',
    ],
    size_pl: 'Długość 30–50 cm. Waga 1,5–6 kg.',
    lifespan_pl: '8–12 lat',
    diet_pl: 'Trawa, siano, warzywa — wegetarianin.',
  },

  // === Afryka ekstra ===
  leopard: {
    facts_pl: [
      'Lampart wciąga zdobycz na drzewo, żeby zjeść w spokoju — udźwignie cielę cięższe od siebie.',
      'Każdy ma unikalny układ "rozet" — jak odcisk palca.',
      'Najlepiej wspina się ze wszystkich wielkich kotów.',
    ],
    size_pl: 'Długość 90–190 cm. Waga 30–90 kg.',
    lifespan_pl: '12–17 lat',
    diet_pl: 'Antylopy, małpy, ptaki, mniejsze drapieżniki.',
  },
  hippo: {
    tagline_pl: 'najgroźniejszy ssak Afryki',
    facts_pl: [
      'Skóra hipopotama wydziela czerwonawą wydzielinę, która chroni go przed słońcem jak krem z filtrem.',
      'Mimo wagi 3 ton biega 30 km/h.',
      'Broni swojej rzeki tak zaciekle, że jest jednym z najgroźniejszych zwierząt Afryki.',
    ],
    size_pl: 'Długość 3,5–5 m. Waga 1,5–4 ton.',
    lifespan_pl: '40–50 lat',
    diet_pl: 'Trawa — 40 kg dziennie nocą na lądzie.',
  },
  rhino: {
    facts_pl: [
      'Róg nosorożca to taka sama keratyna jak nasze paznokcie — i tak samo odrasta.',
      'Mimo wagi 2 ton biega 50 km/h.',
      'Nosorożce białe są szare — nazwa to błąd tłumacza.',
    ],
    size_pl: 'Długość 3,5–4 m. Waga 1,5–3 tony.',
    lifespan_pl: '35–50 lat',
    diet_pl: 'Trawa, liście, gałązki — wegetarianin.',
  },
  gorilla: {
    facts_pl: [
      'Goryl uderza w pierś, kiedy chce zaimponować — to pokaz siły, a nie atak.',
      'Dzieli z człowiekiem 98% genów.',
      'Samiec "srebrnogrzbiety" prowadzi rodzinę 5–30 goryli.',
    ],
    size_pl: 'Wysokość 1,4–1,8 m. Waga 70–200 kg.',
    lifespan_pl: '35–40 lat dziko',
    diet_pl: 'Liście, łodygi, owoce, czasem mrówki — głównie roślinożerca.',
  },
  chimpanzee: {
    facts_pl: [
      'Szympansy używają patyków do "łowienia" termitów z gniazda.',
      'Nasi najbliżsi krewni — dzielimy z nimi 98,7% genów.',
      'Porozumiewają się dziesiątkami gestów, min i odgłosów.',
    ],
    size_pl: 'Wysokość 1–1,7 m. Waga 30–70 kg.',
    lifespan_pl: '40–50 lat',
    diet_pl: 'Owoce, liście, owady, czasem mięso (małe małpy).',
  },
  hyena: {
    facts_pl: [
      'Hieny "chichoczą" — tak porozumiewają się ze stadem, np. przy jedzeniu.',
      'Mają bardzo silne szczęki — kruszą nawet grube kości.',
      'Klanami rządzą samice — większe i silniejsze od samców.',
    ],
    size_pl: 'Długość 95–165 cm. Waga 40–85 kg.',
    lifespan_pl: '12 lat dziko',
    diet_pl: 'Wszystko — od świeżej zdobyczy po stare kości.',
  },
  meerkat: {
    tagline_pl: 'rodzinny strażnik',
    facts_pl: [
      'Surykatki wystawiają jednego "wartownika" na słupku — ostrzega 10 sygnałami.',
      'Klan to 20–30 osobników — wszyscy pomagają wychowywać młode.',
      'Są częściowo odporne na jad skorpionów, a dorosłe uczą młode, jak je bezpiecznie łapać.',
    ],
    size_pl: 'Długość 25–35 cm. Waga 700–950 g.',
    lifespan_pl: '7–10 lat',
    diet_pl: 'Owady, skorpiony, jaszczurki, małe gryzonie.',
  },
  ostrich: {
    facts_pl: [
      'Struś biega 70 km/h — najszybszy ptak na lądzie.',
      'Składa największe jaja świata — jedno waży 1,5 kg.',
      'Nie chowa głowy w piasek — to mit. Kładzie ją na ziemi, żeby się ukryć.',
    ],
    size_pl: 'Wysokość 2–2,8 m. Waga 100–160 kg.',
    lifespan_pl: '40–50 lat',
    diet_pl: 'Trawa, nasiona, owady, jaszczurki.',
  },
  crocodile: {
    facts_pl: [
      'Krokodyl naprawdę "płacze" podczas jedzenia — łzy nawilżają mu oczy.',
      'Przodkowie krokodyli żyli już w czasach dinozaurów.',
      'Jego zgryz jest najsilniejszy ze wszystkich zwierząt — 2 tony nacisku.',
    ],
    size_pl: 'Długość 3–6 m. Waga 200–1000 kg.',
    lifespan_pl: '70–100 lat',
    diet_pl: 'Ryby, ptaki, ssaki — wszystko, co podejdzie do wody.',
  },

  // === Dżungla ekstra ===
  jaguar: {
    facts_pl: [
      'Jaguar ma najsilniejsze szczęki ze wszystkich kotów — gryzie żółwia w skorupę.',
      'Świetnie pływa — łapie kajmana w wodzie.',
      'Czarna "pantera" to po prostu jaguar z czarnym futrem.',
    ],
    size_pl: 'Długość 1,1–1,9 m. Waga 60–150 kg.',
    lifespan_pl: '12–15 lat',
    diet_pl: 'Kajmany, kapibary, jelenie, żółwie.',
  },
  orangutan: {
    facts_pl: [
      'Orangutany budują codziennie nowe gniazdo na drzewie — i przykrywają się "kocem" z liści.',
      'Mama nosi małe 6 lat — najdłużej ze wszystkich zwierząt poza człowiekiem.',
      'Używają narzędzi — patyków do wydobywania nasion z owoców.',
    ],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 35–90 kg.',
    lifespan_pl: '35–45 lat',
    diet_pl: 'Owoce (głównie figi), liście, kora, czasem owady.',
  },
  anaconda: {
    tagline_pl: 'najcięższy wąż świata',
    facts_pl: [
      'Anakonda to najcięższy wąż świata — waży do 200 kg.',
      'Owija się wokół zdobyczy i ją dusi — nie ma jadu.',
      'Pływa lepiej, niż czołga się po lądzie — często wisi w wodzie.',
    ],
    size_pl: 'Długość 4–7 m. Waga 50–200 kg.',
    lifespan_pl: '15–20 lat',
    diet_pl: 'Kapibary, kajmany, ptaki, ryby.',
  },
  toucan: {
    facts_pl: [
      'Wielki dziób tukana waży zaskakująco mało — jest pusty w środku.',
      'Dziób pomaga regulować temperaturę ciała — działa jak chłodnica.',
      'Mimo długiego dzioba potrafi delikatnie zerwać jagodę bez uszkodzenia.',
    ],
    size_pl: 'Długość 55–65 cm.',
    lifespan_pl: '15–20 lat',
    diet_pl: 'Owoce, jaja innych ptaków, owady, jaszczurki.',
  },

  // === Arktyka / morze ekstra ===
  walrus: {
    facts_pl: [
      'Mors wbija długie kły w lód i podciąga się na nich, wychodząc z wody.',
      'Wąsy wyczuwają małże pod piaskiem — zjada 6000 dziennie.',
      'Skóra ma 4 cm grubości — pod nią 15 cm tłuszczu.',
    ],
    size_pl: 'Długość 2,7–3,6 m. Waga 800–1700 kg.',
    lifespan_pl: '30–40 lat',
    diet_pl: 'Małże, krewetki, ślimaki morskie, czasem foki.',
  },
  arctic_fox: {
    facts_pl: [
      'Lis polarny zmienia kolor futra zimą na śnieżnobiały, latem na brązowy.',
      'Słyszy lemingi pod 1 m śniegu — i skacze, żeby je złapać.',
      'Wytrzymuje mróz nawet –50°C — ma jedno z najcieplejszych futer wśród ssaków.',
    ],
    size_pl: 'Długość 45–70 cm. Waga 3–8 kg.',
    lifespan_pl: '3–6 lat dziko',
    diet_pl: 'Lemingi, ptaki, jaja, padlina po niedźwiedziach polarnych.',
  },
  reindeer: {
    facts_pl: [
      'Renifery widzą światło ultrafioletowe — pomocne w odróżnieniu mchu od śniegu.',
      'To jedyny gatunek jelenia, w którym samice też mają poroże.',
      'Migrują 5000 km rocznie — najdłużej ze wszystkich ssaków lądowych.',
    ],
    size_pl: 'Wysokość 85–150 cm. Waga 60–300 kg.',
    lifespan_pl: '12–15 lat',
    diet_pl: 'Mchy, porosty, grzyby, trawa.',
  },
  orca: {
    tagline_pl: 'czarno-biały wilk mórz',
    facts_pl: [
      'Orki uczą się polowania w rodzinie przez lata — każda rodzina ma swój "język".',
      'Mózg orki waży około 4 razy więcej niż ludzki.',
      'Niektóre rodziny polują na rekiny, inne tylko na łososie — kulturowo.',
    ],
    size_pl: 'Długość 6–10 m. Waga 3–6 ton.',
    lifespan_pl: '40–80 lat',
    diet_pl: 'Ryby, foki, pingwiny, czasem rekiny i wieloryby.',
  },
  octopus: {
    facts_pl: [
      'Ośmiornica ma trzy serca, niebieską krew i 9 mózgów — jeden główny + 8 w ramionach.',
      'Otwiera słoiki i ucieka z akwariów.',
      'Zmienia kolor i fakturę skóry w mgnieniu oka — choć jest ślepa na kolory.',
    ],
    size_pl: 'Długość 30–90 cm (zależnie od gatunku).',
    lifespan_pl: '1–5 lat',
    diet_pl: 'Małże, kraby, ryby, krewetki.',
  },
  sea_turtle: {
    facts_pl: [
      'Żółw morski wraca na tę samą plażę co dekady wcześniej — żeby złożyć jaja.',
      'Może przepłynąć 16 000 km w jednej migracji.',
      'Tylko 1 na 1000 młodych dożywa dorosłości.',
    ],
    size_pl: 'Długość 60–200 cm. Waga 50–700 kg.',
    lifespan_pl: '50–80 lat',
    diet_pl: 'Meduzy, glony, trawa morska, kraby.',
  },

  // === Australia ===
  kangaroo: {
    facts_pl: [
      'Kangur skacze nawet 9 metrów w jednym susie — to ich jedyny sposób biegania.',
      'Mama nosi małego 8 miesięcy w torbie — może go "pauzować" w gorsze lata.',
      'Kangury żyją w grupach, które po angielsku nazywa się "mob".',
    ],
    size_pl: 'Wysokość 1–2 m. Waga 25–90 kg.',
    lifespan_pl: '15–20 lat',
    diet_pl: 'Trawa, liście — wyłącznie roślinożerca.',
  },
  koala: {
    facts_pl: [
      'Koala śpi 20 godzin na dobę — bo liście eukaliptusa są mało pożywne i trudne do strawienia.',
      'Małe rodzi się wielkości fasolki i wczołguje do torby mamy.',
      'Mimo wyglądu — nie jest niedźwiedziem, tylko torbaczem.',
    ],
    size_pl: 'Długość 60–85 cm. Waga 4–15 kg.',
    lifespan_pl: '13–18 lat',
    diet_pl: 'Prawie wyłącznie liście eukaliptusa — tylko kilkudziesięciu gatunków.',
  },
  platypus: {
    tagline_pl: 'puzzle natury',
    facts_pl: [
      'Dziobak składa jaja, choć jest ssakiem — jeden z dwóch takich na świecie.',
      'Samce mają jadowite ostrogi na tylnych nogach.',
      'Wyczuwa pole elektryczne ofiar w wodzie — łowi z zamkniętymi oczami.',
    ],
    size_pl: 'Długość 40–60 cm. Waga 0,7–2,4 kg.',
    lifespan_pl: '15–17 lat',
    diet_pl: 'Skorupiaki, owady wodne, larwy, robaki.',
  },

  // === Owady ===
  bee: {
    tagline_pl: 'przyjaciółka rolnika',
    facts_pl: [
      'Pszczoła robi miód z nektaru — na jedną łyżeczkę miodu pszczoły odwiedzają tysiące kwiatów.',
      'Pszczoły zapylają rośliny, od których zależy około jednej trzeciej naszego jedzenia.',
      'Tańczą, żeby pokazać innym, gdzie są kwiaty — "ósemką" wskazują kierunek.',
    ],
    size_pl: 'Długość 12–15 mm.',
    lifespan_pl: '5 tygodni (robotnica) – 5 lat (królowa)',
    diet_pl: 'Nektar i pyłek kwiatów.',
  },
  ant: {
    facts_pl: [
      'Mrówka uniesie nawet 50 razy więcej, niż sama waży.',
      'Na Ziemi żyje około 20 biliardów mrówek — to ok. 2,5 miliona na każdego człowieka!',
      'Komunikują się zapachem — feromonami wskazują drogę do jedzenia.',
    ],
    size_pl: 'Długość 2–25 mm.',
    lifespan_pl: '1 rok (robotnica) – 30 lat (królowa)',
    diet_pl: 'Wszystko — od cukru po inne owady. Zależy od gatunku.',
  },
  butterfly: {
    facts_pl: [
      'Motyl smakuje świat… stopkami — receptory smaku ma na łapkach.',
      'Najpierw jest gąsienicą, potem śpi 2 tygodnie w poczwarce — i wychodzi z niej motyl.',
      'Niektóre migrują 4000 km — np. monarcha do Meksyku.',
    ],
    size_pl: 'Rozpiętość skrzydeł 2–30 cm.',
    lifespan_pl: '2–4 tygodnie (większość), do 1 roku (monarcha)',
    diet_pl: 'Nektar kwiatów — przez ssawkę zwiniętą jak sprężynka.',
  },
  ladybug: {
    facts_pl: [
      'Biedronka zjada nawet 5000 mszyc rocznie — przyjaciel ogrodnika.',
      'Czerwony kolor ostrzega "uważaj, jestem niesmaczna" — dla ptaków.',
      'Najczęstsza w Polsce ma 7 kropek, ale są gatunki z 2, 10 i 22 kropkami.',
    ],
    size_pl: 'Długość 5–10 mm.',
    lifespan_pl: '1–2 lata',
    diet_pl: 'Mszyce, pleśń, czasem pyłek — drapieżnik wśród owadów.',
  },

  // === Mityczne ===
  trex: {
    tagline_pl: 'król drapieżnych dinozaurów',
    facts_pl: [
      'T-Rex miał najsilniejszy zgryz wśród zwierząt lądowych historii — 6 ton.',
      'Jego zęby miały 20 cm długości — jak nóż kuchenny.',
      'Żył 68–66 milionów lat temu — wyginął razem z innymi dinozaurami.',
    ],
    size_pl: 'Długość 12 m, wysokość 4 m, waga 8 ton.',
    lifespan_pl: '~30 lat',
    diet_pl: 'Inne dinozaury — głównie hadrozaury i triceratopsy.',
  },
  dragon: {
    tagline_pl: 'stworzenie z legend',
    facts_pl: [
      'Smok ziejący ogniem występuje w mitach niemal każdej kultury — od Chin po Skandynawię.',
      'W Polsce najsłynniejszy: Smok Wawelski pod Krakowem.',
      'W europejskich legendach strzeże skarbów, w chińskich — przynosi szczęście.',
    ],
    habitat_pl: 'tylko w legendach, baśniach i grach',
  },
  unicorn: {
    facts_pl: [
      'Jednorożec ma róg o magicznej mocy — symbol czystości w średniowieczu.',
      'Średniowieczne "rogi jednorożca" sprzedawane jako lekarstwo to były kły narwala.',
      'Występuje w mitach indyjskich, chińskich i europejskich.',
    ],
    habitat_pl: 'w bajkach i legendach',
  },
  mammoth: {
    tagline_pl: 'kosmaty olbrzym epoki lodowcowej',
    facts_pl: [
      'Mamut miał gęste futro i warstwę tłuszczu grubą na 9 cm — żył w mroźnej tundrze.',
      'Wymarł 4000 lat temu — ostatnie żyły na Wyspie Wrangla równolegle z piramidami w Egipcie.',
      'Naukowcy chcą go "wskrzesić" z DNA znalezionym w wiecznej zmarzlinie.',
    ],
    size_pl: 'Wysokość 3,5 m. Waga 6–8 ton.',
    lifespan_pl: '60–80 lat',
    diet_pl: 'Trawa, mchy, kora — 200 kg dziennie.',
  },
  sabretooth: {
    facts_pl: [
      'Tygrys szablozębny miał kły wielkości banana — 28 cm długości.',
      'Mimo nazwy, nie był tygrysem — należał do osobnej rodziny kotów.',
      'Wymarł 10 000 lat temu razem z mamutami.',
    ],
    size_pl: 'Długość 2 m. Waga 200–400 kg.',
    lifespan_pl: '20–40 lat',
    diet_pl: 'Mamuty, bizony, jelenie — duża, powolna zwierzyna.',
  },
  phoenix: {
    facts_pl: [
      'Feniks odradza się z popiołów co 500 lat — symbol nieśmiertelności.',
      'Występuje w mitach Egiptu, Grecji, Chin i Japonii.',
      'W chrześcijaństwie stał się symbolem zmartwychwstania.',
    ],
    habitat_pl: 'w mitach starożytnych cywilizacji',
  },
  kraken: {
    facts_pl: [
      'Kraken to legendarna ośmiornica zatapiająca statki — z opowieści skandynawskich.',
      'Prawdziwy "kraken" to kalmar olbrzymi — istnieje naprawdę, do 13 m długości.',
      'Pierwsze opisy pojawiły się w islandzkich sagach z XII wieku.',
    ],
    habitat_pl: 'w mrocznych głębinach Atlantyku — według legend',
  },
  mermaid: {
    facts_pl: [
      'Już starożytni Grecy opowiadali o syrenach, które śpiewem wabiły żeglarzy.',
      'Słynna polska syrena z herbu Warszawy.',
      'Marynarze przez wieki mylili je z manatami i diugoniami.',
    ],
    habitat_pl: 'w morzach i legendach żeglarzy',
  },
  yeti: {
    facts_pl: [
      'Yeti — "Człowiek Śniegu" — żyje rzekomo w Himalajach.',
      'Opisy mówią o stworzeniu 2 m wysokim, pokrytym białym futrem.',
      'Niektóre "ślady yeti" okazały się tropami niedźwiedzia himalajskiego.',
    ],
    habitat_pl: 'w mroźnych szczytach Himalajów — według legend',
  },

  // === Polska las — pozostałe ssaki ===
  marten: {
    facts_pl: [
      'Kuny mieszkają nawet na strychach domów — bardzo sprytne, otwierają drzwi.',
      'Świetnie wspinają się po drzewach — skaczą 4 m między gałęziami.',
      'W zimie tropią wiewiórki w ich własnych gniazdach.',
    ],
    size_pl: 'Długość 40–55 cm + ogon. Waga 1–2 kg.',
    lifespan_pl: '8–10 lat',
    diet_pl: 'Wiewiórki, ptaki, jaja, owoce.',
  },
  mouse: {
    facts_pl: [
      'Mysz przejdzie przez szczelinę grubości ołówka.',
      'Skacze 30 cm w pionie — proporcjonalnie jak człowiek na 2 piętro.',
      'Mysz ma świetny węch — rozpoznaje inne myszy po zapachu.',
    ],
    size_pl: 'Długość 7–10 cm + ogon. Waga 15–30 g.',
    lifespan_pl: '1–2 lata',
    diet_pl: 'Ziarna, owoce, czasem owady — wszystkożerca.',
  },
  hamster: {
    facts_pl: [
      'Chomik chowa jedzenie w policzkach — gdy są pełne, jego głowa robi się dwa razy szersza.',
      'W nocy potrafi przebiec w kołowrotku nawet kilka kilometrów — tak jak na wolności szukałby jedzenia.',
      'Najczęstszy chomik domowy pochodzi z Syrii — odkryty dopiero w 1930.',
    ],
    size_pl: 'Długość 8–15 cm. Waga 100–200 g.',
    lifespan_pl: '2–3 lata',
    diet_pl: 'Ziarna, warzywa, owoce, czasem mączniki.',
  },

  // === Sawanna / Afryka extra ===
  jackal: {
    facts_pl: [
      'Szakale często polują w parach — i łączą się na całe życie.',
      'Są mistrzami kradzieży — zabierają jedzenie nawet lwom.',
      'W egipskiej mitologii Anubis — bóg podziemi — miał głowę szakala.',
    ],
    size_pl: 'Długość 70–90 cm. Waga 7–14 kg.',
    lifespan_pl: '10–12 lat',
    diet_pl: 'Gryzonie, ptaki, owoce, padlina.',
  },
  flamingo: {
    facts_pl: [
      'Flamingi są różowe od pokarmu — krewetek i alg.',
      'Stoją na jednej nodze, bo to oszczędza ciepło i energię.',
      'Najmłodsze są szare — bieleją po roku, różowieją po 3–4 latach.',
    ],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 2–4 kg.',
    lifespan_pl: '30–40 lat',
    diet_pl: 'Krewetki, glony, plankton — filtruje wodę dziobem.',
  },
  buffalo: {
    facts_pl: [
      'Stado bawołów potrafi przegonić nawet lwa.',
      'Ranny bawół potrafi zawrócić i zaatakować — dlatego uważa się go za bardzo groźnego.',
      'Razem chronią młode, otaczając je kręgiem.',
    ],
    size_pl: 'Wysokość 1,4–1,7 m. Waga 500–900 kg.',
    lifespan_pl: '20 lat dziko',
    diet_pl: 'Trawa — całymi dniami pasą się w stadzie.',
  },

  // === Domowe / farma extra ===
  parrot: {
    facts_pl: [
      'Niektóre papugi powtarzają ponad 100 słów — papuga Alex umiała liczyć do 6.',
      'Żyją w stadach, gdzie cały dzień rozmawiają.',
      'Niektóre żyją 80 lat — dłużej niż ich właściciele.',
    ],
    size_pl: 'Długość 10–100 cm (zależnie od gatunku).',
    lifespan_pl: '15–80 lat',
    diet_pl: 'Owoce, nasiona, orzechy, kwiaty.',
  },
  duck: {
    facts_pl: [
      'Kaczka smaruje pióra tłuszczem z gruczołu przy ogonie — dlatego nie przemakają.',
      'Mówi się, że kwakanie kaczki nie ma echa — to mit, echo jest, tylko trudno je usłyszeć.',
      'Małe kaczki idą za pierwszą rzeczą, którą zobaczą po wykluciu — nawet człowiekiem.',
    ],
    size_pl: 'Długość 50–65 cm. Waga 0,7–1,5 kg.',
    lifespan_pl: '8–12 lat',
    diet_pl: 'Trawa, ziarna, drobne ryby, owady — wszystkożerca.',
  },
  goose: {
    facts_pl: [
      'Dzikie gęsi lecą kluczem w kształcie litery V — każda następna korzysta z pędu powietrza za poprzednią.',
      'Są lepszymi stróżami niż psy — głośno krzyczą na każdy hałas.',
      'Pamiętają twarze i niosą urazy latami.',
    ],
    size_pl: 'Długość 75–95 cm. Waga 3–6 kg.',
    lifespan_pl: '15–25 lat',
    diet_pl: 'Trawa, ziarna, rośliny wodne.',
  },

  // === BATCH 4 — pełne uzupełnienie: Polski las / Europa ===
  hare: {
    facts_pl: ['Zając szarak biega 70 km/h — szybciej niż wilk.', 'Nie kopie nor — leży w "kotlinkach" w trawie.'],
    size_pl: 'Długość 50–70 cm. Waga 3–6 kg.', lifespan_pl: '5–8 lat', diet_pl: 'Trawa, młode pędy, kora.',
  },
  weasel: {
    facts_pl: ['Łasica to najmniejszy drapieżny ssak świata.', 'Zimą jej futro robi się prawie białe.'],
    size_pl: 'Długość 17–25 cm. Waga 30–250 g.', lifespan_pl: '2–3 lata', diet_pl: 'Myszy, norniki, ptaki.',
  },
  stoat: {
    facts_pl: ['Zimą gronostaj zmienia futro na śnieżnobiałe — z czarnym końcem ogona.', 'Jego futro zdobiło średniowieczne płaszcze królów.'],
    size_pl: 'Długość 25–35 cm. Waga 100–450 g.', lifespan_pl: '4–6 lat', diet_pl: 'Myszy, króliki, ptaki.',
  },
  field_mouse: {
    facts_pl: ['Mysz polna ma długi ogon do balansu w trawie.', 'Jeden hektar pola może żywić 1000 myszy polnych.'],
    size_pl: 'Długość 8–11 cm + ogon.', lifespan_pl: '1–2 lata', diet_pl: 'Nasiona, owoce, owady.',
  },
  mole: {
    facts_pl: ['Kret kopie tunele tak szybko jak inny zwierzak biega.', 'Słabo widzi, ale wąchanie ma podwójne — porównuje zapach z lewej i prawej dziurki nosa.'],
    size_pl: 'Długość 12–16 cm. Waga 70–130 g.', lifespan_pl: '3–5 lat', diet_pl: 'Dżdżownice, larwy, owady.',
  },
  mole_eu: {
    facts_pl: ['Orzesznica przesypia zimę zwinięta w kulkę — śpi nawet 7 miesięcy w roku.', 'Nocą wspina się po leszczynach i objada orzechami.'],
    size_pl: 'Długość 6–9 cm + ogon. Waga 15–40 g.', lifespan_pl: '3–5 lat', diet_pl: 'Orzechy laskowe, owoce, kwiaty, owady.',
  },
  shrew: {
    facts_pl: ['Ryjówka codziennie zjada prawie tyle, ile sama waży — bez jedzenia nie przeżyje nawet doby.', 'Jej kuzynka, ryjówka malutka, to najmniejszy ssak Polski.'],
    size_pl: 'Długość 5–8 cm.', lifespan_pl: '1–1,5 roku', diet_pl: 'Owady, dżdżownice, drobne kręgowce.',
  },
  dormouse: {
    facts_pl: ['Popielica zapada w zimowy sen na pół roku.', 'Mieszka w dziuplach i czasem w ludzkich strychach.'],
    size_pl: 'Długość 13–18 cm + ogon.', lifespan_pl: '6–9 lat', diet_pl: 'Orzechy, żołędzie, owoce, pąki.',
  },
  dormouse_garden: {
    facts_pl: ['Żołędnica przesypia zimę nawet przez pół roku.', 'Ma czarną "maskę" wokół oczu jak mały bandyta.'],
    size_pl: 'Długość 10–17 cm.', lifespan_pl: '4–6 lat', diet_pl: 'Owoce, nasiona, owady, jaja ptaków.',
  },
  vole: {
    facts_pl: ['Nornica buduje podziemne tunele i magazynuje nasiona na zimę.', 'Bez niej sowy i myszołowy nie miałyby co jeść.'],
    size_pl: 'Długość 9–11 cm.', lifespan_pl: '1–2 lata', diet_pl: 'Trawa, korzenie, kora, nasiona.',
  },
  water_shrew: {
    facts_pl: ['Rzęsorek to jeden z niewielu ssaków z lekko jadowitą śliną.', 'Świetnie nurkuje — łapie ryby w strumieniach.'],
    size_pl: 'Długość 7–10 cm.', lifespan_pl: '1–1,5 roku', diet_pl: 'Owady wodne, kijanki, drobne ryby.',
  },
  polecat: {
    facts_pl: ['Tchórz potrafi obronić się cuchnącym sprayem.', 'Praprzodek fretki domowej.'],
    size_pl: 'Długość 30–45 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Żaby, myszy, ptaki, jaja.',
  },
  sable: {
    facts_pl: ['Soból ma jedno z najcenniejszych futer świata.', 'Mieszka w syberyjskiej tajdze.'],
    size_pl: 'Długość 35–55 cm.', lifespan_pl: '8–15 lat', diet_pl: 'Gryzonie, ptaki, czasem ryby i jagody.',
  },
  european_mink: {
    facts_pl: ['Norka świetnie pływa i nurkuje za rybami.', 'W Polsce już wyginęła — wyparła ją norka amerykańska.'],
    size_pl: 'Długość 30–45 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Ryby, raki, żaby, drobne ssaki.',
  },
  musk_rat: {
    facts_pl: ['Piżmak buduje w mokradłach pływające chatki z trzciny.', 'Pochodzi z Ameryki — w 1905 roku wypuszczono go w Czechach, skąd dotarł do Polski.'],
    size_pl: 'Długość 25–35 cm + ogon.', lifespan_pl: '3–4 lata', diet_pl: 'Rośliny wodne, małże, raki.',
  },
  european_hamster: {
    facts_pl: ['Chomik europejski jest większy od domowego — i mieszka dziko na polach.', 'W norze gromadzi na zimę nawet kilka kilogramów ziaren.'],
    size_pl: 'Długość 20–35 cm.', lifespan_pl: '4–8 lat', diet_pl: 'Ziarna, korzenie, owady, czasem małe ptaki.',
  },
  wildcat: {
    facts_pl: ['Żbik wygląda jak duży kot domowy, ale jest rzadkim dzikim drapieżnikiem.', 'W Polsce żyje tylko w Bieszczadach i Beskidach.'],
    size_pl: 'Długość 60–90 cm. Waga 3–8 kg.', lifespan_pl: '7–10 lat', diet_pl: 'Gryzonie, ptaki, zające.',
  },
  flying_squirrel: {
    facts_pl: ['Polatucha szybuje 50 metrów między drzewami na "skrzydłach" ze skóry — żyje w lasach Finlandii, krajów bałtyckich i Syberii.', 'Aktywna tylko nocą — w dzień śpi w dziupli.'],
    size_pl: 'Długość 13–20 cm + ogon.', lifespan_pl: '5–10 lat', diet_pl: 'Orzechy, nasiona, jagody.',
  },
  chipmunk: {
    facts_pl: ['Burunduk pochodzi z Syberii i Azji — w policzkach przenosi naraz mnóstwo nasion.', 'Mieszka pod ziemią w długich tunelach.'],
    size_pl: 'Długość 13–17 cm + ogon.', lifespan_pl: '3–5 lat', diet_pl: 'Nasiona, orzechy, jagody, grzyby.',
  },
  chamois: {
    facts_pl: ['Kozice pewnie skaczą po stromych skałach — mają kopyta jak antypoślizgowe buty.', 'W Tatrach żyją na wysokości 1500–2500 m.'],
    size_pl: 'Wysokość 70–85 cm. Waga 25–50 kg.', lifespan_pl: '15–20 lat', diet_pl: 'Trawa wysokogórska, mchy, porosty.',
  },
  ibex: {
    facts_pl: ['Koziorożec chodzi po niemal pionowych skałach.', 'Samiec ma rogi długości 1 metra.'],
    size_pl: 'Wysokość 70–110 cm. Waga 60–120 kg.', lifespan_pl: '15–20 lat', diet_pl: 'Trawa, mchy, młode pędy.',
  },
  marmot: {
    facts_pl: ['Świstak gwiżdże ostrzegawczo, gdy widzi orła — słychać z kilometra.', 'Zimuje 6 miesięcy w norze.'],
    size_pl: 'Długość 40–60 cm. Waga 3–8 kg.', lifespan_pl: '14–18 lat', diet_pl: 'Trawa, kwiaty, korzenie.',
  },
  mountain_hare: {
    facts_pl: ['Zając bielak zimą staje się śnieżnobiały.', 'W Polsce jest bardzo rzadki — żyje tylko na północnym wschodzie kraju.'],
    size_pl: 'Długość 45–65 cm.', lifespan_pl: '4–6 lat', diet_pl: 'Trawa, gałązki, kora.',
  },

  // Polski las — ptaki
  finch: {
    facts_pl: ['Samce zięby śpiewają w każdej okolicy trochę inaczej — jak w gwarze.', 'To jeden z najczęstszych ptaków polskich lasów.'],
    size_pl: 'Długość 14–16 cm.', lifespan_pl: '3–5 lat', diet_pl: 'Nasiona, owady (latem).',
  },
  bullfinch: {
    facts_pl: ['Gil ma czerwoną pierś — łatwo go zobaczyć zimą na śniegu.', 'Para gili zostaje razem przez całe życie.'],
    size_pl: 'Długość 14–17 cm.', lifespan_pl: '3–5 lat', diet_pl: 'Nasiona, pąki, jagody.',
  },
  goldfinch: {
    facts_pl: ['Szczygieł kocha nasiona ostu — wyciąga je długim dziobem.', 'Ma czerwoną twarzyczkę i jaskrawe żółte skrzydła.'],
    size_pl: 'Długość 12–14 cm.', lifespan_pl: '3–8 lat', diet_pl: 'Nasiona ostów, mniszka, słonecznika.',
  },
  hawfinch: {
    facts_pl: ['Grubodziób potrafi rozłupać pestkę wiśni jak dziadek do orzechów — 50 kg nacisku!', 'Ma najgrubszy dziób ze wszystkich ptaków śpiewających Europy.'],
    size_pl: 'Długość 16–18 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Pestki owoców, nasiona, czasem owady.',
  },
  crossbill: {
    facts_pl: ['Krzyżodziób ma "skrzyżowany" dziób — wyłuskuje nasiona z szyszek.', 'Lęgi ma nawet w styczniu, gdy jest mróz.'],
    size_pl: 'Długość 15–17 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Nasiona z szyszek świerków, sosen, modrzewi.',
  },
  siskin: {
    facts_pl: ['Czyże w stadach wyglądają jak żółto-zielone obłoki.', 'Zimą żywią się nasionami olchy i brzozy.'],
    size_pl: 'Długość 11–12 cm.', lifespan_pl: '3–6 lat', diet_pl: 'Nasiona drzew liściastych, owady (latem).',
  },
  goldcrest: {
    facts_pl: ['Mysikrólik to najmniejszy ptak Europy — waży 5 gramów (jak 2 grosze).', 'Ma żółto-pomarańczową "koronę" na głowie.'],
    size_pl: 'Długość 8–9 cm.', lifespan_pl: '2–3 lata', diet_pl: 'Bardzo małe owady, pajączki.',
  },
  waxwing: {
    facts_pl: ['Jemiołuszki przylatują zimą i obżerają się jarzębiną.', 'Po fermentujących owocach bywają lekko "pijane".'],
    size_pl: 'Długość 18–20 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Jarzębina, jagody, owady (latem).',
  },
  kingfisher: {
    facts_pl: ['Zimorodek nurkuje za rybą jak niebiesko-pomarańczowa strzała.', 'Mieszka w norach wykopanych w urwistych brzegach.'],
    size_pl: 'Długość 16–17 cm.', lifespan_pl: '4–7 lat', diet_pl: 'Drobne ryby, owady wodne.',
  },
  black_woodpecker: {
    facts_pl: ['Dzięcioł czarny jest największym dzięciołem Europy — wielkości wrony.', 'Wykuwa dziuple wielkie jak skrzynka na buty.'],
    size_pl: 'Długość 40–55 cm.', lifespan_pl: '10–14 lat', diet_pl: 'Larwy mrówek i chrząszczy spod kory.',
  },
  eagle_owl_white: {
    facts_pl: ['Sowa uszata ma długie pióra na głowie wyglądające jak uszy.', 'Te "uszy" to nie uszy — to ozdoby. Słyszy bocznymi otworami głowy.'],
    size_pl: 'Długość 35–40 cm.', lifespan_pl: '10–25 lat', diet_pl: 'Nornice, myszy, drobne ptaki.',
  },
  hawk: {
    facts_pl: ['Jastrząb zaskakuje zdobycz wybijając się zza krzaka.', 'Jego oczy widzą szczegóły 8 razy lepiej niż ludzkie.'],
    size_pl: 'Długość 45–65 cm.', lifespan_pl: '11–19 lat', diet_pl: 'Gołębie, sójki, kuropatwy, zające.',
  },
  falcon: {
    tagline_pl: 'najszybsze zwierzę świata',
    facts_pl: ['Sokół wędrowny pikuje 320 km/h — najszybsze zwierzę świata!', 'Po II wojnie prawie wyginął — wytruły go pestycydy DDT.'],
    size_pl: 'Długość 36–58 cm.', lifespan_pl: '12–17 lat', diet_pl: 'Inne ptaki łapane w locie.',
  },
  eagle: {
    facts_pl: ['Orzeł widzi mysz z wysokości kilometra.', 'Potrafi unieść w szponach zdobycz ważącą kilka kilogramów.'],
    size_pl: 'Długość 70–90 cm. Rozpiętość 2 m.', lifespan_pl: '15–25 lat', diet_pl: 'Króliki, ryby, ptaki, padlina.',
  },
  white_eagle: {
    tagline_pl: 'największy ptak drapieżny Polski',
    facts_pl: ['Bielik to największy ptak drapieżny Polski — ma biały ogon i żółty dziób.', 'Jego rozpostarte skrzydła mają 2,5 metra.'],
    size_pl: 'Długość 70–90 cm. Rozpiętość do 2,5 m.', lifespan_pl: '25 lat dziko', diet_pl: 'Ryby, ptaki wodne, padlina.',
  },
  buzzard: {
    facts_pl: ['Myszołów najczęściej krąży wysoko nad polami.', 'Najczęstszy ptak drapieżny Polski.'],
    size_pl: 'Długość 50–58 cm.', lifespan_pl: '12–25 lat', diet_pl: 'Myszy, norniki, dżdżownice, padlina.',
  },
  osprey: {
    facts_pl: ['Rybołów nurkuje za rybą z 30 metrów — i wynurza się z nią w szponach.', 'Łapy ma pokryte kolcami — żeby ryba nie wyśliznęła się.'],
    size_pl: 'Długość 55–63 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Ryby — w 99%.',
  },
  sparrowhawk: {
    facts_pl: ['Krogulec poluje w lesie szybkim slalomem między drzewami.', 'Samiec jest dwa razy mniejszy od samicy.'],
    size_pl: 'Długość 28–40 cm.', lifespan_pl: '4–10 lat', diet_pl: 'Drobne ptaki łapane w locie.',
  },
  hobby: {
    facts_pl: ['Kobuz łapie ważki w locie — i zjada je w powietrzu.', 'Migruje do Afryki na zimę.'],
    size_pl: 'Długość 28–36 cm.', lifespan_pl: '8–11 lat', diet_pl: 'Ważki, jaskółki, jerzyki.',
  },
  kestrel: {
    facts_pl: ['Pustułka wisi nieruchomo w powietrzu — łopocze skrzydłami w miejscu.', 'Widzi mocz nornic w ultrafiolecie — tak znajduje ich norki.'],
    size_pl: 'Długość 32–39 cm.', lifespan_pl: '4–16 lat', diet_pl: 'Nornice, myszy, jaszczurki.',
  },
  peregrine_falcon: {
    facts_pl: ['Sokół wędrowny pikuje 390 km/h — szybciej od samolotu.', 'Mieszka też na wieżowcach — poluje na gołębie miejskie.'],
    size_pl: 'Długość 36–58 cm.', lifespan_pl: '12–17 lat', diet_pl: 'Inne ptaki — głównie gołębie.',
  },
  bald_eagle: {
    tagline_pl: 'symbol USA',
    facts_pl: ['Bielik amerykański widzi mysz z odległości 3 km.', 'Jego rozpostarte skrzydła mają 2,3 m.'],
    size_pl: 'Długość 70–100 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Głównie ryby — łapie je z wody.',
  },
  vulture: {
    facts_pl: ['Sępy mają tak bystry wzrok, że z wysoka wypatrują padlinę na ziemi.', 'Ich żołądki niszczą wszystkie bakterie padliny.'],
    size_pl: 'Długość 95–115 cm. Rozpiętość 2,5 m.', lifespan_pl: '25–40 lat', diet_pl: 'Padlina — szczyt sanitariusza natury.',
  },
  condor: {
    tagline_pl: 'gigant Andów',
    facts_pl: ['Rozpostarte skrzydła kondora mają 3 metry — jak skrzydła awionetki.', 'Może lecieć bez machnięcia skrzydłami 100 km.'],
    size_pl: 'Długość 1–1,3 m. Waga 8–15 kg.', lifespan_pl: '50–70 lat', diet_pl: 'Padlina — głównie martwe guanaki i wikunie.',
  },
  hoopoe: {
    facts_pl: ['Dudek ma piękny czubek z piór — rozkłada go w stresie lub zalotach.', 'Samica dudka smaruje gniazdo cuchnącą wydzieliną — odstrasza nią drapieżniki.'],
    size_pl: 'Długość 25–32 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Owady, larwy spod ziemi.',
  },
  cuckoo: {
    tagline_pl: 'leniwy rodzic',
    facts_pl: ['Kukułka podrzuca jaja do gniazd innych ptaków — jej młode wyrzucają pisklęta gospodarza.', 'Pisklę kukułki bywa 5 razy większe od opiekuna.'],
    size_pl: 'Długość 32–34 cm.', lifespan_pl: '4–13 lat', diet_pl: 'Gąsienice — także trujące, których inne ptaki nie tkną.',
  },
  thrush: {
    facts_pl: ['Drozd rozbija ślimaki o kamień — używa narzędzia.', 'Wczesnym rankiem śpiewa najpiękniej.'],
    size_pl: 'Długość 22–24 cm.', lifespan_pl: '3–10 lat', diet_pl: 'Ślimaki, dżdżownice, owady, owoce.',
  },
  blackbird: {
    facts_pl: ['Kosy śpiewają najpiękniej o poranku — z dachów i drzew.', 'Samiec jest czarny, samica brązowa.'],
    size_pl: 'Długość 24–27 cm.', lifespan_pl: '3–5 lat dziko', diet_pl: 'Dżdżownice, owady, jagody.',
  },
  nightingale: {
    facts_pl: ['Słowik śpiewa w nocy, żeby się popisać przed samicą — zna 250 melodii.', 'To jeden z najbardziej cenionych głosów świata.'],
    size_pl: 'Długość 15–17 cm.', lifespan_pl: '2–6 lat', diet_pl: 'Owady, larwy, czasem jagody.',
  },
  jay: {
    facts_pl: ['Sójki naśladują głosy innych ptaków — także myszołowa, żeby odstraszyć rywali.', 'Magazynują 5000 żołędzi rocznie — sadzą całe lasy.'],
    size_pl: 'Długość 32–35 cm.', lifespan_pl: '4–18 lat', diet_pl: 'Żołędzie, orzechy, owady, jaja innych ptaków.',
  },
  magpie: {
    facts_pl: ['Sroki rozpoznają siebie w lustrze — niewiele zwierząt to potrafi.', 'Mówi się, że sroki kradną błyszczące rzeczy — naukowcy sprawdzili, że to raczej mit!'],
    size_pl: 'Długość 44–46 cm.', lifespan_pl: '3–5 lat dziko', diet_pl: 'Wszystkożerca — owady, jaja, padlina, śmieci.',
  },
  crow: {
    facts_pl: ['Wrony rozpoznają twarze ludzi przez lata.', 'Pamiętają osobę, która je skrzywdziła — i krakają ostrzegawczo.'],
    size_pl: 'Długość 45–47 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Wszystkożerca — od owoców po padlinę.',
  },
  jackdaw: {
    facts_pl: ['Kawki mają jasnoniebieskie oczy — łatwo je rozpoznać.', 'Bardzo społeczne — żyją w stadach po 30–50 ptaków.'],
    size_pl: 'Długość 30–34 cm.', lifespan_pl: '5–15 lat', diet_pl: 'Owady, ziarna, padlina, śmieci.',
  },
  mazurek: {
    facts_pl: ['Mazurek to bliski kuzyn wróbla, spotykany w całej Polsce.', 'Ma brązową czapeczkę i czarną kropkę na policzku.'],
    size_pl: 'Długość 12–14 cm.', lifespan_pl: '2–3 lata', diet_pl: 'Nasiona, owady (latem).',
  },
  sparrow: {
    facts_pl: ['Wróbel kąpie się w pyle, żeby pozbyć się pasożytów.', 'Mieszka tam, gdzie ludzie — wioski, miasta.'],
    size_pl: 'Długość 14–16 cm.', lifespan_pl: '3–5 lat', diet_pl: 'Nasiona, okruszki, owady.',
  },
  starling: {
    facts_pl: ['Szpaki tworzą w niebie ruchome chmury z tysięcy ptaków — "murmuracje".', 'Naśladują dźwięki: alarm, klakson, dzwonek telefonu.'],
    size_pl: 'Długość 19–22 cm.', lifespan_pl: '2–5 lat', diet_pl: 'Owady, dżdżownice, owoce.',
  },
  lark: {
    facts_pl: ['Skowronek śpiewa wisząc nieruchomo w powietrzu — wysoko nad polem.', 'Jego śpiew to symbol polskiego pola wiosną.'],
    size_pl: 'Długość 16–18 cm.', lifespan_pl: '2–5 lat', diet_pl: 'Owady, nasiona, młode pędy.',
  },
  tit: {
    facts_pl: ['Sikorki chodzą do góry nogami po gałęziach.', 'Zimą żywią się ziarnem słonecznika z karmników.'],
    size_pl: 'Długość 11–14 cm.', lifespan_pl: '2–3 lata', diet_pl: 'Owady, nasiona, słonina (zimą).',
  },
  great_tit: {
    facts_pl: ['Bogatka to największa polska sikorka — z żółtym brzuszkiem i czarnym krawatem.', 'Zna 40 różnych odgłosów.'],
    size_pl: 'Długość 14–15 cm.', lifespan_pl: '2–3 lata', diet_pl: 'Owady, larwy, nasiona.',
  },
  pheasant: {
    facts_pl: ['Samce bażanta mają długie, kolorowe ogony — do 50 cm.', 'Sprowadzony do Polski jako ptak łowny — pochodzi z Azji.'],
    size_pl: 'Długość 70–90 cm (samiec z ogonem).', lifespan_pl: '3–5 lat', diet_pl: 'Ziarna, owoce, owady.',
  },
  partridge: {
    facts_pl: ['Kuropatwy biegną w stadzie po polach — zamiast latać.', 'Para zostaje razem na całe życie.'],
    size_pl: 'Długość 28–32 cm.', lifespan_pl: '3–4 lata', diet_pl: 'Nasiona, owady, młode pędy.',
  },
  mallard: {
    facts_pl: ['Krzyżówka to najpopularniejsza dzika kaczka.', 'Samiec ma zieloną głowę, samica jest brązowa.'],
    size_pl: 'Długość 50–65 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Rośliny wodne, ziarna, owady, ryby.',
  },
  grebe: {
    facts_pl: ['Perkoz nosi pisklęta na grzbiecie pływając.', 'Nurkuje za rybami — może być pod wodą 30 sekund.'],
    size_pl: 'Długość 23–29 cm.', lifespan_pl: '5–13 lat', diet_pl: 'Drobne ryby, owady wodne.',
  },
  grebe_great: {
    facts_pl: ['Perkozy dwuczube tańczą w parze na wodzie, trzymając w dziobach roślinki — to ich randka.', 'Świetnie nurkują za rybami — potrafią zostać pod wodą prawie minutę.'],
    size_pl: 'Długość 46–51 cm.', lifespan_pl: '10–19 lat', diet_pl: 'Ryby — głównie płocie, okonie.',
  },
  heron: {
    facts_pl: ['Czapla stoi nieruchomo godzinami, czekając na rybę.', 'Lata wciągając szyję w "S" — kontrast z bocianem.'],
    size_pl: 'Wysokość 90–98 cm.', lifespan_pl: '5–15 lat', diet_pl: 'Ryby, żaby, myszy.',
  },
  pigeon: {
    facts_pl: ['Gołąb pocztowy trafi do domu z setek kilometrów — nawigując po polu magnetycznym Ziemi.', 'Gołębie rozpoznają ludzkie twarze.'],
    size_pl: 'Długość 32–37 cm.', lifespan_pl: '3–6 lat', diet_pl: 'Nasiona, okruszki, owoce.',
  },
  serin: {
    facts_pl: ['Kulczyk to mały, żółty kuzyn kanarka — lubi śpiewać z czubków drzew i anten.', 'Sprowadził się do Polski w XX wieku z południa.'],
    size_pl: 'Długość 11–12 cm.', lifespan_pl: '2–8 lat', diet_pl: 'Nasiona, pąki.',
  },

  // Polski las — gady / płazy
  grass_snake: {
    facts_pl: ['Zaskroniec ma dwie żółte plamy na głowie — łatwo go odróżnić od żmii.', 'Gdy boi się — udaje martwego z wywieszonym językiem.'],
    size_pl: 'Długość 70–120 cm.', lifespan_pl: '15–25 lat', diet_pl: 'Żaby, ropuchy, drobne ryby.',
  },
  slowworm: {
    facts_pl: ['Padalec wygląda jak wąż, ale to beznoga jaszczurka — ma powieki!', 'Odrzuca ogon w niebezpieczeństwie, podobnie jak inne jaszczurki.'],
    size_pl: 'Długość 35–45 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Ślimaki, dżdżownice, owady.',
  },
  lizard: {
    facts_pl: ['Jaszczurka odrzuca ogon przy ataku — odrośnie po kilku miesiącach.', 'Samce jaszczurki zwinki są zielone na bokach.'],
    size_pl: 'Długość 15–25 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Owady, pajęczaki, czasem dżdżownice.',
  },
  fire_salamander: {
    facts_pl: ['Czarno-żółta salamandra ostrzega "uważaj, jestem śliska i trująca!".', 'Skóra wytwarza śluz, który piecze w ustach drapieżników.'],
    size_pl: 'Długość 15–25 cm.', lifespan_pl: '20 lat (do 50 w niewoli)', diet_pl: 'Dżdżownice, ślimaki, owady, pajęczaki.',
  },
  salamander: {
    facts_pl: ['Salamandry potrafią regenerować całe kończyny.', 'Aktywne głównie w deszczowe noce.'],
    size_pl: 'Długość 15–25 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Owady, ślimaki, dżdżownice.',
  },
  newt: {
    facts_pl: ['Traszki wracają do tej samej kałuży co roku, żeby się rozmnożyć.', 'Samce w okresie godowym mają grzbietowy "grzebień".'],
    size_pl: 'Długość 8–15 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Owady wodne, kijanki, drobne skorupiaki.',
  },
  toad: {
    facts_pl: ['Ropucha ma suchszą skórę niż żaba — i grube "guzy" wydzielające truciznę.', 'Aktywna głównie nocą — w dzień się chowa.'],
    size_pl: 'Długość 8–15 cm.', lifespan_pl: '10–12 lat', diet_pl: 'Owady, ślimaki, dżdżownice.',
  },
  axolotl: {
    tagline_pl: 'wiecznie młody',
    facts_pl: ['Aksolotl nigdy nie "dorasta" — całe życie zostaje wodną larwą.', 'Dziko żyje tylko w kanałach jeziora Xochimilco w Meksyku — i jest tam krytycznie zagrożony.', 'Odrasta utracone nogi, oczy, a nawet kawałki mózgu.'],
    size_pl: 'Długość 15–30 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Larwy owadów, drobne ryby, dżdżownice.',
  },

  // Polski las — ryby słodkowodne
  carp: {
    facts_pl: ['Karp jest tradycyjną rybą wigilijną w Polsce.', 'Sprowadzony z Azji w średniowieczu — żył już w stawach mnichów.'],
    size_pl: 'Długość 30–80 cm. Waga 1–15 kg.', lifespan_pl: '20–50 lat', diet_pl: 'Rośliny wodne, larwy, drobne skorupiaki.',
  },
  pike: {
    facts_pl: ['Szczupak czeka w bezruchu w zaroślach i atakuje błyskawicznie.', 'Drapieżnik nr 1 polskich wód słodkich.'],
    size_pl: 'Długość 50–130 cm. Waga 2–20 kg.', lifespan_pl: '15–25 lat', diet_pl: 'Inne ryby, żaby, kaczęta.',
  },
  catfish: {
    facts_pl: ['Sum ma "wąsy" — to czujniki smaku.', 'Największa ryba polskich rzek — może mieć 3 m i 100 kg.'],
    size_pl: 'Długość do 3 m. Waga do 100 kg.', lifespan_pl: '15–30 lat', diet_pl: 'Ryby, żaby, ptaki wodne.',
  },
  eel: {
    facts_pl: ['Węgorz przemierza tysiące kilometrów, by się rozmnożyć — z Bałtyku do Morza Sargassowego.', 'Może pełzać po lądzie w mokrej trawie.'],
    size_pl: 'Długość 50–150 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Ryby, raki, larwy.',
  },
  salmon: {
    facts_pl: ['Łosoś wraca do rzeki, w której się urodził — by tam złożyć ikrę.', 'Skacze pod prąd wodospady 3 m wysokie.'],
    size_pl: 'Długość 70–150 cm.', lifespan_pl: '4–7 lat', diet_pl: 'Krewetki, drobne ryby (w morzu).',
  },
  trout: {
    facts_pl: ['Pstrągi lubią zimne, czyste górskie strumienie.', 'Wskaźnik czystości wody — w brudnej nie żyją.'],
    size_pl: 'Długość 25–60 cm.', lifespan_pl: '7–11 lat', diet_pl: 'Owady, larwy, drobne ryby.',
  },
  tench: {
    facts_pl: ['Lin lubi muliste dno stawów — leży w mule całą zimę.', 'Pokryty śliską warstwą — łatwo mu się prześliznąć.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Małże, larwy, rośliny denne.',
  },
  perch: {
    facts_pl: ['Okoń to drapieżnik o czerwonych płetwach.', 'Ma kolce na pierwszej płetwie grzbietowej.'],
    size_pl: 'Długość 15–50 cm.', lifespan_pl: '5–15 lat', diet_pl: 'Drobne ryby, larwy, skorupiaki.',
  },
  zander: {
    facts_pl: ['Sandacz widzi świetnie nawet w mętnej wodzie.', 'Najsmaczniejsza polska ryba słodkowodna — uważają wędkarze.'],
    size_pl: 'Długość 50–100 cm.', lifespan_pl: '8–15 lat', diet_pl: 'Drobne ryby — głównie ukleje i płocie.',
  },
  roach: {
    facts_pl: ['Płoć ma czerwone oczy — łatwo ją rozpoznać.', 'Najczęstsza polska ryba — pływa w wielkich ławicach.'],
    size_pl: 'Długość 15–40 cm.', lifespan_pl: '7–14 lat', diet_pl: 'Owady, plankton, glony.',
  },
  catfish_polish: {
    facts_pl: ['Brzana ma wąsiki — pomagają znaleźć jedzenie w mule.', 'Lubi szybki nurt rzek.'],
    size_pl: 'Długość 30–90 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Owady wodne, ślimaki, drobne ryby.',
  },
  bream: {
    facts_pl: ['Leszcze pływają w wielkich ławicach — czasem po 100 sztuk.', 'Mają płaskie, srebrzyste ciało.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '10–17 lat', diet_pl: 'Larwy, dżdżownice, plankton.',
  },
  chub: {
    facts_pl: ['Kleń uwielbia szybkie strumienie — i wyskakuje z wody za owadami.', 'Zjada wszystko — od trawy po małe rybki.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Wszystkożerca — od owadów po owoce.',
  },
  crucian: {
    facts_pl: ['Karaś przeżyje zimę w małym, zamarzającym stawie — potrafi bardzo zwolnić swoje życie.', 'Wytrzyma nawet wiele tygodni w wodzie prawie bez tlenu.'],
    size_pl: 'Długość 15–40 cm.', lifespan_pl: '7–14 lat', diet_pl: 'Rośliny, larwy, plankton.',
  },
  burbot: {
    facts_pl: ['Miętus to jedyny dorszowaty w polskich wodach słodkich.', 'Aktywny w nocy i zimą — kocha lód i zimną wodę.'],
    size_pl: 'Długość 30–80 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Drobne ryby, raki, żaby.',
  },
  crayfish: {
    facts_pl: ['Rak ma kleszcze i potrafi pływać do tyłu — odrzucając się ogonem.', 'Tradycyjnie żyje tylko w czystej wodzie.'],
    size_pl: 'Długość 15–25 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Wszystkożerca — od roślin po padlinę.',
  },
  sturgeon: {
    facts_pl: ['Jesiotr ma kostne tarcze zamiast łusek.', 'Może dożyć 100 lat — i mieć 5 metrów długości.'],
    size_pl: 'Długość 2–5 m.', lifespan_pl: '50–100 lat', diet_pl: 'Małże, krewetki, drobne ryby.',
  },

  // Farma — pozostałe
  donkey: {
    facts_pl: ['Osły mają świetną pamięć — pamiętają miejsca po latach.', 'Są bardzo ostrożne, dlatego mówi się "uparte jak osioł".'],
    size_pl: 'Wysokość 90–150 cm.', lifespan_pl: '30–50 lat', diet_pl: 'Trawa, słoma, siano.',
  },
  rooster: {
    facts_pl: ['Kogut ma wewnętrzny zegar — pieje o świcie, nawet gdy jeszcze jest ciemno.', 'Pilnuje swojego stadka kur i ostrzega je przed niebezpieczeństwem.'],
    size_pl: 'Wysokość 40–50 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Ziarno, owady, robaki.',
  },
  alpaca: {
    facts_pl: ['Alpaki cicho nucą — tak porozumiewają się ze stadem.', 'Ich wełna jest cieplejsza i lżejsza od owczej.'],
    size_pl: 'Wysokość 80–100 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Trawa, siano.',
  },
  llama: {
    facts_pl: ['Zdenerwowana lama potrafi splunąć nawet na 3 metry — najczęściej na inne lamy.', 'Mieszkańcy Andów od tysięcy lat używają lam do noszenia ładunków.'],
    size_pl: 'Wysokość 1,7–1,8 m.', lifespan_pl: '15–25 lat', diet_pl: 'Trawa, krzewy.',
  },
  mule: {
    facts_pl: ['Muł to mieszaniec konia i osła — pracowity i wytrzymały.', 'Bardziej wytrzymały od konia, mądrzejszy od osła.'],
    size_pl: 'Wysokość 1,2–1,7 m.', lifespan_pl: '30–40 lat', diet_pl: 'Trawa, siano, owies.',
  },
  turkey: {
    facts_pl: ['Indyk zmienia kolor skóry na głowie — gdy jest podekscytowany, robi się czerwona lub niebieska.', 'Samce stroszą się w ogromny wachlarz piór, gdy chcą zaimponować.'],
    size_pl: 'Długość 100–125 cm.', lifespan_pl: '10 lat dziko', diet_pl: 'Ziarno, owady, jagody.',
  },
  guinea_fowl: {
    facts_pl: ['Perliczki krzyczą jak alarm, gdy widzą obcego — lepsze niż pies.', 'Mają nagą, niebiesko-czerwoną głowę i szare pióra w białe kropki.'],
    size_pl: 'Długość 50–60 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Owady, nasiona, korzenie.',
  },
  yak: {
    facts_pl: ['Jaki żyją wysoko w Himalajach — odporne na temperatury –40°C.', 'Tybetańczycy używają wszystkiego: mleka, mięsa, sierści, nawet odchodów jako opału.'],
    size_pl: 'Wysokość 1,6–2,2 m. Waga 300–1000 kg.', lifespan_pl: '20–25 lat', diet_pl: 'Trawa wysokogórska, mchy, porosty.',
  },

  // Domowe — pozostałe
  guinea_pig: {
    facts_pl: ['Świnka morska potrafi z radości skakać w miejscu — to "popcorning"!', 'Pochodzi z Andów — ludzie hodują świnki morskie od ponad 5000 lat.'],
    size_pl: 'Długość 20–40 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Trawa, warzywa, owoce, siano.',
  },
  rat: {
    facts_pl: ['Szczury rozpoznają swoje imiona — i "śmieją się" cichutko, gdy się je łaskocze.', 'Bardzo społeczne — chorują z samotności.'],
    size_pl: 'Długość 22–30 cm + ogon.', lifespan_pl: '2–4 lata', diet_pl: 'Wszystkożerca — owoce, warzywa, mięso.',
  },
  ferret: {
    facts_pl: ['Fretka kradnie i chowa błyszczące przedmioty — "fretczy skarb".', 'Śpi 18 godzin dziennie — w spirali.'],
    size_pl: 'Długość 40–50 cm.', lifespan_pl: '6–10 lat', diet_pl: 'Mięso — ścisły mięsożerca.',
  },
  canary: {
    facts_pl: ['Kanarki potrafią uczyć się nowych melodii — i mają konkursy śpiewu.', 'Górnicy brali je do kopalń — kanarek padał pierwszy przy ulatniającym się gazie.'],
    size_pl: 'Długość 11–13 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Nasiona, jajko na twardo, warzywa.',
  },
  budgerigar: {
    facts_pl: ['Papużki faliste rozmawiają w stadzie cały dzień.', 'Papużka Puck znała ponad 1700 słów — to rekord świata!'],
    size_pl: 'Długość 17–20 cm.', lifespan_pl: '7–15 lat', diet_pl: 'Nasiona, warzywa, owoce.',
  },
  cockatoo: {
    facts_pl: ['Kakadu tańczą do rytmu muzyki — naprawdę czują takt!', 'Mają puszysty czubek piór — rozkładają go w emocjach.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '40–70 lat', diet_pl: 'Nasiona, orzechy, owoce, kwiaty.',
  },
  parakeet: {
    facts_pl: ['Nimfa to australijska papuga z żółtym czubem.', 'Gwiżdże melodie, których nauczy ją właściciel.'],
    size_pl: 'Długość 30–33 cm.', lifespan_pl: '15–25 lat', diet_pl: 'Nasiona, warzywa, owoce.',
  },
  gecko: {
    facts_pl: ['Gekon chodzi po szybach dzięki milionom maleńkich włosków na łapkach.', 'Zlizuje wodę z oczu, bo nie ma powiek.'],
    size_pl: 'Długość 5–30 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Owady, drobne pajęczaki.',
  },
  gerbil: {
    facts_pl: ['Myszoskoczek skacze 30 cm w pionie — jak kangurek w miniaturze.', 'Pochodzi z pustyń Mongolii — prawie nie pije wody.'],
    size_pl: 'Długość 11–18 cm + ogon.', lifespan_pl: '3–4 lata', diet_pl: 'Nasiona, ziarna, suszone warzywa.',
  },
  chinchilla: {
    facts_pl: ['Szynszyla ma niezwykle gęste futro — z jednego miejsca na skórze wyrasta nawet 50 włosków.', 'Kąpie się w pyle, nie w wodzie — woda zniszczyłaby jej futro.'],
    size_pl: 'Długość 22–38 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Siano, ziarna, trawa.',
  },
  koi: {
    tagline_pl: 'japoński karp ozdobny',
    facts_pl: ['Karpie koi mogą żyć kilkadziesiąt lat — dłużej niż większość psów i kotów.', 'W Japonii uznawany za symbol odwagi i wytrwałości.'],
    size_pl: 'Długość 30–90 cm.', lifespan_pl: '25–50 lat', diet_pl: 'Rośliny wodne, ziarna, owady.',
  },
  cricket_house: {
    facts_pl: ['Świerszcz domowy lubi ciepłe piwnice i kuchnie.', 'Śpiewa pocierając skrzydłami — częstotliwość rośnie z temperaturą.'],
    size_pl: 'Długość 1,5–2 cm.', lifespan_pl: '2–3 miesiące', diet_pl: 'Resztki, rośliny, czasem inne owady.',
  },

  // === BATCH 4 — Afryka / sawanna ===
  antelope: {
    facts_pl: ['Antylopy skaczą czasem 3 metry w górę.', 'Tworzą stada po setki sztuk dla bezpieczeństwa.'],
    size_pl: 'Wysokość 70–150 cm. Waga 30–200 kg.', lifespan_pl: '10–20 lat', diet_pl: 'Trawa, liście.',
  },
  gnu: {
    facts_pl: ['Każdego roku miliony gnu migrują przez Serengeti — Wielka Migracja.', 'Mama rodzi w biegu — małe wstaje po 6 minutach.'],
    size_pl: 'Wysokość 1,2–1,4 m. Waga 120–270 kg.', lifespan_pl: '20 lat', diet_pl: 'Trawa.',
  },
  gazelle: {
    facts_pl: ['Uciekająca gazela skacze wysoko na sztywnych nogach — pokazuje drapieżnikowi, że jest silna.', 'Pędzi 80 km/h, by uciec gepardowi.'],
    size_pl: 'Wysokość 60–110 cm.', lifespan_pl: '10–12 lat', diet_pl: 'Trawa, liście.',
  },
  warthog: {
    facts_pl: ['Guziec je trawę, klęcząc na przednich nogach.', 'Sypia w cudzych norach — zostawionych przez mrówniki.'],
    size_pl: 'Wysokość 60–85 cm. Waga 50–150 kg.', lifespan_pl: '10–17 lat', diet_pl: 'Trawa, korzenie, owoce, padlina.',
  },
  fennec: {
    tagline_pl: 'najmniejszy lis świata',
    facts_pl: ['Fenek ma ogromne uszy — chłodzi nimi ciało na pustyni.', 'Mieszka w norach głębokich na 1 m, gdzie jest chłodno.'],
    size_pl: 'Długość 24–41 cm.', lifespan_pl: '10–12 lat', diet_pl: 'Owady, jaszczurki, gryzonie, jaja.',
  },
  mongoose: {
    facts_pl: ['Mangusta potrafi pokonać kobrę — jest bardzo zwinna i częściowo odporna na jad.', 'Mangusty sprowadzone na Hawaje wytępiły tam wiele rodzimych ptaków.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Węże, gryzonie, owady, jaja.',
  },
  dik_dik: {
    facts_pl: ['Dik-dik ma tylko około 35 cm wysokości — to jedna z najmniejszych antylop Afryki.', 'Jego nos jest długi i rurkowaty — pomaga w chłodzeniu.'],
    size_pl: 'Wysokość 30–43 cm.', lifespan_pl: '10 lat dziko', diet_pl: 'Liście, pąki, owoce.',
  },
  impala: {
    facts_pl: ['Impale skaczą 3 metry w górę i 10 wzdłuż.', 'Lwy lubią je najbardziej — łatwa, średnia zdobycz.'],
    size_pl: 'Wysokość 75–95 cm. Waga 40–75 kg.', lifespan_pl: '12 lat', diet_pl: 'Trawa, liście.',
  },
  kudu: {
    facts_pl: ['Samce kudu mają długie, spiralne rogi — do 180 cm.', 'Skaczą 2 m w górę z zatrzymania.'],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 200–315 kg.', lifespan_pl: '15–20 lat', diet_pl: 'Liście, pędy, owoce.',
  },
  eland: {
    facts_pl: ['Eland to największa antylopa świata — waży nawet 940 kg.', 'Mimo wagi przeskakuje płot 2,5 m wysoki.'],
    size_pl: 'Wysokość 1,3–1,8 m. Waga 300–940 kg.', lifespan_pl: '15–20 lat', diet_pl: 'Liście, trawa, owoce.',
  },
  oryx: {
    facts_pl: ['Oryks przeżywa miesiące bez wody — używa rosy.', 'Ma proste, długie rogi — nawet do 1,2 m.'],
    size_pl: 'Wysokość 1,2 m.', lifespan_pl: '15–20 lat', diet_pl: 'Trawa, liście, sukulenty.',
  },
  springbok: {
    facts_pl: ['Springboki podskakują wysoko w miejscu ("pronking") — pokazują drapieżnikom, że są silne i szybkie.', 'Symbol RPA i jej reprezentacji rugby.'],
    size_pl: 'Wysokość 70–90 cm.', lifespan_pl: '7–10 lat', diet_pl: 'Trawa, liście.',
  },
  african_wild_dog: {
    facts_pl: ['Likaony polują stadem skuteczniej niż lwy — 80% sukcesu.', 'Każdy ma unikalny wzór plam.'],
    size_pl: 'Długość 1 m. Waga 18–36 kg.', lifespan_pl: '10–12 lat', diet_pl: 'Antylopy, gazele — duża zwierzyna.',
  },
  aardvark: {
    facts_pl: ['Mrównik kopie tunele i zjada termity językiem 30 cm długim.', 'Zjada 50 000 termitów w noc.'],
    size_pl: 'Długość 1–1,3 m. Waga 40–65 kg.', lifespan_pl: '18–23 lat', diet_pl: 'Termity i mrówki.',
  },
  rock_hyrax: {
    facts_pl: ['Góralek wygląda jak świnka morska, a jest dalekim kuzynem słonia!', 'Wygląda jak gryzoń, ale genetycznie blisko mu do trąbowców.'],
    size_pl: 'Długość 30–55 cm.', lifespan_pl: '10–12 lat', diet_pl: 'Trawa, liście, owoce.',
  },
  serval: {
    facts_pl: ['Serwal skacze 3 metry w pionie, łapie ptaki w locie.', 'Ma najdłuższe nogi w proporcji do ciała wśród kotów.'],
    size_pl: 'Długość 60–100 cm. Waga 9–18 kg.', lifespan_pl: '10–19 lat', diet_pl: 'Gryzonie, ptaki, jaszczurki.',
  },
  aardwolf: {
    facts_pl: ['Protel to krewny hien, ale zamiast mięsa je termity.', 'Wygląda jak mała hiena, ale nie poluje na duże zwierzęta.'],
    size_pl: 'Długość 55–80 cm.', lifespan_pl: '8–10 lat', diet_pl: 'Termity — 200 000 w jedną noc.',
  },
  aardwolf_kenya: {
    facts_pl: ['Hiena pręgowana stroszy długą grzywę na grzbiecie, żeby wyglądać na większą.', 'Żyje w Afryce i Azji — jest spokojniejsza i bardziej samotna niż hiena cętkowana.'],
    size_pl: 'Długość 85–130 cm. Waga 25–55 kg.', lifespan_pl: '12 lat dziko', diet_pl: 'Padlina, kości, owady, owoce.',
    map_regions: ['africa-sub', 'africa-north', 'asia-cent'],
  },
  caracal: {
    facts_pl: ['Karakal skacze 3 metry w pionie i łapie ptaki w locie.', 'Czarne pędzelki na uszach — stąd nazwa (z tureckiego "karakulak" = czarne ucho).'],
    size_pl: 'Długość 60–90 cm. Waga 8–18 kg.', lifespan_pl: '12 lat', diet_pl: 'Ptaki, gryzonie, drobne antylopy.',
  },
  addax: {
    facts_pl: ['Adaks ma szerokie kopyta — dzięki nim nie zapada się w piasek pustyni.', 'Niemal wyginął — żyje go tylko ok. 100 dziko na Saharze.'],
    size_pl: 'Wysokość 95–115 cm.', lifespan_pl: '19–25 lat', diet_pl: 'Trawa pustynna, sukulenty.',
  },
  marabou: {
    facts_pl: ['Marabut to ogromny afrykański bocian — rozpiętość jego skrzydeł to aż 3 m.', 'Łysa głowa — żeby się nie brudzić, gdy je padlinę.'],
    size_pl: 'Wysokość 150 cm. Rozpiętość 3 m.', lifespan_pl: '25 lat', diet_pl: 'Padlina, śmieci, drobne zwierzęta.',
  },
  ibis: {
    facts_pl: ['Ibis był świętym ptakiem starożytnego Egiptu — wcielenie boga Thota.', 'Ma długi, zakrzywiony dziób do grzebania w mule.'],
    size_pl: 'Długość 65–75 cm.', lifespan_pl: '20–26 lat', diet_pl: 'Skorupiaki, owady wodne, drobne ryby.',
  },
  pelican: {
    facts_pl: ['W woreczku pelikana mieszczą się litry wody z rybami.', 'Polują grupowo — "zagonem" zaganiają ryby na płycizny.'],
    size_pl: 'Długość 1,2–1,8 m. Rozpiętość 3 m.', lifespan_pl: '15–25 lat', diet_pl: 'Ryby — łapane do worka pod dziobem.',
  },
  shoebill: {
    facts_pl: ['Trzewikodziób ma dziób jak gigantyczny but i stoi w bagnach godzinami.', 'Wydaje dźwięk "klap-klap-klap" dziobem — komunikacja.'],
    size_pl: 'Wysokość 110–140 cm.', lifespan_pl: '35–50 lat', diet_pl: 'Ryby, węgorze, młode krokodyle.',
  },
  secretary_bird: {
    facts_pl: ['Sekretarz to ptak drapieżny, który zabija węże kopniakami.', 'Czarne pióra za głową wyglądają jak pióra wkładane za ucho — stąd nazwa.'],
    size_pl: 'Wysokość 1,2–1,5 m.', lifespan_pl: '10–15 lat', diet_pl: 'Węże, gryzonie, jaszczurki.',
  },
  okapi: {
    tagline_pl: 'leśny kuzyn żyrafy',
    facts_pl: ['Okapi to leśny kuzyn żyrafy z pasami zebry na nogach.', 'Odkryte dopiero w 1901 — żyje tylko w Kongo.'],
    size_pl: 'Wysokość 1,5–2 m.', lifespan_pl: '20–30 lat', diet_pl: 'Liście, pąki, trawa.',
  },
  pangolin: {
    facts_pl: ['Łuskowiec ma łuski i zwija się w kulę jak szyszka.', 'Najbardziej kłusowane zwierzę świata — przez rzekomo lecznicze łuski.'],
    size_pl: 'Długość 30–100 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Mrówki i termity.',
  },
  ratel: {
    facts_pl: ['Miodożer jest tak nieustraszony, że atakuje nawet lwy.', 'Ma grubą i luźną skórę — trudno go ugryźć i przytrzymać.'],
    size_pl: 'Długość 55–77 cm.', lifespan_pl: '24 lata', diet_pl: 'Wszystko — owady, gady, miód, padlina.',
  },
  honey_badger: {
    facts_pl: ['Zorilla to afrykański kuzyn tchórza — w obronie wydziela bardzo brzydki zapach.', 'Ma czarno-białe paski jak skunks, choć skunksem nie jest.'],
    size_pl: 'Długość 30–40 cm + ogon. Waga 0,5–1,5 kg.', lifespan_pl: '5–8 lat', diet_pl: 'Gryzonie, owady, jaja, jaszczurki.',
    map_regions: ['africa-sub'],
  },
  sitatunga: {
    facts_pl: ['Sitatunga ma długie, rozstawione kopyta — dzięki nim nie grzęźnie w bagnie.', 'Świetnie pływa — chowa się pod wodą tylko z nosem na powierzchni.'],
    size_pl: 'Wysokość 75–125 cm.', lifespan_pl: '19 lat', diet_pl: 'Rośliny wodne, trawa, młode pędy.',
  },
  bongo: {
    facts_pl: ['Bongo to największa antylopa leśna Afryki.', 'Ma rude futro w białe paski i spiralne rogi.'],
    size_pl: 'Wysokość 1,1–1,3 m.', lifespan_pl: '19 lat', diet_pl: 'Liście, kora, owoce, korzenie.',
  },
  aye_aye: {
    facts_pl: ['Aj-aj ma długi palec, którym wyciąga larwy z drzew.', 'Nocny i bardzo rzadki — Madagaskar.'],
    size_pl: 'Długość 36–43 cm.', lifespan_pl: '20 lat', diet_pl: 'Larwy owadów, owoce, kwiaty.',
  },
  genet: {
    facts_pl: ['Żeneta wygląda jak kot w cętki z bardzo długim, pręgowanym ogonem.', 'Nie jest kotem — należy do wiwerowatych, krewnych mangust.'],
    size_pl: 'Długość 40–55 cm + ogon.', lifespan_pl: '13 lat', diet_pl: 'Gryzonie, ptaki, owady.',
  },
  zebra_grevyi: {
    facts_pl: ['Zebra Grevy\'ego ma najwęższe paski ze wszystkich zebr.', 'Największa zebra świata — i najrzadsza.'],
    size_pl: 'Wysokość 1,4–1,6 m.', lifespan_pl: '18 lat', diet_pl: 'Trawa.',
  },
  mamba: {
    tagline_pl: 'najszybszy wąż świata',
    facts_pl: ['Mamba czarna jest najszybszym wężem świata — 19 km/h.', 'Ma bardzo silny jad — na szczęście istnieje na niego surowica.'],
    size_pl: 'Długość 2–4,5 m.', lifespan_pl: '11 lat', diet_pl: 'Drobne ssaki, ptaki.',
  },
  cobra: {
    facts_pl: ['Kobra rozkłada kaptur, gdy się denerwuje.', 'Niektóre plują jadem na 3 metry — celują w oczy.'],
    size_pl: 'Długość 1,2–2,2 m.', lifespan_pl: '20 lat', diet_pl: 'Gryzonie, ptaki, jaszczurki.',
  },
  python: {
    facts_pl: ['Pyton owija się wokół zdobyczy i ją dusi — bez jadu.', 'Może połknąć krokodyla — i potem nic nie jeść przez rok.'],
    size_pl: 'Długość 3–7 m.', lifespan_pl: '25–40 lat', diet_pl: 'Antylopy, drobne ssaki, ptaki.',
  },
  monitor_lizard: {
    facts_pl: ['Waran ma długi rozdwojony język jak wąż.', 'Niektóre gatunki są jadowite — odkrycie z 2009.'],
    size_pl: 'Długość 0,5–3 m.', lifespan_pl: '8–30 lat', diet_pl: 'Drapieżnik — gryzonie, jaja, ptaki, padlina.',
  },
  chameleon: {
    facts_pl: ['Kameleon strzela językiem dwa razy dłuższym od ciała.', 'Każde oko porusza się niezależnie — widzi w dwóch kierunkach naraz.'],
    size_pl: 'Długość 5–70 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Owady — łapane lepkim językiem.',
  },
  saltwater_croc: {
    tagline_pl: 'największy gad świata',
    facts_pl: ['Krokodyl różańcowy to największy gad świata — do 7 m i 1500 kg.', 'Pływa w morzu między wyspami.'],
    size_pl: 'Długość 5–7 m. Waga 500–1500 kg.', lifespan_pl: '70 lat', diet_pl: 'Wszystko — ryby, ptaki, krowy, ludzi.',
  },
  gharial: {
    facts_pl: ['Gawial ma najwęższy, najdłuższy pysk wśród krokodyli — same zęby do łapania ryb.', 'Jest krytycznie zagrożony — na wolności żyje ich tylko kilkaset.'],
    size_pl: 'Długość 4–6 m.', lifespan_pl: '50–60 lat', diet_pl: 'Wyłącznie ryby.',
  },
  alligator: {
    facts_pl: ['Aligator łapie wszystko, co poruszy się w wodzie.', 'Może żyć w mroźnej wodzie — wystawia tylko nozdrza nad lód.'],
    size_pl: 'Długość 3–4,5 m.', lifespan_pl: '30–50 lat', diet_pl: 'Ryby, ptaki, ssaki, padlina.',
  },
  peacock: {
    facts_pl: ['Paw rozkłada ogon w wachlarz, żeby zaimponować — pawica wybiera najpiękniejszych.', 'Pochodzi z Indii i Sri Lanki.'],
    size_pl: 'Długość 100–230 cm (z ogonem).', lifespan_pl: '20 lat', diet_pl: 'Nasiona, owady, jagody, drobne gady.',
  },

  // === BATCH 4 — Dżungla / Azja ===
  siberian_tiger: {
    tagline_pl: 'największy kot świata',
    facts_pl: ['Tygrys syberyjski to największy kot świata — waży 300 kg.', 'Żyje na mroźnej Syberii — ma najdłuższe futro spośród tygrysów.'],
    size_pl: 'Długość 3–3,8 m. Waga 200–320 kg.', lifespan_pl: '10–15 lat', diet_pl: 'Łosie, dziki, jelenie.',
  },
  red_panda: {
    tagline_pl: 'ognista lalka Himalajów',
    facts_pl: ['Panda mała wygląda jak skrzyżowanie kota i lisa.', 'Nazwa "panda" pierwotnie odnosiła się do niej — wielkiej pandy nikt jeszcze nie znał.'],
    size_pl: 'Długość 50–65 cm + ogon.', lifespan_pl: '8–14 lat', diet_pl: 'Bambus, owoce, jaja, drobne gryzonie.',
  },
  gibbon: {
    facts_pl: ['Gibony śpiewają poranne duety z partnerem — para łączy się na całe życie.', 'Skaczą między drzewami z prędkością 55 km/h.'],
    size_pl: 'Długość 45–65 cm.', lifespan_pl: '30–40 lat', diet_pl: 'Owoce, liście, owady.',
  },
  macaque: {
    facts_pl: ['Makaki japońskie z wyspy Kōshima nauczyły się myć słodkie ziemniaki w morzu — i przekazały to młodym.', 'Najszerszy zasięg po człowieku wśród naczelnych.'],
    size_pl: 'Długość 40–60 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Owoce, liście, owady, czasem ryby.',
  },
  japanese_macaque: {
    facts_pl: ['Makaki japońskie kąpią się w gorących źródłach zimą!', 'Ich rude twarze tworzą w śniegu zaskakujący kontrast.'],
    size_pl: 'Długość 50–60 cm.', lifespan_pl: '25–30 lat', diet_pl: 'Owoce, liście, kora, owady.',
  },
  snow_monkey: {
    facts_pl: ['Makaki japońskie kąpią się w gorących źródłach zimą.', 'To najbardziej "na północ" żyjące małpy świata.'],
    size_pl: 'Długość 50–60 cm.', lifespan_pl: '25–30 lat', diet_pl: 'Owoce, kora, kwiaty, owady.',
  },
  langur: {
    facts_pl: ['Langury skaczą między drzewami przez 10 metrów.', 'W Indiach uważane za święte — wcielenie boga Hanumana.'],
    size_pl: 'Długość 50–80 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Liście, owoce, kwiaty.',
  },
  binturong: {
    facts_pl: ['Binturong pachnie jak prażony popcorn!', 'Jeden z niewielu drapieżników z chwytnym ogonem.'],
    size_pl: 'Długość 60–96 cm + ogon.', lifespan_pl: '20–25 lat', diet_pl: 'Owoce, liście, ptaki, owady.',
  },
  binturong_indo: {
    facts_pl: ['Łaskun zjada owoce kawy — z nasion, które przeszły przez jego brzuch, robi się bardzo drogą kawę.', 'Jest aktywny nocą i świetnie wspina się po drzewach.'],
    size_pl: 'Długość 45–60 cm + ogon. Waga 2–5 kg.', lifespan_pl: '15–20 lat', diet_pl: 'Owoce, owady, drobne zwierzęta.',
    map_regions: ['asia-se'],
  },
  asian_elephant: {
    facts_pl: ['Słoń indyjski jest mniejszy niż afrykański, a jego trąba kończy się jednym "palcem".', 'W Indiach od tysięcy lat pomaga ludziom — w pracy, wojsku i ceremoniach.'],
    size_pl: 'Wysokość 2–3 m. Waga 3–5 ton.', lifespan_pl: '60–70 lat', diet_pl: 'Trawa, liście, kora — 150 kg dziennie.',
  },
  sun_bear: {
    tagline_pl: 'najmniejszy niedźwiedź',
    facts_pl: ['Niedźwiedź malajski ma najdłuższy język wśród niedźwiedzi — 25 cm.', 'Ma żółtą "podkowę" na piersi — stąd nazwa "sun bear".'],
    size_pl: 'Długość 100–140 cm. Waga 27–80 kg.', lifespan_pl: '24–28 lat', diet_pl: 'Miód, termity, owoce, gryzonie.',
  },
  moon_bear: {
    facts_pl: ['Niedźwiedź himalajski ma biały półksiężyc na piersi.', 'Jeden z najczęściej trzymanych w klatkach — dla "żółci niedźwiedziej".'],
    size_pl: 'Długość 1,2–1,9 m.', lifespan_pl: '25 lat', diet_pl: 'Owoce, orzechy, owady, miód, gryzonie.',
  },
  sloth_bear: {
    facts_pl: ['Wargacz wciąga termity jak odkurzaczem — przez szparę między zębami.', 'Bywa bardzo nerwowy — gdy się wystraszy, potrafi zaatakować.'],
    size_pl: 'Długość 1,4–1,9 m.', lifespan_pl: '20 lat', diet_pl: 'Termity, mrówki, owoce, miód.',
  },
  proboscis_monkey: {
    facts_pl: ['Nosacz ma ogromny nos, którym wzmacnia swój głos.', 'Im większy nos samca, tym większe powodzenie u samic.'],
    size_pl: 'Długość 53–76 cm.', lifespan_pl: '20 lat', diet_pl: 'Liście, niedojrzałe owoce.',
  },
  clouded_leopard: {
    facts_pl: ['Pantera mglista ma najdłuższe kły w stosunku do wielkości ciała spośród żyjących kotów.', 'Potrafi schodzić z drzewa głową w dół i wisieć na gałęzi na tylnych łapach.'],
    size_pl: 'Długość 60–110 cm.', lifespan_pl: '11–17 lat', diet_pl: 'Małpy, gryzonie, ptaki.',
  },
  serow: {
    facts_pl: ['Serau wygląda jak skrzyżowanie kozy i antylopy.', 'Mieszka w skalistych górach Azji.'],
    size_pl: 'Wysokość 85–95 cm.', lifespan_pl: '15 lat', diet_pl: 'Trawa, liście, młode pędy.',
  },
  takin: {
    facts_pl: ['Takin ma złotawe futro i mieszka w wysokich Himalajach.', 'Mityczne "złote runo" mogło być takinowe — według niektórych historyków.'],
    size_pl: 'Wysokość 1–1,4 m.', lifespan_pl: '12–15 lat', diet_pl: 'Trawa, liście, kora.',
  },
  dhole: {
    facts_pl: ['Dhole to azjatycki dziki pies, który "gwiżdże" zamiast wyć.', 'W stadzie potrafi pokonać tygrysa.'],
    size_pl: 'Długość 88–113 cm.', lifespan_pl: '10–13 lat', diet_pl: 'Jelenie, dziki, gryzonie.',
  },
  musk_deer: {
    facts_pl: ['Samce piżmowca mają długie kły wystające z pyska — używają ich w walce.', 'Nie ma poroża — to jego cecha rozpoznawcza.'],
    size_pl: 'Długość 80–100 cm.', lifespan_pl: '10–14 lat', diet_pl: 'Trawa, mchy, porosty.',
  },
  saola: {
    tagline_pl: 'azjatycki jednorożec',
    facts_pl: ['Saola odkryta dopiero w 1992 — to "azjatycki jednorożec".', 'Jest tak rzadka i skryta, że naukowcy widzieli ją na wolności tylko kilka razy.'],
    size_pl: 'Wysokość 80–90 cm.', lifespan_pl: '8–11 lat', diet_pl: 'Liście, młode pędy.',
  },
  snub_nosed_monkey: {
    facts_pl: ['Sichuanka ma jasnoniebieską twarz — mieszka w mroźnych górach Chin.', 'Żyje wyżej w górach niż prawie wszystkie inne małpy — nawet ponad 4000 m.'],
    size_pl: 'Długość 56–76 cm.', lifespan_pl: '20 lat', diet_pl: 'Porosty, liście, kora.',
  },
  snow_leopard: {
    tagline_pl: 'duch Himalajów',
    facts_pl: ['Pantera śnieżna żyje wysoko w Himalajach — do 5500 m.', 'Ma 1-metrowy ogon, którym owija się jak szalikiem.'],
    size_pl: 'Długość 75–150 cm.', lifespan_pl: '15–18 lat', diet_pl: 'Dzikie kozy i owce górskie, świstaki, zające.',
  },
  anteater: {
    facts_pl: ['Mrówkojad zjada 35 000 mrówek dziennie.', 'Język ma 60 cm długi — i pokryty lepką śliną.'],
    size_pl: 'Długość 1,8–2,1 m.', lifespan_pl: '14–25 lat', diet_pl: 'Mrówki i termity.',
  },
  capybara: {
    tagline_pl: 'największy gryzoń świata',
    facts_pl: ['Kapibara to największy gryzoń świata — waży 65 kg.', 'Jest tak spokojna, że pozwala innym zwierzętom siadać na sobie — nawet ptakom i małpom.'],
    size_pl: 'Długość 1,1–1,3 m. Waga 35–65 kg.', lifespan_pl: '8–12 lat', diet_pl: 'Trawa, rośliny wodne, owoce.',
  },
  ocelot: {
    facts_pl: ['Ocelot poluje w nocy używając wzroku jak kot domowy.', 'Pasy i plamki sprawiają, że wygląda jak miniaturowy jaguar.'],
    size_pl: 'Długość 70–90 cm. Waga 8–16 kg.', lifespan_pl: '8–12 lat', diet_pl: 'Gryzonie, ptaki, jaszczurki, ryby.',
  },
  tapir: {
    facts_pl: ['Tapir ma długi, ruchomy nos jak miniaturową trąbę.', 'Jest dalekim krewnym konia i nosorożca.'],
    size_pl: 'Długość 1,8–2,5 m. Waga 150–320 kg.', lifespan_pl: '25–30 lat', diet_pl: 'Liście, owoce, gałązki.',
  },
  toucan_keel: {
    facts_pl: ['Tukan tęczowy reguluje temperaturę ciała ogromnym dziobem.', 'Lata krótkimi, ciężkimi seriami — dziób mu przeszkadza.'],
    size_pl: 'Długość 42–55 cm.', lifespan_pl: '20 lat', diet_pl: 'Owoce, jaja, owady, jaszczurki.',
  },
  green_anaconda: {
    facts_pl: ['Boa szmaragdowy odpoczywa na gałęzi zwinięty w pętle — zielony jak liście.', 'Młode rodzą się pomarańczowe lub czerwone i zielenieją dopiero z wiekiem.'],
    size_pl: 'Długość 1,5–2 m.', lifespan_pl: '15–20 lat', diet_pl: 'Gryzonie, ptaki, jaszczurki.',
    map_regions: ['america-s'],
  },
  piranha: {
    facts_pl: ['Piranie żyją w słodkich wodach Amazonki.', 'Mają ostre zęby, ale ataki na ludzi zdarzają się bardzo rzadko — to raczej płochliwe ryby.'],
    size_pl: 'Długość 15–30 cm.', lifespan_pl: '10–20 lat', diet_pl: 'Ryby, padlina, owoce.',
  },
  eel_electric: {
    facts_pl: ['Węgorz elektryczny rozpętuje "piorun" o sile 600V — ogłusza konia.', 'Mimo nazwy, to nie węgorz, tylko gatunek ryby z Amazonki.'],
    size_pl: 'Długość 1,5–2,5 m.', lifespan_pl: '15 lat', diet_pl: 'Ryby, drobne ssaki.',
  },
  basilisk: {
    tagline_pl: 'jaszczurka po wodzie',
    facts_pl: ['Bazyliszek biega po wodzie — naprawdę! Z prędkością 11 km/h.', 'Stąd nazwa "jaszczurka Jezusowa".'],
    size_pl: 'Długość 60–90 cm.', lifespan_pl: '7–10 lat', diet_pl: 'Owady, drobne gady, owoce.',
  },
  boa: {
    facts_pl: ['Boa dusiciel poluje nocą — zapach zdobyczy wyczuwa językiem.', 'Może bez jedzenia żyć całe miesiące po dużym posiłku.'],
    size_pl: 'Długość 2–4 m.', lifespan_pl: '20–30 lat', diet_pl: 'Drobne ssaki, ptaki, jaszczurki.',
  },
  poison_frog: {
    facts_pl: ['Drzewołazy mają najjaskrawsze kolory ostrzegawcze.', 'Jeden gatunek (drzewołaz złoty) jest tak jadowity, że zabija 10 ludzi naraz.'],
    size_pl: 'Długość 1,5–6 cm.', lifespan_pl: '4–8 lat', diet_pl: 'Mrówki, termity, drobne owady (skąd ich jad).',
  },
  tree_frog: {
    facts_pl: ['Rzekotka czerwonooka przykleja się palcami do liści — ma na nich lepkie poduszeczki.', 'Jaja składa na liściach nad wodą — kijanki wpadają do niej, gdy się wyklują.'],
    size_pl: 'Długość 4–7 cm.', lifespan_pl: '5 lat', diet_pl: 'Owady, pajęczaki.',
    map_regions: ['america-s'],
  },
  glass_frog: {
    facts_pl: ['Żaba szklana ma przezroczysty brzuch — widać jej serce.', 'Na zielonym liściu jest prawie niewidoczna.'],
    size_pl: 'Długość 2–8 cm.', lifespan_pl: '10–14 lat', diet_pl: 'Owady — głównie pajączki.',
  },
  mantella: {
    facts_pl: ['Jaskrawy kolor manteli złotej ostrzega drapieżniki, że jest trująca.', 'Mieszka tylko na Madagaskarze.'],
    size_pl: 'Długość 2–3 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Mrówki, termity (źródło jadu).',
  },
  iguana: {
    facts_pl: ['Legwany mają "trzecie oko" na szczycie głowy — wyczuwa cienie z góry.', 'Świetnie pływają i potrafią skoczyć z drzewa prosto do wody.'],
    size_pl: 'Długość 1,2–1,7 m.', lifespan_pl: '15–20 lat', diet_pl: 'Roślinożerca — liście, kwiaty, owoce.',
  },
  caecilian: {
    facts_pl: ['Robaczyce to płazy bez nóg — wyglądają jak węże.', 'Młode niektórych robaczyc zjadają zewnętrzną warstwę skóry mamy — to ich pierwszy pokarm.'],
    size_pl: 'Długość 10–150 cm.', lifespan_pl: '5–13 lat', diet_pl: 'Dżdżownice, larwy, drobne kręgowce.',
  },
  matamata: {
    facts_pl: ['Matamata wygląda jak kupka opadłych liści w wodzie — ryby podpływają bardzo blisko.', 'Błyskawicznie otwiera pysk i wsysa rybę razem z wodą.'],
    size_pl: 'Długość 40–45 cm.', lifespan_pl: '15 lat', diet_pl: 'Ryby — łapane przez wsysanie.',
  },
  hercules_beetle: {
    facts_pl: ['Chrząszcz Herkules to jeden z największych owadów świata — 17 cm.', 'Samiec ma długi "róg" — używa go w walce o samicę.'],
    size_pl: 'Długość 10–17 cm.', lifespan_pl: '6 miesięcy', diet_pl: 'Gnijące drewno, owoce.',
  },
  blue_morpho: {
    facts_pl: ['Morfej niebieski lśni metalicznym błękitem dzięki strukturze skrzydeł.', 'Nie ma pigmentu — to optyka, jak pawi ogon.'],
    size_pl: 'Rozpiętość 12–20 cm.', lifespan_pl: '2–4 tygodnie', diet_pl: 'Sok z gnijących owoców.',
  },
  atlas_butterfly: {
    facts_pl: ['Ornitoptera królowej Aleksandry to największy motyl dzienny świata — jego skrzydła mają ponad 25 cm.', 'Żyje tylko w lasach deszczowych Papui-Nowej Gwinei i jest pod ścisłą ochroną.'],
    size_pl: 'Rozpiętość 25–28 cm.', lifespan_pl: '3 miesiące (dorosły)', diet_pl: 'Nektar kwiatów.',
    map_regions: ['australia'],
  },
  atlas_moth: {
    facts_pl: ['Pawica atlas to jedna z największych ciem świata — skrzydła ma większe niż dłoń dorosłego.', 'Ma "okna" na skrzydłach — fragmenty bez łusek.'],
    size_pl: 'Rozpiętość 24 cm.', lifespan_pl: '1–2 tygodnie', diet_pl: 'Nic — gąsienica gromadzi zapasy.',
  },
  silk_moth: {
    facts_pl: ['Jedwabnik produkuje 1 km nici na kokon!', 'Hodowany przez ludzi od 5000 lat — udomowiony tak bardzo, że nie potrafi już latać.'],
    size_pl: 'Rozpiętość 4–6 cm.', lifespan_pl: '2 tygodnie (dorosły)', diet_pl: 'Wyłącznie liście morwy (gąsienica).',
  },
  walking_stick: {
    facts_pl: ['Patyczak gigantyczny może być długi na 60 cm.', 'Udaje gałąź tak dobrze, że ptaki przelatują obok i nie widzą.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '1–2 lata', diet_pl: 'Liście drzew.',
  },
  treehopper: {
    facts_pl: ['Garbik ma na grzbiecie dziwny "hełm" — wygląda jak kolec, liść albo mrówka.', 'Wydziela słodką "rosę miodną" — mrówki ją zjadają i bronią garbika.'],
    size_pl: 'Długość 2–10 mm.', lifespan_pl: 'Kilka miesięcy', diet_pl: 'Sok z roślin.',
  },
  cicada: {
    facts_pl: ['Niektóre cykady pojawiają się tylko co 17 lat — synchronicznie miliardami.', 'Samce "śpiewają" tak głośno, że słychać na 1 km.'],
    size_pl: 'Długość 2–5 cm.', lifespan_pl: '2–17 lat (jako nimfa pod ziemią)', diet_pl: 'Sok z roślin.',
  },
  praying_mantis_giant: {
    facts_pl: ['Modliszka olbrzymia może łapać małe ptaki.', 'Samica zjada samca po godach — w 25% przypadków.'],
    size_pl: 'Długość 12–17 cm.', lifespan_pl: '6 miesięcy', diet_pl: 'Inne owady, czasem żaby i kolibry.',
  },
  goliath_beetle: {
    facts_pl: ['Chrząszcz goliat to jeden z najcięższych owadów świata — waży tyle co mała mysz.', 'Larwa jest zbierana i smażona — przysmak w Afryce.'],
    size_pl: 'Długość 6–11 cm.', lifespan_pl: '12 miesięcy', diet_pl: 'Sok drzew, owoce, padlina (larwa).',
  },
  jewel_beetle: {
    facts_pl: ['Bogatek lśni jak klejnot — używany w biżuterii w Indiach.', 'Larwy niektórych bogatków żyją w drewnie wiele lat, drążąc w nim korytarze.'],
    size_pl: 'Długość 0,3–8 cm.', lifespan_pl: '5–40 lat (z larwą)', diet_pl: 'Drewno, liście.',
  },
  whip_scorpion: {
    facts_pl: ['Bicznik strzela octem z odwłoka, żeby się bronić.', 'Nie ma jadu — używa "kwaśnego sprayu".'],
    size_pl: 'Długość 2–8 cm.', lifespan_pl: '4–7 lat', diet_pl: 'Owady, drobne pajęczaki.',
  },
  jaguarundi: {
    facts_pl: ['Jaguarundi wygląda raczej jak wydra niż kot.', 'Aktywny w dzień — w odróżnieniu od większości kotów.'],
    size_pl: 'Długość 55–77 cm.', lifespan_pl: '15 lat', diet_pl: 'Gryzonie, ptaki, gady.',
  },
  coati: {
    facts_pl: ['Ostronos ma długi nos i ogon w pierścienie.', 'Bardzo społeczny — żyje w grupach do 30 osobników.'],
    size_pl: 'Długość 40–60 cm + ogon.', lifespan_pl: '7–14 lat', diet_pl: 'Wszystkożerca — owoce, owady, gryzonie.',
  },
  paca: {
    facts_pl: ['Paka to gryzoń wielkości psa, mistrz unikania jaguarów.', 'Mięso paki to ulubiona zwierzyna łowna Amazonii.'],
    size_pl: 'Długość 60–80 cm.', lifespan_pl: '13 lat', diet_pl: 'Owoce, liście, korzenie.',
  },
  tamarin: {
    facts_pl: ['Tamaryna złotogłowa ma grzywę jak mały lew.', 'Ojciec opiekuje się dziećmi — mama tylko je karmi.'],
    size_pl: 'Długość 20–30 cm + ogon.', lifespan_pl: '15 lat', diet_pl: 'Owoce, kwiaty, owady, jaszczurki.',
  },
  marmoset: {
    facts_pl: ['Marmozety to jedne z najmniejszych małp świata.', 'Rodzą bliźnięta — ojciec nosi je większość czasu.'],
    size_pl: 'Długość 12–22 cm + ogon.', lifespan_pl: '12–16 lat', diet_pl: 'Owoce, soki drzew, owady.',
  },
  giant_otter: {
    facts_pl: ['Wydra olbrzymia może mieć 1,7 m długości — największa wydra świata.', 'Klan łowi wspólnie — pokonują nawet kajmana.'],
    size_pl: 'Długość 1,5–1,8 m.', lifespan_pl: '8–13 lat', diet_pl: 'Ryby, kajmany, anakondy.',
  },
  hoatzin: {
    facts_pl: ['Hoacyn trawi liście w wolu jak krowa — dlatego pachnie jak obornik.', 'Pisklęta mają pazury na skrzydłach — jak mini-archeopteryksy.'],
    size_pl: 'Długość 65 cm.', lifespan_pl: '15 lat', diet_pl: 'Liście — fermentowane jak u krowy.',
  },
  bird_eater: {
    facts_pl: ['Ptasznik to największy pająk świata — łapy 30 cm.', 'Mimo nazwy — głównie zjada owady, czasem małe gryzonie.'],
    size_pl: 'Długość ciała 12 cm, łapy do 30 cm.', lifespan_pl: '15–25 lat (samica)', diet_pl: 'Owady, drobne gryzonie, jaszczurki.',
  },
  bird_of_paradise: {
    tagline_pl: 'taneczna gwiazda dżungli',
    facts_pl: ['Rajskie ptaki mają najbardziej szalone pióra świata — i wykonują z nimi taneczne pokazy.', 'Niektóre potrafią "zmieniać kształt" w tańcu — przez układ piór.'],
    size_pl: 'Długość 15–110 cm.', lifespan_pl: '8 lat', diet_pl: 'Owoce, owady.',
  },
  quetzal: {
    facts_pl: ['Kwezal ma ogon dłuższy od ciała — pióro lśni jak szmaragd.', 'Święty ptak Majów i Azteków — symbol bóstwa Quetzalcoatla.'],
    size_pl: 'Długość 35 cm + ogon do 65 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Owoce, owady, jaszczurki.',
  },
  hornbill: {
    facts_pl: ['Dzioborożec ma rogowaty hełm nad dziobem — działa jak rezonator.', 'Samiec zamurowuje samicę w dziupli — karmi ją przez szczelinę.'],
    size_pl: 'Długość 50–160 cm.', lifespan_pl: '30–40 lat', diet_pl: 'Owoce, owady, gady.',
  },
  macaw: {
    facts_pl: ['Ary mają najmocniejszy dziób — łupią orzechy brazylijskie jak orzechy włoskie.', 'Pary łączą się na całe życie.'],
    size_pl: 'Długość 30–100 cm.', lifespan_pl: '50–80 lat', diet_pl: 'Orzechy, owoce, nasiona.',
  },
  king_cobra: {
    tagline_pl: 'najdłuższy jadowity wąż',
    facts_pl: ['Kobra królewska to najdłuższy jadowity wąż — ma 5 metrów.', 'Buduje gniazdo dla jaj — jako jedyny wąż.'],
    size_pl: 'Długość 3–5,5 m.', lifespan_pl: '20 lat', diet_pl: 'Inne węże — głównie kobry i pytony.',
  },
  reticulated_python: {
    tagline_pl: 'najdłuższy wąż świata',
    facts_pl: ['Pyton siatkowy to najdłuższy wąż świata — może mieć ponad 6 metrów.', 'Jest bardzo silny — potrafi upolować nawet dzika.'],
    size_pl: 'Długość 6–9 m.', lifespan_pl: '15–30 lat', diet_pl: 'Dziki, jelenie, małpy, ptaki.',
  },
  komodo: {
    tagline_pl: 'największa jaszczurka świata',
    facts_pl: ['Waran z Komodo to największa jaszczurka świata.', 'Ma jad, przez który ranna ofiara szybko słabnie.'],
    size_pl: 'Długość 2–3 m. Waga 70–90 kg.', lifespan_pl: '30 lat', diet_pl: 'Bawoły, jelenie, ptaki, padlina.',
  },
  komodo_juvenile: {
    facts_pl: ['Waran paskowany świetnie pływa — to druga co do wielkości jaszczurka świata.', 'Potrafi długo zostać pod wodą i często mieszka blisko ludzi.'],
    size_pl: 'Długość 1,5–2,5 m. Waga do 25 kg.', lifespan_pl: '10–15 lat', diet_pl: 'Ryby, żaby, ptaki, jaja, padlina.',
    map_regions: ['asia-se'],
  },
  rattlesnake: {
    facts_pl: ['Grzechotnik strzela ostrzeżenie ogonem przed atakiem.', 'Jego "grzechotka" to złuszczone resztki skóry.'],
    size_pl: 'Długość 60–250 cm.', lifespan_pl: '10–25 lat', diet_pl: 'Gryzonie, jaszczurki, ptaki.',
  },
  thorny_devil: {
    facts_pl: ['Moloch pije rosę całym ciałem — woda spływa po skórze do pyska.', 'Jego kolce sterczą we wszystkie strony — drapieżnicy go nie ruszają.'],
    size_pl: 'Długość 20 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Mrówki — 2500 dziennie.',
  },
  frilled_lizard: {
    facts_pl: ['Agama rozkłada kołnierz jak parasol, gdy jest przerażona.', 'Biega na 2 tylnych nogach — ucieka jak mały dinozaur.'],
    size_pl: 'Długość 60–90 cm.', lifespan_pl: '10 lat', diet_pl: 'Owady, drobne gryzonie, jaszczurki.',
  },
  alligator_snapping: {
    facts_pl: ['Żółw sępi ma w pysku "wabik" — wygląda jak robak.', 'Otwiera paszczę, wystawia "robaka" — i czeka na rybę.'],
    size_pl: 'Długość 60–80 cm. Waga do 100 kg.', lifespan_pl: '50–80 lat', diet_pl: 'Ryby, węże, drobne ssaki.',
  },
  softshell_turtle: {
    facts_pl: ['Trionyks ma miękki, gumowy pancerz i nos jak mała rurka.', 'Świetnie pływa — szybszy niż większość żółwi.'],
    size_pl: 'Długość 30–90 cm.', lifespan_pl: '25 lat', diet_pl: 'Ryby, raki, owady, padlina.',
  },
  bullfrog: {
    facts_pl: ['Żaba rycząca brzmi jak krowa w bagnie — słychać z 1 km.', 'Zjada wszystko, co zmieści się jej do paszczy — nawet ptaki.'],
    size_pl: 'Długość 9–15 cm.', lifespan_pl: '8–10 lat', diet_pl: 'Owady, ryby, ptaki, drobne ssaki.',
  },
  hellbender: {
    facts_pl: ['Skrytoskrzelnik to gigantyczna salamandra Ameryki — do 75 cm.', 'Mieszka pod kamieniami w czystych rzekach.'],
    size_pl: 'Długość 30–75 cm.', lifespan_pl: '30 lat', diet_pl: 'Raki, drobne ryby.',
  },
  axolotl_pink: {
    facts_pl: ['Wiosną samce żaby moczarowej na kilka dni robią się niebieskie!', 'Żyje na podmokłych łąkach i torfowiskach w Polsce.'],
    size_pl: 'Długość 5–8 cm.', lifespan_pl: '10–12 lat', diet_pl: 'Owady, pająki, ślimaki.',
  },
  arowana: {
    facts_pl: ['Arowana wyskakuje z wody, żeby złapać owada z gałęzi — do 2 m w górę.', 'W Azji uważana za rybę szczęścia — kosztuje setki tysięcy dolarów.'],
    size_pl: 'Długość 60–120 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Owady, drobne ryby, żaby.',
  },
  discus: {
    facts_pl: ['Dyskowce karmią małe śluzem na własnej skórze.', 'Jedna z najbardziej "rodzicielskich" ryb akwariowych.'],
    size_pl: 'Długość 15–20 cm.', lifespan_pl: '10–15 lat', diet_pl: 'Owady, larwy, plankton.',
  },
  scorpion: {
    facts_pl: ['Skorpion świeci w ultrafiolecie — jego pancerz fluoryzuje.', 'Potrafi przeżyć nawet rok bez jedzenia.'],
    size_pl: 'Długość 5–20 cm.', lifespan_pl: '3–25 lat', diet_pl: 'Owady, pajęczaki, drobne kręgowce.',
  },
  tarantula: {
    facts_pl: ['Tarantula ma sierść na całym ciele — strząsa ją na napastnika.', 'Mimo wyglądu — jad słabszy niż ukąszenie pszczoły dla człowieka.'],
    size_pl: 'Długość ciała do 10 cm, łapy do 30 cm.', lifespan_pl: 'do 30 lat (samica)', diet_pl: 'Owady, drobne kręgowce.',
  },
  black_widow: {
    facts_pl: ['Czarna wdowa ma czerwoną klepsydrę na brzuchu.', 'Jad 15 razy silniejszy od jadu grzechotnika — ale w mikro-dawce.'],
    size_pl: 'Długość 8–13 mm.', lifespan_pl: '1–3 lata', diet_pl: 'Owady — łapane w sieć.',
  },
  camel_spider: {
    facts_pl: ['Solfuga biega po pustyni nawet 15 km/h.', 'Mimo nazwy nie jest pająkiem — to oddzielny rząd pajęczaków.'],
    size_pl: 'Długość 5–15 cm.', lifespan_pl: '1 rok', diet_pl: 'Owady, gryzonie, jaszczurki.',
  },

  // === BATCH 4 — Ameryka Pn ===
  bison_american: {
    facts_pl: ['Bizon to największy ssak Ameryki Północnej.', 'Pod koniec XIX wieku zostało ich tylko 1000 — z 60 milionów.'],
    size_pl: 'Wysokość 1,6–1,8 m. Waga 400–1000 kg.', lifespan_pl: '15–25 lat', diet_pl: 'Trawa.',
  },
  grizzly: {
    facts_pl: ['Grizzly łapie łososie wprost z wodospadu.', 'Mimo wagi 350 kg biega 50 km/h.'],
    size_pl: 'Długość 2–3 m. Waga 200–450 kg.', lifespan_pl: '20–30 lat', diet_pl: 'Wszystkożerca — ryby, jagody, padlina, łosie.',
  },
  coyote: {
    facts_pl: ['Kojot wyje, szczeka i skomli — potrafi wydać kilkanaście różnych odgłosów.', 'Najbardziej rozpowszechniony drapieżnik Ameryki — od Alaski po Panamę.'],
    size_pl: 'Długość 80–100 cm.', lifespan_pl: '10–14 lat', diet_pl: 'Gryzonie, króliki, padlina, owoce.',
  },
  puma: {
    facts_pl: ['Puma skacze 6 metrów w jednym susie — i 5 m w pionie.', 'Ma więcej nazw niż jakiekolwiek inne zwierzę — cougar, panther, mountain lion…'],
    size_pl: 'Długość 1–2 m. Waga 30–80 kg.', lifespan_pl: '8–13 lat', diet_pl: 'Jelenie, gryzonie, koziorożce.',
  },
  raccoon: {
    facts_pl: ['Szop "myje" jedzenie w wodzie przed zjedzeniem.', 'Otwiera zamki, śmietniki i lodówki — palce ma niemal jak człowiek.'],
    size_pl: 'Długość 40–70 cm.', lifespan_pl: '2–5 lat dziko', diet_pl: 'Wszystkożerca — owoce, ryby, drobne ssaki, śmieci.',
  },
  opossum: {
    facts_pl: ['Oposum udaje martwego, gdy się boi — i wydziela cuchnący płyn.', 'Jest odporny na jad wielu węży, w tym grzechotnika.'],
    size_pl: 'Długość 35–55 cm.', lifespan_pl: '2–4 lata', diet_pl: 'Wszystkożerca — owady, ścierwo, owoce.',
  },
  skunk: {
    facts_pl: ['Skunks może strzelić swoim "sprayem" na 3 metry — pachnie tygodniami.', 'Robi ostrzegawczy taniec, zanim strzeli — zwykle wystarczy.'],
    size_pl: 'Długość 30–46 cm.', lifespan_pl: '3 lata dziko', diet_pl: 'Owady, gryzonie, jaja, owoce.',
  },
  monarch: {
    tagline_pl: 'mistrz migracji',
    facts_pl: ['Monarchy migrują 4000 km do Meksyku co roku.', 'Nikt nie wie, jak młode trafiają tam pierwszy raz — to dziedziczne.'],
    size_pl: 'Rozpiętość 9 cm.', lifespan_pl: '2–6 tygodni (do 8 miesięcy w migracji)', diet_pl: 'Nektar — gąsienice jedzą tylko trojeść.',
  },
  snowshoe_hare: {
    facts_pl: ['Zając rakietkowy ma ogromne tylne łapy — śnieżne rakiety.', 'Zimą bieleje, latem brązowieje — kamuflaż.'],
    size_pl: 'Długość 40–55 cm.', lifespan_pl: '5 lat', diet_pl: 'Trawa, gałązki, kora.',
  },
  aardvark_pig: {
    facts_pl: ['Babirusa ma kły, które wyrastają przez górną wargę i zawijają się jak rogi.', 'Żyje tylko na kilku wyspach Indonezji — nazwa znaczy "świnia-jeleń".'],
    size_pl: 'Długość 85–110 cm. Waga 60–100 kg.', lifespan_pl: '10–24 lat', diet_pl: 'Owoce, liście, grzyby, owady.',
    map_regions: ['asia-se'],
  },
  horned_lizard: {
    facts_pl: ['Frynozom strzela krwią z oczu, gdy się broni — celuje w paszczę drapieżnika.', 'Jego krew zawiera substancje cuchnące dla psów i kojotów.'],
    size_pl: 'Długość 8–13 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Mrówki — głównie.',
  },

  // === BATCH 4 — Ameryka Pd ===
  vicuna: {
    facts_pl: ['Wikunia ma najlepszą wełnę świata — tylko Inkowie mogli ją nosić.', 'Mieszka na 4000 m w Andach — i prawie wymarła przez kłusowników.'],
    size_pl: 'Wysokość 75–110 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Trawa wysokogórska.',
  },
  guanaco: {
    facts_pl: ['Gwanako pluje skutecznie do 2 metrów.', 'Dziki przodek lamy.'],
    size_pl: 'Wysokość 1–1,2 m.', lifespan_pl: '20–25 lat', diet_pl: 'Trawa, krzewy, porosty.',
  },
  pampas_deer: {
    facts_pl: ['Jeleń pampasowy biega po otwartych łąkach Argentyny.', 'Niegdyś żyło ich miliony — dziś tylko 80 000.'],
    size_pl: 'Wysokość 70 cm.', lifespan_pl: '12 lat', diet_pl: 'Trawa, zioła.',
  },
  rhea: {
    facts_pl: ['Nandu to mniejszy kuzyn strusia z Ameryki Południowej.', 'Tata sam wysiaduje jaja od 5–7 samic naraz.'],
    size_pl: 'Wysokość 1,5 m.', lifespan_pl: '10–15 lat', diet_pl: 'Trawa, nasiona, owady, jaszczurki.',
  },
  maned_wolf: {
    facts_pl: ['Wilk grzywiasty ma bardzo długie nogi — wygląda jak lis na szczudłach.', 'Nie jest blisko spokrewniony z wilkiem — to osobny rodzaj.'],
    size_pl: 'Wysokość 90 cm. Waga 20–30 kg.', lifespan_pl: '6–16 lat', diet_pl: 'Wszystkożerca — gryzonie, owoce, ptaki.',
  },
  armadillo: {
    facts_pl: ['Tylko pancernik trójpasy potrafi zwinąć się w pancerną kulę — inne uciekają i zakopują się.', 'Pancernik dziewięciopaskowy rodzi zawsze identyczne czworaczki.'],
    size_pl: 'Długość 15–150 cm.', lifespan_pl: '12–15 lat', diet_pl: 'Owady, drobne kręgowce, korzenie.',
  },
  pichi: {
    facts_pl: ['Pancernik karłowaty kopie w pustyni i zwija się w kulę.', 'Jeden z najmniejszych pancerników — zimą zapada w sen.'],
    size_pl: 'Długość 25–35 cm.', lifespan_pl: '10 lat', diet_pl: 'Owady, korzenie, padlina.',
  },

  // === BATCH 4 — Arktyka / Antarktyda / morze (ssaki) ===
  musk_ox: {
    facts_pl: ['Piżmowoły tworzą krąg, broniąc młodych — z rogami na zewnątrz.', 'Ich futro to najcieplejsza naturalna wełna — 8 razy cieplejsza od owczej.'],
    size_pl: 'Wysokość 1,2–1,5 m. Waga 180–410 kg.', lifespan_pl: '12–20 lat', diet_pl: 'Trawa, mchy, porosty.',
  },
  lemming: {
    facts_pl: ['Lemingi nie skaczą do morza — to mit z filmu Disneya z 1958.', 'Co kilka lat ich populacja eksploduje — i one tłumnie migrują.'],
    size_pl: 'Długość 10–18 cm.', lifespan_pl: '1–3 lata', diet_pl: 'Trawa, mchy, porosty.',
  },
  snowy_owl: {
    facts_pl: ['Sowa śnieżna potrafi obrócić głowę o 270°.', 'Aktywna w dzień — w Arktyce latem słońce nie zachodzi.'],
    size_pl: 'Długość 52–71 cm.', lifespan_pl: '9–10 lat', diet_pl: 'Lemingi, gryzonie, drobne ptaki.',
  },
  caribou: {
    facts_pl: ['Karibu migrują 5000 km rocznie — najdłużej ze wszystkich ssaków lądowych.', 'Stada potrafią mieć 500 000 osobników.'],
    size_pl: 'Wysokość 85–150 cm.', lifespan_pl: '15 lat', diet_pl: 'Mchy, porosty, trawa.',
  },
  arctic_wolf: {
    facts_pl: ['Wilk arktyczny ma śnieżnobiałe futro przez cały rok.', 'Wytrzymuje –50°C — najgrubsze futro spośród psów.'],
    size_pl: 'Długość 1–1,8 m.', lifespan_pl: '7–10 lat', diet_pl: 'Piżmowoły, zające, lemingi.',
  },
  snow_fox: {
    facts_pl: ['Zając polarny potrafi skakać na samych tylnych łapach jak kangur.', 'Zimą ma śnieżnobiałe futro — tylko końcówki uszu zostają czarne.'],
    size_pl: 'Długość 50–70 cm. Waga 3–5 kg.', lifespan_pl: '3–5 lat', diet_pl: 'Wierzba karłowata, mchy, porosty, trawa.',
    map_regions: ['arctic', 'america-n'],
  },
  wolverine: {
    facts_pl: ['Rosomak jest wielkości średniego psa, ale tak odważny, że odpędza wilki od zdobyczy.', 'Może zjeść padlinę zamarzniętą na kamień — łamie ją zębami.'],
    size_pl: 'Długość 65–113 cm.', lifespan_pl: '7–12 lat', diet_pl: 'Padlina, lemingi, ptaki, zające.',
  },
  reindeer_svalbard: {
    facts_pl: ['Renifer Svalbardzki to najmniejszy podgatunek — przeżywa w arktycznej ciemności.', 'Krótkie nogi i pyski — ochrona przed zimnem.'],
    size_pl: 'Wysokość 80–95 cm.', lifespan_pl: '10 lat', diet_pl: 'Mchy, porosty, trawa.',
  },
  beluga: {
    tagline_pl: 'kanarek mórz',
    facts_pl: ['Beluga uśmiecha się i piszczy — "kanarek mórz".', 'Może obracać głowę — w odróżnieniu od innych wielorybów.'],
    size_pl: 'Długość 3,5–5,5 m. Waga 1500 kg.', lifespan_pl: '35–50 lat', diet_pl: 'Ryby, kalmary, krewetki.',
  },
  bowhead: {
    tagline_pl: 'najdłużej żyjący ssak',
    facts_pl: ['Wieloryb grenlandzki dożywa nawet 200 lat!', 'Najgrubsza skóra wśród zwierząt — 50 cm tłuszczu.'],
    size_pl: 'Długość 14–18 m.', lifespan_pl: '100–200 lat', diet_pl: 'Plankton — filtruje wodę.',
  },
  bearded_seal: {
    facts_pl: ['Foka brodata ma długie wąsy do szukania ryb pod lodem.', 'Samce śpiewają pod wodą długie pieśni — żeby przyciągnąć samice.'],
    size_pl: 'Długość 2–2,6 m.', lifespan_pl: '25 lat', diet_pl: 'Małże, krewetki, ryby denne.',
  },
  narwhal: {
    tagline_pl: 'jednorożec mórz',
    facts_pl: ['Narwale są nazywane "jednorożcami morza" — to ich długi, spiralny kieł.', 'Kieł to wydłużony ząb, który przebija wargę — biegną w nim nerwy aż do końca.'],
    size_pl: 'Długość 4–5 m + kieł 2–3 m.', lifespan_pl: '50 lat', diet_pl: 'Halibut, dorsz, kalmary.',
  },
  puffin: {
    facts_pl: ['Maskonur wygląda jak pingwin z papugowym dziobem.', 'Lata jak helikopter — szybko bije skrzydłami.'],
    size_pl: 'Długość 26–29 cm.', lifespan_pl: '20 lat', diet_pl: 'Ryby — niesie po 10 w dziobie.',
  },
  atlantic_puffin: {
    facts_pl: ['Alka krzywonosa świetnie nurkuje — pod wodą "leci", machając skrzydłami.', 'Gniazduje na skalnych półkach nad morzem, w wielkich koloniach.'],
    size_pl: 'Długość 37–39 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Drobne ryby — śledzie, dobijaki.',
    map_regions: ['arctic', 'europa', 'oceans'],
  },
  arctic_tern: {
    tagline_pl: 'mistrz dystansu',
    facts_pl: ['Rybitwa przelatuje rocznie 80 000 km — to dwa razy okrążenie Ziemi.', 'Widzi w życiu więcej słońca niż jakiekolwiek inne zwierzę.'],
    size_pl: 'Długość 33–36 cm.', lifespan_pl: '30 lat', diet_pl: 'Drobne ryby, krewetki.',
  },
  king_penguin: {
    facts_pl: ['Pingwin królewski jest drugim największym po cesarskim.', 'Nurkuje na 300 m za rybą.'],
    size_pl: 'Wysokość 70–100 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Drobne ryby, kalmary.',
  },
  rockhopper_penguin: {
    facts_pl: ['Pingwin skalny ma żółte czuby na głowie i skacze po skałach.', 'Łapy nie tylko biegają — używa ich do skakania po klifach.'],
    size_pl: 'Wysokość 45–58 cm.', lifespan_pl: '10 lat', diet_pl: 'Kryl, drobne ryby, kalmary.',
  },
  penguin_little: {
    facts_pl: ['Pingwin mały to najmniejszy gatunek pingwina — 30 cm wysokości.', 'Mieszka w Australii i Nowej Zelandii — nie w Arktyce.'],
    size_pl: 'Wysokość 30–33 cm. Waga 1,5 kg.', lifespan_pl: '6 lat dziko', diet_pl: 'Drobne ryby, kalmary, kryl.',
  },
  leopard_seal: {
    facts_pl: ['Foka lampart poluje na pingwiny pod lodem.', 'Mimo śliczności — bardzo agresywna, zaatakuje też nurka.'],
    size_pl: 'Długość 3–3,8 m.', lifespan_pl: '12–15 lat', diet_pl: 'Pingwiny, foki, ryby, kryl.',
  },
  elephant_seal: {
    facts_pl: ['Samce słoni morskich mają nos jak małą trąbę.', 'Nurkują nawet na 2000 metrów i wstrzymują oddech prawie 2 godziny.'],
    size_pl: 'Długość 5–6 m. Waga 3700 kg (samiec).', lifespan_pl: '20 lat', diet_pl: 'Ryby, kalmary.',
  },
  sea_lion: {
    facts_pl: ['Lew morski ma małe uszy na zewnątrz głowy — foki ich nie mają.', 'W odróżnieniu od foki — może chodzić na płetwach.'],
    size_pl: 'Długość 2–3 m.', lifespan_pl: '15–25 lat', diet_pl: 'Ryby, kalmary, kraby.',
  },
  seal: {
    facts_pl: ['Foki wyczuwają wąsami drgania wody i tak tropią ryby.', 'Niektóre foki potrafią wstrzymać oddech ponad godzinę.'],
    size_pl: 'Długość 1,5–2 m.', lifespan_pl: '15–35 lat', diet_pl: 'Ryby, kalmary, skorupiaki.',
  },
  manatee: {
    tagline_pl: 'morska krowa',
    facts_pl: ['Manaty nazywane są "morskimi krowami" — jedzą trawę morską.', 'Ich najbliższymi żyjącymi krewnymi są… słonie!'],
    size_pl: 'Długość 2,7–4 m.', lifespan_pl: '50–60 lat', diet_pl: 'Trawa morska, glony.',
  },
  dugong: {
    facts_pl: ['Diugoń to "krowa morska" — kuzyn manata.', 'Marynarze brali je za syreny — to one zainspirowały tę legendę.'],
    size_pl: 'Długość 2,4–4 m.', lifespan_pl: '70 lat', diet_pl: 'Trawa morska.',
  },
  sperm_whale: {
    tagline_pl: 'największy mózg na Ziemi',
    facts_pl: ['Kaszalot ma największy mózg ze wszystkich zwierząt — 8 kg.', 'Nurkuje nawet na 2 km w poszukiwaniu kalmarów.'],
    size_pl: 'Długość 11–20 m.', lifespan_pl: '60–70 lat', diet_pl: 'Kalmary olbrzymie, ryby, ośmiornice.',
  },
  porpoise: {
    facts_pl: ['Morświny zamieszkują też Bałtyk — to nasz "polski delfin".', 'Mniejsze i nieśmielsze od delfinów.'],
    size_pl: 'Długość 1,4–1,9 m.', lifespan_pl: '20–25 lat', diet_pl: 'Drobne ryby, kalmary.',
  },
  humpback: {
    tagline_pl: 'wieloryb-pieśniarz',
    facts_pl: ['Humbak śpiewa pieśni, które słychać na setki kilometrów.', 'Wyskakuje całym ciałem z wody — to 30-tonowe salto!'],
    size_pl: 'Długość 12–16 m.', lifespan_pl: '45–50 lat', diet_pl: 'Kryl, drobne ryby.',
  },
  blue_whale_pygmy: {
    facts_pl: ['Płetwal karłowaty jest "mały" tylko jak na płetwale — i tak ma 24 metry.', 'Mieszka na półkuli południowej.'],
    size_pl: 'Długość 21–24 m.', lifespan_pl: '70 lat', diet_pl: 'Kryl — kilka ton dziennie.',
  },
  right_whale: {
    facts_pl: ['Wal biskajski pływa wolno blisko brzegu — to "ten właściwy" do polowania (stąd nazwa).', 'Niemal wybity — żyje ich tylko ok. 400.'],
    size_pl: 'Długość 15–18 m.', lifespan_pl: '70 lat', diet_pl: 'Plankton.',
  },
  gray_whale: {
    facts_pl: ['Wal szary nurkuje na dno i zjada błoto pełne skorupiaków.', 'Migruje nawet 20 000 km rocznie — to jedna z najdłuższych wędrówek wśród ssaków.'],
    size_pl: 'Długość 13–15 m.', lifespan_pl: '50–70 lat', diet_pl: 'Skorupiaki denne.',
  },
  orca_killer: {
    facts_pl: ['Płetwal zwyczajny to drugie co do wielkości zwierzę świata — po płetwalu błękitnym.', 'Jest tak szybki, że nazywa się go "chartem mórz".'],
    size_pl: 'Długość 18–25 m. Waga 40–80 ton.', lifespan_pl: '80–90 lat', diet_pl: 'Kryl, drobne ryby — filtruje wodę fiszbinami.',
  },

  // === BATCH 4 — Australia / NZ ===
  echidna: {
    facts_pl: ['Kolczatka składa jaja, ale karmi mlekiem — jak dziobak.', 'Język wystrzela 18 cm — zjada mrówki.'],
    size_pl: 'Długość 30–45 cm.', lifespan_pl: '14–16 lat (do 45 w niewoli)', diet_pl: 'Mrówki, termity.',
  },
  tasmanian_devil: {
    facts_pl: ['Diabeł tasmański ma najsilniejszy zgryz na kg ciała ze ssaków.', 'Wydaje upiorne krzyki — stąd nazwa "diabeł".'],
    size_pl: 'Długość 50–80 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Padlina, drobne ssaki, ptaki.',
  },
  wombat: {
    facts_pl: ['Wombaty robią… sześcienne kupki — jedyne zwierzę na świecie.', 'Kopie nory o długości 30 m.'],
    size_pl: 'Długość 70–110 cm. Waga 20–35 kg.', lifespan_pl: '15 lat dziko', diet_pl: 'Trawa, korzenie, kora.',
  },
  quokka: {
    tagline_pl: 'najbardziej uśmiechnięte zwierzę',
    facts_pl: ['Kwokka zawsze "uśmiecha się" do zdjęć — kształt pyska.', 'Mieszka na wyspie Rottnest — turyści zjeżdżają, by zrobić selfie.'],
    size_pl: 'Długość 40–50 cm.', lifespan_pl: '10 lat', diet_pl: 'Trawa, liście, kora.',
  },
  cassowary: {
    facts_pl: ['Kazuar ma na nogach pazur długi na 12 cm — potrafi bardzo mocno kopnąć.', 'Jeden z najniebezpieczniejszych ptaków świata.'],
    size_pl: 'Wysokość 1,5–1,8 m. Waga 36–58 kg.', lifespan_pl: '40–50 lat', diet_pl: 'Owoce, owady, grzyby.',
  },
  cassowary_dwarf: {
    facts_pl: ['Karłowaty kazuar to najmniejszy z trzech gatunków kazuara.', 'Mieszka w górskich lasach Nowej Gwinei.'],
    size_pl: 'Wysokość 1–1,4 m.', lifespan_pl: '20 lat', diet_pl: 'Owoce, owady.',
  },
  emu: {
    facts_pl: ['Emu ma dwie pary powiek — jedna służy do mrugania, druga chroni oczy przed kurzem.', 'Drugi największy ptak świata, po strusiu.'],
    size_pl: 'Wysokość 1,5–1,9 m.', lifespan_pl: '10–20 lat', diet_pl: 'Trawa, owoce, owady.',
  },
  kakapo: {
    tagline_pl: 'nielatająca papuga',
    facts_pl: ['Samce kakapo "dudnią" z wykopanych w ziemi dołków — słychać je z kilku kilometrów.', 'Najgrubsza papuga świata — i jedna z najrzadszych.'],
    size_pl: 'Długość 58–64 cm. Waga 3–4 kg.', lifespan_pl: '60–100 lat', diet_pl: 'Owoce, nasiona, kora.',
  },
  kiwi: {
    tagline_pl: 'symbol Nowej Zelandii',
    facts_pl: ['Kiwi z Nowej Zelandii nie lata, ma za to wąsy jak kot.', 'Jedyny ptak z nozdrzami na końcu dzioba — wyczuwa robaki pod ziemią.'],
    size_pl: 'Długość 25–45 cm.', lifespan_pl: '25–50 lat', diet_pl: 'Robaki, owady, owoce.',
  },
  lyrebird: {
    facts_pl: ['Liroogon naśladuje wszystko — piłę łańcuchową, alarm samochodowy, śmiech.', 'Jego ogon ma kształt liry — instrumentu muzycznego.'],
    size_pl: 'Długość 80–100 cm.', lifespan_pl: '15 lat', diet_pl: 'Owady, dżdżownice, pajęczaki.',
  },
  giant_weta: {
    facts_pl: ['Weta gigantyczna z Nowej Zelandii jest cięższa od wróbla.', 'Jeden z największych owadów świata — żyjąca skamielina.'],
    size_pl: 'Długość 10 cm. Waga do 70 g.', lifespan_pl: '2 lata', diet_pl: 'Liście, owoce, drobne owady.',
  },
  octopus_blue_ring: {
    facts_pl: ['Ośmiornica niebieskopierścieniowa ma jad zabijający w minuty — bez antidotum.', 'Jest malutka, ale bardzo groźna — nigdy nie wolno jej dotykać.'],
    size_pl: 'Długość 12–20 cm.', lifespan_pl: '2 lata', diet_pl: 'Kraby, krewetki, drobne ryby.',
  },

  // === BATCH 4 — Ocean (ryby) ===
  hammerhead: {
    facts_pl: ['Rekin młot ma oczy daleko od siebie — widzi 360°.', 'Mimo dziwnego pyska — bardzo skuteczny drapieżnik.'],
    size_pl: 'Długość 4–6 m.', lifespan_pl: '20–30 lat', diet_pl: 'Ryby, kalmary, płaszczki.',
  },
  whale_shark: {
    tagline_pl: 'największa ryba świata',
    facts_pl: ['Rekin wielorybi jest największą rybą — i je tylko plankton.', 'Każdy ma unikalny wzór kropek — jak gwiezdna mapa.'],
    size_pl: 'Długość 12–18 m.', lifespan_pl: '70–100 lat', diet_pl: 'Plankton, kryl, drobne ryby.',
  },
  marlin: {
    facts_pl: ['Marlin pędzi 80 km/h i ma "miecz" do polowania.', 'Hemingway opisał go w "Stary człowiek i morze".'],
    size_pl: 'Długość 3–5 m. Waga 200–820 kg.', lifespan_pl: '13 lat', diet_pl: 'Tuńczyki, makrele, sardynki.',
  },
  swordfish: {
    facts_pl: ['Miecznik ma długi "miecz" do oszołamiania ryb.', 'To jedna z najszybszych ryb oceanu.'],
    size_pl: 'Długość 3 m. Waga 650 kg.', lifespan_pl: '9 lat', diet_pl: 'Ryby, kalmary.',
  },
  tuna: {
    facts_pl: ['Tuńczyk pływa nawet 70 km/h.', 'Jego krew jest cieplejsza od otaczającej wody — to "ciepłokrwista ryba".'],
    size_pl: 'Długość 2–4 m. Waga 250–680 kg.', lifespan_pl: '15–40 lat', diet_pl: 'Mniejsze ryby, kalmary.',
  },
  mackerel: {
    facts_pl: ['Makrele pływają w wielkich ławicach — czasem milionami.', 'Jedna z najczęściej jedzonych ryb na świecie.'],
    size_pl: 'Długość 25–50 cm.', lifespan_pl: '11 lat', diet_pl: 'Plankton, drobne ryby.',
  },
  herring: {
    facts_pl: ['Śledzie tworzą ławice liczone w milionach.', 'Komunikują się… pierdzeniem — zarówno samce, jak i samice.'],
    size_pl: 'Długość 30–40 cm.', lifespan_pl: '12–22 lat', diet_pl: 'Plankton, drobne skorupiaki.',
  },
  cod: {
    facts_pl: ['Dorsz ma "brodę" pod żuchwą — wąsik wyczuwa jedzenie.', 'Składa 5–10 milionów jaj rocznie.'],
    size_pl: 'Długość 60–120 cm.', lifespan_pl: '20–25 lat', diet_pl: 'Drobne ryby, skorupiaki.',
  },
  seahorse: {
    facts_pl: ['U koników morskich tatuś rodzi dzieci — samica składa jaja do "kieszonki" samca.', 'Para tańczy razem każdego ranka.'],
    size_pl: 'Długość 1,5–35 cm.', lifespan_pl: '3–5 lat', diet_pl: 'Plankton, drobne skorupiaki.',
  },
  seahorse_dwarf: {
    facts_pl: ['Karłowaty konik morski jest mniejszy od paznokcia.', 'Jest tak mały, że łatwo go pomylić z kawałkiem korala.'],
    size_pl: 'Długość 1,5–2 cm.', lifespan_pl: '2 lata', diet_pl: 'Plankton.',
  },
  seahorse_pygmy: {
    facts_pl: ['Konik morski karłowaty jest mniejszy od paznokcia.', 'Mieszka na gorgoniach i imituje ich kolory.'],
    size_pl: 'Długość 1,5–2,7 cm.', lifespan_pl: '2 lata', diet_pl: 'Plankton.',
  },
  barracuda: {
    facts_pl: ['Barakuda atakuje błysk w wodzie — nawet kolczyk w uchu.', 'Jeden z najszybszych drapieżników morza — do 60 km/h.'],
    size_pl: 'Długość 1,5–2 m.', lifespan_pl: '10–14 lat', diet_pl: 'Mniejsze ryby.',
  },
  clownfish: {
    tagline_pl: 'Nemo z filmu',
    facts_pl: ['Ryba klaun żyje w ukwiale, który ją chroni.', 'Wszystkie rodzą się samcami — największy z grupy zmienia płeć na samicę.'],
    size_pl: 'Długość 6–18 cm.', lifespan_pl: '6–10 lat', diet_pl: 'Plankton, glony, drobne skorupiaki.',
  },
  moray: {
    facts_pl: ['Murena oddycha z otwartą paszczą — pompuje wodę.', 'Ma drugą "wewnętrzną" parę szczęk — jak w Obcym.'],
    size_pl: 'Długość 1,5–3 m.', lifespan_pl: '10–36 lat', diet_pl: 'Drobne ryby, ośmiornice, krewetki.',
  },
  flounder: {
    facts_pl: ['Flądra ma oboje oczu po jednej stronie — rodzi się normalnie, ale jedno oko przeskakuje.', 'Leży na boku na dnie morza.'],
    size_pl: 'Długość 30–95 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Drobne ryby, skorupiaki.',
  },
  anchovy: {
    facts_pl: ['Sardela pływa w ogromnych ławicach.', 'Łowiona od starożytności — Rzymianie robili z niej słony sos.'],
    size_pl: 'Długość 8–15 cm.', lifespan_pl: '3–4 lata', diet_pl: 'Plankton.',
  },
  sardine: {
    facts_pl: ['Sardynki ławicą wyglądają jak srebrna chmura.', 'Co roku w RPA gigantyczna "Sardine Run" — milionowe ławice migrują wzdłuż brzegu.'],
    size_pl: 'Długość 15–25 cm.', lifespan_pl: '5–8 lat', diet_pl: 'Plankton.',
  },
  halibut: {
    facts_pl: ['Halibut to płaska ryba większa od człowieka — do 4 m.', 'Może ważyć 200 kg.'],
    size_pl: 'Długość 1–4 m.', lifespan_pl: '40 lat', diet_pl: 'Mniejsze ryby, ośmiornice, kraby.',
  },
  mola_giant: {
    facts_pl: ['Samogłów ma kształt pływającej tarczy — to najcięższa ryba kostna.', 'Waży do 2,3 tony — wygląda jak pływająca głowa bez ciała.'],
    size_pl: 'Długość 2–3 m. Waga 1000–2300 kg.', lifespan_pl: '10 lat', diet_pl: 'Meduzy.',
  },
  moonfish: {
    facts_pl: ['Strojnik to jedyna znana ryba, która ogrzewa całe swoje ciało — jest stałocieplny!', 'Ma okrągłe, srebrno-czerwone ciało i szkarłatne płetwy.'],
    size_pl: 'Długość 1–2 m. Waga do 270 kg.', lifespan_pl: 'nieznany', diet_pl: 'Kalmary, drobne ryby.',
  },
  angler_fish: {
    facts_pl: ['Żabnica leży na dnie i macha "wędką" na głowie, żeby zwabić rybki.', 'Ma ogromny pysk — potrafi połknąć rybę prawie tak dużą jak ona sama.'],
    size_pl: 'Długość 30–120 cm.', lifespan_pl: '20–25 lat', diet_pl: 'Mniejsze ryby, skorupiaki.',
  },
  parrotfish: {
    facts_pl: ['Papugoryba gryzie koral i robi z niego biały piasek.', 'Jedna papugoryba produkuje 100 kg piasku rocznie.'],
    size_pl: 'Długość 30–120 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Glony rosnące na koralach.',
  },
  wrasse: {
    facts_pl: ['Wargacze są "lekarzami" raf — czyszczą inne ryby z pasożytów.', 'Najwięksi pacjenci tworzą "kolejki" do nich.'],
    size_pl: 'Długość 5–230 cm.', lifespan_pl: '15–30 lat', diet_pl: 'Pasożyty, plankton.',
  },
  lionfish: {
    facts_pl: ['Skrzydlica ma jadowite kolce — pływa wolno, ale jej nie ruszaj.', 'Inwazyjna w Karaibach — zjada wszystko, co napotka.'],
    size_pl: 'Długość 30–47 cm.', lifespan_pl: '10 lat', diet_pl: 'Mniejsze ryby, skorupiaki.',
  },
  stonefish: {
    tagline_pl: 'najbardziej jadowita ryba',
    facts_pl: ['Synanceja to najbardziej jadowita ryba świata — wygląda jak kamień.', 'Uderzenie kolcami zabija w 2 godziny bez surowicy.'],
    size_pl: 'Długość 30–40 cm.', lifespan_pl: '5–10 lat', diet_pl: 'Drobne ryby, krewetki.',
  },
  blobfish: {
    facts_pl: ['Blobfisz na powierzchni wygląda smutno — na głębi ma normalny kształt.', 'Mieszka 1000 m pod wodą — ciśnienie utrzymuje kształt.'],
    size_pl: 'Długość 30 cm.', lifespan_pl: 'nieznany', diet_pl: 'Bezkręgowce, padlina morska.',
  },
  pufferfish: {
    facts_pl: ['Rozdymka napełnia się wodą i robi się okrągła jak balon.', 'Fugu — japoński przysmak, wymaga specjalnej licencji kucharza.'],
    size_pl: 'Długość 5–60 cm.', lifespan_pl: '10 lat', diet_pl: 'Skorupiaki, małże, glony.',
  },
  porcupinefish: {
    facts_pl: ['Najeżka ma kolce, które stroszą się, gdy się napełnia.', 'W chwili ataku robi się 2x większa.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '12 lat', diet_pl: 'Skorupiaki, mięczaki.',
  },
  manta: {
    facts_pl: ['Manty mają największe mózgi spośród ryb.', 'Rozpoznają siebie w lustrze — niewiele zwierząt to potrafi.'],
    size_pl: 'Rozpiętość 5–7 m.', lifespan_pl: '40 lat', diet_pl: 'Plankton, kryl.',
  },
  manta_ray: {
    facts_pl: ['Manta ma rozpiętość 7 metrów — największa płaszczka świata.', 'Wyskakuje 2 m nad wodę — naukowcy nie wiedzą dlaczego.'],
    size_pl: 'Rozpiętość 5–7 m.', lifespan_pl: '50 lat', diet_pl: 'Plankton — filtruje wodę.',
  },

  // === BATCH 4 — Ocean (mięczaki / skorupiaki / inne) ===
  squid: {
    facts_pl: ['Kalmar zostawia chmurę atramentu, żeby uciec.', 'Pływa tyłem — zasysa wodę i wystrzeliwuje przez "rurkę".'],
    size_pl: 'Długość 30–60 cm (zależnie od gatunku).', lifespan_pl: '1–5 lat', diet_pl: 'Ryby, krewetki, inne kalmary.',
  },
  giant_squid: {
    tagline_pl: 'prawdziwy kraken',
    facts_pl: ['Kalmar olbrzymi ma oczy wielkości talerza — największe ze zwierząt.', 'Walczy z kaszalotami — naukowcy znajdują ślady ssawek na skórze wielorybów.'],
    size_pl: 'Długość 12–13 m.', lifespan_pl: '5 lat', diet_pl: 'Ryby, mniejsze kalmary.',
  },
  vampire_squid: {
    facts_pl: ['Wampirzyca świeci niebieskim światłem i mieszka w głębinach 600–900 m.', 'Mimo nazwy — łagodny, je tylko opadające szczątki ("śnieg morski").'],
    size_pl: 'Długość 30 cm.', lifespan_pl: '8 lat', diet_pl: '"Śnieg morski" — opadające szczątki organiczne.',
  },
  cuttlefish: {
    facts_pl: ['Mątwa zmienia kolor w mgnieniu oka — szybciej niż mrugnąć.', 'Choć jest ślepa na kolory — porównuje wzór skóry do otoczenia.'],
    size_pl: 'Długość 15–50 cm.', lifespan_pl: '1–2 lata', diet_pl: 'Kraby, krewetki, drobne ryby.',
  },
  jellyfish: {
    facts_pl: ['Meduza nie ma mózgu, ale poluje skutecznie — używa siatki neuronów.', 'Istnieje od 500 mln lat — dłużej niż dinozaury.'],
    size_pl: 'Średnica 1 cm – 2 m.', lifespan_pl: 'Kilka miesięcy do roku', diet_pl: 'Plankton, drobne ryby.',
  },
  moonjellyfish: {
    facts_pl: ['Chełbia modra to najczęstsza meduza Bałtyku.', 'Praktycznie nieszkodliwa dla człowieka.'],
    size_pl: 'Średnica 10–40 cm.', lifespan_pl: '1 rok', diet_pl: 'Plankton, drobne skorupiaki.',
  },
  starfish: {
    facts_pl: ['Rozgwiazdy odrastają, jeśli stracą ramię.', 'Otwierają małże na siłę i wyciskają żołądek do środka.'],
    size_pl: 'Średnica 5–60 cm.', lifespan_pl: '5–35 lat', diet_pl: 'Małże, ślimaki, korale.',
  },
  coral: {
    facts_pl: ['Koralowiec żyje setki lat i buduje całe rafy — to nie roślina, lecz zwierzę.', 'Wielka Rafa Koralowa widoczna jest z kosmosu.'],
    size_pl: 'Pojedynczy polip 1–10 mm.', lifespan_pl: 'Setki lat (kolonia)', diet_pl: 'Plankton + cukier z glonów żyjących w nich.',
  },
  clam: {
    facts_pl: ['Niektóre małże żyją ponad 500 lat — najstarsza, Ming, miała 507 lat.', 'Małże jedzą i oddychają, przepuszczając wodę przez skrzela.'],
    size_pl: 'Długość 1–130 cm.', lifespan_pl: '50–500 lat', diet_pl: 'Plankton — filtruje wodę.',
  },
  oyster: {
    facts_pl: ['Ostryga tworzy perłę wokół drobinki, która dostała się do jej muszli.', 'Filtruje 200 litrów wody dziennie — czyści morze.'],
    size_pl: 'Długość 7–25 cm.', lifespan_pl: '20 lat', diet_pl: 'Plankton.',
  },
  sea_urchin: {
    facts_pl: ['Jeżowiec ma kolce i porusza się powolnie po dnie.', 'Niektóre żyją 200 lat.'],
    size_pl: 'Średnica 3–10 cm.', lifespan_pl: '30–200 lat', diet_pl: 'Glony, mchy morskie.',
  },
  sea_anemone: {
    facts_pl: ['Ukwiał to "podwodny kwiat" — z parzącymi mackami.', 'Współpracuje z rybą klaunem — daje schronienie, ona daje resztki jedzenia.'],
    size_pl: 'Średnica 1,5 cm – 2 m.', lifespan_pl: '60–80 lat', diet_pl: 'Drobne ryby, skorupiaki.',
  },
  nautilus: {
    tagline_pl: 'żywa skamielina',
    facts_pl: ['Łodziki pływają w morzach od setek milionów lat — to "żywe skamieniałości".', 'Reguluje gaz w komorach muszli, żeby się unosić — jak łódź podwodna.'],
    size_pl: 'Średnica muszli 16–25 cm.', lifespan_pl: '20 lat', diet_pl: 'Padlina, kraby, drobne ryby.',
  },
  cone_snail: {
    facts_pl: ['Stożek strzela mikro-harpunem nasączonym jadem.', 'Jeden gatunek może zabić 20 ludzi jedną dawką.'],
    size_pl: 'Długość 1–22 cm.', lifespan_pl: '8–9 lat', diet_pl: 'Ryby, mięczaki, robaki.',
  },
  sea_cucumber: {
    facts_pl: ['Strzykwa w obronie wyrzuca wnętrzności na wroga — potem odrastają jej nowe.', 'W Azji to przysmak — wart fortunę.'],
    size_pl: 'Długość 10–30 cm (do 3 m).', lifespan_pl: '5–10 lat', diet_pl: 'Detrytus z dna oceanu.',
  },
  sea_slug: {
    facts_pl: ['Niektóre ślimaki morskie są jasnoróżowe i wyglądają jak króliczki.', 'Niektóre kradną chlorofil zjedzonym glonom — fotosyntezują.'],
    size_pl: 'Długość 1–60 cm.', lifespan_pl: '1 rok', diet_pl: 'Gąbki, glony, korale.',
  },
  flatworm: {
    facts_pl: ['Płazińce można pociąć na kawałki — każdy odrośnie do całości.', 'Niektóre rabusie kradną komórki parzące meduz i używają w obronie.'],
    size_pl: 'Długość 1 mm – 60 cm.', lifespan_pl: 'Miesiące do lat', diet_pl: 'Drobne kraby, padlina.',
  },
  crab: {
    facts_pl: ['Krab chodzi bokiem, bo jego nogi najłatwiej zginają się na boki.', 'Niektóre ozdabiają pancerz — przyklejają na siebie glony i ukwiały.'],
    size_pl: 'Długość 1–30 cm.', lifespan_pl: '3–10 lat', diet_pl: 'Wszystkożerca — padlina, glony, drobne zwierzęta.',
  },
  crab_japanese_spider: {
    tagline_pl: 'największy skorupiak świata',
    facts_pl: ['Krab pajęczy ma nogi rozpiętości 4 metrów — największy skorupiak świata.', 'Może żyć 100 lat.'],
    size_pl: 'Rozpiętość 3,8 m. Waga 19 kg.', lifespan_pl: '50–100 lat', diet_pl: 'Padlina, małże, rośliny.',
  },
  shrimp: {
    facts_pl: ['Krewetki mają dziesięć odnóży, a uciekając, pływają do tyłu, machając ogonem.', 'Niektóre, jak krewetka pistoletowa, strzelają bańką powietrza głośniej niż wystrzał.'],
    size_pl: 'Długość 1,5–30 cm.', lifespan_pl: '1–6 lat', diet_pl: 'Plankton, glony, padlina.',
  },
  lobster: {
    facts_pl: ['Homar żyje nawet 100 lat.', 'Rośnie przez całe życie, a utracone odnóże potrafi mu odrosnąć.'],
    size_pl: 'Długość 25–64 cm. Waga do 9 kg.', lifespan_pl: '50–100 lat', diet_pl: 'Ryby, małże, padlina.',
  },
  langouste: {
    facts_pl: ['Langusty maszerują rzędem po dnie morza — czasem ponad 100 w jednej kolejce.', 'Nie mają kleszczy — bronią się długimi czułkami.'],
    size_pl: 'Długość 30–60 cm.', lifespan_pl: '15 lat', diet_pl: 'Małże, padlina, jeżowce.',
  },
  hermit_crab: {
    facts_pl: ['Krab pustelnik wprowadza się w cudze muszle — gdy przerośnie, szuka większej.', 'Robi "kolejkę zamiany" — w grupie zmieniają muszle wszyscy naraz.'],
    size_pl: 'Długość 0,5–40 cm.', lifespan_pl: '10–30 lat', diet_pl: 'Padlina, glony, owoce.',
  },
  coconut_crab: {
    facts_pl: ['Krab kokosowy rozłupie orzech kokosowy kleszczami.', 'Największy lądowy bezkręgowiec — waży 4 kg.'],
    size_pl: 'Rozpiętość nóg 1 m.', lifespan_pl: '60 lat', diet_pl: 'Kokosy, owoce, padlina.',
  },
  krill: {
    facts_pl: ['Kryl to malutkie skorupiaki, którymi żywią się wieloryby, foki i pingwiny.', 'Kryl antarktyczny to jeden z najliczniejszych gatunków zwierząt na Ziemi.'],
    size_pl: 'Długość 1–6 cm.', lifespan_pl: '6 lat', diet_pl: 'Plankton.',
  },
  barnacle: {
    facts_pl: ['Pąkle przyklejają się do statków i wielorybów.', 'Dorosła pąkla przykleja się głową do podłoża i łapie jedzenie… nogami!'],
    size_pl: 'Średnica 1–7 cm.', lifespan_pl: '5–20 lat', diet_pl: 'Plankton.',
  },
  mantis_shrimp: {
    facts_pl: ['Krewetka modliszkowa uderza tak szybko, że woda wokół jej szczypiec na chwilę się zagotowuje.', 'Widzi 16 kolorów — my tylko 3.'],
    size_pl: 'Długość 10–40 cm.', lifespan_pl: '20 lat', diet_pl: 'Kraby, ślimaki, małże.',
  },
  mantis_shrimp_peacock: {
    facts_pl: ['Pawik widzi 12 kolorów — my tylko 3.', 'Uderza piąstką z prędkością kuli — może rozbić szybę akwarium.'],
    size_pl: 'Długość 10–18 cm.', lifespan_pl: '20 lat', diet_pl: 'Kraby, ślimaki, małże.',
  },
  horseshoe_crab: {
    tagline_pl: 'żywa skamielina',
    facts_pl: ['Skrzypłocz jest "żywą skamieniałością" — niemal nie zmienił się od 450 mln lat.', 'Ma niebieską krew — używaną w testach medycznych.'],
    size_pl: 'Długość 50–60 cm.', lifespan_pl: '20 lat', diet_pl: 'Małże, robaki, padlina.',
  },
  tortoise_giant: {
    tagline_pl: 'rekordzista długowieczności',
    facts_pl: ['Żółw olbrzymi z wysp Aldabra na Oceanie Indyjskim może żyć ponad 150 lat.', 'Najstarszy znany żółw, Jonathan z Wyspy Świętej Heleny, ma już prawie 200 lat!'],
    size_pl: 'Długość 1–1,2 m. Waga do 250 kg.', lifespan_pl: '100–150+ lat', diet_pl: 'Trawa, liście, owoce.',
    map_regions: ['africa-sub'],
  },
  turtle: {
    facts_pl: ['Niektóre żółwie lądowe dożywają ponad 100 lat.', 'Skorupa to ich własny szkielet — żebra zrośnięte z płytkami.'],
    size_pl: 'Długość 15–80 cm.', lifespan_pl: '50–150 lat', diet_pl: 'Trawa, liście, owoce.',
  },
  snake: {
    facts_pl: ['Wąż "słyszy" wibracje gruntu szczęką.', 'Wącha językiem — zbiera molekuły zapachu z powietrza.'],
    size_pl: 'Długość 10 cm – 10 m.', lifespan_pl: '5–30 lat', diet_pl: 'Drapieżnik — gryzonie, ptaki, jaja.',
  },
  giant_salamander: {
    tagline_pl: 'największy płaz świata',
    facts_pl: ['Salamandra olbrzymia żyje 80 lat i ma 1,8 metra.', 'To największy płaz świata — i jeden z najstarszych ewolucyjnie.'],
    size_pl: 'Długość 1–1,8 m. Waga 30–60 kg.', lifespan_pl: '50–80 lat', diet_pl: 'Ryby, raki, drobne ssaki.',
  },
  saiga: {
    facts_pl: ['Suhak ma dziwny, opuchnięty nos — filtruje pył stepowy.', 'Kiedyś było ich bardzo mało, ale dzięki ochronie stada znów liczą ponad milion zwierząt.'],
    size_pl: 'Wysokość 60–80 cm.', lifespan_pl: '6–10 lat', diet_pl: 'Trawa stepowa.',
  },
  lemur: {
    facts_pl: ['Lemury rano wygrzewają się w słońcu z rozłożonymi łapkami.', 'Mieszka tylko na Madagaskarze — wszystkie 100 gatunków.'],
    size_pl: 'Długość 30–60 cm + ogon.', lifespan_pl: '16–19 lat', diet_pl: 'Owoce, liście, owady.',
  },
  mandrill: {
    facts_pl: ['Mandryl ma najbardziej kolorowy pyszczek wśród ssaków.', 'Im jaskrawszy nos, tym wyższa pozycja w stadzie.'],
    size_pl: 'Długość 60–95 cm.', lifespan_pl: '20–30 lat', diet_pl: 'Owoce, nasiona, jaja, owady.',
  },
  porcupine: {
    facts_pl: ['Jeżozwierz nie strzela kolcami — ale kolce łatwo się odczepiają i wbijają w napastnika.', 'Kolce to przekształcone włosy — odrastają.'],
    size_pl: 'Długość 60–90 cm.', lifespan_pl: '15–27 lat', diet_pl: 'Liście, kora, owoce.',
  },

  // === BATCH 4 — Owady / pajęczaki / inne pozostałe ===
  beetle: {
    facts_pl: ['Chrząszcze to najliczniejsza grupa zwierząt świata — znamy ponad 350 000 gatunków.', 'Co czwarty znany gatunek zwierzęcia to chrząszcz.'],
    size_pl: 'Długość 0,5–17 cm.', lifespan_pl: 'kilka miesięcy do kilku lat', diet_pl: 'Zależnie od gatunku — wszystko.',
  },
  stag_beetle: {
    facts_pl: ['Jelonek rogacz ma rogi jak miniaturowy jeleń — to przerośnięte żuwaczki.', 'W Polsce na czerwonej liście — zagrożony wyginięciem.'],
    size_pl: 'Długość 5–9 cm.', lifespan_pl: '4 lata (głównie jako larwa)', diet_pl: 'Sok drzew (dorosły), butwiejące drewno (larwa).',
  },
  rhinoceros_beetle: {
    facts_pl: ['Rohatyniec uniesie 850 razy więcej, niż sam waży — to jeden z najsilniejszych owadów.', 'Samce mają róg jak nosorożec.'],
    size_pl: 'Długość 2–6 cm.', lifespan_pl: '1–2 lata', diet_pl: 'Owoce, sok drzew.',
  },
  caterpillar: {
    facts_pl: ['Gąsienica po przepoczwarczeniu zamieni się w motyla.', 'Może zjeść 30 000 razy więcej niż waży w ciągu życia.'],
    size_pl: 'Długość 1–10 cm.', lifespan_pl: '2–6 tygodni', diet_pl: 'Liście — często jeden gatunek rośliny.',
  },
  bumblebee: {
    facts_pl: ['Trzmiel "buczy" niżej niż pszczoła i zapyla rośliny.', 'Może latać w temperaturze 5°C — pszczoła już nie.'],
    size_pl: 'Długość 1–2,5 cm.', lifespan_pl: '4 tygodnie (robotnica)', diet_pl: 'Nektar, pyłek.',
  },
  hornet: {
    facts_pl: ['Szerszeń to największa osa w Polsce.', 'Mit, że 3 użądlenia zabijają — w rzeczywistości groźny tylko dla uczulonych.'],
    size_pl: 'Długość 2,5–3,5 cm.', lifespan_pl: 'kilka miesięcy', diet_pl: 'Owady (głównie inne osy), sok drzew.',
  },
  wasp: {
    facts_pl: ['Osy budują gniazda z przeżutego drewna — taka biologiczna papierowa pulpa.', 'Są drapieżnikami — polują na inne owady.'],
    size_pl: 'Długość 1–2 cm.', lifespan_pl: 'kilka miesięcy', diet_pl: 'Owady, owoce, mięso.',
  },
  mosquito: {
    facts_pl: ['Gryzą tylko samice komarów — samce piją nektar z kwiatów.', 'Najgroźniejsze zwierzę dla ludzi — przenoszą choroby.'],
    size_pl: 'Długość 3–6 mm.', lifespan_pl: '1–2 tygodnie', diet_pl: 'Krew (samica), nektar (samiec).',
  },
  fly: {
    facts_pl: ['Mucha widzi ruch kilka razy szybciej niż my — dla niej nasze ruchy są jak w zwolnionym tempie.', 'Smakuje stopkami — receptory są na łapkach.'],
    size_pl: 'Długość 4–8 mm.', lifespan_pl: '15–25 dni', diet_pl: 'Wszystko — od owoców po padlinę.',
  },
  dragonfly: {
    facts_pl: ['Ważka łapie ofiarę w locie z 95% skutecznością — najlepszy myśliwy świata.', 'Lata 50 km/h i widzi 360°.'],
    size_pl: 'Rozpiętość 5–15 cm.', lifespan_pl: '6 miesięcy (głównie jako larwa)', diet_pl: 'Owady — komary, muchy, mole.',
  },
  mayfly: {
    facts_pl: ['Jętka żyje jako dorosła zaledwie 1 dzień.', 'Często wylatują masowo tego samego wieczoru — milionami.'],
    size_pl: 'Długość 1–3 cm.', lifespan_pl: '1 dzień (dorosły)', diet_pl: 'Nic — dorosła nie ma działającego pyszczka.',
  },
  firefly: {
    facts_pl: ['Świetlik świeci odwłokiem, żeby przyciągnąć partnera.', 'Każdy gatunek miga w innym rytmie — to ich "język".'],
    size_pl: 'Długość 5–25 mm.', lifespan_pl: '2 miesiące', diet_pl: 'Ślimaki, drobne owady.',
  },
  moth: {
    facts_pl: ['Ćmy krążą wokół lamp, bo sztuczne światło myli ich zmysł orientacji.', 'Niektóre nie jedzą całego życia — tylko żyją z zapasów gąsienicy.'],
    size_pl: 'Rozpiętość 0,5–25 cm.', lifespan_pl: 'kilka tygodni', diet_pl: 'Nektar — lub nic.',
  },
  cockroach: {
    facts_pl: ['Karaluch jest bardzo odporny — potrafi przeżyć nawet tydzień bez głowy.', 'Karaluchy chodziły po Ziemi już ponad 300 milionów lat temu — przed dinozaurami.'],
    size_pl: 'Długość 1,5–4 cm.', lifespan_pl: '1 rok', diet_pl: 'Wszystkożerca — łącznie z papierem i mydłem.',
  },
  cockroach_asian: {
    facts_pl: ['Karaczany potrafią latać i przeżyć nawet tydzień bez głowy.', 'Wstrzymują oddech 40 minut.'],
    size_pl: 'Długość 2–4 cm.', lifespan_pl: '1 rok', diet_pl: 'Wszystkożerca.',
  },
  cricket: {
    facts_pl: ['Świerszcz "śpiewa" pocierając skrzydłami.', 'Liczba ćwierknięć w 14 sekund + 40 = temperatura w Fahrenheitach.'],
    size_pl: 'Długość 1,5–2,5 cm.', lifespan_pl: '90 dni', diet_pl: 'Rośliny, resztki, czasem inne owady.',
  },
  grasshopper: {
    facts_pl: ['Konik polny skacze 20x swojej długości.', 'Niektóre gatunki mogą zmieniać się w szarańczę — w stadach milionowych.'],
    size_pl: 'Długość 1–7 cm.', lifespan_pl: '12 miesięcy', diet_pl: 'Trawa, liście.',
  },
  locust: {
    facts_pl: ['Szarańcza w stadzie może zjeść uprawę na hektary — milionowe roje.', 'To po prostu konik polny w "trybie roju" — zmienia się pod wpływem zagęszczenia.'],
    size_pl: 'Długość 5–8 cm.', lifespan_pl: '6 miesięcy', diet_pl: 'Trawa, liście, uprawy.',
  },
  mantis: {
    facts_pl: ['Modliszka czeka godzinami w bezruchu na zdobycz.', 'Samica zjada samca po godach — czasem.'],
    size_pl: 'Długość 5–12 cm.', lifespan_pl: '6 miesięcy', diet_pl: 'Inne owady, czasem małe gady.',
  },
  stick_insect: {
    facts_pl: ['Patyczak udaje gałąź tak dobrze, że łatwo go przegapić.', 'Niektóre gatunki rodzą się tylko jako samice — bez samców.'],
    size_pl: 'Długość 1–60 cm.', lifespan_pl: '1–3 lata', diet_pl: 'Liście drzew.',
  },
  termite: {
    facts_pl: ['Termity budują kopce wyższe niż żyrafa — 9 m wysokie.', 'W kopcu jest klimatyzacja — termity rozumieją wentylację.'],
    size_pl: 'Długość 4–15 mm.', lifespan_pl: '1–2 lata (50 dla królowej)', diet_pl: 'Drewno, papier, suchy materiał roślinny.',
  },
  peacock_butterfly: {
    facts_pl: ['Rusałka pawik ma na skrzydłach "oczy" — straszy ptaki.', 'Skrzydła z tyłu są szare — gdy złoży, znika.'],
    size_pl: 'Rozpiętość 5–6 cm.', lifespan_pl: '11 miesięcy', diet_pl: 'Nektar, sok z owoców.',
  },
  centipede: {
    facts_pl: ['Parecznik ma dużo nóg, ale nigdy dokładnie sto — zawsze nieparzystą liczbę par.', 'Jest drapieżnikiem — para nóg przed pyskiem to kleszcze jadowe.'],
    size_pl: 'Długość 2–30 cm.', lifespan_pl: '2–6 lat', diet_pl: 'Owady, dżdżownice.',
  },
  millipede: {
    facts_pl: ['Krocionogi mają zwykle kilkaset nóg — rekordzista z Australii ma ich aż 1306!', 'Roślinożerca — w odróżnieniu od parecznika.'],
    size_pl: 'Długość 1–30 cm.', lifespan_pl: '7–10 lat', diet_pl: 'Butwiejące liście.',
  },
  earthworm: {
    facts_pl: ['Dżdżownica spulchnia ziemię — to przyjaciel ogrodu.', 'Nie ma oczu, ale wyczuwa światło całą skórą.'],
    size_pl: 'Długość 10–35 cm.', lifespan_pl: '4–8 lat', diet_pl: 'Resztki roślin, próchnica.',
  },
  spider: {
    facts_pl: ['Pająk krzyżak rozpina nową sieć każdej nocy.', 'Pajęcza nić jest 5x mocniejsza od stali na tej samej grubości.'],
    size_pl: 'Długość 5–17 mm.', lifespan_pl: '1 rok', diet_pl: 'Owady — łapane w sieć.',
  },
  harvestman: {
    facts_pl: ['Kosarz ma bardzo długie nogi, ale nie tka sieci.', 'Nie ma jadu ani gruczołów przędnych — dlatego nie tka sieci.'],
    size_pl: 'Ciało 5–10 mm, nogi do 12 cm.', lifespan_pl: '1 rok', diet_pl: 'Drobne owady, padlina.',
  },
  tick: {
    facts_pl: ['Kleszcz wykrywa cię po dwutlenku węgla, który wydychasz.', 'Przenosi boreliozę i odkleszczowe zapalenie mózgu.'],
    size_pl: 'Długość 1–5 mm (do 1 cm po posiłku).', lifespan_pl: '2 lata', diet_pl: 'Krew — ssaków, ptaków.',
  },
  mite: {
    facts_pl: ['Roztocza są tak małe, że widać je dopiero pod mikroskopem — w jednym łóżku żyją ich miliony.', 'Niektóre powodują alergie i astmę.'],
    size_pl: 'Długość 0,2–2 mm.', lifespan_pl: '2 miesiące', diet_pl: 'Złuszczony naskórek, pleśń.',
  },
  flea: {
    facts_pl: ['Pchła skacze 150 razy swoją długość — odpowiednik człowieka skaczącego na 250 m.', 'Przyspiesza w skoku z mocą 100g — więcej niż samolot wojskowy.'],
    size_pl: 'Długość 1,5–3,3 mm.', lifespan_pl: '2–3 miesiące', diet_pl: 'Krew ssaków.',
  },
  louse: {
    facts_pl: ['Wesz nie skacze — chodzi po włosach.', 'Mocno trzyma się włosa specjalnymi pazurkami.'],
    size_pl: 'Długość 2–4 mm.', lifespan_pl: '1 miesiąc', diet_pl: 'Krew człowieka (wesz głowowa żyje na głowie).',
  },
  snail: {
    facts_pl: ['Ślimak ma 14 000 ząbków na języku — "radula".', 'W chwili niebezpieczeństwa chowa się w muszli i zatyka ją śluzem.'],
    size_pl: 'Długość 4–10 cm.', lifespan_pl: '3–7 lat (do 30)', diet_pl: 'Rośliny, glony.',
  },
  slug: {
    facts_pl: ['Ślimak nagi nie ma muszli — chowa się w wilgoci.', 'Zostawia za sobą śluzowy ślad, który pomaga mu się ślizgać.'],
    size_pl: 'Długość 3–15 cm.', lifespan_pl: '1–6 lat', diet_pl: 'Rośliny, grzyby, padlina.',
  },

  // === BATCH 4 — Owady / inne dodatkowe ===
  hummingbird: {
    tagline_pl: 'jedyny ptak latający w tył',
    facts_pl: ['Koliber to jedyny ptak, który lata w tył.', 'Bije skrzydłami nawet 80 razy na sekundę — najmniejszy koliber waży tylko 2 gramy.'],
    size_pl: 'Długość 6–13 cm.', lifespan_pl: '3–5 lat', diet_pl: 'Nektar — 2x swojej wagi dziennie.',
  },
  booby: {
    facts_pl: ['Głupiec niebieskonogi ma jaskrawoniebieskie stopy — używa ich w tańcu godowym.', 'Im jaskrawsze nogi, tym lepszy partner.'],
    size_pl: 'Długość 80 cm.', lifespan_pl: '17 lat', diet_pl: 'Ryby — nurkuje z 25 m.',
  },

  // === BATCH 4 — Mityczne pozostałe ===
  brachiosaurus: {
    facts_pl: ['Brachiozaur sięgał szyją koron drzew jak żywy dźwig — 12 m wysokości.', 'Mógł ważyć 60 ton — jeden z największych dinozaurów.'],
    size_pl: 'Długość 22 m, wysokość 12 m.', lifespan_pl: '100 lat', diet_pl: 'Liście drzew — koron, do których inne nie sięgały.',
  },
  velociraptor: {
    facts_pl: ['Welociraptor był wielkości indyka — film "Park Jurajski" go powiększył.', 'Miał pióra — był blisko spokrewniony z ptakami.'],
    size_pl: 'Długość 2 m, wysokość 50 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Mniejsze dinozaury, jaszczurki.',
  },
  triceratops: {
    facts_pl: ['Triceratops miał trzy rogi i wielką kostną kryzę na karku.', 'Jego kryza chroniła kark — i imponowała samicom.'],
    size_pl: 'Długość 9 m. Waga 6–12 ton.', lifespan_pl: '40 lat', diet_pl: 'Rośliny — głównie paprocie.',
  },
  stegosaurus: {
    facts_pl: ['Stegozaur miał 9 metrów długości, a mózg wielkości orzecha włoskiego.', 'Płytki na grzbiecie służyły do regulacji temperatury.'],
    size_pl: 'Długość 9 m.', lifespan_pl: '30 lat', diet_pl: 'Niskie rośliny, paprocie.',
  },
  bigfoot: {
    facts_pl: ['Bigfoot zostawia rzekomo wielkie ślady w lasach Ameryki.', 'Pierwsze nagranie z 1967 — "film Patterson-Gimlin" — do dziś dyskutowany.'],
    habitat_pl: 'w lasach Ameryki Północnej — według legend',
  },
  nessie: {
    facts_pl: ['Potwór z Loch Ness mieszka rzekomo w szkockim jeziorze.', 'Pierwsze "nowoczesne" zdjęcie z 1934 — okazało się oszustwem.'],
    habitat_pl: 'w szkockim jeziorze Loch Ness — według legend',
  },
  sphinx: {
    facts_pl: ['Sfinks z mitologii ma głowę człowieka i ciało lwa.', 'Największy stoi w Gizie w Egipcie — wykuty w skale 4500 lat temu.'],
    habitat_pl: 'w mitologii starożytnego Egiptu i Grecji',
  },
  griffin: {
    facts_pl: ['Gryf ma głowę orła i ciało lwa — strażnik skarbów.', 'W herbach symbolizuje siłę i czujność.'],
    habitat_pl: 'w mitach Persji, Grecji i średniowiecznej Europy',
  },
  // === Poprawki — nowe/zmienione gatunki bez wcześniejszego opisu ===
  morpho_blue: {
    facts_pl: ['Gąsienica modraszka ariona mieszka w mrowisku — mrówki karmią ją jak własne dziecko!', 'W Polsce jest rzadki i objęty ochroną.'],
    size_pl: 'Rozpiętość 3–4 cm.', lifespan_pl: 'kilka tygodni (dorosły)', diet_pl: 'Nektar (dorosły), larwy mrówek (gąsienica).',
    habitat_pl: 'nasłonecznione łąki Polski i Europy', map_regions: ['europa', 'polska'],
  },
  monarch_butterfly: {
    facts_pl: ['Cytrynek to jeden z pierwszych motyli wiosny — przezimowuje ukryty wśród liści.', 'Dorosły cytrynek żyje nawet rok — dłużej niż większość motyli.'],
    size_pl: 'Rozpiętość 5–6 cm.', lifespan_pl: 'do 1 roku', diet_pl: 'Nektar kwiatów.',
    habitat_pl: 'lasy, ogrody i łąki Polski', map_regions: ['europa', 'polska'],
  },
  orb_weaver: {
    facts_pl: ['Tygrzyk paskowany ma żółto-czarne paski jak osa i tka sieć z zygzakiem.', 'Kiedyś żył tylko na południu Europy — dziś spotkasz go na łąkach w całej Polsce.'],
    size_pl: 'Długość 1–2 cm (samica).', lifespan_pl: '1 rok', diet_pl: 'Koniki polne, muchy i inne owady.',
    habitat_pl: 'łąki i nieużytki Polski', map_regions: ['europa', 'polska'],
  },
  sun_spider: {
    facts_pl: ['Topik to pająk, który mieszka pod wodą w bańce powietrza jak w dzwonie nurkowym.', 'Powietrze przynosi z powierzchni na włoskach odwłoka.'],
    size_pl: 'Długość 8–15 mm.', lifespan_pl: '1–2 lata', diet_pl: 'Drobne zwierzęta wodne.',
    habitat_pl: 'zarośnięte stawy i jeziora Polski', map_regions: ['europa', 'polska'],
  },
  isopod_giant: {
    facts_pl: ['Stonoga to skorupiak, który żyje na lądzie — oddycha czymś w rodzaju skrzeli, dlatego lubi wilgoć.', 'Mama nosi jaja i młode w specjalnej torbie pod brzuchem.'],
    size_pl: 'Długość 1–2 cm.', lifespan_pl: '2–3 lata', diet_pl: 'Butwiejące liście i drewno.',
    habitat_pl: 'wilgotne miejsca pod kamieniami i korą — także w piwnicach', map_regions: ['europa', 'polska'],
  },
  brook_trout: {
    facts_pl: ['Głowacica to największa ryba łososiowata Europy — może mieć ponad metr długości.', 'W Polsce żyje w górskich rzekach, np. w Dunajcu.'],
    size_pl: 'Długość 70–150 cm.', lifespan_pl: '15–20 lat', diet_pl: 'Ryby, żaby, czasem małe ssaki.',
    habitat_pl: 'górskie rzeki dorzecza Dunaju', map_regions: ['europa', 'polska'],
  },
  giant_anteater: {
    facts_pl: ['Tamandua trzyma się gałęzi chwytnym ogonem, a gdy się boi, brzydko pachnie jak skunks.', 'Długim językiem wyjada mrówki i termity z gniazd na drzewach.'],
    size_pl: 'Długość 50–90 cm + ogon.', lifespan_pl: '9–15 lat', diet_pl: 'Mrówki, termity, pszczoły.',
    habitat_pl: 'lasy tropikalne Ameryki Środkowej i Południowej', map_regions: ['america-s'],
  },
  vampire_squid_giant: {
    facts_pl: ['Kalmar Humboldta poluje w stadach i błyska na czerwono i biało — rybacy nazywają go "czerwonym diabłem".', 'Może mieć prawie 2 metry długości i jest bardzo szybki.'],
    size_pl: 'Długość do 1,5–2 m. Waga do 50 kg.', lifespan_pl: '1–2 lata', diet_pl: 'Ryby, kryl, inne kalmary.',
    habitat_pl: 'wschodni Pacyfik', map_regions: ['oceans'],
  },
  mantis_shrimp_punching: {
    facts_pl: ['Krab bokser trzyma w szczypcach małe ukwiały i macha nimi jak pomponami, żeby odstraszyć wrogów.', 'Ukwiały przy okazji pomagają mu łapać drobinki jedzenia.'],
    size_pl: 'Szerokość 1–2 cm.', lifespan_pl: 'kilka lat', diet_pl: 'Drobinki jedzenia zebrane przez ukwiały.',
    habitat_pl: 'rafy koralowe Oceanu Indyjskiego i Pacyfiku', map_regions: ['oceans'],
  },
};

// === Mapowanie expedition_tags → regions ===

const TAG_TO_REGIONS: Record<string, MapRegion[]> = {
  polish_forest: ['europa', 'polska'],
  farm: ['worldwide'],
  home_pets: ['worldwide'],
  savanna: ['africa-sub'],
  jungle: ['america-s', 'asia-se'],
  arctic: ['arctic'],
  australia: ['australia'],
  ocean: ['oceans'],
  night_forest: [],
  mountain: [],
  freshwater: ['europa', 'polska'],
  mythical: ['mythical'],
};

const HABITAT_LABELS: Record<string, string> = {
  polish_forest: 'polskie lasy i pola',
  farm: 'gospodarstwa',
  home_pets: 'domy ludzi',
  savanna: 'afrykańska sawanna',
  jungle: 'tropikalne dżungle',
  arctic: 'lodowe krainy Arktyki i Antarktydy',
  australia: 'australijski busz',
  ocean: 'głębiny oceanu',
  mountain: 'wysokie góry',
  freshwater: 'polskie rzeki i jeziora',
  mythical: 'tylko w legendach i mitach',
};

const CHIP_RULES: { key: string; emoji: string; label: string }[] = [
  { key: 'is_predator', emoji: '🦷', label: 'Drapieżnik' },
  { key: 'eats_plants', emoji: '🌿', label: 'Roślinożerca' },
  { key: 'larger_than_dog', emoji: '📏', label: 'Większe od psa' },
  { key: 'smaller_than_cat', emoji: '🐭', label: 'Mniejsze od kota' },
  { key: 'is_venomous', emoji: '☠️', label: 'Jadowite' },
  { key: 'can_fly', emoji: '🦅', label: 'Lata' },
  { key: 'is_nocturnal', emoji: '🌙', label: 'Aktywne nocą' },
  { key: 'lives_in_groups', emoji: '👥', label: 'Żyje w stadzie' },
  { key: 'has_horns', emoji: '🦌', label: 'Ma rogi / poroże' },
  { key: 'is_dangerous', emoji: '⚠️', label: 'Bywa groźne' },
  { key: 'is_marsupial', emoji: '🦘', label: 'Torbacz' },
  { key: 'is_primate', emoji: '🐒', label: 'Naczelne' },
  { key: 'is_rodent', emoji: '🐀', label: 'Gryzoń' },
  { key: 'has_long_ears', emoji: '🐰', label: 'Długie uszy' },
  { key: 'lives_in_water', emoji: '💧', label: 'Żyje w wodzie' },
];

// === Helpery ===

export function deriveFactChips(animal: Animal): FactChip[] {
  const out: FactChip[] = [];
  for (const rule of CHIP_RULES) {
    if (animal.attributes[rule.key] === true) {
      out.push({ emoji: rule.emoji, label: rule.label });
    }
  }
  return out;
}

/**
 * Per-animal regions, takes priority over tag-based derivation.
 * Dodajemy tutaj wszystko, co biom-tagi załatwiają źle:
 *  - dżungla: tygrys (Azja) vs jaguar (Ameryka Pd) vs goryl (Afryka)
 *  - góry: kondor, kozica, świstak, pantera śnieżna…
 *  - egzotyczne zwierzęta domowe (papugi, koi) wracają do natywnego regionu
 *  - pingwiny → Antarktyda zamiast Arktyki
 */
const MAP_REGION_OVERRIDES: Partial<Record<string, MapRegion[]>> = {
  // === AZJA — dżungla / Himalaje / step ===
  tiger: ['asia-east', 'asia-se'],
  siberian_tiger: ['asia-east'],
  panda: ['asia-east'],
  red_panda: ['asia-east'],
  orangutan: ['asia-se'],
  gibbon: ['asia-se'],
  macaque: ['asia-east', 'asia-se'],
  japanese_macaque: ['asia-east'],
  snow_monkey: ['asia-east'],
  langur: ['asia-se'],
  binturong: ['asia-se'],

  asian_elephant: ['asia-se'],
  sun_bear: ['asia-se'],
  moon_bear: ['asia-east'],
  sloth_bear: ['asia-se'],
  proboscis_monkey: ['asia-se'],
  clouded_leopard: ['asia-se'],
  serow: ['asia-east'],
  takin: ['asia-east'],
  dhole: ['asia-east', 'asia-se'],
  musk_deer: ['asia-east'],
  saola: ['asia-se'],
  snub_nosed_monkey: ['asia-east'],
  snow_leopard: ['asia-cent', 'asia-east'],
  king_cobra: ['asia-se'],
  reticulated_python: ['asia-se'],
  python: ['asia-se', 'africa-sub'],
  komodo: ['asia-se'],

  cobra: ['asia-se', 'africa-sub'],
  atlas_moth: ['asia-se'],

  silk_moth: ['asia-east'],
  gharial: ['asia-se'],
  koi: ['asia-east'],
  saiga: ['asia-cent'],
  yak: ['asia-cent', 'asia-east'],
  sable: ['asia-cent', 'asia-east'],
  marmot: ['europa', 'asia-cent'],
  saltwater_croc: ['asia-se', 'australia'],

  // === AMERYKA PŁD — dżungla / Andy / pampa ===
  jaguar: ['america-s'],
  sloth: ['america-s'],
  anteater: ['america-s'],
  capybara: ['america-s'],
  ocelot: ['america-s', 'america-n'],
  toucan: ['america-s'],
  toucan_keel: ['america-s'],
  macaw: ['america-s'],
  anaconda: ['america-s'],

  piranha: ['america-s'],
  eel_electric: ['america-s'],
  boa: ['america-s'],
  basilisk: ['america-s'],
  poison_frog: ['america-s'],
  glass_frog: ['america-s'],
  mantella: ['africa-sub'], // Madagaskar
  jaguarundi: ['america-s'],
  coati: ['america-s'],
  paca: ['america-s'],
  tamarin: ['america-s'],
  marmoset: ['america-s'],
  giant_otter: ['america-s'],
  hoatzin: ['america-s'],
  blue_morpho: ['america-s'],
  bird_eater: ['america-s'],
  caecilian: ['america-s', 'asia-se'],
  matamata: ['america-s'],
  hercules_beetle: ['america-s'],
  vicuna: ['america-s'],
  guanaco: ['america-s'],
  llama: ['america-s'],
  alpaca: ['america-s'],
  pampas_deer: ['america-s'],
  maned_wolf: ['america-s'],
  condor: ['america-s'],
  rhea: ['america-s'],
  iguana: ['america-s', 'america-n'],
  discus: ['america-s'],
  arowana: ['america-s', 'asia-se'],
  pichi: ['america-s'],
  tapir: ['america-s', 'asia-se'],
  armadillo: ['america-s', 'america-n'],
  chinchilla: ['america-s'],
  guinea_pig: ['america-s'],
  pangolin: ['africa-sub', 'asia-se'],

  // === AMERYKA PŁN ===
  bison_american: ['america-n'],
  grizzly: ['america-n'],
  coyote: ['america-n'],
  puma: ['america-n', 'america-s'],
  raccoon: ['america-n'],
  opossum: ['america-n', 'america-s'],
  skunk: ['america-n'],
  bald_eagle: ['america-n'],
  alligator: ['america-n'],
  rattlesnake: ['america-n'],
  monarch: ['america-n'],
  chipmunk: ['asia-east'],
  snowshoe_hare: ['america-n'],
  alligator_snapping: ['america-n'],
  hellbender: ['america-n'],
  axolotl: ['america-n'],
  bullfrog: ['america-n'],
  aardvark_pig: ['asia-se'],
  peccary: ['america-n', 'america-s'],
  flying_squirrel: ['europa', 'asia-east'],
  horned_lizard: ['america-n'],

  // === AFRYKA ===
  gorilla: ['africa-sub'],
  chimpanzee: ['africa-sub'],
  mandrill: ['africa-sub'],
  lemur: ['africa-sub'],
  aye_aye: ['africa-sub'],
  okapi: ['africa-sub'],
  bongo: ['africa-sub'],
  goliath_beetle: ['africa-sub'],
  ratel: ['africa-sub'],

  secretary_bird: ['africa-sub'],
  aardwolf: ['africa-sub'],

  caracal: ['africa-sub', 'asia-cent'],
  mongoose: ['africa-sub', 'asia-se'],
  meerkat: ['africa-sub'],
  aardvark: ['africa-sub'],
  rock_hyrax: ['africa-sub'],
  serval: ['africa-sub'],
  mamba: ['africa-sub'],
  shoebill: ['africa-sub'],
  marabou: ['africa-sub'],
  chameleon: ['africa-sub', 'asia-se'],
  fennec: ['africa-north'],
  addax: ['africa-north'],
  oryx: ['africa-sub'],
  genet: ['africa-sub', 'europa'],
  monitor_lizard: ['africa-sub', 'asia-se'],

  // === EUROPA / Alpy ===
  chamois: ['europa', 'polska'],
  ibex: ['europa'],
  european_mink: ['europa'],
  giant_salamander: ['asia-east'],

  // === HOLARKTYCZNE / KOSMOPOLITYCZNE ===
  // Gatunki z polish_forest, które żyją też poza Europą — dorzucamy odpowiednie kontynenty.
  owl: ['europa', 'polska', 'asia-east', 'america-n', 'africa-sub'],
  eagle_owl: ['europa', 'polska', 'asia-east'],
  eagle_owl_white: ['europa', 'polska', 'asia-east'],
  fox: ['europa', 'polska', 'asia-east', 'america-n', 'africa-north'],
  wolf: ['europa', 'polska', 'asia-east', 'america-n'],
  bat: ['europa', 'polska', 'asia-east', 'america-n', 'africa-sub', 'america-s', 'australia'],
  raven: ['europa', 'polska', 'asia-east', 'america-n'],
  crow: ['europa', 'polska', 'asia-east', 'america-n'],
  magpie: ['europa', 'polska', 'asia-east', 'america-n'],
  pigeon: ['worldwide'],
  sparrow: ['europa', 'polska', 'asia-east', 'america-n', 'africa-sub'],
  frog: ['europa', 'polska', 'asia-east', 'america-n', 'africa-sub'],
  toad: ['europa', 'polska', 'asia-east', 'america-n', 'america-s'],
  salamander: ['europa', 'polska', 'america-n'],
  newt: ['europa', 'polska', 'asia-east', 'america-n'],
  snake: ['worldwide'],
  spider: ['worldwide'],
  ant: ['worldwide'],
  bee: ['worldwide'],
  wasp: ['worldwide'],
  butterfly: ['worldwide'],
  ladybug: ['worldwide'],
  mosquito: ['worldwide'],
  fly: ['worldwide'],
  dragonfly: ['worldwide'],
  beetle: ['worldwide'],
  cricket: ['worldwide'],
  grasshopper: ['worldwide'],
  cockroach: ['worldwide'],
  termite: ['africa-sub', 'america-s', 'asia-se', 'australia'],
  praying_mantis_giant: ['asia-se', 'africa-sub'],
  earthworm: ['worldwide'],
  centipede: ['worldwide'],
  snail: ['europa', 'polska', 'asia-east', 'america-n'],
  slug: ['worldwide'],

  // === POLARNE / SUBPOLARNE ===
  wolverine: ['arctic', 'europa', 'america-n'],
  mountain_hare: ['europa', 'arctic'],
  arctic_tern: ['arctic', 'antarctica'],

  // === ANTARKTYDA (pingwiny) ===
  penguin_emperor: ['antarctica'],
  king_penguin: ['antarctica'],
  rockhopper_penguin: ['antarctica'],
  penguin_little: ['australia', 'antarctica'],
  leopard_seal: ['antarctica', 'oceans'],
  elephant_seal: ['oceans', 'antarctica'],

  // === AUSTRALIA / Nowa Zelandia ===
  parakeet: ['australia'],
  cockatoo: ['australia', 'asia-se'],
  budgerigar: ['australia'],
  octopus_blue_ring: ['australia', 'asia-se'],
  giant_weta: ['australia'],
  thorny_devil: ['australia'],
  frilled_lizard: ['australia'],
  kakapo: ['australia'],
  kiwi: ['australia'],
  kea: ['australia'],
  tuatara: ['australia'],
  lyrebird: ['australia'],

  // === Egzotyczne ptaki ===
  eagle: ['europa', 'asia-cent', 'america-n'],
  vulture: ['africa-sub', 'asia-se'],
  galapagos_tortoise: ['america-s'],
  parrot: ['america-s', 'africa-sub', 'asia-se'],
  flamingo: ['africa-sub', 'america-s'],
  hummingbird: ['america-s', 'america-n'],
  ostrich: ['africa-sub'],
  emu: ['australia'],
  cassowary: ['australia'],
  cassowary_dwarf: ['australia'],
  booby: ['oceans', 'america-s'],
  quetzal: ['america-s'],
  hornbill: ['asia-se', 'africa-sub'],
  bird_of_paradise: ['australia', 'asia-se'],

  // === Ryby / morze pojedyncze ===
  swordfish: ['oceans'],
  manta_ray: ['oceans'],
  whale_shark: ['oceans'],
  hammerhead: ['oceans'],
  marlin: ['oceans'],
  parrotfish: ['oceans'],
  wrasse: ['oceans'],
  lionfish: ['oceans'],
  stonefish: ['oceans'],
  pufferfish: ['oceans'],
  porcupinefish: ['oceans'],
  blobfish: ['oceans'],
  angler_fish: ['oceans'],
  moonfish: ['oceans'],
  mola_giant: ['oceans'],

  // === Mityczne wyjątki (jednorożec/sfinks/gryf bez prawdziwego regionu) ===
  // wszystkie mityczne i tak idą przez `mythical` w renderze
};

export function deriveMapRegions(animal: Animal): MapRegion[] {
  const explicit = MAP_REGION_OVERRIDES[animal.id];
  if (explicit) return [...explicit];

  const tags = animal.expedition_tags ?? [];
  const set = new Set<MapRegion>();
  for (const tag of tags) {
    const regions = TAG_TO_REGIONS[tag];
    if (regions) {
      for (const r of regions) set.add(r);
    }
  }
  return Array.from(set);
}

export function deriveHabitatText(animal: Animal): string {
  const tags = animal.expedition_tags ?? [];
  const labels = tags
    .map((t) => HABITAT_LABELS[t])
    .filter((x): x is string => !!x);
  if (labels.length === 0) return 'różne zakątki świata';
  // dedupe + max 3
  return Array.from(new Set(labels)).slice(0, 3).join(', ');
}

export type ResolvedAnimalDetails = {
  facts_pl: string[];
  tagline_pl?: string;
  size_pl?: string;
  lifespan_pl?: string;
  diet_pl?: string;
  habitat_pl: string;
  chips: FactChip[];
  map_regions: MapRegion[];
};

/**
 * Główne wejście dla UI — zwraca komplet danych z fallbackiem.
 * Hand-pisane wpisy nadpisują auto-derywację gdzie to ma sens.
 */
export function getAnimalDetails(animal: Animal): ResolvedAnimalDetails {
  const override = ANIMAL_DETAILS[animal.id];
  const facts =
    override?.facts_pl && override.facts_pl.length > 0
      ? override.facts_pl
      : [animal.fun_fact_pl];
  return {
    facts_pl: facts,
    tagline_pl: override?.tagline_pl,
    size_pl: override?.size_pl,
    lifespan_pl: override?.lifespan_pl,
    diet_pl: override?.diet_pl,
    habitat_pl: override?.habitat_pl ?? deriveHabitatText(animal),
    chips: deriveFactChips(animal),
    map_regions: override?.map_regions ?? deriveMapRegions(animal),
  };
}
