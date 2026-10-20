import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { FREE_DAILY_ROUNDS } from '@/config/free-tier';
import { todayKey } from '@/data/expeditions';
import { usePremium } from '@/lib/purchases';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * Licznik dzisiejszych rund „Zagraj z Timo” w wersji darmowej.
 *
 * Osobny store, a nie pole w `profile-store`: tamten zeruje się przy zmianie
 * dziecka i wczytuje z bazy, więc przełączenie profilu tam i z powrotem
 * dawałoby kolejne trzy rundy. Tu licznik jest per dziecko i per dzień,
 * trzymany tylko na urządzeniu.
 */
type FreeRoundsState = {
  /** Dzień, którego dotyczy `used` (YYYY-MM-DD, lokalna data). */
  date: string | null;
  /** profileId → ukończone dziś rundy gry swobodnej. */
  used: Record<string, number>;
  recordRound: (profileId: string) => void;
};

export const useFreeRoundsStore = create<FreeRoundsState>()(
  persist(
    (set, get) => ({
      date: null,
      used: {},
      recordRound: (profileId) => {
        const today = todayKey();
        const { date, used } = get();
        const base = date === today ? used : {};
        set({ date: today, used: { ...base, [profileId]: (base[profileId] ?? 0) + 1 } });
      },
    }),
    {
      name: 'timo-free-rounds-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ date: s.date, used: s.used }),
    }
  )
);

function usedToday(state: Pick<FreeRoundsState, 'date' | 'used'>, profileId: string | null): number {
  if (!profileId || state.date !== todayKey()) return 0;
  return state.used[profileId] ?? 0;
}

/** Ile rund gry swobodnej zostało dziś aktywnemu dziecku; `null` = pełna wersja, bez limitu. */
export function useFreeRoundsLeft(): number | null {
  const premium = usePremium();
  const profileId = useAuthStore((s) => s.activeProfileId);
  const used = useFreeRoundsStore((s) => usedToday(s, profileId));
  if (premium) return null;
  return Math.max(0, FREE_DAILY_ROUNDS - used);
}
