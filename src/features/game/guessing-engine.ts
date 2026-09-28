import { popularityOf } from '@/features/game/popularity';
import type {
  Animal,
  AnswerType,
  AttributeKey,
  GameAnswer,
  Question,
} from '@/types/game';

/**
 * Silnik zgadywania — PAMIĘĆ zamiast filtra.
 *
 * Wcześniej każda odpowiedź była twardym filtrem: jedno „nie” wycinało
 * zwierzę na zawsze. Dzieci nie odpowiadają jak encyklopedia — krowa odpadła,
 * bo dziecko uznało, że krowa nie żyje „w grupie” — więc pula regularnie
 * spadała do zera. Wtedy silnik robił reset do całej bazy, prawie zapominając
 * odpowiedzi, i pytał np. o lodową krainę zaraz po „tak, żyje w Polsce”.
 *
 * Teraz każde zwierzę ma wagę: popularność × iloczyn wiarygodności
 * wszystkich odpowiedzi. Zgodna odpowiedź waży prawie 1, sprzeczna mało, ale
 * NIE zero — krowa z jedną „dziecięcą” pomyłką zostaje w grze, tylko niżej.
 * Nikt nie wypada, więc nie ma już resetu. Pytania wybiera oczekiwany zysk
 * informacji liczony po tych wagach: pytanie sprzeczne z tym, co już wiemy,
 * nic nie rozstrzyga, więc samo przestaje padać.
 *
 * Z puli trwale znikają tylko zwierzęta, w które Timo strzelił i spudłował.
 */

/** Hard limit pytań o atrybuty — po tylu Timo się poddaje */
export const MAX_QUESTIONS = 20;
/** Nie próbuj zgadywać zanim minie tyle pytań (chyba że Timo jest prawie pewny) */
export const MIN_QUESTIONS_BEFORE_GUESS = 4;
/** Po tylu pytaniach Timo zaczyna desperować — strzela przy niższej pewności */
export const DESPERATE_AFTER = 13;

/** Szansa, że dziecko odpowie „na odwrót” niż baza — domyślnie. */
const BASE_SLIP = 0.1;

/**
 * Pytania, przy których dzieci często mają inne zdanie niż encyklopedia:
 * „czy żyje w grupie” (krowa?), „czy jest szybkie”, „czy żyje w Polsce”.
 * Sprzeczność waży przy nich łagodniej. Pytania jednoznaczne („ma pióra?”,
 * „umie latać?”) zostają przy BASE_SLIP.
 */
const SLIP: Partial<Record<AttributeKey, number>> = {
  lives_in_groups: 0.3,
  is_fast: 0.3,
  is_dangerous: 0.3,
  is_nocturnal: 0.3,
  lives_in_forest: 0.3,
  lives_in_poland: 0.25,
  is_predator: 0.25,
  eats_plants: 0.25,
  has_tail: 0.25,
  is_venomous: 0.25,
  larger_than_dog: 0.2,
  smaller_than_cat: 0.2,
  lives_in_water: 0.2,
  lives_on_farm: 0.2,
  lives_at_home: 0.2,
  has_fur: 0.15,
  is_mammal: 0.15,
};

function slipOf(attr: AttributeKey): number {
  return SLIP[attr] ?? BASE_SLIP;
}

/**
 * Zwierzęta „zgodne z tym, co wiemy” — waga co najmniej taka część lidera.
 * Tę liczbę pokazuje log, ciepło–zimno i `remaining_candidates`.
 */
const PLAUSIBLE_RATIO = 0.25;

export type EngineState = {
  /** Cały zbiór, z którego Timo zgaduje. Nie kurczy się w trakcie gry. */
  candidates: Animal[];
  usedAttributes: Set<AttributeKey>;
  questionsAsked: number;
  /** Zwierzęta, w które Timo strzelił i spudłował — jedyne trwale wykluczone. */
  excludedAnimals: Set<string>;
  /**
   * Dodatkowa waga startowa per zwierzę (np. wyprawa z Timo: 18 kart = 1,
   * reszta tematycznej puli = mało). Brak wpisu = 1.
   */
  priors?: Record<string, number>;
};

export function eligibleCandidates(state: EngineState): Animal[] {
  return state.candidates.filter(
    (a) => !state.excludedAnimals.has(a.id) && (state.priors?.[a.id] ?? 1) > 0
  );
}

/** Jak bardzo odpowiedź pasuje do wartości atrybutu zwierzęcia (0–1). */
function answerLikelihood(v: boolean | null | undefined, answer: AnswerType, attr: AttributeKey): number {
  if (answer === 'idk') return 1;
  // „To zależy” — pasuje do zwierząt, u których naprawdę bywa różnie.
  if (answer === 'hard') return v === null || v === undefined ? 1 : 0.6;
  if (v === null || v === undefined) return 0.5;
  const s = slipOf(attr);
  return v === (answer === 'yes') ? 1 - s : s;
}

