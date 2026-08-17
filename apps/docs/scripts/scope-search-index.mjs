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
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

/* Regions whose TEXT is chrome or rendered-widget noise, never prose. Each
   entry is [description, matcher] where matcher adds the ignore attribute to
   an opening tag that does not already carry it. */
const IGNORE = [
  ['code samples', /<pre(?![^>]*data-pagefind-ignore)([^>]*)>/g],
  ['Demo previews', /<div(?=[^>]*class="[^"]*demo-pair__preview)(?![^>]*data-pagefind-ignore)([^>]*)>/g],
];

let files = 0;
const counts = Object.fromEntries(IGNORE.map(([d]) => [d, 0]));

async function* pages(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (['_astro', 'pagefind'].includes(e.name)) continue;
      yield* pages(p);
    } else if (e.name.endsWith('.html')) yield p;
  }
}

for await (const file of pages(dist)) {
  let html = await readFile(file, 'utf8');
  const before = html;
  for (const [desc, re] of IGNORE) {
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
