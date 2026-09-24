import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

const RINGS = 5;

type BinderPageProps = {
  /** Nagłówek strony — nazwa grupy odznak albo aktywny filtr kolekcji. */
  label: string;
  /** Treść strony: siatka gniazd. */
  children: ReactNode;
  /** Licznik w brązowej stopce. Pominięty = stopki nie ma. */
  counter?: { value: number; total: number };
  /** Przycisk „i" przy nagłówku. Pominięty = przycisku nie ma. */
  onHint?: () => void;
  hintLabel?: string;
  /** Odstęp pod stroną — listy składają z nich stos. */
  spacing?: number;
};

/**
 * Strona segregatora — kółka bindera, papierowa karta, brązowa stopka.
 *
 * Motyw jest zapożyczony z ekranu kolekcji w Finchu; kolory są nasze
 * (`sand`/`page`/`binder` z `theme/ui`). Powstał najpierw dla odznak, a że
 * kolekcja zwierząt to ten sam problem — pogrupowany zbiór z licznikiem
 * postępu — obie korzystają teraz z jednej powłoki zamiast dwóch podobnych.
 */
export function BinderPage({
  label,
  children,
  counter,
  onHint,
  hintLabel,
  spacing = 22,
}: BinderPageProps) {
  return (
    <View style={{ marginBottom: spacing }}>
      {/* kółka bindera — wystają nad stronę, która przykrywa ich dolną część */}
      <View
        className="flex-row justify-evenly"
        style={{ paddingHorizontal: 34, marginBottom: -13 }}>
        {Array.from({ length: RINGS }).map((_, i) => (
          <View
            key={i}
            style={{ width: 14, height: 26, borderRadius: 7, backgroundColor: UI.binder }}
          />
        ))}
      </View>

      <View
        style={{
          backgroundColor: UI.page,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: SHADOW.e1,
        }}>
        <View style={{ padding: 16 }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: 12 }}>
            <Text
              numberOfLines={1}
              style={{
                color: UI.text,
                fontFamily: 'Gabarito-Bold',
                fontSize: 17,
                flex: 1,
                paddingRight: 8,
              }}>
              {label}
            </Text>
            {onHint ? (
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.selectionAsync();
                  onHint();
                }}
                accessibilityRole="button"
                accessibilityLabel={hintLabel ?? `Co to jest: ${label}`}
                className="w-7 h-7 items-center justify-center rounded-pill"
                style={{ backgroundColor: UI.pageSlot }}>
                <Text
                  style={{
                    color: UI.pageFaint,
                    fontFamily: 'Gabarito-Bold',
                    fontSize: 13,
                  }}>
                  i
                </Text>
              </Pressable>
            ) : null}
          </View>

          {children}
        </View>

        {counter ? (
          <View
            style={{
              backgroundColor: UI.binderDeep,
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{ color: UI.surface, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>
              {counter.value} / {counter.total}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
