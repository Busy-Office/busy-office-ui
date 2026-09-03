#!/usr/bin/env node
/**
 * Gate: every shipped CSS/JS artifact stays inside a stated size budget.
 *
 *   node scripts/check-size.mjs              # gate the built dist
 *   node scripts/check-size.mjs --self-test  # prove the detector can fail
 *
 * WHY. A CSS framework's whole pitch is that it costs less than the component
 * library it replaces, and nothing here defended that number. `stamp-readme`
 * PUBLISHES the size — it stamps "92 kB minified (15.1 kB gzipped)" into both
 * READMEs from the shipped bytes — but a stamp records growth, it never
 * refuses it: adding 30 kB re-stamps green and the claim quietly becomes a
 * different claim. That is the same shape as every mirror in this repo that
 * under-reported while looking healthy.
 *
 * THE PREMISE "NO BUNDLE-SIZE GATE EXISTS" IS NOT QUITE TRUE, AND THE PART
 * THAT IS TRUE IS THE INTERESTING PART (re-checked before building, per
 * CLAUDE.md's rule that an item's inherited premise is re-measured, not
 * assumed):
 *
 *   grep -rn -i budget packages/core/scripts packages/core/package.json .github/workflows
 *
 * returns exactly ONE enforcement — `build-rf-essentials.mjs`'s
 * `RF_BUDGET_KB = 40` (roadmap 126.1), an inline ceiling on ONE bundle inside
 * the script that builds it. So the practice exists, for 1 of the 139 shipped
 * CSS/JS artifacts; the other 138 — `index.min.css`, the 40 per-component
 * stylesheets, the six brand themes, the 31 behaviour modules — ship with no
 * ceiling at all. This gate generalises the precedent rather than inventing
 * one, and it deliberately does NOT remove 126.1's check: that one is a
 * MINIFIED-byte ceiling defended by an argued membership list, this one is a
 * gzip ceiling over the whole tree. Both may fail; they fail for different
 * reasons and read differently.
 *
 * GZIP, NOT MINIFIED BYTES — and 126.1 argues the opposite, so the difference
 * is stated rather than glossed. Its comment says byte-exact minified output
 * is safe "unlike gzip figures, which vary across zlib builds — the
 * stamp-readme lesson", and that lesson is real (2026-08-16: identical
 * committed source passed on local Node 26 and failed on CI's Node 22).
 * It does not bite here for one measured reason: that failure was an EQUALITY
 * check on a published string, and drift is a handful of bytes. Every number
 * below is a CEILING carrying ~10% headroom, and the smallest headroom in the
 * table is printed in BYTES on every run — see the pass line — so the claim
 * "10% absorbs zlib-build drift" is recomputed live instead of asserted here
 * and going stale. gzip is what the budget should be in because gzip is what
 * a consumer actually transfers.
 *
 * HOW A FILE FINDS ITS BUDGET. `bucketOf()` maps a dist-relative path to
 * exactly one bucket key, so mutual exclusion is structural rather than a
 * hand-maintained ordering of globs that can silently mis-attribute. An
 * unrecognised path returns `null` and FAILS the gate by name: a new shipped
 * artifact must be budgeted deliberately, never absorbed into a wildcard.
 * The reconciliation runs both ways — a bucket with no budget row fails, and
 * a budget row no file matched fails as stale.
 *
 * PER-FILE **AND** GROUP TOTAL, because either alone has a hole. A group
 * total alone lets one component balloon while its neighbours shrink; a
 * per-file max alone lets ten new components each land just under it. Any
 * bucket holding more than one file must declare both, and the gate fails if
 * one is missing rather than checking whichever happens to be there.
 *
 * WHY IT WALKS `dist` ITSELF instead of `dist-css.mjs`. That chokepoint
 * yields non-minified stylesheets only — `.min.css` is deliberately excluded
 * there because scanning both double-counts every CSS-invariant finding. This
 * gate's subject is precisely the minified artifacts, plus `dist/js`, so the
 * chokepoint's tree is the wrong tree. Its own header refuses an options bag
 * for exactly this case ("folding four different rules behind one abstraction
 * would be worse than two honest copies"), and `gate-source-scan.mjs` records
 * that `dist-css.mjs` is NOT gated, so nothing here is being evaded.
 *
 * WHAT IS NOT BUDGETED, with its count printed every run so the exemption
 * cannot grow quietly: `dist/**\/*.json` (build-time data read by the docs
 * site and by consumers' tooling, not bytes a browser downloads per page) and
 * `dist/**\/*.d.ts` (types, stripped before anything ships). Adding a payload
 * extension is a one-line change to PAYLOAD below.
 *
 * RAISING A BUDGET IS ONE LINE — that is the point. Growth is allowed; growth
 * that nobody looked at is not.
 *
 * @heuristic — the verdict rests on RECOGNISING which bundle a dist path
 *   belongs to, and a wildcard bucket that quietly swallowed a specific file
 *   (`css/index.min.css` falling into `css/*.min.css`) would budget the whole
 *   library at a token file's ceiling and pass forever. Carries --self-test.
 *   `bucketOf` and `findBreaches` are the ONE classifier and the ONE
 *   comparator that both the real run and the self-test call, per
 *   check-rf-floor.mjs's lesson: a self-test holding its own copy of the logic
 *   stayed green while the real gate was inert.
 */
