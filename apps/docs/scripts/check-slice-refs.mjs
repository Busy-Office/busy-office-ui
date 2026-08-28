#!/usr/bin/env node
/**
 * Gate: a slice number cited from the code still resolves in the plan, and
 * resolves to exactly ONE slice.
 *
 * @heuristic — RETAGGED 2026-08-28 (roadmap 180.1), after this gate turned the
 *   default branch red for 47 minutes on a line of prose. One arm is exact:
 *   resolving a ref against `^## Slice N` is set membership and nothing is
 *   inferred about what a section says. The OTHER arm — deciding which strings
 *   in the tree are citations at all — is a bare word regex over free prose,
 *   which is recognition, and recognition can be fooled. It was: the loop-name
 *   tally `Meta 12 · Continue 4 · Roadmap 2 · Polish 2 · Standardize 1` in a
 *   grill report was read as a citation to a `## Slice 2` that has never
 *   existed. Carries --self-test.
 *
 * WHAT MADE THAT COSTLY, and why it is written here rather than in a slice: the
 * failing arm is the FIRST thing in `check:repo`, which is the first thing in
 * `docs:build`. So one unluckily-worded sentence in `.roundtable/` — a
 * directory CI's `paths-ignore` deliberately excludes from *triggering* a run —
 * stopped all five CI jobs and the Pages deploy. A gate over prose has the
 * blast radius of a gate over code.
 *
 * THE DISCRIMINATOR IS THE TALLY SHAPE, NOT THE CASE. Measured on the unedited
 * tree before it shipped: 461 matches, `roadmap` 434 · `ROADMAP` 15 ·
 * `Roadmap` 12 — and 11 of those 12 Title-case matches are genuine
 * sentence-initial citations (`Roadmap 171.1`, `Roadmap 159's finding`), so
 * case discriminates nothing. What the tally has and a citation does not is a
 * ` · `-joined NEIGHBOUR of the form `Word Number`. Base rate of that
 * predicate on the unedited tree: true of **1 of 461** matches, which is the
 * one false positive. Neither 0 nor 100%, so it is not ceremony (94.11).
 *
 * WHY. `ROADMAP.md` is swept periodically: item 110.4 moved 83 closed slices
 * to `ROADMAP-archive.md` on 2026-08-22, the live file grew back from 5,562 to
 * 9,824 lines in three days, and a second pass on 2026-08-25 moved 44 more
 * (9,824 -> 1,094). Each sweep leaves a pointer line and moves the section
 * byte-identical. That only stays safe while both halves are searchable
 * together: slice numbers are cited from shipped CSS comments, docs pages and
 * scripts, because a rule usually carries the slice that produced it, which is
 * how "why is this selector shaped like that" stays answerable. Trim the
 * archive and those become dead references, silently.
 *
 * **How many, is printed by this gate on every run and is deliberately not
 * written here.** The two numbers that used to be — "148 cited", twice — were
 * both stale by 2026-08-28, when the run line read 362; `LOOPS.md` rule 4
 * recorded the same rot in its own copy. A snapshot in a header goes stale
 * silently and is read as current; the property does not (roadmap 177).
 *
 * WHERE they are cited from matters for one decision, so it is measured rather
 * than assumed: 42 of the distinct refs are cited from `.roundtable/`, and
 * **16 are cited from nowhere else**. That is the answer to the obvious
 * reaction to the outage above — "stop scanning the notes directory". It would
 * drop those 16 and re-open exactly the silent rot this gate exists to catch.
 *
 * A REGRESSION GATE, NOT A PURITY GATE. Two citations do not resolve today and
 * both predate the sweeps, so demanding every one would be red on its first run.
 * The baseline is frozen; the gate fires only when the set GROWS. Removing an
 * entry is always welcome, adding one needs a reason in the diff.
 *
 * The base rate was measured twice, and the first measurement was wrong in a
 * way worth recording: it reported 58 dangling, because the archive had just
 * been clobbered by a same-name file written in the wrong case (APFS is
 * case-insensitive — `ROADMAP-ARCHIVE.md` and `ROADMAP-archive.md` are one
 * file). Fifty-six of those 58 "dangling" refs were resolving perfectly well
 * in content that had been overwritten minutes earlier. A number that moves by
 * 28x when an unrelated mistake is undone was never a measurement of the thing
 * it claimed to measure.
 *
 * SECOND ASSERTION: NO SLICE NUMBER HEADS TWO SECTIONS (roadmap 175.1). The
 * check above asks whether a citation resolves; it never asked whether it
 * resolves *uniquely*, and on 2026-08-28 it stopped being able to tell. Two
 * different slices were filed as `## Slice 172` about 80 minutes apart — an
 * Objective grill and an owner bug report — so `roadmap 172.1` named two
 * unrelated items and this gate stayed green on both.
 *
 * The cost is not only that a reader lands on the wrong section.
 * `dispatch_status.py` collapses the slices closed since the last grill into a
 * `set()`, so a collision subtracts exactly one from rule 3's arming count —
 * red-proved by rewriting the colliding log row in a probe copy:
 * `['169', '170', '172']` (3) becomes `['169', '170', '172', '174']` (4).
 * Rule 3's threshold is three, so a collision flips OVERDUE to ok whenever the
 * true count is exactly three — the silent-starvation failure `LOOPS.md`
 * records five recurrences of.
 *
 * Base rate, so this is not ceremony (94.11): over all 710 revisions of
 * `ROADMAP.md`, a duplicated slice number appears in **3** — the three commits
 * carrying this one collision. The predicate is false of the other 707.
 *
 * Scoped to `ROADMAP.md` alone, and that is sufficient rather than a shortcut:
 * every archived slice leaves a pointer stub behind here, and the two sets were
 * checked equal — 144 stubs here, 144 real sections in `ROADMAP-archive.md`,
 * the same numbers on both sides. A number in use anywhere is therefore visible
 * in this one file. What would break that: deleting a stub instead of leaving
 * one, which is exactly what the 110.4 sweep exists not to do.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { gate, assertScanned, selfTest } from './gate-report.mjs';
import { REPO_ROOT as ROOT } from './paths.mjs';

/** The citation form, and the one thing that is NOT one.
 *
 *  Shared by the gate and its --self-test deliberately: a self-test with its
 *  own copy of the extractor is worthless, because breaking the real one
 *  leaves the copy green (check-loop-vocab.mjs paid for that lesson first).
 *
 *  `\s+` spans a line break on purpose — 12 of the 461 citations in the tree
 *  wrap (`roadmap\n   94.5`), and dropping them would shrink the gate's reach
 *  silently, which is the failure this file exists to prevent.
 */
