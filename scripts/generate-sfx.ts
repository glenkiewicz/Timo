/* eslint-disable */
// @ts-nocheck — skrypt Node (tsx); tsconfig aplikacji nie zna typów Node.
/**
 * Efekty dźwiękowe gry przez ElevenLabs Sound Effects (/v1/sound-generation).
 *
 * Każdy dźwięk w kilku wariantach do odsłuchu — ucho wybiera, nie model.
 * Warianty lądują w assets/sfx/_candidates/<nazwa>-<n>.mp3 (poza repo);
 * wybrany kopiujemy do assets/sfx/<nazwa>.mp3.
 *
 * Prompty po angielsku — model efektów rozumie je dużo lepiej niż polskie.
 * Wspólny dopisek trzyma charakter: miękko, ciepło, przyjaźnie dla dziecka,
 * bez ostrych i głośnych brzmień, które męczyłyby przy setnym stuknięciu.
 *
 * Uruchom:  npx tsx scripts/generate-sfx.ts [<nazwa> ...] [--variants=3]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
for (const line of readFileSync(resolve(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error('Brak ELEVENLABS_API_KEY w .env');

const STYLE =
  ' Soft, warm and friendly sound for a gentle children\'s mobile game, clean, no music bed, no voice, no harsh or loud transients.';

/** nazwa → [opis, długość w sekundach] */
export const SFX: Record<string, [string, number]> = {
  'tap': ['A single soft wooden block tap, like pressing a chunky wooden toy button.', 0.5],
  'tap-small': ['A very short, quiet, light click, like a tiny soft plastic toy tap.', 0.5],
  'sheet-open': ['A short soft airy whoosh sliding upward, like a cosy panel sliding into view.', 0.8],
  'sheet-close': ['A short soft airy whoosh sliding downward, quicker and quieter.', 0.6],
  'transition': ['A gentle short paper rustle, like turning a page of a picture book.', 0.7],
  'answer-yes': ['A cheerful bright little bubble pop, positive and playful.', 0.5],
  'answer-no': ['A soft low wooden knock pop, neutral and friendly, not negative or sad.', 0.5],
  'new-animal': ['A short joyful magical xylophone melody of four rising notes with a light sparkle.', 1.6],
  'new-badge': ['Sparkling small bell chimes, a short celebratory twinkle.', 1.5],
  'level-up': ['A short cheerful fanfare played on a toy trumpet and xylophone.', 2.0],
  'locked': ['A soft muffled cushioned thump, gentle and short.', 0.5],
};

const args = process.argv.slice(2);
const variants = Number(args.find((a) => a.startsWith('--variants='))?.split('=')[1] ?? 3);
const names = args.filter((a) => !a.startsWith('--'));
const OUT = resolve(ROOT, 'assets', 'sfx', '_candidates');

async function generate(text: string, duration: number): Promise<Buffer> {
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text + STYLE, duration_seconds: duration, prompt_influence: 0.5 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const list = names.length ? names : Object.keys(SFX);
  let ok = 0;
  for (const name of list) {
    const [text, duration] = SFX[name];
    for (let v = 1; v <= variants; v++) {
      const path = resolve(OUT, `${name}-${v}.mp3`);
      if (existsSync(path)) continue;
      try {
        writeFileSync(path, await generate(text, duration));
        ok++;
        console.log(`  gotowe  ${name}-${v}`);
      } catch (e) {
        console.log(`  BLAD    ${name}-${v}  ${(e as Error).message}`);
        if (String(e).includes('401') || String(e).includes('403')) return;
      }
    }
  }
  console.log(`\nwygenerowano ${ok}`);
}

main();
