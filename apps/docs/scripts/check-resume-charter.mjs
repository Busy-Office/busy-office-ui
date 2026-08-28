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
 * @exact — both halves are string membership over two files. There is no
 *   recognition step to fool, so no `--self-test` is owed (CLAUDE.md: wrapping
 *   ceremony around an equality check is the thing that rule exempts).
 *
 * Red-proved 2026-08-28, and the useful way round: this gate was RED on the
 * real tree before the move — RESUME.md carried every heading and no pointer —
 * so it was watched failing on the actual defect rather than on an injection.
 * Confirmed both ways afterwards: deleting the pointer line goes red on
 * assertion 1, pasting `## Cloud-wake toolchain — what works, in order` back
 * goes red on assertion 2.
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

/** Headings only — `^## …` — so prose may still reference a trap by name. */
const headingsIn = (src) =>
  src
    .split('\n')
    .filter((l) => /^#{1,6} /.test(l))
    .map((l) => l.replace(/^#{1,6} /, '').trim());

const [resume, environment] = await Promise.all([
  readFile(RESUME, 'utf8'),
  readFile(ENVIRONMENT, 'utf8').catch(() => null),
]);

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
