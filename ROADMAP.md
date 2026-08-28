# busy-office-ui — Roadmap

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern CSS,
generated-and-verified docs. This file is the long-term plan; per-slice detail and the
design-review trail live in `.roundtable/`, and every breaking change is in
`CHANGELOG.md`.

## Objective — the direction (set by the owner, 2026-08-16)

**Make complex ERP UI simple: the framework absorbs the hard problems so
the app doesn't have to.** Every proposal to add, change, or remove
anything passes the three principles below — each carries explicit
**accept / refuse / rethink** tests so decisions are made against the
direction, not against momentum. Anything that fails a test is refused
outright or sent to the design panel; "it would be useful" is never
sufficient on its own.

### 1. Simplicity — simple is the best; make the complex simple

The framework's job is to take on genuinely hard problems (accessibility
contracts, precision, density, theming, focus, save semantics) and hand
back something that reads obvious. Power that complicates the consumer's
markup or mental model is failure, not capability.

- **Accept** when it lets a consumer *delete* code, markup, or decisions.
- **Refuse** when using it correctly requires understanding more than its
  own docs page, or when its explanation needs a caveat list to be honest.
- **Rethink** when a docs explanation keeps growing to cover a surface —
  the fix is simplifying the thing, never the prose. (Precedent: the
  lossless-reformat fix — the simple contract "never change the number"
  replaced a growing pile of rounding caveats.)

### 2. Less for more — fewer options, more possibility

One component, many settings. Composition over variants. Native elements
over invented widgets. Every new option must open more use-cases than the
one that asked for it.

- **Accept** when one general mechanism replaces N specific asks
  (precedent: `data-density="spacious"` IS the warehouse-floor variant —
  no `--large` modifier ever shipped).
- **Refuse** a modifier/part/attribute that serves exactly one scenario,
  and any second way to do something that already works.
- **Rethink** when two surfaces start growing toward each other — merge
  them or extract the shared primitive (precedent: the `decimal-input`
  util under money + quantity).

### 3. Reusability is the key

Nothing ships for one screen. A piece earns its place by surviving ≥2
real, independent compositions (the same bar behaviors already meet
before being called stable). Prefer the primitive that composes over the
composite that locks.

- **Accept** when it works, unchanged, in a context it wasn't designed
  for.
