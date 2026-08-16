// Gate: no page may overflow the shell scroller horizontally.
//
// Guards the class this session kept producing: layout verified only at
// the width it was authored at (the token-table columns crushed at zoom;
// six editable-grid tables overflowed at 390 because they lacked the
// documented .bo-data-table-container).
//
// MEASURES THE SHELL SCROLLER, not the document: the shell is 100dvh
// with its own overflow:auto main, so document-level scrollWidth never
// grows — measuring that made an early version of this probe fail-open
// (proven: an injected 3000px element went unreported until the target
// was fixed). Elements inside a legitimate horizontal scroller
// (.bo-data-table-container, .scale-scroll, pre) are exempt by design.
//
// CI-only (npm run check:overflow): 74 pages x 2 configurations is too
// slow for every local build.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer-core';
import { resolveChrome } from './resolve-chrome.mjs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
async function* pages(dir, base = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (e.name === 'v' || e.name === '_astro' || e.name === 'pagefind') continue; yield* pages(join(dir, e.name), base + '/' + e.name); }
    else if (e.name === 'index.html') yield (base || '') + '/';
  }
}
const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const cands = url.endsWith('/') ? [join(dist, url, 'index.html')] : [join(dist, url), join(dist, url, 'index.html')];
  for (const p of cands) { try { const b = await readFile(p);
    res.writeHead(200, { 'content-type': p.endsWith('.css') ? 'text/css' : p.endsWith('.js') ? 'text/javascript' : 'text/html' }); return res.end(b); } catch {} }
  res.writeHead(404); res.end('nf');
});
await new Promise(r => server.listen(0, r)); const port = server.address().port;
import { existsSync } from 'node:fs';
if (!existsSync(dist)) {
  console.error(`No built docs at ${dist} — run \`npm run build -w docs\` first (this gate sweeps the built output).`);
  process.exit(1);
}
const all = []; for await (const p of pages(dist)) all.push(p);
const b = await puppeteer.launch({ executablePath: resolveChrome(), headless: 'new' });
const pg = await b.newPage();
const findings = [];
for (const path of all) {
  for (const [w, zoom, label] of [[390, 1, '390'], [1432, 1.5, '1432@150%']]) {
    await pg.setViewport({ width: w, height: 900 });
    await pg.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0' });
    if (zoom !== 1) { await pg.evaluate((z) => { document.documentElement.style.zoom = String(z); }, zoom); await new Promise(r => setTimeout(r, 120)); }
    const r = await pg.evaluate(() => {
      // Measure the SHELL SCROLLER, not the document: the shell is
      // 100dvh with its own overflow:auto main, so document-level
      // scrollWidth never grows — measuring it made this probe
      // fail-open (proven: an injected 3000px element went unreported).
      const scroller = document.querySelector('.bo-app-shell__main') ?? document.documentElement;
      const overflowX = scroller.scrollWidth - scroller.clientWidth;
      let worst = null;
      if (overflowX > 2) {
        const edge = scroller.getBoundingClientRect().right;
        for (const el of scroller.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > edge + 2 && (!worst || r.right > worst.right)) {
            // ignore elements INSIDE a legitimate horizontal scroller
            const inScroller = el.closest('.bo-data-table-container, .scale-scroll, pre, .docs-content pre');
            if (!inScroller) worst = { right: Math.round(r.right), cls: (el.className || el.tagName).toString().slice(0, 60) };
          }
        }
      }
      return { overflowX, worst };
    });
    if (r.overflowX > 2 && r.worst) findings.push({ path, label, ...r });
  }
}
for (const f of findings)
  console.log(`FAIL ${f.path} @${f.label}: overflows its scroller by ${f.overflowX}px (widest: ${f.worst.cls})`);
if (findings.length) {
  console.error(`overflow check FAILED — ${findings.length} page/width combination(s)`);
  await b.close(); server.close();
  process.exit(1);
}
console.log(`overflow check passed — ${all.length} pages x 2 widths (390, 1432@150% zoom)`);
await b.close(); server.close();
