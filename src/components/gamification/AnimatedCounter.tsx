import { useEffect, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { Text } from '@/tw';

type AnimatedCounterProps = {
  from: number;
  to: number;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  style?: StyleProp<TextStyle>;
  /** optional prefix like "+" */
  prefix?: string;
  suffix?: string;
};

export function AnimatedCounter({
  from,
  to,
  durationMs = 900,
  delayMs = 0,
  className,
  style,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (from === to) {
      setVal(to);
      return;
    }
    setVal(from);
    let raf = 0;
    const startAt = performance.now() + delayMs;
    const step = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const pct = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - pct, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (pct < 1) raf = requestAnimationFrame(step);
      else setVal(to);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [from, to, durationMs, delayMs]);

  return (
    <Text className={className} style={style}>
      {prefix}
      {val}
      {suffix}
    </Text>
  );
}
