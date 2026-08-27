#!/usr/bin/env node
/**
 * REPORT (not a gate): which shipped block classes are never composed into a
 * real screen or pattern? Roadmap 150.1.
 *
 * @exact — word-boundary membership of generated class names in source files.
 * Nothing is recognised or inferred.
 *
 * WHY IT REPORTS AND DOES NOT FAIL. The Objective's principle 3 says a piece
 * earns its place by surviving >=2 real, independent compositions, and the
 * Objective grill (2026-08-27) found three components that had never been
 * composed at all. The obvious response — fail the build on zero reach — is
 * wrong, and the grill says why: **zero reach has at least three meanings.**
 *
 *   - `bo-date` was a REACHED-FOR FAILURE: 21 of 27 suite screens render a
 *     date and none used it. The framework's problem.
 *   - `bo-tree` is CORRECTLY UNUSED. Its own docs say "not for rows that carry
 *     data columns" and point at tree-table, which IS used; every hierarchy in
 *     the suite carries data columns, so tree-table rightly wins every time.
 *     That is suitability-beats-reuse working exactly as the owner wrote it.
 *   - `bo-file-dropzone` reflects a gap in the INSTRUMENT: no suite screen has
 *     an attachment flow at all.
 *
 * A FOURTH meaning was found by the next grill (2026-08-27, roadmap 153.1) and
 * is handled separately below: a block that **cannot appear** in a static
 * corpus at all, because it is a runtime container an app injects into. Listing
 * one of those beside `bo-date` invited the reader to treat "nobody reached for
 * this" and "this could not possibly be here" as the same finding, when only
 * the first is ever actionable.
 *
 * A gate would go red on all three, and be wrong about the second. A detector
 * that is wrong a third of the time teaches people to work around it, which is
 * worse than no detector. So this prints a number a human reads.
 *
 * WHY PER BLOCK, NOT PER COMPONENT. Two earlier attempts measured per
 * component and both were wrong, in opposite directions. `api.json`'s `blocks`
 * field is **not an ownership map** — it lists every block a component's CSS
 * mentions, so `richtext` claims `bo-btn` and scored 58. Restricting to blocks
 * unique to one component inverted the bias: `button` dropped to 4, which is
 * `bo-btn-group`'s reach, not button's. A block is a real class and its reach
 * is unambiguous, so that is what gets counted.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { assertScanned } from './gate-report.mjs';
import { CORE_DIST } from './paths.mjs';
import { collectSource } from './source-files.mjs';

/**
 * Blocks that CANNOT appear in this corpus, with the reason each is exempt.
 *
 * Stated here rather than inferred, deliberately: every heuristic this project
 * has written to recognise a category of class has eventually been fooled, and
 * "is this a runtime container" is exactly the kind of judgement a regex would
 * get wrong quietly. A short hand-kept list is auditable; a clever matcher is
 * not. Membership is checked against reality below — a listed block that turns
 * out to BE composed is reported as a stale entry rather than silently
 * excused.
 */
const CANNOT_APPEAR = new Map([
  [
    'bo-toast-region',
    'an empty runtime container — the docs markup is `<div class="bo-toast-region" role="status" aria-live="polite"></div>` followed by "Server/HTMX/JS injects:". A static screen has nothing to inject.',
  ],
]);

const api = JSON.parse(await readFile(join(CORE_DIST, 'api.json'), 'utf8'));

/** Every shipped block class, and which component(s) declare it. */
const owners = new Map();
for (const [name, meta] of Object.entries(api.components ?? {})) {
  for (const b of meta.blocks ?? []) {
    if (!owners.has(b)) owners.set(b, []);
    owners.get(b).push(name);
  }
}

/* Independent compositions: real screens and pattern pages. Component docs
   pages are excluded ON PURPOSE — a component appearing on its own reference
   page is not a composition, and counting it would make every block look used,
   which is the 100%-is-a-defect shape this repo has hit before. */
