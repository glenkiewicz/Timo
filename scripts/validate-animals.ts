/* eslint-disable */
/**
 * Walidator zwierząt: sprawdza unikalność id/name_pl oraz spójność atrybutów
 * względem prostych reguł biologicznych. Uruchamiać po każdej paczce nowych
 * zwierząt dodanej do `src/data/animals.ts`.
 *
 * Uruchom:  npx tsx scripts/validate-animals.ts
 * Exit code 1 przy błędach krytycznych, 0 przy samych warningach lub czysto.
 */
import { ANIMALS } from '../src/data/animals';
import type { Animal } from '../src/types/game';

let errors = 0;
let warnings = 0;

function err(msg: string) {
  console.error(`  ERROR: ${msg}`);
  errors++;
}
function warn(msg: string) {
  console.warn(`  WARN:  ${msg}`);
  warnings++;
}

console.log(`Sprawdzam ${ANIMALS.length} zwierząt…\n`);

// 1. Unikalność id
{
  const seen = new Map<string, number>();
  for (const a of ANIMALS) {
    seen.set(a.id, (seen.get(a.id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) err(`zduplikowane id '${id}' (${count} wystąpień)`);
  }
}

// 2. Unikalność name_pl (po normalizacji wielkości liter i białych znaków)
{
  const seen = new Map<string, string[]>();
  for (const a of ANIMALS) {
    const key = a.name_pl.trim().toLocaleLowerCase('pl');
    const ids = seen.get(key) ?? [];
    ids.push(a.id);
    seen.set(key, ids);
  }
  for (const [name, ids] of seen) {
    if (ids.length > 1) err(`zduplikowane name_pl '${name}' (${ids.join(', ')})`);
  }
}

// 3. Emoji over-use (informacyjne)
//    Przy 500+ zwierzętach niektóre emoji (🐦, 🐟, 🦌) muszą być współdzielone —
//    próg ustawiony nisko by wykrywać ekstremalne przeciążenie, nie typowe.
{
  const HEAVY_USE_THRESHOLD = 10;
  const emojiCount = new Map<string, string[]>();
  for (const a of ANIMALS) {
    const ids = emojiCount.get(a.emoji) ?? [];
    ids.push(a.id);
    emojiCount.set(a.emoji, ids);
  }
  for (const [emoji, ids] of emojiCount) {
    if (ids.length > HEAVY_USE_THRESHOLD) {
      warn(
        `emoji '${emoji}' użyte ${ids.length} razy: ${ids.slice(0, 5).join(', ')}…`,
      );
    }
  }
}

// 4. Klasy biologiczne wzajemnie się wykluczają
const CLASS_KEYS = [
  'is_mammal',
  'is_bird',
  'is_fish',
  'is_reptile',
  'is_amphibian',
  'is_insect',
] as const;

function classesTrue(a: Animal): string[] {
  return CLASS_KEYS.filter((k) => a.attributes[k] === true);
}

for (const a of ANIMALS) {
  const classes = classesTrue(a);
  if (classes.length > 1) {
    err(`'${a.id}' (${a.name_pl}) ma wiele klas: ${classes.join(' + ')}`);
  }
}

// 5. Sub-klasy spójne z klasą bazową
for (const a of ANIMALS) {
  const at = a.attributes;
  if (at.is_primate === true && at.is_mammal !== true) {
    err(`'${a.id}': is_primate=true ale is_mammal≠true`);
  }
  if (at.is_rodent === true && at.is_mammal !== true) {
    err(`'${a.id}': is_rodent=true ale is_mammal≠true`);
  }
  if (at.is_marsupial === true && at.is_mammal !== true) {
    // torbacze to ssaki — w naszym schemacie marsupial jest podklasą mammal
    err(`'${a.id}': is_marsupial=true ale is_mammal≠true`);
  }
}

// 6. Spójność morfologiczna — tylko twarde niemożliwości biologiczne
//    (warningi typu "ssak bez sierści" usunięte — wiele realnych ssaków
//     ich nie ma: hedgehog/echidna/armadillo/pangolin/elephant/rhino itd.,
//     baza je obsługuje poprawnie poprzez fur:false i to nie błąd)
for (const a of ANIMALS) {
  const at = a.attributes;

  // Ptak powinien mieć pióra (czasem null, false jest podejrzane)
  if (at.is_bird === true && at.has_feathers === false) {
    warn(`'${a.id}': is_bird=true ale has_feathers=false`);
  }
  // Pióra + sierść jednocześnie — niemożliwe biologicznie
  if (at.has_feathers === true && at.has_fur === true) {
    err(`'${a.id}': ma jednocześnie has_feathers=true i has_fur=true`);
  }
  // Owad nie może mieć szkieletu kręgowca
  if (
    at.is_insect === true &&
    (at.has_fur === true || at.has_feathers === true || at.has_scales === true)
  ) {
    err(
      `'${a.id}': is_insect=true ale ma has_fur/feathers/scales=true — niespójne`,
    );
  }
}

// 7. Rozmiar — wykluczające się flagi
for (const a of ANIMALS) {
  const at = a.attributes;
  if (at.larger_than_dog === true && at.smaller_than_cat === true) {
    err(`'${a.id}': larger_than_dog=true ORAZ smaller_than_cat=true`);
  }
}

// 8. Habitat — wiele biome'ów to OK (np. wąż żyjący i w lesie i w jungli), więc bez błędu

// 9. Brak żadnego biome (orphan biome) — informacyjnie
{
  const BIOME_KEYS = [
    'lives_in_water',
    'lives_in_forest',
    'lives_in_jungle',
    'lives_in_ocean',
    'lives_in_arctic',
    'lives_in_africa',
    'lives_in_poland',
    'lives_on_farm',
    'lives_at_home',
  ] as const;
  let biomeOrphans = 0;
  for (const a of ANIMALS) {
    const hasBiome = BIOME_KEYS.some((k) => a.attributes[k] === true);
    if (!hasBiome) biomeOrphans++;
  }
  if (biomeOrphans > 0) {
    console.log(
      `\nInfo: ${biomeOrphans} zwierząt bez biome (brak lives_in_* / lives_on_* / lives_at_*)`,
    );
  }
}

// 10. fun_fact_pl — długość rozsądna
for (const a of ANIMALS) {
  const f = a.fun_fact_pl.trim();
  if (f.length < 15) warn(`'${a.id}': fun_fact_pl bardzo krótki (${f.length} znaków)`);
  if (f.length > 200) warn(`'${a.id}': fun_fact_pl bardzo długi (${f.length} znaków)`);
}

console.log(`\n=== WYNIK ===`);
console.log(`Łącznie zwierząt: ${ANIMALS.length}`);
console.log(`Błędy: ${errors}`);
console.log(`Ostrzeżenia: ${warnings}`);
if (errors > 0) {
  console.error('\n❌ Walidacja FAILED');
  process.exit(1);
} else {
  console.log('\n✓ Walidacja OK');
}
