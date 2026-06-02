import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCardModal } from '@/components/collection/AnimalCardModal';
import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS, EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

type CardData = {
  id: string;
  name_pl: string;
  emoji: string;
  discovered: boolean;
};

const ANIMALS_BY_ID: Record<string, Animal> = Object.fromEntries(
  ANIMALS.map((a) => [a.id, a]),
);

const NUM_COLUMNS = 3;
const CARD_GAP = 10;

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const collection = useProfileStore((s) => s.collection);
  const collectionSet = useMemo(() => new Set(collection), [collection]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
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

      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 8 }}>
        <View className="flex-row items-center justify-between mb-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
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

          <View className="items-center">
            <Text
              className="text-brand-deep"
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
                letterSpacing: 1.2,
              }}>
              KSIĘGA TIMO
            </Text>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 20 }}>
              Kolekcja zwierząt
            </Text>
          </View>

          <View
            className="bg-brand rounded-chip px-3 py-1.5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text
              className="text-paper"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 13 }}>
              {sectionDiscovered} / {sectionTotal}
            </Text>
          </View>
        </View>

        {/* tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
          <TabChip
            label="Wszystkie"
            emoji="🐾"
            active={activeExpId === null}
            onPress={() => setActiveExpId(null)}
          />
          {EXPEDITIONS.map((e) => (
            <TabChip
              key={e.id}
              label={e.title}
              emoji={e.hero_emoji}
              active={activeExpId === e.id}
              onPress={() => setActiveExpId(e.id)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: insets.bottom + 24,
          gap: CARD_GAP,
        }}
        columnWrapperStyle={{ gap: CARD_GAP }}
        renderItem={({ item }) => (
          <CollectionTile
            item={item}
            onPress={() => item.discovered && setSelectedId(item.id)}
          />
        )}
      />

      <AnimalCardModal
        visible={!!selectedId}
        animal={selectedId ? ANIMALS_BY_ID[selectedId] : null}
        onClose={() => setSelectedId(null)}
      />
    </View>
  );
}

function TabChip({
  label,
  emoji,
  active,
  onPress,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`${active ? 'bg-brand' : 'bg-paper'} rounded-chip flex-row items-center gap-1.5`}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 2,
          borderColor: active ? '#a24d17' : '#fff6cc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <Text style={{ fontSize: 13 }}>{emoji}</Text>
        <Text
          className={active ? 'text-paper' : 'text-ink'}
          style={{ fontFamily: 'Fredoka-Bold', fontSize: 12 }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function CollectionTile({ item, onPress }: { item: CardData; onPress: () => void }) {
  if (!item.discovered) {
    return (
      <View
        className="flex-1 rounded-card items-center justify-center"
        style={{
          aspectRatio: 1,
          backgroundColor: 'rgba(255,241,223,0.6)',
          borderWidth: 2,
          borderColor: 'rgba(107,79,49,0.18)',
          borderStyle: 'dashed',
        }}>
        <Text style={{ fontSize: 26, opacity: 0.45 }}>🔒</Text>
        <Text
          className="text-ink-muted"
          style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 10,
            marginTop: 2,
          }}>
          ?????
        </Text>
      </View>
    );
  }
  return (
    <Pressable onPress={onPress} className="flex-1">
      <View
        className="rounded-card items-center justify-center bg-paper px-2 py-3"
        style={{
          aspectRatio: 1,
          borderWidth: 2,
          borderColor: '#fff6cc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 3,
        }}>
        <Text style={{ fontSize: 34 }}>{item.emoji}</Text>
        <Text
          className="text-ink text-center"
          numberOfLines={1}
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 11,
            marginTop: 4,
          }}>
          {item.name_pl}
        </Text>
      </View>
    </Pressable>
  );
}
