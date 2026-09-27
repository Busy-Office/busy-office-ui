#!/usr/bin/env node
//
// @exact — a fixed set of classes read from a built stylesheet's own selector
// text and compared, string-for-string, against a class token found in a
// built page's `class="…"` attributes. No recognition, no heuristic.
/**
 * roadmap 389.16 — every `bo-*` class an RF document's BUILT page uses has a
 * matching selector in the BUILT `rf-essentials.min.css` profile it loads.
 *
 * `check-markup.mjs` validates against the FULL framework's `api.json`, so a
 * class the framework ships somewhere is never flagged there even when the RF
 * profile itself never carries a rule for it — an RF handheld running only
 * `rf-essentials.min.css` renders that element unstyled, and no existing gate
 * sees it. This one reads the two BUILT ARTIFACTS the previous check does not:
 * the RF profile's own CSS text, and the six `/patterns/rf/*-rf/` pages that
 * declare (in their own prose, per each screen's header comment) that they
 * compose ONLY profile members.
 *
 * Method: extract every class token from the profile's selector text (the
 * left side of each rule, before `{`), and every `class="…"` token from each
 * RF-suffixed page's demo markup. A page class with no matching profile class
 * is reported. Utility classes and component classes are both in scope; a
 * consumer's own `data-*`/non-`bo-*` hooks are out of scope (6.2's contract).
 */
import { readFile } from 'node:fs/promises';
import { CORE_DIST, DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';

const PROFILE_PATH = `${CORE_DIST}/css/rf-essentials.min.css`;

// Known gaps, each with a reason (the `check:wrong-choice` EXEMPT pattern,
// CLAUDE.md). Not a silence switch for a NEW gap: only these two names are
// skipped, so a class this check has never seen before still fails loudly.
const EXEMPT = {
  'bo-u-tabular': '389.16, 2026-09-27 — 48 min bytes; the profile has 18 bytes of ' +
    'headroom (measured against build-rf-essentials.mjs\'s 41 kB budget, not the ' +
    'item\'s stale "179 characters"). Owner call: raise the RF budget or trim an ' +
    'existing component to make room.',
  'bo-u-text-muted': '389.16, 2026-09-27 — 50 min bytes; same 18-byte headroom, same owner call.',
};

function classesInSelectors(css) {
  // Every opening `{` is preceded by exactly one prelude — a selector list
  // for a style rule, or an at-rule's own head (`@layer bo-primitives`,
  // `@media (...)`, `@supports (...)`) for a nested block. Matching
  // `[^{}]*\{` globally, rather than splitting the file into top-level
  // blocks first, is what makes this correct at ANY nesting depth: an
  // earlier version took only the text before the FIRST `{` in each
  // `}`-delimited chunk, so `@layer bo-primitives { .bo-visually-hidden {`
  // — two opens before one close — discarded the real selector and kept
  // only the at-rule's own head, which contains no class and reported the
  // primitive as missing when it was on the very next line. A class token
  // is `.` followed by the usual CSS ident characters; over-collecting a
  // pseudo-class-adjacent token like `.bo-btn` inside `.bo-btn:hover` only
  // makes the profile side more permissive, never the page side, which is
  // the direction that cannot hide a finding.
  const out = new Set();
  for (const prelude of css.matchAll(/([^{}]*)\{/g)) {
    for (const m of prelude[1].matchAll(/\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)/g)) out.add(m[1]);
  }
  return out;
}

function classesOnPage(html) {
  const out = new Set();
  for (const m of html.matchAll(/\bclass="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c.startsWith('bo-')) out.add(c);
  }
  return out;
}

const profile = classesInSelectors(await readFile(PROFILE_PATH, 'utf8'));
const pages = (await distPages(DIST)).filter((p) => p.url.match(/^\/patterns\/rf\/[a-z-]+-rf\/?$/));

if (!pages.length) {
  throw new Error('check-rf-profile-coverage: no built /patterns/rf/*-rf/ pages found — run the docs build first.');
}

let problems = 0;
let exempted = 0;
const perPage = [];
for (const p of pages) {
  const used = classesOnPage(p.html);
  const allMissing = [...used].filter((c) => !profile.has(c)).sort();
  const missing = allMissing.filter((c) => !(c in EXEMPT));
  exempted += allMissing.length - missing.length;
  perPage.push({ url: p.url, used: used.size, missing, exempt: allMissing.filter((c) => c in EXEMPT) });
  problems += missing.length;
}

for (const { url, used, missing, exempt } of perPage) {
  const status = missing.length ? `${missing.length} class(es) with no rule in the profile`
    : exempt.length ? `all covered (${exempt.length} exempt)` : 'all covered';
  console.log(`  ${url}  (${used} bo-* class(es) used) — ${status}`);
  for (const c of missing) console.log(`    .${c} — used here, no selector in rf-essentials.min.css`);
  for (const c of exempt) console.log(`    .${c} — EXEMPT: ${EXEMPT[c]}`);
}

if (problems) {
  console.error(
    `rf-profile-coverage check FAILED — ${problems} class use(s) across ${pages.length} isolated ` +
      'rf-essentials page(s) have no matching rule in the profile they load. Add the class to the ' +
      "profile (measure the byte cost against build-rf-essentials.mjs's budget), remove it from the " +
      'page, or list it with a reason.',
  );
  process.exit(1);
}
console.log(
  `rf-profile-coverage check passed — ${pages.length} isolated rf-essentials page(s), every bo-* ` +
    `class used has a rule in the profile (${exempted} exempt, see EXEMPT above)`,
);

// --self-test: the check must be able to fail. A class present on a page but
// absent from a minimal profile is the injection; a class present in both is
// the control. `@exact` per this file's own header — proven by construction,
// not by trusting the two functions in isolation.
if (process.argv.includes('--self-test')) {
  const p = classesInSelectors('.bo-btn{color:red}.bo-btn:hover{color:blue}');
  const bad = [];
  if (!p.has('bo-btn')) bad.push('classesInSelectors missed a plain class');
  // The bug this file was first shipped with (found live, roadmap 389.16): a
  // class nested inside an at-rule, one prelude before it in the same
  // top-level block. `.bo-visually-hidden` must be found here or this
  // check would have reported it missing from a profile that ships it.
  const nested = classesInSelectors('@layer bo-primitives { .bo-visually-hidden { position: absolute; } }');
  if (!nested.has('bo-visually-hidden')) bad.push('classesInSelectors missed a class nested inside @layer');
  const doubleNested = classesInSelectors('@media screen { @supports (a: b) { .bo-deep { color: red; } } }');
  if (!doubleNested.has('bo-deep')) bad.push('classesInSelectors missed a class nested two @-rules deep');
  const page = classesOnPage('<div class="bo-btn bo-missing"></div><span class="not-bo"></span>');
  if (!page.has('bo-btn') || !page.has('bo-missing') || page.has('not-bo')) {
    bad.push('classesOnPage did not collect exactly the bo-* tokens');
  }
  const missing = [...page].filter((c) => !p.has(c));
  if (!(missing.length === 1 && missing[0] === 'bo-missing')) {
    bad.push(`the missing-class diff did not isolate the injected gap: ${JSON.stringify(missing)}`);
  }
  if (bad.length) {
    console.error('check-rf-profile-coverage --self-test FAILED:\n  ' + bad.join('\n  '));
    process.exit(1);
  }
  console.log('check-rf-profile-coverage --self-test: 5 cases behave (selector extraction, one- and two-deep @-rule nesting, page extraction, the missing-class diff isolates an injected gap)');
}
