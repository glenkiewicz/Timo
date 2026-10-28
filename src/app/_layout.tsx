import '@/global.css';

import {
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
  Gabarito_800ExtraBold,
} from '@expo-google-fonts/gabarito';
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import { setAudioModeAsync } from 'expo-audio';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashWarmup } from '@/components/SplashWarmup';
import { InfoSheetProvider } from '@/components/sheet/InfoSheet';
import { sfx } from '@/lib/audio/sfx';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useStartSeen } from '@/lib/stores/session-store';
import { useNeedsOnboarding, useOnboardingStore } from '@/lib/stores/onboarding-store';
import { initPurchases } from '@/lib/purchases';
import { useSplashGate } from '@/lib/stores/splash-gate';

SplashScreen.preventAutoHideAsync();

const SCENE_WAIT_MS = 2500;

export default function RootLayout() {
  // Gabarito niesie nagłówki, liczby i przyciski; Lexend jest krojem do
  // czytania — powstał po to, żeby dzieciom czytało się płynniej.
  const [loaded, error] = useFonts({
    Gabarito: Gabarito_400Regular,
    'Gabarito-Medium': Gabarito_500Medium,
    'Gabarito-SemiBold': Gabarito_600SemiBold,
    'Gabarito-Bold': Gabarito_700Bold,
    'Gabarito-ExtraBold': Gabarito_800ExtraBold,
    Lexend: Lexend_400Regular,
    'Lexend-Medium': Lexend_500Medium,
    'Lexend-SemiBold': Lexend_600SemiBold,
    'Lexend-Bold': Lexend_700Bold,
    'Lexend-ExtraBold': Lexend_800ExtraBold,
    'Lexend-Black': Lexend_900Black,
  });

  const init = useAuthStore((s) => s.init);
  const initializing = useAuthStore((s) => s.initializing);
  const session = useAuthStore((s) => s.session);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const startSeen = useStartSeen(activeProfileId);
  const onboardingHydrated = useOnboardingStore((s) => s.hydrated);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const needsOnboarding = useNeedsOnboarding();

  useEffect(() => init(), [init]);
  // RevenueCat zna gracza po tym samym uid co Supabase (także anonimowym) —
  // subskrypcja idzie za kontem rodzica na każde urządzenie.
  const userId = session?.user.id;
  useEffect(() => {
    if (userId) void initPurchases(userId);
  }, [userId]);
  // Efekty ładujemy od razu — pierwsze stuknięcie nie może czekać na plik.
  useEffect(() => sfx.preload(), []);

  const fontsReady = loaded || error;
  // Splash trzyma się do czasu, aż wiadomo, KTÓRY ekran pokazać. Bez tego
  // przez moment widać ekran gry, zanim wskoczy logowanie — a Timo zdąży
  // odpalić powitanie.
  const appReady = fontsReady && !initializing && onboardingHydrated && authHydrated;
  // Na Androidzie splash czeka też na tło Menu i liska (`SplashWarmup`).
  const [warm, setWarm] = useState(Platform.OS !== 'android');
  const ready = appReady && warm;

  // …a gdy start prowadzi na polanę (Menu albo „Cześć!”), także na jej
  // narysowanie — ekran buduje się już pod splashem. Bez tego pierwsze Menu
  // pokazywało przez chwilę samo zielone tło. Najwyżej `SCENE_WAIT_MS`.
  const toScene =
    Platform.OS === 'android' && !needsOnboarding && Boolean(session) && Boolean(activeProfileId);
  const sceneShown = useSplashGate((s) => s.sceneShown);
  const [sceneWaitOver, setSceneWaitOver] = useState(false);
  useEffect(() => {
    if (!ready || !toScene) return;
    const t = setTimeout(() => setSceneWaitOver(true), SCENE_WAIT_MS);
    return () => clearTimeout(t);
  }, [ready, toScene]);
  const splashDone = ready && (!toScene || sceneShown || sceneWaitOver);

  useEffect(() => {
    if (splashDone) {
      SplashScreen.hideAsync();
    }
  }, [splashDone]);

  useEffect(() => {
    // Głos Timo gra też przy iPhone "silent mode" i ścisza inne aplikacje.
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    }).catch((e) => {
      if (__DEV__) console.warn('[Audio] setAudioModeAsync failed:', e);
    });
  }, []);

  if (!ready) {
    return warm ? null : <SplashWarmup onDone={() => setWarm(true)} />;
  }

  const signedIn = Boolean(session);
  const playing = signedIn && Boolean(activeProfileId);

  return (
    <>
      <EntryRedirect
        onboarding={needsOnboarding}
        signedIn={signedIn}
        playing={playing}
        startSeen={startSeen}
      />
      <TransitionSound />
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Wysuwane panele z opisem na ekranach bez doku (gra, wynik).
            Zakładki mają własny provider, który kończy panel nad dokiem. */}
        <InfoSheetProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {/* Trasy chronione nie renderują się wcale, dopóki warunek jest
              fałszywy — dzięki temu ekran gry nie mignie przed logowaniem. */}
          {/* Pierwsze uruchomienie: Timo się przedstawia, zanim cokolwiek
              innego — także zanim pojawi się wybór dziecka. */}
          <Stack.Protected guard={needsOnboarding}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={!signedIn && !needsOnboarding}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          {/* „Kto gra?” także w trakcie gry — otwierany ze strefy rodzica
              (zmiana dziecka, nowy profil). Wcześniej był chroniony warunkiem
              „nikt nie gra” i przejście ze strefy rodzica po cichu przepadało. */}
          <Stack.Protected guard={signedIn && !needsOnboarding}>
            <Stack.Screen name="profiles" />
          </Stack.Protected>

          {/* Konto rodzica (zapis postępów / logowanie) — z profili i z gry. */}
          <Stack.Protected guard={signedIn}>
            <Stack.Screen name="account" />
          </Stack.Protected>

          {/* Ekran startowy przy KAŻDYM uruchomieniu, jak ekran tytułowy
              w grach. Dopóki dziecko nie stuknie „Gramy!”, reszta gry jest
              zamknięta. Wyjątek to samo Menu: buduje się pod spodem, żeby po
              „Gramy!” polana była gotowa (na Androidzie inaczej migało zielone
              tło). Menu wita się głosem dopiero, gdy jest widoczne. */}
          <Stack.Protected guard={playing}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>

          <Stack.Protected guard={playing && !startSeen}>
            <Stack.Screen name="start" />
          </Stack.Protected>

          <Stack.Protected guard={playing && startSeen}>
            <Stack.Screen name="game" />
            <Stack.Screen name="result" />
            <Stack.Screen name="expedition-intro/[id]" />
            <Stack.Screen name="animal/[id]" />
            <Stack.Screen name="leaderboard" />
            <Stack.Screen name="help" />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="parent" />
            <Stack.Screen name="free-limit" />
          </Stack.Protected>
        </Stack>
        </InfoSheetProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    </>
  );
}

