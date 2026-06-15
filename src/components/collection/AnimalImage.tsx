import { Image } from "expo-image";
import { useState } from "react";

import { animalImageFor } from "@/data/animal-images";
import { Text, View } from "@/tw";

type Props = {
	/** ID zwierzęcia (zgodne z `Animal.id`). */
	animalId: string;
	/** Emoji do fallbacku, gdy zdjęcia brak lub nie udało się załadować. */
	fallbackEmoji?: string;
	/** Rozmiar boku (kwadrat). Wymagany, gdy `fill` nie jest ustawione. */
	size?: number;
	/** Wypełnij kontener rodzica (absolute fill) zamiast użycia `size`. */
	fill?: boolean;
};

/**
 * Wyświetla zdjęcie zwierzęcia z `assets/animals/<id>.jpg`. Fallback na emoji.
 */
export function AnimalImage({
	animalId,
	fallbackEmoji,
	size,
	fill,
}: Props) {
	const [errored, setErrored] = useState(false);
	const src = animalImageFor(animalId);

	if (fill) {
		if (!src || errored) {
			return (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text style={{ fontSize: 48 }}>
						{fallbackEmoji ?? "🐾"}
					</Text>
				</View>
			);
		}
		return (
			<Image
				source={src}
				style={{
					flex: 1,
					width: "100%",
					height: "100%",
				}}
				contentFit="cover"
				onError={() => setErrored(true)}
			/>
		);
	}

	const boxSize = size ?? 56;

	if (!src || errored) {
		return (
			<View
				style={{
					width: boxSize,
					height: boxSize,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ fontSize: Math.round(boxSize * 0.7) }}>
					{fallbackEmoji ?? "🐾"}
				</Text>
			</View>
		);
	}

	return (
		<Image
			source={src}
			style={{
				width: boxSize,
				height: boxSize,
			}}
			contentFit="cover"
			onError={() => setErrored(true)}
		/>
	);
}
