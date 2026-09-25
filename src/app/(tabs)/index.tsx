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
import { INK, SlotDisc } from '@/components/collection/map';
import { useInfoSheet } from '@/components/sheet/InfoSheet';
import { ExpeditionCard, ExpeditionTile } from '@/components/expeditions/ExpeditionCard';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Plate } from '@/components/ui/Plate';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatBadge } from '@/components/ui/StatBadge';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { TOOLTIPS, TOOLTIP_ART } from '@/data/info-tooltips';
import { pickGreeting } from '@/data/timo-lines';
import { levelFromXp, xpProgress } from '@/features/gamification/award';
import { useWeeklyScoreSync } from '@/features/leaderboard/useWeeklyScoreSync';
import { titleFor } from '@/features/gamification/titles';
import { DEV_DAILY_EXPEDITION, SHOW_HOME_LEADERBOARD } from '@/config/features';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const SOUND_ON = require('../../../assets/icons/info/sound_on.png');
const SOUND_OFF = require('../../../assets/icons/info/sound_off.png');

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

  const openSheet = useInfoSheet();

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
            from={previousStreak}
            to={streak}
            accent="fox"
            delayMs={120}
            dimWhenZero
          />
          <StatBadge
            tooltipKey="paws"
            from={previousPaws}
            to={paws}
            accent="sky"
          />
          {dailyStreak > 0 ? (
            <StatBadge
              tooltipKey="daily_streak"
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
          accessibilityLabel={audioMuted ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
          {/* Ta sama tarcza, co zwierzęta i odznaki, pod tym samym papierem
              co pigułki obok — wcześniej był tu biały chip z kreskową ikoną. */}
          <SlotDisc size={46}>
            <Image
              source={audioMuted ? SOUND_OFF : SOUND_ON}
              style={{ flex: 1 }}
              contentFit="contain"
              transition={0}
              accessible={false}
            />
          </SlotDisc>
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
          onPress={() => openSheet({ ...TOOLTIPS.level, art: TOOLTIP_ART.level, accent: 'primary' })}
          accessibilityRole="button"
          accessibilityLabel={`Poziom ${level}, ${title}`}
          className="flex-row items-center gap-3">
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={avatarStyle}>
              {/* Numer poziomu na tej samej tarczy, co głośnik i odznaki —
                  turkusowe kółko z UI 3.0 było ostatnim elementem paska
                  w starym stylu. */}
              <SlotDisc size={58}>
                <View className="flex-1 items-center justify-center">
                  <AnimatedCounter
                    from={previousLevel}
                    to={level}
                    durationMs={700}
                    delayMs={200}
                    style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 22 }}
                  />
                </View>
              </SlotDisc>
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
          {/* Lisi kolor, bo to gra z samym Timo — przycisk wyprawy wyżej
              bierze kolor wyprawy, więc oba nie zlewają się w jedno. */}
          <Plate label="Zagraj z Timo" accent="fox" onPress={handlePlay} />
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

  // DEV_DAILY_EXPEDITION podmienia tylko to, CO pokazujemy — dane profilu
  // zostają nietknięte.
  const chosenId =
    DEV_DAILY_EXPEDITION === 'pick'
      ? null
      : DEV_DAILY_EXPEDITION === 'auto'
        ? dailyChoice.chosen_id
        : (dailyChoice.chosen_id ?? dailyChoice.expedition_ids[0] ?? null);
  const chosen = chosenId ? EXPEDITIONS_BY_ID[chosenId] : null;
  const progress = chosenId ? expeditionProgress[chosenId] : undefined;
  const completed =
    DEV_DAILY_EXPEDITION === 'completed'
      ? true
      : DEV_DAILY_EXPEDITION === 'chosen'
        ? false
        : progress?.completed_at != null;
  const discoveredCount = progress?.discovered.length ?? 0;

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

  // Stan C — ukończona. Wszystkie kropki pełne mówią to samo bez czytania.
  if (chosen && completed) {
    return (
      <ExpeditionCard
        expedition={chosen}
        eyebrow="WYPRAWA DNIA"
        subtitle="Ukończona! Jutro czeka nowa przygoda."
        discovered={chosen.target_count}
        showProgress
      />
    );
  }

  // Stan B — wybrana, w toku
  if (chosen) {
    return (
      <ExpeditionCard
        expedition={chosen}
        eyebrow="WYPRAWA DNIA"
        discovered={discoveredCount}
        showProgress
        action={{
          label: discoveredCount === 0 ? 'Ruszamy!' : 'Kontynuuj',
          onPress: () => launch(chosen.id),
        }}
      />
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
        {options.map((e) => (
          <ExpeditionTile
            key={e.id}
            expedition={e}
            done={expeditionProgress[e.id]?.completed_at != null}
            onPress={() => launch(e.id)}
          />
        ))}
      </View>
    </View>
  );
}
