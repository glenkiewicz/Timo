import type { ReactNode } from 'react';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Elementy ekranu kolekcji — generowane grafiki, nie rysowane kształty.
 *
 * Każda kraina to osobna wyspa z kanałem alfa, a nie wycinek jednego dużego
 * obrazka: tylko tak da się je przestawiać, dokładać i przewijać pojedynczo.
 *
 * Papierowa mapa w tle wypadła — kafel pergaminu, postrzępione krawędzie i róża
 * wiatrów siedzą w 841dbf6, gdyby miały wrócić. Wyspy zostały, bo broniły się
 * same.
 */
const ART = {
  signpost: require('../../../assets/map/signpost.webp'),
  banner: require('../../../assets/map/banner.webp'),
  slot: require('../../../assets/map/slot.webp'),
} as const;

/** Wyspy regionów — `require` musi dostać literał, więc mapujemy je ręcznie. */
const PATCHES: Record<string, number> = {
  arctic: require('../../../assets/map/patch-arctic.webp'),
  australia: require('../../../assets/map/patch-australia.webp'),
  farm: require('../../../assets/map/patch-farm.webp'),
  forest: require('../../../assets/map/patch-forest.webp'),
  jungle: require('../../../assets/map/patch-jungle.webp'),
  meadow: require('../../../assets/map/patch-meadow.webp'),
  mountain: require('../../../assets/map/patch-mountain.webp'),
  ocean: require('../../../assets/map/patch-ocean.webp'),
  river: require('../../../assets/map/patch-river.webp'),
  savanna: require('../../../assets/map/patch-savanna.webp'),
};

/**
 * Proporcje assetów, odczytane z plików po przycięciu do zawartości.
 *
 * Model rysuje każdy element w ramce 16:9 z pustym marginesem, więc proporcje
 * PLIKU nie mówiły nic o proporcjach rysunku. `scripts/matte-map-kit.py` docina
 * je do widocznej treści i dopiero te liczby są prawdziwe.
 */
const RATIO = {
  signpost: 2.003,
  banner: 2.967,
} as const;

/** Wyspy mają różne kształty — kwadrat by je zniekształcił. */
const PATCH_RATIO: Record<string, number> = {
  arctic: 1.118,
  australia: 1.236,
  farm: 1.202,
  forest: 1.083,
  jungle: 1.046,
  meadow: 1.17,
  mountain: 1.205,
  ocean: 1.292,
  river: 1.098,
  savanna: 1.212,
};

/** Drewniana tabliczka z nazwą regionu. */
export function Signpost({ label, width }: { label: string; width: number }) {
  const height = width / RATIO.signpost;
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ART.signpost}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />
      <Text
        numberOfLines={1}
        style={{
          color: '#4a3726',
          fontFamily: 'Gabarito-Bold',
          fontSize: Math.max(11, Math.round(width * 0.085)),
          paddingHorizontal: width * 0.16,
        }}>
        {label}
      </Text>
    </View>
  );
}

/** Zwój z licznikiem postępu. */
export function Banner({ text, width }: { text: string; width: number }) {
  const height = width / RATIO.banner;
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ART.banner}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />
      <Text
        numberOfLines={1}
        style={{
          color: '#4a3726',
          fontFamily: 'Gabarito-Bold',
          fontSize: Math.round(width * 0.13),
        }}>
        {text}
      </Text>
    </View>
  );
}

/**
 * Kółko ze zwierzęciem — TA SAMA tarcza pod odkrytym i nieodkrytym.
 *
 * Odkryte miało wcześniej kremowy pierścień i czytało się jak osobna grafika
 * doklejona do rysunku, zamiast jak miejsce w kolekcji. Wspólny beżowy krążek
 * z kreskowanym obrysem spina siatkę w całość, a stan niesie sama zawartość:
 * kolorowy rysunek albo jego obrys. Przy okazji znika różnica w kolejności
 * warstw — tarcza zawsze leży pod spodem.
 */
export function AnimalCircle({
  animalId,
  discovered,
  size,
}: {
  animalId: string;
  discovered: boolean;
  size: number;
}) {
  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={ART.slot}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.14,
          left: size * 0.14,
          right: size * 0.14,
          bottom: size * 0.14,
          overflow: 'hidden',
          borderRadius: size / 2,
        }}>
        <AnimalImage animalId={animalId} fill silhouette={!discovered} />
      </View>
    </View>
  );
}

/**
 * Cztery rogi wyspy. Kółka mogą teraz siedzieć bliżej środka w pionie, bo
 * tabliczka zeszła pod wyspę — wcześniej biegła przez środek i zasłaniała
 * dolną połowę górnych zwierząt.
 */
const SPOTS = [
  { x: 0.22, y: 0.22 },
  { x: 0.78, y: 0.22 },
  { x: 0.22, y: 0.76 },
  { x: 0.78, y: 0.76 },
];

/**
 * Wyspa krainy: rysunek terenu i cztery kółka podglądu.
 *
 * Nazwy tu nie ma celowo — tabliczka biegła przez środek wyspy i zasłaniała
 * zwierzęta. Rysuje ją wywołujący, POD wyspą.
 */
export function RegionIsland({
  patch,
  width,
  preview,
}: {
  patch: string;
  width: number;
  /** Do czterech zwierząt na podgląd; krótsza lista zostawia wolne miejsca. */
  preview: { id: string; discovered: boolean }[];
}) {
  const height = width / (PATCH_RATIO[patch] ?? 1.15);
  const circle = width * 0.29;

  return (
    <View style={{ width, height }}>
      <Image
        source={PATCHES[patch] ?? PATCHES.meadow}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />

      {preview.slice(0, SPOTS.length).map((a, i) => (
        <View
          key={a.id}
          style={{
            position: 'absolute',
            left: width * SPOTS[i].x - circle / 2,
            top: height * SPOTS[i].y - circle / 2,
          }}>
          <AnimalCircle animalId={a.id} discovered={a.discovered} size={circle} />
        </View>
      ))}

    </View>
  );
}

