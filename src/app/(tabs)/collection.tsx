import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalImage } from '@/components/collection/AnimalImage';
import {
  Cabinet as CabinetFrame,
  CabinWall,
  Lantern,
  Plant,
  Plate,
  ShelfBoard,
} from '@/components/collection/cabin';
import { ShelfSlot } from '@/components/collection/ShelfSlot';
import { ExpeditionIcon } from '@/components/expeditions/ExpeditionIcon';
import { FilterChip } from '@/components/ui/FilterChip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DEV_UNLOCK_ALL } from '@/config/features';
import { ILLUSTRATED_ANIMALS } from '@/data/animal-images';
import { ANIMAL_GROUPS, GROUPED, groupById } from '@/data/animal-groups';
import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS, EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';

const COLUMNS = 3;
const SLOT = 86;
/** Ile figurek podgląda gablota na ekranie pokoju. */
const PEEK = 3;

/**
 * Kolekcja zwierząt — chatka Timo z gablotami i półkami.
 *
 * Dwa poziomy, bo zwierząt jest 715. Jedno długie przewijanie pokazywałoby
 * dziecku głównie puste miejsca, a to zniechęca zamiast napędzać; pokój
 * z siedmioma gablotami pokazuje POSTĘP i mieści się na jednym ekranie.
 *
 * Podział idzie po klasie zwierzęcia, nie po wyprawach: rostery wypraw guided
 * obejmują 244 z 715 zwierząt, więc dwie trzecie zbioru nie miałoby gdzie
 * stanąć. Wyprawy zostają jako FILTR wewnątrz gabloty — to one wiążą kolekcję
 * z rozgrywką.
 *
 * Oba poziomy żyją w jednym ekranie zakładki, a nie w osobnych trasach:
 * wypchnięcie trasy poza `(tabs)` zabrałoby dolne menu, które ma zostać.
 */
export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const collection = useProfileStore((s) => s.collection);
  const collectionSet = useMemo(
    () => (DEV_UNLOCK_ALL ? new Set(ANIMALS.map((a) => a.id)) : new Set(collection)),
    [collection]
  );

  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [activeExpId, setActiveExpId] = useState<string | null>(null);

  if (!openGroup) {
    return (
      <CollectionRoom
        discovered={collectionSet}
        onOpen={(id) => {
          setOpenGroup(id);
          setActiveExpId(null);
        }}
        onBack={() => router.navigate('/(tabs)')}
      />
    );
  }

  return (
    <GroupShelves
      groupId={openGroup}
      discovered={collectionSet}
      activeExpId={activeExpId}
      onFilter={setActiveExpId}
      onBack={() => setOpenGroup(null)}
      bottomInset={insets.bottom}
    />
  );
}

/* ===================== Poziom 1: pokój z gablotami ===================== */

function CollectionRoom({
  discovered,
  onOpen,
  onBack,
}: {
  discovered: Set<string>;
  onOpen: (groupId: string) => void;
  onBack: () => void;
}) {
  const { width: screenW } = useWindowDimensions();
  // dwie gabloty w rzędzie, 14 pt marginesu z każdej strony i 12 pt przerwy
  const cabinetW = (screenW - 14 * 2 - 12) / 2;

  return (
    <CabinWall>
      <ScreenHeader eyebrow="KSIĘGA TIMO" title="Kolekcja zwierząt" onBack={onBack} />
      {/* dekoracje leżą NAD listą, ale pod nagłówkiem — stąd ręczne `top` */}
      <Lantern width={58} top={92} right={6} />
      <Plant width={76} bottom={0} left={-22} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: 28 }}>
        {rows(ANIMAL_GROUPS, 2).map((row, ri) => (
          <View key={ri} className="flex-row" style={{ gap: 12 }}>
            {row.map((g) => (
              <Cabinet
                key={g.id}
                group={g}
                discovered={discovered}
                width={cabinetW}
                onPress={() => onOpen(g.id)}
              />
            ))}
            {row.length === 1 ? <View style={{ width: cabinetW }} /> : null}
          </View>
        ))}
      </ScrollView>
    </CabinWall>
  );
}

