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

Owner wishlist: *"continue improvement the examples of App Suite, Role Page,
O2C, P2P, etc. — each screen should be given the scoring in term of
functionality, UX/UI, performance so can use to benchmark for next improvement
— this can be considered in unattended autonomous loops."*

**Why it is the right fuel.** Dispatcher rule 4 is owner-blocked and rule 6 had
run dry, which is exactly the state that makes an unattended loop stop finding
work. 21 suite screens scored on three dimensions is a queue that refills from
the codebase rather than from the owner's inbox.

**Reuses the Polish machinery rather than inventing a second one.**
`polish_requeue.py` now resolves `screen/<module>/<name>` to its
`.screen.mjs` — the suite carries no CSS of its own by gate, so one file IS the
screen's whole source. Rule 6, the round budgets, the blind re-score and the
source-digest re-entry all apply unchanged. One mechanism, more surfaces.

0. [x] **145.0 — DONE 2026-08-26. Feasibility test BEFORE building the ledger:
       does the rubric separate screens at all?** Added because the component
       rubric is the cautionary case — 19 surfaces, every one scored **3 in a
       single round**, the queue went dry, and three of its dimensions had to
       be retired for reading 3 everywhere. Building a screen ledger without
       testing for that reproduces the failure one level up.

       Three screens of deliberately different kinds were scored by hand
       against draft dimensions: `fin/journal-entry` (a document with a
       constraint), `p2p/purchase-orders` (a list report), `fin/ar-aging` (a
       cross-tab). **They separate**, and one dimension separated them on the
       first pass by finding a real defect rather than a score: two screens
       named their data table and one did not.

       Followed up across all 28 screens: **8 tables had no accessible name,
       and all 8 were in P2P** — the pilot module, built before the convention
       existed. Five later modules all got it right. axe never flagged it,
       because naming a table is best practice rather than a WCAG failure, so
       no gate saw a module-wide gap. Fixed, and now gated in the suite audit.

       *Verdict: 145.1-145.3 are worth building.* The dimensions discriminate,
       and the cheap objective ones point at real defects rather than
       decorating a number.

1. [x] **145.1 — DONE 2026-08-26. Two dimensions, not three: `ux` failed its own Accept test.**
       Not the other way round: this file already retired
       `typography`/`colour`/`spacing` for reading 3 on all 39 components, and
       LOOPS.md states outright that a dimension which cannot fail must never
       drive a round. A first sweep of all 21 screens measured which candidate
       signals actually separate them:

       | signal | range | distinct | verdict |
       | --- | --- | --- | --- |
       | DOM nodes | 58–234 | 18 | discriminates |
       | distinct `bo-` classes | 29–65 | 12 | discriminates |
       | HTML bytes | 3.5k–14.6k | — | discriminates |
       | headings / actions / fields | 1–5 / 1–6 / 0–17 | 4–6 | discriminates |
       | tree depth | 8–12 | 4 | weak — do not drive on it |
       | landmarks | 4–5 | **2** | **cannot fail — excluded** |

       **The finding that shapes the rubric:** almost everything cheap to
       measure describes what a screen *is*, not how good it is. A list screen
       has zero form fields and that is not a deficiency. So the numbers are
       **evidence a scorer cites, never the score**, and a screen is scored
       against what its KIND owes — the pattern page's own States table is the
       checklist — never against a screen of a different kind.
       *Accept*: three dimensions each shown to produce at least three distinct
       values across the 21 screens, or the dimension is dropped and said so.

       **Result, measured across all 28 screens** (`examples/erp-suite/score.mjs`):

       | dimension | distinct values | verdict |
       | --- | --- | --- |
       | functionality | 3 | KEEP |
       | performance | 6 | KEEP |
       | **ux** | **1** | **DROPPED** |

       `ux` read **5/5 on every screen**. The Accept test caught exactly what it
       was written for, one level up from the components case it was modelled
       on. But the reason is worth more than the verdict: those five checks are
       **binary** — a caption is present or it is not; headings skip a level or
       they do not — and a binary property that never varies belongs in a GATE,
       enforced once, not in a rubric re-confirming it 28 times. **A rubric is
       for what can be better or worse.** Not a dead detector either: the
       caption half was red-proved and fires. Redundant, not blind — a
       distinction worth keeping, because the two have different fixes.

       So the four un-gated ones moved into `audit.mjs` and are now asserted on
       every suite run (red-proved: demoting an `<h1>` to `<h3>` reports
       *"headings descend without skipping a level — FAILS"*).

       **The kind map was wrong on its first run**, as the base rate predicts:
       `period-close` scored 1/4 and `bom` 2/4, and both were misclassification
       rather than defect — a BOM has no meaningful total, so owing a `<tfoot>`
       was nonsense, and close tasks are not filtered, created ad hoc or
       drilled into. Added `structure` and `job` kinds. The six lists missing a
       filter bar were **left exactly where they were**, because correcting a
       kind is legitimate and tuning until scores look good is not.

       **The backlog the score exists to produce**, and it repeats the caption
       finding INVERTED: 6 lists have no way to narrow the set — and the two
       that do are both in P2P, the pilot module. P2P was *behind* on captions
       and *ahead* on filters. The pattern is not "the pilot is better", it is
       **whatever a module was iterated on, it has** — which is an argument for
       scoring every screen rather than trusting that a convention spread.

2. [x] **145.2 — DONE 2026-08-26. Performance is a FIT RESIDUAL, not a budget.**
       The item asked for a per-kind node budget. That was the wrong
       instrument, and two measurements said so before any score was recorded:

       1. **Absolute budget per kind** — cannot tell a RICH screen from a
          BLOATED one. `p2p/purchase-order` read 235/220 "OVER" while being
          simply the densest document in the suite.
       2. **Nodes per fact** — wrong in the opposite direction. Chrome is
          near-fixed per screen, so the ratio is hyperbolic in `facts` and
          punishes THIN screens: `crm/opportunity` ranked worst in the suite at
          7.83 on twelve facts and is entirely ordinary.
       3. **Least-squares fit of own-nodes against facts, scored on the
          residual** — right, because it separates the two costs the others
          conflated: a fixed overhead every screen pays, and a marginal cost per
          fact. Excess above the line is markup that bought nothing, which is
          what the Accept criterion actually describes.

       **Measured: `own ≈ 70 + 1.25 × facts`, residual sd 18** over 27 screens.
       That slope is the framework's own report card — each displayed fact
       costs **1.25 DOM nodes**, so there is almost no wrapper-per-datum, which
       is the CSS-first charter showing up as a number rather than a claim.

       *Accept — demonstrated*: 80 empty `<span>`s appended to `/fin/ar-aging`
       with facts unchanged moved its excess from **−3 to +77**. 21 distinct
       values across the suite, so the dimension discriminates.

       **The one outlier was my instrument, not a screen.** `p2p/purchase-order`
       sat at +56 (2.7sd) until the fact counter was corrected: a thread entry
       carries an author, a marker and a body, and counting the whole entry as
       ONE fact under-counted the only screen with a discussion thread. Fixed,
       purchase-order fell to +36, and the suite now has **zero outliers** —
       the honest reading being that nothing is bloated today, not that the
       detector is asleep, since the Accept test proves it fires.

       **Stated limit:** the fit is recomputed each run, so it measures
       *relative* bloat — if every screen doubled its chrome the line would move
       with them. The absolute number (`nodes per fact`) is printed for that
       reason and belongs in `record_metric.py`, where a trend is visible.

3. [x] **145.4b — DONE 2026-08-26. Backlog 10 → 0, and one of the ten was a kind error, not a gap.** Not a new idea:
       these are the gaps `score.mjs` reported on 2026-08-26, written down so
       an unattended wake picks them up instead of re-deriving them.

       - **6 lists have no way to narrow the set** — `crm/accounts`,
         `crm/opportunities`, `o2c/sales-orders`, `o2c/customer-invoices`,
         `p2p/vendor-invoices`, `prod/production-orders`. The two that DO have
         one are both in P2P. Read next to the caption finding, where P2P was
         the module that was *behind*, the pattern is not "the pilot is better"
         but **whatever a module was iterated on, it has**.
       - **2 reports have no summary row** — `prod/capacity`, `inv/lot-trace`
         (a structure: check whether a total is owed at all before adding one,
         since the kind map already got exactly this wrong once).
       - 1 report offers no way to take it away, 1 lacks emphasis.

       *Accept*: `node examples/erp-suite/score.mjs` reports a smaller backlog,
       **or** the item closes as "correctly absent" with the reason — a list
       whose set is always short does not owe a filter, and saying so is a
       result, not a dodge.

       **Five lists got a filter, not six.** `o2c/customer-invoices` is
       "Receivables by age" — a cross-tab with Current / 1–30 / 31–60 / 61–90 /
       90+, the same shape as `fin/ar-aging`. It was filed as a list because
       its NAME sounds like one. That is the **third** kind-map correction after
       `period-close` and `bom`, and the three share a cause worth stating: kind
       was assigned from what a screen is CALLED rather than what it DOES.

       **One gap was correctly absent, and is now recorded as such.**
       `inv/stock-on-hand` owes no column total: the quantity columns mix units
       — ea, m and kg in one column, because the rows are different items — so
       a total would add hydraulic pumps to metres of hose. `score.mjs` grew an
       `EXEMPT` map that requires a written reason, because without one the
       only way to clear a gap is to add surface, which turns a rubric into a
       checklist that rewards adding things.

       **The empty backlog then broke the Accept test, which is the finding
       that matters for autonomy.** With every gap closed, `functionality`
       reads ONE distinct value and the drop rule said *"cannot
       discriminate"* — the same verdict `ux` earned. But `ux` read uniform
       from its first run, before any work; `functionality` scored 3 distinct,
       produced ten findings, and reached uniformity by having them all fixed.
       An unattended wake acting on that verdict would have deleted a working
       instrument at the exact moment it succeeded. The verdict now
       distinguishes the two, and the drop test is a question to re-ask when
       the RUBRIC changes, not on every run.

4. [x] **145.3 — DONE 2026-08-26. Ledger seeded, 28 screens, and the digest was reading the wrong thing.**
       Same ledger shape as `polish-state.md`, so `--check`/`--apply`/`--stamp`
       work on it. *Accept*: `polish_requeue.py --check` reports screens whose
       `.screen.mjs` moved, and a Polish round can pick one.

       Seeded from `score.mjs --json` with a stated 0-3 anchor per dimension,
       and the distribution is the point: **1 screen at 1, 16 at 2, 11 at 3**.
       The component rubric it is modelled on scored 19 surfaces at 3 in a
       single pass and went dry; this one separates, which is what 145.0 and
       145.1 were spent making sure of.

       `polish_requeue.py` grew `--ledger polish|suite`. One mechanism, two
       ledgers — the shape, the `src` digest, `--check/--apply/--stamp` are all
       unchanged, which is the whole reason 145 was built on the Polish
       machinery instead of beside it.

       **The Accept test failed first, and found a real defect in the shared
       tool.** Touching a `.screen.mjs` produced no re-entry, because `digest()`
       used `git ls-files -s` — the STAGED blob. An edit that had not been
       `git add`ed was invisible, so a wake mid-round would be told nothing had
       moved. Now hashes the working tree. This was latent in the polish ledger
       too since 2026-08-25 and nothing had caught it, because every test until
       now happened to compare committed states.

4. [x] **145.4 — DONE 2026-08-25. Finance and Inventory built, 8 screens, 2 gaps.** Not SKIPPED.
       Correction to the note below: they are not half-built screens, they are
       `build.mjs`-generated "not part of the pilot" empty states, so every
       module on the nav rail lands somewhere. Finishing them means building
       Finance and Inventory for real and adding them to `BUILT_MODULES`.
       Chosen for gap-finding value, since Production found 0 gaps: Finance
       stresses a live balancing CONSTRAINT (a journal entry that must balance
       before it can post), a totals/footer row, and an aging cross-tab — which
       tests the standing prediction that `--sticky-col` already covers
       cross-tabs. Inventory stresses an item×location matrix, dense count
       entry with variance, and lot genealogy, which is the likeliest real gap
       in the set. *Accept*: 8 screens, zero CSS of their own, gaps recorded in
       the ledger either way — including "found nothing", which is the result
       Production produced and is worth as much.

       **Result: 28 screens, zero CSS of their own, zero axe violations.**
       GAP-20 (fixed): `.bo-tree-table`'s indent matched `td:first-child`
       only, so choosing `<th scope="row">` — the correct markup for a
       hierarchy's row label — rendered a twelve-level tree flat while every
       gate stayed green. The accessible option was the one that broke, and
       nothing in the suite asserts that an indent indents. GAP-21 (recorded,
       refused): a lot family is a DAG, so a blended lot is duplicated four
       times and the framework cannot say two rows are the same entity; a
       graph component would be one component for one screen until a
       where-used BOM explosion gives it a second.

       **Two predictions died to measurement**, which is the instrument
       working: a totals row was asserted to have no treatment and has had one
       since 130.3, and `data-tree-level` was read as 0-based when its own
       contract says 1..12. The three screens closest to existing shapes found
       nothing at all — gaps come from shape novelty, not module count.

**Note (not a work item) — how 145.4 was found.** Found
       while enumerating: 21 screens are 7 p2p, 4 o2c, 4 crm, 4 prod, 1 fin,
       1 inv. Finance and Inventory were dropped on the owner's instruction
       after Production found 0 gaps, so these are stubs by decision, not
       neglect — but a scored ledger will rank them last forever and generate
       wakes for screens nobody intends to finish. Either mark them SKIPPED
       with the reason, the way `component/date` is, or finish them.
       *Answered 2026-08-25: finish them — see 145.4 above.*

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

Dispatcher rule 2, `dispatch_status.py` reading `Standardize 4 / 4 OVERDUE`.
Rule 1 found no open P0 and GitHub intake is empty (0 open issues), so nothing
preempted it. Second run of the cadence 158.2 installed.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders: two build-time Node generators
and three comments. `gen-rf-profile.mjs`'s output is byte-identical before and
after, so no page's markup changes at all — which is a stronger statement than a
screenshot would have been, and it is the one made here. `check:layout` and
`test:axe` swept all 127 pages at both widths anyway and were unchanged. **No
visual debt was added; nothing visual was looked at.**

1. [x] **166.1 — the three rot-guard sweeps: two clean, and the finding came
       from the fourth thing the playbook names.**

       ```
       npm run scan:dead-style -w docs        # 0 dead of 1,428 live inline decls
       npm run report:css-repeats -w @busy-office/ui
         # 74 files · 237 rules · 225 distinct · 8 repeated — LOOPS.md's table exactly
       npm run report:prose -w docs           # 118 pages · median 739 · total 104,419
       ```

       **`report:css-repeats` — zero delta.** All three totals and all eight
       groups match LOOPS.md's table byte for byte. Per that table's own rule,
       the finding is the delta and there is none; the joined-control x4 group
       is still two components, not four, so its reopen trigger (a THIRD
       component) is unmet.

       **`report:prose` — zero unverdicted pages, and RESUME.md was wrong to
       say otherwise.** The handover named `/base/motion/`,
       `/concepts/js-behaviors/` and `/concepts/design-language/` as "the three
       nobody has verdicted"; **161.1 verdicted all three**, in the run that
       wrote that note. Every page the report flags today — 12 over the corpus
       median, 12 over a family median — carries a verdict from 158.1 or 161.1.
       The corpus total moved 104,408 → 104,419 (+11 words) and no page crossed
       a threshold it had not already crossed. Corrected in the handover rather
       than counted again.

2. [x] **166.2 — `gen-rf-profile.mjs` kept a fourth copy of `api.pageSlug`, and
       the canonical site's comment named two readers.**

       `extract-api.mjs` publishes the CSS-dir→page-slug alias on
       `api.pageSlug` and its comment calls it *"the SINGLE source of this
       alias"*, naming `gen-llms.mjs` and `check-page-shape.mjs` as the readers
       that hold no copy — because it drifted once already (Slice 6 item 1).
       There was a third site holding a copy:

       ```
       grep -rn "state-patterns'" apps/docs/scripts/*.mjs packages/core/scripts/*.mjs
       ```

       `gen-rf-profile.mjs` carried a seven-entry hand map, and it had drifted
       **in both directions** — five `→ form` entries the canonical map does not
       carry, and no `skeleton` entry that it does. It never collided, because
       the two maps are keyed on different things: the canonical one on CSS
       **dirs**, this one on **file stems** (`RF_COMPONENTS` holds `<dir>/<file>`
       and the generator read `split('/')[1]`).

       **No user-visible defect, stated as measured and not as reassurance:**
       all 14 of the profile's hrefs resolve to a built page today. The cost was
       a second home for an alias whose whole documented point is having one.

       *Accept was*: the alias exists in exactly one place; the generator's
       output is unchanged; and whatever asserts the property is named and shown
       to fail.

       **What landed.** The href is now derived from the DIR through
       `api.pageSlug` (the name still comes from the file stem — five entries
       share the `form` dir but name five distinct files the profile ships, and
       collapsing them would change the rendered list). The hand map is gone.

       - **Output byte-identical**, diffed against the pre-change
         `rf-profile.json`. This is the property the refactor had to hold, and
         it is checked rather than argued.
       - **The new import is load-bearing, red-proved**: deleting `alert` from
         `api.pageSlug` moves the generated href to `/components/alert`;
         restoring it returns the file to byte-identical. Without this the
         import could have been decorative and the derivation a coincidence.
       - **No new gate, and that is measured, not assumed.** The three pattern
         pages consuming this render every href as a real `<a>`, so
         `check-links.mjs` already covers a slug with no page. Red-proved by
         injecting `/components/no-such-page` into the built
         `patterns/rf-landing/index.html`, confirming the string was present in
         the BUILT file, and running the gate: it names the link and exits **1**.
         Restored; the gate then verified 14,456 links.

3. [x] **166.3 — two comments were false and are now corrected.**
       Both were found by the refactor, not searched for.

       - `rf-components.mjs` said *"the docs derive the display name from the
         dir"*. They derive it from the file stem, and have since the generator
         was written — the line described `split('/')[0]` while the code read
         `[1]`. Now states both halves and why they differ.
       - `extract-api.mjs`'s "SINGLE source" comment named two readers while
         three sites existed. Now names three, and records this as the second
         drift so the next one is not written off as first-time.

       No gate proposed for either. "A comment matches the code it describes" is
       semantic, and roadmap 94.11 already paid for that lesson; the shape here
       is not checkable, and inventing one would be the ceremony that section
       refuses.

4. [x] **166.4 — the re-scan that closes the sweep, and its first version could
       not have found the bug it was written to re-check for.**

       Standardize's exit is *a clean pass finds nothing to consolidate*, so the
       round has to re-scan for the same drift elsewhere. Two passes:

       ```
       grep -rn "state-patterns'" apps/docs/scripts/*.mjs packages/core/scripts/*.mjs
         # 1 site — extract-api.mjs:173. The alias is single-sourced again.
       ```

       Then, for the same SHAPE anywhere else — a string→string map of 3+
       entries whose keys overlap another file's. **The first version compared
       key sets for EQUALITY and reported 0.** It would have reported 0 on
       yesterday's tree too: the drifted map had seven keys against the
       canonical three, so equality never fires and the instrument was
       congratulating the tree for a bug that was present. The zero looked like
       an answer and was an artefact — CLAUDE.md's base-rate rule, hit on the
       first output of a new instrument exactly as that section says to expect.

       Rewritten to test **overlap** (2+ shared keys) and red-proved against the
       known-bad input rather than a synthetic one: run over
       `extract-api.mjs` plus `git show HEAD:apps/docs/scripts/gen-rf-profile.mjs`,
       it reports **1 overlap on `alert` and `state`** and names both files. Over
       the live tree — 86 script files, 20 qualifying maps — it reports **0**.
       That zero has now been shown to be capable of being non-zero, which is the
       only reason it is quoted here.

       Ad-hoc, deliberately not a gate: 20 maps is a small enough population that
       a gate would be ceremony, and the predicate's base rate on the live tree is
       0 of 20 — the shape 94.11 warns produces a detector that never fires. It is
       written down so the next sweep re-runs it instead of re-deriving it.

