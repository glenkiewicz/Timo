/**
 * Scalanie postępu dziecka z dwóch źródeł (telefon ↔ serwer, telefon ↔ iPad).
 *
 * Zasada „nic nie maleje”: liczniki biorą większą wartość, listy — sumę.
 * Dzięki temu nie ma znaczenia, które źródło jest nowsze, a zerowy stan
 * (pusty telefon, nieudany odczyt) nigdy nie skasuje postępu. Ta sama reguła
 * działa w bazie — `merge_progress` w supabase/migrations/0007.
 *
 * Wyjątek to serie: seria dzienna legalnie spada do 1 po przerwie, więc
 * wygrywa para (seria, data) z nowszą datą, a przy tej samej dacie — większa.
 */

export type ExpeditionProgress = {
  discovered: string[];
  completed_at: string | null;
};

export type SyncedProgress = {
  xp: number;
  paws: number;
  streak: number;
  dailyStreak: number;
  lastPlayDate: string | null;
  lastSeenDate: string | null;
  fast_wins: number;
  collection: string[];
  badges: string[];
  expeditionProgress: Record<string, ExpeditionProgress>;
};

/** Suma list z zachowaniem kolejności: najpierw `a`, potem nowe z `b`. */
function union(a: string[], b: string[]): string[] {
  const seen = new Set(a);
  return [...a, ...b.filter((x) => !seen.has(x))];
}

/** Nowsza data YYYY-MM-DD (napisy w tym formacie porównują się jak daty). */
function later(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

/** Licznik powiązany z datą: wygrywa nowsza data, przy remisie większy licznik. */
function datedCounter(
  a: { n: number; date: string | null },
  b: { n: number; date: string | null },
): { n: number; date: string | null } {
  if ((a.date ?? '') === (b.date ?? '')) return { n: Math.max(a.n, b.n), date: a.date };
  return (a.date ?? '') > (b.date ?? '') ? a : b;
}

function mergeExpeditions(
  a: Record<string, ExpeditionProgress>,
  b: Record<string, ExpeditionProgress>,
): Record<string, ExpeditionProgress> {
  const out: Record<string, ExpeditionProgress> = { ...a };
  for (const [id, theirs] of Object.entries(b)) {
    const mine = out[id];
    if (!mine) {
      out[id] = theirs;
      continue;
    }
    // Ukończenie — wcześniejsza z dat; ukończona gdziekolwiek = ukończona.
    const done = [mine.completed_at, theirs.completed_at].filter((d): d is string => Boolean(d));
    out[id] = {
      discovered: union(mine.discovered, theirs.discovered),
      completed_at: done.length > 0 ? done.sort()[0] : null,
    };
  }
  return out;
}

export function mergeProgress(a: SyncedProgress, b: SyncedProgress): SyncedProgress {
  const daily = datedCounter(
    { n: a.dailyStreak, date: a.lastSeenDate },
    { n: b.dailyStreak, date: b.lastSeenDate },
  );
  return {
    xp: Math.max(a.xp, b.xp),
    paws: Math.max(a.paws, b.paws),
    // Seria rund liczy ukończone rundy i nigdy się nie zeruje.
    streak: Math.max(a.streak, b.streak),
    dailyStreak: daily.n,
    lastSeenDate: daily.date,
    lastPlayDate: later(a.lastPlayDate, b.lastPlayDate),
    fast_wins: Math.max(a.fast_wins, b.fast_wins),
    collection: union(a.collection, b.collection),
    badges: union(a.badges, b.badges),
    expeditionProgress: mergeExpeditions(a.expeditionProgress, b.expeditionProgress),
  };
}

/** Czy scalenie dodało coś, czego `base` nie ma — wtedy trzeba je wysłać. */
export function progressDiffers(merged: SyncedProgress, base: SyncedProgress): boolean {
  const sameSet = (x: string[], y: string[]) => {
    const ys = new Set(y);
    return new Set(x).size === ys.size && x.every((v) => ys.has(v));
  };
  const sameExpeditions = () => {
    const ids = new Set([...Object.keys(merged.expeditionProgress), ...Object.keys(base.expeditionProgress)]);
    for (const id of ids) {
      const m = merged.expeditionProgress[id];
      const b = base.expeditionProgress[id];
      if (!m || !b) return false;
      if (m.completed_at !== b.completed_at || !sameSet(m.discovered, b.discovered)) return false;
    }
    return true;
  };
  return !(
    merged.xp === base.xp &&
    merged.paws === base.paws &&
    merged.streak === base.streak &&
    merged.dailyStreak === base.dailyStreak &&
    merged.lastSeenDate === base.lastSeenDate &&
    merged.lastPlayDate === base.lastPlayDate &&
    merged.fast_wins === base.fast_wins &&
    sameSet(merged.collection, base.collection) &&
    sameSet(merged.badges, base.badges) &&
    sameExpeditions()
  );
}

/** Wiersz tabeli `progress` w kształcie, w jakim go czytamy i piszemy. */
export type ProgressRow = {
  xp: number | null;
  paws: number | null;
  streak: number | null;
  daily_streak: number | null;
  last_play_date: string | null;
  last_seen_date: string | null;
  fast_wins: number | null;
  collection: string[] | null;
  badges: string[] | null;
  expedition_progress?: Record<string, ExpeditionProgress> | null;
};

export function progressFromRow(row: ProgressRow): SyncedProgress {
  return {
    xp: row.xp ?? 0,
    paws: row.paws ?? 0,
    streak: row.streak ?? 0,
    dailyStreak: row.daily_streak ?? 0,
    lastPlayDate: row.last_play_date ?? null,
    lastSeenDate: row.last_seen_date ?? null,
    fast_wins: row.fast_wins ?? 0,
    collection: row.collection ?? [],
    badges: row.badges ?? [],
    expeditionProgress: row.expedition_progress ?? {},
  };
}

export function progressToRow(p: SyncedProgress): Required<ProgressRow> {
  return {
    xp: p.xp,
    paws: p.paws,
    streak: p.streak,
    daily_streak: p.dailyStreak,
    last_play_date: p.lastPlayDate,
    last_seen_date: p.lastSeenDate,
    fast_wins: p.fast_wins,
    collection: p.collection,
    badges: p.badges,
    expedition_progress: p.expeditionProgress,
  };
}

/** Wycina z dowolnego stanu pola postępu synchronizowane z serwerem. */
export function pickSynced(s: SyncedProgress): SyncedProgress {
  return {
    xp: s.xp,
    paws: s.paws,
    streak: s.streak,
    dailyStreak: s.dailyStreak,
    lastPlayDate: s.lastPlayDate,
    lastSeenDate: s.lastSeenDate,
    fast_wins: s.fast_wins,
    collection: s.collection,
    badges: s.badges,
    expeditionProgress: s.expeditionProgress,
  };
}
