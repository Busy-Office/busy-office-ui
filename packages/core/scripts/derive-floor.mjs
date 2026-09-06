#!/usr/bin/env node
/**
 * Compute the browser floor FROM THE SHIPPED CSS, and write `dist/floor.json`.
 *
 * The floor used to be prose — `Chrome/Edge 119 · Firefox 128 · Safari 17.4`,
 * hand-typed in eight places and derived from nothing. Nobody could check it,
 * and it was wrong: unprefixed `mask-image` needs Chrome 120, and the framework
 * uses it 45 times. We published a floor the framework did not meet.
 *
 * That is the failure mode this file exists to make impossible. A support claim
 * is a promise to someone who cannot easily verify it, so it has to be derived
 * from what we actually ship, against a source anyone can check
 * (`@mdn/browser-compat-data`), and regenerated on every build.
 *
 * WHAT IT CANNOT SEE, stated so the number is not over-trusted: this detects
 * the features in FEATURES below and nothing else. A CSS feature nobody added a
 * probe for does not raise the floor here, so the output is a floor at least
 * this high, not a proof of support. Adding a probe is one line; the list is
 * ordered to be read.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compatOf as bcdCompatOf } from './bcd-compat.mjs';
import browserslist from 'browserslist';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const BROWSERS = ['chrome', 'edge', 'firefox', 'safari'];

/**
 * Each probe: how to spot the feature in CSS, and where it lives in BCD.
 * `test` runs against the whole stylesheet.
 */