import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distRoot = join(pkgRoot, 'dist');

/** Extensions that are payload a browser downloads. See header for the rest. */
const PAYLOAD = ['.css', '.js'];

/**
 * Budgets in kB gzipped. `total` is the bucket's whole weight; `max` is the
 * largest single file allowed in it and is REQUIRED wherever a bucket holds
 * more than one file. Each is current + ~10% headroom, measured 2026-09-03;
 * every run prints current, budget and headroom, so these stay checkable.
 */
const BUDGETS = {
  'css/index.css': { total: 97.3 },
  'css/index.min.css': { total: 16.7 },
  'css/rf-essentials.css': { total: 45.9 },
  'css/rf-essentials.min.css': { total: 8.4 },
  'css/components/*.css': { total: 115.8, max: 14.9 },
  'css/components/*.min.css': { total: 27.3, max: 2.2 },
  'css/brand-*.css': { total: 6.7, max: 1.2 },
  'css/brand-*.min.css': { total: 1.9, max: 0.4 },
  'css/*.css': { total: 15.5, max: 7.3 },
  'css/*.min.css': { total: 5.8, max: 2.3 },
  'js/**/*.js': { total: 68.2, max: 7.3 },
};

/**
 * The one classifier. Returns the bucket key a dist-relative path belongs to,
 * or `null` for a payload path no bucket claims — which is a gate failure, not
 * a silent skip.
 *
 * Order of the tests IS the specificity rule, and it is written as early
 * returns on exact names first so a named bundle can never fall through to the
 * wildcard that would also match it.
 */
export function bucketOf(rel) {
  if (rel.endsWith('.js')) return rel.startsWith('js/') ? 'js/**/*.js' : null;
  if (!rel.endsWith('.css') || !rel.startsWith('css/')) return null;

  const min = rel.endsWith('.min.css');
  /* Named single-file bundles, before any wildcard can claim them. */
  if (rel === 'css/index.css' || rel === 'css/index.min.css') return rel;
  if (rel === 'css/rf-essentials.css' || rel === 'css/rf-essentials.min.css') return rel;

  const rest = rel.slice('css/'.length);
  if (rest.startsWith('components/')) {
    /* A component stylesheet is one level down and no further. A deeper path
       is a tree shape this table has never seen — unbudgeted on purpose. */
    if (rest.slice('components/'.length).includes('/')) return null;
    return min ? 'css/components/*.min.css' : 'css/components/*.css';
  }
  if (rest.includes('/')) return null; // an unknown nested dir under css/
  if (rest.startsWith('brand-')) return min ? 'css/brand-*.min.css' : 'css/brand-*.css';
  return min ? 'css/*.min.css' : 'css/*.css';
}

/**
 * The one comparator. `files` is `[{ rel, bucket, gzKb }]`; returns a breach
 * per violated constraint, so a bucket that blows both its per-file max and
 * its total reports both rather than hiding one behind the other.
 */
