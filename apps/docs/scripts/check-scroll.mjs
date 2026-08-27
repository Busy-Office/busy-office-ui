/**
 * Gate: content past a container's edge must be REACHABLE.
 *
 * @exact — reads computed overflow and measured geometry in a real browser.
 * Exempt from --self-test: there is no recognition step to fool, and the
 * red-proof is in the roadmap (inject `overflow: visible` and it fails).
 *
 * WHY. The framework's whole answer to a wide table is "it scrolls in its
 * container", and that answer was asserted NOWHERE. `check:layout` explicitly
 * EXEMPTS `.bo-data-table-container` from its overflow rule — correctly,
 * because those are supposed to overflow — and then nothing asks the next
 * question. So the one element that is allowed to overflow is the one element
 * no gate looks at (owner ask, roadmap 133).
 *
 * It already has a victim. GAP-6 in the ERP-suite ledger: `bo-stack` composed
 * onto `bo-app-shell__main` makes the main a flex column, which makes its
 * children shrinkable, and the table container collapsed to **32px against a
 * 198px scrollHeight** — header row visible, every data row clipped away.
 * Nothing reported it: not axe, not the page-level overflow check, not
 * check-markup. Two correct primitives composing into silent data loss.
 *
 * Three properties, per container, at both widths:
 *
 *   1. WIDER THAN ITS BOX  -> the USER can reach the rest, i.e. computed
 *      `overflow-x` is auto or scroll.
 *
 *      Version one DROVE `scrollLeft` instead and asserted it moved. That is
 *      the wrong instrument, and CI's Linux proved it: eight containers
 *      reported 6-11px past their box while the browser refused to scroll at
 *      all, on pages that are demonstrably fine. The browser's own max-scroll
 *      is the authority on whether content is reachable, so a positive
 *      scrollWidth-minus-clientWidth that the browser will not scroll is
 *      layout accounting (scrollbar gutter, integer rounding, platform
 *      scrollbar metrics), not lost content — and the probe simply
 *      re-measured the platform. macOS overlay scrollbars hid it completely:
 *      122 containers here, 208 there — and the verdict is now the same either way,
 *      which is the property that was missing.
 *   2. WIDER THAN ITS BOX  -> reachable by keyboard (`tabindex`), because a
 *      scrollable region that only a mouse can reach fails WCAG 2.1.1.
 *   3. TALLER THAN ITS BOX -> the USER must be able to reach the rest, i.e.
 *      computed `overflow-y` is auto or scroll. Driving `scrollTop` is the
 *      WRONG probe here and the first version of this gate used it: an
 *      element with `overflow: hidden` is still programmatically scrollable,
 *      so scrollTop moves happily while a person sees a clipped box and has
 *      no scrollbar, no wheel and no keyboard route to the rest. Verified
 *      against an injection — 30px box, 298px of content, overflow-y hidden —
 *      which the scrollTop version passed.
 *
 * WHAT THIS DOES NOT COVER, stated rather than implied: GAP-6's exact shape.
 * There the container kept `overflow: auto` and was merely COLLAPSED by a flex
 * ancestor to 32px against 198px of content — technically user-scrollable, in
 * practice a header and a sliver. Catching that needs a "too short to be
 * useful" threshold, which is a judgement, not a measurement, so it is not
 * smuggled in here. GAP-6 stays a documented composition rule (the stack goes
 * on an inner div, never on `__main`) until someone can state the threshold
 * and defend it.
 */
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';
import { gate, assertScanned } from './gate-report.mjs';
import { SCROLL_REGION_SELECTOR } from './scroll-regions.mjs';
import { WIDTHS } from './viewports.mjs';

const SEL = SCROLL_REGION_SELECTOR;

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
const g = gate('scroll check', 'scrollable container(s)');
let pagesScanned = 0;

/* Page-outer, width-inner — and the order is the whole cost of this gate.
   Width-outer navigated every page ONCE PER WIDTH: 230 full networkidle0
   loads for 115 pages, which made this the slowest step in CI at 216s, more
   than three times check:layout's 65s for a comparable sweep. Loading once
   and resizing is what check-layout already does for its three widths, and
   it is sound here for the same reason: overflow is CSS-driven, so a resize
   reflows it exactly as a fresh load would. The page list is read once too,
   rather than re-read from disk per width. */
const scrollPages = (await distPages(DIST)).filter(
  (p) =>
    p.html.includes('bo-data-table-container') ||
    p.html.includes('scale-scroll') ||
    p.html.includes('<pre'),
);

for (const p of scrollPages) {
  /* Load width is pinned, not inherited. Without this the page loads at
     whatever width the PREVIOUS page's inner loop ended on, which made the
     container count drift (746 -> 758) purely from iteration order — a
     number that moves for a reason unrelated to the thing being measured is
     a defect in the instrument, not a finding. */
  await page.setViewport({ width: WIDTHS[0], height: 900 });
  await page.goto(`http://localhost:${port}${base}${p.url}`, { waitUntil: 'networkidle0' });
  pagesScanned += 1;
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    const found = await page.evaluate((sel) => {
      const out = [];
      for (const box of document.querySelectorAll(sel)) {
        const byX = box.scrollWidth - box.clientWidth;
        const byY = box.scrollHeight - box.clientHeight;
        if (byX <= 1 && byY <= 1) continue;
        const cs = getComputedStyle(box);
        out.push({
          cls: (box.className || '').toString().slice(0, 48),
          byX, byY,
          overflowX: cs.overflowX,
          overflowY: cs.overflowY,
          focusable: box.hasAttribute('tabindex'),
          clientH: Math.round(box.clientHeight),
          scrollH: Math.round(box.scrollHeight),
        });
      }
      return out;
    }, SEL);

    const REACHABLE = (v) => v === 'auto' || v === 'scroll';
    for (const c of found) {
      const at = `${p.url} @${width} [${c.cls}]`;
      if (c.byX > 1) {
        g.check(
          `${at} lets a user reach content past the inline edge (${c.byX}px)`,
          REACHABLE(c.overflowX),
          `computed overflow-x is "${c.overflowX}" — the content past the edge is clipped ` +
            'with no scrollbar, wheel or keyboard route to it',
        );
        g.check(`${at} is keyboard-reachable`, c.focusable,
          'a scrollable region needs tabindex="0" or a keyboard user cannot reach the rest (WCAG 2.1.1)');
      }
      if (c.byY > 1) {
        g.check(
          `${at} lets a user reach content below the fold (${c.clientH}px box, ${c.scrollH}px content)`,
          REACHABLE(c.overflowY),
          `computed overflow-y is "${c.overflowY}" — the rows below the fold are clipped ` +
            'with no scrollbar, wheel or keyboard route to them',
        );
      }
    }
  }
}

await browser.close();
server.close();
assertScanned(pagesScanned, 'page(s) carrying a scroll container', 'is dist built?');
g.report(`checked across ${pagesScanned} page(s) x ${WIDTHS.length} widths`);
