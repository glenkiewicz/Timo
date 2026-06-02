import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoModal } from '@/components/gamification/InfoModal';
import { BADGES, type BadgeDef } from '@/data/badges';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

type BadgeCard = BadgeDef & { unlocked: boolean };

const NUM_COLUMNS = 3;
const CARD_GAP = 10;

const GROUP_ORDER: BadgeDef['group'][] = [
  'firsts',
  'streak',
  'daily',
  'collection',
  'speed',
  'expeditions',
  'special',
];

export default function BadgesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const badges = useProfileStore((s) => s.badges);
  const unlockedSet = useMemo(() => new Set(badges), [badges]);

  const [selected, setSelected] = useState<BadgeCard | null>(null);

  const data: BadgeCard[] = useMemo(() => {
    return [...BADGES]
      .map((b) => ({ ...b, unlocked: unlockedSet.has(b.id) }))
      .sort((a, b) => {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        return GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
      });
  }, [unlockedSet]);

  const unlockedCount = badges.length;

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

      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
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
              GALERIA TIMO
            </Text>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 20 }}>
              Odznaki
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
              {unlockedCount} / {BADGES.length}
            </Text>
          </View>
        </View>
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
          <BadgeTile item={item} onPress={() => item.unlocked && setSelected(item)} />
        )}
      />

      <InfoModal
        visible={!!selected}
        tooltip={
          selected
            ? {
                emoji: selected.emoji,
                title: selected.label_pl,
                description: selected.description_pl,
              }
            : { emoji: '', title: '', description: '' }
        }
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

function BadgeTile({ item, onPress }: { item: BadgeCard; onPress: () => void }) {
  if (!item.unlocked) {
    return (
      <View
        className="flex-1 rounded-card items-center justify-center"
        style={{
          aspectRatio: 1,
          backgroundColor: 'rgba(255,241,223,0.6)',
          borderWidth: 2,
          borderColor: 'rgba(107,79,49,0.18)',
          borderStyle: 'dashed',
          paddingHorizontal: 6,
          paddingVertical: 6,
        }}>
        <Text style={{ fontSize: 30, opacity: 0.35 }}>{item.emoji}</Text>
        <Text
          className="text-ink-muted text-center"
          numberOfLines={2}
          style={{
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
    <Pressable onPress={onPress} className="flex-1">
      <View
        className="rounded-card items-center justify-center bg-paper"
        style={{
          aspectRatio: 1,
          paddingHorizontal: 6,
          paddingVertical: 6,
          borderWidth: 2,
          borderColor: '#fff6cc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 3,
        }}>
        <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
        <Text
          className="text-ink text-center"
          numberOfLines={2}
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 10,
            marginTop: 4,
            lineHeight: 12,
          }}>
          {item.label_pl}
        </Text>
      </View>
    </Pressable>
  );
}
