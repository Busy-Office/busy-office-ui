/**
 * Gate: the DSA score file has to agree with itself, and with the pages.
 *
 * `dsa-scores.json` is hand-edited by a scoring wake and rendered verbatim
 * onto public component pages, so a contradiction inside it ships. One did:
 * a Standardize sweep (2026-08-21) commented eleven components' intrinsic
 * literals and re-scored `spacing` to 3 but never cleared the matching
 * `improve` entries, so six pages published
 *
 *     Spacing   3 / 3   the 3rem bar height states why it is a FLOOR …
 *     Known gaps:       Comment the 3rem bar height.
 *
 * — the score and the gap contradicting each other, four lines apart, on a
 * page anyone can read. Nothing caught it because nothing was looking; the
 * file is data, and the build only ever validated the CSS it describes.
 *
 * Every assertion below is equality or membership over that data. There is
 * no recognising, no position-guessing, no "is this chrome or content" —
 * which is why this is @exact and ships no --self-test. The one judgement
 * it deliberately does NOT make is whether a score is *deserved*; that is a
 * human reading a citation, and no gate can stand in for it.
 *
 * @exact — equality and membership over a JSON file plus a literal-string
 * scan of the page sources. Exempt from --self-test: there is no heuristic to
 * get wrong.
 */
import { readFile, readdir } from 'node:fs/promises';
import { gate, assertScanned } from './gate-report.mjs';
import { EXEMPT as WRONG_CHOICE_EXEMPT, hasWrongChoiceClause } from './wrong-choice-rule.mjs';

const scores = JSON.parse(
  await readFile(new URL('../src/data/dsa-scores.json', import.meta.url), 'utf8'),
);
const DIMENSIONS = scores.rubric.dimensions;
const components = Object.entries(scores.components);

/* The noun names ASSERTIONS, not components: gate() reports results.length,
   and this file makes ~8 checks per component. It used to say "scored
   component(s)" and printed 312 of them when there are 39 — an 8x
   overstatement of its own coverage, found by the Objective grill of
   2026-08-21. A number a gate reports is load-bearing; that rule applies to
   the gate's own output first. */
const g = gate('dsa-scores check', 'assertion(s)');

/* 0. Every dimension declares WHICH ARTIFACT it is scored on (roadmap 292.3).
      Before that item the rubric was silent for three of the six, and a blind
      re-score scored one surface 2 or 3 depending on which way it guessed —
      `typography: 2` for raw font-size literals in a docs .astro, `3` for the
      same component's stylesheet. The scope is now stated in rubric.scope, and
      this asserts the statement stays COMPLETE and stays in step with
      rubric.dimensions: a dimension added later with no scope, or a scope key
      left behind by a renamed dimension, both fail here rather than being
      resolved by the next scorer's guess.

      Membership and set equality over a JSON file — no recognising, so this
      keeps the gate @exact. What it deliberately does NOT check is whether a
      given CITE respects its dimension's scope: that needs reading what a
      sentence is about, and 292.3's own count found the classifier for it is a
      keyword pass that misreads 5 of 240 in both directions. The count is in
      rubric.scope's $comment, where a human can re-run it. */
const SCOPES = new Set(['css', 'page']);
const scopeKeys = Object.keys(scores.rubric.scope ?? {}).filter((k) => !k.startsWith('$'));
const noScope = DIMENSIONS.filter((d) => !SCOPES.has(scores.rubric.scope?.[d]));
g.check(
  `rubric: every dimension declares a scope of ${[...SCOPES].join('/')}`,
  noScope.length === 0,
  `missing or invalid rubric.scope for: ${noScope.map((d) => `${d}=${JSON.stringify(scores.rubric.scope?.[d])}`).join(', ')}`,
);
const orphanScope = scopeKeys.filter((k) => !DIMENSIONS.includes(k));
g.check(
  'rubric: no scope entry names a dimension that does not exist',
  orphanScope.length === 0,
  `rubric.scope has ${orphanScope.join(', ')}, absent from rubric.dimensions`,
);

