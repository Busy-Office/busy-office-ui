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

## Slice 227 — Polish round 1 on `component/icon`: a stale count that was also a DIVISOR (2026-08-30)

Dispatcher rule 6, cloud wake. Rules 1-5 were each answered by measurement and
none matched — the readings are in the write-up below. Rule 6 re-queued **8**
surfaces; `inline-editing` drops out for 217.1's stated reason (no
`dsa-scores.json` entry — 176.2's false gap), leaving seven, all `content: 3`,
so neither the score (171.1) nor the ledger's "fewest rounds" tie-break
discriminates. Picked on 216.1's discriminator, source movement since each
surface's own `scored` date, with 217.1's `+08:00` day boundary applied:

```
# scored dates read from dsa-scores.json, NOT assumed
alert       1 commit   +71/-5      calendar   2  +18/-2     dashboard  0  +0/-0
icon        4 commits +113/-2  <-  scan       1   +1/-1     stepper    2  +42/-0
tree-table  1 commit  +20/-12
```

**`dashboard` reading 0/0 was checked before the pick, not after** — a zero is a
defect until proven otherwise, and `polish_requeue.py` had just said its source
moved. Both are right: its last touch is `e034a6eb` (2026-08-23), *earlier the
same day* than the boundary commit, while the ledger's recorded `src` predates
it. `git log` on its two paths since the base returns empty.

1. [x] **227.1 — DONE. `icon · fit` cited "12 ERP glyphs"; the framework ships
       26, and the same 12 was hard-coded as the DIVISOR of a published size
       projection.**

       *Accept* — properties, never predicted values:
       - The `fit` cite agrees with what the shipped stylesheet contains, and
         states a property rather than a count that can decay.
       - Any glyph count the docs publish is derived from the shipped artifact
         at build time and demonstrably tracks it.
       - Every claim standing beside a corrected number is re-checked against
         the corrected number, not carried over.
       - Verified in the BUILT html; the other five cites reconciled or the
         disagreement recorded.

       **The finding, and it is a class this ledger had not seen.** `fit` read
       *"12 ERP glyphs proving a mechanism, not a catalogue; 4 are deprecated"*.
       Walking all ten revisions of `icon.css` dates the decay exactly:

       ```
       a05ac84c 2026-08-15  12      43ea922a 2026-08-24  23   <- 137.1 toolbar set
       7845c78e 2026-08-21  12      27f6d8c6 2026-08-24  24
                                    97980615 2026-08-24  24
       "scored": "2026-08-23"       9d1ecbe2 2026-08-27  26   <- row-edit
       ```

       So `12` was **exact on the day it was scored** and wrong the next day —
       217.2's class, not 216.1's. What makes it a third class: sidebar-nav and
       breadcrumb were falsified by changes in a *different* tree (po-app, the
       pattern corpus), and this one was falsified **inside the very file the
       cite describes**. It is the catchable one, and nobody caught it for six
       days. `4 are deprecated` still holds (4 `DEPRECATED` blocks, 4 of 4
       naming the replacement).

       **What the cite was concealing is the real defect.** The same stale 12
       sat in `icon.astro`'s frontmatter as `const glyphCount = 12`, dividing a
       byte count read live from the shipped stylesheet:

       ```
       iconBytes 9109 (26 glyphs)   totalBytes 95046
       catalogueKb = round(iconBytes / glyphCount * 200 / 1024)
         /12  -> 148 kB   <- PUBLISHED
         /26  ->  68 kB   <- the shipped per-glyph rate
       marginal rate (glyph rules only, 8514 B / 26) -> 64 kB; fixed overhead 595 B
       ```

       The page told readers a 200-icon catalogue would cost **148 kB**. The
       shipped rate says **68**. It is not a stray figure: it is the published
       arithmetic behind roadmap 40.1's refusal of an icon catalogue, so the
       framework was **overstating the case for its own decision by 2.17x**.

       **The comment three lines above it is what makes this worth recording.**
       It already said the size argument is *"computed from the shipped artifact
       — the hand-typed 10.3% had drifted to a real 6.0% before anyone noticed
       (2026-08-21 sweep). Same projection, live numbers."* That fix made the
       **numerator** live and left the **denominator** hand-typed. A block whose
       own comment warns about this exact decay decayed the same way, one line
       down, and the surviving hand-typed number was the more dangerous of the
       two — a wrong share misinforms, a wrong divisor scales.

       **The claim standing BESIDE the number failed too, which is 192.1's rule
       arriving on cue.** The sentence read *"roughly 148 kB — more than
       everything else we ship"*. Everything-but-icons is 85,937 B = **83.9 kB**,
       so the comparison was true at 148 and **false at the corrected 68**.
       Correcting the number alone would have shipped a fresh falsehood. It now
       states two live quantities and draws no adjective from them: *"two hundred
       would add roughly {catalogueKb} kB, against a whole framework that is
       {totalKb} kB"*.

       **The fix derives the denominator from the SAME READ as the numerator**,
       so the two cannot drift apart again — `new Set(iconCss.match(...))`,
       reconciled against three independent sources that all say 26 (regex over
       the min CSS, `grep -cE '^\s*\.bo-icon--'` on source, `api.json`'s
       `components.icon.variants`).

       **Red-proved by injection, and the injection was confirmed twice.**
       Appending a 27th glyph rule to the min CSS the page resolves, then
       rebuilding: the file showed the rule, and the **rendered** page moved
       `26 -> 27` and `9.6% -> 9.7%`. The hard-coded `12` could not have moved
       at all. Reverted by rebuilding core; `grep -rc redproof` over both dists
       returns nothing.

       **Verified against the RENDERED artefact.** In `apps/docs/dist`:
       `these twelve`, `The twelve glyphs`, `twelve ERP glyphs`,
       `Deliberately 12 glyphs`, `12 ERP glyphs`, `right twelve glyphs` and
       `any of these four` → **0 files each**; the corrected sentence renders
       *"the 26 glyphs shipped today are 9.6% … roughly 68 kB, against a whole
       framework that is 93 kB"*. `12 glyphs here` survives in **4 dist files**,
       all of them the unminified shipped CSS carrying **this slice's own
       quotation** of what it removed — checked structurally (it sits inside the
       `NO FIGURES HERE` paragraph), which is exactly the "assertion tripped on
       its own explanation" trap CLAUDE.md names.

       **Every live copy fixed, per the 217.2/220.1 rule — remove the quantity,
       do not refresh it.** `icon.css` ×2 (shipped to consumers in the npm
       package), `icon.astro` ×4 plus the hard-coded deprecated badge, the
       deprecated caption's "these four", `DESIGN.md`'s refusal row, and
       `app-launch.astro`'s rhetorical "the right twelve glyphs". Historical
       records — `ROADMAP-archive.md`, `.roundtable/` reports, `loop-log.md` —
       are left untouched: they are quotations of what was true when written.

       **The other five cites reconciled**, four clean and one corrected:
       `typography` (`inline-size`/`block-size: 1em`, 1 each), `spacing`
       (`vertical-align: -0.125em`, 1, with its own explanation), `interaction:
       na` (**0 of 33** names in `behaviors.json` match `/icon/i` — the
       denominator re-derived rather than read off `Object.keys`, 220.1's
       instrument trap), and `content` (the clause is on the page verbatim,
       matched newline-tolerantly to avoid the position-filter trap). `colour`
       was **narrowed**: it said the `%23000` is "SVG stroke", and `--settings`
       also uses `fill='%23000'` (29 occurrences over 26 glyphs). The
       load-bearing half — never painted, it is under a mask — holds; zero raw
       hex literals outside the data URIs.

       **The score does not move and no blind re-score is owed.** `fit: 3` was
       and remains right — one custom property carrying every glyph is *stronger*
       mechanism evidence than a count of how many shipped. `scored` stays
       **2026-08-23**; moving it would claim the independent second opinion §3b
       step 4 requires, which this wake could not run (no second agent).
       `rounds` moves 1→2 because the round changed the published artefact,
       per 182.1's precedent.

       **Not verified, said plainly:** this wake is a cloud wake — no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not
       run. Nothing here rests on a rendered image: every change is prose or a
       computed number, and the numbers were read out of the built HTML and out
       of the DOM after injection. `check:layout` (127 pages, 390 + 150% zoom)
       and `test:axe` (127 × 2 widths) are the whole-tree evidence that the page
       did not break.

2. [x] **227.2 — REFUSED: a gate for the hard-coded-divisor class, on the
       base-rate measurement the item itself asked for.** Opened by 227.1's
       round and recorded for whoever decides; decided here. 101.3's stop rule forbids Polish
       adding gates, and this is a *third* refusal in the same family (216.2,
       217.2, 220.2) — but it is a different predicate from those, and the
       measurement is worth keeping rather than re-deriving.

       Those three were about a **cite** decaying. This is about a **literal
       used in arithmetic whose operands come from a live read** — checkable in
       a way a cite is not, because the failure has a shape: a hand-typed
       constant combined with a value read from `dist/`. Base rate not measured;
       measuring it is step one, and if it is 1-of-1 this is 94.11 ceremony and
       should be refused a fourth time. Left OPEN with no owner block: any wake
       can take it, and the honest first outcome is a base-rate count that
       refuses it.

       **REFUSED, fourth in the family — the base rate is 0 live instances, and
       the predicate cannot be written without semantics (2026-08-30, cloud
       wake).** The item asked for exactly this measurement, so a refusal here
       is the item being satisfied, not abandoned.

       *The sweep.* Every file performing a live read of a generated or shipped
       artifact — `readFileSync` / `statSync` / `gzipSync` / `require.resolve` /
       `import.meta.glob` / an import of a generated `*.json` — is **30 files**.
       Restricted to build-time code (Astro frontmatter between the `---`
       fences; whole file for `.mjs`/`.ts`) on lines that also carry a
       live-derived identifier, they hold **50** numeric literals in an
       arithmetic or comparison context. The probe is in the wake's scratchpad;
       it deliberately over-reports (the unrestricted form returns 308, mostly
       CSS values and prose) because the question being asked is *is this signal
       present in things I am not counting?*

       *The classification.* All 50 fall into five kinds, and **none of them is
       the defect class**:

       | kind | example | can it decay? |
       |---|---|---|
       | unit conversion | `/ 1024`, `* 100` | no — definitional |
       | loud assertion / floor | `if (knobs.length < 4) throw` | no — it FAILS the build |
       | scoring band | `bytes>3000?3 : bytes>1500?2` | no — it defines the scale, mirrors nothing |
       | stated hypothesis | `* 200` ("a 200-icon catalogue") | no — a premise, not a fact |
       | scale with no live counterpart | `possible += 3` (rubric max) | nothing to drift from |

       The largest kind that matters is the **second**: 12 sites already
       hand-type a literal against a live read *as an assertion that fails
       loudly*. That is the correct handling of this class and the repo already
       does it — `primitives.astro:24`, `tokens.astro:81`,
       `ai-assistants.astro:30`, `palettes.astro`, `semantic-css.ts`. A gate
       would have to not-fire on all of them.

       *Why no gate can be written.* The predicate would have to separate a
       hand-typed **fact that mirrors a live source** from a unit constant, a
       hypothesis, and a scoring band — sitting in identical syntax. That is
       94.11's exact finding one level up: *"a comment precedes this literal" is
       checkable; "a comment explains this literal" is semantic.* Here: "a
       literal is an operand" is checkable; "a literal duplicates a fact
       something else can read" is not. And the one instance the class has ever
       had — `icon.astro`'s `12` — is **fixed**, so a gate ships firing on zero
       things, which is the ceremony 94.11 refuses. The **family** is real and
       recurring (4 in-tree comments record a hand-typed number that drifted:
       `icon.astro` 10.3%, `palettes.astro` 35, `stamp-readme.mjs` 55%,
       `scale.astro` 70 kB/11 kB) — but its standing answer, *make it live*, is
       already applied at every current site.

3. [x] **227.3 — the defect the base-rate sweep found: 227.1 made the divisor
       LIVE and left it UNASSERTED, and a parse failure publishes
       "Infinity kB".** Filed and fixed inside 227.2's measurement, because it
       is the same published number and the same page.

       `icon.astro` computes `catalogueKb` by dividing by `glyphCount`, which
       227.1 correctly changed from a hand-typed `12` to
       `new Set(iconCss.match(/\.bo-icon--[a-z0-9-]+/g) ?? []).size`. The `?? []`
       makes a total parse failure **silent**: rename the glyph selectors and
       the Set is empty, `iconBytes / 0` is `Infinity`, and the page publishes
       *"Infinity kB"* with nothing failing. **Measured, not reasoned** — the
       expression was run against a stylesheet carrying no modifiers:
       `glyphCount = 0`, `catalogueKb = Infinity`, and `iconShare` stays
       plausible at 3.3%, so the page looks half-right.

       This is the *same shape one step on* from what 227.1 fixed, and 227.1's
       own text names the pattern it then repeated: the earlier fix "made the
       numerator live and left the denominator hand-typed"; this one made the
       denominator live and left it unasserted. It is also the one site that
       breaks the repo's own precedent — **5 of 8** build-time parse pages throw
       on a bad parse, and of the three that do not, `scale.astro` divides *into*
       a live value (a zero is impossible) and `cascade.astro` renders an empty
       table rather than a wrong number. `icon.astro` was the only site dividing
       BY a live-parsed count with no assertion.

       *Accept*: (a) a bad parse of the glyph set fails the build instead of
       publishing a number, red-proved by injection with the injection confirmed
       to have landed; (b) the guard introduces **no** hand-typed count — a
       literal floor would be the very decaying constant 227.1 removed.

       *Accept (a)* — met. The count is reconciled against `api.json`, which
       `extract-api.mjs` derives from the **source** CSS while this regex reads
       the **shipped min** CSS: two independent derivations of one fact, so a
       partial parse is caught as well as an empty one. They agree exactly today
       — 26 and 26, identical sets, `only-in-parsed: []`, `only-in-api: []`.
       Red-proof: the regex was edited to `\.bo-iconZZZ--`, the injection
       confirmed present in the file (**1** occurrence) *before* the build, and
       `npm run docs:build` exited **1** on `/components/icon/index.html` with
       `icon: parsed 0 glyph modifiers from the shipped min CSS, but api.json
       declares 26`. Reverted; `ZZZ` appears **0** times in the source.

       *Accept (b)* — met. The guard is `glyphCount !== api.components.icon.
       variants.length`. No numeric literal is introduced, so there is nothing
       here for a later wake to have to re-verify.

       **Not verified, said plainly:** cloud wake — no Podman, no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. Nothing here rests on a rendered image: the change is a
       build-time assertion plus a comment, the rendered page is byte-unchanged
       when the parse succeeds, and that was confirmed by diffing the built
       `/components/icon/index.html` against its pre-change build.

## Slice 226 — the fixed `check:po-app`, run in a cloud container for the first time (2026-08-30)

Triaged from `.roundtable/RESUME.md`'s `## Direction` block, which named this as
*"one real follow-up, not urgent, named rather than filed"*. **Filing it is what
makes it dispatchable**: rule 4 reads `ROADMAP.md`, so a follow-up living only in
the hand-off is invisible to the dispatcher — and the hand-off is rewritten
wholesale every wake, which is 169.3's whole finding.

