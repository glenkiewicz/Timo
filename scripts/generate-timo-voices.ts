/* eslint-disable */
/**
 * Generator głosu Timo przez ElevenLabs.
 *
 * ETAP 1 (rozgrywka) — generujemy tylko to co Timo mówi w grze:
 *   - static    : kwestie z src/data/timo-lines.ts (wygłupy, ciepło–zimno, reakcje,
 *                 strzały, pudła, intra, victory etc.)
 *   - questions : pytania z src/data/questions.ts — rdzenie, setupy i reakcje
 *                 (klucze q.{id}.core.{i}, q.{id}.setup.{i}, q.{id}.yes.{i}, q.{id}.no.{i})
 *   - animals   : nazwy zwierząt (name_pl) z src/data/animals.ts
 *   - all       : wszystkie 3 powyżej
 *
 * ETAP 2 (później) — opisy na karcie zwierzęcia (fun_fact, tagline, facts itd.) —
 * NIE generujemy teraz.
 *
 * Tryby:
 *   --smoke              : 20 reprezentatywnych kwestii do assets/voices/_smoke/ (do odsłuchu)
 *   --kind=KIND          : static | questions | animals | all  (domyślnie all)
 *   --dry-run            : tylko wypisz co byłoby wygenerowane, bez API calls
 *   --force              : regeneruj wszystko, mimo manifestu
 *   --prune              : usuń z manifestu klucze, których nie ma już w tekstach,
 *                          i skasuj MP3, do których nic już nie prowadzi
 *
 * `voice-manifest.ts` zawsze zawiera tylko klucze obecne w aktualnych tekstach —
 * stare klipy (np. dawne prefiksy) nie trafiają do bundla nawet bez --prune.
 *
 * Uruchom:
 *   npx tsx scripts/generate-timo-voices.ts --kind=static    # pierwsze, najmniejsze
 *   npx tsx scripts/generate-timo-voices.ts --kind=questions
 *   npx tsx scripts/generate-timo-voices.ts --kind=animals
 *   npx tsx scripts/generate-timo-voices.ts --kind=all
 *
 * Po sukcesie skrypt emituje src/data/voice-manifest.ts (lookup tabela).
 */

import {
	createHash,
} from 'crypto';
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from 'fs';
import { dirname, resolve } from 'path';

import { ANIMALS } from '../src/data/animals';
import { QUESTIONS, questionLines } from '../src/data/questions';
import {
	EXPEDITION_INTROS,
	GENERIC_EXPEDITION_INTRO,
	GIVE_UP_LINES,
	GREETINGS,
	GUESS_INTROS,
	GUIDED_GIVE_UP_LINES,
	HEAT_HOT_LINES,
	HEAT_WARM_LINES,
	MISS_LINES,
	OUTSIDE_CATEGORY_LINES,
	REACTION_HARD,
	REACTION_IDK,
	REACTION_SHORT,
	STREAK_LINES,
	STREAK_MILESTONE_LINES,
	VICTORY_LINES,
	WYGLUPY,
} from '../src/data/timo-lines';

// ------------------------------------------------------------
// 1) Załaduj .env (zero deps — własny parser)
// ------------------------------------------------------------
const ROOT = resolve(__dirname, '..');
const ENV_PATH = resolve(ROOT, '.env');

if (!existsSync(ENV_PATH)) {
	console.error(`[FATAL] Brak .env pod ${ENV_PATH}`);
	console.error('Stwórz .env i wpisz ELEVENLABS_API_KEY oraz ELEVENLABS_VOICE_ID.');
	process.exit(1);
}

