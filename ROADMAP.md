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

## Slice 241 — 240.1 closed on its OWN second branch: the chevron's two hex literals are not removable, measured four ways — and the item was never browser-blocked, only its first branch was (2026-09-02)

**Dispatcher trace, cloud wake.** Rule 1: no open P0; GitHub intake
`list_issues` OPEN → `totalCount: 0`, so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: `Standardize 1 / 4`. Rule 3:
`Objective 1 / 3 [238]`. **Rule 4 dispatched Continue, build mode** — the first
wake in five not to fall through to rule 6. Four open items: Slice 15's AT
evidence owner-hardware-blocked (unchanged — it needs a human listening),
`112.3`/`112.4` owner-blocked (re-checked from `git log`, not mtime:
`.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, single commit
`e58ea3ca` 2026-08-23), and **`240.1`, which the hand-off classified
browser-blocked and which is not**. Rules 5-8 were not reached.

**The mis-sort, named, because it is the mirror of the one LOOPS.md rule 4
already records.** 240.1's Accept criterion 1 is a disjunction and the hand-off
read only its first half. Branch 1 — convert the chevron to a mask — needs
screenshots at 1440/390 in both themes, and a cloud wake genuinely cannot take
it. **Branch 2 — "or a one-line reason is recorded in the cite for why the mask
technique is wrong for a chevron specifically", with "finding the mask approach
unworkable is a satisfying outcome" written into the criterion itself — is a
DOM/computed-style/pixel-count question, which is entirely `ENVIRONMENT.md`'s
"can run" list.** 189 §D2 records the loop declining a whole ITEM a cloud wake
could take; this is the same error one level down, declining a BRANCH. Cost:
one wake, against 173.2's four.

**This is exactly what 158/191's criterion rule bought.** 240.1's Accept was
written to name the property and to make finding the premise false a satisfying
outcome. The premise *was* false, and because the criterion said so in advance,
refuting it closed the item instead of going off-plan.

1. [x] **241.1 — DONE 2026-09-02: four routes to a tokenised chevron, all
       measured in headless Chrome, all refuted. `240.1` closes on branch 2.**

       240.1 proposed rendering the chevron as `mask-image` +
       `background-color: currentcolor`, "exactly as `icon.css` does". Measured
       rather than reasoned, each route against a control that must paint, on a
       page whose select borders are forced to a green that appears nowhere else
       so a chevron count can never be a border count:

       | route | reading | control |
       |---|---|---|
       | `stroke='currentColor'` in the URI | **0 red px**, 6 px BLACK, against a pure-red host | the shipped literal, same geometry: 6 px of `107,114,128` |
       | `stroke='var(--bo-color-text-muted)'` | **0 px painted at all** | as above — the same 6 px core paints when the value is legal |
       | mask on `.bo-select` itself | painted pixels **1010 → 22** on a 240×36 control: border, surface and option text erased | the same select unmasked, at 1010 |
       | mask on `.bo-select::before` | **0 px** — `<select>` generates no pseudo-element box | the identical rule on a `<div>`: **1080 px** |

       The first two are one fact: **an SVG in a `data:` URI is a separate
       document**, so it cannot read this one's `currentColor` or its custom
       properties. The last two are the other: **`icon.css`'s technique needs an
       element whose whole box IS the glyph**, and a `<select>` is neither empty
       nor able to lend a pseudo-element. The only remaining route is a wrapper
       element around every select — new markup for a colour literal, refused as
       widening the public API. Recorded in `select.css`'s own comment and in
       the `form · colour` cite, as the six other components carrying raw hex
       already do.

       **The instrument's first output was wrong, as the base rate says.** The
       first run clipped the chevron strip wide enough to include the control's
       border — whose shipped colour is *also* `#6b7280` — so the chevron and
       the border were one indistinguishable count of 44-50 px, and the reading
       that mattered (is any pixel red?) was buried. Forcing the border green
       and insetting the clip by 2px separated them: 6 px, exactly, in every
       case that paints.

       **Reopen condition, named rather than left implicit:** `<select>` gaining
       a styleable pseudo-element at the support floor (`appearance:
       base-select`). Not a promise it will; a statement of what would make the
       refusal wrong.

2. [ ] **241.2 — the framework's only PAINTED raw hex sits outside every
       contrast gate, and it passes today. Filed rather than built.**

       Measured this wake, same instrument, reconciled against the gate's own
       numbers before being quoted: the chevron reads **4.83:1** against the
       light surface and **11.46:1** against the dark one, so both clear WCAG
       1.4.11's 3:1 for a non-text graphical object. The control — the
       documented `text-primary` on `bg-surface` pairing — read **17.74** light
       and **16.15** dark, which is `contrast.json`'s independently computed
       value to the digit in both themes.

       What is missing is the ratchet, not the value: **0 of the 36 gated
       pairings in each theme covers this**, because `check:contrast` takes two
       token names and the chevron's colour is a literal inside a URI.

       *Accept* — names the property, not the value:

       1. Either `check:contrast` (or a sibling gate) asserts the chevron
          literals against the surface token they are painted on, extracting the
          hex from the URI rather than from a parallel token that could diverge
          — **or** a recorded reason why the pairing stays ungated.
       2. If built, it is tagged `@heuristic` and ships `--self-test`: deciding
          which `data:` URI hexes are PAINTED (`background-image`) versus masked
          away (`mask-image`) is recognition, and this repo's own history says
          that class of detector must demonstrate it can fail.
       3. Its base rate is stated before it lands. **The argument against is on
          the record now so a later wake weighs it rather than rediscovering
          it:** the predicate covers 2 literals in 1 file, both passing with
          margin since the initial commit, which is thin ground for a gate under
          94.11's test.

## Slice 240 — Polish round 2 on `component/calendar`: six arms clean, and a SEVENTH finds the sixth recorded defect — the one cite in the framework that claims an absence the shipped CSS does not have (2026-09-02)

**Dispatcher trace, cloud wake.** Rule 1: no open P0; GitHub intake
`list_issues` OPEN → `totalCount: 0`, so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: `Standardize 1 / 4`. Rule 3:
`Objective 1 / 3 [238]`. Rule 4: three open items, **all blocked** — `112.3`
and `112.4` owner-blocked (re-checked: `.roundtable/pilot-112/briefs.md` is
still the 16-line scaffold, single commit `e58ea3ca` 2026-08-23, read from
`git log` not mtime), Slice 15's AT evidence owner-hardware-blocked; **none
browser-blocked or agent-blocked**, so a local wake gains nothing on them.
Rule 5: `ok` — not stale; newest pair `axe-violations 0.0 → 0.0 → 0.0` over
three runs, every other repeated name 13+ days old, and the one absolute budget
(`RF_BUDGET_KB = 40`) passed inside `build`. **Rule 6 dispatched**;
`polish_requeue.py --apply` re-queued **6** surfaces.

**The pick was measured, and it is robust to the instrument.** §3b's tie-break
left three re-queued surfaces at `1/3`; `inline-editing` drops out for 217.1's
stated reason — verified rather than assumed, `dsa-scores.json` has **no entry**
for it, so no arm can disagree with it. That leaves calendar and dashboard, both
`content: 3`, both `scored 2026-08-23`. The two wakes have used **two different
instruments** for this tie-break, and they disagree on dashboard:

```
                     BOUNDARY reading (239's)      STAMP reading (this wake's)
calendar             2 commits  +18/-2             2 commits  +18/-2
dashboard            0 commits                     1 commit   +7/-1  (e034a6eb)
```

Neither is wrong. 239 measured commits after the scored DATE closed
(`git rev-list -1 --before=2026-08-23T23:59:59+08:00 HEAD` → `a9ba5c7e`);
this wake measured movement since the ledger's own `src` digest was **stamped**,
which is what actually re-queued the surface. `e034a6eb` lands 2026-08-23 21:04
— after the stamp, before the boundary — so it is counted by one and not the
other. **Recorded rather than resolved**, because the pick is the same under
both: calendar exceeds dashboard either way. The stamp reading is the one that
answers "what changed since this score was earned", so it is the one used here.

1. [x] **240.1 — CLOSED 2026-09-02 by Slice 241, on this item's OWN Accept
       criterion 1 branch 2: the mask technique is wrong for a chevron, and that
       was measurable without a screenshot. The "BROWSER-BLOCKED" call below was
       right about branch 1 and wrong about the item — see Slice 241 for the
       four routes and their controls.** Original text kept verbatim:

       **The select chevron is the framework's only PAINTED raw hex, and the mask technique to remove it already ships. BROWSER-BLOCKED (screenshots at 1440/390, both themes) — a LOCAL wake can take this.**

       **Found by arm 7 (new, below), red-proved three ways.** `form · colour`'s cite
       read *"zero raw hex; the error state is border + message + aria-invalid, never
       colour alone"*. `packages/core/src/css/components/form/select.css` carries
       **two** — `%236b7280` (light, line 4) and `%23d1d5db` (dark, line 25) — as the
       `stroke` of the chevron's SVG `data:` URI.

       **The cite was wrong when written, not decayed.** Both hexes were present on
       2026-08-23, the day the dimension was scored:
       `git show "$(git rev-list -1 --before=2026-08-24 HEAD):packages/core/src/css/components/form/select.css" | grep -c "%23"` → **2**.
       They date to `4ef554fa`, the initial commit. This is a different class from the
       four decay defects the ledger records, and from 227.1's cite-side defect: the
       claim never held.

       **Reconciled against six independent siblings, which is what makes it a defect
       rather than a wording preference.** Every other component with a raw hex
       discloses it in its own cite and says why it is not a defect — badge,
       `data-table`, `stepper` and `approval-workflow` (*"raw hex appears ONLY inside
       `@media print`, where theme tokens would be wrong on paper"*), `tabs` (*"the
       nine `#000` are MASK alpha inside `linear-gradient()`"*), `icon` (*"the `%23000`
       inside the data URIs is SVG stroke … under a MASK and is never painted"*). All
       seven score `colour: 3`. **`form` was the only one of the seven claiming zero.**

       **And form's two are the only ones that are actually PAINTED.** Verified in the
       CSS, not inferred: `select.css:12` is `background-image: var(--bo-select-chevron)`,
       while `icon.css` is `mask-image: var(--bo-icon-src)` + `background-color:
       currentcolor`. The print-only hexes never reach a screen; icon's are masked away.
       The chevron's stroke colour is the pixel the user sees, in both themes, and
       `check:contrast` cannot reach inside a `data:` URI to gate it.

       **The cite was corrected this wake** (evidence only — no CSS, no rendering
       change), and the corrected claim was kept CHECKABLE by moving it into arm 6's
       count table rather than leaving it as prose: `form · colour :: the (two)
       select-chevron greys`, red-proved by injecting a third hex (`8/9`, *"cite says
       two, tree reads 3"*) with the clean control at `9/9`.

       **What is left OPEN is the CSS**, because the framework already ships the
       technique that removes the hex entirely: render the chevron as `mask-image` +
       `background-color: currentcolor`, exactly as `icon.css` does. That would drop
       both literals AND the `[data-theme="dark"]` duplicate rule, and let the chevron
       take a colour token — one definition instead of two.

       **Not attempted this wake: it is BROWSER-BLOCKED, in the screenshot sense.**
       It changes how every `<select>` in the framework paints, across both themes, the
       `--seamless` variant and the RTL position flip, and the evidence a human needs
       is a rendered image at 1440 and 390 in light and dark. A cloud wake has no
       Podman. Left open for a local wake per the standing instruction; **this is the
       first browser-blocked item in the open set**, so rule 4 has real work to hand a
       local dispatcher rather than three blocked items.

       *Accept* — each criterion names a property to verify, not a value it will have:

       1. Either `packages/core/src/css/components/form/` contains **no** raw hex,
          or a one-line reason is recorded in the cite for why the mask technique is
          wrong for a chevron specifically. **Finding the mask approach unworkable is a
          satisfying outcome**, not an off-plan one — record it and close.
       2. `form · colour`'s cite **agrees with a raw-hex count of the shipped CSS**,
          whatever that count turns out to be, and arm 6's `form · colour` row agrees
          with the tree (its regex updated if the claim's shape changes).
       3. If converted: screenshots at 1440 and 390, light and dark, show the chevron
          rendering in the base select, the `--seamless` variant and under `[dir="rtl"]`
          — the three sites `select.css` distinguishes.
       4. `npm run lint:css`, `check:contrast` coverage and `test:axe` stay green.

2. [x] **240.2 — DONE 2026-09-02: arm 7, the absence-claim class arms 4-6 structurally cannot see.**

       Arms 4, 5 and 6 all check that something a cite NAMES is present in the tree —
       a quoted clause, a unit-bearing literal, a bare count. **An absence claim names
       nothing to look up**, so all three are blind to it by construction, and it
       decays the same way a count does: any commit adding a `font-size` or a hex
       falsifies a cite nobody re-reads.

       Measured, following arm 6's method rather than asserting a size: **111 of 240**
       cites contain an absence word, but most are prose (*"no select needed"*,
       *"never colour alone"*). Hand-classified to claims that are mechanically
       checkable against the component's own CSS: **43, across 27 components** —
       23 `no/zero raw font-size`, 14 `zero raw hex`, 6 `zero raw dimension literals`.
       **42 of 43 were exact**; the 43rd is 240.1.

       Two definitional choices, written down because they are judgements and not
       derivable:

       - **Comments are stripped before every test.** `badge.css:42`'s own cite says
         its bare numbers are *"measurements quoted INSIDE a comment, not
         declarations"*, so counting them would contradict a cite the ledger has
         already verified at the line.
       - **`dimension` means LENGTH units only** (`px rem em ch vw vh`), not `s`/`ms`
         (time) or `%` (a ratio). The six spacing cites are about space tokens.

       **Red-proved three times, each injection confirmed present in the copy and
       absent from the real tree before the run**, and each went red on exactly the
       injected row: a tree-side mutation (a raw `font-size: 13px` into `calendar.css`
       → `41/43`), a cite-side mutation (`zero raw hex` prepended to `badge · colour`,
       which genuinely has `#000` → `42/44`, the claim count RISING by one), and a
       cite-SHAPE mutation (form's *"zero raw hex"* reworded → **43 claims → 42**,
       proving the claim is parsed from the cite rather than hard-coded).

       **A limitation, stated rather than discovered later.** Arm 7 derives its set
       from the cites, so *fixing a false claim by rewording it removes it from the
       checked set* — which is exactly what happened here: arm 7 read `42/43` before
       the fix and `42/42` after, and the improvement is the DELTA and its reason, not
       the ratio. Arm 6 has a fixed `CLAIMS` table and reports `CITE NO LONGER MATCHES`
       instead; arm 7 cannot tell "reworded because fixed" from "reworded to dodge".
       That is why 240.1's corrected claim was moved into arm 6 rather than left for
       arm 7 to re-derive.

       **No gate proposed — the sixth refusal, and the base rate is the reason again.**
       42 of 43 held before the fix and 42 of 42 after: 94.11's own test says a
       predicate already true of nearly everything distinguishes nothing. The check
       also needs a per-phrasing rule (three today) that only a human reading the cite
       can extend, which is 217.2/220.2/227.2/239's standing reason.

## Slice 239 — Polish round 2 on `component/tree-table`: NO-OP on six arms, and the sixth is the class arm 5 structurally cannot see — where 3 of this ledger's 5 recorded defects lived (2026-09-01)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, GitHub intake
`list_issues` OPEN → `totalCount: 0`, so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: `Standardize 1 / 4`. Rule 3:
`Objective 1 / 3 [238]`. Rule 4: three open items, **all blocked** — `112.3`
and `112.4` owner-blocked, Slice 15's AT evidence owner-hardware-blocked; none
browser-blocked or agent-blocked. Rule 5: `ok`, newest pair
`axe-violations 0.0 → 0.0 → 0.0`, and the one absolute budget in the tree
(`RF_BUDGET_KB = 40`) passed inside `build`. **Rule 6 dispatched**;
`polish_requeue.py --apply` re-queued **7** surfaces.

**The pick was measured.** §3b's tie-break left four re-queued surfaces at
`1/3`; `inline-editing` drops out for 217.1's stated reason (no
`dsa-scores.json` entry, so no arm can disagree with it), leaving calendar,
dashboard and tree-table, all `content: 3`. Source movement since each
surface's own `scored` date, with 217.1's `+08:00` boundary
(`git rev-list -1 --before=2026-08-23T23:59:59+08:00 HEAD` → `a9ba5c7e`):

```
calendar    2 commits  +18/-2    last touch 2026-08-24 05:08
dashboard   0 commits    0/0     last touch 2026-08-23 21:04  (predates the boundary — 227.1's reading, unchanged)
tree-table  1 commit   +20/-12   last touch 2026-08-25 22:07  <- picked
```

tree-table wins on recency and on churn, and what moved is real CSS rather than
whitespace: `td` → `:is(td, th)` across the eleven-rule indent ladder, so a
`<th scope="row">` first column keeps its indentation. Its cites also carry the
most cross-file claims of the three, which is 217.2's decay-prone shape.

### 239.1 — six arms, all clean; the round is a NO-OP

1. **Wrong-choice clause** — `check:wrong-choice` passed, `156 assertions / 80
   pages (components: 37 carry / 1 outstanding / 3 exempt)`; the one
   outstanding is the skipped `date`.
2. **Entry rendered by its page** — `check:dsa-scores` passed, `360 assertions
   / 40 scored (40 requested by a page, all scored)`.
3. **Line-number cites: still 1 of 40**, still `badge · spacing → badge.css:42`,
   re-read at the line rather than trusted — line 42 reads `pushed the whole
   PAGE sideways: measured 373px wide against a 390px`.
4. **`content` cites quoting a page clause verbatim — 20 of 20**, unchanged
   from 2026-09-01.
5. **CSS dimension literals quoted in any cite — 81 of 81**, unchanged.
6. **NEW — bare (unitless) counts in any cite, re-verified against the tree
   each one names: 8 of 8.**

**Arm 6 exists because arm 5's literal regex is unit-bearing only
(`\d+(px|rem|em|ms|s|ch|vw|vh|%)`), so a cite claiming *"po-app uses it at 13
sites"* is invisible to it — and that is where three of the five defects this
ledger has recorded lived**: `sidebar-nav · fit` (a usage count falsified by a
new po-app screen), `breadcrumb · fit` (a denominator falsified by the pattern
corpus growing 19 → 39), `icon · fit` (*"12 ERP glyphs"* against 26, and the
same 12 hard-coded as a published divisor). Arms 4 and 5 could not have caught
one of them.

**The claimed number is parsed FROM THE CITE, never hard-coded.** A probe with
the expectation baked in only sees the tree move, and 227.1's defect was on the
cite side. Red-proved three times, each injection confirmed present in the
parsed JSON or the measured tree before the run, each going red on exactly the
injected row and nothing else: a tree-side mutation (a fourth `bo-navbar` line
→ `cite says 3, tree reads 4`), a cite-side mutation (`13 sites` → `12` →
`cite says 12, tree reads 13`), and a cite-SHAPE mutation (`across its 5 CSS
files` → `across its CSS files` → `CITE NO LONGER MATCHES`). Clean tree: 8/8.
The probe source is in `.roundtable/polish-state.md` so the next wake re-runs
it instead of re-deriving it.

### 239.2 — the class is 8 claims, not the 4 this ledger records, and 2 of the 8 are instrument-ambiguous

217.2 measured this class at **6 of 240 cites**, and 220.2 recorded it
"shrinking by construction" to **4 of 240** after the two stale ones were
repaired by removing the quantity. Re-measured this wake — which CLAUDE.md
makes part of the criterion, not a courtesy, since the premise is an earlier
wake's measurement and 217.2 recorded no command beside it:

```
node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components; …"
#   31 of 240 cites carry a bare integer — but most are noise: dates (2026),
#   Polish round numbers, roadmap slice refs (73.2, 45.3, 36.1), badge's line
#   number (arm 3), and icon's %23000 hex fragment.
```

Hand-classified down to **checkable quantitative claims about the tree, 8 of
them across 7 cites**, every one verified exact this wake:

| cite | claim | live |
|---|---|---|
| `navbar · fit` | po-app uses it at **3** sites | 3 |
| `dialog · fit` | po-app uses it at **13** sites | 13 |
| `offcanvas · fit` | used in **1** pattern screen | 1 |
| `tabs · fit` | used in **2** pattern screens | 2 |
| `form · typography` | zero raw font-size across its **5** CSS files | 5 |
| `scan · fit` | rf-essentials' **40** kB RF budget gate | `RF_BUDGET_KB = 40` |
| `date · fit` | **1** prose mention on `/components/amount`, the only occurrence off its own page | 1 |
| `date · fit` | **zero** screens use it | 0 in `examples/` |

**So the recorded base rate understated the live class by 3** — 217.2's six
were all in `fit`, and `form · typography`, `scan · fit` and `date · fit` were
never in it. Not a defect in any published artefact: every one of the eight is
exact today. It is the ledger's own figure that was wrong, and the reason it
went wrong is the reason 220.1 gave for a different figure — a count recorded
without the command that produced it.

**Two of the eight cannot be re-verified without guessing the instrument, and
that cost a round of this wake's own time.** Arm 6's first run reported
`dialog · fit :: cite says 13, tree reads 14`. Neither number is wrong:

```
grep -c  'bo-dialog' examples/po-app/server.mjs   # 13  lines containing
grep -o  'bo-dialog' examples/po-app/server.mjs | wc -l   # 14  occurrences
#   line 470 carries bo-dialog__header AND bo-dialog__title
```

Walking every revision of `server.mjs`, both readings have been stable at
13/14 since `4d9014d2` (2026-08-20), three days *before* the score — so `13` is
exact under the instrument that produced it and has not decayed. `navbar`'s 3
happens to agree under both readings, which is why the ambiguity did not
surface until a second cite of the same shape was checked. **Arm 6 counts
lines, chosen from that revision history rather than because it is the reading
that passes** — a detector fitted to whichever method makes the number match is
the "detector that cannot fail" this repo's doctrine names, so the reason is
recorded and the occurrence count is written down beside it.

**The comparative claim beside the number was checked too, per 192.1.**
`dialog · fit` also says *"the heaviest real usage in this family"* — within
the overlay family in po-app it is 13 against `bo-offcanvas`, `bo-popover`,
`bo-tooltip`, `bo-drawer` all at **0**, so the claim holds as scoped. (It is
not the heaviest usage in po-app overall — `bo-data-table` 53, `bo-btn` 40 —
but the cite says *family*.)

**No gate proposed, and this is the fifth consecutive refusal.** 101.3's stop
rule confines Polish to maintaining the existing ratchet, and 217.2/220.2/227.2
each refused this class on the ground that a gate would need every cite to
carry its own command — which is exactly what arm 6's claim table *is*, and it
is a hand-maintained table of eight, not a rule a detector derives. 8 of 8 is
also a uniformly-true predicate today, 94.11's own test for ceremony. Recorded,
not gated.

### 239.3 — `polish_requeue.py` answered a fresh container with a bare traceback

Noticed rather than searched for, and fixed because the fix is smaller than the
explanation. LOOPS.md rule 6 mandates `polish_requeue.py --apply` **before**
rule 6 is evaluated, so on a cloud wake it is the first loop script to run —
and a cloud container starts with no `packages/core/dist/` at all. It exited
with `FileNotFoundError: …/packages/core/dist/api.json`, which names a path and
not the command that produces it.

Same shape as ENVIRONMENT.md trap 2b, where git's refusal names the lock file
and the obvious way to shorten the output drops exactly that line. It failed
loudly rather than skipping quietly, so the doctrine held; what was missing was
the next step. Now:

```
polish_requeue: packages/core/dist/api.json is missing, so the slug -> css-dir
map cannot be read (it is generated, never guessed).
  Run `npm run build -w @busy-office/ui` first, then re-run this command.
```

Red-proved by removal — `api.json` moved aside, its absence confirmed before
the run, the guard fired with exit 1; restored, and `--check` reports the same
7 surfaces as before. Not a gate and not a rubric change, so 101.3 is untouched.

**Not verified, said plainly.** Cloud wake: no Podman and no `localhost:8081`,
so the 1440/390 light-and-dark screenshot lane could not run. **This slice
changed no CSS and no page markup** — the diff is `ROADMAP.md`,
`.roundtable/polish-state.md` and one Python error message — so nothing in it
rests on a rendered image. Every browser-derived number quoted came from a gate
executing in this container.

## Slice 238 — Objective grill of Slices 232, 234, 236, 237: twenty-four of twenty-five published claims reproduce, and the one that does not is the count written BESIDE a premise that was correctly re-run — five archive commits reported as four, at two durable sites (2026-09-01)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, and GitHub intake
`list_issues` OPEN → `totalCount: 0`, so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: `Standardize 0 / 4 ok`. Rule 3:
**`Objective 4 / 3 slices OVERDUE [232, 234, 236, 237]` — dispatched.** Rule 4
was not reached. Full report:
`.roundtable/grill-objective-232-234-236-237-2026-09-01.md`.

**Arming set narrowed to ROWS, because two of the four slices were already
grilled in full.** Slice 236 is *"Objective grill of Slices 232, 233, 234,
235"*, so 232 and 234 appear here for the second time — the re-arming shape the
playbook's step 0 names. Resolved by listing every Continue/Standardize row
logged after the last `Objective` row (`a5f5007a`, 06:45): **232.3**
(`fd9affed`), **234.1**, **236.1**, **236.2** (all `ede706af`), **237.1**,
**237.2** (both `7e861867`). All six landed *after* grill 236 read those slices,
and 236.1/236.2 are items that grill itself filed. **So 232 and 234 are armed by
genuinely new work, not by being re-grilled**, and 236's verdicts on 233/235 and
232's on 229/230/231 are untouched here.

**What reproduces — twenty-four of twenty-five published claims, each re-run
rather than read, and the twenty-five are enumerated in the report so the total
is auditable rather than asserted.** 237.1's sweep was re-verified by a **third** independently written
parser reading `git show 7e861867^:ROADMAP.md`: the four blocks measure
381 / 368 / 161 / 500 = **1,410**, each appears exactly once in the archive and
zero times in the live file, archive headings **212 → 216**, and
`2,907 − 1,410 + 12` (four 3-line pointers) = the stated **1,509** at move time
against **1,659** committed. `check:slice-refs` reads **685 / 219**, and its
430 → 434 → 435 uniqueness arm plus a flat **250** citation arm reconciles at
all three points. Lanes 2 and 3 reproduce byte for byte (`74 · 242 · 230 · 8`;
118 of 127, median **748**, total **105,705**). 232.3's gate reads `149 scanned,
8 read a file, none parses without asserting` against an independent grep of
**8**, its `--self-test` passes 11 cases, `check:selftests` reads **47 / 16 /
31** and `check:ci-ignores` **130 / 128**. 236.1's published command prints
`any=1 excl=0` × 5 and `any=3 excl=2`; `roadmap_scope.py --self-test` passes
**A–E**. 234.1's aggregate is **1 / 6 / 5 / 0** at its four named commits.

1. [x] **238.1 — 237.2's supporting commit count is FIVE, not four, and the
       wrong number now stands at two durable sites, one of them the archive
       header that item was written to correct.**

       **237.2's headline premise reproduces exactly and is not reopened** —
       ten commits on `ROADMAP-archive.md` at `7e861867^`, eight sweeps and two
       edits with no move (`d3d76a28` `27 / 0`, `dc861a25` `0 / 12`), with
       `dc861a25` deleting exactly the stubs for Slices 24, 17 and 23 and
       nothing else. *"Four days"* is right too. The conclusion — a correct
       twelve-line deletion deferred by a sentence already false when it was
       read — **stands**. What fails is the number quoted to size it.

       ```
       git log --format='%h %ad %s' --date=short 2ae54a4a..dc861a25^ -- ROADMAP-archive.md
       #   574a8634  2026-09-01  235.2 — eighth archive sweep
       #   d701e619  2026-08-30  228.1 — seventh archive sweep
       #   e29c7c18  2026-08-30  214.1 — sixth archive sweep     <-- MISSING from both sites
       #   83192cd1  2026-08-29  208.1 — fifth archive sweep
       #   d3d76a28  2026-08-29  199.1 — a RE-VERIFIED block, no move
       git log --format='%h' 2ae54a4a..dc861a25^ -- ROADMAP-archive.md | wc -l   # 5
       ```

       `e29c7c18` is in the range and does touch the file — both checked, not
       read off a list: `git merge-base --is-ancestor` holds in both directions
       and `git show --numstat e29c7c18 -- ROADMAP-archive.md` reads `1575 0`,
       the third-largest of the five by insertions (4369, 2381, **1575**, 1424,
       27).

       **The two sites** (quoted as first published; **both were corrected in
       place when this item closed**, so neither string is findable in the live
       tree any more — the quotations are the record of what stood):
       - `ROADMAP.md` 237.2 — *"Four commits landed on the file in between
         (`d3d76a28`, `83192cd1`, `d701e619`, `574a8634`)"*.
       - `ROADMAP-archive.md`'s header, which 237.2 itself rewrote — *"they sat
         through four further commits to this file until 235.3 deleted them"*.

       **Why it failed, named rather than guessed.** The five carry near
       identical subjects — *fifth*, *sixth*, *seventh*, *eighth archive sweep*
       — and **the one dropped is the middle of three consecutive `— Nth archive
       sweep` lines**. The enumeration was made by eye down a list of near
       duplicates, and no command was published beside it, while the premise
       three lines above it ships its command in a fenced block and is correct.

       **The same commit counts `e29c7c18` correctly one item earlier.** 237.1
       calls its own sweep *"the ninth"*, which is right only if the eight
       before it are `16ef2bb8`, `063211cc`, `187ab92d`, `2ae54a4a`, `83192cd1`,
       **`e29c7c18`**, `d701e619`, `574a8634`. So one enumeration of this file's
       history in `7e861867` includes the commit and the other drops it. That is
       the strongest available evidence the failure is transcription rather than
       a wrong mental model of the range.
       That is **192.1's shape a fourth time**: the expensive treatment goes to
       the claim that motivated the work, and what ships beside it goes out on
       credibility it has not earned — the same shape 236.1 filed against 234.1
       and 232.1 filed against itself. The recurrence is the reason to file.

       **One further detail, in the same three-line block:** the annotation
       renders `dc861a25` as `-0 / -12` where `git log --numstat` prints the
       two columns as `0` and `12`, so the insertion column is signed wrong.

       **`loop-log.md:1279` and `STATUS.md:43` carry the same wrong phrase and
       must NOT be edited** — `record_iteration.py`'s standing rule is that
       historical rows are never edited, which the archive states twice
       (`:21535`, `:25832`) and 237.2's own scope sweep correctly identified as a
       different rule about a different file. The figure is immortal in the log,
       and that is exactly why the two durable sites must carry the correction.

       **No gate proposed, refused on measurement.** 79 phrases of the form
       `<word-or-number> commits` exist across the two roadmap files
       (`grep -ohE '\b([a-z]+|[0-9,]+) commits\b' … | wc -l`). **One was
       checked and is wrong; the other 78 were not checked** — said that way
       rather than as "one in 79", because the honest denominator is 1. What the
       79 settles is the gate question alone: a detector keyed on the phrase
       shape fires on all 79 and is green on everything, and one that recovers
       each phrase's intended range out of prose is doing 94.11's semantic step
       and would be red on a correct tree. Third consecutive grill to reach the
       same answer about its own proposal.

       *Accept* — properties, not predicted values:
       - (a) Both durable sites agree with what the `git log … | wc -l` command
         above actually prints, **or** record why the four-commit figure is
         preferred anyway. Both close this.
       - (b) The command sits beside the claim at each site, since this item
         exists because a count was published without one.
       - (c) 237.2's conclusion, its ten-commit premise, and the *"four days"*
         figure are left standing. A change that reopens any of them does not
         satisfy this item.
       - (d) The loop-log and `STATUS.md` rows are left unedited, and whichever
         way (a) is answered, the reason they stay wrong is recorded where a
         reader of the correction will meet it.
       - (e) **Finding the distinction not worth drawing is a satisfying
         outcome**, recorded with its reason — the conclusion survives either
         count, so "imprecise and right" is a defensible close. Note it would be
         the fourth instance of that shape (232.1, 236.1, 192.1's general form).

       **Kind of work needed, so rule 4 sorts it correctly: NOT browser-blocked,
       NOT owner-blocked, NOT agent-blocked.** It is a `git log` over one file on
       an unshallowed clone plus a markdown edit at two sites. No screenshot is
       evidence for any part of it.

       **CLOSED 2026-09-01 (cloud wake, rule 4 — the first rule-4 dispatch in
       six hand-offs). Corrected to five at both sites; (e) considered and
       refused, with a reason.**

       Every premise was **re-run on this wake's own unshallowed clone** before
       anything was edited, not read out of the item — `is-shallow-repository`
       → `false`, 1,786 commits:

       - The range prints **5** (`574a8634`, `d701e619`, `e29c7c18`,
         `83192cd1`, `d3d76a28`). `e29c7c18` is in it in **both** directions
         (`git merge-base --is-ancestor 2ae54a4a e29c7c18` and
         `… e29c7c18 dc861a25^`, rc=0 each) and reads `1575 0`, third of
         `4369 · 2381 · 1575 · 1424 · 27` — the item's own ordering, reproduced.
       - **(c) holds, measured, not assumed.** The ten-commit premise reads
         **10** at `7e861867^`, with numstats `0/12` and `27/0` the only two
         non-appends; `dc861a25`'s diff deletes exactly the Slice 24, 17 and 23
         stubs and nothing else (12 lines); and `2026-08-28 → 2026-09-01` is
         **4 days** exactly. None of the three moved.
       - **(a) + (b) — both sites now carry the number AND the command**
         (`ROADMAP.md` 237.2's cost paragraph, and the archive header). The
         header's correction says what it used to read and why, so the file
         records its own amendment rather than silently reading right.
       - **(d) — the two log rows are untouched**, and the
         reason is written into 237.2's cost paragraph itself, which is where a
         reader of the correction arrives. The dated grill report
         `grill-objective-232-234-236-237-2026-09-01.md` also keeps the
         pre-correction quotation, for the same reason.
       - The `-0 / -12` annotation is now `+0 / -12`, matching what
         `git log --numstat` prints for `dc861a25` (`0` and `12`).

       **(e) refused, and it is the interesting half.** *"Imprecise and right"*
       was genuinely available — the conclusion survives either count — and it
       is refused because **the number is not decorative here: it is the size of
       the cost**, the whole point of a paragraph whose subject is how long a
       correct deletion was deferred. It would also have left the wrong figure
       in the one file whose header instructs future wakes about its own
       editability. So this is *not* the fourth instance of 232.1/236.1's shape;
       it is the first case in that series where the disputed number is
       load-bearing for the claim it sits in.

       **Scope: counted before AND after editing, never enumerated by eye** —
       which is the failure mode this whole item is about:

       ```
       git grep -in "four commits landed\|four further commits" -- . | wc -l   # 6
       git grep -in "four commits" -- . | wc -l                                # 21
       git grep -in "four commits landed on the file\|sat through four further commits" \
         -- ROADMAP.md ROADMAP-archive.md | grep -v '\*"' | wc -l              # 0
       ```

       The third is the one that matters: **zero surviving live assertions of
       the wrong figure.** Of the 6, none is a claim — 238.1's two quotations
       (labelled above as pre-correction text), this paragraph's own grep
       command, the dated grill report, and the two immortal log rows
       (the Slice 238 grill row in `loop-log.md`, and the copy of it `STATUS.md`
       renders). **Neither is cited by line number here, and that is a finding
       of its own**: 238.1 filed them as `loop-log.md:1279` / `STATUS.md:43` and
       BOTH numbers were already wrong by the time this item closed — the log
       had grown to `:1281`, and `STATUS.md` regenerates its "last 10
       iterations" on every `record_iteration.py` run, moving the row to `:38`
       within this very wake. A line number into a regenerated mirror rots by
       construction; grep the row instead. The remaining 15 of the 21 are about entirely
       different ranges, including two script headers and the archive's own
       *"silently produced FOUR commits, not five"* at `:22793`; all untouched.

       **That third command exists because the obvious check cannot pass.** A
       plain `'four commits landed' not in ROADMAP.md` is red on a correct
       tree — the item's evidence quotes the string it removed, and the grep
       written to verify the removal *is itself a match*. Both are CLAUDE.md's
       "an assertion tripped on its own explanation", met twice in one
       paragraph; the fix is to assert on the claim's shape, excluding quoted
       forms, not on the substring.

       **No new gate**, per the item's own refusal, which was not re-litigated.

**NOT VERIFIED, said plainly:** cloud wake — no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
**This slice changes no code**: the diff is `ROADMAP.md` and one new
`.roundtable/` report; no shipped artefact, CSS, markup or rendered output
moved, and the docs site renders neither file. Nothing here rests on a rendered
image. Every gate reading quoted came from that gate executing in this
container.

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

