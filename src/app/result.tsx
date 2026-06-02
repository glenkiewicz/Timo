import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PuffyButton } from '@/components/buttons/PuffyButton';
import { AnimalCardModal } from '@/components/collection/AnimalCardModal';
import { AnimatedCounter } from '@/components/gamification/AnimatedCounter';
import { AnimatedRewardChip } from '@/components/gamification/AnimatedRewardChip';
import { LiveInfoChip } from '@/components/gamification/LiveInfoChip';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { levelFromXp } from '@/features/gamification/award';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

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

  const level = levelFromXp(xp);
  const previousPaws = lastReward?.previousPaws ?? paws;
  const previousStreak = lastReward?.previousStreak ?? streak;
  const previousLevel = lastReward ? levelFromXp(lastReward.previousXp) : level;

  const won = phase === 'won';
  const awarded = useRef(false);
  const [cardOpen, setCardOpen] = useState(false);
  const autoOpened = useRef(false);

  // Auto-open animal card 600ms po wejściu na ekran, jeśli to pierwsze odkrycie
  useEffect(() => {
    if (autoOpened.current) return;
    if (won && guess && lastReward?.isFirstDiscovery) {
      const t = setTimeout(() => {
        setCardOpen(true);
        autoOpened.current = true;
      }, 600);
      return () => clearTimeout(t);
    }
  }, [won, guess, lastReward?.isFirstDiscovery]);

  const expedition = expeditionId ? EXPEDITIONS_BY_ID[expeditionId] : null;
  const expProgress = expeditionId ? expeditionProgress[expeditionId] : undefined;
  const expCompletionJustHappened =
    lastExpeditionReward !== null && lastExpeditionReward.expedition_id === expeditionId;

  // Award once on mount based on phase
  useEffect(() => {
    if (awarded.current) return;
    if (phase === 'won' || phase === 'lost') {
      award({
        won: phase === 'won',
        questionsAsked,
        animalId: guess?.id ?? null,
      });
      // expedition discovery only on win
      if (phase === 'won' && mode === 'expedition' && expeditionId && guess) {
        recordExpeditionDiscovery(expeditionId, guess.id);
      }
      awarded.current = true;
    }
  }, [phase, award, questionsAsked, guess, mode, expeditionId, recordExpeditionDiscovery]);

  const playAgain = useCallback(() => {
    clearLastReward();
    clearLastExpeditionReward();
    if (mode === 'expedition' && expeditionId && expedition) {
      // continue same expedition with updated discovered list
      const prog = expeditionProgress[expeditionId];
      const expDone = prog?.completed_at != null;
      if (!expDone) {
        startGame({
          expeditionId,
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
    router.replace('/');
  }, [startGame, router]);

  return (
    <View className="flex-1 bg-bg">
      <Image
        source={require('../../assets/backgrounds/result-bg.png')}
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
        className="flex-1 items-center"
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}>
        {/* top bar — level + streak + paws (animate after award) */}
        <View
          className="flex-row items-center justify-between mb-3"
          style={{ alignSelf: 'stretch' }}>
          <View
            className="w-11 h-11 rounded-full bg-brand items-center justify-center"
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
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}
            />
          </View>
          <View className="flex-row gap-2">
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

        {/* ribbon */}
        <View
          className={`${won ? 'bg-success' : 'bg-rose'} rounded-card px-6 py-2.5`}
          style={{
            transform: [{ rotate: '-3deg' }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Text
            className="text-paper"
            style={{
              fontFamily: 'Fredoka-Bold',
              fontSize: 14,
              letterSpacing: 1.5,
            }}>
            {won ? 'ZGADŁEM!' : 'PODDAJĘ SIĘ!'}
          </Text>
        </View>

        <View className="mt-2">
          <TimoCharacter state={won ? 'happy' : 'oops'} size={210} />
        </View>

        {/* reveal card / lost card */}
        <View
          className="bg-paper rounded-card items-center px-6 py-4 mt-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.14,
            shadowRadius: 18,
            elevation: 8,
            borderWidth: 2,
            borderColor: '#fff6cc',
            alignSelf: 'stretch',
          }}>
          <Text
            className="text-brand-deep"
            style={{
              fontFamily: 'Fredoka-Bold',
              fontSize: 11,
              letterSpacing: 1.2,
              marginBottom: 4,
            }}>
            {won ? 'ODKRYTE ZWIERZĘ' : 'TYM RAZEM TAJEMNICA'}
          </Text>
          {won && guess ? (
            <>
              <Text
                className="text-ink"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 24, marginBottom: 4 }}>
                {guess.emoji}  {guess.name_pl}
              </Text>
              <Text
                className="text-ink-soft text-center"
                style={{ fontFamily: 'Nunito', fontSize: 13, lineHeight: 19 }}>
                {guess.fun_fact_pl}
              </Text>
              <Pressable
                onPress={() => setCardOpen(true)}
                className="bg-brand-pale rounded-chip mt-3"
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderWidth: 1.5,
                  borderColor: '#f28238',
                }}>
                <Text
                  className="text-brand-deep"
                  style={{ fontFamily: 'Fredoka-Bold', fontSize: 13 }}>
                  📖  Zobacz kartę zwierzęcia
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                className="text-ink"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 20, marginBottom: 4 }}>
                Nie udało mi się!
              </Text>
              <Text
                className="text-ink-soft text-center"
                style={{ fontFamily: 'Nunito', fontSize: 13, lineHeight: 19 }}>
                Powiedz mi, jakie to było zwierzę — następnym razem na pewno zgadnę!
              </Text>
            </>
          )}
        </View>

        {/* rewards */}
        {lastReward ? (
          <View className="flex-row gap-3 mt-3" style={{ alignSelf: 'stretch' }}>
            <AnimatedRewardChip
              tooltipKey="paws"
              icon="paw"
              value={lastReward.pawsDelta}
              variant="brand"
              label="Tropy"
              delay={0}
            />
            <AnimatedRewardChip
              tooltipKey="xp"
              icon="sparkle"
              value={lastReward.xpDelta}
              variant="success"
              label="XP"
              delay={180}
            />
            {lastReward.isFirstDiscovery ? (
              <AnimatedRewardChip
                tooltipKey="collection"
                icon="sparkle"
                value={1}
                variant="reward"
                label="Nowe!"
                prefix="🆕 "
                delay={360}
              />
            ) : null}
          </View>
        ) : null}

        {/* expedition progress / completion banner */}
        {won && expedition && expProgress ? (
          <View
            className={`${expCompletionJustHappened ? 'bg-success' : 'bg-paper'} rounded-card px-4 py-3 mt-3`}
            style={{
              alignSelf: 'stretch',
              borderWidth: 2,
              borderColor: expCompletionJustHappened ? '#357a2a' : '#fff6cc',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.14,
              shadowRadius: 8,
              elevation: 5,
            }}>
            {expCompletionJustHappened ? (
              <>
                <Text
                  className="text-paper mb-1"
                  style={{
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 11,
                    letterSpacing: 1.2,
                  }}>
                  🏆  WYPRAWA ZAKOŃCZONA!
                </Text>
                <Text
                  className="text-paper"
                  style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
                  {expedition.hero_emoji}  {expedition.title}
                </Text>
                <Text
                  className="text-paper mt-0.5"
                  style={{ fontFamily: 'Nunito-Bold', fontSize: 12 }}>
                  +{lastExpeditionReward.pawsDelta} tropów ·  +{lastExpeditionReward.xpDelta} XP
                </Text>
              </>
            ) : (
              <View className="flex-row items-center gap-2.5">
                <Text style={{ fontSize: 22 }}>{expedition.hero_emoji}</Text>
                <View className="flex-1">
                  <Text
                    className="text-brand-deep"
                    style={{
                      fontFamily: 'Fredoka-Bold',
                      fontSize: 10,
                      letterSpacing: 1.2,
                    }}>
                    WYPRAWA: {expedition.title.toUpperCase()}
                  </Text>
                  <Text
                    className="text-ink"
                    style={{ fontFamily: 'Fredoka-Bold', fontSize: 14 }}>
                    Odkryte: {expProgress.discovered.length} / {expedition.target_count}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {/* new badges */}
        {lastReward && lastReward.newBadges.length > 0 ? (
          <View
            className="bg-reward rounded-card px-4 py-3 mt-3"
            style={{
              alignSelf: 'stretch',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.14,
              shadowRadius: 8,
              elevation: 5,
            }}>
            <Text
              className="text-brand-deep mb-1"
              style={{
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
                letterSpacing: 1.2,
              }}>
              NOWA ODZNAKA!
            </Text>
            {lastReward.newBadges.map((b) => (
              <View key={b.id} className="flex-row items-center gap-2.5 mt-1">
                <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
                <View className="flex-1">
                  <Text
                    className="text-brand-deep"
                    style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
                    {b.label_pl}
                  </Text>
                  <Text
                    className="text-ink-soft"
                    style={{ fontFamily: 'Nunito', fontSize: 12, lineHeight: 16 }}>
                    {b.description_pl}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View className="flex-1" />

        <View className="gap-2.5" style={{ alignSelf: 'stretch' }}>
          <PuffyButton label="Zagraj jeszcze raz" onPress={playAgain} />
          <PuffyButton label="Wróć na Polanę" variant="secondary" size="md" onPress={home} />
        </View>
      </View>

      <AnimalCardModal
        visible={cardOpen}
        animal={won ? guess : null}
        isNewDiscovery={lastReward?.isFirstDiscovery}
        onClose={() => setCardOpen(false)}
      />
    </View>
  );
}
