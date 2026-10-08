import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { INK } from '@/components/collection/map';
import { TalkingTimo } from '@/components/timo/TimoStage';
import { timoVoice } from '@/lib/audio/timo-voice';
import { sfx } from '@/lib/audio/sfx';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const PILE = require('../../../assets/onboarding/leaf-pile.webp');
const LEAVES = [
  require('../../../assets/onboarding/leaf-1.webp'),
  require('../../../assets/onboarding/leaf-2.webp'),
  require('../../../assets/onboarding/leaf-3.webp'),
  require('../../../assets/onboarding/leaf-4.webp'),
  require('../../../assets/onboarding/leaf-5.webp'),
  require('../../../assets/onboarding/leaf-6.webp'),
];

/** Oś czasu sceny (ms od wejścia). */
const T = {
  shakes: [500, 1250, 2000],
  burst: 2750,
  fanfare: 3050,
  voice: 3500,
  title: 3300,
  button: 4300,
};

/**
 * Finał onboardingu — jak wyklucie w Finchu: sterta liści trzęsie się trzy
 * razy, wybucha, a z niej wyskakuje Timo, macha i woła „Hurra! Już
 * zaczynamy!”. Fanfary i deszcz liści. „Gramy!” prowadzi prosto do Menu.
 */
export function HatchScene({ nick, onPlay }: { nick: string; onPlay: () => void }) {
  const { width, height } = useWindowDimensions();
  const timoH = Math.round(Math.min(height * 0.4, 380));
  const pileW = Math.min(width * 0.78, 420);

  const pileRot = useSharedValue(0);
  const pileScale = useSharedValue(1);
  const pileOpacity = useSharedValue(1);
  const timoY = useSharedValue(timoH * 0.45);
  const timoScale = useSharedValue(0.35);
  const timoOpacity = useSharedValue(0);
  const [burst, setBurst] = useState(false);
  const [rain, setRain] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const haptic = (style: Haptics.ImpactFeedbackStyle) => {
      if (Platform.OS !== 'web') void Haptics.impactAsync(style);
    };

    T.shakes.forEach((ms, i) => {
      at(ms, () => {
        const a = 4 + i * 3;
        sfx.play('rustle');
        haptic(Haptics.ImpactFeedbackStyle.Light);
        pileRot.value = withSequence(
          withTiming(-a, { duration: 70 }),
          withTiming(a, { duration: 110 }),
          withTiming(-a * 0.6, { duration: 100 }),
          withTiming(0, { duration: 90 }),
        );
      });
    });

    at(T.burst, () => {
      sfx.play('pop');
      haptic(Haptics.ImpactFeedbackStyle.Heavy);
      pileScale.value = withTiming(1.25, { duration: 220, easing: Easing.out(Easing.quad) });
      pileOpacity.value = withTiming(0, { duration: 260 });
      setBurst(true);
      timoOpacity.value = withTiming(1, { duration: 120 });
      // Wyskok rozpisany na sztywno: szybko w górę z lekkim przerostem,
      // przysiad i spokój — razem ~0,5 s. Sprężyna dawała kilka wahnięć
      // rozmiaru i lisek wyglądał, jakby pulsował.
      const out = Easing.out(Easing.quad);
      timoY.value = withSequence(
        withTiming(-timoH * 0.06, { duration: 230, easing: out }),
        withTiming(0, { duration: 260, easing: Easing.inOut(Easing.quad) }),
      );
      timoScale.value = withSequence(
        withTiming(1.08, { duration: 230, easing: out }),
        withTiming(0.97, { duration: 130 }),
        withTiming(1, { duration: 130 }),
      );
    });
    at(T.fanfare, () => {
      sfx.play('fanfare');
      setRain(true);
    });
    at(T.voice, () => void timoVoice.playLine('hatch.0'));
    at(T.button, () => setShowButton(true));

    return () => {
      timers.forEach(clearTimeout);
      timoVoice.stop();
    };
  }, [pileOpacity, pileRot, pileScale, timoH, timoOpacity, timoScale, timoY]);

  const pileStyle = useAnimatedStyle(() => ({
    opacity: pileOpacity.value,
    transform: [{ rotate: `${pileRot.value}deg` }, { scale: pileScale.value }],
  }));
  const timoStyle = useAnimatedStyle(() => ({
    opacity: timoOpacity.value,
    transform: [{ translateY: timoY.value }, { scale: timoScale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {rain ? <LeafRain width={width} height={height} /> : null}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* Lisek za stertą — wyskakuje, gdy liście się rozsypią. */}
        <Animated.View style={[{ alignSelf: 'stretch', transformOrigin: 'bottom' }, timoStyle]}>
          {/* Spokojne idle, nie machanie: w klipie machania lisek otwiera buzię
              i po końcu kwestii wyglądał, jakby mówił dalej bez głosu. */}
          <TalkingTimo height={timoH} />
        </Animated.View>

        <Animated.View
          style={[
            { position: 'absolute', bottom: -pileW * 0.08, transformOrigin: 'bottom' },
            pileStyle,
          ]}>
          <Image source={PILE} style={{ width: pileW, height: pileW * 0.62 }} contentFit="contain" transition={0} />
        </Animated.View>

        {burst ? <LeafBurst spread={pileW} /> : null}
      </View>

      <View style={{ minHeight: 190, paddingHorizontal: 24, paddingTop: 18 }}>
        <Animated.View entering={FadeInDown.delay(T.title).duration(400)}>
          <Text className="text-center" style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 32 }}>
            {nick.trim() ? `Hurra, ${nick.trim()}!` : 'Hurra!'}
          </Text>
          <Text
            className="text-center"
            style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 17, lineHeight: 24, marginTop: 6 }}>
            Timo już na Ciebie czeka. Zaczynamy wielką przygodę ze zwierzętami!
          </Text>
        </Animated.View>
        {showButton ? (
          <Animated.View entering={FadeIn.duration(300)} style={{ marginTop: 18 }}>
            <Pressable
              onPress={onPlay}
              accessibilityRole="button"
              style={({ pressed }) => ({
                paddingVertical: 17,
                borderRadius: 26,
                alignItems: 'center',
                backgroundColor: UI.fox,
                boxShadow: pressed ? 'none' : `0px 5px 0px ${UI.foxDeep}`,
                transform: [{ translateY: pressed ? 5 : 0 }],
              })}>
              <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 22 }}>Gramy!</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

