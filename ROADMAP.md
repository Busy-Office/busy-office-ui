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

1. [ ] **149.1 — `bo-progress` is on 1 of 27 screens; four that want it hand-rolled their own.**

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

2. [ ] **149.2 — the positional range (`low ——•—— high`) is genuinely uncovered, and is deliberately NOT queued.**
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

3. [ ] **149.3 — record the two-channel finding as positioning; keep it OUT of the docs.**
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

5. [ ] **149.5 — the status badge as a click-through filter: recorded, NOT queued.**
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

