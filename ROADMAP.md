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

## Slice 265 — Objective grill of Slices 263, 264: both slices' own numbers reproduce, and both defects are in what shipped BESIDE them — a gate header that still encodes the declaration its own slice corrected, and an entity decoder consolidated everywhere except the one place a reader could see it missing (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty, `HEAD` on `fbca625` with no local branch) —
ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,861** commits, no `shallow.lock`)
and it brought all seven tags, so trap 2 did not bite. Rule 1: no open P0 —
`list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and no
open `N. [ ]` item is a P0. Step 1 triaged and committed nothing: no new input.
Rule 2 **1 / 4 … ok**. **Rule 3 fired**: `dispatch_status.py` read
`Objective 3 / 3 slices … OVERDUE [249, 263, 264]`, exactly as the previous
hand-off predicted. Rules 4-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **STALE**,
`1 wake-date(s) newer`. `LOOPS.md` rule 5 is explicit that STALE means the rule
has no input, so it is reported here as **could not be evaluated**, not as
clear. No metric was recorded to "fix" it: `bundle-gz-kb` still has nothing
deriving it (259.1's finding, re-verified — `grep -rln 'bundle-gz-kb'` over
`*.mjs *.py *.ts *.js *.json` outside `node_modules` returns exactly one file,
`scripts/loops/record_metric.py`, and the hit is its docstring example).

**Scope, narrowed per §6 step 0.** The armed set names **249**, which is the
re-arming case that step exists for: 249 is an open umbrella whose items have
armed a grill on five consecutive wakes, and it has already been grilled in
full (`grill-objective-247-249-252-2026-09-03.md`) and again per-item
(`grill-objective-249-254-255-2026-09-03.md`). It is dropped here except as the
parent of the item Slice 264 built. **Grilled: 263 and 264**, in full.

**What reproduced.** Every measured number in both slices was re-derived from
the built tree rather than read, and all but one hold exactly: 264's derivation
table (`(classes+dataAttrs) ∩ hooks` **23/40**, `classes ∩ hooks` **20/40**
dropping `dialog` and `scan`, filename-match **9/26**, `form` matching **16**
behaviors and `button` **5**, `scan` declaring **0** classes, `data-state`
declared by **6** and hooked by **6**), its **40** cells over **39** pages, its
**19** non-default JS rows, its **52**-of-127 whole-page reading, its
`@serves none` used **once in 26**, `anchor-nav`'s three selectors, and all
**5** of `gen-llms.mjs`'s paste-in claims agreeing with `byComponent`; 263's
`check-selftests.mjs` walking `check-*.mjs` only, and its **0** entity
references across all **40** maturity blocks. The commands are beside each
item below.

1. [x] **265.1 — DONE 2026-09-04. `check-js-serves.mjs`'s WHY header still
       says the package ships a behavior for 19 components and lists
       `sidebar-nav initAnchorNav` among six wrong pages — which is the
       declaration Slice 264 itself corrected, preserved in the durable
       artefact a later wake reads.**

       *Accept was*, as properties: (a) the header's served-component figure
       agrees with what `behaviors.json` reports, re-counted from the built
       manifest rather than from the slice's prose; (b) whichever of the six
       rows the same slice concluded was a wrong DECLARATION rather than a
       wrong page is not listed as a wrong page; (c) any figure kept as a
       pre-correction reading says so on its face, so no reader has to date it
       from context.

       **Measured.** `packages/core/dist/behaviors.json` `byComponent` holds
       **40** entries, **18** non-empty, and `byComponent['sidebar-nav']` is
       **`[]`** — the package ships no behavior for it, so it can be neither
       one of "the 19" nor one of the six pages the gate went red on.

       ```
       node -e "const b=require('./packages/core/dist/behaviors.json').byComponent;
       console.log(Object.keys(b).length, Object.values(b).filter(v=>v.length).length, JSON.stringify(b['sidebar-nav']))"
       # 40 18 []
       ```

       The arithmetic closes on the corrected reading rather than being
       asserted: **13** components named a serving init before the fix, five
       pages were fixed, and **18 of 18** served components name one now
       (13 + 5 = 18), so the honest pre-correction base rate is **13 of 18**
       with **five** silent pages — not 13 of 19 with six. The sixth was
       `sidebar-nav`, and 264's own table says so one column over: *"correct —
       this one was the wrong declaration, not a wrong page"*.

       **Two numbers in the same header were suspected and cleared**, because a
       stale-looking figure is not evidence: *"21 of 41 component pages mention
       an `init*` name"* reproduces **exactly** — 44 built pages sit under
       `/components/`, three of them `/components/demos/*`, leaving 41 real
       component pages of which 21 mention one, and 0 of the 3 demo pages do.
       *"Anchored to the cell, the reading is 13"* is the same pre-correction
       reading as the base rate and is correct as of that moment; it is now
       **18**, and the header says which is which.

       This is CLAUDE.md's *"the defect lands in what shipped BESIDE the
       number"* (192.1) landing again, one level in: the correction reached the
       declaration, the manifest, five docs pages and the roadmap narrative,
       and stopped at the gate's own explanation of why it exists.

2. [x] **265.2 — DONE 2026-09-04. Text extracted from a pattern page's HTML
       into published JSON was never entity-decoded, and one label reached a
       reader: `/patterns/` rendered a badge whose visible text is
       `Dashboard &amp; widgets`. 263.1 counted DECODERS in that directory and
       found one; it could not see the place that needed one and had none.**

       *Accept was*, as properties: (a) the count of visible entity references
       is taken from the **DOM of the built site**, not from the source or the
       diff, and every hit is classified by whether it sits inside `pre`/`code`
       — where the reference IS the content and is correct; (b) the detector is
       red-proved by injection before any verdict is read off it; (c) the fix's
       effect is measured against the RENDERED artefact, whole-tree, with each
       changed string paired to the page source it came from; (d) the sibling
       generator's self-test, which currently pins the un-decoded output as
       expected, is corrected and fails without the fix.

       **The defect, in the DOM.** Sweeping all **127** built pages for text
       nodes containing an entity reference: **33** hits on **7** pages,
       **32** of them inside `pre`/`code`, and exactly **one** outside —
       `/patterns/`, `<span class="bo-badge bo-badge--type">`, visible text
       `Dashboard &amp; widgets`. **Red-proved**: on `/components/badge/`, which
       reports 0, appending `&amp; INJECTED` to the `h1`'s text took the
       outside-code count 0 → 1 and printed the mutated `h1` back before the
       count was believed.

       **The chain, each link measured rather than inferred.**
       `kanban.astro:243` writes the correct markup `Dashboard &amp; widgets`;
       `pattern-extract.mjs`'s `BADGE_RE` captures `([^<]+)` — nine characters
       of SOURCE — into `patterns-index.json` and `patterns.json`;
       `patterns/index.astro:38` renders `{c.label}` as a text node, so Astro
       escapes the `&` again and the reader gets the source spelling. The same
       omission had put **52** entity references into `patterns.json`'s
       `opener`/`states`/`dataContract` fields; `dist/llms.txt`, the other
       consumer, carried **0**, so the badge was the whole visible blast radius.

       **Why 263.1's criterion could not see it, which is the transferable
       part.** Its Accept read *"exactly one entity decoder exists in the
       directory, counted STRUCTURALLY over comment-stripped source"*. That is
       true and was executed honestly — and it counts the answers, not the
       questions. A file that needed to decode and did not is invisible to a
       census of decoders, in the same way a survey of alarms cannot find the
       room without one. **The property that finds it is downstream: does any
       text this directory PUBLISHES still carry the spelling of its source?**
       That is checkable in the DOM, which is where it was found.

       **The fix.** `stripTags` → `textOf` in `pattern-extract.mjs`: strip
       tags, `decodeEntities`, collapse, trim — reading `decodeEntities` from
       the module 263.1 created, one directory over. **Order is load-bearing
       and is red-proved, not argued**: decode-first turns `&lt;b&gt;` into
       real tags the strip then deletes, and the new self-test case fails with
       `renders none inline` when the two are swapped, and with
       `renders &lt;b&gt;none&lt;/b&gt; inline` when the decode is removed —
       both with the mutated line grepped back out of the file before the run.

       **The rename is the point of the rename.** 263.1 logged
       `packages/core/scripts/derive-readme-facts.mjs`'s byte-identical
       `stripTags` as a deliberate non-consolidation (opposite sides of a
       package boundary) and said to reopen *"if either copy grows a case the
       other does not have"*. This is that case, so the shared name goes:
       two functions that no longer agree must not keep a name that says they
       do. **Core's copy is correct as it stands and was checked, not assumed**
       — `readme-facts.json` carries **0** entity references, so it has nothing
       to decode.

       **Verified against what it renders, whole-tree.** `dist/` was removed
       and rebuilt and compared file-for-file against the pre-change build:
       **9** paths differ — `build-id.json`, whose fields are supposed to move;
       six pagefind index files, because the indexed text changed; and
       `/patterns/index.html`, with **one** changed value on one line,
       `Dashboard &amp;amp; widgets` → `Dashboard &amp; widgets`, paired to its
       own source page. All **138** built `index.html` files except that one
       are byte-identical, and `<h2>monitor &amp; output</h2>` three tags away
       is untouched — a correctly escaped single ampersand is not a finding.

       The JSON was paired the same way rather than diff-read: **27 of 27**
       changed strings in `patterns.json` equal `decodeEntities(old)` exactly,
       compared against an independent re-implementation of the decoder rather
       than against the module under test.

       **The gate that should have caught it now exists**:
       `check-escaped-entities.mjs`, the **53rd**, `@heuristic` (the verdict
       rests on POSITION — inside a code sample or not) with `--self-test`,
       registered in the docs build. Its base rate was measured before it was
       written and the predicate was **false of one real page** an hour
       earlier, so it is not ceremony. Red-proved twice, the stronger proof
       first: `offenders()` over the **kept pre-fix `/patterns/index.html`**
       returns `["&amp;amp;"]` and over the new one `[]`; and an injection into
       the live built tree, confirmed present by `grep -c` → 1 before the red
       was believed and gone → 0 after restoring, produced
       `FAIL /components/badge/ … shows &amp;mdash; to the reader`.

3. [x] **265.3 — DONE 2026-09-04. `data-anchor-nav` is documented on TWO built
       pages, not one. Correction to Slice 264 and to the `@serves none` reason
       that ships in `anchor-nav.ts`.**

       264 states the attribute is *"documented on exactly one page in the tree
       and it is a PATTERN (`/patterns/object-page`)"*, and the reason line in
       the module header says the same. `grep -rl 'data-anchor-nav'
       apps/docs/dist --include=index.html` returns **two**:
       `/patterns/object-page/` and `/concepts/js-behaviors/` — the second
       being the generated hook reference, which lists every declared hook and
       therefore could never have failed to name it.

       **The conclusion the number supports is unaffected**, which is why this
       is a correction and not a reopening: both pages are a pattern page and a
       reference page, so *no component's markup is involved* still holds, and
       `@serves none` remains right. Recorded because a count that does not
       reproduce is worth the same treatment whether or not it changes the
       verdict — and because this one shipped inside the package, in the
       comment that justifies the one escape hatch in 26.

**No CHANGELOG entry, and the compatibility was measured rather than judged.**
Two files under `packages/` changed: `anchor-nav.ts`'s `@serves none` reason
(a comment) and the derived `readme-facts.json` gate stat. The published
manifest is unchanged **export for export** against the previous build —
`initCount` 26 → 26, `exports` identical, `byComponent` identical, and every
one of the 26 behavior entries identical — so nothing a consumer can import,
match or style moved. **0** files under `packages/core/src/css/` changed. The
gate count in both READMEs moved 52 → 53 because a gate was added, which is a
derived documentation stat, not a contract.

## Slice 264 — 249.9's last no-JSON-key badge: which component a behavior serves is now declared, and the first declaration written from the headers' prose was wrong about one of the 26 (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty, `HEAD` on `758349a` with no local branch) —
ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,859** commits) and it brought all
seven tags, so trap 2 did not bite. Rule 1: no open P0, and GitHub intake is
empty (`list_issues` on `Busy-Office/busy-office-ui` → `totalCount: 0`); Step 1
triaged and committed nothing, because there was no new input. Rule 2
**0 / 4**, rule 3 **2 / 3** `[249, 263]` — neither fires. Rule 4: the open set
is `15`, `112.3`, `112.4`, `249.6`, `249.7`, `249.9`, `249.10`-`249.13`,
`249.15` (11 open, `grep -cE '^\s*[0-9]+\. \[ \]'` → 11, agreeing with the
hand-off). Walking it oldest-first: 15 and 112.3/112.4 are owner-blocked;
249.6 was declined at the CLAUSE level by the previous wake and re-reading it
does not change that; 249.7 is a cost question waiting on the owner's 249.10.
**249.9 is the oldest item with a cloud-takeable clause**, and this is that
clause.

### The split, and the premise re-derived rather than inherited

249.9's badge audit found two badges tracing to no JSON key. 249.18 took the
first (component→patterns). This is the second — the CSS-only /
JS-enhanced / JS-required tier — and its consequence 4 reproduces to the
number against `dist/api.json` + `dist/behaviors.json`:

| reading | components matched | what it gets wrong |
|---|---|---|
| `(classes + dataAttrs) ∩ hooks` | **23 / 40** | admits `approval-workflow`, which matches on `data-state` alone — a vocabulary **6** components declare and **6** behaviors hook, with no approval behavior in the package |
| `classes ∩ hooks` | **20 / 40** | drops `dialog` and `scan` |
| module filename == component dir | **9 / 26** | misses `file-dropzone`→`file-upload`, `wizard`→`stepper`, `collapsible-card`→`dashboard`, `anchor-nav`, `load-more`→`pagination`, `validation-summary`→`form`, `context-menu`→`dropdown`, and the six data-table behaviors carrying none of its name |

Two things the audit did not say, measured here. The intersection's false
positives are **structural rather than incidental**: `form` matches 16
behaviors and `button` 5, because behaviors hook the shared primitives
(`bo-input`, `bo-btn`) those components define — that is composition, not a JS
requirement, and no threshold separates it. And `scan` declares **zero**
classes, so no class-anchored rule can ever see it, which is why it is missing
from the narrow reading and present in the wide one.

### What landed

`@serves <dir>[, <dir>…]` in each of the **26** behavior module headers, lifted
by `extract-behaviors.mjs` into `behaviors.json` as a per-behavior `serves` and
a top-level `byComponent` with **one entry per component, empty array included**
(249.3's "absence is rendered, never blank"). **18 of 40** components are
served. `ApiTable` marks its JS cell with `data-js-required=<component>`, and
`check-js-serves.mjs` — the 52nd gate, `@exact` — re-derives the relation from
the BUILT pages and fails when the two disagree.

### The first declaration was wrong about one of the 26, and prose is why

Written from the module headers, `anchor-nav.ts` was declared `@serves
sidebar-nav`, because its header says the aria-current it sets is *"the same
signal `.bo-sidebar-nav` and `.bo-pagination` already style"*. Reading its
**selectors** instead says otherwise: it queries `[data-anchor-nav]`,
`[data-anchor-collapse]` and `a[href^="#"]`, and nothing else. It touches no
component's markup — the class names in its header name what STYLES its output,
not what it requires. `data-anchor-nav` is documented on exactly one page in the
tree and it is a PATTERN (`/patterns/object-page`).

**CORRECTED by 265.3 (2026-09-04): TWO built pages, not one** —
`/patterns/object-page/` and `/concepts/js-behaviors/`, the generated hook
reference. The conclusion is unaffected (neither is a component page, so
`@serves none` stands); the count is not.

So `@serves none — <reason>` exists, the reason is required and required to be
a sentence, and it is used **once in 26**. Red-proved both ways: `none` bare and
`none — n/a` are both refused naming the file. The general lesson is the one
CLAUDE.md already states about instruments and is worth restating for
declarations: **a header's prose says what a thing is FOR; its selectors say
what it operates ON, and only the second is the relation.**

### The directive published a phantom hook, and the manifest diff is what caught it

`@serves data-table` sits in the same comments the hook scan reads, and
component directories are spelled exactly like `data-*` attributes. Landing the
directive added a phantom `data-table` hook to **five** behaviors
(`initDataTables`, `initDataGrid`, `initRowEdit`, `initTableToolbar`,
`initTableSum`) — a change to a **published semver surface**, from a comment.

Blanking comments before the scan was measured and **refused**: those headers'
markup contracts are where much of the hook surface is published from, and
blanking loses hooks on **25 of 33** exports, one of them 12
(`initRowEdit` loses `bo-data-table__row-edit-actions`, `bo-input--seamless`
and ten more). The fix is one line — the `@serves` line is stripped before the
scan — and the check that it worked is an export-for-export comparison against
the previous build's `behaviors.json`: **0 regressions, `exports` and
`initCount` identical**.

### The gate is red on six real pages before it is green

The base rate was measured before the gate was written (94.11): **13 of 19**
served components named a serving init in their JS row, so the predicate was
false of six and the gate went red on its first run against the built tree.

**CORRECTED by 265.1 (2026-09-04): 13 of 18, false of FIVE.** The 19 and the
six are the reading taken under the wrong `anchor-nav` declaration this same
slice went on to fix — with it corrected, `byComponent` holds 18 non-empty
entries, `sidebar-nav` is `[]`, and the sixth row below was the declaration
bug, not a page. The gate's own header carried the pre-correction figures for
a wake; it now carries these.
Every one is a page contradicting the shipped package, and **two contradict
themselves**:

| component | the row said | what the same page says elsewhere |
|---|---|---|
| `offcanvas` | None — CSS-only. | an API note: *"initDialogs() wires it exactly like any other"*, and the page's own `<script>` calls it |
| `dashboard` | None — CSS-only. | a note naming `initCollapsibleCards()` |
| `form` | None — CSS-only. | — (`initValidationSummary`, `initGroupedNumber`) |
| `quantity` | None — CSS-only. | a note: *"kept in sync reactively by initQuantity()"* |
| `stepper` | None — CSS-only. | — (`initWizard`) |
| `sidebar-nav` | None — CSS-only. | **correct** — this one was the wrong declaration, not a wrong page |

Five pages gained an accurate JS row; the sixth was the bug in the declaration.

**Anchored, not whole-page**, and both readings are recorded so a later reader
can see why: whole-page, **52** built pages mention an `init*` name somewhere —
`button` names `initDropdowns` in a menu-button demo, `richtext` names
`initDialogs` because a demo opens one. Read from the cell, **18** do, and every
one is a statement about that component. The anchor is an ATTRIBUTE carrying the
component name rather than the row's *"JS required"* label, so reading it is
membership rather than recognition — and it removes the page-slug guess as well
(`alert` renders at `/components/alerts/`; `skeleton` and `state` share
`/components/state-patterns/`, which is why 39 pages hold 40 cells).

### Red-proofs — six, each with the injection confirmed before the red was believed

Core build: `@serves` removed (`@serves` count 1 → 0, names the file); an
unknown component (`tabsheet` — names the file and the name); empty; a repeated
name; `none` with no reason and with a two-character one. Docs gate, injected
into the BUILT `dist/components/offcanvas/index.html` and each injection printed
back from the file before running the gate: the cell claiming `initTabs` (red on
both arms), the cell reset to *"None — CSS-only."* (red on the coverage arm),
and `data-js-required="offcanvaz"` (red on the membership arm, naming the
unknown name). The gate returns green when the file is restored.

### Verified against what it RENDERS

Every one of the **40** built cells carries the text ITS OWN source page passes
— **40 of 40**, compared value-for-value rather than counted, which is
CLAUDE.md's row-label pairing rather than a diff read. 19 components now render
a non-default JS row (14 before, 5 added). All **17** CI entry points,
re-derived from `ci.yml` this wake rather than read off a snapshot, ran green,
plus the `DOCS_BASE=/busy-office-ui` parity build — whose base branch was
confirmed exercised (91 prefixed `/busy-office-ui/components/` hrefs and a
base-carrying `og:url` on the built drawer page) rather than merely green.
`check:claims` reports `162 verified live · 3 NOT VERIFIED` — ENVIRONMENT 6b's
container property, not a regression.

**NOT VERIFIED, named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. What changed visually is
one table row's TEXT on five component pages, inside a generated table every one
of them already renders; **no CSS changed** (0 files under
`packages/core/src/css/`), and the whole-tree browser sweeps that assert the
properties a screenshot would be read for are green — `check:layout` 127 pages
at 390 and 150% zoom, `check:scroll` 912 containers × 2 widths, `test:axe`
127 pages × 2 widths, `check:pseudo` 14 pages at +44% text expansion.

### Refused, each with its reason

- **A required/enhanced/optional TIER.** 249.9's audit says nothing in the repo
  distinguishes "JS-required", and re-checking found only hand-written page
  prose — the very surface this key exists to check, so sourcing the tier from
  it would be circular. The tier stays 249.9's open question rather than being
  invented here.
- **Blanking comments in the hook scan** (above): it would delete published
  hooks on 25 of 33 exports to fix a one-line problem.
- **Publishing `byComponent` into `llms.txt`.** `behaviors.json` is already an
  export (`./behaviors-manifest`), `llms.txt` already lists all 26 inits with
  their hooks, and each component page now states it in its own JS row. A
  fourth spelling of one relation is what the Standardize doctrine refuses.
- **Gating `gen-llms.mjs`'s hand-written "paste-in" block.** It names 5 of 26
  inits deliberately — a quick-start, not a mapping — and gating it would either
  force all 26 into it or require the tier just refused. It was checked rather
  than waved off: all **5** of its claims agree with `byComponent`
  (`initDialogs`→dialog, `initTabs`→tabs, `initDataTables`→data-table,
  `initDropdowns`→dropdown, `initAlerts`→alert).

## Slice 263 — Standardize sweep: all five lanes clean again, and the finding is again from none of them — three HTML-entity decoders in one directory, disagreeing on 8 of 11 inputs, where the fix one copy credits to a grill is exactly what makes it wrong on the mirror case (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** —
`git branch --show-current` empty, `HEAD` on `7691dec3` with no local branch
current; ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main`
before any work. `--unshallow` clean in one attempt (**1,857** commits, no
`shallow.lock`) and it brought all seven tags with it this time, so the
`git fetch --tags origin` trap 2 names did not bite. Rule 1: no open P0 —
`list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and no
open `N. [ ]` item is a P0. Step 1 triaged and committed nothing: no new input.
**Rule 2 fired**, exactly as the previous hand-off predicted:
`dispatch_status.py` read `Standardize 4 / 4 Continue rounds … OVERDUE`. Rules
3-8 not reached (`Objective 1 / 3 [249]`).

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **STALE**,
`1 wake-date(s) newer` — the newest comparable pair predates a day of loop
activity. `LOOPS.md` rule 5 is explicit that STALE means the rule has no input,
so it is reported here as **could not be evaluated**, not as clear. No metric
was recorded to "fix" that: this sweep changes **0** files under
`packages/core/src/css/`, so a fresh `bundle-gz-kb` sample could only reproduce
the existing value — and the reason that name cannot be sampled at all is
unchanged for a fourth wake (`RESUME.md`'s 259.1 finding: the only file naming
it is `record_metric.py`'s docstring example).

1. [x] **263.1 — DONE 2026-09-04. Three HTML-entity decoders existed in
       `apps/docs/scripts`, under three different names, and they disagreed on
       8 of 11 inputs. Consolidated into
       `apps/docs/scripts/html-entities.mjs`; all three consumers now read one
       function.**

       *Accept was*, written as properties rather than predictions:
       (a) exactly one entity decoder exists in the directory, counted
       STRUCTURALLY over comment-stripped source rather than by name — the
       three copies were `unescapeHtml`, `decode` and an unnamed inline chain,
       so no name search can answer this;
       (b) all three consumers are shown to READ the shared module by an
       injection that changes each one's own output, never by reading import
       lines;
       (c) the consolidation's effect on each consumer is MEASURED — neutral
       where it is neutral, with the reason, and explained where it is not;
       (d) the disagreement that motivates the change is measured, with the
       reproduction command written beside the claim.
       All four are executed below.

       **The finding.** One directory held three answers to "turn escaped HTML
       text back into the text it stands for":

       | copy | shape | ampersand order |
       |---|---|---|
       | `highlight-code.mjs` `unescapeHtml()` | 7 chained `replaceAll` | named, then numeric — **last** |
       | `check-maturity.mjs` (inline, unnamed) | 4 chained `replace` | numeric **first**, then named |
       | `check-metadata.mjs` `decode()` | one pass, named + decimal + hex | n/a — single pass |

       **They disagree on 8 of 11 inputs**, measured by copying each body
       verbatim out of `7691dec3` and running all three over one list. The
       command is in `html-entities.mjs`'s header beside the claim; the two
       rows that matter are mirror images of each other:

       ```
       input        the text it means   ampersand-last   numeric-first   one pass
       &#38;amp;    &amp;               &amp;   ✓        &        ✗      &amp;   ✓
       &amp;#38;    &#38;               &        ✗        &#38;    ✓      &#38;   ✓
       ```

       **The fix one copy credits to a grill is what makes it wrong on the
       other row.** `highlight-code.mjs` carried
       `// both ampersand forms last — they guard double-escapes (grill H1:
       &#38; before &amp; double-decoded '&#38;amp;')`. That is true, and it is
       the whole reason a chain cannot be made correct: whichever order it
       picks, it re-reads the ampersand it just emitted, so fixing one
       direction breaks the mirror. Only the single pass has neither bug,
       because a character it emits is never scanned again — which
       `check-metadata.mjs`'s own header had already argued, one directory over
       and one day earlier, without either file knowing about the other.

       **Red-proved on all three consumers, with the injection confirmed
       before any verdict was believed** (`grep -cF INJECTED` on the shared
       module, `cp` backup rather than `git checkout`, per 249.8's recorded
       trap):

       - **`highlight-code.mjs`** — with the decoder returning only the marker,
         a rebuild produced **256 highlighted blocks across 96 pages** whose
         entire body is `INJECTED`; restored, the same 256 blocks carry their
         code. This is the consumer whose output a reader copies.
       - **`check-metadata.mjs`** — `metadata check FAILED — 254 of 1022 page
         metadata assertions do not hold`, which is both of arm 5's
         equality-bearing checks on all 127 pages; restored, green.
       - **`check-maturity.mjs`** — `160 of 280 maturity label assertions do
         not hold`; restored, green.

       **The first injection on that third consumer came back GREEN, and it was
       the injection that was wrong** — CLAUDE.md's standing rule landing
       immediately. Prefixing every decoded string with `INJECTED` left
       `check:maturity` fully green, because its arms ask whether a block
       CONTAINS an expected string and a prefix does not disturb containment. A
       constant-return injection is what discriminates. Recorded because the
       green result would otherwise have read as "this consumer does not use
       the module", which is the opposite of the truth.

       **What the consolidation changed for each consumer, measured before the
       switch rather than asserted after it:**

       - **`check-maturity.mjs` — output-neutral by BASE RATE, and the base
         rate is the interesting part.** Its input is the text of every
         `<h2>Maturity …</section>` block in `dist/`; a walk of the built site
         found **0 entity references of any form across all 40 blocks**. Its
         copy has never decoded anything, so the duplication's cost here was
         never a wrong answer — it was a third opinion nobody had compared.
       - **`check-metadata.mjs`** — unchanged by construction: the shared
         module IS its implementation, moved.
       - **`highlight-code.mjs`** — gains hex (`&#x3C;`), `&nbsp;`, `&apos;`
         and arbitrary numeric forms, and loses the `&amp;#38;` bug. Proved
         output-neutral on the current corpus against the RENDERED artefact,
         not the diff: `dist/` was removed and rebuilt, and `diff -rq` over the
         WHOLE tree against the pre-change build names exactly one differing
         file — `build-id.json`, whose `dirty` and `builtAt` fields are
         supposed to move. All **138** built `index.html` files are byte-
         identical, and so is every asset beside them.

       **One copy was deliberately NOT folded in**, with the reason:
       `check-po-app.mjs`'s `removeHref.replace(/&amp;/g, '&')`. That is one
       entity on one URL taken from one attribute, inside a smoke test that
       boots the app as a child process — importing a shared module there adds
       a dependency for a single `&` rather than removing a duplication.

       **No `--self-test` on the new module, and that is a refusal rather than
       an omission.** `check-selftests.mjs` walks `check-*` files only, so a
       self-test here is a test nothing runs — the same "report that rots
       because no lane runs it" the Standardize playbook names as the reason
       lanes 1-3 exist. The durable form is the reproduction command written
       beside the claim in the module header.

       **Lane readings — `n of 5`.** No ordinal in this slice's heading,
       deliberately: 235 called lanes 1-3 clean a TENTH time, 237 an ELEVENTH,
       244 recorded "all four standing lanes clean" with no ordinal, and 252 a
       TWELFTH — so the series already skips a sweep and the next number is not
       derivable without re-reading every sweep. A count nobody can re-derive
       from the file is the kind this repo's own doctrine says not to publish.

       ```
       npm run scan:dead-style -w docs                 # lane 1 of 4
       npm run report:css-repeats -w @busy-office/ui   # lane 2 of 4
       npm run report:prose -w docs                    # lane 3 of 4
       python3 scripts/loops/report_loop_prose.py      # lane 4 of 4
       grep -rhoE '^(async )?function\*? [a-zA-Z0-9_]+' \
         packages/core/scripts apps/docs/scripts scripts/loops \
         --include=*.mjs --include=*.py | sed 's/^async //' \
         | sort | uniq -c | sort -rn                    # lane 5 (252.3's scan)
       ```

       - **Lane 1 — `scan:dead-style`: 0 dead on 0 pages, 1,433 live inline
         declarations**, screen + print, 0 dead on screen but live in print.
         Identical to 257.1, 255.1, 252.1, 244.1 and 237.1. `CHROME_PATH`
         exported in the same command (ENVIRONMENT 1c).
       - **Lane 2 — `report:css-repeats`: zero delta, compared member for
         member rather than by count.** 74 source files · **242** rules with 3+
         declarations · **230** distinct bodies · **8** repeated — the same
         three totals as 257.1, 255.1 and 252.1, and the same eight groups. The
         x4 joined-control radius group is still **two** components (money ×2,
         quantity ×2), so its reopen trigger — a THIRD component — is unmet.
       - **Lane 3 — `report:prose`: zero unverdicted pages, by SET
         DIFFERENCE.** 118 documentation pages of 127 built · median **781** ·
         mean 937 · total **110,597** words. Ten over 2x the corpus median and
         five more over a family median; the union is **15** distinct pages and
         `comm -23 flagged verdicted` is **empty** against the **16**-page
         verdicted set. `/patterns/output-form/` is verdicted and no longer
         flagged, the same single asymmetry 257.1 recorded.

         *The corpus total moved 110,537 → 110,597 (+60 words) since 257.1.*
         Attribution was NOT measured to a page and nothing here rests on it;
         no page crossed a threshold it had not already crossed. The flagged
         set is identical to 257.1's, member for member.

         The `/script/style/` false sixteenth 257.1 tripped over did not recur:
         the extraction anchors on the six real page families rather than on
         `/[a-z-]+/[a-z-]+/`, so the report's own explanatory header cannot
         supply a match.
       - **Lane 4 — `report_loop_prose.py`: no file changed accumulate class,
         `ratchet` block read first, never the delta.** `CLAUDE.md` **32 up,
         never cut** (32 at 257.1, 31 at 255.1) and `DESIGN.md` **22 up, never
         cut** are 167.1's standing verdicts, and `CLAUDE.md`'s watch was
         executed and **retired** by 193.1, so neither is re-raised. Every file
         the loop reads every wake has a cut behind it except those two:
         `LOOPS.md` `6 up, last cut 9198e43f`; `RESUME.md` `0 up, last cut
         7691dec3`; `ENVIRONMENT.md` `4 up, last cut 1005d1db` (3 at 257.1);
         `ROADMAP.md` `20 up, last cut 25e24745`.

         **The regrowth signal is NOT actionable this wake.**
         `roadmap_scope.py` reads closed-history share **1,909 / 4,665 =
         40.9%**, under the **55.1%** at which 252.1 dispatched the tenth
         archive sweep. Of the twelve eligible targets, four are named by the
         still-open Slice 249 and stay per 236.2. No sweep.
       - **Lane 5 — the divergence scan step 1 names: the only two-count pairs
         are `function exists` and `function build`**, both standing false
         positives adjudicated by arity in 252.3 and 255.1 and re-checked here
         rather than taken on trust: `exists(p)` is a filesystem path in
         `new-component.mjs` and `exists(urlPath)` a URL in `check-links.mjs`;
         `build()` takes no arguments in `derive-introduced.mjs` and
         `build(entrySource, from, to)` three in `build-component-css.mjs`. The
         scan's whole-set count moved **69 → 70** definitions since 257.1.

       **And lane 5 could not have found this wake's drift either**, for the
       second sweep running: the three copies had two different names and one
       no name at all. 257.1 recorded that no name-collision scan at any width
       finds two differently-named spellings of one rule, and refused to widen
       the pattern on a measured base rate; this is the same conclusion reached
       from a second, independent instance. What found it was step 1's own
       instruction — *"duplicated token values or logic (e.g. the same lookup
       table hand-copied into multiple scripts)"* — applied by reading the
       newest large change — everything since the previous sweep, **24
       non-roadmap files** across Slices 258-262
       (`git diff --stat 49d2c901..7691dec3 -- ':!ROADMAP*.md' ':!.roundtable'
       ':!STATUS.md'`) — rather than by running anything. **Two sweeps in a row is a pattern worth naming and
       not yet a detector**: the checkable shape is still semantic, and the
       thing both instances share is a REVIEW HABIT — read what the newest
       slices added, ask what job each new helper does, and ask whether
       something already in the tree does that job.

       **The improvement question, answered rather than skipped** (`LOOPS.md`'s
       first operating rule). The same read turned up a SECOND duplicate beside
       this one, and it is **logged, not fixed**, because the explaining is
       smaller than the change: `stripTags` is defined twice, byte-identically
       apart from the `export` keyword —
       `apps/docs/scripts/pattern-extract.mjs:40` and
       `packages/core/scripts/derive-readme-facts.mjs:98`. Unlike the decoders
       these sit on **opposite sides of a package boundary**: core is the
       published package and must not import from the docs app, and the reverse
       direction would make a docs gate depend on a script that ships in
       nobody's tarball. It is also one line with no branch to diverge in —
       there is no ordering to get wrong, which is exactly what made the
       decoders worth a module. Reopen if either copy grows a case the other
       does not have; that is the divergence, not the count.

       **Not verified, said plainly.** This is a cloud wake: no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. Nothing here rests on a rendered image — the diff is three
       build scripts plus one new module and markdown; **0** files under
       `packages/core/src/css/` and no docs page source. For this particular
       change the whole-tree `dist/` diff above is stronger evidence than a
       screenshot: a screenshot samples one viewport of one page, and the diff
       covers every page and every asset.

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

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** (`git branch
--show-current` empty) with local `main` stale at `26447ba` while `HEAD` sat on
the pushed `7bd795d` — trap 1 in its milder shape, fixed with
`git checkout -B main origin/main` before any work. `git fetch origin main`
moved `26447ba..7bd795d`, which is the previous wake's own hand-off commit, not
a second dispatcher; working tree clean, `RESUME.md` "In flight: nothing".
Step 1: no new input — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, so nothing was triaged and nothing committed there. Step 0b:
rule 2 `2 / 4`, rule 3 `1 / 3` (both `ok`), rule 5 **STALE** by 1 wake-date and
therefore reported as *could not be evaluated*, per `LOOPS.md` rule 5. Rule 1
clear — no open `N. [ ]` item is a P0. So **rule 4, Continue, build mode**.

**Rule 4 found a takeable item where three consecutive hand-offs had said there
was none**, by doing what `RESUME.md`'s correction block says to do: ask what
each CLAUSE of an Accept needs, not what the item is labelled. 249.9's Accept
opens *"every badge on a card either traces to a JSON key or the card renders
the absence"* — and its own audit names **two badges tracing to no key**. A
badge tracing to a key is derivation; the card is the rendered image. Split as
**249.18** and landed.

### The finding: the audit was right about its number and wrong about its cost

The `pattern links` row reads **29/40, and no JSON key exists**, sourced to
*"only the BUILT pattern pages' 'Components used' lists"*. Re-checking the
premise before building (CLAUDE.md's premise rule) split that into three claims
with different answers:

| claim | verdict |
|---|---|
| 29 of 40 components are named by ≥1 pattern | **reproduces exactly**, incl. all 11 names |
| no JSON key carries the relation | **false** — `patterns-index.json` per tile, and `llms.txt` `uses:` |
| it needs a generator that does not exist | **false** — the inversion is ~12 lines over data already emitted |

The first is what makes the other two worth believing: the reproduction came
from inverting `patterns-index.json` (source-generated, pre-`astro build`),
which is not the route the audit used, and it landed on the same 29 and the
same eleven names character for character. Reconciling against something
independent before quoting is the rule; here it also happens to be the refuting
evidence, because the file that reproduced the number is the file the audit
said had no such key.

### And the number that reproduced was still one short

The eleven zero-reach names contain a false zero. `/components/nav` is a
**registered redirect** to `/components/sidebar-nav`, and `app-frame` and
`suite-home` cite the component by that old href — 5 links across 2 pages. A
literal href match reads that as an absence:

```
raw href match      -> 29/40 reached, 11 zero
hash+redirect aware -> 30/40 reached, 10 zero      (removed: sidebar-nav)
```

`/components/nav` was checked as a possible broken link first — it is not; the
redirect is in `astro.config.mjs` and `check-links.mjs` is right to pass. The
defect is in reading hrefs literally, and it would have shipped INTO the
catalogue: 249.9's consequence 3 asks that a card "render *no pattern uses
this* without it reading as a fault", and the literal reading would have
rendered exactly that, falsely, for a component two patterns use.

### What landed

- **`src/data/redirects.mjs`** — the redirect map gets one home. It was a
  `const` local to `astro.config.mjs`, reachable by a second reader only via a
  regex over the config, which is the "two accounts of one list" shape
  `pattern-extract.mjs` and `paths.mjs` exist to prevent. The map is stored
  base-less with a `withBase()` applying the production prefix; the extraction
  was proved equivalent to the old literal at **both** bases (`''` and
  `/busy-office-ui`) by `JSON.stringify` equality before anything else ran,
  which is the check that matters — site-grill S-1 is base-blind redirect
  destinations 404ing in production.
- **`byComponent` in `patterns-index.json`**, emitted by the generator that
  already owns the forward relation. Keyed by docs page slug, not component
  name, because a pattern links a *page*: `skeleton` and `state` share
  `/components/state-patterns`, so a name-keyed map would have to invent which
  of the two a link meant. **41 component pages, 31 named by ≥1 pattern, 10 by
  none, from 165 links.**

  The key set is `component-nav.mjs`'s `ALL_ITEMS`, and reaching for `api.json`
  instead was the first draft's mistake — caught by the new gate arm on its
  first run, not by review. `inline-editing` and `table-toolbar` are component
  docs pages with **no CSS dir**, so `api.json` cannot list them, and patterns
  do cite both (`detail-form`, `bulk-actions`). They came out cited-but-unkeyed.
  `ALL_ITEMS` is where the generated set and the four editorial exceptions are
  already reconciled, so it is the right chokepoint; the two ANCHOR extras
  collapse onto their own pages under `resolveHref` and add no keys. Hence 41
  = 39 component pages + 2 page-only, against the audit's 40-component framing.
- **A third arm on `check-patterns-index.mjs`** that re-derives the mapping
  from the **BUILT** pattern pages' rendered hrefs and fails on disagreement.

### Red-proved three ways, each injection confirmed in the artefact first

| injection | confirmed by | result |
|---|---|---|
| `byComponent["sidebar-nav"]` shortened to one pattern in the generated JSON | re-read the file, asserted the value changed | RED, names the entry |
| an extra `bo-badge--type` link spliced into **`dist/patterns/approval/index.html`** | re-ran the arm's OWN regex on the built file, 2 links → 3 | RED, names `icon` |
| `resolveHref` removed from the generator ONLY (gate still resolves) | grepped the changed expression back out of the script | RED, names 2 entries |

The second is the one that proves the arm reads the built artefact rather than
the JSON beside it: nothing in source or in `patterns-index.json` changed.

The third injection was deliberately one-sided. Neutering `resolveHref` in
`redirects.mjs` would have neutered it for the generator AND the gate, which
agree by construction and would have gone **green** — the self-consistency trap
one level down from the one the arm is designed around.

**It also measured something the plan had not.** Resolution was justified by
the `sidebar-nav` redirect alone; the unresolved run went red on **two**
entries, because `master-detail` and `schedule` cite `/components/dashboard#card`
and the ANCHOR strip is separately load-bearing (`dashboard` 8 patterns → 10).
Unresolved reads 30 reached / 11 zero; resolved reads 31 / 10. The zero-name
list is the half that moves by one; the pattern LISTS move by more.

**A fourth injection was refused before it ran**, and the refusal is the
worked example: the obvious way to red-prove arm 3 is to pick a component the
built page does not mention and inject a badge for it. Every one of the ten
zero-reach names is already present in every built page's markup — the docs
sidebar lists all 43 components on all 127 pages. A presence check over the
bare href would have picked an injection target that was never absent. The
badge-class anchor is what makes the arm read 165 links instead of thousands,
which is 249.6's anchor finding arriving in a different gate.

### Why the arm reads the built pages and not the file it is checking

Checking `byComponent` against the `groups` in the same JSON would have been
self-consistent by construction — one script writes both — which is
CLAUDE.md's *reconcile against the SOURCE, not against the argument* trap, the
one whose tell is that nothing in the check re-reads an independent artefact.
The built page's hrefs are resolved markup; `pattern-extract.mjs`'s regex reads
`href={base + '…'}` template syntax in `.astro` source. Neither can see the
other, so a stale committed JSON, a source badge the regex missed, and a
hand-edit of the generated file are all visible from this side.

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

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** (`git branch
--show-current` empty) with local `main` at `9ba1ef4` = `origin/main`, so trap 1
in its milder shape; `git checkout -B main origin/main` before any commit.
`--unshallow` clean in one attempt (**1,849** commits, no `shallow.lock`), and
it brought all seven tags. Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`; Step 1 triaged and
committed nothing, no new input. Rule 2 clear (`Standardize 0 / 4`), rule 3
clear (`Objective 0 / 3`, discharged by Slice 258). **Rule 4 fired**, on
`OPEN: [15, 112, 249]`, 11 open items: Slice 15's `AT runtime evidence` and
`112.3`/`112.4` are owner-blocked; `249.6` and `249.15` are browser-blocked in
the screenshot sense; `249.7` is a cost question the owner's `249.10` would
re-scope; `249.10`/`.11`/`.13` are owner calls and `249.12` owner-or-
architecture. **`249.9`** is the item two hand-offs running have named as the
best remaining cloud-takeable work, because its Accept's second clause — *"the
miniature-rendering build-time cost is measured and stated"* — is measurable
anywhere. Taken, measured, and the item left OPEN: its deliverable is a
catalogue page of rendered miniatures a human compares.

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **STALE**,
`1 wake-date(s) newer` (newest pair `bundle-gz-kb` 2026-09-03 09:54, **128**
samples). Per `LOOPS.md` rule 5's own text, **this rule could not be evaluated
this wake** and is not reported clear. No sample recorded, and this wake can
now say more than "the value would not have moved":

**`bundle-gz-kb` has no generator, and that is why every wake declines it.**
Measured rather than asserted:
`grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' --include='*.js' --include='*.json' . | grep -v node_modules`
returns exactly **one** file — `scripts/loops/record_metric.py`, and the hit is
its **docstring example**, `--value 7.0`, a placeholder. **Nothing derives the
number and no document records how it is computed** — its provenance is not
asserted here, only its absence, which is the checkable half. This wake's core
build prints `css/*.css 6 file(s) 14.05 / 15.5 kB gz` and `375.8 kB gz total`,
and the last recorded value is `15.1 kB`: not equal to any of the three, so a wake
wanting to sample must guess which figure (or which subset) the name means.
CLAUDE.md's *"derive names from the generated source, never from a convention"*
is what forbids guessing. The standing decline reason (*"0 files under
`packages/core/src/css/`, so the reading could only reproduce the value"*) is
true and is **not** the binding constraint: even a wake that DID change the CSS
could not reproduce this metric. That is the dead-instrument finding
`RESUME.md`'s standing watch was waiting for, and it is recorded rather than
fixed — writing the derivation command is a change to a loop script, which is
not what rule 4 dispatched.

1. [x] **259.1 — DONE 2026-09-04. Both of 249.9's Accept clauses measured in
       advance of the page, and both re-scope it.** The full text, tables and
       commands are banked in **249.9 itself**, where the wake that builds the
       page will read them, rather than duplicated here. In summary:

       - **The mechanism premise is false.** `browser-harness.mjs` has 13
         consumers and **0** run at build time; `PatternPreview.astro` launches
         no browser at all — it is 10 hand-authored fragments of 39 patterns,
         scaled by a CSS custom property. The item's "already exists" names a
         different mechanism than the one that ships, and the two have opposite
         cost shapes.
       - **Both routes costed, so the second clause is satisfied either way.**
         The browser route: **~8.0 s warm / 11.6 s cold** for 39 component
         pages, **+1,284,734 bytes** in `dist/` (**8.8%** on 14,549,590). The
         shipped route: zero build time, and an authoring cost paid 10 times in
         39 since 2026-08-23.
       - **Of seven badges, four resolve cleanly, two trace to no JSON key,
         and one traces to a key that is empty for all 40.** No key:
         `pattern links` (the mapping exists only in the built pages'
         "Components used" lists, and `astro build` runs before every
         dist-walker, so a generator must emit it from source first), and the
         `JS-required` third of the maturity label — the stated
         `classes ∩ hooks` derivation is **binary for a ternary** label and
         mis-classifies in both directions (23/40 naive, with
         `approval-workflow` a confirmed false positive on `data-state` alone
         and no `approval*.ts` in the tree; 20/40 own-block-anchored, dropping
         `dialog` and `scan`, both genuinely JS-driven). Empty key: `AT line`,
         where `at-evidence.json`'s `components` is `{}` and its own
         `blockedBy` names Slice 15.

       *Why this does not close 249.9:* the item's deliverable is the
       `/components/` catalogue page, whose point is rendered miniatures. That
       is `ENVIRONMENT.md`'s first list — evidence a human compares — so it
       stays open for a local wake.

       **NOT VERIFIED, named rather than implied:** cloud wake, so the
       1440/390 light-and-dark screenshot lane could not run. The diff is
       `ROADMAP.md` and `.roundtable/` only — **0** files under
       `packages/core/src/css/`, no page markup, no script — so there is
       nothing a screenshot could show. Built page count unchanged at **138**.
       All **17** CI entry points, re-derived from `ci.yml` rather than read
       off `ENVIRONMENT.md`'s snapshot, ran green in this container after the
       `ROADMAP.md` edit.

## Slice 258 — Objective grill of Slices 256, 257: 58 of 62 assertions reproduce, and two of the four that do not are the same defect the grilled slice records one item earlier — a real count of a set the sentence does not name (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** (`git branch
--show-current` empty) with local `main` at `2554b39` = `origin/main`, so trap 1
in its milder shape; `git checkout -B main origin/main` before any commit.
`--unshallow` clean in one attempt (**1,847** commits, no `shallow.lock`), and
it brought the tags this time, unprompted. Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`; Step 1 triaged and
committed nothing. Rule 2 clear (`Standardize 0 / 4`). **Rule 3 fired**:
`Objective 3 / 3 slices OVERDUE [249, 256, 257]`, exactly as the previous
hand-off predicted. Rules 4-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **STALE**,
`1 wake-date(s) newer`. Per `LOOPS.md` rule 5's own text, **this rule could not
be evaluated this wake** and is not reported clear. No sample recorded: this
grill changes **0** files under `packages/core/src/css/`, so a `bundle-gz-kb`
reading could only reproduce the existing value. See 258.1 finding D for what
that STALE number actually counts — it is not what the last hand-off said.

**Scope narrowed before grilling, per §6 step 0.** The armed set is
`[249, 256, 257]` and **249 is dropped**: it is an open sixteen-item slice that
re-arms after every round, Slice 253 grilled `249.1`/`249.6` and Slice 256
grilled `249.2`/`249.3`/`249.4`, and what remains open in it is unbuilt — owner
calls, two browser-blocked items, one cost question. A grill re-derives what
shipped. The scope is **256** (itself a grill, never re-derived by anyone) and
**257** (never grilled). `.roundtable/INDEX.md` reports **4 repeated subject(s)**
across 182 files, re-read AFTER `record_iteration.py` regenerated it with this
report in the set rather than predicted before: this grill does not add a fifth.

Full report, with every command:
`.roundtable/grill-objective-256-257-2026-09-04.md`.

1. [x] **258.1 — DONE 2026-09-04. Sixty-two published assertions re-derived; 58
       reproduce, 4 do not. All four are prose, none changes a verdict, and two
       are the grilled slices' own recorded defect arriving inside their own
       write-ups.**

       *The unit is defined, because a tally is only checkable if it is:* one
       assertion = one distinct figure or statement a command was re-run
       against — **34** from Slice 257, **28** from Slice 256.

       - **A — 256.2's "would miss `75` equally-historical ones" is `65`.**
         The seven filename prefixes the sentence enumerates cover 65 files, at
         **256.2's own commit** rather than at a later tree:
         `git ls-tree -r --name-only 0362ba15 -- .roundtable` gives 182
         top-level `*.md`, 86 `grill-*` and 65 across
         `design-grill-`(35) `scorecard-`(10) `research-`(7) `explore-`(7)
         `objective-grill-`(2) `pattern-sweep-`(2) `rf-`(2). The neighbouring
         sets a reader might reach for are **85** (dated non-`grill-*`) and
         **96** (all non-`grill-*`); none of the three is 75. The verdict —
         `grill-*.md` is not a clean boundary — is unaffected. **This is
         256.1 finding A's own shape, one item later in the same commit**: a
         real count of a set the sentence does not name. Corrected in place.
       - **B — 257.1's correction of 255.1 undercounts `compatOf`: three, not
         two.** `grep -rn compatOf packages/core/scripts apps/docs/scripts
         scripts/loops --include=*.mjs --include=*.py` returns ten lines and
         **three** definitions — the two bound aliases the sentence enumerates
         plus the canonical `export function compatOf` at `bcd-compat.mjs:31`,
         which is the definition both aliases point at and the reason the group
         is a duplicate at all. Conclusion unaffected. Worth recording for the
         same reason as A: 257.1's own sentence names the defect it was fixing
         as *"asserting an ABSENCE in the repo from an instrument that
         structurally cannot see the construct"*, and its replacement count came
         from that same blind spot — the arrow pattern sees two, the
         `export function` pattern sees the third. Corrected in place.
       - **C — `pascal` derives `"ProbeWidget"`, not `"Probe Widget"`.** Three
         live sites attributed the scaffolder's old default label to `pascal`:
         `new-component.mjs:94`, `component-label.mjs:24` and ROADMAP 257.1. The
         value is right; the attribution is short by one step. The expression
         that produced it was `pascal.replace(/([a-z])([A-Z])/g, '$1 $2')`,
         recovered from `git show 01fd7fc5:packages/core/scripts/new-component.mjs`
         rather than reasoned about, and `node -e` on both spellings gives
         `"ProbeWidget"` and `"Probe Widget"` respectively.

         **Why it is worth correcting rather than shrugging at:** `pascal` is
         still live at `new-component.mjs:91`, used for `init${pascal}` in the
         generated behaviour test, so the comment names an identifier a reader
         can evaluate — and evaluating it contradicts the comment. A citation
         that no longer resolves, sitting in the header of the module Slice 257
         created to stop this class of drift. **Both code comments corrected**;
         the ROADMAP text stays and is corrected here.
       - **D — the rule-5 hand-off reads the staleness counter as wakes; it
         counts DATES.** `.roundtable/RESUME.md` said *"255, 256 and 257 have
         now each declined a sample … and every decline ages the rule by one
         wake-date."* `dispatch_status.report_metrics()` computes
         `stale = [d for d in log_dates if d > newest["ts"][:10]]` — distinct
         log **dates** strictly after the newest comparable pair. Against the
         log: the pair is `bundle-gz-kb` at 2026-09-03 09:54; Slice 255 (09-03
         14:40) and Slice 256 (09-03 17:47) are the same date and aged it by
         **zero**; only Slice 257 (09-04 00:56) moved it, by falling on a new
         date rather than by declining anything. **And 256 declined nothing** —
         its trace says rules 4-8 were not reached, and its body carries no
         `rule 5` note, where 255 and 257 both carry an explicit one.

         **What it costs:** the hand-off's watch condition — *"if this reaches
         ~5 wake-dates with no CSS change in sight, the rule is dead again"* —
         reads as five wakes and means five calendar dates of loop activity. At
         an hourly cadence those differ by more than an order of magnitude.

         **Fixed in the layer where the misreading happens** (169.3's lesson:
         a correction in the wholesale-rewritten hand-off dies there), not in
         `RESUME.md` and not in `LOOPS.md`'s prose:
         `dispatch_status.py`'s rule-5 advisory now prints the unit and
         enumerates the dates, and the comment beside `stale` records the
         misreading. **Red-proved by discrimination, injection confirmed
         before the verdict**, `cp` backup rather than `git checkout` (249.8's
         trap): one synthetic 2026-09-05 row appended to `loop-log.md`
         (`grep -cF INJECTEDPROBE` → 1) took the line to `2 wake-date(s)`
         listing `2026-09-04, 2026-09-05`; restored (`grep -cF` → 0), the line
         back to one date and `git status` clean.

       **What reproduced, so it is not re-derived a third time.** All five of
       257's lanes, member for member: dead-style **0 / 0 / 1,433**;
       css-repeats **74 · 242 · 230 · 8** with the x4 group still two
       components; prose **118/127 · 781 · 937 · 110,537** with the union of 15
       inside the 16-page verdicted set; loop-prose ratchet `CLAUDE.md` 32 up /
       `DESIGN.md` 22 up / `LOOPS.md` 6 up `9198e43f` / `ENVIRONMENT.md` 3 up
       `1005d1db`, with `RESUME.md` and `ROADMAP.md` moved by exactly the two
       commits that landed after 257's reading; lane 5's **69 / 48 / 41**.
       257's consolidation itself: one definition of the rule, both callers
       importing it, the shared body byte-identical to the pre-consolidation
       extractor's, the pre-state's two differently-named copies meeting at
       `label === derivedLabel`, the diff at 5 files with **0** under
       `packages/core/src/css/`, 1,845 commits at its parent, **17** CI entry
       points compared as SETS, **138** built pages, `check:claims`
       **162 live · 3 NOT VERIFIED**. And all of 256: finding A's
       `{99: 25, 105: 9, 114: 1, 117: 4, 119: 1}` over 40 components with 9
       labels and the largest full-label group at 20 (20 + 3 + 2 = 25); finding
       B's corrections present on both sides and 158.1's own tally confirmed at
       twelve; finding C re-measured live at **913 × 384**, 14 rows, 9 fully
       inside, 15px reserved in the shell's scrolling `main`, page scrollbar 0,
       first `[data-density="compact"]` a 30px `FORM.bo-cluster` with 0 rows;
       256.2's **185 / 0**, 182, 86, 168, the comment now sitting on `ALLOW`,
       and `check:selftests` **51 gates, 18 heuristic**.

       **One thing 257 did not assert, checked anyway:** the shared module is
       dev-only. `packages/core`'s `files` is
       `["dist","scripts/check-markup.mjs","NOTICE","media"]`, so
       `component-label.mjs` never reaches the tarball; `check:package` passes
       at **184** files.

       **This wake's own probe was wrong on first output** (CLAUDE.md's base
       rate). The live width probe first read `clientWidth`/`clientHeight` and
       counted rows document-wide: **896 × 382, 36 rows**, which would have
       reported 256 finding C as not reproducing. Both errors are the same
       mistake — measuring a box other than the one the claim is about:
       `clientWidth` excludes the container's own 15px scrollbar and 2px border
       (913 − 17 = 896), `clientHeight` excludes the border (384 − 2 = 382), and
       the page carries **three** `.bo-data-table-container` elements. The tell
       was an independent figure already in hand: `rowsFullyInside` came back
       **9**, matching 256 exactly, while the width and row count did not.

       - **Accept (property, not prediction):** every published figure in the
         narrowed scope is either re-derived with the command recorded, or named
         as not re-derivable here with the reason. Met: 62 checked, 4 corrected,
         0 out of reach. **Finding a premise false is a satisfying outcome** —
         four of them were.
       - **Not verified, and named rather than implied:** cloud wake — no
         Podman, no `localhost:8081`, so the 1440/390 light-and-dark screenshot
         lane could not run. Every claim above is a count, a grep, a git
         reading, a computed style or a layout geometry, which is
         `ENVIRONMENT.md`'s second list. The diff is two build-script comments,
         one loop script's output text, and markdown — **0** files under
         `packages/core/src/css/`, no page markup, built page count unchanged at
         **138** — so there is nothing a screenshot could have shown.
       - **Refused, so it is not re-proposed:** a gate for C. *"This comment
         names the expression that produced this value"* is semantic, which is
         94.11's line exactly; the checkable shape would have to evaluate prose.
         Corrected by hand in both places with no ceremony wrapped around it.
         Also refused: a gate for A or B — both are counts inside prose, and
         `check:slice-refs` answers whether a citation resolves, which neither
         of these is. And widening lane 5's pattern, on 257's own base rate,
         which re-derives: B makes the `compatOf` group larger, not more of a
         finding.

## Slice 257 — Standardize sweep: all five lanes clean, and the finding came from none of them — the default-label rule was hand-copied into the scaffolder by the wake that introduced it, kept in sync by a comment, after it had already drifted once (2026-09-04)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** — `git branch
--show-current` empty, local `main` stale at `26447ba` while `HEAD` sat on
`0b65b53` (= `origin/main`), ENVIRONMENT trap 1 in the shape that bites at
`git push` rather than at Step 0. Fixed with `git checkout -B main origin/main`
before any commit. `--unshallow` clean in one attempt (**1,845** commits, no
`shallow.lock`), and `git fetch --tags origin` run after it because
`--unshallow` does not bring tags (trap 2). Rule 1: no open P0 — `list_issues`
on `Busy-Office/busy-office-ui` returns `totalCount: 0`; Step 1 triaged and
committed nothing. **Rule 2 fired**: `dispatch_status.py` read
`Standardize 4 / 4 Continue rounds  OVERDUE`, exactly as the previous
hand-off predicted. Rules 3-8 not reached (`Objective 2 / 3 [249, 256]`).

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **`ok`**
this wake (not STALE) — `0 wake-date(s) newer`, newest pair `bundle-gz-kb`,
**128** samples. So rule 5 *could* be evaluated and finds nothing: no tracked
metric regressed on two consecutive runs, no size budget breached. No new
sample recorded, deliberately — this sweep changes **0** files under
`packages/core/src/css/`, so a fresh `bundle-gz-kb` reading could only
reproduce the existing value, and a repeated identical value is a data point
about the instrument, not the bundle.

1. [x] **257.1 — DONE 2026-09-04. The default-label rule existed twice, and the
       two copies are COMPARED AGAINST EACH OTHER at runtime. Consolidated into
       `packages/core/scripts/component-label.mjs`; both callers now read one
       function.**

       *Accept was*, written as properties rather than predictions:
       (a) exactly one definition of the rule exists in the repo, counted by a
       grep for the rule's BODY rather than its name — the two copies had
       different names, so a name search cannot answer this;
       (b) both callers are shown to READ the shared module by an INJECTION
       that changes each one's output, never by reading the import lines;
       (c) the scaffolder's stamped header discriminates — same command, same
       flags, injected module vs restored module produce different headers;
       (d) the consolidation is output-neutral, or the difference is explained.
       All four are executed below.

       **The finding.** `extract-api.mjs` derived a component's default sidebar
       label from its CSS directory name; `new-component.mjs` carried the same
       derivation inline, guarded by a comment instructing the next editor to
       spell it *"the SAME way extract-api.mjs's `defaultLabel()` spells it"*.

       ```
       grep -rn "charAt(0).toUpperCase()" --include=*.mjs --include=*.astro \
         --include=*.js --include=*.ts . | grep -v node_modules | grep -v "/dist/"
       # before: extract-api.mjs:216, new-component.mjs:99      -> 2
       # after:  component-label.mjs:40                          -> 1
       ```

       **Why this one is worth a module when two copies usually are not.**
       `bcd-compat.mjs` (252.3, the previous sweep) asks that question of itself
       and answers it from the cost its own gate paid. The answer here is a
       different and stronger one: these two copies are not merely alike, they
       **meet in an equality test**. `new-component.mjs` stamps an `@label` into
       a new CSS header only when the requested label differs from the derived
       default — `label === derivedLabel ? '' : ...` — so any disagreement
       between the two spellings is silently written into a shipped file.

       **That is not hypothetical: it happened, inside the wake that created the
       second copy.** 249.8's own comment records it — `pascal` derived
       "Probe Widget" where the extractor derives "Probe widget", so a probe run
       on 2026-09-03 stamped a redundant `@label` saying exactly what the
       default already said. 249.8 fixed the symptom by hand-copying the
       extractor's derivation into the scaffolder, which is the state this item
       found. Removing a duplication (249.8 deleted the hand-maintained sidebar
       map from `Gallery.astro`) and adding one in the same change is the drift
       lane 1 exists to catch.

       **Red-proved two-sided, with the injection confirmed before either
       verdict was believed** (`grep -cF INJECTED` = 1 on the module), using
       `cp` backups rather than `git checkout` (249.8's recorded trap):

       - **Consumer A, `extract-api.mjs`.** With `'INJECTED' + …` in the shared
         module, `dist/api.json` carries **54** `"label": "INJECTED…"` entries
         (`"label": "INJECTEDAmount"`, `"INJECTEDAvatar"`, …); restored, **0**.
       - **Consumer B, `new-component.mjs`.** The same scaffolder command and
         flags (`probe-widget --group="Display" --label="Probe widget"`) stamped
         `@label Probe widget` into the new header under the injected module —
         because `defaultLabel` returned `"INJECTEDProbe widget"`, so the
         equality failed — and stamped **no `@label` at all** under the restored
         module. Only the shared module differed between the two runs. The probe
         files and `index.css` were restored from `cp` backups; `git status` is
         clean of them.
       - **Output-neutral, proved rather than asserted.** HEAD's extractor was
         extracted to a sibling probe path, run, and its `api.json` diffed
         against the consolidated one: **byte-identical**, whole file. The probe
         was deleted.

       **Lane readings — `n of 5`, since four consecutive sweeps ran three and
       206's own text said "all three standing lanes".**

       ```
       npm run scan:dead-style -w docs                 # lane 1 of 4
       npm run report:css-repeats -w @busy-office/ui   # lane 2 of 4
       npm run report:prose -w docs                    # lane 3 of 4
       python3 scripts/loops/report_loop_prose.py      # lane 4 of 4
       grep -rhoE '^(async )?function\*? [a-zA-Z0-9_]+' \
         packages/core/scripts apps/docs/scripts scripts/loops \
         --include=*.mjs --include=*.py | sed 's/^async //' \
         | sort | uniq -c | sort -rn                    # lane 5 (252.3's scan)
       ```

       - **Lane 1 — `scan:dead-style`: 0 dead on 0 pages, 1,433 live inline
         declarations**, screen + print, 0 dead on screen but live in print.
         Identical to 255.1, 252.1, 244.1 and 237.1. `CHROME_PATH` exported in
         the same command (ENVIRONMENT 1c).
       - **Lane 2 — `report:css-repeats`: zero delta, compared member for member
         rather than by count.** 74 source files · **242** rules with 3+
         declarations · **230** distinct bodies · **8** repeated — the same three
         totals as 255.1 and 252.1, and the same eight groups: x4 joined-control
         radius (money ×2, quantity ×2), x3 list reset (timeline / sidebar-nav
         `ul` / tree), x3 visually-hidden (sidebar-nav label+heading / stepper
         label / the primitive) and five x2 pairs. The x4 group is still **two**
         components, so its reopen trigger — a THIRD component — is unmet.
       - **Lane 3 — `report:prose`: zero unverdicted pages, by SET DIFFERENCE.**
         118 documentation pages of 127 built · median **781** · mean 937 ·
         total **110,537** words. Ten over 2x the corpus median and five more
         over a family median; the union is **15** distinct pages and
         `comm -23 flagged verdicted` is **empty** against the **16**-page
         verdicted set (158.1's twelve, extracted from its own numbered list in
         the archive, plus 161.1's three and 178.3's `/concepts/scale/`).
         `/patterns/output-form/` is verdicted and no longer flagged, which is
         the only asymmetry.

         *The corpus total moved 110,518 → 110,537 (+19 words) since 255.1.* The
         only commit between the two sweeps that touches a docs source is
         **249.8** (`4dbec5b`, 49 files, including `src/pages/index.astro` and
         `src/data/component-nav.mjs`), so the attribution is at commit level
         and is measured. **Which page carries the +19 was NOT measured** — that
         would need a rebuild at the parent commit, and nothing here rests on
         it. No page crossed a threshold it had not already crossed.
       - **Lane 4 — `report_loop_prose.py`: no file changed accumulate class,
         `ratchet` block read first, never the delta.** `CLAUDE.md` **32 up,
         never cut** (31 at 255.1, 30 at 252.1, 29 at 244.1) and `DESIGN.md`
         **22 up, never cut** are 167.1's standing verdicts, and `CLAUDE.md`'s
         watch was executed and **retired** by 193.1, so neither is re-raised.
         Every file the loop reads every wake has a cut behind it except those
         two: `LOOPS.md` `6 up, last cut 9198e43f`; `RESUME.md` `0 up, last cut
         0b65b53d`; `ENVIRONMENT.md` `3 up, last cut 1005d1db`; `ROADMAP.md`
         `13 up, last cut 25e24745`.

         **The regrowth signal is NOT actionable this wake.** `roadmap_scope.py`
         reads closed-history share **943 / 3,404 = 27.7%**, well under the
         **55.1%** at which 252.1 dispatched the tenth archive sweep. Of the six
         eligible targets `[256, 255, 254, 253, 252, 237]`, two (253, 237) are
         named by the still-open Slice 249 and stay per 236.2. No sweep.
       - **Lane 5 — the divergence scan step 1 names: no hand-copied logic, and
         one sentence of 255.1's reading is corrected.** The only two-count
         pairs are `function exists` and `function build`, both standing false
         positives adjudicated by arity in 252.3 and 255.1.

         255.1 also stated *"`compatOf` no longer appears; it lives in
         `bcd-compat.mjs` since 252.3"*. The second clause is true; **the first
         is not** — the name appears twice, as
         `const compatOf = (path) => bcdCompatOf(path, 'derive-floor')` and the
         same line for `'check-rf-floor'`. *(Corrected 2026-09-04 by the
         Objective grill, roadmap 258.1: **three**, not two. The two bound
         aliases are the two this sentence enumerates, and the third is the
         canonical `export function compatOf` at `bcd-compat.mjs:31` — the
         definition both aliases point at, and the one that makes the group a
         duplicate at all. Ten lines name it in total.
         `grep -rn compatOf packages/core/scripts apps/docs/scripts
         scripts/loops --include=*.mjs --include=*.py`. Same shape as the error
         being corrected here: a count of the repo taken from an instrument
         whose pattern cannot see one of the constructs involved.)* Those are
         deliberate bound aliases
         that supply each caller's own name to the shared function, so the
         *conclusion* (no hand-copied logic) is unaffected and 252.3's
         consolidation is intact. What is wrong is the form of the claim: it
         asserted an ABSENCE in the repo from an instrument that structurally
         cannot see the construct, which is the shape CLAUDE.md's
         context-window-regex bullet already records.

       **The instrument's blind spot, measured — and why widening it is
       REFUSED.** Lane 5's pattern is anchored `^(async )?function`, so it sees
       neither a top-level arrow function nor an `export function`:

       ```
       grep -rhoE '^(async )?function\*? [a-zA-Z0-9_]+' … | wc -l          # 69  seen
       grep -rhoE '^const [a-zA-Z0-9_]+ = (async )?\([^)]*\) =>' … | wc -l # 48  blind
       grep -rhoE '^export (async )?function\*? [a-zA-Z0-9_]+' … | wc -l   # 41  blind
       ```

       **69 of 158 definitions — 44%.** That looks like a gate waiting to be
       widened, and the base rate says otherwise: the only duplicate name in the
       blind spot is `compatOf`, adjudicated above as correct by design, so
       widening lane 5 would add exactly **one** group and it is a false
       positive — 1 of 1.

       **And it would not have caught this wake's drift either**, which is the
       part worth carrying: the two copies had **different names**
       (`defaultLabel` in the extractor, `derivedLabel` in the scaffolder, the
       latter inside an IIFE). No name-collision scan at any width finds two
       differently-named spellings of one rule. What found it was step 1's own
       lane-1 instruction — *"duplicated token values or logic (e.g. the same
       lookup table hand-copied into multiple scripts)"* — applied by reading
       the newest large change (249.8, 49 files) rather than by running
       anything. Recorded as a reading habit, not converted into a detector,
       because the checkable shape here is semantic.

       **Two of this wake's own probes were wrong on first output, both caught
       before use** (CLAUDE.md's base rate, landing twice in one item):
       - A duplicate-name probe written as `^const NAME = (` matched plain
         assignments — `= (await readdir(…))`, `= (process.env…)` — and
         reported `files` and `base` as duplicated "functions". Neither is a
         function. The corrected pattern requires `) =>`.
       - The lane-3 flagged-set extraction grepped `/[a-z-]+/[a-z-]+/` over the
         report and returned a sixteenth "page": **`/script/style/`**, out of
         the report's own explanatory header (*"with pre/script/style/svg/
         template removed"*). The assertion tripped on its own explanation,
         which is the trap CLAUDE.md's removal-verification section names.

       **Not verified, said plainly.** This is a cloud wake: no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. Nothing here rests on a rendered image — the diff is three build
       scripts and markdown; **0** files under `packages/core/src/css/`, no docs
       page markup, the built page count is unchanged at **138**, and
       `api.json` is byte-identical before and after, so there is nothing a
       screenshot could have shown. All **17** CI entry points, re-derived from
       `ci.yml` this wake rather than read off the snapshot, ran green here.
       `check:claims` reports `162 verified live · 3 NOT VERIFIED` — ENVIRONMENT
       6b's container property (`pointer: fine` false), not a regression; the
       live count rose 158 → 162 as the corpus grew.

## Slice 256 — Objective grill of Slices 249 (.2/.3/.4), 254, 255: 57 of 60 assertions reproduce, both that do not are counts of the WRONG SET — a label group read as a browser floor and a width that is a platform scrollbar — and writing the report tripped a gate whose own comment exempts the file it fired on (2026-09-03)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** and
`origin/main` a forced update (`+ 17b3ba6...03aab90`), ENVIRONMENT traps 1 and 2
both biting as usual — `git checkout -B main origin/main` before any commit, then
`--unshallow` clean in one attempt (1,834 commits, no `shallow.lock`). Rule 1: no
open P0 — `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`;
Step 1 triaged and committed nothing. Rule 2 clear (`Standardize 0 / 4`). **Rule
3 fired**: `Objective 3 / 3 slices OVERDUE [249, 254, 255]`. Rules 4-8 not
reached. `git fetch origin main` re-run immediately before the first commit
(Step 0c): unmoved, no collision.

**Scope narrowed before grilling, per §6 step 0.** 249 is an open sixteen-item
slice, so it re-arms after every round and Slice 253 already grilled it — `249.1`
and `249.6`, the only items that existed then. Dropped both; the scope is what
landed *since* that grill: `249.2`, `249.3`, `249.4`, Slice 254, Slice 255.
`.roundtable/INDEX.md` reports **4 repeated subject(s)** across 180 files and this
grill does not add a fifth.

Full report, with every command:
`.roundtable/grill-objective-249-254-255-2026-09-03.md`.

1. [x] **256.1 — DONE 2026-09-03. Sixty published assertions re-derived; 57
       reproduce exactly, two do not reproduce as stated, one reproduces only
       within a documented tolerance — and both failures are the same error, a
       real count of a set the sentence does not name.**

       *The unit is defined, because a tally is only checkable if it is:* one
       assertion = one distinct figure or statement a command was re-run
       against, totalled per slice in the report — 23 (255) + 12 (254) + 7
       (249.2) + 9 (249.3) + 9 (249.4) = 60. **This line first read "50 claims,
       47 reproduce", which was estimated rather than counted**; it is corrected
       here rather than quietly, since a number going into a summary is the
       exact case CLAUDE.md says to red-prove.

       Two were corrected in place in this commit; the third is an environment
       fact and went to `ENVIRONMENT.md` §6c. A **fourth** finding is not about
       a claim at all — `check:floor` went red on this report while it was being
       written, and it is filed as the open **256.2** below rather than fixed
       here, because widening a gate in the wake that tripped it is the pattern
       this repo refuses.

       - **A — `249.3`: "20 components floor at Chrome 99" is false; 25 do.**
         `{ '99': 25, '105': 9, '114': 1, '117': 4, '119': 1 }`. The 20 is the
         size of the largest full-LABEL group; two more Chrome-99 labels carry
         3 and 2 (20 + 3 + 2 = 25). The sentence's
         subject is the label and its predicate is the browser, which is how it
         survived review. It is the only figure in 249.3 that argues why the
         per-component floor is worth shipping, and the error **flattered the
         item** — 25 of 40 is 63% at the framework's oldest floor, not 50%.
         Everything else in the sentence holds: 9 distinct labels, range
         99 → 119, framework floor 119.
       - **B — Slice 255's lane 3 resolves against an enumeration that labels
         FIFTEEN names as "158.1's twelve".** The conclusion stands and was
         re-derived by set difference: 118 pages of 127, median 781, total
         110,518, union of corpus-2x and family-2x = 15 distinct pages, every
         one verdicted. What fails is the citation. The archive passage absorbs
         **161.1's** `/base/motion/`, `/concepts/design-language/` and
         `/concepts/js-behaviors/` into 158.1 — 158.1's own text names them as
         the three that swap IN and leaves them for the next round — then counts
         them again as "161.1's three", while dropping `/patterns/output-form/`,
         which 158.1 did verdict. The union is **16**. Same shape as all three
         of Slice 253's findings: a citation about citations. Corrected in
         Slice 255's live text and by an appended CORRECTION block in
         `ROADMAP-archive.md` (236.2 permits amending the archive).
       - **C — Slice 254's `.bo-data-table-container` at "928 × 384" reads
         913 × 384 here, and the 15px is a reserved scrollbar.** Re-measured
         live on the built page via `browser-harness.mjs` + `serve-dist.mjs`:
         14 rows ✓, 384px ✓, 9 of 14 fully inside ✓, first
         `[data-density="compact"]` a 30px `FORM.bo-cluster` with 0 rows ✓ —
         every load-bearing figure of the crop decision reproduces. Only the
         width moves, by exactly the 15px classic scrollbar Linux headless
         Chrome reserves inside `main.bo-app-shell__main` (`overflow-y: auto`;
         `offsetWidth 1216 − clientWidth 1201 = 15`), where macOS overlay
         scrollbars reserve 0. **Nothing is broken.** Two hypotheses were tried
         and refuted first — a page scrollbar (`innerWidth −
         documentElement.clientWidth` = **0**, because the shell scrolls `main`
         and not the document) and a font-sized rail (dead: `.docs-main` is
         `minmax(0, 1fr) 13rem`, fixed). Filed as a trap because any future
         cloud-wake width reading will disagree with the owner's by 15px and
         look like a regression.

       **Soft note, not filed as a defect.** 254's `364.0 kB → 449.3 kB` packs
       here as `363.6 → 449.1` (files exact at 183 → 184, the pre-254 figure
       taken by building a worktree at `82d14bf`). Both byte figures land
       0.2-0.4 kB low in the same direction — the classic-zlib-vs-zlib-ng
       difference LOOPS.md §2 already records as the reason never to gate a
       compressed byte count exactly. Derived ratio +23.5% against a published
       +23.4%; the 1x-over-2x trade is unaffected at either reading.

       **What reproduced, so it is not re-derived a third time.** All five of
       255's lanes, reading identically: dead-style 0/0/1,433; css-repeats
       74 · 242 · 230 · 8 with the x4 group still two components; prose
       118/127 · 781 · 937 · 110,518; loop-prose `CLAUDE.md` 31 up /
       `DESIGN.md` 22 up / `LOOPS.md` 6 up `9198e43f` / `RESUME.md` 0 up
       `82d14bf`; the divergence scan's two false positives, `build()` arity 0
       vs 3 and `exists` across workspaces. 249.2's 165 = 127 + 10 + 28 split,
       127 of 127 descriptions, **127 distinct** description strings, sitemap
       127 = 127, and the "116 built pages" set is exactly the 116 source pages
       using `<Gallery` against **11** that build their own `<head>`. 249.3's
       280 maturity assertions over 40 components / 39 pages, and its whole
       refutation: tags start at `v0.1.1`, `npm view` has no 0.2.0,
       `components/form/` holds five files and no `form.css`, `introduced.json`
       is 42 keys = 26 + 15 + 1 with `nav` and `record-card` the two removed.
       249.4's `48 / 18 / 0 / 3`, the 5-item In-scope list and 7-row
       Not-in-scope table, `51 gates, 18 heuristic`, the built page's third
       `<h2>` being the layout's `Related`, and 183 files at that commit.

       - **Accept (property, not prediction):** every published figure in the
         narrowed scope is either re-derived with the command recorded, or named
         as not re-derivable here with the reason. Met: 50 checked, 3 corrected
         or filed, 2 named as out of reach (254's 2x branch needs a re-taken
         screenshot; the registry half of its Accept needs a publish).
       - **Not verified, and named rather than implied:** cloud wake — no
         Podman, no `localhost:8081`, so the 1440/390 light-and-dark screenshot
         lane could not run. Every claim above is a count, a byte size, a
         computed style or a layout geometry, which is the second of
         `ENVIRONMENT.md`'s two lists. The diff is markdown only (this slice,
         two corrections, the grill report, `ENVIRONMENT.md`) plus no code, so
         there is nothing a screenshot could have shown.

2. [x] **256.2 — DONE 2026-09-03 (cloud wake). The COMMENT was wrong; the
       allow-list stands. `check:floor`'s stated exemption named `.roundtable`
       grills; its allow-list did not.**
       Found by tripping it: this grill's first draft quoted three floor labels
       verbatim and `docs:build` went red with *"3 hand-typed browser
       floor(s)"*. **The gate is right to fire and nothing was widened to let
       the report pass** — it was rewritten to print the deriving command
       instead of the values. What is filed here is the mismatch inside the
       gate itself:

       ```
       # check-floor.mjs, header comment:
       #   "ROADMAP and the .roundtable grills QUOTE the old value as history"
       const ALLOW = ['scripts/check-floor.mjs', 'scripts/derive-floor.mjs',
                      'CHANGELOG.md', 'ROADMAP.md', 'ROADMAP-archive.md'];
       ```

       `.roundtable/**` is absent. The comment grants an exemption the code does
       not, and nothing noticed because **no grill report had ever quoted a full
       label** — the predicate was never exercised, which is 94.11's base-rate
       lesson arriving from the other direction.

       The argument runs both ways and that is why this is a decision, not a
       patch. FOR widening: a dated grill in `.roundtable/` is history by
       construction, the same reason `ROADMAP-archive.md` is exempt, and
       rewriting one to satisfy a gate erases the finding it records. AGAINST:
       `.roundtable/` also holds **living ledgers** read as current
       (`ENVIRONMENT.md`, `polish-state.md`, `RESUME.md`), so a blanket
       directory exemption is wider than the comment claims — a floor literal
       in `ENVIRONMENT.md` would rot exactly like one in a docs page.

       - **Accept (property, not prediction):** the comment and the allow-list
         agree, whichever way that is settled — either `.roundtable/` (or a
         `grill-*.md` subset of it) joins `ALLOW`, or the comment is corrected
         to name only the files actually exempt. **Finding the comment wrong is
         a satisfying outcome**, not an off-plan one. Whichever way it goes,
         red-prove it: inject a hand-typed label into one file on each side of
         the new boundary and confirm the gate fires on exactly one, checking
         that the injection landed before believing either result.

       **RESOLVED 2026-09-03: the comment is corrected to name only the files
       actually exempt; `ALLOW` is unchanged.** This is the Accept's second
       branch, and it is the branch the *evidence* picked rather than the one
       that was cheaper — the FOR argument was refuted by the only case in which
       the predicate has ever fired.

       - **The FOR argument's premise is false, measured against its own worked
         example.** It claimed "rewriting one to satisfy a gate erases the
         finding it records". The rewrite is
         `.roundtable/grill-objective-249-254-255-2026-09-03.md:84-95`: it still
         records that three distinct labels share a Chrome floor of 99 and that
         the largest full-label group is 20, and it now ships the `node -e`
         command that derives them from `floor.json`. The finding was
         **preserved and made re-runnable**, not erased. That report's own prose
         (line 86) already describes the CODE's boundary — *"`check:floor`
         forbids a hand-typed floor outside `ROADMAP.md` and it is right to"* —
         while its Finding D quotes the comment's wider claim. The grill
         disagreed with itself; the code was the half that was right.
       - **Base rate: `.roundtable/` is 185 of the 556 files this gate checks,
         and 0 of them trip the literal.** Re-runnable (reconciles against the
         gate's own `556` = 561 walked − 5 allow-skipped, and 185 = 182
         top-level `*.md` + 3 under `pilot-112/`):

         ```
         node -e "
         const {readdirSync,readFileSync}=require('fs'),{join}=require('path');
         const L=/(Chrome|Firefox|Safari|Edge)(\/Edge)?\s+\d+(\.\d+)?\s*(·|,)\s*(Chrome|Firefox|FF|Safari|Edge)/i;
         let n=0,hit=0;(function w(d){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);
          if(e.isDirectory())w(p); else if(/\.(astro|mjs|js|ts|md)$/.test(e.name)){n++;
           const s=readFileSync(p,'utf8').replace(/<!-- stat:[a-z]+ -->[\s\S]*?<!-- \/stat -->/g,'');
           if(s.split('\n').some(l=>L.test(l)))hit++;}}})('.roundtable');
         console.log(n,hit)"        # -> 185 0
         ```

         The strongest counter-case fails too: `rf-scanner-floor-study-2026-08-19.md`
         is a study *entirely about the browser floor* and never quotes a full
         label — it names single browsers ("Chrome 119", "Chrome 99"), which
         this detector permits by design (self-test case 4). The file most
         likely to need the exemption does not need it.
       - **Both subsets the Accept imagined were measured, and NEITHER is a
         clean boundary** — worth recording, because they read as obvious:
         `grill-*.md` matches **86 of 182** top-level reports and would miss
         **65** equally-historical ones under `design-grill-`,
         `objective-grill-`, `research-`, `explore-`, `scorecard-`,
         `pattern-sweep-` and `rf-`. *(Read **75** until 2026-09-04, corrected
         by the Objective grill, roadmap 258.1. Measured at this item's own
         commit `0362ba15` rather than at a later tree:
         `git ls-tree -r --name-only 0362ba15 -- .roundtable` gives 182
         top-level `*.md`, 86 `grill-*`, and **65** across the seven prefixes
         named here. The seven-prefix column still reads 65 at HEAD; the other
         two moved to 183 / 87, by exactly the one file the correcting grill
         added. The two neighbouring sets a reader might reach for are
         85 (dated non-`grill-*`) and 96 (all non-`grill-*`); none of the three
         is 75. The verdict — `grill-*.md` is not a clean boundary — is
         unaffected, and this is the same defect 256.1 finding A records one
         item earlier: a real count of a set the sentence does not name.)* And
         "a dated filename means history" is
         false in the other direction: 168 of 182 are dated, but
         `reopen-conditions-2026-08-29.md` is dated *and* read as current, which
         is the AGAINST argument's living-ledger hazard wearing a date.
       - **Red-proved two-sided, injection confirmed before either verdict was
         believed** (`cp` backups, not `git checkout` — 249.8's trap). Label
         injected: `Chrome/Edge 119 · Firefox 128 · Safari 17.4`.

         | side | file | injection landed | gate |
         |---|---|---|---|
         | inside `ALLOW` | `ROADMAP.md` | `grep -cF` → 1 | **passed**, rc=0, 556 files |
         | outside `ALLOW` | `.roundtable/grill-objective-249-254-255-2026-09-03.md` | `grep -cF` → 1 | **FAILED**, rc=1, *"1 hand-typed browser floor(s)"* naming exactly that file |

         Fires on exactly one, as the Accept required. Both files restored
         (`grep -cF` → 0) and the post-restore baseline is green.
       - **Also fixed, and plausibly the mechanism of the drift:** the stale
         comment did not sit above `ALLOW` — it floated above the `--self-test`
         block, describing a constant ~20 lines away. It now sits on `ALLOW`.
         `check:selftests` still classifies 51 gates, 18 heuristic all
         self-tested, so moving it did not disturb the `process.argv` detection.
       - **Reopen condition (a property, not a forecast):** a report is made
         WORSE by this — not merely inconvenienced by having to cite a deriving
         command. A grill that must pin a historical label writes it into its
         ROADMAP entry, which is exempt.

## Slice 255 — Standardize sweep: all five lanes clean, nothing to consolidate — lane 4's regrowth signal is 22.1%, well under the 55.1% that dispatched the tenth sweep three days ago, and lane 5's only two-count pair is a false positive by arity (2026-09-03)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and the three open slices
are 15 (owner-hardware AT evidence), 112 (owner briefs) and 249 (the triaged
adoption proposal). Nothing new to triage, so Step 1 committed nothing. Rule 2
fired: `dispatch_status.py` read `Standardize 5 / 4 Continue rounds OVERDUE`.
Rules 3-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports Optimize **`ok`**
this wake (not STALE) — `0 wake-date(s) newer`, newest pair `bundle-gz-kb`,
128 samples. So rule 5 *could* be evaluated and finds nothing: no tracked metric
regressed on two consecutive runs and no size budget is breached. No new sample
was recorded, deliberately — this sweep changes **0** files under
`packages/core/src/css/` (it changes only two markdown files), so a fresh
`bundle-gz-kb` reading could only reproduce the existing value, and a repeated
identical value is a data point about the instrument, not the bundle (252.1's
own note, inverted: it recorded a sample because rule 5 was STALE; here it is
live).

1. [x] **255.1 — DONE 2026-09-03. A clean Standardize pass: all four standing
       lanes and the ad-hoc fifth lane find nothing to consolidate. Recorded as
       a no-op sweep rather than manufacturing a fix — CLAUDE.md's standing rule
       against busywork.**

       ```
       npm run scan:dead-style -w docs                 # lane 1 of 4
       npm run report:css-repeats -w @busy-office/ui   # lane 2 of 4
       npm run report:prose -w docs                    # lane 3 of 4
       python3 scripts/loops/report_loop_prose.py      # lane 4 of 4
       grep -rhoE '^(async )?function\*? [a-zA-Z0-9_]+' \
         packages/core/scripts apps/docs/scripts scripts/loops \
         --include=*.mjs --include=*.py | sed 's/^async //' \
         | sort | uniq -c | sort -rn                    # lane 5 (252.3's scan)
       ```

       - **Lane 1 — `scan:dead-style`: 0 dead on 0 pages, 1,433 live inline
         declarations**, screen + print, with 0 declarations dead on screen but
         live in print. Identical to 252.1's, 244.1's and 237.1's readings.
         *Trap re-hit and worth one line:* this lane needs `CHROME_PATH`
         exported in the same command (ENVIRONMENT 1c); its first run here died
         with the loud "No Chrome/Chromium found", which is the behaviour that
         rule wants, not a quiet skip.
       - **Lane 2 — `report:css-repeats`: zero delta, compared member for
         member rather than by count.** 74 source files · **242** rules with 3+
         declarations · **230** distinct bodies · **8** repeated — the same three
         totals as 252.1, and the same eight groups by their counts: x4
         joined-control radius (money ×2, quantity ×2), x3 list reset, x3
         visually-hidden and five x2 pairs. The x4 group is still **two
         components**, so its stated reopen trigger — a THIRD component — is
         unmet.
       - **Lane 3 — `report:prose`: zero unverdicted pages, checked by SET
         DIFFERENCE.** 118 documentation pages of 127 built · median **781** ·
         mean 937 · total **110,518** words. Ten over 2x the corpus median and
         five more over a family median; the union is **fifteen distinct pages**,
         and `comm -23 flagged verdicted` is **empty** — all 15 are inside the
         verdicted set, extracted from the archive rather than quoted.
         *(Corrected 2026-09-03 by the Objective grill, Slice 256 finding B.
         This said the set is "158.1's twelve, 161.1's three, 178.3's
         `/concepts/scale/`". The conclusion is unaffected — the union is
         **16** distinct pages and covers all 15 — but the archive passage it
         extracts from labels a **fifteen**-name list as "158.1's twelve",
         absorbing 161.1's `/base/motion/`, `/concepts/design-language/` and
         `/concepts/js-behaviors/` into 158.1 and then counting them again as
         "161.1's three", while dropping `/patterns/output-form/`, which 158.1
         did verdict. 158.1's own numbered list is exactly twelve.)* The grep-each-path
         instrument stays refused (228.1): it returns a non-zero count for 15 of
         15 whatever the truth is.
       - **Lane 4 — `report_loop_prose.py`: no file changed accumulate class,
         `ratchet` block read first.** `CLAUDE.md` **31 up, never cut** (30 at
         252.1, 29 at 244.1) and `DESIGN.md` **22 up, never cut** are 167.1's
         standing verdicts, and `CLAUDE.md`'s watch was executed and **retired**
         by 193.1, so neither is re-raised. Every file the loop reads every wake
         has a cut behind it except those two: `LOOPS.md` `6 up, last cut
         9198e43f`; `RESUME.md` `0 up, last cut 82d14bf` (2026-09-03).
         **The regrowth signal this lane carries is NOT actionable this wake**:
         `roadmap_scope.py` reads closed-history share **610 / 2,756 = 22.1%**,
         well under the **55.1%** at which 252.1 dispatched the tenth archive
         sweep three days ago. Of the four eligible targets `[254, 253, 252,
         237]`, two (253, 237) are named by the still-open Slice 249 (249.6,
         249.12) and left per 236.2; the remaining two are 254 and 252, both
         small. No sweep — the doctrine's recurring sweep fires on regrowth to
         scale, not on 22.1% days after a 13-slice move.
       - **Lane 5 — the divergence scan step 1 names (252.3's, which produced
         166.2/209.2/244.2): no hand-copied logic.** The scan's only two-count
         pairs are `function exists` and `function build`, both **false
         positives**: `exists` is 252.3's standing adjudication (different args,
         different workspaces — a file path vs a URL path), and `build` is new
         only because 252.3 consolidated `compatOf` away — its two definitions
         are `derive-introduced.mjs`'s `build()` (arity 0, reads a JSON record)
         and `build-component-css.mjs`'s `build(entrySource, from, to)` (arity 3,
         a PostCSS pipeline). Same name, opposite arity and body — the same
         suitability-not-collision verdict as `exists`. `compatOf` no longer
         appears; it lives in `bcd-compat.mjs` since 252.3.

       **Not verified, said plainly.** This is a cloud wake: no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. Nothing here rests on a rendered image — the diff is two
       markdown files (this slice and the loop log); no CSS, no docs page, no
       component changed, so there is nothing a screenshot could have shown.
       `npm run build -w @busy-office/ui`, `npm run test -w @busy-office/ui` and
       `npm run docs:build` (which runs `check:repo`, the page-shape gate and the
       readme-claims gate) all ran green in this container while producing the
       `dist/` the lanes read.

## Slice 254 — 249.16 built: the README screenshot, taken in the lane a cloud wake cannot reach — and the image that reads best is NOT the one the page shows (2026-09-03)

**Dispatcher trace, local session.** Rule 1: no open P0. Rules 2 and 3 clear
(`Standardize 2 / 4`, `Objective 1 / 3`). **Rule 4 dispatched Continue, build
mode — but not on the oldest item.** `249.5` is the oldest open, and the cloud
routine is dispatching the same queue on a schedule; it built `249.1`, `249.2`,
`249.3` and `249.4` while this session worked, and a collision on `249.5` was
the likely outcome. `249.15` and `249.16` are the two items the queue marks
**browser-blocked in the screenshot sense** — `LOOPS.md` rule 4's own
vocabulary, *a cloud wake cannot take it; a LOCAL wake can*. Taking one of
those is the dispatch that does not race. Verified before writing: `249.16`
still open on `origin/main` at commit time.

**The item said "one screenshot of `patterns/list-report` at
`data-density="compact"`". Taken literally, that is the wrong image**, and the
first capture proved it: a full-page shot at 1440 is a picture of the *docs
site* — sidebar, version picker, on-this-page rail — not of the framework. A
README hero for a CSS framework has to show what the framework BUILDS.

Two further corrections, each caught by measuring rather than by looking:

- **Forcing `data-density="compact"` onto `documentElement` was unnecessary and
  wrong.** The first demo region already renders at compact natively
  (`section.demo [data-density="compact"]`), so the override was restyling the
  docs chrome as well and changing the thing being photographed.
- **The obvious selector was a 30px box with zero rows.** The first
  `[data-density="compact"]` match is a toolbar, not the screen —
  `measure the box that carries the constraint`, landing again. The container
  that actually holds the table is `.bo-data-table-container` (14 rows,
  928×384), and the *screen* is that plus two `form.bo-cluster` siblings, with
  no single wrapper element — so the shot is a computed clip across the demo
  section's children, excluding its `<h2>` and its trailing caption.

**The bottom row was sliced mid-row** on the first clean attempt — honest,
since the container really is a 384px scroll region against a 492px table, but
in a static image it reads as a cropping mistake. The clip now ends at the
bottom of the last row **fully inside** the container (9 of 14 rows), computed
rather than eyeballed.

**Resolution was a measured trade, not a default.** At `deviceScaleFactor: 2`
the PNG is **216 kB**; the package tarball is **364.0 kB**, so a retina asset
is **+59%** on a package whose own README advertises *93 kB minified*. At 1x
(952×516) it is **88.9 kB**, **+23.4%** — tarball `364.0 kB → 449.3 kB`, files
`183 → 184`. 1x chosen, and the number is written here so raising it later is
an argued change rather than a silent one.

**The two READMEs reference the image differently, on purpose.** The root
README uses a repo-relative path, which is what GitHub renders. The package
README uses an absolute `raw.githubusercontent.com` URL, because a
registry-rendered README cannot be assumed to resolve a relative path — and
the first draft cited `busy-office.github.io/.../media/...`, a URL nothing had
published, which is exactly roadmap 185's trap (asserting an artifact at a
location that has not served it). The file **also** ships in the tarball, so
the package README's claim that it does is true independently of the URL.

1. [x] **249.16 — DONE.** Accept met, each half checked rather than assumed:
       both READMEs carry ≥1 image (`grep -c '!\['` → 1 and 1); the referenced
       file exists in the repo; `npm pack --dry-run` lists
       `media/list-report-compact.png` at 88.9 kB inside the tarball (`media`
       added to `packages/core/package.json`'s `files`); `stamp-readme --check`
       exits **0** and still reports size/behaviors/events/floor/gates/notfor/faq
       matching their sources on both files.

       **One half of the Accept is deliberately NOT closed by this wake, and
       saying so beats implying it.** The criterion names `npm view` as the
       authority on what shipped (roadmap 185). Publishing is owner-triggered,
       so nothing is published from here — `npm pack --dry-run` is the correct
       *pre*-publish evidence and is what is recorded. The registry half is
       verifiable only at the next publish, and the raw-GitHub URL in the
       package README likewise resolves only once this commit is on `main`.
       Both are named as open verifications rather than counted as done.

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

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and the three open slices
are 15 (owner-hardware AT evidence), 112 (owner briefs) and 249 (the triaged
adoption proposal). Nothing new to triage, so Step 1 committed nothing. Rule 2
fired: `dispatch_status.py` read `Standardize 4 / 4 Continue rounds OVERDUE`.
Rules 3-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports it **STALE**
(1 wake-date of loop activity newer than the newest comparable pair, itself
`axe-violations`). Per LOOPS.md's own instruction this rule **could not be
evaluated** this wake — it is not being reported clear. This wake records a
fresh `axe-violations` sample so the next one has a live pair.

1. [x] **252.1 — DONE 2026-09-03. All four standing lanes clean; the finding
       came from lane 4, and it is the archive sweep `RESUME.md` had already
       flagged as "a real signal, not yet acted on".**

       ```
       npm run scan:dead-style -w docs                 # lane 1 of 4
       npm run report:css-repeats -w @busy-office/ui   # lane 2 of 4
       npm run report:prose -w docs                    # lane 3 of 4
       python3 scripts/loops/report_loop_prose.py      # lane 4 of 4
       ```

       - **Lane 1 — `scan:dead-style`: 0 dead on 0 pages, 1,433 live inline
         declarations**, screen + print, with 0 declarations dead on screen but
         live in print. Identical to 244.1's and 237.1's readings.
         *Trap re-hit and worth one line:* this lane needs `CHROME_PATH`
         exported in the same command (ENVIRONMENT 1c). Its first run here died
         with "No Chrome/Chromium found" — a **loud** failure, which is the
         behaviour that rule wants, not a quiet skip.
       - **Lane 2 — `report:css-repeats`: zero delta, compared member for
         member rather than by count.** 74 source files · **242** rules with 3+
         declarations · **230** distinct bodies · **8** repeated — the same
         three totals as 244.1 and 237.1, and the same eight groups by their
         named selectors: x4 joined-control radius (money ×2, quantity ×2), x3
         list reset (approval-workflow, sidebar-nav, tree), x3 visually-hidden
         (sidebar-nav, stepper, primitives) and the five x2 pairs. The x4 group
         is still **two components**, so its stated reopen trigger — a THIRD
         component — is unmet.
       - **Lane 3 — `report:prose`: zero unverdicted pages, checked by SET
         MEMBERSHIP.** 118 documentation pages of 127 built · median **748** ·
         total **105,963** words. Nine over 2x the corpus median and twelve over
         a family median; the union is **fourteen distinct pages**, and **14 of
         14 are inside the verdicted set** — 158.1's twelve, 161.1's three and
         178.3's `/concepts/scale/`.

         *This was checked by set membership, not inherited from 244.1's
         identical-looking numbers.* Four docs pages have changed since Slice
         244 (`git log --name-only <244>..HEAD -- apps/docs/src/pages`), so
         equal totals do not prove an equal SET, and the verdicted list was
         re-extracted from the archive rather than quoted:

         ```
         awk 'NR>=17533 && NR<=17740' ROADMAP-archive.md \
           | grep -oE '/(components|patterns|concepts|base|getting-started|reference)/[a-z0-9-]+/' | sort -u
         ```

         The obvious instrument here stays refused: 228.1 recorded that grepping
         each page path out of `ROADMAP.md` + the archive returns hits for all
         fourteen whatever the truth is, and re-running it here reproduces that
         — a **non-zero count for 14 of 14**, which is why it decides nothing.
       - **Lane 4 — `report_loop_prose.py`: no file changed accumulate class,
         `ratchet` block read first.** `CLAUDE.md` **30 up, never cut** (29 at
         244.1) and `DESIGN.md` **22 up, never cut** are 167.1's standing
         verdicts, and `CLAUDE.md`'s watch was executed and **retired** by
         193.1, so neither is re-raised. `LOOPS.md` `6 up, last cut 9198e43f`;
         `RESUME.md` `0 up, last cut 0a5bde3a`. Every file the loop reads every
         wake has a cut behind it except the two 167.1 adjudicated.
         **The finding is `ROADMAP.md`'s regrowth**, which is what this lane
         carries: `roadmap_scope.py` read closed-history share
         **2,087 / 3,790 = 55.1%**, 14 eligible targets.

2. [x] **252.2 — DONE 2026-09-03. The tenth archive sweep: 13 closed slices
       moved verbatim, `ROADMAP.md` 3,790 → 1,917 lines at the move, and one
       eligible target refused because an open item's Accept names it.**

       Slices **251** (51 lines), **250** (28), **248** (73), **247** (99),
       **246** (138), **245** (144), **244** (257), **243** (166), **242**
       (214), **241** (212), **240** (156), **239** (168) and **238** (219)
       moved, in the order they held in the live file, each leaving the
       standard heading + one pointer line.

       **Slice 237 was NOT moved**, and that is 236.2's rule executing rather
       than a judgement call: `roadmap_scope.py`'s dependency line names it as
       *"named by the open item at Slice 249"* — `249.12`, the archival-trigger
       question, whose Accept is about Slice 237's own text. Slice 249 itself is
       open and stays. Closed-history share **55.1% → 9.1%** (175 / 1,917).

       *Two different line figures, both true, kept apart because ENVIRONMENT's
       "read a commit's figure from that commit" bullet was broken twice by
       exactly this conflation:* the **move** took `ROADMAP.md` 3,790 → **1,917**;
       this **commit** carries 3,790 → **2,117**, because writing this slice back
       is the rest. `ROADMAP-archive.md` 32,443 → **34,368**. All four read from
       the index (`git show :<file> | wc -l`) and `HEAD`, never from the tree.

       **Verification is a second, independently written parser**, and it reads
       the PRE-MOVE source (`git show HEAD:ROADMAP.md`) rather than the mover's
       memory, splitting on `^## ` boundaries where the mover indexed lines. Per
       slice it asserts: the block appears **exactly once** in the archive
       verbatim, its interior is **absent** from the live file, and the live
       file carries heading + pointer. It also asserts Slices 249 and 237 are
       still intact live.

       **Both arms red-proved by injection, with the injection confirmed to have
       landed** — CLAUDE.md's rule that a green red-proof is a defect in the
       injection until proven otherwise:

       - *Archive arm.* One interior line of Slice 244's archived block was
         mutated. Confirmed landed by counting the block in the archive
         **1 → 0** and the marker present in the file; verifier went red
         (`archive holds the block 0 time(s), expected 1`), exit 1.
       - *Removal arm.* Slice 239's interior was appended back into the live
         file. Confirmed landed by reading the property before/after
         (`False → True`); verifier went red (`block interior STILL present in
         the live file`), exit 1.

       Restored both times, verifier back to exit 0.

       **`check:slice-refs` 709 → 722, and the +13 reconciles exactly.** A swept
       slice number heads a section in **both** files, so each earns one extra
       uniqueness check — thirteen slices, thirteen checks. Cited citations hold
       at 262 and the known-dangling baseline at 2; live slice sections stay
       **233**, because a pointer stub keeps its heading. Both figures were read
       by running the gate at `HEAD` (via `git stash`) and on the swept tree,
       not derived.

       *The committed tree reads **723 / 234**, one more of each*, and that is
       this slice's own heading arriving — the same +1-per-new-section arithmetic,
       applied to a section that heads only the live file. Stated separately
       because 709 → 722 describes the SWEEP and 709 → 723 describes the COMMIT,
       and quoting either for the other is the conflation the line-count note
       above is also about.

3. [x] **252.3 — DONE 2026-09-03. Lane 5 — the divergence scan step 1 names and
       no instrument covers — found `compatOf` hand-copied into both floor
       scripts. Consolidated into `packages/core/scripts/bcd-compat.mjs`.**

       Same lane that produced 166.2, 209.2 and 244.2. The scan:

       ```
       grep -rhoE '^(async )?function\*? [a-zA-Z0-9_]+' \
         packages/core/scripts apps/docs/scripts scripts/loops \
         --include=*.mjs --include=*.py | sed 's/^async //' | sort | uniq -c | sort -rn
       #   2 function exists      -> NOT a duplicate: different args, different
       #                             workspaces (a file path vs a URL path)
       #   2 function compatOf    -> the finding, both in packages/core/scripts
       ```

       **Diverged, not byte-identical**, which is why it survived: `derive-floor`
       threw inside the walk at the first missing key, `check-rf-floor` after
       the loop. The two produce the **same message about the same full path**
       — only the script-name prefix differs — so this was two spellings of one
       rule, not two rules.

       **Why two copies earned a module when two copies usually do not.**
       `check-rf-floor.mjs`'s own header records this exact cost, paid in this
       exact file: its `--self-test` *"used its own copy of the walk logic and
       happened not to exercise this exact call, so it stayed green while the
       real gate was inert"* — against a build with an unguarded `color-mix()`
       injected straight into it. Its stated conclusion is *"Sharing one
       function is what makes a bug in it show up in --self-test too"*. The
       argument for the module is written by the file that learned it.

       What is NOT folded: the two scripts stay deliberately opposite in
       technique (derive-floor asks what floor the CSS supports; check-rf-floor
       asks whether it ever requires more, unguarded). Only the dictionary
       lookup both do identically is shared, and `who` is threaded through so
       each still names itself in the error.

       **Verified behaviour-neutral, on a truly clean `dist/`** (`rm -rf
       packages/core/dist`, per the Continue playbook's build-ordering rule):
       `dist/floor.json` is **byte-identical** across the refactor, 4,843 bytes,
       `diff` empty — and it is a generated artefact of the very function that
       moved. `check:rf-floor` passes and its `--self-test` passes.

       **Red-proved by injection at BOTH call sites**, injections confirmed
       landed before believing either result. `['css','selectors','has']` was
       replaced with a non-existent key in each script; each threw from the
       shared module carrying **its own label** —
       `derive-floor: no BCD entry at css.selectors.ZZNOSUCHKEYZZ` and
       `check-rf-floor: no BCD entry at css.selectors.ZZNOSUCHKEYZZ`. Both files
       restored, marker count back to 0.

**Not verified, said plainly.** This is a cloud wake: there is no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
Nothing here rests on a rendered image — the diff is two markdown files plus
three build-time Node scripts, none of which the docs site renders, and the one
behavioural claim (`floor.json` unchanged) is a byte comparison. All **17** CI
entry points, re-derived from `ci.yml` rather than read off `ENVIRONMENT.md`'s
snapshot, ran green in this container: `test:axe` 127 pages × 2 widths zero
violations, `check:layout` 127 pages, `check:scroll` 912 containers across 118
pages × 2 widths, `suite` 28 screens × 2 widths, `check:po-app` 19 behaviours,
`check:quickstart`, `check:pseudo` 14 pages, 152 unit tests.
`check:claims` reads **162 verified live / 3 NOT VERIFIED**, which is
ENVIRONMENT 6b's container property (`(hover: hover) and (pointer: fine)` is
false in headless Chrome) and not a regression.

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

