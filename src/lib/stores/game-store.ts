import { create } from 'zustand';

import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS_BY_ID, expeditionPool } from '@/data/expeditions';
import { QUESTIONS } from '@/data/questions';
import {
  logAnswer,
  logGiveUp,
  logGuessAccepted,
  logGuessAttempt,
  logGuessRejected,
  logStart,
} from '@/features/game/game-log';
import {
  applyAnswer,
  eligibleCandidates,
  MAX_QUESTIONS,
  pickBestGuess,
  pickNextQuestion,
  shouldAttemptGuess,
  shouldGiveUp,
} from '@/features/game/guessing-engine';
import { resetPersonalityMemory } from '@/features/game/timo-personality';
import type {
  Animal,
  AnswerType,
  AttributeKey,
  GameAnswer,
  GamePhase,
  Question,
} from '@/types/game';

export type GameMode = 'free' | 'expedition';

type StartOpts = {
  expeditionId?: string;
  /** animal ids already discovered in this expedition — excluded from pool */
  excludeDiscovered?: string[];
};

type GameState = {
  candidates: Animal[];
  usedAttributes: Set<AttributeKey>;
  excludedAnimals: Set<string>;
  answers: GameAnswer[];
  currentQuestion: Question | null;
  guess: Animal | null;
  phase: GamePhase;
  questionsAsked: number;
  guessAttempts: number;
  maxQuestions: number;
  mode: GameMode;
  expeditionId: string | null;
  /**
   * Pula bazowa wyprawy — kopia z momentu `start()`. Używana jako fallback
   * gdy filtr odpowiedzi ścinie eligible do zera (zamiast skakać do całej
   * ANIMALS i łamać tematykę). `null` w trybie free.
   */
  expeditionBasePool: Animal[] | null;

  start: (opts?: StartOpts) => void;
  answer: (a: AnswerType) => void;
  acceptGuess: () => void;
  rejectGuess: () => void;
  reset: () => void;
};

function initialEngineState(): {
  candidates: Animal[];
  usedAttributes: Set<AttributeKey>;
  excludedAnimals: Set<string>;
  questionsAsked: number;
} {
  return {
    candidates: ANIMALS,
    usedAttributes: new Set(),
    excludedAnimals: new Set(),
    questionsAsked: 0,
  };
}

function initialQuestion(): Question | null {
  return pickNextQuestion(initialEngineState(), [], QUESTIONS);
}

