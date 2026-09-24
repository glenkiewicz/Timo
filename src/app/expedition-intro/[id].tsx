import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalImage } from '@/components/collection/AnimalImage';
import { ExpeditionIcon } from '@/components/expeditions/ExpeditionIcon';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { Bubble } from '@/components/ui/Bubble';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickExpeditionIntro, type Pick } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { UI } from '@/theme/ui';
import type { Animal } from '@/types/game';
import { Text, View } from '@/tw';

export default function ExpeditionIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader
        eyebrow="WYPRAWA Z TIMO"
        title={exp.childTitle ?? exp.title}
        icon={
          <ExpeditionIcon expeditionId={exp.id} fallbackEmoji={exp.hero_emoji} size={26} />
        }
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
      />

      {/* Timo + dymek */}
      <View className="px-4 flex-row items-end gap-2 mt-3 mb-2">
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

      {/* Etykieta nad gridem */}
      <View className="px-4 mb-2 items-center">
        <View
          className="rounded-pill px-3 py-1.5"
          style={{ backgroundColor: UI.goldPale }}>
          <Text
            style={{ color: UI.goldDeep, fontFamily: 'Gabarito-Bold', fontSize: 11 }}>
            🤫  Wybierz w głowie — nie klikaj!
          </Text>
        </View>
      </View>

      {/* Grid 3 kolumny x 6 wierszy (18 kart). Scrollowalny. */}
      <FlatList
        data={animals}
        keyExtractor={(a) => a.id}
        numColumns={3}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <InspirationCard animal={item} />}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 120,
          gap: 8,
        }}
        columnWrapperStyle={{ gap: 8 }}
      />

      {/* Sticky CTA */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: insets.bottom + 12,
        }}>
        <Button label="MAM ZWIERZĘ!" onPress={handleStart} />
      </View>
    </View>
  );
}

function InspirationCard({ animal }: { animal: Animal }) {
  // Karty NIEKLIKALNE — żadnego onPress. Dziecko ma pomyśleć, nie klikać.
  return (
    <View
      pointerEvents="none"
      className="flex-1 items-center justify-center px-2 py-2"
      style={{
        aspectRatio: 1,
        backgroundColor: UI.surface,
        borderRadius: 18,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: UI.line,
      }}>
      <AnimalImage animalId={animal.id} size={60} />
      <Text
        className="text-center"
        numberOfLines={1}
        style={{
          color: UI.text,
          fontFamily: 'Gabarito-Bold',
          fontSize: 11,
          marginTop: 4,
        }}>
        {animal.name_pl}
      </Text>
    </View>
  );
}
