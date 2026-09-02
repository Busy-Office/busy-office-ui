#!/usr/bin/env node
/**
 * Gate: every BLOCK-AXIS sticky rule in shipped CSS declares its layer.
 *
 * @exact — parses declarations out of rule blocks and checks set membership.
 * No judgement about what a rule "probably" means.
 *
 * WHY. A sticky surface with `z-index: auto` loses to anything carrying a
 * number, and the loss is invisible until two sticky things happen to meet.
 * This has now shipped twice:
 *
 *  - `object-page` used a bare `z-index: 2` and lost outright the moment a
 *    nested table went sticky (roadmap 108, 2026-08-22). That is what produced
 *    the `--bo-z-*` scale.
 *  - `.bo-form-actions` never joined the scale, so a sticky table header
 *    (1100) painted straight through the action bar and sliced "Submit for
 *    approval" in half (owner report, 2026-08-26).
 *
 * Twice is a class, not an incident, and the second one is the argument for a
 * gate rather than a third fix: the framework should GUARANTEE the stacking so
 * that someone building a screen never has to pick a number. That is the whole
 * point of shipping a scale.
 *
 * BLOCK AXIS ONLY, and the distinction is load-bearing. `.bo-data-table__toolbar`
 * and `__footer` are `position: sticky; inset-inline-start: 0` — they hold still
 * horizontally while a wide table scrolls sideways. They never overlay
 * vertically-scrolled page content and never contend with page chrome, so
 * demanding a layer of them would be ceremony. Requiring it of everything was
 * measured first: 8 sticky rules, 5 declared, 3 did not — and all three turned
 * out to be legitimate.
 *
 * COMMENT-BLIND, because the first run was not. `button.css` documents docking
 * in prose — "Docking is the consumer's one line (position: sticky;
 * inset-block-end: 0)" — and the detector counted the sentence as a rule. This
 * repo has recorded the same bug in `check:rtl`, which matched `left:` inside
 * its own explanation. Strip comments before parsing, every time.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { srcCssFiles, srcCssRoot as CSS } from './src-css-files.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every --bo-z-* token the scale defines. A layer must be one of these. */
const scale = new Set(
  [...(await readFile(join(CSS, 'tokens', 'z-index.css'), 'utf8')).matchAll(/(--bo-z-[a-z-]+):/g)].map((m) => m[1]),
);
if (scale.size === 0) {
  console.error('check:sticky-layers: no --bo-z-* tokens found — did tokens/z-index.css move?');
  process.exit(1);
}

const BLOCK_INSET = /(?:inset-block-(?:start|end)|top|bottom)\s*:/;
const failures = [];
let checked = 0;
let inlineOnly = 0;

for await (const file of srcCssFiles(CSS)) {
  const raw = await readFile(file, 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length)); // keep offsets
  for (const m of css.matchAll(/position:\s*sticky/g)) {
    const open = css.lastIndexOf('{', m.index);
    let depth = 1;
    let i = open + 1;
    while (i < css.length && depth) {
      if (css[i] === '{') depth += 1;
      else if (css[i] === '}') depth -= 1;
      i += 1;
    }
    const block = css.slice(open, i);
    const before = css.slice(0, open);
    const selector = (before.slice(before.lastIndexOf('}') + 1).trim().split('\n').pop() ?? '').trim();

    if (!BLOCK_INSET.test(block)) {
      inlineOnly += 1;
      continue; // inline-axis sticky never contends with page chrome
    }
    checked += 1;
    const z = block.match(/z-index:\s*var\((--bo-z-[a-z-]+)\)/);
    if (!z) {
      failures.push(
        `${relative(ROOT, file)}: \`${selector}\` sticks in the block axis with no declared layer.\n` +
          `    A sticky surface without a z-index loses to anything carrying one — silently, ` +
          `until two sticky things meet. Pick from: ${[...scale].join(', ')}.`,
      );
    } else if (!scale.has(z[1])) {
      failures.push(`${relative(ROOT, file)}: \`${selector}\` uses ${z[1]}, which is not in the scale.`);
    }
  }
}

if (failures.length) {
  console.error(`sticky-layers check FAILED — ${failures.length} sticky rule(s) declare no layer:`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `sticky-layers check passed — ${checked} block-axis sticky rule(s) declare a layer ` +
    `from the ${scale.size}-step scale (${inlineOnly} inline-axis rule(s) exempt by design)`,
);
