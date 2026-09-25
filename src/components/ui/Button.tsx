import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/ui/Icon';
import { sfx } from '@/lib/audio/sfx';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type Variant = Accent | 'ghost';
type Size = 'lg' | 'md' | 'sm';

const SIZE = {
  lg: { padV: 16, padH: 22, font: 18, gap: 10, icon: 22, radius: 16, depth: 5 },
  md: { padV: 12, padH: 18, font: 16, gap: 8, icon: 20, radius: 14, depth: 4 },
  sm: { padV: 9, padH: 14, font: 14, gap: 6, icon: 17, radius: 12, depth: 4 },
} as const;

function faces(variant: Variant) {
  if (variant === 'ghost') {
    return { face: UI.surface, plate: UI.line, label: UI.textSoft };
  }
  const a = ACCENT[variant];
  // Żółty jest zbyt jasny na biały tekst — czytamy go ciemnym złotem.
  return {
    face: a.base,
    plate: a.deep,
    label: variant === 'gold' ? '#7a5a00' : UI.surface,
  };
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  disabled?: boolean;
  haptic?: boolean;
};

/**
 * Przycisk 3D — pełna płaszczyzna koloru z ciemniejszą krawędzią pod spodem,
 * która „chowa się" przy wciśnięciu. Bez gradientu i bez połysku.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  haptic = true,
}: ButtonProps) {
  const s = SIZE[size];
  const press = useSharedValue(0);
  const { face, plate, label: labelColor } = faces(variant);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * s.depth }],
  }));

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    press.value = withSpring(1, { damping: 20, stiffness: 400 });
  }, [disabled, press]);

  const handlePressOut = useCallback(() => {
    press.value = withSpring(0, { damping: 20, stiffness: 400 });
  }, [press]);

  const handlePress = useCallback(() => {
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    sfx.play('tap');
    onPress?.();
  }, [haptic, onPress]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      // Szare wypełnienie samo niesie stan „nieaktywny" — mocne wygaszenie
      // sprawiało, że przycisk znikał, gdy Timo mówi.
      style={{ opacity: disabled ? 0.8 : 1 }}>
      <View className="relative">
        {/* krawędź 3D — widoczna tylko jako pasek pod spodem */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: s.depth,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: disabled ? UI.lineDeep : plate,
            borderRadius: s.radius,
          }}
        />
        <Animated.View
          style={[
            {
              marginBottom: s.depth,
              backgroundColor: disabled ? UI.line : face,
              borderRadius: s.radius,
              paddingVertical: s.padV,
              paddingHorizontal: s.padH,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: s.gap,
            },
            faceStyle,
          ]}>
          {icon ? (
            <Icon
              name={icon}
              size={s.icon}
              color={disabled ? UI.textFaint : labelColor}
              strokeWidth={2.6}
            />
          ) : null}
          <Text
            style={{
              color: disabled ? UI.textFaint : labelColor,
              fontFamily: 'Gabarito-Bold',
              fontSize: s.font,
              letterSpacing: 0.6,
            }}>
            {label}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
