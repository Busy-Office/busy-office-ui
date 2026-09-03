#!/usr/bin/env node
/**
 * "Introduced in" per component, derived from what the REGISTRY actually
 * serves — and written to `dist/introduced.json`.
 *
 * ROADMAP 249.3 proposed deriving this from git: "first tag containing the
 * component's CSS file, computed at build". That was measured before it was
 * built, and it is wrong for **38 of the 40** components. Three independent
 * reasons, each checkable in one command:
 *
 *   1. **0.1.0 was published and never tagged.** `git tag` starts at `v0.1.1`,
 *      so the 26 components that shipped in the first release would each be
 *      labelled one version late.
 *   2. **`v0.2.0` is a tag with no release behind it.** `npm view
 *      @busy-office/ui versions` returns 0.1.0, 0.1.1, 0.3.0 … 0.7.0 — no
 *      0.2.0, ever. Fourteen components would have been labelled "introduced
 *      in 0.2.0", pointing a reader at `npm i @busy-office/ui@0.2.0`, which
 *      cannot resolve.
 *   3. **A tag scan keys on a SOURCE path, which renames.** The probe that
 *      found (1) and (2) also reported `form` as unreleased, because
 *      `src/css/components/form/` has never held a `form.css` — it holds five
 *      files. The published artifact has no such ambiguity: one
 *      `dist/css/components/<name>.css` per component, which is also the name
 *      the docs page and the `./css/components/*` export use.
 *
 * That is CLAUDE.md's downstream rule arriving in a new place: when something
 * downstream can rewrite the artefact, ITS output is the artefact. A tag is an
 * input to publishing, not the published thing. So the record is built from the
 * tarballs npm serves, and one command re-derives it.
 *
 * TWO MODES, because the registry is not reachable from every build context
 * (the docs container has no `.git` either, which is why neither source can be
 * read at build time):
 *
 *   --refresh   network. Packs every published version, records the earliest
 *               one containing each `dist/css/components/<name>.css`, and
 *               writes `src/data/introduced.json` — committed, reviewable, and
 *               diffable like every other record in this repo. Run it after a
 *               publish; it is idempotent.
 *   (default)   offline. Reads that record, reconciles it against the
 *               components this build actually shipped, and emits
 *               `dist/introduced.json`. A shipped component the record does not
 *               name is `null` — "not in a published release yet" — which is
 *               the true state between a component landing and the next
 *               publish, and is rendered as such rather than left blank.
 *
 * @exact — set membership over tarball entry names and a JSON record. No
 * recognising, no position-guessing; exempt from --self-test.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const RECORD = join(HERE, '..', 'src', 'data', 'introduced.json');
const PKG = '@busy-office/ui';

/** `dist/css/components/<name>.css` — the un-minified per-component sheet. One
 *  per component, and the same name the `./css/components/*` export takes. */
const COMPONENT_ENTRY = /(?:^|\/)dist\/css\/components\/([a-z0-9-]+)\.css$/;

/** Ascending by numeric version parts, so "0.10.0" sorts after "0.9.0" rather
 *  than before it. The published set is small enough that a wrong sort would
 *  still look plausible, which is exactly why it is not lexicographic. */
const byVersion = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
};

