/**
 * Gate: the "logical properties throughout" promise on /concepts/i18n is true.
 *
 * That page tells adopters a right-to-left document mirrors without a mirrored
 * stylesheet, and names the exact places that need a manual flip. Both halves
 * were prose until 2026-08-17, and executing them found a real defect:
 * `.bo-motion-slide-in-inline-start` has a LOGICAL name and a PHYSICAL
 * implementation (`transform: translateX(-0.5rem)`), so in RTL it slid in from
 * the wrong edge — a fourth flip site that the page said did not exist.
 *
 * Two assertions, both over the SHIPPED css (dist), not the source:
 *
 *  1. Zero physical box properties. margin-left, padding-right, border-left,
 *     float, bare left:/right: insets, text-align: left|right. This is the
 *     "logical throughout" claim stated as something a build can refuse.
 *
 *  2. The direction-sensitive constructs CSS gives no logical form for —
 *     transforms and background-position keywords — appear only at known
 *     sites, each of which carries a [dir="rtl"] flip. A NEW one fails the
 *     build rather than silently shipping a stylesheet that mirrors most of
 *     the way. Extending the allowlist is a deliberate act, and the docs
 *     count has to move with it.
  *
 * @exact — asserts the presence or absence of named CSS properties in dist. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { distCssFiles, distCssRoot } from './dist-css.mjs';


/* Physical box properties. `left:`/`right:` must be anchored to a declaration
   start so `inset-inline-left`-ish names and shorthand values don't match. */