assertScanned(
  components.length,
  'scored components in dsa-scores.json',
  'The file parsed but held no components — a scoring pass that scored nothing.',
);

/* Which components a page actually asks to render. Read from the page
   SOURCES, not from `dist`: the rendered section carries no marker naming its
   component, and inventing one purely so a gate could grep for it would add
   published surface to serve the gate rather than the reader. `check-page-shape`
   already enforces the other direction — every component with a CSS dir must
   carry `<DsaScore component="…" />` — so what is left for this gate is the
   orphan case: a scored ENTRY that no page ever asks for, which would be a
   score written and never shown.

   THE MIRROR OF THAT CASE WENT UNASSERTED FOR FIVE DAYS, and this gate
   PRINTED it the whole time: its report line read "39 scored components (40
   requested by a page)" and passed. The missing one was `scan` — blind-scored
   on 2026-08-23 (Polish re-entry round, loop-log `bfe9798`), its three sub-3
   dimensions fixed in that same round, and the result written into
   `.roundtable/polish-state.md` prose and nowhere else. `dsa-scores.json` —
   which its own $comment calls the SOURCE OF TRUTH for what renders — never
   received the entry, so `/components/scan` published "Not yet scored" to
   every reader while three internal records said it had been.

   A gate that computes a discrepancy and reports it as prose has decided, on
   its own, what it failed to see. Assertion 7 asserts the count. */
const pagesDir = new URL('../src/pages/components/', import.meta.url);
const rendered = new Set();
const pageSlug = new Map();
const openerHasClause = new Map();
for (const f of await readdir(pagesDir)) {
  if (!f.endsWith('.astro')) continue;
  const src = await readFile(new URL(f, pagesDir), 'utf8');
  const slug = f.replace(/\.astro$/, '');
  for (const m of src.matchAll(/<DsaScore\s+component="([^"]+)"/g)) {
    rendered.add(m[1]);
    pageSlug.set(m[1], slug);
  }
  openerHasClause.set(slug, hasWrongChoiceClause(src));
}

