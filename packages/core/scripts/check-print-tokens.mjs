#!/usr/bin/env node
/**
 * Gate: no theme colour token inside a `@media print` block.
 *
 * @heuristic — the verdict rests on a POSITION (is this declaration inside a
 * block whose media query list selects `print`?), which the meta-gate's own
 * definition names as the heuristic kind. Ships `--self-test`. See "WHY
 * HEURISTIC AND NOT @exact" below — the sibling CSS-invariant gate
 * (`check-sticky-layers.mjs`) is tagged `@exact` and the divergence is
 * deliberate rather than an oversight.
 *
 * WHY. `--bo-color-*` tokens carry the reader's THEME. Paper does not.
 * Measured under print emulation on the built site (roadmap 298.1, Slice 316):
 * `--bo-color-text-muted` resolves to `rgb(156, 163, 175)` when the page is in
 * the dark theme, which is **2.54:1 on white paper** — below AA for body text.
 * The literal it replaced, `#555`, reads **7.46:1 in both themes**.
 *
 * So `print/index.css` carries a prose warning at the `#555` site — *"Every
 * colour inside `@media print` in the shipped CSS is a literal for this reason
 * (11 of 11, 6 files); 'tidying' one into a token is a contrast regression, and
 * nothing gates it yet."* This is the gate that sentence was waiting for, and
 * the comment's count is now derived from a run rather than hand-typed.
 *
 * THE BASE RATE WAS MEASURED BEFORE THIS SHIPPED, per roadmap 94.11 — a
 * detector whose predicate is already true of everything cannot fail, and looks
 * exactly like a passing gate while doing so. Here the predicate is uniformly
 * **false**: colour declarations inside `@media print` across 6 files, **0** of
 * them a token, on 2026-09-07 and again on re-run. Uniformly false is the
 * healthy direction — the gate is green today and goes red on the one
 * regression it exists for. Uniformly TRUE was 94.11's refused gate.
 *
 * THE DENOMINATOR IS 14, AND ROADMAP 316.1 SAYS 11. Both are right, of
 * different populations, and the difference is stated here rather than left for
 * a grill — Slice 336's three defects were every one of them a number reading a
 * different population than the noun beside it named. 316.1 counted a narrow
 * property list (`color|background|background-color|border-color|fill|stroke|
 * outline-color`) and gets 11. `printColourDecls` below adds the `border`
 * shorthand and friends and gets 14, the three extras being
 * `badge.css:115`, `data-table.css:815` and `stepper.css:95`, all `border:`.
 * The wider list is the right denominator for THIS gate, because
 * `border: 1px solid var(--bo-color-border)` inside `@media print` is exactly
 * the regression and the narrow list does not see it. **Neither number is the
 * gate's verdict** — the verdict is the 0, which is computed from the token
 * predicate and is identical under both lists.
 *
 * THE PREDICATE IS "references `var(--bo-color-*)`", NOT a property allowlist.
 * The first draft matched a list of colour-bearing properties
 * (`color|background|border-color|fill|…`), and that list is an escape hatch
 * with a live example one hop away: `approval-workflow.css` sets
 * `--bo-timeline-marker-fg: var(--bo-color-text-muted)`, a custom property no
 * such list names. Written inside `@media print` it would be the identical
 * regression and the identical 2.54:1, and the allowlist would have passed it.
 * `--bo-color-*` is a colour family by definition, so keying on the token
 * reference rather than on the property name loses nothing and closes that door.
 *
 * NO EXEMPTION LIST, and that is measured rather than assumed. Roadmap 316.1
 * anticipated needing one for "a fill whose colour IS content"
 * (`print-color-adjust: exact` markers). Those rules do not restate a colour
 * inside `@media print` at all — checked, all three of them: `.bo-icon`
 * (icon.css), `.bo-timeline__marker, .bo-stepper__marker` and
 * `.bo-u-print-exact` (print/index.css) declare `print-color-adjust: exact` and
 * nothing else. That is structural, not coincidence: the whole point of
 * `print-color-adjust: exact` is to preserve the colour the ordinary cascade
 * already gave the element, so an exact-fill rule has no reason to name a
 * colour a second time. The anticipated exemption is therefore not needed, and
 * shipping an empty exemption map "just in case" would be the ceremony this
 * repo refuses. If a real case ever arrives, this gate goes red and the
 * exemption gets argued deliberately — which is the right way for that decision
 * to be made, rather than silently exercised.
 *
 * WHAT THIS GATE DOES NOT SEE, said plainly rather than left for a later grill
 * to find. It catches a token RESTATED inside `@media print`. It cannot catch a
 * token that reaches paper through the ORDINARY CASCADE, and the mechanism is
 * specificity, not any print property:
 *
 *   reset/index.css:96   @media print { body { background: #fff; color: #000 } }
 *
 * That covers everything which INHERITS its colour. It does not cover an
 * element that sets its own colour, because `body { color: #000 }` loses to any
 * more specific rule.
 *
 * THIS PARAGRAPH USED TO CALL THAT GAP "NARROW" AND TO NAME
 * `.bo-timeline__marker` AS ITS EXAMPLE. Roadmap 338.1 measured both and BOTH
 * WERE WRONG, in opposite directions (Slice 369, 2026-09-09):
 *
 *  - **The example is not in the gap.** `print/index.css` gives
 *    `.bo-timeline__marker, .bo-stepper__marker { print-color-adjust: exact }`,
 *    so the disc BACKGROUND is kept on paper and the glyph never meets white.
 *    Measured under print emulation, the worst of eight readings across both
 *    themes is `pending`, rgb(156,163,175) on rgb(38,42,51) = **5.66:1** —
 *    above AA. The 2.54:1 figure is that token against WHITE, which is not the
 *    backdrop it has. The NO EXEMPTION LIST paragraph above already named that
 *    exact rule; this paragraph then reasoned as if it were not there.
 *  - **The gap itself is framework-wide, not narrow.** Over all 128 built
 *    pages in the dark theme, 19,511 of 26,817 text fills actually painted to
 *    PDF are below 4.5:1 against white paper, on 125 of 128 pages.
 *
 * AND THE OBVIOUS INSTRUMENT FOR IT IS THE WRONG ONE — the part worth carrying
 * forward. `print-color-adjust: economy` (the default) does not merely drop
 * backgrounds: it DARKENS light text when it drops them. rgb(249,250,251) is
 * painted rgb(166,166,167), so the real ratio is 2.43:1 and not the computed
 * 1.05:1; and `--bo-color-accent` rgb(45,212,191) is painted rgb(27,128,115),
 * which PASSES at 4.79:1 while its computed value reads 1.86:1. A ratio read
 * off computed style is therefore an input to a system that rewrites it, and a
 * gate built on one would accuse correct code. Anything that publishes a
 * printed RATIO must read the PDF (`page.pdf({ printBackground: false })`, then
 * parse the fill operators); computed style is still fine for the structural
 * question of whether an element's own colour survives the print reset.
 *
 * Widening this gate is roadmap 369.1 and is an OWNER CALL, because the only
 * proportionate fix is re-pointing the theme tokens inside one `@media print`
 * block — which is a deliberate exception to this gate's own rule.
 *
 * WHY HEURISTIC AND NOT @exact. `check-sticky-layers.mjs` brace-matches rule
 * blocks and is tagged `@exact`, so the precedent pointed the other way. The
 * divergence is one step: deciding whether a media query list SELECTS print is
 * recognition, and it can be wrong in a direction that accuses correct code —
 * `@media not print` contains the word `print` and means the opposite. The
 * self-test carries that case, plus `only print`, a comma list, and `print` as
 * a substring of a feature name, because a detector nobody has watched fail is
 * one nobody has thought about.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { srcCssFiles, srcCssRoot as CSS } from './src-css-files.mjs';

// `fileURLToPath`, not `new URL(...).pathname` — the sibling gates' idiom, and
// the one that does not hand back a leading-slash drive letter off-Linux.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** A value that reads a theme colour token. The whole predicate. */
const THEME_COLOUR = /var\(\s*--bo-color-/;

/**
 * Does this `@media` prelude select the print medium?
 *
 * Feature blocks are removed first: `(min-resolution: 2dppx)` cannot contain a
 * media TYPE, and a feature name that merely contains the substring — there is
 * no such standard feature today, but `print-color-adjust` is one property name
 * away — must not count. What survives is the query's modifier + type, so
 * `not print` is correctly read as excluding print rather than selecting it.
 */
export function selectsPrint(params) {
  return params.split(',').some((query) => {
    const words = query
      .replace(/\([^)]*\)/g, ' ')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (words[0] === 'not') return false;
    const type = words[0] === 'only' ? words[1] : words[0];
    return type === 'print';
  });
}

