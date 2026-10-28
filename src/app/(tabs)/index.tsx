import { useIsFocused, useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
import { ParentalGate } from '@/components/paywall/ParentalGate';
import { Plate } from '@/components/ui/Plate';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatBadge, statBadgeWidth } from '@/components/ui/StatBadge';
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
import { SHADOW, UI } from '@/theme/ui';
import { Icon } from '@/components/ui/Icon';
import { Pressable, Text, View } from '@/tw';
import { contentColumn, useTimoHeight, useUiScale } from '@/lib/layout';
import { Image } from '@/tw/image';
import { FREE_DAILY_ROUNDS, isFreeExpedition } from '@/config/free-tier';
import { useFreeRoundsLeft } from '@/lib/stores/free-rounds-store';
import { usePremium } from '@/lib/purchases';

const SOUND_ON = require('../../../assets/icons/info/sound_on.png');
const SOUND_OFF = require('../../../assets/icons/info/sound_off.png');
const PARENT = require('../../../assets/icons/info/parent.png');
const HELP = require('../../../assets/icons/info/help.png');
const EXPEDITIONS_ICON = require('../../../assets/icons/tab-expeditions.png');

/** Linia gruntu polany z ostatniego pomiaru Menu — patrz `groundY`. */
let lastGroundY: number | null = null;

