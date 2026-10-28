import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { WEBP_CLIPS } from '@/components/timo/webp-clips';

/**
 * Grafiki pierwszego ekranu, wczytywane pod splashem — tylko na Androidzie.
 *
 * Tam expo-image wczytuje obrazki z opóźnieniem: po zniknięciu splasha tło
 * polany dorysowywało się na oczach, a lisek mignął. Te same źródła trafiają
 * do pamięci podręcznej, więc Menu dostaje je od razu.
 */
const SOURCES = [
  require('../../assets/backgrounds/home-forest.webp'),
  WEBP_CLIPS.idle,
].filter((s) => s != null);

/** Dłużej splash nie czeka — wolny telefon nie może utknąć na lisku. */
const MAX_WAIT_MS = 2000;

export function SplashWarmup({ onDone }: { onDone: () => void }) {
  const left = useRef(SOURCES.length);
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
    <View pointerEvents="none" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
      {SOURCES.map((source, i) => (
        <Image
          key={i}
          source={source}
          style={{ width: 1, height: 1 }}
          autoplay={false}
          onLoad={loaded}
          onError={loaded}
        />
      ))}
    </View>
  );
}