/* Expect 28 suite screens (27 module screens + the suite index) and 47 pattern
   files (39 pattern pages + 7 standalone RF screens under rf/ + schedule/full).
   Written down because the pattern count legitimately disagrees with
   `check:patterns-index`'s 39, and an unexplained number invites someone to
   "fix" it. The RF screens are chrome-free demos and are real compositions, so
   they count. */
const CORPORA = [
  ['suite screen', 'examples/erp-suite', (f) => f.endsWith('.screen.mjs')],
  ['pattern page', 'apps/docs/src/pages/patterns', (f) => f.endsWith('.astro')],
];

/* Source enumeration lives in source-files.mjs — see its header for why this
   script no longer rolls its own (Standardize sweep, 2026-08-27). */
const files = [];
for (const [label, root, keep] of CORPORA) {
  const { files: found } = await collectSource([{ path: root, label }], { keep });
  files.push(...found);
}
assertScanned(files.length, 'screens or pattern pages', 'wrong directory, or the suite is not checked out?');

const texts = await Promise.all(files.map((f) => readFile(f.abs, 'utf8')));

const reach = new Map();
for (const b of owners.keys()) {
  const re = new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9-])`);
  reach.set(b, texts.filter((t) => re.test(t)).length);
}

assertScanned(reach.size, 'block classes in api.json', 'is packages/core built?');

const rows = [...reach.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
const rawZero = rows.filter(([, n]) => n === 0);
const exempt = rawZero.filter(([b]) => CANNOT_APPEAR.has(b));
const zero = rawZero.filter(([b]) => !CANNOT_APPEAR.has(b));
const one = rows.filter(([, n]) => n === 1);

/* Reconcile the hand-kept list against what was actually measured, both ways.
   A listed block that IS composed means the exemption is stale; a listed block
   that does not exist at all means it was renamed. Neither fails the build —
   this is a report — but neither is allowed to pass silently either, which is
   the failure mode of every exemption list that has ever rotted. */
const staleExempt = [...CANNOT_APPEAR.keys()].filter((b) => (reach.get(b) ?? 0) > 0);
const unknownExempt = [...CANNOT_APPEAR.keys()].filter((b) => !reach.has(b));

/* A tidy number is a defect until proven otherwise (CLAUDE.md). All-zero means
   the matcher broke; all-used means the corpus is wrong. Say so loudly in the
   report rather than printing a serene summary. */
const suspicious =
  zero.length === rows.length ? 'EVERY block reads zero — the matcher is broken, not the framework'
  : zero.length === 0 && one.length === 0 ? 'NO block is under-used — suspiciously tidy; check the corpus'
  : null;

console.log(
  `reach report — ${rows.length} block class(es) across ${files.length} independent composition(s) ` +
    `(${files.filter((f) => f.label === 'suite screen').length} suite screens, ` +
    `${files.filter((f) => f.label === 'pattern page').length} pattern pages)`,
);
if (suspicious) console.log(`  !! ${suspicious}`);

console.log(`  never composed (${zero.length}): ${zero.map(([b]) => b).join(', ') || 'none'}`);
if (exempt.length) {
  console.log(`  cannot appear (${exempt.length}) — not a finding, and not counted above:`);
  for (const [b] of exempt) console.log(`    ${b} — ${CANNOT_APPEAR.get(b)}`);
}
for (const b of staleExempt) {
  console.log(`  !! ${b} is listed as "cannot appear" but IS composed ${reach.get(b)}x — the exemption is stale, remove it`);
}
for (const b of unknownExempt) {
  console.log(`  !! ${b} is listed as "cannot appear" but is not a shipped block — renamed or removed?`);
}
console.log(`  used once (${one.length}): ${one.map(([b]) => b).join(', ') || 'none'}`);
console.log(
  '  zero reach is NOT automatically a defect — it can mean the component is ' +
    'correctly refused at the point of use, or that the suite has no screen of ' +
    'that shape. See roadmap 150.1.',
);