for (const [name, entry] of components) {
  const dims = entry.dimensions ?? {};
  const scored = DIMENSIONS.map((d) => dims[d]).filter((x) => x && x.score !== 'na');

  /* 1. Every dimension present. A missing one makes DsaScore sum `undefined`
        and render NaN% — it computes over rubric.dimensions, not over the keys
        the entry happens to carry. */
  const missing = DIMENSIONS.filter((d) => !dims[d]);
  g.check(`${name}: has all ${DIMENSIONS.length} rubric dimensions`, missing.length === 0, `missing: ${missing.join(', ')}`);

  /* 2. Scores are 0-3 or the string 'na', nothing else. */
  const badScore = DIMENSIONS.filter((d) => {
    const s = dims[d]?.score;
    return s !== undefined && s !== 'na' && !(Number.isInteger(s) && s >= 0 && s <= 3);
  });
  g.check(`${name}: every score is 0-3 or "na"`, badScore.length === 0, `bad: ${badScore.map((d) => `${d}=${dims[d].score}`).join(', ')}`);

  /* 3. Every dimension carries a citation. The score is only as good as the
        thing a reader can check it against. */
  const uncited = DIMENSIONS.filter((d) => dims[d] && !String(dims[d].cite ?? '').trim());
  g.check(`${name}: every dimension carries a citation`, uncited.length === 0, `uncited: ${uncited.join(', ')}`);

  /* 4. THE ONE THAT SHIPPED. "Known gaps" with nothing below 3 is a page
        contradicting itself. An improve entry is a gap; a gap is a dimension
        under 3. */
  const below = DIMENSIONS.filter((d) => dims[d] && dims[d].score !== 'na' && dims[d].score < 3);
  const improve = entry.improve ?? [];
  g.check(
    `${name}: claims gaps only when a dimension scores below 3`,
    !(improve.length > 0 && below.length === 0),
    `all dimensions are 3 but improve says: ${JSON.stringify(improve)}`,
  );

  /* 4b. The RECIPROCAL of 4, and the one 37.3 was created to catch: a
         dimension below 3 is a gap, and a gap with no follow-up is a public
         page reporting a defect that nobody has queued. Four components
         (avatar, dashboard, kbd, prose) shipped `typography: 2` with no
         improve entry at all, and two more pointed at "roadmap 92.5" and
         "roadmap 94.1" — neither of which existed as an item. Entries are
         prefixed with their dimension so this is checkable rather than a
         guess at which free-text line addresses which score, and so the
         rendered "Known gaps" line tells a reader which rule it belongs to. */
  const unqueued = below.filter((d) => !improve.some((i) => i.startsWith(`${d} —`)));
  g.check(
    `${name}: every dimension below 3 has an improve entry naming it`,
    unqueued.length === 0,
    `below 3 with no "<dimension> — …" entry: ${unqueued.join(', ')}`,
  );

  /* 4c. `content` and check:wrong-choice must agree. The score is a claim
         about the same property the gate enforces, and 94.12 found them
         holding TWO different standards at once: 22 of 39 rows disagreed
         with the page, because 94.7 changed the definition without re-reading
         what had been judged under the old one. Asserting the equivalence
         here means that can only happen once. Writing a page's clause now
         raises its score AND shrinks the gate's TODO — one action, and
         neither record can quietly diverge from the other. */
  const slug = pageSlug.get(name);
  if (slug) {
    const contentIs3 = dims.content?.score === 3;
    const pageQualifies = WRONG_CHOICE_EXEMPT.has(slug) || openerHasClause.get(slug) === true;
    g.check(
      `${name}: content score agrees with check:wrong-choice`,
      contentIs3 === pageQualifies,
      `content=${dims.content?.score} but the opener ${pageQualifies ? 'DOES' : 'does NOT'} carry the required clause (/components/${slug})`,
    );
  }

  /* 5. A scored component renders its score somewhere. */
  g.check(`${name}: some page asks to render its score`, rendered.has(name), 'no page carries <DsaScore component="…" /> for it');

  /* 6. `na` is a claim that the dimension does not apply — it must not be the
        whole entry, or the component has no score at all. */
  g.check(`${name}: at least one dimension actually scored`, scored.length > 0, 'every dimension is "na"');
}

/* 7. THE MIRROR OF 5, and the one that shipped a public falsehood: a page
      asks for a score that does not exist. `DsaScore.astro` renders "Not yet
      scored — alignment scoring is proceeding in batches" for a missing
      entry, which is deliberate and right when nobody has scored the
      component, and a lie once somebody has and never wrote it down.

      Per-name rather than a bare `rendered.size === components.length`: two
      compensating errors (one orphan entry plus one unscored page) would
      satisfy a count comparison while both defects shipped. Membership names
      the offender, which is also what the failure message has to say to be
      actionable.

      No exemption list, deliberately. `check-page-shape` already requires
      every CSS-backed component to carry <DsaScore>, so a page reaching this
      assertion has already been judged score-worthy by another gate; a second
      list here would let one gate's requirement be waived in the other. If a
      component genuinely should not be scored, it loses its <DsaScore> call
      and answers to check-page-shape instead. */
const unscored = [...rendered].filter((name) => !scores.components[name]);
for (const name of [...rendered].sort()) {
  g.check(
    `${name}: the page that renders its score has one to render`,
    Boolean(scores.components[name]),
    `/components/${pageSlug.get(name)} carries <DsaScore component="${name}" /> but dsa-scores.json has no "${name}" entry, so the page publishes "Not yet scored"`,
  );
}

g.report(
  `verified across ${components.length} scored components (${rendered.size} requested by a page` +
    `${unscored.length ? `, ${unscored.length} of them UNSCORED: ${unscored.join(', ')}` : ', all scored'})`,
);
