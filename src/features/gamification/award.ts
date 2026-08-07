import { BADGES, type BadgeDef } from '@/data/badges';

export type AwardInput = {
  won: boolean;
  questionsAsked: number;
  animalId: string | null;
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
};

const PAWS_BASE = 20;
const PAWS_LOSS = 5;
const XP_WIN = 50;
const XP_LOSS = 15;
const PAWS_FIRST_DISCOVERY = 10;
const XP_FIRST_DISCOVERY = 25;
const PAWS_STREAK_BONUS = 5;

/** ≤4 pytań → ×2; 5–9 → ×1.5; ≥10 → ×1 */
function speedMultiplier(questionsAsked: number): number {
  if (questionsAsked <= 4) return 2;
  if (questionsAsked <= 9) return 1.5;
  return 1;
}

export function awardRound(input: AwardInput): AwardOutput {
  const { won, questionsAsked, animalId, streak, collection, badges } = input;

  const isFirstDiscovery =
    won && animalId !== null && !collection.includes(animalId);

  // Tropy — base × multiplier + bonusy
  let pawsDelta = won
    ? Math.round(PAWS_BASE * speedMultiplier(questionsAsked))
    : PAWS_LOSS;

  // XP — base + bonusy
  let xpDelta = won ? XP_WIN : XP_LOSS;

  if (isFirstDiscovery) {
    pawsDelta += PAWS_FIRST_DISCOVERY;
    xpDelta += XP_FIRST_DISCOVERY;
  }

  const nextStreak = won ? streak + 1 : 0;

  if (won && nextStreak >= 3) {
    pawsDelta += PAWS_STREAK_BONUS;
  }

  const nextCollection =
    won && animalId && !collection.includes(animalId)
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

  tryUnlock('first_win', won);
  tryUnlock('first_loss', !won);
  tryUnlock('streak_3', nextStreak >= 3);
  tryUnlock('streak_5', nextStreak >= 5);
  tryUnlock('streak_10', nextStreak >= 10);
  tryUnlock('collector_5', nextCollection.length >= 5);
  tryUnlock('collector_10', nextCollection.length >= 10);
  tryUnlock('collector_25', nextCollection.length >= 25);
  tryUnlock('collector_50', nextCollection.length >= 50);
  tryUnlock('collector_100', nextCollection.length >= 100);
  tryUnlock('fast_thinker', won && questionsAsked <= 4);

  return {
    pawsDelta,
    starsDelta: 0,
    xpDelta,
    nextStreak,
    nextCollection,
    nextBadges: Array.from(unlockedIds),
    newBadges,
    isFirstDiscovery,
  };
}

/* ===== XP curve & levels ===== */

/** XP needed within level N to reach N+1. n>=1. */
export function xpForLevel(n: number): number {
  return 50 + 50 * (n - 1);
}

/** Total cumulative XP needed to reach level n (n=1 means 0). */
export function totalXpToReach(n: number): number {
  if (n <= 1) return 0;
  // Sum of arithmetic series: xpForLevel(1)+...+xpForLevel(n-1)
  // = sum_{k=1}^{n-1} (50 + 50*(k-1)) = 50*(n-1) + 50*(n-1)*(n-2)/2
  //   = 25 * (n-1) * (n)  →  25*n*(n-1)
  return 25 * n * (n - 1);
}

export function levelFromXp(xp: number): number {
  if (xp < 50) return 1;
  // Solve 25*n*(n-1) <= xp  →  n^2 - n - xp/25 <= 0  →  n = (1+sqrt(1+xp/6.25))/2
  // Use iterative approach for safety with integer math.
  let n = 1;
  while (totalXpToReach(n + 1) <= xp) n += 1;
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
  return {
    current,
    nextLevelAt: next,
    pct: Math.max(0, Math.min(1, current / next)),
  };
}
