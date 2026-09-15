import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { BoardRow } from '@/components/leaderboard/BoardRow';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { timeLeftLabel } from '@/features/leaderboard/week';
import { useLeaderboardStore } from '@/lib/stores/leaderboard-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

/**
 * Sekcja rankingu na ekranie głównym — czołówka trójki i wiersz gracza.
 * Pełna tabela żyje pod `/leaderboard`.
 */
export function LeaderboardCard() {
  const router = useRouter();

  const entries = useLeaderboardStore((s) => s.entries);
  const player = useLeaderboardStore((s) => s.player);
  const status = useLeaderboardStore((s) => s.status);
  const lastSyncAt = useLeaderboardStore((s) => s.lastSyncAt);
  const flushPending = useLeaderboardStore((s) => s.flushPending);

  const weeklyXp = useProfileStore((s) => s.weeklyXp);
  const submitScore = useLeaderboardStore((s) => s.submitScore);

  // Wejście na Home = moment synchronizacji: wysyłamy wynik tygodnia, jeśli
  // urósł, a poza tym po prostu odświeżamy tabelę (i domykamy zaległą wysyłkę).
  useEffect(() => {
    if (weeklyXp > 0 && weeklyXp !== player?.score) {
      void submitScore(weeklyXp);
    } else {
      void flushPending();
    }
    // Celowo raz na wejście — nie chcemy pingować API przy każdym renderze.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top = entries.slice(0, 3);
  const playerOutsideTop = player && player.rank > 3;
  const neverSynced = lastSyncAt === null;

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text
          style={{
            color: UI.textFaint,
            fontFamily: 'Gabarito-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
          }}>
          TABELA WYNIKÓW
        </Text>
        <Text
          style={{ color: UI.textFaint, fontFamily: 'Lexend-Bold', fontSize: 11 }}>
          zostało {timeLeftLabel()}
        </Text>
      </View>

      <Card onPress={() => router.push('/leaderboard')} padding={8} accessibilityLabel="Otwórz tabelę wyników">
        {top.length === 0 ? (
          <View className="items-center py-4 px-2">
            <Icon
              name={status === 'error' ? 'close' : 'award'}
              size={24}
              color={UI.textFaint}
              strokeWidth={2.4}
            />
            <Text
              className="text-center"
              style={{
                color: UI.textSoft,
                fontFamily: 'Lexend-Bold',
                fontSize: 13,
                marginTop: 6,
              }}>
              {status === 'loading' && neverSynced
                ? 'Wczytuję ranking…'
                : status === 'error'
                  ? 'Ranking niedostępny — sprawdzę ponownie później.'
                  : 'Zagraj rundę, żeby wejść do tabeli!'}
            </Text>
          </View>
        ) : (
          <>
            {top.map((entry) => (
              <BoardRow
                key={entry.playerId}
                entry={entry}
                isPlayer={entry.playerId === player?.playerId}
                compact
              />
            ))}

            {playerOutsideTop ? (
              <>
                <View className="items-center py-0.5">
                  <Text style={{ color: UI.textFaint, fontSize: 12 }}>···</Text>
                </View>
                <BoardRow entry={player} isPlayer compact />
              </>
            ) : null}

            <View className="flex-row items-center justify-center gap-1 pt-2 pb-1">
              <Text
                style={{
                  color: UI.skyDeep,
                  fontFamily: 'Gabarito-Bold',
                  fontSize: 12,
                }}>
                Zobacz całą tabelę
              </Text>
              <Icon name="chevron-right" size={14} color={UI.skyDeep} strokeWidth={2.8} />
            </View>
          </>
        )}
      </Card>
    </View>
  );
}
