/**
 * Shared walker for the SHIPPED stylesheets — the tree that CSS-invariant
 * gates assert against.
 *
 * check-rtl.mjs and check-motion.mjs had byte-identical copies of this
 * generator, differing only in comment wording (Standardize sweep,
 * 2026-08-17). Two gates asserting invariants over the same tree must agree
 * on what "the shipped CSS" means, or one of them silently stops covering a
 * file the other checks.
 *
 * Deliberately NOT used by check-contrast.mjs or generate-scales.mjs: those
 * walk different trees with different filters, and folding four different
 * rules behind one options bag would be a worse abstraction than two honest
 * copies.
 */
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const distCssRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'css');

/** Every non-minified stylesheet under dist/css, recursively.
 *  .min.css is the same CSS — scanning both double-counts every finding. */
export async function* distCssFiles(dir = distCssRoot) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* distCssFiles(p);
    else if (e.name.endsWith('.css') && !e.name.endsWith('.min.css')) yield p;
  }
}
