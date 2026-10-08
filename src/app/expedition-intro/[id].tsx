import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCircle, INK } from '@/components/collection/map';
import { expeditionAccent } from '@/components/expeditions/ExpeditionCard';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Plate } from '@/components/ui/Plate';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickExpeditionIntro, type Pick } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { contentColumn, useContentWidth, useTimoHeight } from '@/lib/layout';
import { Pressable, Text, View } from '@/tw';

export default function ExpeditionIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenW = useContentWidth();
  const timoH = useTimoHeight(0);
  const { id } = useLocalSearchParams<{ id: string }>();
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const startGame = useGameStore((s) => s.start);

  const exp = id ? EXPEDITIONS_BY_ID[id] : null;
  const [groundY, setGroundY] = useState<number | null>(null);

  // Stabilne intro Timo na jedną wizytę ekranu (nie re-roll przy każdym renderze).
  const introPick = useMemo<Pick | null>(
    () => (exp ? pickExpeditionIntro(exp.id) : null),
    [exp],
  );

  // Autoplay intra po mount + stop przy unmount.
  useEffect(() => {
    if (!introPick) return;
    timoVoice.playLine(introPick.voiceKey);
    return () => {
      timoVoice.stop();
    };
  }, [introPick]);

  const animals: Animal[] = useMemo(() => {
    if (!exp?.inspirationRoster) return [];
    return exp.inspirationRoster
      .map((aid) => ANIMALS_BY_ID[aid])
      .filter((a): a is Animal => !!a);
  }, [exp]);

  if (!exp || exp.mode !== 'guided') {
    return (
      <View className="flex-1 bg-canvas items-center justify-center px-6">
        <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>
          Nie znaleziono wyprawy.
        </Text>
        <View className="mt-4" style={{ alignSelf: 'stretch' }}>
          <Button
            label="Wróć"
            size="md"
            onPress={() => router.replace('/(tabs)/expeditions')}
          />
        </View>
      </View>
    );
  }

  const handleStart = () => {
    if (dailyChoice && dailyChoice.expedition_ids.includes(exp.id)) {
      chooseExpedition(exp.id);
    }
    const prog = expeditionProgress[exp.id];
    startGame({
      expeditionId: exp.id,
      expeditionMode: 'guided',
      excludeDiscovered: prog?.discovered ?? [],
    });
    router.replace('/game');
  };

  const accent = expeditionAccent(exp.id);

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('game', exp.id) }}>
      {/* Ta sama scena co w grze tej wyprawy, ustawiona linią gruntu pod łapy
          liska — Timo stoi na plaży, a nie wisi nad nią jak naklejka. */}
      <SceneBackdrop groundY={groundY} scene="game" expeditionId={exp.id} />

      {/* Nagłówek jak na półce krainy: przyciemnienie pod białym napisem. */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingHorizontal: 14,
          paddingBottom: 10,
          backgroundColor: 'rgba(28, 32, 20, 0.42)',
        }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              router.canGoBack() ? router.back() : router.replace('/(tabs)');
            }}
            accessibilityRole="button"
            accessibilityLabel="Wróć"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
            <Icon name="arrow-left" size={20} color={UI.onLawn} strokeWidth={2.6} />
          </Pressable>
          <View className="flex-1">
            <Text style={{ color: UI.onLawnSoft, fontFamily: 'Lexend-Bold', fontSize: 12 }}>
              Wyprawa z Timo
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
              {exp.childTitle ?? exp.title}
            </Text>
          </View>
        </View>
      </View>

      {/* Duży lisek na środku. Dymka nie ma — wstęp i tak mówi głosem,
          a dymek zasłaniał scenę i dublował to, co słychać. Lisek i karuzela
          siedzą razem na środku wolnego miejsca, przycisk na dole. */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: screenW * 0.62 }}>
          <TimoStage
            onGroundY={setGroundY}
            outfit={exp.id}
            height={Math.max(Math.round(Math.min(screenW * 0.62, 280)), timoH)}
          />
        </View>
      </View>

      {/* Podpowiedź na kremowej pigułce — bez emoji. */}
      <View style={{ alignItems: 'center', marginTop: 14 }}>
        <View
          style={{
            backgroundColor: UI.page,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 7,
            boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
          }}>
          <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>
            Wybierz w głowie — nie klikaj!
          </Text>
        </View>
      </View>

      <AnimalCarousel animals={animals} />
      </View>

      {/* Przycisk pod karuzelą, nie na niej — wcześniej zasłaniał zwierzęta. */}
      <View style={{ ...contentColumn, paddingHorizontal: 16, paddingBottom: insets.bottom + 12, paddingTop: 6 }}>
        <Plate label="Mam zwierzę!" accent={accent} onPress={handleStart} />
      </View>
    </View>
  );
}

