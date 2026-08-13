/**
 * Pseudonimy graczy — generowane, nigdy wpisywane.
 *
 * To świadoma decyzja projektowa, nie skrót: aplikację obsługują dzieci, więc
 * pole tekstowe oznaczałoby moderację treści i ryzyko, że dziecko wpisze imię,
 * nazwisko albo szkołę. Zestawienie „przymiotnik + zwierzę" z zamkniętych list
 * daje rozpoznawalną tożsamość w rankingu bez żadnych danych osobowych.
 */

const ADJECTIVES = [
  'Dzielny',
  'Szybki',
  'Mądry',
  'Wesoły',
  'Sprytny',
  'Czujny',
  'Śmiały',
  'Zwinny',
  'Ciekawski',
  'Uważny',
  'Radosny',
  'Bystry',
  'Waleczny',
  'Skoczny',
  'Cichy',
  'Słoneczny',
] as const;

const CREATURES = [
  { noun: 'Jeż', emoji: '🦔' },
  { noun: 'Lis', emoji: '🦊' },
  { noun: 'Borsuk', emoji: '🦡' },
  { noun: 'Sowa', emoji: '🦉' },
  { noun: 'Wilk', emoji: '🐺' },
  { noun: 'Ryś', emoji: '🐆' },
  { noun: 'Bóbr', emoji: '🦫' },
  { noun: 'Wydra', emoji: '🦦' },
  { noun: 'Zając', emoji: '🐰' },
  { noun: 'Wiewiórka', emoji: '🐿️' },
  { noun: 'Łoś', emoji: '🫎' },
  { noun: 'Niedźwiedź', emoji: '🐻' },
  { noun: 'Dzik', emoji: '🐗' },
  { noun: 'Żuraw', emoji: '🕊️' },
  { noun: 'Puchacz', emoji: '🦅' },
  { noun: 'Kret', emoji: '🐹' },
] as const;

/** Rodzaj gramatyczny rzeczownika — żeby „Dzielny Sowa" nie zgrzytał. */
const FEMININE = new Set(['Sowa', 'Wydra', 'Wiewiórka']);

function feminize(adjective: string): string {
  // Wszystkie przymiotniki z listy kończą się na -y lub -i.
  if (adjective.endsWith('y')) return `${adjective.slice(0, -1)}a`;
  if (adjective.endsWith('i')) return `${adjective.slice(0, -1)}a`;
  return adjective;
}

export type Nickname = {
  name: string;
  emoji: string;
};

/** Stabilny hash tekstu → liczba (FNV-1a). Ten sam gracz = ten sam pseudonim. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Pseudonim wyliczony z identyfikatora gracza. `variant` pozwala dziecku
 * losować kolejne propozycje bez zmiany identyfikatora.
 */
export function nicknameFor(playerId: string, variant = 0): Nickname {
  const h = hash(`${playerId}#${variant}`);
  const creature = CREATURES[h % CREATURES.length];
  const adjective = ADJECTIVES[(h >>> 8) % ADJECTIVES.length];
  const name = FEMININE.has(creature.noun)
    ? `${feminize(adjective)} ${creature.noun}`
    : `${adjective} ${creature.noun}`;
  return { name, emoji: creature.emoji };
}

/** Walidacja po stronie serwera — przyjmujemy wyłącznie to, co sami generujemy. */
export function isAllowedNickname(name: string): boolean {
  const parts = name.trim().split(/\s+/);
  if (parts.length !== 2) return false;
  const [adjective, noun] = parts;
  const creature = CREATURES.find((c) => c.noun === noun);
  if (!creature) return false;
  if (FEMININE.has(noun)) {
    return ADJECTIVES.some((a) => feminize(a) === adjective);
  }
  return ADJECTIVES.includes(adjective as (typeof ADJECTIVES)[number]);
}

export const ALLOWED_EMOJI: ReadonlySet<string> = new Set<string>(
  CREATURES.map((c) => c.emoji)
);
