import { useWindowDimensions } from 'react-native';

/**
 * Szerokość treści. Decyzja z 07.10.2026: na iPadzie gra idzie na PEŁNĄ
 * szerokość ekranu, bez wąskiej kolumny na środku — dlatego limit jest
 * praktycznie nieskończony. Ekrany i tak liczą rozmiary przez
 * `useContentWidth`/`contentColumn`, więc gdyby kolumna miała wrócić,
 * wystarczy zmienić tę jedną liczbę.
 */
export const CONTENT_MAX = 10000;

export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  return Math.min(width, CONTENT_MAX);
}

/** Styl kolumny treści: pełna szerokość na telefonie, wyśrodkowana na iPadzie. */
export const contentColumn = {
  width: '100%',
  maxWidth: CONTENT_MAX,
  alignSelf: 'center',
} as const;

/** iPad i inne szerokie ekrany — tu kolumna treści jest węższa niż ekran. */
export const TABLET_MIN_WIDTH = 700;

/**
 * Wysokość pasa z liskiem. Na telefonie ułamek szerokości (jak dotąd), na
 * iPadzie co najmniej 30% wysokości ekranu — liczony od kolumny 560 pt lisek
 * stał malutki pośrodku pustej polany.
 */
export function useTimoHeight(factor: number): number {
  const { width, height } = useWindowDimensions();
  const fromColumn = Math.min(width, CONTENT_MAX) * factor;
  return Math.round(width >= TABLET_MIN_WIDTH ? Math.max(fromColumn, height * 0.3) : fromColumn);
}
