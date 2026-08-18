#!/usr/bin/env node
/**
 * Gate: the workflow the docs tell consumers to run is actually in the tarball.
 *
 * `/getting-started/installation` now instructs adopters to wire
 * `bo-check-markup dist` into their CI (roadmap 33.2). That command works only
 * if THREE things survive packing, and nothing checked any of them:
 *
 *   1. the `bin` entry is declared,
 *   2. the script it points at is included by `files`,
 *   3. `dist/api.json` is included too — the script reads it at runtime,
 *      relative to its own location, and without it every consumer's first run
 *      dies with ENOENT.
 *
 * `files` is a hand-maintained allow-list. Narrowing it is a normal-looking,
 * well-intentioned edit ("ship less"), it breaks nothing in this repo — where
 * everything is on disk regardless — and it would silently turn a documented
 * instruction into a broken one for everyone downstream. That is exactly the
 * shape of failure this project keeps finding: green locally, wrong where it
 * matters, invisible until a user hits it.
 *
 * Asks npm what it would actually pack rather than re-implementing the ignore
 * rules, so it cannot disagree with the real tarball.
 */
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(join(pkgRoot, 'package.json'), 'utf8'));

const packed = new Set(
  JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: pkgRoot, encoding: 'utf8' }))[0]
    .files.map((f) => f.path),
);

const failures = [];
const bins = Object.entries(pkg.bin ?? {});
if (!bins.length) failures.push('package.json declares no `bin` — `npx bo-check-markup` cannot work');

for (const [name, target] of bins) {
  const rel = normalize(target).replace(/^\.\//, '');
  if (!packed.has(rel)) {
    failures.push(`bin "${name}" points at ${rel}, which is NOT in the packed tarball (check "files")`);
    continue;
  }
  /* What the bin needs at RUNTIME, read out of the script rather than
     hardcoded here — a second list would drift from the first. */
  const src = await readFile(join(pkgRoot, rel), 'utf8');
  for (const m of src.matchAll(/join\(here,\s*'\.\.',\s*([^)]+)\)/g)) {
    const parts = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    if (!parts.length) continue;
    const needed = parts.join('/');
    if (!packed.has(needed)) {
      failures.push(`bin "${name}" reads ${needed} at runtime, which is NOT in the packed tarball`);
    }
  }
}

if (failures.length) {
  console.error(`package check FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('  These break `npx bo-check-markup` for consumers while every local gate stays green.');
  process.exit(1);
}
console.log(
  `package check passed — ${bins.length} bin(s) and their runtime inputs are in the tarball (${packed.size} files)`,
);
