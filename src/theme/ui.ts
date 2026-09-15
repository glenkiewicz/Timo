/**
 * Hex-owe lustro tokenów UI 3.0 „Polana" z `src/global.css`.
 *
 * Potrzebne wszędzie tam, gdzie React Native wymaga surowego koloru zamiast
 * klasy: SVG ikony, gradienty, natywne propsy.
 * Zmiana koloru = zmiana w OBU plikach.
 */

export const UI = {
  /** tło ekranu — kość, nie biel */
  canvas: '#fbf9f6',
  /** biel kart; to ona podnosi się cieniem nad płótno */
  surface: '#ffffff',
  sunken: '#f1efe9',
  line: '#ede9e3',
  lineDeep: '#ded9d0',

  /** atmosfera: poświata nieba i pasmo horyzontu */
  skyWash: '#e4f0ee',
  meadow: '#e7f1e5',
  meadowSoft: '#eff4ec',

  text: '#1e2a26',
  textSoft: '#7c8a82',
  textFaint: '#9aa8a0',

  primary: '#2e8079',
  primaryDeep: '#246a64',
  primaryPale: '#e3f0ec',

  fox: '#e38a35',
  foxDeep: '#c77329',
  foxPale: '#fbefdf',
  /** jaśniejszy przystanek gradientu CTA i awatara poziomu */
  foxLift: '#ee9b47',

  sky: '#3e8fa8',
  skyDeep: '#2f7389',
  skyPale: '#e1eff4',

  gold: '#dda53e',
  goldDeep: '#b8842b',
  goldPale: '#faf0dc',

  danger: '#c0653f',
  dangerDeep: '#a24f2e',
  dangerPale: '#f7e7e0',

  violet: '#b183c0',
  violetDeep: '#8e5fa0',
  violetPale: '#f2eaf6',
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

/**
 * Drabina cieni. Każdy stopień to dwie warstwy: twardy cień kontaktowy
 * (1–4 px) i szerokie otoczenie z ujemnym spreadem — dopiero ta para czyta się
 * jak przedmiot leżący na płótnie, a nie jak rozmyta poświata. Cień jest
 * atramentem w niskiej alfie, nigdy czernią, więc zostaje ciepły jak tło.
 *
 * Wartości trzymamy jako `boxShadow`, bo tylko ten zapis przenosi obie warstwy
 * i ujemny spread; androidowe `elevation` potrafi jedną warstwę bez spreadu.
 */
export const SHADOW = {
  /** czipy, statystyki, przyciski ikonowe */
  e0: '0px 1px 2px rgba(30, 42, 38, 0.04), 0px 2px 8px rgba(30, 42, 38, 0.05)',
  /** karty, kafelki kolekcji, karty odpowiedzi */
  e1: '0px 1px 2px rgba(30, 42, 38, 0.04), 0px 8px 24px -6px rgba(30, 42, 38, 0.1)',
  /** dymek Timo, karta pytania, karta okazu */
  e2: '0px 2px 4px rgba(30, 42, 38, 0.05), 0px 16px 40px -10px rgba(30, 42, 38, 0.14)',
  /** dok nawigacji, modal */
  e3: '0px 4px 8px rgba(30, 42, 38, 0.06), 0px 24px 56px -12px rgba(30, 42, 38, 0.18)',
  /** rant światła na powierzchniach e2/e3 */
  rim: 'inset 0px 1px 0px rgba(255, 255, 255, 0.9)',
  /** wklęsłość — tor paska XP, tło postępu */
  inset: 'inset 0px 1px 2px rgba(30, 42, 38, 0.06)',
} as const;

/**
 * Poświata pod akcją główną: cień barwiony akcentem, nie atramentem.
 * Jedna na ekran — druga znosi hierarchię. `pressed` odpowiada wciśnięciu,
 * przy którym przycisk „siada" zamiast chować półkę.
 */
export function glow(accent: Accent = 'fox', pressed = false): string {
  const rgb = GLOW_RGB[accent];
  return pressed
    ? `0px 3px 10px -2px rgba(${rgb}, 0.45)`
    : `0px 8px 20px -4px rgba(${rgb}, 0.45)`;
}

const GLOW_RGB: Record<Accent, string> = {
  primary: '46, 128, 121',
  fox: '227, 138, 53',
  sky: '62, 143, 168',
  gold: '221, 165, 62',
  danger: '192, 101, 63',
  violet: '177, 131, 192',
};

/** Gradient CTA i awatara poziomu — jedyne miejsca na gradient w akcencie. */
export const FOX_GRADIENT = [UI.foxLift, UI.fox] as const;
