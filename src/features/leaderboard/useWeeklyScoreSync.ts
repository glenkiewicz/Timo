import { useEffect } from 'react';

import { useLeaderboardStore } from '@/lib/stores/leaderboard-store';
import { useProfileStore } from '@/lib/stores/profile-store';

/**
 * Wejście na Home = moment synchronizacji rankingu: wysyłamy wynik tygodnia,
 * jeśli urósł, a poza tym domykamy zaległą wysyłkę.
 *
 * Mieszkało to w `useEffect` wewnątrz `LeaderboardCard`, więc wysyłka działała
 * tylko wtedy, gdy karta była wyrenderowana. Po schowaniu tabeli z Home
 * (`SHOW_HOME_LEADERBOARD`) wynik przestałby w ogóle trafiać na serwer — ekran
 * `/leaderboard` wywołuje sam `flushPending`, który dosyła kolejkę, ale nigdy
 * nie zgłasza bieżącego `weeklyXp`. Stąd osobny hook: Home synchronizuje
 * niezależnie od tego, czy tabela jest widoczna.
 */
export function useWeeklyScoreSync() {
  const player = useLeaderboardStore((s) => s.player);
  const submitScore = useLeaderboardStore((s) => s.submitScore);
  const flushPending = useLeaderboardStore((s) => s.flushPending);
  const weeklyXp = useProfileStore((s) => s.weeklyXp);

  useEffect(() => {
    if (weeklyXp > 0 && weeklyXp !== player?.score) {
      void submitScore(weeklyXp);
    } else {
      void flushPending();
    }
    // Celowo raz na wejście — nie chcemy pingować API przy każdym renderze.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
