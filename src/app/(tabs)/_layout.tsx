import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/react-navigation/bottom-tabs/types';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/Icon';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

type TabSpec = {
  name: string;
  label: string;
  icon: IconName;
  accent: Accent;
};

// Kolejność wg ustaleń: Kolekcja, Wyprawy, Odznaki, Menu (Home).
const TABS: TabSpec[] = [
  { name: 'collection', label: 'Kolekcja', icon: 'grid', accent: 'violet' },
  { name: 'expeditions', label: 'Wyprawy', icon: 'map', accent: 'sky' },
  { name: 'badges', label: 'Odznaki', icon: 'award', accent: 'gold' },
  { name: 'index', label: 'Menu', icon: 'home', accent: 'primary' },
];

function TabItem({
  spec,
  focused,
  onPress,
}: {
  spec: TabSpec;
  focused: boolean;
  onPress: () => void;
}) {
  const pop = useSharedValue(1);
  const accent = ACCENT[spec.accent];

  useEffect(() => {
    if (!focused) return;
    pop.value = withSequence(
      withSpring(1.18, { damping: 9, stiffness: 320 }),
      withSpring(1, { damping: 15, stiffness: 220 })
    );
  }, [focused, pop]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={spec.label}
      onPress={onPress}
      className="flex-1 items-center justify-center py-1">
      <Animated.View style={iconStyle}>
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 6,
            borderRadius: 14,
            backgroundColor: focused ? accent.pale : 'transparent',
          }}>
          <Icon
            name={spec.icon}
            size={26}
            color={focused ? accent.deep : UI.textFaint}
            strokeWidth={focused ? 2.6 : 2.2}
          />
        </View>
      </Animated.View>
      <Text
        style={{
          color: focused ? accent.deep : UI.textFaint,
          fontFamily: 'Fredoka-Bold',
          fontSize: 11,
          letterSpacing: 0.3,
          marginTop: 3,
        }}>
        {spec.label}
      </Text>
    </Pressable>
  );
}

function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-canvas px-2 pt-2"
      style={{
        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        borderTopWidth: 2,
        borderTopColor: UI.line,
      }}>
      {state.routes.map((route, idx) => {
        const spec = TABS.find((t) => t.name === route.name);
        if (!spec) return null;
        const focused = state.index === idx;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={route.key}
            spec={spec}
            focused={focused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="expeditions" />
      <Tabs.Screen name="collection" />
      <Tabs.Screen name="badges" />
    </Tabs>
  );
}
