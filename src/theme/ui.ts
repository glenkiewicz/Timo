/**
 * Hex-owe lustro tokenów UI 2.0 z `src/global.css`.
 *
 * Potrzebne wszędzie tam, gdzie React Native wymaga surowego koloru zamiast
 * klasy: SVG ikony, płytki cienia pod przyciskami, natywne propsy.
 * Zmiana koloru = zmiana w OBU plikach.
 */

export const UI = {
  canvas: '#ffffff',
  sunken: '#f7f7f7',
  line: '#e5e5e5',
  lineDeep: '#d4d4d4',

  text: '#4b4b4b',
  textSoft: '#777777',
  textFaint: '#afafaf',

  primary: '#58cc02',
  primaryDeep: '#46a302',
  primaryPale: '#d7ffb8',

  fox: '#ff9600',
  foxDeep: '#cc7a00',
  foxPale: '#ffeacc',

  sky: '#1cb0f6',
  skyDeep: '#1899d6',
  skyPale: '#ddf4ff',

  gold: '#ffc800',
  goldDeep: '#e5a600',
  goldPale: '#fff4cc',

  danger: '#ff4b4b',
  dangerDeep: '#e02c2c',
  dangerPale: '#ffe0e0',

  violet: '#ce82ff',
  violetDeep: '#a568cc',
  violetPale: '#f4e6ff',
} as const;

/** Nazwa akcentu — używana przez Button, StatBadge, tab bar. */
export type Accent = 'primary' | 'fox' | 'sky' | 'gold' | 'danger' | 'violet';

export const ACCENT: Record<Accent, { base: string; deep: string; pale: string }> = {
  primary: { base: UI.primary, deep: UI.primaryDeep, pale: UI.primaryPale },
  fox: { base: UI.fox, deep: UI.foxDeep, pale: UI.foxPale },
  sky: { base: UI.sky, deep: UI.skyDeep, pale: UI.skyPale },
  gold: { base: UI.gold, deep: UI.goldDeep, pale: UI.goldPale },
  danger: { base: UI.danger, deep: UI.dangerDeep, pale: UI.dangerPale },
  violet: { base: UI.violet, deep: UI.violetDeep, pale: UI.violetPale },
};
