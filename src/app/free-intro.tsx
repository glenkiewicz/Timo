import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { AnimalCarousel } from '@/components/expeditions/AnimalCarousel';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Icon } from '@/components/ui/Icon';
import { Plate } from '@/components/ui/Plate';
import { FREE_ANIMAL_IDS } from '@/config/free-tier';
import { ANIMALS } from '@/data/animals';
import { pickExpeditionIntro } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { contentColumn, useContentWidth, useTimoHeight } from '@/lib/layout';
import { useGameStore } from '@/lib/stores/game-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

/**
 * Gra swobodna w wersji darmowej — przed rundą dziecko widzi, z jakich
 * zwierząt Timo zgaduje (dom, farma, Afryka). Bez tego pomyślałoby o lwie
 * morskim, Timo by przegrał, a dziecko poczułoby się oszukane. Układ jak
 * ekran wyprawy, żeby gra wyglądała znajomo.
 */
export default function FreeIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenW = useContentWidth();
  const timoH = useTimoHeight(0);
  const startGame = useGameStore((s) => s.start);
  const [groundY, setGroundY] = useState<number | null>(null);

  const animals = useMemo(() => ANIMALS.filter((a) => FREE_ANIMAL_IDS.has(a.id)), []);
  const intro = useMemo(() => pickExpeditionIntro('generic'), []);

  useEffect(() => {
    void timoVoice.playLine(intro.voiceKey);
    return () => timoVoice.stop();
  }, [intro]);

  const back = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    router.canGoBack() ? router.back() : router.replace('/(tabs)');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('game') }}>
      <SceneBackdrop groundY={groundY} scene="game" />

      <View
        style={{
          paddingTop: insets.top + 6,
          paddingHorizontal: 14,
          paddingBottom: 10,
          backgroundColor: 'rgba(28, 32, 20, 0.42)',
        }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Wróć"
            className="w-10 h-10 items-center justify-center rounded-pill"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
            <Icon name="arrow-left" size={20} color={UI.onLawn} strokeWidth={2.6} />
          </Pressable>
          <View className="flex-1">
            <Text style={{ color: UI.onLawnSoft, fontFamily: 'Lexend-Bold', fontSize: 12 }}>Zagraj z Timo</Text>
            <Text numberOfLines={1} style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
              Dom, farma i Afryka
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: screenW * 0.62 }}>
            <TimoStage onGroundY={setGroundY} height={Math.max(Math.round(Math.min(screenW * 0.62, 280)), timoH)} />
          </View>
        </View>

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
              Pomyśl o jednym z tych zwierząt!
            </Text>
          </View>
        </View>

        <AnimalCarousel animals={animals} />
      </View>

      <View style={{ ...contentColumn, paddingHorizontal: 16, paddingBottom: insets.bottom + 8, paddingTop: 6 }}>
        <Plate
          label="Mam zwierzę!"
          accent="fox"
          onPress={() => {
            startGame();
            router.replace('/game');
          }}
        />
        <Pressable
          onPress={() => router.push('/paywall')}
          accessibilityRole="button"
          style={{ alignSelf: 'center', padding: 8, marginTop: 4 }}>
          <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>
            Odkryj wszystkie 700 zwierząt
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
