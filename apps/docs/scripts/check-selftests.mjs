/**
 * Meta-gate: every gate declares what kind of signal it uses, and a heuristic
 * one is expected to prove it can fail.
 *
 * @exact — reads a tag from every gate file and compares counts. Exempt from
 *   --self-test: there is no judgement to get wrong.
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
 *   @heuristic — the verdict rests on recognising something (a position, a
 *     pattern, whether a class is chrome or content). These can be fooled, and
 *     have been, so they are expected to ship `--self-test`: run the detector
 *     against inputs it must classify correctly and fail if it cannot tell them
 *     apart.
 *   @exact — the verdict rests on equality, membership, or a measurement taken
 *     in a real browser. There is no judgement to get wrong. Exempt, and stated
 *     so nobody wraps ceremony around a `readdir`.
 *
 * This gate FAILS on an untagged gate, because an unclassified detector is one
 * nobody has thought about, AND on a heuristic gate with no `--self-test`.
 *
 * It began as a report rather than a failure: six gates were tagged the day it
 * landed, and failing the build for pre-existing debt would only have
 * encouraged relabelling them `@exact` to get green. The list was printed every
 * run so it could not go quiet, and 42.3 emptied it the next day. Now that it is
 * zero, the rule is enforced — which is the point of writing debt down instead
 * of tolerating it.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned } from './gate-report.mjs';

const DIRS = ['apps/docs/scripts', 'packages/core/scripts'];

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
  let heuristic = 0;
  let exact = 0;
  let checked = 0;

  for (const dir of DIRS) {
    for (const name of await readdir(join(REPO_ROOT, dir))) {
      if (!name.startsWith('check-') || !name.endsWith('.mjs')) continue;
      if (name === 'check-selftests.mjs') continue;
      checked += 1;
      const src = await readFile(join(REPO_ROOT, dir, name), 'utf8');
    /* A DECLARATION, not a mention — the same distinction the `--self-test`
       comment below draws, which this line did not draw until 2026-08-28. A
       plain `src.includes('@exact')` cannot tell the tag from prose ABOUT the
       tag, so a gate whose header explains why it was retagged — naming the tag
       it no longer carries — was reported as claiming both. That is CLAUDE.md's
       "assert on structure, never on raw text": the comment written to explain
       a removal legitimately names the thing removed. So match the tag at its
       declaration position, in BOTH comment styles in use here (` * @exact` in
       a JSDoc block, `// @exact` as a line comment).

       Fail-closed either way — it over-reported, never under — so no earlier
       verdict was wrong.

       Reconciled against the UNCHANGED tree, not only the edited one, and that
       is what caught this regex's own first draft: allowing the JSDoc form
       alone reported eight gates as untagged. Corrected, it reproduces the
       known pre-change reading exactly (43 gates: 12 heuristic, 31 exact) and
       shows only the one deliberate move after it (43: 13 / 30). */
      const declares = (tag) => new RegExp(String.raw`^\s*(?:\*|//)?\s*${tag}\b`, 'm').test(src);
      const isHeuristic = declares('@heuristic');
      const isExact = declares('@exact');

      if (isHeuristic === isExact) {
        untagged.push(
          `${dir}/${name}\n     ${isHeuristic ? 'claims BOTH @heuristic and @exact' : 'has no @heuristic or @exact tag'}`,
        );
        continue;
      }
      if (isHeuristic) {
        heuristic += 1;
        /* An IMPLEMENTATION, not a mention. The first version matched the string
           "--self-test" and every heuristic gate passed — because the tag text
           itself says "Carries --self-test". The meta-gate written to catch
           detectors that cannot fail was, for one run, a detector that could not
           fail. It now requires the argv branch that actually runs one. */
        if (!/process\.argv\.includes\(['"]--self-test['"]\)/.test(src)) owed.push(`${dir}/${name}`);
      } else {
        exact += 1;
      }
    }
  }

  assertScanned(checked, 'gate scripts', 'no check-*.mjs files were found — have the script directories moved?');
  return { checked, heuristic, exact, untagged, owed };
}

/* Only when RUN, never when imported. `scanGates` above is the importable half;
   everything below is the gate. Without this guard, importing the scan would
   run the gate — including its `process.exit(1)` — inside whatever tool did the
   importing. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { checked, heuristic, exact, untagged, owed } = await scanGates();

  if (untagged.length || owed.length) {
    console.error(`self-test check FAILED — ${untagged.length + owed.length} problem(s):`);
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
    process.exit(1);
  }

  console.log(
    `self-test check passed — ${checked} gates classified: ${heuristic} heuristic (all self-tested), ${exact} exact`,
  );
}
