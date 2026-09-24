# Jev rubrics — v1 (2026-09-22)

Jev is a **typed-judgement service**, not a text model: it answers `noul` / `choice`
/ `score` questions with probabilities. It is used here at two decision points and
one optional third. **Its output is advisory. It cannot pass a failing check.**

Version this file, not the service: there is no saved-judge API on
`/v1/systemone`, so the question definitions below ARE the judge. Change the
version when a rubric's wording changes, and re-run the validation set — a
threshold is only meaningful for the wording it was measured on.

## What is actually installed (verified 2026-09-22)

- MCP server `jev`, user-scoped stdio, `~/Projects/jev-mcp/.venv/bin/jev-mcp`.
  (2026-09-25: briefly replaced by `jevai.org`'s hosted MCP, a different service
  with different tools, then reverted by the owner the same day. `jev-ai.pro` has
  no hosted MCP endpoint, so this stdio server is the way to reach it.)
- Targets **`https://jev-ai.pro/api`**, `POST /v1/systemone`. Confirmed in
  `client.py` (`DEFAULT_BASE`), not assumed.
- Tools: `jev_evaluate` (batched, any mix of types) and `jev_route` (one choice
  question plus a confidence threshold). There are no others.
- Credentials: `JEV_AI_API_KEY`, from the environment or
  `~/Projects/jev-mcp/.env`, which is gitignored there. **Nothing in this repo
  references or stores it**, and nothing here should.
- **`kev` is a different service** (local, `127.0.0.1:8008`). Never substitute one
  for the other; they are separate MCP servers with separate tools.

### Model and effort — there is only one tier

The request body is exactly `{state, model, questions}`. **No `effort`,
`reasoning` or `temperature` parameter exists**, and `jev-latest` is the only
alias, resolving at time of writing to **`jev-1.13.0`**. So there is nothing to
tune on the Jev side, and any "use a stronger model / higher effort" step means
escalating to a **Claude** model, not to a different Jev.

## Reading the output — the three types do not mean the same thing

| type | field | meaning |
|---|---|---|
| `noul` | `noul: 0.74` | **probability that the answer is true.** There is NO confidence field. |
| `choice` | `choice` + `confidence` + `probabilities` | confidence is the winning option's probability |
| `score` | `score: 1.13` + **separate** `confidence` + per-level `probabilities` | **`score` is a probability-weighted mean over the level indices — it is NOT a confidence.** A 1.13 on a 0-3 rubric means "between level 1 and 2", not "13% sure". |

Quote the field you used. A `score` and a `confidence` in the same answer are
two different numbers and mixing them is a reporting defect.

## Thresholds — VALIDATED at n=20, still advisory

Measured 2026-09-22 against five cases from this repo whose true answers were
already established by measurement (see "Validation set" below). All five were
classified correctly.

| band | reading | what to do |
|---|---|---|
| `noul >= 0.85` | evidence supports | proceed; Jev agrees with the checks |
| `noul <= 0.35` | evidence does not support | do not claim completion |
| `0.35 < noul < 0.85` | **UNVERIFIED** | gather the missing evidence, or escalate |

For `choice`, use `jev_route` with `confidence_threshold: 0.8` and treat
`escalate: true` as "decide it yourself". For `score`, use the **level
probabilities**, not the mean, and treat a top-level probability below 0.6 as
unverified.

**Validated 2026-09-23 against 20 cases** drawn from this repo's own landed and
refused work, each truth value established by measurement rather than
recollection (the set is in `375.8`). Result:

| set | n | min | median | max |
|---|---|---|---|---|
| evidence genuinely supports | 10 | **0.81** | 0.95 | 0.97 |
| evidence genuinely does not | 10 | 0.03 | 0.24 | **0.81** |

**There is no clean cut, and that is the finding.** A true case and a false case
both landed on exactly 0.81 — so the ranges overlap and no threshold separates
them perfectly. What the cut buys is an ASYMMETRY, and 0.85 buys the right one:

| cut | false positives | false negatives |
|---|---|---|
| **0.85** | **0 of 10** | 1 of 10 |
| 0.80 or lower | 1 of 10 | 0 of 10 |

A false positive is claiming completion on evidence that does not support it —
precisely what this review exists to prevent. A false negative costs one more
measurement. So 0.85 stays, now on evidence rather than on margin, and the
band's job is understood: **it never wrongly says yes; it sometimes says "go
measure" when you did not need to.** Treat a reading between 0.35 and 0.85 as
that instruction, not as a verdict.

The two cases at 0.81 are worth reading before trusting a borderline number.
The TRUE one claimed "every rule was restated" and offered byte counts — the
counts are real but they cannot evidence the *content* claim, so the doubt is
correct. The FALSE one claimed "only one thing remains", where the evidence
established six criteria passing and said nothing about what else might be
open. Both are cases where the EVIDENCE is thinner than the CLAIM, which is
what the middle band is for.

**Do not tighten these without re-running the set**, and do not let a band
decide anything a check can decide.

## Rubric 1 — DECISION support

Use when choosing between **explicit, already-drafted alternatives**. Not for
generating options, and not for questions the code can answer.

