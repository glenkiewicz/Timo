import { BADGES, type BadgeDef } from '@/data/badges';
import { popularityOf } from '@/features/game/popularity';
import { MAX_LEVEL } from '@/features/gamification/titles';
import type { GameAnswer } from '@/types/game';

export type AwardInput = {
  /** Czy Timo trafił. NIE jest to „wygrana dziecka" — patrz `awardRound`. */
  timoGuessed: boolean;
  questionsAsked: number;
  /** Zwierzę rundy: strzał Timo albo to wskazane przez dziecko po poddaniu. */
  animalId: string | null;
  /** Odpowiedzi dziecka — z nich liczy się nagroda za wiedzę. */
  answers: GameAnswer[];
  // current state BEFORE awarding
  streak: number;
  collection: string[];
  badges: string[];
};

export type AwardOutput = {
  pawsDelta: number;
  /** Legacy — stars wycofane, zawsze 0 (zostawione dla compatibility z lastReward shape) */
  starsDelta: number;
  xpDelta: number;
  nextStreak: number;
  nextCollection: string[];
  nextBadges: string[];
  newBadges: BadgeDef[];
  /** Czy ten round jest pierwszym odkryciem zwierzęcia (do UI). */
  isFirstDiscovery: boolean;
  /** Na ile z zadanych pytań dziecko odpowiedziało zdecydowanie — do UI. */
  knownAnswers: number;
  askedQuestions: number;
};

/* ===== Ekonomia — nagroda za to, co robi DZIECKO =====
 *
 * Poprzednia wersja dawała 20 tropów × mnożnik za trafienie Timo (×2 przy
 * czterech pytaniach) i 5 tropów, gdy się poddał. Obie liczby zależały od lisa:
 * dziecko nie ma wpływu na to, jak szybko Timo zgadnie, a pośrednio opłacało mu
 * się wybierać łatwe, popularne zwierzęta. Nagroda szła więc za przegraną
 * dziecka w pojedynku.
 *
 * Teraz stawką jest wiedza o własnym zwierzęciu i odwaga w wyborze:
 * — `KNOWLEDGE` liczy UDZIAŁ pytań, na które dziecko umiało odpowiedzieć
 *   (tak/nie/czasem), a nie ich liczbę. Udział, nie liczba, bo inaczej
 *   opłacałoby się przeciągać rundę.
 * — `RARITY` premiuje zwierzęta spoza garstki najpopularniejszych.
 * — Poddanie się Timo nie jest porażką: runda liczy się tak samo, bo dziecko
 *   i tak opisywało swoje zwierzę.
 *
 * Świadomie NIE liczymy zgodności odpowiedzi z atrybutami zwierzęcia. Pomiar na
 * danych: mediana 6 jawnie opisanych atrybutów na 38, a np. `lives_in_forest`
 * ma wartość tylko u 9 z 715 zwierząt — reszta to domyślne „false". Premia za
 * zgodność karałaby dziecko za prawdziwe odpowiedzi tam, gdzie brakuje danych.
 */
const PAWS_ROUND = 10;
const XP_ROUND = 20;
/** Maksimum za komplet zdecydowanych odpowiedzi. */
const PAWS_KNOWLEDGE = 20;
const XP_KNOWLEDGE = 20;
const PAWS_RARITY = 10;
const PAWS_FIRST_DISCOVERY = 10;
const XP_FIRST_DISCOVERY = 25;
const PAWS_STREAK_BONUS = 5;

/** Udział pytań, na które dziecko odpowiedziało zdecydowanie (0–1). */
function knowledgeShare(answers: GameAnswer[]): number {
  if (answers.length === 0) return 0;
  const known = answers.filter((a) => a.answer !== 'idk').length;
  return known / answers.length;
}

/**
 * Popularność 1.0–1.35 z `popularity.ts` obejmuje ~90 zwierząt, reszta ma 1.0.
 * Odwracamy ją: im mniej oczywiste zwierzę, tym większa premia.
 */
function rarityBonus(animalId: string | null): number {
  if (!animalId) return 0;
  const pop = popularityOf(animalId);
  const rarity = Math.min(1, Math.max(0, (1.35 - pop) / 0.35));
  return Math.round(PAWS_RARITY * rarity);
}

