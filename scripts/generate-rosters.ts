/* eslint-disable */
/**
 * Jednorazowy generator startowych rosterów dla wszystkich wypraw.
 * Dla każdej wyprawy filtruje obecną pulę (po expedition_tags) i sortuje
 * malejąco po popularności. Wypisuje TS literal do wklejenia w expeditions.ts.
 *
 * Uruchom:  npx tsx scripts/generate-rosters.ts
 */
import { ANIMALS } from '../src/data/animals';
import { EXPEDITIONS } from '../src/data/expeditions';
import { popularityOf } from '../src/features/game/popularity';

function rosterFor(tag: string): string[] {
  return ANIMALS.filter((a) => a.expedition_tags?.includes(tag))
    .sort((a, b) => popularityOf(b.id) - popularityOf(a.id))
    .map((a) => a.id);
}

console.log('// === STARTOWE ROSTERY DLA WYPRAW ===');
console.log('// Wygenerowane z obecnych expedition_tags. Wklej `roster: [...]`');
console.log('// do każdego obiektu Expedition w src/data/expeditions.ts.');
console.log('');

for (const exp of EXPEDITIONS) {
  const ids = rosterFor(exp.tag);
  console.log(`// ${exp.id}  (tag: ${exp.tag}) — ${ids.length} zwierząt`);
  console.log(`  roster: [`);
  // 4 na linię dla czytelności
  for (let i = 0; i < ids.length; i += 4) {
    const chunk = ids.slice(i, i + 4).map((id) => `'${id}'`).join(', ');
    console.log(`    ${chunk},`);
  }
  console.log(`  ],`);
  console.log('');
}

// Statystyki — które zwierzęta są w 0 wypraw
const rosterAll = new Set<string>();
for (const exp of EXPEDITIONS) {
  for (const id of rosterFor(exp.tag)) rosterAll.add(id);
}
const orphans = ANIMALS.filter((a) => !rosterAll.has(a.id)).map((a) => a.id);
console.log('// === STATYSTYKI ===');
console.log(`// Łącznie zwierząt w jakiejkolwiek wyprawie: ${rosterAll.size}/${ANIMALS.length}`);
console.log(`// Zwierzęta NIE należące do żadnej wyprawy (${orphans.length}):`);
for (const id of orphans) console.log(`//   ${id}`);
