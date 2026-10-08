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
  logAsked,
  logGiveUp,
  logGuessAccepted,
  logGuessAttempt,
  logGuessRejected,
  logStart,
} from '@/features/game/game-log';
import { pickOutsideCategoryLine } from '@/data/timo-lines';
import { FREE_ANIMAL_IDS } from '@/config/free-tier';
import { isPremiumNow } from '@/lib/purchases';
import {
  eligibleCandidates,
  heatLevel,
  plausibleCount,
  type EngineState,
  MAX_QUESTIONS,
  pickBestGuess,
  pickNextQuestion,
  shouldAttemptGuess,
  shouldGiveUp,
} from '@/features/game/guessing-engine';
import {
  decorateQuestion,
  resetPersonalityMemory,
  type DecoratedQuestion,
} from '@/features/game/timo-personality';
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
  /** Co Timo mówi przy bieżącym pytaniu (wstęp + pytanie) — dymek i głos. */
  prompt: DecoratedQuestion | null;
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
   * Flaga: w guided pula 18 została wyczerpana i silnik rozszerzył pulę
   * (dziecko myślało o zwierzęciu spoza kart inspiracji). Następne pytanie
   * dostaje komunikat „spoza wyprawy” jako wstęp — raz na grę.
   */
  didEscapeCategory: boolean;
  /** Komunikat „spoza wyprawy” już padł w tej grze. */
  escapeAnnounced: boolean;
  /**
   * Waga startowa per zwierzę. W wyprawie z Timo 18 kart ma 1, a reszta
   * tematycznej puli mało — dziecko może pomyśleć o czymś spoza kart, ale
   * silnik najpierw szuka wśród nich. Brak = równe szanse.
   */
  priors: Record<string, number> | undefined;

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

/**
 * Składa wypowiedź Timo dla nowego pytania. Komunikat „spoza wyprawy” trafia
 * do pierwszego pytania po ucieczce z puli (guided), tylko raz na grę.
 */
function buildPrompt(
  question: Question | null,
  engine: EngineState,
  answers: GameAnswer[],
  opts: { announceEscape: boolean },
): DecoratedQuestion | null {
  if (!question) return null;
  const prompt = decorateQuestion(question, {
    questionsAsked: engine.questionsAsked,
    heat: heatLevel(engine, answers),
    outside: opts.announceEscape ? pickOutsideCategoryLine() : null,
  });
  logAsked(question, prompt, engine, answers);
  return prompt;
}

/** Waga startowa zwierząt spoza 18 kart wyprawy z Timo. */
const OUTSIDE_CARDS_PRIOR = 0.06;

function engineOf(state: GameState): EngineState {
  return {
    candidates: state.candidates,
    usedAttributes: state.usedAttributes,
    excludedAnimals: state.excludedAnimals,
    questionsAsked: state.questionsAsked,
    priors: state.priors,
  };
}

/**
 * „Spoza wyprawy” w wyprawie z Timo: lider nie jest już żadną z 18 kart.
 * Komunikat pada raz na grę, jako wstęp do następnego pytania.
 */
function escapeUpdate(
  state: GameState,
  engine: EngineState,
  answers: GameAnswer[],
): { didEscape: boolean; announce: boolean } {
  if (state.expeditionMode !== 'guided' || !state.expeditionBasePool) {
    return { didEscape: state.didEscapeCategory, announce: false };
  }
  const leader = pickBestGuess(engine, answers);
  const outside = !!leader && !state.expeditionBasePool.some((a) => a.id === leader.id);
  const didEscape = state.didEscapeCategory || outside;
  return { didEscape, announce: didEscape && !state.escapeAnnounced };
}

