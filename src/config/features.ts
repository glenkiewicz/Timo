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
export const DEV_UNLOCK_ALL = __DEV__;
