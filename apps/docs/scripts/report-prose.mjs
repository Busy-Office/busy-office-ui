#!/usr/bin/env node
/**
 * REPORT (not a gate): how many reader-facing words does each built docs page
 * carry? Roadmap 158, re-measured under 159's rule.
 *
 * @exact — word-boundary counting over a DOM subtree chosen by tag, after
 * removing whole elements by tag name. Nothing is recognised or inferred.
 *
 * WHY THIS EXISTS AS A COMMITTED SCRIPT. Slice 158's baseline — "107 pages,
 * median 775, data-table at 4,429" — was taken by an ad-hoc instrument that was
 * never written down, so the numbers could not be re-run, only re-derived. By
 * the time 158.1 came up for build, 157.3 had added +337 reader-facing words to
 * the very page 158.1 leads with, and nobody could say what the figure was now
 * without rebuilding the instrument from scratch. That is exactly the failure
 * the 2026-08-28 Objective grill found twice over (roadmap 159, finding A):
 * **when an item's premise is a measurement, the command belongs next to the
 * claim.** This is that command.
 *
 * WHY IT REPORTS AND DOES NOT FAIL. Slice 158 refuses a word-count gate up
 * front and the reasoning stands: prose here CARRIES DECISIONS — every refusal
 * with its reason, every measured number — and a budget cannot tell a recorded
 * decision from padding, so it would push the loop to delete the sentences that
 * earn their place. Worse, it is satisfiable by moving words into a code
 * comment where no gate looks. Measure it; judge it per page; do not gate it.
 *
 * WHAT IS COUNTED, stated because a word count is meaningless without it:
 *
 *   - the `<main>` subtree only — the shell (sidebar nav, header, skip links)
 *     is on every page, and counting it would add the same constant to all of
 *     them. An identical value across many different inputs is this repo's
 *     standing tell for a broken instrument, so the shell is removed rather
 *     than tolerated;
 *   - with `<pre>`, `<script>`, `<style>`, `<svg>` and `<template>` removed
 *     whole. A code sample is not prose a reader reads, and the copy-paste
 *     markup blocks would otherwise dominate every component page;
 *   - redirect stubs excluded, via `distPages` — the previous instrument
 *     followed one and counted `/patterns/list-report` twice, reporting an
 *     eighth outlier at a byte-identical 1,897 words. The chokepoint has
 *     handled this since 2026-08-18; rolling a private walker is what let the
 *     trap bite;
 *   - the RF screens and the iframe demo fragments excluded (see `NOT_PROSE`).
 *     They are rendered artefacts, not pages a reader reads: the five smallest
 *     come in at 12-20 words, and leaving them in drags the median down and so
 *     inflates the "over 2x the median" set that 158.1 works through.
 *
 * WHY THE COUNTS MOVED against 158's baseline, reconciled exactly rather than
 * waved at. That baseline said 107 pages; this says 118. The difference is 11
 * pages under `/base/` (6) and `/reference/` (5) that the old instrument left
 * out — 41 components + 41 patterns + 16 concepts + 8 getting-started + the
 * root is exactly 107, and adding those two directories is exactly 118. They
 * are ordinary reader-facing documentation and belong in the count. Beyond the
 * page set the two instruments are not comparable at all — the old one was
 * never written down, so its extraction rules are unknown — which is the whole
 * reason this file exists. Compare runs of THIS script.
 */
import { JSDOM } from 'jsdom';
import { distPages } from './dist-pages.mjs';
import { assertScanned } from './gate-report.mjs';
import { DIST } from './paths.mjs';

/** Elements removed whole before counting. */
const DROP = ['pre', 'script', 'style', 'svg', 'template'];

/* Built pages that are not documentation prose. Stated as a prefix list with
   the reason, not recognised by a heuristic — the question "is this a page a
   reader reads" is a judgement, and this project's heuristics for recognising
   a category of thing have a poor record.
     /components/demos/  — fragments an <iframe> on a component page renders
     /patterns/rf/       — chrome-free RF screens, demos of a device profile */
