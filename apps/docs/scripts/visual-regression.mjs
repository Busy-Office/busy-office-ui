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
import puppeteer from 'puppeteer-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const baseDir = join(root, 'visual-baselines');
const diffDir = join(root, 'visual-diffs');
const update = process.argv.includes('--update');

const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const PAGES = [
  '/',
  '/components/data-table/',
  '/components/progress/',
  '/components/tree/',
  '/components/dropdown/',
  '/patterns/login/',
  '/patterns/app-launch/',
  '/concepts/density/',
];
const THEMES = ['light', 'dark'];
const WIDTHS = [1440, 390];
// >0.1% changed pixels fails — loose enough for font antialiasing noise,
// tight enough to catch real layout/theme regressions.
const FAIL_RATIO = 0.001;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    if (!extname(p)) p += '/index.html';
    const body = await readFile(join(dist, p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
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
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0' });
      // Full-page shot; disable animations/caret for stability.
      await page.evaluate(() => {
        const s = document.createElement('style');
        s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
        document.head.append(s);
      });
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
      const ratio = changed / (a.width * a.height);
      if (ratio > FAIL_RATIO) {
        failures++;
        console.log(`FAIL ${name}: ${(ratio * 100).toFixed(3)}% pixels changed`);
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
