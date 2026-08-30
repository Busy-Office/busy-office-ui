/**
 * Gate: the ERP suite example is an INSTRUMENT, and stays one.
 *
 * Its whole value is that it cannot paper over a gap. The moment a screen is
 * allowed one little `<style>` block, every missing component becomes a local
 * fix nobody records, and the example stops telling us anything.
 *
 * Four assertions:
 *   1. no CSS of its own — no .css file, no <style> block, no style= carrying
 *      anything but a documented framework custom property;
 *   2. every class exists in the shipped framework (delegated to the
 *      framework's own check-markup, run by the caller);
 *   3. every internal link resolves to a screen that exists — a suite whose
 *      job is navigation must actually navigate;
 *   4. every rendered `.bo-timeline__step[data-state="current"]` also carries
 *      `aria-current="step"` (roadmap 219.1 — see below).
 *
 * @exact — string and filesystem facts, no recognition. Exempt from
 * --self-test: there is no judgement to get wrong.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ASSERTION 4, and why it lives HERE rather than in the docs gate that owns
 * the rule (roadmap 219.1).
 *
 * `apps/docs/scripts/check-timeline-current.mjs` (218.1) enforces the same
 * pairing and says in its own header that it walks the BUILT DOCS pages only —
 * "`examples/erp-suite` and `examples/po-app` render timelines that this gate
 * never sees … A regression there is not caught here." This closes the
 * erp-suite half of that sentence.
 *
 * WHY IT IS WORTH A GATE DESPITE A 100% BASE RATE. On the tree this landed
 * against the predicate is true of 8 of 8 rendered current steps, and 94.11's
 * rule says a predicate already true of everything is ceremony. Two measured
 * things distinguish this one:
 *   • the population held a violation ONE DAY EARLIER —
 *     `git show 127b9e5 -- examples/` is a one-line fix to
 *     p2p/purchase-order.screen.mjs, so the pre-fix rate was 7 of 8;
 *   • that fix was found by a source grep during 218.1, by no gate at all,
 *     which is the entire argument for a ratchet here.
 * So `577c572` — the commit before it — is a real red-proof target rather than
 * only an injected one, and both red-proofs are recorded in ROADMAP 219.1.
 *
 * NO aria-hidden/inert EXEMPTION, deliberately, and this is the one place the
 * two gates differ. The docs gate needs one because `PatternPreview.astro`
 * draws decorative timeline thumbnails inside
 * `<div class="tile-preview" inert aria-hidden="true">`, where `aria-current`
 * reaches nobody. The suite renders real screens and has no such context
 * (`inert` appears 0 times in the built dist; the 265 `aria-hidden="true"`
 * are decorative icons). Carrying the exemption anyway would mean an ancestor
 * walk, which means a DOM parser, which means `jsdom` — a dependency this
 * directory does not declare and would only get by root hoisting. The strict
 * rule costs nothing to satisfy: adding `aria-current="step"` to a step inside
 * an aria-hidden subtree is harmless, because it reaches nobody either way. If
 * a screen ever genuinely needs a decorative timeline, this fails and the
 * exemption gets added deliberately rather than assumed.
 *
 * `<pre>` is blanked before matching for the reason the docs gate gives — a
 * code sample teaching the markup is text, not a rendered step. Measured: the
 * built suite contains **0** `<pre>` and 0 `<code>`, so this is insurance
 * against that changing, not a live need.
 */
import { readdir, readFile } from 'node:fs/promises';
import { suitePages } from './pages.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, 'dist');

/* Inline style is allowed ONLY to set a documented framework custom property
   (--bo-widget-min sizes a widget grid; the docs' own pattern pages do this).
   Anything else is the example inventing design, which is the thing this gate
   exists to prevent. */
const ALLOWED_INLINE = /^(--bo-[a-z-]+:[^;]+;?\s*|max-inline-size:\s*\d+(\.\d+)?rem;?\s*)+$/;

const failures = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const sourceFiles = (await walk(here)).filter((f) => !f.startsWith(DIST));
for (const f of sourceFiles) {
  if (f.endsWith('.css')) failures.push(`${f}: the example ships its own CSS — that is a gap being papered over, not a screen`);
}

/* The shared enumerator, not this file's general file walker: that one exists
   for the stray-CSS sweep over SOURCE and returns every file. Two walks of the
   dist tree written independently is what pages.mjs consolidates. */
const built = (await suitePages(DIST)).map((p) => p.file);
if (built.length === 0) failures.push('no screens built — run build.mjs first');

const screens = new Set(built.map((f) => '/' + f.slice(DIST.length + 1)));

/* Same tag matcher as the docs gate, deliberately: one rule, two artefacts. */
const STEP = /<li\b[^>]*\bclass="[^"]*\bbo-timeline__step\b[^"]*"[^>]*>/g;
let currentSteps = 0;

for (const f of built) {
  const html = await readFile(f, 'utf8');
  const rel = f.slice(DIST.length + 1);

  if (/<style[\s>]/i.test(html)) failures.push(`${rel}: contains a <style> block`);

  for (const m of html.matchAll(/style="([^"]*)"/g)) {
    if (!ALLOWED_INLINE.test(m[1].trim())) {
      failures.push(`${rel}: inline style "${m[1]}" is not a framework custom property`);
    }
  }

  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = m[1];
    if (href.startsWith('/bo/')) continue; // the framework stylesheet
    if (!screens.has(href)) failures.push(`${rel}: link to ${href}, which is not a screen in this suite`);
  }

  const prose = html.replace(/<pre[\s\S]*?<\/pre>/g, (m) => ' '.repeat(m.length));
  for (const m of [...prose.matchAll(STEP)]) {
    if (!/\bdata-state="current"/.test(m[0])) continue;
    currentSteps++;
    if (/\baria-current="step"/.test(m[0])) continue;
    failures.push(
      `${rel}: a .bo-timeline__step[data-state="current"] carries no aria-current="step", so the ` +
        'step reads as current visually and as nothing at all programmatically — the framework\'s ' +
        'two-channel rule failing silently.\n' +
        `      ${m[0].slice(0, 140)}\n` +
        '      Add aria-current="step" to the same element (approval-workflow.css names it in the ' +
        "component's header contract).",
    );
  }
}

/* Assert the SCAN, not just the verdict. A pass over zero current steps means
   the matcher stopped matching, not that the suite stopped rendering them —
   the fail-open shape gate-report.mjs exists to prevent, restated by hand
   because this file has no gate() helper. Six screens render eight of them; a
   screen may legitimately be removed, so the floor is one rather than eight. */
if (currentSteps === 0) {
  failures.push(
    'scanned 0 .bo-timeline__step[data-state="current"] across ' +
      `${built.length} built screen(s) — the suite renders several, so a zero here is the matcher ` +
      'having stopped matching, not the suite having changed. Verdict withheld.',
  );
}

if (failures.length) {
  console.error(`erp-suite check FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `erp-suite check passed — ${built.length} screen(s), zero CSS of its own, every internal link resolves, ` +
    `${currentSteps} rendered current timeline step(s) all paired with aria-current="step"`,
);
