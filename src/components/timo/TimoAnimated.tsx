import { View } from '@/tw';
import { Image } from '@/tw/image';

import { AlphaVideo } from './AlphaVideo';

/**
 * Animowany Timo — zapętlone klipy maskotki.
 *
 * Klipy są animowanymi WebP, więc odtwarza je samo `expo-image` — bez natywnego
 * playera i bez przebudowy aplikacji.
 *
 * - `idle` — Timo stoi na środku, mruga, macha ogonem i raz łapką. Kadr jest
 *   przycięty do sylwetki i ma KANAŁ ALFA, więc lisek może stanąć na dowolnym
 *   tle (na Home robi to `TimoStage`, na tle polany). Cienia kontaktowego nie
 *   ma w klipie — siedzi w grafice tła, bo Timo i tak stoi w miejscu.
 *   Pętla jest domknięta (końcówka przenika w początek), więc chodzi bez
 *   przeskoku.
 * - `walk` — Timo przechodzi przez kadr z prawej do lewej. Ten klip jest
 *   NIEPRZEZROCZYSTY: ma wtopione tło w kolorze `--color-canvas` (#fbf9f6),
 *   więc wolno go kłaść wyłącznie na płótnie, nigdy na ilustracji. Do tego
 *   przez chwilę Timo jest poza kadrem, więc to raczej przerywnik niż stały
 *   element ekranu.
 */
const CLIPS = {
  // Klipy liska jako wideo „podwójne” (kolor + maska) — patrz AlphaVideo.
  idle: require('../../../assets/timo/character/timo-idle.mp4'),
  // Animacje v2 (docs/prompts-timo-anim-v2.md): idle, mówienie i machanie
  // z JEDNEJ klatki startowej tym samym modelem — ten sam lisek, ciało
  // nieruchome, więc idle i mówienie różnią się tylko buzią, oczami i ogonem.
  talk: require('../../../assets/timo/character/timo-talk.mp4'),
  'talk-happy': require('../../../assets/timo/character/timo-talk-happy.mp4'),
  wave: require('../../../assets/timo/character/timo-wave.mp4'),
  // Spacer zostaje animowanym WebP — jest nieprzezroczysty (tło w klipie).
  walk: require('../../../assets/timo/character/timo-walk.webp'),
} as const;

export type TimoClip = keyof typeof CLIPS;

type TimoAnimatedProps = {
  clip?: TimoClip;
  /** Wysokość pasa animacji; szerokość wypełnia rodzica. */
  height?: number;
  /** Pozioma korekta w punktach — patrz `CLIP_BODY_OFFSET_PX` w `TimoStage`. */
  offsetX?: number;
  /** Animacja wczytana — scena chowa wtedy idle pod spodem. */
  onLoad?: () => void;
  /** Zamiast klipu z `CLIPS` — np. lisek przebrany pod wyprawę (`outfits.ts`). */
  source?: number;
  /** Zatrzymany klip nie zużywa dekodera (pętla mówienia, gdy Timo milczy). */
  paused?: boolean;
  /** Zmiana przewija klip na początek — nowa wypowiedź od pierwszej klatki. */
  restartToken?: number;
};

const LABELS: Record<TimoClip, string> = {
  idle: 'Timo stoi i się uśmiecha',
  walk: 'Timo spaceruje',
  talk: 'Timo mówi',
  'talk-happy': 'Timo się cieszy',
  wave: 'Timo macha łapką',
};

export function TimoAnimated({
  clip = 'idle',
  height = 190,
  offsetX = 0,
  onLoad,
  source,
  paused,
  restartToken,
}: TimoAnimatedProps) {
  if (clip === 'walk' && !source) {
    return (
      <Image
        source={CLIPS.walk}
        onLoad={onLoad}
        style={{
          width: '100%',
          height,
          ...(offsetX ? { transform: [{ translateX: offsetX }] } : null),
        }}
        contentFit="contain"
        useAppleWebpCodec={false}
        transition={0}
        accessibilityRole="image"
        accessibilityLabel={LABELS.walk}
      />
    );
  }
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={LABELS[clip]}
      style={offsetX ? { transform: [{ translateX: offsetX }] } : undefined}>
      <AlphaVideo
        source={source ?? CLIPS[clip]}
        height={height}
        paused={paused}
        restartToken={restartToken}
        onReady={onLoad}
      />
    </View>
  );
}
