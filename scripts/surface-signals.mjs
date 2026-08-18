#!/usr/bin/env node
/**
 * Measure the OBJECTIVE signals behind the Slice 37 surface review, and write
 * them to `.roundtable/surface-baseline.md`.
 *
 * WHY THIS IS A SCRIPT AND NOT A ONE-OFF. The review scores 39 components and
 * 16 patterns, and a score with no citation is the exact defect this repo has
 * spent five slices chasing. Anything countable is counted here, once,
 * reproducibly, so the scoring in 37.2 argues over judgement rather than over
 * arithmetic — and so the baseline can be re-run later to see what moved.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: score. Three of the rubric's four
 * dimensions have a measurable proxy; **Composition** — "could this be built
 * from primitives already shipped?" — has none, and inventing a number for it
 * would make the whole table look more rigorous than it is. The columns below
 * are inputs to a judgement, not the judgement.
 *
 * Read each column as a LEAD, not a verdict. The first run's headline was six
 * components used by zero shipped screens, and at least two of those are
 * findings about the screens rather than the components: `offcanvas` is linked
 * from master-detail as the answer for narrow screens but never used in one,
 * and a `pagination` that `invoice-list` does not use says something about
 * invoice-list.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS_DIR = join(REPO, 'packages/core/src/css/components');
const PATTERNS = join(REPO, 'apps/docs/src/pages/patterns');
const PO_APP = join(REPO, 'examples/po-app');

const api = JSON.parse(await readFile(join(REPO, 'packages/core/dist/api.json'), 'utf8'));
const behaviors = JSON.parse(await readFile(join(REPO, 'packages/core/dist/behaviors.json'), 'utf8'));
const claims = await readFile(join(REPO, 'apps/docs/scripts/check-claims.mjs'), 'utf8');

/** Every file that renders a real SCREEN: the pattern pages + the reference app. */
async function screenFiles() {
  const out = [];
  for (const f of await readdir(PATTERNS)) if (f.endsWith('.astro')) out.push(join(PATTERNS, f));
  const walk = async (dir) => {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules') await walk(p);
      } else if (/\.(mjs|js|html|astro)$/.test(e.name)) out.push(p);
    }
  };
  await walk(PO_APP);
  return out;
}

const screens = await screenFiles();
if (screens.length < 10) {
  throw new Error(
    `surface-signals: found only ${screens.length} screen files — the Demand column would be ` +
      'meaningless. Have the pattern pages or examples/po-app moved?',
  );
}
const screenText = await Promise.all(
  screens.map(async (f) => [f.replace(REPO + '/', ''), await readFile(f, 'utf8')]),
);

const dirNames = new Set(
  (await readdir(CSS_DIR, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name),
);

const rows = [];
for (const name of [...dirNames].sort()) {
  const files = (await readdir(join(CSS_DIR, name))).filter((f) => f.endsWith('.css'));
  const css = (await Promise.all(files.map((f) => readFile(join(CSS_DIR, name, f), 'utf8')))).join('\n');

  const entry = api.components[api.pageSlug?.[name] ?? name] ?? api.components[name];
  /* Blocks this component OWNS.
   *
   * Not simply `entry.blocks`: api.json groups by docs page, so `offcanvas`
   * lists `bo-sidebar-nav` alongside `bo-offcanvas` — and counting that gave
   * offcanvas credit for every screen using the app shell's sidebar, when no
   * screen uses an offcanvas at all. A single mis-attributed block moved it out
   * of the zero-usage list, which is the wrong direction for a signal whose
   * whole job is to be suspicious.
   *
   * Ownership rule: a block belongs to the directory whose NAME matches it
   * (`bo-sidebar-nav` -> `sidebar-nav/`); otherwise to the directory that
   * defines it. So `alert` still gets `bo-toast` — no `toast/` directory
   * exists — while `offcanvas` no longer borrows the sidebar's usage. */
  const blocks = (entry?.blocks ?? [`bo-${name}`]).filter(
    (b) => b === `bo-${name}` || !dirNames.has(b.replace(/^bo-/, '')),
  );

  const usedBy = screenText
    .filter(([, text]) => blocks.some((b) => text.includes(b)))
    .map(([f]) => f);

  rows.push({
    name,
    blocks,
    selectors: entry?.classes?.length ?? 0,
    cssLines: css.split('\n').length,
    screens: usedBy.length,
    usedBy,
    /* An init function whose name contains the component's — a rough but honest
       match, and the column says so. */
    hasBehavior: behaviors.exports.some((e) =>
      e.toLowerCase().startsWith('init') && e.toLowerCase().includes(name.replace(/-/g, '').slice(0, 6)),
    ),
    claims: blocks.some((b) => claims.includes(b)) || claims.includes(`/components/${name}/`),
    forcedColors: /@media \(forced-colors: active\)/.test(css),
    densityAware: /--bo-density|data-density/.test(css),
  });
}

const yn = (b) => (b ? 'yes' : '—');
const table = [
  '| Component | Screens using it | Selectors | CSS lines | JS behavior | Executable claim | forced-colors | density-aware |',
  '|---|--:|--:|--:|---|---|---|---|',
  ...rows.map(
    (r) =>
      `| \`${r.name}\` | **${r.screens}** | ${r.selectors} | ${r.cssLines} | ${yn(r.hasBehavior)} | ${yn(r.claims)} | ${yn(r.forcedColors)} | ${yn(r.densityAware)} |`,
  ),
].join('\n');

const unused = rows.filter((r) => r.screens === 0);
const md = `# Surface baseline — measured signals for the Slice 37 review

Generated by \`scripts/surface-signals.mjs\`. **Re-run it; do not hand-edit.**

These are the countable inputs to the review, not the review. Every column is a
**lead**, and the leads point in both directions — a component no screen uses
may be dead weight, or may be evidence that a screen is missing something it
should have.

- **Screens using it** — of ${screens.length} files that render a real screen
  (${(await readdir(PATTERNS)).filter((f) => f.endsWith('.astro')).length} pattern pages + the \`examples/po-app\` reference).
  Matched on the blocks a component OWNS: \`alert\` counts \`bo-toast\` (no
  \`toast/\` directory exists), but \`offcanvas\` does not count \`bo-sidebar-nav\`,
  which \`sidebar-nav/\` owns. Counting api.json's grouping instead credited
  offcanvas with every screen using the app shell and moved it out of this list.
- **Selectors** — public class count from \`api.json\`: the surface a consumer
  must learn, and the cost side of every keep/remove decision.
- **Executable claim** — whether \`check-claims.mjs\` exercises it in a browser,
  or its documented behaviour rests on prose alone.
- **forced-colors / density-aware** — whether its CSS honours those contracts at
  all. A blank is not automatically a defect: a component with no colour of its
  own needs no forced-colors rule.

**Not measured here: Composition** — "could this be built from primitives that
already ship?" There is no honest proxy for it, so it is scored by hand in 37.2
rather than given a number that would make this table look more rigorous than it
is.

## Used by no shipped screen (${unused.length} of ${rows.length})

${unused.map((r) => `- \`${r.name}\` — ${r.selectors} selectors, ${r.cssLines} lines of CSS`).join('\n')}

Starting questions for 37.2, not conclusions: is it genuinely unneeded, is it
needed by a screen that does not exist yet, or is a screen that SHOULD use it
quietly doing without?

## All components

${table}
`;

const out = join(REPO, '.roundtable/surface-baseline.md');
await writeFile(out, md);
console.log(
  `surface baseline written — ${rows.length} components across ${screens.length} screen files; ` +
    `${unused.length} used by no screen`,
);
