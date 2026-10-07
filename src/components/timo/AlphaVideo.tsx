import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useVideo,
} from '@shopify/react-native-skia';
import { useAssets } from 'expo-asset';
import { useEffect, useState } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

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

  const { currentFrame, size } = useVideo(uri, { looping: true, paused: pausedSv, seek });

  const [width, setWidth] = useState(0);
  const fw = size.width / 2;
  const fh = size.height;
  const scale = fw > 0 && fh > 0 && width > 0 ? Math.min(width / fw, height / fh) : 1;
  const uniforms = {
    offset: [(width - fw * scale) / 2, (height - fh * scale) / 2],
    scale,
    frame: [fw, fh],
  };

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
          <Fill>
            <Shader source={EFFECT} uniforms={uniforms}>
              <ImageShader image={currentFrame} tx="decal" ty="decal" />
            </Shader>
          </Fill>
        </Canvas>
      ) : null}
    </View>
  );
}