type Burst = { angle: number; speed: number; spin: number; size: number; src: number; duration: number };

/**
 * Wybuch sterty: ~30 liści wyrzuconych w górę i na boki z prawdziwym rzutem
 * (prędkość + grawitacja), każdy z innym obrotem i rozmiarem. Lecą poza
 * ekran albo opadają i znikają.
 */
function LeafBurst({ spread }: { spread: number }) {
  const leaves = useMemo<Burst[]>(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        // kąt od -165° do -15° (w górę), rozłożony równo z odrobiną losu
        angle: ((-165 + (150 * i) / 29 + (Math.random() - 0.5) * 12) * Math.PI) / 180,
        speed: 520 + Math.random() * 620,
        spin: (Math.random() - 0.5) * 1100,
        size: 30 + Math.random() * 34,
        src: LEAVES[i % LEAVES.length],
        duration: 1500 + Math.random() * 700,
      })),
    [],
  );
  return (
    <View
      style={{
        position: 'absolute',
        bottom: spread * 0.2,
        left: 0,
        right: 0,
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
      {leaves.map((l, i) => (
        <BurstLeaf key={i} {...l} />
      ))}
    </View>
  );
}

const GRAVITY = 1500; // px/s²

function BurstLeaf({ angle, speed, spin, size, src, duration }: Burst) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration, easing: Easing.linear });
  }, [duration, t]);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const style = useAnimatedStyle(() => {
    const s = (t.value * duration) / 1000;
    return {
      opacity: t.value < 0.75 ? 1 : (1 - t.value) / 0.25,
      transform: [
        { translateX: vx * s * 0.9 },
        { translateY: vy * s + 0.5 * GRAVITY * s * s },
        { rotate: `${spin * t.value}deg` },
        { scale: 0.6 + 0.4 * Math.min(1, t.value * 6) },
      ],
    };
  });
  return (
    <Animated.View style={[{ position: 'absolute', bottom: 0 }, style]}>
      <Image source={src} style={{ width: size, height: size }} contentFit="contain" transition={0} />
    </Animated.View>
  );
}

type Falling = { x: number; delay: number; duration: number; sway: number; spin: number; size: number; src: number };

/** Po wybuchu: spokojny deszcz liści z góry, kołyszących się na boki. */
function LeafRain({ width, height }: { width: number; height: number }) {
  const leaves = useMemo<Falling[]>(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: (width * (i + 0.5)) / 22 + (Math.random() - 0.5) * 30,
        delay: Math.random() * 1800,
        duration: 4200 + Math.random() * 2200,
        sway: 18 + Math.random() * 26,
        spin: (Math.random() - 0.5) * 260,
        size: 26 + Math.random() * 22,
        src: LEAVES[(i * 5) % LEAVES.length],
      })),
    [width],
  );
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none' }}>
      {leaves.map((l, i) => (
        <RainLeaf key={i} {...l} height={height} />
      ))}
    </View>
  );
}

function RainLeaf({ x, delay, duration, sway, spin, size, src, height }: Falling & { height: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration, easing: Easing.linear }));
  }, [delay, duration, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : t.value < 0.85 ? 0.95 : ((1 - t.value) / 0.15) * 0.95,
    transform: [
      { translateX: x + Math.sin(t.value * Math.PI * 4) * sway },
      { translateY: -60 + t.value * (height + 120) },
      { rotate: `${spin * t.value + Math.sin(t.value * Math.PI * 4) * 25}deg` },
    ],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', top: 0, left: -size / 2 }, style]}>
      <Image source={src} style={{ width: size, height: size }} contentFit="contain" transition={0} />
    </Animated.View>
  );
}
