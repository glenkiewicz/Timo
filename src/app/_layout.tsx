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
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InfoSheetProvider } from '@/components/sheet/InfoSheet';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useStartSeen } from '@/lib/stores/session-store';

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => init(), [init]);

  const fontsReady = loaded || error;
  // Splash trzyma się do czasu, aż wiadomo, KTÓRY ekran pokazać. Bez tego
  // przez moment widać ekran gry, zanim wskoczy logowanie — a Timo zdąży
  // odpalić powitanie.
  const ready = fontsReady && !initializing;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

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
    return null;
  }

  const signedIn = Boolean(session);
  const playing = signedIn && Boolean(activeProfileId);

  return (
    <>
      <EntryRedirect signedIn={signedIn} playing={playing} startSeen={startSeen} />
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Wysuwane panele z opisem na ekranach bez doku (gra, wynik).
            Zakładki mają własny provider, który kończy panel nad dokiem. */}
        <InfoSheetProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {/* Trasy chronione nie renderują się wcale, dopóki warunek jest
              fałszywy — dzięki temu ekran gry nie mignie przed logowaniem. */}
          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={signedIn && !playing}>
            <Stack.Screen name="profiles" />
          </Stack.Protected>

          {/* Ekran startowy przy KAŻDYM uruchomieniu, jak ekran tytułowy
              w grach. Dopóki dziecko nie stuknie „Gramy!”, reszta gry jest
              zamknięta — Menu nie montuje się pod spodem, więc Timo nie
              zacznie mówić, zanim dziecko samo zacznie. */}
          <Stack.Protected guard={playing && !startSeen}>
            <Stack.Screen name="start" />
          </Stack.Protected>

          <Stack.Protected guard={playing && startSeen}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="game" />
            <Stack.Screen name="result" />
            <Stack.Screen name="expedition-intro/[id]" />
            <Stack.Screen name="animal/[id]" />
            <Stack.Screen name="leaderboard" />
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
function EntryRedirect({
  signedIn,
  playing,
  startSeen,
}: {
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

    if (!signedIn) {
      if (!inAuth) router.replace('/(auth)/sign-in');
      return;
    }
    if (!playing) {
      if (!onProfiles) router.replace('/profiles');
      return;
    }
    if (!startSeen) {
      if (first !== 'start') router.replace('/start');
      return;
    }
    if (inAuth || onProfiles || first === 'start') router.replace('/(tabs)');
  }, [signedIn, playing, startSeen, segments, router]);

  return null;
}
