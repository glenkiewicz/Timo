/**
 * Biblioteka tekstów Liska Timo — wesołego, trochę gapowatego lisa-detektywa.
 *
 * Charakter pytań siedzi w samych pytaniach (`src/data/questions.ts`: setupy
 * i reakcje związane z tematem). Tu są pule ogólne: wygłupy, „ciepło–zimno”,
 * krótkie reakcje, strzały, pudła, powitania i zakończenia.
 *
 * Zasady tekstów (pilnuje ich `scripts/validate-timo-lines.ts`):
 *  - słowa, które zna przedszkolak, humor z obrazków, dźwięków i przesady,
 *  - bez płci dziecka: żadnych „wygrałeś”, „mały odkrywco”, „tropicielu”,
 *  - Timo mówi o sobie w rodzaju męskim („pomyliłem”, „znalazłem”).
 *
 * Stałe gagi: dumny nos, gubiona lupa, jagody i kanapki z serem, strach
 * przed wodą, rude futro i puszysty ogon.
 */

/* ===================== Wygłupy — maks. 1 na grę ===================== */

/**
 * Fałszywe pytanie zamknięte „Żartuję!”. Zaraz po nim pada prawdziwe pytanie,
 * więc dziecko zdąży się zaśmiać i powiedzieć „nieee!”.
 */
export const WYGLUPY: string[] = [
  'Czy twoje zwierzę nosi skarpetki? Hi, hi, żartuję!',
  'Czy twoje zwierzę jeździ na hulajnodze? Żartuję!',
  'Czy twoje zwierzę je lody łyżeczką? No dobra, żartuję!',
  'Czy twoje zwierzę umie grać na pianinie? Żartuję, żartuję!',
  'Czy twoje zwierzę chodzi do przedszkola? Hi, hi, to był żart!',
  'Czy twoje zwierzę myje zęby szczoteczką? Żartuję!',
];

/* ===================== Ciepło–zimno ===================== */

/**
 * Mówione tylko przy PRZEJŚCIU na wyższy poziom (liczony z silnika:
 * `heatLevel` w guessing-engine), zamiast setupu przed pytaniem.
 */
export const HEAT_WARM_LINES: string[] = [
  'Robi się ciepło!',
  'Ciepło, ciepło… mój nos coś czuje.',
  'Cieplej! Idziemy dobrym tropem.',
];

export const HEAT_HOT_LINES: string[] = [
  'Gorąco! Aż mi parzy nos!',
  'Gorąco, gorąco! Już prawie go mam.',
  'Parzy! Jesteśmy bardzo blisko.',
];

/* ===================== Reakcje na odpowiedź ===================== */

/** Krótkie reakcje na Tak/Nie — przeplatane z reakcjami z pytania, żeby nie spowalniać gry. */
export const REACTION_SHORT: string[] = ['Aha!', 'Notuję!', 'Mhm!', 'Jasne!', 'Dobrze!'];

export const REACTION_IDK: string[] = [
  'Nic nie szkodzi! Ja też nie wszystko wiem.',
  'Spokojnie, zapytam o coś innego.',
  'Hmm, zagadka w zagadce! Idziemy dalej.',
  'Nie szkodzi. Mój nos coś wymyśli.',
];

export const REACTION_HARD: string[] = [
  'Czasem tak, a czasem nie? Sprytne!',
  'Aha, to zależy. Zapisuję ze znakiem zapytania.',
  'Dobra uwaga! Zwierzęta bywają różne.',
];

/* ===================== Powitania na start nowej rundy ===================== */

export const GREETINGS: string[] = [
  'Cześć! Detektyw Timo na służbie. O jakim zwierzaku dziś myślisz?',
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
  'Jesteś! Nasza seria rośnie — tak trzymaj.',
  'Kolejny dzień razem. Lubię, kiedy zaglądasz.',
  'Hura! Zaznaczam nam dzisiejszy dzień w notesie.',
  'Witaj znowu! Seria trwa dalej!',
];

/** Kwestie na progu serii — 7, 14 i 30 dni. Rzadkie, więc mocniejsze. */
export const STREAK_MILESTONE_LINES: string[] = [
  'To dopiero wyczyn! Masz u mnie dodatkowe tropy.',
  'Cała kupka tropów dla ciebie. Należą ci się!',
];

/* ===================== Po wygranej / przegranej ===================== */

/**
 * Kwestie po trafieniu — mówią o WSPÓLNYM tropieniu, nie o sukcesie Timo.
 * Zasługa należy się opisowi dziecka.
 */
export const VICTORY_LINES: string[] = [
  'Jest! Twoje podpowiedzi były super.',
  'Udało się! Jesteśmy świetną drużyną.',
  'Mam go! Piątka w łapę!',
  'Znalazłem! Bez ciebie błądziłbym do wieczora.',
  'Hura! Świetnie znasz swoje zwierzę.',
  'Razem go wytropiliśmy. Mój nos jest z nas dumny!',
];

/**
 * Kwestie po poddaniu się — to jest SUKCES DZIECKA, nie jego porażka.
 * Pytanie na końcu zostaje: teraz wreszcie ma odpowiedź, bo po tym ekranie
 * dziecko wskazuje zwierzę (`AnimalReveal`).
 */
