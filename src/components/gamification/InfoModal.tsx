import { useEffect } from 'react';
import { Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { TooltipDef } from '@/data/info-tooltips';
import { Pressable, Text, View } from '@/tw';

type InfoModalProps = {
  visible: boolean;
  tooltip: TooltipDef;
  onClose: () => void;
};

export function InfoModal({ visible, tooltip, onClose }: InfoModalProps) {
  const enter = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      enter.value = withSpring(1, { damping: 14, stiffness: 220 });
    } else {
      enter.value = withTiming(0, { duration: 120 });
    }
  }, [visible, enter]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.85 + enter.value * 0.15 }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: enter.value * 0.55,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 items-center justify-center px-8">
        {/* backdrop */}
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Animated.View
            style={[
              { flex: 1, backgroundColor: '#000' },
              backdropStyle,
            ]}
          />
        </Pressable>

        {/* card */}
        <Animated.View
          style={[
            {
              backgroundColor: '#fff1df',
              borderRadius: 22,
              borderWidth: 2,
              borderColor: '#fff6cc',
              paddingHorizontal: 24,
              paddingVertical: 22,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.22,
              shadowRadius: 24,
              elevation: 12,
              maxWidth: 340,
            },
            cardStyle,
          ]}>
          <View className="items-center mb-2">
            <Text style={{ fontSize: 56, lineHeight: 64 }}>{tooltip.emoji}</Text>
          </View>
          <Text
            className="text-ink text-center"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 22, marginBottom: 8 }}>
            {tooltip.title}
          </Text>
          <Text
            className="text-ink-soft text-center"
            style={{ fontFamily: 'Nunito', fontSize: 15, lineHeight: 22 }}>
            {tooltip.description}
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-brand rounded-puffy mt-5 py-3 items-center">
            <Text
              className="text-paper"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 16 }}>
              Już rozumiem!
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
