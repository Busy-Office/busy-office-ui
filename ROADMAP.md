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

## Slice 177 — the archive sweep is due a FOURTH time, and the regrowth rate is rising (2026-08-28)

**Not new input** — nothing was filed and nobody asked; GitHub intake is 0 open
issues and there is no open P0. Noticed the way rule 4 says it will be noticed:
this wake executed rule 4 by reading `ROADMAP.md` top-to-bottom, and the rule's
own text says *"if this rule is walking thousands of lines again, that is the
signal"*. It walked **3,750**.

Slice 165 is the direct precedent — same signal, same wake-noticed origin, same
"not new input" framing — and its sweep landed **twelve hours ago**.

**Scope, measured. The instrument is 165.1's, with the defect 165.1 found already
fixed**: attribute body lines to the nearest preceding H2 **of any kind**, not to
the nearest `## Slice`, or the four non-slice sections are charged to whichever
slice precedes them (that is how 165.1 first read Slice 29 as 78 lines when it is
a correct 3-line pointer).

```
python3 - <<'PY'
import re
H=re.compile(r"^## (.*)$"); S=re.compile(r"^## Slice (\d+)\b")
def sections(p):
    cur=None; d={}
    for l in open(p):
        m=H.match(l)
        if m:
            s=S.match(l); cur=int(s.group(1)) if s else None
            if cur is not None: d.setdefault(cur,0)
        elif cur is not None: d[cur]+=1
    return d
live=sections('ROADMAP.md'); arch=sections('ROADMAP-archive.md')
OPEN=set(); cur=None                   # DERIVED, never hardcoded — 165's own bug
for l in open('ROADMAP.md'):
    m=H.match(l)
    if m:
        s=S.match(l); cur=int(s.group(1)) if s else None
    elif cur is not None and re.match(r'^\s*\d+\. \[ \]', l): OPEN.add(cur)
print("OPEN:",sorted(OPEN))
big={s:n for s,n in live.items() if s not in OPEN and n>6}
print(len(big),"closed slices carrying",sum(big.values()),"lines here;",
      sum(1 for s in big if s in arch),"already in the archive")
PY
  # OPEN: [15, 112, 173, 175, 176]
  # 9 closed slices · 1,943 lines · 0 already archived   (2026-08-28, at 3,750 lines)
```

The nine: **164, 165, 167, 168, 169, 170, 171, 172, 174**. The four non-slice H2
sections (`## Objective`, `## CI strategy`, `## Sequence`, `## STATE`) are out of
scope for the same reason 165.1 gave.

**The finding is not the sweep — it is that the sweep is a treadmill that is
speeding up.** Found by measuring the line count at every one of the 722 commits
that has touched `ROADMAP.md` and taking the drops, rather than by grepping
subject lines. That matters: a subject-line grep for `archive sweep` finds only
**two** of the three real sweeps — the 2026-08-25 one is titled *"tidy: sweep 44
closed slices…"* — which is the position-filter shape CLAUDE.md warns about, a
confident absence.

```
# sweeps found by the DROP, not by the subject line (drop > 300 lines)
16ef2bb8  12,516 ->  5,562   08-22  110.4: archive 83 closed slices
063211cc   9,824 ->  1,094   08-25  tidy: sweep 44 closed slices
187ab92d   4,461 ->  1,508   08-28  archive sweep — 20 closed slices
c5d21fb4  12,302 -> 11,983   08-22  109.7: grill the RF pattern family   <- FALSE POSITIVE
```

**The detector's fourth hit is not a sweep**, and it is recorded rather than
quietly dropped: a 319-line net reduction inside a grill commit clears a
`>300` threshold. 3 of 4 hits are real; the threshold is a heuristic and is
labelled as one.

Regrowth between consecutive real sweeps, measured per **ROADMAP-touching
commit** rather than per hour — the log's stamps are naive local time and 164.2
recorded that 3 of 1,013 adjacent pairs read backwards, so wall-clock would be
the weaker instrument here:

| cycle starts | lines | → | over N commits | rate |
|---|---|---|---|---|
| after `16ef2bb8` | 5,562 | 9,824 | 140 | **+30.4 / commit** |
| after `063211cc` | 1,094 | 4,461 | 66 | **+51.0 / commit** |
| after `187ab92d` | 1,508 | 3,750 | 33 *(open)* | **+67.9 / commit** |

Cycle length in commits is **halving** (140 → 66 → 33) while the per-commit rate
is **rising** (+30 → +51 → +68). Both readings agree, which is what makes this
worth a line: the sweep is not converging on a steady state, and CLAUDE.md's
"recurring sweep" wording describes it accurately but understates the trend.

**What is generating it, measured, and deliberately NOT acted on.** Of the 1,943
lines this sweep moves, **1,192 (61%) are the five Objective-grill slices**
(164, 167, 168, 170, 172) — each of which ALSO has a full report in
`.roundtable/`. Whether a grill's roadmap slice should be a summary pointing at
its report, rather than a second copy of it, is a **direction call about how the
loop records its own work**, and this loop does not take those. Recorded here as
an observation with its number so a later wake or the owner can decide it; no
item is opened for it.

