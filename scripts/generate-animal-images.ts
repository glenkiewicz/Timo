/* eslint-disable */
/**
 * Generuje statyczną mapę `Record<animal_id, require(path)>` dla wszystkich
 * 500 zdjęć w assets/animals/. React Native NIE obsługuje dynamicznego
 * require z runtime path — musimy mieć każdy require statycznie zapisany.
 *
 * Uruchom:  npx tsx scripts/generate-animal-images.ts > src/data/animal-images.ts
 */
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets', 'animals');
// Rysowane portrety (.webp z kanałem alfa) wypierają fotografie (.jpg).
// Gdy zwierzę ma oba pliki, wygrywa webp — dzięki temu można podmieniać
// kolekcję partiami, bez jednorazowego przegenerowania wszystkich 715.
const EXT_ORDER = ['.webp', '.jpg'];
const byId = new Map<string, string>();
for (const f of fs.readdirSync(ASSETS_DIR).sort()) {
  const ext = EXT_ORDER.find((e) => f.endsWith(e));
  if (!ext) continue;
  const id = f.slice(0, -ext.length);
  const current = byId.get(id);
  if (!current || EXT_ORDER.indexOf(ext) < EXT_ORDER.indexOf(path.extname(current))) {
    byId.set(id, f);
  }
}
const files = [...byId.values()].sort();

console.log(`/* eslint-disable */`);
console.log(`// AUTO-GENERATED przez scripts/generate-animal-images.ts`);
console.log(`// Mapa animal_id → wynik require('../assets/animals/<id>.webp|jpg').`);
console.log(`// Re-generuj po dodaniu/usunięciu plików zdjęć.`);
console.log(``);
console.log(`export const ANIMAL_IMAGES: Record<string, number> = {`);
for (const file of files) {
  const id = file.replace(/\.(webp|jpg)$/, '');
  console.log(`  ${JSON.stringify(id)}: require('../../assets/animals/${file}'),`);
}
console.log(`};`);
console.log(``);
console.log(`/**`);
console.log(` * Zwierzęta z rysowanym portretem (.webp z kanałem alfa).`);
console.log(` *`);
console.log(` * Tylko dla nich można pokazać SYLWETKĘ nieodkrytego zwierzaka — fotografia`);
console.log(` * bez alfy zamieniłaby się po przyciemnieniu w jednolity kwadrat.`);
console.log(` */`);
console.log(`export const ILLUSTRATED_ANIMALS: ReadonlySet<string> = new Set([`);
for (const file of files.filter((f) => f.endsWith('.webp'))) {
  console.log(`  ${JSON.stringify(file.replace(/\.webp$/, ''))},`);
}
console.log(`]);`);
console.log(``);
console.log(`export function animalImageFor(id: string): number | undefined {`);
console.log(`  return ANIMAL_IMAGES[id];`);
console.log(`}`);
