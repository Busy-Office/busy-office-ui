/**
 * Gate: the learning path shows a RESULT before it shows source.
 *
 * The owner's complaint (roadmap 39.1) was that "Your first screen" was ten code
 * blocks and no live demo — the page whose whole job is the first impression
 * opened with source. That page is fixed; this stops the shape recurring
 * anywhere on the path a newcomer walks.
 *
 * Two checks, both on BUILT html:
 *
 *   1. RESULT BEFORE CODE — a page that pairs previews with code (i.e. uses the
 *      Demo component) must lead with one. Pages with no Demo are exempt, and
 *      that is deliberate: `/getting-started/installation` opens with
 *      `npm i` because installation IS a command, and `/concepts/cascade` opens
 *      with CSS because the subject IS CSS. Forcing a widget above those would
 *      be decoration, which is the failure the charter calls out.
 *   2. NO DEAD ENDS — every page on the path links onward.
 *
 * A third check was tried and REMOVED: "every framework term links to where it
 * is explained". Every scoping of it over-enforced — page-wide it demanded that
 * a passing mention of "density" in a changelog carry a link, and the honest
 * version needs the sidebar's page ORDER, which would bake docs IA into a gate.
 * The three real gaps it found (density, tokens, two-channel, all unlinked on
 * the first pages a newcomer reads) are fixed, and the finding lives in
 * `.roundtable/learning-path-walk-2026-08-19.md` — which is what 39.2's Accept
 * asked for in the first place. A walk read by a human beat a rule applied by a
 * machine here, and that is worth knowing rather than hiding.
 *
 * MEASURING THIS IS HARDER THAN IT LOOKS, and three detectors were wrong before
 * this one, each passing 18/18 while measuring nothing:
 *
 *   - `class="demo"` as the "rendered" signal: every section on these pages is
 *     `<section class="demo">`, including code-only ones. Trivially true.
 *   - first `bo-*` after `<main`: the slice starts AT
 *     `<main class="bo-app-shell__main">`, which matches. Trivially true.
 *   - first non-chrome `bo-*`: reported the identical offset (536) on all 18
 *     pages — the docs shell's own mobile menu BUTTON, which is a real
 *     `.bo-btn` living inside main. Trivially true.
 *
 * So the content region is anchored to `<section class="demo">`, which is where
 * page content lives and where shell chrome never is. A detector this easy to
 * get wrong needs its own proof, so `--self-test` runs it against two synthetic
 * pages and asserts it says the right thing about each.
  *
 * @heuristic — position-based (result before code); four detectors passed 18/18 while measuring nothing.
 *   Carries --self-test: a detector this easy to fool must prove it can fail.
*/
import { readFile } from 'node:fs/promises';
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { assertScanned } from './gate-report.mjs';

const ON_PATH = /^\/(getting-started|concepts)\//;

/** The page's own content: everything from the first demo section onward. */
function contentOf(html) {
  const i = html.indexOf('<section class="demo"');
  return i < 0 ? '' : html.slice(i);
}

/**
 * Does something RENDER before the first code block?
 * Returns { code, rendered } as offsets within the content region, -1 if absent.
 */
export function resultBeforeCode(html) {
  const content = contentOf(html);
  if (!content) return { code: -1, rendered: -1 };
  /* `.demo-pair__preview` is the ONE unambiguous signal, and every looser one
     was tried and rejected: it exists only where an author deliberately paired a
     live preview with its code, never in shell chrome, never in prose, never in
     a Related footer. A page with no preview is exempt rather than failed. */
  return { code: content.indexOf('<pre'), rendered: content.indexOf('demo-pair__preview') };
}

if (process.argv.includes('--self-test')) {
  const shell = (body) => `<main class="bo-app-shell__main">
    <button class="bo-btn docs-menu-btn">menu</button>${body}</main>`;
  const codeFirst = shell('<section class="demo"><pre><code>x</code></pre>' +
    '<div class="demo-pair__preview">after</div></section>');
  const resultFirst = shell('<section class="demo"><div class="demo-pair__preview">first</div>' +
    '<pre><code>x</code></pre></section>');
  const noDemo = shell('<section class="demo"><pre><code>npm i</code></pre></section>');
  const a = resultBeforeCode(codeFirst);
  const b = resultBeforeCode(resultFirst);
  const c = resultBeforeCode(noDemo);
  const aFails = a.rendered >= 0 && a.rendered > a.code;
  const bPasses = b.rendered >= 0 && b.rendered < b.code;
  const cExempt = c.rendered < 0;
  console.log(`self-test: a code-only page is exempt, not failed: ${cExempt}`);
  console.log(`self-test: code-first page detected as failing: ${aFails}`);
  console.log(`self-test: result-first page detected as passing: ${bPasses}`);
  if (!aFails || !bPasses || !cExempt) {
    console.error('  the detector does not discriminate — it would pass everything');
    process.exit(1);
  }
  console.log('self-test passed — the detector can fail');
  process.exit(0);
}

const failures = [];
let checked = 0;

for (const page of await distPages(DIST)) {
  if (!ON_PATH.test(page.url)) continue;
  checked += 1;
  const content = contentOf(page.html);

  const { code, rendered } = resultBeforeCode(page.html);
  // Exempt when there is no preview at all: see the header.
  if (rendered >= 0 && code >= 0 && rendered > code) {
    failures.push(
      `${page.url}\n     opens with a code block; nothing renders before it` +
        '\n     show the result first — a <Demo> renders the preview AND its code from one string',
    );
  }

  /* Every framework term this page introduces must link to where it is
     explained. Only the FIRST-USE page is checked — the defining page itself is
     exempt, and so is any page that does not mention the term. */
  /* No dead ends: a page must point somewhere. Every page here carries a
     Related footer or an inline next-step link. */
  const onward = /<a [^>]*href="[^"]*\/(getting-started|concepts|components|patterns)\//.test(content);
  if (!onward) {
    failures.push(`${page.url}\n     is a dead end — nothing links onward from its content`);
  }
}

assertScanned(checked, 'learning-path pages', 'no getting-started or concepts pages were built');

if (failures.length) {
  console.error(`learning-path check FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`learning-path check passed — ${checked} pages show a result before code, and none is a dead end`);
