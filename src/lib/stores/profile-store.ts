import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BADGES, type BadgeDef } from '@/data/badges';
import {
  EXPEDITIONS_BY_ID,
  pickDailyGuided,
  pickDailyThree,
  todayKey,
} from '@/data/expeditions';
import { awardRound, type AwardInput } from '@/features/gamification/award';
import {
  STREAK_BADGES,
  advanceStreak,
  todayLocal,
} from '@/features/gamification/streak';
import { isoWeekKey } from '@/features/leaderboard/week';
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';

type DailyChoice = {
  date: string;
  expedition_ids: string[];
  chosen_id: string | null;
};

type ExpeditionProgress = {
  discovered: string[];
  completed_at: string | null;
};

/** Wynik dziennego meldunku — czym karmimy ekran serii. */
export type StreakCheckIn = {
  /** Czy seria urosła (czyli czy pokazać ekran). */
  advanced: boolean;
  /** Seria PO meldunku. */
  streak: number;
  /** Seria PRZED meldunkiem — 0 przy pierwszym uruchomieniu. */
  previous: number;
  /** Czy seria została przerwana i zaczyna się od nowa. */
  reset: boolean;
  /** Tropy z progu (7/14/30), 0 w zwykły dzień. */
  bonusPaws: number;
  /** Odznaki odblokowane tym meldunkiem. */
  newBadges: BadgeDef[];
};

type ProfileState = {
  paws: number;
  /** Legacy — pole zostawione w schemie persystencji, nie pokazywane w UI */
  stars: number;
  xp: number;
  streak: number;
  /** Codzienna seria — ile dni z rzędu zagrał ≥1 rundę */
  dailyStreak: number;
  /** Ostatni dzień ukończonej rundy — YYYY-MM-DD (lokalna data) */
  lastPlayDate: string | null;
  /**
   * Ostatni dzień OTWARCIA aplikacji — YYYY-MM-DD (lokalna data).
   *
   * To on, a nie `lastPlayDate`, napędza serię dzienną: dziecko dostaje dzień
   * za przyjście do Timo, nie za dograną rundę. Pięciolatek nie zawsze zdąży
   * zagrać, a seria ma budować nawyk odwiedzin.
   */
  lastSeenDate: string | null;
  /** Liczba szybkich zwycięstw (≤3 pytań) — do odznaki `lightning` */
  fast_wins: number;

  /** XP zdobyte w bieżącym tygodniu ISO — wynik wysyłany do rankingu online. */
  weeklyXp: number;
  /** Tydzień, którego dotyczy `weeklyXp` (np. `2026-W33`). */
  weekKey: string | null;
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
    /** Ile z zadanych pytań dziecko umiało rozstrzygnąć — ekran wyniku mówi
     *  tym, ZA CO są punkty, zamiast pokazywać samą liczbę. */
    knownAnswers: number;
    askedQuestions: number;
  } | null;

  /** Last expedition reward (paws/xp bonus when expedition completes) */
  lastExpeditionReward: {
    expedition_id: string;
    pawsDelta: number;
    xpDelta: number;
  } | null;

  /** Czy głos Timo jest wyciszony — toggle w UI. */
  audioMuted: boolean;

  /**
   * Dzisiejszy meldunek czekający na pokazanie, albo null.
   *
   * Leży w store, a nie w stanie lokalnym haka, bo czytają go DWA ekrany:
   * layout zakładek pokazuje z niego ekran serii, a Home wstrzymuje na ten
   * czas swoje powitanie głosowe. Bez tego obie kwestie startują naraz i
   * `playLine` ucina jedną z nich. Nie jest persystowany — to stan sesji.
   */
  streakCelebration: StreakCheckIn | null;

  award: (input: Omit<AwardInput, 'streak' | 'collection' | 'badges'>) => void;
  /**
   * Melduje dzisiejszą obecność i przesuwa serię dzienną.
   *
   * Wołane przy wejściu do aplikacji, nie po rundzie. Zwraca `advanced: false`,
   * gdy dziecko było już dziś — dzięki temu ekran serii pokazuje się raz na
   * dobę, a nie przy każdym powrocie z tła.
   */
  checkInToday: () => StreakCheckIn;
  /** Zamyka ekran serii. */
  dismissStreakCelebration: () => void;
  clearLastReward: () => void;
  clearLastExpeditionReward: () => void;

  ensureDailyChoice: () => void;
  chooseExpedition: (id: string) => void;
  recordExpeditionDiscovery: (expeditionId: string, animalId: string) => void;

  setAudioMuted: (value: boolean) => void;

  /** Wczytuje stan gry wybranego profilu z bazy (baza jest źródłem prawdy). */
  hydrateFromServer: (profileId: string) => Promise<void>;
  /** Zapisuje bieżący stan do bazy; przy błędzie zostawia `dirty`. */
  pushToServer: () => Promise<void>;
  /** Czy lokalny stan wyprzedza bazę (nieudany zapis, brak sieci). */
  dirty: boolean;

  resetAll: () => void;
};