export function findBreaches(files, budgets) {
  const breaches = [];
  const byBucket = new Map();
  for (const f of files) {
    if (!byBucket.has(f.bucket)) byBucket.set(f.bucket, []);
    byBucket.get(f.bucket).push(f);
  }
  for (const [bucket, members] of byBucket) {
    const budget = budgets[bucket];
    if (!budget) {
      breaches.push({ kind: 'unbudgeted-bucket', bucket, detail: `${members.length} file(s) match no budget row` });
      continue;
    }
    if (members.length > 1 && budget.max === undefined) {
      breaches.push({
        kind: 'missing-max',
        bucket,
        detail: `holds ${members.length} files but declares no per-file max — a group total alone lets one file balloon`,
      });
    }
    const total = members.reduce((s, m) => s + m.gzKb, 0);
    if (total > budget.total) {
      breaches.push({
        kind: 'total',
        bucket,
        detail: `${total.toFixed(2)} kB gz > budget ${budget.total} kB`,
      });
    }
    if (budget.max !== undefined) {
      for (const m of members) {
        if (m.gzKb > budget.max) {
          breaches.push({
            kind: 'file',
            bucket,
            detail: `${m.rel} is ${m.gzKb.toFixed(2)} kB gz > per-file budget ${budget.max} kB`,
          });
        }
      }
    }
  }
  return breaches;
}

if (process.argv.includes('--self-test')) {
  const f = (rel, gzKb) => ({ rel, bucket: bucketOf(rel), gzKb });

  /* CLASSIFIER. The load-bearing cases are the ones where a wildcard bucket
     would also match: a named bundle must not fall into `css/*[.min].css`,
     and a component must not either. */
  const classify = [
    ['the whole-library bundle is its own bucket, not css/*.css', bucketOf('css/index.css'), 'css/index.css'],
    ['the minified bundle is its own bucket, not css/*.min.css', bucketOf('css/index.min.css'), 'css/index.min.css'],
    ['rf-essentials keeps its own bucket', bucketOf('css/rf-essentials.min.css'), 'css/rf-essentials.min.css'],
    ['a component stylesheet buckets as a component', bucketOf('css/components/data-table.css'), 'css/components/*.css'],
    ['a minified component buckets as a minified component', bucketOf('css/components/data-table.min.css'), 'css/components/*.min.css'],
    ['a brand theme is not a top-level stylesheet', bucketOf('css/brand-navy.css'), 'css/brand-*.css'],
    ['a minified brand theme likewise', bucketOf('css/brand-navy.min.css'), 'css/brand-*.min.css'],
    ['a plain top-level stylesheet falls to the wildcard', bucketOf('css/tokens.css'), 'css/*.css'],
    ['and its minified twin to the minified wildcard', bucketOf('css/tokens.min.css'), 'css/*.min.css'],
    ['a behaviour module buckets as js', bucketOf('js/behaviors/tabs.js'), 'js/**/*.js'],
    ['the js entry point buckets as js', bucketOf('js/index.js'), 'js/**/*.js'],
    /* Fail-loud cases: a shape the table has never seen must NOT be absorbed. */
    ['an unknown nested css dir is unbudgeted, not swallowed by css/*.css', bucketOf('css/themes/nordic.css'), null],
    ['a nested component dir is unbudgeted', bucketOf('css/components/data-table/parts.css'), null],
    ['a type declaration is not payload', bucketOf('js/index.d.ts'), null],
  ];

  /* COMPARATOR. Under budget must be silent, and each constraint must be able
     to fire ON ITS OWN — a comparator that only ever reports when both are
     blown is a detector that cannot fail on the common case. */
  const budgets = { 'css/components/*.min.css': { total: 3.0, max: 1.0 } };
  const under = [f('css/components/a.min.css', 0.9), f('css/components/b.min.css', 0.9)];
  const overFile = [f('css/components/a.min.css', 1.4), f('css/components/b.min.css', 0.9)];
  const overTotal = [
    f('css/components/a.min.css', 0.9),
    f('css/components/b.min.css', 0.9),
    f('css/components/c.min.css', 0.9),
    f('css/components/d.min.css', 0.9),
  ];
  const noMax = findBreaches([f('css/brand-x.css', 0.1), f('css/brand-y.css', 0.1)], {
    'css/brand-*.css': { total: 9 },
  });

  const kinds = (bs) => bs.map((b) => b.kind).sort().join(',');
  const compare = [
    ['a set inside its budget reports nothing', kinds(findBreaches(under, budgets)), ''],
    ['one oversized file is reported alone', kinds(findBreaches(overFile, budgets)), 'file'],
    ['a blown total is reported with every file inside its max', kinds(findBreaches(overTotal, budgets)), 'total'],
    ['a bucket with no budget row is reported', kinds(findBreaches(under, {})), 'unbudgeted-bucket'],
    ['a multi-file bucket declaring no per-file max is reported', kinds(noMax), 'missing-max'],
  ];

  let ok = true;
  for (const [what, got, want] of [...classify, ...compare]) {
    const pass = got === want;
    ok &&= pass;
    console.log(`self-test: ${what.padEnd(62)} ${String(got)} (want ${String(want)}) ${pass ? 'ok' : 'WRONG'}`);
  }
  if (!ok) {
    console.error('  the detector cannot tell the cases apart — it would pass on a real breach');
    process.exit(1);
  }
  console.log('self-test passed — the classifier and the comparator can both fail');
  process.exit(0);
}

