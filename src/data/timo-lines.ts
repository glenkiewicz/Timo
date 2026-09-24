/**
 * Biblioteka tekstów Liska Timo — Detektyw-Lis (Sherlock-junior).
 *
 * Charakter: refleksyjny, ciekawski, lekka ironia. Zamiast "Lisi nos" wszędzie
 * — detektywskie metafory (lupa, notes, sprawa, podejrzany, trop). Crazy =
 * pseudo-naukowy "ekspert lis" (Według mojej analizy, Lisia ekspertyza wskazuje).
 *
 * Prefiksy są skategoryzowane po **fazie gry**:
 *   START  = Q1            (brak wiedzy o zwierzęciu — początek sprawy)
 *   EARLY  = Q2–Q3         (zaczynamy zawężać — pierwsze poszlaki)
 *   MID    = Q4–Q7         (mocno zawężamy — sprawa się zaciska)
 *   LATE   = Q8+           (gorące tropy — końcówka śledztwa)
 *
 * Proporcje docelowe: 70% normal, 20% funny, 10% crazy.
 */

/* ===================== START (Q1) — otwarcie sprawy ===================== */

export const QUESTION_PREFIX_START_NORMAL: string[] = [
  '', // czyste pytanie
  '',
  '',
  '',
  'Hmm, ',
  'Sprawdźmy: ',
  'Zaczynamy: ',
  'Dobra, ',
  'Mam pierwsze pytanie: ',
];

export const QUESTION_PREFIX_START_FUNNY: string[] = [
  'Lupa w łapie, notes otwarty. ',
  'Detektyw Timo na służbie. ',
  'Otwieramy nową sprawę: ',
  'Mam już pierwsze podejrzenie. ',
  'Detal numer jeden: ',
  'Zaczynam śledztwo. ',
];

export const QUESTION_PREFIX_START_CRAZY: string[] = [
  'Według mojej wstępnej analizy: ',
  'Lisia metodologia mówi tak: ',
  'Profesor Timo rozpoczyna badanie. ',
  'Naukowo rzecz biorąc: ',
];

/* ===================== EARLY (Q2–Q3) — pierwsze poszlaki ===================== */

export const QUESTION_PREFIX_EARLY_NORMAL: string[] = [
  '',
  '',
  '',
  'Hmm, ',
  'Aha, ',
  'Dobra, ',
  'Sprawdźmy: ',
  'Idziemy dalej: ',
  'Notuję sobie. ',
];

export const QUESTION_PREFIX_EARLY_FUNNY: string[] = [
  'Zauważyłem coś podejrzanego. ',
  'Mam pewną hipotezę. ',
  'Detal ważny dla śledztwa. ',
  'Hmm, ciekawy szczegół. ',
  'Detektyw zadaje kolejne pytanie: ',
  'Podejrzane, podejrzane. ',
];

export const QUESTION_PREFIX_EARLY_CRAZY: string[] = [
  'Lisia hipoteza badawcza brzmi: ',
  'Statystyka ogonów wskazuje: ',
  'Według mojej ekspertyzy: ',
  'Profesor Timo analizuje dane: ',
];

/* ===================== MID (Q4–Q7) — sprawa się zaciska ===================== */

export const QUESTION_PREFIX_MID_NORMAL: string[] = [
  '',
  '',
  '',
  'Hmm, ',
  'Aha, ',
  'Sprawdźmy jeszcze: ',
  'Idziemy dalej: ',
  'Dobra. ',
];

export const QUESTION_PREFIX_MID_FUNNY: string[] = [
  'Mam mocne podejrzenie. ',
  'Coś tu nie pasuje — i to ciekawe. ',
  'Lupa pokazuje wyraźniej. ',
  'Detektywska intuicja podpowiada. ',
  'Zwęszyłem coś na tropie. ',
  'Aha! Kolejny element układanki. ',
  'Coś mi się przypomina. ',
];