1. [x] **177.1 — DONE 2026-08-28 (cloud wake). 9 slices moved; 3,872 → 1,956
       lines. Sweep the nine closed slices to `ROADMAP-archive.md`.**
       Hand-checked move, one slice at a time — **not a script**. CLAUDE.md's
       bulk-edit rule applies with force on this exact pair of files: the
       case-collision that once destroyed 7,307 lines of archived history was on
       `ROADMAP-archive.md`, and the only tell was `git status` showing it as
       *modified* rather than *added*.

       *Accept* — each is a property to verify, never a number to predict:
       - Every one of the nine closed slices has its full text in
         `ROADMAP-archive.md` and a pointer of the established shape
         (`Closed — archived verbatim in \`ROADMAP-archive.md\`.`) left in
         `ROADMAP.md`, with its heading unchanged.
       - No slice carrying an open `N. [ ]` checkbox is moved, and no non-slice
         H2 section is touched. Re-derive the OPEN set from the checkboxes; do
         not read it off the table above.
       - `check:slice-refs` passes, and its citation count is reconciled against
         the source rather than against the mover — it read **354 citations /
         198 cited / 158 slice numbers** before the move.
       - Conservation reconciles: the archive's growth equals the live file's
         loss plus the pointer stubs the move inserted, and the residual is
         accounted for exactly rather than waved at.
       - `git status` shows `ROADMAP-archive.md` as **M**, never as a new file.
       - `STATUS.md`, regenerated, still finds the same number of open items as
         a raw `grep -c` of the `N. [ ]` checkboxes in the source.
       - The before and after line counts of both files are recorded.

       **Moved, in the order they held in the live file**: 172, 174, 171, 170,
       169, 168, 167, 165, 164. The move itself was mechanical; the CHECKING was
       structural, which is what 165.1 actually did too ("verified structurally
       rather than by eye"). Stated plainly rather than implying it was
       hand-retyped.

       **Refusal guards ran BEFORE the move, not after** — the OPEN set
       re-derived from the `N. [ ]` checkboxes (`[15, 112, 173, 175, 176, 177]`,
       and it asserts the target set is disjoint from it), plus a per-target
       assertion that the section is not already a pointer and is longer than
       six lines. The second guard turned out to matter — see the archive
       defect below.

       Every Accept property verified:

       ```
       byte-identical in archive .............. 9 of 9
       pointers correct, headings unchanged ... 9 of 9
       moved ∩ open ........................... [] (empty)
       non-slice H2 sections still present .... 4 of 4
       git status ............................. M / M, never A
       pre-existing archive preserved ......... new file starts with old, exactly
       check:slice-refs ....................... passes
       ```

       **Conservation reconciles exactly, on both sides:**

       ```
       ROADMAP.md       3,872 -> 1,956   (-1,916)
       ROADMAP-archive 19,285 -> 21,237  (+1,952)
       # 1,956 is the count AT MOVE TIME. `wc -l ROADMAP.md` reads higher now,
       # because writing this result block back into the file is itself growth
       # — which is the trend this slice is about, arriving on cue.

       live:    1,943 body lines moved - 27 pointer stubs (9 x 3) = 1,916  ✓
       archive: 1,943 body lines + 9 headings                     = 1,952  ✓
       ```

       `check:slice-refs` moved **354 -> 355 citations** and **158 -> 159 slice
       numbers**, and that is reconciled rather than accepted: both +1s are
       Slice 177's own heading and its one citation of 165. Cited count held at
       198 and the known-dangling baseline held at 2.

       **A defect in the ARCHIVE was found by this item's verification, and is
       NOT fixed here.** Three slices appear twice in `ROADMAP-archive.md` —
       **17, 23 and 24** — and the second copy of each is a **3-line pointer
       stub**: an earlier sweep archived a slice that was *already* a pointer,
       so the archive now contains a stub pointing at itself, nine lines from
       the top of the same file.

       ```
       Slice 17: copies 2, lines 98 vs 3, identical=False
       Slice 23: copies 2, lines 520 vs 3, identical=False
       Slice 24: copies 2, lines 183 vs 3, identical=False
       ```

       **No history was lost** — the full text of all three is present; the
       duplicate is the stub, not the content. It is pre-existing: the archive
       held **144** slice numbers with these same three duplicated *before* this
       wake touched it, and **153** after, which is +9 and exactly this sweep's
       nine. This sweep's guard makes it structurally impossible for it to have
       added one.

       **Left alone deliberately, on the archive's own authority.** Its header
       reads *"Nothing here is edited — corrections to history go in new slices,
       never here."* Deleting nine lines from it would be small, and it is still
       an edit to the archive, which is the one operation that has already
       destroyed 7,307 lines of this exact file. Changing that charter is a
       direction call, so this is recorded with its measurement and no item is
       opened. What it costs today: any counter that reads slice numbers out of
       the archive over-reports by 3. `check:slice-refs` is not that counter —
       it asserts "each heading one section" against the LIVE file and passes.

## Slice 176 — Polish round 2 on `component/scan`: the score that was taken and never written down (2026-08-28)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 `Standardize 2 / 4 ok`, rule 3 `Objective 1 / 3 ok
[173]`. **Rule 4 found no dispatchable item**: all five `N. [ ]` checkboxes are
owner- or hardware-blocked (112.3 owner briefs, 112.4 on 112.3's verdict, 173.2
*owner to pick* between two candidates, 175.4 OWNER CALL, Slice 15's AT runtime
evidence NEEDS-RUNTIME). Rule 5 found no metric with two consecutive readings
and no budget breach (`rf-essentials` 36.4 kB against its 40 kB gate). **Rule 6
fired** — `polish_requeue.py --apply` marked ten surfaces re-queued, and the
ledger's own re-entry section named a scan re-score as pending.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** One rendered change ships in this slice — `/components/scan`'s
"Design-system alignment" section stops saying *"Not yet scored"* and starts
rendering the six-row table every other component page already renders, from the
same `DsaScore.astro` component with no markup or CSS change. `git diff --stat`
names no file under `packages/core/src` and no `.css` anywhere. **That section's
appearance at 390px was NOT looked at**; it is the same component and the same
table markup as the 39 pages that already carry it, which is an argument, not a
verification.

1. [x] **176.1 — DONE. `/components/scan` published "Not yet scored" for five
       days after it was scored.** Polish re-entry scored `scan` on 2026-08-23
       (`bfe9798`), found `colour`/`interaction`/`fit` all at 2, and fixed all
       three in that same round. The result was written into
       `.roundtable/polish-state.md` prose **and nowhere else** —
       `dsa-scores.json`, which its own `$comment` calls the SOURCE OF TRUTH for
       what renders, never received a `scan` entry, and `DsaScore.astro`
       correctly renders *"Not yet scored — alignment scoring is proceeding in
       batches"* for a missing one.

       ```
       node -e "console.log('scan' in require('./apps/docs/src/data/dsa-scores.json').components)"
       # false  (before this slice)
       npm run check:dsa-scores -w docs
       # "39 scored components (40 requested by a page)"   <- printed, unasserted
       ```

       **The gate computed the discrepancy and reported it as prose.** Its
       assertion 5 checks that every scored entry is rendered by some page; the
       mirror — every page-requested component has an entry — was never written,
       and its own header explains why it was thought unnecessary
       (`check-page-shape` enforces that CSS-backed components carry
       `<DsaScore>`, which is a different claim). This is CLAUDE.md's rule
       exactly: *a derived artefact may not decide, on its own, what it failed to
       see. Assert the count, not just the content.*

       *Accept*: (a) `check:dsa-scores` names, per component, any page that
       renders a score with no entry behind it, and its report line states
       whether the two counts agree rather than printing both and leaving the
       reader to subtract; (b) the assertion has been watched failing, with the
       injection confirmed to have landed before the red result was believed;
       (c) `scan` carries an entry whose six citations were each re-verified
       against the shipped artifact this wake, and the entry states what kind of
       score it is rather than implying it is the blind one the ledger asked
       for; (d) the full cloud gate set is green.

       **Met.** (a) assertion 7, per name, 40 checks; the report line now ends
       `all scored` or names the offenders. (b) red-proved **twice** — first by
       the real defect, before the entry existed
       (`FAIL scan: … dsa-scores.json has no "scan" entry`), then by deleting an
       *unrelated* entry and confirming the gate names that one instead
       (`FAIL kv: …`), with `'kv' in components` asserted `false` before the run
       and `true` after restore, and `git diff --stat` confirming the restore
       was byte-exact. The second proof matters because the first could have
       been satisfied by a check hard-coded to `scan`. (c) recorded — no
       `font-size` and no raw colour in `scan.css`; the 6px-solid vs 18px-double
       verdict geometry asserted by `check:claims` in normal rendering *and*
       under CDP forced-colors emulation; the platform-vs-behavior table on the
       page; `data-scan-flash` adopted at `examples/po-app/server.mjs:1095`. The
       entry's `$comment` says outright that this is a **cited re-score, not a
       blind one**, so it is not counted as §3b's independent second opinion —
       the blind re-score is still owed and now has a baseline. (d) below.

2. [x] **176.2 — DONE 2026-08-28 (next wake), closed under Accept arm (c),
       verdict BENIGN. Raised as: "`polish_requeue.py` and `LOOPS.md` §3b's
       queue definition contradict each other, and rule 6 dispatches on the
       loser."** The contradiction is real; the second half is wrong — rule 6
       dispatches on neither, and the measurement is below. Raised while
       executing rule 6, recorded rather than resolved: both sides are
       deliberate, measured decisions three days apart, and neither names the
       other.

       - **2026-08-25** added `polish_requeue.py` precisely so a surface whose
         source moved re-enters the queue — the ledger had said so since it was
         written and nothing executed it, so `component/sidebar-nav` sat at 1/3
         rounds while its page changed twice in a day.
       - **2026-08-28 (171.1)** narrowed the component queue to
         `check:wrong-choice`'s TODO set **and only that**, because no DSA
         dimension can rank.

       Together they misfire. `--apply` re-queued **10** surfaces this wake;
       every one scores `content: 3` and is off the TODO, so the Polish round
       they trigger has no scored weakness to fix. Re-measured this wake over
       40 components: `typography`/`colour`/`spacing` have **1** distinct value
       each, `interaction` **2** (3 or `na`), `content` **2** and `fit` **2** —
       and in both of the latter the single non-3 is `date`, which the ledger
       SKIPS as deprecated. The commands are in `.roundtable/polish-state.md`.

       Resolving it either way changes what the dispatcher does on a
       clear-backlog wake — honouring the TODO makes rule 6 effectively
       unreachable and hands every such wake to Research (rule 7), which is what
       the ledger's own header used to promise; keeping the re-queue needs an
       instrument that can rank a re-entered surface, and 171.1 measured that
       none of the six exists. Both are direction, and direction has been the
       owner's in every slice so far.

       *Accept*: a recorded decision that either (a) makes `polish_requeue.py`'s
       output agree with §3b's queue definition, or (b) restores a rankable
       instrument for a re-entered surface, or (c) keeps both and states in
       `LOOPS.md` what a Polish round on a `content: 3` surface is supposed to
       do — **in each case naming the consequence for how often rule 6 fires,
       measured against the log rather than predicted.** Finding that the
       contradiction is benign is a satisfying outcome and closes this item.

       ### Met, arm (c), verdict BENIGN — and the premise was half wrong

       **Re-checking the premise was part of the criterion, and it paid.** This
       item was raised as *"rule 6 dispatches on the loser"*. Rule 6 dispatches
       on neither. Its literal text is a THIRD queue definition, wider than both
       sides, and it is the only one the dispatcher actually evaluates:

       > 6. **Any scored surface below its round budget and not marked dry?**

       Neither `polish_requeue.py`'s source-change rule nor §3b's TODO
       set appears in that predicate. `--apply` writes a `RE-QUEUED` marker into
       the ledger's `status` column; it moves neither the `rounds` column nor the
       `dry` column, which are the only two things rule 6 reads. §3b's TODO
       narrows which surface a round **picks** (step 1), not whether rule 6
       **fires**.

       **1. Rule 6's predicate has never been false, for any row, in any
       revision of the ledger.** Parsed every revision of
       `.roundtable/polish-state.md`, not the current one:

       ```
       git log --format='%H %ad' --date=short -- .roundtable/polish-state.md   # 11 revisions
       # per revision, parse the table and count rounds n/m and the dry column:
       #   11 of 11 revisions:  budget_spent = 0   marked_dry = 0
       #   below_budget = 19 (first three revisions, before `date` was SKIPPED)
       #                  18 (2026-08-23 → 2026-08-25)
       #                  19 (2026-08-28, scan added)
       ```

       So the predicate is true of **19 of 19** non-skipped surfaces today and
       has been true of every non-skipped surface since the ledger's first
       commit. A 100% base rate is a defect until proven otherwise — and here it
       is *proven otherwise*, structurally rather than as an instrument bug:
       budgets are ceilings, the dry exit needs **two consecutive** rounds that
       fail to move a blind re-score, and every seeded surface landed its clause
       in **one** round and passed. Nothing ever got a second round, so nothing
       could ever accumulate a first dry one.

       **2. The one Polish round that rule 6 has actually dispatched was
       authorised by neither side of the contradiction.** 176.1 ran on
       `component/scan`, and scan is in neither queue:

       ```
       python3 scripts/loops/polish_requeue.py --check | grep -c '^  component/'   # 10
       python3 scripts/loops/polish_requeue.py --check | grep -c 'component/scan'  #  0
       npm run check:wrong-choice -w docs
       #   "components: 37 carry / 1 outstanding / 3 exempt"
       grep -A3 'const TODO = new Set' apps/docs/scripts/check-wrong-choice.mjs
       #   TODO = { 'date' }   — and the ledger SKIPS date as deprecated
       ```

       Scan is not re-queued (no `RE-QUEUED` marker, and absent from `--check`'s
       ten) and it carries a wrong-choice clause, so it is off the TODO. It
       qualified on `2/3 rounds, dry 0` — rule 6's own text — and nothing else.

       **3. Consequence for how often rule 6 fires, measured against the log.**
       **Zero**, under either resolution. Neither side of the contradiction is
       an input to the predicate rule 6 evaluates, so changing either changes the
       firing rate by construction, not by estimate. What the log shows about the
       rate itself:

       ```
       grep -c '^- ' .roundtable/loop-log.md          # 1065 iteration rows
       grep -c ' · Polish · ' .roundtable/loop-log.md #   10  (0.94%)
       ```

       Ten rows over five wake-dates: six on 2026-08-23 (the seeded queue,
       drawn from `check:wrong-choice`'s TODO), three on 2026-08-26 (ERP-suite
       *screen* scores — a different instrument, and not in this ledger's table
       at all, which is 20 `component/` rows and no `pattern/` row), one on
       2026-08-28 (176.1). Under arm (a), honouring the TODO strictly, **2 of
       those 10 would not have been dispatched** — both `scan`, the 2026-08-23
       re-entry and 176.1 — because scan is off the TODO. One of the two is the
       round that found `/components/scan` publishing "Not yet scored" for five
       days. The rate is governed by **rule 4 emptying**, which ROADMAP records
       happening exactly once (Slice 176's own header). *(The three `rule 6`
       citations in `ROADMAP-archive.md` at Slices 66/67/68 are **not** Polish
       dispatches — they are 2026-08-20, before the Polish loop existed, when
       rule 6 was the Explore-on-empty-backlog rule. The numbering moved.)*

       **4. Arm (a)'s stated consequence — "hands every such wake to Research
       (rule 7)" — describes a lane that has never been dispatched.**

       ```
       grep -c ' · Research · ' .roundtable/loop-log.md    # 0, of 1067
       ls .roundtable/research-*.md | wc -l                # 6
       ```

       Six research reports exist and `--loop Research` has never been used, so
       the work has happened and no row carries this loop's name. Three rows
       narrate research under `Roadmap`, `Objective` and `Explore`
       (`grep -i research .roundtable/loop-log.md`). **The tempting next claim —
       "each of the six was recorded under some other loop" — is NOT made, and
       the instrument that would have made it was tried and refused**: grepping
       each report's topic out of its own filename finds rows for **2 of 6**
       (`app-frame`, `pattern-references`; `dense-numeric-ui`,
       `erp-mobile-web-gaps`, `numeric-masking` and `pattern-tile-previews` all
       read 0). That is a needle that misses rows naming a slice instead of a
       topic, not evidence that four reports went unrecorded — and a 0 on four
       of six inputs is the shape this repo's own doctrine says to distrust. So
       the alternative arm (a) was weighed against is not a lane the log can
       show working; how its work WAS recorded is left unmeasured.

       **What a Polish round on a `content: 3` surface is supposed to do** —
       arm (c)'s question, answered in `LOOPS.md` §3b this wake. Short form: it
       has no scored weakness to fix, because 171.1 measured that no DSA
       dimension can rank one. What it *can* do is reconcile the surface's
       **published artefact** against the ledger's own record of it — which is
       what 176.1 did, and what found the five-day defect no scored dimension
       could see. Stated as **n = 1**, because that is the entire evidence base.
       If the reconciliation finds nothing, the round is a genuine no-op and is
       recorded as one; it does not manufacture a fix.

       **Not resolved here, and deliberately: the contradiction is benign, but
       §3b's Exit is not.** See 176.3.

3. [ ] **176.3 — OWNER CALL. §3b's Exit condition has never been satisfiable,
       so rule 7 is unreachable and rule 8 cannot be reached either.** Found by
       176.2's measurement and split out rather than decided, because it changes
       what the dispatcher does.

       §3b's Exit reads *"every surface dry or budget-spent → hands to Research
       (rule 7)"*. 176.2 measured that across **11 of 11** revisions of
       `.roundtable/polish-state.md`, `budget_spent = 0` and `marked_dry = 0`
       — every row, every revision. Both halves of that disjunction have always
       been false, so Polish has no exit, and the log agrees: **0 Research rows
       in 1065**. Rule 8's halt sits below rule 7 and is equally unreachable.

       This is not a broken instrument. It is the ceiling/dry design working as
       specified: a surface that lands its fix in one round never gets a second,
       so it can never accumulate the two consecutive non-moving rounds the dry
       exit requires. The exit was written for a queue whose surfaces need
       several rounds; the seeded queue did not behave that way.

       Weighed and NOT taken, because each is a direction call:
       - Make a single-round pass that lands its fix also mark the surface
         budget-spent — closes the exit, but redefines "ceiling" as "quota",
         which §3b's own header refuses in bold.
       - Let rule 6 fall through when §3b's TODO is empty — the smallest change,
         and it is what the ledger's header used to promise, but it makes rule 6
         effectively dead and every clear-backlog wake a Research wake, which
         finding 4 above shows is a lane with no track record.
       - Leave it. Costs nothing while rule 4 keeps matching; the price is paid
         only on a clear-backlog wake, of which there has been one.

       *Accept*: a recorded owner decision naming which of the three (or a
       fourth) is taken, **with the consequence measured against the ledger and
       the log rather than predicted** — specifically, how many of the 19 rows
       the choice would move out of rule 6's predicate, and how many recorded
       wakes would have dispatched differently. "Leave it" is a satisfying
       outcome and closes this item.

## Slice 175 — Objective grill of Slices 169, 170, 172 (2026-08-28)

Dispatcher rule 3 at 3/3 `[169, 170, 172]`; rule 1 found no open P0 and GitHub
intake is empty (0 open issues, asked via the API), rule 2 read
`Standardize 3 / 4 ok`. Full report:
`.roundtable/grill-objective-169-170-172-2026-08-28.md`. `.roundtable/INDEX.md`
checked first: the immediately preceding grill names 169 and 170, and this is not
a repeated subject — it covered 169.1-169.3 and 170.2's *proposal*, while 169.4
and 170.2's verdict both landed after it (169.4 at 12:26Z against that grill's
11:45Z).

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders — two gate scripts in
`apps/docs/scripts`, the grill file, this entry, one renumbered heading,
`LOOPS.md` and `.roundtable/RESUME.md`. `git diff --stat` names no file under
`packages/core/src` or `apps/docs/src`, which is a stronger statement than a
screenshot. `check:layout` and `test:axe` swept every page at both widths anyway
and were green. **No visual debt was added; nothing visual was looked at.**

Window shape: 10 rows · landed 4 · refused 5 · triaged 1; loops Meta 4 /
Continue 4 / Standardize 1 / Roadmap ×1. Reconciled before quoting: 1,047 raw
bullets, 1,047 parsed by `dispatch_status.rows()`, 1,047 by the independent
outcome parser — whose first draft was wrong on 356 rows anyway (report §D).

**THIS GRILL COLLIDED WITH A SECOND ONE, AND BOTH ARE KEPT.** `LOOPS.md` Step 0c
exercised for real, second recorded time. A local wake was live throughout —
`5f21113` landed at 13:32Z, five minutes before Step 0, with no iteration row —
and by the pre-commit re-fetch Step 0c mandates, `origin/main` had moved four
commits including **its own Objective grill of the same 169/170/172 window**
(`0131ebc5`, recorded 13:36Z). Nothing here duplicates it: its findings are the
green-red-proof rule, the self-declared `@exact` exemption, and what went right;
none of the three below appears in it, checked by reading it rather than by
title. Rebased rather than discarded, and **every figure re-verified on the
rebased tree** — the other wake changed `dispatch_status.py` and
`check-ci-ignores.mjs` between the measurement and the commit. The §A red-proof
still reproduces 3 → 4; `sorted({` is still line 247. What moved: the log is
1,052 rows, refusal 208 of 590 (35.25%), and `dispatch_status.py` now reads
`Objective 1 / 3 [170]` because the other grill discharged the counter mid-wake.
The window figures above are the state this grill examined, tip named, not
silently refreshed.

1. [x] **175.1 — DONE 2026-08-28. `## Slice 172` headed two different slices,
       and it is the first such collision in 710 revisions of `ROADMAP.md`.**

       `## Slice 172 — Objective grill of Slices 168, 169, 170` (`c88a3217`,
       11:44Z) and `## Slice 172 — Owner: /patterns/command-bar` (`be5beb9a`,
       13:02Z). So `172.1` named both *"check-resume-charter retagged
       @heuristic"* and *"the copyable CSS shipped `overflow: hidden`"*, with one
       loop-log row for each, both spelled `172.1`.

       ```
       python3 - <<'PY'
       import re, collections
       seq=[m.group(1) for l in open('ROADMAP.md') if (m:=re.match(r'^## Slice (\d+)\b', l))]
       c=collections.Counter(seq)
       print(len(seq),'headings ·',len(c),'distinct ·',{k:v for k,v in c.items() if v>1})
       PY
       # before: 156 headings · 155 distinct · {'172': 2}
       # after : 156 headings · 156 distinct · {}
       ```

       **Three instruments were wrong, and the third is the one that matters.**
       `check:slice-refs` asks whether a citation resolves, never whether it
       resolves uniquely, so it passed on both. The self-arm script the last two
       grills used keys slices by their first heading, so the *owner bug report*
       inherited `objective grill` and was excluded from the "would this have
       crossed without a grill?" set — biasing that instrument toward the very
       self-reference it was measuring (1 of 3 as reported; 2 of 4 honestly, same
       verdict). And `dispatch_status.py` collapses the arming set with
       `sorted({...})`, so a collision subtracts exactly one slice — red-proved on
       a probe copy of the log with the colliding row rewritten, injection
       confirmed as exactly one differing line:

       ```
       as committed (collision) : ['169','170','172']         -> 3
       collision resolved       : ['169','170','172','174']   -> 4
       ```

       Rule 3's threshold is three, so a collision flips `OVERDUE` to `ok`
       whenever the true count is exactly three — the silent-starvation shape
       `LOOPS.md` rule 3 records five recurrences of, through a door none of
       those five used. It did not fire this wake only because 4 > 3.

       *Accept*: no slice number heads two sections, and something says so when
       one does. **Done both ways.** The later-filed slice is renumbered **174**
       (first claim wins) with the renumber recorded in it; `check:slice-refs`
       gains a uniqueness assertion, red-proved by re-introducing the collision
       with the injection confirmed (`## Slice 172` heads 2 sections → gate
       exits 1 naming it). Base rate **3 of 710 revisions**, so the predicate
       distinguishes rather than decorating (94.11). Scoped to `ROADMAP.md`
       alone, which is sufficient because every archived slice leaves a pointer
       stub there — checked, not assumed: **144 stubs, 144 real archived
       sections, set-equal**.

       **The residue is permanent and is the smaller wrong.** The two
       command-bar rows keep saying `172.1/172.2`, because
       `record_iteration.py`'s standing rule leaves historical rows alone, so
       `dispatch_status.py` will attribute that work to 172 forever. The
       renumber fixes the plan, not the log.

2. [x] **175.2 — DONE 2026-08-28. `check-resume-charter`'s pointer assertion
       could never detect the pointer's removal, and had over-claimed its own
       red-proof since its first commit.**

       It read `resume.includes('ENVIRONMENT.md')` while its failure text says
       *"Restore the blockquote under the title"*. `RESUME.md` names the file
       three times — once in the ⚠ blockquote Step 0 depends on, twice in
       ordinary prose — so deleting the blockquote leaves two. Injection
       confirmed by counting blockquote lines before each run:

       ```
                                              mentions  blockquote  exit
       baseline (as committed)                    3         1         0
       pointer BLOCKQUOTE deleted                 2         0         0   <- defect
       every mention of the filename removed      0         0         1
       ```

       **Not rot — over-claimed from the start.** Every revision of `RESUME.md`
       since 169.3 carries 3-5 mentions and exactly **one** blockquote, so there
       has never been a revision on which deleting the pointer left zero
       mentions. What the header recorded as *"deleting the pointer line goes
       red"* was really *"deleting all three"*.

       ```
       for sha in $(git log --format=%H -- .roundtable/RESUME.md); do
         echo "$(git show $sha:.roundtable/RESUME.md | grep -c 'ENVIRONMENT\.md') \
               $(git show $sha:.roundtable/RESUME.md | grep -c '^>.*ENVIRONMENT\.md')"
       done
       ```

       CLAUDE.md's *"verifying a removal: assert on structure, never on raw
       text"*, landing on the gate whose whole job is to enforce a removal —
       and the third instance in this gate family inside 24 hours (172.1's fence
       fail-open, 172.1b's `src.includes('@exact')`, this).

       *Accept*: the assertion distinguishes the pointer from a prose mention,
       and the `--self-test` the `@heuristic` tag owes carries that pair.
       **Done.** `pointsAtEnvironment` matches a blockquote line naming the
       file, fences skipped for the reason `headingsIn` skips them. Red-proved
       with the injection confirmed off disk (blockquote 1 → 0, exit 0 → 1), and
       three self-test cases added: a blockquote pointer holds, a prose mention
       does not, a `>` inside a fence does not. Stubbing `pointsAtEnvironment`
       to `true` flips exactly those and exits 1. **Counter-evidence recorded**:
       the new assertion is recognition, not membership — it does not become
       `@exact` by being better.

3. [x] **175.3 — DONE 2026-08-28. That same gate can no longer fail anything,
       and two documents claimed the opposite.**

       169.4 removed `check-resume-charter.mjs` from `check:repo` — the only
       chain that ran it — and re-homed it in `record_iteration.py`, which
       discards its exit code by design (*"it must not fail the recording"*).

       ```
       git show 33fb89e7 -- apps/docs/package.json
       grep -rn 'resume-charter' --include=*.json --include=*.yml . | grep -v node_modules
       ```

       **The move is right and the demotion is defensible**: `.roundtable/**` is
       CI-ignored, so a CI gate reading it was the contradiction 169.4 correctly
       named, and the check still runs automatically every wake, which keeps it
       clear of `LOOPS.md`'s "a gate that needs a human to start something is not
       a gate". What was wrong is that `LOOPS.md` said it *"holds both ends"* and
       `RESUME.md` said it *"fails the build"* — the second flatly false.

       **The sequencing is the finding.** Hardened at **11:42:09Z** (`18791d5`,
       172.1) and demoted at **12:26:17Z** (`33fb89e`, 169.4): **44 minutes, two
       consecutive wakes, neither naming the other.** Nothing in the loop
       connects "a gate was just hardened" to "a gate just left the build".

       *Accept*: the two documents state what is true of the gate's force, and
       either a mechanism is built or the refusal is recorded with its reason.
       **Done — recorded as a refusal.** A gate asserting which scripts
       `check:repo` runs would assert a preference, not a fact, and
       `check:ci-ignores` already derives the CI-run set, so a second derivation
       over the same data to enforce a taste is 94.11's ceremony. The gate's
       force is left advisory: reversing 169.4's call 44 minutes after it was
       made, from a grill, without the owner, is the scope creep the Objective
       refuses. **What would reopen it:** a charter violation that actually lands
       and survives a wake, which is now visible because `LOOPS.md` says where
       the check reports.

4. [ ] **175.4 — OWNER CALL. Step 0c's own reopen condition fired, so "accept
       collisions" is due a re-decision.** The finding is recorded and the false
       half is already corrected in `LOOPS.md`; what is open is the decision,
       which has been the owner's in every slice so far.

       Step 0c accepts collisions on this argument: *"the loser's rebase
       conflicts, so it cannot land silently on top of work it never read"* —
       and names its own trigger: *"a collision that LANDS rather than being
       rejected — two wakes whose only overlap was the append point of
       `loop-log.md` and whose rebase resolved cleanly."*

       **On this wake's collision the rebase resolved with no conflict at all**,
       and both guaranteed collision points failed for different reasons.
       **Stated exactly: the trigger's wording is narrower than what happened.**
       It anticipated a collision whose *only* overlap was `loop-log.md`'s append
       point; this one overlapped on `ROADMAP.md` and `LOOPS.md` and still merged
       clean, while `loop-log.md` was not in the loser's diff at all. Not the
       literal condition — the same failure through a wider door, and the safety
       claim the condition protects is the one that broke.

       ```
       git diff --name-only 5f211132 7cc6e73b   # other wake: 9 files
       git diff --name-only 7cc6e73b 6c2ce5e0   # this wake:  4 files
       comm -12 …                               # overlap: LOOPS.md, ROADMAP.md
       ```

       - `loop-log.md` was **not in the loser's diff**. `record_iteration.py`
         runs after the commit, once per wake, so for nearly all of a wake the
         append point is untouched. The guarantee holds only for a wake that has
         already recorded when the other pushes.
       - `ROADMAP.md` was in both and **merged cleanly**: two wakes ticking
         boxes in different slices produce disjoint hunks — 170.3 against a
         heading renumber and a new slice ~400 lines away.

       What caught it was the `git fetch origin main` before the first commit,
       which the same section mandates and which is the working half.

       **The other arm of the experiment ran by accident, in the same wake.** The
       other dispatcher pushed again, and this wake rebased a second time —
       *after* `record_iteration.py` had appended its rows. That rebase
       **conflicted**, on `loop-log.md` and `STATUS.md`, exactly as Step 0c
       promises. One variable differs:

       | rebase | log row appended yet? | result |
       |---|---|---|
       | first | no | **clean** |
       | second | yes | **conflict** |

       So the guarantee is real and its WINDOW is the tail of a wake, not the
       wake. Resolved as Step 0c instructs — both row sets kept, never one
       dropped — then the mirrors regenerated rather than hand-merged; parser and
       raw agree at 1,058.

       Severity
       is bounded and stated: nothing was lost, the two grills share no finding,
       and the cost was one re-verification pass — Step 0c's own argument for
       redundant coverage paid for itself.

       *Accept*: a recorded decision that either (a) keeps "accept collisions"
       with the safety argument restated to match what is actually true — naming
       the pre-commit fetch as the only mechanism — or (b) picks a different
       scheme, with its cost measured rather than asserted. Either way `LOOPS.md`
       Step 0c stops carrying an argument its own trigger has falsified. **Do not
       resolve this by making the loser record earlier**: that would create a
       conflict on purpose to preserve a guarantee, and it trades a clean rebase
       for a hand-resolved one every time two wakes overlap.

## Slice 173 — Owner: two demos that do not demonstrate (2026-08-28)

**Owner:** *"/concepts/scale — Windowed list — the scanning exception"* and
*"/patterns/editable-grid — Medium — combobox lookup cells, validation,
add/remove lines — requires alignment"* (with a screenshot).

1. [x] **173.1 — the windowed-list demo puts 2000px of blank between the header
       and its only content.** LANDED 2026-08-28. Premise re-measured first and
       it reproduced exactly (`c0 2000/0 · c1 160/4 · c2 2000/0`, table 4200px).
       Spacers are now **120px and say so in the copied markup**; the table is
       **440px** and all three chunks sit in one view at 1440×900 **and**
       390×844, light and dark. Red-proved: injecting `2000px` back into the
       built page (4 occurrences — 2 preview, 2 copyable, confirmed by count
       before believing it) turns `allChunksInView` false at both widths.

       **A second defect was found in the same block, and it is the worse
       one.** The copied comment said the spacer height was
       `rowCount * --bo-density-row-height, computed at eviction time — never
       measured`, and the caption said `never measured via
       getBoundingClientRect`. Both document a design that was **tried and
       reverted**: `chunkRowHeightPx()` measures one real row once at bind and
       caches it, precisely because token-derived spacers ran ~250px short per
       100-row chunk and the list jumped while scrolling. The token is only the
       fallback. Page now states the real mechanism and why the token version
       was abandoned.

       *Original measurement, kept:*

       ```
       c0  evicted spacer   2000px   0 data rows
       c1  loaded chunk      160px   4 data rows   <- the entire point
       c2  evicted spacer   2000px   0 data rows
       table 4200px · first data row sits 2000px below the header
       ```

       The markup is structurally right — it faithfully shows evicted spacers
       either side of a loaded chunk, which is the bidirectional-windowing
       shape the prose describes. It is the DEMO that fails: a reader lands on
       the section, sees a header, then two screens of nothing, and the four
       rows the page's own comment calls *"what a reader is looking at"* are
       off-screen. A demo of a performance mechanism that cannot be seen
       teaches nothing, on the page whose thesis is "measured, not guessed".
       *Accept*: the spacer/rows/spacer shape is visible **in one view** —
       either a bounded scroll container on the demo, or illustrative spacer
       heights with the real formula kept in the prose. `Demo` renders preview
       and copyable code from ONE string, so whatever is chosen is also what a
       reader pastes: if the heights become illustrative, the markup must say
       so where it is copied, or this trades a readability bug for a 154.2.
       Verified by measuring the first data row's offset from the header, not
       by looking.

2. [ ] **173.2 — editable-grid "Medium": the numeric columns need alignment.**
       Measured: headers and cells agree at the box level (`Qty` and
       `Unit price` are both `text-align: end`, inputs inset by the 16px cell
       padding — 807/791 and 1087/1071). What the screenshot shows is that the
       **qty input is ~247px wide for a 3-digit value**, so the number, its
       header and its error message sit far apart across an empty gutter, and
       "Exceeds on-hand (200)" hangs under the middle of a wide box.
       **ANSWERED by the owner, and measured exactly.** The complaint is that
       *showing the error misaligns the fields*:

       ```
       without error   row 53px   inputs at 407 / 407 / 407
       with error      row 75px   inputs at 418 / 407 / 418   <- 11px shift
       ```

       The erroring field stays put and its SIBLINGS drop 11px: the qty cell
       grew (input + `.bo-form-field__message` stacked) so every other cell
       re-centres in a taller row. `.bo-form-field__message` is `display:
       block` revealed by `:has([aria-invalid="true"])` — correct in a form,
       where a field owns a column of vertical space; wrong in a grid row whose
       height is a density token (`2.5rem`) and whose numeric column alignment
       is the thing `--numeric` + tabular-nums exists to protect.

       **The principle the fix must satisfy: the message may not contribute to
       the row's height.**

       **Owner proposed a floating box below the field. Grilled 2026-08-28 —
       right mechanism, wrong lifetime.** It does fix the cause (out of flow =
       no height change), and three failure modes were measured rather than
       argued:

       - **A plain absolutely-positioned box is clipped.**
         `.bo-data-table-container` is `overflow: auto` with `container-type:
         inline-size`, which both establishes a containing block and clips —
         so a box on the last visible row is cut off. Escaping needs a real
         top-layer `popover`.
       - **Which collides with what is already there.** This same demo has
         **5 popovers** (the combobox lookup cells), so an error popover shares
         an anchor with a listbox — the failure `/patterns/command-bar`
         documents a section about.
       - **It occludes the next row, permanently.** The message adds **22px**
         (75-53) against a **40px** comfortable row: ~55% of the line beneath.
         Native validation bubbles get away with this because they are
         TRANSIENT; this pattern's contract is *"422 → that row re-rendered
         with cell errors"*, which is persistent and can hit several rows at
         once.

       **Two candidates remain, both keeping the row at 53px** — owner to pick:
       - **(a) Row-level error row** — a `<tr>` beneath the data row. Shows
         every reason at once without interaction, scales to several errors per
         line, no occlusion. Costs a row.
       - **(b) Message floats on FOCUS only.** Splits fact from reason: the row
         tint **plus its 3px inset leading edge** (both already shipping, and
         157.2 settled that the edge means "this row is in a state") carry the
         fact on two channels; `aria-describedby` already carries the reason to
         a screen reader; the visible message appears in the field you have
         clicked into to fix. Cost, stated: a sighted user scanning sees WHICH
         cell is wrong but must focus it to read WHY.

       Either changes the pattern's documented States contract ("the message
       inside that cell's form field"), so it is a design decision, not a tidy.

3. [x] **173.3 — `initWindowedList` is a shipped behavior with ZERO tests.**
       Found while fixing 173.1, queued rather than folded into it.
       ```
       grep -rl "initWindowedList\|data-windowed\|data-chunk-id" packages/core/tests/
       # (no matches — 2026-08-28)
       ```
       It is exported from `index.ts` and carries an entry in
       `behaviors.json`, so it is public surface. **Its spacer-height
       mechanism has already shipped wrong once** — token-derived heights ran
       ~250px short per 100-row chunk, a scroll jump found by red-proof rather
       than by a test — and nothing executable holds it today. That is also
       why 173.1 found the docs describing the reverted design: no test, no
       pressure to keep the prose true.
       *Accept*: the spacer height a real eviction produces equals
       `rowCount × the measured row height` (**not** the density token), plus
       the two claims the page now makes — measured once at bind and cached,
       and selection surviving eviction via the out-of-DOM Set. If jsdom
       cannot give real row heights, say so and put the height case in a
       browser gate instead of writing a test that asserts the fallback and
       calls it covered — that would re-create the exact bug.

       **DONE 2026-08-28 (cloud wake). 9 tests in
       `packages/core/tests/windowed-list.test.ts`, and the Accept's premise
       about the prose turned out to be FALSE — which is the finding.**

       *jsdom cannot give real row heights*, as the Accept anticipated: every
       `getBoundingClientRect` is 0×0, so a test written against real geometry
       would have measured the 40px token fallback and called the measured path
       covered. Instead rows carry a stubbed **32.5px**, deliberately unequal to
       the token, so every height assertion discriminates: the headline case
       asserts `2 × 32.5 = 65` **and** `!== 2 × 40`. The one property a stub
       cannot establish — that real rows genuinely render taller than the token
       — was already held in a real browser and is **not** newly written here:
       `check-po-app.mjs`'s `spacerMatchesReal` compares a 100-row spacer to a
       measured row on `/movements`, with a ±1-row tolerance that a 250px
       token-derived shortfall breaks.

       **The premise "measured once at bind and cached" is wrong, measured.**
       Counting rect reads on `tr[data-row-id]`:

       ```
       atBind: 0 · afterFirstEviction: 1
       ```

       Nothing in `bindTable` reads geometry; `chunkRowHeightPx` is called from
       `makeSpacer`, i.e. lazily at the FIRST eviction — which is on the scroll
       path the mechanism exists to keep cheap. The intent (one read per table,
       never per eviction) holds; the wording never did. **Two documents said
       it**: `windowed-list.ts`'s own header comment ("one read at bind") and
       the caption 173.1 had just landed on `/concepts/scale` ("once, when the
       table binds"). Both corrected in this commit, and the count is now
       pinned by a test rather than by prose.

       **Red-proved, five injections, each verified in the BUILT
       `dist/js/behaviors/windowed-list.js` by grep before believing the
       result** (CLAUDE.md: a green red-proof is a defect in the injection
       until proven otherwise):

       | injected regression | tests red |
       |---|---|
       | token-derived height (the reverted design) | 3 |
       | `rowHeights` cache removed | 1 |
       | `data-chunk-size` dropped from the spacer | 1 |
       | `data-bo-reloading` re-request guard removed | 1 |
       | `applySavedSelection` call removed from the swap reconcile | 1 |

       Also covered: `aria-rowcount`/`aria-rowindex` from the offset, the
       documented no-op floor where `IntersectionObserver` is absent, and the
       token fallback asserted **as** the fallback (a chunk with no
       `data-row-id` row at all), never as the measured path.

**Recorded because it nearly became a false P0.** The first measurement of
173.1 used `querySelector('#windowed-list tbody')` — **singular** — and this
demo has THREE `<tbody>` elements. It returned the first, the evicted spacer,
and reported *"zero data rows at every scroll position"*: a demo rendering
nothing at all. That was written up as a serious defect before
`querySelectorAll` showed four real rows sitting 2000px down. The real finding
is worse for the reader and much less dramatic than the false one.

**And the fix's own first measurement was wrong the other way** (2026-08-28).
After the spacers shrank, the check still reported
`firstRowInFirstViewport: false` — because it tested `rect.top < innerHeight`
without scrolling to the section, so it was measuring *where the section sits
on the page*, not whether the shape fits a viewport. The table had already
gone 4200px → 440px. Same lesson as the sidebar label that could never
overflow its own box: **measure the box that carries the constraint** — here,
the table against the viewport, after `scrollIntoView`.

## Slice 172 — Objective grill of Slices 168, 169, 170 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 174 — Owner: /patterns/command-bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 171 — Owner wishlist: score layout / usability / performance, then recommend (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 170 — Objective grill of Slices 164, 167, 169 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 169 — Standardize sweep: the correction landed in the file that is rewritten every wake (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 168 — Objective grill of Slices 163, 164, 165 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 167 — Objective grill of Slices 161, 162, 166 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 166 — Standardize sweep: a fourth copy of the alias whose home says there is one (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 165 — the archive sweep is due again, and rule 4 is the thing paying for it (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 164 — Objective grill of Slices 158, 159, 160 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

