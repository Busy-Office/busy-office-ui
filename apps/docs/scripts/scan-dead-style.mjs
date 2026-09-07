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
 * WHAT THE COUNT COUNTS — one style ATTRIBUTE, never a declaration, and the
 * output said "declaration(s)" for its whole life (corrected 2026-09-07,
 * roadmap 320.1). `live += 1` fires once per element carrying `[style]`, so the
 * headline number is elements. Measured on the same page set the same day:
 * **1,272 attributes holding 1,677 declarations**, a 24.2% under-report, and
 * the wrong noun had been quoted as a declaration count in five consecutive
 * sweep write-ups. Both numbers are printed now, so the historical series stays
 * comparable and the missing one is available rather than inferred.
 *
 * THE UNIT IS ALSO A DETECTION GAP, and it is red-proved rather than reasoned:
 * the verdict joins every property the attribute names into ONE string, so an
 * attribute is dead only if ALL of its declarations are. Running this probe's
 * own logic over three injected elements returns `margin: 40px` live,
 * `margin: 0` DEAD, and `margin: 40px; padding: 0` **live** — the `padding: 0`
 * being exactly the case the paragraph above calls the canonical dead one.
 * **273 of 1,272 attributes (21.5%) carry more than one declaration** and are
 * therefore in that blind spot. Closing it is roadmap 320.2, filed rather than
 * built: it moves a headline number five write-ups have quoted, so it owes its
 * own red-proof and self-test cases.
 *
 * SELF-RED-PROOF, run before every sweep. The whole verdict is "removing this
 * changed no computed value", which is exactly the shape of a detector that
 * reports a clean tree because it can no longer see. So each run first injects
 * one declaration that MUST read live (`margin: 40px`) and one that MUST read
 * dead (`margin: 0`, already guaranteed by the reset) and exits non-zero if it
 * cannot tell them apart.
 *
 * BOTH MEDIA, BECAUSE PRINT HAS ITS OWN CASCADE. A declaration dead on screen
 * can be load-bearing in print: inline `margin: 0` is redundant against the
 * reset's `* { margin: 0 }`, but would matter if a print rule set a margin.
 * `/patterns/output-form` is a print pattern this sweep edited, and the owner
 * asked exactly this. A first attempt guarded it STATICALLY — fail if any print
 * rule sets a box property — and that was too blunt: it fired on
 * `.bo-app-shell { block-size: auto }`, a legitimate print layout reset with no
 * bearing on any inline style. Selector analysis was the wrong tool. The probe
 * now simply runs in both media and calls a declaration dead only if removing
 * it changes nothing in EACH. `emulateMediaType` needs no reload, so this costs
 * one extra evaluate per page rather than a second walk.
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
import { DESKTOP_WIDTH } from './viewports.mjs';

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
    out.push({ decl: saved, dead: before === after, n: names.length });
  }
  return out;
};

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: DESKTOP_WIDTH, height: 900 });
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
/* The print branch reports 0, which is the shape of a branch that never runs.
   Prove the emulation actually takes effect before believing that zero. */
await page.emulateMediaType('print');
const printReally = await page.evaluate(() => matchMedia('print').matches);
await page.emulateMediaType('screen');
const screenReally = await page.evaluate(() => matchMedia('screen').matches);
if (!printReally || !screenReally) {
  console.error('dead-style scan: media emulation is not taking effect');
  console.error(`  (print→matches=${printReally}, screen→matches=${screenReally}).`);
  console.error('  The print pass would silently duplicate the screen pass. Not reporting.');
  await browser.close(); server.close();
  process.exit(1);
}

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
let printOnlyLive = 0;
/* The verdict unit is one style ATTRIBUTE, so these track the declarations
   inside them — see the "WHAT THE COUNT COUNTS" note in the header. */
let liveDecls = 0;
let deadDecls = 0;
let multi = 0;
for (const p of await distPages(DIST)) {
  await page.goto(`http://localhost:${port}${base}${p.url}`, { waitUntil: 'networkidle0', timeout: 20000 });
  await page.emulateMediaType('screen');
  const onScreen = await run();
  await page.emulateMediaType('print');
  const onPaper = await run();
  await page.emulateMediaType('screen');
  for (let i = 0; i < onScreen.length; i += 1) {
    const r = onScreen[i];
    const inPrint = onPaper[i];
    if (r.n > 1) multi += 1;
    if (!r.dead) { live += 1; liveDecls += r.n; continue; }
    // Dead on screen, live on paper: the declaration is doing its job where it
    // matters. Counted separately so the number is visible rather than folded
    // into "live" as if nothing interesting happened.
    if (inPrint && !inPrint.dead) { live += 1; liveDecls += r.n; printOnlyLive += 1; continue; }
    dead += 1;
    deadDecls += r.n;
    byDecl.set(r.decl, (byDecl.get(r.decl) ?? 0) + 1);
    byPage.set(p.url, (byPage.get(p.url) ?? 0) + 1);
  }
}

/* `byPage` only ever records pages that have a DEAD declaration, so the page
   count belongs to `dead` and not to `live`. Worded as one clause per number
   because the old phrasing — "0 dead, 1428 live inline declaration(s) across 0
   page(s)" — attached "across 0 pages" to the live total and read as
   impossible, which is exactly the misreadable number this repo keeps warning
   about (Standardize sweep, 2026-08-27). */
console.log(
  `dead-style scan — ${dead} dead style attribute(s) on ${byPage.size} page(s); ` +
    `${live} live inline style attribute(s) in total`,
);
console.log(
  `  (${liveDecls + deadDecls} declaration(s) inside them; ` +
    `${multi} attribute(s) carry more than one, which this scan cannot judge separately)`,
);
console.log(`  (screen + print measured; ${printOnlyLive} attribute(s) are dead on screen but LIVE in print)`);
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