export const QUESTION_PREFIX_MID_CRAZY: string[] = [
  'Lisia ekspertyza wskazuje: ',
  'Statystycznie patrząc, ',
  'Naukowe podejście do tropu: ',
  'Według mojej analizy: ',
  'Badania profesora Timo mówią: ',
];

/* ===================== LATE (Q8+) — końcówka śledztwa ===================== */

export const QUESTION_PREFIX_LATE_NORMAL: string[] = [
  '',
  '',
  'Aha! ',
  'Już prawie. ',
  'Jeszcze chwila. ',
  'Trop bardzo gorący. ',
  'Jeszcze jeden szczegół. ',
];

export const QUESTION_PREFIX_LATE_FUNNY: string[] = [
  'Czuję, że już prawie go mam. ',
  'Lupa mówi: bardzo blisko! ',
  'Detektywska radość rośnie. ',
  'O, jeszcze chwila i mam sprawcę. ',
  'Słyszę szmer w krzakach. ',
  'Niemal go widzę pod lupą. ',
];

export const QUESTION_PREFIX_LATE_CRAZY: string[] = [
  'Lisia metodologia kończy badanie. ',
  'Analiza statystyczna wskazuje: ',
  'Końcowy raport ekspertyzy: ',
];

/* ===================== Interludes — tylko MID+ ===================== */

/**
 * Krótkie, nieinformacyjne wtręty PRZED pytaniem. Tylko od Q4+.
 * Wcześniej nie pasują (detektyw nie ma jeszcze z czego się cieszyć).
 */
export const INTERLUDES_MID: string[] = [
  'Robi się ciekawie. ',
  'Mam dobrą poszlakę. ',
  'Jesteśmy blisko, czuję to. ',
  'Coś tu jest na rzeczy. ',
  'Hmm, mam kilka podejrzeń. ',
];

export const INTERLUDES_LATE: string[] = [
  'Już prawie go mam. ',
  'Końcówka, słyszę to. ',
  'Bardzo blisko! ',
  'Lada chwila wpadnie. ',
];

/* ===================== Reakcje (Faza 2) ===================== */

export const REACTION_YES: string[] = [
  'Tak! Świetnie, mam ważną wskazówkę w notesie.',
  'Doskonale, mam mocny ślad.',
  'Aha, ciepło-ciepło. Idziemy dalej.',
  'Bingo! To ważny szczegół.',
  'Świetnie, sprawa się rozjaśnia.',
  'O, to mi się przyda — notuję.',
  'Tak — trop bardzo gorący!',
];

export const REACTION_NO: string[] = [
  'Aha, eliminujemy tego podejrzanego.',
  'OK, ten trop odpada — szukamy gdzie indziej.',
  'Hmm, nie ten kierunek. Detektyw notuje.',
  'No to wykluczamy. Idziemy gdzie indziej.',
  'Sprawca nie tym razem. Dobrze wiedzieć.',
  'Wykreślamy z notesu. Świetnie.',
  'OK, mamy mniej podejrzanych.',
];

export const REACTION_IDK: string[] = [
  'Spokojnie — detektyw też nie musi wszystkiego wiedzieć. Sprawdzimy z innej strony.',
  'Nic nie szkodzi, kombinuję dalej.',
  'OK, ten szczegół ukryty. Pomijamy.',
  'Detektyw musi czasem zgadywać — to też dane.',
  'Bez problemu, mam inne pytanie w zanadrzu.',
  'Spokojnie, ja też czasem się waham.',
];

export const REACTION_HARD: string[] = [
  'Słuszna uwaga — w naturze nic nie jest czarno-białe. Detektyw to też notuje.',
  'Dobra obserwacja, to też dla mnie cenna wskazówka.',
  'Świat jest skomplikowany, masz całkowitą rację.',
  'Hmm, czasem tak, czasem nie. Notuję jako niejasne.',
  'Mądre spostrzeżenie — sprawa nie jest oczywista.',
];

/* ===================== Powitania na start nowej rundy ===================== */

