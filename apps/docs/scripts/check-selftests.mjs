/**
 * Meta-gate: every gate declares what kind of signal it uses, and a heuristic
 * one is expected to prove it can fail.
 *
 * @heuristic — three of its four legs recognise a pattern in text: a tag at a
 *   declaration position, an argv branch in source, and a case count in a child
 *   process's prose. Retagged by roadmap 334.1; the measurement is below.
 *
 * WHY. Across Slices 39-41 the dominant failure was not a bug in the framework
 * but a detector that could not fail: three of them, and 39.2 alone produced
 * FOUR in a row that passed 18/18 while measuring nothing. Each looked healthy —
 * green, fast, specific — and each was measuring the docs shell instead of the
 * page.
 *
 * A gate that cannot fail is worse than no gate, because it reports safety it
 * never checked. So each gate now states which kind it is:
 *
 *   `@heuristic` — the verdict rests on recognising something (a position, a
 *     pattern, whether a class is chrome or content). These can be fooled, and
 *     have been, so they are expected to ship `--self-test`: run the detector
 *     against inputs it must classify correctly and fail if it cannot tell them
 *     apart.
 *   `@exact` — the verdict rests on equality, membership, or a measurement taken
 *     in a real browser. There is no judgement to get wrong. Exempt, and stated
 *     so nobody wraps ceremony around a `readdir`.
 *
 * The backticks on those two names are load-bearing, and finding that out is a
 * finding (334.1). This glossary is prose ABOUT the tags, but it sat at the
 * declaration position, so the moment this file stopped exempting itself from
 * its own scan it read as claiming BOTH tags and the gate went red on itself.
 * That is CLAUDE.md's "an assertion that can be tripped by its own explanation",
 * arriving in the file that documents it — and it is the same defect `18791d5`
 * fixed here for every OTHER gate, surviving only because this one was exempt.
 * Quote a tag name whenever you write one in prose in a gate header.
 *
 * This gate FAILS on an untagged gate, because an unclassified detector is one
 * nobody has thought about, AND on a heuristic gate with no `--self-test`, AND
 * — since roadmap 315.3 — on one whose `--self-test` does not actually RUN.
 *
 * THE THIRD RUNG: mention -> implementation -> reachable. The first two were
 * closed here (see the `owed` comment below); the third was not, and the gap is
 * not hypothetical. 315.1 found `check-ci-ignores.mjs` with a real, correct
 * `--self-test` block sitting BELOW a `ci.yml` read that returned first, so
 * `node check-ci-ignores.mjs --self-test` exited **0 having classified nothing**
 * — indistinguishable, to a grep and to an exit code alike, from 18 passing
 * cases. Reading the source cannot answer reachability; running it can.
 *
 * So each heuristic gate is EXECUTED with `--self-test`, and must exit 0 AND
 * print a line matching SELF_TEST_MARKER — a case count, which is the one thing
 * an unreachable branch cannot produce. Exit code alone would not have caught
 * 315.1, and that is the whole reason the marker exists rather than a bare rc
 * check.
 *
 * WHAT THIS STILL CANNOT SEE, said plainly: the count is printed by the gate,
 * so a gate could print a literal. Every one of them derives it from the case
 * list it just executed (`cases.length`), which is a reading of the code, not
 * something enforced here — the same shape as `check:wrong-choice` gating the
 * clause's presence and leaving what it says to a human.
 *
 * THE TAG WAS `@exact` WITH A CAVEAT, AND 334.1 RETAGGED IT — the caveat was
 * right and was understated. It read "closer to recognising a pattern than to
 * comparing two values, and a per-case label that itself contained the words
 * 'self-test passed — 3 cases' would satisfy it". That was a hypothesis; it was
 * then run, and it holds exactly (2026-09-09):
 *
 *   a probe gate carrying 315.1's defect verbatim — a real `--self-test` branch
 *   sitting below an early `process.exit(0)` — plus ONE line of prose reading
 *   `self-test: a label that says self-test passed — 3 cases    ok`
 *     -> this gate reported PASS, "56 gates … 22 heuristic (175 cases)"
 *   the identical probe with that one line changed to `console.log('probe ran')`
 *     -> this gate reported FAIL, naming 315.1's defect
 *
 * So the verdict on the rung built to catch unreachability turns on a line of
 * prose, and the case count published to the npm front page took **+3 cases**
 * from a probe that ran none. That is the tag definition above almost verbatim —
 * the verdict rests on recognising a pattern, it can be fooled, and it has been.
 *
 * IT WAS NEVER THE MARKER ALONE, which is why 334.1's premise ("its verdict used
 * to rest on a readdir and a tag comparison") is recorded here as false. Two of
 * the three text legs predate the marker and both have produced a wrong verdict
 * on the real tree: this file's first version decided `owed` by matching the
 * string "--self-test", which every heuristic gate satisfied because the tag TEXT
 * says "Carries --self-test"; and until `18791d5` it classified tags with
 * `src.includes(...)`, so a header explaining a retag — naming the tag it no
 * longer carried — read as claiming both. That repair's own first draft then
 * reported eight gates untagged. A positional regex over source is recognising a
 * position, which is this file's own example of the heuristic kind.
 *
 * WHAT THE RETAG COST, since it was filed as a decision rather than a detail:
 * this file had excluded itself from its own scan and no longer does, so the two
 * counts `derive-readme-facts` stamps onto the npm front page each rose by one
 * (55/21/34 -> 56/22/34, the exact count unmoved) and both READMEs were
 * re-stamped in the same commit, which `stamp-readme.mjs --check` gates inside
 * the core build.
 *
 * ⚠ AND THE `--self-test` BRANCH MUST SIT ABOVE THE SPAWN LOOP, WHICH IS 315.1
 * INVERTED. This gate spawns every heuristic gate with `--self-test`, and it is
 * now one of them, so it spawns itself. 315.1's defect was a self-test branch too
 * LOW to be REACHED; here a branch too low does not fail to run, it fails to
 * terminate. Measured, because the first attempt to prove it came back green:
 *
 *   branch below the spawn loop   did NOT terminate; killed at 30s
 *   branch where it now is        0.041s
 *
 * The green attempt is the useful half. It moved the branch below `scanGates()`
 * but still ABOVE the loop, and that terminates fine — `scanGates` is a pure read
 * and spawns nothing. So the constraint is the spawn loop, not the scan, and the
 * first version of this paragraph said "below the scan" and was wrong. That is
 * CLAUDE.md's rule landing on the claim written beside the finding: a red-proof
 * that comes back green is a defect in the injection until proven otherwise, and
 * here it was a defect in the sentence the injection was testing.
 *
 * The `owed` regex cannot see any of this — it asks whether the branch exists,
 * never where.
 *
 * NO VALUE IS PINNED HERE ANY MORE (roadmap 362, 2026-09-08). This paragraph
 * read "scanGates() reports 54/20/34 today, so including this file makes it
 * 55/21/34"; a day later check-print-tokens.mjs landed and the live reading
 * became 55/21/34 WITHOUT the retag — so the forecast value had become the
 * current value, which reads as if the retag were already done. Read the line
 * this gate prints on every run instead: including this file raises the total
 * and the heuristic count by one each and leaves the exact count alone.
 *
 * It began as a report rather than a failure: six gates were tagged the day it
 * landed, and failing the build for pre-existing debt would only have
 * encouraged relabelling them `@exact` to get green. The list was printed every
 * run so it could not go quiet, and 42.3 emptied it the next day. Now that it is
 * zero, the rule is enforced — which is the point of writing debt down instead
 * of tolerating it.
 */