const PHYSICAL = [
  /(?:^|[;{\s])margin-(?:left|right)\s*:/,
  /(?:^|[;{\s])padding-(?:left|right)\s*:/,
  /(?:^|[;{\s])border-(?:left|right)(?:-[a-z]+)?\s*:/,
  /(?:^|[;{\s])float\s*:/,
  /(?:^|[;{\s])(?:left|right)\s*:/,
  /text-align\s*:\s*(?:left|right)\b/,
];

/* Constructs with no logical equivalent. Zero-valued ones are direction-safe
   (translateY only, or a 0 x-offset), so they are not flip sites. */
const NEEDS_FLIP = [
  { name: 'translateX', re: /translateX\(\s*(-?[.\d]+[a-z%]*)\s*\)/g, nonZero: (m) => parseFloat(m) !== 0 },
  { name: 'translate', re: /(?:^|[;{\s])translate\s*:\s*(-?[.\d]+[a-z%]*)/g, nonZero: (m) => parseFloat(m) !== 0 },
  { name: 'background-position', re: /background-position\s*:\s*([^;}]+)/g, nonZero: (m) => /\b(?:left|right)\b/.test(m) },
  /* Glyphs that POINT along the inline axis. Logical properties move boxes,
     never the character inside them, so a chevron in `content` keeps aiming
     the same way in RTL — the tree's disclosure arrow is exactly this.
     Vertical arrows (↕ ▲ ▼) are inline-axis-neutral and not flip sites; the
     breadcrumb's "/" is deliberately not treated as directional, matching
     common RTL practice of leaving it alone. */
  {
    name: 'directional glyph',
    re: /content\s*:\s*("[^"]*"|'[^']*')/g,
    nonZero: (m) => /[▸◂▶◀►◄→←⟶⟵»«›‹⇒⇐➔➜><]/.test(m),
  },
];

/* The places /concepts/i18n names. Keyed by the dist file that carries
   them — a construct appearing anywhere else is what this gate is for. */
const ALLOWED = new Map([
  ['css/motion.css', 'slide-in-inline-start animation (transform is physical)'],
  ['css/components/form.css', 'select chevron (background-image has no logical position)'],
  ['css/components/tree.css', 'tree disclosure chevron'],
  ['css/components/tree-table.css', 'tree-table disclosure chevron'],
  ['css/components/offcanvas.css', 'off-canvas drawer slide direction'],
  // Bundles that re-export the above; same rules, same flips.
  ['css/index.css', 'full bundle — contains the component flips above'],
  ['css/components/nav.css', 'nav bundle — contains offcanvas'],
  ['css/rf-essentials.css', 'RF-floor bundle (roadmap 59.2) — re-exports the select chevron flip from form.css'],
]);
const DOCUMENTED_PLACES = 5;

/* Quote-agnostic: components write [dir="rtl"] and [dir='rtl'] alike, and a
   naive substring check silently reported a file with a real flip as missing
   one. */
const RTL_RULE = /\[dir=["']?rtl["']?\]/;

const failures = [];
const flipSites = new Set();

for await (const file of distCssFiles()) {
  const rel = relative(join(distCssRoot, '..', '..'), file).replace(/^dist\//, '');
  const css = await readFile(file, 'utf8');

  for (const re of PHYSICAL) {
    const m = css.match(re);
    if (m) failures.push(`${rel}: physical property "${m[0].trim()}" — use the logical form`);
  }

  for (const { name, re, nonZero } of NEEDS_FLIP) {
    for (const m of css.matchAll(re)) {
      if (!nonZero(m[1])) continue;
      if (!ALLOWED.has(rel)) {
        failures.push(`${rel}: direction-sensitive ${name}(${m[1].trim()}) at an unlisted site — add a [dir="rtl"] flip and list it in check-rtl.mjs + /concepts/i18n`);
      } else if (!RTL_RULE.test(css)) {
        failures.push(`${rel}: direction-sensitive ${name}(${m[1].trim()}) but the file carries no [dir="rtl"] flip`);
      } else {
        flipSites.add(rel);
      }
    }
  }
}

/* The docs state a NUMBER. Count the real component files (bundles re-export
   them), so the prose cannot drift away from the stylesheet again. */
const realPlaces = [...flipSites].filter((f) => !/index\.css$|nav\.css$|rf-essentials\.css$/.test(f));
if (realPlaces.length !== DOCUMENTED_PLACES) {
  failures.push(
    `/concepts/i18n says ${DOCUMENTED_PLACES} places need a flip; the stylesheet has ${realPlaces.length} (${realPlaces.join(', ')}) — update the page and DOCUMENTED_PLACES together`,
  );
}

/* DESIGN.md states the same count in prose, and nothing was reading it — it
   still said "the one physical exception" months after there were five
   (found while writing the M1-M4 doctrine, 2026-08-17). A number repeated in
   two places drifts; assert both. */
/* SCOPE: DESIGN.md is a repo-root file, not part of the published package, so
   it is absent when this gate runs inside a minimal build context — the
   po-app image copies only packages/ and broke on it. That is a scope
   boundary, not a pass: report the skip LOUDLY so nobody reads a green line
   as full coverage. CI checks out the whole repo, so CI always enforces it. */
const designMd = await readFile(join(distCssRoot, '..', '..', '..', '..', 'DESIGN.md'), 'utf8').catch(() => null);
let designChecked = false;
if (designMd === null) {
  console.warn(
    'rtl check: DESIGN.md is not in this build context, so its flip-site count was NOT verified ' +
      '(expected inside container builds; CI has the full checkout and does verify it).',
  );
} else {
  designChecked = true;
  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const word = WORDS[DOCUMENTED_PLACES];
  const rtlPara = designMd.match(/Logical properties throughout[\s\S]{0,600}/)?.[0] ?? '';
  const statesCount =
    new RegExp(`\\b(${DOCUMENTED_PLACES}|\\*\\*${word}\\*\\*|${word})\\b`, 'i').test(rtlPara);
  if (!statesCount) {
    failures.push(
      `DESIGN.md's logical-properties paragraph does not state ${DOCUMENTED_PLACES} (${word}) flip sites — ` +
        `it is the third place this count lives and the one nothing was checking.`,
    );
  }
}

if (failures.length) {
  console.error(`rtl check FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(
  `rtl check passed — no physical box properties in dist; ${realPlaces.length} documented flip site(s), ` +
    `each with a [dir="rtl"] rule; DESIGN.md count ${designChecked ? 'verified' : 'NOT CHECKED (file absent)'}`,
);