export const GREETINGS: string[] = [
  'Cześć, mały odkrywco! Detektyw Timo na służbie. O jakim zwierzaku dziś myślisz?',
  'Lupa gotowa, notes otwarty. Pomyśl o zwierzęciu, a ja postaram się je znaleźć.',
  'Otwieramy dziś nową sprawę. Pomyśl w głowie o jednym zwierzaku, nie mów którym.',
  'Mam świeży nos i bystrą głowę. Lecimy z tropieniem?',
  'Pakuj uszy i otwieraj wyobraźnię. Pomyśl o zwierzęciu, a detektyw zgadnie.',
  'Witaj na śledztwie! Wybierz w głowie jedno stworzenie, a ja zacznę pytać.',
];

/* ===================== Seria dzienna ===================== */

/**
 * Powitanie w dniu, w którym seria urosła.
 *
 * Bez liczby w tekście — ta jest na ekranie wielką cyfrą, a klipy głosowe są
 * przywiązane do indeksu kwestii, więc wersja „drugi dzień" wymagałaby osobnego
 * nagrania na każdy dzień serii.
 */
export const STREAK_LINES: string[] = [
  'Przyszedłeś! Nasza seria rośnie — tak trzymaj.',
  'Kolejny dzień razem. Lubię, kiedy zaglądasz.',
  'Jesteś! Zaznaczam nam dzisiejszy dzień w notesie.',
  'Witaj znowu, tropicielu. Seria trwa dalej!',
];

/** Kwestie na progu serii — 7, 14 i 30 dni. Rzadkie, więc mocniejsze. */
export const STREAK_MILESTONE_LINES: string[] = [
  'To dopiero wyczyn! Masz u mnie dodatkowe tropy.',
  'Cała kupka tropów dla ciebie — zasłużyłeś.',
];

/* ===================== Po wygranej / przegranej ===================== */

/**
 * Kwestie po trafieniu — mówią o WSPÓLNYM tropieniu, nie o sukcesie Timo.
 * Wcześniej brzmiały „Detektyw Timo trafił", co utrwalało, że to lis wygrywa,
 * choć punkty dostaje dziecko. Zasługa należy się opisowi dziecka.
 */
export const VICTORY_LINES: string[] = [
  'Udało się! Tak dobrze go opisałeś, że go znalazłem.',
  'Mam go — dzięki tobie. Bez twoich podpowiedzi błądziłbym do wieczora.',
  'Brawo nam — udało się rozwikłać zagadkę!',
  'Znalazłem! Prowadziłeś mnie prosto do celu.',
  'Jest! Świetnie znasz swoje zwierzę.',
  'Razem go wytropiliśmy. Dobra robota, tropicielu!',
];

/**
 * Kwestie po poddaniu się — to jest SUKCES DZIECKA, nie jego porażka.
 * Pytanie na końcu zostaje: teraz wreszcie ma odpowiedź, bo po tym ekranie
 * dziecko wskazuje zwierzę (`AnimalReveal`).
 */
export const GIVE_UP_LINES: string[] = [
  'Przechytrzyłeś mnie! Pokaż, kogo wymyśliłeś?',
  'Ale trudne zwierzę wybrałeś! Co to było za stworzenie?',
  'Mój notes jest pusty — wygrałeś ze mną. Kto to?',
  'Nie mam pojęcia, a ty wiedziałeś od początku. Zdradzisz mi?',
  'Łapy w górę, poddaję się. Powiedz, jakie to zwierzę?',
];

/* ===================== Strzały (guess intros) ===================== */

export const GUESS_INTROS: string[] = [
  'Mam podejrzanego — to chyba',
  'Detektyw mówi:',
  'Hmm, postawię na',
  'Mam pewność, że to',
  'Strzelam: to',
  'Stawiam na',
  'Już wiem! To',
  'Mam mocną teorię — to',
];

