/**
 * Gate: `RESUME.md` stays inside its own charter, and keeps pointing at the
 * durable file.
 *
 * Roadmap 169.3 (2026-08-28) moved the git/build traps, the toolchain recipe,
 * the carried-forward measurement discipline and the standing owner instruction
 * out of `.roundtable/RESUME.md` into `.roundtable/ENVIRONMENT.md`. The move is
 * the easy half. The hard half is that it STAYS moved: `RESUME.md` is rewritten
 * wholesale every wake — mean 111 lines added+removed across the last 20
 * commits — so a wake that finds a trap useful can paste it back in, and the
 * next twenty rewrites carry it as if it belonged there. That is precisely how
 * it accumulated the first time: 9 lines of durable content became 214 in a
 * single day, while the per-wake half it exists for grew a third as fast.
 *
 * Two assertions, and they fail in opposite directions:
 *
 *   1. `RESUME.md` names `ENVIRONMENT.md`. Without the pointer the traps are
 *      unreachable from the file Step 0 opens, which is worse than not having
 *      moved them.
 *   2. None of the moved section HEADINGS is back in `RESUME.md`. Matching the
 *      heading (`^## …`) and not any mention means a wake can still write prose
 *      about the traps — it just cannot re-host them.
 *
 * @heuristic — and it was tagged `@exact` for one day, wrongly. Assertion 1 is
 *   string membership. Assertion 2 is membership over *the output of a parser*:
 *   `headingsIn` has to recognise which `#` lines are headings and which sit
 *   inside a fence. That is a recognition step, which is the definition
 *   `check:selftests` gives `@heuristic`, so a `--self-test` is owed and is
 *   below. The original tag's own justification — "both halves are string
 *   membership over two files" — was true of the first half only.
 *
 *   Found by the Objective grill of Slices 168-170 (2026-08-28), by running the
 *   parser rather than reading it. The base rate decided the fix: **1 of 39
 *   `@exact` gates does markdown-structure recognition** — this one — so the
 *   answer is the correct tag on one file, not a new mechanism over the taxonomy
 *   (roadmap 94.11's precedent). `check:selftests` already enforces the rest.
 *
 * The defect the mis-tag was hiding is that assertion 2 FAILS OPEN. The fence
 * skipper is a state machine, so an unterminated fence anywhere above a heading
 * turns the whole remainder of the file into invisible content and the gate
 * still reports every rule holding. Demonstrated, not reasoned: pasting
 * `## Cloud-wake toolchain …` back into the real `RESUME.md` goes red as it
 * should, and the identical paste preceded by one stray ``` line goes GREEN.
 * `RESUME.md` is rewritten wholesale every wake and is full of shell recipes,
 * which is exactly the document most likely to carry an odd fence. So the
 * unterminated fence is now its own loud failure, per CLAUDE.md: a gate that
 * cannot run must say so rather than pass.
 *
 * Red-proved 2026-08-28, and the useful way round: this gate was RED on the
 * real tree before the move — RESUME.md carried every heading and no pointer —
 * so it was watched failing on the actual defect rather than on an injection.
 * Confirmed both ways afterwards: deleting the pointer line goes red on
 * assertion 1, pasting `## Cloud-wake toolchain — what works, in order` back
 * goes red on assertion 2.
 *
 * The fence assertion was red-proved the same way (2026-08-28): the stray-fence
 * paste that had been GREEN was appended to the real `RESUME.md`, the injection
 * was confirmed by reading the file back, and the gate went red on it. The
 * `--self-test` was red-proved by stubbing `hasUnterminatedFence` to `false` —
 * one case flips to FAIL and the run exits 1, so it is not a self-test that
 * cannot fail.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned, gate } from './gate-report.mjs';

const RESUME = join(REPO_ROOT, '.roundtable', 'RESUME.md');
const ENVIRONMENT = join(REPO_ROOT, '.roundtable', 'ENVIRONMENT.md');

/**
 * The headings that left, spelled as they were spelled in `RESUME.md`. Kept as
 * literal text rather than a pattern: a pattern would drift from the file it
 * polices, and this list IS the definition of "durable" that 169.3 decided.
 */
