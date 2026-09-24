import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimalCircle,
  Banner,
  Compass,
  MapPaper,
  PAPER,
  PaperEdge,
  RegionIsland,
} from '@/components/collection/map';
import { Icon } from '@/components/ui/Icon';
import { DEV_UNLOCK_ALL } from '@/config/features';
import { ILLUSTRATED_ANIMALS } from '@/data/animal-images';
import { ANIMAL_REGIONS, BY_REGION, regionById } from '@/data/animal-regions';
import { ANIMALS } from '@/data/animals';
import { useDockStore } from '@/lib/stores/dock-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

/** Ile zwierząt podgląda wyspa na mapie. */
const PEEK = 4;
const COLUMNS = 3;

/**
 * Kolekcja zwierząt — papierowa mapa z regionami.
 *
 * Dwa poziomy, bo zwierząt jest 715. Jedno długie przewijanie pokazywałoby
 * dziecku głównie puste miejsca, a to zniechęca zamiast napędzać; mapa pokazuje
 * POSTĘP i daje mu kształt świata do zwiedzenia.
 *
 * Oba poziomy żyją w jednym ekranie zakładki, a nie w osobnych trasach:
 * wypchnięcie trasy poza `(tabs)` zabrałoby dolny dok, który ma zostać.
 */
export default function CollectionScreen() {
  const collection = useProfileStore((s) => s.collection);
  const discovered = useMemo(
    () => (DEV_UNLOCK_ALL ? new Set(ANIMALS.map((a) => a.id)) : new Set(collection)),
    [collection]
  );

  const [openRegion, setOpenRegion] = useState<string | null>(null);

  if (!openRegion) {
    return <CollectionMap discovered={discovered} onOpen={setOpenRegion} />;
  }

  return (
    <RegionShelf
      regionId={openRegion}
      discovered={discovered}
      onBack={() => setOpenRegion(null)}
    />
  );
}

/* ===================== Poziom 1: mapa ===================== */

function CollectionMap({
  discovered,
  onOpen,
}: {
  discovered: Set<string>;
  onOpen: (regionId: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  // Dwie wyspy w rzędzie, 14 pt marginesu z każdej strony i 10 pt przerwy.
  const islandW = (screenW - 14 * 2 - 10) / 2;
  const found = discovered.size;

  const rows = useMemo(() => {
    const out: (typeof ANIMAL_REGIONS)[] = [];
    for (let i = 0; i < ANIMAL_REGIONS.length; i += 2) {
      out.push(ANIMAL_REGIONS.slice(i, i + 2));
    }
    return out;
  }, []);

  return (
    <MapPaper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Krawędź arkusza zamiast białego nagłówka — mapa zaczyna się od razu. */}
        <View style={{ marginTop: -insets.top }}>
          <PaperEdge width={screenW} />
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 16, marginTop: -screenW / 8 }}>
          <Text
            style={{ color: '#4a3726', fontFamily: 'Gabarito-Bold', fontSize: 26 }}>
            Kolekcja zwierząt
          </Text>
          <Banner text={`${found} / ${ANIMALS.length}`} width={screenW * 0.34} />
        </View>

        <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
          {rows.map((row, ri) => (
            <View key={ri} className="flex-row" style={{ gap: 10 }}>
              {row.map((region, ci) => (
                <Island
                  key={region.id}
                  region={region}
                  discovered={discovered}
                  width={islandW}
                  // Drugą wyspę w rzędzie zsuwamy w dół — mapa ma wyglądać
                  // jak rysowany świat, a nie jak tabela.
                  offset={ci === 1 ? islandW * 0.22 : 0}
                  onPress={() => onOpen(region.id)}
                />
              ))}
              {row.length === 1 ? <View style={{ width: islandW }} /> : null}
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'flex-start', paddingLeft: 26, paddingTop: 8 }}>
          <Compass size={screenW * 0.17} />
        </View>

        {/* Dolna krawędź kończy arkusz dopiero na końcu przewijania. */}
        <PaperEdge width={screenW} bottom />
      </ScrollView>
    </MapPaper>
  );
}

