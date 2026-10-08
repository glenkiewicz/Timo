import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INK } from '@/components/collection/map';
import { OUTFITS } from '@/components/timo/outfits';
import { SceneBackdrop, TimoStage, sceneBaseColor } from '@/components/timo/TimoStage';
import { BADGE_ART } from '@/data/badge-art';
import { LOCK_ART, TOOLTIP_ART } from '@/data/info-tooltips';
import { timoVoice } from '@/lib/audio/timo-voice';
import { useTimoHeight } from '@/lib/layout';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const ART = {
  think: require('../../assets/icons/start/think.png'),
  answer: require('../../assets/icons/start/answer.png'),
  guess: require('../../assets/icons/start/guess.png'),
  expeditions: require('../../assets/icons/tab-expeditions.png'),
  collection: require('../../assets/icons/tab-collection.png'),
  badges: require('../../assets/icons/tab-badges.png'),
};

type Row = { art: number; title: string; text: string };
type Page = { title: string; lead?: string; rows: Row[] };

/** Kolejność stron = kolejność kwestii `ONBOARDING_LINES` (voiceKey `onboarding.N`). */
const PAGES: Page[] = [
  {
    title: 'Poznaj Timo!',
    lead: 'Rudy lisek detektyw, który zgaduje zwierzęta. Dziecko myśli, Timo pyta — i próbuje zgadnąć.',
    rows: [],
  },
  {
    title: 'Ty myślisz, Timo zgaduje',
    rows: [
      { art: ART.think, title: 'Pomyśl o zwierzęciu', text: 'W głowie — niczego nie klikasz.' },
      { art: ART.answer, title: 'Odpowiadaj na pytania', text: 'Tak, nie, nie wiem albo to zależy.' },
      { art: ART.guess, title: 'Timo zgaduje', text: 'Zgadł? A może trzeba mu pomóc?' },
    ],
  },
  {
    title: 'Graj, jak lubisz',
    rows: [
      { art: ART.guess, title: 'Wszystkie zwierzęta', text: 'Ponad 700 zwierząt z całego świata.' },
      { art: TOOLTIP_ART.daily_streak, title: 'Wyprawa Dnia', text: 'Codziennie trzy nowe propozycje.' },
      { art: BADGE_ART.explorer_1, title: 'Wyprawy z Timo', text: '24 wyprawy — na każdą lisek ma przebranie.' },
    ],
  },
  {
    title: 'Zbieraj i odkrywaj',
    rows: [
      { art: ART.collection, title: 'Kolekcja zwierząt', text: 'Karty z ciekawostkami i mapą, gdzie żyją.' },
      { art: ART.badges, title: 'Odznaki', text: 'Za serie, odkrycia i wyprawy.' },
      { art: TOOLTIP_ART.level, title: 'Poziomy i rangi', text: 'Od Małego tropiciela po Profesora Timo.' },
    ],
  },
  {
    title: 'Dla rodzica',
    rows: [
      { art: LOCK_ART, title: 'Bez reklam i czatów', text: 'Dziecko nie rozmawia z obcymi i nic nie kupi samo.' },
      { art: TOOLTIP_ART.level, title: 'Profil dla każdego dziecka', text: 'Osobna kolekcja, odznaki i postęp.' },
      {
        art: TOOLTIP_ART.paws,
        title: 'Konto nie jest wymagane',
        text: 'Gracie od razu. Postępy zapiszesz kontem rodzica, kiedy zechcesz.',
      },
    ],
  },
];

/** Przebrania przewijane na stronie o wyprawach — co 2,4 s inne. */
const OUTFIT_TOUR = ['water_friends', 'night_animals', 'big_animals', 'green_jungle', 'ice_land'].filter(
  (id) => id in OUTFITS,
);
const WAYS_PAGE = 2;

