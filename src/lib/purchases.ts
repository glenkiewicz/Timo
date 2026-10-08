import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  LOG_LEVEL,
  PACKAGE_TYPE,
  type PurchasesPackage,
} from 'react-native-purchases';
import { create } from 'zustand';

import { DEV_PREMIUM } from '@/config/features';

/**
 * Zakupy przez RevenueCat.
 *
 * Identyfikator klienta RevenueCat = `auth.uid()` z Supabase — także
 * anonimowy. Gdy rodzic dopnie e-mail / Apple / Google, uid się nie zmienia,
 * więc subskrypcja zostaje przy koncie i przechodzi na inne urządzenia.
 *
 * Ceny i okres próbny przychodzą ze sklepu (`Offerings`) — w aplikacji nie
 * ma ich na sztywno. Bez klucza `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (np. przed
 * konfiguracją RevenueCat) moduł działa jako ATRAPA: przykładowe ceny,
 * w dev udawany zakup, w produkcji „zakupy wkrótce”.
 */
const API_KEY = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY : undefined;
/** Uprawnienie w RevenueCat, które daje pełną wersję. */
export const ENTITLEMENT_ID = 'premium';

export type PlanId = 'monthly' | 'yearly';

export type Plan = {
  id: PlanId;
  title: string;
  /** Cena ze sklepu w walucie i formacie rodzica, np. „19,99 zł”. */
  price: string;
  period: string;
  /** Dni za darmo; 0 = bez okresu próbnego. */
  trialDays: number;
  note?: string;
  /** Pakiet RevenueCat — brak w trybie atrapy. */
  pkg?: PurchasesPackage;
};

/** Atrapa — gdy RevenueCat nie jest skonfigurowany albo nie odpowiada. */
const MOCK_PLANS: Plan[] = [
  { id: 'yearly', title: 'Roczny', price: '99,99 zł', period: 'rok', trialDays: 0, note: 'ok. 8,33 zł miesięcznie' },
  { id: 'monthly', title: 'Miesięczny', price: '19,99 zł', period: 'miesiąc', trialDays: 3 },
];

type EntitlementState = {
  premium: boolean;
  plans: Plan[];
  /** RevenueCat skonfigurowany i oferta pobrana. */
  live: boolean;
  setPremium: (premium: boolean) => void;
};

export const useEntitlementStore = create<EntitlementState>((set) => ({
  premium: false,
  plans: MOCK_PLANS,
  live: false,
  setPremium: (premium) => set({ premium }),
}));

/** Plany do pokazania na paywallu — ze sklepu albo przykładowe. */
export function usePlans(): Plan[] {
  return useEntitlementStore((s) => s.plans);
}

function hasPremium(info: CustomerInfo): boolean {
  return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

function trialDaysOf(pkg: PurchasesPackage): number {
  const intro = pkg.product.introPrice;
  if (!intro || intro.price > 0) return 0;
  const n = intro.periodNumberOfUnits;
  switch (intro.periodUnit) {
    case 'DAY':
      return n;
    case 'WEEK':
      return n * 7;
    case 'MONTH':
      return n * 30;
    default:
      return 0;
  }
}

function planFrom(pkg: PurchasesPackage): Plan | null {
  if (pkg.packageType === PACKAGE_TYPE.ANNUAL) {
    const perMonth = pkg.product.pricePerMonthString;
    return {
      id: 'yearly',
      title: 'Roczny',
      price: pkg.product.priceString,
      period: 'rok',
      trialDays: trialDaysOf(pkg),
      note: perMonth ? `ok. ${perMonth} miesięcznie` : undefined,
      pkg,
    };
  }
  if (pkg.packageType === PACKAGE_TYPE.MONTHLY) {
    return {
      id: 'monthly',
      title: 'Miesięczny',
      price: pkg.product.priceString,
      period: 'miesiąc',
      trialDays: trialDaysOf(pkg),
      pkg,
    };
  }
  return null;
}

let configuredFor: string | null = null;

/**
 * Łączy RevenueCat z kontem gracza. Wołane przy każdej zmianie sesji
 * (pierwsze uruchomienie, „Mam już konto”, wylogowanie).
 */
export async function initPurchases(userId: string): Promise<void> {
  if (!API_KEY || configuredFor === userId) return;
  try {
    if (configuredFor === null) {
      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN);
      Purchases.configure({ apiKey: API_KEY, appUserID: userId });
      Purchases.addCustomerInfoUpdateListener((info) => {
        useEntitlementStore.getState().setPremium(hasPremium(info));
      });
    } else {
      await Purchases.logIn(userId);
    }
    configuredFor = userId;

    const info = await Purchases.getCustomerInfo();
    useEntitlementStore.getState().setPremium(hasPremium(info));

    const offerings = await Purchases.getOfferings();
    const plans = (offerings.current?.availablePackages ?? [])
      .map(planFrom)
      .filter((p): p is Plan => p !== null)
      // Roczny pierwszy — tak układa je paywall.
      .sort((a) => (a.id === 'yearly' ? -1 : 1));
    if (plans.length > 0) useEntitlementStore.setState({ plans, live: true });
  } catch (e) {
    // Bez sieci albo bez oferty — paywall pokaże ceny przykładowe, a zakup
    // spróbuje jeszcze raz pobrać ofertę.
    if (__DEV__) console.warn('[purchases] RevenueCat:', e);
  }
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'unavailable' | 'failed';

export async function purchase(planId: PlanId): Promise<PurchaseResult> {
  const plan = useEntitlementStore.getState().plans.find((p) => p.id === planId);
  if (!API_KEY || !plan?.pkg) {
    // Atrapa: w dev udajemy zakup, w produkcji — „zakupy wkrótce”.
    if (!__DEV__) return 'unavailable';
    await new Promise((r) => setTimeout(r, 700));
    useEntitlementStore.getState().setPremium(true);
    return 'purchased';
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    const ok = hasPremium(customerInfo);
    useEntitlementStore.getState().setPremium(ok);
    return ok ? 'purchased' : 'failed';
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return 'cancelled';
    if (__DEV__) console.warn('[purchases] zakup:', e);
    return 'failed';
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!API_KEY || !configuredFor) {
    await new Promise((r) => setTimeout(r, 500));
    return useEntitlementStore.getState().premium;
  }
  try {
    const info = await Purchases.restorePurchases();
    const ok = hasPremium(info);
    useEntitlementStore.getState().setPremium(ok);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Czy gracz ma pełną wersję. W dev można wymusić stan flagą `DEV_PREMIUM`
 * (src/config/features.ts), żeby oglądać obie wersje bez kupowania.
 */
export function usePremium(): boolean {
  const premium = useEntitlementStore((s) => s.premium);
  if (DEV_PREMIUM === 'premium') return true;
  if (DEV_PREMIUM === 'free') return false;
  return premium;
}

export function isPremiumNow(): boolean {
  if (DEV_PREMIUM === 'premium') return true;
  if (DEV_PREMIUM === 'free') return false;
  return useEntitlementStore.getState().premium;
}
