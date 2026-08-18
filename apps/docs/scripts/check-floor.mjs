/**
 * Gate: the browser floor is never typed by hand.
 *
 * It used to be prose in eight places — `Chrome/Edge 119 · Firefox 128 ·
 * Safari 17.4` — and two of those three numbers were wrong. Firefox was three
 * versions too conservative and Safari a point release too high, which costs
 * reach for nothing; and nothing in the repo could tell you, because the claim
 * was derived from nothing.
 *
 * `derive-floor.mjs` now computes it from the shipped CSS against
 * @mdn/browser-compat-data. This makes sure nobody quietly reintroduces a
 * literal that will rot the moment a feature is added or dropped.
  *
 * @heuristic — greps prose for a hand-typed version literal, with an allow-list and stat-block stripping.
 *   OWES a --self-test (roadmap 42.3): a detector this easy to fool must prove it can fail.
*/
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT, SOURCE_SKIP_DIRS as SKIP } from './paths.mjs';
import { assertScanned } from './gate-report.mjs';

const LITERAL = /(Chrome|Firefox|Safari|Edge)(\/Edge)?\s+\d+(\.\d+)?\s*(·|,)\s*(Chrome|Firefox|FF|Safari|Edge)/i;


async function* files(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(astro|mjs|js|ts|md)$/.test(e.name)) yield p;
  }
}

/* ROADMAP and the .roundtable grills QUOTE the old value as history — that is
   a record of what was believed, not a live claim, and rewriting it would erase
   the finding. Everything a consumer reads is generated. */
const ALLOW = ['scripts/check-floor.mjs', 'scripts/derive-floor.mjs', 'CHANGELOG.md', 'ROADMAP.md'];
const bad = [];
let checked = 0;
for await (const f of files(REPO_ROOT)) {
  const rel = f.replace(REPO_ROOT + '/', '');
  if (ALLOW.some((a) => rel.endsWith(a))) continue;
  checked++;
  /* Strip generated regions before scanning: a value inside a stat marker is
     written BY stamp-readme from floor.json on every build, so flagging it
     would fail the build for doing the right thing. What this gate is looking
     for is a literal a human typed and will forget to update. */
  const src = (await readFile(f, 'utf8')).replace(/<!-- stat:[a-z]+ -->[\s\S]*?<!-- \/stat -->/g, '');
  for (const line of src.split('\n')) {
    if (LITERAL.test(line)) bad.push(`${rel}\n     ${line.trim().slice(0, 110)}`);
  }
}
assertScanned(checked, 'source files', 'the repo walk found nothing');

if (bad.length) {
  console.error(`floor check FAILED — ${bad.length} hand-typed browser floor(s):`);
  for (const b of bad) console.error('  ' + b);
  console.error('  Import `floor.json` and print `floor.label` instead — it is derived from the shipped CSS.');
  process.exit(1);
}
console.log(`floor check passed — ${checked} source file(s), no hand-typed browser floor`);