const CITE = /\broadmap\s+(\d{1,3}(?:\.\d+[a-z]?)?)/gi;
const TALLY_AFTER = /^\s*·\s+[A-Za-z][A-Za-z-]*\s+\d/;
const TALLY_BEFORE = /[A-Za-z][A-Za-z-]*\s+\d+\s*·\s*$/;

export function citationsIn(text) {
  const out = [];
  CITE.lastIndex = 0;
  for (const m of text.matchAll(CITE)) {
    const before = text.slice(Math.max(0, m.index - 40), m.index);
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 40);
    /* A loop-name tally, not a citation: `… Continue 4 · Roadmap 2 · Polish 2`.
       Requires a REAL neighbour of the form `Word Number` joined by ` · ` —
       not merely a middot somewhere nearby, which would skip prose that
       happens to sit in a separated list. */
    if (TALLY_AFTER.test(after) || TALLY_BEFORE.test(before)) continue;
    out.push(m[1]);
  }
  return out;
}

if (process.argv.includes('--self-test')) {
  const tally = '21 rows — Meta 12 · Continue 4 · Roadmap 2 · Polish 2 · Standardize 1; refused 13';
  selfTest([
    ['reads a lowercase citation', citationsIn('see roadmap 179.2 for the commands'), ['179.2']],
    ['reads a bare slice citation', citationsIn('(roadmap 108) shipped this'), ['108']],
    ['reads a sentence-initial one', citationsIn('Roadmap 171.1 measured those three'), ['171.1']],
    ['reads one wrapped over a line', citationsIn('per roadmap\n   94.5, the rule'), ['94.5']],
    ['reads a lettered sub-item', citationsIn('roadmap 94.6a is renumbered'), ['94.6a']],
    ['SKIPS a loop-name tally', citationsIn(tally), []],
    ['skips it at the END of a tally', citationsIn('Meta 12 · Continue 4 · Roadmap 2'), []],
    ['skips it at the START of a tally', citationsIn('Roadmap 2 · Polish 2 · Meta 3'), []],
    ['still reads a citation on a tally line', citationsIn(`${tally}. See roadmap 177.1.`), ['177.1']],
    ['finds nothing in text with no citation', citationsIn('the roadmap says so'), []],
  ]);
}


