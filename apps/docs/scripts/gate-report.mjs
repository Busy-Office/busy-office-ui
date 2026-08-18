/**
 * The shared pass/fail/exit contract for assertion-style gates.
 *
 * check-claims.mjs and check-po-app.mjs had byte-identical copies of the
 * collect → print FAILs → exit(1) block plus an identical `check()` helper
 * (Standardize sweep, 2026-08-18). This is not a one-liner worth inlining: it
 * is the contract that decides whether CI goes red. If two copies drift — one
 * moved to `process.exitCode`, one left on `process.exit`, or a future third
 * gate copies whichever it happened to find — the failure mode is a gate that
 * reports failures and exits 0. Fail-open is the one bug a gate must not have.
 *
 *   const g = gate('claims check', 'documented behaviours');
 *   g.check('thing holds', actual === expected, JSON.stringify({ actual }));
 *   g.report();   // prints, and exits 1 if anything failed
 */
/**
 * A gate that examined nothing has not passed — it failed to run.
 *
 * Four gates ended their run with `passed — ${checked} thing(s)` where `checked`
 * came from walking the filesystem, so a walk that found nothing printed
 * "passed — 0" and exited 0 (Standardize sweep, 2026-08-18). The same bug was
 * confirmed shipping in `bo-check-markup`, which consumers were told to wire
 * into CI one wake earlier: pointed at `build/` instead of `dist/`, or run
 * before the build, it reported a pass over zero files.
 *
 * Nothing about that is loud. A green check that validated nothing looks
 * exactly like a green check that validated everything, which makes it worse
 * than having no gate — CLAUDE.md: a gate that cannot run must fail loudly,
 * never skip quietly.
 *
 *   assertScanned(checked, 'relative imports', 'is the repo checked out?');
 */
export function assertScanned(count, what, hint = '') {
  if (count > 0) return;
  console.error(`gate FAILED — found no ${what} to check, so this gate verified nothing.`);
  if (hint) console.error(`  ${hint}`);
  console.error('  Exiting non-zero rather than reporting a pass it did not earn.');
  process.exit(1);
}

export function gate(label, noun) {
  const results = [];
  return {
    /** Record one assertion. `detail` is printed only when it fails. */
    check(claim, pass, detail) {
      results.push({ claim, pass, detail });
    },
    get results() {
      return results;
    },
    /** Print and exit. Never returns when something failed. */
    report(passSuffix = 'verified') {
      const failed = results.filter((r) => !r.pass);
      for (const r of failed) console.log(`FAIL ${r.claim}\n     ${r.detail}`);
      if (failed.length) {
        console.error(`${label} FAILED — ${failed.length} of ${results.length} ${noun} do not hold`);
        process.exit(1);
      }
      console.log(`${label} passed — ${results.length} ${noun} ${passSuffix}`);
    },
  };
}

/**
 * The shared shape of a `--self-test`: run a heuristic detector against inputs
 * it must classify correctly, print each verdict, and exit non-zero if it
 * cannot tell them apart.
 *
 * Seven gates grew a self-test in one day (roadmap 42.1/42.3) and six of them
 * hand-copied the same accumulate-print-exit block — one decision stored seven
 * times, which is how the source-skip list and the outcome vocabulary drifted
 * before it (Standardize sweeps, 2026-08-19).
 *
 * An EMPTY case list fails. A self-test with nothing in it is precisely the
 * detector-that-cannot-fail defect these exist to prevent, one level up, and
 * this helper would otherwise be the perfect place to hide one.
 *
 *   selfTest([
 *     ['two adjacent rows are both reported', bareText(adjacent), 2],
 *     ['a clean table reports none',          bareText(clean),    0],
 *   ]);
 */
export function selfTest(cases) {
  if (!Array.isArray(cases) || cases.length === 0) {
    console.error('self-test FAILED — no cases. A self-test that asserts nothing cannot fail,');
    console.error('  which is the exact defect --self-test exists to rule out.');
    process.exit(1);
  }
  let ok = true;
  for (const [label, got, want] of cases) {
    const pass = JSON.stringify(got) === JSON.stringify(want);
    ok &&= pass;
    console.log(`self-test: ${String(label).padEnd(46)} ${JSON.stringify(got)} (want ${JSON.stringify(want)}) ${pass ? 'ok' : 'WRONG'}`);
  }
  if (!ok) {
    console.error('  the detector cannot tell these apart — it would pass everything');
    process.exit(1);
  }
  console.log(`self-test passed — the detector can fail (${cases.length} cases)`);
  process.exit(0);
}
