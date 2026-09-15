import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, type ViewStyle } from 'react-native';

import { UI } from '@/theme/ui';
import { Pressable, View } from '@/tw';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** Kolor obramowania — domyślnie neutralna linia. */
  borderColor?: string;
  /** Tło karty — domyślnie biel. */
  background?: string;
  padding?: number;
  radius?: number;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
};

/**
 * Płaska karta UI 2.0 — biała powierzchnia, 2px obramowania i grubsza dolna
 * krawędź, która daje delikatną głębię bez cienia.
 */
export function Card({
  children,
  onPress,
  borderColor = UI.line,
  background = UI.surface,
  padding = 16,
  radius = 20,
  style,
  disabled = false,
  accessibilityLabel,
}: CardProps) {
  const body = (
    <View
      style={{
        backgroundColor: background,
        borderRadius: radius,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor,
        padding,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}>
      {children}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      {body}
    </Pressable>
  );
}
