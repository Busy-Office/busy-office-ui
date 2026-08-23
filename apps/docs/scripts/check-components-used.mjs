/**
 * Gate: a pattern's "Components used" list describes what the screen RENDERS.
 *
 * @heuristic — decides whether a component "appears" by matching class names in
 *   built markup, which can be fooled by a name that is a prefix of another or
 *   by markup that lives only in a code sample. Carries --self-test.
 *
 * READS THE EMBED, TOO (roadmap 131.1). The RF screens render inside a
 * same-origin `<iframe>`, so a gate reading only the outer page sees an empty
 * screen. When the inline duplicates of those screens were removed, this went
 * red on 11 claims that were all TRUE — which is the useful kind of red: the
 * evidence had moved one document down, not disappeared. `demoRegionWithEmbeds`
 * follows it, the same call `axe-audit` already makes for these frames.
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
import { distPages, demoRegionWithEmbeds } from './dist-pages.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const api = JSON.parse(
  await readFile(join(CORE_DIST, 'api.json'), 'utf8'),
);

/** docs-page slug -> every block that component ships. */
const blocksBySlug = new Map();
const attrsBySlug = new Map();
for (const [name, entry] of Object.entries(api.components)) {
  /* An attribute-only component (scan, 126.2) has no blocks — its render
     evidence is one of its data-* hooks in the demo region, the same
     generalization extract-api itself made for attr-only surfaces. Only
     use the bo-<name> guess when the entry has neither. */
  const blocks = entry.blocks?.length ? entry.blocks
    : entry.dataAttrs?.length ? [] : [`bo-${name}`];
  for (const key of new Set([api.pageSlug?.[name] ?? name, name])) {
    blocksBySlug.set(key, new Set([...(blocksBySlug.get(key) ?? []), ...blocks]));
    attrsBySlug.set(key, new Set([...(attrsBySlug.get(key) ?? []), ...(entry.dataAttrs ?? [])]));
  }
}

/** Does the page render this block, as itself or as one of its parts?
 *  Shared via renders-block.mjs (2026-08-21 sweep) — the self-test below
 *  exercises the imported function. */
import { rendersBlock } from './renders-block.mjs';
export { rendersBlock };

/* `/` is deliberately in this fixture: it is a suffix of every src, and the
   first version of demoRegionWithEmbeds matched it instead of the mirror —
   embedding the landing page as the RF screen's evidence. */
const EMBED_FIXTURE = new Map([
  ['/', '<html><body><main><div class="bo-widget"></div></main></body></html>'],
  ['/patterns/rf/x-rf/', '<html><body><main><dl class="bo-kv"></dl></main></body></html>'],
]);

if (process.argv.includes('--self-test')) {
  selfTest([
    ['an exact block counts', rendersBlock('<i class="bo-badge">', 'bo-badge'), true],
    ['a PART counts as its block', rendersBlock('<div class="bo-dropdown__menu">', 'bo-dropdown'), true],
    ['a MODIFIER counts', rendersBlock('<i class="bo-badge bo-badge--type">', 'bo-badge'), true],
    ['a longer name does NOT count', rendersBlock('<div class="bo-data-table-container">', 'bo-data-table'), false],
    ['absent is absent', rendersBlock('<div class="bo-kv">', 'bo-progress'), false],
    /* The embed half (131.1): a screen shown in a same-origin iframe is
       rendered by the page. The base-path case is the one that would fail
       on CI only, so it is the one asserted. */
    [
      'an EMBEDDED screen counts, base path and all',
      demoRegionWithEmbeds(
        '<section class="demo"><iframe src="/busy-office-ui/patterns/rf/x-rf/"></iframe></section>',
        EMBED_FIXTURE,
      ).includes('bo-kv'),
      true,
    ],
    [
      'a page it does not embed contributes nothing',
      demoRegionWithEmbeds('<section class="demo"><p>no frame here</p></section>', EMBED_FIXTURE)
        .includes('bo-kv'),
      false,
    ],
    [
      'the embed is the frame\'s page, not the "/" that also suffix-matches',
      demoRegionWithEmbeds(
        '<section class="demo"><iframe src="/busy-office-ui/patterns/rf/x-rf/"></iframe></section>',
        EMBED_FIXTURE,
      ).includes('bo-widget'),
      false,
    ],
  ]);
}

const failures = [];
let listsChecked = 0;

const pages = await distPages(DIST);
/* Every built page by url, so a pattern's screen can be read where it
   actually renders — see demoRegionWithEmbeds. */
const htmlByUrl = new Map(pages.map((p) => [p.url, p.html]));

for (const page of pages) {
  if (!page.url.startsWith('/patterns/')) continue;
  const section = page.html.match(/<h2[^>]*>Components used<\/h2>([\s\S]*?)<\/section>/);
  if (!section) continue;
  listsChecked += 1;

  const rendered = demoRegionWithEmbeds(page.html, htmlByUrl);

  for (const slug of new Set([...section[1].matchAll(/\/components\/([a-z-]+)/g)].map((m) => m[1]))) {
    const blocks = blocksBySlug.get(slug);
    if (!blocks) continue; // a page with no api.json entry (concepts-style) — not ours to police
    const attrs = attrsBySlug.get(slug) ?? new Set();
    const rendersAttr = [...attrs].some((a) => new RegExp(`\\s${a}[\\s>=]`).test(rendered));
    if (![...blocks].some((b) => rendersBlock(rendered, b)) && !rendersAttr) {
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
