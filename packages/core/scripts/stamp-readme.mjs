// Stamp (or verify) the README's factual claims from the shipped dist.
// The npm README is a documented surface like any other: generated numbers,
// never hand-written (2026-08-15 Objective review: the hand-written "37 kB"
// claim had drifted 55% from the shipped artifact).
//
//   node scripts/stamp-readme.mjs           # rewrite marker spans in place
//   node scripts/stamp-readme.mjs --check   # exit 1 if README != dist truth
//
// Markers: <!-- stat:NAME -->value<!-- /stat -->
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
// Both READMEs carry stamped claims: the package one (npm page) requires all
// markers; the repo root one participates for whichever markers it contains.
const readmePaths = [
  { path: join(root, 'README.md'), requireAll: true },
  { path: join(root, '../../README.md'), requireAll: false },
];

const minCss = readFileSync(join(root, 'dist/css/index.min.css'));
const behaviors = JSON.parse(readFileSync(join(root, 'dist/behaviors.json'), 'utf8'));
const minKb = Math.round(minCss.length / 1024);
// gzip byte count is NOT purely a function of the input: Node's zlib
// backend (classic zlib vs zlib-ng) can legitimately compress the SAME
// bytes to a handful of bytes more or fewer depending on the Node build —
// this genuinely differs between environments (a real CI failure,
// 2026-08-16: identical committed source, passed locally on Node 26,
// failed on CI's Node 22 — not a stale stamp, verified against the exact
// pushed tree). A human-readable size claim should not be a byte-exact
// cross-environment contract, so `size` compares within a tolerance
// instead of exact string equality — see isSizeMatch() below.
const gzipKb = gzipSync(minCss).length / 1024;

const events = new Set();
for (const f of readdirSync(join(root, 'dist/js/behaviors'))) {
  if (!f.endsWith('.js')) continue;
  for (const m of readFileSync(join(root, 'dist/js/behaviors', f), 'utf8').matchAll(/bo:[a-z-]+/g))
    events.add(m[0]);
}

const stats = {
  size: `${minKb} kB minified (${gzipKb.toFixed(1)} kB gzipped)`,
  behaviors: String(behaviors.initCount),
  events: [...events].sort().map((e) => `\`${e}\``).join(', '),
};

// Tolerance band, kB: covers observed zlib/zlib-ng cross-build drift (a
// handful of bytes) without masking a REAL size change from added CSS.
const GZIP_TOLERANCE_KB = 0.3;
function isSizeMatch(existing) {
  const m = /^(\d+) kB minified \(([\d.]+) kB gzipped\)$/.exec(existing);
  if (!m) return false;
  const [, existingMinKb, existingGzipKb] = m;
  return (
    Number(existingMinKb) === minKb &&
    Math.abs(Number(existingGzipKb) - gzipKb) <= GZIP_TOLERANCE_KB
  );
}

const check = process.argv.includes('--check');
let drifted = false;
for (const { path, requireAll } of readmePaths) {
  let src;
  try {
    src = readFileSync(path, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT' && !requireAll) continue; // repo root README is
    // outside packages/core's own contract (never ships to npm) — an
    // isolated build context that copies only packages/core (e.g. the
    // po-app consumer image, which exists specifically to prove the real
    // npm package boundary) legitimately won't have it.
    throw err;
  }
  let fileDrifted = false;
  const out = src.replace(
    /<!-- stat:([a-z]+) -->([\s\S]*?)<!-- \/stat -->/g,
    (whole, name, existing) => {
      if (!(name in stats)) throw new Error(`${path} references unknown stat "${name}"`);
      if (name === 'size') {
        if (!isSizeMatch(existing)) fileDrifted = true;
        // Within tolerance: keep the EXISTING text so re-stamping on a
        // different machine doesn't create no-op diffs every run.
        return isSizeMatch(existing) ? whole : `<!-- stat:size -->${stats.size}<!-- /stat -->`;
      }
      if (existing !== stats[name]) fileDrifted = true;
      return `<!-- stat:${name} -->${stats[name]}<!-- /stat -->`;
    },
  );
  if (requireAll)
    for (const name of Object.keys(stats))
      if (!out.includes(`<!-- stat:${name} -->`))
        throw new Error(`${path} is missing the stat:${name} marker`);
  if (check) {
    if (fileDrifted) { console.error(`${path}: claims drifted from dist — run: node scripts/stamp-readme.mjs`); drifted = true; }
  } else if (out !== src) {
    writeFileSync(path, out);
    console.log(`stamped ${path}`);
  }
}
if (check) {
  if (drifted) process.exit(1);
  console.log('readme claims check passed — size/behaviors/events match dist (both READMEs)');
} else {
  console.log('claims:', JSON.stringify(stats.size), `· ${stats.behaviors} behaviors · ${events.size} events`);
}
