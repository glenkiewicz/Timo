/**
 * Hex-owe lustro tokenów UI 3.1 „Polana" z `src/global.css`.
 *
 * Potrzebne wszędzie tam, gdzie React Native wymaga surowego koloru zamiast
 * klasy: SVG ikony, gradienty, natywne propsy.
 * Zmiana koloru = zmiana w OBU plikach.
 */

export const UI = {
  /** tło ekranu — jasna limonka, nie biel */
  canvas: '#f6f8ed',
  /** biel kart; to ona podnosi się cieniem nad płótno */
  surface: '#ffffff',
  sunken: '#eaefda',
  line: '#e6ead4',
  lineDeep: '#d2dbba',

  /** trawa polany — dół ekranu Home; ciągnie ilustrację poniżej jej krawędzi */
  lawn: '#8abe4e',
  lawnDeep: '#7bad42',
  /** chłodniejszy wariant podłogi — ekran gry */
  lawnCool: '#8aae43',
  /** cieplejszy wariant podłogi — ekran wyniku */
  lawnWarm: '#a1b650',

  /** panel — powierzchnia drugoplanowa NA trawie; biały tekst ma na niej 4.7:1 */
  panel: '#5d803d',
  panelLine: '#6d9149',
  /** tekst i ikony na panelu oraz wprost na trawie */
  onLawn: '#ffffff',
  onLawnSoft: '#e4f1d2',

  /** dziennik — ekran odznak (kartka w segregatorze) */
  sand: '#e7dcc4',
  page: '#fdf5ec',
  pageSlot: '#f0e6d9',
  pageFaint: '#6f6049',
  /* --- chatka Timo: gabloty i półki kolekcji --- */
  /** ściana z desek */
  wood: '#c99a63',
  /** cień między deskami i spód półki */
  woodDeep: '#a87a48',
  /** wnętrze gabloty — jaśniejsze niż ściana, żeby figurka się odcinała */
  woodPale: '#e3c295',
  /** mosiężna tabliczka z nazwą i licznikiem */
  brass: '#d9b25c',
  brassDeep: '#8a6b25',

  binder: '#a9784a',
  binderDeep: '#8c6039',

  /** atmosfera: poświata nieba i pasmo horyzontu */
  skyWash: '#d9f0fe',
  meadow: '#c8e28c',
  meadowSoft: '#dcedbc',

  text: '#1e2a26',
  textSoft: '#6e7e6c',
  textFaint: '#92a08f',

  primary: '#1e9082',
  primaryDeep: '#17756a',
  primaryPale: '#daf1eb',

  fox: '#ec8e30',
  foxDeep: '#ce7422',
  foxPale: '#fdecd5',
  /** jaśniejszy przystanek gradientu CTA i awatara poziomu */
  foxLift: '#f6a246',

  sky: '#30a3d2',
  skyDeep: '#1e82ae',
  skyPale: '#dbf0fa',

  gold: '#e9b42e',
  goldDeep: '#c28f1b',
  goldPale: '#fcf1d2',

  danger: '#d25e3e',
  dangerDeep: '#b24528',
  dangerPale: '#fbe4dc',

  violet: '#b275cb',
  violetDeep: '#8e51a8',
  violetPale: '#f2e6f8',
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
  primary: '15, 160, 138',
  fox: '236, 142, 48',
  sky: '35, 183, 253',
  gold: '245, 194, 31',
  danger: '228, 87, 61',
  violet: '178, 103, 214',
};

/** Gradient CTA i awatara poziomu — jedyne miejsca na gradient w akcencie. */
export const FOX_GRADIENT = [UI.foxLift, UI.fox] as const;
