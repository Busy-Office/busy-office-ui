/**
 * The text-collapse base rate behind 373.9's refusal, committed (roadmap 377.14).
 *
 * 373.1 shipped a file name at 0px wide: beside a progress bar and a button
 * the row could not wrap, and `overflow-wrap: anywhere` broke the name to ONE
 * LETTER PER LINE. `check:layout` passed it, because the page grew down, not
 * sideways. 373.9 asked whether a "text box narrower than N characters"
 * predicate could catch that, and refused the gate on the base rates below.
 * Those counts were taken by two scripts that lived only in session scratch
 * (`measure-collapse2.mjs` for the ch tiers, `minword.mjs` for min-content,
 * 2026-09-23); this is them, with the in-page predicates kept verbatim and
 * the plumbing made repo-relative, so a later run re-derives the numbers
 * instead of quoting them.
 *
 *   npm run report:text-collapse -w docs
 *   npm run report:text-collapse -w docs -- --pages quantity,file-upload --list
 *   npm run report:text-collapse -w docs -- --out hits.json
 *   npm run report:text-collapse -w docs -- --counterfactual   re-inject the
 *        pre-373.1 file-list rules; the defect MUST be found, or every zero
 *        this report prints is unproven
 *
 * CONTEXT: every `distPages` page at NARROW_WIDTH, with data-density="compact"
 * set after load, which is `check:layout`'s own narrow context, and every
 * animation settled before anything is read (`settle`, below).
 *
 * THE UNIT is a box that carries text in its own inline formatting context:
 * an element that is not display:inline/contents, with non-whitespace text in
 * itself or in inline/contents descendants, stopping at any nested box.
 * Excluded: anything inside .bo-visually-hidden / .skip-link / .scale-skip;
 * display:none, visibility:hidden or no client rect; and any box with an
 * ancestor wearing the visually-hidden RECIPE (clip-path inset(50%), a clip,
 * opacity 0, or a box of at most 1.5px with overflow hidden), because the
 * stepper and sidebar labels hide themselves that way at narrow widths
 * without the class. Content width is the border box minus padding and
 * border.
 *
 * THE PREDICATES, in the order 373.9 quotes them. Each tier includes the one
 * above it, except the last two lines, which are a separate predicate:
 *
 *   <8ch      content width < the width of an `inline-size: 8ch` probe
 *             appended to the box: the browser's own 8ch in that box's font.
 *             Boxes 400px or wider skip the probe (no font here has ch > 50px).
 *   +long     and the text is longer than 8 characters
 *   +wrapped  and it renders on 2+ lines: the height of its text range over
 *             line-height, rounded (line-height normal: 1.2 x font-size)
 *   +3 lines  and on 3+ lines
 *   <4ch      +wrapped, and content width / ch < 4, with ch rounded to 2 dp
 *   <3ch      +wrapped, and < 3
 *   min-content  content width is more than 1px below the box's min-content:
 *             its text in a probe sized `inline-size: min-content`, with
 *             overflow-wrap, word-break, white-space and hyphens forced to
 *             normal so the property under test cannot hide its own
 *             measurement. Printed twice: all boxes, and boxes outside
 *             SCROLL_REGION_SELECTOR, where being narrower than the content is
 *             the design.
 *
 * WHAT IT DOES NOT DECIDE. It counts; whether a hit is a defect is a
 * judgement made from the listing and recorded in the roadmap, not here. The
 * listing prints what that judgement rests on: the text's width against its
 * border box, how many px of it lie over a SIBLING's text, and how many lie
 * outside the nearest ancestor that clips. 373.9 judged its 12 from the text's
 * end against the parent's right edge alone, which cannot see two labels
 * overlapping each other (roadmap 377.14).
 *
 * Its blind spots, measured: `white-space` is forced to normal in the
 * min-content probe, so nowrap text wider than its box is only caught when a
 * single word is; the `<4ch`/`<3ch` tiers compare a ch ROUNDED to 2 dp; lines
 * come from height / line-height, which can round a short second line away
 * (a distinct-line-top recount found one such box, roadmap 377.14). One
 * width, one density. It is a report, not a gate: 373.9 refused the gate,
 * and `check:claims` holds 373.1's own case (`file-upload rows @390`).
 */
import { writeFile } from 'node:fs/promises';
import { launchDocsBrowser } from './browser-harness.mjs';
import { serveDist } from './serve-dist.mjs';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';
import { NARROW_WIDTH } from './viewports.mjs';
import { SCROLL_REGION_SELECTOR } from './scroll-regions.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const out = opt('--out', null);
const list = argv.includes('--list');
const counterfactual = argv.includes('--counterfactual');

