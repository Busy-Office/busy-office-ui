// Gate: layout survives the two stresses that break dense UI —
//   (1) narrow viewports and browser zoom            (was check-overflow)
//   (2) a user's WCAG 1.4.12 text-spacing override   (was check-text-spacing)
//
// Merged and parallelised for cost (2026-08-17): as two serial sweeps
// these cost 168s + 177s and loaded every page FOUR times between them;
// one sweep with a tab pool loads each page three times, concurrently.
// CI had grown 3.5min -> 7.6min, which is a real tax on every push.
//
// Each check keeps the property that made it trustworthy:
//  - overflow measures the SHELL SCROLLER, not the document (the 100dvh
//    shell never grows, so document scrollWidth silently reports nothing)
//  - spacing compares clipping BEFORE and AFTER the override, so
//    deliberate ellipsis truncation is not reported as a 1.4.12 failure
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { resolveChrome } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
async function* walk(dir, base = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (['v', '_astro', 'pagefind'].includes(e.name)) continue;
      yield* walk(join(dir, e.name), `${base}/${e.name}`);
    } else if (e.name === 'index.html') yield `${base}/`;
  }
}

const { server, port, base } = await serveDist(dist);
const paths = [];
for await (const p of walk(dist)) paths.push(p);
const browser = await puppeteer.launch({ executablePath: resolveChrome(), headless: 'new', protocolTimeout: 120000 });

const OVERFLOW_EXEMPT = '.bo-data-table-container, .scale-scroll, pre';
const findings = [];

async function overflowProbe(page) {
  return page.evaluate((exempt) => {
    const sc = document.querySelector('.bo-app-shell__main');
    if (!sc) return null;
    const overflow = sc.scrollWidth - sc.clientWidth;
    if (overflow <= 2) return null;
    const edge = sc.getBoundingClientRect().right;
    let worst = null;
    for (const el of sc.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > edge + 1 && !el.closest(exempt) && (!worst || r.right > worst.right)) {
        worst = { right: Math.round(r.right), cls: (el.className || el.tagName).toString().slice(0, 45) };
      }
    }
    return worst ? { overflow, worst } : null;
  }, OVERFLOW_EXEMPT);
}

async function spacingProbe(page) {
  return page.evaluate(async (exempt) => {
    const main = document.querySelector('main');
    if (!main) return null;
    const clipping = () => {
      const map = new Map();
      for (const el of main.querySelectorAll('*')) {
        if (el.closest('.bo-visually-hidden, .skip-link, .scale-skip')) continue;
        const cs = getComputedStyle(el);
        const hidesY = cs.overflowY === 'hidden' || cs.overflow === 'hidden';
        const hidesX = cs.overflowX === 'hidden' || cs.overflow === 'hidden';
        if (hidesY && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 1)
          map.set(el, { axis: 'y', by: el.scrollHeight - el.clientHeight, cls: (el.className || el.tagName).toString().slice(0, 40), text: el.textContent.trim().slice(0, 25) });
        else if (hidesX && el.scrollWidth > el.clientWidth + 1 && !el.closest(exempt))
          map.set(el, { axis: 'x', by: el.scrollWidth - el.clientWidth, cls: (el.className || el.tagName).toString().slice(0, 40), text: el.textContent.trim().slice(0, 25) });
      }
      return map;
    };
    const before = clipping();
    const style = document.createElement('style');
    style.textContent = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
                         p { margin-block-end: 2em !important; }`;
    document.head.append(style);
    await new Promise((r) => setTimeout(r, 200));
    const after = clipping();
    const introduced = [];
    for (const [el, info] of after) {
      const prev = before.get(el);
      if (!prev) introduced.push(info);
      else if (info.by > prev.by + 2) introduced.push({ ...info, worse: `${prev.by}->${info.by}px` });
    }
    return introduced.length ? introduced.slice(0, 3) : null;
  }, exemptSelector());
}
function exemptSelector() { return '.bo-data-table-container,.scale-scroll,pre'; }

async function sweep(path, page) {
  const url = `http://localhost:${port}${base}${path}`;
  // 390 wide: both stresses share this load
  await page.setViewport({ width: 390, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
  const o390 = await overflowProbe(page);
  if (o390) findings.push({ kind: 'overflow', path, cfg: '390', ...o390 });
  const s390 = await spacingProbe(page);
  if (s390) findings.push({ kind: 'spacing', path, cfg: '390', clipped: s390 });

  // desktop: spacing again (different wrap points)
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
  const s1440 = await spacingProbe(page);
  if (s1440) findings.push({ kind: 'spacing', path, cfg: '1440', clipped: s1440 });

  // browser zoom: overflow only
  await page.setViewport({ width: 1432, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { document.documentElement.style.zoom = '1.5'; });
  await new Promise((r) => setTimeout(r, 120));
  const oZoom = await overflowProbe(page);
  if (oZoom) findings.push({ kind: 'overflow', path, cfg: '1432@150%', ...oZoom });
}

const POOL = 4;
const queue = [...paths];
await Promise.all(Array.from({ length: POOL }, async () => {
  const page = await browser.newPage();
  while (queue.length) {
    const path = queue.shift();
    if (path) await sweep(path, page);
  }
  await page.close();
}));

await browser.close();
server.close();

for (const f of findings) {
  if (f.kind === 'overflow') console.log(`FAIL overflow ${f.path} @${f.cfg}: ${f.overflow}px — widest: ${f.worst.cls}`);
  else {
    console.log(`FAIL spacing ${f.path} @${f.cfg}: ${f.clipped.length} element(s) lose content under WCAG 1.4.12`);
    for (const c of f.clipped) console.log(`     ${c.cls} "${c.text}" cut by ${c.by}px (${c.axis})`);
  }
}
if (findings.length) {
  console.error(`layout check FAILED — ${findings.length} finding(s) across ${paths.length} pages`);
  process.exit(1);
}
console.log(`layout check passed — ${paths.length} pages: no overflow at 390 or 150% zoom, no content lost under WCAG 1.4.12 spacing`);
