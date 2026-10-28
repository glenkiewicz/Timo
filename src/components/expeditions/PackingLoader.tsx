import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { INK } from '@/components/collection/map';
import { SHADOW, UI } from '@/theme/ui';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

const BACKPACK = require('../../../assets/ui/backpack.webp');
const PAW = require('../../../assets/ui/paw.webp');

/**
 * „Timo pakuje plecak” — krótkie czekanie przed wyprawą, gdy przebranie
 * liska jeszcze się pobiera (Android, `outfit-webp.android.ts`). Plecak
 * kołysze się, a ślady łapek zapalają po kolei jak kroki.
 */
export function PackingLoader({ size }: { size: number }) {
  const sway = useSharedValue(0);
  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 450, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 450, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [sway]);
  const backpackStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -Math.abs(sway.value) * size * 0.04 },
      { rotate: `${sway.value * 6}deg` },
    ],
  }));

  return (
    <View style={{ alignItems: 'center' }} accessible accessibilityLabel="Timo pakuje plecak">
      <Animated.View style={backpackStyle}>
        <Image source={BACKPACK} style={{ width: size, height: size }} contentFit="contain" />
      </Animated.View>
      <View style={{ flexDirection: 'row', gap: size * 0.08, marginTop: size * 0.08 }}>
        {[0, 1, 2].map((i) => (
          <Step key={i} index={i} size={size * 0.16} />
        ))}
      </View>
      <View
        style={{
          marginTop: size * 0.1,
          backgroundColor: UI.page,
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 8,
          boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
        }}>
        <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>
          Timo pakuje plecak…
        </Text>
      </View>
    </View>
  );
}

const STEP_MS = 350;

function Step({ index, size }: { index: number; size: number }) {
  const on = useSharedValue(0);
  useEffect(() => {
    on.value = withDelay(
      index * STEP_MS,
      withRepeat(
        withSequence(
          withTiming(1, { duration: STEP_MS }),
          withTiming(0, { duration: STEP_MS }),
          withTiming(0, { duration: STEP_MS }),
        ),
        -1,
      ),
    );
  }, [index, on]);
  // Łapki na przemian lekko w lewo i w prawo — jak ślady kroków.
  const tilt = index % 2 ? 14 : -14;
  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + on.value * 0.7,
    transform: [{ scale: 0.85 + on.value * 0.2 }, { rotate: `${tilt}deg` }],
  }));
  return (
    <Animated.View style={style}>
      <Image source={PAW} style={{ width: size, height: size }} contentFit="contain" />
    </Animated.View>
  );
}
