/**
 * Gate: every relative import resolves to a file whose name matches CASE-EXACTLY.
 *
 * macOS (APFS) is case-insensitive, so `./serve-DIST.mjs` happily loads
 * `serve-dist.mjs` and every local gate passes. Linux CI is case-sensitive and
 * fails with ERR_MODULE_NOT_FOUND. That is exactly what happened on 2026-08-18:
 * a bulk rename rewrote eight import specifiers, the whole suite was green
 * locally, and CI broke.
 *
 * This is the one class of bug a developer on macOS CANNOT catch by running the
 * code — the filesystem hides it — so it needs a check that compares strings
 * rather than trusting resolution. Cheap: pure fs, no browser, milliseconds.
 *
 * Deliberately narrow. It does not lint imports, resolve bare specifiers, or
 * follow package exports; it answers one question that the runtime cannot
 * answer here.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, resolve, basename } from 'node:path';
import { REPO_ROOT } from './paths.mjs';

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'versions', 'visual-baselines', 'visual-diffs', '.astro']);
const EXTS = ['.mjs', '.js', '.ts'];

async function* sourceFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* sourceFiles(join(dir, e.name));
    } else if (EXTS.some((x) => e.name.endsWith(x))) {
      yield join(dir, e.name);
    }
  }
}

/** Entries of a directory, cached — one readdir per directory, not per import. */
const dirCache = new Map();
async function entries(dir) {
  if (!dirCache.has(dir)) {
    dirCache.set(dir, readdir(dir).catch(() => []));
  }
  return dirCache.get(dir);
}

const RELATIVE = /(?:^|[\s;])(?:import|export)[^'"]*?from\s+['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)/g;

const failures = [];
let checked = 0;

for await (const file of sourceFiles(REPO_ROOT)) {
  const src = await readFile(file, 'utf8');
  for (const m of src.matchAll(RELATIVE)) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    checked += 1;
    const target = resolve(dirname(file), spec);
    const names = await entries(dirname(target));
    const want = basename(target);
    // TS may import '.js' for a '.ts' source; accept either spelling of the ext.
    const candidates = [want, want.replace(/\.js$/, '.ts'), want.replace(/\.mjs$/, '.ts')];
    if (candidates.some((c) => names.includes(c))) continue;
    // Only report when a case-INSENSITIVE match exists — that is the bug this
    // gate is for. A genuinely missing file is the module resolver's job.
    const ci = names.find((n) => candidates.some((c) => n.toLowerCase() === c.toLowerCase()));
    if (ci) {
      failures.push(`${file.replace(REPO_ROOT + '/', '')}\n     imports '${spec}' but the file on disk is '${ci}'`);
    }
  }
}

if (failures.length) {
  console.error(`import-case check FAILED — ${failures.length} import(s) differ from the filename only by case:`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('  macOS resolves these; Linux CI will not.');
  process.exit(1);
}
console.log(`import-case check passed — ${checked} relative import(s) resolve case-exactly`);