/**
 * Every declaration inside a print-selecting `@media` block whose value reads a
 * theme colour token. Comments are postcss nodes rather than text, so nothing
 * here can trip on prose — the failure `check:rtl` and this gate's own sibling
 * both recorded before they stripped comments.
 */
export function printTokenOffenders(css, label = '<input>') {
  const found = [];
  const root = postcss.parse(css, { from: label });
  root.walkAtRules('media', (atRule) => {
    if (!selectsPrint(atRule.params)) return;
    atRule.walkDecls((decl) => {
      if (!THEME_COLOUR.test(decl.value)) return;
      found.push({
        line: decl.source?.start?.line ?? 0,
        prop: decl.prop,
        value: decl.value,
        media: atRule.params.trim(),
      });
    });
  });
  return found;
}

/** Every declaration inside a print-selecting block, token or literal — the
 *  denominator the pass line reports, so a run that scanned nothing cannot
 *  read as a clean sweep. */
export function printColourDecls(css, label = '<input>') {
  const COLOURISH = /^(color|background|background-color|border(-[a-z]+)?-color|border|outline-color|fill|stroke|box-shadow|text-decoration-color)$/;
  const found = [];
  const root = postcss.parse(css, { from: label });
  root.walkAtRules('media', (atRule) => {
    if (!selectsPrint(atRule.params)) return;
    atRule.walkDecls((decl) => {
      if (COLOURISH.test(decl.prop) || THEME_COLOUR.test(decl.value)) {
        found.push({ line: decl.source?.start?.line ?? 0, prop: decl.prop, value: decl.value });
      }
    });
  });
  return found;
}

