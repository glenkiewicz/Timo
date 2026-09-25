export type AttributeKey = string;

export type AttributeDef = {
  key: AttributeKey;
  label_pl: string;
};

export type Animal = {
  id: string;
  name_pl: string;
  emoji: string;
  fun_fact_pl: string;
  /** map attribute_key → true | false | null (null = "depends/sometimes") */
  attributes: Record<AttributeKey, boolean | null>;
  /** expedition tags — animal belongs to these biomes/themes */
  expedition_tags?: string[];
};

/**
 * Pytanie Timo. Wypowiedź = `[setup?] + core`. Żart (setup) to osobne, zamknięte
 * zdanie, więc każdy setup pasuje do każdego rdzenia tego samego pytania.
 * Zasady pisania: `scripts/validate-timo-lines.ts`.
 */
export type Question = {
  id: string;
  attribute_key: AttributeKey;
  /** Czyste, dokładne wersje pytania. Zaczynają się od „Czy”, kończą „?”. [0] = forma kanoniczna. */
  core: string[];
  /** Zdania z charakterem przed pytaniem. Kończą się „.” lub „!”. */
  setups: string[];
  /** Reakcje na „Tak”, związane z tematem pytania. */
  onYes: string[];
  /** Reakcje na „Nie”, związane z tematem pytania. */
  onNo: string[];
};

export type AnswerType = 'yes' | 'no' | 'idk' | 'hard';

export type GameAnswer = {
  question_id: string;
  attribute_key: AttributeKey;
  answer: AnswerType;
  remaining_candidates: number;
};

/**
 * Fazy rundy nazwane z perspektywy DZIECKA, nie Timo.
 *
 * Wcześniej było `'won' | 'lost'`, gdzie „wygrana" oznaczała, że Timo zgadł —
 * czyli że dziecko przegrało pojedynek, i właśnie za to dostawało najwięcej
 * punktów. Ta nazwa kodowała zły model gry; `docs/game-design.md` opisuje to
 * w sekcji o nagrodzie zależnej od Timo.
 */
export type GamePhase = 'asking' | 'guess_attempt' | 'timo_guessed' | 'child_stumped';
