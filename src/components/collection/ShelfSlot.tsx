import { AnimalImage } from '@/components/collection/AnimalImage';
import { Pedestal } from '@/components/collection/cabin';
import { ILLUSTRATED_ANIMALS } from '@/data/animal-images';
import { View } from '@/tw';

type ShelfSlotProps = {
  animalId: string;
  discovered: boolean;
  /** Szerokość miejsca na półce; figurka i podstawka skalują się od niej. */
  width: number;
};

/**
 * Jedno miejsce na półce — figurka stojąca na drewnianej podstawce.
 *
 * Tabliczkę z nazwą rysuje `Shelf`, nie ten komponent: ma leżeć na LICU deski,
 * a nie wisieć między podstawką a półką, bo wtedy figurka wygląda, jakby stała
 * na napisie.
 *
 * Trzy stany, bez emoji: rysunek, jasny obrys (zwierzę nieodkryte) i puste
 * miejsce, gdy grafiki jeszcze nie wygenerowaliśmy. Obrys działa wyłącznie dla
 * rysunków z kanałem alfa — przyciemniona fotografia dawała czarny kwadrat.
 *
 */
export function ShelfSlot({ animalId, discovered, width }: ShelfSlotProps) {
  const illustrated = ILLUSTRATED_ANIMALS.has(animalId);
  const figure = width * 0.92;

  return (
    <View style={{ width, alignItems: 'center' }}>
      <View style={{ height: figure, width: figure, justifyContent: 'flex-end' }}>
        {illustrated ? (
          <AnimalImage animalId={animalId} fill silhouette={!discovered} />
        ) : null}
      </View>

      {/* podstawka wsuwa się pod figurkę, żeby ta na niej stała, a nie lewitowała */}
      <View style={{ marginTop: -figure * 0.1 }}>
        <Pedestal width={width * 0.78} />
      </View>

    </View>
  );
}
