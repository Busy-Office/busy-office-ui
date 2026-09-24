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
  gate scripts, so none of them may be ignored. **`.roundtable/**` and
  `STATUS.md` were the two exceptions and they are not exceptions: both are
  read, and `paths-ignore` is gone entirely** (312.2, 2026-09-07). The rule
  survives; only its exception list died. The `~4x` above still holds — it was
  sharding, not the ignore: sharding took wall clock 12.4 min → 184s, and one
  run today measures ~3 min wall / ~14.7 machine-minutes. What the removal
  costs is *more runs*, not slower ones.
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

## Slice 379 — Objective grill of Slices 345, 378: every headline figure reproduces at its own revision, and all twelve findings are in what shipped BESIDE the figure — 345.1's move of `display: inline-block` into the utility breaks a block spinner nobody measured, and 378 published totals read off a working tree (2026-09-24)

**Dispatched by rule 3** (`Objective 3 / 3 OVERDUE [320, 345, 378]`) after rule 1
read 0 open P0 and rule 2 read `2 / 4` (`dispatch_status.py`). **Narrowed:**
320 was grilled by Slice 322; 345 is in scope because 345.1 closed today, not
for its 2026-09-08 sweep.
Report: `.roundtable/grill-objective-345-378-2026-09-24.md` (2 finders + 2
adversarial verifiers, workflow `wf_528e77c3-118`; 26 claims reproduced, 12
findings, 12 survived, 0 refuted).

**What held:** `scan:dead-style` 10 on 8 at HEAD and 11 on 9 at 378's own
revision (clean `git archive` builds of both); 345's "38 of 52 from four source
lines" recounted from the built pages; all seven standing refusal premises
re-measured; the pasted recipe rotating (8 distinct rects in 8, red at 1 under
forced `display: inline`); lanes 2-4 of 378 on clean builds of four commits;
320.3's 8px chip gap live, red at 6.4px on the pre-fix build.

**Fixed in this commit:**
- **A block spinner lost its layout** (medium). A sized `<div>` ring centred
  with `margin-inline: auto` fell to the line start (offsetLeft 184 → 0), and
  `<div class="bo-stack bo-motion-spin">` computed `inline-block`, not `flex`.
  No shipped page uses either shape (`git grep bo-motion-spin`), and the change
  is unreleased, so it stays, with a **Migration** note in the CHANGELOG naming
  both shapes and the fix. A consumer's own `display: block` restores the ring
  (probe: offsetLeft 189 = centred).
- **An à-la-carte import un-hid a `hidden` spinner** (low): motion.css alone
  gave `<span hidden>` `display: inline-block`. The rule is now
  `.bo-motion-spin:not([hidden])`, and it stays `none` with or without the
  reset.
- **The ACR's 2.5.7 remark read "…combobox.ts, …context-menu.ts is a non-drag
  match"**: the verb now follows the list length (`extract-acr.mjs`).
- **LOOPS.md's Settled joined-control paragraph** quoted quantity's selector
  from before 376.4; it now quotes the shipped one.
- **AppTile's comment** said a badge is 37px tall; it measures 30px, so BOX's
  `block-size` pads the initials box up rather than capping it down.

**Corrected in place:** 345.1's closure (the demo box is 16×36, its rotating
rect 16-40px; drift was measured by the glyph's text Range, and the
bounding-rect centre could not fail; the demo carries a font size and a `<p>`
the recipe does not); Slice 345's `inline-size: 100%` refusal reason (dead in
block flow too; `login.astro`'s discriminator is `margin-inline: auto`, live
only inside a flex or grid parent); Slice 378's lane 3 totals (a working-tree
build, +135 uncommitted words) and lane 4's DESIGN.md premise (no longer the
slowest-growing file).

**Thesis (§6 step 1, the reading 377.7 asks for, recorded 05:50 with
`record_metric.py`):** npm
`@busy-office/ui` 16 downloads in the last week (daily 0, 2, 2, 1, 0, 0, 0),
`create-ui` 12; jsDelivr 41 hits a month; 0 stars, forks, or non-owner issues
or discussions. Latest published is 0.8.0 (2026-09-06). Not visible to any of
these: copies of `dist`, private mirrors, unpkg. Unchanged from Slice 377's
reading: adoption cannot be told apart from zero, and 377.5/377.6 are still
the owner's.

No new item: every finding was fixed or corrected in this commit.

## Slice 378 — Standardize sweep, **4 of 4 lanes, all clean**: the window touched every lane's input (two CSS fixes, a JS fix, prose), and no lane moved against the verdicts Slice 376 recorded that morning (2026-09-24)

**Dispatched by rule 2** (`Standardize 4 / 4 OVERDUE` — 376.2, 376.4, 377.1,
377.2) after rule 1 read 0 open P0. Each lane's own figure
(`scripts/loops/standardize_lanes.py`):

- **Lane 1** — *"0 dead style attribute(s) on 0 page(s)"*; per declaration 11
  on 9 pages, exactly Slice 345's standing refusals (unchanged since 376.1).
- **Lane 2** — *"7 body(ies) appearing more than once"*, the same seven groups
  as Slice 376; the one textual change is 376.4's quantity joint, whose
  selector now also matches `+ [type="hidden"] +` — same body, same x4
  joined-control group the Settled table already rules on. **Not unchanged by
  construction:** `git log --first-parent 85e8c6f5..HEAD -- packages/core/src/css`
  lists 376.2 and 376.4, so the lane read changed input and found no new repeat.
- **Lane 3** — the flagged union is the same 17 pages (every one in the
  20-page enumeration), total 119,198 -> 119,212 words from the 376/377 prose
  edits; no page crossed a line. [**Corrected by Slice 379:** both totals were
  read from working-tree builds carrying 135 words of the owner's uncommitted
  `/getting-started/screen-kit/` checkpoint. At the commits they are
  **119,063 -> 119,077** (`7ee51901` → `456f9966`); the flagged set is the same
  17 either way.]
- **Lane 4** — LOOPS.md's dispatch region: 0 of 16 sections moved. ROADMAP.md
  is 5 up since the 376.8 sweep (a real cut, `ce10de0d`). ENVIRONMENT.md 24 up
  and DESIGN.md 24 up keep their standing verdicts (224.2 / 332.1 -> 361
  HONEST; 167.1 item 5 HONEST, the control) — DESIGN.md's one new step is the
  373.3 remainder, a correction. [**Corrected by Slice 379:** "the control"
  was re-quoted without re-checking its premise. 167.1 called DESIGN.md the
  control as "the slowest-growing file measured"; on the report this lane
  read (its default window) it is +48.4%, against CLAUDE.md +14.7% and
  ROADMAP.md +14.3%. The HONEST verdict is not re-decided here.]

No consolidation, no new verdict, no item: a clean pass is the Exit (§3).

## Slice 377 — Objective grill of Slices 373, 374, 375, 376: all 47 load-bearing claims re-checked HOLD; the findings are two shipped pointer defects, a completion gate that cannot see a revision, and a product thesis no grill had asked about — adoption indistinguishable from zero, and the one real user unnamed (2026-09-24)

Report: `.roundtable/grill-objective-373-374-375-376-2026-09-24.md` (4 finders
+ 4 adversarial verifiers; 37 findings, 35 survived, 2 refuted). Record-only
corrections landed with this slice: 374.6's criterion count, 373.7's file
attribution, 376.8's figures, 374.5's missing CHANGELOG entry, a stale
`check-claims` comment, and LOOPS.md's 0fr/1fr Settled section brought to
376.2's state.

1. [x] **P0 · 377.1 — a real right-click does not open the context menu.** On
       `/components/data-table/` a trusted right press opens the menu on
       `contextmenu` and its own `pointerup` light-dismisses it (three drivers,
       1440 and 390); a synthetic `contextmenu` opens it, and no `check-claims`
       case exists. The page instructs "Right-click Vendor or Amount above."
       - **Accept:** a real right press (down, hold, up via CDP) on the Vendor
         and Amount headers leaves the menu `:popover-open` after release, at
         the cursor, at 1440 and 390 — in `check-claims`, red on today's build.
         The fix shape is argued in the item; say what it does on an engine
         that fires `contextmenu` after mouseup.
       - **DONE 2026-09-24.** `initContextMenu` now records whether a press is
         in progress (capture-phase pointerdown/up/cancel): a `contextmenu`
         that arrives mid-press opens the menu after the release, one task
         later, at the `contextmenu` coordinates; one with no press around it —
         Windows, which fires it after mouseup, and the keyboard menu key —
         opens immediately, as before. `popover="auto"` is kept, so light
         dismiss, Esc and item-click-to-close are unchanged (verified live: an
         outside click and Esc still close it). `check:claims` +4 (both headers,
         1440 and 390): all four red on the pre-fix build (open false, 506-929px
         from the cursor), green after; vitest +1 pins the ordering. The ACR's
         2.5.7 drag scan shortlisted the file once it named pointer events and
         refused to build — recorded as non-drag, with its reason (the gate
         doing its job). Jev: supported 0.93 (A 0.94, B 0.94).
2. [x] **P0 · 377.2 — the app-launch launcher's filter desyncs after Escape.**
       Escape empties the field (Chromium fires `search`, not `input`) while
       the grid stays filtered and the status still names the old query.
       - **Accept:** after one Escape with a query typed and a reopen, the
         visible tiles equal the set computed from the field's CURRENT value
         and the status agrees, DOM-compared, in a real-key `check-claims`
         case red-proved against today's build.
       - **DONE 2026-09-24.** The launcher re-runs its filter on the dialog's
         `close` event, which fires after the native Escape-clear on every
         engine, so the grid follows whatever the field holds — cleared or not
         — without depending on Chromium's non-standard `search` event.
         `check:claims` +2 (1440 and 390) asserts the invariant rather than
         re-implementing the filter: re-running the page's own filter on the
         reopened field changes nothing. Red on the pre-fix build (empty field,
         2 of 9 tiles, "2 applications match inv"), green after; the seven
         existing launcher claims still pass. Live at 1440/390 light/dark.
         Jev: supported 0.94 (A 0.93).
3. [ ] **377.3 — the completion gate cannot see a revision.** 2 of 30 closes
       since 2026-09-19 were false at HEAD when marked (373.3, 373.4); the
       rubric names no revision; no check reads git status; `build-id.json`'s
       dirty flag is constant in the container.
       - **Accept:** a close is verified on HEAD alone — e.g. `record_iteration
         --outcome landed` builds HEAD in a throwaway worktree and re-runs the
         item's named commands, or the rubric requires a HEAD-only build and
         the report quotes its sha. Replaying the 43cca240 close must FAIL it.
4. [ ] **377.4 — pointer coverage, named per behaviour.** 16 of 26 behaviours
       listen for pointer input; trusted events reach 8 in `check-claims`;
       presses from a focused state had no coverage before 2026-09-24; two
       comments call an in-page `el.click()` "real". Base rate of a synthetic-
       only path being broken under real input: about 1 in 9.
       - **Accept:** a `check:pointer-coverage` meta-gate (`@heuristic`, with
         `--self-test`) fails when a behaviour with a pointer listener has no
         CDP-input case, unless it is in an EXEMPT map with a reason; the two
         mislabelled comments are gone. Measure its base rate before wiring it.
5. [ ] **OWNER · 377.5 — release the unreleased fixes, or record why not.**
       231 commits and eight framework defect fixes (four P0) since 0.8.0
       (2026-09-06). The one consumer pins 0.8.0 and vendors only the CSS, so
       375.9, 376.2, 376.4 and 374.5's 6x smaller default export are fixes it
       does not have. Publishing is owner-triggered. Either outcome closes it.
6. [ ] **OWNER · 377.6 — is busy-office-erp the named first user?** Its ADR-0016
       names this package the reference implementation of its runtime-UI
       contract; nothing in this repo's steering documents names it. If yes:
       the Objective names it, and one checkable property (its contract's
       §7.1 conformance against current `dist`) stands in for "serves them".
7. [ ] **377.7 — an adoption reading at every Objective grill, and §6's exit
       requires the thesis section.** No record has ever read adoption; none
       of 71 grills ran step 1; in 373-376 about 1% of changed lines were
       framework code.
       - **Accept:** `record_metric.py` gains the reading (non-publish-day npm
         downloads for both packages, jsDelivr monthly hits, non-owner issues/
         discussions/stars/forks) and the next grill quotes it with the
         channels it cannot see; LOOPS.md §6's Exit names a thesis section
         (adoption reading, the named user, comparators starting from SAP
         fundamental-styles) and the framework-code line count since the last
         grill, with its command.
8. [ ] **377.8 — the ACR's 1.4.11 and 2.4.7 remarks derive from source.** 1.4.11
       still states the limitation 374.7 removed; both remarks are literals.
       - **Accept:** removing check-contrast's edge branch, or changing the
         forest focus-ring or border-strong value in a scratch copy, changes
         the published remark or fails the build.
9. [ ] **377.9 — re-decide 375.6 on real CI timings.** Build steps are
       14.2-15.6% of job time (8 runs), not ~8%; `npm ci` is about a third of
       the build.
       - **Accept:** 375.6 and ci.yml's cost comment carry figures reproduced
         from `gh api …/actions/runs/<id>/jobs` over ≥3 recent runs, with the
         command beside them; the decision follows the data either way.
10. [ ] **377.10 — the Jev band, re-measured with the question form Rubric 2
       prescribes, and the set recorded.** 375.8's zero-FP result rested on
       asymmetric criteria; uniform re-runs put a false case at 0.87 once.
       - **Accept:** the 20 cases (claims, evidence, questions, truth) are
         committed; re-run with uniform criteria, truth-blind ids, ≥3 repeats;
         FP/FN at 0.85 and 0.35 reported with spread; the rubric, its heading
         and CLAUDE.md agree on n; the "never wrongly says yes" sentence is
         kept, qualified or withdrawn on that data.
11. [ ] **377.11 — 375.10's "holds the option" half must be able to fail.**
       `label.includes('')` is true.
       - **Accept:** the predicate rejects an empty value or asserts equality
         with the label or the event detail; red-proved by a handler that
         clears the field on `bo:combobox-select`.
12. [ ] **377.12 — the preview's provenance is truthful.** The container
       reports `{sha:null, dirty:true}` whatever it holds.
       - **Accept:** the container build receives the sha and the dirty
         build-input paths and `stamp-build-id` honours them, failing loudly
         rather than writing null; the served stamp names HEAD plus exactly the
         uncommitted paths it contains.
13. [ ] **377.13 — 375.9's corpus figure is re-runnable.** The sweep script
       lives only in session scratch.
       - **Accept:** the script (or its committed equivalent) is in the repo
         where 375.9 cites it, and a later run on HEAD reproduces or corrects
         0 of 4,944.
14. [ ] **377.14 — the low items, one bundle.** (a) 374.1's seam loop visits 2
       of the 7 pages rendering `.bo-quantity`/`.bo-money` — derive the list
       from `dist` or narrow the Accept; (b) six "56rem" prose restatements of
       the shell band pass 373.3's value grep — derive or accept them;
       (c) 373.9's refusal counts carry no recorded predicate; (d) count the
       runtime-behaviour sentences on component/pattern pages with and without
       a `check-claims` case before deciding anything about the umbrella
       pattern. Each closes on its own measurement.

## Slice 376 — Standardize sweep, **4 of 4 lanes**: one dead style and two false passages fixed, four prose verdicts recorded (enumeration 16 -> 20), one standing CSS group found DISSOLVED by a measured fix, and two shipped defects found BESIDE the lanes; the completeness critic also found two closed items resting on uncommitted work (2026-09-24)

**Dispatched by rule 2** (`Standardize 13 / 4 OVERDUE`) after rule 1 cleared
(375.9, 375.10). Each lane's figure, as the lane printed it
(`scripts/loops/standardize_lanes.py`): lane 1 *"1 dead style attribute(s) on 1
page(s)"* · lane 2 *"7 body(ies) appearing more than once"* · lane 3 *"flagged
union … 17 page(s)"* · lane 4 *ratchet: ROADMAP.md 6 up, ENVIRONMENT.md 24 up*.
Adjudicated by one agent per lane against the recorded verdicts, then a
completeness critic that spot-checked 11 citations (all held).

**The critic's cross-lane finding came first and landed first:** 373.3 and 373.4
were `[x]` on hunks that were never committed (the ACR 2.5.7 row; DESIGN.md,
`/base/primitives` and the Gallery drawer patch). Landed in `5d0146f5` /
`24ca80b0`; HEAD then built green alone (journey checkpoint stashed out).

1. [x] **376.1 — lane 1 + lane 2 records.** Lane 1: the one dead attribute
       (`margin: 0` on the app-launch launcher heading, added by 373.5 after
       the last sweep) removed in `2ff4ca61`; the rescan reads 0 dead
       attributes and exactly Slice 345's 11 standing refusals. What the
       figure does not cover: the scan never emulates the dark theme — base
       rate measured 0 (no dead declaration changes verdict in dark), so no
       instrument change. Lane 2: the standing `flex:1 / min-inline-size:0 /
       overflow-wrap:anywhere` group DISSOLVED — `.bo-file-list__name` is now
       `flex: 1 1 12ch`, 373.1's measured 390px fix, guarded by a claim; the
       LOOPS.md table row says so and warns off re-standardizing. The count
       "eight" is gone from LOOPS.md and the report's header (a value in a
       playbook is the staleness this file keeps paying for).
2. [x] **P0 · 376.2 — `.bo-motion-collapse` keeps the bare `0fr` closed track
       that 52.2 fixed in the widget copy only.** A bare `0fr` track has an
       `auto` minimum, so a padded child leaves a stub (the dashboard copy
       measured 32px before 52.2 changed it to `minmax(0, 0fr)`). The utility
       ships the unfixed form (`motion/motion.css`), and LOOPS.md's Settled
       section called the three copies identical after they had diverged.
       - **Accept:** in a real browser, the utility's closed state with a
         padded child measures a non-zero stub before the fix and 0 after, in
         a `check:claims` case red-proved against the unfixed rule; the
         Settled section's correction stays accurate.
       - **DONE 2026-09-24 — and the fix found a second defect.** Reproduced on
         the shipped CSS: closed utility, 16px-padded child, 32px tall. Fixing
         only the closed side (`minmax(0, 0fr)` against a bare `1fr`) was
         measured to SNAP (0, 0, 0, 95) — the two do not interpolate — and that
         is the dashboard card's exact shipped form since 52.2, so its collapse
         has not animated for a month. Both now use `minmax(0, Nfr)` in both
         states. `check:claims` +2 (a padded motion collapse closes to 0 and
         animates; the dashboard card animates and closes to 0): red on the
         unfixed build (closed 32; intermediate frames 0), green after. Live at
         1440/390 light/dark: 74px -> 0 with 7 intermediate frames. The richtext
         copy keeps bare `0fr/1fr` — it zeroes its own padding, so it neither
         stubs nor snaps. Jev: supported 0.93 (A 0.95, B 0.94).
3. [x] **376.3 — lane 3 verdicts; the enumeration is 20.** Four newly flagged
       pages, each classified by whether the PROSE or the THING was wrong:
       `/patterns/kanban/` — HONEST COVERAGE (373.4's required focus section);
       one stale paragraph (110.7 in the future tense, linked to the unrelated
       `/patterns/staging`) removed in `2ff4ca61`. `/reference/acr/` — THE
       INSTRUMENT (89% generated rows). `/components/file-upload/` — THE
       INSTRUMENT (recipe fixed cost; authored prose 1.03x its family median).
       `/components/alerts/` — THE INSTRUMENT for the flag (373.3's measured
       in-flow region section); one false sentence ("the reason the earlier
       attempt failed", an attempt that never shipped) removed in `2ff4ca61`.
       LOOPS.md's enumeration amended in the same commit as these verdicts.
       Also measured: `report:prose` counts ApiTable's hand-written halves
       (the `js` cell, the `notes` list) as generated — richtext 492 words,
       data-table 434, file-upload 275 — and no verdict flips at this
       revision; recorded so the next flip is read with it in mind.
4. [x] **P0 · 376.4 — `initGroupedNumber` breaks the quantity/unit-select joint.**
       It inserts its generated hidden input directly after the field
       (`input.after(hidden)` in `grouped-number.ts`), so
       `.bo-quantity__input:has(+ .bo-quantity__unit-select)` (374.1's joint)
       no longer matches when a named quantity field also uses grouped
       numbers — the lane's synthetic measurement: joined radii 0/0 and no gap
       without the hidden input, 6px radii and an 8px gap with it.
       - **Accept:** reproduced on real framework markup in a browser, then
         fixed so the joint holds with and without `initGroupedNumber`,
         asserted in `check:claims` and red-proved.
       - **DONE 2026-09-24.** Reproduced on `/components/quantity/` (which
         loads the behaviour): a named, grouped field beside a unit-select
         measured 6px radii, a 1px edge and an 8px gap against the page's own
         ungrouped control's 0/0/0. Fixed in CSS rather than JS — the joint now
         also matches `+ [type="hidden"] + .bo-quantity__unit-select`, the
         convention `money.css` already keys on (`:not([type="hidden"])`), and
         it covers a server-rendered hidden input too; moving the hidden input
         in JS would have fixed only this one writer. `check:claims` +1, red on
         the unfixed build, green after; slice 374's joint claims still pass.
         Live at 1440/390 light/dark. Jev round 2: supported 0.89 (A 0.94, B1
         0.96, B2 0.93, B3 0.94); round 1 read 0.83 with B's halves unstated.
5. [ ] **376.5 — the app-launch launcher hand-rolls a dialog header.** A
       `form.bo-cluster` with inline padding plus an `<h2>` whose 18px comes
       from the docs chrome's `.demo h2`, which a consumer's page will not
       have — while `dialog.css` ships `.bo-dialog__header` / `__title`.
       Adopting them CHANGES rendering (a 1px bottom border, 16/24 padding,
       the md title size), so it is a decision, not a Standardize removal.
       - **Accept:** either the launcher uses the shipped parts, verified live,
         or the page records why a grid launcher's header differs. Refusing is
         a satisfying outcome.
6. [x] **376.6 — lane 4 verdicts.** CLAUDE.md changed accumulate class —
       HONEST, cut by 375.2 (5,880 -> 3,227 words), 2 up since. ROADMAP.md:
       167.1's premise ("growth here is managed") has been false since
       2026-09-07 — no archive sweep since `3cb2381a`, 58,531 -> 150,288 words —
       so the sweep runs in this slice (376.8). RESUME.md: its INSTRUMENT
       premise ("rewritten every wake") no longer holds — since 2026-09-19 the
       handover has been PREPENDED, and the 2026-09-09 hand-off below has
       survived 7 commits byte for byte (43% of the file); recorded, not cut,
       because pruning the handover is the next hand-off's job.
7. [ ] **376.7 — the lane-4 ratchet counts any net shrink as a cut.**
       `report_loop_prose.py`'s `ups_since_last_cut` treats `cur < prev` as a
       cut, so a 52-word item close reads as ROADMAP.md's "last cut" while
       its real cut was 81 steps back; ENVIRONMENT.md's "cut" was 7 words.
       The block LOOPS.md says to read first is least trustworthy on exactly
       the files lane 4 exists for.
       - **Accept:** the ratchet distinguishes a real cut from noise (a named
         floor, argued), a replay reports ROADMAP.md's last real cut at the
         2026-09-07 sweep, and the change is red-proved.
8. [x] **376.8 — archive sweep, the twelfth: 40 closed slices moved.** Taken
       inside lane 4 because 167.1's premise had been false for 17 days and
       rule 4 says to run the sweep when it walks thousands of lines. Targets
       from `roadmap_scope.py` (51 eligible); the 11 named by a still-open item
       stay in place (236.2's pins: 338, 333, 364, 339, 351, 357, 324, 342,
       343, 366, 283). Moved fence-aware from HEAD's bytes, each section
       verified byte-identical in the archive by a second reader that locates
       it by heading text, each leaving the pointer line. Reconciled on raw
       counts both ways: live closed **145 -> 74** (72 moved; this entry is
       itself a new `[x]`), archive **730 -> 802**; open **32 -> 32**, the
       same ids name for name; slice headings live **358 -> 358**, archive
       **286 -> 326**; live lines **15,977 -> 9,314** at the committed
       revision (9,301 was the working copy before this entry was written —
       corrected by the 377 grill); closed-history share **56.7% -> 23.7%**. `check:slice-refs`
       passes (1,091 assertions, 358 slice numbers each heading one section).

## Slice 375 — owner-directed cleanup: the two-agent arrangement is retired, `CLAUDE.md` loses 45% to a reference file, and two defects are rescued from records that were about to become history (2026-09-22)

**Owner instruction:** reduce development overhead and inconsistent decisions
while preserving intended behaviour; and specifically, remove the instructions
designating a peer agent ("Codex") as development lead. Claude Code carries out
authorized development independently from here.

**The arrangement never reached the committed instruction surface.** `CLAUDE.md`,
`LOOPS.md`, `DESIGN.md`, `ROADMAP.md`, `STATUS.md`, `README.md` and
`ENVIRONMENT.md` contain zero references to it. There is no script, hook, agent
config, npm script, CI job, crontab or launchd entry for it: `.git/hooks` has no
non-sample files, `.claude/` has no agents/hooks/commands, and the 15-minute
`busy-office-ui-development-lead` heartbeat that two documents asserted has **no
definition anywhere on this machine**. Every directive lived in files that were
untracked or uncommitted, so the removal was a working-tree change.

### Items

1. [x] **375.1 — the arrangement's instructions are gone; its measurements are
       kept.** `codex-claude-roles.md` became `history-two-agent-2026-09.md`
       (role table, coordination protocol, await-assignment convention,
       ownership claims and asserted heartbeat removed; acceptance records kept
       verbatim under a header saying nothing in the file directs behaviour).
       `exchange/` (45 files) is now committed rather than untracked, with a
       README stating no file in it is a live assignment and no reply is
       expected — untracked is not preservation, and several measurements exist
       only there.
       - **Accept — met:** no file outside the history record and `exchange/`
         contains an instruction to await, acknowledge, or route work through a
         peer. The remaining references are attribution in dated evidence or a
         quoted external review naming several LLMs.

2. [x] **375.2 — `CLAUDE.md` 624 -> 334 lines by moving evidence, not rules.**
       373 of 624 lines were dated war stories in a file loaded into every
       session. The nine essays moved verbatim to
       `.roundtable/verification-discipline.md`; every rule stayed. Six stale
       figures corrected, four of them load-bearing arguments: "seven build
       gates" (56), "behavior tests" listed as a build gate (vitest is not in
       either build), "148 citations" (404), "131 findings" (206, and generated),
       the archive-sweep narrative ending at 1,094 lines (15,353 today), and a
       recipe path that does not resolve from the repo root.
       - **Accept — met:** 37,682 -> 20,869 bytes on the auto-loaded file, and
         every number in it either agrees with the gate that produces it or is
         left to that gate to print.

3. [x] **375.3 — dead weight, each verified rather than assumed.** The
       Containerfile's `apk add chromium` was justified by `check-boost`, which
       no longer exists; no step of either build drives a browser. Removing it
       is 738 MB of build stage and 42 s per cold build, measured, with the
       runtime image unchanged at 79.5 MB. `pixelmatch` and `pngjs` had no
       importer. An orphaned preview server (PID 5162, 1d12h) was bound to the
       SAME port as the Podman container on a different stack, so
       `localhost:8081` answered from either depending on IPv6 preference and
       the IPv4 answer was two commits stale — the prescribed stale-image
       defence cannot catch that, because it is a different server, not a stale
       layer.
       - **Accept — met:** builds green, and `:8081` has one listener.

4. [x] **375.4 — a class name inside a copyable sample is validated by
       nothing.** `check-markup` validates rendered `dist` HTML, but a class in
       a `<pre>` block is escaped text, so an invalid modifier in a recipe a
       user copies is invisible to it. This is how `bo-btn--primary` once
       shipped in a sample when `button.css` defines only `--danger`, `--ghost`,
       `--icon`, `--secondary`, `--sm`. That instance is gone (`grep` finds no
       occurrence in `apps/docs/src` or `examples/` today), so this is about the
       missing check, not a live defect.
       - **Accept — measure the base rate first (94.11).** Extract every
         `bo-*` class from every copyable block on the built site and check it
         against `api.json`'s generated class list. If the count of invalid
         classes is zero today the gate is ceremony and this closes with the
         count recorded; if it is not, the gate is worth writing. Finding zero
         is a satisfying outcome. Note the shape question before writing it:
         samples legitimately contain consumer-side classes that are not ours,
         so the predicate is "a `bo-`-prefixed class that `api.json` does not
         know", not "every class".
       - **DONE 2026-09-23 — the premise ("that instance is gone … not a live
         defect") was FALSE, so the gate was built.** Measured on the built
         site: 2,382 `bo-*` class tokens in 261 `<pre>` blocks across 169 HTML
         files; **1 unknown** — `class="bo-label"` in the form-field sample on
         `/concepts/accessibility/`, shipped since 2026-08-21 (`01d09528`, 33
         days). Corrected to `bo-form-field__label`; count 0.
       - `apps/docs/scripts/check-sample-classes.mjs` (`@heuristic`, 6-case
         self-test), in the docs build after `check-markup`. Red-proved: HEAD's
         `bo-label` put back into the built page → FAIL naming the page and
         class, exit 1; `check-markup` PASSES that same page. Docs-side rather
         than inside `check-markup`, which ships as a consumer bin whose users'
         samples are not ours to judge. Not covered, and stated in its header:
         classes built in script, and inline `<code>` fragments.
       - Gate count re-stamped 56/23 → 57/24 (READMEs, and `CLAUDE.md`'s
         hand-typed figure, which already read 22). Jev: supported 0.95
         (A 0.96, B 0.96, C 0.95).

5. [x] **375.5 — the direct Qty-to-Add pointer path is uncertified.** Rescued
       from the retired arrangement's records, where it was explicitly retained
       for triage and never folded into an assignment: a direct pointer click on
       Qty-to-Add was reported as missing because the focus-shown message changes
       the row height under the cursor. The checks that exist blur and settle
       before clicking, so they do not exercise that path.
       - **Accept — re-check the premise, it is another wake's measurement
         (158.2's rule).** Reproduce the click against the built site with a
         trusted pointer event at the original coordinates, or record that it
         does not reproduce and why. Either outcome closes it; what does not
         close it is a settled-then-clicked check, which is the thing already
         known to pass.
       - **CLOSED 2026-09-23 as REPRODUCED — and the stated mechanism is
         wrong.** Trusted CDP presses (puppeteer `mouse.down/up`) at `#eg-add`'s
         own centre, read with focus in the invalid Qty cell, against the
         `:8081` container's `/patterns/editable-grid/`: **0 of 6** added a line
         (3 at 1440, 3 at 390). mousedown hit `#eg-add` every time; mouseup hit
         a `P`/`CODE` below; `click` went to `SECTION.demo`, the nearest common
         ancestor. Control, blur first: **6 of 6**.
       - **Why, measured:** the row does NOT change height — 173.2 holds it.
         What moves is `.bo-data-table-container`, which shrinks **142px**
         focused → blurred while the message span itself is 28px: the
         `padding-block-end: calc(6lh + …)` reserve (data-table.css, 190.1)
         exists only while a cell message is shown. The press lands on Add;
         the mousedown blurs Qty; the reserve collapses; Add rises ~141px
         before mouseup. Filed as **375.9**. Jev: supported 0.89, corrected
         mechanism 0.96.

6. [x] **375.6 — CI rebuilds the whole project six times per run.**
       `.github/workflows/ci.yml`'s `docs-gates` is a 5-entry matrix whose steps
       run `npm ci`, the core build and the docs build **inside every shard**,
       and the `core` job builds again — so the core build's 24 steps run 6x and
       the docs build's 35 steps run 5x, with only the final `${{ matrix.run }}`
       line differing. The file records the bill at "~14.7 machine-minutes across
       6 parallel jobs (~3 min wall)". Reported rather than changed: the fix
       shape is build once and pass `dist` between jobs as an artifact, which
       cannot be verified locally.
       - **Accept:** the shards consume a built `dist` they did not build
         themselves, and the wall-clock and machine-minute figures in ci.yml's
         own comment are re-measured and updated to whatever the change actually
         produces — not predicted in advance.
       - **CLOSED 2026-09-23 as REFUSED, because re-measuring the premise
         refuted it.** The duplication is real — 5 shards each run `npm ci`,
         the core build and the docs build, and the `core` job builds again —
         but the BUILD half of it is not where the time goes. Measured cold
         (dist, `.astro` and the node astro cache all removed first): core
         build 6s, docs build 7s, 13s combined. So the duplicated build work is
         5 x 13 + 6 = **71s, 1.2 machine-minutes of the ~14.7 the file itself
         quotes — about 8%**. Building once and passing `dist` as an artifact
         saves ~0.9 machine-min before the upload and download cost is
         subtracted, which on a `dist` this size would eat much of it.
       - **The large duplication is `npm ci`, and it is already mitigated** by
         `actions/setup-node`'s `cache: npm` in every job. The fix this item
         proposed therefore targets the small half.
       - **And it could not be landed blind anyway**, which is the second
         reason to stop: shard 5 runs `npm run suite` and `check:quickstart`,
         which pack the local package and build the ERP suite rather than
         merely reading `dist`, so "consume a prebuilt dist" is not true of
         every shard. A wrong artifact wiring blocks all of CI, and this
         item's own Accept requires figures that only a real CI run produces.
       - **Limit of this measurement, stated rather than hidden:** it was taken
         on a developer machine with dependencies already installed, not on a
         cold CI runner. The build steps are CPU-bound (astro, postcss) so they
         should not differ by an order of magnitude, but the 8% is a local
         reading and the honest way to confirm it is the per-step timings in
         any real run's log. Reopen if those show the build dominating.

7. [x] **375.7 — three "Not when" cells on the decision page are
       content-free, and the page's own generated prose overclaims that they
       are not.** Found while verifying 373.2. `/concepts/which-pattern/`
       renders the bare words "Not for" — seven characters, no object — for
       Editable grid, RF task menu and RF task queue, while the generated
       sentence above the table says "39 state when not to use them".
       - **Cause is upstream and pre-existing**, not introduced by 373.2:
         `gen-patterns.mjs`'s `WRONG_CHOICE_RE` captures only the text INSIDE
         `<strong>`, and those three pages write `<strong>Not for</strong>`
         with the object after the tag. `check:wrong-choice` cannot see it —
         the clause is present, it is just empty of content, which is exactly
         the shape CLAUDE.md's 94.11 note describes: a gate can enforce that a
         clause EXISTS and cannot judge whether it says anything.
       - **Accept — write the property, not the fix.** Either the extraction
         takes the whole clause (so the three cells carry an object), or those
         three pages move the object inside the `<strong>`, or the generated
         sentence stops counting cells it cannot vouch for. Whichever lands,
         the count in the prose must be derived from the same field the cells
         render, so the two cannot disagree again. A cell whose clause is
         under ~12 characters is the cheap detector; measure how many exist
         before deciding it is worth a gate.
       - **DONE 2026-09-23 — the extraction takes the whole clause; no gate.**
         `extractWrongChoice` now runs on past `</strong>` to the first
         terminator unless the bold text already ended in punctuation.
         `patterns.json`: exactly the 3 named clauses changed, 36 of 39
         byte-identical. Built page: cells under 12 characters 3 → **0**,
         shortest legitimate clause 14 ("Not a launcher"). The prose count
         `withNot` and the cell both read `r.not`, so they share one field.
         **Gate refused on its base rate**: a <12-character predicate is true
         of 0 of 39 cells after the fix and could not fail on this tree.
         Self-test red-proved (disabling the branch fails the new case).
         **Found beside it:** the extended RF task menu clause ("general app
         launcher") substring-matched the "App launch" title and rendered a
         mid-word link replacing the reader's word; `linkAlternatives` now
         matches whole words. Measured: that was the ONLY substring hit — the
         linker links 0 of 39 cells today, which this item does not change.
         Jev completion review, round 2: supported 0.86 (A 0.95, B 0.94,
         C 0.89); round 1 read 0.77 without per-criterion evidence.

8. [x] **375.8 — the Jev threshold cannot discriminate where it is being asked
       to.** The completion review scored 373.3 at **0.81** against a
       provisional band of 0.85, on evidence where every Accept criterion had a
       direct measurement and one carried a self-run red-proof. The item was
       marked done on this repo's own rule — "do not let a band decide anything
       a check can decide" — but the episode is the finding: **an n=5
       validation set does not support a 0.04 distinction**, and a band that
       cannot be trusted at its own boundary will either be overridden (as here)
       or obeyed wrongly.
       - Observed so far, which is the seed of a larger set: supported cases
         have read 0.96, 0.92, 0.91; unsupported 0.20, 0.05, 0.03; and the
         genuinely-partial ones 0.84, 0.81, 0.79, 0.68, 0.65, 0.51, 0.35. The
         middle band is populated, which is what a useful detector looks like —
         it is the CUT that is unvalidated, not the signal.
       - **Accept — measure, do not tune.** Build the set to at least 20 cases
         drawn from this repo's own landed and refused items, each with a truth
         value established by measurement rather than by recollection, and
         report the separation. Then either the 0.85/0.35 cuts are justified by
         the data and stay, or they move to where the data puts them, or the
         review is reported as a three-way signal with no cut at all. Finding
         that no clean cut exists is a satisfying outcome and should be written
         down rather than papered over with a rounder number.
       - **The judge is framing-sensitive, measured 2026-09-23 and more
         serious than the cut.** The SAME evidence for 373.7 scored **0.25**
         when the payload opened by disclosing that an earlier review had
         scored 0.35, and **0.48** when that sentence was removed and nothing
         else changed. A 0.23 swing from a leading sentence is larger than the
         0.04 the band was being asked to resolve. So the review payload is
         part of the instrument: state the evidence, never the prior score, and
         never what verdict is hoped for. Add a pair of framing variants to the
         validation set so this is measured rather than remembered.
       - **Closed 2026-09-23 with 20 cases, and the answer is that NO CLEAN CUT
         EXISTS — which the Accept named as a satisfying outcome.** The set was
         drawn from this repo's own landed and refused work, each truth value
         established by measurement. Evidence-supports: min 0.81, median 0.95,
         max 0.97. Evidence-does-not: min 0.03, median 0.24, max 0.81. **A true
         case and a false case both landed on exactly 0.81**, so the ranges
         overlap and no threshold separates them.
       - **What the cut buys is an asymmetry, and 0.85 buys the right one:**
         0 false positives and 1 false negative, against 1 false positive and 0
         false negatives at any cut of 0.80 or below. A false positive claims
         completion on evidence that does not support it, which is what the
         review exists to prevent; a false negative costs one more measurement.
         So 0.85 stays, now on evidence rather than on margin, and the band's
         job is understood: it never wrongly says yes, and a reading between
         0.35 and 0.85 is an instruction to go measure, not a verdict.
       - **The two cases at 0.81 are the useful ones.** The TRUE one claimed
         "every rule was restated" and offered byte counts — real, but they
         cannot evidence a claim about CONTENT. The FALSE one claimed "only one
         thing remains" on evidence that established six criteria passing and
         said nothing about what else was open. Both are claims outrunning
         their evidence, which is exactly what the middle band is for.
       - The framing variant is recorded rather than re-measured here: the same
         evidence scored 0.25 with a leading prior-score sentence and 0.48
         without it, a 0.23 swing, so `jev-rubrics.md` forbids putting a prior
         score or a hoped-for verdict in a payload.

9. [x] **P0 · 375.9 — any control below a grid loses its first click while a
       cell's error message is shown.** Reproduced by 375.5 (0 of 6 trusted
       presses on the editable-grid demo's "+ Add line" landed). The cause is
       the container's reserve padding (`.bo-data-table-container:has(… :focus-within
       .bo-form-field__message)`, data-table.css) appearing on focus and
       vanishing on blur: the mousedown that blurs the cell moves everything
       beneath the table ~141px before the mouseup. It is framework CSS, so
       every consumer's grid carries it, and the user sees a press that did
       nothing.
       - **Accept:** a trusted pointer press (down and up at the target's
         centre, read while an invalid cell has focus) on a control below the
         grid activates it, at 1440 and 390, on the demo AND on a copy of the
         canonical markup — asserted in `check:claims` with real mouse events,
         red-proved by restoring the collapse. 173.2's property still holds
         (row height unchanged by a message) and so does 190.1's (a six-line
         message is not clipped by the container). Which shape removes the
         shift is the builder's call and is argued in the item, not assumed.
       - **DONE 2026-09-24 — nothing resizes on focus or blur any more.**
         The shape, argued: the reserve existed only because
         `.bo-data-table-container` is `overflow: auto` and clips an
         out-of-flow message, so either the room is permanent or the message
         leaves the clip. Where anchor positioning exists (Chrome 129+,
         Firefox 147+, Safari 26+) it leaves: the message is `position: fixed`,
         anchored to its field, with a minimum width and flip fallbacks so a
         right-hand column or a dialog does not squeeze it into a sliver
         over its own field. Elsewhere the reserve is STATIC on any grid whose
         body has an editable control. The open `.bo-dialog` / `.bo-offcanvas`
         now rest at `transform`/`translate: none`, because any transform —
         the identity included — made them the containing block that trapped
         the fixed message.
       - **Refused on measurement, so a later wake does not re-propose them:**
         a delay or `:active` latch on the collapse (postpones the jump, needs
         caveats per engine, and a press inside an iframe is invisible to
         `:active`); a reserve that follows the error (moves the toggle to the
         422 re-render, which lands mid-press — 10 of 16 lost); padding plus a
         negative margin (feeds ancestor scroll overflow); a static reserve
         everywhere (a permanent 142px band under every editable grid); and
         `pointer-events: none` on the floated message, which fired the row's
         hidden Remove button when the visible text was pressed. The message
         keeps catching presses: pressing it dismisses it.
       - Measured: `check:claims` +14 cases (real 60/900ms presses at 1440 and
         390 on the demo and on a pasted copy of the canonical markup; a
         counterfactual that re-injects the old reserve and must lose the
         press; nothing moves on focus/blur and the row keeps its height
         (173.2); a long message paints at every sample point (190.1, vertical
         fit holds in both modes); dialog/offcanvas rest at `none`), each
         red-proved by injection. Corpus sweep, 135 pages, 2834 valid targets:
         0 of 4944 presses lost (baseline control lost 92 of 358).
         Chrome 153 + WebKit 26.6: 0 hidden controls activated; every lost
         press is one on a control the visible message covers.
       - Not covered, filed as 375.11: Firefox unverified; fallback + classic
         scrollbars + a long message from a non-first column still toggles a
         horizontal scrollbar (the 196.1 residual); frozen-column cells paint
         over the message (pre-existing); 400% zoom on a 320x256 viewport
         partly covers the focused field (12/18 points, never entirely).
       - Jev completion review, two rounds (the limit): per criterion A 0.92,
         B 0.94, C 0.92, D 0.87; the overall "every criterion met" read 0.82
         both rounds, in the middle band — it tracks the not-covered list
         above, which is outside this item's Accept and is 375.11.

10. [x] **P0 · 375.10 — a real mouse or touch press on a combobox option never
       commits it; only the keyboard works.** Found by 375.9's attack
       workflow (side lens, unpatched CSS). `combobox.ts`'s `focusout`
       handler closes the listbox at mousedown (focus goes to BODY, the
       grid container or the dialog), so the click lands on a common
       ancestor: 0 of 10 trusted presses committed on `/components/combobox/`
       and inside `/patterns/editable-grid/` (60/0/900ms, touch), while
       `element.click()` commits. On `/patterns/command-bar/` the same press
       also CLOSES the palette (the click lands on the `<dialog>` and its
       backdrop handler fires). Nothing catches it: the vitest cases use
       `element.click()` and jsdom does not move focus on mousedown;
       `check:claims` drives only the keyboard.
       - **Accept:** a trusted mouse press and a touch tap on an option commit
         it (`bo:combobox-select` fires, the input holds the option's label)
         on `/components/combobox/`, inside `#eg-table` on
         `/patterns/editable-grid/`, and on `/patterns/command-bar/` (where
         the palette stays open until the commit) — asserted in
         `check:claims` with real pointer input and red-proved against
         today's build. The fix shape is the builder's, argued in the item;
         the attack's simulation of a capture-phase `mousedown`
         `preventDefault()` on enabled options committed 11 of 11. Also
         settle whether `/components/money`'s currency combobox demo is
         meant to be live (it never calls `initCombobox`).
       - **DONE 2026-09-24.** `combobox.ts` cancels `mousedown` on an enabled
         option of a listbox that has an input — the APG pattern — so focus
         never leaves the input and the existing click handler commits; the
         listbox's padding and scrollbar are left alone. `check:claims` +4
         real-pointer cases (mouse and touch on `/components/combobox`, the
         editable-grid cell, the command bar inside its dialog): all four
         FAILED on the pre-fix build with the option under the pointer and
         `bo:combobox-select` never firing, and pass now. The attack's
         11-scenario reproduction reads 11/11 committed (was 0/10). The
         command bar commits, THEN its own select handler closes it. A vitest
         case pins the contract (cancelled on an enabled option only) and
         failed before the fix; jsdom cannot move focus on mousedown, so the
         browser cases carry the behaviour.
       - **The money demo is meant to be live** — its caption states "the list
         stays shut until you type" and the sample carries no script — so
         the page now calls `initCombobox()`, with two claims (shut on focus,
         opens filtered on the first keystroke; a real press commits),
         red-proved by stripping the call from the built script.
       - Jev completion review: supported 0.92 (A 0.95, B 0.87, C 0.94).

11. [ ] **375.11 — what 375.9 measured and did not fix.** Each is recorded
       rather than silently accepted; each wants a measurement or a
       decision, not necessarily a change.
       - **Firefox is unverified** for both the anchored mode and the static
         fallback — Playwright Firefox would not launch in this environment.
       - **Fallback browsers + classic scrollbars:** a long message from a
         field away from the container's inline start overflows it and
         toggles its horizontal scrollbar only while focused — 15px of
         movement and a lost press, 196.1's accepted residual now on a
         press path. Needs classic-scrollbar measurement (every browser gate
         runs with scrollbars hidden, so none of them can see this class).
       - **Frozen-column cells:** the message is painted under later rows'
         sticky cells and sticky totals (8/160 in first-row frozen cells),
         identical before and after 375.9.
       - **A loading table** (`opacity` on `[data-loading]`) traps the
         message's z-index; 6 of 2834 corpus targets.
       - **400% zoom on a 320x256 viewport:** the message partly covers its
         focused field (12 of 18 sample points; never entirely).
       - **Accept:** each is measured in the environment that can see it and
         either fixed, or closed with the measurement and the reason it is
         accepted.

## Slice 374 — the joined-control seam was spelled against the AUTHORED markup, not the RENDERED DOM: three trailing children defeat `:last-child`, the framework's own canonical quantity markup is one of them, and the defect shipped on **3 pages / 5 rendered views** while a gate that visits those exact elements measured only their focus rings (2026-09-22)

**Found by the owner, from a screenshot.** The `+` stepper on
`/components/quantity/`'s grouped demo renders as a pill notched into a square
field. `.bo-quantity__step:last-child` was the only rule squaring its inner
corners, and the `+` is not the last child — so it matched nothing and kept all
four `.bo-btn` corners at 6px, where 0/6/6/0 is correct.

**THREE different trailing children cause it, and only one is the one that was
blamed.** The sibling money fix (uncommitted, same window) attributed this
class to `initGroupedNumber()`'s generated hidden input and fixed money with
`:nth-child(1 of :not([type="hidden"]))`. Ported to quantity that blocklist
fixes **one of the three** instances:

| page | trailing children after the `+` | hidden input? |
|---|---|---|
| `/components/quantity/` grouped demo | `input[type=hidden]`, `__unit`, `.bo-visually-hidden` | yes |
| `/patterns/rf/rf-pick-rf/` | `__unit`, `.bo-visually-hidden` | **no** |
| `/patterns/rf/goods-receipt-rf/` | `__unit` | **no** |

Two of the three carry no `data-grouped` and no `name`, so no hidden input
exists on them at all. The real predicate is *"the trailing step is not the
last child"*, and the `__unit` span alone is sufficient — a span this
component's own canonical `Markup` block puts there
(`quantity.astro:143-146`).

**A correction to the sibling fix's stated mechanism, which is why the two
files needed different answers.** `money.css` said `initGroupedNumber()`
*"APPENDS"* a hidden input. It does not: `grouped-number.ts:161` is
`input.after(hidden)` — inserted immediately after the VISIBLE input, wherever
that sits. In money the amount happens to be last, so it lands last and the
description was accidentally true. In `.bo-quantity` it lands at index 2 of 6,
**between** the input and the `+`. Corrected in the file.

**The base rate, measured rather than assumed** (33 rendered instances across
every page of the built site that carries either component, `querySelectorAll`
not grep — 15 served pages match the string, only 7 render an element):
**5 of 33 defective, all the same defect, all in quantity.** Every welded seam
in the framework measures 0 or −1px; there are no odd gaps. Six joined controls
exist (`.bo-money`, `.bo-quantity`, `.bo-btn-group`, `.bo-btn-group--bar`,
`.bo-richtext`, `.bo-tabs`); `.bo-segmented`, `.bo-tag-input`, `.bo-pagination`,
`.bo-stepper`, `.bo-date` and a standalone `.bo-combobox` were measured and
ruled out as not welded.

**Three candidate selectors were measured against every instance, not reasoned
about.** Ground truth was computed geometrically and independently of any
selector (a child is a segment if it — or its nested `.bo-input` — has
border-width > 0 and width > 0; two consecutive segments are welded if their
rects gap ≤ 0.5px), then each candidate was run as `querySelectorAll` AND
injected as an unlayered `<style>` with the resulting computed radius read
back:

- **adjacency** (`:has(~ .bo-quantity__input)` / `.bo-quantity__input ~ …`) —
  9/9 stepper cases, 11/11 stepper-less, 4/4 synthetic single-stepper, correct
  in RTL. **Chosen.**
- **typed nth** (`:nth-child(1 of .bo-quantity__step)`) — fixes the bug, but
  with a single stepper both rules select the same button and square all four
  of its corners (0/0/0/0 on 4 of 4 probes, LTR and RTL). Latent, and it
  mis-draws rather than failing soft, which this file's own unit-select comment
  rules out.
- **money's blocklist, ported** — **regresses six controls that ship today**.
  In a button-less composition both rules land on the bare `.bo-quantity__input`:
  `/components/quantity/` instances 2, 4, 8, 9, 10 and `/patterns/rf/rf-count-rf/`
  all go 6/6/6/6 → 0/0/0/0. Named by a before/after diff, not predicted.

**The gate that should have caught it was standing on the elements.**
`check-claims.mjs` already walked `.bo-money` and `.bo-quantity` segment pairs
live — and asserted only that a focused segment's ring stays off its neighbour.
Radius and border-colour were both invisible to it, to `check:contrast` (which
compares token PAIRS, not two elements' agreement) and to `check:layout` (which
looks for overflow). Extended in 374.2.

### Items

1. [x] **374.1 — the quantity joint keys off ADJACENCY to the input, not
       position in the parent.** `.bo-quantity__step:first-child` /
       `:last-child` → `.bo-quantity > .bo-quantity__step:has(~ .bo-quantity__input)`
       / `.bo-quantity > .bo-quantity__input ~ .bo-quantity__step`. General
       sibling, so the injected hidden input and both authored trailing spans
       are stepped over without enumerating them; specificity (0,3,0) clears
       the base `.bo-btn` rules with no `!important`.
       - **Accept — met.** Every `.bo-quantity` on the built site reports the
         interior corners its geometry says it should, in both themes, and
         `check:claims` agrees (374.2 is the instrument, so this is not
         self-attested). The three previously-defective views measure 0/6/6/0
         where they measured 6/6/6/6.

2. [x] **374.2 — `check:claims` asserts the two properties that define a seam,
       on the pairs it was already visiting.** (A) an interior corner of a
       welded control is square; (B) every segment of one welded control draws
       the same `border-top-color`. Both in light and dark, with three
       cross-cutting checks behind them: the two theme runs rendered different
       `bodyBg`, every `.bo-combobox` segment resolved to its nested
       `.bo-input` (and money exercised that path), and the settle outlasts the
       live transition.
       - **Accept — met, red-proved by injection with the injection confirmed
         in the COMPUTED STYLE before the verdict was believed.** (A) injected
         a 6px end-radius → red on 8 of 8 money seams; a separate injection on
         the combobox's NESTED input → red, which is what proves the resolver
         rather than the wrapper. (B) injected `border-strong` onto the
         steppers → red with the real token pairs, and the dark run reported
         DIFFERENT values from light, which is itself the evidence the two runs
         are not one run duplicated. Base rate before any injection was **1 of
         20 already failing** on (A) and 20 of 20 passing on (B) — so (A) was
         not vacuous, and (B) is 100% only because 374.1's sibling fix had just
         landed, which is what a gate is for.
       - **Settle, not rAF — measured as a ladder, because this is the hazard
         that produced a false "all 12 mismatch" earlier in the same window.**
         `.bo-input` transitions `border-color` (100ms) and `.bo-select` /
         `.bo-btn` do not, so a read taken during a theme flip catches the
         input mid-interpolation: +0/8/16/33/50/80ms all report 7 of 7 groups
         mismatched, +120/300/600ms report 0, and the +50ms sample reads
         rgb(145,152,164) against rgb(156,163,175) — an interpolated value, not
         a token, which is the tell. A double rAF lands at ~16ms, so this
         file's usual settle idiom is the wrong one here. The 600ms literal is
         not trusted: a check compares it against the duration read off the
         live element, so raising `--bo-motion-duration-fast` goes red rather
         than quietly under-settling.
       - **No new `@heuristic` obligation.** `check:selftests` tags a FILE, not
         a check, and `check-claims.mjs`'s existing `@exact` still holds: every
         verdict here is a number compared in a real browser. The one
         judgement-shaped term is the weld window (gap ∈ [−3, 0.5]), a
         membership test against measured geometry. `where` (the demo heading)
         IS a positional recognition and is diagnostic only — printed in the
         FAIL detail, never in a boolean.

3. [x] **374.3 — what else is in this class, and the one that is NOT a
       defect.** Two records, both measured, so neither is re-derived a third
       time:
       - **`.bo-btn-group--bar`'s filled segment is correct — refused.** A
         primary computes `border-color: transparent` beside
         `.bo-btn--secondary`'s border-strong, which reads as a border-colour
         disagreement in computed style and paints nothing extra: a 1px-row
         pixel scan across that seam on `/patterns/approval/` reads white →
         rgb(15,118,110) with **zero** pixels of rgb(209,213,219), while the
         same scanner DOES see them at both seams of `/components/button/`'s
         all-secondary group — so the absence is a real absence, not a dead
         detector. `background-clip: border-box` means the accent fill paints
         under its own transparent border. That edge is the better-contrasted
         one (5.47:1 vs border-strong's 1.47:1), and forced-colors gives every
         segment `ButtonText` anyway. This is why 374.2 scopes (B) to
         money/quantity: widening it would need an exemption covering a whole
         modifier, and a predicate that is mostly exempt is ceremony.
       - **Money's fix is a BLOCKLIST, and holds only while every `.bo-money`
         child is a welded part.** True of all 12 rendered instances — there is
         no money composition on the site with a trailing non-welded child. Not
         guaranteed: injecting the compositions quantity already ships (a
         trailing `.bo-visually-hidden`, a trailing note span) reproduces the
         identical 6/6/6/6 defect, and a currency-less money field renders
         0/0/0/0. Left as a blocklist deliberately — the hardened allowlist
         measured 15/15 including those three probes but subsumes two more
         rules, and money's joint must stay order-agnostic (currency leads in
         en-US, trails in de-DE), so it is a larger change than a live defect
         warrants.
       - **Accept — met:** the refusal and the latency are both recorded next
         to the rules they explain, with the command or measurement that
         produced each.

4. [ ] **374.4 — `.bo-btn--secondary` standing alone is identified almost
       entirely by a 1.47:1 border, the contrast gate structurally cannot see
       it, and the published ACR says it can.** Surfaced by 374.1's sibling
       fix, which converged the quantity steppers onto `border-control`
       *because* border-strong would drop a segment below 3:1 — and then scoped
       that to the group, leaving the general case where it was. Three parts,
       and the first is a correctness defect rather than a design question:
       - `extract-acr.mjs:159-162` publishes 1.4.11 as **Supports**, remarking
         that non-text pairs *"(borders, focus rings, icon fills) are included
         in the same contrast.json gate as text pairs — not a separate, weaker
         check."* `PAIRS` has three `--bo-color-border-control` rows and **zero**
         `--bo-color-border-strong` rows, and `check-contrast.mjs:232` binds
         `fg` only when `d.prop === 'color'`, so the coverage guard cannot see
         a `border-color` declaration at all. A derived artefact deciding on
         its own what it failed to see, which is the rule this repo paid for.
       - Measured: `.bo-btn--secondary`'s fill is bg-surface, so it is
         **1.00–1.17:1** against every surface it sits on across the built site
         (navbar, card, widget, app-shell main, sidebar, dialog footer, alert,
         form-section) in both themes. The fill identifies nothing; the border
         at 1.34–1.90:1 is the only non-text identifier — precisely the
         condition `color.css:29-31` already names. **1,252 rendered instances
         across 123 of 139 pages.** `.bo-file-input::file-selector-button` and
         `.bo-file-dropzone` (1px dashed border-strong on bg-muted = 1.34:1
         light / 1.45:1 dark, shipped in 373.1) share the recipe; the dropzone
         is the clearest case, since its own comment says the border *"is what
         makes the box droppable at all"*.
       - The strongest case it is NOT a defect was looked for and is not on
         record: nothing in ROADMAP, ROADMAP-archive, DESIGN.md, `.roundtable/`,
         `button.css` or `/concepts/accessibility` argues that a button's label
         carries identification in place of its border. `border-strong` has
         zero hits in ROADMAP.md, DESIGN.md and all of `.roundtable/`.
       - **Accept — write the property, not the verdict.** Every
         `--bo-color-border-strong` site that paints an INTERACTIVE control's
         boundary either clears 3:1 against the surface it sits on as
         `check:contrast` computes it, or records a one-line reason it should
         not. Finding some of them fine is a satisfying outcome. Do the
         dropzone first. Before adding the `PAIRS` rows, **measure the base
         rate** — no brand preset overrides the token (0 hits across all six),
         so a row goes red identically in 14 places (2 base + 12 brand×theme),
         which is honest rather than noisy, but it is a token re-value and
         therefore an owner call. **Put to Jev under decision rubric v1
         (2026-09-22) and it escalated**: split-the-token 0.61 / repoint-the-three
         -sites 0.32 at confidence **0.54**, under the 0.8 route threshold, so the
         choice stays with the owner — where this item already placed it. One
         answer was usable: documenting that the label identifies the button and
         exempting it would CONFLICT with the accepted decisions (0.90), because
         `color.css` reserves the 3:1 token for "when the border is the only
         affordance" and nothing in the repo argues the label substitutes. So
         refusal-by-documentation is off the table; what remains is which token
         shape, and that is a visual-weight preference.
         Separating the decorative uses (kbd, filter
         chips, blockquote, data-table outline) onto their own token is one way
         out; `border-control` for everything flattens the input/button
         hierarchy `color.css:29-31` deliberately built.

5. [x] **374.5 — `./css` resolves to the UNMINIFIED bundle, so this repo's
       write-the-reasoning-inline doctrine is payload a consumer downloads.**
       Surfaced by 374.1: the seam fix's comments broke `check:size`.
       `css/index.css` measured 93.69 kB gz at HEAD, 97.24 with the tree's
       then-uncommitted work — **61 bytes** under a 97.3 budget — and 97.71
       with the fix's explanation. The budget row was re-based to 107.5 on the
       table's own stated convention (current + ~10%) with the reason recorded
       in `check-size.mjs`, rather than trimming a fix's rationale to fit; this
       item holds the question that raise defers.
       - Note the asymmetry: `index.min.css` is 15.15/16.7 kB and a comment
         cannot move it, and the minified figure is what `stamp-readme`
         publishes. Only the default export pays.
       - **Accept:** either `./css` resolves to the minified artifact and
         `./css/src` (or similar) keeps the annotated one, or the budget's
         header states outright that this row is a comment budget as well as a
         code one and what that is worth. Deciding it is fine as it stands, with
         the reason written down, closes this.
       - **Closed 2026-09-23, by measuring rather than arguing.** index.css was
         99.5 kB gz against index.min.css 15.4; stripping comments alone lands
         at 17.1, so comments were **80.5 kB gz, 98% of the gap**, and
         minification only 1.6. The build now strips them when emitting dist:
         index.css 99.5 -> 16.7, rf-essentials 45.7 -> 8.2, whole shipped
         payload **401.1 -> 185.8 kB gz**. No export path moved. `src/css` is
         untouched — the doctrine was always about source.
       - **The blanket strip was wrong and `check:deprecated-icons` caught it**,
         failing with "found no deprecated glyphs in the shipped css to check".
         It reads icon.css's four DEPRECATED blocks out of the SHIPPED artifact
         on purpose: they are user-facing contract, not internal reasoning. The
         rule became the CSS bang-comment convention — ordinary comments go,
         bang comments stay — and anything that must reach dist now says so.
         Five budget rows that existed to protect prose were re-based, including
         the 97.3 -> 107.5 raise made the day before, recorded in place as
         overturned. Completion review 0.85; regression risk 0.97.

6. [x] **374.6 — the published conformance report overclaims in four rows, and
       - **CORRECTION 2026-09-24 (377 grill):** its "audited all 21 criteria" and "21 rows" were counted on a working tree carrying the then-uncommitted 2.5.7 row; `extract-acr.mjs` as committed in `1816d366` held **20** criteria, and clean builds carried 20 until `5d0146f5` landed the 21st.
       the rows that are wrong are exactly the ones that interpolate nothing.**
       Audited all 21 criteria in `extract-acr.mjs` against the gate each one
       names. Four overclaim, one is an unbacked Supports, and the rest verify
       true — so it is a class, not a slip.
       - **The structural cause, which is the finding.** Where a remark pulls a
         live number or calls `cite()`, the build fails on it and it is right.
         Where it is a bare string literal — 1.4.11, 1.4.1's "automated proof",
         4.1.2's `aria-sort`, 3.2.1 — nothing can fail, and three of those four
         were wrong. The file's own header says the evidence is "pulled live …
         so the report can't quietly go stale"; that doctrine was applied in
         the places it was applied, and absent in the places it was not. Every
         row corrected here now interpolates.
       - **The forced-colors count was 23 and the truth is 18.** A substring
         scan, `.includes('forced-colors')`, counted five components that match
         only in a COMMENT — and `date/date.css` is the inversion that gives it
         away: the sentence it matched on says the block has "no forced-colors
         rule". The deleted comment named the exact hazard ("the @media block
         is easy to lose in a string scan") and then used a string scan anyway.
         `extract-api.mjs` already PARSES this correctly, so `/concepts/
         accessibility` published 18 while `/reference/acr` published 23 — two
         pages, one fact, different answers. Fixed by deleting the second
         mechanism, not by patching its regex.
       - **The reconciliation that replaced it failed its own red-proof first,
         and that is worth recording.** The first version compared the list
         against `api.components[*].forcedColors` — the thing it is built
         from — so it agreed with itself by construction and a flipped flag
         produced a PASS. Re-derived from the stylesheets instead. Red-proved
         three ways: a wrong flag in `api.json` → red; a real `@media` rule in
         a stylesheet the mirror has not seen → red; a comment mentioning
         forced-colors → green, which is the negative control proving it is not
         the old substring bug.
       - **1.4.11 and 2.4.7 → `Partially Supports`**, a recognised VPAT 2.x
         level this file had never used. `Conditional-on-adopter` would have
         blamed the adopter for a gap in our own token values and our own gate;
         `Not Evaluated` would have discarded evidence that does run every
         build. Both rows now name the ungated part and say what returns them
         to Supports. 2.4.7 carries a LIVE miss, not just a structural one: the
         ring reads 2.99:1 on bg-muted under brand-forest light, where
         `.bo-segmented` draws it.
       - **4.1.2 named `aria-sort` as evidence while a green gate asserts the
         opposite** — `check-claims.mjs` presses Enter on the sort header and
         confirms the attribute does not move. It also quoted the behaviour
         TOTAL as if it were the ARIA-syncing subset (26 for 10). Now derived
         from source, with the denominator reconciled against
         `behaviors.json` — the first run of that scan drew from all 31 modules
         under `src/js` rather than the 26 behaviours and pulled in
         `reveal.ts`, which would have put two populations in one fraction, in
         the fix for a row being corrected for exactly that.
       - **1.4.3 understated itself sevenfold** — "both themes plus the brand
         preset" counted `contrast.themes` only (74) while 444 brand readings
         were computed and quoted by nothing, and "the brand preset" was
         singular about six. Both now derived, with the 4.5/3.0 split spelled
         so "74/74 pass AA" cannot be read as 74 readings at 4.5.
       - **3.2.1 → `Not Evaluated`.** It reads true on inspection but names no
         gate, and this file's own methodology line says a row with no
         automated evidence is Not Evaluated, never inferred as Supports.
         Applied to the row rather than exempted.
       - **`acr.astro`'s summary was a mirror that could under-report.** It
         hardcoded three verdict badges, so a fourth rendered in the table and
         was invisible in the count above it, and an unmapped verdict
         interpolated to `class="bo-badge undefined"` — silently unstyled. Now
         derived from the rows, with a build-time throw on either failure.
       - **Accept — met:** every corrected row's numbers are interpolated from
         `dist/*.json` or derived from source, so the build fails when they
         drift; verified live at 1440 and 390 in both themes (21 rows, summary
         accounts for all 21, no unstyled badge).

7. [x] **374.7 — `check:contrast`'s coverage guard cannot see an edge, and the
       base rate says a gate would earn its keep.** The mechanism is 374.4's:
       `check-contrast.mjs` binds `fg` only on `d.prop === 'color'`, so a
       `border-color` declaration matches none of its branches and the three
       `border-control` rows are hand-maintained with nothing noticing a fourth.
       - **Base rate, measured before proposing the gate (94.11's rule).** Of
         the 78 token-resolving boundary declarations in the component tree,
         **7 of 36 INTERACTIVE ones are below 3:1 (19%)** — not ceremony, not a
         blanket verdict. The classification is load-bearing rather than
         decoration: container is 21 of 22 below and decorative 16 of 20, so
         the same gate written WITHOUT the interactive filter would be 44 of 78
         — an opinion about `--bo-color-border-default` delivered 44 times.
       - **Four of the seven are not on record anywhere** and are this item's
         actual content: `.bo-segmented`'s track at **1.13:1** (the worst in
         the interactive set), `.bo-chip` at 1.34, the dropzone's
         `[data-dragover]` accent at **2.26 in dark** across all six presets,
         and `.bo-data-table tbody tr:hover` at 1.34 — that last one being the
         strongest case, because `bg-hover` and `bg-muted` are the same value,
         so on a striped row that outline is the ONLY hover channel there is.
       - **A gate cannot tell an interactive boundary from a decorative one.**
         `--bo-color-border-strong` at 1.34:1 is `.bo-kbd`'s keycap edge and
         `.bo-btn--secondary`'s control boundary — same token, same ratio,
         opposite verdicts. So the enforceable property is a SHAPE, exactly
         `check:wrong-choice`'s bargain: every edge pairing is in `PAIRS` at
         3:1, or in an exemption map with a reason NAMING the other channel
         that identifies the control, or in a TODO list as debt. What the
         reason says stays a human call.
       - **Accept:** the guard fails on an edge pairing that is in neither
         list — red-proved by injection, with the injection confirmed in the
         parsed declaration list the guard reads, not in the file text. Expect
         the `@exact` tag to move to `@heuristic` (the extension recognises a
         boundary from a property NAME, which is a recognition and can be
         fooled); if it does, `readme-facts` must agree with what
         `check:selftests` reports in the same commit, or `stamp-readme
         --check` fails the core build.
       - **Closed 2026-09-23.** 26 edge pairings adjudicated: 15 exempt with a
         stated reason, 5 in `EDGE_TODO` as debt against 374.4, the rest gated;
         three state edges (calendar selected day, invalid field in a
         data-table, active filter chip) went into `PAIRS` at 3:1 and pass,
         taking it 37 -> 40 rows. Red-proved by injection with the injection
         confirmed in the PARSED declaration list, and the staleness branch
         red-proved itself on a mis-keyed exemption. Retagged
         `@exact` -> `@heuristic` with a 6-case `--self-test` covering the two
         defects the detector actually had — a LENGTH read as the edge colour
         on 22 of 33 sites, and a local property read as a token, inventing a
         pairing no element holds — and that retag forced the README
         gate-count re-stamp it should have. Verified in a packages-only
         context, not just a full checkout. Completion review 0.80; its weakest
         criterion is the claim that a shape is the right enforceable property,
         which is a judgement no measurement settles (94.11).

## Slice 373 — Owner direction 2026-09-19: a master prompt naming five workstreams (docs IA, app-shell contract, dropzone / reorder / dock / launcher, layout recipes); Phase 0 inventory finds **one capability existing-incomplete with two HIGH behaviour defects, two refused on record (dock, drag), and every other ask answered by composition** — 24 of 26 gap claims reproduce under an adversarial pass, and the baseline tree is green on every gate (2026-09-19)

**Triaged from chat (Step 1): the owner pasted a "master prompt" for a UI
framework architect agent** — graph-driven planning, bounded loops, five
workstreams (A docs simplification, B app-shell contract, C1-C4 dropzone /
reorder-transfer / app dock / fullscreen launcher, D six structural layout
recipes for AI composition). Its scope boundary matches this repo's (UI only,
no business modules, no React, no mandatory HTMX, the browser floor as is). Its
process asks — a dependency/evidence graph, an execution state machine, ≤3
slices per invocation, ≤3 repair attempts — are **already this file, `LOOPS.md`
and graphify's `graph.db`**; nothing new is adopted, per the prompt's own
"extend existing mechanisms" line.

**Phase 0 ran as one workflow of nine agents** (seven read-only mappers, one
baseline runner, one skeptic instructed to REFUTE every "missing" and every
"defect" claim by re-running the evidence). Baseline at `ce17d9b4`, Node 26.8 /
Chrome 153 (CI pins Node 22): `build`, `test` (29 files / 165), `lint:css`
(74 files), `check:size`, `docs:build` (all chained gates), `check:claims` (179
live), `check:selftests` (22 heuristic / 183 cases, 34 exact), `check:markup`,
`test:axe` (128 × 2, 0 violations), `check:layout` — **all pass, no
pre-existing failure, no environment blocker, tree clean after.** Skeptic: **24
confirmed, 2 partially true, 0 refuted** of 26 claims; every confirmation is a
re-execution, not a re-read.

### Classification (source-backed; each mapper's evidence is in the workflow journal, the load-bearing ones are re-stated beside their item)

| Ask | Class | Existing surface | Verdict |
|---|---|---|---|
| C1 dropzone | **existing-incomplete** | `file-upload.css`, `file-dropzone.ts` (stable set), `check-claims.mjs:1938`, po-app | **extend** — 373.1 |
| C2 reorder / transfer / basket | **deliberately-excluded** | button floor ships: `ordered-list__actions`, kanban *Move to…* menu, bulk-actions, tag-input events | **reuse**; drag REFUSED ×4 on record (100.1, 110.7, 132.5, 317) — 373.4 fixes the two focus leaks on that floor |
| C3 app dock, hide-on-upward-scroll | **deliberately-excluded → owner call** | none; 0 hits for dock / scroll-direction in source | 123.2 refused the bottom-nav tier, Slice 154 refused direction-driven chrome motion — **373.6, OWNER CALL** |
| C4 fullscreen launcher + search | **existing-incomplete** | `/patterns/app-launch`, `/patterns/command-bar`, `bo-dialog` + `initDialogs` (focus restore already claimed), `bo-widget-grid` | **compose** — 373.5, zero core source |
| B app-shell contract | **existing-incomplete** | `sidebar-layout.css`, `/concepts/layouts` (Slice 156: one shell, not three), z-index tokens, `check:sticky-layers` | **extend the page**; 2 HIGH CSS leaks — 373.3 |
| D six layout recipes | **existing** | every intent resolves to a gated pattern page; `/concepts/which-pattern` is generated from `patterns.json` | **reuse** — 373.7 repairs the router; 112.4 stays blocked |
| A docs IA | **existing-incomplete** | 17 sidebar groups, 2-level cap (docs-IA comparison 2026-08-16); Slice 112 REFUSED the six-section reorg | 4 stale claims — 373.2; regroup is **373.8, OWNER CALL** |

### The 8-task lookup baseline (Workstream A's number to beat — "less or equal reading, no loss of correctness")

Instrument: whitespace tokens of tag-stripped `<main>` content on the built
site, docs chrome removed, code samples included; "words" = words passed before
the answer first appears, walking links from `/` without search. Re-run it
before quoting a change.

| # | Task | Path | Words | Answer |
|---|---|---|---|---|
| T1 | make a table dense | `/` → `/concepts/density` | ~479 | exists (`data-density="compact"`) |
| T2 | pattern for an approval screen | `/` → `/patterns/` → `/patterns/approval` | ~1,354 | exists |
| T3 | wire the dropzone | `/components/` → `/components/file-upload` | ~1,077 | exists |
| T4 | the shell's scroll container | `/concepts/layouts` | ~1,142 | **partial** — `__main` scrolls is stated; that the document does NOT is nowhere |
| T5 | is there a dock / launcher | `/patterns/` → `/patterns/app-launch` | ~277 | launcher exists; **dock absent and no page says so** |
| T6 | HTMX on a 409 | `/getting-started/htmx` | ~1,337 | exists, late in the page |
| T7 | event fired when a row edit saves | `/reference/events` | ~262 | exists (`bo:row-save`) |
| T8 | is there a data grid | `/getting-started/scope` | ~494 | **partial** — never says "grid"; full answer only on `/getting-started/ai-assistants` |

### Items

1. [x] **373.1 — the dropzone forwards no more than the native input it
       forwards to would accept, its states are two-channel, and the page says
       only what a browser does.** Measured with TRUSTED drops (CDP
       `Input.dispatchDragEvent` with real file paths, headless Chrome 153,
       source transpiled in memory; a plain native input in the same run as
       control): a zone wrapping a **disabled** input takes 3 files and fires
       `change` (native: 0 files, 0 events); 3 files on a **non-`multiple`**
       input are all assigned and `FormData` carries three entries (native
       Chrome refuses the drop outright); the behavior fires `change` only
       where native fires `input` then `change`; a **text/plain drag**
       highlights the zone and is then swallowed; `data-dragover` differs from
       rest in **colour only** and in **zero** computed properties under
       forced colours; a zone around a disabled input has **zero** computed
       difference from an enabled one. And the three shipped texts that say
       drop-to-select works natively without the behavior (`file-upload.css:47`,
       `file-upload.astro:52`, ApiTable js line) are **false for the
       documented markup**: the input is `bo-visually-hidden` (1px, clipped),
       so a trusted drop with no init yields 0 files and Chrome opens the file
       in a new tab.
       - **Accept — parity is measured against native in the same run, never
         asserted.** For each of {disabled; non-`multiple` with 3 files;
         `multiple` with 3 files; one file}, the file names on the input and
         the ordered event sequence after a trusted zone drop agree with the
         same trusted drop on a plain visible input carrying the same
         attributes. A drag whose `dataTransfer.types` lacks `Files` leaves
         `data-dragover` unset and `dragover` un-prevented. Each new claim is
         red-proved by reverting its guard, with the injection confirmed in the
         BUILT `dist/js` before a pass is believed.
       - **Accept — two-channel.** With `(forced-colors: active)` emulated and
         asserted, at least one computed property differs between rest and
         `data-dragover`; in normal mode at least one differing property is not
         a colour; a zone with a disabled input differs from rest in a
         non-colour property and its cursor is not `pointer`; any fg/bg pair
         the states produce is in `PAIRS` and `check:contrast` agrees in both
         themes.
       - **Accept — the page.** Every sentence about what a drop does WITHOUT
         `initFileDropzone()` agrees with a trusted-drop case on the documented
         markup, or is in `EXEMPT` with a reason; the documented input's
         computed accessible name/description carry the visible instruction and
         the constraint hint (accessibility tree, not markup); every demo's
         visible hint agrees with that input's `accept`; the page states that
         `accept` does not filter a drop (native or forwarded — measured);
         rejected / in-progress / retry rows are static consumer-state markup
         composed from shipped surfaces with no timer or network call.
       - The CHANGELOG entry's compatibility classification matches the effect
         on the po-app composition and the docs demos, with the reasoning;
         `behaviors.json` agrees with the extractor after the change.
       - **Decided here, not forecast:** a several-file drop on a
         non-`multiple` input is **refused whole, the way native Chrome
         refuses it** — matching the platform is the deterministic floor and
         "take the first file" silently discards the rest; the cursor shows
         `not-allowed` during the drag (`dropEffect = 'none'`), which is the
         feedback the platform gives. Recorded so a later wake does not
         re-decide it.

       - **DONE 2026-09-19 (this invocation, slice 1 of ≤3).** Every Accept line
         held except where stated below; nothing was forecast, each number has
         its command.

         **Parity, measured against native in the same run** (`Input.dispatchDragEvent`
         with real files, headless Chrome 153; scratchpad `parity.mjs`, and now
         `check-claims.mjs` "file-dropzone parity"): for
         {`multiple`×3, no-`multiple`×3, no-`multiple`×1, `disabled`×3,
         `accept=".pdf"`×3} the zone and the plain input agree on files AND event
         sequence in **5 of 5** cases (was: 0 files/events native vs 3 files +
         `change` on the zone for `disabled`; 0 vs 3 for no-`multiple`; `[input,
         change]` vs `[change]` on every drop). Source checked first, then
         `dist/js` — same table both times. A text drag no longer highlights; a
         Text-node target no longer throws.

         **The red-proofs, and the one that came back green.** Twelve
         injections against the SERVED page or bundle, each counted before it
         was applied and asserted present after: five behaviour guards, four
         dropzone-state CSS guards, three row/list CSS guards. **Eleven went red
         on the intended claim first time. The `Files`-type guard went GREEN**,
         with the injection confirmed landed — so the defect was the gate:
         Chrome lists a text drag's items during `dragover`, `dragFileCount`
         already reads 0 and refuses it, and no trusted drag can make the type
         check the only discriminator. A synthetic empty `DataTransfer` can
         (no items, no files, no types), so that claim was added and re-proved
         red. This is CLAUDE.md's "a green red-proof is a defect in the
         injection until proven otherwise" resolving the other way: the
         injection was fine.

         **And one red-proof aimed at the wrong file.** The CSS red-proof
         first targeted `dist/assets/busy-office-ui.min.css`; the page loads
         `dist/_astro/colors.*.css`, whose spelling differs (`border-style`
         before `border-color`, `:is()` kept). Caught by reading which
         `<link>` the page emits before believing a result, and the run was
         killed and retargeted. Command: `grep -oE '<link[^>]*stylesheet[^>]*>'
         apps/docs/dist/components/file-upload/index.html`.

         **Found by the screenshot, missed by every gate.** The new
         progress/failure/retry demo rendered a 357px-tall row at 390px with the
         file name at **0px wide** — one letter per line. `check:layout` (128
         pages, "no overflow at 390") passed, because it looks for horizontal
         overflow and this grew vertically. Two causes, one of them older than
         this slice: `ul.bo-file-list` never reset the UA's `padding-inline-start:
         40px` (13% of a phone), and a row could not wrap. Fixed in
         `file-upload.css` and claimed (`file-upload rows @390`, red-proved by
         removing `flex-wrap`, the 12ch basis, and the reset, separately).
         **Filed as 373.9**, not built.

         **Contrast.** Adding `text-secondary`-on-`bg-selected` to `PAIRS`
         found the dragover hint's resting `text-muted` at **3.59-4.31:1 on the
         four dark brand presets** (`check:contrast` failed the core build).
         The hint steps up to `text-secondary` while dragging. The coverage
         scan could not see this pair: fg and bg are set in two different rules.

         **Gate cost, recorded so it is not paid twice.** `check:claims`
         179 → **203** (+24). Replacing the document with `page.setContent` /
         `document.write`, or opening a second `browser.newPage()`, made a
         `page.click` **21 claims later** block the renderer until the 120s
         protocol timeout while every assertion in the new block passed —
         found by tracing claim numbers, not by reading the error (which names
         only `Runtime.callFunctionOn`). The no-JS claim therefore runs LAST
         and says why in a comment; nothing may be appended below it.

         **Decided here, so a later wake does not re-decide:** a several-file
         drop on a no-`multiple` input is refused whole (as Chrome refuses it);
         `accept` is not enforced on a drop (Chrome does not either — measured);
         no upload-specific class exists (rows compose `bo-badge`,
         `bo-progress`, `bo-btn`); the dropzone's name comes from its own
         visible line via `aria-labelledby` (a separate `aria-label` beat the
         wrapping label and dropped the visible words out of the name — WCAG
         2.5.3), checked from the accessibility tree on every live demo.

         **CHANGELOG classification, with reasoning:** a fix, not Breaking —
         no class, attribute, event or export moved — but two effects are
         consumer-visible and are written down: a listener on `input` now fires
         on a drop, and existing `.bo-file-list`s render 40px left and wider.
         `po-app` was aligned (added `accept`, `aria-labelledby`,
         `aria-describedby`); it does not compensate for the indent.
         `behaviors.json`'s `initFileDropzone` hook list is unchanged
         (`grep -A8 initFileDropzone packages/core/dist/behaviors.json`).

         **Verified live, on the freshly built revision** (served from
         `apps/docs/dist`, not a cached container image): 1440 and 390, light
         and dark — solid border on dragover, dimmed `not-allowed` zone,
         solid red border with message, wrapped state rows. Gates green on the
         final tree: `build`, `docs:build` (every chained gate), `check:claims`
         (203), `check:po-app` (20), `check:forced-colors`, `check:target-size`,
         `test:axe` (128 pages × 2 widths, 0 violations), `check:layout`,
         `check:selftests` (22 heuristic / 183 cases run, 34 exact),
         `check:markup`. **Not verified, stated rather than skipped:** Safari
         and Firefox (native refusal semantics and a null `dragleave`
         `relatedTarget` were measured in Chrome only); a real screen reader
         announcing the description; touch; whether any engine actually targets
         a Text node with a drag event (only a synthetic dispatch proves the
         throw was real); the native PICK order `[input, change]` (taken from
         the spec — only native DROP was run). The reviewer was **not
         independent**: the adversarial pass was by the same agent, and it is
         what found the wrapped-row defect only because a screenshot was
         looked at.

2. [x] **373.2 — four shipped-status claims are false on the built site, and
       the decision page blanks 5 of 39 "Not when" cells it has structured data
       for.** `installation.astro:173` says the RF lower-floor profile is "not
       shipped yet" — `build:rf-essentials` + `check:rf-floor` run on every core
       build; `scope.astro:57` and BOTH READMEs' stamped not-for row list
       "Kanban boards" while `/patterns/kanban` ships in the sidebar;
       `density.astro:59` calls App Launch "forthcoming (Slice 9, queued)";
       `which-pattern.astro:29/46` re-parse the opener with a regex and drop
       `record-detail`, `role-home`, `command-bar`, `output-form`, `rf-putaway`
       although `patterns.json` carries a `wrongChoice.clause` for all 39; and
       `/concepts/layouts` says `check:markup` protects its four shell
       templates when an invented class inside a template string builds green
       (injection confirmed in the built page, 1 of 1 replaced).
       - **Accept:** each of the five either changes at its SOURCE (scope table
         re-stamped through `stamp-readme.mjs --check`, never a hand edit in a
         stat block) or records a one-line reason it should not; the count of
         non-blank "Not when" cells in the BUILT decision page equals the count
         of non-empty `wrongChoice.clause` in `patterns.json` counted by
         re-reading the JSON; the layouts sentence agrees with what the
         injection showed. No new gate — the population is 2 lexical matches
         and the Kanban case has no lexical marker (94.11).

3. [x] **373.3 — the app-shell contract, on the page that already owns it, and
       - **CORRECTION 2026-09-24 — part of this item's change was never committed** (DESIGN.md, /base/primitives and the Gallery drawer patch); it sat in the working tree, misfiled as owner checkpoint, so clean builds did not carry it. Landed in `24ca80b0`; found by the Standardize completeness critic.
       the two shipped CSS leaks the shell measurement found.** Measured on the
       fresh dist: (i) an `<dialog class="bo-offcanvas">` drawer holding a
       `bo-sidebar-nav` placed INSIDE a `.bo-app-shell` narrower than the rail
       band inherits the rail's icon-only collapse — labels render as 1×1
       clipped boxes; `Gallery.astro` carries a hand patch for the docs' own
       drawer (Objective §1: the fix lets a consumer delete code); (ii) on
       `/patterns/list-report` as shipped (bounded `max-block-size: 24rem`,
       sticky `thead`), Shift+Tab from the last row lands row 5's checkbox
       **16 of 16 px under the sticky header** — WCAG 2.4.11 at the block-start
       edge, the mirror of `form-section.css:100-103`'s block-end fix; (iii) a
       one-line toast covers 69 % of *Save* on a sticky `.bo-form-actions` at
       390×844. Plus the contract itself: Slice 156's binding decision is
       *"extend `/concepts/layouts`, do not fork a second page"*, so the
       region model (header / optional nav / workspace: page header, toolbar
       scope, app area, action region / overlays), the scroll owner
       (`__main`, and that the document does not scroll — T4's missing half),
       sticky offsets via `--bo-app-shell-pad`, top-layer ownership, the
       z-index scale and safe-area go THERE with every number derived from
       `sidebar-layout.css` / `z-index.css` rather than retyped.
       - **Accept:** a claims case injects the drawer markup inside a narrow
         shell and outside one as control and asserts the label's rendered box
         and computed `clip-path` agree; a claims case walks Shift+Tab with real
         keys on shipped `list-report` and asserts no focused control's rect
         intersects a `thead th` rect, red-proved on the current build; the
         toast/actions collision is either resolved (a documented clearance or
         region rule) or refused with the measurement; `grep -rnF "900px"` over
         docs src and `DESIGN.md` returns no shell-band restatement; the scroll
         owner is asserted by a claims case (`document.scrollingElement` does
         not overflow, `__main` does). **Refused here, with reasons:** a
         page-header component (breadcrumb + `h1` + cluster already compose
         it), a second rail (GAP-1's trigger unmet), a split primitive
         (31.2/152.1), speculative `env(safe-area-inset-*)` (state the
         `viewport-fit` assumption instead), `role="toolbar"` on any action row
         without the APG keyboard model.

4. [x] **373.4 — the shipped move/remove floor loses focus at completion, in
       - **CORRECTION 2026-09-24 — part of this item's change was never committed** (the ACR 2.5.7 row in extract-acr.mjs); it sat in the working tree, misfiled as owner checkpoint, so clean builds did not carry it. Landed in `5d0146f5`; found by the Standardize completeness critic.
       the framework and in the copyable sample.** Measured with trusted keys:
       Enter on `tag-input`'s remove button → chip removed, `activeElement ===
       body` (`tag-input.ts` `removeTag` calls `tag.remove()` with no handoff);
       Enter on editable-grid's *Remove line* → row removed, focus on `body`, in
       BOTH the live script and the copy-paste sample (`editable-grid.astro:80`,
       `:232`). This is the part of C2 that is not refused: the single-pointer,
       non-drag floor SC 2.5.7 asks for already ships everywhere (ordered-list
       `__actions`, kanban's server-legal *Move to…* menu, bulk-actions,
       tag-input) — what it lacks is the focus and announcement obligations
       written down.
       - **Accept:** after a trusted-key removal, `activeElement` is inside the
         same `.bo-tag-input` (first, middle, last and only chip), focus moves
         ONLY when the removed chip contained it, `bo:tag-remove` still fires
         before removal; the editable-grid case holds for live and sample and a
         rendered-row check pairs each *Remove* label with its own row; the
         ordered-list, kanban and editable-grid pages state where focus goes
         (including the boundary where the pressed button no longer exists)
         and that the status sentence is consumer-owned (317.1's style); the
         generated ACR carries an SC 2.5.7 row derived from a scan of
         `packages/core/src/js` with the command beside it, naming
         `file-dropzone` as the one drag surface and its click alternative.
         **Drag stays refused** — 100.1, 110.7 (owner re-ask, "not a third
         time"), 132.5 (membership), 317 (a generic move core: 4 of 5
         parameters are announcement strings); the reopen bars are quoted, not
         re-argued. No new "reorder" concept page (158.2).

5. [x] **373.5 — a searchable, viewport-filling launcher as a section of
       `/patterns/app-launch`, with zero framework source change.** Composition:
       header ghost button with `data-dialog-trigger` + `initDialogs()` (modal,
       Escape, Tab loop, focus restore — `check-claims.mjs:2303` already asserts
       the restore with real clicks); `<dialog class="bo-dialog"
       aria-labelledby>` with the recipe's visible Close; `<input type="search"
       class="bo-input">` as initial focus; one labelled section + `bo-widget-grid`
       per category, tiles `<a class="bo-widget">` with visible labels;
       `.bo-state` + `role="status"` count for no-results; hiding via `hidden`
       (leaves the Tab trap, `focus-trap.ts:20`). Page-local: ~6 declarations
       of viewport-filling sizing and ~20 lines of `data-keywords` substring
       filtering, like `command-bar.astro` and `value-help.astro:257` already
       carry. **Not** `initCombobox` (imposes listbox, hides headings under a
       query, brings 174.1's overflow trap) and **not** `bo-dialog--fullscreen`
       (99.3 refused a one-caller modifier; `dialog.css:15-19` argues against
       edge-to-edge panels — the page must justify its exception in its
       wrong-choice clause against 123.2's owner-confirmed popover switcher and
       command-bar's type-to-jump).
       - **Accept:** `git diff --stat -- packages/core/src` for the slice is
         empty or the page says why not; claims cases driven by CDP clicks and
         keys assert open → `activeElement` is the search input, Escape and
         Close → focus on the trigger, a substring query shows exactly the tiles
         whose label or `data-keywords` contain it (DOM-compared, not a
         hard-coded count), a keyword-only match shows its tile, a no-match
         query renders the `.bo-state` and the status count reads 0; long
         labels wrap at 390 with no horizontal overflow (`check:layout`).
         Whether a generic text-filter behavior should be extracted is a
         separate grill (two page-local copies would then exist — §3's bar is
         two real compositions), recorded in `.roundtable/` either way.

       - **Verified 2026-09-23, HOLD — the page ships a claim the build does not
         support.** The rendered prose reads "Opening, the search, Escape, Close
         and the focus moves are real and are verified by the build", and
         `check-claims.mjs` contains **zero** launcher cases (grep count 0 for
         `al-launcher`, `app-launch`, "All applications"). That is the same class
         374.6 corrected in the published conformance report: an artefact
         asserting verification that does not exist.
       - **And one of the asserted behaviours is broken.** Escape does not close
         the launcher while a query is typed: the field is `type="search"`, so
         Chromium's native Escape-to-clear consumes the first press and two are
         required. The empty-field case works, which is why it read as fine.
       - **The criterion names a gate that cannot see the property.**
         `check:layout` is cited for the 390px wrap, but it walks
         `.bo-app-shell__main` and a closed `<dialog>` computes `display: none`
         with a 0x0 rect. Its green is unearned here. Also: no long label exists
         to exercise the wrap (longest shipped is "Purchase orders"), and
         `data-keywords` — named in the criterion — does not exist; the
         implementation ships a JSON script block instead.
       - **Accept, revised:** the sentence about build verification is either
         made true (launcher cases in `check-claims.mjs`, driven by real key and
         pointer events) or removed. Escape is either fixed or the page and this
         criterion say two presses are needed. Runtime search/filter behaviour
         measured correct and is not in question.
       - **Closed 2026-09-23.** Escape fixed with an explicit `dialog.close()`
         on keydown (the native `type="search"` clear was consuming the key);
         seven claims cases now drive open / search / keyword-only / no-match /
         Escape / Close / the 390 wrap with real key and pointer events, taking
         the suite 263 -> 270; the Escape case is red-proved by removing the
         handler from the built bundle, with the injection confirmed landed and
         the bundle restored byte-identical. The page's sentence now names what
         actually runs. The 390 wrap is measured on the OPEN dialog rather than
         left to `check:layout`, which cannot see a closed `<dialog>`. The
         extraction question is recorded as a refusal in
         `launcher-filter-extraction-2026-09-23.md`, with a third caller of the
         same shape named as the reopen trigger. Completion review 0.89. Decision review scored the
         hold at **confidence 1.00**.

6. [ ] **373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals
       stand on the record and the reversal is not written down.** 123.2
       (2026-08-23): *"Mobile bottom-nav tier REFUSED for now (icon-rail
       collapse already ships; re-open on a real consumer need)"*, trigger
       sharpened in 125.2 to *"first phone-first consumer"*. Slice 154: *"A tab
       strip that hides on scroll-down and reappears on scroll-up — direction-
       driven chrome motion"* REFUSED. The 2026-09-19 prompt asks for exactly
       these two halves and says "do not silently reverse" the direction. The
       direction itself is taken as stated (upward = decreasing `scrollTop` in
       `.bo-app-shell__main`; reveal on downward; initial and no-JS state =
       visible), and its consequence is named: it is the reverse of the common
       mobile convention, so the persistent reveal control is load-bearing, not
       decorative. **Three questions, then it is dispatchable:** (a) does this
       supersede 123.2 and Slice 154 — both, or the dock only, leaving the
       general hide-on-scroll mechanism refused; (b) which consumer meets the
       "phone-first" trigger, or is the trigger withdrawn; (c) is the item
       cleared to add a CSS dir plus one call-once behavior if the compose-first
       spike (static `nav` + `.bo-btn-group--bar` links with `aria-current` in
       app-frame AND `erp-suite/_shell.mjs`) measures a real gap — the four
       things composition cannot do today are a shell slot, a hidden state that
       drops tab stops, safe-area insets (0 `env()` in source) and a clearance
       contract with `.bo-form-actions`.
       - **Accept (once answered):** the owner entry names what it supersedes;
         a spike report lists every C3 requirement as composed-from or missing
         with the measurement; direction, hysteresis, overscroll clamp,
         focus-within guard and manual reveal each have a claims case that
         asserts `scrollTop` really moved before believing a state; hidden items
         are not tab stops; reduced motion drops the transition; listeners
         follow `anchor-nav.ts:136` (one capture-phase document listener,
         resolve the scroller at event time).

7. [x] **373.7 — the six-intent recipe path exists; make its one router read
       - **CORRECTION 2026-09-24 (377 grill):** three of the five files its closing measurement called "this item's" and reverted for its baseline (`gen-suite-index.mjs`, `suite.json`, `screen-kit.astro`) were never touched by a 373.7 commit — they hold only the owner's 2026-09-20 journey checkpoint. The item's own files are `gen-llms.mjs`, `ai-assistants.astro` and `commands.mjs`.
       its own data and name the validator in the AI path.** Every intent
       maps to a gated page: find-and-act → `list-report`; inspect one →
       `record-detail` / `object-page`; create-or-edit → `detail-form` /
       `wizard`; list + selected → `master-detail`; review decision →
       `approval`; monitor → `reporting-dashboard` / `job-monitor`. The
       pattern recipe (Anatomy / Data contract / States / Components used) is
       already build-gated, `which-pattern` is generated from `patterns.json`,
       and `bo-check-markup` is a consumer-runnable validator. What is missing
       is small: `llms.txt` never names the validator command or the shells
       page, and `ai-assistants`' paste-in block does not state the order
       shell → pattern → components → verify.
       - **Accept:** the built `llms.txt` names the validator command read from
         the one source the ai-assistants snippet and the scaffolder use; every
         added URL resolves under gen-llms' existing assertion; the paste-in
         block's "Why these N things" agrees with its list; no States / Data
         contract / Anatomy text is added (gen-llms' "kept lean" stands) and
         the size delta is written into the item. **Not built, by name:** a
         machine-readable per-pattern recipe with required/optional regions,
         structural checks in `bo-check-markup`, a findings format — those are
         112.4 word for word, OWNER-BLOCKED behind 112.3's briefs; editing
         `llms.txt` changes the pilot's instrument and is written into 112.3's
         record rather than landed silently.

       - **Verified 2026-09-23, NOT landable — two gaps, not one.** Six of seven
         criteria measure PASS: the validator command is single-sourced
         (injection-proved), the three added URLs each pass gen-llms' existing
         assertion (failure-proved), "Why these five things" now matches its
         list, nothing from the exclusion list was added, and the instrument
         change is recorded in `pilot-112/README.md` with figures independently
         reconciled (49,982 + 556 = 50,538 B, SHA e9c1ef20…).
         **(a)** The size delta is still not written into this item —
         `git diff ROADMAP.md` was zero lines. **(b)** The changed page has no
         1440/390 light-and-dark verification; the prior session's claim of
         "four rendered viewport/theme cases" rested on `/private/tmp` evidence
         that no longer exists, so it is UNVERIFIED rather than done.
         Completion review scored this **0.35** — at the "evidence does not
         support" boundary — which corrected a wake that had reported it as
         "one line short". Gap (b) is a measurement, not clerical.
       - **Both gaps closed 2026-09-23.** (a) **The size delta is +556 bytes:
         llms.txt goes 49,982 -> 50,538.** Measured, not inherited: the prior
         figure was taken before three slices landed, so the baseline was
         rebuilt by reverting only this item's five files
         (`gen-llms.mjs`, `gen-suite-index.mjs`, `suite.json`,
         `ai-assistants.astro`, `screen-kit.astro`), running the docs build, and
         restoring them — 49,982 then 50,538, reproducing +556 against today's
         HEAD. (b) The changed page was measured at desktop and 390, light and
         dark: page overflow 0 and `__main` overflow 0 in all four, the paste-in
         block contained within the viewport at both widths (342px at 390), and
         its 356px horizontal scroll is `overflow-x: auto` — a scroll container
         by design, not a layout break. Desktop emulation reported innerWidth
         1600 rather than 1440 (the driver refuses that resize; `check:layout`
         sweeps DESKTOP_WIDTH across 128 pages including this one), so the
         desktop reading is "a desktop width", stated rather than rounded.
       - **One observation, not a criterion failure:** the paste-in block now
         carries SIX `##` sections while "Why these five things" explains five.
         The criterion is about the why-list matching its own `<ol>`, which it
         does (5 and 5). Whether the sixth section wants explaining is a
         judgement, recorded here rather than silently closed.

8. [ ] **373.8 — docs IA: collapse 17 sidebar groups into the prompt's seven
       (Start here / Foundations / Components / Patterns and layouts /
       Integration / Reference / Contributor and decision history). OWNER
       CALL.** It contradicts the recorded 2-level nesting cap (docs-IA
       comparison 2026-08-16; `Gallery.astro:88`) or yields a 42-item
       Components group, and Slice 112 REFUSED the six-section IA reorg pending
       a second real consumer. The cheapest honest option — non-interactive
       section labels over the existing groups, no third level — is the
       recommendation; the T1-T8 baseline above is the property to beat.
       Independent of the call and already concurred (Slice 249): a
       `CONTRIBUTING.md` that POINTS at `CLAUDE.md`'s recipes, `DESIGN.md`,
       `LOOPS.md` and `.roundtable/INDEX.md` with no second copy of any rule.
       DELETE nothing; the two "absent" lists (`DESIGN.md` component-level,
       `scope.astro` product-level) overlap on ~2 of 17 subjects and are NOT
       merged.

9. [x] **373.9 — `check:layout` is blind to vertical collapse: a name at 0px
       wide passed it with a 357px row.** Question, not a gate: should it also
       flag a text container whose rendered width is below N characters?
       - **Accept — decide from the base rate first (94.11).** Count how many of
         the 128 pages have any text node narrower than 8ch at 390px *today*; a
         predicate true of 0 pages cannot fail, and one true of many is noise.
         Either the count justifies a `@heuristic` gate with a `--self-test`, or
         the local claim shipped in 373.1 (`file-upload rows @390`) is recorded
         as the whole answer and this closes as refused with the count. Finding
         the gate unnecessary is a satisfying outcome.
       - **CLOSED 2026-09-23 as REFUSED, with the count — and the count settles
         it without judgement.** The literal predicate, "a text container
         narrower than 8ch at 390px", is true of **125 of 128 pages, 4,956
         boxes**. The item's own criterion says "one true of many is noise".
       - **The premise is TRUE, which is why this is a refusal and not a
         dismissal.** Injecting the 373.1 defect and running `check-layout`'s
         own probes verbatim: name at 0px wide, row 714px tall, both probes
         return null, gate PASSES. The blindness is real; it is the PREDICATE
         that cannot be built.
       - **No threshold separates the defect from the tree.** 8ch → 125 pages;
         require the text to wrap → 36; require 3+ lines → 21; under 4ch and
         wrapped → 1; under 3ch → 0. The band between is 4-column tables at
         390px, which are fine: `/components/quantity/`'s units column stacks
         "ea / each / pc pcs / unit / item / box / carton / pallet" with every
         word intact, while 373.1 broke ONE LETTER per line. "< 8ch" cannot
         tell those apart.
       - **The best-constructed predicate was tried and also fails.** "Box
         narrower than its own longest word" (browser `min-content`, with
         `overflow-wrap`/`word-break` forced normal so the property under test
         cannot suppress its own measurement) red-proves on the injection
         (0 vs 92.8px) and scores **0 true positives / 12 false positives** on
         today's tree — nine single-glyph icon buttons where the glyph paints
         over padding, and three `.bo-pagination__btn` whose text spills its own
         box but sits 49-231px INSIDE the parent, fully visible.
       - So 373.1's local `file-upload rows @390` claim is recorded as the whole
         answer. This is 94.11's ceremony case in mirror image: there the
         predicate was uniformly true, here no threshold exists at all.

10. [x] **373.10 — independent re-score of `file-upload · interaction`.** The
       DSA cite claimed "native drag-drop come free", which is false for the
       documented markup; it was corrected in 373.1 WITHOUT re-taking the
       score, because a re-score by the agent that changed the surface is not
       the independent second opinion `LOOPS.md` §3b step 4 requires.
       - **Accept:** a blind re-score of that one dimension, its date carried in
         its own cite and `scored` left where it is (the ledger's `$comment`).
         It may stay 3 or move; either closes it.
       - **CLOSED 2026-09-23: blind re-score HELD AT 3.** Scored independently
         from the shipped component and its page before reading the existing
         value, per `LOOPS.md` §3b step 4, then compared: 3 and 3. The cite in
         `dsa-scores.json` now carries the 2026-09-23 date; `scored` stays
         2026-08-21, because a single re-scored dimension must not move the
         full-pass date. No `improve` entry — nothing sits below 3.
       - Worth recording rather than just the number: after 373.1 this is now
         the repo's strongest example of the dimension, because the page names
         what omitting the JS actually COSTS ("the browser opens the dropped
         file instead") rather than merely noting a behaviour, and both halves
         are executable in `check:claims`.

**Refused in triage, with reasons:** a graph database or agent runtime (the
prompt's own boundary; `graph.db` is a derived mirror already); a per-slice
"requirement / benefit / nodes / evidence / rollback" record format beyond
what an item's Accept lines carry (a second record shape is what 326.3 and
158.2 measure the cost of); a new "reorder", "dock" or "launcher" component
family before its spike (§3: nothing ships for one screen); a universal quality
score (171.3: layout is not scorable; the DSA rubric stands).

**Sequence for this invocation (≤3 slices, the prompt's own budget):** 373.1
now — it is the only ask with HIGH behaviour defects in a stable behavior, its
harness (trusted drops) is reusable by 373.3's claims, and nothing depends on
an owner. Then 373.2 (independent, documentation-only). 373.3 / 373.4 / 373.5 /
373.7 are dispatchable by rule 4 in that order; 373.6 and 373.8 wait on the
owner and block nothing else.

## Slice 372 — Objective grill of Slices 369, 370, 371: every structural claim in 370 and 371 reproduces exactly, and the finding is in the instrument that READS the samples they wrote — **`per_day_last` discards a metric sample on a stated reason that is false at 72 of 73 pairs**, so rule 5 publishes a movement that never happened on **5 of 8** names and its own predicate flips on **3 of 8** (2026-09-09)

**Dispatched by rule 3**, cloud wake, `Objective 3 / 3 slices OVERDUE
[338, 370, 371]`. Rule 1 found **0** open P0 across **23** open items
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → 0); rule 2 read `1 / 4`. Rules
4-8 were not reached. Step 1 read both intakes in the REST form with §8's
controls: issues **1** (#2, `updated_at` `2026-09-06T15:10:34Z` — the **sixth**
consecutive hand-off recording that same value), discussions **0**,
`/not-a-real-route` **404**, so the empty list means *served and empty*.
**Nothing triaged.**

**Both Step 0 traps bit, plus the third.** The container arrived **detached**
(`git branch --show-current` empty at `61e9d92f`) and **shallow** (50 commits);
`git fetch origin main && git checkout -B main origin/main` and
`git fetch --unshallow origin` fixed both — **2,112** commits, **8** tags, no
`shallow.lock`. Per §2 the tag count is the check, not a pinned value. And
`node_modules` was absent again, so `npm ci` ran first.

**The arming set resolves to Slices 369, 370, 371** — `338` is an item id whose
slice is 369, `370` and `371` are genuine slice numbers. Resolved by reading the
commit subject at each row's sha, per §0's rule, not by treating the label as an
ordinal. No earlier grill heading names any of the three, and `INDEX.md` reports
**4 repeated subject(s)** corpus-wide, none of them here — so nothing was
narrowed out. The full report is
`.roundtable/grill-objective-369-370-371-2026-09-09.md`.

### The finding: rule 5 discards a sample on a reason that is false at 72 of 73

`per_day_last` keeps only the last sample of each calendar day and records why:
*"a wake that samples twice in one day is correcting itself, and rule 5 compares
what each run concluded."* That is a claim about the data, so it was checked
against the data. **A sample separated from the next by a commit cannot be a
correction of it — the thing measured changed in between.** Counting distinct
commit shas strictly between each adjacent intra-day pair, over all **143**
samples in `loop-metrics.jsonl`:

```
adjacent pairs with NO commit between (a wake correcting itself):  1
adjacent pairs separated by >=1 commit (distinct trees):          72
```

The one pair matching the docstring is `behaviors_frozen`, **19.0 → 18.0 at the
same minute**, `2026-08-16 11:25`. Every other spans 2 to 50 commits.

**The case the rule was built around is the clearest counterexample.**
`LOOPS.md:609` and `dispatch_status.py:933-934` both present `ci-wall-time`'s 26
samples as one wake's burst — the latter outright: *"a burst inside one wake is
NOT two runs."* That window (`2026-08-18 02:48 .. 19:54`) carries **36 loop-log
rows, 35 distinct commit shas and 5 distinct loops** (`Continue`, `Explore`,
`Objective`, `Roadmap`, `Standardize`). The 17 hours are real; "one wake" is not.

### What it costs, and it is not cosmetic

Rule 5's trigger is *"regressed on TWO CONSECUTIVE runs"*; the implementation
maps *run* to *calendar day*, and 72 of 73 discarded samples were separate runs.
Across the 8 day-paired names that are rule 5's actual input set, **5 publish a
movement that occurred between no two samples**:

| name | published (per-day) | last two ACTUAL samples |
|---|---|---|
| `dispatch-region-words` | 7492 → 7484 **−8** | 7552 → 7484 **−68** |
| `components` | 25 → 30 **+5** | 29 → 30 **+1** |
| `claims` | 169 → 176 **+7** | 170 → 176 **+6** |
| `bundle-gz-kb` | 11.7 → 15.1 **+3.4** | 15.1 → 15.1 **+0.0** |
| `behaviors_frozen` | 16 → 18 **+2** | 19 → 18 **−1** (sign inverts) |

And on the rule's own predicate — two consecutive moves in one direction — the
two readings **disagree on 3 of 8**: true at sample level, invisible at day
level (`behaviors_frozen`, `ci-gates`, `dispatch-region-words`).

**`dispatch-region-words`'s two same-date samples were written by two different
wakes nine hours apart**, which is why this grill surfaced it. Attributed by
`git blame --line-porcelain` on `loop-metrics.jsonl` (164.2's method, and the
one `353.2` exists because a sample carries no commit of its own):

```
line 141  7552  2026-09-09 00:55   4cfb8b2c  "record Slice 363 …"  (00:58 +0000)
line 143  7484  2026-09-09 09:44   61e9d92f  "record Slice 371 …"  (09:49 +0000)
```

Slice 370's wake sits between them (08:54), read the region at **7,552** in its
lane-4 write-up, and **recorded no sample at all**. So the discarded reading is
not a correction Slice 371 superseded — it is another wake's correct reading of
an earlier tree, and rule 5 never sees it. Slice 371's hand-off meanwhile states
the movement as *"the region genuinely moved (7,552 → 7,484)"* while
`dispatch_status.py`, run in that same wake, printed
`2026-09-08 7492 -> 2026-09-09 7484  -8`. **Two numbers for one movement, 8.5x
apart, in one wake's record, unreconciled.**

**Evidence, not Hypothesis** — two independent sources: commit boundaries in
`loop-log.md` against sample stamps in `loop-metrics.jsonl`, and the live output
of `dispatch_status.py`, which printed the −8 at this wake's Step 0b before any
of this was measured.

### What these numbers do NOT cover, said before they are quoted

- **"Two consecutive moves in one direction" is the SHAPE of rule 5's predicate,
  not its verdict.** No direction is recorded with a sample (324.1), so a rise is
  a regression for `bundle-gz-kb` and the goal for `claims`. The 3-of-8 figure is
  about what the rule can SEE, not what it should fire on.
- **A commit between two samples proves they read different trees, not
  different wakes.** One wake can commit twice. The one-wake reading is refuted
  for `ci-wall-time` by the five distinct loop names, not by the count alone.
- **This does not establish the day unit is WRONG.** 324.2 measured
  `bundle-gz-kb` under four pairings and argued its sample-to-sample moves are
  noise; for a shared-runner timing that is plausible. What is established is
  that the recorded JUSTIFICATION is false and the case cited for it is
  mislabelled — separable, and only the first is proved.
- **`353.2` is adjacent and is NOT this**, so nothing is filed twice. It asks
  that a `dispatch-region-words` sample be traceable to its commit; this is about
  which samples the pairing keeps.

### What reproduced — and the 56 that looked like a discrepancy

Re-measured by **importing** `report_loop_prose.dispatch_sections` rather than
re-implementing its convention, as both slices did: rule 3 body **907** words
(exactly one section matches); `### Step 0c` **1,520**; `LOOPS.md` whole-file
**18,241**; `LOOPS-archive.md` **3,880**; the moved P4 paragraph present in the
archive **exactly once** and absent from `LOOPS.md`. **All four of Slice 370's
lanes were re-run against a built `dist` and each reproduces its published
figure** — lane 1 `0 dead attribute(s) … 1365 live`, lane 2 `74 · 242 · 230 · 8`,
lane 3 `119 page(s) · median 798 · 114,124 words`, lane 4 Step 0c `1,520`.
**Every structural claim in Slices 370 and 371 reproduced exactly.**

**One imprecision, recorded and NOT filed.** Slice 370 quoted lane 1's
*attribute* line and called the lane clean; the same run's second line reads
**11 dead declaration(s) on 9 page(s)** — the per-declaration view 320.2 added
because a dead declaration can hide behind a live sibling. The 11 is neither new
nor unnoticed: it is tracked as its own metric, `dead-declarations`, which moved
52 → 11 on 2026-09-08 and has not moved since. 370 quoted the weaker of the two
figures its lane prints; that is worth a sentence in the next sweep, not an item.

The dispatch region first read **7,428**, and the 56 was run down rather than
rounded off: `dispatch_heading_words` counts the region's own `##`-`####`
heading lines and returns **56**, so 7,428 + 56 = **7,484**. `353.2` already
documents that constant. Not a discrepancy.

**Not re-run, and named rather than implied:** Slice 371's 25-revision series
and its "all three quoted fragments are in P5" check need pre-cut revisions and
were not replayed — the endpoints reproduce, the path between them is taken on
371's word. **Slice 369's print figures were not re-measured at all** (a
multi-hour headless-Chrome + PDF re-derivation); its two browser-free citations
were, and both are exact — `print/index.css:99-102` is
`.bo-timeline__marker, .bo-stepper__marker { print-color-adjust: exact }`, and
the gate header's *WHAT THIS GATE DOES NOT SEE* paragraph carries its correction
in place, in the same commit `c5780113`.

### Three instrument defects in this grill's own work

0. **Authorship inferred from timestamp proximity instead of measured.** The
   first draft of the paragraph above said both `dispatch-region-words` samples
   were written by slices in this arming set, because 7,552 sits between Slices
   370 and 371 in time. `git blame` says the wake that wrote it recorded **Slice
   363**, and Slice 370 recorded no sample at all. Caught before publishing, by
   running the very blame the paragraph was about to cite `353.2` for. **The
   finding is unchanged** — nothing in it rests on which slice authored a
   sample.
1. **The commit-boundary probe was dead on its first run** — it called
   `r.get("sha")` on rows from `dispatch_status.rows()`, which returns only
   `at`/`loop`/`item`, so the set was always empty and it reported **0 commits
   between for 17 of 17 buckets**. Caught by the identical-value tell, then
   believed only after a **positive control** (9 distinct shas on 2026-09-09)
   and a **negative control** — the detector must be able to return 0, and does,
   exactly once, on the same-minute `behaviors_frozen` pair.
2. **A paraphrase-grep reported a false absence.** `grep -cF` for `"12 of 17"`,
   `"crossings 51"` and `"18 rows"` — `ROADMAP.md`'s wording for the moved text
   — returned **0** in both files while the text is present under the archive's
   own wording. Not reported as an absence; caught by opening the paragraph.

**Filed by this slice:**

1. [ ] **372.1 — rule 5's pairing keeps the last sample of each calendar day on
       a recorded reason that is false at 72 of 73 pairs, and the case cited for
       it is mislabelled.** Measured above. The consequence is not cosmetic: on
       **5 of 8** day-paired names the published movement occurred between no two
       samples (`dispatch-region-words` −8 against a true −68), and the rule's own
       two-consecutive-moves predicate **disagrees between the two readings on 3
       of 8**.
       - **Accept — the property, and finding the unit RIGHT is a satisfying
         outcome.** EITHER `per_day_last`'s stated reason is replaced by one that
         reproduces against the data, with the command beside it, and the
         `comparable set` line says which movement it reports so a wake cannot
         read a day-close delta as a consecutive one — **OR** the pairing unit
         changes and the same 8-name set is re-measured showing what moved.
         Deciding that the day unit is correct and only its justification was
         wrong closes this just as well; so does deciding the reverse. What does
         not close it is leaving two numbers for one movement in one wake's
         record.
       - **Lane: cloud-takeable.** It is a Python module, a docstring, a
         self-test fixture and one sentence of `LOOPS.md`; no rendered evidence
         is involved.

**Refused, with the measurement:** a gate asserting *"a metric sample must not
be discarded when a commit falls between it and the next"*. The predicate is
true of **72 of 73** intra-day pairs today, so the gate would be red on a
correct tree from its first run — 94.11's base-rate rule pointing the other way
(there a predicate true of 100% distinguished nothing; here one false of 99%
would fail everything). The property belongs in the pairing's own reasoning, not
in a build gate.

## Slice 371 — `339.2` decided: the +303 is **THREE kinds, not two**, and 279.4's inline argument covers only **one of the two paragraphs it was thought to protect**. All three quoted fragments of that argument sit in the paragraph that STAYS; the cost narrative it was read as defending contains none of them, and every one of its figures is carried more completely beside `CLOSES_A_SLICE`. Rule 3: **975 → 907 words** (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 370 — Standardize sweep, **4 of 4 lanes**, all three artefact lanes clean; the finding is that **`351.1` was decidable from evidence `350.1` already carried in prose**, so the base-rate command now windows `a..b^`. Under `a..b` a sweep is classified *has lane input* on the strength of **its own commit** — `f9e0f17d..161ede68` is 16 commits, **15 touching no lane input**, the 16th being the sweep (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 369 — `338.1` decided: **refused on its named instance, and the instrument its own Accept prescribed is the wrong one.** `.bo-timeline__marker` prints at **5.66:1** (worst state), not the filed 2.54:1, because `print-color-adjust: exact` keeps its disc. The general gap is real and framework-wide — **19,511 of 26,817** painted text fills below AA on **125 of 128** pages — but every computed-style figure about it over-states, because Chrome rewrites light text on the way to paper (2026-09-09)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item. Rule 1
no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across **24**
open items); rule 2 `Standardize 3 / 4 ok`; rule 3 `Objective 0 / 3 ok`. Rule 5
was **EVALUATED, not skipped** even though rule 4 fires above it:
`Optimize 0 wake-date(s) newer — ok`, movers `gates` +1,
`dispatch-region-words` +60, `claims` +7, none a regression on two consecutive
runs. Step 1 read both intakes in the REST form with §8's controls — issues
**1** (#2, `updated_at` `2026-09-06T15:10:34Z`, unchanged since the previous
wake and already triaged as `300.2`), discussions **0**, `/not-a-real-route`
**404** — and triaged nothing.

**Everything older than 338 was re-derived as blocked from each item's own
text**, not from the hand-off's list: Slice 15 (owner hardware), `112.3`/`112.4`
(owner briefs), `249.7`/`249.10`-`249.13` (owner calls), `273.2`, `296.3`
(owner calls), `320.3` (**browser-blocked in the screenshot sense** — its Accept
says outright "a **rendered** change a cloud wake cannot judge"), `335.1`
(cloud-blocked in the WRITE sense). `338.1` is the oldest item this wake could
honestly take, and its own text says so: *"a computed-style reading under print
emulation is the right one, and a cloud wake can take that"*.

### The verdict on the named instance: REFUSED, with the measurement

`.bo-timeline__marker`, measured under `emulateMediaType('print')` on the built
site, both themes, `data-theme` forced exactly as 298.1 did:

| state | dark: glyph on disc | light: glyph on disc |
|---|---|---|
| `done` | rgb(134,239,172) on rgb(20,48,29) = **10.17:1** | rgb(21,128,61) on rgb(240,253,244) = **4.79:1** |
| `current` | rgb(94,234,212) on rgb(11,59,55) = **8.38:1** | rgb(17,94,89) on rgb(240,253,250) = **7.27:1** |
| `rejected` | rgb(252,165,165) on rgb(58,29,29) = **8.06:1** | rgb(185,28,28) on rgb(254,242,242) = **5.91:1** |
| `pending` | rgb(156,163,175) on rgb(38,42,51) = **5.66:1** | rgb(75,85,99) on rgb(243,244,246) = **6.87:1** |

The filed **2.54:1** is `rgb(156,163,175)` against **white**, and the marker
never meets white paper. `print/index.css` gives
`.bo-timeline__marker, .bo-stepper__marker { print-color-adjust: exact }`, which
keeps the disc — so the pair on paper is glyph-on-disc, and the worst of the
eight readings is **5.66:1**, above AA for normal text.

**The item's own gate already knew this and the gate's two paragraphs
contradict each other.** `check-print-tokens.mjs`'s *NO EXEMPTION LIST*
paragraph names that exact rule by file and selector; its *WHAT THIS GATE DOES
NOT SEE* paragraph, twenty lines later, computes the same marker against white
as though the rule were not there. Corrected in place by this slice.

**Not modelled — measured on the artefact.** "Backgrounds are dropped unless
`exact`" is a claim about what a printer paints, so it was taken from the PDF
rather than from computed style: `page.pdf({ printBackground: false })`, the
print dialog's default, inflating every content stream and parsing the fill
operators. Both marker discs, rgb(20,48,29) and rgb(11,59,55), are **PRESENT**;
the non-exact page canvas rgb(15,17,21) is **absent** in that same PDF and
**PRESENT** when `printBackground: true`. Two controls pointing opposite ways in
one artefact.

### The general gap is real, framework-wide, and NOT what a source trace predicts

`check:print-tokens`'s header calls this *"a narrow gap and not a
framework-wide one"*. Measured over all **128** built pages, dark theme,
`printBackground: false`, counting only fills that draw text:

```
distinct text fill colours actually painted : 40   (26,817 text fill ops)
below 4.5:1 against white paper             : 17 colours, 19,511 ops, 125 of 128 pages
```

So the mechanism the item filed is real and the word "narrow" is wrong. **But
the numbers a computed-style reading gives for it are all wrong**, and that is
this slice's substantive finding.

### Chrome rewrites the colour between the cascade and the paper

`print-color-adjust: economy` — the default — does not merely drop backgrounds.
It **darkens light text** when it drops them. Measured as a 2×2 on
`/concepts/scale/`, which is what identifies the mechanism rather than guessing
at it:

| | `printBackground: false` | `printBackground: true` |
|---|---|---|
| **dark theme** | rgb(249,250,251) → painted **rgb(166,166,167)** | painted rgb(249,250,251), unadjusted |
| **light theme** | rgb(17,24,39) → painted rgb(17,24,39) | rgb(17,24,39), identical |

The adjustment fires only when the colour is light **and** backgrounds are
dropped. The light-theme row is the control that rules out "the PDF just writes
different numbers".

What it does to the ratio, computed style → actually painted:

| token (dark) | computed | painted | computed ratio | **real ratio** |
|---|---|---|---|---|
| `--bo-color-text-primary` | rgb(249,250,251) | rgb(166,166,167) | 1.05:1 | **2.43:1** |
| `--bo-color-success-text` | rgb(134,239,172) | rgb(87,155,111) | 1.4:1 | **3.32:1** |
| `--bo-color-text-secondary` | rgb(209,213,219) | rgb(129,131,135) | 1.47:1 | **3.80:1** |
| `--bo-color-danger-text` | rgb(252,165,165) | rgb(168,110,110) | 1.9:1 | **4.10:1** |
| `--bo-color-accent` | rgb(45,212,191) | rgb(27,128,115) | 1.86:1 | **4.79:1 — PASSES** |
| `--bo-color-warning` | rgb(245,158,11) | rgb(245,158,11) | 2.15:1 | **2.15:1 — unchanged** |

**One row is not a magnitude error but a wrong verdict**: `--bo-color-accent`
fails the computed reading and passes on paper. A gate built on the instrument
338.1's Accept prescribes would have accused correct code.

**So the Accept's own sentence is false**, and it is corrected rather than
quietly satisfied: *"a computed-style reading under print emulation is the right
one"*. It is not. It is an INPUT to a system that rewrites it, which is
CLAUDE.md's downstream-artefact rule (*"when something DOWNSTREAM can rewrite
the artefact, its output is the artefact — not what you handed it"*) with print
as the downstream system. Whether the computed reading is *usable* is decided by
the question: for "does this element set its own colour and survive the print
reset", yes; for any RATIO that will be published, no.

### What the numbers do not cover, said before they are quoted

- **The 19,511 includes ~30 false positives from `exact` subtrees.** Four
  colours appear at their *unadjusted* token values — rgb(156,163,175) ×13,
  rgb(134,239,172) ×9, rgb(94,234,212) ×6, rgb(252,165,165) ×2 — which is the
  signature of a subtree Chrome left alone, i.e. the markers and `.bo-icon`.
  Measured against white they read 1.4-2.54:1; they are not on white. The same
  colours appear *adjusted* elsewhere in the same sweep, which is the internal
  reconciliation that identifies them.
- **One headless Chrome, one build.** Whether headed Chrome, Firefox or Safari
  apply the same economy adjustment is **untested here**. Firefox is not known
  to darken text this way, so the framework-wide reading is a floor for Chrome
  and says nothing about the others.
- **The classifier for "this fill draws text" is a lookahead** (`BT` before the
  next `re … f`), not a parse. It is a heuristic, and it is named as one.
- **10 of 128 pages do not get the print reset on `body` at all**, in both
  themes — the three `components/demos/*`, the six `patterns/rf/*` and
  `patterns/schedule/full`. Their `body` stays at the theme colours under print
  emulation. Filed below as `369.2`; not folded into the figures above.

### Two instrument defects, both caught before anything was published

Recorded because the base rate says to expect them, and both are textbook shapes
from CLAUDE.md:

1. **75,437 of 75,546 below AA — a 99.86% that was a defect in the instrument.**
   `getComputedStyle(el).display` does not walk ancestors, so every label inside
   a `@media print { … display: none }` subtree was counted as visible; the docs
   sidebar alone contributed 27,643. Fixed with `el.checkVisibility()` plus a
   non-empty `getClientRects()`, and red-proved both ways: an injected
   `color: var(--bo-color-text-muted)` paragraph moved the count `797 → 798` and
   the below-AA count `793 → 794`, appearing at exactly 2.54:1, while
   `.bo-sidebar-nav__label` reads `display: block` for itself and
   `checkVisibility() === false`.
2. **All seven PDF cases read "absent" — an identical value across every input.**
   The stream parser was fine; the fill matcher built `0.08\d*` while Chrome
   writes leading-dot floats (`.0784 .1882 .1137 rg`). It could not have matched
   anything, in either arm, and it looked exactly like a clean negative result.
   Fixed by parsing every operator to 0-255 and comparing with a ±1 tolerance.

### Commands, so the next wake re-runs rather than re-derives

Probes were throwaway and lived in the scratchpad, never the repo (three files:
computed-style walk, PDF fill sweep, 2×2). Each is `serve-dist.mjs` +
`browser-harness.mjs` by absolute path plus `page.pdf()`, and the re-runnable
core is:

```
node -e '…' # emulateMediaType("print"); control: body must read
            # rgb(255,255,255) / rgb(0,0,0), and 10 pages do not
page.pdf({ printBackground: false })   # then inflateSync every stream and
                                       # parse /([\d.]+) ([\d.]+) ([\d.]+) rg/
```

1. [x] **338.1 — the gap `check:print-tokens` cannot see.** **REFUSED on its
       named instance, with the measurement**, per its own Accept's second
       branch. `.bo-timeline__marker` reads **5.66:1** at worst, not 2.54:1;
       `print-color-adjust: exact` is why. The gate header's *WHAT THIS GATE
       DOES NOT SEE* paragraph is corrected in the same commit. The premise
       being false was a satisfying outcome, as the item said it would be —
       and the base rate the other branch asked for was measured anyway,
       because it is what says whether the gap is empty or merely not here.

**Filed by this slice:**

2. [ ] **369.1 — should printing from the DARK theme force the light palette?
       OWNER OR ARCHITECTURE CALL.** Measured above: **19,511 of 26,817**
       painted text fills, on **125 of 128** pages, are below 4.5:1 on white
       when a reader prints from the dark theme with the print dialog's default
       settings. Chrome's economy adjustment lifts the worst from 1.05:1 to
       2.43:1 and rescues exactly one token outright, and it is a UA behaviour
       no other engine is known to share. The framework already declares its
       intent — `reset/index.css` prints `body { background: #fff; color: #000 }`
       — so the question is only whether that intent should extend to the
       tokens that beat it on specificity.
       - **Accept — the property, and refusing is a satisfying outcome.**
         EITHER a decision lands that print re-points the `--bo-color-*` set at
         the light values (one `@media print` block re-declaring the theme, not
         a per-component sweep), with the same PDF measurement re-run to show
         the painted set moved and `check:print-tokens` amended, since that
         block would be a deliberate, wanted exception to the gate's own rule —
         OR it is refused with the reason recorded, in which case the gate
         header stops calling this gap "narrow", because measured it is not.
       - **Lane: owner-blocked.** It is a palette-wide behaviour change with a
         visible print result, and no wake should take it unilaterally.

3. [ ] **369.2 — 10 of 128 pages never get the print reset on `body`.**
       Measured this wake, both themes, under print emulation: the three
       `/components/demos/*` pages, the six `/patterns/rf/*` pages and
       `/patterns/schedule/full/` keep `body` at the theme's own
       background/colour instead of `#fff`/`#000`. Every other page flips.
       Whether that is correct (these are embedded/full-bleed demo documents
       that may not be meant to print at all) or a specificity loss like the
       one 338.1 filed is **not decided here, because it was not measured** —
       the reset's loss was observed, the winning rule was not identified.
       - **Accept — the property.** Name the rule that beats
         `reset/index.css`'s `@media print { body { … } }` on each of the ten,
         then EITHER they are print-exempt by intent and that is recorded in
         one line, OR the reset is made to win and the same ten are re-measured
         showing `body` at rgb(255,255,255) / rgb(0,0,0). A cloud wake can take
         this: it is a computed-style reading, not a rendered image.

## Slice 368 — Objective grill of Slices 365, 366, 367: **45 of 50** published assertions reproduce, and the one substantive defect is a count taken over a population that was **7/15 one-line archive pointers** — an instrument that opened the stub instead of the body, which the slice's own red-proof structurally could not reach. The arming set needed resolving first: **all three** counter labels are item ids, and the hand-off resolved one (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 367 — `337.1` closed with a wrapper, because two of the three fixes its Accept offered were **not available**: `LOOPS.md` never carried a `-s` to drop (**0** occurrences of `npm run -s ` in the file), and the per-lane write-up rule is **4 of 15** sweeps old [**corrected by Slice 368: 5 of 15 in that population, 7 full write-ups across all 47 sweeps, and the convention is 27 sweeps old**]. The filed trap reproduces and is worse than filed — **0B stdout AND 0B stderr** — and a second byte-silent form exists that the item does not name (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 366 — `336.2` decided: **print the union** — and the base rate it was filed on is **1 of 7**, not 2 of 2: Slice 326 printed `union = 15` in its own entry and failed on the ENUMERATION instead, which no report line can prevent (2026-09-09)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item. Rule 1
no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across **26**
open items); rule 2 `Standardize 1 / 4 ok`; rule 3 `Objective 1 / 3 ok [334]`;
rule 5 `Optimize 0 wake-date(s) newer — ok`, EVALUATED not skipped: its
comparable set's movers are `gates` (55 → 56, coverage growth, one pair) and
`dispatch-region-words` (+60), neither a regression on two consecutive runs.
Rules 6-8 not reached, so `polish_requeue.py --apply` was correctly NOT run.

**Step 1 read both intakes, with `ENVIRONMENT.md` §8's controls:**
`/issues?state=open` → `HTTP 200, len 1` — issue #2, `updated_at`
**2026-09-06T15:10:34Z**, unmoved for a thirty-second consecutive hand-off;
`/discussions` → `HTTP 200, len 0`; `/not-a-real-route` → `HTTP 404`, so the
`200 []` means *served and empty*. No new untriaged input, so Step 1 committed
nothing.

### `335.1` is ahead of `336.2` in rule 4's order, and this wake measured its blocker instead of assuming it

`335.1` is the oldest cloud-takeable item and its Accept allows filing a
throwaway discussion to settle it. **The write path is refused in this session,
and that is measured rather than inferred.** A repository discussion is created
by the GraphQL `createDiscussion` mutation, and this session's GraphQL endpoint
is refused outright:

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" -H 'Content-Type: application/json' \
  -d '{"query":"query { viewer { login } }"}' https://api.github.com/graphql
  -> HTTP 403  "This GraphQL query is not enabled for this session — only the
                pinned set of PR-review operations is served."
```

**Three different valid queries, three identical 403s** — `viewer`, a
`repository { discussionCategories }` read, and a bare `__type` introspection —
so the refusal is the endpoint, not one query. The repo object read with the
same token reports `permissions {admin, maintain, push, triage, pull}` **all
false**, and no `mcp__github__*` tool in this session's set touches discussions.

**What was NOT measured, and deliberately so: whether a REST POST to
`/discussions` would work.** The only probe that would settle it is a request
that can create a real, public, outward-facing item in the owner's repository,
and no owner is live in a scheduled wake to authorise one; a body crafted to
fail is still that request. What the API says about itself is the weaker
evidence taken instead, and it reproduces `ENVIRONMENT.md` §8's reading exactly:
`/discussions/categories` → **HTTP 404** with
`documentation_url: rest/repos/discussions#get-a-discussion` — the family's own
anchor is a **get**. So this item's blocker is stated as *the GraphQL path is
refused and the REST path is untested-by-choice*, not as *no write path exists*.

So `335.1` stays **OPEN** and **gains** the Lane line it never had: it is
neither owner-blocked nor browser-blocked but **cloud-blocked in the write
sense** — a local wake, whose `gh auth token` carries the owner's own GraphQL
access, can file the test discussion; a cloud wake cannot reach the mutation at
all. That is exactly the naming `LOOPS.md` rule 4 demands, and the reason it is
written into the item rather than only here is that this hand-off is rewritten
wholesale every wake (169.3): **this is the first wake to reach `335.1` under
rule 4, and without the Lane line the next cloud wake re-derives the same
403.** Rule 4 therefore fell through to `336.2`, the next cloud-takeable item.

### The Accept asks for the base rate re-measured at this revision, and it moved against the item

`336.2` was filed on *"2 of the last 2 sweeps mishandled lane 3 — 326 on a stale
enumeration, 332 on the population"*, with its own instruction that the wake
taking it re-measure over however many sweeps exist by then. Seven do, and the
enumeration is the log's, not a heading grep alone — `grep -oE '^## Slice [0-9]+
— Standardize sweep' ROADMAP.md` and `grep -n ' · Standardize · '
.roundtable/loop-log.md` agree on the same set:

| sweep | what its lane-3 entry asserts cleanliness over |
|---|---|
| **326** | *"10 over 2x the corpus median (1,584); 11 over a family median; **union = 15**"* — correct |
| **332** | *"10 over 2x … checked per page"* — **the corpus half only** ✗ |
| **339** | *"the flagged union is **15**"* — correct |
| **345** | *"the flagged union is **15** pages"*, the five family-only named — correct |
| **350** | *"the flagged union is **15** pages"*, the five named, enumeration read out of the archive — correct |
| **357** | *"the flagged union is **15** pages"*, on fresh medians (`798 / 959 / 114,124`) — correct |
| **363** | *"the flagged union is **15**"*, enumeration re-derived from the archive — correct |

**So the failure this item would remove occurred in 1 of 7, and 0 of the last
5.** The filed premise is true of lane 3 *broadly* and false of *this* failure:
Slice 326's own entry prints `union = 15` and its recorded finding is the stale
`Verdicts to date` clause in `LOOPS.md` — a hand-maintained list, which printing
a union cannot protect. **Read the premise as 1 of 2, not 2 of 2**, and the
"for" argument in `336.2` is correspondingly weaker than filed.

**What could NOT be measured, said plainly.** Whether the five correct sweeps
*derived* the union or copied the previous sweep's phrasing is not recoverable
from the record. Two of them ran the report fresh — 350 quotes the moved
threshold `1,596` where 326 quotes `1,584`, and 357 publishes a moved mean and
total — but that shows a fresh REPORT run, not a fresh union. The five
family-only page paths are identical in 345, 350, 357 and 363, which is
consistent with either. No claim is made either way.

### Decided: print it — on the contract, not on the base rate

The base rate argues against; the change was taken anyway, on a different ground
that the re-measurement does not touch. `LOOPS.md` §3 lane 3 is a **two-clause**
definition — *over 2x the CORPUS median, or over 2x its FAMILY median* — and the
report answered the first clause under its most prominent line while the second
lived inside a per-family breakdown. That is the shape `CLAUDE.md`'s storage
doctrine names outright: **a derived artefact that under-reports is worse than
none, because its number gets quoted.** Slice 332 quoted it.

The Objective test it passes is principle 3's **rethink**: *reuse by
copy-paste-modify means extract the reusable core*. Five consecutive sweeps
hand-wrote the same union arithmetic and the same five URLs into their entries;
that arithmetic now lives in the instrument.

**What it costs, named.** Three printed lines where there were none, in a report
whose growth `336.2`'s "against" clause is right to worry about — `LOOPS.md`
`341.1` and `353.2` both have prose growth open. It is held to three by printing
the count plus **only the family-only additions**: the corpus set is listed
above it and is not repeated, so this is not the third list the item feared. The
corpus headline also now names itself **one clause of the lane, not its
population** — and *"half"*, the word `336.2` uses and this entry quotes, is
itself imprecise for 10 of 15, which is why the shipped line does not use it.

**Refused in the same breath, so it is not inferred from silence:** amending
`LOOPS.md` §3 lane 3. Its text already states the two-clause definition
correctly — the tool was the half-answer, not the playbook — and `LOOPS.md` is
**byte-for-byte unchanged** by this slice.

### Red-proved by discrimination, three ways, and each injection was confirmed to land

A union line could be echoing either half or a constant `15`. Three probe copies
in the same directory (`ENVIRONMENT.md`'s rule — never `git stash`), each
injection grepped to confirm it changed exactly the intended line before the run:

```
corpus threshold x100  -> corpus  0 + family 11 - both  0 = 11   (11 additions listed)
family threshold x100  -> corpus 10 + family  0 - both  0 = 10   (0 additions)
family threshold x1.5  -> corpus 10 + family 27 - both 10 = 27   (17 additions)
```

Unmodified it reads `corpus 10 + family 11 − both 6 = **15**`, which reproduces
the figure five sweeps published and the hand derivation
(10 + 11 − 6). A line echoing the corpus count would read 10, 10, 10; one
echoing the family count would read 11, 0, 27; a constant would read 15 three
times. None of those is the output. The probes were deleted before the commit.

1. [x] **336.2 — DONE, decided: print the union.** `report-prose.mjs` prints the
       flagged union with its inclusion-exclusion arithmetic (`corpus + family −
       both = union`) and the family-only additions, and the corpus headline
       names itself as half the lane's population. The base rate is re-measured
       at this revision as **1 of 7 / 0 of the last 5** and is recorded as
       arguing AGAINST the change; the ground taken is the lane's two-clause
       contract. The reasoning is in the script's own comment beside the code,
       not only here.

       **Reopen condition:** a sweep that asserts lane-3 cleanliness over a
       population smaller than the printed union. That would mean the line is
       being skipped rather than the arithmetic being hard, and the answer then
       is not a fourth line.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed by this slice**, and that is structural
rather than a judgement: `git diff --stat` was read, and the diff is one
`apps/docs/scripts/*.mjs` report that is not a gate and not in `ci.yml`, plus
`ROADMAP.md` prose. No CSS rule, no `.astro` file, no docs page, no generated
artefact and no shipped JS is touched, so no rendered surface can have moved.
`grep -n 'report-prose' .github/workflows/*.yml` returns **nothing** — it is a
run-by-hand report, so not even a gate's output moves.

The visual debts carried forward are unchanged and unspent, counted from the
previous hand-off's own enumeration rather than carried as a number: Slice 352's
two, Slice 345's two, and the four older — `292.4/292.5`, Slice 319, `320.3`,
`310.1` — **eight**.

## Slice 365 — `334.1` decided: **retag**, and the premise it was filed on is false — the marker is only the THIRD text leg, and an identical unreachable branch passes or fails this gate on **one line of prose** (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 364 — Objective grill of Slices 360, 361, 362, 363: **73 of 78** published assertions reproduce, every headline figure and every verdict among them — and all **five** defects are again in a sentence that CHARACTERISES or CITES a measurement rather than in the measurement, which is **two consecutive grills, seven slices** (2026-09-09)

**Dispatched by rule 3** at `Objective 4 / 3 slices OVERDUE [331, 332, 333, 341]`.
Rule 1 found no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across **27** open items) and rule 2 read `Standardize 0 / 4 ok`, spent by Slice
363 — exactly as that slice's hand-off predicted, re-read this wake rather than
trusted. Cloud wake. **No collision:** `origin/main` read `4cfb8b2c` at Step 0
and `4cfb8b2c` again at the mandated pre-commit fetch.

**Step 1 — both intakes read, with `ENVIRONMENT.md` §8's controls:**
`/issues?state=open` → HTTP 200 len **1**; `/discussions` → HTTP 200 len **0**;
`/not-a-real-route` → **404**, the control that makes the `200 []` mean *served
and empty*. Issue #2's `updated_at` is still `2026-09-06T15:10:34Z` — a
**thirtieth** consecutive hand-off with no movement. Nothing to triage, so Step
1 committed nothing.

Full evidence, one table row per assertion:
`.roundtable/grill-objective-360-361-362-363-2026-09-09.md`.

### The arming set names ITEMS; the slices are 360-363 — and the narrowing needed a reading, not an assumption

`dispatch_status.py`'s `SLICE_TOP` reads the leading id of each log row, and the
four rows since the last `Objective` row lead with `331.1`, `332.1`, `333.1` and
`341.1`. `grill-objective-315-332-333-2026-09-07.md` covers *Slices* 332 and
333, which are **different objects** from items `332.1` and `333.1` — so the
apparent overlap is not one. Checked rather than waved off: **no earlier grill
covers Slices 360-363**, and nothing was dropped from scope.

### The pattern, stated as a base rate rather than rediscovered

Slice 359 recorded that all four of its defects were in a sentence
characterising a measurement, and called that "192.1's shape three slices
running". This grill's **five** defects are every one of them a
characterisation, a citation, or a denominator — never a measurement that was
taken wrong. **Said no more strongly than the two grills support: two
consecutive grills, seven slices (356-358 and 360-363).** The obvious next
claim — that the run extends back through the grills of 351 and 355 — was
*not* measured, and Slice 355's own row names a defect that is not this shape
(reading a series at the pre-commit tip is a measurement taken at the wrong
revision, not a sentence about one). **Nothing is proposed for it.** *"This sentence characterises its own measurement correctly"* is
semantic, which is `94.11`'s wall, and Slice 359 already refused exactly that
gate; restating the refusal as a fifth loop-mechanics item is what `355.3` and
`359.4` refuse.

### The five defects

- **A — Slice 362's ts-code tally is over all 50 diagnostics, not the 23
  errors.** It stood one line under `Result (164 files): 23 errors, 0 warnings,
  27 hints` and beside `ts(2307) 0` — which *is* an error-population statement —
  and sums to **49**. Its two largest entries, `ts(7044)` 16 and `ts(6387)` 7,
  are **hints**, so 23 of the 49 tallied are not part of the 22 `362.1` has to
  clear. The errors alone are `ts(2339) 20 · ts(2322) 1 · ts(6133) 1 ·
  ts(2551) 1 = 23`, which is what the slice's own prose already claims
  ("every one is DOM narrowing inside an inline `<script>`"). Corrected in
  place, both tallies labelled.
- **B — `362.1`'s enabling tsconfig omits the `include`, which is
  load-bearing.** `astro/tsconfigs/base` sets
  `"include": ["${configDir}/.astro/types.d.ts", "${configDir}/**/*"]`, so the
  config the item prescribes verbatim yields **377 files / 69 hints** where the
  slice published **164 / 27** — 2.3x the program. The **error count is
  unchanged** (22 post-deletion, 23 with the import restored, with the exact
  published code tally), so the *decision* stands untouched; what does not
  survive is the reproducibility of the baseline Accept (b) asks a later wake to
  attribute a delta against. Also: `resolveJsonModule` is **already true** in
  that base, so naming it as an addition misdescribes the extension. `362.1`
  amended to name the property.
- **C — Slice 361's "40 commits" is 67, and it reached the durable file.** The
  claim is *"`^5.1.0` across all 40 commits touching `apps/docs/package.json`"*.
  Every instrument tried returns **67** — plain, `--first-parent`, `--follow`,
  `--no-merges`, and a count of distinct blobs — at Slice 361's own commit
  `13545b20` as well as at HEAD, so it is not a drifted snapshot. **The property
  is intact and stronger for it**: `^5.1.0` is the only value across all 67, so
  the floating-minor argument is unaffected. It matters because the number was
  copied into **`ENVIRONMENT.md` §3**, the durable file that audit existed to
  fix — the one figure the audit got wrong is the one it made permanent.
  Corrected in `ENVIRONMENT.md` (as the command, per CLAUDE.md's criterion
  rule), in Slice 361, and in the landed `measure-332.1-…` report.
- **D — `check-layout.mjs:112` is not where `serveDist`'s return shape is.**
  The shape `{ server, port, base }` is right; line 112 is inside
  `async function sweep`, at that slice's commit and at HEAD. The destructure is
  line **26** and the return is `serve-dist.mjs:44`. Re-cited by symbol — a line
  number into a live script is the weakest citation there is, which is why
  `RESUME.md`'s charter already forbids `ROADMAP.md:NN`.
- **E — Slice 363's one novel instrument is recorded nowhere.** Its
  *"13 sentences at `HEAD` and 11 in this tree"* detector exists only as a prose
  description, in `ROADMAP.md` and `RESUME.md` in the same words. A
  reconstruction written to that description reads **11 → 10**; that is a
  *different* regex, so it refutes nothing — it establishes that nothing can
  tell the two apart, which is the finding. **The structural contrast is the
  point:** 360, 361 and 362 each landed a `.roundtable/measure-*.md` carrying
  its instruments verbatim (Slice 360 calls that "`321.1`'s lesson"), and this
  grill *executed* two of them unchanged — the `331.1` prototype and the
  `333.1` base-rate probe both reproduced to the digit. Slice 363 landed none.
  Marked UNCHECKED in place. **No item filed and no gate proposed**: *"this
  measurement is novel enough to need its instrument landed"* is a judgement,
  which is `94.11` again.

### What survives, which is nearly all of it

Every verdict of the four slices reproduces on its own evidence: `331.1`'s
refusal (26 of 26 rows, including all six controls and the 0-HTML-start-tags
zero), Slice 361's *17 live / 1 dead* with the bare-`astro build` sentinel proof
re-run from scratch (**224** files against a full build's **529**, 0 pagefind, no
`llms.txt`, both sentinels removed), `333.1`'s choice of `tsconfig` over a gate
(the probe's 8 self-tests all discriminate; **600 / 518 / 1,118** and the single
`eventsManifest` hit reproduce by restoring the import and re-running, then
**0 of 1,117** after), and `341.1`'s closure — whose 115 + 79 = 194 split was
**re-derived from `7e2c61c0` alone**, without reading the item's prose, and
closes exactly.

### This wake's own first output was wrong, and the run caught it, not review

The first `scan:dead-style` reported **10 dead on 8 pages, 1,121 / 1,453 / 249**
— a clean disagreement with Slice 363 on all five numbers, which would have been
the biggest finding here. It is contamination: the scan was running in the
background when this wake moved `apps/docs/dist` aside for the `astro check`
reproduction. Re-run with nothing else touching `dist`: **11 / 9 / 1,365 /
1,813 / 345**, matching Slice 363 item for item including the seven dead kinds.
The failure worth carrying is that the wrong reading was **plausible** — every
number moved the same direction by roughly the same fraction, which reads like a
real tree change. **A background measurement is a statement about the tree
across its whole run, not at the moment it was launched**, which is
`ENVIRONMENT.md`'s *"a gate you ran is a statement about the tree at the moment
it ran"* one process at a time instead of one commit.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **This slice owes none**: its diff is `ROADMAP.md`,
`.roundtable/**` and nothing else — no CSS rule, no docs page, no script and no
`.astro` file changed, read off `git diff --stat` rather than assumed. The
**eight** older visual debts carried in the hand-off are unchanged and unspent.

1. [x] **364.1 — Objective grill of Slices 360-363 complete.** 73 of 78
       published assertions reproduce, counted one per row of the report's
       table. All five defects are a characterisation, a citation or a
       denominator, not a measurement — the **second consecutive** grill to find
       only that shape (Slice 359 was the first), which is seven slices, and no
       stronger claim than the two grills support. Four corrected in place (A, B, C, D) and one marked UNCHECKED
       in place (E); `362.1`'s enabling steps amended to name the `include`
       property. **Nothing new filed and no gate proposed**, deliberately: every
       one of the five would need a gate over what a sentence MEANS, which is
       `94.11`'s wall and Slice 359's standing refusal.

## Slice 363 — Standardize sweep, 4 of 4 lanes. Lanes 1-3 carry no delta (and lane 2's "no delta" is **unchanged by construction** — the window never touched the path it reads). Lane 4's finding is `341.1`, closed on ONE of its two halves: the **79-word** aggregate a new collision falsifies is gone by shape, the **115-word** entry is refused, and Step 0c is **+4 words**, which is not a cut and is said so (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 362 — `333.1` decided: **`tsconfig`, not a gate** — and the base rate the item pinned as "0 of 152" is 0 of 600 *consts* but **1 of 1,118 frontmatter bindings**, a dead import live for **22 days** (2026-09-08)

**Dispatched by rule 4.** Rule 1: no open P0 —
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across **28** open items.
Rule 2 read `Standardize 3 / 4 ok`, rule 3 `Objective 2 / 3 ok [331, 332]`, so
neither matched. Rule 4's oldest open item is Slice 15 and everything from
there to `333.1` is blocked, by kind: **15** owner (AT runtime evidence on owner
hardware), **112.3/112.4** owner briefs, **249.7/.10/.11/.12/.13** owner,
**273.2** OWNER CALL, **296.3** OWNER CALL, **320.3** browser-blocked in the
*screenshot* sense. `333.1` is the oldest cloud-takeable item, and it needs no
browser: every reading below is a command's output.

Rule 5 was read at Step 0b and would not have fired — `Optimize 0 wake-date(s)
newer ok`, 8 of 47 names paired across days.

**Step 1 — both intakes read, with §8's controls.** `/issues?state=open` → HTTP
**200**, len **1** (#2, `updated_at` **2026-09-06T15:10:34Z**, unmoved for a
twenty-eighth consecutive hand-off); `/discussions` → HTTP **200**, len **0**;
`/not-a-real-route` → HTTP **404**, so the `200 []` means *served and empty*.
No new input, so Step 1 committed nothing.

### The premise was re-checked before it was used, and it holds exactly

`333.1` says a first pass got the tsconfig situation wrong, so re-checking it is
part of the criterion (CLAUDE.md). Every clause reproduces at this revision:

```
git ls-files '*tsconfig*'        -> packages/core/tsconfig.json, tsconfig.base.json
tsconfig.base.json               -> "strict": true, and NO noUnusedLocals
packages/core/tsconfig.json      -> "include": ["src/js/**/*.ts"]
ls apps/docs/tsconfig.json       -> No such file or directory
grep -rn 'astro check\|@astrojs/check' --include=package.json --include='*.yml'
                                 -> no hit anywhere
```

One clause to add rather than correct: **`typescript` IS installed** (5.9.3),
but only because `packages/core` declares it (`^5.6.3`) for stylelint; nothing
in `apps/docs` reaches it. So the item's "no TypeScript configuration in this
repo has ever looked at a docs `.astro` file" is right, and the compiler is
already on disk — which is not the expensive part, as below.

### The base rate, re-measured at this revision — and the population was wrong

The scan is `scan-unused-const.mjs` (probe, not shipped): frontmatter split at
the leading `---` pair, parsed with the TypeScript parser, every top-level
`const` **and `import`** binding collected, then counted against AST references
in the frontmatter plus word-boundary matches in the **comment-stripped**
template. Comments are stripped on purpose — a binding whose only other
occurrence is the comment explaining it is unused, and counting that mention as
a use is CLAUDE.md's *"an assertion tripped on its own explanation"* pointing
the other way.

```
152 tracked .astro file(s)
frontmatter bindings: const 600, import 518, total 1,118
never-used const  : 0 of 600      ← the item's figure, confirmed
never-used import : 1 of 518      ← the item's figure did not cover this
```

**The single hit is live and old.** `apps/docs/src/pages/concepts/js-behaviors.astro:5`
— `import eventsManifest from '@busy-office/ui/events';`, whose identifier
occurs **once** in the whole file, its own import. History pins it exactly:

```
git log -S'eventsManifest' -- apps/docs/src/pages/concepts/js-behaviors.astro
  9bb801ea  2026-08-15  Slice 14 item 2   -> 2 occurrences (import + a use)
  bb4ece7c  2026-08-17  Slice 23 item 6   -> 1 occurrence  (the use left; the import stayed)
```

**22 days dead**, against the *"roughly a month to notice"* the item cites for
the const case. So the answer to *"has the base rate moved off zero"* is: **not
for the predicate as written, and yes for the predicate one AST node kind
wider** — and the wider one is the same exact property, an identifier occurring
only at its own declaration.

### The detector was red-proved twice before either number was used

- **Eight self-test cases, all discriminating**, including the three that would
  otherwise make it a detector that cannot fail: a binding named **only inside
  an HTML comment** must still be flagged; an import used only as a **component
  tag** (`<Gallery … />`) must not be; one half of a destructured `const` unused
  must flag that half alone.
- **Injection into a real page.** `const savingMarkup = …` inserted after a
  needle asserted to occur exactly once, into `apps/docs/src/pages/base/motion.astro`.
  The injection was confirmed **structurally** rather than assumed: it lands at
  **line 7**, and the frontmatter runs lines **1-66**, so it is not in a
  comment; the binding count moved **600 → 601**; the scan reported exactly one
  hit. Reverted, and the blob sha is back to `526f9b24`.

  That page was chosen because `motion.astro` names `savingMarkup` in **three
  prose comments** — the exact trap this repo has hit before. The scan flagged
  it anyway, which is what the comment-stripping is for.

### The `tsconfig` spike — and its first output was wrong in the expensive direction

`@astrojs/check` was installed `--no-save` and an `apps/docs/tsconfig.json`
written with `noUnusedLocals`. **The first run reported 101 errors, 76 of them
`ts(2307)` "Cannot find module `@busy-office/ui/api` or its corresponding type
declarations".** That reads as *the shipped package has no types for its
subpath exports* — an adopter-facing product claim, and the most quotable thing
this wake found.

**It is wrong.** `packages/core/dist` did not exist: the workspace dependency
had not been built in this container. After `npm run build -w @busy-office/ui`,
with `resolveJsonModule` added (the JSON subpaths need it), the same command
reports:

```
npx astro check   ->  Result (164 files): 23 errors, 0 warnings, 27 hints   [17s]
  ts(2307)  0     ← all 76 were the unbuilt dist
  ALL 50 diagnostics (errors AND hints), sums to 49:
    ts(2339) 20 · ts(7044) 16 · ts(6387) 7 · ts(6133) 2 · 7043/6385/2551/2322 1 each
    (the 50th carries no ts code: astro(4000) on src/pages/components/button.astro:107)
  the 23 ERRORS alone:
    ts(2339) 20 · ts(2322) 1 · ts(6133) 1 · ts(2551) 1
```

**CORRECTED by Slice 364.** The tally originally stood as one line directly
under the `23 errors` result and beside `ts(2307) 0` — which *is* an
error-population statement — so it read as the decomposition of the 23, and it
sums to **49**. Its two largest entries, `ts(7044)` 16 and `ts(6387)` 7, are
**hints, not errors**, so a wake sizing `362.1` off that line budgets 23
diagnostics it never has to clear. The slice's prose below is right where the
tally was not: *"every one is DOM narrowing inside an inline `<script>`"* is
exactly what the errors-only row shows.

Caught by asking what would make the number wrong before quoting it, not
afterwards. Named here because the claim was one sentence from the hand-off.

**What it catches that the scan does not**, on the built tree:

```
ts(6133) src/pages/concepts/js-behaviors.astro:5   'eventsManifest' … never read   ← same hit
ts(6133) src/pages/patterns/comparison.astro:134   'i' … never read                ← template arrow param
```

Two independent instruments agreeing on `eventsManifest` is the reconciliation
this repo asks for before a number is quoted. The second hit is outside the
scan's population entirely.

### The decision: `tsconfig`. The gate is REFUSED, and here is what each costs

**`tsconfig` — chosen.** It is the ordinary tool, it is strictly wider (unused
`let`, `function`, imports, template params, and 22 further type errors the
scan cannot express), and the repo's own Objective prefers one general
mechanism to a specific one. **What it costs, measured rather than forecast:**
two devDependencies (`@astrojs/check` → `@astrojs/language-server`), a
`tsconfig.json` that needs `resolveJsonModule` on top of `astro/tsconfigs/base`,
**17s** of wall clock over 164 files, and **23 errors to clear before it can
gate anything**. Of those 23, one is the import this slice deletes; the other
**22 sit in 7 files** — `value-help` 9, `Gallery` 6, `htmx` 3, and one each in
`ScheduleScreen`, `palettes`, `cascade`, `detail-form` — and every one is DOM
narrowing inside an inline `<script>` (`Property 'value' does not exist on type
'HTMLElement'`). That is **editing copyable sample code readers copy**, which is
why it is a slice of its own and not a line in this one. Filed as `362.1`.

**The gate — refused.** It would be exact rather than semantic, so 94.11's wall
does not apply, and 310.1's precedent (a gate earning a clean base rate because
the population held a violation a day earlier) fits this population better than
it fitted that one — the violation is not a day old, it is in this commit. The
refusal is not about whether it would work. It is that it duplicates a **subset**
of a compiler flag whose remaining cost is now measured at 22 errors in 7 files
rather than unknown, and it is not free: a 54th gate moves the two counts
`derive-readme-facts.mjs` stamps onto the **npm front page** and forces a README
re-stamp that `stamp-readme.mjs --check` gates inside the core build. Paying
that to catch a proper subset of what the chosen tool catches is the wrong
trade.

**"Neither" — refused**, and the reason is the 22 days.

### What these numbers do NOT cover

The scan reads **top-level `const` and `import` bindings in `.astro`
frontmatter** and nothing else: not `let`, `function` or `class`, not template
scope, not inline `<script>` locals, and not `.mjs`/`.ts` anywhere in the repo.
`astro check`'s two `ts(6133)` hits against the scan's one is that gap being
visible, not the two instruments disagreeing.

### Landed in this slice: the dead import is deleted, and the removal is proved render-neutral

```
before:  md5 a8e5762c946cf70dde4187b4698bd8e1   89,440 bytes   529 files in dist
after :  md5 a8e5762c946cf70dde4187b4698bd8e1   89,440 bytes   529 files in dist
```

Both from a full `rm -rf apps/docs/dist && npm run docs:build` (never a bare
`astro build` — `ENVIRONMENT.md` §3). Byte-identical is a suspiciously tidy
result, so the comparison was **red-proved**: the same `cmp` against a
*different* built page reports a difference, so the instrument discriminates.
The scan re-run after the deletion reads **0 of 1,117**.

### A correction owed to an open item: `334.1`'s pinned gate counts are stale

`334.1` and `check-selftests.mjs`'s own header both say *"`scanGates()` reports
**54 / 20 / 34** today, so counting this file as a heuristic gate makes it
**55 / 21 / 34**"*. The live reading is now **55 / 21 / 34** — this build's own
`self-test check passed — 55 gates classified: 21 heuristic (all self-tested;
172 cases actually run), 34 exact`. `packages/core/scripts/check-print-tokens.mjs`
is the only gate added since (`git diff --name-status ac4a9a0f..HEAD`).

So the *forecast* value now equals the *current* value, and a wake reading
`334.1` could reasonably conclude the retag has already happened. That is
CLAUDE.md's criterion rule with a live cost: **the item embedded a prediction
where it should have named a property.** Both are re-expressed below and in the
gate header; no value is pinned any more.

1. [ ] **362.1 — adopt `astro check` with `noUnusedLocals` for `apps/docs`.**
       `333.1`'s decision, filed rather than taken because the residual is 22
       type errors in 7 files, all of them DOM narrowing inside inline
       `<script>` blocks that readers copy — changing those changes published
       sample code, which is a judgement about what the samples should teach,
       not a lint fix. The enabling parts are mechanical: `@astrojs/check` as a
       devDependency, an `apps/docs/tsconfig.json` extending
       `astro/tsconfigs/base` with `noUnusedLocals` **and** `resolveJsonModule`,
       and the command wired where the other docs gates run. **The dependency
       on a BUILT `packages/core/dist` is load-bearing** — without it the same
       command reports 76 phantom `ts(2307)`s, which this slice mistook for a
       product defect for one round.
       **AMENDED by Slice 364 — the `include` is load-bearing too, and this
       item did not name it.** `astro/tsconfigs/base` sets
       `"include": ["${configDir}/.astro/types.d.ts", "${configDir}/**/*"]`, so
       extending it with nothing else makes the program the whole of
       `apps/docs`: measured this wake, **377 files / 69 hints** against the
       **164 / 27** recorded above, with the error count unchanged. Two of the
       four published figures therefore do not reproduce from the config as
       written here. `resolveJsonModule` is **already true** in that base, so
       naming it as an addition misdescribes what is being extended. Stated as
       a property rather than a config string, per CLAUDE.md's criterion rule:
       **the committed tsconfig's `include` decides the program, so the
       tsconfig and the file count it produces are recorded together**, and any
       before/after error count (Accept (b)) is quoted with the file count of
       the run that produced it.
       - **Accept** — properties, not the values above, all of which are
         snapshots to re-measure: (a) `npx astro check` exits **0** on a tree
         where `packages/core` has been built, with the committed tsconfig;
         (b) the error count before the change and after are both recorded,
         from that same built state, so the delta is attributable; (c) each
         inline-`<script>` narrowing is either a real improvement to what the
         sample teaches, or is recorded as suppressed **with the reason** —
         deciding that some of them should be suppressed rather than "fixed" is
         a satisfying outcome; (d) the gate is verified in the narrowest
         context that must run it, not only in CI (`LOOPS.md`'s own rule), and
         if it cannot run somewhere it fails loudly there.
       - **Refusing is a satisfying outcome** if the 22 turn out to be
         load-bearing sample code whose narrowing would teach the wrong thing —
         say so with the count that survived.
       - **Lane:** cloud-takeable. Node, config and prose; no browser, no
         screenshot.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **This slice owes none**: the only rendering change is the
deletion of an import that reached the HTML zero times, and the built page is
byte-identical before and after, which is a stronger statement than a
screenshot comparison would be. The eight older visual debts carried in the
hand-off are unchanged and unspent.

## Slice 361 — `332.1` closed by auditing all 18 `ENVIRONMENT.md` sections against this container: **17 live** (four of them BIT this wake), **1 dead** — and the dead one's territory holds a live hazard pointing the opposite way (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 360 — `331.1` REFUSED on the base rate its own Accept demanded first: `api.json` contains **0** HTML start tags, so the half a prompt block exists for — **378 of 749** lines — has no source in the mandated provenance, and the fallback source carries only **61 of 263** substantive markup lines (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 359 — Objective grill of Slices 356, 357, 358: **60 of 64** published assertions reproduce, every red-proved headline figure to the digit — and all four defects are in a sentence that CHARACTERISES a measurement rather than in the measurement, which is 192.1's shape three slices running (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 358 — `330.1` closed by the census it asked for: the named failure mode has **one** live instance, not two (the second left `ROADMAP.md` when Slice 301 was archived), and **0 of 31** open items rest on an undisclosed sample (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 357 — Standardize sweep, 4 of 4 lanes, all clean — and the finding is that `350.1`'s "does this window have lane input" predicate is **not per-lane**: lanes 1 and 3 read the docs tree, lane 2 reads only the core stylesheets, so ORing the two inputs credits lane 2 with **41.7%** of windows it is structurally blind to (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE`, exactly
as the previous hand-off's ⚠ block predicted — re-read this wake rather than
trusted. Cloud wake. Rule 1 found no P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across 31 open items).
Rule 3 read `Objective 1 / 3 ok [356]` and sits **below** rule 2 anyway. Rules
4-8 not reached. Rule 5's line read `ok` — **0** wake-dates newer than the
newest pair, 8 of 47 names paired across days, and no name in the comparable
set regresses on two consecutive runs.

Step 0: container **DETACHED** again (`git branch --show-current` empty), trap
1, fixed with `git checkout -B main origin/main` before any commit. Trap 2 clean
in one `--unshallow` — **2,081** commits, no `shallow.lock`, and it again
brought the tags (`git tag | wc -l` → **8**, run rather than assumed). Unlike
the last several wakes `origin/main` arrived **not** as a forced update:
`d876765..30d94cc`, a fast-forward onto the previous wake's own tip.

**Step 1 — both intakes read, with the controls `ENVIRONMENT.md` §8 names:**
`/issues?state=open` → HTTP 200 len **1**; `/discussions` → HTTP 200 len **0**;
`/not-a-real-route` → **404**, the control that makes the `200 []` mean *served
and empty*. Issue #2's `updated_at` is still `2026-09-06T15:10:34Z` — a
**twenty-third** consecutive hand-off with no movement. Nothing new to triage,
so Step 1 committed nothing.

**The archive sweep was evaluated and declined, and the number is now the
argument for taking it.** `roadmap_scope.py` at `30d94cc7` reports
**5,307 / 11,564 = 45.9%**, 27 eligible targets, 13 named by a still-open item
(236.2's report, read before concluding). That equals the previous hand-off's
reading taken one commit earlier at `78e96150`, which is **expected rather than
informative**: `30d94cc7` is that wake's recording commit and does not touch
`ROADMAP.md`, so the four-wake rise (41.1 → 43.9 → 44.5 → 45.9) has had no
opportunity to continue — it has not paused, it has not been sampled again. The
revision is named because **this commit moves it, UPWARD**, and the first draft
of this paragraph forecast the opposite: it said *"every line of this slice
lands under an open heading, so the closed share falls."* Slice 357 closes its
only item in the same commit, so it is a **closed** slice and all 238 of its
lines land as closed history — `919d55d5` reads **5,525 / 11,802 = 46.8%**, up
0.9pp. Recorded rather than quietly fixed, because it is CLAUDE.md's criterion
rule biting inside a sweep: the prediction was checkable and wrong, and only
re-running the script caught it. Re-run
`python3 scripts/loops/roadmap_scope.py` at the commit rather than quoting this.
It remains **4.4pp above `324.3`'s thirteenth sweep at 41.5%** and above
every declined reading on record. Declined here for **scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this
wake's finding is a measurement with two red-proofs. `249.12`, the open
**OWNER OR ARCHITECTURE CALL** on the archival trigger, is named for a
**seventeenth** consecutive wake.

### The four lanes — every reading measured this wake, none cited

- **Lane 1 of 4 — `scan:dead-style`: on the refusal set, page for page, a
  second time.** **0** dead attributes on **0** pages; **1,365** live
  attributes, **1,813** declarations, **345** multi-declaration. Per
  declaration: **11 dead on 9 pages** — `/patterns/` ×3, `amount` / `byline` /
  `progress` (`inline-size: 100%`), `combobox` (`margin-block-start`),
  `state-patterns` (`align-items`), `/base/motion/` (`display: inline-block`),
  `/patterns/app-launch/` (`block-size: 2rem`), `/reference/tokens/`
  (`inline-size:var(--bo-space-0)`). Byte-identical to Slice 350's reading,
  **and this time that means something**: this window DID change lane 1's input
  (two `apps/docs/src/` pages), so the reading is unchanged on inputs that
  moved, not unchanged by construction. Every one is refused with its
  measurement in Slice 345; `345.1` stays open and untouched.
- **Lane 2 of 4 — `report:css-repeats`: no delta, and the delta could not have
  existed.** **74** source files · **242** rules with 3+ declarations · **230**
  distinct bodies · **8** bodies repeating — byte-identical to Slice 345's and
  Slice 350's `74 / 242 / 230 / 8`. Checked against `LOOPS.md`'s settled table
  **member for member**, not by the count. **This is the finding below**: lane
  2's only input is `packages/core/src/css/`, last touched by `e4742fd4`
  (2026-09-07, Slice 338) — **47** first-parent commits ago. That single commit
  predates all three of the sweeps reading `74 / 242 / 230 / 8` (345, 350, 357),
  so this third consecutive identical tuple was never available to be anything
  else. (Slice 350's *"sixth consecutive identical reading"* is the run of
  **8 repeating bodies**, a longer and different series — 345's own text records
  the tuple moving `237 / 225 / 8` → `242 / 230 / 8` at that sweep.)
- **Lane 3 of 4 — `report:prose`: every flagged page carries a verdict, and it
  is the one lane that MOVED.** 119 documentation pages of 128 built · median
  **798** · mean **959** · total **114,124** words, against Slice 350's
  `798 / 956 / 113,787` — **+337 words**, from the two `apps/docs/src/` pages
  this window touched (`data-table.astro`, `scale.astro`, both Slice 352's
  withdrawal). The flagged union is **15** pages: the 10 over the corpus 2x
  (1,596) plus `/base/motion/`, `/concepts/layouts/`, `/concepts/js-behaviors/`,
  `/concepts/design-language/` and `/concepts/scale/` over a family 2x. Checked
  against the ENUMERATION the lane mandates — **158.1's twelve**
  (`data-table`, `richtext`, `which-pattern`, `form`, `editable-grid`,
  `list-report`, `calendar`, `money`, `combobox`, `tabs`, `layouts`,
  `output-form`), **161.1's three**, **178.3's `/concepts/scale/`** — all 15 are
  members, and `/patterns/output-form/` is again the one non-flagged member.
  **No page carries no verdict**, so nothing to record.
- **Lane 4 of 4 — `report_loop_prose.py`: no file changed accumulate class, the
  region is FLAT, and its RATIO fell without the region losing one word.** The
  dispatch region reads **7,548** words at **41.8%** of the file. Slice 350
  published **7,548 at 42.0%**, and the ratio moved on the **denominator**:
  `1310b81a` (Slice 353) is the one commit in this window touching `LOOPS.md`,
  and it took the file **17,980 → 18,046 (+66)** while leaving the region at
  **7,548 exactly** — every word of it landed below `## Playbooks`, which is
  where 353.1 replaced the hand-rolled recipe. Measured with
  `git show <rev>:LOOPS.md` split on `## Playbooks` at both revisions, rather
  than inferred from "the file looks unchanged": it is not unchanged, and the
  *reading a wake acts on* is the one that is. This is the playbook's own
  warning about reading the ratio arriving as a live case — a falling
  percentage here is the file growing elsewhere, not the region shrinking. The
  per-section attribution 353.1 added now prints
  itself, and it **reproduces `341.1`'s series exactly** — `### Step 0c` at
  **1,516** body words, **+194** since the last commit that reduced the region
  (`f9e0f17d`), **1 of 16** sections moved, and the block's own assertion
  `body 7,492 + 56 heading = 7,548` holds. That is two independently written
  instruments agreeing: `341.1`'s figure was a hand-run per-revision series, the
  block's is generated. **`341.1` is open and owns that question**; nothing is
  proposed here.

### The finding: `350.1`'s predicate is one predicate for three lanes that do not share an input set

`350.1` asks whether rule 2's counter should know if lanes 1-3 have anything to
read, and its base-rate command classifies a window by
`packages/core/src/css/ OR apps/docs/src/`. **That is right for lanes 1 and 3
and wrong for lane 2**, and this wake is the demonstration rather than a
prediction: the window changed `apps/docs/src/` and not
`packages/core/src/css/`, so the OR calls it *has lane input* — while lane 2
could not have moved by a single number.

**Which lane reads which tree is read off the code, not the header prose.**
`report-css-repeats.mjs` imports `srcCssFiles, srcCssRoot as CSS` from
`src-css-files.mjs`, whose `srcCssRoot` resolves to `packages/core/src/css`;
`report-prose.mjs` and `scan-dead-style.mjs` both import `distPages(DIST)` and
read built pages, whose text and computed values depend on **both** trees (the
generated half of a docs page derives from the core CSS — `/concepts/which-pattern/`
is 310 authored + 2,015 generated).

**Red-proved by injection, with both controls, and the injections checked
before the results were believed** (CLAUDE.md: a green red-proof is a defect in
the injection until proven otherwise). The *same* three-declaration body —
`list-style: none; margin: 0; padding: 0`, the x3 group already in the report —
was injected once into each tree, each time asserted to be present exactly once
in the file and outside any comment, and reverted with the count re-asserted at
zero:

| injected into | rules | repeats | that group |
|---|---|---|---|
| (baseline) | 242 | 8 | x3 |
| `packages/core/src/css/components/badge/badge.css` | **243** | 8 | **x4**, listing the probe selector |
| `apps/docs/src/pages/components/badge.astro` | 242 | 8 | x3 — **unmoved** |
| (after both reverts) | 242 | 8 | x3 |

The positive control moves the number and the negative control does not, on the
identical declaration list — so the discrimination is the TREE, not the content.

**The base rate, re-measured at execution time as `350.1`'s Accept requires**,
by 350.1's own command at `30d94cc7`, extended to bucket the two trees
separately instead of ORing them. 157 Standardize rows resolve to **140**
distinct first-parent commits → 139 windows, windowed `a..b^` per `351.1`'s
correction:

```
python3 - <<'PY'
import re, subprocess
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
order = sh('git','rev-list','--first-parent','HEAD').split()
pos = {c: i for i, c in enumerate(order)}
full = {c[:n]: c for c in order for n in (7,8,9,10,40)}
std, seen = [], set()
for line in open('.roundtable/loop-log.md'):
    if line.startswith('- ') and ' · Standardize · ' in line:
        m = re.search(r' · ([0-9a-f]{7,40})\s*$', line.rstrip())
        if m and full.get(m.group(1)) and full[m.group(1)] not in seen:
            seen.add(full[m.group(1)]); std.append(full[m.group(1)])
std.sort(key=lambda c: -pos[c])
CORE, DOCS = 'packages/core/src/css/', 'apps/docs/src/'
cnt = {'neither':0,'core_only':0,'docs_only':0,'both':0}; span = 0
for a,b in zip(std, std[1:]):
    commits = sh('git','rev-list','--first-parent',f'{a}..{b}^').split(); span += len(commits)
    files = {f for c in commits for f in sh('git','show','--name-only','--format=',c).split('\n') if f}
    hc = any(f.startswith(CORE) for f in files); hd = any(f.startswith(DOCS) for f in files)
    cnt['both' if (hc and hd) else 'core_only' if hc else 'docs_only' if hd else 'neither'] += 1
print(len(std)-1, 'windows, span', span, cnt)
PY
# 2026-09-08 at 30d94cc7: 139 windows, span 1869
#   neither 20 (14.4%) · core_only 7 (5.0%) · docs_only 38 (27.3%) · both 74 (53.2%)
```

- **Lanes 1 and 3 are blind on `neither` = 20 of 139 (14.4%)** — which
  reproduces `351.1`'s amended figure to the window, at a later commit.
- **Lane 2 is blind on `neither + docs_only` = 58 of 139 (41.7%)** — **2.9x** the
  **14.4%** `351.1` amended that rate to, and **4.1x** the **10.1%** `350.1`
  itself records. The gap is entirely the 38 `docs_only` windows the OR hands it.

  > **Amended 2026-09-08 (roadmap 359.2).** This read *"nearly **3x** the rate
  > `350.1` records"* — which is `351.1`'s amended figure carrying `350.1`'s
  > name, one bullet after the line that credits 14.4% to `351.1` correctly. The
  > multiple was right and the attribution was not; against `350.1`'s own
  > published rate the gap is **larger**, so nothing downstream moves.

**Reconciled and discriminated before quoting** (CLAUDE.md). The four buckets
partition — 20 + 7 + 38 + 74 = 139, asserted in the script rather than added by
eye. The predicate is not uniformly true or false: all four buckets are
non-empty and the largest is 53.2%, so this is not the *identical value across
many inputs* tell. And the `a..b` form of the same command still returns
`139 / 15 / 13 / span 2008` with an independent `git rev-list` span of **2008**
— unmoved from what `351.1` published, so **the base rate has not drifted**;
what changed is only that it is now split per lane.

**What this does NOT say**, because the temptation is to over-read it: it is not
a claim that 41.7% of lane-2 passes were wasted. Lane 2 is the cheapest of the
four (a file walk, no browser, against the **123s** Slice 350 measured for lane
1 in this container — cited, not re-timed here), and its
step also re-checks the settled table member-for-member, which is a reading of
the table and not of the tree. The claim is narrower and is about **evidence**:
on those 58 windows *"no delta, a Nth consecutive identical reading"* is not a
statement about the stylesheets.

**Fixed where it is read, and nothing else was built.** `report-css-repeats.mjs`
now closes with the tree it walked, derived from `srcCssRoot` rather than
hand-typed, so the sweep reading the output is told what an unchanged reading
can and cannot mean. **No gate** — *"this window could move this lane"* needs a
diff read to answer (`350.1` measured that itself: a file-level predicate
reported an instrument change on `scan-dead-style.mjs` that turned out to be
comment-only), and roadmap 94.11 forbids gating a semantic property. **No new
instrument, and no fourth lane** — the finding is a sentence of output on an
existing report and an amendment to the open item that owns the decision.

1. [x] **357.1 — DONE 2026-09-08. `350.1`'s Accept gains a third requirement,
       and lane 2's report says what its own silence means.** Two changes, both
       above: the per-lane base rate is recorded as an amendment on `350.1`
       (which stays **open** — the decision is still unmade, and making it is
       rule 4's, not a sweep's), and `report-css-repeats.mjs`'s closing note
       names `packages/core/src/css` as the only tree that can move its numbers.
       - **Verified:** the report's new line renders the path **derived** from
         `srcCssRoot` (`packages/core/src/css`), not typed; both injections
         above land and revert with their counts asserted; all 17 CI-runnable
         entry points green.

## Slice 356 — `328.1` answered and closed as NOT-A-PATTERN: exactly **1** live instrument answers *"does this page show a result"* with a Demo-shaped signal — and measuring it found the surviving instance reporting the population where it means an eighth of it, 24 where the honest number is 3 (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 355 — Objective grill of Slices 353, 354: 103 of 107 published figures reproduce, and both defects are a number that is right at one revision and wrong at the one it ships on — 354's heading count is the body-only convention while its own population column is the whole-text one, and 353's verdict series describes the tip the wake READ (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 354 — `327.3` answered: 192.1 entered this loop's vocabulary as a NAME FOR A DEFECT, not as a step in a write-up — **12 of 21** citations quote its observation half, **1 of 21** its instruction half (and that one a restatement, not an application), and **1 of 161** slices since it landed carries the inventory it prescribes (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 353 — `326.3` answered: the question has no single answer because the region has two KINDS of growth, and the whole-region ratio that raised it cannot tell them apart — 73.5% of the growth since the item was filed is one generator section, and every one of the eight rules is flat (2026-09-08)

**Dispatched by rule 4**, cloud wake, on the oldest still-open item no other
kind of block covers. Every open item older than `326.3` was re-read in the file
rather than carried from the hand-off: Slice 15, `112.3`, `112.4`, `249.7`
(*"still waiting on 249.10"*, itself an OWNER CALL), `249.10`-`249.13`, `273.2`,
`296.3` owner-blocked; `320.3` browser-blocked in the screenshot sense, which
its own Accept says in as many words.

### The premise was re-measured first, and it has moved off the item

`326.3` states the region at **6,759 words**. At `HEAD` it reads **7,548**
(7,492 body + 56 heading words), **+789** since the item was filed at
`e1f5a12f`. The commands are the shipped instrument, so they re-run:

```
python3 scripts/loops/report_loop_prose.py     # the by-region block, and now per section
```

| section | at `e1f5a12f` | at `HEAD` | delta |
|---|---|---|---|
| `### Step 0c — …collisions are ACCEPTED` | 936 | **1,516** | **+580** |
| `### Step 1 — Triage new input` | 671 | 880 | +209 |
| all 14 other sections, the **eight rules included** | — | — | **0** |

**73.5% of the growth is one section and 26.5% is one other; nothing else moved
by a word.** So the item's own framing — *the region grows because the RULES
grew* — described `e1f5a12f`, where 326.2 measured it correctly, and does not
describe `HEAD`. That is not a correction to 326.2; it is the thing 326.3 was
filed to notice, arriving one day later in a different section.

### The answer: two kinds of growth, one number, and the number cannot separate them

- **A rule that changed** — rule 3 gaining 279.4's Polish amendment, rule 5
  gaining the comparable-set and `SKEW` blocks. 326.2 attributed the four
  2026-09-07 risers this way and refused a cut on it. **Accepted**: this is
  instruction, and cutting it removes what a wake executes.
- **A generator section** — 339.1's term: a recurring event, each instance of
  which writes a narrative inline. Step 0c is the worked case, and its series
  is the argument:

  ```
  aa550d2c  1,378   before 274.2's cut
  8848ed55    936   274.2 folds the collision forensics into LOOPS-archive.md
  86f034ce  1,500   collisions 3 and 4 written up in full
  f9e0f17d  1,322   339.1 applies the charter by hand
  299f7063  1,516   collision 5 written up in full   ← 138 ABOVE the pre-cut size
  ```

  Two cuts and a hand-applied charter in four days, and the section is now
  **larger than before either**. The charter's own sentence — *"A new collision
  adds a LINE here and its forensics to `LOOPS-archive.md`"* — sits inside the
  section that was growing while it was being written.

**Neither kind is a defect, and that is the point.** They want opposite answers,
they produce the same rising number, and the block a sweep reads printed only
the number.

### Both structural candidates the item named are REFUSED, each on a measurement

**A per-rule word ceiling — refused on base rate (94.11).** The eight Step-2
rules read **9 / 119 / 975 / 980 / 585 / 631 / 226 / 190** body words at `HEAD`.
A ceiling low enough to constrain the largest fails rules 3 and 4 at once, and
one set anywhere below 585 fails 5 and 6 as well — precisely the four sections
326.2 attributed to *rules that changed*, so it forces the cut 326.2 refused.
A ceiling above 980 binds nothing today, and the first thing to cross it would
be Step 0c at **1,516**, which is not a rule at all. And *"the decision content
is short"* is semantic: a ceiling counts bytes, not what they carry.

**A rules-file / rationale-file split — refused on this repo's only precedent,
measured rather than argued.**

```
git log --diff-filter=A --format='%H %cs' -- .roundtable/ENVIRONMENT.md   # f52f2597 2026-08-28
git show <rev>:.roundtable/RESUME.md | wc -w      # and ENVIRONMENT.md, at each rev
```

| | `RESUME.md` | `ENVIRONMENT.md` | Step-0 total |
|---|---|---|---|
| commit before the split (`c6eeb667`) | 3,150 | — | **3,150** |
| the split itself (`f52f2597`) | 1,683 | 1,666 | **3,349** |
| `HEAD` | 2,728 | 6,582 | **9,310** |

The split cost **+199 words the same day** (a pointer and a charter at both
ends) and the pair is now **2.96x** the pre-split file, the moved half at
**17 up / last cut 2026-08-30**. Step 0 names both files, so a wake reads both:
**the split moved the number and not the read.** That is 274.1's refusal in a
second instance, and 167.2's *"a pointer is read less than a paragraph"* is why
the only version that would reduce the read — telling the dispatcher not to open
the rationale half — is deletion wearing a filename.

### What the whole-region verdict has actually been saying

Over all **73** revisions of `LOOPS.md` since the 2026-08-20 base, the block's
verdict reads `FASTER` on **57** and `SLOWER` on **16** — and the last `SLOWER`
is `69cadcbb`, the revision before the share stepped 33.0% → 38.6% on
2026-08-28. The block landed at `aa550d2c` on 2026-09-05, **56 revisions and 12
Standardize sweeps after that step**, so every reading it has ever produced was
already fixed. It is not a dead detector — the share does move: 34.8% at the
base, 27.3% at its floor, 46.9% at its peak, 42.0% now. But it has not
discriminated once in its own lifetime, and **both times a sweep reached a
correct verdict on the region it came from a per-section reading that overturned
this one** — 308.1 (*"+877 is five new rules, Step 0c holds at 936"*) and 339.1
(*"the per-revision series says that verdict is wrong"*).

**CORRECTED by the Objective grill of 353/354 (Slice 355, 2026-09-08): the
three figures in this section were read at `299f7063`, the wake's Step 0 tip,
not at `1310b81a`, the commit that ships them.** As published they were
**72** revisions, `FASTER` on **56**, and *"42.0% now"*; at `1310b81a` — which
is this slice's own commit **and** the last revision of `LOOPS.md`, adding the
73rd revision and 66 words to the playbooks half — they are **73**, **57** and
**41.8%**. The counts above are corrected; the share is stated here with its
revision rather than as a bare *"now"*. `SLOWER` **16**, the `69cadcbb` anchor,
and the 34.8% / 27.3% / 46.9% readings are unaffected.

This is `ENVIRONMENT.md`'s *"when your own commit changes the file, `HEAD` is
the pre-change state"* bullet in its third consecutive instance, after `273.1`
and `274.1`. **The instrument was not at fault:** `report_loop_prose.py` prints
its revision in its own first line, and the figure was quoted into prose as
*"now"* with the sha dropped. The split table above, by contrast, is read at
`1310b81a` correctly — so this slice is inconsistent about which tip it stands
on rather than uniformly early. `353.2`, which files this same defect about the
metric, is untouched and stays open.

1. [x] **353.1 — the attribution 308.1 mandates is now the instrument's output,
       not a recipe a wake re-derives.** `report_loop_prose.py`'s by-region
       block gains per-section **body-word deltas since the last commit that
       REDUCED the region**, and `last_region_cut()` finds that anchor from the
       tip backwards, so no window can hide or manufacture it. At `HEAD` it
       prints **one line — Step 0c, +194** — where the ratio above it prints
       `FASTER`, as it has on every reading in its lifetime. Lane 4's hand-rolled
       `awk … | split on ^#{2,4}` recipe is replaced by the block that runs it.

       **The reconciliation's first draft could not fail, and the injection is
       what showed it.** It took the heading total as `region − body`, a
       residual that agrees with itself by construction: under an injection that
       drops a section from the split it printed `7,302 + 246 = 7,548` and
       **passed**. `dispatch_heading_words()` now counts the heading lines from
       the text, independently; the same injection then prints
       `7,302 + 56 = 7,358`, names the gap and exits **1**. The injection was
       confirmed to have landed before either result was believed — 16 sections
       became 15, body 7,492 → 7,302.

       **Validated against an independent source as well as by injection**,
       because an instrument's first output is not evidence. 339.1 published a
       Step 0c series derived by a different wake with a different `awk` method:
       **936 / 1,300 / 1,500** at `8848ed55` / `534b097a` / `86f034ce`. This
       parser reproduces **3 of 3 exactly**, and 339.1's five per-section deltas
       reproduce **5 of 5** — Step 0c +564, Step 1 +580, Step 2 +527 (rule 3's
       +303 plus rule 5's +224), Step 0 +151, and the loops table's +52 net,
       which the block reports as an explicit NEW/GONE pair because *eight*
       became *nine* in the heading.

       **Discrimination on real data, not only on fixtures:** over
       `8848ed55 → 632bfc46` the block names **rule 3, +303, and nothing else** —
       a different section on a different input, which is the property a
       per-section report has to have and the whole-region ratio does not.

       **Six new paired self-test cases** (19 total). The load-bearing pair is a
       `N. **` line inside Step 2, which is a section, against the identical
       line inside Step 0c, which is not — Step 0c carries a numbered list of
       collisions, and splitting on it would attribute the section's growth to
       whichever incident was written last. The section-dropping injection turns
       **6 of 6** of them red.

       - *Accept was*: a recorded decision or a recorded refusal with its
         reason, with "cut something" not the default. **Decided**: growth that
         is a rule changing is accepted; growth from a generator is the
         charter's business; and the instrument now says which is which, so the
         question is answered by a reading rather than re-argued every sweep.
         **No cut was made** — 274.2's and 339.1's between them are the evidence
         that a cut without a mechanism buys about fifteen commits.

       **What this does NOT claim.** It does not claim the region is too large,
       or that 7,548 is the right size, or that Step 0c should shrink. It
       measures where the growth is and hands the sweep the two branches; the
       branch that applies to Step 0c is **`341.1`, open** — which measured the
       identical series independently (`### Step 0c` .. `### Step 1` bounds
       rather than generic section bounds, and the same 1,378 / 936 / 1,300 /
       1,500 / 1,322 / 1,516), and found that the charter throttles only one of
       the generator's two outputs. **Nothing here re-decides that**; what
       changes is that the next lane-4 round is handed the section by name
       instead of deriving it.

2. [ ] **353.2 — `dispatch-region-words` is sampled by hand, under a convention
       the instrument does not use, and no sample records the commit it
       describes.** 339.1's own text publishes the pair **7,476 → 7,298** while
       `report_loop_prose.py` prints **7,532 → 7,354** for those two commits —
       the constant 56, which lane 4 already documents so a wake comparing
       readings is not fooled. The part that is not documented is that the
       *metric* is the hand-rolled side: `loop-metrics.jsonl` records only
       `{ts, name, value, unit}`, so the newest sample (**7,492**, 2026-09-08
       00:17) cannot be attributed to a commit without re-deriving it, which is
       exactly ENVIRONMENT.md's *"a figure with no revision beside it is read as
       current"*. Rule 5 reads this name.
       - **Accept** — the property, not a predicted fix: the sample rule 5 reads
         is traceable to the command and the revision that produced it. Either
         this name's value comes from the instrument, **or** a recorded reason it
         should not — measuring that the hand-rolled convention is the one rule 5
         wants, and writing that down, closes it just as well. Finding that the
         two conventions should stay separate is a satisfying outcome, not an
         off-plan one.

## Slice 352 — `325.2` closed by WITHDRAWAL: the *Initial render* column's method is unrecoverable, and the measurement that decides it needs no knowledge of the missing machine — a machine gap is a roughly CONSTANT multiple, and this column's is 4.2x / 11.9x / 7.3x while its own neighbour's is 0.93x / 0.72x / 1.19x (2026-09-08)

**Dispatched by rule 4**, cloud wake, on the oldest still-open item no other
kind of block covers. Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` **empty**, fixed with `git checkout -B main
origin/main` before any commit), and `origin/main` again arrived as a **forced
update** (`26447ba...2caaa16`). `HEAD` equalled `origin/main` at **`2caaa16f`**,
which is the previous wake's own recording commit, so **no other dispatcher had
landed anything between the two wakes**. Trap 2: the clone was shallow and this
item's verdict is a history search, so it was unshallowed before any figure was
taken — **2,070** commits at `HEAD`, no `shallow.lock`, and the unshallow again
brought the tags (`git tag | wc -l` → **8**, run rather than assumed). Step 0b:
`Standardize 0 / 4`, `Objective 0 / 3`, `Optimize 0 wake-date(s) newer` — all
three `ok`, over 1,662 logged iterations. Step 1: both intakes read with
`ENVIRONMENT.md` §8's controls (`/issues?state=open` **200 len 1**,
`/discussions` **200 len 0**, `/not-a-real-route` **404**) — **no new input, so
Step 1 committed nothing**; issue #2's `updated_at` is unmoved at
`2026-09-06T15:10:34Z` for an **eighteenth** consecutive hand-off. Step 2: rule
1 `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across 32 open items,
rule 2 `0 / 4`, rule 3 `0 / 3`, rule 5 `ok` (not `STALE`), so **rule 4** — and
every open item older than `325.2` was re-checked in the file rather than
carried from the hand-off: Slice 15 (AT runtime evidence, owner hardware),
`112.3`, `112.4`, `249.7`, `249.10`-`249.13`, `273.2`, `296.3` all
owner-blocked, and `320.3` browser-blocked **in the screenshot sense** (its own
Accept says so in as many words).

### The search: four independent passes, and the method is not there

`325.2`'s Accept makes *"the original method is recoverable"* and *"it is not"*
equally satisfying, so the search is the work. Each pass covers something the
others cannot, and every command is written next to its claim:

```
git log --all --oneline -S'85 ms'   -S'558 ms'   -S'3,783'      # where the figures enter
git log --all --diff-filter=AD --name-only -- '*stress*'        # was a probe ever kept?
git log --all --format='%h|%s|%b' | grep -in 'forced.layout\|performance.now\|domContentLoaded'
grep -rn 'forced-layout\|forced layout\|hidden-tab' ROADMAP.md ROADMAP-archive.md .roundtable/*.md
```

- **The figures enter at `4fbe1afe`** (2026-08-15 12:11 +0800, *"Long-term item:
  virtualization hooks — measured, closed as won't-build"*), and the two
  throttled rows at **`961fd043`** (13:01 +0800, the decisions grill). Both
  commits record the numbers. **Neither records a window**, in the message or
  in the diff — and `4fbe1afe`'s entire diff is three files: `ROADMAP.md`, the
  docs section, and the `/stress` route in `examples/po-app/server.mjs`, which
  contains **no timing code at all**.
- **No probe was ever kept beside them.** `--diff-filter=AD` over every ref
  returns exactly one file in the repository's history — this repo's *current*
  `apps/docs/scripts/measure-stress.mjs`, added by `82dc60e6` on **2026-09-07**,
  three weeks later.
- **Over all 2,070 commits, the grep finds two hits**, one about an unrelated
  sweep. The one that is about this measurement is the whole surviving record:
  *"the first measurement pass misread a 45s 'renderer freeze' at 5k rows — it
  was a hidden-tab artifact (background tabs never fire rAF and don't run
  layout), not the page; re-measured with synchronous forced-layout reads."*
- **In tracked prose it survives once**, archived at `ROADMAP-archive.md:16244`,
  identical text.

**That fragment is a diagnostic aside, not a definition, and the distinction is
the item.** It says how one artefact was ruled out and hints that the reading
ended in a forced layout. It names **no start point, no end point and no
machine** — so no later run can know whether it is measuring the same thing.
Recoverable: **no**.

### The measurement that decides it needs no knowledge of the missing machine

The obvious objection to withdrawing is that the docs page already carries a
caveat — *"read the shape rather than the absolute figures"* — and a shape is
supposed to survive an unknown machine. **It does not survive an unknown
window**, and one re-run shows it without ever needing to know what machine the
2026-08-15 sitting used.

`npm run measure:stress -w docs -- --rows 1000,5000,20000 --repeat 5`, medians
over 5 runs, controls **1000/1000, 5000/5000, 20000/20000 checked**, machine
recorded by the probe (Intel Xeon @ 2.80GHz, 4 cores, 15.7 GB, linux x64,
node v22.22.2, `Chrome/141.0.7390.37`, throttle 1, viewport 1440):

| n | published (2026-08-15) | this run | ratio |
|---|---|---|---|
| render 1,000 | 85 ms | `render-dcl` 357.1 ms | **4.20x** |
| render 5,000 | 174 ms | 2,073.1 ms | **11.91x** |
| render 20,000 | 558 ms | 4,092.9 ms | **7.33x** |
| select-all 1,000 | 4 ms | 3.7 ms | **0.93x** |
| select-all 5,000 | 18 ms | 12.9 ms | **0.72x** |
| select-all 20,000 | 49 ms | 58.4 ms | **1.19x** |

**A machine gap is a roughly constant multiple; a method gap is not.** The
select-all column — measured on the same page, in the same run, on the same two
machines — reproduces at **0.93x / 0.72x / 1.19x**, which is what "a different
machine" looks like. The render column reads **4.20x / 11.91x / 7.33x**, which
is not a multiple at all. Stated at the strength the evidence carries: this does
**not** prove the 2026-08-15 render figures were wrong. It proves the
disagreement is **undiagnosable** — the two windows differ (the probe's spans
`responseEnd`→`domContentLoadedEventEnd`, so it carries parsing the response and
the reference app's own subresources), the two machines differ, and with no
method recorded nothing can separate them. The shapes disagree too — published
**1 : 2.05 : 6.57**, probe **1 : 5.81 : 11.46** — so *"read the shape"* is a
fallback that cannot be checked either.

**And the page shipped a contradiction, which is checkable without any
judgement.** `/components/data-table` said *"the harness is kept precisely so
you can get figures for **your** hardware"* directly above a column that
`measure-stress.mjs`'s own header says its render figures are **NOT** comparable
to. Two shipped documents in this repository, pointing opposite ways about one
column, and the reader is the one who pays.

### The verdict, and the third branch refused with its reason

`325.2`'s Accept admits a third reading — *a shape-only column kept undefined,
admissible only if it says what a reader is supposed to do with it*. **Refused**,
because the reader cannot do the thing the page told them to: the shape is not
checkable, and the one instrument the page points at produces a different one.
So the second branch, **withdrawal, the way the 2026-09 re-run was withdrawn** —
called out on the page rather than deleted, because the lesson is the reusable
part.

What changed:

- **`/components/data-table`** — the *Initial render* column is out of the
  table; a withdrawal paragraph carries the five figures it held
  (85 / 174 / 558 ms, and 1,625 / 3,783 ms throttled), why they are withdrawn,
  and the re-measurement above. The guidance sentence that rested on the
  withdrawn `~3.8 s` is **re-based on a figure anyone can re-derive**: the
  probe's defined render window at 20k reads **~4.1 s** on the recorded
  four-core container, larger there than every other cost measured beside it, so
  *"the genuine pain point is initial render at 20k on slow hardware"* survives
  on evidence rather than on the withdrawn number. `Render and scroll scale
  linearly with no cliff` is softened to what both sittings actually show —
  cost grows with row count and nothing steps — because the linearity claim
  rested on the withdrawn column.
- **`/concepts/scale`** — the same column removed from the duplicate table, with
  a note pointing at the full withdrawal.
- **`measure-stress.mjs`** — the header paragraph that existed to say *"not
  comparable to the Initial render column"* now records the withdrawal and the
  `--diff-filter=AD` search behind it, instead of pointing at a column that is
  gone.

**The two kept columns are kept on the evidence above, not by default** —
select-all reconciles. The style flush is the one loose end and it is filed
below rather than waved through.

### This wake's own instrument was wrong first, on schedule — and it cost a false P0

The **first** `measure:stress` run failed its own control on **6 of 6** runs
(`0/1000 checked`, `0/5000 checked`), and `check:po-app` then failed **3 of 20
behaviours**, including *"the shared page template inits data-tables: select-all
on /pos checks every row"*. That is the **exact signature** of the real
2026-08-23 → 2026-09-07 defect Slice 309 found, in the same words, on a gate CI
runs — which reads as a P0 that preempts the whole dispatch.

**It was neither.** `packages/core/dist` did not exist, because the wake had not
yet run `npm run build -w @busy-office/ui`, so `npm pack -w @busy-office/ui`
shipped the reference app a tarball with **no behaviour bundle in it**. The
cross-check that settled it before any diagnosis was written: **CI on this exact
commit `2caaa16f` was green at `2026-09-08T11:04:54Z`**, and CI runs
`check:po-app`. After `npm run build -w @busy-office/ui` and
`rm -rf examples/po-app/node_modules examples/po-app/busy-office-ui.tgz`:
`check:po-app` **20 / 20**, and the probe's controls **1000/1000, 5000/5000,
20000/20000**. Filed as `352.1`.

1. [ ] **352.1 — a missing `packages/core/dist` is reported as an application
       defect, in the exact words of a defect this repo has actually had.**
       `check:po-app` and `measure:stress` both boot the reference app from a
       freshly packed tarball, and neither asks whether that tarball contains
       the behaviour bundle. When it does not, the failure text is *"the
       select-all did not select the rows"* — indistinguishable from the real
       break, and the wrong half of the system to go looking in. It cost this
       wake a false P0 and was settled only by a green CI run on the same
       commit.
       - **Accept** — the property, not a predicted fix: a wake that boots the
         reference app with an unbuilt `packages/core` is told **which** of the
         two it is. Either `po-app-harness.mjs` asserts the packed tarball
         carries the behaviour bundle before booting and names that when it
         does not, **or** a recorded reason it should not — measuring that the
         precondition cannot occur in any environment a wake actually runs in
         is a satisfying outcome and closes it by writing that down.
         Red-proving it means `rm -rf packages/core/dist` and watching the new
         message appear, not watching the old one fail.

2. [ ] **352.2 — the two KEPT columns have no recorded method either, and the
       machine gap they imply is not one machine gap.** Slice 352 kept
       *Select-all* and *Post-bulk-check style flush* because select-all
       reconciles against the probe at 0.93x / 0.72x / 1.19x. The style flush
       does not reconcile the same way: published `negligible` / 231 ms / 610 ms
       against the probe's **89.2 / 345.1 / 2,206.7 ms** — **1.49x at 5k and
       3.62x at 20k**, on the same run, from the same sitting, where select-all
       read ~1x. Layout-bound work legitimately scaling differently from
       JS-bound work across two machines is a live explanation and is not
       measured; so is the same missing-window problem the render column was
       withdrawn for.
       - **Accept** — the property: whichever it is, it is recorded with the
         command that shows it. Finding that the two workloads legitimately
         scale apart by that much across these machines is a satisfying outcome
         and closes it by writing that down beside the column; finding they do
         not is equally satisfying and closes it by withdrawing the style-flush
         column the way the render one went. Note the probe's own n=20,000
         style-flush spread is **1,384.9-2,930.4 ms over 5 runs**, so any
         verdict here needs more than one sitting on each side.

**The archive sweep was evaluated and declined on the measured trigger.**
`roadmap_scope.py` read closed-history share **4,129 / 10,606 = 38.9%** at
`2caaa16f`, with 20 eligible targets, **11** of them named by a still-open item
(236.2's report, read before concluding). Below every trigger the last sweeps
used — the tenth dispatched at 55.1%, the eleventh at 56.7%, the twelfth
declined at 40.6%, the thirteenth taken at 41.5%. **`249.12` is named for a
TWELFTH consecutive wake**; nothing is proposed here. Re-run the script at your
own commit — this wake's own text raises the denominator, not the ratio's
numerator, because every line it adds lands under an **open** heading.

**NOT VERIFIED, said plainly — and this wake DOES add visual debt.** No
1440/390 light-and-dark screenshots: a cloud wake has no Podman. Two docs tables
lose a column (`/components/data-table` 4 → 3, `/concepts/scale` 3 → 2) and four
paragraphs change, so **"does it look right" is genuinely unchecked** — column
widths redistribute, and the `4x CPU throttle` badge now sits in a two-column
table on `/concepts/scale`. What IS checked is every structural property the
whole-tree gates assert, listed in the commit. A local wake should look at both
pages at 1440 and 390 in both themes; until then this is debt, not verification.

## Slice 351 — Objective grill of Slices 324, 325, 347, 350: 63 of 65 assertions reproduce to the digit, and the finding is that the base rate `350.1` tells a later wake to re-run counts a sweep's OWN conversions as inputs it had to read (2026-09-08)

**Dispatched by rule 3**, cloud wake, at `Objective 4 / 3 slices OVERDUE [324,
325, 347, 350]`. Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, fixed with `git checkout -B main
origin/main` before any commit), and `origin/main` again arrived as a **forced
update** (`26447ba...0ab8a56`) — `0ab8a56` being the previous wake's own tip, so
no other dispatcher had landed anything between the two wakes. Trap 2 clean in
one `--unshallow` (**2,068** commits, no `shallow.lock`), and it again brought
the tags (`git tag | wc -l` → **8**, run rather than assumed) — the finding here
is a history measurement over 139 commit windows, so the clone was deepened
before any figure was taken. Step 1: both intakes read with `ENVIRONMENT.md`
§8's controls — `/issues?state=open` **200 len 1**, `/discussions` **200 len
0**, `/not-a-real-route` **404** — issue #2's `updated_at` unmoved at
`2026-09-06T15:10:34Z` for a **seventeenth** consecutive hand-off, so no new
input and Step 1 committed nothing. Step 2: rule 1 no P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across 31 open items),
rule 2 `0 / 4` (spent by Slice 350), **rule 3** OVERDUE. Rules 4-8 not reached.
**Rule 5 was not reached and would not have fired** — its line reads `ok`, not
`STALE`: 0 wake-dates newer than the newest pair, 8 of 47 names paired across
days.

**Scope, per `LOOPS.md` §6 step 0: four of four, nothing dropped.** No earlier
grill names 324, 325, 347 or 350 —
`grep -hoE '^## Slice [0-9]+ — Objective grill of [^:—]*' ROADMAP.md ROADMAP-archive.md`
returns 346→{322,342}, 341→{316,319,339}, 337→{297}, 336→{315,332,333} and back;
none names any of these four. `.roundtable/INDEX.md` reports **4 repeated
subject(s)** across 200 files at dispatch, and this grill adds no repeat. Two of
the armed four are still **open** (325 via `325.2`, 350 via `350.1`) — the same
2-of-4 divergence the previous hand-off measured on this same arming set, which
is what `349.1` is open about and is not a reason to skip them: their closed
items were audited and the open items' Accepts were read, not judged. Slice 347
is audited **with** Slice 324, its body being almost entirely `324.1`'s closure.

**Every verdict in all four slices survives.** `324.1`'s refusal of a rule-5
direction, `324.2`'s refusal of both its escape hatches, `324.3`'s archive
sweep, `325.1`'s refusal of the citation gate and `347.1`'s `absent` fix are
each correct, and each measurement they turn on reproduces — including
`324.2`'s **98-byte** README lag, which still reads 98 at this tree. The full
65-row table, the two smaller defects and this grill's own two wrong instruments
are in `.roundtable/grill-objective-324-325-347-350-2026-09-08.md`.

### The finding: the predicate, not the number

Slice 350's probe windows the log's Standardize commits as `a..b` and asks
whether any commit in the window touched `packages/core/src/css/**` or
`apps/docs/src/**`. **`b` is the sweep's own commit.** A sweep that converts a
dead style lands its conversion inside its own window, so the window is
classified *has lane input* on the strength of the sweep's OUTPUT rather than on
anything the sweep had to read.

The slice says exactly this in prose, about the one window it checked by hand —
*"exactly one of its 16 commits touching a lane input — `161ede68`, **the
sweep's own conversions**"* — and does not carry it back into the command.
Re-run with the window a sweep could actually see when it started (`a..b^`),
same log, same input paths:

```
windows=139
  published predicate (a..b, INCLUDES the sweep commit): no-input=15 (10.8%)
  what the sweep could SEE (a..b^, excludes its own commit): no-input=20 (14.4%)
  windows classified has-input ONLY by the sweep's own commit: 5
  those sweeps: 15f9bbc1 91677655 cdd7c07e 0768f09f 161ede68
```

**Discriminated by hand on two of the five** — in each, the only lane-input
commit in the window is the sweep's own (`cdd7c07e` 1 file, `161ede68` 6). So
the rate `350.1` is a decision about is **14.4%, not 10.1%**, understated by a
third and in the direction that weakens the item's own case.

**And the wake's own recording moved the published number before the wake
ended.** `350.1`'s Accept says *"the figures are snapshots and **this commit
does not move them** (it touches no lane input), but a later one will."* Read at
each revision rather than from the working tree:

```
81f6281c  138 windows  14 no-input (10.1%)  13 no-both  span 1994   <- Step 0 tip
6996a39   138          14 (10.1%)           13          1994        <- the slice's OWN commit
65de70c   139          15 (10.8%)           13          2008        <- the SAME WAKE's recording
0ab8a56   139          15 (10.8%)           13          2008        <- HEAD
```

True of the commit, false of the wake, and the parenthesis has the reason
backwards: `record_iteration.py` appends a row carrying the sweep's sha, which
**adds one window** — and that window is a no-input one exactly when the sweep is
the kind `350.1` is about. Touching no lane input is what makes the wake move the
numerator, not what stops it. `no-both` stays 13 because that window did touch an
instrument (`6cfe380c`, comment-only) — the slice's own classification arriving
as a control. The general form: **a figure published from inside a sweep is
always one window short of the sweep publishing it**, because the window only
exists once the wake records. `ENVIRONMENT.md` says where to *read* a figure;
nothing said a wake's own last mandated step can move one it published three
commits earlier.

1. [x] **351.1 — the base-rate command `350.1` hands forward should window on
       what the sweep could SEE, or say why it does not.** `a..b` includes the
       sweep's own commit; `a..b^` is what the sweep had to read. The two
       disagree on **5 of 139** windows and on the headline rate (10.8% vs
       14.4%). This does not decide `350.1` — that item is still filed, not
       decided — it decides which number `350.1` is decided on.

       **DECIDED 2026-09-09 (Slice 370, Standardize sweep): the change is
       ACCEPTED, and the command in `350.1` now windows `a..b^`**, with the
       reason and both readings beside it. `350.1` itself is untouched and still
       open — this decided which number it is decided on, which is all it
       claimed to do.
       - **What settled it was the spot-check `350.1` already carried in prose.**
         That paragraph names `161ede68`'s only lane-input commit as *"the
         sweep's own conversions"*, so `a..b` classifies that window as **has
         lane input** on the strength of the sweep's own OUTPUT. Re-verified by
         hand at `421afd15` on two of the five disagreeing windows:
         `f9e0f17d..161ede68` is 16 commits, **15 of which touch no lane input**,
         the 16th being the sweep; `d3bb443f..cdd7c07e` is the sweep's own single
         `Gallery.astro`. The confound is the mechanism, not one window's
         accident. The admissible counter-argument the Accept named — that a
         sweep's own conversions ARE evidence the window had material — dies on
         exactly this: it would make the predicate answer *"did the sweep change
         anything"*, which is not `350.1`'s question and is knowable without it.
       - **Both predicates re-measured at execution time**, unshallowed first
         (`git rev-parse --is-shallow-repository` → `false`, 2,108 commits);
         quoting nothing from above. At `421afd15`, 141 windows:
         `a..b` **15** no-input (10.6%) / 13 also no-instrument / span **2037**;
         `a..b^` **20** no-input (14.2%) / 18 / span **1896**.
       - **The base rate moved in its DENOMINATOR only** — the counts 15 and 20
         are identical to the pair this item published (measured by the Slice 351
         grill at **`65de70c`**, not at `81f6281c`, whose own reading is the
         earlier `14 of 138`), and the disagreement set
         is **the same five windows** (`15f9bbc1`, `91677655`, `cdd7c07e`,
         `0768f09f`, `161ede68`), reproduced rather than carried. The rate shift
         (10.8%→10.6%, 14.4%→14.2%) is 139→141 windows and nothing else.
       - **Reconciled twice before quoting** (CLAUDE.md): the `a..b` span sums to
         **2037**, equal to an independent `git rev-list --first-parent
         <oldest>..<newest>`; and `a..b^` is **exactly 141 lower**, one dropped
         commit per window, which is the arithmetic the change predicts.
       - **Verified as the ARTEFACT, not as the diff**: the amended block was
         extracted back out of `ROADMAP.md` by content (asserting exactly one
         block matches — the naive "first block" pick found **6** candidates) and
         executed, printing `141 windows; 20 …; span 1896`, the figures written
         beside it. A caret count over the extracted block read **3** where the
         code has 2 — the third is this decision's own explanatory comment, the
         "assertion tripped by its own explanation" shape, checked rather than
         assumed.
       - **No gate**, as both items said: what changed is which commit range a
         command uses, and that is a one-line edit.
       - **Accept — the property, not a predicted outcome:** the command
         published in `350.1` is amended in place (236.2 permits amending, and
         the slice is live) so that a later wake re-running it gets the
         see-able window, **or** the reason for keeping `a..b` is written beside
         it. **Refusing the change is a satisfying outcome** if the reason is
         stated — an argument that a sweep's own conversions ARE evidence the
         window had lane material is admissible, and would then have to say what
         `350.1` is measuring, since it is no longer *"could three of the four
         lanes have moved"*.
       - **Re-measure both predicates at execution time rather than quoting the
         figures above** — they are snapshots, and by construction the next
         Standardize row moves the denominator. The probe is in the grill report;
         it needs the clone unshallowed first (`git rev-parse
         --is-shallow-repository` must read `false`) or the window walk silently
         truncates at 50 commits.
       - **No gate is proposed and the reason is the same one `350.1` gives:**
         classifying this very window needed a diff read, so *"this change could
         move a lane's reading"* is semantic (94.11). What is checkable is which
         commit range the command uses, and that is a one-line edit, not a gate.
       - **Finding the base rate has MOVED is a satisfying outcome**, not an
         off-plan one — the premise is a measurement, so re-checking it is part
         of the criterion (`LOOPS.md`'s rule on premises).

**Two smaller things are recorded in the grill report and neither carries an
item, each for a stated reason.** `325.1`'s `git grep measure:stress` census
names **five of the six** paths that command returns at the commit publishing it
(`f4da2fe8`) — the omitted one is a `.roundtable/` grill report, the same kind as
the roadmap prose it does name, so the refusal it supports is untouched; the
remedy is to paste `git grep -l` output rather than a prose list, which is a
habit and not a mechanism. And `324.3` cited two revisions correctly and
**`67fc6659` no longer resolves** on an unshallowed clone — the sha did not
survive into `main`, which is Step 0c's known shape rather than an error in the
slice — while its figures all reproduce at `3cb2381a` (closed 67→52, archive
714→730, open 26→26, headings 306→306, lines 8,188→6,476). That was nearly
filed as an item on a census reporting **9** dead sha citations in `ROADMAP.md`;
reading the context of each showed **eight are blob digests or deliberately
bogus values written into red-proofs**, so the real corpus is **one** and a gate
would be ceremony whose discriminator — *is this 8-hex token a revision or a
digest?* — is `348.1`'s open problem one token-shape over.

**This grill's own two instruments were wrong first, on schedule.** The sha
census over-counted **5x** by matching on token shape, which is what turned that
observation from an item into a refusal; and the `absent` red-proof came back
**green** on its first run because the worktree it ran in had no
`packages/core/dist`, so `--verify-stamps` bails at *"api.json is missing"*
before reading a stamp — the injection landed in the file and the gate never
reached it. Re-run in the built tree it goes red exactly once, on exactly the
injected row, with the unmodified control passing either side.

**NOT VERIFIED VISUALLY, and none is owed.** No 1440/390 light-and-dark
screenshots — a cloud wake has no Podman. The diff is `ROADMAP.md`, one new
`.roundtable/` report and the hand-off: no CSS, no docs page, no component and
no script changed, so nothing rendered can move. Slice 345's two visual debts
and the six older ones are unchanged and unspent.

## Slice 350 — Standardize sweep, 4 of 4 lanes, all clean — and the sweep's own dispatch is the finding: rule 2's counter counts ROUNDS, lanes 1-3 measure ARTEFACTS, and **10.1% of windows can move neither** (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE`, exactly
as the previous hand-off's ⚠ block predicted — re-read this wake rather than
trusted. Cloud wake. Rule 1 found no P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across 30 open items).
Rule 3 was `Objective 3 / 3 OVERDUE [324, 325, 347]` and is evaluated **below**
rule 2, so the grill waits one more wake. Rules 4-8 not reached. Rule 5's line
read `ok`, not STALE — **0** wake-dates newer than the newest pair, 8 of 47
names paired across days.

Step 0: container **DETACHED** again (`git branch --show-current` empty), trap 1,
fixed with `git checkout -B main origin/main` before any commit; `origin/main`
again arrived as a **forced update** (`26447ba...81f6281`). Trap 2 clean in one
`--unshallow` — **2,065** commits, no `shallow.lock`, and it again brought the
tags (`git tag | wc -l` → **8**, run rather than assumed). **No collision** — the
pre-commit `git fetch origin main` found `origin/main` unmoved at `81f6281c`,
which is the previous wake's own tip.

**Step 1 — both intakes read, with the controls `ENVIRONMENT.md` §8 names:**
`/issues?state=open` → HTTP 200 len **1**; `/discussions` → HTTP 200 len **0**;
`/not-a-real-route` → **404**, the control that makes the `200 []` mean *served
and empty*. Issue #2's `updated_at` is still `2026-09-06T15:10:34Z` — a
**sixteenth** consecutive hand-off with no movement. Nothing new to triage, so
Step 1 committed nothing.

**The archive sweep was evaluated and declined on the measured trigger.**
`roadmap_scope.py` at `81f6281c` reports closed-history share
**4,129 / 10,216 = 40.4%**, 20 eligible targets, 10 of them named by a still-open
item (236.2's report, read before concluding). 252.1 dispatched the tenth sweep
at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 declined the twelfth at
**40.6%**, `324.3` took the thirteenth at **41.5%**. 40.4% is below every one of
those. The revision is named because this commit moves it: every line of this
slice lands under an **open** heading, so the closed share falls further — the
deliberate absence of a line count here is `ENVIRONMENT.md`'s rule applied to
the one figure an edit invalidates as it writes it. Re-run
`python3 scripts/loops/roadmap_scope.py` at the commit. `249.12`, the open **OWNER OR ARCHITECTURE CALL** on the archival
trigger, is now named for a **tenth** consecutive wake; nothing is proposed here.

### The four lanes, all clean — measured, not cited

- **Lane 1 of 4 — `scan:dead-style`: on the refusal set, page for page.**
  **0** dead attributes on **0** pages; **1,365** live attributes, **1,813**
  declarations, **345** multi-declaration. Per declaration: **11 dead on 9
  pages**. Slice 345 reconciled its re-run against the eleven refusals it had
  just written; this run reconciles the same eleven *and* their page
  distribution, which 345 did not publish: `/patterns/` ×3 (PatternPreview's
  accent), `amount` / `byline` / `progress` (`inline-size: 100%`), `combobox`
  (`margin-block-start`), `state-patterns` (`align-items`), `/base/motion/`
  (`display: inline-block`), `/patterns/app-launch/` (`block-size: 2rem`),
  `/reference/tokens/` (`inline-size:var(--bo-space-0)`) — 3 + 8 across 9 pages.
  Every one is refused with its measurement in Slice 345. **Nothing converted
  this wake**, and `345.1` (should `.bo-motion-spin` own its `display:
  inline-block`?) stays open and untouched — a component CSS change is not a
  Standardize-sweep edit, which is why 345 filed it rather than building it.
- **Lane 2 of 4 — `report:css-repeats`: no delta, a sixth consecutive identical
  reading.** 74 source files · **242** rules with 3+ declarations · **230**
  distinct bodies · **8** bodies repeating — byte-identical to Slice 345's
  `74 / 242 / 230 / 8`. Checked against `LOOPS.md`'s settled table **member for
  member**, not by the count: the x4 joined-control radius reset is still two
  components spelling one decision twice each, and no group is new or grew.
- **Lane 3 of 4 — `report:prose`: every flagged page carries a verdict.** 119
  documentation pages of 128 built · median **798** · mean **956** · total
  **113,787** words. The flagged union is **15** pages — the 10 over the corpus
  2x (1,596) plus `/base/motion/`, `/concepts/layouts/`,
  `/concepts/js-behaviors/`, `/concepts/design-language/` and `/concepts/scale/`
  over a family 2x. Checked against the ENUMERATION the lane mandates, read out
  of the archive rather than assumed: **158.1's twelve** are `data-table`,
  `richtext`, `which-pattern`, `form`, `editable-grid`, `list-report`,
  `calendar`, `money`, `combobox`, `tabs`, `layouts`, `output-form`; **161.1's
  three** and **178.3's `/concepts/scale/`** make sixteen. All 15 flagged pages
  are members, and the one non-flagged member is `/patterns/output-form/`, as in
  345. **No page carries no verdict**, so nothing to record.
- **Lane 4 of 4 — `report_loop_prose.py`: no file changed accumulate class.**
  The `ratchet` block reads `LOOPS.md 1 up, last cut f9e0f17d (2026-09-07)`; the
  dispatch region is **7,548** words at **42.0%** of the file — *flat* against
  Slice 345's 7,548, which is expected, since no commit since has touched
  `LOOPS.md`. Not attributed per section (308.1/339.1), and it does not need to
  be: a flat number is not a regrowth reading either.

  **`CLAUDE.md`'s ratchet reads `33 up / 0 down, never cut`, and that is the one
  row with a stated reopen condition — so it was executed rather than waved at.**
  167.1's condition is *"reopen if an eighth [`can this detector fail`] section
  is added without folding"*. Split on `^## `, `CLAUDE.md` holds **16** sections
  at `81f6281c` and **7** of them are that subject (red-proving/injection,
  first output, reported number, heuristic self-test, base rate, CI-only,
  structural assertion) — **2,414 of 5,687 body words, 42.4%**. **No eighth.**
  The share is reported at HEAD only and is deliberately NOT compared to 167.1's
  `1,893 / 4,600`, which was not re-derived at its own commit
  (`ENVIRONMENT.md`'s *a figure describing a commit is read from THAT commit*) —
  the condition is a COUNT of sections, and the count is what was checked.
  The watch itself was retired by **193.1** ("fold nothing, retire the watch")
  and the question re-raised and re-verdicted **HONEST** by **284.2**, which put
  the file's entire removable surface at **181 words (3.1%)** on two red-proved
  instruments. Settled; not re-raised.

### The finding: the sweep was dispatched onto a window three of its lanes could not see

All four lanes reading identically to a sweep four hours old is not a
coincidence, and asking *what would make this wrong* is what produced the item
below. **No commit between the last Standardize and this one touched anything
lanes 1-3 read.** The window `161ede68..HEAD` is 13 commits and 12 distinct
files; `packages/core/src/css/**` and `apps/docs/src/**` contribute **zero** of
them.

**The obvious objection is real and has a live example one window back**, which
is why the predicate is not "inputs changed": a lane's reading can also move
because its **instrument** changed. `cdfcb129` (320.2) rewrote
`scan-dead-style.mjs`'s verdict from per-attribute to per-declaration, and Slice
345's lane 1 duly opened at **52 dead on unchanged inputs**. This window *does*
touch that same file — `6cfe380c`, Slice 346's grill — so the file-level test
cannot classify it, and the diff had to be read: **24 lines added, 0 of them
outside the header block comment, 0 deleted.** The executable code is identical,
so lanes 1-3 could not have moved.

**The base rate, over the whole log** — `.roundtable/loop-log.md`'s 156
Standardize rows resolve to **139 distinct commits on first-parent `main`**
(1,660 of 1,660 rows parsed; 0 shas unresolvable), giving 138 windows:

```
python3 - <<'PY'
import re, subprocess
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
order = sh('git','rev-list','--first-parent','HEAD').split()
pos = {c: i for i, c in enumerate(order)}
full = {c[:n]: c for c in order for n in (7, 8, 9, 10, 40)}
std, seen = [], set()
for line in open('.roundtable/loop-log.md'):
    if line.startswith('- ') and ' · Standardize · ' in line:
        m = re.search(r' · ([0-9a-f]{7,40})\s*$', line.rstrip())
        if m and full.get(m.group(1)) and full[m.group(1)] not in seen:
            seen.add(full[m.group(1)]); std.append(full[m.group(1)])
std.sort(key=lambda c: -pos[c])
INPUTS = ('packages/core/src/css/', 'apps/docs/src/')
INSTR = ('apps/docs/scripts/scan-dead-style.mjs',
         'apps/docs/scripts/report-prose.mjs',
         'packages/core/scripts/report-css-repeats.mjs')
noin = noboth = span = 0
for a, b in zip(std, std[1:]):
    # `{b}^`, NOT `{b}` — the window is what the sweep could SEE, and its own
    # commit did not exist when it ran (351.1, decided 2026-09-09).
    files = {f for c in sh('git','rev-list','--first-parent',f'{a}..{b}^').split()
               for f in sh('git','show','--name-only','--format=',c).split('\n') if f}
    span += len(sh('git','rev-list','--first-parent',f'{a}..{b}^').split())
    hi = any(f.startswith(INPUTS) for f in files)
    noin += not hi
    noboth += not hi and not any(f in INSTR for f in files)
print(len(std)-1, 'windows;', noin, 'with no lane input change;', noboth,
      'with no input AND no instrument change; span', span)
PY
# 2026-09-08 at 81f6281c, windowed a..b:  138 windows; 14 no-input (10.1%); 13 also no-instrument (9.4%); span 1994
# 2026-09-09 at 421afd15, windowed a..b^: 141 windows; 20 no-input (14.2%); 18 also no-instrument (12.8%); span 1896
#   the same run windowed a..b reads 15 (10.6%) / 13 (9.2%) / span 2037, which
#   reconciles to `git rev-list --first-parent <oldest>..<newest>` = 2037; a..b^
#   is exactly 141 lower, one dropped commit per window.
```

**Reconciled against an independent count before quoting** (CLAUDE.md): the 138
window sizes sum to **1,994**, and `git rev-list --first-parent <oldest
Standardize>..<newest>` is **1,994** — equal, so no window is double-counted or
dropped. **The instrument discriminates**: 124 of 138 windows *do* carry an
input change, up to 16 commits' worth, so this is not the "identical value
across many inputs" tell. A hand spot-check of the newest closed window
(`f9e0f17d..161ede68`) shows exactly one of its 16 commits touching a lane
input — `161ede68`, the sweep's own conversions.

**⚠ THE FIGURES IN THIS PARAGRAPH AND IN THE BLOCK'S FIRST COMMENT LINE ARE
`a..b` READINGS; THE COMMAND ABOVE NO LONGER WINDOWS THAT WAY** (351.1, decided
2026-09-09). They are kept as the historical reading at `81f6281c`, not
re-derived, because they are what 350.1's argument was written against — but a
wake re-running the block now gets the `a..b^` line instead, and the two are
**not** comparable. The spot-check sentence immediately above is the whole
reason for the change: it names `161ede68`'s only lane-input commit as *the
sweep's own conversions*, so under `a..b` that window is classified **has lane
input** on the strength of the sweep's own OUTPUT. Re-verified by hand at
`421afd15` on both disagreeing windows — `f9e0f17d..161ede68` (16 commits, 15
touching no lane input, the 16th being the sweep) and `d3bb443f..cdd7c07e` (the
sweep's own single `Gallery.astro`) — so the confound is the mechanism, not an
artefact of one window. That is CLAUDE.md's *reconcile against the SOURCE, not
against the argument* one level up: a predicate that reads the sweep's own
commit cannot see past its own caller.

**The base rate MOVED only in its denominator, which 351.1 names as a satisfying
outcome.** Re-measured at `421afd15`: the no-input COUNTS are **15** (`a..b`)
and **20** (`a..b^`), identical to the pair the Slice 351 grill published at
**`65de70c`** — *not* to the `14 of 138` in the comment line above, which is
`81f6281c`'s own reading one window earlier, exactly the "a sweep's figure is
one window short of the sweep publishing it" effect that amendment records. The
rates move (10.8% → 10.6%, 14.4% → 14.2%) purely because the denominator grew
139 → 141. The disagreement set is **the same five windows** — `15f9bbc1`, `91677655`,
`cdd7c07e`, `0768f09f`, `161ede68` — reproduced independently rather than
carried.

**The cost is measured, not asserted**: lane 1 alone is **123s** of wall clock in
this container (`date`-bracketed re-run of `npm run scan:dead-style -w docs`),
on top of the docs build from a cleared `dist` that it requires.

**Lane 4 is not affected and that is what keeps this a question rather than a
defect.** It reads the loop-machinery markdown, and every one of this window's 13
commits changed some of it. A rule-2 firing on a no-input window still buys a
lane-4 read and the archive-sweep evaluation above; what it does not buy is
lanes 1-3.

1. [ ] **350.1 — should rule 2's counter know whether its first three lanes have
       anything to read?** Rule 2 counts **Continue rounds**; lanes 1-3 measure
       **artefacts**. The two are independent, and this wake is the demonstration:
       a full sweep dispatched onto a window in which `packages/core/src/css/**`
       and `apps/docs/src/**` were untouched and the one instrument that moved
       moved only its comments. This is `349.1`'s shape one rule up and it is
       **not the same defect** — 349.1 is a counter that counts something other
       than what its rule's text says; here the counter counts exactly what the
       text says, and the text's unit simply does not predict whether three of
       the four lanes have input. Filed by the sweep it describes.
       - **Accept:** a decision recorded either way, with the base rate
         **re-measured at execution time** by the command above rather than
         quoted from here — the figures are snapshots and this commit does not
         move them (it touches no lane input), but a later one will.
         - If rule 2 gains an input test, it must name **both** things that make
           a lane's reading movable — the inputs and the lane's own instrument —
           and `cdfcb129`/Slice 345 is the case it must still dispatch, since
           that window's lane 1 went 0 → 52 with no input change at all.
         - If it is refused, the reason names what a lane-1/2/3 pass buys on a
           window that cannot move it, and says whether lane 4 plus the
           archive-sweep evaluation carry the cadence on their own.
         - **Refusing is a satisfying outcome, and so is finding the base rate
           has moved** — the premise here is a measurement, so re-checking it is
           part of the criterion (`LOOPS.md`'s rule on premises), not a courtesy.
       - **No gate is proposed, and the reason is measured rather than stylistic.**
         A file-level predicate could not classify this very window: it reports an
         instrument change that turned out to be comment-only, so the verdict
         needed the diff read. *"This change can move a lane's reading"* is
         semantic — roadmap 94.11's rule — and the checkable shape is the wrong
         one here, so the honest options are a decision in `LOOPS.md`'s text or a
         **report**, never a build gate.
       - **AMENDED 2026-09-08 by the Slice 351 grill (236.2), on two counts.
         The figures above reproduce exactly at the revision they name; the
         predicate behind them and the stability forecast beside them do not.**
         - **The base rate is 14.4%, not 10.1%, on what a sweep could SEE.** The
           command windows as `a..b`, and `b` is the sweep's own commit — so a
           sweep that converts a dead style is classified *has lane input* on its
           own OUTPUT. Windowed as `a..b^`: **20 of 139 no-input (14.4%)** against
           the published predicate's 15 of 139 (10.8%), disagreeing on **5**
           windows (`15f9bbc1`, `91677655`, `cdd7c07e`, `0768f09f`, `161ede68`),
           two of them discriminated by hand. `161ede68` is the window the
           paragraph above already names as *"the sweep's own conversions"* — the
           confound was seen in prose and left in the command. Which predicate
           this item is decided on is **`351.1`**.
         - **"This commit does not move them" is true of the commit and false of
           the wake.** `record_iteration.py` appends a row carrying this sweep's
           sha, which adds one window — a **no-input** one, precisely because the
           sweep touched no lane input. Read at each revision: `81f6281c` and
           `6996a39` both 138 / 14 / 13 / span 1994; `65de70c`, this wake's own
           recording commit, 139 / **15** / 13 / span 2008; HEAD the same. The
           parenthesised reason is backwards, and the general form is that **a
           figure published from inside a sweep is always one window short of the
           sweep publishing it.**
       - **AMENDED 2026-09-08 by the Slice 357 sweep, on a third count: the
         predicate is not per-lane, and lane 2 is the one it mis-serves.** The
         command ORs `packages/core/src/css/` with `apps/docs/src/`, but
         `report-css-repeats.mjs` reads **only** the first (`srcCssRoot`), while
         lanes 1 and 3 read built pages and so depend on both. Bucketed
         separately at `30d94cc7`, `a..b^`: `neither` **20** · `core_only`
         **7** · `docs_only` **38** · `both` **74**, summing to 139. So lanes 1
         and 3 are blind on **20 of 139 (14.4%)** — this item's figure,
         reproduced — and **lane 2 on 58 of 139 (41.7%)**, the 38 `docs_only`
         windows being ones the OR credits it with. Red-proved by injecting the
         *same* three-declaration body into each tree: core moves the report
         242 → 243 and the group x3 → x4, docs moves nothing. Slice 357 carries
         the command, the controls and the partition assertion.
       - **So if rule 2 gains an input test it must name THREE things, not
         two** — the inputs, the lane's own instrument, and **which lane**;
         a single window-level verdict cannot be right for all three lanes at
         once. If it is refused instead, the reason now has to cover a lane
         whose reading was unmovable on **two in five** windows, which is a
         different question from the 14.4% this item was filed on.

## Slice 349 — rule 3's text says "slices CLOSED"; its counter means "slices NAMED by a building row", and nothing has ever compared the two (2026-09-08)

**Found the way `LOOPS.md` says this counter is always found** — by a number
disagreeing with something a human had just written down, read immediately
after recording an iteration, which is that file's standing instruction. The
previous hand-off predicted: *"closing anything in a slice other than 324 or
347 does it"*. This wake closed **`325.1`, an ITEM**; Slice 325 stayed open on
`325.2`. The counter armed anyway, to `Objective 3 / 3 OVERDUE [324, 325, 347]`
— and **one of the three armed slices is open right now.**

1. [ ] **349.1 — rule 3 counts slices a building loop TOUCHED, not slices that
       closed, and the two have never been reconciled.** Step 2's rule 3 reads
       *"THREE OR MORE slices closed since the last Objective"*.
       `dispatch_status.py` never opens `ROADMAP.md`: it collects distinct
       slice numbers named by `CLOSES_A_SLICE` rows
       (`Continue`/`Standardize`/`Polish`) in `loop-log.md` since the last
       `Objective` row. A slice with one item closed and three still open
       counts exactly like a slice that finished.

       **Base rate measured before filing, per CLAUDE.md — it is not a
       hypothetical and it is not epidemic either:**

       ```
       python3 - <<'PY'
       import re,sys; sys.path.insert(0,'scripts/loops')
       from dispatch_status import ROW, slice_of, CLOSES_A_SLICE
       rows=[m.groups() for m in (ROW.match(l.rstrip()) for l in open('.roundtable/loop-log.md')) if m]
       named={slice_of(it) for _,lp,_,it in rows if lp in CLOSES_A_SLICE and slice_of(it)}
       cur=None; op=set()
       for l in open('ROADMAP.md'):
           h=re.match(r'^## Slice (\d+)',l)
           if h: cur=h.group(1)
           if re.match(r'^\s*\d+\. \[ \]',l) and cur: op.add(cur)
       print(len(named), len(named&op), sorted(named&op,key=int))
       PY
         #  258 distinct slices named by a building row
         #   12 of them (4.7%) are STILL OPEN in ROADMAP.md today
         #   -> 15, 112, 249, 273, 320, 325, 326, 328, 331, 332, 333, 339
       ```

       4.7% over the whole log, and **1 of 3 in the arming set live at this
       commit** — the rate that matters is the second one, because a rule with
       a threshold of three is decided by the marginal member.

       **This is the SIXTH shape of a rule-3 counter defect and the first that
       is not the parser.** The five in `LOOPS-archive.md` are all log
       conventions a regex missed; 279.4's is the loop SET. This one is the
       PREDICATE: every row parses correctly, every loop is the right loop, and
       the number still does not mean what the rule says. No widening of
       anything finds it — only comparing the counter against `ROADMAP.md`,
       which nothing does.

       **Which side is wrong is deliberately NOT decided here**, per CLAUDE.md's
       rule that a criterion names the property and never the verdict. Both
       readings are defensible: *closed* is what the rule says, and a grill
       wants finished material to find a pattern in; *touched* may be the
       better trigger, since three slices with work landed in them is arguably
       the same "enough material", and it is what every rule-3 dispatch to date
       has actually run on. **Finding that the counter is right and the TEXT should change
       is a fully satisfying outcome** — this item is not a bug report with a
       foregone fix.
       - **Accept:** the two are reconciled — either `dispatch_status.py` reads
         `ROADMAP.md` and counts closed slices, or rule 3's text in `LOOPS.md`
         is rewritten to say what the counter measures — **and whichever is
         chosen, the base rate above is re-measured at execution time** (the
         figures here are snapshots) and the decision records what the counter
         would have read historically under the other reading. A change that
         moves the live count must say what it moves it to and why that is
         right, not merely that it is now consistent.
       - **REPRODUCED UNPROMPTED on the very next wake (Slice 350,
         2026-09-08).** Recording that sweep took the counter to
         `Objective 4 / 3 OVERDUE [324, 325, 347, **350**]` — and Slice 350's
         only item, `350.1`, is **open**. So the arming set is now **2 of 4**
         open (325 and 350) where this item measured 1 of 3, and the newest
         member was armed by the row that filed an open question. Nothing was
         staged to produce it: the sweep was dispatched by rule 2 and read the
         counter afterwards, which is `LOOPS.md`'s standing instruction. It
         does not decide the item — a *touched* reading would count 350 too,
         and correctly — but it does show the divergence is live and growing,
         not a historical artefact of the 4.7% base rate.

## Slice 348 — `check:resume-slice-ids` reports a backticked DECIMAL FIGURE as a slice id, and files it under a heading that asserts an interpretation it cannot have earned (2026-09-08)

**Dispatched by rule 4** on `324.2` (Slice 324 above); this section carries the
one incidental finding, in the shape Slice 347 used for the same situation — a
defect surfaced by the wake's own recording step, in the advisory checks
`record_iteration.py` runs after the commit.

1. [ ] **348.1 — a kB figure in backticks is indistinguishable from a slice id
       by shape, and the "absent" bucket claims otherwise.** Recording this
       wake's iteration printed:

       ```
       3 named id(s) are not in ROADMAP.md at all — normally archived, not a finding: 15.0, 15.10, 312.2
       ```

       **One of those three is a slice id.** `312.2` is real and archived.
       `15.0` and `15.10` are the gzip figures `324.2` measured, written in
       backticks in `RESUME.md` (*"printing the same `15.0`"*, *"`check:size`
       prints `15.10`"*), and `NAMED_ID` matched them.

       **Reproducer: the committed `RESUME.md` at this slice's own commit.**
       `grep -o '`15\.10`\|`15\.0`\|`312\.2`' .roundtable/RESUME.md` → 2, 1, 1.
       It was deliberately NOT reworded to suppress the symptom.

       **The report line is the defect, not the match.** The check is careful
       about exactly this everywhere else — its CLOSED bucket says outright
       *"this check cannot tell the two apart — you can."* The ABSENT bucket
       instead asserts *"normally archived"*, which is a claim about what the
       string IS, and it is the one bucket that has no way to check: an id
       missing from `ROADMAP.md` is missing whether it was archived or was
       never an id.

       **A shape fix looks available and is not**, which is why this is filed
       rather than patched. Requiring a non-zero item number would drop `15.0`
       — item numbers start at 1, so no derived id ever ends `.0` — and it
       would keep `15.10`, because `15.10` is *well-formed*: Slice 15 is OPEN
       in this very file and its live items are numbered **11 and 12**, so a
       `15.10` would sit directly above them and read as perfectly ordinary.
       (Checked rather than assumed: no `## Slice 15` heading exists in
       `ROADMAP-archive.md` and no `15.10` occurs outside this wake's own
       prose, so the id is not live *and* not archived — which is precisely the
       state the ABSENT bucket cannot distinguish from a figure.) A decimal
       figure and a plausible slice id genuinely coincide, and no regex
       separates them. This is roadmap 94.11's rule: the checkable shape is
       exhausted, so either the report changes or nothing does.

       - **Accept** — the property: either the ABSENT bucket's wording no
         longer asserts an interpretation the check cannot verify (matching the
         hedge its CLOSED bucket already carries), **or** a recorded refusal
         saying why the current wording is right, with the base rate measured —
         how many of `RESUME.md`'s revisions this bucket has fired on, and on
         how many of those the named string was a real archived id versus a
         figure. **Finding the false-positive rate negligible and refusing is a
         satisfying outcome**, and is the reason the base rate is part of the
         criterion rather than an afterthought.
       - **Do not suppress it by changing how a wake writes numbers.** The
         figures belong in backticks; a convention that bans them to keep an
         advisory check quiet would trade a real document for a clean report.
       - Measure first, and one command answers it:
         `git log -p --follow -- .roundtable/RESUME.md` piped through the
         check's own `namedIn` export, per revision. `LOOPS.md` Step 0 records
         that this check fired on **8 of 86** revisions on 2026-08-29 — that is
         the denominator to re-derive, and whether those 8 were ids or figures
         is exactly what nobody has looked at.

## Slice 347 — rule 5's missing DIRECTION is refused, and the reason is not that it is hard to record: supplying it makes rule 5 fire on the one metric it can act on, and the log's own same-timestamp companion samples refute that verdict. `324.1` closed on its Accept's second branch (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 346 — Objective grill of Slices 322, 342: 20 of 22 assertions reproduce, and **both defects are a recurrence of something Slice 322 had just filed** — the next slice published a load-bearing number with no command, and the round closing its item missed the third copy of a correction because the phrase wraps (2026-09-08)

**Dispatched by rule 3**, cloud wake, at `Objective 4 / 3 slices OVERDUE
[320, 322, 323, 342]`. Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again a
**forced update** (`26447ba...6d6f5af`). Trap 2 clean in one `--unshallow`, no
`shallow.lock`, and it again brought the tags — `git tag | wc -l` → **8**, §2's
mandated count, run rather than assumed. Trap 1c respected: `CHROME_PATH`
exported in the same command as `scan:dead-style` and every browser-driven gate.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across the 30 open items. Step 1 read **both** intakes in the REST form with
`ENVIRONMENT.md` §8's controls (`/issues?state=open` → 200 len **1**, issue #2,
`updated_at` unmoved at `2026-09-06T15:10:34Z` for a **twelfth** consecutive
hand-off; `/discussions` → 200 len **0**; `/not-a-real-route` → **404**, the
control that makes the `200 []` mean *served and empty*) and triaged nothing, so
Step 1 committed nothing. Rule 2 `Standardize 0 / 4` did not match. **Rule 3
matched.** Rules 4-8 not reached; rule 5's line read `ok`, and no name in its
comparable set regresses on two consecutive day-pairs.

**Scope, per §6 step 0 — two of the four, and the drop is named.** Slices
**320** and **323** are each already the named subject of a 2026-09-07 grill
report, so they were dropped rather than re-grilled; **322** and **342** were
kept. Slice 322 is itself a grill, so this is a grill of a grill. Slice **345**
is in scope only as `342.1`'s closure — the round that met or missed the Accept
342 filed. Full report:
`.roundtable/grill-objective-322-342-2026-09-08.md`.

### The through-line: Slice 322 filed two rules about writing numbers down, and the two slices after it broke both

Neither defect touches a verdict — 342's refusal is right, 345's conversion is
right, and every number either turns on reproduces. What failed is the audit
trail, in the two specific ways the immediately preceding grill had named.

- **Defect A — the wrapped correction.** `161ede68` says **FOUR** in its
  subject, in Slice 345's heading and in its body, and **five** in the closing
  annotation the same commit wrote on `342.1`. Five is wrong under both readings
  345's own table supports (`14 + 10 + 10 + 4` from four lines, **plus three
  one-offs** = four idiom lines, or seven in total); the nearest true *five*
  counts **files**. The hand-off records two of the three sites being corrected —
  the third survived because `grep 'five source lines'` returns **0** on a
  phrase that wraps as `five source` / `lines`. That is `322.3`'s mechanism, one
  wake after Slice 343 refused a shared normaliser for it.
- **Defect B — the missing command.** Slice 342 wrote *"The refusal and the
  command are in the script's header"*; the header held the refusal, the number
  and *"Re-measure before assuming it still holds"*, and **no command**. So it
  asserted the fix for 322's Defect B in the same sentence that committed it.
  Re-measuring took a fresh instrument whose **first output was wrong** — a
  raw-text scan reads `1 of 30,485` on an HTML-entity `;` inside `url()` that
  the browser never sees. Decoded: **0 of 30,485** against the published 0 of
  30,483, so the refusal stands. Both corrected in place at Slice 342 per 236.2,
  originals struck, and the command has been **added** to the header and
  red-proved by injection (0 → 1).

**Five of this grill's own instruments were wrong on their first output, by
THREE different mechanisms** — and the split is stated because *"all of them the
same way"* was the first thing written and is false. **Two by the wrap**: the
greps used to find Defect A and to locate Defect B's text, which is the
strongest evidence `346.1`'s population is real. **One by a token boundary**:
`\bdocs-list\b` matches inside `docs-list-bare`, the exact bug 322's own report
names. **One by HTML entities**: Defect B's base rate. And **one merely scoped
differently** — a hand-written re-derivation of the `1,433` blast radius
returned 11 against the published 17, and what settled it in one run was that
Slice 322 *had recorded its command*, which returns the seventeen exactly. That
is the counterfactual Defect B destroys. Each was caught by reconciling against
a differently-shaped second reading before the number was used.

### What held — 20 of 22

**Slice 322 — 9 of 9**, several exact. The recorded blast-radius command returns
precisely the published seventeen; Defect B's corpus re-reads `2 + 8 + 0 = 10`
figures on 9 lines at `8beee329`; `322.2`'s correction survived the archive move
with both commands; `.docs-list` 59 / `.docs-list-bare` 40 at `7dacd80b~1` and
60 / 41 at `7dacd80b` reproduce exactly under a class-token matcher; `<Related`
116, `<ApiTable` 40, `data-api-notes` on 39 built pages; Slice 305's five named
classes ship and the two invented ones do not; `*gauntlet-a*` is still 0
commits; `--bo-space-0` still has no use but its definition. The 161
decomposition is verified in two terms of three — the `5 page-level sites` term
was not re-derived and is reported as such.

**Slice 342 — 6 of 8** (A and B are the failures): two verdicts per attribute,
`deadAttrLiveDecl` 0, the print branch still **6** at the declaration unit and
correctly unmoved by 345, the base rate, no importer of the scan, and the
red-proof probe absent.

**Slice 345 as `342.1`'s closure — 5 of 5, exact.** The re-run reads
`11 dead declarations on 9 pages`, `1,854 → 1,813` (−41), `357 → 345` (−12),
attributes `1,365 → 1,365`, and the eleven it names are the eleven refused, item
for item — the check 345 said was stronger than the arithmetic, and it is. Its
lane-3 claim holds too: `/patterns/output-form/` **is** one of 158.1's twelve, so
`LOOPS.md`'s enumeration was owed no amendment and correctly received none.

1. [x] **346.1 — Slice 343 refused a whitespace normaliser on a caller census of
       counting INSTRUMENTS. The failure recurred the next wake in a population
       that census did not measure: a wake's own grep checking that a correction
       it just made landed everywhere.** 343's refusal stands on its own terms
       and is **not reopened** — 1 of 14 published phrase-counts changes, and a
       helper module still has no importer. What is unmeasured is the *other*
       use: Defect A above, plus three of this grill's own four instruments,
       are all a hand-check rather than a published count, and all four missed a
       wrapped phrase. n = 4 in one wake is a rate, not a base rate.
       - **Accept** — the property, not a prediction: **measure the base rate
         first** (94.11), over the record rather than over this wake. For each
         commit that strikes or supersedes a number in `ROADMAP.md`, check
         whether the superseded spelling still occurs elsewhere in that file **at
         that commit**, whitespace-normalised. Report the count with the command
         beside it. **If it has happened once or twice, recording the refusal
         with the number is a satisfying outcome** and nothing is built; if it is
         common, the cheap thing is a `scripts/loops/` check a wake runs before
         committing a correction — not a gate.
       - **Not a gate, decided rather than deferred.** *"This correction was
         applied everywhere it should be"* is semantic in the general case
         (94.11), and 343 already refused the shared-normaliser shape. The only
         checkable form is the narrow one above: a struck spelling that still
         occurs in the same file at the same commit.
       - **DONE 2026-09-24 — common, so the cheap check is built; the wrap is
         not the mechanism.** Of 1,062 commits touching `ROADMAP.md`, 231 add a
         line naming a correction; read one by one (workflow `wf_b0aaa4ba-d7e`,
         5 readers + 5 adversarial verifiers, each old spelling run through a
         whitespace-normalised, strike-aware count of the file AT that commit),
         **59 supersede a numeric claim** (a lower bound: the verifiers' 24
         spot-checks found 8 more, none with a stale copy) and **13 of the 59
         left one standing: 17 sites, all surviving verification.** Only **2 of
         the 17** hide behind a wrap; the other 15 sit in a heading, a DONE line
         or another slice, where a plain line grep finds them. So 343's refusal
         of a normaliser stands on this evidence too, and what was missing is
         being shown the other copies.
         `scripts/loops/check_correction_sites.py` does that: it reads a
         commit's (or the working tree's) change, finds the numbers it
         superseded — replaced, struck, quoted in a correction, or "M, not N" —
         and lists every other unstruck occurrence at that revision. Replayed on
         the 13 commits it lists **11 of the 17** from the diff alone and **16**
         with `--old "<old value>"` (the 17th restated "50 claims" as "50
         checked"); on the last 150 commits it reports on 36, printing a median
         of 5 sites. `--self-test` passes, and five mutations each make it fail.
         It runs from `record_iteration.py` as a fourth REPORTED advisory, and
         LOOPS.md tells a wake to run it before committing a correction. Not a
         gate, as decided above.
         **Found while measuring:** the strike mask crossed blank lines, and
         23 unbalanced `~~` in `ROADMAP-archive.md` hid lines 39,366-50,080;
         bounded to a paragraph (GFM), and re-running the 8 affected commits
         changed no reading. **16 of the 17 stale copies were still standing
         at HEAD** (the "4,429" had been rewritten since) and now carry a
         `Corrected by 346.1` note: 17 notes, 5 here and 12 in the archive,
         three of them headings kept identical to their archived twins.
         **Not covered:** corrections recorded only in other files, and
         supersedes the readers judged non-numeric. Jev: supported (A 0.95,
         B 0.89).

**Gates: all 17 cloud-runnable entry points green** on the committed tree, the
list re-derived from `ci.yml` rather than read off a snapshot.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed by this slice**, and that is structural
rather than a judgement call: the diff is `ROADMAP.md`, the grill report, the
hand-off, and a **comment-only** change to `apps/docs/scripts/scan-dead-style.mjs`
— a script that is not a build step, not a gate and not imported anywhere,
re-verified this wake by the same command Slice 342 used. No CSS rule, no docs
page and no component changed, so nothing rendered can move. **Slice 345's two
visual debts are still owed** — `/patterns/output-form` in print, and the RF tile
grid on `/patterns/rf/rf-landing-rf/` at both widths — as are the six older ones.

## Slice 345 — Standardize sweep, 4 of 4 lanes. 342.1 closed with a verdict per SITE: **38 of the 52 dead declarations came from FOUR source lines**, and the eleven that remain are the eleven that were refused — the re-run lands on exactly the refusal set, not merely on the arithmetic (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE` — the
counter the previous hand-off predicted, re-read this wake rather than trusted.
Rule 1 found no P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across
30 open items); rule 3 was `Objective 3 / 3 OVERDUE [320, 322, 323]` and is
evaluated **below** rule 2, so the grill waits one more wake. Cloud wake. Step 0:
container **DETACHED** again (trap 1), fixed with `git checkout -B main
origin/main` before any commit; trap 2 clean in one `--unshallow`, tags again
arrived with it (`git tag | wc -l` → **8**, run rather than assumed). **No
collision** — the pre-commit `git fetch origin main` found `origin/main` unmoved
at `c369b054`.

**Step 1 — both intakes read, with the controls `ENVIRONMENT.md` §8 names:**
`/issues?state=open` → HTTP 200 len **1**; `/discussions` → HTTP 200 len **0**;
`/not-a-real-route` → **404**, the control that makes the `200 []` mean *served
and empty*. Issue #2's `updated_at` is still `2026-09-06T15:10:34Z` — an
**eleventh** consecutive hand-off with no movement. Nothing new to triage, so
Step 1 committed nothing.

### The three lanes with no finding, one line each

- **Lane 2 of 4 — `report:css-repeats`: no delta.** 74 files · **242** rules with
  3+ declarations · **230** distinct bodies · **8** bodies repeating, against the
  recorded `237 / 225 / 8` of 2026-08-28. Rules and distinct bodies both moved
  +5, so the five new rules are five new *bodies*: **no group is new and no group
  grew.** All eight match the settled table in `LOOPS.md` member-for-member,
  the x4 joined-control radius reset still two components rather than four.
- **Lane 3 of 4 — `report:prose`: every flagged page carries a verdict.** The
  flagged union is **15** pages (10 over the corpus 2x, plus `/base/motion/`,
  `/concepts/layouts/`, `/concepts/js-behaviors/`, `/concepts/design-language/`,
  `/concepts/scale/` over a family 2x). Checked against the ENUMERATION the lane
  mandates — 158.1's twelve, 161.1's three, 178.3's `/concepts/scale/` — all 15
  are members; `/patterns/output-form/` is the sixteenth verdict and is no longer
  flagged. **No page carries no verdict**, so nothing to record.
- **Lane 4 of 4 — `report_loop_prose.py`: no file changed accumulate class.**
  The `ratchet` block reads `LOOPS.md 1 up, last cut f9e0f17d (2026-09-07)`; the
  dispatch region is **7,548** words, 42.0% of the file, still growing faster
  than the file. That is a rising number and **not a regrowth reading** until
  attributed per section (308.1/339.1) — not attributed this wake, and said so
  rather than concluded. `339.1` is open and owns that question.

### Lane 1 of 4 — `scan:dead-style`, and it IS the finding: `342.1`

The scan opened at **52 dead declarations on 13 pages** (1,365 live attributes,
1,854 declarations, 357 multi-declaration). 342.1's Accept asks for a verdict per
site and a reconciled re-run, so the first thing built was the per-site view the
shipped scan does not print: a throwaway probe copying its verdict logic verbatim
and emitting one row per site. **It reconciles at 52 rows against the scan's 52**
before any verdict was written — the instrument check, taken first.

**41 CONVERTED, and 38 of them come from FOUR source lines** — counted rather
than rounded: 14 + 10 + 10 + 4 sites from one line each, fanned out by a `map()`
or a shared component, plus **three one-off lines** on `/patterns/output-form`.
That ratio is the shape of the finding: this was never 13 pages of drift, it was
four idioms multiplied by their generators and one page with three of its own.

| n | site | source | why it was dead |
|---|---|---|---|
| 14 | `color: var(--bo-color-accent)` on every app tile's mark | `AppTile.astro:43` (`MARK`, inherited by `BOX`) | the component renders its OWN `<a class="bo-widget">` one line below, and the framework reset carries `a { color: var(--bo-color-accent) }` (`reset/index.css:73`). Measured in **both** themes: icon and its `a.bo-widget` parent read `rgb(15,118,110)` light and `rgb(45,212,191)` dark. `app-launch.astro`'s copyable `<pre>` sample carried the same declaration and moved in the same commit, so the demo and the markup a reader copies do not diverge |
| 10 | `margin: 0` on the payload `<ul>` | `reference/events.astro:44` | restates the reset's `* { margin: 0 }` — the original sweep's own headline case |
| 10 | `display:inline-block` on the spacing swatch | `reference/tokens.astro:153` | the swatch is a flex item of `.bo-cluster`, so it is blockified; computed `display` reads `block` either way |
| 4 | `display: block` on the task label | `RfTaskMenu.astro:33` | flex child of `a.bo-widget`. Its `color: var(--bo-color-text-primary)` on the same attribute is **live** and stays — it opts the label OUT of the reset's link accent |
| 3 | `margin: 0` ×2, `padding: 0` ×1 | `patterns/output-form.astro` | restatements of the reset / a `<div>`'s own default, measured dead in **screen AND print** — which is the whole reason this scan emulates both media |

**11 REFUSED, each with the measurement that refuses it.** These are not "not
got to"; every one is dead *here* and load-bearing somewhere the scan cannot see:

- **3 · `color` on `PatternPreview.astro:35`'s tile fragment** — the accent
  originates at an `a.bo-widget` **outside** the fragment, supplied by
  `patterns/index.astro:28`. The ancestor chain was walked to establish that,
  in both themes. A caller that does not wrap it in a link loses the colour.
- **3 · `inline-size: 100%` on the demo widget** (`amount`, `byline`,
  `progress`) — dead only against `section.demo`'s flex stretch. The identical
  `inline-size: 100%; max-inline-size: 24rem` idiom on `patterns/login.astro:31`
  is **not** reported dead, which is the discrimination: the pair is the portable
  form and the docs container is what makes it redundant. [**Corrected by
  Slice 379:** the reason is false, and was when written. The three are dead
  in plain block flow too (288 → 288, 384 → 384, 256 → 256 px), and login's
  rule is not identical: it adds `margin-inline: auto`, which is what makes it
  live, and only inside a flex or grid parent. The verdict to keep them
  stands: they are the portable half of the pair, live wherever a flex or
  grid parent does not stretch the widget, which is login's case.]
- **1 · `margin-block-start` on combobox's static listbox** — the component's own
  copy sits inside `@supports (anchor-name: --a) and (anchor-scope: --a)`
  (`combobox.css:55-69`). Dead in a browser that supports anchor positioning;
  **live on the fallback path**, which is exactly where the demo has to hold up.
- **1 · `align-items: center` on state-patterns' skeleton** — it is inside
  `const skeletonCard`, rendered through `<Demo code={skeletonCard} />`. 292.8's
  rule: a declaration inside a copyable template literal is out of scope.
- **1 · `display: inline-block` on `/base/motion`'s spinner** — dead only because
  `section.demo` is a flex container; it is what makes `.bo-motion-spin` transform
  in ordinary inline flow, which is the case a reader will actually have.
- **1 · `block-size: 2rem` on `AppTile`'s `BOX`** — the box exists to PIN the
  mark's height when there is no icon glyph. It is dead only because the current
  glyph happens to be exactly 2rem tall, and AppTile's own comment already ties
  its `font-size: 2rem` and this `block-size` together.
- **1 · `inline-size:var(--bo-space-0)` on the zero swatch** — the generated
  uniform form of the other nine, and the swatch's SUBJECT is the token's width.
  Zero is the value being shown; special-casing it out of the `map()` would make
  the one swatch that means "no space" the one swatch that declares nothing.

**The reconciliation is the part worth keeping, and it is stronger than the
arithmetic.** The re-run reports **11 dead declarations on 9 pages** — `52 − 41`,
which any miscount would also satisfy — but the eleven it names are, item for
item, the eleven refused above: `3× inline-size: 100%`, `3× color`,
`1× display: inline-block`, `1× margin-block-start`, `1× align-items: center`,
`1× block-size: 2rem`, `1× inline-size:var(--bo-space-0)`. Two independent
totals move with it: declarations inside live attributes **1,854 → 1,813**
(−41, one per conversion) and multi-declaration attributes **357 → 345** (−12,
exactly the conversions that left a single declaration behind — the ten event
lists and output-form's two). Attribute count is **1,365 → 1,365**: no attribute
was emptied, so nothing became a `style=""` for the next sweep to trip over.

**Verified against the RENDERED artefact, not the diff** (CLAUDE.md's bulk-edit
rule): the built site was rebuilt from a cleared `dist` and re-scanned in a real
browser, and the whole-tree gates that assert layout properties — `check:layout`
(128 pages, no overflow at 390 or 150% zoom), `check:scroll` (914 containers) and
`test:axe` (128 × 2, zero violations) — all pass. **The edits were made by hand,
one block at a time**, never by regex, because four of the five files mix live
markup with copyable samples.

**One cost, recorded rather than smoothed over.** The first attempt at the
`events.astro` comment put a `{/* … */}` block **inside a ternary expression**,
which is not a children position; `astro build` failed with
`Expected "}" but found "$$render"` pointing at a line 11 below the edit. Caught
by the build, not by review — the sibling of the compiler trap `ENVIRONMENT.md`
already carries about hoisted imports.

1. [x] **345.1 — should `.bo-motion-spin` own its `display: inline-block`?**
       Raised by lane 1's refusal above and NOT built here — a component CSS
       change is not a Standardize-sweep edit. The utility only works on a
       transformable box, so every consumer who puts it on an inline `<span>`
       must add the declaration by hand; `/base/motion`'s own demo does, and it
       reads dead there only because the demo section is a flex container. That
       is the Objective's first accept test verbatim — *it lets a consumer delete
       code*.
       - **Accept:** a decision recorded either way. If it moves into
         `motion.css`, `/base/motion`'s inline declaration goes with it and
         `scan:dead-style`'s remaining count agrees with whatever the change
         makes true. If it is refused, the reason names what an inline-block
         default would break for a consumer who wants a block or flex spinner.
         **Refusing is a satisfying outcome.**
       - **DONE 2026-09-24 — moved in.** The page's own copyable recipe (a bare
         `<span class="bo-motion-spin">`) did not rotate in ordinary flow — and
         its COMPUTED `transform` animated all the while, so a computed-style
         check passes a spinner that never turns; the box's bounding rect is
         what shows rotation (1 distinct rect in 6 samples before, 5-6 after).
         A consumer wanting a block or flex spinner keeps their own `display`
         (unlayered author CSS beats the utility layer); a rotating box should
         shrink-wrap its glyph anyway. The demo's inline declaration went with
         it: `scan:dead-style` 11 on 9 pages -> **10 on 8**, that declaration
         exactly. **Found beside it:** the live demo span was a stretched flex
         item, 342px wide, so its glyph orbited the box's centre (true before
         and after); the demo is now inside a `<p>` as the claim case pastes
         the recipe, 0px glyph drift, live at 1440/390 light/dark.
         [**Corrected by Slice 379:** the demo box is **16×36px**; "32-36px"
         was one read of the rotating rect, which spans 16-40px. The drift
         figure holds, but only when measured by the glyph's text Range: the
         bounding-rect centre reads 0 on the old orbiting demo too, so it cannot
         fail. The demo also carries a font size the recipe does not.]
         `check:claims` +1 (the pasted recipe visibly rotates), red before.
         CHANGELOG entry. Jev: supported 0.94 (A 0.98, B 0.92).

**Gates: all 17 cloud-runnable entry points green** on the committed tree, plus
`check:selftests` (55 gates: 21 heuristic, 34 exact), `check:viewport-forks` and
`check:vendor-names` run directly at its real path (**614** files — a passing
gate, not a census; the walk includes `examples/` installs).

**NOT VERIFIED, said plainly.** No 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **This commit changes rendered pages**, so unlike the last
two wakes it does carry visual debt, and it is named rather than implied: five
docs sources changed (`AppTile.astro`, `RfTaskMenu.astro`, `events.astro`,
`tokens.astro`, `output-form.astro`, plus `app-launch.astro`'s sample). Every
removal is *proven* computed-style-neutral by the instrument that found it — in
screen and print, and for the accent colour in light and dark — and the three
whole-tree browser gates pass, so nothing measurable moved. What a cloud wake
still cannot do is LOOK at `/patterns/output-form` in print or at the RF tile
grid. **A local wake should glance at those two.**

## Slice 344 — 323.1: the two base-rate replays keep their different units, because the unit follows the LIFETIME of the state counted, not the unit the predicate compares — and the date replay reports the one verdict SKEW exists to soften on 2 of the 8 dates it is blind on (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 343 — 322.3: a whitespace-normalising helper is REFUSED on the base rate and on a caller count of zero — 1 of 14 published phrase-counts changes, and the two consumers that could have needed it were already safe (2026-09-08)

**Dispatched by rule 4** on `322.3`, the oldest still-open cloud-takeable item,
cloud wake. Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md`
reads **0** across the 32 open items. Step 1 read **both** intakes with
`ENVIRONMENT.md` §8's controls in one run (`/issues?state=open` -> 200 len **1**,
issue #2, `updated_at` unmoved at `2026-09-06T15:10:34Z` for a **ninth**
consecutive hand-off; `/discussions` -> 200 len **0**; `/not-a-real-route` ->
**404**) and triaged nothing: no new input, so Step 1 committed nothing. Rule 2
`Standardize 2 / 4` did not match; rule 3 `Objective 1 / 3 [320]` did not match.
Rules 5-8 not reached. Pre-commit `git fetch origin main` found `origin/main`
unmoved at `dd69b3e5` — **no collision this wake**.

### The answer: REFUSE, on three measurements rather than one

322.3's Accept set the fork on the base rate — *if few change, a helper is
ceremony and recording the refusal with the number is a satisfying outcome; if
many do, ship one shared normaliser in `scripts/loops/` and name its callers.*
Few change, and the second half of that sentence turns out to be the stronger
refusal: **there are no callers to name.**

**1 — the base rate. 1 of 14 re-derivable published phrase-counts changes, and
it is the known defect the item was filed for.**

**Read at `dd69b3e5`, the parent of this commit, and the revision is named
because `327.2`'s effect fires here too**: writing the table below adds two
fresh occurrences of its own lane-C phrase, so the same run against this commit
reads **5 / 10** rather than 3 / 8. **The Δ is unchanged at +5 and so is every
verdict** — but a wake re-running the command and getting 5 / 10 cannot
otherwise tell a moved corpus from a mistake.

| lane | line | ws | Δ | phrase |
|---|---|---|---|---|
| A recorded-command | 10 | 10 | +0 | `without folding` |
| A recorded-command | 9 | 9 | +0 | `RECURRENCE HISTORY` |
| A recorded-command | 7 | 7 | +0 | `closed slices carrying` |
| A recorded-command | 1 | 1 | +0 | `5 of 6` |
| B prose page-path | 18 / 10 / 8 / 7 / 4 / 3 / 3 / 37 / 11 | = | +0 | the nine page paths Slices 326/327/339 count |
| C known defect | 3 | **8** | **+5** | `1,433 live inline declarations` |

- **9 of the 14 count an identifier with no whitespace** — a page path — and
  therefore *provably* cannot differ. Measured rather than asserted from the
  property, which is why they are in the table.
- **5 could differ; 1 does.** The four lane-A phrases are also 0-of-4 when
  re-run at their own publishing revisions (`git blame` -> `83192cd1`,
  `7e861867` x3), not only at `HEAD`.

**2 — the caller count is zero, and that is what settles it.** Twenty files
name the corpus; the ones that actually count over it are all safe already:

- every other consumer is a **line-anchored structural parse**
  (`generate_status.py`, `roadmap_scope.py`, the rule-1 P0 check — **41 of the
  62** recorded grep sites at `dd69b3e5`; this slice's own dispatcher trace
  makes it 42 of 63, same self-contamination as the table), where line-based
  *is* the correct semantics, because it is counting lines;
- `check-slice-refs.mjs` matches `/\broadmap\s+(\d{1,3}…)/gi` against
  **whole-file text**, and `\s` spans a newline. It is not accidentally safe —
  it demonstrably catches the **7 of 149** citations a per-line form misses
  (`ROADMAP-archive.md` 66 -> 68, `LOOPS.md` 48 -> 53);
- `report_reopen_conditions.py`'s needle is four **single words**
  (`reopen|re-open|re-raise|revisit`), which cannot straddle anything.

A shared normaliser in `scripts/loops/` would be a module with no importers,
which is 94.11's ceremony test failing on the first question it asks.

**3 — the failure is RARE but SEVERE, and saying only "rare" would be the
misleading half.** On the one case that does change, an independently-shaped
re-derivation (120-character window, attributed to the containing `## Slice`)
reads **12 slices line-based against 19 whitespace-normalised** — the per-line
form misses **7, i.e. 37%**. That is why the answer is a practice note and not
a shrug. The membership differs from Slice 322's published 17 because the
window is wider and now includes the corrective slices themselves; **322's
figure is not contradicted here**, and it cannot be, for exactly the reason
`327.2` names — recording a count changes what it measures.

### The reusable half: this wake's own harvester had the bug

Third instance in three days, and found the same way `LOOPS.md` says this class
always is — an instrument disagreeing with something already written down. The
first harvest was a per-line scan for recorded greps and read **58** sites; the
same regex over the whitespace-normalised text reads **62**. It missed **4 of
62 (6.5%)** — named rather than counted, since a line number here goes stale
the moment this slice is inserted: the two `^## Slice … Objective grill of …`
heading greps (one per file, both wrapping between the pattern and its target
list) and two rule-1 P0 greps in the same shape. Corrected before any figure
above was taken.

**The instrument is red-proved by discrimination**, not by a bare pass: it
reports `DIFFERS +5` on the known positive (`1,433 live inline declarations`),
and `same` on two negatives — a wrappable phrase that happens not to wrap
(`closed slices carrying`, 7/7) and a phrase with no whitespace at all
(`ROADMAP-archive.md`, 409/409). A comparator that returned "same" everywhere
would have been indistinguishable from a passing run.

### The command, which is the thing both defects lacked

```
# count a literal phrase over the corpus both ways; Δ≠0 means the phrase wraps
python3 - "$PHRASE" <<'EOF'
import re, sys
p = sys.argv[1]
for f in ("ROADMAP.md", "ROADMAP-archive.md"):
    t = open(f, encoding="utf-8").read()
    lb = sum(l.count(p) for l in t.split("\n"))
    wn = re.sub(r"\s+", " ", t).count(re.sub(r"\s+", " ", p).strip())
    print(f"{f:20} line={lb:4} ws={wn:4} {'DIFFERS' if lb != wn else 'same'}")
EOF
```

**Take any multi-word phrase-count this way.** The rule that falls out of the
table is sharper than "normalise everything": a count of an **identifier**
(a page path, a class, a slice id) is safe per-line and 9 of 14 published
counts are of exactly that; a count of a **phrase with a space in it** is not,
and is the only case worth the second reading.

1. [x] **343.1 — 322.3 answered: refused, with the base rate (1 of 14; 1 of 5
       wrappable), the caller count (0), and the severity on the one case that
       changes (12 vs 19, 37% missed).** The command is recorded above and is
       re-runnable in seconds, which is the omission both motivating defects
       shared.

**Gates: all 17 cloud-runnable entry points green** on the committed tree.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed by this slice**, and that is structural
rather than a judgement call: the diff is **markdown only** — `ROADMAP.md` and
the hand-off. No CSS, no `.astro`, no script and no docs page changed, so no
rendering can move. The visual debts carried forward are unchanged and unspent.

## Slice 342 — 320.2: `scan:dead-style` judges each declaration on its own, and the blind spot was not empty — **52 dead declarations** were hiding behind live siblings, invisible to every sweep that has ever read this instrument (2026-09-08)

**Dispatched by rule 4** on the oldest still-open cloud-takeable item, cloud
wake. Step 0: container **DETACHED** again (`git branch --show-current` empty),
`ENVIRONMENT.md` trap 1, fixed with `git checkout -B main origin/main` before
any commit; `origin/main` again arrived as a **forced update**
(`26447ba...e214bd7`). Trap 2 clean in one `--unshallow`, no `shallow.lock`,
and it again brought the tags — `git tag | wc -l` -> **8**, §2's mandated count,
run rather than assumed. Trap 1c respected: `CHROME_PATH` exported in the same
command as every browser-driven gate.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` -> **0**.
Step 1 read **both** intakes with `ENVIRONMENT.md` §8's controls
(`/discussions` -> 200 len **0**; `/not-a-real-route` -> **404**;
`/issues?state=open` -> 200 len **1**, issue #2, `updated_at` unmoved at
2026-09-06T15:10:34Z, already triaged) and triaged nothing: no new input.
Rule 2 `Standardize 1 / 4` did not match. Rule 3 `Objective 0 / 3` did not
match — spent by Slice 341. **Rule 4 matched.** Rule 5 was not reached, and its
line reads `ok` rather than STALE for the first time in a while: the comparable
set carries `dispatch-region-words 7298 -> 7492`, a **single** pair, and one
pair cannot fire a rule that needs two consecutive.

**The archive sweep was evaluated and declined, on the trigger the last two
sweeps actually used.** `roadmap_scope.py` at `e214bd7d` reports closed-history
share **2,946 / 8,908 = 33.1%** with 13 eligible targets. 252.1 dispatched the
tenth sweep at **55.1%** and 272.1 the eleventh at **56.7%**; 279.3 declined the
twelfth at **40.6%**. 33.1% is below every one of those, so sweeping here would
be a wake lowering the threshold by its own initiative — which is precisely what
`249.12`, the open **OWNER OR ARCHITECTURE CALL** on the archival trigger,
exists to prevent. Re-run the script; these are snapshots and this commit moves
them.

### What 320.2 asked for, and what it turned out to be worth

The scan's verdict joined every property an attribute names into ONE string, so
an attribute was dead only if **all** of its declarations were. Slice 320
red-proved the gap on injected controls and filed it rather than building it,
because closing it moves a headline number that (per Slice 322's correction)
**17 sweeps had quoted** — 208 through 314, none of them correctly. There are
now two verdicts per attribute:

- the **attribute** verdict, byte-for-byte the old logic, so the series stays
  comparable;
- the **declaration** verdict — drop one declaration, leave the siblings in
  place, and read back only the properties that declaration names.

**The finding is that the blind spot was not empty.** 320.2's Accept says
outright that *"finding that the gap yields zero real dead declarations is a
satisfying outcome"*. It does not:

```
before   0 dead style attribute(s) on 0 page(s); 1365 live; 1854 declaration(s); 357 multi
after    0 dead style attribute(s) on 0 page(s); 1365 live; 1854 declaration(s); 357 multi
         per declaration — 52 dead declaration(s) on 13 page(s)
         reconciliation — 52 of those sit in 50 attribute(s) the attribute verdict
                          calls LIVE, out of 357 multi-declaration attribute(s);
                          0 dead attribute(s) hold a declaration that reads live alone
```

**The reconciliation is against the re-measured corpus, not against the number
this item was handed.** 320.2 cites *"the 273 attributes named above"*; 273 was
Slice 320's reading on 2026-09-07 against 1,272 attributes, and the tree has
moved since — today it is **357 of 1,365**, which Slice 332's grill independently
recorded as `0 dead / 1,365 live / 357 multi` on the same corpus. Reconciling
against the stale 273 would have been the *"reconciles against its own caller"*
failure CLAUDE.md's storage doctrine names.

Two internal checks hold, and both could have failed:

- **All 52 sit inside live attributes.** They must, and it is checked rather
  than assumed: a dead declaration in a *single*-declaration attribute would
  make that attribute dead, and the attribute count is still **0**.
- **`deadAttrLiveDecl` is 0** — no attribute that reads dead as a whole holds a
  declaration that reads live alone. That disagreement is possible in principle
  and is now reported rather than waved away.

**Reconciled against an independent count before quoting** (CLAUDE.md), and the
first instrument for it was wrong, which is the base rate arriving on schedule:
a per-page grep was written that conflated the *global* `by dead declaration`
tally with the *per-page* list, and reported `raw=0` against `scan said 10`.
Corrected to a whole-`dist` declaration census, every dead count is bounded above
by what is actually present:

| declaration | present in `dist` | called dead |
|---|---|---|
| `display:inline-block` | 10 | 10 |
| `color: var(--bo-color-accent)` | 19 | **17** |
| `margin: 0` | 12 | 12 |
| `display: block` | 7 | **4** |
| `inline-size: 100%` | 6 | **3** |
| `inline-size:var(--bo-space-0)` | 1 | 1 |
| `display: inline-block` | 1 | 1 |

**The three splits are the discriminating evidence, not the three matches.** The
same declaration text is dead in some places and live in others, which is what a
per-*element* verdict must produce; had every row read `dead == present`, that
would be the "identical value across many inputs" tell this repo treats as a
defect until proven otherwise.

**The print branch also stopped reading as a branch that never runs.** At the
attribute unit it reports **0** dead-on-screen-but-live-in-print, every sweep,
forever. At the declaration unit it reports **6** — the same both-media rule,
finer input, and the first non-zero this instrument has produced there.

### The red-proof, and it is precise rather than broad

Per the standing rule that a green red-proof is a defect in the injection, the
injection was verified before the result was believed: a throwaway copy of the
script in `apps/docs/scripts/` had its per-declaration verdict replaced by the
attribute one, with the target's occurrence count asserted as exactly **1**
before the replace and the marker asserted present after.

```
- mixed control's dead declaration read live — 'margin: 0' inside
  'padding: 40px; margin: 0' → dead=false. This is exactly what judging the
  attribute AS A WHOLE produces (roadmap 320.2)                          rc=1
```

**Exactly one of the five controls failed** — the live control, the dead
control, the mixed attribute and the mixed live declaration all still passed.
That matters because `ENVIRONMENT.md` already carries the sibling trap: *a
red-proof that goes red TOO BROADLY certifies nothing either*. The probe file
was deleted and its absence confirmed (`ls apps/docs/scripts | grep -c redproof`
-> **0**, `git status --short` showing only the one modified file).

The mixed control is `padding: 40px; margin: 0` rather than Slice 320's
`margin: 40px; padding: 0`, deliberately: `margin: 0` is dead for a reason this
script's **existing** dead control already proves (the reset's `* { margin: 0 }`),
whereas a `<p>`'s zero padding is an assumption about the docs cascade that
nothing here had tested.

1. [x] **342.1 — DONE 2026-09-08 (Slice 345). 41 converted from ~~five source
       lines~~ FOUR source lines plus three one-offs, 11 refused per site, and
       the re-run lands on exactly the refusal set. The 52 are a lane-1
       finding, not this item's to spend.**

       > **CORRECTED 2026-09-08 by Slice 346 (Objective grill): "five source
       > lines" is wrong under both readings Slice 345's own body supports**,
       > and it was written by the same commit (`161ede68`) whose subject,
       > heading and body all say **FOUR**. 345's table decomposes the 41 as
       > `14 + 10 + 10 + 4` from four lines, **plus three one-off lines** on
       > `/patterns/output-form` — so the honest count is four idiom lines, or
       > seven lines in total. Neither is five. The nearest true "five" in that
       > slice counts **files**, not lines (its NOT-VERIFIED block), which is
       > what makes this read as a conflation that outlived the correction.
       >
       > **Why the hand-check that fixed the other two sites missed this one:**
       > the phrase wraps here as `five source` / `lines`, so a line-based
       > `grep 'five source lines'` over `ROADMAP.md` returns **0** while the
       > text is plainly there. That is `322.3`'s mechanism exactly, one wake
       > after Slice 343 refused a shared normaliser for it — correctly, on a
       > caller census of counting *instruments*, which is a population this
       > use is not in. Filed as `346.1`; **343's refusal is not reopened.**
       >
       > **Read at `6d6f5af`, the parent of this commit — and NO figure for
       > *this* commit is published, deliberately.** `327.2`'s effect fires
       > here in its strongest form: this correction, and Slice 346's entry
       > about it, both contain the phrases they count, so every attempt to
       > state the current value changes it. Two were written and both were
       > stale before the edit finished (`3 4` → `5 5` → `6 5`), which is the
       > regress, not three mistakes. **The property is stable and the value is
       > not:** whitespace-normalised sees every occurrence, line-based misses
       > exactly the wrapped one — at `6d6f5af` that is the *only* occurrence,
       > so it sees **0 of 1**. Re-run against a named revision, never the tree.
       >
       > ```
       > git show 6d6f5af:ROADMAP.md > /tmp/r.md
       > python3 -c "import re; s=re.sub(r'\s+',' ',open('/tmp/r.md').read()); \
       >   print(s.count('five source lines'), s.count('FOUR source lines'))"
       > #  1 2        whitespace-normalised
       > grep -c 'five source lines' /tmp/r.md   #  0   <- the miss
       > grep -c 'FOUR source lines' /tmp/r.md   #  2
       > ```
       `scan:dead-style` is a report the Standardize sweep consumes; 320.2 was
       scoped to the instrument, and fixing 13 pages inside it would mix an
       instrument change with a corpus change in one commit and widen the item.
       The 52 need judgement per site, not a regex: `/reference/tokens/` and
       `/reference/events/` are generated swatch/table pages, and 292.8's rule
       puts a declaration inside a copyable template literal out of scope.
       - **Accept:** lane 1 of the next Standardize sweep records a verdict for
         every dead declaration the scan reports — converted, or refused with a
         reason — and the re-run count is reconciled against the count it
         started from. **Finding that most are out of scope is a satisfying
         outcome** if it carries the per-site reasons.

**Refused inside this round, measured rather than argued:** a depth-aware
declaration splitter, so a `;` inside a `url()` or a quoted value cannot break
the parse. Base rate first, per 94.11: **0 of 30,483** style attributes in the
built site carry one, so the predicate distinguishes nothing today, and shipping
it would move a headline number for a case that does not exist. ~~The refusal and
the command are in the script's header so the next wake re-measures instead of
rebuilding it.~~

> **CORRECTED 2026-09-08 by Slice 346 (Objective grill): the refusal was in the
> header; the COMMAND was not.** What `scan-dead-style.mjs` carried was the
> number and the sentence *"Re-measure before assuming it still holds"* —
> `grep -nE '30,?483|python3|node -e|grep -r' apps/docs/scripts/scan-dead-style.mjs`
> returns the one line holding the figure and nothing else. So this slice
> asserted the fix for Slice 322's **Defect B** — *a load-bearing number with no
> command beside it* — in the same sentence that committed the defect, one
> slice after that grill filed it.
>
> **The cost is demonstrated rather than argued.** Re-measuring needed an
> instrument written from scratch, and its first output was **wrong**: a
> raw-text scan reports **1 of 30,485**, because `/components/icon/` carries
> `--bo-icon-src: url('data:image/svg+xml,<svg xmlns=&quot;…')` and the `;`
> closing `&quot;` sits inside the `url()` in the file text, while the browser —
> the unit this script actually splits — never sees it. Decoded, the figure is
> **0 of 30,485** against the published 0 of 30,483. **The refusal itself
> stands**; only the claim about where to find its command does not.
>
> **Fixed rather than only recorded:** the command is now in that header, with
> the entity trap named, and it was red-proved by injection before being written
> down — injecting `url(data:image/svg+xml;base64,…)` into one built page takes
> it from 0 to 1, so it is a detector that can fail rather than one that reports
> a clean tree because it cannot see.

**Gates: all 17 cloud-runnable entry points green** on the committed tree.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed**, and that is structural rather than a
judgement call: the diff is one `.mjs` scan script that is not a build step, not
a gate, and not imported anywhere. Checked rather than asserted —
`grep -rln scan-dead-style` finds it in `apps/docs/package.json` (its own entry)
and, as **prose in a header comment**, in `check-viewport-forks.mjs` and
`viewports.mjs`; neither imports it, and `check:viewport-forks` passes on the
edited tree (76 docs scripts, no literal spelling of 390/1440 outside
`viewports.mjs` — this script's one `DESKTOP_WIDTH` use is untouched). No CSS
rule, no docs page and no component changed, so no rendering can move.

## Slice 341 — Objective grill of Slices 316, 319, 339: 17 of 17 published assertions reproduce, and the finding is that Slice 339's generator thesis was confirmed by the very NEXT commit — Step 0c's cut lasted one wake, with the charter followed exactly (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 340 — 319.3: the four-page "overlap" was never coverage. `check:target-size` cannot see a named pixel size by construction, so growing it is refused on a red-proof, and the six claims move to the gate that CAN see them (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 339 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's regrowth is a THIRD case 308.1's fork does not name — the cut held perfectly and the charter behind it was never executed (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE`, cloud
wake. Rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**).
Step 0: `origin/main` arrived as a **forced update** again
(`26447ba...c87fc52`) — `ENVIRONMENT.md` trap 1 — fixed with `git checkout -B
main origin/main`; `git branch --show-current` re-read as `main` before
committing. Trap 2 clean in one `--unshallow`, no `shallow.lock`, tags again
arrived with it (`git tag | wc -l` → **8**). Step 1 read **both** intakes in the
REST form with its 404 control: `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. **No new
untriaged input** — issue #2's `updated_at` is unmoved at
`2026-09-06T15:10:34Z` for a sixth consecutive hand-off — so **Step 1 committed
nothing**.

**Lanes 1-3 clean, and `n of 4` is said as the playbook requires.**

```
npm run scan:dead-style -w docs          # 0 dead of 1,365 attrs / 1,854 decls
npm run report:css-repeats -w @busy-office/ui   # 74 files · 242 rules · 230 bodies · 8 repeats
npm run report:prose -w docs             # 119 pages · median 798 · total 113,787
python3 scripts/loops/report_loop_prose.py
```

Lane 1 ran green **with `CHROME_PATH` exported in the same command** and the
workspace spelled `docs` — `337.1`'s live trap, avoided rather than met. Lane 2
is the **fifth** consecutive reading of `74/242/230/8`; the finding is the delta
and there is none. Lane 3's flagged union is **15** (10 over 2x the corpus
median, 11 over a family median), every one inside the pinned 16-set —
`158.1`'s twelve resolve to twelve page paths in the archive, `161.1`'s three,
`178.3`'s `/concepts/scale/`; the unflagged member is `/patterns/output-form/`.
Membership was checked against **the enumeration**, never the grep `326.1`
red-proved dead.

1. [x] **339.1 — lane 4: Step 0c regrew past its pre-cut size in one day, and
       neither branch of 308.1's fork describes what happened.**

       Lane 4 reports the dispatch region growing faster than the file (1,525 →
       **7,532** words, 42.3% of it). `308.1` says a rising region number is not
       a regrowth reading until it is attributed per section, so it was — on
       headings only, which is what that clause asks for.

       **Every per-section figure below is the SPLITTER's, and lane 4's 7,532 is
       the report's**; the two differ because the report counts heading lines and
       a body split does not. They reconcile at the constant the playbook names —
       7,532 − 7,476 = **56** — so the deltas agree exactly and the totals do
       not. Quoting one against the other would invent a delta that is not there:

       ```
       # per-section body words, dispatch region, at each revision since the cut
       git show <rev>:LOOPS.md | awk '/^## Playbooks/{exit} {print}'   # split on ^#{2,4}
       ```

       **Every changed section grew and none shrank** since the last cut
       (`8848ed55`, 274.2, 2026-09-05): Step 0c **+564**, Step 1 **+580**, Step 2
       **+527**, Step 0 **+151**, and the loops table +52 net as *eight* became
       *nine*. The largest is the section **274.2 cut**, which is 308.1's first
       branch — *the fold did not hold, another cut is the answer*.

       **The per-revision series says that verdict is wrong.** Step 0c held
       **flat at 936 across 15 consecutive commits** over two days, then moved
       twice on 2026-09-07: `534b097a` **+364** (collision 3's forensics) and
       `86f034ce` **+200** (collision 4's). It reached **1,500** — **122 words
       above the 1,378 it was cut from**.

       ```
       8848ed55  2026-09-05   936        274.2's cut: 1,378 -> 936
       … 15 commits …         936    +0  through 2026-09-07 (Slice 327)
       534b097a  2026-09-07  1300  +364  collision 3 written up in full
       86f034ce  2026-09-07  1500  +200  collision 4 written up in full
       ```

       **So the cut held perfectly and the charter behind it was never
       executed.** `LOOPS-archive.md`'s own Step 0c charter — written by 274.2 —
       says the decision, the cost, the fetch rule, the conflict recipe and the
       reopen condition stay inline and **the forensics move**. Collisions 3 and
       4 wrote their forensics inline anyway. Nothing executes that charter when
       the next incident is recorded, exactly like the polish re-queue rule that
       "was a rule a human had to notice. It was not noticed."

       **This is a third case, and the first two branches send a wake the wrong
       way on it.** Branch 1 buys another 15 commits; branch 2 ("other sections
       grew — do not reach for a cut") is false here. The distinguishing tell is
       that the regrowth is **new material**, so it is invisible in the
       endpoints and obvious in the series. Added to the lane-4 clause as a
       third branch, with the general form: **check whether the section has a
       GENERATOR** — a recurring event each instance of which writes a narrative
       there — because no cut can hold against one.

       **What was done about it: the charter applied, not a second cut.**
       Collisions 3 and 4 keep a one-line record inline, in the shape 274.2 left
       collisions 1 and 2 in; their forensics, the decision-time fixed-string
       re-check and the "it has happened once" stale-snapshot incident moved to
       `LOOPS-archive.md`. What CHANGES what a wake does stayed inline and is
       named: the pre-commit `git fetch origin main`, the renumber mechanic, the
       keep-both-rows recipe, "check the loser's output before discarding", and
       the guaranteed-conflict refutation.

       **Measured, and the first attempt did not work.** Applying the charter
       moved Step 0c **1,500 → 1,487**, a 13-word reduction: the narrative that
       came out was replaced by a paragraph explaining why it came out, which is
       the same accretion by another name. Tightened to the instruction, and the
       explanation put here and in the archive, it reads **1,322** — **178 below
       where this wake found it and 56 below the pre-cut 1,378**, with the
       dispatch region 7,476 → **7,298**. It is **still 386 above the 936 the cut
       achieved**, and that is stated rather than rounded off: the residual is
       instruction that landed after the cut (the renumber mechanic above all),
       not narrative, and cutting to 936 would remove what a colliding wake
       executes.

       **Two stale counts fixed in passing, same defect class as lane 3's
       "Verdicts to date" list**: `LOOPS.md` pointed at "the forensics of the
       first two collisions" and `LOOPS-archive.md`'s heading read "The two
       collisions" — both written when two was right, both stale from the moment
       a third landed. Both now name the subject rather than a count.

       *Accept was*: the region's rise is attributed per section before any
       verdict; the verdict names which of 308.1's cases it is, or records that
       none of them fits; and whatever is done leaves Step 0c's
       behaviour-changing content inline, verified by naming it. Finding the
       premise ("the fold did not hold") FALSE is a satisfying outcome and is
       what happened.

2. [x] **339.2 — the sweep's re-scan found a SECOND section with the same
       unexecuted charter, and this item is deliberately not the fix.**
       **DECIDED by Slice 371 (2026-09-09): split — the cost narrative moved,
       the loop-SET argument stayed uncut.** The +303 is three kinds, not the
       two the Accept anticipated: P3 (89w) is the operative loop set, pure
       instruction; P4 (160w) is forensics whose every figure was verified
       present — and more completely — beside `CLOSES_A_SLICE`; P5 is 279.4's
       lesson. **What settled it was that all three fragments this item quotes
       as 279.4's inline argument are in P5 and none is in P4**, so the cost
       narrative was never covered by the argument that protected the lesson,
       and moving it overrode nothing. Rule 3 **975 → 907** words. The premise
       re-measured clean: the filed 660 → 963 is the same series 12 words
       lower, and 12 is exactly the rule's own heading line, which
       `dispatch_sections` counts and 339's method could not have — that
       function landed a day later (`1310b81a`, Slice 353).

       `LOOPS.md` §3 step 4 says a round re-scans for another instance of the
       same drift. Applying 339.1's own general question — *does this section
       have a generator?* — to the other sections that grew since `8848ed55`
       finds one, with the identical signature:

       ```
       # rule 3's body words, per revision since 274.2's cut
       8848ed55  2026-09-05   660
       632bfc46  2026-09-05   963  +303   Slice 279.4
       … 18 commits …         963    +0   through 339 (2026-09-07)
       ```

       **One step, then flat for 18 commits** — the same series Step 0c showed,
       one narrative instead of two. Rule 3 carries an archive charter of its own
       (*"The five recurrence narratives — what each parser did, the replay
       figures, the counts that were snapshots — are in `LOOPS-archive.md`"*),
       and 279.4's +303 is a sixth blind spot written inline, replay figures
       included (`18 Polish rows naming 17 slices`, `crossings 51 → 52`, the
       12-slice list). Those figures already have a home the text itself names —
       *"in `dispatch_status.py` beside `CLOSES_A_SLICE`; re-run them, they are
       snapshots"* — so they are duplicated, not merely inline.

       **Why this is filed rather than cut in the same wake, which is 339.1's
       own third branch applied to itself.** That branch says: when other
       sections grew, *"a second cut would remove instruction rather than
       narrative … say so and file the structural question; do not reach for a
       cut."* And 279.4 **argues explicitly for its inline placement** — that its
       mechanism is the loop SET rather than a parser, that *"no widening of any
       regex could have found it"*, and that this is "the point". Overriding a
       stated argument is its own decision with its own reasoning; it is not a
       tidy-up at the tail of a sweep, and making it at speed is how instruction
       gets cut.

       **So the sweep exits with a KNOWN open item, and does not claim a clean
       pass.** `LOOPS.md` §3's exit is *"a clean pass finds nothing to
       consolidate"*; this pass found something and left it, which is stated here
       rather than implied by silence.

       *Accept*: the item names, sentence by sentence, which of rule 3's +303 is
       instruction (a lesson that changes what the next wake does) and which is
       forensics under its own charter, and either moves the forensics or records
       why 279.4's inline argument beats the charter. **Finding that the whole
       +303 is instruction is a satisfying outcome** and closes this item — the
       premise is that some of it is not, and that premise is checkable against
       the charter's own wording rather than against a word count. Re-measure the
       series first (the numbers above are snapshots, and the command is the
       block above them).

## Slice 338 — 316.1 built: `check:print-tokens` ships red-proved, the exemption list it was expected to need is refused on a measurement, and the gap it CANNOT see is filed rather than quietly widened (2026-09-08)

**Dispatched by rule 4**, cloud wake. Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...0ba54ba`), carrying Slice 337, which
the previous hand-off predates. Trap 2 clean in one `--unshallow`, no
`shallow.lock`, and it again brought the tags; `git tag | wc -l` → **8**.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**
across the 31 open items. Step 1 read **both** intakes with `ENVIRONMENT.md`
§8's controls in one run — `/discussions` → 200 len **0**; `/not-a-real-route`
→ **404**, so the zero is a served zero; `/issues?state=open` → 200 len **1**,
issue #2, `updated_at` still `2026-09-06T15:10:34Z` and already triaged as
`300.2` — and triaged nothing: no new input, so Step 1 committed nothing.
Rule 2 `Standardize 3 / 4 … ok`; rule 3 `Objective 0 / 3 … ok`, spent by 337.
Rule 5 reports **STALE** (`1 wake-date(s) newer`), so per `LOOPS.md` it **could
not be evaluated** and is not reported clear. **Rule 4 dispatched Continue,
build mode**, on `316.1` — the oldest still-open item that any wake can take.
Everything older was re-derived from its own item text rather than carried from
the hand-off: Slice 15 (owner hardware), `112.3`/`112.4` (owner briefs),
`249.7` (its own text holds it for `249.10`, owner vocabulary),
`249.10`–`249.13`, `273.2`, `296.3` — all **OWNER CALL**.

### The base rate reproduced, and the denominator did not

`316.1`'s own text says *"Re-run the base rate first; it is a snapshot."* Under
its stated narrow property list (`color|background|background-color|
border-color|fill|stroke|outline-color`) it reproduces **exactly**: **11
literal, 0 token**, across **6** files, with the per-file tally matching to the
digit — `approval-workflow` 1, `badge` 2, `data-table` 2, `stepper` 3,
`print/index.css` 1, `reset/index.css` 2.

**The shipped gate counts 14, and that is a different population, not a
disagreement.** Adding the `border` shorthand finds three more —
`badge.css:115`, `data-table.css:815`, `stepper.css:95`, every one a `border:
… solid <literal>`. The wide list is the right denominator for the gate,
because `border: 1px solid var(--bo-color-border)` inside `@media print` is
exactly the regression and the narrow list cannot see it. Both numbers, and
which is which, are in the gate's header — Slice 336's three defects were every
one of them a number faithfully reading a different population than the noun
beside it named, and this is that lesson applied on the next wake rather than
discovered by the next grill. **Neither number is the verdict**; the verdict is
the **0**, and it is identical under both lists.

### The anticipated exemption list is REFUSED, on a measurement

`316.1` named the likeliest reason to refuse the gate: *"a blanket ban is wrong
for a fill whose colour IS content (`print-color-adjust: exact` markers), which
would need the exemption list this repo's other gates carry."* All three such
rules were read:

| rule | file | declares |
|---|---|---|
| `.bo-icon` | `icon.css:296` | `-webkit-print-color-adjust`, `print-color-adjust` |
| `.bo-timeline__marker, .bo-stepper__marker` | `print/index.css:91` | `print-color-adjust` |
| `.bo-u-print-exact` | `print/index.css:113` | `-webkit-print-color-adjust`, `print-color-adjust` |

**None of them restates a colour inside `@media print` at all**, and that is
structural rather than lucky: the entire point of `print-color-adjust: exact`
is to preserve the colour the ordinary cascade already gave the element, so an
exact-fill rule has no reason to name a colour a second time. So the exemption
is not needed, and shipping an empty exemption map "just in case" would be the
ceremony 94.11 refuses. If a real case ever arrives the gate goes red and the
exemption is argued deliberately — the right way for that decision to be made,
rather than silently exercised.

### The predicate is the token reference, not a property allowlist

The first draft keyed on a list of colour-bearing properties. That list is an
escape hatch with a live example one hop away: `approval-workflow.css:69` sets
`--bo-timeline-marker-fg: var(--bo-color-text-muted)`, a **custom property** no
such list names. Written inside `@media print` it is the identical regression
and the identical 2.54:1, and the allowlist would have passed it. `--bo-color-*`
is a colour family by definition, so keying on the token reference loses nothing
and closes the door. It is red-proved in both places — self-test case 3, and a
live injection into a real component file (below).

1. [x] **338.1 — DECIDED 2026-09-09 (Slice 369): REFUSED on its named
       instance, with the measurement.** `.bo-timeline__marker` prints at
       **5.66:1** at worst, not the 2.54:1 below — `print-color-adjust: exact`
       keeps its disc, so the glyph never meets white paper. The premise being
       false was the Accept's own satisfying outcome. The base rate the other
       branch asked for was measured anyway and the gap is **framework-wide,
       not narrow** (19,511 of 26,817 painted text fills below AA on 125 of
       128 pages, dark theme), so the *word* in the gate header is wrong even
       though the *example* is. And this item's Accept named the wrong
       instrument: a computed-style reading over-states every ratio and gets
       `--bo-color-accent` qualitatively wrong, because Chrome rewrites light
       text on the way to paper. Filed forward as `369.1` and `369.2`.
       Original text kept below.

       **338.1 — the gap `check:print-tokens` cannot see: a theme token that
       reaches paper through the ORDINARY CASCADE.** FILED, not built. The
       gate catches a token *restated* inside `@media print`. The mechanism it
       misses is specificity, not any print property:
       `reset/index.css:96` ships
       `@media print { body { background: #fff; color: #000 } }`, which covers
       everything that INHERITS its colour — most text, which is why this is a
       narrow gap and not a framework-wide one. It does not cover an element
       that sets its own colour, because `body { color: #000 }` loses to any
       more specific rule. `.bo-timeline__marker` is such an element:
       `approval-workflow.css:106` sets `color: var(--bo-timeline-marker-fg)`,
       and `:69` defines that as `var(--bo-color-text-muted)` — the token
       298.1 measured at **2.54:1 on white paper**. Nothing inside
       `@media print` overrides it.

       **The source path above is grepped. The printed contrast is NOT
       measured** — saying so rather than letting a source trace imply a
       rendered result, and it is why this is filed rather than folded into
       the gate: a source scan is the wrong instrument, a computed-style
       reading under print emulation is the right one, and a cloud wake can
       take that (`ENVIRONMENT.md`'s "can run" list).
       - **Accept — the property, and finding the premise FALSE is a
         satisfying outcome.** Re-measure first, under print emulation on the
         built site in the dark theme, exactly as 298.1 did: read the computed
         `color` of a rendered `.bo-timeline__marker` and its contrast against
         the printed background. Then EITHER the reading is a real
         below-AA value and this closes with the fix plus its base rate — how
         many elements set their own colour from a `--bo-color-*` token and
         are not overridden in print — OR the reading is benign (the UA, the
         reset, or the marker's own background rescues it) and this closes as
         **refused with the measurement**, and the gate header's "what this
         does not see" paragraph is corrected to say so. Do not widen
         `check:print-tokens` on the strength of the source trace alone.

## Slice 337 — Objective grill of Slice 297: `config.yml` is the router, not a third template, and the slice counted the escape hatch as an enforcer (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 336 — Objective grill of Slices 315, 332, 333: 26 of 29 assertions reproduce, and all three defects are a number that is a faithful reading of a DIFFERENT population than the noun beside it names (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 335 — 297.1 answered: both issues landed in the right channel, and the router that was supposed to put them there was never used (2026-09-08)

**Dispatched by rule 4** as the oldest item that is not owner-blocked. `297.1`
became answerable only recently: it needed a real filed item, and Slice 332
had to fix the intake command before a wake could reliably read one.

**Its Accept asked for the property, not a happy answer**: *"one wake reports
on a real filed item, naming which intake it arrived in and whether that was
the right one. Finding that the router sent it to the wrong place is a
satisfying outcome."* The measurement is better than either branch it
anticipated.

### The channel was right. The router was bypassed.

Two issues exist, `#1` (closed) and `#2` (open). Both belong in Issues on
substance — `#1` is a defect with a pasted repro, `#2` is a feature request
carrying the real ERP scenario the template asks for. **So the channel choice
was correct both times.**

**But neither used a template.** Measured on the API rather than inferred:

```
curl .../issues?state=all   ->  #1 labels: NONE   body starts "## What happens"
                                #2 labels: NONE   body starts "## The gap"
```

`bug_report.yml` declares `labels: ["bug"]` and `feature_request.yml` declares
`labels: ["enhancement"]`, and **GitHub applies those automatically to anything
filed through the form**. Zero labels on both is therefore not a tidiness
detail — it is proof the forms were never rendered. `blank_issues_enabled:
true` is what let them through.

**So the six enforced fields never fired.** The bug form would have demanded
Version, Browser + version, Theme, Density, a minimal HTML repro, and
expected-vs-actual. Issue `#1` supplied a version, a repro and exact command
output **voluntarily** — which is the finding's sharpest edge: the intake
produced excellent input, and **the machinery I built is not what made it
good.** A disciplined reporter was.

### The verdict on `blank_issues_enabled`

**Left `true`, deliberately.** Both real issues are *better* than the form
would have produced — `#1` reasons about why the rough edge is worth fixing
and quotes the tool's own docstring; a six-field form has nowhere to put that.
Forcing every reporter through a form to protect against the ones who would
under-report is the ceremony this repo's base-rate rule refuses, and the
measured base rate here is **2 of 2 filed well without it**. The templates
stay as a floor for someone who needs the prompts, not a gate on someone who
does not.

### What is still untested, stated rather than quietly closed

- **The Issues-vs-Discussions router has still never been exercised.** Both
  issues were filed by the owner's own agent, which had no reason to consult a
  contact link. A stranger choosing a door remains unobserved.
- **The Discussions half is untested twice over.** Zero have been filed, and
  until Slice 332 the command that reads them **could not run in a cloud
  wake** — so a discussion filed any time before yesterday would have been
  silently missed by most wakes. The intake was broken for the whole period
  `297.1` was open waiting to test it.

1. [x] **297.1 — DONE.** A real filed item is reported, naming the intake it
       arrived in (Issues, twice, correctly) and whether the routing worked —
       it was **bypassed**, which the Accept explicitly names as a satisfying
       outcome. The config was not the thing that worked.

1. [x] **335.1 — The Discussions intake has never returned a non-empty list,
       in either environment.** `332`'s REST fix is verified by controls (a
       404 on an unserved route, a known-content issues list) but never by an
       actual discussion, and `ENVIRONMENT.md` §8 says so outright.
       - **Accept** — the property: the day a discussion exists, a wake re-runs
         the REST command and confirms it appears with its number and title,
         then records that the intake is proved end-to-end. **Filing one to
         test it is explicitly allowed** and is cheaper than waiting — a
         throwaway Q&A discussion, checked, then closed, would settle it. What
         is NOT allowed is closing this on the controls alone; they prove the
         route is served, not that a real item surfaces.
       - **Lane, measured 2026-09-09 (Slice 366) rather than assumed:
         CLOUD-BLOCKED in the WRITE sense — a LOCAL wake can take it.** The
         Accept's own escape hatch, filing a throwaway discussion, is a GraphQL
         `createDiscussion` mutation, and this session's GraphQL endpoint
         answers **HTTP 403** — *"only the
         pinned set of PR-review operations is served"* — to all three of
         `viewer`, a `repository { discussionCategories }` read and a bare
         `__type` introspection, so the refusal is the endpoint and not one
         query. The repo object read with the same token reports
         `permissions {admin, maintain, push, triage, pull}` all **false**, and
         no `mcp__github__*` tool in a cloud session touches discussions. A
         local wake's `gh auth token` carries the owner's own GraphQL access, so
         **this is the third kind of block `LOOPS.md` rule 4 asks a wake to
         name**, not owner-blocked and not browser-blocked. A cloud wake that
         reaches this item should record the fall-through and take the next one
         rather than re-deriving the 403.
         **Whether a REST POST would work is untested BY CHOICE**, said plainly
         rather than folded into the block: the only probe is a request that can
         create a real public item in the owner's repository, and a scheduled
         wake has no live owner to authorise one. `/discussions/categories`
         answers `404` with `documentation_url:
         rest/repos/discussions#get-a-discussion` — the family's own anchor is a
         *get* — which is weaker evidence and is all that was taken.
       - **DONE 2026-09-24 — proved end to end, on a real item.** A local wake,
         with the owner in the session authorising it (create, verify, delete).
         Before: the intake command read `200 len 0`, and the `/not-a-real-route`
         control read `404`. GraphQL `createDiscussion` filed #3 in Q&A,
         *"[loop test 335.1] intake probe — will be deleted"*. The same REST
         command then read **`200 len 1`**, with #3's number, title and category.
         After `deleteDiscussion` it read `200 len 0` again, REST
         `/discussions/3` answered 404, and GraphQL answered NOT_FOUND, so
         nothing is left in the repository. `ENVIRONMENT.md` §8's "not
         red-proved" paragraph is now the dated proof, and `LOOPS.md`'s intake
         note says so. The cloud wake's GraphQL 403 still stands; it no longer
         matters, since the proof exists. Jev: supported 0.95.

## Slice 334 — 315.3: `check:selftests` now RUNS each self-test, because the third rung of its own ladder was open — and the two costs that were expected to refuse it both measure zero (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 333 — 310.2: the five unrendered markup consts are deleted, and the reason is not tidiness — 3 of the 5 had already drifted from the showcase they describe (2026-09-07)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item.
Rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**);
rule 2 `Standardize 0 / 4 ok` — Slice 332 reset it at `14:24:44Z`, roughly six
minutes before this wake's first fetch, so the hand-off this wake read (written
at `534b097a`, two commits back) telling it *"the next wake dispatches rule 2"*
was already out of date; the counters were re-read rather than trusted. Rule 3
`Objective 1 / 3 ok`; rule 5 `Optimize 0 wake-date(s) newer — ok`, so it was
EVALUATED and does not fire. Rule 4's oldest open item is Slice 15, and
everything from there to `310.2` is owner- or input-blocked, re-derived from
each item's own text rather than carried from the hand-off: **15** NEEDS-RUNTIME
(owner hardware), **112.3** "BLOCKED ON OWNER BRIEFS", **112.4** blocked on
112.3's verdict, **249.7** holds its remaining rows for 249.10 (owner
vocabulary) with its first Accept clause already executed, **249.10-13** each
`OWNER CALL`, **273.2** `OWNER CALL` in its own heading, **296.3**
`OWNER CALL`, **297.1** waits on a filer who is not the owner. `310.2` is the
oldest cloud-takeable one, and its own Lane line says it is cloud-takeable
**in its delete form**.

### The premise reproduces exactly

```
for c in toastMarkup menuMarkup rowMarkup savingMarkup removeMarkup; do
  echo "$c $(grep -o "$c" apps/docs/src/pages/base/motion.astro | wc -l)"; done
#  each 1 — the declaration itself
```

And in the built page, each const's own comment text — `Entrance: a toast
arrives from the top edge`, and the four siblings — occurs **0** times in
`dist/base/motion/index.html`. The page ships **4** `<pre><code>` blocks, all
from the other four consts (entrance, collapse, pulse, spin).

### The deciding measurement: they are a second copy, and it has already rotted

The reason to delete rather than render is not that the code is dead. It is
that these five were a **hand-maintained second copy of markup the page
already renders live** in its "In context" section — the shape CLAUDE.md's
recipe forbids in one sentence: *"`Demo` renders a preview **and** its copyable
code from ONE string — never write the preview and code twice."* The predicted
consequence of writing it twice is drift, and the drift is here. Measured
against the BUILT page's own DOM, not the source diff:

| const | source declares | the page renders | |
|---|---|---|---|
| `toastMarkup` | `<div class="bo-alert bo-alert--success bo-motion-slide-in-block-start">` | same | MATCHES |
| `menuMarkup` | `<div class="bo-motion-scale-in">` | `<div class="bo-motion-scale-in bo-alert">` (+ `role="group"`, `<p>` not `<div class="bo-card">`) | **DIFFERS** |
| `rowMarkup` | `<tr class="bo-motion-pulse-once">` | `<tr class="">` — the class is applied by JS via `data-motion-class`, which is the *point* of that showcase | **DIFFERS** |
| `savingMarkup` | `<button class="bo-btn" … aria-busy="true">` + spinner span | identical after driving the click; inner markup equal after whitespace collapse | MATCHES |
| `removeMarkup` | `<tr class="bo-motion-fade-out">…</tr>` | `<div class="bo-alert bo-motion-fade-out">Line 30 — Anode kit</div>` | **DIFFERS** |

**3 of 5.** Rendering them — the other half of the Accept — would have shipped
three copyable samples that contradict the live showcase standing beside them.
That is worse than shipping nothing, and it is the answer to the item's own
"either rendered or deleted".

**The probe was wrong on its first run, and the failure is the one this repo
names.** v1's claim table was hand-transcribed, and its `removeMarkup` row
carried the *rendered* value in the "const claims" column — so it reported
`MATCHES` for a pair that differs. The instrument agreed with itself because
both columns came from the same side. v2 parses the const out of the source
with a regex whose failure throws, so the left column cannot be typed wrong,
and it carries a **control**: `entranceMarkup` IS rendered and must come back
`MATCHES`, which it does. 3-of-5 with a passing control discriminates; 5-of-5
would not have.

### Is this a class of defect? Measured: no — one page, and now zero

```
# frontmatter `const <name> = ` whose identifier occurs once in its own file
5 never-used const(s) across 152 .astro files   (before — all five on motion.astro)
0 never-used const(s) across 152 .astro files   (after)
```

So it is a one-page problem, not a pattern. **No gate was built** — see 333.1.

### Verifying the removal: the raw grep is the WRONG check here

The Accept says *"re-run the count above afterwards; it must read 0 for every
name that remains"*. Run literally it reads **2, 2, 2, 3, 2** — because the
comment this edit wrote to explain the deletion legitimately names all five
consts. That is CLAUDE.md's *"verifying a removal: assert on structure, never
on raw text"*, arriving in the criterion itself rather than in a script. The
structural forms both read clean:

- **comment-stripped identifier count** on the page: `0` for each of the five,
  and `2` for each of the four that legitimately remain (declared + rendered)
  — the controls are what make the zeros mean something.
- **the frontmatter's own declaration list**: `base, classes, DESC, INTENT,
  entranceMarkup, collapseMarkup, pulseMarkup, spinMarkup`.

### NOT VERIFIED does not apply to this one, and that is measured rather than argued

A cloud wake has no Podman, so no 1440/390 light-and-dark screenshots were
taken. **They are not owed here**: the built page is **byte-identical** before
and after — `md5sum` `f8886e3e9ee20f6464ae9545cd44d7aa` on both, 87,802 bytes
each, from a fresh `rm -rf apps/docs/dist && npm run docs:build` (all 139
built pages rewritten, mtimes 14:34:21-24Z). Which is the expected consequence
of deleting strings that reached the HTML zero times, and the two facts
corroborate each other.

Byte-identical is a suspiciously tidy number, so the comparison was
red-proved: `diff` of the same saved page against a *different* built page
reports a difference, so the instrument discriminates.

### Two things kept rather than deleted with the consts

- **The `--grid`-not-`--settings` reasoning (roadmap 292.9)** sat in a comment
  above `savingMarkup`. The live "Saving…" swap in the page's own `<script>`
  makes the identical choice, so deleting the const would have deleted the only
  record of why. Re-homed onto that handler, trimmed to the half that is still
  true, and it now says outright that it is the last site carrying the choice.
- **`check-deprecated-icons.mjs`'s header** used `savingMarkup` as its worked
  example of why phase 1 (SOURCE) is not redundant with phase 2 (DIST) — "a
  copyable string a page declares but does not render". That example no longer
  exists. The header now says the coverage claim is **prospective**, gives the
  before/after base rate, and warns against reading the empty population as
  evidence the phase is redundant. Found by grepping the const names repo-wide
  before editing, which is the step that keeps a snapshot in a comment from
  going stale silently.

### The gap this leaves, stated rather than left to be rediscovered

The "In context" section now carries **no copyable block**, alone among the
page's sections. That is recorded in a template-adjacent comment in
`motion.astro` itself, with the condition for closing it: render preview and
code from one string, never re-add a hand-copy. Doing that adds `<pre>` blocks
to a built page — the half `310.2`'s own Lane line assigns to a local wake.

1. [x] **333.1 — should a gate forbid a never-used frontmatter `const` in an
       `.astro` page? DECIDED 2026-09-08 (Slice 362): `tsconfig`, not a gate.**
       The base rate was re-measured at that revision and the item's population
       was too narrow — **0 of 600** consts, but **1 of 518** imports, a dead
       `eventsManifest` import live for **22 days**. `astro check` +
       `noUnusedLocals` catches it and more; the enabling work is `362.1`. The
       gate is refused for duplicating a subset of a compiler flag at the cost
       of a README re-stamp on the npm front page. Original text kept below.
       Not built in this item, and the reason is that the
       evidence points both ways and neither direction is this item's to
       settle. **For**: the predicate is *exact*, not semantic — an identifier
       occurring once in its own file — so 94.11's wall does not apply, the
       failure took roughly a month to notice, and it produced three drifted
       samples. `310.1`'s own precedent is the strongest argument: a gate there
       earned its place at a clean base rate *because the population had held a
       violation a day earlier*, which is exactly this population. **Against**:
       the base rate after this fix is **0 of 152**, so an empty exemption map
       would be the gate's steady state from birth, and the ordinary tool for
       it is `noUnusedLocals`, which nothing here sets. **Say precisely what
       the tsconfig situation is, because a first pass here got it wrong and
       the correction changes the argument**: `tsconfig.base.json` and
       `packages/core/tsconfig.json` both exist (`strict: true`, no
       `noUnusedLocals`), but the core one's `include` is `src/js/**/*.ts`, and
       `apps/docs/` has **no `tsconfig.json`** and no `astro check` step — so
       no TypeScript configuration in this repo has ever looked at a docs
       `.astro` file. The cheaper fix may still be a compiler flag plus the
       config that would make it apply, rather than a 54th gate; that is more
       than a one-line change, which is part of what this item weighs.
       - **Accept** — the property, not a predicted outcome: one wake records
         which of the three it is (gate / `tsconfig` / neither) **with the
         base rate re-measured at that revision**, and says what the choice
         costs. **Deciding to build nothing is a satisfying outcome**, and so
         is finding the base rate has moved off zero.
       - **Lane**: cloud-takeable — the scan, the `tsconfig` spike and the
         decision are all text and node.

## Slice 332 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 led to a mandated intake command that CANNOT RUN where most wakes run (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 331 — 294.2: the input block is fixed rather than reported, and all six proposals carry a verdict (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 330 — Objective grill of Slices 310, 328, 329: 23 of 25 reproduce, and the figure that does not is the one a design refusal rests on (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 329 — 249.9 built: the component catalogue ships with every field generated, and the miniature it specified is refused with the cost it asked for (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 328 — 249.6 built: the router lands, its "three rows have no rendered result" premise was FALSE, and the gate its Accept asks for cannot discriminate (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 327 — Objective grill of Slices 309, 323, 326: 74 of 75 published assertions reproduce, and both defects are in prose sitting BESIDE a measurement that is correct — one route claim nobody ran a command for, and a negative control whose own record destroyed it (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 326 — Standardize sweep, 4 of 4 lanes: the lane that warns against stale name lists carried one, and following it produced a false finding on a page verdicted ten days earlier (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 325 — 309.5: the `/stress` measurement is committed, and its own style-flush column shipped dead first — an identical ~0 across inputs differing 20-fold, because the event loop pays the recalculation between tasks (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 324 — rule 5's pairing test counted SAMPLES, so a 26-sample afternoon read as a series; re-scoped to distinct days its actionable input set is one metric, and the reason nobody records that one was a premise this wake refuted (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, fixed with `git checkout -B main
origin/main` before any commit). `origin/main` again arrived as a **forced
update** (`26447ba...97a3137`). Trap 2 clean in one `--unshallow` (**2,006**
commits, no `shallow.lock`), and it again brought the tags — the
**thirty-seventh** consecutive container to do so; `git tag | wc -l` → **8**.
Step 0b counters read `Standardize 2/4`, `Objective 1/3 [323]`, `Optimize 1
wake-date newer STALE`. Step 1: both intakes read with `ENVIRONMENT.md` §8's
controls (`/discussions` 200 len 0, `/not-a-real-route` 404, `/issues?state=open`
200 len 1) — **issues 1 open, discussions 0 open**, issue #2's `updated_at`
unmoved at `2026-09-06T15:10:34Z`, so **no new input and Step 1 committed
nothing**. Step 2: rule 1 no P0, rule 2 `2/4`, rule 3 `1/3`, **rule 4** on the
oldest still-open item no other kind of block covers — `307.1`, every older
open item being owner-, browser- or input-blocked (re-checked in the file, not
carried from the hand-off).

**Rule 5 was the subject of this wake and could not be evaluated as a rule** —
its line reads a genuine `STALE`, which is no input. That is the item, not an
obstacle to it.

### The narrowing, and each step is a different mechanism

`44 names → 7 day-paired → 3 alive → 1 actionable.` The full measurement, the
command that reproduces it, the base-rate replay and the red-proof are in
`307.1` above, closed by this slice. **A fifth step was drafted — `→ 0
samplable`, on a refusal row's "no generator anywhere" — and refuted inside
this wake**: the generator exists, it simply does not carry the metric's name,
so a grep for the name could never find it. The two findings that outlive the
re-scoping are filed below; neither is fixed by it, and both are what stop
rule 5 from firing once its input is honest.

1. [x] **324.1 — DONE, on the Accept's SECOND branch. No direction is recorded,
       and the reason is not that it is hard: supplying it would make rule 5
       fire on the one metric it can act on, and that verdict is wrong.**
       Measured 2026-09-08 (cloud wake, Slice 347) at `5543979`.

       **The measure-first answer is 1 of 8, so the unit-convention escape
       hatch is dead.** Of the eight day-paired names only `bundle-gz-kb` (`kB`)
       is directional from its unit. `count` is carried by **14** names,
       including `axe-violations` (lower-better, pinned at 0 because `test:axe`
       fails the build above 0 — mechanical, not judged) and `claims`
       (higher-better — the original text below calls its rise *"the goal"*).
       One unit, both directions, both anchors mechanical. And the unit is not
       even stable per name: `axe-violations` was recorded as `pages` through
       2026-08-30 and as `count` from 2026-08-31.

       ```
       python3 - <<'PY'
       import json, collections
       S=[json.loads(l) for l in open('.roundtable/loop-metrics.jsonl') if l.strip()]
       days=collections.defaultdict(set); u2n=collections.defaultdict(set)
       for s in S: days[s['name']].add(s['ts'][:10]); u2n[s['unit']].add(s['name'])
       print(sum(1 for n in days if len(days[n])>=2), 'day-paired'); print(sorted(u2n['count']))
       PY
       ```

       **A per-sample field is also the wrong SHAPE.** Direction is constant per
       name, so a field on the sample is one fact stored in every sample and
       free to disagree with itself — 140 of them at `5543979`, none of which
       could ever carry it.

       **What settles it: rule 5 has been satisfiable since 2026-08-16 and only
       the missing direction hid that.** Four day-paired names already carry two
       or more consecutive same-direction day-pairs — `bundle-gz-kb` (4),
       `claims` (3), `components` (2), `gates` (2). Apply directions and exactly
       one reads as a regression: `bundle-gz-kb`, 7.2 → 9.6 → 10.8 → 11.7 →
       15.1 kB, four consecutive rises.

       It is not a regression. The log co-recorded `components` at the **same
       timestamp** as `bundle-gz-kb` three times — the recording wake's own
       pairing, not this one's:

       ```
       2026-08-13 23:06    7.20 kB / 18 = 0.400 kB per component
       2026-08-15 19:05    9.60 kB / 25 = 0.384
       2026-08-16 02:24    9.93 kB / 28 = 0.355
       2026-09-08 live    15.10 kB / 40 = 0.378   check:size at HEAD
       ```

       Absolute **+110%**; normalised **−5.6%**, and not monotone. Today's 40 is
       two independent instruments agreeing (`ls packages/core/src/css/components`
       and `api.json`'s `components` key). **Robustness control:** taking
       2026-08-16's LAST values instead of the co-located ones (10.8 kB / 30 =
       0.360) leaves the fall intact, so it is not an artifact of which same-day
       sample was picked. **Denominator caveat, said plainly:** `index.min.css`
       also carries primitives, utilities and tokens, so 0.378 is a rough
       per-component cost — a control on the trend's direction, not a budget.

       **And rule 5's OTHER clause already covers this name, better.** *"or a
       size budget breached outright"* is mechanical: `check:size` gates
       `css/index.min.css` at 16.7 kB gz, reads **15.10** today, and prints
       per-bucket headroom (tightest 110 bytes, `css/brand-navy.min.css`). A
       budget knows the threshold; a delta does not.

       **Verdict: no `--direction` flag and no per-name registry.** Base rate —
       a registry would cover 8 names, of which one can currently satisfy "two
       consecutive", and that one is better served by a budget that already
       exists. That is 94.11's ceremony test answered with a number. The reason
       is written where the two wakes who need it read it: `report_comparable`'s
       closing note (printed at Step 0b every wake) and `record_metric.py`'s
       docstring (read by a wake recording a sample).

       **What would reopen it:** a day-paired name with two or more consecutive
       same-direction pairs, a lower-better direction, and **no budget gate
       covering it**. `dispatch-region-words` is the live candidate — `326.3`
       treats its growth as the concern — and it has one day-pair, so a third
       day of sampling would make it the first such name.

       **Not verified visually, and none is owed:** the diff is `ROADMAP.md`,
       two `scripts/loops/*.py` files and the hand-off. No CSS, no docs page and
       no component changed, so nothing rendered can move.

       *Original text, kept verbatim per 236.2 — the Accept below is what this
       item was judged against:*

       **a sample records no DIRECTION, so even a fresh, well-paired
       metric cannot yield a verdict.** `record_metric.py` writes `{ts, name,
       value, unit}`. On this tree `claims` rises 35 → 169 (the goal) and
       `bundle-gz-kb` rises 7.2 → 15.1 kB (the regression) and both are a
       positive delta on a number. `dispatch_status.py` now prints the movement
       and says outright that the verdict is the wake's, which is honest and is
       not the same as rule 5 being answerable by the dispatcher.
       - **Accept** — the property: either a sample carries which direction is
         a regression and the line states a verdict where it can, or the
         reason a direction cannot be recorded is written down where the next
         wake reads it. **Concluding that the reader supplies the direction and
         that the printed movement is the right stopping point is a satisfying
         outcome** — 132 existing samples carry none, and a field only future
         samples fill leaves the three live names undirected either way.
       - Measure before building: how many of the day-paired names have a
         direction that is *obvious from the unit alone* (`kB`, `ms` — lower
         better) versus one that needs a per-name declaration. If the answer is
         "all of them from the unit", the field is ceremony and the fix is a
         unit convention.

2. [x] **324.2 — DONE. The definition is written where a wake recording a
       sample reads it, and the item's own headline is refuted: the 0.3 kB band
       is narrower than EVERY move rule 5 reads, by 3x to 11.3x.** Both of the
       Accept's escape hatches — re-pointing the name at the deterministic
       minified byte count, or retiring it — are **refused on the measurement**,
       not preferred against. The series is not noise-limited.

       **The measure-first step ran first, and it killed the item's own shrink
       branch.** *"A series taken entirely at one offset has no cross-environment
       problem at all, and that would shrink this item to one sentence."* It is
       not one offset. `git blame --line-porcelain -- .roundtable/loop-metrics.jsonl`
       (164.2's method) resolves all 140 lines, and the 11 `bundle-gz-kb`
       samples are **9 at `+0800` and 2 at `+0000`** — the last two, 2026-09-03,
       are the cloud lane. The series is genuinely cross-environment, so the
       item had to be answered rather than shrunk.

       **The headline premise does not reproduce under any pairing.** Rule 5
       pairs the LAST reading of each distinct day (307.1), so the moves it
       reads are the day-pair ones:

       | pairing | moves | below the 0.3 kB band |
       |---|---|---|
       | **day-pair — what rule 5 actually reads** | +2.4, +1.2, +0.9, +3.4 kB | **0 of 4** (3.0x, 4.0x, 8.0x, 11.3x the band) |
       | first-of-day | +2.6, +0.33, +1.67, +3.5 | 0 of 4 |
       | sample-to-sample | ten moves | 5 of 10 |
       | within-day only | six moves | 5 of 6 |

       Nothing here is "three of four". The two readings that *are* mostly
       sub-band are within-day and sample-to-sample noise — moves rule 5 never
       reads. The likely origin of the wrong figure is reading one of those two
       and reporting it as the day-pair count; the enumeration is in the wake's
       transcript command, re-runnable against the jsonl.

       **Cross-environment gzip drift measured for the first time here, and it
       is UNDER 0.1 kB.** The repo has always asserted this drift exists — one
       real CI failure, 2026-08-16 — and has never measured its magnitude, so
       "the 0.3 kB cross-environment floor" in this item's own Accept was a
       chosen band read back as a measurement. The reading:

       - `a9403f42` (2026-08-29) was stamped `92 kB minified (15.0 kB gzipped)`
         by a wake whose author-tz is `+0800`.
       - The same tree rebuilt in a cloud container (`+0000`, node 22.22.2,
         zlib 1.3.1) gives **93,785 minified bytes** and **15,334 gzip bytes =
         14.975 kB**, printing the same `15.0`.
       - **The minifier is not a confound**: every CSS toolchain package is
         version-identical to that commit's own `package-lock.json` — cssnano
         7.1.9, postcss 8.5.26, autoprefixer 10.5.4, postcss-nesting 13.0.2,
         postcss-import 16.1.1, postcss-custom-media 11.0.6 — compared one by
         one rather than assumed. gzip is the only variable left.
       - **Stated as a BOUND, not a value.** The other environment's exact byte
         count is unrecoverable; only the tenth-of-a-kB stamp survives. So the
         claim is `|drift| < 0.1 kB` at **n = 1** — under a third of the band —
         and explicitly not "drift is zero".

       **A second thing fell out, and it is the part of the Accept that had no
       obvious answer: WHICH ARTIFACT.** Two published figures for this exact
       quantity disagree right now. `check:size` prints `15.10`; both READMEs
       publish `15.0`. Neither is wrong — `stamp-readme.mjs` keeps an existing
       in-tolerance string rather than re-stamping, precisely so a rebuild
       elsewhere makes no no-op diff — but it means **the README lags the
       artifact by up to the full 0.3 kB band, and lags it by 98 bytes today.**
       A wake that recorded the README's number would be recording a stale
       sample with no way to tell. That trap is now written down beside the
       command that avoids it.

       **Where it is written: `record_metric.py`'s docstring, and nowhere
       else.** That is the file a wake recording a sample opens, which is
       exactly what the Accept names. **`dispatch_status.py` was deliberately
       NOT extended** — `326.3` is open on the dispatch region's growth
       (+1,101 words in two days), and 324.1's note already stands there; a
       second copy would grow the region this loop is currently worried about,
       to serve a reader who is not recording anything.

       **Why gzip stays.** The reason the Accept gave for keeping it — gzip is
       what users download — is about the BUDGET, and that reason survives
       intact: `check:size` gates `css/index.min.css` at 16.7 kB gz against
       15.10 live and prints its tightest headroom in bytes every run. What
       `bundle-gz-kb` lacks for rule 5 is not resolution, it is a
       **denominator**, which is `324.1` immediately above and already settled
       there. Switching the name to minified bytes would trade the
       consumer-facing meaning for a precision the measurement above says was
       never the problem.

       **Not verified visually, and none is owed:** the diff is `ROADMAP.md`,
       `scripts/loops/record_metric.py` (a docstring) and the hand-off. No CSS,
       no docs page and no component changed, so nothing rendered can move.
       `record_metric.py` is a CLI, not a build step or a gate.

       *Original text, kept verbatim per 236.2 — the Accept below is what this
       item was judged against:*

       **`bundle-gz-kb` is the only metric rule 5 can act on, its
       generator exists, and its noise floor is wider than three of its four
       historical moves.** The "no generator" premise died in `307.1` above:
       `check:size` prints `css/index.min.css … 15.10 kB gz` and
       `stamp-readme.mjs` stamps the same figure into both READMEs, matching
       the newest hand-recorded sample (15.1, 2026-09-03). What remains is the
       part a grep never reached — `GZIP_TOLERANCE_KB = 0.3` exists because the
       same bytes gzip differently across Node builds, and the two dispatchers
       run different containers.
       - **Accept** — the property: the metric's definition is written down
         where a wake recording it will read it (which artifact, which command,
         which environment), AND the record says what delta is large enough to
         mean anything against the 0.3 kB cross-environment floor. **Concluding
         that a gzip-byte series cannot support a cross-environment
         two-consecutive verdict, and re-pointing the name at the minified byte
         count (`93 kB`, deterministic) or retiring it, is a satisfying
         outcome** — the reason to keep gzip is that gzip is what users
         download, and that reason is about the BUDGET, which `check:size`
         already gates, not about rule 5.
       - **Do not re-baseline the existing 11 samples**, and do not record a
         sample to un-STALE the line before the convention is written down —
         that is what 2026-09-04 refused, and its stated reason being wrong
         does not make the action right.
       - Measure first: which of the 11 samples were taken on which
         dispatcher's clock (`git blame --line-porcelain` on
         `loop-metrics.jsonl` gives the author offset per line, the method
         164.2 established). A series taken entirely at one offset has no
         cross-environment problem at all, and that would shrink this item to
         one sentence.

3. [x] **324.3 — DONE. Archive sweep, taken from inside the dispatch because
       `249.12`'s stated trigger crossed BOTH halves for the first time — and
       its first attempt silently truncated a slice.** `roadmap_scope.py` read
       **8,188 lines / 41.5%** after this wake's own item closed, against the
       trigger the hand-offs carry (*"past 5,450 lines / 40.6%"*). Thirteen
       consecutive wakes had declined on the share half; with both halves past,
       the AND-vs-OR question `249.12` is open on no longer decides anything,
       so `LOOPS.md` rule 4's own instruction — *if this rule is walking
       thousands of lines, triage the sweep and run it* — applies unambiguously.

       **15 slices moved** (321, 318, 317, 314, 313, 312, 311, 308, 306, 305,
       304, 303, 302, 301, 300), each byte-identical in the archive, each
       leaving the pointer line. The 4 remaining targets — 307, 298, 292, 283 —
       are every one of them **named by a still-open item** (236.2's pins), so
       nothing eligible was left behind. Reconciled both ways, read at the
       commit rather than the working tree (`25b9fdd3` → `67fc6659`): live
       closed items **67 → 52** and archive **714 → 730** — 16 moved, and the
       live side keeps a 52nd because this entry is itself a new `[x]`; open
       **26 → 26** unchanged; slice headings **306 → 306**; live lines
       **8,188 → 6,476**; share **41.5% → 24.6%**.

       **The finding is the first attempt, and it is CLAUDE.md's bulk-edit rule
       landing with its own reconciliation clause.** Section boundaries were
       taken as *any line starting with `## `*. That is wrong here:
       `report_loop_prose.py`'s output contains a row spelled
       `## the loops table   214   214   214`, and Slices 309 and 308 each quote
       one **inside a code fence**. So the mover cut Slice 308's body at that
       row, archived the first half, and left the remainder in the live file
       under a heading that is not a heading — after which `roadmap_scope.py`
       read **17 slice sections, 12 open / 12 closed** where the raw file has
       306 / 26 / 52, and seven whole slices (15, 112, 249, 273, 294, 296, 297)
       vanished from the OPEN set rule 4 reads.

       **The verification passed anyway, and the reason is the rule: a
       reconciliation that re-uses the parser it is checking cannot fail.** The
       byte-identity check was written with the same section splitter, so it
       compared a truncated body against a truncated body and reported *"ALL 15
       OK"*. What caught it was an INDEPENDENT instrument — `roadmap_scope.py`,
       which is fence-aware — disagreeing with a number that had just been
       written down by hand. Reverted whole (`git checkout --`, not a patch),
       re-run fence-aware, and re-verified against that same independent
       instrument: the OPEN set after the sweep is identical to the OPEN set
       before it, name for name.

       **The mover now refuses rather than truncating**: it toggles fence depth,
       treats `## ` at depth zero only, asserts the file's fences balance, and
       asserts each moved section's own fence count is even — the condition that
       would mean a fence spans a section boundary. All three are asserts, not
       filters, per *prefer an assertion that fails loudly over a replace that
       silently matches nothing*.

## Slice 323 — rule 5's staleness line compared naive stamps from two clocks, so a calendar boundary read as missing input; the fix states the skew rather than removing it, and the base rate that justifies it is invisible at date granularity (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 322 — Objective grill of Slices 304, 305, 320: 26 of 29 assertions reproduce, and both defects are a COUNT published beside a correctly red-proved fix. One of them the grill's own first instrument reproduced, by the same mechanism (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 321 — rule 4's oldest item asked a wake to re-measure an artifact that exists in no commit: the Gauntlet's bar protected the REFERENCE and never the graded thing, so three blind critic rounds bought findings nobody can check (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 320 — Standardize sweep, 4 of 4 lanes: two shared components carried the LAST inline spellings of two classes a 2026-08-17 sweep created to replace them, and lane 1's own headline number counts attributes while saying "declarations" (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...e3de656`). Trap 2 clean in one
`--unshallow` (**1,998** commits, no `shallow.lock`), and it again brought the
tags — the **thirty-third** consecutive container to do so; `git tag | wc -l`
-> **8**. Trap 1c did not bite (`CHROME_PATH` exported in the same command as
every browser-driven gate).

Rule 1: no open P0 — `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i P0`
returns nothing across the 25 open items. Step 1 read **both** intakes with
`ENVIRONMENT.md` §8's controls in one run (`/discussions` -> 200 len **0**;
`/not-a-real-route` -> **404**; `/issues?state=open` -> 200 len **1**, issue #2,
already triaged as `300.2`) and triaged nothing: no new input. **Rule 2
matched** — `dispatch_status.py` read `Standardize 4 / 4 Continue rounds …
OVERDUE`. Rule 3 `1 / 3 slice … ok [304]` did not match. Rules 4-8 not reached.
Rule 5 reports **STALE** (`1 wake-date(s) newer`), so per `LOOPS.md` it **could
not be evaluated** and is not reported clear; `306.1` is the open item saying
why a cloud wake cannot drive it to `ok`.

**All four lanes ran; saying `n of 4` per the playbook. This is 4 of 4.**

| lane | command | result |
|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** of **1,433**, and the unit of that 1,433 is the finding — see below |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | **8 repeated bodies**, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct |
| 3 report:prose | `npm run report:prose -w docs` | **0 unverdicted** — 118 pages · median 792 · **112,297** words; 10 over the corpus median, 11 over a family median, union **15** |
| 4 loop-prose | `python3 scripts/loops/report_loop_prose.py` | no finding — `git diff --stat 4e0248ed..HEAD -- LOOPS.md` is **empty**, so 308.1's per-section attribution still stands and re-deriving it would be the re-derivation that rule exists to prevent |

**Lane 2's membership is unchanged group-for-group**, not merely unchanged in
count: all eight bodies match `LOOPS.md`'s table one-for-one, and the
joined-control `x4` group is still **two** components, so its stated reopen
trigger — a THIRD — is unmet. **Lane 3's corpus moved and the flagged set did
not**: `111,907 -> 112,297` words (+390 since Slice 314), median 792 unchanged,
the same **15** pages, none entering unverdicted.

### The finding — a 2026-08-17 consolidation that stopped at `pages/`

`Gallery.astro`'s own `is:global` block carries two docs-local classes whose
comments record what they replaced: `.docs-list` was *"an identical inline
`style="padding-inline-start: 1.25rem"` repeated 37 times across 27 pages"*,
and `.docs-list-bare` was *"`style="list-style: none; padding: 0"` repeated 14
times"*, both from the Standardize sweep of 2026-08-17.

Every one of those 51 inline copies is gone from `pages/`. **Two survived, and
both are in the shared components that render INTO those pages** — the exact
directory Slice 314 established was outside 292.8's scope, one property over:

```
grep -rnE 'style="[^"]*padding-inline-start:\s*1\.25rem' apps/docs/src --include='*.astro'
grep -rnE 'style="[^"]*list-style:\s*none[^"]*padding:\s*0'  apps/docs/src --include='*.astro'
  # ApiTable.astro:74 and Related.astro:14 — and, in Gallery.astro, only the
  # two COMMENTS quoting the strings the classes replaced.
```

`.docs-list` is used by class in **59** files and `.docs-list-bare` in **40**,
so this is a one-off surviving beside a settled pattern, which is what this loop
means by drift. Both now use the class.

### 314.2 — closed here, because this sweep's own scan reached its sites independently

314.2 asked for a verdict on the non-zero spacing literals and an explicit
decision on `--bo-space-0`. The counts were re-run rather than quoted, with an
instrument restricted to inline `style=` **attributes** — a `<style>`-block
declaration is a stylesheet rule, not an inline one-off, and a raw grep for
`padding:` conflates them.

| site | verdict |
|---|---|
| `ApiTable.astro:74` `padding-inline-start: 1.25rem` | **converted** — to `.docs-list`, not to `var(--bo-space-5)`. A class that already owns the decision beats tokenising a one-off. |
| `Related.astro:14` `list-style: none; padding: 0` | **converted** — to `.docs-list-bare`. |
| `ApiTable.astro:57` `margin-inline-end: 0.5rem` | **converted** — `var(--bo-space-2)`, exact. |
| `detail-form.astro` x3 `font-weight: 400` | **converted** — `var(--bo-font-weight-normal)`, exact. This is 314.2's whole `font-weight` row. |
| `base/primitives.astro` x4 `margin-block-start: 1.5rem` | **refused** — all four are INSIDE a template literal, i.e. copyable samples, which 292.8's own live-markup rule puts out of scope. `1.5rem` does equal `--bo-space-6`, so the refusal is about the site, not the value: the page's subject is the primitives' gap knobs, and a token spelling in the sample teaches a second thing the sample is not about. |
| `ClassRef.astro:44` `margin-inline-end:.4rem` | **refused, and it files 320.3** — `0.4rem` is off-scale (between `--bo-space-1` 0.25rem and `--bo-space-2` 0.5rem), so any swap is a rendered change, which is the judgement 314.1 recorded for its own `2rem`. |
| every zero (`margin: 0`, `padding: 0`, `margin-block-end: 0`) | **refused. `--bo-space-0` is never the right spelling of a zero**, and the evidence is that nothing has ever used it: `grep -rn -- '--bo-space-0\b' packages/core/src apps/docs/src` excluding its own definition returns **0**. A reset is not a scale step. |

The classifier that split "copyable sample" from "live markup" is backtick
parity to the match OFFSET, and it was **wrong on its first version** — parity
to the start of the LINE misreads a line that OPENS a template literal, which
is `combobox.astro:61`. Red-proved on two controls before any verdict rested on
it (`primitives.astro:30` INSIDE, `combobox.astro:61` INSIDE), per this repo's
own base rate that an instrument's first output is not evidence.

### And a second class of inline one-off nothing had a name for

A knob set to exactly the value the consuming rule already falls back to.
`.bo-cluster` is `gap: var(--bo-cluster-gap, var(--bo-space-2))`, and six
elements set `--bo-cluster-gap: var(--bo-space-2)` (or `--bo-grid-min: 16rem`,
`.bo-grid`'s own fallback) on top of it.

**Base rate measured before treating it as a finding** (94.11): **6 of 47
inline custom-property declarations (12.8%)** — neither 0% nor 100%, so the
predicate distinguishes. All six are live markup, none nested inside another
cluster or grid that sets the knob, so removing them cannot uncover an
inherited value. After: **0 of 41**.

### The instrument defect — lane 1's headline number is not what it says

`scan:dead-style` printed **"1,433 live inline declaration(s)"**. `live += 1`
fires once per element carrying `[style]`, so 1,433 was **attributes**. Measured
on one page set on one day: **1,272 attributes holding 1,677 declarations**, a
**24.2%** under-report, and the wrong noun has been quoted as a declaration
count in ~~five consecutive sweep write-ups (214, 284, 290, 301, 314)~~ and in the
script's own header.

> **CORRECTED 2026-09-07 by Slice 322 (Objective grill): the blast radius is
> `17` sweeps, not five, and the five named are not a consecutive run.** Every
> Standardize sweep from **208** onward quoted it — 208, 214, 230, 235, 237,
> 244, 252, 255, 257, 263, 274, 284, 290, 293, 301, 308, 314 — all 17
> classified as sweeps from their own headings, none of them anything else.
> The struck list omitted ten sweeps sitting *between* 214 and 314, which is
> what makes "consecutive" false as well as low. The true statement is
> stronger than the published one: **no sweep has ever quoted this number
> correctly.** The command, recorded here because the original carried none:
>
> ```
> # whitespace-normalised — a LINE-based grep is what produced the undercount
> python3 - <<'PY'
> import re
> pat = re.compile(r'1,?433[^.\n]{0,40}live inline\s+decl', re.I|re.S)
> for f in ['ROADMAP.md','ROADMAP-archive.md']:
>     txt=open(f).read()
>     heads=[(m.start(), m.group(1)) for m in re.finditer(r'^## Slice (\d+)', txt, re.M)]
>     own=lambda p: max([n for s,n in heads if s<=p], key=lambda _:0, default=None)
>     print(f, sorted({[n for s,n in heads if s<=m.start()][-1]
>                      for m in pat.finditer(txt)}, key=int))
> PY
> ```
>
> **The grill's own first instrument made the same mistake and that is the
> reusable part.** A line-based scan returned 16 of the 17 and missed exactly
> **301**, whose `live inline` / `declarations` straddle a newline. This repo's
> prose wraps at ~78 columns, so a phrase-count taken per line silently drops
> every wrapped instance — filed as `322.3`.

**The unit is also a detection gap, and it is red-proved rather than reasoned.**
The verdict joins every property the attribute names into ONE string, so an
attribute is dead only if ALL of its declarations are. That probe's own logic,
run verbatim over three injected elements:

```
live   style="margin: 40px"                 <- the script's own live control
DEAD   style="margin: 0"                    <- the script's own dead control
live   style="margin: 40px; padding: 0"     <- the gap
```

The hidden `padding: 0` is exactly the case the script's header calls the
canonical dead one (25 of the first sweep's 29). **273 of 1,272 attributes
(21.5%)** carry more than one declaration and are in that blind spot.

1. [x] **320.1 — the output says what it counts, and prints the number it was
       missing.** Both figures now print, so the historical series stays
       comparable rather than being silently redefined, and the multi-declaration
       count publishes the blind spot's size beside the verdict that cannot see
       into it. The corrected line reproduces an independent probe exactly —
       `1272 / 1677 / 273` from both — which is the reconciliation against
       something independent that CLAUDE.md asks for before a number is quoted.
2. [x] **320.2 — judge each declaration separately, so a dead one cannot hide
       behind a live sibling. DONE 2026-09-08, Slice 342 — and the gap was NOT
       empty: 52 dead declarations in 50 of the 357 multi-declaration
       attributes, on 13 pages, invisible to every sweep that has read this
       instrument — the 17 Slice 322 enumerated (208 through 314) among them.
       The self-test's mixed control red-proves it, failing on
       exactly one of five assertions when the verdict is put back to the
       whole attribute.** Filed rather than built: it moves a headline
       number five write-ups have quoted [**Corrected by 346.1:** 17 sweeps quoted it,
       per Slice 322's correction], and the scan is `@exact`, so it owes
       its own red-proof and new self-test cases discriminating a mixed
       attribute — which the current self-test, two single-declaration controls,
       cannot do.
       - **Accept:** the scan reports a per-declaration dead count; its
         self-test gains a mixed case and **fails when that case is judged as a
         whole**; and the run's own before/after is reconciled against the 273
         attributes named above rather than against the list it was handed.
         **Finding that the gap yields zero real dead declarations is a
         satisfying outcome** if it carries the re-run counts.
3. [x] **320.3 — the same idiom, two values, in two shared components.**
       `ApiTable.astro:57` and `ClassRef.astro:44` both space a wrapping run of
       inline `<code>` chips, at `0.5rem` and `.4rem`. One decision, two
       spellings, and the 1.6px difference is invisible in a diff.
       - **Accept:** the two agree, or a recorded reason they should not.
         Unifying them is a **rendered** change a cloud wake cannot judge, so
         this needs a wake that can look at both, at 1440px and 390px.
       - **DONE 2026-09-24 (local wake).** They agree: `ClassRef.astro` now uses
         `var(--bo-space-2)`, the token `ApiTable.astro` already used, in place
         of a bare `.4rem` nothing explained. Measured live on the `:8081`
         container at 1440 and 390, light and dark: both components' chips
         compute `margin-inline-end: 8px` (ClassRef 10, ApiTable 41 on
         `/components/data-table/`), same-line ClassRef chips sit 8px apart,
         no page overflow. Jev: supported 0.95.

**Verified live — measured, not screenshotted.** A throwaway probe (scratchpad,
not the repo) drove `serve-dist.mjs` + `browser-harness.mjs` over the eight
affected pages, reading 13 computed properties for every element:

| comparison | elements | key-set diffs | computed differences |
|---|---|---|---|
| before vs after, unmodified | 12,593 | 0 | **0** |
| `.docs-list`/`.docs-list-bare` forced, **before** tree | 12,593 | 0 | 38 |
| `.docs-list`/`.docs-list-bare` forced, **after** tree | 12,593 | 0 | **107** |
| `--bo-space-2` -> 37px, before vs after | 12,593 | 0 | **60** |
| `--bo-font-weight-normal` -> 123, before vs after | 12,593 | 0 | **3** |

The no-op row alone proves nothing — it is also what an edit that never landed
produces — so the override rows are what discriminate. Forcing the two classes
moves **38** elements in the before tree (the pages' own existing uses, 3 pages)
and **107** in the after tree (**8** pages), the **+69** being the two `<ul>`s
this round rewired plus what inherits `list-style-type` from them. The
font-weight override moves **exactly 3**, all `SPAN`s on `/patterns/detail-form/`
— the three sites edited, no more.

**And the re-scan reconciles to the element, which is what caught the unit
defect.** Lane 1 re-run reads **1,433 -> 1,272**, a drop of **161**. Predicted
from the source sites: Related's `<ul>` renders **116** times and ApiTable's
notes `<ul>` **40**, plus the 5 page-level sites = **161**, exact. It reconciles
**only** in the element unit — the first prediction, in declarations, said 392
and was wrong by 231. A hand-derived number disagreeing with the instrument is
what this repo says to investigate rather than quote, and here the instrument
was right and its LABEL was wrong.

**Gates: all 17 cloud-runnable entry points green** on the committed tree, the
list re-derived from `ci.yml` rather than read off a snapshot (the two
documented set differences still hold: `check:ci-ignores` is covered by
`check:repo`, and `npm run test -w @busy-office/ui` is CI's
`npx vitest run --root packages/core`).

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. What that would add is *"does it look right"*; what is
claimed instead is that **nothing rendered changed**, asserted over 12,593
elements' computed values on eight pages plus `check:layout`, `check:scroll` and
`test:axe` across the whole built site. The claim is structural: every converted
value is byte-equal to the literal it replaces, and every removed declaration
restated a fallback the consuming rule already carries, so a visual difference
would require a class or a token to differ from its own definition. **320.3 is
the one item here that genuinely needs a rendered image, and it is left OPEN for
that reason rather than guessed at.**

## Slice 319 — Objective grill of Slices 298, 300, 318: 25 of 27 published assertions reproduce, and both defects are in what shipped BESIDE the number. Slice 317 audited a three-part runtime claim, removed the false third, and re-published the other two unmeasured — one of them is also false (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 318 — `check:claims`'s calendar case raced a real navigation against a fixed 400ms wait, turned `main` red once, and recovered on the next run without a code change. It is the file's ONE navigation-gated assertion that was not already using the file's own deterministic pattern (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 317 — 300.2's spike: the board's announcement cannot be decided once — 4 of the 5 things one generic core could not know are announcement strings — and the framework's answer to this screen kind already ships, saying something about itself that is not true (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 316 — 298.1: the second fixed-medium artifact was already here and PREDATES the first by 25 days. The two agree, and the half nobody wrote down is the load-bearing one — a theme token in `@media print` prints at 2.54:1 on white paper (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 315 — Objective grill of Slices 294, 312, 314: the gate written to catch a detector that cannot fail became one — `check:ci-ignores`'s `--self-test` has sat below an early return since 312.2 emptied `paths-ignore`, running 0 of its 18 cases while `check:selftests` reported it self-tested (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 314 — Standardize sweep, 4 of 4 lanes: lanes 1-4 clean, and the finding came from the re-scan step 4 mandates — 292.8's scope was "the whole page tree", and the 24 shared components/layouts that render INTO every page were outside every count it took (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 313 — 312.1 + 312.2: the honest reader set is FOUR gates, not two, and three of the four never spell the path at all. `paths-ignore` is removed rather than the reads, because keeping it means reversing three recorded decisions (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 312 — P0: `check:ci-ignores` asserts that nothing CI runs reads `.roundtable/**`, and two gates CI runs read it — one of them has the directory as a literal string in its own `ROOTS` array (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 311 — 294.1: the three probes are one line each, and the item's own reason for calling them harmless — "they arrive `@supports`-guarded" — is not a thing `derive-floor.mjs` can see. Adding the third opens the first hole in the floor where BCD says a browser will NEVER support it (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 310 — filed while closing 292.9: the two reference APPS hand a reader four deprecated glyphs that the docs gate deliberately does not cover, and `/base/motion` declares five copyable markup samples the page never renders (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 309 — Objective grill of Slices 307, 308: Slice 308 reproduces to the word, and underneath Slice 307's re-measurement is a P0 — the reference app's shared init has been swallowed by a trailing comment since 2026-08-23, so the select-all it timed did nothing (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 308 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's "the dispatch region is regrowing" is FALSE as stated — the section 274.2 cut has not regrown by ONE word, and the +877 is five new rules in five sections the cut never touched (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 307 — 296.2: the latency gate is REFUSED on the repo's own precedent, and the real defect was a published claim that cannot be reproduced by anyone else (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 306 — Rule 5's staleness line cannot reach `ok` from a cloud wake while the other dispatcher is a calendar day ahead (2026-09-06, triaged from inside a Continue round)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 305 — 296.1: the Gauntlet ran its full three-round budget and the artifact FAILED — the loop worked, the framework was never the gap (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 304 — Objective grill of Slices 300, 301, 303: 24 of 26 reproduce, and both failures are one defect — four figures quoted from a working tree that no commit ever held (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 303 — The framework's central promise was documented, demoed, and ungated: the layered-reset recipe is now executable (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 302 — Step 1 mandates two intakes and a cloud wake could execute neither command; the Discussions half had no substitute at all, so the rule was unrunnable rather than merely awkward (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 301 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 carried the eleventh archive sweep — 37.1% closed history down to 7.2% [**Corrected by 346.1:** 8.4%, per Slice 304's correction in this slice], the largest single move on record (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 300 — P0: the first two issues ever filed against this package, and the shipped CLI crashes on its own documented usage (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 299 — The SAME Objective grill, run twice by two dispatchers: this one lost the race and re-dispatched, and the re-dispatch is what caught the two things the winner did not — a metadata baseline that matches no revision of its gate, and the count Slice 298 diagnosed and left uncorrected (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 298 — Objective grill of Slices 292, 293, 295: 44 of 47 assertions reproduce, and the two real defects are a durable file that reads as universal and a claim I made about my own work (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 297 — Owner call: feedback intake stays on GitHub, and Discussions are enabled because issues were the only door (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 296 — Owner direction: a Gauntlet loop aimed at next-generation ERP UI, and 21st.dev read as a reference rather than a template (2026-09-06)

**Input**: the owner asked for (a) a **gauntlet loop** whose goal is "the new
generation ERP UI — performance, UX best for the user, scalable, secure,
modern", (b) `https://21st.dev/` explored, and (c) the roadmap updated so the
**scheduled** loop can run it.

**(c) needed no scheduling change, and that is worth recording rather than
silently relying on.** The wake prompt the owner pastes — and the cloud
routine runs — deliberately restates no dispatch order: it says *"act as the
Roadmap dispatcher exactly as `LOOPS.md` specifies… evaluate the dispatcher
rules in the order that file states them"*. That was a deliberate fix
(roadmap 102.4) after an earlier prompt drifted for weeks. So **adding the
loop to `LOOPS.md` is what schedules it**; no cron, routine or prompt was
touched.

**The loop is installed with NO counter and NO rule of its own.** It is
dispatched by rule 4 like any build item, when the oldest open item names a
gauntlet artifact. This file records **five** separate occasions where a
counter sat beneath an always-true condition and starved silently — Objective
alone lost ten slices — and a ninth dispatcher rule would be the sixth
instance. `LOOPS.md` §7 carries the playbook and states the overlap with
Polish, Objective and Continue explicitly, so a later wake can see why this is
not a duplicate of the blind re-score it resembles.

**The bar was adapted, not adopted.** The contribution's `BAR.md` graded
`ui_kits/` and `explorations/` against an `assets/` screenshot — none of which
exist in this tree. `.roundtable/gauntlet/BAR.md` now names references that
are actually here (`packages/core/media/list-report-compact.png`,
`check-po-app.mjs`'s route contracts, the reverted tree) and hoists the six
requirements every class shares out of the per-class lists.

**Two of the owner's five properties are NOT gradeable today, and the bar says
so instead of inviting a critic to judge them by feel.** This is the repo's own
base-rate rule applied to a rubric: a criterion nothing can measure is one the
builder argues past.

| property | instrument today | verdict |
|---|---|---|
| Performance | `check:size` gzip budgets over all shipped artifacts | **partial** — size only; no interaction-latency or render instrument, so an artifact may not claim runtime performance |
| UX / user-centric | Class B's five-minute blind task test | **gradeable** |
| Scalable | `/components/data-table`'s measured wide-table and 50-column demos | **partial** — a claim beyond what those measure needs a new instrument |
| Secure | **none** | **not gradeable, and the framework is the wrong layer** — it ships CSS and optional behaviours, holds no credentials, makes no requests, owns no data layer. The honest scope is a pattern page documenting the server contract it assumes, which is documentation |
| Modern | Class C: a guarded platform feature with the floor unmoved | **gradeable** |

**(b) 21st.dev, read against `references-are-floors`.** A community registry of
12,000+ React components distributed three ways — an **AI-ready prompt** pasted
into Claude Code or Cursor, the `shadcn` CLI, or copy-paste — on a
React + Tailwind + shadcn stack, with "you own the code, there is no version of
us to upgrade" as its stated philosophy.

**The stack is the one this framework refuses**, so nothing about React,
Tailwind or shadcn primitives transfers, and the contribution's own guide
already says its React wrappers exist for a design tool and not for the
product. What is genuinely interesting is narrower and is **already half-built
here**:

- **The ownership philosophy is this framework's existing position**, not a new
  idea to import: `dist/` copies into any asset pipeline, the cascade is the
  API, and there is no runtime to upgrade.
- **The AI-prompt distribution shape is the transferable part**, and the
  owner-supplied `registry.json` + `install-prompts.md` (Slice 294, item 2 of
  its order) are exactly that, rebuilt HTML-first. That is where this belongs —
  filed there, not duplicated here.

**Refused, so it is not re-proposed:** publishing to the shadcn registry
format as a distribution channel. `registry.json` in the contribution already
carries `$schema: ui.shadcn.com/schema/registry.json`, and shipping into an
ecosystem whose consumers expect React components would advertise this
framework as something it is not. The prompt half is the half that works
without the stack.

1. [x] **296.1 — DONE (refused at budget), Slice 305.** Run the first gauntlet round, Class A, on the reference this
       repo actually has.** Artifact: a rebuild of `/patterns/list-report` at
       `data-density="compact"`; reference:
       `packages/core/media/list-report-compact.png`. This is the smallest real
       exercise of the loop and it tests the loop itself as much as the
       artifact — a blind critic that cannot fail the builder is the failure
       mode to watch for.
       - **Accept** — the property, not a predicted verdict: a round is
         recorded in `.roundtable/gauntlet/ROUNDS.md` naming a critic that ran
         in a **fresh context** and did not see the build; the verdict is
         whatever it is, and a FAIL that stops at round three with the gap
         reported is a satisfying outcome. What would NOT satisfy this is a
         PASS graded by the builder, or a bar edited mid-round to make the
         artifact pass.

2. [x] **296.2 — DONE (refused, with the measurement), Slice 307.** An interaction-latency instrument, or a recorded refusal.
       The bar cannot grade "performant" beyond bundle size today. Either an
       instrument lands that measures something real in a browser — first
       input delay on a dense grid, time to interactive on the heaviest
       pattern page — or this closes as a refusal stating that size is the
       honest scope and why.
       - **Accept:** if built, it reports a number from a real browser run and
         is red-proved by making the measured thing worse; if refused, the
         refusal names what was measured to decide it. Finding that the
         existing `check:size` plus the data-table page's own measurements
         already cover the useful range is a satisfying outcome.

3. [ ] **296.3 — OWNER CALL: is "secure" in scope for this framework at all?**
       The bar currently says no, with a reason: the framework ships CSS and
       optional behaviours and owns no data layer, so a security claim would be
       about the *consumer's* server. The alternative reading is that pattern
       pages should carry a threat-model section the way they carry a data
       contract. **Not built either way without a decision** — it changes what
       every pattern page owes.

## Slice 295 — 249.15 built: the social card, generated from the framework's own stylesheet rather than drawn — and the gate arm it replaces had become undeleteable-by-design (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 294 — Triaged from an owner-supplied upstream contribution: six proposals arriving pre-sequenced, and the floor risk it names is real but already paid for (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 293 — Standardize sweep, 4 of 4 lanes: all four instrumented lanes clean for the fourth consecutive sweep, and the finding came from lane 1 FAILING — `ENVIRONMENT.md` §1c named a script deleted a week ago and missed the gate that actually needed the export (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 292 — Polish round 3 on `component/icon`: the page's Markup heading had been outside every `<section>` for 18 days, and the blind re-score then found the deprecation note resting on a **census** — "no pattern screen renders this glyph" — that a pattern screen falsifies (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 291 — Objective grill of Slices 286, 287, 290: 32 of 32 published assertions reproduce and the three slices carry no defect — so the finding is on the other side of the desk, where **4 of this grill's own 4 ad-hoc probes were wrong**, each one reconstructed from a slice's prose instead of run from the command beside it (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 290 — Standardize sweep, 4 of 4 lanes clean, and the reading that makes that honest rather than dead: the inputs three lanes measure did not move since Slice 284. Lane 4's carried worry — `LOOPS.md`'s dispatch region regrowing — did NOT continue, and step 1's one live candidate is refused by discrimination (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 289 — Objective grill of the three items built since the last grill (283.3, 284.2, 288.1/288.2): 22 of 28 assertions reproduce, all six that do not sit beside no command, and the one that matters put an **empty diff** into the Accept of an item that is still open (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 288 — 286.3 asked for a decision on `LOOPS.md` §3b step 4 and required its own base rate re-run first; re-running it is what found that **4 of its 7 independent-pass entries do not hold**, and that the step it calls dead has moved a score twice on real defects — the LABEL and the TRIGGER were the defect, not the content (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 287 — 283.3 asked whether an advisory check is enough, and the honest answer is that the question has an EMPTY DENOMINATOR: 0 Polish rounds have run since 283.2, so the check has never had a live opportunity to fire — closed by repairing the gap that IS measurable, the printed repair command nothing ran (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 286 — the defect Slice 285 listed under "what reproduced": 281's decay is dated to the hour and its CAUSE is false — `69a53364` is a pure addition that never touched the table, the table is still reached by the rule, and the claim was shipped in the `data-table` spacing cite (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 285 — Objective grill of Slices 281, 283, 284: 31 of 33 assertions reproduce, and the one that matters is the measurement a design decision was BUILT on — "0 of 18 stamps reproduce at the parent" is **16 of 18**, and it had spread into the shipped script's own docstring (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 284 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's finding is that 167.1's stated reopen condition for `CLAUDE.md` was MET — an eighth section on "can this detector fail" was added without folding, and the fold is this slice (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 283 — Polish round 3 on `table-toolbar`: the re-queue signal this loop's step 0 runs every wake is a CONSTANT for 7 of the 13 surfaces it reports, and 5 of those 7 were broken by 276.1 — the round whose whole subject was this script's blindness (2026-09-05)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input. Rule 2 `3 / 4 Continue rounds … ok`; rule 3
`1 / 3 slice … ok [281]`. **Rule 4 found nothing this wake can take**: all 12
open items were re-read from `ROADMAP.md` and each re-classified from its own
text per `LOOPS.md` 186.2 — owner-blocked (`112.3`, `112.4`, `249.7`,
`249.10`-`249.13`, `273.2`, Slice 15) or browser-blocked in the SCREENSHOT
sense (`249.6`, `249.9`, `249.15`; a LOCAL wake can take those three).
**Rule 4's sweep clause did not fire either** — `roadmap_scope.py` read
**218 / 3,398 = 6.4%** closed-history share at dispatch (`7079c94`), with Slice
282 the only eligible target. *(The previous hand-off predicted `0.0%` and 117 lines; the difference
is Slice 282's own text, which that prediction was made before writing. Read
the number, not the forecast.)* Rule 5 reports **STALE** — 2 wake-dates of
loop activity newer than the newest comparable pair — so per `LOOPS.md` it
**could not be evaluated** and is not reported clear. **Rule 6 matched.**

**The pick was re-derived, not inherited.** §3b step 1's ranking is degenerate
— every eligible surface is `content: 3` at `2/3 rounds, dry 0` (171.1 reaching
the pick step) — so the tiebreak is the one the last wake used: which surface's
SOURCE has moved furthest from the tree its score was taken against. Re-run
this wake rather than reusing the ordering, over each surface's own paths since
the commit that recorded its stamp:

```
table-toolbar  stamped 2026-08-25  7 commits since  churn +122/-17   ← picked
alerts         stamped 2026-08-31  5 commits        +46/-7
icon           stamped 2026-08-30  4 commits        +72/-4
```

`data-table` is out at `3/3`. `table-toolbar` leads on all three readings.

1. [x] **283.1 — DONE 2026-09-05. `polish_requeue.py` reports 13 surfaces as
       "SOURCE moved"; for 7 of them that sentence is a constant that no source
       change can set and no source change can clear. Five are 276.1's own
       doing, and every affected row is a behavior-serving surface: 7 of 9
       against 0 of 12.**

       **The round on `table-toolbar` is a NO-OP on the surface** — four arms,
       all clean, listed at the end. The defect is in this loop's step 0, which
       is where the last four rounds' findings have also landed (267.1, 276.1,
       278, 279); it was found by asking the arm nobody had asked, which is
       whether the ledger's own `src` column means anything.

       **What a re-queue claims, and when it stops being true.** A row says
       "source moved since the last round" by comparing a recorded digest
       against today's. That comparison is only meaningful while both were
       computed the same way. **276.1 widened the path set to include behavior
       modules and did not re-stamp the rows computed without them.** A digest
       over strictly more blobs can never equal one over fewer, so for those
       rows the two sides can never agree again — the re-queue is `True`
       unconditionally, and `--apply` has been reporting it as a measurement
       ever since.

       **Measured, with the command, over the 21-row ledger at `7079c94`:**

       ```
       python3 scripts/loops/polish_requeue.py --audit-stamps
       ```

       | verdict | rows | what it means |
       |---|---|---|
       | equals today's digest | 7 | not re-queued at all |
       | reproducible, current path set | 7 | the re-queue means what it says |
       | reproducible ONLY under the pre-276.1 set | **5** | stamped before the widening — permanently re-queued |
       | reproducible at no revision of its own paths | **2** | `data-table`, `pagination` |

       The five are `alerts`, `dashboard`, `stepper`, `table-toolbar`,
       `tree-table`, each reproducing **exactly** under the narrow set at the
       commit that recorded it (`alerts` → `4ee5ad51` is the narrow digest at
       `4beb4b86`, where the wide digest is `577cb919`).

       **The attribution is not inferred from dates — it is a clean split.**
       Nine ledger surfaces have behavior modules in their source set; twelve do
       not. **All 7 affected rows are in the first group and none is in the
       second** (the two behavior surfaces not affected, `inline-editing` and
       `scan`, both equal today's digest, i.e. were stamped after the widening).

       **The two `data-table`/`pagination` rows are a DIFFERENT fault, and it is
       stated as an inference.** Both closed their rounds after 276.1, so the
       widening cannot explain them, and 322 and 60 revisions of their own paths
       respectively reproduce their stamp under neither path set. Both stamps
       were written by a commit that ALSO edited the surface's source, and match
       neither that commit's tree nor its parent's — so the digest was taken
       from an on-disk state between the two. `digest()` hashes the **working
       tree** by design (145.3, its own comment), so running `--stamp` before
       the round's last edit produces exactly this. **The contrast is what makes
       it more than a guess:** `byline`'s round edited both its source files in
       the same commit and its stamp is the digest of that commit's tree, not
       its parent's. Same-commit stamping is fine; stamping before the last edit
       is not. §3b step 5 and this script's own USAGE both already say "at the
       END of a round" — nothing new is being asked for, so no rule is added.

       - **Accept:** the report says, for every surface it re-queues, whether
         the recorded stamp is reproducible from a commit, and the verdict is
         red-proved by injection with the injection confirmed to have landed
         **(DONE — below)**; the number of rows the audit calls unreproducible
         agrees with an independent walk of the same question **(DONE — two
         implementations, 7 and 7, agreeing row for row)**.

       **Red-proof, and what each injection proves.** The detector returns all
       four of its verdicts on real input — `reproducible` on 6 rows, `narrow`
       on 5, `orphan` on 2 — so it demonstrably discriminates before any
       injection. Then:

       - **A stamp no commit records.** `badge`'s `1f69e677` → `deadbe01`,
         asserted to be exactly 1 occurrence before replacing and confirmed at 1
         occurrence after. The row flipped from silent to
         `⚠ stamp unknown: no commit in the ledger's history records this
         digest`. Restored and re-verified at 1 occurrence.
       - **The condition is CLEARABLE by the documented mechanism, not just by
         a hand edit.** `--stamp component/alerts` wrote `ccdfb154` and the
         report went 13 → **12** surfaces with 7 → **6** warnings: the row left
         the re-queue set entirely, because a correct stamp equals today's
         digest. Restored.
       - **The `narrow` verdict is a path-set fact, not "the digests differ".**
         Computed outside the new code: `alerts` at `4beb4b86` is `577cb919`
         over 3 paths and `4ee5ad51` over 2, and the ledger holds the second.

       **What the cheap check does NOT cover, said outright.** `--check` runs at
       step 0 every wake, so it tests two revisions — the commit that recorded
       the stamp, and its parent. Its `orphan` verdict therefore means "not the
       digest at the commit that recorded it", which is a **superset** of "no
       revision reproduces it": a stamp seeded from a historical tree reads
       `orphan` and is fine. **`component/date` is the live case** — `orphan`
       to the cheap test, and reproducible at `3909b80a`, a day before the row
       was written, to the exhaustive one. It is excluded from the re-queue set
       (SKIPPED, deprecated) so no output claims otherwise, and this is why
       `--audit-stamps` exists rather than the cheap verdict being trusted.
       The two instruments were reconciled row for row on all 21 rows, not
       compared as totals.

       **Every figure above is read at `7079c94`, the tree this round opened
       against, and closing the round moved two of them.** §3b step 5's
       `--stamp component/table-toolbar` wrote `99f7ac9f`, and the report went
       **13 → 12** surfaces with **7 → 6** warnings — the picked surface leaving
       the re-queue set is the same clearance the `alerts` red-proof
       demonstrated, arriving as the round's ordinary last step rather than as
       an injection. So the committed tree reads 12 and 6; the 13 and 7 describe
       the state in which the defect was found.

       **Nothing was re-stamped, and that is a refusal with a measured reason.**
       Migrating the five to their wide-equivalent digest at the same commit is
       exact and preserves the row's meaning — and it **breaks its own
       detector**: `stamp_provenance` finds the commit that INTRODUCED a digest,
       so a migrated stamp would be introduced by the migration commit, where
       the source has since moved, and all five would re-read `orphan`. A fix
       whose own verification turns worse is not a fix. The durable form is
       283.2.

       **The four arms on `table-toolbar` itself, all clean.** (1) The ledger
       says "unscored in DSA" and `dsa-scores.json` carries no `table-toolbar`
       entry — consistent, and the page renders no stale *"Not yet scored"*
       block, which is 176.1's defect re-checked rather than assumed. (2) The
       wrong-choice clause is present and load-bearing: *"Do not add either to
       a read-mostly list"*, with the cost named (the table collapses to one Tab
       stop). (3) `PAGE_ONLY_BEHAVIORS` reconciles — the script's own assertion
       that the page imports `initTableToolbar` and `initDataGrid` passes, and
       the documented exclusion of `initDataTables` still holds. (4) The page's
       runtime claims are covered by `check:claims`, green in the gate run
       below. **No blind re-score was run, and that is deliberate**: §3b step 4
       exists so a round cannot mark its own homework, and this round changed
       nothing on the surface, so there is no score to mark. Recorded as a call,
       not an omission.

2. [x] **283.2 — DONE 2026-09-05 (cloud wake). The revision is recorded as an
       OPTIONAL suffix, seven rows migrated, and the item's own premise was
       half wrong: two of the orphans are not formula casualties at all.**

       **Dispatched by rule 4**, and the hand-off said rule 4 would not reach
       this item — *"rule 4 takes the oldest, and the nine older ones are all
       owner-blocked"*. **That reading is refuted by measurement.** Across all
       **917** revisions of `ROADMAP.md`, the oldest open item — Slice 15's *AT
       runtime evidence*, permanently owner-blocked on a human listening to a
       screen reader — has **never** been ticked `[x]`, while the loop log
       carries **573** `Continue` rows. If a blocked oldest item stopped rule 4,
       rule 4 could not have dispatched once in the life of this repo. It skips
       blocked items and takes the oldest *dispatchable* one, exactly as its own
       173.2 bullet describes.

       ```
       for sha in $(git log --format=%H -- ROADMAP.md); do \
         git show $sha:ROADMAP.md | grep -F 'AT runtime evidence'; done | grep -c '\[x\]'   # 0
       grep -c ' · Continue · ' .roundtable/loop-log.md                                     # 573
       ```

       **What shipped.** The `src` cell is now `<digest>` or
       `<digest>@<revision>`; `stamp_provenance` and `--audit-stamps` verify a
       suffixed stamp by ONE equality at that revision instead of searching;
       `--restamp SURFACE --at REV` performs the migration mechanically; and
       `--verify-stamps` runs advisory from `record_iteration.py`.
       `--check`: **12 re-queues with 6 uninformative → 10 with 0**.
       `--verify-stamps`: **7 → 0**. `--audit-stamps`: **2 DEAD → 0**.

       **THE REVISION CANNOT BE MANDATORY, AND THE ITEM ASSUMED IT COULD BE.**
       `--stamp` runs at the END of a round, which is BEFORE that round's
       commit, so the revision its digest describes does not exist yet.
       Measured over the 21-row ledger: every stamp that reproduces anywhere
       reproduces at the commit that **carries** it — **18 of 18** — and at that
       commit's parent, which is HEAD as `--stamp` saw it, **0 of 18**. A `@rev`
       written by `--stamp` would record the one revision the measurement rules
       out, on every row.

       > **CORRECTED 2026-09-05 by Slice 285.1 (Objective grill of 281/283/284).
       > The parent half of that measurement is wrong: it is 16 of 18, not 0 of
       > 18.** The `18 of 18` stands. What does not is `0 of 18` and the "on
       > every row" it carries — 16 of the 18 carrier commits never touched
       > their surface's own source (a NO-OP round commits the ledger and the
       > roadmap, not the CSS), so the digest at the parent is identical and a
       > mandatory `@HEAD` would have been RIGHT on those 16. Only `byline` and
       > `icon` — the two rounds that edited their surface in the same commit —
       > differ at the parent. **The decision to keep the suffix optional
       > survives on a different ground**, now recorded in `parse_stamp`:
       > `--stamp` cannot know whether the round will still commit a source
       > change, so it cannot write a revision it can *guarantee*, and a wrong
       > suffix is worse than an absent one because it is trusted by one
       > equality instead of searched for. See Slice 285 for the commands and
       > the reconciliation. So the suffix is written only where the revision is
       known by construction (`--restamp --at`, `--backfill`) and omitted
       otherwise. **Seven rows carry it, fourteen do not.**

       **283.1's refusal was right, and the suffix is what dissolves it.** It
       refused re-stamping because *"a migrated stamp is introduced by the
       migration commit and would re-read `orphan`"* — true, and confirmed:
       reconciling the two implementations row for row gives **6 agree, 5
       disagree, and on every disagreement the lookup is right**, because the
       search cannot resolve a stamp whose digest is not the tree at the commit
       that introduced it. That is the Accept's "disagreement recorded with
       which one is right", and it is the justification for the format rather
       than a wrinkle in it.

       **THE PREMISE WAS HALF WRONG: the two `orphan` rows are a DIFFERENT
       BUG.** The item reads *"every fault in 283.1 reduces to this"*. It does
       not. `data-table` and `pagination` were not orphaned by 276.1's path-set
       widening — `--stamp` ran mid-round and the round then **edited the
       surface's source again before committing**, leaving the stamp describing
       a working tree no commit carries. Proved exhaustively, not inferred:
       every committed blob combination was enumerated — **2** candidate trees
       for `data-table` (only `data-table.css` differs between its commit and
       the parent), **4** for `pagination` — and **none** reproduces the stamp.
       A recorded revision would not have prevented either; what catches them is
       `--verify-stamps` after the commit, which is why that shipped too.

       **The five were four before the work started.** 283.1 measured five
       formula-orphaned rows; `table-toolbar` cleared itself through the
       documented mechanism (a round ending in `--stamp`) in between. Re-derived
       per CLAUDE.md's premise rule rather than carried over.

       **Which rows still re-queue, as the Accept required.** All four migrated
       formula-orphans (`alerts`, `dashboard`, `stepper`, `tree-table`) **still
       re-queue** — their source genuinely moved since their recorded revision.
       So 276.1's orphaning cost *false confidence, not a missed round*, which
       is what 283.2 itself predicted, now measured. The two mid-round rows
       **stop** re-queueing, correctly: their source is unmoved since their own
       round's commit. That is the whole behavioural delta, 12 → 10.

       **Red-proved by injection, both directions.** Widening `source_paths`
       with one extra file — asserted present in the path set the gate reads
       before believing anything — takes `--verify-stamps` to 21 of 21, and the
       verdicts **discriminate**: all **7** suffixed rows report `path-set`
       ("the set this surface is computed over has changed since the stamp was
       written"), all **14** bare rows report an undiagnosed `orphan`. That is
       exactly the contrast the Accept asked for — the new form *says* a
       path-set change happened where the old form cannot tell it from source
       movement — and it reproduces 276.1's silent failure on demand. Injection
       reverted and re-confirmed absent. The advisory wiring was red-proved
       separately by discrimination: clean ledger → no stderr block; one stamp
       corrupted (asserted at exactly 1 occurrence before replacing) → a block
       naming exactly that row.

       **One dead detector was caught and killed inside this item.** The first
       version of the self-explaining `orphan` message asked whether the
       introducing commit touched the surface's own source with
       `git log -1 <rev> -- <paths>`. That form walks **back** from `rev` and
       answers with the newest touching commit at or before it, so it is
       non-empty almost always: it claimed `f57570f4` touched `component/date`'s
       source (it touched none of it) and answered `a098cf85` — a different
       commit — for `6cb26268`. Replaced with `git diff-tree --no-commit-id
       --name-only -r <rev>`, which discriminates: the two mid-round rows get
       the mid-round diagnosis and `date` correctly gets the plain orphan. Found
       by the message disagreeing with a probe taken minutes earlier, which is
       the only thing that ever catches this shape.

3. [x] **283.3 — DONE 2026-09-06 (cloud wake), and the answer is neither branch
       as written: the sufficiency question has an EMPTY DENOMINATOR — 0 Polish
       rounds have run since 283.2, so the advisory check has never had a live
       opportunity to fire. Closed by shipping the self-healing branch instead,
       at the one step whose write lands in the round's own commit. See Slice
       287.** Original text follows.

       **`--stamp` cannot verify its own output, and the fix for that
       is ordering plus an advisory check. Is that enough?** 283.2 shipped
       `--verify-stamps` (advisory, post-commit) and a `LOOPS.md` rule that
       `--stamp` runs last. Both were the affordable fix, and neither *prevents*
       the fault — a round that stamps early still ships a dead stamp and learns
       about it one command later, if whoever is reading stderr notices.
       - **Accept:** either a mechanism that makes an early stamp impossible or
         self-healing (e.g. `--stamp` recording the paths' blob SHAs so a later
         edit is detectable without a commit, or the stamp being written by the
         commit itself), **or** a recorded refusal measuring why the advisory
         check is sufficient — including how many rounds since 283.2 stamped
         early, which `--verify-stamps` now makes countable. **Finding the
         advisory check sufficient is a satisfying outcome**; the base rate is 2
         in the 21 rows this ledger has ever held, both on one day.

       **283.2's ORIGINAL TEXT AND ACCEPT, kept verbatim below** on the
       precedent of Slice 147's owner call — the premise corrections above are
       only checkable against what the item actually said.

       > **the ledger records a digest with no revision beside it, so a
       stamp cannot be audited or migrated without guessing which commit it
       describes.** Every fault in 283.1 reduces to this: the `src` cell says
       *what* the source hashed to and never *when* or *over which path set*,
       so a formula change silently orphans every existing row and the only way
       back is a search over history that can be wrong (`component/date`).
       A stamp that carried its revision would make `--audit-stamps` a lookup,
       make migration after a path-set change mechanical, and make the two
       `orphan` rows self-explaining.
       - **Accept:** a stamp records the revision it was taken against as well
         as the digest; `--audit-stamps` reads that revision instead of
         searching for it, and its verdict for every row agrees with the
         current searching implementation on the tree as it stands **or the
         disagreement is recorded with which one is right**; the five
         pre-276.1 rows are migrated to the current path set at their own
         recorded revision and stop re-queueing unconditionally, verified by
         `--check` reporting them only when their source has actually moved;
         and a red-proof shows the new form catching a path-set change — widen
         the set in a throwaway edit and confirm the audit says so rather than
         reporting every row moved. **Finding that a migration is not worth the
         format change is a satisfying outcome**: record which of the five
         would still re-queue on their genuine source movement (all five have
         moved since their stamp, so the practical cost today may be only the
         false confidence, not a missed round).

## Slice 282 — the twelfth archive sweep, taken 3.5 hours after another wake REFUSED it: 13 slices moved, and the finding is that the five recorded sweep decisions lie on no threshold in either unit — the tenth ran at 3,790 lines / 55.1% and today's refusal came at 5,450 lines / 40.6%, a longer file refused for being a smaller fraction closed (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 281 — Polish round 3 on `data-table`: the `spacing` cite's worked example stopped being reachable by the rule it explains ONE DAY after it was measured, and all three live copies had also dropped the sentence separating the two effects it describes (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 280 — Objective grill of Slices 276, 277, 278, 279: 52 of 54 assertions reproduce, and the two that do not are one sentence apart in a table that measured the tree BEFORE its own fix while describing the tree after it — the two rows it dropped are the two surfaces that same item added (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 279 — Polish round on `scan`: the demo runs, and the finding is that the ONE pattern screen the component's own page points at is the one that never links it back; then reading the counter right after recording found rule 3 has been blind to 12 closed slices for the whole Polish-dispatched era (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 278 — Polish round on `table-toolbar`, the surface every prior round dropped: the two behaviors this page documents as a pair make the grid keyboard-unreachable when they meet — hiding the column the cell cursor sits in strands the grid's ONE tab stop on a `[hidden]` cell (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 277 — Polish round on `pagination`: six cites hold, and the finding is a runtime claim published in four places, asserted in none — `data-load-more-auto`'s only test says it *does not throw* in an environment where the feature cannot exist (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 276 — Polish round on `inline-editing`: every arm on the surface reproduces, and the finding is in step 0's own source map — a surface's source set stopped at CSS, so 31 commits changed a behavior module with nothing to notice [**Corrected by 346.1:** 51 commits across 9 surfaces, per 280.1] (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 275 — Objective grill of Slices 271, 272, 273, 274: 271 and 272 reproduce whole, and all three defects are one shape — a figure the wake's OWN commit moved, read from `HEAD` and published as the commit's state (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 274 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4's finding is that its own instrument measures the wrong box — `LOOPS.md`'s every-wake DISPATCH region grew +300% where the file grew +220%, so the row a sweep reads understates the burden it exists to catch (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 273 — Polish round on `byline`: six cites hold and five arms reproduce, and two findings — the reason `LOOPS.md` records for `dry = 0` was false in the commit that wrote it, and the blind re-score found the page recommending the context its own wrong-choice clause forbids (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty; `HEAD` at `14947d1` with no local `main`) —
ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,877** commits, no `shallow.lock`)
and `git fetch --tags origin` brought all **seven**, so trap 2 did not bite —
the hand-off's instruction to fetch tags explicitly rather than expect either
outcome is what made that a check instead of an assumption. Rule 1: no open P0
— `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and no
open `N. [ ]` item is a P0. Step 1 triaged and committed nothing: no new input.
Rule 2 **3 / 4 … ok**; rule 3 **2 / 3 … ok [271, 272]**.

**Rule 4 found nothing dispatchable**, and per `LOOPS.md` 186.2 the kind is
named rather than lumped, each item re-read from `ROADMAP.md` this wake rather
than copied from the hand-off: **owner-blocked** Slice 15, `112.3`, `112.4`,
`249.7` (its own text holds its seed for 249.10), `249.10`-`249.13`;
**browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these)
`249.6`, `249.9`, `249.15`; **agent-blocked** none; **not blocked** none.
Rule 4's own sweep clause did not fire either: `roadmap_scope.py` reads
**837 / 3,689 = 22.7%** closed history, of which **673 lines are the four
targets 236.2 pins to open Slice 249**, leaving Slice 272 alone — one slice,
moved one wake ago — as the whole eligible scope.

Rule 5: `dispatch_status.py` reads `2 wake-date(s) newer … STALE`, so the trend
clause **could not be evaluated** rather than being reported clear. The rule's
SECOND clause (184.2's, "a size budget breached outright") **was** evaluable and
is clear — `check-size.mjs` passed at *139 shipped payload file(s) in 11 budget
bucket(s), 376.2 kB gz total; tightest headroom 110 bytes*
(`css/brand-navy.min.css`), the same reading 268 recorded. Rule 6 fired.

### The pick

§3b step 1: every non-skipped row scores 3, so "lowest score" does not
discriminate and "fewest rounds used" does — **4 rows at `1/3`** against 16 at
`2/3`. 268's rule drops `inline-editing` and `table-toolbar` (no
`dsa-scores.json` entry, so no arm can disagree with them), leaving `byline` and
`pagination`. `byline` taken.

### `byline`'s own six cites all hold

Checked at the source, comment-stripped where the claim is about declarations.

- **typography** *"sizes from `--bo-font-size-sm/xs`; no raw font-size"* — both
  tokens present, **0** raw `font-size` values.
- **colour** *"zero raw colour; name is emphasis ink, remainder secondary"* —
  **0** hex/`rgb(`/`hsl(`; `--bo-color-text-secondary` on the base and
  `--bo-color-text-primary` on `strong, b`, exactly as claimed.
- **spacing** *"zero raw dimension literals — the whole file is tokens"* — holds
  on the unit-bearing reading arm 5 uses. `min-inline-size: 0` is the one bare
  number, and it is **not** a byline literal: the same idiom appears in **16**
  component files. Recorded because it was the round's most promising-looking
  defect and the base rate is what refuted it.
- **interaction: `na`** *"plain markup, no behavior"* — holds on both readings
  the ledger now has: `behaviors.json`'s `byComponent.byline` is `[]` (arm 9)
  and `byline.css` paints **zero** interaction-state selectors (arm 10).
- **content** — the quoted clause renders on the built page (arm 4), and
  `check:wrong-choice` passes at *156 assertions / 80 pages / 1 outstanding*.
- **fit** *"record headers, comments, feed items, audit notes; composes
  `.bo-avatar` rather than owning a disc"* — the opener names all four contexts;
  `byline.css` paints no disc and says so in place.

`byline.css`'s comment also asserts a fact about **another file** — *"Breaking
(listed in the CHANGELOG)"*. It holds: `CHANGELOG.md:1265-1271` carries the
`.bo-avatar` promotion as a **Breaking** entry in those words. It is the only
such cross-file claim in the shipped CSS (`grep 'in the CHANGELOG'` → 1).

### The arms

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` in **0** dist files |
| 3 line-number cites | **0 of 40** — 266's fix has not regrown |
| 8 `interaction: na` pages importing a behaviour | **0 of 16** |
| 9 `interaction` vs declared `@serves` relation | `na`&served **1** (`stepper::initWizard`); 3&served 17; 3&none 7; `na`&none 15 |
| 10 `interaction: na` painting its own state | **1 of 16** — stepper, 3 × `[aria-current` |
| 13 **NEW** — cites naming another component's class | **17/17** resolve against `api.json` |

Arm 9 **reproduces 268's table with breadcrumb's fix applied and nothing else
moved** — `3/none` 6 → 7 and `na/none` 16 → 15, the two cells 269's `na`→`3`
had to touch, with `3/served` unchanged at 17. That is the independent
reconciliation, not the arm's own say-so.

**Arm 9's first implementation returned `served = 0` for all 40**, because it
looked `byComponent` up by CSS class where the file is keyed by component name.
Caught by this repo's own rule — an identical value across many inputs is a
defect in the instrument until proven otherwise — before any verdict rested on
it, and the corrected arm is what the table reports.

### Arm 13, and why its 17/17 is not offered as a gate

Red-proved by injection, the injection confirmed before the red was believed:
renaming `byline · fit`'s `.bo-avatar` to `.bo-avatarr` (asserted absent from
`api.json`) takes the arm 17/17 → **16/17** naming that exact cite. So it can
fail. But resolution is not truth, and the arm's value is in the second
reading, which is a human one: of the three cross-component claims spot-checked,
`progress · fit`'s *"the source names `.bo-stepper`"* holds at
`progress.css:8`, `byline · fit`'s composition holds, and `sidebar-nav · fit`'s
*"composes inside `.bo-offcanvas`"* holds as real DOM nesting on **117 of 165**
built pages — not as file co-occurrence, which is the weaker reading this
repo has been caught by before. A 100% existence check that distinguishes
nothing today is 94.11's refused gate, so arm 13 is reported, not shipped.

1. [x] **273.1 — the finding: `LOOPS.md`'s reason for `dry = 0` was false in
       the commit that wrote it.** Parsed over **all 30 revisions** of
       `.roundtable/polish-state.md`: `budget_spent = 0` and `dry > 0` count
       **0 in 30 of 30**, so the numeric claim still holds on a denominator
       that has grown from 11. The **reason** does not. It read *"every seeded
       surface landed its clause in one round, so nothing ever got a second
       round to be dry in"* — written in `eb7fd36c` (2026-08-28 16:41:03Z), a
       revision whose own ledger already carried `component/scan` at `2/3`.
       Today **16 of the 20 non-skipped rows carry a second round** — **CORRECTED
       by 275.2 (2026-09-05): 16 is the reading at `d8c9b5d1^`, and this slice's
       own commit `d8c9b5d1` makes it 17**, the seventeenth row being
       `component/byline`, the surface this very round was polishing. The figure
       was read from `HEAD` at dispatch and published as the state of the commit
       that moved it. The conclusion below is unaffected: `dry > 0` and
       `budget_spent` read 0 at all three revisions, so it survives on 17 exactly
       as on 16 — **8** of
       them recorded `NO-OP` on the surface, and `dry` reads **0** on all
       sixteen. So the counter is zero because **no round has ever incremented
       it**, not because no round could — and the two are not the same fact:
       one is structural and needs nothing, the other is bookkeeping that is
       not happening. Stated in both places `LOOPS.md` carried it (rule 6, and
       §3b's Exit), corrected in place rather than appended, because lane 4's
       ratchet reads `LOOPS.md` as accumulating with no cut behind it.
       - **Accept:** the parse is red-proved by injection **(done — a copy of
         the ledger with `byline` set `dry 1` and `pagination` set `3/3`, the
         injection confirmed present in the file, moves the reading from
         `dry>0=0, spent=0` to `dry>0=1, spent=1`)**; and `LOOPS.md`'s wording
         states the property to re-measure, not the value it will have.

**Sent to the owner rather than resolved here:**

2. [ ] **273.2 — §3b step 5 mandates `dry++` on a round whose score does not
       move, and no round has ever done it. OWNER CALL.** The conflict is real
       in both directions and neither side is safe to take unilaterally:
       - **Start incrementing** and the 8 NO-OP rows go to `dry 1`; the next
         no-op on any of them marks it DRY, forfeits its budget, and
         `polish_requeue.py` stops re-queueing it. Within a few wakes that
         empties the Polish lane — which is **exactly what 176.3 refused**,
         on the measured ground that the redundant-looking second rounds are
         the lane that finds the real defects.
       - **Leave it** and §3b step 5 is a written rule that nothing executes,
         which is the shape this repo keeps paying for (`check:resume-charter`
         hardened and demoted 44 minutes apart; rule 5 keeping only its dead
         half for six days).
       - The empirical input the owner should have: of the **8** rounds
         recorded NO-OP on their surface, **6** filed a real defect found
         elsewhere in the same round (231.2, 267.1, 268.1, 269.1, 270.1, and
         tree-table's base-rate correction); **2** — `badge` and `stepper` —
         found nothing at all. So "the score did not move" and "the round was
         busywork" have come apart 6 times out of 8, and `dry` as written
         cannot tell them apart.

         **RE-MEASURED 2026-09-05 (cloud wake): it is now 9 and 7, and the
         figure above was already one short when this hand-off quoted it.**
         `inline-editing`'s round (2026-09-05) filed **276**. The count and
         its instrument, so the next reader re-runs it rather than
         re-deriving:
         `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **9**,
         reconciled against the ledger's own table rows (same nine surfaces:
         alerts, badge, breadcrumb, inline-editing, navbar, progress, stepper,
         tree, tree-table). The two that found nothing are unchanged —
         `badge` and `stepper`. **This corrects the number, not the
         argument**: the ratio moved 6/8 → 7/9 and the conclusion is the same
         one, which is why it is amended in place rather than reopened. The
         figure goes stale on every Polish round, so **re-run the command
         before quoting it to the owner.**

         **It went stale on the very next round: 283 makes it 10 and 8.**
         `table-toolbar`'s round 3 (2026-09-05) is a tenth NO-OP on the
         surface and filed a real defect (283.1), so the same command now
         reads **10** and the ratio is **8/10**. Amended in place for the same
         reason as the line above — the number moved, the argument did not,
         and the two that found nothing are still `badge` and `stepper`.
         Two consecutive rounds now carry an in-place correction of this
         tally, which is itself input to the owner call: a figure that needs
         re-measuring every round is a poor thing to have hard-coded in the
         item that asks the owner to decide on it.
       - **Accept:** the owner picks one of — execute step 5 as written;
         redefine dry as "no score movement **and** no finding filed"; or
         delete the dry exit and say Polish runs until the owner stops it.
         Whichever is picked, `LOOPS.md` §3b step 5 and rule 6 agree with the
         ledger's own columns afterwards, asserted by re-running the parse in
         273.1 rather than by reading the prose.

### §3b step 4 ran, and it is what found the surface's own defect

A second agent was given the surface, the dimension and the rubric text, and —
per 268.2, which is the first round to apply that correction rather than record
it — was told **outright that the built page publishes a prior verdict, that
the published value is not evidence, and to reach its own reading from the page
source and the shipped CSS first**. It returned **3**, quoting the same clause
and naming the same `data-table` alternative.

**The direction of the bias is stated, per 268.2: this re-score AGREES with the
published value, so it is weak evidence for the score itself.** What it is not
weak evidence for is what it found unprompted, which no arm in this ledger
looks at: **the page recommends the context its own wrong-choice clause
forbids.**

3. [x] **273.3 — byline's wrong-choice clause forbids a POSITION while its
       reasoning forbids a PRACTICE, and the framework's own screens sit in
       the gap.** Three artefacts disagree, each measured this wake:
       - The opener says *"**Not inside the cells of a sortable grid**"* and
         draws its boundary at *"whether the reader scans DOWN a column"*.
       - `--compact`'s rationale said *"for dense feeds and table cells"* — in
         the docs heading **and in the shipped CSS comment the docs derive
         from**, which is the half that made it more than a typo. **FIXED this
         wake**, on a base rate rather than an opinion: of the **21** markup
         uses of `bo-byline--compact` in the repo (8 kanban, 5 notification,
         4 po-app, 2 report, 1 role-home, 1 its own page), **0** are in a
         `<td>` or `<th>`. The modifier's stated purpose named a context
         nothing used and the opener forbids.
       - **Still open:** `.bo-byline` appears inside a table cell on **2** built
         pages — `/patterns/settings-admin` and `/components/avatar`, whose demo
         is headed *"In context — assignee column"*. Both are a **name + avatar
         only**, so neither commits the packing the opener's reasoning actually
         objects to (*"actor and timestamp into one cell buries the value that
         differs inside two that repeat"*) — but both are squarely inside the
         position its headline forbids, and a reader following the clause would
         conclude the avatar page's own exemplar is wrong.
       - **Accept:** each of the two either changes, or the opener records in
         one line why a single-value name cell is not what the clause rules out
         — written so that finding the clause CORRECT as it stands is a
         satisfying outcome, not an off-plan one (149.1's shape). Whichever is
         chosen, `check:wrong-choice` still passes and the clause and the two
         screens no longer contradict each other, asserted by re-running the
         `<td>`-containing-`bo-byline` count over `dist` rather than by reading
         the prose.
       - **RESOLVED 2026-09-05 (cloud wake): the CLAUSE changed, not the two
         screens.** The premise was re-measured before it was acted on, per
         CLAUDE.md's premise rule, and it reproduces exactly: a jsdom parse of
         all **137** built pages finds `.bo-byline` on **10** of them and inside
         a real `td`/`th` on exactly **2** — `/components/avatar` (2 cells) and
         `/patterns/settings-admin` (3 cells), **5** cell-borne bylines in all,
         every one of them a name plus `__avatar` and nothing else. The probe
         is **red-proved by discrimination, before any real count was read**:
         the same selector returns 1 on a byline inside a `<td>`, 0 on one
         beside a table, and **0 on an escaped `<pre>` sample** — which is why
         it is a DOM parse and not a grep, since the copy-paste blocks on both
         pages carry `&lt;td&gt;` as text and a grep would have counted them.
       - **Why the clause and not the screens.** The two cells are the
         framework's own prescribed composition: `.bo-byline__avatar` exists to
         put a disc beside a name, `/components/avatar`'s opener names
         *"assignee columns"* as a use, and its `inTable` sample is the worked
         example. Changing the screens would mean either dropping that
         composition or inventing a second way to spell it — more API to say the
         same thing, which the Objective refuses. The headline was the artefact
         that over-reached: its own reasoning objects to *packing* three values
         into one cell, and a single-value name cell packs nothing. So the
         headline now names the practice — **"Not for packing actor, role and
         timestamp into a grid cell"** — and one added sentence names the
         exception and links it to `avatar`.
       - **Asserted against the BUILT artefact, not the diff.** After a clean
         rebuild: the old headline appears in **0** files under `dist` (it was
         also quoted in `dsa-scores.json`'s `content` cite, which is why 0 and
         not 1 — the cite was updated in the same commit rather than left
         quoting a string the page no longer carries), the new headline in
         exactly **1**, the exception sentence in exactly **1**. The
         `<td>`-borne count re-run after the change is **unchanged at 2 pages /
         5 cells**, which is the point: nothing moved on those screens, the
         clause stopped contradicting them. `check:wrong-choice` passes
         (**156** assertions, 37 components carry / 1 outstanding / 3 exempt)
         and `check:dsa-scores` passes (**360** assertions), so the
         `content = 3` cross-check still agrees with the reworded clause.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. The rendered
         change is one bolded clause and one added sentence inside a single
         `<p class="demo-note">` on `/components/byline`, plus the `content`
         cite `DsaScore.astro` renders on that same page. `check:layout` (390px
         and 150% zoom), `check:scroll` and `test:axe` all pass over it, so
         nothing overflows and nothing is unreachable — but **whether the longer
         opener reads well at 390px was seen by nobody.** That is the residue a
         LOCAL wake would close.

**This round is therefore NOT a NO-OP on its surface**, which matters for
273.2's tally: it belongs with the rounds that found a defect *on* the thing
they were scoring, not with the 8 recorded NO-OP, and it leaves those figures
unchanged.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The change to a rendered surface
is **two lines of text** — one `<h2>` on `/components/byline` and one CSS
comment, which postcss strips, so no `.min.css` byte moves. Overflow at both
widths is covered by `check:layout` (390px and 150% zoom) and `check:scroll`,
both run below; **whether the shortened heading looks right at 390px was not
seen by anyone**, and that is the residue a LOCAL wake would close.

## Slice 272 — the eleventh archive sweep, dispatched from inside rule 4 with rule 4 finding nothing else: 17 slices moved, and reading the four 236.2 refuses found that NONE of them is named by an amend clause — all four are provenance citations, and they stay put anyway (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 271 — `check:slice-refs` reaches the whole tracked tree: the fix for 270.1 is a DENYLIST, because an allowlist that omits a type nobody remembered *is* the defect — and reconciling the run line against an independent count found the gate's headline number counting the wrong noun (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 270 — Polish round on `tree`: all six cites hold, and the finding is that `check:slice-refs` cannot see the file extensions the shipped BEHAVIOURS are authored in — 11 slice references are cited from nowhere the gate looks (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 269 — Polish round on `breadcrumb`: all six cites hold, and the finding is that the only two blind re-scores this ledger has ever run that MOVED a score both left the entry's `scored` stamp behind — obeying a rule nothing had written down, and disobeying the one the file's own `$comment` states (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 268 — Polish round on `navbar`: navbar's six cites hold, and a new arm reading the rubric's own `na` boundary finds `breadcrumb · interaction` scored `na` seven hours before the clause that forbids it existed (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 267 — Polish round on `progress`: every arm reproduces, and the finding is in the loop's own step 0 — `polish_requeue.py --apply` reports the size of its argument, not the rows it wrote, and says "ledger updated" over a byte-identical file (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 266 — Polish round on `avatar`: 249.8's 3-line header moved every line-number pointer in the framework, and all four live ones were published or printed while pointing at the wrong line (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 265 — Objective grill of Slices 263, 264: both slices' own numbers reproduce, and both defects are in what shipped BESIDE them — a gate header that still encodes the declaration its own slice corrected, and an entity decoder consolidated everywhere except the one place a reader could see it missing (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 264 — 249.9's last no-JSON-key badge: which component a behavior serves is now declared, and the first declaration written from the headers' prose was wrong about one of the 26 (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 263 — Standardize sweep: all five lanes clean again, and the finding is again from none of them — three HTML-entity decoders in one directory, disagreeing on 8 of 11 inputs, where the fix one copy credits to a grill is exactly what makes it wrong on the mirror case (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 262 — 249.7's one banked gap measured against its own base rate: the symmetry gate is refused, and what survives is a hole in Dropdown's own wrong-choice clause (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 261 — 249.9's "no JSON key exists" is false, and the key it asked for is an inversion of one this repo already ships (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 260 — 249.15's tag half split out and landed: every built page now says what a shared link should show, and the three equalities are what makes the arm able to fail (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 259 — 249.9's two Accept clauses answered before the page is built: the miniature mechanism the item names does not exist, and two of its seven badges trace to no JSON key (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 258 — Objective grill of Slices 256, 257: 58 of 62 assertions reproduce, and two of the four that do not are the same defect the grilled slice records one item earlier — a real count of a set the sentence does not name (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 257 — Standardize sweep: all five lanes clean, and the finding came from none of them — the default-label rule was hand-copied into the scaffolder by the wake that introduced it, kept in sync by a comment, after it had already drifted once (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 256 — Objective grill of Slices 249 (.2/.3/.4), 254, 255: 57 of 60 assertions reproduce, both that do not are counts of the WRONG SET — a label group read as a browser floor and a width that is a platform scrollbar — and writing the report tripped a gate whose own comment exempts the file it fired on (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 255 — Standardize sweep: all five lanes clean, nothing to consolidate — lane 4's regrowth signal is 22.1%, well under the 55.1% that dispatched the tenth sweep three days ago, and lane 5's only two-count pair is a false positive by arity (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 254 — 249.16 built: the README screenshot, taken in the lane a cloud wake cannot reach — and the image that reads best is NOT the one the page shows (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 253 — Objective grill of Slices 247, 249, 252: 31 of 34 claims reproduce, and all three that do not are citations about citations — including one in the slice whose whole subject is citation decay (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 252 — Standardize sweep: lanes 1-3 clean a TWELFTH time, lane 4 dispatched the tenth archive sweep (13 slices, the largest single move since 228.1), and the fifth lane found the BCD walk hand-copied into both floor scripts (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 251 — 247.1 built: every live `file:line` citation into a rewritten/regenerated file is already self-documenting, and the one actual defect was in the handover file's own drift, not the roadmap's

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 250 — Objective grill of Slices 244, 245, 248: 28 of 28 claims reproduce, both red-proofs executed live, and the append-only citation-stability property survived an intervening rebase it could not have anticipated (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 249 — Triaged from an external docs-adoption-surface proposal (2026-09-03)

**Input**: a 16-item proposal comparing this repo (`5b3ab697`) against
`DibbayajyotiRoy/RoyUI@0e29468` plus eight reviewer notes, covering the "first
thirty seconds of contact" gap: bundle-size budget, page metadata, terminology,
maturity labels, a "choose your path" router, README, install commands, docs
recipe ordering, generated taglines, a visual catalogue, DESIGN.md's split, a
stability field, an outward "not for you" page, plus three open owner
questions and a lane of refusals. Full triage:
`.roundtable/grill-adoption-proposal-2026-09-03.md`.

**Every citation that a verdict depended on was re-run against the live tree
before trusting it**, per this file's own "a number you report is
load-bearing" rule — not read off the proposal's own text. Two did not
survive:

- The terminology-table item's own worked example was **backwards**:
  cited `components/offcanvas.astro` as missing the word "drawer"; the page
  actually uses "drawer" as its dominant vocabulary (15+ occurrences across
  headings, IDs, prose, and its own wrong-choice clause). No gap exists
  between the two cited pages.
- An "incidental" browserslist-vs-derived-floor mismatch is **not a
  defect** — `derive-floor.mjs`'s own header states it is deliberately
  independent of browserslist, computed from shipped CSS via BCD precisely
  because a hand-typed floor was once wrong. A derived floor one minor
  version above the declared browserslist target is the expected
  relationship. Refused as 94.11 ceremony — the predicate would be
  near-permanently true.

Everything else re-checked (bundle-size gate absent, page metadata absent,
DSA/floor/AT-evidence sourcing, README's 0 images/0 FAQ, install page's
npm-only, the recipe's demo-first/spec-last gate and its exact source
position, the hand-written sidebar/task-tile arrays, DESIGN.md's length and
dated-section count, the absent stability field) reproduced exactly as
claimed.

1. [x] **249.1 — DONE 2026-09-03. Bundle-size budget gate.**
       `packages/core/scripts/check-size.mjs`, wired into `build` as
       `check:size` immediately before `stamp-readme --check`. Eleven budget
       buckets cover all **139** shipped CSS/JS artifacts; every number is a
       gzip ceiling at current + ~10% headroom.

       **The premise needed correcting first, and the correction shaped the
       design.** "No bundle-size gate exists" is true of 138 of 139 artifacts,
       not of all of them —

       ```
       grep -rn -i budget packages/core/scripts packages/core/package.json .github/workflows
       ```

       returns exactly one enforcement: `build-rf-essentials.mjs`'s
       `RF_BUDGET_KB = 40` (roadmap 126.1), a MINIFIED-byte ceiling on one
       bundle, inline in the script that builds it. It is kept, not replaced —
       it defends an argued membership list, this gate defends transfer
       weight, and they fail for different reasons and read differently. So
       this generalises a precedent rather than inventing one.

       **gzip, against 126.1's explicit argument for minified bytes.** That
       argument (zlib-build drift; the 2026-08-16 CI failure on identical
       source) was about an EQUALITY check on a published string. Every number
       here is a ceiling with ~10% headroom. The claim is not left as an
       assertion that can go stale: the gate recomputes and prints the
       **tightest headroom in the whole table, in bytes**, on every run —
       today 110 bytes, `css/brand-navy.min.css`.

       **Red-proved live, four arms; each injection was confirmed to have
       LANDED before its red was believed.**

       - *per-file* — 2,062 bytes of unique CSS appended inside
         `data-table.css`'s `@layer` block.
         `grep -o 'bo-data-table--probe-' | wc -l` counts **28** in each of
         `dist/css/components/data-table.min.css`, `index.min.css` and
         `rf-essentials.min.css`; `npm run build -w @busy-office/ui` then
         exits 1 **at `check:size`**:
         `data-table.min.css is 2.28 kB gz > per-file budget 2.2 kB`.
       - *unbudgeted file* — a `dist/css/themes/nordic.css` no bucket claims:
         exit 1, the file named. A new shipped artifact must be budgeted
         deliberately, never absorbed by a wildcard.
       - *stale row* — `dist/css/brand-*.min.css` moved aside: exit 1,
         "budget row matched no shipped file". The reconciliation runs both
         ways.
       - *blown total* and *a multi-file bucket declaring no per-file max* —
         `--self-test`, which pins the classifier (14 cases) and the
         comparator (5) through the ONE `bucketOf`/`findBreaches` pair the
         real run uses, per check-rf-floor.mjs's lesson.

       **What the item did not name, and it decides the design: a
       group-total-only gate would have been GREEN on exactly the injection
       the Accept prescribes.** 2 kB of source CSS is **+0.37 kB gz**.
       `css/components/*.min.css` went 24.75 → 25.12 against a 27.3 budget,
       and `css/index.min.css` 15.10 → 15.53 against 16.7. Only the per-file
       arm fired. So both arms ship, and a bucket holding more than one file
       that declares only a total is itself a gate failure: a total alone lets
       one component balloon while its neighbours shrink, and a per-file max
       alone lets ten new components each land just under it.

       Current tree: 139 payload files, **371.7 kB gz** total. Not budgeted,
       with counts printed every run so the exemption cannot grow quietly:
       8 `.json` (build-time data, not per-page browser payload) and 31
       `.d.ts` (types, stripped before anything ships).
       - **Accept:** met. Fails on injection (four arms above), passes on the
         current tree, and raising a budget is a one-line diff — measured,
         not asserted: changing `css/components/*.min.css`'s `max` from 2.2 to
         2.4 produces a diff of exactly **-1/+1**.

2. [x] **249.2 — Per-page metadata: description, sitemap, robots.** `Gallery.astro`
       gains a required `description` prop (new `check-page-shape` arm fails a
       page without one); `@astrojs/sitemap`; a one-line `robots.txt`; one
       static OG image site-wide.
       - **Accept:** `grep -L 'name="description"' dist/**/*.html` returns
         empty; `dist/sitemap-index.xml` lists every built page; `check-links`
         stays green.

       **Baseline, measured before the change:** `grep -rl 'name="description"'
       dist --include='*.html' | wc -l` read **1 of 165** — the landing page,
       which has always hand-written its own `<head>`. Every other page was
       described to a search result by whatever an engine guessed from its
       body. The criterion was not vacuously true.

       **The Accept's glob over-reaches its own subject, and it is met over the
       page set this repo already defines rather than over the glob** — stated
       here rather than quietly narrowed. `dist/**/*.html` is 165 files; the
       built DOCS pages are **127**. The other 38 are two sets, and neither
       should carry a description:
       - **10 redirect stubs** (`<meta http-equiv="refresh">`). `dist-pages.mjs`
         has excluded them since the 2026-08-18 sweep — there is no content on a
         page whose only job is to bounce the browser — and the sitemap filter in
         `astro.config.mjs` now excludes the same ten, derived from that file's
         own `redirects` object so the two cannot drift. Describing a stub for
         indexing points a crawler at a page that is not a destination.
       - **28 `suite/` pages.** An app, not documentation, copied in by
         `copy-suite.mjs` *after* `astro build`, with its own gates
         (`npm run suite`). `dist-pages.mjs` carries the reason. Closing this
         half means threading a description through `_shell.mjs`'s `page()` and
         authoring 28 more — a second chunk of comparable size on a different
         app — so it is **249.14**, not an extra commit here.

       So the property verified is *every built docs page describes itself*, and
       `check-metadata.mjs` asserts it over `distPages()` — the one definition of
       "a built docs page" four gates converged on. **127 of 127**, up from 1.

       **The sitemap check is a reconciliation between two INDEPENDENT
       derivations, which is the only reason it can fail.** `@astrojs/sitemap`
       builds its list from Astro's route table; `distPages()` builds its by
       walking `dist/` for `index.html`. Generating the sitemap here from
       `distPages()` — the cheaper design, and the one first considered — would
       have made the gate compare a list against itself: green whatever broke,
       and precisely CLAUDE.md's *reconcile against the source, not against the
       argument*. The two sets agree at **127 = 127**, each reaching the same two
       exclusions separately.

       **Red-proved, injection confirmed before the result was believed** (six
       arms, each verified to have landed — a count grepped, a DOM read, or the
       thrown message itself):
       - *source page with no description* → `check-page-shape` fails naming
         `components/badge.astro` (confirmed: `grep -c 'description=' ` → 0).
       - *the required prop* → `astro build` throws
         `Gallery: page "Badge" (/components/badge/) needs a description prop…`.
       - *built page with the tag stripped* → `metadata check FAILED — 2 of 133`
         (confirmed: the meta count in the BUILT file went 1 → 0).
       - *two pages sharing one description* → fails naming both URLs. This arm
         exists because arm 1 passes in full on 127 identical descriptions,
         which is the copy-paste failure a 127-file bulk edit actually has.
       - *a built page missing from the sitemap* → fails (url count 127 → 126).
       - *a sitemap URL with no built page* → fails (127 → 128).
       - *`robots.txt` pointing elsewhere* → fails. `robots.txt` is static, so
         the published URL is spelled there a second time and cannot import
         `SITE_URL`; the answer to a copy this repo cannot delete is a gate that
         reconciles it, so the line must equal `SITE_URL + /sitemap-index.xml`,
         not merely look like a sitemap URL.

       **The bulk edit was verified against the RENDERED artefact, not the
       diff** (CLAUDE.md's rule, and its worked failure was labelling rows with
       other rows' names). Each of the 116 built pages was paired against its
       OWN `<title>` and its intended description: **116 of 116**. The first run
       of that probe reported 104 and eleven "mismatches" — every one its own
       entity handling (`&` renders as `&amp;`) plus an `index.astro` path built
       as `patterns/index/index.html`. An instrument's first output is not
       evidence; the descriptions were never wrong.

       **Not verified, and named rather than implied:** this was a cloud wake,
       so the 1440/390 light-and-dark screenshot lane could not run. Nothing in
       the diff renders differently — a `<meta>` tag, two XML files and a
       `robots.txt` have no visual surface — and `check:layout`, `check:scroll`
       and `test:axe` swept all 127 pages at both widths green.

       **The OG image is NOT done.** It is a rendered image, which a cloud wake
       cannot author honestly. Split out as **249.15** rather than left implied
       by a ticked box.

       Also landed, because it was smaller than explaining: the published URL
       was spelled out in `gen-llms.mjs`, `check-published.mjs` and
       `ai-assistants.astro`, and the sitemap needed a fourth. All three now
       import `SITE_URL`/`SITE_ORIGIN` from `paths.mjs`. Split in two because
       Astro joins `base` onto `site` itself, so handing it the full published
       root emits `/busy-office-ui/busy-office-ui/` — checked against a real
       `DOCS_BASE=/busy-office-ui` build, where the 127 sitemap URLs come out as
       `https://busy-office.github.io/busy-office-ui/…` exactly.
       - **Accept:** met, against the page set named above. All 17 CI entry
         points, re-derived from `ci.yml` rather than read off `ENVIRONMENT.md`'s
         snapshot, ran green in this container.

3. [x] **249.3 — Maturity labels with a real source. DONE 2026-09-03 (cloud
       wake).** Per component page: DSA-scored date (`dsa-scores.json.scored`),
       introduced-version, per-component floor, AT evidence rendering "none
       recorded" until the owner-blocked item closes (Slice 15's open `AT
       runtime evidence` row). A `Maturity` section on all 40 components, four
       facts each, every one read from a key.

       **THE ITEM'S OWN MECHANISM FOR "introduced-version" IS REFUTED, and
       that is the finding.** It said *"first tag containing the component's
       CSS file, computed at build"*. Measured before building — CLAUDE.md's
       rule that re-checking a premise is part of the criterion — a tag scan is
       **wrong for 38 of the 40 components**, for three independent reasons:

       - **0.1.0 was published and never tagged.** `git tag --sort=v:refname`
         starts at `v0.1.1`, so the **26** components of the first release
         would each be labelled one version late.
       - **`v0.2.0` is a tag with no release behind it.**
         `npm view @busy-office/ui versions --json` returns
         `["0.1.0","0.1.1","0.3.0","0.4.0","0.5.0","0.6.0","0.7.0"]` — no
         0.2.0, ever. **14** components would have been labelled "introduced in
         0.2.0", pointing a reader at an `npm i` that cannot resolve.
       - **A tag scan keys on a SOURCE path, and source paths rename.** The
         same probe reported `form` UNRELEASED. That was the probe's defect,
         not a fact: `src/css/components/form/` has never held a `form.css` —
         it holds five files — so `<dir>/<dir>.css` misses it at every
         revision. An instrument's first output is not evidence, and this one
         had a plausible story ready.

       So the source is **the published tarballs**, not git: for each version
       the registry serves, the earliest one whose tarball carries
       `dist/css/components/<name>.css`. That is CLAUDE.md's downstream rule in
       a new place — a tag is an *input* to publishing, not the published
       thing. Distribution: **26 at 0.1.0, 15 at 0.3.0, 1 at 0.5.0**, and two
       (`nav`, `record-card`) published once and since removed.

       **Reconciled against an independent derivation before it was trusted.**
       A throwaway probe in the scratchpad and `derive-introduced.mjs --refresh`
       were written separately and agree key-for-key on all 42
       (`JSON.stringify` equality). The record — `packages/core/src/data/
       introduced.json`, committed — is what an offline build reads, because
       neither git nor the registry is reachable from the docs container.

       **What shipped**

       - `packages/core/scripts/derive-introduced.mjs` — `--refresh` (network)
         rebuilds the record from the registry; the default build mode
         reconciles it against the stylesheets the build actually produced and
         writes `dist/introduced.json`, exported as `./introduced.json`.
       - `derive-floor.mjs` gains `perComponent`: the same probe set pointed at
         one component's sheet instead of `index.css`. **9 distinct floors
         across 40 components**, Chrome 99 → 119 — the label is worth printing
         precisely because it is not uniform, and **25** components floor at
         Chrome 99 where the framework floors at 119 — spread across **three**
         distinct labels that agree on Chrome and differ on Firefox/Safari,
         sized **20 / 3 / 2** (read the labels from `floor.json`; they are not
         typed here, per `check:floor`).
         *(Corrected 2026-09-03 by the Objective grill, Slice 256 finding A:
         this said "20 components floor at Chrome 99", which is the size of the
         largest label group, not the Chrome-99 set — 20 + 3 + 2 = 25. The
         command is in that grill; the error flattered the item, since 25 of 40
         is 63% at the framework's oldest floor rather than 50%.)*
         The framework keys are
         **byte-identical** to the pre-change file (`JSON.stringify(rest) ===
         baseline`), so the refactor moved nothing it was not meant to.
       - `apps/docs/src/data/at-evidence.json` — the hand-recorded AT register,
         empty today, naming Slice 15 as the blocker and `test:axe` +
         `check:forced-colors` as what automation covers instead.
       - `Maturity.astro`, mounted from `DsaScore.astro` — which
         `check-page-shape` already requires on every component page, so it
         reaches all 40 without a 40-file regex.
       - `check-maturity.mjs` (`@exact`), wired into `docs build` after
         `check-metadata`: **280 assertions**, 40 components across 39 pages.

       **Ten red-proofs, each with the injection confirmed first.** Four value
       arms by mutating a record without rebuilding (version, floor label,
       score date, AT record) — each failed exactly one assertion and named the
       component. Three structural arms by mutating the built HTML or the
       component set (block deleted, an emptied `<dd>`, a shipped component no
       page documents). Two guards on `derive-introduced` by exit code, not by
       message: an emptied record and a missing record both `exit 1` (checked
       with `>/dev/null; echo $?`, because the first attempt read `rc=0` — it
       was measuring `head`, not `node`). And the two branches live data cannot
       reach were proved by injecting into the record, rebuilding, and reading
       the built page: `button` with no published version renders *"Not
       published yet"*, `dialog` with an NVDA record renders it.

       **The third absence branch is unreachable BY CONSTRUCTION, and the
       injection is what showed it.** Deleting `tabs` from `dsa-scores.json` to
       reach *"Not yet scored"* turned the docs build red at
       `check:dsa-scores` — *"FAIL tabs: the page that renders its score has one
       to render"* — so the page never rebuilt and the probe read the STALE
       artefact and reported the string absent. The rc=1 is the only reason
       that was not filed as a rendering bug. The branch stays, mirroring
       `DsaScore`'s own fallback; it is defensive, not reachable.

       **`check:pseudo` found a real defect, twice, and neither round would
       have looked wrong in English.** Round 1 put the explanations inside the
       `<dd>`s: 9 of the gate's 14 sampled pages overflowed at 390px under
       ≥44% text expansion, every one naming the same expanded sentence at
       495px. Round 2 shortened the values to two words — and the same nine
       failed again, now naming a `<dd>` holding *"None recorded"*: the cause
       was the `<dt>`, because `.bo-kv--rows` is `max-content 1fr` and
       "Assistive-tech evidence" sizes that track. Plain `.bo-kv`
       (`auto-fit, minmax(11rem, 1fr)`) collapses to one column at 390 and
       passes. `check:layout` and `test:axe` were green through all three
       rounds — expansion is the only gate that could see it.

       - **Accept:** met. Every label on every built page traces to a key
         (`check:maturity`, 280 assertions), and each absence renders its
         stated string — two proved by injection, the third forbidden by an
         existing gate as recorded above.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item DOES
         have a visual surface — unlike 249.2 — and the honest statement is
         that its *properties* were swept and its *appearance* was not: no new
         CSS rule ships (the block is `.bo-kv` + `.bo-u-text-muted` +
         `.bo-badge`, all existing), and `check:layout`, `check:scroll`,
         `check:pseudo`, `test:axe`, `check:forced-colors` and
         `check:target-size` all passed across the tree at 1440 and 390. All
         **17** CI entry points, re-derived from `ci.yml`, ran green here, plus
         a `DOCS_BASE=/busy-office-ui` build (both new links carry the prefix).

4. [x] **249.4 — README: stamped gate count, who-for/not-for, FAQ.**
       *(The screenshot half is split out as 249.16 — see below.)*
       `derive-readme-facts.mjs` derives three repo facts into the committed
       record `packages/core/src/data/readme-facts.json`, and
       `stamp-readme.mjs` stamps them into both READMEs as `stat:gates`,
       `stat:notfor` and `stat:faq`.

       **TWO of this item's three source premises were false, and were measured
       before anything was built on them.**

       *Worth naming, because this slice's own header says every citation a
       verdict depended on was re-run against the live tree:* what that sweep
       covered on this item was the **README side** — "README's 0 images/0 FAQ",
       which reproduces exactly. The three counts the item's *mechanism* rested
       on are on the **source side** (`scope.astro`, `troubleshooting.astro`,
       the gate files), and none of them was in that list. Two were wrong. A
       re-check of the evidence for *whether* to build something does not cover
       the figures describing *what to build*, and the header reads as though it
       did.

       Commands, so the next wake re-runs rather than re-derives:

       ```
       ALL=$(find . -name 'check-*.mjs' -not -path './node_modules/*' -not -path '*/dist/*')
       grep -l -- '--self-test' $ALL | wc -l                              # 48
       grep -lE "argv.*includes\(['\"]--self-test" $ALL | wc -l           # 18
       grep -c 'Not for' apps/docs/src/pages/getting-started/scope.astro  # 0
       grep -cE '<h[1-6][ >]' apps/docs/src/pages/getting-started/troubleshooting.astro  # 3
       ```

       - **"count of `check-*.mjs` carrying `--self-test`" is the detector
         CLAUDE.md already records as unable to fail.** 48 gate files contain
         the literal string; only **18** contain the `process.argv` branch that
         runs one — because the tag text itself says *"Carries --self-test"*.
         Stamping the stated predicate would have published **48**, or **49**
         after any gate that merely mentions it. So nothing here re-counts:
         `check-selftests.mjs` now exports `scanGates()` and the deriver imports
         it, because a second regex over the same tree is a copy of a known trap.
         The published figure is **51 gates, 18 heuristic**.
       - **"the existing two 'Not for' clauses from `scope.astro`"** — `grep -c
         'Not for'` on that page returns **0**. It carries an `In scope` list of
         5 and a `Not in scope — decided, not forgotten` table of **7**; neither
         is spelled "Not for". The 7 table subjects are what shipped.
       - **"the five `troubleshooting.astro` headings"** — that page has **3**
         headings (2 `<h2>`, 1 `<h3>`), and its substance is an **11-row symptom
         table carrying no heading at all**. Shipped as the 11 entries plus the
         two `<h2>` questions.

         Two things measured against the BUILT page rather than assumed, with
         one command —
         `grep -oE '<h[123][^>]*>[^<]{0,70}' apps/docs/dist/getting-started/troubleshooting/index.html`:
         the built page carries **3** `<h2>`, the third being `Related`, the
         layout's own footer heading. So the deriver reads the SOURCE page, not
         the built one — parsing the built page would have counted layout chrome
         as an authored question, which is the failure CLAUDE.md's instrument
         section records. And **no heading carries an `id`**: raw `<h2>` in a
         `.astro` file gets no auto-slug, so the README links to the page, not
         to an anchor. Add ids first if a deep link is ever wanted.

       **Context safety, the trap `check:rtl` already paid for.**
       `stamp-readme --check` runs inside `npm run build -w @busy-office/ui`,
       which builds in contexts that copy only `packages/` (the po-app consumer
       image). So the deriver refuses to re-derive when an input is absent: it
       names each missing input on stderr, says the record was NOT rewritten and
       NOT verified there, leaves the record untouched, and exits 0. Verified by
       building a real packages-only tree and running both modes in it. The
       record lives in `src/data/`, not `dist/` — `files` ships `dist` only, so
       the tarball stayed at **183 files**.

       - **Accept (property, not prediction):** `npm run check:readme-facts`
         agrees with the repo and `stamp-readme --check` agrees with the record,
         both wired into `build`; each derived fact is red-proved by injection
         with the injection confirmed to have landed.
       - **Red-proofs, all with the injection verified before the verdict was
         believed:** (a) a row added to `scope.astro`'s table → `--check` red
         naming `notfor`; (b) a real gate file added → 51 → 52, `--check` red
         naming `gates`; (c) **the discrimination proof** — a prose mention of
         `--self-test` added to a gate that lacked the string, confirmed to move
         the literal count **48 → 49** while the argv count stayed 18 and the
         derived fact did **not** move; (d) a heuristic gate stripped of its
         argv branch → the deriver refuses to stamp at all rather than publish a
         count for a tree failing its own meta-gate; (e) each of the three
         markers corrupted in turn in both READMEs → `stamp-readme --check`
         rc=1; (f) a marker deleted → `requireAll` throws.
       - **Also fixed, found while doing it:** `stamp-readme`'s success line
         hard-coded *"size/behaviors/events"* while checking five stats. It now
         names them from the object.
       - **Not verified, named rather than implied:** this was a cloud wake, so
         the 1440/390 light-and-dark screenshot lane could not run. **No CSS,
         no docs page and no rendered surface changed** — the diff is two
         scripts, one JSON record, `package.json` and two markdown READMEs — so
         there is nothing here a screenshot could have shown. The docs gates
         were run across the tree anyway and are reported with the commit.

5. [x] **249.5 — DONE 2026-09-03 (cloud wake). Install commands for
       pnpm/yarn/bun — ADDED, and executed rather than written.**
       `getting-started/installation.astro` showed npm only, confirmed still
       true at dispatch: `grep -rniE 'pnpm|yarn|\bbun\b'` over `apps/docs/src`
       returned **0 files**, and over the whole repo (excluding
       `node_modules`, `dist`, lockfiles) the only hits were this item, its
       grill row and `STATUS.md`'s copy of it.

       **The refusal was weighed and lost on a measurement, not a preference.**
       The DA the item offers — "the no-bundler audience makes it noise" —
       argues about *bundlers*; the install line is for the npm-ecosystem
       audience, and the page already answers the no-package-manager case in
       its own paragraph two lines below. So the three were added.

       **What made this more than three lines of prose: the page's own opener
       claims everything on it is executed** — *"These steps are executed, not
       just written… If anything here stops working, that build fails."*
       Three unexecuted commands under that sentence would have falsified it,
       so `check:quickstart` gained step 3b, which installs the LOCAL packed
       build with each documented package manager and resolves the same four
       entry points step 3 resolves for npm. Page and gate read ONE list,
       `apps/docs/src/data/package-managers.mjs` — the `MARKUP_RULES`
       precedent (shared by `ai-assistants.astro` and `gen-llms.mjs`), because
       a restated list is a list that drifts.

       **Measured here, all four green** (Node v22.22.2; npm 10.9.7, pnpm
       10.33.0, yarn 1.22.22, bun 1.3.11): each installs the 0.7.0 tarball and
       resolves `css`, `css/reset`, `css/tokens`, `css/components/data-table`.
       Install cost 191–561 ms each; the whole gate runs in **9.2 s**.

       **The red-proof found a real defect, and it is the finding worth
       keeping.** Step 3b's first version put each package manager's directory
       INSIDE the gate's temp dir — which already holds step 2's npm install —
       so Node's resolver walked up into `dir/node_modules` and every
       documented import resolved no matter what the package manager had done.
       The injection (yarn installing `is-number@7.0.0` instead of the
       package) was confirmed present in the file and the gate still passed:
       a detector that could not fail, exactly CLAUDE.md's shape. Fixed with a
       SIBLING temp root; the comment at the `pmRoot` declaration says why, so
       it cannot be "tidied" back.

       - **Accept (property, not prediction):** the page's install commands
         come from the same list the gate executes, and each documented
         command is either run or named as not run.
       - **Red-proofs, injection asserted to land before the verdict was
         believed** (each replacement refused unless it matched exactly once):
         (a) yarn pointed at a different package → red, naming
         `the documented import "@busy-office/ui/css" does not resolve after
         \`yarn add @busy-office/ui\``; (b) bun pointed at a nonexistent
         tarball → red, naming `the documented \`bun add @busy-office/ui\`
         does not install`; (c) a package manager that is not installed →
         **rc=0** with `NOT VERIFIED here — \`no-such-pm-xyz\` is not
         installed in this context` on stderr and in the summary line.
       - **Why (c) reports instead of failing:** bun is not on a stock GitHub
         runner, and a gate that turned CI red for that would be asserting
         something about the runner, not about the package. This is
         `check:rtl`'s precedent for a legitimately absent input — say it was
         NOT verified rather than claim a pass it did not earn. Whether the
         runner carries pnpm/yarn/bun is **not knowable from here**; the gate
         prints which ones it actually ran either way.
       - **Scope limit, stated rather than glossed:** `yarn` here is **1.22.22
         (classic)**, a flat `node_modules`. **Yarn Berry / PnP is NOT
         covered** — it resolves through a zip and no evidence was taken for
         it. The documented command is correct for both; the *verification* is
         classic-only.
       - **Also changed, and caused by this one:** the paragraph below now
         reads *"No package manager?"* rather than *"No npm?"*, since the
         three commands above it are the npm-ecosystem answers. The phrase
         appears nowhere else in the repo (grepped before editing).
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item has
         a small visual surface — one new `<p class="bo-u-text-muted">` with
         three `<code>` spans — and the honest statement is that its
         *properties* were swept and its *appearance* was not: **no new CSS
         rule ships**, the classes are existing ones, and the rendered section
         was read out of the BUILT page rather than off the diff.
         `check:layout`, `check:scroll`, `check:pseudo`, `test:axe`,
         `check:forced-colors` and `check:target-size` passed across the tree
         at 1440 and 390. All **17** CI entry points, re-derived from
         `ci.yml`, ran green here.

6. [x] **249.6 — DONE, Slice 328.** "Choose your path" router, corrected from the proposal's
       own undercount.** The proposal's evidence ("index.astro:118, one
       CTA") undercounted: the page has 2 CTA buttons, 4 nav links and 6
       task-tiles.

       *Corrected by Slice 253's grill, finding C.* This item used to say the
       cited line "is the install snippet". It is not, at any revision: line
       118 is the FIRST of the two CTA buttons
       (`Build your first screen`), line 119 is the second, and the install
       snippet is line **121** — and `index.astro` has not changed since
       `f1be2485`, well before this triage. The proposal's line reference
       resolved; only its count was wrong, so what is refuted here is the
       count, not the citation. The remaining figures reproduce: 2 CTAs, 4
       nav links, and 6 `bo-widget` cards under *"Find it by task"* (a
       descriptive name — there is no `task-tile` class).

       The real gap:
       every existing router (nav, tiles) sorts by *component category*, none
       by *adoption scenario* (add to existing app / new app / CSS-only / with
       behaviours / htmx / custom theme). A six-row block on `index.astro`,
       each row ending in a rendered screen.

       **MEASURED 2026-09-03 (cloud wake), and it re-scopes the item: THREE
       rows lack a qualifying terminal page, not one.** [**Corrected by 346.1:** Slice 328
       found this premise false — all three pages render live framework
       elements, and nothing was missing.] This item said "the
       theming row currently has none". That premise is a wake-old measurement,
       so it was re-run before dispatching, per CLAUDE.md's premise rule — and
       it undercounts the same way the CTA figure did. Against the BUILT tree,
       reading each scenario's natural terminal page:

       | scenario | terminal page | `demo-pair__preview` | pattern links |
       |---|---|---|---|
       | add to an existing app | `/getting-started/installation` | 0 | 1 ✓ |
       | start something new | `/getting-started/first-screen` | 3 | 3 ✓ |
       | CSS only, no JS | `/getting-started/scope` | 0 | 0 ✗ |
       | add behaviours | `/concepts/js-behaviors` | 0 | 0 ✗ |
       | htmx | `/getting-started/htmx` | 1 | 1 ✓ |
       | custom theme | `/concepts/theming` | 0 | 0 ✗ |

       So landing this needs three rendered screens, not one — or three of the
       six rows cut, which leaves a three-row "adoption-scenario router" that
       does not route the scenarios the gap names. **Deciding that is still
       part of the item; what changed is the price.**

       **THE GATE MUST ANCHOR TO THE PAGE'S CONTENT REGION, or it cannot
       fail.** Measured before writing the Accept, per 94.11: the docs shell
       lists every pattern page in its sidebar, so *"the page contains a
       pattern link"* read whole-page is **78–81 on all 31 learning-path
       pages** — a predicate uniformly true, i.e. a detector that cannot fail,
       and exactly the shape `check-learning-path`'s own header records three
       of. Anchored to `<section class="demo"` — the anchor that gate already
       uses — the same predicate reads **17 of 31 (55%)**, so it discriminates.
       The anchor cuts off the opener (`<h1>` sits ~1,000 chars before the
       first demo section), so any ABSENCE it reports must be re-checked
       whole-page before being believed; that is how the three ✗ rows above
       were confirmed.

       **DECLINED BY A CLOUD WAKE 2026-09-03, left open, and this is the
       screenshot sense of browser-blocked** (`LOOPS.md` 186.2's vocabulary):
       three terminal pages must gain a rendered result, and a new six-row
       block lands on the site's front door — evidence that is a rendered
       image a human compares. A LOCAL wake can take it. The measurement above
       is the part a cloud wake could take, and it is banked here so the next
       wake does not re-derive it.

       **DECLINED AGAIN 2026-09-04 (cloud wake), this time at the CLAUSE
       level, which is the question `RESUME.md`'s correction block says to
       ask instead of "is this item browser-blocked".** The answer is that
       this Accept has no separable cloud-takeable half: the arm cannot land
       green until the three ✗ rows gain something, and the two ways to give
       them something are a `Demo` (a rendered screen — `ENVIRONMENT.md`'s
       FIRST list) or a bare pattern link, which would be fitting the page to
       the gate rather than the reader. Choosing between those is this item's
       own open question (*"or three of the six rows cut"*), not a wake's to
       settle by padding. The premise was re-run rather than trusted: all
       three pages still read **0** `Demo` and **0** `/patterns/` hrefs in
       source — `grep -c Demo` and `grep -o "/patterns/[a-z-]*"` over
       `getting-started/scope.astro`, `concepts/js-behaviors.astro` and
       `concepts/theming.astro`.
       - **Accept:** each row's terminal page contains a `Demo` or a pattern
         link **inside its content region**, asserted by a
         `check-learning-path`-style arm that anchors the same way that gate
         does; a row ending in prose alone fails. The arm's red-proof asserts
         the injection landed in the BUILT page before the red is believed,
         and a whole-page reading of the same predicate is recorded beside it
         so a later reader can see why the anchor is load-bearing.

7. [ ] **249.7 — Terminology table, re-scoped after its own worked example
       failed verification.** Drop the offcanvas/drawer pairing (refuted
       above — no gap exists). Before landing `src/data/terminology.mjs`,
       spot-check every remaining seed row (select/dropdown/combobox/value
       help/F4, grid/table/ALV, snackbar/toast/notification,
       master-data/CRUD/maintain, wizard/stepper/guided-procedure) the same
       way A3's citation was checked — against the actual built pages, not
       assumed. Hold the SAP/Fiori-specific rows (value help, ALV, guided
       procedure, F4, message, maintain) for 249.10 (owner vocabulary).
       Three consumers once seeded: a visible "Also called" line under
       `<h1>` (Pagefind-indexed), a `check-search.mjs` `@exact` arm per
       alias, and a glossary in `gen-llms.mjs`.
       **THE SPOT-CHECK RAN 2026-09-03 (cloud wake). Four of the five seed
       rows do not reproduce.** This is the Accept's first clause executed,
       not a new opinion: each row was grepped against the built pages it
       names, the same test that refuted the offcanvas row. Counts are of the
       page's own text (tags stripped), whole-page — the docs sidebar names
       every component, so an anchored reading undercounts, and every absence
       below was confirmed at whole-page 0.

       | seed row | pages grepped | verdict |
       |---|---|---|
       | select / dropdown / combobox | `combobox`, `dropdown`, `form` | **no gap** — the combobox page already reads `dropdown` 3, `select` 44, `autocomplete` 11; the dropdown page reads `select` 39 |
       | grid / table | `data-table`, `tree-table` | **no gap** — `grid` 10, `datagrid` 1, `spreadsheet` 1 on the data-table page |
       | snackbar / toast / notification | `alerts` | **partial** — `toast` 34, `alert` 46, `notification` 3; only **`snackbar`** is absent (0) |
       | master data / CRUD / maintain | `object-page`, `list-report` | **reproduces whole** — all three read 0 on both pages |
       | wizard / stepper / guided procedure | `stepper`, `patterns/wizard` | **no gap** — the stepper page reads `wizard` 1, the wizard page reads `stepper` 4 |

       Three of five are refuted the same way the offcanvas row was: the page
       already carries the alias as live vocabulary. The surviving seed is
       **one full row (master data / CRUD / maintain) and one single term
       (`snackbar`)** — plus `typeahead`, absent (0) from all three of
       combobox/dropdown/form, which no seed row named.

       **So the open question is now a cost question, and it is left open
       rather than settled here:** three consumers — a visible "Also called"
       line under every component `<h1>`, a `check-search.mjs` `@exact` arm
       per alias, and a glossary in `gen-llms.mjs` — built to carry **three
       aliases**. The Objective's less-for-more test is the one to apply, and
       249.10 (the owner's SAP/Fiori column) is what would grow the seed, so
       settling this before the owner answers 249.10 would decide it on the
       thinnest version of the input. **One thing measured here is worth
       keeping either way:** the dropdown page never names or links
       `combobox` in its own content (0 hrefs; the 2 whole-page hits are shell
       chrome), which is a *Related-link* gap, not a terminology one.

       **That clause is SPLIT OUT as 249.19 and LANDED (Slice 262,
       2026-09-04) — do not re-derive it.** Both readings above reproduced
       independently on the built tree, and the wake that took it measured the
       base rate before fixing anything: reciprocal linking is the exception
       at **29 of 97 pairs (29.9%)**, with **55** pairs where the target never
       names the source, so this gap is not distinctive and a symmetry gate is
       refused. The fix landed on a page-local argument instead. **Nothing
       about the terminology table moved** — this item is still the same cost
       question, still waiting on 249.10, and its seed is still one full row
       (master data / CRUD / maintain) plus `snackbar` and `typeahead`.
       - **Accept:** every row's claimed gap is independently reproduced by
         grepping the two pages it names, the same check that refuted the
         offcanvas row **(done — table above; a row that does not reproduce is
         dropped, and finding the seed empty is a satisfying outcome, not an
         off-plan one)**; then, if a table ships at all, deleting a row from
         it turns its search arm red.

8. [x] **249.8 — Component tagline + category, generated from the CSS
       header.** `/* @tagline … @category … */` in each component's CSS
       header, lifted into `api.json` by `extract-api.mjs`. Deletes two
       hand-written lists this repo's own gates already police drifting
       (`Gallery.astro`'s sidebar array, `index.astro`'s task-tile prose) and
       feeds 249.2's description, 249.7's terminology line, and 249.9's
       catalogue cards.
       - **Accept:** a stub component CSS file with the header updates
         sidebar/tiles/llms with zero hand edits on rebuild; omitting the
         header fails the build naming the file.
       - **LANDED 2026-09-03 (cloud wake).** Four directives, two required:
         `@tagline` (30-120 chars) and `@category` (one of eight in
         `extract-api.mjs`'s `CATEGORIES`); `@label` and `@order` optional and
         present only where the derived default is wrong (13 and 40 of 40).
         `api.json` gains `components[…].meta`, `api.categories` and
         `api.nav`; `apps/docs/src/data/component-nav.mjs` builds the sidebar
         groups and the homepage tiles from it, on the `pattern-groups.mjs`
         precedent. The 43-entry hand-written array is gone; 4 documented
         extras remain, each with a reason.

       **The item's premise was re-checked before building on it (CLAUDE.md's
       premise rule) and is half wrong — in the direction that strengthens the
       item.** "Two hand-written lists this repo's own gates already police
       drifting" holds only for the sidebar, and only one-way:
       `check-page-shape.mjs` failed when a component PAGE had no entry, and
       read neither the label nor the group. The tile prose was policed by
       **nothing**: `grep -rc "Find it by task" apps/docs/scripts
       packages/core/scripts` -> **0**, and the single script hit for a tile
       string (`Segmented control`) is a comment in `new-component.mjs`. The
       drift that predicts had already happened — the "Actions" tile listed
       **Combobox**, which the sidebar groups under Data input, and "Money
       field" and "Loading states" were labels no sidebar entry used.

       **Shape, measured rather than assumed:** 43 sidebar `/components/*`
       entries, 40 CSS dirs, **39** page slugs (skeleton + state share
       `state-patterns`; `alert` aliases to `alerts`). The 4-entry difference
       is 2 anchors (`form#dates`, `dashboard#card`) and 2 pages that document
       `data-table` behaviour with no stylesheet of their own
       (`inline-editing`, `table-toolbar`) — none of which has a CSS header to
       carry metadata, which is why they stay written down.

       **A pre-existing blind spot, found by a red-proof that came back
       green.** `check-page-shape`'s sidebar arm lived inside a loop over
       `src/css/components/*`, so `inline-editing` and `table-toolbar` — the
       two pages with no CSS dir — were **never reachability-checked**.
       Deleting the `inline-editing` entry (its mentions in the module went
       1 -> 0, injection confirmed) left the gate GREEN. The arm now walks the
       PAGES: 41 checked, and the same injection fails it naming the file.
       Same shape as the `scan` skip that comment already records.

       **Verified against what it RENDERS, not against the diff** (CLAUDE.md's
       bulk-edit rule). Full `dist` before and after: **45 of ~3,000 files
       differ — and 1 of 138 HTML pages.** That one is `index.html` (the
       tiles, the only intended visible change). The other 44: `llms.txt`
       (new `tagline:`/`category:` lines), `build-id.json` (a per-build
       stamp), and 42 unminified CSS files carrying the new header comment —
       **comment-stripped via postcss, all 42 are byte-identical**, and no
       `.min.css` changed at all. So the sidebar's 39 generated entries
       reproduce the hand-written array exactly, on every page that renders
       it.

       That claim is not vacuous and the check is not dead, both measured:
       a built page carries all **43** `/components/*` links server-rendered
       (`grep -o 'href="/components/[a-z#-]*"' … | sort -u | wc -l` on
       `dist/components/badge/index.html`), and changing **one** `@order`
       (badge 40 -> 5, injection confirmed) makes **41 component pages**
       differ against the same comparison that reports 0 for the real change.

       **Red-proofs, each with the injection asserted before the red was
       believed** — and the first harness was itself broken: `git checkout --`
       restored the *committed* file, which has no header yet, so two "reds"
       were red for the wrong reason. Redone against a real backup: @tagline
       removed (1 -> 0, names the file); `@category "Displays"` (names the
       file and lists the eight legal values); a 14-character tagline (names
       the file and the count); skeleton/state declaring different `@label`
       (names both dirs and the shared page); `@category` dropped from tabs.

       **The Accept's first clause was EXECUTED, not asserted.** `npm run
       new:component -- probe-widget --group=… --tagline=…` touched no shared
       file (`grep -c probe-widget Gallery.astro index.astro` -> 0, 0); after
       a rebuild the probe appeared in the built sidebar of an unrelated page,
       in `llms.txt` with its tagline and category, and — once given a
       category under the 5-name tile cap — in the built homepage tile
       (`Button · Dropdown · Segmented control · Probe widget`). The probe was
       then deleted. Two notes worth keeping: a scaffolded stub still cannot
       complete a full `docs:build` until its page has a wrong-choice clause
       and a DSA score, which is **pre-existing content-gate behaviour, not
       registration**, and no score was fabricated to get past it; and the
       scaffolder's own default label ("Probe Widget") disagreed with the
       extractor's ("Probe widget"), so it stamped a redundant `@label` — two
       derivations of one default, fixed to one.

       **Not verified, named rather than implied:** cloud wake, so the
       1440/390 light-and-dark screenshot lane could not run. 137 of 138 HTML
       pages are byte-identical so nothing there can have moved; for
       `index.html`, the tile cards were measured live in headless Chrome at
       both widths — 6 cards, grid height **281 -> 281** at 1440 and **854 ->
       854** at 390, with two individual cards swapping which is the short one
       (Actions lost "Combobox", Navigation gained names). **A "zero prose
       overflow" reading from that same probe is discarded as a dead
       detector**: a `<p>` shrink-wraps, so 400 unbreakable characters
       (injection confirmed at 400) still read **0**, and it only reached 263
       when the element was artificially clamped. Overflow is covered instead
       by `check:layout` (127 pages at 390 and 150% zoom) and `check:scroll`
       (912 containers x 2 widths), both green. All **17** CI entry points,
       re-derived from `ci.yml`, ran green in this container.

9. [x] **249.9 — DONE, Slice 329.** Visual component catalogue. Depends on 249.8 (tagline) and
       249.3 (maturity labels). `/components/` index: one card per component
       — name, tagline, CSS-only/JS-enhanced/JS-required (derived: component
       classes ∩ `behaviors.json` hooks), DSA score + date, floor, AT line,
       pattern links, a build-time miniature via `browser-harness.mjs`
       (already exists, used today for patterns via `PatternPreview.astro`).
       - **Accept:** every badge on a card either traces to a JSON key **or
         the card renders the absence and names its reason** — 249.3's
         "absence is rendered, never blank", and the audit below says which
         badge is which; the miniature-rendering build-time cost is measured
         and stated before this closes **(DONE — both routes costed below)**.

       **THE MECHANISM PREMISE IS FALSE — measured 2026-09-04 (cloud wake),
       per CLAUDE.md's rule that re-checking an item's premise is part of the
       criterion.** Neither half of "a build-time miniature via
       `browser-harness.mjs` (already exists, used today for patterns via
       `PatternPreview.astro`)" holds:

       - `browser-harness.mjs` has **13** consumers and **0** of them run at
         build time. Every one is a gate or audit invoked separately, after
         `astro build`, against `dist/`. Commands:
         `grep -rln browser-harness --include='*.mjs' --include='*.astro' . | grep -v node_modules`
         → 13; each of the 11 docs names checked against
         `require('./apps/docs/package.json').scripts.build` → **0** present;
         `packages/core`'s own build script matches neither `browser-harness`
         nor `puppeteer`.
       - `PatternPreview.astro` renders **no image and launches no browser**.
         It is a map of **10** hand-authored HTML fragments (of **39**
         patterns) drawn inline and scaled by a CSS custom property.
         `grep -E 'puppeteer|browser-harness|screenshot'` on that file → 0,
         and its own header states the scoping is deliberate: *"only patterns
         whose screens read at tile size get one — a dense list-report shrunk
         to 16rem is grey noise, and a preview that cannot be read is worse
         than text."*

       So "already exists" names a **different mechanism** than the one that
       ships, and the two have opposite cost shapes: the shipped one costs
       authoring per tile and zero build time; the named one costs build time
       and zero authoring. **That scoping sentence is the live design question
       this item now has to answer** — **40** components at tile size (from
       **39** pages) is exactly the case the pattern precedent refused for
       dense screens, and it refused it for **29 of 39** patterns.

       **COST, ROUTE A (the mechanism the item names).** One browser launch
       plus navigate-and-screenshot the first `<section class="demo">` on each
       component page, at 1440x900, against the built `dist/` served by
       `serve-dist.mjs` — i.e. the build step this item would add. Three runs
       in a cloud container; the probe is ad-hoc, not a gate, so the figures
       are snapshots:

       | | run 1 (cold) | run 2 | run 3 |
       |---|---|---|---|
       | browser launch, paid once | 2,337 ms | 259 ms | 243 ms |
       | wall for all 39 pages | **11,640 ms** | **8,013 ms** | **8,022 ms** |
       | median navigate / page | 106 ms | 87 ms | 88 ms |
       | median screenshot / page | 111 ms | 93 ms | 97 ms |
       | PNG bytes emitted | 1254 kB | 1255 kB | 1255 kB |

       So **~8 s warm, ~11.6 s cold, and +1.23 MB in `dist/`** — **8.8%** on
       top of the tree as built here (14,549,590 bytes over 526 files,
       `find apps/docs/dist -type f -printf '%s\n'`). Navigate p90 119 ms /
       p50 88 ms, screenshot p90 131 ms / p50 97 ms; slowest page
       `data-table` at 632 ms cold.

       **The byte column is stated at the precision it was taken, which is
       not the precision it is tempting to claim.** Only run 3's per-page
       bytes were kept (**1,284,734** exactly); runs 1 and 2 are the probe's
       own rounded kB print. So the honest reading is *the three agree to
       within 0.1% while the wall times move by 45%* — enough to reconcile
       the probe as measuring rendering rather than load, and NOT the
       byte-identical claim a first draft of this table asserted from one
       run's JSON.

       **39, not 40, and that reconciles rather than surprising:** `skeleton`
       and `state` share `/components/state-patterns/`
       (`api.pageSlug`), which is the pair CLAUDE.md's recipe already names.
       Every one of the 39 had a `<section class="demo">` — a 100% that is
       structural, not a dead detector: `check-page-shape` requires a demo
       section on every component page, so any other answer would be a gate
       failure.

       **COST, ROUTE B (the mechanism that actually ships).** Zero build time
       and zero bytes; the cost is authoring, and the shipped precedent has
       paid it **10 times in 39** patterns since 2026-08-23. This route has no
       measurable build cost to state, which is itself the answer the Accept's
       second clause wanted.

       **BADGE AUDIT — the Accept's first clause, run in advance against every
       component in `api.json` (n = 40).** Four resolve cleanly; **two trace
       to no JSON key at all** (`pattern links`, and the `JS-required` third
       of the maturity label), and **one traces to a key that is empty for
       every component** (`AT line`) — a distinct case, not a third failure:

       | badge | resolves | source |
       |---|---|---|
       | name | 40/40 *(tautological — the name IS the `api.json` key)* | `api.json.components` |
       | tagline | 40/40 | `meta.tagline` — 249.8 makes the core build **throw** without one, so this is structural |
       | DSA score + date | 40/40 | `dsa-scores.json` (`scored` = a date; 3 distinct: 2026-08-21/23/28) |
       | floor | 40/40 | `floor.json.perComponent` |
       | AT line | **0/40** | `at-evidence.json.components` is `{}`; the file's own `blockedBy` names Slice 15, owner hardware |
       | pattern links | **29/40**, and **no JSON key exists** | only the BUILT pattern pages' "Components used" lists (39 of them); `patterns-index.json` and `patterns.json` contain no such key |
       | CSS-only / JS-enhanced / JS-required | **binary, not ternary** | the intersection is computable; **nothing in the repo distinguishes "JS-required"** |

       Four consequences, each a real change of scope:

       1. **The AT badge is an absence on every card, not on some.** That is
          the state 249.3 built `Maturity.astro` to render, so this is
          designed-for rather than blocking — but a card laid out assuming a
          populated AT line is laid out for a case that does not exist.
       2. **Pattern links need a generator that does not exist, and it cannot
          read `dist/`.** `astro build` runs before every dist-walker in the
          build script, so a page consuming this mapping needs it emitted
          from source beforehand — the shape `gen-patterns-index.mjs` and
          `gen-patterns.mjs` already have, both of which run before
          `astro build` and read `src/pages/patterns/*.astro`.
       3. **11 components are named by zero patterns**: `breadcrumb`, `date`,
          `file-upload`, `icon`, `navbar`, `ordered-list`, `prose`,
          `richtext`, `sidebar-nav`, `tree`, `tree-table`. `date` reading
          zero is the deprecation working (45.3); the rest are the
          zero-reach question 150.1 already says is not automatically a
          defect. A card must render "no pattern uses this" without it
          reading as a fault.
       4. **The stated derivation over-reports, and the obvious fix
          under-reports.** `classes ∩ hooks` reads **23/40** — but
          `approval-workflow` matches on `data-state` alone, a vocabulary
          **6** components share and **6** behaviors hook, and no
          `approval*.ts` exists in `packages/core/src/js/behaviors/`.
          Anchoring the match to the component's own block instead reads
          **20/40** and drops `dialog` and `scan`, which are genuinely
          JS-driven through data attributes (`scan` is the documented
          attribute-only component `check-components-used.mjs` already
          carries an exception for). So one rule produces a false positive
          and the other two false negatives: this badge needs a recorded key,
          not a set intersection.

       **CORRECTION TO THE AUDIT'S `pattern links` ROW — measured 2026-09-04
       (cloud wake), and it is what 249.18 was split out to land.** Two of the
       three things that row and consequence 2 assert do not hold. The **29/40
       reproduces exactly**, from a route the audit did not use, which is what
       makes the rest of the correction believable rather than a second opinion:
       inverting `patterns-index.json`'s per-tile `components` gives 29/40 and
       the same eleven names, character for character.

       - **"No JSON key exists … only the BUILT pattern pages' lists" is
         false.** `src/data/patterns-index.json` has carried the relation per
         tile all along — `groups[].tiles[].components` as `{href,label}` — and
         `gen-llms.mjs:155` already republishes it in `llms.txt` as `uses:`.
         `node -e "const t=require('./apps/docs/src/data/patterns-index.json').groups.flatMap(g=>g.tiles); console.log(t.length, t.flatMap(x=>x.components).length)"`
         → `39 165`.
       - **"A generator that does not exist, and it cannot read `dist/`" is
         false, and it named the answer without recognising it.** Consequence 2
         describes building a generator "the shape `gen-patterns-index.mjs` and
         `gen-patterns.mjs` already have, both of which run before `astro build`
         and read `src/pages/patterns/*.astro`" — which is not a shape to copy
         but the script that already does it. The missing piece was the
         **inversion**, a dozen lines over data already in the tree, not a new
         page-parsing generator. That is the whole cost delta this correction
         buys.
       - **The eleven zero-reach names contain one FALSE zero: `sidebar-nav`.**
         `/components/nav` is a registered redirect to `/components/sidebar-nav`
         (`astro.config.mjs`), and `app-frame` and `suite-home` both cite the
         component by that old href — 5 links across the two pages. Matching
         hrefs literally, as the audit did, reads that as an absence.
         Redirect- and anchor-aware, the count is **30/40 reached, 10 zero**;
         the removed name is `sidebar-nav` alone, and the other ten stand. So
         consequence 3's list is ten, not eleven, and a card built on the
         literal reading would have rendered "no pattern uses this" for a
         component two patterns do use — the exact mis-render consequence 3
         warns about, arriving through its own input rather than its layout.

       **What this does NOT change:** the AT badge (0/40, Slice 15, owner
       hardware) and the JS-tier badge (consequence 4 — still needs a recorded
       key, not a set intersection) are untouched, and the deliverable is still
       a catalogue page whose point is rendered miniatures. Only the pattern-
       links badge's data half moved, and it moved to 249.18.

       **STILL OPEN, and browser-blocked in the SCREENSHOT sense**
       (`LOOPS.md` 186.2's vocabulary): the deliverable is a catalogue page
       whose point is rendered miniatures a human compares. A LOCAL wake can
       build it. What a cloud wake could take is measured above and banked
       here so the next wake does not re-derive it.

10. [ ] **249.10 — SAP/Fiori terminology column for 249.7.** Owner
        vocabulary — value help, ALV, guided procedure, F4, message, maintain.
        **OWNER CALL.**

11. [ ] **249.11 — "Migrate an existing admin UI" path.** No page exists.
        Which stack is the entry point decides whether this is one page or a
        pattern family. **OWNER CALL.**

12. [ ] **249.12 — Archival trigger for `ROADMAP.md`.** The archive-sweep
        *practice* exists (Slices 224, 228, 235.2, 237.1 all did one); no
        stated trigger (on slice close? every N slices?) exists. **OWNER OR
        ARCHITECTURE CALL** — low urgency, the sweep keeps happening
        regardless.

**Sent back to the owner rather than dispatched, because the proposal's own
justification doesn't hold:**

13. [ ] **249.13 — Reconsider demo-first/spec-last (the proposal's B1),
        explicitly, not as a ratification.** The facts check out exactly —
        `data-table.astro`'s Markup section is its 18th and last `<h2>`,
        `check-page-shape.mjs` gates the position with test cases proving it.
        But the proposal argues for reversing it as "1 reviewer beats 0
        readers," which misstates the 2026-08-16 decision: that call came
        from comparing four established framework docs sites with zero
        exceptions found for demo-first/spec-last (this file, then
        `CLAUDE.md`, states the comparison explicitly). The proposed reversal
        (Markup moves to position 2, spec tables stay generated-only at the
        end) is a defensible design on its own merits and costs only moving
        one block — but reversing a dated, gated, cross-referenced decision is
        the owner's call to make with the real tradeoff in front of them, not
        something a triage settles by itself. **OWNER CALL**, recommended
        default: keep spec-last unless the owner weighs the new evidence
        against the original four-site comparison and prefers the change.

**Split out of 249.2 while building it, rather than left implied by a ticked
box (2026-09-03, cloud wake):**

14. [x] **249.14 — DONE 2026-09-03 (cloud wake). A description on each of the 28
        `suite/` pages.** 249.2 closed
        `name="description"` on 127 of 127 built DOCS pages; the suite is the
        other 38 minus the 10 redirect stubs, and it is deliberately outside
        `distPages()` (an app, not documentation, copied in after `astro build`,
        gated by `npm run suite`). Every suite page's head comes from ONE place —
        `examples/erp-suite/_shell.mjs`'s `page({ title, moduleId, trail, body })`
        — so the mechanism is one added parameter; the work is authoring 28
        descriptions and threading them from each `*.screen.mjs`. Deliberately
        not folded into 249.2: the mechanism is one line and the content is a
        second chunk the size of the first, which is LOOPS' "an improvement
        bigger than the item becomes a roadmap entry".
        - **Accept:** `npm run suite`'s audit gains an arm asserting every built
          suite page carries a `<meta name="description">` of at least 40
          characters and that no two share one — the same two arms
          `check-metadata.mjs` runs over the docs, red-proved the same way
          (strip one, duplicate one, confirm each injection landed in the BUILT
          file before believing the red). A page whose description is absent or
          shared fails, naming it.

        **Every figure in the premise reproduced before building**, per this
        file's own rule: `find examples/erp-suite -name '*.screen.mjs' | wc -l`
        → 28, the built suite is 28 pages, and
        `grep -rn 'name="description"' examples/erp-suite/` returned **nothing**
        — so it really was 0 of 28. `page()` really is the only head.

        **Shipped:** `page()` takes a `description` and emits the tag;
        `DESCRIPTION_MIN = 40` is exported from `_shell.mjs` and read by both
        the render and the gate, so the floor is one number (the `MARKUP_RULES`
        precedent). 28 descriptions authored one per `*.screen.mjs`; measured
        **105–123 characters**, 28 distinct.

        **The render THROWS rather than defaulting, and that is the load-bearing
        choice.** A default would be a string all 28 share — which passes a
        presence check in full and would satisfy the length arm too; only the
        distinctness arm would catch it, and the render should notice before a
        gate does. `page()` also refuses a description containing `"`, which
        would end the `content="…"` attribute early and ship the rest of the
        sentence as stray markup in `<head>` — present to a grep, broken to a
        consumer.

        **Verified against what it RENDERS, not against the diff.** The
        insertion touched 31 files in one pass, so the assertion run was
        CLAUDE.md's row-label pairing: every built page carries the description
        authored for *that* source file — **28 of 28**, compared value-for-value
        rather than counted.

        **Four red-proofs, each with the injection confirmed before the red was
        believed:** (a) the tag stripped from one built page → confirmed 1 → 0
        tags in the file, gate red naming `/p2p/purchase-order.html`; (b) one
        page's description copied onto another → confirmed the identical
        `content` on both files, gate red naming both; (c) a 13-character
        description → gate red naming the page and the count; (d) source side, a
        screen with its `description` removed and a second with an 8-character
        one → the build itself throws, naming the page in both cases.

        **The fail-fast claim was made true rather than softened.** The first
        version of the comment said a missing description fails in milliseconds
        instead of after 28 screens × 2 widths of axe — but `failures` was only
        reported at the very end, so it did not. The arms now report and exit
        before the browser starts. The trade is stated in the comment: a run
        that trips here shows only these failures, and an axe violation on the
        same screen surfaces on the next run.

        **NOT VERIFIED, named rather than implied:** this was a cloud wake, so
        the 1440/390 light-and-dark screenshot lane could not run. It has
        **no rendered surface** — `<meta name="description">` is invisible, no
        CSS or body markup changed, and `check-erp-suite` confirms the suite
        still ships zero CSS of its own. `npm run suite` swept all 28 screens at
        both widths: zero axe violations, no sideways scroll at 390.

15. [x] **249.15 — DONE, Slice 295.** The one static OG image 249.2 named and did not build.
        Everything else in 249.2 shipped; this did not, because a social preview
        card is a *rendered image a human compares* — `ENVIRONMENT.md`'s first
        list, which a cloud wake cannot take. **browser-blocked in the
        screenshot sense, so a LOCAL wake can do it and a cloud wake should not
        pick it up.** Note the site currently has no `og:` or `twitter:` tag at
        all, so this is the whole card, not just its image.

        **RE-SCOPED 2026-09-04 (cloud wake): the TAG half is split out as
        249.17 and has landed (Slice 260); what is left here is the image.**
        Same split as 249.16 out of 249.4, for the same reason — a derivation
        half was being held behind the one half that needs a human's eyes. The
        premise was re-checked on the BUILT artifact before splitting, per
        CLAUDE.md's premise rule, and it held:
        `grep -rl 'property="og:' apps/docs/dist --include='*.html'` returned
        **0 of 138** built `index.html` files on a full `docs:build` of
        `3e1dac1` (`name="twitter:` likewise 0).
        - **Accept, image half (this item):** every built docs page carries
          `og:image`; the referenced path resolves to a file that exists in
          `dist/`; `check-metadata.mjs` gains that arm and it is red-proved by
          pointing `og:image` at a path that is not there. `twitter:card` moves
          from `summary` to `summary_large_image` in the same change, and
          arm 5's assertion that it is `summary` while no image ships is
          removed rather than left contradicting the new tag. Whether the card
          LOOKS right is the part that needs the local wake's eyes.
        - *(As first written, before the split — the clauses now covered by
          249.17 are struck through.)* ~~every built docs page carries
          `og:title`, `og:description` (agreeing with the page's own
          `name="description"`, asserted rather than assumed), `og:url`~~ and
          `og:image`; the image resolves to a file that exists in `dist/`;
          `check-metadata.mjs` gains the arm and it is red-proved by ~~removing
          the tag from one built page and by~~ pointing `og:image` at a path that
          is not there.

16. [x] **249.16 — DONE, Slice 254.** The one hand-made README screenshot, split out of 249.4.
        One screenshot of `patterns/list-report` at `data-density="compact"`,
        labelled as hand-made in alt text, in both READMEs. **browser-blocked
        in the screenshot sense** (`ENVIRONMENT.md`'s first list, `LOOPS.md`
        rule 4's vocabulary): its evidence is a rendered image a human
        compares, and a cloud wake must not take it. Split from 249.4 on
        2026-09-03 because the other three halves are plain derivation and were
        being held behind it.
        - **Accept:** both READMEs carry ≥1 image; the referenced file exists in
          the repo and, for the package README, inside the published tarball
          (`npm view @busy-office/ui` is the authority on what shipped, not
          `npm pack` — roadmap 185); `stamp-readme --check` still exits 0.

17. [x] **249.17 — DONE, Slice 260.** The `og:`/`twitter:` tag set, split out
        of 249.15 on 2026-09-04. 249.15 is the social CARD; this is everything
        about that card which is not a rendered image, and a cloud wake can
        take it in full — the evidence is `<head>` content in the built
        artifact, which is `ENVIRONMENT.md`'s SECOND list. Split for the same
        measured reason 249.16 was split out of 249.4: the derivation half was
        being held behind the half that needs a human's eyes.
        - **Accept:** every built docs page carries `og:type`, `og:site_name`,
          `og:title`, `og:description`, `og:url` and the three `twitter:` tags;
          `og:title` EQUALS that page's own `<title>` and `og:description`
          EQUALS its own `<meta name="description">`, asserted on the BUILT
          page rather than assumed; `og:url` equals the published URL
          `dist-pages.mjs` derives by WALKING `dist/`, which is a second
          derivation that cannot see the one `SocialMeta.astro` builds from
          Astro's route table; the arm is red-proved twice — a tag deleted from
          a built page, and one page's `og:title` made to disagree with its own
          `<title>` — with each injection confirmed present in the built HTML
          before the red is believed.

18. [x] **249.18 — DONE, Slice 261.** The component→patterns mapping, split out
        of 249.9 on 2026-09-04. It is one of the two badges 249.9's own audit
        found tracing to no JSON key, and it is pure derivation — no rendered
        image, `ENVIRONMENT.md`'s SECOND list — so a cloud wake can take it in
        full while the catalogue PAGE (rendered miniatures a human compares)
        stays with 249.9. Third split of this shape in three days, after 249.16
        out of 249.4 and 249.17 out of 249.15.

        **It exists because 249.9's stated cost for this badge is wrong**, and
        that premise was re-checked before the split rather than inherited
        (CLAUDE.md's premise rule). See the correction block under 249.9.
        - **Accept:** `patterns-index.json` carries a `byComponent` key emitted
          by the same generator that already emits the forward relation, with
          **one entry per component docs page including the ones no pattern
          names** (an absence is an empty array, never a missing key — 249.3's
          "absence is rendered, never blank"); hrefs are resolved through a
          redirect map with exactly ONE home in the repo, imported by both
          `astro.config.mjs` and the build-time reader rather than re-parsed,
          and the resulting reached/zero counts agree with an inversion taken
          independently of the generator; a gate arm re-derives the mapping
          from the **BUILT** pattern pages — a route the source-side regex
          cannot see — and fails when the shipped key disagrees, red-proved by
          injection with the injection confirmed present in the artefact before
          the red is believed.

19. [x] **249.19 — DONE, Slice 262.** The Related-link gap 249.7 banked as
        *"worth keeping either way"*, split out of 249.7 on 2026-09-04. 249.7
        is a COST question about a terminology table and waits on the owner's
        `249.10`; this is the one measurement inside it that is neither
        terminology nor owner-blocked, and it is `ENVIRONMENT.md`'s SECOND
        list — hrefs and prose in the built artifact, no rendered image.
        Fourth split of this shape in three days, after 249.16 out of 249.4,
        249.17 out of 249.15 and 249.18 out of 249.9. The route to it is the
        same one `RESUME.md`'s correction block names: read the clause, not
        the item's label.

        **The banked premise was re-derived independently before acting and
        held** (CLAUDE.md's premise rule) — and then the base rate refuted the
        obvious fix. Reciprocal linking is NOT the norm here: 29 of 97 pairs
        (29.9%), with 55 pairs where the target never names the source, so
        `dropdown`/`combobox` is one instance of a general property and a
        symmetry gate is refused. What justifies fixing this ONE pair is
        page-local: combobox's opener already claims the boundary from its
        side, and dropdown's answered only the too-few-options case. Full
        commands and figures in Slice 262.
        - **Accept:** the dropdown page's own content region links `combobox`,
          in the opener as a wrong-choice alternative and in `Related`, with
          the change argued from that page's own clause rather than from the
          symmetry statistic; the whole-page-versus-content-region readings
          are recorded side by side so a later reader can see why the anchor
          is load-bearing; and any gate proposed off this finding is measured
          for base rate BEFORE it is written, with the refusal recorded when
          the predicate is uniformly true.

20. [x] **249.20 — DONE, Slice 264.** The JS-tier badge's recorded key, split
        out of 249.9 on 2026-09-04. It is the second of the two badges 249.9's
        own audit found tracing to no JSON key — 249.18 took the first — and
        like it, it is pure derivation, `ENVIRONMENT.md`'s SECOND list, so a
        cloud wake can take it in full while the catalogue PAGE (rendered
        miniatures a human compares) stays with 249.9. Fifth split of this
        shape, after 249.16 out of 249.4, 249.17 out of 249.15, 249.18 out of
        249.9 and 249.19 out of 249.7.

        **249.9's consequence 4 was re-derived before the split rather than
        inherited** (CLAUDE.md's premise rule) and reproduces to the number:
        `(classes+dataAttrs) ∩ hooks` reads **23/40**, `classes ∩ hooks` reads
        **20/40** and drops `dialog` and `scan`, and `approval-workflow`
        matches on `data-state` alone — a vocabulary **6** components declare
        and **6** behaviors hook. Two things it did not say, measured here:
        the intersection's false positives are **structural, not incidental**
        (`form` matches 16 behaviors and `button` 5, because behaviors hook the
        shared primitives `bo-input`/`bo-btn` that those components define —
        composition, not a JS requirement); and `scan` declares **zero**
        classes, so no class-anchored rule can ever see it.
        - **Accept:** the relation is DECLARED in the shipped artifact — a
          directive in each behavior module's header, with the core build
          throwing and naming the file when it is missing, empty, or names a
          component `api.json` does not have — and published as a key carrying
          **one entry per component including the ones nothing serves** (an
          absence is an empty array, never a missing key — 249.3's "absence is
          rendered, never blank"); the published hook surface is asserted
          byte-identical to the previous build, because the directive sits in
          the same comments the hook scan reads; and a gate re-derives the
          relation from an INDEPENDENT source — what the BUILT component pages
          claim in their own "JS required" row — and fails when the two
          disagree, with its base rate measured before it is written and its
          red-proof asserting the injection landed in the built page before the
          red is believed.

**Refused, recorded as DA (not re-litigated here — see the triage file for
each item's reasoning):** publish-on-every-push/auto-bump, a `registry.ts`
model for component metadata, thirteen mandatory page headings, hand-typed
stability/tested badges, `COMPATIBILITY.md` as prose, `docs/decisions/`
duplicating `.roundtable/`, per-page generated OG images, a bundlephobia
badge, an npm keyword blob, Preview/Code tabs (already decided, roadmap 118),
search-side query expansion, and framework-owned column persistence.

**Concurred without a new item** (already correctly scoped, or resolved by
an item above): the visual-catalogue and split-DESIGN.md items (B3→249.9,
B4→ not separately filed, folds into ongoing `.roundtable/` practice already
in place — `DESIGN.md`'s Principles-only split and a `CONTRIBUTING.md` are
low-risk and can be built directly without a triage item; flagged here so a
future wake doesn't re-propose it from scratch), and the stability-field item
(B5, folds into 249.8's CSS-header convention once that lands — declaring
`stable`/`experimental`/`deprecated` as a field is a small extension of the
same `@tagline`/`@category` header mechanism, not a separate design).

## Slice 248 — Component-by-component design-grill: 40 of 40 covered, 1 real defect fixed, one instrument caught lying to itself (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 247 — 245.1 built: both of 244.3's counts corrected against a named revision, and upholding the "leave the log row alone" bullet found that bullet's OWN citation pointing at the wrong row (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 246 — 244.4 built: the src/css chokepoint gets its gate, and the design question it carried is answered by a count nobody had taken — there are FOUR chokepoints in this repo, one of them gated (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 245 — Objective grill of Slices 238, 241, 243, 244: twenty-nine of thirty-one published claims reproduce, and the two that do not are ONE item's two counts of one set — six and eight against a tree holding five before and seven after (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 244 — Standardize sweep: all four standing lanes clean, and the finding came from the fifth thing the playbook names — `cssFiles` hand-copied four times, one of them already diverged (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 243 — 242.1 refused: arm 8 does not become a build gate, and neither of the two arguments its Accept anticipated is what decided it — the predicate is unsound in the one direction nobody injected, red-proved by a score that stays correct while the arm goes red (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 242 — Polish round 2 on `component/dashboard`: the seventh recorded defect is the first where the SCORE was wrong, not the cite — `interaction: na` on a component that ships a behaviour, blind re-scored to 3 by a second agent (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 241 — 240.1 closed on its OWN second branch: the chevron's two hex literals are not removable, measured four ways — and the item was never browser-blocked, only its first branch was (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 240 — Polish round 2 on `component/calendar`: six arms clean, and a SEVENTH finds the sixth recorded defect — the one cite in the framework that claims an absence the shipped CSS does not have (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 239 — Polish round 2 on `component/tree-table`: NO-OP on six arms, and the sixth is the class arm 5 structurally cannot see — where 3 of this ledger's 5 recorded defects lived (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 238 — Objective grill of Slices 232, 234, 236, 237: twenty-four of twenty-five published claims reproduce, and the one that does not is the count written BESIDE a premise that was correctly re-run — five archive commits reported as four, at two durable sites (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 237 — Standardize sweep: lanes 1-3 clean an ELEVENTH time, lane 4 dispatched the ninth archive sweep, and the file that sweep writes into was still instructing the opposite of the rule written beside dispatcher rule 4 the day before (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 236 — Objective grill of Slices 232, 233, 234, 235: every published figure reproduces except one, and the two findings are both about what a verification CANNOT see — a corroborating count that measures its own explanation, and a sweep that archived the target of an open item's Accept (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 235 — Standardize sweep: lanes 1-3 clean a TENTH time, and lane 4's finding is that the sweep's own instrument has never had a file — five runs, one copy, living inside an archived slice. Committing it exposed two owner calls no run could see, and the sweep it enabled exposed three self-referential stubs in the archive (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 234 — 232.2's closing measurement is wrong about its own headline: the defect was introduced by 42.1, the commit that WROTE the sentence, and both dispatchers confirmed the opposite from the same single-file probe (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 233 — 231.2's new prose asserts two computed facts and nothing executes either; found by the THIRD independent build of 231.2 (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 232 — Objective grill of Slices 229, 230, 231: 230 and 231 survive entirely, and both findings are against how 229's refusal RECORDED its numbers, not against the refusal (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 231 — Polish round on `component/alerts`: the reconciliation is a NO-OP, and the sweep that surrounded it found one shipped variant with no recorded reason anywhere (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 230 — Standardize sweep: lanes 1-4 clean a ninth time, and the drift carried for three wakes was a genuine one-off — 5 of 6 parsing pages already asserted (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 229 — Objective grill of Slices 222, 226, 227, 228: every decision survives, the best candidate finding was already gated, and the one mirror no gate can see is fixed (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 228 — Standardize sweep: lanes 1-3 clean an eighth time, and lane 4 carries the finding again — the archive sweep is due a SEVENTH time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

## Slice 204 — P0: `check:claims` turned CI red for three commits [**Corrected by 346.1:** five — 3 when measured, 5 by the time the fix pushed, per this slice's own body] by asserting a claim the headless browser structurally cannot evaluate (2026-08-29)

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

