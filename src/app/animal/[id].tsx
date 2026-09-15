import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalTradingCard } from '@/components/collection/AnimalTradingCard';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

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
      <View className="flex-1 bg-canvas items-center justify-center px-6">
        <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>
          Nie znaleziono zwierzęcia.
        </Text>
        <View className="mt-4" style={{ alignSelf: 'stretch' }}>
          <Button
            label="Wróć do kolekcji"
            size="md"
            onPress={() => router.replace('/(tabs)/collection')}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader
        eyebrow="KARTA ODKRYWCY"
        title={animal.name_pl}
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace('/(tabs)/collection')
        }
      />

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
