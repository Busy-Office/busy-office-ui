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

## Slice 278 — Polish round on `table-toolbar`, the surface every prior round dropped: the two behaviors this page documents as a pair make the grid keyboard-unreachable when they meet — hiding the column the cell cursor sits in strands the grid's ONE tab stop on a `[hidden]` cell (2026-09-05)

**Dispatcher trace, cloud wake.** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, no open `N. [ ]` item is
a P0, so Step 1 triaged and committed nothing. Rules 2 and 3 read `1 / 4` and
`1 / 3` — under threshold. Rule 4 found nothing dispatchable: all **12** open
items re-classified from their own text per `LOOPS.md` 186.2 — **9
owner-blocked** (Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
`273.2`; each says so in its own line) and **3 browser-blocked in the
SCREENSHOT sense** (`249.6`, `249.9`, `249.15`), none agent-blocked, none
unblocked. Rule 5 read **STALE** (`2 wake-date(s) newer`) and is therefore
**reported as could-not-be-evaluated, not clear**. Rule 6 fired.

**The tiebreak resolved itself for the first time in this ledger's history.**
After `pagination` moved to `2/3` last wake, `component/table-toolbar` is the
only surface at `1/3`, so §3b step 1's "fewest rounds used" picked it with no
invented discriminator — and it picked the surface **217.1's reason dropped
from every previous round**: `table-toolbar` is ABSENT from `dsa-scores.json`
(a behaviour-documentation page with no CSS component under it), so its page
makes no `DsaScore` call and arms 1-6 have nothing to disagree with. Taken
rather than skipped, per the standing hand-off note: an unscored page is short
of DSA arms, not short of subject.

1. [x] **278.1 — `initDataGrid` roves its single tab stop onto cells
       `initTableToolbar` has hidden, and Tab then skips the grid entirely.**
       The surface's own opener calls these *"the two opt-in behaviors that sit
       on top of a data table"*; nothing had ever asserted what happens when
       they meet.

       **Measured in headless Chrome against the BUILT page before anything was
       written** (`ENVIRONMENT.md`'s SECOND list — DOM, focus and geometry, not
       a rendered image). Two independent reproductions, the second driving
       both real modules with real events on `/components/table-toolbar/`'s own
       `#grid-nav-demo`:

       | step | tab stops in grid | the stop's cell | Tab from the toolbar |
       |---|---|---|---|
       | baseline | 1 | visible | lands **inside** the grid (`TH`) |
       | cursor roved onto the Amount column | 1 | visible | — |
       | column hidden by a real `change` on `[data-col-toggle]` | 1 | `hidden: true`, `offsetParent: null` | lands on the **next `<pre>`** — the grid is skipped |

       So the grid keeps exactly one tab stop and it is unreachable: a keyboard
       user who hides a column while the cursor is in it cannot get back into
       the grid at all. `focusCell()` sets `tabIndex = 0` on the target and
       clears every other cell, then `cell.focus()` returns silently — the same
       class of failure `data-grid.ts`'s own `FOCUSABLE` comment records for
       disabled widgets (*"Enter focused a disabled control and silently went
       nowhere"*), in the roving path rather than the Enter path.

       **The first attempt at the second reproduction proved nothing and is
       recorded rather than quietly dropped**, because it is CLAUDE.md's
       injection rule collecting twice in one round. Attempt one imported the
       library from the page's own `<script type="module">` sources and got
       *"no module exporting both"* — the built page ships Astro entry scripts,
       not the library, so `initDataGrid` never ran and the ArrowRight moved
       nothing. Attempt two bound nothing (the page already calls all three
       inits) but addressed its checkbox with `document.querySelector(
       '[data-col-toggle]')`, which matches the **first demo's** Vendor box
       — it hid a column in a different table and reported `hidden cells now:
       0`. Only the container-scoped selector reproduced. Both attempts
       "passed" in the sense of not erroring.

       **No shipped page combines the two**, checked rather than assumed:
       `data-grid-nav` and `data-col-toggle` co-occur in `data-table.astro`
       but on different tables, and `grep` finds no container holding both. So
       this is a defect in a documented composition with no live instance —
       which is why it is filed and fixed rather than flagged P0.

       **Fixed in `data-grid.ts`, three parts, each red-proved separately by
       injection with the removal confirmed in
       `dist/js/behaviors/data-grid.js` before the red was believed:**

       | injection | dist confirmation | goes red |
       |---|---|---|
       | drop the `MutationObserver` re-seed | `observer=false` | *hiding the column the cursor is parked in…* |
       | keydown navigates the unfiltered matrix | `visibleMatrix` refs **3 → 2**, line 174 reverts to `cellMatrix` | *cursor skips a hidden column*, *End goes to the last VISIBLE cell* |
       | `reindex` stops clearing a hidden cell's tabindex | `clearHidden=false` | *hiding the column the cursor is parked in…* |
       | drop `Home`/`End` handling | `homeEnd=false` | *Home/End jump to the row edges…* |

       **The first dist instrument was dead and is named here**: it grepped
       `packages/core/dist/js/index.js`, which is a re-export barrel — `.hidden`
       appears in it **zero** times on the fixed build too, so it would have
       reported "removed" for any injection whatsoever. The artifact is
       `dist/js/behaviors/data-grid.js`. A second flag (`filter=true`) survived
       injection 2 legitimately, because `visibleMatrix` is still called from
       `reindex`; the call-site count is what discriminates there, and it is
       the reading quoted above rather than the boolean.

       An observer rather than a `change` listener, measured not assumed: the
       toolbar applies its hide on a **document-level** listener, so a
       container-level `change` handler runs first, on the pre-hide state. The
       observer also covers consumer code hiding a cell directly, which a
       toolbar-specific hook would not.

       **Compatibility: NOT breaking**, stated against what changed rather than
       predicted. `aria-colindex`/`aria-rowindex` still number every cell
       including hidden ones (`reindex` keeps the unfiltered matrix), no export
       changed, and the only behavioural difference is on markup that was
       previously broken. Added under **Fixed**.
       - **Accept:** with `initTableToolbar` and `initDataGrid` on one
         container, the grid's tab-stop count and the hidden-ness of the cell
         holding it agree with what `/components/table-toolbar` says, asserted
         by cases driving the real toolbar `change` event rather than setting
         `cell.hidden`; each new assertion is red-proved by an injection whose
         landing is confirmed in `dist/js/behaviors/data-grid.js`, not in the
         source.

2. [x] **278.2 — the page listed four of the six keys the shipped module
       implements, and the two it omitted were published everywhere else.**
       `data-grid.ts`'s `@keymap` block declares `Home / End` (and their
       Ctrl/Cmd variants), `extract-keymap.mjs` lifts it into
       `keymap.json`, and `/concepts/js-behaviors` renders it — while
       `/components/table-toolbar`'s own key sentence stopped at *"arrow keys
       move the cursor … Enter … Esc"*.

       **The behaviour is correct and the omission is the defect**, which is
       the opposite of 277.1 the wake before, where five wordings were wrong
       and the module was right. Measured against the shipped module in
       headless Chrome from `[1,1]` on the 4x3 demo: `End` → `[1,2]`, `Home` →
       `[1,0]`, `Ctrl+End` → `[3,2]`, `Ctrl+Home` → `[0,0]` — exactly what the
       keymap says.

       Assertion count before this slice, plain fixed strings:
       `grep -c Home packages/core/tests/data-grid.test.ts` → **0**;
       `grep -c Home apps/docs/scripts/check-claims.mjs` → 0 for this grid.
       Now one unit case and one `check:claims` case, the latter driving real
       key events on the page's own `#grid-nav-demo` (a synthetic `keydown` on
       `document` matches no delegated handler). **The claim case asserts the
       demo's SHAPE first** — `4` rows x `3` cols — because on a 1x1 grid all
       four expectations collapse to `[0,0]` and the case would pass while
       distinguishing nothing.
       - **Accept:** the page's key list and `keymap.json`'s entry for
         `initDataGrid` name the same keys, and every key either page names is
         asserted somewhere executable; the claim case's own discriminating
         power is asserted rather than assumed.

**Not verified, and named as unverified rather than implied.** `0` CSS files
changed, but `table-toolbar.astro` gained two prose passages, so the page
**reflows by a few lines and that reflow has NOT been checked visually** — a
cloud wake has no 1440/390 light-and-dark lane. What *is* verified: the
whole-tree browser gates sweep every page at both widths, and `test:axe`
reports zero violations.

### The independent pass found four more, and refuted one — including one defect in what this wake shipped

§3b step 4's principle rather than its letter: the surface has no
`dsa-scores.json` entry, so there is no dimension to re-score. A second agent
was given the page and the two modules, told nothing about what changed, and
warned per **268.2** that a page may publish a prior verdict. It came back
with findings on the surface itself, which is the point of not marking your own
homework — **278.3 is a defect in prose 278.1 shipped an hour earlier.**

**One of its findings is REFUTED, and the refutation is recorded because the
finding was the most alarming of the set.** It reported `htmx:after:swap` as
"not an htmx event name" — htmx 1 and 2 emit `htmx:afterSwap` — and called it a
repo-wide defect across 20 occurrences that would stop `refreshDataGrid` ever
running after a swap. **The installed htmx is 4.0.0, which renamed its events
to exactly that namespaced form**, and the repo is correct:

```
node -e "console.log(require('./apps/docs/node_modules/htmx.org/package.json').version)"   # 4.0.0
grep -c 'afterSwap\|after-swap' apps/docs/node_modules/htmx.org/dist/htmx.js               # 0
grep -n 'after:swap'            apps/docs/node_modules/htmx.org/dist/htmx.js               # 1300: "htmx:after:swap"
```

Its own caveat is the tell — it wrote *"htmx is not installed here
(`ls node_modules | grep -i htmx` → empty)"* and reasoned from the name
instead. `ENVIRONMENT.md`'s `check:po-app` entry records that htmx is **never
hoisted** in this repo: it lives in `apps/docs/node_modules` and
`examples/po-app/node_modules`. A root-only `ls` is a dead instrument here, and
223's htmx-4 migration is the history the reading missed. **An agent's first
output is not evidence either**, which is the same base rate CLAUDE.md sets for
a new script.

3. [x] **278.3 — the composition sentence 278.1 shipped describes something no
       demo on the page can exercise.** The two demos are separate tables in
       separate containers: the toolbar table has no `data-grid-nav`, the grid
       table has no `data-col`. So *"A hidden column is also dropped from the
       grid model below"* read, in the caption of the Columns demo, as a claim
       about what the reader could try there. **Corrected in the same wake it
       landed** — the sentence now says outright that these two demos are
       separate tables and the reader cannot try it here.

       Kept open for the half that is not prose: the composition is asserted
       only in jsdom (`data-grid-columns.test.ts`), and
       `grep -c -F data-col-toggle apps/docs/scripts/check-claims.mjs` reads
       **0**. 278.1 refused a claims case because wiring the demos together
       changes what the demo DOES; that refusal stands, so what is open is the
       narrower question of whether a claims case can assert the composition on
       markup the gate builds itself rather than on the page.
       - **Accept:** every runtime sentence on this page either names a demo a
         reader can exercise, or says in the sentence that it cannot be tried
         there; whichever is chosen, the page and the shipped module agree.

       **CLOSED 2026-09-05 (cloud wake), and the Accept is what made this item
       cost three fixes instead of one.** Read literally it is a property of
       EVERY runtime sentence on the page, not of the composition sentence the
       item is about — so satisfying it meant auditing all of them, and two did
       not agree with the shipped module: the opener's cost argument (`278.6`)
       and *"aria-selected synced from the row checkboxes"* (`278.4`, a shipped
       accessibility defect). Both are closed below rather than the Accept being
       narrowed to fit. **Recorded as a finding, not a complaint:** an Accept
       whose subject is "every sentence on the page" silently scopes in every
       other open item filed against that page, and the two it caught here were
       worth catching — but that was luck, not design. The narrower form
       (*"the composition sentence names a demo a reader can exercise or says it
       cannot be tried there, and agrees with the shipped module"*) is what the
       item meant.

       **The open half — can a claims case assert the composition without
       wiring the demos together? — is answered YES, by a third shape neither
       the item nor 278.1 weighed.** The gate composes the markup ITSELF, on the
       page's own already-initialised modules: it tags `#grid-nav-demo`'s twelve
       cells with `data-col` and prepends a `[data-col-toggle]` box to that
       table's container, which is the whole of `initTableToolbar`'s markup
       contract. Nothing the reader sees changes, so 278.1's refusal (wiring the
       demos changes what the demo DOES, and lands interactive markup a cloud
       wake cannot check visually) still stands — the composition is now
       asserted live as well as in jsdom. `grep -c -F data-col-toggle
       apps/docs/scripts/check-claims.mjs` **0 → 1** — `-c` counts matching
       LINES, which is what the item's own reading of 0 was, so the two are
       comparable.

       Measured in headless Chrome against the built page, with the two controls
       the assertion needs (without them "it landed on column 2" is satisfied by
       an arrow key that did nothing, and "the tab stop moved" by a stop that
       never had to move):

       | step | reading |
       |---|---|
       | tagged cells | 12 (4 rows x 3 cols) |
       | control 1 — ArrowRight from column 0, nothing hidden | lands on `no` |
       | control 2 — cursor parked in the column about to be hidden | tab stop on `no` |
       | after a real click on the toggle | 4 cells hidden, all `no` |
       | tab stop after | count **1**, on `sel`, `hidden: false` |
       | ArrowRight from column 0 after | lands on `amt` — straight past `no` |

       **Red-proved by two injections into the chunk the page actually loads**
       (`apps/docs/dist/_astro/table-toolbar.*.js`, named by the page's own
       entry script — not `dist/js/index.js`, the re-export barrel 278.1 caught
       being a dead instrument). Each replaced exactly one match, aborting
       otherwise, and each was confirmed absent from the artifact after the
       write:

       | injection | bytes | goes red |
       |---|---|---|
       | `reindex` stops clearing a hidden cell's tabindex | 3172 → 3116 | the composition case |
       | `visibleMatrix` stops filtering hidden cells | 3172 → 3119 | the composition case |