/** P(„tak”) dla zwierzęcia — do liczenia, ile pytanie rozstrzygnie. */
function yesProbability(v: boolean | null | undefined, attr: AttributeKey): number {
  if (v === null || v === undefined) return 0.5;
  const s = slipOf(attr);
  return v ? 1 - s : s;
}

/**
 * Waga zwierzęcia: popularność × wiarygodność wszystkich odpowiedzi.
 * Używa jej też ekran wskazywania zwierzęcia po poddaniu się Timo.
 */
export function scoreAnimal(animal: Animal, answers: GameAnswer[]): number {
  let w = popularityOf(animal.id);
  for (const a of answers) {
    w *= answerLikelihood(animal.attributes[a.attribute_key], a.answer, a.attribute_key);
  }
  return w;
}

function weightOf(animal: Animal, state: EngineState, answers: GameAnswer[]): number {
  return scoreAnimal(animal, answers) * (state.priors?.[animal.id] ?? 1);
}

/**
 * Posortowani kandydaci z prawdopodobieństwem w PROCENTACH (`score`), żeby log
 * i nakładka diagnostyczna mówiły wprost, jak pewny jest Timo.
 */
export function scoredEligible(
  state: EngineState,
  answers: GameAnswer[]
): Array<{ animal: Animal; score: number }> {
  const weighted = eligibleCandidates(state).map((animal) => ({
    animal,
    w: weightOf(animal, state, answers),
  }));
  const total = weighted.reduce((sum, x) => sum + x.w, 0) || 1;
  return weighted
    .map(({ animal, w }) => ({ animal, score: (w / total) * 100 }))
    .sort((a, b) => b.score - a.score);
}

/** Ilu kandydatów jest „zgodnych z tym, co wiemy” (patrz PLAUSIBLE_RATIO). */
export function plausibleCount(state: EngineState, answers: GameAnswer[]): number {
  const scored = scoredEligible(state, answers);
  const top = scored[0]?.score ?? 0;
  if (top === 0) return 0;
  return scored.filter((s) => s.score >= top * PLAUSIBLE_RATIO).length;
}

export function shouldGiveUp(state: EngineState): boolean {
  if (state.questionsAsked >= MAX_QUESTIONS) return true;
  if (eligibleCandidates(state).length === 0) return true;
  return false;
}

/**
 * Strzał, gdy dalsze pytania nic nie dadzą albo lider jest wyraźnie pewny.
 *
 * Progi w procentach prawdopodobieństwa, nie w liczbie kandydatów — pula nie
 * maleje już sama z siebie. Część zwierząt ma w bazie identyczne cechy, więc
 * lider nie przekroczy 1/k pewności dla k takich bliźniaków; dlatego strzał
 * pada też wtedy, gdy zostało ≤3 zgodnych kandydatów albo żadne pytanie ich
 * już nie rozdziela.
 */
export function shouldAttemptGuess(
  state: EngineState,
  answers: GameAnswer[],
  pool?: Question[]
): boolean {
  const scored = scoredEligible(state, answers);
  if (scored.length === 0) return false;
  if (scored.length === 1) return true;

  const p1 = scored[0].score;
  const p2 = scored[1].score;

  if (state.questionsAsked < MIN_QUESTIONS_BEFORE_GUESS) return p1 >= 90;
  if (p1 >= 50) return true;
  if (p1 >= 25 && p1 >= p2 * 2) return true;
  if (plausibleCount(state, answers) <= FORCED_GUESS_POOL) return true;
  if (pool && bestGain(state, answers, pool) < USELESS_GAIN) return true;
  if (state.questionsAsked >= DESPERATE_AFTER && p1 >= 10) return true;
  return false;
}

/** Tyle zgodnych kandydatów to już moment na strzał (jak w dawnym silniku). */
const FORCED_GUESS_POOL = 3;
/** Pytanie, które daje mniej bitów, niczego już nie rozstrzyga. */
const USELESS_GAIN = 0.12;

function entropy(ps: number[]): number {
  let h = 0;
  for (const p of ps) if (p > 0) h -= p * Math.log2(p);
  return h;
}

/**
 * Następne pytanie = największy oczekiwany zysk informacji, liczony po
 * wagach WSZYSTKICH kandydatów. Pytanie, którego odpowiedź wynika już
 * z poprzednich (lodowa kraina po „żyje w Polsce”), prawie nic nie zmienia,
 * więc przegrywa z pytaniami, które naprawdę rozdzielają liderów.
 */