1. [x] **226.1 — run `npm run check:po-app -w docs` in a cloud container, and
       make `ENVIRONMENT.md`'s entry agree with what that run reports.**
       222.1 rewrote `check-po-app.mjs` to perform the real tarball-consumer
       install itself (wipe `node_modules`/lockfile/tgz + `npm pack -w
       @busy-office/ui` + `npm install --omit=dev`) instead of relying on
       monorepo hoisting. That install needs the **public npm registry at
       gate-run time**, not merely at container-start `npm ci` — a network
       path no cloud wake has exercised for this gate. Both `ENVIRONMENT.md`
       and the hand-off say outright that this is an inference, not a
       measurement, and ask the next cloud wake to take it.

       *Accept*: (a) the gate is run in this container and its exit status
       plus assertion count are recorded here verbatim, not paraphrased;
       (b) `ENVIRONMENT.md`'s po-app bullet states what that run actually
       reported — passing, the bullet leaves the "two CI commands are NOT in
       that list" exceptions block and stops carrying a caveat it no longer
       needs; failing, the bullet names the failure mode and the gate stays
       listed with the reason. **Finding the gate broken here satisfies this
       item**, it does not derail it: the deliverable is a file that agrees
       with a measurement, not a confirmation that it passes.

       **Result: it passes here, and the interesting part is WHY it passes.**
       Two consecutive runs, verbatim output both times:

       ```
       export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
       npm run check:po-app -w docs
       # > node scripts/check-po-app.mjs
       # po-app smoke check passed — 19 behaviours verified end to end
       # EXIT=0
       ```

       A green gate on its own would be weak evidence: it is consistent both
       with "the new install works" and with "this container happened to hoist
       `htmx.org` to root, so the OLD path would have worked too" — the second
       being exactly the hoisting luck 222.1 removed. **The precondition was
       measured rather than assumed, and it still reproduces here:**

       | probe | reading |
       |---|---|
       | `ls -d node_modules/htmx.org` | `No such file or directory` |
       | `ls -d apps/docs/node_modules/htmx.org` | exists — still nested, never hoisted |
       | `ls examples/po-app/node_modules` | `@busy-office` `htmx.org` — the gate's own install |
       | `node -e "…examples/po-app/node_modules/htmx.org/package.json').version"` | `4.0.0` |

       So the missing hoist that turned `main` red is as absent in a cloud
       container as it was on CI, and the gate passes anyway because its own
       `npm pack -w @busy-office/ui` + `npm install --omit=dev` reached the
       public registry **at gate-run time**. That was the whole open inference;
       it is now a direct reading. `chunk0Reloaded` did not reappear on either
       run, consistent with 222.1's answer that the residual was environmental.

       *Accept (a)* — met: exit status and the 19-behaviour count are recorded
       verbatim above, from this container.
       *Accept (b)* — met: `ENVIRONMENT.md`'s po-app bullet is gone from the
       "**One** CI command is NOT in that list" block (it read "Two"), and
       `npm run check:po-app -w docs` now sits in the runnable cloud-toolchain
       list with the reason it works. The general lesson the old bullet carried
       — a browser-driven gate reporting a *downstream* symptom of egress
       restriction, indistinguishable from an app defect without reading the
       page console — was **moved, not deleted**, into that file's "Traps worth
       carrying forward" section, because it outlives this specific trap.

       **One number that changed underneath this edit, flagged because it is
       the tidy-number trap.** `ENVIRONMENT.md` carried *"the re-derivation
       prints 17; this list names 16"*. Adding `check:po-app` makes the list
       17 as well — and the two 17s do **not** mean the sets now match. Two
       entries differ in opposite directions and cancel: `check:ci-ignores` is
       in `ci.yml` and not in the list (it is a sub-check of `check:repo`, run
       by `docs:build`), and `npm run test -w @busy-office/ui` is in the list
       and not in the grep (`ci.yml` spells it `npx vitest run --root
       packages/core`). Re-derived today, not quoted:
       `grep -oE 'npm run [A-Za-z0-9:@/._-]+( -w [A-Za-z0-9@/._-]+)?' .github/workflows/ci.yml | sort -u | wc -l`
       → **17**. The file now says outright not to read the two as a match.

       **What this item did NOT verify**, since a green run invites the wider
       claim: it is one gate in one container on one date. It says nothing
       about whether the registry is reachable at gate-run time under a
       *different* network policy, and nothing about the Podman/screenshot
       lane, which remains unavailable to a cloud wake and untouched here.

## Slice 225 — Objective grill of Slices 218, 219, 223, 224: a citation that quoted its own re-run command into permanence, and everything else held (2026-08-30)

`dispatch_status.py` read `Objective 5/3 OVERDUE [211, 218, 219, 223, 224]` at
Step 0. **Arming set narrowed before grilling it**, per this playbook's own
step 0: `grep -hoE '^## Slice [0-9]+ — Objective grill of Slices …'` shows
Slice 215 already grilled 211 (with 213, 214). Genuinely un-grilled: **218,
219, 223, 224** — the four this entry covers.

1. [x] **225.1 — re-derive every load-bearing count in 218, 219, 223 and 224
       independently, not read off the page.** Every command re-run fresh on
       today's tree, not quoted from the item that first ran it.

       **One real finding, in 218.1's own citation.** Its refusal argument
       cites `grep -rn data-status packages/core/src apps/docs/src` → 0 as
       what a reader should re-run "before arguing with it." Re-run today:
       **7**, not 2. Not a regression in the decision — a self-inflicted trap
       in how the decision was recorded. 218.1's own comment, committed into
       `approval-workflow.css` (which lives in `packages/core/src`), mentions
       the bare string `data-status` five times while explaining why it is
       refused as a styled hook — so the citation started quoting a command
       that matches its own explanation the moment it was written, the exact
       shape CLAUDE.md's *"verify a removal against the parsed form, never
       raw text"* rule already names, landing here as *"verify an absence
       against a selector, never raw text that can quote itself."*

       **The substantive claim survives**: no CSS rule anywhere in
       `packages/core/src` selects on `[data-status`, confirmed today with
       the anchored form (`grep -rn '\[data-status' packages/core/src` → 0,
       comments included in the scan and still zero — the comment writes the
       bare word, never the bracket). **Fixed**: the citation now asserts the
       selector form, which cannot self-match by construction — the comment
       arguing against a `data-status` selector cannot itself contain one.

       **Everything else re-derived clean, no counter-evidence found**:

       | slice | claim | re-run today | held? |
       |---|---|---|---|
       | 218.1 | 40 component dirs (not "~60") | `find packages/core/src/css/components -mindepth 1 -maxdepth 1 -type d \| wc -l` → 40 | yes |
       | 218.1 | 7 files mention `data-state` | `grep -rl data-state packages/core/src/css/components/` → 7 | yes |
       | 219.1 | 8 rendered current steps, all paired | `npm run suite:build` → *"8 rendered current timeline step(s) all paired"* | yes |
       | 223 | 0 remaining "discards non-2xx" htmx claims | `grep -rl discards apps/docs/src --include=*.astro` → 2 hits, both unrelated (icon mask, palette dedup) | yes |
       | 224.1 | still exactly 8 css-repeats groups | `report:css-repeats` → *"242 rule(s)… 8 body(ies) appearing more than once"* | yes, unchanged by this grill's own edit to `approval-workflow.css` (comment-only) |
       | all | `vitest` still 152/152 after this grill's edit | re-run | yes |

       **Evidence gate**: every row above is now attested by ≥2 independent
       readings — the original item's own measurement plus this grill's
       fresh re-run — so each is `Evidence`, not `Hypothesis`. No
       counter-evidence surfaced against any claim except the one named
       above, which is a citation defect, not a wrong decision.

       *Accept was implicit in the playbook's own step 2* — a conclusion
       needs ≥2 independent sources, every claim carries counter-evidence —
       **met**, table above.

## Slice 224 — Standardize sweep: three of four lanes clean, and the fourth found a stale trap in the file Step 0 reads every wake (2026-08-30)

`dispatch_status.py` read `Standardize 4/4 OVERDUE` at Step 0, ahead of
Objective (`4/3 OVERDUE [211, 218, 219, 223]`) per rule order — a counter
above a counter, oldest-armed-first is not the tiebreak here, rule 2 simply
sits above rule 3.

1. [x] **224.1 — lanes 1-3, clean, no delta from the standing verdicts.**
       Lane 1 (`scan:dead-style`): 0 dead declarations, 1,433 live. Lane 2
       (`report:css-repeats`): 74 source files, 242 rules (was 237), 230
       distinct bodies (was 225), **still exactly 8 repeat groups**, same
       eight members LOOPS.md's standing table names — file/rule counts grew,
       the repeat-group count and membership did not. Lane 3
       (`report:prose`): 9 pages over 2x the corpus median, 5 more over their
       family median — every one of the 14 already carries a verdict (158.1's
       twelve, 161.1's three family-split additions, 178.3's `/concepts/scale`
       verdict). A clean round on all three is the documented expected
       result, not a null finding.

2. [x] **224.2 — lane 4 found two loop-machinery files with no individual
       HONEST/INSTRUMENT verdict, and one of them was carrying a stale trap
       description.** `report_loop_prose.py` names 8 dispatcher-region files;
       167.1 (2026-08-28) verdicted five of them. `.roundtable/ENVIRONMENT.md`
       (born 169.3, same day) and `LOOPS-archive.md` (born 167.2, same day)
       postdate that verdict set and had never individually received one.

       **`ENVIRONMENT.md` — HONEST, and reading it in full to give that
       verdict is what surfaced the actual finding.** Its `check:po-app`
       section (the cloud-toolchain entry-point list) still described the
       CDN-blocked failure mode from before 211.1 landed — *"the container
       cannot fetch htmx… expected reading here is 2 of 19"* — as if current,
       when 211.1 (closed same day, this file) then 223 (closed same day)
       both superseded it: htmx is vendored locally now, then moved to 4.0.0,
       and the actual current expected reading is **1 of 19** (roadmap 222's
       independent measurement) with a still-open residual (222.1). **Fixed
       in place**, per this file's own charter — "edit it when a trap
       changes; do not re-copy it" — with both superseding roadmap items
       cited so a future reader can verify the current number rather than
       trust this sentence. 5 up / 0 down otherwise traces cleanly to real
       incidents (detached HEAD, shallow-clone unshallow lock, the `wc -w`
       locale undercounting, the background-task false-completion trap) —
       the same pattern 167.1 called HONEST for `LOOPS.md`/`CLAUDE.md`.

       **`LOOPS-archive.md` — same category as `ROADMAP-archive.md`, which
       167.1 already covers.** 1 up / 0 down, and its own row in this file's
       report reads *"looked up, never dispatched from"* — a narrative dump a
       wake reads only when it touches the rule-3 parser, not a working file
       consulted for decisions. 167.1's reasoning for `ROADMAP.md`+archive
       ("growth here is already managed… measures a quantity no wake reads,"
       when read alone) transfers directly: this is an archive, not a
       sixth working file needing its own growth discipline.

       *Accept was implicit in lane 4's own instruction* — "the finding is a
       file changing accumulate class, or a file the loop reads every wake
       accumulating with no cut behind it" — **met**: `ENVIRONMENT.md` is
       exactly that file, and the cut it needed was to its content, not its
       length.

## Slice 223 — owner call: move the shipped htmx integration and both example apps to htmx 4, dropping `apps/docs`'s boosted navigation in the process (2026-08-30)

**Owner-directed, decided over chat — not dispatcher-picked.** Recorded here
per the loop doctrine (every change gets a slice trail) rather than because
rule order selected it.

**A concurrent cloud wake reached the identical owner direction independently
and filed it as Slices 220-222 (breadcrumb Polish, this direction as a plan,
and a po-app measurement) — a real Step 0c numbering collision, resolved by
renumbering this session's work above theirs rather than discarding either
side.** Slice 221 is that wake's plan for the same instruction; it verified
the same facts against htmx 4's shipped dist independently (matching results)
but could not execute in its container. This slice is the executed and
verified version — see 221's own closure note for the cross-reference, and
222.1 for a third-environment data point on its still-open residual.

1. [x] **223.1 — pin htmx.org to 4.0.0 across the repo, including the shipped
       `@busy-office/ui` behaviors' own event listeners.** htmx.org's npm
       `dist-tags` read `latest: 2.0.10`, `next: 4.0.0` at decision time — the
       htmx project itself says 4.0.0 stays `next` into 2027 specifically so
       nobody is force-upgraded off 2.x. Moving ahead of that is a deliberate
       choice, confirmed with the owner before touching code (this repo's own
       rule: irreversible-ish decisions get a check-in, not a guess).

       **Verified against htmx 4.0.0's real dist, not secondhand research**
       (`npm pack htmx.org@4.0.0`, grepped the built file): the classic
       extension API (`defineExtension`, `hx-ext` processing) is gone
       entirely — zero matches. Events are renamed
       (`htmx:beforeSwap`→`htmx:before:swap`,
       `htmx:afterSwap`→`htmx:after:swap`). The non-2xx swap default flips:
       `noSwap` defaults to `[204, 304]` only, so v4 swaps everything 2.x used
       to discard — `#handleStatusCodes` matches exact codes, two-digit `x`
       patterns and one-digit `xx` patterns against `htmx.config.noSwap`.
       `htmx.ajax(verb, path, options)` is unchanged.

       Renamed the event in every shipped behavior that listens for it —
       `data-grid.ts`, `tabs.ts`, `windowed-list.ts`, `data-table.ts` (all
       `htmx:afterSwap`→`htmx:after:swap`), their two test files, and every
       docs page that names the event or teaches the old `htmx:beforeSwap` /
       `shouldSwap` / `isError` opt-in pattern (`/getting-started/htmx`,
       `/concepts/concurrency`, `/patterns/error-pages`, `/patterns/object-page`,
       `/patterns/first-load`, `/patterns/validation-summary`,
       `/components/form`, `/getting-started/troubleshooting`,
       `/concepts/js-behaviors`, `Gallery.astro`, `gen-llms.mjs`). The old
       pattern (opt specific statuses back INTO swapping) is now backwards —
       v4 swaps by default, so the teaching is "opt bare-error statuses OUT
       via `htmx.config.noSwap`," demonstrated live on
       `/getting-started/htmx`.

       **`examples/po-app` moved with it** (superseding 211.1's `^2.0.10`
       pin from the same day): `htmx.config.noSwap = [204, 304, 404, 500]`
       replaces the old `htmx:beforeSwap` opt-in listener — 409/422 (the
       statuses this app deliberately re-renders) now swap by default with
       no app code, and only the two bare, fragment-less responses (404,
       500) are excluded. `check:po-app` still 19/19.

       *Accept:* `@busy-office/ui`'s own vitest suite, `check:claims`,
       `check:po-app` and `test:axe` all pass against the renamed events and
       the new default — met, see 223.2's verification block.

2. [x] **223.2 — `apps/docs` drops boosted navigation rather than migrating
       it; htmx 4 removed what it depended on.** `apps/docs` used
       `hx-boost="true"` on `<body>` plus `htmx-ext-head-support` (pinned
       `^2.0.5`, npm has no version past that) to merge a boosted response's
       `<head>` into the page — needed because some pages ship page-scoped
       `<link>` stylesheets that a plain `hx-select="#main-content > *"`
       swap never sees. htmx 4 has no extension system for a v4-compatible
       replacement to register against, confirmed in its dist (above) — so
       there is nothing to migrate `htmx-ext-head-support` TO.

       **Owner call, asked rather than assumed:** keep `apps/docs` on 2.x,
       hand-write a head-merge replacement, or drop boost. Chose drop —
       `hx-boost` itself is untouched as a documented htmx feature for
       consumers (confirmed still in htmx 4's core, just without automatic
       head-merging); only this site's own use of it is gone.

       Removed: `hx-boost`/`hx-target`/`hx-select`/`hx-ext` from `<body>`,
       every `hx-boost="false"` opt-out and its now-moot comment, the
       `keepBoosted()` MutationObserver that kept Pagefind's dynamically
       inserted result links boosted, the `htmx-ext-head-support` import and
       its whole "NOT optional" comment block, and the
       `htmx:after:swap`-driven `onPageReady()` re-derivation (sidebar
       `aria-current` is server-rendered on every full load already — the
       correction code was dead the moment boost left; TOC-building and the
       code-block copy button still run once per page load, just
       unconditionally now instead of gated behind a swap event).
       `check-boost.mjs` (156 lines, the gate that asserted boosted
       navigation worked) is deleted — nothing left to check.
       `htmx-ext-head-support` dropped from `apps/docs/package.json`.

       *Accept:* the docs site navigates correctly with zero `hx-boost`
       left on the live shell (teaching content on pattern pages that
       demonstrate `hx-boost` to consumers is unaffected and correctly
       untouched) — met. Verified: full `npm run build -w docs` exit 0 (all
       27 build-chain gates, including `check:links` 14,458 internal links
       and `check:page-shape`); `check:claims` 161/161 (158 before — the new
       `noSwap` demo snippets are executable claims); `check:po-app` 19/19;
       `test:axe` 127 pages × 2 widths, zero violations; `vitest` 152/152.
       Live: `podman build --no-cache` succeeded from a clean Linux
       container (catching a real regression along the way — see below),
       `podman run`, and a real browser session against it: zero console
       errors on page load and on an internal full-page navigation,
       `<body>` confirmed to carry no `hx-boost`, the rewritten
       "Expected non-2xx responses" section screenshotted rendering
       correctly.

       **A real regression caught by the container step, not by any gate**:
       `rm -f package-lock.json && npm install` on macOS (arm64) to pick up
       the `htmx.org` version bump silently dropped the lockfile's
       `@rollup/rollup-linux-x64-gnu` optional-platform entry — present in
       the original lockfile, absent from one regenerated fresh on a
       different platform. `npm ci` inside the Linux container then failed
       on a missing native binary. Fixed by restoring the original lockfile
       (`git checkout -- package-lock.json`) and running a normal
       `npm install` (merge, not replace) to apply just the version bump —
       diff shrank from ~11,660 changed lines to 34. **Deleting and
       regenerating a lockfile on one platform is not equivalent to
       updating it** — the same class of trap this file already documents
       for bulk edits: verify against the artefact the platform that
       matters actually consumes, not the one doing the editing.

