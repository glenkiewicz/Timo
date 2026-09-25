import { ANIMAL_RANGES } from '@/data/animal-ranges';
import type { MapRegion } from '@/data/animal-details';
import { ANIMALS } from '@/data/animals';
import { EXPEDITIONS_BY_ID } from '@/data/expeditions';
import type { Animal } from '@/types/game';

/**
 * Podział kolekcji na krainy.
 *
 * Nazwy krain idą za wyprawami, ale przynależność liczy się z ZASIĘGU
 * (`ANIMAL_RANGES`, zweryfikowany gatunek po gatunku) i kilku atrybutów.
 * Wcześniej liczyły ją same atrybuty, a co nie pasowało nigdzie, spadało do
 * worka „Łąka i zarośla" — trafiało tam 100 zwierząt: dinozaury, smok,
 * grzechotnik, tygrys syberyjski… Teraz każda kraina ma regułę, która mówi,
 * kto w niej mieszka, a worek łapie tylko zwierzęta żyjące po prostu wszędzie.
 *
 * Wyprawy tematyczne zostają FILTREM wewnątrz krainy i to one wiążą kolekcję
 * z rozgrywką.
 */
export type RegionSource =
  /** Reguła na zwierzęciu i jego zasięgu. */
  | { kind: 'match'; test: (animal: Animal, range: ReadonlySet<MapRegion>) => boolean }
  /** Roster wyprawy — tam, gdzie zasięg nic nie mówi (góry). */
  | { kind: 'roster'; expeditionId: string; except?: (animal: Animal, range: ReadonlySet<MapRegion>) => boolean }
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
   * Dok na ekranie tej krainy: tło i kolor podpisów. Liczone z plików, nie
   * dobierane na oko — średnia z dolnych 8% tła, czyli z tego, co realnie
   * styka się z dokiem.
   *
   * Domyślnie przyciemniamy próbkę, aż BIAŁY podpis złapie kontrast 4,5:1, bo
   * jeden kolor tekstu w całej aplikacji czyta się spokojniej. Przyciemnianie
   * ma jednak sufit 25%: przy jasnym dole barwa rozpada się szybciej, niż
   * rośnie kontrast — dno Oceanu (#d5d8af) wymagałoby 45% i robiła się z niego
   * oliwkowa breja. Powyżej sufitu zostawiamy próbkę i odwracamy podpis na
   * ciemny; dla Oceanu daje to kontrast 11,3, więc to nie kompromis.
   */
  dock: { bg: string; fg: string };
  source: RegionSource;
};

/** Zwierzęta wymarłe — ich „zasięg" to miejsca znalezisk skamieniałości. */
const EXTINCT = new Set([
  'trex',
  'brachiosaurus',
  'velociraptor',
  'triceratops',
  'stegosaurus',
  'mammoth',
  'sabretooth',
]);

/** Regiony wyłącznie morskie — zwierzę, które nie ma nic poza nimi, żyje w morzu. */
const SEA: ReadonlySet<MapRegion> = new Set<MapRegion>([
  'oceans', 'atlantic', 'pacific', 'pacific-w', 'pacific-e', 'indian', 'arctic', 'antarctica', 'polska',
]);

/** Tatrzańskie zwierzęta z Polski, które mają swoje miejsce w Górach, a nie w Lesie. */
const POLISH_MOUNTAIN = new Set(['chamois', 'marmot']);

/**
 * Zwierzęta, których reguły nie ustawią dobrze — z nazwanym powodem.
 * Rozstrzygają przed regułami krain.
 */
const PLACED: Record<string, string> = {
  // Nowa Kaledonia — Oceania, a nie morze.
  crested_gecko: 'australia',
  // Atol Aldabra na Seszelach — afrykańska wyspa, żółw lądowy.
  tortoise_giant: 'savanna',
  // Zwierzę rzek; w Polsce wyginęła, więc reguła „Polska + woda" jej nie łapie.
  european_mink: 'river',
  pelican: 'river',
  // Tajga Syberii — w Europie tylko na jej północnym skraju.
  flying_squirrel: 'asia',
  great_grey_owl: 'asia',
  koi: 'home',
  // Żyją na wielu kontynentach, ale dla dziecka to zwierzęta pustyń i sawann —
  // i najwięcej gatunków żółwi lądowych ma Afryka z Madagaskarem.
  scorpion: 'savanna',
  turtle: 'savanna',
  // Roster wyprawy „Góry" ma je dla klimatu, ale żyją na preriach i nad wodą.
  bison_american: 'americas',
  coyote: 'americas',
  bald_eagle: 'americas',
};

const hasAny = (range: ReadonlySet<MapRegion>, ...regions: MapRegion[]) =>
  regions.some((r) => range.has(r));

/**
 * Pierwszy region lądowy zasięgu — w `ANIMAL_RANGES` regiony są wpisane od
 * głównego, więc to on mówi, na jakim kontynencie zwierzę jest „u siebie".
 */
function homeContinent(animal: Animal): MapRegion | undefined {
  return ANIMAL_RANGES[animal.id]?.regions.find((r) => !SEA.has(r) && r !== 'worldwide');
}

