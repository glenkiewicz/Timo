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
export const DEV_UNLOCK_ALL = __DEV__;

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
