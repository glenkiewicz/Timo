import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  /** Licznik po prawej, np. 12 / 45. */
  counter?: { value: number; total: number; accent?: Accent };
  onBack?: () => void;
  /** Dodatkowy pasek pod nagłówkiem — filtry, opis, cokolwiek. */
  children?: ReactNode;
};

/**
 * Wspólny nagłówek ekranów — powrót, tytuł, licznik postępu.
 */
export function ScreenHeader({
  eyebrow,
  title,
  counter,
  onBack,
  children,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const accent = ACCENT[counter?.accent ?? 'primary'];

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: UI.canvas,
        borderBottomWidth: 2,
        borderBottomColor: UI.line,
      }}>
      <View className="flex-row items-center justify-between">
        {onBack ? (
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              onBack();
            }}
            accessibilityRole="button"
            accessibilityLabel="Wróć"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: UI.sunken }}>
            <Icon name="arrow-left" size={20} color={UI.textSoft} strokeWidth={2.6} />
          </Pressable>
        ) : (
          <View className="w-10 h-10" />
        )}

        <View className="items-center flex-1 px-2">
          {eyebrow ? (
            <Text
              style={{
                color: UI.textFaint,
                fontFamily: 'Fredoka-Bold',
                fontSize: 10,
                letterSpacing: 1.2,
              }}>
              {eyebrow}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            style={{ color: UI.text, fontFamily: 'Fredoka-Bold', fontSize: 19 }}>
            {title}
          </Text>
        </View>

        {counter ? (
          <View
            className="rounded-pill px-3 py-1.5"
            style={{ backgroundColor: accent.pale }}>
            <Text
              style={{
                color: accent.deep,
                fontFamily: 'Fredoka-Bold',
                fontSize: 13,
              }}>
              {counter.value}/{counter.total}
            </Text>
          </View>
        ) : (
          <View className="w-10 h-10" />
        )}
      </View>

      {children}
    </View>
  );
}
