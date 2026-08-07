/**
 * Popularity multipliers — bias `pickBestGuess` toward animals that kids
 * are most likely to think of first. Anything not listed defaults to 1.0.
 */
/**
 * Popularity boost (1.0 default). Skala 1.0–1.35 — wcześniejszy zakres
 * do 1.8 powodował, że "Pies" wygrywał strzał już przy 3 pytaniach,
 * niezależnie od tego, co rzeczywiście myślał gracz.
 */
export const POPULARITY: Record<string, number> = {
  // pupile
  dog: 1.35, cat: 1.3, rabbit: 1.2, hamster: 1.2, guinea_pig: 1.2, mouse: 1.15, rat: 1.1,

  // farma
  cow: 1.2, horse: 1.25, sheep: 1.15, goat: 1.15, pig: 1.2, donkey: 1.1,
  chicken: 1.15, duck: 1.15, goose: 1.1, rooster: 1.1,

  // dzikie popularne
  fox: 1.2, wolf: 1.2, brown_bear: 1.2, hedgehog: 1.15, squirrel: 1.15,
  deer: 1.15, wild_boar: 1.1,

  // afryka
  lion: 1.3, elephant: 1.25, giraffe: 1.2, zebra: 1.15, hippo: 1.1,
  rhino: 1.1, cheetah: 1.1, leopard: 1.1,

  // dżungla / exotic
  tiger: 1.25, panda: 1.2, chimpanzee: 1.15, gorilla: 1.15, orangutan: 1.1,
  sloth: 1.1, jaguar: 1.1, kangaroo: 1.15, koala: 1.15,

  // polarne
  polar_bear: 1.2, penguin_emperor: 1.2, penguin_little: 1.1, seal: 1.1,

  // morskie
  shark: 1.2, dolphin: 1.2, whale: 1.15, orca: 1.1, octopus: 1.1,

  // ptaki
  eagle: 1.2, owl: 1.25, parrot: 1.2, flamingo: 1.15, ostrich: 1.15,
  swan: 1.15, stork: 1.2, sparrow: 1.15, swallow: 1.15, woodpecker: 1.15,
  pigeon: 1.15,

  // małe popularne
  butterfly: 1.15, ladybug: 1.15, bee: 1.15, ant: 1.1, spider: 1.1,
  snail: 1.1, frog: 1.2, toad: 1.1,

  // gady
  snake: 1.1, crocodile: 1.15, turtle: 1.15, sea_turtle: 1.1, lizard: 1.1,

  // ryby
  carp: 1.1,
};

export function popularityOf(id: string): number {
  return POPULARITY[id] ?? 1.0;
}
