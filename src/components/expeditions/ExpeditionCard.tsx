import { INK, PaperCard, SlotDisc } from '@/components/collection/map';
import { Plate } from '@/components/ui/Plate';
import { EXPEDITION_ICONS } from '@/data/expedition-icons';
import type { Expedition } from '@/data/expeditions';
import { LOCK_ART, TOOLTIP_ART } from '@/data/info-tooltips';
import { ACCENT, UI, type Accent } from '@/theme/ui';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

/**
 * Wyprawa na pergaminie — karta Wyprawy Dnia na Home, kafle „wybierz jedną"
 * i lista na zakładce Wyprawy. Jeden komponent, żeby wyprawa wyglądała tak
 * samo, skąd by się na nią nie patrzyło.
 *
 * Wcześniej Home miał ciemnozielony panel, a lista białe karty — oba z UI 3.0,
 * ostatnie duże elementy sprzed pergaminowych tarcz i pigułek.
 */

/**
 * Kolor wyprawy — niesie przycisk i kropki postępu, więc dziecko widzi, że to
 * „ta niebieska wyprawa", zanim przeczyta tytuł. Dobrany do tematu. Bez złotego:
 * biały napis na złotej płytce jest nieczytelny.
 */
const EXPEDITION_ACCENT: Record<string, Accent> = {
  water_friends: 'sky',
  swimmers: 'sky',
  water_giants: 'sky',
  ice_land: 'sky',
  flyers: 'sky',
  farm_timo: 'fox',
  home_pets_friends: 'fox',
  furry: 'fox',
  small_animals: 'fox',
  monkey_friends: 'fox',
  savanna_kids: 'fox',
  green_jungle: 'primary',
  forest_kids: 'primary',
  bugs_and_worms: 'primary',
  jumpers: 'primary',
  shelled: 'primary',
  feathered: 'primary',
  night_animals: 'violet',
  colorful: 'violet',
  long_nose: 'violet',
  striped_spotted: 'violet',
  big_animals: 'danger',
  scary_animals: 'danger',
  dinos_myths: 'danger',
};

export function expeditionAccent(id: string): Accent {
  return EXPEDITION_ACCENT[id] ?? 'sky';
}

/**
 * Ilustracja wyprawy na tarczy. Wyprawy bez rysunku (ukryte flagą wyprawy
 * eksperta) dostają pustą tarczę — emoji tu nie wraca, bo odstawało od
 * ilustracji i wyglądało inaczej na każdym systemie.
 */
const LOCKED_TINT = '#b9a98b';

function ExpeditionDisc({
  expeditionId,
  size,
  locked = false,
}: {
  expeditionId: string;
  size: number;
  locked?: boolean;
}) {
  const source = EXPEDITION_ICONS[expeditionId];
  const lock = size * 0.44;
  return (
    <View style={{ width: size, height: size }}>
      <SlotDisc size={size}>
        {source ? (
          <Image
            source={source}
            style={{ flex: 1 }}
            // Zamknięta wyprawa jako sylwetka — jak nieodkryte zwierzę:
            // wiadomo, że coś tam jest, ale jeszcze nie co.
            // Jaśniejszy beż niż sylwetka zwierzęcia: zamknięta wyprawa ma
            // ustępować dostępnym, a ciemny brąz ciągnął wzrok najmocniej.
            tintColor={locked ? LOCKED_TINT : undefined}
            contentFit="contain"
            transition={0}
            accessible={false}
          />
        ) : null}
      </SlotDisc>
      {locked ? (
        <Image
          source={LOCK_ART}
          style={{ position: 'absolute', right: -lock * 0.15, bottom: -lock * 0.1, width: lock, height: lock }}
          contentFit="contain"
          transition={0}
          accessible={false}
        />
      ) : null}
    </View>
  );
}

/**
 * Postęp jako rząd kropek — jedna na zwierzę, pełna po odkryciu.
 *
 * Pasek mówił „trochę" albo „dużo", a pięciolatek chce wiedzieć, ILE jeszcze.
 * Kropki da się policzyć palcem. Przy dłuższych wyprawach zawijają się
 * do drugiego rzędu, zamiast się zmniejszać.
 */
export function ProgressDots({
  total,
  filled,
  accent,
  size = 14,
}: {
  total: number;
  filled: number;
  accent: Accent;
  size?: number;
}) {
  const a = ACCENT[accent];
  return (
    <View
      accessible
      accessibilityLabel={`Odkryte ${filled} z ${total}`}
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: size * 0.3 }}>
      {Array.from({ length: total }, (_, i) => {
        const on = i < filled;
        return (
          <View
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 2,
              // Puste miejsce to zagłębienie w papierze, nie szara kropka —
              // ten sam atrament co napisy, tylko rozcieńczony.
              borderColor: on ? a.deep : 'rgba(74, 55, 38, 0.3)',
              backgroundColor: on ? a.base : 'rgba(74, 55, 38, 0.07)',
            }}
          />
        );
      })}
    </View>
  );
}

/** Mała etykieta nad tytułem: „WYPRAWA DNIA", stan wyprawy na liście. */
function Eyebrow({ text, color }: { text: string; color: string }) {
  return (
    <Text
      style={{ color, fontFamily: 'Gabarito-Bold', fontSize: 11, letterSpacing: 1.1 }}>
      {text}
    </Text>
  );
}

