import type { ReactNode } from 'react';
import { ImageBackground } from 'react-native';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Elementy papierowej mapy kolekcji — generowane grafiki, nie rysowane kształty.
 *
 * Mapa jest SKŁADANA z kawałków, a nie jednym obrazkiem: papier to kafel
 * powtarzany w pionie, a regiony to osobne wyspy z kanałem alfa kładzione na
 * nim. Jeden wielki rysunek nie dałby się przewijać ani przestawiać, a regionów
 * jest jedenaście.
 */
const ART = {
  paper: require('../../../assets/map/paper.webp'),
  paperTop: require('../../../assets/map/paper-top.webp'),
  paperBottom: require('../../../assets/map/paper-bottom.webp'),
  signpost: require('../../../assets/map/signpost.webp'),
  banner: require('../../../assets/map/banner.webp'),
  compass: require('../../../assets/map/compass.webp'),
  frameFound: require('../../../assets/map/frame-found.webp'),
  frameLocked: require('../../../assets/map/frame-locked.webp'),
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
  edge: 2.7,
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

/** Kolor papieru — tło pod kaflem, żeby przy przewijaniu nie błyskało pustką. */
export const PAPER = '#e2cda8';

/**
 * Tło z papieru, KAFLOWANE w pionie.
 *
 * `ImageBackground` z `resizeMode="repeat"` jest tu jedynym wyjściem: expo-image
 * nie umie powtarzać, a mapa jest dłuższa niż jakikolwiek pojedynczy obrazek.
 * Kafel domknęliśmy na bezszwowy rachunkiem (`scripts/seamless.py`), więc styk
 * przy przewijaniu się nie rzuca w oczy.
 */
export function MapPaper({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={ART.paper}
      resizeMode="repeat"
      style={{ flex: 1, backgroundColor: PAPER }}>
      {children}
    </ImageBackground>
  );
}

/** Postrzępiona krawędź arkusza. `bottom` odwraca ją na dolną. */
export function PaperEdge({ width, bottom }: { width: number; bottom?: boolean }) {
  return (
    <Image
      source={bottom ? ART.paperBottom : ART.paperTop}
      style={{ width, height: width / RATIO.edge }}
      contentFit="fill"
      pointerEvents="none"
      transition={0}
      accessible={false}
    />
  );
}

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

export function Compass({ size }: { size: number }) {
  return (
    <Image
      source={ART.compass}
      style={{ width: size, height: size }}
      contentFit="contain"
      pointerEvents="none"
      transition={0}
      accessible={false}
    />
  );
}

/**
 * Kółko ze zwierzęciem.
 *
 * Kolejność warstw różni się dla dwóch stanów i to nie przypadek: ramka
 * odkrytego jest PIERŚCIENIEM z przezroczystym środkiem, więc leży na wierzchu
 * i przycina portret. Ramka nieodkrytego ma kryjące beżowe wypełnienie, więc
 * musi iść POD obrys — inaczej zasłoniłaby go w całości.
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
  const frame = (
    <Image
      source={discovered ? ART.frameFound : ART.frameLocked}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      contentFit="fill"
      transition={0}
      accessible={false}
    />
  );

  return (
    <View style={{ width: size, height: size }}>
      {discovered ? null : frame}
      <View
        style={{
          position: 'absolute',
          top: size * 0.16,
          left: size * 0.16,
          right: size * 0.16,
          bottom: size * 0.16,
          overflow: 'hidden',
          borderRadius: size / 2,
        }}>
        <AnimalImage animalId={animalId} fill silhouette={!discovered} />
      </View>
      {discovered ? frame : null}
    </View>
  );
}

/** Cztery rogi wyspy — tabliczka siedzi na środku, więc kółka omijają go. */
const SPOTS = [
  { x: 0.24, y: 0.20 },
  { x: 0.76, y: 0.20 },
  { x: 0.24, y: 0.78 },
  { x: 0.76, y: 0.78 },
];

/** Wyspa regionu: rysunek terenu, cztery kółka i tabliczka z nazwą. */
export function RegionIsland({
  patch,
  label,
  width,
  preview,
}: {
  patch: string;
  label: string;
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

      <View style={{ position: 'absolute', left: width * 0.14, top: height * 0.5 - width * 0.18 }}>
        <Signpost label={label} width={width * 0.72} />
      </View>
    </View>
  );
}

