import { scoredEligible } from '@/features/game/guessing-engine';
import type { Animal, AnswerType, AttributeKey, Question } from '@/types/game';

type EngineState = {
  candidates: Animal[];
  usedAttributes: Set<AttributeKey>;
  excludedAnimals: Set<string>;
  questionsAsked: number;
};

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

function top5(state: EngineState, answers: Parameters<typeof scoredEligible>[1]): string {
  const scored = scoredEligible(state, answers).slice(0, 5);
  if (scored.length === 0) return '(brak)';
  return scored
    .map((s, i) => `${i + 1}.${s.animal.name_pl}(${s.score.toFixed(1)})`)
    .join(' · ');
}

export function logStart(state: EngineState) {
  if (!__DEV__) return;
  buffer.length = 0;
  push(`🦊  NOWA GRA  ·  pula: ${state.candidates.length}`);
}

export function logAnswer(
  question: Question,
  answer: AnswerType,
  before: EngineState,
  after: EngineState,
  answers: Parameters<typeof scoredEligible>[1]
) {
  if (!__DEV__) return;
  const beforeCount = before.candidates.filter((a) => !before.excludedAnimals.has(a.id)).length;
  const afterCount = after.candidates.filter((a) => !after.excludedAnimals.has(a.id)).length;
  const tag = answer.toUpperCase().padEnd(4);
  push(
    `Q${after.questionsAsked.toString().padStart(2, ' ')} [${tag}] „${question.text_pl}"  (${beforeCount}→${afterCount})`
  );
  push(`     TOP: ${top5(after, answers)}`);
}

export function logGuessAttempt(
  guess: Animal | null,
  state: EngineState,
  answers: Parameters<typeof scoredEligible>[1]
) {
  if (!__DEV__) return;
  if (!guess) return;
  push(`🎯  STRZAŁ: ${guess.emoji} ${guess.name_pl}   (TOP: ${top5(state, answers)})`);
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
}

export function logGiveUp(state: EngineState) {
  if (!__DEV__) return;
  const remaining = state.candidates.filter((a) => !state.excludedAnimals.has(a.id)).length;
  const qN = questionCount();
  const gN = guessCount();
  push(`🏳️  PODDAJĘ SIĘ po ${state.questionsAsked} pyt. Pozostało: ${remaining}`);
  push(`     SUMMARY: pytań=${qN}, strzałów=${gN}, wynik=LOSS`);
  flush();
}
