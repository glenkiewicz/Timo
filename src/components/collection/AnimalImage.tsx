import { Image } from "expo-image";
import { useState } from "react";

import { animalImageFor } from "@/data/animal-images";
import { UI } from "@/theme/ui";
import { Text, View } from "@/tw";

type Props = {
	/** ID zwierzęcia (zgodne z `Animal.id`). */
	animalId: string;
	/** Rozmiar boku (kwadrat). Wymagany, gdy `fill` nie jest ustawione. */
	size?: number;
	/** Wypełnij kontener rodzica (absolute fill) zamiast użycia `size`. */
	fill?: boolean;
	/**
	 * Rysuj jednolitą sylwetkę zamiast portretu — nieodkryte zwierzę w kolekcji.
	 *
	 * Działa WYŁĄCZNIE dla rysunków z kanałem alfa (`ILLUSTRATED_ANIMALS`).
	 * Fotografia bez alfy zamieniłaby się po przyciemnieniu w pełny kwadrat,
	 * więc dla niej wywołujący powinien pokazać zwykły znak zapytania.
	 */
	silhouette?: boolean;
};

/**
 * Portret zwierzęcia z `assets/animals/<id>.webp`.
 *
 * Trzy stany i ŻADNEGO emoji: rysunek, obrys (zwierzę nieodkryte) albo pusto,
 * gdy grafiki jeszcze nie wygenerowaliśmy. Emoji było tu zaszłością po
 * fotografiach — mieszało systemowy krój z ilustracją i wyglądało jak usterka.
 */
export function AnimalImage({
	animalId,
	size,
	fill,
	silhouette,
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
				contentFit="contain"
				tintColor={silhouette ? UI.pageFaint : undefined}
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
