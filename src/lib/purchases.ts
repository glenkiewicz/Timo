import { create } from 'zustand';

/**
 * Zakupy — NA RAZIE ATRAPA. Docelowo RevenueCat (`react-native-purchases`):
 * ceny i trial przyjdą ze sklepu (`Offerings`), a status z `CustomerInfo`
 * i webhooka do Supabase. Dopóki nie ma produktów w App Store Connect,
 * `purchase` tylko udaje zakup w trybie deweloperskim.
 */
export type PlanId = 'monthly' | 'yearly';

export type Plan = {
  id: PlanId;
  title: string;
  /** Cena do wyświetlenia — PRZYKŁADOWA, docelowo `product.priceString` ze sklepu. */
  price: string;
  period: string;
  /** Dni za darmo; 0 = bez okresu próbnego. */
  trialDays: number;
  note?: string;
};

export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Roczny', price: '99,99 zł', period: 'rok', trialDays: 0, note: 'ok. 8,33 zł miesięcznie' },
  { id: 'monthly', title: 'Miesięczny', price: '19,99 zł', period: 'miesiąc', trialDays: 3 },
];

type EntitlementState = {
  premium: boolean;
  setPremium: (premium: boolean) => void;
};

export const useEntitlementStore = create<EntitlementState>((set) => ({
  premium: false,
  setPremium: (premium) => set({ premium }),
}));

/** Zwraca, czy zakup się udał. Anulowanie przez rodzica to `false`, nie błąd. */
export async function purchase(plan: PlanId): Promise<boolean> {
  if (!__DEV__) return false;
  await new Promise((r) => setTimeout(r, 700));
  if (__DEV__) console.log(`[purchases] ATRAPA: kupiono plan ${plan}`);
  useEntitlementStore.getState().setPremium(true);
  return true;
}

export async function restorePurchases(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  return useEntitlementStore.getState().premium;
}