export const useGameStore = create<GameState>((set, get) => ({
  candidates: ANIMALS,
  usedAttributes: new Set(),
  excludedAnimals: new Set(),
  answers: [],
  currentQuestion: initialQuestion(),
  prompt: null,
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
  escapeAnnounced: false,
  priors: undefined,

  start: (opts) => {
    resetPersonalityMemory();
    // Free play: bez mitycznych stworzeń (smoki/dinozaury/jednorożce trafiają
    // tylko do wyprawy 'mythical' — żeby losowy "zgadnij zwierzę" pozostał realny).
    const mythicalIds = new Set(EXPEDITIONS_BY_ID.mythical?.roster ?? []);
    let candidates: Animal[] = ANIMALS.filter((a) => !mythicalIds.has(a.id));
    // Wersja darmowa: gra swobodna tylko na zwierzętach z darmowych krain —
    // te same, które dziecko widzi na ekranie przed grą (free-intro).
    if (!opts?.expeditionId && !isPremiumNow()) {
      candidates = candidates.filter((a) => FREE_ANIMAL_IDS.has(a.id));
    }
    let mode: GameMode = 'free';
    let expeditionId: string | null = null;
    let expeditionBasePool: Animal[] | null = null;
    let expeditionMode: 'guided' | 'expert' | null = null;
    let priors: Record<string, number> | undefined;

    if (opts?.expeditionId) {
      const exp = EXPEDITIONS_BY_ID[opts.expeditionId];
      if (exp) {
        expeditionMode = opts.expeditionMode ?? exp.mode ?? 'expert';
        expeditionBasePool = expeditionPool(exp.id);
        mode = 'expedition';
        expeditionId = opts.expeditionId;
        if (expeditionMode === 'guided') {
          // 18 kart to najpewniejsi kandydaci, ale nie jedyni: dziecko wolno
          // pomyśleć o czymś spoza kart. Zamiast resetu po wyczerpaniu kart
          // cała tematyczna pula jest w grze od początku, z niską wagą.
          const expansion = expeditionExpansionPool(exp.id);
          candidates = expansion.length > 0 ? expansion : candidates;
          const cards = new Set(expeditionBasePool.map((a) => a.id));
          priors = Object.fromEntries(candidates.map((a) => [a.id, cards.has(a.id) ? 1 : OUTSIDE_CARDS_PRIOR]));
        } else {
          // Klasyczna wyprawa: tylko jej roster.
          candidates = expeditionBasePool;
        }
      }
    }

    const excluded = new Set<string>(opts?.excludeDiscovered ?? []);
    const baseEngine: EngineState = {
      candidates,
      usedAttributes: new Set<AttributeKey>(),
      excludedAnimals: excluded,
      questionsAsked: 0,
      priors,
    };

    logStart(baseEngine);
    const firstQuestion = pickNextQuestion(baseEngine, [], QUESTIONS);
    set({
      candidates,
      usedAttributes: new Set(),
      excludedAnimals: excluded,
      answers: [],
      currentQuestion: firstQuestion,
      prompt: buildPrompt(firstQuestion, baseEngine, [], { announceEscape: false }),
      guess: null,
      phase: 'asking',
      questionsAsked: 0,
      guessAttempts: 0,
      mode,
      expeditionId,
      expeditionBasePool,
      expeditionMode,
      didEscapeCategory: false,
      escapeAnnounced: false,
      priors,
    });
  },

  answer: (a: AnswerType) => {
    const state = get();
    if (state.phase !== 'asking' || !state.currentQuestion) return;

    const q = state.currentQuestion;
    const before = engineOf(state);
    const nextUsed = new Set(state.usedAttributes);
    nextUsed.add(q.attribute_key);
    const nextAsked = state.questionsAsked + 1;
    const engineState: EngineState = { ...before, usedAttributes: nextUsed, questionsAsked: nextAsked };

    const withoutCount: GameAnswer = {
      question_id: q.id,
      attribute_key: q.attribute_key,
      answer: a,
      remaining_candidates: 0,
    };
    const provisional = [...state.answers, withoutCount];
    const nextAnswers: GameAnswer[] = [
      ...state.answers,
      { ...withoutCount, remaining_candidates: plausibleCount(engineState, provisional) },
    ];

    logAnswer(q, a, before, engineState, state.answers, nextAnswers);

    // 1) Limit pytań → ostatnia szansa: strzał w lidera. Wcześniej Timo
    //    poddawał się z gotową listą (np. pies 6%, świnia 5%), nie próbując.
    //    Po pudle przy limicie `rejectGuess` kończy grę.
    if (nextAsked >= MAX_QUESTIONS) {
      const guess = pickBestGuess(engineState, nextAnswers);
      if (guess) logGuessAttempt(guess, engineState, nextAnswers);
      else logGiveUp(engineState, nextAnswers);
      set({
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        prompt: null,
        guess,
        phase: guess ? 'guess_attempt' : 'child_stumped',
        guessAttempts: state.guessAttempts + (guess ? 1 : 0),
      });
      return;
    }

    // 2) Pora na strzał
    if (shouldAttemptGuess(engineState, nextAnswers, QUESTIONS)) {
      const guess = pickBestGuess(engineState, nextAnswers);
      logGuessAttempt(guess, engineState, nextAnswers);
      set({
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        prompt: null,
        guess,
        phase: guess ? 'guess_attempt' : 'child_stumped',
        guessAttempts: state.guessAttempts + (guess ? 1 : 0),
      });
      return;
    }

    // 3) Następne pytanie; gdy pytań brak — ostatni strzał
    const nextQuestion = pickNextQuestion(engineState, nextAnswers, QUESTIONS);
    if (!nextQuestion) {
      const guess = pickBestGuess(engineState, nextAnswers);
      logGuessAttempt(guess, engineState, nextAnswers);
      set({
        usedAttributes: nextUsed,
        answers: nextAnswers,
        questionsAsked: nextAsked,
        currentQuestion: null,
        prompt: null,
        guess,
        phase: guess ? 'guess_attempt' : 'child_stumped',
        guessAttempts: state.guessAttempts + (guess ? 1 : 0),
      });
      return;
    }

    const escape = escapeUpdate(state, engineState, nextAnswers);
    set({
      usedAttributes: nextUsed,
      answers: nextAnswers,
      questionsAsked: nextAsked,
      currentQuestion: nextQuestion,
      prompt: buildPrompt(nextQuestion, engineState, nextAnswers, { announceEscape: escape.announce }),
      phase: 'asking',
      didEscapeCategory: escape.didEscape,
      escapeAnnounced: state.escapeAnnounced || escape.announce,
    });
  },

  acceptGuess: () => {
    logGuessAccepted(get().guess);
    set({ phase: 'timo_guessed' });
  },

  rejectGuess: () => {
    const state = get();
    if (!state.guess) return;

    // Jedyne trwałe wykluczenie w grze: zwierzę, w które Timo spudłował.
    // Reszta zostaje w pamięci odpowiedzi — nie ma już resetu puli.
    const nextExcluded = new Set(state.excludedAnimals);
    nextExcluded.add(state.guess.id);
    const engineState: EngineState = { ...engineOf(state), excludedAnimals: nextExcluded };

    logGuessRejected(state.guess, plausibleCount(engineState, state.answers));

    if (state.questionsAsked >= MAX_QUESTIONS || eligibleCandidates(engineState).length === 0) {
      logGiveUp(engineState, state.answers);
      set({ excludedAnimals: nextExcluded, guess: null, phase: 'child_stumped' });
      return;
    }

    const nextQuestion = pickNextQuestion(engineState, state.answers, QUESTIONS);
    if (!nextQuestion) {
      const newGuess = pickBestGuess(engineState, state.answers);
      logGuessAttempt(newGuess, engineState, state.answers);
      set({
        excludedAnimals: nextExcluded,
        guess: newGuess,
        phase: newGuess ? 'guess_attempt' : 'child_stumped',
        guessAttempts: state.guessAttempts + (newGuess ? 1 : 0),
      });
      return;
    }

    const escape = escapeUpdate(state, engineState, state.answers);
    set({
      excludedAnimals: nextExcluded,
      guess: null,
      currentQuestion: nextQuestion,
      prompt: buildPrompt(nextQuestion, engineState, state.answers, { announceEscape: escape.announce }),
      phase: 'asking',
      didEscapeCategory: escape.didEscape,
      escapeAnnounced: state.escapeAnnounced || escape.announce,
    });
  },

  reset: () => {
    get().start();
  },
}));

// Helper for screens
export function remainingCandidatesCount(state: GameState): number {
  return plausibleCount(engineOf(state), state.answers);
}
