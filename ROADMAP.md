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
- **185.2 — register the npm Trusted Publisher for `@busy-office/create-ui`**:
  needs the owner's npm account, wizard at hand
  (`register-create-ui-trusted-publisher.sh`, walked through 2026-08-29,
  not committed — one-off). `@busy-office/ui` already went through the exact
  same sequence (`ROADMAP-archive.md`: manual `0.1.0` publish by the owner,
  then Trusted Publisher registered, then `0.1.1` shipped with SLSA
  provenance) — this is the same step for the second package, not a new
  kind of gap. Two consequences of leaving it unregistered, as the owner
  named them: (1) `create-ui@0.1.0` carries no attestation a consumer can
  verify the build against, unlike `ui@0.5.0` — and that specific version
  can never be retrofitted, since a published version can't be republished,
  so every release skipped here is provenance lost permanently, not just
  deferred; (2) the next real release strands the scaffolder again exactly
  the way 185's original finding described, unless this is registered
  first — `publish.yml` ships create-ui unconditionally after core, so an
  unregistered Trusted Publisher fails that step outright rather than
  silently skipping it. *(The owner referenced this as "ADR-06" — no ADR-06
  or any `docs/adr/` file exists in this repo as of 2026-08-29; recorded
  here rather than assumed, since `domain-modeling`'s ADR support isn't
  wired into this project yet.)*

  **In progress 2026-08-29 (owner, via the wizard).** The npmjs.com panel was
  opened and the form was mostly filled correctly (Publisher GitHub Actions,
  org `Busy-Office`, repo `busy-office-ui`, workflow `publish.yml`) — but a
  screenshot showed **Environment name pre-filled with `@busy-office/ui`**,
  which is wrong: `publish.yml` has no `environment:` key at all
  (`grep -n 'environment:' .github/workflows/publish.yml` returns nothing),
  so an OIDC token from this workflow never carries that claim and saving it
  as-is would make every future publish fail. Flagged before save; owner was
  told to clear that field and leave it blank, matching what `ui`'s own
  config almost certainly has.

  **No wake can verify the save happened, and neither can `npm view`.**
  Browser automation to npmjs.com is blocked at the Claude-in-Chrome
  extension's own site-permissions level (confirmed by two navigation
  attempts, both refused before any page loaded) — not a login issue,
  a hard stop, and account-settings changes like this belong to the owner
  directly regardless. More load-bearing: **the registry has no field that
  states "Trusted Publisher: configured."** It only ever shows *provenance
  on an already-published version*, stamped at publish time — so
  `create-ui@0.1.0` will read no-provenance permanently no matter what gets
  configured now, and there is no query against the registry that proves
  registration today. The only proof is the next `npm publish` actually
  succeeding via OIDC (or failing loudly, if something is still
  misconfigured) — which only happens at the next real, owner-triggered
  release. `npm view @busy-office/create-ui` is not a valid check for this;
  don't try it as a substitute for a screenshot or the owner's own
  confirmation.

  **RESOLVED 2026-08-29 — the browser block above was per-origin, not
  absolute.** The owner added `npmjs.com` to the Claude-in-Chrome extension's
  site permissions; `www.npmjs.com` (the redirect target) stayed blocked but
  the bare `npmjs.com` origin worked, so navigation succeeded from there.
  **Confirmed directly, not inferred**: the Trusted Publisher panel shows a
  saved entry (`Busy-Office/busy-office-ui`, `publish.yml`, permissions `npm
  publish` + `npm stage publish`); opening its Edit form (via a real
  extension-driven click, not a synthetic DOM event — see 200.1/200.2's own
  caught bugs about the difference) shows Organization `Busy-Office`,
  Repository `busy-office-ui`, Workflow filename `publish.yml`, and
  **Environment name genuinely empty** — the earlier mis-fill was corrected
  before saving, exactly as flagged.

  **What this does and does not prove, stated precisely rather than
  overclaimed.** This confirms the *configuration* is now correct. It does
  **not** prove OIDC actually authenticates — as recorded above, that has
  exactly one proof and it is the next real release publishing
  `create-ui` successfully. Configuration-correct and publish-correct are
  different claims; only the first is closed here.

  **CLOSED 2026-08-29 — the second proof landed.** `v0.6.0` was cut (owner
  confirmed, release created via `gh release create v0.6.0`), `publish.yml`
  ran green end to end, and `Publish create-ui to npm (OIDC, with
  provenance)` — the step that only passes if the Trusted Publisher
  actually authenticates — succeeded. Confirmed against the registry
  directly, not inferred from the green run:

  ```
  npm view @busy-office/create-ui version               # 0.1.1
  npm view @busy-office/create-ui dist.attestations      # predicateType: slsa.dev/provenance/v1
  ```

  `create-ui@0.1.1` carries SLSA provenance — the trust-surface hole named
  at the top of this item is closed for every version from here forward;
  `0.1.0` stays permanently unattested, as already established.

**What would change this order.** If Production finds three or more gaps, the
shape thesis is holding and Inventory/Finance stay as written. If Production
finds **zero**, the thesis is wrong in an interesting way — the remaining
modules would be re-argued rather than ground through, because the instrument
would have stopped paying for itself.

## Slice 233 — 231.2's new prose asserts two computed facts and nothing executes either; found by the THIRD independent build of 231.2 (2026-08-31)

