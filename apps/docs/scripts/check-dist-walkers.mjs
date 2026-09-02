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
 * IT IS THE FIRST OF FOUR, which is why its driver now lives in
 * `gate-source-scan.mjs` (roadmap 244.4, 2026-09-02). `src-css-files.mjs`,
 * `source-files.mjs` and `dist-css.mjs` are the same shape of chokepoint over
 * three other trees; `check-src-css-walkers.mjs` is the second gate, and it
 * shares this file's plumbing rather than copying it. Its PREDICATE is its
 * own, and that is measured, not tasteful: `walksDist` returns false on the
 * exact walker 244.2 removed from three core scripts, because a recursive
 * walker names its tree at the call site and not in the readdir argument.
 *
 * @heuristic — recognises "walks dist" from source text: a readdir/opendir/
 *   glob call whose argument mentions DIST or a dist path. That can be
 *   fooled (a string that looks like a call, a walker built from pieces),
 *   so it carries --self-test proving it can tell offender from caller.
 *   Comments are blanked before matching — the sweep's own literal-detector
 *   was wrong six times before it learned that (94.6b).
 */
import { selfTest } from './gate-report.mjs';
import { DOCS_ROOT } from './paths.mjs';
import { join } from 'node:path';
import { blankComments, chokepointGate } from './gate-source-scan.mjs';

/* The chokepoint itself, and this gate (its fixtures below mention the
   pattern it hunts). Reasons live in the Map so they cannot drift away from
   the entry that grants them. */
const EXEMPT = new Map([
  ['dist-pages.mjs', 'the chokepoint itself'],
  ['check-dist-walkers.mjs', 'this gate — its --self-test fixtures spell out the pattern it hunts'],
]);

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

await chokepointGate({
  label: 'dist-walkers',
  scriptDir: join(DOCS_ROOT, 'scripts'),
  tree: 'dist',
  chokepoint: 'dist-pages.mjs',
  exempt: EXEMPT,
  detect: walksDist,
  hint:
    'route it through distPages() in dist-pages.mjs;\n' +
    '    a private walker works until its hand-copied exclusion set drifts (103.1: six forks, four page counts)',
});
