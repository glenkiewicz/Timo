import { EXPEDITION_ICONS } from '@/data/expedition-icons';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

type ExpeditionIconProps = {
  expeditionId: string;
  /** Emoji z `Expedition.hero_emoji` — zapas, gdy wyprawa nie ma jeszcze ikony. */
  fallbackEmoji: string;
  size: number;
};

/**
 * Ikona wyprawy — rysowany obiekt zamiast systemowego emoji.
 *
 * Emoji rysował font systemowy, więc ta sama wyprawa wyglądała inaczej na iOS
 * (Apple Color Emoji) niż na Androidzie (Noto), i w obu przypadkach odstawała
 * od ilustrowanego języka reszty aplikacji — dok dostał własne rysunki właśnie
 * z tego powodu.
 *
 * `fallbackEmoji` zostaje, bo ikony mają dziś tylko wyprawy `guided`; 21 wypraw
 * eksperta (ukrytych flagą) nadal korzysta z emoji.
 */
export function ExpeditionIcon({
  expeditionId,
  fallbackEmoji,
  size,
}: ExpeditionIconProps) {
  const source = EXPEDITION_ICONS[expeditionId];

  if (!source) {
    return <Text style={{ fontSize: size * 0.92 }}>{fallbackEmoji}</Text>;
  }

  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={0}
      accessible={false}
    />
  );
}
