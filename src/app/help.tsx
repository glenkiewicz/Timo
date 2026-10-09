import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import * as Linking from 'expo-linking';
import { Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ACCENT_FOR, GLYPH, LABEL, type AnswerType } from '@/components/buttons/AnswerCard';
import { INK } from '@/components/collection/map';
import { ParentalGate } from '@/components/paywall/ParentalGate';
import { LINKS } from '@/config/links';
import { Icon } from '@/components/ui/Icon';
import { FREE_ANIMAL_IDS, FREE_EXPEDITIONS, FREE_REGIONS } from '@/config/free-tier';
import { regionById } from '@/data/animal-regions';
import { BADGE_ART } from '@/data/badge-art';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import { LOCK_ART, TOOLTIP_ART } from '@/data/info-tooltips';
import { MAX_QUESTIONS } from '@/features/game/guessing-engine';
import { MAX_LEVEL, RANKS } from '@/features/gamification/titles';
import { ACCENT, SHADOW, UI } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { contentColumn } from '@/lib/layout';
import { Image } from '@/tw/image';

const ART = {
  think: require('../../assets/icons/start/think.png'),
  answer: require('../../assets/icons/start/answer.png'),
  guess: require('../../assets/icons/start/guess.png'),
  expeditions: require('../../assets/icons/tab-expeditions.png'),
  collection: require('../../assets/icons/tab-collection.png'),
  badges: require('../../assets/icons/tab-badges.png'),
  soundOn: require('../../assets/icons/info/sound_on.png'),
};

const GUTTER = 16;

/** Z konfiguracji wersji darmowej — tekst nie rozjedzie się z blokadami. */
const FREE_REGION_NAMES = FREE_REGIONS.map((id) => regionById(id)?.label ?? id).join(', ');
const FREE_EXPEDITION_NAMES = FREE_EXPEDITIONS.map(
  (id) => EXPEDITIONS_BY_ID[id]?.childTitle ?? EXPEDITIONS_BY_ID[id]?.title ?? id,
).join(', ');

/**
 * Pełna instrukcja gry — z Menu, przyciskiem „?” obok głośnika.
 *
 * Ten sam język co karta zwierzęcia: wyprane tło, nagłówki sekcji wprost na
 * tle i osobne wiersze z obrazkiem w plamie po lewej. Krótkie zdania, bo czyta
 * je rodzic na głos albo dziecko, które dopiero uczy się czytać; liczby
 * (pytania, poziomy, rangi) brane wprost z kodu gry, żeby instrukcja nie
 * rozjechała się z zasadami.
 */
