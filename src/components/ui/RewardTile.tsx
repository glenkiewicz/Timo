import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/ui/Icon';
import { useInfoSheet } from '@/components/sheet/InfoSheet';
import { TOOLTIPS, TOOLTIP_ART, type TooltipKey } from '@/data/info-tooltips';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';


type RewardTileProps = {
  tooltipKey: TooltipKey;
  icon: IconName;
  value: number;
  accent?: Accent;
  /** ms zanim kafel wskoczy */
  delay?: number;
  label?: string;
  prefix?: string;
};

/** Liczenie od zera — nagroda ma się „naliczać", nie pojawiać gotowa. */
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
      const eased = 1 - Math.pow(1 - pct, 3);
      setVal(Math.round(target * eased));
      if (pct < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, delayMs]);
  return val;
}

/**
 * Kafel nagrody na ekranie wyniku — wskakuje z dołu i nalicza wartość.
 */
export function RewardTile({
  tooltipKey,
  icon,
  value,
  accent = 'sky',
  delay = 0,
  label,
  prefix = '+',
}: RewardTileProps) {
  const openSheet = useInfoSheet();
  const enter = useSharedValue(0);
  const countValue = useCountUp(value, 750, delay + 80);
  const a = ACCENT[accent];

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
    <View className="flex-1">
      <Animated.View style={style}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            openSheet({ ...TOOLTIPS[tooltipKey], art: TOOLTIP_ART[tooltipKey], accent });
          }}
          accessibilityRole="button"
          accessibilityLabel={`${label ?? ''} ${prefix}${value}`}>
          <View
            className="items-center"
            style={{
              backgroundColor: a.pale,
              borderRadius: 16,
              borderWidth: 2,
              borderBottomWidth: 4,
              borderColor: a.base,
              paddingVertical: 10,
              paddingHorizontal: 6,
            }}>
            <Icon name={icon} size={22} color={a.deep} strokeWidth={2.4} />
            <Text
              style={{
                color: a.deep,
                fontFamily: 'Gabarito-Bold',
                fontSize: 17,
                marginTop: 2,
              }}>
              {prefix}
              {countValue}
            </Text>
            {label ? (
              <Text
                style={{
                  color: a.deep,
                  fontFamily: 'Lexend-Bold',
                  fontSize: 11,
                  opacity: 0.8,
                }}>
                {label}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
