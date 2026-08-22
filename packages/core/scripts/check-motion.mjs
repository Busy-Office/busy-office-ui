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
 * Extended (roadmap 115.3, 2026-08-22) to the same rule for `transition`:
 * this gate covered `animation` only, so a literal-duration `transition`
 * could slip through silently — the exact rot pattern the header above
 * warns about, just for a sibling CSS property nobody had pointed the gate
 * at yet. Audited before extending: all 15 shipped `transition:`
 * declarations were already token-driven or `none` under reduced motion,
 * so this closes the gap with a ZERO-fix backlog — before the first
 * exception exists, not after.
 *
 * Rule, for EACH of `animation` and `transition`: every declaration in the
 * shipped CSS either
 *   (a) takes its duration from a --bo-motion-duration-* token, or
 *   (b) has a `@media (prefers-reduced-motion: reduce)` rule that sets
 *       that same property to `none` for a selector matching the one that
 *       declares it.
 *
 * @exact — checks each declaration for a reduced-motion rule. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { distCssFiles, distCssRoot } from './dist-css.mjs';
import postcss from 'postcss';

const LITERAL_DURATION = /(?:^|[\s,])\d*\.?\d+m?s(?:\s|$|,)/;

// One property definition per motion mechanism — animation and transition
// are checked by the exact same rule, so the rule is written once and
// applied to both rather than copy-pasted (the class of drift this
// project's own Standardize discipline exists to catch).
const PROPERTIES = [
  { name: 'animation', declRe: /^animation(-name)?$/ },
  { name: 'transition', declRe: /^transition(-duration)?$/ },
];

const failures = [];
const counts = Object.fromEntries(PROPERTIES.map((p) => [p.name, { tokenDriven: 0, explicitlyOverridden: 0 }]));

for await (const file of distCssFiles()) {
  const rel = relative(join(distCssRoot, '..', '..'), file).replace(/^dist\//, '');
  const root = postcss.parse(await readFile(file, 'utf8'));

  for (const { name: prop, declRe } of PROPERTIES) {
    // Selectors switched off under reduced motion, in this same file.
    const zeroed = new Set();
    root.walkAtRules('media', (at) => {
      if (!/prefers-reduced-motion\s*:\s*reduce/.test(at.params)) return;
      at.walkDecls(declRe, (decl) => {
        if (decl.value.trim() === 'none') {
          for (const sel of decl.parent.selector.split(',')) zeroed.add(sel.trim());
        }
      });
    });

    root.walkDecls(prop, (decl) => {
      // Declarations INSIDE the reduced-motion block are the cure, not the case.
      let inReduced = false;
      for (let p = decl.parent; p; p = p.parent) {
        if (p.type === 'atrule' && /prefers-reduced-motion/.test(p.params ?? '')) inReduced = true;
      }
      if (inReduced) return;

      if (decl.value.includes('--bo-motion-duration')) { counts[prop].tokenDriven++; return; }
      if (!LITERAL_DURATION.test(decl.value)) return; // no duration at all — nothing to zero

      const selectors = decl.parent.selector.split(',').map((s) => s.trim());
      if (selectors.some((s) => zeroed.has(s))) { counts[prop].explicitlyOverridden++; return; }

      failures.push(
        `${rel}: "${decl.parent.selector} { ${prop}: ${decl.value} }" uses a literal duration ` +
          `and has no prefers-reduced-motion override — it will keep animating for users who asked it not to. ` +
          `Use a --bo-motion-duration-* token, or add "@media (prefers-reduced-motion: reduce) { ${selectors[0]} { ${prop}: none } }".`,
      );
    });
  }
}

if (failures.length) {
  console.error(`motion check FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
const summary = PROPERTIES
  .map(({ name }) => `${name}: ${counts[name].tokenDriven} token-driven, ${counts[name].explicitlyOverridden} explicit override`)
  .join(' · ');
console.log(`motion check passed — every shipped animation and transition respects prefers-reduced-motion (${summary})`);
