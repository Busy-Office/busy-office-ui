/**
 * Gate: contrast of RENDERED third-party UI, which the token gate cannot see.
 *
 * `check:contrast` in the core package is static analysis over our own token
 * pairs — 35 pairs x 2 themes, and it passed on the very page where the docs
 * search rendered result text at 1.46:1 in dark (owner QA review, 2026-08-17).
 * Both statements were true at once: the gate was correct about everything it
 * covers, and blind to vendored CSS. Pagefind ships its own stylesheet with a
 * theme-blind `#393939` default, so the only way to know is to render it and
 * measure.
 *
 * Scope is deliberately narrow — the search widget is the only third-party UI
 * the docs site renders. If another vendored component arrives, add it to
 * REGIONS rather than widening this into a whole-page sweep: whole-page
 * rendered contrast overlaps `check:contrast` and drowns real findings in
 * decorative text.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { resolveChrome, chromeArgs } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';
import { gate } from './gate-report.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const { server, port, base } = await serveDist(dist);
const browser = await puppeteer.launch({
  executablePath: resolveChrome(), args: chromeArgs(), headless: 'new', protocolTimeout: 60000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const g = gate('vendor-contrast check', 'third-party regions');

/* Third-party regions to measure, and how to bring them on screen. */
const REGIONS = [
  {
    name: 'Pagefind search results',
    selector: '.pagefind-ui',
    async open() {
      await page.click('.docs-searchbtn');
      await new Promise((r) => setTimeout(r, 300));
      await page.type('#cmdk .pagefind-ui__search-input', 'invoice');
      /* Wait for the SETTLED state, not merely for results to exist.
         Pagefind renders skeleton placeholders first whose text colour equals
         their background on purpose (invisible text inside a loading block) —
         measuring then reports 1:1 on every row, which is a false positive
         about a real technique. */
      await page.waitForFunction(
        () => document.querySelectorAll('.pagefind-ui__result').length > 0
          && document.querySelectorAll('.pagefind-ui__loading').length === 0,
        { timeout: 15000 },
      );
    },
  },
];

/* WCAG 1.4.3: 4.5:1 for normal text, 3:1 for large (>=24px, or >=18.66px bold). */
const measure = (selector) =>
  page.evaluate((sel) => {
    const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).map(Number); return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b); };
    const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
    const opaqueBg = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)|transparent/.test(bg)) return bg;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const out = [];
    const root = document.querySelector(sel);
    if (!root) return out;
    for (const el of root.querySelectorAll('*')) {
      // Only elements with their OWN visible text.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      // Skeleton/placeholder text deliberately matches its background.
      if (/loading|placeholder|skeleton/i.test(el.className)) continue;
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = px >= 24 || (bold && px >= 18.66);
      out.push({
        cls: (el.className || el.tagName).toString().trim().slice(0, 44),
        fg: cs.color,
        bg: opaqueBg(el),
        ratio: +ratio(cs.color, opaqueBg(el)).toFixed(2),
        required: large ? 3 : 4.5,
      });
    }
    return out;
  }, selector);

for (const region of REGIONS) {
  for (const theme of ['dark', 'light']) {
    await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
    await region.open();
    const found = await measure(region.selector);
    const failing = found.filter((f) => f.ratio < f.required);
    g.check(
      `${region.name}: every rendered text element meets AA in ${theme}`,
      found.length > 0 && failing.length === 0,
      found.length === 0
        ? `no text measured — the region never rendered, so this proves nothing`
        : failing.map((f) => `${f.cls} ${f.fg} on ${f.bg} = ${f.ratio}:1 (needs ${f.required})`).join(' | '),
    );
  }
}

await browser.close();
server.close();
g.report('measured on rendered output');
