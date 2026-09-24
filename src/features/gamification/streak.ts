/**
 * Seria dzienna — „ile dni z rzędu dziecko zajrzało do Timo".
 *
 * Logika siedzi tutaj, a nie w `profile-store`, bo jest czystą funkcją dat i
 * dzięki temu da się ją sprawdzić bez zustanda, Supabase i AsyncStorage.
 */

/** Dzisiejsza data lokalna jako `YYYY-MM-DD`. */
export function todayLocal(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Dzień poprzedzający podaną datę `YYYY-MM-DD`.
 *
 * Liczone przez `Date`, a nie odejmowanie liczby — dzięki temu same z siebie
 * działają końce miesiąca, lata przestępne i zmiana roku.
 */
export function yesterdayOf(today: string): string {
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return todayLocal(dt);
}

/** Progi serii: ile tropów za który dzień z rzędu. */
export const STREAK_MILESTONES: Record<number, number> = {
  7: 50,
  14: 100,
  30: 200,
};

/** Odznaki za serię, od najniższego progu. */
export const STREAK_BADGES: ReadonlyArray<readonly [number, string]> = [
  [7, 'daily_streak_7'],
  [14, 'daily_streak_14'],
  [30, 'daily_streak_30'],
];

export type StreakTransition = {
  /** Czy seria urosła — czyli czy pokazać ekran. */
  advanced: boolean;
  /** Seria po przejściu. */
  streak: number;
  /** Czy seria została przerwana i liczy się od nowa. */
  reset: boolean;
  /** Tropy z progu; 0 w zwykły dzień. */
  bonusPaws: number;
};

/**
 * Przesuwa serię o dzisiejszy dzień.
 *
 * Twardy reset: liczy się wyłącznie dzień po dniu. Pominięty dzień zaczyna
 * serię od jedynki — prosto w kodzie i łatwo wytłumaczyć dziecku.
 */
export function advanceStreak(
  lastSeenDate: string | null,
  dailyStreak: number,
  today: string
): StreakTransition {
  // Był już dziś: seria nie rośnie drugi raz, ekran się nie pokazuje.
  if (lastSeenDate === today) {
    return { advanced: false, streak: dailyStreak, reset: false, bonusPaws: 0 };
  }

  const continued = lastSeenDate === yesterdayOf(today);
  const streak = continued ? dailyStreak + 1 : 1;

  return {
    advanced: true,
    streak,
    // Pierwsze uruchomienie to nie przerwana seria, tylko jej początek.
    reset: !continued && dailyStreak > 0,
    bonusPaws: STREAK_MILESTONES[streak] ?? 0,
  };
}