4. [x] **278.4 — `select all` leaves every row reporting
       `aria-selected="false"` on a `role="grid"` that also says
       `aria-multiselectable="true"`.** The same class as 278.1 and found by
       the same question: two behaviors that do not talk. Confirmed at source
       rather than taken from the agent's reading —
       `data-table.ts`'s handler sets `box.checked = on` on each row box and
       **dispatches no `change`**, while `data-grid.ts`'s `syncSelected` runs
       only on a `change` whose target matches `.bo-data-table__row-select`.
       The page's own line 102 claims *"`aria-selected` synced from the row
       checkboxes"*.

       Assistive tech therefore reads every row as unselected while all of them
       are checked, until an unrelated single-row click happens to repair it.
       `grep -c -F "select-all" packages/core/tests/data-grid.test.ts` → **1**,
       and it is markup, not an assertion.

       **The obvious fix has the ordering trap 278.1 already paid for**, so it
       is named here rather than left for the next wake to rediscover:
       `data-table.ts` binds its `change` listener on the **container** and
       `data-grid.ts` binds on the **table**, so the table's listener fires
       FIRST — before the row boxes are set — and a naive "also match
       select-all" sync would read the old state. A `MutationObserver` does not
       help either: `checked` is a property, not an attribute. Deciding between
       deferring the sync and having `data-table.ts` publish an event is this
       item's work.
       - **Accept:** after a select-all through any documented route (mouse,
         and the `Enter`-then-`Space` keyboard route the grid documents), every
         row's `aria-selected` agrees with its checkbox, asserted by a case
         that drives the real control rather than setting `checked` directly;
         the assertion is red-proved by an injection confirmed in
         `dist/js/behaviors/`, and the listener-ordering premise above is
         re-measured rather than trusted.

       **CLOSED 2026-09-05 (cloud wake).** Taken because `278.3`'s Accept spans
       every runtime sentence on the page and this is one of them.

       **The defect reproduced on BOTH documented routes** before anything was
       changed, against the built page in headless Chrome:

       | route | row checkboxes | `aria-selected` |
       |---|---|---|
       | initial | `false,false,false` | `false,false,false` |
       | real mouse click on select-all | `true,true,true` | **`false,false,false`** |
       | control — one real row click after | `true,false,true` | `true,false,true` |
       | fresh load, `Enter` then `Space` on the header cell | `true,true,true` | **`false,false,false`** |

       The control row is what makes it a sync bug rather than a dead
       `syncSelected`: a single-row click repairs every row, because that path
       re-reads all the boxes.

       **The listener-ordering premise was re-measured and holds:** on a real
       click the TABLE listener sees `false,false,false` and the CONTAINER
       listener then sees `true,true,true`.

       **Fixed in `data-grid.ts`: match the select-all too, and defer that path
       only.** The row-select path stays synchronous — a row checkbox already
       carries its new state when its own `change` fires, and deferring it would
       make a working, observable behavior asynchronous to fix a different one.
       **Refused:** a new public event from `data-table.ts`, which widens the
       contract to fix a sync this module can do on its own.

       **⚠ `queueMicrotask` DOES NOT WORK HERE, AND THE PROBE THAT SAID IT DID
       WAS MEASURING THE WRONG DISPATCH PATH.** The first fix deferred with a
       microtask and a probe reported it running last — `table`, `container`,
       then `microtask-from-table`, all reading `true,true,true`. The probe drove
       the control with `el.click()`. A microtask checkpoint runs whenever the JS
       stack empties; under a **script-initiated** click the whole dispatch sits
       in one JS frame, so the microtask genuinely runs last, but under a
       **trusted** click the browser drives the dispatch from native code and the
       stack IS empty between listeners — so the microtask runs BEFORE the
       container listener, on exactly the stale state it was meant to avoid.
       Shipped, built and gated, the microtask version left `aria-selected`
       `false,false,false` under `page.click`, which is how it was caught. The
       fix is `setTimeout(…, 0)`: a task cannot run until the dispatch completes,
       on either path. This is CLAUDE.md's base rate landing on a browser
       primitive rather than a script — **the instrument agreed with the
       hypothesis because it exercised the one path where the hypothesis is
       true**, and the general form is now in `ENVIRONMENT.md`.

       **Two assertions, one red-proof each, both confirmed in the artifact
       before the red was believed.** The unit test
       (`data-grid.test.ts`, driving `initDataTables` + `initDataGrid` together —
       driving the row boxes directly would assert nothing about this bug) went
       red at `['false','false']` with the select-all branch removed from
       `packages/core/dist/js/behaviors/data-grid.js`, and green restored. The
       live case went red with the same branch reverted to `void 0` in the
       chunk the page loads (3172 → 3115 bytes, artifact confirmed reading
       `?l(t):void 0`), **red on exactly that one case**.

       **The first attempt at that live injection was itself defective**, and it
       is recorded because it failed in the direction people do not check for: it
       deleted the whole false branch of a ternary, left `cond?l(t)` behind, and
       the module stopped parsing — **four** cases went red instead of one. A
       red-proof that goes red for the wrong reason certifies nothing, the same
       as one that stays green. The injector now aborts unless it replaces
       exactly one match and re-reads the artifact afterwards.

       **Compatibility: NOT breaking**, stated against what changed rather than
       predicted. No export changed and no markup contract moved; the row-select
       path is byte-for-byte the same behaviour and the same timing. The one
       observable difference is on a select-all, where `aria-selected` previously
       never updated at all and now updates one task later. Added under
       **Fixed**.

5. [x] **278.5 — the Columns demo never calls `initDropdowns()`, so the menu
       the page calls "the same multi-select dropdown pattern as elsewhere" is
       neither positioned nor labelled.** `table-toolbar.astro` calls
       `initDataTables(); initTableToolbar(); initDataGrid()` and nothing else;
       `table-toolbar.ts`'s own header says *"call initDropdowns() too for the
       menu itself (positioning, stays-open, trigger-label count)"*.

       Reported measurement, to be re-taken before building: the menu renders
       at the viewport's top-left rather than under its invoker, and
       `data-multiselect-label`'s count never appears on the trigger. Nine
       docs pages call `initDropdowns`; this is not one of them.

       **This changes what the demo LOOKS like** — the menu moves from the
       corner to under its button — so a cloud wake can measure the geometry
       but cannot judge the result. Name which list it needs when taking it.
       - **Accept:** the Columns menu's box sits under its invoker and the
         trigger label carries the count, measured as geometry against the
         invoker rather than against fixed pixels; or the page says why this
         demo deliberately omits the dropdown behavior.

       **CLOSED 2026-09-05 (cloud wake), by the first branch, and the half a
       cloud wake cannot verify is named rather than implied.** Dispatcher:
       rule 1 clear (`list_issues` → `totalCount: 0`, no open `N. [ ]` item is
       a P0), rules 2 and 3 under threshold at `2 / 4` and `2 / 3 [274, 278]`,
       so **rule 4**. All **13** open items were re-classified from their own
       text per `LOOPS.md` 186.2 — **9 owner-blocked** (Slice 15, `112.3`,
       `112.4`, `249.7`, `249.10`-`249.13`, `273.2`), **3 browser-blocked in
       the SCREENSHOT sense** (`249.6`, `249.9`, `249.15`, each declined in
       its own text by a prior cloud wake), and this one, whose Accept is
       written as **geometry against the invoker** — `ENVIRONMENT.md`'s SECOND
       list, which a cloud wake can take in full. Rule 5 read **STALE** and
       was not reached; rules 6-8 unreached.

       **The reported measurement was re-taken before building, per CLAUDE.md's
       premise rule, and it reproduces exactly.** On the built page at 1440,
       driven with `page.click` (never `el.click()`, per `ENVIRONMENT.md`'s
       trusted-dispatch bullet):

       | | before | after |
       |---|---|---|
       | menu box | `top 0, left 0`, 192x121 | `top 409, left 265` |
       | invoker box | `left 265, top 369, bottom 405`, w 95 | unchanged |
       | menu top − invoker bottom | **−404** | **4** |
       | menu left − invoker left | **−265** | **0** |
       | trigger, 2 of 3 boxes checked | `"Columns"` | `"Columns (2)"` |

       So both halves of the reported measurement held: the menu opened at the
       viewport's corner, over the site header, 404px above and 265px left of
       the button that opened it, and the count never reached the trigger. What
       already worked — and still does — is the toolbar behavior's own half:
       unchecking `vendor` hides its 4 cells either way. The two behaviors are
       genuinely separate, exactly as `table-toolbar.ts`'s header says.

       **The fix is the missing call, not new code:** `initDropdowns()` joins
       the page's `initDataTables(); initTableToolbar(); initDataGrid();`.
       `grep -rl initDropdowns apps/docs/src/pages/` read **9** before and
       **10** after. The caption also gains a clause naming the split, because
       a reader copying this demo hit the same corner-positioned menu the item
       reports — the page claimed the pattern without saying what wiring it
       takes.

       **Now executable.** A `check:claims` case asserts the geometry and the
       label; `claims` reports **167** live, up from **166** last wake, the one
       case added. It carries **no pixel literal**: *"the same multi-select
       dropdown pattern as elsewhere"* is taken literally, so the reference is
       `/components/dropdown`'s own plain multi-select (`#demo-cc`, no `--end`
       modifier) measured live in the same browser, and this menu must
       reproduce its offset from its own invoker within 1px. A gap constant
       lifted out of `popover-position.ts` would have been a substring
       assertion on source; a hard-coded `4` would be a gate fitted to one
       theme at one density. **The reference carries its own absolute control**
       — it must open below its invoker and on screen — or "both at (0,0)"
       would agree with itself and pass.

       **Red-proved twice, each injection confirmed in the artifact before the
       red was believed, and the second one is the interesting record.**

       - **Positioning.** `r();` → `void 0;` in the chunk the page's own entry
         script names (`_astro/table-toolbar.astro_astro_type_script_index_0_lang.*.js`),
         **exactly 1 match replaced**, the call confirmed absent afterwards and
         the module still parsing. → **1 of 167** red, this case.
       - **The label.** The checked-count expression forced to `0` in
         `_astro/dropdown.*.js`, again exactly 1 match. → **2 of 167** red:
         this case and *"filter panel: … counts in text"*. **That second red is
         a true positive, not the too-broad failure mode** — the injection hit
         shared behavior and both cases genuinely assert the count. The failure
         mode `ENVIRONMENT.md` warns about is a module that stops PARSING and
         drags unrelated cases down with it; here the other three
         `table-toolbar` cases stayed green, which is the discriminator. Its
         value is proving the label half is not dead weight: positioning was
         untouched and the case still went red.

       Both injections were reverted and the gate re-run green before commit.

       **NOT verified visually, and named as unverified rather than implied.**
       **0** CSS files changed and the menu now uses the same shipped
       `positionPopover` path as nine other docs pages, but the caption gains
       prose, so the page reflows — and a cloud wake has no 1440/390
       light-and-dark lane (`ENVIRONMENT.md`'s FIRST list). Whether the menu
       *looks* right against the toolbar in dark theme is the half a LOCAL wake
       still owns; this item's own text asked the taker to name which. What
       *is* verified: `check:layout` (127 pages, 390 and 150% zoom),
       `check:scroll` (914 containers x 2 widths) and `test:axe` (127 pages x 2
       widths, zero violations).

       **The other claims this change carries, with the instrument for each**,
       per CLAUDE.md's rule that the defect lands beside the red-proved number:
       the before/after geometry and label — an ad-hoc puppeteer probe against
       the built `dist/`, run twice, and the after-values are independently
       re-asserted by the gate; **9 → 10** pages calling `initDropdowns` —
       `grep -rl … | wc -l`, run before and after; **167** live claims — the
       gate's own report; **1** and **2** red cases — the gate's own report
       under each injection; **0** CSS files changed — `git diff --numstat`.

6. [x] **278.6 — the opener's cost argument names a mechanism the module does
       not ship.** It says grid navigation costs *"per-cell Tab stops"* that
       turn a browsable table into a widget; the module ships **one** roving
       tab stop for the whole grid, which the same page states two paragraphs
       later (*"Tab enters the grid at ONE cell"*). The conclusion — earn grid
       nav with a real need — is sound and is not in question; the reason given
       for it contradicts the page's own description.

       Filed rather than fixed in place because the honest rewrite has to say
       what the real cost IS (cells become a single widget the user must
       operate, and every interactive descendant leaves the Tab sequence — a
       trade the page never states), and that is a judgement about the
       component, not a typo.
       - **Accept:** the opener's stated cost of grid navigation matches what
         the module does, and names the descendant-tabindex trade the reader
         is actually accepting.

       **CLOSED 2026-09-05 (cloud wake).** Taken because `278.3`'s Accept spans
       every runtime sentence on the page and this is one of them.

       **The premise was re-measured rather than trusted**, on the built page's
       own `#grid-nav-demo`: **12** cells, **1** of them tabbable; **4**
       interactive descendants (the select-all and three row checkboxes),
       **0** of them in the Tab sequence, every one at `tabIndex -1`. So the old
       sentence was not merely imprecise — "per-cell Tab stops" is the opposite
       of what ships, by an order of magnitude in one direction and by
       everything in the other.

       The opener now states the real trade: the whole table collapses to one
       Tab stop, **and** every control inside it leaves the Tab sequence,
       reachable only by arrowing to its cell and pressing `Enter`. The
       conclusion the paragraph was always driving at — earn grid nav with a
       real need — is unchanged; only the reason is now true.

       **Now executable**, which the old sentence never was: a `check:claims`
       case asserts all four numbers against the shipped module, with the first
       demo's plain (non-grid) table as the control — without it, "no tabbable
       controls" would also be satisfied by a page that has none anywhere.
       Red-proved by stopping `reindex` from pulling descendants out of the Tab
       sequence in the chunk the page loads (3172 → 3146 bytes, confirmed absent
       from the artifact), which turns exactly this case red.

       **NOT verified visually, and named as unverified rather than implied.**
       `0` CSS files changed, but the opener paragraph gains 3 lines of prose
       (`git diff --numstat` on the page: **6 insertions, 3 deletions**), so the
       page reflows — and a cloud wake has no 1440/390 light-and-dark lane. That
       figure describes the working tree; re-read it from the commit. What *is*
       verified: `check:layout` and `check:scroll` sweep every page at both
       widths and `test:axe` reports zero violations.

**Refused inside this item:** a `check:claims` case for the hidden-column
composition itself. It needs the grid demo to gain a column-toggle control,
which changes what the demo DOES and lands new interactive markup on the page
— the screenshot lane a cloud wake cannot run. The composition is asserted at
the unit level instead, where the same events are drivable.

## Slice 277 — Polish round on `pagination`: six cites hold, and the finding is a runtime claim published in four places, asserted in none — `data-load-more-auto`'s only test says it *does not throw* in an environment where the feature cannot exist (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** for the
eleventh wake running (`git branch --show-current` empty, `HEAD` at `14fb2ad`)
— ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work; `origin/main` arrived as a **forced update** (`26447ba...14fb2ad`), which
is Step 0c's collision mechanic visible. `--unshallow` clean in one attempt
(**1,889** commits, no `shallow.lock`); `git fetch --tags origin` returned all
**seven**. Working tree clean, `RESUME.md` "In flight: nothing". Step 1: no new
input — `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`,
and no open `N. [ ]` item is a P0; nothing triaged, nothing committed for it.
Step 0b: rule 2 `1 / 4`, rule 3 `1 / 3 [274]`, rule 5 **STALE** (`2
wake-date(s) newer`).

**Rules 1-5 did not match and rule 6 fired.** Rule 4's open set is **12**, and
every line was re-classified from the item's own text per 186.2 rather than
carried from the last hand-off: **owner-blocked 9** (Slice 15, `112.3`,
`112.4`, `249.7`, `249.10`-`249.13`, `273.2`), **browser-blocked in the
SCREENSHOT sense 3** (`249.6`, `249.9`, `249.15` — each says so in its own
text), agent-blocked 0, not-blocked 0. Rule 5 is reported as **could not be
evaluated**, never clear.

**The tiebreak was measured this time, and that is the difference from 276.1.**
Every non-skipped surface reads `content: 3`, so "lowest score" selects all;
"fewest rounds used" narrows to the two at `1/3` — `pagination` and
`table-toolbar` — and 217.1's stated reason breaks it without inventing a
discriminator: `table-toolbar` is **ABSENT** from `dsa-scores.json`, so no
reconciliation arm can disagree with it. 276.1 took its three-way tie
alphabetically and said so; this one did not have to.

### The arms on the surface — all clean

1. **Wrong-choice clause present** — `<strong>Not for stepping through a
   process</strong>`, and the page is off `check:wrong-choice`'s TODO.
2. **`dsa-scores.json` entry rendered by its page** — `check:dsa-scores`
   passes per name.
3. **Line-number citations** — none in this entry; the class is still
   `badge · spacing` alone.
4. **The `content` cite's quoted clause** is on the built page verbatim.
5. **The three NEGATIVE cites, which arms 4-6 structurally cannot read.**
   `typography` "no raw font-size", `colour` "zero raw hex", `spacing` "zero
   raw dimension literals — all tokens". Checked by **listing every
   declaration** rather than by a negative lookahead — the stepper round
   recorded `grep -nP 'font-size\s*(?!var\()'` backtracking to zero width and
   discriminating nothing, so the honest form is to print all matches and read
   them: `font-size` occurs twice in `pagination.css`, both `var()`; hex 0;
   unit-bearing literals 0.
6. **`interaction`** — "native `<nav>` + buttons/links; current page carries
   `aria-current='page'` per its own contract comment" reproduces at
   `pagination.css:5-6`, and `[aria-current="page"]` sets `font-weight` as
   well as colour, so the two-channel rule holds under forced-colors.

### The finding — arm 7, the page's cites against the shipped BEHAVIOR

276.1's new arm read a page's claims against its serving module, and its own
table names `pagination` as the **third** blindest surface (`3 / 4` commits
touching `load-more.ts` never touched the page). This is that arm collected.

**`initLoadMore`'s auto-fire path is documented in five places and asserted in
none.** The only test naming the attribute is
`load-more.test.ts`'s *"`data-load-more-auto` does not throw where
IntersectionObserver is unavailable (jsdom)"* — an assertion about an
environment in which the feature **definitionally cannot run**. `check:claims`
covers the click path only; `check-po-app.mjs` never names load-more, though
po-app ships `data-load-more-auto` at `server.mjs:993`.

That is not "IntersectionObserver is untestable here": `windowed-list.test.ts`
already ships a controllable `FakeIO` for exactly this, in the same directory.
The sibling behaviour has the harness and this one did not use it.

**It is also the maximally-silent class this gate's own comment names.**
`check-claims.mjs` says of load-more that "its failure is maximally silent —
the button still depresses, no rows were ever going to appear from the
framework". The auto path is quieter still: with no click there is not even a
depress.

**The coverage reconciliation that found the click path could not have found
this one.** Its recorded method was reconciling *the 21 init behaviours*
against hand-verified selectors — a check at BEHAVIOR granularity. A behaviour
with one covered path and one uncovered path reads as covered.

### The premise was verified in a real browser before anything was written

`ENVIRONMENT.md`'s SECOND list — a DOM/event assertion, which a cloud wake can
take. A throwaway probe served the **shipped** `dist/js/behaviors/load-more.js`
over http to headless Chrome (`file://` is refused: module imports from
`origin 'null'` are blocked by CORS, and the `page.on('console')` listener is
what said so rather than a timeout):

| scenario | fires |
|---|---|
| out of view at init | **0** |
| scrolled into view | **1** |
| scrolled away | **1** |
| scrolled back — second approach | **2** |
| **already in view at `initLoadMore()`** | **1**, no scroll, no click |

**Red-proved, injection confirmed in the served file first**: qualifying the
observe selector to `[data-load-more-NOPE]` (grep confirmed at line 62) took
the run to `0/0/0/0`, and restoring returned `0/1/1/2`.

**So the shipped behaviour is right and the documentation is wrong.** The last
row is the finding: an IntersectionObserver delivers an initial entry for every
element it observes, so an auto button already in the viewport fires
immediately. **Five** sites said a scroll had to trigger it — `load-more.ts`'s
header, `windowed-list.ts:255`'s canonical `@when` (the event contract every
consumer is pointed at), the pagination page's prose, its `ApiTable` `js=`
string, and the inline comment inside the page's **copy-paste code sample**. A
sixth site, `/concepts/scale`, names the attribute without stating a trigger
and is accurate; it was left alone. The consequence is concrete: a short first
page fetches its second page on load.

