/**
 * The suite meets the same accessibility and layout floor the docs meet.
 *
 * A gap-finding instrument that is itself broken finds the wrong gaps: an axe
 * violation here must mean "the framework let me build this wrong", which is a
 * finding, not background noise to tune out. Runs axe at both harness widths
 * and checks for horizontal overflow at the narrow one.
 *
 * @exact — a real browser reporting violations and measured overflow.
 * Exempt from --self-test: there is no judgement to get wrong.
 */
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveSuite } from './serve.mjs';
import { suitePages } from './pages.mjs';
import { launchDocsBrowser } from '../../apps/docs/scripts/browser-harness.mjs';
import { WIDTHS, NARROW_WIDTH } from '../../apps/docs/scripts/viewports.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, 'dist');
const AXE = readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const paths = (await suitePages(DIST)).map((p) => p.url);
const { server, port } = await serveSuite();
const browser = await launchDocsBrowser();
const page = await browser.newPage();
const failures = [];

for (const path of paths) {
  for (const [i, width] of WIDTHS.entries()) {
    await page.setViewport({ width, height: 900 });
    if (i === 0) {
      const res = await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
      if (!res || ![200, 304].includes(res.status())) {
        failures.push(`${path}: HTTP ${res && res.status()}`);
        continue;
      }
      await page.evaluate(AXE);
    } else {
      await new Promise((r) => setTimeout(r, 80));
    }
    const violations = await page.evaluate(async () =>
      (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
      })),
    );
    for (const v of violations) failures.push(`${path}@${width}: ${v.id} (${v.impact}, ${v.nodes} node(s))`);

    /* EVERY DATA TABLE IS NAMED, and named DISTINCTLY on its own page.
       axe does not flag a missing <caption> — naming a table is best practice
       rather than a WCAG failure — so eight unnamed tables shipped across the
       whole P2P module, which was built before the convention existed, and
       five later modules all got it right. Nothing noticed until a
       screen-scoring pass compared modules (roadmap 145.1). Two tables sharing
       one name is the same defect wearing a disguise: convert-to-po renders
       its template once per vendor, so a single caption gave both groups an
       identical accessible name a screen-reader user cannot tell apart. */
    if (width === WIDTHS[0]) {
      for (const t of await page.evaluate(() =>
        [...document.querySelectorAll('table')].map((t, i) => ({
          i,
          name:
            t.querySelector('caption')?.textContent.trim() ||
            t.getAttribute('aria-label') ||
            (t.getAttribute('aria-labelledby')
              ? document.getElementById(t.getAttribute('aria-labelledby'))?.textContent.trim()
              : '') ||
            '',
        })),
      )) {
        if (!t.name) failures.push(`${path}: table ${t.i + 1} has no accessible name (caption or aria-label)`);
      }
      const names = await page.evaluate(() =>
        [...document.querySelectorAll('table')].map(
          (t) => t.querySelector('caption')?.textContent.trim() || t.getAttribute('aria-label') || '',
        ),
      );
      const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
      for (const d of new Set(dupes)) failures.push(`${path}: two tables share the name "${d}"`);
    }

    /* PROPERTIES, NOT SCORES (roadmap 145.1). These four started as a `ux`
       dimension of the screen rubric and read 5/5 on all 28 screens — one
       distinct value, which fails the Accept test. The reason is worth more
       than the result: each is BINARY. A caption is present or it is not;
       headings skip a level or they do not. A rubric is for things that can be
       better or worse, and a binary property that never varies belongs in a
       gate, where it is enforced once instead of re-confirmed 28 times.
       Not a dead detector — the caption half was red-proved and fires. */
    if (width === WIDTHS[0]) {
      for (const [claim, ok] of await page.evaluate(() => {
        const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]);
        const num = [...document.querySelectorAll('.bo-data-table__col--numeric')];
        return [
          ['headings descend without skipping a level',
            hs.length > 0 && hs[0] === 1 && hs.every((h, i) => i === 0 || h - hs[i - 1] <= 1)],
          ['every toned cell carries a non-colour cue',
            [...document.querySelectorAll('[data-tone]')].every(
              (e) => e.textContent.trim().length > 0 || e.hasAttribute('data-tone-text'))],
          ['numeric columns use tabular figures',
            num.length === 0 || num.some((c) => c.classList.contains('bo-u-tabular')
              || getComputedStyle(c).fontVariantNumeric.includes('tabular'))],
          ['at most two primary actions compete',
            document.querySelectorAll('.bo-btn:not(.bo-btn--secondary):not(.bo-btn--ghost):not(.bo-btn--icon)').length <= 2],
        ];
      })) {
        if (!ok) failures.push(`${path}: ${claim} — FAILS`);
      }
    }

    if (width === NARROW_WIDTH) {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 1) failures.push(`${path}@${width}: page scrolls sideways by ${overflow}px`);

      /* Content CLIPPED inside the page, which a page-level scroll check
         cannot see. Added after the pilot's own screenshots showed two
         defects this audit had reported clean: a table container collapsed
         to its header row (GAP-6) and an action bar losing its first button
         off the left edge (GAP-7). A gate that misses what a screenshot
         catches is not a gate.

         The allowlist is EMPTY, and that is the point: it briefly held
         `.bo-form-actions`, because the sticky bar had no `flex-wrap` and
         lost its first button at 390. GAP-7 landed the wrap, so the entry
         came out. An allowlist entry here is a debt marker with a name, not
         a place to park a defect. */
      const KNOWN = [];
      const clipped = await page.evaluate((known) => {
        /* Measure the CHILD against the PARENT's client box, not the
           parent's scrollWidth. scrollWidth never accounts for content
           overflowing the START edge, so a flex row with
           justify-content:flex-end that spills its first item off the left
           reports a perfectly clean scrollWidth — which is exactly what this
           probe did on its first version, passing while a screenshot showed
           a button cut in half. The framework's own standing lesson: measure
           the box that carries the constraint. */
        const out = [];
        const name = (el) =>
          el.className && typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\s+/).join('.')
            : el.tagName.toLowerCase();
        for (const parent of document.querySelectorAll('main *')) {
          const cs = getComputedStyle(parent);
          if (cs.overflowX !== 'visible') continue;
          const p = parent.getBoundingClientRect();
          if (p.width === 0) continue;
          for (const child of parent.children) {
            const c = child.getBoundingClientRect();
            if (c.width === 0) continue;
            const lost = Math.max(p.left - c.left, c.right - p.right);
            if (lost <= 1) continue;
            const sel = name(parent);
            if (known.some((k) => sel.startsWith(k))) continue;
            out.push(`${sel} spills ${name(child)} ${Math.round(lost)}px past its edge`);
          }
        }
        return [...new Set(out)];
      }, KNOWN);
      for (const c of clipped) failures.push(`${path}@${width}: ${c}`);
    }
  }
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`erp-suite audit FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `erp-suite audit passed — ${paths.length} screen(s) x ${WIDTHS.length} widths: zero axe violations, no sideways scroll at ${NARROW_WIDTH}`,
);
