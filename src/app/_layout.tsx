import '@/global.css';

import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { setAudioModeAsync } from 'expo-audio';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from '@/lib/stores/auth-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fredoka: Fredoka_400Regular,
    'Fredoka-Medium': Fredoka_500Medium,
    'Fredoka-SemiBold': Fredoka_600SemiBold,
    'Fredoka-Bold': Fredoka_700Bold,
    Nunito: Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'Nunito-Black': Nunito_900Black,
  });

  const init = useAuthStore((s) => s.init);
  const initializing = useAuthStore((s) => s.initializing);
  const session = useAuthStore((s) => s.session);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);

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
      <EntryRedirect signedIn={signedIn} playing={playing} />
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {/* Trasy chronione nie renderują się wcale, dopóki warunek jest
              fałszywy — dzięki temu ekran gry nie mignie przed logowaniem. */}
          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={signedIn && !playing}>
            <Stack.Screen name="profiles" />
          </Stack.Protected>

          <Stack.Protected guard={playing}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="game" />
            <Stack.Screen name="result" />
            <Stack.Screen name="expedition-intro/[id]" />
            <Stack.Screen name="animal/[id]" />
            <Stack.Screen name="leaderboard" />
          </Stack.Protected>
        </Stack>
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
}: {
  signedIn: boolean;
  playing: boolean;
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
    if (inAuth || onProfiles) router.replace('/(tabs)');
  }, [signedIn, playing, segments, router]);

  return null;
}
