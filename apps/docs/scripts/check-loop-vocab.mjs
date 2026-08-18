/**
 * Gate: the loop outcome vocabulary is stated once.
 *
 * `record_iteration.py` owns the list and rejects anything outside it. CLAUDE.md
 * and LOOPS.md each print it beside the command, because that is where it is
 * read — but a hand-copied list is a stale list waiting to happen, and this one
 * is a day old, which is exactly when drift is cheapest to prevent and most
 * likely to happen (Standardize sweep, 2026-08-19).
 *
 * The same shape as the SOURCE_SKIP_DIRS find one sweep earlier: one DECISION
 * stored in three places, failing silently — add an outcome, update the code,
 * and two documents quietly describe a vocabulary that no longer exists.
 *
 * Compares the documents against the Python constant rather than the other way
 * round: the code is the thing that enforces, so the code is the authority.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned } from './gate-report.mjs';

/* The loop scripts are repo tooling, not part of the published docs image, so
   the docs Containerfile copies only package.json, packages/, apps/docs and
   DESIGN.md. This gate therefore CANNOT run there — and a gate that cannot run
   must say so rather than pass, which is the same contract `check:rtl` follows
   for DESIGN.md. CI has the full checkout and does verify it. */
const PY_PATH = join(REPO_ROOT, 'scripts/loops/record_iteration.py');
let py;
try {
  py = await readFile(PY_PATH, 'utf8');
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
  console.log(
    'loop-vocab check: scripts/loops/record_iteration.py is not in this build context, ' +
      'so the outcome vocabulary was NOT verified (expected inside container builds; ' +
      'CI has the full checkout and does verify it).',
  );
  process.exit(0);
}
const m = py.match(/^OUTCOMES = \{([^}]*)\}/m);
if (!m) {
  console.error('loop-vocab check FAILED — no OUTCOMES set in record_iteration.py.');
  console.error('  This gate compares the docs against that constant; without it there is no authority.');
  process.exit(1);
}
const authoritative = [...m[1].matchAll(/"([a-z]+)"/g)].map((x) => x[1]).sort();

const DOCS = ['CLAUDE.md', 'LOOPS.md'];
const failures = [];
let checked = 0;

for (const doc of DOCS) {
  const src = await readFile(join(REPO_ROOT, doc), 'utf8');
  const line = src.split('\n').find((l) => l.includes('# outcome:'));
  if (!line) {
    failures.push(`${doc}\n     has no "# outcome:" line — the vocabulary is documented where the command is`);
    continue;
  }
  checked += 1;
  const listed = [...line.matchAll(/\b([a-z]+)\b/g)]
    .map((x) => x[1])
    .filter((w) => w !== 'outcome')
    .sort();
  const missing = authoritative.filter((o) => !listed.includes(o));
  const extra = listed.filter((o) => !authoritative.includes(o));
  if (missing.length || extra.length) {
    failures.push(
      `${doc}\n     lists: ${listed.join(', ')}` +
        `\n     code:  ${authoritative.join(', ')}` +
        (missing.length ? `\n     MISSING: ${missing.join(', ')}` : '') +
        (extra.length ? `\n     NOT A REAL OUTCOME: ${extra.join(', ')}` : ''),
    );
  }
}

assertScanned(checked, 'documented outcome lists', 'neither CLAUDE.md nor LOOPS.md documents the vocabulary');

if (failures.length) {
  console.error(`loop-vocab check FAILED — ${failures.length} document(s) disagree with record_iteration.py:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`loop-vocab check passed — ${checked} document(s) match the ${authoritative.length} outcomes the recorder enforces`);
