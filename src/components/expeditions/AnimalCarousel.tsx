import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AnimalCircle, INK } from '@/components/collection/map';
import { Icon } from '@/components/ui/Icon';
import { contentColumn, useContentWidth } from '@/lib/layout';
import { SHADOW, UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';

/**
 * Karuzela zwierząt z wyprawy: jedno na środku, po bokach mniejsze sąsiednie.
 *
 * Wcześniej siatka 3 kolumn — 18 kart naraz, a dziecko miało „pomyśleć
 * o jednym”. Karuzela pokazuje jedno wyraźnie i zaprasza, żeby przewijać.
 * Karty dalej nieklikalne: dziecko ma pomyśleć, nie klikać.
 */
export function AnimalCarousel({ animals }: { animals: Animal[] }) {
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
