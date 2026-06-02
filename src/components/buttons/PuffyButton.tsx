import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Pressable, Text, View } from '@/tw';

type Variant = 'primary' | 'secondary' | 'success' | 'rose' | 'mystery' | 'reward';
type Size = 'lg' | 'md' | 'sm';

const SURFACE: Record<Variant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-brand-deep',
  success: 'bg-success',
  rose: 'bg-rose',
  mystery: 'bg-mystery',
  reward: 'bg-reward',
};

const SHADOW_HEX: Record<Variant, string> = {
  primary: '#a24d17',
  secondary: '#33210f',
  success: '#357a2a',
  rose: '#a84747',
  mystery: '#2f6a92',
  reward: '#a8730c',
};

const SIZE_PAD: Record<Size, string> = {
  lg: 'px-8 py-5',
  md: 'px-6 py-4',
  sm: 'px-5 py-3',
};

const SIZE_TEXT: Record<Size, string> = {
  lg: 'text-xl',
  md: 'text-lg',
  sm: 'text-base',
};

type PuffyButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  haptic?: boolean;
};

export function PuffyButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  haptic = true,
}: PuffyButtonProps) {
  const press = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: press.value * 5 },
      { scale: 1 - press.value * 0.03 },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - press.value * 0.6, { duration: 80 }),
  }));

  const handlePressIn = useCallback(() => {
    press.value = withSpring(1, { damping: 18, stiffness: 320 });
  }, [press]);

  const handlePressOut = useCallback(() => {
    press.value = withSpring(0, { damping: 18, stiffness: 320 });
  }, [press]);

  const handlePress = useCallback(() => {
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [haptic, onPress]);

  return (
    <View className="relative">
      {/* shadow plate — 5px below the button */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 5,
            left: 0,
            right: 0,
            bottom: -5,
            backgroundColor: SHADOW_HEX[variant],
            borderRadius: 22,
          },
          shadowStyle,
        ]}
      />
      <Animated.View style={animStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled}
          className={`${SURFACE[variant]} ${SIZE_PAD[size]} rounded-puffy items-center justify-center`}
          style={{ opacity: disabled ? 0.5 : 1 }}>
          {/* glossy highlight top half */}
          <View
            pointerEvents="none"
            className="absolute left-2 right-2 top-1 rounded-puffy"
            style={{
              top: 4,
              height: '40%',
              backgroundColor: 'rgba(255,255,255,0.22)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          />
          <Text
            className={`text-paper ${SIZE_TEXT[size]}`}
            style={{ fontFamily: 'Fredoka-Bold', letterSpacing: 0.3 }}>
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
