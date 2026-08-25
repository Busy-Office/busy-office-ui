#!/usr/bin/env node
/**
 * Standardize scan: inline `style="…"` declarations that change NOTHING.
 *
 * Not a CI gate, deliberately — see the note at the bottom of this header.
 *
 * @exact — it removes the attribute in a real browser and compares the
 * computed value of every property the declaration names. No recognising, no
 * heuristic: either the number moved or it did not.
 *
 * WHY. The docs are the exemplar people copy, so a declaration that does
 * nothing teaches a wrong lesson. The first sweep found 29 of them, 25 being
 * `style="margin: 0"` — which the framework's own reset already guarantees
 * with `* { margin: 0 }` (reset/index.css). A reader copying
 * `/patterns/kanban` learned they had to zero margins by hand when this
 * framework is the one that does not. Two more were worse than redundant:
 * `inline-size: 14rem` restated `.bo-sidebar-nav`'s own default, and a
 * `display: inline-block` was silently blockified as a flex item.
 *
 * SELF-RED-PROOF, run before every sweep. The whole verdict is "removing this
 * changed no computed value", which is exactly the shape of a detector that
 * reports a clean tree because it can no longer see. So each run first injects
 * one declaration that MUST read live (`margin: 40px`) and one that MUST read
 * dead (`margin: 0`, already guaranteed by the reset) and exits non-zero if it
 * cannot tell them apart.
 *
 * SETTLED PAGES ONLY. The first version used `domcontentloaded` and reported
 * 1414, then 1420, then 1416 live on identical input — JS-set inline styles
 * caught mid-flight. `networkidle0` makes it deterministic (1426, twice). A
 * count that moves on its own cannot support any claim, which is also why this
 * is not wired to CI on a faster wait.
 *
 * WHY NOT A GATE. The walk costs ~2 minutes on its own. `check:layout` already
 * visits every page settled, so folding in would be nearly free — but this
 * probe MUTATES the page (removes an attribute, restores it), and doing that
 * inside a trusted, red-proved gate risks corrupting ITS measurements to catch
 * drift that is cosmetic. The trade is not worth it. Instead the Standardize
 * playbook (LOOPS.md) runs this as a scan step, so the dispatcher keeps it
 * honest rather than a human remembering to.
 */
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';

/** Runs in the page. Returns one row per element carrying a style attribute. */
const PROBE = () => {
  const named = (s) => s.split(';').map((d) => d.split(':')[0].trim()).filter(Boolean);
  const read = (el, names) => {
    const cs = getComputedStyle(el);
    return names.map((n) => n + '=' + cs.getPropertyValue(n)).join('|');
  };
  const out = [];
  for (const el of document.querySelectorAll('[style]')) {
    const saved = el.getAttribute('style');
    if (!saved.trim()) continue;
    if (el.closest('pre, code')) continue; // a code sample is text, not markup
    const names = named(saved);
    const before = read(el, names);
    el.removeAttribute('style');
    void el.offsetHeight; // force a restyle before reading back
    const after = read(el, names);
    el.setAttribute('style', saved); // restore EXACTLY what was there
    out.push({ decl: saved, dead: before === after });
  }
  return out;
};

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const run = () => page.evaluate((fn) => eval('(' + fn + ')')(), PROBE.toString());

/* ---- self-red-proof ---- */
const first = (await distPages(DIST))[0];
await page.goto(`http://localhost:${port}${base}${first.url}`, { waitUntil: 'networkidle0', timeout: 20000 });
const proof = await page.evaluate((fn) => {
  const mk = (s) => { const e = document.createElement('p'); e.setAttribute('style', s); document.body.append(e); return e; };
  const live = mk('margin: 40px');
  const dead = mk('margin: 0');
  const res = eval('(' + fn + ')')();
  live.remove(); dead.remove();
  return {
    live: res.find((r) => r.decl === 'margin: 40px')?.dead,
    dead: res.find((r) => r.decl === 'margin: 0')?.dead,
  };
}, PROBE.toString());
if (proof.live !== false || proof.dead !== true) {
  console.error('dead-style scan: SELF-TEST FAILED — the probe cannot tell a live');
  console.error(`  declaration from a dead one (live→dead=${proof.live}, dead→dead=${proof.dead}).`);
  console.error('  Every "clean" result below would be meaningless. Not reporting one.');
  await browser.close(); server.close();
  process.exit(1);
}

/* ---- the sweep ---- */
const byDecl = new Map();
const byPage = new Map();
let dead = 0;
let live = 0;
for (const p of await distPages(DIST)) {
  await page.goto(`http://localhost:${port}${base}${p.url}`, { waitUntil: 'networkidle0', timeout: 20000 });
  for (const r of await run()) {
    if (!r.dead) { live += 1; continue; }
    dead += 1;
    byDecl.set(r.decl, (byDecl.get(r.decl) ?? 0) + 1);
    byPage.set(p.url, (byPage.get(p.url) ?? 0) + 1);
  }
}

console.log(`dead-style scan — ${dead} dead, ${live} live inline declaration(s) across ${byPage.size} page(s)`);
if (dead) {
  console.log('\n  by declaration:');
  for (const [d, n] of [...byDecl].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(3)}x  ${d}`);
  console.log('\n  by page:');
  for (const [u, n] of [...byPage].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(3)}x  ${u}`);
  console.log('\n  Each removes cleanly: "dead" means the computed value of every property');
  console.log('  it names is identical without it. Check for a code sample before a bulk edit.');
}
await browser.close();
server.close();
