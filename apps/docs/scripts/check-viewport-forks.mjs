/**
 * Gate over the gates: no docs script may spell a verification viewport as a
 * number — `viewports.mjs` is the one chokepoint.
 *
 * WHY A GATE AND NOT A CONVENTION, measured rather than assumed. The
 * 2026-08-19 Standardize sweep extracted `viewports.mjs` because `[1440, 390]`
 * had been hand-copied into five gates and the REASON for the pair was written
 * down in exactly one of them. That module's own header names the failure it
 * was preventing: *"Silently, because nothing compares the five."* Nothing
 * did — and today's sweep found the forks back, in four scripts:
 *
 *   check-scroll.mjs      `const WIDTHS = [1440, 390]`  — the pair itself,
 *                         shadowing the exported name, in a file that imports
 *                         four other chokepoints and not this one
 *   check-claims.mjs      25 literal viewport widths, in a file that already
 *                         imports WIDTHS, DESKTOP_WIDTH *and* NARROW_WIDTH
 *   check-quickstart.mjs  2 `setViewport({ width: 1440, … })`
 *   scan-dead-style.mjs   1 the same
 *
 * 29 code sites, four scripts, one shared decision. `check-claims` is the
 * instructive one: importing the constant is not the same as using it, so a
 * convention cannot be verified by looking at the import list.
 *
 * The needle is READ FROM `viewports.mjs`, never hardcoded here — a gate that
 * stored its own copy of the widths would be the very fork it hunts, and would
 * go quietly stale the day the pair changes.
 *
 * @heuristic — recognises "a verification viewport" from source text: a bare
 *   numeric literal equal to one of the exported widths, after comments and
 *   string literals are blanked. That can be fooled (a computed width; a 390
 *   that genuinely means a container box rather than a viewport), so it
 *   carries --self-test proving it can tell offender from caller, and an
 *   EXEMPT map for a literal that is honestly not a viewport.
 *
 * WHAT IT DOES NOT COVER, stated rather than implied: a width assembled at
 * runtime (`at(bandPx + 1)`), and a width written into a claim STRING —
 * `'…collapses its detail pane at 390px'` in check-claims is coupled to the
 * constant and this gate cannot see it, because blanking strings is what keeps
 * prose from being rewritten by a mechanical fix. Those stay a human call.
 */
import { readdir, readFile } from 'node:fs/promises';
import { selfTest, assertScanned } from './gate-report.mjs';

/** The chokepoint itself, and this gate (its prose and fixtures name widths). */
const EXEMPT = new Map([
  ['viewports.mjs', 'the chokepoint — it is where the numbers live'],
  ['check-viewport-forks.mjs', 'this gate; its self-test fixtures spell the widths out'],
]);

/** Blank comments (line + block), then string literals, so a width named in
 *  prose or in a claim label never matches. Offsets survive for reporting. */
export function blankProse(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, pre) => pre + blank(m.slice(pre.length)))
    .replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g, blank);
}

/**
 * Every line number that spells one of `widths` as a bare number in code.
 * `\b` on both sides is load-bearing: `detailAt390` and `390px` are not
 * viewport literals and must not be flagged.
 */
export function viewportForks(src, widths) {
  const code = blankProse(src);
  const re = new RegExp(`\\b(?:${[...widths].join('|')})\\b`, 'g');
  const hits = [];
  code.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(re)) hits.push({ line: i + 1, width: m[0] });
  });
  return hits;
}

const dir = new URL('./', import.meta.url);

/* Read the needle from the source of truth. A parse that finds nothing is a
   parse failure, not an empty tree: fail rather than sweep for no widths and
   report a pass over a regex that matches nothing. */
const viewportsSrc = await readFile(new URL('viewports.mjs', dir), 'utf8');
const exported = Object.fromEntries(
  [...viewportsSrc.matchAll(/export const (NARROW_WIDTH|DESKTOP_WIDTH)\s*=\s*(\d+)\s*;/g)].map((m) => [m[1], Number(m[2])]),
);
if (Object.keys(exported).length !== 2) {
  console.error('viewport-forks check FAILED — could not read NARROW_WIDTH and DESKTOP_WIDTH from viewports.mjs.');
  console.error(`  parsed: ${JSON.stringify(exported)} — did the exports get renamed or computed?`);
  console.error('  Exiting non-zero rather than sweeping for a needle it never found.');
  process.exit(1);
}
const WIDTHS = new Set(Object.values(exported));

if (process.argv.includes('--self-test')) {
  const w = new Set([1440, 390]);
  selfTest([
    ['a literal setViewport width is flagged', viewportForks('await page.setViewport({ width: 1440, height: 900 });', w).length, 1],
    ['a forked pair array is flagged', viewportForks('const WIDTHS = [1440, 390];', w).length, 2],
    ['a bare call argument is flagged', viewportForks('const narrow = await at(390);', w).length, 1],
    ['the imported constant is NOT flagged', viewportForks('await page.setViewport({ width: DESKTOP_WIDTH, height: 900 });', w).length, 0],
    ['a width named in a comment is NOT flagged', viewportForks('// screenshot at 1440px and 390px\nconst x = 1;', w).length, 0],
    ['a width inside a claim string is NOT flagged', viewportForks("check('the pane collapses at 390px', ok);", w).length, 0],
    ['a width glued into an identifier is NOT flagged', viewportForks('const detailAt390 = narrow.detail;', w).length, 0],
    ['an unrelated number is NOT flagged', viewportForks('await p.goto(url, { timeout: 20000 });', w).length, 0],
  ]);
}

const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs') && !EXEMPT.has(f));
assertScanned(files.length, 'docs scripts', 'no scripts found — the gate verified nothing');

const offenders = [];
let sites = 0;
for (const f of files) {
  const hits = viewportForks(await readFile(new URL(f, dir), 'utf8'), WIDTHS);
  sites += hits.length;
  if (hits.length) offenders.push([f, hits]);
}

if (offenders.length) {
  console.error(`viewport-forks check FAILED — ${sites} literal viewport width(s) in ${offenders.length} script(s):`);
  for (const [f, hits] of offenders) {
    console.error(`  ${f} — line(s) ${hits.map((h) => `${h.line} (${h.width})`).join(', ')}`);
  }
  console.error('  Import NARROW_WIDTH / DESKTOP_WIDTH / WIDTHS from ./viewports.mjs instead.');
  console.error('  One decision stored N times drifts silently: change the narrow width in one gate');
  console.error('  and the sweeps are judging different phones while every gate still reports a pass.');
  console.error('  A literal that is honestly NOT a viewport goes in EXEMPT here, with its reason.');
  process.exit(1);
}
console.log(
  `viewport-forks check passed — ${files.length} docs scripts, ` +
    `no literal spelling of the ${WIDTHS.size} verification width(s) (${[...WIDTHS].join(', ')}) outside viewports.mjs`,
);