/* 373.1's defect, restored: the <ul> keeps the UA's 40px indent, a row
   cannot wrap, and the name's flex basis is 0 (its rules before 42c4e4b0). */
const PRE_373_1 = `
  .bo-file-list { padding-inline-start: 40px !important; list-style: disc !important; }
  .bo-file-list__item { flex-wrap: nowrap !important; }
  .bo-file-list__name { flex: 1 1 0% !important; }`;

let pages = await distPages(DIST);
if (counterfactual) pages = pages.filter((p) => p.html.includes('bo-file-list__name'));
if (argv.includes('--pages')) {
  const want = opt('--pages').split(',');
  pages = pages.filter((p) => want.some((w) => p.url.includes(w)));
}
const paths = pages.map((p) => p.url);
if (!paths.length) { console.error('report-text-collapse: no pages to measure'); process.exit(1); }

// ---- in-page measurement: 373.9's two scripts, verbatim, in one walk ----
function measure(scrollSel) {
  const HIDDEN = '.bo-visually-hidden, .skip-link, .scale-skip';
  const tally = { boxes: 0, ifcBoxes: 0, notRendered: 0, hidden: 0, visuallyHidden: 0,
    minProbed: 0, wide: 0, probed: 0, probeFailed: 0 };
  const narrow = [];
  const minContent = [];

  /* Text this box contributes to its OWN inline formatting context: its text
     nodes, plus those of inline descendants, stopping at any nested box. */
  function inlineText(box) {
    const nodes = [];
    let str = '';
    (function walk(el) {
      for (const n of el.childNodes) {
        if (n.nodeType === 3) {
          if (n.nodeValue.trim()) nodes.push(n);
          str += n.nodeValue;
        } else if (n.nodeType === 1) {
          const d = getComputedStyle(n).display;
          if (d === 'inline' || d === 'contents') walk(n);
        }
      }
    })(box);
    return { nodes, text: str.replace(/\s+/g, ' ').trim() };
  }
  const textRange = (nodes) => {
    const range = document.createRange();
    range.setStart(nodes[0], 0);
    range.setEnd(nodes[nodes.length - 1], nodes[nodes.length - 1].nodeValue.length);
    return [...range.getClientRects()].filter((r) => r.width > 0 || r.height > 0);
  };
  const selOf = (box, n) => `${box.tagName.toLowerCase()}${box.id ? '#' + box.id : ''}.${(box.getAttribute('class') || '').slice(0, n)}`;

  for (const box of document.querySelectorAll('body, body *')) {
    tally.boxes++;
    const cs = getComputedStyle(box);
    if (cs.display === 'inline' || cs.display === 'contents') continue; // not a box of its own
    const { nodes, text } = inlineText(box);
    if (!text) continue;
    tally.ifcBoxes++;
    if (box.closest(HIDDEN)) { tally.hidden++; continue; }
    if (cs.display === 'none' || cs.visibility === 'hidden' || !box.getClientRects().length) { tally.notRendered++; continue; }
    let vh = false;
    for (let a = box; a && a !== document.documentElement; a = a.parentElement) {
      const acs = getComputedStyle(a);
      const ar = a.getBoundingClientRect();
      if (acs.clipPath.includes('inset(50%)') || (acs.clip && acs.clip !== 'auto') ||
          parseFloat(acs.opacity) === 0 ||
          (ar.width <= 1.5 && ar.height <= 1.5 && acs.overflow === 'hidden')) { vh = true; break; }
    }
    if (vh) { tally.visuallyHidden++; continue; }

    const rect = box.getBoundingClientRect();
    const contentW = rect.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);

    // min-content: the widest unbreakable run, wrapping forced back to normal
    const m = document.createElement('span');
    m.style.cssText = 'display:inline-block;inline-size:min-content;overflow-wrap:normal;word-break:normal;white-space:normal;hyphens:none;position:absolute;visibility:hidden;padding:0;border:0;margin:0;';
    m.textContent = text;
    box.append(m);
    const minW = m.getBoundingClientRect().width;
    m.remove();
    tally.minProbed++;
    if (minW > 0 && contentW < minW - 1) {
      // What the judgement rests on (diagnostics only; no count uses them):
      // does the text stay inside its own border box, collide with a
      // sibling's text, or run outside the nearest box that clips it?
      const rects = nodes.length ? textRange(nodes) : [];
      const t = rects.length
        ? { left: Math.min(...rects.map((r) => r.left)), right: Math.max(...rects.map((r) => r.right)),
            top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) }
        : rect;
      let siblingOverlap = 0;
      for (const s of [box.previousElementSibling, box.nextElementSibling]) {
        if (!s || !s.getClientRects().length) continue;
        const r = document.createRange();
        r.selectNodeContents(s);
        const o = r.getBoundingClientRect();
        if (o.bottom > t.top && t.bottom > o.top) {
          siblingOverlap = Math.max(siblingOverlap, Math.min(t.right, o.right) - Math.max(t.left, o.left));
        }
      }
      let outsideClip = 0;
      for (let a = box.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        if (getComputedStyle(a).overflowX === 'visible') continue;
        const left = a.getBoundingClientRect().left + a.clientLeft;
        outsideClip = Math.max(0, left - t.left, t.right - (left + a.clientWidth));
        break;
      }
      minContent.push({
        sel: selOf(box, 40), text: text.slice(0, 50), w: +contentW.toFixed(1), minContent: +minW.toFixed(1),
        shortfall: +(minW - contentW).toFixed(1), borderW: +rect.width.toFixed(1), textW: +(t.right - t.left).toFixed(1),
        siblingOverlap: +Math.max(0, siblingOverlap).toFixed(1), outsideClip: +outsideClip.toFixed(1),
        scrollRegion: !!box.closest(scrollSel),
      });
    }

    if (contentW >= 400) { tally.wide++; continue; }
    // EXACT threshold: the browser's own 8ch in this element's font
    const p = document.createElement('span');
    p.style.cssText = 'display:inline-block;inline-size:8ch;block-size:0;padding:0;border:0;margin:0;position:absolute;visibility:hidden;';
    box.append(p);
    const eightCh = p.getBoundingClientRect().width;
    p.remove();
    tally.probed++;
    if (!(eightCh > 0)) { tally.probeFailed++; continue; }
    if (contentW >= eightCh) continue;

    let lines = 1;
    if (nodes.length) {
      const rects = textRange(nodes);
      if (rects.length) {
        const textH = Math.max(...rects.map((r) => r.bottom)) - Math.min(...rects.map((r) => r.top));
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
        lines = lh ? Math.max(1, Math.round(textH / lh)) : 1;
      }
    }
    narrow.push({
      sel: selOf(box, 44), text: text.slice(0, 44), textLen: text.length,
      w: +contentW.toFixed(1), ch: +(contentW / (eightCh / 8)).toFixed(2), lines,
    });
  }
  return { tally, narrow, minContent };
}

