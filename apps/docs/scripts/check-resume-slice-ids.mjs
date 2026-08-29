/**
 * Advisory reconciliation: every slice id `.roundtable/RESUME.md` names in
 * backticks, checked against what `ROADMAP.md`'s own checkboxes say about it.
 *
 * Roadmap 186.1. `RESUME.md` is rewritten wholesale every wake and is where the
 * loop states what is open and who each item waits on — but nothing has ever
 * compared that statement to the checkboxes it is a statement ABOUT. The failure
 * is quiet and it has happened: at `751959eb` the hand-off said *"the six older
 * items are still owner-blocked (`112.3`, `112.4`, `173.2`, `175.4`, `176.3`,
 * `15.12`)"* while `175.4` was already `[x]` in `ROADMAP.md`, written one minute
 * earlier by `6c4cfae` — a commit that touched `ROADMAP.md` and not the hand-off.
 * A stale blocked-set is not cosmetic: it is the input dispatcher rule 4 reads,
 * and four consecutive wakes reported "all open items owner-blocked" off one.
 *
 * WHAT IT REPORTS, and what it deliberately does not:
 *
 *   1. Which backticked ids in `RESUME.md` `ROADMAP.md` records as `[x]` closed.
 *      It CANNOT tell a stale claim from a legitimate historical reference —
 *      "what the owner settled in `173.2`" is fine, "`173.2` is still blocked"
 *      is not — and it does not try. That is the semantic-vs-shape line
 *      CLAUDE.md draws (94.11): a check can enforce the shape that carries a
 *      property, never what prose MEANS. The reader judges; this names the ids
 *      worth re-reading.
 *   2. Its open- and closed-item counts, each reconciled against a raw count of
 *      the same lines in `ROADMAP.md` — the guard `generate_status.py` applies,
 *      and the one CLAUDE.md's `STATUS.md` failure (7 of 9 open items, for
 *      weeks) is written down for. Reconciled against the FILE. Nothing is
 *      passed in, so there is no argument for it to agree with itself about.
 *
 * BASE RATE, measured before this was written rather than asserted, over every
 * revision of `RESUME.md` that has a `ROADMAP.md` beside it:
 *
 *     revisions with both files: 86; fired (>=1 closed id named): 8 (9%)
 *     closed-count distribution: {0: 78, 1: 3, 2: 3, 3: 2}
 *
 * So it is neither dead nor always-on — 78 of 86 revisions report nothing, and
 * HEAD reports three (`173.2`, `185.1`, `186.2`, all historical references).
 * 186.1's own premise put this at "2 of 58 wake-ends (3%)"; that is a different
 * unit (wake-ends, not revisions) measured with a parser that could not derive
 * an id for an unnumbered item, so the two figures are not in conflict and
 * neither is quoted as the other. Re-run it — these are snapshots:
 *
 *     git log --format=%H -- .roundtable/RESUME.md    # then, per revision,
 *     git show <rev>:.roundtable/RESUME.md | grep -oE '`[0-9]{1,3}\.[0-9]{1,2}`'
 *     git show <rev>:ROADMAP.md                       # ids + state, as below
 *
 * @heuristic — the verdict rests on RECOGNISING two things, and one of them is
 *   positional. An item's id is normally the bold text right after the checkbox
 *   (`1. [ ] **190.1 — …**`), but four open items carry no id there at all, and
 *   `12. [ ] **AT runtime evidence**` under `## Slice 15` is `15.12` only
 *   because of where it sits. Deriving an id from position is exactly the kind
 *   of recognition that can be fooled, and 186.1 records the first draft of its
 *   own measuring parser reading 4 of 5 by dropping those items. The
 *   `--self-test` below is what that tag owes.
 *
 * FENCES ARE NOT SKIPPED, DELIBERATELY — this file's sibling
 * `check-resume-charter.mjs` does skip them, and the difference is the point.
 * The reconciliation in (2) is against the raw command 186.1's Accept names
 * (`grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md`), which knows nothing about code
 * fences. A parser that skipped them would disagree with that command the first
 * time someone pasted a checkbox into a shell recipe, and the disagreement
 * would look like a parse bug rather than a scope difference. Same scope, same
 * answer, or a loud refusal.
 *
 * ADVISORY, from `record_iteration.py` — not `check:repo`. `.roundtable/**` is
 * in CI's `paths-ignore`, so a CI gate reading the hand-off is the contradiction
 * 169.4/175.3 resolved once already; and failing a build over a stale hand-off
 * would block the work the loop exists to do. The trade, stated: nothing
 * rejects a commit that leaves the hand-off stale. What runs every wake is the
 * recording step, which is where this lives.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';

const RESUME = join(REPO_ROOT, '.roundtable', 'RESUME.md');
const ROADMAP = join(REPO_ROOT, 'ROADMAP.md');

/** `## Slice 190 — …`. The enclosing slice supplies the major half of an id. */
const SLICE_HEADING = /^## Slice ([0-9]+)\b/;

