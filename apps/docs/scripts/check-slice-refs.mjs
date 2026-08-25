#!/usr/bin/env node
/**
 * Gate: a slice number cited from the code still resolves in the plan.
 *
 * @exact — set membership over strings found in two files. Nothing inferred.
 *
 * WHY. `ROADMAP.md` is swept periodically: item 110.4 moved 83 closed slices
 * to `ROADMAP-archive.md` on 2026-08-22, the live file grew back from 5,562 to
 * 9,824 lines in three days, and a second pass on 2026-08-25 moved 44 more
 * (9,824 -> 1,094). Each sweep leaves a pointer line and moves the section
 * byte-identical. That only stays safe while both halves are searchable
 * together: **148 slice numbers are cited** from shipped CSS comments, docs
 * pages and scripts, because a rule usually carries the slice that produced
 * it, which is how "why is this selector shaped like that" stays answerable.
 * Trim the archive and those become dead references, silently.
 *
 * A REGRESSION GATE, NOT A PURITY GATE. Two citations do not resolve today and
 * both predate the sweeps, so demanding all 148 would be red on its first run.
 * The baseline is frozen; the gate fires only when the set GROWS. Removing an
 * entry is always welcome, adding one needs a reason in the diff.
 *
 * The base rate was measured twice, and the first measurement was wrong in a
 * way worth recording: it reported 58 dangling, because the archive had just
 * been clobbered by a same-name file written in the wrong case (APFS is
 * case-insensitive — `ROADMAP-ARCHIVE.md` and `ROADMAP-archive.md` are one
 * file). Fifty-six of those 58 "dangling" refs were resolving perfectly well
 * in content that had been overwritten minutes earlier. A number that moves by
 * 28x when an unrelated mistake is undone was never a measurement of the thing
 * it claimed to measure.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { gate, assertScanned } from './gate-report.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

/** Citations that did not resolve when the roadmap was split (2026-08-25). */
/** Citations that resolved nowhere when the 2026-08-25 sweep ran. Both
 *  predate it: `5` is cited in DESIGN.md from before the current numbering,
 *  and `94.6a` is a sub-item renumbered when its slice was rewritten. */
const KNOWN_DANGLING = new Set(['5', '94.6a']);

/* Same standing-down rule as check-ci-ignores: the docs image copies apps/ and
   packages/, so the roadmap and its archive are legitimately absent. Say the
   citations were NOT verified rather than passing silently. */
const live = await readFile(join(ROOT, 'ROADMAP.md'), 'utf8').catch(() => null);
const archived = await readFile(join(ROOT, 'ROADMAP-archive.md'), 'utf8').catch(() => null);
if (live === null || archived === null) {
  console.log(
    'slice-refs check SKIPPED — ROADMAP.md / ROADMAP-archive.md are not in this\n' +
      '  build context, so the 148 slice citations were NOT verified here.',
  );
  process.exit(0);
}
const corpus = live + archived;

let listing = '';
try {
  listing = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
} catch {
  console.log('slice-refs check SKIPPED — no git in this build context, so the');
  console.log('  citations could not be enumerated and were NOT verified here.');
  process.exit(0);
}
const files = listing
  .split('\n')
  .filter((f) => /\.(css|mjs|js|astro|md|py)$/.test(f) && !f.startsWith('ROADMAP'));

const cites = new Map();
for (const f of files) {
  const t = await readFile(join(ROOT, f), 'utf8').catch(() => '');
  for (const m of t.matchAll(/\broadmap\s+(\d{1,3}(?:\.\d+[a-z]?)?)/gi)) {
    if (!cites.has(m[1])) cites.set(m[1], new Set());
    cites.get(m[1]).add(f);
  }
}
assertScanned(cites.size, 'slice citation(s)', 'wrong build context, or the citation style changed?');

const resolves = (ref) =>
  ref.includes('.')
    ? new RegExp(`\\b${ref.replace('.', '\\.')}\\b`).test(corpus)
    : new RegExp(`^## Slice ${ref}\\b`, 'm').test(corpus);

const g = gate('slice-refs check', 'slice citation(s)');
for (const [ref, where] of cites) {
  if (KNOWN_DANGLING.has(ref)) continue;
  g.check(
    `roadmap ${ref} resolves`,
    resolves(ref),
    `Cited from ${[...where].slice(0, 3).join(', ')} but found in neither ` +
      `ROADMAP.md nor ROADMAP-archive.md. If the archive was trimmed, put the ` +
      `slice back; the citation is what makes a rule's reason findable.`,
  );
}
g.report(`checked (${cites.size} cited, ${KNOWN_DANGLING.size} known-dangling baseline)`);
