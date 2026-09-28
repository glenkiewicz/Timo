import { plausibleCount, scoredEligible, type EngineState } from '@/features/game/guessing-engine';
import { DEV_LOG_QUESTIONS } from '@/config/features';
import type { DecoratedQuestion } from '@/features/game/timo-personality';
import type { Animal, AnswerType, AttributeKey, Question } from '@/types/game';

function eligibleCount(state: EngineState): number {
  return state.candidates.filter((a) => !state.excludedAnimals.has(a.id)).length;
}

const BANNER = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

/** Buffer of log lines for the current game — flushed at end of game. */
const buffer: string[] = [];

function push(line: string) {
  buffer.push(line);
}

function flush() {
  if (!__DEV__) return;
  if (buffer.length === 0) return;
  // Single multi-line emit so the whole partia comes out as one block.
  console.log(`\n${BANNER}\n${buffer.join('\n')}\n${BANNER}\n`);
  buffer.length = 0;
}

/**
 * Linia wypisywana OD RAZU, w trakcie gry — do śledzenia pytań na żywo.
 * Bufor powyżej wychodzi dopiero na końcu partii, a wtedy trudno połączyć
 * wpis z tym, co właśnie działo się na ekranie.
 */
function live(line: string) {
  if (!DEV_LOG_QUESTIONS) return;
  console.log(`[Timo] ${line}`);
}

const ANSWER_PL: Record<AnswerType, string> = {
  yes: 'TAK',
  no: 'NIE',
  idk: 'NIE WIEM',
  hard: 'TRUDNE',
};

/** Kandydaci „zgodni z tym, co wiemy” — pula już nie maleje przez filtr. */
function remaining(state: EngineState, answers: Parameters<typeof scoredEligible>[1]): number {
  return plausibleCount(state, answers);
}

/** Pytanie w chwili, gdy Timo je zadaje — z wstępem, tak jak słyszy dziecko. */
export function logAsked(
  question: Question,
  prompt: DecoratedQuestion,
  state: EngineState,
  answers: Parameters<typeof scoredEligible>[1]
) {
  if (!DEV_LOG_QUESTIONS) return;
  live(
    `Q${state.questionsAsked + 1} · ${question.id} (${question.attribute_key}) · pula ${remaining(state, answers)}\n` +
      `         „${prompt.text}”\n` +
      `         głos: ${prompt.sequence.join(' + ')}`
  );
}

function top5(state: EngineState, answers: Parameters<typeof scoredEligible>[1]): string {
  const scored = scoredEligible(state, answers).slice(0, 5);
  if (scored.length === 0) return '(brak)';
  return scored
    .map((s, i) => `${i + 1}.${s.animal.name_pl}(${s.score.toFixed(1)}%)`)
    .join(' · ');
}

export function logStart(state: EngineState) {
  if (!__DEV__) return;
  buffer.length = 0;
  push(`🦊  NOWA GRA  ·  pula: ${eligibleCount(state)}`);
  live(`──── NOWA GRA · pula ${eligibleCount(state)} ────`);
}

export function logAnswer(
  question: Question,
  answer: AnswerType,
  before: EngineState,
  after: EngineState,
  answersBefore: Parameters<typeof scoredEligible>[1],
  answers: Parameters<typeof scoredEligible>[1]
) {
  if (!__DEV__) return;
  const beforeCount = before.questionsAsked === 0 ? eligibleCount(before) : remaining(before, answersBefore);
  const afterCount = remaining(after, answers);
  const tag = answer.toUpperCase().padEnd(4);
  push(
    `Q${after.questionsAsked.toString().padStart(2, ' ')} [${tag}] „${question.core[0]}"  (${beforeCount}→${afterCount})`
  );
  push(`     TOP: ${top5(after, answers)}`);
  live(`   ↳ ${ANSWER_PL[answer]} · pula ${beforeCount}→${afterCount} · TOP: ${top5(after, answers)}`);
}

export function logGuessAttempt(
  guess: Animal | null,
  state: EngineState,
  answers: Parameters<typeof scoredEligible>[1]
) {
  if (!__DEV__) return;
  if (!guess) return;
  push(`🎯  STRZAŁ: ${guess.emoji} ${guess.name_pl}   (TOP: ${top5(state, answers)})`);
  live(`STRZAŁ: ${guess.name_pl} (${guess.id})`);
}

function questionCount(): number {
  // count lines starting with "Q "
  return buffer.filter((l) => /^Q\s*\d+\s\[/.test(l)).length;
}

function guessCount(): number {
  return buffer.filter((l) => l.startsWith('🎯')).length;
}

export function logGuessAccepted(guess: Animal | null) {
  if (!__DEV__) return;
  const qN = questionCount();
  const gN = guessCount();
  push(`✅  ZGADŁ! ${guess?.name_pl ?? '(brak)'}`);
  push(`     SUMMARY: pytań=${qN}, strzałów=${gN}, wynik=WIN`);
  flush();
}

export function logGuessRejected(guess: Animal | null, eligibleCount: number) {
  if (!__DEV__) return;
  push(`❌  pudło: ${guess?.name_pl ?? '(brak)'} → wyklucz. Zostało: ${eligibleCount}`);
  live(`   ↳ PUDŁO: ${guess?.name_pl ?? '(brak)'} · zostało ${eligibleCount}`);
}

export function logGiveUp(state: EngineState, answers: Parameters<typeof scoredEligible>[1]) {
  if (!__DEV__) return;
  const left = remaining(state, answers);
  const qN = questionCount();
  const gN = guessCount();
  push(`🏳️  PODDAJĘ SIĘ po ${state.questionsAsked} pyt. Pozostało: ${left}`);
  live(`PODDAJĘ SIĘ po ${state.questionsAsked} pyt. · TOP: ${top5(state, answers)}`);
  push(`     SUMMARY: pytań=${qN}, strzałów=${gN}, wynik=LOSS`);
  flush();
}
