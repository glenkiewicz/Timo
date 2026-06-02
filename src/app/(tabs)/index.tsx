import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { PuffyButton } from '@/components/buttons/PuffyButton';
import { AnimatedCounter } from '@/components/gamification/AnimatedCounter';
import { FloatingDelta } from '@/components/gamification/FloatingDelta';
import { InfoModal } from '@/components/gamification/InfoModal';
import { LiveInfoChip } from '@/components/gamification/LiveInfoChip';
import { SpeechBubble } from '@/components/timo/SpeechBubble';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { ANIMALS } from '@/data/animals';
import { BADGES } from '@/data/badges';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { TOOLTIPS } from '@/data/info-tooltips';
import { levelFromXp } from '@/features/gamification/award';
import { titleFor } from '@/features/gamification/titles';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const start = useGameStore((s) => s.start);

  const paws = useProfileStore((s) => s.paws);
  const streak = useProfileStore((s) => s.streak);
  const dailyStreak = useProfileStore((s) => s.dailyStreak);
  const xp = useProfileStore((s) => s.xp);
  const collection = useProfileStore((s) => s.collection);
  const badges = useProfileStore((s) => s.badges);
  const lastReward = useProfileStore((s) => s.lastReward);
  const clearLastReward = useProfileStore((s) => s.clearLastReward);
  const ensureDailyChoice = useProfileStore((s) => s.ensureDailyChoice);

  const level = levelFromXp(xp);
  const title = titleFor(level);
  const previousPaws = lastReward?.previousPaws ?? paws;
  const previousStreak = lastReward?.previousStreak ?? streak;
  const previousLevel = lastReward ? levelFromXp(lastReward.previousXp) : level;

  // make sure today's expedition picks are present
  useEffect(() => {
    ensureDailyChoice();
  }, [ensureDailyChoice]);

  // clear lastReward after the entrance animation has played out
  useEffect(() => {
    if (!lastReward) return;
    const t = setTimeout(() => clearLastReward(), 1600);
    return () => clearTimeout(t);
  }, [lastReward, clearLastReward]);

  const [levelInfoOpen, setLevelInfoOpen] = useState(false);

  const levelUp = level > previousLevel;
  const avatarPulse = useSharedValue(1);

  useEffect(() => {
    if (!levelUp) return;
    avatarPulse.value = withDelay(
      200,
      withSequence(
        withSpring(1.25, { damping: 7, stiffness: 220 }),
        withSpring(1, { damping: 14, stiffness: 180 })
      )
    );
  }, [levelUp, avatarPulse]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarPulse.value }],
  }));

  const handlePlay = () => {
    start();
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
        className="flex-1"
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
        {/* top bar */}
        <View className="flex-row items-center justify-between px-5">
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={avatarStyle}>
              <Pressable onPress={() => setLevelInfoOpen(true)}>
                <View
                  className="w-12 h-12 rounded-full bg-brand items-center justify-center"
                  style={{
                    borderWidth: 3,
                    borderColor: '#fff1df',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    elevation: 4,
                  }}>
                  <AnimatedCounter
                    from={previousLevel}
                    to={level}
                    durationMs={700}
                    delayMs={200}
                    className="text-paper"
                    style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}
                  />
                </View>
              </Pressable>
            </Animated.View>
            {levelUp ? (
              <FloatingDelta
                value={level - previousLevel}
                delayMs={200}
                color="#a8730c"
                containerStyle={{ top: -2 }}
              />
            ) : null}
          </View>
          <View className="flex-row gap-2">
            {dailyStreak > 0 ? (
              <LiveInfoChip
                tooltipKey="daily_streak"
                icon="leaf"
                from={dailyStreak}
                to={dailyStreak}
                variant="success"
                delayMs={60}
              />
            ) : null}
            <LiveInfoChip
              tooltipKey="streak"
              icon="flame"
              from={previousStreak}
              to={streak}
              variant={streak > 0 ? 'brand' : 'paper'}
              delayMs={120}
            />
            <LiveInfoChip
              tooltipKey="paws"
              icon="paw"
              from={previousPaws}
              to={paws}
              variant="paper"
              delayMs={0}
            />
          </View>
        </View>

        {/* Tytuł odkrywcy pod top barem */}
        <View className="items-start px-5 mt-1.5">
          <View
            className="bg-paper rounded-chip"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderWidth: 1.5,
              borderColor: '#fff6cc',
            }}>
            <Text
              className="text-brand-deep"
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
                letterSpacing: 0.5,
              }}>
              {title} · L{level}
            </Text>
          </View>
        </View>

        <InfoModal
          visible={levelInfoOpen}
          tooltip={TOOLTIPS.level}
          onClose={() => setLevelInfoOpen(false)}
        />

        {/* hero */}
        <View className="items-center gap-1 px-6 mt-3">
          <View style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            <SpeechBubble eyebrow="TIMO MÓWI" tailSide="left">
              {collection.length === 0
                ? 'Cześć! Pomyśl o zwierzęciu — spróbuję zgadnąć!'
                : `Mamy razem ${collection.length} ${
                    collection.length === 1
                      ? 'zwierzę'
                      : collection.length < 5
                        ? 'zwierzęta'
                        : 'zwierząt'
                  }. Gramy dalej?`}
            </SpeechBubble>
          </View>
          <TimoCharacter state="greeting" size={200} />
        </View>

        {/* Wyprawa Dnia */}
        <View className="px-6 mt-1">
          <ExpeditionDailyCard />
        </View>

        <View className="flex-1" />

        {/* CTA */}
        <View className="px-6 gap-2">
          <PuffyButton label="Zagraj z Timo" onPress={handlePlay} />
          <View className="flex-row items-center justify-center gap-3 flex-wrap">
            <Pressable
              onPress={() => router.push('/collection')}
              className="px-2.5 py-1.5 rounded-chip">
              <Text
                className="text-brand-deep"
                style={{
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 12,
                  letterSpacing: 0.5,
                }}>
                📒  Kolekcja ({collection.length}/{ANIMALS.length})
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/expeditions')}
              className="px-2.5 py-1.5 rounded-chip">
              <Text
                className="text-brand-deep"
                style={{
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 12,
                  letterSpacing: 0.5,
                }}>
                🗺️  Wyprawy
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/badges')}
              className="px-2.5 py-1.5 rounded-chip">
              <Text
                className="text-brand-deep"
                style={{
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 12,
                  letterSpacing: 0.5,
                }}>
                🏅  Odznaki ({badges.length}/{BADGES.length})
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---------------- Wyprawa Dnia card ---------------- */