/** Nagroda za ukończenie — ta sama łapka i XP, co w pasku statystyk i w panelu. */
function Reward({ art, text }: { art: number; text: string }) {
  return (
    <View className="flex-row items-center" style={{ gap: 3 }}>
      <Image source={art} style={{ width: 22, height: 22 }} contentFit="contain" transition={0} accessible={false} />
      <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>{text}</Text>
    </View>
  );
}

type ExpeditionCardProps = {
  expedition: Expedition;
  /** Mała etykieta nad tytułem. */
  eyebrow: string;
  eyebrowColor?: string;
  /** Zdanie pod tytułem — opis albo komunikat o ukończeniu. */
  subtitle?: string;
  discovered: number;
  /** Rząd kropek postępu. */
  showProgress?: boolean;
  /** Nagrody za ukończenie (łapki, XP). */
  showRewards?: boolean;
  locked?: boolean;
  /** Przycisk-płytka na dole karty. Bez niego karta jest cała klikalna, jeśli ma `onPress`. */
  action?: { label: string; onPress: () => void };
  onPress?: () => void;
  discSize?: number;
};

/**
 * Szeroka karta wyprawy. Ilustracja siedzi na tarczy, która zachodzi na lewą
 * krawędź papieru i wystaje poza nią — ten sam układ, co ikona na pigułce
 * statystyk: papier niesie tekst, obrazek wychodzi przed niego.
 */
export function ExpeditionCard({
  expedition: e,
  eyebrow,
  eyebrowColor,
  subtitle,
  discovered,
  showProgress = false,
  showRewards = false,
  locked = false,
  action,
  onPress,
  discSize = 84,
}: ExpeditionCardProps) {
  const accent = expeditionAccent(e.id);
  const overhang = Math.round(discSize * 0.4);
  const pad = 18;
  const title = e.childTitle ?? e.title;
  const faded = locked ? 0.8 : 1;

  const body = (
    <PaperCard style={{ marginLeft: overhang, padding: pad, opacity: locked ? 0.78 : 1 }}>
      <View className="flex-row items-center">
        {/* Ujemny margines wypycha tarczę poza papier; karta nie przycina
            dzieci, więc wystaje jak ikona na pigułce. */}
        <View style={{ marginLeft: -(overhang + pad), marginVertical: -6, marginRight: 10 }}>
          <ExpeditionDisc expeditionId={e.id} size={discSize} locked={locked} />
        </View>
        <View className="flex-1" style={{ opacity: faded }}>
          <Eyebrow text={eyebrow} color={eyebrowColor ?? ACCENT[accent].deep} />
          <Text
            numberOfLines={2}
            style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 18, lineHeight: 22, marginTop: 1 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={2}
              style={{
                color: INK,
                opacity: 0.75,
                fontFamily: 'Lexend',
                fontSize: 12,
                lineHeight: 16,
                marginTop: 2,
              }}>
              {subtitle}
            </Text>
          ) : null}
          {showProgress ? (
            <View className="flex-row items-center" style={{ marginTop: 7, gap: 8 }}>
              <View className="flex-shrink">
                <ProgressDots total={e.target_count} filled={discovered} accent={accent} />
              </View>
              <Text style={{ color: INK, fontFamily: 'Gabarito-Bold', fontSize: 13 }}>
                {discovered}/{e.target_count}
              </Text>
            </View>
          ) : null}
          {showRewards ? (
            <View className="flex-row items-center" style={{ marginTop: 6, gap: 12 }}>
              <Reward art={TOOLTIP_ART.paws} text={`+${e.reward_paws}`} />
              <Reward art={TOOLTIP_ART.xp} text={`+${e.reward_xp} XP`} />
            </View>
          ) : null}
        </View>
      </View>
      {action ? (
        <View style={{ marginTop: 12 }}>
          <Plate label={action.label} onPress={action.onPress} accent={accent} size="md" />
        </View>
      ) : null}
    </PaperCard>
  );

  if (!onPress) return body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      {body}
    </Pressable>
  );
}

/**
 * Mały kafel do wyboru jednej z trzech wypraw dnia. Tarcza wystaje nad górną
 * krawędź papieru — w wąskim kafelku nie ma miejsca na lewy nawis, a tak
 * trzy kafle czytają się jak trzy naklejki do wyboru.
 */
export function ExpeditionTile({
  expedition: e,
  done,
  onPress,
}: {
  expedition: Expedition;
  done: boolean;
  onPress: () => void;
}) {
  const disc = 66;
  const title = e.childTitle ?? e.title;
  return (
    <Pressable
      onPress={onPress}
      disabled={done}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: done }}
      style={({ pressed }) => ({ flex: 1, transform: [{ scale: pressed ? 0.96 : 1 }] })}>
      <PaperCard
        style={{
          marginTop: disc / 2,
          paddingTop: disc / 2 + 6,
          paddingBottom: 12,
          paddingHorizontal: 12,
          minHeight: 100,
          alignItems: 'center',
          opacity: done ? 0.6 : 1,
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: INK,
            fontFamily: 'Gabarito-Bold',
            fontSize: 13,
            lineHeight: 16,
            textAlign: 'center',
          }}>
          {title}
        </Text>
        {done ? (
          <View style={{ marginTop: 6 }}>
            <ProgressDots total={e.target_count} filled={e.target_count} accent={expeditionAccent(e.id)} size={7} />
          </View>
        ) : null}
      </PaperCard>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' }}>
        <ExpeditionDisc expeditionId={e.id} size={disc} />
      </View>
    </Pressable>
  );
}