/**
 * KOLEJNOŚĆ MA ZNACZENIE: zwierzę trafia do pierwszej pasującej krainy.
 * Bez tego liczniki nie sumowałyby się do 715, bo wiele zwierząt spełnia kilka
 * warunków naraz (foka żyje i w Bałtyku, i w Arktyce).
 */
export const ANIMAL_REGIONS: AnimalRegion[] = [
  { id: 'legend',    label: 'Legendy i dinozaury', patch: 'legend', background: 'dinos-myths', dock: { bg: '#547833', fg: '#ffffff' },
    source: { kind: 'match', test: (a, r) => r.has('mythical') || EXTINCT.has(a.id) } },
  { id: 'farm',      label: 'Dom i farma', patch: 'farm',      background: 'farm-timo', dock: { bg: '#58793d', fg: '#ffffff' },
    source: { kind: 'match', test: (a) => a.attributes.lives_on_farm === true } },
  { id: 'home',      label: 'U nas w domu', patch: 'meadow',   background: 'home-pets-friends', dock: { bg: '#627f2f', fg: '#ffffff' },
    source: { kind: 'match', test: (a) => a.attributes.lives_at_home === true } },
  // Tylko ssaki i ptaki: kryl czy chełbia z zimnych wód to jednak mieszkańcy Oceanu.
  { id: 'arctic',    label: 'Lodowe krainy', patch: 'arctic',  background: 'ice-land', dock: { bg: '#5978a1', fg: '#ffffff' },
    source: { kind: 'match', test: (a, r) =>
      hasAny(r, 'arctic', 'antarctica') && !hasAny(r, 'oceans', 'polska') &&
      (a.attributes.is_mammal === true || a.attributes.is_bird === true) } },
  { id: 'ocean',     label: 'Ocean',       patch: 'ocean',     background: 'ocean', dock: { bg: '#d5d8af', fg: '#1a2012' },
    source: { kind: 'match', test: (a, r) =>
      a.attributes.lives_in_ocean === true || (r.size > 0 && [...r].every((x) => SEA.has(x) && x !== 'polska')) } },
  { id: 'river',     label: 'Rzeki i jeziora', patch: 'river', background: 'swimmers', dock: { bg: '#5f7f2c', fg: '#ffffff' },
    source: { kind: 'match', test: (a, r) => a.attributes.lives_in_water === true && hasAny(r, 'polska', 'europa') } },
  { id: 'jungle',    label: 'Dżungla',     patch: 'jungle',    background: 'green-jungle', dock: { bg: '#677f30', fg: '#ffffff' },
    source: { kind: 'match', test: (a) => a.attributes.lives_in_jungle === true } },
  { id: 'mountain',  label: 'Góry',        patch: 'mountain',  background: 'scary-animals', dock: { bg: '#5c533b', fg: '#ffffff' },
    source: { kind: 'roster', expeditionId: 'mountain', except: (a, r) => r.has('polska') && !POLISH_MOUNTAIN.has(a.id) } },
  { id: 'forest',    label: 'Polski las',  patch: 'forest',    background: 'forest-kids', dock: { bg: '#5f7e3c', fg: '#ffffff' },
    source: { kind: 'match', test: (_a, r) => r.has('polska') } },
  { id: 'savanna',   label: 'Afryka',      patch: 'savanna',   background: 'savanna-kids', dock: { bg: '#7b7a28', fg: '#ffffff' },
    source: { kind: 'match', test: (a) =>
      ['africa-sub', 'africa-north', 'madagascar'].includes(homeContinent(a) ?? '') } },
  { id: 'australia', label: 'Australia i Oceania', patch: 'australia', background: 'jumpers', dock: { bg: '#64802a', fg: '#ffffff' },
    source: { kind: 'match', test: (a) =>
      ['australia', 'new-zealand', 'new-guinea'].includes(homeContinent(a) ?? '') } },
  { id: 'americas',  label: 'Ameryka',     patch: 'americas',  background: 'long-nose', dock: { bg: '#7d7932', fg: '#ffffff' },
    source: { kind: 'match', test: (a) =>
      ['america-n', 'america-c', 'america-s'].includes(homeContinent(a) ?? '') } },
  { id: 'asia',      label: 'Azja',        patch: 'asia',      background: 'striped-spotted', dock: { bg: '#637e30', fg: '#ffffff' },
    source: { kind: 'match', test: (a) =>
      ['asia-west', 'asia-south', 'asia-cent', 'asia-east', 'asia-se'].includes(homeContinent(a) ?? '') } },
  { id: 'world',     label: 'Cały świat',  patch: 'meadow',    background: 'bugs-and-worms', dock: { bg: '#4e3c2c', fg: '#ffffff' },
    source: { kind: 'rest' } },
];

const NO_RANGE: ReadonlySet<MapRegion> = new Set();

function matches(animal: Animal, source: RegionSource, roster: Set<string>): boolean {
  const range: ReadonlySet<MapRegion> = new Set(ANIMAL_RANGES[animal.id]?.regions ?? NO_RANGE);
  switch (source.kind) {
    case 'match':
      return source.test(animal, range);
    case 'roster':
      return roster.has(animal.id) && !source.except?.(animal, range);
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
    const placed = PLACED[animal.id];
    const hit = placed ? regionById(placed) : ANIMAL_REGIONS.find((r) =>
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
