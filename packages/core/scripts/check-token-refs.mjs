/**
 * Gate: every `var(--bo-…)` in the shipped CSS names a custom property that
 * something actually defines.
 *
 * WHY. An unresolvable `var()` is not a no-op and it is not a syntax error —
 * it makes the whole declaration **invalid at computed-value time**, so the
 * property silently falls back to its inherited or initial value. Nothing
 * warns. stylelint does not catch it (the syntax is valid), the build does
 * not, and `check:motion` does not: that gate asks whether a duration is
 * token-driven or has a reduced-motion override, never whether the token it
 * names resolves.
 *
 * Two shipped defects were found this way (roadmap 201), both single-token
 * typos, both live in 0.5.0 and both measured in a real browser before being
 * believed:
 *
 *   - `scan.css`  `animation: bo-scan-flash 600ms var(--bo-motion-ease) forwards`
 *     — the defined token is `--bo-motion-easing-standard`. Computed
 *     `animation-name` read `none` and the ::after stayed at its declared
 *     `opacity: 0`, so the RF scan flash — the component's whole visible
 *     verdict — painted nothing at all for any user not in reduced-motion.
 *   - `combobox.css`  `font-family: var(--bo-font-family-mono)` — the defined
 *     token is `--bo-font-mono` (six other components spell it correctly).
 *     The option code rendered in the body sans-serif font, byte-identical to
 *     `getComputedStyle(document.body).fontFamily`.
 *
 * WHAT COUNTS AS A DEFINITION. Not CSS alone — that would report a false
 * positive on the three tokens the shipped behaviours set at runtime
 * (`--bo-sticky-w-1`/`-2` in sticky-cols, `--bo-anchor-landing-offset` in
 * anchor-nav). Both definition sites are read, so the gate does not have to be
 * taught about them one exemption at a time.
 *
 * WHAT IS DELIBERATELY NOT A FAILURE. A reference carrying a fallback —
 * `var(--bo-grid-min, 16rem)` — is a consumer-override hook: undefined by
 * design, with the default written right there. Seven of the nine undefined
 * names on the tree this gate landed against were exactly that, which is why
 * the rule is "no fallback AND never defined" rather than "never defined".
 * The count of hook references is printed every run so the exemption cannot
 * quietly grow into cover for a real typo.
 *
 * BASE RATE when this landed, and READ THE ARTIFACT EACH FIGURE CAME FROM —
 * they are different sets and quoting one for the other is how a wrong number
 * gets published:
 *
 *   - `dist/css/index.css` ALONE (the bundle a consumer imports): 152 distinct
 *     `--bo-*` names referenced, 219 defined, 9 referenced-but-undefined — 7
 *     consumer hooks carrying fallbacks and the 2 genuine defects above.
 *   - EVERY file this gate walks (index + per-component dist + rf-essentials,
 *     so names recur across files): 2431 references, 189 distinct names, 387
 *     definitions, 11 hooks.
 *
 * Either way the predicate was NOT already true of everything (94.11's test):
 * the gate went red on the untouched tree, which is its red-proof by
 * construction. It was red-proved a second time deliberately, by restoring the
 * `--bo-motion-ease` typo and confirming the string reached the BUILT output
 * (`grep -c 'var(--bo-motion-ease)' dist/css/index.css` → 1) before believing
 * the red — the injection, not just the result.
 *
 * ORDERING, learned the hard way and by this gate catching it: it must run
 * AFTER `build:rf-essentials`, not merely after `check:motion`. Wired one step
 * too early it read a STALE `rf-essentials.css` from a previous build and
 * failed on a typo that had already been fixed in source — the exact stale-dist
 * ordering trap `build:acr` shipped once before.
 *
 * @exact — set membership between two name sets read out of the built
 * artifacts. Exempt from --self-test: there is no judgement to get wrong, and
 * ceremony around a lookup is noise.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { distCssFiles, distCssRoot } from './dist-css.mjs';
import postcss from 'postcss';

const DIST_JS = join(distCssRoot, '..', 'js');

/** `var(--bo-x)` / `var( --bo-x , fallback )` — group 2 present ⇒ has fallback. */
const VAR_REF = /var\(\s*(--bo-[a-zA-Z0-9-]+)\s*(,)?/g;
const JS_DEFINE = /setProperty\(\s*['"`](--bo-[a-zA-Z0-9-]+)['"`]/g;

async function* jsFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jsFiles(path);
    else if (entry.name.endsWith('.js')) yield path;
  }
}

const defined = new Set();
const references = []; // { name, hasFallback, file }

for await (const file of distCssFiles()) {
  const css = await readFile(file, 'utf8');
  const root = postcss.parse(css, { from: file });
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--bo-')) defined.add(decl.prop);
    VAR_REF.lastIndex = 0;
    let m;
    while ((m = VAR_REF.exec(decl.value))) {
      references.push({ name: m[1], hasFallback: Boolean(m[2]), file });
    }
  });
}

const jsDefined = new Set();
for await (const file of jsFiles(DIST_JS)) {
  const src = await readFile(file, 'utf8');
  JS_DEFINE.lastIndex = 0;
  let m;
  while ((m = JS_DEFINE.exec(src))) {
    jsDefined.add(m[1]);
    defined.add(m[1]);
  }
}

if (references.length === 0) {
  console.error(
    'token-refs check FAILED — no var(--bo-…) references were found at all. ' +
      'The built CSS is missing or dist-css.mjs no longer points at it; that is ' +
      'a broken instrument, not a clean tree.',
  );
  process.exit(1);
}

const hooks = references.filter((r) => r.hasFallback && !defined.has(r.name));
const broken = references.filter((r) => !r.hasFallback && !defined.has(r.name));

const distinct = new Set(references.map((r) => r.name));

if (broken.length > 0) {
  const byName = new Map();
  for (const r of broken) {
    if (!byName.has(r.name)) byName.set(r.name, []);
    byName.get(r.name).push(r.file.replace(distCssRoot + '/', ''));
  }
  console.error(
    `token-refs check FAILED — ${byName.size} custom propert${byName.size === 1 ? 'y is' : 'ies are'} ` +
      'referenced with no fallback and defined nowhere. An unresolvable var() ' +
      'is invalid at computed-value time, so the whole declaration is dropped ' +
      'and the property silently inherits:',
  );
  for (const [name, files] of [...byName].sort()) {
    console.error(`  ${name}  —  ${[...new Set(files)].join(', ')}`);
  }
  console.error(
    '\nFix the name, define the token, or — if it is a consumer-override hook — ' +
      'give it a fallback: var(' +
      [...byName.keys()][0] +
      ', <default>).',
  );
  process.exit(1);
}

console.log(
  `token-refs check passed — ${references.length} var(--bo-…) reference(s) ` +
    `across ${distinct.size} distinct name(s); ${defined.size} token(s) defined ` +
    `(${jsDefined.size} by shipped behaviours at runtime); ` +
    `${hooks.length} consumer-override hook(s) carrying a fallback`,
);