/** Citations that did not resolve when the roadmap was split (2026-08-25). */
/** Citations that resolved nowhere when the 2026-08-25 sweep ran. Both
 *  predate it: `5` is cited in DESIGN.md from before the current numbering,
 *  and `94.6a` is a sub-item renumbered when its slice was rewritten. */
const KNOWN_DANGLING = new Set(['5', '94.6a']);

/* Same standing-down rule as check-ci-ignores: the docs image copies apps/ and
   packages/, so the roadmap and its archive are legitimately absent. Say the
   citations were NOT verified rather than passing silently. */
const live = await readFile(join(ROOT, 'ROADMAP.md'), 'utf8').catch(() => null);
const archived = await readFile(join(ROOT, 'ROADMAP-archive.md'), 'utf8').catch(() => null);
if (live === null || archived === null) {
  console.log(
    'slice-refs check SKIPPED — ROADMAP.md / ROADMAP-archive.md are not in this\n' +
      '  build context, so the slice citations were NOT verified here.',
  );
  process.exit(0);
}
const corpus = live + archived;

let listing = '';
try {
  listing = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
} catch {
  console.log('slice-refs check SKIPPED — no git in this build context, so the');
  console.log('  citations could not be enumerated and were NOT verified here.');
  process.exit(0);
}
const files = listing
  .split('\n')
  .filter((f) => /\.(css|mjs|js|astro|md|py)$/.test(f) && !f.startsWith('ROADMAP'));

const cites = new Map();
for (const f of files) {
  const t = await readFile(join(ROOT, f), 'utf8').catch(() => '');
  for (const ref of citationsIn(t)) {
    if (!cites.has(ref)) cites.set(ref, new Set());
    cites.get(ref).add(f);
  }
}
assertScanned(cites.size, 'slice citation(s)', 'wrong build context, or the citation style changed?');

const resolves = (ref) =>
  ref.includes('.')
    ? new RegExp(`\\b${ref.replace('.', '\\.')}\\b`).test(corpus)
    : new RegExp(`^## Slice ${ref}\\b`, 'm').test(corpus);

const g = gate('slice-refs check', 'slice citation(s)');

/* Uniqueness first: every check below asks a citation to resolve, and a number
   heading two sections makes "resolves" the wrong question. */
const headings = [...live.matchAll(/^## Slice (\d+)\b/gm)].map((m) => m[1]);
assertScanned(headings.length, 'slice heading(s) in ROADMAP.md', 'has the heading form changed?');
const seen = new Map();
for (const n of headings) seen.set(n, (seen.get(n) ?? 0) + 1);
for (const [n, count] of seen) {
  g.check(
    `slice ${n} heads exactly one section`,
    count === 1,
    `"## Slice ${n}" heads ${count} sections in ROADMAP.md, so every "${n}.x" ` +
      `names two items.\n     Renumber the one filed LATER to the next free ` +
      `number and note the renumber in it; the loop log keeps the old id, ` +
      `because historical rows are left alone (roadmap 175.1).`,
  );
}

for (const [ref, where] of cites) {
  if (KNOWN_DANGLING.has(ref)) continue;
  g.check(
    `roadmap ${ref} resolves`,
    resolves(ref),
    `Cited from ${[...where].slice(0, 3).join(', ')} but found in neither ` +
      `ROADMAP.md nor ROADMAP-archive.md. If the archive was trimmed, put the ` +
      `slice back; the citation is what makes a rule's reason findable.`,
  );
}
g.report(
  `checked (${cites.size} cited, ${KNOWN_DANGLING.size} known-dangling baseline) ` +
    `and ${seen.size} slice number(s) each heading one section`,
);
