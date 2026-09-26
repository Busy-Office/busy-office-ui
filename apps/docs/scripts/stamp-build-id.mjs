/**
 * Write the commit this build came from into `dist/build-id.json`.
 *
 * Nothing in the built output identified WHICH commit produced it, so there was
 * no way — from outside — to ask whether the published site matches HEAD. That
 * gap let the site sit four commits stale behind five failed deploys, noticed
 * only by accident while investigating something else (Objective grill F5,
 * 2026-08-18).
 *
 * Where the commit comes from, in order:
 *   1. GITHUB_SHA: CI and the Pages deploy check out a clean tree.
 *   2. BUILD_SHA plus BUILD_DIRTY_PATHS: the docs container (roadmap 377.12).
 *      The image has no .git, so until 377.12 every container reported
 *      `{sha: null, dirty: true}` whatever it held. `container.mjs` computes
 *      both on the host and passes them as build args. BUILD_DIRTY_PATHS is
 *      the newline-separated list of uncommitted paths among the image's own
 *      build inputs.
 *   3. `git`: a local build in a checkout. Dirty is any uncommitted path,
 *      because a local build reads the whole tree.
 *
 * It FAILS rather than writing null (377.12). A stamp that says "unknown" is a
 * stamp nobody can check a preview against, and it used to look like a
 * successful build.
 */
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { DIST } from './paths.mjs';

function git(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trimEnd();
  } catch {
    return null;
  }
}

/** Paths from `git status --porcelain` output: the part after the 3-char status, and the new name of a rename. */
function porcelainPaths(out) {
  return out.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''));
}

const SHA = /^[0-9a-f]{40}$/;
let sha;
let dirtyPaths;
let source;
if (process.env.GITHUB_SHA) {
  sha = process.env.GITHUB_SHA;
  dirtyPaths = [];
  source = 'GITHUB_SHA';
} else if (process.env.BUILD_SHA !== undefined) {
  sha = process.env.BUILD_SHA.trim();
  dirtyPaths = (process.env.BUILD_DIRTY_PATHS || '').split('\n').map((p) => p.trim()).filter(Boolean);
  source = 'BUILD_SHA';
} else {
  sha = git('rev-parse', 'HEAD');
  const status = git('status', '--porcelain', '--untracked-files=all');
  dirtyPaths = status == null ? null : porcelainPaths(status);
  source = 'git';
}

if (!sha || !SHA.test(sha) || dirtyPaths == null) {
  console.error(
    `build-id FAILED — no commit to stamp (source: ${source}, sha: ${JSON.stringify(sha ?? null)}). ` +
      'CI sets GITHUB_SHA; a checkout uses git; the docs container needs BUILD_SHA and BUILD_DIRTY_PATHS as build ' +
      'args, which `npm run docs:container` passes. A null stamp is refused, not written (roadmap 377.12).',
  );
  process.exit(1);
}

await writeFile(
  join(DIST, 'build-id.json'),
  `${JSON.stringify({ sha, dirty: dirtyPaths.length > 0, dirtyPaths, builtAt: new Date().toISOString() }, null, 2)}\n`,
);

console.log(`build-id.json written — ${sha.slice(0, 7)} from ${source}${dirtyPaths.length ? ` (${dirtyPaths.length} uncommitted path(s))` : ''}`);
