import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/react-navigation/bottom-tabs/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable, Text, View } from "@/tw";

type TabSpec = {
	name: string;
	label: string;
	emoji: string;
};

// Kolejność wg ustaleń: Kolekcja, Wyprawy, Odznaki, Menu (Home).
const TABS: TabSpec[] = [
	{ name: "collection", label: "Kolekcja", emoji: "📒" },
	{ name: "expeditions", label: "Wyprawy", emoji: "🗺️" },
	{ name: "badges", label: "Odznaki", emoji: "🏅" },
	{ name: "index", label: "Menu", emoji: "🏠" },
];

function PuffyTabBar({ state, navigation }: BottomTabBarProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			className="flex-row bg-paper rounded-t-card px-3 pt-2.5"
			style={{
				paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 12,
				borderTopWidth: 1,
				borderTopColor: "#fff6cc",
			}}
		>
			{state.routes.map((route, idx) => {
				const spec = TABS.find((t) => t.name === route.name);
				if (!spec) return null;
				const focused = state.index === idx;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});
					if (!focused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				return (
					<Pressable
						key={route.key}
						accessibilityRole="button"
						accessibilityState={focused ? { selected: true } : {}}
						accessibilityLabel={spec.label}
						onPress={onPress}
						className="flex-1 items-center justify-center py-1.5"
					>
						<View
							className={
								focused
									? "items-center justify-center w-14 h-12 rounded-chip bg-brand-pale"
									: "items-center justify-center w-14 h-12"
							}
						>
							<Text style={{ fontSize: focused ? 26 : 22 }}>
								{spec.emoji}
							</Text>
						</View>
						<Text
							className={
								focused ? "text-brand-deep" : "text-ink-soft"
							}
							style={{
								fontFamily: focused
									? "Fredoka-Bold"
									: "Fredoka-Medium",
								fontSize: 11,
								marginTop: 2,
							}}
						>
							{spec.label}
						</Text>
					</Pressable>
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
			tabBar={(props) => <PuffyTabBar {...props} />}
		>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="expeditions" />
			<Tabs.Screen name="collection" />
			<Tabs.Screen name="badges" />
		</Tabs>
	);
}
