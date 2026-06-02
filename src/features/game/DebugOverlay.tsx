import { scoredEligible } from '@/features/game/guessing-engine';
import { useGameStore } from '@/lib/stores/game-store';
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
          fontFamily: 'Fredoka-Bold',
          fontSize: 10,
          letterSpacing: 1,
        }}>
        DEBUG
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Nunito-Bold', fontSize: 11 }}>
        Kandydaci: {scored.length}
      </Text>
      <Text style={{ color: '#fff', fontFamily: 'Nunito-Bold', fontSize: 11 }}>
        Pytanie #{questionsAsked} · strzał #{guessAttempts}
      </Text>
      <Text
        style={{
          color: '#5bb04c',
          fontFamily: 'Fredoka-Bold',
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
            fontFamily: 'Nunito-Bold',
            fontSize: 10,
            lineHeight: 13,
          }}>
          {i + 1}. {s.animal.name_pl} ({s.score.toFixed(1)})
        </Text>
      ))}
    </View>
  );
}