import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const DIRS = ['apps/docs/scripts', 'packages/core/scripts'];

/**
 * THE MARKER CONTRACT (roadmap 315.3): a passing `--self-test` prints a line
 * saying `self-test passed` and naming how many cases it classified.
 *
 * It is deliberately a FORMAT rather than a shared function. `selfTest()` in
 * gate-report.mjs already emits a conforming line for the fifteen gates that
 * can import it — but three of the twenty live in `packages/core/scripts`, and
 * core must not import from `apps/docs`. A format is the only contract both
 * packages can hold. It was written to accept BOTH shapes already in the tree,
 * so adopting it moved three gates, not twenty:
 *
 *   self-test passed — the detector can fail (18 cases)      gate-report.mjs, 15 gates
 *   resume charter self-test passed — 9 cases classified …   check-resume-*, 2 gates
 *
 * The three that moved (check-markup, check-size, check-rf-floor) printed a
 * passing verdict with no count at all.
 */
export const SELF_TEST_MARKER = /self-test passed\b[^\n]*?\b(\d+) cases?\b/;

/**
 * A DECLARATION, not a mention — the same distinction `runsSelfTest` draws, which
 * this line did not draw until 2026-08-28. A plain `src.includes('@exact')` cannot
 * tell the tag from prose ABOUT the tag, so a gate whose header explains why it
 * was retagged — naming the tag it no longer carries — was reported as claiming
 * both. That is CLAUDE.md's "assert on structure, never on raw text": the comment
 * written to explain a removal legitimately names the thing removed. So match the
 * tag at its declaration position, in BOTH comment styles in use here (` * @exact`
 * in a JSDoc block, `// @exact` as a line comment).
 *
 * Fail-closed either way — it over-reported, never under — so no earlier verdict
 * was wrong.
 *
 * Reconciled against the UNCHANGED tree, not only the edited one, and that is
 * what caught this regex's own first draft: allowing the JSDoc form alone
 * reported eight gates as untagged. Corrected, it reproduces the known pre-change
 * reading exactly (43 gates: 12 heuristic, 31 exact) and shows only the one
 * deliberate move after it (43: 13 / 30).
 *
 * Module-level and exported since 334.1, so the `--self-test` below can drive it
 * against fixtures. It was an inline closure inside `scanGates`, which is exactly
 * the shape a self-test cannot reach.
 */
