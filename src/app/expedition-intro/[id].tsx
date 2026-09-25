import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FlatList, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCircle, INK } from '@/components/collection/map';
import { expeditionAccent } from '@/components/expeditions/ExpeditionCard';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { sceneBaseColor, sceneSource } from '@/components/timo/TimoStage';
import { Bubble } from '@/components/ui/Bubble';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Plate } from '@/components/ui/Plate';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickExpeditionIntro, type Pick } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { SHADOW, UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

export default function ExpeditionIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const startGame = useGameStore((s) => s.start);

  const exp = id ? EXPEDITIONS_BY_ID[id] : null;

  // Stabilne intro Timo na jedną wizytę ekranu (nie re-roll przy każdym renderze).
  const introPick = useMemo<Pick | null>(
    () => (exp ? pickExpeditionIntro(exp.id) : null),
    [exp],
  );

  // Autoplay intra po mount + stop przy unmount.
  useEffect(() => {
    if (!introPick) return;
    timoVoice.playLine(introPick.voiceKey);
    return () => {
      timoVoice.stop();
    };
  }, [introPick]);

  const animals: Animal[] = useMemo(() => {
    if (!exp?.inspirationRoster) return [];
    return exp.inspirationRoster
      .map((aid) => ANIMALS_BY_ID[aid])
      .filter((a): a is Animal => !!a);
  }, [exp]);

  if (!exp || exp.mode !== 'guided') {
    return (
      <View className="flex-1 bg-canvas items-center justify-center px-6">
        <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>
          Nie znaleziono wyprawy.
        </Text>
        <View className="mt-4" style={{ alignSelf: 'stretch' }}>
          <Button
            label="Wróć"
            size="md"
            onPress={() => router.replace('/(tabs)/expeditions')}
          />
        </View>
      </View>
    );
  }

  const handleStart = () => {
    if (dailyChoice && dailyChoice.expedition_ids.includes(exp.id)) {
      chooseExpedition(exp.id);
    }
    const prog = expeditionProgress[exp.id];
    startGame({
      expeditionId: exp.id,
      expeditionMode: 'guided',
      excludeDiscovered: prog?.discovered ?? [],
    });
    router.replace('/game');
  };

  const accent = expeditionAccent(exp.id);
  const cell = (screenW - GUTTER * 2) / COLUMNS;

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('home', exp.id) }}>
      {/* Tło tej wyprawy — to samo, na którym zaraz toczy się gra. Wcześniej
          był tu biały ekran z paskiem nagłówka, jak z innej aplikacji. */}
      <Image
        source={sceneSource('home', exp.id)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />

      {/* Nagłówek jak na półce krainy: przyciemnienie pod białym napisem. */}
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
              router.canGoBack() ? router.back() : router.replace('/(tabs)');
            }}
            accessibilityRole="button"
            accessibilityLabel="Wróć"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
            <Icon name="arrow-left" size={20} color={UI.onLawn} strokeWidth={2.6} />
          </Pressable>
          <View className="flex-1">
            <Text style={{ color: UI.onLawnSoft, fontFamily: 'Lexend-Bold', fontSize: 12 }}>
              Wyprawa z Timo
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
              {exp.childTitle ?? exp.title}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={rows(animals)}
        keyExtractor={(row) => row[0]?.id ?? 'pusto'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: insets.bottom + 110 }}
        ListHeaderComponent={
          <View>
            {/* Timo + dymek */}
            <View className="flex-row items-end gap-2" style={{ marginTop: 12 }}>
              <TimoCharacter size={86} />
              <View className="flex-1 pb-2">
                <Bubble eyebrow="TIMO MÓWI" tail="bottom-left">
                  <Text
                    style={{
                      color: UI.text,
                      fontFamily: 'Lexend-Bold',
                      fontSize: 14,
                      lineHeight: 19,
                    }}>
                    {introPick?.text ?? ''}
                  </Text>
                </Bubble>
              </View>
            </View>

            {/* Podpowiedź na kremowej pigułce — bez emoji, które odstawało
                od ilustracji. */}
            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 14 }}>
              <View
                style={{
                  backgroundColor: UI.page,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  boxShadow: `${SHADOW.e0}, ${SHADOW.rim}`,
                }}>
                <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 14 }}>
                  Wybierz w głowie — nie klikaj!
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item: row }) => (
          <View className="flex-row" style={{ marginBottom: 12 }}>
            {row.map((a) => (
              <InspirationCard key={a.id} animal={a} width={cell} />
            ))}
          </View>
        )}
      />

      {/* Stały przycisk w kolorze wyprawy — ta sama płyta, co „Ruszamy!”. */}
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 12 }}>
        <Plate label="Mam zwierzę!" accent={accent} onPress={handleStart} />
      </View>
    </View>
  );
}

const COLUMNS = 3;
const GUTTER = 14;

function rows(list: Animal[]): Animal[][] {
  const out: Animal[][] = [];
  for (let i = 0; i < list.length; i += COLUMNS) out.push(list.slice(i, i + COLUMNS));
  return out;
}

function InspirationCard({ animal, width }: { animal: Animal; width: number }) {
  // Karty NIEKLIKALNE — żadnego onPress. Dziecko ma pomyśleć, nie klikać.
  // Ta sama tarcza i biały podpis, co na półce krainy w kolekcji.
  return (
    <View pointerEvents="none" style={{ width, alignItems: 'center' }}>
      <AnimalCircle animalId={animal.id} discovered size={width * 0.8} />
      <Text
        className="text-center"
        numberOfLines={1}
        style={{
          color: UI.onLawn,
          fontFamily: 'Gabarito-Bold',
          fontSize: 12,
          marginTop: 4,
          width: width - 6,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowRadius: 4,
        }}>
        {animal.name_pl}
      </Text>
    </View>
  );
}
