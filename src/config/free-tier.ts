import { BY_REGION } from '@/data/animal-regions';
import { EXPEDITIONS_BY_ID, rankDailyGuided } from '@/data/expeditions';

/**
 * Wersja darmowa — JEDNO miejsce z listami. Zmiana zakresu darmowej gry to
 * zmiana tych list, nie kodu ekranów.
 *
 * Decyzja z 08.10.2026 (do dopracowania): trzy krainy kolekcji i pasujące
 * do nich wyprawy. Zwierzęta z darmowych krain są też pulą gry swobodnej.
 * Codziennie jedna płatna wyprawa jest gratis (Wyprawa Dnia).
 */
export const FREE_REGIONS = ['farm', 'home', 'savanna'] as const;

export const FREE_EXPEDITIONS = ['farm_timo', 'home_pets_friends', 'savanna_kids'] as const;

const FREE_REGION_SET = new Set<string>(FREE_REGIONS);
const FREE_EXPEDITION_SET = new Set<string>(FREE_EXPEDITIONS);

export function isFreeRegion(regionId: string): boolean {
  return FREE_REGION_SET.has(regionId);
}

export function isFreeExpedition(expeditionId: string): boolean {
  return FREE_EXPEDITION_SET.has(expeditionId);
}

/** Pula gry swobodnej w wersji darmowej: zwierzęta z darmowych krain, bez mitycznych. */
export const FREE_ANIMAL_IDS: ReadonlySet<string> = (() => {
  const mythical = new Set(EXPEDITIONS_BY_ID.mythical?.roster ?? []);
  const ids = FREE_REGIONS.flatMap((r) => (BY_REGION[r] ?? []).map((a) => a.id));
  return new Set(ids.filter((id) => !mythical.has(id)));
})();

/**
 * Wyprawa Dnia w wersji darmowej: dwie darmowe wyprawy i jedna płatna,
 * gratis na ten dzień — dziecko co dzień smakuje pełnej wersji. Ta sama
 * losowa kolejność dnia co w pełnej wersji, więc wybór jest stały w ciągu
 * dnia i ten sam u wszystkich.
 */
export function pickDailyFree(dateKey: string): string[] {
  const ranked = rankDailyGuided(dateKey);
  const paid = ranked.find((id) => !isFreeExpedition(id));
  const free = ranked.filter((id) => isFreeExpedition(id)).slice(0, 2);
  const trio = paid ? [...free, paid] : free;
  return ranked.filter((id) => trio.includes(id));
}