**It was four until the built page was read, and that is CLAUDE.md's bulk-edit
rule collecting.** The first pass edited the four sites visible as prose and
declared the wording gone; grepping `dist/` for the old string returned
`components/pagination/index.html` anyway, and the survivor was the comment in
the copyable `<pre>` — the one a reader actually takes. The page mixes live
markup with a template-literal sample, which is precisely the file shape that
rule says to edit by hand and verify against what it RENDERS.

**And the first attempt to locate it reported nothing**, because
`grep -o ".\{140\}scrolls into view.\{80\}"` is a position filter, not a
context window: the match sits at a line start after Shiki's markup, so 140
preceding characters do not exist. `grep -c` found it instantly. Both traps are
written in CLAUDE.md and both were walked into inside one verification step.

**It does not loop**, checked rather than assumed — the observer reports
transitions, so a button that stays in view after the append does not re-fire.
The "once per approach" half of the claim holds.

### What landed

- **`packages/core/tests/load-more-auto.test.ts`** — six cases on the
  `FakeIO` precedent. A separate file because `initLoadMore` latches
  `installed` and builds its observer once, so a file that has already called
  it under jsdom can never acquire one afterwards; vitest isolates module
  graphs per file, and `load-more.test.ts` keeps its no-IntersectionObserver
  case rather than losing it.
- **All five wordings corrected** to "is in view"; the four prose sites name
  the init boundary explicitly, and the code sample's one-line comment states
  the condition (`while the button is in view`) without it.

**Every one of the six cases was red-proved, each injection confirmed in the
BUILT `dist/` before the result was believed** — four injections, because
three of them left one case green and an assertion never watched fail is the
thing CLAUDE.md refuses:

| injection | confirmed in dist | cases red |
|---|---|---|
| observe selector → `[data-load-more-NOPE]` | present ×1 | observes; late-arriving |
| `disabled` guard deleted | `disabled)` → 0 | disabled auto button |
| `if (entry.isIntersecting)` dropped | `isIntersecting` → 0 | out of view; once per entry |
| observe selector widened to `[data-table-load-more]` | auto-qualified form → 0 | never-observed |

Source restored byte-identical after each (`git diff --stat` empty).

1. [x] **277.1 — DONE 2026-09-05 (cloud wake). `data-load-more-auto` is
       published as a runtime promise in five places and asserted in none, and
       all five state a trigger the shipped module does not have.** The only
       test naming the attribute asserts it does not throw where the feature
       cannot exist. Fixed by six red-proved `FakeIO` cases and by correcting
       the five wordings to what a real browser was measured doing.
       - **Accept:** the auto-fire path has at least one assertion that goes
         red when it breaks, red-proved with the injection confirmed in the
         built artifact first; and every documentation site that STATES the
         trigger agrees with what the shipped module does — asserted by
         grepping the BUILT `dist/` for the old wording with a plain fixed
         string, not by reading the diff. Finding a site already accurate
         is a satisfying outcome, not an off-plan one — `/concepts/scale` was
         one and was left unchanged.

### The score does not move, and no blind re-score is owed

No dimension covers "is the documented trigger condition accurate" — the
inaccurate sentence is not what `content` scores, and the wrong-choice clause
it was earned on is untouched. `scored` stays **2026-08-23**: moving it would
claim the independent second opinion §3b step 4 requires, which this round did
not run and did not need. Same reading as `sidebar-nav`, `breadcrumb` and
`icon`. `rounds` moves 1→2 on 182.1's precedent — the round changed the
published artefact. Per **273.2**, still an open owner call, `dry` is **not**
incremented.

**Not a no-op**, and the distinction from the last five rounds is worth
stating: this defect is ON the surface — pagination's own page published the
inaccurate claim — rather than found elsewhere while the surface reconciled
clean. Against 273.2's tally that leaves the NO-OP count at **9**, unchanged.

### Refused inside this item, both measured

- **Adding a `check:claims` case for the auto path.** It would need the page's
  own demo button to carry `data-load-more-auto`, which changes what the demo
  DOES — rows appending on scroll — and that is a design change needing the
  1440/390 light-and-dark lane this wake cannot run, not maintenance. 101.3
  confines Polish to the existing ratchet. Left to a local wake if wanted; the
  vitest cases carry the ratchet meanwhile.
- **A gate for the class "a documented runtime claim with no executable
  assertion".** The predicate is not measurable in the form the other
  cite-checkers take — it needs a reading of what a sentence PROMISES, which
  94.11 says a gate can enforce the shape of but not the content of. And
  101.3 forbids Polish adding gates outright. Recorded, not gated.

### What this round could NOT verify

Cloud wake: no Podman, no `localhost:8081`, so the 1440/390 light-and-dark
screenshot lane could not run. **0** CSS files changed. The pagination docs
page DID change — two prose edits inside an existing `<p class="bo-u-text-muted">`,
one `ApiTable` `js` string and one comment inside a code sample — so it reflows
by a few lines and
**that reflow is UNVERIFIED VISUALLY**, stated as unverified rather than
implied to be fine. What is verified: `check:layout` and `check:scroll` sweep
every page at 1440 and 390 and assert nothing overflows and every scroll region
is reachable, and `test:axe` found no violation. Every other number above came
from a gate or a probe executing in this container.

## Slice 276 — Polish round on `inline-editing`: every arm on the surface reproduces, and the finding is in step 0's own source map — a surface's source set stopped at CSS, so 31 commits changed a behavior module with nothing to notice (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** for the tenth
wake running (`git branch --show-current` empty, `HEAD` at `e914399` =
`origin/main`) — ENVIRONMENT trap 1, fixed with `git checkout -B main
origin/main` before any work. `--unshallow` clean in one attempt (**1,887**
commits, no `shallow.lock`); `git fetch --tags origin` returned all **seven**.
Working tree clean, `RESUME.md` "In flight: nothing". Step 1: no new input —
`list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, so
nothing was triaged and nothing committed there. Step 0b: rule 2 `1 / 4`,
rule 3 `1 / 3` (both `ok`), rule 5 **STALE** by 2 wake-dates and therefore
reported as *could not be evaluated*, per `LOOPS.md` rule 5. Rule 1 clear — no
open `N. [ ]` item is a P0.

**Rule 4 found nothing this wake can take, and every classification was
re-derived rather than read off the hand-off.** All **12** open items:
**owner-blocked (9)** — Slice 15 (AT runtime evidence, owner hardware), `112.3`
(owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (a cost
question its own text holds for the owner's `249.10`), `249.10`-`249.13` (each
says **OWNER CALL** in its own line), and `273.2`; **browser-blocked in the
SCREENSHOT sense (3)** — `249.6`, `249.9`, `249.15`, each of which says so in
its own text, `249.6` having been declined at the clause level twice. So rule 5
(STALE, not evaluable) and then **rule 6, Polish**, exactly as the previous
hand-off predicted.

**Step 0's re-queue could not run until core was built** — `polish_requeue.py`
exits naming `api.json` and the command that makes it, which is 249-era
guidance working; `npm run build -w @busy-office/ui`, then `--apply`: 1 row
newly marked, 14 already carrying the marker, 15 re-queued.

### The round is a NO-OP on the surface, and the arms are in `polish-state.md`

Five arms, all clean: the ledger's *"(unscored in DSA)"* against the surface's
**absence** from `dsa-scores.json`'s 40; no `DsaScore` on the page, so 176.1's
"Not yet scored" mis-render cannot occur here; the round-1 wrong-choice clause
still present and off `check:wrong-choice`'s TODO; the page's `forced-colors`
dirty-row cites reproducing exactly in `data-table.css`; and a fifth arm no
round on any surface had run — the page's claims against the shipped
**behavior**, all of which resolve in `row-edit.ts`.

Per **273.2** the `dry` counter is not incremented: that rule is an open owner
call. Against 273.2's count of 8 NO-OP rounds — 6 filing a real defect, 2 finding
nothing — this is the ninth NO-OP and the seventh to file one.

### 276.1 — the source set was blind to every behavior module

1. [x] **276.1 — DONE 2026-09-05 (cloud wake). A component surface's source
       set now includes the behavior modules that drive it, read from
       `behaviors.json`'s `byComponent`.**

       `.roundtable/polish-state.md` has always said a surface re-enters the
       queue when *its SOURCE* changes. `polish_requeue.py` hashed its docs
       page and its CSS directories and stopped there — so a behavior module
       could be rewritten and the surface documenting it would never re-queue.
       `inline-editing` is the sharpest case: its entire subject is
       `row-edit.ts`, its source set was the docs page alone, and **10 of 11**
       commits touching `row-edit.ts` never touched `inline-editing.astro`.

       Generalised over the whole history — a commit is blind when it touched a
       serving module and none of the surface's own paths — **31 blind commits
       across 7 surfaces**: `data-table` 19/30, `scan` 5/6, `pagination` 3/4,
       `stepper` 2/3, `tree-table` 1/3, `alerts` 1/4, `dashboard` 0/2. The
       other fourteen ledger surfaces have no serving module. `scan`'s row was
       re-derived by hand against `git log` and reproduces exactly.

       **Said as structural blindness, not as 31 missed re-queues**, because a
       blind commit is only a *missed* one if the surface was stamped clean at
       the time and the ledger does not record that. The live proof: after the
       fix, `--apply` reported **0 rows newly marked** — every affected surface
       was already queued for another reason. The cost is latent, and it lands
       on `interaction`, the dimension `dashboard`'s round 2 found scored `na`
       on a component that ships `initCollapsibleCards`.

       - **Accept:** the map is READ from a generated artefact rather than
         guessed, on the same rule the docstring already applies to `pageSlug`;
         a surface the generated map cannot reach is named with a reason and
         **reconciled against the page it describes on every run**, failing
         loudly rather than skipping; and the new arm is red-proved with the
         injection confirmed before the red is believed.
       - **Met.** `byComponent` (Slice 264's `@serves`, which `check-js-serves`
         re-derives from the BUILT pages) gives component → exports, and
         `behaviors[<export>].module` gives the file. The two page-only
         surfaces cannot be reached that way — `row-edit.ts` declares
         `@serves data-table`, not `inline-editing` — so they sit in a
         `PAGE_ONLY_BEHAVIORS` map on the `COMPONENT_NAV_EXTRAS` precedent,
         **and both entries are taken verbatim from a note written into the
         ledger on 2026-08-23 by a different route**, which settled what these
         two pages document: `initRowEdit`; `initTableToolbar`/`initDataGrid`.
         The one judgement is excluding `initDataTables`, which
         `table-toolbar.astro` imports and that note does not name — demo
         scaffolding, not the subject — and it is named as a judgement rather
         than folded into the derivation. Each entry is re-checked against the
         page's own import every run.
       - **Red-proof, injection confirmed first, both arms.** (1) Stamp `scan`
         clean → `--check` names it **0** times; append a comment to
         `scan-input.ts` and assert the blob moved `d76699bc → 6be8650a`;
         re-run → `component/scan 005a87af -> f3491df2`, with the module named
         in the report. (2) Rewrite `initRowEdit` → `initSomethingElse` in
         `inline-editing.astro`, assert the occurrence count went **4 → 0**;
         the script exits **1** naming the map, the surface and the page.
       - **Refused, measured:** deriving the modules from each page's own
         `@busy-office/ui/js` imports. It is over-broad on `button`
         (`initDropdowns`, for one demo) and `richtext` (`initDialogs`), and
         under-reports `stepper`, which `byComponent` serves with `initWizard`
         and whose page imports nothing.
       - **Refused, measured:** extending this to patterns. A pattern screen
         composes many components, so nearly every behavior would qualify and
         the predicate would be close to uniformly true — the dead-detector
         shape 94.11 refuses.

**Not verified, and named rather than implied:** cloud wake, no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
Nothing in this slice renders — the diff is `scripts/loops/polish_requeue.py`,
`.roundtable/polish-state.md`, `ROADMAP.md` and the hand-off; **0** files under
`packages/core/src/` and **0** docs page markup changed — so that is an absence
of subject, not an unverified claim.

## Slice 275 — Objective grill of Slices 271, 272, 273, 274: 271 and 272 reproduce whole, and all three defects are one shape — a figure the wake's OWN commit moved, read from `HEAD` and published as the commit's state (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** for the eighth
wake running (`git branch --show-current` empty, `HEAD` at `e322501` =
`origin/main`) — ENVIRONMENT trap 1, fixed with `git checkout -B main
origin/main` before any work. `--unshallow` clean in one attempt (**1,883**
commits, no `shallow.lock`); it brought the tags, and `git fetch --tags origin`
was run explicitly anyway and returned all **seven**. Rule 1: no open P0 —
`list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and none
of the 13 open `N. [ ]` items is a P0. Step 1 triaged and committed nothing: no
new input. Rule 2 **0 / 4 … ok** — discharged by 274's own Standardize row, so
**rule 3 fired at 4 / 3 … OVERDUE [271, 272, 273, 274]**, exactly as the
previous hand-off predicted. Rules 4-8 **NOT EVALUATED**: a rule below a match is
unreached, not clear. Rule 5 read **STALE** (`2 wake-date(s) newer`) in any case.

