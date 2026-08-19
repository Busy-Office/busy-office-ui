#!/usr/bin/env node
//
// @exact — enumerates opacity declarations in the shipped CSS and looks each up
// in a registry. Exempt from --self-test: it compares a parsed declaration
// against a list, with no judgement about what something IS.
/**
 * Gate: every state that DIMS shipped content has been decided about.
 *
 * WHY THIS EXISTS. `.bo-data-table[data-loading="true"]` shipped with
 * `opacity: 0.6` in the **initial commit** and survived seven days, 43 slices
 * and 31 axe sweeps before anyone noticed it composited header text to 3.28:1
 * against a 4.5:1 requirement (roadmap 43.1). It reached the published 0.1.1.
 *
 * Nothing was looking. `check:contrast` computes token PAIRS and cannot model
 * opacity, so a composited value was never in scope; axe only fired once a
 * SECOND dimmed table appeared on another page. The suite was organised around
 * properties rather than around what a STATE renders.
 *
 * So: every `opacity` below 1 in the shipped CSS must be registered here with a
 * decision. A new dimming state fails the build until someone says which it is:
 *
 *   aa      — the user is expected to READ this. Composited contrast must meet
 *             4.5:1, asserted live by an executable claim.
 *   exempt  — with the reason, and a WCAG citation where one applies.
 *
 * The distinction that matters, and the one that made 43.1 a bug: WCAG 1.4.3
 * exempts "inactive user interface components". A *disabled* control is
 * inactive. A table marked `aria-busy` is NOT — it is being updated, and the
 * user is expected to keep reading it.
 *
 * Keyframes are skipped: an animation that passes through `opacity: 0` is a
 * transition, not a resting state.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '..', 'dist', 'css');

/** Selector fragment -> decision. Matched as a substring of the rule selector. */
const REGISTRY = [
  {
    match: 'data-loading',
    decision: 'aa',
    why: 'A table mid-swap is aria-busy, NOT inactive — the user keeps reading it, so 1.4.3 applies in full. Asserted live in both themes by check:claims.',
  },
  {
    match: 'aria-busy',
    decision: 'aa',
    why: 'Same state, the HTMX-set spelling of it.',
  },
  {
    match: ':disabled',
    decision: 'exempt',
    why: 'WCAG 1.4.3 exempts text that is part of an INACTIVE user interface component. Measured: a disabled primary button drops 5.47:1 -> 2.15:1 composited, and is compliant by that exemption rather than by luck.',
  },
  {
    match: '[disabled]',
    decision: 'exempt',
    why: 'As :disabled — the attribute spelling.',
  },
  {
    match: '[aria-disabled="true"]',
    decision: 'exempt',
    why: 'As :disabled — the ARIA spelling for elements that cannot take the real attribute.',
  },
  {
    match: 'htmx-swapping',
    decision: 'exempt',
    why: 'Transient: HTMX sets it for the duration of a swap while the content is being REMOVED. Not a resting state anyone reads.',
  },
  {
    match: 'htmx-indicator',
    decision: 'exempt',
    why: 'A spinner toggled between 0 and 1. It carries no text to read.',
  },
];

const files = ['index.css', 'htmx.css'];
const findings = [];
let dimming = 0;

for (const name of files) {
  let css;
  try {
    css = await readFile(join(DIST, name), 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') continue;
    throw err;
  }
  postcss.parse(css).walkDecls('opacity', (decl) => {
    /* Any opacity that is not exactly 1 counts, INCLUDING a var().
       The first version used parseFloat and silently skipped
       `opacity: var(--bo-state-disabled-opacity)` — NaN — which is every
       disabled control in the framework. A gate written to catch the states
       nothing was measuring managed to not measure four of them. */
    const raw = decl.value.trim();
    if (raw === '1') return;
    const literal = Number.parseFloat(raw);
    const value = Number.isFinite(literal) ? literal : raw;
    if (typeof value === 'number' && value >= 1) return;
    // An animation passing through 0 is a transition, not a resting state.
    let node = decl.parent;
    while (node) {
      if (node.type === 'atrule' && /keyframes/.test(node.name)) return;
      node = node.parent;
    }
    dimming += 1;
    const selector = decl.parent.selector ?? '(unknown)';
    const hit = REGISTRY.find((r) => selector.includes(r.match));
    if (!hit) {
      findings.push(
        `${name}: ${selector}\n     dims content to opacity ${value} and is not registered.` +
          '\n     Decide: is the user expected to READ this (then it must meet 4.5:1 composited),' +
          '\n     or is it inactive/transient (then say so, with the reason)?',
      );
    }
  });
}

if (!dimming) {
  console.error('composited check FAILED — found no opacity rules at all in the shipped CSS.');
  console.error('  The framework ships dimming states; finding none means this gate is looking in the wrong place.');
  process.exit(1);
}

if (findings.length) {
  console.error(`composited check FAILED — ${findings.length} unregistered dimming state(s):`);
  for (const f of findings) console.error('  ' + f);
  console.error('  Register it in scripts/check-composited.mjs. opacity composites TEXT as well as');
  console.error('  background, which is how a 3.28:1 header shipped in the initial commit.');
  process.exit(1);
}

const aa = REGISTRY.filter((r) => r.decision === 'aa').length;
console.log(
  `composited check passed — ${dimming} dimming declaration(s), all registered ` +
    `(${aa} must meet AA and are claim-asserted, ${REGISTRY.length - aa} exempt with a stated reason)`,
);
