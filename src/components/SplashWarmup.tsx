import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { sceneFrame } from '@/components/timo/TimoStage';
import { WEBP_CLIPS } from '@/components/timo/webp-clips';

/**
 * Grafiki pierwszego ekranu, wczytywane pod splashem — tylko na Androidzie.
 *
 * Tam expo-image wczytuje obrazki z opóźnieniem: po zniknięciu splasha tło
 * polany dorysowywało się na oczach, a lisek mignął. Te same źródła trafiają
 * do pamięci podręcznej, więc Menu dostaje je od razu.
 */

/** Dłużej splash nie czeka — wolny telefon nie może utknąć na lisku. */
const MAX_WAIT_MS = 2000;

export function SplashWarmup({ onDone }: { onDone: () => void }) {
  const { width: screenW } = useWindowDimensions();
  // Polana w rozmiarze ramki `SceneBackdrop` — inny rozmiar to osobna,
  // druga kopia grafiki w pamięci zamiast trafienia w tę samą.
  const scene = sceneFrame('home', screenW);
  const items = [
    { source: scene.source, width: scene.width, height: scene.height },
    { source: WEBP_CLIPS.idle, width: 1, height: 1 },
  ].filter((i) => i.source != null);
  const left = useRef(items.length);
  const done = useRef(false);
  const finish = useRef(() => {
    if (done.current) return;
    done.current = true;
    onDone();
  });

  useEffect(() => {
    const t = setTimeout(finish.current, MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, []);

  const loaded = () => {
    left.current -= 1;
    if (left.current <= 0) finish.current();
  };

  return (
    <View pointerEvents="none" style={{ position: 'absolute', opacity: 0 }}>
      {items.map((item, i) => (
        <Image
          key={i}
          source={item.source}
          style={{ position: 'absolute', width: item.width, height: item.height }}
          autoplay={false}
          onLoad={loaded}
          onError={loaded}
        />
      ))}
    </View>
  );
}
