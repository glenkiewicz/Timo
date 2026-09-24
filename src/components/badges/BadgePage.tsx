import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { BinderPage } from '@/components/ui/BinderPage';
import { Icon } from '@/components/ui/Icon';
import type { BadgeDef } from '@/data/badges';
import { UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

export type BadgeItem = BadgeDef & { unlocked: boolean };

const COLUMNS = 3;
const GAP = 10;

type BadgePageProps = {
  label: string;
  items: BadgeItem[];
  onSelect: (item: BadgeItem) => void;
  onHint: () => void;
};

/**
 * Kartka odznak — jedna grupa jako strona w segregatorze.
 *
 * Układ jest zapożyczony z ekranu kolekcji w Finchu: kółka bindera wystające
 * nad krawędź, papierowa strona, siatka gniazd i brązowa stopka z licznikiem.
 * Kolory są nasze (`sand`/`page`/`binder` z `theme/ui`), nie Finchowe.
 *
 * Dwie rzeczy celowo różnią się od pierwowzoru:
 * - stopka nie ma chevronu, bo nie mamy dokąd nim prowadzić; zostaje sam
 *   licznik, żeby nie było martwego przycisku,
 * - zablokowane gniazdo nadal jest CZYTELNE (podpis „???" ma 4.9:1 na tle
 *   gniazda). Finch trzyma je bardzo blado, ale to aplikacja dla dzieci.
 */
export function BadgePage({ label, items, onSelect, onHint }: BadgePageProps) {
  return (
    <BinderPage
      label={label}
      onHint={onHint}
      hintLabel={`Co to za odznaki: ${label}`}
      counter={{ value: items.filter((i) => i.unlocked).length, total: items.length }}>
      {rows(items).map((row, ri) => (
        <View
          key={ri}
          className="flex-row"
          style={{ gap: GAP, marginTop: ri > 0 ? GAP : 0 }}>
          {row.map((item) => (
            <View key={item.id} style={{ flex: 1 }}>
              <BadgeSlot item={item} onPress={() => item.unlocked && onSelect(item)} />
            </View>
          ))}
          {/* dopełnienie, żeby ostatni niepełny wiersz nie rozciągał gniazd */}
          {Array.from({ length: COLUMNS - row.length }).map((_, i) => (
            <View key={`fill-${i}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </BinderPage>
  );
}

/** Dzieli odznaki na wiersze po `COLUMNS` — równe kolumny robi `flex: 1`
 *  w wierszu, bo `flex-wrap` z `gap` nie utrzyma jednakowych szerokości. */
function rows(items: BadgeItem[]): BadgeItem[][] {
  const out: BadgeItem[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    out.push(items.slice(i, i + COLUMNS));
  }
  return out;
}

function BadgeSlot({ item, onPress }: { item: BadgeItem; onPress: () => void }) {
  const body = (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          aspectRatio: 1,
          borderRadius: 22,
          backgroundColor: UI.pageSlot,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {item.unlocked ? (
          <Text style={{ fontSize: 38 }}>{item.emoji}</Text>
        ) : (
          <Icon name="lock" size={24} color={UI.pageFaint} strokeWidth={2.4} />
        )}
      </View>
      <Text
        className="text-center"
        numberOfLines={2}
        style={{
          color: item.unlocked ? UI.text : UI.pageFaint,
          fontFamily: 'Gabarito-Bold',
          fontSize: 10,
          lineHeight: 13,
          marginTop: 6,
        }}>
        {item.unlocked ? item.label_pl : '???'}
      </Text>
    </View>
  );

  if (!item.unlocked) return body;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={item.label_pl}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}>
      {body}
    </Pressable>
  );
}
