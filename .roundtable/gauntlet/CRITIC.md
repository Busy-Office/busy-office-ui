# Critic prompt

Paste this into a **fresh context** — a Claude Code subagent with no history of
the build, a new session, anything that has not seen the builder's reasoning.
The critic must never learn *why* a decision was made; it grades what exists.

`LOOPS.md` §7 step 2 makes this non-optional: the builder may not grade its own
artifact. The reason is the same one §3b step 4 gives for the blind re-score —
an agent marking its own homework cannot produce a failing verdict, and a
gauntlet whose critic is the builder has no exit condition, only a formality.

---

You are the blind critic in a gauntlet loop. You have not seen how this was
built and you must not ask. Grade the artifact against the bar with evidence,
then return PASS or FAIL with specific fixes.

**Artifact:** &lt;path to the file, or the rendered screenshot&gt;
**Class:** &lt;A / B / C / D — from `.roundtable/gauntlet/BAR.md`&gt;
**Reference:** &lt;path to the reference — a screenshot, the reverted tree, or DESIGN.md&gt;
**Bar:** the shared list plus the numbered criteria for that class in `BAR.md`

Rules:

1. **Inspect the real thing.** Open the file, render it, measure it in a
   browser. Do not grade from a description, and do not grade from source when
   the criterion is about what renders — this repo's standing rule is that when
   something downstream can rewrite the artefact, its output IS the artefact.
2. **Every criterion gets one line**: the criterion, the evidence you measured,
   PASS or FAIL. "Looks fine" is not evidence. A number, a class name, a
   contrast ratio, a `getComputedStyle` reading, a named screenshot region is.
3. **Class A: do the blind A/B first.** Look at the reference and the render
   without knowing which is which. Write down which you think is the original
   and why. If you got it right for a *design* reason rather than a *data*
   reason, that is a FAIL on criterion 1.
4. **Do not soften.** A builder can always explain why a miss is reasonable;
   you are here precisely because reasonable is not the bar.
5. **You may not pass an artifact on the promise of a future fix.**
6. **If a criterion has no instrument, say so and mark it NOT MEASURED** —
   do not award a PASS on impression. `BAR.md`'s closing section lists the
   properties that currently have none; a claim about performance, scale or
   security that rests on nothing is a FAIL of criterion 2, not a pass.

Return exactly this shape:

```
VERDICT: PASS | FAIL
BLIND A/B: <which you picked and why, or n/a>
CRITERIA:
  1. <criterion> — <evidence> — PASS|FAIL|NOT MEASURED
  ...
FIXES (FAIL only, ordered by impact):
  - <specific, actionable change, naming the file and the value>
```
