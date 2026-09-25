import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { sfx } from '@/lib/audio/sfx';
import { ACCENT, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type PlateProps = {
  label: string;
  onPress: () => void;
  accent: Accent;
  size?: 'lg' | 'md';
};

/**
 * Główny przycisk gry — płyta 3D: kolor akcentu na wierzchu i ciemniejsza
 * krawędź pod spodem, która chowa się przy wciśnięciu.
 *
 * Przez chwilę była płaska, jak przycisk w wysuwanym panelu, ale główne
 * przyciski straciły wtedy „wciskalność” i rozjechały się z resztą ekranów.
 * Krawędź 3D zostaje; z UI 3.0 wypadły tylko wersaliki i ciasne rogi.
 */
export function Plate({ label, onPress, accent, size = 'lg' }: PlateProps) {
  const a = ACCENT[accent];
  const lg = size === 'lg';
  const depth = lg ? 5 : 4;
  const press = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * depth }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        press.value = withSpring(1, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { damping: 20, stiffness: 400 });
      }}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        sfx.play('tap');
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View>
        {/* krawędź 3D — widać ją tylko jako pasek pod wierzchem */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: depth,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 26,
            backgroundColor: a.deep,
          }}
        />
        <Animated.View
          style={[
            {
              marginBottom: depth,
              paddingVertical: lg ? 15 : 11,
              borderRadius: 26,
              alignItems: 'center',
              backgroundColor: a.base,
            },
            faceStyle,
          ]}>
          <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: lg ? 18 : 16 }}>
            {label}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