export default function HelpScreen() {
  const router = useRouter();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: UI.page }}>
      <Image
        source={require('../../assets/backgrounds/collection.webp')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={0}
        accessible={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...contentColumn, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 28 }}>
        <View className="flex-row items-center" style={{ paddingHorizontal: GUTTER, gap: 12 }}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              router.canGoBack() ? router.back() : router.replace('/(tabs)');
            }}
            accessibilityRole="button"
            accessibilityLabel="Wróć"
            className="w-11 h-11 items-center justify-center rounded-pill"
            style={{ backgroundColor: UI.page, boxShadow: `${SHADOW.e0}, ${SHADOW.rim}` }}>
            <Icon name="arrow-left" size={22} color={INK} strokeWidth={2.6} />
          </Pressable>
          <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>
            Jak grać z Timo
          </Text>
        </View>

        <Text
          style={{
            color: UI.textSoft,
            fontFamily: 'Lexend',
            fontSize: 15,
            lineHeight: 21,
            marginTop: 10,
            paddingHorizontal: GUTTER + 4,
          }}>
          Timo to lisek detektyw. Ty myślisz o zwierzęciu, a on zadaje pytania i próbuje zgadnąć,
          o kim myślisz.
        </Text>

        <SectionHeader title="Jedna runda" />
        <Row art={ART.think} tint="gold" title="1. Pomyśl o zwierzęciu">
          Nikomu nie mów i niczego nie klikaj — po prostu wybierz zwierzę w głowie.
        </Row>
        <Row art={ART.answer} tint="sky" title="2. Odpowiadaj na pytania">
          Timo pyta, a Ty stukasz odpowiedź. Zadaje najwyżej {MAX_QUESTIONS} pytań.
        </Row>
        <Row art={ART.guess} tint="violet" title="3. Timo zgaduje">
          Gdy jest pewny, mówi, kto to. Zgadł? Stuknij „Tak”. Nie zgadł? Stuknij „Nie” — będzie
          pytał dalej.
        </Row>
        <Row art={BADGE_ART.first_loss} tint="fox" title="4. Gdy Timo się podda">
          Pokaż mu swoje zwierzę na liście. Wtedy też trafia ono do Twojej kolekcji.
        </Row>

        <SectionHeader title="Przyciski odpowiedzi" />
        <AnswerRow answer="yes">gdy to prawda o Twoim zwierzęciu.</AnswerRow>
        <AnswerRow answer="no">gdy to nieprawda.</AnswerRow>
        <AnswerRow answer="idk">gdy nie wiesz — to nic złego, Timo zapyta o coś innego.</AnswerRow>
        <AnswerRow answer="hard">
          gdy bywa różnie — na przykład niektóre koty są małe, a niektóre duże.
        </AnswerRow>
        <Tip>
          Pomyłka nic nie psuje. Timo pamięta wszystkie odpowiedzi i i tak próbuje dojść do
          Twojego zwierzęcia.
        </Tip>

        <SectionHeader title="Wyprawy" />
        <Row art={ART.expeditions} tint="sky" title="Wyprawa Dnia">
          Codziennie Timo proponuje 3 wyprawy — wybierz jedną na Menu. Zgadujecie wtedy tylko
          zwierzęta z tej wyprawy.
        </Row>
        <Row art={BADGE_ART.explorer_1} tint="primary" title="Wyprawa z Timo">
          Timo pokazuje zwierzęta z wyprawy. Przewiń je strzałkami, wybierz w głowie jedno i stuknij
          „Mam zwierzę!”.
        </Row>
        <Row art={LOCK_ART} tint="violet" title="Wyprawy z kłódką">
          Są w pełnej wersji. Jedna z nich codziennie trafia do Wyprawy Dnia za darmo — szukaj
          plakietki „Dziś gratis”.
        </Row>

        <SectionHeader title="Nagrody" />
        <Row art={TOOLTIP_ART.paws} tint="fox" title="Tropy">
          Główna nagroda za każdą rundę. Więcej dostajesz, gdy rzadko mówisz „nie wiem” i gdy
          odkrywasz nowe zwierzę.
        </Row>
        <Row art={TOOLTIP_ART.xp} tint="gold" title="Doświadczenie i poziom">
          XP podnosi Twój poziom — jest ich {MAX_LEVEL}. Co 7 poziomów dostajesz nową rangę: od{' '}
          {RANKS[0]} po {RANKS[RANKS.length - 1]}.
        </Row>
        <Row art={TOOLTIP_ART.streak} tint="danger" title="Seria rund">
          Rundy jedna po drugiej. Od 3 z rzędu każda kolejna daje dodatkowe tropy.
        </Row>
        <Row art={TOOLTIP_ART.daily_streak} tint="primary" title="Dni z Timo">
          Zajrzyj do Timo każdego dnia. Za 7, 14 i 30 dni z rzędu czekają dodatkowe tropy.
        </Row>

        <SectionHeader title="Kolekcja i odznaki" />
        <Row art={ART.collection} tint="violet" title="Kolekcja">
          Każde zwierzę z rundy trafia do kolekcji — podzielonej na krainy świata. Stuknij
          zwierzę, żeby zobaczyć jego kartę i ciekawostki.
        </Row>
        <Row art={ART.badges} tint="gold" title="Odznaki">
          Zdobywasz je za pierwsze razy, serie, kolekcję i wyprawy. Stuknij odznakę, żeby
          przeczytać, za co jest.
        </Row>

        <SectionHeader title="Wersja darmowa i pełna" />
        <Row art={ART.guess} tint="primary" title="Za darmo">
          {FREE_REGION_NAMES} — razem {FREE_ANIMAL_IDS.size} zwierząt do zgadywania i trzy wyprawy:{' '}
          {FREE_EXPEDITION_NAMES}. Przed grą Timo pokazuje, o jakich zwierzętach można pomyśleć.
        </Row>
        <Row art={TOOLTIP_ART.daily_streak} tint="sky" title="Codziennie gratis">
          W Wyprawie Dnia są dwie darmowe wyprawy i jedna z pełnej wersji — na ten jeden dzień za
          darmo.
        </Row>
        <Row art={ART.collection} tint="fox" title="Pełna wersja">
          Ponad 700 zwierząt, wszystkie 24 wyprawy i cała kolekcja. Jedna subskrypcja dla wszystkich
          dzieci w rodzinie: miesięczna z 3 dniami za darmo albo roczna.
        </Row>
        <Row art={LOCK_ART} tint="violet" title="Zakupy tylko dla dorosłych">
          Przed zakupem pojawia się pytanie, na które odpowie tylko dorosły. Subskrypcję anulujesz
          w każdej chwili w ustawieniach App Store.
        </Row>

        <SectionHeader title="Dla rodzica" />
        <Row art={ART.soundOn} tint="sky" title="Dźwięk">
          Głośnik w prawym górnym rogu Menu wycisza głos Timo i wszystkie dźwięki.
        </Row>
        <Row art={TOOLTIP_ART.level} tint="primary" title="Konta i profile">
          Konto nie jest wymagane — gra działa od razu. Kontem rodzica zapiszesz postępy i zagrasz
          na innym urządzeniu. Każde dziecko ma własny profil z osobną kolekcją i odznakami.
        </Row>

        {/* Polityka prywatności musi być dostępna w aplikacji (wytyczna 5.1.1);
            linki wyprowadzają poza aplikację, więc za bramką rodzicielską. */}
        {LINKS.privacy || LINKS.terms || LINKS.support ? (
          <View className="flex-row flex-wrap justify-center" style={{ gap: 18, marginTop: 14 }}>
            {(
              [
                ['Polityka prywatności', LINKS.privacy],
                ['Regulamin', LINKS.terms],
                ['Pomoc i kontakt', LINKS.support],
              ] as const
            ).map(([label, url]) =>
              url ? (
                <Pressable key={label} onPress={() => setPendingUrl(url)} accessibilityRole="link" style={{ padding: 6 }}>
                  <Text style={{ color: UI.text, fontFamily: 'Lexend-Bold', fontSize: 14, textDecorationLine: 'underline' }}>
                    {label}
                  </Text>
                </Pressable>
              ) : null,
            )}
          </View>
        ) : null}
      </ScrollView>
      <ParentalGate
        visible={pendingUrl !== null}
        onCancel={() => setPendingUrl(null)}
        onPass={() => {
          const url = pendingUrl;
          setPendingUrl(null);
          if (url) void Linking.openURL(url);
        }}
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View
      className="flex-row items-center"
      style={{ marginHorizontal: GUTTER + 6, marginTop: 24, marginBottom: 10, gap: 12 }}>
      <Text style={{ color: UI.text, fontFamily: 'Gabarito-Bold', fontSize: 19 }}>{title}</Text>
      <View style={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: UI.lineDeep }} />
    </View>
  );
}

