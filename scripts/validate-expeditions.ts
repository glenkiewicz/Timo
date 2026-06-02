/* eslint-disable */
/**
 * Walidator wypraw: sprawdza spójność rosterów względem ANIMALS.
 *
 * Uruchom:  npx tsx scripts/validate-expeditions.ts
 * Exit code 1 przy błędach krytycznych, 0 przy samych warningach lub czysto.
 */
import { ANIMALS, ANIMALS_BY_ID } from '../src/data/animals';
import { EXPEDITIONS } from '../src/data/expeditions';

const MIN_ROSTER = 12;

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

const allRosterIds = new Set<string>();

for (const exp of EXPEDITIONS) {
  console.log(`\n[${exp.id}]  (tag: ${exp.tag}) — ${exp.roster.length} zwierząt`);

  // 1. Min. rozmiar puli
  if (exp.roster.length < MIN_ROSTER) {
    err(`roster mniejszy niż ${MIN_ROSTER} (${exp.roster.length})`);
  }

  // 2. Duplikaty wewnątrz rosteru
  const seen = new Set<string>();
  for (const id of exp.roster) {
    if (seen.has(id)) err(`duplikat w roster: '${id}'`);
    seen.add(id);
    allRosterIds.add(id);
  }

  // 3. Nieznane ID
  for (const id of exp.roster) {
    if (!ANIMALS_BY_ID[id]) err(`nieznane animal_id: '${id}'`);
  }

  // 4. Detektor podejrzeń atrybutowych (tylko warning)
  const SUSPECT_RULES: Record<string, { check: (a: any) => boolean; label: string }> = {
    insects: {
      check: (a) => a.attributes.is_insect !== true,
      label: 'nie jest is_insect=true',
    },
    reptiles: {
      check: (a) => a.attributes.is_reptile !== true,
      label: 'nie jest is_reptile=true',
    },
    amphibians: {
      check: (a) => a.attributes.is_amphibian !== true,
      label: 'nie jest is_amphibian=true',
    },
    monkeys: {
      check: (a) => a.attributes.is_primate !== true,
      label: 'nie jest is_primate=true',
    },
    big_cats: {
      check: (a) => a.attributes.is_mammal !== true || a.attributes.meows !== true,
      label: 'nie jest kotowatym (is_mammal + meows)',
    },
    songbirds: {
      check: (a) => a.attributes.is_bird !== true,
      label: 'nie jest is_bird=true',
    },
    mythical: {
      check: (_) => false, // wszystko dozwolone
      label: '',
    },
  };

  const rule = SUSPECT_RULES[exp.id];
  if (rule) {
    for (const id of exp.roster) {
      const a = ANIMALS_BY_ID[id];
      if (a && rule.check(a)) warn(`'${id}' w '${exp.id}': ${rule.label}`);
    }
  }
}

// 5. Statystyki: orphany (zwierzęta w 0 wypraw)
const orphans = ANIMALS.filter((a) => !allRosterIds.has(a.id));
console.log(`\n=== STATYSTYKI ===`);
console.log(`Łącznie zwierząt w rosterach: ${allRosterIds.size}/${ANIMALS.length}`);
if (orphans.length > 0) {
  console.log(`Orphany (poza wszystkimi wyprawami): ${orphans.length}`);
  for (const a of orphans) console.log(`  - ${a.id} (${a.name_pl})`);
} else {
  console.log(`Brak orphanów ✓`);
}

// 6. Mityczne — nie powinny być w innych wyprawach
const myth = EXPEDITIONS.find((e) => e.id === 'mythical');
if (myth) {
  const mythSet = new Set(myth.roster);
  for (const exp of EXPEDITIONS) {
    if (exp.id === 'mythical') continue;
    for (const id of exp.roster) {
      if (mythSet.has(id)) {
        warn(`'${id}' jest zarówno w 'mythical' jak i '${exp.id}' — mityczne stworzenia powinny być tylko w 'mythical'`);
      }
    }
  }
}

console.log(`\n=== WYNIK ===`);
console.log(`Błędy: ${errors}`);
console.log(`Ostrzeżenia: ${warnings}`);
if (errors > 0) {
  console.error('\n❌ Walidacja FAILED');
  process.exit(1);
} else {
  console.log('\n✓ Walidacja OK');
}