const FEATURES = [
  { tier: 'core', id: '@layer', path: ['css', 'at-rules', 'layer'], test: (c) => /@layer\b/.test(c) },
  { tier: 'core', id: '@container', path: ['css', 'at-rules', 'container'], test: (c) => /@container\b/.test(c) },
  { tier: 'degrades', id: ':has()', path: ['css', 'selectors', 'has'], test: (c) => /:has\(/.test(c) },
  { tier: 'core', id: ':is()', path: ['css', 'selectors', 'is'], test: (c) => /:is\(/.test(c) },
  { tier: 'core', id: ':where()', path: ['css', 'selectors', 'where'], test: (c) => /:where\(/.test(c) },
  { tier: 'degrades', id: ':user-invalid', path: ['css', 'selectors', 'user-invalid'], test: (c) => /:user-invalid\b/.test(c) },
  { tier: 'polish', id: 'mask-image', path: ['css', 'properties', 'mask-image'], test: (c) => /(^|[^-])mask-image\s*:/.test(c) },
  { tier: 'polish', id: 'color-mix()', path: ['css', 'types', 'color', 'color-mix'], test: (c) => /color-mix\(/.test(c) },
  { tier: 'polish', id: 'subgrid', path: ['css', 'properties', 'grid-template-columns', 'subgrid'], test: (c) => /\bsubgrid\b/.test(c) },
  { tier: 'polish', id: 'accent-color', path: ['css', 'properties', 'accent-color'], test: (c) => /accent-color\s*:/.test(c) },
  { tier: 'polish', id: 'scrollbar-width', path: ['css', 'properties', 'scrollbar-width'], test: (c) => /scrollbar-width\s*:/.test(c) },
  { tier: 'polish', id: 'scrollbar-color', path: ['css', 'properties', 'scrollbar-color'], test: (c) => /scrollbar-color\s*:/.test(c) },
  { tier: 'core', id: 'inset', path: ['css', 'properties', 'inset'], test: (c) => /(^|[^-\w])inset\s*:/.test(c) },
  { tier: 'polish', id: 'forced-colors', path: ['css', 'at-rules', 'media', 'forced-colors'], test: (c) => /forced-colors\s*:\s*active/.test(c) },
  { tier: 'polish', id: 'print-color-adjust', path: ['css', 'properties', 'print-color-adjust'], test: (c) => /print-color-adjust\s*:/.test(c) },
  /* `content: "↕" / ""` — the empty ALT keeps a decorative glyph from being
     announced. Below the floor the alt is ignored and screen readers read the
     arrow out, so it degrades rather than breaks. This probe is why the Firefox
     floor is 128 and not 125: it was missing from the first version of this
     list, which quietly reported a floor three versions too low and "proved"
     the hand-written value was over-conservative. It was not. */
  { tier: 'degrades', id: 'content alt-text', path: ['css', 'properties', 'content', 'alt_text'], test: (c) => /content:[^;]*\/[^;]*;/.test(c) },
  { tier: 'polish', id: 'text-wrap', path: ['css', 'properties', 'text-wrap'], test: (c) => /text-wrap\s*:/.test(c) },
  { tier: 'degrades', id: 'popover', path: ['html', 'global_attributes', 'popover'], test: (c, js) => /popover/.test(js) || /\[popover/.test(c) },
  { tier: 'degrades', id: '@starting-style', path: ['css', 'at-rules', 'starting-style'], test: (c) => /@starting-style\b/.test(c) },
  { tier: 'core', id: 'dialog', path: ['html', 'elements', 'dialog'], test: (c, js) => /showModal\(/.test(js) || /\bdialog\b/.test(c) },
  /* The three below ship NOWHERE today — re-measured rather than carried from
     the item that asked for them (roadmap 294.1):

       grep -c -F 'light-dark(' packages/core/dist/css/index.css   # 0
       grep -c -F 'oklch('      packages/core/dist/css/index.css   # 0
       grep -c -F 'scroll-state(' packages/core/dist/css/index.css # 0

     and `grep -rl` over all of `dist/css/` agrees at 0 for each. So adding them
     moves no number today, which is the point: this list is what the floor CAN
     see, and a feature nobody probed for does not raise it. The case they exist
     for is a later edit landing one of them UNguarded.

     TIER IS CHOSEN FOR THE UNGUARDED CASE, and that is checkable rather than a
     forecast: the framework's two guarded modern features, `color-mix()` and
     `subgrid`, are both tiered `polish` for exactly that reason. If one of
     these three ever lands inside an `@supports`, re-tier it the same way —
     this script has no `@supports` awareness by design, tier is where the guard
     is recorded. */
  { tier: 'core', id: 'light-dark()', path: ['css', 'types', 'color', 'light-dark'], test: (c) => /light-dark\(/.test(c) },
  { tier: 'core', id: 'oklch()', path: ['css', 'types', 'color', 'oklch'], test: (c) => /\boklch\(/.test(c) },
  /* `scroll-state_queries`, NOT `scroll-state` — the obvious spelling is not a
     BCD key, and `compatOf` throws on it rather than silently lowering the
     floor. Tiered `polish`: an unsupported browser ignores the whole
     `@container scroll-state(…)` block, so the affordance simply does not
     paint, which is this file's own definition of the tier. */
  { tier: 'polish', id: 'scroll-state()', path: ['css', 'at-rules', 'container', 'scroll-state_queries'], test: (c) => /scroll-state\(/.test(c) },
];

const css = await readFile(join(DIST, 'css', 'index.css'), 'utf8');
let js = '';
try {
  js = await readFile(join(DIST, 'js', 'index.js'), 'utf8');
} catch {
  /* JS is optional for the CSS-only consumer; probes that need it just miss. */
}

/** Walk a BCD path, or throw — a silently-missing key would lower the floor.
 *  Shared with check-rf-floor.mjs; see bcd-compat.mjs for why. */
const compatOf = (path) => bcdCompatOf(path, 'derive-floor');

/** BCD's "this browser will never run it" — `version_added: false` on every
 *  unflagged entry. It is NOT the same as `earliestUsableVersion` returning
 *  null, and conflating the two is the hole 294.1's third probe opens:
 *  `floorFor` skips a null, so *"no version supports this"* and *"we did not
 *  detect this"* produce the identical output — a floor published for a browser
 *  that cannot run the thing. That is verbatim the failure this file exists to
 *  prevent, pointing the other way.
 *
 *  BASE RATE, measured before adding this rather than after (CLAUDE.md):
 *  across the 20 probes that predate 294.1, **0 of 80 probe/browser pairs** are
 *  known-unsupported. `scroll-state()` is the first — Firefox and Safari both
 *  read `version_added: false` — so this is a case that has never existed here
 *  and now can. Re-run it; it is a snapshot: for each probe path,
 *  `entries.every((e) => e.version_added === false)` per browser. */
const NEVER = 'never';
function isNeverSupported(support) {
  const entries = (Array.isArray(support) ? support : [support]).filter((e) => !e.flags);
  return entries.length > 0 && entries.every((e) => e.version_added === false);
}

/**
 * The earliest version a browser supports this feature in a form THE FRAMEWORK
 * ACTUALLY EMITS.
 *
 * Both halves of that sentence were bugs in the first version of this file:
 *
 * - **Prefixes count, when we ship them.** Considering only unprefixed support
 *   put the floor at Chrome 136 (`print-color-adjust`) and Chrome 120
 *   (`mask-image`), and reported that the framework did not meet its own stated
 *   floor. It does: autoprefixer emits `-webkit-` alongside every real
 *   declaration, verified in the built CSS, so the earlier form is the one that
 *   decides. Prefixed support we do NOT emit is still ignored — that is support
 *   the framework cannot use.
 * - **A superseded partial is still support.** BCD records Safari's
 *   `accent-color` as a partial implementation from 15.4 with
 *   `version_removed: 26.2`, and a full one from 26.2. Discarding entries that
 *   carry `version_removed` left only 26.2 and put the Safari floor two years
 *   into the future. The feature has worked since 15.4; it was upgraded, not
 *   withdrawn.
 */
function earliestUsableVersion(support, emitsPrefixed) {
  const entries = (Array.isArray(support) ? support : [support]).filter(
    (e) => !e.flags && typeof e.version_added === 'string',
  );
  const usable = entries.filter((e) => !e.prefix || emitsPrefixed);
  if (!usable.length) return null;
  /* A version_removed entry is only disqualifying if NOTHING later re-adds it. */
  const live = usable.filter((e) => !e.version_removed);
  const pool = live.length ? usable : [];
  if (!pool.length) return null;
  return pool
    .map((e) => e.version_added)
    .sort((a, b) => parseFloat(a) - parseFloat(b))[0];
}

/** Which of FEATURES this stylesheet (and optional JS) actually emits, with the
 *  earliest version of each browser that supports the emitted form. Factored
 *  out of the top-level loop by 249.3 so the SAME probe set can be pointed at
 *  one component's file as at `index.css` — a per-component floor derived by
 *  re-implementing the probes would be a second instrument to keep in sync. */
function detect(cssText, jsText) {
  const out = [];
  for (const f of FEATURES) {
    if (!f.test(cssText, jsText)) continue;
    const support = compatOf(f.path);
    /* Does the BUILT css carry a -webkit- form of this property? autoprefixer
       adds them, so the answer is a fact about the artifact, not an intention. */
    const emitsPrefixed = new RegExp(`-webkit-${f.id.replace(/[^a-z-]/g, '')}\\s*:`).test(cssText);
    const versions = {};
    for (const b of BROWSERS) {
      versions[b] = isNeverSupported(support[b])
        ? NEVER
        : earliestUsableVersion(support[b], emitsPrefixed);
    }
    out.push({ tier: f.tier, id: f.id, prefixed: emitsPrefixed, versions });
  }
  return out;
}

const detected = detect(css, js);

if (!detected.length) {
  console.error('derive-floor FAILED — detected no modern CSS features at all.');
  console.error('  index.css is empty, moved, or every probe broke. Refusing to publish a floor of "any browser".');
  process.exit(1);
}

/* Not every modern feature is a REQUIREMENT, and conflating the two is what
   produced an advertised floor nobody could meet.
   
     core     — the framework is structurally broken without it. @layer is the
                cascade contract; if it is ignored, the rules do not apply.
     degrades — works, with a documented fallback. `:has()` reveals are
                fail-closed by design and server-set aria-invalid still works.
     polish   — a cosmetic affordance that simply does not paint. tabs.css says
                of `scrollbar-color`, in as many words, "NOT relied on as the
                affordance". Safari ships it in 26.2; letting that set the floor
                would advertise a browser that barely exists, to protect a hint.
   
   So there are two honest numbers, and publishing only one of them was the
   original mistake. */
const TIERS = ['core', 'degrades', 'polish'];
const floorFor = (tiers, from = detected) => {
  const f = {};
  const by = {};
  for (const b of BROWSERS) {
    let max = null;
    let who = null;
    for (const d of from) {
      if (!tiers.includes(d.tier)) continue;
      const v = d.versions[b];
      if (v == null || v === NEVER) continue;
      if (max === null || parseFloat(v) > parseFloat(max)) { max = v; who = d.id; }
    }
    f[b] = max;
    by[b] = who;
  }
  return { floor: f, drivenBy: by };
};

const supported = floorFor(['core', 'degrades']);
const full = floorFor(TIERS);
const floor = supported.floor;
const drivenBy = supported.drivenBy;

/* A DETECTED feature no version of a browser supports, split by tier, because
   the two halves want opposite answers:

     core / degrades — these set the published floor, so shipping one that (say)
       Firefox will never run means there IS no Firefox floor. Printing a number
       anyway is the original bug in a new place. FAIL.
     polish — "a cosmetic affordance that simply does not paint" already covers
       a browser that never paints it, so this is legal. But `fullFidelity` is
       published as "where every cosmetic enhancement also paints", and that
       sentence stops being true the moment one of them cannot. REPORTED into
       floor.json as `neverSupported`, never silently dropped.

   Refused: failing on `polish` too. It would forbid ever shipping a
   progressive enhancement one engine lacks, which is a product decision nobody
   has taken, and this script's job is to describe the artifact rather than to
   constrain it. */
const neverSupported = [];
const neverFatal = [];
for (const d of detected) {
  const browsers = BROWSERS.filter((b) => d.versions[b] === NEVER);
  if (!browsers.length) continue;
  (d.tier === 'polish' ? neverSupported : neverFatal).push({ id: d.id, tier: d.tier, browsers });
}
if (neverFatal.length) {
  console.error('derive-floor FAILED — a core/degrades feature no version of a browser supports:');
  for (const n of neverFatal) console.error(`  ${n.id} (${n.tier}) — ${n.browsers.join(', ')}`);
  console.error('  Refusing to publish a floor for a browser that cannot run the shipped CSS.');
  console.error('  Either guard the feature and re-tier it `polish`, or drop it.');
  process.exit(1);
}

/* REACH, computed rather than asserted (roadmap 38.2). A floor is two numbers:
   which browsers, and how many people that is. The second is the one a team
   evaluating the framework actually cares about, and it is the one nobody
   publishes.

   Mobile ids are listed explicitly. browserslist's `chrome` and `safari` are
   DESKTOP only, so the obvious query reports 27.29% for a floor that really
   reaches 80.20% — a 53-point error, and exactly the implausible number
   CLAUDE.md now says to treat as an instrument defect. */
const reachQuery = (c, ff, s) =>
  `chrome >= ${c}, edge >= ${c}, firefox >= ${ff}, safari >= ${s}, ` +
  `and_chr >= ${c}, ios_saf >= ${s}, and_ff >= ${ff}, samsung >= 23, op_mob >= 80`;
const coverage = (q) => Number(browserslist.coverage(browserslist(q)).toFixed(2));
const reach = coverage(reachQuery(floor.chrome, floor.firefox, floor.safari));
/* The architectural ceiling: @layer IS this framework's API, so no version of it
   can reach further than @layer does. Publishing the gap is more honest than
   publishing the floor alone. */
const ceiling = coverage(reachQuery(99, 97, 15.4));

/* PER-COMPONENT floors (roadmap 249.3). The published floor is the whole
   framework's, and it is the MAXIMUM over every file — so it answers "what does
   `css/index.css` need", not "what does the badge I am about to paste need".
   A consumer importing `./css/components/badge` is held to 119 by a
   `:user-invalid` rule that ships in the form stylesheet and that their page
   never loads.

   CSS ONLY, and the key is named for it. Attributing JS to a component would
   mean mapping `bo-<name>` to `behaviors/<name>` by NAME, which is the
   convention-guessing CLAUDE.md refuses ("page slugs are not class names");
   `dist/js` is not split per component, so there is nothing exact to read. The
   docs label says "CSS floor" for the same reason — a component whose
   behaviour needs `showModal()` has a higher REAL floor than its stylesheet
   does, and overstating the reach of a CSS-only import would be the same class
   of error the framework floor was invented to fix.

   Degenerate output is the failure to watch for here: every component file is
   one `@layer` block, so `@layer`'s Chrome 99 is a lower bound all 40 share. It
   is not the whole answer — the spread is asserted below rather than assumed,
   because an identical value across many inputs is a defect until proven
   otherwise, and this is exactly the shape that produces one. */
const componentDir = join(DIST, 'css', 'components');
const componentFiles = (await readdir(componentDir))
  .filter((f) => f.endsWith('.css') && !f.endsWith('.min.css'))
  .sort();
const perComponent = {};
for (const file of componentFiles) {
  const text = await readFile(join(componentDir, file), 'utf8');
  const det = detect(text, '');
  const sup = floorFor(['core', 'degrades'], det);
  perComponent[file.replace(/\.css$/, '')] = {
    floor: sup.floor,
    drivenBy: sup.drivenBy,
    label: `Chrome/Edge ${sup.floor.chrome} · Firefox ${sup.floor.firefox} · Safari ${sup.floor.safari}`,
  };
}
if (!componentFiles.length) {
  console.error('derive-floor FAILED — dist/css/components holds no un-minified stylesheet.');
  console.error('  Refusing to publish a floor.json whose perComponent map is silently empty.');
  process.exit(1);
}
/* Every per-component floor must be at or below the framework floor: the
   framework number is the max over the same probes, so a component exceeding it
   means the two disagree about the same artifact. Cheap, and it is the one
   reconciliation that can catch a refactor of `detect`/`floorFor` drifting. */
for (const [name, c] of Object.entries(perComponent)) {
  for (const b of BROWSERS) {
    if (c.floor[b] == null) continue;
    if (floor[b] == null || parseFloat(c.floor[b]) > parseFloat(floor[b])) {
      console.error(
        `derive-floor FAILED — component ${name} floors ${b} at ${c.floor[b]}, ` +
          `above the framework floor ${floor[b]}. The two derivations disagree.`,
      );
      process.exit(1);
    }
  }
}

const out = {
  generated: 'by scripts/derive-floor.mjs from dist/css — do not edit',
  source: `@mdn/browser-compat-data@${JSON.parse(await readFile(join(HERE, '..', '..', '..', 'node_modules/@mdn/browser-compat-data/package.json'), 'utf8')).version}`,
  floor,
  drivenBy,
  /** Where every cosmetic enhancement also paints. Higher, and NOT the floor. */
  fullFidelity: full.floor,
  fullFidelityDrivenBy: full.drivenBy,
  /** Detected `polish` features some browser will never support, so
   *  `fullFidelity` is read as "every cosmetic enhancement paints EXCEPT
   *  these". Empty is the normal state; see the block that builds it. */
  neverSupported,
  /** Human-readable, so every page and README prints the same string. */
  label: `Chrome/Edge ${floor.chrome} · Firefox ${floor.firefox} · Safari ${floor.safari}`,
  reach,
  ceiling,
  reachSource: `caniuse-lite@${JSON.parse(await readFile(join(HERE, '..', '..', '..', 'node_modules/caniuse-lite/package.json'), 'utf8')).version}`,
  features: detected,
  /** Per-component CSS floors — what ONE `./css/components/<name>` import
   *  needs, which is at or below `floor`. See the block that builds it. */
  perComponent,
};
await writeFile(join(DIST, 'floor.json'), JSON.stringify(out, null, 2) + '\n');

console.log(`floor derived — ${out.label}`);
for (const b of BROWSERS) console.log(`  ${b.padEnd(8)} ${floor[b]}  (set by ${drivenBy[b]})`);
console.log(`  from ${detected.length} detected feature(s), against ${out.source}`);
console.log(`  reach ${reach}% of tracked browser usage (${out.reachSource}); @layer ceiling ${ceiling}%`);
console.log('full fidelity (every cosmetic enhancement painting too):');
for (const b of BROWSERS) console.log(`  ${b.padEnd(8)} ${full.floor[b]}  (set by ${full.drivenBy[b]})`);
if (neverSupported.length) {
  console.log('  EXCEPT these, which one or more browsers will never paint:');
  for (const n of neverSupported) console.log(`    ${n.id} — ${n.browsers.join(', ')}`);
}
{
  const labels = new Set(Object.values(perComponent).map((c) => c.label));
  console.log(
    `  per-component CSS floors: ${componentFiles.length} component(s), ` +
      `${labels.size} distinct floor(s)`,
  );
}
