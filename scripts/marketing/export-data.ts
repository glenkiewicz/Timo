/**
 * Zrzut danych gry do JSON-a dla skryptów marketingowych w Pythonie
 * (`make-guess-video.py`, `make-carousel.py`). Dzięki temu treści na social
 * media czytają te same, zweryfikowane dane co aplikacja — nic nie jest
 * przepisywane ręcznie i nie ma drugiej kopii, która się rozjedzie.
 *
 * Uruchom:  npx --yes tsx scripts/marketing/export-data.ts
 * Wynik:    marketing/.cache/data.json (poza repo)
 */
import { createHash } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { ANIMAL_DETAILS } from '../../src/data/animal-details';
import { ANIMALS } from '../../src/data/animals';
import { QUESTIONS } from '../../src/data/questions';

const ROOT = resolve(__dirname, '../..');
const OUT = resolve(ROOT, 'marketing/.cache/data.json');

/** Ten sam skrót co w `scripts/generate-timo-voices.ts` — tekst → nazwa pliku mp3. */
function sha12(text: string): string {
  return createHash('sha1').update(text, 'utf-8').digest('hex').slice(0, 12);
}

/** Ścieżka klipu głosu dla tekstu albo `null`, gdy klip nie został wygenerowany. */
function voice(text: string): string | null {
  const rel = `assets/voices/${sha12(text)}.mp3`;
  return existsSync(resolve(ROOT, rel)) ? rel : null;
}

const animals = ANIMALS.map((a) => {
  const image = `assets/animals/${a.id}.webp`;
  const details = ANIMAL_DETAILS[a.id];
  return {
    id: a.id,
    name: a.name_pl,
    nameVoice: voice(a.name_pl),
    image: existsSync(resolve(ROOT, image)) ? image : null,
    attributes: a.attributes,
    facts: details?.facts_pl ?? [a.fun_fact_pl],
    tagline: details?.tagline_pl ?? null,
    size: details?.size_pl ?? null,
    diet: details?.diet_pl ?? null,
    lifespan: details?.lifespan_pl ?? null,
  };
});

const questions = QUESTIONS.map((q) => ({
  id: q.id,
  attribute: q.attribute_key,
  text: q.core[0],
  voice: voice(q.core[0]),
}));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ animals, questions }, null, 1));
console.log(
  `${animals.length} zwierząt (${animals.filter((a) => a.nameVoice).length} z głosem), ` +
    `${questions.length} pytań (${questions.filter((q) => q.voice).length} z głosem) → ${OUT}`,
);