3. [x] **223.3 — version and CHANGELOG.** `@busy-office/ui` 0.6.0 → 0.7.0
       (Breaking, pre-1.0 minor per the versioning policy);
       `packages/create-ui/framework.json`'s pin regenerated to `^0.7.0`.
       CHANGELOG's `Unreleased` gained a `### Breaking` entry ahead of
       `### Fixed`, and the existing `examples/po-app` Fixed entry from
       211.1 (same day) corrected in place — it had recorded the `^2.0.10`
       pin this slice superseded hours later, which would have been a wrong
       claim shipping in the same release.
## Slice 222 — `check:po-app` after 211.1: the previous wake's open question, answered by measurement — 2 of 19 becomes 1 of 19 here, and 19 of 19 on CI (2026-08-30)

The previous hand-off's `## Direction` block left this explicitly open:
*"Whether the gate itself now passes clean in such a container, not just the one
route this wake checked, is open."* This wake could answer it for free, because
it IS an egress-restricted container and it had already run the gate once —
**before** rebasing onto 211.1, i.e. against the CDN version. Running it again
after the rebase is a controlled before/after on one machine.

**The reading moved, and the precondition is what moved.**

```
# same container, same command, two trees
before 211.1:  po-app smoke check FAILED — 2 of 19
               FAIL windowed list: htmx loaded, so the assertions below are testing
                    the app and not a blocked CDN   {"htmx":"undefined"}
after  211.1:  po-app smoke check FAILED — 1 of 19
               (no htmx precondition failure — htmx now loads from /vendor/htmx.min.js)
```

So **17 assertions that were previously vacuous now genuinely run and pass**.
208.3's standing warning — *"`chunk0Evicted: false` here means htmx never
loaded, not that eviction is broken"* — is now spent: this container reads
`chunk0Evicted: **true**`.

**The one residual, with its full payload rather than its headline:**

```
FAIL windowed list: scrolling back re-loads the chunk with NO scroll jump and NO lost selection
{"rowcount":"50001","sampledRowH":32.5,"chunk0RenderedH":3299,"chunk0Evicted":true,
 "spacerH":3299,"spacerMatchesReal":true,"renderedBounded":true,"hiddenInputSurvives":true,
 "chunk0Reloaded":false,"anchorShift":0,"scrollShift":0,"checkboxRechecked":false,
 "countAtEnd":"1 selected","midRowIndexOk":true}
```

**Read the payload, not the assertion name.** Everything the name promises is
green: `anchorShift: 0`, `scrollShift: 0` (no scroll jump — Slice 213's P0 fix
holding), `hiddenInputSurvives: true`, `countAtEnd: "1 selected"` (no lost
selection), `spacerMatchesReal: true`. The single false sub-condition is
**`chunk0Reloaded`**, with `checkboxRechecked` false as its direct consequence:
the chunk evicted and did not come back within the check's window.

**This is NOT filed as a P0, and the reason is measured rather than cautious.**
CI on the very same commit (`5e5ede6`, run 672) concluded **success**, so
`check:po-app` passes 19 of 19 there; 211.1's own commit message records 19/19
under `podman run --network none` as well. Two independent green readings of the
same code means the divergence is **this container**, not the app. Calling it a
regression on one reading would be the "first output is not evidence" failure
this repo has paid for repeatedly.

