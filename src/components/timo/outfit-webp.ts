/** Adresy plików WebP przebrania na telefonie. */
export type OutfitWebp = { idle: string; talk: string; happy: string };

/** Na iOS przebrany lisek gra z wideo — wersja Androida w `outfit-webp.android.ts`. */
export function outfitWebp(_outfit: string): OutfitWebp | undefined {
  return undefined;
}

export function fetchOutfitWebp(_outfit: string): Promise<void> {
  return Promise.resolve();
}

export function prefetchOutfitWebp(_outfits: readonly string[]): void {}

export function outfitWebpMissing(_outfit: string): boolean {
  return false;
}
