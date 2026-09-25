import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StreakCelebration } from '@/components/gamification/StreakCelebration';
import { InfoSheetProvider } from '@/components/sheet/InfoSheet';
import { useDailyCheckIn } from '@/features/gamification/useDailyCheckIn';
import { sfx } from '@/lib/audio/sfx';
import { useDockStore } from '@/lib/stores/dock-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

type TabSpec = {
  name: string;
  label: string;
  accent: Accent;
};

/**
 * Ikony doku to rysowane obiekty, nie glify kreskowe — ten sam język, co
 * ilustracja polany na Home. Dzięki temu dok czyta się jak część świata gry,
 * a nie jak systemowy pasek doklejony pod spodem.
 */
const TAB_ICONS = {
  collection: require('../../../assets/icons/tab-collection.png'),
  expeditions: require('../../../assets/icons/tab-expeditions.png'),
  badges: require('../../../assets/icons/tab-badges.png'),
  index: require('../../../assets/icons/tab-home.png'),
} as const;

// Kolejność wg ustaleń: Kolekcja, Wyprawy, Odznaki, Menu (Home).
const TABS: TabSpec[] = [
  { name: 'collection', label: 'Kolekcja', accent: 'violet' },
  { name: 'expeditions', label: 'Wyprawy', accent: 'sky' },
  { name: 'badges', label: 'Odznaki', accent: 'gold' },
  { name: 'index', label: 'Menu', accent: 'primary' },
];

function TabItem({
  spec,
  focused,
  onPress,
  fg,
}: {
  spec: TabSpec;
  focused: boolean;
  onPress: () => void;
  fg: string;
}) {
  const dark = fg !== UI.onLawn;
  const pop = useSharedValue(1);

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
            borderRadius: 16,
            // Jasna płytka zamiast przebarwiania ikony — ikony są kolorowe
            // same z siebie, więc stan aktywny niesie podkład, nie kolor.
            // Płytka aktywnej zakładki musi iść za kolorem podpisów: biała
            // rozjaśnia ciemne tło, ciemna przygasza jasne. Odwrotnie znika.
            backgroundColor: focused
              ? dark
                ? 'rgba(0, 0, 0, 0.10)'
                : 'rgba(255, 255, 255, 0.24)'
              : 'transparent',
          }}>
          <Image
            source={TAB_ICONS[spec.name as keyof typeof TAB_ICONS]}
            style={{ width: 30, height: 30, opacity: focused ? 1 : 0.72 }}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
        </View>
      </Animated.View>
      <Text
        style={{
          color: fg,
          opacity: focused ? 1 : 0.72,
          fontFamily: 'Gabarito-Bold',
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
  const tint = useDockStore((s) => s.tint);
  const setHeight = useDockStore((s) => s.setHeight);
  const insets = useSafeAreaInsets();

  return (
    <View
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      className="flex-row px-2 pt-2"
      style={{
        // Ekran, który wypełnia sobą tło, podaje własny kolor doku — jedna
        // zieleń odcinała się od jasnych plansz jak doklejony pasek.
        backgroundColor: tint?.bg ?? UI.panel,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        // Dok unosi się cieniem `e3`, tak jak chce docs/design-3.0.md —
        // wcześniej była tu ramka 2 px z UI 2.0.
        boxShadow: SHADOW.e3,
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
            sfx.play('tap-small');
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={route.key}
            spec={spec}
            focused={focused}
            onPress={onPress}
            fg={tint?.fg ?? UI.onLawn}
          />
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  // Meldunek siedzi TUTAJ, nie w `profiles.tsx`: przy powrocie do aplikacji
  // z zapamiętanym profilem ekran wyboru dziecka się nie pokazuje, więc dzień
  // by przepadł. Layout zakładek jest pierwszym miejscem, przez które
  // przechodzi każde wejście do gry.
  useDailyCheckIn();
  const celebration = useProfileStore((s) => s.streakCelebration);
  const dismiss = useProfileStore((s) => s.dismissStreakCelebration);

  return (
    <InfoSheetProvider aboveDock>
      <Tabs
        initialRouteName="index"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <AppTabBar {...props} />}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="expeditions" />
        <Tabs.Screen name="collection" />
        <Tabs.Screen name="badges" />
      </Tabs>

      <StreakCelebration
        visible={celebration !== null}
        streak={celebration?.streak ?? 0}
        bonusPaws={celebration?.bonusPaws ?? 0}
        onClose={dismiss}
      />
    </InfoSheetProvider>
  );
}
