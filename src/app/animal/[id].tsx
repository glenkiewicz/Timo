import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalTradingCard } from '@/components/collection/AnimalTradingCard';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

export default function AnimalCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const collection = useProfileStore((s) => s.collection);
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);

  const animal = id ? ANIMALS_BY_ID[id] : null;

  // Numerek karty: pozycja w kolekcji (porządek odkrycia).
  const cardNumber = useMemo(() => {
    if (!animal) return undefined;
    const idx = collection.indexOf(animal.id);
    return idx >= 0 ? idx + 1 : undefined;
  }, [animal, collection]);

  // Wyprawa, na której odkryto — pierwsza wyprawa zawierająca to zwierzę
  // w `expeditionProgress[exp].discovered`.
  const discoveredOn = useMemo(() => {
    if (!animal) return undefined;
    for (const [expId, prog] of Object.entries(expeditionProgress)) {
      if (prog.discovered.includes(animal.id)) {
        const exp = EXPEDITIONS_BY_ID[expId];
        if (exp) return exp.childTitle ?? exp.title;
      }
    }
    return undefined;
  }, [animal, expeditionProgress]);

  if (!animal) {
    return (
      <View className="flex-1 bg-bg items-center justify-center px-6">
        <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
          Nie znaleziono zwierzęcia.
        </Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/collection')}
          className="mt-4 bg-brand rounded-chip px-4 py-2">
          <Text className="text-paper" style={{ fontFamily: 'Fredoka-Bold' }}>
            Wróć do kolekcji
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <Image
        source={require('../../../assets/backgrounds/home-bg.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        contentFit="cover"
      />

      {/* Top bar */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/collection'))}
            className="w-10 h-10 rounded-full bg-paper items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
              ←
            </Text>
          </Pressable>

          <View className="items-center flex-1 px-3">
            <Text
              className="text-brand-deep"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 11, letterSpacing: 1.2 }}>
              KARTA ODKRYWCY
            </Text>
            <Text
              className="text-ink"
              numberOfLines={1}
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
              {animal.name_pl}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <AnimalTradingCard
          animal={animal}
          cardNumber={cardNumber}
          cardTotal={500}
          discoveredOn={discoveredOn}
        />
      </ScrollView>
    </View>
  );
}
