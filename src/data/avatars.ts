/**
 * Awatary dzieci — 12 portretów w stylu kolekcji (scripts/generate-avatars.py).
 * W `profiles.avatar` zapisujemy id (`fox`), znacznik `photo` (zdjęcie tylko
 * na telefonie, patrz `src/lib/avatar-photo.ts`) albo — w starych profilach —
 * emoji, które dalej się wyświetla.
 */
export const AVATARS = [
  { id: 'fox', label: 'Lisek', source: require('../../assets/avatars/fox.webp') },
  { id: 'bear', label: 'Miś', source: require('../../assets/avatars/bear.webp') },
  { id: 'bunny', label: 'Zajączek', source: require('../../assets/avatars/bunny.webp') },
  { id: 'cat', label: 'Kotek', source: require('../../assets/avatars/cat.webp') },
  { id: 'dog', label: 'Piesek', source: require('../../assets/avatars/dog.webp') },
  { id: 'panda', label: 'Panda', source: require('../../assets/avatars/panda.webp') },
  { id: 'owl', label: 'Sówka', source: require('../../assets/avatars/owl.webp') },
  { id: 'lion', label: 'Lew', source: require('../../assets/avatars/lion.webp') },
  { id: 'koala', label: 'Koala', source: require('../../assets/avatars/koala.webp') },
  { id: 'penguin', label: 'Pingwin', source: require('../../assets/avatars/penguin.webp') },
  { id: 'unicorn', label: 'Jednorożec', source: require('../../assets/avatars/unicorn.webp') },
  { id: 'hedgehog', label: 'Jeżyk', source: require('../../assets/avatars/hedgehog.webp') },
] as const;

export const DEFAULT_AVATAR = 'fox';

export function avatarSource(id: string): number | null {
  return AVATARS.find((a) => a.id === id)?.source ?? null;
}
