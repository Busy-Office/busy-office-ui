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
 *   - `bo-date` was read as a REACHED-FOR FAILURE — and that reading was
 *     WRONG, which is why the DEPRECATED bucket below exists. It has been
 *     deprecated since 2026-08-19; the suite renders dates with the prescribed
 *     replacement (`.bo-u-tabular`, 349 uses). See roadmap 153.2.
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
/**
 * Blocks that are DEPRECATED, and therefore SHOULD read zero.
 *
 * Added after 153.2, where the absence of this category produced a wrong
 * finding rather than a confusing one. The 2026-08-27 grill read `bo-date`'s
 * zero reach as "the one real defect" and filed an item to adopt it across 21
 * screens — but `bo-date` has been deprecated since 2026-08-19 (roadmap 45.3),
 * and its own docs tell you to compose `.bo-cluster` + `.bo-u-tabular`
 * instead. Adopting it would have spread a class the framework is retiring.
 *
 * Zero reach on a deprecated block is the deprecation WORKING. Listing it
 * beside a real miss invites exactly the inversion that happened.
 */
const DEPRECATED = new Map([
  [
    'bo-date',
    'deprecated 2026-08-19 (roadmap 45.3) — compose `.bo-cluster` + `.bo-u-tabular` instead. Zero reach is the deprecation working; the suite uses the replacement 349x.',
  ],
]);

const CANNOT_APPEAR = new Map([
  [
    'bo-toast-region',
    'an empty runtime container — the docs markup is `<div class="bo-toast-region" role="status" aria-live="polite"></div>` followed by "Server/HTMX/JS injects:". A static screen has nothing to inject.',
  ],
]);

/**
 * Blocks that read zero AND have been examined, with the verdict that examining
 * them produced. Roadmap 159.1.
 *
 * NOT a third exemption bucket, and the distinction is the whole point. An
 * entry here is still counted and still printed under "never composed" — it is
 * an *adjudicated* zero, not an excused one. `CANNOT_APPEAR` says the corpus
 * structurally cannot contain the block; `DEPRECATED` says the zero is the
 * intended end state. Both are stable facts. A verdict here is a dated claim
 * about the suite as it stands, and it can go stale in a way those two cannot —
 * so it stays visible, in the count, where the next reader will re-test it.
 *
 * Why it exists: a bare block name in that list reads as an open question. Five
 * of them were printed bare while all five were in fact adjudicated (the
 * verdicts sat in `.roundtable/grill-objective-149-152-2026-08-27.md` and, for
 * two of them, in a CSS header comment nobody reading this report would open).
 * That is the exact state that produced roadmap 153.2, where an already-settled
 * zero was re-read as "the one real defect" and nearly spread a retired class
 * across 21 screens.
 *
 * Each `why` is copied from that grill, not re-derived — and each was re-checked
 * against measurement before being copied here (roadmap 159.1 Accept (b)). The
 * commands are next to the claims, per CLAUDE.md, so the next wake re-runs them
 * instead of re-deriving them.
 */
const ADJUDICATED = new Map([
  [
    'bo-tree',
    {
      verdict: 'correctly refused at the point of use',
      why:
        'its own opener says "Not for rows that carry data columns" and points at tree-table, ' +
        'which IS composed. Re-measured 2026-08-28: `bo-tree-table` reaches 2 compositions, ' +
        '`bo-tree` 0 — suitability beating reuse, as the Objective asks.',
    },
  ],
  [
    'bo-avatar-stack',
    {
      verdict: 'correctly refused, and strongly',
      why:
        'the suite HAS the scenario that promoted the primitive — avatar.css:40 reads ' +
        '`Approval-chain "who\'s next" stack — the scenario that promoted the primitive` — and ' +
        'p2p/purchase-order renders that chain as a `bo-timeline` with named steps, data-state ' +
        'done/current/pending and timestamps, all of which overlapping discs would lose. ' +
        'Re-measured 2026-08-28: `bo-timeline` reaches 11 compositions.',
    },
  ],
  ['bo-file-dropzone', { verdict: 'instrument gap', why: fileUploadWhy() }],
  ['bo-file-input', { verdict: 'instrument gap', why: fileUploadWhy() }],
  ['bo-file-list', { verdict: 'instrument gap', why: fileUploadWhy() }],
]);

/**
 * The file-upload family shares ONE verdict, so it is written once.
 *
 * The claim is about the CORPUS, not the component: no suite screen has an
 * attachment flow at all, so this zero says nothing about file-upload. Roadmap
 * 159.1's criterion is that this agrees with what the command reports — not
 * that the number stays zero. When a screen grows an attachment flow, this
 * entry becomes stale and the reconciliation below says so.
 */
