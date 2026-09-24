import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { AnimalReveal } from '@/components/game/AnimalReveal';
import { AnimatedCounter } from '@/components/gamification/AnimatedCounter';
import { LevelUpCelebration } from '@/components/gamification/LevelUpCelebration';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RewardTile } from '@/components/ui/RewardTile';
import { StatBadge } from '@/components/ui/StatBadge';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickGiveUpLine, pickGuidedGiveUp, pickVictoryLine } from '@/data/timo-lines';
import { levelFromXp } from '@/features/gamification/award';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const guess = useGameStore((s) => s.guess);
  const phase = useGameStore((s) => s.phase);
  const questionsAsked = useGameStore((s) => s.questionsAsked);
  const mode = useGameStore((s) => s.mode);
  const expeditionId = useGameStore((s) => s.expeditionId);
  const startGame = useGameStore((s) => s.start);

  const paws = useProfileStore((s) => s.paws);
  const streak = useProfileStore((s) => s.streak);
  const xp = useProfileStore((s) => s.xp);
  const lastReward = useProfileStore((s) => s.lastReward);
  const lastExpeditionReward = useProfileStore((s) => s.lastExpeditionReward);
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const award = useProfileStore((s) => s.award);
  const recordExpeditionDiscovery = useProfileStore((s) => s.recordExpeditionDiscovery);
  const clearLastReward = useProfileStore((s) => s.clearLastReward);
  const clearLastExpeditionReward = useProfileStore((s) => s.clearLastExpeditionReward);

  // Linia gruntu sceny — mierzona z pozycji Timo, jak na Home i w grze.
  const [groundY, setGroundY] = useState<number | null>(null);

  const level = levelFromXp(xp);
  const previousPaws = lastReward?.previousPaws ?? paws;
  const previousStreak = lastReward?.previousStreak ?? streak;
  const previousLevel = lastReward ? levelFromXp(lastReward.previousXp) : level;

  const timoGuessed = phase === 'timo_guessed';
  const answers = useGameStore((s) => s.answers);
  const awarded = useRef(false);

  // Po poddaniu się Timo dziecko wskazuje zwierzę. Dopóki tego nie zrobi (albo
  // nie powie „nie pamiętam"), NIE naliczamy nagrody — inaczej policzylibyśmy ją
  // bez zwierzęcia i kolekcja by nie urosła.
  // Awans pokazujemy DOPIERO po naliczeniu nagród. Kafelki kończą liczyć
  // ~1190 ms; wcześniejsze wejście zasłoniłoby je tak samo, jak robiła to
  // kiedyś automatycznie otwierana karta zwierzaka.
  const [showLevelUp, setShowLevelUp] = useState(false);
  const levelUpShown = useRef(false);

  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [revealSkipped, setRevealSkipped] = useState(false);
  const needsReveal = phase === 'child_stumped' && revealedId === null && !revealSkipped;

  /** Zwierzę rundy: strzał Timo albo wskazanie dziecka. */
  const roundAnimal = timoGuessed
    ? guess
    : revealedId
      ? (ANIMALS_BY_ID[revealedId] ?? null)
      : null;
  const voicePlayed = useRef(false);
  const expeditionMode = useGameStore((s) => s.expeditionMode);

  // Pełnoekranowa karta zwierzaka NIE otwiera się już sama.
  //
  // Wcześniej robił to `router.push` po 600 ms — i wjeżdżał w środek naliczania
  // nagród. Kafelki liczą się tak: Tropy kończą na ~830 ms, XP na ~1010 ms,
  // a „Nowe!" na ~1190 ms. Co gorsza, auto-otwarcie odpalało się WYŁĄCZNIE przy
  // `isFirstDiscovery`, czyli dokładnie wtedy, gdy pojawia się kafelek „Nowe!" —
  // ten najciekawszy miał więc gwarancję, że zostanie zasłonięty.
  //
  // Kartę otwiera teraz przycisk „Zobacz kartę zwierzęcia" pod zwierzakiem.

  // Autoplay voice: po 600ms.
  // Wygrana: [victory.{i}, animal.{guess.id}] — Timo cieszy się + woła zwierzaka po imieniu.
  // Przegrana: [giveup.{i}] (lub guided_giveup w trybie guided).
  useEffect(() => {
    if (voicePlayed.current) return;
    if (phase !== 'timo_guessed' && phase !== 'child_stumped') return;
    voicePlayed.current = true;
    const t = setTimeout(() => {
      if (phase === 'timo_guessed' && guess) {
        const v = pickVictoryLine();
        timoVoice.playSequence([v.voiceKey, `animal.${guess.id}`], {
          initialDelayMs: 400,
        });
      } else if (phase === 'child_stumped') {
        const g = expeditionMode === 'guided' ? pickGuidedGiveUp() : pickGiveUpLine();
        timoVoice.playLine(g.voiceKey);
      }
    }, 600);
    return () => {
      clearTimeout(t);
      timoVoice.stop();
    };
  }, [phase, guess, expeditionMode]);

  const expedition = expeditionId ? EXPEDITIONS_BY_ID[expeditionId] : null;
  const expProgress = expeditionId ? expeditionProgress[expeditionId] : undefined;
  const expCompletionJustHappened =
    lastExpeditionReward !== null && lastExpeditionReward.expedition_id === expeditionId;

  // Nagroda naliczana RAZ — po trafieniu od razu, po poddaniu dopiero gdy
  // dziecko wskaże zwierzę albo je pominie.
  useEffect(() => {
    if (awarded.current) return;
    if (phase !== 'timo_guessed' && phase !== 'child_stumped') return;
    if (needsReveal) return;

    const animalId = roundAnimal?.id ?? null;
    award({ timoGuessed, questionsAsked, animalId, answers });

    // Odkrycie w wyprawie liczy się też wtedy, gdy zwierzę wskazało dziecko —
    // wcześniej było zabramkowane trafieniem Timo.
    if (mode === 'expedition' && expeditionId && animalId) {
      recordExpeditionDiscovery(expeditionId, animalId);
    }
    awarded.current = true;
  }, [
    phase,
    needsReveal,
    roundAnimal,
    timoGuessed,
    answers,
    award,
    questionsAsked,
    mode,
    expeditionId,
    recordExpeditionDiscovery,
  ]);

  const levelUp = level > previousLevel;

  useEffect(() => {
    if (levelUpShown.current) return;
    if (!levelUp || !lastReward) return;
    const t = setTimeout(() => {
      levelUpShown.current = true;
      setShowLevelUp(true);
    }, 1400);
    return () => clearTimeout(t);
  }, [levelUp, lastReward]);

  const playAgain = useCallback(() => {
    clearLastReward();
    clearLastExpeditionReward();
    if (mode === 'expedition' && expeditionId && expedition) {
      // continue same expedition with updated discovered list
      const prog = expeditionProgress[expeditionId];
      const expDone = prog?.completed_at != null;
      if (!expDone) {
        if (expedition.mode === 'guided') {
          // Wyprawa z Timo — wracaj na ekran kart inspiracji.
          router.replace(`/expedition-intro/${expeditionId}`);
          return;
        }
        startGame({
          expeditionId,
          expeditionMode: 'expert',
          excludeDiscovered: prog?.discovered ?? [],
        });
        router.replace('/game');
        return;
      }
    }
    startGame();
    router.replace('/game');
  }, [
    clearLastReward,
    clearLastExpeditionReward,
    startGame,
    router,
    mode,
    expeditionId,
    expedition,
    expeditionProgress,
  ]);

  const home = useCallback(() => {
    // keep lastReward — Home animates the gain and clears after
    startGame();
    router.replace('/(tabs)');
  }, [startGame, router]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: sceneBaseColor(
          'result',
          mode === 'expedition' ? expeditionId : null
        ),
      }}>
      <SceneBackdrop
        groundY={groundY}
        scene="result"
        expeditionId={mode === 'expedition' ? expeditionId : null}
      />

      {/* ---------- pasek statystyk ---------- */}
      <View
        className="flex-row items-center justify-between px-5"
        style={{ paddingTop: insets.top + 8, paddingBottom: 8 }}>
        <View
          className="w-11 h-11 items-center justify-center rounded-pill"
          style={{ backgroundColor: UI.surface, boxShadow: SHADOW.e0 }}>
          <AnimatedCounter
            from={previousLevel}
            to={level}
            durationMs={700}
            delayMs={200}
            style={{ color: UI.primaryDeep, fontFamily: 'Gabarito-Bold', fontSize: 16 }}
          />
        </View>

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
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}>
        {/* ---------- werdykt ---------- */}
        <View
          className="rounded-pill px-6 py-2"
          style={{ backgroundColor: timoGuessed ? UI.primary : UI.gold }}>
          <Text
            style={{
              color: UI.surface,
              fontFamily: 'Gabarito-Bold',
              fontSize: 14,
              letterSpacing: 1.5,
            }}>
            {timoGuessed ? 'UDAŁO SIĘ NAM!' : 'PRZECHYTRZYŁEŚ TIMO!'}
          </Text>
        </View>

        <View style={{ alignSelf: 'stretch' }}>
          <TimoStage onGroundY={setGroundY} />
        </View>

        {/* ---------- ujawnienie albo karta zwierzęcia ----------
            Po poddaniu się Timo dziecko najpierw wskazuje zwierzę; nagrody
            czekają, bo bez `animalId` kolekcja by nie urosła. */}
        {needsReveal ? (
          <AnimalReveal
            answers={answers}
            poolIds={mode === 'expedition' ? expedition?.roster : undefined}
            onPick={setRevealedId}
            onSkip={() => setRevealSkipped(true)}
          />
        ) : (
          <View style={{ alignSelf: 'stretch' }}>
            <Card padding={18}>
              <Text
                className="text-center"
                style={{
                  color: UI.textFaint,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 11,
                  letterSpacing: 1.2,
                  marginBottom: 6,
                }}>
                {timoGuessed ? 'ODKRYTE RAZEM' : 'TWOJE ZWIERZĘ'}
              </Text>

              {roundAnimal ? (
                <View className="items-center">
                  <AnimalImage
                    animalId={roundAnimal.id}
                    size={96}
                  />
                  <Text
                    style={{
                      color: UI.text,
                      fontFamily: 'Gabarito-Bold',
                      fontSize: 24,
                      marginTop: 8,
                      marginBottom: 4,
                    }}>
                    {roundAnimal.name_pl}
                  </Text>
                  <Text
                    className="text-center"
                    style={{
                      color: UI.textSoft,
                      fontFamily: 'Lexend',
                      fontSize: 13,
                      lineHeight: 19,
                    }}>
                    {roundAnimal.fun_fact_pl}
                  </Text>
                  <Pressable
                    onPress={() => router.push(`/animal/${roundAnimal.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel="Zobacz kartę zwierzęcia"
                    className="rounded-pill mt-3 flex-row items-center gap-1.5"
                    style={{
                      backgroundColor: UI.skyPale,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}>
                    <Icon name="grid" size={15} color={UI.skyDeep} strokeWidth={2.6} />
                    <Text
                      style={{
                        color: UI.skyDeep,
                        fontFamily: 'Gabarito-Bold',
                        fontSize: 13,
                      }}>
                      Zobacz kartę zwierzęcia
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View className="items-center">
                  <Text
                    style={{
                      color: UI.text,
                      fontFamily: 'Gabarito-Bold',
                      fontSize: 20,
                      marginBottom: 4,
                    }}>
                    {expedition?.mode === 'guided'
                      ? 'Wybrałeś świetnie!'
                      : 'Nie udało mi się!'}
                  </Text>
                  <Text
                    className="text-center"
                    style={{
                      color: UI.textSoft,
                      fontFamily: 'Lexend',
                      fontSize: 13,
                      lineHeight: 19,
                    }}>
                    {expedition?.mode === 'guided'
                      ? 'Pokaż mi, kogo wybrałeś — spróbujemy znów na nowej wyprawie!'
                      : 'Powiedz mi, jakie to było zwierzę — następnym razem na pewno zgadnę!'}
                  </Text>
                </View>
              )}
            </Card>
          </View>
        )}

        {/* ---------- nagrody ---------- */}
        {lastReward ? (
          <View className="flex-row gap-2.5 mt-3" style={{ alignSelf: 'stretch' }}>
            <RewardTile
              tooltipKey="paws"
              icon="paw"
              value={lastReward.pawsDelta}
              accent="sky"
              /* Etykieta mówi, ZA CO są tropy — to tu dziecko ma zobaczyć, że
                 punkty należą się jego wiedzy, nie szybkości Timo. */
              label={
                lastReward.askedQuestions > 0
                  ? `Wiesz ${lastReward.knownAnswers}/${lastReward.askedQuestions}`
                  : 'Tropy'
              }
              delay={0}
            />
            <RewardTile
              tooltipKey="xp"
              icon="bolt"
              value={lastReward.xpDelta}
              accent="gold"
              label="XP"
              delay={180}
            />
            {lastReward.isFirstDiscovery ? (
              <RewardTile
                tooltipKey="collection"
                icon="star"
                value={1}
                accent="violet"
                label="Nowe!"
                delay={360}
              />
            ) : null}
          </View>
        ) : null}

        {/* ---------- postęp wyprawy ---------- */}
        {timoGuessed && expedition && expProgress ? (
          <View className="mt-3" style={{ alignSelf: 'stretch' }}>
            <Card
              borderColor={expCompletionJustHappened ? UI.primary : UI.line}
              background={expCompletionJustHappened ? UI.primaryPale : UI.surface}
              padding={14}>
              {expCompletionJustHappened ? (
                <>
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Icon name="award" size={16} color={UI.primaryDeep} strokeWidth={2.6} />
                    <Text
                      style={{
                        color: UI.primaryDeep,
                        fontFamily: 'Gabarito-Bold',
                        fontSize: 11,
                        letterSpacing: 1.2,
                      }}>
                      WYPRAWA ZAKOŃCZONA!
                    </Text>
                  </View>
                  <Text
                    style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>
                    {expedition.hero_emoji}  {expedition.title}
                  </Text>
                  <Text
                    style={{
                      color: UI.primaryDeep,
                      fontFamily: 'Lexend-Bold',
                      fontSize: 12,
                      marginTop: 2,
                    }}>
                    +{lastExpeditionReward.pawsDelta} tropów · +{lastExpeditionReward.xpDelta} XP
                  </Text>
                </>
              ) : (
                <>
                  <View className="flex-row items-center gap-2.5">
                    <Text style={{ fontSize: 22 }}>{expedition.hero_emoji}</Text>
                    <View className="flex-1">
                      <Text
                        style={{
                          color: UI.textFaint,
                          fontFamily: 'Gabarito-Bold',
                          fontSize: 10,
                          letterSpacing: 1.2,
                        }}>
                        WYPRAWA: {expedition.title.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          color: UI.text,
                          fontFamily: 'Gabarito-Bold',
                          fontSize: 14,
                        }}>
                        Odkryte: {expProgress.discovered.length} / {expedition.target_count}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-2">
                    <ProgressBar
                      value={
                        expedition.target_count > 0
                          ? expProgress.discovered.length / expedition.target_count
                          : 0
                      }
                      accent="sky"
                      height={10}
                    />
                  </View>
                </>
              )}
            </Card>
          </View>
        ) : null}

        {/* ---------- nowe odznaki ---------- */}
        {lastReward && lastReward.newBadges.length > 0 ? (
          <View className="mt-3" style={{ alignSelf: 'stretch' }}>
            <Card borderColor={UI.gold} background={UI.goldPale} padding={14}>
              <Text
                style={{
                  color: UI.goldDeep,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 11,
                  letterSpacing: 1.2,
                  marginBottom: 4,
                }}>
                NOWA ODZNAKA!
              </Text>
              {lastReward.newBadges.map((b) => (
                <View key={b.id} className="flex-row items-center gap-2.5 mt-1">
                  <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
                  <View className="flex-1">
                    <Text
                      style={{
                        color: UI.text,
                        fontFamily: 'Gabarito-Bold',
                        fontSize: 16,
                      }}>
                      {b.label_pl}
                    </Text>
                    <Text
                      style={{
                        color: UI.textSoft,
                        fontFamily: 'Lexend',
                        fontSize: 12,
                        lineHeight: 16,
                      }}>
                      {b.description_pl}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        ) : null}

        <View className="flex-1" />
      </ScrollView>

      {/* ---------- CTA ---------- */}
      <View
        className="px-5 gap-2.5 bg-canvas"
        style={{ paddingTop: 10, paddingBottom: insets.bottom + 12 }}>
        <Button label="ZAGRAJ JESZCZE RAZ" onPress={playAgain} />
        <Button label="Wróć na Polanę" variant="ghost" size="md" onPress={home} />
      </View>

      <LevelUpCelebration
        visible={showLevelUp}
        level={level}
        previousLevel={previousLevel}
        onClose={() => setShowLevelUp(false)}
      />
    </View>
  );
}
