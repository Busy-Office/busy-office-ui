# Grill — putting Kev (kev-0.5b) into the loop: dispatcher, gate, first-level decision

Date: 2026-09-21
Asked by: the owner — "apply Jev to handle dispatcher, the work, the right
model, gate check, make 1st level decision… grill the idea and apply
accordingly."
Grilled by: Claude Code, session `fa641e32-24d1-4321-abf0-64c7e25015ca`.
Model under test: **`jaredpalmer/kev-0.5b`** (base Qwen2.5-0.5B), via the local
MCP endpoint, which reports `kev-latest` with `jev-latest` as an alias and one
entry in its model list.

**CORRECTION (owner, same day): Kev and Jev are two different models.** This
grill's first draft asserted they were one, reading the endpoint's alias as an
identity claim. That was wrong: the alias is a fact about *this server's
configuration* — it appears to have only Kev installed and resolves both names
to it — not about the models.

**So the body of this grill tested KEV.** Jev was then tested separately —
the owner supplied its endpoint — and **the results differ sharply**. Read the
Kev sections below as a record of what the local 0.5B checkpoint does, and the
**"Jev, measured" section immediately after the verdict** for what actually
governs the decision now.

Jev is **TypeSafe AI's hosted decision model** (`https://jev-ai.pro/api`,
`jev-latest`), reached through `~/Projects/jev-mcp`. It is a different product
from `jaredpalmer/kev-0.5b`, which runs locally. Calls to it **leave the
machine**; Kev's do not. That is a real operational difference, not a detail.

## Verdict, revised after testing Jev

| Part | Kev (local 0.5B) | **Jev (hosted)** | Standing verdict |
|---|---|---|---|
| 1 — dispatcher routing | wrong on both questions | **correct on both** | **REFUSED**, but on tier-0/determinism grounds ONLY — see below |
| 2 — review-depth gate | 5 of 6 wrong, unstable | **8 of 8, stable** | **ADMISSIBLE IN SHADOW** |
| 3 — first-level decision | collapses into 2 | collapses into 2 | follows Part 2 |

The original verdict — refuse all three — was written before Jev was reachable
and **is superseded for Parts 2 and 3**.

## Jev, measured

Same inputs, same questions, same two real commits, both state shapes:

| Case | Jev `area` | p(correct) | `is_detector_change` |
|---|---|---|---|
| detector commit, with repo framing | `new_detector` | **1.0** | 0.91 |
| records commit, with repo framing | `records` | **1.0** | 0.12 |
| detector commit, framing removed | `new_detector` | **1.0** | 0.92 |
| records commit, framing removed | `records` | **1.0** | 0.09 |

**8 of 8 correct, and stable across both state shapes** — the prompt-wording
instability that disqualified Kev is simply absent. The `noul` separates
0.91/0.92 from 0.12/0.09, which is a usable margin rather than a coin flip.

Dispatcher questions, same state Kev failed on:

| Question | Jev | Correct | |
|---|---|---|---|
| Rule 4: which item? | `249.7` @ conf 1.0 | `249.7` | ✓ p(correct) = 1.0 |
| Which loop this wake? | `continue` @ conf 0.75 | `continue` | ✓ p(correct) = 0.8 |

**Sample size is 6 classifications.** That is a pilot, not a calibration. It is
enough to overturn a refusal that rested on the model being unable to do the
task; it is not enough to let anything act unsupervised.

## Why Part 1 stays refused anyway — and the argument that no longer applies

Jev answering correctly **removes the empirical half** of the original
refusal. It must stop being cited: "the model gets it wrong" is false for Jev.

What remains is sufficient on its own:

- **Rules 3/4/5 are tier 0.** `COUNT`, `ORDER BY`, a date comparison. They are
  already exact, free, and instant. A correct probabilistic answer is not an
  improvement on a correct certain one — it is the same answer, slower, over a
  network, for money, with a p<1 tail.