function ExpeditionDailyCard() {
  const router = useRouter();
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const startGame = useGameStore((s) => s.start);

  if (!dailyChoice) return null;

  const chosenId = dailyChoice.chosen_id;
  const chosen = chosenId ? EXPEDITIONS_BY_ID[chosenId] : null;
  const progress = chosenId ? expeditionProgress[chosenId] : undefined;
  const completed = progress?.completed_at != null;
  const discoveredCount = progress?.discovered.length ?? 0;
  const targetCount = chosen?.target_count ?? 3;

  const cardStyle = {
    borderWidth: 2,
    borderColor: '#fff6cc' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  };

  const launch = (id: string) => {
    chooseExpedition(id);
    const prog = expeditionProgress[id];
    startGame({ expeditionId: id, excludeDiscovered: prog?.discovered ?? [] });
    router.push('/game');
  };

  // State C — completed
  if (chosen && completed) {
    return (
      <View className="bg-paper rounded-card p-4" style={cardStyle}>
        <Text
          className="text-brand-deep"
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 10,
            letterSpacing: 1.2,
            marginBottom: 2,
          }}>
          ✓  WYPRAWA UKOŃCZONA
        </Text>
        <View className="flex-row items-center gap-3">
          <Text style={{ fontSize: 30 }}>{chosen.hero_emoji}</Text>
          <View className="flex-1">
            <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
              {chosen.title}
            </Text>
            <Text
              className="text-ink-soft"
              style={{ fontFamily: 'Nunito-Bold', fontSize: 12 }}>
              Jutro czeka nowa przygoda!
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // State B — chosen, in progress
  if (chosen) {
    return (
      <View className="bg-paper rounded-card p-4" style={cardStyle}>
        <Text
          className="text-brand-deep"
          style={{
            fontFamily: 'Fredoka-Bold',
            fontSize: 10,
            letterSpacing: 1.2,
            marginBottom: 4,
          }}>
          WYPRAWA DNIA
        </Text>
        <View className="flex-row items-center gap-3 mb-2">
          <Text style={{ fontSize: 30 }}>{chosen.hero_emoji}</Text>
          <View className="flex-1">
            <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
              {chosen.title}
            </Text>
            <Text
              className="text-ink-soft"
              style={{ fontFamily: 'Nunito-Bold', fontSize: 12 }}>
              Odkryte: {discoveredCount} / {targetCount}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => launch(chosen.id)}
          className="bg-brand rounded-chip py-2 items-center">
          <Text
            className="text-paper"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 14 }}>
            {discoveredCount === 0 ? 'Ruszamy!' : 'Kontynuuj wyprawę'}
          </Text>
        </Pressable>
      </View>
    );
  }

  // State A — 3 choices
  const options = dailyChoice.expedition_ids
    .map((id) => EXPEDITIONS_BY_ID[id])
    .filter(Boolean);

  return (
    <View>
      <Text
        className="text-brand-deep"
        style={{
          fontFamily: 'Fredoka-Bold',
          fontSize: 11,
          letterSpacing: 1.2,
          marginBottom: 6,
          paddingLeft: 4,
        }}>
        🌟  WYPRAWA DNIA — wybierz jedną
      </Text>
      <View className="flex-row gap-2">
        {options.map((e) => {
          const prog = expeditionProgress[e.id];
          const done = prog?.completed_at != null;
          return (
            <Pressable key={e.id} onPress={() => launch(e.id)} className="flex-1">
              <View
                className="bg-paper rounded-card items-center justify-center"
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                  ...cardStyle,
                  opacity: done ? 0.55 : 1,
                }}>
                <Text style={{ fontSize: 32 }}>{e.hero_emoji}</Text>
                <Text
                  className="text-ink text-center"
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 11,
                    marginTop: 4,
                  }}>
                  {e.title}
                </Text>
                {done ? (
                  <Text
                    className="text-success"
                    style={{ fontFamily: 'Fredoka-Bold', fontSize: 9, marginTop: 2 }}>
                    ✓
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
