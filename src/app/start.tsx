import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { DEV_START_SCREEN } from '@/config/features';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { useSessionStore } from '@/lib/stores/session-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const STEPS = [
  { art: require('../../assets/icons/start/think.png'), label: 'Pomyśl o zwierzęciu' },
  { art: require('../../assets/icons/start/answer.png'), label: 'Odpowiadaj Tak albo Nie' },
  { art: require('../../assets/icons/start/guess.png'), label: 'Timo zgaduje, kto to!' },
] as const;

/**
 * Ekran startowy dziecka — przy każdym uruchomieniu, jak ekran tytułowy gry.
 *
 * Wcześniej po wyborze profilu aplikacja lądowała prosto w Menu, a Timo od
 * razu zaczynał mówić, zanim dziecko cokolwiek dotknęło. Tu Timo milczy
 * i macha; dopiero „Gramy!” wpuszcza do Menu, gdzie wita się głosem. To
 * także moment, w którym rodzic oddaje telefon dziecku.
 *
 * Dwa warianty: pierwszy raz (pusta kolekcja) — trzy obrazkowe kroki gry;
 * kolejne razy — krótkie powitanie po imieniu i stan kolekcji.
 *
 * Onboarding dla rodzica (przed logowaniem) to osobna rzecz i stanie przed
 * ekranem logowania — ten ekran jest już po wyborze dziecka.
 */
export default function StartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const [groundY, setGroundY] = useState<number | null>(null);

  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const nick = useAuthStore((s) => s.profiles.find((p) => p.id === s.activeProfileId)?.nick);
  const found = useProfileStore((s) => s.collection.length);
  const markStartSeen = useSessionStore((s) => s.markStartSeen);

  const firstTime =
    DEV_START_SCREEN === 'first-time' ? true : DEV_START_SCREEN === 'returning' ? false : found === 0;

  const play = () => {
    if (!activeProfileId) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markStartSeen(activeProfileId);
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('home') }}>
      <SceneBackdrop groundY={groundY} scene="home" />

      {/* Lisek na środku ekranu, jak w Menu — ta sama scena, więc przejście
          po „Gramy!” nie przeskakuje. */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
        {/* Większy niż w Menu — tu lisek jest jedynym bohaterem ekranu. */}
        <TimoStage onGroundY={setGroundY} height={Math.round(screenW * 0.72)} />
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}>
        <View
          style={{
            backgroundColor: UI.page,
            borderRadius: 28,
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 18,
            boxShadow: `${SHADOW.e2}, ${SHADOW.rim}`,
          }}>
          {firstTime ? (
            <>
              <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
                {nick ? `Cześć, ${nick}!` : 'Cześć!'}
              </Text>
              <Text
                style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 15, marginTop: 2 }}>
                Tak gramy z Timo:
              </Text>
              {/* Kroki pionowo, jak wiersze na karcie zwierzęcia: obrazek
                  i jedno zdanie w jednej linii. W trzech wąskich kolumnach
                  podpisy łamały się w pół słowa i czytało się je na raty. */}
              <View style={{ marginTop: 10, gap: 8 }}>
                {STEPS.map((step) => (
                  <View key={step.label} className="flex-row items-center" style={{ gap: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 18,
                        backgroundColor: UI.pageSlot,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={step.art}
                        style={{ width: 38, height: 38 }}
                        contentFit="contain"
                        transition={0}
                        accessible={false}
                      />
                    </View>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{ flex: 1, color: INK, fontFamily: 'Gabarito-Bold', fontSize: 18 }}>
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text
                className="text-center"
                style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
                {nick ? `Cześć, ${nick}!` : 'Cześć!'}
              </Text>
              <Text
                className="text-center"
                style={{
                  color: UI.pageFaint,
                  fontFamily: 'Lexend',
                  fontSize: 16,
                  lineHeight: 22,
                  marginTop: 4,
                }}>
                {`Masz już ${found} ${animalsWord(found)} w kolekcji. Zgadniemy kolejne?`}
              </Text>
            </>
          )}

          <Pressable
            onPress={play}
            accessibilityRole="button"
            accessibilityLabel="Gramy!"
            style={({ pressed }) => ({
              marginTop: 16,
              paddingVertical: 17,
              borderRadius: 26,
              alignItems: 'center',
              backgroundColor: UI.fox,
              // Twardy dolny rant zamiast cienia — przycisk ma wyglądać na
              // coś, co da się wcisnąć; po wciśnięciu rant znika.
              boxShadow: pressed ? 'none' : `0px 5px 0px ${UI.foxDeep}`,
              transform: [{ translateY: pressed ? 5 : 0 }],
            })}>
            <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 24 }}>
              Gramy!
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** „1 zwierzę”, „3 zwierzęta”, „5 zwierząt”, „22 zwierzęta”. */
function animalsWord(n: number): string {
  if (n === 1) return 'zwierzę';
  const tens = n % 100;
  const units = n % 10;
  if (units >= 2 && units <= 4 && (tens < 12 || tens > 14)) return 'zwierzęta';
  return 'zwierząt';
}