export default function HomeScreen() {
  const timoH = useTimoHeight(0.6);
  const k = useUiScale();
  const router = useRouter();
  const [parentGate, setParentGate] = useState(false);
  const { width: screenW } = useWindowDimensions();
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

  // Górny pasek: na telefonie ciaśniej (tarcze 40 pt, odstęp 6, margines 12),
  // żeby obok trzech tarcz zmieściły się też trzy plakietki z serią dni.
  const barDisc = k > 1 ? 46 * k : 40;
  const barGap = k > 1 ? 8 : 6;
  const barPad = k > 1 ? 16 : 12;
  // Ile plakietek zmieści się obok trzech tarcz.
  const badgeFit = (() => {
    const free = screenW - 2 * barPad - (3 * barDisc + 2 * barGap);
    const wantDaily = dailyStreak > 1;
    const n = wantDaily ? 3 : 2;
    if (n * statBadgeWidth(k) <= free) return { compact: false, showDaily: wantDaily };
    if (n * statBadgeWidth(k, true) <= free) return { compact: true, showDaily: wantDaily };
    return { compact: 2 * statBadgeWidth(k) > free, showDaily: false };
  })();

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
  // Po zakupie (zmiana wersji) zestaw dnia przelicza się na pełną wersję.
  const premium = usePremium();
  useEffect(() => {
    ensureDailyChoice();
  }, [ensureDailyChoice, premium]);

  // Greeting Timo — gra raz na sesję aplikacji (nie przy każdym powrocie na home).
  // Cleanup ucina powitanie, gdy ekran znika (np. wylogowanie albo zmiana
  // profilu) — inaczej Timo mówiłby do ekranu logowania.
  const streakCelebration = useProfileStore((s) => s.streakCelebration);
  const greetedThisSession = useRef(false);
  // Menu powstaje już pod ekranem „Cześć!” (patrz EntryRedirect w _layout) —
  // wita się dopiero, gdy jest widoczne.
  const focused = useIsFocused();
  useEffect(() => {
    // Ekran serii mówi własne powitanie. Gdyby Home odezwał się równolegle,
    // `playLine` uciąłby jedną z kwestii — czekamy, aż dziecko go zamknie.
    if (streakCelebration || !focused) return;
    if (greetedThisSession.current) return;
    greetedThisSession.current = true;
    void timoVoice.playLine(pickGreeting().voiceKey);
  }, [streakCelebration, focused]);

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
  // Ostatni pomiar z tej sesji: Menu budowane od nowa (zmiana profilu, powrót
  // z „Kto gra?”) od razu rysuje polanę, zamiast pokazać samo zielone tło.
  const [groundY, setGroundYState] = useState<number | null>(lastGroundY);
  const setGroundY = useCallback((y: number) => {
    lastGroundY = y;
    setGroundYState(y);
  }, []);

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

  const roundsLeft = useFreeRoundsLeft();
  const handlePlay = () => {
    // Wersja darmowa: po wykorzystaniu dzisiejszych rund Timo odpoczywa
    // i odsyła na wyprawy.
    if (roundsLeft === 0) {
      router.push('/free-limit');
      return;
    }
    start();
    router.push('/game');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('home') }}>
      {/* ---------- polana: pełnoekranowe tło pod całą zawartością ---------- */}
      <SceneBackdrop groundY={groundY} scene="home" />

      {/* ---------- górny pasek statystyk ----------
          Trzy tarcze z prawej (pomoc, dźwięk, strefa rodzica) mają zawsze
          miejsce. Plakietki z lewej najpierw się zmniejszają, a jeśli i tak
          się nie mieszczą, znika „Dni z Timo”. Na iPhonie 16 (393 pt) trzy
          pełne plakietki wypychały tarczę rodzica poza ekran. */}
      <View
        className="flex-row items-center justify-between"
        style={{ ...contentColumn, paddingHorizontal: barPad, paddingTop: insets.top + 8, paddingBottom: 10 }}>
        <View className="flex-row items-center">
          <StatBadge
            tooltipKey="streak"
            from={previousStreak}
            to={streak}
            accent="fox"
            delayMs={120}
            compact={badgeFit.compact}
          />
          <StatBadge
            tooltipKey="paws"
            from={previousPaws}
            to={paws}
            accent="sky"
            compact={badgeFit.compact}
          />
          {/* Od drugiego dnia z rzędu — „1” pierwszego dnia nic nie mówiło. */}
          {badgeFit.showDaily ? (
            <StatBadge
              tooltipKey="daily_streak"
              from={dailyStreak}
              to={dailyStreak}
              accent="primary"
              delayMs={60}
              compact={badgeFit.compact}
            />
          ) : null}
        </View>

        <View className="flex-row items-center" style={{ gap: barGap }}>
        {/* Pełna instrukcja gry — ta sama tarcza co głośnik obok. */}
        <Pressable
          onPress={() => router.push('/help')}
          accessibilityRole="button"
          accessibilityLabel="Jak grać — instrukcja"
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
          <SlotDisc size={barDisc}>
            {/* Książeczka ze znakiem zapytania zamiast suchego „?” — ten sam
                styl co głośnik i tarcza rodzica obok. */}
            <Image source={HELP} style={{ flex: 1 }} contentFit="contain" transition={0} accessible={false} />
          </SlotDisc>
        </Pressable>
        <Pressable
          onPress={() => setAudioMuted(!audioMuted)}
          accessibilityRole="button"
          accessibilityLabel={audioMuted ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
          {/* Ta sama tarcza, co zwierzęta i odznaki, pod tym samym papierem
              co pigułki obok — wcześniej był tu biały chip z kreskową ikoną. */}
          <SlotDisc size={barDisc}>
            <Image
              source={audioMuted ? SOUND_OFF : SOUND_ON}
              style={{ flex: 1 }}
              contentFit="contain"
              transition={0}
              accessible={false}
            />
          </SlotDisc>
        </Pressable>
        {/* Strefa rodzica: ustawienia, konto, subskrypcja, usunięcie konta —
            zawsze za bramką rodzicielską. */}
        <Pressable
          onPress={() => setParentGate(true)}
          accessibilityRole="button"
          accessibilityLabel="Dla rodzica — ustawienia i konto"
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
          <SlotDisc size={barDisc}>
            <Image source={PARENT} style={{ flex: 1 }} contentFit="cover" transition={0} accessible={false} />
          </SlotDisc>
        </Pressable>
        </View>
      </View>

      {/* Zwykły widok, nie ScrollView: w środku jest tylko pasek XP, a przewijanie
          zajmowało cały środek ekranu — przeciągnięcie po lisku ciągnęło pasek.
          Gdy wróci tabela wyników (SHOW_HOME_LEADERBOARD), trzeba będzie ją
          przewijać osobno, nie cały środek. */}
      <View style={{ ...contentColumn, flex: 1, paddingHorizontal: 20, paddingBottom: 12 }}>
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
              <SlotDisc size={58 * k}>
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
              height={14 * k}
            />
          </View>
        </Pressable>
        {/* ---------- gry na dziś (wersja darmowa) ---------- */}
        {roundsLeft !== null ? <RoundsLeft left={roundsLeft} /> : null}
        {/* ---------- ranking tygodnia ----------
            Schowany na czas przebudowy wizualnej (SHOW_HOME_LEADERBOARD).
            Sama synchronizacja wyniku leci wyżej, przez useWeeklyScoreSync. */}
        {SHOW_HOME_LEADERBOARD ? <LeaderboardCard /> : null}
      </View>

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
        {/* Większy niż domyślne 190 pt — na Menu lisek ginął na tle polany. */}
        <TimoStage onGroundY={setGroundY} height={timoH} />
      </View>

      {/* ---------- dok: wyprawa dnia + CTA ----------
          Wyprawa siedziała w ScrollView zaraz pod Timo. Tutaj jest zadokowana
          nad przyciskiem: dół ekranu niesie akcje, środek zostaje dla liska. */}
      <View className="px-5" style={{ ...contentColumn, paddingTop: 10, paddingBottom: 12 }}>
        <ExpeditionDailyCard />
        <View style={{ marginTop: 12 }}>
          {/* Lisi kolor, bo to gra z samym Timo — przycisk wyprawy wyżej
              bierze kolor wyprawy, więc oba nie zlewają się w jedno. */}
          <Plate label="Zagraj z Timo" accent="fox" onPress={handlePlay} />
        </View>
      </View>

      <ParentalGate
        visible={parentGate}
        onCancel={() => setParentGate(false)}
        onPass={() => {
          setParentGate(false);
          router.push('/parent');
        }}
      />
    </View>
  );
}


