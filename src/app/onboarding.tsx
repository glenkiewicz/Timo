import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { AVATARS } from '@/data/avatars';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useContentWidth } from '@/lib/layout';
import { enableDailyReminder } from '@/lib/reminders';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { supabase } from '@/lib/supabase';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Tło ekranu = tło ilustracji (scripts/generate-onboarding-art.py wyrównuje
 * je co do piksela), więc obrazek nie ma krawędzi — jak w Finchu.
 */
const BG = '#fef6e5';

type Info = { kind: 'info'; art: number; title: string; text: string };
type Step = Info | { kind: 'name' } | { kind: 'age' } | { kind: 'reminder' };

/** Karty informacyjne — kolejność = kwestie `ONBOARDING_LINES` (`onboarding.N`). */
const INFO: Info[] = [
  {
    kind: 'info',
    art: require('../../assets/onboarding/hello.webp'),
    title: 'Poznaj Timo!',
    text: 'Rudy lisek detektyw, który zgaduje zwierzęta. Dziecko myśli, a Timo pyta.',
  },
  {
    kind: 'info',
    art: require('../../assets/onboarding/guess.webp'),
    title: 'Ty myślisz, Timo zgaduje',
    text: 'Pomyśl o zwierzęciu i odpowiadaj na pytania: tak, nie, nie wiem albo to zależy.',
  },
  {
    kind: 'info',
    art: require('../../assets/onboarding/ways.webp'),
    title: 'Graj, jak lubisz',
    text: 'Ponad 700 zwierząt, codzienna Wyprawa Dnia i 24 wyprawy, na które Timo zakłada przebrania.',
  },
  {
    kind: 'info',
    art: require('../../assets/onboarding/collect.webp'),
    title: 'Zbieraj i odkrywaj',
    text: 'Każde zwierzę trafia do kolekcji — z ciekawostkami i mapą. Do tego odznaki i poziomy.',
  },
  {
    kind: 'info',
    art: require('../../assets/onboarding/parent.webp'),
    title: 'Bezpiecznie dla dziecka',
    text: 'Bez reklam i czatów. Konto nie jest wymagane — postępy zapiszesz, kiedy zechcesz.',
  },
];

const STEPS: Step[] = [...INFO, { kind: 'name' }, { kind: 'age' }, { kind: 'reminder' }];
const FIRST_QUESTION = INFO.length;

const AGES = [
  { id: '3-5', label: '3–5 lat' },
  { id: '6-8', label: '6–8 lat' },
  { id: '9+', label: '9 lat i więcej' },
] as const;

