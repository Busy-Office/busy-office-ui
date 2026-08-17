/**
 * Gate: "reduced-motion zeroing on all animations" (/concepts/accessibility)
 * stays true as animations are added.
 *
 * The strategy is token-driven — prefers-reduced-motion zeroes
 * --bo-motion-duration-* in tokens/motion.css, so every animation built on
 * those tokens collapses to 0ms for free. That is elegant and it is exactly
 * why the claim can rot silently: an animation with a LITERAL duration
 * (`1.5s`) simply opts out, and nothing complains.
 *
 * Executed 2026-08-17 and the claim was TRUE — both literal-duration
 * animations (spin, skeleton shimmer) carry their own
 * `animation: none` override, and the JS behaviours use scrollIntoView
 * without `behavior: "smooth"`. This gate exists so the NEXT animation
 * cannot quietly be the first exception. Two prior completeness claims on
 * this project ("three places need an RTL flip", forced-colors rules exist
 * "exactly where" needed) were both false when finally executed; the word
 * "all" is the risk.
 *
 * Rule: every `animation` shorthand in the shipped CSS either
 *   (a) takes its duration from a --bo-motion-duration-* token, or
 *   (b) has a `@media (prefers-reduced-motion: reduce)` rule that sets
 *       `animation: none` for a selector matching the one that declares it.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const distCss = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'css');

async function* cssFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* cssFiles(p);
    // .min.css is the same CSS; scanning both double-counts every finding.
    else if (e.name.endsWith('.css') && !e.name.endsWith('.min.css')) yield p;
  }
}

const LITERAL_DURATION = /(?:^|[\s,])\d*\.?\d+m?s(?:\s|$|,)/;
const failures = [];
let tokenDriven = 0;
let explicitlyOverridden = 0;

for await (const file of cssFiles(distCss)) {
  const rel = relative(join(distCss, '..', '..'), file).replace(/^dist\//, '');
  const root = postcss.parse(await readFile(file, 'utf8'));

  // Selectors switched off under reduced motion, in this same file.
  const zeroed = new Set();
  root.walkAtRules('media', (at) => {
    if (!/prefers-reduced-motion\s*:\s*reduce/.test(at.params)) return;
    at.walkDecls(/^animation(-name)?$/, (decl) => {
      if (decl.value.trim() === 'none') {
        for (const sel of decl.parent.selector.split(',')) zeroed.add(sel.trim());
      }
    });
  });

  root.walkDecls('animation', (decl) => {
    // Declarations INSIDE the reduced-motion block are the cure, not the case.
    let inReduced = false;
    for (let p = decl.parent; p; p = p.parent) {
      if (p.type === 'atrule' && /prefers-reduced-motion/.test(p.params ?? '')) inReduced = true;
    }
    if (inReduced) return;

    if (decl.value.includes('--bo-motion-duration')) { tokenDriven++; return; }
    if (!LITERAL_DURATION.test(decl.value)) return; // no duration at all — nothing to zero

    const selectors = decl.parent.selector.split(',').map((s) => s.trim());
    if (selectors.some((s) => zeroed.has(s))) { explicitlyOverridden++; return; }

    failures.push(
      `${rel}: "${decl.parent.selector} { animation: ${decl.value} }" uses a literal duration ` +
        `and has no prefers-reduced-motion override — it will keep animating for users who asked it not to. ` +
        `Use a --bo-motion-duration-* token, or add "@media (prefers-reduced-motion: reduce) { ${selectors[0]} { animation: none } }".`,
    );
  });
}

if (failures.length) {
  console.error(`motion check FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(
  `motion check passed — every shipped animation respects prefers-reduced-motion ` +
    `(${tokenDriven} token-driven, ${explicitlyOverridden} with an explicit override)`,
);
