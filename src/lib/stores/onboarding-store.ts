import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEV_ONBOARDING } from '@/config/features';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * Czy na tym urządzeniu obejrzano już onboarding. Zapisane lokalnie, nie na
 * koncie: po przeinstalowaniu aplikacji pokaże się znowu, ale gracz
 * z kontem (albo z profilami dzieci) i tak go nie dostanie — patrz
 * `useNeedsOnboarding`.
 */
type OnboardingState = {
  done: boolean;
  /** Onboarding skończony w TYM uruchomieniu — dla podglądu `DEV_ONBOARDING`. */
  doneThisRun: boolean;
  hydrated: boolean;
  markDone: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      done: false,
      doneThisRun: false,
      hydrated: false,
      markDone: () => set({ done: true, doneThisRun: true }),
    }),
    {
      name: 'timo-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ done: s.done }),
      onRehydrateStorage: () => () => useOnboardingStore.setState({ hydrated: true }),
    },
  ),
);

/**
 * Czy pokazać onboarding. Tylko nowym graczom: kto ma konto (nie anonimowe)
 * albo profile dzieci, już zna Timo — także po aktualizacji aplikacji.
 */
export function useNeedsOnboarding(): boolean {
  const done = useOnboardingStore((s) => s.done);
  const doneThisRun = useOnboardingStore((s) => s.doneThisRun);
  const session = useAuthStore((s) => s.session);
  const hasProfiles = useAuthStore((s) => s.profilesLoaded && s.profiles.length > 0);

  if (DEV_ONBOARDING === 'show') return !doneThisRun;
  if (done) return false;
  if (session && !session.user.is_anonymous) return false;
  return !hasProfiles;
}
