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
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcd from '@mdn/browser-compat-data' with { type: 'json' };

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
  { tier: 'core', id: 'dialog', path: ['html', 'elements', 'dialog'], test: (c, js) => /showModal\(/.test(js) || /\bdialog\b/.test(c) },
];

const css = await readFile(join(DIST, 'css', 'index.css'), 'utf8');
let js = '';
try {
  js = await readFile(join(DIST, 'js', 'index.js'), 'utf8');
} catch {
  /* JS is optional for the CSS-only consumer; probes that need it just miss. */
}

/** Walk a BCD path, or throw — a silently-missing key would lower the floor. */
function compatOf(path) {
  let node = bcd;
  for (const k of path) {
    node = node?.[k];
    if (!node) throw new Error(`derive-floor: no BCD entry at ${path.join('.')} — has the key moved?`);
  }
  return node.__compat.support;
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

const detected = [];
for (const f of FEATURES) {
  if (!f.test(css, js)) continue;
  const support = compatOf(f.path);
  /* Does the BUILT css carry a -webkit- form of this property? autoprefixer
     adds them, so the answer is a fact about the artifact, not an intention. */
  const emitsPrefixed = new RegExp(`-webkit-${f.id.replace(/[^a-z-]/g, '')}\\s*:`).test(css);
  const versions = {};
  for (const b of BROWSERS) versions[b] = earliestUsableVersion(support[b], emitsPrefixed);
  detected.push({ tier: f.tier, id: f.id, prefixed: emitsPrefixed, versions });
}

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
const floorFor = (tiers) => {
  const f = {};
  const by = {};
  for (const b of BROWSERS) {
    let max = null;
    let who = null;
    for (const d of detected) {
      if (!tiers.includes(d.tier)) continue;
      const v = d.versions[b];
      if (v == null) continue;
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

const out = {
  generated: 'by scripts/derive-floor.mjs from dist/css — do not edit',
  source: `@mdn/browser-compat-data@${JSON.parse(await readFile(join(HERE, '..', '..', '..', 'node_modules/@mdn/browser-compat-data/package.json'), 'utf8')).version}`,
  floor,
  drivenBy,
  /** Where every cosmetic enhancement also paints. Higher, and NOT the floor. */
  fullFidelity: full.floor,
  fullFidelityDrivenBy: full.drivenBy,
  /** Human-readable, so every page and README prints the same string. */
  label: `Chrome/Edge ${floor.chrome} · Firefox ${floor.firefox} · Safari ${floor.safari}`,
  features: detected,
};
await writeFile(join(DIST, 'floor.json'), JSON.stringify(out, null, 2) + '\n');

console.log(`floor derived — ${out.label}`);
for (const b of BROWSERS) console.log(`  ${b.padEnd(8)} ${floor[b]}  (set by ${drivenBy[b]})`);
console.log(`  from ${detected.length} detected feature(s), against ${out.source}`);
console.log('full fidelity (every cosmetic enhancement painting too):');
for (const b of BROWSERS) console.log(`  ${b.padEnd(8)} ${full.floor[b]}  (set by ${full.drivenBy[b]})`);
