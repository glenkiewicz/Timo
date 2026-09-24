import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import type { Animal, AttributeKey } from '@/types/game';

/**
 * Podział kolekcji na regiony papierowej mapy.
 *
 * Skąd bierze się przynależność — i dlaczego nie z samych wypraw. Wypraw jest
 * 45, ale MIEJSCEM jest tylko 10 z nich; reszta to przekroje tematyczne, więc
 * lew siedzi naraz w „Sawannie", „Dzikich kotach", „Drapieżnikach" i
 * „Olbrzymach świata" i nie da się go postawić w czterech punktach mapy.
 * Same rostery miejsc pokrywają 483 z 715 zwierząt — 232 nie miałyby gdzie
 * stanąć. Dlatego nazwy regionów idą za wyprawami, a przynależność liczą
 * atrybuty, które pokrywają komplet.
 *
 * Tam, gdzie atrybutu nie ma (góry, Australia), sięgamy po roster wyprawy —
 * to gotowa, wykurowana lista, lepsza niż zgadywanie po cechach.
 *
 * Wyprawy tematyczne zostają FILTREM wewnątrz regionu i to one wiążą kolekcję
 * z rozgrywką.
 */
export type RegionSource =
  | { kind: 'attribute'; key: AttributeKey }
  | { kind: 'roster'; expeditionId: string }
  /** Worek na resztę — dzięki niemu nikt nie wypada poza mapę. */
  | { kind: 'rest' };

export type AnimalRegion = {
  id: string;
  label: string;
  /** Wyspa na mapie (`assets/map/patch-*.webp`). */
  patch: string;
  /** Tło ekranu regionu — te same pliki, co tła wypraw. */
  background: string;
  /**
   * Kolor doku na ekranie tego regionu — średnia z dolnych 8% tła,
   * przyciemniona tak, by biały podpis trzymał kontrast 4,5:1.
   * Liczone z plików, nie dobierane na oko.
   */
  dock: string;
  source: RegionSource;
};

/**
 * KOLEJNOŚĆ MA ZNACZENIE: zwierzę trafia do pierwszego pasującego regionu.
 * Bez tego liczniki nie sumowałyby się do 715, bo wiele zwierząt spełnia kilka
 * warunków naraz (niedźwiedź polarny żyje i w Arktyce, i w oceanie).
 */
export const ANIMAL_REGIONS: AnimalRegion[] = [
  { id: 'arctic',    label: 'Arktyka',     patch: 'arctic',    background: 'ice-land', dock: '#5978a1',
    source: { kind: 'attribute', key: 'lives_in_arctic' } },
  { id: 'ocean',     label: 'Ocean',       patch: 'ocean',     background: 'water-friends', dock: '#8c7245',
    source: { kind: 'attribute', key: 'lives_in_ocean' } },
  { id: 'jungle',    label: 'Dżungla',     patch: 'jungle',    background: 'green-jungle', dock: '#677f30',
    source: { kind: 'attribute', key: 'lives_in_jungle' } },
  { id: 'savanna',   label: 'Sawanna',     patch: 'savanna',   background: 'savanna-kids', dock: '#7b7a28',
    source: { kind: 'attribute', key: 'lives_in_africa' } },
  { id: 'mountain',  label: 'Góry',        patch: 'mountain',  background: 'scary-animals', dock: '#5c533b',
    source: { kind: 'roster', expeditionId: 'mountain' } },
  { id: 'australia', label: 'Australia',   patch: 'australia', background: 'jumpers', dock: '#64802a',
    source: { kind: 'roster', expeditionId: 'australia' } },
  { id: 'farm',      label: 'Dom i farma', patch: 'farm',      background: 'farm-timo', dock: '#58793d',
    source: { kind: 'attribute', key: 'lives_on_farm' } },
  { id: 'home',      label: 'U nas w domu', patch: 'meadow',   background: 'home-pets-friends', dock: '#627f2f',
    source: { kind: 'attribute', key: 'lives_at_home' } },
  { id: 'forest',    label: 'Polski las',  patch: 'forest',    background: 'forest-kids', dock: '#5f7e3c',
    source: { kind: 'attribute', key: 'lives_in_poland' } },
  { id: 'river',     label: 'Rzeki i jeziora', patch: 'river', background: 'swimmers', dock: '#5f7f2c',
    source: { kind: 'attribute', key: 'lives_in_water' } },
  { id: 'meadow',    label: 'Łąka i zarośla', patch: 'meadow', background: 'bugs-and-worms', dock: '#4e3c2c',
    source: { kind: 'rest' } },
];

function matches(animal: Animal, source: RegionSource, roster: Set<string>): boolean {
  switch (source.kind) {
    case 'attribute':
      return animal.attributes[source.key] === true;
    case 'roster':
      return roster.has(animal.id);
    case 'rest':
      return true;
  }
}

/** Zwierzęta każdego regionu, policzone raz przy starcie modułu. */
export const BY_REGION: Record<string, Animal[]> = (() => {
  const rosters = new Map<string, Set<string>>(
    ANIMAL_REGIONS.filter((r) => r.source.kind === 'roster').map((r) => {
      const id = (r.source as { expeditionId: string }).expeditionId;
      const exp = EXPEDITIONS_BY_ID[id];
      return [r.id, new Set(exp?.roster ?? exp?.inspirationRoster ?? [])];
    })
  );

  const out: Record<string, Animal[]> = {};
  for (const r of ANIMAL_REGIONS) out[r.id] = [];

  for (const animal of ANIMALS) {
    const hit = ANIMAL_REGIONS.find((r) =>
      matches(animal, r.source, rosters.get(r.id) ?? new Set())
    );
    out[(hit ?? ANIMAL_REGIONS[ANIMAL_REGIONS.length - 1]).id].push(animal);
  }

  for (const r of ANIMAL_REGIONS) {
    out[r.id].sort((a, b) => a.name_pl.localeCompare(b.name_pl, 'pl'));
  }
  return out;
})();

export function regionById(id: string): AnimalRegion | undefined {
  return ANIMAL_REGIONS.find((r) => r.id === id);
}
