import * as Haptics from 'expo-haptics';
import { useEffect, useMemo } from 'react';
import { Dimensions, Modal, Platform } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { TimoAnimated } from '@/components/timo/TimoAnimated';
import { Button } from '@/components/ui/Button';
import {
  MAX_LEVEL,
  isRankUp,
  rankNameFor,
  titleFor,
} from '@/features/gamification/titles';
import { SHADOW, UI } from '@/theme/ui';
import { Text, View } from '@/tw';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Zwykły awans stopnia. Nowa ranga dostaje gęstsze konfetti — patrz `Confetti`. */
const PIECES = 36;
const PIECES_RANK_UP = 64;
const CONFETTI_COLORS = [
  UI.fox,
  UI.foxLift,
  UI.gold,
  UI.sky,
  UI.primary,
  UI.violet,
  UI.danger,
];

type LevelUpCelebrationProps = {
  visible: boolean;
  level: number;
  previousLevel: number;
  onClose: () => void;
};

/**
 * Ekran awansu — konfetti i nowy poziom.
 *
 * Do tej pory awans przechodził niezauważony: na ekranie wyniku licznik poziomu
 * po cichu przeskakiwał o jeden, a na Home awatar robił drobny puls. Dla dziecka
 * to najmocniejszy moment postępu i zasługuje na własną scenę.
 *
 * Konfetti jest liczone w Reanimated, bo w projekcie nie ma biblioteki do
 * cząsteczek, a dokładanie jej dla jednego ekranu byłoby nieproporcjonalne.
 * Każdy kawałek dostaje własne opóźnienie, czas lotu, dryf i obrót — bez tego
 * wszystkie spadają jak jeden blok i widać, że to pętla.
 */
export function LevelUpCelebration({
  visible,
  level,
  previousLevel,
  onClose,
}: LevelUpCelebrationProps) {
  const title = titleFor(level);
  // Stopień awansuje 84 razy w całej grze, ranga tylko 12. Rozróżnienie jest po
  // to, żeby mocniejsza wersja tej sceny pozostała rzadka i coś znaczyła.
  // Dojście do 84 jest formalnie awansem stopnia (ranga 12 zaczyna się na 78),
  // więc bez tego koniec całej drabiny dostałby najskromniejszą wersję sceny.
  const maxed = level >= MAX_LEVEL;
  const rankUp = maxed || isRankUp(previousLevel, level);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(30, 42, 38, 0.62)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}>
        {visible ? <Confetti pieces={rankUp ? PIECES_RANK_UP : PIECES} /> : null}

        <Panel
          level={level}
          title={title}
          rankUp={rankUp}
          maxed={maxed}
          onClose={onClose}
        />
      </View>
    </Modal>
  );
}

function Panel({
  level,
  title,
  rankUp,
  maxed,
  onClose,
}: {
  level: number;
  title: string;
  rankUp: boolean;
  maxed: boolean;
  onClose: () => void;
}) {
  const pop = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    pop.value = withSequence(
      withTiming(1.08, { duration: 260, easing: Easing.out(Easing.back(2)) }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );
  }, [pop]);

  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, pop.value * 1.6),
    transform: [{ scale: pop.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          alignSelf: 'stretch',
          alignItems: 'center',
          backgroundColor: UI.surface,
          borderRadius: 28,
          paddingVertical: 24,
          paddingHorizontal: 20,
          boxShadow: SHADOW.e3,
        },
      ]}>
      <Text
        style={{
          color: UI.textFaint,
          fontFamily: 'Gabarito-Bold',
          fontSize: 11,
          letterSpacing: 1.4,
        }}>
        {maxed ? 'NAJWYŻSZA RANGA' : rankUp ? 'NOWA RANGA' : 'NOWY POZIOM'}
      </Text>

      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 32,
          backgroundColor: UI.foxPale,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 12,
        }}>
        <Text
          style={{ color: UI.foxDeep, fontFamily: 'Gabarito-ExtraBold', fontSize: 46 }}>
          {level}
        </Text>
      </View>

      <Text
        style={{
          color: UI.text,
          fontFamily: 'Gabarito-Bold',
          fontSize: 24,
          marginTop: 14,
        }}>
        {title}
      </Text>

      {rankUp ? (
        <Text
          className="text-center"
          style={{
            color: UI.primaryDeep,
            fontFamily: 'Lexend-Bold',
            fontSize: 13,
            marginTop: 4,
          }}>
          {maxed
            ? 'Przeszedłeś całą drabinę tropiciela. Nie ma wyżej!'
            : `Od teraz jesteś ${rankNameFor(level)}!`}
        </Text>
      ) : null}

      {/* `alignSelf: 'stretch'` jest konieczne: `TimoAnimated` ma `width: '100%'`,
          a rodzic z `alignItems: 'center'` kurczy się do zawartości — bez tego
          szerokość liczyłaby się od zera i lisek byłby niewidoczny. */}
      <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
        <TimoAnimated clip="idle" height={150} />
      </View>

      <View style={{ alignSelf: 'stretch', marginTop: 6 }}>
        <Button label="SUPER!" icon="bolt" onPress={onClose} />
      </View>
    </Animated.View>
  );
}

function Confetti({ pieces: count }: { pieces: number }) {
  // Losowanie raz, w `useMemo` — inaczej każdy render przestawiałby tory lotu.
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * SCREEN_W,
        drift: (Math.random() - 0.5) * 140,
        size: 7 + Math.random() * 9,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 700,
        duration: 1900 + Math.random() * 1500,
        spin: Math.random() > 0.5 ? 1 : -1,
        round: Math.random() > 0.6,
      })),
    [count]
  );

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none">
      {pieces.map((p) => (
        <Piece key={p.id} {...p} />
      ))}
    </View>
  );
}

function Piece({
  x,
  drift,
  size,
  color,
  delay,
  duration,
  spin,
  round,
}: {
  x: number;
  drift: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  spin: number;
  round: boolean;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false)
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -40 + t.value * (SCREEN_H + 80) },
      { translateX: t.value * drift },
      { rotate: `${t.value * 720 * spin}deg` },
    ],
    // Znikanie przy ziemi, żeby pętla nie „mrugała" skokiem na górę.
    opacity: t.value > 0.86 ? (1 - t.value) / 0.14 : 1,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: x,
          top: 0,
          width: size,
          height: round ? size : size * 1.7,
          borderRadius: round ? size / 2 : 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}