const MOVED_HEADINGS = [
  'READ FIRST IF THIS IS A CLOUD WAKE',
  'Cloud-wake toolchain — what works, in order',
  'Traps worth carrying forward',
  'Standing owner instruction',
];

/**
 * What must be findable in `ENVIRONMENT.md` — content probes, NOT the headings
 * above, because the destination deliberately re-titled several sections.
 *
 * Asserting the old headings against the new file was this gate's own first-run
 * bug, caught before it shipped: three of the four matched by luck and
 * `READ FIRST IF THIS IS A CLOUD WAKE` exists nowhere in the destination, so
 * the check that was supposed to prove arrival would have proved the opposite
 * and been "fixed" by loosening it. A probe has to name the thing a reader came
 * for.
 */
const MUST_HAVE_ARRIVED = [
  ['the detached-HEAD trap', 'the container starts DETACHED'],
  ['the shallow-clone trap', 'THE CLONE IS SHALLOW'],
  ['the CHROME_PATH export', 'CHROME_PATH'],
  ['the toolchain recipe', 'Cloud-wake toolchain'],
  ['the background-task trap', 'NOT A COMPLETION SIGNAL'],
  ['the wc -w locale trap', 'UNDERCOUNTS THIS REPO'],
  ['the standing owner instruction', 'No external product is named'],
];

/**
 * Headings only — `^## …` — so prose may still reference a trap by name.
 *
 * Fenced code blocks are skipped, and that is not a nicety: both files are full
 * of shell recipes whose comments start with `#`, so a naive filter reads
 * `# fb15cdc is the commit carrying the owner's decision` as a heading. Caught
 * by running the same expression by hand over the finished `RESUME.md` and
 * getting three "headings" that are bash comments.
 *
 * Skipping fences did not remove the recognition step, it moved it — which is
 * why the tag above now reads `@heuristic`. The state machine below decides
 * what a heading is, and `hasUnterminatedFence` exists because it decides
 * wrongly, and silently, on a file whose fences are unbalanced.
 */
