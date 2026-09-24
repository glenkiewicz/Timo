import type { ReactNode } from 'react';

import { UI } from '@/theme/ui';
import { Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Elementy chatki Timo — generowane grafiki, nie rysowane prostokąty.
 *
 * Pierwsza wersja kolekcji składała półki z kolorowych `View`-ów i wyglądała
 * jak szkic zamiast jak wybrany projekt. Deska, gablota, podstawka i tabliczka
 * są teraz osobnymi assetami z kanałem alfa (`assets/ui/`), a ekran tylko je
 * układa.
 */
const ART = {
  wall: require('../../../assets/ui/wall.webp'),
  shelf: require('../../../assets/ui/shelf.webp'),
  cabinet: require('../../../assets/ui/cabinet.webp'),
  pedestal: require('../../../assets/ui/pedestal.webp'),
  plate: require('../../../assets/ui/plate.webp'),
  lantern: require('../../../assets/ui/lantern.webp'),
  plant: require('../../../assets/ui/plant.webp'),
} as const;

/** Proporcje assetów — trzymamy je tu, żeby nie rozjechały się po ekranach. */
const RATIO = {
  shelf: 828 / 82,
  cabinet: 512 / 436,
  pedestal: 512 / 237,
  plate: 828 / 169,
  lantern: 512 / 1217,
  plant: 512 / 698,
} as const;

/** Ściana z desek — tło całego ekranu kolekcji. */
export function CabinWall({ children }: { children: ReactNode }) {
  return (
    <View className="flex-1" style={{ backgroundColor: UI.wood }}>
      <Image
        source={ART.wall}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        pointerEvents="none"
        transition={0}
        accessible={false}
      />
      {children}
    </View>
  );
}

/** Mosiężna tabliczka z napisem — rozciąga się na szerokość rodzica. */
export function Plate({
  label,
  counter,
  width,
  fontSize = 14,
}: {
  label: string;
  counter?: { value: number; total: number };
  width?: number;
  fontSize?: number;
}) {
  const text = counter ? `${label} ${counter.value} / ${counter.total}`.trim() : label;
  const w = width ?? 0;

  return (
    <View
      style={
        w
          ? { width: w, height: w / RATIO.plate, alignItems: 'center', justifyContent: 'center' }
          : { alignSelf: 'stretch', aspectRatio: RATIO.plate, alignItems: 'center', justifyContent: 'center' }
      }>
      <Image
        source={ART.plate}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />
      <Text
        numberOfLines={1}
        style={{
          color: UI.brassDeep,
          fontFamily: 'Gabarito-Bold',
          fontSize,
          paddingHorizontal: 10,
        }}>
        {text}
      </Text>
    </View>
  );
}

/** Deska półki — kładziona pod rzędem figurek. */
export function ShelfBoard({ width }: { width?: number }) {
  return (
    <Image
      source={ART.shelf}
      style={
        width
          ? { width, height: width / RATIO.shelf }
          : { alignSelf: 'stretch', aspectRatio: RATIO.shelf }
      }
      contentFit="fill"
      transition={0}
      accessible={false}
    />
  );
}

/** Okrągła podstawka pod figurkę. */
export function Pedestal({ width }: { width: number }) {
  return (
    <Image
      source={ART.pedestal}
      style={{ width, height: width / RATIO.pedestal }}
      contentFit="fill"
      transition={0}
      accessible={false}
    />
  );
}

/**
 * Gablota z szybą. `children` lądują WEWNĄTRZ, na środkowej półeczce.
 *
 * Współrzędne wnętrza są odczytane z grafiki i podane ułamkiem jej wysokości,
 * więc trzymają się przy każdej szerokości kafla.
 */
export function Cabinet({ width, children }: { width: number; children: ReactNode }) {
  const height = width / RATIO.cabinet;

  return (
    <View style={{ width, height }}>
      <Image
        source={ART.cabinet}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="fill"
        transition={0}
        accessible={false}
      />
      <View
        className="flex-row items-end justify-evenly"
        style={{
          position: 'absolute',
          left: width * 0.14,
          right: width * 0.14,
          bottom: height * 0.30,
          height: height * 0.34,
        }}>
        {children}
      </View>
    </View>
  );
}

/** Dekoracje — wiszący lampion i doniczka. */
export function Lantern({ width, ...pos }: { width: number; top?: number; right?: number }) {
  return (
    <Image
      source={ART.lantern}
      style={{ position: 'absolute', width, height: width / RATIO.lantern, ...pos }}
      contentFit="contain"
      pointerEvents="none"
      transition={0}
      accessible={false}
    />
  );
}

export function Plant({ width, ...pos }: { width: number; bottom?: number; left?: number }) {
  return (
    <Image
      source={ART.plant}
      style={{ position: 'absolute', width, height: width / RATIO.plant, ...pos }}
      contentFit="contain"
      pointerEvents="none"
      transition={0}
      accessible={false}
    />
  );
}