/**
 * Karuzela zwierząt z wyprawy: jedno na środku, po bokach mniejsze sąsiednie.
 *
 * Wcześniej siatka 3 kolumn — 18 kart naraz, a dziecko miało „pomyśleć
 * o jednym”. Karuzela pokazuje jedno wyraźnie i zaprasza, żeby przewijać.
 * Karty dalej nieklikalne: dziecko ma pomyśleć, nie klikać.
 */
function AnimalCarousel({ animals }: { animals: Animal[] }) {
  const screenW = useContentWidth();
  const item = Math.round(screenW * 0.44);
  const side = (screenW - item) / 2;
  const x = useSharedValue(0);
  const list = useRef<FlatList<Animal>>(null);
  const [current, setCurrent] = useState(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });

  const go = (to: number) => {
    const i = Math.max(0, Math.min(animals.length - 1, to));
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    list.current?.scrollToOffset({ offset: i * item, animated: true });
    setCurrent(i);
  };

  return (
    <View style={{ ...contentColumn, marginTop: 10 }}>
      <View>
        <Animated.FlatList
          ref={list}
          data={animals}
          keyExtractor={(a) => a.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={item}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: side }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / item))}
          renderItem={({ item: a, index }) => (
            <CarouselCard animal={a} index={index} size={item} x={x} />
          )}
        />
        {/* Strzałki mówią, że karuzelę da się przewijać — sama karuzela tego
            nie zdradza, bo boczne zwierzęta są małe i przygaszone. */}
        <Arrow side="left" disabled={current === 0} onPress={() => go(current - 1)} />
        <Arrow
          side="right"
          disabled={current >= animals.length - 1}
          onPress={() => go(current + 1)}
        />
      </View>
      <Text
        className="text-center"
        numberOfLines={1}
        style={{
          color: UI.onLawn,
          fontFamily: 'Gabarito-Bold',
          fontSize: 20,
          marginTop: 2,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowRadius: 4,
        }}>
        {animals[current]?.name_pl ?? ''}
      </Text>
      <Text
        className="text-center"
        style={{
          color: UI.onLawnSoft,
          fontFamily: 'Gabarito-Bold',
          fontSize: 14,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowRadius: 4,
        }}>
        {Math.min(current + 1, animals.length)} z {animals.length}
      </Text>
    </View>
  );
}

function Arrow({
  side,
  disabled,
  onPress,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={side === 'left' ? 'Poprzednie zwierzę' : 'Następne zwierzę'}
      hitSlop={10}
      style={{
        position: 'absolute',
        top: '50%',
        marginTop: -24,
        [side]: 14,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: UI.page,
        opacity: disabled ? 0.35 : 1,
        boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
        transform: [{ rotate: side === 'left' ? '180deg' : '0deg' }],
      }}>
      <Icon name="chevron-right" size={26} color={INK} strokeWidth={2.8} />
    </Pressable>
  );
}

function CarouselCard({
  animal,
  index,
  size,
  x,
}: {
  animal: Animal;
  index: number;
  size: number;
  x: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const d = Math.abs(x.value / size - index);
    const t = Math.min(d, 1);
    return {
      transform: [{ scale: 1 - t * 0.38 }],
      opacity: 1 - Math.min(d, 2) * 0.3,
    };
  });
  return (
    <Animated.View pointerEvents="none" style={[{ width: size, alignItems: 'center' }, style]}>
      <AnimalCircle animalId={animal.id} discovered size={size * 0.94} />
    </Animated.View>
  );
}