// ============================================================
// === GUIDED MODE (Wyprawa z Timo) — komunikaty dla dzieci ===
// ============================================================

/** Intro Timo na ekranie /expedition-intro/[id]. Klucz = expedition.id. */
export const EXPEDITION_INTROS: Record<string, string[]> = {
  water_friends: [
    'Witaj na wodnej sprawie, mały odkrywco! Wybierz w głowie jednego mieszkańca morza lub jeziora, a detektyw Timo ruszy na poszukiwanie.',
    'Plusk-plusk! Mam dla ciebie wodną zagadkę. Pomyśl w głowie o jednym pływaku, a ja zgadnę pytaniami — krok po kroku.',
  ],
  farm_timo: [
    'Otwieramy sprawę farmera! Wybierz w głowie jedno zwierzę z gospodarstwa i nie mów którym. Detektyw Timo idzie tropem.',
    'Ko-ko-ko, mu-uu, hau-hau! Pomyśl o jednym mieszkańcu farmy, a ja postaram się je odgadnąć krok po kroku.',
  ],
  green_jungle: [
    'Wchodzimy w zieloną sprawę dżungli! Pomyśl w głowie o jednym tropikalnym stworzeniu, a detektyw Timo postara się je wytropić.',
    'Tropikalna przygoda i detektywska zagadka! Wybierz jedno zwierzę dżungli, ale ciii... niech to będzie nasza tajemnica.',
  ],
  forest_kids: [
    'Idziemy do lasu na śledztwo! Pomyśl o jednym leśnym mieszkańcu — to będzie nasza wspólna tajemnica, którą rozwikłam pytaniami.',
    'Cicho... w lesie ktoś się skrył. Wybierz w głowie jedno zwierzę, a detektyw Timo wytropi je krok po kroku.',
  ],
  flyers: [
    'Patrz w niebo, mam dla ciebie powietrzną sprawę! Pomyśl o jednym latającym stworzeniu, a detektyw Timo postara się zgadnąć.',
    'Skrzydła w górze! Wybierz w głowie jednego mistrza lotu z kart, ale nie zdradzaj którego — to nasza zagadka.',
  ],
  night_animals: [
    'Latarka w łapę! Nocą las budzi się inaczej, a detektyw Timo ma nocną sprawę. Wybierz w głowie jednego nocnego mieszkańca.',
    'Pst! Nocne zwierzaki są wokół nas. Pomyśl o jednym z nich, a ja zgadnę pytaniami — szepcząc.',
  ],
  big_animals: [
    'Czuję drżenie ziemi — to wielka sprawa dla detektywa! Wybierz w głowie jednego olbrzyma, a Timo go wytropi.',
    'Ooo, kogoś bardzo dużego widzę! Pomyśl o jednym wielkim zwierzęciu z kart, a ja postaram się je odgadnąć.',
  ],
  small_animals: [
    'Patrz uważnie! Detektyw musi czasem szukać w drobnych szczegółach. Pomyśl o jednym maluszku z kart, a ja zgadnę.',
    'Te zwierzaki są malutkie, ale dla detektywa Timo bardzo ważne. Wybierz w głowie jednego z nich.',
  ],
  scary_animals: [
    'Czas na groźne stworzenia! Pomyśl w głowie o jednym z nich, ale spokojnie — pod lupą detektywa nic ci nie zrobi.',
    'Ostrożnie, drapieżna sprawa! Wybierz w głowie jednego niebezpiecznego zwierzaka, a ja go ostrożnie wytropię.',
  ],
  ice_land: [
    'Brrr! Detektyw zakłada futro i rusza do Lodowej Krainy. Pomyśl o jednym mieszkańcu śniegu, a ja zgadnę.',
    'Mróz szczypie w nos, a sprawa lodowa czeka! Wybierz w głowie jedno zwierzę z krainy lodu.',
  ],
  home_pets_friends: [
    'Witam w naszym domu — to sprawa domowa! Pomyśl o jednym pupilu, a detektyw Timo postara się zgadnąć.',
    'Hau, miau, kwa! Wybierz w głowie domowego zwierzaka, a ja rozwikłam tę miłą zagadkę.',
  ],
  feathered: [
    'Pióra w grze, sprawa skrzydlata! Pomyśl o jednym ptaku z kart, a detektyw Timo spróbuje go odgadnąć.',
    'Świer-świer, ćwir-ćwir! Wybierz w głowie jednego pierzastego przyjaciela, a ja go wytropię pytaniami.',
  ],
  furry: [
    'Mięciutkie futerka — przytulna sprawa dla detektywa! Pomyśl o jednym futrzaku, a ja postaram się zgadnąć.',
    'Pomruk... futrzasta zagadka czeka. Wybierz w głowie jedno włochate zwierzę, a Timo go wytropi.',
  ],
  bugs_and_worms: [
    'Małe nóżki w trawie — owadzia sprawa! Pomyśl o jednym maluszku z kart, a detektyw Timo zgadnie.',
    'Brzęczy, pełza, lata! Wybierz w głowie jednego małego bohatera, a ja postaram się go odgadnąć.',
  ],
  savanna_kids: [
    'Słońce nad sawanną, afrykańska sprawa! Pomyśl o jednym mieszkańcu sawanny, a detektyw Timo wytropi go pytaniami.',
    'Akacje szumią, słychać ryk z daleka... wybierz w głowie jedno zwierzę sawanny, a ja zgadnę.',
  ],
  jumpers: [
    'Hop! Skok! Detektyw ma skoczną sprawę. Pomyśl o jednym mistrzu skoku, a ja postaram się odgadnąć.',
    'Te zwierzaki nie chodzą — skaczą jak gumowe piłki! Wybierz w głowie jednego z nich, a Timo wytropi.',
  ],
  swimmers: [
    'Plusk-plusk, sprawa pływacka! Pomyśl o jednym mistrzu pływania z kart, a detektyw Timo zgadnie pytaniami.',
    'Płetwy w wodzie, ogony łopocą! Wybierz w głowie jednego pływającego zwierzaka, a ja go wytropię.',
  ],
  monkey_friends: [
    'Hu-hu-ha, małpia sprawa w dżungli! Pomyśl o jednej z małp, a detektyw Timo zgadnie pytaniami.',
    'W koronach drzew jest tłoczno! Wybierz w głowie jedną małpkę, a ja postaram się ją odgadnąć.',
  ],
  striped_spotted: [
    'Wow, ile wzorów! Sprawa w paski i cętki. Pomyśl o jednym wzorzystym stworzeniu, a detektyw zgadnie.',
    'Cętki, paski, plamy! Wybierz w głowie jedno kolorowo upstrzone zwierzę, a Timo je wytropi.',
  ],
  long_nose: [
    'Hmm, kto ma długi nos? Detektyw musi to sprawdzić. Pomyśl o jednym zwierzaku z długim ryjkiem lub trąbą.',
    'Trąba, ryjek, dziób — ciekawa sprawa! Wybierz w głowie jedno z tych zwierząt i nie zdradzaj.',
  ],
  water_giants: [
    'Głębia oceanu — sprawa dla odważnego detektywa! Pomyśl o jednym wielkim mieszkańcu mórz, a Timo zgadnie.',
    'Brawo, odkrywco! Wybierz w głowie jednego wodnego olbrzyma z kart, a ja wytropię go pytaniami.',
  ],
  dinos_myths: [
    'Stary świat i legendy, sprawa mityczna! Pomyśl o jednym stworzeniu z dawnych czasów lub bajek.',
    'Smoki, dinozaury, jednorożce... wybierz w głowie jedno z tych legendarnych zwierząt, a Timo zgadnie.',
  ],
  shelled: [
    'Stuk-stuk w skorupę — sprawa z pancerzem! Pomyśl o jednym zwierzaku noszącym dom na grzbiecie.',
    'Domek na grzbiecie, twarda skorupa! Wybierz w głowie jedno z tych zwierząt, a detektyw zgadnie.',
  ],
  colorful: [
    'Cała tęcza w jednym miejscu — barwna sprawa! Pomyśl o jednym kolorowym zwierzaku, a Timo go wytropi.',
    'Wow, jak kolorowo! Wybierz w głowie jedno tęczowe stworzenie, a detektyw zgadnie pytaniami.',
  ],
};

