import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { Icon } from '@/components/ui/Icon';
import { Plate } from '@/components/ui/Plate';
import { pickTiredLine } from '@/data/timo-lines';
import { timoVoice } from '@/lib/audio/timo-voice';
import { contentColumn, useContentWidth, useTimoHeight } from '@/lib/layout';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';

/**
 * Wersja darmowa: dziś już wszystkie rundy „Zagraj z Timo” (FREE_DAILY_ROUNDS).
 *
 * Zastępuje dawny ekran z karuzelą 99 zwierząt przed każdą grą. Timo nie
 * „blokuje”, tylko jest zmęczony i zaprasza na wyprawy, które dalej są
 * otwarte. Druga droga to pełna wersja — zakup i tak stoi za bramką
 * rodzicielską.
 */
export default function FreeLimitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenW = useContentWidth();
  const timoH = useTimoHeight(0);
  const [groundY, setGroundY] = useState<number | null>(null);

  const line = useMemo(() => pickTiredLine(), []);

  useEffect(() => {
    void timoVoice.playLine(line.voiceKey);
    return () => timoVoice.stop();
  }, [line]);

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
        }}>
        <Pressable
          onPress={back}
          accessibilityRole="button"
          accessibilityLabel="Wróć"
          className="w-10 h-10 items-center justify-center rounded-pill"
          style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
          <Icon name="arrow-left" size={20} color={UI.onLawn} strokeWidth={2.6} />
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: screenW * 0.62 }}>
            <TimoStage onGroundY={setGroundY} height={Math.max(Math.round(Math.min(screenW * 0.62, 280)), timoH)} />
          </View>
        </View>

        <View style={{ ...contentColumn, paddingHorizontal: 20, marginTop: 14 }}>
          <View
            style={{
              backgroundColor: UI.page,
              borderRadius: 28,
              paddingHorizontal: 18,
              paddingVertical: 16,
              boxShadow: `${SHADOW.e2}, ${SHADOW.rim}`,
            }}>
            <Text className="text-center" style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
              Timo odpoczywa
            </Text>
            <Text
              className="text-center"
              style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 16, lineHeight: 22, marginTop: 6 }}>
              {line.text}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ ...contentColumn, paddingHorizontal: 16, paddingBottom: insets.bottom + 8, paddingTop: 6 }}>
        <Plate label="Ruszamy na wyprawę!" accent="fox" onPress={() => router.replace('/(tabs)/expeditions')} />
        <View className="flex-row items-center" style={{ gap: 10, marginVertical: 12, paddingHorizontal: 24 }}>
          <View style={{ flex: 1, height: 1.5, backgroundColor: UI.onLawnSoft, opacity: 0.6 }} />
          <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>lub</Text>
          <View style={{ flex: 1, height: 1.5, backgroundColor: UI.onLawnSoft, opacity: 0.6 }} />
        </View>
        {/* Kategoria Kids: sam zakup stoi za bramką rodzicielską w Paywall. */}
        <Plate label="Kup pełną wersję!" accent="gold" onPress={() => router.push('/paywall')} />
      </View>
    </View>
  );
}
