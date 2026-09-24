import { useRouter } from 'expo-router';

import { BoardRow } from '@/components/leaderboard/BoardRow';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { useWeeklyScoreSync } from '@/features/leaderboard/useWeeklyScoreSync';
import { timeLeftLabel } from '@/features/leaderboard/week';
import { useLeaderboardStore } from '@/lib/stores/leaderboard-store';
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

  // Synchronizacja mieszkała tutaj, ale musi działać także wtedy, gdy tabela
  // jest schowana z Home — dlatego siedzi w hooku, który Home woła osobno.
  useWeeklyScoreSync();

  const top = entries.slice(0, 3);
  const playerOutsideTop = player && player.rank > 3;
  const neverSynced = lastSyncAt === null;

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        {/* Nagłówek leży wprost na trawie ekranu Home — stąd atrament
            (7.0:1) zamiast dotychczasowego `textFaint`, który na zieleni ginął. */}
        <Text
          style={{
            color: UI.text,
            fontFamily: 'Gabarito-Bold',
            fontSize: 11,
            letterSpacing: 1.2,
          }}>
          TABELA WYNIKÓW
        </Text>
        <Text
          style={{ color: UI.text, fontFamily: 'Lexend-Bold', fontSize: 11 }}>
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
