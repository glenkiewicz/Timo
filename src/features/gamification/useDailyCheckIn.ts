import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useProfileStore } from '@/lib/stores/profile-store';

/**
 * Dzienny meldunek — „byłem dziś u Timo".
 *
 * Woła `checkInToday` przy wejściu do aplikacji. Wynik ląduje w
 * `profileStore.streakCelebration` — czytają go zarówno layout zakładek
 * (pokazuje ekran), jak i Home (wstrzymuje powitanie głosowe).
 *
 * Dwa wyzwalacze, bo jeden nie wystarcza:
 * - `activeProfileId` — zimny start. NIE montujemy tego w `profiles.tsx`:
 *   przy powrocie do aplikacji z zapamiętanym profilem ekran wyboru dziecka
 *   w ogóle się nie pokazuje i meldunek by przepadł.
 * - `AppState` → `active` — aplikacja zostawiona otwarta przez noc. Bez tego
 *   dziecko wraca rano do wczorajszej sesji i dzień nie zostaje policzony.
 *
 * Powrót z tła tego samego dnia nic nie robi: `checkInToday` zwraca wtedy
 * `advanced: false`, bo `lastSeenDate` już wskazuje dziś.
 */
export function useDailyCheckIn() {
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const checkInToday = useProfileStore((s) => s.checkInToday);

  // Trzymamy w ref, żeby listener `AppState` nie przepinał się przy każdym
  // renderze — inaczej subskrypcja wisiałaby na nieaktualnym domknięciu.
  const run = useRef(() => {});
  run.current = () => {
    if (!activeProfileId) return;
    checkInToday();
  };

  useEffect(() => {
    run.current();
  }, [activeProfileId]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') run.current();
    });
    return () => sub.remove();
  }, []);
}
