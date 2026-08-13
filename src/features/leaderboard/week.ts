/**
 * Tygodniowe okno rankingu.
 *
 * Ranking żyje w oknach ISO (poniedziałek→niedziela), żeby rywalizacja nie
 * zamarzła po kilku tygodniach na wyniku jednego gracza. Ten sam plik liczy
 * klucz po stronie klienta i serwera — obie strony muszą się zgadzać.
 */

/** Klucz tygodnia w formacie `2026-W33` (ISO 8601, tydzień zaczyna poniedziałek). */
export function isoWeekKey(input: Date = new Date()): string {
  const date = new Date(
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate())
  );
  // ISO: tydzień należy do roku, w którym leży jego czwartek.
  const dayNum = date.getUTCDay() || 7; // pon=1 … niedz=7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Ile milisekund zostało do końca bieżącego tygodnia (niedziela 23:59:59 lokalnie). */
export function msUntilWeekEnd(now: Date = new Date()): number {
  const end = new Date(now);
  const dayNum = end.getDay() || 7;
  end.setDate(end.getDate() + (7 - dayNum));
  end.setHours(23, 59, 59, 999);
  return Math.max(0, end.getTime() - now.getTime());
}

/** „3 dni", „5 godzin", „za chwilę" — tekst dla dziecka, nie zegar. */
export function timeLeftLabel(now: Date = new Date()): string {
  const ms = msUntilWeekEnd(now);
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) {
    if (days === 1) return '1 dzień';
    return days < 5 ? `${days} dni` : `${days} dni`;
  }
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return hours === 1 ? '1 godzina' : `${hours} godz.`;
  return 'ostatnie minuty';
}
