/** Kształt danych rankingu — wspólny dla klienta i API. */

export type BoardEntry = {
  playerId: string;
  name: string;
  emoji: string;
  score: number;
  /** Pozycja licząc od 1. */
  rank: number;
};

export type BoardResponse = {
  week: string;
  entries: BoardEntry[];
  /** Wiersz gracza — także gdy jest poza czołówką. `null`, gdy jeszcze nie gra. */
  player: BoardEntry | null;
  total: number;
};
