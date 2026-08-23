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
import { launchDocsBrowser } from '../../apps/docs/scripts/browser-harness.mjs';
import { WIDTHS, NARROW_WIDTH } from '../../apps/docs/scripts/viewports.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, 'dist');
const AXE = readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

async function walk(dir, prefix = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...(await walk(join(dir, e.name), `${prefix}/${e.name}`)));
    else if (e.name.endsWith('.html')) out.push(`${prefix}/${e.name}`);
  }
  return out;
}

const paths = await walk(DIST);
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

         KNOWN, allowlisted with a reason — never silently: the sticky action
         bar is `display:flex` with no `flex-wrap`, so three buttons do not
         fit at 390. That is a defect in the shipped component, logged as
         GAP-7; the example keeps the realistic three-button bar rather than
         trimming to two and hiding it. Remove this entry when GAP-7 lands. */
      const KNOWN = ['.bo-form-actions'];
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
