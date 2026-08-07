import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/tw';

type FloatingDeltaProps = {
  value: number;
  /** ms before badge starts appearing */
  delayMs?: number;
  /** total visible time in ms (fade-in + hold + fade-out) */
  totalMs?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function FloatingDelta({
  value,
  delayMs = 0,
  totalMs = 1400,
  color = '#357a2a',
  containerStyle,
}: FloatingDeltaProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = 0;
    const fadeIn = 220;
    const hold = totalMs - fadeIn - 380;
    t.value = withDelay(
      delayMs,
      withSequence(
        withTiming(1, { duration: fadeIn }),
        withTiming(1, { duration: Math.max(0, hold) }),
        withTiming(0, { duration: 380 })
      )
    );
  }, [value, delayMs, totalMs, t]);

  const style = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: -22 * t.value }, { scale: 0.85 + t.value * 0.25 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: -4,
          alignSelf: 'center',
        },
        containerStyle,
        style,
      ]}>
      <Text
        style={{
          fontFamily: 'Fredoka-Bold',
          fontSize: 16,
          color,
          textShadowColor: 'rgba(255,255,255,0.9)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        }}>
        {value > 0 ? `+${value}` : value}
      </Text>
    </Animated.View>
  );
}
