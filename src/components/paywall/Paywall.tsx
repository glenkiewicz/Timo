import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { Icon } from '@/components/ui/Icon';
import { LINKS } from '@/config/links';
import { type PlanId, purchase, restorePurchases, usePlans } from '@/lib/purchases';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

import { ParentalGate } from './ParentalGate';

const ART = require('../../../assets/onboarding/paywall.webp');

/**
 * Regulamin i polityka prywatności — Apple wymaga linków na ekranie
 * subskrypcji. Adres strony w src/config/links.ts; pusty = link ukryty.
 */
const LEGAL = { terms: LINKS.terms, privacy: LINKS.privacy };

const BENEFITS = [
  'Gry z Timo bez limitu — ponad 700 zwierząt',
  'Wszystkie 24 wyprawy z przebraniami Timo',
  'Cała kolekcja — wszystkie krainy świata',
  'Jedna subskrypcja dla wszystkich dzieci w rodzinie',
];

/**
 * Paywall — w onboardingu między przypomnieniami a „Hurra!” (ostatnia
 * decyzja rodzica, zanim telefon trafi do dziecka), później po stuknięciu
 * zablokowanej treści. Każdy zakup i link na zewnątrz za bramką rodzicielską.
 * Zamknięcie zawsze możliwe — wersja darmowa działa dalej.
 */
