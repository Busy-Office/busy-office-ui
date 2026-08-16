// axe-core scan of every docs page, at both harness widths.
//   npm run build -w docs && npm run test:axe -w docs
// Exits 1 on any violation. First run 2026-08-15 found 7 pages; all fixed.
//
// Serves dist itself via the shared base-aware server. It used to require a
// hand-started container on :8081, which is why it could only ever be run by
// hand — and it duly drifted red unnoticed (2026-08-17). It is a CI gate now,
// and a gate may not depend on a human having started something.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { resolveChrome, chromeArgs } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';

const DIST = new URL('../dist', import.meta.url).pathname;
const AXE = readFileSync(new URL('../../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

// enumerate all index.html pages in dist
const pages = [];
(function walk(dir, rel) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, rel + '/' + e);
    else if (e === 'index.html' && !readFileSync(p, 'utf8').includes('http-equiv="refresh"'))
      pages.push(rel + '/');
  }
})(DIST, '');

const { server, port, base } = await serveDist(DIST);
const browser = await puppeteer.launch({ executablePath: resolveChrome(), args: chromeArgs(), headless: 'new' });
const page = await browser.newPage();
const summary = {};
// Both harness widths: violations can be width-gated (a table container only
// becomes a scrollable region — and needs to be focusable — once it overflows,
// which mostly happens at 390).
const WIDTHS = [1440, 390];
for (const path of pages.sort()) {
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    const res = await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
    // 304 = browser cache revalidation (legitimate on a repeat same-session
    // navigation, e.g. re-running the scan after a fix) — only a real
    // non-2xx/304 status means the page didn't actually load.
    if (!res || ![200, 304].includes(res.status())) {
      summary[`${path}@${width}`] = [{ id: 'HTTP-' + (res && res.status()) }];
      continue;
    }
    await page.evaluate(AXE);
    const r = await page.evaluate(async () =>
      (await window.axe.run(document, { resultTypes: ['violations'] })).violations
        .map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length,
                     sample: v.nodes[0]?.target?.join(' ') }))
    );
    if (r.length) summary[`${path}@${width}`] = r;
    process.stderr.write('.');
  }
}
await browser.close();
server.close();
console.log('\npages scanned:', pages.length);
console.log(JSON.stringify(summary, null, 1));

process.exit(Object.keys(summary).length ? 1 : 0)
