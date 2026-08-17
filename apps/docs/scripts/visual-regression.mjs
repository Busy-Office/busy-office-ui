/**
 * Visual-regression harness — screenshot-diffs a page matrix (key pages ×
 * light/dark × 1440/390px) against committed baselines, so the "looks
 * right" pass becomes mechanical like the other gates.
 *
 *   node scripts/visual-regression.mjs            # diff against baselines
 *   node scripts/visual-regression.mjs --update   # (re)write baselines
 *
 * Tooling call (2026-08-15): puppeteer-core driving the SYSTEM Chrome —
 * no 150MB browser download, instant install; the trade-off is that a
 * runner needs Chrome present (true on dev machines; CI would install
 * chromium and set CHROME_PATH). pixelmatch/pngjs do the diffing — pure
 * JS, no native deps. Serves the already-built dist/ via a throwaway
 * static server; run `npm run build` first.
 *
 * Advisory for now (`npm run test:visual`), not wired into the build
 * gates — antialiasing variance across machines/Chrome versions needs a
 * baseline-per-environment policy before it can hard-fail CI.
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { launchDocsBrowser } from './browser-harness.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const baseDir = join(root, 'visual-baselines');
const diffDir = join(root, 'visual-diffs');
const update = process.argv.includes('--update');

const PAGES = [
  '/',
  '/components/data-table/',
  '/components/progress/',
  '/components/tree/',
  '/components/dropdown/',
  '/patterns/login/',
  '/patterns/app-launch/',
  '/concepts/density/',
  // Slice 22 sign-off grill: the WYSIWYG "pixel-comparable" claim and
  // the richtext chrome are PIXEL claims — gate them like one.
  '/patterns/editable-grid/',
  '/components/richtext/',
];
const THEMES = ['light', 'dark'];
const WIDTHS = [1440, 390];
// Absolute changed-pixel budget: same-machine runs measured ~0px noise, so
// 100px catches even a single broken badge (~1,300px) regardless of how
// tall a full page is — a ratio threshold silently scaled the allowance
// with page height (grill finding, Rex).
const FAIL_PX = 100;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    if (!extname(p)) p += '/index.html';
    const resolved = join(dist, p);
    if (!resolved.startsWith(dist)) throw new Error('traversal');
    const body = await readFile(resolved);
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await launchDocsBrowser();
const page = await browser.newPage();
await mkdir(baseDir, { recursive: true });
await mkdir(diffDir, { recursive: true });

let failures = 0;
let written = 0;
for (const theme of THEMES) {
  await page.evaluateOnNewDocument((t) => localStorage.setItem('bo-theme', t), theme);
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 1000 });
    for (const path of PAGES) {
      const name = `${path.replaceAll('/', '_') || '_'}-${theme}-${width}.png`;
      const resp = await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0' });
      if (!resp || resp.status() !== 200) {
        // Never baseline or diff an error page — a stale/missing dist must
        // fail loudly (learned the hard way: a stale dist baselined 404s).
        failures++;
        console.log(`FAIL ${name}: HTTP ${resp?.status()} for ${path}`);
        continue;
      }
      // Full-page shot; disable animations/caret for stability.
      await page.evaluate(() => {
        const s = document.createElement('style');
        s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' +
          // The app shell is 100dvh/overflow-hidden with an inner scroller —
          // fullPage:true only ever saw the first viewport (grill finding,
          // Rex). Unlock it so the document itself carries the full height.
          // overflow-x:clip keeps content wider than the viewport clipped
          // exactly as the real scroller would — without it, wide code
          // blocks blew the 390px document out to 858px (grill follow-up).
          '.bo-app-shell{block-size:auto!important;overflow:visible!important}' +
          '.bo-app-shell__main{block-size:auto!important;overflow:visible!important;overflow-x:clip!important}' +
          '.bo-app-shell__sidebar{position:static!important;block-size:auto!important}';
        document.head.append(s);
      });
      // Height-settle guard: the unlock above triggers a re-layout, and a
      // shot taken before it lands measures scrollHeight = viewport (the
      // recurring "390x1000" capture flake — richtext dark, then login
      // dark, 2026-08-16). Wait until the document height is stable for
      // three consecutive frames before trusting fullPage.
      await page.evaluate(() => new Promise((done) => {
        let last = -1, stable = 0;
        const tick = () => {
          const h = document.documentElement.scrollHeight;
          if (h === last && ++stable >= 3) return done();
          if (h !== last) { stable = 0; last = h; }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }));
      const shot = await page.screenshot({ fullPage: true });
      const basePath = join(baseDir, name);
      const exists = await access(basePath).then(() => true, () => false);
      if (update || !exists) {
        await writeFile(basePath, shot);
        written++;
        console.log(`  baseline ${exists ? 'updated' : 'written'}: ${name}`);
        continue;
      }
      const a = PNG.sync.read(await readFile(basePath));
      const b = PNG.sync.read(Buffer.from(shot));
      if (a.width !== b.width || a.height !== b.height) {
        failures++;
        console.log(`FAIL ${name}: size ${a.width}x${a.height} -> ${b.width}x${b.height}`);
        await writeFile(join(diffDir, name), shot);
        continue;
      }
      const diff = new PNG({ width: a.width, height: a.height });
      const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
      if (changed > FAIL_PX) {
        failures++;
        console.log(`FAIL ${name}: ${changed}px changed (budget ${FAIL_PX})`);
        await writeFile(join(diffDir, name), PNG.sync.write(diff));
      } else {
        console.log(`  ok ${name}${changed ? ` (${changed}px noise)` : ''}`);
      }
    }
  }
}

await browser.close();
server.close();
if (written) console.log(`${written} baseline(s) written to visual-baselines/`);
if (failures) {
  console.error(`visual regression FAILED: ${failures} shot(s) differ — diffs in visual-diffs/`);
  process.exit(1);
}
console.log(`visual regression passed — ${PAGES.length * THEMES.length * WIDTHS.length} shots checked`);
