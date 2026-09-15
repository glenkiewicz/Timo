import { scoredEligible } from '@/features/game/guessing-engine';
import { TIMO_VOICE_DEBUG_PARAMS, useIsTimoSpeaking } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { Text, View } from '@/tw';

/**
 * Dev-only overlay — shows the engine's top candidates so you can watch the
 * decision tree narrow down (or fail to). Hidden in production builds.
 */
export function DebugOverlay() {
  if (!__DEV__) return null;

  const candidates = useGameStore((s) => s.candidates);
  const usedAttributes = useGameStore((s) => s.usedAttributes);
  const excludedAnimals = useGameStore((s) => s.excludedAnimals);
  const answers = useGameStore((s) => s.answers);
  const questionsAsked = useGameStore((s) => s.questionsAsked);
  const guessAttempts = useGameStore((s) => s.guessAttempts);
  const isSpeaking = useIsTimoSpeaking();
  const audioMuted = useProfileStore((s) => s.audioMuted);

  const scored = scoredEligible(
    { candidates, usedAttributes, excludedAnimals, questionsAsked },
    answers
  );

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 110,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.78)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        maxWidth: 280,
      }}>
      <Text
        style={{
          color: '#f2b524',
          fontFamily: 'Gabarito-Bold',
          fontSize: 10,
          letterSpacing: 1,
        }}>
        DEBUG
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 11 }}>
        Kandydaci: {scored.length}
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 11 }}>
        Pytanie #{questionsAsked} · strzał #{guessAttempts}
      </Text>
      <Text
        style={{
          color: '#5bb04c',
          fontFamily: 'Gabarito-Bold',
          fontSize: 10,
          marginTop: 4,
        }}>
        TOP 5
      </Text>
      {scored.slice(0, 5).map((s, i) => (
        <Text
          key={s.animal.id}
          style={{
            color: '#fff',
            fontFamily: 'Lexend-Bold',
            fontSize: 10,
            lineHeight: 13,
          }}>
          {i + 1}. {s.animal.name_pl} ({s.score.toFixed(1)})
        </Text>
      ))}

      <Text
        style={{
          color: '#7fc9ff',
          fontFamily: 'Gabarito-Bold',
          fontSize: 10,
          marginTop: 6,
          letterSpacing: 1,
        }}>
        AUDIO
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 10, lineHeight: 13 }}>
        playbackRate: {TIMO_VOICE_DEBUG_PARAMS.playbackRate}x
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 10, lineHeight: 13 }}>
        clip gap: {TIMO_VOICE_DEBUG_PARAMS.interClipGapMs}ms
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 10, lineHeight: 13 }}>
        retry after: {TIMO_VOICE_DEBUG_PARAMS.retryPlayAfterMs}ms
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 10, lineHeight: 13 }}>
        timeout cap: {TIMO_VOICE_DEBUG_PARAMS.clipTimeoutDefaultMs / 1000}s
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Lexend-Bold', fontSize: 10, lineHeight: 13 }}>
        speaking: {isSpeaking ? 'yes' : 'no'}  ·  muted: {audioMuted ? 'yes' : 'no'}
      </Text>
    </View>
  );
}
