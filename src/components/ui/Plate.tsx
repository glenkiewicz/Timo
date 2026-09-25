import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ACCENT, type Accent } from '@/theme/ui';
import { Pressable, Text } from '@/tw';

type PlateProps = {
  label: string;
  onPress: () => void;
  accent: Accent;
  size?: 'lg' | 'md';
};

/**
 * Przycisk-płytka: jednolity kolor, biały napis, duże zaokrąglenie — ten sam,
 * który zamyka wysuwany panel (`InfoSheet`).
 *
 * Zastępuje trójwymiarowy `Button` tam, gdzie przycisk leży obok pergaminu
 * i ilustracji: gruba krawędź pod spodem i napis wersalikami należały do
 * płaskiego UI 3.0 i odstawały od papieru. Ciemny odcień akcentu, a nie
 * podstawowy, bo dopiero on trzyma kontrast z białym napisem.
 */
export function Plate({ label, onPress, accent, size = 'lg' }: PlateProps) {
  const a = ACCENT[accent];
  const lg = size === 'lg';

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        paddingVertical: lg ? 15 : 11,
        borderRadius: 26,
        alignItems: 'center',
        backgroundColor: a.deep,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: lg ? 18 : 16 }}>
        {label}
      </Text>
    </Pressable>
  );
}
