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
const GUIDED_INSPIRATION_SIZE = 18;

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
  const isGuided = exp.mode === 'guided';
  // Dla guided źródło prawdy to inspirationRoster (= grywalna pula = karty).
  // Dla expert nadal roster.
  const ids: string[] = isGuided ? (exp.inspirationRoster ?? []) : (exp.roster ?? []);
  console.log(
    `\n[${exp.id}]  (mode: ${exp.mode ?? '(expert)'}, tag: ${exp.tag}) — ${ids.length} zwierząt`
  );

  // 1. Min. rozmiar puli
  if (isGuided) {
    if (ids.length !== GUIDED_INSPIRATION_SIZE) {
      err(`guided wyprawa musi mieć dokładnie ${GUIDED_INSPIRATION_SIZE} zwierząt w inspirationRoster (jest ${ids.length})`);
    }
  } else if (ids.length < MIN_ROSTER) {
    err(`roster mniejszy niż ${MIN_ROSTER} (${ids.length})`);
  }

  // 1b. target_count musi mieścić się w puli
  if (exp.target_count > ids.length) {
    err(`target_count (${exp.target_count}) większy niż pula (${ids.length})`);
  }

  // 1c. childTitle wymagane dla guided
  if (isGuided && !exp.childTitle) {
    warn(`guided wyprawa '${exp.id}' nie ma childTitle (UI pokaże title)`);
  }

  // 2. Duplikaty wewnątrz puli
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) err(`duplikat w puli: '${id}'`);
    seen.add(id);
    allRosterIds.add(id);
  }

  // 3. Nieznane ID
  for (const id of ids) {
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
    for (const id of ids) {
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

// 6. Mityczne — nie powinny być w innych wyprawach EXPERT
// (guided "dinos_myths" celowo zawiera mityczne — to dziecięca wersja)
const myth = EXPEDITIONS.find((e) => e.id === 'mythical');
if (myth) {
  const mythSet = new Set(myth.roster ?? []);
  for (const exp of EXPEDITIONS) {
    if (exp.id === 'mythical') continue;
    if (exp.mode === 'guided') continue; // guided 'dinos_myths' celowo zawiera mityczne
    const expIds = exp.roster ?? [];
    for (const id of expIds) {
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
