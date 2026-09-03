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
 *   Self-tested (roadmap 42.3 — the debt is PAID, and this line used to say it was owed): run
 *   with `--self-test`. `check:selftests` enforces the `process.argv` branch itself, never the
 *   tag text, which is how it once passed on all of them at once.
*/
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT, SOURCE_SKIP_DIRS as SKIP } from './paths.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const LITERAL = /(Chrome|Firefox|Safari|Edge)(\/Edge)?\s+\d+(\.\d+)?\s*(·|,)\s*(Chrome|Firefox|FF|Safari|Edge)/i;


async function* files(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(astro|mjs|js|ts|md)$/.test(e.name)) yield p;
  }
}

if (process.argv.includes('--self-test')) {
  /* The detector greps prose for a hand-typed browser floor. Two ways to be
     wrong: miss a real literal (the thing that rots), or flag ordinary prose
     that happens to name two browsers. Both are exercised, plus the
     generated-region case — a value inside a stat marker is written by
     stamp-readme on every build, and flagging it would fail the build for doing
     the right thing. */
  const STRIP = (src) => src.replace(/<!-- stat:[a-z]+ -->[\s\S]*?<!-- \/stat -->/g, '');
  selfTest([
    ['a hand-typed floor is caught', LITERAL.test(STRIP('Chrome/Edge 119 · Firefox 128 · Safari 17.4')), true],
    ['comma-separated too', LITERAL.test(STRIP('Chrome 119, Safari 17.4')), true],
    ['prose naming two browsers is not', LITERAL.test(STRIP('Chrome and Firefox both support :has()')), false],
    ['one browser is not a floor', LITERAL.test(STRIP('Safari 17.4 is the floor')), false],
    ['a GENERATED value is exempt', LITERAL.test(STRIP('<!-- stat:floor -->Chrome/Edge 119 · Firefox 128<!-- /stat -->')), false],
  ]);
}

/* The files whose JOB is to hold the old value: the two scripts that derive and
   police it, and the three records that keep history. Everything a consumer
   reads is generated.

   `.roundtable/**` is deliberately NOT here, and this comment used to say
   otherwise — "ROADMAP and the .roundtable grills QUOTE the old value as
   history" — granting an exemption the code never had. Settled 2026-09-03
   (roadmap 256.2): the COMMENT was the wrong half, not the list. Measured
   before deciding, rather than argued:

     - `.roundtable/` is 185 of the 556 files this gate checks, and **0 of them
       trip the literal** — including `rf-scanner-floor-study-2026-08-19.md`, a
       study entirely about the browser floor, which names single browsers
       ("Chrome 119", which this detector permits by design) and never a full
       multi-browser label. The file most likely to need the exemption does not.
     - The predicate has fired exactly once, on the first draft of
       `grill-objective-249-254-255-2026-09-03.md`. That is the whole evidence
       base, and it points the other way: the report was rewritten to print the
       deriving command instead of three labels, so the finding was PRESERVED
       and made re-runnable. "Rewriting a grill to satisfy this gate erases the
       finding it records" was the one argument for widening, and the only case
       we have refutes it.

   A grill that genuinely must pin a historical label writes it into its ROADMAP
   entry, which is exempt. Reopen if a report is ever made WORSE by this — that
   is the condition, not the mere inconvenience of citing a command. */
const ALLOW = ['scripts/check-floor.mjs', 'scripts/derive-floor.mjs', 'CHANGELOG.md', 'ROADMAP.md', 'ROADMAP-archive.md'];
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