/**
 * The checkbox line, spelled to match the raw `grep -cE '^\s*[0-9]+\. \[ \]'`
 * character for character on the part that selects lines. Widening either side
 * of this without widening that command is what makes a reconciliation lie.
 */
const CHECKBOX = /^\s*([0-9]+)\. \[( |x)\] (.*)$/;

/** `**190.1 — …` — the id the author wrote, where they wrote one. */
const BOLD_ID = /^\*\*([0-9]+\.[0-9]+)\b/;

/**
 * A backticked id in the hand-off. The closing backtick has to follow the minor
 * number immediately, which is what keeps `0.1.0` — every npm version this file
 * quotes — from being read as slice 0.1.
 */
const NAMED_ID = /`([0-9]{1,3}\.[0-9]{1,2})`/g;

/**
 * Every checkbox item in `ROADMAP.md`, as `{ id, state, line, derived, bold }`.
 *
 * The bold id WINS where there is one; position is the fallback that rescues
 * the unnumbered items. Measured on the live file before choosing that order:
 * of 40 checkbox items, 36 carry a bold id and it agrees with the derived id in
 * **36 of 36**, 0 disagree, and the 4 without one (`29.1`, `29.2`, `15.11`,
 * `15.12`) derive correctly. Position alone is not safe in general — the same
 * derivation disagrees with the bold id 30 times in `ROADMAP-archive.md`, where
 * slices have been merged and renumbered — which is the measured reason this
 * reads `ROADMAP.md` only, as 186.1's Accept says.
 */
export const itemsIn = (src) => {
  const out = [];
  let slice = null;
  let n = 0;
  for (const line of src.split('\n')) {
    n += 1;
    const heading = SLICE_HEADING.exec(line);
    if (heading) {
      slice = heading[1];
      continue;
    }
    const box = CHECKBOX.exec(line);
    if (!box) continue;
    const [, num, state, rest] = box;
    const bold = BOLD_ID.exec(rest)?.[1] ?? null;
    const derived = slice === null ? null : `${slice}.${num}`;
    out.push({ id: bold ?? derived, state, line: n, derived, bold });
  }
  return out;
};

/** The ids `RESUME.md` names, deduplicated, in the order they first appear. */
export const namedIn = (src) => [...new Set([...src.matchAll(NAMED_ID)].map((m) => m[1]))];

/**
 * The independent count: the same lines, counted without the parser above. This
 * is the whole reconciliation, so it may not share a regex with `itemsIn` — a
 * check that re-uses the parser it is checking agrees with itself by
 * construction, which is the defect CLAUDE.md records as costing a red-proof.
 */
export const rawCount = (src, state) =>
  src.split('\n').filter((line) => new RegExp(`^\\s*[0-9]+\\. \\[${state}\\] `).test(line)).length;

