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

const events = new Set();
for (const f of readdirSync(join(root, 'dist/js/behaviors'))) {
  if (!f.endsWith('.js')) continue;
  for (const m of readFileSync(join(root, 'dist/js/behaviors', f), 'utf8').matchAll(/bo:[a-z-]+/g))
    events.add(m[0]);
}

const stats = {
  size: `${Math.round(minCss.length / 1024)} kB minified (${(gzipSync(minCss).length / 1024).toFixed(1)} kB gzipped)`,
  behaviors: String(behaviors.initCount),
  events: [...events].sort().map((e) => `\`${e}\``).join(', '),
};

const check = process.argv.includes('--check');
let drifted = false;
for (const { path, requireAll } of readmePaths) {
  const src = readFileSync(path, 'utf8');
  const out = src.replace(
    /<!-- stat:([a-z]+) -->[\s\S]*?<!-- \/stat -->/g,
    (whole, name) => {
      if (!(name in stats)) throw new Error(`${path} references unknown stat "${name}"`);
      return `<!-- stat:${name} -->${stats[name]}<!-- /stat -->`;
    },
  );
  if (requireAll)
    for (const name of Object.keys(stats))
      if (!out.includes(`<!-- stat:${name} -->`))
        throw new Error(`${path} is missing the stat:${name} marker`);
  if (check) {
    if (out !== src) { console.error(`${path}: claims drifted from dist — run: node scripts/stamp-readme.mjs`); drifted = true; }
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
