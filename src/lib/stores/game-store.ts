import { create } from 'zustand';

import { ANIMALS } from '@/data/animals';
import {
  EXPEDITIONS_BY_ID,
  expeditionExpansionPool,
  expeditionPool,
} from '@/data/expeditions';
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
  /**
   * Tryb wyprawy:
   *  - 'guided' (Wyprawa z Timo) — mała pula 18 zwierząt = `inspirationRoster`,
   *    fallback rozszerza do całej ANIMALS gdy dziecko wybrało spoza puli.
   *  - 'expert' (klasyczna kategoria) — pula = pełny `roster`, fallback zostaje w roster.
   * Jeśli nieustawione, używana wartość z `EXPEDITIONS_BY_ID[expeditionId].mode` (back-compat).
   */
  expeditionMode?: 'guided' | 'expert';
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
  /** Tryb wyprawy ('guided' = Wyprawa z Timo, 'expert' = klasyczna). */
  expeditionMode: 'guided' | 'expert' | null;
  /**
   * Flaga: w guided pula 18 została wyczerpana i silnik rozszerzył do całej
   * ANIMALS (dziecko myślało o zwierzęciu spoza kart inspiracji). UI używa do
   * pokazania komunikatu "outside category" raz, potem kasuje flagę.
   */
  didEscapeCategory: boolean;

  start: (opts?: StartOpts) => void;
  answer: (a: AnswerType) => void;
  acceptGuess: () => void;
  rejectGuess: () => void;
  acknowledgeEscape: () => void;
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
  expeditionMode: null,
  didEscapeCategory: false,

  start: (opts) => {
    resetPersonalityMemory();
    // Free play: bez mitycznych stworzeń (smoki/dinozaury/jednorożce trafiają
    // tylko do wyprawy 'mythical' — żeby losowy "zgadnij zwierzę" pozostał realny).
    const mythicalIds = new Set(EXPEDITIONS_BY_ID.mythical?.roster ?? []);
    let candidates: Animal[] = ANIMALS.filter((a) => !mythicalIds.has(a.id));
    let mode: GameMode = 'free';
    let expeditionId: string | null = null;
    let expeditionBasePool: Animal[] | null = null;
    let expeditionMode: 'guided' | 'expert' | null = null;

    if (opts?.expeditionId) {
      const exp = EXPEDITIONS_BY_ID[opts.expeditionId];
      if (exp) {
        // expeditionPool() automatycznie wybiera inspirationRoster dla guided
        // lub roster dla expert.
        candidates = expeditionPool(exp.id);
        expeditionBasePool = candidates;
        expeditionMode = opts.expeditionMode ?? exp.mode ?? 'expert';
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
      expeditionMode,
      didEscapeCategory: false,
    });
  },

  acknowledgeEscape: () => set({ didEscapeCategory: false }),

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

    // 1b) Pula wyciśnięta do zera → relax. Zachowanie zależne od trybu:
    //  - guided  → rozszerz do unii rosterów pokrewnych expert wypraw
    //              (np. water_friends → ocean + freshwater). Last resort = ANIMALS.
    //              Trzymanie tematyki ratuje od pytań typu "Czy żyje w Afryce?"
    //              w wyprawie wodnej.
    //  - expert  → zostań w roster wyprawy (Matamata nie wpadnie do "owadów").
    //  - free    → cała ANIMALS.
    let workingCandidates = nextCandidates;
    let didEscape = false;
    if (eligibleCandidates(engineState).length === 0) {
      let fallback: Animal[];
      if (state.expeditionMode === 'guided' && state.expeditionId) {
        const themed = expeditionExpansionPool(state.expeditionId);
        fallback = themed.length > 0 ? themed : ANIMALS;
        didEscape = true;
      } else {
        fallback = state.expeditionBasePool ?? ANIMALS;
      }
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
        didEscapeCategory: state.didEscapeCategory || didEscape,
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
        didEscapeCategory: state.didEscapeCategory || didEscape,
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
      didEscapeCategory: state.didEscapeCategory || didEscape,
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

    // If we filtered ourselves into a corner (eligible=0), broaden:
    //  - guided  → tematyczny expansion pool (ocean+freshwater dla wodnych itp.)
    //  - expert  → expeditionBasePool (zostań w roster wyprawy)
    //  - free    → ANIMALS
    let workingState = engineState;
    let didEscape = false;
    if (eligibleAfterExclude === 0) {
      let fallback: Animal[];
      if (state.expeditionMode === 'guided' && state.expeditionId) {
        const themed = expeditionExpansionPool(state.expeditionId);
        fallback = themed.length > 0 ? themed : ANIMALS;
        didEscape = true;
      } else {
        fallback = state.expeditionBasePool ?? ANIMALS;
      }
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
        didEscapeCategory: state.didEscapeCategory || didEscape,
      });
      return;
    }

    set({
      candidates: workingState.candidates,
      excludedAnimals: nextExcluded,
      guess: null,
      currentQuestion: nextQuestion,
      phase: 'asking',
      didEscapeCategory: state.didEscapeCategory || didEscape,
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
