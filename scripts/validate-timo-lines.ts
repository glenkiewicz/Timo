/* eslint-disable */
/**
 * Walidator tekstów Timo: pilnuje budowy pytań i kwestii z `questions.ts`
 * oraz `timo-lines.ts`. Uruchamiać po każdej zmianie tekstów, PRZED
 * generowaniem głosów (`scripts/generate-timo-voices.ts`).
 *
 * Uruchom:  npx tsx scripts/validate-timo-lines.ts
 * Exit code 1 przy błędach.
 */
import { QUESTIONS } from '../src/data/questions';
import * as LINES from '../src/data/timo-lines';

let errors = 0;

function err(where: string, text: string, msg: string) {
  console.error(`  ERROR [${where}] ${msg}\n         „${text}"`);
  errors++;
}

const words = (t: string) => t.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

/** Wzorce zakazane we wszystkich tekstach. */
const FORBIDDEN: Array<[RegExp, string]> = [
  [/\b(Wiesz|Powiedz mi),? czy\b/i, '„Wiesz, czy…” / „Powiedz mi, czy…” — dziecko może odpowiedzieć „tak, wiem”'],
  [/^A czy\b/, '„A czy…” na początku — nie ma do czego nawiązać'],
  [/:\s*$/, 'kończy się dwukropkiem — nie da się tego skleić z pytaniem'],
  [/\p{L}+(łeś|łaś|łbyś|łabyś)(?!\p{L})/u, 'forma z płcią dziecka (np. „wygrałeś”, „mógłbyś”)'],
  [/\b(odkrywco|tropicielu|tropicielko|detektywie|kolego|koleżanko)\b/i, 'wołacz z płcią dziecka'],
  [/\s{2,}|^\s|\s$/, 'podwójna spacja albo spacja na brzegu'],
];

function checkCommon(where: string, text: string) {
  for (const [re, msg] of FORBIDDEN) if (re.test(text)) err(where, text, msg);
}

function checkPool(where: string, pool: readonly string[], min: number) {
  if (pool.length < min) err(where, pool.join(' | '), `za mało kwestii (${pool.length} < ${min})`);
  const seen = new Set<string>();
  for (const t of pool) {
    if (seen.has(t)) err(where, t, 'duplikat w puli');
    seen.add(t);
    checkCommon(where, t);
  }
}

// ---------- pytania ----------
console.log(`Sprawdzam ${QUESTIONS.length} pytań…`);
{
  const ids = new Set<string>();
  const attrs = new Set<string>();
  for (const q of QUESTIONS) {
    if (ids.has(q.id)) err(q.id, q.id, 'powtórzone id pytania');
    if (attrs.has(q.attribute_key)) err(q.id, q.attribute_key, 'powtórzony atrybut');
    ids.add(q.id);
    attrs.add(q.attribute_key);

    checkPool(`${q.id}.core`, q.core, 2);
    for (const t of q.core) {
      if (!/^Czy /.test(t)) err(`${q.id}.core`, t, 'rdzeń musi zaczynać się od „Czy ”');
      if (!t.endsWith('?')) err(`${q.id}.core`, t, 'rdzeń musi kończyć się „?”');
      if ((t.match(/\?/g) ?? []).length !== 1) err(`${q.id}.core`, t, 'rdzeń ma być jednym pytaniem');
      if (words(t) > 16) err(`${q.id}.core`, t, `za długi rdzeń (${words(t)} słów > 16)`);
    }

    checkPool(`${q.id}.setups`, q.setups, 2);
    for (const t of q.setups) {
      if (!/[.!…]$/.test(t)) err(`${q.id}.setups`, t, 'setup musi kończyć się „.”, „!” albo „…”');
      if (t.includes('?')) err(`${q.id}.setups`, t, 'setup nie może zadawać pytania — dziecko zacznie odpowiadać');
      if (words(t) > 14) err(`${q.id}.setups`, t, `za długi setup (${words(t)} słów > 14)`);
    }

    for (const part of ['onYes', 'onNo'] as const) {
      checkPool(`${q.id}.${part}`, q[part], 2);
      for (const t of q[part]) {
        if (!/[.!…]$/.test(t)) err(`${q.id}.${part}`, t, 'reakcja musi kończyć się „.”, „!” albo „…”');
        if (words(t) > 12) err(`${q.id}.${part}`, t, `za długa reakcja (${words(t)} słów > 12)`);
      }
    }
  }
}

// ---------- pule ogólne ----------
console.log('Sprawdzam pule z timo-lines.ts…');
{
  const pools: Array<[string, readonly string[]]> = [];
  for (const [name, value] of Object.entries(LINES)) {
    if (Array.isArray(value)) pools.push([name, value as string[]]);
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (Array.isArray(v)) pools.push([`${name}.${k}`, v as string[]]);
      }
    }
  }
  for (const [name, pool] of pools) checkPool(name, pool, 2);

  for (const t of LINES.WYGLUPY) {
    if (!/^Czy twoje zwierzę /.test(t) || !/żart/i.test(t) || !t.endsWith('!')) {
      err('WYGLUPY', t, 'wygłup = „Czy twoje zwierzę …? … żartuję!”');
    }
  }
  for (const t of LINES.GUESS_INTROS) {
    if (!/\bto( przypadkiem)?…$/.test(t)) {
      err('GUESS_INTROS', t, 'wstęp strzału kończy się „to…”, bo po nim idzie nazwa w mianowniku');
    }
  }
  for (const pool of [LINES.GIVE_UP_LINES, LINES.GUIDED_GIVE_UP_LINES]) {
    for (const t of pool) if (!t.endsWith('?')) err('GIVE_UP', t, 'poddanie kończy się pytaniem do dziecka');
  }
}

console.log(errors === 0 ? '\nOK — brak błędów.' : `\nBłędów: ${errors}`);
process.exit(errors === 0 ? 0 : 1);
