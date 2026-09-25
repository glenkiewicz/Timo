import { pickQuestionLine, questionLines } from '@/data/questions';
import {
  pickFromLines,
  pickHeatLine,
  pickReaction,
  pickShortReaction,
  pickWyglup,
  type Pick,
} from '@/data/timo-lines';
import type { HeatLevel } from '@/features/game/guessing-engine';
import type { AnswerType, Question } from '@/types/game';

/**
 * Osobowość Timo w trakcie gry: co mówi przed pytaniem i jak reaguje na odpowiedź.
 *
 * Wypowiedź = `[wstęp?] + rdzeń pytania`. Wstęp to zawsze zamknięte zdanie
 * („.” / „!”), więc sklejenie nie może się zepsuć. Wstępem jest jedno z:
 *   1. komunikat „spoza wyprawy” (guided, raz),
 *   2. „ciepło–zimno” — tylko przy wejściu na wyższy poziom,
 *   3. wygłup — maks. 1 na grę, Q3–Q6,
 *   4. setup z pytania — żart związany z tematem.
 *
 * Dawkowanie: nigdy dwa wstępy pod rząd, ale najwyżej 2 czyste pytania pod
 * rząd — średnio 3–4 żarty na grę.
 */

/** Szansa na setup, gdy nie jest wymuszony. */
const SETUP_CHANCE = 0.4;
/** Po tylu czystych pytaniach pod rząd następne dostaje wstęp na pewno. */
const MAX_PLAIN_IN_ROW = 2;
/** Szansa na wygłup w oknie Q3–Q6 (gdy wstęp i tak ma się pojawić). */
const WYGLUP_CHANCE = 0.5;
/** Okno wygłupu: questionsAsked (0 = Q1). */
const WYGLUP_FROM = 2;
const WYGLUP_TO = 5;
/** Szansa na reakcję z pytania (reszta — krótkie „Aha!”, „Notuję!”). */
const TOPICAL_REACTION_CHANCE = 0.6;

const HEAT_RANK: Record<HeatLevel, number> = { cold: 0, warm: 1, hot: 2 };

/* ===== Pamięć jednej partii ===== */
let plainInRow = 0;
let lastHadLead = false;
let wyglupUsed = false;
let announcedHeat: HeatLevel = 'cold';

/** Reset pamięci między partiami. */
export function resetPersonalityMemory() {
  plainInRow = 0;
  lastHadLead = false;
  wyglupUsed = false;
  announcedHeat = 'cold';
}

export type DecoratedQuestion = {
  /** Pełny tekst do dymka (wstęp + pytanie). */
  text: string;
  /** Sekwencja voiceKey w kolejności odtwarzania (do `timoVoice.playSequence`). */
  sequence: string[];
};

export type DecorateContext = {
  questionsAsked: number;
  heat: HeatLevel;
  /** Komunikat „spoza wyprawy” — gdy podany, zawsze staje się wstępem. */
  outside?: Pick | null;
};

function chooseLead(q: Question, ctx: DecorateContext): Pick | null {
  if (ctx.outside) return ctx.outside;

  // Ciepło–zimno tylko przy wejściu na wyższy poziom — nie powtarza się.
  if (HEAT_RANK[ctx.heat] > HEAT_RANK[announcedHeat]) {
    announcedHeat = ctx.heat;
    if (ctx.heat !== 'cold') return pickHeatLine(ctx.heat);
  }

  if (lastHadLead) return null;
  const forced = plainInRow >= MAX_PLAIN_IN_ROW;
  if (!forced && Math.random() >= SETUP_CHANCE) return null;

  const inWyglupWindow =
    ctx.questionsAsked >= WYGLUP_FROM && ctx.questionsAsked <= WYGLUP_TO;
  if (!wyglupUsed && inWyglupWindow && Math.random() < WYGLUP_CHANCE) {
    wyglupUsed = true;
    return pickWyglup();
  }
  return pickFromLines(`setup:${q.id}`, questionLines(q, 'setup'));
}

/** Składa wypowiedź Timo dla pytania. */
export function decorateQuestion(q: Question, ctx: DecorateContext): DecoratedQuestion {
  // Pierwsze pytanie zawsze w formie kanonicznej — „Czy twoje zwierzę…”
  // wprowadza podmiot, do którego odnoszą się krótsze wersje („Czy lata…”).
  const core =
    ctx.questionsAsked === 0 ? questionLines(q, 'core')[0] : pickQuestionLine(q, 'core');
  const lead = chooseLead(q, ctx);

  if (lead) {
    plainInRow = 0;
    lastHadLead = true;
    return { text: `${lead.text} ${core.text}`, sequence: [lead.voiceKey, core.voiceKey] };
  }
  plainInRow += 1;
  lastHadLead = false;
  return { text: core.text, sequence: [core.voiceKey] };
}

/** Reakcja Timo na odpowiedź dziecka. */
export function pickAnswerReaction(q: Question, answer: AnswerType): Pick {
  if (answer === 'idk' || answer === 'hard') return pickReaction(answer);
  if (Math.random() >= TOPICAL_REACTION_CHANCE) return pickShortReaction();
  const part = answer === 'yes' ? 'yes' : 'no';
  return pickFromLines(`${part}:${q.id}`, questionLines(q, part));
}