export function Paywall({
  onDone,
  background,
  modal = false,
}: {
  onDone: (purchased: boolean) => void;
  background: string;
  /** Otwarty jako arkusz modalny — wtedy nie ma pod nim paska statusu i górny odstęp systemu robił pustkę. */
  modal?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const top = modal ? 12 : insets.top + 8;
  const [plan, setPlan] = useState<PlanId>('monthly');
  const [gate, setGate] = useState<null | (() => void)>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const plans = usePlans();
  const selected = plans.find((p) => p.id === plan) ?? plans[0];
  const cta = selected.trialDays > 0 ? `Wypróbuj ${selected.trialDays} dni za darmo` : 'Wybieram plan roczny';
  const fine =
    selected.trialDays > 0
      ? `${selected.trialDays} dni za darmo, potem ${selected.price} / ${selected.period}. Anulujesz w każdej chwili w ustawieniach App Store.`
      : `${selected.price} / ${selected.period}, odnawia się automatycznie. Anulujesz w każdej chwili w ustawieniach App Store.`;

  const behindGate = (fn: () => void) => setGate(() => fn);

  const buy = async () => {
    setBusy(true);
    const result = await purchase(plan);
    setBusy(false);
    if (result === 'purchased') {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDone(true);
    } else if (result === 'unavailable') {
      setInfo('Zakupy będą dostępne wkrótce. Na razie grasz w wersji darmowej.');
    } else if (result === 'failed') {
      setInfo('Nie udało się dokończyć zakupu. Sprawdź połączenie i spróbuj jeszcze raz.');
    }
    // 'cancelled' — rodzic zamknął okno Apple, nic nie mówimy.
  };

  const restore = async () => {
    setBusy(true);
    const ok = await restorePurchases();
    setBusy(false);
    if (ok) onDone(true);
    else setInfo('Nie znaleźliśmy subskrypcji na tym koncie Apple.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      {/* Bez przewijania — cały paywall widać od razu. Ilustracja bierze tyle
          miejsca, ile zostaje po treści (do 240 pt), więc na małym telefonie
          maleje. Przy większej wysokości nadmiar idzie w odstęp nad przyciskiem,
          a nie w pustkę wokół ilustracji. */}
      <View style={{ flex: 1, paddingTop: top + 8, paddingHorizontal: 24 }}>
        <View style={{ flexShrink: 1, flexGrow: 0, height: 240, minHeight: 70 }}>
          <Image
            source={ART}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
        </View>
        <Text className="text-center" style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 28, lineHeight: 33 }}>
          Odkryj całego Timo
        </Text>

        <View style={{ marginTop: 14, gap: 10 }}>
          {BENEFITS.map((b) => (
            <View key={b} className="flex-row items-center" style={{ gap: 12 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: UI.primaryPale,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="check" size={16} color={UI.primaryDeep} strokeWidth={3} />
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ flex: 1, color: INK, fontFamily: 'Lexend', fontSize: 16, lineHeight: 21 }}>
                {b}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20, gap: 12 }}>
          {plans.map((p) => {
            const on = p.id === plan;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.selectionAsync();
                  setPlan(p.id);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 22,
                  backgroundColor: on ? UI.foxPale : UI.page,
                  borderWidth: 3,
                  borderColor: on ? UI.fox : UI.pageSlot,
                  boxShadow: on ? 'none' : `${SHADOW.e0}, ${SHADOW.rim}`,
                }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: on ? UI.fox : UI.pageSlot,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: UI.fox }} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>{p.title}</Text>
                  <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 13 }}>
                    {p.trialDays > 0 ? `${p.trialDays} dni za darmo, potem ` : ''}
                    {p.price} / {p.period}
                    {p.note ? ` · ${p.note}` : ''}
                  </Text>
                </View>
                {p.id === 'yearly' ? (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: UI.primary }}>
                    <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 12 }}>NAJTANIEJ</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexGrow: 1, minHeight: 12 }} />

        {info ? (
          <Text
            className="text-center"
            style={{ color: UI.goldDeep, fontFamily: 'Lexend-Bold', fontSize: 13, lineHeight: 18, marginTop: 10 }}>
            {info}
          </Text>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 12 }}>
        <Pressable
          onPress={() => behindGate(() => void buy())}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => ({
            paddingVertical: 17,
            borderRadius: 26,
            alignItems: 'center',
            backgroundColor: UI.fox,
            opacity: busy ? 0.6 : 1,
            boxShadow: pressed ? 'none' : `0px 5px 0px ${UI.foxDeep}`,
            transform: [{ translateY: pressed ? 5 : 0 }],
          })}>
          <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 20 }}>{busy ? 'Chwileczkę…' : cta}</Text>
        </Pressable>
        <Text
          className="text-center"
          style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 11, lineHeight: 15, marginTop: 12 }}>
          {fine}
        </Text>
        <Pressable onPress={() => onDone(false)} accessibilityRole="button" style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, marginTop: 10 }}>
          <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>Może później</Text>
        </Pressable>
        <View className="flex-row justify-center" style={{ gap: 20, marginTop: 6 }}>
          <SmallLink label="Przywróć zakupy" onPress={() => behindGate(() => void restore())} />
          {LEGAL.terms ? <SmallLink label="Regulamin" onPress={() => behindGate(() => void Linking.openURL(LEGAL.terms!))} /> : null}
          {LEGAL.privacy ? (
            <SmallLink label="Prywatność" onPress={() => behindGate(() => void Linking.openURL(LEGAL.privacy!))} />
          ) : null}
        </View>
      </View>

      {/* X w samym rogu, nad treścią — w wierszu nad ilustracją zjadał miejsce
          i odstawał od krawędzi. */}
      <Pressable
        onPress={() => onDone(false)}
        accessibilityRole="button"
        accessibilityLabel="Zamknij"
        hitSlop={8}
        className="w-10 h-10 items-center justify-center rounded-pill"
        style={{ position: 'absolute', top, right: 14, backgroundColor: UI.pageSlot }}>
        <Icon name="close" size={18} color={UI.pageFaint} strokeWidth={2.6} />
      </Pressable>

      <ParentalGate
        visible={gate !== null}
        onCancel={() => setGate(null)}
        onPass={() => {
          const fn = gate;
          setGate(null);
          fn?.();
        }}
      />
    </View>
  );
}

function SmallLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={{ padding: 4 }}>
      <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 12, textDecorationLine: 'underline' }}>{label}</Text>
    </Pressable>
  );
}