export const GENERIC_EXPEDITION_INTRO = [
  'Witaj na nowej wyprawie! Pomyśl w głowie o jednym ze zwierząt z kart, a detektyw Timo postara się je odgadnąć.',
  'Otwieramy sprawę! Wybierz w głowie jedno zwierzę, nie mów mi które, a ja użyję pytań żeby je wytropić.',
];

/** Po odpowiedzi "Nie wiem" — bez kary, ciepło, po detektywsku. */
export const DONT_KNOW_RESPONSES = [
  'Spokojnie — detektyw też nie musi wszystkiego wiedzieć. Zapytam inaczej.',
  'Nic nie szkodzi, kombinuję dalej.',
  'OK, ten szczegół ukryty — sprawdzimy z innej strony.',
  'Hmm, trudne pytanie. Detektyw notuje jako niejasne.',
  'Bez problemu, mam inne pomysły. Spróbujmy inaczej.',
  'Spokojnie, ja też czasem się waham. Lecimy dalej.',
];

/**
 * Komunikat gdy guided pula została wyczerpana — dziecko wybrało zwierzę
 * spoza 18 kart. Wyświetlane raz, potem normalne pytania.
 */
export const OUTSIDE_CATEGORY_LINES = [
  'Oho! Detektyw widzi, że twoje zwierzę nie pasuje całkiem do tej wyprawy. Spokojnie — ciekawe sprawy bywają niespodzianką. Tropię dalej!',
  'Hmm... ten trop prowadzi nas trochę poza naszą wyprawę. Nic nie szkodzi, detektyw lubi nieoczekiwane zwroty akcji.',
  'Ale ciekawy wybór! Sprawdźmy razem, co to za niespodzianka — detektyw Timo idzie nowym tropem.',
  'O, to coś spoza naszej listy! Świetnie, dobra zagadka czasem wychodzi poza scenariusz. Tropię dalej.',
];

