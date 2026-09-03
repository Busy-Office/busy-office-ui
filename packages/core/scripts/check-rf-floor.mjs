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
 * SCOPE, stated rather than implied (roadmap 205.1). This gate checks
 * SELECTORS and VALUES against FEATURES below — it does not walk at-rules
 * against BCD. That gap was real: `@starting-style` (Chrome 117, entered
 * this profile via 200.4's bulk-actions entrance) is above TARGET and was
 * invisible to this gate, which still printed "every use... is guarded".
 * Measured before deciding what to do about it (94.11 — base rate first):
 * this profile uses 6 distinct at-rules today (`@container` 105, `@keyframes`
 * 1, `@layer` 99, `@media` 1, `@starting-style` 117, `@supports` 28) and
 * exactly ONE is above 108. A generic per-at-rule BCD walk was refused —
 * it would be the FEATURES hand-list by another name, added per feature
 * rather than per shape, for a population this small and this stable.
 *
 * The real reason at-rules don't need the guard-shape treatment SELECTORS
 * and VALUES do: CSS's forward-compatible parsing (CSS Syntax L3 §3.5)
 * drops an at-rule a UA doesn't recognise, and everything nested inside it,
 * WHOLESALE — never partially applied. A selector or a declared value can
 * fail differently (an invalid value drops just that declaration; an
 * unsupported selector can invalidate a whole rule unless forgiving-listed),
 * which is exactly why those need active `@supports`/`:is()` guarding and
 * at-rules structurally do not. `@starting-style` is a live instance: a UA
 * that ignores it just never applies the FROM style, so the element renders
 * its base state with no travel — degraded, not broken — matching
 * `derive-floor.mjs`'s own `tier: 'degrades'` classification for it.
 *
 * `atRuleReport()` below is NOT a gate — it recomputes the base-rate numbers
 * above LIVE, every run, so this comment's claim cannot go stale the way
 * the pass message's overclaim did. It feeds the pass line so the count
 * actually shipping is always current.
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
import { compatOf as bcdCompatOf } from './bcd-compat.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const TARGET = 108;

/** Each probe: how the feature appears in CSS text, and where in BCD.
    Selectors and values ONLY — at-rules are handled separately below,
    reported rather than guard-checked; see the header for why. (Two
    at-rule-kind entries, `@container`/`@layer`, used to sit here; removed
    2026-08-29 (roadmap 205.1) because `overLimitFeatures()` excluded
    every `kind: 'atrule'` entry unconditionally, so they were dead —
    declared but never evaluated, which is the same overclaim shape the
    pass message had.) */
const FEATURES = [
  { id: ':user-invalid', path: ['css', 'selectors', 'user-invalid'], kind: 'selector', pattern: () => /:user-invalid\b/g },
  { id: 'color-mix()', path: ['css', 'types', 'color', 'color-mix'], kind: 'value', pattern: () => /color-mix\(/g },
  { id: 'subgrid', path: ['css', 'properties', 'grid-template-columns', 'subgrid'], kind: 'value', pattern: () => /\bsubgrid\b/g },
  { id: ':has()', path: ['css', 'selectors', 'has'], kind: 'selector', pattern: () => /:has\(/g },
];

/** Shared with derive-floor.mjs; see bcd-compat.mjs for why. */
const compatOf = (path) => bcdCompatOf(path, 'check-rf-floor');

/** Earliest Chrome version supporting this feature in a form THIS PROFILE
    ACTUALLY EMITS — the same rule `derive-floor.mjs`'s `earliestUsableVersion`
    applies, and the reason for `emitsPrefixed` (roadmap 209.2).

    Without the prefix filter this published the PREFIXED version: BCD records
    `@keyframes` as `[{version_added:"43"}, {prefix:"-webkit-",version_added:"1"}]`,
    so the pass line read `@keyframes 1` while the at-rule the profile emits is
    the unprefixed one at 43. The direction of that error is what made it worth
    fixing rather than documenting — it UNDERSTATES the floor, so this reporter
    could only ever produce a false "below 108", in the one script whose job is
    that floor.

    `emitsPrefixed` is a predicate over an entry's `prefix`, not a bare boolean,
    because one at-rule name can carry several prefixed entries; the sibling
    resolves one property at a time and can take the boolean. Callers that pass
    nothing get "we emit no prefixed form", which for SELECTOR/VALUE probes is
    also the fail-safe direction: ignoring prefixed support can only overstate
    what the CSS requires, and an overstatement here is a false violation a human
    reads, never a missed one. */
function earliestChrome(support, emitsPrefixed = () => false) {
  const entries = (Array.isArray(support) ? support : [support]).filter(
    (e) => !e.flags && typeof e.version_added === 'string',
  );
  const usable = entries.filter((e) => !e.prefix || emitsPrefixed(e.prefix));
  if (!usable.length) return null;
  const live = usable.filter((e) => !e.version_removed);
  const pool = live.length ? usable : [];
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
    const v = earliestChrome(compatOf(f.path).chrome);
    return v !== null && v > TARGET;
  });
}

/** NOT a gate — computes the header's base-rate claim live so it cannot go
    stale the way the pass message's overclaim did. Every distinct at-rule
    actually present, with its earliest Chrome version where BCD has an
    entry (`null` if not, e.g. a vendor/nonstandard at-rule this repo would
    want a human look at regardless of a version number). */
function atRuleReport(root) {
  const names = new Set();
  root.walkAtRules((r) => names.add(r.name));
  return [...names].sort().map((name) => {
    let version = null;
    try {
      /* Whether this profile emits a prefixed form is a fact about the built
         artifact, and the parse already carries it: postcss names
         `@-webkit-keyframes` as an at-rule of its own, so a prefixed BCD entry
         counts only when that prefixed name is present here too. */
      version = earliestChrome(compatOf(['css', 'at-rules', name]).chrome, (prefix) =>
        names.has(`${prefix}${name}`),
      );
    } catch {
      /* No BCD entry under this path — reported as unknown, not silently
         skipped; see the pass message. */
    }
    return { name: `@${name}`, version };
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

  /* The prefix filter (roadmap 209.2), pinned in BOTH directions on the real
     shape that exposed it — a support array whose only early entry is prefixed.
     One direction alone cannot fail: dropping the filter keeps `emits` right,
     and hard-coding "ignore every prefix" keeps `doesNot` right. */
  const prefixedSupport = [{ version_added: '43' }, { prefix: '-webkit-', version_added: '1' }];
  const doesNotEmit = earliestChrome(prefixedSupport);
  const emits = earliestChrome(prefixedSupport, (p) => p === '-webkit-');
  const prefixFilterWorks = doesNotEmit === 43 && emits === 1;

  if (!guardedPasses || !unguardedCatchesAll || !prefixFilterWorks) {
    console.error('check-rf-floor --self-test FAILED');
    console.error('  guarded input violations (expect none):', guardedResult);
    console.error('  unguarded input violations (expect all 3):', unguardedResult);
    console.error('  prefixed support resolves to (expect 43 unemitted / 1 emitted):', doesNotEmit, emits);
    process.exit(1);
  }
  console.log(
    'check-rf-floor --self-test passed — distinguishes guarded from unguarded use, ' +
      'and counts a prefixed BCD entry only when the profile emits that prefix',
  );
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

const atRules = atRuleReport(root);
const atRulesOverTarget = atRules.filter((a) => a.version !== null && a.version > TARGET);
const atRuleSummary = atRules.map((a) => `${a.name} ${a.version ?? 'unknown'}`).join(', ');

console.log(
  `rf-essentials floor check passed — every SELECTOR/VALUE use above Chrome ${TARGET} is guarded ` +
    `(@supports or a forgiving :is()/:where() list). At-rules are reported, not guard-checked ` +
    `(they degrade wholesale per CSS's forward-compatible parsing — see this file's header): ` +
    `${atRules.length} present today (${atRuleSummary}), ${atRulesOverTarget.length} above ${TARGET}.`,
);
