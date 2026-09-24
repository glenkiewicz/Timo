import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

import { ACCENT, SHADOW, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type FilterChipProps = {
  label: string;
  emoji?: string;
  /** Rysowana ikona zamiast emoji — ma pierwszeństwo, gdy podana. */
  icon?: ReactNode;
  active: boolean;
  onPress: () => void;
  accent?: Accent;
};

/**
 * Pigułka filtra — aktywna wypełnia się kolorem, nieaktywna zostaje biała.
 */
export function FilterChip({
  label,
  emoji,
  icon,
  active,
  onPress,
  accent = 'violet',
}: FilterChipProps) {
  const a = ACCENT[accent];

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}>
      <View
        className="rounded-pill flex-row items-center gap-1.5"
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: active ? a.base : UI.surface,
          // UI 3.0: pigułka odcina się cieniem, nie ramką 2/3 px (patrz Card).
          boxShadow: SHADOW.e0,
        }}>
        {icon ?? (emoji ? <Text style={{ fontSize: 13 }}>{emoji}</Text> : null)}
        <Text
          style={{
            color: active ? UI.surface : UI.textSoft,
            fontFamily: 'Gabarito-Bold',
            fontSize: 12,
          }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