function rankQuestions(
  state: EngineState,
  answers: GameAnswer[],
  pool: Question[]
): Array<{ q: Question; gain: number; sensible: boolean }> {
  const remaining = pool.filter((q) => !state.usedAttributes.has(q.attribute_key));
  if (remaining.length === 0) return [];

  const scored = scoredEligible(state, answers);
  if (scored.length === 0) return [];
  // Ogon poniżej 0,05% nic nie zmienia w rachunku, a spowalnia go 10×.
  const focus = scored.filter((s) => s.score >= 0.05);
  const total = focus.reduce((sum, s) => sum + s.score, 0) || 1;
  const prior = focus.map((s) => s.score / total);
  const h0 = entropy(prior);

  const gains = remaining.map((q) => {
    let pYes = 0;
    const joint = focus.map((s, i) => {
      const py = yesProbability(s.animal.attributes[q.attribute_key], q.attribute_key);
      pYes += prior[i] * py;
      return py;
    });
    const pNo = 1 - pYes;
    const post = (yes: boolean, norm: number) =>
      norm <= 0 ? [] : prior.map((p, i) => (p * (yes ? joint[i] : 1 - joint[i])) / norm);
    const gain = h0 - (pYes * entropy(post(true, pYes)) + pNo * entropy(post(false, pNo)));
    return { q, gain: Number.isFinite(gain) ? gain : 0, sensible: splitsPlausible(q, scored) };
  });
  // Najpierw pytania, które rozdzielają zwierzęta ZGODNE z odpowiedziami.
  // Sam zysk informacji lubił też pytania rozdzielające tylko tych, którzy
  // już raz „przegrali” — np. lodową krainę po „żyje w Polsce”. Dla dziecka
  // to pytanie sprzeczne z tym, co przed chwilą powiedziało.
  return gains.sort((a, b) => Number(b.sensible) - Number(a.sensible) || b.gain - a.gain);
}

/**
 * Czy pytanie coś rozstrzyga wśród zgodnych kandydatów — gdy ≥95% ich wagi
 * przewiduje tę samą odpowiedź, odpowiedź już wynika z poprzednich.
 */
function splitsPlausible(q: Question, scored: Array<{ animal: Animal; score: number }>): boolean {
  const top = scored[0]?.score ?? 0;
  const plausible = scored.filter((s) => s.score >= top * PLAUSIBLE_RATIO);
  const total = plausible.reduce((n, s) => n + s.score, 0) || 1;
  let yes = 0;
  let no = 0;
  for (const s of plausible) {
    const v = s.animal.attributes[q.attribute_key];
    if (v === true) yes += s.score;
    else if (v === false) no += s.score;
  }
  return yes / total < 0.95 && no / total < 0.95;
}

/** Ile bitów da najlepsze z pozostałych pytań. */
export function bestGain(state: EngineState, answers: GameAnswer[], pool: Question[]): number {
  const top = rankQuestions(state, answers, pool)[0];
  return top && top.sensible ? top.gain : 0;
}

/**
 * Następne pytanie = największy oczekiwany zysk informacji, liczony po
 * wagach WSZYSTKICH kandydatów. Pytanie, którego odpowiedź wynika już
 * z poprzednich (lodowa kraina po „żyje w Polsce”), prawie nic nie zmienia,
 * więc przegrywa z pytaniami, które naprawdę rozdzielają liderów.
 */
export function pickNextQuestion(
  state: EngineState,
  answers: GameAnswer[],
  pool: Question[]
): Question | null {
  const gains = rankQuestions(state, answers, pool);
  if (gains.length === 0) return null;
  // Różnorodność: na początku losuj spośród kilku prawie równie dobrych
  // pytań, żeby kolejne gry nie zaczynały się identycznie; później bierz
  // najlepsze, bo liczy się precyzja.
  const variety = state.questionsAsked === 0 ? 5 : state.questionsAsked < 3 ? 3 : 1;
  const best = gains[0].gain;
  const pickable = gains
    .slice(0, variety)
    .filter((g) => g.sensible === gains[0].sensible && g.gain >= best * 0.85);
  const from = pickable.length > 0 ? pickable : [gains[0]];
  return from[Math.floor(Math.random() * from.length)].q;
}

/**
 * Zostawione dla zgodności: odpowiedź nie usuwa już kandydatów — pamięta ją
 * lista odpowiedzi, a wagi liczy `scoreAnimal`.
 */
export function applyAnswer(
  candidates: Animal[],
  _attribute_key: AttributeKey,
  _answer: AnswerType
): Animal[] {
  return candidates;
}

/** Najlepszy strzał — lider po wadze; remisy losowo. */
export function pickBestGuess(state: EngineState, answers: GameAnswer[] = []): Animal | null {
  const scored = scoredEligible(state, answers);
  if (scored.length === 0) return null;
  const max = scored[0].score;
  const ties = scored.filter((s) => s.score >= max - 1e-6);
  return ties[Math.floor(Math.random() * ties.length)].animal;
}

/** Poziom „ciepło–zimno” — jak blisko rozwiązania jest silnik. */
export type HeatLevel = 'cold' | 'warm' | 'hot';

/**
 * Ciepło–zimno z pewności lidera, a nie z liczby kandydatów: „gorąco”
 * znaczy, że Timo naprawdę zaraz strzeli.
 */
export function heatLevel(state: EngineState, answers: GameAnswer[] = []): HeatLevel {
  if (state.questionsAsked < 2) return 'cold';
  const top = scoredEligible(state, answers)[0]?.score ?? 0;
  if (top >= 25 && state.questionsAsked >= MIN_QUESTIONS_BEFORE_GUESS - 1) return 'hot';
  if (top >= 8) return 'warm';
  return 'cold';
}
