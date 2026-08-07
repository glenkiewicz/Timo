import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { TOOLTIPS, type TooltipKey } from '@/data/info-tooltips';
import { Pressable, Text, View } from '@/tw';

import { AnimatedCounter } from './AnimatedCounter';
import { FloatingDelta } from './FloatingDelta';
import { InfoModal } from './InfoModal';

type ChipVariant = 'brand' | 'reward' | 'success' | 'paper';
type ChipIcon = 'flame' | 'paw' | 'star' | 'medal' | 'leaf' | 'sparkle';

const SURFACE: Record<ChipVariant, string> = {
  brand: 'bg-brand',
  reward: 'bg-reward',
  success: 'bg-success',
  paper: 'bg-paper',
};

const TEXT: Record<ChipVariant, string> = {
  brand: 'text-paper',
  reward: 'text-brand-deep',
  success: 'text-paper',
  paper: 'text-ink',
};

const ICONS: Record<ChipIcon, string> = {
  flame: '🔥',
  paw: '🐾',
  star: '⭐',
  medal: '🏅',
  leaf: '🍃',
  sparkle: '✨',
};

type LiveInfoChipProps = {
  tooltipKey: TooltipKey;
  icon: ChipIcon;
  from: number;
  to: number;
  variant?: ChipVariant;
  delayMs?: number;
  durationMs?: number;
  /** override floating delta color (defaults: green for +, rose for -) */
  deltaColor?: string;
};

export function LiveInfoChip({
  tooltipKey,
  icon,
  from,
  to,
  variant = 'paper',
  delayMs = 0,
  durationMs = 900,
  deltaColor,
}: LiveInfoChipProps) {
  const [open, setOpen] = useState(false);
  const delta = to - from;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (delta === 0) return;
    pulse.value = withDelay(
      delayMs,
      withSequence(
        withSpring(1.18, { damping: 8, stiffness: 240 }),
        withSpring(1, { damping: 14, stiffness: 180 })
      )
    );
  }, [delta, delayMs, pulse]);

  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setOpen(true);
  }, []);

  const resolvedColor =
    deltaColor ?? (delta >= 0 ? '#357a2a' : '#a84747');

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={chipStyle}>
        <Pressable onPress={handlePress}>
          <View
            className={`${SURFACE[variant]} rounded-chip px-3 py-1.5 flex-row items-center gap-1.5`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <Text className="text-base">{ICONS[icon]}</Text>
            <AnimatedCounter
              from={from}
              to={to}
              delayMs={delayMs}
              durationMs={durationMs}
              className={`${TEXT[variant]} text-sm`}
              style={{ fontFamily: 'Fredoka-Bold' }}
            />
          </View>
        </Pressable>
      </Animated.View>

      {delta !== 0 ? (
        <FloatingDelta value={delta} delayMs={delayMs} color={resolvedColor} />
      ) : null}

      <InfoModal
        visible={open}
        tooltip={TOOLTIPS[tooltipKey]}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}
