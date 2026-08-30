/**
 * Gate: a rendered `.bo-timeline__step[data-state="current"]` also carries
 * `aria-current="step"` — unless it sits inside an `aria-hidden`/`inert`
 * subtree, where the ARIA attribute would reach nobody.
 *
 * @exact — attribute equality on a parsed tag, plus an ancestor walk done by a
 * real DOM parser. Nothing is recognised or positionally guessed, so it ships
 * no --self-test.
 *
 * WHY THIS EXISTS. Roadmap 218.1 decided that `.bo-timeline` KEEPS
 * `data-state="current"` rather than renaming to `data-status`, and keeps it
 * alongside `aria-current="step"` rather than being replaced by it. The reason
 * is measured, not stylistic: the two attributes are the framework's two
 * channels for one fact, and one of them has a render context the other cannot
 * reach. `PatternPreview.astro` draws its tile thumbnails inside
 * `<div class="tile-preview" inert aria-hidden="true">` — the current step must
 * still be VISIBLE there, and `aria-current` is meaningless inside it. So
 * `data-state` is the render channel and `aria-current` is the programmatic
 * one, and the sibling `.bo-stepper` (which styles current off `aria-current`
 * alone) is not a precedent that transfers.
 *
 * That decision is only defensible if something keeps the pair in step, and
 * measurement is why: at the moment it was taken, 2 of the 6 rendered current
 * steps in the built docs were already unpaired, and one of them —
 * `/patterns/object-page` — was a real widget timeline showing a visible
 * current step with no programmatic counterpart. That is the framework's own
 * two-channel rule failing silently in its own docs. `richtext.css` refuses a
 * parallel `data-state` for exactly this reason ("one source of truth and no JS
 * keeping two attributes in step"); this gate is what buys `.bo-timeline` the
 * exemption from that refusal.
 *
 * BASE RATE, checked before shipping this (94.11's rule): the predicate was
 * false of 2 of 6 instances on the tree it was written against, so it
 * distinguishes rather than passing by construction. Red-proved on that tree:
 * it reported the object-page violation and correctly exempted the decorative
 * one, before either was touched.
 *
 * COVERAGE, stated rather than implied: this walks the BUILT DOCS pages only.
 * `examples/erp-suite` and `examples/po-app` render timelines that this gate
 * never sees. **The erp-suite half is now covered elsewhere** (roadmap 219.1):
 * `examples/erp-suite/check-erp-suite.mjs`, run by `npm run suite:check`,
 * asserts the same pairing over the built suite dist — 8 rendered current steps
 * at the time it landed — with no aria-hidden/inert exemption, because the
 * suite has no decorative-thumbnail render context and the strict rule costs
 * nothing to satisfy. `examples/po-app` remains UNCOVERED: it has no built dist
 * to walk, its timeline is a template literal in `server.mjs`, and
 * `check:po-app` cannot run green in an egress-restricted container at all. A
 * regression THERE is still not caught anywhere.
 *
 * Reads the built html, not the Astro source, for the reason check-notes.mjs
 * gives: the source is not HTML, so the question is only well posed on the
 * rendered artifact. `<pre>` blocks are blanked first — a code sample teaching
 * the markup is text, not a rendered step. (Astro escapes them, so in practice
 * they never match a tag regex; blanking means the gate does not depend on that
 * staying true.)
 */
import { relative } from 'node:path';
import { JSDOM } from 'jsdom';
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned } from './gate-report.mjs';

const STEP = /<li\b[^>]*\bclass="[^"]*\bbo-timeline__step\b[^"]*"[^>]*>/g;

const pages = await distPages(DIST);
assertScanned(pages.length, 'built HTML pages', 'is dist built?');

const g = gate('timeline-current check', 'page(s) rendering a current step');
let rendered = 0;
let decorative = 0;

for (const page of pages) {
  const rel = relative(DIST, page.file);
  const html = page.html.replace(/<pre[\s\S]*?<\/pre>/g, (m) => ' '.repeat(m.length));

  const current = [...html.matchAll(STEP)].filter((m) => /\bdata-state="current"/.test(m[0]));
  if (current.length === 0) continue;
  rendered += current.length;

  const unpaired = current.filter((m) => !/\baria-current="step"/.test(m[0]));

  /* Only pages that actually hold an unpaired step get parsed — the ancestor
     question is the only thing a DOM is needed for, and parsing all 100+ pages
     to answer it on one or two would put seconds into every docs build. */
  let hidden = 0;
  if (unpaired.length > 0) {
    const doc = new JSDOM(page.html).window.document;
    hidden = [...doc.querySelectorAll('.bo-timeline__step[data-state="current"]')].filter(
      (el) => !el.hasAttribute('aria-current') && el.closest('[aria-hidden="true"], [inert]'),
    ).length;
    decorative += hidden;
  }

  /* Recorded for EVERY page that renders one, not only the failures: a gate
     whose assertion count drops to zero the moment the tree is clean reports a
     pass over nothing, which is the fail-open gate-report.mjs exists to
     prevent. This number is what a reader compares against `rendered`. */
  const exposed = unpaired.length - hidden;
  g.check(
    `${rel}: every exposed current step carries aria-current="step"`,
    exposed <= 0,
    `${exposed} of ${current.length} rendered .bo-timeline__step[data-state="current"] here have no ` +
      'aria-current="step" and are not inside an aria-hidden/inert subtree, so the step reads as ' +
      'current visually and as nothing at all programmatically — the two-channel rule failing ' +
      'silently.\n     ' +
      `First: ${unpaired[0]?.[0].slice(0, 110)}\n     ` +
      'Add aria-current="step" to the same element (approval-workflow.css names it in the ' +
      "component's header contract), or move the markup inside a decorative aria-hidden subtree " +
      'if it is a thumbnail.',
  );
}

assertScanned(rendered, 'rendered .bo-timeline__step[data-state="current"] element(s)',
  'the docs render several — a zero here means the scan stopped matching, not that the docs changed.');

g.report(
  `checked across ${pages.length} built pages (${rendered} rendered current step(s), ` +
    `${decorative} exempt inside an aria-hidden/inert subtree)`,
);
