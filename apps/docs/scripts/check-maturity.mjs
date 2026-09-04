/**
 * Gate: every maturity label on a BUILT component page traces to a generated
 * or recorded key, and a component that has no value for a label renders the
 * stated absence rather than a blank.
 *
 * That is roadmap 249.3's Accept, asserted where it can actually be checked —
 * on the rendered HTML. `Maturity.astro` reads four sources; a gate over those
 * sources would compare the record against itself and stay green if the render
 * silently dropped a row, which CLAUDE.md names outright: a reconciliation that
 * cannot see past its own caller is a detector that cannot fail. So the values
 * come from `dist/introduced.json`, `dist/floor.json`, `dsa-scores.json` and
 * `at-evidence.json`, and the SUBJECT is `apps/docs/dist/components/*.html`.
 *
 * The absence branches matter more than the present ones, because they are the
 * ones nothing else exercises. Today 40 of 40 components trace to a published
 * version and 0 of 40 have assistive-tech evidence, so "Introduced: not yet
 * published" and "AT: recorded" are both unreachable from live data — an arm
 * that only ever sees one branch has not been shown to distinguish them. Both
 * are red-proved by injecting a value into the record and rebuilding, which is
 * recorded in ROADMAP 249.3 rather than hidden in a --self-test that would run
 * against fixtures instead of pages.
 *
 * WHAT IT DOES NOT CHECK, stated so the pass is not over-read: whether a value
 * is CORRECT — whether 0.1.0 is really when `button` shipped. That is
 * `derive-introduced.mjs`'s job, and its answer comes from the registry's own
 * tarballs. This gate checks that what the page prints is what the record
 * holds.
 *
 * @exact — equality and membership between JSON keys and text extracted from
 * built HTML. No recognising, no position-guessing; exempt from --self-test.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned } from './gate-report.mjs';
import { decodeEntities } from './html-entities.mjs';

const CORE = new URL('../../../packages/core/dist/', import.meta.url);
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

const floor = await readJson(new URL('floor.json', CORE));
const introduced = await readJson(new URL('introduced.json', CORE));
const scores = await readJson(new URL('../src/data/dsa-scores.json', import.meta.url));
const atEvidence = await readJson(new URL('../src/data/at-evidence.json', import.meta.url));

const g = gate('maturity check', 'maturity label assertions');

/* The component set comes from floor.json's perComponent map, which
   derive-floor builds by reading dist/css/components/*.css — the shipped
   artifact, not a list anyone maintains. */
const components = Object.keys(floor.perComponent ?? {});
assertScanned(
  components.length,
  'components in floor.json perComponent',
  'run `npm run build -w @busy-office/ui` first',
);

/* Which built page documents which component. Read from the page SOURCES for
   the same reason check-dsa-scores does: the rendered section carries no
   marker naming its component, and composite pages (state-patterns documents
   both `skeleton` and `state`) mean the slug is not the key. */
const sources = await distPages(DIST); // built pages, for the HTML
const byUrl = new Map(sources.map((p) => [p.url, p.html]));

const pageSource = async (slug) =>
  readFile(new URL(`../src/pages/components/${slug}.astro`, import.meta.url), 'utf8');

/* slug -> components it mounts, from `<DsaScore component="…" />` in the page
   source. Maturity mounts from DsaScore, so this is the same set by
   construction — and the arms below assert the built page really carries one
   block per mounted component, which is what makes that more than an
   assumption. */
const { readdir } = await import('node:fs/promises');
const slugs = (await readdir(new URL('../src/pages/components/', import.meta.url)))
  .filter((f) => f.endsWith('.astro'))
  .map((f) => f.replace(/\.astro$/, ''));
const mounted = new Map();
for (const slug of slugs) {
  const src = await pageSource(slug);
  const names = [...src.matchAll(/<DsaScore\s+component="([^"]+)"/g)].map((m) => m[1]);
  if (names.length) mounted.set(slug, names);
}
assertScanned(mounted.size, 'component pages mounting <DsaScore>', 'did the docs build run?');

/** The text of every Maturity section on a page, tags stripped, whitespace
 *  collapsed — one entry per mounted component, in source order. The block runs
 *  to `</section>`, not to `</dl>`: the short `<dd>` values carry the facts and
 *  the caption underneath carries the reason an absent one is absent, so
 *  stopping at the list would leave every absence arm unable to see the
 *  sentence it is asserting. */
