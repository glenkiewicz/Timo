/**
 * Biblioteka tekstów Liska Timo.
 * Prefiksy są skategoryzowane po **fazie gry** — żeby Timo nie sugerował
 * pamięci na Q1 ("Coś mi się przypomina" na początku rundy brzmi absurdalnie).
 *
 * START  = Q1            (brak wiedzy o zwierzęciu)
 * EARLY  = Q2–Q3         (zaczynamy zawężać)
 * MID    = Q4–Q7         (mocno zawężamy, sugestie pamięci OK)
 * LATE   = Q8+           (gorące tropy, ciekawość)
 *
 * Proporcje docelowe: 70% normal, 20% funny, 10% crazy.
 */

/* ===================== START (Q1) — neutralne ===================== */

export const QUESTION_PREFIX_START_NORMAL: string[] = [
  '', // czyste pytanie
  '',
  '',
  '',
  'Hmm, ',
  'Sprawdźmy: ',
  'Zaczynamy: ',
  'Dobra, ',
  'Lecimy: ',
];

export const QUESTION_PREFIX_START_FUNNY: string[] = [
  'Aha, lecimy: ',
  'Spokojnie, zaczynamy. ',
  'Lisi nos się rozgrzewa. ',
  'Zaczynamy łowy. ',
  'Pakuj lornetkę. ',
];

export const QUESTION_PREFIX_START_CRAZY: string[] = [
  'Wskocz mi do norki na chwilę. ',
  'Tylko między nami, lisami: ',
  'Lisie wąsy mówią START. ',
];

/* ===================== EARLY (Q2–Q3) — lekka kontynuacja ===================== */

export const QUESTION_PREFIX_EARLY_NORMAL: string[] = [
  '',
  '',
  '',
  'Hmm, ',
  'Aha, ',
  'Dobra, ',
  'Sprawdźmy: ',
  'Idziemy dalej: ',
];

export const QUESTION_PREFIX_EARLY_FUNNY: string[] = [
  'Lisi nos wietrzy. ',
  'Otrzepuję futro: ',
  'Lisi notes się otwiera. ',
  'Mój ogon kiwa się leciutko. ',
];

export const QUESTION_PREFIX_EARLY_CRAZY: string[] = [
  'Tu się robi mistycznie. ',
  'Naukowo rzecz biorąc, hehehe — ',
];

/* ===================== MID (Q4–Q7) — sugestie pamięci OK ===================== */

export const QUESTION_PREFIX_MID_NORMAL: string[] = [
  '',
  '',
  'Hmm, ',
  'Aha, ',
  'Tropimy dalej. ',
  'Idziemy: ',
  'Sprawdźmy jeszcze: ',
];

export const QUESTION_PREFIX_MID_FUNNY: string[] = [
  'Lisi instynkt mówi… ',
  'Coś mi się przypomina. ',
  'Mój nos coś zwęszył… ',
  'Ogon się kręci — ',
  'Aha! Mała wskazówka pod łapką: ',
];

export const QUESTION_PREFIX_MID_CRAZY: string[] = [
  'To pytanie pachnie naleśnikiem. ',
  'Ostrzegam, lisie wąsy mrugają: ',
  'Tylko między nami, lisami: ',
];

/* ===================== LATE (Q8+) — gorący trop ===================== */

export const QUESTION_PREFIX_LATE_NORMAL: string[] = [
  '',
  'Aha! ',
  'Trop ciepły. ',
  'Już prawie. ',
  'Jeszcze chwila. ',
];

export const QUESTION_PREFIX_LATE_FUNNY: string[] = [
  'Czuję to w wąsach. ',
  'Lisi notes się zapełnia. ',
  'Mój ogon mówi: blisko, blisko. ',
  'Słyszę szmer w futrze. ',
];

export const QUESTION_PREFIX_LATE_CRAZY: string[] = [
  'Lisie wąsy w pełnym napięciu. ',
  'Tu się robi gorąco jak naleśnik z pieca. ',
];

/* ===================== Interludes — tylko MID+ ===================== */

/**
 * Krótkie, nieinformacyjne wtręty PRZED pytaniem. Tylko od Q4+.
 * Wcześniej nie pasują (Timo nie miałby z czego "się cieszyć tropem").
 */
export const INTERLUDES_MID: string[] = [
  'Mój ogon się kręci z ciekawości. ',
  'Czuję, że jesteśmy blisko. ',
  'Lisi nos coś zwęszył. ',
  'Trop ciepły, idziemy dalej. ',
  'Coś tu jest na rzeczy. ',
];

export const INTERLUDES_LATE: string[] = [
  'Mój ogon się kręci jak młynek. ',
  'Bardzo blisko, czuję to. ',
  'Lisi notes już wibruje. ',
  'Tropimy go, tropimy. ',
];

/* ===================== Reakcje (Faza 2) ===================== */

export const REACTION_YES: string[] = [
  'Tak — trop ciepły!',
  'Świetnie, idziemy dalej.',
  'Aha, dobry kierunek.',
  'Mój nos to potwierdza.',
  'Lisi notes się cieszy.',
];

export const REACTION_NO: string[] = [
  'OK, ten trop odpada.',
  'Hmm, nie ten kierunek.',
  'Nope, szukamy gdzie indziej.',
  'Lisi ogon kręci na bok.',
  'Dobrze wiedzieć — odpada.',
];

export const REACTION_IDK: string[] = [
  'Spokojnie, ja też czasem nie wiem.',
  'OK, ten trop pomijamy.',
  'Lisi nos się waha — idziemy bokiem.',
  'Bez problemu, sprawdzimy inaczej.',
];

export const REACTION_HARD: string[] = [
  'Świat jest skomplikowany, masz rację.',
  'Dobre stwierdzenie — bywa różnie.',
  'Wpisuję sobie w lisi notes: „czasem tak, czasem nie".',
  'Zgadza się, w naturze nic nie jest czarno-białe.',
];

/* ===================== Powitania na start nowej rundy ===================== */

export const GREETINGS: string[] = [
  'Pakuj lornetkę — tropimy!',
  'Pomyśl o zwierzęciu, a ja je znajdę.',
  'Lisi nos już się rozgrzewa.',
  'Gotów? Lisi mózg pracuje.',
];

/* ===================== Po wygranej / przegranej ===================== */

export const VICTORY_LINES: string[] = [
  'Ha! Lisi nos miał rację!',
  'Brawo nam — udało się!',
  'Trafione, spryciarzu.',
  'Lisi notes ma kolejny wpis!',
];

export const GIVE_UP_LINES: string[] = [
  'Oj, dziś lisi nos zawiódł.',
  'Przegrałem honornie. Powiedz mi, kogo wymyśliłeś!',
  'Nawet lis ma czasem zły dzień.',
];

/* ===================== Strzały (guess intros) ===================== */

export const GUESS_INTROS: string[] = [
  'Mój ogon coś mi szepcze… To',
  'Hmm, mój lisi nos zwęszył:',
  'Założę się, że to',
  'Mam przeczucie!',
  'Już wiem!',
  'Trop prowadzi mnie do:',
  'Lisi notes mówi:',
  'Czuję to w wąsach:',
];