export function awardRound(input: AwardInput): AwardOutput {
  const { timoGuessed, animalId, answers, streak, collection, badges } = input;

  // Zwierzę trafia do kolekcji niezależnie od tego, czy zgadł je Timo, czy
  // wskazało je dziecko po jego poddaniu — inaczej dziecko nie ma sprawczości
  // w budowaniu własnego zbioru.
  const isFirstDiscovery = animalId !== null && !collection.includes(animalId);

  const share = knowledgeShare(answers);
  const knownAnswers = answers.filter((a) => a.answer !== 'idk').length;

  let pawsDelta = PAWS_ROUND + Math.round(PAWS_KNOWLEDGE * share) + rarityBonus(animalId);
  let xpDelta = XP_ROUND + Math.round(XP_KNOWLEDGE * share);

  if (isFirstDiscovery) {
    pawsDelta += PAWS_FIRST_DISCOVERY;
    xpDelta += XP_FIRST_DISCOVERY;
  }

  // Seria liczy UKOŃCZONE RUNDY, nie trafienia Timo — poddanie się lisa nie
  // jest porażką dziecka, więc jej nie zeruje.
  const nextStreak = streak + 1;

  if (nextStreak >= 3) {
    pawsDelta += PAWS_STREAK_BONUS;
  }

  const nextCollection =
    animalId && !collection.includes(animalId)
      ? [...collection, animalId]
      : collection;

  // Badge unlocks — sprawdź wszystkie definicje i odfiltruj już zdobyte
  const unlockedIds = new Set(badges);
  const newBadges: BadgeDef[] = [];

  const tryUnlock = (id: string, condition: boolean) => {
    if (condition && !unlockedIds.has(id)) {
      unlockedIds.add(id);
      const def = BADGES.find((b) => b.id === id);
      if (def) newBadges.push(def);
    }
  };

  tryUnlock('first_win', timoGuessed);
  tryUnlock('first_loss', !timoGuessed);
  tryUnlock('streak_3', nextStreak >= 3);
  tryUnlock('streak_5', nextStreak >= 5);
  tryUnlock('streak_10', nextStreak >= 10);
  tryUnlock('collector_5', nextCollection.length >= 5);
  tryUnlock('collector_10', nextCollection.length >= 10);
  tryUnlock('collector_25', nextCollection.length >= 25);
  tryUnlock('collector_50', nextCollection.length >= 50);
  tryUnlock('collector_100', nextCollection.length >= 100);
  // Było: `won && questionsAsked <= 4`, czyli odznaka za SZYBKOŚĆ TIMO.
  // Teraz osiągnięcie dziecka: runda bez ani jednego „nie wiem".
  tryUnlock('fast_thinker', answers.length >= 4 && share === 1);

  return {
    pawsDelta,
    starsDelta: 0,
    xpDelta,
    nextStreak,
    nextCollection,
    nextBadges: Array.from(unlockedIds),
    newBadges,
    isFirstDiscovery,
    knownAnswers,
    askedQuestions: answers.length,
  };
}

/* ===== XP curve & levels ===== */

/*
 * Krzywa jest wyliczona pod konkretny cel: średni gracz ma dochodzić do maksa
 * przez 3–4 miesiące, przy dziennym limicie 10 rund.
 *
 * Poprzednia krzywa (50 + 50*(n-1), maks. poziom 25) kosztowała 15 000 XP, czyli
 * ~33 dni przy tym limicie — trzy razy za mało. Nowa: 84 poziomy, 49 260 XP, co
 * przy 40–65 XP na rundę daje 76–123 dni.
 *
 * Przyrost jest liniowy i płaski (13 XP na poziom), a nie stromy, bo ostatni
 * poziom ma kosztować ~1100 XP — niecałe trzy dni grania pod limitem. Przy
 * krzywej kwadratowej końcówka rozciągałaby się na tygodnie na jeden awans.
 */

/** XP pierwszego poziomu. */
const XP_BASE = 60;
/** O tyle drożeje każdy kolejny poziom. */
const XP_STEP = 13;
/** Koszty zaokrąglamy, żeby gracz nie widział „151 XP" — to wygląda jak błąd. */
const XP_ROUNDING = 10;

/**
 * Koszt każdego poziomu, policzony raz przy starcie modułu.
 *
 * Zaokrąglenie psuje wzór na sumę ciągu arytmetycznego, więc skumulowane progi
 * trzymamy w tablicy zamiast liczyć je za każdym razem. Przy 84 poziomach to
 * kilkaset bajtów, a `levelFromXp` przestaje sumować w pętli.
 *
 * Zaokrąglenia znoszą się nawzajem: łącznie 49 260 XP wobec 49 219 przed
 * zaokrągleniem, czyli 0,08% różnicy — pasmo 3–4 miesięcy zostaje nietknięte.
 */
const LEVEL_COSTS: number[] = Array.from(
  { length: MAX_LEVEL },
  (_, i) => Math.round((XP_BASE + XP_STEP * i) / XP_ROUNDING) * XP_ROUNDING
);

/** `CUMULATIVE[n - 1]` to XP potrzebne, żeby wejść na poziom n. */
const CUMULATIVE: number[] = LEVEL_COSTS.reduce<number[]>(
  (acc, cost) => [...acc, acc[acc.length - 1] + cost],
  [0]
);

function clampLevel(n: number): number {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(n)));
}

/** XP potrzebne w obrębie poziomu n, żeby wejść na n+1. n>=1. */
export function xpForLevel(n: number): number {
  return LEVEL_COSTS[clampLevel(n) - 1];
}

/** Skumulowane XP potrzebne do osiągnięcia poziomu n (n=1 to 0). */
export function totalXpToReach(n: number): number {
  return CUMULATIVE[clampLevel(n) - 1];
}

export function levelFromXp(xp: number): number {
  let n = 1;
  while (n < MAX_LEVEL && totalXpToReach(n + 1) <= xp) n += 1;
  return n;
}

export function xpProgress(xp: number): {
  current: number;
  nextLevelAt: number;
  pct: number;
} {
  const level = levelFromXp(xp);
  const base = totalXpToReach(level);
  const next = xpForLevel(level);
  const current = xp - base;

  // Na maksie pasek stoi pełny — nie ma kolejnego poziomu do odliczania.
  if (level >= MAX_LEVEL) {
    return { current: next, nextLevelAt: next, pct: 1 };
  }

  return {
    current,
    nextLevelAt: next,
    pct: Math.max(0, Math.min(1, current / next)),
  };
}
