#!/usr/bin/env node
/**
 * REPORT (not a gate): which rule bodies in the shipped CSS appear more than
 * once, keyed by their sorted declaration list?
 *
 * @exact — parses rules with postcss and compares sorted `prop: value` strings
 * for equality. Nothing is recognised or inferred; the JUDGEMENT about whether
 * a repeat is removable stays with the human reading the output, which is why
 * this reports and never fails.
 *
 * WHY THIS EXISTS AS A COMMITTED SCRIPT, and it is the same reason
 * `report-prose.mjs` does. LOOPS.md carries two "Settled:" sections refusing a
 * consolidation, and both name a COUNT as the thing that would reopen them —
 * *"what would change this: a fourth copy, or a divergence between the three"*.
 * The second of those sections states the count as measured fact:
 *
 *     "of 237 rules with 3+ declarations, exactly three blocks repeat"
 *
 * and adds *"the count is cheap to re-measure — key rules by their sorted
 * declaration list — so the next sweep can recheck it in one command instead of
 * trusting this paragraph."* It describes a command without being one. The next
 * sweep (2026-08-28) re-derived it and got **eight**, not three, on the same
 * 237 rules — the five it had not recorded verify by hand against source. That
 * is exactly roadmap 159's finding: when a claim is a measurement, the command
 * belongs next to it, or the next wake re-derives and the two answers differ
 * with no way to tell which instrument was wrong.
 *
 * WHY IT REPORTS AND DOES NOT FAIL. Every repeat found so far is CORRECT and
 * refused deliberately: `.bo-visually-hidden` is a utility the consumer puts on
 * their own markup, while `.bo-sidebar-nav__label` and `.bo-stepper__label` are
 * component PARTS whose hidden-ness is decided by a container query — there is
 * no markup a consumer could put the class on, and plain CSS cannot share a
 * rule body without also sharing a selector. A gate here would fail the build
 * on eight rules that are all right. What the count is FOR is the delta: a new
 * repeat, or a group that grows, is the signal to look.
 *
 * WHAT IS COUNTED, stated because a count is meaningless without it:
 *
 *   - `packages/core/src/css/**\/*.css` — the source, not `dist`. The built
 *     files are the same rules after a minifier, and per-file dist copies would
 *     count everything twice.
 *   - rules with **3 or more declarations**. Two components agreeing on
 *     `display: flex; gap: var(--bo-space-2)` is a coincidence of the token
 *     system working, not a decision stored twice; the threshold is where the
 *     2026-08-27 sweep set it and is kept so the numbers stay comparable.
 *   - declarations sorted before keying, so the same body written in a
 *     different order still matches. Comments are dropped by the parser.
 *   - `@media` / `@supports` bodies included: a rule inside an at-rule is still
 *     a rule someone maintains.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { srcCssFiles, srcCssRoot as CSS } from './src-css-files.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_DECLS = 3;

const bodies = new Map();
let rules = 0;
let files = 0;

for await (const file of srcCssFiles(CSS)) {
  files += 1;
  const root = postcss.parse(await readFile(file, 'utf8'), { from: file });
  root.walkRules((rule) => {
    /* `!important` is part of the body and is NOT in postcss's `d.value` — it
       lives on `d.important`. Leaving it out was this script's first-run bug
       and it merged a real difference: `.bo-badge`'s print rule and
       `.bo-stepper__marker`'s print rule carry the same three declarations, but
       the stepper marks two of them `!important`. They reported as a repeat
       and are not one. Caught by reconciling against an independent regex pass
       that happened to keep the flag (8 groups vs this script's 9). */
    const decls = rule.nodes
      .filter((n) => n.type === 'decl')
      .map((d) => `${d.prop}: ${d.value}${d.important ? ' !important' : ''}`);
    if (decls.length < MIN_DECLS) return;
    rules += 1;
    const key = [...decls].sort().join(' | ');
    const where = `${relative(CSS, file)}  ${rule.selector.replace(/\s+/g, ' ')}`;
    bodies.set(key, [...(bodies.get(key) ?? []), where]);
  });
}

/* FALSIFIABILITY, because this repo's standing rule is that a detector must be
   able to fail. The whole method is "same declarations, DIFFERENT selectors",
   so the one mistake that would silently kill it is letting anything
   rule-unique into the key — a selector, a source position. If that happened,
   every rule would be its own body, `distinct` would equal `rules`, and the
   output would be a serene zero indistinguishable from a clean tree. So assert
   the inequality rather than trust the key. (Red-proved the other way too: two
   rules with an invented shared body were injected into `badge.css` and the
   repeat count went 8 -> 9 with both selectors named in the output, so this
   walker does detect a new group.) */
if (files === 0 || rules === 0) {
  console.error(`report:css-repeats — walked ${files} file(s) and found ${rules} rule(s). Has src/css moved?`);
  process.exit(1);
}
if (bodies.size === rules) {
  console.error(
    `report:css-repeats — every one of ${rules} rules keyed to a distinct body. ` +
      `That is what a key contaminated with the SELECTOR looks like, not a clean tree.`,
  );
  process.exit(1);
}

const repeats = [...bodies].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);

console.log(
  `css-repeats report — ${files} source file(s) · ${rules} rule(s) with ${MIN_DECLS}+ declarations · ` +
    `${bodies.size} distinct bodies · ${repeats.length} body(ies) appearing more than once`,
);
for (const [key, where] of repeats) {
  const decls = key.split(' | ');
  console.log(`\n  x${where.length}  (${decls.length} declarations)`);
  for (const d of decls) console.log(`        ${d};`);
  for (const w of where) console.log(`     -> ${w}`);
}
console.log(
  `\n  A repeat is NOT automatically a finding. Plain CSS cannot share a rule body without also ` +
    `sharing a selector, so a UTILITY and a component PART that need the same declarations must ` +
    `each carry them. LOOPS.md carries the standing verdicts; what to look at is the DELTA — a new ` +
    `group, or an existing one that grew.`,
);