/* The `--self-test` branch sits ABOVE the file walk on purpose (roadmap 315.1):
   `check-ci-ignores.mjs` shipped a real, correct self-test below an early
   return and ran 0 of its 18 cases while exiting 0 — indistinguishable, to a
   grep and to an exit code alike, from 18 passing ones.

   The block is hand-rolled rather than importing the docs gates' shared
   `selfTest` helper, for check-markup.mjs's stated reason: this is the core
   package, and an import from `apps/docs/scripts` does not resolve from it. */
if (process.argv.includes('--self-test')) {
  const at = (body) => `@layer bo-components {\n${body}\n}\n`;
  const inPrint = (decls) => at(`  @media print {\n    .x {\n${decls}\n    }\n  }`);

  const cases = [
    ['a token inside @media print is caught', printTokenOffenders(inPrint('      color: var(--bo-color-text-muted);')).length, 1],
    ['a literal inside @media print is not', printTokenOffenders(inPrint('      color: #555;')).length, 0],
    [
      'a custom property assigned a token is caught',
      printTokenOffenders(inPrint('      --bo-timeline-marker-fg: var(--bo-color-text-muted);')).length,
      1,
    ],
    [
      'a token OUTSIDE any print block is not',
      printTokenOffenders(at('  .x {\n    color: var(--bo-color-text-muted);\n  }')).length,
      0,
    ],
    [
      'a token under @media screen is not',
      printTokenOffenders(at('  @media screen {\n    .x { color: var(--bo-color-text-muted); }\n  }')).length,
      0,
    ],
    [
      '`@media not print` is NOT read as selecting print',
      printTokenOffenders(at('  @media not print {\n    .x { color: var(--bo-color-text-muted); }\n  }')).length,
      0,
    ],
    [
      '`@media only print` IS read as selecting print',
      printTokenOffenders(at('  @media only print {\n    .x { color: var(--bo-color-text-muted); }\n  }')).length,
      1,
    ],
    [
      '`@media screen, print` IS read as selecting print',
      printTokenOffenders(at('  @media screen, print {\n    .x { color: var(--bo-color-text-muted); }\n  }')).length,
      1,
    ],
    [
      '`@media print and (min-width: 5in)` IS read as selecting print',
      printTokenOffenders(at('  @media print and (min-width: 5in) {\n    .x { color: var(--bo-color-text-muted); }\n  }')).length,
      1,
    ],
    [
      'a token named only in a COMMENT inside @media print is not',
      printTokenOffenders(at('  @media print {\n    /* never var(--bo-color-text-muted) here */\n    .x { color: #555; }\n  }')).length,
      0,
    ],
    [
      'a NON-colour token inside @media print is not (only --bo-color-* is a theme colour)',
      printTokenOffenders(inPrint('      margin: var(--bo-space-2);')).length,
      0,
    ],
    [
      'a token nested deeper inside the print block is still caught',
      printTokenOffenders(at('  @media print {\n    .a {\n      .b { color: var(--bo-color-text-muted); }\n    }\n  }')).length,
      1,
    ],
  ];

  let ok = true;
  for (const [label, got, want] of cases) {
    const pass = got === want;
    ok &&= pass;
    console.log(`self-test: ${String(label).padEnd(64)} ${got} (want ${want}) ${pass ? 'ok' : 'WRONG'}`);
  }
  if (!ok) {
    console.error('check-print-tokens --self-test FAILED — the detector cannot tell these apart,');
    console.error('  which means it would pass everything, which is the defect --self-test exists to rule out.');
    process.exit(1);
  }
  // Derived from the list that just ran, never a literal — roadmap 315.3's
  // marker contract: a count is the one thing an unreachable branch cannot print.
  console.log(
    `check-print-tokens --self-test passed — ${cases.length} cases: it separates a theme token ` +
      'inside `@media print` from a literal, from a token outside print, and from `@media not print`',
  );
  process.exit(0);
}

