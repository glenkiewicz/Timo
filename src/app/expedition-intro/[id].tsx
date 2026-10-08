import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { AnimalCarousel } from '@/components/expeditions/AnimalCarousel';
import { expeditionAccent } from '@/components/expeditions/ExpeditionCard';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
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
import { contentColumn, useContentWidth, useTimoHeight } from '@/lib/layout';
import { Pressable, Text, View } from '@/tw';

export default function ExpeditionIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenW = useContentWidth();
  const timoH = useTimoHeight(0);
  const { id } = useLocalSearchParams<{ id: string }>();
  const expeditionProgress = useProfileStore((s) => s.expeditionProgress);
  const chooseExpedition = useProfileStore((s) => s.chooseExpedition);
  const dailyChoice = useProfileStore((s) => s.dailyChoice);
  const startGame = useGameStore((s) => s.start);

  const exp = id ? EXPEDITIONS_BY_ID[id] : null;
  const [groundY, setGroundY] = useState<number | null>(null);

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

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('game', exp.id) }}>
      {/* Ta sama scena co w grze tej wyprawy, ustawiona linią gruntu pod łapy
          liska — Timo stoi na plaży, a nie wisi nad nią jak naklejka. */}
      <SceneBackdrop groundY={groundY} scene="game" expeditionId={exp.id} />

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

      {/* Duży lisek na środku. Dymka nie ma — wstęp i tak mówi głosem,
          a dymek zasłaniał scenę i dublował to, co słychać. Lisek i karuzela
          siedzą razem na środku wolnego miejsca, przycisk na dole. */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: screenW * 0.62 }}>
          <TimoStage
            onGroundY={setGroundY}
            outfit={exp.id}
            height={Math.max(Math.round(Math.min(screenW * 0.62, 280)), timoH)}
          />
        </View>
      </View>

      {/* Podpowiedź na kremowej pigułce — bez emoji. */}
      <View style={{ alignItems: 'center', marginTop: 14 }}>
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

      <AnimalCarousel animals={animals} />
      </View>

      {/* Przycisk pod karuzelą, nie na niej — wcześniej zasłaniał zwierzęta. */}
      <View style={{ ...contentColumn, paddingHorizontal: 16, paddingBottom: insets.bottom + 12, paddingTop: 6 }}>
        <Plate label="Mam zwierzę!" accent={accent} onPress={handleStart} />
      </View>
    </View>
  );
}
