#!/usr/bin/env node
/**
 * Release gate: every package a release ships must be publishable, checked
 * BEFORE anything is published.
 *
 * @exact — reads the version list the registry serves and asks whether this
 *   package's version is in it. Membership on a fetched list; no recognition,
 *   no position, no judgement. Exempt from --self-test.
 *
 * WHY. `publish.yml` used to publish core only, so `npm publish` was the first
 * and only thing that ever looked at a version — and it looks at ONE package,
 * at the END of the run. Two consequences, both found while wiring the
 * scaffolder into the release (roadmap 185.1):
 *
 *   1. A release that ships two packages can half-publish. npm's own duplicate
 *      -version error (E403) arrives after the first package is already live,
 *      and a release cannot be un-published.
 *   2. `@busy-office/create-ui`'s template pin is DERIVED from core's version
 *      (`packages/create-ui/build.mjs` writes `framework.json` as
 *      `^<core version>`, and CI gates that derivation). So a core release
 *      necessarily changes create-ui's content. If create-ui's own version was
 *      not bumped with it, the registry keeps serving a scaffolder that pins
 *      the PREVIOUS core — the quiet failure 185 named, one step worse than the
 *      E404 it replaced.
 *
 * So the question is asked up front, for every package named, and a version
 * that is already on the registry is a hard stop with the remedy in the message.
 *
 * NOT wired into `ci.yml`, deliberately: on `main` the shipped versions are
 * normally already published, so this gate is red by design between releases.
 * It belongs to the release, and it is runnable by hand —
 * `node packages/core/scripts/check-publishable.mjs packages/core packages/create-ui`
 * — which is how it was red-proved (a cloud wake cannot cut a release).
 *
 * A registry that cannot be reached is NOT a pass. E404 means "never
 * published", which is publishable; anything else is a gate that could not run,
 * and this repo's rule is that such a gate fails loudly rather than skipping.
 */
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (!dirs.length) {
  console.error('publishable check: no package directories given.');
  console.error('  usage: node packages/core/scripts/check-publishable.mjs <pkg-dir> [<pkg-dir>…]');
  process.exit(1);
}

/* Returns the versions the registry serves, or null for "no such package".
   `npm view` writes its JSON to stdout even when it exits non-zero, so the
   E404 body is read from there rather than inferred from the exit code. */
async function publishedVersions(name) {
  let stdout;
  try {
    ({ stdout } = await run('npm', ['view', name, 'versions', '--json'], { encoding: 'utf8' }));
  } catch (err) {
    stdout = err.stdout || '';
    let parsed = null;
    try {
      parsed = JSON.parse(stdout);
    } catch {
      /* not JSON — fall through to the loud failure below */
    }
    if (parsed?.error?.code === 'E404') return null;
    const detail = parsed?.error?.summary || (err.stderr || err.message || '').trim().split('\n').pop();
    throw new Error(`registry query for ${name} failed: ${detail}`);
  }
  const versions = JSON.parse(stdout);
  /* npm collapses a single-version package to a bare string. */
  return Array.isArray(versions) ? versions : [versions];
}

const problems = [];
let checked = 0;

try {
  await check();
} catch (err) {
  /* An unanswerable registry is a gate that could not run. Say that, and fail —
     never let it read as "nothing is already published". */
  console.error(`publishable check FAILED — ${err.message}`);
  console.error('  The registry could not be asked, so nothing was verified.');
  process.exit(1);
}

async function check() {
  for (const dir of dirs) {
    const pkgPath = join(resolve(REPO_ROOT, dir), 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    checked += 1;

    if (pkg.private) {
      problems.push(`${pkg.name} (${dir}) is "private": true and cannot be published at all`);
      continue;
    }

    const published = await publishedVersions(pkg.name);
    if (published === null) {
      console.log(`  ✓ ${pkg.name}@${pkg.version} — not on the registry yet (first publish)`);
      continue;
    }
    if (published.includes(pkg.version)) {
      const derived =
        pkg.name === '@busy-office/create-ui'
          ? '\n     For this package the bump is not optional on a core release: its template pin' +
            "\n     is derived from core's version, so a core release changes its content."
          : '';
      problems.push(
        `${pkg.name}@${pkg.version} is ALREADY on the registry (latest published: ${published[published.length - 1]})\n` +
          `     Bump ${dir}/package.json before releasing — a version cannot be republished.${derived}`,
      );
      continue;
    }
    console.log(
      `  ✓ ${pkg.name}@${pkg.version} — publishable (${published.length} version(s) already published, newest ${published[published.length - 1]})`,
    );
  }
}

/* Reconcile against the argument list: a silent zero here would report a clean
   release having asked nothing. */
if (checked !== dirs.length) {
  console.error(`publishable check FAILED — ${dirs.length} package(s) named but ${checked} read.`);
  process.exit(1);
}

if (problems.length) {
  console.error(`\npublishable check FAILED — ${problems.length} of ${checked} package(s) cannot be published:`);
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}

console.log(`publishable check passed — ${checked} package(s) can be published from this tree`);
