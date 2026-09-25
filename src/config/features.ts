/**
 * Feature flags aplikacji. Zmiany tutaj wpływają na widoczność / dostępność
 * funkcji bez konieczności edycji w wielu miejscach.
 *
 * `__DEV__` jest true w trybie developerskim (dev build, expo start),
 * false w produkcji (release build). Dzięki temu DEV_UNLOCK_ALL = true
 * tylko podczas pracy lokalnej.
 */

/**
 * W trybie dev wszystkie wyprawy są dostępne (status 'available_today' zamiast
 * 'locked'), a w kolekcji widać wszystkie zwierzęta jako odkryte.
 * Ułatwia testowanie różnych wypraw i UI kart zwierząt bez grania od początku.
 */
// UWAGA: to musi być GOŁY `__DEV__`, nie napis. Do tej pory stało tu
// `'__DEV__'` w cudzysłowie — niepusty napis jest zawsze prawdziwy, więc
// odblokowanie działało również w buildzie produkcyjnym: wszystkie wyprawy
// otwarte i cała kolekcja pokazana jako odkryta.
export const DEV_UNLOCK_ALL = '';

/**
 * Tabela wyników na ekranie głównym. Schowana na czas przebudowy wizualnej —
 * po przejściu Home na ilustrowaną polanę biała karta z rankingiem nie trzyma
 * się nowego języka i wymaga własnego projektu.
 *
 * UWAGA: wysyłka wyniku tygodnia NIE zależy od tej flagi. Siedziała kiedyś
 * w `useEffect` wewnątrz `LeaderboardCard`; teraz jest w
 * `features/leaderboard/useWeeklyScoreSync`, który Home woła niezależnie.
 */
export const SHOW_HOME_LEADERBOARD = false;

/**
 * Nakładka diagnostyczna silnika zgadywania na ekranie gry. Sam `DebugOverlay`
 * jest już `__DEV__`-only, ale ta flaga pozwala ją zdjąć także w dev — zasłaniała
 * ilustrowane tło i liska.
 */
export const SHOW_GAME_DEBUG = false;

/* ------------------------------------------------------------------------
 * Wymuszanie stanów do podglądu UI — bez grania, bez grzebania w danych.
 *
 * Zmieniasz TYLKO wartość w nawiasie `devOnly(...)`. W buildzie produkcyjnym
 * każdy przełącznik zwraca 'auto', więc zapomniana wartość nie wycieknie do
 * dzieci — to samo zabezpieczenie, którego brakowało przy DEV_UNLOCK_ALL.
 * `'auto'` = normalne zachowanie z danych profilu.
 * --------------------------------------------------------------------- */

function devOnly<T extends string>(value: T | 'auto'): T | 'auto' {
  return __DEV__ ? value : 'auto';
}

/**
 * Ekran startowy (src/app/start.tsx):
 * - 'first-time' — wariant dla dziecka, które jeszcze nie grało (trzy kroki),
 * - 'returning'  — powitanie ze stanem kolekcji,
 * - 'skip'       — bez ekranu startowego, od razu Menu (wygodne przy pracy).
 */
export const DEV_START_SCREEN = devOnly<'first-time' | 'returning' | 'skip'>('skip');

/**
 * Wyprawa Dnia na Menu:
 * - 'pick'      — „wybierz jedną z trzech”,
 * - 'chosen'    — wybrana, w toku (pierwsza z dzisiejszych, jeśli nic nie wybrano),
 * - 'completed' — ukończona („Jutro czeka nowa przygoda”).
 */
export const DEV_DAILY_EXPEDITION = devOnly<'pick' | 'chosen' | 'completed'>('pick');
