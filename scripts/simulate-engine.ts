/* eslint-disable */
// @ts-nocheck — skrypt Node (tsx); tsconfig aplikacji nie zna typów Node.
/**
 * Symulator silnika zgadywania — setki gier bez telefonu.
 *
 * „Dziecko” myśli o zwierzęciu i odpowiada z bazy, ale może się mylić:
 * - `--slip=0.1`  — każda odpowiedź z tym prawdopodobieństwem na odwrót,
 * - scenariusz krowy — dokładnie pomyłki z testu użytkownika: krowa „nie żyje
 *   w grupie” i „nie ma futra”.
 * Atrybut „czasem” (null) dziecko rozstrzyga losowo.
 *
 * Porównuje nowy silnik (pamięć, bez resetu) ze starym (filtr + reset),
 * jeśli obok leży `scripts/.sim-old-engine.ts` (git show starej wersji).
 *
 * Uruchom:  npx tsx scripts/simulate-engine.ts [--slip=0.1] [--games=300] [--seed=1]
 */
import { existsSync } from 'fs';
import { resolve } from 'path';

import { ANIMALS } from '../src/data/animals';
import { EXPEDITIONS_BY_ID } from '../src/data/expeditions';
import { QUESTIONS } from '../src/data/questions';
import * as NEW from '../src/features/game/guessing-engine';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const SLIP = Number(args.slip ?? 0.1);
const GAMES = Number(args.games ?? 300);
let seed = Number(args.seed ?? 1);
// Powtarzalny los — ten sam przebieg przy każdym uruchomieniu.
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
Math.random = rand;

const mythical = new Set(EXPEDITIONS_BY_ID.mythical?.roster ?? []);
const POOL = ANIMALS.filter((a) => !mythical.has(a.id));
const MAX = NEW.MAX_QUESTIONS;

type Belief = (attr: string) => boolean | null;

function childAnswer(belief: Belief, attr: string, slip: number) {
  let v = belief(attr);
  if (v === null || v === undefined) v = rand() < 0.5;
  if (rand() < slip) v = !v;
  return v ? 'yes' : 'no';
}

/** Jedna gra; `engine` = NEW albo stary moduł. Zwraca przebieg. */
function play(engine: any, target: any, belief: Belief, slip: number, oldMode: boolean) {
  let candidates = POOL;
  const used = new Set<string>();
  const excluded = new Set<string>();
  const answers: any[] = [];
  let asked = 0;
  let guesses = 0;
  let resets = 0;
  const log: string[] = [];
  const state = () => ({ candidates, usedAttributes: used, excludedAnimals: excluded, questionsAsked: asked });

  let pointless = 0;
  let q = engine.pickNextQuestion(state(), answers, QUESTIONS);
  while (true) {
    if (!q) break;
    // Sędzia wspólny dla obu silników: czy odpowiedź już wynika z tego, co
    // dziecko powiedziało? (≥95% wagi zgodnych kandydatów przewiduje to samo.)
    if (answers.length >= 3) {
      const judge = { candidates: POOL, usedAttributes: used, excludedAnimals: excluded, questionsAsked: asked };
      const sc = NEW.scoredEligible(judge, answers);
      const top = sc[0]?.score ?? 0;
      const plaus = sc.filter((x) => x.score >= top * 0.25);
      const tot = plaus.reduce((n, x) => n + x.score, 0) || 1;
      const yes = plaus.reduce((n, x) => n + (x.animal.attributes[q.attribute_key] === true ? x.score : 0), 0) / tot;
      const no = plaus.reduce((n, x) => n + (x.animal.attributes[q.attribute_key] === false ? x.score : 0), 0) / tot;
      if (yes >= 0.95 || no >= 0.95) pointless++;
    }
    const a = childAnswer(belief, q.attribute_key, slip);
    log.push(`${q.attribute_key}=${a}`);
    if (oldMode) candidates = engine.applyAnswer(candidates, q.attribute_key, a);
    used.add(q.attribute_key);
    asked++;
    answers.push({ question_id: q.id, attribute_key: q.attribute_key, answer: a, remaining_candidates: 0 });
    if (oldMode && engine.eligibleCandidates(state()).length === 0) {
      candidates = POOL; // stary fallback w trybie free (bez legend — łagodniej niż w aplikacji)
      resets++;
      log.push('RESET');
    }
    if (asked >= MAX) return { win: false, asked, guesses, resets, log, pointless };

    // strzały — po pudle od razu kolejny strzał, jeśli silnik dalej chce
    while (engine.shouldAttemptGuess(state(), answers, QUESTIONS)) {
      const g = engine.pickBestGuess(state(), answers);
      if (!g) break;
      guesses++;
      log.push(`STRZAŁ ${g.id}`);
      if (g.id === target.id) return { win: true, asked, guesses, resets, log, pointless };
      excluded.add(g.id);
      if (oldMode && engine.eligibleCandidates(state()).length === 0) {
        candidates = POOL;
        resets++;
        log.push('RESET');
      }
      break; // po pudle: pytanie (jak w aplikacji)
    }
    q = engine.pickNextQuestion(state(), answers, QUESTIONS);
  }
  // brak pytań → ostatni strzał
  const g = engine.pickBestGuess(state(), answers);
  guesses++;
  return { win: g?.id === target.id, asked, guesses, resets, log, pointless };
}