/** Łagodniejszy give-up dla guided. */
export const GUIDED_GIVE_UP_LINES = [
  'Przechytrzyłeś mnie! Pokaż, kogo wybrałeś.',
  'Zgubiłem trop, a ty wybrałeś świetnie! Powiedz, co to było?',
  'Mój notes pusty — tym razem twoje. Zdradzisz mi rozwiązanie?',
];

// === HELPERY z anti-repeat (ostatnie 3 użyte nie wracają, jeśli pula > 3) ===

const recentlyPicked: Record<string, string[]> = {};

/** Wynik picka — tekst do UI + voiceKey do odtworzenia MP3 (z voice-manifest.ts). */
export type Pick = { text: string; voiceKey: string };

function pickAntiRepeat(key: string, pool: readonly string[]): string {
  if (pool.length === 0) return '';
  const recent = recentlyPicked[key] ?? [];
  const fresh = pool.filter((line) => !recent.includes(line));
  const candidates = fresh.length > 0 ? fresh : [...pool];
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  recentlyPicked[key] = [picked, ...recent].slice(0, 3);
  return picked;
}

/** Wybiera tekst i zwraca jednocześnie `voiceKey` `prefix.{voiceKeyPrefix}.{indexInPool}`. */
function pickWithKey(
  storeKey: string,
  pool: readonly string[],
  voiceKeyPrefix: string,
): Pick {
  const text = pickAntiRepeat(storeKey, pool);
  const index = pool.indexOf(text);
  return { text, voiceKey: `${voiceKeyPrefix}.${index}` };
}