function Island({
  region,
  discovered,
  width,
  offset,
  onPress,
}: {
  region: (typeof ANIMAL_REGIONS)[number];
  discovered: Set<string>;
  width: number;
  offset: number;
  onPress: () => void;
}) {
  const all = BY_REGION[region.id] ?? [];

  // Podgląd: najpierw odrzucamy zwierzęta bez rysunku, DOPIERO potem wybieramy
  // cztery. Odwrotna kolejność zostawiała wyspy puste — braliśmy ostatnio
  // odkryte i najczęściej żadne z nich nie miało jeszcze grafiki.
  const preview = useMemo(() => {
    const drawn = all.filter((a) => ILLUSTRATED_ANIMALS.has(a.id));
    const mine = drawn.filter((a) => discovered.has(a.id)).slice(0, PEEK);
    const rest = drawn.filter((a) => !discovered.has(a.id));
    return [...mine, ...rest.slice(0, PEEK - mine.length)].map((a) => ({
      id: a.id,
      discovered: discovered.has(a.id),
    }));
  }, [all, discovered]);

  const mine = all.filter((a) => discovered.has(a.id)).length;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${region.label}: ${mine} z ${all.length}`}
      style={({ pressed }) => ({
        marginTop: offset,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}>
      <RegionIsland
        patch={region.patch}
        label={region.label}
        width={width}
        preview={preview}
      />
      <Text
        className="text-center"
        style={{
          color: '#6b5133',
          fontFamily: 'Gabarito-Bold',
          fontSize: 13,
          marginTop: -width * 0.04,
        }}>
        {mine} / {all.length}
      </Text>
    </Pressable>
  );
}

/* ===================== Poziom 2: region ===================== */

function RegionShelf({
  regionId,
  discovered,
  onBack,
}: {
  regionId: string;
  discovered: Set<string>;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const region = regionById(regionId);

  // Dok przejmuje kolor dołu tej planszy i oddaje go przy wyjściu. Sprzątanie
  // w `return` jest tu istotne: bez niego zielona mapa dostałaby kolor ostatnio
  // oglądanego regionu.
  const setTint = useDockStore((st) => st.setTint);
  useEffect(() => {
    setTint(region?.dock ?? null);
    return () => setTint(null);
  }, [region, setTint]);

  const sorted = useMemo<Animal[]>(() => {
    const base = BY_REGION[regionId] ?? [];
    return [...base].sort((a, b) => {
      const da = discovered.has(a.id);
      const db = discovered.has(b.id);
      if (da !== db) return da ? -1 : 1;
      return a.name_pl.localeCompare(b.name_pl, 'pl');
    });
  }, [regionId, discovered]);

  const found = sorted.filter((a) => discovered.has(a.id)).length;
  const cell = (screenW - 14 * 2) / COLUMNS;

  const rows = useMemo(() => {
    const out: Animal[][] = [];
    for (let i = 0; i < sorted.length; i += COLUMNS) out.push(sorted.slice(i, i + COLUMNS));
    return out;
  }, [sorted]);

  return (
    <RegionBackdrop background={region?.background}>
      {/* Przyciemnienie pod nagłówkiem: biały tekst ginął na jasnym niebie. */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingHorizontal: 14,
          paddingBottom: 10,
          backgroundColor: 'rgba(28, 32, 20, 0.42)',
        }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              onBack();
            }}
            accessibilityRole="button"
            accessibilityLabel="Wróć do mapy"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
            <Icon name="arrow-left" size={20} color={UI.onLawn} strokeWidth={2.6} />
          </Pressable>

          <View className="flex-1">
            <Text
              numberOfLines={1}
              style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
              {region?.label ?? 'Kolekcja'}
            </Text>
            <Text style={{ color: UI.onLawnSoft, fontFamily: 'Lexend-Bold', fontSize: 13 }}>
              {found} / {sorted.length}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(row) => row[0]?.id ?? 'pusto'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: insets.bottom + 24,
        }}
        renderItem={({ item: row }) => (
          <View className="flex-row" style={{ marginBottom: 14 }}>
            {row.map((a) => {
              const isFound = discovered.has(a.id);
              return (
                <View key={a.id} style={{ width: cell, alignItems: 'center' }}>
                  {isFound ? (
                    <Link href={`/animal/${a.id}`} asChild>
                      <Link.AppleZoom>
                        <Pressable>
                          <AnimalCircle animalId={a.id} discovered size={cell * 0.84} />
                        </Pressable>
                      </Link.AppleZoom>
                    </Link>
                  ) : (
                    <AnimalCircle animalId={a.id} discovered={false} size={cell * 0.84} />
                  )}
                  <Text
                    numberOfLines={1}
                    className="text-center"
                    style={{
                      color: UI.onLawn,
                      fontFamily: 'Gabarito-Bold',
                      fontSize: 12,
                      marginTop: 4,
                      width: cell - 6,
                      textShadowColor: 'rgba(0,0,0,0.55)',
                      textShadowRadius: 4,
                    }}>
                    {isFound ? a.name_pl : '?????'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      />
    </RegionBackdrop>
  );
}

/** Tła regionów to te same pliki, co tła wypraw — `require` chce literałów. */
const BACKGROUNDS: Record<string, number> = {
  'bugs-and-worms': require('../../../assets/backgrounds/exp-bugs-and-worms.webp'),
  'farm-timo': require('../../../assets/backgrounds/exp-farm-timo.webp'),
  'forest-kids': require('../../../assets/backgrounds/exp-forest-kids.webp'),
  'green-jungle': require('../../../assets/backgrounds/exp-green-jungle.webp'),
  'home-pets-friends': require('../../../assets/backgrounds/exp-home-pets-friends.webp'),
  'ice-land': require('../../../assets/backgrounds/exp-ice-land.webp'),
  jumpers: require('../../../assets/backgrounds/exp-jumpers.webp'),
  'savanna-kids': require('../../../assets/backgrounds/exp-savanna-kids.webp'),
  'scary-animals': require('../../../assets/backgrounds/exp-scary-animals.webp'),
  swimmers: require('../../../assets/backgrounds/exp-swimmers.webp'),
  'water-friends': require('../../../assets/backgrounds/exp-water-friends.webp'),
};

function RegionBackdrop({
  background,
  children,
}: {
  background?: string;
  children: React.ReactNode;
}) {
  const source = background ? BACKGROUNDS[background] : undefined;
  return (
    <View className="flex-1" style={{ backgroundColor: PAPER }}>
      {source ? (
        <Image
          source={source}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          transition={0}
          accessible={false}
        />
      ) : null}
      {children}
    </View>
  );
}
