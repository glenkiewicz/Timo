import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Prośba o ocenę w sklepie — ZAWSZE do rodzica, nigdy do dziecka.
 *
 * Kategoria Kids: wszystko, co wyprowadza poza aplikację, stoi za bramką
 * rodzicielską, a ocena wystawiona przez przedszkolaka i tak nic nie znaczy.
 * Dlatego:
 *  1. systemowe okno oceny (`requestReview`) odpalamy tylko po wejściu do
 *     strefy rodzica — tam bramka jest już za nami, telefon trzyma dorosły;
 *  2. w strefie rodzica jest stały wiersz „Oceń Timo” (formularz opinii w sklepie);
 *  3. na ekranie wyniku po kilku trafieniach Timo pojawia się karta dla rodzica —
 *     „Oceń” prowadzi przez bramkę do formularza opinii.
 *
 * Wytyczne Apple: nie wołać `requestReview` z przycisku ani po pytaniu
 * „podoba się?” — stąd karta i wiersz otwierają formularz w sklepie, a okno
 * systemowe pojawia się samo, bez pytania wstępnego.
 */

const APP_STORE_ID = '6801108622';
const ANDROID_PACKAGE = 'com.glenkiewicz.Timo';

const DAY = 24 * 60 * 60 * 1000;
/** Ile trafień Timo, zanim w ogóle zapytamy. */
const MIN_WINS = 5;
/** Ile dni od pierwszego trafienia Timo na tym urządzeniu. */
const MIN_DAYS_INSTALLED = 2;
/** Odstęp między systemowymi oknami oceny w strefie rodzica. */
const SYSTEM_PROMPT_GAP_DAYS = 30;
/** Odstęp, po którym karta wraca po „Nie teraz”. */
const CARD_GAP_DAYS = 14;
/** Po tylu „Nie teraz” karta nie wraca już nigdy. */
const MAX_CARD_DISMISSALS = 2;

type ReviewState = {
  firstSeenAt: number | null;
  /** Trafienia Timo na tym urządzeniu (wszystkie dzieci razem). */
  wins: number;
  /** Ostatnie systemowe okno oceny. */
  lastSystemPromptAt: number | null;
  /** Ostatnie „Nie teraz” na karcie. */
  lastCardDismissAt: number | null;
  cardDismissals: number;
  /** Rodzic otworzył formularz opinii — więcej nie prosimy kartą. */
  rated: boolean;
  recordWin: () => void;
  dismissCard: () => void;
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      firstSeenAt: null,
      wins: 0,
      lastSystemPromptAt: null,
      lastCardDismissAt: null,
      cardDismissals: 0,
      rated: false,
      recordWin: () => set({ wins: get().wins + 1, firstSeenAt: get().firstSeenAt ?? Date.now() }),
      dismissCard: () => set({ cardDismissals: get().cardDismissals + 1, lastCardDismissAt: Date.now() }),
    }),
    {
      name: 'timo-review-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ recordWin: _r, dismissCard: _d, ...data }) => data,
    }
  )
);

function since(ts: number | null, days: number, now: number): boolean {
  return ts === null || now - ts >= days * DAY;
}

/** Dość zabawy za nami, żeby prosić o ocenę? */
function engaged(s: ReviewState, now: number): boolean {
  return s.wins >= MIN_WINS && s.firstSeenAt !== null && now - s.firstSeenAt >= MIN_DAYS_INSTALLED * DAY;
}

/** Czy pokazać kartę „Rodzicu, oceń Timo” na ekranie wyniku. */
export function shouldShowReviewCard(now = Date.now()): boolean {
  const s = useReviewStore.getState();
  if (Platform.OS === 'web' || s.rated || s.cardDismissals >= MAX_CARD_DISMISSALS) return false;
  return engaged(s, now) && since(s.lastCardDismissAt, CARD_GAP_DAYS, now);
}

/**
 * Systemowe okno oceny — wołane po wejściu do strefy rodzica (już za bramką).
 * Apple i tak pokazuje je najwyżej 3 razy w roku i może je pominąć.
 */
export async function maybeRequestSystemReview(now = Date.now()): Promise<void> {
  const s = useReviewStore.getState();
  if (Platform.OS === 'web' || s.rated || !engaged(s, now)) return;
  if (!since(s.lastSystemPromptAt, SYSTEM_PROMPT_GAP_DAYS, now)) return;
  try {
    if (!(await StoreReview.isAvailableAsync())) return;
    useReviewStore.setState({ lastSystemPromptAt: now });
    await StoreReview.requestReview();
  } catch {
    // Brak okna to nie błąd dla rodzica — po prostu nie prosimy.
  }
}

/** Formularz opinii w sklepie. Wołać TYLKO za bramką rodzicielską. */
export async function openWriteReview(): Promise<void> {
  useReviewStore.setState({ rated: true });
  const native =
    Platform.OS === 'android'
      ? `market://details?id=${ANDROID_PACKAGE}`
      : `itms-apps://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  const web =
    Platform.OS === 'android'
      ? `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&showAllReviews=true`
      : `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  try {
    await Linking.openURL(native);
  } catch {
    await Linking.openURL(web).catch(() => undefined);
  }
}
