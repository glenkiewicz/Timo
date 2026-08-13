import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { nicknameFor } from '@/features/leaderboard/nicknames';
import type { BoardEntry } from '@/features/leaderboard/types';
import { isoWeekKey } from '@/features/leaderboard/week';
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';

/**
 * Ranking tygodniowy oparty o Postgresa (Supabase).
 *
 * Tożsamość w tabeli jest wyliczana, nie zapisywana: baza zwraca `profile_id`
 * i `nick_variant`, a pseudonim („Dzielny Jeż") powstaje z nich lokalnie tą
 * samą funkcją u każdego klienta. Imię dziecka nigdy nie opuszcza konta rodzica.
 */

const TOP_LIMIT = 20;

type LeaderboardRow = {
  profile_id: string;
  week: string;
  xp: number;
  nick_variant: number;
};

type SyncStatus = 'idle' | 'loading' | 'ok' | 'error';

type LeaderboardState = {
  week: string | null;
  entries: BoardEntry[];
  player: BoardEntry | null;
  total: number;
  lastSyncAt: number | null;

  status: SyncStatus;
  errorMessage: string | null;
  /** Wynik, którego nie udało się wysłać — ponawiany przy kolejnym wejściu. */
  pendingScore: number | null;

  refresh: () => Promise<void>;
  submitScore: (weeklyXp: number) => Promise<void>;
  flushPending: () => Promise<void>;
};

function toEntry(row: LeaderboardRow, rank: number): BoardEntry {
  const { name, emoji } = nicknameFor(row.profile_id, row.nick_variant);
  return { playerId: row.profile_id, name, emoji, score: row.xp, rank };
}

function messageFor(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Brak połączenia z rankingiem.';
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      week: null,
      entries: [],
      player: null,
      total: 0,
      lastSyncAt: null,
      status: 'idle',
      errorMessage: null,
      pendingScore: null,

      refresh: async () => {
        const week = isoWeekKey();
        const activeProfileId = useAuthStore.getState().activeProfileId;

        set({ status: 'loading', errorMessage: null });
        try {
          const { data, error, count } = await supabase
            .from('leaderboard_weekly')
            .select('profile_id, week, xp, nick_variant', { count: 'exact' })
            .eq('week', week)
            .order('xp', { ascending: false })
            .limit(TOP_LIMIT);

          if (error) throw new Error(error.message);

          const rows = (data ?? []) as LeaderboardRow[];
          const entries = rows.map((row, index) => toEntry(row, index + 1));

          let player = entries.find((e) => e.playerId === activeProfileId) ?? null;

          // Gracz poza czołówką — dolicz miejsce zliczając lepsze wyniki.
          if (!player && activeProfileId) {
            const { data: mine } = await supabase
              .from('leaderboard_weekly')
              .select('profile_id, week, xp, nick_variant')
              .eq('week', week)
              .eq('profile_id', activeProfileId)
              .maybeSingle();

            if (mine) {
              const row = mine as LeaderboardRow;
              const { count: better } = await supabase
                .from('leaderboard_weekly')
                .select('profile_id', { count: 'exact', head: true })
                .eq('week', week)
                .gt('xp', row.xp);

              player = toEntry(row, (better ?? 0) + 1);
            }
          }

          set({
            week,
            entries,
            player,
            total: count ?? entries.length,
            lastSyncAt: Date.now(),
            status: 'ok',
            errorMessage: null,
          });
        } catch (error) {
          set({ status: 'error', errorMessage: messageFor(error) });
        }
      },

      submitScore: async (weeklyXp) => {
        const activeProfileId = useAuthStore.getState().activeProfileId;
        if (!activeProfileId) return;

        set({ status: 'loading', errorMessage: null, pendingScore: weeklyXp });
        try {
          const { error } = await supabase.rpc('submit_weekly_score', {
            p_profile_id: activeProfileId,
            p_week: isoWeekKey(),
            p_xp: Math.max(0, Math.trunc(weeklyXp)),
          });
          if (error) throw new Error(error.message);

          set({ pendingScore: null });
          await get().refresh();
        } catch (error) {
          // Wynik zostaje w kolejce — spróbujemy ponownie przy następnym wejściu.
          set({ status: 'error', errorMessage: messageFor(error) });
        }
      },

      flushPending: async () => {
        const pending = get().pendingScore;
        if (pending === null) {
          await get().refresh();
          return;
        }
        await get().submitScore(pending);
      },
    }),
    {
      name: 'timo-leaderboard',
      storage: createJSONStorage(() => AsyncStorage),
      // Cache tabeli, żeby ekran miał co pokazać bez internetu.
      partialize: (state) => ({
        week: state.week,
        entries: state.entries,
        player: state.player,
        total: state.total,
        lastSyncAt: state.lastSyncAt,
        pendingScore: state.pendingScore,
      }),
    }
  )
);