export const GIVE_UP_LINES: string[] = [
  'Ale zagadka! Kto to był?',
  'Moja lupa się poddaje. Pokażesz mi?',
  'Tym razem wygrywasz! Jakie to zwierzę?',
  'Łapy w górę, poddaję się. Zdradzisz mi, kto to?',
  'Mój notes jest pusty, a nos zdziwiony. Co to za zwierzę?',
];

/* ===================== Strzał i pudło ===================== */

/**
 * Wstęp do strzału. Po nim pada nazwa zwierzęcia w mianowniku i „?”, dlatego
 * każdy wstęp kończy się na „to…” — „Stawiam na Krowa” byłoby błędem.
 */
export const GUESS_INTROS: string[] = [
  'Mój nos mówi, że to…',
  'Czy to przypadkiem…',
  'Stawiam trzy jagody, że to…',
  'Hmm, hmm… czy to…',
  'Lupa pokazuje, że to…',
  'Mam! Czy to…',
];

/** Reakcja na „Nie, pudło”. */
export const MISS_LINES: string[] = [
  'Pudło! Mój nos chyba ma katar.',
  'Ups! Lupa mi zaparowała.',
  'Nie? No to szukam dalej!',
  'Ojej, pomyliłem tropy. Jeszcze raz!',
  'Pudło! Ale mój nos się nie poddaje.',
];

// ============================================================
// === GUIDED MODE (Wyprawa z Timo) — komunikaty dla dzieci ===
// ============================================================

/** Intro Timo na ekranie /expedition-intro/[id]. Klucz = expedition.id. */
export const EXPEDITION_INTROS: Record<string, string[]> = {
  water_friends: [
    'Witaj na wodnej sprawie! Wybierz w głowie jednego mieszkańca morza lub jeziora, a detektyw Timo ruszy na poszukiwanie.',
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
    'Hej, hej! Wybierz w głowie jednego wodnego olbrzyma z kart, a ja wytropię go pytaniami.',
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

/**
 * Komunikat gdy guided pula została wyczerpana — dziecko wybrało zwierzę
 * spoza kart inspiracji. Mówiony raz, jako wstęp do następnego pytania.
 */
export const OUTSIDE_CATEGORY_LINES = [
  'Oho! Twoje zwierzę nie pasuje do tej wyprawy. Super, lubię niespodzianki!',
  'Hmm, ten trop wychodzi poza naszą wyprawę. Tropię dalej!',
  'Ale ciekawy wybór! To ktoś spoza naszych kart.',
  'O, niespodzianka! Tego zwierzęcia nie ma na naszej liście.',
];

/** Łagodniejszy give-up dla guided. */
export const GUIDED_GIVE_UP_LINES = [
  'Ale zagadka! Pokażesz mi, kto to?',
  'Zgubiłem trop! Powiesz mi, co to było?',
  'Mój notes pusty — tym razem wygrywasz. Zdradzisz mi rozwiązanie?',
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

/** Wybiera tekst i zwraca jednocześnie `voiceKey` `{voiceKeyPrefix}.{indexInPool}`. */
function pickWithKey(
  storeKey: string,
  pool: readonly string[],
  voiceKeyPrefix: string,
): Pick {
  const text = pickAntiRepeat(storeKey, pool);
  const index = pool.indexOf(text);
  return { text, voiceKey: `${voiceKeyPrefix}.${index}` };
}

/**
 * Wybór z anti-repeat dla dowolnej listy kwestii z gotowymi voiceKey
 * (np. setupy i reakcje z `questions.ts`).
 */
export function pickFromLines(storeKey: string, lines: readonly Pick[]): Pick {
  const text = pickAntiRepeat(
    storeKey,
    lines.map((l) => l.text),
  );
  return lines.find((l) => l.text === text) ?? lines[0];
}

export function pickExpeditionIntro(expeditionId: string): Pick {
  const pool = EXPEDITION_INTROS[expeditionId];
  if (pool && pool.length > 0) {
    return pickWithKey(`intro:${expeditionId}`, pool, `intro.${expeditionId}`);
  }
  return pickWithKey('intro:generic', GENERIC_EXPEDITION_INTRO, 'intro.generic');
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

export function pickMissLine(): Pick {
  return pickWithKey('miss', MISS_LINES, 'miss');
}

export function pickWyglup(): Pick {
  return pickWithKey('wyglup', WYGLUPY, 'wyglup');
}

export function pickHeatLine(level: 'warm' | 'hot'): Pick {
  return level === 'warm'
    ? pickWithKey('heat:warm', HEAT_WARM_LINES, 'heat.warm')
    : pickWithKey('heat:hot', HEAT_HOT_LINES, 'heat.hot');
}

export function pickShortReaction(): Pick {
  return pickWithKey('reaction:short', REACTION_SHORT, 'reaction.short');
}

export function pickReaction(kind: 'idk' | 'hard'): Pick {
  return kind === 'idk'
    ? pickWithKey('reaction:idk', REACTION_IDK, 'reaction.idk')
    : pickWithKey('reaction:hard', REACTION_HARD, 'reaction.hard');
}