function Cabinet({
  group,
  discovered,
  width,
  onPress,
}: {
  group: (typeof ANIMAL_GROUPS)[number];
  discovered: Set<string>;
  width: number;
  onPress: () => void;
}) {
  const all = GROUPED[group.id];
  const found = all.filter((a) => discovered.has(a.id));

  // Podgląd: najpierw odrzucamy zwierzęta bez grafiki, DOPIERO potem wybieramy
  // trzy. Odwrotna kolejność zostawiała gabloty puste — braliśmy trzy ostatnio
  // odkryte i najczęściej żadne z nich nie miało jeszcze rysunku.
  const peek = useMemo(() => {
    const drawn = all.filter((a) => ILLUSTRATED_ANIMALS.has(a.id));
    const mine = drawn.filter((a) => discovered.has(a.id)).slice(-PEEK);
    const rest = drawn.filter((a) => !discovered.has(a.id));
    return [...mine, ...rest.slice(0, PEEK - mine.length)];
  }, [all, discovered]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${group.label}: ${found.length} z ${all.length}`}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <CabinetFrame width={width}>
          {Array.from({ length: PEEK }).map((_, i) => {
            const a = peek[i];
            return (
              <View key={i} style={{ width: width * 0.2, height: '100%' }}>
                {a ? (
                  <AnimalImage animalId={a.id} fill silhouette={!discovered.has(a.id)} />
                ) : null}
              </View>
            );
          })}
        </CabinetFrame>

        <Plate
          label={group.label}
          counter={{ value: found.length, total: all.length }}
          width={width * 0.92}
          fontSize={12}
        />
      </View>
    </Pressable>
  );
}

/* ===================== Poziom 2: półki jednej grupy ===================== */

function GroupShelves({
  groupId,
  discovered,
  activeExpId,
  onFilter,
  onBack,
  bottomInset,
}: {
  groupId: string;
  discovered: Set<string>;
  activeExpId: string | null;
  onFilter: (id: string | null) => void;
  onBack: () => void;
  bottomInset: number;
}) {
  const group = groupById(groupId);

  const sorted = useMemo<Animal[]>(() => {
    let base = GROUPED[groupId] ?? [];
    if (activeExpId) {
      const exp = EXPEDITIONS_BY_ID[activeExpId];
      const roster = new Set(exp?.roster ?? exp?.inspirationRoster ?? []);
      base = base.filter((a) => roster.has(a.id));
    }
    return [...base].sort((a, b) => {
      const da = discovered.has(a.id);
      const db = discovered.has(b.id);
      if (da !== db) return da ? -1 : 1;
      return a.name_pl.localeCompare(b.name_pl, 'pl');
    });
  }, [groupId, activeExpId, discovered]);

  const found = sorted.filter((a) => discovered.has(a.id)).length;

  const { width: screenW } = useWindowDimensions();
  const slotW = (screenW - 14 * 2 - 8 * (COLUMNS - 1)) / COLUMNS;

  return (
    <CabinWall>
      <ScreenHeader
        eyebrow="KSIĘGA TIMO"
        title={group?.label ?? 'Kolekcja'}
        onBack={onBack}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          style={{ marginHorizontal: -16, paddingHorizontal: 16, marginTop: 8 }}>
          <FilterChip
            label="Wszystkie"
            emoji="🐾"
            active={activeExpId === null}
            onPress={() => onFilter(null)}
          />
          {EXPEDITIONS.map((e) => (
            <FilterChip
              key={e.id}
              label={e.childTitle ?? e.title}
              icon={
                <ExpeditionIcon
                  expeditionId={e.id}
                  fallbackEmoji={e.hero_emoji}
                  size={18}
                />
              }
              active={activeExpId === e.id}
              onPress={() => onFilter(e.id)}
            />
          ))}
        </ScrollView>
      </ScreenHeader>

      <FlatList
        data={rows(sorted, COLUMNS)}
        keyExtractor={(row) => row[0]?.id ?? 'pusto'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: bottomInset + 24,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: 12, alignItems: 'center' }}>
            <Plate
              label={group?.label ?? ''}
              counter={{ value: found, total: sorted.length }}
              width={screenW * 0.62}
            />
          </View>
        }
        ListEmptyComponent={
          <Text
            className="text-center"
            style={{
              color: UI.page,
              fontFamily: 'Lexend-Bold',
              fontSize: 14,
              paddingVertical: 28,
            }}>
            Ta wyprawa nie ma zwierząt z tej gabloty.
          </Text>
        }
        renderItem={({ item: row }) => (
          <Shelf row={row} discovered={discovered} slotW={slotW} />
        )}
      />
    </CabinWall>
  );
}

function Shelf({
  row,
  discovered,
  slotW,
}: {
  row: Animal[];
  discovered: Set<string>;
  slotW: number;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View className="flex-row items-end" style={{ gap: 8 }}>
        {row.map((a) => {
          const isFound = discovered.has(a.id);
          const slot = <ShelfSlot animalId={a.id} discovered={isFound} width={slotW} />;
          return isFound ? (
            <Link key={a.id} href={`/animal/${a.id}`} asChild>
              <Link.AppleZoom>
                <Pressable>{slot}</Pressable>
              </Link.AppleZoom>
            </Link>
          ) : (
            <View key={a.id}>{slot}</View>
          );
        })}
      </View>

      {/* deska wsuwa się pod podstawki, więc figurki na niej stoją */}
      <View style={{ marginTop: -6 }}>
        <ShelfBoard />
      </View>

      {/* tabliczki leżą na LICU deski — stąd ujemny margines do góry */}
      <View className="flex-row" style={{ gap: 8, marginTop: -slotW * 0.16 }}>
        {row.map((a) => (
          <View key={a.id} style={{ width: slotW, alignItems: 'center' }}>
            {discovered.has(a.id) ? (
              <Plate label={a.name_pl} width={slotW * 0.96} fontSize={9} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Dzieli listę na wiersze po `n` — równe kolumny robi `flex: 1` w wierszu. */
function rows<T>(items: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += n) out.push(items.slice(i, i + n));
  return out;
}