/**
 * Ustawia ekran wejściowy po zmianie stanu logowania.
 *
 * `Stack.Protected` pilnuje, żeby zablokowany ekran się nie wyrenderował, ale
 * nie przenosi nawigacji tam, gdzie użytkownik ma teraz trafić — bez tego po
 * wylogowaniu zostajemy na trasie, która przestała istnieć.
 *
 * Trasy nie mogą się dublować: `/` należy wyłącznie do `(tabs)`, logowanie ma
 * własny adres `/sign-in`. Wcześniej oba wskazywały `/`, przez co „X" w grze
 * i „Wróć na Polanę" trafiały w zablokowany ekran logowania.
 */
/**
 * Szelest przy przejściu między ekranami stosu (gra, wynik, karta zwierzęcia,
 * wyprawa). Przełączanie zakładek go nie gra — dok ma własne stuknięcie,
 * a dwa dźwięki naraz to już hałas.
 */
function TransitionSound() {
  const segments = useSegments();
  const first = segments[0];
  const prev = useRef<string | undefined>(undefined);
  const path = segments.join('/');
  const prevPath = useRef(path);
  useEffect(() => {
    const tabSwitch = first === '(tabs)' && prev.current === '(tabs)';
    if (prevPath.current !== path && prev.current !== undefined && !tabSwitch) {
      sfx.play('transition');
    }
    prev.current = first;
    prevPath.current = path;
  }, [first, path]);
  return null;
}

function EntryRedirect({
  onboarding,
  signedIn,
  playing,
  startSeen,
}: {
  onboarding: boolean;
  signedIn: boolean;
  playing: boolean;
  startSeen: boolean;
}) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const first = segments[0];
    const inAuth = first === '(auth)';
    const onProfiles = first === 'profiles';
    // Ekran konta otwiera się nad profilami, grą i onboardingiem
    // („Mam już konto”) — nie przekierowujemy.
    if (signedIn && first === 'account') return;
    if (onboarding) {
      if (first !== 'onboarding') router.replace('/onboarding');
      return;
    }

    if (!signedIn) {
      if (!inAuth) router.replace('/(auth)/sign-in');
      return;
    }
    if (!playing) {
      if (!onProfiles) router.replace('/profiles');
      return;
    }
    if (!startSeen) {
      // „Cześć!” kładziemy NA Menu, nie zamiast niego: Menu buduje się pod
      // spodem, więc po „Gramy!” polana jest gotowa.
      if (first === 'start') return;
      if (first === '(tabs)') router.push('/start');
      else router.replace('/(tabs)');
      return;
    }
    // „Kto gra?” wolno otworzyć w trakcie gry — ze strefy rodzica (zmiana
    // dziecka, nowy profil); wcześniej wracało stąd od razu do Menu.
    if (inAuth || first === 'start' || first === 'onboarding') router.replace('/(tabs)');
  }, [onboarding, signedIn, playing, startSeen, segments, router]);

  return null;
}
