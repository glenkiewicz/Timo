import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Pressable, Text, View } from '@/tw';

export type AnswerType = 'yes' | 'no' | 'idk' | 'hard';

const SURFACE = {
  yes: 'bg-success',
  no: 'bg-rose',
  idk: 'bg-mystery',
  hard: 'bg-brand',
} as const;

const SHADOW_HEX = {
  yes: '#357a2a',
  no: '#a84747',
  idk: '#2f6a92',
  hard: '#a24d17',
} as const;

const LABEL = {
  yes: 'Tak',
  no: 'Nie',
  idk: 'Nie wiem',
  hard: 'To zależy',
} as const;

const ICON = {
  yes: '✓',
  no: '✕',
  idk: '?',
  hard: '~',
} as const;

type AnswerCardProps = {
  answer: AnswerType;
  onPress?: (answer: AnswerType) => void;
  disabled?: boolean;
};

export function AnswerCard({ answer, onPress, disabled }: AnswerCardProps) {
  const press = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: press.value * 4 },
      { scale: 1 - press.value * 0.025 },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 1 - press.value * 0.6,
  }));

  const handleIn = useCallback(() => {
    press.value = withSpring(1, { damping: 18, stiffness: 320 });
  }, [press]);

  const handleOut = useCallback(() => {
    press.value = withSpring(0, { damping: 18, stiffness: 320 });
  }, [press]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(answer);
  }, [answer, onPress]);

  return (
    <View className="relative flex-1">
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 4,
            left: 0,
            right: 0,
            bottom: -4,
            backgroundColor: SHADOW_HEX[answer],
            borderRadius: 22,
          },
          shadowStyle,
        ]}
      />
      <Animated.View style={cardStyle}>
        <Pressable
          onPressIn={handleIn}
          onPressOut={handleOut}
          onPress={handlePress}
          disabled={disabled}
          className={`${SURFACE[answer]} rounded-puffy items-center justify-center py-5 px-3`}
          style={{ minHeight: 96, opacity: disabled ? 0.5 : 1 }}>
          {/* corner glow accent */}
          <View
            pointerEvents="none"
            className="absolute top-2 left-2 right-2 rounded-puffy"
            style={{
              height: '40%',
              backgroundColor: 'rgba(255,255,255,0.22)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          />
          {/* icon disc */}
          <View
            className="rounded-full items-center justify-center mb-1.5"
            style={{
              width: 44,
              height: 44,
              backgroundColor: 'rgba(255,255,255,0.95)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text
              style={{
                color: SHADOW_HEX[answer],
                fontFamily: 'Fredoka-Bold',
                fontSize: 22,
                lineHeight: 26,
              }}>
              {ICON[answer]}
            </Text>
          </View>
          <Text
            className="text-paper"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
            {LABEL[answer]}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
