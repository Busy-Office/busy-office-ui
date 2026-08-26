#!/usr/bin/env node
/**
 * Gate: no external product is named in this repo's documents.
 *
 * Owner instruction, 2026-08-27: *"no mention about CoinMarketCap or ERPNext in
 * any doc"*. The scrub that followed touched eight files — a shipped source
 * comment in `examples/erp-suite/p2p/purchase-orders.screen.mjs`, three
 * `.roundtable/` notes, ROADMAP.md, the loop log, and two generated mirrors.
 *
 * WHY A GATE. This convention regrows by construction, which is the test this
 * repo applies before writing one. Research wakes exist to study external
 * references, and the natural way to record a finding is to name where it came
 * from — the roadmap entry scrubbed here did exactly that, twenty times, hours
 * after being written. The instruction is also invisible in the diff: nothing
 * about adding "per Vendor's list view" to a comment looks wrong in review.
 *
 * @exact — case-insensitive membership over a denylist of NAMES, checked
 * against comment-stripped-and-raw text alike (a vendor name in a comment is
 * still a mention; that is the whole point, and it is the opposite of
 * `check-loop-vocab`'s comment-blindness).
 *
 * ITS STATED LIMIT, because a denylist cannot claim completeness: it catches
 * the names that have actually occurred here plus the obvious neighbours. A
 * vendor nobody has written yet will pass. That is the same contract
 * `check-paths.mjs` states for its own spellings — it catches REGROWTH, which
 * is the failure that has actually happened, not every conceivable mention.
 *
 * Fixing a violation is not "delete the sentence". Describe the mechanism and
 * keep the verdict: *"a high-traffic market-data site"* carries the finding,
 * and where a finding is normative, cite the standard instead — that is the
 * durable citation anyway.
 */
import { readFile } from 'node:fs/promises';
import { gate, assertScanned } from './gate-report.mjs';
import { collectSource, byExt } from './source-files.mjs';

/* Names that have occurred in this repo, plus near neighbours. Lowercase;
   matched case-insensitively on a word boundary so "frappe" catches "Frappe's"
   but "cmc" does not fire on "cmcd" or a hash. */
const NAMES = [
  'coinmarketcap', 'coin market cap', 'cmc',
  'erpnext', 'frappe',
  'bitcoin', 'ethereum',
];

/* Where prose and shipped source live. Absent dirs are REPORTED, not skipped —
   the docs container copies only packages/ + apps/docs, and a gate that
   quietly passes because its input is missing is the failure `check:rtl`
   records. */
const ROOTS = [
  'ROADMAP.md', 'ROADMAP-archive.md', 'DESIGN.md', 'LOOPS.md', 'CLAUDE.md',
  'README.md', 'STATUS.md', '.roundtable', 'apps/docs/src', 'apps/docs/scripts',
  'packages/core/src', 'examples',
];

const KEEP = byExt('.md', '.astro', '.css', '.ts', '.tsx', '.mjs', '.js', '.json', '.html');

/* Source enumeration lives in source-files.mjs — see its header for why this
   script no longer rolls its own (Standardize sweep, 2026-08-27). */
const { files, missing } = await collectSource(ROOTS, { keep: KEEP });

/* This file necessarily contains the denylist it enforces. */
const SELF = 'apps/docs/scripts/check-vendor-names.mjs';
const g = gate('vendor-names check', 'file(s)');
let scanned = 0;
let hits = 0;

for (const { abs, rel } of files) {
  if (rel === SELF) continue;
  const text = (await readFile(abs, 'utf8')).toLowerCase();
  scanned += 1;
  const found = NAMES.filter((name) =>
    new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text),
  );
  hits += found.length;
  /* One assertion PER FILE, pass or fail — not one per violation. Checking
     only on failure made `report()` announce "0 file(s) checked" on a clean
     run, which is indistinguishable from having walked an empty tree. The
     count a gate prints has to be the count it actually looked at. */
  g.check(
    `${rel} names no external product`,
    found.length === 0,
    `found ${found.map((f) => `"${f}"`).join(', ')}. Describe the MECHANISM ` +
      `instead ("a high-traffic market-data site", "an open-source ERP desk"), ` +
      `or cite the standard if the finding is normative. Owner instruction, ` +
      `2026-08-27.`,
  );
}

assertScanned(scanned, 'file(s) scanned', 'wrong directory, or every root is missing?');

if (missing.length) {
  console.warn(
    `  note: ${missing.length} root(s) are not in this build context, so they ` +
      `were NOT verified — ${missing.join(', ')}`,
  );
}

g.report(
  `checked against ${NAMES.length} denied name(s)` +
    (hits ? '' : `; ${missing.length ? 'in-context roots' : 'all roots'} clean`),
);
