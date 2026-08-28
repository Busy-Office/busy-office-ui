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

> **SUPERSEDED 2026-08-24, recorded 2026-08-28 (Slice 170.1). Every row below is
> closed or was deliberately dropped; this section is kept as the record of the
> reasoning, not as the plan.** It was written at 20:45 and the commit run that
> closed 130.4 *without Inventory or Finance* — the owner's own call, on the
> evidence — landed at 21:22, four commits later; 193 commits have passed over it
> since without an edit. 140.3 and 130.5 are `[x]` in `ROADMAP-archive.md`;
> 130.4a Production was built, 130.4b/c were not. The gated list below is stale
> too: it says "precondition met (0.3.0 cut)" and the package is at **0.5.0**.
> For what is open **now**, read the `N. [ ]` checkboxes or generated `STATUS.md`
> — never a count written into prose.
>
> ```
> git log -1 --format='%h %ai' d04b5557   # wrote this section
> git log -1 --format='%h %ai' 45baaa12   # closed 130.4, 37 minutes later
> grep -cE "^[0-9]+\. \[ \]" ROADMAP.md   # what is actually open
> ```

Eighteen items are open; **nine are dispatchable** and nine are gated on the
owner or on a condition — *the count as it stood on 2026-08-24; see the note
above.* The order below is the plan of record. It is derived
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

*(True on 2026-08-18, not now — 168.1 and 169.3 are both open and dispatchable.
Read the `N. [ ]` checkboxes, not this line. Noted 2026-08-28, Slice 170.1.)*

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

## Slice 171 — Owner wishlist: score layout / usability / performance, then recommend (2026-08-28)

**Owner:** *"Score the layout, usability, performance — after getting the score,
recommend for the improvement."*

**Measured before proposing anything, because most of this already exists and
one part of it was already tried and REFUSED with evidence.**

Two scoring instruments ship today, and only one of them discriminates:

```
node examples/erp-suite/score.mjs                      # 28 suite screens
node -e "…dimensions of apps/docs/src/data/dsa-scores.json"   # 39 components
```

| instrument | dimension | distinct values |
|---|---|---|
| suite screens | **performance** | **23** — genuinely discriminating |
| suite screens | functionality | 2 — "uniform because the backlog is EMPTY, not because it cannot see" |
| components (DSA) | typography | **1** (3 on all 39) |
| components (DSA) | colour | **1** (3 on all 39) |
| components (DSA) | spacing | **1** (3 on all 39) |
| components (DSA) | interaction | 1 among scored (3 on 21, n/a on 18) |
| components (DSA) | content | 2 (one page at 2, 38 at 3) |
| components (DSA) | fit | 2 (one page at 0, 38 at 3) |

**So the wishlist maps onto three different situations, not one ask:**

- **performance — ALREADY BUILT and working.** Scored per screen as distance
  from the suite's own markup line (`own ≈ 68.7 + 1.26 × facts`, residual sd
  17.9), deliberately not an absolute budget because a budget cannot tell a
  RICH screen from a BLOATED one (145.2). Currently **one outlier beyond 2sd:
  `p2p/purchase-order`.**
- **"recommend the improvement" — ALREADY BUILT for screens.** `score.mjs`
  ends with *"What is missing, by frequency — this is the backlog the score is
  FOR"*. It does not exist for components, and the Polish loop **fixes** rather
  than recommends (LOOPS.md §3b step 2: *"fix exactly ONE scored weakness"*) —
  so nothing produces a recommendation LIST a human reads for components.
- **usability — TRIED AND DROPPED, by its own Accept test.** `ux` read **5/5
  on all 28 screens**, one distinct value; its five checks were binary (a
  caption is present or it is not), so they moved into `audit.mjs` where a
  binary property belongs, enforced once instead of re-confirmed 28 times
  (145.1). Re-adding it must first answer *why it will not read 5/5 again*.
- **layout — genuinely unscored.** The nearest dimension, DSA `spacing`, is
  documented as *"a DEBT MARKER, not a quality signal — satisfiable by the
  scorer writing the comment"* and reads 3 on all 39.

**The finding underneath the wishlist, and it is bigger than the wishlist.**
The instrument that drives the Polish loop — the DSA rubric — has **four of six
dimensions with exactly one value across 39 components**. A dimension that
cannot vary cannot rank, so "score, then improve the worst" has nothing to sort
by. The screen score, built later and with an explicit ACCEPT TEST that drops
any dimension below 3 distinct values, does discriminate. **The newer instrument
already contains the fix the older one lacks.**

1. [ ] **171.1 — decide whether the component rubric gets the screen score's
       ACCEPT TEST.** `score.mjs` drops a dimension that cannot produce 3
       distinct values; the DSA rubric has no such test and four dimensions
       that would fail it.
       *Accept*: a recorded decision. Applying the test would retire
       typography/colour/spacing/interaction as SCORES (they may remain as
       gated properties, which is what they actually are). **This is squarely
       against 101.3's stop rule** — "Polish may NOT add dimensions,
       definitions or gates" — so the honest reading is that this REMOVES
       rather than adds, and that argument has to be made explicitly rather
       than assumed. Refusing, and recording why the uniform dimensions earn
       their place, is a satisfying outcome.

2. [ ] **171.2 — a recommendation surface for components, or a recorded refusal.**
       Screens get one; components do not, and Polish fixes silently instead.
       *Accept*: either the component equivalent of *"what is missing, by
       frequency"* — reusing `check:wrong-choice`'s TODO set and the DSA
       dimensions that actually vary, never inventing a new score — or a
       recorded refusal on the ground that Polish already acts on the same
       information and a list nobody reads is ceremony.

3. [ ] **171.3 — layout: decide whether it is scorable at all before scoring it.**
       Measure the base rate FIRST, per CLAUDE.md: if a candidate layout
       predicate is already true of every screen, it is ceremony no matter how
       carefully written — which is exactly how `ux` died.
       *Accept*: a base-rate measurement recorded before any dimension is
       proposed, and **"layout is not scorable, here is the evidence"** is a
       satisfying outcome. `p2p/purchase-order`, the one live performance
       outlier, is the obvious first specimen.

**Not proposed: a new score for usability.** It has died once on measurement,
and re-proposing it without answering the 5/5 result would be re-raising a
settled refusal — which this file's own doctrine refuses.

## Slice 170 — Objective grill of Slices 164, 167, 169 (2026-08-28)

Dispatcher rule 3 at 3/3 `[164, 167, 169]`; rule 1 found no open P0 and GitHub
intake is empty (0 open issues), rule 2 read `Standardize 0 / 4`. Full report:
`.roundtable/grill-objective-164-167-169-2026-08-28.md`.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders — the grill file, this entry,
two annotations on narrative sections of this file, one corrected paragraph in
`LOOPS.md`, and `.roundtable/RESUME.md`. `git diff --stat` names no file under
`packages/core/src` or `apps/docs/src`, which is a stronger statement than a
screenshot. `check:layout` and `test:axe` swept every page at both widths anyway
and were green. **No visual debt was added; nothing visual was looked at.**

**The prose cost is named and measured, not estimated** —
`report_loop_prose.py`'s own `UNCOMMITTED` block reports this wake at **+147
words to `LOOPS.md`**, +203 to `RESUME.md` and +1,379 to `ROADMAP.md`. The
`LOOPS.md` spend is a wrong sentence replaced with a measured one, which is the
category 167.1 verdicted HONEST; the file still reads 21 up / 1 down, so 167.1's
watch condition ("`LOOPS.md` still at 0 down") stays discharged.

Window shape: 13 rows · landed 5 · refused 6 · logged 1 · triaged 1; all six
refusals are `Meta`. Refusal base rate since 2026-08-19 is **34.6%** (196 of
566), against 34.2%, 33.9% and 33.5% in the three previous windows — unmoved.
Reconciled before quoting: 666 raw bullets dated ≥ 2026-08-19, 666 parsed.

