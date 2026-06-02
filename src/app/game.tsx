import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerCard, type AnswerType } from '@/components/buttons/AnswerCard';
import { PuffyButton } from '@/components/buttons/PuffyButton';
import { LiveInfoChip } from '@/components/gamification/LiveInfoChip';
import { SpeechBubble } from '@/components/timo/SpeechBubble';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickQuestionVariant } from '@/data/questions';
import { GUESS_INTROS } from '@/data/timo-lines';
import { DebugOverlay } from '@/features/game/DebugOverlay';
import { decorateQuestion } from '@/features/game/timo-personality';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const guess = useGameStore((s) => s.guess);
  const phase = useGameStore((s) => s.phase);
  const questionsAsked = useGameStore((s) => s.questionsAsked);
  const guessAttempts = useGameStore((s) => s.guessAttempts);
  const mode = useGameStore((s) => s.mode);
  const expeditionId = useGameStore((s) => s.expeditionId);
  const answer = useGameStore((s) => s.answer);
  const acceptGuess = useGameStore((s) => s.acceptGuess);
  const rejectGuess = useGameStore((s) => s.rejectGuess);

  const expedition =
    mode === 'expedition' && expeditionId ? EXPEDITIONS_BY_ID[expeditionId] : null;

  const paws = useProfileStore((s) => s.paws);
  const lastReward = useProfileStore((s) => s.lastReward);
  const previousPaws = lastReward?.previousPaws ?? paws;

  useEffect(() => {
    if (phase === 'won' || phase === 'lost') {
      router.replace('/result');
    }
  }, [phase, router]);

  const handleAnswer = (a: AnswerType) => answer(a);

  const guessIntro = useMemo(
    () => GUESS_INTROS[Math.floor(Math.random() * GUESS_INTROS.length)],
    // re-roll each time a new guess pops up
    [guess?.id, guessAttempts]
  );

  // dekoracja pytania — wybór wariantu + mood + interlude, re-roll per question
  const decoratedQuestionText = useMemo(() => {
    if (!currentQuestion) return null;
    const variant = pickQuestionVariant(currentQuestion);
    return decorateQuestion(variant, questionsAsked);
  }, [currentQuestion?.id, questionsAsked]);

  // Log dekorowanego tekstu pytania (DEV only) — żeby widzieć co Timo mówi w UI
  useEffect(() => {
    if (!__DEV__) return;
    if (!decoratedQuestionText) return;
    const phase =
      questionsAsked === 0
        ? 'START'
        : questionsAsked < 3
          ? 'EARLY'
          : questionsAsked < 8
            ? 'MID'
            : 'LATE';
    console.log(`💬 Q${questionsAsked + 1} [${phase}]  „${decoratedQuestionText}"`);
  }, [decoratedQuestionText, questionsAsked]);

  const isAsking = phase === 'asking';
  const isGuessing = phase === 'guess_attempt';

  return (
    <View className="flex-1 bg-bg">
      <Image
        source={require('../../assets/backgrounds/game-bg.png')}
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
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}>
        {/* top bar */}
        <View className="flex-row items-center justify-between px-5">
          <Pressable
            onPress={() => router.replace('/')}
            className="w-10 h-10 rounded-full bg-paper items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
              ✕
            </Text>
          </Pressable>

          <View className="flex-row items-center gap-2 flex-1 justify-end">
            {expedition ? (
              <View
                className="bg-brand rounded-chip px-2.5 py-1.5 flex-row items-center gap-1"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                <Text style={{ fontSize: 13 }}>{expedition.hero_emoji}</Text>
                <Text
                  className="text-paper"
                  style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}
                  numberOfLines={1}>
                  {expedition.title}
                </Text>
              </View>
            ) : null}

            <LiveInfoChip
              tooltipKey="paws"
              icon="paw"
              from={previousPaws}
              to={paws}
              variant="paper"
            />

            <View
              className="bg-paper rounded-chip px-2.5 py-1.5 flex-row items-center gap-1"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <Text style={{ fontSize: 12 }}>🐾</Text>
              <Text
                className="text-ink"
                style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
                {questionsAsked + 1}
              </Text>
            </View>
          </View>
        </View>

        {/* center stage */}
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <TimoCharacter state={isGuessing ? 'pointing' : 'thinking'} size={210} />

          {isAsking && currentQuestion && decoratedQuestionText ? (
            <SpeechBubble eyebrow="TIMO PYTA">
              {decoratedQuestionText}
            </SpeechBubble>
          ) : null}

          {isGuessing && guess ? (
            <>
              <SpeechBubble eyebrow="TIMO ZGADUJE">
                {`${guessIntro} ${guess.name_pl}?`}
              </SpeechBubble>
              <View
                className="bg-paper rounded-card px-5 py-3 flex-row items-center gap-3 mt-1"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 2,
                  borderColor: '#fff6cc',
                }}>
                <Text style={{ fontSize: 40 }}>{guess.emoji}</Text>
                <Text
                  className="text-ink"
                  style={{ fontFamily: 'Fredoka-Bold', fontSize: 22 }}>
                  {guess.name_pl}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* answers */}
        {isAsking ? (
          <View className="px-6 gap-3">
            <View className="flex-row gap-3">
              <AnswerCard answer="yes" onPress={handleAnswer} disabled={!currentQuestion} />
              <AnswerCard answer="no" onPress={handleAnswer} disabled={!currentQuestion} />
            </View>
            <View className="flex-row gap-3">
              <AnswerCard answer="idk" onPress={handleAnswer} disabled={!currentQuestion} />
              <AnswerCard answer="hard" onPress={handleAnswer} disabled={!currentQuestion} />
            </View>
          </View>
        ) : null}

        {isGuessing ? (
          <View className="px-6 gap-2.5">
            <PuffyButton
              label={guess ? `Tak, to ${guess.name_pl}!` : 'Tak!'}
              variant="success"
              onPress={acceptGuess}
            />
            <PuffyButton label="Nie, pudło" variant="rose" size="md" onPress={rejectGuess} />
          </View>
        ) : null}
      </View>

      <DebugOverlay />
    </View>
  );
}
