import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BADGES, type BadgeDef } from '@/data/badges';
import {
  EXPEDITIONS_BY_ID,
  pickDailyThree,
  todayKey,
} from '@/data/expeditions';
import { awardRound, type AwardInput } from '@/features/gamification/award';

type DailyChoice = {
  date: string;
  expedition_ids: string[];
  chosen_id: string | null;
};

type ExpeditionProgress = {
  discovered: string[];
  completed_at: string | null;
};

type ProfileState = {
  paws: number;
  /** Legacy — pole zostawione w schemie persystencji, nie pokazywane w UI */
  stars: number;
  xp: number;
  streak: number;
  /** Codzienna seria — ile dni z rzędu zagrał ≥1 rundę */
  dailyStreak: number;
  /** Ostatni dzień gry — YYYY-MM-DD (lokalna data) */
  lastPlayDate: string | null;
  /** Liczba szybkich zwycięstw (≤3 pytań) — do odznaki `lightning` */
  fast_wins: number;
  collection: string[];
  badges: string[];

  /** Daily expedition picks */
  dailyChoice: DailyChoice | null;
  /** Per expedition_id: discovered animals + completion date */
  expeditionProgress: Record<string, ExpeditionProgress>;

  /** Last round payload — Result + Home read this for count-up animations */
  lastReward: {
    pawsDelta: number;
    starsDelta: number;
    xpDelta: number;
    newBadges: BadgeDef[];
    previousPaws: number;
    previousXp: number;
    previousStreak: number;
    /** Czy to pierwsze odkrycie tego zwierzęcia (do UI). */
    isFirstDiscovery: boolean;
  } | null;

  /** Last expedition reward (paws/xp bonus when expedition completes) */
  lastExpeditionReward: {
    expedition_id: string;
    pawsDelta: number;
    xpDelta: number;
  } | null;

  award: (input: Omit<AwardInput, 'streak' | 'collection' | 'badges'>) => void;
  clearLastReward: () => void;
  clearLastExpeditionReward: () => void;

  ensureDailyChoice: () => void;
  chooseExpedition: (id: string) => void;
  recordExpeditionDiscovery: (expeditionId: string, animalId: string) => void;

  resetAll: () => void;
};

const initial: Omit<
  ProfileState,
  | 'award'
  | 'clearLastReward'
  | 'clearLastExpeditionReward'
  | 'ensureDailyChoice'
  | 'chooseExpedition'
  | 'recordExpeditionDiscovery'
  | 'resetAll'