**Two findings were settled inside the grill and are not items.**

- **B — the Objective counter is armed, in part, by the Objective loop's own
  follow-up.** 161.4 excluded `Objective` from `CLOSES_A_SLICE` as *"circular"*,
  but a grill files its items **in its own slice number** and those are built by
  `Continue` rows, which do count. Whole log: **7 of 26** rule-3 dispatches would
  not have crossed without a grill-derived slice. **This wake is the extreme
  case and a first** — 2 of its 3 armed slices are grills (164, 167); without
  them the counter reads **1 of 3**, rule 4 would have run, and the oldest
  dispatchable item is **168.1**, the previous grill's own filed finding. So the
  self-arm deferred the fix for the finding. **Recorded, not gated**: rule 3
  sits above rule 4 precisely so it cannot starve, and a heading classifier in
  the dispatcher would be the sixth regex — this grill's own first attempt
  missed the older *"from the Objective grill, Slices 45-50"* convention (ten
  slices) and reported 4 of 26. `LOOPS.md` rule 3's circularity sentence is
  corrected in place with the command beside it.
- **C — the cloud era has changed no shipped declaration in 61 commits.** The
  last commit changing a declaration in `packages/core/src` is `c073c360` —
  independently confirmed as the cloud routine's own **first** commit. Since
  then `packages/core/src` moved 23 insertions / 2 deletions across 4 files and
  **zero** changed lines are declarations; all four are comment prose. That is
  blockage, not neglect — direction (a)'s remaining step is `npm publish`, which
  is owner-triggered — but it is the **third consecutive grill** to reach it
  (164.3, 168.C, this), and the filed answer, **168.1**, already exists.

