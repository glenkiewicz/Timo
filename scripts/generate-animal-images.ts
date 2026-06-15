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
const files = fs.readdirSync(ASSETS_DIR)
  .filter((f) => f.endsWith('.jpg'))
  .sort();

console.log(`/* eslint-disable */`);
console.log(`// AUTO-GENERATED przez scripts/generate-animal-images.ts`);
console.log(`// Mapa animal_id → wynik require('../assets/animals/<id>.jpg').`);
console.log(`// Re-generuj po dodaniu/usunięciu plików zdjęć.`);
console.log(``);
console.log(`export const ANIMAL_IMAGES: Record<string, number> = {`);
for (const file of files) {
  const id = file.replace(/\.jpg$/, '');
  console.log(`  ${JSON.stringify(id)}: require('../../assets/animals/${file}'),`);
}
console.log(`};`);
console.log(``);
console.log(`export function animalImageFor(id: string): number | undefined {`);
console.log(`  return ANIMAL_IMAGES[id];`);
console.log(`}`);