- **Determinism is load-bearing.** `LOOPS.md:137`: two dispatchers *"always
  pick the same item, because rule 4 is deterministic"*. Jev returned p=1.0 on
  this input, which is *behaviourally* deterministic today — but a hosted model
  can change under the loop, and a `SELECT … ORDER BY … LIMIT 1` cannot. The
  invariant is the point, not the observed agreement.

So: refuse the dispatcher **because the work is already decided exactly**, not
because Jev cannot decide it. Those are different reasons and only the second
one died.

Not on taste and not on doctrine alone. Six classifications were run against
real inputs from this repo; **five were wrong or a coin flip**, and the two
that were right were right in mutually exclusive configurations.

The refusal is recorded so the idea is not re-proposed without new evidence.
What would reopen it is stated at the bottom.

## Part 1 — the dispatcher, as tested against KEV

### It is tier 0. Code already decides it exactly.

Rule 3 counts Continue rounds. Rule 4 takes the oldest still-open item. Rule 5
pairs metric samples across distinct days. These are `ORDER BY`, `COUNT` and a
date comparison over `loops.db`. The `kev-gate` placement ladder refuses this
case in its own words: *"Code cannot decide it. An exit code, a glob on changed
paths, a count — that is tier 0 and costs nothing."*

### Determinism here is a load-bearing feature, not an accident

`LOOPS.md:137` — two dispatchers **"always pick the same item, because rule 4 is
deterministic"**. That property is what lets two concurrent dispatchers
reconcile instead of duplicating an item; `LOOPS.md:196` records the collision
behaviour that depends on it. A probabilistic rule 4 removes the invariant that
makes concurrent dispatch safe. This is a regression disguised as an upgrade.

### Measured anyway, rather than argued

Given the real open set and the real counters (Standardize 2/4, Objective 1/3,
Optimize 0 newer wake-dates):

| Question | Kev | Correct | |
|---|---|---|---|
| Which item does rule 4 pick? | **373.3** @ 0.40 | **249.7** (oldest non-owner-blocked) | ✗ — and it ranked the correct answer **last of five real candidates, 0.07** |
| Which loop should this wake run? | **optimize** @ 0.57 | **continue** | ✗ — it chose the one lane the state explicitly rules out (`0 newer wake-dates`) |

Neither state contained any misleading framing to blame. The first answer is
not merely wrong; it is **inverted on the exact ordering the rule is about** —
it preferred the newest item and gave the oldest the least mass.

This also reproduces the failure the `kev-gate` skill already records: a
four-way queue-routing choice that sent a thrice-reverted item to `skip` at
0.94–0.96 across every permutation. Queue routing is the known-bad placement.

## Part 2 — the review-depth gate, as tested against KEV (superseded by Jev above)

This was the defensible part, and it still fails.

### The cheap pre-check already said no

`harvest.mjs --fit` over 805 commits: base rate **0.12**, path-prior
**AUC 0.61**. The skill's own bar — ≥0.70 means a glob wins outright, <0.60
means the label is probably noise, and a gate must *beat* the path prior on a
tune set to be worth a moving part. 0.61 is in the dead zone, and there are no
labelled cases of this repo's own to calibrate against.

### The separation is not stable under prompt wording

The decisive measurement. Same two real commits, one a change to
`check-selftests.mjs` + `check-claims.mjs`, the other a records-only
`chore(loops)` touching `loop-log.md`, `STATUS.md`, `INDEX.md`:

| State shape | detector commit | records commit |
|---|---|---|
| state names the repo "a CSS-first ERP UI framework" | `is_detector_change` **0.02** ✗ | **0.08** ✓ |
| same states, that phrase removed | **0.88** ✓ | **0.61** ✗ |

Each framing gets one case right and the other wrong. With the framing present,
the 10-way `choice` returned **`component_css` for BOTH inputs** — 0.80 on a
change with no CSS in it at all, and 0.59 on a records-only change — which is
the *"identical value across many inputs is a defect until proven otherwise"*
signature this project already names.

