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

export type Question = {
  id: string;
  attribute_key: AttributeKey;
  /** Domyślna (najkrótsza) forma pytania. */
  text_pl: string;
  /** Opcjonalne warianty stylistyczne — losowane przy zadawaniu pytania. */
  variants?: string[];
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
