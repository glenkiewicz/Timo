import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Kolor tła i rozmiar grafiki — te same co `expo-splash-screen` w app.json. */
const SPLASH_BG = '#ec8e30';
const ICON_SIZE = 240;

/** Trzy fazy mrugnięcia, ta sama grafika co splash systemowy (scripts/build-splash.py). */
const EYES = {
  open: require('../../assets/images/splash-eyes-open.webp'),
  half: require('../../assets/images/splash-eyes-half.webp'),
  closed: require('../../assets/images/splash-eyes-closed.webp'),
};

/** Pierwsze mrugnięcie zaraz po pokazaniu — na iPhonie ekran znika po ~1 s. */
const FIRST_BLINK_DELAY_MS = 250;
/** Przerwa przed kolejnym (podwójnym) mrugnięciem. */
const BLINK_PAUSE_MS = 1800;
/** Gdyby grafika się nie wczytała — splash systemowy i tak znika. */
const NATIVE_HIDE_FALLBACK_MS = 1500;

/** Jedno mrugnięcie: 0 = oczy otwarte, 1 = zamknięte. Razem ~0,45 s. */
function blink() {
  'worklet';
  return withSequence(
    withTiming(1, { duration: 140, easing: Easing.in(Easing.quad) }),
    withDelay(110, withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) })),
  );
}

/**
 * Mrugający Timo na ekranie startowym.
 *
 * Splash systemowy jest nieruchomy (iOS nie pozwala na animację, a Android
 * tylko na wektorową). Gdy ruszy JS, kładziemy na nim identyczny ekran —
 * to samo tło, ta sama grafika w tym samym miejscu — i chowamy systemowy,
 * gdy nasza pierwsza klatka jest już na ekranie. Przejścia nie widać.
 *
 * Mrugnięcie to trzy obrazki przenikane na wątku UI. Animowany WebP
 * przełączał klatki skokowo, a przy obciążonym starcie gubił je i lisek
 * mrugał „przycinając się”.
 *
 * `onFirstBlink` daje znać, że lisek mrugnął — `RootLayout` nie zdejmuje
 * ekranu wcześniej, bo na szybkim iPhonie mrugnięcia nie byłoby widać.
 */
export function AnimatedSplash({ onFirstBlink }: { onFirstBlink: () => void }) {
  const nativeHidden = useRef(false);
  const hideNative = useRef(() => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    void SplashScreen.hideAsync();
  });

  const shut = useSharedValue(0);
  const started = useRef(false);
  const start = () => {
    hideNative.current();
    if (started.current) return;
    started.current = true;
    shut.value = withDelay(
      FIRST_BLINK_DELAY_MS,
      withSequence(
        blink(),
        withTiming(0, { duration: 0 }, (done) => {
          if (done) runOnJS(onFirstBlink)();
        }),
        withRepeat(withSequence(withDelay(BLINK_PAUSE_MS, blink()), withDelay(120, blink())), -1),
      ),
    );
  };

  useEffect(() => {
    const t = setTimeout(() => {
      hideNative.current();
      onFirstBlink();
    }, NATIVE_HIDE_FALLBACK_MS);
    return () => {
      clearTimeout(t);
      // Start gotowy, zanim pierwsza klatka zdążyła się pokazać.
      hideNative.current();
    };
  }, [onFirstBlink]);

  // Przymknięte oczy wchodzą w pierwszej połowie ruchu, zamknięte w drugiej.
  const halfStyle = useAnimatedStyle(() => ({
    opacity: shut.value <= 0.5 ? shut.value * 2 : 1,
  }));
  const closedStyle = useAnimatedStyle(() => ({
    opacity: shut.value <= 0.5 ? 0 : (shut.value - 0.5) * 2,
  }));

  return (
    <Animated.View
      exiting={FadeOut.duration(250)}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.root]}>
      <Image
        source={EYES.open}
        style={styles.icon}
        onDisplay={start}
        transition={0}
        accessibilityLabel="Timo"
      />
      <Animated.View style={[styles.layer, halfStyle]}>
        <Image source={EYES.half} style={styles.icon} transition={0} />
      </Animated.View>
      <Animated.View style={[styles.layer, closedStyle]}>
        <Image source={EYES.closed} style={styles.icon} transition={0} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: { position: 'absolute' },
  icon: { width: ICON_SIZE, height: ICON_SIZE },
});