5. [x] **166.5 — the dispatcher's slice parser was blind a FIFTH time, and this
       wake's own Standardize row is what it could not see.**

       Not searched for. After recording 166, `dispatch_status.py` still read
       `Objective 1 / 3 [161]` — a Standardize row naming Slice 166 was in the
       log, `CLOSES_A_SLICE` includes Standardize since 161.4, and the counter
       showed 1. The number disagreed with what had just been written, which is
       the only reason this was noticed.

       **A third convention.** A row may name a slice with no sub-item and no
       `Slice` prefix — `166 — …`, `119: …`. `SLICE_BARE` requires `.N`;
       `SLICE_PROSE` requires the word. LOOPS.md rule 3 says "the log uses two
       conventions" and it has used three since at least Slice 53.

       **Its first draft invented slices, and that is the finding worth keeping.**
       A loose `^(\d+)\s*[—–:-]` looked obviously right and matched **`4-tick
       sweep: …`** and **`4-seat adversarial grill …`** as *slice 4*. Eighteen
       such rows are in the log. A widening that reports MORE is not
       self-evidently a fix — this one would have fabricated a slice number onto
       eighteen Standardize rows, i.e. made the counter fire early rather than
       late. The shipped rule lets a colon sit flush but requires a dash to be
       surrounded by whitespace.

       **Measured over all 1,000 rows and reconciled three ways** (the command
       is the script's own `--self-test`; the population figures below are from
       an ad-hoc pass kept in this entry so the next wake re-runs rather than
       re-derives):

       ```
       python3 scripts/loops/dispatch_status.py --self-test   # 14 cases
       python3 scripts/loops/dispatch_status.py               # the live effect
       ```

       - loose probe 39 rows · corrected 21 · rejected 18, and **21 + 18 = 39**
         with every one of the 18 read individually — all `N-tick`/`N-seat`,
         none a slice reference.
       - rows naming a slice **444 → 465**; distinct slices **144 → 150**; rows
         **LOST by the widening: 0**.
       - live: `Objective 1 / 3 [161]` → **`2 / 3 [161, 166]`**.

       **No cadence figure is quoted, deliberately.** A replay harness written
       to answer "how many times does this change when the counter crosses 3
       over the whole log" read **61** where this script's own header publishes
       **23** for the *unchanged* parser. The harness cannot reproduce a
       published, red-proved number, so the harness is what is wrong, and an
       unreconciled number does not go into a comment or a roadmap entry. That
       was the second instrument in this wake to be wrong on its first output
       (166.4 was the first), which is the base rate CLAUDE.md states, hit twice
       in one sitting.

       *Accept*: `slice_of` returns the slice for all three conventions and
       `None` for the `N-tick` shape; `--self-test` carries a case for each and
       **fails when the fix is reverted AND when the separator is loosened**;
       the live counter's reading agrees with what the log says was recorded.

       **Red-proved both ways, injections confirmed to have landed:** removing
       `SLICE_TOP` from `slice_of` fails 2 cases (`166`, `119`); restoring the
       loose separator fails 2 *different* cases (`4-tick`, `4-seat`). 14 cases
       pass as shipped.

**Sweep verdict: clean.** `scan:dead-style` 0, `report:css-repeats` no delta,
`report:prose` no unverdicted page, one duplicated table found and removed, and
the re-scan for more of the same shape red-proved before its zero was believed.

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

1. [ ] **165.1 — move the closed slices to `ROADMAP-archive.md`, by hand.**
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

3. [ ] **164.3 — OWNER CALL: the direction chosen on 2026-08-26 is spent, and the
       queue behind it is empty of product work.** Not a wake's decision, filed
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

       **No metric, dashboard or gate is proposed**, deliberately: the
       verification-to-product ratio was raised and RETIRED above with "not to
       be re-raised as a new finding", and that retirement is correct. The
       corroborating commit-share measurement (product share of work commits:
       six days at 77-95%, then 83 → 68 → 60 → 52%) is in the grill report with
       its confounds, as corroboration only.

## Slice 163 — noticed while shipping 159.1: the bucket nobody adjudicated is the one below the bar (2026-08-28)

Not part of 159.1 and deliberately not folded into it — this is bigger than the
item, so it is an entry rather than an extra commit (LOOPS.md's improvement
rule).

**Measured, from the report 159.1 just changed** (`node
apps/docs/scripts/report-reach.mjs`, 2026-08-28, after `npm run build -w
@busy-office/ui`):

```
61 block classes · 75 independent compositions
  zero reach:      7  — 7 of 7 adjudicated (5 verdicts + 1 cannot-appear + 1 deprecated)
  exactly one:    10  — 0 of 10 adjudicated
```

**The asymmetry is the finding.** The Objective's principle 3 sets the bar at
"≥2 real, independent compositions". A block at **zero** has now been examined
seven times over, across two grills and two slices. A block at **exactly one**
sits one composition short of the written bar and **not one of the ten has ever
been looked at**. Attention went to the number that looked alarming rather than
to the number the principle actually names.

The ten: `bo-calendar`, `bo-composer`, `bo-offcanvas`, `bo-ordered-list`,
`bo-prose`, `bo-radio`, `bo-richtext`, `bo-skeleton`, `bo-tag-input`,
`bo-toast`.

**This is NOT a claim that any of them is a defect.** Slice 153.2 is exactly
what happens when a bare count from this report is read as one — a settled zero
was re-read as "the one real defect" and nearly spread a retired class across 21
screens. Several of these are obviously fine on sight (`bo-radio` is a form
control; `bo-toast` pairs with the runtime container already exempted). The
finding is that **nobody has written that down**, so the report cannot tell an
examined one from an unexamined one — which is the same defect 159.1 just fixed
one bucket up.

1. [ ] **163.1 — adjudicate the ten blocks at exactly one composition.**
       Each gets a verdict, or an explicit "not examined", by the same rule
       159.1 installed: the verdict is a dated claim, it stays in the count, and
       it reconciles both ways.
       *Accept*: (a) every block the report prints at exactly one composition
       carries a verdict or reads as unexamined, checked by running the report;
       (b) each verdict is measured, with the command next to the claim — an
       assertion about which screens do or do not compose a block is re-runnable
       or it does not go in; (c) **"all ten are correct as they stand" is a
       satisfying outcome**, recorded as ten verdicts, and so is "n of them are
       real principle-3 misses" — the criterion is that each is decided, not
       that any of them moves; (d) the report still never fails the build.

       **Do not re-derive the counts above** — the command is in this item and
       takes seconds. If it now disagrees with 61/75/7/10, that disagreement is
       the first thing to report, not something to quietly write over.

## Slice 162 — Two wakes took the same item, and nothing could have stopped them (2026-08-28)

**What happened.** The hourly cloud routine was promoted from this session
(owner call, 2026-08-28). It fired, worked the queue correctly, and landed
21 commits including **157.3**. Roughly an hour later the local session — still
open, still dispatching — reached rule 4, took the oldest open item, and got
**157.3 as well**. Both wrote a marker guideline into the same section of
`/components/data-table`. The local copy was discarded on `git push` rejection.

**Nothing was lost and nothing was corrupted**, because the push was rejected
rather than merged: the local work went to a branch, `main` was reset to
`origin`, and the branch was deleted after confirming the cloud's version was
strictly better — it also fixed an RTL cell edge that 157.2 had missed, which
the local version never found.

**The cost was one wake's work, and the cause is structural.** `LOOPS.md`
mentions concurrency **zero times** — the word does not appear. Every rule in
it assumes one wake at a time, which was true while loops were session-scoped
("these run while this session is open"). Promoting to `/schedule` made two
dispatchers real without any rule changing, and rule 4 is deterministic: given
the same `ROADMAP.md`, two dispatchers will always choose the *same* item.
**Determinism is the feature that makes the collision certain.**