**Scope: nothing dropped, and that is measured.** §6 step 0 exists because the
armed set can re-name a slice an earlier grill covered; it does not here. The
most recent grill is **Slice 265 (263, 264)**, and no grill in `ROADMAP.md` or
the archive names 271, 272, 273 or 274. `.roundtable/INDEX.md` reports **4**
repeated subjects, none of them this set. All four grilled in full.

Full report: `.roundtable/grill-objective-271-272-273-274-2026-09-05.md`.

**What reproduced — the controls, stated first, because an audit that only
reports defects has not shown its instrument can agree.** Slice 274's Step 2
split reproduces member for member against an independently written parser
(**3,211** words = rule 4 **980** + rule 3 **672** + rule 6 **631** + rule 5
**361** + rule 7 **226** + rule 8 **190** + rule 2 **119** + rule 1 **9** =
3,188, plus a 23-word preamble the slice's total implies and does not spell
out); `--self-test` passes at **12** cases; the `## Playbooks` anchor is in
**87 of 87** revisions of `LOOPS.md`. Slice 273's `bo-byline--compact` count is
**21** markup uses with the same 8/5/4/2/1/1 breakdown, and 273.3 reproduces to
the cell — a jsdom parse of **138** built pages finds `.bo-byline` on **10** and
inside a real `td`/`th` on exactly **2** (avatar 2, settings-admin 3) = **5**
cells, with the old headline in **0** files under a fresh `dist` and the new one
in **1**. Slice 272's sweep is **17/17** pointer stubs live and **17/17**
sections archived, **0** open checkboxes stranded in the archive. Slice 271's
noun fix holds — the gate reads *799 assertion(s) … (299 cited across 698
scanned file(s), 2 known-dangling baseline) and 256 slice number(s)*.

1. [x] **275.1 — DONE 2026-09-05. 274.1's Accept enumerates four window
       verdicts and one of them is false in the commit that wrote it.** Run at
       `aa550d2c` — Slice 274's own commit, in a detached `git worktree`, so the
       reading describes the state the claim is published in — `--since
       2026-09-04` prints **SLOWER**, where the Accept records it among the
       windows that *"all print FASTER"*. The cause is the commit itself: 274's
       own `LOOPS.md` edit added **130** words to `playbooks + reference`
       (7,932 → 8,062) and **0** to the dispatch region, which in the 09-04
       window lifts playbooks from +0.6% to +2.2% against a dispatch +1.7% and
       flips the comparison. The four-window sweep was run against `c32491a`,
       the pre-edit tip, and written into the post-edit commit.

       **The criterion's PROPERTY half is intact and is not in question** — the
       verdict line still prints both branches on real data (09-01 and 09-04
       SLOWER; 08-28, 08-29 and the default FASTER), so the
       detector-that-cannot-fail it was defending against is genuinely absent.
       What is wrong is that the Accept names values at all, which is CLAUDE.md's
       criterion rule — and **the same slice states that rule correctly one item
       later**: 274.2's Accept says *"the criterion is agreement with what the
       block reports, not a particular figure"*. One item apart, in one commit,
       the rule is obeyed and broken. 274.1's region TABLE is correctly
       attributed (*"Figures read at `c32491a` … before its own commit"*), so the
       wake had the distinction and applied it to the table and not to the
       Accept.
       - **Accept (met):** the flip is demonstrated at the commit that carries
         the claim rather than at HEAD; the property half is separately shown
         still to hold; and 274.1's Accept carries a dated correction naming the
         revision each verdict describes, rather than the claim being edited
         away.

2. [x] **275.2 — DONE 2026-09-05. 273.1's "16 of the 20 non-skipped rows carry a
       second round" is 17 in the commit that wrote it.** Same shape, one wake
       earlier. Parsed across the ledger's revisions: `d8c9b5d1^` reads
       **16**, `d8c9b5d1` — Slice 273's own commit — reads **17**, HEAD reads
       **17**; `dry > 0` and `budget_spent` read **0** in all three. The
       seventeenth row is **`component/byline`**, the surface that wake was
       polishing, whose `2/3` its own commit wrote. The figure was read from
       `HEAD` as it stood at dispatch and published as the state of the commit
       that moved it.

       **273.1's conclusion is unaffected and stands** — *"the counter is zero
       because no round has ever incremented it, not because no round could"*
       survives on 17 exactly as on 16. Only the count is wrong.
       - **Accept (met):** the count is re-derived at three revisions rather
         than at one, the conclusion is separately shown to be independent of
         it, and 273.1 carries a dated correction in place.

3. [x] **275.3 — DONE 2026-09-05. The transferable finding, and the one edit
       that is mechanical rather than another restatement: ENVIRONMENT's figure
       bullet does not name `HEAD`.** 275.1 and 275.2 are one shape, and it is
       already written down — *"a figure describing a commit is read from THAT
       COMMIT, never from the working tree or the prose beside it … for a figure
       going into the message of a commit that does not exist yet, the index"*.
       That bullet already records being broken twice (229.5, and the commit
       that added it breaking it in its own subject); these are the **third and
       fourth**, in consecutive wakes, in the two newest slices of the arming
       set.

       **What is new is the source both wakes actually used, which the bullet
       does not name.** Neither read the working tree: 273 read `HEAD` (the
       ledger as it stood at dispatch) and 274 ran a script that reads `HEAD` by
       construction. When your own commit changes the file, `HEAD` is the
       pre-change state and is exactly as wrong as the tree, in the opposite
       direction — and the bullet's warning, naming only the tree, reads as
       clearance for it.

       **And for a figure a SCRIPT produces, "read the index" is not
       available** — the script walks revisions and the index is not one. The
       available discipline is the one 274 applied to its table and withheld
       from its Accept: name the revision the reading describes, or re-run after
       committing and correct the number.
       - **Accept (met):** the bullet names `HEAD` alongside the working tree
         and carries the script case; the addition lands in `ENVIRONMENT.md`, a
         durable file, and adds **0 words above `## Playbooks` in `LOOPS.md`** —
         `LOOPS.md` is not in this commit's diff at all, and the `by region`
         block re-run on the staged tree reports the dispatch region unmoved at
         **6,100**. `ENVIRONMENT.md`'s own delta is **+18 / −1**, read from the
         index (`git diff --cached --numstat`) and not from the working tree —
         a first draft of this bullet said "8 lines" from memory, which is
         275.3's own finding arriving inside 275.3.

4. [x] **275.4 — DONE 2026-09-05. 274.2's no-cut branch grows the region the
       item exists to shrink, so its Accept is amended.** Prospective, not
       historical: 274.2 is open and this is the criterion a later wake will
       execute. It offers *"each rule in Step 2 either loses a region of history
       to `LOOPS-archive.md`, **or** carries a one-line recorded reason its
       history is load-bearing where it stands"*, and blesses the second branch
       as satisfying.

       Step 2 holds **eight** rules. Measured on Step 2's own prose — **284
       non-blank lines, mean 11.3 words per line, median 12** — eight one-line
       reasons written into Step 2 come to **+96 words**. The dispatch region
       grew **6,000 → 6,100, +100 words**, between 2026-09-01 and now. **So the
       branch the item blesses as a satisfying no-op costs 96% of everything the
       region has grown in four days, inside the region the item exists to
       shrink**, and the words land above `## Playbooks` — precisely the test
       274.1 built the block to apply, and precisely the ground on which 274
       refused the Ideas backlog. The same error pointing the other way: a
       *write* that moves the region while being recorded as changing nothing.
       It also sits against the criterion's own last clause, *"a cut that leaves
       the dispatch region unmoved does not satisfy it"*, which reads as refusing
       the branch it opens with.

       **Amended, not deleted:** the reason is recorded where the decision is
       already recorded — `ROADMAP.md`, which is diffed and reviewed — instead of
       inside the rule. Rule 4's own precedent decides it: what may leave the
       region is history a wake needs when it **argues** about a rule, never the
       sentence it **executes**, and a reason a rule's history is load-bearing is
       an argument about the rule.
       - **Accept (met):** 274.2's Accept states where the reason is recorded and
         no longer admits a branch that adds words above the anchor; the amended
         wording is checkable by measurement (the block agrees with what the
         commit did) rather than by a figure; and the amendment itself adds **0
         words above `## Playbooks`**.

**274.2 stays OPEN, and is still not taken by a cloud wake.** Its own text says
cutting the file that governs every wake, unattended, is the one edit where being
wrong is silent and compounds. This grill amended the criterion; it did not
execute it.

**Not verified, named rather than implied.** Cloud wake: no Podman, no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
**Nothing in this slice renders**, measured rather than asserted — the diff is
`ROADMAP.md`, `.roundtable/ENVIRONMENT.md` and one new `.roundtable/` report:
**0** files under `packages/core/src/`, **0** docs pages, **0** CSS, **0**
scripts, and the docs site builds none of the three into a page. That is an
absence of subject, not an unverified claim. The full cloud toolchain was run
green regardless; `check:claims`' *"3 NOT VERIFIED"* is ENVIRONMENT 6b, this
container reporting `(hover: hover) and (pointer: fine)` false, not a regression.

## Slice 274 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4's finding is that its own instrument measures the wrong box — `LOOPS.md`'s every-wake DISPATCH region grew +300% where the file grew +220%, so the row a sweep reads understates the burden it exists to catch (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** for the seventh
wake running (`git branch --show-current` empty, `HEAD` at `c32491a` = `origin/main`)
— ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,881** commits, no `shallow.lock`);
it brought the tags this time, and `git fetch --tags origin` was still run
explicitly and returned all **seven** (`v0.1.1`…`v0.7.0`) — checked, not assumed.
Rule 1: no open P0 — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, and none of the 12 open `N. [ ]` items is a P0. Step 1 triaged
and committed nothing: no new input.

**Rule 2 fired.** `dispatch_status.py` read rule 2 **4 / 4 … OVERDUE** and rule 3
**3 / 3 … OVERDUE [271, 272, 273]**; rule 2 sits above rule 3, so **Standardize**
dispatched and rules 4-8 were **NOT EVALUATED** — a rule below a match is
unreached, not clear. Rule 5 read **STALE** (2 wake-dates newer) in any case.
Both counters were exactly as the previous hand-off predicted, which is the
comparison `LOOPS.md` asks for right after recording.

**Lane 1 of 4 — `scan:dead-style`: clean.** **0** dead declarations on **0**
pages against **1,433** live inline declarations, screen and print both
measured, `0` dead-on-screen-but-live-in-print.

**Lane 2 of 4 — `report:css-repeats`: clean, and the delta is what was read.**
74 source files · **242** rules with 3+ declarations · **230** distinct bodies ·
**8** repeating — identical on all three totals to Slice 237's sweep, and the
repeat set matches `LOOPS.md`'s table **member for member and multiplicity for
multiplicity** (4, 3, 3, 2, 2, 2, 2, 2). The x4 joined-control group is still
**two components** (money ×2, quantity ×2), so its stated reopen trigger — a
THIRD component — is unmet.

**Lane 3 of 4 — `report:prose`: clean, checked by SET MEMBERSHIP.** 118
documentation pages of 127 built · median **792** · mean 941 · **111,018** words
(105,705 at Slice 237, +5.0%). Ten pages over 2x the corpus median and eleven
over a family median; the union is **fifteen distinct pages**, up from fourteen,
and every one resolves against the **sixteen verdicted** — 158.1's twelve,
161.1's three and 178.3's `/concepts/scale/`. Nothing is flagged outside them;
`/patterns/output-form/` is the one verdicted page not flagged today. Membership
is what was checked, per 228.1's record that grepping each page path out of
`ROADMAP.md` + the archive returns hits whatever the truth is.

**Lane 4 of 4 — `report_loop_prose.py`: carries the finding.** The `ratchet`
block read first, per the playbook. Two files read `never cut`: `DESIGN.md`
(22 up) and **`CLAUDE.md` (32 up)**, and `CLAUDE.md` is the one the loop reads
every wake. Its growth carries a live verdict — **193.1, "fold nothing, and the
watch RETIRES"** — so the question is whether anything has changed under it, and
193.1's own command answers that it has not:

```
# split CLAUDE.md on ^## at a revision; body words by Python str.split()
#   a7c65f7c (193.1's tip)  17 sections · 5,248 body words
#   HEAD                    17 sections · 5,658 body words
# per-section delta since a7c65f7c: +318 "How to document a component (the
#   recipe)", +92 "Quality bar"; no section added, none removed
```

**Zero new `##`**, and neither grown section is in the eight-on-one-subject set
193.1 adjudicated. The retired watch stays retired — measured, not assumed.

