// Gate: WCAG 1.4.12 Text Spacing (SC AA).
//
// A user stylesheet may set line-height 1.5, letter-spacing 0.12em,
// word-spacing 0.16em and paragraph spacing 2em — and NO content or
// functionality may be lost. The docs claim "heights are minimums,
// text-spacing-safe"; this executes that claim on every page.
//
// Two refinements that make it honest rather than noisy:
//  - It measures clipping BEFORE and AFTER applying the override, and
//    reports only NEW loss. An element that already truncates with an
//    ellipsis at default spacing is a design choice, not a 1.4.12
//    failure — without this the sweep reported 40 findings, of which
//    35 were pre-existing nav/stepper truncation.
//  - .bo-visually-hidden and skip links are exempt: clipping is their
//    purpose and nothing is lost to assistive tech.
// SPIKE: WCAG 1.4.12 Text Spacing. A user stylesheet may set line-height
// 1.5, letter-spacing 0.12em, word-spacing 0.16em and paragraph spacing
// 2em; NO content or functionality may be lost. We claim "heights are
// minimums, text-spacing-safe" — never executed.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveChrome } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
async function* pages(dir, base='') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (['v','_astro','pagefind'].includes(e.name)) continue; yield* pages(join(dir,e.name), base+'/'+e.name); }
    else if (e.name === 'index.html') yield (base||'') + '/';
  }
}
const { server, port, base } = await serveDist(dist);
const all = []; for await (const p of pages(dist)) all.push(p);
const b = await puppeteer.launch({ executablePath: resolveChrome(), headless: 'new', protocolTimeout: 60000 });
const pg = await b.newPage();
const findings = [];
for (const path of all) {
  for (const width of [1440, 390]) {
    await pg.setViewport({ width, height: 1000 });
    await pg.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0' });
    const r = await pg.evaluate(async () => {
      const main = document.querySelector('main');
      if (!main) return { skip: true };
      document.documentElement.setAttribute('data-density', 'compact');
      const clipping = () => {
        const set = new Map();
        for (const el of main.querySelectorAll('*')) {
          if (el.closest('.bo-visually-hidden, .skip-link, .scale-skip')) continue;
          const cs = getComputedStyle(el);
          const hidesY = cs.overflowY === 'hidden' || cs.overflow === 'hidden';
          const hidesX = cs.overflowX === 'hidden' || cs.overflow === 'hidden';
          let by = 0, axis = null;
          if (hidesY && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 1) { by = el.scrollHeight - el.clientHeight; axis = 'y'; }
          else if (hidesX && el.scrollWidth > el.clientWidth + 1 && !el.closest('.bo-data-table-container,.scale-scroll,pre')) { by = el.scrollWidth - el.clientWidth; axis = 'x'; }
          if (axis) set.set(el, { axis, by, cls: (el.className||el.tagName).toString().slice(0,40), text: el.textContent.trim().slice(0,25) });
        }
        return set;
      };
      // BASELINE first: an element that already truncates at default
      // spacing (a long nav label with an ellipsis) is a design choice,
      // not a 1.4.12 failure. Only NEW loss counts.
      const before = clipping();
      const s = document.createElement('style');
      s.textContent = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
                       p { margin-block-end: 2em !important; }`;
      document.head.append(s);
      await new Promise(r2 => setTimeout(r2, 250));
      const after = clipping();
      const introduced = [];
      for (const [el, info] of after) {
        const prev = before.get(el);
        if (!prev) introduced.push({ ...info, newly: true });
        else if (info.by > prev.by + 2) introduced.push({ ...info, worse: `${prev.by}->${info.by}px` });
      }
      const sc = document.querySelector('.bo-app-shell__main');
      return { clipped: introduced.slice(0, 4), overflow: sc ? sc.scrollWidth - sc.clientWidth : 0, preexisting: before.size };
    });
    if (!r.skip && (r.clipped?.length || r.overflow > 2)) findings.push({ path, width, ...r });
  }
}
await b.close();
server.close();
for (const f of findings) {
  console.log(`FAIL ${f.path} @${f.width}: ${f.clipped.length} element(s) lose content under the spacing override`);
  for (const c of f.clipped.slice(0, 3)) console.log(`     ${c.cls} "${c.text}" cut by ${c.by}px (${c.axis})`);
}
if (findings.length) {
  console.error(`text-spacing check FAILED — WCAG 1.4.12: ${findings.length} page/width combination(s) lose content`);
  process.exit(1);
}
console.log(`text-spacing check passed — ${all.length} pages x 2 widths under WCAG 1.4.12 spacing, no content lost`);
