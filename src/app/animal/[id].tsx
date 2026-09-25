import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCard } from '@/components/collection/AnimalCard';
import { RegionBackdrop } from '@/components/collection/map';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { regionOfAnimal } from '@/data/animal-regions';
import { ANIMALS, ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

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

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace('/(tabs)/collection');

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

  // Tło krainy, z której półki dziecko przyszło — karta ma się czytać jak
  // zbliżenie na tę samą scenę, a nie przejście do innego ekranu.
  const region = regionOfAnimal(animal.id);

  return (
    <RegionBackdrop background={region?.background}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 28,
        }}
        showsVerticalScrollIndicator={false}>
        <AnimalCard
          animal={animal}
          cardNumber={cardNumber}
          cardTotal={ANIMALS.length}
          discoveredOn={discoveredOn}
        />
      </ScrollView>

      {/* Powrót unosi się nad treścią, jak na półce krainy — pełnego paska
          nagłówka tu nie ma, bo nazwę niesie tabliczka. */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.selectionAsync();
          goBack();
        }}
        accessibilityRole="button"
        accessibilityLabel="Wróć do kolekcji"
        className="w-11 h-11 items-center justify-center rounded-pill"
        style={{
          position: 'absolute',
          top: insets.top + 6,
          left: 14,
          backgroundColor: 'rgba(28, 32, 20, 0.42)',
        }}>
        <Icon name="arrow-left" size={22} color={UI.onLawn} strokeWidth={2.6} />
      </Pressable>
    </RegionBackdrop>
  );
}
