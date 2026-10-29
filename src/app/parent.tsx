import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { Icon } from '@/components/ui/Icon';
import { LINKS } from '@/config/links';
import { STORE } from '@/config/store';
import { LOCK_ART, TOOLTIP_ART } from '@/data/info-tooltips';
import { confirmDeleteAccount } from '@/lib/account-actions';
import { READING_MAX, contentColumn, useUiScale } from '@/lib/layout';
import { restorePurchases, usePremium } from '@/lib/purchases';
import { disableDailyReminder, enableDailyReminder, isDailyReminderOn } from '@/lib/reminders';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ACCENT, SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const ART = {
  parent: require('../../assets/icons/info/parent.png'),
  sound: require('../../assets/icons/info/sound_on.png'),
  paywall: require('../../assets/onboarding/paywall.webp'),
  calendar: TOOLTIP_ART.daily_streak,
  profile: TOOLTIP_ART.level,
  lock: LOCK_ART,
};

const GUTTER = 16;

/**
 * Strefa rodzica — z Menu, tarczą z sercem obok „?” i głośnika, ZAWSZE za
 * bramką rodzicielską. Wcześniej zmiana dziecka, konto rodzica i usunięcie
 * konta były tylko na „Kto gra?”, do którego po onboardingu nie dało się już
 * wrócić — a Apple wymaga usunięcia konta dostępnego w aplikacji (5.1.1(v)).
 */
export default function ParentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const premium = usePremium();

  const childName = useAuthStore((s) => s.profiles.find((p) => p.id === s.activeProfileId)?.nick ?? null);
  const childCount = useAuthStore((s) => s.profiles.length);
  const anonymous = useAuthStore((s) => s.session?.user.is_anonymous === true);
  const email = useAuthStore((s) => s.session?.user.email ?? null);
  const signOut = useAuthStore((s) => s.signOut);

  const [reminder, setReminder] = useState<boolean | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    isDailyReminderOn()
      .then(setReminder)
      .catch(() => setReminder(false));
  }, []);

  const toggleReminder = async (on: boolean) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    if (on) {
      const ok = await enableDailyReminder().catch(() => false);
      setReminder(ok);
      if (!ok) {
        Alert.alert(
          'Powiadomienia są wyłączone',
          'Żeby Timo mógł przypominać o Wyprawie Dnia, włącz powiadomienia dla Timo w Ustawieniach telefonu.',
          [
            { text: 'Nie teraz', style: 'cancel' },
            { text: 'Otwórz Ustawienia', onPress: () => void Linking.openSettings() },
          ],
        );
      }
    } else {
      await disableDailyReminder().catch(() => undefined);
      setReminder(false);
    }
  };

  const restore = async () => {
    setRestoring(true);
    const ok = await restorePurchases();
    setRestoring(false);
    Alert.alert(
      ok ? 'Gotowe!' : 'Nie znaleźliśmy subskrypcji',
      ok ? 'Pełna wersja jest aktywna na tym urządzeniu.' : `Nie ma aktywnej subskrypcji Timo ${STORE.account}.`,
    );
  };

  const confirmSignOut = () => {
    Alert.alert('Wylogować konto rodzica?', 'Postępy zostają na koncie — zalogujesz się nim ponownie na dowolnym urządzeniu.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Wyloguj',
        style: 'destructive',
        // Po wylogowaniu od razu logowanie — rodzic zwykle przełącza konto.
        // Wstecz prowadzi na „Kto gra?” na nowym, pustym telefonie.
        onPress: () => void signOut().then(() => router.push({ pathname: '/account', params: { mode: 'login' } })),
      },
    ]);
  };

  const version = Constants.expoConfig?.version ?? '';

  return (
    <View className="flex-1" style={{ backgroundColor: UI.page }}>
      <Image
        source={require('../../assets/backgrounds/collection.webp')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...contentColumn,
          maxWidth: READING_MAX,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 28,
        }}>
        <View className="flex-row items-center" style={{ paddingHorizontal: GUTTER, gap: 12 }}>
          <BackButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} />
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>Dla rodzica</Text>
        </View>
        <Text
          style={{
            color: UI.textSoft,
            fontFamily: 'Lexend',
            fontSize: 15,
            lineHeight: 21,
            marginTop: 10,
            paddingHorizontal: GUTTER + 4,
          }}>
          Ustawienia, konto i subskrypcja. Ta część jest tylko dla dorosłych.
        </Text>

        <SectionHeader title="Dzieci" />
        <ActionRow
          art={ART.profile}
          tint="primary"
          title={childName ? `Teraz gra: ${childName}` : 'Profile dzieci'}
          subtitle={childCount > 1 ? 'Zmień dziecko albo dodaj nowy profil' : 'Dodaj profil kolejnego dziecka'}
          onPress={() => router.push('/profiles')}
        />

        <SectionHeader title="Konto rodzica" />
        {anonymous ? (
          <ActionRow
            art={ART.parent}
            tint="fox"
            title="Załóż konto rodzica"
            subtitle="Zapisz postępy i graj na innym telefonie lub iPadzie"
            onPress={() => router.push('/account')}
          />
        ) : (
          <>
            <InfoRow art={ART.parent} tint="fox" title="Zalogowano" subtitle={email ?? 'Konto Apple lub Google'} />
            <ActionRow art={ART.lock} tint="violet" title="Wyloguj konto rodzica" onPress={confirmSignOut} />
          </>
        )}

        <SectionHeader title="Pełna wersja" />
        {premium ? (
          <>
            <InfoRow art={ART.paywall} tint="gold" title="Pełna wersja aktywna" subtitle="Gry bez limitu, wszystkie wyprawy i cała kolekcja" />
            <ActionRow
              art={ART.paywall}
              tint="gold"
              title="Zarządzaj subskrypcją"
              subtitle={`Zmiana planu lub anulowanie ${STORE.where}`}
              onPress={() => void Linking.openURL(STORE.manageUrl)}
            />
          </>
        ) : (
          <ActionRow
            art={ART.paywall}
            tint="gold"
            title="Odblokuj pełną wersję"
            subtitle="Gry bez limitu, wszystkie 24 wyprawy i cała kolekcja"
            onPress={() => router.push('/paywall')}
          />
        )}
        <ActionRow
          art={ART.paywall}
          tint="sky"
          title={restoring ? 'Sprawdzam…' : 'Przywróć zakupy'}
          subtitle="Masz już subskrypcję na innym urządzeniu?"
          onPress={() => (restoring ? undefined : void restore())}
        />

        <SectionHeader title="Przypomnienia" />
        <ToggleRow
          art={ART.calendar}
          tint="sky"
          title="Wyprawa Dnia"
          subtitle="Codziennie o 17:00 Timo przypomni o nowej wyprawie"
          value={reminder === true}
          disabled={reminder === null}
          onChange={(on) => void toggleReminder(on)}
        />

        <SectionHeader title="Informacje" />
        {LINKS.privacy ? (
          <ActionRow art={ART.lock} tint="violet" title="Polityka prywatności" onPress={() => void Linking.openURL(LINKS.privacy!)} />
        ) : null}
        {LINKS.terms ? (
          <ActionRow art={ART.lock} tint="violet" title="Regulamin" onPress={() => void Linking.openURL(LINKS.terms!)} />
        ) : null}
        {LINKS.support ? (
          <ActionRow
            art={ART.sound}
            tint="primary"
            title="Pomoc i kontakt"
            subtitle="kontakt@zgadujztimo.pl"
            onPress={() => void Linking.openURL(LINKS.support!)}
          />
        ) : null}

        <SectionHeader title="Usuwanie danych" />
        <ActionRow
          art={ART.lock}
          tint="danger"
          title="Usuń konto i wszystkie dane"
          subtitle="Profile dzieci, kolekcje i postępy — z telefonu i z serwera"
          danger
          onPress={confirmDeleteAccount}
        />

        <Text
          style={{
            color: UI.textFaint,
            fontFamily: 'Lexend',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 18,
          }}>
          Timo – zgadnij zwierzę{version ? ` · wersja ${version}` : ''}
        </Text>
      </ScrollView>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  const k = useUiScale();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Wróć"
      className="items-center justify-center rounded-pill"
      style={{ width: 44 * k, height: 44 * k, backgroundColor: UI.page, boxShadow: `${SHADOW.e0}, ${SHADOW.rim}` }}>
      <Icon name="arrow-left" size={22 * k} color={INK} strokeWidth={2.6} />
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View
      className="flex-row items-center"
      style={{ marginHorizontal: GUTTER + 6, marginTop: 24, marginBottom: 10, gap: 12 }}>
      <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 19 }}>{title}</Text>
      <View style={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: UI.lineDeep }} />
    </View>
  );
}

