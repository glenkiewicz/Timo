import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoModal } from '@/components/gamification/InfoModal';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BADGES, type BadgeDef } from '@/data/badges';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

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
    <View className="flex-1 bg-canvas">
      <ScreenHeader
        eyebrow="GALERIA TIMO"
        title="Odznaki"
        counter={{ value: unlockedCount, total: BADGES.length, accent: 'gold' }}
        onBack={() => router.navigate('/(tabs)')}
      />

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
        className="flex-1 items-center justify-center"
        style={{
          aspectRatio: 1,
          backgroundColor: UI.sunken,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: UI.line,
          borderStyle: 'dashed',
          paddingHorizontal: 6,
        }}>
        <Icon name="lock" size={26} color={UI.textFaint} strokeWidth={2.4} />
        <Text
          className="text-center"
          numberOfLines={2}
          style={{
            color: UI.textFaint,
            fontFamily: 'Gabarito-Bold',
            fontSize: 10,
            marginTop: 6,
          }}>
          ?????
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Card
        onPress={onPress}
        accessibilityLabel={item.label_pl}
        borderColor={UI.gold}
        background={UI.goldPale}
        padding={6}
        style={{ aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
        <Text
          className="text-center"
          numberOfLines={2}
          style={{
            color: UI.text,
            fontFamily: 'Gabarito-Bold',
            fontSize: 10,
            lineHeight: 12,
            marginTop: 4,
          }}>
          {item.label_pl}
        </Text>
      </Card>
    </View>
  );
}
