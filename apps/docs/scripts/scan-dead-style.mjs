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
 * THE UNIT WAS ALSO A DETECTION GAP — CLOSED BY ROADMAP 320.2. The old verdict
 * joined every property an attribute names into ONE string, so an attribute was
 * dead only if ALL of its declarations were, and **273 of 1,272 attributes
 * (21.5%)** carried more than one and sat in that blind spot. That pair is
 * Slice 320's, on 2026-09-07; the run below prints the CURRENT one, and it had
 * already moved to 357 of 1,365 by the time this landed. **The blind spot was
 * not empty: 52 dead declarations on 13 pages**, all of them inside attributes
 * the attribute verdict calls live. There are now two verdicts per attribute,
 * both reported:
 *
 *   - the ATTRIBUTE verdict, unchanged, so the historical series stays
 *     comparable — remove the whole `style=` and see whether anything moved;
 *   - the DECLARATION verdict, new — drop ONE declaration, leave its siblings
 *     in place, and read back only the properties that declaration names. A
 *     dead one can no longer hide behind a live one.
 *
 * The self-test carries a MIXED control for exactly this
 * (`padding: 40px; margin: 0`): its attribute must read live, its
 * `padding: 40px` live and its `margin: 0` DEAD. Judged as a whole that last
 * assertion is false, so the self-test fails — red-proved by injection, not
 * reasoned: replacing the per-declaration verdict with the attribute one exits
 * non-zero naming that control.
 *
 * WHAT IT DOES NOT SEE, said plainly, because the finer unit invites the
 * assumption that it does. A custom property is read by its own name, so
 * `--bo-cluster-gap: var(--bo-space-2)` on an element whose rule already falls
 * back to `--bo-space-2` reads LIVE — the declared value genuinely changes when
 * it is removed, even though nothing rendered moves. Slice 320 found six of
 * those with a different instrument, and this one still cannot.
 *
 * A DECLARATION IS SPLIT ON A BARE `;`, which would break on a `;` inside a
 * `url()` or a quoted value. A depth-aware splitter was written and **refused**
 * on base rate (94.11): **0 of 30,483** style attributes in the built site carry
 * one, so it distinguishes nothing today and would move a headline number for a
 * case that does not exist. Re-measure before assuming it still holds.
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

/**
 * Runs in the page. One row per element carrying a style attribute, holding
 * BOTH verdicts: `dead` for the whole attribute, and `parts[k].dead` for each
 * declaration judged on its own (roadmap 320.2).
 */
