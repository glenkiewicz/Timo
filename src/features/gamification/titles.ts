/**
 * Ranga i stopień — każdy poziom ma własną, konkretną etykietę.
 *
 * Wcześniej siedem tytułów rozciągało się na 25 poziomów, więc poziomy 5, 6 i 7
 * nazywały się tak samo („Detektyw") i awans zwykle nic nie zmieniał w nazwie.
 * Teraz dwanaście rang po siedem stopni pokrywa 84 poziomy: gracz jest
 * „Detektywem 3", a nie po prostu „Detektywem”.
 *
 * Podział na rangę i stopień jest celowy. Stopień zmienia się 84 razy w całej
 * grze, ranga tylko 12 — dzięki temu ekran awansu ma co stopniować: zwykłe
 * konfetti przy stopniu, mocniejsze przy nowej randze.
 */

/** Ile poziomów przypada na jedną rangę. */
export const STEPS_PER_RANK = 7;

/** Nazwy rang, od pierwszej do ostatniej. */
export const RANKS: string[] = [
  'Mały tropiciel',
  'Zwiadowca',
  'Odkrywca',
  'Czytacz śladów',
  'Detektyw',
  'Badacz polany',
  'Mistrz polany',
  'Strażnik lasu',
  'Lisi mędrzec',
  'Znawca zwierząt',
  'Legenda lasu',
  'Profesor Timo',
];

/** Najwyższy poziom w grze — 12 rang × 7 stopni. */
export const MAX_LEVEL = RANKS.length * STEPS_PER_RANK;

function clampLevel(level: number): number {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
}

/** Numer rangi (1–12) dla poziomu. */
export function rankIndexFor(level: number): number {
  return Math.floor((clampLevel(level) - 1) / STEPS_PER_RANK) + 1;
}

/** Nazwa rangi, bez stopnia — np. „Detektyw”. */
export function rankNameFor(level: number): string {
  return RANKS[rankIndexFor(level) - 1];
}

/** Stopień w obrębie rangi (1–7). */
export function stepFor(level: number): number {
  return ((clampLevel(level) - 1) % STEPS_PER_RANK) + 1;
}

/**
 * Pełna etykieta poziomu — np. „Detektyw 3”.
 *
 * Ostatnia ranga nie dostaje numeru: „Profesor Timo 7” brzmiałoby jak kolejny
 * przystanek, a to koniec drabiny.
 */
export function titleFor(level: number): string {
  const lvl = clampLevel(level);
  if (lvl === MAX_LEVEL) return rankNameFor(lvl);
  return `${rankNameFor(lvl)} ${stepFor(lvl)}`;
}

/** Czy przejście między poziomami zmienia rangę, a nie tylko stopień. */
export function isRankUp(previousLevel: number, level: number): boolean {
  return rankIndexFor(level) > rankIndexFor(previousLevel);
}
