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

const words = (el) => (el.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;

/**
 * Reader-facing word count for one built page, split three ways. The split was
 * added by 158.1's round (2026-08-28), because working through twelve outliers
 * by hand produced two facts a bare total cannot show, and 159's rule says the
 * command belongs next to the claim rather than being re-derived:
 *
 *   - `generated` — words inside a section whose own <h2> carries the page's
 *     `generated` badge (ApiTable, ClassRef, DsaScore, and the which-pattern
 *     index). This is a FIXED COST of the page recipe, not the author's prose:
 *     it runs 19-34% of every component page in the outlier set, and for
 *     `/components/combobox/` it is a third of the page. Judging an author by a
 *     number a quarter of which is machine-written is the wrong instrument.
 *     Exact, not recognised — the badge is emitted by those components; nothing
 *     here guesses from heading text. It was worth a fix rather than a
 *     heuristic: `DsaScore` was missing the badge on all 38 scored pages and
 *     gained it in the same commit.
 *   - `hidden` — words inside an element carrying `hidden` at load, which a
 *     reader does not read unless they click. It is 3 on nearly every page (the
 *     "On this page" TOC aside before JS fills it) and **530 of 1,490 on
 *     `/components/tabs/`**, whose demo repeats a caption inside each of 21
 *     tab panels. Subtract it and that page is no longer an outlier at all —
 *     the length was in the measurement, not the page.
 *
 * The two are measured independently and could in principle overlap; only
 * `generated` is subtracted to form the printed `authored` figure.
 */
export function proseParts(html) {
  const doc = new JSDOM(html).window.document;
  const main = doc.querySelector('main');
  if (!main) return null; // caller decides — a page with no <main> is a finding, not a zero
  for (const el of main.querySelectorAll(DROP.join(','))) el.remove();
  const gen = [...main.querySelectorAll('section')].filter((s) => {
    if (s.parentElement.closest('section')) return false; // nested: counted by its ancestor
    const h = s.querySelector('h2');
    return !!h && [...h.querySelectorAll('.bo-badge')].some((b) => /generated/i.test(b.textContent));
  });
  const hid = [...main.querySelectorAll('[hidden]')].filter((e) => !e.parentElement.closest('[hidden]'));
  return {
    words: words(main),
    generated: gen.reduce((n, s) => n + words(s), 0),
    hidden: hid.reduce((n, e) => n + words(e), 0),
  };
}

const built = await distPages(DIST);
assertScanned(built.length, 'built docs pages', 'is apps/docs/dist built?');
const pages = built.filter((p) => !NOT_PROSE.some((prefix) => p.url.startsWith(prefix)));
assertScanned(pages.length, 'documentation pages after the NOT_PROSE filter', 'did a route move?');

const rows = [];
const noMain = [];
for (const p of pages) {
  const parts = proseParts(p.html);
  if (parts === null) noMain.push(p.url);
  else rows.push({ url: p.url, family: p.url.match(/^\/([^/]+)\//)?.[1] ?? '(root)', ...parts });
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
console.log(`  over 2x the median (${OVER}) — ${outliers.length} page(s):  [words = authored + generated; hidden-at-load shown when over 10]`);
for (const r of outliers) {
  const hid = r.hidden > 10 ? `  ${r.hidden} hidden` : '';
  console.log(
    `    ${String(r.words).padStart(6)}  ${(r.words / median).toFixed(1)}x  ` +
      `${String(r.words - r.generated).padStart(5)} authored + ${String(r.generated).padStart(4)} generated` +
      `${hid.padEnd(12)}  ${r.url}`,
  );
}

/* PER-FAMILY MEDIANS, and this is the second thing 158.1's round could not say
   from one number. The families do not have the same MANDATED shape: the
   pattern recipe requires an anatomy list, a data contract and a states table
   before an author writes a word, while a `/getting-started/` page has no
   recipe at all. Their medians run from 346 to 1,023 — a 3x spread — so a
   single corpus threshold flags `/reference/` pages for being reference pages
   and can never flag a `/base/` page however bloated it gets.

   Measured on the run that introduced this: taking 2x WITHIN each family also
   yields twelve pages, which is a coincidence and is why the sets are printed
   rather than the counts — three pages swap in and three swap out. */
const byFamily = new Map();
for (const r of rows) byFamily.set(r.family, [...(byFamily.get(r.family) ?? []), r]);
const medianOf = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2);
};
/* The family list prints the SAME authored+generated split the corpus list
   above does, and it did not until 2026-08-28 (Slice 169.2). This file's own
   header argues why the split matters — "judging an author by a number a
   quarter of which is machine-written is the wrong instrument" — and then the
   family half printed a bare URL, so the one thing a reader needs in order to
   skip a page was the one thing missing.

   That cost is measured, not supposed. 161.1's verdict on
   `/concepts/js-behaviors/` is "the instrument, not the page": 1,054 of its
   1,429 words are generated, leaving 375 authored, which is BELOW its own
   family median. None of that is visible from the family line, so the wake
   that reads it writes a throwaway probe to re-derive the split — which is
   exactly what Slice 169's own Standardize round did before finding the
   verdict already existed. Printing three numbers is cheaper than the probe. */
console.log('  by family — a family median, and what 2x it flags  [Na = authored, Ng = generated]:');
for (const [fam, rs] of [...byFamily].sort()) {
  const m = medianOf(rs.map((r) => r.words));
  const over = rs.filter((r) => r.words > m * 2);
  const flagged = over
    .map((r) => `${r.url} ${r.words - r.generated}a+${r.generated}g`)
    .join('  ');
  console.log(
    `    ${fam.padEnd(16)} n=${String(rs.length).padStart(3)}  median ${String(m).padStart(5)}  ` +
      `over 2x: ${over.length ? flagged : '—'}`,
  );
}
console.log(
  '  a long page is not automatically a defect — 158 asks, per page, whether the ' +
    'PROSE is wrong or the THING it documents is. Do not gate this number.',
);