/* ---------------- Gry na dziś (wersja darmowa) ---------------- */

const GAME_ART = require('../../../assets/icons/start/guess.png');

/** „Została 1 gra”, „Zostały 2 gry”. */
function roundsLabel(left: number): string {
  if (left === 0) return 'Na dziś koniec — jutro wracają!';
  if (left === 1) return 'Została 1 gra';
  return `Zostały ${left} gry`;
}

/**
 * Licznik gier z Timo w wersji darmowej — plakietka pod paskiem XP, tam gdzie
 * dziecko i tak patrzy na swoje postępy. Pod przyciskiem „Zagraj z Timo”
 * gryzła się z dokiem. Pełne żetony z łapką to gry, które zostały.
 * Stuknięcie wysuwa panel: dlaczego jest limit i co robić, gdy się skończy.
 */
function RoundsLeft({ left }: { left: number }) {
  const openSheet = useInfoSheet();
  const open = () =>
    openSheet({
      title: left > 0 ? `Gry z Timo: ${roundsLabel(left).toLowerCase()}` : 'Timo odpoczywa',
      description:
        `Timo może zgadywać ${FREE_DAILY_ROUNDS} razy dziennie — potem jego nos musi odpocząć. ` +
        'Jutro gry wracają! Wyprawy działają zawsze, więc gdy skończą się gry, ruszaj na wyprawę. ' +
        'W pełnej wersji gra się bez limitu — zapytaj rodzica.',
      art: GAME_ART,
      button: 'Rozumiem',
      accent: 'fox',
    });

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`Gry z Timo na dziś: ${roundsLabel(left)}. Stuknij, żeby dowiedzieć się więcej.`}
      style={({ pressed }) => ({
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 6,
        paddingRight: 12,
        paddingVertical: 6,
        borderRadius: 22,
        backgroundColor: UI.page,
        boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: UI.foxPale,
        }}>
        <Image source={GAME_ART} style={{ width: 32, height: 32 }} contentFit="contain" transition={0} accessible={false} />
      </View>
      <View className="flex-1">
        <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend-Bold', fontSize: 11, letterSpacing: 0.4 }}>
          GRY Z TIMO NA DZIŚ
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>
          {roundsLabel(left)}
        </Text>
      </View>
      <View className="flex-row" style={{ gap: 5 }}>
        {Array.from({ length: FREE_DAILY_ROUNDS }, (_, i) => {
          const full = i < left;
          return (
            <View
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: full ? UI.fox : UI.pageSlot,
                // Twardy dolny rant jak na przyciskach — pełny żeton wygląda
                // na coś do wydania, pusty jest wklęsły.
                boxShadow: full ? `0px 2px 0px ${UI.foxDeep}` : 'inset 0px 1px 2px rgba(0,0,0,0.08)',
              }}>
              <Icon name="paw" size={14} color={full ? '#ffffff' : 'rgba(60,40,20,0.18)'} strokeWidth={2.4} />
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

/* ---------------- Wyprawa Dnia ---------------- */

/**
 * Nagłówek „Wyprawa Dnia” i trzy tarcze wypraw jako jeden blok. Nagłówek to
 * wyśrodkowana pergaminowa pigułka nad środkową tarczą — ten sam papier co
 * tarcze, więc czyta się jako ich podpis, a nie luźny napis na trawie
 * (wcześniej leżał z lewej i wyglądał na oderwany). Ikona mapy z kompasem,
 * jak na zakładce „Wyprawy” — kalendarz należy do „Dni z Timo”.
 */
function DailyPickPanel({ children }: { children: ReactNode }) {
  const k = useUiScale();
  return (
    <View>
      <View
        className="flex-row items-center"
        style={{
          alignSelf: 'center',
          gap: 8 * k,
          paddingLeft: 8 * k,
          paddingRight: 16 * k,
          paddingVertical: 5 * k,
          borderRadius: 999,
          backgroundColor: UI.page,
          boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
        }}>
        <Image
          source={EXPEDITIONS_ICON}
          style={{ width: 30 * k, height: 30 * k }}
          contentFit="contain"
          transition={0}
          accessible={false}
        />
        <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>Wyprawa Dnia</Text>
        <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend-Bold', fontSize: 13 }}>· wybierz jedną</Text>
      </View>
      {children}
    </View>
  );
}

function ExpeditionDailyCard() {
  const router = useRouter();
  const premium = usePremium();
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
    <DailyPickPanel>
      <View className="flex-row" style={{ marginTop: 10, gap: 6 }}>
        {options.map((e) => (
          <ExpeditionTile
            key={e.id}
            expedition={e}
            gratis={!premium && !isFreeExpedition(e.id)}
            done={expeditionProgress[e.id]?.completed_at != null}
            onPress={() => launch(e.id)}
          />
        ))}
      </View>
    </DailyPickPanel>
  );
}

