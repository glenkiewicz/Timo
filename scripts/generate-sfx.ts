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
import { execFileSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
for (const line of readFileSync(resolve(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error('Brak ELEVENLABS_API_KEY w .env');

const STYLE =
  ' Extremely subtle and quiet, minimal, soft and rounded, like a tiny sound in a calm picture-book app for small children. Clean single sound, no music bed, no voice, no reverb tail, no harsh or loud transients.';

/**
 * nazwa → [opis, długość zamówiona w API, docelowa długość po przycięciu].
 *
 * API nie zejdzie poniżej 0,5 s i dokłada ciszę na początku — przy `tap`
 * właściwy dźwięk zaczynał się dopiero po ~220 ms, więc przy szybkim
 * stukaniu grał „raz tak, raz nie”. Dlatego każdy plik przechodzi przez
 * ffmpeg: cięcie ciszy z przodu, skrócenie do długości ANIMACJI, której
 * towarzyszy (panel wjeżdża 280 ms, zjeżdża 200 ms), wyciszenie końca
 * i jedna, niska głośność dla wszystkich.
 */
export const SFX: Record<string, [string, number, number]> = {
  'tap': ['A tiny soft muted wooden tick, like a fingertip on a small wooden toy.', 0.5, 0.12],
  'tap-small': ['An extremely tiny soft tick, barely audible, like a feather touching paper.', 0.5, 0.08],
  'sheet-open': ['A very soft short breathy swish moving upward, like a sheet of paper sliding.', 0.5, 0.28],
  'sheet-close': ['A very soft short breathy swish moving downward, like a sheet of paper sliding away.', 0.5, 0.2],
  'transition': ['A very soft faint paper whisper, like one page gently turning.', 0.5, 0.3],
  'answer-yes': ['A tiny soft bright bubble blip, gentle and positive.', 0.5, 0.15],
  'answer-no': ['A tiny soft low wooden blip, gentle and neutral.', 0.5, 0.15],
  'new-animal': ['A short gentle sparkle of three soft rising celesta notes.', 1.2, 0.9],
  'new-badge': ['A short soft twinkle of tiny bells.', 1.0, 0.8],
  'level-up': ['A short soft cheerful rising melody of four celesta notes.', 1.5, 1.2],
  'locked': ['A tiny soft muffled cushioned bump.', 0.5, 0.18],
};

/**
 * Jedna, cicha głośność dla wszystkich efektów — średnia w dB i sufit szczytu.
 * NIE loudnorm: ten potrzebuje co najmniej 0,4 s dźwięku i krótkie stuknięcia
 * zostawiał głośne (szczyty −4 dB), a długie melodyjki ściszał — odwrotnie,
 * niż trzeba.
 */
const TARGET_MEAN_DB = -34;
const PEAK_CEILING_DB = -12;

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

/**
 * Cisza z przodu precz, długość do animacji, miękkie wyciszenie końca,
 * mono i wspólna głośność. Dwa przebiegi loudnorm byłyby dokładniejsze,
 * ale przy dźwiękach krótszych niż pół sekundy pomiar i tak jest zgrubny.
 */
function trim(input: string, output: string, seconds: number): void {
  const fade = Math.min(0.06, seconds * 0.4);
  const shaped = output.replace(/\.mp3$/, '.shaped.wav');
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', input,
    '-af', [
      'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.005',
      `atrim=0:${seconds}`,
      `afade=t=out:st=${Math.max(0, seconds - fade)}:d=${fade}`,
    ].join(','),
    '-ac', '1', '-ar', '44100', shaped,
  ]);
  level(shaped, output);
  unlinkSync(shaped);
}

/** Wzmocnienie liczone z pomiaru: średnia do celu, ale szczyt nie wyżej niż sufit. */
export function level(input: string, output: string): void {
  // volumedetect pisze pomiar na stderr, nie stdout.
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', input, '-af', 'volumedetect', '-f', 'null', '-'], {
    encoding: 'utf-8',
  }).stderr;
  const mean = Number(/mean_volume: (-?[0-9.]+) dB/.exec(out)?.[1] ?? TARGET_MEAN_DB);
  const peak = Number(/max_volume: (-?[0-9.]+) dB/.exec(out)?.[1] ?? PEAK_CEILING_DB);
  const gain = Math.min(TARGET_MEAN_DB - mean, PEAK_CEILING_DB - peak);
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', input, '-af', `volume=${gain.toFixed(1)}dB`,
    '-ac', '1', '-ar', '44100', '-b:a', '96k', output,
  ]);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const list = names.length ? names : Object.keys(SFX);
  let ok = 0;
  for (const name of list) {
    const [text, duration, target] = SFX[name];
    for (let v = 1; v <= variants; v++) {
      const path = resolve(OUT, `${name}-${v}.mp3`);
      if (existsSync(path)) continue;
      try {
        const raw = path.replace(/\.mp3$/, '.raw.mp3');
        writeFileSync(raw, await generate(text, duration));
        trim(raw, path, target);
        unlinkSync(raw);
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