**Where this came from, because the provenance is the interesting part.** This
wake was the **third** dispatcher to build 231.2 to completion on 2026-08-31 and
the second to lose the push. Slice 232 records the second ("this wake built
231.2 in full without having read the winner's version and reached the same
decision on the same evidence, including the same 89-vs-88 denominator
correction"); this is the third, and it reached the same decision again — keep
and demo — on the same re-measured premise (17 of 89 pairs, 4 of 40 components,
`--success` 5 / `--warning` 5 / `--danger` 3 / `--elevated` 2, call sites
unchanged at 5 + 2 + 1). **So the correction to `RESUME.md`'s collision ledger
is one line: 231.2 was built three times and landed once, not twice**, and the
day's discarded total is at least four wakes' work, not three.

**Step 0c's credited compensation fired a second time, and this item IS it.**
The losing diff was not identical to the winner's: it also carried a
`check:claims` case, and the winner's page — the one that shipped — makes the
same assertion with nothing executing it. Redundant coverage catching what the
winner missed is precisely the mechanism Step 0c names in exchange for the
collision cost; the ledger for the day is now **two** such catches (232.1 and
this), against at least four discarded wakes.

1. [ ] **233.1 — `/components/alerts`'s Elevated section states two facts a
       browser can check — that the elevated surface and the toast surface
       MATCH, and that the card look and the accent colour are INDEPENDENT —
       and `check:claims` covers neither.**

       CLAUDE.md: *"If a page says the browser will do something … add a case to
       `apps/docs/scripts/check-claims.mjs`."* Both sentences below are computed
       style, which is the cheapest possible thing to execute, and both are
       load-bearing: the first is the entire reason the variant was kept rather
       than removed (Slice 231.2's decision rests on `--elevated` being the
       toast surface *without* `bo-toast-in`), and the second licenses the
       `bo-alert--elevated bo-alert--warning` composition the page itself ships
       in that section's second demo.

       The two claims, quoted from the shipped page:

       - *"And not the same as a toast, though the surface matches —
         `.bo-toast` adds an entrance animation"*
       - *"Combine it with a severity variant or leave it plain — the card look
         and the accent colour are independent settings"*

       The absence, measured rather than asserted — a plain fixed string first,
       per the context-window-regex lesson:

       ```
       grep -c 'elevated' apps/docs/scripts/check-claims.mjs        # 0
       grep -c 'bo-alert--elevated' apps/docs/dist/components/alerts/index.html
       ```

       **Not a gap in the winner's work so much as a gap the recipe predicts.**
       `check:claims`'s own header says *"Add a case whenever a page claims
       something a browser can check"*, and a new demo section is exactly when
       that step is easy to skip — the section was reviewed, the gates were run,
       and every gate that ran was one the new prose does not reach.

       *Accept* — properties, not predictions:

       - `check:claims` gains coverage of **both** sentences, read off the built
         `/components/alerts/` page as computed style: the elevated alert and an
         injected toast agree on `background-color` while only the toast carries
         an `animation-name`; and the page's own
         `bo-alert--elevated bo-alert--warning` element carries both the raised
         treatment and the warning accent, so "independent settings" is executed
         rather than described.
       - **The equality is not asserted alone.** Two transparent boxes are
         equal, which is the one way this pair could agree while measuring
         nothing, so the check must also fail when the shared colour is
         `rgba(0, 0, 0, 0)`. State the hole and close it in the same assertion.
       - **Red-proved by an injection confirmed in the DOM, not in the file** —
         append a rule to the built stylesheet the alerts page actually loads
         (it loads three), re-run, and require that the gate's own failure
         detail shows the *computed* reading moved, not merely that the gate
         went red. A red-proof that comes back green is a defect in the
         injection until proven otherwise.
       - The gate's reported live-claim count rises by exactly the number of
         cases added, and the `NOT VERIFIED` count is unchanged — it is
         ENVIRONMENT trap 6b's container property, not a regression, and must
         not be "restored" to zero.

       **Kind of work needed, so rule 4 sorts it correctly: NOT browser-blocked
       and NOT owner-blocked.** It is entirely the second of ENVIRONMENT.md's
       two lists — a computed-style assertion plus a red-proof by injection —
       which a cloud wake takes with `browser-harness.mjs` + `serve-dist.mjs`,
       the same pair `check:claims` already drives every wake. No screenshot is
       evidence for any part of it.

## Slice 232 — Objective grill of Slices 229, 230, 231: 230 and 231 survive entirely, and both findings are against how 229's refusal RECORDED its numbers, not against the refusal (2026-08-31)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, and GitHub intake **0 open
issues** (`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing to triage.
Rule 2: `Standardize 1 / 4`, no drift flagged. Rule 3:
**`Objective 3 / 3 slices OVERDUE [229, 230, 231]` — dispatched.** Full report:
`.roundtable/grill-objective-229-230-231-2026-08-31.md`.

**Arming set NOT narrowed.** **40** prior grill reports, read **from the HEAD
blobs**; none names 229, 230 or 231. All three genuinely un-grilled. Read from
the blob rather than the tree for 229's own stated reason — the working-tree form
matches this grill's own heading.

**This wake was the LOSING dispatcher of two Step 0c collisions, and that is
recorded because it is the evidence, not an excuse.** It dispatched rule 4 onto
**229.3**, built the refusal and ran the gates green; the mandated pre-commit
`git fetch origin main` found **origin/main 10 commits ahead** with 229.3, 229.4,
229.5, 230 and 231 all landed. It re-dispatched onto **231.2**, built that and
ran the gates green; the next pre-commit fetch found **2 more commits** — 231.2
taken as well. Both discarded per Step 0c, then rule 3 was OVERDUE and this grill
is the third dispatch.

**Both times the loser reached the same substantive answer as the winner**, which
is the first direct *measurement* of Step 0c's central claim rather than an
argument for it:

| item | winner | loser, independently | agreed? |
|---|---|---|---|
| 229.3 | refuse the assertion | refuse the assertion | **yes** |
| 231.2 | keep `--elevated`, document it | keep `--elevated`, document it | **yes** |
| 231.2 numbers | `2 → 5`, low set `17 → 16` | `2 → 5`, low set `17 → 16` | **yes** |
| 231.2 denominator | 89 pairs vs 88 names | 89 pairs vs 88 names | **yes** |

**And it is worse than two, because the PREVIOUS hand-off records the same
loss.** `.roundtable/RESUME.md` at `d32b758c` says that wake dispatched rule 4 on
229.3 and *"did the whole item — measured the base rate, built both candidate
predicates as a throwaway probe, red-proved them by injection"* before its own
pre-commit fetch showed 229.3 already landed. So on 2026-08-31, **229.3 was built
to completion three times by three wakes and landed once**, and 231.2 twice and
landed once. That is not inferred from the log; it is written in three hand-offs,
this one included.

**So redundant coverage paid once and cost at least three times over, in one
day.** It paid in finding 232.1, a defect in a number 229.3 published that only
an independent derivation was ever going to surface. Step 0c's refusal of *"the
local session stops dispatching"* rested on one prior instance; this is the
second time the mechanism has paid, and the first time its cost has been counted
on the same day.

**Not filed as an item** — Step 0c's decision is *accept collisions*, taken with
the cost named, and the decision is the owner's. What is new is only that the
cost is no longer hypothetical: the accepted figure is *"up to one wake's work,
discarded"* and the measured figure for one day is **at least three wakes' work**.
Recorded for the owner in `RESUME.md`'s Direction block, which is the one place
the loop can say so; no fourth option is proposed here, because Step 0c already
records three refusals with a measured reason each and inventing a fourth to fill
the gap is the ceremony 94.11 refuses.

**Slice 230 survives entirely, including a red-proof re-run by this grill.** The
population claim verifies from the blobs — 8 pages read a source file, `scale`
and `index` parse nothing, so the population is **6** and `cascade` threw **0**
before `ff2b623d` and **1** after, making it the sole one-off. `tokens.min.css`
carries **0** comments, so no stripping step was needed. The built table still
renders **5** rows. And case C, the discriminating red-proof, was re-run
independently: injecting `--bo-z-toast: 1600 → 1700` in the source only, with the
injection confirmed present first, fails the build at **exit 1** with **count 5
on both sides** — so a `length < 5` floor would have passed, which is exactly the
claim. Injection reverted, `git status` confirmed empty.

**It also reconciles a figure that reads like a contradiction.** The previous
hand-off recorded *"6 of 8 throw"* while 230 says *"5 of 6"*. Both are right and
count different denominators: 6 of the 8 readers throw (cascade now among them),
and 5 of the 6 *parsers* threw before the fix.

**Slice 231 survives and is corroborated by an independent derivation** — this
wake built 231.2 in full without having read the winner's version and reached the
same decision on the same evidence, including the same 89-vs-88 denominator
correction. No finding against it.

1. [x] **232.1 — DONE 2026-08-31 (cloud wake). Every published figure
       reproduced exactly; 229.3 now carries the tense-inclusive count, the
       command that produces it, and a correction to its red-proof table that
       the replay turned up. The refusal stands and is strengthened. The record
       is at the end of this item.** The finding as filed:
       **229.3's BROAD base rate of 2 is an artefact of `owes?\b` not
       matching `owed`. The tense-inclusive count is 7, and the 5 extra firings
       are exactly the five files 229.2 corrected — the set 229.3's own Accept
       names as the ones it must not fire on.**

       **The refusal is NOT overturned, and that is stated first so this is not
       read as a reopen.** 229.3's decisive argument is its third injection row —
       a *reworded* stale claim leaves both predicates green — and that argument
       is independent of any base rate. Refusing was right. What is wrong is a
       published number beside it, which CLAUDE.md's "a number you report is
       load-bearing" makes worth a slice on its own; 192.1's shape again, the
       defect landing in what shipped BESIDE the carefully-proved claim.

       229.3 publishes this as its reproduction command:

       ```
       grep -rniE 'owes?\b' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs'                    # 2, both correct prose
       ```

       `owes?\b` is `owe` + optional `s` + a word boundary, so it **cannot match
       the past tense** — the boundary fails against the `d`:

       ```
       printf 'this line used to say it was owed\n' | grep -cE 'owes?\b'      # 0
       printf 'this line used to say it was owed\n' | grep -cE 'owe[sd]?\b'   # 1
       ```

       Past tense is not an edge case here — **it is the wording 229.2's own fix
       used.** All five corrected headers read *"the debt is PAID, and this line
       used to say it was owed"*. So the whole-word count is **7**, not 2:

       ```
       grep -rlwE 'owes|owed' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs' | grep -v check-selftests.mjs | wc -l    # 7
       ```

       **BROAD as 229.3 defines it — "`owes` within 120 chars of `--self-test`
       or `@heuristic`, either order" — fires on all five once the tense is
       included.** The gap is **18 characters**; they sit on adjacent lines,
       which is also why a line-based `grep` reports nothing and a multiline test
       reports five:

       ```
       node -e "const s=require('fs').readFileSync(process.argv[1],'utf8');
         console.log(/owed[\s\S]{0,120}--self-test|--self-test[\s\S]{0,120}owed/.test(s))" \
         apps/docs/scripts/check-floor.mjs      # true, and true for all five
       ```

       So BROAD's complete false-positive set is **7, not 2** — and the five it
       gains are precisely the ones 229.3's Accept forbids it firing on. The
       reason is the sharper form of the same lesson: **a gate reading prose
       about self-tests trips on the correction that fixed the thing it exists to
       catch**, because explaining a paid debt requires naming the debt. That is
       CLAUDE.md's *"verifying a removal: assert on structure, never on raw
       text"*, recorded three times about a removal ASSERTION and here killing a
       proposed GATE.

       **Widening the word is worse, and that was measured too.** `owe[sd]?\b`
       unanchored returns **17** files, because it matches inside *allowed* (9),
       *windowed* (7), *showed* (3), *followed*, *swallowed*, *overflowed*,
       *narrowest*, *slowest*, *lowest*. Only `-w` gives the honest 7.

       *Accept* — properties, not predictions:
       - 229.3's BROAD figure either carries the tense-inclusive count with the
         command that produces it, or records that the published 2 was measured
         with a regex blind to `owed` and says what the complete set is. **Both
         close this.**
       - The refusal itself is left standing. A change that reopens it does not
         satisfy this item — the third injection row is untouched by any of it.

       ---

       **RESOLUTION (2026-08-31, cloud wake). Both Accept bullets are satisfied
       by the same edit: 229.3 now carries the tense-inclusive count AND says
       the published 2 was measured with a regex blind to `owed`.**

       **Every figure this item published was re-run before anything was
       edited** — the premise is a prior wake's measurement, so re-checking it
       is part of the criterion, not a courtesy. All reproduce:

       | claim | re-run |
       |---|---|
       | NARROW/published count is 2, both correct prose | **2** — `check-resume-charter`, `check-resume-slice-ids` |
       | `owes?\b` cannot match `owed` | `0` vs `1` for `owe[sd]?\b`, on the same line |
       | tense-inclusive whole-word count | **7** |
       | the 5 extra are 229.2's corrected files | **5** headers carry *"used to say it was owed"* |
       | BROAD's multiline test fires on all five | **true** on all five |
       | 15 heuristic gates carry a `--self-test` branch | **15**, re-derived from the branch test |

       **Reconciled against an independent instrument before being quoted.**
       The 7 was produced twice by different means — `grep -rlwE` over the
       filenames, and a Node pass applying BROAD's actual 120-char proximity
       predicate to the 15 branch-carrying files. Both return the same seven,
       and all seven are inside the 15, so the false-positive set is not
       inflated by files the proposal would never have walked.

       **One published figure did NOT reproduce as written, and the difference
       is a missing exclusion.** This item states that unanchored `owe[sd]?\b`
       returns 17 files. Run as written it returns **18**; it returns 17 with
       the `grep -v check-selftests.mjs` the 7-count command carries and the
       17-count sentence does not. The excluded file is the meta-gate, which
       names this vocabulary by definition. Recorded rather than quietly
       adjusted — it is the same class of defect this item exists to fix.

       **The replay found a SECOND defect in the same table, which is why this
       took a replay rather than an edit.** 229.3's red-proof reads
       `NARROW 0 BROAD 0` on its third row. Rows 1 and 2 are counts over the 15;
       row 3 is *"did it fire on the injection"*. As a count it is **2** — the
       reworded sentence contains no `owe` word, so BROAD's two standing false
       positives are still there and cannot go anywhere. The `<- both BLIND`
       annotation carries the meaning, so the refusal is unaffected, but the
       number as printed is wrong in the same way the base rate was.

       **And the correction sharpens the refusal rather than weakening it.**
       Under the tense-inclusive predicate the BROAD column reads **7 / 7 / 7**
       — flat across the baseline and both injections — because the red-proof's
       chosen injection site, `check-floor.mjs`, is itself one of the seven
       false positives. So the corrected BROAD not only costs 3.5x the false
       positives; on this test it discriminates nothing at all. 229.3's
       decisive third row is untouched by any of this, and **the refusal is
       explicitly left standing.**

       **Method note, since the replay is itself an instrument.** The injections
       were done in memory — the file is read, the sentence spliced into the
       string, the predicate applied to the string — so no revert could be
       missed. Each mutated string was asserted to CONTAIN the injected sentence
       before it was measured (a green red-proof is a defect in the injection
       until proven otherwise), and the file on disk was asserted byte-identical
       afterwards. The replay is also case-INsensitive, as 229.3 measured it: a
       case-sensitive run reads row 2 as `BROAD 2`, not 3, because the injected
       sentence says `OWES`. That discrepancy was chased down rather than
       averaged over — it is the difference between reproducing a measurement
       and merely getting a similar number.

       **Not verified, said plainly:** cloud wake — no Podman and no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. **Nothing here is a code change**: the diff is `ROADMAP.md` and
       the loop-log files only, and no shipped artefact, CSS, markup or rendered
       output moved. Nothing in this item rests on a rendered image.

2. [ ] **232.2 — the recurrence history 229.3 never measured: the defect was
       introduced BY the commit that paid the debt, and has recurred zero times
       since.**

       229.3 rests its ratchet refusal on a base rate of 0 *today*. It never asks
       how often the defect has actually appeared, which is the question a
       ratchet is for. Measured by the losing dispatcher, two independent
       instruments, on an unshallowed clone:

       ```
       git log -S'OWES a --self-test' --format='%h %cs %s' --name-only \
           -- apps/docs/scripts packages/core/scripts        # exactly 3 commits
       ```

       | commit | date | what it did | seen by |
       |---|---|---|---|
       | `84eb14ca` 42.1 | 2026-08-19 | wrote the sentence into **6** files | pickaxe |
       | `443348e2` 42.3 | 2026-08-19 | added the branches — **the claim becomes false** | second instrument only |
       | `f1be2485` 220 | 2026-08-30 | deleted `check-boost.mjs`, the sixth file | pickaxe |
       | `5754ea02` 229.2 | 2026-08-31 | corrected the remaining five | pickaxe |

       **At 42.1 the sentence was TRUE**, which the pickaxe structurally cannot
       see — it finds where the SENTENCE changed, and `443348e2` changed only the
       branch. The instrument that sees it tests sentence AND branch together:

       ```
       git show 84eb14ca:apps/docs/scripts/check-floor.mjs | grep -c "argv.includes('--self-test')"   # 0
       git show 443348e2:apps/docs/scripts/check-floor.mjs | grep -c "argv.includes('--self-test')"   # 1
       ```

       **So the defect was introduced by `443348e2`, titled *"42.3: all seven
       heuristic gates now prove they can fail"* — the commit that paid the
       debt.** It shipped the self-tests and left five sentences saying they were
       owed. One introduction, zero recurrences in the twelve days to 229.2.

       That is the ratchet argument answered on its own terms rather than by
       today's base rate: a ratchet guards recurrence, and the measured
       recurrence rate over the whole history is zero.

       **`check-boost.mjs` is the sixth file and is resolved, not filed** — it
       left the defective state by deletion in Slice 220's htmx-4 migration, not
       by correction, which is why 229.2 corrected five.

       *Accept* — a property: the recurrence history is recorded in 229.3's
       vicinity with the commands above, **or** it is recorded that the loop
       prefers the today-base-rate framing and why. Both close this; finding the
       history irrelevant to the decision is a satisfying outcome.

       **Requires an unshallowed clone** (`git fetch --unshallow origin`) — every
       figure here is a history measurement, and ENVIRONMENT.md §2 says they are
       silently 50x wrong without it.

3. [ ] **232.3 — 230.1's refusal to gate its predicate misapplies 94.11, and
       94.11's own test is what refutes it. Filed by a THIRD dispatcher on the
       same armed set; this grill's §B records "no finding against 230".**

       Provenance first, because it is what makes this admissible rather than a
       re-litigation: a third cloud wake dispatched rule 2 on the same flagged
       drift from `e995891`, built its own `cascade.astro` fix, and lost the Step
       0c race to `d32b758c`; re-dispatching, it drew rule 3 and independently
       grilled the same armed set, losing a **second** race to `dbc41ae2`. Its
       other finding — the 89-vs-88 denominator — **duplicates** what this grill's
       §C already records from two dispatchers, and is dropped rather than
       re-filed. This one does not appear in any landed document.

       **The refusal.** 230.1 fixed the unasserted parse and then declined a gate:
       *"the population is now 6 of 6, so a gate over this predicate would be
       uniformly true and is refused on roadmap 94.11's own test: ceremony, not a
       detector."*

       **94.11's test is about DISCRIMINATION, not today's headcount.** Its
       predicate was refused because it stayed true *under injection* — the
       red-proof injected `letter-spacing: 7px` and the detector still reported
       **0 unexplained**. A detector handed the defect and still reporting clean is
       ceremony. Applied properly here the same test **passes**, and no synthetic
       injection is needed because the defect is in this repo's history:

       ```
       git checkout -q ff2b623d^ -- apps/docs/src/pages
       for f in $(grep -rlE "readFileSync|import\.meta\.glob" apps/docs/src/pages --include=*.astro | sort); do
         fm=$(awk '/^---$/{c++} c==1' "$f")
         echo "throws=$(echo "$fm" | grep -c 'throw new Error') parses=$(echo "$fm" | grep -cE 'matchAll|\.match\(|\.split\(') $f"
       done
       git checkout -q HEAD -- apps/docs/src/pages
       ```

       | tree | flagged by `parses > 0 && throws == 0` |
       |---|---|
       | `ff2b623d^` (pre-fix) | **exactly 1** — `concepts/cascade.astro` |
       | current `HEAD` | **0** |

       **Zero false positives, and no exemption map needed.** `scale.astro` and
       `index.astro` — the two pages 230.1 excluded *by hand* as byte-length-only —
       exclude themselves at `parses=0`. The distinction 230.1 reached by reading
       eight files and reconciling a disputed denominator, the detector reaches
       mechanically.

       **The counter-evidence, carried rather than omitted.** The loop found this
       without a gate (227.1 spotted it, 230.1 fixed it), and the population has
       been **static at 8 for 9 days** after growing 1 → 8 in ten
       (`git log -S'readFileSync'` / `-S'import.meta.glob'`, first appearance per
       page, on an unshallowed clone). A gate's value is about the **9th page**, so
       this is **not urgent and not a P0**. What it is not, is ceremony:
       `cascade.astro` gained its parse on 2026-08-22 and shipped unasserted for
       those same 9 days, read past by three wakes.

       *Accept* — properties, not predicted values:
       - (a) The gate's verdict on the CURRENT tree agrees with what the tree
         carries, measured rather than assumed.
       - (b) Red-proved against the REAL pre-fix tree (`ff2b623d^`), not only a
         synthetic injection, with the checkout confirmed to have taken effect
         before the result is believed.
       - (c) It carries `@heuristic` and a working `--self-test` with a
         `process.argv` branch. Recognising "derives rendered content from a parse"
         is a recognition problem, and this population was read as **6** and as
         **8** by careful passes on the same day.
       - (d) The byte-length-only exclusion is MECHANICAL, not an exemption list.
         Any page exempted by name carries a reason, per `check:wrong-choice`.
       - (e) **Finding the premise false is a satisfying outcome**: if the detector
         cannot be written without an exemption map naming more files than it
         catches, record that and refuse the gate on the measurement.

## Slice 231 — Polish round on `component/alerts`: the reconciliation is a NO-OP, and the sweep that surrounded it found one shipped variant with no recorded reason anywhere (2026-08-31)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — the three open items are
`112.3` and `112.4` (owner-blocked: 5 owner-authored briefs, and a verdict that
depends on them; `.roundtable/pilot-112/` holds a README and SEALED-PICKS.md and
**no `briefs.md`**) and AT runtime evidence (hardware-blocked), and GitHub intake
**0 open issues** (`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing
to triage. Rule 2: `dispatch_status.py` read `Standardize 0 / 4`, and **no drift
was flagged** — the previous wake spent that trigger. Rule 3: `Objective 2 / 3`.
Rule 4: **nothing dispatchable, and none of the three is browser-blocked** — a
local wake has nothing here this wake lacked. Rule 5: see below. **Rule 6 fired
→ Polish.**

**Rule 5 was answered from the instrument, not from the file.** Only
`axe-violations` has a comparable pair newer than 2026-08-20 — `0.0@2026-08-29`,
`0.0@2026-08-30`, `0.0@2026-08-31`, flat — and the other 12 multi-sample names'
newest pairs are all 2026-08-16→19, i.e. **12+ days stale**. `bundle-gz-kb` reads
`10.8 → 11.6 → 11.7`, which is two consecutive moves the wrong way and is
**exactly the dead-instrument answer `LOOPS.md` rule 5 warns about**: those three
samples are 2026-08-16/17. Recorded as *not evaluable* rather than quoted as
current. The command:

```
python3 -c "import json,collections;rows=[json.loads(l) for l in open('.roundtable/loop-metrics.jsonl') if l.strip()];\
by=collections.defaultdict(list);[by[r['name']].append(r) for r in rows];\
print({n:[(x['value'],x['ts'][:10]) for x in v[-3:]] for n,v in by.items() if len(v)>=2})"
```

1. [x] **231.1 — DONE 2026-08-31 (cloud wake). Polish round 2 on
       `component/alerts`: reconciliation clean on all four arms, recorded as a
       NO-OP.** §3b's rule for a `content: 3` re-queued surface, following
       `badge`'s round-2 precedent — reconcile the published artefact against the
       ledger's record of it, and if that finds nothing, say so in one line
       rather than manufacture a fix.

       `polish_requeue.py --check` re-queued **8** surfaces on source-blob
       movement; all six of the 1/3 rows tie on the ledger's stated tie-break
       (lowest score, then fewest rounds), so the tie was broken by where a
       defect might actually be.

       - **Arm 1 — the entry exists.** `dsa-scores.json` carries `alert` with
         `content: 3`, `scored: 2026-08-23`, matching the ledger's round-1 row.
       - **Arm 2 — it is published.** All **40** entries render on a built page
         (40 entries → 39 pages: `alert`→`alerts`, and `skeleton`+`state` both
         →`state-patterns`). **Zero** pages publish `Not yet scored` — 176.1's
         defect has not recurred — and zero publish `NaN` or `undefined / 3`.
         Three built component pages carry no `DsaScore` section at all:
         `inline-editing` and `table-toolbar`, both of which the ledger already
         annotates *"(unscored in DSA)"*, and `nav`, which was never seeded into
         the ledger (it is off `check:wrong-choice`'s original TODO set).
       - **Arm 3 — the citations hold against the shipped CSS.** All **17**
         literals cited across the 7 re-queued surfaces with DSA entries are
         present in their component stylesheets (0 absent). `dashboard`'s
         `typography` cite makes the only *countable* claim — `3rem` "has exactly
         one caller; a second is the trigger to promote it (94.13)" — and
         comment-stripped it reads **exactly 1** caller against 2 raw
         occurrences, the second being the comment that explains it.
       - **Arm 4 — no silent NaN path.** `DsaScore.astro` spreads
         `entry.dimensions[d]` for every `d` in `rubric.dimensions`, so a missing
         key would publish `NaN%` with nothing throwing. Reconciled: **6 of 6**
         rubric dimensions present on **40 of 40** entries, zero extra keys, zero
         non-integer non-`na` scores.

       **A history measurement was taken only after `git fetch --unshallow`** —
       the container opened at **55** commits and a `git log --since` over the
       alert sources was silently wrong until it read **1,753**
       (`is-shallow-repository` → `false`, which is the only check that it
       worked). ENVIRONMENT trap 2, exercised for real.

       **Not verified, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. This item
       changed no CSS, no markup and no rendered output — it is a ledger entry
       and a set of assertions over artefacts already built — so nothing in it
       rests on a rendered image.

2. [x] **231.2 — `bo-alert--elevated` is published in the API tables of
       `/components/alerts` and explained nowhere, and its three call sites are
       one screen.** DONE 2026-08-31 — documented, and the §3 "should it exist"
       question answered KEEP on a reason that is general rather than screen-shaped. Found by the sweep around 231.1, filed rather than fixed:
       §3b's stop rule (101.3) confines Polish to the existing ratchet, and
       no DSA dimension flags this.

       **The measurement.** Counting each shipped variant's occurrences in its
       own BUILT page — the artefact, not the source:

       ```
       python3 -c "import json,os;api=json.load(open('packages/core/dist/api.json'));\
       slug=api.get('pageSlug',{});\
       print({v:open('apps/docs/dist/components/%s/index.html'%slug.get(n,n)).read().count(v) \
       for n,c in api['components'].items() for v in c.get('variants',[]) \
       if os.path.exists('apps/docs/dist/components/%s/index.html'%slug.get(n,n))})"
       ```

       **17 of 89** shipped variants, across **4 of 40** components, occur `<=2`
       times — twice being exactly the two generated tables (`ClassRef` row +
       `ApiTable` Variants list) and nowhere else on the page. That is a real
       base rate, not a uniformly-true predicate: it is neither 0 nor 100%.

       **Red-proved by discrimination inside one page**, which is what makes the
       count a signal rather than an artefact of counting: on `/components/alerts`,
       `--success` reads **5**, `--warning` **5**, `--danger` **3**, and
       `--elevated` **2**. The three demoed variants separate from the one that
       is not, in the same document, under the same instrument.

       **16 of the 17 carry a recorded reason; one does not.** This is the part
       that took the work, and it is why the finding is one variant rather than
       seventeen:

       - **14 `bo-icon--*` glyphs** — the icon page renders **12 of 26**, and
         icon's own `fit` cite states the position outright: *"the set is an
         example of the mechanism rather than a catalogue"*. Coherent by record.
         (Note the 12: it reproduces, from the built HTML and independently, the
         same 12 that icon's Polish round 2 caught hard-coded as a divisor —
         ROADMAP 227. Two instruments, one number.)
       - **`bo-select--seamless` and `bo-tag-input--seamless`** — both named in
         prose on `/patterns/editable-grid`, with an explicit `Scope` clause
         saying which cell types stay chromed and why.
       - **`bo-alert--elevated`** — nothing, on any page.

       **And it has survived one composition, not two.** Every use in the repo is
       the notification screen: `patterns/notification.astro` (5),
       `PatternPreview.astro` (2 — which is the *thumbnail of that same pattern*),
       and `examples/po-app/server.mjs` (1). Objective §3 says a piece earns its
       place by surviving **≥2 real, independent compositions**; §2 refuses "a
       modifier that serves exactly one scenario". So this is not merely a docs
       gap — it is an open question about whether the variant should exist.

       ```
       grep -rn 'bo-alert--elevated' apps/docs/src examples packages/core/src | grep -v node_modules
       ```

       **Accept** — written so that finding the premise false is a satisfying
       outcome, not an off-plan one:

       - **Re-run both measurements first** (the occurrence count and the call-site
         grep above); the premise is a measurement from this wake and re-checking
         it is part of the criterion. If a second independent composition has
         landed since, that is the answer to the §3 question and the item says so.
       - **Then either**: `/components/alerts` gains a demo section whose caption
         names when `--elevated` applies against a plain inline alert and against
         a toast — **or** the variant is refused and removed, with the notification
         pattern absorbing the look another way — **or** it is kept as a named
         deliberate exception, recorded the way `/patterns/editable-grid` records
         `--seamless`. Any of the three closes this; which one is a judgement.
       - **In every case**, the built page's treatment of `bo-alert--elevated`
         agrees with what this item records, verified by re-running the count
         rather than by predicting what it will read.
       - The two `--seamless` variants get a one-line verdict in the same pass, or
         a recorded reason they are out of scope — they are the only other
         non-glyph members of the flagged set.

       **Kind of work needed, so rule 4 sorts it correctly: NOT browser-blocked
       and not owner-blocked.** The elevated rendering already ships and is
       already built on `/patterns/notification`; the options above add or remove
       markup and prose. A cloud wake can verify all of it through `docs:build`,
       `check:claims`, `check:layout`, `test:axe` and `check:repo`. A screenshot
       would be a nice-to-have, not the evidence.

       **Outcome (2026-08-31, cloud wake, dispatcher rule 4).** Taken as the
       oldest *dispatchable* item — 112.3 and 112.4 are owner-blocked and the AT
       item is hardware-blocked, so the oldest open item is not the oldest
       actionable one.

       **Both premises re-derived first, as the Accept requires, and both hold.**
       17 low pairs across 4 of 40 components; the non-glyph members are exactly
       `bo-alert--elevated`, `bo-select--seamless`, `bo-tag-input--seamless`; the
       within-page discrimination on `/components/alerts` reproduces exactly at
       `--success` 5, `--warning` 5, `--danger` 3, `--elevated` 2. The call-site
       grep returns the same eight lines: `patterns/notification.astro` (5),
       `PatternPreview.astro` (2), `examples/po-app/server.mjs` (1), plus the CSS
       definition. **No second independent composition has landed**, so the §3
       question was live and had to be answered rather than assumed away.

       **One correction to the premise's arithmetic, which changes nothing.**
       The item says "17 of **89** shipped variants" and re-running it reads
       **88**. Both are right and the gap is exact: there are 89
       *(component, variant)* pairs and 88 distinct *names*, because
       `bo-badge--type` is declared by two components (`badge` and `dashboard`),
       so a dict keyed on the name collapses it. The `17` is unaffected — it is
       counted over pairs either way.

       **Decision: KEEP and document** — option 1 of the three, and the §3
       question is answered on the merits rather than deferred. `alert.css`'s own
       comment already carries a reason that is **not** screen-shaped: `.bo-toast`
       ships this same raised surface *plus* `bo-toast-in`, an entrance animation
       that asserts the content just arrived, which is wrong for a list already
       in the page at load. That is a general distinction — *arrival vs.
       presence* — and it is the same axis this component's top comment already
       uses to decide `role="alert"`. A modifier that exists to separate two
       genuinely different announcements is not 231.2's "modifier that serves
       exactly one scenario"; the single call site is a docs gap, not evidence of
       a one-off. **Removal was the live alternative and is refused**: it would
       force the notification list to either adopt toast semantics it should not
       claim, or hand-roll the shadow outside the component.

       **What shipped:** one demo section on `/components/alerts`, placed before
       the Toast recipe so the contrast reads in order. Its caption names both
       comparisons the Accept asked for — against a plain inline alert
       (*"not for a single message inside a form or a page section"*) and against
       a toast (*"a toast interrupts, an elevated alert is scanned"*) — and links
       the pattern that composes them.

       **Verified by re-running the count, not by predicting it**, which is the
       Accept's own wording: `bo-alert--elevated` moves **2 → 5** on the built
       page and the low set drops **17 → 16**, leaving only the two `--seamless`
       variants.

       **Verdict on those two, recorded in the same pass as required: no change
       needed.** They already carry the recorded reason the item credits them
       with — `/patterns/editable-grid` names both in prose with an explicit
       `Scope` clause (*"a checkbox already reads as a control"*) saying which
       cell types stay chromed and why. They are correctly at 2 occurrences on
       their own component pages because their explanation lives on the pattern
       that composes them, which is the `--seamless` precedent this item cites.

       **Not verified, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. **The change is
       prose plus two `<div>`s using a variant that already ships and is already
       rendered on `/patterns/notification`** — no CSS changed, so no new visual
       state exists to look at. The whole-tree browser gates are the evidence
       that nothing broke: all 17 cloud entry points exit 0, including
       `check:layout` (127 pages, no overflow at 390 or 150% zoom), `test:axe`
       (127 pages x 2 widths, zero violations), `check:pseudo` (≥41% expansion,
       nothing clipped) and the `DOCS_BASE=/busy-office-ui` parity build, which
       is what proves the added `<a href={base + '/patterns/notification'}>`
       resolves on Pages.

## Slice 230 — Standardize sweep: lanes 1-4 clean a ninth time, and the drift carried for three wakes was a genuine one-off — 5 of 6 parsing pages already asserted (2026-08-31)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — the three open items are
`112.3`, `112.4` (owner-blocked) and AT runtime evidence (hardware-blocked) —
and GitHub intake **0 open issues** (`list_issues` OPEN → `totalCount: 0`), so
Step 1 had nothing to triage and no `Roadmap · plan` row was recorded. Rule 2:
`dispatch_status.py` read `Standardize 3 / 4 Continue rounds`, so the **counter**
did not fire — but rule 2's *other* trigger, **"or drift flagged"**, was loaded,
and the previous hand-off had recorded that it was being left implicit for a
third wake. **Dispatched Standardize on the flagged drift.**

**Why this wake could not defer it again.** Rule 2's counter is fed by `Continue`
rows only, Continue is reachable only through rules 1 and 4, and rule 4's
dispatchable set is empty — so the counter can no longer advance on its own. The
drift trigger is the only remaining path to this lane, which is the same silent
starvation shape `LOOPS.md` Step 0b records three times.

1. [x] **230.1 — DONE 2026-08-31 (cloud wake). `cascade.astro`'s `Z_TOKENS`
       parse now reconciles against the shipped tokens, and the sweep's four
       standing lanes came back clean.**

       **The flagged drift, confirmed rather than assumed.**
       `apps/docs/src/pages/concepts/cascade.astro` parsed the z-index scale out
       of `tokens/z-index.css` with a regex and rendered it straight into a
       `<tbody>` with no assertion. A zero-match parse renders an **empty
       table** — silence, not a wrong number, which is why three wakes read past
       it. The page's own prose beside that table tells every `position: sticky`
       element to "reach for a token from this table", and the table is the
       framework's only published statement of the scale.

       **The base rate is what made this a Standardize finding rather than a new
       gate.** Population = docs pages whose frontmatter reads a source file at
       build time and derives rendered content from it by regex:

       ```
       grep -rlE "readFileSync|import\.meta\.glob" apps/docs/src/pages --include=*.astro
       ```

       → 8 files; `scale.astro` and `index.astro` take only a **byte/gzip
       length** and parse nothing, so the population is **6**. Of those,
       `palettes`, `primitives`, `icon`, `ai-assistants` and `tokens` all throw
       on a bad parse. **5 of 6 already asserted** — `cascade` was the sole
       one-off, which is exactly what this loop exists to consolidate.

       **Reconciled against the shipped artifact, not a hand-typed floor.**
       `if (Z_TOKENS.length < 5)` is the decaying constant `icon.astro` refuses
       in its own block, and it cannot see a partial parse that clears the
       floor. Instead the source parse is compared against
       `@busy-office/ui/css/tokens.min` — two independent derivations of one
       fact, the same shape `icon.astro` uses (source css vs `api.json`).

       **The minified file is also the only comment-free reading available, and
       that is measured, not assumed:** `z-index.css`'s rationale comment NAMES
       four of the five tokens in prose, so counting raw `--bo-z-` occurrences
       in the source would trip on its own explanation — CLAUDE.md's named trap.
       `(tokens.min.css.match(/\/\*/g)||[]).length` → **0**, so no
       comment-stripping step was invented.

       *Accept* — properties, not predicted values:
       - The assertion's verdict agrees with what the shipped tokens carry —
         **met**: control build exit 0, and the rendered table still carries all
         five rows (`grep -o 'col--code">--bo-z-[a-z-]*' dist/concepts/cascade/index.html`
         → 5, unchanged from before the edit).
       - Each red-proof's **injection is confirmed present** before its result is
         believed, per CLAUDE.md's "a green red-proof is a defect in the
         injection until proven otherwise" — **met**, both below.
       - The check discriminates something a count floor cannot — **met**, and
         this is the load-bearing one.

       **Red-proofs, injection confirmed each time:**

       - **A — zero-match parse.** Renamed the declared prefix in the source
         only (`--bo-z-` → `--bo-zed-`). Injection confirmed: `grep -cE '^    --bo-zed-'`
         → **5**, `grep -cE '^    --bo-z-[a-z]'` → **0**. Build **exit 1**:
         *"parsed 0 z-index token(s) from the source css [] but the shipped
         tokens.min.css carries 5"*.
       - **C — value drift, the discriminating case.** Changed
         `--bo-z-toast: 1600` → `1700` in the source only. Injection confirmed
         present, and **the count stayed 5**, so a `length < 5` floor would have
         **passed**. Build **exit 1**, reporting 5 against 5 with the differing
         member visible in both lists.

       Source restored from a byte copy afterwards; `git status --short` shows
       `cascade.astro` as the only modified file.

       **The re-scan the playbook requires found nothing further.** Same drift
       shape outside `pages/` — `lib/`, `components/`, `layouts/` — returns one
       file, `lib/semantic-css.ts`, and it already carries both guards including
       an explicit *"parsed zero palette references"* throw. The population is
       now **6 of 6**, so a gate over this predicate would be uniformly true and
       is **refused** on roadmap 94.11's own test: ceremony, not a detector.

       **The four standing lanes — `4 of 4`, all clean:**

       | lane | reading | verdict |
       |---|---|---|
       | 1 `scan:dead-style` | 0 dead on 0 pages; 1,433 live inline decls | clean |
       | 2 `report:css-repeats` | **8** groups — the standing eight, no delta | clean |
       | 3 `report:prose` | 7 over corpus median + family outliers, **union 8** | all verdicted |
       | 4 `report_loop_prose.py` | no file changed accumulate class | clean |

       **Lane 3 checked by SET MEMBERSHIP, not by a cite count** — 228.1 already
       recorded that grepping a page's path out of `ROADMAP.md` +
       `ROADMAP-archive.md` returns hits for everything and reports full
       coverage whatever the truth is. Today's union (data-table, richtext,
       form, calendar, money, combobox, tabs, motion) resolves entirely against
       **158.1's twelve** and **161.1's three**; nothing is flagged outside those
       lists. `tabs` is flagged again after 228.1 recorded it as no longer
       flagged — it still carries 158.1's verdict, so it needs no new one.

       **Lane 4 needed the clone unshallowed first** —
       `report_loop_prose.py` refused to report, exactly as ENVIRONMENT trap 2
       says it should, rather than printing wrong history figures. No
       `.git/shallow.lock` was present and `git rev-parse --is-shallow-repository`
       read **false** afterwards, which is the only check that it worked.
       `CLAUDE.md` (29 up, never cut) and `DESIGN.md` (22 up, never cut) are
       227-era standing HONEST verdicts — 193.1 decided *fold nothing, retire the
       watch* — and `ROADMAP.md` reads `4 up, last cut d701e619`, so the signal
       lane 4 carried in 228.1 is discharged and has not returned.

       **Gates, run against the final tree, exit 0 each**: core `build`, core
       `test` (152 in 27 files), `lint:css`, `docs:build` (which runs
       `check:repo`), `check:claims`, `check:formatting`, `check:layout` (**127**
       pages), `test:axe` (**127** pages × 2 widths, zero violations),
       `check:repo` (`check:slice-refs` **456** citations).

       `check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
       `ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false` —
       **not** a regression. Do not "restore" the zero.

       **NOT VERIFIED, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. The change is a
       build-time assertion that renders nothing new — the emitted table is
       byte-identical, asserted above by re-reading the built HTML — so nothing
       in this item rests on a rendered image.

## Slice 229 — Objective grill of Slices 222, 226, 227, 228: every decision survives, the best candidate finding was already gated, and the one mirror no gate can see is fixed (2026-08-31)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, and GitHub intake **0 open
issues** (`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing to triage
and no `Roadmap · plan` row was recorded. Rule 2: `dispatch_status.py` read
`Standardize 0 / 4 Continue rounds ok` — the counter reset when 228 fired. Rule
3: `Objective 4 / 3 slices OVERDUE [222, 226, 227, 228]` → **Objective**. Rules
4-8 were not reached.

**The open set was 3 at dispatch time and wholly blocked — for the fourth wake
running.** This slice files three more (229.3, 229.4, 229.5), and unlike the
standing three **none of them needs the owner, hardware or a second agent**, so
rule 4 has ordinary buildable work again. Read the rule carefully next wake: the
oldest open item is still `112.3` and still owner-blocked; the oldest
*dispatchable* one is 229.3.

**Arming set not narrowed, and that is a reading rather than an omission**
(playbook §6 step 0). The most recent grill (225) covered 218, 219, 223, 224,
and **none of the 23 prior grills names 222, 226, 227 or 228** — all four are
genuinely un-grilled. 222 is armed because its Continue row landed 19 minutes
*after* the 225 grill row — the re-arming shape step 0 warns about — but it had
not in fact been grilled, so it stays in scope.

**Measured off the HEAD blobs, and the working-tree form is a detector that
cannot fail** — caught inside this slice, which is why it is written down rather
than quietly fixed. Run against the working tree, `grep -cE '\b(222|226|227|228)\b'`
over the grill headings returns **1**: this slice's own heading, *"Objective
grill of Slices 222, 226, 227, 228"*, matches the search for prior coverage of
those slices. The distinct-grill count is inflated the same way — **24** in the
tree, **23** at HEAD. That is CLAUDE.md's *"an assertion tripped on its own
explanation"* and 225.1's finding in 218.1, arriving in the scope-setting step of
the grill that re-derived them:

```
git show HEAD:ROADMAP.md > /tmp/r.md; git show HEAD:ROADMAP-archive.md > /tmp/a.md
grep -hoE '^## Slice [0-9]+ — Objective grill of Slices [0-9, -]+' /tmp/r.md /tmp/a.md \
  | sed -E 's/^## Slice ([0-9]+) .*/\1/' | sort -n -u | wc -l          # 23
grep -hoE '^## Slice [0-9]+ — Objective grill of Slices [0-9, -]+' /tmp/r.md /tmp/a.md \
  | grep -cE '\b(222|226|227|228)\b'                                   # 0
```

**A scope check for a NEW slice is read from the commit that predates it**, not
from the tree that already contains it.

Full report: `.roundtable/grill-objective-222-226-227-228-2026-08-31.md`.

1. [x] **229.1 — DONE. `icon.astro`'s deprecated-glyph set was a hand-typed
       mirror that no gate can see, and it is now derived.**

       *Accept* — properties, never predicted values:
       - Every load-bearing count in the four slices is re-derived
         independently, and each either holds or the disagreement is recorded.
       - Any candidate finding is red-proved by injection, with the injection
         confirmed to have landed, **before** it is written up — and finding it
         already gated is a satisfying outcome, not an off-plan one.
       - The rendered artefact is compared, not the diff that made it.

       **Everything the four slices decided survives.** 227's numbers re-derive
       exactly — 9,109 / 95,046 / 26 (by three independent derivations) / 9.6% /
       93 kB / 68 kB at `/26` and 148 at `/12` / 85,937 B = 83.9 kB, so 227.1's
       point that *"more than everything else we ship"* was true at 148 and false
       at 68 is confirmed. 226.1's probes all reproduce in a **second** cloud
       container a day later, including `check:po-app` 19/19 exit 0 with the
       missing root hoist still absent — so its one open inference is now two
       readings on two dates. 228.1's sweep is lossless at **15/15 byte-identical
       moved sections**, verified with a parser written here rather than the
       sweep's own, and its `+2,381` archive delta matches the git blobs exactly.

       **The grill's best candidate finding was REFUTED, and recording that is
       the useful part.** 227.3's guard compares a *count*, so a glyph **rename**
       passes it. Renaming `.bo-icon--doc` → `.bo-icon--doczz` in the source CSS:
       core exits **0**, `api.json` still declares 26 variants, and the guard is
       silent — exactly as predicted. But `npm run docs:build` exits **1**:
       `check-markup FAILED — 116 problem(s) across 165 file(s): unknown class
       "bo-icon--doc"`. `packages/core/scripts/check-markup.mjs dist` reconciles
       every rendered `bo-*` class against `api.json` and runs in the docs build
       chain, so glyph names are guarded one layer up by a gate written for a
       different reason (32.2). Hypothesis dead.

       Two injection notes, both this repo's own base rate landing again: the
       first attempt used `docZZ` and went red on **stylelint's naming pattern**
       — a red for the wrong reason, the mirror image of the green red-proof
       trap; and the refutation then reproduced *by accident* when a later build
       failed identically because core's `dist/` still carried the injected
       `api.json` after the source was reverted. Two firings, one unplanned.

       **What `check:markup` structurally CANNOT see is which glyphs are
       deprecated**, because a wrongly-listed glyph is still a class the
       framework ships. `deprecatedGlyphs = ['settings','barcode','building',
       'user']` was hand-typed against four `/* DEPRECATED` blocks in the same
       stylesheet. Deprecating a fifth would have left the page showing it among
       the eight that "earned their place", under a badge still reading 4, with
       nothing failing — and that set is the page's published answer to *which
       glyphs should I stop using*. Same page, same class, one step on from
       227.1's divisor and 227.3's unasserted denominator.

       **Fixed by derivation, not by refreshing the list** (217.2/220.1's rule).
       Read from the **unminified** shipped css — minification drops the comments
       that carry the deprecation — and reconciled against an independent count
       of the markers themselves, so a partial parse fails as well as an empty
       one. **No hand-typed floor**, for 227.3's stated reason: a literal minimum
       would be the very decaying constant 227.1 removed from this block.

       **Red-proved in both directions, through the built page**, with each
       injection confirmed present before the build:

       ```
       A  stray "DEPRECATED", no glyph selector after it
          markers=5 derived=4   ->  docs:build EXIT=1
          "icon: parsed 4 deprecated glyph(s) … but it carries 5 DEPRECATED marker(s)"
       B  a real DEPRECATED block above .bo-icon--close (not one of the eight)
          markers=5 derived=5   ->  docs:build EXIT=0
          rendered badge 4 -> 5, "close" enters the deprecated cluster
          (baseline page: badge 4, no "close" anywhere in that region)
       ```

       **Verified against the RENDERED artefact, not the diff**: with the
       stylesheet untouched, `/components/icon/index.html` is **byte-identical**
       before and after — two full clean builds, diffed. The derivation
       reproduces the hand-typed list exactly; what it removes is the silence.

       **Not verified, said plainly:** cloud wake — no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not
       run. Nothing here rests on a rendered image: the change is build-time only
       and the rendered page is byte-unchanged, which was measured rather than
       assumed. The whole-tree browser gates are the evidence that nothing broke.

2. [x] **229.2 — the improvement question, asked of what 229.1 touched, found a
       stale claim on FIVE gate headers — including the one that refuted 229.1's
       hypothesis. Base rate measured before fixing: 5 of 5.**

       `check-markup.mjs`'s header — the gate that caught the renamed glyph —
       reads *"OWES a --self-test (roadmap 42.3): a detector this easy to fool
       must prove it can fail."* It does not owe one. It carries a real
       `process.argv.includes('--self-test')` branch with four cases, and

       ```
       node packages/core/scripts/check-markup.mjs --self-test
       # self-test passed — the detector can fail                       EXIT=0
       node apps/docs/scripts/check-selftests.mjs
       # 46 gates classified: 15 heuristic (all self-tested), 31 exact
       ```

       **Measured before touching anything, because a 1-of-1 is 94.11 ceremony
       and a class is not.** Five files carry that line — `check-markup`,
       `check-forced-colors`, `check-notes`, `check-loop-vocab`, `check-floor` —
       and **5 of 5** have the branch. The meta-gate says every one of the 15
       heuristic gates is self-tested, so the sentence is false everywhere it
       appears, and the gate that would notice is the one whose passing proves
       the debt paid.

       Fixed in place — five comment headers, no behaviour — because it is
       smaller than explaining, which is the operating rule's own test. Each
       `--self-test` re-run green afterwards, and `check:selftests` still reports
       15 of 15.

       **This is the exact INVERSE of the class 227.2 refused, which is why it is
       fixed rather than argued.** 227.2 refused a gate for *"a literal
       duplicating a fact something else can read"* — semantic, base rate 0.
       This is a *stated debt contradicted by a gate that already runs*: exact
       (does the file contain the branch?), and base rate 5.

3. [x] **229.3 — REFUSED, and not on the base rate the item expected to decide
       it. Both candidate predicates were built and red-proved, and both are
       GREEN on a reworded instance of the exact defect they exist to catch.**

       Raised by 229.2 rather than acted on, because adding a gate is a decision
       and 229.2 was a comment fix. The predicate is exact and one line from data
       `check-selftests.mjs` already holds: it classifies each gate as heuristic
       or exact and already knows whether the branch exists, so "and its header
       does not say it owes one" is a string test over the same file it just
       read — not the semantic predicate 94.11, 216.2, 217.2, 220.2 and 227.2
       each refused.

       **The argument against, stated so it is not re-derived:** after 229.2 the
       base rate is **0**, and 94.11's finding is that a gate shipping to fire on
       zero things is ceremony however cheap. The counter is that this one
       *ratchets* — `check:wrong-choice` is the precedent for an executable
       ratchet whose base rate the fixing pass drove to near-zero.

       *Accept* — a property, not a prediction:
       - Either `check:selftests` gains the assertion **and is red-proved by
         injecting the old sentence back into one gate, with the injection
         confirmed present before the run**, or the refusal is recorded with the
         base rate that decided it. **Both close this item.**
       - If it is added, it must not fire on the five files this slice corrected
         — verified by running it, not by reading the regex.

       **Closed on the second branch — refused. The base rate is 0 as predicted,
       but that is the WEAKEST of the three readings below and it is not what
       decided this.** The item framed the choice as "ceremony (94.11) versus a
       ratchet (`check:wrong-choice`)". Building both candidates answers a
       question neither horn asks: *can this predicate go red on the defect at
       all?* Probe kept out of the tree deliberately (a throwaway, per 134.3's
       rule), the readings reproduced with the commands below.

       Two candidates, over the **15** heuristic gates that carry a
       `--self-test` branch:

       - **NARROW** — the exact sentence 229.2 removed, both comment styles:
         `/^\s*(?:\*|\/\/)\s*OWES a --self-test\b/m`. Base rate **0**.
       - **BROAD** — `owes` within 120 chars of `--self-test` or `@heuristic`,
         either order. Base rate **2**, and **both are FALSE POSITIVES**:
         `check-resume-charter.mjs` (*"This is what the `@heuristic` tag
         owes"*) and `check-resume-slice-ids.mjs` (*"The `--self-test` below is
         what that tag owes"*). Both files have the branch; both sentences are
         correct prose explaining what the tag obliges.

         > **CORRECTED 2026-08-31 by slice 232.1 — the base rate is 7, not 2,
         > and the 2 was measured with a regex blind to the past tense.**
         > `owes?\b` is `owe` + optional `s` + a word boundary, so it cannot
         > match `owed` — and `owed` is the wording 229.2's own fix used, in all
         > five headers it corrected (*"the debt is PAID, and this line used to
         > say it was owed"*). Re-measured over the same 15 branch-carrying
         > gates, whole-word and tense-inclusive:
         >
         > ```
         > grep -rlwE 'owes|owed' apps/docs/scripts packages/core/scripts \
         >   --include='check-*.mjs' | grep -v check-selftests.mjs | wc -l    # 7
         > ```
         >
         > The complete false-positive set is `check-resume-charter`,
         > `check-resume-slice-ids` **plus** `check-floor`, `check-forced-colors`,
         > `check-loop-vocab`, `check-notes` and `check-markup` — and those five
         > are exactly the files 229.2 corrected, which this item's own Accept
         > names as the set it must not fire on. **The refusal is not
         > overturned; it is strengthened** — BROAD costs seven false positives,
         > not two, and is blind to the same rewording either way.
         >
         > The `grep -v check-selftests.mjs` is load-bearing and 232.1 published
         > its 17-file widening figure without it visible: unanchored
         > `owe[sd]?\b` returns **18** files as written and **17** with that
         > exclusion. The excluded file is the meta-gate itself, which names the
         > vocabulary by definition.

       **Red-proved in three directions, each injection confirmed present in the
       file before the run** (`grep -n` on the injected line; the denominator
       stayed 15 throughout, so nothing was silently reclassified):

       ```
       baseline                                   NARROW 0   BROAD 2
       inject the verbatim 229.2 sentence
         into check-floor.mjs (line 16)           NARROW 1   BROAD 3   <- both live
       inject a REWORDED stale claim instead:
         "This gate still needs a --self-test
          (roadmap 42.3) before it can be
          trusted."          (line 16)            NARROW 0   BROAD 0   <- both BLIND
       ```

       > **CORRECTED 2026-08-31 by slice 232.1, replaying every row.** Two
       > things are wrong in that table and neither touches the conclusion.
       >
       > **The third row's `BROAD 0` is not a count.** Rows 1 and 2 report how
       > many of the 15 files the predicate matches; row 3 reports whether it
       > fired *on the injection*. As a count it is **2** — the injected
       > sentence contains no `owe` word, so the two standing false positives
       > are still there. The `<- both BLIND` annotation carries the real
       > meaning, which is why the argument survives the mixed units, but the
       > number as printed is wrong. Same shape as the base rate above: a defect
       > in what shipped BESIDE a correct claim.
       >
       > **And under the corrected predicate the red-proof's own injection site
       > cannot discriminate at all.** `check-floor.mjs` is already one of
       > BROAD's seven tense-inclusive false positives, so that column reads
       > 7 / 7 / 7 — flat across the baseline and both injections. Replayed in
       > memory (the file is read, never written; the tree was asserted
       > unchanged afterwards, and each mutated string was asserted to contain
       > the injected sentence before being measured):
       >
       > ```
       >                                NARROW   BROAD-as-published   BROAD-tense
       > baseline                          0             2                 7
       > inject verbatim 229.2 sentence    1             3                 7
       > inject REWORDED stale claim       0             2                 7
       > ```
       >
       > Read case-insensitively, as 229.3 measured it — the injected sentence
       > says `OWES`, and a case-sensitive replay reads row 2 as 2, not 3.
       > Denominator 15 throughout, re-derived from the branch test rather than
       > carried.

       The third row is the refusal. That injected sentence is a genuine
       instance of the defect — a gate that has a `--self-test` branch, with a
       header stating it does not — and **both detectors report clean**. One
       synonym away from the wording it was written against, the gate is green
       on exactly what it exists to catch. BROAD is strictly worse than NARROW:
       it buys two false positives and is blind to the same rewording.

       **The general form, which is why no third regex was attempted.** What
       separates *"the `--self-test` below is what that tag owes"* (correct)
       from *"this gate still needs a --self-test"* (stale) is what the sentence
       MEANS, not its shape. That is 94.11's line exactly — *"a comment precedes
       this literal" is checkable; "a comment explains this literal" is
       semantic* — and it is the same class refused by 216.2, 217.2, 220.2 and
       227.2. Five prior refusals of this shape, and the sixth was measured
       rather than argued from them.

       **The ratchet counter-argument does not transfer, and that was checked
       rather than waved off.** `check:wrong-choice` ratchets because its
       predicate is a **required shape on every page** — it walks
       `src/pages/components/` and `src/pages/patterns/` and asserts a
       `<strong>Not …</strong>` clause is PRESENT, so every new page that omits
       one fires it. This proposal's predicate is a **forbidden phrasing**,
       which can only fire on a verbatim recurrence of a sentence that now
       appears nowhere. A presence-over-the-corpus gate and an
       absence-of-one-string gate are not the same instrument; the precedent
       covers the first.

       **What is NOT claimed:** that the underlying defect does not matter. It
       is real — 229.2 measured it at 5 of 5, and it misled the wake that found
       it. The finding is that this defect has no exact textual signal, so the
       thing that catches it is a wake reading the header, which is what
       happened.

       ```
       # base rates (both predicates, over the 15 heuristic gates with a branch)
       grep -rlE "process\.argv\.includes\(['\"]--self-test['\"]\)" \
         apps/docs/scripts packages/core/scripts --include='check-*.mjs' | wc -l   # 15
       grep -rniE 'owes?\b' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs'                    # 2 — BLIND TO `owed`; see 232.1
       grep -rlwE 'owes|owed' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs' | grep -v check-selftests.mjs | wc -l   # 7, the honest count
       grep -rn 'OWES a --self-test' apps/docs/scripts packages/core/scripts       # 0
       node apps/docs/scripts/check-selftests.mjs   # 15 heuristic (all self-tested)
       ```

       **Not verified, said plainly:** cloud wake — no Podman and no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. **Nothing here rests on a rendered image, and nothing here is a
       code change at all** — the outcome is a recorded refusal; the working
       tree carries only `ROADMAP.md` and the loop-log files. The injections
       were reverted and `git status` was confirmed clean before committing.

4. [x] **229.4 — 227.2's base rate is not re-derivable, and the base rate IS
       the refusal. Record the command; do NOT add a gate.**

       227.2 refused a gate on *"30 files … 50 numeric literals … the
       unrestricted form returns 308"*, and its own text says the probe lives in
       that wake's scratchpad. `git log --name-only 96bd852a` shows the commit
       carried only `ROADMAP.md` and `icon.astro`, so the instrument is gone.
       Reconstructing it from the predicate the write-up describes gives a
       different answer for every defensible scope — **18**, **23** or **34**
       files — and the claimed 30 sits inside that spread without being
       reproducible from anything committed.

       This is not a claim that 30 is wrong. It is that **it cannot be checked**,
       and here that matters more than usual: 227.2's own reopen condition is a
       *re-measurement* (*"if it is 1-of-1 this is 94.11 ceremony and should be
       refused a fourth time"*). A refusal whose reopen path is a number nobody
       can re-run is closed by accident rather than on the merits.

       **The refusal still stands on its other leg**, verified independently
       here: *"a literal is an operand" is checkable; "a literal duplicates a
       fact something else can read" is not* — 94.11 exactly. That leg needs no
       base rate.

       *Accept* — properties, not values:
       - The commands that produce 227.2's base rate are recorded somewhere a
         later wake can run them, **or** the claim is restated as the
         unreproducible reading it is, with the reconstruction spread named.
       - Whatever the re-measurement says, a **gate is not added** unless the
         semantic leg above is first shown to be wrong. Finding the base rate
         higher than 30 is therefore a satisfying outcome that still refuses.

       **Left OPEN, not owner-blocked** — any wake can take it, and the honest
       first outcome is a paragraph, not a gate.

       **DONE — the file half is now re-runnable and 30 is not among its seven
       readings; the literal half is restated as unreproducible, with the
       spread named. No gate added (2026-08-31, cloud wake).** Both branches of
       Accept bullet 1 are taken, because the claim splits cleanly into a half
       that reduces to a command and a half that cannot.

       *The file half — recorded, and it refutes the 30.* Run against
       **`96bd852a` itself**, the commit that published the number, so this is a
       reproduction attempt rather than a re-measurement of a moved tree. It
       reads identically at `HEAD`:

       ```
       REV=96bd852a
       CODE='\.(mjs|js|ts|tsx|astro|cjs)$'
       SIG='readFileSync|statSync|gzipSync|require\.resolve|import\.meta\.glob'
       GEN='(api|behaviors|contrast|floor|keymap|events|acr|scales|dsa-scores'
       GEN=$GEN'|patterns-index|patterns|rf-profile|versions|suite|framework|build-id)\.json'
       sig() { git grep -lE "$SIG" $REV -- | sed 's/^[^:]*://'; }
       gen() { git grep -lE "(import|require).*['\"][^'\"]*$GEN['\"]" $REV -- | sed 's/^[^:]*://'; }

       git grep -lE 'readFileSync' $REV -- | wc -l                       # 18
       sig | grep -E "$CODE" | grep -vE '/tests?/|^examples/' | wc -l    # 23
       sig | grep -cE "$CODE"                                            # 25
       sig | wc -l                                                       # 32
       { sig; gen; } | grep -E "$CODE" | sort -u | grep -vE '/tests?/|^examples/' | wc -l   # 33
       { sig; gen; } | grep -E "$CODE" | sort -u | grep -v '^examples/' | wc -l             # 34
       { sig; gen; } | grep -E "$CODE" | sort -u | wc -l                                    # 36
       ```

       **Seven defensible scopes span 18-36 and none of them is 30.** The
       differences are the three choices 227.2's prose leaves open: whether
       prose files that merely *name* `readFileSync` count (32 vs 25 — seven
       markdown files match, this roadmap among them), whether "an import of a
       generated `*.json`" is a sixth signal or a gloss on the five, and whether
       `examples/` and `packages/core/tests/` are in scope. 229.4's own premise
       named **18, 23 and 34**; all three are reachable and are the 1st, 2nd and
       6th lines above, so its spread holds — it simply carried no command, and
       these are it.

       *The literal half — unreproducible, and for a deeper reason than a
       missing command.* "Numeric literals … on lines that also carry a
       live-derived identifier" needs a **taint implementation**, and prose
       cannot pin one. Three successive versions were built here, each
       defensible, on the same 33-file set at the same commit:

       | how far liveness propagates | restricted | unrestricted |
       |---|---|---|
       | one hop, right-hand side bounded to its own line | 22 | 574 |
       | fixpoint, right-hand side bounded to its own line | 33 | 574 |
       | fixpoint, right-hand side running to the next declaration | 61 | 574 |

       The third is the correct one and the first two are undercounts, provable
       without any judgement: 227.2 names `primitives.astro:24`,
       `tokens.astro:81` and `ai-assistants.astro:30` as sites of the pattern,
       and the first two versions score all three **zero** — the chain there is
       `readFileSync` → `src` → `primitivesCss` → `KNOBS` → `knobs.length < 4`,
       three hops with the read on a **continuation line**. A second axis moves
       it again: counting a bare `=` as a comparison is the difference between
       **61 and 58**, and the file set between **61** (33 files) and **167** (the
       25-file scope), of which **112 come from `examples/po-app/server.mjs`
       alone** — one demo server whose whole body is taint-reachable.

       So the restricted count ranges over **22 · 33 · 58 · 61 · 152 · 155 ·
       167 · 173** and the unrestricted over **324 … 785** across the same
       choices. **227.2's 50 is produced by none of them, and its 308 is below
       every unrestricted reading taken here.** That is the honest verdict: not
       "30 and 50 are wrong", but that no stated predicate yields them, so the
       reopen condition 227.2 wrote for itself cannot be executed.

       *The instrument was red-proved twice by injection before any number above
       was quoted*, both confirmed present by `grep` before the run and reverted
       after, with `git status` clean:

       - one hand-typed literal against a live identifier added to
         `icon.astro`'s frontmatter (`const probeRatio = iconBytes / 7;`,
         landing at line 41) → restricted **7 → 8**, whole-file **7 → 8**.
       - the same expression injected into the TEMPLATE half instead
         (`<!-- probe {iconBytes / 7} -->` at line 122, closing fence at 121) →
         restricted stayed **7** while whole-file went **7 → 8**, so the
         build-time restriction discriminates rather than passing everything.

       **A reconstruction that reproduces the target number is a defect in the
       reconstruction until proven otherwise** — the sharpest thing this item
       produced, and it is not a restatement of the green-red-proof rule, it is
       that rule pointed at a *measurement* rather than a gate. An early scope
       here returned **exactly 30**, and it was wrong: the generated-json arm
       used `[^\n]*` in an **ERE**, where a bracket expression makes that "any
       character except backslash or the letter n". `import patterns from
       '…/patterns.json'` contains an `n` in `patterns`, so three real importers
       (`Gallery.astro`, `which-pattern.astro`, `patterns/index.astro`) were
       silently dropped and the count landed on the number being sought. Had it
       been believed, this item would have closed as "reproduced" on a broken
       instrument. The tell was not the number — it was that the three missing
       files were nameable.

       *Accept, against the properties as written:*
       - **Bullet 1 — met.** The file-level commands are recorded above and run
         from a clean checkout; the literal-level claim is restated as the
         unreproducible reading it is, with the spread named.
       - **Bullet 2 — met, and a gate is NOT added.** The semantic leg was not
         shown wrong and is not touched: *"a literal is an operand" is
         checkable; "a literal duplicates a fact something else can read" is
         not.* Every reading here is **higher** than 30, which 229.4 named in
         advance as a satisfying outcome that still refuses — and it is, because
         the base rate was never the leg the refusal stood on.

       **Not verified, said plainly:** cloud wake — no Podman and no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. Nothing here rests on a rendered image and nothing here is a
       code change: the diff is `ROADMAP.md` and the loop-log files. The probe
       was deliberately **not** committed — it is the throwaway 227.2's own
       write-up describes, and committing it would add the machinery this item
       exists to refuse; what is committed instead is the half that reduces to
       seven shell lines.

5. [x] **229.5 — `ENVIRONMENT.md`'s "measure from the git blob" bullet covers
       the after-figure form and not the diff-stat form, and the wake that wrote
       it made the uncovered error in the same document.**

       The 228 hand-off asserted *"`git diff --stat`'s own net (129 insertions −
       2,328 deletions = −2,199) matches 3,794 → 1,595 to the line."*

       ```
       git show --numstat --format='' d701e61 -- ROADMAP.md   # 158  2326
       ```

       158 − 2,326 = **−2,168** → **1,626**, the committed file. All four figures
       are working-tree readings taken mid-write-up, and the sentence claims they
       "match to the line" when they match nothing. **`ROADMAP.md`'s durable
       Slice 228 text is unaffected and correct** — it states `−2,321` / `+2,381`
       for the move and says outright that its after-figure predates its own
       write-up. The defect is confined to the ephemeral hand-off, which is why
       it is filed rather than fixed in place.

       Worth naming for *which* wake wrote it: the same one promoted "measure a
       regrowth cycle from `git show <sweep>:ROADMAP.md | wc -l`, never from the
       sweep's own prose" into `ENVIRONMENT.md`. That bullet names the
       **after-figure**; the error made beside it is the **diff-stat**. 192.1's
       shape again — the defect lands in what shipped beside the carefully-proved
       claim.

       *Accept* — a property: `ENVIRONMENT.md`'s bullet states the general form
       (**a figure describing a commit is read from the commit**) rather than the
       one instance, **or** it is recorded that the generalisation was weighed and
       refused as prose growth, with the reason. Both are satisfying; 158.2's
       cadence argument makes the second a real option rather than a cop-out.

       ---

       **LANDED 2026-08-31 (cloud wake, rule 4). The first arm was taken — the
       bullet now states the general form — and the deciding evidence is
       something this item did not know: the premise's own "confined to the
       ephemeral hand-off" is FALSE.**

       **The premise re-checks exactly, which is why the rest is worth
       believing** (CLAUDE.md: when the premise is itself an earlier wake's
       measurement, re-checking it is part of the criterion):

       ```
       git show --numstat --format='' d701e61 -- ROADMAP.md   # 158  2326
       git show d701e61^:ROADMAP.md | wc -l                   # 3794
       git show d701e61:ROADMAP.md   | wc -l                  # 1626
       ```

       158 − 2,326 = −2,168; 3,794 − 2,168 = **1,626**, the committed file. The
       quoted sentence was located verbatim rather than paraphrased — it is
       `d701e61:.roundtable/RESUME.md` line 87, surviving into `7be5e4ae` — and
       the hand-off's four figures are **internally self-consistent**
       (129 − 2,328 = −2,199; 3,794 − 2,199 = 1,595). That is the finding this
       item was missing and the reason the error survived review: it is not an
       arithmetic slip that a re-add would catch, it is a *provenance* error in
       which every number agrees with every other and none describes the commit.

       **The defect is NOT confined to the ephemeral hand-off.** `d701e61` is
       the commit that ADDED the bullet (`git show d701e61 -- .roundtable/ENVIRONMENT.md`
       → `9  0`), and its own **subject line** reads
       *"ROADMAP.md 3,794 -> 1,473 lines"* where the commit holds **1,626** — a
       153-line gap, and an instance of the *after-figure* form the bullet was
       being written to name, in the durable commit message, in the same commit.
       So the narrow form did not prevent the error it describes even at zero
       distance. That is the base rate a generalisation is supposed to move, and
       it is why the refusal arm was not taken: refusing would have left an
       instruction with a measured failure at n = 1 of 1 opportunities.

       **Third repo-wide instance of an instruction naming an instance rather
       than the property, and the first in `ENVIRONMENT.md`.**
       `grep -n "name the property" LOOPS.md CLAUDE.md .roundtable/ENVIRONMENT.md`
       returns `LOOPS.md:738` and `LOOPS.md:773` (the prose-page names, then the
       ratchet clause) and **0** in `ENVIRONMENT.md`; LOOPS.md:773 calls itself
       "the second time this playbook has paid for it".

       **A limit of the general form was found while writing it, and is carried
       rather than papered over:** a figure going into the *message* of a commit
       cannot be read from that commit, because it does not exist yet — which is
       exactly the case `d701e61`'s subject got wrong. The bullet therefore names
       the index as the third reading, `git show :<file> | wc -l`, **red-proved
       by discrimination** rather than asserted: staged a 3-line file, grew the
       working tree to 5, and the index kept reading **3** while the tree read
       **5**; re-adding moved it to 5. The probe file was removed and
       `git status --short` was empty afterwards.

       **Growth, stated rather than hidden:** the bullet goes **9 → 16 lines
       (+7)** (`git diff --cached --numstat` → `16  9`), covering three readings
       (size, delta, index) where it covered one. 158.2's cadence argument is the
       reason that number is quoted here instead of being left for lane 4 to
       find. **Three lines of it are a cut**, which is what held the delta to +7:
       the one-cycle regrowth consequence — "2,144 lines over ~34 hours" against
       a measured "+2,073 over 22 commits in 16h03m" — is the *effect* of the
       error, not the rule, and it survives one grep away at `ROADMAP.md:975-977`
       under Slice 228, which the bullet still cites.

       *Accept, against the properties as written:* **first arm met** — the
       bullet states the general form, keeps `e29c7c18`/214.1 as the original
       worked instance (re-verified: 73 − 1,549 = −1,476; 3,197 − 1,476 =
       **1,721** against its stated `3,197 → 1,650`), and adds `d701e61` as the
       second. The refusal arm was weighed and lost on the measurement above,
       not on preference.

       **Not verified, said plainly:** cloud wake — no Podman and no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not
       run. The diff is `.roundtable/ENVIRONMENT.md`, `ROADMAP.md` and the
       loop-log files; nothing here renders, and no code changed.

## Slice 228 — Standardize sweep: lanes 1-3 clean an eighth time, and lane 4 carries the finding again — the archive sweep is due a SEVENTH time (2026-08-30)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 (`grep -n 'P0' ROADMAP.md`
returns only closed slice headings) and GitHub intake **0 open issues**, asked
via the API (`list_issues` OPEN → `totalCount: 0`). Step 1 therefore had nothing
to triage. Rule 2: `dispatch_status.py` read
`Standardize 4 / 4 Continue rounds since 2026-08-30 20:25 OVERDUE` → **Standardize**.
Rules 3 (`3 / 3`, also OVERDUE) and 4 were not reached — rule 2 sits above them,
exactly as the previous hand-off predicted.

**Lanes 1-3: an eighth identical clean result**, matching the baseline 194, 197,
202, 206, 208, 214 and 224 established. Reported as `n of 4` per the playbook.

**The two ordinals differ and that is not a typo** — the lanes-1-3 clean count
is **8**, the archive-sweep count is **7**, because 224's sweep found its lane-4
finding in `ENVIRONMENT.md` rather than in the roadmap's length. Checked against
the headings rather than incremented from the last write-up: 214 says *"clean
for the sixth time"* and 224 is the seventh but states no ordinal, which is
exactly how an off-by-one gets inherited.

- **Lane 1 of 4** (`scan:dead-style -w docs`) — **0 dead** of **1,433** live
  inline declarations. Identical to 224.1's reading; 0 dead on screen but live
  in print.
- **Lane 2 of 4** (`report:css-repeats -w @busy-office/ui`) — 74 source files,
  242 rules, 230 distinct bodies, **still exactly 8 repeat groups**, shapes
  `x4(3) x3(3) x3(9) x2(3) x2(3) x2(6) x2(3) x2(3)` mapping one-to-one onto
  `LOOPS.md`'s standing table of eight. **No delta**, which is what this lane
  asks for — not the count.
- **Lane 3 of 4** (`report:prose -w docs`) — 118 pages, median 748, 9 over 2x
  the corpus median and 12 over a family median, **union = 14**. Every one of
  the 14 already carries a verdict.

  **Checked by SET MEMBERSHIP against the three verdict lists, not by a cite
  count**, because the obvious instrument here is a dead one: grepping each
  page's path out of `ROADMAP.md` + `ROADMAP-archive.md` returns 1-11 hits for
  all fourteen, so it reports 14 of 14 covered whatever the truth is — a page
  name appears in this repo's history for a dozen reasons that are not a prose
  verdict. The union resolves against **158.1's twelve** (data-table, richtext,
  which-pattern, form, editable-grid, list-report, calendar, money, combobox,
  tabs, layouts, output-form), **161.1's three** (motion, js-behaviors,
  design-language) and **178.3's** `/concepts/scale/` — with `tabs` and
  `output-form` no longer flagged and nothing flagged that is outside those
  sixteen.

**Lane 4 of 4 is where the finding is, and it is the same one as 208.1, 214.1,
177 and 165.1.** `report_loop_prose.py`'s `ratchet` block — read first, per the
playbook, never the delta — showed `ROADMAP.md 9 up, last cut f1be2485
(2026-08-30)`: the signature `LOOPS.md` names verbatim as this lane's finding,
*"a file the loop reads every wake accumulating with no cut behind it"*. Rule 4
reads this file top-to-bottom every wake, and it was walking **3,794 lines** to
find **3 open items**.

The other seven files in the dispatcher region were read for a class change and
none had one: `CLAUDE.md` (29 up, never cut) and `DESIGN.md` (22 up, never cut)
are the two standing HONEST verdicts — 193.1 executed 167.1's reopen condition on
`CLAUDE.md` and decided *fold nothing, retire the watch* — `ENVIRONMENT.md` and
`LOOPS-archive.md` carry 224.2's verdicts, and both archives are out of scope for
167.1's stated reason.

1. [x] **228.1 — DONE 2026-08-30 (cloud wake). Seventh archive sweep: 15 closed
       slices, `ROADMAP.md` 3,794 → 1,473 lines.**

       *Accept* — properties, not predicted values:
       - The target set is DERIVED from the checkboxes at move time, and the
         deriving instrument is red-proved before its output is used.
       - Every moved section is byte-identical in the archive, verified against
         the git blob rather than against the script that moved it.
       - `check:slice-refs` reports the same figures either side of the move.

       **Scope, on 177's instrument unchanged** (nearest preceding H2 of any
       kind; the open set derived from `N. [ ]` checkboxes, never hardcoded —
       165's own bug):

       ```
       # the command is in ROADMAP-archive.md, Slice 177, verbatim
       OPEN: [15, 112]
       15 closed slices carrying 2366 lines here; 0 already in the archive
         # 2,366 of 3,794 lines = 62.4% of the live file was closed history
       ```

       **The instrument was red-proved by injection before its output was
       used**, per CLAUDE.md's base rate on first outputs. An open checkbox was
       injected into Slice 224 on a scratch copy, its presence confirmed
       (**1** occurrence) *before* the parse, and the scope pass moved
       `OPEN [15, 112] → [15, 112, 224]`, targets **15 → 14**, lines
       **2,366 → 2,309**. It can distinguish an open slice from a closed one.

       **Swept: `ROADMAP.md` 3,794 → 1,473; `ROADMAP-archive.md` 27,208 →
       29,589.** Fifteen slices — 211, 214-227 — moved verbatim in the order
       they held in the live file, each leaving the standing one-line pointer.

       **The line accounting reconciles exactly, in both directions**, which is
       what a move owes over a rewrite: the live file loses `2,366` body lines
       and gains `15 × 3` pointer lines = **−2,321**; the archive gains 15
       headings plus the same 2,366 body lines = **+2,381**. Both match the
       measured deltas to the line.

       **Lossless, verified against the git blob and by an independently
       written parser** — not against the dict the sweep script built, which
       would be self-consistent by construction:

       ```
       15/15 moved sections byte-identical to HEAD:ROADMAP.md
       194 untouched live sections, 0 changed
       192 pre-existing archive sections, 0 changed
       3 open checkboxes before, 3 after
       ```

       **Citation-neutral, measured rather than asserted** — the gate was run
       against `HEAD`'s two files and then against the swept pair, and every
       figure is identical:

       ```
       npm run check:slice-refs -w docs
       # before: 453 citation(s) checked (246 cited, 2 known-dangling), 209 slice numbers
       # after:  453 citation(s) checked (246 cited, 2 known-dangling), 209 slice numbers
       ```

       **The number above is the file after the MOVE and before this write-up
       was appended to it** — 209.1's correction. The post-commit figure is in
       the loop log row and in `.roundtable/RESUME.md`.

       **And 209.1's correction is not history: it bit again in this very
       slice, on the SIXTH sweep's figure, while measuring the regrowth
       cycle.** 214.1's write-up and its log row both say `3,197 → 1,650`.
       The file as committed is **1,721 lines**:

       ```
       git show --format='%H %cI' -s e29c7c18            # 2026-08-30T00:46:02+00:00
       git show e29c7c18:ROADMAP.md | wc -l              # 1721, not 1650
       git rev-list --count e29c7c18..HEAD -- ROADMAP.md # 22
       ```

       Read off the log row, this cycle's regrowth publishes as **2,144 lines
       over "~34 hours"**; measured from git it is **+2,073 over 22
       ROADMAP-touching commits in 16h03m — 94.2 lines per commit**, against
       177's recorded cycle rates of 30.4 / 51.0 / 69.5 / 66.6. Both of the
       first pair were wrong, and neither is re-derivable from the log.

       **So the rule, stated as a property rather than as this slice's
       numbers:** a sweep's own stated after-figure is the file *before its
       write-up landed*, so it is never the cycle's starting line count.
       Measure a regrowth cycle from `git show <sweep-commit>:ROADMAP.md | wc -l`.
       Carried into `ENVIRONMENT.md`'s measurement-discipline list, because
       this is the second wake to pay for it and the first correction stayed
       inside the slice it corrected.

       **Not verified, said plainly:** this is a markdown-only change. No
       rendered surface moves, so the 1440/390 light-and-dark screenshot lane
       — which this container cannot run, having no Podman and no
       `localhost:8081` — is not evidence this change needed. Nothing here
       rests on a rendered image.

## Slice 227 — Polish round 1 on `component/icon`: a stale count that was also a DIVISOR (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 226 — the fixed `check:po-app`, run in a cloud container for the first time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 225 — Objective grill of Slices 218, 219, 223, 224: a citation that quoted its own re-run command into permanence, and everything else held (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 224 — Standardize sweep: three of four lanes clean, and the fourth found a stale trap in the file Step 0 reads every wake (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 223 — owner call: move the shipped htmx integration and both example apps to htmx 4, dropping `apps/docs`'s boosted navigation in the process (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 222 — `check:po-app` after 211.1: the previous wake's open question, answered by measurement — 2 of 19 becomes 1 of 19 here, and 19 of 19 on CI (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 221 — Owner direction: pin htmx to 4, and plan the framework update. Slice 114's refusal is SUPERSEDED, and its own reopen condition is half-met (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 220 — Polish round on `breadcrumb`: the count-bearing cite class pays out a second time, and the pick was a filed defect rather than a tie-break (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 219 — the `aria-current` pairing gate stops at the docs dist, and the one violation it would have caught lived outside it (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 218 — Owner-forwarded review: `data-state`/`data-status` conflation, scoped to two components not the framework (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 217 — Polish round on `sidebar-nav`: a cite that was EXACT when written and decayed two days later, and the count-bearing class measured at 6 of 240 (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 216 — Polish round on `data-table`: a DSA cite that was already stale on the day it was scored, and a cloud wake lapped by 37 slices (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 215 — Objective grill of Slices 211, 213, 214: the open item's refusal cites a page that does not say it, and every container htmx measurement ran a version the app does not ship (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 214 — Standardize sweep: lanes 1-3 clean for the sixth time, and lane 4 carries the finding again — the archive sweep is due a SIXTH time, one day after the fifth (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 213 — P0: a windowed-list spacer is sized from ONE sampled row that is not representative, so every evicted chunk is 49px short and re-loading it jumps the scroll (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 212 — Objective grill of the 200/208/209 window: a refusal's own base rate missed the declaration its cited gate names in its header, and the arming set needed narrowing for the third grill running (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 211 — two things 208.3's root-cause turned up: a reference app that cannot run without the public internet, and a scroll-anchor assertion nobody had ever exercised in a container (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 210 — the motion-literal gate refuses itself: 0 of 23 under its own wording, and its only three reds under a wider one are three right answers (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 209 — Objective grill of Slices 205, 208: the sweep proved itself against a state it never committed, and the floor script publishes a prefixed version its sibling filters out (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 208 — Standardize sweep: the fifth clean result came from three lanes, and the fourth lane — unread by all four prior sweeps — was carrying the finding (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 206 — Standardize sweep: fourth identical clean result, and one genuine candidate examined and correctly left alone (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 205 — `check:rf-floor` says "every use of a feature above Chrome 108 is guarded" while checking a fixed list of six (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 204 — P0: `check:claims` turned CI red for three commits by asserting a claim the headless browser structurally cannot evaluate (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 207 — Objective grill of Slices 204, 206: an environment fact went stale within the same day, and the self-healing gate absorbed it with no code change (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 203 — Objective grill of Slices 199-202: the P0 fix's own gate re-verified by injection, two triage refusals confirmed against source (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 202 — Standardize sweep: clean, and the two things this window's own new artefacts might have duplicated, checked directly (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 201 — P0: two undefined token references silently deleted the declarations that named them (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 200 — triage: an external "micro-motion UX review" proposal, checked against the shipped CSS before anything was filed (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 199 — the two things 193.2 left open: a denominator it could not reproduce, and a refused decision whose trigger had already fired (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 198 — Objective grill of Slices 193, 196, 197: a clean control, re-derived rather than re-copied (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 197 — Standardize sweep: all three standing lanes clean, delta 0 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 196 — Objective grill of Slices 190, 191, 192 (the artefact half): twelve measured claims reproduce, and the thirteenth was reasoned out beside them (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 195 — Objective grill of Slices 190, 191, 192 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 194 — Standardize sweep: the previous sweep's own fix pointed at the next one (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 193 — Objective grill of Slices 186, 189, 190, 191: the window's artefact claims all hold, and the one obligation it left behind was never read (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 192 — Objective grill of Slices 186, 189, 190, 191 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 191 — Standardize sweep: three lanes clean, and the fourth was reading a number its own command cannot print (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 190 — Objective grill of Slices 173, 185, 187: the measured claims all held, the reasoned ones did not (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 189 — Objective grill of Slices 173, 185, 186, 187 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 188 — the release now ships the front door, and the tag assertion is replaced rather than dropped (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 187 — Standardize sweep: three clean lanes, and the one duplicate they cannot see (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 186 — Objective grill of Slices 180, 183, 184: the loop's self-descriptions are the thinly-gated surface, and the hand-off is wrong at HEAD (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 184 — rule 5 has read ten-day-old numbers for ten wake-dates, and the Accept criterion that was supposed to prevent it stopped holding the day it was ticked (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 185 — `create-ui` is RELEASED, and two of this slice's own diagnoses were wrong (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 183 — the visual backlog that waited eight wakes, cleared (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 182 — Polish round on `state-patterns`: the rubric cited the bug, not the fix (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 180 — P0: a loop-name tally is read as a slice citation, and `main` has been red since (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 179 — Objective grill of Slices 173, 176, 177, 178 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 178 — Standardize sweep: the split that outran its own instrument, and a page that disagrees with itself (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

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
3. [ ] **112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR
       ANSWERS (grilled 2026-08-29 at the owner's request; full report
       `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).** The
       block is now *precise*: every precondition the pilot set for itself has
       landed, so briefs are the only remaining input, and four questions
       decide whether they are worth spending.

       - **All four self-imposed gates are met.** Substrate complete
         (`patterns.json`: 39 patterns, **39/39** carrying states, data
         contract and wrong-choice); llms.txt coverage present (83
         `patterns/` refs for 39 pages); 110.4/109.3 landed; wrong-choice debt
         down to 1, and that one is the deprecated `date`.
       - **Part of the superstructure already shipped without the verdict.**
         Q7 said the "Which pattern should I use?" page comes *after* the
         verdict; it shipped as 112.5, generated from `patterns.json`. Half of
         Q7 honoured (canonical source), half not (no verdict). **Recorded,
         not actioned** — the decision with teeth gated only 112.4, and
         un-shipping a generated docs page to satisfy a sequencing clause
         would be ceremony. What it does establish: the verdict no longer
         gates anything a wake can build, only 112.4, which is itself blocked
         on 112.3. A closed loop with the owner on both ends.
       - **The suite answers a NEIGHBOURING question for free** — whether a
         correctly-picked pattern's anatomy suffices (GAP-17, 6 of 7 list
         screens). It must NOT count toward the bar: it measures completeness
         rather than discovery, and it was produced by an agent with repo
         access, so counting it is self-approval.
       - **"Briefs are burn-once" is asserted, not established** — the pilot
         agent is specified llms.txt-only with no repo access, so a fresh
         session arguably cannot see a brief that lives in the repo. Marked
         Hypothesis: the isolation is unverified.

       *Owner decisions needed (recommendations in the report):* is the pilot
       still worth the briefs (**yes, as 112.4's admission gate only**); how
       many (**five, not eight — the bar is an absolute count, so eight raise
       the hit-rate, not the standard**); does suite evidence count (**no**);
       and are briefs re-runnable (**test it with one brief before believing
       either way**).

       **OWNER DECISION 2026-08-29: agree, all four recommendations.** Pilot
       proceeds as 112.4's admission gate only; **5 briefs**, not 8; suite
       evidence (GAP-17-style) does **not** count toward the bar; and the
       burn-once assumption gets tested rather than believed — run the first
       real brief, then re-run that same brief text in a fresh no-repo session
       and compare the two agents' picks/answers before treating any brief as
       spent. If they diverge, brief scarcity is confirmed and 5 stands; if
       they agree, briefs are a re-runnable regression test and the "scarce
       resource" framing that blocked this for weeks no longer applies.

       **Still blocked on one input no wake can supply: the owner writing 5
       real ERP screen briefs with sealed picks.** Nothing else in this item
       is dispatchable until at least the first brief exists in
       `.roundtable/pilot-112/briefs.md`.

       *(original item, unchanged below)*

       **Original item, kept verbatim — BLOCKED ON OWNER BRIEFS —
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
       - **Briefs**: the owner writes **5** screen briefs from real ERP
         memory (revised down from 5-8 by the 2026-08-29 owner decision
         above — the bar is an absolute count, not a rate, so 8 only
         raised the odds of hitting it at 60% more owner time), unseen
         by the loop before the runs, each with the owner's own pattern
         pick sealed in a file the pilot agent can never see.
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

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 176 — Polish round 2 on `component/scan`: the score that was taken and never written down (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 181 — Owner: a PO-list screenshot, grilled for framework gaps (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 175 — Objective grill of Slices 169, 170, 172 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 173 — Owner: two demos that do not demonstrate (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

