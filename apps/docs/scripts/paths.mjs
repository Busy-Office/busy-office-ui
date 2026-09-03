/**
 * Where the docs live on disk. One answer, imported — not re-derived per script.
 *
 * Thirteen scripts each worked this out for themselves, in three spellings, and
 * one of the three was WRONG rather than merely different (Standardize sweep,
 * 2026-08-18):
 *
 *   join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')   correct, 7x
 *   join(docsRoot, 'dist')                                        correct, 3x
 *   new URL('../dist', import.meta.url).pathname                  BROKEN,  3x
 *
 * `URL.pathname` is percent-ENCODED and not a filesystem path. On a checkout
 * whose path contains a space — `/Users/some user/…`, which is ordinary on
 * macOS and Windows — it yields `/Users/some%20user/…`, and every `readFile`
 * and `readdir` against it fails with ENOENT. `fileURLToPath()` is the API that
 * decodes it, and it is also the one that handles Windows drive letters.
 *
 * Measured, not assumed:
 *   new URL('../dist', 'file:///Users/some%20user/a/scripts/x.mjs').pathname
 *     -> /Users/some user/a/dist   ... as %20, unusable
 *   fileURLToPath(same)
 *     -> /Users/some user/a/dist   ... correct
 *
 * It never surfaced because CI checks out to a path with no spaces — the same
 * blind spot the CI-reach rule in CLAUDE.md describes, in a new form.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** apps/docs */
export const DOCS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** apps/docs/dist — the built site every browser gate serves and judges. */
export const DIST = join(DOCS_ROOT, 'dist');

/** the repository root */
export const REPO_ROOT = join(DOCS_ROOT, '..', '..');

/** packages/core/dist — the generated core artifacts (api.json,
 *  behaviors.json, built CSS). Was spelled three different ways across four
 *  scripts before this export (2026-08-21 sweep). */
export const CORE_DIST = join(REPO_ROOT, 'packages', 'core', 'dist');

/**
 * Where the built docs are PUBLISHED. One answer, imported.
 *
 * This was spelled out twice before 249.2 needed a third: `gen-llms.mjs` held
 * `const site = 'https://busy-office.github.io/busy-office-ui'` and
 * `check-published.mjs` held the same string with a trailing slash. The
 * sitemap needs it too, and a third hand-copy is how the DOCS_ROOT list above
 * started. Split in two because the two halves answer different questions and
 * `astro.config.mjs` needs them apart: Astro's `site` is the ORIGIN, and it
 * joins `base` on itself, so handing it the full published root would emit
 * `…/busy-office-ui/busy-office-ui/…` in the sitemap.
 */
export const SITE_ORIGIN = 'https://busy-office.github.io';

/** The published docs root — SITE_ORIGIN + the Pages base. No trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}/busy-office-ui`;

/**
 * Directories that are NOT our source: generated output, vendored code, and
 * frozen snapshots.
 *
 * `check-imports` and `check-floor` each hand-copied this same seven-entry list
 * under a different variable name (Standardize sweep, 2026-08-19). That is one
 * DECISION — "which files does this repo police?" — stored twice, and the
 * failure mode is silent: add a generated directory, update one gate, and the
 * two disagree about scope with nothing to say so. The walk itself is not worth
 * sharing (every other walker here has a different root and filter); the list
 * is.
 */
export const SOURCE_SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.astro',
  'dist',
  'versions',
  'visual-baselines',
  'visual-diffs',
]);