const offenders = [];
let files = 0;
let colourDecls = 0;
let printFiles = 0;

for await (const file of srcCssFiles(CSS)) {
  const css = await readFile(file, 'utf8');
  files += 1;
  const here = printColourDecls(css, file);
  if (here.length) printFiles += 1;
  colourDecls += here.length;
  for (const o of printTokenOffenders(css, file)) offenders.push({ ...o, file: relative(ROOT, file) });
}

// A gate that examined nothing has not passed — it failed to run.
if (files === 0) {
  console.error('print-tokens check FAILED — no stylesheets found under src/css, so this gate verified nothing.');
  process.exit(1);
}

if (offenders.length) {
  console.error(`print-tokens check FAILED — ${offenders.length} theme colour token(s) inside \`@media print\`:`);
  for (const o of offenders) {
    console.error(`  ${o.file}:${o.line}  ${o.prop}: ${o.value}   (inside \`@media ${o.media}\`)`);
  }
  console.error(
    '    A `--bo-color-*` token carries the reader\'s THEME, and paper does not:\n' +
      '    --bo-color-text-muted resolves to rgb(156, 163, 175) in the dark theme,\n' +
      '    which is 2.54:1 on white paper — below AA (roadmap 298.1). Use a literal\n' +
      '    that reads in both themes; #555 is 7.46:1. See print/index.css.',
  );
  process.exit(1);
}

console.log(
  `print-tokens check passed — ${colourDecls} colour-bearing declaration(s) inside \`@media print\` ` +
    `across ${printFiles} of ${files} stylesheet(s), 0 of them referencing a \`--bo-color-*\` theme token ` +
    `(the count is the wide property list, incl. the \`border\` shorthand; 316.1's narrow list reads 11 of the same 14)`,
);
