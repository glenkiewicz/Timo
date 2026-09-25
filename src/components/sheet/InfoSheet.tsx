import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { sfx, type SfxName } from '@/lib/audio/sfx';
import { useDockStore, type DockTint } from '@/lib/stores/dock-store';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

export type SheetContent = {
  title: string;
  description: string;
  /** Ilustracja wystająca nad krawędź panelu. */
  art?: number;
  /**
   * Pokaż ilustrację jako sylwetkę — nieodkryte zwierzę i niezdobyta
   * odznaka. Ta sama sylwetka, co na tarczy: panel mówi „jeszcze nie masz”,
   * ale nie zdradza, co to.
   */
  silhouette?: boolean;
  /** Napis na przycisku. „Super!” pasuje do zdobytych rzeczy, nie do zamkniętych. */
  button?: string;
  /** Dźwięk otwarcia; zamknięte rzeczy mają stłumione „bum” zamiast „szuu”. */
  sound?: SfxName;
  /** Kolor panelu — ma pasować do miejsca, z którego go otwarto. */
  accent: Accent;
};

const OpenContext = createContext<(content: SheetContent) => void>(() => {});

/** Otwiera wysuwany panel najbliższego `InfoSheetProvider`. */
export function useInfoSheet() {
  return useContext(OpenContext);
}

/**
 * Wysuwany panel z opisem — zamiast wyskakującego okienka na środku ekranu.
 *
 * Wzór z Fincha: kolorowy panel wjeżdża od dołu, ilustracja wystaje nad jego
 * krawędź, tytuł siedzi na naklejce, a reszta ekranu przygasa. Na zakładkach
 * panel kończy się NAD dokiem i dok przejmuje jego kolor, więc oba czytają się
 * jak jedna płyta. Białe okienko na środku ekranu było ostatnim elementem,
 * który wyglądał jak systemowy dialog, a nie część świata gry.
 *
 * Provider stoi w dwóch miejscach: w układzie zakładek (`aboveDock`) i w
 * korzeniu dla ekranów bez doku (gra, wynik). Najbliższy wygrywa.
 */
export function InfoSheetProvider({
  aboveDock = false,
  children,
}: {
  aboveDock?: boolean;
  children: ReactNode;
}) {
  const [content, setContent] = useState<SheetContent | null>(null);
  const open = useCallback((c: SheetContent) => setContent(c), []);

  // Zmiana ekranu zamyka panel — inaczej opis odznaki jechał za dzieckiem
  // na Home, bo provider zakładek przeżywa przełączanie zakładek.
  const pathname = usePathname();
  useEffect(() => {
    setContent(null);
  }, [pathname]);

  return (
    <OpenContext.Provider value={open}>
      {children}
      {content ? (
        <InfoSheet content={content} aboveDock={aboveDock} onClosed={() => setContent(null)} />
      ) : null}
    </OpenContext.Provider>
  );
}

const ART = 116;
const OPEN_MS = 280;
const CLOSE_MS = 200;

function InfoSheet({
  content,
  aboveDock,
  onClosed,
}: {
  content: SheetContent;
  aboveDock: boolean;
  onClosed: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const dockHeight = useDockStore((s) => s.height);
  const a = ACCENT[content.accent];

  // Panel wyjeżdża spod krawędzi; póki nie znamy jego wysokości, startuje
  // z odległości całego ekranu — i tak jest wtedy niewidoczny.
  const progress = useSharedValue(0);
  const panelH = useSharedValue(screenH);
  const closing = useRef(false);

  useEffect(() => {
    sfx.play(content.sound ?? 'sheet-open');
    progress.value = withTiming(1, { duration: OPEN_MS, easing: Easing.out(Easing.cubic) });
    // Dźwięk i wjazd tylko przy otwarciu — treść nie zmienia się w trakcie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Dok przejmuje kolor panelu na czas jego życia i oddaje poprzedni — półka
  // krainy też barwi dok i nie może go stracić przez otwarcie opisu.
  useEffect(() => {
    if (!aboveDock) return;
    const { tint: prev, setTint } = useDockStore.getState();
    const mine: DockTint = { bg: a.base, fg: '#ffffff' };
    setTint(mine);
    return () => {
      if (useDockStore.getState().tint === mine) setTint(prev);
    };
  }, [aboveDock, a.base]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    sfx.play('sheet-close');
    progress.value = withTiming(0, { duration: CLOSE_MS, easing: Easing.in(Easing.cubic) }, (done) => {
      if (done) runOnJS(onClosed)();
    });
  };

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value * 0.45 }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * (panelH.value + ART) }],
  }));

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: aboveDock ? dockHeight : 0,
      }}>
      <Pressable
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Zamknij"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Animated.View style={[{ flex: 1, backgroundColor: '#000' }, scrimStyle]} />
      </Pressable>

      <Animated.View
        onLayout={(e) => {
          panelH.value = e.nativeEvent.layout.height;
        }}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: a.base,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: ART * 0.5 + 14,
            paddingHorizontal: 20,
            paddingBottom: aboveDock ? 20 : insets.bottom + 16,
            alignItems: 'center',
          },
          panelStyle,
        ]}>
        {content.art ? (
          <Image
            source={content.art}
            style={{ position: 'absolute', top: -ART * 0.5, width: ART, height: ART }}
            tintColor={content.silhouette ? UI.pageFaint : undefined}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
        ) : null}

        <Tape text={content.title} edge={a.deep} />

        <View
          style={{
            alignSelf: 'stretch',
            backgroundColor: UI.surface,
            borderRadius: 26,
            paddingHorizontal: 20,
            paddingVertical: 18,
            marginTop: 18,
          }}>
          <Text
            className="text-center"
            style={{ color: UI.text, fontFamily: 'Lexend', fontSize: 16, lineHeight: 23 }}>
            {content.description}
          </Text>
        </View>

        <Pressable
          onPress={close}
          accessibilityRole="button"
          style={({ pressed }) => ({
            alignSelf: 'stretch',
            marginTop: 12,
            paddingVertical: 15,
            borderRadius: 26,
            alignItems: 'center',
            backgroundColor: a.deep,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}>
          <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 17 }}>
            {content.button ?? 'Super!'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/**
 * Naklejka z tytułem — kremowy pasek z przerywaną ramką, lekko przekrzywiony,
 * jak taśma w Finchu. Krem zamiast żółci Fincha, bo żółć ginęła na złotym
 * panelu odznak; krem trzyma kontrast na każdym kolorze.
 */
function Tape({ text, edge }: { text: string; edge: string }) {
  return (
    <View
      style={{
        backgroundColor: UI.page,
        paddingHorizontal: 8,
        paddingVertical: 6,
        transform: [{ rotate: '-1.5deg' }],
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.12)',
      }}>
      <View
        style={{
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: edge,
          paddingHorizontal: 18,
          paddingVertical: 6,
        }}>
        <Text
          className="text-center"
          style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 20 }}>
          {text}
        </Text>
      </View>
    </View>
  );
}