const initial: Omit<
  ProfileState,
  | 'award'
  | 'clearLastReward'
  | 'clearLastExpeditionReward'
  | 'checkInToday'
  | 'dismissStreakCelebration'
  | 'ensureDailyChoice'
  | 'chooseExpedition'
  | 'recordExpeditionDiscovery'
  | 'setAudioMuted'
  | 'hydrateFromServer'
  | 'pushToServer'
  | 'resetAll'
> = {
  paws: 0,
  stars: 0,
  xp: 0,
  streak: 0,
  dailyStreak: 0,
  lastPlayDate: null,
  lastSeenDate: null,
  fast_wins: 0,
  weeklyXp: 0,
  weekKey: null,
  collection: [] as string[],
  badges: [] as string[],
  dailyChoice: null,
  expeditionProgress: {},
  lastReward: null,
  lastExpeditionReward: null,
  audioMuted: false,
  streakCelebration: null,
  dirty: false,
};


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

        // Seria dzienna NIE jest już liczona tutaj — przeniesiona do
        // `checkInToday`, bo należy się za przyjście do Timo, nie za rundę.
        const today = todayLocal();

        // Licznik rund bez ani jednego „nie wiem". Wcześniej liczył rundy,
        // w których TIMO trafił w ≤3 pytaniach — czyli jego szybkość, na którą
        // dziecko nie ma wpływu. Odznaka `lightning` wisi na tym liczniku.
        const flawless =
          input.answers.length >= 4 &&
          input.answers.every((a) => a.answer !== 'idk');
        const nextFastWins = flawless ? state.fast_wins + 1 : state.fast_wins;

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
        const hour = new Date().getHours();
        tryExtraUnlock('night_owl', hour >= 21 || hour < 4);
        tryExtraUnlock('early_bird', hour >= 5 && hour < 8);

        // Tygodniowe XP — zeruje się przy zmianie tygodnia ISO, żeby ranking
        // startował co poniedziałek od nowa.
        const currentWeek = isoWeekKey();
        const weeklyBase = state.weekKey === currentWeek ? state.weeklyXp : 0;

        set({
          paws: state.paws + result.pawsDelta,
          stars: state.stars + result.starsDelta,
          xp: state.xp + result.xpDelta,
          weeklyXp: weeklyBase + result.xpDelta,
          weekKey: currentWeek,
          streak: result.nextStreak,
          lastPlayDate: today,
          fast_wins: nextFastWins,
          collection: result.nextCollection,
          badges: Array.from(unlockedIds),
          lastReward: {
            pawsDelta: result.pawsDelta,
            starsDelta: result.starsDelta,
            xpDelta: result.xpDelta,
            newBadges: [...result.newBadges, ...extraBadges],
            previousPaws: state.paws,
            previousXp: state.xp,
            previousStreak: state.streak,
            isFirstDiscovery: result.isFirstDiscovery,
            knownAnswers: result.knownAnswers,
            askedQuestions: result.askedQuestions,
          },
        });

        // Baza jest źródłem prawdy — zapis idzie w tle, UI nie czeka.
        void get().pushToServer();
      },

      checkInToday: () => {
        const state = get();
        const move = advanceStreak(state.lastSeenDate, state.dailyStreak, todayLocal());

        if (!move.advanced) {
          return {
            advanced: false,
            streak: move.streak,
            previous: state.dailyStreak,
            reset: false,
            bonusPaws: 0,
            newBadges: [],
          };
        }

        const unlocked = new Set(state.badges);
        const newBadges: BadgeDef[] = [];
        for (const [threshold, id] of STREAK_BADGES) {
          if (move.streak >= threshold && !unlocked.has(id)) {
            unlocked.add(id);
            const def = BADGES.find((b) => b.id === id);
            if (def) newBadges.push(def);
          }
        }

        const celebration: StreakCheckIn = {
          advanced: true,
          streak: move.streak,
          previous: state.dailyStreak,
          reset: move.reset,
          bonusPaws: move.bonusPaws,
          newBadges,
        };

        set({
          dailyStreak: move.streak,
          lastSeenDate: todayLocal(),
          paws: state.paws + move.bonusPaws,
          badges: Array.from(unlocked),
          streakCelebration: celebration,
        });
        void get().pushToServer();

        return celebration;
      },

      dismissStreakCelebration: () => set({ streakCelebration: null }),

      clearLastReward: () => set({ lastReward: null }),
      clearLastExpeditionReward: () => set({ lastExpeditionReward: null }),

      ensureDailyChoice: () => {
        const state = get();
        const today = todayKey();
        if (state.dailyChoice?.date === today) return;
        // Wyprawa Dnia w MVP wybiera spośród guided (dziecięcych).
        // pickDailyThree zostawiamy do potencjalnego trybu "Eksperta".
        const ids = pickDailyGuided(today);
        const fallback = ids.length > 0 ? ids : pickDailyThree(today);
        set({
          dailyChoice: {
            date: today,
            expedition_ids: fallback,
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
        void get().pushToServer();
      },

      setAudioMuted: (value) => set({ audioMuted: value }),

      hydrateFromServer: async (profileId) => {
        // Czyścimy stan poprzedniego dziecka, zanim pokażemy cokolwiek nowego.
        set({ ...initial, audioMuted: get().audioMuted });

        const { data, error } = await supabase
          .from('progress')
          .select(
            'xp, paws, streak, daily_streak, last_play_date, last_seen_date, fast_wins, collection, badges'
          )
          .eq('profile_id', profileId)
          .maybeSingle();

        if (error || !data) {
          if (__DEV__ && error) {
            console.warn('[profile] hydrate failed:', error.message);
          }
          return;
        }

        set({
          xp: data.xp ?? 0,
          paws: data.paws ?? 0,
          streak: data.streak ?? 0,
          dailyStreak: data.daily_streak ?? 0,
          lastPlayDate: data.last_play_date ?? null,
          lastSeenDate: data.last_seen_date ?? null,
          fast_wins: data.fast_wins ?? 0,
          collection: data.collection ?? [],
          badges: data.badges ?? [],
          dirty: false,
        });
      },

      pushToServer: async () => {
        const profileId = useAuthStore.getState().activeProfileId;
        if (!profileId) return;

        const s = get();
        const { error } = await supabase
          .from('progress')
          .update({
            xp: s.xp,
            paws: s.paws,
            streak: s.streak,
            daily_streak: s.dailyStreak,
            last_play_date: s.lastPlayDate,
            last_seen_date: s.lastSeenDate,
            fast_wins: s.fast_wins,
            collection: s.collection,
            badges: s.badges,
            updated_at: new Date().toISOString(),
          })
          .eq('profile_id', profileId);

        // Nieudany zapis zostawia `dirty` — spróbujemy ponownie po następnej
        // rundzie albo przy kolejnym wejściu do aplikacji.
        set({ dirty: Boolean(error) });
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
        lastSeenDate: state.lastSeenDate,
        fast_wins: state.fast_wins,
        collection: state.collection,
        badges: state.badges,
        dailyChoice: state.dailyChoice,
        expeditionProgress: state.expeditionProgress,
        audioMuted: state.audioMuted,
      }),
    }
  )
);
