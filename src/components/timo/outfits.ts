/**
 * Timo w przebraniu pod wyprawę — te same trzy klipy co zwykły lisek
 * (idle, mówienie, radosne mówienie), wygenerowane z klatki startowej
 * z akcesoriami (scripts/generate-timo-outfit.py → generate-timo-talk.py
 * --start --prefix → process-timo-talk.py). Kadr identyczny ze zwykłym
 * idle, więc lisek stoi w scenie dokładnie tam, gdzie zawsze.
 *
 * Wyprawa bez wpisu = zwykły lisek.
 */
export type OutfitClips = { idle: number; talk: number; happy: number };

export const OUTFITS: Record<string, OutfitClips> = {
  // Maska do nurkowania na czole i fajka.
  water_friends: {
    idle: require('../../../assets/timo/outfits/water_friends/idle.webp'),
    talk: require('../../../assets/timo/outfits/water_friends/talk.webp'),
    happy: require('../../../assets/timo/outfits/water_friends/talk-happy.webp'),
  },
};

export function outfitFor(expeditionId?: string | null): OutfitClips | undefined {
  return expeditionId ? OUTFITS[expeditionId] : undefined;
}
