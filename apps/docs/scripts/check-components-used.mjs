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
 * IT ALSO ASKS THE CONVERSE, BUT ONLY FOR ATTRIBUTE-ONLY COMPONENTS (roadmap
 * 279.2). Until 2026-09-05 this gate was one-directional — it failed a page that
 * LISTS what it does not render, and never a page that RENDERS what it does not
 * list. `/patterns/goods-receipt` fell straight through: its opener says the
 * screen is "composed from `data-scan-input`", its embedded screen runs one, and
 * its Components-used list named neither `scan` nor anything else for it. Three
 * sibling RF screens (`rf-count`, `rf-pick`, `rf-putaway`) all listed it, so the
 * omission was 1 of 4 and invisible to every gate.
 *
 * The BLANKET converse is refused, on measurement rather than taste (94.11's
 * base-rate rule). Asking "does the list name every component the screen
 * renders" reports **357 misses across 39 of 39 pattern pages** — the list is a
 * curated handful beside a `complexity N of 4` badge, not an inventory, so the
 * predicate is uniformly true and the arm could never fail.
 *
 * An attribute-only component is the case where the converse does discriminate,
 * and for a reason rather than a threshold: it ships no block of its own — its
 * whole presence on a screen is one opt-in `data-*` hook a reader cannot see in
 * the markup they are copying, so the Components-used list is the ONLY place
 * that tells them the screen depends on it. The universe is read from api.json
 * (`dataAttrs` and no `blocks`), so it grows on its own; today it is exactly one
 * component, `scan`, on 4 of the 39 pages, and the arm goes red on the real
 * omission — red-proved by deleting that one `<li>` from the BUILT page.
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
/** Slugs that ship no block at all — their only trace on a screen is a data-* hook. */
const attrOnlySlugs = new Set();
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
    if (!entry.blocks?.length && entry.dataAttrs?.length) attrOnlySlugs.add(key);
  }
}

/** Does the rendered region carry one of this component's data-* hooks? */
const rendersAnyAttr = (rendered, attrs) =>
  [...attrs].some((a) => new RegExp(`\\s${a}[\\s>=]`).test(rendered));

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
    /* The converse arm (279.2). Its verdict rests entirely on `rendersAnyAttr`
       — the listed/not-listed half is Set membership on the same `listed` set
       the forward arm already uses, and a case asserting that would be testing
       `Set.has`. So these three exercise the recognising half, and the third is
       the one that decides whether the arm can fail: a prefix match would make
       it fire on any screen carrying an attribute that merely STARTS with a
       real hook (`data-scan-inputs`, `data-scan-input-mode`). */
    ['a rendered hook is seen', rendersAnyAttr('<input data-scan-input autofocus>', new Set(['data-scan-input'])), true],
    ['an absent hook is absent', rendersAnyAttr('<input data-sort-key="x">', new Set(['data-scan-input'])), false],
    ['a LONGER attribute name does not match', rendersAnyAttr('<input data-scan-inputs>', new Set(['data-scan-input'])), false],
  ]);
}

const failures = [];
let listsChecked = 0;
let attrConverseChecked = 0;

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

  const listed = new Set([...section[1].matchAll(/\/components\/([a-z-]+)/g)].map((m) => m[1]));

  for (const slug of listed) {
    const blocks = blocksBySlug.get(slug);
    if (!blocks) continue; // a page with no api.json entry (concepts-style) — not ours to police
    const attrs = attrsBySlug.get(slug) ?? new Set();
    if (![...blocks].some((b) => rendersBlock(rendered, b)) && !rendersAnyAttr(rendered, attrs)) {
      failures.push(
        `${page.url}\n     lists "${slug}" under Components used, but the screen never renders it` +
          `\n     render it, or take it off the list — the list is what the screen IS built from`,
      );
    }
  }

  /* The converse, narrowed to attribute-only components — see the header for
     why the blanket form (357 misses on 39 of 39) cannot be a gate. */
  for (const slug of attrOnlySlugs) {
    if (!rendersAnyAttr(rendered, attrsBySlug.get(slug) ?? new Set())) continue;
    attrConverseChecked += 1; // a screen this arm actually had to judge
    if (listed.has(slug)) continue;
    failures.push(
      `${page.url}\n     renders "${slug}", which ships no block of its own, and does not list it` +
        `\n     add it to Components used — a data-* hook is invisible in the markup a reader copies,` +
        `\n     so this list is the only place the screen admits it depends on the component`,
    );
  }
}

assertScanned(listsChecked, 'pattern "Components used" lists', 'no pattern page carried one — has the recipe changed?');
/* The converse arm's own denominator: if no screen renders an attribute-only
   component, the arm judged nothing and its silence means nothing. */
assertScanned(
  attrConverseChecked,
  'screens rendering an attribute-only component',
  `no screen rendered one of ${[...attrOnlySlugs].join(', ') || '(none in api.json)'} — the converse arm judged nothing`,
);

if (failures.length) {
  console.error(`components-used check FAILED — ${failures.length} claim(s) the screen does not keep:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(
  `components-used check passed — ${listsChecked} pattern(s) list only components they render, ` +
    `and ${attrConverseChecked} screen(s) rendering an attribute-only component ` +
    `(${[...attrOnlySlugs].join(', ')}) all name it`,
);
