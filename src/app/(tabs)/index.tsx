import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedCounter } from '@/components/gamification/AnimatedCounter';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
import { FloatingDelta } from '@/components/gamification/FloatingDelta';
import { InfoModal } from '@/components/gamification/InfoModal';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Bubble } from '@/components/ui/Bubble';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatBadge } from '@/components/ui/StatBadge';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { TOOLTIPS } from '@/data/info-tooltips';
import { pickGreeting } from '@/data/timo-lines';
import { levelFromXp, xpProgress } from '@/features/gamification/award';
import { titleFor } from '@/features/gamification/titles';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const start = useGameStore((s) => s.start);

  const paws = useProfileStore((s) => s.paws);
  const streak = useProfileStore((s) => s.streak);
  const dailyStreak = useProfileStore((s) => s.dailyStreak);
  const xp = useProfileStore((s) => s.xp);
  const collection = useProfileStore((s) => s.collection);
  const lastReward = useProfileStore((s) => s.lastReward);
  const clearLastReward = useProfileStore((s) => s.clearLastReward);
  const ensureDailyChoice = useProfileStore((s) => s.ensureDailyChoice);
  const audioMuted = useProfileStore((s) => s.audioMuted);
  const setAudioMuted = useProfileStore((s) => s.setAudioMuted);

  const level = levelFromXp(xp);
  const title = titleFor(level);
  const progress = xpProgress(xp);

  const previousPaws = lastReward?.previousPaws ?? paws;
  const previousStreak = lastReward?.previousStreak ?? streak;
  const previousXp = lastReward?.previousXp ?? xp;
  const previousLevel = levelFromXp(previousXp);
  const levelUp = level > previousLevel;
  // Po awansie pasek startuje od zera — stary procent dotyczył innego poziomu.
  const progressFrom = levelUp ? 0 : xpProgress(previousXp).pct;

  // make sure today's expedition picks are present
  useEffect(() => {
    ensureDailyChoice();
  }, [ensureDailyChoice]);

  // Greeting Timo — gra raz na sesję aplikacji (nie przy każdym powrocie na home).
  // Cleanup ucina powitanie, gdy ekran znika (np. wylogowanie albo zmiana
  // profilu) — inaczej Timo mówiłby do ekranu logowania.
  const greetedThisSession = useRef(false);
  useEffect(() => {
    if (!greetedThisSession.current) {
      greetedThisSession.current = true;
      const g = pickGreeting();
      timoVoice.playLine(g.voiceKey);
    }
    return () => {
      timoVoice.stop();
    };
  }, []);

  // clear lastReward after the entrance animation has played out
  useEffect(() => {
    if (!lastReward) return;
    const t = setTimeout(() => clearLastReward(), 1600);
    return () => clearTimeout(t);
  }, [lastReward, clearLastReward]);

  const [levelInfoOpen, setLevelInfoOpen] = useState(false);

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
    <View className="flex-1 bg-canvas">
      {/* ---------- górny pasek statystyk ---------- */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ paddingTop: insets.top + 8, paddingBottom: 10 }}>
        <View className="flex-row items-center">
          <StatBadge
            tooltipKey="streak"
            icon="flame"
            from={previousStreak}
            to={streak}
            accent="fox"
            delayMs={120}
            dimWhenZero
          />
          <StatBadge
            tooltipKey="paws"
            icon="paw"
            from={previousPaws}
            to={paws}
            accent="sky"
          />
          {dailyStreak > 0 ? (
            <StatBadge
              tooltipKey="daily_streak"
              icon="leaf"
              from={dailyStreak}
              to={dailyStreak}
              accent="primary"
              delayMs={60}
            />
          ) : null}
        </View>

        <Pressable
          onPress={() => setAudioMuted(!audioMuted)}
          accessibilityRole="button"
          accessibilityLabel={audioMuted ? 'Włącz głos Timo' : 'Wycisz głos Timo'}
          className="w-11 h-11 items-center justify-center rounded-pill"
          style={{ backgroundColor: UI.sunken }}>
          <Icon
            name={audioMuted ? 'sound-off' : 'sound-on'}
            size={21}
            color={audioMuted ? UI.textFaint : UI.textSoft}
            strokeWidth={2.4}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}>
        {/* ---------- poziom + pasek XP ---------- */}
        <Pressable
          onPress={() => setLevelInfoOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Poziom ${level}, ${title}`}
          className="flex-row items-center gap-3">
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={avatarStyle}>
              <View
                className="w-14 h-14 items-center justify-center rounded-pill"
                style={{
                  backgroundColor: UI.primaryPale,
                  borderWidth: 3,
                  borderColor: UI.primary,
                }}>
                <AnimatedCounter
                  from={previousLevel}
                  to={level}
                  durationMs={700}
                  delayMs={200}
                  style={{
                    color: UI.primaryDeep,
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 20,
                  }}
                />
              </View>
            </Animated.View>
            {levelUp ? (
              <FloatingDelta
                value={level - previousLevel}
                delayMs={200}
                color={UI.primaryDeep}
                containerStyle={{ top: -2 }}
              />
            ) : null}
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text
                style={{
                  color: UI.text,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 16,
                }}>
                {title}
              </Text>
              <Text
                style={{
                  color: UI.textFaint,
                  fontFamily: 'Nunito-Bold',
                  fontSize: 12,
                }}>
                {progress.current}/{progress.nextLevelAt} XP
              </Text>
            </View>
            <ProgressBar
              value={progress.pct}
              from={progressFrom}
              delayMs={200}
              height={14}
            />
          </View>
        </Pressable>

        <InfoModal
          visible={levelInfoOpen}
          tooltip={TOOLTIPS.level}
          onClose={() => setLevelInfoOpen(false)}
        />

        {/* ---------- Timo ---------- */}
        <View className="flex-1 items-center justify-center" style={{ marginTop: 16 }}>
          <View style={{ alignSelf: 'stretch', paddingRight: 24 }}>
            <Bubble eyebrow="TIMO MÓWI" tail="bottom-left">
              {collection.length === 0
                ? 'Cześć! Pomyśl o zwierzęciu — spróbuję zgadnąć!'
                : `Mamy razem ${collection.length} ${plural(collection.length)}. Gramy dalej?`}
            </Bubble>
          </View>
          <TimoCharacter state="greeting" size={190} />
        </View>

        {/* ---------- wyprawa dnia ---------- */}
        <ExpeditionDailyCard />

        {/* ---------- ranking tygodnia ---------- */}
        <LeaderboardCard />
      </ScrollView>

      {/* ---------- CTA ---------- */}
      <View
        className="px-5 bg-canvas"
        style={{ paddingTop: 10, paddingBottom: 12 }}>
        <Button label="ZAGRAJ Z TIMO" icon="bolt" onPress={handlePlay} />
      </View>
    </View>
  );
}

/** Polska odmiana rzeczownika „zwierzę" po liczebniku. */
function plural(n: number): string {
  if (n === 1) return 'zwierzę';
  const rest10 = n % 10;
  const rest100 = n % 100;
  const few = rest10 >= 2 && rest10 <= 4 && !(rest100 >= 12 && rest100 <= 14);
  return few ? 'zwierzęta' : 'zwierząt';
}

/* ---------------- Wyprawa Dnia ---------------- */

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        color: UI.textFaint,
        fontFamily: 'Fredoka-Bold',
        fontSize: 11,
        letterSpacing: 1.2,
        marginBottom: 8,
      }}>
      {children}
    </Text>
  );
}

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

  const launch = (id: string) => {
    chooseExpedition(id);
    const exp = EXPEDITIONS_BY_ID[id];
    if (exp?.mode === 'guided') {
      // Wyprawa z Timo → najpierw ekran kart inspiracji.
      router.push(`/expedition-intro/${id}`);
      return;
    }
    const prog = expeditionProgress[id];
    startGame({
      expeditionId: id,
      expeditionMode: exp?.mode ?? 'expert',
      excludeDiscovered: prog?.discovered ?? [],
    });
    router.push('/game');
  };

  // Stan C — ukończona
  if (chosen && completed) {
    return (
      <View className="mt-4">
        <SectionLabel>WYPRAWA DNIA</SectionLabel>
        <Card borderColor={UI.primary} background={UI.primaryPale}>
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 30 }}>{chosen.hero_emoji}</Text>
            <View className="flex-1">
              <Text
                style={{
                  color: UI.text,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 16,
                }}>
                {chosen.childTitle ?? chosen.title}
              </Text>
              <Text
                style={{
                  color: UI.primaryDeep,
                  fontFamily: 'Nunito-Bold',
                  fontSize: 13,
                }}>
                Ukończona! Jutro czeka nowa przygoda.
              </Text>
            </View>
            <Icon name="check" size={26} color={UI.primaryDeep} strokeWidth={3} />
          </View>
        </Card>
      </View>
    );
  }

  // Stan B — wybrana, w toku
  if (chosen) {
    return (
      <View className="mt-4">
        <SectionLabel>WYPRAWA DNIA</SectionLabel>
        <Card>
          <View className="flex-row items-center gap-3 mb-3">
            <Text style={{ fontSize: 30 }}>{chosen.hero_emoji}</Text>
            <View className="flex-1">
              <Text
                style={{
                  color: UI.text,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 16,
                }}>
                {chosen.childTitle ?? chosen.title}
              </Text>
              <Text
                style={{
                  color: UI.textSoft,
                  fontFamily: 'Nunito-Bold',
                  fontSize: 12,
                }}>
                Odkryte {discoveredCount} z {targetCount}
              </Text>
            </View>
          </View>
          <View className="mb-3">
            <ProgressBar
              value={targetCount > 0 ? discoveredCount / targetCount : 0}
              accent="sky"
              height={12}
            />
          </View>
          <Button
            label={discoveredCount === 0 ? 'RUSZAMY!' : 'KONTYNUUJ'}
            variant="sky"
            size="md"
            onPress={() => launch(chosen.id)}
          />
        </Card>
      </View>
    );
  }

  // Stan A — trzy propozycje do wyboru
  const options = dailyChoice.expedition_ids
    .map((id) => EXPEDITIONS_BY_ID[id])
    .filter(Boolean);

  return (
    <View className="mt-4">
      <SectionLabel>WYPRAWA DNIA — WYBIERZ JEDNĄ</SectionLabel>
      <View className="flex-row gap-2">
        {options.map((e) => {
          const prog = expeditionProgress[e.id];
          const done = prog?.completed_at != null;
          return (
            <View key={e.id} className="flex-1">
              <Card
                onPress={() => launch(e.id)}
                disabled={done}
                accessibilityLabel={e.childTitle ?? e.title}
                padding={10}
                radius={16}
                style={{ alignItems: 'center', minHeight: 104 }}>
                <Text style={{ fontSize: 30 }}>{e.hero_emoji}</Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: UI.text,
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                  {e.childTitle ?? e.title}
                </Text>
                {done ? (
                  <View style={{ marginTop: 2 }}>
                    <Icon
                      name="check"
                      size={16}
                      color={UI.primaryDeep}
                      strokeWidth={3}
                    />
                  </View>
                ) : null}
              </Card>
            </View>
          );
        })}
      </View>
    </View>
  );
}