if (process.argv.includes('--self-test')) {
  const ROADMAP_SAMPLE = [
    '## Slice 190 — a heading',
    '1. [ ] **190.1 — bold id present**',
    '2. [x] **190.2 — closed**',
    '## Slice 15 — an older heading',
    '12. [ ] **AT runtime evidence** — no id in the bold',
  ].join('\n');
  const RENUMBERED = ['## Slice 65 — merged', '1. [x] **58.3 — kept its old id**'].join('\n');

  const items = itemsIn(ROADMAP_SAMPLE);
  const byId = Object.fromEntries(items.map((i) => [i.id, i.state]));
  const cases = [
    ['a bold id is read as the item id', byId['190.1'] === ' '],
    ['a closed item is read as closed', byId['190.2'] === 'x'],
    /* The defect 186.1 records in its own measuring parser: an item with no
       numeric id in the bold read 4 of 5 by being dropped. */
    ['an unnumbered item derives its id from the enclosing slice', byId['15.12'] === ' '],
    ['no checkbox item is dropped', items.length === 3 && items.every((i) => i.id !== null)],
    /* Position is the fallback, never the override — proved on the shape that
       actually occurs, 30 times, in ROADMAP-archive.md. */
    [
      'a bold id beats the derived one when they disagree',
      itemsIn(RENUMBERED)[0].id === '58.3' && itemsIn(RENUMBERED)[0].derived === '65.1',
    ],
    /* The raw count must see exactly what the parser sees, fences included —
       that equality is the reconciliation. */
    ['the raw open count matches the parser', rawCount(ROADMAP_SAMPLE, ' ') === 2],
    ['the raw closed count matches the parser', rawCount(ROADMAP_SAMPLE, 'x') === 1],
    ['a fenced checkbox is counted by BOTH, not skipped by one', rawCount('```\n1. [ ] **9.1 — x**\n```', ' ') === 1 && itemsIn('## Slice 9 — h\n```\n1. [ ] **9.1 — x**\n```').length === 1],
    /* The needle, on the two strings this repo's hand-off is full of. */
    ['a backticked id is named', namedIn('the `190.1` item').join() === '190.1'],
    ['an unbackticked id is not named', namedIn('roadmap 190.1 says').length === 0],
    ['a version string is not read as a slice id', namedIn('`0.1.0` and `0.5.0`').length === 0],
    ['ids are deduplicated', namedIn('`186.1` then `186.1`').length === 1],
  ];
  const bad = cases.filter(([, ok]) => !ok);
  for (const [what, ok] of cases) console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${what}`);
  if (bad.length) {
    console.error(`resume slice-ids self-test FAILED — ${bad.length} case(s) misclassified.`);
    process.exit(1);
  }
  console.log(`resume slice-ids self-test passed — ${cases.length} cases classified correctly`);
  process.exit(0);
}

/* Same contract as check-resume-charter.mjs: neither file is in the docs image,
   so this must say it did not run rather than report a pass it did not earn. */
const read = async (path, what) => {
  try {
    return await readFile(path, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    console.log(
      `resume slice-ids: ${what} is not in this build context, so RESUME.md's ` +
        'slice-id claims were NOT reconciled.',
    );
    return null;
  }
};

const resume = await read(RESUME, '.roundtable/RESUME.md');
const roadmap = resume === null ? null : await read(ROADMAP, 'ROADMAP.md');
if (resume === null || roadmap === null) process.exit(0);

const items = itemsIn(roadmap);
const open = items.filter((i) => i.state === ' ');
const closed = items.filter((i) => i.state === 'x');

/* Refuse to print a verdict when the parser and the raw file disagree. An
   under-reporting mirror is worse than none, because its number gets quoted. */
const mismatches = [
  ['open', open.length, rawCount(roadmap, ' ')],
  ['closed', closed.length, rawCount(roadmap, 'x')],
].filter(([, parsed, raw]) => parsed !== raw);

if (mismatches.length) {
  for (const [what, parsed, raw] of mismatches) {
    console.error(
      `resume slice-ids REFUSED — parsed ${parsed} ${what} item(s), the raw count of\n` +
        `  '^\\s*[0-9]+\\. \\[${what === 'open' ? ' ' : 'x'}\\] ' lines in ROADMAP.md says ${raw}.`,
    );
  }
  console.error('  No verdict printed. Fix the parser against the file; do not adjust the file.');
  process.exit(1);
}

const idless = items.filter((i) => i.id === null);
if (idless.length) {
  console.error(
    `resume slice-ids REFUSED — ${idless.length} checkbox item(s) sit above the first\n` +
      `  '## Slice N' heading and carry no bold id, so they have no id to reconcile:\n` +
      idless.map((i) => `    ROADMAP.md:${i.line}`).join('\n'),
  );
  process.exit(1);
}

const state = new Map(items.map((i) => [i.id, i.state]));
const named = namedIn(resume);
const stale = named.filter((id) => state.get(id) === 'x');
const unknown = named.filter((id) => !state.has(id));

console.log(
  `resume slice-ids: ROADMAP.md has ${open.length} open and ${closed.length} closed item(s) ` +
    `(both reconciled against a raw count of the file); RESUME.md names ${named.length}.`,
);
if (unknown.length) {
  console.log(
    `  ${unknown.length} named id(s) are not in ROADMAP.md at all — normally archived, ` +
      `not a finding: ${unknown.join(', ')}`,
  );
}
if (!stale.length) {
  console.log('  no named id is recorded [x] closed.');
  process.exit(0);
}

console.log(
  `  ${stale.length} named id(s) are recorded [x] CLOSED in ROADMAP.md: ${stale.join(', ')}\n` +
    "  Re-read what RESUME.md says about each. A historical reference is fine; a claim\n" +
    '  that one is open, blocked or queued is the staleness 186.1 is about, and it is\n' +
    '  what dispatcher rule 4 reads. This check cannot tell the two apart — you can.',
);
process.exit(1);
