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

export type DecoratedQuestion = {
  /** Pełny tekst pytania po dekoracji (interlude + prefix + variant). */
  text: string;
  /** Sekwencja voiceKey w kolejności odtwarzania (do `timoVoice.playSequence`). */
  sequence: string[];
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
 *
 * Zwraca też `sequence` voiceKey w kolejności [interlude?, prefix?, pytanie].
 */
export function decorateQuestion(
  question: { text: string; voiceKey: string },
  questionsAsked: number,
): DecoratedQuestion {
  const { text: questionText, voiceKey: questionVoiceKey } = question;
  const phase = phaseFor(questionsAsked);

  // (1) Decyzja interlude (tylko MID/LATE)
  let interlude = '';
  let interludeVoiceKey: string | undefined;
  if (Math.random() < INTERLUDE_CHANCE[phase]) {
    const pool = phase === 'late' ? INTERLUDES_LATE : INTERLUDES_MID;
    interlude = pickFreshRandom(pool, RECENT_INTERLUDES);
    if (interlude.length > 0) {
      const idx = pool.indexOf(interlude);
      interludeVoiceKey = `interlude.${phase}.${idx}`;
      remember(RECENT_INTERLUDES, interlude);
    }
  }

  // (2) Decyzja prefix
  let prefix = '';
  let prefixVoiceKey: string | undefined;
  if (interlude.length > 0) {
    if (Math.random() < 0.5) {
      const sourcePool = PHASE_POOLS[phase].normal;
      const neutralPool = sourcePool.filter((s) => s.length > 0);
      prefix = pickFreshRandom(neutralPool, RECENT_PREFIXES);
      if (prefix.length > 0) {
        const idx = sourcePool.indexOf(prefix);
        prefixVoiceKey = `prefix.${phase}.normal.${idx}`;
        remember(RECENT_PREFIXES, prefix);
      }
    }
  } else if (Math.random() < PREFIX_CHANCE[phase]) {
    const mood: Mood = pickMood();
    const sourcePool = PHASE_POOLS[phase][mood];
    const pool = sourcePool.filter((s) => s.length > 0);
    if (pool.length > 0) {
      prefix = pickFreshRandom(pool, RECENT_PREFIXES);
      if (prefix.length > 0) {
        const idx = sourcePool.indexOf(prefix);
        prefixVoiceKey = `prefix.${phase}.${mood}.${idx}`;
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
    endsWithSeparator && /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(questionText);
  const adjustedText = needsLowercase
    ? questionText.charAt(0).toLowerCase() + questionText.slice(1)
    : questionText;

  const text = `${interlude}${prefix}${adjustedText}`;

  const sequence: string[] = [];
  if (interludeVoiceKey) sequence.push(interludeVoiceKey);
  if (prefixVoiceKey) sequence.push(prefixVoiceKey);
  sequence.push(questionVoiceKey);

  return { text, sequence };
}
