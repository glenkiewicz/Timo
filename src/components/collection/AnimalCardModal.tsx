import { useEffect } from "react";
import { Modal, useWindowDimensions } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { Pressable, Text, View } from "@/tw";
import type { Animal } from "@/types/game";

import { AnimalCard } from "./AnimalCard";

type Props = {
	visible: boolean;
	animal: Animal | null;
	isNewDiscovery?: boolean;
	onClose: () => void;
};

export function AnimalCardModal({
	visible,
	animal,
	isNewDiscovery,
	onClose,
}: Props) {
	const enter = useSharedValue(0);
	const { height: screenH } = useWindowDimensions();

	useEffect(() => {
		if (visible) {
			enter.value = withSpring(1, { damping: 14, stiffness: 220 });
		} else {
			enter.value = withTiming(0, { duration: 120 });
		}
	}, [visible, enter]);

	const cardStyle = useAnimatedStyle(() => ({
		opacity: enter.value,
		transform: [{ scale: 0.88 + enter.value * 0.12 }],
	}));

	const backdropStyle = useAnimatedStyle(() => ({
		opacity: enter.value * 0.6,
	}));

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<View className="flex-1 items-center justify-center px-5">
				<Pressable
					onPress={onClose}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				>
					<Animated.View
						style={[
							{ flex: 1, backgroundColor: "#000" },
							backdropStyle,
						]}
					/>
				</Pressable>

				<Animated.View
					style={[
						{
							backgroundColor: "#fff1df",
							borderRadius: 22,
							borderWidth: 2,
							borderColor: "#fff6cc",
							paddingHorizontal: 20,
							paddingTop: 18,
							paddingBottom: 14,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 10 },
							shadowOpacity: 0.22,
							shadowRadius: 24,
							elevation: 12,
							maxWidth: 360,
							width: "100%",
							maxHeight: screenH * 0.85,
						},
						cardStyle,
					]}
				>
					{animal ? (
						<AnimalCard
							animal={animal}
							isNewDiscovery={isNewDiscovery}
						/>
					) : null}

					<Pressable
						onPress={onClose}
						className="bg-brand rounded-puffy mt-3 py-3 items-center"
					>
						<Text
							className="text-paper"
							style={{ fontFamily: "Fredoka-Bold", fontSize: 16 }}
						>
							Zamknij
						</Text>
					</Pressable>
				</Animated.View>
			</View>
		</Modal>
	);
}
