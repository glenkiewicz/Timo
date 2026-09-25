import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimalCircle,
  RegionBackdrop,
  RegionIsland,
  Signpost,
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
  const [page, setPage] = useState(0);

  // Krok przesuwania jest WĘŻSZY niż ekran, więc sąsiednie krainy wystają przy
  // krawędziach. Bez tego podglądu nic nie mówiłoby dziecku, że da się jechać
  // w bok — `pagingEnabled` na pełną szerokość chowa sąsiadów całkowicie.
  const step = screenW * 0.84;
  const islandW = step - 24;
  const side = (screenW - step) / 2;

  const found = discovered.size;

  return (
    <View className="flex-1" style={{ backgroundColor: UI.page }}>
      {/* Tło jak w wyprawach, tylko wyprane: krainy są mocne kolorystycznie,
          więc podkład ma ustąpić. Środek kadru jest celowo pusty — tamtędy
          jedzie karuzela. */}
      <Image
        source={require('../../../assets/backgrounds/collection.webp')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />
      <View className="flex-1" style={{ paddingTop: insets.top + 8 }}>
      {/* Sam tytuł, wyśrodkowany. Tytuł i licznik w jednej linii biły się
          o uwagę i rozjeżdżały wizualnie — licznik zszedł pod kropki, gdzie
          domyka nawigację zamiast walczyć z nagłówkiem. */}
      <Text
        className="text-center"
        style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>
        Kolekcja zwierząt
      </Text>

      {/* Krainy siedzą w pionie na środku wolnej przestrzeni — `flex: 1`
          rozkłada ją równo nad i pod karuzelą, więc układ trzyma się na każdej
          wysokości ekranu bez wpisywanych na sztywno odstępów. */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FlatList
          data={ANIMAL_REGIONS}
          keyExtractor={(r) => r.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={step}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: side }}
          style={{ flexGrow: 0 }}
          onMomentumScrollEnd={(e) =>
            setPage(Math.round(e.nativeEvent.contentOffset.x / step))
          }
          renderItem={({ item }) => (
            <View style={{ width: step, alignItems: 'center' }}>
              <Island
                region={item}
                discovered={discovered}
                width={islandW}
                onPress={() => onOpen(item.id)}
              />
            </View>
          )}
        />

        {/* Kropki mówią, ile jeszcze krain zostało — przy jednej widocznej
            nic innego tego nie niesie. */}
        <View
          className="flex-row justify-center items-center"
          style={{ gap: 6, marginTop: 18 }}>
          {ANIMAL_REGIONS.map((r, i) => (
            <View
              key={r.id}
              style={{
                width: i === page ? 9 : 6,
                height: i === page ? 9 : 6,
                borderRadius: 5,
                backgroundColor: i === page ? UI.textSoft : UI.line,
              }}
            />
          ))}
        </View>

        {/* Licznik całej kolekcji: pasek niesie postęp od razu, bez czytania
            liczb — a dla pięciolatka to jedyna czytelna forma. */}
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <View
            style={{
              width: screenW * 0.52,
              height: 10,
              borderRadius: 5,
              backgroundColor: UI.line,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: `${(found / ANIMALS.length) * 100}%`,
                height: '100%',
                borderRadius: 5,
                backgroundColor: UI.panel,
              }}
            />
          </View>
          <Text
            style={{
              color: UI.textSoft,
              fontFamily: 'Gabarito-Bold',
              fontSize: 14,
              marginTop: 6,
            }}>
            {found} z {ANIMALS.length} zwierząt
          </Text>
        </View>
      </View>
      </View>
    </View>
  );
}

function Island({
  region,
  discovered,
  width,
  onPress,
}: {
  region: (typeof ANIMAL_REGIONS)[number];
  discovered: Set<string>;
  width: number;
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
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <RegionIsland patch={region.patch} width={width} preview={preview} />

      {/* Tabliczka POD wyspą. W środku przecinała ją w poprzek i zasłaniała
          dolną połowę górnych zwierząt. */}
      <View style={{ alignItems: 'center', marginTop: -width * 0.06 }}>
        <Signpost label={region.label} width={width * 0.78} />
        <Text
          style={{
            color: UI.textSoft,
            fontFamily: 'Gabarito-Bold',
            fontSize: 14,
            marginTop: 6,
          }}>
          {mine} / {all.length}
        </Text>
      </View>
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
