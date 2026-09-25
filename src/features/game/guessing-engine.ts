import { popularityOf } from '@/features/game/popularity';
import type {
  Animal,
  AnswerType,
  AttributeKey,
  GameAnswer,
  Question,
} from '@/types/game';

/** Hard limit pytań o atrybuty — po tylu Timo się poddaje */
export const MAX_QUESTIONS = 20;
/** Nie próbuj zgadywać zanim minie tyle pytań (chyba że został tylko 1 kandydat) */
export const MIN_QUESTIONS_BEFORE_GUESS = 4;
/** Confidence gap (top-1 score − top-2 score) wystarczający, żeby ryzykować strzał */
export const GUESS_SCORE_GAP = 3;
/** Wymuś strzał gdy zostało tyle eligible kandydatów (nawet jeśli brak score gap) */
export const FORCED_GUESS_POOL = 3;
/** Po tylu pytaniach Timo zaczyna desperować — strzela nawet bez gap, jeśli pool ≤8 */
export const DESPERATE_AFTER = 13;

export type EngineState = {
  candidates: Animal[];
  usedAttributes: Set<AttributeKey>;
  questionsAsked: number;
  excludedAnimals: Set<string>;
};

export function eligibleCandidates(state: EngineState): Animal[] {
  return state.candidates.filter((a) => !state.excludedAnimals.has(a.id));
}

/**
 * Score zwierzęcia względem dotychczasowych odpowiedzi gracza.
 * yes-true / no-false  = mocny match (+3)
 * null match (~zalezy) = lekka premia (+0.5)
 * 'hard' = "to zależy" — promuje zwierzęta z null na tym atrybucie (+2)
 *                       (Timo wie że szukamy czegoś z różnymi wariantami)
 * 'idk'  = "nie wiem"  — neutralne, brak premii
 * Popularity multiplier preferuje znane zwierzęta dla dzieci.
 */
export function scoreAnimal(animal: Animal, answers: GameAnswer[]): number {
  let raw = 0;
  for (const a of answers) {
    const v = animal.attributes[a.attribute_key];
    if (a.answer === 'yes') {
      if (v === true) raw += 3;
      else if (v === null) raw += 0.5;
    } else if (a.answer === 'no') {
      if (v === false) raw += 3;
      else if (v === null) raw += 0.5;
    } else if (a.answer === 'hard') {
      // "To zależy" → boost dla zwierząt z null na tym pytaniu
      if (v === null) raw += 2;
    }
    // 'idk' = neutralne
  }
  return raw * popularityOf(animal.id);
}

/** Posortowani eligible po score (malejąco). */
export function scoredEligible(
  state: EngineState,
  answers: GameAnswer[]
): Array<{ animal: Animal; score: number }> {
  const eligible = eligibleCandidates(state);
  return eligible
    .map((animal) => ({ animal, score: scoreAnimal(animal, answers) }))
    .sort((a, b) => b.score - a.score);
}

export function shouldGiveUp(state: EngineState): boolean {
  if (state.questionsAsked >= MAX_QUESTIONS) return true;
  if (eligibleCandidates(state).length === 0) return true;
  return false;
}

/**
 * Decyzja "czy strzelać" oparta o confidence gap między top-1 a top-2,
 * a nie sztywny interwał N pytań.
 */
export function shouldAttemptGuess(
  state: EngineState,
  answers: GameAnswer[]
): boolean {
  const eligible = eligibleCandidates(state);
  if (eligible.length === 0) return false;
  if (eligible.length === 1) return true;
  if (state.questionsAsked < MIN_QUESTIONS_BEFORE_GUESS) return false;

  // Mała pula → strzelaj
  if (eligible.length <= FORCED_GUESS_POOL) return true;

  const scored = scoredEligible(state, answers);
  const top = scored[0]?.score ?? 0;
  const second = scored[1]?.score ?? 0;
  const gap = top - second;

  // Confidence gap = lider znacząco wyprzedza
  if (gap >= GUESS_SCORE_GAP) return true;

  // Desperacja po wielu pytaniach
  if (state.questionsAsked >= DESPERATE_AFTER && eligible.length <= 8) return true;

  return false;
}

