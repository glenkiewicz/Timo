import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerCard, type AnswerType } from '@/components/buttons/AnswerCard';
import { AnimalImage } from '@/components/collection/AnimalImage';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Bubble } from '@/components/ui/Bubble';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatBadge } from '@/components/ui/StatBadge';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickQuestionVariant } from '@/data/questions';
import {
  pickDontKnowResponse,
  pickGuessIntro,
  pickOutsideCategoryLine,
  pickReaction,
  type Pick,
} from '@/data/timo-lines';
import { DebugOverlay } from '@/features/game/DebugOverlay';
import { decorateQuestion } from '@/features/game/timo-personality';
import { timoVoice, useIsTimoSpeaking } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

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
  const expeditionMode = useGameStore((s) => s.expeditionMode);
  const didEscapeCategory = useGameStore((s) => s.didEscapeCategory);
  const answer = useGameStore((s) => s.answer);
  const acceptGuess = useGameStore((s) => s.acceptGuess);
  const rejectGuess = useGameStore((s) => s.rejectGuess);
  const acknowledgeEscape = useGameStore((s) => s.acknowledgeEscape);

  /**
   * Flash bubble — krótki komunikat pod pytaniem, gdy guided gracz powie
   * "nie wiem" lub gdy silnik wpadnie w fallback (zwierzę spoza puli).
   * Auto-znika po 2.5s.
   */
  const [flashLine, setFlashLine] = useState<Pick | null>(null);

  const isSpeaking = useIsTimoSpeaking();

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

  // Outside-category flash (guided): pula wyczerpana, silnik rozszerzył do
  // ANIMALS. Pokaż raz, potem kasuj flagę w store.
  useEffect(() => {
    if (didEscapeCategory && expeditionMode === 'guided') {
      setFlashLine(pickOutsideCategoryLine());
      acknowledgeEscape();
    }
  }, [didEscapeCategory, expeditionMode, acknowledgeEscape]);

  // Auto-hide flash bubble + odtwórz głosem.
  useEffect(() => {
    if (!flashLine) return;
    timoVoice.playLine(flashLine.voiceKey);
    const t = setTimeout(() => setFlashLine(null), 2500);
    return () => clearTimeout(t);
  }, [flashLine]);

  const handleAnswer = async (a: AnswerType) => {
    // Guided "nie wiem" → ciepły komunikat, bez kary.
    if (a === 'idk' && expeditionMode === 'guided') {
      setFlashLine(pickDontKnowResponse());
      answer(a);
      return;
    }
    // Reakcja Timo gra przed przejściem do następnego pytania — wait mode
    // (disabled buttons) trzyma UI w spokoju.
    const reaction = pickReaction(a);
    await timoVoice.playLine(reaction.voiceKey);
    answer(a);
  };

  // guessIntro — re-roll przy każdym nowym strzale (Pick = { text, voiceKey }).
  const guessIntro = useMemo<Pick>(
    () => pickGuessIntro(),
    [guess?.id, guessAttempts],
  );

  // dekoracja pytania — wybór wariantu + mood + interlude, re-roll per question
  const decoratedQuestion = useMemo(() => {
    if (!currentQuestion) return null;
    const variant = pickQuestionVariant(currentQuestion);
    return decorateQuestion(variant, questionsAsked);
  }, [currentQuestion?.id, questionsAsked]);

  // Odtwórz pytanie głosem — sequence: [interlude?, prefix?, question].
  // 600ms initial delay daje naturalny oddech po reakcji ("Tak!") z poprzedniego ruchu.
  useEffect(() => {
    if (!decoratedQuestion) return;
    timoVoice.playSequence(decoratedQuestion.sequence, { initialDelayMs: 600 });
  }, [decoratedQuestion]);

  // Odtwórz guess głosem — sequence: [guessIntro, animal.{id}].
  useEffect(() => {
    if (!guess) return;
    timoVoice.playSequence([guessIntro.voiceKey, `animal.${guess.id}`], {
      initialDelayMs: 400,
    });
  }, [guess?.id, guessIntro]);

  // Stop audio gdy opuszczamy ekran gry.
  useEffect(() => {
    return () => {
      timoVoice.stop();
    };
  }, []);

  // Log dekorowanego tekstu pytania (DEV only) — żeby widzieć co Timo mówi w UI
  useEffect(() => {
    if (!__DEV__) return;
    if (!decoratedQuestion) return;
    const phaseLabel =
      questionsAsked === 0
        ? 'START'
        : questionsAsked < 3
          ? 'EARLY'
          : questionsAsked < 8
            ? 'MID'
            : 'LATE';
    console.log(`💬 Q${questionsAsked + 1} [${phaseLabel}]  „${decoratedQuestion.text}"`);
  }, [decoratedQuestion, questionsAsked]);

  const isAsking = phase === 'asking';
  const isGuessing = phase === 'guess_attempt';

  return (
    <View className="flex-1 bg-canvas">
      <View
        className="flex-1"
        style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 14 }}>
        {/* ---------- pasek gry ---------- */}
        <View className="flex-row items-center gap-2 px-4">
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Zakończ grę"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: UI.sunken }}>
            <Icon name="close" size={20} color={UI.textSoft} strokeWidth={2.6} />
          </Pressable>

          {expedition ? (
            <View
              className="rounded-pill px-3 py-1.5 flex-row items-center gap-1.5 flex-1"
              style={{ backgroundColor: UI.skyPale }}>
              <Text style={{ fontSize: 13 }}>{expedition.hero_emoji}</Text>
              <Text
                numberOfLines={1}
                style={{
                  color: UI.skyDeep,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 11,
                  flex: 1,
                }}>
                {expedition.title}
              </Text>
            </View>
          ) : (
            <View className="flex-1" />
          )}

          <View
            className="rounded-pill px-3 py-1.5"
            style={{ backgroundColor: UI.sunken }}>
            <Text
              style={{
                color: UI.textSoft,
                fontFamily: 'Fredoka-Bold',
                fontSize: 11,
              }}>
              Pytanie {questionsAsked + 1}
            </Text>
          </View>

          <StatBadge
            tooltipKey="paws"
            icon="paw"
            from={previousPaws}
            to={paws}
            accent="sky"
          />
        </View>

        {/* ---------- scena ---------- */}
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <TimoCharacter state={isGuessing ? 'pointing' : 'thinking'} size={190} />

          {isAsking && currentQuestion && decoratedQuestion ? (
            <Bubble eyebrow="TIMO PYTA" tail="top-center" size="lg">
              {decoratedQuestion.text}
            </Bubble>
          ) : null}

          {flashLine ? (
            <View
              className="rounded-pill px-4 py-2"
              style={{ backgroundColor: UI.primaryPale }}>
              <Text
                className="text-center"
                style={{
                  color: UI.primaryDeep,
                  fontFamily: 'Fredoka-Bold',
                  fontSize: 13,
                }}>
                {flashLine.text}
              </Text>
            </View>
          ) : null}

          {isGuessing && guess ? (
            <>
              <Bubble eyebrow="TIMO ZGADUJE" tail="top-center" size="lg">
                {`${guessIntro.text} ${guess.name_pl}?`}
              </Bubble>
              <View
                className="flex-row items-center gap-3 px-5 py-3"
                style={{
                  backgroundColor: UI.canvas,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderBottomWidth: 4,
                  borderColor: UI.line,
                }}>
                <AnimalImage animalId={guess.id} fallbackEmoji={guess.emoji} size={56} />
                <Text
                  style={{ color: UI.text, fontFamily: 'Fredoka-Bold', fontSize: 22 }}>
                  {guess.name_pl}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* ---------- odpowiedzi — wait mode: disabled gdy Timo mówi ---------- */}
        {isAsking ? (
          <View className="px-5 gap-3">
            <View className="flex-row gap-3">
              <AnswerCard answer="yes" onPress={handleAnswer} disabled={!currentQuestion || isSpeaking} />
              <AnswerCard answer="no" onPress={handleAnswer} disabled={!currentQuestion || isSpeaking} />
            </View>
            <View className="flex-row gap-3">
              <AnswerCard answer="idk" onPress={handleAnswer} disabled={!currentQuestion || isSpeaking} />
              <AnswerCard answer="hard" onPress={handleAnswer} disabled={!currentQuestion || isSpeaking} />
            </View>
          </View>
        ) : null}

        {isGuessing ? (
          <View className="px-5 gap-2.5">
            <Button
              label={guess ? `TAK, TO ${guess.name_pl.toUpperCase()}!` : 'TAK!'}
              variant="primary"
              onPress={acceptGuess}
              disabled={isSpeaking}
            />
            <Button
              label="Nie, pudło"
              variant="ghost"
              size="md"
              onPress={rejectGuess}
              disabled={isSpeaking}
            />
          </View>
        ) : null}
      </View>

      <DebugOverlay />
    </View>
  );
}
