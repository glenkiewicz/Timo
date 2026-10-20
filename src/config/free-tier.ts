import { BY_REGION } from '@/data/animal-regions';
import { rankDailyGuided } from '@/data/expeditions';

/**
 * Wersja darmowa — JEDNO miejsce z listami. Zmiana zakresu darmowej gry to
 * zmiana tych list, nie kodu ekranów.
 *
 * Decyzja z 08.10.2026 (do dopracowania): trzy krainy kolekcji i pasujące
 * do nich wyprawy. Codziennie jedna płatna wyprawa jest gratis (Wyprawa Dnia).
 *
 * Od 20.10.2026 gra swobodna („Zagraj z Timo”) zgaduje spośród wszystkich
 * zwierząt, a wersję darmową ogranicza liczba rund dziennie. Wcześniej
 * zgadywała tylko z puli darmowych krain, a dziecko oglądało przed grą
 * karuzelę 99 zwierząt — wyglądało to jak kolejna wyprawa i myliło.
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

/** Ukończone rundy „Zagraj z Timo” na dziecko na dzień w wersji darmowej. */
export const FREE_DAILY_ROUNDS = 3;

/**
 * Czy kraina kolekcji jest otwarta w wersji darmowej. Poza darmowymi
 * otwiera się każda, w której dziecko już coś odkryło — gra swobodna zgaduje
 * spośród wszystkich zwierząt, a lew morski schowany za kłódką wyglądałby
 * na zgubiony.
 */
export function isRegionOpenFree(regionId: string, discovered: ReadonlySet<string>): boolean {
  return isFreeRegion(regionId) || (BY_REGION[regionId] ?? []).some((a) => discovered.has(a.id));
}

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
