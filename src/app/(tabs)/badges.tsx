import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BadgePage, type BadgeItem } from '@/components/badges/BadgePage';
import { InfoModal } from '@/components/gamification/InfoModal';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BADGES, BADGE_GROUPS } from '@/data/badges';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { View } from '@/tw';

type Tip = { emoji: string; title: string; description: string };

/**
 * Odznaki jako dziennik: każda grupa to osobna kartka w segregatorze.
 *
 * Wcześniej był to jeden płaski `FlatList` ze wszystkimi 21 odznakami wrzuconymi
 * razem i posortowanymi „odblokowane najpierw" — grupy z `BadgeDef.group`
 * istniały w danych, ale ekran ich nie pokazywał, więc nie było widać, za CO
 * właściwie zdobywa się kolejne odznaki. Podział na kartki przywraca tę
 * informację, a licznik w stopce mówi, ile zostało w danej grupie.
 */
export default function BadgesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const badges = useProfileStore((s) => s.badges);
  const unlockedSet = useMemo(() => new Set(badges), [badges]);

  const [tip, setTip] = useState<Tip | null>(null);

  const pages = useMemo(
    () =>
      BADGE_GROUPS.map((group) => ({
        ...group,
        items: BADGES.filter((b) => b.group === group.id).map<BadgeItem>((b) => ({
          ...b,
          unlocked: unlockedSet.has(b.id),
        })),
      })).filter((p) => p.items.length > 0),
    [unlockedSet]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: UI.sand }}>
      <ScreenHeader
        eyebrow="GALERIA TIMO"
        title="Odznaki"
        counter={{ value: badges.length, total: BADGES.length, accent: 'gold' }}
        onBack={() => router.navigate('/(tabs)')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
        }}>
        {pages.map((page) => (
          <BadgePage
            key={page.id}
            label={page.label}
            items={page.items}
            onSelect={(item) =>
              setTip({
                emoji: item.emoji,
                title: item.label_pl,
                description: item.description_pl,
              })
            }
            onHint={() =>
              setTip({ emoji: '📔', title: page.label, description: page.hint })
            }
          />
        ))}
      </ScrollView>

      <InfoModal
        visible={!!tip}
        tooltip={tip ?? { emoji: '', title: '', description: '' }}
        onClose={() => setTip(null)}
      />
    </View>
  );
}
