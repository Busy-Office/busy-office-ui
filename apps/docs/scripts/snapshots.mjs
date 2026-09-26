/**
 * Version-snapshot helpers shared by the cut (`cut-version-snapshot.mjs`) and
 * the install (`install-versions.mjs`). Roadmap 406.1.
 *
 * Since 404.1 the docs build ends by installing every committed snapshot into
 * `dist/v/`. The cut runs that build and then copies `dist` into
 * `versions/<ver>/`, so without an exclusion every cut would carry every older
 * snapshot inside it. Measured by the Slice 406 grill on a scratch build:
 * 0.9.0 would have gone from 391 files / 13.5 MB to 876 / 38.2 MB, doubling at
 * each cut. Install would then rewrite the nested pages' switchers to claim the
 * enclosing version, and its own count would still reconcile.
 *
 * So the rule lives in one place: a snapshot never contains `v/` (the other
 * snapshots) or `pagefind/` (search stays a latest-docs feature). The cut
 * asserts it after copying, and the install refuses a committed snapshot that
 * breaks it, on every build.
 */
import { access, cp, mkdir, rm } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

/** Top-level `dist` entries a snapshot never carries. */
export const SNAPSHOT_EXCLUDE = ['v', 'pagefind'];

const exists = (p) => access(p).then(() => true, () => false);

/** Copy `dist` into a fresh `dest`, leaving out SNAPSHOT_EXCLUDE, then assert it did. */
export async function copySnapshot(dist, dest) {
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp(dist, dest, {
    recursive: true,
    filter: (src) => {
      const top = relative(dist, src).split(sep)[0];
      return !SNAPSHOT_EXCLUDE.includes(top);
    },
  });
  const leaked = [];
  for (const name of SNAPSHOT_EXCLUDE) if (await exists(join(dest, name))) leaked.push(name);
  if (leaked.length) throw new Error(`snapshot at ${dest} carries ${leaked.map((n) => `${n}/`).join(', ')}, which a snapshot never may`);
}

/** Every committed snapshot under `versionsRoot` that carries an excluded directory, as `<ver>/<name>`. */
export async function badSnapshots(versionsRoot, versions) {
  const bad = [];
  for (const ver of versions) {
    for (const name of SNAPSHOT_EXCLUDE) if (await exists(join(versionsRoot, ver, name))) bad.push(`${ver}/${name}`);
  }
  return bad;
}
