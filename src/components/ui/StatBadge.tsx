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

import { AnimatedCounter } from '@/components/gamification/AnimatedCounter';
import { FloatingDelta } from '@/components/gamification/FloatingDelta';
import { InfoModal } from '@/components/gamification/InfoModal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TOOLTIPS, type TooltipKey } from '@/data/info-tooltips';
import { ACCENT, SHADOW, UI, type Accent } from '@/theme/ui';
import { Pressable, View } from '@/tw';

type StatBadgeProps = {
  tooltipKey: TooltipKey;
  icon: IconName;
  from: number;
  to: number;
  accent?: Accent;
  delayMs?: number;
  durationMs?: number;
  /** Wyszarza ikonę i liczbę, gdy licznik stoi na zerze. */
  dimWhenZero?: boolean;
};

/**
 * Statystyka w górnym pasku — ikona i liczba w białym chipie.
 *
 * Chip nie jest ozdobą: pasek leży teraz na ilustracji polany, a sama ikona
 * w kolorze akcentu ginęła na niebie i koronach drzew. Biała pigułka z cieniem
 * `e0` daje jej stałe, spokojne podłoże — tak samo jak Finch trzyma górne
 * sterowanie w białym chipie nad sceną.
 *
 * Puknięcie otwiera wyjaśnienie, a zmiana wartości podbija licznik.
 */
export function StatBadge({
  tooltipKey,
  icon,
  from,
  to,
  accent = 'fox',
  delayMs = 0,
  durationMs = 900,
  dimWhenZero = false,
}: StatBadgeProps) {
  const [open, setOpen] = useState(false);
  const delta = to - from;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (delta === 0) return;
    pulse.value = withDelay(
      delayMs,
      withSequence(
        withSpring(1.22, { damping: 8, stiffness: 240 }),
        withSpring(1, { damping: 14, stiffness: 180 })
      )
    );
  }, [delta, delayMs, pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setOpen(true);
  }, []);

  const muted = dimWhenZero && to === 0;
  const iconColor = muted ? UI.textFaint : ACCENT[accent].base;
  const textColor = muted ? UI.textFaint : ACCENT[accent].deep;

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 2 }}>
      <Animated.View style={style}>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={TOOLTIPS[tooltipKey].title}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: UI.surface,
            borderRadius: 999,
            boxShadow: SHADOW.e0,
          }}>
          <Icon name={icon} size={22} color={iconColor} strokeWidth={2.4} />
          <AnimatedCounter
            from={from}
            to={to}
            delayMs={delayMs}
            durationMs={durationMs}
            style={{
              color: textColor,
              fontFamily: 'Gabarito-Bold',
              fontSize: 17,
            }}
          />
        </Pressable>
      </Animated.View>

      {delta !== 0 ? (
        <FloatingDelta
          value={delta}
          delayMs={delayMs}
          color={delta >= 0 ? UI.primaryDeep : UI.dangerDeep}
        />
      ) : null}

      <InfoModal
        visible={open}
        tooltip={TOOLTIPS[tooltipKey]}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}