/* Finish every finite animation and park every infinite one on its first
   frame before measuring. Without this the count is not a function of the
   tree: entrance demos that run on mount were read mid-flight, and
   /base/motion/ gave 13, 14 or 15 boxes under <8ch depending on machine load
   (roadmap 377.14). 373.9's run did not settle. */
const settle = () => {
  for (const a of document.getAnimations()) {
    if (Number.isFinite(a.effect?.getComputedTiming().endTime)) a.finish();
    else { a.pause(); a.currentTime = 0; }
  }
};

// In counterfactual mode: the narrowest file name and tallest row, so the run
// can assert the injection CHANGED what the predicates read.
const rowProbe = () => {
  const names = [...document.querySelectorAll('.bo-file-list__name')].filter((n) => n.getClientRects().length);
  const rows = [...document.querySelectorAll('.bo-file-list__item')].filter((n) => n.getClientRects().length);
  return {
    names: names.length,
    narrowest: names.length ? +Math.min(...names.map((n) => n.getBoundingClientRect().width)).toFixed(1) : null,
    tallest: rows.length ? +Math.max(...rows.map((r) => r.getBoundingClientRect().height)).toFixed(1) : null,
  };
};

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const perPage = [];
const queue = [...paths];
await Promise.all(Array.from({ length: 4 }, async () => {
  const page = await browser.newPage();
  while (queue.length) {
    const path = queue.shift();
    await page.setViewport({ width: NARROW_WIDTH, height: 1000 });
    await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
    await page.evaluate(settle);
    let injected = null;
    if (counterfactual) {
      const before = await page.evaluate(rowProbe);
      await page.addStyleTag({ content: PRE_373_1 });
      await page.evaluate(settle);
      injected = { before, after: await page.evaluate(rowProbe) };
    }
    perPage.push({ path, injected, ...(await page.evaluate(measure, SCROLL_REGION_SELECTOR)) });
  }
  await page.close();
}));
await browser.close();
server.close();
perPage.sort((a, b) => a.path.localeCompare(b.path));
if (out) await writeFile(out, JSON.stringify(perPage, null, 1));

