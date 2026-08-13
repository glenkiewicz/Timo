import { useEffect } from 'react';
import { Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import type { TooltipDef } from '@/data/info-tooltips';
import { UI } from '@/theme/ui';
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
              backgroundColor: UI.canvas,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: UI.line,
              paddingHorizontal: 24,
              paddingVertical: 22,
              maxWidth: 340,
            },
            cardStyle,
          ]}>
          <View className="items-center mb-2">
            <Text style={{ fontSize: 56, lineHeight: 64 }}>{tooltip.emoji}</Text>
          </View>
          <Text
            className="text-center"
            style={{
              color: UI.text,
              fontFamily: 'Fredoka-Bold',
              fontSize: 22,
              marginBottom: 8,
            }}>
            {tooltip.title}
          </Text>
          <Text
            className="text-center"
            style={{
              color: UI.textSoft,
              fontFamily: 'Nunito',
              fontSize: 15,
              lineHeight: 22,
            }}>
            {tooltip.description}
          </Text>

          <View className="mt-5">
            <Button label="JUŻ ROZUMIEM!" size="md" onPress={onClose} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
