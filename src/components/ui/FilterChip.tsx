import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type FilterChipProps = {
  label: string;
  emoji?: string;
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
          borderWidth: 2,
          borderBottomWidth: 3,
          borderColor: active ? a.deep : UI.line,
        }}>
        {emoji ? <Text style={{ fontSize: 13 }}>{emoji}</Text> : null}
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