/**
 * Onboarding — pierwsze uruchomienie, zanim pojawi się wybór dziecka.
 *
 * Timo stoi na tej samej polanie co w Menu i przy każdej stronie mówi jedną
 * kwestię, więc dziecko słucha, a rodzic czyta karty pod spodem. Na stronie
 * o wyprawach lisek zmienia przebrania. Kończy się „Zaczynamy!” → imię
 * dziecka (ekran profili). Miejsce na paywall: przed ostatnim krokiem.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const timoH = useTimoHeight(0.62);
  const markDone = useOnboardingStore((s) => s.markDone);

  const [groundY, setGroundY] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [outfitIdx, setOutfitIdx] = useState(0);
  const list = useRef<FlatList<Page>>(null);

  // Kwestia Timo do bieżącej strony — przerwana, gdy dziecko przewinie dalej.
  useEffect(() => {
    void timoVoice.playLine(`onboarding.${page}`);
  }, [page]);
  useEffect(() => () => timoVoice.stop(), []);

  useEffect(() => {
    if (page !== WAYS_PAGE || OUTFIT_TOUR.length === 0) return;
    const t = setInterval(() => setOutfitIdx((i) => (i + 1) % OUTFIT_TOUR.length), 2400);
    return () => clearInterval(t);
  }, [page]);

  const last = page === PAGES.length - 1;

  const go = (to: number) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    list.current?.scrollToOffset({ offset: to * width, animated: true });
    setPage(to);
  };

  const finish = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    timoVoice.stop();
    markDone();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBaseColor('home') }}>
      <SceneBackdrop groundY={groundY} scene="home" />

      <View className="flex-row justify-end" style={{ paddingTop: insets.top + 8, paddingHorizontal: 16 }}>
        {!last ? (
          <Pressable
            onPress={() => go(PAGES.length - 1)}
            accessibilityRole="button"
            className="rounded-pill"
            style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(28, 32, 20, 0.42)' }}>
            <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>Pomiń</Text>
          </Pressable>
        ) : (
          <View style={{ height: 37 }} />
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'center', pointerEvents: 'none' }}>
        <TimoStage
          onGroundY={setGroundY}
          height={timoH}
          outfit={page === WAYS_PAGE ? OUTFIT_TOUR[outfitIdx] : undefined}
        />
      </View>

      <FlatList
        ref={list}
        data={PAGES}
        keyExtractor={(p) => p.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 20, justifyContent: 'flex-end' }}>
            <PageCard page={item} />
          </View>
        )}
      />

      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: insets.bottom + 16 }}>
        <View className="flex-row justify-center" style={{ gap: 8, marginBottom: 14 }}>
          {PAGES.map((p, i) => (
            <View
              key={p.title}
              style={{
                width: i === page ? 22 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === page ? UI.onLawn : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={() => (last ? finish() : go(page + 1))}
          accessibilityRole="button"
          style={({ pressed }) => ({
            paddingVertical: 17,
            borderRadius: 26,
            alignItems: 'center',
            backgroundColor: UI.fox,
            boxShadow: pressed ? 'none' : `0px 5px 0px ${UI.foxDeep}`,
            transform: [{ translateY: pressed ? 5 : 0 }],
          })}>
          <Text style={{ color: '#ffffff', fontFamily: 'Gabarito-Bold', fontSize: 22 }}>
            {last ? 'Zaczynamy!' : 'Dalej'}
          </Text>
        </Pressable>

        {last ? (
          <Pressable
            onPress={() => router.push('/account')}
            accessibilityRole="button"
            style={{ alignSelf: 'center', marginTop: 12, padding: 6 }}>
            <Text style={{ color: UI.onLawn, fontFamily: 'Gabarito-Bold', fontSize: 15 }}>
              Mam już konto — zaloguj się
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function PageCard({ page }: { page: Page }) {
  return (
    <View
      style={{
        backgroundColor: UI.page,
        borderRadius: 28,
        padding: 18,
        boxShadow: `${SHADOW.e2}, ${SHADOW.rim}`,
      }}>
      <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 24 }}>{page.title}</Text>
      {page.lead ? (
        <Text style={{ color: UI.pageFaint, fontFamily: 'Lexend', fontSize: 16, lineHeight: 22, marginTop: 4 }}>
          {page.lead}
        </Text>
      ) : null}
      {page.rows.length > 0 ? (
        <View style={{ marginTop: 12, gap: 10 }}>
          {page.rows.map((r) => (
            <View key={r.title} className="flex-row items-center" style={{ gap: 12 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 18,
                  backgroundColor: UI.pageSlot,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={r.art}
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                  transition={0}
                  accessible={false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>{r.title}</Text>
                <Text style={{ color: INK, fontFamily: 'Lexend', fontSize: 14, lineHeight: 19 }}>{r.text}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