export const declaresTag = (src, tag) =>
  new RegExp(String.raw`^\s*(?:\*|//)?\s*${tag}\b`, 'm').test(src);

/**
 * An IMPLEMENTATION, not a mention. The first version matched the string
 * "--self-test" and every heuristic gate passed — because the tag text itself
 * says "Carries --self-test". The meta-gate written to catch detectors that
 * cannot fail was, for one run, a detector that could not fail. It now requires
 * the argv branch that actually runs one.
 *
 * Still text recognition, and still foolable in the other direction: this exact
 * call spelled inside a comment or a string satisfies it. That is one of the
 * three legs behind this file's own `@heuristic` tag.
 */
export const runsSelfTest = (src) => /process\.argv\.includes\(['"]--self-test['"]\)/.test(src);

/**
 * Run one gate's `--self-test` and report what it did. Never called at import
 * time — see the run guard at the foot of this file. `scanGates()` stays a pure
 * read, because `derive-readme-facts.mjs` imports it to stamp a number on the
 * npm front page and must not spawn twenty processes to do so.
 */
export function runSelfTest(rel) {
  const r = spawnSync(process.execPath, [rel, '--self-test'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: 120_000,
  });
  /* `status` is null when the process never ran or was killed — a spawn error, or
     the timeout above. `r.error` is the only thing that says which, and without
     it the report reads "exited null", which names nothing. */
  const out = [r.stdout, r.stderr, r.error ? `spawn error: ${r.error.message}` : '']
    .filter(Boolean)
    .join('');
  const m = SELF_TEST_MARKER.exec(out);
  return { status: r.status, cases: m ? Number(m[1]) : null, out };
}

/* Exported so the ONE consumer that publishes this count — `stamp-readme`, via
   `derive-readme-facts.mjs` (roadmap 249.4) — reads it from the gate rather
   than re-deriving it. A second regex over the same tree is the drift the
   Standardize playbook's lane 2 exists to catch, and here it would drift into
   a number on the npm front page. The classifier below has already been wrong
   once in exactly that way (the `--self-test` mention-vs-implementation bug),
   so a copy of it is a copy of a known trap. */
export async function scanGates() {
  const untagged = [];
  const owed = [];
  const heuristicPaths = [];
  let heuristic = 0;
  let exact = 0;
  let checked = 0;

  for (const dir of DIRS) {
    for (const name of await readdir(join(REPO_ROOT, dir))) {
      if (!name.startsWith('check-') || !name.endsWith('.mjs')) continue;
      /* This file USED to exclude itself here. 334.1 removed the exclusion along
         with the `@exact` tag that made it defensible: a gate exempt from its own
         rule is the one detector nothing in this repo checks. */
      checked += 1;
      const src = await readFile(join(REPO_ROOT, dir, name), 'utf8');
      const isHeuristic = declaresTag(src, '@heuristic');
      const isExact = declaresTag(src, '@exact');

      if (isHeuristic === isExact) {
        untagged.push(
          `${dir}/${name}\n     ${isHeuristic ? 'claims BOTH @heuristic and @exact' : 'has no @heuristic or @exact tag'}`,
        );
        continue;
      }
      if (isHeuristic) {
        heuristic += 1;
        heuristicPaths.push(`${dir}/${name}`);
        if (!runsSelfTest(src)) owed.push(`${dir}/${name}`);
      } else {
        exact += 1;
      }
    }
  }

  assertScanned(checked, 'gate scripts', 'no check-*.mjs files were found — have the script directories moved?');
  return { checked, heuristic, exact, untagged, owed, heuristicPaths };
}

/* Only when RUN, never when imported. `scanGates` above is the importable half;
   everything below is the gate. Without this guard, importing the scan would
   run the gate — including its `process.exit(1)` — inside whatever tool did the
   importing. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  /* FIRST, above the SPAWN LOOP, and see the header for the measurement: this
     gate spawns every heuristic gate with `--self-test` and is now one of them,
     so a branch below that loop does not terminate. Above the scan is stricter
     than needed and is where it stays, because the loop is what may move.

     The three predicates below are the three text legs the `@heuristic` tag
     names; each fixture pair is a discrimination this file has actually got
     wrong, or has been shown to get wrong. */
  if (process.argv.includes('--self-test')) {
    const marker = (out) => {
      const m = SELF_TEST_MARKER.exec(out);
      return m ? Number(m[1]) : null;
    };
    selfTest([
      ['a JSDoc tag line declares it', declaresTag(' * @exact — compares two values.', '@exact'), true],
      ['a line-comment tag declares it', declaresTag('// @heuristic — recognises a shape.', '@heuristic'), true],
      [
        'prose ABOUT a tag does not declare it',
        declaresTag(' * retagged from @exact because it recognises prose.', '@exact'),
        false,
      ],
      ['an absent tag is not declared', declaresTag(' * @heuristic — nothing here.', '@exact'), false],
      [
        'a --self-test MENTION is not an implementation',
        runsSelfTest(' * these gates are expected to ship `--self-test`.'),
        false,
      ],
      [
        /* Split so the literal does not appear in this file. Spelled whole, this
           fixture would itself satisfy `runsSelfTest` against THIS source, so the
           file could never be reported as owing a self-test even if the real
           branch above were deleted — a mention standing in for an
           implementation, which is the very discrimination this case asserts. */
        'the argv branch is an implementation',
        runsSelfTest('if (process.argv' + ".includes('--self-test')) run();"),
        true,
      ],
      ['the gate-report marker shape reads its count', marker('self-test passed — the detector can fail (18 cases)'), 18],
      ['the resume-charter marker shape reads its count', marker('resume charter self-test passed — 9 cases classified correctly'), 9],
      ['a singular case count is read', marker('self-test passed — the detector can fail (1 case)'), 1],
      ['a passing verdict with no count reads null', marker('self-test passed, everything fine'), null],
      ['silence reads null', marker(''), null],
    ]);
  }

  const { checked, heuristic, exact, untagged, owed, heuristicPaths } = await scanGates();

  /* Only run the ones that HAVE a branch — a gate already in `owed` would
     otherwise be reported twice, once for the missing branch and once for the
     marker it could not print. */
  const ranBadly = [];
  let noMarker = 0;
  let totalCases = 0;
  for (const rel of heuristicPaths) {
    if (owed.includes(rel)) continue;
    const { status, cases, out } = runSelfTest(rel);
    if (status !== 0) {
      /* A red self-test is the ordinary failure — the gate's own detector could
         not classify its fixtures — and its output already says which case. */
      ranBadly.push(`${rel}\n     --self-test exited ${status}\n${indent(out)}`);
    } else if (cases === null) {
      noMarker += 1;
      ranBadly.push(
        `${rel}\n     --self-test exited 0 but printed no case count, so nothing proves the\n` +
          `     branch was reached at all — this is roadmap 315.1's defect exactly.\n${indent(out)}`,
      );
    } else if (cases < 1) {
      noMarker += 1;
      ranBadly.push(`${rel}\n     --self-test reported ${cases} cases; a self-test that asserts nothing cannot fail`);
    } else {
      totalCases += cases;
    }
  }

  if (untagged.length || owed.length || ranBadly.length) {
    console.error(
      `self-test check FAILED — ${untagged.length + owed.length + ranBadly.length} problem(s):`,
    );
    for (const u of untagged) console.error('  ' + u);
    if (untagged.length) {
      console.error('  Add "@heuristic — <why it can be fooled>" or "@exact — <what it compares>" to the header.');
    }
    for (const o of owed) {
      console.error(`  ${o}\n     is @heuristic but has no --self-test`);
    }
    if (owed.length) {
      console.error('  A heuristic detector must prove it can fail: run it against inputs it must');
      console.error('  classify correctly and exit non-zero if it cannot tell them apart.');
    }
    for (const u of ranBadly) console.error('  ' + u);
    if (noMarker) {
      console.error('  A passing --self-test must print a line naming how many cases it classified,');
      console.error('  e.g. "self-test passed — the detector can fail (7 cases)". A branch that never');
      console.error('  runs exits 0 in silence, which is what this rung exists to catch.');
    }
    process.exit(1);
  }

  console.log(
    `self-test check passed — ${checked} gates classified: ${heuristic} heuristic ` +
      `(all self-tested; ${totalCases} cases actually run), ${exact} exact`,
  );
}

/* The last few lines of a gate's own output, indented under the report. Empty
   is the INTERESTING case — a branch that never ran says nothing at all — so it
   returns a sentence rather than a lone indented blank line. */
function indent(text) {
  const lines = String(text).trimEnd().split('\n').filter(Boolean);
  if (!lines.length) return '       (it printed nothing at all)';
  return lines
    .slice(-6)
    .map((l) => '       ' + l)
    .join('\n');
}
