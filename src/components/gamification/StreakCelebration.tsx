import * as Haptics from 'expo-haptics';
import { useEffect, useMemo } from 'react';
import { Dimensions, Modal, Platform } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import { TimoAnimated } from '@/components/timo/TimoAnimated';
import { pickStreakLine } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SHADOW, UI } from '@/theme/ui';
import { Text, View } from '@/tw';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Ile komórek ma pasek tygodnia. */
const CELLS = 7;
/**
 * Najdalsza pozycja dzisiejszego dnia w pasku. Przy dłuższej serii pasek
 * przestaje się przesuwać i zawsze zostawia jedną komórkę na jutro — inaczej
 * przy serii 30 nie byłoby czego pokazać „do zdobycia".
 */
const TODAY_MAX_INDEX = CELLS - 2;

/** Litery dni tygodnia pod indeksem `Date.getDay()` (0 = niedziela). */
const DAY_LETTERS = ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'];

const RAYS = 24;

type StreakCelebrationProps = {
  visible: boolean;
  streak: number;
  /** Tropy z progu (7/14/30); 0 w zwykły dzień. */
  bonusPaws: number;
  onClose: () => void;
};

/**
 * Ekran serii dziennej — pierwsze, co dziecko widzi po otwarciu aplikacji.
 *
 * Pełnoekranowy, nie panel jak awans poziomu: to moment powitania, a nie
 * podsumowanie rundy. Pokazuje się wyłącznie w dniu, w którym seria urosła —
 * pilnuje tego `useDailyCheckIn`, nie ten komponent.
 */
export function StreakCelebration({
  visible,
  streak,
  bonusPaws,
  onClose,
}: StreakCelebrationProps) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: UI.sky }}>
        {visible ? <Sunburst /> : null}
        <Content streak={streak} bonusPaws={bonusPaws} onClose={onClose} />
      </View>
    </Modal>
  );
}

/**
 * Promienista poświata. Rysowana w SVG, bo to kilkanaście trójkątów — obraz
 * rastrowy ważyłby więcej i nie skalowałby się na każdy ekran.
 */
function Sunburst() {
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: 90000, easing: Easing.linear }),
      -1,
      false
    );
  }, [spin]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  // Promienie muszą sięgać rogów także po obrocie, stąd przekątna z zapasem.
  const size = Math.hypot(SCREEN_W, SCREEN_H) * 1.1;
  const r = size / 2;

  const points = useMemo(() => {
    const step = (Math.PI * 2) / RAYS;
    return Array.from({ length: RAYS / 2 }, (_, i) => {
      const a = i * step * 2;
      const p = (angle: number) =>
        `${r + Math.cos(angle) * r},${r + Math.sin(angle) * r}`;
      return `${r},${r} ${p(a)} ${p(a + step)}`;
    });
  }, [r]);

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: (SCREEN_W - size) / 2,
          top: (SCREEN_H - size) / 2,
          width: size,
          height: size,
        },
      ]}
      pointerEvents="none">
      <Svg width={size} height={size}>
        {points.map((p, i) => (
          <Polygon key={i} points={p} fill="#ffffff" opacity={0.07} />
        ))}
      </Svg>
    </Animated.View>
  );
}

function Content({
  streak,
  bonusPaws,
  onClose,
}: {
  streak: number;
  bonusPaws: number;
  onClose: () => void;
}) {
  const pop = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Timo wita serią zamiast zwykłego powitania na Home — to samo dziecko,
    // ten sam moment, więc dwie kwestie naraz nie mają sensu. Home wie o tym
    // przez `streakCelebration` w store.
    void timoVoice.playLine(pickStreakLine(bonusPaws > 0).voiceKey);
    pop.value = withSequence(
      withTiming(1.12, { duration: 280, easing: Easing.out(Easing.back(2)) }),
      withSpring(1, { damping: 12, stiffness: 170 })
    );
  }, [pop, bonusPaws]);

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
    opacity: Math.min(1, pop.value * 1.6),
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
      }}>
      <View style={{ alignSelf: 'stretch' }}>
        <TimoAnimated clip="idle" height={190} />
      </View>

      <Animated.View style={[numberStyle, { alignItems: 'center', marginTop: 4 }]}>
        <Text
          style={{
            color: '#ffffff',
            fontFamily: 'Gabarito-ExtraBold',
            fontSize: 76,
            lineHeight: 82,
          }}>
          {streak}
        </Text>
        <Text
          style={{
            color: '#ffffff',
            fontFamily: 'Gabarito-ExtraBold',
            fontSize: 22,
            letterSpacing: 2,
          }}>
          {streak === 1 ? 'DZIEŃ Z TIMO' : 'DNI Z TIMO'}
        </Text>
      </Animated.View>

      <WeekStrip streak={streak} />

      {bonusPaws > 0 ? (
        <View
          className="flex-row items-center"
          style={{
            gap: 8,
            marginTop: 18,
            backgroundColor: '#ffffff',
            borderRadius: 999,
            paddingVertical: 10,
            paddingHorizontal: 18,
            boxShadow: SHADOW.e1,
          }}>
          <Icon name="paw" size={20} color={UI.skyDeep} strokeWidth={2.4} />
          <Text
            style={{ color: UI.skyDeep, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>
            +{bonusPaws} tropów za {streak} dni!
          </Text>
        </View>
      ) : null}

      <Text
        className="text-center"
        style={{
          color: '#ffffff',
          fontFamily: 'Lexend-Bold',
          fontSize: 15,
          lineHeight: 22,
          marginTop: 18,
          opacity: 0.95,
        }}>
        Zaglądaj do Timo codziennie, żeby seria rosła!
      </Text>

      <View style={{ alignSelf: 'stretch', marginTop: 28 }}>
        {/* `fox` zamiast bieli: Button nie ma wariantu powierzchniowego, a pomarańcz
            Timo trzyma najwyższy kontrast na błękicie. */}
        <Button label="ZACZYNAMY!" icon="bolt" variant="fox" onPress={onClose} />
      </View>
    </View>
  );
}

/**
 * Pasek siedmiu dni.
 *
 * Nie potrzebuje historii z bazy: przy twardym resecie seria jest ciągła, więc
 * odhaczone dni to dokładnie `[dziś − seria + 1 … dziś]`. Wystarczą dwie
 * liczby, które już mamy.
 */
function WeekStrip({ streak }: { streak: number }) {
  const cells = useMemo(() => {
    const todayIndex = Math.min(streak - 1, TODAY_MAX_INDEX);
    const today = new Date();
    return Array.from({ length: CELLS }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + (i - todayIndex));
      return {
        letter: DAY_LETTERS[d.getDay()],
        done: i <= todayIndex,
        next: i === todayIndex + 1,
      };
    });
  }, [streak]);

  return (
    <View
      className="flex-row items-center"
      style={{
        marginTop: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        borderRadius: 22,
        paddingVertical: 12,
        paddingHorizontal: 10,
        gap: 4,
      }}>
      {cells.map((c, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Gabarito-Bold',
              fontSize: 12,
              opacity: c.done || c.next ? 1 : 0.55,
            }}>
            {c.letter}
          </Text>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: c.done ? '#ffffff' : 'rgba(255, 255, 255, 0.22)',
              borderWidth: c.next ? 2 : 0,
              borderColor: '#ffffff',
            }}>
            {c.done ? (
              <Icon name="check" size={16} color={UI.skyDeep} strokeWidth={3.2} />
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}
