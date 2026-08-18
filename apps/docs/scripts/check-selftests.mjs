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
 * nobody has thought about. It REPORTS, rather than fails, on a heuristic gate
 * that has no self-test yet: six were tagged the day this landed, and failing
 * the build for pre-existing debt would only encourage mislabelling them
 * @exact to get green. The count is printed every run so the debt cannot go
 * quiet, and burning it down is roadmap 42.3.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned } from './gate-report.mjs';

const DIRS = ['apps/docs/scripts', 'packages/core/scripts'];

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
    const isHeuristic = src.includes('@heuristic');
    const isExact = src.includes('@exact');

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

if (untagged.length) {
  console.error(`self-test check FAILED — ${untagged.length} gate(s) do not say what kind of signal they use:`);
  for (const u of untagged) console.error('  ' + u);
  console.error('  Add "@heuristic — <why it can be fooled>" or "@exact — <what it compares>" to the header.');
  process.exit(1);
}

console.log(
  `self-test check passed — ${checked} gates classified: ${heuristic} heuristic, ${exact} exact`,
);
if (owed.length) {
  console.log(`  ${owed.length} heuristic gate(s) still owe a --self-test (roadmap 42.3):`);
  for (const o of owed) console.log(`    ${o}`);
}
