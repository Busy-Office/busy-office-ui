/**
 * Gate: a pattern's "Components used" list describes what the screen RENDERS.
 *
 * @heuristic — decides whether a component "appears" by matching class names in
 *   built markup, which can be fooled by a name that is a prefix of another or
 *   by markup that lives only in a code sample. Carries --self-test.
 *
 * WHY. `/patterns/*` end with a "Components used" list and a complexity badge,
 * which reads as *this screen is built from these*. **Eleven of sixteen pages
 * listed components they never rendered** — `invoice-list` claimed `pagination`
 * and did not paginate; `master-detail` claimed `offcanvas` and rendered no
 * drawer; `settings-admin` claimed `dialog` with none on the page (Slices
 * 37/38/44 grill, H2).
 *
 * Every other gate passed on all sixteen, because each page is individually
 * valid HTML with real classes and real links. The defect is of a different
 * kind: **documentation disagreeing with its own demo**. A reader copying the
 * pattern gets less than the list promised.
 *
 * NAMES COME FROM api.json, NEVER FROM THE PAGE SLUG. That is the trap that made
 * this measurement wrong twice before it was right: `alerts` → `bo-alert`,
 * `button` → `bo-btn`, `dashboard` → `bo-widget`. A slug-to-class convention
 * reported 16 of 16 pages failing — a 100% rate, which CLAUDE.md now says to
 * treat as an instrument defect. Matching only exact blocks then reported 20
 * claims when the true figure is 18, because it missed parts: `filter-panel`
 * renders `.bo-dropdown__menu`, which IS the dropdown.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, CORE_DIST } from './paths.mjs';
import { distPages, demoRegion } from './dist-pages.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const api = JSON.parse(
  await readFile(join(CORE_DIST, 'api.json'), 'utf8'),
);

/** docs-page slug -> every block that component ships. */
const blocksBySlug = new Map();
for (const [name, entry] of Object.entries(api.components)) {
  const blocks = entry.blocks?.length ? entry.blocks : [`bo-${name}`];
  for (const key of new Set([api.pageSlug?.[name] ?? name, name])) {
    blocksBySlug.set(key, new Set([...(blocksBySlug.get(key) ?? []), ...blocks]));
  }
}

/** Does the page render this block, as itself or as one of its parts?
 *  Shared via renders-block.mjs (2026-08-21 sweep) — the self-test below
 *  exercises the imported function. */
import { rendersBlock } from './renders-block.mjs';
export { rendersBlock };

if (process.argv.includes('--self-test')) {
  selfTest([
    ['an exact block counts', rendersBlock('<i class="bo-badge">', 'bo-badge'), true],
    ['a PART counts as its block', rendersBlock('<div class="bo-dropdown__menu">', 'bo-dropdown'), true],
    ['a MODIFIER counts', rendersBlock('<i class="bo-badge bo-badge--type">', 'bo-badge'), true],
    ['a longer name does NOT count', rendersBlock('<div class="bo-data-table-container">', 'bo-data-table'), false],
    ['absent is absent', rendersBlock('<div class="bo-kv">', 'bo-progress'), false],
  ]);
}

const failures = [];
let listsChecked = 0;

for (const page of await distPages(DIST)) {
  if (!page.url.startsWith('/patterns/')) continue;
  const section = page.html.match(/<h2[^>]*>Components used<\/h2>([\s\S]*?)<\/section>/);
  if (!section) continue;
  listsChecked += 1;

  const rendered = demoRegion(page.html);

  for (const slug of new Set([...section[1].matchAll(/\/components\/([a-z-]+)/g)].map((m) => m[1]))) {
    const blocks = blocksBySlug.get(slug);
    if (!blocks) continue; // a page with no api.json entry (concepts-style) — not ours to police
    if (![...blocks].some((b) => rendersBlock(rendered, b))) {
      failures.push(
        `${page.url}\n     lists "${slug}" under Components used, but the screen never renders it` +
          `\n     render it, or take it off the list — the list is what the screen IS built from`,
      );
    }
  }
}

assertScanned(listsChecked, 'pattern "Components used" lists', 'no pattern page carried one — has the recipe changed?');

if (failures.length) {
  console.error(`components-used check FAILED — ${failures.length} claim(s) the screen does not keep:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`components-used check passed — ${listsChecked} pattern(s) list only components they render`);
