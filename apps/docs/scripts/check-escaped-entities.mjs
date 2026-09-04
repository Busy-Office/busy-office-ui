/**
 * Gate: no built page shows an HTML entity reference as VISIBLE TEXT outside a
 * code sample (roadmap 265.2).
 *
 * WHY. Several generators read text out of a page's `.astro` SOURCE and write
 * it into published JSON — `pattern-extract.mjs` into `patterns.json` and
 * `patterns-index.json`, which `/patterns/index.astro` then renders as text
 * nodes. Source is markup, so it carries entity references; if the extractor
 * strips tags but not entities, the reader gets the SOURCE SPELLING. That
 * shipped: `/patterns/` rendered a badge whose visible text was
 * `Dashboard &amp;amp; widgets` for the reader, from a `kanban.astro` that is
 * itself perfectly correct.
 *
 * The tell in the built HTML is a DOUBLE escape — `&amp;` followed by an
 * entity name or numeric form — because the `&` of a real reference was
 * escaped once more on the way out. A single `&amp;` is a correct ampersand
 * and is not a finding; `<h2>monitor &amp; output</h2>` sits three tags away
 * from the defect on the very page that had it.
 *
 * BASE RATE, MEASURED BEFORE THIS WAS WRITTEN (roadmap 94.11: a predicate
 * already true of everything cannot fail). Sweeping every built page in the
 * DOM for text nodes containing an entity reference read **33 hits on 7
 * pages** — 32 of them inside `pre`/`code`, where the reference IS the
 * content and correct, and exactly **1** outside. So the predicate was false
 * of one real page an hour before this gate existed, and it is the page the
 * gate would have caught.
 *
 * @heuristic — the verdict rests on POSITION: whether a match sits inside a
 *   code sample. Blanking `<pre>`/`<code>` regions by regex can be fooled by
 *   markup this repo does not currently produce, so it ships --self-test
 *   proving it can tell an offender from the two lookalikes that surround it
 *   in real pages (an entity inside a code sample, and a plain escaped `&`).
 *
 * WHAT IT DOES NOT CHECK. Whether the JSON behind a page still holds an
 * entity reference. Seven remain in `patterns.json`, all names
 * `html-entities.mjs` deliberately leaves verbatim (`&mdash;` `&rsquo;`
 * `&times;` `&minus;`), and none reaches a reader today: the one in an opener
 * sits at index 317 of an 855-character string that `gen-llms.mjs` truncates
 * at 220 and `/patterns/` truncates for its tile. That is latent, held below
 * the surface by a length rather than by anything asserting it — so this gate
 * watches the surface, which is where it would appear.
 */
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned, selfTest } from './gate-report.mjs';

/* A `&amp;` immediately followed by an entity's own body — a name, `#123` or
   `#x1F`. That is one escape too many: the source held a reference, and the
   `&` starting it was escaped again on the way out. */
const DOUBLE_ESCAPED = /&amp;(?:[a-zA-Z]+|#\d+|#[xX][0-9a-fA-F]+);/g;

/* Code samples legitimately DISPLAY entity references, so their regions are
   blanked before matching — length-preserving, so an offset still points at
   the right place in the original. `[\s\S]*?` is non-greedy, so one long
   `<pre>` cannot swallow the rest of the page. */
const CODE_REGION = /<pre\b[\s\S]*?<\/pre>|<code\b[\s\S]*?<\/code>/gi;
const blankCode = (html) => html.replace(CODE_REGION, (m) => ' '.repeat(m.length));

/** Every double-escaped entity reference outside a code sample, in order. */
export function offenders(html) {
  return [...blankCode(html).matchAll(DOUBLE_ESCAPED)].map((m) => m[0]);
}

if (process.argv.includes('--self-test')) {
  selfTest([
    ['an entity in prose is reported', offenders('<p>Dashboard &amp;amp; widgets</p>'), ['&amp;amp;']],
    ['the same entity inside <pre> is not', offenders('<pre><span>&amp;mdash;</span></pre>'), []],
    ['the same entity inside <code> is not', offenders('<code>&amp;lt;tbody&amp;gt;</code>'), []],
    ['a plain escaped ampersand is not', offenders('<h2>monitor &amp; output</h2>'), []],
    ['numeric and hex forms are reported', offenders('<p>&amp;#38; and &amp;#x26;</p>'), ['&amp;#38;', '&amp;#x26;']],
    ['prose AFTER a code block is still reported', offenders('<pre>&amp;lt;</pre><p>x &amp;lt; y</p>'), ['&amp;lt;']],
  ]);
}

const pages = await distPages(DIST);
assertScanned(pages.length, 'built pages', 'did astro build run before this gate?');

const g = gate('escaped-entities check', 'page(s)');
for (const page of pages) {
  const hits = offenders(page.html);
  g.check(
    `${page.url}: no entity reference is rendered as visible text`,
    hits.length === 0,
    `shows ${[...new Set(hits)].join(', ')} to the reader — some generator wrote a page's SOURCE spelling` +
      ' into text it publishes; decode it where it is extracted, not here',
  );
}
g.report(`${pages.length} built page(s), code samples excluded`);
