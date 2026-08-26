#!/usr/bin/env node
/**
 * Gate over the gates: no docs script recomputes a repo path `paths.mjs`
 * already exports.
 *
 * @exact — string membership over comment-stripped source. It matches the
 * SPELLINGS that have actually occurred here, which is a stated limit rather
 * than a claim of completeness: someone determined enough can build the same
 * path from pieces and this will not see it. It catches regrowth, which is the
 * failure that has actually happened.
 *
 * WHY A GATE. The convention was tried and regrew twice. `paths.mjs` was
 * extracted in the 2026-08-21 sweep, and its own comment records that
 * `CORE_DIST` "was spelled three different ways across four scripts" before it
 * existed. On 2026-08-26 there were **five** scripts recomputing `REPO_ROOT`
 * by hand — three of them added that same day, by someone who had read
 * `paths.mjs` while writing a different gate about exactly this class of
 * problem. A convention that loses to its own author inside one session is not
 * a convention, it is a wish.
 *
 * The cost is not aesthetic. `check:dist-walkers` states it for its own case:
 * a private copy works right up until its assumptions disagree with everyone
 * else's, and nothing notices for days.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gate, assertScanned } from './gate-report.mjs';
import { DOCS_ROOT } from './paths.mjs';

const SCRIPTS = join(DOCS_ROOT, 'scripts');

/** Hand-rolled spellings of what paths.mjs already exports. */
const BANNED = [
  { re: /join\(dirname\(fileURLToPath\(import\.meta\.url\)\),\s*'\.\.',\s*'\.\.',\s*'\.\.'\)/, use: 'REPO_ROOT' },
  { re: /join\(dirname\(fileURLToPath\(import\.meta\.url\)\),\s*'\.\.'\)(?!\s*,)/, use: 'DOCS_ROOT' },
  { re: /join\([A-Z_]+,\s*'packages',\s*'core',\s*'dist'\)/, use: 'CORE_DIST' },
  /* DOCS_ROOT specifically, not any identifier: the first run flagged
     `join(SUITE, 'dist')` in copy-suite.mjs — the ERP suite's own dist, which
     paths.mjs does not own and should not. A gate that over-matches teaches
     people to work around it. */
  { re: /join\(DOCS_ROOT,\s*'dist'\)/, use: 'DIST' },
];

const g = gate('paths check', 'docs script(s)');
let scanned = 0;

for (const f of (await readdir(SCRIPTS)).filter((f) => f.endsWith('.mjs'))) {
  if (f === 'paths.mjs') continue; // the one place these are allowed to be spelled
  const raw = await readFile(join(SCRIPTS, f), 'utf8');
  // Comment-blind: these paths are named in prose explaining the rule, and a
  // detector fooled by its own documentation is one this repo has shipped twice.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1 ');
  scanned += 1;
  for (const { re, use } of BANNED) {
    g.check(
      `${f} does not recompute ${use}`,
      !re.test(src),
      `paths.mjs already exports ${use}. Import it instead — this exact ` +
        `duplication has regrown twice, most recently five scripts deep.`,
    );
  }
}

assertScanned(scanned, 'docs script(s) scanned', 'wrong directory?');
g.report(`checked against ${BANNED.length} path(s) paths.mjs owns`);