/**
 * Information gain — ALE liczone tylko po top-K eligible candidates.
 * Skupia tree na rozróżnianiu najbardziej prawdopodobnych zwierząt,
 * zamiast rozdzielać 330-elementową pulę gdzie 90% to dawno-odpadli kandydaci.
 */
export function pickNextQuestion(
  state: EngineState,
  answers: GameAnswer[],
  pool: Question[]
): Question | null {
  const remaining = pool.filter((q) => !state.usedAttributes.has(q.attribute_key));
  if (remaining.length === 0) return null;

  const scored = scoredEligible(state, answers);
  if (scored.length === 0) return null;

  // Early game = pełna pula (broad classification: ssak/ptak/ryba…)
  // Mid game  = top-30 (zacieśniamy się na realnych kandydatach)
  // Late game = top-15 (tylko najbardziej prawdopodobni)
  const focusSize =
    state.questionsAsked < 2
      ? scored.length
      : state.questionsAsked < 5
        ? 30
        : 15;
  const focusGroup = scored
    .slice(0, Math.min(focusSize, scored.length))
    .map((s) => s.animal);

  const questionScored = remaining.map((q) => {
    let yes = 0;
    let no = 0;
    for (const animal of focusGroup) {
      const v = animal.attributes[q.attribute_key];
      if (v === true) yes++;
      else if (v === false) no++;
    }
    const ambiguous = focusGroup.length - yes - no;
    // 50/50 → najlepsze. Ambiguous (null) — lekka kara
    const score = Math.abs(yes - no) + ambiguous * 0.7;
    return { q, score };
  });

  questionScored.sort((a, b) => a.score - b.score);
  // Wczesna gra = większy random pool, żeby kolejne starty były różne;
  // późniejsze pytania = węższy top, bo precyzja ważniejsza.
  const randomPoolSize =
    state.questionsAsked === 0
      ? 5
      : state.questionsAsked < 3
        ? 3
        : 2;
  const topK = questionScored.slice(
    0,
    Math.min(randomPoolSize, questionScored.length)
  );
  return topK[Math.floor(Math.random() * topK.length)].q;
}

export function applyAnswer(
  candidates: Animal[],
  attribute_key: AttributeKey,
  answer: AnswerType
): Animal[] {
  if (answer === 'idk' || answer === 'hard') return candidates;
  const expected = answer === 'yes';
  return candidates.filter((animal) => {
    const v = animal.attributes[attribute_key];
    if (v === null || v === undefined) return true;
    return v === expected;
  });
}

/**
 * Najlepszy strzał — top kandydat po score.
 * Random tylko gdy 1+ tied na max score.
 */
export function pickBestGuess(
  state: EngineState,
  answers: GameAnswer[] = []
): Animal | null {
  const scored = scoredEligible(state, answers);
  if (scored.length === 0) return null;
  if (scored.length === 1) return scored[0].animal;

  const maxScore = scored[0].score;
  const ties = scored.filter((s) => s.score >= maxScore - 0.01);
  return ties[Math.floor(Math.random() * ties.length)].animal;
}

/** Poziom „ciepło–zimno” — jak blisko rozwiązania jest silnik. */
export type HeatLevel = 'cold' | 'warm' | 'hot';

/** Pula, przy której robi się „ciepło”. */
export const HEAT_WARM_POOL = 30;
/** Pula, przy której robi się „gorąco”. */
export const HEAT_HOT_POOL = 5;

/**
 * Liczone z liczby pozostałych kandydatów, a nie z numeru pytania — Timo mówi
 * „gorąco” dopiero wtedy, gdy naprawdę zostało niewielu. Minimalna liczba
 * pytań chroni wyprawy z małą pulą (18 kart) przed „ciepło” już po Q1.
 */
export function heatLevel(state: EngineState): HeatLevel {
  const eligible = eligibleCandidates(state).length;
  if (eligible <= HEAT_HOT_POOL && state.questionsAsked >= MIN_QUESTIONS_BEFORE_GUESS - 1) {
    return 'hot';
  }
  if (eligible <= HEAT_WARM_POOL && state.questionsAsked >= 2) return 'warm';
  return 'cold';
}
