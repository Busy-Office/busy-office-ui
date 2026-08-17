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
