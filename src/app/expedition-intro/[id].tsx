import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PuffyButton } from '@/components/buttons/PuffyButton';
import { AnimalImage } from '@/components/collection/AnimalImage';
import { SpeechBubble } from '@/components/timo/SpeechBubble';
import { TimoCharacter } from '@/components/timo/TimoCharacter';
import { ANIMALS_BY_ID } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { pickExpeditionIntro, type Pick } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useGameStore } from '@/lib/stores/game-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import type { Animal } from '@/types/game';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

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
      <View className="flex-1 bg-bg items-center justify-center px-6">
        <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
          Nie znaleziono wyprawy.
        </Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/expeditions')}
          className="mt-4 bg-brand rounded-chip px-4 py-2">
          <Text className="text-paper" style={{ fontFamily: 'Fredoka-Bold' }}>
            Wróć
          </Text>
        </Pressable>
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
    <View className="flex-1 bg-bg">
      <Image
        source={require('../../../assets/backgrounds/home-bg.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        contentFit="cover"
      />

      {/* Top bar */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            className="w-10 h-10 rounded-full bg-paper items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text className="text-ink" style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
              ←
            </Text>
          </Pressable>

          <View className="items-center flex-1 px-3">
            <Text
              className="text-brand-deep"
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 11, letterSpacing: 1.2 }}>
              WYPRAWA Z TIMO
            </Text>
            <Text
              className="text-ink"
              numberOfLines={1}
              style={{ fontFamily: 'Fredoka-Bold', fontSize: 18 }}>
              {exp.hero_emoji}  {exp.childTitle ?? exp.title}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Timo + dymek */}
      <View className="px-4 flex-row items-end gap-3 mb-2">
        <TimoCharacter size={90} />
        <View className="flex-1 pb-2">
          <SpeechBubble eyebrow="TIMO MÓWI">
            <Text className="text-ink" style={{ fontFamily: 'Nunito-Bold', fontSize: 14 }}>
              {introPick?.text ?? ''}
            </Text>
          </SpeechBubble>
        </View>
      </View>

      {/* Etykieta nad gridem */}
      <View className="px-4 mb-2 items-center">
        <View
          className="bg-paper rounded-chip px-3 py-1.5"
          style={{
            borderWidth: 1.5,
            borderColor: '#fff6cc',
          }}>
          <Text
            className="text-ink"
            style={{ fontFamily: 'Fredoka-Bold', fontSize: 11 }}>
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
        <PuffyButton
          label="Mam zwierzę!"
          variant="success"
          size="lg"
          onPress={handleStart}
        />
      </View>
    </View>
  );
}

function InspirationCard({ animal }: { animal: Animal }) {
  // Karty NIEKLIKALNE — żadnego onPress. Dziecko ma pomyśleć, nie klikać.
  return (
    <View
      pointerEvents="none"
      className="flex-1 rounded-card bg-paper items-center justify-center px-2 py-2"
      style={{
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#fff6cc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
      }}>
      <AnimalImage animalId={animal.id} fallbackEmoji={animal.emoji} size={60} />
      <Text
        className="text-ink text-center"
        numberOfLines={1}
        style={{
          fontFamily: 'Fredoka-Bold',
          fontSize: 11,
          marginTop: 4,
        }}>
        {animal.name_pl}
      </Text>
    </View>
  );
}
