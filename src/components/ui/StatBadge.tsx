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
const PILL_H = 28;
const PILL_W = PILL_H * 2.5;
/**
 * Ilustracja jest WYŻSZA od pigułki i zachodzi na jej lewy koniec — wystaje
 * nad i pod papier, jak ikony nagród w Finchu. Mała pigułka, duży obrazek.
 */
const ART = 38;
const OVERHANG = ART * 0.4;

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
          style={{ width: OVERHANG + PILL_W, height: ART, justifyContent: 'center' }}>
          <Image
            source={PILL}
            style={{
              position: 'absolute',
              left: OVERHANG,
              top: (ART - PILL_H) / 2,
              width: PILL_W,
              height: PILL_H,
            }}
            contentFit="fill"
            transition={0}
            accessible={false}
          />
          <Image
            source={TOOLTIP_ART[tooltipKey]}
            style={{ position: 'absolute', left: 0, top: 0, width: ART, height: ART, opacity: muted ? 0.4 : 1 }}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
          <View style={{ marginLeft: ART + 2, marginRight: 8, alignItems: 'center' }}>
            <AnimatedCounter
              from={from}
              to={to}
              delayMs={delayMs}
              durationMs={durationMs}
              style={{
                color: muted ? UI.textFaint : INK,
                fontFamily: 'Gabarito-Bold',
                fontSize: 16,
              }}
            />
          </View>
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
