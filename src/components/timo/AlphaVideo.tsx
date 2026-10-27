import {
  Canvas,
  Fill,
  Group,
  ImageShader,
  Shader,
  Skia,
  type SkImage,
  useVideo,
  type Video,
} from '@shopify/react-native-skia';
import { useAssets } from 'expo-asset';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  runOnJS,
  runOnUI,
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

import { View } from '@/tw';

/**
 * Wideo z przezroczystością złożone shaderem.
 *
 * Plik to zwykłe H.264 „podwójne”: lewa połowa to kolor, prawa — maska
 * krycia (scripts/encode-alpha-video.py). Shader bierze kolor z lewej,
 * krycie z prawej i rysuje liska na dowolnym tle. Klip jest ~10× lżejszy niż
 * ten sam ruch jako animowany WebP, a dekoduje go sprzętowy dekoder wideo.
 *
 * Kadr klipu (436×640) jest wpasowany w pole jak `contentFit="contain"`,
 * wyśrodkowany — tak samo jak dawne WebP, więc łapy stoją tam, gdzie stały.
 */
const EFFECT = Skia.RuntimeEffect.Make(`
uniform shader image;
uniform float2 offset;
uniform float scale;
uniform float2 frame;

half4 main(float2 xy) {
  float2 p = (xy - offset) / scale;
  if (p.x < 0 || p.y < 0 || p.x >= frame.x || p.y >= frame.y) {
    return half4(0);
  }
  half3 c = image.eval(p).rgb;
  half a = image.eval(float2(p.x + frame.x, p.y)).r;
  return half4(c * a, a);
}
`)!;

/** Klipy liska mają 24 kl./s. */
const CLIP_FRAME_MS = 1000 / 24;

type ClipVideo = {
  currentFrame: SharedValue<SkImage | null>;
  size: { width: number; height: number };
};

function useSkiaVideo(
  uri: string | null,
  paused: SharedValue<boolean>,
  seek: SharedValue<number | null>,
): ClipVideo {
  return useVideo(uri, { looping: true, paused, seek });
}

/**
 * Własna pętla klatek na Androidzie. `useVideo` ze Skii woła tam dekoder przy
 * każdej klatce ekranu: klip 24 kl./s leciał ~2,5× za szybko, każde wołanie
 * potrafi zablokować wątek UI na kilkanaście ms (także dla klipów w pauzie),
 * a sam dekoder nie zapętla klipu — mówiący lisek się rwał. Tu klatki
 * pobieramy w tempie klipu, tylko gdy klip gra, i sami wracamy na początek.
 */
function useAndroidVideo(
  uri: string | null,
  paused: SharedValue<boolean>,
  seek: SharedValue<number | null>,
): ClipVideo {
  const [video, setVideo] = useState<Video | null>(null);
  useEffect(() => {
    if (!uri) return;
    const v = Skia.Video(uri) as Video;
    v.setVolume(0);
    setVideo(v);
    return () => {
      setVideo(null);
      // Na wątku UI — po ostatnim wywołaniu pętli klatek, nie w jej trakcie.
      runOnUI(() => {
        'worklet';
        v.dispose();
      })();
    };
  }, [uri]);

  const currentFrame = useSharedValue<SkImage | null>(null);
  /** Potrzebna klatka mimo pauzy: pierwsza po wczytaniu albo po przewinięciu. */
  const fresh = useSharedValue(true);
  const lastPull = useSharedValue(0);
  const lastTime = useSharedValue(-1);
  const stalls = useSharedValue(0);

  useEffect(() => {
    fresh.value = true;
    lastTime.value = -1;
  }, [video, fresh, lastTime]);

  useAnimatedReaction(
    () => paused.value,
    (p) => {
      if (!video) return;
      if (p) video.pause();
      else video.play();
    },
    [video],
  );

  useAnimatedReaction(
    () => seek.value,
    (to) => {
      if (!video || to === null) return;
      video.seek(to);
      seek.value = null;
      fresh.value = true;
      lastTime.value = -1;
    },
    [video],
  );

  useFrameCallback((info) => {
    'worklet';
    if (!video) return;
    if (!fresh.value && (paused.value || info.timestamp - lastPull.value < CLIP_FRAME_MS)) return;
    lastPull.value = info.timestamp;

    const img = video.nextImage();
    if (!img) return;
    // Klatka to tekstura, którą dekoder zaraz nadpisze — kopia przed rysowaniem.
    const copy = img.makeNonTextureImage();
    img.dispose();
    if (!copy) return;
    currentFrame.value?.dispose();
    currentFrame.value = copy;
    fresh.value = false;

    // Pętla: tuż przed końcem albo gdy czas klatek stanął (dekoder doszedł do końca).
    const t = video.currentTime();
    if (t <= lastTime.value) stalls.value += 1;
    else stalls.value = 0;
    lastTime.value = t;
    if (t >= video.duration() - 2 * CLIP_FRAME_MS || stalls.value >= 3) {
      video.seek(0);
      stalls.value = 0;
      lastTime.value = -1;
    }
  });

  const size = video ? video.size() : { width: 0, height: 0 };
  return { currentFrame, size };
}

const useClipVideo = Platform.OS === 'android' ? useAndroidVideo : useSkiaVideo;

type AlphaVideoProps = {
  /** `require('…mp4')` — klip „podwójny”. */
  source: number;
  height: number;
  /** Zatrzymany klip stoi na bieżącej klatce i nie zużywa dekodera. */
  paused?: boolean;
  /** Zmiana wartości przewija klip na początek (nowa wypowiedź). */
  restartToken?: number;
  /** Pierwsza klatka gotowa do rysowania. */
  onReady?: () => void;
};

export function AlphaVideo({
  source,
  height,
  paused = false,
  restartToken = 0,
  onReady,
}: AlphaVideoProps) {
  const [assets] = useAssets([source]);
  const uri = assets?.[0]?.localUri ?? assets?.[0]?.uri ?? null;

  const pausedSv = useSharedValue(paused);
  const seek = useSharedValue<number | null>(null);
  useEffect(() => {
    pausedSv.value = paused;
  }, [paused, pausedSv]);
  useEffect(() => {
    if (restartToken) seek.value = 0;
  }, [restartToken, seek]);

  const { currentFrame, size } = useClipVideo(uri, pausedSv, seek);

  const [width, setWidth] = useState(0);
  const fw = size.width / 2;
  const fh = size.height;
  const scale = fw > 0 && fh > 0 && width > 0 ? Math.min(width / fw, height / fh) : 1;
  const uniforms = {
    offset: [(width - fw * scale) / 2, (height - fh * scale) / 2],
    scale,
    frame: [fw, fh],
  };

  // Bez klatki shader dostaje pusty obraz i Skia maluje CZARNY prostokąt —
  // tak wyglądał pas liska przez klatkę, gdy pętla mówienia wchodziła, zanim
  // dekoder oddał pierwszą klatkę. Do tego czasu warstwa jest przezroczysta.
  const opacity = useDerivedValue(() => (currentFrame.value ? 1 : 0));

  const ready = useSharedValue(false);
  useAnimatedReaction(
    () => currentFrame.value !== null,
    (has) => {
      if (has && !ready.value) {
        ready.value = true;
        if (onReady) runOnJS(onReady)();
      }
    },
    [onReady],
  );

  return (
    <View
      style={{ width: '100%', height }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && fw > 0 ? (
        <Canvas style={{ width, height }}>
          <Group opacity={opacity}>
            <Fill>
              <Shader source={EFFECT} uniforms={uniforms}>
                <ImageShader image={currentFrame} tx="decal" ty="decal" />
              </Shader>
            </Fill>
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
