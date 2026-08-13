import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { FilterChip } from '@/components/ui/FilterChip';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DEV_UNLOCK_ALL } from '@/config/features';
import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS, EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';

type CardData = {
  id: string;
  name_pl: string;
  emoji: string;
  discovered: boolean;
};

const NUM_COLUMNS = 3;
const CARD_GAP = 10;

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const collection = useProfileStore((s) => s.collection);
  // DEV: traktuj wszystkie zwierzęta jako odkryte, żeby przeglądać karty bez gry.
  const collectionSet = useMemo(
    () =>
      DEV_UNLOCK_ALL ? new Set(ANIMALS.map((a) => a.id)) : new Set(collection),
    [collection],
  );

  const [activeExpId, setActiveExpId] = useState<string | null>(null);

  const data = useMemo<CardData[]>(() => {
    let filtered: Animal[] = ANIMALS;
    if (activeExpId) {
      const roster = new Set(EXPEDITIONS_BY_ID[activeExpId]?.roster ?? []);
      filtered = ANIMALS.filter((a) => roster.has(a.id));
    }
    return filtered
      .map((a) => ({
        id: a.id,
        name_pl: a.name_pl,
        emoji: a.emoji,
        discovered: collectionSet.has(a.id),
      }))
      .sort((a, b) => {
        if (a.discovered !== b.discovered) return a.discovered ? -1 : 1;
        return a.name_pl.localeCompare(b.name_pl, 'pl');
      });
  }, [collectionSet, activeExpId]);

  const sectionDiscovered = data.filter((d) => d.discovered).length;
  const sectionTotal = data.length;

  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader
        eyebrow="KSIĘGA TIMO"
        title="Kolekcja zwierząt"
        counter={{ value: sectionDiscovered, total: sectionTotal, accent: 'violet' }}
        onBack={() => router.navigate('/(tabs)')}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          style={{ marginHorizontal: -16, paddingHorizontal: 16, marginTop: 8 }}>
          <FilterChip
            label="Wszystkie"
            emoji="🐾"
            active={activeExpId === null}
            onPress={() => setActiveExpId(null)}
          />
          {EXPEDITIONS.map((e) => (
            <FilterChip
              key={e.id}
              label={e.title}
              emoji={e.hero_emoji}
              active={activeExpId === e.id}
              onPress={() => setActiveExpId(e.id)}
            />
          ))}
        </ScrollView>
      </ScreenHeader>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
          gap: CARD_GAP,
        }}
        columnWrapperStyle={{ gap: CARD_GAP }}
        renderItem={({ item }) => <CollectionTile item={item} />}
      />
    </View>
  );
}

function CollectionTile({ item }: { item: CardData }) {
  if (!item.discovered) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          aspectRatio: 1,
          backgroundColor: UI.sunken,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: UI.line,
          borderStyle: 'dashed',
        }}>
        <Icon name="lock" size={24} color={UI.textFaint} strokeWidth={2.4} />
        <Text
          style={{
            color: UI.textFaint,
            fontFamily: 'Fredoka-Bold',
            fontSize: 10,
            marginTop: 4,
          }}>
          ?????
        </Text>
      </View>
    );
  }

  return (
    <Link href={`/animal/${item.id}`} asChild>
      <Link.AppleZoom>
        <Pressable className="flex-1">
          <View
            className="overflow-hidden"
            style={{
              aspectRatio: 1,
              backgroundColor: UI.canvas,
              borderRadius: 18,
              borderWidth: 2,
              borderBottomWidth: 4,
              borderColor: UI.line,
            }}>
            <AnimalImage animalId={item.id} fallbackEmoji={item.emoji} fill />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}>
              <Text
                className="text-center"
                numberOfLines={1}
                style={{
                  color: UI.canvas,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 11,
                }}>
                {item.name_pl}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link.AppleZoom>
    </Link>
  );
}
