/**
 * Gate over the gates: no docs script may enumerate `dist` itself —
 * `dist-pages.mjs` is the one chokepoint (roadmap 103.2).
 *
 * WHY A GATE AND NOT A CONVENTION. The convention was tried twice and
 * regrew twice: dist-pages.mjs was extracted 2026-08-18 to end four forked
 * walkers with two different page counts; three days later there were SIX
 * forks and four counts (103.1); and within days of THAT consolidation,
 * component-scores.mjs regrew a private `readdirSync(join(DIST,'patterns'))`
 * (2026-08-21 sweep). Nothing noticed either regrowth for days — a script
 * with its own walker works fine right up until its hand-copied exclusion
 * set disagrees with everyone else's.
 *
 * @heuristic — recognises "walks dist" from source text: a readdir/opendir/
 *   glob call whose argument mentions DIST or a dist path. That can be
 *   fooled (a string that looks like a call, a walker built from pieces),
 *   so it carries --self-test proving it can tell offender from caller.
 *   Comments are blanked before matching — the sweep's own literal-detector
 *   was wrong six times before it learned that (94.6b).
 */
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { selfTest, assertScanned } from './gate-report.mjs';

/* The chokepoint itself, and this gate (its fixtures below mention the
   pattern it hunts). */
const EXEMPT = new Set(['dist-pages.mjs', 'check-dist-walkers.mjs']);

/** Blank comments (line + block) so a walker named in prose never matches —
 *  the string shape stays, offsets survive for error reporting. */
export function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, pre) => pre + m.slice(pre.length).replace(/[^\n]/g, ' '));
}

/** Does this source enumerate dist itself? The signal: a directory-listing
 *  call (readdir/readdirSync/opendir/opendirSync/glob) whose argument
 *  expression mentions DIST (the paths.mjs export) or a quoted dist path. */
export function walksDist(src) {
  const code = blankComments(src);
  const re = /\b(?:readdir(?:Sync)?|opendir(?:Sync)?|glob(?:Sync)?)\s*\(([^)]*)\)/g;
  for (const [, arg] of code.matchAll(re)) {
    if (/\bDIST\b/.test(arg) || /['"`][^'"`]*\bdist\b[^'"`]*['"`]/.test(arg)) return true;
  }
  return false;
}

if (process.argv.includes('--self-test')) {
  selfTest([
    ['a private readdirSync over DIST is flagged',
      walksDist("const dirs = fs.readdirSync(join(DIST,'patterns'));"), true],
    ['a quoted dist path is flagged',
      walksDist("await readdir('apps/docs/dist', { withFileTypes: true })"), true],
    ['calling the chokepoint is NOT flagged',
      walksDist('const pages = await distPages(DIST);'), false],
    ['readdir over a non-dist dir is NOT flagged',
      walksDist("await readdir(new URL('../src/pages/', import.meta.url))"), false],
    ['dist only in a comment is NOT flagged',
      walksDist('// readdirSync(DIST) is forbidden\nconst x = 1;'), false],
  ]);
  process.exit(0);
}

const dir = new URL('./', import.meta.url);
const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs') && !EXEMPT.has(f));
assertScanned(files.length, 'docs scripts', 'no scripts found — the gate verified nothing');

const offenders = [];
for (const f of files) {
  if (walksDist(await readFile(new URL(f, dir), 'utf8'))) offenders.push(f);
}

if (offenders.length) {
  console.error(`dist-walkers check FAILED — ${offenders.length} script(s) enumerate dist outside the chokepoint:`);
  for (const f of offenders) {
    console.error(`  ${basename(f)} — route it through distPages() in dist-pages.mjs;`);
    console.error('    a private walker works until its hand-copied exclusion set drifts (103.1: six forks, four page counts)');
  }
  process.exit(1);
}
console.log(`dist-walkers check passed — ${files.length} docs scripts, all dist enumeration goes through dist-pages.mjs`);
