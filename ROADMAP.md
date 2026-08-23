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

## Slice 134 — `test:visual` is red, and nothing runs it (2026-08-23)

Found while verifying 131.1: the wake needed dark-theme screenshots, which
led to checking how the visual-regression gate takes its own. It takes them
wrong, and has for days.

**Three separate faults, each enough on its own:**

1. **It sets a key nothing reads.** `visual-regression.mjs` does
   `localStorage.setItem('bo-theme', t)`. `PrefBootstrap` reads
   **`bo-theme-pref`** — renamed in roadmap 119. So the "dark" half of every
   run has been photographing **light** pages under dark filenames. Measured
   directly: with `bo-theme` set to dark the page resolves `data-theme=light`;
   with `bo-theme-pref` it resolves dark.
2. **The baselines are stale.** A full run fails **40 of 40** shots, most on
   page HEIGHT (e.g. `_components_tree_-dark-1440` 2252px → 2655px) — pages
   have grown across many slices with nothing re-baselined.
3. **No workflow runs it.** `grep test:visual .github/workflows/*.yml`
   returns nothing. This is the project's own rule — *a gate that needs a
   human to start it is not a gate* — and it is worse than an absent gate,
   because `npm run test:visual` existing reads as coverage.

Fault 1 is the dangerous one: fix the staleness alone and it goes green
while measuring dark **nowhere**. A detector that cannot fail, in the exact
shape the CLAUDE.md doctrine describes.

1. [ ] **134.1 — fix the key, and prove the dark half is dark.** *Accept*:
       `bo-theme-pref`; then assert in the harness itself that a shot
       labelled dark was taken with `data-theme="dark"` resolved — the
       rename could happen again, and a filename is not evidence.
2. [ ] **134.2 — re-baseline deliberately, never blind.** *Accept*: each of
       the 40 diffs is inspected and its change attributed to a real, known
       edit before `--update` runs. The standing rule is explicit: don't
       blind-`--update` away every failure.
3. [ ] **134.3 — CI, or delete it.** *Accept*: either it runs in `ci.yml`
       (with the runner-noise question answered — antialiasing across
       machines is why a pixel budget exists) or the script and its
       baselines are removed and `check:layout` + `test:axe` are named as
       what covers this. **Do not leave a third option**: a gate that runs
       nowhere is the status quo that produced this slice.

## Slice 133 — Owner: prove the scrolling actually works (2026-08-23)

Owner input, verbatim: *"UI Component - tables / Patterns like Page Object -
pls also test scrolling on UI ... to ensure that it is working properly."*

A verification ask, and triage says the instinct is already right — there is
a hole exactly where the owner is pointing:

- **`check:layout` EXEMPTS the scroll containers.** Its overflow rule skips
  `.bo-data-table-container, .scale-scroll, pre` — correctly, because those
  are *supposed* to overflow. But nothing then checks that they actually
  **scroll**. The framework's whole answer to a wide table is "it scrolls in
  its container", and that answer is asserted nowhere.
- **A shipped composition already breaks it**, found by screenshot in
  130.2b and still open as **GAP-6**: `bo-stack` on `bo-app-shell__main`
  collapses a scrollable table container to its header row — two correct
  primitives composing into silent data loss, and it is the composition a
  careful reader tries first.
- What *does* exist is per-page and narrow: `check:claims` drives real
  scrolling for three specific claims (a dropdown staying anchored, the tab
  strip scrolling rather than wrapping, a sticky column staying opaque).
  Three pages, hand-picked. Not a sweep.

1. [ ] **133.1 — a scroll sweep, red-proved.** Every built page carrying a
       scroll container gets driven, not inspected. *Accept*: for each
       `.bo-data-table-container` that overflows — (a) setting `scrollLeft`
       moves it and reads back non-zero (a container that overflows but
       cannot scroll is the GAP-6 failure); (b) it is keyboard-reachable
       (`tabindex="0"`, the axe scrollable-region rule); (c) the PAGE does
       not scroll sideways instead — the container absorbs it. Run at 1440
       **and** 390, both themes not required (this is geometry, not colour).
       **Red-proof is mandatory and specific**: inject `overflow: visible`
       on a container and confirm the sweep goes red, then check the
       injection landed in the DOM — not merely in the file — per the
       standing trap list.
2. [ ] **133.2 — object-page, scrolled for real.** The pattern has a sticky
       anchor bar and a scroll-spy, and Slice 108 already fixed a sticky
       bleed-through P0 there, so this is a surface with a history. *Accept*:
       scroll to each section and assert the spy marks the section whose
       content is at the top (the 48-spike's own lesson: spy by measuring
       against the bar's bottom edge, so the check must too), the bar stays
       visible, and nothing sticky overlaps anything else sticky. Drive real
       scroll events — a synthetic `scroll` on `document` matches no
       delegated handler and reports a false pass.
3. [ ] **133.3 — whatever 133.1/133.2 find is a P0, not a note.** GAP-6 is
       already one of them and is fixed under this item rather than 130.2, so
       the fix and the check that proves it land together.

## Slice 132 — Owner wishlist: date entry, three pickers, list-to-list (2026-08-23)

Owner input, verbatim: *"Date Input field should be under Data Input? and can
remove deprecate one from values / Search Help / Calendar selection (1 month,
2 months, 3 months display) / File open/save panel pattern / List to List drag
& drop"*

Five asks. Triage checked each against what already ships before queuing it,
because three of the five turn out to be partly true already — and one of
them was **refused with a written grill three days ago**, which the queue
must not silently re-open.

1. [ ] **132.1 — date entry has no home, and the deprecated one holds the
       seat.** Facts: `/components/date` is a **display** component —
       deprecated 2026-08-19 (roadmap 45.3), scored 1 of 12 (the framework's
       lowest), used by no screen, kept only because the package is
       published so removal is a next-major change. It sits in **Values**,
       labelled "Date (deprecated)". Meanwhile there is **no date-entry page
       anywhere**: the framework's actual position — *editing uses a native
       `<input type="date">`* — exists only as a sentence inside that
       deprecated file's comment. Money, Quantity, Tag input, File upload and
       Rich text all have Data-input pages; date entry has a comment.
       *Accept*: (a) a recorded **accept / refuse / rethink** on whether date
       entry is a page, a section of `/components/form`, or nothing — "add a
       component" is not the default answer, and the grill must say what
       native `<input type="date">` cannot do (fiscal periods, ranges,
       keyboard entry of `today+30`, locale order) before ANY new CSS is
       proposed; (b) whatever ships, the Data-input group carries date entry
       and the Values group no longer lists the deprecated one; (c)
       `/components/date` keeps a reachable URL — it is the deprecation
       notice a consumer of the published package lands on — so `check:links`
       and the page-shape gate stay green either way.
2. [ ] **132.2 — "Search Help": check `/patterns/value-help` first.** That
       pattern already documents exactly this interaction — "anyone typing a
       code they cannot remember… a list too large to enumerate in one
       control", with focus returning to the field. SAP's F4 help adds things
       it may not cover: a multi-criteria search tab, a personal value list,
       and a configurable hit-list. *Accept*: a written comparison naming
       which of those three the pattern already does; then either a
       vocabulary line so a reader searching "search help" lands on
       value-help, or ONE new item per genuinely missing capability. **Not**
       a second picker pattern — the Objective's rethink test forbids two
       surfaces growing toward each other.
3. [ ] **132.3 — calendar selection across 1/2/3 months.** Half of this is
       already true and undocumented: `.bo-calendar`'s own source says "one
       month or three is repetition, not a setting: put several
       `.bo-calendar__month` in one `.bo-calendar` and they wrap. There is no
       `--months` variant to learn." Nothing on the docs page demonstrates
       it. The other half does not exist at all: the component's stated job
       is to say **which days are special** — display, not capture. A range
       *selection* is a different contract. *Accept*: (a) the multi-month
       claim gets a demo on `/components/calendar` at 1, 2 and 3 months, and
       a `check:claims` case if the caption asserts the wrap behaviour;
       (b) range selection is grilled separately and must beat the no-JS
       floor it would replace — two native `<input type="date">`s — on
       something other than looks.
4. [ ] **132.4 — file open/save panel.** `/components/file-upload` +
       `file-dropzone.ts` cover *upload*. Nothing covers *browse a document
       store and pick one*, or *save-as with a name and a destination* —
       both real ERP screens (attachments, output destination, report
       export). *Accept*: grill whether this is a **pattern** composed
       entirely of shipped primitives (dialog + data-table + breadcrumb +
       form) or nothing at all; if it ships it is named for its SHAPE per the
       Slice 109 rule, and its opener must say what it is NOT — value-help
       picks a *code*, this picks a *document*.
5. [ ] **132.5 — list-to-list drag & drop. Read `.roundtable/grill-drag-drop-2026-08-21.md`
       BEFORE anything else.** Slice 100 asked for "drag & drop list" and the
       grill **REFUSED** it, with reasons that still stand: ARIA's own answer
       (`aria-grabbed`/`aria-dropeffect`) was deprecated in ARIA 1.1 as
       unreliably implemented, so a build means permanently maintaining a
       second interaction model; and **nothing reorderable at scale exists in
       the framework** — the only reorderable thing is `ordered-list`'s own
       three-item demo.
       **This ask is a different shape, which is why it is queued rather than
       closed as a duplicate**: Slice 100 was about ORDER within one list;
       list-to-list is about MEMBERSHIP across two (the dual-list / shuttle /
       pick-list — column chooser, role assignment, field selection).
       Membership has an accessible path that order does not: Add/Remove
       buttons moving the selection, which is the shipped pattern in every
       reference. *Accept*: (a) name the shipped screen that needs membership
       selection at a size where two lists beat a multi-select — if none
       exists, **REFUSE and record it**, exactly as 100.1 did, because "no
       screen shows the pain" was the reason then and is still checkable now;
       (b) if one exists, buttons are the path and dragging can only ever be
       an enhancement over them — a drag-only implementation fails the
       two-channel rule outright.

**Queue position.** None of these jumps the queue: the dispatcher takes the
OLDEST open item, and Slice 130's gaps are older. Recorded so a later wake
does not mistake "newest" for "next".

## Slice 131 — Owner wishlist: the RF pages show the screen twice (2026-08-23)

Owner input, verbatim: *"for Pattern: RF --> it is kind of redundant that you
show HTML form and also show iframe. shall we show only iframe (which is
closer to real device) --- why don't we make RF device like frame so user can
also visualise it. (anyway, why don't we use icon on button as well? easy to
spot"*

Triage checked the claim against the pages before queuing it, and it is
exact — and it is **drift, not a preference between two designs**.
`rf-pick`, `rf-putaway` and `rf-count` each render the SAME shared screen
component **twice**: once inline as "The screen — try it"
(`.demo-rf-screen`, full bundle, `data-density="spacious"`), then again in
the `rf-essentials` iframe at 360×640. Their two siblings in the same
family, `rf-landing` and `rf-list`, render it **once**, in the iframe alone.
Five pages, one family, two shapes — and the majority already does what the
owner is asking for. That makes 131.1 a Standardize consolidation with a
known target, not a judgement call.

`goods-receipt` is **not** in scope and must keep both: its top demo is the
desktop receipt screen and the mirror below is a *different* screen at RF
size — that contrast is the page's argument.

1. [x] **131.1 — DONE 2026-08-23. Collapsed to ONE live screen per RF page.**
       Landed with two things the duplicate had been hiding: the mirror
       ignored the docs theme entirely (measured — parent dark, iframe
       light), now fixed for all six via `PrefBootstrap` + a new
       `lockDensity`; and `check-components-used` went red on 11 TRUE claims
       because the components render one document down — `demoRegionWithEmbeds`
       follows the same-origin frame now, and its first version matched `/`
       (a suffix of every src) and embedded the landing page as evidence.
       *Original Accept below.* The mirror
       survives (owner's call, and the majority precedent); the inline copy
       goes. *Accept*: (a) `rf-pick`, `rf-putaway`, `rf-count` each render
       their screen component exactly once — asserted against the BUILT
       html, not the source diff, per the bulk-edit doctrine; (b) nothing
       the removed caption said is lost — those captions carry the scan
       codes to type and the empty-vs-zero rule, so they merge into the
       surviving section and the built page still contains them; (c) the
       surviving section is renamed — once it is the page's only screen it
       is not "the RF-floor profile" section, it is *the screen*, and the
       profile claim moves into its caption; (d) `check:page-shape`,
       `check:claims`, links, `test:axe` and `check:layout` green;
       screenshots at 1440 and 390, light and dark.
2. [x] **131.2 — DONE 2026-08-23. The mirror sits in a handheld.**
       `RfDevice.astro` is the single call site for all six embeds; chrome
       (scan window, LED, chin keys) is decorative and appears only via
       `@container bo-demo (min-width: 26rem)`. Measured: 1440 -> device
       384x710 with the screen still exactly 360x640; 390 -> chrome hidden,
       geometry identical to what shipped before. Body colour derives from
       the TEXT token so it contrasts with the canvas in both themes with no
       theme fork. Live theme toggle drives the frame for real.
       *Original Accept below.* `.rf-device-frame` is
       today a 1px border and a radius. It lives in `apps/docs/src/styles/`,
       so this is docs presentation and adds **zero framework surface**.
       *Accept*: (a) a reader sees a handheld at a glance — bezel, inset
       screen, a scan-window/trigger cue — all of it decorative, carrying no
       text and no focus stop, with the `<iframe title>` still the only
       accessible name; (b) **no sideways scroll at 390px** — bezel padding
       cannot simply be added around a fixed 360px box, so the frame must
       shrink as a unit; `check:layout` and `test:axe` are the gates and
       both are CI-only sweeps, so they get run locally before the push
       (2026-08-23 rule: a gate that only runs in CI is not known to work);
       (c) one definition, still shared by all six embedding pages — this
       class exists *because* three pages hand-rolled the same inline style;
       (d) both themes, and it must beat its reference: pure CSS, no image
       asset, theme-aware, and it may not shrink the 360×640 screen it
       frames.
3. [x] **131.3 — icons on buttons. DONE 2026-08-23. Verdict: REFUSE, for
       the RF family specifically.** Three reasons, two of them measured,
       and one of them a grill that already exists.

       **(a) There is no icon for any of these buttons.** The shipped set is
       12 masks and every one is domain-shaped. Back / Skip item / Report
       short / Bin full / Wrong HU / Item not found have none. So the ask is
       not "use the icons", it is "grow the icon set for one screen family"
       — which the reusability rule refuses outright: nothing ships for one
       screen.

       **(b) The one place icons WOULD be glanceable was already grilled and
       refused**, 2026-08-22, in `.roundtable/rf-pattern-family-grill-2026-08-22.md`.
       The RF task menu is a 4-tile grid — exactly what icons are for — and
       `RfTaskMenu.astro` says why it has none: a task list is 3-6 items a
       worker already knows by name, and adding glyphs would pull the
       12-glyph `icon.css` into the `rf-essentials` profile, which exists to
       carry only what RF screens need. That is a build-target cost, not a
       matter of taste. I proposed this before reading the record; the
       record was right.

       **(c) The measured cost, which is not what I expected.** Driven on
       the real mirrors at 360px: `--bar` lays the buttons out equal-width
       (113px each in a 336px bar), so an icon does **not** widen anything —
       it wraps labels. `rf-putaway` goes 44px → 52px, every label to two
       lines; `rf-pick` and `rf-count` already wrap, so nothing changes. So
       the earlier worry (GAP-7/GAP-13 clipping) was wrong and is withdrawn.

       The refusal rests on (a) and (b), not on cost: at arm's length, a
       glyph with no established meaning beside "Report short" **adds** a
       decoding step. The owner's goal — "easy to spot" — is what the label
       already does. Icon + text stays documented and correct on
       `/components/button` for full-bundle screens; this is a no for the RF
       family only.

       *(original triage note kept below — the two tensions it recorded are
       what the measurement above went and tested)*

       Two tensions triage found, both recorded so the grill starts from facts.
       **One**: the shipped set is 12 masks and is domain-shaped — `doc`,
       `invoice`, `cart`, `check-circle`, `truck`, `box`, `chart`,
       `settings`, `grid`, `barcode`, `building`, `user`. RF's buttons are
       Back / Skip item / Report short / a 0-9 keypad, and **not one of them
       has an icon in that set**. So "use icons" is not a docs edit; it is a
       request to grow a framework surface, which is precisely what the
       Objective's *less for more* test exists to judge. **Two**: the RF
       exception bar at 360px has already lost a button off the left edge
       (130.2 GAP-7) and still spilled with one long label (GAP-13) — an
       icon makes every button in that bar wider. *Accept*: a recorded
       **accept / refuse / rethink** with its reason; if accepted, icons
       come only from the shipped set or from additions that survive ≥2
       independent uses, always `aria-hidden`, always **beside text** (never
       icon-only on a gloved screen at arm's length), and the bar still fits
       360px with no clip.

**Not in this slice**, so it does not get re-proposed: per-screen device art,
a second frame variant, or a photographic device image. One frame, one
definition, all six pages.

## Slice 130 — ERP suite examples: the gap-finding instrument (2026-08-23)

Owner wishlist: enterprise-grade example app UIs across Order-to-cash,
Procure-to-pay, CRM, Finance, Inventory and Production — "while creating
examples app UI, pls also capture the components required or improvements
needed to include in the roadmap (also design navigation as it will be
complex app)". Grilled in two rounds before any build. Owner's answers
narrowed it decisively:

- **Q2 one suite, six modules** — confirmed.
- **Q3 "just sample screen to navigate thru app UI… don't do anything
  complicated"** — so: STATIC screens, real links, no server, no data layer,
  no interactivity beyond navigation.
- **Q4 "document based"** — the unit of depth is a document type, not a flow.
- **Q5 cross-module data is API-side and OUT OF SCOPE** — "decide purely for
  UX/UI framework". So modules link to each other; nothing pretends to have
  a backend.

Adopted from my recommendations on "Next": module rail + section list (Q8a),
the proposed document set (Q9), list + document screens per type (Q10),
links-only cross-module references (Q11), the no-new-CSS rule (Q12), and
P2P first as a pilot (Q13).

**The mechanism, which is the actual product here.** The example may not add
a single line of its own CSS — `check-erp-suite.mjs` fails on a `.css` file,
a `<style>` block, or an inline style that is not a documented framework
custom property. A screen that needs something the framework has not got
compromises VISIBLY and the need lands in `.roundtable/erp-suite-gaps.md`.
Without that rule every gap becomes a local style block and the instrument
reads clean while telling us nothing.

1. [x] **130.1 — P2P pilot. DONE 2026-08-23.** `examples/erp-suite/`: five
       hand-authored screens (suite home, PO list, PO document, vendor-invoice
       list, vendor-invoice document with three-way match) + five honest
       module stubs so every rail entry lands somewhere. Chrome is rendered
       once in `_shell.mjs`; screen BODIES are hand-written, deliberately —
       a generated grid of identical screens would hide exactly what this
       exists to expose. Three gates, all green: `check-markup` (every class
       exists — it caught an invented `bo-amount--danger` and named the real
       `--negative`), `check-erp-suite` (no CSS, every internal link
       resolves), `audit` (axe at 1440 and 390, no sideways scroll).
       **Seven gaps found, logged with the screen that hit each.** Two of
       them — GAP-6 and GAP-7 — were found by a SCREENSHOT after all three
       gates reported the pilot clean, which is the argument for the
       screenshot step in the quality bar, made again.
2. [x] **130.2 — DONE 2026-08-24. Every gap promoted into a decision.** **GAP-2 (merged with
       GAP-9) DECIDED 2026-08-23: RETHINK → a documented composition.** The
       shape is `bo-timeline` ordered by lifecycle — one step per document
       TYPE, that type's instances as links inside the step, `data-state`
       carrying done/current/rejected/pending and `aria-current="step"` on
       the current one. Proved on `p2p/purchase-order` and
       `p2p/vendor-invoice` (two independent compositions = the Objective's
       reusability bar) with **zero new CSS**, which the example's own
       no-CSS gate enforces rather than my asserting it. `bo-stepper` was
       the other candidate and loses on a normal case, not an edge one: it
       is horizontal with equal-share steps, so a step holding three invoice
       links breaks it. Full reasoning in the gap ledger.
       **GAP-4a DECIDED + FIXED 2026-08-23: ACCEPT, as a bug fix rather than
       a feature.** A grouped two-row column header needs no new class,
       modifier or component — plain `<th scope="colgroup" colspan>` over
       `scope="col"`, which axe accepts unchanged. What it needed was a fix
       to shipped CSS: every `thead th` pins at `inset-block-start: 0`, so
       two header rows land on each other. Measured, not inferred — the
       group cell and the sub cell beneath it occupied the identical box
       after scrolling, so "Quantity" was invisible, not merely overlapped.
       Rows 2 and 3 now offset by `--bo-density-row-height`, the token that
       already sets the row height, so it is exact at every density.
       Documented with a demo whose container actually scrolls (a header
       sticks to its own scrollport, so an uncapped demo would show a static
       table and prove nothing) and claim 108, red-proved against the BUILT
       css. **GAP-4b stays open** — the cell-level "this one disagrees" cue,
       the part that risks becoming "colour the cell".
       **GAP-4b RESOLVED: already shipped, and the first attempt at it
       failed measurably.** `data-tone` marks a CELL (with `data-tone-text`
       and a forced-colors block); the gap had looked at `data-row-state`, a
       ROW marker, and missed it. Two-channel completed with a
       visually-hidden word in the cell, per Slice 124's rule that tone is
       never the only channel. The first composition kept
       `data-row-state="warning"` on the row and the toned cell's fill came
       back byte-identical to its neighbours — a cell cue inside a toned row
       marks nothing. Removing the row state was the fix, not tidying.
       **With this, every gap in the ledger is decided.**
       **GAP-1 DECIDED: real, measured, and deferred behind a trigger.**
       The single-sidebar compromise fails at 11 documents in one module on a
       700px laptop (17 at 900px) — measured by growing the group and
       scrolling to its end. The pilot has three and O2C will have two, so
       nothing exercises it. Building a second rail means changing
       `.bo-app-shell`'s grid — the most-composed layout here — for zero
       shipped screens; the sticky-group alternative was measured too and
       spends 34% of the sidebar's height at seven modules, about half at
       twelve. `/components/sidebar-nav` now documents the limit and the
       answer at that size (move the long list into the PAGE, or split the
       module). Revisit trigger: a real screen with >10 entries in one group.
       **GAP-8 + GAP-10 DECIDED: one need, and mostly already answered.**
       The merge was tested: a document COUNT from a grouping rule and a
       TOTAL from a selection are both "a fact about what this operation
       will do, derived from what is ticked, restated when it changes".
       GAP-10's premise was wrong — `initTableSum` ships the recompute AND
       states the announcement contract (committed change, not per
       keystroke; a visually-hidden `aria-live` beside the table, not on the
       number), with a working implementation on `/patterns/editable-grid`.
       The uncovered half — summing only CHECKED rows — is deliberate:
       which rows count is a business rule, and `initTableSum` is the named
       exception for the universal case only. The real defect was
       DISCOVERABILITY; `/components/data-table`, the page that owns
       selection, now carries the pointer. GAP-8 adds placement: the count
       goes in the primary action's LABEL, because the reader decides at the
       button, with the grouping rule in prose beside it.
       **GAP-12 RESOLVED: a stated home, no new surface.** "Add a line"
       goes BELOW the table in a cluster, never in the table toolbar — the
       toolbar acts on rows that exist, this creates one that does not, and
       the new row appends at the end where the control should be. The gap's
       own prediction had already come true inside the repo: editable-grid
       used a `<p>` with a hand-typed margin and the label "+ Add line", the
       requisition screen a bare `<p>` labelled "Add a line". Both agree now.
       **GAP-3 RESOLVED: one line, then a convention.** The count is muted
       tabular text as a second child of the option — the treatment
       `.bo-data-table__selection-count` already ships — not a badge, which
       at compact density is 24px tall inside a 24px segment. The only real
       framework gap was a missing `gap` on `.bo-segmented__option`; adding
       it changed zero existing options site-wide, measured.
       **GAP-11 DECIDED: NOT A GAP — my bug.** An excluded conversion line
       looked identical to an included one because the screen wrote
       `class="bo-checkbox"` and omitted `bo-data-table__row-select`, which
       is what the framework's own selection rule keys on. Measured after
       fixing: included rows tinted, excluded transparent, distinct in both
       themes, checkbox carrying the non-colour channel. Worth keeping for
       what it says about the gates — `check-markup` verifies a class EXISTS,
       so using a real class and omitting the one that works passes clean.
       **GAP-14 DECIDED: REFUSE the fifth state.** The marker is consumer
       markup, so `◐` carries partial-ness on the non-colour channel already;
       `pending` renders "not complete", which a partial step genuinely is.
       The grill's real find was a DOCS problem: `current` means "the record
       you are on" in a document flow and "the step in progress" in an
       approval timeline — two meanings, two timelines, one screen. Stated
       on `/patterns/object-page` now.
       **Building it surfaced GAP-14**: a chain step can be PARTIAL (1 of 2
       received) and `data-state` has no word for it — `done` paints a tick
       over "1 of 2", `pending` says nothing started. Compromised to a
       half-filled marker glyph and logged; grill it with GAP-11, since both
       ask whether the component needs one more state.
       GAP-5 and GAP-7 landed
       2026-08-23, both accepted without a grill because neither is a
       judgement call: a button that vanishes at 390 and a copyable sample
       that produces a page with no `<h1>` are defects, not design options.
       GAP-7 also emptied the example's audit allowlist, which is how a debt
       marker is meant to end. Five remain. Each of GAP-1..5 gets
       grilled against the Objective and lands as accept / refuse / rethink
       before module two is built. Ordering by confidence-to-cost:
       **GAP-5** (object-page models the record title as a `<span>`, so
       copying the pattern ships a page with no `<h1>` — caught by axe on the
       pilot's first run; a docs fix, possibly with a claims case),
       **GAP-2** (nothing documents "related documents" — the connective
       tissue of a document suite, needed on every document screen in every
       module; likely a documented composition, not a component),
       **GAP-4a** (grouped two-row column header for `data-table` — mechanical
       and useful well beyond three-way match), **GAP-3** (a count inside a
       segmented option — probably a convention, not CSS), **GAP-1** (the
       module rail — may be a docs answer: two `sidebar-nav`s in a cluster),
       **GAP-4b** (a cell-level "this is the one that disagrees" cue — the
       only genuinely new idea, and it risks becoming "colour the cell",
       which the two-channel rule forbids; grill hardest here).
       Two more, both found by screenshot after the gates were green, and
       both defects in SHIPPED code rather than missing surface:
       **GAP-7** (`bo-form-actions` has no `flex-wrap`, so a three-button bar
       loses its first button — 234px of it — off the left edge at 390;
       invisible to every overflow check because content overflowing the
       START edge never reaches `scrollWidth`. Mechanical fix, needs a claims
       case at 390) and **GAP-6** (`bo-stack` composed onto
       `bo-app-shell__main` collapses a scrollable table container to its
       header row — two correct primitives composing into silent data loss,
       and the broken composition is the one a careful reader tries first).
2c. [x] **130.2c — DONE 2026-08-23. GAP-2's shape is documented**, in the
       live object-page screen and as guidance beside it. Writing it found a
       defect on that same page: three EMPTY `bo-timeline__marker`s, i.e.
       state carried by colour alone, against the component's own stated
       contract. Fixed, and `check-markup` now enforces the contract for
       every consumer of the published package — red-proved on those three,
       adjacency self-tested. *Original Accept below.*
       **130.2c (original) — document GAP-2's shape, or twelve screens invent twelve
       versions.** That is the gap's own words and the reason a decision
       alone does not close it. *Accept*: a "Document flow" section on
       `/patterns/object-page` carrying the composition, when to use it, and
       the two rules the build surfaced — the current step gets
       `aria-current="step"`, and a step's instances are links inside the
       step rather than a second list; plus the honest note that a screen
       may carry two timelines (flow and approval) and what distinguishes
       them. Same page-shape and wrong-choice gates as any pattern edit.

3. [x] **130.2b — DONE 2026-08-23. The P2P document flow, grilled (owner: "as per
       your recommendation").** Question was whether P2P should carry
       PR → PO → GR → Vendor invoice → Payment with sub-functions and
       conversions. Decided on SHAPE COVERAGE, not business completeness:
       a step earns a screen only if it stresses the framework in a way
       nothing shipped already does.
       **Refused as already covered**, with reasons: **Goods receipt** —
       `goods-receipt` plus the three RF screens cover receiving end to end;
       **Payment** — select-and-run is `bulk-actions`, the unattended run is
       `job-monitor`. Building either repeats work and adds ~10 screens for
       no new information.
       **Accepted**: **PR creation** (tests `detail-form` at real scale) and
       **PR → PO conversion**, which nothing covers — grepped all 38 pattern
       pages and conversion/derivation appears nowhere. Its shape is genuinely
       new: select N sources → group them by a rule (one PO per vendor) →
       PREVIEW what will be created → convert some lines but not others →
       land on the result with its sources linked. Must include partial
       line-level conversion and many-to-one grouping — a 1:1 Convert button
       teaches nothing.
       If it survives, it becomes a pattern candidate named
       `document-conversion` — framed by SHAPE, with PR→PO as demo data only
       (Slice 109 rule).
       **Nav stays one level** (Q17): in P2P the functions ARE the documents;
       anything else is a report or a job, and both have homes. Deciding a
       third level while GAP-1 (no module rail) is open would design the
       navigation backwards.
       **BUILT 2026-08-23**: `p2p/requisitions` (source list whose action
       names its OUTPUT, not its effect on the rows), `p2p/requisition` (PR
       entry — form sections + a line grid + the 127.5 touch attributes),
       and `p2p/convert-to-po` (two result groups from three sources, with a
       line excluded). **Six more gaps**, five from the conversion screen
       alone — GAP-8 (the transform statement "3 → 2, grouped by vendor" has
       no surface, and it is the sentence that decides how many documents get
       created), GAP-9 (sources→result, which is GAP-2 seen from the other
       end, merged), GAP-10 (a derived total has no home and, more
       importantly, no stated owner for recomputing and announcing it),
       GAP-11 (no row state for "deliberately excluded" — the shipped states
       are all PROBLEM states), GAP-12 ("Add a line" has no home anywhere),
       GAP-13 (a single over-long button still spilled after GAP-7's
       flex-wrap — fixed for `.bo-form-actions`, claim 107, but it is now the
       THIRD instance of one rule and consolidation needs its own grill).
       **GAP-2 absorbs the chain question** (Q16): "what is this connected
       to" and "where is this in its lifecycle" are one need, and answering
       them separately would produce two overlapping surfaces — exactly what
       the Objective's rethink test targets.
4. [ ] **130.3 — module two, on the settled answers.** O2C (sales order,
       customer invoice), built only after 130.2 lands, so the second module
       measures whether the fixes worked instead of repeating the gaps.
       **This is the checkpoint for the whole idea**: if module two finds
       another five gaps, the framework has a systemic hole worth a slice of
       its own; if it finds none, modules three to six are mechanical and can
       be batched.
5. [ ] **130.4 — the remaining four modules.** CRM (account, opportunity),
       Finance (journal entry, payment), Inventory (stock movement, item
       master), Production (production order, BOM). Batched only if 130.3
       says they are mechanical. Each still logs its gaps.
6. [ ] **130.5 — wire the suite into CI** once it stops changing shape:
       `build` + the three gates, in the same job as the docs checks. Left
       until last on purpose — a gate that guards a moving target reports
       noise. Until then it runs on demand and the loop runs it by hand.

**Refused up front**, so it does not get re-proposed: per-domain patterns or
components. The owner's own Slice 109 rule — a pattern is named and framed
for its SHAPE, the domain appears only as demo data — means this slice
produces example screens and roadmap items, never an `invoice-approval`
component.

## Slice 129 — Objective grill of 126-128, and the gate hole it found (2026-08-23)

Dispatched by rule 3 (three slices closed since the last Objective). Report:
`.roundtable/grill-objective-126-128-2026-08-23.md`. Every item passed its
accept test; five findings landed, and one of them is the kind this project
writes doctrine about.

1. [x] **`check-page-shape.mjs` had never once run against `scan`.** Its
       `hasRules` filter needed a `.bo-` selector and `scan.css` has none —
       it is 100% `body[data-scan-result]::after`. 126.2 generalized exactly
       this definition in three other scripts; this gate kept the old half.
       A skipped page looks exactly like a passing one, so nothing surfaced
       it, and `scan.astro` was missing `<DsaScore>` the entire time.
       Membership now reads `api.json`. 39 → 40 pages checked; the
       "not yet scored" branch that 94.5 recorded as unreachable by
       construction now renders on a real page.
2. [x] **The ORDER assertion from 128.4 was a position heuristic in an
       `@exact` file** — and CLAUDE.md's taxonomy names "a position" as the
       heuristic case outright. Extracted as `demoAfterSpec()`, file
       retagged with the reason (one heuristic check makes the file
       heuristic; the tag names the weakest link, not the average), and
       given `--self-test` over four inputs including the composite shape
       that broke its first draft. Red-proved by replacing the detector
       with `return false` — the self-test exits 1.
3. [x] **A claim shipping with neither a case nor a registered exemption.**
       file-upload's "`capture` REPLACES the picker on many phones" is a
       mobile-OS behaviour headless Chromium cannot show. The sentence
       stays — it is why the page ships two inputs — but `check-claims.mjs`
       now carries an EXEMPT list with the entry and the bar for joining
       it, so "no way to test it" is a decision on the record.
4. [x] **The column ladder had no stated ceiling.** Each tier costs a class
       AND a breakpoint, which is a slope. Three is now stated as the
       ceiling with its reason, and a fourth is declared a rethink into a
       numeric priority scale, never `--quaternary`.
5. [x] **`.demo-shell-frame` re-declared `.demo-frame`** instead of
       composing on it — one day after that doctrine motivated the split.
       Fixed on all three sites.

No contradictions were found across the docs pages this window touched,
including the two most likely candidates (chooser-as-recovery; expand-in-place
present on desktop and deliberately absent on phones).

## Slice 128 — Standardize sweep, round 1 (2026-08-23)

Dispatched by rule 2 (4 Continue rounds since the last sweep). A read-only
fan-out scanned inline styles, duplicated script constants, repeated CSS and
page-skeleton drift, then reported with file:line evidence. Landed:

1. [x] **The frame idiom, finished.** `demo-shell-frame.css` was added THIS
       MORNING and its own commit message named `sidebar-nav.astro` as an
       unconverted case; the sweep found it plus 7 more inline copies of
       `border + radius`. Split into two classes because they are two ideas:
       `.demo-shell-frame` (edge + clipping + calmer `__main` padding, for a
       real app shell) and `.demo-frame` (just the edge, for a navbar, two
       sidebar navs, a button bar, a print report and two srcdoc iframes,
       none of which may inherit the clipping). 8 sites converted; the 5
       remaining matches are inside page `<style>` blocks, which is a
       different and legitimate thing.
2. [x] **Handheld widths single-sourced.** `22.5rem` was hand-typed on three
       RF pages *beside an iframe whose class already encoded the same
       360px*. Now `--demo-rf-inline` / `--demo-phone-inline` with the reason
       written down (360 = the RF profile's target and the mirrors'
       screenshot size; 390 = the width `check:layout` and `test:axe` sweep
       every page at) + `.demo-rf-screen` / `.demo-phone-screen`. 6 sites.
3. [x] **`viewports.mjs` finally adopted everywhere it applies.** The module
       exists precisely to stop the pair drifting, and `check-layout.mjs` —
       the gate that sweeps at both widths — never imported it; `check-po-app`
       had one residual literal in an otherwise-converted file. The zoom
       width is now `DESKTOP_WIDTH - 8` with its 8px explained rather than a
       bare `1432`.
4. [x] **page-shape now checks ORDER, not just presence.** Its own header has
       said "demo-first, spec-last" since it was written, but the checks are
       independent `.test()` calls, so `dialog.astro` and `data-table.astro`
       both kept a Markup section AFTER their spec tables and built green for
       months. Pages fixed; assertion added against the LAST spec block on
       the page — the first draft was component-scoped and false-positived on
       `state-patterns`, a composite documenting two components, exactly as
       the sweep predicted it would. Red-proved by injecting a demo section
       after `badge.astro`'s tables.

Refused this round, with reasons: consolidating `margin-block-start:
var(--bo-space-3)` (11 sites) — a single throwaway declaration with no shared
meaning; a class for it names nothing. `max-inline-size: 28rem` (9 sites) —
applied to four structurally unrelated elements for the generic reason "not
full-bleed"; consolidating would invent an arbitrary size token. The four
repeated CSS declaration pairs in `packages/core` — the utilities file says
outright it is "a curated set of escape hatches, not a utility system", so
the honest fix would widen public API, which rule 3 of this loop forbids.
`margin: 0` looked like the sweep's biggest number (28) and is not one thing:
22 of the 28 are two files resetting their own local typography.

Next round's input: `DAY_NAMES` is duplicated between `check-calendar-grid.mjs`
and `month-grid.ts`, and cannot be imported across the .ts/.mjs line without
moving it to a plain module — real, but a restructure rather than a rename.

## Slice 127 — the mobile-ERP candidates, grilled to builds (2026-08-23)

The owner's sequencing: "look ok but before design, please grill the
idea — RF coverage" → the RF grill shipped as Slice 126; the candidates
now proceed under the same bar (grill verdict first, comprehensive
design, References-are-floors). Evidence base:
`.roundtable/research-erp-mobile-web-gaps-2026-08-23.md`. Candidate 7
(swipe) stays parked (Hypothesis, needs a consumer). Grill verdicts are
condensed here because each candidate already carries 2+ sources and an
Accept sketch; where a verdict needed a design call, it is stated with
its reason.

1. [x] **127.1 — DONE 2026-08-23. Accept met, zero new CSS as the
       verdict demanded.** The app frame gains the sync-state slot —
       badge composition whose four states differ by glyph SHAPE
       (● ↻ ⏸ ✕) and text, changes announced through one polite live
       region; the queued state carries its COUNT ("3 queued" is a fact,
       "offline" is a mood). `/concepts/offline` states the whole
       contract: what the framework ships (the visible half) and what it
       deliberately does not (queue/storage/replay are app architecture;
       the references sell persistence as a server), plus the five rules
       a queue engine owes the chip — including idempotent replay via
       the existing 409 discipline, and error-is-sticky. Claims case
       drives the demo cycle live: four glyph shapes verified distinct,
       both channels moving together, wrap-around correct (99 claims).
       The demo cycler's hook recorded as a cited data-hooks exception.
       axe 121 pages x 2 widths zero; layout clean. Original text:
       **Offline / sync-state signalling.** Grill verdict:
       ZERO new CSS — compose badge + icon + visually-hidden +
       aria-live (the RF grill's Q2 boundary binds: visuals and
       contracts, never the queue engine). Build: a named sync-status
       slot documented on the app-frame pattern (the D365 ever-present
       header evidence), four two-channel states
       (online/syncing/queued/error — glyph SHAPE + text, announced on
       change), and a `/concepts/offline` page stating the whole
       contract the RF pages now honestly defer to. Accept: app-frame
       section + concept page; a claims case drives a state change and
       asserts both channels; no state is colour-only; nothing promises
       an engine.
2. [x] **127.2 — Table column priority. DONE 2026-08-23.** Shipped as
       `__col--tertiary` completing a THREE-tier ladder with the
       already-shipping `__col--secondary` (unmarked → tertiary drops
       below 40rem → secondary below 30rem), one class per cell under
       the EXISTING named `bo-table` query: no JS, no new mechanism.
       Two verdict corrections found while building, both recorded
       because they contradict the queued text:
       (a) **The column chooser is NOT the recovery.** It hides via
       `[hidden]`, which cannot un-hide what a container query hid —
       the compose is one-way, deliberately (choice operates within
       what the space allows). The canonical reflow rule — the row's
       detail view — is the recovery, and the docs now say so.
       (b) **A real defect the claims case surfaced**: `--secondary`
       hiding lived inside the `:not([data-density])` auto block, so
       every table setting `data-density` explicitly — including the
       framework's OWN list-report screen — got no reflow at phone
       width while the docs claimed the column "hides itself".
       Density and priority are independent settings now; CHANGELOG
       carries it as Fixed. The instrument earned its keep: the number
       it reported (nothing hidden at 21.25rem) was not the bug it was
       written to catch.
       Red-proved twice against the BUILT css — neutralising the
       tertiary rule reddens both cases, and demoting tertiary to the
       same 30rem threshold reddens the ORDER case alone (the
       minified spelling keeps the space after `max-width:`, which the
       first attempt missed). 101 claims green, layout 121, axe 121x2
       zero, forced-colors 24/19.
3. [x] **127.3 — Approve-from-phone. DONE 2026-08-23.** Sections, as
       the verdict said — no new pattern, no new CSS.
       **approval**: a 390px decision card (bo-widget + kv + the
       `--bar`) carrying only the facts the decision turns on, with the
       record itself a link; prose names what does NOT survive the trip
       (audit trail → link, bulk queue → absent because deciding twenty
       things by thumb is how rubber-stamping happens, typed rejection
       essay → reasons as buttons). Two States rows: on a phone, and
       decided-on-phone-stale-in-a-tab (the same 409 — a phone decision
       is not a lesser one).
       **inbox**: the same table narrowed by 127.2's ladder — Source
       (tertiary) then Waiting (secondary) drop, item + link survive.
       Expand-in-place is deliberately NOT offered at 390px, so no row
       looks decidable in place when it isn't; it links out to
       approval's card. One States row.
       Claim (102 total): the inbox section measured at a **1440px
       viewport** — the 390px box still drops both tiers, proving a
       CONTAINER query rather than a media query, which is why neither
       section needs a phone-only stylesheet. Red-proved by widening
       the box in the built HTML.
       Caught in build: three invented classes (`bo-card`,
       `bo-u-text-sm/-lg`) and a wrong `bo-kv__row/__key/__value`
       markup shape — check-markup red on all of them, rewritten
       against the shipped primitives.
4. [x] **127.4 — Saved views on list-report. DONE 2026-08-23.**
       Composition only — a `bo-segmented` of named views inside a GET
       form + a `bo-dropdown` for save/rename/default/delete. Zero new
       CSS, and the framework deliberately ships NO view manager:
       naming, sharing and permissions are the consumer's data model.
       **The better-than-references clause is testable, so it was
       tested**: a saved view is a URL. Fiori's variant management is a
       personal client-side blob behind a dropdown; ours navigates to
       `?view=overdue`, so a view can be bookmarked, pasted into a
       ticket, or sent to a colleague who sees the same rows. Claim 103
       DRIVES that — picks a view, submits, reads `location.search` —
       and was red-proved by flipping the built form to `method="post"`.
       Five contract rows (resolve, save with scope, 409 name-taken
       without auto-suffixing to "Mine (2)", per-user default that a
       shared link always beats, 403/404 falling back to the default
       AND SAYING SO); four States rows (no views yet → no switcher at
       all, since a one-option segmented control is a label pretending
       to be a choice; view-selected-then-filters-changed; shared link
       the reader cannot see; view deleted under a live URL).
       Astro trap re-hit: `{name, query, scope}` in a table cell parsed
       as a JSX expression — "query is not defined" at build.
5. [x] **127.5 — Touch form-entry recipe. DONE 2026-08-23.** A Forms
       section, not surface: six live fields at phone width + a table
       giving each one its exact `type`/`inputmode`/`autocomplete`/
       `enterkeyhint`. Nothing invented — every attribute is standard
       HTML, so data-hooks stays clean.
       Better than the floor (Baymard's mobile-keyboard finding) in two
       named places: the **code-field trio**
       (`autocapitalize="characters"` + `autocorrect="off"` +
       `spellcheck="false"`), which generic mobile-form advice skips
       because consumer forms have no part numbers — a phone otherwise
       lower-cases `abc-10924`, autocorrects it, and underlines it red;
       and an `enterkeyhint` **rule** rather than a list: it describes
       what the key DOES in your flow, so only the last field before a
       submit earns `done`, a textarea keeps `enter` (its Enter is a
       newline), and a scan field's is cosmetic because the scanner
       sends Enter itself.
       Claim 104 is the interesting part: a spec table beside a demo is
       two copies of one fact, and this recipe cannot be GENERATED (the
       attributes carry meaning no stylesheet holds), so the claim
       parses each row's `#id` and its `<code>` pairs and requires the
       live field to match. **Red-proved in both directions** — drifting
       the field from the table and the table from the field each go
       red.
6. [x] **127.6 — camera candidate closed. DONE 2026-08-23.** The
       verify found the cross-reference was ONE-WAY: goods-receipt
       named `capture="environment"` and linked to file-upload, and
       file-upload said nothing about the camera at all, so a reader
       arriving from the component side found no recipe. Closed by
       giving file-upload its own camera section — and by stating the
       part the reference material usually omits: on many phones
       `capture` REPLACES the picker rather than adding to it, so a
       lone capture input takes the gallery away from a worker who
       already photographed the pallet. The shipped shape is two entry
       points (take one / choose one), which keeps the choice. Recipe,
       not surface: `capture` and `accept` are native and there is
       nothing to add. No claims case — the only runtime assertion
       available (that an IDL attribute reflects) would be testing the
       browser, not this framework.

## Slice 126 — RF coverage, grilled to a scope (2026-08-23)

Owner asked for the grill BEFORE design ("RF coverage, for components
needed … ensure the comprehensive design as well"), then installed the
References-are-floors principle mid-grill. Full tree + evidence:
`.roundtable/grill-rf-coverage-2026-08-23.md` and
`.roundtable/` RF research report. Everything below carries the FULL
component recipe (docs page + wrong-choice clause, DSA score, gates,
two-channel, RF-floor-guarded CSS) — the owner's "same as other
components" bar.

1. [x] **126.1 — DONE 2026-08-23.** Budget gate live in
       build-rf-essentials (40 kB min ceiling, byte-exact on our own
       minifier output — deliberately NOT the gzip-tolerance dance, since
       a ceiling on our bytes has no cross-zlib variance; the gate's
       comment says so). RED-PROVED at a 30 kB ceiling — and the first
       red-proof PROBE was itself broken (`$?` read tail's exit, not
       node's) and got fixed before trusting it. Output prints the budget
       every build. Original text:
       **rf-essentials size-budget gate.** The profile build
       fails when min CSS exceeds **40 kB** (now 34.1), gzip-tolerance
       rule, red-proven. Accept: budget stated in the build output; an
       injected oversize fails; docs note the budget on the RF track.
2. [x] **126.2 — DONE 2026-08-23. Accept met.** `scan/scan.css` (the
       grill's one earned surface) + `flashScanResult()` export +
       opt-in `data-scan-flash`. Two-channel by construction; floor-safe
       (no color-mix — Chrome 111 > the RF 108 floor); reduced-motion =
       static wash, forced-colors = Highlight frame; overlay pointer-
       inert below toasts; composited-gate registered exempt-with-reason
       (transient, no text). Profile now 14 components at 35.1/40 kB —
       the new budget gate priced the addition on its first real use.
       **Two real bugs found by the instruments, not review:** the
       extractor skipped attribute-only components (generalized: a
       data-* contract with zero classes is still API — that's how the
       framework's state idiom works), and the behavior announced
       "Scanned REJECT…" OVER the consumer's rejection because capture
       signals ran after dispatch — the claims case caught it; capture
       now signals first so the consumer's verdict wins. New
       `/components/scan` page (full skeleton, wrong-choice clause:
       "not for form validation on an ordinary screen"); goods-receipt
       demos ok + REJECT paths; claims 98/98; axe 114 pages x 2 widths
       zero violations; 129/129 tests. DSA: unscored like other
       attribute/behavior surfaces (the Research round-1 precedent).
       Original text: **scan-result feedback.** `data-scan-result="ok|error"`
       timed overlay stamped by `initScanInput()`; two-channel with the
       existing `data-scan-status` live region; reduced-motion +
       forced-colors correct (better than DataWedge's colour-only
       flash). Accept: behavior test + claims case; demoed on
       goods-receipt; profile delta measured under 126.1's budget.
3. [x] **126.3 — DONE 2026-08-23. Accept met.** `--bar` on the existing
       btn-group (a SETTING, per the grill's compose-first rule): full
       width, equal flex slots so gloved-thumb positions never shift,
       intent-named buttons (no F-key cargo cult), height from
       data-density="spacious", docking left to the consumer's one sticky
       line. **The layout sweep vetoed the first draft's design**: nowrap
       + ellipsis clipped labels under WCAG 1.4.12 text-spacing overrides
       — a label is content, and content never clips — so labels now WRAP
       taller in equal slots (the .bo-state__actions precedent), and the
       docs prose records the correction rather than hiding it. Adopted
       on the button page + goods-receipt's live demo AND its isolated
       rf-profile mirror (which is what caught the stale-profile rebuild
       gap: the iframe loads rf-essentials.min.css, not the main
       bundle). Profile at 35.3/40 kB. target-size, axe 114x2, layout,
       claims 98 all green. Original text: **`bo-btn-group--bar`.** Equal-width docked action bar
       (glove targets via spacious), intent-named — no F-key cargo
       cult. Accept: component docs section + RF pattern adoption;
       target-size clean at spacious.
4. [x] **126.4 — DONE 2026-08-23. Accept met.** `/patterns/rf-pick`,
       `/patterns/rf-putaway`, `/patterns/rf-count` — each a shared
       screen component (page + isolated rf-essentials mirror, the
       ScanToReceive rule), full pattern skeleton, KV task header, scan
       flash, the --bar, and the design facts the grill demanded: pick
       carries the KEYPAD RECIPE (12 plain bo-btns + 3 consumer lines,
       inputmode stays the floor), putaway carries the VERIFICATION
       idiom (system names the bin, scan must match, compare is 3
       consumer lines), count is BLIND by design (the one header that
       withholds a number; empty ≠ 0, the timesheet rule). Session-lost
       rows state the reconnect truth, never offline promises. Driven
       live ON THE PROFILE MIRROR at 360×640: keypad writes, bar slots
       equal ±1px with "Report short" WRAPPING in place (the 1.4.12 fix
       visible), wrong-scan flashes error with the reason announced.
       **Three instrument catches while building:** components-used
       could not see attr-only `scan` rendered (generalized: a
       component's data-* hooks count as render evidence — the
       extract-api generalization, one gate downstream); the keypad's
       demo hooks are recorded data-hooks EXCEPTIONS citing the grill
       (promoting them would be the component the grill refused); and
       CI caught check:forced-colors dying on the flash rule — the gate
       gained VALUELESS-attr needles and PSEUDO-ELEMENT measurement
       (its first ::after rule), so the Highlight frame is now PROVEN
       under emulation (24 rules, 19 structural), not exempted. That CI
       failure was also mine to own: forced-colors was missing from my
       pre-push sweep set for 126.2. Gates: links 13,204 incl.
       DOCS_BASE, claims 98, axe 120 pages x 2 widths zero, layout,
       target-size. Original text: **three new RF patterns: pick,
       putaway, count.** Each
       with the keypad RECIPE (grid of bo-btns; native inputmode stays
       the floor), verification-field recipe, Task/Loc/Item KV header,
       exception bar, full pattern skeleton. Accept: pattern gates,
       axe/layout, both themes at 360×640.
5. [x] **126.5 — DONE 2026-08-23.** The three unshipped offline
       PROMISES are gone: goods-receipt / rf-landing / rf-list now state
       the reconnect truth (persistence is infrastructure — the
       reference products sell it as a server; the screen documents the
       state it actually ships). Camera-fallback recipe added to
       goods-receipt's data contract (capture="environment" +
       BarcodeDetector feeding the same bo:scan flow — a recipe, per the
       grill: camera pipelines are device capability, not CSS).
       Goods-receipt had already adopted the bar + flash in 126.2/126.3.
       claims 98 still green after the rewording — no state row promises
       unshipped behavior. Original text: **comprehensive pass on the
       existing 3 RF pages.** KV
       header idiom, verification + camera-fallback recipes in Data
       contracts, and the unshipped offline PROMISES reworded to the
       truth. Accept: no state-table row promises unshipped behavior;
       check:claims still green.

**Refused with evidence** (do not re-chase): on-screen offline badge on
RF screens (infrastructure per Ivanti; survives only as the mobile
audit's candidate #1) · progress-counter element (no two-source
support) · custom keypad COMPONENT (recipe first) · voice, beeps,
keyboard switching, wedge config (device/app concerns).

## Slice 125 — Explore/Research fallback: dogfood bugs + mobile-ERP candidates (2026-08-23)

Dispatched at the owner's ask ("Research/Explore fallback — UX/UI
Web/Mobile App for ERP: what is missing, what requires improvement").
Two tracks, both landed as reports:

1. [x] **125.1 — DONE. Explore: 0.4.0 dogfooded into po-app; THREE real
       framework defects found and fixed the same day** (report:
       `.roundtable/explore-grouped-dogfood-2026-08-23.md`). One daily
       gesture — select the amount, retype, Cancel — broke three ways:
       focus destroyed the selection so retype appended; the garbage
       parsed to an empty hidden value (silent 422); Cancel's native
       reset desynced display/hidden/dirty. Fixed red-first (3 failing
       tests, then green; the fix's own first version re-dirtied
       row-edit's cleared row and is pinned by a composition test —
       reset resync is SILENT, as native reset is). 127/127; E2E proven
       on the real npm-installed package (Cancel → grouped display,
       restored raw, clean row). po-app wiring graduated into main.
       **npm still serves 0.4.0 with these defects — 0.4.1 patch release
       recommended, owner-triggered as always.**
2. [x] **125.2 — DONE. Research: mobile/web ERP gap audit** (report:
       `.roundtable/research-erp-mobile-web-gaps-2026-08-23.md`). Seven
       ranked, evidence-graded candidates; six false gaps named and
       killed; the bottom-nav refusal respected with its re-open trigger
       sharpened (first phone-first consumer). **Owner picks which
       candidates become build items:**
       (1) offline/sync-state signalling · (2) table column priority ·
       (3) approve-from-phone passes · (4) camera capture/barcode recipe ·
       (5) saved views on list-report · (6) touch form-entry recipe ·
       (7) swipe actions (low, Hypothesis).

## Slice 124 — Owner: the left bar on a toned cell (2026-08-23)

Owner wishlist: "cell or row highlights with color. Why there is a bolder
line on the left? — it might not suitable for all the case. Pls review the
guidelines when to have this left bolder line."

Investigated rather than answered from opinion. The bar is
`box-shadow: inset 3px 0 0` on `tr[data-row-state]`'s first cell and on
`td[data-tone]`. The question surfaced **one real defect and one real
documentation gap.**

1. [x] **124.1 — DONE. P0-shaped RTL defect: the bar never flipped.**
       `box-shadow`'s x-offset is physical and has no logical form, so the
       marker rendered `inset 3px 0 0` **byte-identically under `dir="rtl"`**
       — measured live, not assumed — leaving it on the row's TRAILING edge,
       while its OWN forced-colors fallback used logical
       `border-inline-start` and did flip. Two channels for one marker,
       disagreeing about which edge means "start". `check:rtl` could not see
       it: a `box-shadow` is not a physical box *property*, so nothing
       matched. Fixed with a `[dir="rtl"]` flip (now `-3px`, re-probed:
       +3px LTR / −3px RTL), registered as the framework's **sixth**
       documented flip site, and the gate extended to catch inset
       `box-shadow` x-offsets — red-proved: the new detector fired on the
       real construct before the site was registered. All three places the
       count lives (check-rtl, /concepts/i18n, DESIGN.md) updated together,
       which the gate itself enforces.
2. [x] **124.2 — DONE. The guidelines the owner asked for.** New section on
       `/components/data-table`: the bar is **not decoration** — under
       forced-colors the browser discards backgrounds, so a tone carried by
       tint alone vanishes for exactly the readers who need it most; the bar
       survives because the forced-colors rule swaps it to a real border.
       It follows the **leading** edge, not the left. Right for: row state
       (one bar per row, a margin marker), and a FEW exceptional cells.
       Reach for something else when: most rows have a toned cell (the bars
       become texture, and tone is carrying ranking rather than exception —
       sort, or use a badge); the toned cell is a right-aligned number (the
       bar sits at the far edge from the digits — pair with
       `data-tone-text`); or it is being used as the only channel (both tint
       and bar are colour).
3. [x] **124.3 — DONE. Applied the new guideline to my own page.** The
       comparison matrix (123.3c, shipped hours earlier) was exactly the
       wrong use: every row has a winner, so `data-tone` was carrying
       ranking, not exception. Now marks the winner by **weight** —
       `<strong>` on the value plus the visually-hidden phrase — two
       channels, **neither of them colour**, both landing on the number
       itself, and the mark the references actually use (GSMArena bolds the
       winning spec). Verified in the rendered DOM: exactly one bold cell
       per row, always the true min/max, always with the hidden channel,
       and zero `data-tone` left on the page. Also fixed a stale figure in
       the caption that cited a delta the table no longer showed.

## Slice 123 — Owner answers, seven decisions in one message (2026-08-23)

The owner answered every open item in one pass. Recorded here so no wake
re-asks; each answer routes to its own item below or amends an existing one.

1. **122.1 (masking)** — scope answer: applies to Money AND plain
   numeric/Quantity ("yes"). Owner asked for best practice from other ERP
   software before the grill round — research dispatched 2026-08-23;
   grill proceeds once the evidence report is in (see 123.1).
2. **119.3 (app-frame)** — NOT an iframe. The ask is: what is the MODERN
   design for an application frame/shell? Research dispatched (Fiori
   shell, Dynamics app frame, Lightning, Carbon UI shell, etc.); a
   proposal goes back to the owner (see 123.2).
3. **121.1/121.2/121.3** — owner: "find reference to propose me."
   Research dispatched (Xero/BC reconciliation, CATS/Workday timesheets,
   Ariba/Coupa comparison); per-pattern proposals with named references
   go back to the owner (see 123.3).
4. **121.5 (orphans + naming)** — owner: "which solution is good for
   long term?" Long-term call made and BUILT this wake: sidebar labels
   renamed to carry the distinction (labels are cheap and fixable;
   slugs/URLs unchanged so links and search hold — the same trade-off
   already decided for 52.3), plus inbound cross-links for the three
   remaining orphans. See 121.5's own entry for the Accept evidence.
5. **30.0** — answered: a NEW ERP overview/dashboard pattern with a
   module sidebar (not a review of the docs' own nav). Folded into the
   app-frame proposal (123.2) — same research covers both; they ship as
   one coherent frame + overview story, not two competing screens.
6. **52.3 (Object Page naming)** — owner: "do what is good for long
   term" = the standing recommendation. BUILT this wake: slug kept,
   human title/opener renamed to name the interaction. See 52.3.
7. **0.3.0** — owner chose: re-cut the tag. BUILT this wake: Layer-2
   CHANGELOG entries written, `## Unreleased` folded into `## 0.3.0`,
   tag moved to the new HEAD, release created (Trusted Publishing runs
   the gates from a clean checkout). See 123.4.

**Owner sign-off 2026-08-23: "Go with your recommendation" — all nine
research-backed recommendations confirmed in one message.** The grills
are settled; each item below now carries its decided design and Accept
criteria, and builds in order: masking → app frame + suite home →
reconciliation → timesheet → comparison.

1. [x] **123.1 — DONE 2026-08-23. Accept met on every criterion:**
       `initGroupedNumber()` + `data-grouped`/`data-locale` shipped as ONE
       behavior (grouped-number.ts) serving Money, Quantity and plain
       numeric inputs; Money's currency-change reformat and Quantity's
       steppers both route reads/writes through the shared machine-value
       path. Unit tests prove `1,234,567.50` (en-US) AND `12,34,567.50`
       (en-IN — Intl-driven, not every-3-digits), the de-DE comma-decimal
       + lone-dot trap, the never-round lossless rule, garbage→empty
       submission, and both compositions (8 new tests, 124/124). The
       submitted value is the raw number via a generated hidden input in
       all cases. Docs demos on all three pages (money/quantity/form),
       behaviors.json + js-behaviors page updated by generation,
       data-hooks gate documents both new attributes (67). The runtime
       claim has a RED-PROVED check-claims case (data-grouped stripped
       from the built artifact → exactly that case fails; restored →
       97/97). Live-verified in the browser (real focus/type/blur:
       98,765,432.10 rendered, raw in the hidden input; stepper on a
       grouped value; light+dark, 1440+390 — a real clipping bug at 390
       found by measuring clientWidth vs scrollWidth and fixed at the
       demo's container). CHANGELOG Unreleased entry written.
       *(original decided-design entry follows)*
       **Decided: format-on-blur.**
       Owner-confirmed per the evidence (`.roundtable/research-numeric-
       masking-2026-08-23.md`: on-blur is what Reckon ships, SAP's own
       guidance warns off live reformatting, GOV.UK abandoned
       type=number; live masking survives mainly as fintech
       calculator-style fill). ONE shared mechanism for Money, Quantity
       and plain numeric inputs; live-as-you-type REFUSED (re-open only
       with a real screen that demands it, and then as the
       calculator/fill-from-right shape, never mid-string reformatting).
       Decided design: opt-in `data-grouped` on the existing controls;
       at init the behavior swaps `type="number"` →
       `type="text" inputmode="decimal"` (no-JS keeps the native number
       field — correct, just ungrouped); display formats via
       `Intl.NumberFormat` with explicit locale from `data-locale`
       (fallback: document `lang`); `data-decimals` stays the single
       precision source; a hidden input carries the raw unformatted
       value for submission (the universal shape across every reference);
       paste re-parses from scratch; focus shows the raw editable value,
       blur shows the grouped display. Accept: one behavior/util (not
       three), demoed on Money + Quantity + a plain numeric input;
       `1234567.5` with 2 decimals renders `1,234,567.50` on blur and
       `12,34,567.50` under an Indian-grouping locale (proving
       Intl-driven grouping, not an every-3-digits rule); the submitted
       value is the raw number in all cases; behavior tests cover blur
       format / refocus raw / paste / locale; docs pages updated with
       generated API rows; all gates green.
2. [x] **123.2 — DONE 2026-08-23. Accept met:** `/patterns/app-frame`
       (header anatomy with named regions — brand · waffle module switcher
       · global search · notifications · user menu — plus the
       frame-owned/page-owned/server-owned ownership table) and
       `/patterns/suite-home` (module-level sidebar + cross-module
       overview, the Dynamics-areas/Fiori-My-Home shape) both shipped as
       full pattern pages, both in pattern-groups, both passing every
       gate (page-shape 32 patterns, wrong-choice 32/32 carry, markup,
       links 11,644, axe 110 pages × 2 widths zero violations, layout,
       claims 97, target-size, forced-colors). The module switcher IS a
       working composition — ghost button + native [popover] dropdown +
       existing icons; zero new framework CSS/JS; the waffle menu was
       opened live (popover-open verified true, anchored via
       initDropdowns). Each page's wrong-choice clause points at its
       sibling (suite-home ↔ role-home; app-frame → RF full-screen and
       explicitly "not an iframe"). Two real fixes found building it:
       a nonexistent `bo-sidebar-nav__list` class caught by
       check-markup, and the live demos' nested `<main>` landmark caught
       by preemptively running the axe sweep locally (the CI-only-gate
       lesson from this morning, applied). Screenshots light+dark.
       *(original decided-design entry follows)*
       Owner-confirmed: top-bar waffle/grid module switcher reusing
       app-launch's tile mechanism (M365/Salesforce/Fiori consensus;
       sidebar stays purely module-nav), and 30.0 ships as a NEW
       "Suite home" pattern beside role-home (cross-linked, not
       merged). Mobile bottom-nav tier REFUSED for now (icon-rail
       collapse already ships; re-open on a real consumer need).
       Build: (a) app-frame page documenting the header anatomy —
       named slots for brand / module switcher / global search /
       notifications / user menu — plus a frame-vs-page ownership
       table (what the framework owns vs the consumer, per
       `.roundtable/research-app-frame-2026-08-23.md`); (b)
       `/patterns/suite-home`: module sidebar + cross-module overview
       (the Dynamics Areas+Subareas / Fiori My Home shape). Accept:
       both pages pass the full page-shape/pattern gates; the module
       switcher is a working composition of existing primitives (no
       new component unless a real gap is measured); suite-home and
       role-home each carry a wrong-choice clause pointing at the
       other.
3. [x] **123.3a — DONE 2026-08-23. Accept met:**
       `/patterns/reconciliation` — one row per statement line with the
       system's proposal beside it, confirming removes BOTH sides at once,
       and a running unmatched difference in the header gates Reconcile
       (disabled until exactly zero; the gate is server-enforced via 422,
       the button only reflects it). Two-channel throughout: the
       difference is text in a badge, amounts carry `data-tone` AND sign,
       "no suggestion" is a visible badge rather than an empty cell.
       States cover suggested / no-suggestion / confirmed / concurrent-409
       / all-matched / deferred-exceptions / no-JS. Zero new CSS — data
       table + badge + amount + button. All gates green (page-shape 33
       patterns, markup, links, axe 111 pages x 2 widths zero violations,
       layout, claims 97).
       *(original decided design follows)* **Xero-style two-column with
       suggested matches.** Owner-confirmed layout (the
       canonical shape; QBO checklist and BC journal-drawer recorded as
       refused alternatives with reasons in the research doc). Contract
       from the shared reference behavior: confirming a match removes
       both sides from the working set; unmatched items get an explicit
       exception path; the finish action is gated on the running
       difference reaching zero. Accept: `/patterns/reconciliation`
       passes all pattern gates; the running-difference figure is
       two-channel; states cover suggested/confirmed/unmatched/
       exception and the zero-difference gate.
4. [x] **123.3b — DONE 2026-08-23.** `/patterns/timesheet` — fixed
       day-of-week column axis for one locked period, rows = booking
       target, seamless numeric cells with full per-cell accessible names,
       BOTH row totals and day totals, grand total carrying its target
       (`40.00 / 40`), submit moving the whole period as one unit. Empty
       renders empty, not `0.00` (a typed zero is a statement, a blank is
       its absence). A real defect was caught by summing the RENDERED
       cells rather than trusting the demo data: the week totalled 42
       against a 40 target while the screen offered Submit — the demo
       contradicting the page's own gate. Fixed to a genuinely reconciled
       week. Gates: markup, page-shape 34 patterns, axe 112 pages x 2
       widths zero violations, layout, claims 97, target-size.
       *(original decided design follows)* **inline-editable grid**
       (CATS/Harvest/Toggl shape; Workday's day-click-modal recorded as
       the refused alternative). Fixed day-of-week columns for one
       locked period; rows = allocation dimension; row totals AND
       column totals plus a period target the grand total reconciles
       against; validation gates submit; the period submits as ONE unit
       into approval. Accept: `/patterns/timesheet` passes all pattern
       gates; totals recompute on entry (executable claim); submit
       disabled until the target reconciles, with a two-channel reason.
5. [x] **123.3c — DONE 2026-08-23. Accept met.** `/patterns/comparison`
       — candidates as COLUMNS, criteria as rows (uncontested across every
       reference). The best cell per row is DERIVED, never hand-typed, and
       marked in TWO channels: `data-tone="success"` plus visually-hidden
       "best on this criterion"; every other cell carries its delta from
       best **in that criterion's own units** rather than a normalised
       score that would hide the trade-off. "Criteria won" is a count,
       explicitly not a ranking. Split-award REFUSED for v1 with the
       re-open condition stated on the page itself (a real screen needing
       per-line allocation). Two real fixes while building: the
       components-used gate caught the award button claimed but never
       rendered — fixed by adding the control the pattern actually needs,
       not by trimming the claim; and the demo pre-selected a candidate
       who had won 1 of 4 criteria, reading as a recommendation on a page
       arguing the count is not a ranking — the decision now starts
       unmade, which is also what the data contract's 422 requires.
       **Verified by measuring the rendered DOM**, not the source: every
       marked cell is genuinely the min/max of its row and carries the
       hidden channel; win counts (1/1/2) sum to the four criteria. Gates:
       markup, page-shape 35 patterns, axe 113 pages x 2 widths zero
       violations, layout, claims 97, target-size. Screenshots light+dark.
       *(original decided design follows)* **select-one award.** Candidates as columns, criteria as rows; per-criterion
       best signal computed and shown inline (two-channel, not
       color-only); terminal action selects ONE winner. Split-award
       (Ariba/Coupa allocation) REFUSED for v1 — recorded re-open
       condition: a real procurement screen needing percentage
       allocation across winners. Accept: `/patterns/comparison`
       passes all pattern gates; the best-per-row signal is
       demonstrated in both themes.
4. [x] **123.4 — DONE 2026-08-23. npm now serves 0.3.0 (`latest`).**
       Six missing entries written (initWindowedList, `--label-start`,
       `--elevated`, state-actions wrap fix, segmented input-position
       fix, shared popover positioning); `## Unreleased` folded into
       `## 0.3.0` re-dated 2026-08-23 with a re-cut note; tag moved;
       release created. **The first publish attempt failed on two real
       bugs, both fixed at the root, not retried around:** (1) the
       workflow's `npm install -g npm@latest` picked up npm 12.0, which
       changed `pack --dry-run --json` from `[{...}]` to
       `{"<name>": {...}}` and killed `check:package` with a bare
       TypeError — script now accepts both shapes and fails loudly on
       the next change, workflow pins npm@11; (2) `check:claims`'
       schedule full-screen case compared its href base-blind — green
       locally, red under CI's `DOCS_BASE` build (the exact LOOPS.md
       trap) — now compares `base + path`, verified against a local
       DOCS_BASE build (96/96). Tag re-cut onto the fix, release
       re-created, publish workflow green in 1m16s, registry confirmed
       serving 0.3.0. Accept met.

## Slice 122 — Owner wishlist: Amount decimal control + live masking (2026-08-23)

Owner (2026-08-22 wishlist, item 3): "Amount --> there should be a number
that allow to control the decimal and masking format as well ..eg. show
x,xxx,xxx.00". Owner explicitly said "3 - grill it" rather than build
directly — this is a real UX-tradeoff surface (cursor position while
typing, paste handling, IME/locale grouping, composing with Money's
existing `data-decimals`), not a mechanical add. Triage-only this wake:
tested against the Objective (a live-reformatting numeric input is a
genuine "one component, many settings" candidate IF the tradeoffs
resolve cleanly — not yet known, hence the grill) and queued as its own
design-tree round rather than folded into 121's three pattern-shape
grills (this is a component-level surface, not a screen).

1. [x] **122.1 — SUPERSEDED 2026-08-23 → built as 123.1**
       (`initGroupedNumber`, format-on-blur; live masking refused with
       evidence). Original text: Live decimal/thousands-mask input
       (typing `1234567` renders `1,234,567` as-you-type, not just on
       blur). Needs its own grill round before Accept criteria exist —
       open questions include: does this apply only to
       `.bo-money`/`initMoneyField()` or also plain
       `.bo-input--numeric`/Quantity; cursor-position preservation
       strategy while typing (naive reformat-and-reset-caret breaks
       mid-edit); locale/grouping-character behavior (`,` vs `.` vs
       space); paste handling; whether it composes with or replaces
       Money's existing `data-decimals` mechanism. Grill has not started
       — needs the owner's answers, not something to self-decide in an
       autonomous wake.

## Slice 121 — Owner ask: grill the pattern catalogue for coverage + showcase (2026-08-23)

Owner: "grill & roundtable the patterns - check if coverage of pattern.
showcase as mush as possible." Two independent agents dispatched — one on
ERP domain coverage (checked against the existing `.roundtable/erp-
pattern-catalogue-v2-2026-08-22.md` sweep rather than duplicating it), one
on discoverability across all 30 shipped pattern pages. Findings below are
each single-source per claim (not this project's own ≥2-source Objective
bar) but independently re-checkable — file-referenced facts, not opinions.

**Coverage: recipe compliance is solid.** All 30 pattern pages carry the
required opener (who/how-often/what-done), a wrong-choice clause, and the
full Anatomy/Data-contract/States/Components-used skeleton — `check:
wrong-choice` and `check:page-shape` are visibly doing their job.

**Three real domain gaps, not covered by the prior v2 sweep:**
1. [x] **121.1 — SUPERSEDED 2026-08-23 → built as 123.3a** (grill
   settled by the owner's sign-off; see Slice 123).
   Two independent lists matched against each other (not one list
   validated/edited like `staging`, not one list acted on like
   `bulk-actions`) — a running unmatched balance, aging exceptions.
   Essential for any finance/AP/treasury module (bank reconciliation,
   three-way-match exceptions). Needs its own design-tree round before
   Accept criteria exist.
2. [x] **121.2 — SUPERSEDED → built as 123.3b** (`/patterns/timesheet`,
   2026-08-23). Looks like
   `editable-grid` but isn't: a FIXED calendar-period column axis (not
   arbitrary fields), row+column totals that must reconcile before a
   submit-for-period action fires into `approval`. Essential wherever
   HR/Projects/PSA exists. Needs its own grill.
3. [x] **121.3 — SUPERSEDED → built as 123.3c** (`/patterns/comparison`,
   2026-08-23). N
   candidates × M criteria, each cell showing a value + delta from
   best/target, ending in a select/award action (RFQ supplier comparison,
   budget-variance analysis). Distinct from `master-detail` (one list,
   one detail) and `editable-grid` (one record's rows). Needs its own
   grill.
4. **Cross-entity federated search results** — lower confidence per the
   reviewing agent itself ("may compose from list-report sections"); NOT
   queued, named here so it isn't silently lost, re-open only if a real
   screen needs it.

**Confirmed false gaps — do not re-chase:** document/attachment manager
(already `file-upload`, wired into `staging`/`inbox`), document-flow/
linked-document chain (already `record-detail`'s "Record feed" region),
hierarchy/tree browser (already `tree`/`tree-table`, meant to compose
in), period-close cockpit / Gantt / map / activity-chatter / Analytical
List Page (already refused in the v2 catalogue sweep, reasoning re-
verified here, not re-litigated).

**Showcase: the real gap is cross-linking, not content depth.** 8 of 30
patterns are total or near-total orphans — reachable only via the
sidebar/generated index, zero inbound links from any sibling pattern
page: Error pages, Role home, Command bar, Multi-step wizard, Kanban
board, Output form, Schedule (near-orphan), Settings & admin
(near-orphan). Two naming collisions found: Report / Reporting dashboard
sit as adjacent sidebar labels for genuinely different purposes
(one-shot parameterized output vs. always-open monitoring); Schedule's
label ambiguously overlaps `job-monitor`'s own "not for authoring
schedules" disclaimer. `Output form`'s name itself misfires — reads as
a data-entry form, is actually the emitted/printed-document pattern.

5. [x] **121.4 — DONE 2026-08-23.** Cross-links added for the 5 weakest
   orphans the audit named specifically (Multi-step wizard, Output form,
   Schedule, Command bar, Kanban board) — each now has at least one real
   inbound link from a genuinely adjacent sibling pattern, not just the
   sidebar. Accept: each of the 5 has ≥1 inbound `<a href>` from another
   pattern page's prose or Related footer; docs gates green.
6. [x] **121.5 — DONE 2026-08-23.** Owner answered "which solution is
   good for long term?" — the long-term call is labels renamed, slugs
   kept (labels are cheap to change and carry the distinction; URLs stay
   stable so links and search hold — the same trade-off 52.3 decided).
   Built: `Report` → **Parameterized report** ("a report is *run*: you
   choose parameters" — its own opener's words), `Schedule` →
   **Schedule calendar** (a calendar of planned work vs job-monitor's
   watching-it-run), `Output form` → **Issued document** (kills the
   data-entry-form misread; the page's own words: "the artefact the ERP
   *emits* ... every time a document is *issued*"). Renamed everywhere
   the label appears: pattern-groups.mjs (sidebar + tile index), each
   page's `<Gallery title>`, and every cross-reference label text
   (object-page, record-detail, job-monitor, output-form). Orphan
   inbound links added: login → error-pages (same canvas-centered
   shape), app-launch → role-home (both post-sign-in starts),
   detail-form → settings-admin (where config forms live). Verified in
   BUILT HTML (each new label ×3 in the tile index; each orphan target
   present in its linker's built page), full 13-gate docs build green,
   tile index screenshotted live. Slugs, URLs unchanged — zero broken
   links by construction (link gate re-verified 11216).

## Slice 120 — Owner wishlist: dependent dropdowns, checked against an article (2026-08-22)

Owner linked an article ("HTMX Dependent Dropdowns: 5 Strategies I Learned
the Hard Way") and asked whether it could improve the dropdown. Fetched and
read in full before triaging (a reader-proxy fetch, since the source blocks
direct WebFetch). Checked against the shipped surface first: the framework
already has OOB swaps, debounced live-search (the cost-centre picker's
`hx-trigger="input changed delay:250ms, search"`), and `hx-include` for bulk
actions — but nothing demonstrating one `.bo-select` repopulating another.
Real, if small, gap.

1. [x] **120.1 — DONE 2026-08-22.** "Dependent selects (HTMX)" section on
       `/components/form`: the article's "Multiple Targets" strategy as the
       primary demo (`hx-get`/`hx-trigger="change"`/`hx-target` directly on
       the driving `.bo-select` — zero new framework surface, pure
       attribute composition already used everywhere else on the page),
       "Hidden Listeners" and OOB swaps named as the escalation path for
       independent multi-reactor and multi-target cases, and a small
       `htmx:afterSwap`/`htmx.ajax()` handler named as the sparing
       last-resort for real conditional branching. The article's own
       5th strategy (replace the whole form) is named as the anti-pattern
       to avoid, with its real cost (focus loss, dropped untouched field
       values, no screen-reader signal) tied to reasoning this framework
       already holds — master-detail's panel is deliberately a narrow
       swap target, never a navigation. Accept: the section demos a real,
       working attribute contract; zero new CSS/JS; full docs build green;
       `check:claims` unchanged (95 — no new runtime claim was made,
       correctly, since the demo's `/cities` endpoint doesn't exist on the
       static docs site); screenshots light + dark 1440. **Accept met.**

**REFUSED, with reasons:**
- **A new component/behavior for cascading selects** — every one of the
  three recommended strategies is pure `hx-*` attribute composition on the
  EXISTING `.bo-select`; there is nothing here a CSS-first framework should
  own beyond documentation. Re-open only if a real screen needs something
  declarative attributes genuinely can't express.
- **Documenting "Event Chaining" as a first-class pattern** — the source
  article itself calls for using it "sparingly," and it is the one strategy
  that adds JS; named as an escape hatch in prose, not given its own demo.
- **Documenting "Form Replacement"** — the article argues against it
  outright (focus loss, dropped state, accessibility, mobile); recorded as
  the named anti-pattern instead of a strategy to adopt.

## Slice 119 — Owner wishlist: the pattern catalog review, grilled (2026-08-22)

Owner asked to "list out first, before deciding" a set of pattern ideas.
Reviewed against the 29 shipping pattern pages; the owner then asked for
my own grilled verdicts rather than a menu-pick. **Already shipping, no
work** (named for the record): login, inbox, notification,
settings-admin (covers both "setting" and "administration"),
command-bar (has the command/search dropdown), kanban, app-launch
(the "bento for apps" ask — bento is a styling variant of it, not a
pattern), approval (the "workflow" ask), wizard.

1. [x] **119.1 — DONE 2026-08-22.** `/patterns/error-pages`: three
       status codes, one shape — `.bo-state`/`.bo-state--error`, zero new
       CSS for the pattern itself. Canvas-centered like login (no
       persistent chrome assumed); action set is the real difference per
       code (404/403 navigation-only, never a false-promise Retry; 500
       gets Retry as primary); data contract splits full navigation from
       inside-a-fragment-swap; States names the auth-vs-forbidden split
       explicitly. Found and fixed a real bug building it:
       `.bo-state__actions` had no `flex-wrap` — every prior consumer put
       exactly one button in it, so two buttons overflowed 390px instead
       of wrapping; fixed at the source (`flex-wrap` + centered). Full
       docs build 13 gates green on the first run, `check:claims` 95,
       target-size/forced-colors clean, screenshots light/dark 1440+390.
       **Accept met.**
2. [x] **119.2 — DONE 2026-08-23.** ERP layout overview, as a CONCEPTS
       page. Maps the shells that already ship (app-shell sidebar+navbar ·
       RF full-screen · role-home · split master-detail) to when each
       fits, linked. Docs-only, zero new CSS — the owner's "different
       layouts possible for ERP" is a wayfinding gap, not a component
       gap. `/concepts/layouts`: a shell-comparison table, a 3-question
       decision tree (dedicated device? → RF; first screen after sign-in?
       → role home; list+detail at once? → split master-detail; else the
       app shell's main holds the content directly), and a "when each
       shell is the WRONG choice" table naming the real failure mode per
       shell (app shell on a single-purpose device; role home used as a
       general dashboard; RF full-screen with more than one task in the
       session; split master-detail once the record outgrows a narrow
       pane, handing off to object-page). Landed uncommitted from an
       earlier wake (fb7112f); fixed one real copy bug found reviewing it
       before closing (a duplicated "per the ... per the" clause) and
       verified the full 13-gate docs build + link check green with the
       page included. Sidebar entry already present. **Accept met.**
3. [x] **119.3 — SUPERSEDED 2026-08-23 → built as 123.2**
       (`/patterns/app-frame`; the owner clarified it is NOT an iframe and
       signed off the researched anatomy). Original text: The
       owner clarified "app screen" as a new app-frame pattern. What is
       framed decides everything — an iframe'd legacy app, a same-DOM
       module, a launcher target? Needs a design-tree grill round with
       the owner before Accept criteria can exist. Deliberately not
       buildable as written.
4. [x] **119.4 — DONE 2026-08-22.** Docs-shell theme + density controls
       redesigned live from owner feedback while browsing. Theme: a
       single cycling icon button (light → dark → system → light),
       replacing the two-option select — "system" is genuinely new
       logic, not a restyle: `color.css` has NO `prefers-color-scheme`
       rule at all (deliberate — tokens only flip on the explicit
       `[data-theme="dark"]` attribute), so "system" means resolving
       `matchMedia` in `PrefBootstrap` before paint, plus a live listener
       so a mid-session OS change takes effect with no click/reload.
       Density: a real `.bo-segmented` group (not a cycle) — each option
       directly selectable, since jumping straight to "spacious" is
       normal; reuses the primitive verbatim (its own CSS comment already
       names "compact vs comfortable" as the example case). Icons are a
       row-spacing pictogram (more/tighter lines → fewer/wider), the
       actual effect density has.

       Two real bugs found and fixed, not worked around: (1)
       `bo-segmented__input`'s three hidden radios all measured the
       IDENTICAL coordinate — a `position:absolute` flex child with no
       inset properties resolves its static position as if it were the
       container's sole item; `position:relative` on `.bo-segmented`
       (tried first) does not change this. Fixed by keeping the input in
       normal flex flow instead (`position: static`, scoped to
       `.bo-segmented__input`) — latent since the component shipped,
       dormant because `inbox.astro`'s own segmented filter was never
       among `target-size`'s probed pages. (2) Owner-reported: a stray
       teal line under some "View code" folds. Root cause: the reset's
       global `:focus-visible` ring draws outside the element, but
       `.demo-pair__code`'s `overflow:hidden` (for rounded corners) clips
       everything but the bottom sliver. Scoped fix in `Gallery.astro`
       (docs-shell CSS, not the shared reset) pulls the ring inside for
       this one case only.

       Verified: full docs build 13 gates, `check:claims` 95,
       `target-size` (9 exempt control types, up from 8 — correctly
       exempt via real spacing now, not a collision), `forced-colors`
       clean. Red-proved "system" directly: forced OS=light with
       pref=system → resolved light; flipped emulated OS to dark with no
       click/reload → resolved dark, live. Interactive click-through
       diagnostics confirmed the cycle, localStorage persistence across a
       real reload, and correct pre-paint restoration. **Accept met.**

**REFUSED, with reasons:**
- **Standalone Timeline pattern** — `bo-timeline` ships and is
  demonstrated in approval; a generic activity-feed page would
  re-photograph the same component in a second context, which the
  coverage doctrine refuses. Re-open via the 99.4 front door with a
  real screen approval's page can't answer.
- **Save panel/dialog page** — already-shipping composition
  (`bo-form-actions` sticky bar + master-detail's edit dialog), each
  documented where it lives; a dedicated page would duplicate both.
- **"column field"** — the owner's message listed it verbatim ("save
  panel or dialog, column field, kanban board") but the owner does not
  recognize it on review. Dropped; no action unless re-raised.

## Slice 118 — Owner decision: docs go showcase-first (2026-08-22)

From the owner's docs-presentation wishlist ("Simplicity — show what
components can do from simple to complex, showcase first; click to see
code"). Four options were built as CLICKABLE wireframes (artifact:
"Docs Showcase Wireframes") and judged against the docs' own three
constraints (one-string Demo doctrine, learning-path gate, print/no-JS
floor). **Owner picked Option A** — code behind a native fold on every
Demo.

1. [x] **118.1 — DONE 2026-08-22.** `Demo.astro`'s code half now sits
       behind `<details class="demo-pair__code">` with a View code
       summary — one component change, every page inherits it; the
       one-string doctrine untouched; hand-built `<pre>` samples
       (first-screen's ladder, Markup sections) deliberately unfolded,
       since there code IS the point. Print opens all folds
       (beforeprint + matchMedia('print'), initial-state honored) and
       restores after; the check-claims case red-proved itself
       organically — its FIRST run failed on the real missing
       initial-state path. The `layout="row"` spike still composes
       (the fold is the right flex panel). Full docs build green,
       `check:claims` 95/95, learning-path 20/20, screenshots
       closed/open/dark/390/row. **Accept met.**

**REFUSED, with reasons:**
- **Option B (showcase strip + folds)** — refused as a default:
  duplicates every demo's markup twice per page (drift unless
  generated), and dense ERP components miniaturise into grey noise
  (the same reason 104.2 refused tile screenshots). Re-open per-page
  only where 4+ genuinely visual variants exist (button, badge, alert).
- **Option C (Preview/Code tabs)** — you can never see preview and
  code together (the actual adoption moment), and it adds 2 tab stops
  per demo for keyboard users plus a JS dependency native `<details>`
  doesn't have.
- **Option D (code in a dialog)** — a modal for reference material;
  print loses all code; no non-JS fallback without duplicating markup.
- **Demo re-ordering mechanism** — the "simple → complex ladder" half
  of the wish is editorial per page, not structural; no mechanism to
  build.

## Slice 117 — Owner wishlist: form label position, grilled to Top/Start (2026-08-22)

Owner asked for a label-position option (top/right/left, with different
value sets per control type). Grilled through two rounds; the owner
tightened it mid-grill to the stronger shape. Settled design:

- **Two values, uniform**: `top` (the shipped default, unchanged) and
  **start** — not "left" (logical, flips under RTL, matching the
  framework's own conventions) and not "right" (no major design system
  ships label-right for text inputs; it inverts reading order — value
  before you know what it labels).
- **BEM modifier on the SECTION**, `.bo-form-section--label-start`, not
  per-field and not `data-*`: label position is a static author-time
  choice (like `bo-btn--secondary`), and section-level lets sibling
  fields share one label column. **All-or-nothing per section** — a
  per-field override waits for a real screen that needs one.
- **Alignment reuses `.bo-kv--rows`'s shipped technique verbatim**:
  `max-content 1fr` on the section grid, each field a subgrid row, so
  different label lengths still start every control at one shared edge.
- **Auto-collapses to top** below 30rem via a named `@container`
  (house convention: tabs/stepper/data-table all collapse at 30rem) —
  consumers never manage a breakpoint.
- **Checkbox/radio: documentation only, zero new CSS** — `.bo-choice`
  already does start/end purely by markup order; a CSS modifier would
  duplicate what markup solves.

1. [x] **117.1 — DONE 2026-08-22.** `.bo-form-section--label-start` built
       in `form-section.css`: grid + subgrid reusing `.bo-kv--rows`'s
       exact alignment technique, named `@container bo-form-section`
       collapsing to labels-on-top at 30rem (the same threshold tabs/
       stepper/data-table already use). Demo added to `/components/form`
       (input, select, textarea, mixed label lengths aligning to one
       edge) plus the checkbox/radio markup-order note and the "why not
       right" reasoning stated in prose. Two real runtime claims in that
       prose (the container-query collapse, the RTL flip) both got
       `check:claims` cases — the RTL one red-proved by inverting its
       assertion and confirming FAIL with real measured numbers before
       reverting. Verified: full core build (README restamped), full
       docs build (13 gates), `check:claims` 94/94, `check:target-size`,
       `check:forced-colors` all clean; screenshots 1440/390/dark/RTL,
       api.json picked up the class generated (not hand-added).
       **Accept met.**

**REFUSED, with reasons:**
- **`right` for input/dropdown** (the original ask included it) — no
  major design system ships it for text fields; it inverts reading
  order. Owner dropped it mid-grill in favour of top/start only.
- **Per-control-type value sets** (checkbox {left,right} · input
  {top,right,left} · textarea {top,left}) — collapsed to one uniform
  pair; the per-type table dissolved once `right` fell out and
  checkbox/radio turned out to be markup order, not a label-position
  case at all.
- **A per-field position override inside a section** — speculative;
  no screen needs mixed positions yet. Re-open when one does.
- **New CSS for checkbox/radio label side** — already fully solved by
  markup order today; a modifier would duplicate it.

## Slice 116 — Owner decision: inbox approval rows expand in place (2026-08-22)

Origin: the notification dogfood (Explore round 2) raised the owner's
question "should notification items carry Approve/Reject?". Grilled over
several rounds, then put to a three-reviewer round table (ERP domain
expert, UX heterogeneity, engineering reuse — deliberately briefed with
the proposal only, not the prior conclusions). The owner chose the
synthesis: **routine approval rows in the inbox expand in place; the
decision runs through approval's own dialog and endpoints; everything
else keeps link-out.**

**Correction recorded**: the earlier grill claimed "real systems avoid
approve-from-a-list" as a rubber-stamping risk. The ERP review showed
that is wrong for context-showing panes — SAP Fiori My Inbox, Oracle BPM
Worklist and Coupa all approve inline WITH the document visible, and
treat full-page-only as a regression. The claim holds only for
context-free surfaces (a notification item has title-level context),
which is exactly why the notification refusal below stands.

1. [x] **116.1 — DONE 2026-08-22.** `/patterns/inbox`'s R-4471 row
       (one step, one approver, modest value) expands in place: `bo-kv
       bo-kv--rows` header facts, a line summary, and an attachment
       **listed** but opened in a viewer, never embedded (a pane can't
       carry PDF diligence — the ERP review's guardrail). Approve/Reject
       route to approval's own endpoints (`POST /req/:id/approve|reject`
       — reason required server-side on reject, 409 on already-decided)
       via approval's own dialog, "not in this static demo" exactly as
       approval.astro's own dialog isn't. PO-88213 (step 3 of 4,
       $18,940.50, 2 days old) stays link-out on purpose, named in prose
       as the escalation counter-example — the second ERP guardrail.
       Anatomy item 5 amended ("never resolves anything itself, with one
       exception below") rather than left contradicted by item 6; Data
       contract gained the reused-endpoint row; States gained three rows
       incl. an honest No-JS note (toggle + dialog both need JS, same as
       approval's own page — a routine row falls back to link-out
       without it). Key-value facts added to Components used. Full docs
       build green (`check:page-shape`/`check:wrong-choice`/
       `check:dsa-scores` pre-build, 10793-link check + `check:markup`
       post-build) plus `check:claims` 92/92, `check:target-size`,
       `check:formatting`, `check:forced-colors` run separately, all
       clean. Verified live in a freshly rebuilt Podman image (curled
       served HTML for `inb-r4471-detail` before trusting screenshots,
       per the stale-cache risk) — 1440 + 390, light + dark, plus a
       scroll-to-row 390 shot confirming no overflow. Zero new CSS/JS
       surface — pure composition of `bo-widget`/`bo-kv`/`bo-btn`.
       **Accept met.**

2. [x] **116.2 — DONE 2026-08-22, Explore round.** `/inbox` dogfooded into
       `examples/po-app`, closing a documented gap (role-home's own spike
       note: "Needs you" linked to `/pos?status=Pending` because po-app "has
       no /inbox route"). Reuses 116.1's escalation rule against real data
       (PO-88210 $4,208 expands in place; PO-88213/88214 $12,400/$56,000
       link out) and po-app's own already-real approve/reject dialog
       verbatim — extracted into `approveDialogHtml(p)`, called from both
       `detailScreen` and `inboxScreen`, not a second copy. Two honest gaps
       named rather than papered over: no submitted-date per PO (no real
       Waiting column) and no seeded attachment data (no attachment line).
       Real bug found by the gate on its FIRST run, not by review: fixed-id
       dialogs collided once a second routine row existed (an unrelated
       earlier check mutates PO-88213 under threshold) — fixed with
       per-PO id suffixes. `check:po-app` 16/16 (3 new checks, incl. axe
       now covering `/inbox`), screenshots 1440/390 light/dark + a real
       dialog-open shot. **Accept met.**

**REFUSED, with reasons:**
- **Approve/Reject on notification items** (the originating ask) —
  notification is history ("things that happened"); an item carries
  title-level context only, and approving with no document visible is
  the real rubber-stamping case. Not re-openable as-is; the need routes
  to the inbox, which is what 116.1 does.
- **Full Fiori-style split-pane (a master-detail inbox)** —
  master-detail's own wrong-choice clause refuses "one record end to
  end"; `review-anatomy` explicitly forecloses a fourth review screen;
  and a persistent pane taxes a rapid-clear list for one row type's
  benefit.
- **Universal reading pane across all inbox row types** — the four row
  types share no schema (a failed job has nothing resembling
  header/lines/attachments); three already have dedicated screens, so a
  generic panel either degrades to title+link (no gain over the row) or
  forks into four bespoke panels (maintained drift). Type-conditional
  affordances inside one list — Gmail's calendar-invite asymmetry — is
  the precedent 116.1 follows.

## Slice 115 — Owner input: the Motion System proposal, triaged (2026-08-22)

Owner uploaded a 31-section "Busy Office Motion System Proposal" (motion as
a first-class design-system dimension: tokens, primitives, intent
categories, state machines, creative-latitude config, motion scoring).
Audited against the repo before triaging: **roughly a third already exists
in more battle-tested form** — `tokens/motion.css` (3 durations + 1 easing,
reduced-motion-zeroed), the opt-in `motion/motion.css` module (8
`.bo-motion-*` classes, explicitly not an Animate.css clone), the
`check:motion` gate on every core build, and `/base/motion`. The audit also
found the proposal's §11 state-machine vocabulary would COLLIDE with a
deliberate shipped convention (see 115.2), and one real gate gap worth
closing (115.3). Full precedent chain in this slice's commit message.

1. [x] **115.1 — DONE 2026-08-22.** New "Motion intent" section names all 8
       categories, each mapped to where it lives in the framework (shipped
       `.bo-motion-*` class, another component's own transitions, or "not
       shipped — build it in your own app" for Delight, stated honestly
       rather than force-filled). Quick reference table gained an Intent
       column; all 8 classes tagged (verified against the BUILT page, not
       the source — zero `—` fallbacks, confirming the map's keys match the
       generated class list exactly). Opener gained the wrong-choice
       clause, verified structurally in built HTML (`/base/` pages are
       outside `check-wrong-choice.mjs`'s scope — extending that gate's
       scope was deliberately left out of this item). Full suite green:
       13 docs gates, core build, 116 vitest, stylelint, `check:claims`
       92/92. **Accept met.**
2. [x] **115.2 — DONE 2026-08-22, on `/concepts/js-behaviors`** (not
       `/base/motion` — `data-state`/`data-loading` are core-wide
       conventions, not scoped to the opt-in motion module). Two new
       sections. **"State attributes"**: names the deliberate split with
       api.json-generated values (`data-state` = `closed|current|done|
       open|pending|rejected` — one attribute, two genuinely different
       domains, structural open/closed vs. sequence position; `data-loading`
       = `true`) plus the per-domain escapes (`data-row-state`, `data-day`),
       all pulled live from `api.dataAttrValues`, verified in the BUILT
       page (all four value strings confirmed present, not just the source
       edit). **"The Save sequence"**: the real Idle→Saving→Saved recipe
       (text swap + `aria-busy` + `data-loading`), including button's
       MEASURED no-spinner decision (opacity dimming measured ~3.24:1
       contrast, under 4.5:1) so nobody re-proposes it blind. One claim
       caught and fixed before shipping: a first draft asserted the
       htmx `data-loading` bridge was "the one HTMX-aware CSS rule in the
       framework" — grepped `integrations/htmx.css` and found five
       (`.htmx-indicator`, `.htmx-swapping`, `.htmx-settling`, the
       bridge, the keyframe), corrected before commit. Full suite green
       (13 docs gates, core build, 116 vitest, stylelint, `check:claims`
       92/92). **Accept met.**
3. [x] **115.3 — DONE 2026-08-22.** `check-motion.mjs` extended to
       `transition`/`transition-duration` alongside `animation`, refactored
       to run one shared rule against both properties (a `PROPERTIES` list)
       rather than duplicating the walk logic — the same DRY concern the
       gate's own domain cares about, applied to the gate itself. Clean
       full core rebuild passes with the extension embedded in the real
       build chain: `animation: 15 token-driven, 3 explicit override ·
       transition: 24 token-driven, 0 explicit override` — the zero-backlog
       claim held. **Red-proved in BOTH directions**, not just the failing
       one: injected a literal-duration transition into the BUILT
       `dist/css/index.css` with no override → gate failed, naming the
       exact selector and a fix; added a matching
       `@media (prefers-reduced-motion: reduce) { … transition: none }`
       to the SAME injected rule → gate passed, override counter
       incremented by exactly one. Both injections reverted, gate
       reconfirmed clean. Full suite green (13 docs gates, core build,
       116 vitest, stylelint, `check:claims` 92/92). **Accept met.**

**REFUSED, with reasons (re-open conditions stated per item):**
- **Unified `data-state="idle|loading|success|error"` lifecycle vocabulary
  (§11)** — collides with the shipped, deliberate convention split and
  with button's measured no-spinner decision. Re-open only with evidence
  the existing split fails a real screen.
- **Motion Quality Review / scoring + advisory motion checker (§22–23)** —
  the Slice 112 Quality-Index refusal verbatim (no second consumer;
  composite scores fail the measurement doctrine). Re-open when a second
  real consumer exists.
- **`creative_latitude` / `motion_decisions` YAML config (§2.5/§17/§21)** —
  config surface for consumers that don't exist; re-open alongside the
  Screen Contract if the 112.3 pilot admits that layer.
- **Spring / morph / shared-element / stagger / Phase 5 (§6/§9/§14)** —
  motion's rung 4: no ERP screen in this repo demonstrates the need, and
  52.1 already refused `animation-timeline` as the off-floor cosmetic class
  once. Re-open via the 99.4 front door when a real pattern screen needs
  one.
- **Token expansion to 5 durations / 4 easings / distance / scale
  (§5–8)** — the 3+1 set has served all 43 components; less-for-more
  refuses options serving no shipped need. Re-open per-token when a
  component actually needs a value that doesn't exist.
- **`docs/motion/` gallery IA (§19), repo restructure (§28), literal
  `@layer bo.motion` (§27)** — conflict with actual layer names
  (`bo-tokens`/`bo-utilities`) and structure; `/base/motion` has not
  outgrown one page. Ideas adopted, literal structure refused (Slice 111's
  reference-design-system precedent).
- **Core components importing the motion module** — standing precedent:
  collapsible cards DUPLICATED the grid-template-rows technique into
  dashboard.css rather than making core depend on the opt-in module; the
  motion module stays opt-in.

## Slice 114 — Owner wishlist: adopt htmx 4 (2026-08-22)

Owner: *"just use htmx 4"*, `https://four.htmx.org/docs`. Verified via
`WebFetch` before triaging rather than trusted or guessed from training
data — the URL is real, official, and current.

**Confirmed: htmx 4.0 is beta 6, not a stable release**
(`htmx.org@4.0.0-beta6`), and it carries a breaking change that inverts
the framework's own load-bearing documentation. `getting-started/htmx.astro:83`
states outright, and dozens of pattern pages' Data-contract tables repeat
the same fact for their 422/409 rows: **"htmx swaps 2xx responses and
discards everything else"** — the "swap it in yourself"
`htmx-ext-response-targets` workaround exists *because* of that default.
htmx 4's documented change is the exact inverse: **"htmx 4 swaps all HTTP
responses. Only 204 and 304 do not swap."** Other stated breaking changes:
XMLHttpRequest → Fetch API, `hx-ext`/`hx-vars`/`hx-prompt` removed,
`hx-disable` → `hx-ignore`, a 60s default request timeout (was none),
implicit → explicit (`:inherited`) attribute inheritance.

**Triaged as a feature/requirement against the Objective, refused for
now:**

- **Not a drop-in swap.** Adopting htmx 4 wholesale would silently
  invalidate every documented "htmx discards non-2xx, swap it in
  yourself" claim across the pattern catalogue — not a version bump, a
  doctrine-level behavior change touching dozens of already-verified
  `check-claims.mjs` cases and Data-contract rows.
- **Beta, not stable** — this project's own quality bar (verify live,
  executable claims, `check:rf-floor`-style browser-floor discipline)
  has never shipped against a pre-release dependency; adopting one now
  would be the first exception, made without a stated reason to accept
  the risk.
- **No demonstrated gap** — nothing currently broken or blocked needs
  htmx 4's specific changes; the ask names a version, not a problem.

**Refused for now. Re-open when: htmx 4 ships stable, AND someone runs a
scoped audit of every "discards non-2xx" claim this framework documents
(`getting-started/htmx.astro`, every pattern's 422/409 Data-contract
rows, the `htmx-ext-response-targets` guidance) against the new
swap-everything default before any adoption — the same "verify the
INJECTION, not just the red result" discipline this project already
applies to gates, applied here to a dependency's documented behavior
before trusting it.** Nothing touched live; this is a recorded refusal,
not a build item.

## Slice 113 — Owner wishlist: improve the rich text sample (2026-08-22)

Owner attached a screenshot of a third-party editor's description field
toolbar (heading dropdown, style dropdown, B/I/U/strikethrough, clear
format, text color, highlight, blockquote, code, paragraph mark, link,
image, ordered/unordered/checklist lists, align, indent/outdent, a Table
dropdown) with the ask "Improve rich text sample."

**Triaged against the existing rung ladder** (102.1's grill,
`.roundtable/grill-richtext-ladder-2026-08-21.md`, which already measured
five rungs and found the ladder complete — rung 3 is `.bo-richtext` +
native `execCommand`, zero framework JS; rung 4 is a real engine mounted
into the same chrome, deliberately undocumented-as-shipped since it needs
a dependency the framework does not carry). The reference toolbar splits
cleanly across that boundary:

- **Rung-3-achievable, zero new framework JS or CSS** (native
  `execCommand`/`queryCommandState`, same dozen-line pattern the current
  Basic demo already uses for bold/italic/lists): strikethrough
  (`strikeThrough`), headings (`formatBlock` 'h2'/'h3'), blockquote
  (`formatBlock` 'blockquote'), align (`justifyLeft/Center/Right`),
  indent/outdent (`indent`/`outdent`), clear formatting (`removeFormat`),
  link (`createLink`).
- **Rung-4/infrastructure, refused as new framework surface** — same
  reasoning as the PDF/barcode refusals (101.7): image upload needs
  server-side hosting; table insertion needs real table-building logic;
  checklist needs custom list-item state `execCommand` doesn't provide;
  color/highlight pickers need a color-picker UI component of their own.
  None of these are "a CSS framework's job" per that precedent, and none
  are demonstrated by a real ERP screen in this repo (the grill's own
  finding: `.bo-prose`'s rung has never been exercised against a pattern
  page, `.bo-richtext`'s heavier rungs even less so).

1. [x] **113.1 — DONE 2026-08-22. No pre-existing "Advanced" section
       existed — the item's own text assumed one; created it.** All seven
       button groups added (strikethrough, H2/H3, blockquote, 3-way
       align, indent/outdent, link, clear), zero new CSS, wiring extends
       the same `data-richtext-cmd` pattern to handle value-taking
       commands (`data-richtext-value` for `formatBlock`, a `prompt()`
       for `createLink`) and a mutually-exclusive align group.

       **Tested live, three real surprises found, none assumed:**
       strikethrough outputs the deprecated `<strike>` tag, not `<s>`
       (added to the existing Bold-variance sanitizer caveat); `formatBlock`
       correctly produces real `<h2>`/`<h3>`/`<blockquote>` elements;
       `removeFormat` clears inline styling only — a heading stays a
       heading and a link stays clickable after "Clear," which is not
       what the button name suggests, documented in prose rather than
       silently assumed. Two of the three promoted to permanent
       `check-claims.mjs` cases (formatBlock's real heading, the justify
       group's mutual exclusivity) — `removeFormat`'s scope has no
       pass/fail shape, so it stays prose-only. `data-richtext-value`
       needed adding to `check-data-hooks.mjs`'s documented-hooks list
       (the gate caught it correctly on first build). Full suite green
       (13 docs gates, `check:claims` 92/92 up from 90).
2. [x] **113.2 — DONE 2026-08-22.** New section right after "Why no
       engine," naming all four refused items and what they need: image
       upload (a server endpoint + URL — `insertImage` only references
       an already-hosted image, verified live), table insertion (real
       cell/row/column logic no command provides), checklist (custom
       list-item state `insertUnorderedList` has no concept of), color/
       highlight (the `execCommand` genuinely works — verified live, and
       produces a deprecated `<font color>` tag, one more sanitizer-
       allowlist variant alongside Bold's `<b>` and strikethrough's
       `<strike>` — but the picker UI is a component of its own, not
       shipped). Two claims stated as fact were verified live before
       shipping (`insertImage`'s URL-only behavior, `foreColor`'s real
       support + its `<font>` output), not assumed from how
       `execCommand` usually works elsewhere. Full suite green (13 docs
       gates, `check:claims` 92/92, page-shape, wrong-choice). **Closes
       Slice 113.**

**REFUSED, with reasons:** image upload, table-insertion UI, checklist
list-type, and color/highlight pickers as new framework surface — each is
infrastructure or a distinct sub-component the CSS-first doctrine and the
101.7 PDF/barcode precedent both refuse; re-open only if a real ERP
pattern page demonstrates the need (the 99.4 front door) rather than a
reference screenshot alone.

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
5. [ ] **112.5 — "Which Pattern Should I Use?" docs page, after the
       112.3 verdict.** A task→pattern decision-flow page generated from
       `patterns.json` (never hand-maintained — it would be the fifth
       interpretation of the pattern system the proposal itself
       forbids). Written after the verdict so the page and any contract
       pattern-selection logic are one authoring pass from one source.
       Pays regardless of 112.4's fate.

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

From 109.8's owner answer ("let's include per your recommendation — grill
the idea. simplicity & maintainability & easy for AI to understand").
Grill report: `.roundtable/grill-catalogue-v2-candidates-2026-08-22.md`.
Two of five REFUSED there with re-open conditions (kanban, close cockpit).
The three builds, in queue order AFTER 101.4-101.7:

0. [x] **110.0 — grill the operating idea itself: simplicity &
       maintainability & AI-manage & human-monitor.** Done 2026-08-22 —
       **scope note**: the owner's ask actually referred to Slice 110's
       PATTERNS (clarified same day; the per-pattern grill is the addendum
       in the candidates report, and 109.3's bar gains the AI/human split
       requirement from it). This operating-model grill stands as a bonus
       whose findings carry their own measurements:
       `.roundtable/grill-ai-managed-human-monitored-2026-08-22.md`.
       Verdict: adopt the quartet as the NAMED standing rubric (it maps
       1:1 onto machinery already in force — Objective §1, Standardize
       loop, recipes/gates/llms.txt, loop-log/storage doctrine), never as
       a fifth scoring apparatus (101.3's stop rule). The criteria
       measurably conflict (78% commentary finding) so the rubric asks
       "which criterion does this serve", not "more of all four". The
       grill's real catch: ROADMAP.md is the worst violator of all four —
       11,657 lines, 60% closed history — and the human-monitoring gap is
       real (chat summaries are the channel the number-honesty rules
       distrust). Hence 110.4/110.5 below; 102.4 (wake prompt, owner
       call) re-surfaced as the standing AI-manageability defect.

1. [x] **110.1 — role-home (Fiori Overview Page / Dynamics Workspace).**
       **Done 2026-08-22.** Composed 100%: `bo-widget-grid` of role cards —
       "Needs you" (2-col span, counting the SAME source as the inbox,
       linking into it), stats with two-channel deltas, a native
       `<progress>` for the close, a Recent list. Zero new CSS. One
       real error caught by check:markup before shipping: a hand-rolled
       `.bo-progress__bar` inner div that does not exist — the real
       contract is the native `<progress>` element (value/max + implicit
       role from the platform); fixed in both the live demo and the code
       sample, verified live (`role: implicit`, value/max read correctly).
       **This also answers the standing 99.1 open question** ("is
       app-launch the landing page, or is a live role home a separate
       screen") — it is separate, and this pattern is it; app-launch's own
       wrong-choice clause and this page's both name each other. "One
       pattern, many roles" demo proves the §2 shape live: identical
       markup, a buyer's morning and a warehouse supervisor's, only card
       CONTENTS differ. Data contract makes "needs you" counts read from
       the inbox's own source (two counts for one number is how a home
       screen starts lying) and per-role content a server decision, never
       client-hidden. States: success-empty distinct from loading/failed
       PER CARD (one dead query must not blank the whole screen), and a
       real first-day state. Complexity 2, all gates green, verified live
       both themes + 390px.
       Composes 100%: `bo-widget-grid` of role cards — "my open items"
       (count + link INTO the inbox), "my KPIs" (`bo-kv` + amount),
       "recent documents". Zero new CSS expected. **Sequenced after 101.4
       deliberately**: the open-items card is a filtered view OF the inbox;
       building the summary before the thing it summarises would invent
       the inbox contract twice. **Accept:** full pattern recipe incl.
       wrong-choice clause (vs app-launch: launcher ≠ home; vs dashboard:
       monitors the BUSINESS, this monitors MY WORK); states incl. the
       "nothing needs you" success-empty; the owner's three criteria
       addressed in the report accompanying the build.
2. [x] **110.2 — job monitor / batch-run history.** **Done 2026-08-22.**
       Composed 100%: a plain data table, Last-run column carrying every
       state a schedule can be in — failed/running/succeeded/stalled/never
       run — as one always-visible column, no drill-in. **Stalled kept
       deliberately distinct from running**: same warning tone, different
       word plus a duration, because a job announcing progress and one
       that has gone quiet for 47 minutes look identical without it. Scope
       guard from the grill enforced in the opener: not for authoring
       schedules (the admin module's job) and not for reading one run's
       own numbers (the report/staging screen's job) — this page only
       tracks whether runs happened and how they went. `aria-busy="true"`
       on the running cell is the second channel behind the badge word.
       This screen IS the fourth criterion (AI-manage/human-monitor) by
       design — its entire job is watching automation, agents' own
       scheduled work included, through the same retry/cancel endpoints a
       human's buttons call. Zero new CSS, complexity 2, all gates green,
       verified live both themes + 390px. Composes 100%:
       data-table (name/schedule/last/next run) + badge status
       (two-channel) + progress for running + record-detail shape for one
       run's log. **Scope guard in Accept: MONITOR only** — view, retry,
       cancel; schedule AUTHORING is the ERP's admin module, not this
       screen (the maintainability criterion, applied). Data contract must
       cover polling (`hx-trigger="every Ns"`) and the states table:
       running, failed, stalled, never-ran, retried.
3. [x] **110.3 — schedule screen (bo-calendar assembled).** **Done
       2026-08-22.** Composes 100% from what already shipped: the
       [calendar](/components/calendar) component for the month grid and the
       exact swap-contract idiom [master-detail](/patterns/master-detail)
       already established (a list stays put; only the detail region is
       re-fetched) — applied here to a month instead of a table. A day
       carrying at least one scheduled entry is a real link; an empty
       workday is a plain cell, so "does this day have anything on it" is
       answered by the grid itself before a reader clicks. The open day
       reuses the calendar's own `data-day="selected"` mark rather than
       inventing a second "which day is open" mechanism — the same
       one-state-one-owner discipline `master-detail` uses for
       `aria-selected`. Zero new CSS, complexity 2. Full pattern recipe:
       opener (who/how-often/done, with a bold **Not for authoring a
       schedule** / **not for one entry's own detail** wrong-choice clause
       pointing at the admin module and record-detail respectively),
       Anatomy, Data contract (month fetch vs. day-detail fragment vs. the
       stale-link 404 case), a seven-row States table, and a
       Components-used list — every claimed component (calendar, card,
       data table, badge) is actually rendered on the page, verified by
       `check:components-used`. `/components/calendar` gains an "assembled
       screen lives in Patterns" pointer section and a Related link, the
       same shape `/components/data-table` already carries to
       `/patterns/list-report`. Sidebar entry added under Patterns:
       monitor & output (pattern-groups.mjs, roadmap 104.1's unified
       source — this branch predated that unification, reconciled at
       merge time rather than adding a second sidebar structure). All
       build gates green (page-shape; wrong-choice; dsa-scores;
       calendar-grid; data-hooks; components-used; link-check; the
       patterns-index gate from 104.1). Verified live
       (`python3 -m http.server` over the built `dist/`, puppeteer
       screenshots) at 1440px and 390px, light and dark, via localStorage
       `bo-theme` (the docs shell persists an explicit choice, not
       `prefers-color-scheme`, so a media-feature emulation silently
       renders the wrong theme — caught on the first screenshot attempt,
       worth naming for the next docs-screenshot script). Honestly LOW
       priority as accepted: single-source demand (Odoo); if this had not
       reached the top of the queue for several more wakes, that would
       have been the queue working, not a miss.

4. [x] **110.4 — DONE 2026-08-22. 83 closed slices moved verbatim to
       `ROADMAP-archive.md` (live file 12,406 → ~5,500 lines), one pointer
       line each left behind.** Mechanical section movement by script
       (self-tested: an injected `[ ]` open item kept its slice live);
       red-proofs all structural — zero open items in the archive, every
       archived heading reachable from its pointer, `[x]`/`[ ]` counts
       conserved, and the 101.2 enumeration re-run post-move (3 `roadmap
       NN.N` refs remain live; only the known-dangling 92.5/94.1 narrative).
       One gate touched: `check-floor`'s ALLOW gains `ROADMAP-archive.md`
       (same quoted-history rationale as ROADMAP.md), red-proved by removing
       the entry — the gate goes red on exactly 2 archived floor literals.
       Also closed 101.1's checkbox (superseded = closed; it was polluting
       the open-item count). Original item text follows.
       From 110.0's
       grill: 11,657 lines, 78 of 92 slices fully closed = 6,961 lines
       (60%) of pure history that every wake re-reads and no owner can
       review. Precedent: DESIGN-GRAPH's own compression rule; the storage
       doctrine holds (markdown, git, diffable — an archive FILE, never a
       database). **Accept:** closed slices move verbatim to
       `ROADMAP-archive.md` with one pointer line each left behind;
       red-proved checks that zero open items were archived, every
       archived slice heading is reachable from its pointer, and every
       `roadmap NN.N` reference in the live file still resolves (the
       101.2 enumeration re-run post-move). Mechanical, one slice at a
       time if needed — never a regex bulk rewrite of prose (the
       bulk-edit rule).

5. [x] **110.5 — generated STATUS.md: the human's ten-second "now" view.
       Done 2026-08-22.** `scripts/loops/generate_status.py` derives
       `STATUS.md` at the repo root wholesale from three sources that
       already exist — ROADMAP.md's open `[ ]` items (scanned fresh,
       grouped by slice), `dispatch_status.py`'s counter-overdue report
       (run as a subprocess and embedded verbatim, no re-derivation), and
       the last 10 rows of `loops.db` — plus an owner-blocked list (open
       items whose body text mentions "owner"). No hand-authored data;
       nothing in `STATUS.md` can drift from the log because nothing in
       it is typed twice. `record_iteration.py` now calls the generator
       after every recorded iteration (best-effort — a regeneration
       failure warns, it never fails the recording itself, which is the
       operation that matters). **Verified rebuildable:** deleted
       `STATUS.md`, regenerated, diffed against the pre-delete copy with
       the timestamp line stripped — byte-identical. **Sunset test
       written into the file itself**: if the owner in practice keeps
       asking for or reading chat summaries instead of `STATUS.md`,
       delete it and its generator — that is proof it is ceremony, not a
       read habit.

6. [x] **110.6 — kanban board, no-drag baseline (OWNER DEMAND, 2026-08-22).**
       **Done 2026-08-22.** Lanes = widgets in a horizontally-scrolling
       cluster (they stack at 390 via cluster wrap); cards = form-section
       boxes; move = a dropdown listing ONLY the stages the server says are
       legal from here (the client never guesses the workflow). The page
       carries a whole section on why no drag in the baseline, citing
       100.1's evidence, and points at 110.7 as the open re-grill. Lane
       count badges are the monitoring signal; an aged Blocked card shows
       its duration in words (the job monitor's stalled discipline). Data
       contract: agents move cards through the identical POST a human's
       menu item calls; 409 for illegal transitions re-renders in place
       with the reason. Zero new CSS, complexity 3, dropdown contract
       matched exactly this time (popovertarget + initDropdowns — the
       notification page's lesson applied), menu verified open with a real
       click, all gates green first build, both themes + 390.
       The owner explicitly chose build, overriding the grouped-list
       objection — recorded as stated consumer demand, the front door's own
       graduation trigger. Baseline is compose-only: lanes = grid columns
       of `bo-widget` cards, move-card = per-card action menu (two-channel,
       keyboard-first), zero new CSS expected. The page states plainly that
       drag is not offered in the baseline and why (pending 110.7).
       **Accept:** full pattern recipe incl. machine-operable move contract
       (what an agent POSTs) and the human-monitoring signals (lane counts,
       aging cards); states incl. empty-lane vs empty-board; wrong-choice
       clause names list-report-grouped as the cheaper alternative when
       stage visualisation isn't the point. After 110.2 in queue order.

7. [x] **110.7 — re-open the drag refusal (100.1): fresh grill at full
       cost (OWNER ASK, 2026-08-22).** Not a reversal — a fresh grill with
       the complete bill visible: hand-rolled keyboard model (pick up /
       move / drop + live-region narration "moved to 3 of 7"), a dedicated
       touch handle (`touch-action: none`, first in the framework),
       enhancement-only atop the button path (two-channel is not
       waivable), permanent dual-model maintenance. Scope: kanban
       card-between-lanes FIRST (the owner's driving case); ordered-list
       reorder only if the same mechanism covers it free. **Accept:** a
       grill report with build/refuse per surface; if build, its own item
       carrying the full a11y contract. 100.1 stays on record; superseded
       only if this grill says build.
       **Done 2026-08-22, verdict REFUSE (again).**
       `.roundtable/grill-kanban-drag-2026-08-22.md` re-ran 100.1's three
       questions against the real shipped screen (110.6) instead of a
       hypothetical one. Every underlying fact from 100.1 still holds on
       re-measurement (`touch-action`: 0 hits in shipped CSS; `draggable`/
       `dragstart`/sortable libs: 0 hits; ARIA's `aria-grabbed`/
       `aria-dropeffect` still deprecated with no successor standard), and
       the kanban board makes the bill *worse*, not better: its move is
       already a 2-action, zero-scroll menu operation at any board size
       (the menu lists only legal next stages), while a kanban
       keyboard-drag equivalent is two-dimensional (pick a lane, then a
       position) versus the one-dimensional case 100.1 already declined,
       and the board's horizontal lane-scroll plus per-lane vertical
       scroll makes the touch/scroll conflict worse, not simpler. Two-
       channel non-waivable means drag can only ever be pure additive
       cost here — the menu stays regardless, so nothing already shipped
       is ever retired to pay for it. Ordered-list "for free" is moot: no
       mechanism ships to extend. 100.1 stays on record, not superseded.

## Slice 109 — Owner direction: the real-ERP pattern catalogue + regrouping (2026-08-22)

Owner: *"low quality of patterns content, grouping need to improve. it
needs to think about the patterns that can use in real ERP. pls list out
the list that we should have. let me know."* Answered same wake:
`.roundtable/erp-pattern-catalogue-2026-08-22.md` — a 25-row catalogue in
ERP language (industry name beside ours), grouped by job family. The
catalogue's own finding: it is 20 shipped + the 4 already-queued builds
(101.4-101.7) + 1 standing owner question (role home, open since 99.1) —
nothing new needed inventing; what was missing was seeing it as ONE
catalogue in ERP vocabulary and job order.

1. [x] **109.1 — regroup the sidebar (and the 104.1 tile index) from 3
       groups to the catalogue's 5 job families**: Enter & find / Work one
       record / Enter & correct data / Decide & clear queues / Monitor,
       report & output. Fixes a real reader problem: "review & approve"
       currently holds the detail family (`record-detail`, `object-page`,
       `master-detail`), which are not review screens. **Accept:** sidebar
       groups match the catalogue; no URL changes; 104.1 inherits the
       grouping; check-page-shape/sidebar assertions still green; verified
       live both themes.
2. [x] **109.2 — rename `invoice-list` → `list-report` (industry name),
       with redirect.** The page is and always was the generic list screen;
       the invoice is sample data. **Accept:** new slug, old URL redirects
       (the redirect-stub mechanism check-links already understands),
       sidebar + tile + all internal links updated, llms.txt regenerated.
3. [x] **109.3 — DONE 2026-08-22. Bar extracted:
       `.roundtable/pattern-quality-bar-2026-08-22.md`.** Every line cited
       to its grill finding (102.2/102.3) or the owner-quartet/112-grill
       roadmap text — no invented requirements. Two citations spot-checked
       against the source reports before trusting the deliverable (a
       delegated extraction is an instrument's first output like any
       other). The sweep is split out as 109.13 below, per this item's own
       Accept. Original item text follows.
       Quality bar, sequenced not sprayed: run the queued
       102.2 (object-page) and 102.3 (editable-grid) grills FIRST, extract
       the per-section bar they produce (states depth, data-contract
       realism, keyboard walkthrough), then sweep the other 18 pages
       against it — the 94.10 fix-the-recipe move. 101.4-101.7 get written
       against that bar from day one. **Extended by the owner's quartet
       (2026-08-22, 110 addendum): the bar also requires each pattern to
       state its data contract in machine-operable terms (what an agent
       POSTs to act, what returns) and to name which regions are the
       human-monitoring signals — the AI-manages/human-monitors split made
       explicit. Both halves already live in the recipe's data-contract
       and states sections; this names them, no new gate.** **Grown by the
       Slice 112 grill (2026-08-22, settled Q9): the sweep also writes the
       13 outstanding wrong-choice clauses (`PATTERN_TODO` in
       `check-wrong-choice.mjs`) — avoid-when is part of this bar, and one
       pass per page beats two; 112.1's metadata extraction depends on
       this coverage.** **Accept:** the bar exists as a
       written checklist in `.roundtable/` after the two grills; the sweep
       is its own later item with per-page verdicts.
4. [x] **109.4 — DONE 2026-08-22. VERDICT: FOLD.** Bar-scored, not taste:
       field-editor fails shape-not-domain (framed by "the SM30 case"),
       and its own words admit its anatomy is "the data table with
       `data-row-edit`... nothing here is a field editor component" — the
       same four elements editable-grid already documents. The one real
       distinction (single-Save-at-bottom, one-record scope) is a variant
       paragraph on `detail-form`/`editable-grid`, not a standalone page.
       **Fold into detail-form/editable-grid + redirect the URL — execution
       is separate follow-up work, not done here.** Full reasoning:
       `.roundtable/pattern-sweep-109.6-batch1-2026-08-22.md`.

4b. [x] **109.13 — DONE 2026-08-22 (renumbered from a same-slice collision
       with the existing 109.6/109.8 below — caught before it shipped a
       dangling/ambiguous reference). The pattern sweep against 109.3's bar,
       26/26 pages scored.** Batch 1 (13 `PATTERN_TODO` pages) + batch 2
       (13 remaining pages, 3 parallel agents), reports:
       `.roundtable/pattern-sweep-109.6-batch1-2026-08-22.md` and
       `...-batch2-2026-08-22.md`. `check:wrong-choice` 30/0, unblocking
       112.1. Two real defects found and independently re-verified against
       source before fixing (not trusted on a sub-agent's say-so): `wizard`
       claimed panels render at once without JS (contradicted by its own
       `hidden` attribute); `schedule` claimed the narrow-screen stack was
       "the calendar's own container breakpoint" (grep-confirmed
       `calendar.css` carries no such query). Both corrected. Per this
       item's own scope, everything else the sweep found is queued, not
       silently fixed — 109.14 through 109.18 below. **Accept met**:
       per-page verdict recorded for every pattern page; wrong-choice done.

11. [x] **109.14 — DONE 2026-08-22. All 26 pages that lacked a No-JS row
       now have one** (a precise recount found 26, not the sweep's
       original 25 — one more page had drifted since). 4 parallel
       agents, each required to read the page's real script imports and
       the actual behavior source before writing a claim. Two spot-
       verified independently before trusting (master-detail's dialog
       claim, command-bar's no-native-affordance claim — both grepped
       against source, both correct). Full per-page detail in commit
       `9e90d3d`'s message. **Accept met.**
12. [x] **109.15 — DONE 2026-08-22.** (a) **Relocated/duplicated**, one
       Anatomy-tied sentence each: `job-monitor` (Last-run column),
       `notification` (Unread contract), `role-home` ("Needs you" card);
       `output-form` handled honestly rather than force-fit — its own
       prose already says the monitoring happens on `report`/`job-monitor`,
       so Document identity's new sentence says that instead of claiming
       a signal this page doesn't have. (b) **Authored where real**:
       `reporting-dashboard` (Stat tiles' delta + staleness timestamp),
       `record-detail` (Status timeline's actor column — an agent's
       changes become visible there). **Declined with a stated reason**
       where genuinely absent: `schedule` (a planner, not oversight of
       automation) and `master-detail` (manual browse/edit, nothing
       automated running behind it) — both got an explicit "No
       AI-manages/human-monitors split here, stated rather than left
       silent" paragraph rather than silence. Full suite green (13 docs
       gates, `check:claims` 88/88). **Accept met.**
13. [x] **109.16 — DONE 2026-08-22.** The sweep's original list
       (`master-detail`, `notification`, `output-form`, `record-detail`)
       turned out wrong on re-check — a fresh whole-catalogue scan found
       `master-detail` already had its 404/409 rows, and 6 DIFFERENT
       pages were the real gap: `app-launch`, `notification`,
       `output-form`, `record-detail`, `reporting-dashboard`,
       `role-home`; plus 3 more the original list never named
       (`bulk-actions`, `list-report`, `staging`). **My own first-pass
       verification regex was wrong twice in a row** — a loose word match
       ("error"/"failure") false-positived on prose like "never an
       error" and "control failure" that don't document a failure
       response, then a stricter status-code regex false-negatived on
       `value-help` (already had "a 4xx" as literal text, not digits) and
       missed `staging`'s fix (case-sensitive "deliberately" vs
       "Deliberately"). Both caught by manually reading every flagged
       page's raw Data-contract section before trusting the count —
       exactly the "an instrument's first output is not evidence"
       discipline. Fixed: `bulk-actions`/`list-report`/`staging` state
       their deliberate 200-with-per-row-classification design (no 4xx
       for a bad row, by design — not a gap); the other 6 got a real
       404/5xx row grounded in each page's own established failure
       pattern (per-widget/per-card retry, per-section alert), never
       invented from nothing. Full suite green (13 docs gates,
       `check:claims` 88/88). **Accept met.**
14. [x] **109.17 — DONE 2026-08-22. Found a genuinely shipped, silent bug
       while adding the cases.** `inbox` (arrow-key radio nav) and
       `kanban` (Move menu open + auto-close-on-select) both got real
       `check-claims.mjs` cases — real key/click events, not synthetic.
       `job-monitor` genuinely has nothing live to check: its Retry/Cancel
       are inert `type="button"`s with no handler, and the documented
       `hx-trigger="every 30s"` polling is prose only, never actually
       applied to the demo markup — confirmed by reading the page, not
       assumed; no case forced where none applies.

       **The kanban case failed on first run** — the menu opened but
       never auto-closed. Diagnosed live rather than assumed: a
       `page.on('pageerror')` listener caught `Failed to resolve module
       specifier "@busy-office/ui/js"`, meaning `initDropdowns()` had
       never actually executed on this page. Root cause, found by
       comparing against every other pattern page: kanban's live wiring
       script used `<script type="module">` — every other page's real
       (non-sample) script is a BARE `<script>` tag, which Astro bundles
       and resolves bare specifiers for; an explicit `type="module"` opts
       out of that processing and ships the raw unresolvable specifier
       verbatim. Fixed (`type="module"` → bare `<script>`); the fix
       verified live, not just by removing the attribute and hoping —
       `check:claims` went from failing to passing on that exact case.
       **This means `initDropdowns()` had never run on kanban's live
       page since it shipped** — the Move menu's positioning and
       auto-close-on-select were silently broken in production this
       whole time, caught only because 109.17 asked for a live case.
       Two false leads chased and ruled out before finding the real
       cause (a code-sample script-tag duplication theory, and a
       raw-vs-escaped-entity grep mismatch) — both documented as the
       kind of instrument-not-evidence check this doctrine asks for.
       90/90 claims pass. **Accept met, plus a real production fix.**
15. [x] **109.18 — DONE 2026-08-22.** `kanban`'s lane cluster scroll
       container gained `tabindex="0"`, confirmed in the built output.
       `record-detail`'s four Anatomy items linked to their real
       components — `/components/breadcrumb`, `/components/kv`,
       `/components/dashboard#card`, and `/components/approval-workflow`
       (the page that documents both `.bo-timeline` and `.bo-audit`,
       found by grepping which docs page actually uses those classes
       rather than guessing); Opener gained a "How often" clause. Full
       suite green (13 docs gates incl. link check confirming all four
       new links resolve; `check:claims` 90/90; core build; vitest;
       stylelint; page-shape). **Accept met — closes Slice 109's build
       queue** (109.19/109.14/109.15/109.16/109.17/109.18 all landed).
16. [x] **109.19 — DONE 2026-08-22 (commit `69a5336`). Checkbox missed at
       landing time — the implementation and its record_iteration.py
       entry both landed, but this file's checkbox never flipped, caught
       later by STATUS.md showing Slice 109 as 1-open when the real
       count was zero.** Original item text follows.
       Execute the field-editor fold decided by 109.4.
       **Dispatch-order note (LOOPS.md's oldest-item rule, not
       convenience): this jumps ahead of the older 94.8 and the
       109.14-18 queue, and that override is written down rather than
       silent, per LOOPS.md's own warning against convenience reordering
       (the roadmap-53.2 starvation precedent — an older item sat 9 wakes
       behind newer, louder ones for exactly this kind of un-stated
       jump).** The justification: 109.14 (No-JS rows) and 109.16
       (4xx rows) will both touch `detail-form.astro`/`editable-grid.astro`;
       running the fold first means those items touch each page once,
       not twice, and never write content into `field-editor.astro`
       moments before it is deleted and redirected — real, measured
       rework avoided, not a preference. Collision-checked 109.19 against
       the WHOLE of Slice 109 (and the archive) before minting it — the
       lesson from 109.13's under-scoped check earlier this session.
       **Accept:** field-editor's one load-bearing distinction
       (single-Save-at-bottom, one-record scope, per 109.4's verdict) is
       folded in as a variant paragraph on `detail-form.astro` (the closer
       fit — same one-record framing) or `editable-grid.astro` if the
       row-level mechanics turn out to dominate once written; the old
       `field-editor.astro` page is replaced with a redirect stub (the
       same mechanism 109.2's `invoice-list` → `list-report` rename
       used); every internal link/Related-footer badge pointing at
       `/patterns/field-editor` is updated; `pattern-groups.mjs`,
       `patterns-index.json`/`patterns.json` regenerate clean; the
       `check:links`/`check:patterns-index` gates stay green.

5. [x] **109.5 — shape-not-domain, stated as a rule in the pattern recipe**
       (owner follow-up, 2026-08-22: "pattern should not [be] specific,
       like PO or Invoice... should it be in DEMO?" — answered yes,
       catalogue addendum). A pattern is NAMED and FRAMED for its shape;
       the domain appears only as realistic demo data (`object-page` +
       PO-88213 is the exemplar of doing it right). 18 of 20 pages already
       comply; `invoice-list` is 109.2's rename; no per-domain demo
       variants ever (re-photographing, 95.2). **Accept:** the rule is one
       sentence in CLAUDE.md's pattern recipe; the catalogue and the 104.1
       tile index copy state shape names; no page beyond 109.2's rename
       needs touching.

6. [x] **109.6 — RF becomes a TRACK, not a group member** (owner
       follow-up, same message: "app patterns... should be separate from
       RF scanner (old browser, limit screen, usage is different)" —
       agreed on all three axes, which map to things that already exist:
       the `rf-essentials` profile/floor (Chrome/WebView 108), the 360×640
       fixture, spacious density). `goods-receipt` moves out of group 3
       into its own "RF / rugged devices" track in the sidebar and tile
       index; its name STAYS (on the RF track the domain is the job — the
       scan flow is the shape). Desktop/tablet/mobile explicitly do NOT
       fork: responsive-by-construction is the standing bar, and 24
       screens × 3 device classes would be 72 pages of re-photographs
       (Objective §3). **Accept:** the track exists in sidebar + tile
       index with a one-line statement of the app track's
       device-adaptive-by-construction principle; future RF screens
       (picking, putaway, count) are named as front-door candidates, not
       queued.

7. [x] **109.7 — the RF pattern family: grill the owner's four candidates**
       (owner follow-up, 2026-08-22: "then should be full range of patterns
       for RF? metro UI or bento UI landing? list (display and editable)?
       form? dropdown (instead of dropdown, should popup full screen
       instead)?"). **Direction: a small RF family mapped to the RF
       worker's DAY, never a mirror of the app catalogue** — an RF device
       runs 3-6 tasks, not a suite. Per-candidate starting positions, each
       to be grilled against the rf-essentials floor (Chrome/WebView 108)
       and verified in the 360×640 fixture:
       - **RF landing (metro/bento task menu)** — the strongest candidate:
         every RF deployment has one; likely composes from
         `bo-widget-grid` + spacious density with glove-sized tiles.
       - **RF list (display)** — a pick-list / task queue ("what's next")
         is real; grill whether it composes from `bo-data-table` at
         spacious or needs its own single-column task-row shape.
       - **RF list (editable)** — expect REFUSE: RF editing is
         one-field-at-a-time scan flow (goods-receipt's own shape), not
         grid editing with gloves at 360px.
       - **RF form** — goods-receipt already demonstrates scan-first
         sequential entry; the question is whether a generic "scan task"
         shape is worth extracting or goods-receipt IS the documentation.
       - **Dropdown → full-screen picker** — the instinct (small dropdowns
         fail with gloves) is right, but the native-first answer must be
         measured before building anything: on Android WebView a native
         `<select>` already opens the OS's full-screen picker — the
         platform may give this for free, making the verdict a doctrine
         line ("RF uses native select") rather than a component.
       **Accept:** a grill report per candidate (99.4 front door: compose
       first, score, refusal expected for at least one), each verdict
       verified in the fixture at the RF floor, and whatever ships lands
       on the RF track with the recipe's full shape.

       **Done 2026-08-22.** Full report:
       `.roundtable/rf-pattern-family-grill-2026-08-22.md`. Two BUILDs, two
       REFUSEs, one doctrine line — the family stayed small on purpose.
       **RF landing** shipped (`/patterns/rf-landing`): `.bo-widget-grid` +
       `.bo-widget` at a raised `--bo-widget-min` for glove tiles, spacious
       density — `dashboard/dashboard` joined the `rf-essentials` profile
       (13 members now) for it; its one `@container` query needs Chrome
       105+, already under this profile's 108 floor, so `check:rf-floor`
       passed with no guard work. Icon glyphs were deliberately left out —
       ~10% of the whole framework's minified weight for tiles an RF worker
       already knows by name every shift; label + open-count badge is the
       whole affordance. **RF list (display)** shipped
       (`/patterns/rf-list`): `.bo-data-table` at spacious, 2 narrow
       columns — no profile change, since `goods-receipt-rf`'s own
       receiving log already proved this exact composition survives 360px
       (59.4); checked and closed one real risk, `data-table.css`'s
       auto-compaction `@container` (deliberately tighter than compact
       density) firing below 480px — it never triggers for a 2-column
       table, but a future 4+ column RF list needs that check redone.
       **RF list (editable)** REFUSED, in place on the page
       (`#editable-refused`) and in the report: RF correction is
       goods-receipt's one-field scan flow, not grid editing with gloves at
       360px — absorbing app-catalogue shape into the RF track is exactly
       what 109.6 drew the track to prevent. **RF form** REFUSED: goods-
       receipt already IS the documentation of scan-first sequential entry;
       a generic extraction today would be the same page with the nouns
       filed off, which 109.5's shape-not-domain rule and the Objective's
       less-for-more test both refuse — re-open when a second, materially
       different RF scan-entry screen exists to extract FROM. **Dropdown →
       full-screen** settled as doctrine, not a component: `.bo-select` is
       `appearance: none` on a real `<select>`, no JS reimplementation, so
       the platform already owns what happens on open — Android WebView's
       native picker is full-screen by default, long-standing OS behavior
       predating this profile's 108 floor. Stated as NOT re-verified inside
       an actual Android WebView this session (no device available) rather
       than claimed as measured. Verification snag worth naming: the first
       360×640 screenshot pass showed unstyled tiles — traced to this
       worktree's `node_modules` workaround resolving `@busy-office/ui`
       through the PARENT checkout's stale build, not this one's; fixed by
       re-pointing the self-link before trusting any further screenshot
       (same "confirm the served CSS" discipline CLAUDE.md already states
       for Podman, different cache). Both new pages verified live at
       360×640 in light and dark; sidebar entries added under "Patterns: RF
       / rugged devices"; standing gates green.

8. [x] **109.8 — catalogue v2 after external research: FIVE decisions for
       the owner** (2026-08-22, owner ask: "get new input and research what
       need for ERP. then we review"). Researched three independent
       taxonomies — SAP Fiori floorplans, Dynamics 365 F&O form patterns,
       Odoo view types — plus an ERP-operations sweep. Full report:
       `.roundtable/erp-pattern-catalogue-v2-2026-08-22.md`. The current
       catalogue maps 1:1 onto every core floorplan in all three systems
       (value-help = Dynamics Lookup, master-detail = Details Master, inbox
       = Fiori Worklist...). Deltas awaiting the owner's review:
       (a) **role-home upgraded to build-recommended** — Fiori Overview
       Page AND Dynamics Workspace both ship it first-class; sequenced
       after 101.4 since "my open items" wants the inbox to link into;
       (b) **job monitor / batch-run history** — lean build (the admin's
       daily screen nothing covers; notification says a run finished,
       nothing shows the queue);
       (c) **kanban board** — owner call (Odoo-only evidence, and it
       reopens the drag question 100.1 refused for lists);
       (d) **schedule screen** — compose-first grill (bo-calendar already
       ships as a component);
       (e) **period-close cockpit** — grill expecting "recomposes".
       Confirmed refusals with external backing: Analytical List Page
       (Fiori itself calls it a hybrid of two floorplans we have), Gantt
       (a library, not a CSS pattern — the virtualiser stance), Map
       (single-source niche), chatter (CRM; timeline covers the ERP need).
       **Accept:** the owner answers the five; approved items get numbered
       entries with the front-door gate; refusals recorded here.
       **ANSWERED 2026-08-22**: owner approved all five for grilling with
       three added criteria — simplicity, maintainability, easy for AI to
       understand. Grilled same wake:
       `.roundtable/grill-catalogue-v2-candidates-2026-08-22.md`. Verdicts:
       role-home BUILD (110.1, after inbox), job monitor BUILD (110.2),
       schedule BUILD low-priority (110.3), kanban REFUSED (single-source;
       without drag it collapses into list-report grouped by status;
       re-open condition recorded), close cockpit REFUSED (recomposes into
       inbox + record-detail + approval + progress; re-open condition on
       dependency semantics).

Still owner-blocked inside this catalogue: **role home / overview page**
(row 3) — open since 99.1: is `app-launch` your "landing page", or do you
want a role home with live content (my open items, KPIs)? The catalogue
reserves the row either way.

## Slice 108 — P0: object-page sticky bleed-through, z-index scale, tab-vs-anchor clarity (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 107 — Owner ask: button icon-only / text-only / icon+text (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 106 — P0: leaving the docs shell for the landing page silently failed (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 105 — Standardize sweep findings deferred with reason (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 104 — Owner wishlist: patterns section + tile index à la namethatui.com (2026-08-21)

Owner: *"should patterns be in separate section and arrange the tile like
https://namethatui.com/ ? pls review and propose."* Reviewed and proposed
same wake: `.roundtable/proposal-patterns-index-2026-08-21.md`. **Re-reviewed
from scratch same day at the owner's explicit request** (addendum in the
same file) — repo facts unchanged, plan confirmed (grouped tiles over
namethatui's flat platform-filtered grid, since our natural axis is
workflow stage, which the groups already encode; that grid exists there
because platform is orthogonal content, which we don't have). One new item
queued below (104.4).

**The review's finding: the "separate section" half is already true** (three
collapsible sidebar groups since 2026-08-16) — **what's missing is the
section's front door.** There is no `/patterns/` index; the homepage's
"Patterns" links deep-link to `/patterns/invoice-list` in 3 places. And the
tile ingredients already exist gate-guaranteed on every pattern page (opener
who-uses-it line, complexity badge, components-used list), while the
framework itself ships the tile (`bo-widget` grid — the app-launch pattern).

1. [x] **104.1 — DONE 2026-08-22.** Built `/patterns/index.astro`, `bo-widget`
       tiles in a `bo-widget-grid`, grouped under the **six current sidebar
       job-family headings** (the roadmap text's "three workflow headings"
       was written 2026-08-21, before Slice 109's same-day regroup to six —
       used the CURRENT groups, not the stale count). Each tile carries the
       pattern's title, a sentence-truncated cut of its opener's who-uses-it
       line, its complexity badge, and its Components-used badges, sorted
       complexity-ascending within each group.

       **Extraction, not authorship, and now shared with the sidebar.**
       `pattern-groups.mjs` is a new single source of truth for slug→label→
       group membership; `Gallery.astro`'s sidebar was refactored to import
       it (`...PATTERN_GROUPS`) instead of carrying its own inline copy, so
       sidebar and index cannot drift apart. `gen-patterns-index.mjs` (new,
       modelled on `gen-rf-profile.mjs`) reads each pattern page's own
       `demo-note` opener / `complexity N of 4` badge / Components-used
       list — the same three ingredients `check-page-shape.mjs` and
       `check-components-used.mjs` already gate — into
       `src/data/patterns-index.json`, which `index.astro` imports like any
       other generated artifact (api.json, rf-profile.json). Zero new CSS
       classes; sidebar's own rendering unchanged.

       **The gate, red-proved both directions.** `check-patterns-index.mjs`
       cross-checks disk files vs. `pattern-groups.mjs` vs. the BUILT
       `/patterns/` page's actual rendered tiles (via `distPages`/
       `demoRegion`, the same chokepoint `check-components-used.mjs` uses —
       not a bespoke walker). Removing a group entry was caught two ways at
       once (`patterns/login.astro exists but pattern-groups.mjs does not
       list it` + a stale rendered tile with no source entry); adding a
       phantom entry with no matching file was caught earlier still —
       `gen-patterns-index.mjs` itself throws loudly rather than silently
       generating a dead link.

       **Homepage's front door fixed**, not just re-linked: the nav link and
       the landing-page "Patterns →" widget both now point at `/patterns/`
       instead of deep-linking to `list-report` as a stand-in; the widget's
       body copy — stale since Slice 109's regroup (`"Capture & edit ·
       Review & approve · Overview & shell — 12 full screens"`, the
       2026-08-16 grouping and a wrong count) — now reads the live group
       labels and `patternsIndex.count` (27), so it cannot go stale again.
       The one other `/patterns/list-report` link (the "invoice pattern"
       print example) is a specific-pattern citation, not a section link —
       left as-is, correctly.

       **Two small chokepoint exemptions added**, both with a stated reason:
       `check-page-shape.mjs`'s `PATTERN_SECTIONS_EXEMPT` and
       `check-wrong-choice.mjs`'s filter both skip `index.astro` — it is the
       section's front door, not a screen with its own Anatomy/Data
       contract/States or a "wrong choice vs. what" question to answer.

       Verified live (fresh nginx bind-mount of `dist`, not the stale
       `bo-docs-run` container per `.roundtable/RESUME.md`'s standing
       gotcha): 1440px and 390px, light and dark — 27 tiles render (6
       `bo-widget-grid`s × per-group counts, confirmed against
       `class="bo-widget"` count in the built HTML), 390px stacks to one
       column with no overflow, homepage tile shows the live count. Full
       docs build (all 28 chained gates incl. the new
       `check:patterns-index`), core build, stylelint (no new CSS to lint),
       111 vitest behavior tests — all green.

3. [x] **104.3 — DONE 2026-08-22.** Full report:
       `.roundtable/complexity-scale-2026-08-22.md`.

       **(a) Definition, anchored on concurrency, not size.** The scale
       measures how many independently-live loci of state the screen must
       track at once — level 1 (none, e.g. `record-detail`), level 2
       (exactly one, e.g. `detail-form`'s single whole-record dirty flag),
       level 3 (either a cross-visit workflow state gated by another actor,
       a one-shot batch of N terminal outcomes, or N sub-units *within one
       record* independently live — `field-editor`'s own States table:
       *"aria-busy on that row only; every other row stays editable"*), and
       level 4 (N independently-live units *across records*, continuously,
       uniquely `editable-grid`). Deliberately does NOT use "has a
       permission-gated state" as the discriminator — CLAUDE.md's pattern
       recipe requires that row on every page, so it reads uniformly by
       construction (the exact failure mode 94.7/101.3 warn about).

       **(b) 27 badges re-read** (grown from the 20 counted 2026-08-21 as
       Slices 108-111 queued and landed new patterns — comprehensiveness,
       not re-litigated per this item's own text). **Three corrections**:
       `value-help` 3→2 and `detail-form` 3→2 (single locus, no
       concurrency, no cross-visit workflow — the anti-correlation the
       roadmap flagged for `master-detail`/`field-editor` turned out to
       cut the other way for these two); `field-editor` 2→3 (its States
       table proves genuine per-field concurrency, previously
       under-scored). New distribution `{1:4, 2:14, 3:8, 4:1}`. Incidental
       fix: both corrected pages carried a stale `"— capture & edit tier"`
       suffix from the pre-Slice-109 three-tier taxonomy, naming a group
       neither page is actually in — removed on both; two more pages
       (`list-report`, `object-page`) carry a similar but not provably
       stale suffix, noted for a future Standardize prose sweep, not fixed
       here.

       **(c) Per-group ladder audit**, current six job families
       (`pattern-groups.mjs`): confirmed the roadmap's own provisional
       reading (*enter & correct data* spans 2–4, no rung-1) and found two
       more real gaps the provisional note (written pre-109-regroup)
       didn't cover — *decide & clear queues* has no rung-1 or rung-4, and
       *monitor & output* is flat at rung-2 across all six pages. **Every
       gap resolved to a principled refusal through the 99.4 front door**:
       rung-1 gaps refused because level 1 (no committed state) inherently
       contradicts a group whose job is entering data or making a
       decision; the *decide* group's missing rung-4 refused as
       `editable-grid`'s job already, cross-linked from `bulk-actions`
       (reusability, Objective §3); *monitor & output*'s flat rung refused
       as the group's whole job being inherently single-locus, not a gap.
       RF (one page) deferred to the already-queued 109.7. **No new items
       queued** — every finding closed as a refusal, an explicitly valid
       outcome per this item's own Accept text.

       Verified in the BUILT output: `patterns-index` gate re-passed with
       the corrected badges (`field-editor` moved up a rung, the other two
       down), confirming source/config/output agree. Full docs build, core
       build, stylelint, 111 vitest tests, `check:claims` (88 behaviors) —
       all green.

2. [x] **104.2 — DONE 2026-08-23. Owner picked (c-scoped): live
       miniatures where they read, text where they don't.** Built:
       `PatternPreview.astro` — 10 patterns (login, app-launch, wizard,
       schedule, kanban, approval, notification, error-pages,
       reporting-dashboard, comparison) get a small REAL composition of
       the shipped CSS, rendered `inert` + aria-hidden inside the tile
       (verified live: 10 previews, all inert, zero tabbables inside);
       the 25 dense patterns stay text-only on purpose and the index's
       opener says why. Zero images, zero drift surface: check-markup
       validates every preview class against the built CSS like any
       other markup. Fragment rules written into the component (no ids,
       no popovers, documented data-* values only). The layout sweep
       caught a REAL 1.4.12 interaction on the first build — spacing
       overrides grow the previews past their crop — resolved in the
       GATE on principle, not per-tile: 1.4.12 protects content, and an
       inert+aria-hidden subtree is decoration by declaration, so the
       sweep now skips such subtrees; red-proved both ways (visible
       clipped content still fails; only the decorated case passes).
       Screenshots light+dark. Evidence trail: *(entry as decided
       follows)* **OWNER CALL, now with evidence** (Research round 2, 2026-08-23:
       `.roundtable/research-pattern-tile-previews-2026-08-23.md`). The
       original fork was text-vs-screenshots; the research adds the shape
       the item had not considered and the owner's own reference actually
       uses: **namethatui's tiles are LIVE INLINE MINIATURES** — real
       rendered pattern markup at small scale — not images. Survey:
       Tailwind Plus / shadcn / Mobbin ship screenshots; Carbon and
       Fiori's indexes are text-only; the split is by genre, and this
       tile index is in the visual genre. Hand-drawn stays refused (the
       one shape that is hand-written, unchanged). The options are now:
       (a) keep text tiles; (b) build-time screenshots via the proven
       shadcn capture-script shape (generated, but needs a staleness
       gate); (c) live miniatures — zero drift by construction, existing
       gates apply, costs index paint + needs inert scaled previews; or
       (c-scoped) miniatures only for the ~10 patterns that read at tile
       size, text for the rest — namethatui itself only previews what
       compresses legibly. **Accept:** the owner picks and the choice is
       recorded here with its reason.

4. [x] **104.4 — REFUSED 2026-08-22.** Unblocked by 104.3 (badges now
       anchored to an observable definition), but refused on the merits
       rather than built by default. `pattern-groups.mjs`'s six job-family
       groups top out at 7 tiles (enter & find) and run as low as 1 (RF) —
       every group is already small enough to scan without filtering.
       The proposal doc itself (`.roundtable/proposal-patterns-index-2026-08-21.md`,
       point 1 of the addendum) makes the case against this directly:
       namethatui's filter chips exist *because* its grid is flat with no
       organizing axis; our workflow-stage groups already ARE that axis,
       so a complexity filter on top would duplicate work the grouping
       already does, not add a use-case grouping doesn't cover — the
       Objective's less-for-more test ("every new option must open more
       use-cases than the one that asked for it") fails here. 104.1 also
       shipped this same session, so there is zero usage evidence a filter
       is missed, and the item's own Accept text names exactly this as
       sufficient grounds to refuse. Revisit if the pattern count grows
       past a size where a 6-7-tile group stops being scannable, or if
       real usage shows readers hunting for a way to narrow the index.
       No code changed; `bo-segmented`'s composability for this was
       confirmed but not exercised.

       *Original text, retained for context:*
       Re-review finding (2026-08-21): namethatui's Newest/Popular/
       Surprise-me sort has a cheap, real analogue — `bo-segmented`
       (already shipped; native radios; zero new CSS) could drive an
       All/Simple/Medium/Advanced filter over the tiles. **Explicitly NOT
       buildable before 104.3**: filtering by a complexity number that is
       currently undefined and anti-correlated with real signal (104.3's own
       finding) would launder that defect straight into the UI. **Accept:**
       only after 104.3's re-read badges land — a `bo-segmented` filter,
       live JS (unlike 104.1-104.3, which are static generation), with its
       own test coverage; refusing to add live filtering at all (static
       grouping is enough) is a valid outcome if 104.1's usage doesn't show
       anyone needing it.

Not queued, deliberately: a separate top-level Patterns nav (20 items don't
justify the IA surgery; the groups + front door give the separation), a
components tile index (mechanism generalizes; ask was patterns), and new
search (⌘K/pagefind already answers "describe the thing").

**Standing gate on this slice (owner, 2026-08-21, restating 99.4): any
component a 104.x item finds missing goes through the front door — grill the
need first (Objective §1/§2: could existing primitives compose it?), then
score it on the six DSA dimensions with cited evidence, then document it with
the wrong-choice clause. Refusing is an expected outcome. One rule, stated at
99.4; this line binds it here rather than restating it.** The precedent to
copy is 99.3's command-bar verdict: the "missing" component turned out to be
`bo-dialog` + `bo-combobox` + `bo-kbd` composed, and the pattern shipped with
zero new CSS.

## Slice 99 — Owner direction: patterns as an ERP expert would actually build them (2026-08-21)

Owner: *"revamp the pattern to build the realistic pattern by screen (where
design by 30 years experience of ERP expert)"* — naming login, landing page,
command bar, object page (detail), inbox, notification, report, output form,
dashboard. Plus a standing instruction that governs the whole slice: **if a
missing component is found, add it — but grill the need FIRST and score it
the same way.**

**The nine mapped against the 19 patterns that exist**, measured before
planning anything:

| Asked for | Today |
|---|---|
| login | **exists** — `/patterns/login` |
| dashboard | **exists** — `/patterns/reporting-dashboard` |
| object page (detail) | exists **four times over** — `object-page`, `record-detail`, `detail-form`, `master-detail` |
| landing page | *partly* — `app-launch` is a launchpad; whether that is the landing page is the owner's call |
| command bar | **missing as a pattern** |
| inbox | **missing** (`approval` is a review screen, not a worklist) |
| notification | **missing** (alerts/toasts are components; the screen-level story is not documented) |
| report | **missing as distinct from a dashboard** |
| output form | **missing** — the printed/PDF document an ERP emits |

**Two findings the mapping produced that the ask did not mention, and both
matter more than the count.**

**(a) The command bar exists — we built it for ourselves and never shipped
the recipe.** `cmdk` appears in exactly one file, `apps/docs/src/layouts/
Gallery.astro`, and in **zero** files under `packages/core`. The docs site
has had a working command palette this whole time, classed as "docs-site
chrome, never shipped to consumers" in `check-data-hooks`'s exception list.
An ERP expert would call the command bar one of the highest-leverage screens
in the product, and we are dogfooding one while documenting none.

**(b) The owner asked for "object page (detail)" — singular — and we have
four.** `object-page`, `record-detail`, `detail-form` and `master-detail` all
open by describing someone who owns one record. That is exactly the shape
Objective §1 and §2 exist to challenge: is this one screen with settings, or
four screens? It is *not* automatically drift — `master-detail` is genuinely a
list-plus-panel and `detail-form` is genuinely entry — but nobody has asked
the question, and the owner's phrasing is the prompt to ask it.

1. [x] **99.1 — the gap analysis becomes a decision, screen by screen.**
       **DONE 2026-08-21.** Verdicts for all nine are in the shared report.
       Four are already covered (login, dashboard, object page — pending
       99.2 — and landing page as `app-launch`, with one open question for
       the owner below). Five become build items: the command bar is 99.3,
       and inbox / notification / report / output form are 101.4-101.7.

       **One question genuinely for the owner:** "landing page" is read here
       as `app-launch`, the post-sign-in launchpad. If what is meant is a
       ROLE HOME — live content, my open items, my KPIs, not a launcher —
       that is a different screen and becomes a sixth build. Recorded rather
       than assumed.
       Before building anything: for each of the nine, decide **build /
       already-covered / rename-and-extend**, with the ERP job it serves named
       in one line ("who opens this, how often, what done looks like" — the
       pattern recipe's own opener requirement). **Accept:** a table in
       `.roundtable/` with a verdict per screen and its reason; every "build"
       becomes its own numbered item carrying the pattern-page recipe's six
       required parts. No screen gets built before its row exists.

2. [x] **99.2 — settle the four detail patterns before adding a fifth.**
       **Verdict: keep all four, measured.** Component sets barely overlap —
       `object-page` (amount, badge, button, dashboard, kv, pagination),
       `record-detail` (approval-workflow, byline, dashboard, kv),
       `detail-form` (calendar, form), `master-detail` (badge, dashboard,
       data-table, dialog, kv, offcanvas). Four compositions, four jobs:
       long read / short read / entry / list-plus-panel. Nothing to merge.
       The real defect was **one-way** cross-referencing: `object-page`'s
       opener already named `record-detail`, and no opener named it back.
       All four now carry a `<strong>Not …</strong>` clause naming a sibling.
       Generalised: **0 of 19 pattern pages** carried the clause versus 14 of
       40 component pages — one convention applied to half the surface — so
       `check:wrong-choice` now scans `pages/patterns/` too, with its own
       shrinking `PATTERN_TODO` (15 left). Red-proved both ways: a pattern off
       the list without a clause, and a clause-carrying pattern still listed.
       2026-08-21.
       Adding `inbox` and `object page` on top of four overlapping detail
       screens would make the set harder to navigate, not easier. **Accept:**
       a verdict — keep four with each one's distinct job stated in its
       opener so a reader can choose, or merge. Measured, not argued: for each
       pair, what markup and which components actually differ? Merging is a
       valid outcome; so is keeping all four **if** each opener names the
       other three and says when to use them instead (the `content` rule,
       applied to patterns).

3. [x] **99.3 — DONE. The command bar: document what we already run.**
       **Promotion question answered 2026-08-21: refuse, on all three counts.**
       Full report: `.roundtable/grill-command-bar-2026-08-21.md`. No
       `bo-command-bar`, no promotion of the docs implementation, and no
       `bo-dialog--palette` modifier. A command bar is `bo-dialog` +
       `bo-combobox` + `bo-kbd`; all three already ship.

       The deciding measurement is not size, it is **shape**. Live, in one
       session on one page: the shipped `bo-combobox` holds the full contract
       (`role=combobox`, `aria-expanded`, `aria-controls`, `aria-autocomplete`,
       `aria-activedescendant` moved by ArrowDown, `aria-selected` on the
       option, 15 `role=option`); the docs palette, with 5 real results on
       screen, has **none of them and no live region** — a screen-reader user
       types and nothing announces that results appeared. Promoting it would
       ship a second, worse answer to a question the framework already answers
       correctly (Objective §1).

       CSS measured: of `.docs-cmdk`'s 10 declarations, **7 already exist in
       `.bo-dialog`**, 6 more are `--pagefind-ui-*` mappings that cannot
       generalise, and the 3 that remain are top-anchoring — used by **exactly
       one** dialog in the tree, so the modifier fails Objective §3 too.

       Remaining work split out below.

3a. [x] **99.3a — document `/patterns/command-bar` as a composition.**
       Done 2026-08-21. Full pattern recipe, gated shape, wrong-choice clause
       (patterns now 5 carrying). Two runtime claims added to `check:claims`
       and both red-proved.

       **The page found a real composition constraint by being rendered.**
       `bo-combobox`'s listbox is a `[popover]` in the top layer, so the hint
       strip placed below the input was painted over the moment results
       appeared — measured, footer y 122-175 against listbox 126-284, hidden
       exactly when its contents become useful. The markup looked correct;
       only geometry showed it. Hints moved above the input, in both the demo
       and the copyable sample, and the constraint is now a section of the
       page rather than a silent trap.

       Removing `popover` is NOT the workaround and the page says so with the
       measurement: stripped, the list still renders while `aria-expanded`
       stays `false`, no `aria-activedescendant` is set and nothing is
       `aria-selected` — the contract goes silent while the screen still looks
       right. That is also why the second claim exists.
       **Accept:** the pattern recipe in full (opener with who/how often/done
       + the wrong-choice clause; live screen; anatomy; data contract for the
       result sources; states incl. empty query, no matches, slow/async;
       components-used badges + complexity). The markup shows the ⌘K binding
       as consumer code, not a behaviour, and states the rule the grill
       surfaced: **if the result source cannot load, remove the trigger** — a
       command bar that opens onto nothing is worse than none.

3b. [x] **99.3b — docs debt, low priority: rebuild the docs palette on
       `bo-combobox` + `bo-dialog`, or record why PagefindUI's owned DOM makes
       it impractical.** **Done 2026-08-21 for the `bo-dialog` half; the
       `bo-combobox` half stays refused, on 99.3's own finding.** PagefindUI
       owns `#cmdk-search`'s DOM (renders its own input, listbox, result
       links) and 99.3 already measured that surface has none of
       `bo-combobox`'s ARIA contract — reaching in to relabel PagefindUI's
       markup as a combobox would be decorating a widget the framework
       doesn't control, not composing one. That finding stands; not
       re-litigated.

       What was buildable: the dialog *chrome* is ours, and the element now
       carries `bo-dialog bo-dialog--wide` alongside `docs-cmdk`, dropping 7
       duplicated declarations (padding/border-radius/background/color/
       box-shadow/border) in favor of the shared component — which also
       fixed two real drifts, not just DRY: the shadow was the lighter
       `--bo-shadow-lg` (toast's token) instead of `--bo-shadow-dialog`, and
       there was **no forced-colors border at all** (verified via CDP
       `Emulation.setEmulatedMedia`: the palette now gets a real 1px
       `ButtonText` edge under Windows High Contrast, where before it had
       none). `--wide` is load-bearing, not decorative — without it
       `bo-dialog`'s default 32rem `max-inline-size` would have clamped the
       palette's local 40rem width.

       The scrim fix landed as a deletion: `.docs-cmdk::backdrop`'s hardcoded
       `rgb(0 0 0 / 0.45)` is gone, and because this file is deliberately
       unlayered (it demos the override rule to readers), removing the
       override — not just changing its value — was required for
       `.bo-dialog::backdrop`'s `--bo-color-scrim` (0.4) to actually take
       effect; verified computed `background-color` live, not assumed from
       the source. Local, kept: the top-anchored position (99.3 measured
       this pattern at exactly one caller, so per Objective §3 it's page CSS
       not a new modifier), the 40rem search width, and the `--pagefind-ui-*`
       token mapping (can't generalise into the framework).

       Verified live: light + dark (real search query, 44 results,
       highlighting correct), Esc closes, 390px (width computes to exactly
       `min(40rem, 100vw - 2rem)` = 358px, no horizontal overflow), forced-
       colors border confirmed via CDP emulation, plain + DOCS_BASE builds
       green.

0. [x] **99.3 (original wording, superseded by the split above)** Start from
       `Gallery.astro`'s implementation rather than a blank page, because a
       working one has been in daily use. **Accept:** the pattern page names
       who uses it and when (power users, keyboard-first, jumping across
       modules); the data contract for its result sources; states incl. empty
       query, no matches, and slow/async results; and — the part that decides
       whether this ships as a component — a grilled answer to whether the
       docs implementation should be **promoted into `packages/core`** or stay
       docs chrome. Promotion requires the same scoring every component gets.

4. **99.4 — STANDING RULE for this slice, not a work item** (un-boxed
       2026-08-24: a checkbox that can never be ticked kept the dispatcher's
       "oldest open item" pointed at a policy). Missing components discovered
       along the way go through the front door. The owner's own instruction, recorded as a gate on this
       slice: grill the need first (Objective §1/§2 — could existing
       primitives compose it?), then score it on the six DSA dimensions with
       cited evidence, then document it with the wrong-choice clause
       `check:wrong-choice` now requires. **Refusing a component is an
       expected outcome**, not a failure of the slice.

## Slice 103 — Standardize: the dist-walking chokepoint regrew (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 102 — owner wishlist: three grills (2026-08-21)

Triaged mid-wake from the owner. All three are **reviews of surface that
already ships**, not requests for new surface, so the Objective test is
about depth rather than accept/refuse: none of them can fail §2 by adding
a caveat list, and each is only worth doing if it produces a verdict a
reader could act on. Ranked below in the order the owner listed them.

The standing rule from 99.4 applies to all three: if a grill concludes
something is missing, the *need* is grilled before any code, then scored,
then documented — and refusing is an expected outcome.

1. [x] **102.1 — grill rich text: simple to advanced.**
       Done 2026-08-21. Report:
       `.roundtable/grill-richtext-ladder-2026-08-21.md`.
       **Verdict: the ladder already exists, five rungs, no new component** —
       rung 0 `textarea.bo-input` (one class, already styled), 1 `.bo-prose`,
       2 `.bo-richtext--readonly`, 3 `.bo-richtext` + native `execCommand`
       (zero framework JS), 4 a real engine in the same chrome.

       Rung 3 verified live rather than read: Bold on a selection produced
       `<p><b>hello</b> world</p>` with `aria-pressed` moving false -> true.
       The browser returned `<b>` and not `<strong>`, which reproduces the
       page's own engine-variance caveat on the first try.

       **The defect was navigational and the project already knew.** `richtext`
       sat in `check:wrong-choice`'s TODO and scored `content: 2` with an
       improve entry naming exactly this. Writing the clause moved all four
       records at once — opener, ratchet (23 -> 22 outstanding), score
       (2 -> 3), improve cleared — which is the 94.12 interlock working.

       NOT queued as a fix, deliberately: `.bo-prose` renders on two built
       pages, both component docs, and zero of 20 pattern screens. It ships
       for consumers, so docs usage is not its measure and building a screen
       to exercise it would be building for the metric. Recorded instead as a
       fact to use when 101.4-101.6 land — any of those is its natural first
       real consumer.

       *Original Accept, retained for the record:* The component
       documents one editor. The owner's framing ("simple to advance")
       asks the question the page does not: what is the LADDER — a
       read-only rendered block, a lightly-formatted note field, a full
       editor with a toolbar — and which rung does an ERP screen actually
       need where? **Accept:** a report in `.roundtable/` naming each rung,
       what markup it costs, and which existing screens sit on which rung;
       a verdict on whether the framework's single `richtext` covers the
       ladder or hides a gap; and — the part that decides whether anything
       ships — whether any missing rung composes from existing primitives.
       A verdict of "one component covers all three rungs, here is the
       proof" is a valid and preferred outcome.

2. [x] **102.2 — DONE 2026-08-22.** `/design-grill` on `/patterns/object-page`,
       comprehensive. Report: `.roundtable/grill-object-page-2026-08-22.md`.
       Scored all six DSA dimensions (`fit` not scored — the rubric's
       definition is field-matrix-specific and doesn't extend to a
       whole-screen pattern): typography/colour/spacing/interaction/content
       all cite real evidence and score 3, not forced — the intrinsic `7rem`
       scroll-margin literal carries its own regression-history comment,
       which is exactly what the `spacing` definition asks for.

       **Re-verified the whole screen live against the CURRENT build**
       (the only prior grill, 2026-08-20, predates the 108 sticky P0 fix and
       109 sidebar regroup) and found one real, small, reproducible defect
       the existing `check-claims.mjs` probe cannot see: at 390px only,
       landing on a section via the anchor bar leaves its own
       `.bo-widget__title` **2.25px under the sticky chrome** — the collapsed
       sticky wrapper is 18.375px taller at 390 than at 1440 (header title +
       badge wrap to two lines), but `scroll-margin-block-start` is one fixed
       value tuned for 1440. Same defect class the page's own comments
       already document fixing twice (48.3: 110px; 108.1: 26px), a third,
       much smaller occurrence — invisible in an actual screenshot, unlike
       the first two. **Not rushed**: both prior fixes needed real live
       debugging, not a guessed constant, so this is queued as **102.8**
       rather than patched under time pressure. Print behavior and the
       states table (6 rows, matches the pattern recipe) re-verified
       unchanged. All gates green (core build, docs build incl. all chained
       gates, stylelint, `check:claims`) on the exact build measured.

3. [x] **102.3 — DONE 2026-08-22.** `/design-grill` on `/patterns/editable-
       grid`, comprehensive. Report: `.roundtable/grill-editable-grid-
       2026-08-22.md`. All applicable DSA dimensions score 3; `content` was
       2 (page sat on `check:wrong-choice`'s `PATTERN_TODO`) — fixed this
       grill with a wrong-choice clause and removed from `PATTERN_TODO`
       (ratchet 14 → 13). In-cell validation shift: measured live and found
       the framework never sets `aria-invalid` client-side (server/app-
       rendered, by design per the Data contract), so 97.2's already-
       measured message shift remains the real case; found a DIFFERENT,
       previously unmeasured shift instead — going dirty widens the row-
       actions cell, which can compress a neighboring tight column enough to
       wrap it and grow the whole row (+26px), reproduced only on the
       Advanced demo's specific column mix, not on Medium/WYSIWYG/Composite.
       Queued as **102.9** rather than patched blindly. Keyboard traversal
       (Item→Qty→Price→Save→Cancel→Remove, no `data-grid-nav`) and partial
       save (per-row independent, verified against `row-edit.ts` source)
       both confirmed to already match the page's own claims — no gap.
       No-JS degradation was genuinely undocumented (verified live with JS
       disabled: fields stay editable, Save never appears since
       `initRowEdit()` never runs) — added a States-table row stating it.
       Also fixed, found while checking Related links: 4 pages
       (`editable-grid`, `record-detail`, `filter-panel`,
       `reporting-dashboard`) still labelled the Slice-109-renamed
       `list-report` pattern "Invoice list" — relabelled all four to "List
       report". Verified live: 1440/390px, wrong-choice/page-shape/dsa-
       scores gates green, `check:claims` (86 behaviours) green, stylelint
       green, all 111 vitest behavior tests green.

3a. [x] **102.7 — DONE 2026-08-22.** Data input / Forms family, blind-spot
       audit (not a re-score). Report:
       `.roundtable/grill-forms-family-2026-08-22.md`. Measured all five
       candidates live against the current build: tab order through a real
       row (Vendor→Amount→Cost center→Status) matches DOM/visual order
       exactly — keep; the server-round-trip "values kept" claim on
       `/patterns/validation-summary` lives in an unexecuted `<pre>` code
       comment describing the CONSUMER's server behaviour, same boundary
       class as the output-form/report contract docs — accept-with-reason;
       required-vs-optional marking had a **real defect**: `form.astro`'s
       `--required` demo (`#req-class`) rendered the visual asterisk with
       **zero** programmatic signal, contradicting `form-field.css`'s own
       comment that requiredness must ALSO be on the control
       (`required`/`aria-required`) — **fixed**, added
       `aria-required="true"` + a clarified hint, re-verified live
       post-rebuild, only usage site in the repo; non-English locale
       entry/display is already a stated, deliberate boundary
       (`Intl.NumberFormat` at render time, the framework's own words) —
       accept-with-reason; a genuinely long form (`/patterns/detail-form`,
       6 fields across 3 sections) has zero horizontal overflow and a flat
       4px label-to-control gap at 390px, live-measured — keep.

       **Result for 101.3's stop rule: zero of five caught by the six DSA
       dimensions, by construction** — every real question here (DOM tab
       order, an unexecuted cross-file claim, a demo contradicting its own
       CSS comment, an i18n scope boundary, live layout math) needed the
       page rendered and driven; none is a property of source text the
       rubric can read.

       **Correction to this item's own premise, found while starting**:
       "scored these six 95-100%" doesn't hold today — the Data input group
       grew 6→8 pages since Slice 94, and `combobox`/`money`/`quantity`
       still carry `content: 2` (94.4%) each, cited as missing the
       wrong-choice clause and sitting on `check:wrong-choice`'s TODO. Not
       fixed here (scope creep on this item); queued as **102.10**.

       *Original Accept, retained for the record:* a report in `.roundtable/`
       that names, for each weakness, whether the DSA rubric could ever have
       caught it — because a pattern of "no" is itself a finding about the
       rubric, and feeds 101.3's stop rule. Verdict per weakness: fix /
       accept-with-reason / refuse, fixes queued individually. "The family
       is genuinely sound and here is what the score missed anyway" is a
       valid outcome.

3b. [x] **102.8 — DONE 2026-08-22.** object-page: fix the 390px anchor-landing gap. From the
       102.2 grill (`.roundtable/grill-object-page-2026-08-22.md`): at 390px
       only, jumping to a section leaves its own `.bo-widget__title` 2.25px
       under the sticky chrome, because the collapsed sticky wrapper is
       18.375px taller at 390 than at 1440 (the object header's title +
       badge wrap to two lines) while `scroll-margin-block-start` is one
       fixed `7rem` value tuned for the 1440 height. Same defect class as
       48.3 and 108.1, both of which needed real debugging rather than a
       guessed constant — do the same here rather than hand-tuning a magic
       number. **Accept:** the gap (`sectionTop - stickyBottom`, or the more
       precise title-vs-sticky-bottom measure the grill used) is
       non-negative at 390px for every section, re-verified it did not
       regress the already-passing 1440 case or the existing
       `check-claims.mjs` `object-page @${w}: the anchor bar follows the
       reader` probes; and that probe itself gains an assertion on the
       landed section's own content clearing the sticky chrome (not just
       `aria-current` moving), since that coverage hole is what let this
       occurrence go unnoticed. Verified live, both themes, both widths.

       **Root cause, measured, not guessed:** the collapsed-equivalent header
       height is genuinely different per width (87px at 1440, 105px at 390 —
       confirmed by subtracting the collapse target's own rendered height from
       the sticky wrapper's, which gives the same number whether the header is
       currently open or already closed), so no single `rem` constant could
       ever cover both. **Fix:** `anchor-nav.ts` now measures that height live
       (`syncLandingOffset`, called from the existing `syncAll` on init/scroll/
       resize) and writes it to `--bo-anchor-landing-offset` on
       `document.documentElement` — same shape as `sticky-cols.ts`'s
       `--bo-sticky-w-1`. `object-page.astro`'s `.op-section` now reads
       `scroll-margin-block-start: calc(var(--bo-anchor-landing-offset, 7rem)
       + var(--bo-space-2))`, with the `7rem` fallback keeping the no-JS case
       working and `--bo-space-2` a small rounding buffer. Verified live, all
       4 sections × both widths × both themes: gap went from `{-2.25 at 390,
       15.75 at 1440}` (inconsistent, one broken) to a consistent `~20-23px`
       clearance everywhere, no overshoot. The strengthened `check-claims.mjs`
       probe (`landingGap >= 0`) was **red-proved**: reverting the fix and
       re-running it fails exactly at 390px, confirming the assertion can
       actually catch this defect class rather than passing by construction.

3c. [x] **102.9 — DONE 2026-08-22.** editable-grid: going dirty can reflow a neighboring
       column. From the 102.3 grill
       (`.roundtable/grill-editable-grid-2026-08-22.md`): revealing a row's
       Save/Cancel/Unsaved (the row-actions cell, normally `hidden`) widens
       that cell from 32px to 227px; in a table with enough columns that
       this eats into a neighboring column's slack, the reallocation can
       wrap that column's content onto a second line and grow the whole
       row. Measured live on this page's own Advanced demo: `Cost centers`
       (tag-input) compresses from 252px to 211px, wraps its "Add..."
       field, row grows from 54px to 80px (+26px). Confirmed demo-specific,
       not a `.bo-data-table`/`.bo-data-table__row-edit-actions` contract
       bug: the Medium, WYSIWYG, and Composite demos on the same page show
       zero height change on the same interaction -- only the Advanced
       demo's particular column mix has no slack left. Not patched here
       deliberately: reserving the actions cell's expanded width
       unconditionally would cost every clean row, on every table using
       this behavior, permanent extra width to fix one narrow demo's
       layout -- the wrong trade without checking what it costs elsewhere
       first. **Accept:** a decision recorded on which of (a) reserve
       min-inline-size on `.bo-data-table__row-edit-actions` so revealing
       never changes the cell's layout footprint, measuring the cost on at
       least 3 existing tables using `data-row-edit`, or (b) treat this as
       demo-authoring debt and just widen/adjust the Advanced demo's own
       columns so it doesn't reproduce -- is correct; whichever is chosen,
       verified live (1440 + 390, both themes) that the fix doesn't
       reintroduce the wrap somewhere else, and if a runtime claim is added
       to the page it gets a `check-claims.mjs` case per CLAUDE.md.

       **Decision: (b), demo-authoring debt — and (a) was tried first and
       measured to be the wrong trade, not just assumed to be.** Implementing
       (a) (`min-inline-size: 12rem` on `.bo-data-table__row-edit-actions`,
       sized to the measured 189.4px min-content of the always-present
       badge+Save+Cancel cluster) was built and rebuilt into a live docs
       image to check its real cost — and it made things **worse**, not just
       costly: the Advanced table's Cost centers column and the Medium
       table's Qty column both started wrapping **permanently, in the clean
       state**, not only while a row was dirty. Reserving width unconditionally
       doesn't remove the layout pressure, it just makes it constant instead
       of conditional. Reverted.

       **(b) implemented instead**, scoped to the one demo the grill actually
       found broken: `editable-grid.astro`'s Advanced table's `Cost centers`
       header gained `style="min-inline-size: 15rem"` (240px, just above the
       211px it was compressed to when it wrapped) — a demo-authoring choice,
       not a framework change; `.bo-data-table__row-edit-actions` is
       untouched. Verified live, rebuilt fresh into a bind-mounted nginx
       image: Advanced's row height stays exactly `54px`/`44.5px` (1440/390)
       clean AND dirty, in both themes — the wrap is gone with no other
       column affected (Line/Qty/Status/Needed by/Rush all measured
       unchanged before vs. after).

       **Two pre-existing, unrelated height deltas found during
       verification, deliberately not fixed here:** Medium's row at 390px
       grows +36px when dirty, but only because the Qty cell's existing
       `bo-form-field__message` ("Exceeds on-hand (200)") wraps across more
       lines as its cell narrows — normal validation-message reflow, not the
       tag-input-class defect this item is about, and present before this
       fix too. `inline-editing`'s `Multi-row inline edit` demo grows +11px
       at 390px (a plain "Widget A" text cell wrapping in its intentionally
       narrow 28rem-capped illustration table) — same shape, same pre-
       existing, out of scope. Neither reproduces the "framework contract
       bug" class 102.9 exists to rule out; noted here rather than silently
       ignored.

       No runtime claim added — this is a static layout fix to one demo's
       column width, nothing dynamic worth a `check-claims.mjs` case.

3d. [x] **102.10 — DONE 2026-08-22.** `combobox`, `money`, and `quantity` each
       gained one sentence in the opener naming a wrong context and a real
       alternative: combobox → a short fixed list (five or fewer options),
       use a plain select; money → a fixed-currency value (a rate, a fee, a
       percentage), `.bo-input--numeric` is the whole answer; quantity → a
       number that isn't a count (a percentage, an index), same
       `.bo-input--numeric` answer. All three added to the FIRST `demo-note`
       paragraph specifically — `wrong-choice-rule.mjs`'s `opener()` only
       reads the first `<p class="demo-note">`, and all three pages already
       carried a *second* demo-note paragraph ("The rule for this family…")
       that would have silently not counted.

       Verified in the BUILT output, not source: all three clauses render
       (`grep`'d `dist/`), `check:wrong-choice` (99 assertions, TODO 22→19),
       `check:dsa-scores` (its own `content`-agrees-with-`check:wrong-choice`
       cross-check, 94.12's interlock) and `check:links` all pass. Rescored
       `content: 2→3` for all three directly in `dsa-scores.json` (hand-
       maintained, not regenerated) and dropped their now-satisfied `improve`
       entries, matching 94.8's shape.

       Incidental fix, small enough to land inline: `quantity.astro`'s
       opener linked `/components/amount` for "see … for money", which
       pointed at the read-only display component instead of the actual
       entry counterpart; corrected to link `/components/money`.

3e. [x] **102.11 — DONE 2026-08-22.** The list grew past the original 6 by
       the time this ran — 102.8, 102.9 (demo-only, no core change), and
       94.3/96.2's own follow-ups had landed too — so this covered every
       undocumented `packages/core/src` commit since the `## Unreleased`
       cutoff, not just the 6 named at triage time (that was always the
       item's actual intent: "nothing shipped is undocumented," not "these
       exact 6 commits"). **8 entries added**: `.bo-btn-group` +
       dropdown open/close motion (`f1d8969`), `.bo-u-print-exact` utility
       (`0365cab`), `--bo-z-sticky-page` token (`e163a4d`),
       `--bo-density-auto-*` tokens — no rendered change, a named-and-
       findable refactor (`79f7fec`), the `data-grid` disabled-control focus
       fix + `data-decimals=""` parser unification (`b3b3719`), the
       `role="alert"` arrival-vs-severity guidance fix (`01d0952`), the
       `htmx` flash-on-update easing token (`0c66257`), and
       `initAnchorNav`'s live-measured landing offset (`5107dff`, 102.8).
       Two commits checked and correctly excluded: `3121f7b` (96.2, a
       code-comment-only decision record, no shipped change) and 102.9's
       fix (scoped to the docs demo, not `packages/core`). No tag moved,
       nothing published — still 102.5's stated owner call. Core build +
       111 vitest tests green (CHANGELOG.md is markdown-only, no CSS/JS
       output changed).

       **The 102.x sub-queue (102.2 → 102.11) is now fully closed.** The
       next dispatch should re-scan ROADMAP.md fresh for the next-oldest
       open item rather than assume another 102.x exists.

4. [x] **102.4 — DONE 2026-08-23. Owner adopted a drift-proof wake
       prompt** (conditional on no conflict with the dispatcher —
       verified: the prompt defers to LOOPS.md's rule order rather than
       restating it, and its halt sentence restates rule 8, so it cannot
       disagree with the file by construction). The adopted text names
       only stable things — the two files, the handover file, the live
       verification floor incl. the CI-only sweeps, the recorder — and
       none of the things that drifted before (slice numbers, dimension
       counts, dispatch order). Recorded verbatim in the loop-wake-trigger
       memory note; the old prompt's Slice-94/seven-dimensions text is
       retired. *(original entry follows)*
       **reconcile the standing wake prompt with reality. OWNER CALL.**
       The prompt driving every wake names Slice 94 as "the active queued work"
       and asks for "the seven DSA dimensions". Both are false: **39 of 39
       components are scored**, and the rubric has **six** dimensions since
       `hierarchy` was retired. Three independent sources agree
       (`rubric.dimensions`, the labels rendered into a built page,
       `check:dsa-scores`' own 39/39).

       The dispatcher has been silently substituting the roadmap's real
       priorities every wake. The substitutions were right — but nobody was
       told, which makes this the same two-accounts-disagreeing defect as
       94.12, the phantom 95.3, and the four live-region statements.
       **Accept:** the owner updates the standing prompt (or says to keep it
       and accept the drift, recorded here). A loop cannot fix its own
       instructions.

5. [x] **102.5 — DONE 2026-08-22.** Wrote
       `.roundtable/release-0.3.0-brief.md`: consumer-terms summary of what's
       in 0.3.0 (first release past 0.1.1, carries 0.2.0's 65 entries
       forward), no Breaking entries in either section, the exact release
       command, and a stated recommendation (skip 0.2.0, but re-cut the tag
       first — two real fix/feature layers landed on top of it that 101.1's
       "five more" count had gone stale on: measured live at **155** commits
       since the tag, of which 6 touch the shipped package and have no
       CHANGELOG entry yet, on top of the 5 already in `## Unreleased`).
       101.1 rewritten below to point here instead of restating.

       *Original Accept, retained for the record:* one artefact the owner can
       act on in a minute — what shipped since 0.1.1 in consumer terms (not
       commit terms), what is breaking, the exact click-path to cut the
       Release, and a stated yes/no on whether 0.2.0 should be skipped rather
       than published late. Then the roadmap item becomes "owner-blocked,
       awaiting release", counted once, not restated.

6. [x] **102.6 — `check:dsa-scores` reports "312 scored component(s)" when
       there are 39.** Its noun names components while the count is
       assertions. Harmless to correctness, but this project has a written
       rule that a reported number is load-bearing, and an 8x overstatement of
       coverage is what that rule exists for. Same defect was caught in
       `check:live-regions` this wake before commit. **Accept:** the printed
       count matches what it claims to count, in every gate that passes a
       mismatched noun — swept, not fixed one at a time.

       **Done 2026-08-21.** Swept all 22 passing gates by reading what each
       actually prints. **Two** were wrong, and both were mine from this
       session: `check:dsa-scores` said "312 scored component(s)" for 39, and
       `check:wrong-choice` said "79 page(s)" for 60. Both now name
       assertions and state the real page/component count alongside — the
       shape `check:live-regions` already used, which is how the defect was
       recognised. Every other gate's noun matched its count.

## Slice 101 — Objective grill: the loop optimised what it could see (2026-08-21)

Fired by the counter at 3/3 (slices 37, 94, 95). Full report:
`.roundtable/objective-grill-2026-08-21-slices-37-94-95.md`.

**Headline, measured: 78% of everything this session added to the shipped
source is commentary** — 284 comment lines against 78 of code across
`packages/core/src`. Comments are stripped from the minified bundle, so more
than three quarters of the work done on the *product* produced zero bytes for
a consumer. Not zero value — `tabs`'s mask alpha was re-derived **six times**
before a comment stopped it — but *internal* value, and the Objective's tests
ask what a consumer can delete or do.

**And largely self-inflicted:** our own `spacing` dimension asks that every
intrinsic literal carry its reason, so the framework wrote prose to satisfy a
measure we wrote, and the same rubric then scored itself clean. 94.7 called
that a self-clearing debt marker; this grill puts the price on it.

**The three principles themselves held.** Simplicity, less-for-more and
reusability all passed, with six real refusals recorded this session. The
principles are not the problem — what the loop chose to spend time on is, and
the owner has already answered that with Slices 99 and 100.

1. [x] **101.1 — SUPERSEDED by 102.5, 2026-08-22 (checkbox closed by 110.4 — a superseded item is a closed state, and it was polluting the open-item count).** Publishing is
       owner-triggered through Trusted Publishing and a wake cannot do it
       (npm here is unauthenticated by design) — restating "publish or
       record why not" an eleventh, twelfth time was not producing a
       decision, so 102.5 replaced the restatement with one artefact:
       `.roundtable/release-0.3.0-brief.md`. **Status: owner-blocked,
       awaiting release** — read the brief, not this entry, for current
       numbers (101.1's own "five more" count had already gone stale by the
       time 102.5 checked it live). This item stops being restated in future
       grills; re-open only if the brief itself goes stale.

       *Original wording, kept for the record:* Tagged at 06:00 today and
       pushed; the registry still serves **0.1.1**. There are now TWO
       unshipped layers: 0.3.0's 83 entries, plus five more stacked on top
       of the tag (scrim token, Money currency placement, the badge
       page-overflow P0, the mono token, `data-table`'s `min-inline-size`).
       **Accept:** either it lands on the registry, or this item records the
       owner's decision to hold and the reason, so it stops being restated
       every grill as though nobody had decided.

4. [x] **101.4 — Inbox / worklist.** **Done 2026-08-22** — built to the
       110-addendum bar from day one: the "why it's yours" reason is its own
       column with the reader named in bold; the success-empty ("nothing
       needs you") is a distinct state from filtered-empty in the states
       table; the data contract is stated in machine-operable terms
       (row data attributes, claim endpoint with 409-names-the-claimer)
       and the human-monitoring signals are named in-page (chip counts,
       danger badges, the Waiting column — with a deliberately-old 26-day
       row so age reads as the signal it is). Wrong-choice clause vs
       approval (single-process queue) and the notification contract.
       Composed entirely from shipped pieces (data-table, segmented,
       badge, button) — zero new CSS, complexity 2. All gates green incl.
       page-shape (21 patterns), wrong-choice (carrying), components-used;
       verified live both themes + 390px. Original Accept below, kept:** The one screen an ERP user opens first
       and the framework does not have. `approval` is ONE approver's queue for
       ONE document type; an inbox is cross-type and cross-process —
       approvals, exceptions, assigned tasks, failed jobs — in one list with a
       "why is this here" per row. **Accept:** the pattern recipe's six parts,
       plus the two things that make it an inbox rather than a list: the row
       must say *why it is yours* (assigned / awaiting your approval /
       exception), and the states table must cover the empty case that is a
       success ("nothing needs you") distinctly from the filtered-empty case.

5. [x] **101.5 — Notification.** **Done 2026-08-22.** The grill its Accept
       demanded came first and its answer is on the page: it is BOTH — the
       navbar glance (dropdown + unread-count badge, latest few, one
       view-all link) and the screen (readable history), each composing
       from shipped pieces, zero new CSS. Unread contract two-channel
       (worded badge + "read" in the byline); dead-record state keeps its
       text and loses its link; empty is plain, deliberately NOT
       celebratory (unlike the inbox, an empty history is no achievement).
       Machine/human split stated: agents emit and read state via data
       attributes, read-state belongs to the person (an agent marking read
       on the human's behalf is a contract violation). Two gates caught
       real errors during the build: check:links flagged three placeholder
       anchors, and check:data-hooks flagged an invented data-dropdown
       hook — the real dropdown contract is native popovertarget/popover,
       which the page now uses and which was verified live with a real
       click (:popover-open matched, 4 items). Original Accept below:** `alert` and `toast` cover things that happen
       WHILE you watch; the ERP case is the opposite — a posting run finished
       twenty minutes ago. **Accept:** a persistent, readable, per-item
       dismissible surface with an explicit unread contract; states for empty,
       unread-count, and an item whose underlying record no longer exists.
       Grill first whether this is a screen, a dropdown off the navbar, or
       both — and whether it composes from `alert` + `dropdown` + `data-table`
       rather than needing anything new (Objective §2 says try that first).

6. [x] **101.6 — Report.** **Done 2026-08-22.** Parameters -> run ->
       result, with the run-line (who/when/basis) as the part that makes a
       printout evidence rather than a screenshot. The Accept's "real print
       story" is the point of the screen, not a footnote: it is the first
       page to exercise `.bo-print-report`, `.bo-u-print-only` and
       `.bo-u-avoid-break` together, and **the claim is executable** —
       check:claims now drives a print-media render asserting the parameter
       form disappears, the print-only note appears, and the run-line
       survives (85 behaviours, up from 84). Red-proved: stripping
       `.bo-u-print-hidden` from the form turned it red on exactly that
       assertion. States cover not-yet-run (never an empty table that looks
       like a zero result), running (202 -> hands off to notifications),
       empty-with-parameters-restated, too-many-rows (state the cap, offer
       the export, never silently truncate), and stale-result (a figure
       never re-labels itself with inputs that did not produce it). Data
       contract makes export a FORMAT of the same request, and the report
       addressable by URL so an agent can re-run it. Zero new CSS,
       complexity 2. Original Accept below:** Distinct from `reporting-dashboard`, which
       MONITORS. A report is RUN — parameters, then read, print or export.
       **Accept:** the parameter/run boundary in the data contract; states for
       not-yet-run, running, empty result, and too-many-rows; and a real print
       story, because the framework has strong `@media print` rules and
       nothing that exercises them end to end. The 30.4b windowed list is
       related and stays owner-deferred — do not silently pull it in.

7. [x] **101.7 — Output form.** **Done 2026-08-22.** The Accept's "grill
       FIRST whether this belongs in a CSS framework at all" is answered on
       the page as **half yes**, and the split is the deliverable: producing
       the PDF is infrastructure (headless Chrome/Gotenberg/wkhtmltopdf) and
       shipping one would be the virtualiser mistake again; but what every
       one of those tools CONSUMES — HTML plus a print stylesheet — is
       exactly this framework's job and already shipped. So the page
       documents the contract, not a generator, and **zero new CSS was
       needed, which is itself the evidence the contract was complete.**
       One suspected gap measured away rather than "fixed": `thead` has an
       explicit repeat rule but `tfoot` has none — measured in print media,
       `tfoot` is already `table-footer-group` by browser default, so
       totals repeat and a framework rule would have been dead code (the
       exact defect print/index.css's own comment records). Verified in
       print media: header + totals repeat, letterhead/parties/kv blocks
       carry break-inside avoid, print-only line appears. States refuse to
       style a no-lines document (a bug upstream, not an empty state) and
       forbid watermark-image drafts (a b/w printer loses them; the word
       DRAFT is the two-channel answer). Complexity 2. Original Accept
       below:** The printed artefact an ERP emits: PO,
       invoice, delivery note. **The shape most UI frameworks ignore and an
       ERP cannot ship without.** It is a document, not a screen — fixed
       layout, page breaks, letterhead, totals that survive pagination.
       `@media print` rules already exist scattered across nine components
       with nothing composing them into an artefact. **Accept:** grill FIRST
       whether this belongs in a CSS framework at all (a real answer might be
       "your server renders PDFs; here is the print stylesheet contract") —
       refusing is a valid outcome and would itself be worth documenting.

2. [x] **101.2 — DONE 2026-08-21. 95.3 was never actually queued.**
       95.3 is a real numbered item and has now been dispatched and closed on
       its merits. The invariant this item asked for was also run: of the
       `roadmap NN.N` references in this file, only two resolve to no numbered
       item — `92.5` and `94.1` — and **both survive only inside narrative
       that exists to describe them as dangling**, which is legitimate per the
       assert-on-structure rule (the prose explaining a removal is supposed to
       name the thing removed). Zero live references remain in
       `dsa-scores.json`. Last wake's entry says the
       touch half of device fitness was "re-scoped and re-queued as 95.3", and
       it was written as **prose inside a closed item** — it appears four times
       in this file and **zero** times as a numbered open item, so the
       dispatcher can never pick it up. Worse than forgetting, because the
       record claims otherwise: the same two-accounts-disagreeing shape 94.12
       found in the score file. **Accept:** 95.3 exists as a real `[ ]` item
       carrying the Accept criteria already written for it, and this file
       gains no other "re-queued as X" that is not an item. Check by
       enumerating: every `roadmap NN.N` reference in a citation or comment
       resolves to a numbered item or a closed one.

3. [x] **101.3 — DONE 2026-08-22. Stop rule lives in
       `apps/docs/src/data/dsa-scores.json`'s `rubric.stopRule`** (the same
       file that already carries the rubric's `definitions`, so it's
       discoverable by whoever next considers touching the rubric, not
       buried in roadmap history). Fires only when a live grill — not a
       re-score — finds a component that scores 3 across the board yet has a
       genuine, user-facing defect the six dimensions structurally can't
       see; worked example cited is 102.7's forms-family grill, which found
       `form.astro`'s `--required` demo shipping the asterisk with zero
       `aria-required`. Does NOT fire on a dimension reading uniformly
       (documented as expected, not broken) or a grill that confirms the
       rubric's existing verdict — 102.2 and 102.3's grills both did that,
       cited as the mirror case. Until the trigger fires, scoring work stays
       maintenance-only of the existing ratchet.

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

**94.2 — the systemic Spacing finding (supersedes the per-component
spacing halves of 92.5 and 94.1).** Eleven components scored across
batches 1-2: **Spacing is 2 on eight of them and is the only dimension
that has ever scored below 3.** Every instance is the same shape — an
intrinsic, correct dimension literal (chevron box, chip padding,
listbox max-height, action-bar clearance) written raw and uncommented.
That is one habit, not eleven defects. **Resolution: comment each in
place** stating why the number is intrinsic, rather than adding a token
tier — these numbers genuinely are intrinsic (tokenizing a chevron's
`1em` adds indirection without meaning), and the score is reporting
that the *reasoning* is missing, not the token. Accept: every literal
flagged by a batch carries its why-comment; affected components
re-score to 3 on Spacing.

**[x] 94.2 — DONE (Standardize sweep, 2026-08-21).** Fourteen literals
across ten components now carry their why-comment; all ten re-score to
3 on Spacing. Two comments make executable claims and both were run,
not assumed: `check:target-size` names `bo-tag-input__remove 16x16
(nearest 91px)` and `bo-checkbox 16x16` in its own passing output, so
the WCAG 2.5.8 spacing-exception route each comment cites is verified
rather than asserted. The CSS is documentary only — the README
size-stamp check passing proves the minified `dist` is byte-identical,
which is stronger evidence than a screenshot that nothing can have
regressed.

**Three of batch 1-2's citations were wrong, and reconciling them
before editing is what found 94.3.** The instrument had flagged
literals that already carried comments (`filters`' 1rem remove box has
had its WCAG 2.5.8 note since 2026-08-17; `tree`'s 1.25em indent
states its em-relative reason) and one that does not exist at all —
`quantity`'s "raw 1px in the joint rule" is *comment text* describing
a `calc(var(--bo-border-width) * -1)`. That is the documented
comment-injection trap, hit by a scoring pass rather than a gate. Rate:
3 of 14 cited literals misread.

1. [x] **94.3 — DONE 2026-08-21. Verdict: it IS deliberately tighter, and now it is a NAMED tier with the measurement behind it. `data-table`'s auto-compaction is a fourth density
       Accept offered two outcomes; the measurement picked the second. Raising
       `cell-padding-x` to compact's `--bo-space-2` at 390px grows a real row
       on `/patterns/detail-form` from **68px to 87px** — the wider cells force
       their content to wrap — while simple tables go 28px to 30px. Horizontal
       room is the scarce resource at phone width, so the tighter padding buys
       the thing there is least of. That is a reason, not an accident, and it
       is now written where the values live. The 2px row-height difference
       buys nothing measurable, and is recorded as such rather than defended.

       The two heights moved to `--bo-density-auto-*` in `tokens/density.css`,
       beside the tiers they relate to, so the fourth density is findable from
       where a reader looks for densities instead of hiding as literals inside
       a container query. `control-height` still equals compact's value, and
       the comment says keeping them adjacent is the point: a retune of one is
       now visibly a decision about the other.

       **Proved a no-op, not assumed.** Measured the same four pages before and
       after at 390px — 1.75rem / .25rem / 1.75rem, rows 77/28/68/28,
       identical. Verified live in both themes; at 1280 the container is
       47.88rem so compaction correctly does not apply, which confirms the
       tier stays scoped.

       **Considered and not done: a gate asserting `auto` is never looser than
       `compact`.** It would make "deliberately tighter" executable, which is
       the house rule for claims. Declined here because equality on
       `control-height` is deliberate and a naive gate would forbid the
       intentional retune the comment invites; the honest version needs a
       "tighter or equal on every alias" comparison across two files, which is
       a real piece of work rather than a rider on this item. Original text
       follows.
       nobody designed.** Found while commenting its `1.75rem` heights.
       The `@container bo-table (max-width: 30rem)` block claims in its
       own comment to produce "coherent compact", and does not: it sets
       `--bo-density-row-height: 1.75rem` where `[data-density="compact"]`
       uses `1.875rem`, and `--bo-density-cell-padding-x: var(--bo-space-1)`
       where compact uses `--bo-space-2`. `--bo-density-control-height:
       1.75rem` *duplicates* compact's value as a literal, so it will
       drift silently the first time compact is retuned. A container
       query cannot re-enter a token selector, so the duplication is
       structural — but the divergence is not: these values date to the
       initial commit and were never deliberated. The comment has been
       corrected to state the divergence; the values have not been
       touched, because matching compact changes rendered row heights.
       **Accept:** decide whether auto-compaction IS compact (then take
       the two values to compact's and verify live at 1440/390px in both
       themes) or is deliberately tighter (then it is a named density
       with its own row in `density.css`, not three literals hiding in a
       container query). Either outcome removes the duplicated literal.

2. [x] **94.4 — DONE, and the premise was WRONG (2026-08-21). The rubric
       discriminates; the population was uniform.** Ran the test this item
       specified — score the deprecated `date` and check it ranks below
       `money`. It does: **`date` 83% (15/18) against `money` 100% (21/21)**,
       and it fires the trigger on `Fit: 0` — prescribed in no context, its own
       source says compose `.bo-cluster` + two utilities instead, and zero
       screens use it (the one hit outside its own page is a prose mention on
       `/components/amount`).

       **The two-clause trigger is vindicated by the same number.** 83% is
       ABOVE the 80% threshold, so clause 1 never fires — only clause 2 (any
       dimension ≤ 1) catches it. A single-clause trigger would have missed
       this component entirely, which is exactly the failure Slice 94 wrote
       clause 2 to prevent, in almost the words it used.

       **What nearly went wrong, and the rule it confirms.** The first draft
       scored `date` at 2 on typography and 2 on colour — no density awareness,
       no forced-colors rule. Checked against the components already scored
       before committing to it: `money` and `amount` BOTH have zero
       `--bo-density` references and zero `@media (forced-colors)` blocks, and
       both were scored 3 on those dimensions. Penalising `date` for them would
       have been **manufacturing the discrimination this test was looking
       for** — the instrument telling me what I went in expecting. Scored on
       the standard actually in use, `Fit` alone carries the verdict, which is
       the stronger result. Also caught: `grep -c forced-colors date.css`
       returns 1, matching the deprecation comment that SAYS there is no
       forced-colors rule — the same comment trap as the 94.2 citations, twice
       in two wakes.

       So the honest reading of "12 of 14 read 100%" is not a blind rubric but
       a **uniformly mature scored population** — all 14 were long-grilled
       components. Batches 3-7 are unblocked and worth running as planned; no
       sharpening needed, and the percentage stays.

       Verified live (bind-mounted container on the fresh `dist`, not the
       cached image — the running `bo-docs-run` was serving stale content, so
       it was bypassed): 83% and `Fit 0 / 3` render in **both themes**, dark
       confirmed by computed `background-color` (`rgb(249,250,251)` →
       `rgb(15,17,21)`) rather than by the toggle appearing to work.
       `resize_window` did not propagate to the viewport (stuck at 1280 across
       two attempts — the Slice 70.1/71.1 limitation), so **390px was verified
       by constraining the section and measuring**, not by a phone-width
       screenshot: no page-level horizontal overflow, the table reflows inside
       its own `overflow-x: auto` container, and `--bo-density-row-height`
       resolves to compact's `1.875rem` — explicit density correctly beating
       auto-compaction, which is a live confirmation of 94.3's analysis.

3. [x] **94.7 — DONE for `content`, PARTLY for the rest (2026-08-21).** The
       rubric now carries explicit **scoring definitions** in
       `dsa-scores.json`'s `rubric.definitions`, which is where a future
       scorer will look; before this they existed only implicitly inside
       citations, which is why nobody noticed three dimensions never moving.
       Each definition names a component in this repo that scores below 3, so
       the dimension is known to be capable of failing.

       **`content` — saved, and it discriminates.** Sharpened to: *the page
       names at least one context where this component is the WRONG choice,
       and what to use instead.* **Six fail**: `approval-workflow`,
       `file-upload`, `filters`, `offcanvas`, `ordered-list`, `tag-input` —
       measured across prose AND `ApiTable` notes, then hand-verified on
       `filters` and `ordered-list`, which genuinely say only what the thing
       is and how to use it. Re-scored to 2 with citations naming the missing
       alternative; the work itself is 94.8.

       **`hierarchy` — narrowed, still undemonstrated.** It is now `na` where
       a component presents fewer than two affordances, because ranking one
       thing against nothing is vacuous — which is exactly why it read 3 on
       28 of 28. Eight components moved to `na`. But on the 20 where it still
       applies it is *still* 3 across the board, so it has not been shown
       capable of failing. Narrowing made it honest, not discriminating.

       **`interaction` — definition sharpened, NOT re-scored.** New
       definition: *for a component shipping a behavior, the page states what
       the PLATFORM provides versus what the behavior adds.* A regex flagged
       7 of 13 behaviour-backed components as silent; **hand-checking flipped
       4 of those 7** — `dialog` ("browser handles backdrop, ESC and focus
       return; the behavior adds trigger wiring"), `offcanvas`, `pagination`
       and `tag-input` (which says outright that no native element covers it,
       so JS is required) all draw the line in substance. Only `alert` and
       `combobox` look like real failures, and two is too thin to re-score on
       without reading all 13 properly. Left at 3 rather than scored on a
       detector with a 4-in-7 error rate.

       **`spacing` — kept, relabelled.** It cannot stop being satisfiable by
       the scorer's own commit, because that IS what it measures. The
       definition now says so outright: *a debt marker, not a quality signal
       — read it as "has this file been through a scoring pass".*

       **Effect on the distribution**, which was the point: from
       `{83:1, 90:2, 94:3, 95:3, 100:19}` to
       `{80:1, 90:1, 93:4, 94:1, 95:7, 100:14}`. Fourteen at 100% instead of
       nineteen, and `content` varies for the first time.

       **Batches 5-7 are unblocked** — they will now be scored against
       definitions that can fail, which was the whole reason for gating them.

4. [x] **94.8 — DONE 2026-08-21.** All six pages gained one sentence in the
       opener naming a context where the component is the wrong answer and
       linking a real alternative that exists in this framework: timeline →
       Stepper, file-upload → a bare input in a form field, filters → the
       table toolbar, offcanvas → master-detail, ordered-list → the data
       table, tag-input → checkboxes or Combobox. Verified in the BUILT
       output — each opener carries both the refusal and a resolving link
       (the link check passes, so both `/components/table-toolbar` and
       `/patterns/master-detail` exist). All six re-score to `content: 3`.

       `ordered-list.astro` did not declare `const base`, unlike the other
       five, so the first build failed with "base is not defined" — a
       convention assumed rather than checked. Declaration added.

       **Honest note on what this does to the number:** `content` is back to
       3 on 28 of 28, so its discriminating power is spent until new
       components arrive. That is not the same failure as `spacing`, though:
       spacing clears by writing a comment ABOUT existing code, whereas this
       cleared by writing six pieces of user-facing guidance that did not
       exist. The definition records that it HAS failed, and names the six,
       which is what keeps it credible.

5. [x] **94.9 — DONE 2026-08-21. `interaction` kept and now discriminates; `hierarchy` RETIRED. finish `interaction`, and decide `hierarchy`'s fate.**
       **`interaction` — read, not grepped, exactly as this item required.**
       All 14 behaviour-backed pages judged by hand against 94.7's wording.
       Eleven draw the platform/behavior line, several of them well:
       `file-upload` ("the platform's own picker, keyboard access and native
       drag-drop come free; the framework styles it and adds one small opt-in
       behavior"), `tabs`, `quantity`, `data-table` ("zero JS"), and `money`,
       whose sentence exists because Slice 79 found this same gap there.
       **Three fail — `alert`, `combobox`, `tree-table`** — re-scored to 2 and
       queued as 94.14. The definition also now says what a behavior-LESS
       component earns: 3 for saying the platform does all of it, not `na`.
       `na` is reserved for no interaction surface at all.

       **`hierarchy` — retired, and retiring it loses nothing.** It scored 3
       on every one of the 25 components it applied to and never varied, even
       after 94.7 narrowed it to `na` where a component has fewer than two
       affordances. The reason is structural rather than accidental: **a
       component is not a screen**, and almost no component presents two
       affordances competing for primacy. The property it named is already
       measured where it means something — 57.3's design-grill baseline,
       re-verified in 63.2, covers all 19 pattern SCREENS at ≤1 visually
       primary action with the two legitimate exceptions named. So the rubric
       drops from seven dimensions to six, denominators shrink, and the
       retirement note in `rubric.definitions.$retired` says not to re-add it
       without a component that fails it.

       Distribution after both changes:
       `{80%:1, 87%:4, 93%:4, 94%:7, 100%:23}`. Read
       all 13 behaviour-backed pages against 94.7's sharpened `interaction`
       definition and re-score (the regex is not trustworthy here — it was
       wrong on 4 of 7). For `hierarchy`: it is now `na` where it is vacuous
       but still 3 on all 20 where it applies. **Accept:** either name a
       component that fails it, or retire the dimension and shrink the
       denominator — the same test 94.7 set, now that its scope is honest.

       Superseded text follows: **three of the seven DSA dimensions have
       never varied, and
       Spacing is a to-do list. This supersedes 94.4's "no sharpening
       needed".** Measured across all 28 components scored (batch 4):
       `hierarchy` `{3: 28}`, `content` `{3: 28}`, `interaction` `{3: 17}`
       with 11 `na` — **the same value 28 times out of 28, three times over.**
       By this project's own rule (an identical value across many inputs is an
       instrument defect until shown otherwise) those three are not measuring;
       they are ceremony attached to a published number.

       `spacing` is worse than flat, it is *self-clearing*: it reads 2 exactly
       until a wake writes the why-comment, then 3 forever. All six of batch
       4 went 2→3 inside the same wake, by the scorer's own edit. A dimension
       whose value means "has a scoring wake visited this file yet" tells a
       reader nothing about the design.

       That leaves **`fit`** as the only dimension carrying signal — exactly
       what 94.4 found when `date` scored `Fit: 0` while passing the 80%
       clause. 94.4 concluded "the rubric discriminates, no sharpening
       needed"; on 15 rows that was defensible, on 28 it is not. The rubric
       discriminates *through one dimension*.

       **Accept:** for each of `hierarchy`, `content`, `interaction`, either
       (a) write a failure definition sharp enough that a real component in
       this repo scores below 3 on it — and name that component — or (b)
       retire the dimension and shrink the denominator. Same test for
       `spacing`, which additionally must stop being satisfiable by the
       scorer's own commit. Do this **before** batches 5-7 (Display, Actions,
       Values: 17 components), so they are not scored twice. Note this is the
       second time this concern has been raised and the first time it had
       enough rows to be measured rather than argued.

5. [x] **94.14 — DONE 2026-08-21. three behaviour-backed pages never say what the JS adds.**
       Each sentence was written from the behavior's own source, not from the
       page, so it says what the JS actually does:

       - **`alert`** — `initAlerts()` is **dismissal only** (document-level
         delegation over `.bo-alert__dismiss`). So the role, the live region
         and the styling are all markup, and the ✕ is the single thing lost.
         Injecting toasts was always consumer code.
       - **`combobox`** — this one does not degrade, it *stops*, and the page
         now says so plainly. Esc and light-dismiss are native to the
         `[popover]`, but opening, filtering and selection are all
         `initCombobox()`. It names the fallback too: ship a `<select>`.
       - **`tree-table`** — indentation is `data-tree-level` and open state is
         `aria-expanded` + `hidden`, both markup, so a server-rendered tree is
         fully readable without the JS; `initTreeTable()` adds only the
         toggling, and the disclosure buttons are what go inert.

       All three re-score to `interaction: 3`, so the dimension now reads 3 on
       all 21 it applies to. It has demonstrated it can fail (94.9 found these
       by reading all fourteen), which is what keeps it credible now that it
       is clean — the same standing that `colour` has.

       Verified against the BUILT output and live in both themes.
       Named by 94.9, which read all 14 rather than grepping them (an earlier
       regex was wrong on 4 of 7). A reader of these three cannot tell what
       they lose by not running the behavior:

       - **`alert`** — inline alerts need no JS at all; toasts cannot work
         without the injecting script. The page draws neither line.
       - **`combobox`** — nothing states what remains without
         `initCombobox()`: a text input beside a list that never opens or
         filters. The page's no-JS phrases are about the CONSUMER reading
         events, which is a different subject.
       - **`tree-table`** — server-rendered collapse is documented, but not
         what `initTreeTable()` itself adds, so whether expand/collapse works
         without it is unanswered.

       `money` is the model to copy, and it exists because Slice 79 found the
       same gap there: *"The JS is optional, not required. Without
       `initMoneyField()` the two controls still work — precision just doesn't
       follow the currency automatically."* One sentence, and the reader knows
       exactly what the behavior buys.

       **Accept:** each of the three gains that sentence, naming what the
       platform does and what the behavior adds; each re-scores to
       `interaction: 3` with a citation quoting it.

5. [x] **94.13 — DONE 2026-08-21. Neither branch alone: the six were THREE different jobs, and separating them is the answer. the six raw font-sizes, and whether the type scale is
       Accept offered "add a relative tier" or "declare em ratios intrinsic".
       Reading the six together showed the question was mis-posed — they are
       not one pattern:

       - **Inline mono, ×3** (`kbd`, `prose code`, `data-table__col--code`) —
         a monospace face renders optically larger than the sans at the same
         nominal size, so inline mono is set slightly smaller. This IS one
         concept, and it was written as **two numbers**: kbd 0.85em against
         the other two at 0.9em. Now `--bo-font-size-mono-inline`, the one
         ratio in a scale of absolute steps, and it earns the exception
         because the same `<code>` sits inside an h2, inside compact table
         text and inside body copy — no absolute step tracks all three.
         Unifying moved kbd by **1px in each dimension at both densities**
         (measured before changing it).
       - **Subordinate affix** (`amount`, ×2 at 0.875em) and **box geometry**
         (`avatar` 0.7em, two initials inside a 1.8em disc) — genuinely
         intrinsic, now explained in place.
       - **Display size** (`dashboard` 3rem, above the scale's 1.5rem top) —
         left a literal with the reason, because it has exactly one caller. A
         second display-sized caller is the recorded trigger to promote it.

       **The count that made this a decision rather than a rename:** the five
       em values are 0.7 / 0.85 / 0.875 / 0.9 / 0.9. A single "relative tier"
       would have had to flatten four distinct intents into one number, and
       four tiers would have been renaming four literals. Only the mono three
       were actually the same thing.

       Also measured and left alone: **seven** rules use `--bo-font-mono`, with
       five sizing strategies. Four are correct as they are — `approval-workflow`
       and `ordered-list` take absolute steps because there the size carries
       hierarchy, and the utility plus `input` inherit on purpose. The token's
       comment says so, so a future sweep does not "unify" them.

       `typography` now reads 3 on all 39, and its definition records that an
       em ratio counts when the element must track its host rather than the
       document — the same standing `spacing` gives intrinsic dimensions.
       missing a step.** Created by 37.3, which found that `typography`'s six
       failures had **no live follow-up at all**: four of them (`avatar`,
       `dashboard`, `kbd`, `prose`) carried no `improve` entry, and the other
       two pointed at "roadmap 92.5" and "roadmap 94.1", **neither of which
       exists as a numbered item**. A reader following either reference found
       nothing.

       The six, with what each is doing:

       | Component | Literal | What it is |
       |---|---|---|
       | `avatar` | `0.7em` | initials inside a 1.8em disc |
       | `kbd` | `0.85em` | keycap text, deliberately em-relative |
       | `data-table` | `0.9em` | `__col--code` mono cells |
       | `prose` | `0.9em` | inline `<code>` |
       | `amount` | `0.875em` ×2 | currency/unit affixes |
       | `dashboard` | `3rem` | the stat hero value |

       **The pattern is the finding.** Five of the six are *em* and cluster in
       a narrow band (0.7-0.9) doing the same job — text that must sit
       *smaller than its host* without leaving the host's scale, which is what
       an em ratio buys and a rem token cannot. `--bo-font-size-xs` is an
       absolute step; none of these want one. The sixth, `dashboard`'s `3rem`,
       is the opposite case: a display size *above* the scale's top.

       **Accept — decide, do not just tokenise.** Either (a) the scale gains a
       relative tier (a `--bo-font-size-ratio-*` or similar) that the five em
       cases consume and a display step for `dashboard`, and all six re-score
       to 3; or (b) record that "smaller than my host, in em" is a legitimate
       intrinsic that the type scale deliberately does not express — in which
       case `typography`'s definition must say so, exactly as `spacing`'s does
       for intrinsic dimensions, and the six re-score to 3 on that basis
       rather than staying at 2 forever with no route out. **What is not
       acceptable is the current state:** six public pages showing 2/3 with no
       queued fix behind them.

5. [x] **94.10 — DONE 2026-08-21. Its own escalation condition had been met, so the recipe changed rather than a third hand-written pass. the wrong-choice guidance gap is systemic, not a one-off.**
       **The real scale, measured first:** of 40 component pages, **6** carried
       a wrong-choice clause — exactly the six 94.8 wrote by hand. **34 did
       not.** That is not a run of oversights, and writing 34 sentences by
       hand would leave the next new page missing it again.

       So the requirement moved into the recipe (`CLAUDE.md`) and is enforced
       by a new gate, `check:wrong-choice`. The check is **exact, not a
       judgement about prose**: the opener must carry a `<strong>` clause
       beginning "Not " / "Never " / "Do not". A convention, mandated — which
       earns its prescriptiveness twice, because a reader gets the boundary in
       bold where they are already looking and a gate can see whether it is
       there. What the clause *says* stays a human judgement.

       **Two lists, and the difference is the point.** `TODO` is debt that
       only shrinks; `EXEMPT` is a decision, each entry carrying its reason —
       `button` (the primitive others are the wrong choice *versus*), `form`
       (the entry-context anchor), `prose` (renders whatever the server
       sends). Forcing a sentence where none is true produces filler, which is
       worse than silence.

       **Red-proved both ways**, because a ratchet has two failure modes: a
       page outside both lists missing the clause (exit 1, names it), and a
       page that GAINED the clause while still sitting in `TODO` — list rot,
       which would quietly overstate the debt (exit 1, names it). Restored
       byte-identical after each.

       **The ratchet moved this wake: 6 → 14 carrying, 31 → 23 outstanding.**
       Eight written where the wrong context was genuinely clear — dropdown→
       segmented, segmented→select/combobox, kv→form, kbd→button, amount→
       money/quantity, tabs→sidebar/breadcrumb, dialog→alert, breadcrumb→
       stepper. Each verified in the BUILT output to carry both the clause and
       a resolving link, and live in both themes.

       Three of the eight — `dropdown`, `tabs`, `dialog` — had no `const base`
       declaration, so the first build failed with "base is not defined". The
       **same slip as `ordered-list` in 94.8**: assuming a convention holds
       across pages instead of checking. Twice now, which makes it worth
       naming rather than quietly fixing.
       94.8 wrote it for the six components 94.7 named, and I recorded there
       that `content`'s discriminating power was "spent until new components
       arrive". **That was wrong, and batch 5 is the correction**: on the
       Display family — untouched by 94.8 — `content` failed **7 of 7**. The
       power was spent only on the population already treated. Not one of
       `dashboard`, `byline`, `badge`, `kbd`, `avatar`, `prose`, `calendar`
       names a context where it is the wrong choice.

       Two near-misses are worth naming so a regex does not "fix" them:
       `kbd`'s "use the native `<kbd>` element, not a span" and `badge`'s
       "never encode status as colour alone" read as negative guidance but
       are about markup and accessibility *within* using the component — not
       a context where the component itself is wrong.

       **Accept:** same shape as 94.8 — each of the seven gains one sentence
       naming a wrong-choice context and linking a real framework
       alternative; each re-scores to `content: 3` with a citation quoting
       it. **Then stop treating this per-batch**: if batches 6-7 also fail
       7-of-7, the honest conclusion is that the docs recipe in `CLAUDE.md`
       should require the sentence, so new pages cannot ship without it —
       raise that rather than writing it a third time by hand.

4. [x] **94.6 — CLOSED 2026-08-21. Both halves done: (a) the scrim token landed in the earlier Standardize sweep, (b) the spacing habit is now swept framework-wide (below). batch 3's two family-level findings (Navigation & layout).**
       **(b) done across all remaining families (Standardize, 2026-08-21).**
       Eleven components were still at `spacing: 2` — batch 3's six, which
       94.6b queued but never got, plus batch 5's four and batch 6's one.
       All eleven now carry their reason and re-score to 3; `spacing` reads
       3 on 39 of 39.

       **Two things worth recording rather than celebrating.** First, one of
       the eleven was a false entry: `dashboard` had NO uncommented spacing
       literal — the 32px and 20rem/1rem a scan flags are numbers quoted
       inside the comments that explain them. Its citation was wrong and is
       corrected. Second, `spacing` reaching 39/39 is the self-clearing
       behaviour 94.7 documented, arriving on schedule: the debt is paid, so
       the dimension now discriminates nothing. Only `typography` (6),
       `content` (10) and `fit` (1) still vary.

       **The detector that found these was wrong six times first**, always
       the same way: it searched raw source, so every number quoted inside a
       comment ("the 1.5rem target floor", "2 x 20rem + 1rem gap = 41rem")
       came back as an uncommented literal. The working version blanks
       comments to same-length spaces first, preserving offsets. It is in
       the scratchpad, not the repo — see 94.11 for why it is not a gate.


5. [x] **94.12 — DONE 2026-08-21, and 94.10 supplied the tool that made it honest rather than a re-reading exercise. `content` is scored against TWO different standards
       **Measured the disagreement instead of re-reading 28 pages by
       judgement** — which is what produced two standards in the first place.
       `check:wrong-choice` is the executable form of the definition, so the
       question became simply: does each `content` score agree with the gate's
       verdict on its page? **22 of 39 did not**, in both directions: 17 rows
       scored 3 with no clause (the pre-94.7 population), and 5 scored 2 whose
       pages had gained one, plus the 3 EXEMPT pages.

       **The goalpost move is now on the record rather than hidden.** 94.7
       defined this as "names a wrong-choice context" in prose; 94.10 made the
       bolded clause the mandated form, because 34 of 40 pages had nothing and
       a prose-only rule cannot be enforced. The definition says so in as many
       words, so nobody has to reconstruct why a row that once passed now does
       not.

       **And it cannot drift a third time.** `check-dsa-scores` now asserts
       the equivalence directly: `content: 3` if and only if the page carries
       the clause or is EXEMPT. Red-proved by recreating 94.12's exact defect —
       navbar scored 3 with no clause — which the gate names and exits 1 on.
       The pleasing consequence is that the two records became one action:
       writing a page's clause raises its score AND shrinks the gate's TODO.

       **The gate caught my own bug while I was writing it.** The re-score
       script `continue`d on EXEMPT pages before cleaning their `improve`
       lists, so button/form/prose briefly scored 3 while still claiming a
       content gap — exactly the shipped contradiction assertion 4 exists to
       catch, caught this time before it left the machine.

       Distribution: `{73%:1, 93%:10, 94%:11, 100%:17}`. `content` now reads
       `{2: 22, 3: 17}` — the most discriminating dimension in the rubric, and
       honestly so: 22 pages genuinely do not tell a reader when to use
       something else. The remedy is 94.10's ratchet, not a re-score., and the
       file says 3 for both.** Found while feeding results back (37.3). 94.7
       sharpened `content` to "names a context where this is the WRONG choice",
       but **28 of the 39 rows were already scored** against the older implicit
       standard (meaning-not-mechanism, two-channel state) and were never
       re-read. Only batches 5-7 and the six 94.8 fixed were judged by the new
       wording. So a pre-94.7 `content: 3` means "passed the older standard" —
       and several plainly fail the current one: `navbar` cites "@media print
       drops it", `pagination` "page labels are meanings, not indices",
       `tree-table` "expanded/collapsed state is programmatic + visible". None
       of those names a context where the component is the wrong choice.

       This is exactly what **37.2 warned about in advance** — "correcting the
       rubric after 55 rows are scored means scoring them twice" — and it
       happened anyway, because 94.7 changed a definition without re-reading
       what had already been judged by the old one. The caveat is now written
       into `rubric.definitions.content` so the file stops implying one
       standard.

       **It also settles 94.10.** With ~20 more likely failures on top of the
       10 already counted, the shortfall is roughly 30 of 39 — not a set of
       page-level oversights but a missing step in the recipe. Write the
       requirement into `CLAUDE.md`'s "How to document a component" and let
       the pages follow, rather than hand-writing thirty sentences.

       **Accept:** re-read all 28 pre-94.7 rows against the current definition
       and re-score; every demotion carries a citation saying what the page
       says instead. Do it in ONE pass, not per-family, so the file is never
       again half-judged by a retired standard.

5. [x] **94.11 — DONE 2026-08-21. Answer: NOT mechanically checkable, and the demonstration is the deliverable. should "every intrinsic literal carries its reason" be a
       Accept required either a rule whose false-positive rate on today's tree
       is zero, red-proved against a genuinely unexplained literal, or a record
       that the property cannot be gated. Both halves were built and the second
       won on evidence.

       The rule was expressible: *the nearest preceding comment covers the
       literal*, which is exactly the group semantics 94.11 asked for — one
       comment for `tree-table`'s eleven-level ladder rather than eleven. It
       scored **zero false positives across all 43 component stylesheets**.

       **And it cannot fail.** Injecting `letter-spacing: 7px` — a literal
       nothing in the file explains — into a rule that merely follows an
       unrelated comment, the detector still reported **0 unexplained**. The
       base rate says why: **155 of 155 literals in the framework already have
       some comment somewhere above them**, so the predicate is uniformly true
       and distinguishes nothing.

       No regex closes that gap, because it is not a regex problem: *"a comment
       precedes this literal"* is checkable, *"a comment explains this
       literal"* is semantic. So `spacing` stays a rubric dimension, with its
       definition's existing caveat standing — it is a debt marker that only
       moves when a human re-scores, and that is now a known limit rather than
       an unexamined one.

       The general lesson is worth more than the item: **measure a predicate's
       base rate before shipping it as a gate.** Recorded in `CLAUDE.md`
       beside the heuristic-gate doctrine, with this as the worked example, and
       contrasted with `check:wrong-choice` — which works precisely because it
       gates the SHAPE that carries the meaning and says outright that the
       meaning itself is a human call.
       GATE rather than a rubric dimension?** `spacing` has now discharged
       to 39/39 and measures nothing until someone adds an uncommented
       literal — at which point nothing catches it, because the rubric is
       re-scored by hand on a slice cadence. A build gate would turn the
       habit into an invariant and let the dimension retire.

       **Not trivially gateable, and the reason is measured.** The corrected
       detector reports 42 remaining literals framework-wide, and nearly all
       are legitimate: em `letter-spacing` (treated as intrinsic by
       precedent), raw `font-size` (a different dimension), and — the hard
       one — literals covered by ONE comment that explains a family of
       following rules (`tree-table`'s eleven-level indent ladder, `tabs`'s
       six mask rules, `data-table`'s six accent bars). A gate that demands
       a comment per declaration would force six copies of one explanation,
       which is worse than the habit it polices.

       **Accept:** either express "a comment above this rule GROUP covers its
       literals" precisely enough that the detector's false-positive rate on
       today's tree is zero — red-proved by injecting a genuinely
       unexplained literal and watching it fail — or record that the
       property is not mechanically checkable and keep it as a rubric
       dimension, accepting that it only fires when a human re-scores.

       Neither is a per-component defect; both are one habit seen across the
       family, which is why the unit of work is a family.

       **(a) DONE 2026-08-21 (Standardize sweep).** `--bo-color-scrim` added
       to `color.css`; both `::backdrop` rules consume it and no raw scrim
       literal remains in `src`. Deliberately **not** remapped for dark, and
       the token's comment says why: the interaction overlays beside it invert
       because they tint a surface, whereas a scrim pushes the whole page
       back, so a white scrim in dark mode would lift the background toward
       the panel. Proved a no-op rather than assumed — computed `::backdrop`
       is `rgba(0, 0, 0, 0.4)` in **both** themes on a real opened dialog,
       identical to the literal it replaced. `dialog` and `offcanvas` re-score
       to `Colour: 3`. Original text follows.

       **(a) The modal scrim is the framework's only untokenized colour, and
       it is duplicated.** `rgb(0 0 0 / 0.4)` is written verbatim in
       `dialog.css:20` and `offcanvas.css:28` — the only two `::backdrop`
       rules that exist — and no `--bo-color-scrim` token exists (searched:
       the only overlay tokens are `--bo-state-hover-overlay` and
       `--bo-state-active-overlay`). It is also the one colour deliberately
       outside the theme system, since a scrim should darken in both themes.
       **Accept:** either add one semantic token both rules consume (which
       also lets a consumer tune scrim weight, a real ERP ask), or state in
       both files why the literal is correct and deliberately shared — but
       not leave the same magic value in two places with no explanation.
       Scored as `Colour: 2` on both until then.

       **(b) The 94.2 spacing habit is framework-wide, not batch-1-2-wide.**
       Every component in this family except `breadcrumb` carries an
       uncommented intrinsic dimension literal: `navbar` 3rem bar height,
       `sidebar-nav` 14rem/3.25rem rail widths, `offcanvas` 18rem panel,
       `dialog` 32rem/56rem caps, `tabs` 2.5rem fade + 2px underline, `icon`
       -0.125em baseline nudge. 94.2 fixed the ten components batches 1-2 had
       scored and drew the right conclusion — one habit, not N defects — but
       scoped the fix to the components already scored. **Accept:** comment
       each in place as 94.2 did, at the point each family is scored rather
       than as one sweep, so the comment is written by someone who has just
       read the component. `breadcrumb` is the proof it is achievable: zero
       raw dimension literals, 100%.

4. [x] **94.5 — CLOSED 2026-08-21, by making the branch REACHABLE rather than by wiring pages. The "not yet scored" line has never rendered on any page.**
       With all 39 documented components now scored, the wiring fix this item
       proposed is moot — there is no unscored component left to render the
       line, so the branch would have been dead forever. Fixed upstream
       instead: `new-component.mjs` stamps `<DsaScore>` into the scaffold and
       `check-page-shape.mjs` now REQUIRES it, so the next component ships
       with the section and shows the honest "not yet scored" line until
       someone scores it. Red-proved: removed the call from `kbd.astro`,
       confirmed the string was gone, watched the gate name it and exit 1,
       restored byte-identical. (The exit code was checked separately —
       `| tail` had been masking it.) Original text follows.
       Found while wiring `date`. `DsaScore.astro`'s else-branch is documented
       (93.1) as a deliberate judgment call: "an unscored component renders an
       honest 'not yet scored' line, not nothing — absence should read as 'not
       done yet', not as an omission." Measured: **40 component pages, exactly
       14 render `DsaScore`, and those 14 are precisely the 14 that are
       scored.** The component is added to a page at the moment it gets scored,
       so the branch is unreachable in practice and 26 pages show nothing at
       all. Nothing user-facing is false — the section is simply absent — but
       the design intent 93.1 recorded is not realised, and it is a branch that
       cannot fire, which this project treats as a defect by default.
       **Accept:** either wire `DsaScore` into all 40 component pages so the
       26 unscored ones render the honest line as designed (edit by hand, not
       by regex — these are pages that mix live markup with copy-paste
       samples — and verify against the BUILT output that exactly 40 pages
       carry the section and 26 show the not-yet-scored text), or strike the
       claim from 93.1 and delete the dead branch. Do not leave it claiming
       behaviour it does not have.

       Superseded premise, kept for the record: **the DSA rubric no longer
       discriminates.** With Spacing resolved, **12 of 14 scored components
       read 100%**; the distribution is `{94%: 1, 95%: 1, 100%: 12}`, and
       the only two sub-3 dimensions left in the whole file are
       `amount.typography` and `data-table.typography`. Spacing was the
       one dimension that had ever varied, so removing it flattened the
       scale. The arithmetic is right — this is not an instrument defect
       — but a score that reads 100% for almost everything is publishing
       reassurance, not measurement, and these render on public pages.
       Note the trigger clauses (total < 80%, any dimension ≤ 1) have
       **never once fired** across 14 components. **Accept:** before
       scoring the remaining 23 (batches 3-7), either sharpen the
       dimensions so a known-weaker component scores visibly lower —
       pick one deliberately, e.g. the deprecated `date` at its 1/12
       surface score, and confirm the rubric ranks it below `money` — or
       record that the surface genuinely is uniformly aligned and change
       what the section publishes (a checkmark, not a percentage).
       **Blocks nothing**, but scoring 23 more components to 100% each
       spends the batches without learning anything.

Owner: start the loop on the rest of the surface — review, improve,
score — holding the direction: **simplicity, right presentation to the
user, make the complex simple**; grill in detail where a score comes
back low. This supersedes 92.6's one-line "score in batches" with an
executable plan.

**Unit of work = one sidebar FAMILY per wake**, not N components — the
numeric-family grills proved that family-level drift (inconsistent
affordances, one sibling contradicting another) is invisible when
components are scored alone and obvious when scored together.

**Order by blast radius** (how much a misalignment costs the user),
worst first, so judgment is freshest where it matters most:

| # | Family | Components | Why this position |
|--:|---|--:|---|
| 1 | Tables & lists | 7 | `data-table` is in 16+ screens; the densest surface an ERP user lives in |
| 2 | Data input | 6 | every entry screen; `form` is the likely first-read page |
| 3 | Navigation & layout | 7 | shell-level — a misalignment is on every screen at once |
| 4 | Feedback | 5 | states carry meaning; two-channel failures land here |
| 5 | Display | 7 | read surfaces; lower interaction risk |
| 6 | Actions | 3 | small, well-trodden (`button` sets the hierarchy rule) |
| 7 | Values | 2 | `kv` + the deprecated `date` |

**Per wake:** score every component in the family on the seven DSA
dimensions, each with a checkable citation; add entries to
`apps/docs/src/data/dsa-scores.json` (pages then render themselves —
93.1); record the batch in `.roundtable/scorecard-<family>-<date>.md`
with the reasoning; fix what is cheap and obviously right in the same
wake; queue the rest as numbered items.

**The grill trigger — deliberately two clauses, not one:**
1. **Total < 80%**, or
2. **any single dimension ≤ 1**, whatever the total.

The second clause is the one that serves the owner's stated direction:
a component can score 85% while carrying `Fit: 1` — prescribed in a
context the field matrix says belongs to a different design — and that
IS the "wrong presentation to the user" defect, hidden by an average.
A triggered component gets a full `/design-grill`, its findings triaged
like any other.

**Reading the three principles through the rubric**, so scoring stays
anchored to the owner's direction rather than becoming box-ticking:
- *simplicity* → Content (names meaning, not mechanism) and the
  composition question — could existing primitives already do this?
- *right presentation* → Fit (matrix-correct context) + Hierarchy
  (≤1 primary affordance).
- *make the complex simple* → complexity absorbed by the framework, not
  pushed into the consumer's mental model or markup.

**Accept (per family):** every component has a JSON entry with seven
cited scores; its page renders the section live (verified, both
themes); every trigger-hitting component has a grill report in
`.roundtable/` and its findings triaged; the batch's own record names
what was fixed in-wake vs. queued. **Exit (whole slice):** all 37
scored, no component left at a triggered score without either a fix or
a queued item carrying its Accept criteria.

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

Owner input, three items: *is there a better name? · can we have a scrolling
effect? · grill the design.* The grill ran first, because two of the three are
answered by it: `.roundtable/grill-object-page-design-2026-08-19.md`.

1. [x] **52.1 — The demo is a skeleton where every other pattern shows a screen.**
       Measured: **9 placeholder phrases** in the object-page demo, **0** in
       `record-detail`. Every section reads "Facet content for delivery — in a
       real screen this is a form section, a table, or a timeline." That is a
       wireframe, and the pattern recipe says a pattern page documents a SCREEN.

       **A claim in the grill was wrong and is corrected here.** It said the
       empty demo flattered 52.2's chrome ratio. It does not: the ratio is chrome
       against the VIEWPORT, so section content cannot move it — measured after
       this landed, still 259px/29% at 1440 and 274px/33% at 390, unchanged to
       the pixel. 52.1 is a docs-quality fix only, and 52.2's target is unaffected.

       **Landed 2026-08-19.** Accept: each section carries real ERP content of the kind it names —
       general information as a `kv`/form section, line items as a data table,
       delivery with the dates, approvals as a timeline. Reuse what
       `record-detail` already demonstrates rather than inventing new fixtures.
       **Do this BEFORE 52.2**, because it changes the measurement 52.2 targets.

2. [x] **52.2 — Scrolling effect: collapse the header.** — landed 2026-08-19
       While scrolled, sticky chrome consumes **259px of 900 (29%) at 1440** and
       **274px of 844 (33%) at 390**. A third of a phone screen is permanently
       navigation. Fiori collapses its object header for exactly this reason —
       this is not decoration.

       **The modern CSS for it is off our floor.** `animation-timeline` needs
       Safari **26** and is `preview` in Firefox, both above the shipped floor in
       `floor.json` — Chrome-only, i.e. exactly the "cosmetic enhancement that
       quietly opts out" the floor exists to prevent. Checked against the same
       `@mdn/browser-compat-data` the floor gate uses.

       Accept: `initAnchorNav` — which already listens to scroll — toggles a
       state attribute past a threshold; CSS transitions the header on a
       `--bo-motion-duration-*` token, so `prefers-reduced-motion` zeroes it for
       free and `check:motion` passes by construction. **Hysteresis is required**
       (collapse at one offset, expand at a smaller one) or the header
       flip-flops when the reader rests at the boundary. Collapsing must not
       move the anchor bar out from under a finger mid-tap.

       Target, measured after 52.1 lands: a scrolled phone screen spends
       **under 20%** on chrome, down from 33%. An executable claim asserts the
       collapse, the hysteresis, and that reduced-motion zeroes the transition.

       **Landed 2026-08-19. Target met: 32% → 19% at 390, 29% → 16% at 1440.**
       Zero new CSS — the header facts sit in `.bo-widget__collapse`, the element
       collapsible cards already use, driven by scroll instead of a click.

       **It found a shipped framework bug on the way.** A closed
       `.bo-widget__collapse` did not collapse to zero: it stopped at the child's
       padding, measured `grid-template-rows: 32px` computed while claiming to be
       closed. A bare `0fr` track has an `auto` minimum, so it cannot shrink
       below the child's min-content height, and `min-block-size: 0` does not
       help because padding is not content. Now `minmax(0, 0fr)` — and that fix
       is what took the ratio from 23% to 19%. It affects every collapsible card,
       not just this page.

       **An existing claim caught a real interaction bug.** With the collapse in,
       clicking an anchor scrolled, collapsed the header mid-flight, shifted the
       content up ~111px, and landed the reader on the section ABOVE the one they
       clicked. `scroll-margin-block-start` had been sized for the EXPANDED
       header; it is now sized for the collapsed one, which is the state that
       always exists after a jump. A 2px residual at 1440 then needed a named
       12px tolerance on the spy line.

       **Hysteresis had to be redesigned, and the probe was dead twice before it
       said so.** The first design compared the nav's bottom edge to the first
       section's top — both of which the collapse MOVES, by ~111px — so
       collapsing changed the input that caused it and the header oscillated; a
       40px dead band could not survive feedback three times its size. The
       decision is now made on **scroll offset**, which the collapse does not
       change. Measured proof: jiggling at the boundary moved 121px under the old
       design and 10px under the new one.

       The probe that found it could not fail twice first: version one used
       `window.scrollBy` on a page that scrolls inside the shell's main element,
       so the reader never moved; version two parked far past the threshold,
       where no jiggle can flip anything. It now walks until the state first
       flips and jiggles around that exact point — and red-proving it by removing
       the dead band produces `["closed","open"]`.

3. [x] **52.3 — DONE 2026-08-23 (owner: "do what is good for long
       term" = the standing recommendation).** Slug kept; title renamed
       to "Object page — a long record, in sections" and the opener now
       leads with the interaction ("A long record, navigated in sections
       instead of scrolled as one feed") before the who/when. Sidebar
       label stays the short, searchable "Object page". Verified in
       built HTML (title + h1), full docs build green. Original
       trade-off table kept below for the record.
       *(original entry follows)*
       This project's bar is "write for a first-time user: plain verbs".
       "Object page" is SAP vocabulary — precise for a Fiori user, opaque
       otherwise — and it names the thing shown rather than what makes the
       screen different: it has sections you navigate.

       | option | for | against |
       |---|---|---|
       | keep `object-page` | what an ERP audience searches for | jargon; names the object, not the interaction |
       | `sectioned-record` | names the interaction; sorts beside `record-detail` | invented; nobody searches it |
       | merge into `record-detail` | one screen one page | buries the canonical ERP floorplan |

       Recommendation: **keep the slug, change the human title** to name the
       interaction ("Object page — a long record, in sections"). Accept: title
       and opener name the interaction; slug unchanged so links and search hold.

4. [x] **52.4 — Two patterns, one screen? NO MERGE, and here is the number.**
       Rendered-block overlap: `record-detail` 18 blocks, `object-page` 13,
       **10 shared**. The entire difference is `bo-form-actions` and
       `bo-pagination` — an action bar and an anchor bar (`bo-amount` is
       incidental). Both openers describe the detail screen for a purchase
       order.

       The distinction is real but *named wrong*: the page draws the line at
       length ("too tall to take in at once"), and length is not a pattern. The
       interaction is what differs — you navigate between sections instead of
       scrolling one feed. Fixed by sharpening the opener (52.3), not by merging:
       collapsing this into `record-detail` would bury the canonical ERP screen
       inside another page.

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

Grill: `.roundtable/grill-wishlist-2026-08-18.md`. Four requests; **two turned
out to be already-built-but-unproven rather than missing**, and the fourth was
already decided against in DESIGN.md — but the alternative that decision
promised was never written.

1. [x] **30.1 — Scrollable tabs proven; affordance PARTLY met** (2026-08-18) —
       **3 of 4 Accept criteria met, and the 4th is not achievable in CSS.**
       Reported as partial rather than ticked clean.

       MET: a demo that genuinely overflows (9 tabs in a 34rem strip — 315px of
       overflow at 1440, 517px at 390, strip stays one 39px line, no wrap, no
       clip); keyboard cannot strand focus off-screen (arrowing to the 9th tab
       scrolls it fully into view — verified at 1440 and 390 in both themes);
       and two executable claims, both red-proved with the injection confirmed
       in the BUILT artefact (`check:claims` 25 -> 27).
       **Cost line: 0 components, 0 new selectors, 2 declarations — under the
       <=1-selector budget.**

       NOT MET — **a visible overflow affordance, and no CSS delivers one.**
       Three rounds measured: `scrollbar-color` did nothing visible, the
       `::-webkit-scrollbar` pseudo-elements did nothing either (offsetHeight -
       clientHeight stayed 1px in every variant, and a screenshot showed a strip
       cut mid-tab with no scrollbar at all). macOS overlay scrollbars stay
       hidden until something moves and CSS cannot override that. The standard
       properties are kept because they cost nothing and ARE the affordance on
       Windows and Linux, but they are not relied on, and the docs page says so
       instead of pretending.

       **This reverses my own W1 decision, on evidence.** I ruled arrows out on
       the grounds that they add discoverability but not capability, because a
       persistent draggable scrollbar already gives a wheel-mouse user a
       control. That premise was wrong: on macOS there is no visible scrollbar
       to drag, so arrows are the only affordance that depends on no OS setting.
       Raised as 30.1b rather than smuggled in, because arrows exceed this
       item's budget.

1b. [x] **30.1b — Overflow affordance shipped as a fade, arrows REFUSED**
       (2026-08-18) — the affordance 30.1 could not deliver now exists, and it
       is not the arrows this item was opened for.

       Re-grilling the cost is what changed it. Arrows needed either an overlay
       background — the same colour assumption that killed the gradient fade,
       since the list sits on canvas in the docs and on a surface inside a card
       — or restructuring consumer markup into an injected wrapper. Both to
       duplicate what shift+wheel, a trackpad swipe and the arrow keys already
       do. A **`mask`** has no colour to assume: it fades to transparency and
       composites over whatever is behind it.

       Shipped: `mask-image` on three `data-overflow` states, set by
       `initTabs()` from a `ResizeObserver` (container width, not viewport) plus
       a passive scroll listener — `end` at the start, `start` at the end,
       `both` in the middle, and **no attribute at all when the strip fits**, so
       a short strip is never permanently dimmed. Dropped entirely under
       `forced-colors`, where costing contrast to give a hint is the wrong
       trade (the gate now counts **19** live rules, up from 18).

       **Cost line: 3 selectors + 1 forced-colors block, ~40 lines of behavior,
       0 DOM injected, 0 markup changes for consumers** — against arrows' 2
       selectors *plus* injected wrapper *plus* restructuring. Verified at 1440
       and 390 in both themes; `check:claims` 27 -> 28, red-proved with the
       injection confirmed in the built artefact.

0. [x] **30.0 — CLOSED 2026-08-23, both halves answered.**
       - *"check out overview. the sidebar menu."* — **ANSWERED 2026-08-23:
         reading (b)**, a new ERP overview pattern with a module sidebar.
         Shipped the same day as `/patterns/suite-home` (123.2), alongside
         the app-frame pattern that hosts it. Open five days; closed by the
         owner's seven-answer message.
       - *"horizontal tabs"* — **ANSWERED 2026-08-18: vertical tabs** (reading
         (a)). Queued as 36.1; this half of 30.0 was closed then.

2. [x] **30.2 — Field editor pattern** (2026-08-18) —
       `/patterns/field-editor`, one row per FIELD with the input each type
       deserves: text, native date, select, money (currency + amount),
       quantity stepper, checkbox. The SM30 master-data case, and the single
       screen that exercises every typed input at once.

       **Pass condition met exactly: 0 changes to framework CSS**, and all 29
       `bo-` classes the page uses were verified to exist in the shipped CSS —
       so nothing was invented either. It is the data table with
       `data-row-edit` plus ordinary form primitives; there is deliberately no
       "field editor" class to learn.

       Predicted in the triage that this would surface real bugs, and it did —
       a design one. With `--seamless` on only the text fields, three fields
       read as plain text while money and quantity read as boxes, which tells
       the user the boxed ones are editable and the others are not: exactly
       backwards. Fixed by applying the seamless variant to every field
       (`.bo-input--seamless` composes onto `.bo-money__amount` and
       `.bo-quantity__input` — still 0 new selectors).

       `check:claims` 28 -> 29, red-proved with the injection verified in the
       built behavior. The claim first failed because it dispatched `change` on
       a text input: `initRowEdit` marks text dirty on **input** and only marks
       selects on change, so the probe was wrong rather than the page.

2b. [x] **30.2b — Row-action labels finished on `/patterns/editable-grid`**
       (2026-08-18) — **10 of 10 Save buttons now carry a per-row
       `aria-label`**, up from 6. Three live blocks converted to
       `RowEditActions`; the code sample stayed literal HTML (a component call
       there would be uncopyable) and gained the labels so it teaches the right
       thing.

       Done by hand as the item demanded, after last wake's regex attempt put a
       component call inside the sample and labelled rows with other rows'
       names. Each label was then verified against its row's actual content
       rather than assumed: LINE-1 -> "line 1 (Steel bracket)" with value
       "Steel bracket, 40mm", LINE-M1 -> "Hydraulic pump", and the
       `data-row-id=""` row -> "new line", which turned out to be a `<template>`
       cloned when adding a line — so it is correctly absent from the live DOM.

       Two scares, both measured away rather than argued away: remove buttons
       looked like 5 -> 4 (it was source-lines against dist-occurrences; source
       is 5 both sides), and the page grew 42px — traced exactly to the `<pre>`
       sample going 1620px -> 1662px from the two added label lines. Row heights
       are byte-identical to HEAD (75/53/54...), so the conversion is
       layout-neutral.

2c. [x] **30.5 — `Getting started > Overview` removed** (2026-08-18, owner
       feedback) — the answer to "do we still need it?" was no, for a stronger
       reason than redundancy: `/` does not use the `Gallery` layout, so the
       landing page ships **zero sidebar markup** where a docs page has 3.
       That entry ejected the reader out of the docs shell, and the label
       promised a docs overview while delivering a marketing hero
       (`<h1>CSS for screens`). The page was already reachable from every docs
       page via the always-present navbar brand.

       Verified after: 0 Overview links in the sidebar, brand link still
       present, the group's count badge recomputed 7 -> 6 on its own, "Getting
       started" now opens on **Installation** — the actual first step — at 1440
       and 390 in both themes, and 7194 links still resolve. Visual suite passed
       without a rebaseline, since only the count digit changed.
       **Cost line: -1 nav entry, 0 selectors, 0 CSS, 0 behaviors.**

3. [x] **30.3 — 50-column stress case** (2026-08-18) — a 10x50 table on
       `/components/data-table`, next to the rows-at-scale section it is the
       counterpart to. **Cost line: 0 selectors, 0 CSS, 0 behaviors** — it uses
       the existing `.bo-data-table--sticky-col`.

       Claims tested rather than admired. The frozen column holds at
       `left: 1px` through **3046px of horizontal scroll** at 1440 (3632px at
       390) and stays opaque in both themes; the header stays `sticky`; the page
       itself never overflows because the scroll lives in the container.
       SC 2.5.8, the 150%-zoom layout pass and axe all stay green with 50 dense
       header cells. `check:claims` 29 -> 30, red-proved by flipping the frozen
       column to `position: static` with the injection confirmed in the built
       CSS.

       **The stress case earned its keep by finding something.** The container
       is focusable and arrow keys scroll it, so nobody is stranded behind fifty
       tab stops — but each press moves ~40px, putting the fiftieth column
       **~76 presses away**, and `End` does nothing because the container scrolls
       only horizontally. Reachable is not usable, and the page now says so in
       those words instead of claiming keyboard access is fine.

       Carries the column-chooser guidance the triage required: fifty visible
       columns is a symptom, the answer is per-role column choice plus saved
       views, and "all fifty at once" is a report or an export rather than a
       screen.

4. [x] **30.4a — Large-list guidance written** (2026-08-18) — **extended
       `/concepts/scale` rather than adding a page.** That page already said
       *why* there is no virtualiser; what was missing was what to do instead,
       which is the half that turns a documented refusal into an answer.

       Two sections: a decision table, and the token-themed AG Grid recipe
       DESIGN.md promised on 2026-08-17 and nobody wrote. The table's point is
       that **two of its rows carry the same row count and different answers** —
       the deciding question is not "how many rows" but what the user is doing
       with them. Searching wants filters and page numbers; scanning wants the
       next batch. Reaching for windowing when the real problem is a missing
       filter is the common way to make a screen slower and less accessible at
       once.

       The recipe maps AG Grid's CSS variables onto ten shipped tokens, **each
       verified to exist in the built CSS** — teaching an invented token would
       hand an adopter a broken theme — and states what the swap buys (virtual
       scroll, cell editing) against what it costs (a JS render loop, a second
       theming system, and the accessibility bill windowing always runs up).
       `DESIGN.md` now points at it, with a note that the promise sat unwritten
       for a day, which is how a documented decision quietly becomes no answer.

       **Cost line: 0 selectors, 0 CSS, 0 behaviors, 0 new pages.**

4b. [x] **30.6 — NOT REPRODUCED; my own trend call was wrong** (2026-08-18).
       Raised last wake on three ascending step-time samples (267s, 273s, 282s)
       read as gate growth. Two more runs settle it: **282 -> 261 -> 257**.
       There is no growth — 282s was an outlier and ~265s is the level. Wall
       time agrees (290 -> 267 -> 265, budget 288).

       I over-fitted to three ascending points, having just corrected a
       *different* misreading of the same metric in the same wake. Closing it
       unbuilt is the right outcome: optimising a gate that is not slow would
       have cost coverage for nothing, which is precisely what 28.1's Accept
       criteria were written to prevent.

       **Process fix applied**, so this cannot recur by judgement alone: rule 4
       now requires the metric to breach on **two consecutive runs**, since a
       single sample cannot distinguish a trend from noise on a shared runner.

6. [x] **30.7 — Rendered-artefact rule written, and the worst case gated**
       (2026-08-18) — CLAUDE.md gains "A bulk edit is verified against the
       RENDERED artefact", with the three failures that earned it and the
       specific instruction that mixed live-markup/code-sample files are edited
       **by hand, one block at a time**.

       Went past the item's Accept on purpose, because a rule that is only
       written is a rule that gets forgotten: `check:imports` now asserts every
       relative import resolves **case-exactly**. This is the one class a
       developer on macOS cannot catch by running the code — APFS is
       case-insensitive, so `./serve-DIST.mjs` loads `serve-dist.mjs` and every
       local gate passes while Linux CI dies with ERR_MODULE_NOT_FOUND.

       Red-proved by reintroducing the exact bug that broke CI: the boost gate
       **ran and passed** with it in place ("imported fine — macOS resolved
       it"), while the new gate named the file and the wrong spelling. It runs
       first in the build chain, since a broken import invalidates everything
       downstream. **Cost: ~1 second, 73 imports checked, 0 selectors, 0 CSS.**

5. [x] **30.4b — DONE 2026-08-22.** `initWindowedList()` shipped
       (behavior + `/concepts/scale` rewrite, commit a1239e0) and
       dogfooded as po-app's `/movements` (50,000 deterministic rows,
       commit b5a3081). The Accept's red-proof — scroll deep, scroll
       back, no scroll jump, no lost selection — is permanent gate
       coverage in `check-po-app` (18/18) and **caught four real bugs
       before it ever passed**: per-transition eviction exempted
       early-exiting chunks forever (now a visible-set sweep); the rem
       density token read as px left spacers 16x short; IO root:null is
       clipped by an inner scroll container so re-requests only fired
       on literal visibility (root = nearest scrolling ancestor now);
       and the first scrollParent matched the horizontally-scrolling
       table container (root test now requires vertical clipping).
       Q4 of the grill amended on the record: spacer height is measured
       from ONE real row at bind (32.5px real vs the 30px token —
       border-box extras made token math jump-guaranteed), keeping the
       decision's intent (zero layout reads during the eviction path).
       Final numbers: spacer 3250 == 100 x 32.5, anchorShift 0,
       scrollShift 0, aria-rowcount 50001, mid-chunk aria-rowindex ==
       offset + 2. **Accept met.** Original item below.

       **[OWNER ANSWERED]** Users search and act rather than read 50,000 rows,
       and the ask is that the server serves chunks while the client releases
       memory for what is not visible, via HTMX, with this framework supplying
       the UI half.

       **What already ships, so the gap is narrower than it looks:**
       forward chunk loading is `load-more.ts` (intent-only, plus an
       `IntersectionObserver` on `data-load-more-auto`), and `data-grid.ts`
       already writes `aria-rowindex`/`aria-colindex`. Missing: eviction of
       off-screen chunks, height-preserving spacers, re-request on approach,
       and `aria-rowcount` carrying the TRUE total rather than the loaded
       subset.

       **Why this is not the grid engine DESIGN.md refused:** it windows ROWS
       in a read/act list. It does not own cell editing, column virtualisation
       or a grid API. It works because rows are fixed-height — which
       `DESIGN.md:56` already maintains deliberately.

       Accept: a documented pattern plus one behavior that keeps N chunks
       around the viewport, swaps evicted chunks for a spacer of **identical
       measured height** so scroll position cannot jump, re-requests on
       approach, sets `aria-rowcount` to the server total, and keeps selection
       in a Set outside the DOM so windowing a selected row out does not lose
       it. Red-proof: scroll deep, scroll back, assert no scroll jump and no
       lost selection.

       **Costs that must be written on the page, not discovered by an adopter:**
       browser find-in-page cannot find unloaded rows; printing gets only what
       is loaded; and both are unavoidable consequences of windowing rather
       than defects. They are also the strongest argument for filtering
       server-side first, which stays the recommended default.

       **Cost line: +1 behavior — the largest JS addition this framework would
       have made.** Worth stating plainly, and worth owner confirmation on
       scope before build. **Owner confirmed 2026-08-22** — grilled first
       (design tree, 8 questions), settled below.

       **DESIGN.md reopened, on the record, not silently** (2026-08-22): the
       "no client-side row virtualiser" refusal (2026-08-17) predates 30.4a's
       own search-vs-scan distinction. Narrowed rather than reversed — it
       still fully applies to search workflows (filter server-side); this
       item is the scanning case 30.4a's own table argues windowing
       legitimately serves. See DESIGN.md's "Narrowed, not reversed" note.

       **Settled architecture (grill, 2026-08-22):**
       - **Does not compose with `data-grid-nav`** (v1). That behavior's
         `aria-rowindex` is DOM-position-derived, an assumption windowing
         breaks (a chunk at server rows 5000-5099 would get DOM-order
         indices 1-100). Documented scope boundary, not silently broken.
       - **Does compose with row-select/bulk-actions**, via a minimal hook:
         `data-table.ts`'s `update()` checks a `data-selected-count-override`
         attribute before its own `:checked` DOM query, so non-windowed
         tables are byte-for-byte unchanged. Deferring this would defer a
         real cost, not avoid it — "search and act" means bulk-acting on
         selected rows, and retrofitting later means either a breaking
         change or two permanently-diverging selection paths.
       - **Chunk unit**: one `<tbody data-chunk-id>` per server-fetched
         chunk — reuses the framework's existing grouped-table precedent,
         gives eviction a clean single swap target.
       - **Spacer height**: computed (`rowCount × var(--bo-density-row-height)`),
         never measured via `getBoundingClientRect` — measuring forces a
         layout read on the exact operation (eviction) this feature exists
         to make cheap.
       - **Event contract**: extends `load-more.ts`'s existing
         `bo:table-load-more` with an optional chunk-offset detail, rather
         than a second event type — non-windowing consumers see identical
         behavior.
       - **Row count contract**: a `data-table-total-rows` attribute on the
         container, set once at initial render — matches the framework's
         attribute-driven contracts everywhere else, no header-reading code.
       - **No "load everything" escape hatch in v1** — the find-in-page/print
         costs stay documented limitations pointing at server-side filtering,
         not something engineered around for a need nobody has stated yet.
       - **Bidirectional windowing** (evict and re-request in either
         direction) — the Accept's own "keeps N chunks around the viewport"
         is viewport-centered, not append-only; `load-more` already covers
         the simpler forward-only case for consumers that don't need this.

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

2. [ ] **OWNER CALL — direction. STILL OPEN, but its precondition is now met
       (2026-08-21):** the release is cut as 0.3.0 and awaits only the owner's
       push + GitHub Release. Once it lands, the recommended default below
       becomes actionable rather than hypothetical — there is finally a
       published package recent enough for adopter feedback to be about the
       current framework. The choice itself remains structurally an owner call.

       Recommended default: **ship 0.2.0 first,
       then choose from real adopter feedback rather than from this room** —
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

## OPEN — Pages deploy blocked, owner-side (2026-08-18)

**The published site is four commits stale** (live: `35c38eb`/27.6,
last-modified 17:25 GMT). `actions/deploy-pages@v4` has returned **HTTP 503 on
four consecutive commits** — `162553b`, `c02f663`, `effe7a9`, `47f7ea0` — always
at "Creating Pages deployment". CI itself is green on every one of them; only
the deploy step fails, so nothing is wrong with the build.

What I checked, because the action's own error asks: **githubstatus.com reports
Pages, Actions and API Requests all operational**, so this is not a
broadly-reported outage, which is what I assumed for the first two failures.
The repo's Pages config is correct and unchanged (`build_type: "workflow"`,
public, HTTPS enforced), and the same workflow deployed successfully at 17:25.
`GET /repos/.../pages` reports `"status": null`. Re-running via `gh run rerun`
is itself refused with 503, so it cannot be retried from here.

Accept: a deploy run completes and the live site serves the collapsible-nav
+ launcher-marks + print-rule build. **Owner action** — this needs repo
settings/GitHub support access; there is no code change that fixes it. Retry
`gh run rerun <id> --failed` on the newest "Deploy docs to Pages" run once
Pages accepts deployments again.

## Slice 26 — from the Objective grill (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 25 — carried forward (2026-08-17 reconciliation)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 24 — triaged from "ROADMAP DIRECTION v1.2" (external review, 2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Done

### Slice 1 — Foundation + core components
Workspace + PostCSS/tsc tooling, `@layer` skeleton; tokens (palette / semantic /
density / dark hooks); reset + layout primitives; button, forms, badge, dense data
table, navbar + sidebar nav, dialog; opt-in `htmx.css`; Astro docs gallery.

### Slice 2 — Interaction & filtering
Tabs, dropdown (popover), alerts/toasts, filter bar + chips + saved views, pagination
+ table footer, form sections, off-canvas drawer, inline edit, dark-theme toggle.
Two design-grill gates worked (delegation rewrite, FF 128 floor, à-la-carte
restructure, contrast fixes).

### Slice 3 — ERP workflows & dashboards
Status timeline, audit trail, dashboard stat tiles + widget grid, wizard stepper,
theming guide + versioning policy, print/report layer. Grilled; container-naming
build rule enforced.

### Slice 4 — Records & approval
Byline, ordered list (mono/`--plain`/editable rows), record-type badge, small &
danger-ghost buttons, widget band footer; composed in the record-detail pattern.
Grilled and decomposed into small general components per the "one component, many
settings" principle.

### Engineering & docs discipline
- 7 build-enforced gates: named `@container`, contrast threshold **+ coverage**,
  behaviors-vs-`.d.ts`, dist link resolution, stylelint naming, 11 behavior tests,
  page-shape (every component page has its opener/`ClassRef`/demo/`ApiTable`/
  `Related`/sidebar entry — `check-page-shape.mjs`, added in Slice 5).
- Generated-from-artifact docs: API tables, contrast tables, class index, `llms.txt`,
  quick-reference cheat sheets, AA-per-component — none hand-maintained, all CI-gated
  against drift.
- CI + GitHub Pages deploy (gated on tests); Docker consumer app; Podman docs image.
- Four adversarial multi-seat design reviews, every gate finding fixed or ledgered.

### Slice 5 — Docs UX polish + ERP data-entry fields
Fixed app chrome (independent-scroll shell) + responsive nav drawer + full-width
landing; the theme-switch-flash P0; ERP Amount field; data-table column alignment
(+ a latent specificity bug fix); Cmd/Ctrl+K command palette; sidebar scroll
persistence; the opt-in Motion module (8 reduced-motion-safe animations); the
Ledger teal brand palette + SVG logo + favicon; a section-by-section docs
simplicity pass; the `new:component` scaffold generator + page-shape build gate
(gate 7); copy buttons + the `Demo` wrapper component (site-wide, satisfying the
"Docs UX cluster 2" ask — full migration of all 17 component pages onto the
`Demo` wrapper specifically is optional polish, not tracked further since
hand-authored demo sections are already gate-compliant and already copyable).
Full detail: `.roundtable/loop-log.md`.

## Done — Slice 6: Component depth + a11y hardening (published as 0.1.x on 2026-08-15)

Reconciled 2026-08-14 (Roadmap loop, after the ARIA-grid Explore graduation).
Ordered by value × effort; `npm publish` is intentionally last — it's
owner-gated, not something a loop iteration can close.

**Slice 6 is functionally complete** (2026-08-14) — every item below is
`[x]` except the owner-gated publish. Per the dispatcher's own rule, a
slice closing is the trigger for the **Objective** loop (grill the product
vision, decide what Slice 7 should actually be) — attempted this wake, but
`/round-table` is reserved for explicit user invocation and can't be run
autonomously (`disable-model-invocation`); the dispatcher correctly did
NOT attempt to replicate that workflow by other means. **Falling back to
Explore** per the priority order instead (backlog empty of Continue-
sized work). One idea graduated below (item 19) — small, independently
justified, doesn't need the deeper product review to be worth building.
**Objective review itself stays open** — ask the user to run `/round-table`
when they want Slice 7 properly scoped; until then, new items land here
as they're identified, same as Slice 6's own items 12-18 did mid-slice.

**Queued (priority order)**
0. [x] **P0 — navigation flash/flicker, real root cause: whole-page reload,
       not a paint-timing issue.** Two earlier passes fixed real but
       secondary bugs (theme applied too late; no `color-scheme` hint for
       the browser's pre-paint default) without touching the actual
       mechanism. 2026-08-14 user follow-up named the real symptom
       precisely: **"kind of whole screen refresh, instead of replacing
       the main area."** That reframed it correctly — this is a static
       multi-page site, so every sidebar click was a full document
       navigation: header, sidebar, everything tore down and rebuilt on
       every click, independent of whether colors matched.
       - **Fix (confirmed with the user first — new runtime dependency +
         navigation-model change, not a CSS tweak):** `htmx` `hx-boost` on
         `<body>` (Gallery.astro), targeting/selecting `#main-content`
         (the `<main>` element) — only that swaps on an internal link
         click; header, sidebar, and scripts now persist. `htmx.org` added
         as a dependency of the **docs app** (`apps/docs/package.json`)
         only — the shipped `@busy-office/ui` package stays at its
         genuine zero runtime dependencies.
       - Had to hand-rebuild what a full reload used to give for free:
         sidebar `aria-current` (was server-rendered per page; now synced
         from `location.pathname` on every `htmx:afterSwap`), the
         right-rail TOC + copy-button injection (re-run per swap, same
         event), scroll-to-top on the main pane. Component pages' own
         inline `<script>` blocks (`initDataGrid()`, `initCollapsibleCards()`,
         etc.) needed **no changes** — they live inside the swapped
         region and htmx re-executes script tags in swapped content by
         design; document-delegated behaviors (tabs, dropdown, dialog,
         alerts) needed **no changes** either, since `document` itself is
         never touched by a partial swap.
       - Found and fixed a real regression the new model introduced: the
         mobile nav drawer and Cmd/Ctrl+K palette live *outside*
         `#main-content`, so unlike everything else they now persist
         across a swap instead of resetting — without a fix, navigating
         via a link inside the drawer left it hanging open. Both now close
         explicitly on `htmx:afterSwap`.
       - TOC hash-links (`#heading-id`) excluded from boosting
         (`hx-boost="false"` on `#toc-nav`) — same-page anchors must stay
         native scroll-to-anchor, not a navigation.
       - **Verified live**, extensively, via the bind-mounted Podman
         container: tagged the header/sidebar DOM nodes before a boosted
         click and confirmed the SAME nodes (not new ones) after — genuine
         partial swap, not a reload made to look like one. Confirmed
         title/URL/`aria-current` all update correctly. Confirmed
         `initDataTables()` and `initDataGrid()` both re-initialize
         correctly on a swapped-in data-table page (select-all works,
         `role="grid"` present). Confirmed TOC/copy-buttons repopulate.
         Confirmed a hash-link click doesn't trigger a boost. Confirmed
         dark theme survives navigation (trivially now — `<html>` is never
         touched). Confirmed `Tabs` (document-delegated) still works.
         Confirmed the drawer-close fix. Zero console errors across all of
         it. All gates green, 20 tests pass.
       - **Follow-up round (same wake, before moving to a new item):**
         click-tested the previously-flagged Pagefind gap directly instead
         of trusting the "should work" assumption — it didn't. Two real
         bugs found and fixed:
         1. `import 'htmx.org'` (ESM build) only default-exports `htmx`; it
            never sets `window.htmx`. Fixed: `import htmx from 'htmx.org';
            window.htmx = htmx;` — needed so other scripts can call
            `htmx.process()` at all.
         2. Even with that fixed, `htmx.process(container)` does NOT
            retroactively re-derive an ANCESTOR's `hx-boost` for newly-
            added descendants — that inheritance is only computed at the
            initial page-load scan (confirmed empirically by testing both
            ways, not assumed from docs). Fixed: a `MutationObserver` on
            the Pagefind results containers (`#docsearch`, `#cmdk-search`)
            sets `hx-boost="true"` explicitly on each fresh result link
            before calling `htmx.process()`.
         Re-verified after both fixes: tagged the header before a search
         + click and confirmed it persists, URL/title/sidebar
         `aria-current` all update correctly — same standard as every
         other boosted path. Also re-ran the full component-page sweep
         (Dialog, Alerts/toasts trigger+dismiss, Dropdown) after the
         earlier hx-boost commit specifically to broaden coverage beyond
         the 2 pages tested there — all confirmed working, zero console
         errors, gates green, 20 tests pass.
1. [x] **Skeleton / empty / error states** — shipped as two components (not
       three classes): `.bo-skeleton` (`--circle`/`--block` shimmer
       placeholders, `aria-busy` is the programmatic channel) and `.bo-state`
       with an `--error` modifier for empty/error — one component, two
       settings, per the standing "one component, many settings" principle,
       rather than the literal `.bo-empty-state`/`.bo-error-state` split
       first sketched. Icon *shape* differs per state, not just color. Both
       continuous-loop shimmer, guarded by an explicit reduced-motion
       override (not duration-token-driven, same reasoning as
       `.bo-motion-spin`). Docs: `/components/state-patterns` (one page, all
       three states, via a shared `PAGE_SLUG` alias — which turned out to be
       tracked in **three** separate places: `extract-api.mjs`,
       `check-page-shape.mjs`, `gen-llms.mjs`; updated all three, worth
       consolidating in a future Standardize pass). Verified live via Podman
       (`bo-docs-run`): light + dark at 1440px, and narrow-viewport reflow
       confirmed (no overflow/clipping). All 7 gates green, 11 tests pass.
2. [x] **Data-table ARIA grid pattern** — shipped as a new opt-in behavior,
       `initDataGrid()` + `data-grid-nav` (packages/core/src/js/behaviors/
       data-grid.ts), separate from `initDataTables()` so selection/sort are
       untouched for every existing consumer. Sets `role="grid"` on the
       table — `td`/`th` get their `gridcell`/`columnheader` roles
       *implicitly* from the HTML-AAM mapping once the table has that role,
       so no per-cell markup is needed. `aria-multiselectable` (when the
       table has row-select checkboxes), 1-based `aria-rowindex`/
       `aria-colindex` (supplementary — this table is never virtualized, so
       they're not load-bearing the way they are for a virtualized grid, but
       included per the accept criteria). Two-level roving tabindex per the
       APG "Data Grid" (interactive-widgets) example: one Tab stop for the
       whole grid, arrow keys move the cell cursor (clamped, no wrap, incl.
       Home/End and Ctrl+Home/Ctrl+End), Enter focuses a cell's one
       interactive descendant (checkbox/button/input), Escape hands focus
       back to the cell. `aria-selected` synced on the row from the
       checkbox's `change` event. Docs: a new "Keyboard grid navigation"
       demo section on `/components/data-table`. 5 new behavior tests (16
       total, all pass) plus live verification in a real Chromium DOM via
       Podman — role/multiselectable/rowindex, focus mechanics (ArrowRight
       moves the cursor, Enter/Escape into-and-out-of the checkbox,
       aria-selected on check) all confirmed against the actual browser, not
       just jsdom. **Not done this tick:** an actual VoiceOver verbalization
       pass — that's Slice 6 item 5 (Runtime a11y pass); this item shipped
       the correct ARIA semantics and keyboard mechanics but hasn't been
       listened to yet, so "AA outright" isn't claimed until that pass runs.
3. Slice-4 continuation:
   - [x] **Avatar byline** — `.bo-byline__avatar` (optional part): initials or an
         `<img>`, em-sized so it scales with `--compact` automatically instead of
         its own size modifier. Scoped via `:has(.bo-byline__avatar)` so a
         plain-text byline (the common case) gets zero layout change. Always
         `aria-hidden` — decoration, the name is already text in the byline.
         Verified live (Podman, light + dark).
   - [x] **Collapsible cards** — extends `.bo-widget` (not a new component):
         `.bo-widget__collapse` wraps `__body` using the same
         grid-template-rows 0fr/1fr technique as the Motion module's
         `.bo-motion-collapse` (duplicated locally — a component shouldn't
         have to import the opt-in Motion module for this; the tokens are
         core). New opt-in behavior `initCollapsibleCards()` +
         `data-collapse-trigger`: toggles the trigger's `aria-expanded` and
         the panel's `data-state`, the two-channel contract (chevron
         rotation is decoration). No `data-state` at all defaults to open —
         degrades to a plain widget without the behavior wired up. Docs: new
         "Collapsible" demo on `/components/dashboard`. 2 new tests (18
         total, pass). Verified live: light + dark, toggle confirmed via
         screenshot (chevron rotates, panel visibly collapses).
   - [x] **`.bo-composer`** — how a new `.bo-audit` entry gets *written*, not
         just read. Layout-only, composing existing primitives rather than
         inventing controls: `.bo-byline__avatar` for the "who", a plain
         `.bo-input` textarea (already styles `textarea.bo-input`), an
         actions row. Lives in `approval-workflow.css` next to
         `.bo-timeline`/`.bo-audit` (the thematic file, not a new component
         dir). Docs: new demo section on `/components/approval-workflow`,
         inserted sample-before-code per the ordering audit two ticks ago.
         Verified live: typed into the textarea, confirmed it persists
         through a theme switch, both themes render correctly.

Slice-4 continuation is now fully done (avatar byline, collapsible cards,
`.bo-composer` — all three shipped and verified).
4. Filters/detail-forms:
   - [x] **Saved-view persistence** — the Slice 2 saved-views markup was
         static (hardcoded active chip, hardcoded field values); the real
         gap was that nothing DERIVED either from the URL. New opt-in
         behavior `initSavedViews()`: populates `.bo-filter-bar` fields from
         `location.search`, and marks whichever `[data-saved-views]` link's
         own querystring matches the current URL `aria-current="page"`
         (clearing it from the others). Doesn't invent a storage backend —
         views stay server-rendered links, this only keeps the UI honest
         about which one is active. 2 new tests (20 total, pass). Verified
         live: navigated with `?status=pending` in the URL, the select
         showed "Pending" and the matching chip was active — clicked
         "Overdue", URL/select/active-chip all updated together, both
         themes.
   - [x] **Multi-column detail-form patterns** — new pattern page
         `/patterns/detail-form`, the edit-screen counterpart to
         `/patterns/record-detail`. The CSS was already complete and
         already demonstrated on the Forms component page
         (`.bo-form-section`/`.bo-form-row`/`.bo-form-actions`); the actual
         gap was a missing COMPOSED pattern — a full multi-section purchase-
         order edit screen (header + payment/delivery fieldsets, a
         line-items table with seamless inline-edit inputs, a sticky action
         bar), matching the shape of the other 3 pattern pages. Zero new
         CSS. Verified live: 3-column layout at 1440px in both themes;
         forced a 300px container width and confirmed via computed layout
         that all 3 header fields stack into one column each (the
         `auto-fit` grid genuinely collapses, not just claimed to).

Slice 6 item 4 is now fully done (saved-view persistence + multi-column
detail-form patterns).
5. Runtime a11y pass — split into what this environment can and can't
   actually do (corrects an earlier assumption: VoiceOver was thought
   checkable here; it isn't — no AppleScript/System Events/Accessibility
   API access is available to drive it, only browser automation):
   - [x] **200% zoom geometry** — simulated via `document.documentElement.
         style.zoom` (real `Ctrl/Cmd +` shortcuts aren't scriptable through
         this session's browser tool either). Found and fixed a REAL bug:
         `.bo-navbar` had a fixed `height: 3rem` with no wrap, so at 200%
         zoom the Theme select was rendered fully off-screen (`right: 1189px`
         in a `757px` viewport) with no horizontal scrollbar to reach it —
         a genuine WCAG 1.4.10 Reflow failure, not hypothetical. Fixed:
         `flex-wrap: wrap` + `min-block-size` instead of a fixed `height`;
         verified live, re-measured (`right: 692px`, now on-screen), and
         confirmed zero regression at normal 100% zoom (still one line).
   - [x] **Print CSS static audit** — grepped every `@media print` rule
         across the codebase (can't render a literal print-preview
         screenshot without opening the native OS print dialog, which risks
         hanging browser automation the same way a JS `alert()` would).
         Found two real gaps from this session's own additions: a collapsed
         `.bo-widget__collapse` card would have silently vanished from a
         printout (fixed: forced open under `@media print`); an empty
         `.bo-composer` comment form would print as noise (fixed: hidden,
         same treatment as `.bo-filter-bar`/`.bo-form-actions`).
   - [ ] **VoiceOver verbalization** — NOT verified. No tool available in
         this session can drive VoiceOver; this needs a human on real
         hardware. NEEDS-RUNTIME.
   - [ ] **NVDA** — Windows-only, NEEDS-RUNTIME, unchanged from before.
6. [x] **npm publish** `@busy-office/ui@0.1.x` — DONE 2026-08-15: `0.1.0`
       published by the owner (busy-office org, 2FA), verified via clean-room
       registry install. Follow-up shipped same day: Trusted Publishing
       pipeline (`.github/workflows/publish.yml`, OIDC + provenance) and a
       staged `0.1.1` metadata patch (repository-URL fix). **0.1.1 released
       2026-08-15** via the pipeline's first run: owner registered the
       Trusted Publisher, release v0.1.1 cut, publish.yml green — npm now
       serves 0.1.1 with SLSA provenance and the corrected repository URL.
7. [x] **Breadcrumb** — `.bo-breadcrumb`, added to `components/nav/` (folded
       into the existing "nav" umbrella component/docs page — navbar,
       sidebar-nav, and offcanvas already share one page there; consistent,
       not a new component dir). `<nav aria-label="Breadcrumb"><ol>` — a
       real landmark, not just styled links, so it's directly reachable by
       screen-reader landmark navigation. Current page is plain text (never
       a link) with `aria-current="page"` as the programmatic channel,
       emphasis ink as the visible one. Wraps rather than truncates on
       narrow screens — simpler, and a reachable ancestor beats an
       ellipsis that hides one. Wired into `/patterns/record-detail`, the
       exact use case this item named. Verified live, both themes.
8. More patterns (`apps/docs/src/pages/patterns/`):
   - [x] **Reporting dashboard** — `/patterns/reporting-dashboard`. Composes
         the breadcrumb (shipped last tick) + filter bar/saved views + a
         stat-tile row + a widget grid mixing a compact data table, an
         audit-style activity feed, and a collapsible notes card — nearly
         every piece built this session, in one realistic screen. Zero new
         CSS. Verified live: collapse toggle and theme switching both work
         correctly on the composed page (state persists through the theme
         change), both themes.
   - [x] **Settings & admin** — `/patterns/settings-admin`. Composes
         `.bo-tabs` (General/Users/Notifications), `.bo-form-section` +
         `.bo-form-row` fieldsets, `.bo-checkbox` for on/off preferences
         (no separate "switch" component invented — a labeled checkbox
         already covers the same setting, per the standing "one component,
         many settings" principle), and the data table + byline avatars
         for the user list. Zero new CSS. Verified live via Podman: all
         three tabs render correctly light + dark at 1440px; forced the
         main pane to 350px and confirmed via computed layout that
         `.bo-form-row` genuinely collapses every field to one column
         (single shared left edge) and the user table scrolls within its
         own container (`overflow-x: auto`) rather than blowing out the
         page — same verification method used for `/patterns/detail-form`,
         since this session's browser-resize floor still won't reach a
         literal 390px viewport. 20 tests pass, gates green.
   - [x] **Multi-step wizard** — `/patterns/wizard`. A real Back/Next flow,
         one panel visible at a time, distinct from `/patterns/detail-form`'s
         multi-*section* single screen. Needed a new opt-in behavior
         (`initWizard()`, `packages/core/src/js/behaviors/wizard.ts`) since
         the existing `.bo-stepper` is presentation-only (no JS): the new
         behavior keeps the stepper (`data-state="done"` / `aria-current`)
         and the visible `[data-wizard-panel]` in sync, disables Back on
         the first step, swaps Next for Submit on the last, and moves
         focus to each new panel (WCAG 4.1.3-style status handling for a
         panel swap that isn't a real navigation). Panels are plain
         `.bo-form-section` fieldsets — no new CSS. 3 new behavior tests
         (23 total, pass). Verified live via Podman: stepped through all 3
         panels in both themes at 1440px, confirmed focus lands on each
         new panel, confirmed Back re-enables/disables correctly at the
         edges, confirmed Submit only appears on the last step; forced the
         main pane to 350px and confirmed via computed layout the form row
         collapses to one column and the page doesn't horizontally
         overflow (this session's browser-resize floor still won't reach a
         literal 390px viewport, same workaround as the other patterns).
         **Not addressed this tick:** the `/concepts/js-behaviors` page's
         "five inits" table is now stale (lists 5, there are 8 —
         initDataGrid/initCollapsibleCards/initSavedViews were already
         missing before this tick, initWizard makes it 4 undocumented);
         flagging for the next Standardize pass rather than scope-creeping
         it into this item.
9. **RF-scanner / warehouse-scan components** — Explore spike run in an
   isolated git worktree (`explore/rf-scanner-scan-input`, discarded after
   evaluation — nothing merged from it directly, per the Explore playbook).
   Findings, split into three now-separate, properly-scoped pieces instead
   of one bundled item:
   - [x] **9a. Scan-input field** — shipped for real (the worktree spike
         itself was discarded, per the Explore playbook — this is a clean
         rebuild in main, not the throwaway code). `initScanInput()`
         (`packages/core/src/js/behaviors/scan-input.ts`): configurable
         terminator key (`data-scan-terminator`, defaults to `Enter`),
         dispatches `bo:scan` with the value, clears the field, refocuses
         it — POST-terminator only, never on `blur` (the anti-pattern
         rejected during the spike). **Zero new CSS**, confirmed again —
         `.bo-input`/`.bo-input--code`/`.bo-form-field` as-is. 4 new
         behavior tests (30 total, pass): scan dispatch + clear + refocus,
         empty-field guard (no accidental empty scans), custom terminator
         key, back-to-back scans. Docs: new pattern page
         `/patterns/goods-receipt` — scan input + `.bo-quantity` at
         `data-density="spacious"` + a REAL receiving log (data-table rows
         appended live on each `bo:scan`, not a static mockup). Verified
         live via Podman: two consecutive scans correctly logged with the
         quantity captured at scan time (3, not stuck at 1), both themes.
         Also confirmed the js-behaviors generated table
         (`/concepts/js-behaviors`, Standardize item 17's fix) picked up
         `initScanInput()` automatically with zero manual doc edit —
         the earlier Standardize round already paying for itself.
   - [x] **9b. Big-number quantity stepper** — already fully solved,
         nothing to build. `.bo-quantity` (Slice 6 item 12) composed with
         `data-density="spacious"` (44px controls, WCAG 2.5.8) already IS
         the large-target quantity control; confirmed working in the
         spike page as-is. No RF-scanner-specific variant needed.
   - [x] **9c. High-contrast warehouse-floor mode** — genuinely NOT
         addressed by this spike, and turned out to be broader than
         RF-scanner: the codebase has **no `forced-colors: active` /
         Windows High Contrast Mode handling anywhere** (checked — zero
         matches across all component CSS). That's a pre-existing gap
         across the whole library, not something specific to warehouse
         screens, so scoping it as an RF-scanner sub-item would have been
         wrong — split out as its own item (18), done there. This
         checkbox was left stale after item 18 shipped — fixed while
         doing Roadmap hygiene, not a re-open.
10. [x] **Demo-section ordering audit** (Standardize) — scripted a check
        across all 16 hand-authored pages (13 components + 3 patterns):
        found exactly one real violation, `alerts.astro`'s "Toast recipe"
        section — code-only, no live example at all (toasts are ephemeral,
        so the original author skipped rendering one). Fixed: a "Show
        toast" trigger button + `.bo-toast-region` now render a REAL toast
        above the code, matching what the code shows. Verified live: click
        renders the toast (bottom-end, both themes), dismiss removes it via
        the existing `initAlerts()` delegation — no regression. Every other
        flagged page was a false positive: either the sanctioned trailing
        "Markup" reference section (matches the recipe exactly) or a case
        where the live example lives in an earlier section on the same
        page. Clean pass otherwise — most of the codebase already follows
        the convention.
11. [x] **Responsive audit (mobile + desktop)** — worked around the
        session's window-resize floor (still confirmed stuck at ~1600px
        this tick, not just "~600px" as previously noted) with a
        mechanical technique: clone each page's `.demo` section markup
        into an isolated, off-screen 320px container and measure
        `scrollWidth` vs. `clientWidth`, explicitly excluding `<pre>`/code
        blocks and any element with its own `overflow-x: auto/scroll`
        ancestor (both are legitimate internal-scroll cases, not layout
        bugs). Ran this across **all 26** component + pattern pages
        (19 `/components/*`, 7 `/patterns/*`) via real htmx-boosted
        navigation in one continuous script (not full page reloads).
        **Result: zero real overflow findings** — every component that
        looked like it might overflow at 320px (data-table, tabs, forms,
        wizard) genuinely doesn't.
        Mechanical no-overflow is necessary but not sufficient for "looks
        intentional," so also visually spot-checked 3 of the highest-risk
        composite pages by rendering the same isolated 320px clone
        on-screen and screenshotting it: data-table's own "Narrow
        container → auto-compaction" demo, `/patterns/reporting-dashboard`,
        and `/patterns/settings-admin` — all three read as genuinely
        designed for the width (readable stacking, no cramped touch
        targets, tabs/forms/checkboxes all wrap cleanly), not just
        technically non-overflowing.
        **Honest scope note:** the mechanical overflow check is
        exhaustive (26/26 pages); the qualitative "looks intentional"
        visual check is a 3-page spot-check, not full coverage of all 26
        — a future tick could extend the visual pass to the remaining
        23 if a specific page is ever suspected of looking cramped rather
        than broken. No code changed this round (verification only); 26
        tests unchanged, gates green.

12. [x] **Quantity field** (2026-08-14 user direction, wishlist) — shipped as
        `.bo-quantity` (`/components/quantity`), scaffolded via
        `new:component` to keep the docs-page shape gate-honest. Composes
        `.bo-btn`/`.bo-input--numeric` rather than inventing new visual
        primitives — the increment/decrement buttons ARE `.bo-btn
        bo-btn--secondary`, styled for free. A real `type="number"` input
        is the single source of truth for `min`/`max`/`step`; the new
        opt-in behavior `initQuantity()` reads those same attributes to
        clamp the buttons and keeps their `disabled` state in sync
        reactively (author renders the correct initial `disabled` if the
        starting value is already at a boundary — no eager DOM scan, same
        "swap-proof, not scan-proof" shape as the other behaviors). No
        `.bo-stepper` name collision (that's the wizard component).
        Warehouse-floor "large-target" variant is **not a new modifier** —
        `data-density="spacious"` (44px controls) already meets WCAG 2.5.8,
        so item 9's RF-scanner stepper can reuse this directly. Composes
        with `.bo-form-field` for the two-channel validation-error state
        (border + message + `aria-invalid`) — nothing quantity-specific
        needed there. 3 new behavior tests (26 total, pass).
        **Bug found and fixed during live verification, not caught by
        gates:** the docs-page demo markup omitted `.bo-btn` on the step
        buttons — CSS-valid, gates all passed, but the buttons rendered as
        unstyled native `<button>`s at the wrong size (spot-checked
        computed height: 27px vs. the intended ~36px). Caught by measuring
        computed height live rather than trusting the screenshot alone;
        fixed by adding `.bo-btn bo-btn--secondary` to every occurrence.
        Verified live via Podman: comfortable (36px) vs. spacious (44px)
        step-button height confirmed via `getComputedStyle`, light + dark
        both correct, boundary/unit/validation demos all render as
        intended, clicking the buttons live in-browser increments/
        decrements and clamps correctly. Narrow-width check used an
        isolated 320px off-DOM container instead of the usual
        forced-main-width technique (this page's right-rail TOC grid
        didn't shrink under that technique the way patterns pages did —
        a docs-shell quirk, not a component bug — confirmed the component
        itself has no fixed-pixel dependency: `max-inline-size: 12rem`
        plus flex content, same shape already used safely elsewhere).
13. [x] **Standardize: generated-docs drift** (dispatched after 4 Continue
        rounds) — `/concepts/js-behaviors`'s "five inits" table was
        genuinely wrong (hand-typed, actually 9 behaviors, 4 undocumented:
        `initDataGrid`/`initCollapsibleCards`/`initSavedViews`/`initWizard`).
        Rewrote it to generate from `@busy-office/ui/behaviors-manifest`
        (`dist/behaviors.json`), same pattern `ClassRef.astro` already uses
        for `dist/api.json` — marked `generated` so it can't drift again.
        Fixed a real bug surfaced by making the table honest: the
        generator (`extract-behaviors.mjs`) truncated long summaries
        mid-word at a hard 200-char cut; now cuts on a word boundary with
        an explicit `…`. Broader scan (Explore agent) found one more
        instance of the same anti-pattern: `/base/primitives.astro`
        hardcoded "four primitives plus the app shell" in prose — correct
        today but drift-prone (didn't consume the already-available
        `api.primitives`, unlike its sibling generated pages). Fixed the
        same way. Re-scanned the rest of the non-component docs pages
        (index, reference/classes, base/utilities, base/motion,
        base/colors) — all already correctly generated; clean pass, no
        further instances. 23 tests pass (unchanged), gates green.
14. [x] **Amount: currency symbol/ISO code / custom currency, with
        per-currency default (but overridable) decimal precision**
        (2026-08-14 user direction, wishlist) — scoped and resolved: this
        was almost entirely a **documentation gap, not a CSS/JS gap**.
        `/components/amount` already had an ISO-code demo (`__currency`
        holding `EUR`, not just `$`); what was genuinely missing:
        1. A **custom / non-ISO currency** demo — points, credits, an
           app-defined symbol — making explicit that `__currency` has no
           ISO allowlist (it's plain text, always was).
        2. A **decimal-precision reference table**, documented as
           app/domain data (USD/SGD/EUR → 2, JPY/KRW → 0, BHD/KWD/OMR → 3,
           app-defined → "your call"), explicit that there is and should
           be no `--decimals` CSS modifier — precision is an
           `Intl.NumberFormat`/currency-master-table concern, not this
           layer's. Linked out to ISO 4217 for the authoritative table
           rather than trying to embed one.
        Zero new CSS/JS shipped — confirms the scoping question the item
        itself raised (markup-convention vs. new surface) landed on
        "convention," consistent with Amount's existing "your app formats
        the number" contract. `ApiTable` notes updated to state both
        points explicitly. Verified live via Podman, both themes — no
        gate impact (no new classes, no new colour pairing).
15. [x] **Quantity: base-unit symbol / standard &amp; custom units, with
        per-unit default (but overridable) decimal precision**
        (2026-08-14 user direction, wishlist) — resolved the same shape as
        item 14, but with one real difference: Quantity is an **editable**
        input, so unlike Amount's display-only precision, "step IS the
        precision" is a literal, not just documented, mechanism. Shipped:
        1. Clarified `__unit`'s existing text-note to explicitly name the
           ISO/standard-vs-custom-UOM distinction (was already unrestricted
           text — same as `__currency` — just not spelled out).
        2. A new **"Fractional units"** demo: `step="0.25"`/`inputmode=
           "decimal"` on a kg quantity, verified live that clicking `+`
           correctly increments `2.50 -> 2.75` (the decimal `step` flows
           straight through `initQuantity()`'s existing clamping math, no
           behavior change needed).
        3. A per-unit decimal-precision reference table (whole counts -> 0
           / `step=1`, kg-L-m -> 2 / `step=0.01`, hrs -> 2 / `step=0.25`,
           custom -> "your call"), documented as app/domain data with the
           explicit "no `--decimals` modifier" note, mirroring Amount's.
        4. Cross-referenced `.bo-quantity` <-> `.bo-amount` in both
           directions (`Related` links + an inline note on Amount's "Unit
           of measure" section pointing to Quantity as the editable
           counterpart) — the item's own "should these cross-reference"
           question, resolved now rather than left as a future
           Standardize candidate.
        Zero new CSS/JS surface (confirms the scoping hypothesis again).
        Verified live via Podman, both themes; gates unaffected.
16. [x] **Quantity + Amount: input-field and table samples, incl. mixed
        units/currency per row** (2026-08-14 user direction, wishlist) —
        all three parts resolved:
        1. **Amount as an input** — answered explicitly rather than
           built: `.bo-amount` is a `<span>`, read-only display, on
           purpose (its nested `__currency`/`__fraction` parts can't live
           inside a native `<input>` and stay one accessible value). New
           "Editable money" demo shows the actual recommendation: a plain
           `.bo-form-field` + `.bo-input--numeric`, currency named in the
           *label* ("Unit price (USD)"), not invented affix markup —
           explicitly rejected reusing `.bo-quantity`'s parts for this
           (tempting shortcut, but `.bo-quantity__unit` is documented as
           "count, not currency"; would have contradicted that on sight).
        2. **Quantity as a table column** — new demo, a real 2-row
           `__col--numeric` cell (whole-count + fractional-unit rows),
           verified live: buttons increment correctly inside the table
           context, no overflow.
        3. **Mixed currencies in one table** — the genuinely open
           question. Built a real 4-row table ($, SGD, ¥, BHD) and
           measured live (not eyeballed): every row's `__value`
           `getBoundingClientRect().right` lands at the identical pixel
           (1303px in the tested viewport) regardless of affix width —
           `__col--numeric` right-align + tabular figures already solve
           this; **no dedicated fixed-width affix sub-column needed**.
           This closes the question the item raised rather than leaving
           it a guess. Cross-linked from Quantity's table-column demo.
        Zero new CSS/JS surface — three real docs additions, one of them
        (mixed-currency alignment) backed by a live measurement, not an
        assumption. Verified both themes via Podman; gates unaffected.
17. [x] **Standardize: Amount's "In a column" demo wasn't using
        `Demo.astro`** (dispatched after 4 Continue rounds) — an Explore-
        agent scan of the Amount/Quantity docs cluster (items 14-16) found
        one real gap: the pre-existing "In a column" section was raw
        hand-written markup with no copyable code listing at all, unlike
        every sibling section (including "Mixed currencies," added
        directly above it this session, which made the inconsistency
        newly visible sitting right next to it). Converted to
        `<Demo code={...}>` like the rest — zero visual change, preview
        and code can no longer drift apart. Broader scan (demo-ordering,
        duplicated markup between Amount/Quantity's table-column demos,
        page-shape gate, quantity.css/ts vs. sibling components) came back
        clean — one real finding, fixed, no further instances. 26 tests
        pass (unchanged), gates green.
18. [x] **`forced-colors` (Windows High Contrast Mode) support** — real
        audit run, not just the spike's grep. Focus rings were **already
        correct**: the one global `:focus-visible` rule (`reset/index.css`)
        already uses a real `outline`, not `box-shadow` — nothing to fix
        there. The audit found 5 real gaps, all sharing the same shape
        (background/box-shadow is the ONLY boundary, no real border) and
        all fixed the same way (a scoped `@media (forced-colors: active)`
        block adding a real `border`/`border-color` in a CSS System Color
        keyword — `ButtonText`/`CanvasText` — so it adapts to whatever
        palette the user's OS high-contrast theme uses, never hardcoded):
        - `.bo-btn` — solid/ghost/danger variants have `--bo-btn-border:
          transparent`, relying entirely on the fill.
        - `.bo-badge` — no border in any variant, ever (color-only status
          tint) — same problem the existing `@media print` block already
          solved for print; same fix, forced-colors version added
          alongside it.
        - `.bo-dialog` / `.bo-offcanvas` — both `border: none` by design
          (shadow-only edge look); their panel would have NO boundary
          against the page under forced-colors, since `box-shadow` isn't
          rendered in that mode at all.
        - `.bo-data-table tr[data-row-state="error"]` — the existing
          "non-color channel" for error rows is drawn with `box-shadow`,
          which would silently disappear under forced-colors, defeating
          the exact thing that CSS comment says it's for. Swapped to a
          real `border-inline-start` inside the forced-colors block only
          (kept `box-shadow` for normal rendering, unchanged).
        Checked and found ALREADY correct (no fix needed): `.bo-dropdown__menu`
        and `.bo-alert` both already have real borders, not just shadows.
        **Verification method:** this environment's Chrome automation
        cannot literally toggle `forced-colors: active` (no CDP media-
        feature emulation surface, no OS-level Windows HCM available) —
        same class of limitation as VoiceOver/NVDA earlier this session,
        flagged honestly rather than claimed. Verified instead by
        temporarily injecting the exact same rules under an always-true
        selector (not gated behind the media query) and screenshotting
        live: buttons/badges/dialog/data-table error row all render a
        correct, visible boundary. **NEEDS-RUNTIME:** a final pass on
        real Windows High Contrast Mode or a browser capable of true
        `forced-colors` emulation remains open — the CSS is spec-correct
        (`box-shadow` is documented as not rendered under forced-colors;
        borders/outlines are) but hasn't been seen under the real feature.
        Zero visual change to normal rendering (media-gated); contrast
        gate, stylelint, and 30 tests all pass unchanged.
19. [x] **Inline validation summary** — shipped for real (the worktree
        spike itself was discarded, per the Explore playbook). New pattern
        page `/patterns/validation-summary` + `initValidationSummary()`
        (`packages/core/src/js/behaviors/validation-summary.ts`): on a
        `[data-validation-summary]` form submit, if invalid, prevent
        submission, list every invalid field (label text + `#fieldId`
        link) in a `[data-validation-summary-box]` (`.bo-alert
        bo-alert--danger`, zero new CSS), move focus to the summary first
        — WCAG/GOV.UK precedent — and each link click focuses its field.
        3 new tests (33 total, pass).
        **Two real bugs live verification caught that the spike/jsdom
        tests didn't:**
        1. `:invalid` also matches a `<fieldset>` wrapping an invalid
           control in real browsers (not present in jsdom's simpler
           `<div>`-only test markup) — the summary was listing the
           fieldset itself as an unlabeled "Field". Fixed by scoping the
           query to `input:invalid, select:invalid, textarea:invalid`.
        2. This docs site boosts forms via `hx-boost="true"` on `<body>`
           (same as links) — htmx's own submit interception raced this
           behavior's, fetching and swapping `#main-content` with a fresh
           (pristine, summary-hidden) copy of the page right after our
           handler correctly showed the summary, silently wiping the
           validation state. Fixed with `hx-boost="false"` on the demo
           form (same pattern already used for `#toc-nav`); documented as
           a real integration note on the pattern page itself, since any
           htmx-boosted app using this behavior would hit the identical
           bug.
        Re-verified after both fixes: exactly 3 fields listed (no
        fieldset), focus lands on summary, link click focuses the exact
        field, survives the boosted page, both themes correct. Gates
        green, 20 component pages / 47 total pages built.
20. [x] **Density-aware icon sizing** — Explore idea, evaluated and fixed
        directly (small, unambiguous CSS-only change; no worktree
        ceremony needed — no interaction-model uncertainty the way
        RF-scanner/validation-summary had). Audited every icon-sizing
        rule in the codebase for a `rem`-vs-`em` mismatch (the actual bug
        shape this idea was chasing): found and confirmed exactly one,
        `.bo-sidebar-nav__icon`'s `inline-size: 1.125rem` — measured live
        (not assumed) that it stayed a fixed 18px across all three
        density tiers while the sibling label's font-size correctly
        ranged 13px (compact) → 14px (comfortable) → 16px (spacious), a
        real, visible disproportion. Fixed: `1.125rem` → `1.3em`, which
        inherits the link's own `--bo-density-font-size` and now measures
        16.9px → 18.2px → 20.8px across the three tiers — proportional,
        not fixed. Checked and left alone: `.bo-state__icon` (`font-size:
        2rem`, a large centered empty/error-state illustration, not list
        content — deliberately NOT density-scaled, same reasoning a hero
        graphic wouldn't shrink); `.bo-btn--icon` (already fully
        density-aware via `--bo-btn-height`/`--bo-density-font-size`);
        `.bo-widget__toggle-icon` (no explicit size, inherits contextual
        font-size already). Stylelint, contrast gate, page-shape gate,
        and 33 tests all pass unchanged (CSS-only, no new class).
21. [x] **Date field (display)** — shipped for real (the worktree spike
        itself was discarded, per the Explore playbook). `.bo-date`
        (`packages/core/src/css/components/date/date.css`, scaffolded via
        `new:component`) — the Amount/Quantity counterpart for dates:
        `__value` (app-formatted absolute date) + optional `__relative`
        (muted, small — "in 7 days", "Overdue by 4 days"), one modifier
        `--overdue` (two-channel like Amount's `--negative` — "Overdue" is
        in the text, color only adds the hue). Editing stays a plain
        native `<input type="date">` — no `--input` variant, same
        reasoning as Amount. **No `--muted` modifier**, on purpose — the
        spike caught that it would have exactly duplicated the existing
        `.bo-u-text-muted` utility; the docs page demonstrates composing
        the utility directly instead. Zero new colour pairing (reuses
        `--bo-color-danger-text`). New docs page `/components/date` — 7
        demo sections (basic, today, overdue, muted-via-utility, editable
        input, table column, markup), 21 component pages now gate-verified
        (page-shape). Verified live via Podman: all demos render
        correctly in both themes, spacious density carries through
        consistently, overdue red + text both present. 33 tests pass
        (unchanged — no JS), gates green.
22. [x] **Standardize: 4-tick scan across items 9a/18/19/21** (dispatched
        after 4 Continue rounds) — audited the new behaviors
        (`initScanInput`/`initValidationSummary`) against the established
        shape, demo-section ordering on the 3 new pages, consistency of
        the 5 new `forced-colors` blocks, sidebar placement, and the
        page-shape gate. **Clean pass — nothing to fix.** Every new
        behavior matches the existing document-delegation shape exactly;
        every new demo section renders live before its code; the
        `data-table`'s `CanvasText` stripe (vs. the other 4 files'
        `ButtonText` panel border) is a deliberate, correct distinction
        (a status-marker stripe vs. a widget boundary), not drift; sidebar
        entries are positioned consistently with siblings. Gates green,
        33 tests unchanged. A genuinely clean Standardize round is itself
        a useful signal — the last several Continue rounds held the line
        without accumulating debt.

## Done — Slice 7: docs IA, device coverage, component tiers, pattern gallery

Triaged 2026-08-14 (user direction, wishlist — five distinct asks, logged
together since they're related but NOT all equally ready to build); item 6
added 2026-08-15 via the Explore fallback (backlog + Ideas seed list both
empty — generated from the Long-term backlog's own "Localization/RTL
audit" note, same shape as the other five).

1. [x] **"Data type" docs section** — shipped. New top-level "Data
       display" sidebar group (`Gallery.astro`, between Components and
       Patterns) containing Amount/Quantity/Date, pulled out of the
       alphabetical Components list. Mechanical change, zero new CSS/JS
       — same `sections` array feeds both the desktop sidebar and the
       mobile off-canvas drawer, so both stay in sync automatically.
       Verified live via Podman: boosted nav to `/components/amount`
       correctly highlights "Amount" under the new "Data display"
       heading (`aria-current` sync unaffected), both themes render
       correctly, page-shape gate still passes (21 pages — the gate
       checks link presence, not which sidebar group it's under). 33
       tests unchanged. **"Any other?" candidates for the same family,
       NOT built** — need a real ERP use case each before scoping:
       Percentage (rate/ratio, distinct from Amount's currency framing),
       Duration (elapsed/remaining time), Boolean/flag display (likely
       just a Badge composition), File size.
2. [x] **Device/platform coverage** — closed via the 2026-08-15 Objective
       review (project design panel, see `.roundtable/grill-slice7-
       scoping-2026-08-15.md`); superseded by Slice 9 items 1 and 3 below
       (device/platform audit doc + `bo:scan` live-region fix). Panel
       verdict was unanimous: option (a), document existing density +
       container-query coverage, not device-specific component variants.
3. [x] **Simple -> Advanced component tiers** — closed via the 2026-08-15
       Objective review; split into four independently-scoped items,
       superseded by Slice 9 items 2 and 4 below (table-tiering docs,
       Card discoverability fix — both ready now) plus two parked items
       (Filter Control "advanced", Process Bar — both need a real cited
       ERP scenario before design starts, not scoped as of this review).
4. [x] **Demo layout: side-by-side vs. stacked — prototyped, NOT rolled
       out further yet** (pending a decision, not blocked). Shipped an
       opt-in `layout="row"` prop on `Demo.astro`: unset stays the
       original stacked layout untouched everywhere; `layout="row"` adds
       a `.demo-pair--row` class that only activates inside a new
       `@container bo-demo (min-width: 34rem)` rule (`section.demo` is
       now a named container) — narrower than that, or the default case,
       renders exactly as before. Tried on 4 real demos across 2 pages
       (`/components/badge` both sections, `/components/amount`'s
       "Money" and "Precision" sections) — deliberately picked one short
       single-line case and one taller multi-example case to see both
       ends. Verified live: wide (1440px, both themes) shows a clean
       two-panel layout, code panel gets its own border/background/
       padding (previously bare/unstyled — a real gap in the original
       stacked design, now fixed for the `--row` variant) with
       `overflow-x: auto` for lines wider than the panel; forced-narrow
       (isolated 320px container, this session's usual workaround)
       collapses back to the exact original stacked appearance,
       confirmed pixel-for-pixel comparable.
       **Real trade-off found live, not assumed — this is why the Accept
       criteria asked for a prototype before a rollout decision:**
       side-by-side reads well when the preview and code are similar
       heights ("Money", "Tones"), but when code is much taller than the
       preview (Amount's "Precision" section — 3 commented examples vs.
       one line of visual output), `align-items: stretch` stretches the
       short preview panel to match the tall code panel's height,
       leaving visible dead space on the left. Not a bug — a genuine
       per-demo judgment call (some demos suit side-by-side, some don't),
       which argues AGAINST a blanket site-wide rollout and FOR keeping
       this as a per-`<Demo>` opt-in exactly as built, used selectively
       where the two panels are naturally similar heights.
       **Decision on further rollout deliberately left open** — the
       prototype answers "does the mechanism work," not "which of the
       ~90 existing `<Demo>` call sites should use it," which is a
       page-by-page editorial call, not something to blitz through
       mechanically. 33 tests pass (unchanged, no JS), gates green.
5. [x] **Patterns gallery expansion across device archetypes** — closed
       via the 2026-08-15 Objective review; superseded by Slice 9 items 5
       and 6 below (Login pattern, App Launch pattern — both scoped and
       ready now). Panel cross-checked all ~10 proposed archetypes against
       the 9 already-shipped pattern pages: Dashboard/Report overlaps
       `/patterns/reporting-dashboard`, App Style overlaps `/patterns/
       settings-admin`, Output Form overlaps `/patterns/invoice-list` —
       marked satisfied, not rebuilt as new. Boardroom and undifferentiated
       "App Style 1/2" cut — no testable Accept criterion, vague labels
       rather than scoped work; can be re-opened if a concrete shape like
       App Launch's reference screenshots ever grounds one of them.
6. [x] **Localization/RTL audit** (dispatched via the Explore fallback —
       backlog and Ideas seed list both empty, generated from this
       Long-term backlog's own note, same pattern as item 21's date-field)
       — verification-only round, zero code changes needed. Mechanical
       scan first: `grep` for physical CSS properties (`margin-left`,
       `padding-right`, bare `left:`/`right:`, `text-align: left/right`)
       across every component AND the docs shell (`Gallery.astro`) —
       **zero matches**, confirming the "logical properties throughout"
       claim was actually true, not just asserted. Live verification
       (`dir="rtl"` toggled on real pages, not assumed from the grep
       alone): the **entire app shell mirrors correctly** — sidebar
       flips to the right, TOC to the left, navbar brand/hamburger swap
       sides, breadcrumb reads right-to-left — with **zero shell-specific
       RTL CSS**, purely from consistent logical-property use throughout
       the shipped package. Confirmed the two places that already HAD
       deliberate `[dir="rtl"]` overrides actually work: `.bo-select`'s
       chevron (background-position has no logical keyword, needs an
       explicit physical flip — computed style confirmed it resolves
       correctly under RTL) and `.bo-offcanvas`'s slide-in animation
       direction.
       **One genuine open question surfaced, documented rather than
       silently "fixed":** `.bo-data-table__col--numeric` uses
       `text-align: end`, so numeric/currency columns visually flip to
       LEFT-aligned under RTL — technically correct logical-property
       behavior, but real-world RTL accounting/ERP UIs often keep
       monetary columns visually right-aligned as a numeral convention
       distinct from prose direction. This is a genuine market/product
       decision this session can't authoritatively make (varies by
       target market), not a bug — flagging for whoever has real RTL-market
       requirements, not changing behavior speculatively.
       No CSS/JS changed; 33 tests unchanged, gates unaffected (nothing
       to rebuild).

**All six items now closed.** Items 1, 4, and 6 (data section, demo
layout, RTL audit) were concrete enough to Continue/Explore-dispatch
without further review. Items 2, 3, and 5 (device coverage, component
tiers, patterns gallery) needed the Objective review before scoping
further — got it 2026-08-15 (see `.roundtable/grill-slice7-
scoping-2026-08-15.md`), and their outcome is the six scoped items in
Slice 9 immediately below.

## Done — Slice 8: editable table, multi-select dropdown, searchable dropdown

Triaged 2026-08-15 (user direction, wishlist — three concrete component
asks). Unlike Slice 7 items 2/3/5, these describe specific buildable UI
controls rather than open-ended device/pattern-gallery questions — checked
the current codebase for each before scoping rather than assuming a gap,
per dispatcher discipline. All three shipped same-day across three Continue
rounds, smallest-scoped first, each verified live before moving to the next.

1. [x] **Editable table (inline change)** — shipped. New "Multi-row inline
       edit — dirty state + save/cancel" section on `/components/data-table`,
       composed from existing primitives (`.bo-input--seamless`, badge,
       button) plus one small opt-in behavior: `data-row-edit` +
       `initRowEdit()` (`packages/core/src/js/behaviors/row-edit.ts`).
       Typing in a row sets `data-row-state="dirty"` on the `<tr>` — reuses
       the SAME visual channel the existing error-row state uses (amber
       tint + start border instead of red, `--bo-color-warning-subtle`,
       already contrast-checked) — and reveals that row's "Unsaved" badge +
       Save/Cancel. Cancel resets inputs to `defaultValue`; Save dispatches
       `bo:row-save` (bubbling, `{row, rowId}`) and clears dirty state —
       persistence is the consumer's code, this behavior only tracks state.
       3 new behavior tests (36 total, all pass); contrast/stylelint/build
       gates green; verified live via Podman (`--no-cache` rebuild, 48
       pages / 2417 links) in both themes — light and dark both render the
       dirty tint/badge/buttons correctly — and at a narrow (390px) isolated
       container width (table reflows without overflow or clipped buttons).
       **Real bug found and fixed along the way, not pre-existing scope**:
       inline `<script type="module">` blocks embedded mid-page silently
       fail in the built site (bare npm specifiers aren't browser-resolvable
       without an import map; Astro only bundles untyped `<script>` tags,
       not `type="module"` ones) — the adjacent `initDataGrid()` demo had
       the same latent bug. Fixed by consolidating all three demo behaviors
       (`initDataTables`, `initDataGrid`, `initRowEdit`) into the one
       untyped `<script>` block that Astro actually bundles, rather than
       one broken inline script per demo section.
2. [x] **Multiple-selections dropdown** — shipped. `data-multiselect` on
       `.bo-dropdown__menu` + real `<input type="checkbox">` items (each
       wrapped in a `<label class="bo-dropdown__item">`, not a button) —
       deliberately **not** a `.bo-dropdown--multiselect` CSS modifier or a
       hand-rolled ARIA listbox, since native checkboxes already carry full
       keyboard (Tab + Space) and screen-reader semantics for free.
       `initDropdowns()` (no new init function) now: skips close-on-select
       when the menu has `data-multiselect`, and updates the trigger's
       label from `data-multiselect-label` + a live checked count ("Cost
       center" → "Cost center (2)") on `change`. Checked items get the
       same `--bo-color-bg-selected` tint the data-table uses for selected
       rows — already a checked contrast pair, no new one needed.
       **Deviated from the Accept text on one point, deliberately**: no
       custom arrow-key roving-tabindex — re-checked the existing dropdown
       behavior while building this and it never had that (menu items are
       plain Tab stops, no keydown handler in `dropdown.ts`), so there was
       no existing "roving-focus shape" to match; native checkbox Tab+Space
       is simpler and equally accessible, so left it at that rather than
       building new keyboard-nav machinery no other menu on the page has.
       37 behavior tests total (33 baseline, +3 for row-edit, +1 here),
       all pass; contrast/stylelint/build gates green; verified live via
       Podman (`--no-cache`) in both themes.
3. [x] **Searchable dropdown** — shipped as a new `.bo-combobox` component +
       opt-in `initCombobox()` behavior
       (`packages/core/src/js/behaviors/combobox.ts`), implementing the
       WAI-ARIA APG combobox pattern (single-select, list autocomplete):
       `role="combobox"` input + `role="listbox"` popup, type-ahead
       (case-insensitive substring match) narrows the visible options,
       ArrowDown/Up move `aria-activedescendant` across the filtered set
       only, Enter commits and dispatches `bo:combobox-select`
       (`{value, text}`). The listbox is a real `[popover]` — same top-layer
       reasoning as `.bo-dropdown__menu` — so Escape and click-outside close
       it without touching the field's value **at no extra cost**: verified
       live that a direct `hidePopover()` call (simulating native Esc/
       light-dismiss) fires the `toggle` event asynchronously, which the
       behavior's `toggle` listener catches to resync `aria-expanded` and
       clear the active option — no code needed beyond that one listener.
       New docs page `/components/combobox`, linked from the sidebar and
       from Dropdown's demo-note (this vs. multi-select — different job).
       No new contrast pairs needed — the active-option highlight reuses
       `--bo-color-bg-selected`, already checked.
       **One implementation note for future maintainers**: initially wrote
       state checks against the `:popover-open` CSS pseudo-class (matching
       a natural read of the Popover API), but that pseudo-class isn't
       implemented in jsdom (the test runtime) and threw on `.matches()` —
       switched to tracking open/closed via a plain `data-bo-open` attribute
       set by our own `open()`/`close()` helpers instead, which is both
       testable and avoids a dependency on the runtime's CSS selector
       support for a value the code already knows internally.
       42 behavior tests total (37 + 5 here), all pass; contrast/stylelint/
       build gates green; verified live via Podman (`--no-cache`) in both
       themes and at a 390px isolated container width (filtering, arrow-key
       nav, and Esc/light-dismiss resync all confirmed working against the
       real, non-cloned demo widget — a `cloneNode`-based narrow-width test
       harness hit a one-off `showPopover()` hiccup specific to cloned
       popover nodes, not a real usage pattern, so not treated as a
       product bug).

**Slice 8 is now complete — all three items shipped, verified live,
committed.** No further Continue rounds queued for this slice.

## Done — Slice 9: from the Slice 7 Objective review (all 11 items)

Direct output of the 2026-08-15 design-panel review (`.roundtable/grill-
slice7-scoping-2026-08-15.md`) — originally six independently-scoped items
replacing Slice 7's three blocked entries; items 7-10 added same-day from
a follow-up user wishlist ("advance table": search, filter, columns,
export, settings, pagination, grouping, subtotal/total) plus its reference
screenshot. Checked every sub-ask against what's already shipped before
scoping anything new — search/filter/sort were already covered, item 7
(columns + export) was the genuinely new, concretely-scoped part and is
now shipped. Items 1-4 and 7 shipped (see below); item 5-6 are ready to
Continue-dispatch (no open design questions); items 8-10 (grouping,
subtotal/total, load-more pagination) are drafted but need either a
concrete scenario or further scoping before building; "Settings" is
flagged as ambiguous, not guessed at. **Process Bar** stays
parked pending a real cited ERP scenario, per the panel's explicit
recommendation not to build speculatively.

1. [x] **Device/platform coverage audit** — shipped, verification-only
       (zero CSS/JS, 44 tests unchanged, same shape as Slice 7 item 6's
       RTL audit). New "Device/platform coverage" section on `/concepts/
       density`: a table mapping each archetype (Web, Mobile app, Tablet/
       Bento UI, RF/warehouse) to the existing mechanism that already
       covers it, with a live-example link per row (`/components/
       data-table`, `/components/dashboard`, `/patterns/goods-receipt`).
       Confirms the Objective review's finding live rather than just
       asserting it: Tablet-Bento is explicitly framed as the SAME
       `bo-widget-grid` container-query mechanism as Dashboard, not a
       separate component, and cross-referenced forward to the queued App
       Launch pattern (item 6) rather than treated as independent. RF is
       the one archetype confirmed to have genuinely needed new work
       (`initScanInput()`, not just a density setting). **[HUMAN CALL]
       carried forward, not resolved by this audit**: whether RF/Mobile/
       Tablet are real target markets worth more investment — noted
       explicitly on the page itself, not silently dropped. Verified live
       via Podman (`--no-cache`) in both themes; all four cited links
       resolve (confirmed both by the build's link checker and by reading
       their `href`s live).
2. [x] **Table tiering docs framing** — shipped, docs-only (zero CSS/JS
       changed, 44 tests unchanged). `/components/data-table`'s demo-note
       now names the two tiers up front ("Simple... covers selection/sort/
       filter for free; reach for Advanced... only when a screen genuinely
       needs full two-axis keyboard navigation — most tables don't"); the
       previously-unlabeled first demo section got an explicit "Simple —
       select, sort, filter" heading; "Keyboard grid navigation" retitled
       to "Advanced — keyboard grid navigation" with its intro paragraph
       naming the tier and the "when to reach for it" guidance. Verified
       live via Podman (`--no-cache`) in both themes.
3. [x] **`bo:scan` live-region announcement** — shipped. Opt-in markup
       contract: link the scan input's `aria-describedby` to a
       `data-scan-status` element (`aria-live="polite"`, visually hidden
       via the existing `.bo-visually-hidden` primitive) — `initScanInput()`
       (`packages/core/src/js/behaviors/scan-input.ts`) writes "Scanned
       {value}" to it on every successful scan. Fully backward compatible:
       an input without `aria-describedby` behaves exactly as before
       (verified with a dedicated test). Wired into `/patterns/
       goods-receipt`'s live demo. 2 new behavior tests (44 total, all
       pass); contrast/stylelint/build gates green (no new CSS — reused
       the existing visually-hidden primitive); verified live via Podman
       (`--no-cache`) in both themes: dispatched real scan events,
       confirmed the status text updates and re-announces on a second
       scan, confirmed zero visual change (region is invisible by design).
4. [x] **Card discoverability fix** — shipped, docs-only (no class rename
       — `.bo-widget`'s shipped contract is untouched). Went with the
       cross-link + alias option rather than a whole new page (a real
       second page would either duplicate `.bo-widget`'s `ClassRef`/
       `ApiTable` entries against the same CSS component — a drift risk
       — or need a `PAGE_SLUG` alias hack for something that isn't
       actually a distinct concept). New sidebar entry "Card" → `/components/
       dashboard#card` (Gallery.astro); demo-note now leads with
       *"Looking for a 'Card'? `.bo-widget` is it"* linking straight to
       the existing "Widget parts" section, which is now titled with an
       `id="card"` anchor and opens with *"`.bo-widget` is the framework's
       card primitive."* Verified live via Podman (`--no-cache`) in both
       themes: sidebar link present with the correct href, direct
       navigation to the anchored URL lands exactly on the reframed
       section (confirmed via a fresh navigation, not a JS reload —
       reload() doesn't reliably re-trigger native anchor-scroll, a test
       artifact rather than a site bug). Link checker confirmed fine with
       the `#card` fragment (strips fragments before validating). 44
       tests unchanged, page count unchanged (49 — no new page), 2564
       links (+48, one new sidebar entry × pages).
5. [x] **Login pattern** — shipped (`/patterns/login`, zero new CSS).
       A centered `.bo-widget` card (the Card primitive, cross-linked to
       the Slice 9 item 4 alias) with email/username + password fields
       carrying the correct `autocomplete="username"`/`"current-password"`
       tokens, the existing validation-summary pattern for errors
       (`initValidationSummary()` — verified live: empty submit lists
       both fields and moves focus to the summary first), and a "details
       that matter" section covering server-error recovery (say which
       ACTION failed, never which field — credential enumeration),
       lockout messaging, and never blocking paste. Sidebar entry added
       (top of Patterns group); `Related` links added on `/components/
       form` and `/patterns/validation-summary`.
       **Real component finding surfaced by building this** (exactly what
       the pattern-page bar is for): `.bo-widget` is a size container
       (`container-type: inline-size`), so used standalone outside a
       `.bo-widget-grid` it needs an explicit `inline-size` — with only a
       `max-inline-size` it collapses to ~1px (size containment means
       width can't come from content). Found live on first render, fixed
       with `inline-size: 100%`, and documented as a comment in the
       pattern's markup block so the next consumer doesn't rediscover it.
       Worth considering a docs note on the Card/dashboard page too if it
       bites again. Verified live via Podman (`--no-cache`) in both
       themes and at a 390px isolated container width; 48 tests
       unchanged.
6. [x] **App Launch pattern** — shipped (`/patterns/app-launch`, zero new
       CSS — the "genuinely new grid-tile primitive" contingency was NOT
       needed). Matches the reference screenshots' shape: a "Favourites"
       icon-tile grid (tiles are plain `<a class="bo-widget">` links —
       initials-as-icon, `aria-hidden` on the decorative initial so the
       accessible name is the label), a category tab row (the ordinary
       tabs pattern, one `.bo-widget-grid` per panel — verified live that
       switching tabs swaps grids correctly), and "folder" tiles (a
       widget whose face previews members as `aria-hidden` badges — one
       link, one navigation; deliberately NOT a hover-expanding stack).
       Also closes item 1's Tablet-Bento precedent gap as planned:
       verified live at a 390px isolated container that the SAME
       `bo-widget-grid` container query reflows the tile grid to two
       columns — no launcher-specific responsive code. Sidebar entry
       added; `Related` links to Card/tabs/container-queries/density.
       Verified live via Podman (`--no-cache`) in both themes; 48 tests
       unchanged.

7. [x] **Advanced table toolbar — column visibility + export** — shipped.
       Triaged 2026-08-15 (user wishlist "advance table / search" + a real
       screenshot of an ERP case-management list view). Checked the
       screenshot against what's already shipped rather than assuming a
       gap: the search input, removable filter chips (`Assignee:
       Unassigned ×`), sortable column headers (`aria-sort`), and status
       badges were **already covered** by `.bo-filter-bar`/`.bo-chip`
       (`/components/filters`) and `.bo-data-table`'s existing sort
       contract — not rebuilt. Two things in the reference genuinely
       didn't exist yet, now shipped: new opt-in `initTableToolbar()`
       behavior (`packages/core/src/js/behaviors/table-toolbar.ts`) —
       **Columns** (`data-col-toggle` on a checkbox inside the existing
       multi-select dropdown pattern from Slice 8 item 2, `data-col` on
       matching `<th>`/`<td>`; toggling shows/hides every cell with that
       value, scoped to its `.bo-data-table-container`) and **Export**
       (`data-table-export` button dispatches `bo:table-export`
       `{format}` — this behavior only tracks intent, generating/
       downloading the file is the consumer's code, same split as
       `bo:row-save`/`bo:scan`). Zero new CSS — fully composed from
       existing dropdown/checkbox/button primitives. New "Toolbar —
       column visibility & export" section on `/components/data-table`.
       4 new behavior tests (48 total, all pass); verified live via
       Podman (`--no-cache`) in both themes — unchecking a column hides
       it cleanly (header + every row), Export fires with the configured
       format, trigger label reflects the live count.

8. [x] **Table row grouping** — closed, together with item 9, via the
       dogfood loop rather than new code. The "needs a real cited ERP
       scenario" gate was satisfied the honest way: built the canonical
       grouped view ("Spend by cost center" — POs grouped by CC with
       per-group subtotals and a grand total) as a real screen in
       `examples/po-app` (`/spend`), using ONLY documented markup, to
       find out whether it composes or fights. **It composes** — better
       than the CSS audit predicted: one `<tbody>` per group, group
       header as `<th scope="colgroup" colspan>` (bold by default,
       correct group-header semantics for AT), subtotal/grand-total as
       ordinary rows with `__col--right`/`__col--numeric`. Verified live
       in both themes. The premature-ARIA-treegrid risk the Objective
       review flagged never materialized because no widget was needed at
       all. Zero new CSS/JS; the deliverable is the new "Grouped rows +
       subtotals" docs section on `/components/data-table` (with the
       real caveats found while building: don't combine with `--striped`,
       regroup server-side rather than sorting across grouped bodies).
       Collapsible groups remain unbuilt — nothing in the scenario needed
       them; if a future screen does, that's the next concrete ask.
9. [x] **Table subtotal / total rows** — closed with item 8 above (the
       two turned out to be one composition, not two components): subtotal
       rows are per-group ordinary rows, the grand total is a final
       single-row `<tbody>`. Documented in the same data-table section;
       proven in po-app's `/spend` screen, both themes, zero new CSS.
10. [x] **Pagination — "pull up to see more" (load-more)** — shipped.
       New opt-in `initLoadMore()` behavior (`packages/core/src/js/
       behaviors/load-more.ts`): a `[data-table-load-more]` button
       dispatches `bo:table-load-more` on click; adding
       `data-load-more-auto` arms an `IntersectionObserver` that fires
       the same event when the button scrolls into view — once per
       approach, so a consumer that fails to append rows doesn't get an
       infinite loop. A disabled button (fetch in flight) neither clicks
       nor auto-fires; guarded for environments without
       IntersectionObserver (jsdom). Behavior tracks intent only —
       fetching/appending is the consumer's code, same split as
       `bo:table-export`/`bo:row-save`/`bo:scan`. Zero new CSS (composes
       with the existing `.bo-data-table__footer`). New "Load more"
       section on `/components/pagination` with a working append demo
       plus a "load-more vs page-numbers: when to use which" note.
       3 new behavior tests (55 total, all pass); verified live via
       Podman (`--no-cache`) in both themes and at a 390px isolated
       container width — two clicks appended four rows live.

**"Settings" — resolved, no new build needed.** Asked the user directly
what the reference screenshot's gear-icon button should open; the answer
was that the screenshot was just a sample to react to, not a spec to
replicate, and the real ask is "general purpose & configurable for
different purposes." That's already this framework's standing answer —
declarative attributes (`data-density`, `data-multiselect`, opt-in
behaviors) ARE the configurability mechanism, not a runtime settings
popup layered on top. A dedicated per-table "Settings" UI would be a
second, redundant way to do what `data-density` already does. No item
added; if a genuinely new *kind* of per-table configuration surfaces
later (something `data-*` attributes can't express), scope it then with
its own real use case, same discipline as every other item here.

11. [x] **Process Bar → `.bo-progress`** — the last parked item,
       graduated and shipped via the same dogfood method that closed
       items 8-9. The named scenario turned out to be one of the two the
       parking note itself hypothesized: **budget consumption** — added
       per-CC budget bars to po-app's `/spend` group headers using bare
       native `<progress>` first, and the evidence was decisive: platform-
       blue chrome ignoring every theme token, both light and dark.
       Shipped `.bo-progress` (`packages/core/src/css/components/
       progress/progress.css`) as CSS-first styling of the NATIVE
       `<progress>` element — value/max semantics and the implicit
       `progressbar` role come from the platform, zero JS/ARIA. Base +
       `--warning`/`--danger` threshold tones, documented as decoration
       on top of required visible text ("93% consumed"), never a
       substitute. Forced-colors reverts to `appearance: auto` (platform
       rendering) rather than losing the fills. Three new non-text 3:1
       contrast pairs added to the gate (WCAG 1.4.11) — which immediately
       caught two real failures: amber-500 on the track was 1.95:1 in
       light (fixed by using `warning-strong`), and dark mode had NEVER
       remapped `--bo-color-warning-strong` (a latent token-tier
       oversight — amber-700 at 2.86:1 on dark muted; fixed with a dark
       remap to amber-500, zero other consumers affected). New
       `/components/progress` docs page (page-shape gate: 23 pages);
       po-app `/spend` upgraded to the shipped class with threshold
       tones. Verified live via Podman in both themes, docs + po-app
       both; 27 contrast pairs × 2 themes + brand presets all pass; 55
       tests unchanged.

**Nothing parked remains.** Every item from every wishlist this project
has received is now shipped, closed as a documented composition, or
explicitly resolved.

## Done — Slice 10: showcase depth grill

Triaged 2026-08-15 (user direction): "grill each component & its doc page
to give enough sample & variation for showcase." Two layers:

1. [x] **Mechanical gap scan** — every class in the generated `api.json`
       diffed against actual usage on its own docs page. Undemoed
       variants found on 6 pages: dialog `--wide`; amount `--block`;
       data-table `--sticky-col` + `__footer` (demoed elsewhere, never
       on its own page); form `--required` + `--seamless` (seamless
       lives on the data-table page only); nav `__spacer`, offcanvas
       `--end`, sidebar `__heading`/`__section`. (dashboard's
       `bo-badge--type` is extraction noise — badge's class.)
2. [x] **Judgment-layer grill** (panel, Consumer seat) — per page: are
       the demos enough to SHOWCASE the component's range (states,
       density behavior, realistic ERP compositions, not just the happy
       path)? Accept: a per-page gap list ranked by showcase value.
       **Done** (commit `fe5c3d8`): per-page gap list produced and
       closed the same round.
**Component gap surfaced by the grill, parked with a scenario**: the
stepper has no rejected/error step state in CSS (only `done`/`current`/
`pending` via `data-state`) — ERP wizards fail steps. The timeline
component HAS a rejected state; whether stepper should mirror it needs a
real failed-wizard scenario before building (same gate as every parked
item). Meanwhile the docs show the supported answer: a returned-for-rework
flow re-marks the step `current`.

3. [x] **Fix rounds** — close the ranked gaps: every documented variant
       demoed on its own page, plus the highest-value state/composition
       samples the grill names. Accept: mechanical scan returns zero
       undemoed classes; each touched page verified live both themes;
       gates + visual baselines updated.
       **Done** (commit `fe5c3d8`): 16 pages, ~20 demos, 2 real defects
       fixed (date `__value` drift; docs drawer hiding embedded demo
       sidebars); mechanical scan returns zero undemoed classes; gates +
       32 visual baselines green.

## Done — Slice 11: CSS icon set

Triaged 2026-08-15 (user, while reviewing App Launch: "can CSS render
icons? for better display"). Answer: yes — `mask-image` with inline-SVG
data URIs painted by `background-color: currentColor` gives real,
THEMABLE icons with zero JS, zero font files, `em` sizing that tracks
density. Initials/emoji were the weak point of the launcher tiles (emoji
don't take `color`; initials read as placeholders).

1. [x] **`.bo-icon`** — SHIPPED. Base class (1em square, currentColor fill via
       mask) + a SMALL curated set (~12 ERP glyphs: document, invoice,
       cart, check-circle, truck, box, chart, settings, grid, barcode,
       building, user), each an original simple geometric SVG authored
       in-repo. Accept: new component + docs page per the recipe
       (mechanism documented as extensible — "add your own glyph in one
       CSS line, or paste inline SVG with fill=currentColor"); a11y note
       (decorative icons aria-hidden, the LABEL carries meaning);
       forced-colors handled explicitly (mask icons vanish under forced
       colors without `forced-color-adjust: none` + a system color —
       verify via CDP forced-colors emulation, not assumption); App
       Launch tiles upgraded from initials to icons; gates + baselines.
       NOT a general icon library — 12 glyphs prove the mechanism;
       more graduate per real need, same gate as everything else.
       **Done**: 12 original geometric glyphs (doc, invoice, cart,
       check-circle, truck, box, chart, settings, grid, barcode,
       building, user) as mask-image data URIs, 1em/currentColor;
       forced-colors opt-out VERIFIED via CDP emulation (adjust:none +
       CanvasText paint, mask intact — not assumed); new `/components/
       icon` page (25 pages, 3094 links, page-shape green); App Launch
       tiles upgraded from initials to icons (demo-note + markup block
       synced); composes with the existing `.bo-sidebar-nav__icon` slot
       and `.bo-btn--icon`. No new contrast pairs (currentColor inherits
       gated text colors). 55 tests unchanged; 32 visual baselines
       regenerated, green twice.

## Done — Slice 12: public feedback intake

Triaged 2026-08-15 (user: "shall we start using linear or github to feedback
the issue?"). Decision: **GitHub Issues** — the package is public on npm and
the npm page links the repo; strangers need a public intake, and issues are
`gh`-triageable by the dispatcher (issue → ROADMAP with Accept criteria →
close with commit link). Linear stays a non-goal: no public intake, and a
second backlog would drift from this file (storage doctrine). Issues are
already enabled on `Busy-Office/busy-office-ui` (verified via API).

1. [x] **Issue templates + docs pointer** — `.github/ISSUE_TEMPLATE/`:
       bug report form (version, browser, light/dark theme, density,
       minimal HTML repro) + feature request form (ERP scenario required —
       matches the "real scenario before building" gate) + `config.yml`
       (blank issues on, docs link). Docs site gets a visible "Report an
       issue" link. Accept: templates render on GitHub's "New issue"
       chooser; docs link verified live at 1440px + 390px, both themes;
       gates green.
2. [x] **Dispatcher intake wiring** — LOOPS.md Step 1 names `gh issue list`
       as a triage input source, so wakes see new issues without being told.
       Accept: LOOPS.md updated; one dry-run triage of the (currently empty)
       issue list recorded in the loop log.
       **Done 2026-08-15** (commits `17f796f`, `52420ce`): forms schema-
       validated (js-yaml) and pushed; `gh issue list` dry run: 0 open.
       Residual: the /issues/new/choose chooser renders client-side and
       github.com is blocked for this session's browser — owner should
       glance at it once (GraphQL `issueTemplates` only reflects legacy
       .md templates, so it can't confirm YAML forms).
3. [x] **npm README** (Explore find, 2026-08-15 post-0.1.1 wake): the npm
       page showed "No README data found!" — npm packs README from
       `packages/core/`, which had none (the root README is repo-facing).
       Consumer-facing `packages/core/README.md` written (install, no-npm
       path, behaviors quickstart, live docs URL, issue link); root README
       de-staled (live Pages URL, slice count). Pack verified: 3.3 kB
       README in the tarball. **Shows on npm at the next release** — no
       0.1.2 cut for it alone; it rides along with whatever ships next.

## Done — Slice 13: axe-core engine audit

Triaged 2026-08-15 (Explore find): first full axe-core scan of all 54 built
docs pages. The hand-built gates (contrast, page-shape, two-channel) held —
but an engine scan caught 7 pages with violations the gates don't model.
Accept for every item: fix applied, axe re-scan of the page returns zero
violations, no visual change (harness green).

1. [x] **scrollable-region-focusable (serious)** — landing `pre` samples ×4
       and colors-page `.bo-data-table-container` ×2 scroll without being
       keyboard-reachable → `tabindex="0"`; document the container rule in
       the data-table canonical markup (keyboard users must be able to
       scroll the table region).
2. [x] **aria-prohibited-attr (serious)** — state-patterns skeleton rows:
       `aria-label` on a plain `div` is prohibited → `role="status"`
       (semantically correct for a loading region anyway).
3. [x] **empty-table-header (minor)** — data-table + dropdown pages: the
       row-actions `th` is empty → `.bo-visually-hidden` label ("Actions").
4. [x] **landmark violations (moderate)** — nav page: the embedded demo
       shell nests a real `<main>` inside `#main-content` (duplicate main
       landmark) → `div.bo-app-shell__main` in demos; filters page: two
       same-label `role="search"` landmarks → unique labels.
5. [x] **Gate candidate — decided: advisory script, not a build gate.**
       `apps/docs/scripts/axe-audit.mjs` (`npm run test:axe -w docs`),
       same class as the visual harness: needs a running :8081 container
       + headless Chrome, so it can't be a hermetic build gate; it runs
       in Standardize sweeps instead. Exits 1 on any violation; 54 pages
       green on adoption day.
**Bonus find while fixing:** the landing hero still said "Not on npm
yet — pre-publish hardening" — post-publish staleness the earlier sweep
missed (it grepped installation.astro, not the landing). Fixed.

## Done — Slice 14: public-contract hardening

From the 2026-08-15 Objective review (`.roundtable/grill-objective-next-arc-
2026-08-15.md`). All four seats voted **Harden**: the public contract lags the
internal discipline. Ordered by severity; confirmed defects first.

1. [x] **Generated README claims + drift gate** (Rex; the "37 kB" claim is
       FALSE — shipped min CSS is 57.4 kB). Size, behavior count, and the
       event list in `packages/core/README.md` stamped from dist at build,
       with a check that fails on drift (same doctrine as every other
       generated surface). Accept: README numbers regenerate; gate red when
       hand-edited; npm copy corrected at next release.
       **Done 2026-08-15**: `stamp-readme.mjs` stamps size/behaviors/events
       into BOTH READMEs from dist (56 kB min / 9.3 kB gz / 16 / 5 events);
       `--check` is now the core build's 8th step, proven red on a
       hand-edit; corrected claim ships to npm with the next release.
2. [x] **JS contract becomes semver surface** (Devi BLOCKER + Rex). The five
       `bo:*` intent events' payload shapes + the 19 exports documented in a
       GENERATED events/API table on the js-behaviors page, and the
       versioning policy amended to name them API (matching the internal
       freeze-audit Breaking rule that CLAUDE.md already carries). Accept:
       table generated from source (like the `.d.ts` gate), versioning page
       lists JS events, `bo:row-save` payload documented beyond a code
       comment.
       **Done 2026-08-15**: structured `@event` JSDoc at every dispatch site;
       `extract-events.mjs` emits `dist/events.json` behind a two-way parity
       gate (dispatched-but-undocumented AND documented-but-not-dispatched
       both red — proven) wired into the core build; exported as
       `@busy-office/ui/events`; js-behaviors page renders the generated
       Intent-events table (payload fields typed + a listener recipe);
       versioning policy amends API to include init/refresh signatures and
       `bo:*` payload shapes with the Breaking rule; palette vars explicitly
       declared not-API (HUMAN CALL #2's recommended default applied in
       docs — owner may veto). En route: fixed an HTML-injection bug where
       `<tr>`/`<input>` in event docs broke the rendered table.
3. [x] **form-field `:has()` source fix** (Kofi; latent). Split the comma
       list into the two separate rules the comment already mandates; correct
       the comment. Accept: dist output equivalent-or-better; a source-level
       note explains why the split is load-bearing.
       **Done 2026-08-15**: explicit forgiving `:is()` wrapper in source
       (better than the split: one block, same guarantee), comment rewritten
       to say the :is() is load-bearing; dist byte-equivalent semantics,
       55 tests + 32 baselines green untouched.
4. [x] **Combobox `aria-controls` collision test** (Rex). Two comboboxes +
       partial swap; fix the reverse lookup if the test reds. Accept: test in
       the behaviors suite either passing against current code or with a fix.
       **Done 2026-08-15**: test went RED against current code (widget #2
       silently drove widget #1 under duplicated ids) — Rex's bug was real.
       Fix: resolution prefers the shared `.bo-combobox` container, with the
       documented id-based lookup kept as fallback; 56/56 tests green;
       CHANGELOG Unreleased Fixed entry per the freeze rules. Live-verified
       by driving the DIST page markup + DIST JS in jsdom (the browser
       extension's CDP session degraded to 45s timeouts mid-wake — noted,
       not retried).
5. [x] **Unlayered-CSS interop recipe** (Kofi HIGH). Tailwind-v3-preflight /
       normalize coexistence: documented recipe (wrap resets in a layer,
       stated layer order for mixed stacks) + a demoed interop page or
       troubleshooting section. Accept: a Tailwind-preflight-style unlayered
       reset demonstrably not nuking `.bo-btn` in the documented setup.
       **Done 2026-08-15**: Troubleshooting gains the recipe (order statement
       first, reset into `layer(app-reset)`, v4-coexists/v3-preflight-off
       notes) + a two-iframe LIVE proof running the identical hostile reset
       — raw frame strips `.bo-btn` (computed bg transparent/0 padding),
       recipe frame renders it fully (accent bg, 16px padding); iframes are
       isolated documents because on the docs page itself a late-declared
       `app-reset` would OUTRANK the framework (the very trap being taught).
       Framework CSS now copied to `public/assets/` at docs build for plain
       linking; symptom row added; cascade page cross-links the sharp edge.
       Verified live 1440 both themes; 32 baselines untouched-green.
6. [x] **No-JS dark decision** (Kofi M-H). `color-scheme: light dark` on
       `:root` ships a docs-app assumption: CSS-only consumers under dark OS
       get light page + dark native chrome. Fix (`:root:not([data-theme])
       { color-scheme: light }` or a real auto tier) + boot-snippet doc in
       installation. Accept: no-JS link-the-CSS page renders coherently under
       dark OS emulation.
       **Done 2026-08-15**: library default is now `color-scheme: light`
       (`light dark` was the docs-MPA gap fix leaking into the library — an
       app-level decision via `<meta name="color-scheme">`, which the docs
       already carry); `[data-theme]` rules unchanged. CDP-verified: dark-OS
       no-JS page computes colorScheme `light` (coherent); opting in via
       data-theme=dark computes `dark` + dark tokens. Installation skeleton
       gains the pre-paint boot snippet. BONUS: this closed the 1.0-list
       item-9 "solid square checkbox" mystery — our own visual baselines had
       the mixed-mode bug on camera (headless prefers dark); baselines now
       show correct checkboxes.
7. [x] **Forced-colors sweep** (Rex M). 7/25 components have forced-colors
       rules; sweep the remaining 18 (or publicly scope the claim). Accept:
       every component either covered or named in a documented scope list;
       CDP forced-colors spot-verification on the worst three.
       **Done 2026-08-15**: evidence-first — CDP screenshots of the 6
       highest-risk components. Tabs (border indicator) and timeline
       (per-state glyphs) survive with no rules; three real breaks fixed
       (skeleton vanished entirely; combobox active option
       indistinguishable; stepper current-vs-pending color-only) and
       re-verified fixed under emulation. Accessibility page documents the
       strategy + the explicit-rules list (10 components) — the honest scope
       statement instead of a blanket claim. README size gate self-triggered
       on the CSS growth and was re-stamped (9.4 kB gz).
8. [x] **Generated keyboard map + docs skip link** (Ines M). Per-behavior
       Arrow/Esc/Home/End table extracted from source onto js-behaviors +
       component pages; skip link targeting the existing `#main-content`.
       Accept: map generated not hand-written; skip link first-focusable.
       **Done 2026-08-15**: `@keymap`/`@key` JSDoc on the 4 behaviors that
       own real key handling (combobox, data-grid, tabs, dialog — Esc +
       focus-trap); `extract-keymap.mjs` -> `dist/keymap.json`
       (`@busy-office/ui/keymap`), gated (a `@keymap` naming a non-existent
       init fails the build — proven). js-behaviors page renders the
       generated table (11 rows), scoping honestly to "everything else is
       native or has no keyboard surface" rather than padding the list.
       Skip link added to the docs shell: DOM-verified first-focusable,
       hidden off-screen unfocused / visible on focus, targets the real
       `#main-content`; screenshotted live. 56 tests, both link checks,
       32 baselines untouched.
9. [x] **Editable-grid recipe** (Devi HIGH). The screen-#40 page: combobox
       in a cell, cell-level error pattern, add/remove line, what
       `data-grid-nav` does and doesn't compose with. Accept: one recipe page
       with a working demo + honest limits, linked from data-table.
10. [x] **po-app reachability** (Devi M). Link `examples/po-app` wherever the
       docs cite it. Accept: every textual mention is a link.
       **Done 2026-08-15**: all 3 textual mentions on data-table now link
       the GitHub tree (200 verified).

**[HUMAN CALL]s from the review** (owner, whenever ready — defaults proposed
in the grill doc): keep `data-theme`/`data-density` unprefixed and commit, or
prefix now; declare `--bo-palette-*` internal in the versioning policy; run
the AT hardware pass (VoiceOver/NVDA) that Slice 15's ACR blocks on.

## Slice 15 (in progress — item 12 owner-gated) — conformance artifacts

11. [x] **Generated ACR** (Ines). VPAT-2.5-shaped page: WCAG 2.2 AA criterion
       × component, verdicts Supports / Conditional-on-adopter / Not
       Evaluated, generated from api.json + contrast.json + behaviors.json +
       the guarantees split. Accept: page generated, gated, linked from the
       accessibility concept; Not-Evaluated rows cite the AT gate.
12. [ ] **AT runtime evidence** — NEEDS-RUNTIME (owner hardware): combobox
       activedescendant, data-grid implicit roles, selection live-region on
       VoiceOver + NVDA; results recorded in `.roundtable/` and cited by the
       ACR.

## Slice 16 — docs IA, compared against 5 CSS frameworks (user wishlist)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Closed — archived verbatim in `ROADMAP-archive.md`.

## Done — Slice 18: money & editable-table depth (user wishlist, all 5 items shipped 2026-08-16)

Triaged 2026-08-16 from a 4-item user wishlist, refined interactively before
queuing (4 design forks put to the user + a codebase audit of what already
exists — see the audit summary in the triage conversation). User's calls:
currency→decimals table **built into the framework with app override**;
subtotal recalculation offered in **both** modes (declarative auto-sum AND
event-driven); advanced cell types include **date + checkbox** beyond
text/dropdown/tag; docs must progress **simple → medium → complex** ending in
a realistic generic-ERP composite. Two scoping defaults taken by the
dispatcher (flagged, challengeable at the next Objective review): (a) units
get a documented common-UOM reference, NOT an embedded table — no ISO-closed
list of units exists (UN/ECE Rec 20 alone is ~2,000 codes), unlike ISO 4217;
(b) the embedded currency table and the auto-sum mode are BOTH deliberate,
named exceptions to the "framework does visuals, you do the data" split —
each is the only workable reading of the user's explicit ask, not drift.
SQLite-for-roadmap considered and declined per the storage doctrine
(markdown = reviewed/diffed source of truth; SQLite = derived mirrors only).

1. [x] **Currency-aware Money field** (`.bo-money` + `initMoneyField()`) —
       shipped 2026-08-16. All Accept criteria met: behavior + CSS + docs
       page (`/components/money`, Data input group); 5 new tests (66
       total) covering default/exception/override/input-event +
       `currencyDecimals` export; currency-decimals reference documented
       (exception table + default-2 rule + ISO amendment caveat);
       live-verified in the bind-mounted container with REAL currency
       switches (USD→JPY→BHD→EUR reformat + step, option-level
       `data-decimals="4"` override, JPY/KWD inside a form field), both
       themes, component measured 222px wide (fits 390 trivially), zero
       console errors. Two build-infra finds along the way:
       `extract-behaviors.mjs`'s `.d.ts` assert only caught the FIRST
       name per export brace + init/refresh/trap-prefixed names — parsing
       the full brace list now (would have silently missed any future
       non-init export); README stamp updated (19 behaviors, 10.0 kB gz).
       Per the LOOPS.md shared-selector lesson: the new sidebar entry
       renders on every page, so test:visual was run — all 32 baselines
       legitimately shifted (~37px taller sidebar), regenerated, stable
       across 2 clean re-runs.
       A currency `<select>` linked to an amount input: changing currency
       updates the input's `step`/decimal precision live and reformats the
       current value. Decimals come from an embedded ISO 4217 minor-units
       exception table (0-decimal: JPY, KRW, VND, ISK, CLP, PYG, XAF, XOF,
       XPF, BIF, DJF, GNF, KMF, RWF, UGX, VUV, UYI; 3-decimal: BHD, IQD,
       JOD, KWD, LYD, OMR, TND; 4-decimal: CLF, UYW; **everything else 2**)
       — kept tiny by storing only exceptions + the default-2 rule, so the
       shipped JS stays lean; a `data-decimals` attribute (on the selected
       option or container) **overrides** the table when the app supplies
       its own. Reformatting dispatches a bubbling `input` event so
       row-edit's dirty tracking sees it (the combobox-commit lesson).
       Docs: full currency-decimals reference documented as the exception
       table + the explicit "all other ISO 4217 currencies use 2" rule.
       Accept: behavior + component CSS + docs page shipped; tests cover
       default/exception/override/input-event; reference table documented;
       all gates green; live-verified 1440+390, light+dark.
2. [x] **Quantity display variant + embedded unit table** — shipped
       2026-08-16, all Accept criteria met: `--display` span variant
       (`__value` + `__unit`, no JS) closes the display/edit asymmetry
       with Amount; embedded unit table shipped inside `initQuantity()`
       (`unitDecimals()` exported, ~30 common-ERP units, unknown → 0)
       driving a new interactive `select.bo-quantity__unit-select` part —
       change unit, step/decimals re-derive and the value reformats, same
       mechanics as Money (shared `decimal-input` util extracted so the
       two behaviors don't duplicate the reformat+dispatch logic);
       `data-decimals` override verified; complete built-in table
       documented on the page (every unit listed + the default-0 rule);
       cross-linked Amount ↔ Quantity ↔ Money in all directions. 2 new
       tests (68 total). Live-verified: real unit switches (kg 2.50 →
       each 3 → g 3.00 → box 3), step-button still correct after a unit
       change (+0.01 → 3.01), display variant renders inline, both
       themes, 192px control fits 390 trivially, zero console errors.
       test:visual caught exactly the landing page's regenerated stat
       line (61→62 kB min) — pixel-diff-confirmed as the stats text, not
       a regression; baselines regenerated, stable across 2 re-runs.
       Original scope text (superseded by the user's follow-up): read-only
       quantity+unit display closing the asymmetry with Amount (which has
       both a read-only span and an editable recipe; Quantity today is
       edit-only). **Scope updated 2026-08-16 (user follow-up: "units
       embedded but we also need to ensure documented for all types")**:
       units ALSO get an embedded default-decimals table (common-UOM set:
       each/box/pallet/pcs → 0; kg/g/t/L/mL/m/cm/mm/m²/m³ → 2; hr → 2,
       min → 0; …), same override-wins contract as currency (`step`/
       `data-decimals` supplied by the app beats the table), PLUS full
       documentation of every embedded unit type on the Quantity page.
       Unlike ISO 4217 there is no closed unit list, so the table is a
       pragmatic common-ERP set, documented as extensible via override —
       not a claim of completeness. Accept: display markup documented with
       demos; embedded unit table shipped + fully documented (every unit
       type listed); override verified; cross-links both ways with Amount;
       gates green, live-verified.
3. [x] **Editable Amount+Currency and Quantity+Unit table cells** —
       shipped 2026-08-16, Accept met. New "Money & unit cells" section on
       `/patterns/editable-grid`: money field + quantity-with-unit-select
       inside a `data-row-edit` row, currency/unit as real separate
       fields. Meeting the Accept honestly required pulling ONE small
       piece of item 4 forward: `rowFields()` only handled
       input/textarea, so a changed currency/unit select would have
       survived Cancel and been skipped by Save's re-baseline — extended
       to selects (reset via per-option `defaultSelected`, baseline
       symmetrically), a `change` listener marks select-only edits dirty,
       and a genuinely-reset select re-fires `change` so precision
       re-derives from the restored currency/unit instead of sticking at
       the abandoned one (found by reasoning through the Cancel corner,
       confirmed live: JPY step=1 → Cancel → step back to 0.01).
       CHANGELOG **Breaking** entry added — `initRowEdit` is one of the
       18 stable behaviors, and selects-now-tracked is an observable
       contract-shape change per the freeze policy. 2 new composition
       tests (70 total). Live-verified end-to-end: currency change →
       dirty + reformat, unit change → reformat, Cancel restores
       selection+value+precision on BOTH compositions, Save re-baselines
       (later Cancel keeps SGD, not the original USD), `bo:row-save`
       fires with the right rowId, both themes, zero console errors, 32
       baselines untouched (verified, not assumed).
4. [x] **Advanced editable table** — shipped 2026-08-16, all Accept
       criteria met, lean as asked (row-edit extended + one small general
       `initTableSum()`, no parallel grid). (a) All cell types live in the
       new "Advanced" demo: text, select (item 3), date, checkbox
       (reset/baseline via `defaultChecked`), tag-input cell (dirty via
       the bubbling tag intent events; chips restored on Cancel through
       the consumer `bo:row-cancel` hook, since the framework doesn't own
       chip data). (b) `bo:cell-change` (rowId/field/value) on every
       committed edit — selects handled in the change listener only, so
       real browsers' double input+change never double-fires a consumer's
       subtotal math. (c) Subtotals in BOTH modes: `data-sum-of` auto-sum
       (decimals from the widest summed step, `data-decimals` override)
       AND the event for custom math. (d) BOTH save models:
       batch (unchanged default) and `data-row-edit="live"` — committed
       changes dispatch `bo:row-save` + re-baseline instantly; tag adds
       defer a microtask so the consumer's chip append lands first.
       **Two real bugs caught by the live verify-adjust cycle, not by the
       passing tests**: (1) Cancel restored values silently, leaving the
       auto-sum total stale — fixed by announcing genuinely-restored
       fields with a real `input` event (the combobox-lesson doctrine
       applied to restores), regression-tested; (2) `CSS.escape` missing
       in jsdom — fallback added. 6 new tests (76 total). Events gate
       picked up `bo:cell-change`/`bo:row-cancel` automatically (9
       events). CHANGELOG: Breaking entry extended (checkbox +
       announce-on-restore), Added entries for the new surface.
       Live-verified end-to-end both themes: realtime total on edit AND
       on cancel-restore, tag add via real Enter keydown (dedupe
       working), chips restored on Cancel, live-mode save log firing,
       zero console errors; landing-page baselines regenerated (stat
       line: 20 behaviors · 9 events), stable across 2 re-runs.
5. [x] **Docs progression: simple → medium → complex** — shipped
       2026-08-16, Accept met; **Slice 18 complete**. The editable-table
       story now reads as one graded path: the data-table page's inline-
       edit section is framed as the *simple* start and forward-links the
       continuation; the editable-grid pattern opens with the progression
       map (simple → medium → advanced → full picture), its first demo
       titled *Medium*; and a new composite **PO line-items editor**
       closes it: product dropdown, quantity+unit-select, price+currency,
       computed line totals (custom math on `bo:cell-change`, formatted
       per-row via the exported `currencyDecimals()`), tag cost centers,
       auto-sum qty total, and a grand total that honestly shows "mixed"
       when row currencies differ (a totals decision the framework
       correctly leaves to the app). Live-verified end-to-end with real
       interactions: stepping qty via the button recomputed line 49.60 →
       62.00 and grand 1769.60 → 1782.00; switching a row to JPY
       reformatted price AND line total to 0 decimals with grand →
       "mixed"; Cancel walked every computed cell back (the
       announce-on-restore feed doing exactly what it was built for).
       Both themes, zero console errors, both link checks (plain +
       DOCS_BASE), page-shape gate green.

## Done — Slice 19: hardening from the Slice 18 grill (all 6 items shipped 2026-08-16)

Queued by the milestone-rule Objective review at Slice 18's close — four
adversarial seats (Architect / ERP domain / Skeptic / A11y+Docs), full
scored report: `.roundtable/grill-slice18-money-editable-2026-08-16.md`.
Every item below is Evidence-graded there (≥2 independent seats, or
seat + code-walk). Ranked by severity: data-integrity first.

1. [x] **Non-destructive `setInputDecimals`** — shipped 2026-08-16
       (red-first: 5 tests flipped to the new contract and confirmed
       failing against shipped code before the fix). Reformat applies
       only when numerically identical (pad/trim); lossy cases leave the
       value and surface via native step mismatch; unknown units leave
       precision ENTIRELY alone (`unitDecimals()` now returns
       `undefined`, the change listener no-ops); >MAX_SAFE_INTEGER /
       non-finite left alone. Docs + CHANGELOG amended (both Unreleased
       entries now state the lossless contract; unit-table docs no
       longer claim the default-0). Live-verified the exact grill
       scenarios: JPY on a 12.40 price keeps 12.40 (line total still
       computes at 0 dp); unknown unit `MT` touches nothing; `each` on
       2.50 no longer rounds. 76 tests green. One test-harness find:
       jsdom's `selectedIndex` setter silently no-ops after a value
       set — value-based selection used instead. (E1 — all three
       technical seats independently). Reformatting must never change the numeric
       value: pad/trim only when numerically equal; otherwise adjust
       `step` and leave the value untouched. Unknown units leave
       precision alone (today's `?? 0` silently rewrites 2.5 → 3 for any
       UOM outside the table — the NORMAL case for real master data).
       Guard `-0`, `1e21`+, and >MAX_SAFE_INTEGER artifacts. Accept:
       JPY-switch on 12.40 no longer rounds it; unknown unit leaves
       2.5 alone; tests for each; CHANGELOG entry (contract fix).
2. [x] **Live-mode save integrity** — shipped 2026-08-16, red-first (4
       tests written to the grill's exact repro mechanics, all confirmed
       failing against shipped code): (a) a `cancelling` flag suppresses
       save/dirty from mid-Cancel restore events (the select-reset change
       previously turned Cancel into a Save of the abandoned values);
       (b) live saves are microtask-deferred + coalesced per row per
       tick, so same-tick money/unit reformats land before the save
       reads the row (the sync save previously captured the
       pre-reformat value); (c) a row detached before the deferred save
       runs is never saved or mutated (the tag-save path unified onto
       the same helper). Contract docs + CHANGELOG amended. Live-
       verified: live-mode demo saves per committed change; batch
       Cancel on the composite still fully restores. 80 tests green.
       One test-design lesson recorded in the test itself: a live-mode
       select change legitimately saves+baselines, so the Cancel repro
       needs mid-edit state with NO committed change. (E3, H3). (a) Cancel re-entrancy
       guard — today a select-reset's `change` fires `saveRow`
       mid-cancel, persisting and baselining the values the user asked
       to discard; (b) defer live saves a microtask so same-tick
       reformats (money/unit) land before the save reads the row —
       today `bo:row-save` carries the old-precision value; (c) guard
       the deferred save against a row detached in the same tick
       (today: silently lost). Accept: red-first tests for all three;
       live+batch behavior verified live.
3. [x] **Focus management on Save/Cancel** — shipped 2026-08-16,
       red-first (2 tests failing against shipped code: activeElement
       stayed on the hidden button). `refocusIntoRow()`: when the
       activated Save/Cancel button held focus, move it to the row's
       first usable field BEFORE hiding — focus held anywhere else is
       never stolen (third test pins that). Per-row distinguishable
       labels added across both multi-row demos (tag groups, add-fields,
       Save/Cancel now all name their line). Live-verified with a real
       focus walk: focus button → click → activeElement is the row's
       first field on both Save and Cancel paths. Axe zero across all
       60 pages. 83 tests green. CHANGELOG folded into the row-edit
       entry. (H4, H8.)
4. [x] **`initTableSum` robustness** — shipped 2026-08-16, red-first
       (3 tests failing against shipped code). `step="any"`/missing
       steps carry no precision info and now fall back to the values'
       own decimal places (7.50 no longer collapses to 8); nested
       tables: only THIS table's own rows sum (`closest('table') ===
       table` filter — the 99.00 inner-table field no longer leaks into
       the outer total), with the inner-edit→outer-sum crossing left
       unsupported and DOCUMENTED in the behavior contract; checkboxes/
       radios sharing the summed name are excluded. Decimals capped at
       6. Live-regression-verified: advanced (9.00 at 2dp) and
       composite (whole-step 7, grand 1782.00) sums unchanged.
       86 tests green. (H1/H2 + Architect's checkbox find.)
5. [x] **Announcement pass** — shipped 2026-08-16 (demos + contract
       docs, no framework code). Visible totals keep realtime updates
       for sighted users; `aria-live` moved OFF the per-keystroke-
       updating cells onto one visually-hidden status per table, written
       by a `change` listener — exactly one polite announcement per
       committed edit (blur for text, immediate for select/checkbox/
       stepper), summary includes the edited line's total (parity with
       the grand total). table-sum's contract doc now documents this
       recipe instead of the aria-live-on-cell advice it replaced;
       money's ApiTable documents the 4.1.3 story (a programmatic value
       change has no reliable SR channel — announce the consequence in
       the committed-change status; the field reads its new value on
       next focus). Live-verified: two keystrokes → status empty while
       the visible total updates; commit → one full summary; stepper →
       announces; zero aria-live left on visible cells. (E4.)
6. [x] **Docs batch** — shipped 2026-08-16; **Slice 19 complete, all
       grill Evidence findings closed**. All seven fixes landed:
       "Two real-ERP notes" callout on the composite (currency lives on
       the document, "mixed" should be a validation error in most
       systems; unit prices often need MORE precision than the
       currency's amount decimals — data-decimals is the vehicle); the
       intro progression map names all five sections; money AND
       quantity cross-link the composite; the composite's product cell
       is now a real combobox (consistent with the Medium teaching —
       live-verified: type-to-filter, pick, dirty, Cancel restores);
       t/kg convention note on the unit table; live-mode per-field vs
       row-exit trade-off note with the batch-mode alternative named.
       Both link checks green, page-shape green, zero console errors.

**Deferred, recorded** (revisit at the next contract-shape change, not
before): generic `bo:dirty` seam replacing the tag-event allowlist (H6);
`isLive` value normalization (H5).

## Done — Slice 20: docs hardening & depth (all 5 items shipped 2026-08-16)

Triaged 2026-08-16 from a 5-item user wishlist ("hardness the documents"),
with an attachment showing Tailwind's docs version-switcher dropdown as the
reference for item 3, and Tailwind v4.3's new palettes
(mauve/olive/mist/taupe) as the seed for item 5. Ground-truthed against the
codebase before queuing: no syntax highlighting exists anywhere (Demo and
Markup blocks are plain escaped `<pre><code>` — Astro's shiki only touches
markdown); Tree is a native-details NAVIGATION tree with no tree-table;
exactly one brand preset ships (indigo) on a proven contrast-gated
mechanism; Versioned docs was parked post-1.0 and this ask GRADUATES it.
Ranked: quick wins that harden every page first, then the two build items.

1. [x] **Code blocks: syntax highlighting site-wide** — shipped
       2026-08-16. Build-time Shiki as a POST-BUILD transform
       (`highlight-code.mjs`): one mechanism highlights all 114 blocks
       across 47 pages with zero per-page edits — the less-for-more
       shape. github-light's palette remapped wholesale to `--bo-code-*`
       vars defined from existing core tokens on `bg-muted`, so theming
       rides the normal `data-theme` contract (verified live both
       themes) and AA is inherited from gated token pairs. Two gates
       protect it: an unmapped-hex assert in the transform (theme drift
       fails the build), and 5 new 4.5:1 TEXT pairs in the core contrast
       gate (32 pairs total) — which matters because **axe caught a real
       violation the hex-map couldn't**: the first slot choice used
       `--bo-color-danger` (gated 3:1 as a non-text fill, only 4.39:1 in
       light) — swapped to `--bo-color-danger-text` (5.88/7.57), axe now
       zero across all 60 pages at both widths. Copy buttons verified
       working (spans preserve textContent; copies now get real chars,
       not escaped entities); Shiki's `tabindex="0"` on pre is an
       incidental keyboard win. DOCS_BASE build green; 32 baselines
       regenerated deliberately, stable ×2; 86 tests unchanged. Every `<pre><code>` today is unstyled plain text. Add
       build-time highlighting (Shiki, already in Astro's dependency
       tree — no client JS, no CDN, CSP-safe) wired through `Demo.astro`
       and the hand-authored Markup sections; theme-aware (light/dark via
       the existing data-theme contract, not a separate highlighter
       theme flip); AA contrast for token colors in both themes (extend
       the contrast gate's PAIRS if new colour pairings ship). Accept:
       highlighted blocks on component + pattern pages in both themes,
       copy buttons still work, axe zero, contrast gate covers the new
       colors, visual baselines regenerated deliberately.
2. [x] **Docs IA pass 2: rearrange contents/components/patterns** —
       shipped 2026-08-16, Accept met. Compare-first evidence fetched
       live (Tailwind: curated/property-clustered WITHIN sections — its
       own listing disproves alphabetical; Ant: alphabetical; Carbon:
       truncates on fetch, recorded as memory not evidence): two
       legitimate schools, curated wins for 4-10-item groups (a short
       list reads as a path, not an index). Applied: within-group
       learning-path ordering (Money field up beside Forms/Filters;
       data-type family adjacent in Data display; Loading/empty/error up
       in Feedback), the flat 12-pattern list split into three workflow
       groups (capture & edit / review & approve / overview & shell),
       and a "Find it by task" contents block on the landing routing
       into every group. Rationale + before/after:
       `.roundtable/docs-ia-2-2026-08-16.md`. Zero URL changes.
       Verified live: all three pattern groups render, aria-current
       syncs inside them, both themes, zero console errors; both link
       checks (plain + DOCS_BASE, 3799 links) green; 32 baselines
       regenerated (sidebar renders on every page), stable ×2.
3. [x] **Docs version switcher** — shipped 2026-08-16, all Accept
       criteria met. Tailwind-style select replaces the static version
       badge; snapshots serve at `/v/<version>/`; the switcher strips
       any `/v/<ver>` suffix from its own base to compute the SITE root,
       so "latest" from inside a snapshot escapes instead of looping
       (the design's one real trap, verified live both directions on
       the :8082 production-parity mimic: latest→snapshot→latest).
       Mechanism: `cut-version-snapshot.mjs` builds with the snapshot's
       Pages base and commits to `apps/docs/versions/<ver>/` (pagefind
       stripped — search stays a latest-docs feature, 1MB/version
       saved); the Pages workflow copies committed snapshots into
       `dist/v/` on every deploy; `versions.json` feeds the select. A
       REAL 0.1.1 snapshot cut and verified (200s, switcher state
       correct inside it, dark theme). Release flow documented on the
       versioning page. Growth note: ~4.3MB/version committed — revisit
       storage if the repo feels it after a few majors.
       A version dropdown in the docs header (Tailwind-style): current
       docs at the canonical root, versioned snapshots under
       `/v/<version>/`, the switcher navigating between them; the
       snapshot mechanism wired into the release flow (Pages deploy
       keeps prior snapshots). Pre-1.0 reality: one live version (0.1.x)
       + the mechanism proven with a real snapshot cut at the next
       release. Accept: switcher renders + navigates live; a snapshot of
       the current docs actually built and served under its version path
       (verified in the container, both themes); base-path (DOCS_BASE)
       build verified — this item is maximally exposed to the base-URL
       class of bug; release-flow doc updated.
4. [x] **Tree table** — shipped 2026-08-16, all Accept criteria met.
       ADR decided FIRST with evidence
       (`.roundtable/adr-tree-table-2026-08-16.md`): plain `<table>` +
       disclosure buttons, deliberately NOT `role="treegrid"` — native
       table browse mode beats the weakest-supported APG composite for
       read-mostly hierarchy (three project precedents cited; reopen
       condition: a real adopter's AT workflow needing aria-level).
       `.bo-tree-table` on a `.bo-data-table`: 6 explicit indent levels
       (attr()-calc unsafe at the FF128 floor), `__toggle` (chevron
       rotation decorative, aria-expanded + genuinely-hidden rows are
       the contract, forced-colors border, reduced-motion), `__spacer`
       for leaf alignment. `initTreeTable()` (21 behaviors): collapse
       hides ALL descendants; expand preserves nested collapsed state.
       3 tests pass FIRST TRY incl. the grandchild-stays-hidden case
       (89 total). Docs: graded demos (BOM, pre-collapsed budgets), the
       when-to-use-which + why-not-treegrid section, totals-interplay
       note; Tree page cross-linked both ways with guidance. Verified
       live: full collapse/expand cycle incl. the nested-preservation
       subtlety, both themes, 32px level-2 indent measured, zero
       console errors; baselines regenerated (new sidebar entry),
       stable ×2. The existing
       `.bo-tree` covers hierarchy NAVIGATION; a tree-table is
       hierarchical ROWS in a data table — BOM explosion, account
       rollups, org-unit budgets: expand/collapse parent rows,
       indent-by-level cell, ARIA per the APG treegrid-vs-table
       decision (start from the honest question of whether
       `role="treegrid"` or a plain table + disclosure buttons +
       `aria-expanded` serves ERP row-hierarchy better — the Tree
       component's own "navigation, not APG TreeView" reasoning
       suggests the lighter shape; decide with evidence, record the
       ADR). Composes with existing row primitives (badges, numeric
       cols, row-edit where sensible); auto-sum interplay documented
       (subtotal rows vs data-sum-of). Also: harden the existing Tree
       page with a cross-link + when-to-use-which guidance. Accept:
       component + behavior (if JS needed) + docs page with the graded
       recipe; keyboard + SR story stated; tests; gates green;
       live-verified both themes/widths.
5. [x] **SUPERSEDED — delivered by Slice 22 item 1** (reconciliation
       2026-08-16): the scale system shipped six ERP presets (graphite/
       cobalt/navy/forest/indigo/violet, step-aliased and contrast-
       gated) plus the generated Palettes reference page — everything
       this item asked for and more. Original text kept for the record:
       **Palette system** (wishlist, seeded by Tailwind v4.3's
       mauve/olive/mist/taupe). Grow the proven brand-preset mechanism
       into a small named-palette SYSTEM: 3-4 new presets built the
       brand-indigo way (accent family + focus-ring + bg-selected,
       light+dark, contrast-gated automatically by the existing brand
       scan), plus a "Palettes" reference page — every palette's
       swatches, token values, and hex rendered from the shipped CSS
       (generated, not hand-painted), the pantone-style reference the
       user named. Accept: each new palette passes the full 27-pair
       contrast gate in both themes; reference page generated from the
       artifact; live demo per palette (the theming page's scoped
       preview mechanism); docs state the recipe for app-defined
       palettes.

## Done — Slice 21: hardening from the Slice 20 grill (all 5 items shipped 2026-08-16)

Queued by the milestone-rule Objective review at Slice 20's close — four
adversarial seats, full scored report:
`.roundtable/grill-slice20-docs-depth-2026-08-16.md`. The meta-finding
names the slice's shared defect: mechanisms that fail OPEN and SILENT —
this slice adds the assertions that make Slice 20's depth verifiable.
Ranked: user-visible breakage first.

1. [x] **Highlight integrity** — shipped 2026-08-16, red-first at
       every step. The none-left-behind gate was built BEFORE the fix
       and went red on the shipped defect (exactly the 8 blocks the
       Skeptic predicted); mid-fix it flushed out 3 MORE
       (`<code>`-attributed theming blocks the seats hadn't counted);
       green now at 125 blocks / 50 pages. Matcher accepts attributed
       pres (class merged into code-hl, tabindex/data-astro-cid
       carried verbatim; own output excluded for idempotency); the
       strip fails loudly if Shiki's pre shape drifts; zero-blocks is a
       failure; the `&#38;`/`&amp;` decode order fixed (H1). Token
       slots + box moved to a shared stylesheet imported by BOTH the
       docs shell and the landing page (landing pres are outside
       .docs-content — without this the newly-highlighted homepage
       would have had unstyled vars). Live-verified: all 6 landing
       blocks highlighted with attrs preserved, spans measured, both
       link checks green, baselines regenerated (landing/theming
       changed), stable ×2. (E1 + H1.) The homepage shipped
       UNHIGHLIGHTED code while the build printed green: the transform's
       regex requires a zero-attribute `<pre>`, skipping the six
       hand-written landing blocks + theming's two. Fix: match
       attributed pres (or normalize hand-written blocks through the
       transform), add the none-left-behind gate (fail on any surviving
       `<pre...><code` in dist), make the strip fail loudly when it
       doesn't strip, fix the `&#38;`-before-`&amp;` decode order.
       Accept: landing + theming blocks highlighted live both themes;
       the new gate proven red (attribute a pre, watch it fail); tests/
       gates green; baselines regenerated deliberately.
2. [x] **Palettes conformance** — shipped 2026-08-16. The preview now
       FOLLOWS the ambient theme (light values in light, the palette's
       dark values under `[data-theme="dark"]`) — more honest than the
       old light-only box and conformant by construction: the grill's
       exact failing pairs re-measured live at 7.07:1 (mauve, was 2.10)
       and 7.73:1 (mist, was 2.11). Parse assertions added and PROVEN
       RED (a var()-valued token fails the build with a named error;
       comment-stripping first, exactly-one dark block, all 7 tokens
       required per theme, hex-only). Swatches aria-hidden; the
       why-status-colors-are-out-of-scope paragraph added (semantics
       must read identically across brands). Axe zero across 62 pages;
       baselines untouched (verified). (E3 + H4 + H5.) The preview ships
       measured 2.10:1 text in dark mode on the very page claiming
       everything is gated. Fix: scope the full light surface set onto
       the preview (or render light+dark boxes each on its own
       background); assert the brand parse (exactly two blocks,
       hex-only values — fail the build otherwise); aria-hidden
       swatches; add the why-status-colors-are-out-of-scope paragraph.
       Accept: axe + manual ratio check clean in dark; parse assertions
       proven red; live-verified.
3. [x] **Tree-table structural seams** — shipped 2026-08-16, red-first
       (3 of 6 new tests failed against shipped code; 2 paths held and
       are now pinned). descendants() walks the TABLE's tbody rows in
       document order — collapse spans `</tbody>` boundaries (verified
       live with a constructed two-tbody table); a toggle with no
       following deeper rows is INERT, so the chevron never lies over a
       missing/typo'd `data-tree-level` (the silent-desync case
       converted to visible inertness, documented); indent extended to
       level 12 with the "modelling smell" claim retracted (real BOMs
       run 8-12); `bo:tree-toggle` dispatched (row/level/expanded — the
       fetch-on-expand + expand-all/to-level hook; events gate at 10);
       every demo renamed verb-less (aria-expanded carries state — a
       baked-in Collapse/Expand prefix goes stale on first toggle);
       keyboard story + volume/lazy-load guidance + inert-toggle
       debugging note on the page; ADR now a clickable repo link.
       94 tests; live-verified event/labels/cross-tbody/inert; landing
       baselines regenerated (64 kB stat), stable ×2. (E2.) descendants() spans
       tbodies; missing/invalid `data-tree-level` handled honestly
       (documented behavior, not silent truncation); indent to level 12
       (real BOMs hit 8-12 — the "modelling smell" claim retracted);
       dispatch `bo:tree-toggle` (rowId-ish detail; the fetch-on-expand
       / expand-all hook) + docs volume guidance + expand-to-level
       recipe; verb-less disclosure naming in every demo (name the
       branch, let aria-expanded carry state — retires the stale
       "Collapse X" label pattern); cover the six untested paths
       (missing level, second tbody, no-data-tree-table guard, skipped
       levels, toggle-less branch, double init). Accept: red-first
       tests for each; events gate picks up the new event; live-verify
       incl. a two-tbody table.
4. [x] **Switcher operations** — shipped 2026-08-16, all Accept met.
       One-command release: `cut-version-snapshot.mjs` writes
       `versions.json` itself (sorted, idempotent); new
       `check-versions.mjs` gate in every docs build asserts each entry
       has a committed snapshot index — PROVEN RED with a fake 9.9.9
       entry (the exact human slip that previously shipped an uncaught
       live 404). Frozen-docs banner renders in the snapshot header
       (amber pill: "v0.1.1 snapshot — does not update — switch to
       latest"), absent on latest, escape link verified by real click
       on the production-parity mimic (one false alarm en route
       correctly diagnosed as browser bfcache, confirmed by hard
       reload); first banner placement rendered OFF-viewport above the
       fixed app-shell — caught live, moved into the header's wrap row.
       Search UI (sidebar box + Cmd/K dialog) is build-time absent in
       snapshots (their pagefind is stripped; only null-guarded script
       refs remain, zero console errors). The banner's deliberate
       outside-base escape link needed a NARROW sanctioned exception in
       check-links (only exactly siteRoot from a /v/ base — everything
       else outside base still fails). Frozen-dropdown reality
       documented on the versioning page. Snapshot re-cut via the new
       one-command flow. (E4.) One-command release:
       `cut-version-snapshot.mjs` writes `versions.json` itself; a gate
       asserts every entry has a committed `versions/<v>/index.html`
       (the likeliest human slip currently ships a live 404 nothing
       catches); a frozen-docs banner on snapshot pages (from the
       already-computed `currentSnapshot`); hide the search UI where
       pagefind is absent (snapshots currently ship a dead search
       dialog); document the frozen-dropdown reality. Accept: gate
       proven red; banner + hidden search verified in the snapshot via
       the base-root mimic; release-flow doc updated to one command.
5. [x] **Docs/IA batch** — shipped 2026-08-16; **SLICE 21 COMPLETE,
       every Slice 20 grill finding closed**. Tree table now sits
       directly beside Tree (the disambiguation pair, verified live);
       Palettes beside Colors & tokens; the versioning known-gap note
       got its own emphasized paragraph (was buried mid-paragraph). The
       keyboard story + clickable ADR shipped early with item 3 and are
       noted here for the audit trail. Links/page-shape green, both
       themes verified, baselines regenerated for the sidebar moves,
       stable ×2, zero console errors. (H2 + H3.)

**Held under attack** (recorded): idempotent re-highlight, node-walk
correctness, guard ordering, hidden-rows-summed doc/code agreement,
switcher listener scoping, detectLang in practice, swatch hex adjacency,
highlighting's (correct) absence of a11y claims. The architect's
"no escape from snapshots" reduced on live re-check to the banner gap
(docs pages inside snapshots DO carry a working switcher).

## Slice 22 — scale system, rich text, WYSIWYG table (user wishlist, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 23 — docs IA & depth (owner review, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Triage decisions — refuse/rethink log (per the Objective)

- **2026-08-16 — "Should we enforce only TypeScript?" (user ask) —
  PARTLY ALREADY TRUE, REMAINDER REFUSED.** Ground truth: everything
  that ships as JS is ALREADY authored in TypeScript
  (`packages/core/src/js/**/*.ts` → compiled ESM + generated `.d.ts`,
  gated by the behaviors-vs-`.d.ts` parity check) — author-side
  TypeScript is enforced today by construction. The two possible
  "more" readings both fail the Objective's tests:
  (a) requiring TypeScript OF CONSUMERS — refused on reusability: the
  framework's whole contract is plain classes + `data-*` attributes
  that work with zero build step (po-app consumes the tarball from a
  dependency-free Node server; the installation page's vendor-the-dist
  story serves Rails/Django/PHP/Go) — a TS requirement would shrink
  who can use it while adding nothing a `.d.ts` doesn't already give
  TS users; (b) converting the ~20 internal build scripts (`.mjs`) to
  TypeScript — refused on less-for-more: adds a compile step to the
  build's own tooling for zero shipped-artifact difference; the
  scripts are small, single-purpose, and already exercised by the
  gates they implement. Standing rule recorded: new SHIPPED runtime
  code is TypeScript (as it already is); build tooling stays plain
  `.mjs`; consumers are never required to use TypeScript. Reopens only
  if a real defect traces to an untyped build script.

## Explore log

- [x] **2026-08-15 — po-app consumer image broken by the README-stamp gate**
      (Explore find, triaged and fixed same wake). `stamp-readme.mjs`
      required the repo-root README.md, but `examples/po-app`'s Dockerfile
      build stage deliberately copies only `packages/core` — the minimal
      context that exists specifically to prove the real npm package
      boundary. That context legitimately has no root README (it never
      ships to npm anyway). Fixed: the root README participates only if
      present; its absence in an isolated build is not an error, only
      `packages/core/README.md` (`requireAll: true`) still gates. Verified
      both ways: full-repo `--check` still stamps/verifies both files;
      `podman build` of the po-app image now succeeds end-to-end (built,
      ran, served `/pos` 200 with real content). This had been silently
      broken since Slice 14 item 1 shipped — po-app isn't in CI, so nothing
      caught it until this Explore wake actually ran the build.

- [x] **2026-08-16 — `npm audit`'s 7 vulnerabilities (1 critical, 3 high, 3
      moderate) audited per-advisory; confirmed inert, deliberately deferred**
      (Explore find). All 7 land in devDependencies only — confirmed
      `packages/core/package.json` has zero runtime `dependencies`, so npm
      never installs any of them for a consumer of `@busy-office/ui`. Went
      past that blanket fact to check each advisory's actual exploit
      precondition against how this repo really uses the tool:
      - **vitest (critical, GHSA-5xrq-8626-4rwp)** — "arbitrary file read/
        execute when the Vitest UI server is listening." This repo only ever
        invokes `vitest run` (headless); the `--ui` server is never started
        anywhere in scripts or CI.
      - **astro (high ×2 + moderate/low)** — Host-header SSRF in prerendered
        error-page fetch, reflected XSS via unescaped slot name, plus several
        dev-feature XSS advisories. `apps/docs` builds `output: 'static'`
        and ships via nginx — no Astro server/SSR runtime in production, and
        the affected dev-only features aren't used.
      - **vite (high + moderate ×2)** — `server.fs.deny` bypass, NTLMv2 hash
        disclosure via UNC path (Windows-only), optimized-deps path
        traversal — all three are `vite dev`-server-only. CI and local both
        only ever run `astro build` / `vite build`; no dev server is ever
        exposed to a network.
      - **esbuild (moderate + low)** — "dev server accepts any-origin
        requests," Windows-only dev-server file read — same shape, dev-
        server-only, never invoked here.
      - **sharp (high, inherited libvips CVEs)** — the one advisory with a
        genuinely different risk shape (native-library CVE reachable via
        *build-time* image processing, not a dev server). Checked whether
        it's actually exercised: no `astro:assets`/`<Image>` usage anywhere
        in `apps/docs/src`, and no raster (`.jpg`/`.png`/`.webp`) source
        assets in the repo — only visual-regression *test output* PNGs,
        which aren't inputs to any build step. `sharp` is a dormant
        transitive dependency of Astro's optional image service, never
        actually invoked by this build.
      Verdict: every one of the 7 advisories' exploit preconditions (a
      listening Vitest UI server, a network-exposed Vite/esbuild dev server,
      Astro SSR runtime, image processing via astro:assets) is absent from
      how this repo builds and ships. All `fixAvailable` require semver-MAJOR
      bumps (vitest, astro, vite chains) — upgrading now would trade a real
      risk of breaking the build/test toolchain for zero realized risk
      reduction. Deliberately deferred, not fixed: re-check each advisory
      the next time its package needs a major bump for an unrelated reason,
      or if any of the newly-absent preconditions (dev server exposed to a
      network, `astro:assets` adopted, `vitest --ui` used) becomes true.

- [x] **2026-08-16 — Dogfood: File upload on the po-app PO detail screen —
      graduated** (Explore, dogfood-loop fallback). The Ideas seed list and
      Long-term backlog are both exhausted of ready items, and the sanctioned
      fallback is "extend `examples/po-app` and feel where it fights." The
      three Slice 17 components (Segmented, File upload, Tag input, shipped
      earlier the same day) had only ever been exercised in isolated docs
      demos — never in the real tarball-consumer app. Added a "Documents"
      `<fieldset>` to the PO detail screen (`.bo-file-dropzone` +
      `initFileDropzone()`, client JS rendering `.bo-file-list` rows on
      `change`, exactly the documented recipe) — the real scenario Slice 17
      item 2 was scoped for ("attach a signed goods-receipt PDF, vendor
      contract to a record"), not a contrived one; no new data model needed.
      **Verified against the real npm package boundary**, not the docs
      container: rebuilt `@busy-office/ui`, `podman build`'d the po-app
      image fresh from a packed tarball, ran it, and drove the live page —
      a synthetic `DataTransfer`-based file add through the real `input`
      dispatched `change` correctly, rendered the file row, the remove
      button removed it (zero console errors); confirmed the section
      composes cleanly on both a Pending PO (next to the Approve dialog) and
      an Approved one (no dialog) — no layout conflict either way. Zero new
      CSS/JS — pure consumption of already-shipped, already-tested surface.
      **Graduated directly** (no worktree spike needed — same precedent as
      the icon-sizing fix: a small, unambiguous consumption of an existing
      primitive, not an open interaction-model question).

- [x] **2026-08-16 — Dogfood: Tag input on the po-app Approve dialog —
      graduated** (Explore, dogfood-loop fallback continued — Segmented and
      Tag input, Slice 17's other two new components, still had never been
      used outside isolated docs demos). Added a "Notify additional
      approvers" `.bo-tag-input` to the Approve dialog's `<form
      method="dialog">` — the exact scenario the roadmap cites for Tag input
      ("multiple approval-routing recipients"), a real ERP need (route the
      approval notification to more people than the default approver) with
      no invented data model. **Verified against the real npm tarball
      boundary**, same as the File-upload round: rebuilt core, packed a
      fresh tarball, `podman build`'d po-app, ran it, drove it live.
      Add-tag (Enter), add-second, Backspace-removes-last, and
      click-to-remove all confirmed via real DOM interaction, zero console
      errors, and — the actual risk this scenario tests — the tag field's
      Enter keydown does NOT trigger the surrounding `<form method="dialog">`'s
      native submit-on-Enter (confirmed `defaultPrevented: true` on the
      keydown, dialog stays open); Approve still correctly fires the
      existing `hx-post` and swaps the timeline. **One tooling artifact
      caught and correctly not misattributed to the framework**: an early
      click aimed at the remove button landed on the dialog backdrop instead
      (viewport-size drift between an earlier screenshot's coordinates and
      the live click, a known class of automation-tool imprecision, not
      anything programmatic) and closed the dialog — resolved by clicking
      via the element's live bounding-rect / accessibility-tree ref instead
      of stale screenshot pixel coordinates, not by changing any shipped
      code. Zero new CSS/JS — pure consumption of already-shipped surface.
      Graduated directly, same precedent as the File-upload round.

- [x] **2026-08-16 — Dogfood: Segmented control as a real density switcher in
      po-app — graduated** (Explore, dogfood-loop fallback, closes out all
      three Slice 17 components). The obvious literal scenario ("My
      Approvals / Team Approvals") needed a multi-user concept po-app
      doesn't model — rather than force that, found a genuinely uncontrived
      fit already latent in the codebase: po-app hardcoded `data-density=
      "compact"` and never let a user switch it, even though the framework's
      own warehouse-floor precedent (RF-scanner's `data-density="spacious"`
      quantity stepper) is exactly the back-office-vs-warehouse-floor
      density split a real ERP needs switchable at runtime — something
      neither po-app nor even the docs site had ever actually wired live
      (docs only ever demos density statically per example). Built: a
      3-option `.bo-segmented` ("Compact / Comfortable / Spacious") in the
      app-shell header, server-rendered from a `density` cookie
      (`densityFromCookie()`, default `compact`, unchanged from before),
      client JS setting `document.documentElement.dataset.density` on
      `change` for instant reflow **and** writing the cookie so it survives
      a real full-page navigation (po-app has no htmx-boost — every nav is
      a genuine reload, so this only works if the server actually reads the
      cookie back, not just client-side state).
      **Verified against the real npm tarball boundary**: rebuilt, packed,
      `podman build`'d, ran, drove it live — clicking Spacious visibly
      reflowed the data table (taller rows, larger checkboxes/buttons),
      correctly persisted across a real navigation to `/spend` (confirmed
      `document.documentElement.dataset.density` still `spacious` after a
      fresh page load, not just in-memory), and the header wraps cleanly at
      390px (isolated-clone technique, on-screen this time to confirm it
      *looks* intentional, not just doesn't overflow) — brand row on top,
      switcher on its own row below.
      **Real automation-tooling lesson, correctly isolated from the
      component under test before concluding anything**: a stale/corrupted
      browser tab silently no-op'd every synthetic click on the hidden
      radio input AND on its visible label — confirmed NOT a framework bug
      by reproducing the exact same click in a **freshly created tab**,
      where it worked correctly first try (same class of tab-corruption
      previously noted this session for a different bug; the fix is a new
      tab, not code). Also reconfirmed (independently, this round) that
      `.bo-segmented__input`'s hidden `<input>` itself is never a valid
      click target — real interaction always goes through the visible
      `<label>`, consistent with the component's own design and the
      Slice 17 item 1 bug it already caught once. `resize_window` was
      re-confirmed unreliable in this session (didn't change the reported
      viewport) — narrow-width verification used the established
      off-screen/on-screen clone-measurement technique instead, same as
      every other narrow-width check this session.
      Zero new CSS/JS surface shipped — pure consumption plus one small,
      genuinely useful po-app server addition (the cookie helper). No
      dark-theme check: po-app has never had a theme toggle (confirmed in
      an earlier dogfood round), so this is consistent with that existing,
      already-noted scope boundary, not a gap introduced here.

- [x] **2026-08-16 — Code blocks bled into the right-rail TOC on long
      lines — fixed** (user-requested click-through sweep: "can you use AI
      Agents to run thru the web?" — 4 parallel Explore agents, one per
      ~14-page batch, covering all 58 docs pages with screenshots + console
      checks). 57/58 pages came back clean; one real, verified finding on
      `/components/quantity`'s "With a unit" section — a long attribute-
      laden line in a `<pre><code>` block had no horizontal scroll and
      bled past its own column into "ON THIS PAGE", confirmed via
      `elementFromPoint`/bounding-rect inspection, not just eyeballing the
      screenshot. Root cause: `has-copy` (the copy-button class) is applied
      to EVERY `<pre><code>` in `.docs-content` via JS — both `Demo.astro`'s
      paired blocks and hand-authored "Markup" sections — but
      `overflow-x: auto` had only ever been added to the opt-in
      `.demo-pair--row` layout variant; the default stacked layout and
      every hand-authored Markup block never got it. This is a latent gap
      that could resurface on any page with a long enough code line, not
      just Quantity — fixed on the general `.docs-content pre.has-copy`
      selector so it's closed everywhere at once, not re-patched per call
      site. Verified live: 1440px light + dark (clean boundary, correct
      internal scroll, confirmed via `getComputedStyle`), 390px (off-screen
      clone technique, clips cleanly, no bleed). Zero console errors. Full
      gate suite green (61 tests, build, page-shape, link check).
      **Follow-up (next wake, same day)**: since the fix touches a
      site-wide CSS selector, ran `test:visual` as a real verification the
      original wake skipped — it correctly caught that the fix changes
      rendering on MORE pages than the click-through sweep flagged (6 of
      the 8 baseline-tracked pages had their own silently-overflowing code
      line, mostly only visible at 390px, which the sweep's single-
      viewport check didn't surface). Confirmed via pixel-diff inspection
      this was real, correct text-clipping at each `<pre>`'s right edge
      (identical magnitude in light and dark, zero diff on pages without
      an overflowing block) — not a regression or antialiasing noise — by
      live-verifying one instance (`/components/data-table`'s "multi-row
      inline edit" markup) before touching anything. Regenerated all 32
      baselines, stable across 2 clean re-runs.
      **Second follow-up (next wake)**: `overflow-x: auto` on `<pre>` with
      no `tabindex` raises a real WCAG 2.1.1 question — is the
      horizontally-scrolled content reachable by a keyboard-only user?
      Checked rather than assumed either way: ran `test:axe` (already
      widths-aware specifically for this scrollable-region-focusable class
      of issue, per its own header comment) against the freshly-rebuilt
      container — zero violations across all 59 pages at both widths.
      Confirmed the `<pre>` elements genuinely have no `tabindex` (grepped
      the built HTML), so this is axe's own trusted judgment that the
      current shape doesn't cross its violation threshold, not an
      unchecked gap. No code change — the established a11y gate is the
      bar this project holds itself to, and it's held.

## Long term (post-1.0)

Highest-leverage bets (2026-08-14 review — ranked):

- [x] **Scaffold generator + page-shape gate** *(top pick)* — `npm run new:component
      <name> [--behavior]` (packages/core/scripts/new-component.mjs) stamps the CSS
      file + `@import`, the docs-page skeleton, the sidebar entry, and (with
      `--behavior`) a stub test in one command; `apps/docs/scripts/check-page-shape.mjs`
      is build gate 7, FAILING a component page missing its opener/`ClassRef`/demo/
      `ApiTable`/non-empty `Related`/sidebar entry. Caught two real drifts (button.astro,
      form.astro missing the demo-note opener) on first run — fixed. Turns the CLAUDE.md
      "how to document" prose into something that can't be gotten wrong.
- [x] **Keyboard row navigation — Explore spike (2026-08-14)** — j/k/Enter roving
      focus on a plain `<table>`; mechanics confirmed live, but discarded as unsafe
      (breaks screen-reader table browse mode). Graduated into Slice 6 item 2 above
      as the properly-scoped ARIA grid pattern.
- [x] **1.0 exit checklist** — written, with real verified numbers (not
      aspirational placeholders), via the Explore fallback (backlog +
      Ideas seed list both empty). While writing it, actually re-ran the
      `examples/po-app` tarball consumer end-to-end for the first time
      this session (see below) rather than trusting the CHANGELOG's
      description of it. The checklist itself:

      | # | Item | Status | Evidence |
      |---|------|--------|----------|
      | 1 | Component surface | ✅ 28 component pages, 12 pattern pages, 2 reference pages (re-synced 2026-08-16 after Slice 17: Segmented control, File upload, Tag input) | `check-page-shape.mjs`: 28 component pages |
      | 2 | JS behaviors | ✅ 18 opt-in behaviors total (`dist/behaviors.json`), generated docs table. **All 18 now stable against internal usage** (re-synced 2026-08-16 — each survived ≥2 in-repo compositions; freeze PROVISIONAL until the item-12 independent adopter — per the decisions grill, contract-shape changes before then are CHANGELOG-Breaking entries). `initFileDropzone`/`initTagInput` graduated into that audited set this round: each had only the docs demo as its one context until the po-app dogfood rounds (Documents section, Approve-dialog "notify additional approvers") gave both a second, independent in-repo composition — the same bar the other 16 originally used | `dist/behaviors.json`: `initCount: 18`; CHANGELOG freeze addenda + correction |
      | 3 | Test coverage | ✅ 61 behavior tests, all passing (re-synced 2026-08-16 — was 55 as of 2026-08-15, Slice 17 item 3 added 4) | `npm test` |
      | 4 | Build gates | ✅ 7 gates, all green + 2 advisory harnesses (`test:visual` 32 shots, `test:axe` 54 pages) | named `@container`, contrast+coverage, behaviors-vs-`.d.ts`, dist links, stylelint, tests, page-shape |
      | 5 | Contrast | ✅ 27 pairs × 2 themes + 1 brand preset, all AA (incl. three non-text 3:1 fill pairs) | `check-contrast.mjs` |
      | 6 | Zero runtime deps (shipped pkg) | ✅ confirmed, `htmx.org` is a **docs-app-only** dep | `packages/core/package.json` |
      | 7 | Dark mode / density / print / forced-colors | ✅ shipped, live-verified this session | Slices 5-6, item 18 |
      | 8 | RTL | ✅ audited — logical properties genuinely hold; 1 open product question flagged (numeric column alignment), not a bug | Slice 7 item 6 |
      | 9 | ≥1 real consumer | ✅ `examples/po-app` — **re-verified live THIS round**: `podman build` from current source, ran the container, clicked through dashboard → PO list → filter → select-all/bulk-approve → detail page → approval timeline. Everything worked. One visual anomaly investigated (an unchecked `.bo-checkbox` rendered as a solid square in this session's automated-Chrome screenshot) — **root cause found 2026-08-15 by Slice 14 item 6**: NOT an environment quirk after all, but the library's `color-scheme: light dark` + headless-Chrome dark preference + no `data-theme` = dark native checkboxes on a light page (the exact mixed-mode bug the Platform seat later named). Fixed by the library defaulting `color-scheme: light`. | `examples/po-app`, this round |
      | 10 | a11y ledger | 🟡 2 items genuinely NEEDS-RUNTIME (VoiceOver, NVDA — no tool in this environment can drive either); everything else closed, and the first full axe-core engine scan (2026-08-15, Slice 13) is zero violations across all 54 docs pages | Slice 6 item 5, item 18; `test:axe` |
      | 11 | API frozen | 🟡 **Provisional** (downgraded by the 2026-08-15 decisions grill): all 18 behaviors now stable against internal usage (item 2, re-synced 2026-08-16) — the audits are per-item and dated — but the terminal "frozen" claim required the *external* usage pressure the audit itself named, and po-app is not external (the same reasoning item 12 uses to refuse po-app as an adopter — the two items now agree: 12 = market validation, 11 = contract robustness, and 11's final grade waits on 12's adopter) | `CHANGELOG.md` freeze addenda + correction; `.roundtable/grill-decisions-2026-08-15.md` |
      | 12 | Real independent adopter | 🔴 **Not met, and `po-app` does NOT count** — it's a reference app built by this project's own team to test packaging, not an external team choosing to adopt it. This is the one item on the list that can't be closed by more loop iterations; it needs an actual second party. |

      **Net: 10 of 12 done, 2 genuinely NOT closeable by more loop
      iterations** — the a11y NEEDS-RUNTIME items need real assistive-tech
      hardware, and the independent-adopter item needs an actual second
      party. This is NOT "hit the list, ship" — it's an honest snapshot
      for whoever (the owner) decides when "good enough" is reached; a
      loop iteration should not self-approve publish
      regardless of how this list reads.
- [x] **Real ERP pilot (dogfood)** — already substantially satisfied by
      `examples/po-app` (item 9 above) — a real 3-screen ERP slice
      (dashboard, PO list with filter/bulk-select, detail + approval
      timeline) built with the framework, not synthetic docs demos.
      **Worth being honest about the distinction from item 12 above**:
      this WAS built by the framework's own team dogfooding it (exactly
      what this bullet asked for — "feel where it fights"), which is
      different from and does not substitute for an independent adopter.
      No fresh "where it fights" friction found this round (the
      checkbox-render investigation was an environment quirk, not a
      framework gap) — but this hadn't been re-run against the CURRENT
      component set (post Slice 6/7) until this round confirmed it still
      builds and works end-to-end.
      **Extended 2026-08-16** (three Explore dogfood rounds, post Slice 17):
      po-app grew a real "Documents" section (File upload on the PO detail
      screen), a "Notify additional approvers" field (Tag input inside the
      Approve dialog's `<form method="dialog">`), and a real density
      switcher (Segmented control, cookie-persisted across full-page
      navigation — po-app has no htmx-boost, so this only works if the
      server genuinely honors it back). Genuine friction found and
      resolved this round, not just re-verification: the Tag input's Enter
      keydown inside a native `<form method="dialog">` needed confirming
      it doesn't trigger the form's submit-on-Enter (it doesn't —
      `initTagInput()` already calls `preventDefault()`), which is exactly
      the kind of composition risk a synthetic docs demo (no surrounding
      `<form>`) can't surface. See the Explore log entries below for full
      verification detail.

- [x] **Framework adapters — resolved by splitting (2026-08-15)**: the
      Rails/Django asset recipe turned out to already exist — the
      installation page's skeleton IS the no-Node story (vendor the dist
      into any static/asset pipeline; now says so explicitly, naming
      Rails/Django/PHP/Go, and — per the decisions grill — recommending a
      VERSIONED vendor path (`/vendor/busy-office-ui@0.1.0/`) so copied
      assets have an explicit upgrade step and a tell-which-version
      story; the fuller update-path answer folds into the versioned-docs
      item at 1.0). The Vite plugin and React/Vue wrapper set
      stay **parked as speculative**: zero consumer demand to date, and
      the framework's plain-class + `data-*` contract already works
      unwrapped in every framework (po-app proves the no-framework path;
      JSX consumers use the classes directly). Either graduates the
      moment a real consumer asks — same gate as every parked item.
- [x] **Versioned docs** — graduated 2026-08-16 into Slice 20 item 3 at
      the user's explicit ask (Tailwind-style version switcher attachment);
      originally parked until 1.0, the mechanism now ships early with the
      switcher and a real snapshot proven at the next release.
- [x] **Theme presets** — shipped one real preset (not the whole "small
      set" — see below), generated via the Explore fallback (backlog +
      Ideas seed list both empty, same pattern as items 21/6).
      `packages/core/src/css/brand/brand-indigo.css`: a genuinely
      importable file (`@busy-office/ui/css/brand-indigo`, resolved by
      the existing `./css/*` wildcard export — no new export entry
      needed), following the exact recipe already documented in
      `/concepts/theming` (accent family + focus-ring + bg-selected,
      both light/dark blocks, deliberately unlayered so the cascade
      contract lets it win). **Genuinely validated, not asserted:**
      extended `scripts/check-contrast.mjs` to discover and check every
      file in `src/css/brand/` the same way it checks the base theme —
      all 24 pairs pass in both light and dark for the indigo values.
      Wired into `build-component-css.mjs` (mirrors the existing
      htmx.css/motion.css opt-in-module pattern). Live demo added to
      `/concepts/theming` — a scoped `.brand-preview` box (same token
      values, targeted at a class instead of `:root` so it doesn't
      re-skin the whole live docs site) showing a real button/badge/link
      re-skinned correctly in both themes, verified live via Podman.
      **Deliberately scoped to one preset, not "a small set"** — the
      mechanism (file format, build wiring, contrast validation, docs
      demo) is now proven and reusable; a second/third preset is a
      cheap follow-up once wanted, not something to speculate additional
      hues for right now. 33 tests unchanged (no JS touched), gates
      green including the new brand-contrast check.
- [x] **Visual-regression harness** — shipped 2026-08-15 (advisory, not
      yet a hard build gate). `apps/docs/scripts/visual-regression.mjs`
      (`npm run test:visual` / `test:visual:update`): 8 key pages ×
      light/dark × 1440/390px = 32 full-page shots, diffed against
      committed baselines (`apps/docs/visual-baselines/`, 3.2MB) with
      pixelmatch at a 0.1%-changed-pixels threshold; failing shots write
      diff images to the git-ignored `visual-diffs/`. Tooling call:
      puppeteer-core driving the SYSTEM Chrome (no browser download;
      `CHROME_PATH` env for CI runners) + pixelmatch/pngjs (pure JS).
      Validated both directions before committing: deterministic (32/32
      green on immediate re-run) AND red-capable (swapping the accent
      teal to red in the built CSS failed exactly the 6 shots where the
      accent is visible; restoring returned all green). Deliberately
      advisory for now — cross-machine antialiasing variance needs a
      baseline-per-environment policy before it can hard-fail CI; that
      wiring is the follow-up, not the harness. **Hardened same day**:
      the first baseline run silently captured 404 pages from a stale
      dist (the "96% changed" failures on the next run exposed it) —
      the script now refuses any non-200 response, and baselines were
      regenerated from a verified-fresh build.
- [ ] **Turbo** — adopt if the workspace grows past ~2 packages (build caching).
- [x] **Data-grid virtualization hooks — investigated with measurements,
      closed as WON'T BUILD (2026-08-15; evidence extended same day after
      the decisions grill challenged the single-machine data — 4× CPU
      throttling approximating older corporate hardware: interactions
      stay <700ms even at 20k rows, initial render is the real pain at
      ~3.8s/20k throttled, reinforcing "paginate beyond a few thousand";
      re-open condition published in the docs section).** The "needs a perf scenario"
      gate was satisfied by a stress harness added to po-app
      (`/stress?n=…`, kept for future re-measurement): N unvirtualized
      rows through the full table stack. Measured — 1k: 85ms render /
      4ms select-all; 5k: 174ms / 18ms / 231ms post-bulk-check style
      flush; 20k: 558ms / 49ms / 610ms. Render and scroll scale linearly
      with NO cliff; the only visible cost is the bulk-select row-tint
      recalc, linear and per-toggle. Verdict: virtualization's complexity
      (breaks Ctrl-F, select-all semantics, SR row counts) is not
      justified — server-side pagination (already shipped: page numbers +
      load-more) is the answer at the scale where tables stop being
      scannable anyway. Published as a "Performance at scale — measured,
      not guessed" section on `/components/data-table` with the real
      numbers. **Diagnostic honesty note**: the first measurement pass
      misread a 45s "renderer freeze" at 5k rows — it was a hidden-tab
      artifact (background tabs never fire rAF and don't run layout),
      not the page; re-measured with synchronous forced-layout reads.
- Component depth (remaining note): (Amount field and
      command palette pulled forward into Slice 5; date-field graduated
      into Slice 6 item 21; RTL audit graduated into Slice 7 item 6;
      **tree/nav shipped 2026-08-15 via the Explore fallback** — `.bo-tree`,
      `packages/core/src/css/components/tree/tree.css`, built on native
      `<details>/<summary>` so open/closed state, Enter/Space toggling and
      Tab stops are platform semantics, zero JS/ARIA — the same
      native-element-first call as `.bo-progress`. Explicitly navigation,
      not an APG TreeView; the docs page states when the heavier
      single-tab-stop selection-tree pattern would be needed instead and
      that it's deliberately not shipped. `aria-current` active-node
      convention shared with the sidebar; em-based logical-property
      indentation verified mirroring under RTL live; chevron uses the
      `content` alt-text idiom; reduced-motion honored. New
      `/components/tree` docs page (page-shape: 24 pages, 2984 links);
      verified live via Podman `--no-cache`, both themes, 390px, RTL,
      and a real branch toggle. No new contrast pairs needed — reuses
      already-gated sidebar pairings. Virtualization hooks remain open:
      genuinely needs a perf scenario + design decision, not buildable
      from composition.)

## Standing principles (not a phase — the bar every slice meets)

- Every documented surface is generated from the shipped artifact and drift-gated.
- Every state signal is two-channel (visible non-color cue + programmatic).
- Every `@container` is named; heights are minimums; density is rem-only.
- New components compose existing primitives; small and general over specific.
- Before adding a class, ask whether it's a genuinely reusable ERP setting (an
  existing component's new part/modifier) or a one-off — prefer widening what
  exists over shipping a narrow variant (2026-08-14 user direction).
- Every component is responsive by construction (container queries, relative
  units) at both narrow and wide — not verified only at whatever width
  happened to be open when it shipped.
- Each slice is adversarially grilled before sign-off.