const PROBE = () => {
  const split = (s) => s.split(';').map((d) => d.trim()).filter(Boolean);
  const nameOf = (d) => d.split(':')[0].trim();
  const read = (el, names) => {
    const cs = getComputedStyle(el);
    return names.map((n) => n + '=' + cs.getPropertyValue(n)).join('|');
  };
  const out = [];
  for (const el of document.querySelectorAll('[style]')) {
    const saved = el.getAttribute('style');
    if (!saved.trim()) continue;
    if (el.closest('pre, code')) continue; // a code sample is text, not markup
    const parts = split(saved);
    const names = parts.map(nameOf);
    const before = read(el, names);
    el.removeAttribute('style');
    void el.offsetHeight; // force a restyle before reading back
    const after = read(el, names);
    el.setAttribute('style', saved); // restore EXACTLY what was there
    void el.offsetHeight;
    /* Drop ONE declaration and leave the siblings in place, reading back only
       the properties that declaration names. This is the whole of 320.2: with
       the attribute as the unit, `margin: 40px; padding: 0` reports live and
       the `padding: 0` is invisible. */
    const perDecl = parts.map((text, i) => {
      const own = [nameOf(text)];
      const was = read(el, own);
      el.setAttribute('style', parts.filter((_, j) => j !== i).join('; '));
      void el.offsetHeight;
      const now = read(el, own);
      el.setAttribute('style', saved);
      void el.offsetHeight;
      return { text, dead: was === now };
    });
    out.push({ decl: saved, dead: before === after, n: parts.length, parts: perDecl });
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
const MIXED = 'padding: 40px; margin: 0';
const proof = await page.evaluate((fn, mixedDecl) => {
  const mk = (s) => { const e = document.createElement('p'); e.setAttribute('style', s); document.body.append(e); return e; };
  const live = mk('margin: 40px');
  const dead = mk('margin: 0');
  /* The MIXED control (320.2): one live declaration and one dead one in ONE
     attribute. `padding: 40px` moves the box; `margin: 0` restates the reset's
     own `* { margin: 0 }`, which is what the dead control above already
     proves. Judged as a whole, this attribute reads live and the `margin: 0`
     is invisible — so the assertion on it is what fails if the per-declaration
     verdict is ever replaced by the attribute one. */
  const mixed = mk(mixedDecl);
  const res = eval('(' + fn + ')')();
  live.remove(); dead.remove(); mixed.remove();
  const m = res.find((r) => r.decl === mixedDecl);
  return {
    live: res.find((r) => r.decl === 'margin: 40px')?.dead,
    dead: res.find((r) => r.decl === 'margin: 0')?.dead,
    mixedAttr: m?.dead,
    mixedLive: m?.parts?.find((d) => d.text === 'padding: 40px')?.dead,
    mixedDead: m?.parts?.find((d) => d.text === 'margin: 0')?.dead,
  };
}, PROBE.toString(), MIXED);
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

const failures = [];
if (proof.live !== false) failures.push(`live control read dead — 'margin: 40px' → dead=${proof.live}`);
if (proof.dead !== true) failures.push(`dead control read live — 'margin: 0' → dead=${proof.dead}`);
if (proof.mixedAttr !== false) failures.push(`mixed control's ATTRIBUTE read dead — '${MIXED}' → dead=${proof.mixedAttr}`);
if (proof.mixedLive !== false) failures.push(`mixed control's live declaration read dead — 'padding: 40px' → dead=${proof.mixedLive}`);
if (proof.mixedDead !== true) {
  failures.push(
    `mixed control's dead declaration read live — 'margin: 0' inside '${MIXED}' → dead=${proof.mixedDead}` +
      '. This is exactly what judging the attribute AS A WHOLE produces (roadmap 320.2)',
  );
}
if (failures.length) {
  console.error('dead-style scan: SELF-TEST FAILED — the probe cannot tell a live');
  console.error('  declaration from a dead one:');
  for (const f of failures) console.error(`    - ${f}`);
  console.error('  Every "clean" result below would be meaningless. Not reporting one.');
  await browser.close(); server.close();
  process.exit(1);
}

/* ---- the sweep ---- */
const byPage = new Map();
const byDeadDecl = new Map();
const byDeclPage = new Map();
let dead = 0;
let live = 0;
let printOnlyLive = 0;
let totalDecls = 0;
let multi = 0;
/* The per-declaration tallies (320.2). `hiddenDead` is the number this slice
   exists to make visible: dead declarations inside an attribute the ATTRIBUTE
   verdict calls live. `deadAttrLiveDecl` is the same disagreement pointing the
   other way, reported rather than assumed away. */
let deadDecls = 0;
let printOnlyLiveDecls = 0;
let hiddenDead = 0;
let hiddenAttrs = 0;
let deadAttrLiveDecl = 0;
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
    totalDecls += r.n;
    if (r.n > 1) multi += 1;

    /* Declaration pass — independent of the attribute verdict, which is the
       point. Same both-media rule: dead here only if dead on screen AND paper. */
    let hidden = 0;
    let liveHere = 0;
    for (let k = 0; k < r.parts.length; k += 1) {
      const d = r.parts[k];
      const onPaperDecl = inPrint?.parts?.[k];
      if (!d.dead) { liveHere += 1; continue; }
      if (onPaperDecl && !onPaperDecl.dead) { liveHere += 1; printOnlyLiveDecls += 1; continue; }
      deadDecls += 1;
      hidden += 1;
      byDeadDecl.set(d.text, (byDeadDecl.get(d.text) ?? 0) + 1);
      byDeclPage.set(p.url, (byDeclPage.get(p.url) ?? 0) + 1);
    }

    /* Attribute pass — the historical unit, unchanged, so the series printed by
       17 earlier sweeps stays comparable. Dead on screen but live on paper means
       the declaration is doing its job where it matters; counted separately so
       the number is visible rather than folded into "live". */
    const attrLive = !r.dead || (inPrint && !inPrint.dead);
    if (attrLive) {
      live += 1;
      if (r.dead) printOnlyLive += 1;
      hiddenDead += hidden;
      if (hidden) hiddenAttrs += 1;
    } else {
      dead += 1;
      byPage.set(p.url, (byPage.get(p.url) ?? 0) + 1);
      if (liveHere) deadAttrLiveDecl += 1;
    }
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
  `  (${totalDecls} declaration(s) inside them; ${multi} attribute(s) carry more than one)`,
);
console.log(
  `  per declaration — ${deadDecls} dead declaration(s) on ${byDeclPage.size} page(s), each judged ` +
    'on its own so a dead one cannot hide behind a live sibling (roadmap 320.2)',
);
console.log(
  `  reconciliation — ${hiddenDead} of those sit in ${hiddenAttrs} attribute(s) the attribute verdict ` +
    `calls LIVE, out of ${multi} multi-declaration attribute(s); ` +
    `${deadAttrLiveDecl} dead attribute(s) hold a declaration that reads live alone`,
);
console.log(
  `  (screen + print measured; ${printOnlyLive} attribute(s) and ${printOnlyLiveDecls} declaration(s) ` +
    'are dead on screen but LIVE in print)',
);
if (deadDecls) {
  console.log('\n  by dead declaration:');
  for (const [d, n] of [...byDeadDecl].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(3)}x  ${d}`);
  console.log('\n  by page:');
  for (const [u, n] of [...byDeclPage].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(3)}x  ${u}`);
  console.log('\n  Each removes cleanly: "dead" means the computed value of every property');
  console.log('  it names is identical without it. Check for a code sample before a bulk edit.');
}
await browser.close();
server.close();