for (const line of readFileSync(ENV_PATH, 'utf-8').split('\n')) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('#')) continue;
	const eq = trimmed.indexOf('=');
	if (eq < 0) continue;
	const key = trimmed.slice(0, eq).trim();
	const val = trimmed
		.slice(eq + 1)
		.trim()
		.replace(/^["']|["']$/g, '');
	if (!process.env[key]) process.env[key] = val;
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// ------------------------------------------------------------
// 2) Parsuj CLI
// ------------------------------------------------------------
const args = process.argv.slice(2);
const isSmoke = args.includes('--smoke');
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');
const isPrune = args.includes('--prune');

const kindArg = args.find((a) => a.startsWith('--kind='));
type Kind = 'static' | 'questions' | 'animals' | 'all';
const kind: Kind = ((): Kind => {
	if (!kindArg) return 'all';
	const v = kindArg.slice('--kind='.length);
	if (v === 'static' || v === 'questions' || v === 'animals' || v === 'all') return v;
	console.error(`[FATAL] Nieznany --kind="${v}". Dozwolone: static, questions, animals, all.`);
	process.exit(1);
})();

/**
 * --regen=voiceKey1,voiceKey2,...
 *
 * Regeneruje TYLKO podane voiceKey, ignoruje skip-if-hash-matches. Idealne do
 * iteracyjnego poprawiania konkretnych klipów które brzmiały słabo. Każda nowa
 * generacja ElevenLabs daje inny seed → inny ton.
 *
 * Przykład:
 *   npx tsx scripts/generate-timo-voices.ts --regen=question.q_water.0,reaction.yes.2
 */
const regenArg = args.find((a) => a.startsWith('--regen='));
const regenKeys: Set<string> | null = regenArg
	? new Set(
			regenArg
				.slice('--regen='.length)
				.split(',')
				.map((s) => s.trim())
				.filter((s) => s.length > 0),
		)
	: null;

if (!API_KEY || !VOICE_ID) {
	if (!isDryRun) {
		console.error('[FATAL] ELEVENLABS_API_KEY i/lub ELEVENLABS_VOICE_ID nie są ustawione w .env.');
		console.error('Otwórz .env i wpisz wartości (Voice ID znajdziesz w dashboardzie ElevenLabs → Voices → Twój custom voice).');
		process.exit(1);
	}
}

// ------------------------------------------------------------
// 3) ElevenLabs API config
// ------------------------------------------------------------
const ELEVEN_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

/**
 * Voice settings dla ElevenLabs.
 *
 * - `stability` (0-1): niższe = więcej emocji i intonacji, wyższe = monotonniej.
 *   Dla detektywa-lisa chcemy żywej intonacji → niski stability.
 * - `similarity_boost` (0-1): jak blisko klonowanego głosu. Niższe = naturalniej.
 * - `style` (0-1): wzmocnienie charakteru głosu (intonacji, ekspresji).
 *   Daje wyraźnie żywsze pytania, kosztem ~10% więcej latency.
 * - `speed` (0.7-1.2): tempo. 1.0 = naturalne; runtime dodatkowo skaluje
 *   przez `playbackRate=0.85` w timo-voice.ts.
 *
 * Po próbie 0.45/0.8/0/1.0 (zbyt monotonny, czasem zły ton w pytaniach)
 * → 0.30/0.70/0.20 (więcej emocji, wzmocniony charakter, bardziej naturalne).
 */
const VOICE_SETTINGS = {
	stability: 0.30,
	similarity_boost: 0.70,
	style: 0.20,
	speed: 1.0,
};

const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_128';

async function fetchTts(text: string): Promise<Buffer> {
	const res = await fetch(`${ELEVEN_URL}?output_format=${OUTPUT_FORMAT}`, {
		method: 'POST',
		headers: {
			'xi-api-key': API_KEY!,
			'Content-Type': 'application/json',
			Accept: 'audio/mpeg',
		},
		body: JSON.stringify({
			text,
			model_id: MODEL_ID,
			voice_settings: VOICE_SETTINGS,
		}),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`HTTP ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
	}

	return Buffer.from(await res.arrayBuffer());
}

function sleep(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

function sha12(text: string): string {
	return createHash('sha1').update(text, 'utf-8').digest('hex').slice(0, 12);
}

// ------------------------------------------------------------
// 4) SMOKE MODE (zostaje jak było — 20 plików do _smoke/)
// ------------------------------------------------------------
type SmokeLine = { slug: string; text: string };

const SMOKE_LINES: SmokeLine[] = [
	{ slug: 'setup_water_kalosze', text: 'Ja do wody wchodzę tylko w kaloszach.' },
	{ slug: 'core_water', text: 'Czy twoje zwierzę żyje w wodzie?' },
	{ slug: 'core_mammal_przyklady', text: 'Czy twoje zwierzę jest ssakiem, jak pies, krowa albo słoń?' },
	{ slug: 'wyglup_skarpetki', text: 'Czy twoje zwierzę nosi skarpetki? Hi, hi, żartuję!' },
	{ slug: 'heat_hot', text: 'Gorąco! Aż mi parzy nos!' },
	{ slug: 'yes_water_pletwy', text: 'Plusk! Zakładam płetwy.' },
	{ slug: 'no_fly_tup_tup', text: 'Chodzi po ziemi, tak jak ja. Tup, tup!' },
	{ slug: 'miss_katar', text: 'Pudło! Mój nos chyba ma katar.' },
	{ slug: 'intro_water_friends', text: 'Witaj w Wodnych Zwierzakach! Pomyśl o jednym z nich, a ja spróbuję zgadnąć.' },
	{ slug: 'intro_forest_kids', text: 'Idziemy do lasu! Pomyśl o jednym z leśnych zwierzaków — to nasza tajemnica.' },
	{ slug: 'greeting_pakuj_lornetke', text: 'Pakuj lornetkę — tropimy!' },
	{ slug: 'guess_intro_nos', text: 'Mój nos mówi, że to…' },
	{ slug: 'animal_dog_pies', text: 'Pies' },
	{ slug: 'animal_brown_bear_niedzwiedz_brunatny', text: 'Niedźwiedź brunatny' },
	{ slug: 'victory_druzyna', text: 'Udało się! Jesteśmy świetną drużyną.' },
	{ slug: 'giveup_zagadka', text: 'Ale zagadka! Kto to był?' },
	{ slug: 'fact_dog', text: 'Pies potrafi nauczyć się ponad 150 słów!' },
	{ slug: 'fact_hedgehog', text: 'Jeż ma do 7000 kolców na grzbiecie.' },
	{ slug: 'reaction_idk_nos', text: 'Nie szkodzi. Mój nos coś wymyśli.' },
	{ slug: 'outside_category', text: 'Oho! Twoje zwierzę nie pasuje do tej wyprawy. Super, lubię niespodzianki!' },
];

async function runSmoke(): Promise<void> {
	const outDir = resolve(ROOT, 'assets', 'voices', '_smoke');
	console.log(`\nSMOKE — ${SMOKE_LINES.length} kwestii do ${outDir}\n`);
	if (isDryRun) {
		SMOKE_LINES.forEach((l, i) =>
			console.log(`[dry-run] ${String(i + 1).padStart(2, '0')}. ${l.slug}: "${l.text}"`),
		);
		return;
	}
	let success = 0;
	const failed: Array<{ slug: string; error: string }> = [];
	for (let i = 0; i < SMOKE_LINES.length; i++) {
		const line = SMOKE_LINES[i];
		const num = String(i + 1).padStart(2, '0');
		const outPath = resolve(outDir, `${num}_${line.slug}.mp3`);
		process.stdout.write(`${num}/${SMOKE_LINES.length} ${line.slug.padEnd(45)} ... `);
		try {
			const buf = await fetchTts(line.text);
			mkdirSync(dirname(outPath), { recursive: true });
			writeFileSync(outPath, buf);
			success += 1;
			console.log('OK');
		} catch (e: any) {
			failed.push({ slug: line.slug, error: e.message ?? String(e) });
			console.log('FAIL');
			console.error(`    ${e.message ?? e}`);
		}
		if (i < SMOKE_LINES.length - 1) await sleep(300);
	}
	console.log(`\n———\nSukces: ${success}/${SMOKE_LINES.length}`);
	if (failed.length > 0) {
		console.log(`Błędy: ${failed.length}`);
		failed.forEach((f) => console.log(`  - ${f.slug}: ${f.error.slice(0, 200)}`));
		process.exit(1);
	}
	console.log(`\nPliki: ${outDir}\nOtwórz w Finderze: open ${outDir}`);
}

// ------------------------------------------------------------
// 5) Pełne mody — kindy + manifest
// ------------------------------------------------------------
type Line = { voiceKey: string; text: string };

function buildStaticLines(): Line[] {
	const lines: Line[] = [];
	const pools: Array<[string, readonly string[]]> = [
		['wyglup', WYGLUPY],
		['heat.warm', HEAT_WARM_LINES],
		['heat.hot', HEAT_HOT_LINES],
		['reaction.short', REACTION_SHORT],
		['reaction.idk', REACTION_IDK],
		['reaction.hard', REACTION_HARD],
		['greeting', GREETINGS],
		['streak', STREAK_LINES],
		['streak_milestone', STREAK_MILESTONE_LINES],
		['victory', VICTORY_LINES],
		['giveup', GIVE_UP_LINES],
		['guided_giveup', GUIDED_GIVE_UP_LINES],
		['guess_intro', GUESS_INTROS],
		['miss', MISS_LINES],
		['outside', OUTSIDE_CATEGORY_LINES],
		['intro.generic', GENERIC_EXPEDITION_INTRO],
		...Object.entries(EXPEDITION_INTROS).map(
			([expId, pool]) => [`intro.${expId}`, pool] as [string, readonly string[]],
		),
	];
	for (const [prefix, pool] of pools) {
		pool.forEach((text, i) => lines.push({ voiceKey: `${prefix}.${i}`, text }));
	}
	return lines;
}

function buildQuestionLines(): Line[] {
	const lines: Line[] = [];
	for (const q of QUESTIONS) {
		for (const part of ['core', 'setup', 'yes', 'no'] as const) {
			for (const l of questionLines(q, part)) lines.push({ voiceKey: l.voiceKey, text: l.text });
		}
	}
	return lines;
}

function buildAnimalLines(): Line[] {
	// ETAP 1 — tylko nazwa zwierzęcia (name_pl).
	// ETAP 2 (TODO) — fun_fact_pl + opisy z animal-details.
	return ANIMALS.map((a) => ({ voiceKey: `animal.${a.id}`, text: a.name_pl }));
}

function buildLines(k: Kind): Line[] {
	const out: Line[] = [];
	if (k === 'static' || k === 'all') out.push(...buildStaticLines());
	if (k === 'questions' || k === 'all') out.push(...buildQuestionLines());
	if (k === 'animals' || k === 'all') out.push(...buildAnimalLines());
	// Deduplikuj po voiceKey (na wszelki wypadek; nie powinno być duplikatów).
	const seen = new Set<string>();
	return out.filter((l) => {
		if (seen.has(l.voiceKey)) return false;
		seen.add(l.voiceKey);
		return true;
	});
}

// ------------------------------------------------------------
// 6) Manifest
// ------------------------------------------------------------
type ManifestEntry = { hash: string; file: string; text: string; generatedAt: string };
type Manifest = Record<string, ManifestEntry>;

const VOICES_DIR = resolve(ROOT, 'assets', 'voices');
const MANIFEST_PATH = resolve(VOICES_DIR, '__manifest.json');
const TS_MANIFEST_PATH = resolve(ROOT, 'src', 'data', 'voice-manifest.ts');

function readManifest(): Manifest {
	if (!existsSync(MANIFEST_PATH)) return {};
	try {
		return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')) as Manifest;
	} catch (e) {
		console.error(`[WARN] Manifest nieczytelny, startujemy od zera:`, e);
		return {};
	}
}

function writeManifest(m: Manifest): void {
	mkdirSync(VOICES_DIR, { recursive: true });
	writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

/** Wszystkie voiceKey, które występują w aktualnych tekstach (niezależnie od --kind). */
function currentVoiceKeys(): Set<string> {
	return new Set(buildLines('all').map((l) => l.voiceKey));
}

/**
 * Usuwa z manifestu klucze, których nie ma już w tekstach, i kasuje MP3,
 * do których nie prowadzi żaden klucz. Pliki z `_smoke/` zostają.
 */
function pruneManifest(m: Manifest): Manifest {
	const valid = currentVoiceKeys();
	const pruned: Manifest = {};
	let removedKeys = 0;
	for (const [k, v] of Object.entries(m)) {
		if (valid.has(k)) pruned[k] = v;
		else removedKeys += 1;
	}
	const usedFiles = new Set(Object.values(pruned).map((e) => e.file));
	let removedFiles = 0;
	for (const f of readdirSync(VOICES_DIR)) {
		if (!f.endsWith('.mp3') || usedFiles.has(f)) continue;
		unlinkSync(resolve(VOICES_DIR, f));
		removedFiles += 1;
	}
	console.log(`\n🧹 PRUNE — usunięte klucze: ${removedKeys}, usunięte MP3: ${removedFiles}`);
	return pruned;
}

function emitTsManifest(m: Manifest): void {
	// Tylko klucze obecne w aktualnych tekstach — stare klipy nie trafiają do bundla.
	// Sortowanie po voiceKey dla stabilności diffów.
	const valid = currentVoiceKeys();
	const keys = Object.keys(m)
		.filter((k) => valid.has(k))
		.sort();
	const hashes = new Set<string>();
	for (const k of keys) hashes.add(m[k].hash);
	const sortedHashes = Array.from(hashes).sort();

	let out = `/* eslint-disable */\n`;
	out += `// AUTO-GENERATED przez scripts/generate-timo-voices.ts\n`;
	out += `// NIE edytuj ręcznie — regeneruje się przy każdym uruchomieniu skryptu.\n`;
	out += `\n`;
	out += `export const VOICE_FILES: Record<string, number> = {\n`;
	for (const h of sortedHashes) {
		out += `  ${JSON.stringify(h)}: require('../../assets/voices/${h}.mp3'),\n`;
	}
	out += `};\n\n`;
	out += `export const VOICE_LOOKUP: Record<string, string> = {\n`;
	for (const k of keys) {
		out += `  ${JSON.stringify(k)}: ${JSON.stringify(m[k].hash)},\n`;
	}
	out += `};\n\n`;
	out += `/**\n * Zwraca wynik \`require(...)\` dla audio MP3 dla danego voiceKey,\n * lub \`null\` jeśli nie ma takiego klucza w manifescie.\n */\n`;
	out += `export function voiceFor(voiceKey: string): number | null {\n`;
	out += `  const hash = VOICE_LOOKUP[voiceKey];\n`;
	out += `  return hash ? (VOICE_FILES[hash] ?? null) : null;\n`;
	out += `}\n`;

	mkdirSync(dirname(TS_MANIFEST_PATH), { recursive: true });
	writeFileSync(TS_MANIFEST_PATH, out);
}

// ------------------------------------------------------------
// 7) Główna pętla generacji
// ------------------------------------------------------------
async function runFull(): Promise<void> {
	let lines = buildLines(kind);

	// --regen filtruje do podanych voiceKey i ignoruje skip-if-hash.
	if (regenKeys) {
		const allByKey = new Map(lines.map((l) => [l.voiceKey, l] as const));
		const missing: string[] = [];
		const filtered: Line[] = [];
		for (const key of regenKeys) {
			const line = allByKey.get(key);
			if (line) filtered.push(line);
			else missing.push(key);
		}
		if (missing.length > 0) {
			console.error(`[WARN] Nieznane voiceKey w --regen (ignoruję):`);
			missing.forEach((k) => console.error(`  - ${k}`));
		}
		if (filtered.length === 0) {
			console.error(`[FATAL] Żaden voiceKey z --regen nie pasuje do aktualnego --kind=${kind}.`);
			console.error(`Pamiętaj że pytania z setupami i reakcjami (q.*) są w --kind=questions, pozostałe kwestie w --kind=static, nazwy w --kind=animals.`);
			process.exit(1);
		}
		lines = filtered;
		console.log(`\n🔄 REGEN MODE — regeneruję ${filtered.length} konkretnych klipów (ignoruję skip-if-hash).`);
	}

	console.log(`\nKIND: ${kind}`);
	console.log(`Linii do rozważenia: ${lines.length}`);
	const totalChars = lines.reduce((s, l) => s + l.text.length, 0);
	console.log(`Łączna liczba znaków (input do ElevenLabs): ${totalChars}`);
	console.log(`Voice ID: ${VOICE_ID ?? '(brak — dry-run)'}`);
	console.log(`Settings: stability=${VOICE_SETTINGS.stability}, similarity=${VOICE_SETTINGS.similarity_boost}, style=${VOICE_SETTINGS.style}, speed=${VOICE_SETTINGS.speed}`);
	console.log(`Output dir: ${VOICES_DIR}\n`);

	if (isDryRun) {
		const head = Math.min(lines.length, 12);
		console.log(`[dry-run] Pierwsze ${head} linii:`);
		lines.slice(0, head).forEach((l, i) =>
			console.log(`  ${String(i + 1).padStart(3, '0')}. ${l.voiceKey.padEnd(35)}  "${l.text.slice(0, 80)}${l.text.length > 80 ? '...' : ''}"`),
		);
		if (lines.length > head) console.log(`  ... + ${lines.length - head} dalszych`);
		console.log(`\n[dry-run] Bez API calls i bez zapisu plików.`);
		return;
	}

	let manifest = readManifest();
	mkdirSync(VOICES_DIR, { recursive: true });

	let success = 0;
	let skipped = 0;
	const failed: Array<{ voiceKey: string; error: string }> = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const num = String(i + 1).padStart(4, ' ');
		const hash = sha12(line.text);
		const filename = `${hash}.mp3`;
		const outPath = resolve(VOICES_DIR, filename);
		const existing = manifest[line.voiceKey];

		// Skip jeśli hash matches, plik istnieje, brak --force, brak --regen dla tego klucza.
		const isRegenTarget = regenKeys !== null && regenKeys.has(line.voiceKey);
		if (!isForce && !isRegenTarget && existing && existing.hash === hash && existsSync(outPath)) {
			skipped += 1;
			if (skipped % 50 === 0) {
				console.log(`  ... ${skipped} pominiętych (już wygenerowane)`);
			}
			continue;
		}

		process.stdout.write(`${num}/${lines.length} ${line.voiceKey.padEnd(35)} ${hash} ... `);

		try {
			const buf = await fetchTts(line.text);
			writeFileSync(outPath, buf);
			manifest[line.voiceKey] = {
				hash,
				file: filename,
				text: line.text,
				generatedAt: new Date().toISOString(),
			};
			// Incremental save manifestu (po każdym sukcesie) — w razie crashu nic nie tracimy.
			writeManifest(manifest);
			success += 1;
			console.log('OK');
		} catch (e: any) {
			failed.push({ voiceKey: line.voiceKey, error: e.message ?? String(e) });
			console.log('FAIL');
			console.error(`    ${e.message ?? e}`);
		}

		if (i < lines.length - 1) await sleep(300);
	}

	console.log(`\n———`);
	console.log(`Sukces:    ${success}`);
	console.log(`Pominięte: ${skipped} (już w manifescie z aktualnym hashem)`);
	console.log(`Błędy:     ${failed.length}`);
	if (failed.length > 0) {
		failed.slice(0, 20).forEach((f) => console.log(`  - ${f.voiceKey}: ${f.error.slice(0, 200)}`));
		if (failed.length > 20) console.log(`  ... + ${failed.length - 20} dalszych błędów`);
	}

	if (isPrune) {
		manifest = pruneManifest(manifest);
		writeManifest(manifest);
	}
	emitTsManifest(manifest);
	console.log(`\nManifest zapisany:    ${MANIFEST_PATH}`);
	console.log(`TS lookup zapisany:   ${TS_MANIFEST_PATH}`);
	console.log(`MP3 w katalogu:       ${VOICES_DIR}`);

	if (failed.length > 0) process.exit(1);
}

// ------------------------------------------------------------
// 8) Entry point
// ------------------------------------------------------------
async function main(): Promise<void> {
	if (isSmoke) {
		await runSmoke();
		return;
	}
	await runFull();
}

main().catch((e) => {
	console.error('[FATAL]', e);
	process.exit(1);
});
