import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { ACCENT, UI, type Accent } from '@/theme/ui';
import { View } from '@/tw';

type ProgressBarProps = {
  /** 0–1. Wartości spoza zakresu są przycinane. */
  value: number;
  accent?: Accent;
  height?: number;
  /** Skąd startuje animacja przy pierwszym renderze (np. stan sprzed nagrody). */
  from?: number;
  delayMs?: number;
  durationMs?: number;
  track?: string;
};

/**
 * Pasek postępu — gruby, zaokrąglony, z jasnym refleksem na wypełnieniu.
 */
export function ProgressBar({
  value,
  accent = 'primary',
  height = 16,
  from,
  delayMs = 0,
  durationMs = 700,
  track = UI.line,
}: ProgressBarProps) {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const target = clamp(value);
  const progress = useSharedValue(clamp(from ?? value));

  useEffect(() => {
    progress.value = withDelay(delayMs, withTiming(target, { duration: durationMs }));
  }, [target, delayMs, durationMs, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={{
        height,
        backgroundColor: track,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}>
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: ACCENT[accent].base,
            borderRadius: height / 2,
          },
          fillStyle,
        ]}>
        {/* refleks — pasek jaśniejszy w górnej części wypełnienia */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: height * 0.35,
            right: height * 0.35,
            top: height * 0.2,
            height: height * 0.22,
            borderRadius: height,
            backgroundColor: 'rgba(255,255,255,0.45)',
          }}
        />
      </Animated.View>
    </View>
  );
}
