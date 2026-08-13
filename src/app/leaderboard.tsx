import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoardRow } from '@/components/leaderboard/BoardRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { nicknameFor } from '@/features/leaderboard/nicknames';
import { timeLeftLabel } from '@/features/leaderboard/week';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useLeaderboardStore } from '@/lib/stores/leaderboard-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const entries = useLeaderboardStore((s) => s.entries);
  const player = useLeaderboardStore((s) => s.player);
  const total = useLeaderboardStore((s) => s.total);
  const status = useLeaderboardStore((s) => s.status);
  const errorMessage = useLeaderboardStore((s) => s.errorMessage);
  const lastSyncAt = useLeaderboardStore((s) => s.lastSyncAt);
  const flushPending = useLeaderboardStore((s) => s.flushPending);

  const activeProfile = useAuthStore((s) => s.activeProfile());
  const rerollPublicName = useAuthStore((s) => s.rerollPublicName);

  const weeklyXp = useProfileStore((s) => s.weeklyXp);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void flushPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await flushPending();
    setRefreshing(false);
  }, [flushPending]);

  // Pseudonim publiczny liczymy z profilu — w bazie leży tylko ziarno.
  const me = activeProfile
    ? nicknameFor(activeProfile.id, activeProfile.nick_variant)
    : { name: 'Tropiciel', emoji: '🐾' };

  const handleReroll = async () => {
    await rerollPublicName();
    // Tabela pokazuje pseudonim wyliczany z ziarna — po zmianie trzeba odświeżyć.
    await flushPending();
  };

  const playerInList = player ? entries.some((e) => e.playerId === player.playerId) : false;
  const offline = status === 'error';

  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader
        eyebrow="RANKING TYGODNIA"
        title="Tabela wyników"
        // Licznik pokazuje miejsce gracza — dopóki go nie ma w tabeli,
        // „3/3" sugerowałoby ostatnią pozycję zamiast braku wyniku.
        counter={player ? { value: player.rank, total, accent: 'gold' } : undefined}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={UI.textFaint} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
        }}>
        {/* ---------- kim jestem w tabeli ---------- */}
        <Card padding={14}>
          <Text
            style={{
              color: UI.textFaint,
              fontFamily: 'Fredoka-Bold',
              fontSize: 10,
              letterSpacing: 1.2,
              marginBottom: 6,
            }}>
            GRASZ JAKO
          </Text>
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 30 }}>{me.emoji}</Text>
            <View className="flex-1">
              <Text
                style={{ color: UI.text, fontFamily: 'Fredoka-Bold', fontSize: 17 }}>
                {me.name}
              </Text>
              <Text
                style={{ color: UI.textSoft, fontFamily: 'Nunito-Bold', fontSize: 12 }}>
                {weeklyXp} XP w tym tygodniu · zostało {timeLeftLabel()}
              </Text>
            </View>
          </View>
          <View className="mt-3">
            <Button
              label="Wylosuj nowy pseudonim"
              variant="ghost"
              size="sm"
              onPress={() => void handleReroll()}
            />
          </View>
        </Card>

        {/* ---------- stan połączenia ---------- */}
        {offline ? (
          <View className="mt-3">
            <Card borderColor={UI.gold} background={UI.goldPale} padding={12}>
              <View className="flex-row items-center gap-2">
                <Icon name="close" size={16} color={UI.goldDeep} strokeWidth={2.6} />
                <Text
                  className="flex-1"
                  style={{
                    color: UI.goldDeep,
                    fontFamily: 'Nunito-Bold',
                    fontSize: 12,
                    lineHeight: 17,
                  }}>
                  {lastSyncAt
                    ? 'Pokazuję ostatnio pobraną tabelę — wynik wyślę, gdy wróci internet.'
                    : (errorMessage ?? 'Brak połączenia z rankingiem.')}
                </Text>
              </View>
            </Card>
          </View>
        ) : null}

        {/* ---------- tabela ---------- */}
        <View className="mt-3">
          <Card padding={8}>
            {entries.length === 0 ? (
              <View className="items-center py-8 px-4">
                <Text style={{ fontSize: 34 }}>🏆</Text>
                <Text
                  className="text-center"
                  style={{
                    color: UI.text,
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 16,
                    marginTop: 8,
                  }}>
                  Tabela jest jeszcze pusta
                </Text>
                <Text
                  className="text-center"
                  style={{
                    color: UI.textSoft,
                    fontFamily: 'Nunito',
                    fontSize: 13,
                    lineHeight: 19,
                    marginTop: 4,
                  }}>
                  Zagraj rundę z Timo — zdobyte XP wpisze Cię do rankingu tego tygodnia.
                </Text>
              </View>
            ) : (
              <>
                {entries.map((entry) => (
                  <BoardRow
                    key={entry.playerId}
                    entry={entry}
                    isPlayer={entry.playerId === player?.playerId}
                  />
                ))}

                {player && !playerInList ? (
                  <>
                    <View className="items-center py-1">
                      <Text style={{ color: UI.textFaint, fontSize: 13 }}>···</Text>
                    </View>
                    <BoardRow entry={player} isPlayer />
                  </>
                ) : null}
              </>
            )}
          </Card>
        </View>

        <Text
          className="text-center mt-4"
          style={{
            color: UI.textFaint,
            fontFamily: 'Nunito',
            fontSize: 11,
            lineHeight: 16,
          }}>
          Ranking zeruje się w każdy poniedziałek. Gracze widoczni są tylko pod
          wylosowanym pseudonimem — Timo nie zbiera żadnych danych o dziecku.
        </Text>
      </ScrollView>
    </View>
  );
}