const FENCE = /^\s*(```|~~~)/;

export const headingsIn = (src) => {
  const out = [];
  let fenced = false;
  for (const line of src.split('\n')) {
    if (FENCE.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (!fenced && /^#{1,6} /.test(line)) out.push(line.replace(/^#{1,6} /, '').trim());
  }
  return out;
};

/**
 * The fail-open condition, kept separate so it can be asserted rather than
 * hoped for: if the fence state is still open at the end of the file, every
 * heading after that point was invisible to `headingsIn` and assertion 2
 * silently checked nothing.
 */
export const hasUnterminatedFence = (src) =>
  src.split('\n').filter((line) => FENCE.test(line)).length % 2 === 1;

/* Run the detector against inputs it must tell apart. This is what the
   `@heuristic` tag owes, and it is red-proved in both directions: case 2 is the
   original bash-comment bug (a `#` line inside a fence is not a heading), and
   case 4 is the fail-open bug this self-test was written for — it FAILED before
   `hasUnterminatedFence` existed. */
if (process.argv.includes('--self-test')) {
  const H = '## Cloud-wake toolchain — what works, in order';
  const cases = [
    ['a plain heading is found', headingsIn(`intro\n${H}\nbody`).length === 1],
    ['a `#` line inside a fence is not a heading', headingsIn('```\n# not a heading\n```').length === 0],
    ['a heading inside a fence is not a heading', headingsIn(`\`\`\`\n${H}\n\`\`\``).length === 0],
    ['an unterminated fence is caught, not skipped', hasUnterminatedFence(`\`\`\`\n${H}\n`)],
    ['a balanced document is not flagged', !hasUnterminatedFence('```\nx\n```\ntext')],
    ['a document with no fence at all is not flagged', !hasUnterminatedFence(`${H}\nbody`)],
  ];
  const bad = cases.filter(([, ok]) => !ok);
  for (const [what, ok] of cases) console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${what}`);
  if (bad.length) {
    console.error(`resume charter self-test FAILED — ${bad.length} case(s) misclassified.`);
    process.exit(1);
  }
  console.log(`resume charter self-test passed — ${cases.length} cases classified correctly`);
  process.exit(0);
}

/* `.roundtable/` is loop machinery, not part of the published docs image, so the
   docs Containerfile copies only package.json, packages/, apps/docs, DESIGN.md
   and examples/erp-suite. This gate therefore CANNOT run there — and a gate that
   cannot run must SAY SO rather than pass, which is the contract `check:rtl`
   follows for DESIGN.md and `check:loop-vocab` for record_iteration.py.

   Learned the documented way, on the first push (2026-08-28, CI run 572): the
   gate was verified in the cloud container's FULL checkout, which is the most
   permissive context the build has, and turned the docs container build red at
   `Containerfile:33` — the exact shape CLAUDE.md records for `check:rtl` and the
   po-app image. Verify a new gate in the NARROWEST context that must run it. */
let resume;
try {
  resume = await readFile(RESUME, 'utf8');
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
  console.log(
    'resume charter: .roundtable/RESUME.md is not in this build context, so the ' +
      'handover charter was NOT verified (expected inside container builds; CI has ' +
      'the full checkout and does verify it).',
  );
  process.exit(0);
}
const environment = await readFile(ENVIRONMENT, 'utf8').catch(() => null);

const g = gate('resume charter', 'charter rules');

/* A gate that read an empty handover has not passed — it failed to run. */
assertScanned(
  resume.trim().length,
  'content in .roundtable/RESUME.md',
  'is the repository checked out at its root?',
);

g.check(
  '.roundtable/ENVIRONMENT.md exists',
  environment !== null,
  'RESUME.md points at a file that is not there; the traps are unreachable.',
);

g.check(
  'RESUME.md points at ENVIRONMENT.md',
  resume.includes('ENVIRONMENT.md'),
  'The pointer is gone. Step 0 opens RESUME.md, so nothing reaches the traps.\n' +
    '     Restore the blockquote under the title (roadmap 169.3).',
);

/* Before assertion 2 can mean anything, the parser it rests on must have seen
   the whole file. An odd fence count leaves the state machine open, so every
   heading below it is invisible and the loop below passes by not looking. */
g.check(
  'every fenced block in RESUME.md is closed',
  !hasUnterminatedFence(resume),
  'An unterminated ``` fence leaves the rest of the file invisible to the\n' +
    '     heading scan, so the charter rules below would pass without checking.\n' +
    '     Close the fence; do not relax this to get green.',
);

const resumeHeadings = headingsIn(resume);
for (const moved of MOVED_HEADINGS) {
  const back = resumeHeadings.filter((h) => h.includes(moved));
  g.check(
    `"${moved}" is not a heading in RESUME.md`,
    back.length === 0,
    `Durable content moved to ENVIRONMENT.md by roadmap 169.3 has grown back:\n` +
      `     ${back.map((h) => `## ${h}`).join('\n     ')}\n` +
      `     Edit it in .roundtable/ENVIRONMENT.md instead — that file is not\n` +
      `     rewritten every wake, so a correction there is visible in the diff.`,
  );
}

/* The move is only real if the content actually arrived. Checked against the
   destination rather than assumed, because a "move" that deleted is the one
   failure mode worse than never having moved. */
if (environment !== null) {
  for (const [what, probe] of MUST_HAVE_ARRIVED) {
    g.check(
      `${what} is in ENVIRONMENT.md`,
      environment.includes(probe),
      `Looked for ${JSON.stringify(probe)} and found nothing. The section left\n` +
        '     RESUME.md and did not arrive — that is a deletion, not a move.',
    );
  }
}

g.report('hold');