1. [x] **274.1 — DONE 2026-09-05. The lane-4 instrument measured the FILE where
       the burden is a REGION, and the two disagree by 80 percentage points.**
       `LOOPS.md` reads **8 up, last cut `9198e43f` (2026-08-29)** — the shape
       lane 4 names, *a file the loop reads every wake accumulating with no cut
       behind it*. But every other row in that report is a file a wake opens end
       to end, and `LOOPS.md` is not: a dispatcher reads the front matter, the
       loop table and Steps 0-2 — everything above `## Playbooks` — to DECIDE,
       and only then the one playbook it dispatched. Split there, over 158.2's
       window:

       Figures read at `c32491a` — the tip this sweep dispatched from, before
       its own commit, since a figure describing a state is read from that state:

       | region | base 2026-08-20 | `c32491a` | delta |
       |---|---|---|---|
       | dispatch (start .. `## Playbooks`) | 1,525 | **6,100** | **+300.0%** |
       | playbooks + reference | 2,855 | 7,932 | +177.8% |
       | whole file | 4,380 | 14,032 | +220.4% |

       The dispatch region's share of the file went **34.8% → 43.5%**, and since
       167.2's split (`3006da0a`, 2026-08-28) it went **3,398 → 6,100, +79.5% in
       eight days** — 167.2 cut narratives OUT of this region and the region
       rebounded past where it started. Step 2 alone is **3,211** words for eight
       rules (rule 4 **980**, rule 3 672, rule 6 631, rule 5 361, rule 7 226,
       rule 8 190, rule 2 119, rule 1 9). So the whole-file row **understates**
       the thing the lane exists to catch, the same error shape the script's own
       header records for summing `ROADMAP.md` with its archive: both measure a
       quantity no wake reads. This is CLAUDE.md's *"measure the box that carries
       the constraint"* landing on the loop's own instrument.

       **The fix is a `by region` block in `report_loop_prose.py`**, printing
       both regions, each share, and **which grew faster** — the direction is
       computed and printed, never predicted, so the block states a property
       rather than the value it will have.

       - **Accept (all met, each by measurement):**
         - **The block's figures reconcile against an independent parse of the
           same two revisions** — a throwaway parser produced 1,525 / 2,855 and
           6,100 / 7,932 *before* the script printed them, and the script
           reproduces both pairs exactly. Two instruments, not one.
         - **The verdict line is shown to print BOTH branches on real data, not
           only on synthetic input.** `--since 2026-09-01` prints *"grew SLOWER
           than the file, so the whole-file row OVERSTATES it"*; the default
           window and `--since` 08-28, 08-29 and 09-04 all print FASTER. A line
           that can only ever say one thing is the detector-that-cannot-fail this
           repo keeps paying for; this one discriminates.

           **CORRECTED by 275.1 (2026-09-05). The four verdicts above were read
           at `c32491a`, this sweep's pre-edit tip, and one of them is already
           false at `aa550d2c`, the commit that carries them:** `--since
           2026-09-04` prints **SLOWER** there, because this slice's own
           `LOOPS.md` edit added 130 words to `playbooks + reference` and none to
           the dispatch region. The criterion's PROPERTY — that the line prints
           both branches on real data — holds and is what this bullet is for
           (09-01 and 09-04 SLOWER; 08-28, 08-29 and the default FASTER at
           `aa550d2c`). Enumerating the verdicts at all is the defect, and it is
           CLAUDE.md's criterion rule; 274.2's Accept, one item below, states
           that rule correctly. A verdict quoted without the revision it
           describes is read as current.
         - **`--self-test` gains four discriminating pairs plus the missing-anchor
           case and passes at 12 cases** (was 7). Each pair is a near-twin that
           must land on the *other* side of the anchor — same words with the
           anchor moved, a `## Playbooks` mention inside prose that must not
           split, a `###` heading of the same name that is not the anchor.
         - **The guard's provability is stated rather than claimed.** The
           `## Playbooks` anchor is present in **86 of 86** revisions of
           `LOOPS.md`, so the "cannot split" branch has **no real input that
           exercises it** and is proved by the synthetic case only. Saying so is
           the point: a base rate of 86/86 is exactly the condition under which a
           guard looks green while never having run.
         - **`LOOPS.md`'s lane-4 instruction names the property** — read the
           `by region` block for this file, the finding is the dispatch region
           outgrowing the file — and sits BELOW `## Playbooks`, so writing it did
           not grow the region it governs.

