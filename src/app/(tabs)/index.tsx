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
import { ExpeditionIcon } from '@/components/expeditions/ExpeditionIcon';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatBadge } from '@/components/ui/StatBadge';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { TOOLTIPS } from '@/data/info-tooltips';
import { pickGreeting } from '@/data/timo-lines';
import { levelFromXp, xpProgress } from '@/features/gamification/award';
import { useWeeklyScoreSync } from '@/features/leaderboard/useWeeklyScoreSync';
import { titleFor } from '@/features/gamification/titles';
import { SHOW_HOME_LEADERBOARD } from '@/config/features';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const start = useGameStore((s) => s.start);

  const paws = useProfileStore((s) => s.paws);
  const streak = useProfileStore((s) => s.streak);
  const dailyStreak = useProfileStore((s) => s.dailyStreak);
  const xp = useProfileStore((s) => s.xp);
  const lastReward = useProfileStore((s) => s.lastReward);
  const clearLastReward = useProfileStore((s) => s.clearLastReward);
  const ensureDailyChoice = useProfileStore((s) => s.ensureDailyChoice);
  const audioMuted = useProfileStore((s) => s.audioMuted);
  const setAudioMuted = useProfileStore((s) => s.setAudioMuted);

  // Wysyłka wyniku tygodnia — niezależna od tego, czy tabela jest widoczna.
  useWeeklyScoreSync();

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
  const streakCelebration = useProfileStore((s) => s.streakCelebration);
  const greetedThisSession = useRef(false);
  useEffect(() => {
    // Ekran serii mówi własne powitanie. Gdyby Home odezwał się równolegle,
    // `playLine` uciąłby jedną z kwestii — czekamy, aż dziecko go zamknie.
    if (streakCelebration) return;
    if (greetedThisSession.current) return;
    greetedThisSession.current = true;
    void timoVoice.playLine(pickGreeting().voiceKey);
  }, [streakCelebration]);

  // Osobny efekt z pustą listą zależności: głos ma milknąć przy zejściu
  // z ekranu, a nie przy każdej zmianie `streakCelebration`.
  useEffect(() => () => timoVoice.stop(), []);

  // clear lastReward after the entrance animation has played out
  useEffect(() => {
    if (!lastReward) return;
    const t = setTimeout(() => clearLastReward(), 1600);
    return () => clearTimeout(t);
  }, [lastReward, clearLastReward]);

  const [levelInfoOpen, setLevelInfoOpen] = useState(false);

  // Linia gruntu polany: mierzona z pozycji Timo, bo zależy od wysokości paska
  // statystyk (insets.top), paska XP i liczby linijek dymka. Patrz TimoStage.
  const [groundY, setGroundY] = useState<number | null>(null);

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
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('home') }}>
      {/* ---------- polana: pełnoekranowe tło pod całą zawartością ---------- */}
      <SceneBackdrop groundY={groundY} scene="home" />

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
          // Biały chip z cieniem, jak przy StatBadge — przycisk leży na
          // ilustracji, a dotychczasowe `sunken` się z nią zlewało.
          style={{ backgroundColor: UI.surface, boxShadow: SHADOW.e0 }}>
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
                    fontFamily: 'Gabarito-Bold',
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
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 16,
                }}>
                {title}
              </Text>
              <Text
                style={{
                  color: UI.text,
                  fontFamily: 'Lexend-Bold',
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

        {/* ---------- ranking tygodnia ----------
            Schowany na czas przebudowy wizualnej (SHOW_HOME_LEADERBOARD).
            Sama synchronizacja wyniku leci wyżej, przez useWeeklyScoreSync. */}
        {SHOW_HOME_LEADERBOARD ? <LeaderboardCard /> : null}
      </ScrollView>

      {/* ---------- Timo ----------
          Warstwa nad treścią, wyśrodkowana na CAŁYM ekranie. Wcześniej lisek
          siedział w ScrollView z `flex: 1`, ale to środkowało go w obszarze
          przewijania — a dok na dole (~216 pt) ściągał środek tego obszaru
          o ~74 pt w górę. Jako warstwa nie zależy od wysokości doku ani paska
          statystyk, więc trzyma środek niezależnie od stanu wyprawy.
          `pointerEvents: none`, żeby nie przechwytywał dotknięć doku. */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
        <TimoStage onGroundY={setGroundY} />
      </View>

      {/* ---------- dok: wyprawa dnia + CTA ----------
          Wyprawa siedziała w ScrollView zaraz pod Timo. Tutaj jest zadokowana
          nad przyciskiem: dół ekranu niesie akcje, środek zostaje dla liska. */}
      <View className="px-5" style={{ paddingTop: 10, paddingBottom: 12 }}>
        <ExpeditionDailyCard />
        <View style={{ marginTop: 12 }}>
          <Button label="ZAGRAJ Z TIMO" icon="bolt" onPress={handlePlay} />
        </View>
      </View>
    </View>
  );
}


/* ---------------- Wyprawa Dnia ---------------- */

/** Etykieta sekcji leży wprost na trawie, więc jest atramentowa, nie biała:
 *  atrament ma na `lawn` kontrast 7.0:1, biel tylko 2.2:1. */
function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        color: UI.text,
        fontFamily: 'Gabarito-Bold',
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
      <View>
        <SectionLabel>WYPRAWA DNIA</SectionLabel>
        <Card tone="panel" borderColor={UI.primaryPale}>
          <View className="flex-row items-center gap-3">
            <ExpeditionIcon expeditionId={chosen.id} fallbackEmoji={chosen.hero_emoji} size={38} />
            <View className="flex-1">
              <Text
                style={{
                  color: UI.onLawn,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 16,
                }}>
                {chosen.childTitle ?? chosen.title}
              </Text>
              <Text
                style={{
                  color: UI.onLawnSoft,
                  fontFamily: 'Lexend-Bold',
                  fontSize: 13,
                }}>
                Ukończona! Jutro czeka nowa przygoda.
              </Text>
            </View>
            <Icon name="check" size={26} color={UI.onLawn} strokeWidth={3} />
          </View>
        </Card>
      </View>
    );
  }

  // Stan B — wybrana, w toku
  if (chosen) {
    return (
      <View className="mt-40">
        <SectionLabel>WYPRAWA DNIA</SectionLabel>
        <Card tone="panel">
          <View className="flex-row items-center gap-3 mb-3">
            <ExpeditionIcon expeditionId={chosen.id} fallbackEmoji={chosen.hero_emoji} size={38} />
            <View className="flex-1">
              <Text
                style={{
                  color: UI.onLawn,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 16,
                }}>
                {chosen.childTitle ?? chosen.title}
              </Text>
              <Text
                style={{
                  color: UI.onLawnSoft,
                  fontFamily: 'Lexend-Bold',
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
    <View>
      <SectionLabel>WYPRAWA DNIA — WYBIERZ JEDNĄ</SectionLabel>
      <View className="flex-row gap-2">
        {options.map((e) => {
          const prog = expeditionProgress[e.id];
          const done = prog?.completed_at != null;
          return (
            <View key={e.id} className="flex-1">
              <Card
                tone="panel"
                onPress={() => launch(e.id)}
                disabled={done}
                accessibilityLabel={e.childTitle ?? e.title}
                padding={10}
                radius={16}
                style={{ alignItems: 'center', minHeight: 104 }}>
                <ExpeditionIcon expeditionId={e.id} fallbackEmoji={e.hero_emoji} size={38} />
                <Text
                  numberOfLines={2}
                  style={{
                    color: UI.onLawn,
                    fontFamily: 'Gabarito-Bold',
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
                      color={UI.onLawn}
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
