import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerCard, type AnswerType } from '@/components/buttons/AnswerCard';
import { AnimalImage } from '@/components/collection/AnimalImage';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Bubble } from '@/components/ui/Bubble';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { StatBadge } from '@/components/ui/StatBadge';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickGuessIntro, pickMissLine, type Pick } from '@/data/timo-lines';
import { SHOW_GAME_DEBUG } from '@/config/features';
import { DebugOverlay } from '@/features/game/DebugOverlay';
import { pickAnswerReaction } from '@/features/game/timo-personality';
import { timoVoice, useIsTimoSpeaking } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

/**
 * Minimalny czas, przez jaki reakcja Timo wisi w dymku — także bez dźwięku,
 * żeby dziecko zdążyło ją zobaczyć.
 */
const REACTION_MIN_MS = 1100;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Powiedz kwestię i trzymaj ją na ekranie co najmniej `REACTION_MIN_MS`. */
async function speakReaction(line: Pick): Promise<void> {
  await Promise.all([timoVoice.playLine(line.voiceKey), wait(REACTION_MIN_MS)]);
}

/**
 * Nazwa zwierzęcia w środku zdania: „…że to… krowa?”. Małą literą, chyba że
 * nazwa ma w sobie wielką literę dalej (np. „Kot Pallasa”) — wtedy bez zmian.
 */
