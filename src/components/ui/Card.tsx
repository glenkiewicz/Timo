import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, type ViewStyle } from 'react-native';

import { SHADOW, UI } from '@/theme/ui';
import { Pressable, View } from '@/tw';

/**
 * `surface` — biel dla kart z danymi, które trzeba przeczytać.
 * `panel`   — zieleń drugoplanowa NA trawie, jak zielone bloki w Finchu.
 *             Tekst na niej ma być biały (`UI.onLawn` / `UI.onLawnSoft`).
 */
export type CardTone = 'surface' | 'panel';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  tone?: CardTone;
  /** Opcjonalna włoskowata obwódka w akcencie — np. karta wyprawy ukończonej. */
  borderColor?: string;
  /** Nadpisanie tła; zwykle wystarczy `tone`. */
  background?: string;
  padding?: number;
  radius?: number;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
};

/**
 * Karta UI 3.0 — powierzchnia podniesiona CIENIEM, nie ramką.
 *
 * Wcześniej była to karta UI 2.0: obwódka 2 px plus pogrubiona dolna krawędź
 * 4 px. `docs/design-3.0.md` przewiduje w kroku „Chrome", że ta półka znika na
 * rzecz drabiny cieni z `theme/ui.ts` — i to jest właśnie ta zmiana. Na
 * ilustrowanym tle ramka czytała się jak naklejka; cień kładzie kartę na trawie.
 */
export function Card({
  children,
  onPress,
  tone = 'surface',
  borderColor,
  background,
  padding = 16,
  radius = 24,
  style,
  disabled = false,
  accessibilityLabel,
}: CardProps) {
  const body = (
    <View
      style={{
        backgroundColor: background ?? (tone === 'panel' ? UI.panel : UI.surface),
        borderRadius: radius,
        // Obwódka wyłącznie na życzenie i włoskowata — nie jako sposób na głębię.
        ...(borderColor ? { borderWidth: 1.5, borderColor } : null),
        padding,
        boxShadow: SHADOW.e1,
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
