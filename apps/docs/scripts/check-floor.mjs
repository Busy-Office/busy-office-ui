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
 * SECOND NEEDLE — the app-shell band (roadmap 377.14). The same failure in
 * another value: 373.3 derived the band on /concepts/layouts and accepted on
 * a `grep "900px"`, the pre-rem spelling, which matched one viewport HEIGHT
 * and none of the six rendered "56rem"s on three other pages. Those pages now
 * print `lib/shell-band.ts`. The needle is READ from sidebar-nav.css, never
 * stored here (check-viewport-forks' rule: a gate holding its own copy of the
 * value is the fork it hunts), and any length literal whose px value lies in
 * [band, band + 1] is a restatement — the rem, the px, the "just above" px
 * and a `.01rem` complement all land there. Scope is what a reader or a
 * consumer reads: docs src, core src (comments included) and the root docs.
 * ROADMAP and .roundtable quote the value as history and are not walked.
 *
 * @heuristic — greps prose for a hand-typed version literal, with an allow-list and stat-block stripping;
 *   and for a length literal equal to the shell band, with a counted EXEMPT map.
 *   Self-tested (roadmap 42.3 — the debt is PAID, and this line used to say it was owed): run
 *   with `--self-test`. `check:selftests` enforces the `process.argv` branch itself, never the
 *   tag text, which is how it once passed on all of them at once.
*/
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT, SOURCE_SKIP_DIRS as SKIP } from './paths.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const LITERAL = /(Chrome|Firefox|Safari|Edge)(\/Edge)?\s+\d+(\.\d+)?\s*(·|,)\s*(Chrome|Firefox|FF|Safari|Edge)/i;

/** Every length literal on each line whose px value (16px/rem, 16px/em) lies
 *  in [bandPx, bandPx + 1]. The lookbehind keeps `a56rem` and a negative out;
 *  `{SHELL_BAND_PX + 1}px` has no digit touching its unit, so a derived print
 *  never matches. */
function bandLiterals(src, bandPx) {
  const hits = [];
  src.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)\s*(rem|em|px)\b/g)) {
      const px = Number(m[1]) * (m[2] === 'px' ? 1 : 16);
      if (px >= bandPx && px <= bandPx + 1) hits.push({ line: i + 1, text: m[0] });
    }
  });
  return hits;
}

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
    /* The band needle, at a fixture band of 896px: every spelling the tree has
       used is caught, and a derived print or a neighbouring length is not. */
    ['band: restated in rem is caught', bandLiterals('collapses at 56rem', 896).length, 1],
    ['band: px, and the just-above px', bandLiterals('at 896px, not 897px', 896).length, 2],
    ['band: a .01rem complement is caught', bandLiterals('@media (min-width: 56.01rem)', 896).length, 1],
    ['band: a derived print is not', bandLiterals('at {SHELL_BAND_REM}rem and {SHELL_BAND_PX + 1}px', 896).length, 0],
    ['band: other lengths are not', bandLiterals('60rem, a 900px-tall viewport, 1.56rem, 895px', 896).length, 0],
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

/* ── The shell band (roadmap 377.14) ─────────────────────────────────────── */
const NAV_CSS = 'packages/core/src/css/components/sidebar-nav/sidebar-nav.css';
const bands = [...(await readFile(join(REPO_ROOT, NAV_CSS), 'utf8')).matchAll(/@container bo-shell \(max-width:\s*([\d.]+)rem\)/g)]
  .map((m) => Number(m[1]));
if (bands.length !== 1) {
  console.error(`floor check FAILED — expected ONE '@container bo-shell (max-width: …rem)' in ${NAV_CSS}, found ${bands.length}.`);
  console.error('  The band needle is read from there; without exactly one, nothing below would be checking anything.');
  process.exit(1);
}
const BAND_REM = bands[0];
const BAND_PX = BAND_REM * 16;
/* A length equal to the band that is NOT a hand restatement. `exact` entries
   are copies that MUST equal the band — a `@media` condition cannot read a
   custom property or a build constant — so a band change that leaves them
   behind drops their count and fails here: the exemption is also the
   equality check. The others share the number by coincidence and are capped,
   so one more literal in the same file still fails. */
