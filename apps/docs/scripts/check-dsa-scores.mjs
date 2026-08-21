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

const scores = JSON.parse(
  await readFile(new URL('../src/data/dsa-scores.json', import.meta.url), 'utf8'),
);
const DIMENSIONS = scores.rubric.dimensions;
const components = Object.entries(scores.components);

const g = gate('dsa-scores check', 'scored component(s)');
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
   score written and never shown. */
const pagesDir = new URL('../src/pages/components/', import.meta.url);
const rendered = new Set();
for (const f of await readdir(pagesDir)) {
  if (!f.endsWith('.astro')) continue;
  const src = await readFile(new URL(f, pagesDir), 'utf8');
  for (const m of src.matchAll(/<DsaScore\s+component="([^"]+)"/g)) rendered.add(m[1]);
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

  /* 5. A scored component renders its score somewhere. */
  g.check(`${name}: some page asks to render its score`, rendered.has(name), 'no page carries <DsaScore component="…" /> for it');

  /* 6. `na` is a claim that the dimension does not apply — it must not be the
        whole entry, or the component has no score at all. */
  g.check(`${name}: at least one dimension actually scored`, scored.length > 0, 'every dimension is "na"');
}

g.report(`verified (${components.length} scored, ${rendered.size} requested by a page)`);