const N = perPage.length;
const sum = (k) => perPage.reduce((a, p) => a + p.tally[k], 0);
const TIERS = [
  ['<8ch content width (the item\'s literal words)', () => true],
  [' + text longer than 8 characters', (h) => h.textLen > 8],
  [' + text wrapped (2+ lines)', (h) => h.textLen > 8 && h.lines > 1],
  [' + 3+ lines (the 373.1 signature)', (h) => h.textLen > 8 && h.lines >= 3],
  [' + wrapped and narrower than 4ch', (h) => h.textLen > 8 && h.lines > 1 && h.ch < 4],
  [' + wrapped and narrower than 3ch', (h) => h.textLen > 8 && h.lines > 1 && h.ch < 3],
];
const row = (label, pagesHit, boxes) =>
  console.log(`  ${label.padEnd(50)} ${String(pagesHit).padStart(4)}/${N}  ${String(boxes).padStart(6)}`);

console.log(`report-text-collapse: ${N} pages @ ${NARROW_WIDTH}px, density=compact${counterfactual ? ', COUNTERFACTUAL (pre-373.1 file-list rules)' : ''}`);
console.log(`  boxes walked ${sum('boxes')}; carrying text ${sum('ifcBoxes')}; excluded: not rendered ${sum('notRendered')}, ` +
  `hidden by class ${sum('hidden')}, hidden by recipe ${sum('visuallyHidden')}`);
console.log(`  min-content probes ${sum('minProbed')}; 8ch probes ${sum('probed')} (>=400px skipped ${sum('wide')}, failed ${sum('probeFailed')})`);
console.log(`\n  ${'predicate'.padEnd(50)} ${'pages'.padStart(9)}  ${'boxes'.padStart(6)}`);
for (const [label, f] of TIERS) {
  row(label, perPage.filter((p) => p.narrow.some(f)).length, perPage.reduce((a, p) => a + p.narrow.filter(f).length, 0));
}
const minAll = perPage.flatMap((p) => p.minContent.map((h) => ({ ...h, path: p.path })));
const minOut = minAll.filter((h) => !h.scrollRegion);
row('min-content: box narrower than its longest word', new Set(minAll.map((h) => h.path)).size, minAll.length);
row(' ... outside a scroll region', new Set(minOut.map((h) => h.path)).size, minOut.length);

console.log('\nmin-content hits outside a scroll region, the ones a person judges. px of text over a');
console.log('sibling\'s text, and outside the nearest ancestor that clips it; 0 and 0 with text <= border-box');
console.log('means the glyphs only paint over the box\'s own padding:');
for (const h of minOut) {
  console.log(`  ${h.path}  ${h.sel}  "${h.text}"  w=${h.w} minContent=${h.minContent} ` +
    `border-box=${h.borderW} text=${h.textW} over-sibling=${h.siblingOverlap} clipped=${h.outsideClip}`);
}
if (!minOut.length) console.log('  (none)');

if (list) {
  console.log('\n+wrapped hits in full:');
  for (const p of perPage) for (const h of p.narrow.filter(TIERS[2][1])) {
    console.log(`  ${p.path}  ${h.sel}  w=${h.w}px (${h.ch}ch) lines=${h.lines}  "${h.text}"`);
  }
}

if (counterfactual) {
  console.log('\ninjection, per page (narrowest file name / tallest row, before -> after):');
  for (const p of perPage) {
    const { before: b, after: a } = p.injected;
    console.log(a.names
      ? `  ${p.path}  ${a.names} names: ${b.narrowest} -> ${a.narrowest}px wide, rows ${b.tallest} -> ${a.tallest}px tall`
      : `  ${p.path}  no rendered file name (the class is only in its text)`);
  }
  const landed = perPage.some((p) => p.injected.after.narrowest < p.injected.before.narrowest - 1);
  const isName = (h) => h.sel.includes('bo-file-list__name');
  const foundMin = minOut.some(isName);
  const found3ch = perPage.some((p) => p.narrow.some((h) => isName(h) && TIERS[5][1](h)));
  console.log(`  landed (a name got narrower): ${landed}; min-content found a name: ${foundMin}; <3ch tier found a name: ${found3ch}`);
  if (!landed) {
    console.error('report-text-collapse: the injection did not narrow any file name, so it proves nothing — fix the injection');
    process.exit(1);
  }
  if (!foundMin || !found3ch) {
    console.error('report-text-collapse: the restored 373.1 defect was NOT found, so this report cannot fail — the instrument is broken');
    process.exit(1);
  }
}
