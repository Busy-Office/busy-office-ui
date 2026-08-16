// Release-flow step (Slice 20 item 3): cut a versioned docs snapshot.
//   node scripts/cut-version-snapshot.mjs <version>
// Builds the docs with the snapshot's Pages base, strips the pagefind
// index (search stays a latest-docs feature — 1MB/version saved), and
// commits the result under apps/docs/versions/<version>/, which the
// Pages workflow copies to /v/<version>/ on every deploy. Finish by
// adding <version> to apps/docs/versions.json and rebuilding plain.
import { execSync } from 'node:child_process';
import { rm, cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('usage: node scripts/cut-version-snapshot.mjs <x.y.z>');
  process.exit(1);
}
const docsRoot = new URL('..', import.meta.url).pathname;
execSync('npm run build', {
  cwd: docsRoot,
  stdio: 'inherit',
  env: { ...process.env, DOCS_BASE: `/busy-office-ui/v/${version}` },
});
const dest = join(docsRoot, 'versions', version);
await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(join(docsRoot, 'dist'), dest, { recursive: true });
await rm(join(dest, 'pagefind'), { recursive: true, force: true });
console.log(`snapshot cut: apps/docs/versions/${version}/ (pagefind stripped)
next: add "${version}" to apps/docs/versions.json, rebuild plain (npm run docs:build), commit.`);