function fileUploadWhy() {
  return (
    'no suite screen has an attachment flow at all, so this says nothing about the component. ' +
    'Command: `find examples/erp-suite -name "*.screen.mjs" -exec grep -ilE "attach|upload" {} \\; | wc -l` ' +
    '— 0 of 28 screen files on 2026-08-28 (27 module screens + the suite index).'
  );
}

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
const retired = rawZero.filter(([b]) => DEPRECATED.has(b));
const zero = rawZero.filter(([b]) => !CANNOT_APPEAR.has(b) && !DEPRECATED.has(b));
const one = rows.filter(([, n]) => n === 1);

/* Reconcile the hand-kept list against what was actually measured, both ways.
   A listed block that IS composed means the exemption is stale; a listed block
   that does not exist at all means it was renamed. Neither fails the build —
   this is a report — but neither is allowed to pass silently either, which is
   the failure mode of every exemption list that has ever rotted. */
const staleExempt = [...CANNOT_APPEAR.keys(), ...DEPRECATED.keys()].filter((b) => (reach.get(b) ?? 0) > 0);
const unknownExempt = [...CANNOT_APPEAR.keys(), ...DEPRECATED.keys()].filter((b) => !reach.has(b));

/* The same reconciliation, both ways, for the verdicts — 153.1's rule applies
   to them too and they need it MORE, because a verdict is a dated claim about
   the suite rather than a stable fact about the block. A block whose verdict
   says "nobody composed this, and here is why that is right" is refuted the
   moment somebody composes it. */
const staleVerdict = [...ADJUDICATED.keys()].filter((b) => (reach.get(b) ?? 0) > 0);
const unknownVerdict = [...ADJUDICATED.keys()].filter((b) => !reach.has(b));

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

/* One line per block, never a bare comma list: a name on its own reads as an
   open question, and five of these were settled while reading as open. The
   reader must be able to tell EXAMINED from UNEXAMINED without opening the
   source, so a block with no verdict says so in as many words.

   Blocks sharing one verdict print on one line. The file-upload family is three
   blocks and ONE finding — repeating the identical paragraph three times makes
   the report look like three problems, which is the opposite of what this is
   for. Grouping is keyed on the verdict text itself, so it cannot drift from
   what the map says. */
console.log(`  never composed (${zero.length}):${zero.length ? '' : ' none'}`);
const printed = new Set();
for (const [b] of zero) {
  if (printed.has(b)) continue;
  const adj = ADJUDICATED.get(b);
  if (!adj) {
    console.log(`    ${b} — NO VERDICT RECORDED: nobody has examined this zero yet.`);
    printed.add(b);
    continue;
  }
  const sharing = zero
    .map(([n]) => n)
    .filter((n) => ADJUDICATED.get(n)?.verdict === adj.verdict && ADJUDICATED.get(n)?.why === adj.why);
  for (const n of sharing) printed.add(n);
  console.log(`    ${sharing.join(', ')} — ADJUDICATED: ${adj.verdict} — ${adj.why}`);
}
if (exempt.length) {
  console.log(`  cannot appear (${exempt.length}) — not a finding, and not counted above:`);
  for (const [b] of exempt) console.log(`    ${b} — ${CANNOT_APPEAR.get(b)}`);
}
if (retired.length) {
  console.log(`  deprecated (${retired.length}) — SHOULD read zero, and does:`);
  for (const [b] of retired) console.log(`    ${b} — ${DEPRECATED.get(b)}`);
}
for (const b of staleExempt) {
  console.log(`  !! ${b} is exempted here but IS composed ${reach.get(b)}x — the exemption is stale, remove it`);
}
for (const b of unknownExempt) {
  console.log(`  !! ${b} is listed as "cannot appear" but is not a shipped block — renamed or removed?`);
}
for (const b of staleVerdict) {
  console.log(
    `  !! ${b} carries a verdict explaining its ZERO reach but IS composed ${reach.get(b)}x — ` +
      'the verdict is refuted, re-examine it and rewrite or remove the entry',
  );
}
for (const b of unknownVerdict) {
  console.log(`  !! ${b} carries a verdict here but is not a shipped block — renamed or removed?`);
}
/* Which of these carry a verdict is COMPUTED, not asserted. The only verdicts
   that exist are about zero reach, so this is expected to read "none" — and the
   day it does not, the staleVerdict line above has already fired. Printing a
   hardcoded "none adjudicated" would be a sentence that cannot go wrong, which
   this repo counts as a defect. Roadmap 163.1 is the item to fill this in. */
console.log(
  `  used once (${one.length}) — adjudicated: ` +
    `${one.filter(([b]) => ADJUDICATED.has(b)).map(([b]) => b).join(', ') || 'none'}; ` +
    `carrying no verdict: ` +
    `${one.filter(([b]) => !ADJUDICATED.has(b)).map(([b]) => b).join(', ') || 'none'}`,
);
console.log(
  '  zero reach is NOT automatically a defect — it can mean the component is ' +
    'correctly refused at the point of use, or that the suite has no screen of ' +
    'that shape. See roadmap 150.1.',
);
