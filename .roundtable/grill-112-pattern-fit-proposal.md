# Grill report — Slice 112: the governance/conformance proposal (2026-08-22)

**Input:** owner-supplied rev-3 "Busy Office UI — Documentation, Governance &
Conformance Improvement Proposal" (external document, uploaded 2026-08-22).
**Method:** review against the repo, then a 2-round design-tree grill with the
owner. **Outcome:** Slice 112 (queued behind 110.4/109.3) + six recorded
refusals.

## Review findings that framed the grill

- Most of the proposal's P0 already exists here under other names: Surface
  Fitness /15 ≈ the six-dimension DSA rubric (gated, 39/39 scored); the
  new-surface admission gate ≈ the 99.4 front door + Objective
  accept/refuse/rethink; mandatory doc cores ≈ the two recipes +
  `check-page-shape.mjs`; "Avoid When" ≈ the wrong-choice clause (gated);
  one-canonical-source ≈ the generated-docs doctrine; machine-operable data
  contracts ≈ the 110 quartet addendum. Eight of its twelve P0 items were
  done or nearly done before the proposal arrived.
- The genuinely new bets: a Screen Contract YAML + a consumer-facing
  pattern-fit checker (`@busy-office/check`) + Quality Index/benchmarking.
- The static-conformance half of that checker already ships: `bo-check-markup`
  (32.2), built from measured self-specimens, plus the llms.txt refusals
  table (32.3).
- Metadata survey (sub-agent, 2026-08-22): machine-readable per pattern today
  is only href/label/group/complexity/components[] (`patterns-index.json`).
  States and Data-contract tables are consistently shaped and mechanically
  extractable; anatomy is not (prose-fused links, parenthetical asides);
  the wrong-choice clause is detected but its text/alternative discarded;
  `llms.txt` carries ~zero pattern data; 13 of 30 patterns lack the clause
  (`PATTERN_TODO`).

## The owner's framing decision

**Q: who is the checker for? A (owner): AI agents building with the
framework.** This single answer killed roughly half the proposal (waivers,
SARIF, Quality Index, benchmarking are human-org governance machinery) and
re-based the rest on the Slice 32 lineage: every defense is admitted on a
caught specimen, never on speculation.

## Settled decisions

### Round 1
| # | Question | Decision |
|---|---|---|
| Q1 | Pilot verdict bar | **(b)** ≥2 briefs with confirmed wrong-pattern picks vs owner's sealed blind picks; interpretation order pre-registered — a wrong pick indicts llms.txt coverage before it justifies a contract layer |
| Q2 | Pilot agent context | **(a)** llms.txt only (post-112.2), no repo access; one npm-README-only control brief |
| Q3 | Brief authorship | **(a)** owner writes 5-8 from real ERP memory, unseen by the loop pre-run |
| Q4 | Measurement scope | **(b)** full failure taxonomy; each row argues for its own defense |
| Q5 | Sequencing | **(b)** behind 110.4 and 109.3 (109.3's bar calibrates the pilot's judging) |
| Q6 | Refusals | **(a)** record now, re-openable "when a second real consumer exists" |
| Q7 | "Which Pattern Should I Use?" | **(b)** bundled, written after the verdict from the same canonical source |

### Round 2
| # | Question | Decision |
|---|---|---|
| Q8 | Metadata source | **(c)** extraction from pages (states, contracts, components, complexity, wrong-choice text+link); anatomy deferred until its markup convention is tightened |
| Q9 | 13-clause wrong-choice debt | **(a)** folded into 109.3's sweep — one pass per page |
| Q10 | llms.txt catalogue timing | **(a)** fix coverage BEFORE the pilot; briefs are the scarce burn-once resource, don't spend them proving a visible deficiency |
| Q11 | Pilot runs | **(c)** one run per brief; a failing brief re-runs twice, counts only at ≥2 of 3 |

### Final decision (owner asked for the long-term-benefit call)
Build the **metadata substrate unconditionally** (112.1/112.2 — it pays in
every future, drift-proof by construction); keep **every superstructure
evidence-gated** (112.4 admitted only by the pilot's pre-registered bar).
The project's costliest historical failure is surface that couldn't fail or
wasn't used; an unadmitted contract schema would be its governance twin.

## Refusals (recorded in Slice 112)
Quality Index + benchmarking; waivers/SARIF; a second fitness rubric (its
Removal Cost axis may be absorbed into the DSA rubric later); the §3 docs IA
reorg (extracted: 112.5, maybe an Integration sidebar group); hand-authored
pattern YAML; the consumer conformance web tool.

## Owner action item
5-8 briefs with sealed per-brief pattern picks, needed before 112.3 runs
(after 110.4/109.3 land — no rush). The sealed picks live in a file the
pilot subagent can never see; the pilot agent gets brief text + llms.txt
only.
