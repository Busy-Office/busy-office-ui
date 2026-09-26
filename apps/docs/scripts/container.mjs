/**
 * Build the docs container with a truthful provenance stamp, and optionally
 * serve it on :8081 (roadmap 377.12).
 *
 *   npm run docs:container               build, then restart bo-docs-live on :8081
 *   npm run docs:container -- --no-run   build only
 *   npm run docs:container -- --no-cache pass --no-cache to the build
 *
 * The image has no .git, so the stamp inside it cannot find its own commit.
 * Until 377.12 every container served `build-id.json` as `{sha: null, dirty:
 * true}` whatever it held. That is the one question the stamp exists to
 * answer: is this preview the tree I think it is? This passes the answer in
 * from the host:
 * - BUILD_SHA is `git rev-parse HEAD`;
 * - BUILD_DIRTY_PATHS lists the uncommitted paths among the image's own build
 *   inputs. Those are exactly what the image contains, read from the
 *   Containerfile's COPY lines rather than restated here, so adding a COPY
 *   widens the check without anyone remembering to.
 *
 * A bare `podman build` without the args fails loudly in stamp-build-id.mjs
 * instead of stamping null.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT, DOCS_ROOT } from './paths.mjs';

const CONTAINERFILE = join(DOCS_ROOT, 'Containerfile');
const IMAGE = 'bo-docs';
const NAME = 'bo-docs-live';
const PORT = 8081;

/** The build context paths a Containerfile's build stage COPYs in (not COPY --from, not the final stage). */
export function copyInputs(text) {
  const stages = text.split(/^FROM\s/m);
  const build = stages[1] ?? '';
  const inputs = [];
  for (const m of build.matchAll(/^COPY\s+(?!--from)(.+)$/gm)) {
    const parts = m[1].trim().split(/\s+/);
    inputs.push(...parts.slice(0, -1));
  }
  return inputs;
}

const git = (...args) => execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });

if (process.argv.includes('--self-test')) {
  const sample = 'FROM node AS build\nCOPY a b ./\nCOPY packages ./packages\nRUN x\nFROM nginx\nCOPY --from=build /x /y\nCOPY nginx.conf /etc/\n';
  const got = copyInputs(sample);
  if (JSON.stringify(got) !== JSON.stringify(['a', 'b', 'packages'])) {
    console.error(`container --self-test FAILED — copyInputs read ${JSON.stringify(got)}`);
    process.exit(1);
  }
  console.log('container --self-test: copyInputs reads the build stage only, and skips COPY --from and the destination');
  process.exit(0);
}

const inputs = copyInputs(await readFile(CONTAINERFILE, 'utf8'));
if (!inputs.length) {
  console.error(`container FAILED — read no COPY inputs from ${CONTAINERFILE}; the parser is broken, not the file`);
  process.exit(1);
}
const sha = git('rev-parse', 'HEAD').trim();
// -z: NUL-separated, never quoted; a rename's second entry is its OLD path, which is not in the image.
const entries = git('status', '--porcelain', '-z', '--untracked-files=all', '--', ...inputs).split('\0').filter(Boolean);
const dirty = [];
for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  dirty.push(e.slice(3));
  if (e[0] === 'R' || e[0] === 'C') i++;
}

const tool = ['podman', 'docker'].find((t) => spawnSync(t, ['--version'], { stdio: 'ignore' }).status === 0);
if (!tool) {
  console.error('container FAILED — neither podman nor docker is on PATH');
  process.exit(1);
}
console.log(`container: ${tool} build of ${sha.slice(0, 7)}, ${inputs.length} build input(s), ${dirty.length} uncommitted: ${dirty.join(', ') || 'none'}`);
const buildArgs = ['build', '-f', CONTAINERFILE, '-t', IMAGE,
  '--build-arg', `BUILD_SHA=${sha}`, '--build-arg', `BUILD_DIRTY_PATHS=${dirty.join('\n')}`,
  ...(process.argv.includes('--no-cache') ? ['--no-cache'] : []), '.'];
const built = spawnSync(tool, buildArgs, { cwd: REPO_ROOT, stdio: 'inherit' });
if (built.status !== 0) process.exit(built.status ?? 1);

if (!process.argv.includes('--no-run')) {
  spawnSync(tool, ['rm', '-f', NAME], { stdio: 'ignore' });
  const run = spawnSync(tool, ['run', '-d', '--name', NAME, '-p', `${PORT}:80`, IMAGE], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
  console.log(`container: serving on http://localhost:${PORT}/ — check http://localhost:${PORT}/build-id.json`);
}
