import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoModal } from '@/components/gamification/InfoModal';
import { DEV_UNLOCK_ALL } from '@/config/features';
import {
  EXPEDITIONS,
  SHOW_EXPERT_EXPEDITIONS,
  type Expedition,
} from '@/data/expeditions';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
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

export default function ExpeditionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const startGame = useGameStore((s) => s.start);

  const [info, setInfo] = useState<{
    emoji: string;
    title: string;
    description: string;
  } | null>(null);

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
      setInfo({
        emoji: '🔒',
        title: 'Wyprawa zablokowana',
        description:
          'Wyprawy odkrywasz przez Wyprawę Dnia. Codziennie Timo wybiera nowe propozycje. Może jutro trafisz właśnie na tę!',
      });
      return;
    }
    if (status === 'completed') {
      setInfo({
        emoji: e.hero_emoji,
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
        <View className="flex-row items-center justify-between mb-2">
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
              MAPA TIMO
            </Text>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 20 }}>
              Wyprawy
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
              {completedCount} / {visibleExpeditions.length}
            </Text>
          </View>
        </View>

        <Text
          className="text-ink-soft text-center"
          style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 11,
            lineHeight: 15,
            paddingHorizontal: 8,
            marginBottom: 4,
          }}>
          Wyprawy odkrywasz przez codzienną Wyprawę Dnia. Każdy dzień to 3 nowe propozycje
          — wybierz jedną i odkrywaj świat z Timo.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
          gap: 10,
        }}>
        {[...visibleExpeditions]
          .map((e) => ({ e, status: statusFor(e) }))
          .sort((a, b) => statusOrder(a.status) - statusOrder(b.status))
          .map(({ e, status }) => {
            const prog = expeditionProgress[e.id];
            return (
              <ExpeditionCard
                key={e.id}
                expedition={e}
                status={status}
                discoveredCount={prog?.discovered.length ?? 0}
                onPress={() => launchIfAvailable(e, status)}
              />
            );
          })}
      </ScrollView>

      <InfoModal
        visible={!!info}
        tooltip={info ?? { emoji: '', title: '', description: '' }}
        onClose={() => setInfo(null)}
      />
    </View>
  );
}

type CardProps = {
  expedition: Expedition;
  status: CardStatus;
  discoveredCount: number;
  onPress: () => void;
};

function ExpeditionCard({
  expedition: e,
  status,
  discoveredCount,
  onPress,
}: CardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isAvailable = status === 'available_today';

  const borderColor =
    isCompleted
      ? '#357a2a'
      : isInProgress
        ? '#a24d17'
        : isAvailable
          ? '#f28238'
          : 'rgba(107,79,49,0.18)';

  const accentColor =
    isCompleted
      ? '#5bb04c'
      : isInProgress
        ? '#f28238'
        : isAvailable
          ? '#a24d17'
          : '#a9967e';

  const statusLabel =
    isCompleted
      ? '✓ UKOŃCZONA'
      : isInProgress
        ? `W TRAKCIE · ${discoveredCount}/${e.target_count}`
        : isAvailable
          ? '🌟 DOSTĘPNA DZIŚ'
          : '🔒 ZABLOKOWANA';

  return (
    <Pressable onPress={onPress}>
      <View
        className="bg-paper rounded-card p-4 flex-row items-center gap-3"
        style={{
          borderWidth: 2,
          borderColor,
          borderStyle: isLocked ? 'dashed' : 'solid',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 4,
          opacity: isLocked ? 0.55 : 1,
        }}>
        <View
          className="rounded-card items-center justify-center"
          style={{
            width: 64,
            height: 64,
            backgroundColor: 'rgba(255,241,223,0.7)',
            borderWidth: 2,
            borderColor: '#fff6cc',
          }}>
          <Text style={{ fontSize: 36 }}>{isLocked ? '🔒' : e.hero_emoji}</Text>
        </View>

        <View className="flex-1">
          <Text
            style={{
              fontFamily: 'Fredoka-Bold',
              fontSize: 10,
              letterSpacing: 1.2,
              color: accentColor,
            }}>
            {statusLabel}
          </Text>
          <Text
            className="text-ink"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 16, marginTop: 2 }}>
            {e.childTitle ?? e.title}
          </Text>
          <Text
            className="text-ink-soft"
            numberOfLines={2}
            style={{
              fontFamily: 'Nunito',
              fontSize: 12,
              lineHeight: 16,
              marginTop: 2,
            }}>
            {isLocked
              ? 'Pojawi się kiedyś jako Wyprawa Dnia.'
              : e.description_pl}
          </Text>

          {!isCompleted && !isLocked ? (
            <View className="flex-row items-center gap-2 mt-1.5">
              <Text style={{ fontSize: 12 }}>🐾</Text>
              <Text
                className="text-brand-deep"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
                +{e.reward_paws}
              </Text>
              <Text style={{ fontSize: 12 }}>✨</Text>
              <Text
                className="text-brand-deep"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
                +{e.reward_xp} XP
              </Text>
            </View>
          ) : null}
        </View>

        {isAvailable || isInProgress ? (
          <Text
            className="text-brand"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 22 }}>
            ›
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