- **Refuse** when it embeds app/domain decisions — data, workflow,
  policy stay with the consumer ("framework does visuals, you do the
  data"); the rare deliberate exception is named, documented, and always
  overridable (precedent: the currency/unit tables).
- **Rethink** when reuse requires copy-paste-modify — extract the
  reusable core instead of shipping the copy.

**Precedence (owner call, 2026-08-21): suitability beats reuse at the
point of use.** Reusability decides what SHIPS in the framework;
context-suitability decides what a screen USES. When they conflict — a
reusable control that is wrong for the context (steppers in a dense
line grid; the joined money widget crammed into a table cell) — the
suitable design wins, because an unsuitable design damages the UX no
matter how reusable it is. The resolution is always to pick or build
the suitable REUSABLE primitive (the field matrix on
`/concepts/design-language` says which, per field type × context),
never a one-off.

### 4. Design the decision, not the screen (added 2026-08-19, owner input — the Ive filter)

A screen exists to serve **one decision its user must make**, and everything on
it is ranked by that decision. "The payroll manager needs to know whether
payroll is safe to release" is a design brief; "we need a payroll screen" is
not. Complexity lives under the interface, never in the user's mental model —
the system may run fifty validations, the user reads *Ready · 428 employees ·
2 exceptions*.

- **Accept** when the screen answers, in order, *what is this / what should I
  look at / what should I do* — and the primary action is singular and obvious.
  (Measured 2026-08-19: 18 of 19 pattern screens already have ≤1 visually
  primary action; the wizard's Next/Submit pair is the legitimate exception —
  never both visible.)
- **Refuse** any element whose removal does not materially reduce the user's
  ability to decide — and any state text that names the mechanism instead of
  the meaning (`Processing Status: 04` is refused; "Ready to release" with
  detail underneath is the shape). If an element needs a long explanation to
  justify existing, that is the signal it should not.
- **Rethink** when a screen accumulates a second primary action or a second
  audience — it is usually two decisions sharing one page, and the fix is a
  split, not a bigger toolbar.

**The screen's decision lives inside a journey** (owner input, 2026-08-20 —
the full Ive document's §4): a decision is one step of Request → Validation →
Exception → Resolution → Approval → Execution → Confirmation, and a beautiful
screen inside a terrible workflow is still a bad product. The unit of design
is the journey; screens are its steps.

- **Accept** when a screen's exits land the user at the next decision with
  context intact — the approval screen's "done" IS the confirmation state,
  not a dead end the user navigates away from blind (precedent: po-app's
  edit → 302 → record-with-new-values, and the mass-change 422 that
  re-renders in place instead of losing the user's selection).
- **Refuse** a screen designed in isolation — one whose entry assumes state
  no prior step produces, or whose exit drops the user somewhere no next
  step picks up. If the pattern page cannot say which step precedes and
  follows it, that's the signal.
- **Rethink** when a journey needs a screen that exists only to bridge two
  others (a "now click here to continue" page) — the fix is merging the
  handoff into an exit, not adding a step.

The full 10-question version of this filter runs on demand as `/design-grill`
against a named screen — or against a whole journey as
`/design-grill flow:<a> > <b> > <c>`; this section is the every-wake
distillation.

**References are floors, not ceilings** (owner, 2026-08-23, during the
RF-coverage grill): research citations prove a need RECURS — they never
define the solution. Parity with SAP/Fiori/Zebra/anyone is not an Accept
criterion; every design must name what it does BETTER than the reference
it cites (typically: two-channel state, no-JS floor, reduced-motion and
forced-colors correctness, honest docs, composition over new surface). A
proposal that cannot name its improvement is copying, and gets rethought.

**How it binds the loops:** Roadmap triage tests every new ask against
these before queuing (refuse/rethink are valid triage outcomes, recorded
with the reason); the design panel grills slices against them; removals
face the same tests as additions — deleting a surface consumers compose
against is a Breaking-entry decision, not a tidy-up.

## CI strategy — measured, and why branches are not the lever (2026-08-24)

Owner asked whether a dev/main split should manage different CI. **It should
not, and the timing data says why: CI was slow for a structural reason, not a
branching one.**

Measured before changing anything: ~12.4 min of serial steps, lopsided —
scroll 216s (29% of the run), claims 104s, axe 68s, layout 65s, container 59s.
Eleven browser gates each launched a browser and walked the same 121 built
pages.

Fixed structurally, **without touching branches**: sharding the browser gates
into five parallel jobs took wall clock to **184s**. Plus `paths-ignore` for
narrative-only commits (8 of the last 30 touched only `.roundtable/**` and
`STATUS.md`) and `cancel-in-progress` for superseded pushes. Roughly **4x**,
with no change to what any gate asserts.

**Why NOT tier gates by branch.** This file's own doctrine already answers it:
*a gate that only runs in CI is not known to work.* The corollary is worse — a
gate that only runs on `main` finds problems **after** the merge, which is the
expensive moment to find them. Cheap-on-dev / full-on-main also trains you to
trust a green that means less than it says. Same gates everywhere; make them
fast instead. At 3 minutes there is nothing left to tier.

**Branches ARE worth it — for a different problem.** Twice on 2026-08-24 the
owner and the loop edited the same working tree simultaneously: once an
independently-written ledger entry was swept into an unrelated commit by
`git add -A` (which is how two gaps briefly shared the number 17), and once a
whole slice (139) was found already implemented and uncommitted. Branches plus
separate worktrees remove that contention entirely, and `fix/docs-search-bar`
showed the shape working. So: **branch for isolation and review, not for CI
tiering.**

**Standing rules that follow:**
- Same gate set on every branch and on `main`.
- `main` protected, requiring CI green.
- Anything that reads a file must not be in `paths-ignore` — `DESIGN.md`,
  `ROADMAP.md`, `LOOPS.md`, `README.md` and `CHANGELOG.md` are each read by
  gate scripts, so none of them may be ignored. Only `.roundtable/**` and
  `STATUS.md` are read by nothing.
- Re-measure before optimising again. The single biggest win here was a loop
  written the wrong way round, and no amount of workflow tuning would have
  found it.

## Sequence — what runs next, and why in this order (owner, 2026-08-24)

Eighteen items are open; **nine are dispatchable** and nine are gated on the
owner or on a condition. The order below is the plan of record. It is derived
from one finding rather than from item age: the instrument grill
(`.roundtable/grill-erp-suite-instrument-2026-08-24.md`) showed that **every
gap the ERP suite has found came from a new SHAPE or from STRESS, and none
from a new domain** — 9, 4, and 0 of the seventeen. So the remaining modules
are ranked by the shapes they force, not by module order.

| # | Item | Why here |
|---|------|----------|
| 1 | **140.3** — predictions on record | Must precede the modules. A yield predicted *after* building is worthless; the whole value is that it can be wrong. Cheap — recording, not building. |
| 2 | **130.4a Production** | Highest predicted yield: BOM as a multi-level hierarchy, capacity over time, the MRP panel. Also where **140.1's reopened question** — intensity over a long date grid — gets tested on a real screen instead of a screenshot. |
| 3 | **130.4b Inventory** | Stock by item × warehouse. Predicted **not** a gap (`comparison` documents a candidates × criteria grid; `data-table` ships `--sticky-col`). Building it either confirms that or proves the prediction wrong. |
| 4 | **130.4c Finance** | Journal entry that must balance, payment list + detail. Predicted **~0 gaps** — all shapes covered. This is the thesis test: a module that finds nothing is a **success**, and the evidence for stopping at shape coverage. |
| 5 | **130.5** — wire the suite into CI | Its own condition is "once it stops changing shape". That is true only after 2-4 land. Ordered last among suite work on purpose: a gate guarding a moving target reports noise. |
| 6 | ~~**136.6 / 136.7**~~ — **both REFUSED 2026-08-24** | The instrument did what this row predicted, and refuted them. 25 ERP screens express document relationships as a document-flow timeline (5) or a related list (2), and use rich text on **zero**. A reference belongs in a structured surface GAP-2 already resolved, not in prose. 136.7's general question — a character counter for the form family — is re-homed as open, not queued. |

**Gated, not sequenced** — these are not "later", they are waiting on someone:

- **112.3** pilot briefs → owner (the loop must never author brief content);
  **112.4** blocked on 112.3's verdict; **112.5** after both.
- **OWNER CALL — direction**: precondition met (0.3.0 cut), awaiting the
  owner's push + GitHub Release.
- **AT runtime evidence**: needs owner hardware — a screen reader this loop
  cannot drive.
- **Turbo**: conditional, and its condition (workspace past ~2 packages) is
  not met.

**What would change this order.** If Production finds three or more gaps, the
shape thesis is holding and Inventory/Finance stay as written. If Production
finds **zero**, the thesis is wrong in an interesting way — the remaining
modules would be re-argued rather than ground through, because the instrument
would have stopped paying for itself.

## Slice 27 — triaged from the owner QA review (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 28 — from the Objective grill of Slices 26-27 (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 32 — preventing AI slop when building with this framework (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 49 — Standardize sweep: inline styles, and the paths sweep's leftovers (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 57 — Owner input: the Ive design principles, installed (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 63 — Standardize sweep: finishing last sweep's partial review (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 144 — Owner wishlist: login's sticky actions, a comment/chat component (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 145 — Score the ERP-suite screens so the loop can benchmark them (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 143 — Owner wishlist: motion bug, sidebar-nav, offcanvas (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 142 — Owner wishlist: skeleton motion, state standardisation, command-bar states (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 141 — Owner: standardize the command bar (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 139 — Gap ledger promotion: the list screen with no way to create (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 140 — The two watch items: one refused, one already scheduled (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 138 — Owner wishlist: joined fields (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 137 — Owner wishlist: the richtext toolbar (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 136 — Owner: grill the rich-text DESIGN (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 135 — Owner wishlist: the RF track, four asks (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 134 — `test:visual` is red, and nothing runs it (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 133 — Owner: prove the scrolling actually works (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 132 — Owner wishlist: date entry, three pickers, list-to-list (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 131 — Owner wishlist: the RF pages show the screen twice (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 130 — ERP suite examples: the gap-finding instrument (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 129 — Objective grill of 126-128, and the gate hole it found (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 128 — Standardize sweep, round 1 (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 127 — the mobile-ERP candidates, grilled to builds (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 126 — RF coverage, grilled to a scope (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 125 — Explore/Research fallback: dogfood bugs + mobile-ERP candidates (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 124 — Owner: the left bar on a toned cell (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 123 — Owner answers, seven decisions in one message (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 122 — Owner wishlist: Amount decimal control + live masking (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 121 — Owner ask: grill the pattern catalogue for coverage + showcase (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 120 — Owner wishlist: dependent dropdowns, checked against an article (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 119 — Owner wishlist: the pattern catalog review, grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 118 — Owner decision: docs go showcase-first (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 117 — Owner wishlist: form label position, grilled to Top/Start (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 116 — Owner decision: inbox approval rows expand in place (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 115 — Owner input: the Motion System proposal, triaged (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 114 — Owner wishlist: adopt htmx 4 (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 113 — Owner wishlist: improve the rich text sample (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 112 — External governance/conformance proposal, grilled to a pilot (2026-08-22)

Owner supplied a rev-3 "Documentation, Governance & Conformance Improvement
Proposal" (uploaded 2026-08-22) proposing a consumer-facing validator
(`@busy-office/check`), a Screen Contract YAML, pattern metadata, a Quality
Index, waivers/SARIF/benchmarking, and a six-section docs IA. Reviewed
against the repo: **most of its P0 already exists here under other names**
(Surface Fitness ≈ the DSA rubric; admission gate ≈ the 99.4 front door;
mandatory doc cores ≈ the two recipes + `check-page-shape`; canonical
generated metadata ≈ the docs doctrine). The genuinely new bets were the
Screen Contract + pattern-fit layer. Grilled in a 2-round design-tree
session (report: `.roundtable/grill-112-pattern-fit-proposal.md`); the
owner's deciding call: **the checker is for AI agents building with the
framework** — not human enterprise teams. Final decision made on long-term
benefit: build the metadata substrate unconditionally; every superstructure
stays evidence-gated.

**Sequencing (settled Q5): this slice queues BEHIND 110.4 and 109.3.**
109.3's per-section quality bar is what the pilot judges against, and
109.3 grows the 13 outstanding wrong-choice clauses (settled Q9 — one pass
per page, not two).

1. [x] **112.1 — DONE 2026-08-22. `patterns.json` extracted, `gen-patterns.mjs`.**
       Self-tested (`--self-test`, red-proved by breaking the row regex and
       confirming the cases meant to catch it went red), reconciled by hand
       against 9+ pages including edge cases (a nested `<code>` tag inside
       a Data-contract cell, a wrong-choice clause with no alternative
       link). Wired into the docs build chain right after
       `gen-patterns-index.mjs`. No new drift gate added — 112.1's own
       Accept asked only for the extractor to be red-proved, not for a
       staleness gate; adding one would be scope creep beyond what was
       asked. Original item text follows.
       `patterns.json`, extracted not authored. A
       `gen-patterns.mjs` scrapes the pattern pages (the single source of
       truth stays the pages, per doctrine) into a generated per-pattern
       record: group, opener, complexity, components-used, the States
       table rows, the Data-contract table rows, and the wrong-choice
       clause text + its alternative link (today detected then thrown
       away by `wrong-choice-rule.mjs`). **Anatomy is deliberately out of
       scope** — its `<li><strong>Region</strong>` convention fuses
       component links into prose (approval's entries carry
       parenthetical asides a naive extractor would swallow); extract it
       only after a page-side convention tightening earns it. Technique
       precedent: `check-components-used.mjs`'s section-slice against
       dist. Red-prove the extractor per the instrument doctrine — first
       output is wrong until reconciled against a hand count.
2. [x] **112.2 — DONE 2026-08-22.** `llms.txt` gained a `## Patterns`
       section generated from `patterns.json`: per pattern, name/URL,
       opener, complexity, components, and the wrong-choice clause +
       alternative link — the task-fit data an agent needs to pick the
       right SHAPE before reaching for components (Objective §4). Kept
       lean deliberately: full States/Data-contract row text stays on
       the page itself, not duplicated here — including it would have
       roughly doubled the file for detail a pattern-fit decision
       doesn't need. Same anti-drift guard as 32.3's precedent (throws
       if the catalogue is missing or under 20 patterns), red-proved by
       truncating `patterns.json` to 2 entries and confirming the build
       actually threw before restoring it. File grew 22.9kB → 36.7kB,
       53 → 81 URLs verified. Full suite green (13 docs gates incl. the
       URL-resolution check on all 29 new pattern links; `check:claims`
       90/90).
3. [ ] **112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS —
       protocol owner-confirmed 2026-08-23, scaffold ready.** The owner
       agreed to the protocol (after stress-testing the loop's format
       example — the duplicate-check-vs-reconciliation challenge, which
       also confirmed why briefs must be owner-authored). Scaffold at
       `.roundtable/pilot-112/` (README + briefs.md + SEALED-PICKS.md);
       the loop wrote only the scaffold, never brief content. Waiting on:
       5–8 briefs + sealed picks, then "briefs ready" starts the runs.

       **Realigned 2026-08-24 — still blocked, but with new evidence the pilot
       should account for.** The ERP suite has since built 25 screens from
       these patterns, and GAP-17 found `list-report`'s Anatomy omitted a whole
       region (the create action) — an omission that propagated into **6 of 7
       list screens**. That is real pattern-fit failure data from a different
       direction than the pilot measures: the pilot asks whether an agent
       PICKS the right pattern from the docs; this says a correctly picked
       pattern's own anatomy can be incomplete. It argues for the Screen
       Contract layer's premise without satisfying the pilot's verdict bar,
       which is deliberately about sealed owner picks.
       *(pre-registered protocol follows, unchanged)*
       32-style evidence before any contract surface exists. Protocol,
       pre-registered here so the verdict cannot be argued afterward:
       - **Briefs**: the owner writes 5-8 screen briefs from real ERP
         memory, unseen by the loop before the runs, each with the
         owner's own pattern pick sealed in a file the pilot agent can
         never see.
       - **Agent context**: a fresh subagent gets the brief text plus the
         IMPROVED `llms.txt` (post-112.2) ONLY — no repo access. One
         control brief re-run with nothing but the npm README.
       - **Runs**: one run per brief; any failing brief is re-run twice
         and the failure counts only if it appears in ≥2 of 3
         (variance guard).
       - **Measurement**: the full failure taxonomy, each row arguing
         for its own defense separately — pattern choice, invented
         APIs (regression check on 32.1/32.2), missed states,
         right-pattern-wrong-component (the 42-fields-in-a-Dialog
         class), contract violations.
       - **Verdict bar**: confirmed wrong-pattern picks (vs the sealed
         owner picks) on **≥2 briefs** → the Screen Contract layer earns
         admission and gets designed (112.4). Below the bar → **refused
         and recorded**; 112.1/112.2 stand on their own merits either
         way. Report lands in `.roundtable/`.
4. [ ] **112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.**
       Deliberately undesigned until admitted — schema, delivery
       (extend `bo-check-markup` vs new bin), and finding format are the
       post-pilot grill round. If 112.3 refuses it, this item closes as
       refused with the pilot report as the reason.
5. [x] **112.5 — DONE 2026-08-25, generated from `patterns.json` as required. UNBLOCKED
       2026-08-24 — the coupling to 112.3 cost more than it saved.** A
       task→pattern decision-flow page generated from `patterns.json` (never
       hand-maintained — it would be the fifth interpretation of the pattern
       system the proposal itself forbids).

       It was sequenced after the 112.3 verdict so the page and any contract
       pattern-selection logic would be one authoring pass from one source — a
       real saving, but a small one, and this item's own last line already said
       it **pays regardless of 112.4's fate**.

       **Realignment:** 112.3 has been blocked on owner-authored briefs since
       2026-08-23 and the loop cannot unblock it by design. Holding a page that
       pays on its own behind a gate only the owner can open trades a certain
       benefit for a possible second authoring pass. Decoupled: build it now,
       and accept that a later contract layer might touch it again.

       It is now **the only dispatchable build item in the backlog** — every
       other open item waits on the owner or on an unmet condition.

       **Shipped at `/concepts/which-pattern`**, under concepts rather than
       patterns: it documents no screen, so the pattern-shape gate rightly
       does not apply to it.

       Every cell is read from `patterns.json` — the same file that builds the
       tile index and the sidebar — so adding a pattern adds a row with no
       edit here, and rewording an opener rewords its row. Three things are
       extracted, because they are the three a reader chooses by: the job
       family, who the screen is for, and **the pattern's own statement of
       when it is the wrong choice**. That last is the most useful column and
       the most reliable source, because `check:wrong-choice` requires every
       page to carry the clause.

       Verified against the numbers measured BEFORE building, which is the
       independent check: **39 rows across 6 groups, 39 pattern links, and 17
       alternative links** — the clauses that name another pattern outright
       get a real link to it. Five rows show a dash, and the page says so in
       its own words rather than hiding it: a blank means the clause is
       phrased in a way the extraction did not match, never that the page is
       silent on it. Where a clause describes an alternative instead of naming
       it, the prose stands — inventing a link the author did not write would
       be the page guessing.

**REFUSED, with reasons (recorded per the grill's Q6 — re-open any of
these when a second real consumer of `@busy-office/ui` exists):**
- **Consumer Quality Index /100 + application benchmarking** —
  organizational-governance machinery for teams that don't exist yet;
  fails the proposal's own §16 demonstrated-gap rule. The anti-gaming
  design (§24 medians/percentiles) is good and is preserved here for
  the re-proposal.
- **Waiver system (PASS WITH WAIVERS, expiry, SARIF output)** — CI
  exception machinery for human orgs; an AI agent needs PASS/FAIL and
  readable findings, nothing more.
- **A second Surface Fitness rubric (proposal §13, 5-dim /15)** — the
  six-dimension DSA rubric already exists and is gated; running two
  violates the proposal's own §2.6. Its one real improvement — the
  Removal Cost axis + fitness×cost decision matrix (§15) — may be
  absorbed into the existing rubric as a future Standardize item.
- **The six-section docs IA reorg (§3)** — ~80% renames groups that
  were each measured into place more recently than the proposal was
  written (2026-08-16 comparative IA pass; 104.1's single-source
  grouping). Extracted instead: 112.5, and possibly an Integration
  sidebar group as a future small item.
- **Hand-authored pattern metadata YAML (§30)** — inverts the
  generated-from-artifact doctrine; superseded by 112.1's extraction.
- **A consumer-facing conformance web tool (§34)** — downstream of a
  Quality Index that is itself refused.

## Slice 111 — Owner wishlist: button group, dropdown animation, design-system reference (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 110 — v2 candidates approved and grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 109 — Owner direction: the real-ERP pattern catalogue + regrouping (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 108 — P0: object-page sticky bleed-through, z-index scale, tab-vs-anchor clarity (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 107 — Owner ask: button icon-only / text-only / icon+text (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 106 — P0: leaving the docs shell for the landing page silently failed (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 105 — Standardize sweep findings deferred with reason (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 104 — Owner wishlist: patterns section + tile index à la namethatui.com (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 99 — Owner direction: patterns as an ERP expert would actually build them (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 103 — Standardize: the dist-walking chokepoint regrew (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 102 — owner wishlist: three grills (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 101 — Objective grill: the loop optimised what it could see (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 100 — Owner wishlist: drag & drop list (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 98 — Standardize: the two wrong-choice gates were one rule, written twice (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 97 — Owner wishlist: validation check UX/UI (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 96 — Owner wishlist: currency on the right of the amount (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 95 — Owner wishlist: device-fitness and ERP-coverage scoring (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 94 — Review, improve and score the remaining 37 components (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 93 — Owner ask: show the alignment score on each component's page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 92 — Owner direction: the design system takes the wheel (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 91 — Standardize sweep: the conventions Slices 84-90 established, applied site-wide (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 90 — /design-grill: the three editing designs (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 89 — Owner screenshot report: two shipped defects in the dirty row-edit row (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 88 — Owner wishlist: split the table-column demos into value + qualifier columns (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 87 — /design-grill: the Combobox page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 86 — /design-grill: the Forms page ("Data Input - forms", clarified by "next") (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 85 — Owner wishlist: joined ( qty | unit ) becomes Quantity's Basic (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 84 — wake triage-noticing: Slices 71-81 shipped no CHANGELOG entries (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 83 — /design-grill: the "Data input" and "Values" groups (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 82 — Owner ask: redundancy review across Amount/Quantity/Money docs (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 81 — Owner ask: Quantity basic as ( qty | unit ), joined like Money (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 80 — /design-grill: Quantity's +/− buttons — optional after all (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 79 — /design-grill: Quantity & Money — do they need JS? (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 78 — /design-grill: the numeric family's DOCS — and a shipped UA-chrome defect (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 77 — /design-grill: the numeric family, incl. "Number" (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 76 — /design-grill: Amount vs. Quantity consistency (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 75 — Owner ask: apply the full Jony Ive design document (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 74 — Standardize sweep: sticky-cols' redundant "1" case (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 73 — Owner ask: grill a right-click column-header context menu (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 72 — Owner wishlist: multi-sticky columns, tone text, width/font (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 71 — Owner ask: server-controlled conditional cell tone (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 70 — Objective grill: the po-app dogfood streak (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 69 — Standardize: po-app's own three-Explore-wake drift (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 68 — Explore: record editing dogfooded in po-app (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 67 — Explore: PO creation dogfooded in po-app, a dead link fixed (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 66 — Explore: value-help dogfooded in po-app, backlog empty (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 65 — Standardize: two framework bugs the design-grill sweep queued (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 64 — from the Objective grill, Slices 51-63 (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 62 — from the Objective grill, Slices 56-61 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 61 — Owner wishlist: a generic, fixed review-screen contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 59 — Owner wishlist: RF-scanner browser floor + a smaller-screen profile (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 58 — Owner ask: run /design-grill across the screens (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 60 — Standardize sweep: one gate hand-rolled its own exit contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 56 — from the Objective grill, Slices 52-55 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 55 — Standardize sweep: two decisions that had each been written twice (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 54 — P0 + wishlist from the owner (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 53 — Owner input: grill components on need vs cost (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 52 — Owner wishlist: the Object Page (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 51 — from the Objective grill, Slices 45-50 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 50 — Standardize sweep: how pages carry layout, and one behaviour that knew too much (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 48 — Owner input: the SAP Object Page floorplan (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 47 — Standardize sweep: the widths we verify at (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 46 — from the Objective grill, Slices 37/38/44 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 45 — surface review, batch 1 outcomes (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 44 — from the Objective grill, Slices 39/42/43 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 43 — P0 found while doing 39.3 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 42 — from the Objective grill, Slices 39-41 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 41 — from the Objective grill, Slices 31-40 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 40 — icons, SVG, date picker, filter popup (owner wishlist, 2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 39 — the docs must make the first impression (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 38 — is the browser floor too new? (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 37 — score the surface for real ERP fit (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 36 — vertical tabs (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 35 — P0: tabs worked exactly once (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 34 — field editor: per-row save is the wrong idiom (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 33 — using this framework from ANOTHER repo, with AI (owner question, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 31 — DESIGN.md's own four-pattern table is wrong (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 30 — owner wishlist, triaged (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 29 — owner bug report (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## STATE — no dispatchable work; two owner calls (2026-08-18)

From the Slice 28 grill: `.roundtable/grill-objective-slice28-2026-08-18.md`.

**Every unchecked item in this file is undispatchable.** Three are NEEDS-RUNTIME
on owner hardware (VoiceOver, NVDA, AT runtime evidence); the fourth (Turbo) is
a conditional that has not fired. There is also no 1.0 definition anywhere in
the plan.

That is structural, not a lull: from here the dispatcher can only reach
Standardize, Objective and Explore — all of which generate work *about the
project*. It will keep producing self-referential improvement indefinitely and
look healthy doing it, because each piece of that work is genuinely good. The
Objective charter is a **filter, not a direction**: simplicity / less-for-more /
reusability say what to refuse, never what to build. Choosing a direction is
structurally an owner call, not something a loop can derive.

1. [x] **OWNER CALL — 0.2.0 release. ANSWERED 2026-08-21: owner triggered the
       publish, and it was cut as 0.3.0, not 0.2.0.** The tarball built at HEAD
       was labelled 0.2.0 but carried 304 commits of post-tag work (tabs,
       anchor-nav, context-menu, sticky-cols), so that number would have
       permanently described contents it did not have. 0.2.0 stays an accurate
       record of what was cut on 2026-08-18, annotated "tagged, never
       published"; the registry goes 0.1.1 → 0.3.0 and consumers get both
       sections' 83 entries, which the CHANGELOG now says outright. Tagged
       `v0.3.0` at `24c6e7d`, every gate green at 0.3.0. **Still not on the
       registry** — publishing runs through Trusted Publishing (OIDC), so it
       needs the owner to push the tag and publish a GitHub Release; tracked in
       `RESUME.md`, not here.

       Original text, kept for the record: **64 unreleased CHANGELOG entries**
       against a published **0.1.1** (`npm view` confirms). Slices 24-28 —
       query tokens, staging, mass change, four placeholder-only accessible
       names, the 1.46:1 search contrast, icons vanishing in print, the
       nav-label spill — are shipped, gated, and in nobody's `node_modules`.
       `npm install @busy-office/ui` today still gets the accessibility defects
       fixed two days ago. This is the previous grill's F5 one level up: the
       stale *site* was fixed, the stale *package* was not. Publishing is
       owner-triggered by policy; the work itself is done.

2. [x] **OWNER CALL — DECIDED 2026-08-26: (a) adoption/DX.** See Slice 147. Original text kept below.

2b. [x] **OWNER CALL — direction. REALIGNED 2026-08-24: the release blocker is
       GONE; this waits on a decision only.** It said the release "is cut as
       0.3.0 and awaits only the owner's push". **0.5.0 is published on npm** —
       checked, not assumed. The precondition was not merely met, it has been
       overtaken twice, and the recommended default below still says "ship
       0.2.0 first", which shipped long ago.

       Nothing structural blocks this any more. What remains is the choice,
       which was always an owner call: pick (a), (b), (c) or (d) below, or say
       "keep waiting for adopter feedback" and mean it as a decision rather
       than as a precondition.

       Recommended default (kept for its reasoning, though its ship-first
       clause is spent): **choose from real adopter feedback rather than from
       this room** —
       the cost being that feedback takes time, against the alternative risk of
       building the next twelve components for nobody. Candidates if the owner
       prefers to choose now: (a) adoption/DX — starter template, copy-paste
       screen kit, migration note; (b) depth on data maintenance — M2
       master-detail and M4 Excel round-trip are only partly done; (c) the
       autosave decision below, the one genuine product question already in the
       plan; (d) define 1.0 and close the gap to it.

**RETIRED — F1 (verification-to-product ratio).** The previous grill deferred it
with the trigger "revisit if the next window pushes past ~30:1". It fired:
framework CSS grew **+25 lines across 45 commits, and zero in two of three
15-commit windows**, so the denominator is zero and the ratio is meaningless.
The honest conclusion is that the **metric was wrong**, not that things are 30x
worse — zero CSS growth is the charter working, and a ratio that reads "added no
CSS" as failure would push toward adding CSS for its own sake. What it was
gesturing at is captured properly by the two owner calls above. Not to be
re-raised as a new finding.

## Slice 167 — Objective grill of Slices 161, 162, 166 (2026-08-28)

Dispatcher rule 3 at 3/3 `[161, 162, 166]`; rule 1 found no open P0 and GitHub
intake is empty, rule 2 read `Standardize 2 / 4`. Full report:
`.roundtable/grill-objective-161-162-166-2026-08-28.md`.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing here renders — the grill file, this entry,
`.roundtable/RESUME.md`, one comment block in `dispatch_status.py` and two
corrected paragraphs in `LOOPS.md`. No CSS, Astro or JS that ships to a page was
touched, so no page's markup changes at all. `check:layout` and `test:axe` swept
all pages at both widths anyway and were unchanged. **No visual debt was added;
nothing visual was looked at.**

Window shape: 12 rows · landed 6 · refused 5 (all Meta) · triaged 1. Refusal
base rate since 2026-08-19 is **34.2%** (188 of 550), against 33.9% and 33.5%
in the two previous windows — unmoved.

**Three findings were settled inside the grill and are not items:**

- **A — the 61-vs-23 is adjudicated.** 166.5 refused to quote its harness's 61
  against the header's 23 on the grounds that 23 was "published, red-proved".
  It was not: `--self-test` proves `slice_of`'s classification, not the crossing
  replay, and no command was ever recorded for 18/22/23. A third independent
  replay reproduces **all five** published figures exactly at the 996 rows they
  were taken on (18 · 22 · 23 · 23, and 6 → 15), so the harness was wrong and
  166.5's verdict holds. The cost of the missing command is visible: ten rows
  later the `+ Standardize` figure is **24**. `LOOPS.md` rule 3 now says so and
  points at the command. **No new doctrine, deliberately** — this is roadmap
  159's existing rule ("write the command next to the claim"), not a new one,
  and the gap was compliance. Inventing a second rule for it is the ceremony
  94.11 refuses.
- **B — a SIXTH convention exists and is refused, measured.** 30
  Continue/Standardize rows name their slice mid-text (`… — Slice 6 item 1 ·
  shipped …`); 8 distinct slices are invisible to all three start-anchored
  patterns. 29 of the 30 are from 2026-08-14→16 and the newest is 2026-08-21;
  parsing them moves the whole-log crossing count **24 → 25**, one crossing
  ever. This is the first test of `LOOPS.md`'s own post-fifth-recurrence
  conclusion — *"the lesson is no longer widen the regex"* — and it holds. The
  counts, both commands (the plain grep undercounts at 28; two rows use a
  parenthetical) and the reopen condition are beside `SLICE_TOP`.
- **D — "it does not move the crossing count" is insufficient as a criterion.**
  161.4 refused Explore+Objective partly because they move it 23 → 23.
  Measured: `SLICE_TOP`, the fix 166.5 shipped and which was right to ship,
  **also** moves it 23 → 23. A cadence test applied to a correctness change
  gives the right answer once by luck. 161.4's refusal still stands on its
  stated definitional reason; the number was corroboration, and reads to the
  next wake as the argument.

**The finding that is filed, and the tension it sits in.** This grill's headline
is that the loop's own prose is growing unchecked — and a grill is prose about
the loop. That is stated rather than dodged: the two items below are the only
ones filed, both findings A/B/D were closed in place rather than queued, and the
net effect on `LOOPS.md` this wake is two paragraphs replaced and one added.

1. [ ] **167.1 — the loop's own prose is the fastest-growing and the only
       unmeasured prose in the repo. Decide whether the 158.2 cadence covers
       it.**

       158.2 installed a cadence over `apps/docs` prose on the measurement that
       it grew **+51%** in nine days with **zero pages shrinking**, and argued —
       correctly — that a per-page justification test cannot produce a shrink
       because it is applied while the words are being written. That cadence
       covers the product's prose. **It does not cover the files the loop runs
       on**, and over the identical window those grew faster:

       ```
       # words at each day's last commit, 2026-08-20 -> 2026-08-28
       python3 - <<'PY'
       import subprocess
       F=['LOOPS.md','CLAUDE.md','ROADMAP.md','ROADMAP-archive.md',
          '.roundtable/RESUME.md','DESIGN.md']
       for d in ['2026-08-20','2026-08-28']:
           s=subprocess.run(['git','rev-list','-1',f'--before={d}T23:59:59','HEAD'],
                            capture_output=True,text=True).stdout.strip()
           for f in F:
               r=subprocess.run(['git','show',f'{s}:{f}'],capture_output=True,text=True)
               print(d,f,len(r.stdout.split()) if not r.returncode else 0)
       PY
         # RESUME.md          837 ->   2,980   +256.0%   read every wake, Step 0
         # LOOPS.md         4,380 ->   9,706   +121.6%   read every wake, Steps 0b-2
         # ROADMAP + archive 86,368 -> 179,597  +107.9%   read every wake, rule 4
         # CLAUDE.md        2,966 ->   4,759    +60.5%
         # docs pages (158.2) 51,051 -> 77,080   +51%     read by users
         # DESIGN.md        3,119 ->   3,609    +15.7%   the product's architecture
       ```

       The prose describing the **loop** grew two to five times faster than the
       prose describing the **product**, and is read far more often.
       `RESUME.md`'s own text contains *"a handover that only grows stops being
       read"*, written the day it tripled.

       **Counter-evidence, and it is why this is a decision and not a fix.**
       Growth is not the defect — being unmeasured is. 158.1/161.1 found the
       *instrument* at fault in 5 of 15 flagged pages, so a word count over
       these files would likely flag `LOOPS.md` for containing decisions.
       `ROADMAP.md`'s growth is already managed (165.1). And `DESIGN.md` is not
       a like-for-like comparator: it is deliberately terse and delegates to
       generated docs.

       *Accept*: a recorded verdict for each of the five loop-machinery files
       naming whether its growth is honest, instrument, or removable — the same
       three-way split 158.1 used — **or** a recorded reason the cadence should
       not extend here. Either outcome satisfies this; finding the premise
       uninteresting is a satisfying result. Whatever is decided carries the
       command that produced its numbers, and the numbers are re-run rather than
       quoted from this entry.

2. [ ] **167.2 — `LOOPS.md` rule 3 is 82% archaeology, and the file has no
       archive.**

       The dispatcher reads rule 3 every wake to decide one thing — *is the
       counter at 3?* Measured:

       ```
       python3 - <<'PY'
       t=open('LOOPS.md',encoding='utf-8').read()
       r3=t[t.index('3. **THREE OR MORE slices'):t.index('4. **Build item queued')]
       k=r3.index('**THE COUNTER WAS BLIND FOR FIVE DAYS')
       print(len(r3.split()),'words total;',len(r3[:k].split()),'rule /',
             len(r3[k:].split()),'recurrence history;',len(t.split()),'file')
       PY
         # rule 3: 1,026 words — 181 the rule itself, 845 the five recurrences
         # LOOPS.md: 9,706 words, so one counter's history is ~9% of the file
       ```

       One 6-line function (`slice_of`: three regexes and a three-line body) now
       carries **4,248 words** across four files — 845 in `LOOPS.md` rule 3,
       1,709 in `dispatch_status.py`'s comments (148 of 304 lines), 1,244 in
       ROADMAP 161.4 + 166.5, 450 in `RESUME.md`. `DESIGN.md`, the whole shipped
       architecture, is 3,609.

       `ROADMAP.md` has `ROADMAP-archive.md` for exactly this, blessed by
       CLAUDE.md's storage doctrine (*"the archive is still markdown, still
       reviewed, still diffed"*). `LOOPS.md` has no archive. The recurrence
       narratives are the clearest candidate: they are history a wake needs
       **when it touches the parser** — where `dispatch_status.py`'s own header
       already keeps most of it — not when it reads the counter.

       **Counter-evidence.** Each write-up was individually correct, and the
       fifth recurrence was found *because* the fourth had been written down;
       this prose has paid for itself. The risk of moving it is real and is the
       reason this is an item and not a tidy: the whole point of rule 3's
       history is that a wake reading the rule is warned, and a pointer is read
       less than a paragraph.

       *Accept*: rule 3's **decision content** — threshold, why three not one,
       the ordering above rule 4, which loops close a slice — is intact and
       still readable without following a link; every moved paragraph resolves
       from where it used to be; and the before/after word split is reported by
       re-running the command above rather than predicted here. A recorded
       decision to move **nothing**, with the reason, also satisfies this.

## Slice 166 — Standardize sweep: a fourth copy of the alias whose home says there is one (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 165 — the archive sweep is due again, and rule 4 is the thing paying for it (2026-08-28)

**Not new input** — nothing was filed and nobody asked. Noticed while closing
161.4: dispatcher rule 4 says outright *"if this rule is walking thousands of
lines again, that is the signal"*, and it is walking 3,882.

**Measured, with the command, so the next wake re-runs instead of re-deriving:**

```
python3 - <<'PY'
import re
H=re.compile(r"^## Slice (\d+)")
def sections(p):
    cur=None; d={}
    for l in open(p):
        m=H.match(l)
        if m: cur=int(m.group(1)); d[cur]=d.get(cur,0)
        elif cur is not None: d[cur]+=1
    return d
live=sections('ROADMAP.md'); arch=sections('ROADMAP-archive.md')
OPEN=set(); cur=None                   # DERIVED, never hardcoded — a pinned list
for l in open('ROADMAP.md'):           # goes stale the moment a slice closes
    m=H.match(l)
    if m: cur=int(m.group(1))
    elif cur is not None and re.match(r'^\s*\d+\. \[ \]', l): OPEN.add(cur)
print("OPEN:",sorted(OPEN))
big={s:n for s,n in live.items() if s not in OPEN and n>6}
print(len(big),"closed slices carrying",sum(big.values()),"lines here;",
      sum(1 for s in big if s in arch),"already in the archive")
PY
  # OPEN: [15, 112, 163, 164, 165]
  # 20 closed slices · 3,019 lines · 1 already archived   (2026-08-28, after 162.1)
```

**The count moved and the direction is the finding, not the number.** One wake
ago this read 17 slices / 2,488 lines against a 3,882-line file; it is now
**20 / 3,019 against 4,212** (`wc -l`, not predicted — the first draft of this
sentence guessed 4,262 and was wrong by 50), because two more slices closed and
this wake added
162.1's write-up. Re-run it rather than quoting either figure — the list of
closed slices is derived, so the command stays right while any pinned number
rots.

**The pinned `OPEN` set was itself the bug this item nearly shipped.** Its own
comment said "re-derive from the `N. [ ]` checkboxes", and re-deriving is what
exposed that **Slice 165 had no checkbox at all** — so a re-derivation dropped
165 from `OPEN` and classified **this very item's 47 lines as a closed slice to
be archived**, while `STATUS.md`, whose whole job is surfacing open items, never
listed it. Fixed by giving 165 the checkbox below and by deriving `OPEN` above.
This is the same shape CLAUDE.md's storage doctrine already records for
`STATUS.md`'s parser: a derived artefact deciding, on its own, what it failed to
see.

The live file was brought to 1,094 lines on 2026-08-25, which is the regrowth
that makes this a recurring sweep rather than a one-off. The doctrine in
CLAUDE.md already settles the
question of whether this is allowed: the archive is still markdown, still
reviewed, still diffed, and `check:slice-refs` keeps the citations resolvable
(it currently checks 178 of 180, with a 2-row known-dangling baseline).

**Do this as a hand-checked move, not a script.** CLAUDE.md's bulk-edit rule
applies with force here: the last case-collision on this exact pair of files
silently destroyed 7,307 lines of archived history, and the tell was only that
`git status` showed the file as *modified* rather than *added*.

1. [x] **165.1 — DONE 2026-08-28. 20 slices moved; 4,461 → 1,474 lines.**
       *Accept*: every closed slice's text lives in `ROADMAP-archive.md` with a
       one-line pointer left in `ROADMAP.md`; `check:slice-refs` passes with its
       citation count reconciled against the source rather than against the
       mover; the line counts before and after are both recorded; and
       `git status` shows `ROADMAP-archive.md` as **modified**, with its line
       count having GROWN by approximately what `ROADMAP.md` lost — the
       property, not a predicted number.

       **Re-run the command above first.** Its numbers are re-measured every
       time it runs and the pinned ones in this file are not; a disagreement
       with `20 / 3,019` is the first thing to report, not something to write
       over.

       **Disagreement reported first, as instructed.** The command now reads
       **21 slices / 3,125 lines against 4,461**, not `20 / 3,019 / 4,212` —
       it grew again in one wake. Direction is the finding.

       **And the extra slice was an INSTRUMENT DEFECT, not a slice.** The
       command attributes every line to the last `## Slice` heading it saw, so
       a non-slice `## ` section is counted as the preceding slice's body.
       Slice 29 read 78 lines while being a correct 3-line pointer; the other
       75 belong to `## STATE`. Measured: **4 non-slice H2 sections carry 279
       lines** — `## Objective` (127), `## STATE` (74), `## CI strategy` (43),
       `## Sequence` (35). The real figure was 20 slices / 3,047 lines.

       **Moved: 20 slices**, each replaced by a pointer, appended to the
       archive in the order they held in the live file.

       ```
       ROADMAP.md       4,461 → 1,474   (-2,987)
       ROADMAP-archive 16,218 → 19,285  (+3,067)
       ```

       **Conservation reconciles exactly**: the archive gained 80 more lines
       than the live file lost, which is the 20 pointer stubs (4 lines each)
       that replaced them. Verified structurally rather than by eye: all 20
       carry a ≤4-line pointer in live AND full text in the archive;
       `git status` shows `ROADMAP-archive.md` as **M**, never added — the
       case-collision tell that once destroyed 7,307 lines;
       `check:slice-refs` passes at 180 citations; and `STATUS.md` regenerated
       still finds **7 of 7** open items against the raw source count.

       **Not touched, deliberately**: the four non-slice sections. `## Objective`
       is the direction every proposal is tested against and must stay; the
       other three are standing decisions or dated snapshots, and deciding them
       is not this item's scope.

## Slice 164 — Objective grill of Slices 158, 159, 160 (2026-08-28)

Rule 3 at 3/3. Full report:
`.roundtable/grill-objective-158-161-2026-08-28.md`. Cloud wake — no container,
no screenshots; the only code change is a Python script that prints to stdout.

**The window itself was healthy.** 19 rows, 9 landed, 7 refused (all decided
*inside* items that landed, via `--also-refused`), 2 triaged, 1 logged. Zero
Continue rounds were refused, against a previous window where half were — and
the base rate has not moved: 182 refused / (355 landed + 182 refused) = **33.9%**
since 2026-08-19, against 33.5% measured one window ago. The refusals moved
channel, not frequency.

**The rule 159 wrote paid off one wake later** (grill §C, Evidence). Slice 160's
triage wrote its command next to its claim; the build round re-ran it and found
the *framing* wrong — "two populations" of named products were four, three of
which were kept, and one of the two new ones (interop hazard: the product name
IS the reader's search term) would have been scrubbed by a wake that trusted the
triage. 158's premise was re-measured the same way in the same window and was
also wrong (107 pages → 118, seven outliers → twelve). Both errors were
structural, not numeric — the kind a re-derivation reproduces and only a re-run
catches.

1. [x] **164.1 — DONE 2026-08-28. The instrument that DECIDES did not reconcile; the one that only mirrors did.**
       `rebuild_from_log.py` counts the raw `- ` bullets and refuses to write
       when it under-parses. `dispatch_status.py` — whose output *chooses the
       loop this wake runs* — had no such check, and its `(\w+)` mode field
       missed **nine rows, every one a `Continue` row**, which is exactly what
       both counters count (`owner-decision`, `owner-wishlist`, all
       2026-08-24). It printed "982 iterations logged" against
       `grep -c "^- " .roundtable/loop-log.md` = **991**.

       **Cost, measured rather than asserted**, by replaying both parsers over
       all **703 revisions** of the log: the row count differs on **79**, and
       the OVERDUE/ok verdict on exactly **one** (dc7ea4d, 2026-08-24 20:02 —
       Standardize read 3/4 "ok" when it was 4/4). One in 703 is nearly
       nothing, and the entry says so; the defect is the confident number
       printed while blind, not the damage it did.

       *Accept*: (a) the counter reads every row the log contains, checked by
       the raw bullet count, not by the parser being checked; (b) an
       under-parse **raises** instead of printing — the docstring's "exit
       status is always 0" was already false and is corrected; (c) red-proved
       with the injection confirmed, including the old regex tripping the new
       reconciliation. All four cases pass; details in the grill.

       **Refused: a writer-side guard in `record_iteration.py`.** Base rate is
       9 rows in 991 (0.9%) from one convention, the mode field is deliberately
       free text, and the reader now fails loudly — a second detector for the
       same defect is the ceremony this repo keeps refusing.

       **Also corrected: a carried-forward number.** `RESUME.md` called this
       "six legacy rows" for four wakes. It was **nine** at the commit that
       wrote it (`de0c814`, re-checked against that commit's own copy of the
       log) and has been nine since 2026-08-24 — a bare count with no command,
       written the day after 159 made "write the command next to the claim" a
       rule.

2. [ ] **164.2 — decide whether the loop log records WHICH CLOCK wrote a row.**
       `record_iteration.py` writes `datetime.now()` — naive local wall-clock,
       no offset. The owner's machine is UTC+08; the cloud container is UTC.
       Since the routine was promoted to `/schedule` (162), both write the same
       file, and two rows can disagree with real chronology by eight hours.
       Line order is correct; the timestamps are what lie.

       **Measured, with the command, because the count grows by one per
       handover and a fixed number here would be stale within a wake** — the
       first version of this entry said "2 in 990 pairs" and was wrong in both
       halves, caught by re-running before pushing:

       ```
       python3 - <<'PY'
       import re
       R=re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ([\w-]+) · ([\w-]+) · ")
       t=[R.match(l).group(1) for l in open('.roundtable/loop-log.md') if R.match(l)]
       print(len(t),"rows ·",sum(1 for a,b in zip(t,t[1:]) if b<a),"inversions")
       PY
       # 996 rows · 3 inversions   (2026-08-28; one of the three added by the
       #                            wake that filed this item)
       ```

       **Latent, and that was checked, not assumed** — all three consumers read:
       `dispatch_status.py` orders by file index, `generate_status.py` by
       `ORDER BY id`, and the one real `ts` comparison
       (`rebuild_from_log.py`'s `VOCAB_ENFORCED_FROM`) is a cutoff nine days in
       the past. Nothing decides wrongly today.

       Options, none obviously right: write UTC always (one line, but existing
       rows silently change meaning); write an ISO offset (honest, but changes
       the line format four parsers and 991 rows depend on); or accept it and
       say so in `LOOPS.md`. *Accept*: a decision recorded either way, naming
       what it costs, and — if the format changes — a migration that leaves the
       991 existing rows parseable, with the parsers reconciled against the raw
       bullet count as 164.1 now does. **"Accept it" is a valid outcome**;
       leaving the file silent is not. Belongs with **162.1**, which is the
       same subject (what two dispatchers sharing one queue costs); this is the
       second cost, and unlike the first it is silent and lands in the record
       itself.

3. [x] **164.3 — OWNER CALL, DECIDED 2026-08-28: (a) is NOT spent. Finish it.** Not a wake's decision, filed
       here so it is visible rather than re-derived.

       **Measured, exactly, from the generated mirror** (`STATUS.md`,
       2026-08-28 08:18 — six open items):

       | item | about | dispatchable |
       |---|---|---|
       | 112.3 pattern-fit pilot | conformance layer | no — owner briefs |
       | 112.4 Screen Contract | gated on 112.3 | no |
       | AT runtime evidence | a screen reader | no — hardware |
       | 161.4 the Objective counter | `dispatch_status.py` | yes |
       | 162.1 two dispatchers, one queue | `LOOPS.md` | yes |
       | 163.1 the ten one-composition blocks | `report-reach.mjs` | yes |

       **All three dispatchable items are about the loop's own machinery.** Not
       one open item would change a component, a pattern page, a token, or
       anything a consumer of `@busy-office/ui` installs. Rule 4's next
       dispatch is therefore inward by construction, whatever any wake intends.

       This is the state the Slice-112 grill predicted in this file — *"from
       here the dispatcher can only reach Standardize, Objective and Explore —
       all of which generate work about the project … the Objective charter is
       a filter, not a direction"*. The owner answered on 2026-08-26 with **(a)
       adoption/DX**; it became Slice 147 (the screen kit, a real front door)
       and shipped. **Nothing succeeded it.** One slice discharged the
       direction and the queue behind it was already maintenance.

       *Accept*: an owner decision — re-pick from (b) depth on data
       maintenance, (c) autosave, (d) define 1.0, extend (a) with the next
       adoption step, or "keep waiting for adopter feedback" **meant as a
       decision, not as a precondition**. Finishing 161.4/162.1/163.1 first is
       fine and is what the loop will do meanwhile; the finding is only that
       finishing them leaves the queue empty of product work and **no rule in
       `LOOPS.md` will notice**.

       **DECISION (owner, 2026-08-28): the premise was wrong, and finishing (a)
       is the direction.** This item says (a) *"became Slice 147 (the screen
       kit, a real front door) and shipped"*. It shipped **into the repo, not
       to users**:

       ```
       @busy-office/ui         0.5.0   live
       @busy-office/create-ui  E404    never published
       open GitHub issues      0
       ```

       `npm create @busy-office/ui` returns "package not found" for everyone on
       earth. The front door is built, gated, committed — and locked. So (a)'s
       last mile is unshipped, and *"keep waiting for adopter feedback"* was
       never viable as a decision: **0 issues is consistent with 0 reachable
       users**, not with indifference. You cannot measure adoption through a
       door nobody can open.

       **Three publish blockers found and fixed, one of which would have broken
       the owner's publish outright:**

       - **`publishConfig` was MISSING.** A scoped package defaults to
         *restricted*; `npm publish` would have failed, or silently created a
         **private** package nobody can install. `@busy-office/ui` has carried
         `{"access":"public"}` since 0.1.0 and this package never did.
       - **No README** — npm renders it as the package page, so the front door
         would have published with a blank landing page.
       - No `repository`/`homepage` metadata, so npm could not link back.

       **The README's own claims were measured, and two were wrong** — caught by
       scaffolding into a temp dir rather than trusting the draft: the dev
       server is on **5173, not 3000**, and there is no `screen.html` (the
       screen is inlined into `index.html`, and the scaffold writes its own
       README). A fabricated file tree was one command away from being the
       package's npm landing page.

       **Remaining, and it is the owner's alone**: `npm publish -w
       @busy-office/create-ui`. Everything else is done — `npm pack --dry-run`
       shows 6 files, `check:quickstart` boots the scaffolded project in CI,
       and the 155 freshness gate keeps the pin, template and NOTICE derived.

       **No metric, dashboard or gate is proposed**, deliberately: the
       verification-to-product ratio was raised and RETIRED above with "not to
       be re-raised as a new finding", and that retirement is correct. The
       corroborating commit-share measurement (product share of work commits:
       six days at 77-95%, then 83 → 68 → 60 → 52%) is in the grill report with
       its confounds, as corroboration only.

## Slice 163 — noticed while shipping 159.1: the bucket nobody adjudicated is the one below the bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 162 — Two wakes took the same item, and nothing could have stopped them (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 161 — Standardize sweep: the cadence's first run, and a settled count that was wrong (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 160 — triaged while reading 158.1's outlier pages: named products the denylist does not deny (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 159 — Objective grill of Slices 151, 153, 157 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 158 — Owner wishlist: simplicity is the key; clean up the content (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 157 — Owner: the dirty row says it twice (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 156 — Owner: a device guide for the shells, with a support matrix (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 155 — Two drift risks in `create-ui`, found by explaining it (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 154 — Triaged from a reference form-layout engine (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 153 — Objective grill of Slices 149, 150, 152 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 152 — Owner wishlist: show every layout as a skeleton template (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 151 — Owner wishlist: learn from a mainstream list product (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 150 — Objective grill of Slices 112, 130-148 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 149 — Research: dense numeric UI, and an open-source ERP desk (owner wishlist, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 148 — Triaged from an external framework review (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 147 — Adoption: the framework has no front door (owner decision, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 146 — the published site went stale for a week (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 26 — from the Objective grill (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 25 — carried forward (2026-08-17 reconciliation)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 24 — triaged from "ROADMAP DIRECTION v1.2" (external review, 2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 15 (in progress — item 12 owner-gated) — conformance artifacts

11. [x] **Generated ACR** (Ines). VPAT-2.5-shaped page: WCAG 2.2 AA criterion
       × component, verdicts Supports / Conditional-on-adopter / Not
       Evaluated, generated from api.json + contrast.json + behaviors.json +
       the guarantees split. Accept: page generated, gated, linked from the
       accessibility concept; Not-Evaluated rows cite the AT gate.
12. [ ] **AT runtime evidence** — NEEDS-RUNTIME (owner hardware): combobox
       activedescendant, data-grid implicit roles, selection live-region on
       VoiceOver + NVDA; results recorded in `.roundtable/` and cited by the
       ACR. **Realigned 2026-08-24: unchanged, and genuinely unblockable by
       the loop** — it needs a human listening to a screen reader, which no
       gate here can simulate. `test:axe` (121 pages x 2 widths) and
       `check:forced-colors` cover what automation can; the residue is
       announcement behaviour, which only ears verify. Stays open rather than
       quietly closed, because the ACR cites it.

## Slice 16 — docs IA, compared against 5 CSS frameworks (user wishlist)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 22 — scale system, rich text, WYSIWYG table (user wishlist, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 23 — docs IA & depth (owner review, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

