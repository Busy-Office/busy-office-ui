/**
 * Write the commit this build came from into `dist/build-id.json`.
 *
 * Nothing in the built output identified WHICH commit produced it, so there was
 * no way — from outside — to ask whether the published site matches HEAD. That
 * gap let the site sit four commits stale behind five failed deploys, noticed
 * only by accident while investigating something else (Objective grill F5,
 * 2026-08-18).
 *
 * `sha` comes from GITHUB_SHA in CI and falls back to `git rev-parse HEAD`
 * locally, so the file is meaningful in both places. A dirty working tree is
 * recorded as such rather than silently pretending the build equals the commit.
 */
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { DIST } from './paths.mjs';


function git(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

const sha = process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
// Only meaningful for a local build; CI checks out a clean tree.
const dirty = process.env.GITHUB_SHA ? false : git('status', '--porcelain') !== '';

await writeFile(
  join(DIST, 'build-id.json'),
  `${JSON.stringify({ sha, dirty, builtAt: new Date().toISOString() }, null, 2)}\n`,
);

console.log(`build-id.json written — ${sha ? sha.slice(0, 7) : 'UNKNOWN sha'}${dirty ? ' (dirty tree)' : ''}`);
