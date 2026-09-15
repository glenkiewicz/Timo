import type { BoardEntry } from '@/features/leaderboard/types';
import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';

/** Medale dla podium, neutralny numerek dla reszty. */
function rankStyle(rank: number): { background: string; color: string } {
  if (rank === 1) return { background: UI.goldPale, color: UI.goldDeep };
  if (rank === 2) return { background: UI.line, color: UI.textSoft };
  if (rank === 3) return { background: UI.foxPale, color: UI.foxDeep };
  return { background: 'transparent', color: UI.textFaint };
}

type BoardRowProps = {
  entry: BoardEntry;
  /** Wiersz zalogowanego urządzenia — podświetlony i podpisany „TY". */
  isPlayer?: boolean;
  compact?: boolean;
};

export function BoardRow({ entry, isPlayer = false, compact = false }: BoardRowProps) {
  const medal = rankStyle(entry.rank);

  return (
    <View
      className="flex-row items-center gap-3"
      style={{
        paddingVertical: compact ? 8 : 11,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: isPlayer ? UI.primaryPale : 'transparent',
        borderWidth: isPlayer ? 2 : 0,
        borderColor: isPlayer ? UI.primary : 'transparent',
      }}>
      <View
        className="items-center justify-center rounded-pill"
        style={{ width: 28, height: 28, backgroundColor: medal.background }}>
        <Text
          style={{ color: medal.color, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>
          {entry.rank}
        </Text>
      </View>

      <Text style={{ fontSize: compact ? 20 : 24 }}>{entry.emoji}</Text>

      <Text
        numberOfLines={1}
        className="flex-1"
        style={{
          color: isPlayer ? UI.primaryDeep : UI.text,
          fontFamily: 'Gabarito-Bold',
          fontSize: compact ? 14 : 15,
        }}>
        {isPlayer ? 'TY' : entry.name}
      </Text>

      <Text
        style={{
          color: isPlayer ? UI.primaryDeep : UI.textSoft,
          fontFamily: 'Gabarito-Bold',
          fontSize: compact ? 13 : 14,
        }}>
        {entry.score} XP
      </Text>
    </View>
  );
}
