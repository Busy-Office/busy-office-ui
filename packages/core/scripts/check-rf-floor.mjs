#!/usr/bin/env node
/**
 * Floor-verification gate for `dist/css/rf-essentials.css` (roadmap 59.3) —
 * derive-floor.mjs's technique, in reverse. derive-floor asks "what's the
 * lowest floor this CSS supports"; this asks "does this CSS ever REQUIRE
 * more than 108, UNGUARDED".
 *
 * A plain substring scan (derive-floor's own technique) reports every
 * feature this profile MENTIONS, including ones deliberately wrapped in
 * @supports or a forgiving :is() — exactly the ones that DON'T need to fear
 * 108, because the browser skips them cleanly. Tried first here: it produced
 * 3 false positives (:user-invalid, color-mix(), subgrid) against a profile
 * that already guards all three. This gate parses the CSS instead of
 * grepping it, so a guarded use passes and an unguarded one — the actual
 * failure mode — does not.
 *
 * Two guard shapes recognized, matching what this profile's source
 * actually uses:
 *   - `@supports (...)` ancestor — postcss AST walk up .parent.
 *   - `:is(...)` / `:where(...)` forgiving selector list — the unsupported
 *     arm drops, the rest of the list still matches (CSS Selectors L4).
 * Anything else exceeding 108, unguarded, fails the gate with the exact
 * selector/declaration and source line.
 *
 * @heuristic — the verdict rests on recognizing guard SHAPES, not just
 * feature presence, so it can be fooled by a shape it doesn't know about.
 * Carries --self-test. `findViolations` is the ONE function both the real
 * run and the self-test call, on purpose: a first version's "overLimit"
 * computation passed `compatOf(f.path)` — the WHOLE multi-browser support
 * object — into a helper expecting one browser's entries. Every feature
 * silently came back "not over the limit", so the gate always passed —
 * including against a build with an unguarded color-mix() injected
 * straight into it, which is what caught it (the self-test at the time
 * used its own copy of the walk logic and happened not to exercise this
 * exact call, so it stayed green while the real gate was inert). Sharing
 * one function is what makes a bug in it show up in --self-test too.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import bcd from '@mdn/browser-compat-data' with { type: 'json' };

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const TARGET = 108;

/** Each probe: how the feature appears in CSS text, and where in BCD. */
const FEATURES = [
  { id: ':user-invalid', path: ['css', 'selectors', 'user-invalid'], kind: 'selector', pattern: () => /:user-invalid\b/g },
  { id: 'color-mix()', path: ['css', 'types', 'color', 'color-mix'], kind: 'value', pattern: () => /color-mix\(/g },
  { id: 'subgrid', path: ['css', 'properties', 'grid-template-columns', 'subgrid'], kind: 'value', pattern: () => /\bsubgrid\b/g },
  { id: '@container', path: ['css', 'at-rules', 'container'], kind: 'atrule' },
  { id: '@layer', path: ['css', 'at-rules', 'layer'], kind: 'atrule' },
  { id: ':has()', path: ['css', 'selectors', 'has'], kind: 'selector', pattern: () => /:has\(/g },
];

function compatOf(path) {
  let node = bcd;
  for (const k of path) node = node?.[k];
  if (!node) throw new Error(`check-rf-floor: no BCD entry at ${path.join('.')} — has the key moved?`);
  return node.__compat.support;
}

function earliestChrome(support) {
  const entries = (Array.isArray(support) ? support : [support]).filter(
    (e) => !e.flags && typeof e.version_added === 'string',
  );
  const live = entries.filter((e) => !e.version_removed);
  const pool = live.length ? entries : [];
  if (!pool.length) return null;
  return parseFloat(pool.map((e) => e.version_added).sort((a, b) => parseFloat(a) - parseFloat(b))[0]);
}

/** Walk up from a postcss node to see if an @supports ancestor exists. */
function insideSupports(node) {
  let n = node.parent;
  while (n) {
    if (n.type === 'atrule' && n.name === 'supports') return true;
    n = n.parent;
  }
  return false;
}

/** A :user-invalid inside an :is(...)/:where(...) wrapper is forgiving-list
    safe — the browser drops that one arm and keeps the rest. A naive
    `[^)]*` regex breaks the moment the wrapper contains ITS OWN nested
    parens — exactly what this profile's real source does
    (`:is(...:has([aria-invalid="true"]), ...:has(...:user-invalid...))`) —
    because `[^)]*` stops at the first `)`, which belongs to the nested
    :has(), not the outer :is(). Caught red-proving this gate against the
    real built profile: the legitimate, already-guarded :user-invalid use
    came back as an unguarded violation. This scans with real paren-depth
    tracking instead. */
function insideForgivingList(selector) {
  const openers = /:(is|where)\(/g;
  let m;
  while ((m = openers.exec(selector))) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < selector.length && depth > 0) {
      if (selector[i] === '(') depth += 1;
      else if (selector[i] === ')') depth -= 1;
      i += 1;
    }
    const span = selector.slice(m.index + m[0].length, i - 1);
    if (/:user-invalid\b/.test(span)) return true;
  }
  return false;
}

function overLimitFeatures() {
  return FEATURES.filter((f) => {
    if (f.kind === 'atrule') return false; // @layer/@container are within 108
    const v = earliestChrome(compatOf(f.path).chrome);
    return v !== null && v > TARGET;
  });
}

/** The one violation-finder both the real run and --self-test call. A fresh
    RegExp per call sidesteps global-regex .lastIndex state entirely — the
    exact bug class that let a first version pass its own self-test while
    missing a real, unguarded violation. */
function findViolations(root, overLimit) {
  const violations = [];

  root.walkDecls((decl) => {
    for (const f of overLimit) {
      if (f.kind !== 'value') continue;
      if (!f.pattern().test(decl.value)) continue;
      if (!insideSupports(decl)) {
        violations.push({
          feature: f.id,
          where: `${decl.parent?.selector ?? decl.parent?.params ?? '(root)'} { ${decl.prop}: ${decl.value} }`,
          line: decl.source?.start?.line,
        });
      }
    }
  });

  root.walkRules((rule) => {
    for (const f of overLimit) {
      if (f.kind !== 'selector') continue;
      if (!f.pattern().test(rule.selector)) continue;
      const guarded = insideSupports(rule) || insideForgivingList(rule.selector);
      if (!guarded) {
        violations.push({ feature: f.id, where: rule.selector, line: rule.source?.start?.line });
      }
    }
  });

  return violations;
}

if (process.argv.includes('--self-test')) {
  const overLimit = overLimitFeatures();

  const guarded = postcss.parse(`
    @supports (color: color-mix(in oklab, red, red)) {
      .x { --a: color-mix(in oklab, red 10%, blue); }
    }
    .y:is(.z:user-invalid, .z[aria-invalid]) { color: red; }
    /* Nested parens inside the wrapper — the exact shape form-field.css's
       real source uses, and what a naive [^)]* regex missed. */
    :is(.a:has([aria-invalid="true"]), .a:has(input:user-invalid, select:user-invalid)) .b { color: red; }
  `);
  const unguarded = postcss.parse(`
    .x { --a: color-mix(in oklab, red 10%, blue); }
    .y:user-invalid { color: red; }
    .z { grid-template-columns: subgrid; }
  `);

  const guardedResult = findViolations(guarded, overLimit);
  const unguardedResult = findViolations(unguarded, overLimit).map((v) => v.feature);
  const guardedPasses = guardedResult.length === 0;
  const unguardedCatchesAll =
    unguardedResult.includes('color-mix()') &&
    unguardedResult.includes(':user-invalid') &&
    unguardedResult.includes('subgrid');

  if (!guardedPasses || !unguardedCatchesAll) {
    console.error('check-rf-floor --self-test FAILED');
    console.error('  guarded input violations (expect none):', guardedResult);
    console.error('  unguarded input violations (expect all 3):', unguardedResult);
    process.exit(1);
  }
  console.log('check-rf-floor --self-test passed — distinguishes guarded from unguarded use');
  process.exit(0);
}

const cssPath = join(DIST, 'css', 'rf-essentials.css');
const css = await readFile(cssPath, 'utf8');
const root = postcss.parse(css, { from: cssPath });
const violations = findViolations(root, overLimitFeatures());

if (violations.length) {
  console.error(`check-rf-floor FAILED — ${violations.length} unguarded use(s) exceeding Chrome ${TARGET}:`);
  for (const v of violations) {
    console.error(`  ${v.feature} at rf-essentials.css:${v.line ?? '?'} — ${v.where}`);
  }
  process.exit(1);
}

console.log(`rf-essentials floor check passed — every use of a feature above Chrome ${TARGET} is guarded (@supports or a forgiving :is()/:where() list)`);