2. [x] **274.2 — ANSWERED 2026-09-05 (cloud wake). The cut is in Step 0c, not
       in Step 2: Step 2 has no archivable slab left, and that is measured
       rather than asserted. The dispatch region is 6,100 words and nothing has
       cut it.** 274.1 fixed the
       instrument; the burden it measures is unchanged, and the two candidate
       cuts below were both refused for landing outside the region. What is
       inside it is Step 2 — **3,211 words for eight rules**, of which rule 4 is
       **980**, rule 3 **672** and rule 6 **631** — plus Step 0c's 1,378. 167.2
       is the precedent and the method: it moved rule 3's recurrence narratives
       to `LOOPS-archive.md` and left the instruction behind as a paragraph, on
       the stated ground that *a pointer is read less than a paragraph*, so what
       may move is history a wake needs when it ARGUES about a rule, never the
       sentence it EXECUTES.

       **Deliberately not taken by this cloud wake.** Cutting the file that
       governs every wake, unattended, is the one edit where being wrong is
       silent and compounds — and 167.2's argument has lost once and won once,
       so the boundary is a judgement, not a rule.

       - **Accept** — properties, and finding nothing cuttable satisfies it:
         each rule in Step 2 either loses a region of history to
         `LOOPS-archive.md`, **or** its reason for keeping that history is
         recorded **in `ROADMAP.md`, under this item** — one line per rule,
         written where the decision is already diffed and reviewed, **never
         added to the rule itself**. Whichever happens, the `by region` block
         agrees with what the commit did — the criterion is **agreement with
         what the block reports, not a particular figure** — and the commit adds
         **0 words above `## Playbooks`**, asserted by re-running the block
         rather than by reading the diff. A cut that leaves the dispatch region
         unmoved does not satisfy the *cut* branch; the no-cut branch is
         satisfied by the reasons being recorded, with the region unmoved.

         **AMENDED by 275.4 (2026-09-05), and the amendment is measured.** The
         original wording had each rule *"carry"* its reason, which puts the
         words inside Step 2: **eight** rules at Step 2's own median of **12
         words per line** is **+96 words** above the anchor, against a dispatch
         region that grew **+100 words** in total between 2026-09-01 and this
         wake. The branch this item blesses as a satisfying no-op would have
         spent 96% of four days' growth on the region it exists to shrink —
         the same error 274.1's block was built to catch, pointing the other
         way. Rule 4's own precedent decides where the words go: what may leave
         the dispatch region is history a wake needs when it **argues** about a
         rule, never the sentence it **executes**, and a reason a rule's history
         is load-bearing is an argument about the rule.

       **DONE 2026-09-05 (cloud wake). What the commit did, and why the cut is
       not in Step 2.** Both branches of the Accept are exercised: Step 0c
       loses a region of history, and every one of Step 2's eight rules records
       its reason for keeping one, below. The `by region` block is re-run
       after committing and its figure is named with the revision it describes,
       per `ENVIRONMENT.md`'s 275.3 bullet — the block reads `HEAD`, so a
       working-tree reading of it would be exactly the defect 275 filed.

       - **Moved to `LOOPS-archive.md`** (new `## Step 0c` section, verbatim,
         873 words including an 87-word header): the forensics of the two
         collisions, the refuted *"safe by construction"* argument with its
         5-of-5 measurement, and the measurements behind the three refused
         alternatives. **Kept inline**, because they are what a wake executes
         or decides by: the decision itself, the named cost, the correction
         that no guaranteed conflict catches a collision, the
         `git fetch origin main` rule that does, the keep-BOTH-row-sets
         conflict recipe, the one-line reason for each of the three refusals,
         and the reopen condition.
       - **Measured:** dispatch region **6,100 → 5,658 words (−442, −7.2%)**;
         Step 0c **1,391 → 949**; Step 2 **3,211, unchanged**; words added
         above `## Playbooks`: **0**. (Step 0c reads 1,391 here against the
         1,378 above because this parser counts the section's 13-word heading
         and 274.1's did not — agreement, not a discrepancy.)

       **Why no rule in Step 2 loses history — the measurement that decides
       it.** The two precedents moved *slabs*: 167.2 took **749** contiguous
       words out of rule 3, 191.3 took **414** out of rule 4, and both survive
       as single sections in `LOOPS-archive.md`. Step 2 has nothing of that
       shape left. Its largest **paragraph** is 206 words and its median is
       ~70 (script: paragraph split over the eight rules, `LOOPS.md` at
       `bf2e7c21`), and the largest contiguous *pure-narrative* block inside
       any of them is **~106 words**. Recovering the ~10 scattered fragments
       would net roughly 400 words — 6.6% of the region — in exchange for ten
       pointer-follows per wake, which is a worse trade than either precedent
       made and is the one 167.2's own losing argument (*a pointer is read
       less than a paragraph*) warns against. **The paragraph totals are
       mechanical; the executed-versus-narrative split inside a paragraph is a
       hand classification, and is named as one** — per CLAUDE.md, a property
       that depends on what prose MEANS is a rubric a human scores, not a gate.

       One line per rule, as the Accept requires:

       1. **Rule 1 (9w)** — one sentence, no history at all. Nothing to keep.
       2. **Rule 2 (119w)** — its single 98-word paragraph is why the rule sits
          above rule 4; the archive's own charter keeps *"why it sits where it
          does"* inline. Pure-narrative block: **0**.
       3. **Rule 3 (672w)** — the slab is already gone (167.2's 749). What is
          left is three measurement fragments (~55w, ~70w, ~35w) embedded in
          decision paragraphs, each needing a 20-40w pointer to stay
          resolvable; net recovery ≈ 75 words.
       4. **Rule 4 (980w)** — 191.3 already took 414. Of what remains, the
          308-word blocked-kind taxonomy is executed by every cloud wake and
          the 201-word 236.2 amend rule by every sweep. Narrative: ~70w of
          stale-numbers archaeology and the ~95w 2026-08-19 LIFO incident.
       5. **Rule 5 (361w)** — holds Step 2's largest pure-narrative block, the
          106-word *"missing here for six days"* restatement. Kept: it is the
          only record that this rule's text changed and why, and the rule was
          dead for six days precisely because a fix landed in the playbook and
          never reached it. The 138w `dispatch_status.py` instruction is
          executed; the 87w *"Two, not one"* is the threshold.
       6. **Rule 6 (631w)** — the 123w and 128w paragraphs are executed
          negative instructions (do not re-raise 176.3, do not narrow the rule;
          run `polish_requeue.py --apply` first). Narrative ≈ 90w inside the
          206-word predicate paragraph.
       7. **Rule 7 (226w)** — the 125w is the evidence that this rule has never
          fired, which is the whole content of the rule; the 67w is executed
          (*do not fix either by rewording this rule*).
       8. **Rule 8 (190w)** — the 71-word idle-spiral incident is its only
          narrative and is the rule's entire justification: it is what stops a
          wake idling instead of halting. Kept deliberately.

       **Not verified, and named rather than implied:** nothing in this change
       renders. The diff is `LOOPS.md`, `LOOPS-archive.md` and `ROADMAP.md` —
       no CSS, no docs page, no script, no built surface — so the 1440/390
       light-and-dark screenshot lane a cloud wake cannot run has nothing to
       say about it. That is an absence of subject, not an unverified claim.

**Refused, and the region block is what makes the refusal legible: archiving
the 1,421-word Ideas backlog.** It is the obvious cut — **1,066 words, 75.0%,
are struck-through graduated spike entries**, each already carrying a full
report in `.roundtable/explore-*.md`, in the exact incident-narrative shape
167.2 moved to `LOOPS-archive.md`. (Counted, not eyeballed: the first estimate
written here was "~89%", and the parse — words inside entries opening `- ~~`,
against the section's own total — returned 75.0%, with 339 words in live
entries and 16 of preamble.) It is refused because it sits **below**
`## Playbooks`: moving the whole section takes the file 14,032 → **12,611**
words, moving only the struck entries 14,032 → **12,966**, and the dispatch
region stays **6,100 in both cases**. That is improving the instrument's
number without touching the burden it stands for, and the block now prints
both figures side by side so the next wake can see it instead of re-deriving
it. Two further reasons, both measured: the backlog is not dormant — the most
recent of **57** `Explore` rows in 1,411 (2026-08-29) *filed into it*, and the
open "Known Limits" idea is still queued for a spike — and three entries carry
forward-looking *"do NOT re-spike the naive version"* instructions to a future
Explore, which is precisely the content 167.2's losing argument ("a pointer is
read less than a paragraph") protects.

**Refused: archiving the three `Settled:` sections** (1,314 words —
visually-hidden 209, 0fr/1fr 236, "the count is a command" 521, BCD paths
348). Refused on first-hand evidence from this very sweep rather than on
principle: **lane 2 above read the visually-hidden section's table of eight to
adjudicate the repeat set**, which is what the Standardize playbook sends a
wake there to do every 4th Continue round. A section a standing lane reads is
not archaeology, whatever it looks like.

**Not verified, and named rather than implied:** nothing in this slice renders.
The diff is one Python instrument and two markdown files, with no CSS, no docs
page and no built surface, so the 1440/390 light-and-dark screenshot lane a cloud
wake cannot run has **nothing to say about it** — this is an absence of subject,
not an unverified claim. The full cloud toolchain was run green regardless.

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

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input. Rule 2 `2 / 4
Continue rounds … ok`; rule 3 `1 / 3 slice … ok [271]`. **Rule 4 matched on its
own sweep clause**, not on a queued item: all 11 open items re-read from
`ROADMAP.md` this wake are owner-blocked (`249.7`, `249.10`-`249.13`, `112.3`,
`112.4`, Slice 15) or browser-blocked in the SCREENSHOT sense (`249.6`,
`249.9`, `249.15` — `LOOPS.md` 186.2's vocabulary; a LOCAL wake can take those
three). Rules 5-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports it **STALE**
(2 wake-dates of loop activity newer than the newest comparable pair, itself
`bundle-gz-kb`). Per `LOOPS.md`'s own instruction this rule **could not be
evaluated** this wake — it is not being reported clear. Its second clause
(184.2's outright budget breach) was not reached either, rule 4 having matched.

1. [x] **272.1 — DONE 2026-09-05. The eleventh archive sweep: 17 closed slices
       moved verbatim, `ROADMAP.md` 6,468 → 3,524 lines at the move, and the
       four eligible targets an open item names were read one at a time and
       kept.**

       **The trigger is measured, not a cadence.** `roadmap_scope.py` read
       closed-history share **3,668 / 6,468 = 56.7%** (208.1's definition), with
       21 eligible targets — above the **55.1%** at which 252.1's lane 4
       dispatched the tenth sweep two days earlier. Rule 4's own text is what
       authorises taking it from inside a dispatch (*"if this rule is walking
       thousands of lines, that is the signal"*), and Slices 165, 177 and 252
       are the precedent.

       Moved, in the order they held in the live file, each leaving the standard
       heading + one pointer line: **271** (118 body lines), **270** (162),
       **269** (190), **268** (296), **267** (211), **266** (156), **265** (208),
       **264** (177), **263** (241), **261** (134), **259** (88), **258** (174),
       **257** (225), **256** (241), **255** (104), **254** (71) and **252**
       (199) — **2,995** body lines. `ROADMAP-archive.md` 34,431 → **37,443**,
       and the **+3,012** reconciles exactly as 2,995 body + 17 headings.
       Closed-history share **56.7% → 19.1%** (673 / 3,524).

       *Two different live-file figures, both true, kept apart because
       ENVIRONMENT's "read a commit's figure from that commit" bullet has been
       broken twice by exactly this conflation:* the **move** took `ROADMAP.md`
       6,468 → **3,524**; this **commit** carries 6,468 → **3,689**, because
       writing this slice back is the rest. All figures read from the index
       (`git show :<file> | wc -l`) and `HEAD`, never from the working tree.

       **THE FOUR TARGETS 236.2 FLAGS WERE READ, AND THE FINDING IS THAT NONE
       CARRIES AN AMEND CLAUSE.** 236.2's rule is *"a sweep must not move text
       an open item's Accept says to amend"*, and `roadmap_scope.py` errs
       toward over-reporting by design — any `Slice N` inside an open item's
       text fires. Reading all four citations in full, every one is
       **provenance**, not a target:

       | flagged target | the open item's own words | reading |
       |---|---|---|
       | 253 | `249.6`: *"Corrected by Slice 253's grill, finding C."* | where a correction came FROM |
       | 262 | `249.7`: *"That clause is SPLIT OUT as 249.19 and LANDED (Slice 262, 2026-09-04) — do not re-derive it."* | where a split-out clause LANDED |
       | 237 | `249.12`: *"the archive-sweep practice exists (Slices 224, 228, 235.2, 237.1 all did one)"* | one instance of a practice, in a list of four |
       | 260 | `249.15`: *"the TAG half is split out as 249.17 and has landed (Slice 260)"* | where a split-out half LANDED |

       Not one of the four Accepts names its target as something to change, and
       three of the four cite a slice for something that has already shipped. A
       provenance citation resolves from the archive exactly as well as from the
       live file — that is `check:slice-refs`'s whole job, and it passes on the
       swept tree.

       **They stay put anyway, and the trade is stated rather than hedged.**
       Moving them buys 673 lines and would take the share to roughly 0%;
       keeping them costs those 673 lines and overrides nothing. 252.2 refused
       Slice 237 on this same list, and 236.2's own text says the predicate is
       **semantic** — the difference between a slice cited as a REASON and one
       cited as a TARGET — which is why it is a report a wake judges and not a
       gate. A sweep is the worst place to re-litigate a caution rule: it is a
       bulk edit, and CLAUDE.md's bulk-edit rule points the other way. What is
       banked here is the reading, so a later wake starts from the quotes rather
       than re-deriving them.

       **An observation, filed rather than acted on:** all four are pinned by
       **one** still-open slice, 249, whose remaining items are owner calls. If
       249 stays open, those 673 lines are permanently live history and the
       share has a floor of 19.1% that no sweep can lower. That is the concrete
       cost `249.12` (the archival-trigger question, **OWNER OR ARCHITECTURE
       CALL**) is about, and it is left there rather than answered here.

       - **Accept:** for every moved slice, its pre-move block appears **exactly
         once** in `ROADMAP-archive.md` byte-identically, its interior is
         **absent** from the live file, and the live file carries heading +
         pointer; every target an open item names is read and a decision
         recorded for it; the raw checkbox counts across the pair are conserved;
         `check:slice-refs` passes and its delta reconciles against an
         independently derived expectation; the verifier is a second,
         independently written parser reading the PRE-MOVE source from git, and
         each of its arms is red-proved by an injection **confirmed to have
         landed** before the red is believed.

       **Verification is a second, independently written parser**, and it reads
       the PRE-MOVE source (`git show HEAD:ROADMAP.md`) rather than the mover's
       memory, splitting on `^## ` boundaries where the mover indexed lines. It
       also asserts the four refused targets — and Slices 249, 112 and 15 — are
       still intact live, distinguishing an intact section from a pointer stub.
       Checkbox conservation across the pair: **(11 open, 690 closed) → (11,
       690)**, counted raw in all four texts.

       **Three arms red-proved by injection, each injection confirmed landed**
       — CLAUDE.md's rule that a green red-proof is a defect in the injection
       until proven otherwise:

       - *Archive arm.* One interior line of Slice 256's archived block was
         mutated. Confirmed landed by counting the block in the archive
         **1 → 0** with the marker present in the file; verifier went red
         (`Slice 256: archive holds the block 0 time(s), expected 1`), exit 1.
       - *Removal arm.* Slice 263's interior was appended back into the live
         file. Confirmed landed by reading the property before/after
         (`False → True`); verifier went red (`block interior STILL present in
         the live file`), exit 1. **Checkbox conservation went red in the same
         run** — `(11, 690) → (11, 691)` — so that arm is demonstrated able to
         fail, but *coupled to this injection*, not independently proved.
       - *236.2 arm, red-proved end-to-end by committing the actual defect.*
         The mover was re-run with **253 added to its move list** — the exact
         mistake the rule exists to prevent, not a proxy for it. Confirmed
         landed by the mover's own output (18 slices moved, 253 among them,
         6,468 → 3,362). The verifier caught it **alone**:
         `Slice 253: expected intact live text, found a pointer stub`, exit 1,
         with checkbox conservation still green — which is what shows this arm
         does independent work rather than riding on the others.

       Both files were restored to `HEAD` and the mover re-run between every
       proof, and the verifier is exit 0 on the **swept** tree — the tree the
       move produced, before this slice was written back.

       *Re-running it on the COMMITTED tree reports `(11, 690) → (11, 691)` and
       exits 1, and that is correct output, not a defect:* 272.1's own `[x]`
       is a checkbox the pre-move source does not have, so pair-wide
       conservation cannot hold across a commit that adds one. Same shape as
       the two `check:slice-refs` readings and the two line-count figures above
       — a property of the MOVE, quoted for the COMMIT, is the conflation all
       three notes are about. A later wake re-proving this sweep must run the
       verifier against the move, not the commit.

       `git stash` was not used at any point (ENVIRONMENT's rule): the A/B here
       is of DATA rather than a script, so the two markdown files were copied
       aside and `git checkout --`'d instead.

       **`check:slice-refs` 775 → 792, and the +17 reconciles exactly.** A swept
       slice number heads a section in **both** files, so each earns one extra
       uniqueness check — seventeen slices, seventeen checks. Cited refs hold at
       **295** across **698** scanned files and the known-dangling baseline at
       **2**; live slice sections stay **253**, because a pointer stub keeps its
       heading. Both readings came from running the gate at `HEAD` and on the
       swept tree, not derived. *The committed tree reads **793 / 254**, one more
       of each* — this slice's own heading arriving, the same +1-per-new-section
       arithmetic applied to a section that heads only the live file. Stated
       separately because 775 → 792 describes the SWEEP and 775 → 793 describes
       the COMMIT.

**NOT VERIFIED, said plainly.** This is a cloud wake: there is no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
**Nothing in this slice renders**, and that is measured rather than asserted —
the diff is exactly two markdown files, **0** files under `packages/core/src/`,
**0** docs pages, **0** CSS and **0** scripts; the docs site builds neither
`ROADMAP.md` nor `ROADMAP-archive.md` into a page. All **17** CI entry points,
re-derived from `ci.yml` rather than read off `ENVIRONMENT.md`'s snapshot, ran
green in this container.

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

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty) — trap 1, fixed with
`git checkout -B main origin/main` before any work. `git fetch origin main`
moved `26447ba..681a88e`, which is the previous wake's own hand-off commit, not
a second dispatcher; working tree clean, `RESUME.md` "In flight: nothing".
Step 1: no new input — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, so nothing was triaged and nothing committed there. Step 0b:
rule 2 `3 / 4`, rule 3 `1 / 3` (both `ok`), rule 5 **STALE** by 1 wake-date and
therefore reported as *could not be evaluated*, per `LOOPS.md` rule 5. Rule 1
clear — no open `N. [ ]` item is a P0. So **rule 4, Continue, build mode**.

**Rule 4's oldest open item is `249.6`, and it is declined again — but at the
CLAUSE level this time**, which is what `RESUME.md`'s correction block asks
for. 249.6's Accept reads *"each row's terminal page contains a `Demo` or a
pattern link inside its content region"*, and the item's own banked table says
three of six rows have neither. So the gate arm cannot land green until those
three pages gain something, and the two ways to do that split cleanly: a `Demo`
is a rendered screen (`ENVIRONMENT.md`'s FIRST list, no cloud wake), and a bare
pattern link would be fitting the page to the gate rather than the reader —
which is the item's own still-open question (*"or three of the six rows cut …
deciding that is still part of the item"*), not a wake's to settle by padding.
The premise was re-run rather than trusted: all three pages still read **0**
`Demo` and **0** `/patterns/` hrefs in source
(`grep -c Demo …; grep -o "/patterns/[a-z-]*" …` on `getting-started/scope`,
`concepts/js-behaviors`, `concepts/theming`). 249.6 stays open, unchanged.

Next-oldest is `249.7`, which the hand-off records as a **cost** question
waiting on the owner's `249.10` — but with one measurement inside it flagged
*"worth keeping either way"* and owned by no item: **the dropdown page never
names or links `combobox` in its own content.** That is the clause this wake
took, split as **249.19**.

### The banked claim reproduced, and then stopped being the finding

Reproduced independently, on the BUILT tree rather than from source: the
dropdown page carries exactly **2** `href="…/components/combobox"` whole-page
and **0** inside its content region — 249.7's *"0 hrefs; the 2 whole-page hits
are shell chrome"*, confirmed by a different route.

Then the base rate was measured before anything was fixed (CLAUDE.md 94.11),
and it refuted the obvious next step. A probe read every built component
page's content region — anchored at `class="… docs-content"` through
`</main>`, because the docs shell lists all 43 components in its sidebar on
every page and a whole-page reading is the uniformly-true predicate that
anchor exists to avoid:

```
built component dirs 43 · content region found on 41 · 1 without one
  (the one is /components/nav — the registered redirect Slice 261 already
   found; a redirect stub has no content region, which is the right answer)
component→component links inside the content region: 126, min 1 max 11 per page
distinct page pairs linked at least one way: 97
  symmetric (both directions): 29 = 29.9%      asymmetric: 68
  of the 68, the target never even NAMES the source: 55
```

**The command, next to the claim** (CLAUDE.md — a count without its command
gets re-derived, and re-deriving is where the second, different mistake comes
from). Run after any `docs:build`; it reproduces on the `DOCS_BASE` build too,
which is a second reading of the same graph:

```
node -e '
const {readFileSync,readdirSync,existsSync}=require("fs"), D="apps/docs/dist/components";
const L=new Map();
for(const s of readdirSync(D)){const f=`${D}/${s}/index.html`; if(!existsSync(f))continue;
  const h=readFileSync(f,"utf8"), m=h.match(/<div class="[^"]*docs-content[ "]/); if(!m)continue;
  const r=h.slice(m.index,h.indexOf("</main>",m.index));
  L.set(s,new Set([...r.matchAll(/href="[^"]*\/components\/([a-z0-9-]+)(?:[\/#][a-z0-9-]*)?"/g)].map(x=>x[1]).filter(t=>t!==s)));}
const P=new Map();
for(const [f,ts] of L) for(const t of ts){ if(!L.has(t))continue; const k=[f,t].sort().join("|"),[a]=k.split("|");
  const p=P.get(k)||{ab:0,ba:0}; f===a?p.ab=1:p.ba=1; P.set(k,p);}
const all=[...P.values()], sym=all.filter(p=>p.ab&&p.ba).length;
console.log(`pages ${L.size} · pairs ${all.length} · symmetric ${sym} (${(sym/all.length*100).toFixed(1)}%) · asymmetric ${all.length-sym}`);'
# before this slice: pages 41 · pairs 97 · symmetric 29 (29.9%) · asymmetric 68
# after:             pages 41 · pairs 97 · symmetric 30 (30.9%) · asymmetric 67
```

**A committed report script was refused rather than shipped.** The repo's
existing not-a-gate reports (`report:prose`, `report:css-repeats`,
`report_loop_prose.py`) each earn their place by having a Standardize lane
that runs them — `LOOPS.md` says outright that the lane is *"the only thing
keeping it from rotting"*, and four consecutive sweeps still ran three lanes
of four. A fifth report with no lane is a script nobody runs; a fifth lane is
a recurring cost for a question this slice answers once, with no standing
delta to watch (a new component adds links; asymmetry stays the norm either
way). The command above is the durable form.

So **`dropdown` never names `combobox` is 1 of 55 pairs of exactly that
shape**, and reciprocal linking is not the norm here — it is the exception, at
29.9%. Most of the asymmetry is correct: the graph has hubs — in-degree
`data-table` **16**, `form` **15**, `badge` 7 — and a hub that linked back to
all sixteen would be a worse page, not a better one. A
symmetry gate is therefore **refused** — it would go red on 68 pairs that are
mostly right, which is 94.11's shape exactly.

A second candidate gate was measured and refused the same way. CLAUDE.md's
recipe says the wrong-choice clause names a wrong context *"and links the
alternative"*, and `check:wrong-choice` enforces only the clause. Base rate of
the missing half: **37 of 37** non-exempt component openers and **39 of 39**
pattern openers already carry at least one link — 100% on both, a predicate
uniformly true, so a gate over it distinguishes nothing.

### What survived: a page-local hole, argued without the statistic

What makes dropdown/combobox different from the other 54 is not the count, it
is that **the other page has already claimed the boundary from its side**.
`combobox`'s opener routes readers away twice — to `form` for a short fixed
list, and *"For picking **several** values, use the multi-select dropdown
instead — different job"*. Dropdown's opener answers only the too-FEW-options
case (`segmented`) and says nothing about too many. It documents a
multi-select menu, so the reader arriving from combobox's pointer lands
correctly; the reader who starts at Dropdown with a 200-row list is sent
nowhere.

Fixed in the two places the recipe has for it: a second `<strong>Not …</strong>`
clause in the opener pointing at Combobox, and Combobox added to `Related`.
Not the other 54 — those are a general property with no page-local argument
behind them, and fixing them because a number is 29.9% is the busywork
`LOOPS.md`'s operating rules refuse.

### Verification

The probe was red-proved by injection before its numbers were believed, and
the injection was confirmed present in the file first (CLAUDE.md's green
red-proof rule): inserting one `<a href="/components/combobox">` into the
BUILT dropdown page took its combobox href count `2 → 3` and moved the probe
`29 → 30` symmetric, `55 → 54` never-names, with the `dropdown never names
combobox` row disappearing. The file was restored byte-for-byte and the probe
re-read the baseline exactly. **The real source change then reproduced the
same three movements** on a fresh `docs:build` — the injection and the fix
agree, which is the discrimination check the anchor is there to make possible.

All 17 cloud-toolchain entry points green in this container, re-derived from
`ci.yml` rather than read off the list. `check:claims` reports its documented
**3 NOT VERIFIED** (`ENVIRONMENT.md` 6b — this container reports
`(hover: hover) and (pointer: fine)` false; 162 live, up from 158 as prose
lands, not claims being skipped). The `DOCS_BASE=/busy-office-ui` parity build
was run and its base-stripping branch **confirmed exercised**, not merely
green: the built dropdown page carries **4** `href="/busy-office-ui/components/combobox"`
— two sidebar, one opener, one Related — with no unprefixed variant.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The change is prose plus one
`Related` entry on ONE page; `check:layout` (127 pages at 390 and 150% zoom),
`check:scroll` (912 containers × 2 widths) and `test:axe` (127 pages × 2
widths) are green over it, and those assert properties, not pixels — whether
the longer opener *reads* well at 390px is the part a local wake's eyes would
settle.

## Slice 261 — 249.9's "no JSON key exists" is false, and the key it asked for is an inversion of one this repo already ships (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 260 — 249.15's tag half split out and landed: every built page now says what a shared link should show, and the three equalities are what makes the arm able to fail (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** (`git branch
--show-current` empty) with local `main` stale at the pre-fetch tip, so trap 1
in its milder shape; `git checkout -B main origin/main` before any work.
`git fetch origin main` at Step 0 moved `26447ba..3e1dac1`, which is the
previous wake's own hand-off commit, not a second dispatcher. Step 1: no new
input — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, so nothing was triaged and nothing committed there. Step 0b:
rule 2 `1 / 4`, rule 3 `1 / 3` (both `ok`), rule 5 **STALE** by 1 wake-date —
reported as *could not be evaluated*, per `LOOPS.md` rule 5, and see the
standing note on `bundle-gz-kb` below. Rule 1 clear (no open `N. [ ]` item is a
P0). So **rule 4, Continue, build mode.**

**Which item, and why not the oldest.** Rule 4's OPEN set is
`[15, 112, 249]`, 11 open items. Slice 15's `AT runtime evidence` and
`112.3`/`112.4` are **owner-blocked**. Inside 249: `249.6`, `249.9` and
`249.15` were all classified **browser-blocked in the screenshot sense**;
`249.7` is a cost question deliberately held until the owner answers `249.10`;
`249.10`, `249.11`, `249.13` are owner calls and `249.12` is owner-or-
architecture. Re-read rather than taken from the hand-off, and **one of those
classifications is only half true**: `249.15` is one item covering two
different kinds of evidence. Its card IMAGE is a rendered image a human
compares; its `og:`/`twitter:` TAGS are `<head>` content in the built artifact,
which is `ENVIRONMENT.md`'s second list and takeable here. Split as `249.17`,
on the precedent of `249.16` out of `249.4` three days earlier — same shape,
same reason.

**The premise was re-checked on the BUILT artifact, not on source** (CLAUDE.md's
premise rule, and its downstream rule: `astro build` is what turns a prop into a
tag). A full `docs:build` was run at `3e1dac1` with this wake's files stashed:

```
find apps/docs/dist -name index.html | wc -l                     # 138
grep -rl 'property="og:' apps/docs/dist --include='*.html' | wc -l   # 0
grep -rl 'name="twitter:' apps/docs/dist --include='*.html' | wc -l  # 0
```

So the item's *"the site currently has no `og:` or `twitter:` tag at all"* holds,
and it now holds as a measurement of the artifact rather than of the source. The
source reading agreed and was taken first — with a trap worth recording: the
looser `grep -rn 'og:'` over `apps/docs/src` reads **4**, and every one of the
four is the substring inside `dialog:` in prose. Plain fixed string first.

**What shipped.**

- `apps/docs/src/components/SocialMeta.astro` — one component, emitting
  `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url` and
  `twitter:card`/`title`/`description`. **Twelve source files own a `<head>`
  here** (`Gallery.astro` plus eleven pages that deliberately do not use it),
  so the alternative was twelve copies, and `PrefBootstrap.astro`'s header
  already records what twelve copies of head logic cost: its two copies
  disagreed on the default density and a first-time visitor measurably got a
  different density on the landing page.
- The eleven self-head pages **hoist** their title and description into
  `socialTitle` / `socialDescription` and pass the same literal to `<title>`,
  `<meta name="description">` and `SocialMeta`. Hoisted, never retyped —
  CLAUDE.md's bulk-edit rule is about a pass that labels rows with other rows'
  names, and moving the literal is how not to do that. The wiring ran as a
  script that refuses rather than guesses: exactly one `<title>` and one meta
  description per file, or nothing is written.
- `check-metadata.mjs` arm 5.

**No `og:image`, and `twitter:card` is `summary` rather than
`summary_large_image`.** The large card promises an image this site does not
yet ship; the value is asserted by the arm so it cannot be set aspirationally.
249.15 keeps the image and the switch.

**THE THREE EQUALITIES ARE WHAT MAKES ARM 5 ABLE TO FAIL**, and this is the
point the slice is really about. A presence check over eight tag names passes
in full on a site where every page claims to be the home page — the identical
failure arm 2 (duplicate descriptions) exists for, on the identical corpus. So
the arm asserts `og:title === <title>`, `og:description ===
<meta name="description">`, and `og:url ===` the URL `dist-pages.mjs` produces
by WALKING `dist/`. The third is a reconciliation between two derivations that
cannot see each other — Astro's route table on one side, a filesystem walk on
the other — which is exactly what arm 3's own header says makes a
reconciliation able to fail at all.

**Two things the parser was corrected on before it was believed**, both found by
asking what would make it wrong rather than by a red run:

1. It first read every `<meta>` in the whole page. This is a docs site whose
   pages render HTML samples; a page that ever showed a `<meta>` in its body
   would silently overwrite the real one in the map, since a `Map.set` keeps
   the last. Scoped to the `<head>`, with an explicit assertion that a
   `</head>` exists at all rather than a `slice(0, -1 + 1)` that quietly
   returns the empty string.
2. It first compared the raw attribute value against the raw `<title>` text.
   Those are escaped by different rules, so a difference in ESCAPING would have
   been reported as a difference in CONTENT. Both sides now go through one
   decoder — which cannot invent an agreement, because two different strings
   stay different through the same function.

**And the decoder's FIRST version was wrong, which the arm caught by going red
on 10 of 127 pages.** It handled the five named entities only. Astro writes `&`
unescaped inside `<title>` and as the NUMERIC `&#38;` inside an attribute, so
every title containing an ampersand — `Print & reports`, `Alerts & toasts`,
`Concurrency & conflicts`, and seven more — reported `og:title` disagreeing with
a `<title>` it matched exactly. Numeric forms are not defensive coding here;
they are the case this repo has. The rewrite decodes every entity form in ONE
pass rather than a chain of `.replace()`s, because a chain that resolves
`&amp;` first would then re-read the `&#38;` it had just produced.

**Measured after (`3e1dac1` + this change, full `docs:build`):**

| | before | after |
|---|---|---|
| built `index.html` | 138 | 138 |
| carrying `property="og:` | **0** | **127** |
| carrying `name="twitter:` | **0** | **127** |
| carrying `og:image` | 0 | **0** (249.15) |
| `check-metadata.mjs` assertions | 133 | **1,022** |

The **11** built files with no card are the 10 redirect stubs and `suite/` — the
same two exclusions `distPages()` and the sitemap already reach separately, and
the gate walks the same 127 pages it did before.

**Red-proved four ways, each injection confirmed present in the BUILT page
before the red was believed** (`apps/docs/dist/components/button/index.html`,
restored after each):

| injection | result |
|---|---|
| `og:url` tag deleted | FAIL `carries the social-card tags` |
| `og:title` → another page's title | FAIL `og:title repeats the page's own <title>` (+ the twitter pair) |
| `og:description` → a different sentence | FAIL `og:description repeats …` (+ the twitter pair) |
| `og:url` → `/components/badge/` | FAIL `og:url is the page's published URL` |

**A fifth attempt came back GREEN, and it was the injection**, exactly as
CLAUDE.md says to assume: the `og:title` replacement was written against a
guessed title (`Buttons · busy-office-ui`) and the page's own is
`Button · busy-office-ui`. It cost nothing because the probe asserted its match
count before replacing and raised on `0` rather than silently matching nothing
— which is the whole difference between that and a green red-proof believed.

**`check-page-shape.mjs` needed a third spelling, and it resolves the constant
rather than accepting one.** Its description arm reads the SOURCE for a literal
`content="…"`, so hoisting broke it on all 11 self-head pages. Accepting
`content={anything}` would have turned that arm into a detector that cannot
fail — a page can always name a constant it never defines. It now finds the
declaration and applies the same 40-character floor to the literal there.
Red-proved both ways on `patterns/schedule/full.astro`: shortening
`socialDescription` to `'Too short.'` fails, and pointing `content=` at an
identifier that is never declared fails.

**TWO TRAPS THE WIRING HIT, both caught by the build rather than by review, and
both are the same shape CLAUDE.md's bulk-edit rule names.**

1. **An `import` placed after a non-import statement in Astro frontmatter
   CORRUPTS the file.** The wiring script appended its import at the end of the
   frontmatter. In 8 of the 11 pages that put it after a `const`, and
   `@astrojs/compiler` emitted
   `const cssHref = base + '/assets/rf-essentials.min` / newline / `astro';` —
   an unterminated string literal, reported by esbuild at a line and column
   inside an unrelated CSS comment. The compiler's own output is what showed
   it; the source read fine. Imports now sit with the other imports.
2. **The re-placement then put the import INSIDE a template literal that ships
   to users** — `index.astro`'s `pilotSnippet`, a copy-paste sample whose lines
   begin `import "@busy-office/ui/css/…"`, so "the last line starting with
   `import`" was sample text, not code. This is the third time this repo has
   recorded an import landing in a template literal. `astro build` failed with
   `SocialMeta is not defined`; the assertion that the snippet no longer
   contains the string is what closed it.

**Verified: `npm run build -w @busy-office/ui`, `npm run docs:build`, and all
15 cloud-toolchain gates in `ENVIRONMENT.md` green** — core tests 152 passed,
`check:claims` 162 live (3 NOT VERIFIED, the container's `pointer: fine`
reading, trap 6b, not a regression), `check:layout` 127 pages, `test:axe`,
`check:po-app`, `suite` 28 screens. Plus the base-path parity build
(`DOCS_BASE=/busy-office-ui`), which this change specifically needs: `og:url`
there reads `https://busy-office.github.io/busy-office-ui/components/button/`,
and the base is what `pages.yml`, `ci.yml` and `publish.yml` all set. Under a
base-less local build `og:url` omits the base — the same property the sitemap
has had since 249.2, and correct in what actually ships.

**NOT VERIFIED, named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. What a screenshot could have shown
here is nothing — the diff adds `<head>` content and touches no CSS, no visible
markup and no layout; `check:layout`, `check:scroll` and `test:axe` swept all
127 pages at both widths and are green. The one thing a human's eyes are still
needed for is the card itself, and that is 249.15, left open.

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

**Dispatcher trace, cloud wake.** Step 0: the container started **DETACHED**
and `origin/main` arrived as a forced update (`+ 17b3ba6...dd798da`),
ENVIRONMENT traps 1 and 2 both biting as usual; `git checkout -B main
origin/main` before any commit existed, `--unshallow` clean in one attempt
(1,823 commits, no `shallow.lock`). Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0` and the three open slices
are 15 (owner hardware), 112 (owner briefs) and 249 (the adoption triage), so
Step 1 committed nothing. Rule 2: `Standardize 1 / 4 ok`. **Rule 3 fired**:
`Objective 3 / 3 slices OVERDUE [247, 249, 252]`.

*Rule 5, read before quoting:* `dispatch_status.py` reports it **`ok`, not
STALE** — `0 wake-date(s) newer`, newest pair `bundle-gz-kb`. It does **not**
fire: the newest comparable pair is one regression (11.7 kB 2026-08-17 →
15.1 kB 2026-09-03) and the rule needs two consecutive.

**Scope, per §6 step 0.** The armed set is taken whole. `.roundtable/INDEX.md`
reports 4 repeated subjects across 171 findings, and of the 25 grills the
heading grep returns, none covers 247, 249 or 252 — the newest is Slice 250
(244, 245, 248). Nothing dropped, nothing re-grilled. Full report:
`.roundtable/grill-objective-247-249-252-2026-09-03.md`.

**Slice 252 reproduces 15 of 15**, including all thirteen moved-slice line
counts measured from the pre-move source by an independently written `^## `
splitter, and `check:slice-refs` at **709 → 722 → 723 / 234**.

1. [x] **253.1 — DONE 2026-09-03. Slice 247.1's base rate is wrong by 4x, and
       the "live subset" it scoped omits a ledger the dispatcher reads every
       wake — where one cite has since drifted.** Both corrected in
       `ROADMAP-archive.md` (236.2's rule: archived text may be amended for a
       correction) with the original figures struck rather than deleted.

       - **Finding A.** 247.1 refuses a blanket `file:line` gate *"in advance,
         on base rate"*, on the figure *"across all tracked markdown the same
         pattern hits **45** sites, and ~39 are inside `ROADMAP-archive.md` and
         dated grill reports"*. Re-run with 247.1's own regex at the revision
         247.1 names, reading each file **out of that revision**:

         ```
         git ls-tree -r --name-only c31799a3 | grep '\.md$' > /tmp/mdlist.txt
         while read f; do git show c31799a3:"$f" \
           | grep -ohE '`?[A-Za-z0-9_.-]+\.(md|mjs|py|css|json|astro|ts):[0-9]+'; \
         done < /tmp/mdlist.txt | wc -l
         ```

         **188** sites across **24** files, **91** in `ROADMAP-archive.md`
         alone. The archive by itself is double the stated whole-tree total, so
         the figure is **internally impossible against 247.1's own table**,
         which correctly reports 17 sites in `ROADMAP.md`. Likely instrument
         error, measured rather than guessed: sites EXCLUDING the archive and
         `*grill*.md` read **44** at that revision — the residue published as
         the total, and the archive+grill population (144) reported as ~39.

         **The refusal stands and is strengthened**, which is why this closes
         as a correction and not as a reopened design question: 188 sites,
         ~85% of them frozen history, is a stronger case against a blanket gate
         than 45 was.

       - **Finding B.** 247.1's *"live subset a wake reads as current guidance
         is `ROADMAP.md` + `.roundtable/RESUME.md`, 6 sites"* omits
         `.roundtable/polish-state.md`, which LOOPS.md rule 6 and §3b step 1
         read to pick a Polish surface and which carried **12** `file:line`
         sites at that same revision — twice the scope named. `STATUS.md` (4)
         and `.roundtable/loop-log.md` (5) also sit outside it. Resolving all
         twelve against the live tree, **one has drifted**: `server.mjs:105`
         for `page()` was correct when written (`72e7021f`, 2026-08-30) and is
         now line **106**, after `5e5ede6d` and `f1be2485` inserted above it.
         Restated there in the durable idiom, with a dated note.

         **This confirms 247.1's mechanism and refutes only its scope.** Its
         split — *a citation survives iff its target is append-only or
         line-stable source* — predicts that failure exactly. Everything else
         in 247.1 reproduces: the 17-citation breakdown is 9/3/3/2 as
         tabulated, and `check:slice-refs` reads **704 / 228** at `c31799a3` in
         a clean worktree, as stated.

       - **No gate is proposed and that is deliberate**, per 94.11: the
         predicate now has a *measured* base rate of 221 sites on the current
         tree, ~85% of them in files that exist to record a moment. A gate over
         it would fail the build on correct history. What changed is a number
         and a scope statement, both of which a later wake reads as current.
       - **Accept:** met. Both corrections state a figure that agrees with
         re-running the command printed beside it, and the drifted cite either
         resolves or no longer carries a line number.

2. [x] **253.2 — DONE 2026-09-03. Slice 249.6 says a cited line holds something
       it has never held.** The item refutes the source proposal with *"that
       line is the install snippet"*. Measured at `5b3ab697` (the revision
       Slice 249 names), at `a9ba847`, and at `HEAD` — `index.astro` has not
       changed since `f1be2485`, well before the triage —
       `apps/docs/src/pages/index.astro:118` is the **first of the two CTA
       buttons** (`Build your first screen`); line 119 is the second and the
       install snippet is line **121**.

       The refutation's conclusion is right and reproduces in full: 2 CTA
       buttons, 4 nav links, and 6 `bo-widget` cards under *"Find it by task"*
       (a descriptive name — there is no `task-tile` class, and grepping for
       one returns 0). What fails is the clause about where the cited line
       points. The proposal's line reference **resolved**; only its count was
       wrong.

       **Why this is more than a slip.** Slice 249's preamble asserts *"every
       citation that a verdict depended on was re-run against the live tree
       before trusting it"* and names exactly two that did not survive. This is
       a third, failing in the opposite direction — a citation that did resolve,
       recorded as not resolving — and it is the **only** `file:line` citation
       left in `ROADMAP.md` today, i.e. the exact live population 247.1 was
       dispatched to audit.
       - **Accept:** met. 249.6 now refutes the count rather than the citation,
         and every figure in it agrees with re-reading the file.

3. [x] **253.3 — DONE 2026-09-03. Two instrument failures this wake, recorded
       because both are this repo's own written rules landing on the wake that
       had read them.**

       - **A green red-proof was a defect in the injection, twice.** Verifying
         249.1's per-file arm independently: the first probe (28 near-identical
         rules, 2,158 source bytes) left the gate **green** at 36 bytes of
         headroom, because repetitive rules gzip to almost nothing and the
         budget is a *gzip* ceiling. The second (3,109 bytes of random tokens)
         never reached `check:size` at all — `build:rf-essentials` runs sixteen
         steps earlier and its 40 kB **minified** ceiling broke first
         (`40.8 kB min > 40 kB`, against a 38.13 kB baseline). Only the third —
         1,000 source bytes, incompressible, inside the ~1.87 kB minified
         headroom rf-essentials allows — landed in the window the per-file arm
         tests, and the build then exited 1 at `check:size` with
         `css/components/data-table.min.css is 2.23 kB gz > per-file budget
         2.2 kB`, injection confirmed at **9** occurrences in each of the three
         built artifacts (deleted before the rebuild so no stale file could
         answer).

         *Worth carrying:* the two size gates are **not independent**, and the
         order is inherent rather than a defect — `check:size` measures
         rf-essentials' output, so `build:rf-essentials` must precede it. An
         injection large enough to breach both always reports the rf one.

       - **A whole-tree gate cannot be re-read by swapping two files, and the
         wrong reading nearly shipped as a finding.** Verifying 252's
         `check:slice-refs` anchors by checking out `ROADMAP.md` +
         `ROADMAP-archive.md` at the older revisions into the live tree read
         **708 / 261 / 233** and **722 / 261 / 234** — one low at *every*
         anchor, which reads as a tidy off-by-one defect in Slice 252 and was
         written up as one. It is wrong: `check-slice-refs.mjs` scans the
         **whole tree** for citations and treats the two roadmap files only as
         the resolution corpus, so the two commits landed since 252 were
         contaminating every count. Re-run in real `git worktree` checkouts the
         readings are **709 / 262 / 233** and **723 / 262 / 234** — precisely
         what Slice 252 published.

         The tell was present before the correction and was not read: **a
         uniform off-by-one across three independently derived numbers is a
         defect in the instrument, not three coincident defects in the
         subject.** That is CLAUDE.md's "identical value across many inputs"
         rule wearing a different hat.
       - **Accept:** met — both are recorded with the command that produced the
         wrong reading and the command that produced the right one, so neither
         is re-derived.

**Not verified, said plainly.** This is a cloud wake: there is no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
Nothing here rests on a rendered image — the diff is four markdown files and no
shipped artifact — and the one behavioural claim exercised (the size gate's
per-file arm) is a byte comparison run live in this container, with the CSS
restored and `dist/` rebuilt clean before any gate reading.

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

6. [ ] **249.6 — "Choose your path" router, corrected from the proposal's
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
       rows lack a qualifying terminal page, not one.** This item said "the
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

9. [ ] **249.9 — Visual component catalogue.** Depends on 249.8 (tagline) and
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

15. [ ] **249.15 — The one static OG image 249.2 named and did not build.**
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

**Dispatcher trace, cloud wake.** Rule 1: no open P0, and GitHub intake
`list_issues` OPEN → `totalCount: 0`, so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: **`Standardize 4 / 4 Continue rounds
OVERDUE` — dispatched.** Rule 3 read `Objective 3 / 3 slices OVERDUE
[232, 234, 236]` and stays armed behind it, which is Step 2's stated order
working, not a rule being skipped.

**All four lanes ran; `n of 4` is 4 of 4, per the playbook's own instruction.**

**Lane 1 of 4 — `scan:dead-style`: clean.** 0 dead declaration(s) on 0 pages,
1,433 live inline declarations, screen + print measured. It needs
`CHROME_PATH` exported in the same command, like every other browser-driven
gate here — without it the scan exits 1 naming six paths it tried, which reads
like a failure and is a missing export.

**Lane 2 of 4 — `report:css-repeats`: clean, and the delta is what was read,
never the count.** 74 source files · **242** rules with 3+ declarations · **230**
distinct bodies · **8** bodies appearing more than once, against LOOPS.md's
table (2026-08-28) of 237 · 225 · 8. The repeat set is unchanged **member for
member** — x4 joined-control radius (money ×2, quantity ×2), x3 list reset
(approval-workflow, sidebar-nav, tree), x3 visually-hidden (sidebar-nav,
stepper, primitives), and the five x2 pairs. The x4 group is still **two
components**, so its stated reopen trigger — a THIRD component — is unmet. Rules
and distinct bodies both moved by +5 with repeats flat, which is only consistent
with added rules carrying novel bodies; that is a derivation from the three
totals, not a separate measurement of what was added.

**Lane 3 of 4 — `report:prose`: clean, checked by SET MEMBERSHIP.** 118
documentation pages of 127 built · median **748** · total **105,705** words.
Nine pages over 2x the corpus median and twelve over a family median; the union
is **fourteen distinct pages**, and every one resolves against **158.1's
twelve**, **161.1's three** and **178.3's** `/concepts/scale/` — sixteen
verdicted pages, nothing flagged outside them. 228.1 already recorded why the
obvious instrument here is a dead one (grepping each page path out of
`ROADMAP.md` + the archive returns hits for all fourteen whatever the truth is),
so membership against the sixteen is what was checked.

*One instrument artefact worth a line, because it is the trap CLAUDE.md names
under its own heading.* Extracting the flagged page paths with a
`/[a-z-]+/[a-z-]+/` regex over the report's output returns **fifteen** paths,
and the fifteenth is `/script/style/` — matched out of the report's own
explanatory sentence, *"with pre/script/style/svg/template removed"*. A page
list that contains a substring of the sentence explaining how pages are
measured. Caught by reading the list, not by a check.

**Lane 4 of 4 — `report_loop_prose.py`: carries the finding, and it is the same
one as last wake.** The `ratchet` block read first, per the playbook:
`ROADMAP.md` **4 up, last cut `574a8634` (2026-09-01)**. `roadmap_scope.py` read
closed-history share **1,410 / 2,907 = 48.5%** — up from 31.6% at the previous
hand-off — with targets `[236, 235, 234, 232]`, and 236.2's new dependency lane
read *"no target slice is named by a still-open item"*. **The archive sweep is
due a ninth time**, and the hand-off had already assigned it here rather than to
the Continue round that spent rule 4.

1. [x] **237.1 — the ninth archive sweep. Four slices moved, and the
       verification reads the SOURCE rather than the mover's own memory.**
       *Accept was*: each target slice present byte-identical in
       `ROADMAP-archive.md` and absent from `ROADMAP.md`, one pointer line left
       behind per slice, `check:slice-refs` green, and its reported count
       reconciled rather than accepted.

       ```
       python3 scripts/loops/roadmap_scope.py        # targets, share, 236.2's lane
       npm run check:slice-refs -w docs
       ```

       **Moved:** 236 (381 lines), 235 (368), 234 (161), 232 (500) — boundaries
       read one slice at a time from the heading line to the next `## `, and a
       block already reduced to a pointer refused outright (235.3's lesson).
       `ROADMAP.md` **2,907 → 1,509 lines**; closed-history share **48.5% →
       0.0%**; live-file slice count unchanged at 218, because a sweep moves
       text, not slices. **Both are AT MOVE TIME** (177.1's convention): writing
       this result block back into the file is itself growth, so the committed
       file reads higher and `roadmap_scope.py` reads a non-zero share again —
       carrying exactly one closed slice, this one.

       **The verification is a second, independently written parser** that
       re-derives each block from `git show HEAD:ROADMAP.md` — the pre-move
       source in git — and asserts it appears exactly once in the working-tree
       archive and zero times in the working-tree live file. Comparing against
       the mover's in-memory copy would have been self-consistent by
       construction, which is CLAUDE.md's *reconcile against the SOURCE, not
       against the argument*. **Red-proved by injection**: one line of the
       expected block replaced, the injection confirmed to have landed (archive
       count for that slice 1 → **0**), verifier FAILED 1 of 4 and exited 1;
       clean run 4 of 4 ok, exit 0.

       **`check:slice-refs` moved 680 → 684, and the +4 is not new citations.**
       Measured against a `git worktree` at `HEAD` rather than reasoned about:
       distinct slice headings in the archive **212 → 216**, in the live file
       unchanged at 218, so the gate's uniqueness arm runs 430 → **434** checks
       while its citation arm holds at **250** (252 cited − 2 known-dangling).
       A swept slice number heads a section in *both* files — the pointer stub
       and the real section — so it earns exactly one more uniqueness check.
       +4 for four slices is the tidy number this repo says to distrust, and it
       reconciles. On the committed tree the gate reads **685 / 219**, one more
       than the sweep produced, because Slice 237 is a new live-file heading and
       earns its own uniqueness check.

2. [x] **237.2 — the archive's own header instructed the opposite of the rule
       `LOOPS.md` gained the day before, and that sentence has a measured
       cost.**
       *Accept was*: the header stops asserting a rule that contradicts
       dispatcher rule 4's standing answer, and points at where the rule lives;
       the header's falsity re-measured here rather than quoted from 236.2;
       every other copy of the claim in the tree found and adjudicated.

       `ROADMAP-archive.md`'s header (110.4, 2026-08-22) read *"Nothing here is
       edited — corrections to history go in new slices, never here."*
       `LOOPS.md` beside rule 4 (236.2, decided 2026-09-01) reads *"Amending the
       archive is allowed and expected for a correction"* and *"'Archived
       verbatim' is a property of the MOVE, not a claim of immutability."* Two
       documents, opposite instructions, one day apart, neither naming the
       other — the shape this playbook already records costing 44 minutes
       between a gate being hardened and demoted.

       **The premise re-run, not quoted** (CLAUDE.md: when the premise is an
       earlier wake's measurement, re-checking it is part of the criterion):

       ```
       git log --format='COMMIT %h %ad %s' --date=short --numstat -- ROADMAP-archive.md
       # 10 commits · 8 pure appends (the sweeps) · 2 with NO move:
       #   d3d76a28 (199.1)  +27 / -0   a RE-VERIFIED block appended INSIDE an archived slice
       #   dc861a25 (235.3)   +0 / -12  three self-referential stubs deleted
       ```

       **The cost, and it is specific.** 177.1 (2026-08-28) found Slices 17, 23
       and 24 each heading two sections in the archive, the second a three-line
       stub pointing at the file it was already in, named all three — and left
       them, **"on the archive's own authority"**, quoting this header verbatim.
       `dc861a25` deleted exactly those three on 2026-09-01. **Five** commits
       landed on the file in between — the command, since this figure was
       published without one and was wrong for four days (238.1):

       ```
       git log --format='%h %ad %s' --date=short 2ae54a4a..dc861a25^ -- ROADMAP-archive.md | wc -l
       #   5 — 574a8634 (235.2), d701e619 (228.1), e29c7c18 (214.1),
       #       83192cd1 (208.1), d3d76a28 (199.1)
       ```

       A correct twelve-line deletion was deferred four days by a sentence that
       was already false when it was read.

       **Corrected 2026-09-01 by 238.1; `+0 / -12` above was `-0 / -12` in the
       same commit.** As first published this paragraph read *"Four commits
       landed on the file in between (`d3d76a28`, `83192cd1`, `d701e619`,
       `574a8634`)"* — `e29c7c18` (214.1, the sixth archive sweep, `+1,575`) was
       dropped, and it is the middle of three consecutive `— Nth archive sweep`
       subjects. The conclusion, the ten-commit premise above and the *"four
       days"* figure are unchanged and were each re-run before this edit.
       **The Slice 238 grill row in `.roundtable/loop-log.md`, and the copy of it
       `STATUS.md` renders, still carry the wrong phrase and are deliberately
       left wrong** (grep the row — neither is cited by line number, because
       238.1 filed both as `:1279` / `:43` and both had already moved by the time
       it closed): `record_iteration.py`'s standing
       rule is that historical rows are never edited, so the figure is immortal
       in the log — which is the whole reason the two durable sites had to carry
       the correction. The grill report
       `.roundtable/grill-objective-232-234-236-237-2026-09-01.md` quotes the
       pre-correction wording as a dated finding and is likewise not edited.

       **Scope checked, and two near-misses left alone.** A fixed-string sweep
       for the claim (`Nothing here is edited`, `corrections to history`,
       `never edited`, `byte-identical to what stood`) finds the header, 177.1's
       own quotation of it, and two hits about **loop-log rows** being never
       edited — `record_iteration.py`'s standing rule, a different rule about a
       different file, correctly untouched.

       **Refused: restating rule 4's paragraph in the header.** 236.2 already
       decided the standing answer lives in `LOOPS.md` beside the rule, and lane
       4 of this very sweep is the instrument that measures this file growing.
       The header carries the correction, the measured cost and a pointer — 5
       lines to 22 — not a second copy of the rule.

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

