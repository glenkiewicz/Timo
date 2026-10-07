import { Image } from '@/tw/image';

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
  idle: require('../../../assets/timo/character/timo-idle.webp'),
  walk: require('../../../assets/timo/character/timo-walk.webp'),
  // Animacje v2 (docs/prompts-timo-anim-v2.md): idle, mówienie i machanie
  // z JEDNEJ klatki startowej tym samym modelem — ten sam lisek, ciało
  // nieruchome, więc idle i mówienie różnią się tylko buzią, oczami i ogonem.
  talk: require('../../../assets/timo/character/timo-talk.webp'),
  'talk-happy': require('../../../assets/timo/character/timo-talk-happy.webp'),
  wave: require('../../../assets/timo/character/timo-wave.webp'),
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
}: TimoAnimatedProps) {
  return (
    <Image
      source={source ?? CLIPS[clip]}
      onLoad={onLoad}
      style={{
        width: '100%',
        height,
        ...(offsetX ? { transform: [{ translateX: offsetX }] } : null),
      }}
      contentFit="contain"
      // iOS-owy dekoder WebP potrafi gubić klatki animacji — libwebp jest wolniejszy,
      // ale odtwarza pętlę poprawnie.
      useAppleWebpCodec={false}
      // Pas animacji ma być statyczny w layoucie — żadnego fade-in przy montażu.
      transition={0}
      accessibilityRole="image"
      accessibilityLabel={LABELS[clip]}
    />
  );
}