function nameInSentence(name: string): string {
  if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(name.slice(1))) return name;
  return name.charAt(0).toLowerCase() + name.slice(1);
}

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const prompt = useGameStore((s) => s.prompt);
  const guess = useGameStore((s) => s.guess);
  const phase = useGameStore((s) => s.phase);
  const questionsAsked = useGameStore((s) => s.questionsAsked);
  const guessAttempts = useGameStore((s) => s.guessAttempts);
  const mode = useGameStore((s) => s.mode);
  const expeditionId = useGameStore((s) => s.expeditionId);
  const answer = useGameStore((s) => s.answer);
  const acceptGuess = useGameStore((s) => s.acceptGuess);
  const rejectGuess = useGameStore((s) => s.rejectGuess);

  /**
   * Reakcja Timo na odpowiedź albo na pudło — wisi w dymku zamiast pytania,
   * dopóki Timo jej nie powie. Przyciski są wtedy zablokowane.
   */
  const [reaction, setReaction] = useState<Pick | null>(null);

  const isSpeaking = useIsTimoSpeaking();

  const expedition =
    mode === 'expedition' && expeditionId ? EXPEDITIONS_BY_ID[expeditionId] : null;

  const paws = useProfileStore((s) => s.paws);
  const lastReward = useProfileStore((s) => s.lastReward);
  const previousPaws = lastReward?.previousPaws ?? paws;

  useEffect(() => {
    if (phase === 'timo_guessed' || phase === 'child_stumped') {
      router.replace('/result');
    }
  }, [phase, router]);

  const handleAnswer = async (a: AnswerType) => {
    if (!currentQuestion || reaction) return;
    // Reakcja związana z pytaniem („Plusk! Zakładam płetwy.”) — w dymku i głosem,
    // dopiero potem następne pytanie.
    const line = pickAnswerReaction(currentQuestion, a);
    setReaction(line);
    await speakReaction(line);
    setReaction(null);
    answer(a);
  };

  const handleReject = async () => {
    if (reaction) return;
    const line = pickMissLine();
    setReaction(line);
    await speakReaction(line);
    setReaction(null);
    rejectGuess();
  };

  // guessIntro — re-roll przy każdym nowym strzale (Pick = { text, voiceKey }).
  const guessIntro = useMemo<Pick>(
    () => pickGuessIntro(),
    [guess?.id, guessAttempts],
  );

  // Odtwórz pytanie głosem — sequence: [wstęp?, pytanie]. Wypowiedź składa
  // store (`prompt`), więc nowy obiekt = nowe pytanie. Krótki oddech po reakcji.
  useEffect(() => {
    if (!prompt) return;
    timoVoice.playSequence(prompt.sequence, { initialDelayMs: 300 });
  }, [prompt]);

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

  // Log wypowiedzi Timo (DEV only) — żeby widzieć, co mówi w UI.
  useEffect(() => {
    if (!__DEV__) return;
    if (!prompt) return;
    console.log(`💬 Q${questionsAsked + 1}  „${prompt.text}"`);
  }, [prompt, questionsAsked]);

  const isAsking = phase === 'asking';
  const isGuessing = phase === 'guess_attempt';
  const answersDisabled = !currentQuestion || isSpeaking || reaction !== null;

  // Linia gruntu sceny — mierzona z pozycji Timo, tak jak na Home.
  const [groundY, setGroundY] = useState<number | null>(null);

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: sceneBaseColor('game', expedition?.id) }}>
      <SceneBackdrop groundY={groundY} scene="game" expeditionId={expedition?.id} />
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
            style={{ backgroundColor: UI.surface, boxShadow: SHADOW.e0 }}>
            <Icon name="close" size={20} color={UI.textSoft} strokeWidth={2.6} />
          </Pressable>

          {expedition ? (
            <View
              className="rounded-pill px-3 py-1.5 flex-row items-center gap-1.5 flex-1"
              style={{ backgroundColor: UI.surface, boxShadow: SHADOW.e0 }}>
              <Text style={{ fontSize: 13 }}>{expedition.hero_emoji}</Text>
              <Text
                numberOfLines={1}
                style={{
                  color: UI.skyDeep,
                  fontFamily: 'Gabarito-Bold',
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
            style={{ backgroundColor: UI.surface, boxShadow: SHADOW.e0 }}>
            <Text
              style={{
                color: UI.textSoft,
                fontFamily: 'Gabarito-Bold',
                fontSize: 11,
              }}>
              Pytanie {questionsAsked + 1}
            </Text>
          </View>

          <StatBadge
            tooltipKey="paws"
            from={previousPaws}
            to={paws}
            accent="sky"
          />
        </View>

        {/* ---------- scena ----------
            Timo ma STAŁĄ pozycję u góry sceny. Gdyby jeździł w pionie razem
            z wysokością dymka, linia gruntu zmieniałaby się przy każdym pytaniu
            i tło przeskalowywałoby się w kółko. Luz pionowy zbiera więc blok
            pod nim — to dymek pływa w wolnej przestrzeni, nie lisek. */}
        <View className="flex-1 items-center px-6" style={{ paddingTop: 12 }}>
          <TimoStage onGroundY={setGroundY} />

          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}>
          {reaction ? (
            <Bubble eyebrow="TIMO" tail="top-center" size="lg">
              {reaction.text}
            </Bubble>
          ) : null}

          {!reaction && isAsking && currentQuestion && prompt ? (
            <Bubble eyebrow="TIMO PYTA" tail="top-center" size="lg">
              {prompt.text}
            </Bubble>
          ) : null}

          {!reaction && isGuessing && guess ? (
            <>
              <Bubble eyebrow="TIMO ZGADUJE — POTWIERDŹ ALBO POPRAW" tail="top-center" size="lg">
                {`${guessIntro.text} ${nameInSentence(guess.name_pl)}?`}
              </Bubble>
              <Card padding={14}>
                <View className="flex-row items-center gap-3">
                  <AnimalImage animalId={guess.id} size={56} />
                  <Text
                    style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
                    {guess.name_pl}
                  </Text>
                </View>
              </Card>
            </>
          ) : null}
          </View>
        </View>

        {/* ---------- odpowiedzi — wait mode: disabled gdy Timo mówi ---------- */}
        {isAsking ? (
          <View className="px-5 gap-3">
            <View className="flex-row gap-3">
              <AnswerCard answer="yes" onPress={handleAnswer} disabled={answersDisabled} />
              <AnswerCard answer="no" onPress={handleAnswer} disabled={answersDisabled} />
            </View>
            <View className="flex-row gap-3">
              <AnswerCard answer="idk" onPress={handleAnswer} disabled={answersDisabled} />
              <AnswerCard answer="hard" onPress={handleAnswer} disabled={answersDisabled} />
            </View>
          </View>
        ) : null}

        {isGuessing ? (
          <View className="px-5 gap-2.5">
            <Button
              label={guess ? `TAK, TO ${guess.name_pl.toUpperCase()}!` : 'TAK!'}
              variant="primary"
              onPress={acceptGuess}
              disabled={isSpeaking || reaction !== null}
            />
            <Button
              label="Nie, pudło"
              variant="ghost"
              size="md"
              onPress={handleReject}
              disabled={isSpeaking || reaction !== null}
            />
          </View>
        ) : null}
      </View>

      {SHOW_GAME_DEBUG ? <DebugOverlay /> : null}
    </View>
  );
}
