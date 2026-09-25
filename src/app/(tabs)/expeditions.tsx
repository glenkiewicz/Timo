import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExpeditionCard } from '@/components/expeditions/ExpeditionCard';
import { useInfoSheet } from '@/components/sheet/InfoSheet';
import { DEV_UNLOCK_ALL } from '@/config/features';
import { EXPEDITION_ICONS } from '@/data/expedition-icons';
import { LOCK_ART } from '@/data/info-tooltips';
import {
  EXPEDITIONS,
  SHOW_EXPERT_EXPEDITIONS,
  type Expedition,
} from '@/data/expeditions';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

type CardStatus = 'completed' | 'in_progress' | 'available_today' | 'locked';

function statusOrder(s: CardStatus): number {
  switch (s) {
    case 'in_progress':
      return 0;
    case 'available_today':
      return 1;
    case 'completed':
      return 2;
    case 'locked':
      return 3;
  }
}

const STATUS_ACCENT: Record<Exclude<CardStatus, 'locked'>, Accent> = {
  completed: 'primary',
  in_progress: 'fox',
  available_today: 'sky',
};

export default function ExpeditionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const startGame = useGameStore((s) => s.start);

  const openSheet = useInfoSheet();

  /** Lista wypraw widoczna w UI — guided + opcjonalnie expert (za feature flagiem). */
  const visibleExpeditions = useMemo(
    () =>
      EXPEDITIONS.filter(
        (e) => e.mode === 'guided' || (SHOW_EXPERT_EXPEDITIONS && e.mode === 'expert'),
      ),
    [],
  );

  const completedCount = visibleExpeditions.filter(
    (e) => expeditionProgress[e.id]?.completed_at != null
  ).length;

  const dailyIds = useMemo(() => {
    if (!dailyChoice) return new Set<string>();
    if (dailyChoice.chosen_id) return new Set([dailyChoice.chosen_id]);
    return new Set(dailyChoice.expedition_ids);
  }, [dailyChoice]);

  function statusFor(e: Expedition): CardStatus {
    const prog = expeditionProgress[e.id];
    if (prog?.completed_at != null) return 'completed';
    if ((prog?.discovered.length ?? 0) > 0) return 'in_progress';
    if (dailyIds.has(e.id)) return 'available_today';
    // DEV: odblokuj wszystkie wyprawy, żeby łatwo testować.
    if (DEV_UNLOCK_ALL) return 'available_today';
    return 'locked';
  }

  const launchIfAvailable = (e: Expedition, status: CardStatus) => {
    if (status === 'locked') {
      openSheet({
        art: LOCK_ART,
        accent: 'sky',
        button: 'Do dzieła!',
        sound: 'locked',
        title: 'Wyprawa zablokowana',
        description:
          'Wyprawy odkrywasz przez Wyprawę Dnia. Codziennie Timo wybiera nowe propozycje. Może jutro trafisz właśnie na tę!',
      });
      return;
    }
    if (status === 'completed') {
      openSheet({
        art: EXPEDITION_ICONS[e.id],
        accent: 'sky',
        title: `${e.title} — ukończona!`,
        description: `${e.description_pl}\n\nWróć do niej, gdy znów pojawi się jako Wyprawa Dnia.`,
      });
      return;
    }
    // available_today | in_progress
    if (e.mode === 'guided') {
      // Wyprawa z Timo — najpierw ekran kart inspiracji, start gry tam.
      router.push(`/expedition-intro/${e.id}`);
      return;
    }
    // expert (klasyczna kategoria) — start od razu, bez intro.
    if (dailyChoice && dailyChoice.expedition_ids.includes(e.id)) {
      chooseExpedition(e.id);
    }
    const prog = expeditionProgress[e.id];
    startGame({
      expeditionId: e.id,
      expeditionMode: 'expert',
      excludeDiscovered: prog?.discovered ?? [],
    });
    router.push('/game');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: UI.page }}>
      {/* Trzecia siostra tła kolekcji i odznak — błękit i droga w dal. Biały
          pasek nagłówka z UI 3.0 był ostatnim takim na zakładkach. */}
      <Image
        source={require('../../../assets/backgrounds/expeditions.webp')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          gap: 14,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>Wyprawy</Text>

          {/* Ten sam licznik, co pod mapą kolekcji i na odznakach. */}
          <View
            style={{
              width: screenW * 0.52,
              height: 10,
              borderRadius: 5,
              backgroundColor: UI.line,
              overflow: 'hidden',
              marginTop: 12,
            }}>
            <View
              style={{
                width: `${(completedCount / Math.max(1, visibleExpeditions.length)) * 100}%`,
                height: '100%',
                borderRadius: 5,
                backgroundColor: UI.sky,
              }}
            />
          </View>
          <Text
            style={{ color: UI.textSoft, fontFamily: 'Gabarito-Bold', fontSize: 14, marginTop: 6 }}>
            {completedCount} z {visibleExpeditions.length} ukończonych
          </Text>
          <Text
            className="text-center"
            style={{
              color: UI.textSoft,
              fontFamily: 'Lexend',
              fontSize: 13,
              lineHeight: 18,
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            Każdego dnia Timo proponuje 3 nowe wyprawy — wybierz jedną i odkrywaj świat!
          </Text>
        </View>

        {[...visibleExpeditions]
          .map((e) => ({ e, status: statusFor(e) }))
          .sort((a, b) => statusOrder(a.status) - statusOrder(b.status))
          .map(({ e, status }) => {
            const prog = expeditionProgress[e.id];
            return (
              <ListCard
                key={e.id}
                expedition={e}
                status={status}
                discoveredCount={prog?.discovered.length ?? 0}
                onPress={() => launchIfAvailable(e, status)}
              />
            );
          })}
      </ScrollView>
    </View>
  );
}

type CardProps = {
  expedition: Expedition;
  status: CardStatus;
  discoveredCount: number;
  onPress: () => void;
};

/**
 * Wyprawa na liście — ta sama pergaminowa karta, co Wyprawa Dnia na Home.
 * Stan niesie etykieta nad tytułem (w kolorze stanu) i zawartość karty:
 * kropki postępu w trakcie, nagrody przed startem, sylwetka z kłódką, gdy
 * zamknięta. Przycisku nie ma — cała karta jest klikalna, jak wcześniej.
 */
function ListCard({ expedition: e, status, discoveredCount, onPress }: CardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  const statusLabel = isCompleted
    ? 'UKOŃCZONA'
    : isInProgress
      ? 'W TRAKCIE'
      : isLocked
        ? 'ZABLOKOWANA'
        : 'DOSTĘPNA DZIŚ';

  return (
    <ExpeditionCard
      expedition={e}
      eyebrow={statusLabel}
      eyebrowColor={isLocked ? UI.pageFaint : ACCENT[STATUS_ACCENT[status]].deep}
      subtitle={isLocked ? 'Pojawi się kiedyś jako Wyprawa Dnia.' : e.description_pl}
      discovered={isCompleted ? e.target_count : discoveredCount}
      showProgress={isInProgress || isCompleted}
      showRewards={!isCompleted && !isLocked}
      locked={isLocked}
      onPress={onPress}
      discSize={76}
    />
  );
}