async function* distFiles(dir = distRoot) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* distFiles(p);
    else yield p;
  }
}

const files = [];
const skipped = new Map();
let seen = 0;
for await (const abs of distFiles()) {
  seen += 1;
  const rel = relative(distRoot, abs).split('\\').join('/');
  if (!PAYLOAD.some((ext) => rel.endsWith(ext))) {
    const ext = rel.endsWith('.d.ts') ? '.d.ts' : '.' + rel.split('.').pop();
    skipped.set(ext, (skipped.get(ext) ?? 0) + 1);
    continue;
  }
  files.push({ rel, bucket: bucketOf(rel), gzKb: gzipSync(await readFile(abs)).length / 1024 });
}

/* Assert the walk actually saw something, rather than passing on an empty
   tree — a gate whose input is missing must fail loudly, never quietly. */
if (seen === 0 || files.length === 0) {
  console.error(
    `size check FAILED — walked ${seen} file(s) under ${relative(pkgRoot, distRoot)} and found ${files.length} payload file(s).\n` +
      '  The build has not run, or dist/ has moved. Run: npm run build -w @busy-office/ui',
  );
  process.exit(1);
}

const unbudgetedFiles = files.filter((f) => f.bucket === null);
const breaches = findBreaches(files.filter((f) => f.bucket !== null), BUDGETS);
const usedBuckets = new Set(files.map((f) => f.bucket));
const staleRows = Object.keys(BUDGETS).filter((b) => !usedBuckets.has(b));

if (unbudgetedFiles.length || breaches.length || staleRows.length) {
  console.error(`size check FAILED — ${unbudgetedFiles.length + breaches.length + staleRows.length} problem(s):`);
  for (const f of unbudgetedFiles) {
    console.error(`  ${f.rel}\n     is shipped payload no budget bucket claims — add it to BUDGETS or to bucketOf()`);
  }
  for (const b of breaches) console.error(`  ${b.bucket}\n     ${b.detail}`);
  for (const b of staleRows) {
    console.error(`  ${b}\n     budget row matched no shipped file — the bundle was renamed or removed, so delete the row`);
  }
  if (breaches.some((b) => b.kind === 'total' || b.kind === 'file')) {
    console.error('  Trim the addition, or raise that budget line and say why in the commit. Never both silently.');
  }
  process.exit(1);
}

/* Recompute the header's "10% absorbs zlib-build drift" claim LIVE rather
   than asserting it once and letting it go stale: the tightest headroom in
   the whole table, in bytes, on this build. */
let tightest = Infinity;
let tightestWhere = '';
const rows = [];
for (const [bucket, budget] of Object.entries(BUDGETS)) {
  const members = files.filter((f) => f.bucket === bucket);
  const total = members.reduce((s, m) => s + m.gzKb, 0);
  const consider = (headKb, where) => {
    if (headKb < tightest) { tightest = headKb; tightestWhere = where; }
  };
  consider(budget.total - total, `${bucket} total`);
  if (budget.max !== undefined) {
    const biggest = members.reduce((a, b) => (b.gzKb > a.gzKb ? b : a));
    consider(budget.max - biggest.gzKb, `${biggest.rel}`);
  }
  rows.push(
    `  ${bucket.padEnd(26)} ${String(members.length).padStart(2)} file(s)  ` +
      `${total.toFixed(2).padStart(6)} / ${String(budget.total).padStart(5)} kB gz` +
      (budget.max === undefined ? '' : `   largest ${Math.max(...members.map((m) => m.gzKb)).toFixed(2)} / ${budget.max} kB`),
  );
}
for (const r of rows) console.log(r);

const shipped = files.reduce((s, f) => s + f.gzKb, 0);
console.log(
  `size check passed — ${files.length} shipped payload file(s) in ${Object.keys(BUDGETS).length} budget bucket(s), ` +
    `${shipped.toFixed(1)} kB gz total; tightest headroom ${Math.round(tightest * 1024)} bytes (${tightestWhere}). ` +
    `Not budgeted: ${[...skipped.entries()].map(([e, n]) => `${n} ${e}`).join(', ')} — see this file's header.`,
);
