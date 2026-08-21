/**
 * Narrow what Pagefind indexes, between `astro build` and `pagefind --site`.
 *
 * Pagefind indexes whole page bodies by default, so every result excerpt began
 * with the app shell ("busy-office-ui Menu Pattern: dense invoice list…"), demo
 * table cells were concatenated into nonsense ("vs plan Overdue 17 unchanged
 * Recent invoices Invoice #VendorAmountStatus"), and raw HTML from code samples
 * surfaced as if it were prose. "table" returned 54 results, most of them code
 * blocks (owner QA review, 2026-08-17).
 *
 * Done as a post-build pass rather than by hand-editing every page: the noisy
 * regions are `<pre>` blocks and rendered demo widgets, which appear hundreds
 * of times across 82 pages and would drift the moment someone adds a demo.
 *
 * What is deliberately KEPT indexed:
 *  - demo captions and prose inside `<section class="demo">` — the most useful
 *    searchable text on a component page is the sentence explaining the demo.
 *  - the generated ClassRef / ApiTable tables, so class names like
 *    `.bo-data-table` stay findable even though code samples are ignored.
 *    An earlier version of this script ignored ALL <table>, which silently
 *    took those reference tables with it: searching `bo-data-table` dropped
 *    from 9 hits to 3 and surfaced Pagination first instead of the data-table
 *    page. Demo tables share the same class as the reference tables, so there
 *    is no selector that separates them — indexing a little demo-cell noise is
 *    the deliberate trade for class names staying findable.
 */
import { writeFile } from 'node:fs/promises';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';


/* Regions whose TEXT is chrome or rendered-widget noise, never prose. Each
   entry is [description, matcher] where matcher adds the ignore attribute to
   an opening tag that does not already carry it. */
const IGNORE = [
  ['code samples', /<pre(?![^>]*data-pagefind-ignore)([^>]*)>/g],
  ['Demo previews', /<div(?=[^>]*class="[^"]*demo-pair__preview)(?![^>]*data-pagefind-ignore)([^>]*)>/g],
  /* Fixture tables: sample ROWS, not prose. Their cells concatenate into
     nonsense in an excerpt — "Line total Cost centers Actions Steel bracket,
     40mm" and "$4,208.00. Pending. INV-10235. Globex Industrial." — which was
     the original complaint (P2-2). The earlier attempt ignored EVERY <table>
     and took the generated reference tables with it: `bo-data-table` fell from
     9 hits to 3 and surfaced Pagination ahead of the data-table page. The fix
     is a keep-marker rather than a blanket rule, so the two are separable:
     ClassRef, ApiTable and the class index carry `data-search-keep`; every
     other table is a fixture until someone says otherwise.

     Pattern pages' Data-contract and States tables are ignored under this rule
     too, and that was checked rather than waved through: searching "409
     conflict", "partial failure" and "skeleton rows" lands on the PROSE that
     surrounds them, on /concepts/concurrency and the pattern openers, not on
     the table cells. The tables restate what the prose already says. */
  ['fixture tables', /<table(?![^>]*data-search-keep)(?![^>]*data-pagefind-ignore)([^>]*)>/g],
];

let files = 0;
const counts = Object.fromEntries(IGNORE.map(([d]) => [d, 0]));

/* Reference pages ARE their tables. `/reference/tokens`, `/reference/events` and
   `/reference/acr` exist to be searched by token name, event name and criterion,
   and the fixture rule below would swallow all three — it did, and it was found
   by a sweep rather than by anyone searching: `bo:row-save` returned five pages
   and the intent-event index was not among them (Standardize, 2026-08-18).

   A path rule rather than a fourth keep-marker, deliberately. The marker
   approach requires whoever adds the next reference page to know it exists;
   this one is right by default, and the markers stay for the generated tables
   that appear on ordinary component pages (ClassRef, ApiTable). */
const REFERENCE_PAGE = /\/reference\//;

/* distPages, not a local walker: this file used to carry its own, skipping
   `_astro`/`pagefind` but NOT `/v/` — a third half-copy of the exclusion set
   (Standardize, 2026-08-21). Frozen version snapshots must not have today's
   scoping rules written into them. */
for (const page of await distPages(DIST)) {
  const file = page.file;
  let html = page.html;
  const before = html;
  for (const [desc, re] of IGNORE) {
    if (desc === 'fixture tables' && REFERENCE_PAGE.test(file)) continue;
    html = html.replace(re, (m, attrs) => {
      counts[desc] += 1;
      return m.replace(`${attrs}>`, `${attrs} data-pagefind-ignore>`);
    });
  }
  if (html !== before) {
    await writeFile(file, html);
    files += 1;
  }
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
if (total === 0) {
  console.error('scope-search-index: nothing matched — the index is unscoped and excerpts will start at the app shell');
  process.exit(1);
}
console.log(
  `search index scoped — ${total} region(s) ignored across ${files} page(s): ` +
    Object.entries(counts).map(([d, n]) => `${n} ${d}`).join(', '),
);
