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
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const SUITE = join(HERE, '..', '..', 'examples', 'erp-suite');

/* A work-list: the commonest ERP screen, and the one an AI reaches for a
   dashboard instead of (external review §28). If the starter teaches one
   shape, this is the shape. */
const SCREEN = 'p2p/purchase-orders';

execFileSync(process.execPath, [join(SUITE, 'build.mjs')], { cwd: SUITE, stdio: 'pipe' });
const html = await readFile(join(SUITE, 'dist', `${SCREEN}.html`), 'utf8');
const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
if (!main) {
  console.error(`create-ui build: no <main> in ${SCREEN} — did the suite layout change?`);
  process.exit(1);
}
const lines = main.replace(/^\n+|\s+$/g, '').split('\n');
const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
await writeFile(join(HERE, 'template', 'screen.html'), lines.map((l) => l.slice(pad)).join('\n') + '\n');
console.log(`create-ui: template screen snapshotted from ${SCREEN}`);