/**
 * Onboarding w stylu Fincha — spokojny, osobny od gry: gładkie kremowe tło,
 * pasek postępu, jedna ilustracja i jedna myśl na ekran. Na kartach Timo
 * mówi swoją kwestię. Potem trzy pytania: imię i awatar dziecka (od razu
 * zakładamy profil — bez osobnego „Kto gra?”), wiek i przypomnienia.
 * Miejsce na paywall: po kartach, przed pytaniami (część C).
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const contentW = useContentWidth();
  const markDone = useOnboardingStore((s) => s.markDone);
  const session = useAuthStore((s) => s.session);
  const createProfile = useAuthStore((s) => s.createProfile);
  const selectProfile = useAuthStore((s) => s.selectProfile);
  const busy = useAuthStore((s) => s.busy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const hydrateFromServer = useProfileStore((s) => s.hydrateFromServer);

  const [step, setStep] = useState(0);
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [age, setAge] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const current = STEPS[step];
  // Bez sesji (anonimowe konto się nie założyło) nie ma gdzie zapisać
  // profilu — po kartach od razu kończymy, a dalej jest stary ekran logowania.
  const lastStep = session ? STEPS.length - 1 : FIRST_QUESTION - 1;

  useEffect(() => {
    if (current.kind === 'info') void timoVoice.playLine(`onboarding.${step}`);
    else timoVoice.stop();
  }, [step, current.kind]);
  useEffect(() => () => timoVoice.stop(), []);

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };
  const go = (to: number) => {
    tap();
    clearError();
    setStep(Math.max(0, Math.min(lastStep, to)));
  };

  const finish = async (reminder: boolean) => {
    if (finishing) return;
    setFinishing(true);
    timoVoice.stop();
    if (session) {
      const id = await createProfile(nick, avatar);
      if (!id) {
        setFinishing(false);
        setStep(FIRST_QUESTION);
        return;
      }
      // Kolumna z migracji 0004 — bez niej zapis się nie uda, ale to tylko
      // informacja na przyszłość, więc profil i tak powstaje.
      if (age) void supabase.from('profiles').update({ age_band: age }).eq('id', id);
      if (reminder) await enableDailyReminder().catch(() => false);
      selectProfile(id);
      await hydrateFromServer(id);
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markDone();
  };

  const art = Math.min(contentW - 48, 380);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* ---------- pasek: wstecz, postęp, pomiń ---------- */}
      <View
        className="flex-row items-center"
        style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, gap: 12 }}>
        <Pressable
          onPress={() => go(step - 1)}
          disabled={step === 0}
          accessibilityRole="button"
          accessibilityLabel="Wstecz"
          className="w-10 h-10 items-center justify-center rounded-pill"
          style={{ opacity: step === 0 ? 0 : 1 }}>
          <Icon name="arrow-left" size={22} color={INK} strokeWidth={2.6} />
        </Pressable>
        <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: UI.pageSlot, overflow: 'hidden' }}>
          <View
            style={{
              width: `${((step + 1) / (lastStep + 1)) * 100}%`,
              height: '100%',
              borderRadius: 5,
              backgroundColor: UI.fox,
            }}
          />
        </View>
        <Pressable
          onPress={() => go(FIRST_QUESTION)}
          disabled={step >= FIRST_QUESTION - 1}
          accessibilityRole="button"
          style={{ opacity: step >= FIRST_QUESTION - 1 ? 0 : 1, paddingHorizontal: 4 }}>
          <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>Pomiń</Text>
        </Pressable>
      </View>

      {/* ---------- treść kroku ---------- */}
      <Animated.View
        key={step}
        entering={FadeIn.duration(260)}
        style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
        {current.kind === 'info' ? (
          <View className="items-center">
            <Image
              source={current.art}
              style={{ width: art, height: art }}
              contentFit="contain"
              transition={0}
              accessible={false}
            />
            <Title>{current.title}</Title>
            <Lead>{current.text}</Lead>
          </View>
        ) : null}

        {current.kind === 'name' ? (
          <View>
            <Title>Jak ma na imię dziecko?</Title>
            <Lead>Timo będzie się tak do niego zwracał. Imię widzi tylko ta aplikacja.</Lead>
            <View style={{ marginTop: 22 }}>
              <Field
                label="IMIĘ DZIECKA"
                value={nick}
                onChangeText={(t) => {
                  clearError();
                  setNick(t);
                }}
                placeholder="np. Zosia"
                autoCapitalize="words"
                maxLength={20}
              />
            </View>
            <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 12, marginTop: 18 }}>
              AWATAR
            </Text>
            <View className="flex-row flex-wrap" style={{ gap: 10, marginTop: 8 }}>
              {AVATARS.map((a) => (
                <Pressable
                  key={a}
                  onPress={() => {
                    tap();
                    setAvatar(a);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: avatar === a }}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: avatar === a ? UI.foxPale : UI.page,
                    borderWidth: 3,
                    borderColor: avatar === a ? UI.fox : 'transparent',
                    boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
                  }}>
                  <Text style={{ fontSize: 30 }}>{a}</Text>
                </Pressable>
              ))}
            </View>
            {error ? (
              <Text style={{ color: UI.dangerDeep, fontFamily: 'Lexend-Bold', fontSize: 13, marginTop: 12 }}>
                {error}
              </Text>
            ) : null}
          </View>
        ) : null}

        {current.kind === 'age' ? (
          <View>
            <Title>{nick.trim() ? `Ile lat ma ${nick.trim()}?` : 'Ile lat ma dziecko?'}</Title>
            <Lead>Pomoże nam dopasować zabawę. Możesz to pominąć.</Lead>
            <View style={{ marginTop: 22, gap: 12 }}>
              {AGES.map((a) => (
                <Choice
                  key={a.id}
                  label={a.label}
                  selected={age === a.id}
                  onPress={() => {
                    setAge(a.id);
                    go(step + 1);
                  }}
                />
              ))}
            </View>
          </View>
        ) : null}

        {current.kind === 'reminder' ? (
          <View className="items-center">
            <Image
              source={INFO[0].art}
              style={{ width: art * 0.7, height: art * 0.7 }}
              contentFit="contain"
              transition={0}
              accessible={false}
            />
            <Title>Przypominać o Wyprawie Dnia?</Title>
            <Lead>Raz dziennie, o 17:00, Timo da znać, że czeka nowa wyprawa. Wyłączysz to w ustawieniach telefonu.</Lead>
          </View>
        ) : null}
      </Animated.View>

      {/* ---------- przyciski ---------- */}
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16, gap: 10 }}>
        {current.kind === 'info' ? (
          <>
            <MainButton
              label={step === lastStep ? 'Zaczynamy!' : 'Dalej'}
              onPress={() => (step === lastStep ? void finish(false) : go(step + 1))}
            />
            {step === FIRST_QUESTION - 1 ? (
              <TextButton label="Mam już konto — zaloguj się" onPress={() => router.push('/account')} />
            ) : null}
          </>
        ) : null}
        {current.kind === 'name' ? (
          <MainButton label="Dalej" disabled={nick.trim().length === 0} onPress={() => go(step + 1)} />
        ) : null}
        {current.kind === 'age' ? <TextButton label="Pomiń" onPress={() => go(step + 1)} /> : null}
        {current.kind === 'reminder' ? (
          <>
            <MainButton
              label={finishing || busy ? 'Chwileczkę…' : 'Tak, przypominaj'}
              disabled={finishing}
              onPress={() => void finish(true)}
            />
            <TextButton label="Nie teraz" onPress={() => void finish(false)} />
          </>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function Title({ children }: { children: string }) {
  return (
    <Text
      className="text-center"
      style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 28, lineHeight: 34, marginTop: 18 }}>
      {children}
    </Text>
  );
}

function Lead({ children }: { children: string }) {
  return (
    <Text
      className="text-center"
      style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 17, lineHeight: 24, marginTop: 8 }}>
      {children}
    </Text>
  );
}

function MainButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        paddingVertical: 17,
        borderRadius: 26,
        alignItems: 'center',
        backgroundColor: UI.fox,
        opacity: disabled ? 0.45 : 1,
        boxShadow: pressed || disabled ? 'none' : `0px 5px 0px ${UI.foxDeep}`,
        transform: [{ translateY: pressed ? 5 : 0 }],
      })}>
      <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 21 }}>{label}</Text>
    </Pressable>
  );
}

function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ alignSelf: 'center', padding: 8 }}>
      <Text style={{ color: UI.pageFaint, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 22,
        backgroundColor: selected ? UI.foxPale : UI.page,
        borderWidth: 3,
        borderColor: selected ? UI.fox : 'transparent',
        boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
      }}>
      <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 19 }}>{label}</Text>
    </Pressable>
  );
}