const BAND_EXEMPT = new Map([
  [NAV_CSS, { n: 1, exact: true, why: 'the source: the band itself' }],
  ['apps/docs/src/layouts/Gallery.astro', { n: 3, exact: true, why: "the docs chrome's drawer and search-button media queries, which must switch with the rail because the docs shell spans the viewport" }],
  ['packages/core/src/css/components/dialog/dialog.css', { n: 2, exact: false, why: "`.bo-dialog--wide`'s measure and its comment: another quantity" }],
  ['apps/docs/src/data/dsa-scores.json', { n: 1, exact: false, why: "a score citing that dialog measure, not the band" }],
  ['apps/docs/src/pages/patterns/schedule/full.astro', { n: 1, exact: false, why: 'a standalone preview with no app shell; its split breakpoint is its own' }],
]);
const BAND_ROOTS = ['apps/docs/src', 'packages/core/src', 'DESIGN.md', 'CLAUDE.md', 'README.md', 'LOOPS.md', 'packages/core/README.md'];
async function* bandFiles(rel) {
  const abs = join(REPO_ROOT, rel);
  if (!(await stat(abs)).isDirectory()) { yield rel; return; }
  for (const e of await readdir(abs, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const r = `${rel}/${e.name}`;
    if (e.isDirectory()) yield* bandFiles(r);
    else if (/\.(astro|mjs|js|ts|md|css|json)$/.test(e.name)) yield r;
  }
}
const bandBad = [];
const bandSeen = new Set();
/* The docs image copies apps/, packages/ and DESIGN.md, not the repo-root
   CLAUDE.md, README.md or LOOPS.md. Same standing-down rule as
   check-slice-refs and check-ci-ignores: those three may be legitimately
   absent and are reported as NOT verified, never passed. Every other root
   must exist, or the scan is broken rather than clean. */
const MAY_BE_ABSENT = new Set(['CLAUDE.md', 'README.md', 'LOOPS.md']);
const bandAbsent = [];
for (const root of BAND_ROOTS) {
  if (MAY_BE_ABSENT.has(root) && !(await stat(join(REPO_ROOT, root)).then(() => true, () => false))) {
    bandAbsent.push(root);
    continue;
  }
  for await (const rel of bandFiles(root)) {
    bandSeen.add(rel);
    const hits = bandLiterals(await readFile(join(REPO_ROOT, rel), 'utf8'), BAND_PX);
    const ex = BAND_EXEMPT.get(rel);
    const ok = ex ? (ex.exact ? hits.length === ex.n : hits.length <= ex.n) : hits.length === 0;
    if (!ok)
      bandBad.push(
        `${rel}: ${hits.length} literal(s)` +
          (ex ? `, exemption allows ${ex.exact ? 'exactly' : 'at most'} ${ex.n} — ${ex.why}` : '') +
          (hits.length ? `\n     ${hits.map((h) => `:${h.line} ${h.text}`).join('  ')}` : ''),
      );
  }
}
assertScanned(bandSeen.size, 'shell-band source files', `none of ${BAND_ROOTS.join(', ')} yielded a file`);
if (bandAbsent.length) console.log(`floor check: ${bandAbsent.join(', ')} not in this build context, so the shell band was NOT verified there`);
for (const rel of BAND_EXEMPT.keys())
  if (!bandSeen.has(rel)) bandBad.push(`${rel}: named in BAND_EXEMPT but never scanned — a stale exemption`);

if (bad.length) {
  console.error(`floor check FAILED — ${bad.length} hand-typed browser floor(s):`);
  for (const b of bad) console.error('  ' + b);
  console.error('  Import `floor.json` and print `floor.label` instead — it is derived from the shipped CSS.');
}
if (bandBad.length) {
  console.error(`floor check FAILED — the shell band (${BAND_REM}rem = ${BAND_PX}px) is typed by hand in ${bandBad.length} file(s):`);
  for (const b of bandBad) console.error('  ' + b);
  console.error('  Print SHELL_BAND_REM / SHELL_BAND_PX from apps/docs/src/lib/shell-band.ts; in a comment, name the band');
  console.error('  (sidebar-nav.css) rather than its value. A copy that must equal it belongs in BAND_EXEMPT as `exact`.');
}
if (bad.length || bandBad.length) process.exit(1);
console.log(`floor check passed — ${checked} source file(s), no hand-typed browser floor`);
console.log(
  `floor check passed — shell band ${BAND_REM}rem read from sidebar-nav.css; ${bandSeen.size} file(s), ` +
    `no restatement outside ${BAND_EXEMPT.size} counted exemption(s)`,
);