The model is not reading the file list. It is anchoring on the surrounding
prose, and which way it anchors decides the answer.

Two further readings from the same run, on the records commit with framing
removed: `is_runtime_claim` **0.51** (a coin flip) and `is_bulk_edit` **0.37**
on a three-file change. Not signal.

### Why "just fix the state" is not the answer

Removing the framing did not fix it — it moved the error to the other case.
Tuning the wording until both land would be fitting the prompt to two known
examples, which is the thing a tune/holdout split exists to prevent, and there
is no holdout here to catch it.

## Part 3 — Kev makes the "first-level decision": REFUSED as posed

The first-level decisions this loop actually makes are counts: *is anything
open?* (a row count), *is a counter due?* (an integer comparison), *is the
tree dirty?* (`git status`). Each is tier 0 and exact.

The one genuinely model-shaped first-level decision would be review depth —
which is Part 2, and Part 2 failed.

## What was NOT tested, stated so nobody assumes it was

- **No permutation check.** The verdict rests on `noul` questions, which
  `kev_check_permutations` does not evaluate. It would not change the finding:
  instability across state shapes is a stronger defect than option-order bias.
- **No tune/holdout calibration.** Deliberately — building one would mean
  investing in a gate whose pre-check and pilot both failed.
- **Not a judgement on Kev generally.** These are six classifications on one
  repo, at 0.5B, on questions about *this* codebase's defect classes. The kit
  says of itself that coding judgements are unvalidated experiments; this is a
  data point agreeing with that, not a claim about other uses.
- **Jev was not tested at all.** The local endpoint aliases `jev-latest` onto
  the Kev checkpoint, so every call here answered from `jaredpalmer/kev-0.5b`.
  A separate Jev endpoint would need to be reachable before any of this
  transfers, and the two parts transfer differently — see below.

## What is kept

**Kev stays available as an in-session advisory tool** — `kev-decision`'s
stated position, consulted by a model that is already running, authorising
nothing. That use survives this grill untouched, because its output is read by
something that can check it.

**Nothing is wired into the loop.** No gate file, no dispatcher change, no
`record_iteration.py` hook. The loop is unchanged by this grill.

## What would reopen it

1. **A recorded-outcome label**, not the fix-blame proxy — e.g. "this slice was
   refuted by a later verification pass", harvestable with `--labels`. If a
   real label's path-prior AUC clears 0.70, a **glob** ships, not a gate. If it
   lands 0.60–0.70, a gate becomes arguable and needs ≥20 tune and ≥12 holdout
   cases before it may act.
2. **A state shape whose answers do not move when unrelated prose is added or
   removed.** That is the specific defect above; it is testable directly, and
   any reopening should show that test passing first.
3. **A larger or different checkpoint — including Jev, which was never
   reached.** Every failure here is at 0.5B, from the Kev checkpoint.

## What this does and does not cover, given the Kev/Jev correction

The two refusals do **not** transfer equally to a different model:

- **Part 1 (dispatcher) is refused on grounds a better model does not fix.**
  Rules 3/4/5 are `COUNT`, `ORDER BY` and a date comparison — tier 0, exact,
  free. And `LOOPS.md:137` makes rule 4's determinism load-bearing for
  concurrent dispatch. A more accurate model still replaces an exact answer
  with a probabilistic one. **This part stands regardless of which model is
  used**, and re-testing it with Jev would not change the verdict.
- **Part 2 (review-depth gate) is refused only at this accuracy.** The
  placement is legitimate; the checkpoint could not classify its own home case.
  **This part is genuinely open for Jev** and should be re-run against it
  before being dismissed, using the same two real commits and both state
  shapes, because the instability under prompt wording is the specific defect
  to re-test.
- **Part 3 collapses into Part 2**, so it inherits Part 2's status.

Re-proposing without at least (1) and (2) is re-proposing on the evidence that
just failed.