const CARD = {
  marginHorizontal: GUTTER,
  marginBottom: 10,
  borderRadius: 26,
  backgroundColor: UI.page,
  boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
} as const;

type RowBase = { art: number; tint: keyof typeof ACCENT; title: string; subtitle?: string };

/** Obrazek w plamie, tytuł i opis — ten sam układ co wiersze w „Jak grać z Timo”. */
function RowBody({ art, tint, title, subtitle, danger, right }: RowBase & { danger?: boolean; right?: ReactNode }) {
  const k = useUiScale();
  const blob = 52 * k;
  return (
    <View className="flex-row items-center" style={[CARD, { padding: 12, paddingRight: 16, gap: 14 }]}>
      <View
        style={{
          width: blob,
          height: blob,
          borderRadius: 20 * k,
          backgroundColor: ACCENT[tint].pale,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Image source={art} style={{ width: blob * 0.8, height: blob * 0.8 }} contentFit="contain" transition={0} accessible={false} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? UI.danger : INK, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: UI.textSoft, fontFamily: 'Lexend', fontSize: 14, lineHeight: 19, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

function ActionRow({ onPress, danger, ...row }: RowBase & { onPress: () => void; danger?: boolean }) {
  const k = useUiScale();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={row.title}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <RowBody {...row} danger={danger} right={<Icon name="chevron-right" size={20 * k} color={UI.textSoft} strokeWidth={2.6} />} />
    </Pressable>
  );
}

function InfoRow(row: RowBase) {
  return <RowBody {...row} />;
}

function ToggleRow({
  value,
  disabled,
  onChange,
  ...row
}: RowBase & { value: boolean; disabled?: boolean; onChange: (on: boolean) => void }) {
  return (
    <RowBody
      {...row}
      right={
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={onChange}
          trackColor={{ true: UI.fox, false: UI.lineDeep }}
          accessibilityLabel={row.title}
        />
      }
    />
  );
}