1. [x] **162.1 — DONE 2026-08-28. Decided: ACCEPT collisions, with one fetch
       that makes the loser find out early.** The decision, its cost and the
       three refusals are in `LOOPS.md` **Step 0c** — do not re-derive them.

       **The premise was re-checked first and holds.** Plain fixed strings, not
       a context regex: `concurrency`, `concurrent`, `parallel`, `simultane`,
       `collision`, `race`, `two wakes`, `two dispatchers` → **0 hits each** in
       `LOOPS.md`; the 12 hits for `lock` are `block`/`blocked`/`blocks`/
       `blocking`/`unblock`/`lockfile`.

       ```
       for w in concurrency concurrent parallel simultane collision race lock; do \
         printf '%-14s %s\n' "$w" "$(grep -ci -- "$w" LOOPS.md)"; done
       ```

       **The two dispatchers are exactly separable, and nothing had to be built
       to do it** — the git author timezone offset is the discriminator (cloud
       container `+0000`, owner's machine `+0800`), and 1,000 of the log's 1,005
       rows end in the sha of their own commit (the 5 that do not are all from
       the log's first day, 2026-08-13, and carry a literal `-`):

       ```
       git log --format='%ad' --date=format:'%z' | sort | uniq -c
         # 32 +0000 · 1432 +0800   of 1,464 commits            (2026-08-28 03:35Z)
       grep -cE '^- .* · [0-9a-f]{7,40}$' .roundtable/loop-log.md
         # 1000, of 1005 `^- ` rows — a snapshot; the log grows every wake
       git log --since 2026-08-27T17:57:55Z --format='%h|%ai|%s'
         # the cloud era: 36 commits · 5 same-clock runs · 4 alternations
         # handover gaps 18.5 / 29.2 / 32.8 / 30.5 minutes — they overlap
       ```

       So the collision is not hypothetical or past: both dispatchers were
       active inside the same half-hour **four times** in the routine's first
       nine hours.

       **Why "accept" is safe by construction**: every wake ends with
       `record_iteration.py` (appends `.roundtable/loop-log.md`) and ticks a box
       in `ROADMAP.md`, so two concurrent wakes conflict on rebase even when
       their code changes are disjoint. **5 of 5 same-clock commit runs in the
       cloud era touched both files.** n=5 and the 100% is expected by
       construction, not surprising — at commit level only 705 of 1,464 (48%)
       touch the log, because a wake commits several times and records once.

       **The refusal that has an exact price**: a claim marker must be *pushed*
       to be visible, and `pages.yml` triggers on every push to `main` with **no
       `paths-ignore`** (`ci.yml` has one; the Pages workflow does not). That is
       a second deploy per wake, reopening the CDN skew window the "one push per
       wake" rule exists to close — to buy detection at minute 2 instead of at
       the push, which a `git fetch` before the first commit buys for free.

       *Accept*, as written, all met: (a) a decision is recorded in `LOOPS.md`
       naming what it costs — Step 0c, "up to one wake's work, discarded";
       (b) "accept collisions" was the blessed valid outcome and is the one
       taken; (c) the file is no longer silent — Step 0c plus a corrected
       operating-rules bullet, since **"Session-scoped — these run while this
       session is open" was the sentence that had gone false** and it was still
       sitting in the file.

       **TWO instruments were wrong on their first output, as the base rate
       says — and the second is a positive control for roadmap 159's rule.**
       The sha count above was first published as *994 of 1,001* by a regex
       anchored at `[0-9a-f]{7}$`. Git's abbreviation length grew with the repo,
       so **994 rows carry a 7-char sha, 4 carry 8, and 2 carry the full 40** —
       the regex silently dropped the four rows this very wake had just written,
       and would go on dropping every future row. It was caught only because 159's
       rule forced the command to be written next to the number, and writing it
       meant running it. A count of the tails is the reconciliation:
       `grep -oE ' · [0-9a-f]{7,40}$' … | awk '{print length($0)}' | sort -n | uniq -c`
       → `994 x 7 · 4 x 8 · 2 x 40`, and 1005 - 1000 = the 5 pre-convention rows.

       The other one: the first pass at "how many commits touch `loop-log.md`"
       parsed
       `git log --name-only` by treating any 40-character line as a sha. **31
       distinct pathnames in this repo are exactly 40 characters** —
       `apps/docs/src/pages/patterns/index.astro` among them — so it counted
       **1,579** commits where `git rev-list --count HEAD` says **1,464**, and
       reported 44% instead of 48%. Caught only because two counts of the same
       thing disagreed; re-run with `--format=%x00%H` and NUL-split records,
       which reconciles with `rev-list` exactly.

**Also worth recording, because it argues for the routine.** The cloud wake
found a real defect the local session shipped: 157.2 removed the cell-level
leading edge but its **RTL twin for `td[data-tone="success"]` survived**, a
standalone rule while danger and warning were grouped into the selectors the
edit rewrote. The local verification checked one tone's block and concluded
"0 box-shadow on cell tones" — the wrong box. One direction, one tone of three,
caught within a day and inside the Unreleased window. An independent wake
re-deriving the same claim is what caught it.

## Slice 161 — Standardize sweep: the cadence's first run, and a settled count that was wrong (2026-08-28)

Dispatcher rule 2, `dispatch_status.py` reading `Standardize 4 / 4 OVERDUE`.
Rule 1 found no open P0 and GitHub intake is empty (0 open issues), so nothing
preempted it. First run of the two-sweep step 1 that 158.2 installed — and the
sweep that was NOT on the list is the one that found something.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots.** Nothing in this
slice is visual — three `Related` link LABELS, one JSON cite string, one new
report script, `LOOPS.md` and this file. The four docs edits change link text
inside an existing `<Related>` component, so no layout or colour is touched;
`check:layout` and `test:axe` swept all 127 pages at 1440px and 390px. That is
what ran, and it is not the same as having looked.

1. [x] **161.1 — `scan:dead-style` clean; three prose verdicts, and two of the
       three are against the INSTRUMENT.**
       *Accept was* (from 158.2's cadence): a recorded verdict for any page over
       **2x its FAMILY median** that has none — `/base/motion/`,
       `/concepts/js-behaviors/`, `/concepts/design-language/`, the three the
       family split adds that 158.1's corpus-median pass never saw.

       ```
       npm run scan:dead-style -w docs   # 0 dead of 1428 live inline declarations
       npm run report:prose -w docs      # medians, family split, the three-way split
       ```

       Per-page detail was taken with an ad-hoc pass that **reconciles against
       `report:prose` on three independent totals** (118 pages, median 739,
       total 104,408) **and reproduces 158.1's stated corpus median of 103
       words per `h2` exactly** — that last one is the check on the new counter,
       since a words-per-chunk figure is the one number here 158.1 did not
       already publish.

       1. `/concepts/js-behaviors/` 1,429 (2.57x family) — **the instrument, not
          the page, and the sharpest case in the corpus so far.** 1,054 of
          1,429 words (**74%**) are inside the three `<h2>`s carrying the
          `generated` badge — The inits, Keyboard support, State attributes.
          Authored prose is **375 words**: 0.51x the corpus median and 0.67x its
          own family's. It is an outlier only by being a page whose job is to
          render three generated tables.
       2. `/base/motion/` 718 (2.08x family) — **the instrument, and the family
          median is what is wrong.** The page is **0.97x the CORPUS median** and
          its density is 90 w/h2 against a corpus median of 103: below average
          on both. `/base/` has n=6 with a 6.5x internal spread
          (110·127·283·408·630·718) because two of the six —`/base/utilities/`
          at 110 words and `/base/print/` at 127 — are pointer pages. A median
          of 346 taken over that is not a baseline, and 2x it lands below the
          corpus median, so **the `/base/` family can flag a page for being
          average-length**. Recorded rather than fixed: n=6 is too small to
          re-cut, and the fix is to read the corpus column too, which the report
          already prints.
       3. `/concepts/design-language/` 1,230 (2.21x family, 1.66x corpus) —
          **honest coverage, and the one of the three to watch.** It is the only
          one with **0 generated words** and above-median density (154 w/h2,
          1.5x). It is also the page that states the Objective's six rules, the
          field matrix, and the ten-question shipping filter — the prose other
          pages are measured *against*. Its two densest sections are the six-rule
          table, where every row cites where the framework ENFORCES the rule
          (a build gate, a measured DOM count, a token set), and the field
          matrix, whose own closing line says every cell is a setting of four
          primitives and nothing in it is a new component. Cutting either
          removes a citation, not a word. Same watch condition as
          `/concepts/layouts/`: if it grows again with no matching rule or gate
          change, that is the signal.

       **Tally across the two runs: 158.1's 9 honest / 3 instrument / 0
       removable, plus 1 honest / 2 instrument here.** The instrument column is
       now 5 of 15, which is the argument for the cadence rather than a budget:
       a third of what a word count flags is the word count's own fault.

2. [x] **161.2 — a pattern still named for its sample domain, in four
       reader-facing places; and the gate for it refused, measured.**
       Noticed while reading `/concepts/design-language/` for 161.1 — its
       `Related` list linked `/patterns/list-report` with the label
       **"Invoice-list pattern"**.

       LOOPS.md's owner rule (2026-08-22, Slice 109) is *"a pattern is NAMED and
       FRAMED for its SHAPE; never name a pattern for its sample domain —
       `invoice-list` was the one violation, renamed `list-report`"*. The
       **route** was renamed and a redirect stub left behind, correctly. The
       **visible labels were not**:

       ```
       grep -rlo "invoice-list" apps/docs/dist --include=*.html
         # 5 built pages: the redirect stub (correct) + 4 real occurrences
       ```

       Fixed: `Related` labels on `/components/data-table/`, `/base/print/` and
       `/concepts/design-language/` now read "List report pattern" — the
       spelling `/components/amount/` already used — and `dsa-scores.json`'s
       `filters.fit` cite ("the context invoice-list actually uses", rendered
       verbatim into the DSA table on `/components/filters/`) now names
       list-report. Verified against the BUILT output, not the diff: the only
       remaining `invoice-list` in `dist` is the redirect stub itself.

       **The gate is refused, on base rate, and the measurement is the point.**
       The obvious gate — *a `Related` label must agree with the linked page's
       own title* — was measured before being written: **90 of 428 resolved
       Related links (21.0%) legitimately disagree**, because the label carries
       the REASON for the link ("Kanban board (status as columns, not a
       bulk-select list)", "Editable grid (htmx in anger)"). That is good
       writing, and a gate would delete it. The narrower form fails too: 6 of
       the 10 redirect-stub slugs are ordinary English (`tokens`, `htmx`,
       `theming`, `primitives`, `nav`, `printing`), so "an old slug appears in
       prose" is unusable. This is roadmap 94.11's shape exactly — the shape is
       checkable, the meaning is not — so the rule stays a human call in
       LOOPS.md, and the honest statement is that nothing would have caught it
       but reading.

3. [x] **161.3 — a "Settled" count in LOOPS.md was wrong, and it had no
       command; it has one now.**
       LOOPS.md asserted *"of 237 rules with 3+ declarations, exactly **three**
       blocks repeat"* — and, two paragraphs later, that the count was "cheap to
       re-measure … in one command instead of trusting this paragraph", while
       recording no command. Re-measured this sweep: **eight**, on the identical
       237 rules. Roadmap 159's finding, landing on the file that records it.

       ```
       npm run report:css-repeats -w @busy-office/ui
         # 74 source files · 237 rules with 3+ declarations · 225 distinct
         # bodies · 8 bodies appearing more than once
       ```

       `packages/core/scripts/report-css-repeats.mjs` is the command — a REPORT,
       never a gate, for the reason the section itself gives: all eight repeats
       are correct, so a gate would fail the build on eight right answers. Same
       precedent as `report-prose.mjs`, written for the same reason.

       **Its own first run was wrong, which is the base rate holding.** postcss
       keeps `!important` off `decl.value`, so `.bo-badge`'s print rule and
       `.bo-stepper__marker`'s print rule — same three declarations, two of the
       stepper's marked `!important` — merged into a repeat that is not one, and
       it reported 9. Caught by reconciling against an independent regex pass
       that happened to keep the flag. With the flag in the key, the two
       instruments agree on all three totals.

       **Red-proved both ways, and the injection was confirmed in the file
       before the number was believed**: two rules with an invented shared body
       take it 8 → 9 with both selectors named in the output; and making
       `badge.css`'s print rule carry the stepper's `!important`s ALSO takes it
       8 → 9, which is what proves the flag is discriminating rather than
       decorative. It also refuses to report if `distinct === rules`, the shape
       a key contaminated with the selector would produce.

       **No verdict changed.** All five newly-surfaced repeats are the same
       ownership argument already settled twice: plain CSS cannot share a rule
       body without sharing a selector, and a UTILITY and a component PART
       cannot share one. LOOPS.md now carries the table of all eight, and the
       verdict is stated as a RULE rather than as three blessed blocks — which
       is what let five siblings sit unrecorded. The one to watch is the
       joined-control radius reset at **x4**, meeting this file's own
       "fourth copy" trigger; it is two components spelling one idiom twice
       each (bare control vs combobox wrapper), and the reopen condition is a
       third component, not a fifth copy.

4. [x] **161.4 — the Objective counter cannot see a slice that closes under any
       loop but Continue, and this wake is an instance.**
       **DONE 2026-08-28 (cloud wake).** Decision, the counts and the replayed
       cadence are in `LOOPS.md` rule 3 and in `dispatch_status.py`'s own
       comment, where the next reader will find them. Summary: the filter widens
       to **Continue + Standardize**; Roadmap, Explore and Objective stay out,
       the last two measured before being refused (adding both moves the log's
       crossing count 23 → 23).

       **The premise was right and was the smaller half.** Re-running the command
       below confirmed 31 Standardize rows name a slice and none counted — but
       the same run exposed a FOURTH instance of this counter's regex going
       quietly blind. The log uses two conventions, `164.1 …` and `Slice 84: …`,
       and the parser could only ever see the first: 302 bare rows against **141
       prose rows**, 99 distinct slices against a union of **144 of the 146** in
       this file. Replayed over the whole log, the count crosses 3 **18** times
       as the rule stood, **22** on the format fix alone, **23** with Standardize
       — so the format bug was four times the size of the question this item
       asked. `slice_of` now ships `--self-test`, red-proved both ways.

       **The counter reads the same today (0/3) and that is not a null result.**
       Only two rows follow the last Objective round and neither names a slice.
       The fix changes what the counter can see, not what it sees this instant.

       **NOTE — the command below carried a stale regex for one wake.** It was
       written with `(\w+)` for the loop field on 2026-08-27; 164.1 widened that
       to `[\w-]+` the next day because nine rows carry a hyphenated mode, and
       this copy was not updated with it. Fixed in place. That is roadmap 159's
       rule biting its own author: a command written next to a claim still rots
       when the thing it duplicates moves.
       Noticed by running `dispatch_status.py` after recording this slice: it
       still reads `Objective 2 / 3 [158, 159]`, with 161 closed and its three
       items ticked. Not chased into a fix, because changing what the counter
       counts changes when Objective preempts the build queue — and this file
       records that getting that threshold wrong in EITHER direction has cost
       real time (starved for ten slices one way; "would fire almost every wake
       and starve the build" the other). That is a judgement, not a bug fix.

       **Measured, with the command, so the next wake re-runs it:**

       ```
       # rows naming a slice number, by loop, over the whole log
       python3 - <<'PY'
       import re; from collections import Counter
       S=re.compile(r"^([1-9]\d{0,2})\.\d+[a-z]?\b")
       R=re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ([\w-]+) · ([\w-]+) · (.*)$")
       t=Counter(); n=Counter()
       for l in open('.roundtable/loop-log.md'):
           m=R.match(l)
           if not m: continue
           t[m.group(2)]+=1
           if S.match(m.group(4).rsplit(' · ',2)[0]): n[m.group(2)]+=1
       for k in sorted(t,key=lambda x:-t[x]): print(f"{k:14}{n[k]:5} / {t[k]}")
       PY
         # Continue 241/457 · Meta 0/170 · Roadmap 10/128 · Standardize 31/110
         # · Explore 6/56 · Objective 2/44 · Polish 0/9 · Optimize 0/3
         # re-run 2026-08-28 at 996 rows: Continue 252/469 · Meta 0/174
         # · Roadmap 11/130 · Standardize 31/110 · Explore 6/56 · Objective 2/45
         # · Polish 0/9 · Optimize 0/3 — the premise holds, unchanged where it
         # matters. NOTE this command only sees the BARE `NN.N` convention, which
         # is the blind spot the item's closing note is about; the counter itself
         # now reads both.
       ```

       `dispatch_status.py` filters to `r["loop"] == "Continue"` with a stated
       reason — *"a Roadmap triage row plans a slice, it does not close one"* —
       which is right about Roadmap and was never asked about Standardize.
       **31 Standardize rows have named a slice** and none has ever counted. So
       the exclusion is not a rare edge; it is 28% of that loop's rows, and it
       is the same silent-starvation shape this file has recorded three times
       about Objective specifically.

       *Accept*: a recorded decision about **which loops close a slice**, with
       the count each contributes, and `dispatch_status.py` agreeing with the
       decision — including the case where the decision is *keep Continue-only*,
       which is satisfying and wants only the reason written into the script's
       comment where the next reader will find it. If the filter widens, re-run
       the counter against the historical log first and say what the Objective
       cadence WOULD have been, rather than predicting it: this file's own rule
       is that a criterion names the property, not the value.

## Slice 160 — triaged while reading 158.1's outlier pages: named products the denylist does not deny (2026-08-28)

**Not new input** — nothing was filed and nobody asked. Found by reading
`/components/richtext` for 158.1 and noticing two consumer products named as UX
precedent in a paragraph, then measuring rather than assuming.

The standing owner instruction (2026-08-27) is *"no external product is named in
any document in this repo — describe the mechanism instead, or cite the standard
when a finding is normative"*. `check:vendor-names` enforces it and passes; it
is a **denylist** and says so in its own header, so it catches regrowth of the
seven names that have actually occurred, not every conceivable one. It is
working as designed. What it cannot see is the question below.

**Measured, with the command, so the next wake re-runs instead of re-deriving:**

```
grep -rnoE "\b(Notion|Slack|Gmail|Excel|Salesforce|Odoo|SAP|Fiori|Carbon|Material|Atlassian|Bootstrap|Tailwind|DaisyUI)\b" \
  apps/docs/src packages/core/src
```

Two populations, and they are not the same question:

- **Consumer apps cited as UX precedent — 8 mentions in 4 files.** Notion (1),
  Slack (2), Gmail (2), Excel (3). One of the eight is a **shipped source
  comment**, not docs: `richtext.css:112` ("which is what Slack and Gmail both
  do for this exact toggle") — it ships in the package. The rest are
  `richtext.astro:401,410`, `staging.astro:150,151` and `data-table.astro:347`.
- **Design systems and ERP suites cited as design references — 45 mentions.**
  Tailwind (11), Fiori (10), SAP (9), Material (6), Carbon (4), Atlassian (1),
  Bootstrap (1), DaisyUI (1), Odoo (1), Salesforce (1). The last three are one
  sentence: `approval-workflow.css:158`, another shipped comment, citing how
  three ERP suites solve internal-vs-external remarks. These are load-bearing
  in a different
  way: LOOPS.md's own Research playbook *names them as the trusted sources to
  cite*, `/patterns/object-page` exists because of a Fiori floorplan spike, and
  the docs-IA ordering rule was decided by comparing four of them. Scrubbing
  these would delete the provenance of decisions this repo made deliberately.

*One instrument note, because it nearly went into this entry as a fact:* a
case-insensitive first pass reported **"Stripe: 19"**. Every one was `stripe` as
in a zebra row stripe. Word-boundary and case-sensitive matching is what makes
the counts above real; the tidy-looking 19 was the tell.

**This is a direction question, and direction has been the owner's in every
slice so far**, so nothing was scrubbed. The two populations plausibly want
opposite answers and a wake picking one unilaterally would either gut the
design-reference provenance or leave the instruction half-applied.

1. [x] **160.1 — OWNER CALL, DECIDED 2026-08-28: scrub population 1 only.** The consumer-app half looks like the same shape as the
       names already scrubbed and is small to fix (8 mentions, 4 files, one of
       them a shipped CSS comment). The design-system half is cited *as
       evidence* and the Research playbook tells wakes to cite exactly those.
       *Accept*: a recorded decision for **each population separately** —
       scrub-and-extend-the-denylist, or keep-with-a-stated-reason. Where the
       answer is scrub, the fix is the one `check-vendor-names.mjs` already
       states: describe the mechanism and keep the verdict, never delete the
       sentence. Where it is keep, the reason goes in that gate's header so the
       next wake reading the denylist does not re-raise this.
       **Finding either population already compliant is a satisfying outcome** —
       re-run the command above before acting; these counts are from
       2026-08-28 and the tree moves.

       **Grilled, and the two-population framing was wrong: there are FOUR**,
       three of which are kept. Re-running the command turned up a third and
       fourth kind this triage never saw:

       - **1 · UX precedent** (8 mentions, 4 files) — **SCRUBBED.** Each
         rewritten to the mechanism with the verdict intact, never deleted:
         "the settled convention in mainstream composers", "the user's
         spreadsheet — which beats any web grid at being a spreadsheet".
         One was a shipped CSS comment.
       - **2 · Design systems as evidence** — **KEPT.** LOOPS.md's Research
         playbook names those systems as trusted sources and tells wakes to
         cite exactly them; scrubbing would contradict the process that
         produced the citation.
       - **3 · INTEROP HAZARD** — **KEPT**, and this is the one the triage
         missed. 11 mentions, mostly `/getting-started/troubleshooting` and
         `/concepts/cascade`. The product name **is the reader's search term**:
         someone whose buttons went unstyled searches what they just
         installed, not "an unlayered reset" — they do not yet know their
         reset is unlayered. Describing the mechanism makes the page
         unfindable for the exact failure it exists to rescue.
       - **4 · ATTRIBUTION** — **KEPT on principle.** `tokens/scales.css`
         credits the MIT palette its 20 ranges seed from. An attribution is
         not a mention. Grilling it found a real gap alongside: that credit
         lived **only** in a generated CSS comment and was **absent from
         `packages/core/NOTICE`**, which carries the Lucide glyph credit. Now
         filed there, and the create-ui freshness gate (155) propagated the
         copy automatically.

       **Refused, after trying it and watching it fail: extending the
       denylist.** `slack` and `excel` are ordinary English on a
       case-insensitive word-boundary match — `slack` already appears twice in
       correct prose ("1px of slack"). `gmail` and `notion` looked safe, and
       adding them turned the build **red on four files**: `ROADMAP.md`, the
       archive, a grill snapshot and `loop-log.md` — every one the repo's own
       decision RECORD, which cannot say "these were scrubbed and here is why"
       without naming them. CLAUDE.md's removal trap in gate form: an
       assertion trippable by its own explanation. Scoping ROOTS away from the
       history was refused too — that is exactly where a regrowth would be
       argued for. So the scrub stands, the guard does not exist, and the
       gate's header now says so with the four populations spelled out.

## Slice 159 — Objective grill of Slices 151, 153, 157 (2026-08-28)

Rule 3 at 3/3. Full report:
`.roundtable/grill-objective-151-153-157-2026-08-28.md`.

**The window was half refusals** — 151.3 and 153.2 out of four Continue rounds,
against a base rate of 174 refused to 346 landed (33.5%) since 2026-08-19. The
two split cleanly: 151.3 was refused **on principle** with its premise intact,
153.2 because **its premise was false**. Neither failing premise (151.1's too,
just before this window) recorded the command that produced it, so the next
wake could not re-run the claim and had to re-derive it. 149.1 is the control
in the same window: same shape of error — its count was right, its
interpretation wrong for 3 of 4 screens — and it cost nothing, because its
Accept criteria said *"each of the four either uses `bo-progress` **or**
records a one-line reason it should not"*. The difference is one sentence in
the criteria, not care.

**Recorded as a writing rule** (appended to CLAUDE.md's existing
Accept-criterion section rather than given its own, because 158.2 has the
loop's prose growth open as an item): when an item's premise is itself a
measurement from an earlier wake, re-checking it is part of the criterion, and
the command goes next to the claim.

1. [x] **159.1 — DONE 2026-08-28. `report-reach` prints the verdict where one
       exists.**
       An `ADJUDICATED` map now carries the five verdicts, and every block the
       report names prints one line saying either the verdict or
       `NO VERDICT RECORDED: nobody has examined this zero yet.` — never a bare
       comma list, which is what read as an open question. The three
       file-upload blocks share ONE verdict and print on one line, grouped by
       the verdict text itself: repeating the identical paragraph three times
       made one finding look like three.

       **Not a third exemption bucket, as the item required.** Adjudicated
       blocks stay inside the `never composed` count. The header states why:
       `CANNOT_APPEAR` and `DEPRECATED` are stable facts, a verdict is a dated
       claim about the suite, so it stays in the count where the next reader
       re-tests it.

       **Each verdict was re-checked against measurement before being copied**
       from `.roundtable/grill-objective-149-152-2026-08-27.md`, and the
       commands are next to the claims in the script:

       - `bo-file-*` — `find examples/erp-suite -name "*.screen.mjs" -exec
         grep -ilE "attach|upload" {} \; | wc -l` → **0**, over **28** screen
         files. The grill said "all 27"; there are 27 module screens **plus the
         suite index**, which the script's own corpus comment already states.
         Zero either way, so the verdict stands — but the count in the entry is
         the measured one.
       - `bo-tree` — opener reads "Not for rows that carry data columns";
         `bo-tree-table` reaches **2** compositions to `bo-tree`'s **0**.
       - `bo-avatar-stack` — the promotion comment is real
         (`avatar/avatar.css:40`, found only case-insensitively — it is
         capitalised, and the first grep for the grill's lowercase quotation
         returned nothing); `bo-timeline` reaches **11**.

       **Accept (c) — reconciliation both ways — is red-proved, injection
       confirmed each time.** Giving a COMPOSED block a verdict prints
       `!! bo-timeline carries a verdict explaining its ZERO reach but IS
       composed 11x`; renaming an entry prints `!! … is not a shipped block`;
       removing `bo-tree`'s entry prints the `NO VERDICT RECORDED` line for a
       block that is genuinely in the zero list. **Accept (d)**: exit 0, no
       `process.exit` added, and it ran inside `docs:build` green.

       **Cloud wake — nothing visual.** This is one Node script that prints to
       stdout; it renders nothing and ships in no page. No screenshot was taken
       and none is owed.

       *Original finding:*
       Seven blocks have ever read zero reach, and **all seven are now
       adjudicated as not-a-defect** — 150.1 refused to gate this on the
       argument that a gate would be wrong "roughly a third of the time"; the
       measured figure is 7 of 7. But of the five still printed bare under
       "never composed", **zero carry their verdict in the output**: `bo-tree`
       and `bo-file-dropzone` have theirs in a header comment the reader of the
       report never sees, and `bo-avatar-stack` — the sharpest verdict of the
       seven, that the suite HAS the approval-chain scenario and renders it as a
       `bo-timeline` that overlapping discs would lose — is not in the script at
       all. A bare name reads as an open question, which is the state that
       produced 153.2.

       **Not a third exemption bucket.** These blocks are *adjudicated*, not
       exempt: a weaker, dated claim that can go stale in a way "is deprecated"
       cannot. Burying them in an exemption map would make the report print a
       serene zero, which this repo already treats as a defect.

       *Accept*: (a) every block the report names carries either a verdict or
       nothing-known, so a reader can tell examined from unexamined without
       opening the source; (b) the verdicts already written in
       `.roundtable/grill-objective-149-152-2026-08-27.md` are the source, not
       re-derived, and each is checked against measurement before being copied —
       `bo-file-dropzone`'s "no suite screen has an attachment flow" was
       re-verified this grill (`grep -rilE "attach|upload"` over all 27
       `*.screen.mjs` returns zero) and the criterion is that it agrees with
       what that command reports, not that it stays zero; (c) 153.1's both-ways
       reconciliation covers the new entries too — an adjudicated block that IS
       composed reports as stale; (d) the report still never fails the build.

2. [x] **159.2 — DONE 2026-08-28. P0: the mirror's RECOVERY path is what corrupts it.**
       **Fixed.** `parse_log_line` now takes `mode` from the left and
       `outcome`/`commit` from the RIGHT, joining whatever is between them back
       into the item — the item is the only field that may contain the
       separator. Red repro first, on the real line: before, `outcome` held
       *"edited' dirty marker). A context-window regex…"*, `commit_sha` held
       `"refused"`, and the item was truncated at `'Overdue`; after, all three
       are right and the item keeps `'Overdue · edited'` intact. The change
       touches only lines with more than the canonical arity — **1 of 974**,
       measured — so 973 rows parse byte-identically to before.

       `rebuild_from_log.py` now reconciles before it writes, and all three
       assertions were red-proved with the injection confirmed each time:
       (1) every `- ` bullet in the log must produce a row — injecting a
       parser that skips one line reports *"974 bullet line(s) … but only 973
       parsed"*; (2) every row after the enforcement boundary must carry an
       outcome `record_iteration.py` would accept — appending a `shipped` row
       dated 2026-08-28 names the line and refuses; (3) `parse_log_line`'s
       self-test runs on EVERY rebuild rather than behind a flag, and
       re-injecting the original left-positional parser fails it.

       **Validation moved AHEAD of the DROP** — not asked for, and the part
       worth keeping: refusing mid-insert would have left an *empty* mirror,
       which is a quieter kind of wrong than the row it exists to catch.
       Verified by injection: after the refusal the previous mirror still holds
       974 rows.

       The measured effect on the number this grill quotes: refusals since
       2026-08-19 read 174 before and 175 after, the recovered row being
       151.1's own refusal.

       *Original finding:*
       `_common.py` sets `SEP = " · "` and `parse_log_line` assigns the fields
       **positionally from the left**. 151.1's log line legitimately quotes
       list-report's dirty marker — `'Overdue · edited'` — so it has seven
       fields, and the rebuilt row holds a fragment of the item's prose in its
       `outcome` column. One line in 971, measured.

       **The write path is fine; the recovery path is the bug.**
       `record_iteration.py` builds the log line and the DB row from the same
       in-memory values, so the live insert was correct. The row only breaks
       when `rebuild_from_log.py` — *"the recovery/verify path … running it can
       never drift from the files"* — reads the markdown back. The storage
       doctrine says a mirror must be rebuildable from the files; here
       rebuilding is what breaks it.

       **Nothing was watching.** `check:loop-vocab` compares the vocabulary
       *documented* in CLAUDE.md and LOOPS.md against the Python constant. It
       never reads a row, so an outcome outside the vocabulary entirely sits in
       the mirror unnoticed — the failure the doctrine's own "a mirror must
       RECONCILE against its source and fail loudly" exists to prevent.

       Blast radius, checked rather than implied: `dispatch_status.py` reads
       `loop-log.md` directly, so the dispatcher counters are unaffected. What
       moves is anything counting by `outcome` — the refusal figure above is
       really 175/346.

       *Accept*: (a) the fixed-arity trailing fields are parsed from the RIGHT
       and the item is whatever is left in the middle, so an embedded separator
       cannot shift a column; (b) red-proved on the real line — rebuild before
       the fix reproduces the mangled `outcome`, after it the row's outcome is
       `refused` and the item retains `'Overdue · edited'` intact; (c) the
       rebuild reconciles against the vocabulary `record_iteration.py` enforces
       and **refuses to write** when a post-enforcement row falls outside it,
       naming the line — pre-2026-08-19 history keeps its `shipped`/`committed`
       vocabulary, which 153 already refused to rewrite; (d) the rebuilt row
       count still equals the number of log lines parsed, asserted not assumed.

**Refused: a gate for 157.3's "not where the edit was looking" shape.** 157.3
asserted no gate could have caught the RTL cell edge that survived 157.2. This
grill tried to build one, twice, and both instruments are recorded dead so they
are not rebuilt:

- **The split family** — a property declared by members of one attribute-value
  family living in both a comma group and a standalone rule. Red-proved: it
  does fire on the family at `3a995d1^`. But it fires on the *pre-condition*,
  before the bug exists — base rate **3 of 15 families today, 0 defects**, all
  three legitimate splits by value (an `error` row is danger-coloured, `dirty`
  and `warning` are warning-coloured; three density tiers hold three numbers).
- **The asymmetry** — a property declared for a proper subset of a family's
  values, which is what the bug looked like after 157.2. It reports **zero on
  the commit that carried the live bug**: 157.2 removed the danger and warning
  rules entirely, so the family had one surviving member, and a family of one
  cannot be asymmetric. On the healthy tree it flags 35 properties, 27 of them
  `[data-theme=*]` tokens the dark theme legitimately overrides. Noisy and
  blind at once.

157.3's answer was right, and now measured rather than asserted: the defect is
*the absence of an absence*, which source structure cannot express. The
`check:claims` case reading the computed shadow per marker in both directions is
the correct granularity. Fourth consecutive gate proposal refused on base rate
(94.11, the skip-list fork, the `var(--bo-*)` resolution gate, this).

## Slice 158 — Owner wishlist: simplicity is the key; clean up the content (2026-08-28)

**Owner:** *"i believe in simplicity is the key for the success. Less option for
more opportunity — (optimize, clean up the content)"*

This restates the Objective's **principle 2** almost verbatim, so it is not new
direction — it is the owner saying the principle is not being honoured in the
DOCS, where it has never really been applied. Principle 1 already carries the
exact test: *"Rethink when a docs explanation keeps growing to cover a surface —
the fix is simplifying the thing, never the prose."*

**Measured baseline — SUPERSEDED 2026-08-28, and the correction is the point.**
The original figures below were taken by an ad-hoc instrument that was never
written down, so nobody could re-run them. By the time 158.1 came up, 157.3 had
added +337 words to the page it leads with. Re-measuring is now a command:

```
npm run docs:build && npm run report:prose -w docs      # scripts/report-prose.mjs
```

```
118 documentation pages of 127 built · median 739 · mean 884 · total 104,367
```

**Twelve** pages exceed 2x the median (1,478), not seven:

| words | x median | page |
|---|---|---|
| 5,022 | 6.8 | `/components/data-table` |
| 3,805 | 5.1 | `/components/richtext` |
| 2,324 | 3.1 | `/concepts/which-pattern` |
| 2,213 | 3.0 | `/components/form` |
| 1,955 | 2.6 | `/patterns/editable-grid` |
| 1,941 | 2.6 | `/patterns/list-report` |
| 1,691 | 2.3 | `/components/calendar` |
| 1,561 | 2.1 | `/components/money` |
| 1,507 | 2.0 | `/components/combobox` |
| 1,490 | 2.0 | `/components/tabs` |
| 1,488 | 2.0 | `/concepts/layouts` |
| 1,485 | 2.0 | `/patterns/output-form` |

*Eight of the twelve figures above rose by exactly 1 when 158.1 landed, because
the `generated` badge added to `DsaScore` and to the which-pattern index is
itself a word inside `<main>`. The four that did not — editable-grid,
list-report, layouts, output-form — are the four with no `DsaScore` block, which
is the check that the badge went where it was meant to. The set and the order
did not move. 158.1's verdicts quote the run that opened its round, which is the
one WITH the badge, so the two tables differ by that word and nothing else.*

**Why the page count moved, reconciled exactly rather than waved at.** 107 was
41 components + 41 patterns + 16 concepts + 8 getting-started + the root; adding
`/base/` (6) and `/reference/` (5) — ordinary reader-facing documentation the
old instrument left out — is exactly 118. The RF screens (6) and the iframe
demo fragments (3) stay excluded with the reason stated in the script: they are
rendered artefacts, not pages a reader reads, and leaving them in drags the
median down and so inflates the outlier set. Beyond the page set the two
instruments are **not comparable at all**, since the old one's extraction rules
are unknown; the top seven rank identically, which is corroboration and not
equivalence.

**The new instrument's own first output was wrong twice**, per this repo's base
rate. Its chrome-exclusion alarm looked for a suspiciously repeated count and
was a detector that could not fail: swapping `<main>` for `<body>` put the whole
shell into every page (median 739 → 1034) and it stayed silent, because a
constant added to every page leaves them all still different. It now compares
`<body>` against `<main>` on the longest page — substitute one for the other and
the difference is exactly zero, which is what makes it falsifiable. Red-proved
both ways.

*Superseded original (2026-08-28, instrument unrecorded): 107 pages, median 775,
mean 916, total 98,062; seven outliers led by `/components/data-table` at 4,429.
An eighth entry, `/patterns/invoice-list` at an identical 1,897, was that
instrument following a redirect stub and counting `list-report` twice —
`report-prose` goes through `distPages`, which has skipped redirect stubs since
2026-08-18.*

**Own up to the trend first.** `apps/docs/src/pages` took **+482 / -90 lines in
24 hours**, nearly all of it mine, and `/concepts/layouts` alone took +283 —
pushing it to 1,550, exactly the 2x line. The owner is not describing a
historical problem; the loop is actively creating it.

1. [x] **158.1 — DONE 2026-08-28. Twelve verdicts, and three of them are
       against the INSTRUMENT rather than the page.**
       *Accept was*: for each page `report:prose` lists over 2x the median on
       the run that opens the round, a recorded verdict — **honest coverage**,
       **explanation covering complexity** (a roadmap item against the
       component), or **removable** (cut, with what went). Re-run the report
       first, per 159's rule.

       The opening run is the one below (12 pages over 1,478). Every verdict
       rests on a measured input, and each command is recorded so the next wake
       re-runs rather than re-derives:

       ```
       npm run docs:build && npm run report:prose -w docs   # totals, the three-way
                                       # split, and the per-family medians below
       ```

       **The three inputs that decided most of it.**

       - **A fifth to a third of every component outlier is GENERATED**, not
         authored — ApiTable + ClassRef + DsaScore + the which-pattern index.
         `report:prose` now prints `authored + generated` per outlier, so this
         is re-runnable. `DsaScore` was missing the `generated` badge its own
         header comment claims it follows, on all 38 scored pages; it gained
         one in this commit, which is what makes the split exact rather than a
         heading-text guess.
       - **The corpus median mixes families with different MANDATED shapes.**
         Family medians run 346 (`/base/`) to 1,023 (`/reference/`) — a 3x
         spread — because the pattern recipe requires an anatomy list, a data
         contract and a states table before an author writes a word, and
         `/getting-started/` has no recipe at all. Now printed per family.
         Taking 2x within each family also yields twelve pages, which is a
         coincidence: three swap in (`/base/motion/`, `/concepts/js-behaviors/`,
         `/concepts/design-language/`) and three swap out (`combobox`, `tabs`,
         `output-form`). The sets are printed, not the counts, for that reason.
       - **Nothing is removable because it is said elsewhere.** Swept every
         documentation page for sentences of ≥12 words appearing on more than
         one page, excluding badge-marked generated sections: **11 of 2,558**,
         and all eleven are either recipe boilerplate or a family rule stated
         deliberately on all three of amount/money/quantity. Zero removals is a
         suspicious result, so this is the detector that would have found one;
         it ran, and it found none.

       **The verdicts.** Words are from the opening run; `w/h2` is words per
       reader-visible chunk against a corpus median of 103; `surface` is
       classes + `data-*` hooks from `api.json`, against a median of 5 across
       40 components.

       1. `/components/data-table/` 5,023 (6.8x; 4,047 authored, 22 h2, 228
          w/h2) — **honest coverage.** It has the largest API surface in the
          framework (29, rank 1) and the longest page, which is the consistent
          direction. Its densest block is the 641-word marker guideline, which
          records why the leading edge exists, why a row shows at most one, and
          when *no* marker is right — decision prose of exactly the kind this
          slice refuses to gate. 157 *reduced* the marker set rather than
          growing it. No removable setting was identified; the page's own
          "the assembled screen lives in Patterns" and "editing lives in
          inline-editing" lines are what keep it from absorbing more.
       2. `/components/richtext/` 3,806 (5.2x; 2,946 authored, 16 h2, 238
          w/h2) — **honest coverage, and the one page where length is NOT
          explained by API size.** Surface 12 (rank 6) against a rank-2 page.
          **1,313 of its 2,946 authored words sit in four sections whose job
          is to say what it will not do**: why no engine and how to mount a
          real one inside the chrome (152, and it is where the two
          `execCommand` caveats a server-side sanitizer allowlist has to be
          written against are recorded), the four things the framework will
          never wire (322), "everything native gives you, and why you want
          less" (248), and "keyboard shortcuts — you already have them" (591).
          The length IS the
          product decision. Cutting it would leave a rich-text component with
          no stated limit, which is the failure mode a half-engine invites.
       3. `/concepts/which-pattern/` 2,325 (3.1x) — **not authored prose at
          all**: 2,015 of 2,325 words are generated from `patterns.json`, 87%.
          Its heading now carries the `generated` badge.
       4. `/components/form/` 2,214 (3.0x; 1,727 authored, 16 h2, 138 w/h2) —
          **honest coverage.** Surface 29 (rank 2, tied largest). Breadth of
          settings at near-median density per chunk.
       5. `/patterns/editable-grid/` 1,955 (2.6x; 13 h2, 150 w/h2) — **honest
          coverage.** One demo section per cell type, plus the recipe's
          mandated anatomy/contract/states. 2.3x within its own family.
       6. `/patterns/list-report/` 1,941 (2.6x; 9 h2, 216 w/h2) — **honest
          coverage.** 807 of its words are the two mandated sections (data
          contract 462, states 345), and LOOPS.md names this page the recipe's
          exemplar. Density is high because the mandated sections are dense.
       7. `/components/calendar/` 1,692 (2.3x; 1,263 authored, 11 h2) —
          **honest coverage.** Surface 5, exactly the median, so this is a
          long page for a small component — and three of its eleven chunks are
          refusals: where the week starts is your data not a setting, why no
          date-picker widget ships, and picking a date with no JavaScript.
          That is less-for-more being *argued*, which is the opposite of a
          component that grew.
       8. `/components/money/` 1,562 (2.1x; 1,124 authored, 16 h2, **98
          w/h2**) — **honest coverage.** Below the corpus median density with
          twice the median number of chunks: long by breadth, not by
          explanation.
       9. `/components/combobox/` 1,508 (2.0x; **992 authored**, 516
          generated = 34%, 16 h2, 94 w/h2) — **the instrument, not the page.**
          Its authored prose is 1.3x the median. It is in this list because a
          third of it is the page recipe's fixed cost.
       10. `/components/tabs/` 1,491 (2.0x; **530 words hidden at load**,
           36%) — **the instrument, not the page.** The page's demos build 24
           tab panels, each carrying a caption, and **21 of them are `hidden`
           at load** — a reader sees one per demo. Visible authored prose is
           roughly 580 words, well under the corpus median. The report now
           prints the hidden figure.
       11. `/concepts/layouts/` 1,488 (2.0x; 1,488 authored, **0 generated**,
           7 h2 = the median chunk count, 213 w/h2 = 2.1x the median density)
           — **honest coverage, and the one page to watch.** It is the only
           outlier with no generated fraction and above-median density, and it
           is where the owner's own +283-lines-in-24-hours delta landed. What
           landed, read: a `SHELLS × DEVICES` support matrix driven from
           in-file data, whose own source comment already refuses to restate
           the table in prose, plus the shell-spacing trap that composes two
           correct primitives into a zero-height scroller. Both carry
           measurements. Nothing to cut today; if it grows again without a
           matching data or defect change, that is the signal.
       12. `/patterns/output-form/` 1,485 (2.0x; 10 h2, 149 w/h2) — **honest
           coverage**, and not an outlier within its own family (2x = 1,670).
           Its two largest sections cover print behaviour no other page does.

       **Tally: 9 honest coverage, 3 instrument, 0 removable, 0 component
       rethink.** The zero on the last two is the part to be suspicious of, so
       it is the part with a detector behind it: the cross-page duplication
       sweep above found 11 repeated sentences in 2,558 and none of them cuttable,
       and the "explanation covering complexity" reading was tested against
       `api.json` surface rank rather than impression — it holds for
       data-table and form (rank 1 and 2 → pages 1 and 4) and fails for
       richtext and calendar, where the extra words are refusals, which is the
       framework arguing for less rather than documenting more.

2. [x] **158.2 — DONE 2026-08-28. The decision: a CADENCE, not a budget — and
       the number that decided it is that in eight days no page ever got
       shorter.**
       *Accept was*: a decision either way, recorded; refusing valid.

       **The premise re-checked first, per 159's rule, and it reproduces
       exactly.** It was recorded without a command, so here is the command:

       ```
       # the 24h window ending at the commit that wrote the claim (4b64f67,
       # 2026-08-27T16:37:22Z). ALL of apps/docs/src/pages, then one file:
       git log --no-merges --numstat --format='' \
           --since="2026-08-26T16:37:22+0000" --until="2026-08-27T16:37:22+0000" \
           -- apps/docs/src/pages | awk '{a+=$1;d+=$2} END{printf "+%d/-%d\n",a,d}'
       #   -> +482/-90            (the claim: +482/-90)
       #   same, restricted to concepts/layouts.astro -> +283/-51  (the claim: +283)
       ```

       **But lines were the wrong unit, and measuring the right one reversed the
       conclusion I expected.** The hypothesis on opening this was that +283
       lines to `/concepts/layouts` was mostly markup and in-file data — the
       support matrix, plus four copyable shell templates, and `report:prose`
       drops `<pre>` whole. Measured instead of assumed: over `0e43838..HEAD`
       that page's **reader-facing words went 808 → 1,488, +680**, and the whole
       `+589/-130` line delta across six pages produced **+2,020 reader-facing
       words**. Lines under-report here rather than over-report. The hypothesis
       was wrong and the owner's instinct was right.

       **The measurement that actually decides the item — nine daily builds.**
       One dist per day, the same current instrument every time, so only the
       content varies:

       ```
       for sha in a77a934 6ffdfd3 73561ef 07df19f 12f95a6 975fe45 ee826a4 3014ca0 HEAD; do
         rm -rf apps/docs/src && git checkout $sha -- apps/docs/src   # see the trap below
         rm -rf apps/docs/dist && npx astro build --root apps/docs
         # then per-page words via report-prose.mjs's exported proseParts()
       done
       ```

       | 00:00 UTC | pages | words | Δ | fixed-89 words | Δ |
       |---|---|---|---|---|---|
       | 08-20 | 89 | 51,051 | — | 51,051 | — |
       | 08-21 | 90 | 59,444 | +8,393 | 58,234 | +7,183 |
       | 08-22 | 92 | 64,115 | +4,671 | 60,915 | +2,681 |
       | 08-23 | 107 | 80,073 | +15,958 | 65,707 | +4,792 |
       | 08-24 | 121 | 95,450 | +15,377 | 73,118 | +7,411 |
       | 08-25 | 125 | 98,491 | +3,041 | 74,939 | +1,821 |
       | 08-26 | 126 | 101,513 | +3,022 | 75,637 | +698 |
       | 08-27 | 127 | 102,680 | +1,167 | 75,714 | +77 |
       | 08-28 | 127 | 104,606 | +1,926 | 77,080 | +1,366 |

       The corpus doubled, but **most of that is new pages** (89 → 127), which
       is a framework documenting more components and is not the finding. The
       finding is the fixed column: on the **89 pages present on all nine
       days**, prose rose **+51%**, and

       > **71 grew, 18 stayed flat, 0 ended shorter. The minimum 8-day delta
       > across all 89 pages is exactly 0**, and that holds at every threshold
       > tried (>0, >1, >5, >20, >50 words). Median page: **+212**.

       **Why that is not a dead comparator.** Pages *do* shrink day to day — 12
       did in the 08-21→22 window, worst `-52` on `/components/prose/`, and
       `/patterns/editable-grid/` is `-24` in the last window — so the
       comparison can and does report negative. The net is what never is:
       **positive in all eight windows.** Reconciled independently: this walk
       reports 104,606 words over 127 dist pages and `npm run report:prose -w
       docs` reports 104,408 over 118 after its `NOT_PROSE` filter — a 9-page,
       198-word difference that is exactly the excluded artefact pages.

       **The decision.**

       - **Refused, now with evidence rather than only reasoning: a word budget
         or gate.** 158 refused it up front on the argument that prose here
         carries decisions. The measurement makes it concrete — a budget would
         have fired on 71 of 89 pages, and the sentences it would push out are
         `/components/richtext/`'s four refusal sections and
         `/components/calendar/`'s three, which 158.1 already read and found to
         be the framework arguing for *less*.
       - **Adopted: `report:prose` joins `scan:dead-style` in Standardize's step
         1** (LOOPS.md). Every 4th Continue round, run it and record a verdict
         for any page over 2x its FAMILY median that has none. Existing
         instrument, existing dispatcher hook, existing precedent for a sweep
         that is deliberately not a gate — no new gate, no new file, no new
         ledger. The immediate queue is non-empty, which is the base-rate check
         this repo requires before shipping a mechanism: `/base/motion/`,
         `/concepts/js-behaviors/`, `/concepts/design-language/`.
       - **Why a cadence is the shape that fits.** A per-page justification test
         cannot ever produce a shrink: it is applied while the words are being
         written, when the answer is always yes. That is precisely how 158.1
         could return *9 honest coverage, 0 removable* on the levels while the
         direction was monotone. Nothing in the loop asks "should this come
         out?" on a page nobody is currently editing, and a cadence is the
         cheapest thing that does. Per CLAUDE.md 94.11 this is the **rubric a
         human scores**, chosen deliberately over a gate, and said so.

       **Three instruments were wrong before any of the above was true**, which
       is this repo's base rate holding at 3-for-3 in one wake:

       1. **The cloud container clones SHALLOW.** `git log --since=…24h…` over
          `apps/docs/src/pages` reported **+23,926/-39** — 50x the truth —
          because the graft boundary re-adds every file as new. The tell was a
          root commit dated one day ago with no parents. `git rev-parse
          --is-shallow-repository` is the check; `git fetch --unshallow origin`
          took 31 seconds. **Any git-history measurement taken in a cloud wake
          before that fetch is wrong and looks fine.**
       2. **`astro build` does not clear `dist`.** An older source tree built
          over a newer dist reported 127 pages for 91 sources — a hybrid corpus.
          The tell was the *identical* page count across eight different days.
          `rm -rf apps/docs/dist` first.
       3. **`git checkout <sha> -- <dir>` does not DELETE files absent from that
          tree.** It only adds and updates. So every historical build silently
          kept the 36 newer pages on top of the old ones. `rm -rf <dir> && git
          checkout <sha> -- <dir>` is the correct form, and the tree needs
          `git reset -- <paths>` afterwards for files the old tree had and HEAD
          does not, or they linger staged as added-then-deleted.

**Refused up front: a word-count budget or gate.** It is the obvious mechanism
and it is wrong here, for a reason this repo has already paid to learn. Prose in
this project **carries decisions** — every `wrongWhen`, every measured number,
every "we refused X because Y" exists so the next person does not re-derive it,
and CLAUDE.md is explicit that removing that reasoning is how the same mistakes
come back. A word budget cannot tell a recorded decision from padding, so it
would push the loop to delete exactly the sentences that earn their place, and
it would be satisfiable by moving words into a code comment where no gate looks.
The judgement is per page and it is human; measure it, do not gate it.

## Slice 157 — Owner: the dirty row says it twice (2026-08-27)

**Owner, on a screenshot of a dirty requisition line:** *"save on item level
doesn't make sense, need to be discrete"* → then, after the grill:
*"I still don't see a need. If need to keep for possible usecase, just icon only
without 'unsaved' — might be just show the background color for dirty row.
`[save icon] [x] icon`."*

**The grill's verdict, and why the mechanism survives.** Per-row commit is
load-bearing and the repo already argued it: `concepts/concurrency.astro:71` —
*"the editable grid saves per row precisely so one conflict is not a
screen-wide rollback."* A 422 lands on the row the user just touched, which is
also why `validation-summary` documents itself as **not** for per-row saves.
Slice 34 already measured this once and found this grid uses per-row save
**correctly**; `field-editor` was the misapplication and was rebuilt to one
form-level Save. And the alternative is not free: `data-row-edit="live"` ships
today but commits **per field**, and has already produced two save-integrity
bugs here (Cancel behaving as Save; a save-before-reformat persisting stale
precision) — both traced to committing with no explicit commit step.

**The owner's real finding stands, though, and it is a duplicated signal.** The
dirty row ALREADY carries the state on two visual channels — an amber tint
(`--bo-cell-bg: warning-subtle`) and a 3px inset left edge — and forced-colors
is handled, the `box-shadow` swapping to `border-inline-start: 3px solid
CanvasText`. The `Unsaved` badge repeats visually what the row already says,
and then Save and Cancel repeat it a third time by appearing at all.

**The catch that shapes the fix, from the framework's own comment**
(`data-table.css:476`): a tint is *"not a substitute for a programmatic
channel: pair the toned value with adjacent text/an aria-label carrying the
same meaning, the same as row-state's own badge-or-message requirement."*
`data-row-state` is a data attribute and is invisible to assistive tech, so the
badge is currently the ONLY thing that announces "unsaved". Deleting it without
re-homing that meaning would trade a visual duplicate for an accessibility
regression.

1. [x] **157.1 — icon-only row actions; the dirty state rides the row.**
       **Shipped**, and verified live in both themes: the row goes dirty with
       its amber inset edge, **no "Unsaved" text anywhere in the row**, and
       Save/Cancel are 24x24 icons whose centres sit 36px apart — clearing the
       24px spacing exception rather than relying on it narrowly.
       `check:target-size` and `check:forced-colors` both pass.
       **Not breaking after all.** The Accept criterion above predicted a
       Breaking CHANGELOG entry; the evidence says otherwise. `row-edit.ts`
       guards the badge with `if (badge)`, so consumer markup that still
       renders one keeps working — only this project's own recommended shape
       changed. Recorded as Changed, with the compatibility stated.
       Also landed the guide the owner asked for alongside it: a save-timing
       section on `/components/inline-editing` naming which model fits a row
       that is a record, a row that is one record's field, and a row that
       commits alone — plus what channel carries "dirty" and why colour is
       never the whole signal.
       Drop the `Unsaved` badge. Save and Cancel become icon-only, and the
       announced state moves onto the Save button's accessible name
       (`Save <row> — unsaved changes`), which is present only while the row is
       dirty. One element instead of two, and the state travels on the control
       you would act on.
       **No behavior change is needed** — `row-edit.ts` already guards the badge
       with `if (badge)`, so markup without one degrades cleanly. `row-edit.ts`'s
       documented markup contract and `RowEditActions.astro` both move.
       Needs a new `.bo-icon--save` glyph: verified, **none exists** — and
       `check-circle` is refused for this, because a tick on an ERP line reads
       as *approve*, which is a separate real action in this domain.
       *Accept*: (a) no visible `Unsaved` text anywhere in row-edit actions;
       (b) a screen reader still hears the state — asserted in `check-claims`
       on the accessible name, not on the markup; (c) `check:target-size`
       passes with two adjacent 24x24 controls (gap is `--bo-space-2` = 8px, so
       centres are 32px apart and clear the 24px spacing exception — confirmed
       by the gate, not by this arithmetic); (d) `check:forced-colors` still
       passes, since the tint is the channel that disappears there and the
       inset edge is the one that must not; (e) the CHANGELOG carries a
       **Breaking** entry — the documented row-edit markup contract changes
       shape, which the freeze-audit correction says is Breaking.

2. [x] **157.2 — the leading edge is a ROW marker; drop it at cell level.**
       **Shipped.** Verified live: all three tones render `box-shadow: none`
       with their tint intact, and the row stripe is untouched
       (`rgb(220,38,38) 3px inset` on an error row).
       `check:forced-colors` went 24 -> 21 live rules, exactly the three
       removed, and still passes. **The RTL count did NOT move** — the
       prediction in this item's Accept criteria was wrong: the row stripe is
       still a flip site, so six stays six. What moved is what the sixth site
       COVERS, and DESIGN.md's prose named the cell bar explicitly. The gate
       asserts only the number, so that sentence could have rotted silently;
       it now says so in the sentence itself.
       **Owner, 2026-08-27, on two screenshots:** *"for left border line, we
       don't need at the cell level but level row is ok. might not need all the
       case."*
       The defect is one visual doing two jobs. `td[data-tone="danger"|
       "warning"|"success"]` each carry the same `inset 3px` accent that
       `tr[data-row-state]` uses, so a red edge on an AMOUNT cell is
       indistinguishable from the marker meaning *this ROW is in a state* — and
       a dirty row holding a danger cell shows two 3px edges, three pixels
       apart in meaning. The tint is not the problem; the edge is.
       *Accept*: (a) `box-shadow` removed from all three `td[data-tone]` rules,
       tint retained; (b) the forced-colors block and the two RTL flip entries
       that exist ONLY to serve that cell shadow go with it — `check:rtl` counts
       flip sites and DESIGN.md's count moves in the same commit; (c)
       `check:forced-colors` still passes, and the loss is stated honestly: with
       no edge and no tint under HCM, a toned cell's ONLY channel is the
       adjacent text the doctrine already requires; (d) the row edge is
       untouched.

3. [x] **157.3 — write the guideline: when does a row show a marker at all?**
       **Shipped, and it found that 157.2 was not finished.** Writing the
       sentence "a cell tone is never an edge" meant checking it, and it was
       false in the shipped stylesheet: `[dir="rtl"] td[data-tone="success"]`
       survived 157.2 because it was a *standalone* rule while danger and
       warning were grouped into the row selectors the edit rewrote — so it
       was not where the edit was looking. Measured in a browser against
       `dist`, not read off the source: `rgb(34,197,94) -3px 0px 0px 0px inset`
       on an RTL success cell, `none` on every other tone and on every LTR
       cell. One direction, one tone out of three, one day inside the
       Unreleased window (never published). Removed.
       **No gate could have caught it, and that is the finding.** `check:rtl`
       keys its allowlist by FILE, and `data-table.css` legitimately still
       carries the row stripes, so a stale rule inside it is indistinguishable
       from the rules that belong there — the gate passed on the injected bug,
       confirmed by injection rather than assumed. The rule is stated per
       MARKER, so it is now asserted per marker: a `check:claims` case reads
       the computed shadow on all three tones and on a row state, in **both**
       directions. Red-proved on both halves (re-inject the RTL rule → red;
       zero the row stripe → red), and the injection was confirmed **in the
       DOM**, not by grep — a grep for the selector in the built CSS found
       nothing while the claim's own reading showed `x: -3`, which is the
       minified-spelling trap CLAUDE.md already records.
       **Cost, recorded rather than hidden:** the page 158.1 named as the
       site's longest got **+337 reader-facing words** (4,429 baseline, so
       ~+7.6%); `/components/inline-editing` got +57 for the cross-link.
       ~200 of those words are the guideline table itself. The stale
       "bar on the leading edge" section was *replaced*, not appended to —
       347 words removed — because 157.2 had falsified most of it. This is
       live input for 158.1's verdict on `/components/data-table`: the honest
       reading is that the page is longer *and* less wrong than before.
       **Owner:** *"might not need all the case. pls also write the clear
       guideline. when to show it."* Queued separately from 157.2 on the owner's
       instruction to land these one at a time — 157.2 is a CSS removal, this is
       the writing that makes the removal legible, and bundling them would hide
       a judgement call inside a diff.
       The question the guideline must answer plainly: a row can be dirty, in
       error, in warning; a cell can be toned; both used to shout. State which
       marker is correct for which case, that **one row shows at most one
       leading edge**, and that a cell tone is never an edge.
       *Accept*: lands on `/components/data-table` next to the row-state table;
       says what each marker MEANS, not just how to write it; names the case
       where NO marker is right (a value that is merely negative is not an
       error — `bo-amount` already colours it); and is reachable from
       `/components/inline-editing`'s save-timing section, which 157.1 added.
       *All four met*: `#markers` on `/components/data-table`, linked from the
       row-state demo caption above it and from inline-editing's save-timing
       section (both verified present in the BUILT html, with the `id` target,
       under the plain and the `DOCS_BASE` builds).
       **One drafted sentence was falsified by the source before it shipped**,
       which is the reason to check prose the same way as a number: the draft
       said a row that is both dirty and rejected shows *rejected*, "the
       blocking state wins". `row-edit.ts:122` says otherwise — `setDirty`
       writes `dirty` over `error` while the user types, and restores `error`
       on going clean if a cell is still `aria-invalid` (58.4's deliberate
       decision). The page now states the shipped behaviour.

## Slice 156 — Owner: a device guide for the shells, with a support matrix (2026-08-27)

**Owner ask:** *"add side menu for skeleton template, where provide guideline
for all possible layout for this UI framework — Desktop / Mobile / Tablet / RF
Scanner"*, refined after review to: *"might not be suitable for all device, so
pls indicate whether layout can support Desktop/Tablet/Mobile/RF."*

**Owner decisions, taken 2026-08-27 and binding on this slice:**
- **Device entry points, responsive truth.** The side menu names the four
  device classes, because that is how the question gets asked. The CONTENT
  says what is true underneath.
- **Extend `/concepts/layouts`**, do not fork a second page. Slice 152's
  `SHELLS` array already drives that page; the matrix extends it rather than
  duplicating the shell list.

**The finding that shaped it, verified before proposing anything.** This
framework is **container-query** responsive, not device-targeted:
`.bo-app-shell` declares `container-name: bo-shell`, and the only shell band in
the entire stylesheet is `@container bo-shell (max-width: 56rem)`, which
collapses `.bo-sidebar-nav` to a 3.25rem icon rail. It keys on the CONTAINER,
not the viewport, so an embedded shell responds correctly too.

So Desktop / Tablet / Mobile are **not three layouts** — they are one shell
answering to width. Shipping four parallel device-layout families would teach
consumers to write device-specific markup, which is precisely what the
container queries exist to avoid, and principle 2 refuses a second way to do
something that already works. The owner's refinement is what makes the ask
land correctly: the deliverable is a **support matrix**, not four layouts.

**RF Scanner is the one genuine exception** and must not be flattened into the
others: it has its own stylesheet (`rf-essentials.css`, 14 components, its own
floor gate), its own pattern family, and the App shell's own `wrongWhen` text
already names it — "a single dedicated task on a single-purpose device" where
persistent chrome is pure overhead.

1. [x] **156.1 — a shell x device support matrix, measured not asserted.**
       **Shipped.** Generated from `SHELLS`, so a new shell cannot appear
       without a row. Five `check-claims` cases re-drive the dimensional
       claims on every build; red-proved by replacing the rail's collapsed
       `inline-size` and confirming two cases fail on exactly that.
       **The measurement found something the ask did not anticipate**, and it
       is now the sharpest line on the page: **crossing the band gives content
       MORE room.** At 896px the rail drops 224px -> 52px, so `main` gains
       171px in the same breath the window narrowed — measured, a role home
       goes from 1 widget column at 897px to 2 at 896px. Test both sides of a
       band, not just the narrow end.
       **And one hard "not supported" that the owner's refinement is exactly
       why we looked for**: split master-detail's list pane is a fixed 22rem
       that never shrinks, so at 390px the detail pane measures **36px**. The
       framework already ships the answer — the offcanvas drawer on
       `/patterns/master-detail` — so the cell says which to use instead.
       Four shells (App shell, Role home, RF full-screen, Split master-detail)
       x four device classes, each cell one of *supported* / *supported, with
       what changes* / *not intended, use X instead*.
       **Every cell is either measured in a browser or traceable to a decision
       already recorded on the page.** The editorial cells come from each
       shell's existing `wrongWhen`; the behavioural ones get measured. No cell
       may be filled by reasoning about what the CSS probably does — this
       repo's most expensive mistakes are all confident claims about
       unmeasured behaviour.
       **Measure the container, not the viewport**, and not the docs chrome:
       every built docs page wraps its demo in the docs' OWN `.bo-app-shell`,
       so grepping a built page for shell classes measures the wrapper. That
       exact confusion has been recorded twice already.
       *Accept*: (a) the matrix is generated from the `SHELLS` array, not
       hand-written into markup, so a new shell cannot appear without a row;
       (b) each behavioural claim has a `check-claims` case driving a real
       browser at the width in question, red-proved; (c) no new component CSS
       and no new public class — this is documentation of shipped behaviour;
       (d) the page still passes page-shape, axe at both widths, and
       `check:layout`.

2. [x] **156.2 — the side menu, with device entry points.**
       **Shipped**, and it reuses what the docs already have rather than
       inventing a rail: the section registers in the page's own "on this
       page" nav, and an inline "Jump to a device" row lands on four sections
       built from the same `DEVICES` array as the matrix, so the two cannot
       disagree. Verified live: all four anchors resolve at 1440 and 390, in
       both themes, with no page-level overflow.
       **The 390px answer turned out to matter more than expected.** The
       matrix is a 5-column table, which is genuinely cramped on a phone even
       scrolling inside its own container — so the per-device sections carry
       the mobile read, and they were rewritten to answer a DIFFERENT question
       rather than restate the table: they list only what you can reach for
       there, mark "only if" for the conditional ones, and collapse everything
       ruled out into one redirect line.
       An in-page menu on `/concepts/layouts` whose entries are Desktop,
       Tablet, Mobile and RF Scanner, each landing on a section that states
       which shells work there, what changes at that width, and which
       container query drives it.
       *Accept*: entries resolve to real sections; the menu is built from the
       same data as the matrix so the two cannot disagree; keyboard reachable
       and announced; works at 390px, where a side menu is itself a layout
       problem — if it cannot be made to work there it becomes a top menu, and
       that decision is recorded rather than quietly dropped.

**Explicitly NOT in this slice**: any per-device CSS, any device-specific
shell, any new breakpoint. If the matrix turns up a cell that genuinely is not
supported and should be, that is a finding for triage — not a licence to add a
layout inside a documentation slice.

## Slice 155 — Two drift risks in `create-ui`, found by explaining it (2026-08-27)

**Input**: the owner asked what `@busy-office/ui` and `@busy-office/create-ui`
are to each other. Answering it meant reading the scaffolder, and reading it
surfaced two things nothing keeps honest. Neither is broken **today** — both
are latent drift, so neither is P0, and both queue behind the older items.

Worth noting how they were found: not by a sweep looking for problems, but by
having to explain a thing precisely. That is the third time this has produced a
real finding, and it is cheaper than any detector.

1. [x] **155.1 — the scaffold's framework pin is unchecked, and the gate that
       looks like it covers it steps around it.**
       `create-ui/index.mjs:58` writes `dependencies: { '@busy-office/ui':
       '^0.5.0' }` as a hardcoded string, while the real version lives in
       `packages/core/package.json`. It is correct right now (both read 0.5.0)
       and nothing keeps it correct — no gate reads it.
       **The confusing part, and the reason this is worth an item rather than a
       one-line fix**: `check:quickstart` DOES run the scaffolder for real
       (arm 2, roadmap 148.2) and boots the generated project. But it installs
       with `npm i --no-save <locally packed tarball>`, which resolves nothing
       from the registry — so the generated `dependencies` entry is never
       exercised. The gate proves the scaffold works while being structurally
       incapable of noticing the pin is stale. That is this repo's most-recorded
       defect class wearing a passing gate as a disguise.
       *Accept*: the pin is derived from `packages/core/package.json` rather
       than written by hand, OR a check asserts the two agree and fails when
       they do not. Red-prove it by bumping core's version and confirming the
       check goes red — asserting on the generated `package.json`, not on the
       source string that writes it.

2. [x] **155.2 — `packages/create-ui/NOTICE` is a byte-identical hand copy of
       `packages/core/NOTICE`.**
       Verified with `diff`: identical. `create-ui/build.mjs` snapshots the
       template screen and never touches NOTICE, so nothing regenerates or
       reconciles it — the second copy goes stale the moment core's third-party
       notices change, and a stale attribution file is the kind of small wrong
       that is embarrassing rather than merely untidy.
       Shipping *a* notice from the scaffolder is defensible (the generated
       project pulls the CSS those notices describe), so the finding is the
       **hand copy**, not the file's existence. Deleting it is a valid outcome
       only if the scaffolded project genuinely does not redistribute the
       artwork — decide that deliberately, do not assume it.
       *Accept*: one source of truth — generated/copied at build time, or the
       file removed with the reason recorded. A check that the shipped copies
       agree, if two copies survive.

**Both landed together in one Standardize round, because they are one finding.**
Triaging them separately was the mistake: `create-ui` has **three** derived
artefacts — the template screen, the framework pin, the NOTICE — and the real
defect was that none had a freshness gate. The scan found the third and worst
one: **CI never ran `build -w @busy-office/create-ui` at all**, so
`template/screen.html` is generated from the ERP suite, committed, and nothing
re-derived or verified it. A suite screen could change and the scaffold would
ship a stale screen silently.

So `build.mjs` now owns all three and takes `--check` — the same shape
`generate-scales.mjs` and `stamp-readme.mjs` already use — and CI runs it
beside `check:quickstart`, with a comment saying why both are needed:
quickstart proves the scaffolder produces a running app but installs a local
tarball with `--no-save`, so it never resolves the pin the scaffold writes.
Red-proved on two independent drift paths: bumping core's version and
corrupting the NOTICE each fail with the artefact named and the fix stated;
restoring passes.

## Slice 154 — Triaged from a reference form-layout engine (2026-08-27)

**Input**: an 897-line form-layout engine from an open-source ERP desk
framework, dropped at the repo root as `layout.js`. Per the standing owner
instruction the product is not named anywhere here — what follows describes
mechanisms. Per `references-are-floors`, nothing below is adopted because the
reference does it; each mechanism is tested against the Objective and most are
refused. The file is **deliberately not committed** (third-party source, and
nothing in this repo should carry another project's code).

The reference builds one screen shape end to end: a metadata-driven detail form
split across **tabs**, each tab holding **collapsible sections**, with fields
shown/hidden/required by declarative `depends_on` expressions. That is the
dominant ERP form shape, and reading it against this framework surfaced one
real defect with two halves.

### The finding: this framework can hide the thing it just told you to fix

The reference does one small thing in `set_focus()` — before focusing a field it
calls `field.tab.set_active()` — and one more in its section refresh: a
collapsible section refuses to collapse while it holds a missing mandatory
field. Both encode the same rule: **never leave the user's next required action
inside a container they cannot see.**

`initValidationSummary()` does not, and the composition it fails on is one this
framework invites: `bo-tabs` + `bo-form-section` + the summary are all shipped,
all documented as composable. Verified in headless Chrome against the **shipped
`dist/` behavior**, with the injection asserted (both dist modules declare a
top-level `let installed`, so a single concatenated script tag silently fails to
install — the first two runs of this repro measured nothing, and the assertion
is what caught it) and with a passing control (a visible field focuses fine, so
the detector can observe success as well as failure):

| markup | result |
|---|---|
| `required` inside `.bo-tabs__panel[hidden]` | `willValidate: true` — it blocks submit |
| `required` inside a closed `<details>` | `willValidate: true` — it blocks submit |
| summary link → hidden panel field | **`document.activeElement` is `(none)`; panel stays hidden** |
| summary link → closed-`<details>` field | **`document.activeElement` is `(none)`; details stays closed** |
| control: summary link → visible field | focuses correctly |

So the summary correctly *names* the field the user must fix and hands them a
link that does nothing. Two-channel signalling is intact; the repair path is
not. This is the framework failing principle 1's own list — focus is named there
as a hard problem the framework absorbs — and principle 3's accept test, since
the behavior does not survive a context it was not designed for.

**The counter-argument, recorded so this can be argued with:** no shipped docs
page composes tabs with a required field, so nothing on the site is currently
broken. It is still a defect in published code (0.5.0 on npm) that consumers
compose themselves, and it is silent — no throw, no console warning on the
`novalidate` path.

1. [x] **154.1 — P0: reveal a focus target's containers before focusing it.**
       **Shipped** as `reveal(el)` in `utils/`, exported. The repro inverts:
       all three containers open, focus lands on the field, `aria-selected`
       and `aria-expanded` follow. Red-proved — removing the `reveal(field)`
       call and rebuilding turns `check:claims` red on exactly that case, with
       the built dist confirmed to no longer contain it.
       **A THIRD container turned up while building, and it fails worse.**
       The item named two. `.bo-widget__collapse[data-state="closed"]` clips
       instead of un-rendering, so `.focus()` SUCCEEDS and moves focus into a
       0px `overflow: hidden` box — invisible, with no way for the user to find
       where focus went. A reveal that handled only the two named containers
       would have looked complete and left the worst case live.
       **Two of this repo's own traps recurred, both caught by assertions
       rather than by review**: the repro's first two runs measured nothing
       (both dist modules declare a top-level `let installed`, so one
       concatenated script tag silently failed to install), and the first fix
       reported success while doing nothing (the tabs delegation matches
       `.bo-tabs__tab[role=tab]`, so pressing a tab without the class never
       activated anything). `reveal` now VERIFIES the press and falls back,
       which is the general form of that lesson.
       One general mechanism, not a fix inside `validation-summary`: given an
       element, open every ancestor that hides it — a closed `<details>`, an
       inactive `[role=tabpanel][hidden]` (activating its tab, so `aria-selected`
       and roving tabindex stay correct) — then focus. `validation-summary` is
       the first caller; any in-page fragment link is the second, which is what
       makes it general rather than a one-off.
       *Accept*: (a) the repro above inverts — after a summary-link click the
       hidden-panel field and the closed-`<details>` field are each
       `document.activeElement`, the panel is no longer `[hidden]`, and its tab
       reads `aria-selected="true"`; (b) the visible-field control still passes;
       (c) a case in `check-claims.mjs` drives real events and goes red when the
       reveal step is removed — red-proved by asserting the DOM, not the source;
       (d) no new component CSS, and no widening of any public class surface.

2. [x] **154.2 — P0: the canonical markup a reader copies is inert.**
       **Shipped.** The copy block now carries `novalidate`, the page says
       outright that it is required and why, and a `check:claims` case proves
       the claim by cloning the real form, removing the attribute, and
       submitting: the summary stays hidden and lists nothing.
       **The check's own first run was wrong** in the way this repo keeps
       recording — it asserted `entries === 0` on a clone that had inherited
       the previous case's populated list, so "4 entries" was the earlier
       test's output, not this one's.
       Corrected while building: the loop's own case B first asserted a fix
       that should not exist. The browser is RIGHT to block an invalid submit
       before `submit` fires; 154.2's fix is documentation, so the assertion
       now pins the documented reality instead of demanding code change it.
       `/patterns/validation-summary`'s live demo carries `novalidate`; the
       copy-paste `Markup` block at that page's end does not. Verified: with the
       behavior correctly installed and no `novalidate`, `summaryShown` is
       `false` and the summary lists nothing — the browser's interactive
       validation blocks the `submit` event from ever firing, so the behavior
       never runs. All the user gets is a console error
       (`An invalid form control with name='terms' is not focusable`) and a form
       that refuses to submit with no visible reason. The page's own States
       table already says the form carries `novalidate`; the block a reader
       actually copies is the one that omits it.
       *Accept*: the canonical block matches the demo it documents, and a check
       asserts the built page's copyable markup carries `novalidate` — so the
       two cannot drift apart again silently.

### Refused, with reasons

- **Tab-key rewritten to walk "next eligible field"** (skip hidden/read-only,
  auto-open a child grid, land on the primary button at the end). Refused on
  principle 1: it replaces the one contract every user already brings with them
  with a bespoke one, and correct use requires knowing rules that live nowhere
  on screen. The framework's job is to make the native order *correct* — which
  is 154.1 — not to take the key over.
- **Alt+hover reveals field names.** Developer tooling, not product UI, and it
  presumes a metadata model this framework deliberately does not have.
- **A form message block taking a colour name** (`show_message(html, "red")`).
  Already shipped as `bo-alert`, and better: a colour-named API is the exact
  anti-pattern the tone system refuses, since colour alone is one channel.
- **Auto-hiding a section whose fields are all hidden.** `:has()` makes it a
  one-liner, which is why it is tempting, but it serves exactly one scenario
  (server-driven conditional fields) — principle 2 refuses that on sight — and
  it makes a component silently restructure markup the consumer owns. The
  consumer hides the section when it hides the fields.
- **A tab strip that hides on scroll-down and reappears on scroll-up.**
  Direction-driven chrome motion, and `object-page`'s anchor-nav already
  answers "where am I in a long record" without moving anything.

### Not refused, not queued — one open question

The reference's whole shape is a **tabbed detail form**, and no pattern page
shows one: `detail-form` has no tabs, and `object-page` answers long records
with anchor-nav instead. Whether that is a genuine gap or a deliberate better
answer is a design call, not a build item, and it is the kind of question
`/design-grill` exists for. Recorded here rather than queued so it is not
half-decided by whoever picks it up.

## Slice 153 — Objective grill of Slices 149, 150, 152 (2026-08-27)

Rule 3 at 3/3, second Objective round of the day. The first produced the reach
finding that Slice 150 acted on; this one grills that action. Full report:
`.roundtable/grill-objective-149-152-2026-08-27.md`.

**The headline: a gate on zero reach would have been wrong 6 times out of 7.**
150.1 refused to gate it on the argument that zero reach has three meanings and
a gate "would be wrong roughly a third of the time". Diagnosing the two blocks
nobody had examined makes that argument far stronger, and adds a category:

| block | verdict |
|---|---|
| `bo-tree` | correctly refused at the point of use |
| `bo-avatar-stack` | correctly refused, and strongly — see below |
| `bo-toast-region` | **cannot appear: a NEW fourth meaning** — a runtime container an app injects into; a static screen has nothing to inject |
| `bo-date` | reached-for failure — **the one real defect** |
| `bo-file-dropzone`/`__input`/`__list` | instrument gap: no suite screen has an attachment flow |

**`bo-avatar-stack` is the sharpest of these.** Its CSS comment says it was
promoted by the *"approval-chain 'who's next'"* scenario — and the suite HAS
that scenario. `p2p/purchase-order` renders the chain as a `bo-timeline` with
named steps, `data-state` done/current/pending, timestamps and "waiting 2 days".
Overlapping discs would lose every one of those. The component is fine; the
screen made the better call. Suitability-beats-reuse, twice over.

1. [x] **153.1 — teach `report-reach` the fourth meaning.**
       A runtime container cannot appear in a composition corpus, so listing
       `bo-toast-region` beside `bo-date` invites the reader to treat them as the
       same finding.
       *Accept*: the report separates "cannot appear" from "never composed", with
       the membership stated in the script rather than inferred; still never
       fails the build.

       **Shipped.** "never composed" drops 7 -> 6 and `bo-toast-region` moves to
       its own "cannot appear" line carrying its reason. Membership is a
       hand-kept `CANNOT_APPEAR` map, not a matcher — every heuristic this
       project has written to recognise a category of class has eventually been
       fooled, and "is this a runtime container" is exactly the judgement a
       regex would get wrong quietly.
       **The exemption reconciles against reality, both ways**, which the item
       did not ask for and is the part that stops the list rotting: a listed
       block that IS composed reports as a stale entry, and one that is not a
       shipped block at all reports as renamed/removed. Red-proved on both
       paths (`bo-btn` → "IS composed 58x"; a fabricated name → "not a shipped
       block"), and exit stays 0 in every case — it reports, it never fails.
       Membership was evidenced rather than assumed: the docs markup is an
       empty `<div class="bo-toast-region" role="status" aria-live="polite">`
       followed by "Server/HTMX/JS injects:". Checked all 61 blocks for other
       runtime containers; `bo-toast-region` is the only one.

2. [x] **153.2 — REFUSED: the premise was inverted. `bo-date` is DEPRECATED.**
       The item said 21 of 27 suite screens render a date as a plain string and
       that "the screens change, not the component". Both halves are wrong, and
       building it would have made the framework worse.

       **`bo-date` has been deprecated since 2026-08-19 (roadmap 45.3)**,
       confirmed in three independent places: the CSS comment, `CHANGELOG:646`,
       and `/components/date`, which says outright *"Deprecated … this is a
       deprecation, not a deletion."* Its own notice prescribes composing
       `.bo-cluster` + `.bo-u-tabular` instead. Adopting it into 21 screens
       would have spread a class the framework is retiring.

       **And the screens were already right.** The suite uses the prescribed
       replacement **349 times**, and the dates the grill flagged are rendered
       `<td class="bo-u-tabular">01 Oct</td>` — the grill matched the STRING
       `'01 Oct'` without looking at its markup, so it read correctly-composed
       dates as plain ones.

       So zero reach on `bo-date` was never a defect; it is the deprecation
       working exactly as designed. This is the second grill finding in two days
       to die to one question, and both times the question was *is this signal
       present in things I am not counting?*

       **Fixed so it cannot recur**: `report-reach` gains a fifth category,
       **deprecated — SHOULD read zero, and does**, alongside 153.1's "cannot
       appear". "Never composed" drops 7 → 5 and now lists only genuine
       candidates. Same discipline as 153.1: an explicit map with its reason,
       reconciled against measurement so a block that is deprecated but still
       composed reports as stale. Red-proved (`bo-badge` → "IS composed 64x");
       exit stays 0.

**Also recorded: an instrument raised a 37.7% alarm that died to one question.**
A first query said 356 of 944 `loops.db` rows carry an outcome outside the
enforced vocabulary. But 139 are `shipped`, a vocabulary CLAUDE.md already
documents as rejected; the newest offender is 2026-08-19, so nothing has leaked
since enforcement; the log carries the same values, so the mirror is faithful;
nothing queries `outcome` to decide anything; and the one risk worth testing —
a silent undercount of refusals — is **1 row in 167**. Second time today an
instrument's first output misled, after the reconciliation command that reported
zero uses of `bo-data-table`.

**Refused**: gating zero reach (re-refused, 6-of-7 wrong); backfilling the
pre-2026-08-19 outcomes — rewriting reviewed history to satisfy a rule that did
not exist when it was written, to fix 1 row in 167, inverts the doctrine.

**Measured**: in the reliable window (584 rows), **166 refused against 334
landed** — a third of substantive outcomes are refusals. The Objective says
refusing is valid; this is evidence the loop behaves that way rather than only
saying so.

## Slice 152 — Owner wishlist: show every layout as a skeleton template (2026-08-27)

Owner: *"add section for all possible layout (using skeleton template) so it is
easier for AI or human to reference to."*

**The hole is real and specific.** `concepts/layouts` already maps the four
shells — App shell, Role home, RF full-screen, Split master-detail — with
decision questions and wrong-choice guidance. It contains **zero skeletons**. It
tells a reader which shell to pick and never shows what one looks like, so the
structure has to be inferred from prose or by opening a live screen.

1. [x] **152.1 — DONE 2026-08-27. A copyable template per shell, and the page now hand-maintains LESS than before.**
       Each of the four gets a `bo-skeleton` wireframe **and** its structural
       markup, rendered from ONE string through the existing `Demo` component —
       the recipe's own rule, never write the preview and the code twice.

       *Accept*: **zero new CSS** (wireframes are built from `bo-skeleton`,
       `bo-stack`, `bo-cluster`, `bo-grid`, which all ship); `check-markup`
       passes, which it will only do if every class in the wireframe is real —
       that is what stops a decorative drawing drifting from the framework; and
       the page does **not** grow a fifth taxonomy.

       **It must REDUCE duplication, not add to it.** The four shells are
       currently hand-written **twice** on that page — once in a "what it
       answers" table and once in a "wrong when…" table — with no data source
       behind either. Deriving all three surfaces (both tables + the new
       wireframes) from one array at the top of the page is the design; a third
       hand-written list would be exactly the drift this project keeps paying
       for. Net effect should be *less* hand-maintained prose than before.

       **Bounded deliberately.** "All possible layouts" is unbounded; the four
       shells are not. This documents the shells that exist — it does not invent
       new ones, and a screen that fits none of the four is a new shell
       proposal, which the page already says.

       **Shipped as STRUCTURE, not a rendering — and that was a finding, not a
       shortcut.** A live `.bo-app-shell` cannot be previewed on this page: it
       *is* the page's own shell, and nesting one would fight the real one for
       the viewport. `base/primitives` had already reached that conclusion and
       shows the shell as code with placeholders; this follows that precedent
       for all four rather than inventing a drawing that would drift. It is also
       the form an agent can act on — something to copy, not a picture to
       interpret, which is what the owner's ask was for.

       **The duplication went DOWN.** One `SHELLS` array now feeds the
       "what it answers" table, the "wrong when" table and the four templates;
       the first two were hand-written twice with no source behind either. Adding
       a third hand-written list was the obvious way to do this and the wrong one.

       **`check-markup` is what stops the templates drifting** — 88,550 `bo-*`
       uses validated, and the build fails on an invented class or `data-*`
       value. The one non-framework class is *named as such in the markup*:
       `your-split`, because **no split primitive ships**. That was discovered
       while writing the template — `/patterns/master-detail` draws its split
       with a page-local `md-split` class that exists nowhere in the framework.
       A shell listed as one of the four has no primitive behind it, and the
       page now says so instead of implying otherwise.

       Verified live at 1440 and 390, both themes, no sideways scroll.

**Why this is worth doing, stated as the Objective would.** *Simplicity*: a
reader picks a shell by seeing it rather than parsing three paragraphs.
*Less for more*: one array feeds three surfaces that are hand-maintained today.
*Reusability*: the copyable template is the thing an agent or a person actually
starts from — the same reason the screen kit serves raw markup rather than
describing it.

**Watch item, recorded because it is the likeliest failure**: a wireframe is a
picture of a layout, and pictures drift. `check-markup` catches invented
classes but cannot catch a wireframe that stops resembling the shell it names.
If that drift appears, the answer is to generate the wireframe from the shell's
real markup, not to hand-correct the picture.

## Slice 151 — Owner wishlist: learn from a mainstream list product (2026-08-27)

Owner supplied a screenshot of a widely-used enterprise list/tracker product
(change-request tracker: module, category, priority, status, assignee, due date)
and asked what to learn from it. Read as primary evidence — an actual screen in
use, which is stronger than either research run.

**Three of its mechanisms are already covered here, two of them better.** Its
filter chips read `Module: FI ×`; ours read `Status: Pending` with
`aria-label="Remove filter Status: Pending"`, so a screen reader hears what the
code *means* — the reference's bare two-letter chip does not carry that. Column
headers already have `data-context-menu` (sort). The command-bar shape —
primary action first, then verbs, then an overflow `…` — is
`/patterns/command-bar`. Status pills are word + tone in both.

1. [x] **151.1 — REFUSED 2026-08-27, ALREADY COVERED. The claim was wrong, and a broken detector made it.**
       This item said saved views were *"the single biggest thing in the
       screenshot the framework has no answer for"*, citing a grep that found no
       saved-view concept on any of the 39 pattern pages.

       **`/patterns/list-report` has had the entire mechanism all along**, and it
       is better than the reference on three counts:

       - Views are a `bo-segmented` radiogroup **carrying counts** — *All open ·
         312 · Mine · 18 · Overdue · 7*.
       - **A saved view is a URL** (`?view=…`), so it is shareable, bookmarkable
         and pasteable into a ticket. The switcher is a GET form of radios.
       - A "Views ▾" menu already offers *Save current filters as a view…*,
         Rename, Make default and Delete — the "+ Add view" the screenshot shows.

       Its States table goes further than anything proposed here: server-side
       resolution (*"a saved query living server-side, not a client blob"*),
       name-conflict handling (*"never auto-suffix to 'Mine (2)', which is how
       people end up with four views they cannot tell apart"*), permission
       fallback, and an empty state arguing that a one-option switcher is *"a
       label pretending to be a choice"*.

       **Even the dirty-state marker is there, and is better than the asterisk**:
       *"View selected, filters then changed — the chip stays selected but the
       screen says the view is modified ('Overdue · edited')"*. A **word**, not a
       glyph, so it is two-channel by default where a bare `*` is not.

       **The detector that produced the false negative is the finding.** The
       grep was `.{50}(saved view|add view|…).{80}` — a context-window regex,
       which silently requires **50 characters before the match on the same
       line**. `aria-label="Saved views"` sits near the start of its line, so it
       matched zero; plain `grep -c "Saved views"` finds it immediately. A
       regex written to show context became a filter on position.

       This cost more than a wasted grep: it put a confident, wrong claim into
       the roadmap, and the proposed build would have re-implemented a mechanism
       that already ships. **151.2 was re-verified with plain greps before being
       trusted** — it stands. 151.3 came from `api.json` rather than a regex and
       is unaffected.

2. [x] **151.2 — DONE 2026-08-27. A column can explain itself, and it uncovered a real framework bug.**
       The reference puts an ⓘ beside `Request Date` and `Due Date` carrying a
       per-column description. ERP headers are full of terms a newcomer cannot
       resolve — `CR/INC/PR`, `GR/IR`, `FSV`, `Dep date` all appear in this one
       screenshot — and the framework has no way to say what a column means.

       *Accept*: the explanation is reachable by **keyboard and touch**, not
       hover alone. That is the hard part and therefore the framework's job —
       a title-attribute tooltip is exactly the lazy answer to refuse, since it
       is invisible to touch and unreliable to assistive tech. Compose the
       existing popover rather than inventing a tooltip component.

       Shipped on `/components/data-table` with **zero new components**: a real
       `<button>` plus the `bo-dropdown__menu` popover, so Esc and light dismiss
       come from the platform. Only columns that need a description get the
       marker — a marker on all twelve headers is clutter. Gated by two new
       `check:claims` cases (real button, keyboard-openable, named, **and no
       `title` attribute**), red-proved by swapping in a `title`-tooltip span
       and watching it go red.

       **It uncovered a genuine framework bug, which is the suite model working
       on the docs for once.** A popover nested in a `<th>` inherited the
       header's `text-transform: uppercase`, `letter-spacing: 0.03em` and
       `white-space: nowrap`, so the sentence rendered ALL CAPS on one
       unwrappable line. **A top-layer panel is visually detached from its DOM
       parent and must not wear that parent's display typography** — fixed on
       `.bo-dropdown__menu` itself, since this was already wrong anywhere a menu
       sat inside styled text; a data-table header is just where it first showed.
       `.bo-data-table__sort-btn`'s deliberate `text-transform: inherit` is a
       sibling, not a descendant, and is unaffected.

       *A second attempted fix taught the cascade contract instead.* Adding
       `.bo-dropdown__menu p { max-inline-size: 34ch }` had no effect on the
       docs page: the computed value came out **736px**, because the docs' own
       **unlayered** `.docs-content :is(p, …)` rule sets `46rem` and unlayered
       styles beat any `@layer`. That is the framework's cascade contract
       working exactly as designed — the docs site is a consumer, and a consumer
       override winning is the point. The rule stays because it is right for
       consumers who do not override; it is not forced, because forcing it would
       break the contract to win a cosmetic argument.

       *Two greps failed on minified-vs-source spelling in one sitting*, in
       opposite directions: `bo-dropdown__menu p{` found nothing because the
       built CSS is **not** minified (`p {` with a space), which is the
       documented trap inverted. Searching for the VALUE (`34ch`) settled it.

3. [x] **151.3 — ordinal values: REFUSED, with the evidence and the reopen test.**
       The reference renders priority as **↓ Low** / **Normal** — an arrow
       glyph encoding *rank direction* on top of word and tone. `bo-badge` has
       five tones and **no ordinal channel**.

       A `--priority` modifier is refused on sight: principle 2 refuses a
       modifier serving exactly one scenario. The real question is whether
       *ordinality* is general here — priority, severity, risk, ABC class and
       ageing buckets are all ranked, not merely categorical, and tone alone
       says "bad" rather than "how much".

       *Accept*: a decision recorded either way. If it ships, it is one general
       mechanism (e.g. `data-rank` on the existing badge), never a per-domain
       modifier. **Refusing is a valid outcome** — the suite has 23 of 27
       screens showing badges and has never once asked for rank.

       **DECIDED 2026-08-28: refused**, and the measurement is far stronger than
       the note above. **168 badge instances across the 27 suite screens, and
       not one carries a ranked value.** The entire rank vocabulary in the
       framework is two occurrences: one `urgent` in the suite, and one
       `Urgent` in `/components/form` which is a **radio input label** — a
       choice being made, not a rank being displayed. So an ordinal channel
       would serve zero current scenarios, which principle 2 refuses more
       firmly than the "exactly one scenario" case it names, and principle 3's
       "≥2 real independent compositions" fails outright at zero.

       **The argument that settles it was already on the badge page**: *"the
       tone word IS the text, so the meaning never depends on the hue alone."*
       For a ranked value the word — "High", "Low" — **is** the ordinal
       channel: readable, sortable, translatable, announced. The two-channel
       rule means it must be present regardless, so a rank glyph would encode
       the same fact a second time. That is the whole refusal, and it does not
       depend on the suite's sample at all.

       **Steelmanned before refusing**: ordinality IS real in ERP (priority,
       severity, ABC class, ageing buckets) and tone genuinely cannot express
       it. The reference renders `↓ Low`. The counter is that the arrow adds a
       gradient, not information, unless the user must compare ranks ACROSS
       MANY ROWS at a glance — and that is now written on the badge page as the
       explicit reopen test, so the next person to want `--priority` finds the
       answer instead of re-deriving it.

**Refused: a filter control in the column header.** The reference offers filter
funnels per column. This framework already has two filtering surfaces — the
filter bar and `/patterns/filter-panel` — and principle 2 refuses "any second
way to do something that already works". A third entry point would be a third
place for a user to look and a third state to keep in sync. If a header entry
point is ever wanted, it must *open the existing filter surface*, not become one.

## Slice 150 — Objective grill of Slices 112, 130-148 (2026-08-27)

Dispatched by rule 3, **overdue at 17/3**. Full report:
`.roundtable/grill-objective-130-148-2026-08-27.md`.

**The finding: the ERP suite is blind in one direction.** All **21 gaps** it has
produced are *"this screen cannot be built from shipped CSS"* — which is what its
zero-CSS gate detects. A screen that **hand-rolls something the framework already
ships passes that gate perfectly**, because hand-rolling uses existing classes.
The instrument cannot see it by construction.

Two independent components with the same signature, which clears the evidence
gate (one alone would be a Hypothesis):

| component | reach across 27 suite screens | what the screens do instead |
|---|---|---|
| `bo-progress` | **1 of 27** | four hand-roll a threshold — but **only one was progress-shaped** (149.1, corrected 2026-08-27); the other three were right to do something else |
| `bo-date` | **0 of 27**, while **21 render a date** | plain strings — `'01 Oct'` |

**This fails Objective principle 3 measurably** — *"nothing ships for one screen;
a piece earns its place by surviving ≥2 real, independent compositions."* Three
components have never been composed into any screen or pattern: `bo-date`,
`bo-tree`, `bo-file-dropzone`/`__input`/`__list`. The bar exists to stop things
shipping for one screen; these shipped for **zero** and no gate asserts reach.

1. [x] **150.1 — DONE 2026-08-27. Reach is reported on every build, per BLOCK, and deliberately never fails.**
       Count each component's independent compositions across suite + patterns
       and print the low end.
       *Accept*: a reported number with the three meanings distinguished, and
       **no red build**. Zero reach is not by itself a defect — see below — so a
       hard gate would be wrong roughly a third of the time, and a gate that is
       wrong teaches evasion.

       `report-reach.mjs` prints on every docs build: **61 block classes across
       75 independent compositions** — 7 never composed
       (`bo-avatar-stack`, `bo-date`, `bo-file-dropzone`, `bo-file-input`,
       `bo-file-list`, `bo-toast-region`, `bo-tree`) and 10 used once. It always
       exits 0, and it prints the caveat next to the number so the figure cannot
       be quoted without it.

       **Counted per BLOCK, not per component**, because both component-level
       attempts in the grill were wrong in opposite directions: `api.json`'s
       `blocks` is not an ownership map (`richtext` claims `bo-btn` and scored
       58), and restricting to unique blocks made `button` read 4 — which is
       `bo-btn-group`'s reach. A block is a real class; its reach is unambiguous.

       **Component docs pages are excluded on purpose** — a component appearing
       on its own reference page is not a composition, and counting it would
       make every block look used, which is the 100%-is-a-defect shape this repo
       has hit before. It also guards the tidy numbers explicitly: all-zero
       means the matcher broke, all-used means the corpus is wrong, and it says
       so rather than printing a serene summary.

       Reconciled against independently known values before being trusted:
       `bo-data-table` 64, `bo-badge` 63, `bo-btn` 58. *The first reconciliation
       command was itself broken* — it reported zero for `bo-data-table`, which
       is obviously in nearly every screen — so the instrument checking the
       instrument needed checking too. The corpus count (47 pattern files vs
       `check:patterns-index`'s 39) is written into the script, because it
       legitimately disagrees and an unexplained number invites someone to
       "fix" it: 39 pattern pages + 7 standalone RF screens + `schedule/full`.

**The three zeros have three DIFFERENT causes, which a single number hides:**

- **`bo-date` — reached-for failure.** 21 screens show a date and none uses it.
  The framework's problem: a discoverability defect, same shape as `bo-progress`.
- **`bo-tree` — correctly refused at the point of use.** Its own opener says
  *"Not for rows that carry data columns"* and points at `tree-table`, which
  **is** used. Every hierarchy in the suite carries data columns, so `tree-table`
  rightly wins every time. This is **suitability-beats-reuse working as written**
  — a gate on zero reach would have flagged a component that is behaving
  correctly.
- **`bo-file-upload` — a gap in the INSTRUMENT.** No suite screen has an
  attachment flow at all, though attachments are a real ERP job. That says
  nothing about the component.

**Refused**: building anything for the three zeros (`bo-date` needs the *screens*
changed, not the component); a "usage" rubric dimension (the `ux`-dimension
mistake corrected in 145 and the entropy-report mistake refused in 148 — a
property that is true or false belongs in a measurement, not a score).

**Grading**: principle 1 (simplicity) holding — 147/148 let a consumer delete an
assembly step. Principle 2 (less for more) holding — 149.4 answered one
requirement two different ways with **zero new CSS** rather than shipping a
`--live` modifier; watch `tree`/`tree-table` as an adjacent-surfaces *Rethink*
trigger if a third hierarchy surface appears. Principle 3 (reusability)
**failing**, as measured above.

## Slice 149 — Research: dense numeric UI, and an open-source ERP desk (owner wishlist, 2026-08-26)

Owner wishlist: study two external references — a high-traffic public
market-data site (listing + a detail page) and an open-source ERP's desk UI —
for *"what is good to bring into this project"*. Two `/deep-research` runs, plus
primary reading of both (notes:
`.roundtable/research-dense-numeric-ui-2026-08-26.md`): both market-data pages
fetched directly, and the ERP desk's 42 stylesheet modules read from source
after its hosted demo would not log in and a second host 404'd.

**No external product is named in this repo's documents** (owner instruction,
2026-08-27). That costs a little reproducibility and is the owner's call. It
also changes nothing about the findings: the one that matters is normative and
cites the standard, and every refusal below turns on ERP suitability rather than
on who did it first.

**The headline is a correction to this slice's own first answer.** The initial
recommendation was to BUILD a value-against-threshold display, on the evidence
that four suite screens each invent one. Checking whether it already existed —
before writing the item, which is the only useful time — found **`bo-progress`**:
native `<progress>`, so value/max semantics and the progressbar role come from
the platform, with `--warning`/`--danger` variants whose own comment reads
*"threshold states (approaching / over budget)"*. It ships, it is documented,
and it is used on **1 of 27** suite screens.

So the finding is not a missing component. It is a **component nobody reaches
for** — which is a different problem with a much cheaper fix, and one the suite
was not built to detect. Every one of the 21 gaps the instrument has found so
far was *"the framework cannot express this"*. This is the first of the opposite
kind: *"it can, and the screen did it by hand anyway."* Worth stating plainly,
because it means the instrument has a blind spot, not just a backlog.

1. [x] **149.1 — DONE 2026-08-27. One screen adopted it, three refused — and the refusals found a distinction worth more than the adoption.**

       | screen | the pair | how it is expressed today |
       |---|---|---|
       | `prod/capacity` | load vs available | ad-hoc `bucket()` → three tone buckets |
       | `inv/stock-on-hand` | on-hand vs reorder point | ad-hoc `short = t < rop` boolean |
       | `crm/account` | open exposure vs credit limit | two unrelated `bo-kv` rows |
       | `crm/accounts` | the same, as a status | a `Credit hold` badge |

       *Accept*: each of the four either uses `bo-progress` **or** records a
       one-line reason it should not, the suite's zero-CSS gate stays green, and
       usage is re-measured afterwards. **Refusing per screen is a valid
       outcome** — a bar is not always the right reading of a threshold, and
       `crm/accounts` is a list where a badge may well beat 40 tiny bars.
       Converting all four because a count says so would be the re-photographing
       mistake the coverage doctrine already refuses.

       *The real question underneath*: why did four screens miss it? If the
       answer is discoverability, that is a docs finding, and it belongs with
       the external review's §7 worry about internal machinery outpacing user
       surface.

       **Outcome: 1 adopted, 3 refused.**

       - **`crm/account` — ADOPTED.** Open exposure $24,520 against a $150,000
         credit limit is consumption toward a **ceiling**, which is exactly what
         `<progress>` models. Paired with "16% of limit used" in text, because
         the fill alone is one channel. Two `bo-kv` rows that never related to
         each other now relate.
       - **`inv/stock-on-hand` — REFUSED, and this is the finding.** A reorder
         point is a **floor you must stay above**, not a ceiling you consume
         toward. `bo-progress` means value/max; on-hand 120 against a reorder
         point of 50 is not "240% used" — it is "safely above the line". Drawing
         it as a progress bar would be **semantically wrong**, not merely ugly.
       - **`prod/capacity` — REFUSED.** It is a matrix, work centre × week. A
         bar in every cell would be dozens of bars, and the existing treatment
         is already two-channel and better: tabular numerals, `data-tone` +
         `data-tone-text`, and a visually-hidden "— over capacity".
       - **`crm/accounts` — REFUSED.** A list. A `Credit hold` badge beats forty
         tiny bars, exactly as the Accept anticipated.

       **This CORRECTS the premise of the item, and of Slice 150's evidence.**
       The claim was "four screens hand-roll what `bo-progress` already does".
       Four screens do express a value against a bound ad-hoc — that part is
       true — but only **one** of them is progress-shaped. The other three were
       right to do something else. So the *reached-for failure* for
       `bo-progress` is one screen, not four.

       **Ceiling vs floor is a real distinction the framework had not named**,
       and it sharpens 149.2: a floor-threshold ("stay above") and a positional
       range ("sit between") are both genuinely outside `<progress>`, which only
       models consumption. Recorded here rather than built — `inv/stock-on-hand`
       already solves the floor case legibly with tone plus text, which is
       evidence that the floor case may need *nothing at all*.

2. [x] **149.2 — RECORDED 2026-08-27. The positional range (`low ——•—— high`) is genuinely uncovered, and is deliberately NOT queued.**
       The market-data reference's strongest numeric idea is a session low/high
       band with the current value positioned inside it, and an all-time high
       shown as a distance from now. This is **not** what `bo-progress` does:
       progress runs 0→max, where
       zero is meaningful; a range positions a value BETWEEN two bounds where
       zero is not on the scale at all.

       *Accept*: recorded as a candidate **with its condition stated, and no
       component built**. There is one plausible ERP use (a stock min/max band)
       and one use is not evidence — the same bar that refused the lot-trace
       genealogy graph. Build it when a second, different screen needs it.

3. [x] **149.3 — RECORDED 2026-08-27. The two-channel finding as positioning, kept OUT of the docs.**
       The market-data reference signals gain and loss with **colour alone**, on
       the most important number on the page — a WCAG 1.4.1 failure on a site
       with enormous traffic. The ERP desk's status dots do the same. This
       framework has forbidden that from the start.

       *Accept*: recorded in `.roundtable/` as evidence for the owner's
       "references are floors" rule. **Refused for the docs**, and the reason
       matters: naming a third party's accessibility failure on a component page
       is both unkind and perishable — they may fix it tomorrow — and "we beat
       X" is not something a person reading the badge page needs.

4. [x] **149.4 — DONE 2026-08-27. P0: patterns documented auto-updating content with no way to pause it.**
       Found by the `/deep-research` run, and it is the one thing in that report
       this project could not have reached by reading the reference's markup — the finding
       is **normative, not observed**. WCAG 2.2 SC 2.2.2 (Level A) has two
       bullets with deliberately different thresholds: moving/blinking/scrolling
       triggers only after five seconds, but **auto-updating information
       triggers from the first tick**. W3C's own worked example of content
       needing a control is a stock ticker, so the "essential" carve-out does
       not cover an ordinary live cell.

       Measured across the pattern pages:

       | pattern | documents an auto-update TRIGGER | offers pause/stop/frequency |
       |---|---|---|
       | `job-monitor` | `hx-trigger="every 30s"` | **no** |
       | `notification` | `hx-trigger="every 60s"` | **no** |
       | `record-detail` | no trigger — an endpoint *for* polling | n/a |
       | `inbox` | no trigger — polling named in passing | n/a |
       | `bulk-actions` | no trigger — polling named in passing | n/a |

       **THE FIRST COUNT HERE SAID "FOUR OF FOUR" AND WAS WRONG**, corrected
       before any code was written. The detector grepped
       `polling|every Ns|auto-refresh` and counted every *mention*, so a page
       saying "the polling behaviour above is the server's job" scored as a page
       that auto-updates. Two pages document a real trigger; three name polling
       without specifying one. The doctrine's question — *is this signal present
       in things I am not counting?* — has an inverse that bit here: **am I
       counting things that are not the signal?** The finding survives the
       correction (two pages, zero controls) but it is half the size first
       claimed, and the fix is correspondingly narrower.

       **The framework already knows the criterion**, which is what makes this
       sharp rather than an oversight. `components/state-patterns`
       cites *Pause, Stop, Hide* by name and answers it correctly for skeleton
       animation — *"the user's own OS preference is the control"*, with the
       five-second threshold quoted. It applied the criterion to the bullet that
       HAS a grace period and not to the bullet that does not.

       **`axe` cannot catch this**, which is why the sweep has been green
       throughout: "is there a control for this updating region" is not a
       DOM-inspectable property. This is a gap in what the gates can see, not a
       gate that broke.

       *Accept*: each page that documents a trigger documents a control, built from
       **`bo-segmented`** (`__input`/`__option` already ship) as a frequency
       choice rather than a bare pause — SC 2.2.2 accepts "control the frequency
       of the update", and for an ERP monitor *off / 30s / 5m* is a more useful
       control than a stop button. **Zero new CSS**; if it needs any, the design
       is wrong. Plus a gate: a pattern page documenting `hx-trigger="every`
       must also document its control, red-proved by removing one.

       *Not* a licence to add a live-number component. The framework does not
       ship polling and should not start; what it owes is the documented
       contract for patterns that do.

       **Done, and the two pages got DIFFERENT answers**, which is the part
       worth keeping. `job-monitor`'s updating region *is* the screen, so it
       ships the control: a `bo-segmented` radiogroup — *Off / 30s / 5m* — above
       the table, written into `hx-trigger`, with *Off* removing it. Zero new
       CSS, as the Accept required. `notification` polls a bell count that is
       app-shell chrome on every screen; bolting a widget next to the bell would
       be worse design, so it documents the control as a **settings preference**
       instead, by the same logic that lets an OS reduced-motion preference
       satisfy the criterion for animation. Applying one fix to both would have
       been the mechanical answer, not the right one.

       Gated by `check:autoupdate-control` (`@exact`): a pattern documenting
       `hx-trigger="every …"` must cite SC 2.2.2 or ship a control. It fires on
       the TRIGGER, not on the word "polling" — the three pages that name
       polling in passing are deliberately not caught. Red-proved by stripping
       all three control signals from `job-monitor` and confirming by grep that
       the strip landed while the trigger remained. It also **refuses to pass on
       an empty set**: if no page matches the trigger it exits non-zero rather
       than reporting a serene pass, because that zero would be indistinguishable
       from a broken pattern.

       Verified live at 1440 and 390, light and dark, on computed style rather
       than a screenshot. **Two instrument defects were caught in that check, in
       the order the doctrine predicts.** First, `querySelector('.bo-segmented')`
       measured the docs shell's own density switcher — *Compact / Comfortable /
       Spacious* — which is the "shell chrome is a real `bo-*` element" trap
       recorded in CLAUDE.md, hit again; scoped to the control's own
       `aria-labelledby`. Second, `emulateMediaFeatures` did **not** flip the
       theme, because this site honours an explicit `data-theme` from
       `localStorage`, so the first "dark" pass was light and would have been
       reported as two themes verified. Now the attribute is set and the body's
       computed background is asserted to differ (`rgb(249,250,251)` vs
       `rgb(15,17,21)`) — the theme is proven flipped, not assumed.

5. [x] **149.5 — RECORDED 2026-08-27. The status badge as a click-through filter: recorded, NOT queued.**
       From the second `/deep-research` run (104 agents). The ERP-desk reference
       declares a list row's status as a three-part tuple — *label, colour name,
       filter query* — so the pill renders its word and its tone (two-channel by
       construction, which this framework already requires) **and doubles as a
       one-click filter into the list**. Workflow state and draft/submitted reuse
       the same primitive rather than each inventing one.

       The click-through half is genuinely absent here: nothing in the docs
       documents narrowing a list by clicking a value.

       *Accept*: **recorded with its condition, no component built.** 23 of 27
       suite screens already show a status badge in a list, so the opportunity is
       everywhere — and in 21 recorded gaps the instrument has **never once asked
       for it**. That is the evidence that matters. A reference doing something
       is not a reason; *references are floors* cuts both ways, and the suite is
       what decides. Build it when a screen actually fights for it.

       If it is ever built, two things travel with it: the pill needs a real
       affordance (a clickable badge that looks identical to a decorative one is
       an accessibility problem, not a feature), and the filter it applies must
       appear in the existing `filters` chip rail so it is visible and
       removable — otherwise a list silently filters itself.

**What the second run found, and why most of it closes** (104 agents,
adversarial verification):

- **Count-annotated filter facets** — already covered. `/patterns/filter-panel`
  has a section headed *"Why the count on the trigger matters"*. Fifth
  "already covered" across the two runs.
- **Column widths from a data-type lookup table** (text 200px, numeric 100px,
  boolean 60px) — **refused**. That table exists because the reference's grid is
  virtualized and absolutely positioned, so it *must* know widths in advance. A
  CSS-first table lets content size itself; `__col--numeric` already carries the
  real need, which is alignment (`text-align: end`), not a pixel budget. Copying
  the workaround for someone else's architecture is the clearest form of
  photographing a reference.
- **A document dashboard as a framework-level region**, five named areas driven
  by per-doctype metadata — **out of scope**. The visual shape is
  `/patterns/object-page`; the metadata-driven assembly is app architecture, and
  a CSS framework that starts owning where content comes from has stopped being
  a CSS framework.
- **Navigation, keyboard shortcuts, saved filters, bulk actions and the activity
  timeline produced NO verified findings** — the run says so plainly, and one
  print-format claim was refuted 0-3. Recorded because an absence of evidence is
  worth writing down: nothing here should be cited later as "the reference does
  X" for those areas.

**Where the references are floors, with specifics** (evidence for 149.3, and the
CSS-first thesis's best independent support so far):

- The ERP desk's dense grid emits row elements carrying **no `role` or `aria-*`
  attributes at all**, buying scroll performance with virtualization tied to a
  fixed row height. This framework's equivalent is a real `<table>` with real
  semantics — and the axe sweep, `check-live-regions` and `check-data-hooks`
  gate it on every build.
- Its form stats row computes grid classes **in JavaScript** against a hardcoded
  twelve-column system, with no CSS rules behind them and no resize handling.
  This is the CSS-first argument stated by a counter-example: layout that a
  container query does for free, done in script, and wrong on resize.
- Its own maintainers filed the dense line-item table as a **readability bug**
  and shipped only a narrow fix. The screen ERP users spend the most time in is
  an open complaint in the reference implementation.

**What the deep-research run changed about the rest of this slice** (105 agents,
adversarial verification, `/private/tmp/…/tasks/w1xngxeu6.output`):

- **The pagination finding was already covered** — the transferable rule is
  "bounded page, real URL per page, always state which slice of what total".
  `.bo-pagination__info` ships and its canonical markup reads `1–25 of 312`.
  Fourth "already covered" of this research, and consistent with the rest.
- **The column CAP does not overturn the chooser refusal.** The reference bounds
  user column choice at 8-of-12 metrics with vendor presets. The cap is only
  meaningful if there is a chooser, and the chooser is refused above for a
  reason that still holds. Recorded because the *idea* is good and the verdict
  is unchanged, not because it is new evidence.
- **149.2's provenance is weaker than 149.2 says.** The verification pass could
  **not** confirm the detail page's ranges, stat tiles, tabs or converters from
  primary sources — those regions are client-hydrated and the only sources
  describing them were third-party clone tutorials. A direct page fetch is one
  observation; it did not survive adversarial checking. Since 149.2 was already
  refused-pending-a-second-use, nothing changes operationally — but the external
  citation should not be leaned on.
- **Sparklines, sticky rank/name columns and tick-flash colouring also failed
  verification.** The refusals below were reached independently and now rest on
  firmer ground: there was less there than the reference's reputation suggests.

**Refused, with reasons.** *Sparklines / row trend* — direct precedent, the
`prod/capacity` heatmap was refused for the same reason (no `bo-scale` utility
ships, and this is data-viz). *Column chooser* — the framework's
`__col--secondary`/`--tertiary` is the better ERP answer: the designer ranks
importance once, instead of every user configuring a personal view. *Number
abbreviation* (`1.56T`) — the reference can abbreviate because market cap needs
no precision; an ERP amount is auditable, and abbreviating an invoice total is a
defect dressed as a feature. *Gantt, onboarding tours* — app concerns, not
CSS-framework ones. *Group-by with counts* — the last surviving desk-UI
candidate, and it closes: `/patterns/filter-panel` already has a section headed
*"Why the count on the trigger matters"*.

**The demo repo the owner suggested was not run** — a bare fork, 1 commit, no
demo tooling of its own. Standing up a database, app server, queue and workers
to obtain evidence available more precisely from the source stylesheets is
20-60 minutes spent to learn less.

**A probe that was wrong first, recorded because it is the third instance
today**: the initial desk-UI mechanism sweep searched component class NAMES and
reported `workflow`, `comment`, `kanban`, `indicator` as missing. All four
exist under different names (`approval-workflow`, `bo-composer`,
`patterns/kanban`, `bo-badge` + `data-tone`). A naming-derived probe over a
framework that names things well is a detector that cannot pass.

*The second `/deep-research` run (the ERP desk) was still in its verification
phase when this was written; anything it adds gets triaged into this slice.*

## Slice 148 — Triaged from an external framework review (2026-08-26)

Owner supplied a full review (`.roundtable/external-review-2026-08-26.md`,
~8.7/10, recommendation **not to restart**). Triage:
`.roundtable/grill-external-review-2026-08-26.md`.

**It found a live P0 before this project did**, which is the headline: §8 named
a CI container failure with the file, the import and the fix. Real, mine, fixed
in `23f931d`. A review that reproduces its own claims earns the rest of its
findings a hearing.

**It changes no priorities, and saying so beats manufacturing agreement.** Its
P1 is 112.3, top of the owner-blocked list since 2026-08-23; its P2 is a
runnable starter, which 147.3 half-built today. The value is independent
confirmation of the existing direction plus a caught regression — not a new one.

1. [x] **148.1 — DONE 2026-08-26. 25 files, 129 tests, and the first attempt silently lost four.** (review §21).
       One `tests/*.test.ts` per behavior. Cheap, no counter-argument, and it
       cuts the context a coding agent must load to change one behavior.
       *Accept*: same test count passing, one file per behavior, and the
       behaviors-vs-`.d.ts` gate still green.

       2,350 lines → 25 files (`helpers.ts` carries `html`, `stubShowModal`
       and `pick`). Core build green, so the behaviors-vs-`.d.ts` gate holds.

       **The Accept criterion caught a silent loss, which is the whole reason
       it was written as a COUNT.** The first split produced 125 tests, not
       129, and one file truncated mid-block. Cause: a stray top-level
       `function pick()` sitting BETWEEN two `describe`s. The brace tracker
       treated its body as belonging to the previous block, mis-assigned every
       line after it, and `table-sum.test.ts` ended with "Unexpected end of
       file". Four tests vanished with it.

       A second symptom was more interesting than the bug: splitting
       `initGroupedNumber`'s two blocks into separate FILES made one fail —
       `expected '42' to be '42.00'`. They were sharing state through module
       order, which one file had hidden. Merging them by behavior fixed it, and
       the lesson is that "one file per behavior" is not the same as "one file
       per describe": the behavior is the unit that is actually independent.

       Redone by lifting the helper out FIRST so the remainder is header plus
       blocks only, with an assertion that every `it(` survives the carve —
       a bulk edit verified against a count, not against the diff.

2. [x] **148.2 — DONE 2026-08-26. `npm create @busy-office/ui` — one command, one running screen.** (review §22, its P2).
       **Name corrected on the owner's challenge, 2026-08-26** — the review
       said `npm create busy-office` and it was copied here unexamined.
       `npm create <x>` resolves to `create-<x>`, and every real scaffolder
       names the PRODUCT: `npm create vite` (package `vite`), `astro`,
       `svelte`. Here the product is `@busy-office/ui`; `busy-office` alone is
       the SCOPE, so scaffolding by it is `npm create meta` for React.

       Owner proposed `busy-office-ui`, which is right. Going one further to
       the scoped form for two reasons: it mirrors the install command
       character for character (`npm i @busy-office/ui` /
       `npm create @busy-office/ui`), which is the "one vocabulary" argument
       the review makes in §16; and the scope is already owned, so it cannot be
       squatted, where unscoped `create-busy-office-ui` is free for anyone
       today. Precedent: `npm create @eslint/config`. Checked: all three names
       are unregistered, so this is a free choice made on merit rather than
       availability. 147.3 proves
       the documented path with a CHECK; a human still assembles the page by
       hand. A scaffold that produces a running screen closes the gap between
       "the path works" and "I have an app". *Accept*: `npm create` in an empty
       directory yields a dev server showing a real screen, and the scaffold is
       exercised by `check:quickstart` rather than described.

       `@busy-office/create-ui`, 5.3 kB packed. Generates five files and a
       project with **zero dependencies beyond the framework** — the dev server
       is twenty lines of `node:http` written into the project, not a package,
       so `npm run dev` works offline and there is no toolchain to learn before
       seeing a screen. That is also what the framework itself claims to be.

       **The screen is copied, not authored.** It is snapshotted at build time
       from the ERP suite's `p2p/purchase-orders` — a work list, the commonest
       ERP screen and the one an agent reaches for a dashboard instead of
       (review §28). Hand-writing a starter screen would make the one page a
       newcomer sees the one page nobody gates.

       **No prompts, and that is a decision.** The review that asked for this
       also warned against building a DSL, and every question a wizard could
       ask is one the person cannot answer yet — they have not seen a screen.
       One command, one screen, the kit one link away.

       **Exercised, not described**, as the Accept required: `check:quickstart`
       grew a second arm that scaffolds, installs the local pack, spawns the
       project's OWN `server.mjs` — that file ships and would otherwise never
       run — loads it in a browser and asserts computed style. Red-proved twice:
       breaking the stylesheet path reports *"the scaffolded project renders
       unstyled"*, and scaffolding into a non-empty directory refuses rather
       than overwriting someone's work.

       **Publishing stays owner-triggered**, like every release.

3. [x] **148.3 — MEASURED 2026-08-26, REORGANISATION REFUSED. 3.7%, and no correctness gap.** (review §7 and
       §20 together, and the one place the review shifts weight). The docs
       `build` script is ~30 steps and implicitly owns validation that is not
       about docs. Three of six loop rounds on 2026-08-26 fixed INSTRUMENTS
       rather than the framework — the review's "the project may optimise the
       framework-development process more than the framework-user experience",
       with the loop log as evidence.
       *Accept*: a measured answer, not a refactor for its own sake — count what
       the docs build runs that is not about docs, and either move it or state
       why one chain is right. **Refusing to reorganise is a valid outcome**;
       the risk being named is real, and so is the cost of churn.

       **Measured.** Seven of 34 steps are meaningful with no docs site at all
       — `check-imports`, `check-loop-vocab`, `check-selftests`,
       `check-dist-walkers`, `check-paths`, `check-ci-ignores`,
       `check-slice-refs`. Together they cost **0.43s of an 11.70s build: 3.7%**.

       **And no correctness gap**, which was the more important half. The worry
       is that repo validation hides behind a docs build and stops running.
       It does not: the docs build always runs in CI, and nothing these seven
       read is in `paths-ignore`. A change touching only `scripts/` still gets
       them.

       So the reorganisation is **refused**. Moving them buys 0.43s and costs a
       new npm script, new CI wiring, and the risk this repo has hit repeatedly
       — a gate that moves somewhere it is not known to run. The docs container
       broke twice today for exactly that shape.

       **What the review is right about is the LEGIBILITY**, and that was free.
       34 flat `&&` steps hid what owned what. The seven now live behind
       `check:repo`, so the build reads
       `npm run check:repo && …` and a person debugging a failure can see
       instantly whether it was a docs problem or a repo problem. Measured
       cost: **11.68s vs 11.70s** — noise. Step count unchanged at 34.

       *An automated classifier was tried first and abandoned*: keying off what
       each script reads put `check-slice-refs` (reads ROADMAP) in "docs" and
       `copy-suite` (generates the kit) in "meta". Substrings cannot separate
       these. Classified by an explicit criterion instead — **would this gate
       still be meaningful if the docs did not exist?** — and the criterion is
       written down so the next person can disagree with it.

**Refused, recorded in the grill**: §8's manifest fix (the coupling is 28 copied
HTML pages, not the manifest — which already exists); §14's entropy report
(most targets are already GATES, and scoring an enforced binary property is the
`ux`-dimension mistake corrected this morning); §16 (one package — already
true); §11 `bo-check-screen` as a next step (it needs a contract to check, and
whether that contract is justified is what 112.3 measures — building it first is
the intuition-over-evidence move §6 itself warns against).

## Slice 147 — Adoption: the framework has no front door (owner decision, 2026-08-26)

Owner picked **(a) adoption/DX** from the direction call. The argument for it
was that it is the only option producing the input the others need: (d) define
1.0 would be defining it from this room, (b) is building the next twelve
components for nobody, and (c) autosave is better answered *with* a user.

**The premise, measured before any work.** Onboarding runs install → import →
ONE list screen (`getting-started/first-screen`, four steps) → stops. And
**nothing in the docs links to `examples/erp-suite` at all**: 28 screens across
six modules, built from shipped CSS with zero of their own, axe-clean at two
widths and 390px-safe, are invisible to anyone who does not read the repo. The
most complete artefact this project owns has no way in.

1. [x] **147.1 — DONE 2026-08-26. The suite has a URL, a page, and CSS it would have shipped without.** It is already built
       (`examples/erp-suite/dist`, 28 pages, gated on every commit). What it
       lacks is a URL and a page that says what it is. *Accept*: a docs page
       lists the screens by the job they do, each links to a working screen,
       and the suite deploys alongside the docs rather than living only on a
       developer's disk. **Verify the link target actually serves** — a kit
       whose links 404 is worse than no kit.

       Shipped: `/getting-started/screen-kit`, **generated from the suite**
       (`gen-suite-index.mjs` → `suite.json`) so a hand-written list of 28
       screens cannot drift from the thing it describes — the same rule
       `/patterns/` and `/concepts/which-pattern` already follow. The suite
       builds at the docs' base path via a new `SUITE_BASE` and is copied to
       `dist/suite/` **in the docs build**, not only in the Pages workflow,
       because a step that only runs in CI is not known to work.

       **The Accept clause earned its place twice.** Checking that links SERVE
       rather than that files were copied found `/suite/bo/index.css` returning
       404: `serve.mjs` mounts `/bo/` VIRTUALLY from `packages/core/dist/css`
       for local runs, so the built `dist/` has no stylesheet at all. Copying
       only `dist/` would have deployed 28 perfectly-gated screens **with no CSS
       whatsoever**, and every one would have looked broken to the first person
       who opened the kit. Verified after: 28 links, 49 in-screen assets, zero
       dead.

       **And it found a real bug in the suite by moving it under a gate that
       had never run on it.** `check-markup` flagged
       `data-row-state="pending"` on `inv/cycle-count` — not a value the
       framework defines, so it matched no CSS and did nothing. The suite's own
       header claimed class checking was "delegated to the framework's own
       check-markup, run by the caller", and **no caller ran it**: `npm run
       suite` was build → check → audit. A documented delegation to nobody, now
       wired, and it validates 4,233 class uses across the 28 screens.

       `KIND` moved to `kinds.mjs`, shared by the scorer and the kit index —
       one definition that has already corrected itself three times.

2. [x] **147.2 — DECIDED 2026-08-26. Not `Demo`, not a copy button: a plain-text fragment per screen.**
       The suite renders from `.screen.mjs` templates, so its HTML is a build
       output, not something a reader can lift. The docs' pattern pages already
       ship `Demo` (preview + copyable code from one string) for FRAGMENTS.
       The open question is whether a whole screen wants the same treatment or
       a different one — 28 screens × full markup is a lot of page weight for
       something a reader may prefer to clone. *Accept*: one answer, argued
       against the alternative, and a working example of it. Refusing to add a
       second mechanism is a valid outcome if `Demo` already covers it.

       **Priced before arguing**, which is what settled it. The 28 `<main>`
       bodies total 181 KB, median 6.7 KB; a docs pattern page is 97 KB today.

       - **`Demo` on one kit page** — +181 KB on a single page. Refused.
       - **`Demo` on 28 new docs pages** — 6.7 KB each is fine, but each would
         be a docs page that `check:page-shape` requires to carry an opener, a
         `ClassRef` and an `ApiTable`. A screen has none of those and gains
         nothing by pretending. Refused.
       - **A copy button on the screens themselves** — refused outright. The
         suite's entire claim is that it is built from shipped CSS with nothing
         added; baking a docs affordance into it would make that untrue, and
         the zero-CSS gate exists to keep that claim honest.

       **What shipped is smaller than "copy-paste" implies.** `Demo` already
       covers FRAGMENTS on 39 pattern pages and remains the right tool there.
       What the suite adds is a COMPLETE composed screen, and the only real
       friction is isolating `<main>` from a full document — so `copy-suite`
       emits exactly that as plain text, linked as *copy* beside each screen.
       No new UI, no new component, no second mechanism inside the docs.

       **The first version leaked a deployment path.** Fragments were cut from
       the DEPLOYED copy, so every link read `/suite/index.html` — this site's
       URL structure pasted into a reader's app, a trap dressed as an example.
       Now cut from the unprefixed build. Verified: 28 screens and 28 fragments
       all resolve, no `/suite/` in the markup, no `<html>` wrapper.

       And `check:dist-walkers` caught the first draft enumerating `dist`
       privately — the gate whose own history is six forked walkers with four
       different page counts. Routed through `suitePages()`, the enumerator the
       Standardize round consolidated for this exact tree.

3. [x] **147.3 — DONE 2026-08-26. The adoption path is executed on every build, not documented and hoped for.** `npm i` then what? There is no
       template, no scaffold, and the package's only bin is
       `bo-check-markup`. *Accept*: a person with an empty directory reaches a
       rendered ERP screen by following written steps, and the steps are
       executed by a check rather than believed — the same bar
       `check:claims` holds prose to.

       **No new prose was needed.** `getting-started/installation` already
       documented the path; what was missing is that nothing ran it.
       `check:quickstart` now does, end to end: an empty temp directory,
       `npm init`, `npm i` of the **local pack** (the registry tells you 0.5.0
       worked; this tells you whether the thing about to be published does),
       every documented import resolved from that fresh install, a **real
       screen-kit fragment** pasted into the documented skeleton, and a browser
       assertion that it rendered — closing with the documented final step,
       `npx bo-check-markup`.

       **It measures computed style, not markup, and the red-proof is why.**
       Sabotaging the stylesheet to empty left the page with **6 rows and 108
       `bo-` elements** — a structure check would have passed a completely
       unstyled page. So it asserts `--bo-color-accent` resolves,
       `.bo-data-table` computes `border-collapse: collapse`, and `.bo-btn`
       computes `cursor: pointer`. Red-proved twice: an empty stylesheet, and a
       documented import that does not resolve.

       Using a kit fragment rather than a hand-written snippet makes this prove
       **147.1's promise too** — "paste it and the classes resolve" is now a
       build failure if untrue, rather than a claim on a page.

**Sequenced deliberately**: 147.1 makes what exists reachable, 147.2 decides
before building, 147.3 is the largest and benefits from both. None of it adds
CSS; this slice is entirely about the distance between "published on npm" and
"someone built a screen with it".

## Slice 146 — the published site went stale for a week (2026-08-26)

1. [x] **146.1 — DONE 2026-08-26. The Pages failure was NOT owner-side, and
       the entry that said so sent every wake looking in the wrong place.**
       This section previously read *"Pages deploy blocked, owner-side"*, blamed
       `actions/deploy-pages@v4` returning **HTTP 503 at "Creating Pages
       deployment"**, and concluded: *"there is no code change that fixes it."*

       That was true on 2026-08-18 and stopped being true afterwards, and
       nothing re-checked it. Read on 2026-08-26: the last five Pages runs all
       failed **in the core build**, not the deploy step, on
       `README.md: claims drifted from dist — run: node scripts/stamp-readme.mjs`.
       A one-command fix, wearing a label that said no fix existed.

       **Three things kept it invisible for a week**, and each is worth more
       than the bug:
       - *It was not a checkbox.* `STATUS.md` lists `N. [ ]` items, so a
         `## OPEN —` section is invisible to the file whose job is "what is
         open". The named-item fix (2026-08-25) widened the parser to titles;
         it did not reach prose sections. **Now a numbered item**, which is why
         this slice exists at all.
       - *A stale diagnosis outranks no diagnosis.* "Owner-side, no code change
         fixes it" is a closed question. Nobody re-opens a closed question, so
         the entry protected the bug.
       - *16 commits were unpushed.* Half of "the site is a week stale" was
         simply that nothing had been pushed since 144.1.

       *Accept*: a Pages run completes green and the live site serves current
       docs. **The rule this leaves behind**: an OPEN entry that blames an
       external party carries the date it was last VERIFIED, not the date it
       was written — and a wake that reads one older than a few days re-checks
       before trusting it.

2. [x] **146.2 — DONE 2026-08-26. The object page's sticky bar: a gap below it,
       then a table header painting through it.** Two owner reports, one
       underlying shape — *sticky chrome that had not been told where it sits*.

       **The gap.** Measured 24px, and `.bo-app-shell__main`'s bottom padding
       is 24px, which is the whole bug: `inset-block-end: 0` resolves to the
       PADDING edge, so the bar parked one padding short of the container. What
       sat in that strip was live record content scrolling under the bar and
       reappearing below it. The shell now publishes `--bo-app-shell-pad` and
       the bar spans it; outside a shell every calc resolves to 0 and nothing
       moves.

       **The overlay.** `.bo-form-actions` shipped `z-index: auto`, so a sticky
       table header (1100) painted straight through it and cut "Submit for
       approval" in half. It never joined the `--bo-z-*` scale — which exists
       precisely because `object-page` lost the same fight with a bare
       `z-index: 2` in roadmap 108. **Twice is a class**, and that is the
       answer to the owner's real question, "how do consumers use this without
       hitting the bug": they should never pick a number. `check:sticky-layers`
       now fails the build on any block-axis sticky rule that does not declare
       a layer from the scale. Red-proved both ways — removing the layer, and
       inventing one outside the scale.

       Inline-axis sticky is exempt **by measurement, not assumption**: the
       data-table toolbar, footer and sticky columns hold still horizontally
       and never contend with page chrome. Requiring a layer of them would be
       ceremony, and the base rate was checked before the rule was written
       (6 sticky rules: 2 block-axis, 4 inline).

       The detector's first run counted a sentence — `button.css` documents
       docking in prose — the same comment-blindness `check:rtl` already had.

       **Not fixed, and stated rather than left implicit:** the shadow is
       always on, including when the bar is at rest. A CSS-only "stuck"
       detection needs scroll-driven animation, and three attempts to build an
       oracle for it disagreed with each other, so nothing was shipped that
       could not be verified. Either a small behaviour with an
       IntersectionObserver sentinel, or leave it. **OWNER CALL.**

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

