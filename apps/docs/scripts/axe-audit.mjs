// axe-core scan of every docs page served on :8081 (plain build).
// Advisory (like visual-regression.mjs), run during Standardize sweeps:
//   npm run build -w docs && <start the :8081 container>
//   CHROME_PATH=… npm run test:axe -w docs
// Exits 1 on any violation. First run 2026-08-15 found 7 pages; all fixed.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

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

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: 'new' });
const page = await browser.newPage();
const summary = {};
for (const path of pages.sort()) {
  const res = await page.goto('http://localhost:8081' + path, { waitUntil: 'networkidle0', timeout: 20000 });
  if (!res || res.status() !== 200) { summary[path] = [{ id: 'HTTP-' + (res && res.status()) }]; continue; }
  await page.evaluate(AXE);
  const r = await page.evaluate(async () =>
    (await window.axe.run(document, { resultTypes: ['violations'] })).violations
      .map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length,
                   sample: v.nodes[0]?.target?.join(' ') }))
  );
  if (r.length) summary[path] = r;
  process.stderr.write('.');
}
await browser.close();
console.log('\npages scanned:', pages.length);
console.log(JSON.stringify(summary, null, 1));

process.exit(Object.keys(summary).length ? 1 : 0)