1. [x] **170.1 — DONE 2026-08-28. `ROADMAP.md`'s plan of record went stale 37
       minutes after it was written, and 193 commits passed over it.**

       `## Sequence — what runs next, and why in this order (owner, 2026-08-24)`
       opens *"Eighteen items are open; nine are dispatchable"* and sequences
       five rows. Measured, every part is false: **5 open, 2 dispatchable**
       (`grep -cE "^[0-9]+\. \[ \]" ROADMAP.md`, and generated `STATUS.md`
       agrees independently at 2+1+1+1); rows 1 and 5 (140.3, 130.5) are `[x]`
       in the archive; row 2 (130.4a Production) was built and **130.4 closed
       without Inventory or Finance** — rows 3 and 4 — on the owner's own call;
       and the gated list still says *"precondition met (0.3.0 cut)"* while the
       package is at **0.5.0** with tags through `v0.5.0`.

       ```
       git log -1 --format='%h %ai' d04b5557    # 2026-08-24 20:45:35  wrote the section
       git log -1 --format='%h %ai' 45baaa12    # 2026-08-24 21:22:44  closed 130.4
       git rev-list --count d04b5557..45baaa12  # 4
       git rev-list --count d04b5557..HEAD      # 193
       git log --format='%h %ad' -S"Eighteen items are open" -- ROADMAP.md
       # d04b5557 was the ONLY hit when this was measured; from now on this
       # wake's own annotation is the second, so the property to check is
       # "nothing between d04b5557 and 2026-08-28 touched it", not the count.
       ```

       **Why nobody noticed for 193 commits**: rule 4 reads *checkboxes* and
       jumps to the item. Nothing in the dispatcher's path ever reads the
       narrative sections above the slice list, so a wrong plan there is
       invisible by construction. **Third instance of one shape in two
       consecutive slices** — 169.1 (`LOOPS.md`'s sweep instruction), 169.3
       (`RESUME.md`'s durable content), this — the common mechanism being a
       document written once and read by a path that does not verify it.

       *Accept*: the section states its own supersession, naming which rows
       closed and when, with the commands; the hardcoded open-item count is
       replaced by a pointer to the generated one; **the owner's text is left
       verbatim**, because 130.4's closure was itself an owner call and
       recording a supersession is bookkeeping while choosing a new sequence is
       not. **Done.** `## STATE — … (2026-08-18)` gained the same one-line
       annotation, its *"every unchecked item is undispatchable"* being equally
       untrue now. `## CI strategy` was checked and is sound — it claims nothing
       forward-looking and none of its standing rules is falsified — so the
       property is not "every narrative section rots": n=2 above the slice list,
       one stale, one not.

2. [ ] **170.2 — the generalized form of 170.1: nothing re-reads the narrative
       sections of `ROADMAP.md`, and refusing this is a satisfying outcome.**
       Noticed while grilling 170.1, not searched for.

       The checkbox list is verified constantly — `STATUS.md` reconciles against
       it, `check:slice-refs` keeps its citations resolvable, rule 4 walks it
       every wake. The prose above it is verified by nothing. 170.1 is one
       instance; the question is whether the class deserves a mechanism.

       **The base rate must be measured before anything is built**, because
       94.11 is the precedent: searching every tracked `.md` for `plan of record`
       and `what runs next` finds exactly **one** such table (this file's
       `## Sequence`, the header row `| # | Item | Why here |`), so a gate over
       it would be n=1 ceremony. The one *exact* (non-heuristic) predicate is
       promising and should be measured rather than assumed: a narrative row
       naming an item id (`**130.4a**`, `**140.3**`) can have that item's
       checkbox state looked up mechanically, so "a plan row points at a closed
       item" is checkable by equality, not by recognition.

       *Accept*: a recorded verdict that either (a) names the predicate, reports
       how many rows in the repo it would examine today and how many it flags,
       and ships a gate **only if that count distinguishes** — or (b) records
       the measured base rate as the reason to refuse, with the number. A
       finding that the base rate is too thin to gate satisfies this item
       exactly as well as a gate does. **Do not accept a cadence bullet added to
       `LOOPS.md` without measuring first** — 167.1 has that file's growth on
       the record and 158.2's cadence rests on a signature (never shrinks) that
       nobody has shown holds for a narrative section of `ROADMAP.md`, a file
       measured at **-85.9%** over the same window.

3. [ ] **170.3 — `dispatch_status.py`'s zero-slice guard hard-exits on a
       legitimate row, and this wake tripped it live.** Found by triggering it,
       not by reading the code.

       The guard raises when *"N Continue round(s) since the last Objective
       round and NOT ONE names a slice"*, on the stated inference that this
       means the parser is blind. It fired after this wake recorded a
       `Continue · fix` row for the trap-1 correction — a row that genuinely
       belongs to no slice. **Its inference is unsound on a small window, and
       the base rate says so:**

       ```
       python3 - <<'PY'
       import sys,re; sys.path.insert(0,'scripts/loops'); import dispatch_status as ds
       R=re.compile(r"^- (\S+ \S+) · ([\w-]+) · ([\w-]+) · (.*?) · (\w+) · \S+$")
       rows=[m.groups() for m in (R.match(l.rstrip()) for l in
             open('.roundtable/loop-log.md')) if m]
       cs=[r for r in rows if r[1] in ds.CLOSES_A_SLICE]
       no=[r for r in cs if not ds.slice_of(r[3])]
       print(len(cs),"rows ·",len(no),"name no slice")
       PY
       # 477 rows · 117 name no slice   (24.5%, 2026-08-28)
       ```

       At 24.5% a window of ONE has roughly a one-in-four chance of tripping the
       guard with nothing wrong, two rows ~6%, three ~1.5%. And the failure mode
       is the expensive one: **a hard exit of the script the dispatcher reads at
       Step 0b**, so the next wake gets no counters at all rather than a warning
       it can weigh. Compare the reconciliation 164.1 installed one slice
       earlier, which raises on a *provable* disagreement (parsed rows vs raw
       bullets) rather than on an inference.

       **What this wake did, said plainly so it does not read as the guard being
       appeased**: the row was amended in place — seconds old, uncommitted — to
       read `170 — trap 1 corrected …`, which is accurate (the correction is
       Slice 170's work) and restored Step 0b immediately rather than leaving
       the next wake with a dead first step. The finding is filed regardless.

       *Accept*: a recorded verdict that either (a) makes the guard's severity
       match the strength of its inference — with the threshold chosen from the
       measured base rate and red-proved in **both** directions, that it still
       fires on a genuinely blind parser and no longer fires on a legitimate
       slice-less window — or (b) records the measured reason to leave it fatal,
       naming what a wake should do when it fires. **Do not resolve this by
       requiring writers to name a slice**: 24.5% of the log already does not,
       164.1 refused a writer-side guard on a neighbouring field for base-rate
       reasons, and the mode/item text is deliberately free.

       **Noted, not a finding**: `dispatch_status.py` now reads
       `Objective 1 / 3 [170]` — this grill's own follow-up row is already the
       first slice arming the next grill, which is finding B happening inside
       the wake that measured it.

## Slice 169 — Standardize sweep: the correction landed in the file that is rewritten every wake (2026-08-28)

Dispatcher rule 2, `dispatch_status.py` reading `Standardize 4 / 4 OVERDUE`.
Rule 1 found no open P0 and GitHub intake is empty (0 open issues), so nothing
preempted it. Third run of the cadence 158.2 installed.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders — one Node report script
(`apps/docs/scripts/report-prose.mjs`, a console.log format), `LOOPS.md`, this
file and `.roundtable/RESUME.md`. No CSS, Astro page or shipped JS was touched,
which is a stronger statement than a screenshot: `git diff --stat` names no file
under `packages/core/src` or `apps/docs/src`. `check:layout` (127 pages) and
`test:axe` (127 × 2) swept anyway and were green. **No visual debt was added;
nothing visual was looked at.**

1. [x] **169.1 — three sweeps clean; the finding is that the playbook still
       carried a claim two earlier rounds had already refuted.**

       ```
       npm run scan:dead-style -w docs                  # 0 dead of 1,428 live inline declarations
       npm run report:css-repeats -w @busy-office/ui    # 74 files · 237 rules · 225 bodies · 8 repeats
       npm run report:prose -w docs                     # 118 pages · median 739 · total 104,419
       python3 scripts/loops/report_loop_prose.py       # LOOPS.md 20 up / 1 down
       ```

       **`scan:dead-style` — zero delta.** 0 dead of 1,428, identical to 161.1's
       figure. **`report:css-repeats` — zero delta.** 8 bodies, and all eight
       groups are the ones LOOPS.md's table already names; the joined-control x4
       group is still two components, so its reopen trigger (a THIRD component)
       is unmet. **`report_loop_prose.py`** — `LOOPS.md` reads **20 up / 1 down**,
       which discharges the watch condition 167.1 left ("`LOOPS.md` still at 0
       down after 167.2"). No file changed accumulate class.

       **`report:prose` — zero unverdicted pages, for the second round running,
       and LOOPS.md said otherwise the whole time.** Its Standardize step 1 named
       `/base/motion/`, `/concepts/js-behaviors/` and `/concepts/design-language/`
       as "the three the family split adds and nobody has read". **161.1
       verdicted all three**, in the run that wrote that sentence. **166.1 found
       exactly this**, and corrected `.roundtable/RESUME.md` — "Corrected in the
       handover rather than counted again" — while leaving `LOOPS.md` untouched.
       `RESUME.md` is rewritten every wake by its own charter, so the correction
       was discarded and the wrong sentence persisted in the file the dispatcher
       reads every wake.

       **The cost is measured, not supposed: this wake paid it a third time.**
       Before finding 161.1's entry, this round re-derived all three pages from
       scratch with a throwaway probe against `proseParts`. The re-derivation
       reconciles exactly, which is the one useful thing it produced:

       | page | this wake | 161.1 | reconciles |
       |---|---|---|---|
       | `/base/motion/` | 718 (639a+79g) | 718 | exact |
       | `/concepts/js-behaviors/` | 1,429 (375a+1,054g) | 1,429 / 1,054 / 375 | exact |
       | `/concepts/design-language/` | 1,231 (1,231a+0g) | 1,230 | +1, accounted for |

       The +1 is not instrument drift. Commit `6dff04bb` (161.2) landed after
       161.1's verdict was written and changed one `Related` label on that page:
       `'Invoice-list pattern'` → `'List report pattern'`. Under the counter's
       own word regex that is 2 words → 3. **Exactly +1**, to the word.

       ```
       git show 6dff04bb -- apps/docs/src/pages/concepts/design-language.astro
       ```

       *Accept*: `LOOPS.md`'s prose-sweep instruction names the **property** —
       any flagged page carrying no verdict in `ROADMAP.md` or
       `ROADMAP-archive.md` — instead of a snapshot of page names, and points at
       158.1 and 161.1 as where the verdicts live. **Done.** This is CLAUDE.md's
       existing criterion rule ("name the property, never the value it will
       have") applied one level up, to an instruction rather than an Accept. **No
       new doctrine and no gate**: "is this claim in the playbook still true" is
       semantic, and 94.11 already paid for that lesson.

2. [x] **169.2 — the family half of `report:prose` hid the one number that
       decides whether its own outliers are worth reading.**

       Found while paying 169.1's cost. `report-prose.mjs`'s corpus list prints
       `authored + generated` per outlier, and its header argues at length why:
       *"judging an author by a number a quarter of which is machine-written is
       the wrong instrument."* The **family** list printed a bare URL. So the
       half of the report that LOOPS.md's step 1 actually sends a wake to read
       was the half with no split.

       That is not cosmetic, and 161.1's own verdicts are the proof: its ruling
       on `/concepts/js-behaviors/` is **"the instrument, not the page"** — 1,054
       of 1,429 words generated, 375 authored, which is **below its own family
       median of 556**. None of that was visible from the family line, so the
       only way to reach the verdict was the throwaway probe 169.1 describes.
       `/concepts/which-pattern/` is the same shape at **310a+2,015g**: 2 of the
       12 family-flagged pages are majority machine-written.

       *Accept*: the family list prints the same `Na+Ng` split the corpus list
       does, and the two agree. **Done, and reconciled three ways** — the new
       family output matches the throwaway probe exactly on all three pages, it
       matches the corpus half exactly on all **nine** pages that appear in both
       lists, and the corpus total `104,419` is unmoved from 166.1's reading.
       No threshold changed: what is flagged is identical before and after, so
       this adds information and removes none.

       **Not a gate, deliberately** — 158 refuses a word-count gate up front and
       that reasoning is untouched here. This changes a `console.log` format.

3. [x] **169.3 — DONE 2026-08-28 (cloud wake). Implemented, not refused.** The
       traps, the toolchain, the carried-forward measurement discipline and the
       standing owner instruction now live in **`.roundtable/ENVIRONMENT.md`**;
       `RESUME.md` keeps a pointer and only what its own header allows;
       `LOOPS.md` Step 0 names both files; `check:resume-charter` holds both
       ends. The full decision, with the premise re-check that changed the
       argument, is at the end of this item.

       **the generalized form of 169.1: `RESUME.md` is carrying durable
       content, and its charter says it cannot.** Noticed in this round's
       re-scan, not searched for — 169.1 is one instance and this is the shape.

       `RESUME.md`'s own header states what belongs in it: *"Only put things
       here that `ROADMAP.md` and `.roundtable/loop-log.md` cannot say:
       uncommitted work, and a decision made but not yet written down."* It is
       rewritten every wake by design (167.1 measured 26 up / 13 down over 40
       transitions and concluded that shrinking it is the rule).

       **Measured: 164 of its 261 lines (63%) are neither.** The cloud-wake trap
       block (lines 33-155), the toolchain recipe (156-174), "Traps worth
       carrying forward" (240-252) and the standing owner instruction (253-261)
       are durable environment knowledge. They survive only because each wake
       re-copies them by hand, and the count of successive rewrites they have
       survived is the point:

       ```
       python3 - <<'PY'   # commits touching RESUME.md that still contain each probe
       import subprocess
       shas=[l.split()[0] for l in subprocess.run(['git','log','--format=%H %cs','--',
             '.roundtable/RESUME.md'],capture_output=True,text=True).stdout.split('\n') if l.strip()]
       for name,needle in {'shallow':'THE CLONE IS SHALLOW','CHROME_PATH':'CHROME_PATH',
           'detached':'the container starts DETACHED','astro dist':'astro build` does not clear',
           'prettier':"IS NOT THIS REPO'S FORMATTER",'cwd':'WORKING DIRECTORY PERSISTS'}.items():
           n=sum(needle in subprocess.run(['git','show',f'{s}:.roundtable/RESUME.md'],
                 capture_output=True,text=True).stdout for s in shas)
           print(f'{name:12} {n:3d} of {len(shas)}')
       PY
       ```

       48 commits touch the file; the six probes are present in **14-20** of
       them, every one dating to 2026-08-27 — the day the cloud routine's first
       commit (`c073c36`) landed. Content that has survived sixteen manual
       re-copies is durable by demonstration.

       **Why this is the same drift and not a tidy.** 169.1's wrong sentence
       persisted precisely because 166.1 put its correction in this file. A
       handover that is rewritten every wake is a place corrections go to die,
       and the more durable content it accumulates, the more often that happens.

       *Accept*: the cloud-wake traps and toolchain live in a file that is not
       rewritten every wake, and `RESUME.md` retains a pointer plus only what
       its own header allows. **Either that, or a recorded reason the handover
       is the right home after all** — refusing is a valid outcome, and the
       argument for refusing is real: the traps are read at Step 0 precisely
       because `RESUME.md` is the file Step 0 opens, and a pointer is read less
       than a paragraph (this file's own words, 167.2).

       **Deliberately not decided by that wake.** The destination is a direction
       call, not a mechanical move: 167.2 split `LOOPS.md` one wake ago
       specifically to stop it growing, so appending 140 lines of environment
       traps to it cuts against a decision made one wake earlier, and a new root
       document is a new durable artefact. Per this project's operating rule, an
       improvement bigger than the item becomes a roadmap entry rather than an
       extra commit.

       ### DECIDED 2026-08-28 — move it. What the premise re-check changed.

       **Half the item's own supporting evidence turned out to argue the other
       way, and that is the finding.** 169.3 rested on *"content that has
       survived sixteen manual re-copies is durable by demonstration"*. A
       continuity probe over all 53 revisions of the file — asking not whether
       each trap is present today but whether it was ever **dropped and later
       restored** — strengthens the durability half and destroys the risk half:

       ```
       # for each probe, walk the revisions chronologically and count the
       # present -> absent transitions after its first appearance
       python3 - <<'PY'
       import subprocess
       rows=[l.split() for l in subprocess.run(['git','log','--format=%H %cs','--',
             '.roundtable/RESUME.md'],capture_output=True,text=True).stdout.split('\n') if l.strip()][::-1]
       texts=[subprocess.run(['git','show',f'{s}:.roundtable/RESUME.md'],
              capture_output=True,text=True).stdout for s,_ in rows]
       for name,needle in {'shallow':'THE CLONE IS SHALLOW','CHROME_PATH':'CHROME_PATH',
           'detached':'the container starts DETACHED','astro dist':'astro build` does not clear',
           'prettier':"IS NOT THIS REPO'S FORMATTER",'cwd':'WORKING DIRECTORY PERSISTS',
           'toolchain':'Cloud-wake toolchain','bg-task':'NOT A COMPLETION SIGNAL',
           'wc':'UNDERCOUNTS THIS REPO'}.items():
           seq=[needle in t for t in texts]; f=seq.index(True); tail=seq[f:]
           gaps=sum(1 for i in range(1,len(tail)) if tail[i-1] and not tail[i])
           print(f'{name:12} {sum(seq):3d}/{len(seq)}  dropped-then-restored {gaps}')
       PY
       # 9 probes, 53 revisions, DROPPED-THEN-RESTORED = 0 for every one
       ```

       So **the re-copy has never lost anything.** Loss was never the cost, and
       an item arguing "move it before it gets lost" would have been arguing
       from a risk that 53 revisions say does not occur. The real cost is the
       one 169.1 actually paid, and it is about **visibility, not survival**: a
       correction to a trap lands inside a 111-line wholesale rewrite, where
       nothing distinguishes it from the wake's own churn.

       **The two numbers that decided it**, both re-runnable:

       ```
       # durable vs per-wake lines, and their growth, across the 27 revisions
       # since durable content first appeared  (full script: see the wake's
       # transcript; it splits on '## ' and bills each section to one half)
       #   durable    9 -> 214 lines   up 15  down 3  flat  9
       #   per-wake  93 -> 158 lines   up 15  down 8  flat  4
       #   whole    102 -> 372 lines   up 20  down 7  flat  0

       # mean churn per commit on the handover, last 20 commits
       git log --format=%H -20 -- .roundtable/RESUME.md | while read s; do
         git show $s --numstat --format= -- .roundtable/RESUME.md; done |
         awk -F'\t' '{a+=$1;r+=$2;n++} END{print a+r" lines over "n" commits, mean "int((a+r)/n)}'
       #   2219 lines over 20 commits, mean 111
       ```

       **214 of 372 lines (57%) were durable** — 169.3 read 63% of 261, and the
       fraction fell only because 168.1 added *per-wake* answers, not because
       anything left. Over those 27 revisions the half this file is not for grew
       **3.2x faster** than the half it is for.

       **The refusal argument was weighed and does not transfer.** "A pointer is
       read less than a paragraph" is 167.2's line about splitting *narrative*
       into an archive nobody is instructed to open. `LOOPS.md` **Step 0 now
       names both files**, which makes reading `ENVIRONMENT.md` a step the
       dispatcher executes rather than a cross-reference it may skip. That is the
       whole difference, and it is why the destination is `.roundtable/` — a
       sibling of `loop-log.md`, `INDEX.md` and `RESUME.md`, not the "new root
       document" the item worried about, and not `LOOPS.md`, which 167.2 split
       one wake earlier precisely to stop it growing.

       **`check:resume-charter` is the ratchet**, and its base rate is the
       reason it is not ceremony: the predicate was **FALSE on the real tree**
       before the move, so the gate was watched failing on the actual defect
       rather than on an injection — 6 of 6 rules red on `HEAD`'s
       `RESUME.md`. Confirmed both ways afterwards, injections verified to have
       taken effect before believing either result: dropping the pointer → red
       on assertion 1; blanking a trap in the destination → red on the arrival
       check. `@exact` — both halves are string membership over two files, so no
       `--self-test` is owed.

       **The gate's own first version had the bug this repo keeps paying for**,
       caught before it shipped: it asserted the four *old headings* were
       present in the destination, but `ENVIRONMENT.md` deliberately re-titles
       several sections and `READ FIRST IF THIS IS A CLOUD WAKE` exists nowhere
       in it. Three of four matched by luck; the check meant to prove arrival
       would have proved the opposite and been "fixed" by loosening it. It now
       probes for the content a reader came for (`THE CLONE IS SHALLOW`,
       `NOT A COMPLETION SIGNAL`, …), not for a heading.

       **And a SECOND defect in the same gate, found by its own output minutes
       after the push.** `headingsIn` filtered `^#{1,6} ` line by line with no
       notion of fenced code blocks — and both files are full of shell recipes
       whose comments start with `#`, so running the same expression by hand
       over the finished `RESUME.md` returned three "headings" that are bash
       comments (`# fb15cdc is the commit carrying the owner's decision`). It
       fails closed, so no verdict was wrong; what was wrong is the **`@exact`
       tag**, because recognising a heading amid code fences is exactly the
       recognition step that tag claims is absent — and `check:selftests`
       classifies gates by that tag, so the mislabel propagates. Now fence-aware,
       and re-proved in both directions rather than only re-run: a real heading
       appended outside a fence goes red; the identical text inside a fence does
       not. **A fix that quietly stops the detector from firing is the worse
       bug**, which is why the second half of that proof exists.

       **And a THIRD, which turned CI red — the one this repo has already
       written down.** The first push took the docs container build red at
       `Containerfile:33`: `check:repo` now ends in `check-resume-charter.mjs`,
       and that context copies only `package.json`, `packages/`, `apps/docs`,
       `DESIGN.md` and `examples/erp-suite` — **`.roundtable/` is not there**, so
       `readFile` threw ENOENT and the whole docs build failed.

       This is CLAUDE.md's *"A gate that only runs in CI is not known to work"*
       section, reproduced almost word for word: it names `check:rtl`'s DESIGN.md
       assertion breaking the po-app image "because that context copies only
       `packages/` and the file simply is not there". The gate had been verified
       in the cloud container's **full checkout — the most permissive context the
       build has** — which that section says is one data point, not portability.

       Fixed to the contract the section states and that four sibling gates
       already follow (`check:rtl` for DESIGN.md, `check:loop-vocab` for
       `record_iteration.py`, `check:slice-refs`, `check:ci-ignores`): **say so
       loudly, never skip quietly.** Absent input now prints "the handover
       charter was NOT verified (expected inside container builds; CI has the
       full checkout and does verify it)" and exits 0.

       Verified in the narrowest context that must run it, which is the step that
       was skipped: a scratch tree containing exactly the Containerfile's `COPY`
       set, where it now warns and exits 0 alongside its two siblings. And
       re-proved that the skip path did not disable the gate — with
       `.roundtable/` present, dropping the pointer is still red.

       ```
       # reproduce the container context without building an image
       mkdir -p ctx/apps && cp package.json package-lock.json tsconfig.base.json DESIGN.md ctx/
       cp -r apps/docs ctx/apps/ && cp -r packages ctx/packages
       (cd ctx/apps/docs && node scripts/check-resume-charter.mjs)   # warns, exit 0
       ```

       **Three instrument defects in one gate, in one wake** — the same 3-of-3
       rate Slice 168's grill measured across three slices, here compressed into
       a single file. Two were caught by the gate's own output; the third needed
       CI, because it is the one defect that is invisible everywhere the author
       can see. Material for the grill rule 3 now has queued.

       **Not verified: nothing visual.** This was a cloud wake — no Podman, no
       `localhost:8081`, no screenshots. No CSS, Astro page or rendered surface
       was touched, which is a stronger statement than a screenshot;
       `check:layout` and `test:axe` swept all 127 pages at both widths anyway.

4. [ ] **169.4 — `check:repo` now reads a path CI ignores, and the gate that
       exists to catch that cannot see it.** Caused by 169.3 and found in the
       same wake, by noticing that its own last push created no CI run.

       Two facts, both measured rather than reasoned:

       ```
       npm run check:ci-ignores -w docs | tail -1
       # -> "verified against 124 script(s): STATUS.md"
       #    ONE of the two paths-ignore entries. check-ci-ignores.mjs line ~80
       #    filters entries containing '*' ("directory globs have no single
       #    file to read"), so '.roundtable/**' is skipped by construction.

       # and the new gate does read them, by check-ci-ignores' OWN readsFile():
       #   RESUME.md      -> READ
       #   ENVIRONMENT.md -> READ
       ```

       So `check-resume-charter.mjs` runs inside `check:repo` and opens
       `.roundtable/RESUME.md`, while `.roundtable/**` sits in `paths-ignore`.
       **A commit touching only `.roundtable/**` can break `check:repo` and will
       not be built**, surfacing on the next commit that is — the exact silent
       condition `check-ci-ignores.mjs`'s header describes, landing in the one
       slot that gate does not cover.

       **Severity, honestly bounded:** smaller than the general case, because
       the failure text names the file and the reason ("RESUME.md points at
       ENVIRONMENT.md — the pointer is gone"), so a reader is not misled about
       which change caused it. The ratchet is delayed, not dead. But the
       invariant `paths-ignore` rests on is genuinely violated, and `ci.yml`'s
       comment asserted the opposite until this item corrected it.

       *Accept*: `check:ci-ignores` and `ci.yml` agree with what the scripts
       actually read — **either** the glob is covered (which requires resolving
       one of the options below, since covering it while the read exists is red
       by construction), **or** a recorded reason the glob is legitimately out
       of scope. Whichever is chosen, `ci.yml`'s comment states what is true of
       `.roundtable/**` at that point, and the claim is checked by a command
       rather than by the comment.

       **Not decided by the wake that caused it** — it is a cost/benefit call:

       - **Un-ignore `.roundtable/**`.** Correct and simple; costs the saving
         this list exists for. Re-measure before choosing — the comment's
         "8 of the last 30 commits" is a snapshot from a different era, and the
         loop's commit mix has changed.
       - **Move the charter check out of `check:repo`** into the loop's own
         tooling, which already runs mechanically every iteration
         (`record_iteration.py`). Arguably the right LAYER — the charter is a
         property of loop bookkeeping, which CI deliberately does not build —
         but LOOPS.md's "a gate that needs a human to start something is not a
         gate" deserves an answer first: the loop is not a human, yet it is also
         not CI.
       - **Cover globs in `check:ci-ignores` and accept the red** until one of
         the two above lands. Honest, and unshippable as-is.

## Slice 168 — Objective grill of Slices 163, 164, 165 (2026-08-28)

Rule 3 at 3/3. Full report:
`.roundtable/grill-objective-163-165-2026-08-28.md`. Index checked first — no
prior grill covers these three, so not a repeated subject.

**Every slice in the window contained an instrument defect, and the
instrument's own item is what found it — 3 of 3.** 163's used-once
reconciliation was computed and never printed (caught by red-proving both
directions and getting *silence*); 164.1's parser missed 9 rows, every one a
`Continue` row, printing 982 against a raw 991; 165's counting command bills
non-slice `## ` sections to the preceding slice, so Slice 29 read 78 lines
while being a correct 3-line pointer. **None was caught by a gate** — each was
caught by the wake using the instrument. Counter-evidence is substantial: all
three were caught before a wrong claim reached anything, and 164.1 measured its
own blast radius at **one wrong verdict in 703 revisions**. No gate proposed;
two of the three already print their own reconciliation and the third is a
throwaway snippet.

**"Re-run the command first" paid off twice in one window.** 163.1 agreed
exactly (61/75/7/10) and said so; 165.1 disagreed (21/3,125/4,461 against a
pinned 20/3,019/4,212), and chasing the extra slice is what exposed the third
defect above. Recorded because grills mostly record failures: **a number written
next to its command is a number the next wake can falsify.** Its own
falsification test — whether items written a month from now still carry their
commands.

1. [x] **168.1 — DONE 2026-08-28. Implemented, not refused, and the argument
       for refusing died on a fact of the wake that closed it: a scheduled cloud
       routine has no conversation.** `RESUME.md` now carries a standing
       `## Direction` block — four answers a wake fills from named sources, two
       of them backed by a recorded command. Four lines of answer, ~40 of
       template and reasoning; no dispatcher rule, no gate, no ratio.

       **The premise was re-checked before being built on**, per CLAUDE.md, and
       it holds — but only one of its two halves was still true as written:

       ```
       npm view @busy-office/create-ui version   # E404 — still unpublished
       npm view @busy-office/ui version          # 0.5.0
       ```

       The registry is the authority here, and it was asked rather than the
       roadmap's own text re-read. **The "zero times since" half is now wrong and
       was wrong when written**: `fb15cdc`, the commit carrying the owner's
       decision, *is* 164.3 fixing three publish blockers. Measured over the 13
       work rows recorded since it, exactly **1 names `create-ui` and it is that
       row**, so the true figure is **12 of 13 did not advance it** — which is
       the finding, and stronger than "zero", because it is a rate that can be
       re-derived next wake instead of a state that cannot. The command is in the
       block itself.

       The owner decided (2026-08-28) to finish direction (a) by publishing
       `create-ui`. The remaining step is `npm publish`, owner-triggered
       by standing policy. So rule 4 did what rule 4 does — took the oldest open
       item — and the window's work was a report script and an archive sweep.

       **`LOOPS.md` cannot notice.** It mentions "direction" seven times and
       every one is *direction as an input to triage*; no rule tracks whether
       the chosen direction is being advanced, and none can distinguish "the
       direction is blocked and what remains is maintenance" from "healthy
       work". Rule 8 halts only when NOTHING matches, which is never true while
       maintenance exists — and maintenance always exists.

       Same shape this file has recorded three times about counters: a signal
       starving under a rule that is always true. One level up, the starving
       signal is the **direction** and the always-true rule is rule 4.

       *Accept was*: the smallest thing that makes it sayable — a line in
       `RESUME.md`'s handover naming the current direction and whether the wake
       could advance it. **Not a new dispatcher rule, not a gate, and not a
       ratio**: the product-vs-machinery ratio was retired one grill ago with
       "not to be re-raised as a new finding", and that retirement is correct —
       a ratio cannot tell maintenance that UNBLOCKS product from maintenance
       that displaces it. **Refusing this outright is a valid outcome**, and the
       argument for refusing is that the owner already sees it in conversation.

       **Why that refusal argument was rejected, and it is a fact of this wake
       rather than a preference.** "The owner already sees it in conversation"
       assumes a conversation. This wake is the hourly cloud routine: nobody was
       reading, and its only channel to the owner is one push notification whose
       content it composes from the handover. `LOOPS.md`'s own Step 0c records
       that promoting the loop to `/schedule` "made a second dispatcher real
       without a rule changing" — the same promotion is what removed the
       conversation this item's refusal depended on. That is the third time this
       file has recorded a rule outliving the conditions it was written under.

       **Two smaller variants were considered and refused, each for a stated
       reason, not for taste:**

       - **Generate the block into `STATUS.md`** (which `record_iteration.py`
         already rewrites every wake, so it could never be copied stale). It
         cannot be generated: "is the direction blocked" is not derivable from
         the log without classifying rows by what they were *about* — the sixth
         regex `LOOPS.md` rule 3 refuses by name, and 170.3 is open on that
         script hard-exiting over exactly this kind of inference. The count that
         IS derivable is in the block, with its command.
       - **A threshold on that count** ("warn at N wakes without advance").
         That is the ratio 168.1 refuses in its own Accept, and it inherits the
         flaw named there: it cannot tell maintenance that unblocks product from
         maintenance that displaces it. The block states the number and leaves
         the judgement where the item put it.

       **The tension with 169.3 is real and is not resolved here.** 169.3 (open)
       finds that 63% of `RESUME.md` is durable content its own header forbids,
       and this item adds ~40 more lines of it. Named rather than smuggled: the
       *answers* are per-wake and belong in a handover; the *template and the two
       commands* are durable and travel with the traps if 169.3 decides to move
       them. That decision stays 169.3's — this item was dispatched by rule 4 as
       the oldest open, and doing 169.3's direction call inside it is the scope
       creep the Objective refuses.

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

1. [x] **167.1 — DONE 2026-08-28. Five verdicts: 2 instrument, 3 honest, 0
       removable that is not already filed. The cadence extends; 158.2's
       INSTRUMENT does not.**

       *Accept was*: a recorded verdict for each of the five loop-machinery
       files naming whether its growth is honest, instrument, or removable —
       the 158.1 three-way split — **or** a recorded reason the cadence should
       not extend here. Both halves are below.

       ```
       python3 scripts/loops/report_loop_prose.py                  # 158.2's window
       python3 scripts/loops/report_loop_prose.py --since 2026-08-19
       npm run report:prose -w docs                                # the comparator
       ```

       **Three of this entry's own five loop-machinery figures did not survive
       being re-run**, which is why its Accept said re-run rather than quote:

       | | filed | re-run 08-20 -> HEAD 787319c3 |
       |---|---|---|
       | `RESUME.md` | +256.0% | **+100.4%** (837 -> 1,677) |
       | `LOOPS.md` | +121.6% | **+126.3%** (4,380 -> 9,910) |
       | ROADMAP **+ archive** | +107.9% | +112.5% (86,368 -> 183,496) |
       | `ROADMAP.md` **alone** | not measured | **-85.9%** (86,368 -> 12,150) |
       | `CLAUDE.md` | +60.5% | +60.5% |
       | `DESIGN.md` | +15.7% | +15.7% |

       **The load-bearing number is not the delta, it is whether the file
       accumulates.** 158.2's cadence rests on one measurement — of the 89 docs
       pages present throughout, **not one ended shorter than it started**. That
       is what makes a rising word count a signal there. Over every commit
       touching each file since 2026-08-19:

       ```
       RESUME.md    27 up / 13 down     min 314 · max 2,980 · now 1,677
       ROADMAP.md  376 up / 12 down     peak 110,061 -> 12,150
       LOOPS.md     25 up /  0 down
       CLAUDE.md    10 up /  0 down
       DESIGN.md     6 up /  0 down / 1 flat
       ```

       Three files show 158.2's signature and two do not, so the predicate
       distinguishes rather than being uniformly true (94.11's base-rate check).
       That split IS the verdict:

       1. **`.roundtable/RESUME.md` — INSTRUMENT.** It is rewritten each wake,
          not appended: it ends shorter in **13 of 40** transitions. Its peak of
          **2,980 is the exact commit this entry quoted** (`c4390c7d`), and the
          very next commit to touch the file — `c432dbc0`, whose subject reads
          *"cut this file by half"* — took it to 1,658, **-44.4% in one commit**;
          it is 1,677 today. A word count over a sawtooth measures which wake
          wrote the handover. The file's own *"a handover that only grows stops
          being read"* is a rule it is visibly obeying.
       2. **`ROADMAP.md` (+ archive) — INSTRUMENT.** The filed figure sums the
          file rule 4 reads with the archive it is emptied into; rule 4's own
          text says *"Read `ROADMAP.md` only"*. Measured alone over the identical
          window the live file is the **largest shrink in the repo, -85.9%** —
          376 up / 12 down, and the 12 downs (the archive sweeps, 165.1 the
          latest) dominate the other 376 across 388 transitions. Growth here is
          already managed, and the
          combined number measures a quantity no wake reads.
       3. **`LOOPS.md` — HONEST, with one removable region already filed as
          167.2.** 25 up / 0 down — the only file that matches 158.2's signature
          *and* is read every wake. Where the +5,530 words went, by section
          (`git show 6ffdfd3f:LOOPS.md` vs HEAD, split on `##`/`###`):
          Step 2 **+1,426** · Step 0c **+1,026** (new — the concurrency
          decision) · Polish playbook +591 (new) · the css-repeats count +521
          (new) · Standardize +435 · Ideas backlog +334 · Operating rules +272 ·
          the two `Settled:` refusals +445 (new) · Research +181 (new) ·
          Optimize +109 · `The eight loops` +214, replacing `The six loops`
          (-160). Those entries are +5,394 of the +5,530; the remaining **+136**
          is spread across smaller sections. So the growth is two loops that did
          not exist on 08-20, a decision, and refusal records whose whole purpose
          is that this file says they were re-raised twice before being written
          down. The one
          region that is archaeology is rule 3's, inside that +1,426 — and
          **re-running 167.2's own command it is now 1,171 words (181 rule /
          990 history), up from the 1,026 (181 / 845) it was filed at.** It grew
          145 words, all of them history, while the item to archive it sat open.
       4. **`CLAUDE.md` — HONEST.** 10 up / 0 down, +1,793 words, and every
          section added names the measured failure that produced it (the Accept-
          criterion rule +528, the storage doctrine's reconcile rule +426, base
          rate +267, instrument first-output +153). **Watch, not a finding:** 7
          of its 16 `##` sections — **1,893 of 4,600 section words, 41%** — are
          all on one subject, whether a detector can fail (`##`-split word
          counts; the 159 words of difference from the file's 4,759 are the
          heading lines themselves). They are not duplicates (injection
          validity, base rate, heuristic self-test, CI-only, structural
          assertion, first output, reported number are seven distinct traps),
          but a wake reading one gets no pointer to the other six. Reopen if an
          eighth is added without folding.
       5. **`DESIGN.md` — HONEST, and it is the control.** 6 up / 0 down / 1
          flat, **+15.7%** — the slowest-growing file measured, under a third of
          docs' +51% (158.2's figure over the 89 pages present throughout;
          quoted, not re-run — the docs corpus total *was* re-run and is
          104,419, unmoved from 166.1's run earlier the same day, while
          `LOOPS.md` went 6,927 → 9,910 over those three days).
          The entry called it "not a like-for-like comparator" and
          that is right, but it is the useful comparator: it shows the repo can
          hold a file near flat while everything around it grows, so the growth
          elsewhere is a property of those files and not of the era.

       **THE DECISION: the cadence extends to these files; 158.2's INSTRUMENT
       does not.** The cadence is a periodic read with a verdict, and that is
       worth having. What is refused is the median-outlier test, measured:

       - **n=5 has no usable median.** 158.2 works on 118 comparable pages in 7
          families. 161.1 already recorded `/base/`'s **n=6** family median
          failing — a 6.5x internal spread let it flag a page for being
          *average-length*. Here n=5, the spread is 1,677 to 171,346 (**102x**),
          and the five documents have no common shape at all.
       - **The premise is false for two of the five** — they shrink by design,
          so the "a justification test cannot produce a shrink" argument that
          justifies the cadence does not transfer to them.

       So `report_loop_prose.py` ships instead: it prints the delta **and** the
       accumulate signature, refuses to report on a shallow clone (RESUME.md's
       trap 2 — every figure here is history, and a shallow clone makes history
       silently wrong), and reconciles each count against the working tree
       rather than only the object store. **Three guards, each red-proved end to
       end, and the two reconciliation outcomes are deliberately different
       severities:**

       - a real `git clone --depth 1` of this repo → `REFUSING TO REPORT`, exit 1;
       - a listed path that does not exist (`DESIGN-typo.md`, injected into a
         probe copy in the same directory — not via `git stash`, per RESUME.md's
         trap) → `RECONCILIATION FAILED`, exit **1**. Injection confirmed by the
         `DESIGN.md` row disappearing from the table, not by the message alone.
         Fatal because a missing path reports a plain `0` that reads exactly
         like a real count;
       - an uncommitted edit → a loud `UNCOMMITTED` block naming the delta, exit
         **0**. Not fatal: the row is HEAD's and off by a known amount, both
         numbers print, and every wake edits `ROADMAP.md`. A report that exits 1
         on an ordinary dirty tree is one that gets `|| true`'d. This path was
         exercised for real by this wake's own edits rather than by an
         injection.

       `LOOPS.md`'s Standardize step 1 gains one bullet, so the sweep that
       already runs three rot-guard reports runs a fourth. **The cost is named
       and measured, not estimated: that bullet is +73 words to the file this
       item is about** (`report_loop_prose.py`'s own UNCOMMITTED line reported
       it). It is the same trade `scan:dead-style` and `report:css-repeats`
       already made — deliberately not a gate, because every current number is
       correct and a gate would fail the build on five right answers; the
       finding is the delta.

       **Noticed in passing, and it is a trap for anyone re-running this.** A
       bare `wc -w` in this container **undercounts these files by 2.4-4.5%**,
       silently. No locale is set, and GNU wc in the C locale swallows an em
       dash: `printf 'alpha — beta\n' | wc -w` prints **2**, not 3 — red-proved
       on that 12-byte probe before being believed. `LC_ALL=C.UTF-8 wc -w` and
       Python's `str.split()` agree with each other exactly on all five files
       (9,910 · 4,759 · 3,609 · 12,150 · 1,677); the bare `wc` reports 9,660 ·
       4,675 · 3,537 · 11,603 · 1,632. This repo's prose is em-dash-heavy, so
       any ad-hoc word count taken here is low unless the locale is pinned. The
       script counts in Python for this reason; `report:prose` is Node and
       unaffected.

       **What would reopen this:** `LOOPS.md` still 0-down after 167.2 lands —
       that is the file where the premise holds and the growth is real, so an
       archive sweep that does not shrink it means the sweep did not work.
       Or `RESUME.md`/`ROADMAP.md` going 0-down over a window, which would move
       them out of `instrument` and into the cadence for real.

2. [x] **167.2 — DONE 2026-08-28. Rule 3: 1,171 → 525 words; `LOOPS-archive.md` created.**

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

       **Command re-run first: it disagreed, and the disagreement sharpens the
       item.** Pinned `1,026 / 181 rule / 845 history / 9,706 file`; measured
       **1,171 / 181 / 990 / 9,983**. The rule half is *unchanged at 181* while
       the history grew 145 words in one wake — so it is **85% archaeology**,
       not 82%, and the ratio worsens on its own every recurrence.

       **Moved: 8 paragraphs, 717 words**, into a new `LOOPS-archive.md` —
       the five incident narratives, the replay figures and the snapshot
       counts. Rule 3 is now **525 words**, LOOPS.md 9,983 → 9,337.

       **What deliberately did NOT move**, because the item's own
       counter-evidence is right that a pointer is read less than a paragraph:
       the rule, why it sits above rule 4, why three and not one, which loops
       close a slice, and — most importantly — the **standing lesson** ("this
       counter is only ever caught by a number disagreeing with something a
       human just wrote down") together with the sentence recording that the
       lesson was tested and held. All seven checked present after the move.

       **Two gates had to learn about the new file, and the second is the
       point.** `check:vendor-names` gains it as a root, because a gate blind
       to the archive guards the wrong half of the repo — the same argument
       160.1 used to refuse scoping ROOTS away from history. And
       `report_loop_prose.py`, 167.1's own instrument, gains it because
       otherwise this move would have read as **LOOPS.md losing 717 words** —
       a shrink that never happened. An instrument that can be improved by
       moving text outside its own scope measures filing, not size.

       **Its reconciliation caught exactly that**, unprompted: the first run
       after the split printed *"RECONCILIATION FAILED — LOOPS-archive.md: not
       tracked at HEAD — a zero here would look like a real count"* and refused
       to report numbers. 167.3's reconciliation work, paying off one item
       later.

3. [x] **167.3 — DONE 2026-08-28, found in passing. `STATUS.md`'s history half
       had no reconciliation, and a cloud wake silently deleted nine committed
       rows with it.**

       Not filed then fixed — found while committing 167.1, and fixed because
       the fix is smaller than the explaining. `record_iteration.py` regenerates
       `STATUS.md`, and the diff it produced replaced **ten** iteration rows with
       **one**:

       ```
       python3 -c "import sqlite3; print(sqlite3.connect('.roundtable/loops.db').execute('select count(*) from iterations').fetchone()[0])"
       grep -cE '^- 2026' .roundtable/loop-log.md
         # mirror 2 · log 1,020        (before the fix, on a fresh container)
       ```

       **`loops.db` is git-ignored — correctly, it is derived — so a FRESH CLONE
       HAS NO MIRROR AT ALL.** The container clones, `record_iteration.py`
       creates the db and inserts its own row, and `last_iterations(10)` then
       renders "Last 10 iterations" from a table holding one. `STATUS.md` is
       **tracked**, so that commit would have deleted nine rows of history from a
       reviewed file and reported nothing. It is not a regression from this
       wake's change; it is latent in every cloud wake and was survived so far
       only by mirrors that happened to be warm.

       **The rule was already written and only half-applied.** CLAUDE.md's
       storage doctrine — *"a derived artefact may not decide, on its own, what
       it failed to see … Assert the count, not just the content"* — was written
       FOR this generator, after `STATUS.md` listed 7 of 9 open items for weeks.
       The open-items half has carried `ANY_OPEN` since 2026-08-25. The
       iterations half, in the same function's file, had nothing. Same failure,
       same file, same doctrine, one half guarded.

       **Self-healing, not fatal, and the reason is measured:** a hard exit here
       fires *after* `record_iteration.py` has appended to the log, leaving the
       two records further apart than it found them. The mirror is rebuildable by
       definition, so the generator now counts the raw rows in `loop-log.md`,
       announces any disagreement, rebuilds from the log, and re-checks — and a
       disagreement that **survives** the rebuild is a parser bug and does exit 1.

       **Four branches, each red-proved end to end**, injections confirmed
       independently of the message:
       - warm mirror → silent, 10 rows;
       - `rm .roundtable/loops.db` — the exact cloud condition → announces
         `0 … 1,020`, rebuilds, 10 rows;
       - `DELETE FROM iterations WHERE id > 3` → announces `3 … 1,020`,
         rebuilds, 10 rows. The near-miss a mere `exists()` check would miss;
       - a shortfall that survives a rebuild (probe copy in the same directory,
         `log_row_count` + 1 — not `git stash`) → exit **1**, naming
         `parse_log_line`.

       **No gate.** These scripts are not in CI at all, which
       `rebuild_from_log.py`'s own header already records as the reason its
       assertions live in the path that writes. The same argument applies here:
       the check belongs in the writer, and adding a CI gate for a script CI
       never runs is the ceremony 94.11 refuses.

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

2. [x] **164.2 — DECIDED 2026-08-28: the row keeps its naive local stamp; the clock is recovered by `git blame`, not by the sha.**
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

       **DECISION (2026-08-28, cloud wake): accept the naive local stamp. The
       decision is recorded in `LOOPS.md` Step 0c, next to 162.1.** Four
       measurements decided it, each with its command; all are snapshots at
       1014 rows — re-run, do not quote. Full script for the last two:
       `.roundtable/probe-164.2-clocks.py` is NOT kept; the code is inline
       below because it runs in seconds.

       **(1) The premise re-checked, and it holds.** 3 inversions, unchanged
       across the 18 rows added since the item was filed at 996.

       ```
       python3 - <<'PY'
       import re
       R=re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ")
       t=[R.match(l).group(1) for l in open('.roundtable/loop-log.md') if R.match(l)]
       print(len(t),"rows ·",sum(1 for a,b in zip(t,t[1:]) if b<a),"inversions")
       PY
       # 1014 rows · 3 inversions        (2026-08-28)
       ```

       **(2) The ordering an offset would add is already present, and already
       correct.** Resolve each naive stamp through the author-tz of the commit
       that INTRODUCED that line (`git blame --line-porcelain`), and the file's
       own line order is chronological at **1014 of 1014** — zero true-UTC
       inversions, worst violation 0 minutes. So "line order is correct; the
       timestamps are what lie" is now measured rather than asserted, and the
       thing the offset buys is display disambiguation for a single row read in
       isolation, not order.

       ```
       python3 - <<'PY'
       import re,subprocess,datetime
       out=subprocess.check_output(['git','blame','--line-porcelain','--',
                                    '.roundtable/loop-log.md'],text=True)
       rows=[];cur={}
       for l in out.split('\n'):
           if re.match(r'^[0-9a-f]{40} ',l): cur={}
           elif l.startswith('author-tz '): cur['tz']=l.split()[1]
           elif l.startswith('\t'):
               if l[1:].startswith('- '): cur['text']=l[1:]; rows.append(cur)
               cur={}
       R=re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ")
       inst=[]
       for r in rows:
           tz=r['tz']; s=1 if tz[0]=='+' else -1
           off=s*datetime.timedelta(hours=int(tz[1:3]),minutes=int(tz[3:5]))
           n=datetime.datetime.strptime(R.match(r['text']).group(1),"%Y-%m-%d %H:%M")
           inst.append((n-off,n))
       print(len(inst),"rows ·",sum(1 for a,b in zip(inst,inst[1:]) if b[0]<a[0]),
             "true-UTC inversions ·",
             sum(1 for a,b in zip(inst,inst[1:]) if b[1]<a[1]),"naive")
       PY
       # 1014 rows · 0 true-UTC inversions · 3 naive        (2026-08-28)
       ```

       That zero is red-proved, because a plain zero is a defect until shown
       otherwise: appending one deliberately backwards row
       (`- 2026-08-20 01:00 · … · deadbee`) takes it to **1015 rows · 1
       true-UTC inversion · 4 naive**, and the injection is confirmed to have
       landed — blame resolves the uncommitted line at the container's own
       `+0000` and it is the last row the detector sees.

       **(3) 162.1's "already recorded exactly, one indirection away" is wrong
       at the margin, and wrong in the place that matters.** The same script,
       comparing the row's own sha against blame: they **agree on 1004 rows and
       disagree on none**, but the sha is *unrecoverable* on **10 of 1014** —
       the five 2026-08-13 rows carrying a literal `-`, and **five whose sha no
       longer exists in this history** (`c1d9e10`, `f014635`, `bce2cef2`,
       `ea4c72b`; line 998's row cites `f014635` while blame gives `e6bf5538`,
       the surviving commit for the same work). They were rebased away — which
       is what the LOSING dispatcher does after a collision, i.e. the exact
       scenario the attribution is for. `LOOPS.md` had counted rows that *carry*
       a sha (1009), never rows whose sha *resolves* (1004). Blame is exact at
       1014/1014 and survives a rebase, because rebase preserves the author date
       and its offset. Corrected in place; the section now names blame.

       **(4) The `%z` option is not free, measured by injection rather than by
       reading the parsers.** Appending one row spelled
       `- 2026-08-28 14:00 +0000 · Continue · build · … · landed · deadbee` to
       the log and running all four consumers: `_common.parse_log_line`,
       `rebuild_from_log.py` and `generate_status.py` accept it, and
       **`dispatch_status.py` — the one whose output chooses this wake's loop —
       exits 1**, because its `ROW` regex requires ` · ` immediately after
       `HH:MM`. 164.1's reconciliation caught it loudly, which is the guard
       working, and is also the cost: the format change is a coordinated parser
       edit plus a permanently mixed column, bought for an ordering measurement
       (2) says the file already has. **Refused.** Backfilling the 1014 existing
       rows is exact via blame and also **refused**: `record_iteration.py`'s own
       standing rule is that historical rows record what was believed when
       written.

       **Fixed in passing, because it was smaller than explaining it**
       (`LOOPS.md`'s every-wake improvement rule): `generate_status.py` wrote
       `STATUS.md`'s `Generated at:` from the same naive `now()`, and this is
       the one such site that is **not** latent. Regenerating on this cloud wake
       moved it **backwards, 13:15 → 05:31** — a derived mirror reporting itself
       eight hours staler than the rebuild that had just written it, which is
       the freshness signal a reader actually uses. It now stamps `… UTC`
       explicitly. Nothing parses the line: `--check` strips it before
       comparing, and `check:repo` stayed green.

       **No gate.** The defect is a human misreading one row's hour; the only
       checkable property — "the stamp carries an offset" — is the thing this
       item just refused, so a gate would enforce the rejected option. Stated
       rather than wrapped in ceremony, per 94.11.

       **Cloud wake: nothing visual was looked at.** The diff is markdown plus
       two Python comment blocks and one `strftime` in a script that writes a
       markdown file; no page markup changed.

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