export function pickExpeditionIntro(expeditionId: string): Pick {
  const pool = EXPEDITION_INTROS[expeditionId];
  if (pool && pool.length > 0) {
    return pickWithKey(`intro:${expeditionId}`, pool, `intro.${expeditionId}`);
  }
  return pickWithKey('intro:generic', GENERIC_EXPEDITION_INTRO, 'intro.generic');
}

export function pickDontKnowResponse(): Pick {
  return pickWithKey('dontknow', DONT_KNOW_RESPONSES, 'dont_know');
}

export function pickOutsideCategoryLine(): Pick {
  return pickWithKey('outside', OUTSIDE_CATEGORY_LINES, 'outside');
}

export function pickGuidedGiveUp(): Pick {
  return pickWithKey('guided_giveup', GUIDED_GIVE_UP_LINES, 'guided_giveup');
}

export function pickGreeting(): Pick {
  return pickWithKey('greeting', GREETINGS, 'greeting');
}

export function pickStreakLine(milestone: boolean): Pick {
  return milestone
    ? pickWithKey('streak_milestone', STREAK_MILESTONE_LINES, 'streak_milestone')
    : pickWithKey('streak', STREAK_LINES, 'streak');
}

export function pickVictoryLine(): Pick {
  return pickWithKey('victory', VICTORY_LINES, 'victory');
}

export function pickGiveUpLine(): Pick {
  return pickWithKey('giveup', GIVE_UP_LINES, 'giveup');
}

export function pickGuessIntro(): Pick {
  return pickWithKey('guess_intro', GUESS_INTROS, 'guess_intro');
}

export function pickReaction(kind: 'yes' | 'no' | 'idk' | 'hard'): Pick {
  const pool =
    kind === 'yes'
      ? REACTION_YES
      : kind === 'no'
        ? REACTION_NO
        : kind === 'idk'
          ? REACTION_IDK
          : REACTION_HARD;
  return pickWithKey(`reaction:${kind}`, pool, `reaction.${kind}`);
}

type Phase = 'start' | 'early' | 'mid' | 'late';
type Mood = 'normal' | 'funny' | 'crazy';

const PREFIX_POOLS: Record<Phase, Record<Mood, readonly string[]>> = {
  start: {
    normal: QUESTION_PREFIX_START_NORMAL,
    funny: QUESTION_PREFIX_START_FUNNY,
    crazy: QUESTION_PREFIX_START_CRAZY,
  },
  early: {
    normal: QUESTION_PREFIX_EARLY_NORMAL,
    funny: QUESTION_PREFIX_EARLY_FUNNY,
    crazy: QUESTION_PREFIX_EARLY_CRAZY,
  },
  mid: {
    normal: QUESTION_PREFIX_MID_NORMAL,
    funny: QUESTION_PREFIX_MID_FUNNY,
    crazy: QUESTION_PREFIX_MID_CRAZY,
  },
  late: {
    normal: QUESTION_PREFIX_LATE_NORMAL,
    funny: QUESTION_PREFIX_LATE_FUNNY,
    crazy: QUESTION_PREFIX_LATE_CRAZY,
  },
};

/**
 * Wybiera prefiks dla danej fazy + nastroju. Może zwrócić Pick z pustym tekstem
 * (te prefiksy też istnieją w pulach jako "" — wtedy `voiceKey` jest pomijany).
 */
export function pickPrefix(phase: Phase, mood: Mood): Pick {
  const pool = PREFIX_POOLS[phase][mood];
  const text = pickAntiRepeat(`prefix:${phase}:${mood}`, pool);
  const index = pool.indexOf(text);
  return { text, voiceKey: `prefix.${phase}.${mood}.${index}` };
}

export function pickInterlude(phase: 'mid' | 'late'): Pick {
  const pool = phase === 'mid' ? INTERLUDES_MID : INTERLUDES_LATE;
  return pickWithKey(`interlude:${phase}`, pool, `interlude.${phase}`);
}
