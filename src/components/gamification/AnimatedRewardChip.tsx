import { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Chip } from '@/components/gamification/Chip';
import { TOOLTIPS, type TooltipKey } from '@/data/info-tooltips';
import { Pressable, Text, View } from '@/tw';

import { InfoModal } from './InfoModal';

type ChipVariant = 'brand' | 'reward' | 'success' | 'paper';
type ChipIcon = 'flame' | 'paw' | 'star' | 'medal' | 'leaf' | 'sparkle';

type AnimatedRewardChipProps = {
  tooltipKey: TooltipKey;
  icon: ChipIcon;
  value: number;
  variant?: ChipVariant;
  /** ms before entrance starts */
  delay?: number;
  /** small caption under the chip */
  label?: string;
  prefix?: string;
};

function useCountUp(target: number, durationMs: number, delayMs: number) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const startAt = performance.now() + delayMs;
    const step = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const pct = Math.min(1, elapsed / durationMs);
      // easeOutCubic for satisfying count
      const eased = 1 - Math.pow(1 - pct, 3);
      setVal(Math.round(target * eased));
      if (pct < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, delayMs]);
  return val;
}

export function AnimatedRewardChip({
  tooltipKey,
  icon,
  value,
  variant,
  delay = 0,
  label,
  prefix = '+',
}: AnimatedRewardChipProps) {
  const [open, setOpen] = useState(false);
  const enter = useSharedValue(0);
  const countValue = useCountUp(value, 750, delay + 80);

  useEffect(() => {
    enter.value = 0;
    enter.value = withDelay(
      delay,
      withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.08, { damping: 10, stiffness: 220 }),
        withSpring(1, { damping: 16, stiffness: 240 })
      )
    );
  }, [delay, enter]);

  const style = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * 14 },
      { scale: enter.value === 0 ? 0.7 : enter.value },
    ],
  }));

  return (
    <View className="flex-1 items-center">
      <Animated.View style={style}>
        <Pressable onPress={() => setOpen(true)}>
          <Chip icon={icon} value={`${prefix}${countValue}`} variant={variant} />
        </Pressable>
      </Animated.View>
      {label ? (
        <Text
          className="text-ink-soft mt-1"
          style={{ fontFamily: 'Nunito-Bold', fontSize: 11 }}>
          {label}
        </Text>
      ) : null}
      <InfoModal
        visible={open}
        tooltip={TOOLTIPS[tooltipKey]}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}
