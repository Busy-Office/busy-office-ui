// Release-flow step (Slice 20 item 3): cut a versioned docs snapshot.
// SNAPSHOTS THE TREE IT RUNS IN — run it at release time. A retroactive
// snapshot must run from a worktree checked out at that version's tag,
// or later docs get labelled as the old version (0.3.0 was cut that way
// on 2026-08-23, 60+ commits after its tag).
//   node scripts/cut-version-snapshot.mjs <version>
// Builds the docs with the snapshot's Pages base and copies the result to
// apps/docs/versions/<version>/, leaving out pagefind (search stays a
// latest-docs feature — 1MB/version saved) and v/ (the older snapshots the
// build itself installs since 404.1 — without that exclusion every cut
// nested every earlier one, roadmap 406.1). The docs build installs the
// committed snapshots at /v/<version>/ on every build (install-versions.mjs).
// Finish by rebuilding plain and committing versions/ and versions.json.
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { DIST, DOCS_ROOT } from './paths.mjs';
import { copySnapshot } from './snapshots.mjs';

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('usage: node scripts/cut-version-snapshot.mjs <x.y.z>');
  process.exit(1);
}
// DOCS_ROOT from the chokepoint — the local `new URL(..).pathname` spelling
// this replaced is the percent-encoded one paths.mjs's header documents as
// BROKEN on paths containing spaces (2026-08-21 sweep).
const docsRoot = DOCS_ROOT;
execSync('npm run build', {
  cwd: docsRoot,
  stdio: 'inherit',
  env: { ...process.env, DOCS_BASE: `/busy-office-ui/v/${version}` },
});
const dest = join(docsRoot, 'versions', version);
await copySnapshot(DIST, dest);

// One-command release (Slice 21 grill E4): the script maintains
// versions.json itself — the manual-edit step was the likeliest slip
// (an entry without a committed snapshot shipped a live 404).
const vPath = join(docsRoot, 'versions.json');
const { readFile, writeFile } = await import('node:fs/promises');
const v = JSON.parse(await readFile(vPath, 'utf8'));
if (!v.snapshots.includes(version)) v.snapshots.push(version);
v.snapshots.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
await writeFile(vPath, JSON.stringify(v) + '\n');
console.log(`snapshot cut: apps/docs/versions/${version}/ (pagefind and v/ left out)
versions.json updated. Next: rebuild plain (npm run docs:build) and commit both.`);