> = {
  paws: 0,
  stars: 0,
  xp: 0,
  streak: 0,
  dailyStreak: 0,
  lastPlayDate: null,
  fast_wins: 0,
  collection: [] as string[],
  badges: [] as string[],
  dailyChoice: null,
  expeditionProgress: {},
  lastReward: null,
  lastExpeditionReward: null,
};

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterdayOf(today: string): string {
  // today = 'YYYY-MM-DD'
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initial,

      award: (input) => {
        const state = get();
        const result = awardRound({
          ...input,
          streak: state.streak,
          collection: state.collection,
          badges: state.badges,
        });

        // Daily streak update
        const today = todayLocal();
        let nextDailyStreak = state.dailyStreak;
        if (state.lastPlayDate !== today) {
          if (state.lastPlayDate === yesterdayOf(today)) {
            nextDailyStreak = state.dailyStreak + 1;
          } else {
            nextDailyStreak = 1;
          }
        }

        // Fast wins counter (≤3 pytań)
        const nextFastWins =
          input.won && input.questionsAsked <= 3
            ? state.fast_wins + 1
            : state.fast_wins;

        // Extra unlocks not handled by awardRound (need profile state)
        const unlockedIds = new Set(result.nextBadges);
        const extraBadges: BadgeDef[] = [];
        const tryExtraUnlock = (id: string, condition: boolean) => {
          if (condition && !unlockedIds.has(id)) {
            unlockedIds.add(id);
            const def = BADGES.find((b) => b.id === id);
            if (def) extraBadges.push(def);
          }
        };
        tryExtraUnlock('lightning', nextFastWins >= 3);
        tryExtraUnlock('daily_streak_7', nextDailyStreak >= 7);
        tryExtraUnlock('daily_streak_30', nextDailyStreak >= 30);
        const hour = new Date().getHours();
        tryExtraUnlock('night_owl', hour >= 21 || hour < 4);
        tryExtraUnlock('early_bird', hour >= 5 && hour < 8);

        // Bonus tropów za 7. dzień streaku (jednorazowo per osiągnięcie)
        let pawsBonus = 0;
        if (
          nextDailyStreak === 7 &&
          state.dailyStreak < 7 // świeży próg
        ) {
          pawsBonus += 50;
        }

        set({
          paws: state.paws + result.pawsDelta + pawsBonus,
          stars: state.stars + result.starsDelta,
          xp: state.xp + result.xpDelta,
          streak: result.nextStreak,
          dailyStreak: nextDailyStreak,
          lastPlayDate: today,
          fast_wins: nextFastWins,
          collection: result.nextCollection,
          badges: Array.from(unlockedIds),
          lastReward: {
            pawsDelta: result.pawsDelta + pawsBonus,
            starsDelta: result.starsDelta,
            xpDelta: result.xpDelta,
            newBadges: [...result.newBadges, ...extraBadges],
            previousPaws: state.paws,
            previousXp: state.xp,
            previousStreak: state.streak,
            isFirstDiscovery: result.isFirstDiscovery,
          },
        });
      },

      clearLastReward: () => set({ lastReward: null }),
      clearLastExpeditionReward: () => set({ lastExpeditionReward: null }),

      ensureDailyChoice: () => {
        const state = get();
        const today = todayKey();
        if (state.dailyChoice?.date === today) return;
        const ids = pickDailyThree(today);
        set({
          dailyChoice: {
            date: today,
            expedition_ids: ids,
            chosen_id: null,
          },
        });
      },

      chooseExpedition: (id) => {
        const state = get();
        if (!state.dailyChoice) return;
        if (!state.dailyChoice.expedition_ids.includes(id)) return;
        set({
          dailyChoice: { ...state.dailyChoice, chosen_id: id },
        });
      },

      recordExpeditionDiscovery: (expeditionId, animalId) => {
        const state = get();
        const exp = EXPEDITIONS_BY_ID[expeditionId];
        if (!exp) return;

        const prev = state.expeditionProgress[expeditionId] ?? {
          discovered: [],
          completed_at: null,
        };
        if (prev.discovered.includes(animalId)) return;

        const nextDiscovered = [...prev.discovered, animalId];
        const justCompleted =
          prev.completed_at === null && nextDiscovered.length >= exp.target_count;
        const nextCompletedAt = justCompleted
          ? new Date().toISOString()
          : prev.completed_at;

        const updates: Partial<ProfileState> = {
          expeditionProgress: {
            ...state.expeditionProgress,
            [expeditionId]: {
              discovered: nextDiscovered,
              completed_at: nextCompletedAt,
            },
          },
        };

        if (justCompleted) {
          updates.paws = state.paws + exp.reward_paws;
          updates.xp = state.xp + exp.reward_xp;
          updates.lastExpeditionReward = {
            expedition_id: expeditionId,
            pawsDelta: exp.reward_paws,
            xpDelta: exp.reward_xp,
          };

          // Explorer badge unlocks (oparte na liczbie ukończonych wypraw)
          const completedCount =
            Object.values(updates.expeditionProgress as Record<string, ExpeditionProgress>)
              .filter((p) => p.completed_at != null).length;
          const explorerUnlocks: BadgeDef[] = [];
          const unlockedSet = new Set(state.badges);
          const tryExp = (id: string, condition: boolean) => {
            if (condition && !unlockedSet.has(id)) {
              unlockedSet.add(id);
              const def = BADGES.find((b) => b.id === id);
              if (def) explorerUnlocks.push(def);
            }
          };
          tryExp('explorer_1', completedCount >= 1);
          tryExp('explorer_5', completedCount >= 5);
          tryExp('explorer_10', completedCount >= 10);
          tryExp('explorer_all', completedCount >= 20);
          if (explorerUnlocks.length > 0) {
            updates.badges = Array.from(unlockedSet);
          }

          // Wlicz expedition bonus do lastReward, żeby Home animował pełny zysk
          // (previousPaws/Xp zostają — to snapshot SPRZED awardRound)
          if (state.lastReward) {
            updates.lastReward = {
              ...state.lastReward,
              pawsDelta: state.lastReward.pawsDelta + exp.reward_paws,
              xpDelta: state.lastReward.xpDelta + exp.reward_xp,
              newBadges: [...state.lastReward.newBadges, ...explorerUnlocks],
            };
          }
        }

        set(updates as ProfileState);
      },

      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'timo-profile-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        paws: state.paws,
        stars: state.stars,
        xp: state.xp,
        streak: state.streak,
        dailyStreak: state.dailyStreak,
        lastPlayDate: state.lastPlayDate,
        fast_wins: state.fast_wins,
        collection: state.collection,
        badges: state.badges,
        dailyChoice: state.dailyChoice,
        expeditionProgress: state.expeditionProgress,
      }),
    }
  )
);
