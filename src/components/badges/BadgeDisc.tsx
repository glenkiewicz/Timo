import { SlotDisc } from '@/components/collection/map';
import { BADGE_ART } from '@/data/badge-art';
import { UI } from '@/theme/ui';
import { Image } from '@/tw/image';

/**
 * Odznaka na tej samej tarczy, co zwierzę w kolekcji. Niezdobyta pokazuje
 * sylwetkę — tak jak nieodkryte zwierzę: dziecko widzi, CO może zdobyć,
 * i to ciągnie mocniej niż kłódka.
 */
export function BadgeDisc({
  badgeId,
  unlocked,
  size,
}: {
  badgeId: string;
  unlocked: boolean;
  size: number;
}) {
  const art = BADGE_ART[badgeId];
  return (
    <SlotDisc size={size}>
      {art ? (
        <Image
          source={art}
          style={{ flex: 1, opacity: unlocked ? 1 : 0.55 }}
          contentFit="contain"
          tintColor={unlocked ? undefined : UI.pageFaint}
          transition={0}
          accessible={false}
        />
      ) : null}
    </SlotDisc>
  );
}