const NOT_PROSE = ['/components/demos/', '/patterns/rf/'];

/** Reader-facing word count for one built page's HTML. */
export function proseWords(html) {
  const doc = new JSDOM(html).window.document;
  const main = doc.querySelector('main');
  if (!main) return null; // caller decides — a page with no <main> is a finding, not a zero
  for (const el of main.querySelectorAll(DROP.join(','))) el.remove();
  return (main.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
}

const built = await distPages(DIST);
assertScanned(built.length, 'built docs pages', 'is apps/docs/dist built?');
const pages = built.filter((p) => !NOT_PROSE.some((prefix) => p.url.startsWith(prefix)));
assertScanned(pages.length, 'documentation pages after the NOT_PROSE filter', 'did a route move?');

const rows = [];
const noMain = [];
for (const p of pages) {
  const words = proseWords(p.html);
  if (words === null) noMain.push(p.url);
  else rows.push({ url: p.url, words });
}
assertScanned(rows.length, 'pages with a <main>', 'did the page shell change?');

rows.sort((a, b) => b.words - a.words);
const total = rows.reduce((n, r) => n + r.words, 0);
const sorted = [...rows].map((r) => r.words).sort((a, b) => a - b);
const median = sorted.length % 2
  ? sorted[(sorted.length - 1) / 2]
  : Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2);
const mean = Math.round(total / rows.length);

/* CHROME-EXCLUSION CHECK, and the first version of it was a detector that could
   not fail. It looked for the same count repeated across many pages, on the
   theory that leaked chrome would make pages look alike. Red-proved by swapping
   `main` for `body`: the shell went into every count — the median moved 739 ->
   1034 — and the alarm stayed silent, because a constant added to every page
   leaves them all still different. A "suspiciously tidy number" heuristic is
   the wrong shape here.

   What is exact is the comparison itself: if `<main>` really excludes the
   shell, then on a page that HAS a shell the whole `<body>` must carry more
   words than `<main>` does. Substitute `body` for `main` and that difference
   becomes exactly zero, everywhere, which is what makes this falsifiable. One
   extra parse, on the longest page, rather than doubling the whole sweep. */
const longest = pages.find((p) => p.url === rows[0].url);
const bodyDoc = new JSDOM(longest.html).window.document.querySelector('body');
for (const el of bodyDoc.querySelectorAll(DROP.join(','))) el.remove();
const bodyWords = (bodyDoc.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
const chrome = bodyWords - rows[0].words;
const suspicious =
  median === 0 ? 'the median is ZERO — the <main> selector or the word regex is broken'
  : chrome <= 0
    ? `<body> and <main> agree on ${longest.url} (${bodyWords} vs ${rows[0].words}) — the shell is NOT being excluded`
    : null;

console.log(
  `prose report — ${rows.length} documentation page(s) of ${built.length} built · median ${median} · ` +
    `mean ${mean} · total ${total.toLocaleString('en-US')} words ` +
    `(reader-facing text inside <main>, with ${DROP.join('/')} removed)`,
);
if (suspicious) console.log(`  !! ${suspicious}`);
if (noMain.length) console.log(`  !! ${noMain.length} page(s) have no <main> and were not counted: ${noMain.join(', ')}`);

const OVER = median * 2;
const outliers = rows.filter((r) => r.words > OVER);
console.log(`  over 2x the median (${OVER}) — ${outliers.length} page(s):`);
for (const r of outliers) {
  console.log(`    ${String(r.words).padStart(6)}  ${(r.words / median).toFixed(1)}x  ${r.url}`);
}
console.log(
  '  a long page is not automatically a defect — 158 asks, per page, whether the ' +
    'PROSE is wrong or the THING it documents is. Do not gate this number.',
);