export const useGameStore = create<GameState>((set, get) => ({
  candidates: ANIMALS,
  usedAttributes: new Set(),
  excludedAnimals: new Set(),
  answers: [],
  currentQuestion: initialQuestion(),
  guess: null,
  phase: 'asking',
  questionsAsked: 0,
  guessAttempts: 0,
  maxQuestions: MAX_QUESTIONS,
  mode: 'free',
  expeditionId: null,
  expeditionBasePool: null,

  start: (opts) => {
    resetPersonalityMemory();
    // Free play: bez mitycznych stworzeń (smoki/dinozaury/jednorożce trafiają
    // tylko do wyprawy 'mythical' — żeby losowy "zgadnij zwierzę" pozostał realny).
    const mythicalIds = new Set(EXPEDITIONS_BY_ID.mythical?.roster ?? []);
    let candidates: Animal[] = ANIMALS.filter((a) => !mythicalIds.has(a.id));
    let mode: GameMode = 'free';
    let expeditionId: string | null = null;
    let expeditionBasePool: Animal[] | null = null;

    if (opts?.expeditionId) {
      const exp = EXPEDITIONS_BY_ID[opts.expeditionId];
      if (exp) {
        // W trybie wyprawy używamy jawnego rosteru wyprawy.
        candidates = expeditionPool(exp.id);
        expeditionBasePool = candidates;
        mode = 'expedition';
        expeditionId = opts.expeditionId;
      }
    }

    const excluded = new Set<string>(opts?.excludeDiscovered ?? []);
    const baseEngine = {
      candidates,
      usedAttributes: new Set<AttributeKey>(),
      excludedAnimals: excluded,
      questionsAsked: 0,
    };

    logStart(baseEngine);
    set({
      candidates,
      usedAttributes: new Set(),
      excludedAnimals: excluded,
      answers: [],
      currentQuestion: pickNextQuestion(baseEngine, [], QUESTIONS),
      guess: null,
      phase: 'asking',
      questionsAsked: 0,
      guessAttempts: 0,
      mode,
      expeditionId,
      expeditionBasePool,
    });
  },

  answer: (a: AnswerType) => {
    const state = get();
    if (state.phase !== 'asking' || !state.currentQuestion) return;

    const q = state.currentQuestion;
    const nextCandidates = applyAnswer(state.candidates, q.attribute_key, a);
    const nextUsed = new Set(state.usedAttributes);
    nextUsed.add(q.attribute_key);
    const nextAsked = state.questionsAsked + 1;

    const nextAnswers: GameAnswer[] = [
      ...state.answers,
      {
        question_id: q.id,
        attribute_key: q.attribute_key,
        answer: a,
        remaining_candidates: nextCandidates.length,
      },
    ];

    let engineState = {
      candidates: nextCandidates,
      usedAttributes: nextUsed,
      excludedAnimals: state.excludedAnimals,
      questionsAsked: nextAsked,
    };

    logAnswer(
      q,
      a,
      {
        candidates: state.candidates,
        usedAttributes: state.usedAttributes,
        excludedAnimals: state.excludedAnimals,
        questionsAsked: state.questionsAsked,
      },
      engineState,
      nextAnswers
    );

    // 1) Hard limit → Timo gives up
    if (nextAsked >= MAX_QUESTIONS) {
      logGiveUp(engineState);
      set({
        candidates: nextCandidates,
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        guess: null,
        phase: 'lost',
      });
      return;
    }

    // 1b) Pula wyciśnięta do zera przez odpowiedź → relax do bazowej puli wyprawy
    // (lub do całej ANIMALS w trybie free). W trybie wyprawy NIE wychodzimy poza
    // jej roster — Matamata nie ma prawa wpaść w "Świat owadów".
    let workingCandidates = nextCandidates;
    if (eligibleCandidates(engineState).length === 0) {
      const fallback = state.expeditionBasePool ?? ANIMALS;
      workingCandidates = fallback;
      engineState = {
        candidates: fallback,
        usedAttributes: nextUsed,
        excludedAnimals: state.excludedAnimals,
        questionsAsked: nextAsked,
      };
    }

    // 2) Time to try a guess
    if (shouldAttemptGuess(engineState, nextAnswers)) {
      const guess = pickBestGuess(engineState, nextAnswers);
      logGuessAttempt(guess, engineState, nextAnswers);
      set({
        candidates: workingCandidates,
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        guess,
        phase: guess ? 'guess_attempt' : 'lost',
        guessAttempts: state.guessAttempts + (guess ? 1 : 0),
      });
      return;
    }

    // 3) Pick next question
    const nextQuestion = pickNextQuestion(engineState, nextAnswers, QUESTIONS);
    if (!nextQuestion) {
      // out of questions → try one last guess
      const guess = pickBestGuess(engineState, nextAnswers);
      set({
        candidates: workingCandidates,
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        guess,
        phase: guess ? 'guess_attempt' : 'lost',
        guessAttempts: state.guessAttempts + (guess ? 1 : 0),
      });
      return;
    }

    set({
      candidates: workingCandidates,
      usedAttributes: nextUsed,
      answers: nextAnswers,
      questionsAsked: nextAsked,
      currentQuestion: nextQuestion,
      phase: 'asking',
    });
  },

  acceptGuess: () => {
    logGuessAccepted(get().guess);
    set({ phase: 'won' });
  },

  rejectGuess: () => {
    const state = get();
    if (!state.guess) return;

    const nextExcluded = new Set(state.excludedAnimals);
    nextExcluded.add(state.guess.id);

    const engineState = {
      candidates: state.candidates,
      usedAttributes: state.usedAttributes,
      excludedAnimals: nextExcluded,
      questionsAsked: state.questionsAsked,
    };

    const eligibleAfterExclude = eligibleCandidates(engineState).length;
    logGuessRejected(state.guess, eligibleAfterExclude);

    // give up only if hit hard limit; if pula=0 by exclusion, relax filter (revert last answer impact)
    if (state.questionsAsked >= MAX_QUESTIONS) {
      logGiveUp(engineState);
      set({
        excludedAnimals: nextExcluded,
        guess: null,
        phase: 'lost',
      });
      return;
    }

    // If we filtered ourselves into a corner (eligible=0), broaden by re-using
    // the expedition base pool (lub całej ANIMALS w trybie free) minus excluded.
    let workingState = engineState;
    if (eligibleAfterExclude === 0) {
      const fallback = state.expeditionBasePool ?? ANIMALS;
      workingState = {
        candidates: fallback,
        usedAttributes: state.usedAttributes,
        excludedAnimals: nextExcluded,
        questionsAsked: state.questionsAsked,
      };
    }

    const nextQuestion = pickNextQuestion(workingState, state.answers, QUESTIONS);

    // Out of questions but still have eligible candidates → keep guessing
    if (!nextQuestion) {
      const newGuess = pickBestGuess(workingState, state.answers);
      logGuessAttempt(newGuess, workingState, state.answers);
      set({
        candidates: workingState.candidates,
        excludedAnimals: nextExcluded,
        guess: newGuess,
        phase: newGuess ? 'guess_attempt' : 'lost',
        guessAttempts: state.guessAttempts + (newGuess ? 1 : 0),
      });
      return;
    }

    set({
      candidates: workingState.candidates,
      excludedAnimals: nextExcluded,
      guess: null,
      currentQuestion: nextQuestion,
      phase: 'asking',
    });
  },

  reset: () => {
    get().start();
  },
}));

// Helper for screens
export function remainingCandidatesCount(state: GameState): number {
  return eligibleCandidates({
    candidates: state.candidates,
    usedAttributes: state.usedAttributes,
    excludedAnimals: state.excludedAnimals,
    questionsAsked: state.questionsAsked,
  }).length;
}
