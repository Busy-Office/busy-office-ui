/**
 * The one place docs scripts enumerate SOURCE files.
 *
 * `dist-pages.mjs` already owns dist enumeration, and `check:dist-walkers`
 * enforces that nothing re-rolls it. Source had no equivalent, so the first two
 * scripts that needed one each hand-rolled a recursive walk — `check-vendor-names`
 * and `report-reach`, written hours apart **on the same day by the same author**,
 * with different skip lists and different hidden-directory handling.
 *
 * That is the exact failure `paths.mjs` records about `CORE_DIST` ("spelled
 * three different ways across four scripts") and `check-paths.mjs` about
 * REPO_ROOT ("five scripts, three added that same day, by someone who had read
 * paths.mjs while writing a different gate about exactly this"). Caught here by
 * the Standardize sweep at 4/4, which is the mechanism working rather than
 * anyone remembering.
 *
 * The cost of a private copy is not aesthetic: two walks with different skip
 * lists silently disagree about what "the source tree" is, and the scripts that
 * use them report numbers that cannot be compared.
 */
import { readdir, stat } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { REPO_ROOT } from './paths.mjs';

/** Never descend into these — build output and dependencies are not source. */
export const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.astro']);

/**
 * Collect source files under one or more roots.
 *
 * @param {Array<string|{path:string,label?:string}>} roots  repo-relative paths;
 *   a root may be a single FILE (ROADMAP.md) or a directory (.roundtable).
 * @param {object} opts
 * @param {(name:string)=>boolean} opts.keep  predicate on the BASENAME.
 * @param {Set<string>} [opts.skipDirs]       defaults to SKIP_DIRS.
 * @param {boolean} [opts.includeHidden]      descend into dot-directories
 *   (`.roundtable` is source; `.git` is still excluded via skipDirs).
 * @returns {Promise<{files: Array<{abs:string, rel:string, label?:string}>, missing: string[]}>}
 *   `missing` lists roots that are not present in this build context. Callers
 *   must REPORT that rather than skipping quietly — the docs container copies
 *   only packages/ + apps/docs, and a check that passes because its input is
 *   absent is the failure `check:rtl` records.
 */
export async function collectSource(roots, { keep, skipDirs = SKIP_DIRS, includeHidden = true } = {}) {
  const files = [];
  const missing = [];

  const walk = async (dir, label) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (skipDirs.has(e.name)) continue;
        if (!includeHidden && e.name.startsWith('.')) continue;
        await walk(join(dir, e.name), label);
      } else if (keep(e.name)) {
        const abs = join(dir, e.name);
        files.push({ abs, rel: relative(REPO_ROOT, abs), label });
      }
    }
  };

  for (const r of roots) {
    const path = typeof r === 'string' ? r : r.path;
    const label = typeof r === 'string' ? undefined : r.label;
    const abs = join(REPO_ROOT, path);
    let s;
    try {
      s = await stat(abs);
    } catch {
      missing.push(path);
      continue;
    }
    if (s.isDirectory()) await walk(abs, label);
    else if (keep(abs.split('/').pop())) files.push({ abs, rel: path, label });
  }

  return { files, missing };
}

/** Convenience: a `keep` predicate matching any of the given extensions. */
export const byExt = (...exts) => {
  const set = new Set(exts.map((e) => (e.startsWith('.') ? e : `.${e}`)));
  return (name) => set.has(extname(name));
};
