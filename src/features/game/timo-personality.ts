import {
  INTERLUDES_LATE,
  INTERLUDES_MID,
  QUESTION_PREFIX_EARLY_CRAZY,
  QUESTION_PREFIX_EARLY_FUNNY,
  QUESTION_PREFIX_EARLY_NORMAL,
  QUESTION_PREFIX_LATE_CRAZY,
  QUESTION_PREFIX_LATE_FUNNY,
  QUESTION_PREFIX_LATE_NORMAL,
  QUESTION_PREFIX_MID_CRAZY,
  QUESTION_PREFIX_MID_FUNNY,
  QUESTION_PREFIX_MID_NORMAL,
  QUESTION_PREFIX_START_CRAZY,
  QUESTION_PREFIX_START_FUNNY,
  QUESTION_PREFIX_START_NORMAL,
} from '@/data/timo-lines';

type Mood = 'normal' | 'funny' | 'crazy';
type Phase = 'start' | 'early' | 'mid' | 'late';

const PHASE_POOLS: Record<Phase, Record<Mood, string[]>> = {
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

function phaseFor(questionsAsked: number): Phase {
  if (questionsAsked === 0) return 'start';
  if (questionsAsked < 3) return 'early';
  if (questionsAsked < 8) return 'mid';
  return 'late';
}

/** Proporcje docelowe: 70/20/10 (normal/funny/crazy). */
function pickMood(): Mood {
  const r = Math.random();
  if (r < 0.7) return 'normal';
  if (r < 0.9) return 'funny';
  return 'crazy';
}

/* ===== Anti-repetycja — pamięć ostatnio użytych ===== */
const RECENT_PREFIXES: string[] = [];
const RECENT_INTERLUDES: string[] = [];
const MAX_RECENT = 3;

function pickFreshRandom(arr: string[], recent: string[]): string {
  if (arr.length === 0) return '';
  const fresh = arr.filter((s) => !recent.includes(s));
  const pool = fresh.length > 0 ? fresh : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function remember(stack: string[], val: string) {
  if (val.length === 0) return; // pustego nie pamiętamy
  stack.push(val);
  if (stack.length > MAX_RECENT) stack.shift();
}

/**
 * Reset pamięci (np. między partiami).
 */
export function resetPersonalityMemory() {
  RECENT_PREFIXES.length = 0;
  RECENT_INTERLUDES.length = 0;
}

/**
 * Globalna szansa na DODANIE prefixu wg fazy gry.
 * Reszta pytań idzie czysto (bez prefixu).
 */
const PREFIX_CHANCE: Record<Phase, number> = {
  start: 0.15,
  early: 0.25,
  mid: 0.35,
  late: 0.45,
};

/** Szansa na DODANIE interlude wg fazy. */
const INTERLUDE_CHANCE: Record<Phase, number> = {
  start: 0,
  early: 0,
  mid: 0.1,
  late: 0.15,
};

/**
 * Dekoruje pytanie tekstem osobowości.
 *
 * Zasady:
 * 1. Globalny rate per faza decyduje czy w ogóle dodać prefix (większość pytań = czyste).
 * 2. Interlude tylko od MID, bardzo rzadko (10% MID, 15% LATE).
 * 3. Gdy włączony interlude, prefix musi być neutralny (żadnych podwójnych "Lisi nos…").
 * 4. Anti-repetycja: nie używaj prefiksu/interlude z ostatnich 3 wystąpień.
 * 5. Lowercase pierwszej litery pytania po `,` `:` `—` `…`.
 */
export function decorateQuestion(
  text: string,
  questionsAsked: number
): string {
  const phase = phaseFor(questionsAsked);

  // (1) Decyzja interlude (tylko MID/LATE)
  let interlude = '';
  if (Math.random() < INTERLUDE_CHANCE[phase]) {
    const pool = phase === 'late' ? INTERLUDES_LATE : INTERLUDES_MID;
    interlude = pickFreshRandom(pool, RECENT_INTERLUDES);
    remember(RECENT_INTERLUDES, interlude);
  }

  // (2) Decyzja prefix
  let prefix = '';
  if (interlude.length > 0) {
    // Interlude jest — prefix MUSI być neutralny, żeby uniknąć podwójnego flavor
    // Z 50% szans dorzucamy mały neutral typu "Hmm,"; inaczej pusty.
    if (Math.random() < 0.5) {
      // Filtrujemy puste żeby na pewno coś dodać krótkiego
      const neutralPool = PHASE_POOLS[phase].normal.filter((s) => s.length > 0);
      prefix = pickFreshRandom(neutralPool, RECENT_PREFIXES);
      remember(RECENT_PREFIXES, prefix);
    }
  } else {
    // Brak interlude — sprawdź czy w ogóle dodawać prefix.
    if (Math.random() < PREFIX_CHANCE[phase]) {
      const mood: Mood = pickMood();
      // Filtruj puste — gdy zdecydowaliśmy że chcemy prefix, ma być widoczny
      const pool = PHASE_POOLS[phase][mood].filter((s) => s.length > 0);
      if (pool.length > 0) {
        prefix = pickFreshRandom(pool, RECENT_PREFIXES);
        remember(RECENT_PREFIXES, prefix);
      }
    }
  }

  // (3) Lowercase po znakach kończących wstęp
  const trimmed = prefix.trimEnd();
  const endsWithSeparator =
    trimmed.length > 0 &&
    (trimmed.endsWith(',') ||
      trimmed.endsWith(':') ||
      trimmed.endsWith('—') ||
      trimmed.endsWith('…'));
  const needsLowercase =
    endsWithSeparator && /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(text);
  const adjustedText = needsLowercase
    ? text.charAt(0).toLowerCase() + text.slice(1)
    : text;

  return `${interlude}${prefix}${adjustedText}`;
}