- State: the alternatives, the requirement each must meet, and the relevant
  **accepted project decisions** (`ROADMAP.md` items, `DESIGN.md`, CLAUDE.md
  rules). Consult those first — if an accepted decision already settles it,
  there is nothing to ask.
- Type: `choice`, one option per alternative, **plus these two literal options**:
  - `insufficient_evidence` — "the supplied evidence does not distinguish them"
  - `ask_user` — "this turns on a user preference, not a technical fact"
- If the winner is `ask_user`, ask. If `insufficient_evidence`, go measure.
- **If Jev's answer conflicts with an accepted project decision, the accepted
  decision wins** unless you record why it changes, in the roadmap item.

## Rubric 2 — COMPLETION evidence review

Use once per completion claim, after the checks have run. **Never as a
substitute for them.**

> For each case, decide whether the supplied evidence SUPPORTS the completion
> claim. Supported means: the claim is about a specific artifact, and the
> evidence is a measurement, gate result, or reproduction of that artifact —
> not an assertion, a plan, or a restatement. Absent or purely narrative
> evidence is NOT support.

`noul` per claim, criteria `{true: "Evidence is a measurement, gate result or
reproduction of the specific artifact.", false: "Evidence is absent, narrative,
or does not bear on the claim."}`. **Batch every claim that shares one evidence
state into a single call.**

**Never put a prior score, or the verdict you want, in the payload.** Measured
2026-09-23: identical evidence scored 0.25 with the sentence "an earlier review
scored 0.35" and 0.48 without it. A 0.23 swing from one leading sentence is
bigger than any distinction these bands are asked to make, so the payload is
part of the instrument. State the evidence and the criteria; let the number
come back cold.

**"Completion review" MEANS calling `jev_evaluate`. It is not a vocabulary.**
Writing PASS/FAIL/UNVERIFIED into a report without making the call is skipping
the review, and that is exactly what happened on the first real opportunity
(the 373.x batch, 2026-09-23) — the rubric's words were used in the agent
prompts and the tool was never invoked. The owner noticed before the loop did.
When the call was finally made it moved two of three positions, so the cost of
skipping is not hypothetical: an item reported as "one line short" scored
**0.35** because a second criterion was genuinely unverified, and a landing
reported as clean scored **0.51**.

So: **before marking any roadmap item `[x]`, run the completion review on its
claim and quote the number.** One batched call per landing round, not per item
and not per file. If the call cannot be made, the item is UNVERIFIED — say the
review did not run rather than reporting a verdict as though it had.

### The gate is binding and Jev is not part of it

| verdict | condition |
|---|---|
| **PASS** | required checks passed **and** criteria are supported |
| **FAIL** | a required check or criterion failed |
| **UNVERIFIED** | necessary evidence is missing |

- A failed check is **FAIL**. A high `noul` does not lift it, and neither does a
  stronger model's opinion.
- **A Jev outage is UNVERIFIED, never PASS.** The client raises on both failure
  modes (connection error; `401 Unauthorized`), but the MCP tools CATCH that and
  return `{"error": "…"}` as an ordinary result with no `answers` key
  (`~/Projects/jev-mcp/src/jev_mcp/server.py`, the `except JevError` in each
  tool; corrected 2026-09-25). So check for `error` before reading a number, and
  report that case as UNVERIFIED: the review did not run.
- Jev adds a second opinion on whether the evidence bears on the claim. That is
  all it adds.

## Rubric 3 — DISPATCH (optional, off by default)

Only when routing is genuinely ambiguous among **predefined** routes and the
extra call is cheaper than deciding. `jev_route`, `confidence_threshold: 0.8`,
escalate on `true`. Not yet enabled: it needs a small comparison showing a real
reduction in time, cost or rework before it earns a place in the loop. Until
then, the dispatcher rules in `LOOPS.md` decide.

## When NOT to call Jev

- A fact the code can settle → read the code or run the check.
- A user preference → ask the user.
- The same question with unchanged evidence and criteria → reuse the answer.
- Per-action or per-file checks → no. Two decision points, batched.

## Escalation — at most two rounds

Jev has one tier, so escalation means a Claude model:

1. Simple / mechanical → fast model, low effort.
2. Ordinary technical decision → balanced model, medium effort.
3. Complex or consequential, or conflicting evidence → stronger model, high
   effort.

**Do not jump to the strongest model merely because Jev was uncertain** — an
uncertain Jev usually means thin evidence, and the fix is to measure, not to
spend more. After two rounds, stop and state the unresolved issue.

## Validation set (re-run this when a rubric changes)

Five cases, ground truth established by measurement in this repo:

| case | truth | v1 result |
|---|---|---|
| Quantity seam fix — measured 6/6/6/6 → 0/6/6/0 on 3 pages, gate red-proved | supported | 0.96 ✓ |
| forced-colors count 18 — regex, comment-stripping and `api.json` agree | supported | 0.92 ✓ |
| "borders are covered by the same contrast gate" — PAIRS has zero rows for the token | not supported | 0.05 ✓ |
| "the gate works" — evidence is "it was added and the build passed" | not supported | 0.20 ✓ |
| "the refactor made it faster" — evidence is "removed a loop that looked redundant" | not supported | 0.03 ✓ |

5/5. The fourth is the useful one: a bare "build passed" is the most plausible
wrong answer, and it still landed below the band.
