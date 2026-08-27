#!/usr/bin/env node
/**
 * Snapshot a real ERP screen into the template.
 *
 * The scaffold's first screen must be a screen that WORKS, and the only
 * screens this project trusts are the ones the ERP suite gates on every
 * commit — 28 of them, built from shipped CSS with zero of their own, axe-clean
 * at two widths. Hand-writing a starter screen would make the one page a
 * newcomer sees the one page nobody checks.
 *
 * So it is copied, not authored, and copied from the UNPREFIXED build so the
 * links in it are ordinary app paths rather than the docs site's (the trap
 * caught in 147.2).
 * ── Three derived artefacts, one freshness gate (roadmap 155, Standardize) ──
 *
 * This script generates `template/screen.html`, and two more things used to be
 * maintained by hand beside it: the framework version the scaffold pins, and a
 * NOTICE copied from the core package. All three are DERIVED, all three were
 * committed, and **CI never ran this script** — so any of them could drift from
 * its source with nothing to catch it.
 *
 * The pin was the sharpest of the three, because the gate that looks like it
 * covers it steps around it: `check:quickstart` really does run the scaffolder
 * and boot the generated project, but installs with `npm i --no-save <local
 * tarball>`, which resolves nothing from the registry — so the generated
 * `dependencies` entry is never exercised. A passing gate, structurally unable
 * to notice a stale pin.
 *
 * So this script now owns all three, and takes `--check`: same derivation, no
 * writes, non-zero exit on any difference. That is the shape
 * `generate-scales.mjs` and `stamp-readme.mjs` already use, and it is what CI
 * runs — the point being that the check re-derives from source rather than
 * comparing the committed files to each other.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { screenFragment } from '../../examples/erp-suite/fragment.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SUITE = join(HERE, '..', '..', 'examples', 'erp-suite');

/* A work-list: the commonest ERP screen, and the one an AI reaches for a
   dashboard instead of (external review §28). If the starter teaches one
   shape, this is the shape. */
const SCREEN = 'p2p/purchase-orders';
const CORE = join(HERE, '..', 'core');
const CHECK = process.argv.includes('--check');

execFileSync(process.execPath, [join(SUITE, 'build.mjs')], { cwd: SUITE, stdio: 'pipe' });
const html = await readFile(join(SUITE, 'dist', `${SCREEN}.html`), 'utf8');
const fragment = screenFragment(html);
if (!fragment) {
  console.error(`create-ui build: no <main> in ${SCREEN} — did the suite layout change?`);
  process.exit(1);
}

/* The pin the scaffolded project gets. Caret on the CURRENT core minor: a
   scaffold that pinned a version older than the framework it is demonstrating
   would install CSS the template screen does not match. */
const coreVersion = JSON.parse(await readFile(join(CORE, 'package.json'), 'utf8')).version;
const pin = `^${coreVersion}`;

/* The scaffolded project pulls core's CSS, so it redistributes whatever that
   CSS embeds — the notices belong with it. Copied, never hand-maintained: the
   two files were byte-identical and nothing kept them so. */
const notice = await readFile(join(CORE, 'NOTICE'), 'utf8');

const artefacts = [
  [join(HERE, 'template', 'screen.html'), fragment, `template screen (from ${SCREEN})`],
  [join(HERE, 'framework.json'), JSON.stringify({ dependency: pin }, null, 2) + '\n', `framework pin (${pin}, from @busy-office/ui)`],
  [join(HERE, 'NOTICE'), notice, 'NOTICE (from packages/core)'],
];

let stale = 0;
for (const [file, want, label] of artefacts) {
  if (CHECK) {
    const have = await readFile(file, 'utf8').catch(() => null);
    if (have !== want) {
      stale += 1;
      console.error(`  ✗ ${label} — ${have === null ? 'missing' : 'differs from its source'}: ${file}`);
    }
  } else {
    await writeFile(file, want);
    console.log(`create-ui: wrote ${label}`);
  }
}

if (CHECK) {
  if (stale) {
    console.error(`\ncreate-ui freshness check FAILED — ${stale} derived artefact(s) are stale.`);
    console.error('Run `npm run build -w @busy-office/create-ui` and commit the result.');
    process.exit(1);
  }
  console.log(`create-ui freshness check passed — ${artefacts.length} derived artefact(s) match their sources (pin ${pin})`);
}
