# Objective grill — Slices 39, 42, 43 (2026-08-19)

Dispatched by rule 3 at its 3/3 threshold, second wake running where the counter
chose the loop rather than me noticing.

Evidence gate: ≥2 independent sources for `Evidence`, else `Hypothesis`.
Measured against git, `api.json`, the npm registry and the loop log.

---

## H1 — Thirteen detectors in three slices could not fail
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

| where | wrong | what it actually measured |
|---|--:|---|
| 39.2 learning path | **4** | `class="demo"` (every section has it); first `bo-*` after `<main` (the tag itself); the shell's menu button — *identical offset 536 on all 18 pages*; Related-footer badges |
| 39.3 premise | **3** | searched built HTML for `class="bo-"`, which never survives `highlight-code.mjs` |
| 42.1 meta-gate | **1** | matched the string `--self-test`, which its own tag text contains |
| 42.3 self-tests | **3** | asserted against a **copy** of the detector, so breaking the gate left them green |
| 42.3 fixture | **1** | the markup fixture was not truly adjacent, so the historical bug still passed |
| **total** | **13** | |

Every one was green, fast and specific. None was caught by review; each was
caught by a number that was *too tidy* — an identical byte offset, a suspicious
zero, an 18/18.

The previous grill called this "instruments lying" and recorded it as held-up
with no new rule. That was wrong. It has now happened thirteen more times, and
the mechanism built to catch it (42.1's meta-gate) failed the same way on its
first run. **This is not a habit problem, it is the dominant defect class of the
project**, and the countermeasures that work are structural rather than
attentional: `--self-test` with synthetic inputs, sharing one implementation
between gate and test, and preferring a signal that cannot be confused with
chrome.

Both are now in place and enforced (`check:selftests`, 7/7 self-tested).
**The measure of whether that worked is the count in the next grill.**

---

## H2 — A false detector produced a false report to the OWNER
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · ESCALATION**

Twelve of the thirteen cost time. One cost accuracy: I reported *"only 1 of 18
learning-path pages shows anything working"* — an alarming, specific claim about
the owner's project — and it was **wrong**. The real number is **16 of 18**. The
detector had counted uses of the `Demo` component, not pages that show anything.

That is a category change worth naming. A dead gate wastes a wake. A dead
*measurement quoted in a summary* misinforms the person deciding what to build,
and it is the kind of error that is only ever caught by the person who made it —
the owner has no way to check "1 of 18" without redoing the work.

The correction shipped in the same slice, unprompted, and is recorded in the
roadmap next to the original claim rather than replacing it.

→ **Fed back as 44.1:** a number that goes into a summary to the owner is
load-bearing and gets the same red-proof discipline as a gate.

---

## H3 — A serious WCAG failure shipped in the initial commit and survived 43 slices
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence**

`.bo-data-table[data-loading="true"] { opacity: 0.6 }` entered in the **initial
commit, 2026-08-12**, and was fixed on **2026-08-19** — seven days, 43 slices,
~380 iterations. It composited header text to **3.28:1** against a 4.5:1
requirement. **It is in the published 0.1.1**, verified by unpacking the
registry tarball.

Three independent safety nets did not see it:

- **`check:contrast`** computes token PAIRS; it cannot model opacity, so a
  composited value was never in scope.
- **31 axe sweeps** ran while it was latent, over a page that renders a loading
  table the whole time. Axe did not flag it — it only fired once 39.3 added a
  *second* instance.
- **Multiple accessibility grills** looked at this component and did not catch
  it, because the failure is **partial**: body text passed at 4.61:1 and both
  dark-theme colours passed. Only the lighter `th` colour was under water.

The lesson is not "add another gate". It is that **a partial failure is the one
a human eye is worst at**, and the gate suite is organised around properties
(contrast of a pair, presence of a rule) rather than around *the rendered result
of a state*. A dimmed table is a state nothing measured.

---

## H4 — The framework is still flat; the work is all verification now
**Seat: Chair · WORKING · MEDIUM · Evidence**

+212 / −28 lines of framework code across three slices; **248 classes and 39
components, both unchanged** for the second grill running. Gates 23 → 24, claims
at 35, self-tested gates 0 → 7.

Last grill said "watch it: three slices, one component". This grill: three
slices, **zero** components. Every line went into gates, self-tests,
documentation and one bug fix.

That is defensible — 43.1 alone justifies the window — but it is now a trend
with two data points, and the honest reading is that the project is in a
**consolidation phase it did not choose deliberately**. Worth an explicit
decision next slice rather than drifting further.

---

## H5 — npm still 0.1.1, sixth consecutive grill — and now it matters more
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

Unchanged, except that H3 gives it teeth: **the published 0.1.1 contains a
serious accessibility defect that is fixed in the repo.** The gap is no longer
just "users do not have the new features"; it is "users have a known WCAG
failure and the fix is sitting in git".

Not re-queued — it is an owner action — but the framing has changed and should
be said plainly.

---

## Feeding back into triage

- **H2** → 44.1: numbers quoted to the owner get red-proved like gates.
- **H3** → 44.2: gate the rendered result of a STATE, not just token pairs.
- **H1** → no new rule; the structural fixes are in and enforced. The next
  grill's count is the verdict.
- **H4** → recorded, with a request for an explicit call on the phase.
- **H5** → re-stated, owner-blocked, now with the defect argument attached.
