/**
 * Efekty dźwiękowe interfejsu — stuknięcia, panel, przejścia, nagrody.
 *
 * Każdy dźwięk ma PULĘ kilku playerów, grających na zmianę. Z jednym playerem
 * szybkie stukanie trafiało w player, który jeszcze grał albo przewijał się
 * na początek (`seekTo` jest asynchroniczne) — i dźwięk raz był, raz nie.
 * Player przewija się na start od razu po skończeniu, więc przy następnym
 * stuknięciu jest gotowy i nie czeka na przewijanie.
 *
 * Same pliki są przycięte do długości animacji, której towarzyszą, bez ciszy
 * na początku (patrz `scripts/generate-sfx.ts`) — inaczej krótkie stuknięcie
 * i tak rozmijałoby się z dźwiękiem.
 *
 * Głośnik na Menu wycisza WSZYSTKO — głos Timo i efekty — przez ten sam
 * `audioMuted`. Dla dziecka jeden przycisk jest czytelniejszy niż dwa.
 *
 * Pliki: `assets/sfx/<nazwa>.mp3`; warianty do odsłuchu leżą
 * w `assets/sfx/_candidates/`, poza repo.
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

/**
 * Głośność jest już wyrównana w plikach (wspólne LUFS przy generowaniu), więc
 * tu tylko drobne korekty — efekty mają leżeć POD głosem Timo.
 */
const VOLUME: Partial<Record<SfxName, number>> = {};
const DEFAULT_VOLUME = 0.8;

/** Tyle stuknięć naraz może zabrzmieć, zanim player wróci do obiegu. */
const POOL = 3;

const pools = new Map<SfxName, { players: AudioPlayer[]; next: number }>();

function poolFor(name: SfxName) {
  let pool = pools.get(name);
  if (!pool) {
    const players = Array.from({ length: POOL }, () => {
      const p = createAudioPlayer(FILES[name]);
      p.volume = VOLUME[name] ?? DEFAULT_VOLUME;
      // Przewiń od razu po skończeniu — następne `play()` startuje bez czekania.
      p.addListener('playbackStatusUpdate', (st) => {
        if (st.didJustFinish) void p.seekTo(0);
      });
      return p;
    });
    pool = { players, next: 0 };
    pools.set(name, pool);
  }
  return pool;
}

export const sfx = {
  play(name: SfxName): void {
    if (useProfileStore.getState().audioMuted) return;
    try {
      const pool = poolFor(name);
      const p = pool.players[pool.next];
      pool.next = (pool.next + 1) % pool.players.length;
      if (p.playing || p.currentTime > 0) {
        // Player z puli jeszcze gra albo nie zdążył się przewinąć — przewiń
        // i zagraj dopiero, gdy jest na początku.
        void p.seekTo(0).then(() => p.play());
      } else {
        p.play();
      }
    } catch {
      /* dźwięk to ozdoba — jego błąd nie może zatrzymać interakcji */
    }
  },

  /** Ładuje wszystkie efekty z góry, żeby pierwsze stuknięcie nie czekało. */
  preload(): void {
    for (const name of Object.keys(FILES) as SfxName[]) poolFor(name);
  },
};