1. [x] **222.1 — characterise the residual `chunk0Reloaded: false`, or record
       that it is environmental and give `ENVIRONMENT.md` the honest number.**

       **CLOSED 2026-08-30, option (a), and it surfaced a live P0 in the
       process — `main`'s CI was actually red at the moment this item was
       picked up.** This item's own hint said *"the distinguishing variable
       is the harness — tarball-consumer vs. raw workspace"* and named the
       comparison to make before touching timing. Making it found the real
       cause, and it was worse than a residual: `check-po-app.mjs` had
       **never** actually run the tarball-consumer path in CI. It spawned
       `server.mjs` directly and relied on `require.resolve` walking up into
       root `node_modules` for BOTH `@busy-office/ui` (workspace symlink,
       held by luck) and `htmx.org` (never hoisted to root at all — a fresh
       `npm ci`, matching CI exactly, puts it only in
       `apps/docs/node_modules`, unreachable from `examples/po-app`'s own
       directory walk). That gap existed since 211.1 vendored htmx with an
       eager `require.resolve` at module load, but only started crashing the
       whole app — not degrading one assertion — once 223 removed the
       CDN fallback path entirely and made the eager resolve load-bearing.

       **Confirmed against real CI, not inferred**: `gh run list` showed
       `main` failing since the "Release prep" commit, and `gh run view
       --log-failed` on the grill's own CI run (`33312122267`) shows the
       identical `Cannot find module 'htmx.org/dist/htmx.min.js'` this
       session's local `rm -rf node_modules && npm ci` reproduced. **The
       earlier verification recorded in Slice 223 was itself contaminated**
       — it ran against a working tree carrying stale manual installs from
       earlier session testing, not a genuinely fresh one; the base rate
       this repo already names ("an instrument's first output is not
       evidence") landing on the verification step itself, not just the
       code.

       **Fixed at the gate, not the app**: `check-po-app.mjs` now performs
       the real tarball-consumer install before spawning the app — wipes
       `node_modules`/`package-lock.json`/`busy-office-ui.tgz` (the exact
       stale-lockfile trap 211.1 hit once already this session), `npm pack
       -w @busy-office/ui`, `npm install --omit=dev` — matching
       `examples/po-app/Dockerfile`'s own flow exactly, rather than leaning
       on monorepo-hoisting luck for either dependency. This is also the
       more honest gate: `examples/po-app/package.json` already describes
       itself as a tarball-only consumer, and the gate had silently never
       tested that.

       **Also answers this item's own original question**: with the install
       now deterministic, `chunk0Reloaded: false` does not reproduce — 3
       consecutive real runs, 19 of 19 each time. Consistent with hypothesis
       (b), environmental, and now moot rather than merely suspected — the
       source of the non-determinism (an install state that could silently
       differ run to run) is gone, not just avoided.

       Verified: `check:po-app` 19/19 x3, `check:repo`, `vitest` 152/152.
       `ENVIRONMENT.md`'s po-app entry (corrected once already in Slice 224)
       is corrected again in place, with what remains genuinely open: a
       cloud wake has not yet re-run the fixed gate itself, only the
       inference that its new `npm install` step needs the same network
       path `npm ci` already uses successfully there.

       **Not closed here, but a relevant data point from a third environment
       (Slice 223, same day, htmx now 4.0.0 not just locally-vendored 2.0.10):
       `check:po-app` read a clean 19 of 19 on that run, no residual, no
       `chunk0Reloaded` failure.** That is a third data point alongside this
       item's own two (CI 19/19, this container 1/19-with-residual) and does
       not resolve which of (a)/(b) applies — different environment, same
       script — but it is one more result consistent with (b), environmental,
       since a real app defect in `windowed-list.ts` itself would be expected
       to reproduce everywhere the same shipped `dist/` runs.

       *Accept:* one of — (a) a cause is identified and the gate or the app is
       fixed; or (b) it is demonstrated environmental (e.g. the scroll-back
       `htmx.ajax` does not settle inside the check's wait window in this
       container), and `ENVIRONMENT.md`'s po-app entry is updated from its
       current *"expected reading here is 2 of 19"* to the measured post-211.1
       figure with the mechanism named. **(b) is a satisfying outcome** — it is
       the same shape as the entry it would replace.

       **`ENVIRONMENT.md` is stale either way and that is the concrete debt.**
       It still says *"the expected reading here is 2 of 19, with the
       precondition named first"* and attributes it to a blocked htmx CDN. After
       211.1 there is no CDN, the precondition passes, and the figure is 1 of
       19. A wake reading that entry today would treat a changed reading as
       normal, which is exactly the "documented failure hides a new one" trap.

       **Do not start by re-running it more times.** The distinguishing variable
       between the green readings and this one is the harness, not the count:
       CI and the podman probe both ran the **tarball-consumer** path, this ran
       the raw workspace. Compare those two before touching timing.

## Slice 221 — Owner direction: pin htmx to 4, and plan the framework update. Slice 114's refusal is SUPERSEDED, and its own reopen condition is half-met (2026-08-30)

**CLOSED 2026-08-30 (same owner direction, executed rather than planned — see
Slice 223).** This item and Slice 223 are two dispatchers reaching the same
owner instruction concurrently: this wake triaged it into a plan
(221.1/221.2/221.3, all `[ ]`) because it could not verify a browser in this
container; a parallel session had the owner directly in chat and built +
verified the whole thing, including resolving 221.3's blocker. Every fact
measured here reproduces there — same `noSwap: [204, 304]`, same `hx-ext`
removal, same "114 was wrong about `hx-vals`" correction, independently
re-derived. **221.3 resolved as a fourth option this item's Accept did not
enumerate**: not (a) a v4 head-merge replacement, not (b) accept degraded
head-merging, not (c) run two htmx majors — the owner instead dropped
`hx-boost` from `apps/docs` entirely, so there is no head to merge. 221.1 and
221.2 are subsumed by 223.1/223.2 (po-app re-derived to 19/19 under v4;
every "discards non-2xx" claim across the repo rewritten, re-measured at 0
remaining hits). Leaving this item's own text and measurements in place
rather than deleting them — the independent re-derivation is itself the
useful record.

Owner, mid-wake, two messages: *"pls pin htmx to version 4"* and *"plan to
update framework accordingly"*. Triaged under `LOOPS.md` Step 1, which says an
out-of-band requirement does not wait for the next tick. Classified as a
**requirement/direction change**, not a bug — so it is written here with Accept
criteria before any code moves, which is the whole point of the step.

**This supersedes Slice 114 (2026-08-22), which refused exactly this ask**, and
114 wrote its own reopen condition: *"Re-open when: htmx 4 ships stable, AND
someone runs a scoped audit of every 'discards non-2xx' claim this framework
documents … before any adoption."* **The first half is now met**, the second
half is what 221.2 is. The owner's direction settles the "no demonstrated gap"
ground 114 also cited — a direction IS the reason, and it is recorded as such
rather than re-litigated.

**Every fact below was measured this wake against the shipped 4.0.0 tarball,
not inherited from 114's WebFetch** — the rule that a premise from an earlier
wake is part of the criterion. That re-check immediately paid: **114's claim
that `hx-vals` is removed in htmx 4 is WRONG.**

```
npm view htmx.org dist-tags        # latest: 2.0.10   next: 4.0.0
npm pack htmx.org@4.0.0 && tar xzf htmx.org-4.0.0.tgz
grep -c 'hx-ext'  package/dist/htmx.js     # 0   <- REMOVED, confirmed
grep -n  'hx-vals' package/dist/htmx.js    # 487: a live #getAttributeObject path  <- 114 was wrong
grep -n  '204\|304' package/dist/htmx.js   # 202:   noSwap: [204, 304]
```

**`noSwap: [204, 304]` is the doctrine inversion, now verified in the artefact
rather than in a changelog.** htmx 4 swaps every response except 204 and 304.
This framework teaches the opposite as load-bearing fact.

**htmx 4.0.0 is stable but is NOT the `latest` tag** — `latest` is 2.0.10 and
4.0.0 ships behind `next`. Stated because 114 refused partly on "beta, not
stable", and the honest reading today is "released, but not what `npm i
htmx.org` gives you". That is a materially different risk from a beta, and a
smaller one; it is the owner's call to accept, and the direction accepts it.

**The blast radius, measured — it is three surfaces, not the one the ask names:**

| surface | htmx today | what htmx 4 does to it |
|---|---|---|
| `apps/docs` (the docs site's OWN runtime) | `htmx.org ^2.0.10` + `htmx-ext-head-support ^2.0.5`; `hx-ext="head-support"` at `Gallery.astro:208`, 10 `hx-boost`, `htmx.process()` for Pagefind; gated by `check:boost` | **HARD BLOCKED** — see 221.3 |
| `examples/po-app` | `htmx.org ^2.0.10`, vendored locally by 211.1 earlier this same wake; 8 attribute kinds, **zero** `hx-ext` | mechanically clear; **behaviourally changed** — see 221.2 |
| the documented doctrine | 7 pages assert "discards"; **30** pattern pages carry a 4xx/409/422 Data-contract row; 6 htmx references in `check-claims.mjs` | every one of those rows is restated by `noSwap: [204, 304]` |

**211.1 closed mid-wake and it helps.** The other dispatcher landed
`5e5ede6` while this wake was running, replacing po-app's
`unpkg.com/htmx.org@2.0.4` CDN literal with a locally-vendored
`/vendor/htmx.min.js`. **There is now no CDN version literal anywhere in the
repo** (`grep -rn 'unpkg\|cdn.jsdelivr\|htmx.org@'` over `apps/docs/src`,
`examples`, `packages` → 0), so "pin htmx to 4" is now exactly **two dependency
ranges in two `package.json` files**, which is a far cleaner change than it
would have been an hour earlier.

**Nothing was pinned this wake, and that is a sequencing decision with a
measured reason, not a refusal of the direction.** 221.3 is a blocker with no
published fix, and pinning `apps/docs` into it would break the docs shell's head
merging with nothing to restore it. The owner asked for a plan in the same
breath; this is it, and 221.1 is ready to execute the moment 221.3 is answered.

1. [x] **221.1 — pin htmx to 4 where it can actually run: `examples/po-app`
       first, `apps/docs` behind 221.3.**

       *Accept:* `examples/po-app/package.json` reads a 4.x range, the app
       boots, and `check:po-app`'s 19 behaviour assertions are **re-derived
       against htmx 4's swap semantics rather than re-run against htmx 2's** —
       with the count it reaches recorded either way. **Finding that assertions
       must CHANGE is a satisfying outcome**, not a failure of the pin; finding
       they hold unchanged is equally satisfying and is the stronger result.
       `apps/docs` is pinned in the same item only if 221.3 resolves; otherwise
       this item lands po-app alone and says so.

       **Why po-app is separable, measured:** it uses `hx-target`, `hx-swap`,
       `hx-swap-oob`, `hx-post`, `hx-trigger`, `hx-get`, `hx-vals`,
       `hx-include` — all eight present in htmx 4's shipped dist — and **zero**
       `hx-ext`, so the 221.3 blocker does not touch it.

       **What genuinely changes there, and it is not cosmetic:** po-app returns
       **422** at `server.mjs:1374`, `1550`, `1636`, `1705` and **409** at
       `1691`. Under htmx 2 those are discarded; under htmx 4 they swap. The
       reference app's error behaviour therefore changes even though not one
       attribute does — which is the doctrine change arriving in the one place
       this repo can actually execute it.

       **This container cannot finish this item honestly.** `check:po-app`
       needs the app driven in a browser, and it currently reads the documented
       **2 of 19** here for an unrelated reason (measured this wake). A wake
       that can run it green is the one that should land this.

2. [x] **221.2 — the scoped audit Slice 114 made a precondition, now with its
       surface counted.**

       *Accept:* every claim this framework publishes about htmx discarding
       non-2xx responses is enumerated, and each one is marked *still true under
       4*, *false under 4*, or *never version-specific*. The enumeration is
       reconciled against a raw count of the source so it cannot under-report
       (the storage doctrine's mirror rule). **A claim that turns out never to
       have been version-specific is a satisfying outcome** — the audit's job is
       the classification, not a predetermined number of edits.

       Surface, measured this wake, with the commands beside the claims so the
       next wake re-runs rather than re-derives:

       ```
       grep -rl 'discards' --include='*.astro' apps/docs/src | wc -l          # 7
       grep -rlE '\b(409|422|4xx)\b' --include='*.astro' \
            apps/docs/src/pages/patterns | wc -l                              # 30
       grep -c 'htmx' apps/docs/scripts/check-claims.mjs                      # 6
       ```

       `getting-started/htmx.astro:83` is the origin of the doctrine — 114
       recorded it stating outright that htmx swaps 2xx and discards the rest —
       and the pattern Data-contract rows repeat it. **Re-read that line before
       trusting this sentence**; it is 114's reading, and 114 was already wrong
       once about `hx-vals`.

       **`check:claims` is the reason this cannot be a prose sweep.** This
       repo's own rule is that a claim asserting runtime behaviour must be
       executable, and a 2026-08-17 dogfood spike proved a confident, reviewed
       page flatly wrong on exactly this topic. Any row this audit reclassifies
       needs its executable case reclassified with it.

3. [x] **221.3 — BLOCKER, and it needs an owner call: htmx 4 removes `hx-ext`,
       and the docs shell's head-support extension has no htmx-4 release.**

       *Accept:* one of — (a) an htmx-4 path for merging `<head>` on boosted
       navigation is identified and demonstrated on the docs shell; (b) the
       docs site accepts losing head merging beyond the title, with what
       actually degrades measured on the built site rather than assumed; or
       (c) the docs site stays on htmx 2 while `examples/po-app` moves to 4,
       and this repo documents that it deliberately runs two majors. **Any of
       the three closes this item** — (c) is not a failure, it is a legitimate
       answer that 221.1 is already shaped for.

       The measurements that make this a blocker rather than a worry:

       ```
       grep -c 'hx-ext' package/dist/htmx.js                    # 0  — removed in htmx 4
       grep -c 'hx-ext' apps/docs/src/layouts/Gallery.astro     # 1  — Gallery.astro:208
       npm view htmx-ext-head-support versions                  # tops out at 2.0.5
       npm view htmx-ext-head-support dist-tags                 # latest: 2.0.5
       grep -in 'head-support' package/dist/htmx.js             # 0  — not native either
       grep -n  '<head'       package/dist/htmx.js
       #  1049: strips <head>…</head> and keeps ONLY the title
       ```

       So the mechanism is removed, the extension that provided it has no
       htmx-4 release, and htmx 4's own head handling discards the head and
       preserves the title alone. **There is no published upgrade path for this
       specific dependency today** — which is a fact about the ecosystem, not a
       cost this repo can absorb by trying harder.

       **What is NOT yet measured, and is deliberately left open rather than
       guessed:** what the docs shell actually loses in practice. `check:boost`
       gates boosted navigation and would be the instrument. That measurement
       needs the built site driven in a browser — takeable in a cloud wake per
       `ENVIRONMENT.md`'s "no screenshots is not no browser" — and this wake
       spent its rounds elsewhere.

## Slice 220 — Polish round on `breadcrumb`: the count-bearing cite class pays out a second time, and the pick was a filed defect rather than a tie-break (2026-08-30)

Dispatcher, top-to-bottom, each rule read from its own source rather than
inherited from the hand-off. **Rule 1 clear** — no open P0 (`grep -inE 'P0'
ROADMAP.md` returns only closed slice headings), GitHub intake **0 open issues**
(`list_issues` `state: OPEN` → `totalCount: 0`). Step 1 therefore had nothing to
triage. **Rule 2** `Standardize 2 / 4 ok`, **rule 3** `Objective 2 / 3 ok
[218, 219]` — one more closed slice arms a grill. **Rule 4 found nothing
dispatchable**: the same four open items, each re-read by its own text this
wake, with the KIND of blocked named per 186.2 — `112.3` owner-blocked (briefs +
four answers), `112.4` owner-blocked (on 112.3's verdict), `211.1` owner-blocked
(a product call), AT runtime hardware-blocked (owner hardware). **None of the
four is browser-blocked**, so this is not the mis-sort 186.2 warns about.
**That reading of `211.1` was true when taken at Step 0 and was overtaken
mid-wake** — the other dispatcher landed `5e5ede6` closing it, so the open set
is now three. Left as read rather than back-edited into a tidier claim: the
rule-4 report says what this dispatcher saw when it evaluated the rule, and
Slice 221 records the change.
**Rule 5 evaluated and clear, not stale** — `dispatch_status.py` reads
`0 wake-date(s) newer`, newest comparable pair `axe-violations` 0 → 0 (no
regression), and the one declared size budget in the repo (`RF_BUDGET_KB = 40`,
`build-rf-essentials.mjs`) is gated by the build, which passed. **Rule 6
fired**; `polish_requeue.py --apply` re-queued **8** surfaces.

**Not lapped this wake, and that was checked rather than assumed.** Step 0
fetched `origin/main` at `89bb937` — exactly the sha the previous hand-off
named. The container started **detached** (`git branch --show-current` empty),
fixed with `git checkout -B main origin/main` per ENVIRONMENT.md trap 1, and
`git rev-parse --short main HEAD` reproduced the documented `fatal: Needed a
single revision` that trap warns is NOT evidence of a missing branch. The clone
is still **shallow** and was left that way: nothing this wake measured is a
history measurement.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px or 390px
in either theme.** One rendered change ships — the `fit` row of
`/components/breadcrumb`'s "Design-system alignment" table carries different
text. No element, class, style or CSS file changed; the entire diff under
`apps/docs/src` is one JSON string. `check:layout` (127 pages), `test:axe`
(127 × 2, zero) and `check:claims` swept green, and the corrected cite was
verified in the BUILT html rather than in the diff. **That is what ran; it is
not the same as having looked at the page.**

1. [x] **220.1 — `breadcrumb`'s `fit` cite published "2 of 19 pattern screens"
       against a corpus of 39. The numerator held; the denominator had
       doubled.**

       *Accept* (§3b, the reconciliation a `content: 3` re-queued surface gets):
       the surface's published artefact agrees with the ledger's record of it —
       the entry exists, the page renders it, and each citation still holds
       against the shipped artifacts. **Finding every citation clean is a
       satisfying outcome**; 176.1's wake recorded exactly that on ten surfaces.

       **The pick needed no tie-break, and that is new.** Every round since
       176.1 has faced an unbroken tie — all re-queued surfaces score
       `content: 3`, and 171.1 measured that no DSA dimension can rank one — so
       216.1 and 217.1 each invented a discriminator (source movement since the
       surface's own `scored` date). This round had a **filed** defect instead:
       217.2 measured the count-bearing cite class at **6 of 240**, found 4
       exact and 2 stale, fixed `sidebar-nav` and wrote `breadcrumb` down as
       *"filed, not fixed — one round, one surface"*. `breadcrumb` is not a row
       in the ledger table and rule 6 reads only `rounds`/`dry`, so this is a
       **re-entry**, the same shape `scan` and `data-table` took.

       **The premise was re-measured before it was acted on**, per this file's
       own rule that a premise inherited from an earlier wake is part of the
       criterion — 217.2 recorded no command beside its claim:

       ```
       node -e "console.log(require('./apps/docs/src/data/dsa-scores.json')
         .components.breadcrumb.dimensions.fit.cite)"
       #  deep ERP hierarchies (cost center -> PO -> line); used in 2 of 19 pattern screens

       grep -l 'bo-breadcrumb' apps/docs/src/pages/patterns/*.astro | wc -l   # 2  <- numerator holds
       grep -rl 'bo-breadcrumb' apps/docs/src/pages/patterns/ | wc -l         # 2  (recursive, same)
       ```

       **The denominator was reconciled against four independent sources before
       being called wrong**, because a count is exactly the kind of number
       CLAUDE.md says to reconcile before quoting:

       | source | reading |
       |---|---|
       | `ls apps/docs/src/pages/patterns/*.astro` minus `index.astro` | **39** |
       | `patterns.json`'s own `count` field (generated by `docs:build`) | **39** |
       | `gen-patterns-index.mjs` report line | **39** pattern(s) |
       | `check:wrong-choice` report line | patterns: **39** carry |

       Four agree; `19` was right in the neighbourhood of 2026-08-21 and is not
       right now. Note the recursive glob returns **47** `.astro` files under
       `patterns/` — the `rf/` and `schedule/` subdirectories hold sub-screens
       that `patterns.json` does not count as patterns. A wake that had used
       that number as the denominator would have "corrected" one wrong figure
       into another.

       **The fix removes the quantity rather than refreshing it**, which is
       217.2's precedent and this item is its second confirmation: a refreshed
       denominator decays on the next pattern page, and the corpus grew 19 → 39
       in nine days. The replacement states two properties of the code, both
       verified present first:

       ```
       grep -rc 'bo-breadcrumb' examples/erp-suite --include='*.mjs'
       #  examples/erp-suite/_shell.mjs:1   <- the ONLY literal in the suite;
       #                                       crumbs() at _shell.mjs:125, called by page()
       grep -c 'bo-breadcrumb' packages/create-ui/template/screen.html    # 1
       ```

       So: *"deep ERP hierarchies (cost center -> PO -> line item); the ERP
       suite emits every trail from ONE shared `crumbs()` helper in
       `_shell.mjs`, never hand-written markup, and create-ui's starter screen
       ships one."* **No line number** — the ledger records line-number cites as
       the most decay-prone shape there is and only 1 of 40 components carries
       one; adding a second, in the round whose entire finding is decay, would
       be the wrong lesson.

       **The score does not move and no blind re-score is owed.** A component
       whose trail is emitted from one shared helper and shipped in the
       scaffolder's starter screen has *stronger* placement evidence than a raw
       count of demo pages, so `fit: 3` was and remains right; the sentence
       reporting it went wrong while the thing it reported got better. `scored`
       stays **2026-08-21** — moving it would claim the independent second
       opinion §3b step 4 requires, which this wake cannot run. `rounds` is
       recorded as 1/3 on a **new** ledger row, because this is the surface's
       first Polish round.

       **The other five cites reconciled clean**, arm by arm, against
       `breadcrumb.css` as shipped:

       | dimension | cite | check |
       |---|---|---|
       | typography | `--bo-font-size-sm` only, no raw `font-size` | `grep -c font-size` → **1**, and it is the `var()` |
       | colour | zero raw colour; current page carries weight + primary ink | `grep -cE '#[0-9a-f]{3,8}\b\|rgba?\(\|hsla?\('` → **0**; `[aria-current="page"]` sets `color` **and** `font-weight` |
       | spacing | zero raw dimension literals | `grep -oE '[0-9.]+(px\|rem\|em\|ch\|%)'` → **0 matches** |
       | interaction | `na` — plain links, no behavior ships for it | 0 of **33** `behaviors.json` names match `/crumb/i` |
       | content | separator is `content: "/" / ""`, empty accessible name | present verbatim in the shipped CSS |

       Arm 1 (wrong-choice clause) present — *"Not for progress through a
       flow"*, and `check:wrong-choice` ratchets it. Arm 2 (entry rendered by
       its page) gated per name by `check:dsa-scores` assertion 7 — **360
       assertions across 40 scored components, all rendered**.

       **One instrument was wrong on its first output, which is the base rate
       holding.** The behaviors check first read `0 of 4` — it had counted
       `Object.keys(behaviors.json)`, whose top level is
       `generated`/`initCount`/`exports`/`behaviors`. The real array holds
       **33** names. A "0 of 4" that happened to support the cite was caught by
       the tidiness of the denominator, not by the answer being wrong.

       **Verified against the RENDERED artefact, not the diff**: `used in 2 of
       19 pattern screens` → **0 files across all of `apps/docs/dist`**, and the
       replacement renders on `/components/breadcrumb`. The only surviving
       source copy of the old string is `polish-state.md`'s own record of
       217.2 filing it, which is a quotation and correct.

2. [x] **220.2 — refused: a gate for the count-bearing cite class, for the
       second time, and the reason is now stronger than when 217.2 refused
       it.**

       *Accept:* the refusal names what a gate would have to do and why this
       loop may not build it, or the gate ships. **Refusing is a satisfying
       outcome** — the Objective's own accept/refuse test.

       217.2 refused it on two grounds: 101.3's stop rule forbids Polish adding
       gates, and the class is not writable in the form the existing
       cite-checkers take (*is this string in that file*) because it needs *does
       this number still equal a count over a different tree*. This round adds a
       third, measured here: the two stale cites in the class of six failed
       **against different trees** — `sidebar-nav`'s numerator counted
       `examples/po-app`, `breadcrumb`'s denominator counted
       `apps/docs/src/pages/patterns`. A gate would need each cite to carry its
       own command, which is a **rubric change** (a new field in
       `dsa-scores.json`), not maintenance of the existing ratchet.

       **And the class is now shrinking by construction rather than by
       enforcement**: both repairs replaced the count with a property, so 6 of
       240 is down to **4 of 240**, all four re-verified exact by 217.2
       (`navbar · fit` 3, `dialog · fit` 13, `offcanvas · fit` 1, `tabs · fit`
       2). A gate whose population is being retired as it is found is ceremony
       for a different reason than 94.11's — not a uniformly-true predicate, but
       a vanishing one. Recorded for whoever may decide; not filed as an item.

## Slice 219 — the `aria-current` pairing gate stops at the docs dist, and the one violation it would have caught lived outside it (2026-08-30)

Triaged from the hand-off `218.1` wrote and deliberately did not act on: it
named the gap as *"worth a line of owner direction, or a triage row on a later
wake — not a defect"*. This is that row. Filed rather than built in the same
breath, so the premise below is re-measured on the tree the build will actually
run against, per this file's own rule that a premise inherited from an earlier
wake is part of the criterion.

1. [x] **219.1 — DONE 2026-08-30 (cloud wake). Extend the
       `.bo-timeline__step[data-state="current"]` / `aria-current="step"`
       pairing assertion to the built ERP suite.**
       `check:timeline-current` (shipped by 218.1) says so in its own header:
       *"this walks the BUILT DOCS pages only. `examples/erp-suite` and
       `examples/po-app` render timelines that this gate never sees … A
       regression there is not caught here."* So the coverage claim is the
       gate's, not an inference.

       **Measured on the tree this item was filed against**, commands beside
       the claims because a count about this repo is re-runnable in seconds:

       ```
       npm run build -w @busy-office/ui && npm run suite:build
       # walk examples/erp-suite/dist for <li class="…bo-timeline__step…"> tags
       #   carrying data-state="current":
       #   28 html files · 6 pages render one · 8 rendered current steps · 0 unpaired
       grep -rn 'data-state="current"' examples/     # 10 source sites: 8 suite
       #   timelines (= the 8 built), 1 .bo-stepper, 1 po-app template literal
       ```

       **The 100% is real and is stated as the weakness it is, not argued
       away.** 94.11's rule says a predicate already true of the whole tree is
       ceremony. Two things distinguish this one, and both are checkable rather
       than asserted:

       - **The population held a violation one day ago.** `git show 127b9e5 --
         examples/` is a one-line fix to
         `examples/erp-suite/p2p/purchase-order.screen.mjs` — an unpaired
         current step, so the pre-fix base rate was **7 of 8**, not 8 of 8. It
         was found by a source grep during 218.1, by no gate at all, which is
         the whole argument for a ratchet here.
       - **`577c572` is a real red-proof target.** That is the commit before
         218.1's fix, so the detector can be run against a tree that genuinely
         fails it rather than only against an injected one.

       *Accept* — every criterion names a property to verify, never a value it
       will have:

       - `npm run suite:check` fails when a built suite screen renders a
         `.bo-timeline__step[data-state="current"]` with no `aria-current="step"`
         outside an `aria-hidden`/`inert` subtree, and the failure text names
         the file and the tag.
       - The assertion is **red-proved twice, and the injection is confirmed to
         have landed before either result is believed**: once by injecting into
         the built dist and re-reading the built HTML for the mutation, and once
         against the `577c572` tree, where the expected verdict is whatever it
         actually reports — finding that tree already clean for some other
         reason is a satisfying outcome and gets written down.
       - The gate reports how many current steps it scanned, and refuses to
         report a pass over **zero** of them — the fail-open shape
         `gate-report.mjs` exists to prevent, restated because
         `check-erp-suite.mjs` has no `gate()` helper and must assert the count
         itself.
       - Its header records the same coverage sentence in the other direction:
         what it still does NOT cover, with the reason.
       - `check:timeline-current`'s COVERAGE paragraph agrees with what actually
         runs after this item — not "is updated", but *agrees*.

       **Scope refused in advance, with the reason** — the same pairing rule
       could go into `packages/core/scripts/check-markup.mjs`, which already
       runs over `examples/erp-suite/dist` and would then cover every consumer
       for free. Refused: that file **ships as the `bo-check-markup` bin**, so a
       new assertion there is a new failure mode in a published tool, on markup
       a consumer wrote before the rule existed. That is a contract change to a
       stable surface and belongs in a CHANGELOG-bearing item, not in a gate
       extension. `examples/po-app` is also out of scope: it has no built dist
       to walk, its timeline is a template literal in `server.mjs`, and
       `check:po-app` cannot run green in a cloud container at all
       (ENVIRONMENT.md's documented 2 of 19).

       ---

       **RESULT — landed as a fourth assertion inside the gate the suite
       already has**, `examples/erp-suite/check-erp-suite.mjs`, not as a new
       script. It was already `@exact` and already walked the built dist, so
       the change is one matcher, one loop and a scan floor; `suite:check` was
       not re-wired.

       **Three red-proofs, each with the injection confirmed BEFORE the verdict
       was believed** — this repo's standing rule that a green red-proof is a
       defect in the injection until proven otherwise, and 218.1's own
       correction that a "red" can be a crash rather than a verdict, so the
       failure TEXT was read every time, not the exit code:

       | # | injection | confirmed how | verdict |
       |---|---|---|---|
       | 1 | strip `aria-current="step"` from one built step in `dist/p2p/purchase-order.html` | the built file's paired count went **2 → 1** and the unpaired spelling appeared **1** time | red, naming the file and the tag, `rc=1` |
       | 2 | rename `bo-timeline__step` → `…__stepX` throughout the built dist (**32** occurrences) | `grep -rho 'bo-timeline__step\b' dist \| wc -l` → **0** | red: *"scanned 0 … Verdict withheld"* |
       | 3 | `git checkout 577c572 -- examples/erp-suite/p2p/purchase-order.screen.mjs`, then rebuild | the source diff shows the attribute removed, and the rebuilt HTML carries the unpaired tag **1** time | red on the **real historical defect**, `rc=1` |

       Red-proof 3 is the one the Accept named and it is the one that matters:
       the gate is not merely sensitive to a mutation invented for it — it goes
       red on the exact markup that actually shipped and that no gate caught.
       218.1 found that by a source grep.

       **The exemption was REFUSED rather than ported, and the reason is a
       dependency, not a shortcut.** The docs gate exempts a current step inside
       an `aria-hidden`/`inert` subtree because `PatternPreview.astro` renders
       decorative thumbnails. Answering that question needs an ancestor walk,
       which needs a DOM parser, which means `jsdom` — declared by `apps/docs`,
       reachable from `examples/erp-suite` only by root hoisting, and this
       directory has no `package.json` to declare it in. Measured before
       deciding: the built suite contains **0** `inert` and **265**
       `aria-hidden="true"`, all decorative icons, so the exemption has nothing
       to exempt today. The strict rule costs nothing to satisfy — an
       `aria-current` inside an aria-hidden subtree reaches nobody either way —
       and if a screen ever needs a decorative timeline the gate fails and the
       exemption gets added deliberately. Recorded in the gate's header.

       **`<pre>` is blanked before matching although the suite contains 0
       `<pre>` and 0 `<code>`** — insurance, stated as insurance, so the gate
       does not silently depend on that staying true.

       **Verified green in this container** (16 cloud-runnable commands, the
       list re-derived from `ci.yml` per ENVIRONMENT.md): core build/test/
       `lint:css`, `docs:build` (which runs `check:repo`, so `check:selftests`
       ran and the edited header still declares `@exact`), `check:claims`
       (158 live + the documented 3 NOT VERIFIED for this container's
       `pointer: none`), `check:formatting`, `check:scroll`,
       `check:forced-colors`, `check:layout` (127 pages), `test:axe`
       (127 × 2, zero), `check:target-size`, `check:search`, `check:pseudo`,
       `check:quickstart`, `check -w @busy-office/create-ui`, `npm run suite`
       (28 screens, audit zero violations). `check:po-app` is the documented
       **2 of 19** — this container cannot fetch the htmx CDN, unchanged by
       this item.

       **Two independent counts reconcile.** `check:timeline-current` reports
       **6** rendered current steps across 127 built docs pages (1 exempt);
       `check-erp-suite` reports **8** across 28 built suite screens. Those two
       populations are disjoint, and the 8 was arrived at twice by different
       instruments — a throwaway walk of the dist written before the gate
       existed, and the gate itself.

       **A postscript that is `LOOPS.md`'s prescribed comparison working, and
       the defect was the ROW, not the parser.** Rule 3's counter did not move
       after this item's Continue row was recorded, while a slice had visibly
       just closed — the disagreement `LOOPS.md` says to look for right after
       recording. Cause: the row's item text began `Roadmap 219.1 — …`, and all
       three slice patterns in `dispatch_status.py` anchor the number at
       position 0, so it landed in the measured 24.2% slice-less bucket. **Not
       a sixth recurrence.** The row was corrected to `219.1 — …` before the
       commit and the mirrors rebuilt, with the raw `grep -c '^- '` asserted
       unchanged at **1211** either side (ENVIRONMENT.md trap 5's rule applied
       to a hand edit); the counter then read `2 / 3 slices [218, 219]`. The
       carryable instruction is one line: **start a Continue row with the bare
       slice id.**

       **NOT VERIFIED, said plainly:** no screenshot at 1440px or 390px in
       either theme was taken, because this container has no Podman and no
       `localhost:8081`. Nothing rendered should move — the diff is one gate
       script, one docs-script comment, and this file; `packages/core` and every
       `.astro` page are untouched. **That is an argument, not a look at the
       page.**

## Slice 218 — Owner-forwarded review: `data-state`/`data-status` conflation, scoped to two components not the framework (2026-08-30)

Owner forwarded an external "Adversarial Review & Improvement Proposal"
(compares this repo against FlyonUI and Radix). Reviewed against the repo
before acting on any of it, per this file's own discipline against treating
an external claim as true unmeasured: most of the document's substance is
**convergent, not new** — its central recommendation (phase Screen
Contract/validator/MCP work behind an evidence-gated pilot rather than
build speculatively) is the plan this repo already committed to on
2026-08-22 (Slice 112), against a near-identical earlier proposal, and the
pilot it names (§35, "benchmark before MCP") is `112.3`, still blocked on
the same owner-authored briefs it always was. Nothing filed for that
material; it would be re-raising a settled decision (176.3's shape).

**One claim was genuinely new and checked out — narrower than as proposed.**
§25 argues `data-state` (UI/interaction state: open, selected, expanded) and
business/domain status (draft, approved, rejected) get conflated under one
attribute, and recommends splitting them framework-wide. Measured before
filing anything, because "91 uses of `data-state`" was the first, wrong
draft of this finding:

```
grep -rn 'data-status=' packages/core/src apps/docs/src        # 0
grep -rhoE 'data-state="[a-z-]+"' packages/core/src apps/docs/src examples | sort -u
  # closed closing current done open pending rejected resolved
grep -n 'data-state' packages/core/src/css/components/approval-workflow/approval-workflow.css
  # .bo-timeline__step[data-state="done|current|pending|rejected"]
  # .bo-audit__entry[data-state="resolved"]
```

**91 total uses, and exactly two components' CSS carry a business-shaped
value**: `.bo-timeline__step` (an approval-chain step: done/current/
pending/rejected) and `.bo-audit__entry` (a discussion thread: resolved).
Every other `data-state` use in the framework — dialog, offcanvas, dropdown,
collapsible-card, validation-summary, value-help, nav, motion — is genuine
UI state (open/closed/closing). A framework-wide split, as the source
document proposes, would be solving a problem that exists in 2 of the
component library's ~60 components; the base-rate discipline this repo
already applies to gates (94.11) applies here to a design change too.

**A second, smaller finding inside the same file**: `.bo-timeline__step`'s
`data-state="current"` duplicates `aria-current="step"`, already present on
the same element per the file's own header comment — the CSS hook and the
accessible-state hook name the same fact twice, one of them redundant.

1. [x] **218.1 — decide `.bo-timeline`/`.bo-audit`'s `data-state` values: keep
       as documented precedent, or split to `data-status` for these two
       components only.** — **REFUSED the split; KEPT `data-state`, with the
       reasoning written into `approval-workflow.css`'s header. The
       `current`/`aria-current` half went the other way from the way it was
       filed: the duplication is real and is DELIBERATE, and it had already
       drifted.** (2026-08-30, cloud wake)

       **Two of the triage's own premises were wrong, and re-checking them is
       what changed the answer** — the item's premise was a measurement from an
       earlier wake, which CLAUDE.md makes part of the criterion.

       - *"`grep -rn 'data-status=' packages/core/src apps/docs/src` → 0"* is
         true of that command and reports a **false absence**. The `=` is a
         position filter: `/patterns/job-monitor` writes it as
         `<code>data-status</code>`, so the plain fixed string finds it.

         ```
         grep -rn 'data-status=' packages/core/src apps/docs/src | wc -l   # 0
         grep -rn 'data-status'  packages/core/src apps/docs/src | wc -l   # 2
         # job-monitor.astro:173 + its generated mirror in patterns.json:2503
         ```

         This is the exact shape CLAUDE.md records under *"a context-window
         regex is secretly a POSITION filter, and it fails silently"* — worse
         than a dead detector, because it reported a confident absence. And it
         inverts the item's framing: the proposed convention is not foreign to
         this repo, it is **already shipped** — which is what makes refusing it
         a decision about a boundary rather than about a name.
       - *"~60 components"*: `ls packages/core/src/css/components | wc -l` → **40**.

       **The decision, and the boundary it rests on.** `data-state` is the
       attribute the **shipped CSS selects on**; `data-status` is **payload** a
       server sets and an agent reads, which no stylesheet touches
       (`grep -rn data-status packages/core/src` → 0). That is one rule, it
       already holds across the whole framework, and renaming these two
       components would make `data-status` a styled hook for the first time and
       delete the only distinction the two names carry. Against the Objective's
       simplicity test, the split ADDS a concept: today a reader asks "does the
       CSS style it?"; afterwards they would also have to ask "is this value
       domain-shaped?", to describe two components.

       Base rate, 94.11's rule applied to a design change rather than a gate:
       `grep -rl data-state packages/core/src/css/components/` → **7** files;
       only `approval-workflow` carries business-shaped values. The nearest
       other case, `.bo-stepper`'s `data-state="done"`, is a wizard's own
       progress, not a record's status. Every other use — dialog, offcanvas,
       dashboard widget, toast — is `open`/`closed`/`closing`.

       **No CHANGELOG entry, and that is the criterion being satisfied rather
       than dodged.** The Accept named a **Breaking** entry *for the rename
       branch*. Nothing in `packages/core` changed except comments; the shipped
       selectors, values and attribute contract are byte-identical. Writing a
       Breaking entry here would be 154.1's error repeated — a criterion's
       forecast followed past the measurement.

       **The `current`/`aria-current` line, which the triage called redundant.**
       It is not, and the counter-example is in this repo:
       `apps/docs/src/components/PatternPreview.astro:110` draws every pattern
       thumbnail inside `<div class="tile-preview" inert aria-hidden="true">`,
       verified in the BUILT html (10 such tiles on `patterns/index.html`). The
       current step must be **visible** there and `aria-current` reaches nobody.
       So `data-state` is the render channel and `aria-current` the programmatic
       one — this framework's own two-channel rule, not one fact written twice.
       `.bo-stepper` styling current off `aria-current` alone, and
       `richtext.css` refusing a parallel `data-state`, are real precedents that
       do **not** transfer, because neither has a decorative render context.

       **And the parallel scheme had already drifted, which is why it needed a
       gate rather than a paragraph.** Measured on the built docs: **6** rendered
       `.bo-timeline__step[data-state="current"]`, **4** paired, **2** not — one
       the legitimate decorative tile, one a real defect on
       `/patterns/object-page`, a visible current step with no programmatic
       counterpart at all. A third, `examples/erp-suite/p2p/purchase-order`, is
       outside the docs dist and was found by the source sweep. Both fixed.

       New gate **`check:timeline-current`** (`@exact`), in the `docs:build`
       chain: every rendered current step carries `aria-current="step"` unless
       `closest('[aria-hidden="true"], [inert]')` says it is decorative — a real
       ancestor walk (jsdom, on unpaired pages only), not a page allowlist.
       **Red-proved on BOTH branches, injection verified each time, and re-run
       against the FINAL code** — the first round of proofs was against an
       earlier draft, and the refactor that followed it broke the gate, so the
       proofs were retaken rather than inherited:

       - it went red on the unfixed tree, naming `/patterns/object-page` and
         exiting 1 while correctly exempting `patterns/index.html`;
       - removing `aria-current="step"` from the built object-page (paired tags
         **2 → 0**, counted before and after) → `FAIL … 2 of 2 … exit=1`;
       - stripping `inert aria-hidden="true"` from the built
         `patterns/index.html` (**10 → 0**) turned the *decorative* branch red
         too → `FAIL … 1 of 1`. Without this second proof the exemption could
         have been passing by never firing.

       Both files were restored and the clean tree re-run green each time:
       `5 page(s) rendering a current step checked across 127 built pages
       (6 rendered, 1 exempt)`.

       **The refactor's own defect is worth recording**, since it is this
       repo's standing base rate landing again: making the assertion per-page
       (so a clean tree cannot report a pass over **zero** checks) built the
       failure-detail string eagerly, and the gate crashed with a `TypeError`
       on every page with nothing wrong. All three "red" results in that round
       were **crashes, not verdicts** — an instrument's first output is not
       evidence, including when the instrument is a red-proof.

       Base rate before shipping it: the predicate was false of **2 of 6**, so
       it distinguishes rather than passing by construction — unlike 94.11's
       155-of-155.

       **What it does NOT cover, stated rather than implied:** the built docs
       pages only. `examples/erp-suite` and `examples/po-app` render timelines
       this gate never sees; `npm run suite` and `check:po-app` do not assert
       the pairing. The erp-suite fix above was verified by source grep and by
       `npm run suite`, not by this gate.

       **Not verified: no screenshot.** Cloud wake — no Podman, no
       `localhost:8081`, so nothing was checked at 1440px or 390px in either
       theme. Nothing rendered should move: `packages/core` changed by comments
       only, and the two markup fixes add one ARIA attribute that no selector in
       the framework reads. That is an argument, not a look at the page.

       **The item as filed, kept verbatim below** — its framing is what the
       measurements above answer, and the Accept is what they are scored
       against.

       This is a real accept/refuse/rethink call against the Objective
       (simplicity — does splitting reduce or add a concept a reader must
       track?), not a default "yes, split it": a timeline step's business
       status IS what the component visually renders, so `data-state`
       carrying it is arguably not a conflation but the correct name for
       what the attribute does in THIS component, unlike a dialog's
       open/closed which is purely interaction state. The source document's
       argument (`data-state` for UI, `data-status` for domain) is a
       plausible convention, not a proven necessity here — argue it on
       these two components specifically, not on the general principle.

       *Accept* — properties, not a predicted verdict:
       - A recorded decision, with reasoning, on whether `.bo-timeline` and
         `.bo-audit` should rename their business-shaped `data-state` values
         to `data-status` (a real breaking change: `CHANGELOG.md` gets a
         **Breaking** entry with a migration note, since these are shipped,
         documented, `0.6.0`-live attribute contracts) or keep `data-state`
         with the reasoning for why it is not a conflation written into the
         component's own header comment, next to the existing state
         documentation line.
       - **Refusing the split is a satisfying, complete outcome** if the
         reasoning holds up — this item is not pre-committed to renaming
         anything.
       - Whichever branch, the `current`/`aria-current="step"` duplication
         gets its own explicit line in the decision: is the CSS hook
         redundant with the ARIA one, and if so, does `[aria-current="step"]`
         replace `[data-state="current"]` as the selector, or do they stay
         parallel on purpose (e.g. `data-state` covers non-interactive
         render contexts `aria-current` doesn't reach)?
       - No gate proposed — "is this a conflation" is a judgement about what
         an attribute MEANS, 94.11's line, same as the wrong-choice clause's
         content is human-judged while its presence is gated.

## Slice 217 — Polish round on `sidebar-nav`: a cite that was EXACT when written and decayed two days later, and the count-bearing class measured at 6 of 240 (2026-08-30)

Dispatcher, top-to-bottom, each rule read from its own source rather than
inherited from the hand-off. Rule 1 clear — no open P0, and GitHub intake **0
open issues** (`list_issues` `state: OPEN` → `totalCount: 0`). Rule 2
`Standardize 0 / 4 ok`, rule 3 `Objective 0 / 3 ok`. **Rule 4 found nothing
dispatchable**: the same four open items, each re-read by its own text, with the
KIND of blocked named per 186.2 — `112.3` owner-blocked (briefs + four answers),
`112.4` owner-blocked (on 112.3's verdict), `211.1` owner-blocked (a product
call, its inputs corrected by 215.3), AT runtime hardware-blocked (owner
hardware). **None of the four is browser-blocked**, so this is not the mis-sort
186.2 warns about. **Rule 5 could not be evaluated** — `dispatch_status.py`
reads `STALE`, one wake-date newer than its newest comparable pair, and rule 5's
own text says that is reported as un-evaluable rather than as clear; 217.3
un-stales it. **Rule 6 fired**; `polish_requeue.py --apply` re-queued 9
surfaces.

**Not lapped this wake, and that was checked rather than assumed.** Step 0
fetched `origin/main` at `913dfbf`; the re-fetch Step 0c mandates before the
first commit returned the same sha.

**`polish_requeue.py` cannot run on a fresh container before a build** — it dies
with `FileNotFoundError: packages/core/dist/api.json` reading the slug map.
Recorded as a shape, not filed: the traceback names the missing file, so it
fails loudly rather than skipping quietly, which is the property this repo's
rule actually asks for. `npm run build -w @busy-office/ui` first is the whole
fix.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px or 390px
in either theme.** One rendered change ships — the `fit` row of
`/components/sidebar-nav`'s "Design-system alignment" table carries different
text. No element, class, style or CSS file changed; the entire diff under
`apps/docs/src` is one JSON string. `check:layout`, `test:axe` and
`check:claims` swept green, and the corrected cite was verified in the BUILT
html rather than in the diff. **That is what ran; it is not the same as having
looked at the page.**

1. [x] **217.1 — `sidebar-nav`'s `fit` cite counted 6 and the tree now counts 8.
       Unlike 216.1, the number was EXACT when it was written — it decayed.**

       *Accept* (§3b, the reconciliation a `content: 3` re-queued surface gets):
       the surface's published artefact agrees with the ledger's record of it —
       the entry exists, the page renders it, and each citation still holds
       against the shipped artifacts. **Finding every citation clean is a
       satisfying outcome**; 176.1's wake recorded exactly that on ten surfaces.

       **Pick, with its reason, because the score cannot rank.** All nine
       re-queued surfaces score `content: 3` in the ledger (171.1: no DSA
       dimension can rank), eight sit at 1/3 rounds and `scan` at 2/3, so §3b's
       "fewest rounds used" tie-break leaves eight. `inline-editing` drops out
       of those eight for a stated reason rather than silently: it has **no
       `dsa-scores.json` entry at all** — the false gap 176.2 resolved, a
       behaviour-documentation page with no CSS component under it — so the
       reconciliation arms have nothing to disagree with. Seven remain, picked,
       as 216.1 did, by which surface's
       SOURCE actually moved since its own `scored` date, that being the
       property that makes a cited artefact go stale:

       ```
       BASE=$(git rev-list -1 --before=2026-08-23T23:59:59+08:00 origin/main)   # a9ba5c7e
       git rev-list --count $BASE..origin/main -- <each surface's paths>
       #  sidebar-nav  4 commits  +120/-2   <- picked
       #  icon         4 commits  +113/-2
       #  alerts       1 commit    +71/-5     stepper 2 +42/-0
       #  calendar     2 commits   +18/-2     tree-table 1 +20/-12
       #  dashboard    0 commits    +0/-0
       ```

       **The first reading of that instrument was wrong, and the defect was the
       DAY BOUNDARY.** `--before=2026-08-23T23:59:59` with no offset is read in
       the container's UTC while every commit here is authored `+0800`, so it
       cut eight hours late: `icon` read **3 commits +43/-3** and `calendar`
       read **0/0**. Both change under the correct boundary (4/+113 and 2/+18),
       and `calendar` moves from "did not move at all" to "moved twice" — the
       exact reading a pick would have been made on. An instrument's first
       output is not evidence, and the tell here was not a tidy number: it was
       that the base commit it resolved to (`12f95a67`, `2026-08-24T07:31+08:00`)
       was stamped a day AFTER the boundary asked for.

       `sidebar-nav` and `icon` tie at 4 commits. Broken on a stated property
       rather than the line count: `sidebar-nav`'s `fit` cite carries a **bare
       count of usages**, which is the most decay-prone claim shape in the file —
       the same reasoning that picked `badge` on its line-number cite (176.1),
       and a count is strictly worse than a line number because nothing in the
       repo has to change *near* it for it to go wrong.

       **The finding.** The cite read *"the shell rail; po-app uses it at **6
       sites**, and it composes inside `.bo-offcanvas` for the drawer pattern"*.

       ```
       git log -S 'po-app uses it at 6 sites' -- apps/docs/src/data/dsa-scores.json
       #  37a1143a  2026-08-21T06:16:30+08:00  "Slice 94 batch 3: Navigation & layout scored"
       git show 37a1143a:examples/po-app/server.mjs | grep -c 'bo-sidebar-nav'   # 6   <- EXACT when written
       grep -c 'bo-sidebar-nav' examples/po-app/server.mjs                       # 8   <- today
       ```

       The instrument the cite used is recoverable and it is the plain line
       count: 6 = one `<nav class="bo-sidebar-nav">` plus five links. Walking
       every revision of that file, it went stale twice in one evening, both
       times because po-app grew a screen:

       ```
       40a18f1e  2026-08-22T20:22:36+08:00  "116.2: /inbox dogfooded into po-app"    6 -> 7
       b5a3081b  2026-08-22T22:22:58+08:00  "30.4b: movements dogfood"               7 -> 8
       ```

       So `/components/sidebar-nav` has published `6` for **eight days**, and
       the entry is stamped `"scored": "2026-08-23"` — the day AFTER it stopped
       being true.

       **This is a different defect class from 216.1 and the difference is what
       makes it worth recording.** 216.1's cite named a literal that had been
       removed two days *before* the score was taken: wrong on the day it was
       written, catchable by re-reading the file it describes. This one was
       right on the day it was written and was falsified later by a change
       **somewhere else entirely** — a new screen in the reference app, which no
       reviewer of `sidebar-nav` would think to look at. A cite of this shape
       has no wrong moment to catch; it has an expiry nobody is watching.

       **The score does not move, so no blind re-score is owed.** `fit: 3` asks
       whether the docs place the component in the contexts the field matrix
       assigns it. Six usages becoming eight is *more* placement, not less — the
       evidence got stronger while the sentence reporting it got wrong. Same
       call as 216.1, and `scored` stays `2026-08-23`; moving it would claim the
       independent second opinion §3b step 4 requires and this wake cannot run
       one.

       **The fix removes the quantity rather than refreshing it**, because a
       refreshed count decays again on the next dogfooded screen and this item
       is the proof. CLAUDE.md's criterion rule — name the PROPERTY, never the
       value it will have — applied to an evidence cite. Every element of the
       replacement was verified present FIRST, which is the discipline 216.1
       set:

       ```
       grep -c '<nav class="bo-sidebar-nav' examples/po-app/server.mjs   # 1   — ONE rail in the file
       grep -n 'const page = ' examples/po-app/server.mjs                # 105 — page(title, current, main, density)
       sed -n '20p' apps/docs/src/pages/components/offcanvas.astro       # <nav class="bo-sidebar-nav"> INSIDE <dialog class="bo-offcanvas">
       ```

       New cite: *"the shell rail; po-app renders it from ONE shared shell, so
       every screen carries it, and it composes inside `.bo-offcanvas` for the
       drawer pattern."* Both halves are properties of the code, not readings of
       it. Verified in the BUILT html, not the diff — `uses it at 6 sites` → **0**
       across every page in `apps/docs/dist`, the new sentence renders **1** on
       `/components/sidebar-nav`.

       **The surface's other five cites reconciled clean**, each checked against
       the shipped artifact rather than read: `--bo-density-font-size` on the
       link (`sidebar-nav.css:45`); zero raw colour (`grep -nE
       '#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\('` → no match); `14rem` (line 8)
       and `3.25rem` (line 92) with the derivation stated in the comment above
       each; the visually-hidden `1px` box named as the idiom (lines 112-132);
       `@container bo-shell` collapse hiding labels by `clip-path: inset(50%)`
       (line 129) and not `display: none` — the one `display: none` in the file
       is `@media print` on the rail itself (line 137), which the cite does not
       contradict.

       **One caveat recorded rather than promoted to a defect.** The
       `typography` cite calls the `0.05em` tracking *"intrinsic (same basis as
       combobox/form)"*. `combobox.css:124` is `0.05em` on an uppercase
       semibold `__group` heading — same basis and same value. `form-section.css:19`
       is `0.03em` on an uppercase semibold `__legend` — same basis, **different
       value** — and `badge.css:105` carries an unnamed third `0.05em`. Read as
       a claim about the *basis* (uppercase micro-headings need tracking) it
       holds exactly; read as a claim about the value it does not. Left alone:
       the cite says "basis", and rewriting a defensible sentence to pre-empt a
       misreading is the busywork §3b refuses.

       **Arm 4 holds too.** The `content` cite's *"both demos verified to use
       aria-current on genuine destinations"* is a count of the sections that
       carry `aria-current`, and it reads **2 then and 2 now** ("Grouped
       sections in an embedded shell" and "Markup") — the page gained a fourth
       demo section since scoring and it carries none, so the claim is
       untouched. Checked because it is the same shape as the defect above and
       the page is what moved; it survived.

2. [x] **217.2 — the count-bearing class measured across the whole rubric: 6 of
       240 cites, 4 exact, 2 stale. A gate is REFUSED, and the reason is not
       101.3 alone.**

       *Accept:* the base rate is measured before anything is proposed, and the
       proposal is decided on what it says. **Finding the class uniform, or
       uniformly clean, is a satisfying outcome** — 94.11 is the precedent where
       exactly that killed a carefully-written gate.

       ```
       node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components;
       const re=/\b(\d+)\s+(sites?|uses?|callers?|places?|instances?|copies|pages?|components?|screens?|glyphs?|consumers?|demos?|patterns?)\b/gi;
       ..."   # 240 cites total, 6 carrying a bare count
       ```

       All six, re-measured against the tree today:

       | cite | claims | measures | verdict |
       |---|---|---|---|
       | `navbar · fit` | po-app at 3 sites | `grep -c bo-navbar` = **3** | exact |
       | `dialog · fit` | po-app at 13 sites | `grep -c bo-dialog` = **13** | exact |
       | `offcanvas · fit` | 1 pattern screen | **1** | exact |
       | `tabs · fit` | 2 pattern screens | **2** | exact |
       | `breadcrumb · fit` | 2 of **19** pattern screens | 2 of **39** | denominator stale |
       | `sidebar-nav · fit` | po-app at 6 sites | **8** | stale — 217.1 |

       **Not a uniform predicate, which is the thing 94.11 requires checking
       before proposing a gate**: 4 of 6 are exactly right and 2 are wrong, so a
       detector here would distinguish. It would also be small — 6 of 240 is
       **2.5%**.

       **Refused anyway, on two grounds and the second is the interesting one.**
       101.3 forbids Polish adding gates, which settles it procedurally. But the
       gate is also not writable in the form the other cite-checkers take: every
       existing one asks *is this string present in that file*, and this class
       needs *does this number still equal a count taken over a different
       tree*. To check it, the cite would have to carry its own command — which
       is CLAUDE.md's "write the command next to the claim" arriving as a data
       format, not a gate, and that is a rubric change rather than maintenance
       of the existing ratchet. Recorded here for whoever may decide.

       **`breadcrumb · fit` is filed, not fixed — one round, one surface.** Its
       numerator is right and its denominator has doubled:

       ```
       ls apps/docs/src/pages/patterns/*.astro | grep -v /index.astro | wc -l                    # 39
       git ls-tree -r --name-only 37a1143a apps/docs/src/pages/patterns/ | grep .astro | wc -l    # 20 (cite said 19)
       git grep -l bo-breadcrumb 37a1143a -- 'apps/docs/src/pages/patterns/*.astro' | wc -l       # 2, then and now
       ```

       Same commit, same batch, same decay — and it gives the NEXT Polish round
       something no round since 176.1 has had: a pick with a measured reason
       instead of an unbroken `content: 3` tie. **Do not read this as a queue
       entry**; `breadcrumb` is not in `polish-state.md`, and rule 6 reads only
       `rounds` and `dry`.

3. [x] **217.3 — rule 5 was STALE for a second consecutive wake; this wake
       records a metric, which is what its own text says un-stales it.**

       *Accept:* `dispatch_status.py`'s rule-5 line no longer reports wake-dates
       of loop activity newer than its newest comparable pair — verified by
       running it after `record_metric.py`, not by assuming.

       184.1's whole finding was that this rule went on being answered from dead
       readings for ten wake-dates. It read `STALE` at Step 0b here with one
       wake-date newer, and the previous hand-off named recording a metric as
       the fix and then did not record one. `axe-violations` is the series its
       newest pair already uses and `test:axe` genuinely ran this wake, so the
       value is measured rather than manufactured.

## Slice 216 — Polish round on `data-table`: a DSA cite that was already stale on the day it was scored, and a cloud wake lapped by 37 slices (2026-08-30)

Dispatcher, top-to-bottom, each rule read rather than inherited from the
hand-off. Rule 1 clear — no open P0 (`grep -niE '\bp0\b' ROADMAP.md` returns only
closed slice headings and prose) and GitHub intake **0 open issues**, asked via
the API twice, at Step 0 and after the re-fetch below. Rule 2 `Standardize 0 / 4
ok`, rule 3 `Objective 0 / 3 ok`. **Rule 4 found nothing dispatchable**: all four
open items re-read by their own text, and the KIND of blocked named per 186.2 —
`112.3` owner-blocked (briefs + four answers), `112.4` owner-blocked (on 112.3's
verdict), `211.1` owner-blocked (a product call, its inputs corrected by 215.3),
AT runtime hardware-blocked (owner hardware). **Rule 5 could not be evaluated** —
`dispatch_status.py` reads `STALE`, one wake-date newer than its newest
comparable pair, and per rule 5's own text that is reported as un-evaluable
rather than as clear. **Rule 6 fired**; `polish_requeue.py --apply` re-queued 10
surfaces.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px or 390px
in either theme.** One rendered change ships — the `spacing` row of
`/components/data-table`'s "Design-system alignment" table now carries different
text. No element, class, style or CSS file changed; `git diff --stat` names
nothing under `packages/core/src`. `check:layout` (127 pages), `test:axe` (127 ×
2 widths) and `check:claims` swept green, and the corrected cite was verified in
the BUILT html rather than in the diff. **That is what ran; it is not the same
as having looked at the page.**

**⚠ THIS WAKE WAS LAPPED, AND THE PRE-COMMIT FETCH IS THE ONLY REASON IT NOTICED
— evidence for the still-open `175.4`.** Step 0 fetched `origin/main` and got
`52a50b58` (authored 19:50:33Z, highest slice **178**). By the `git fetch origin
main` Step 0c mandates before the first commit, `origin/main` was `724dc587`
(01:40:39Z, highest slice **215**): **151 commits and 37 slices** had landed in
between. The first of them — `74d8c2b8`, 21:44Z — is `Slice 179 — Objective grill
of 173/176/177/178`, which is **exactly the dispatch this wake had taken** from
rule 3 and had already carried to a finished report, two landed fixes and a
red-proof.

All of that was discarded, as Step 0c instructs the loser to do; nothing was
pushed. What this adds to `175.4` is that **Step 0c's stated cost — *"up to one
wake's work, discarded"* — understates this case.** The collision it models is
two wakes racing for the same item at roughly the same time. Here a slow cloud
wake was simply outrun: it planned, measured and wrote against a `ROADMAP.md`
that was 37 slices out of date for its entire duration, and every figure it
produced was about a tree nobody was on any more. The mechanism that caught it is
the process rule with nothing mechanical behind it, which is the half Step 0c
already calls the working one.

Part of the wall clock that made it lappable is measured and is fixed below:
three failed `git fetch --unshallow` attempts, ~10 minutes, all one stale lock
file (216.3).

1. [x] **216.1 — the Polish round is NOT a no-op: `data-table`'s `spacing` cite
       names a literal that 94.3 had removed from the file two days before the
       score was taken.**

       *Accept* (§3b, the reconciliation a `content: 3` re-queued surface gets):
       the surface's published artefact agrees with the ledger's record of it —
       the entry exists, the page renders it, and each citation still holds
       against the shipped CSS.

       **Pick, with its reason, because the score cannot rank.** All 10 re-queued
       surfaces are `content: 3` and 171.1 measured that no DSA dimension can
       order them; nine sit at 1/3 rounds and `scan` at 2/3, so the ledger's
       tie-break has no discriminator either. Picked by which surface's SOURCE
       actually moved, since that is the property that makes a citation go stale
       — and 182.1 is the precedent that exactly this happens:

       ```
       BASE=$(git rev-list -1 --before=2026-08-28T21:00:00 HEAD)   # 52a50b58
       git diff --numstat $BASE HEAD -- <surface paths>
       #  data-table  5 commits  +157/-0      <- picked
       #  alerts      1 commit    +71/-5
       #  the other seven          0/0
       ```

       **The first version of that instrument read `244 commits` for all nine**
       — an identical value across every input, which CLAUDE.md says is a defect
       until proven otherwise. It was: a stray `"*"` pathspec. Caught before the
       pick, not after.

       **The defect.** The `spacing` cite read *"the **1.75rem** compaction
       heights now state why they are literals and how they diverge from compact
       (94.2); reconciliation **queued** as 94.3"*. Both halves are false:

       ```
       grep -c '1\.75rem' packages/core/src/css/components/data-table/data-table.css
       #  0
       # walked back through all 40 revisions of that file:
       #  bafdb41f  2026-08-21  3 occurrences
       #  79f7fec9  2026-08-21  0   <- "94.3: the fourth density gets a name and a reason"
       ```

       94.3 did not stay queued — it **landed on 2026-08-21** and moved both
       heights out of the component into `--bo-density-auto-{row,control}-height`
       in `tokens/density.css`, which `data-table.css` then reads through
       `var()`. The entry is stamped `"scored": "2026-08-23"`, so the cite was
       **already two days stale when it was written**, and `/components/data-table`
       has published it to readers ever since. The CSS file's own comment says the
       opposite of the cite, in the same block.

       **The score does not move and no blind re-score is owed.** `spacing` is
       defined as a debt marker, not a quality signal; naming the heights instead
       of hard-coding them is *less* debt, so 3 was and remains right. What was
       wrong is the evidence record — 176.1's shape exactly.

       Corrected to what is true, and **every literal the new cite names was
       checked to be present in the file first**, so the replacement does not
       trip the same class of error: `390px` ×4, `68px`, `87px`, `28px`, `30px`.
       Verified on the rebuilt artefact, not the diff — in
       `dist/components/data-table/index.html` the stale string
       `1.75rem compaction heights` and the phrase `reconciliation queued as`
       both return **0**, and the new sentence renders.

       The other five cites were reconciled in the same pass and **all hold**:
       `--bo-font-size-mono-inline` ×1 and `__col--code` ×1 and `0.03em` ×1
       (typography); 3 hex literals, each confirmed inside the `@media print`
       block by brace-depth rather than by eye (colour); `:has(` ×9 and one
       native `popover` (interaction); the clause *"Not for laying out a page"*
       present on the page (content); the split-column rule present (fit).

2. [x] **216.2 — REFUSED: a gate for that class, even though its base rate says
       it would distinguish. `101.3` forbids Polish adding one, and the obvious
       widening kills the detector.**

       Measured before proposing it, which is the part worth keeping:

       ```
       # across all 40 components' DSA cites, every cite naming a CSS length
       # literal, checked against that component's own CSS directory
       cites naming a literal ............ 74
       literal present in that CSS ....... 73
       missing ............................ 1   <- data-table · spacing · 1.75rem
       ```

       That is the *opposite* of 94.11's dead predicate (155 of 155 already
       true): here it is false for exactly the one real defect, so it
       distinguishes and it is `@exact` — substring membership, not recognition.

       **It is still refused, for two reasons and neither is taste.** First,
       `LOOPS.md` §3b: *"Polish is maintenance of the existing ratchet only… It
       may NOT add dimensions, definitions or gates."* 176 refused a gate on the
       verbatim-clause arm for the same rule, and reversing it from inside a
       Polish round is the scope creep the Objective refuses.

       Second, and this is the measurement a later wake needs: **the widening
       that looks obviously correct destroys the signal.** Also searching
       `packages/core/src/css/tokens/` would make the check "is this literal
       anywhere in the shipped CSS", and `1.75rem` **is** in `density.css` — the
       gate would have passed on the defect it was written for. The scope to the
       component's own directory is what carries the signal, and its false-positive
       mode is a cite that deliberately names a token-file value. That mode has a
       base rate of **0 of 74** today and is not hypothetical for long.

       Recorded with its commands so whoever may add gates can decide without
       re-deriving it.

3. [x] **216.3 — `ENVIRONMENT.md` trap **2b**: a timed-out `--unshallow` leaves
       `.git/shallow.lock`, and the file's own recipe hides the recovery.**
       Bit for real this wake, three attempts, ~10 minutes.

       The first `git fetch --unshallow origin` was killed by a 300s timeout —
       long enough to create the lock, not long enough to finish. Every later
       deepening fetch (`--unshallow` and `--deepen=1500` alike) then refused
       while `git rev-parse --is-shallow-repository` kept reading `true` at 50
       commits. `rm -f .git/shallow.lock` and one more fetch gave **1,554**.

       **The reason it took three attempts is the recipe, not the lock.** Git
       names the lock file in the FIRST line of its refusal; the tail is only
       *"…may have crashed in this repository earlier: / remove the file manually
       to continue."*, which names nothing — and trap 2's command was written to
       be run through `| tail -2`. Trap 2 now ends with
       `git rev-parse --is-shallow-repository`, because **the fetch's own output
       is not the check**; 2b carries the lock and the recovery.

       Load-bearing rather than cosmetic: at 50 commits every history figure the
       discarded grill produced would have been silently wrong, which is trap 2's
       stated cost arriving on cue.

*(This entry is deliberately shorter than its material. 177's observation —
that a slice which also has a full write-up elsewhere pays for the text twice —
is still unacted and still the owner's call; not padding one entry is not a
convention change.)*

## Slice 215 — Objective grill of Slices 211, 213, 214: the open item's refusal cites a page that does not say it, and every container htmx measurement ran a version the app does not ship (2026-08-30)

**Not new input** — nothing was filed, nobody asked, GitHub intake is **0 open
issues** (asked via the API, not inferred). Dispatched by rule 3:
`dispatch_status.py` read `Objective 3 / 3 slices OVERDUE [211, 213, 214]`,
which is the dispatch the previous hand-off predicted. Full report:
`.roundtable/grill-objective-211-213-214-2026-08-30.md`.

**Honest scope: the whole armed set, no narrowing needed.** The playbook's step
0 check was run rather than assumed — `grep -hoE '^## Slice [0-9]+ — Objective
grill of [^(]*' ROADMAP.md ROADMAP-archive.md` shows the newest grill is Slice
212, covering 200/208/209, and **no prior grill names 211, 213 or 214**. This is
the first grill since 212 whose armed set contains no already-grilled slice, so
the hand-narrowing 207, 209 and 212 each had to do did not recur.

**Slice 214 reproduces to the digit and nothing in it is corrected.** All four
lanes re-run here (0 dead of **1,433**; 74 files / **242** rules / **230**
distinct / **8** repeats; **9** corpus + **12** family = **14** distinct, all
verdicted; ratchet `ROADMAP.md` **0 up, last cut `e29c7c18`**). 214.1's
conservation verified structurally from git rather than from its write-up:
`--numstat` reads `1575 0` on the archive (pure append) against `73 1549` on the
live file, `--name-status` reads **M / M never A**, the appended block walks to
**7 headings + 1,568 body = 1,575**, its headings are exactly the seven claimed,
and the archive's prior content is a **byte-exact prefix** (1,606,855 →
1,706,575 bytes). `check:slice-refs` re-run here reads **427 / 233 / 196 / 2**,
identical to 214's before-and-after.

**214's falsification of 179.2 also reproduces**, re-derived over every
`ROADMAP.md`-touching commit (801 now, 799 then): all four closed cycles match to
the digit, so the fourth cycle's regrowth (4,394 > 4,262) and peak (6,424) do
break 179.2's monotone claim. **What this grill adds is the interval, not the
rate** — the fifth cycle has since closed at 9 commits / 896 lines / 99.6 per
commit, and the commits a cycle survives now read **140 → 66 → 34 → 66 → 9**.
The sweep is due roughly every nine `ROADMAP.md`-touching commits, which is why
it has fired on consecutive days.

**The three findings all land in what shipped BESIDE a red-proved number**, which
is roadmap 192.1's shape. 213's own load-bearing measurement was red-proved in
three directions and is correct; its neighbours are where the defects are.

1. [x] **215.1 — DONE 2026-08-30 (cloud wake). 213's one self-declared
       unverifiable claim is now verified, and it holds.** 213.1 closed with
       *"this could not be verified on CI from here"*, and named a residual risk:
       criterion (c) compares two reads of the same element at different moments,
       so a layout change between them would show as a non-zero delta.

       213.1 landed as `926bd36e` and was pushed with `dd76ee84` on top (one push
       per wake), so **CI ran on `dd76ee8`, which carries the fix** —
       `git show dd76ee84:packages/core/src/js/behaviors/windowed-list.ts | grep
       -c measuredChunkHeight` → **3**. CI run **663** is `success` on **6 of 6**
       jobs, and *Pseudo-locale + reference app + ERP suite + scaffold freshness*
       logs `po-app smoke check passed — 19 behaviours verified end to end`.

       **Non-vacuous by the gate's own construction** — 211.2's argument reused
       rather than restated: 208.3's htmx precondition is one of those 19, so a
       green run entails htmx loaded from the real CDN AND the new
       `spacerMatchesReal` AND `anchorShift <= 2`. Run **664** is a second green
       on the same code. The residual risk did not materialise. **n = 2 post-fix
       CI runs**, which is what this supports and no more.

2. [x] **215.2 — DONE 2026-08-30 (cloud wake). Every container measurement
       behind 211.2 and 213 ran htmx 2.0.10 against an app that pins 2.0.4, and
       neither slice says so.**

       ```
       grep -n 'unpkg.com/htmx' examples/po-app/server.mjs   # 2.0.4
       node -p "require('./node_modules/htmx.org/package.json').version"  # 2.0.10
       find . -name 'htmx.min.js'   # node_modules/htmx.org/... — the ONLY one
       ```

       211.2 states its shim served `node_modules`. 213's control — whose whole
       purpose was removing the shim's confound — **does not record which htmx it
       served at all**, and there is exactly one local candidate.

       **What this does and does not touch, stated separately.** 213's *defect
       diagnosis* is untouched: `3250 vs 3299` is arithmetic over rendered row
       heights and no htmx version moves it. What it touches is the **timing**
       figures either side of it (`anchorShift > 2` in 14/20 and 12/20; `0 in 40
       of 40`), which are races against a fixed 150ms wait. That matters because
       211.2 reasoned explicitly about a timing confound and 213 then wrote that
       the confound *"was named and removed"* — it was removed for
       **interception**; the version divergence is a second one, unnamed.
       **215.1 is the mitigation**: CI runs the real 2.0.4 and is green.

3. [x] **215.3 — DONE 2026-08-30 (cloud wake). 211.1's refusal premise is
       measurably FALSE, and its cost estimate rests on another workspace.**
       Both halves of the argument holding that open item were checked against
       the artefacts they name, not against the sentences naming them. See the
       correction now recorded inside 211.1 itself. The item stays **OPEN** —
       refuting the premise does not make the product call, which is the owner's.

**The gate question, asked and answered NO — with the reason, not silently.**
LOOPS.md's operating rules ask whether the gate that should have caught this
exists and can fail. For 215.3 it would have to check that *a roadmap item's
prose claim about a docs page is true of that page*, and for 215.2 that *a
recorded measurement names the version of the dependency it served*. Both are
the semantic class roadmap **94.11** paid for: the shape is checkable, the
meaning is not, and a detector for "this sentence describes that file" would be
the ceremony that item refuses. `check:slice-refs` already covers the one
mechanical half — that a cited slice resolves — and it does not and should not
judge what the citation says. **Recorded as no-gate, deliberately.** What
generalises instead is the method note in the report: read the artefact a claim
describes, not the sentence describing it. Both defects died to that one check.

## Slice 214 — Standardize sweep: lanes 1-3 clean for the sixth time, and lane 4 carries the finding again — the archive sweep is due a SIXTH time, one day after the fifth (2026-08-30)

**Not new input** — nothing was filed, nobody asked, and GitHub intake is **0
open issues** (asked via the API, not inferred). Dispatched by rule 2:
`dispatch_status.py` read `Standardize 5 / 4 OVERDUE`, which is the counter the
previous hand-off predicted would fire.

**All four lanes ran; say `n of 4`.** This is 4 of 4, and it is recorded that way
because 194, 197, 202 and 206 each ran three and 208 was the slice that found
them doing it.

| lane | command | result |
|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** of 1,433 live inline declarations (161.1 read 0 of 1,428) |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | **8 repeated bodies**, LOOPS.md's table exactly; 237→242 rules, 225→230 distinct, repeats unchanged |
| 3 report:prose | `npm run report:prose -w docs` | **0 unverdicted pages** — 9 over corpus, 12 over a family median, 14 distinct, all carrying a verdict |
| **4 loop-prose** | `python3 scripts/loops/report_loop_prose.py` | **the finding, below** |

**Lane 2's delta is zero and that is the whole reading.** All eight groups match
the table in `LOOPS.md` byte for byte; the joined-control `x4` group is still
**two** components (money, quantity), so its stated reopen trigger — a THIRD
component — is unmet. The +5 rules and +5 distinct bodies produced no new repeat.

**Lane 3's flagged set is 14 pages and every one is verdicted**, checked against
the source rather than assumed: **158.1**'s twelve (`/components/` data-table,
richtext, form, calendar, money, combobox, tabs; `/concepts/` which-pattern,
layouts, design-language, js-behaviors; `/base/motion/`; `/patterns/`
editable-grid, list-report, output-form), **161.1**'s three family-split adds,
and **178.3** for `/concepts/scale/` — which is the one a naive check misses,
because it is flagged on the FAMILY axis only and is absent from 158.1's list.

**Lane 4 — the finding. The live file is 50.8% closed history one day after the
fifth sweep.** Two independent instruments agree on the scope:

```
python3 scripts/loops/report_loop_prose.py     # ratchet: ROADMAP.md 8 up, last cut 83192cd1
# and 177's scope instrument, verbatim from ROADMAP-archive.md Slice 177:
#   OPEN: [15, 112, 211]
#   7 closed slices carrying 1568 lines here; 0 already in the archive
#   targets: 213, 212, 210, 209, 208, 201, 200
```

A second, independently-written pass over the same file classifies every `## `
section by span and reconciles to the line: **3,085 lines = 740 pointer stubs
(185 sections) + 1,653 resident-closed spans (8) + 375 open-carrying (3) + 310
doctrine (3) + 7 preamble**, with open/closed item counts of **4 / 26** matching
a raw `grep -c` of the checkboxes. The two differ by exactly the 7 heading lines
plus the 78-line `## STATE` section, which is a non-slice H2 and out of scope for
165.1's reason. **50.8%** is 208's own definition (body lines ÷ live lines), so
it is comparable to its 67.5%.

**Both of this instrument's first outputs were wrong and were caught before
use**, per CLAUDE.md's base rate: the span pass reconciled to 3,086 against a
3,085-line file (an off-by-one on the trailing newline), and it classified
**Slice 210 as doctrine** because that slice carries no `N. [x]` checkbox at all
— a narrative slice recording a refusal. The second defect is the one that
mattered: it under-reported resident closed history by 101 lines and would have
put a closed slice out of scope.

**179.2's correction is itself now falsified, by the two cycles that have closed
since it was written.** It corrected 177's "the sweep is not converging" by
observing that regrowth-per-cycle and the peak a wake walks were both falling
monotonically (4,262 → 3,367 → 2,364; 9,824 → 4,461 → 3,872). Re-measured over
all 799 `ROADMAP.md`-touching commits, both terms reversed on the very next
cycle:

| cycle starts | after | peak | commits | regrowth | per-commit |
|---|---|---|---|---|---|
| `16ef2bb8` | 5,562 | 9,824 | 140 | 4,262 | 30.4 |
| `063211cc` | 1,094 | 4,461 | 66 | 3,367 | 51.0 |
| `187ab92d` | 1,508 | 3,872 | 34 | 2,364 | 69.5 |
| `2ae54a4a` | 2,030 | 6,424 | 66 | **4,394** | 66.6 |
| `83192cd1` | 2,301 | 3,085 | **8** | 784 | **98.0** *(open)* |

The fourth cycle's regrowth (4,394) exceeds the first (4,262) and its peak
(6,424) exceeds every cycle but the first. The open fifth is at **98.0
lines/commit**, the highest per-commit rate in the record — but over **8 commits
only**, so it is reported as a rate with its n and nothing is concluded from it
alone. What IS concluded, on the closed cycles only: 179.2's monotone claim
described three cycles and does not survive the fourth. The falsifier is the
same detector 177 used — drops found by line count, not by subject line — which
finds **6** hits, 5 real sweeps plus the `c5d21fb4` false positive 177 already
recorded.

1. [x] **214.1 — DONE 2026-08-30 (cloud wake). Sixth archive sweep: 7 closed
       slices, `ROADMAP.md` 3,197 → 1,650 lines. Sweep the seven closed slices
       to `ROADMAP-archive.md`.**
       Targets re-derived from the checkboxes at move time, never read off the
       table above. Hand-checked move, not a script that rewrites prose:
       CLAUDE.md's bulk-edit rule applies with force on this exact pair of
       files, where a case-collision once destroyed 7,307 lines and the only
       tell was `git status` showing **modified** rather than **added**.

       *Accept* — each names a property to verify, never a value it will have:
       - Every moved slice is **byte-identical** in `ROADMAP-archive.md` and
         leaves a pointer of the established shape in `ROADMAP.md` with its
         heading unchanged.
       - The moved set is **disjoint from the OPEN set re-derived from the
         `N. [ ]` checkboxes**, and no non-slice H2 section is touched.
       - Conservation reconciles exactly on both sides — the archive's growth
         equals the live file's loss plus the inserted pointer stubs — with the
         residual accounted for, not waved at.
       - The archive's prior content is a **byte-exact prefix** of the new one.
       - `git status` shows `ROADMAP-archive.md` as **M**, never **A**.
       - `check:slice-refs` passes and its counts are reconciled against the
         source; the baseline before the move is **426 citations / 233 cited /
         195 slice numbers / 2 known-dangling**.
       - Regenerated `STATUS.md` finds the same number of open items as a raw
         `grep -c` of the `N. [ ]` checkboxes in the source.
       - Before and after line counts of both files are recorded.
       - **Finding the premise false is a satisfying outcome**: if the
         re-derived target set at move time is empty or differs from the seven,
         that is recorded as the result rather than forced to match.

       ---

       **The premise held.** OPEN re-derived at move time was
       **`[15, 112, 211, 214]`** — this slice's own open item is in it, which is
       why the order matters: filing 214 first makes it structurally impossible
       for the sweep to move the slice describing it. Targets came back as the
       same seven in live-file order: **213, 212, 210, 209, 208, 201, 200**.

       **Every Accept property verified, structurally:**

       ```
       byte-identical in archive .............. 7 of 7
       pointers correct, headings unchanged ... 7 of 7
       moved ∩ open ........................... [] (empty)
       non-slice H2 sections still present .... 4 of 4
       archive prior content a byte-exact prefix  True
       git status ............................. M / M, never A
       check:slice-refs ....................... passes, counts UNCHANGED
       ```

       **Conservation reconciles exactly, on both sides:**

       ```
       ROADMAP.md       3,197 -> 1,650   (-1,547)
       ROADMAP-archive 25,633 -> 27,208  (+1,575)

       live:    1,568 body lines moved - 21 pointer stubs (7 x 3) = 1,547  ✓
       archive: 1,568 body lines + 7 headings                     = 1,575  ✓
       # 1,650 is the count AT MOVE TIME. `wc -l ROADMAP.md` reads 1,721 once
       # this result block is written back into the file — which is the trend
       # this slice is about, arriving on cue, exactly as 177.1 recorded.
       ```

       **`check:slice-refs` does not move, and that is the correct result rather
       than a missing signal** — 427 citations / 233 cited / 196 slice numbers /
       2 known-dangling, identical before and after. The gate resolves against
       `live + archived` as one corpus and excludes `ROADMAP*` from citation
       extraction, so a sweep moves text *within* what it reads. 177 saw +1s
       only because it filed a new slice in the same commit; this sweep filed
       its slice in the preceding commit, where the same +1s appeared.

       **The verifier was red-proved by injection before it was believed**, in
       three directions, each injection confirmed to have landed rather than
       assumed:

       | injection | landed | byte-identical score |
       |---|---|---|
       | one word changed inside Slice 209's archived body | 1 word | 7 → **6** |
       | Slice 200's archived body truncated | 16 bytes | 7 → **6** |
       | one byte prepended to the archive | 1 byte | prefix True → **False** |

       That check matters here more than the usual amount: a structural
       comparison between two files, one of which was just written from the
       other, is exactly the shape CLAUDE.md names as *"a reconciliation that
       cannot see past its own caller"*. The control run scores 7 of 7 and each
       injection moves it, so it distinguishes.

       Gates green in this container: core build, `npm run test` **152/152** (27
       files), `lint:css`, `docs:build` rc=0, `check:repo`, `check:claims` 158
       live + **3 NOT VERIFIED** (ENVIRONMENT §6b — a container property, not a
       regression), `check:formatting`, `check:layout` 127 pages, `test:axe`
       127 pages × 2 widths zero violations.

       **NOT VERIFIED, named rather than implied:** no Podman, no
       `localhost:8081`, and **no screenshots at 1440px or 390px in either
       theme**. Nothing this item claims rests on a rendered image — the change
       is markdown-only in two files no page renders, and every figure above is
       a line count, a byte comparison or a gate's own output.

## Slice 213 — P0: a windowed-list spacer is sized from ONE sampled row that is not representative, so every evicted chunk is 49px short and re-loading it jumps the scroll (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 212 — Objective grill of the 200/208/209 window: a refusal's own base rate missed the declaration its cited gate names in its header, and the arming set needed narrowing for the third grill running (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 211 — two things 208.3's root-cause turned up: a reference app that cannot run without the public internet, and a scroll-anchor assertion nobody had ever exercised in a container (2026-08-29)

**Filed by the cloud wake that closed 208.3, not built by it.** Both are real
measurements from that investigation; neither is what 208.3's Accept asked for,
and building either inside it would have been widening the item.

1. [x] **211.1 — `examples/po-app` cannot run without reaching a CDN, and the
       cost of that landed on a gate rather than on a user.** `server.mjs:125`
       is `<script src="https://unpkg.com/htmx.org@2.0.4"></script>`, while the
       same shell already serves `/assets/css/htmx.min.css` locally — so the app
       is half-vendored today. In an egress-restricted container the script
       404s at the proxy and the app silently loses every htmx behaviour;
       `check:po-app` spent four runs across two containers reading that as an
       eviction bug (208.3).

       **The refusal that filed this is recorded rather than assumed away:**
       vendoring changes what the reference app *teaches* — a real consumer
       wiring htmx from a CDN, which is what `/getting-started/htmx` documents —
       so it is a product call, not a diagnostic side effect. `htmx.org` is
       already a dependency in `node_modules`, so the mechanism costs nothing;
       the question is entirely whether the example should stop demonstrating
       the CDN wiring.

       *Accept:* one of — (a) htmx is served locally by the app and
       `/getting-started/htmx` still shows the CDN form as the thing a consumer
       writes, with the divergence stated on the example's own page; or (b) the
       CDN stays and this item records the reason it is worth an app that cannot
       run offline. Either way, `check:po-app`'s own result in an
       egress-restricted container is re-measured and written down — **finding
       that (a) makes it 19 of 19 here is a satisfying outcome, and so is
       finding it does not.**

       ---

       **CORRECTION 2026-08-30 (Objective grill, Slice 215.3). Both halves of
       the argument above are wrong as measured. The item stays OPEN — this
       corrects the inputs, it does not make the call.**

       **(i) The refusal premise is FALSE: no docs page teaches the CDN
       wiring.** The reason recorded above for not vendoring is that it changes
       what the app teaches — *"a real consumer wiring htmx from a CDN, which is
       what `/getting-started/htmx` documents"*. Plain fixed strings, counted
       before any context (CLAUDE.md's rule, after the position-filter incident):

       ```
       p=apps/docs/src/pages/getting-started/htmx.astro     # 270 lines
       grep -c unpkg $p       # 0     grep -ci cdn $p         # 0
       grep -c jsdelivr $p    # 0     grep -c 'script src' $p # 0
       grep -c install $p     # 0     grep -c 'npm i' $p      # 0
       grep -rl unpkg apps/docs/src/ | wc -l   # 0 files
       grep -rli cdn  apps/docs/src/ | wc -l   # 0 files
       ```

       That page's single `<script>` (line 202) is its own behaviour block, not a
       consumer snippet. What it documents is the **integration** — the opt-in
       `@busy-office/ui/css/htmx` stylesheet, the swap recipes, and the
       `initDialogs`/`initDataTables` wiring. It never says how to load htmx by
       any route. Repo-wide, `unpkg` survives in exactly one piece of live code
       (`examples/po-app/server.mjs:125`) plus one comment *about* that line
       (`check-po-app.mjs:320`); every other hit is `ROADMAP*`/`ENVIRONMENT.md`
       bookkeeping. **So the CDN form is not a documented contract that
       vendoring would break** — it is an implementation detail of one example,
       referenced by nothing that teaches. The question is now whether to **add**
       teaching the docs do not yet carry, not whether to preserve it.

       **(ii) "The mechanism costs nothing" rests on a DIFFERENT workspace's
       dependency.**

       ```
       node -p "require('./package.json').workspaces"  # ['packages/*','apps/*'] — no examples/*
       cat examples/po-app/package.json                # dependencies: @busy-office/ui ONLY
       ls -d examples/po-app/node_modules              # No such file or directory
       grep -n '"htmx' apps/docs/package.json          # 51: "htmx.org": "^2.0.10"
       ```

       `node_modules/htmx.org` exists only because **`apps/docs`** declares it.
       `examples/po-app` is not a workspace, declares no htmx, and has no
       `node_modules` — and its own `package.json` calls it a *"reference
       consumer … uses ONLY documented APIs"*, which is exactly the property
       borrowing a sibling workspace's dependency would break. Option (a) costs a
       declaration or a vendored file, and the version it resolves to today
       (**2.0.10**) is not the version this page pins (**2.0.4**).

       **Finding the premise false is what this item's own Accept calls a
       satisfying outcome.** Recorded; the decision remains the owner's.

       **CLOSED 2026-08-30 (owner call, option (a)).** `examples/po-app`
       vendors htmx locally rather than staying CDN-wired.
       `server.mjs` resolves `htmx.org/dist/htmx.min.js` via
       `require.resolve` (the same pattern already used for
       `@busy-office/ui`'s dist) and serves it at `/vendor/htmx.min.js`;
       the `<script src="https://unpkg.com/...">` tag is gone. `htmx.org`
       is now `examples/po-app/package.json`'s own declared dependency,
       pinned `^2.0.10` — matching what `apps/docs` already pins, not a
       third version — rather than borrowing a sibling workspace's
       `node_modules` as (ii)'s correction warned against; the previous
       script tag pinned 2.0.4, so the shipped version moves to 2.0.10.

       `check:po-app` passes **19 of 19** (a stale local `busy-office-ui.tgz`
       + gitignored `package-lock.json` briefly hid the fix from 213.1 —
       reinstalling from a fresh pack + no lockfile resolved it, and is a
       fresh instance of the "stale image serves the old build" trap this
       file already warns about). The Accept's egress-restricted measurement
       was taken directly rather than assumed: `podman build -f
       examples/po-app/Dockerfile` (the real tarball-consumer path, not the
       dev shortcut) then `podman run --network none` — zero egress, no DNS
       — and from inside that container `/vendor/htmx.min.js` returns
       `200 OK` and the page's only `<script src>` is the local route. **19
       of 19 here, offline, is the satisfying outcome the item's own Accept
       named.**

2. [x] **211.2 — `check:po-app`'s scroll-anchor assertion has never run in a
       cloud container, and the first four times it did, it read 98 / 49 / 0 / 0
       against a threshold of ≤ 2.** The assertion is *"windowed list: scrolling
       back re-loads the chunk with NO scroll jump and NO lost selection"*,
       which requires `anchorShift <= 2`. Until 208.3 it passed here **only
       vacuously** — with htmx blocked nothing ever moved, so `anchorShift` was
       0 by construction. Served htmx locally, it moved.

       ```
       run 1  anchorShift 98      run 3  anchorShift 0
       run 2  anchorShift 49      run 4  anchorShift 0
       ```

       Every other field in the payload held in all four (`chunk0Reloaded`,
       `scrollShift 0`, `checkboxRechecked`, `countAtEnd "1 selected"`,
       `midRowIndexOk`). **Stated no more strongly than the instrument
       supports:** the measurement was taken through a request-interception
       shim that serves htmx from memory, which is *not* how any real
       environment loads it, so the timing is not the shipped timing. It is
       filed because 2-of-4 red on a shipped correctness property is not a
       thing to leave unrecorded, not because the framework is accused.

       *Accept:* the anchor property is measured where htmx loads the way it
       actually ships — CI, or a local wake — over enough runs to say whether
       `anchorShift` exceeds 2 there at all; then either a defect is named with
       the measurement that names it, or this item records that the variance is
       the shim's and closes. **Finding the premise false — that it is stable
       everywhere htmx loads normally — is a satisfying outcome.**

       Re-runnable: the probe is the gate's own `page.evaluate` block copied
       verbatim with `page.setRequestInterception` fulfilling
       `https://unpkg.com/htmx.org*` from `node_modules/htmx.org/dist/htmx.min.js`.

       **CLOSED 2026-08-30 (cloud wake). The premise is FALSE: the variance is
       not the shim's, and the mechanism is a real defect in shipped code** —
       filed as Slice 213. Both halves of the Accept were measured.

       **The shipped path (CI, real CDN) holds.** Run 662 on `c60ee88`, job
       *Pseudo-locale + reference app + ERP suite + scaffold freshness*, logs
       `po-app smoke check passed — 19 behaviours verified end to end`. That is
       **non-vacuous by the gate's own construction**: 208.3's htmx precondition
       is one of those 19, so a green CI run entails htmx loaded AND
       `anchorShift <= 2`. Across the last 30 `ci.yml` runs on `main`
       (633-662), **23 concluded `success`**, each of which entails the po-app
       job passed — a lower bound, since the 7 non-successes (642-646 are
       ROADMAP 204's `check:claims` P0, plus 655 and one `cancelled`) were not
       attributed per-job.

       **The container disagrees, with htmx over a REAL HTTP round-trip and
       NO request interception at all.** The confound in 208.3's evidence was
       named and removed rather than argued away: interception delays *every*
       request, including htmx's own chunk fetches, which is the timing under
       test. The control instead repoints the app's one `<script src>` at a
       local static server (injection asserted unique before replacing, copy
       deleted on exit) and intercepts nothing:

       ```
       interception shim, 20 runs   anchorShift > 2 in 14   values {0, 49, 98}
       CONTROL, no interception,
                        20 runs     anchorShift > 2 in 12   values {0, 49, 98}
       ```

       So `anchorShift` exceeds 2 somewhere the shim is not involved. **The
       item's own suggested close — "the variance is the shim's" — is refuted
       by its own control.**

       **What varies is quantized, and that is what named the defect.** Only
       three values ever occur, and 98 = 2 x 49. The diagnostic that separates
       pass from fail is *which row gets picked as the anchor*: every shifted
       run picked `aria-rowindex` **902**, every clean run **106/107**, with no
       overlap. `evictedCount` is **9 in 12 of 12** runs, so it is NOT "how far
       the scroll loop got" — the first hypothesis, measured and discarded. The
       split is whether the evicted chunks have re-loaded by the gate's fixed
       150ms wait.

       **Then the 49 was measured directly rather than inferred.** Parking at
       the top and letting chunk 0 re-load, its spacer against what it actually
       renders at, 4 of 4 runs:

       ```
       chunk 0 spacer 3250px   ·   chunk 0 renders 3299px   ·   err +49px
       ```

       and the row heights say why: chunk 0 holds **98 rows at 33px and 2 at
       32.5px**, and `windowed-list.ts` samples the FIRST row — one of the two
       outliers — then extrapolates it over all 100. That is Slice 213.

       **Not filed as a defect: the gate.** Its 150ms wait is what decides
       whether a given run exposes the 49px, so the assertion is timing-
       sensitive — but it is timing-sensitive about a **real** scroll jump, and
       the right fix is 213, not a longer sleep. Re-measure this assertion after
       213 lands rather than tuning it now.

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