async function refresh() {
  const versions = JSON.parse(
    execFileSync('npm', ['view', PKG, 'versions', '--json'], { encoding: 'utf8' }),
  );
  const ordered = [...versions].sort(byVersion);
  if (!ordered.length) {
    console.error(`derive-introduced --refresh FAILED — the registry lists no versions of ${PKG}.`);
    process.exit(1);
  }
  const work = mkdtempSync(join(tmpdir(), 'bo-introduced-'));
  const components = {};
  try {
    for (const v of ordered) {
      const file = execFileSync('npm', ['pack', `${PKG}@${v}`, '--silent'], {
        cwd: work,
        encoding: 'utf8',
      }).trim();
      const entries = execFileSync('tar', ['tzf', file], { cwd: work, encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
      let seen = 0;
      for (const entry of entries) {
        const m = entry.match(COMPONENT_ENTRY);
        if (!m) continue;
        seen++;
        if (!(m[1] in components)) components[m[1]] = v;
      }
      /* A version whose tarball yields zero component sheets means the entry
         pattern stopped matching the published layout — recording it silently
         would push every component's "introduced" forward to whatever version
         still parsed. */
      if (!seen) {
        console.error(
          `derive-introduced --refresh FAILED — ${PKG}@${v} yielded 0 component ` +
            `stylesheets. The tarball layout changed; ${COMPONENT_ENTRY} needs updating.`,
        );
        process.exit(1);
      }
      console.log(`  ${v.padEnd(8)} ${seen} component stylesheet(s)`);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  const record = {
    $comment:
      'Generated by scripts/derive-introduced.mjs --refresh from the published npm ' +
      'tarballs — the registry is the source, not git tags (see that file). ' +
      'Committed so an offline build can read it; re-run --refresh after a publish.',
    refreshedAt: new Date().toISOString().slice(0, 10),
    registryVersions: ordered,
    components: Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b))),
  };
  await writeFile(RECORD, JSON.stringify(record, null, 2) + '\n');
  console.log(
    `introduced record refreshed — ${Object.keys(components).length} component(s) ` +
      `across ${ordered.length} published version(s)`,
  );
}

async function build() {
  let record;
  try {
    record = JSON.parse(await readFile(RECORD, 'utf8'));
  } catch (e) {
    console.error(`derive-introduced FAILED — cannot read ${RECORD}: ${e.message}`);
    console.error('  Run `node scripts/derive-introduced.mjs --refresh` (needs the registry).');
    process.exit(1);
  }
  if (!record.registryVersions?.length || !Object.keys(record.components || {}).length) {
    console.error('derive-introduced FAILED — the record names no versions or no components.');
    console.error('  Refusing to publish an introduced.json that would label every component "unreleased".');
    process.exit(1);
  }

  /* Reconcile against the SOURCE — the stylesheets this build actually
     produced — not against the record, which would be self-consistent by
     construction and green whatever broke. */
  const shipped = (await readdir(join(DIST, 'css', 'components')))
    .filter((f) => f.endsWith('.css') && !f.endsWith('.min.css'))
    .map((f) => f.replace(/\.css$/, ''))
    .sort();
  if (!shipped.length) {
    console.error('derive-introduced FAILED — dist/css/components holds no un-minified stylesheet.');
    process.exit(1);
  }

  const components = {};
  for (const name of shipped) components[name] = record.components[name] ?? null;
  const dropped = Object.keys(record.components).filter((n) => !shipped.includes(n));
  const unreleased = shipped.filter((n) => components[n] === null);

  const latest = [...record.registryVersions].sort(byVersion).at(-1);
  const out = {
    generated: 'by scripts/derive-introduced.mjs from src/data/introduced.json — do not edit',
    source: `npm registry: ${PKG}, ${record.registryVersions.length} published version(s)`,
    refreshedAt: record.refreshedAt,
    latestPublished: latest,
    /** name -> earliest published version shipping it, or null for a component
     *  that has landed since `latestPublished` and has never been released. */
    components,
    /** Published once and no longer shipped. Kept so a reader following an old
     *  link can be told the component was removed rather than mislaid. */
    removed: Object.fromEntries(dropped.map((n) => [n, record.components[n]])),
  };
  await writeFile(join(DIST, 'introduced.json'), JSON.stringify(out, null, 2) + '\n');

  console.log(
    `introduced derived — ${shipped.length - unreleased.length} of ${shipped.length} shipped ` +
      `component(s) trace to a published version (latest ${latest}, record ${record.refreshedAt})`,
  );
  if (unreleased.length) console.log(`  not yet published: ${unreleased.join(', ')}`);
  if (dropped.length) console.log(`  published once, no longer shipped: ${dropped.join(', ')}`);
}

if (process.argv.includes('--refresh')) await refresh();
else await build();
