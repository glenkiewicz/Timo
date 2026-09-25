/**
 * Efekty dźwiękowe interfejsu — stuknięcia, panel, przejścia, nagrody.
 *
 * Każdy dźwięk ma własny, raz utworzony `AudioPlayer`: efekty są krótkie
 * i częste, a tworzenie playera przy każdym stuknięciu dawało słyszalne
 * opóźnienie. Odtwarzanie to przewinięcie na początek i start.
 *
 * Głośnik na Menu wycisza WSZYSTKO — głos Timo i efekty — przez ten sam
 * `audioMuted`. Dla dziecka jeden przycisk jest czytelniejszy niż dwa.
 *
 * Efekty grają ciszej niż głos (`VOLUME`) i nie przerywają go: to osobne
 * playery, a sesja audio i tak miesza je z mową.
 *
 * Pliki: `assets/sfx/<nazwa>.mp3`, generowane przez `scripts/generate-sfx.ts`
 * (warianty do odsłuchu leżą w `assets/sfx/_candidates/`, poza repo).
 */

import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useProfileStore } from '@/lib/stores/profile-store';

const FILES = {
  tap: require('../../../assets/sfx/tap.mp3'),
  'tap-small': require('../../../assets/sfx/tap-small.mp3'),
  'sheet-open': require('../../../assets/sfx/sheet-open.mp3'),
  'sheet-close': require('../../../assets/sfx/sheet-close.mp3'),
  transition: require('../../../assets/sfx/transition.mp3'),
  'answer-yes': require('../../../assets/sfx/answer-yes.mp3'),
  'answer-no': require('../../../assets/sfx/answer-no.mp3'),
  'new-animal': require('../../../assets/sfx/new-animal.mp3'),
  'new-badge': require('../../../assets/sfx/new-badge.mp3'),
  'level-up': require('../../../assets/sfx/level-up.mp3'),
  locked: require('../../../assets/sfx/locked.mp3'),
} as const;

export type SfxName = keyof typeof FILES;

/** Efekty mają leżeć POD głosem Timo, nie konkurować z nim. */
const VOLUME: Partial<Record<SfxName, number>> = {
  'tap-small': 0.35,
  transition: 0.4,
};
const DEFAULT_VOLUME = 0.55;

const players = new Map<SfxName, AudioPlayer>();

function playerFor(name: SfxName): AudioPlayer {
  let p = players.get(name);
  if (!p) {
    p = createAudioPlayer(FILES[name]);
    p.volume = VOLUME[name] ?? DEFAULT_VOLUME;
    players.set(name, p);
  }
  return p;
}

export const sfx = {
  play(name: SfxName): void {
    if (useProfileStore.getState().audioMuted) return;
    try {
      const p = playerFor(name);
      void p.seekTo(0);
      p.play();
    } catch {
      /* dźwięk to ozdoba — jego błąd nie może zatrzymać interakcji */
    }
  },

  /** Ładuje wszystkie efekty z góry, żeby pierwsze stuknięcie nie czekało. */
  preload(): void {
    for (const name of Object.keys(FILES) as SfxName[]) playerFor(name);
  },
};
