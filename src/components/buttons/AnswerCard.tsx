import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

export type AnswerType = 'yes' | 'no' | 'idk' | 'hard';

const ACCENT_FOR: Record<AnswerType, Accent> = {
  yes: 'primary',
  no: 'danger',
  idk: 'sky',
  hard: 'fox',
};

const LABEL: Record<AnswerType, string> = {
  yes: 'Tak',
  no: 'Nie',
  idk: 'Nie wiem',
  hard: 'To zależy',
};

const GLYPH: Record<AnswerType, string> = {
  yes: '✓',
  no: '✕',
  idk: '?',
  hard: '~',
};

const DEPTH = 4;

type AnswerCardProps = {
  answer: AnswerType;
  onPress?: (answer: AnswerType) => void;
  disabled?: boolean;
};

/**
 * Kafel odpowiedzi — biała powierzchnia z kolorowym znakiem, żeby cztery
 * przyciski dało się rozróżnić kolorem, ale ekran został spokojny.
 */
export function AnswerCard({ answer, onPress, disabled }: AnswerCardProps) {
  const press = useSharedValue(0);
  const accent = ACCENT[ACCENT_FOR[answer]];

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * DEPTH }],
  }));

  const handleIn = useCallback(() => {
    if (disabled) return;
    press.value = withSpring(1, { damping: 20, stiffness: 400 });
  }, [disabled, press]);

  const handleOut = useCallback(() => {
    press.value = withSpring(0, { damping: 20, stiffness: 400 });
  }, [press]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(answer);
  }, [answer, onPress]);

  return (
    <Pressable
      onPressIn={handleIn}
      onPressOut={handleOut}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={LABEL[answer]}
      accessibilityState={{ disabled: !!disabled }}
      className="flex-1"
      style={{ opacity: disabled ? 0.55 : 1 }}>
      <View className="relative">
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: DEPTH,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: UI.line,
            borderRadius: 18,
          }}
        />
        <Animated.View
          style={[
            {
              marginBottom: DEPTH,
              backgroundColor: UI.surface,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: UI.line,
              paddingVertical: 14,
              paddingHorizontal: 8,
              minHeight: 96,
              alignItems: 'center',
              justifyContent: 'center',
            },
            faceStyle,
          ]}>
          <View
            className="items-center justify-center rounded-pill mb-1.5"
            style={{ width: 44, height: 44, backgroundColor: accent.pale }}>
            <Text
              style={{
                color: accent.deep,
                fontFamily: 'Gabarito-Bold',
                fontSize: 22,
                lineHeight: 26,
              }}>
              {GLYPH[answer]}
            </Text>
          </View>
          <Text
            style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 16 }}>
            {LABEL[answer]}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
