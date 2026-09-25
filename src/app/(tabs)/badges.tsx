import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BadgeDisc } from '@/components/badges/BadgeDisc';
import { InfoModal } from '@/components/gamification/InfoModal';
import { BADGE_ART } from '@/data/badge-art';
import { BADGES, BADGE_GROUPS, type BadgeDef } from '@/data/badges';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const COLUMNS = 3;
const GUTTER = 16;

type Tip = { title: string; description: string; art?: number };

/**
 * Odznaki w języku kolekcji: wyprane tło, tytuł z paskiem postępu, a każda
 * odznaka na tej samej tarczy, co zwierzę na półce.
 *
 * Grupy zostają — mówią, ZA CO zdobywa się kolejne odznaki — ale już nie jako
 * kartki segregatora. Segregator z białym paskiem nagłówka był ostatnim
 * ekranem w starym stylu i odstawał od map i krain obok w doku.
 */
export default function BadgesScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const badges = useProfileStore((s) => s.badges);
  const unlocked = useMemo(() => new Set(badges), [badges]);

  const [tip, setTip] = useState<Tip | null>(null);

  const groups = useMemo(
    () =>
      BADGE_GROUPS.map((g) => ({ ...g, items: BADGES.filter((b) => b.group === g.id) })).filter(
        (g) => g.items.length > 0
      ),
    []
  );

  const cell = (screenW - GUTTER * 2) / COLUMNS;
  const found = BADGES.filter((b) => unlocked.has(b.id)).length;

  return (
    <View className="flex-1" style={{ backgroundColor: UI.page }}>
      {/* Siostra tła kolekcji — ta sama wyprana akwarela, tylko złota godzina. */}
      <Image
        source={require('../../../assets/backgrounds/badges.webp')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}>
        <Text
          className="text-center"
          style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>
          Odznaki
        </Text>

        {/* Ten sam licznik, co pod mapą kolekcji: pasek niesie postęp bez liczb. */}
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <View
            style={{
              width: screenW * 0.52,
              height: 10,
              borderRadius: 5,
              backgroundColor: UI.line,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: `${(found / BADGES.length) * 100}%`,
                height: '100%',
                borderRadius: 5,
                backgroundColor: UI.gold,
              }}
            />
          </View>
          <Text
            style={{ color: UI.textSoft, fontFamily: 'Gabarito-Bold', fontSize: 14, marginTop: 6 }}>
            {found} z {BADGES.length} odznak
          </Text>
        </View>

        {groups.map((g) => (
          <View key={g.id}>
            <GroupHeader
              label={g.label}
              count={`${g.items.filter((b) => unlocked.has(b.id)).length}/${g.items.length}`}
              onHint={() => setTip({ title: g.label, description: g.hint })}
            />
            <View className="flex-row flex-wrap" style={{ paddingHorizontal: GUTTER }}>
              {g.items.map((b) => (
                <Badge
                  key={b.id}
                  badge={b}
                  unlocked={unlocked.has(b.id)}
                  width={cell}
                  onPress={() =>
                    setTip({ title: b.label_pl, description: b.description_pl, art: BADGE_ART[b.id] })
                  }
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <InfoModal
        visible={!!tip}
        tooltip={{ emoji: '', title: tip?.title ?? '', description: tip?.description ?? '' }}
        art={tip?.art}
        onClose={() => setTip(null)}
      />
    </View>
  );
}

/**
 * Nagłówek grupy jak na karcie zwierzęcia: nazwa i linia do krawędzi, tylko
 * ciemne, bo tło jest tu jasne. Licznik i „i" siedzą na końcu linii.
 */
function GroupHeader({
  label,
  count,
  onHint,
}: {
  label: string;
  count: string;
  onHint: () => void;
}) {
  return (
    <View
      className="flex-row items-center"
      style={{ marginHorizontal: GUTTER + 6, marginTop: 26, marginBottom: 12, gap: 10 }}>
      <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>{label}</Text>
      <View style={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: UI.lineDeep }} />
      <Text style={{ color: UI.textSoft, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>{count}</Text>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.selectionAsync();
          onHint();
        }}
        accessibilityRole="button"
        accessibilityLabel={`Co to za odznaki: ${label}`}
        hitSlop={8}
        className="w-7 h-7 items-center justify-center rounded-pill"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
        <Text style={{ color: UI.textSoft, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>i</Text>
      </Pressable>
    </View>
  );
}

function Badge({
  badge,
  unlocked,
  width,
  onPress,
}: {
  badge: BadgeDef;
  unlocked: boolean;
  width: number;
  onPress: () => void;
}) {
  const body = (
    <View style={{ width, alignItems: 'center', marginBottom: 14 }}>
      <BadgeDisc badgeId={badge.id} unlocked={unlocked} size={width * 0.84} />
      <Text
        className="text-center"
        numberOfLines={2}
        style={{
          color: unlocked ? UI.text : UI.textFaint,
          fontFamily: 'Gabarito-Bold',
          fontSize: 12,
          lineHeight: 15,
          marginTop: 4,
          width: width - 8,
        }}>
        {unlocked ? badge.label_pl : '???'}
      </Text>
    </View>
  );

  // Niezdobyta nie otwiera opisu — jak nieodkryte zwierzę na półce.
  if (!unlocked) return body;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={badge.label_pl}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}>
      {body}
    </Pressable>
  );
}