function maturityBlocks(html) {
  return [...html.matchAll(/<h2>Maturity[\s\S]*?<\/section>/g)].map((m) =>
    decodeEntities(m[0].replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

/* ---------- 1. every mounted component gets exactly one block ---------- */
let checkedBlocks = 0;
const blocksFor = new Map();
for (const [slug, names] of mounted) {
  const html = byUrl.get(`/components/${slug}/`);
  const blocks = html ? maturityBlocks(html) : [];
  g.check(
    `/components/${slug} renders one Maturity block per documented component (${names.length})`,
    blocks.length === names.length,
    html
      ? `page renders ${blocks.length} block(s) for ${names.length} component(s): ${names.join(', ')}`
      : 'no built page at that URL',
  );
  if (blocks.length === names.length) {
    names.forEach((name, i) => blocksFor.set(name, { slug, text: blocks[i] }));
    checkedBlocks += blocks.length;
  }
}
assertScanned(checkedBlocks, 'rendered Maturity blocks', 'the docs build produced none');

/* ---------- 2. every component in the shipped set reaches a page ---------- */
for (const name of components) {
  g.check(
    `${name} has a Maturity block on a built page`,
    blocksFor.has(name),
    'no page mounts <DsaScore> for it, so its maturity facts ship nowhere',
  );
}

/* ---------- 3. every label traces to its key, absence included ---------- */
for (const [name, { slug, text }] of blocksFor) {
  const where = `/components/${slug} (${name})`;

  const version = introduced.components?.[name] ?? null;
  g.check(
    `${where} — Introduced matches dist/introduced.json`,
    version === null
      ? /Not published yet/.test(text) && /no release ships it yet/.test(text)
      : text.includes(`v${version}`) && text.includes(`@busy-office/ui@${version}`),
    version === null
      ? `record has no version, so the page must say so. Block: ${JSON.stringify(text.slice(0, 220))}`
      : `record says ${version}. Block: ${JSON.stringify(text.slice(0, 220))}`,
  );

  const label = floor.perComponent[name]?.label;
  g.check(
    `${where} — CSS floor matches dist/floor.json perComponent`,
    Boolean(label) && text.includes(label),
    `floor.json says ${JSON.stringify(label)}. Block: ${JSON.stringify(text.slice(0, 300))}`,
  );

  const scored = scores.components?.[name]?.scored ?? null;
  g.check(
    `${where} — Alignment scored matches dsa-scores.json`,
    scored === null ? /Not yet scored/.test(text) : text.includes(scored),
    scored === null
      ? `no score recorded, so the page must say so. Block: ${JSON.stringify(text.slice(0, 300))}`
      : `dsa-scores.json says ${scored}. Block: ${JSON.stringify(text.slice(0, 300))}`,
  );

  const at = atEvidence.components?.[name] ?? null;
  g.check(
    `${where} — Assistive-tech evidence matches at-evidence.json`,
    at === null
      ? /None recorded/.test(text) && text.includes(atEvidence.blockedBy.why)
      : at.at.every((r) => text.includes(`${r.tool} ${r.version} on ${r.os}: ${r.verdict}`)),
    at === null
      ? `no AT record, so the page must say so and name the blocker. Block: ${JSON.stringify(text.slice(0, 400))}`
      : `at-evidence.json records ${JSON.stringify(at)}. Block: ${JSON.stringify(text.slice(0, 400))}`,
  );

  /* An empty value is the failure a presence check misses: `<dd></dd>` greps as
     present and reads as an omission. Every row must carry text. */
  g.check(
    `${where} — no maturity row renders empty`,
    !/(Introduced|CSS floor|Alignment scored|Assistive-tech evidence)\s+(?=Introduced|CSS floor|Alignment scored|Assistive-tech evidence|$)/.test(
      text,
    ),
    `a label is followed by the next label with nothing between. Block: ${JSON.stringify(text)}`,
  );
}

/* ---------- 4. the record and the shipped set agree ---------- */
g.check(
  'dist/introduced.json names every shipped component',
  components.every((c) => c in (introduced.components ?? {})),
  `missing: ${components.filter((c) => !(c in (introduced.components ?? {}))).join(', ')}`,
);

console.log(
  `  ${blocksFor.size} component(s) across ${mounted.size} page(s); ` +
    `${components.filter((c) => introduced.components[c] === null).length} not yet published, ` +
    `${components.filter((c) => !(c in (atEvidence.components ?? {}))).length} with no AT evidence`,
);
g.report();
