import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
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
import { useInfoSheet } from '@/components/sheet/InfoSheet';
import { TOOLTIPS, TOOLTIP_ART, type TooltipKey } from '@/data/info-tooltips';
import { INK } from '@/components/collection/map';
import { UI, type Accent } from '@/theme/ui';
import { Pressable, View } from '@/tw';
import { Image } from '@/tw/image';

type StatBadgeProps = {
  tooltipKey: TooltipKey;
  from: number;
  to: number;
  accent?: Accent;
  delayMs?: number;
  durationMs?: number;
  /** Wyszarza ikonę i liczbę, gdy licznik stoi na zerze. */
  dimWhenZero?: boolean;
};

/**
 * Statystyka w górnym pasku — ilustracja i liczba na pergaminowej pigułce.
 *
 * Pigułka nie jest ozdobą: pasek leży na ilustracji polany i sama ikona ginęła
 * na niebie i koronach drzew. Pergamin zamiast białego chipa, bo z tego papieru
 * są tarcze zwierząt i odznak.
 *
 * Ilustracja to TEN SAM obrazek, który wystaje nad wysuwany panel po puknięciu
 * (`TOOLTIP_ART`) — płomień serii, łapka tropów, kalendarz dni — więc dziecko
 * łączy licznik z wyjaśnieniem bez czytania. Wcześniej były tu kreskowe ikony
 * SVG, a dni z Timo pokazywał listek, który nic nie mówił.
 *
 * Puknięcie otwiera wyjaśnienie, a zmiana wartości podbija licznik.
 */
/**
 * Pergaminowa pigułka — ta sama tekstura i obszycie, co tarcze kolekcji
 * i odznak (`generate-map-kit.py pill`). Stała szerokość, bo przerywany obrys
 * rozciągany do liczby rozjeżdżałby się przy każdej zmianie cyfr.
 */
const PILL = require('../../../assets/map/pill.webp');
const PILL_H = 40;
const PILL_W = PILL_H * 2.5;

export function StatBadge({
  tooltipKey,
  from,
  to,
  accent = 'fox',
  delayMs = 0,
  durationMs = 900,
  dimWhenZero = false,
}: StatBadgeProps) {
  const openSheet = useInfoSheet();
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
    openSheet({ ...TOOLTIPS[tooltipKey], art: TOOLTIP_ART[tooltipKey], accent });
  }, [openSheet, tooltipKey, accent]);

  const muted = dimWhenZero && to === 0;

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 2 }}>
      <Animated.View style={style}>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={TOOLTIPS[tooltipKey].title}
          style={{
            width: PILL_W,
            height: PILL_H,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            paddingRight: 4,
          }}>
          <Image
            source={PILL}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="fill"
            transition={0}
            accessible={false}
          />
          <Image
            source={TOOLTIP_ART[tooltipKey]}
            style={{ width: 30, height: 30, opacity: muted ? 0.4 : 1 }}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
          <AnimatedCounter
            from={from}
            to={to}
            delayMs={delayMs}
            durationMs={durationMs}
            style={{
              color: muted ? UI.textFaint : INK,
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
    </View>
  );
}