function run(label: string, engine: any, oldMode: boolean) {
  const s0 = seed;
  const targets = Array.from({ length: GAMES }, () => POOL[Math.floor(rand() * POOL.length)]);
  let wins = 0, qs = 0, gs = 0, rs = 0, firstShot = 0, pl = 0, all = 0;
  for (const t of targets) {
    const r = play(engine, t, (attr) => t.attributes[attr], SLIP, oldMode);
    if (r.win) { wins++; qs += r.asked; gs += r.guesses; if (r.guesses === 1) firstShot++; }
    rs += r.resets;
    pl += r.pointless;
    all += r.asked;
  }
  seed = s0;
  const pct = (x: number) => `${((x / GAMES) * 100).toFixed(0)}%`;
  console.log(
    `${label.padEnd(8)} trafione ${pct(wins).padStart(4)} · za 1. strzałem ${pct(firstShot).padStart(4)} · ` +
      `śr. pytań ${(qs / Math.max(1, wins)).toFixed(1)} · śr. strzałów ${(gs / Math.max(1, wins)).toFixed(1)} · resety ${rs} · pytania „bez sensu” ${((pl / all) * 100).toFixed(1)}%`
  );
}

function cowScenario(label: string, engine: any, oldMode: boolean) {
  const cow = ANIMALS.find((a) => a.id === 'cow')!;
  const belief: Belief = (attr) =>
    attr === 'lives_in_groups' ? false : attr === 'has_fur' ? false : cow.attributes[attr];
  let wins = 0;
  const N = 50;
  let sample: any;
  for (let i = 0; i < N; i++) {
    const r = play(engine, cow, belief, 0, oldMode);
    if (r.win) wins++;
    if (i === 0) sample = r;
  }
  console.log(`${label.padEnd(8)} krowa z 2 „dziecięcymi” pomyłkami: trafiona w ${wins}/${N} gier`);
  console.log(`         przykład: ${sample.log.join(' → ')}`);
}

console.log(`\n=== ${GAMES} gier, pomyłka dziecka w ${(SLIP * 100).toFixed(0)}% odpowiedzi ===`);
const oldPath = resolve(__dirname, '.sim-old-engine.ts');
const OLD = existsSync(oldPath) ? require(oldPath) : null;
if (OLD) run('STARY', OLD, true);
run('NOWY', NEW, false);
console.log('');
if (OLD) cowScenario('STARY', OLD, true);
cowScenario('NOWY', NEW, false);
