import { Directory, File, Paths } from 'expo-file-system';

import type { OutfitWebp } from './outfit-webp';
import { outfitFor } from './outfits';

/**
 * Przebrania liska jako animowane WebP — tylko na Androidzie.
 *
 * Wideo przez Skię blokuje tam wątek UI na ~22 ms przy każdej klatce
 * (pomiar na Galaxy A16), więc przebrany lisek się rwał. WebP dekoduje
 * `expo-image` w tle, tak jak podstawowego liska (`webp-clips.android.ts`).
 * Wszystkie przebrania to ~180 MB, więc nie ma ich w aplikacji: pobieramy
 * je ze strony przy pierwszym wejściu w wyprawę i trzymamy w dokumentach.
 * Do czasu pobrania gra wideo.
 *
 * Pliki na serwer: scripts/publish-outfit-webp.sh. Zmiana klipów = nowa
 * wersja w ścieżce, żeby telefony nie trzymały starych.
 */
const BASE_URL = 'https://zgadujztimo.pl/clips/outfits/v1';
const CLIP_FILES = {
  idle: 'idle.webp',
  talk: 'talk.webp',
  happy: 'talk-happy.webp',
} as const;

const ROOT = new Directory(Paths.document, 'outfits-v1');
const pending = new Map<string, Promise<void>>();

function fileFor(outfit: string, name: string): File {
  return new File(ROOT, outfit, name);
}

/** Klipy przebrania z telefonu — tylko gdy są wszystkie trzy. */
export function outfitWebp(outfit: string): OutfitWebp | undefined {
  const uris = {} as OutfitWebp;
  for (const [key, name] of Object.entries(CLIP_FILES) as [keyof OutfitWebp, string][]) {
    const file = fileFor(outfit, name);
    if (!file.exists) return undefined;
    uris[key] = file.uri;
  }
  return uris;
}

/** Pobiera brakujące klipy przebrania w tle. Błąd sieci = spróbujemy przy następnym wejściu. */
export function fetchOutfitWebp(outfit: string): Promise<void> {
  const running = pending.get(outfit);
  if (running) return running;
  const job = (async () => {
    const dir = new Directory(ROOT, outfit);
    dir.create({ intermediates: true, idempotent: true });
    for (const name of Object.values(CLIP_FILES)) {
      const target = fileFor(outfit, name);
      if (target.exists) continue;
      // Najpierw do pliku tymczasowego — przerwane pobieranie nie może
      // zostawić uciętego klipu pod właściwą nazwą.
      const part = fileFor(outfit, `${name}.part`);
      const downloaded = await File.downloadFileAsync(`${BASE_URL}/${outfit}/${name}`, part, {
        idempotent: true,
      });
      await downloaded.move(target);
    }
  })()
    .catch((e: unknown) => {
      console.warn('[outfit] pobieranie', outfit, e instanceof Error ? e.message : e);
    })
    .finally(() => pending.delete(outfit));
  pending.set(outfit, job);
  return job;
}

/**
 * Pobiera z wyprzedzeniem przebrania wypraw, które dziecko pewnie zaraz
 * otworzy (Wyprawy Dnia z Menu) — po kolei, żeby nie zapchać łącza.
 */
export function prefetchOutfitWebp(outfits: readonly string[]): void {
  void outfits.reduce<Promise<void>>(
    (chain, outfit) => chain.then(() => (outfitWebp(outfit) ? undefined : fetchOutfitWebp(outfit))),
    Promise.resolve(),
  );
}

/** Przebranie jest, ale jego WebP jeszcze nie ma na telefonie. */
export function outfitWebpMissing(outfit: string): boolean {
  return Boolean(outfitFor(outfit)) && !outfitWebp(outfit);
}