const CARD = {
  marginHorizontal: GUTTER,
  marginBottom: 10,
  borderRadius: 26,
  backgroundColor: UI.page,
  boxShadow: `${SHADOW.e1}, ${SHADOW.rim}`,
} as const;

const BLOB = 58;

function Row({
  art,
  tint,
  title,
  children,
}: {
  art: number;
  tint: keyof typeof ACCENT;
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="flex-row items-center" style={[CARD, { padding: 12, paddingRight: 16, gap: 14 }]}>
      <View
        style={{
          width: BLOB,
          height: BLOB,
          borderRadius: 22,
          backgroundColor: ACCENT[tint].pale,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={art}
          style={{ width: BLOB * 0.8, height: BLOB * 0.8 }}
          contentFit="contain"
          transition={0}
          accessible={false}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 17 }}>{title}</Text>
        <Text style={{ color: INK, fontFamily: 'Lexend', fontSize: 14, lineHeight: 20, marginTop: 2 }}>
          {children}
        </Text>
      </View>
    </View>
  );
}

/** Wiersz z miniaturą przycisku odpowiedzi — ten sam kolor i znak co w grze. */
function AnswerRow({ answer, children }: { answer: AnswerType; children: ReactNode }) {
  const a = ACCENT[ACCENT_FOR[answer]];
  return (
    <View className="flex-row items-center" style={[CARD, { padding: 12, paddingRight: 16, gap: 14 }]}>
      <View
        style={{
          width: BLOB,
          height: BLOB,
          borderRadius: BLOB / 2,
          backgroundColor: a.pale,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: a.deep, fontFamily: 'Gabarito-Bold', fontSize: 26 }}>{GLYPH[answer]}</Text>
      </View>
      <Text style={{ flex: 1, color: INK, fontFamily: 'Lexend', fontSize: 15, lineHeight: 21 }}>
        <Text style={{ fontFamily: 'Gabarito-Bold', fontSize: 17 }}>„{LABEL[answer]}” </Text>
        {children}
      </Text>
    </View>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        marginHorizontal: GUTTER,
        marginTop: 2,
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: UI.goldPale,
      }}>
      <Text style={{ color: UI.goldDeep, fontFamily: 'Lexend-Bold', fontSize: 14, lineHeight: 20 }}>
        {children}
      </Text>
    </View>
  );
}
