/**
 * Gate: a container that overflows must actually SCROLL.
 *
 * @exact — drives real scrolling in a real browser and compares geometry.
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
 *   1. WIDER THAN ITS BOX  -> setting `scrollLeft` moves it and reads back.
 *      A container that overflows but cannot scroll has simply lost content.
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

const WIDTHS = [1440, 390];
/* Two integer-rounded metrics can disagree by a couple of pixels with no real
   content between them. Above this, an unscrollable overflow is a defect. */
const ROUNDING_PX = 4;
const SEL = '.bo-data-table-container, .scale-scroll';

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
const g = gate('scroll check', 'scrollable container(s)');
let containers = 0;
const subPixel = [];
let pagesScanned = 0;

for (const width of WIDTHS) {
  await page.setViewport({ width, height: 900 });
  for (const p of await distPages(DIST)) {
    if (!p.html.includes('bo-data-table-container') && !p.html.includes('scale-scroll')) continue;
    await page.goto(`http://localhost:${port}${base}${p.url}`, { waitUntil: 'networkidle0' });
    if (width === WIDTHS[0]) pagesScanned += 1;
    const found = await page.evaluate((sel) => {
      const out = [];
      for (const box of document.querySelectorAll(sel)) {
        const byX = box.scrollWidth - box.clientWidth;
        const overflowsX = byX > 1;
        const overflowsY = box.scrollHeight - box.clientHeight > 1;
        if (!overflowsX && !overflowsY) continue;
        // Drive it, do not infer it from computed style: `overflow: auto` on
        // an element an ancestor has collapsed still reports "auto".
        let movedX = 0;
        if (overflowsX) {
          box.scrollLeft = 40;
          movedX = box.scrollLeft;
          box.scrollLeft = 0;
        }
        const overflowY = getComputedStyle(box).overflowY;
        out.push({
          cls: (box.className || '').toString().slice(0, 48),
          overflowsX, overflowsY, movedX, overflowY, byX,
          focusable: box.hasAttribute('tabindex'),
          clientH: Math.round(box.clientHeight),
          scrollH: Math.round(box.scrollHeight),
        });
      }
      return out;
    }, SEL);

    for (const c of found) {
      containers += 1;
      const at = `${p.url} @${width} [${c.cls}]`;
      if (c.overflowsX) {
        /* SUB-PIXEL NOISE IS NOT A DEFECT, and this gate learned it the
           expensive way: it passed on macOS and failed 10 containers on CI's
           Linux, because `scrollWidth` and `clientWidth` are each ROUNDED to
           integers and the two platforms lay scrollbars out differently
           (overlay vs classic, which also changes clientWidth). A 2px
           "overflow" between two rounded metrics can be under a pixel of real
           content, and the browser then correctly refuses to scroll at all.
           Below the threshold it is REPORTED rather than dropped silently, so
           a real small clip cannot hide behind this exemption. */
        if (c.byX > ROUNDING_PX) {
          g.check(`${at} scrolls sideways (${c.byX}px of content past the box)`, c.movedX > 0,
            'the container is wider than its box and setting scrollLeft did nothing — ' +
            'that content is unreachable, not merely off-screen');
          g.check(`${at} is keyboard-reachable`, c.focusable,
            'a scrollable region needs tabindex="0" or a keyboard user cannot reach the rest (WCAG 2.1.1)');
        } else if (c.movedX === 0) {
          subPixel.push(`${at} ${c.byX}px`);
        }
      }
      if (c.overflowsY) {
        g.check(
          `${at} lets a user reach content below the fold (${c.clientH}px box, ${c.scrollH}px content)`,
          c.overflowY === 'auto' || c.overflowY === 'scroll',
          `the container is taller than its box and computed overflow-y is "${c.overflowY}" — ` +
            'the rows below the fold are clipped with no scrollbar, wheel or keyboard route to them',
        );
      }
    }
  }
}

await browser.close();
server.close();
assertScanned(pagesScanned, 'page(s) carrying a scroll container', 'is dist built?');
g.report(
  `driven across ${pagesScanned} page(s) x ${WIDTHS.length} widths` +
    (subPixel.length
      ? `; ${subPixel.length} container(s) reported <=${ROUNDING_PX}px of unscrollable overflow, which is rounding between two integer metrics, not lost content: ${subPixel.slice(0, 6).join(', ')}`
      : ''),
);
