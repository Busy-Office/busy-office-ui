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

**How it binds the loops:** Roadmap triage tests every new ask against
these before queuing (refuse/rethink are valid triage outcomes, recorded
with the reason); the design panel grills slices against them; removals
face the same tests as additions — deleting a surface consumers compose
against is a Breaking-entry decision, not a tidy-up.

## Slice 27 — triaged from the owner QA review (2026-08-17)

External QA review of the running docs site: 82 pages crawled, contrast
measured on computed styles, both themes, desktop + mobile. **Unusually good
input** — it self-corrects four of its own initial suspicions, and its numbers
reproduce. I re-measured every load-bearing claim before queueing it, per the
standing rule that a review's findings are hypotheses until executed.

**Verified independently this wake (all five reproduce):**

| Claim | My measurement | Verdict |
|---|---|---|
| Sidebar search results 1.46:1 in dark | `rgb(57,57,57)` on `rgb(26,29,35)` = **1.46:1**; light = 11.55:1; identical fg in both themes | CONFIRMED exactly |
| No search on mobile | at 420px both instances measure 0x0; 0 header controls, 0 drawer widgets | CONFIRMED |
| Landing page drops saved theme | `bo-theme=dark` stored, `data-theme` **absent**, `data-density="compact"` **present** | CONFIRMED — asymmetric, so an oversight |
| Sidebar search scrolls out of view | `position: relative`, top **-681px**, nav scrollTop 742 on /components/button | CONFIRMED |
| Placeholder-only inputs | 1 on combobox + 3 on tag-input, no label/aria-label | CONFIRMED |

**Two things worth naming before the items.** First, the combobox
placeholder-only input is **mine — I introduced it in 24.2** and the Objective
grill I ran the same day did not catch it. Second, **axe passes all four
because `placeholder` contributes to the accessible name**, so the gate is
technically correct and substantively blind here. That blind spot is 27.5.

1. [x] **27.1 — One search, not two** (2026-08-17) — sidebar instance deleted;
       one PagefindUI site-wide reached three ways (sidebar button, mobile
       header button, Cmd/Ctrl-K). **Measured: dark result text 1.46:1 →
       14.51:1**, light 11.55:1 → 17.74:1, instances 2 → 1, mobile 0x0 →
       a 36x36 header button that opens the dialog, sidebar search
       `relative`/-681px → `sticky`/top 61, and the hint is a real `<kbd>`
       reading "Ctrl K" on Win32 (verified by faking `navigator.platform`).
       Closes P1-1, P1-2, P2-1, P2-3, P3-4 as predicted. **Cost line: 0
       framework selectors, 0 CSS in the framework — all docs-shell.**
       Original text:
       Delete the `#docsearch` sidebar instance; replace with a full-width
       button that opens the already-themed `#cmdk` dialog, and ship the same
       button in the mobile header. Accept: one Pagefind instance site-wide;
       search reachable at 420px; the ⌘K hint is a real element so it can read
       Ctrl on non-Mac; measured contrast of every result element ≥4.5:1 in
       both themes; live-verified 1440 + 390, both themes.
2. [x] **27.2 — Third-party CSS is now measured** (2026-08-18) —
       `check:vendor-contrast` renders the search widget, types a query, waits
       for the SETTLED state and measures computed contrast of every
       text-bearing element in both themes (AA, with the large-text 3:1 rule
       applied correctly). **Red-proof demonstrates the structural point
       rather than just the fix:** reinstating Pagefind's stock `#393939` makes
       the new gate FAIL in dark while `check:contrast` PASSES on the identical
       tree — 35 pairs, still green, still blind. It fails only in dark, which
       is exactly how the original defect behaved. One false positive found and
       fixed on the way: measuring before Pagefind's skeleton placeholders
       resolve reports 1:1 on every row, because placeholder text matches its
       background on purpose. **Cost line: 0 framework changes; third user of
       the shared `gate-report` contract.** Original text: The reviewer's
       sharpest structural point: our gate covers 35 token pairs and found
       nothing, because it cannot see vendored Pagefind CSS. Accept: the
       contrast gate (or a sibling) measures the rendered search widget in
       both themes so a Pagefind upgrade cannot silently regress it;
       red-proved.
3. [x] **27.3 — Search index scoped** (2026-08-18) — `data-pagefind-body` on
       `<main>`, ignore on navbar/sidebar/TOC, and a post-build step
       (`scope-search-index.mjs`) that ignored **169 code samples + 67 Demo
       previews across 68 pages**. Gated by `check:search` (renamed from
       check-vendor-contrast; contrast + index scope, one browser boot).

       **Honest scorecard — two of the review's three examples fixed, one
       traded:** nav-chrome prefixes are gone (0 across every query tested,
       previously on every excerpt) and raw HTML no longer surfaces as prose.
       Demo TABLE cells still appear ("vs plan Overdue 17 unchanged Recent
       invoices…"), because ignoring `<table>` also took the generated
       ClassRef/ApiTable reference tables with it: `bo-data-table` dropped 9→3
       hits and surfaced Pagination above the data-table page. They share a
       class, so no selector separates them. Class-name findability wins.

       **And a premise correction:** the criterion "code-block matches stop
       inflating counts (table returns 54)" was wrong, and I wrote it. After
       code samples left the index "table" returns 52 — the count was almost
       entirely legitimate prose across the pages that discuss tables, not
       code-block inflation.

       **Cost line: 0 framework changes; +1 post-build step, +4 gate
       assertions.** Original text: Index `<main>` only;
       `data-pagefind-ignore` on navbar, sidebar, TOC, live demos and every
       `<pre>`. Accept: an excerpt for "invoice" starts at content rather than
       nav chrome, and code-block matches stop inflating counts ("table"
       currently returns 54).
4. [x] **27.4 — Landing page honours the saved preferences** (2026-08-17) —
       blocking inline `<head>` script, same mechanism as the docs shell.
       **Correction to the review AND to my own triage:** the report said the
       page "honours one persisted preference and drops the other", and I
       repeated that. Tested with `bo-density=spacious` stored: docs rendered
       spacious, home rendered **compact** — the hardcoded
       `data-density="compact"` in the markup, which merely matched the
       default. Home honoured **neither**; the asymmetry was an artifact. The
       fix covers both keys. The hero switchers stay **demo-scoped** (that is
       documented intent — "zero layout shift below") but now initialise from
       the page's resolved values, which removes the real mismatch the review
       measured (`#hero-theme` reading "light" on a dark page). **Cost line: 0
       framework changes; docs-shell only.** Original text: Accept: the
       docs shell's blocking inline theme script runs on the home layout too;
       no white flash when navigating home with dark stored; the hero's local
       control either becomes the global one or is removed so two controls do
       not mean different things.
4a. [x] **27.3b — Fixture tables ignored, reference tables kept** (2026-08-18)
       — the residual half of P2-2, closed with both halves measured because
       fixing one by breaking the other is what the item existed to prevent.

       `ClassRef`, `ApiTable` and the class index carry `data-search-keep`;
       every other `<table>` is treated as a fixture and ignored by
       `scope-search-index.mjs`. **Measured before: excerpts read "Line total
       Cost centers Actions Steel bracket, 40mm" and "$4,208.00. Pending.
       INV-10235. Globex Industrial." After: those queries return 1 weak prose
       hit each, and `bo-data-table` still returns the class index at #1 with
       the ClassRef content at #2.**

       Pattern pages' Data-contract and States tables are ignored under this
       rule too. Checked rather than waved through: "409 conflict", "partial
       failure" and "skeleton rows" all land on the surrounding PROSE, so the
       tables were restating what was already findable.

       `check:search` is **8** assertions, and the new one is deliberately
       paired against the existing relevance guard so it **fails in opposite
       directions** — blanket rule gives `kept: 0, kept-but-ignored: 77`;
       rule removed gives `ignored fixtures: 0`. Both red-proved with the build
       output verified, after a first attempt passed both injections because I
       discarded the build log and the gate ran against a stale `dist`.

       Also removed a special case rather than gating around it: ApiTable's
       contrast sub-table had a hardcoded `data-pagefind-ignore`, which made the
       counter meaningless. It now simply lacks the keep-marker, so one
       mechanism decides every table.

5. [x] **27.5 — Real labels, and the blind spot closed** (2026-08-18) — the
       four inputs fixed in the DOCS MARKUP, so the copy-paste path carries the
       fix: tag-input's three fields get `aria-label` (a visible label belongs
       to the enclosing form field, not inside a chip group), and the combobox
       value-help gets a real `<label for="vh-input">`, matching the pattern
       that page's other demos already use. **The gate is the durable half:**
       `axe-audit` now also rejects an input whose only accessible name comes
       from `placeholder`, which axe passes because placeholder CONTRIBUTES to
       the name computation. Red-proved by removing the label again — it flags
       the input at both widths, on the same page axe reports clean. Added to
       the existing 82-page sweep rather than a new gate, so it costs nothing.
       82 pages come back clean, so no other page had the problem. Original
       text:
       gate's blind spot.** Fix the four inputs in the DOCS MARKUP so the
       copy-paste path is correct. Accept: every documented form control has a
       `<label for>` or `aria-label`, **and** a gate rejects an input whose
       only accessible name comes from `placeholder` — axe cannot see this, so
       the check is ours to write. Red-proved.
6. [x] **27.6 — Collapsible nav groups** (2026-08-18) — native
       `<details>`/`<summary>`, one group open (the one holding the current
       page), item counts per group, and "Data display" (18) split into
       Tables & lists (7) / Values (4) / Display (7). Extracted `SidebarNav`
       so the sidebar and drawer stop being two copies. **Cost line: 0
       framework selectors, 0 framework CSS; ~20 lines of persistence JS,
       docs-local only** — the item's condition that this must not grow the
       public API is met.

       **Measured: 3932px → 1066-1214px** depending on which group is open;
       85 links preserved (verified), one group open, current page visible,
       `aria-current` intact, Enter toggles from the platform, closed state
       persisted in `bo-navgroups`. **The ~1000px sub-criterion is NOT met**
       and I am not claiming it: 14 group summaries are the floor without the
       top-level tabs the review also proposed, which I deferred. 5.5 screens
       → ~1.6 at the review's 692px viewport is the real gain.

       Two self-inflicted findings on the way: my regex replacement left
       orphaned `</ul></div>))}` fragments that BUILT FINE but silently
       dropped the Project group's 2 links — caught only by counting links,
       not by any gate; and the boost probe broke because it clicks sidebar
       links that now sit inside closed groups, fixed by opening the group
       first rather than weakening the probe into a direct goto. Original
       text: Measured today:
       **85 links, 3932px tall, 0 collapsible sections** — 5.5 screens in a
       692px viewport, and the "Patterns:" prefix repeated three times is the
       tell that a second level was faked with text. Accept: `<details>`-based
       two-level nav, no new component and no JS beyond persisting open state;
       only the current page's group auto-opens; default height under ~1000px;
       "Data display" (18 items) split; keyboard nav and `aria-current`
       unchanged. **Objective test first** — this is docs-shell IA, not
       framework surface, so it must not grow the public API.
7. [x] **27.7 — App-launch icon inventory** (2026-08-18) — all eleven launcher
       tiles now carry a distinct mark, in the three kinds a real launcher
       needs: a shipped `.bo-icon` glyph where one is genuinely right, a
       `.bo-badge` initials chip where none is (**AP** / **AR** — no mark reads
       as "accounts payable", and the two nearest candidates are both a page
       outline, which is exactly how Payables ended up wearing Invoices'
       glyph), and inline `<svg>` for the per-tenant slot (Currencies, drawn as
       the international currency sign — deliberately not `$`, which would bake
       one locale into a worldwide screen). Anatomy now states the rule and the
       page practises it. **Cost line: 0 framework selectors, 0 framework CSS,
       0 behaviors** — the refusal to grow `.bo-icon` into an app-icon library
       stands, and the extension slot needed nothing shipped to work.

       Verified both review claims by eye before acting: Payables did render
       the identical `invoice` mark, and Currencies was an office building.
       The barcode claim I'd restate — it is not illegible at 32px so much as
       *generic*: six evenly-spaced uniform bars read as "bars", not as a
       barcode. Goods receipt moved to `check-circle` either way. **`barcode`
       remains a shipped glyph with that weakness (27.7b, not queued):** it is
       an icon-quality question, not a launcher one.

       Also extracted `AppTile.astro` — the tile markup was three identical
       copies, so adding a second kind of mark would have been the same edit
       three times. Its fixed 2rem mark box came from a measurement, not a
       guess: a `.bo-badge` chip is 37px against an icon's 32px, which pushed
       the initials tiles' labels 5px below their neighbours' in the same row.
       Original text: The reviewer verified
       our mask+data-URI mechanism is right and explicitly says keep it — the
       problem is glyph inventory: Invoices and Payables render the SAME mark,
       Currencies gets a building, and the barcode is illegible at 32px.
       Accept: the four demo tiles get distinct, semantically right marks; the
       Anatomy section states "one glyph per app, never reused in a launcher —
       if no distinct glyph exists, use the initials chip rather than an
       approximate one"; and the page documents inline `<svg>` as the
       extensible per-tenant slot. **Explicitly REFUSED: growing `.bo-icon`
       into an app-icon library** — app icons are product content, and every
       consumer would ship glyphs they never use.
8. [x] **27.8 — Polish sweep** (2026-08-18) — all three fixed, and two of the
       three turned out to be more interesting than "polish".

       **P3-1 (htmx-1 warning)** — the extension was imported from
       `htmx.org/dist/ext/`, which in 2.0.10 is still the htmx-1-era directory;
       htmx 2 moved extensions into their own packages. Now on
       `htmx-ext-head-support` 2.0.5, warning gone. I first tried DELETING it,
       on the reasoning that `inlineStylesheets:'never'` had made it redundant
       — the boost gate failed instantly with `.scale-grid` and `.pal-cards` at
       `display:block`. The static check only guarantees no page ships layout
       in an INLINE head `<style>`; page-scoped CSS still arrives as its own
       `<link>`, which a boosted swap never adds without the head merge. The
       gate earned its keep.

       **P3-2 (clipped ACR label)** — real, and my first three measurements all
       missed it. The label shrink-wraps its text, so its own
       `scrollWidth`/`clientWidth` are always equal and can never show
       overflow; only its right edge against the RAIL's client edge reveals it
       (15.7px past, in a 223px rail, producing a scrollbar inside the nav).
       27.6 also masked it by default by closing the Reference group. Fixed in
       the framework rather than by renaming one link: `.bo-sidebar-nav__link`
       no longer forces `nowrap`, so any over-long label wraps instead of
       spilling. **Cost line: +1 selector (`.bo-sidebar-nav__label`), 2
       declarations, -1 declaration; 0 behaviors. CHANGELOG entry as a
       behaviour change.**

       **P3-3 (icons vanish in print)** — confirmed in a real print preview as
       the item demanded, with a matched before/after PDF at
       `printBackground:false`: without the rule all five mask icons disappear
       while badge and inline-`<svg>` marks still print. `check:claims` is now
       23 and red-proves this one (injection verified in the built CSS, not
       just the red result).
       Original text: htmx-1 extension warning on
       every page load; "Accessibility Conformance Report" clipped at 217px in
       a 207px box (the only one of 85 links that overflows, and it forces a
       horizontal scrollbar); `.bo-icon` has no `@media print` rule so icons
       vanish on paper. Accept: warning gone, label fits without clipping,
       print rule added **and confirmed in a real print preview** — the print
       claim is the kind this project has already had wrong once.

**Recorded as already-cleared by the reviewer (do NOT action):** Cmd-K binding
works (it failed under automation, not in the product); the select chevron is
NOT hardcoded (two data URIs, correct per theme); the mobile drawer renders in
the right theme; the hero CTA was mid-animation when first measured. Recording
these so nobody re-opens them.

## Slice 28 — from the Objective grill of Slices 26-27 (2026-08-18)

Full report: `.roundtable/grill-objective-slices26-27-2026-08-18.md`. Three of
five findings queued; F1 (verification-to-product ratio) deliberately NOT
queued, and F4 was fixed in the same wake it was found.

1. [x] **28.1 — CI back under budget** (2026-08-18) — **330s -> 265s**,
       against the 288s budget. Two rounds, because round 1 landed at 294s and
       "better" is not the Accept criterion.

       The grill's guessed levers were both wrong, which is the useful part:
       it named the axe sweep and the visual suite; measurement showed the
       LAYOUT sweep was the most expensive step (79s vs axe's 56s) and that the
       visual suite **does not run in CI at all**. Guessing would have
       optimised a gate that costs nothing.

       All three wins were the same mistake in three places — reloading a page
       to look at it in a different configuration:
       `check-layout` loaded 90 pages three times (390 / 1440 / 1432@150%),
       **79s -> 47s**; `check-target-size` looped densities OUTER of pages,
       reloading 7 pages per density, **22s -> 10s**; `axe-audit` loaded 81
       pages once per width, **61s -> ~35s**. Resizing reflows; only the first
       visit needs `networkidle0`.

       **Coverage is identical everywhere — same pages, same configurations,
       same probes. Nothing was sampled and nothing stopped being checked**,
       which is what the Accept criteria demanded be stated outright.

       Each red-proof targeted the configuration that no longer reloads, since
       that is precisely where detection could vanish silently: a fault scoped
       to >=900px was caught at 1432@150% and correctly NOT at 390; two 12x12
       controls 4px apart produced 6 violations (2 x 3 densities), while a
       single ISOLATED 12x12 control correctly passed via SC 2.5.8's spacing
       exception at "nearest 466px" — proving the probe reached it; and an
       alt-less image was caught at both axe widths. Axe's flakiness history
       (a false contrast violation in 1 run of 8) was respected by leaving its
       load wait untouched and measuring stability over 3 consecutive runs.

       `ci-wall-time` is now recorded through `record_metric.py`, closing the
       half of the finding that mattered more: rule 4 was blind to it.
       Original text: Measured
       318s -> 330s across Slices 26-27 against the **288s budget** item 26.1
       measured itself against — ~15% over and drifting up. The sharper half of
       the finding: CI time was never recorded through `record_metric.py`, so
       dispatcher rule 4 ("a tracked metric regressed") was structurally blind
       to the one number that bounds every future gate. A budget stated once in
       prose and never measured again is not a budget.
       Accept: `ci-wall-time` recorded every wake; CI back to **≤288s**; the
       lever chosen is *measured* before being believed, not assumed — the two
       candidates are the axe sweep (82 pages x 2 widths) and the 40-shot
       visual suite, either of which could sample on commits touching no CSS.
       **Any sampling must state what it stopped checking** (no silent caps).

2. [x] **28.2 — Label overflow documented on `/components/sidebar-nav`**
       (2026-08-18) — a demo showing a label longer than the rail wrapping,
       plus why wrapping rather than an ellipsis (an ellipsis hides the part of
       a name that distinguishes it) or a wider rail (a scrollbar inside the
       navigation). **Cost line: 0 selectors, 0 CSS, 0 behaviors** as the item
       required.

       The first attempt was wrong and measuring caught it: the demo used an
       embedded `.bo-app-shell` like the section above it, but the icon-only
       collapse is a `@container bo-shell (max-width: 56rem)` query, so a shell
       narrow enough to fit this page hides every label — the nav measured
       **51px wide with a 1px label**, demonstrating nothing. The rail is
       standalone now.

       A second measurement then contradicted the caption: at 390 the labels
       collapse anyway, because the demo sits inside the DOCS' own app shell.
       Expanded mode needs a >=56rem shell, which cannot exist at phone width —
       so rather than quietly ship a caption that is false for mobile readers,
       the page states what a narrow reader is seeing and why it is the same
       rule. **Measured: 1440 expanded / 2 lines / 0 rail overflow; 390
       icon-rail.**

       The page asserts runtime behaviour, so it is executable per CLAUDE.md:
       `check:claims` is now **24**, red-proved by putting `white-space:
       nowrap` back on the label (injection verified in the BUILT css, not just
       the red result). Original text:
       27.8 changed the behaviour (long labels wrap rather than spill) and it
       is in the CHANGELOG, but the component page mentions the icon-rail
       collapse four times and says nothing about label overflow — and Devi
       reads the page, not the CHANGELOG. Accept: one paragraph plus a demo
       showing a label longer than the rail wrapping. **Cost line: 0 selectors,
       0 CSS, 0 behaviors.**

3. [x] **28.3 — Published site is gated against HEAD** (2026-08-18) —
       `stamp-build-id.mjs` writes `dist/build-id.json` (sha + builtAt, from
       `GITHUB_SHA` or `git rev-parse`, recording a dirty tree as dirty), and
       `check-published.mjs` fetches it from the live site and compares.

       **Placement is the whole design.** It cannot live in CI: during CI for
       commit X the published site is still X-1 by definition, so it would fail
       on every run. It runs as a post-deploy step in `pages.yml`, the only
       moment "published == HEAD" is supposed to be true, and by hand as
       `npm run check:published -w docs` — which is the question I answered by
       accident two wakes ago.

       Three outcomes, deliberately not two — **STALE** (site answers, wrong
       commit) exits 1; **UNREACHABLE** (no answer at all) exits 0 with a loud
       "nothing was checked", because a DNS blip is not evidence of a bad
       deploy and a gate that reds on someone else's network is one people
       learn to ignore; **NO MARKER** (site answers 404) exits 1, since after a
       deploy that means the deploy did not land. Retries exist because the
       Pages CDN can serve the previous build for a few seconds.

       That third case was this script's own first bug, found by running it
       against the REAL site rather than only the local harness where every
       failure was a dead port: it filed a reachable 404 under "unreachable".
       All four paths red-proved, including the one the item asked for — aimed
       at the live site it correctly reports FAILED, because the site genuinely
       does not have this build. **Cost line: 0 selectors, 0 CSS, 0 behaviors;
       +1 build step, +1 deploy step, +1 file in dist.** Original text: Slice 27's
       accessibility fixes are verified, gated, and undeployed; the site sat
       four commits stale and it was noticed by accident while investigating
       something else. A project this careful about whether a gate runs in the
       narrowest context has no measurement of whether its published artefact
       matches HEAD. Accept: a check fetches the published site and asserts a
       marker from the current build, failing loudly when stale; it must
       distinguish "stale" from "unreachable" and must not fail the build for a
       transient network error. Red-proof by pointing it at the known-stale
       deploy.

## Slice 32 — preventing AI slop when building with this framework (owner wishlist, 2026-08-18)

Grilled before queueing, with unusually direct evidence: **I am an AI using this
framework, and this session logged exactly the failure modes in question.** The
Slices 29-30 grill counted them across 17 iterations, and Slice 31 added one
more the same day.

**What already defends against it, and works:** `llms.txt` (19.8 kB, 53 URLs,
generated and link-verified) is a real machine entry point; `api.json` is
generated from the shipped CSS so it cannot drift; and the gates catch a lot —
axe, claims, page-shape, stylelint naming, and the new import-case check.

**The measured failure modes, from my own output rather than speculation:**

| what went wrong | caught by | would a consumer's AI hit it? |
|---|---|---|
| invented CLASS (`.bo-widget__footer`) | my ad-hoc check, not a gate | yes — the classic LLM failure |
| invented ATTRIBUTE VALUE (`data-row-state="selected"`) | **nothing** — found by reading CSS by hand | yes, and silently |
| reached for a refused component (arrows, grid, field-editor component) | the Objective charter, by judgement | yes — nothing states the refusals machine-readably |
| prose asserting behaviour that does not happen | `check:claims`, only for OUR pages | no gate ships to consumers |

1. [x] **32.1 — `api.json` records attribute VALUES** (2026-08-18) — the hole
       my own slop went through is closed. `extract-api.mjs` already captured
       the value in its regex and threw it away; it now keeps it, per component
       **and** as a global union across all shipped CSS including `tokens/`.

       The union is not redundant: `data-density` is switched in
       `tokens/density.css`, so a component that merely consumes it correctly
       shows the attribute bare while the real answer is
       `compact|comfortable|spacious`. A validator without the union would
       reject the framework's most-used attribute. **9 attributes now carry
       values**, including `data-row-state=dirty|error|warning` — the set I
       violated — plus `data-theme`, `data-state` and `data-overflow`.
       `ApiTable` prints them as `attr="a|b|c"`, and attributes the CSS never
       switches on stay bare, which is itself the signal that any value works.

       Red-proved in both directions, as the item asked: "selected" is absent
       today, **appears** when a real `[data-row-state="selected"]` rule is
       added to the CSS, and is gone again when it is removed — so the list
       tracks the artefact rather than a hand-kept table.

       **It also surfaced a live accessibility bug.** The longer hooks column
       made the generated table overflow at 390, and axe caught
       `scrollable-region-focusable` on three pages: `ApiTable` and `ClassRef`
       built their scroll containers **without** the `tabindex="0"` that every
       hand-written demo table carries. Latent until something grew. Fixed in
       both generated components, so all 38 component pages gained it at once.

2. [x] **32.2 — `bo-check-markup` ships** (2026-08-18) — validates HTML against
       the generated `api.json`: every `bo-*` class must exist, and every
       framework `data-*` attribute must carry a value the CSS switches on.
       Exposed as a package `bin`, run over this repo's own docs on every build,
       and documented on the troubleshooting page.

       **Scope changed on contact, deliberately.** The item asked it to flag
       unknown `data-*` ATTRIBUTES; that turns out to be unanswerable —
       `data-row-id` and `data-sum-of` are an application's own hooks and
       nothing distinguishes them from a misspelled framework one. Flagging
       them would make the tool noisy enough to ignore, which is worse than not
       checking. Values are checkable because a known attribute is what makes
       its value knowable. Verified: app hooks are not flagged.

       **It found five real defects on its first run over our own docs**, which
       is the argument for it: an invented `.bo-composer__input` (the framework
       ships `__body` and `__actions`, never `__input`); a `.bo-u-text-sm` that
       has never existed, used on three pages; `.bo-logo` and `.bo-cmdk*`
       squatting the framework's `bo-` namespace for docs-local components,
       renamed to `docs-*`; `.bo-dropdown__menu--end`, which `initDropdowns()`
       READS but no CSS defines, now declared as a JS hook so it is documented;
       and `data-tree-level="1"`, legal but unstyled because level 1 is the
       un-indented default, now declared as such.

       Red-proved on the four cases the item named plus two more: `.bo-card`,
       `.bo-modal`, `.bo-table`, `.bo-btn--primary` (with "did you mean:
       bo-btn, bo-btn--danger…"), `data-row-state="selected"` and
       `data-density="cosy"` — all caught, exit 1; app hooks silent; exit 0 on
       92 clean files and 45,652 class uses.

       One bug in the tool itself, caught by running it: it read
       `data-tree-level="1..12"` out of `<code>` PROSE and reported the
       documentation as a defect. It strips `<pre>`/`<code>` first now.

3. [x] **32.3 — Refusals published to `llms.txt`** (2026-08-18) — the file said
       what exists and never what deliberately does not, so the most expensive
       mistakes were the ones it could not warn about.

       DESIGN.md gains a canonical **"Deliberately absent (and what to use
       instead)"** table — 8 rows, each a component-shaped thing someone would
       otherwise build, with the alternative and where it was decided.
       `gen-llms.mjs` parses it into `llms.txt` rather than restating it, so the
       two cannot drift. Process decisions stay in ROADMAP's "REFUSED, with
       reasons"; this table is only for things an assistant would try to build.

       **Created the canonical record rather than pretending to scrape one.**
       The 13 existing REFUSED markers are inconsistently formatted and mostly
       internal (a class rename, a toolbar idiom); generating from them would
       have been fragile and would have published noise. Stated plainly because
       the item said "generated from the refusals already recorded".

       Red-proved the anti-drift guard: deleting the table **fails the build**
       with an explicit error, because a silently-dropped section is worse than
       none — the file would still look complete.

## Slice 49 — Standardize sweep: inline styles, and the paths sweep's leftovers (2026-08-19)

Dispatched by the counter at 5/4. Multi-round; the exit condition is a clean
scan, not a first fix.

1. [x] **49.1 — The scan's main output was what NOT to change.** A regex found
       10 raw-valued spacing declarations in inline styles. Only **one** was
       live markup; the other nine sit inside copyable code samples, including
       `<body style="margin:1rem">` in a troubleshooting page that teaches a
       standalone HTML file, where a raw value is correct. A bulk "fix" would
       have rewritten nine user-facing samples.

       Also corrected a wrong premise of my own before acting on it: I assumed
       tokenising would restore density-awareness. It would not — `--bo-space-*`
       are NOT density-remapped; density remaps the `--bo-density-*` aliases
       that reference them. `var(--bo-space-4)` and `1rem` are identical. The
       case for the change is consistency, and saying otherwise would have been
       a fabricated benefit.

2. [x] **49.2 — Inline flex/grid where a primitive already exists.**
       `reference/tokens.astro` — the page documenting the spacing scale — laid
       out its rows with `display:flex;gap:1rem` instead of `.bo-cluster` and a
       token from that very scale. `concepts/theming.astro` had
       `display:flex; gap; align-items:center; flex-wrap:wrap`, which is
       `.bo-cluster` verbatim; its box decoration moved into the `.brand-preview`
       rule that already existed. Both verified **layout-neutral by
       measurement** — identical child positions, heights and computed gap in
       both themes, before and after.

       `patterns/master-detail.astro` keeps its inline grid, and now says why:
       `.bo-grid` is `auto-fill`, which keeps empty tracks and would shrink both
       panes at wide widths; that layout needs `auto-fit`. Adding a modifier to
       express it would widen the public API to remove four lines of inline
       style, which the Standardize rule forbids.

3. [x] **49.3 — The home page illustrated density with something density does
       not affect.** Three `.bo-badge`s whose sizes were hand-faked with inline
       `padding-block`, and `.bo-badge` consumes no density token at all (it
       sizes from `em`). The "spacious" one did not even set `data-density`. The
       framework's headline feature, demonstrated by theatre, on the front page.

       Now three `.bo-btn`s, which do consume `--bo-density-control-height`, and
       they measure **28 / 36 / 44px** because density made them. Claim 60
       asserts strictly increasing heights AND no inline padding, so the theatre
       version fails; red-proved by collapsing the tiers to `comfortable`.

4. [x] **49.4 — `paths.mjs` had been created and then not adopted.** Six scripts
       still derived their own paths. One of them, `check-versions`, used
       `new URL('..', import.meta.url).pathname` — **the exact broken spelling
       `paths.mjs` was written to eliminate**, percent-encoded and ENOENT on any
       checkout whose path contains a space. Demonstrated rather than asserted:
       `/Users/some%20user/…` vs `/Users/some user/…`. It has never surfaced
       because no CI or dev path here has a space.

       `check-published` was flagged by the same scan and left alone — its
       `new URL(...)` is an HTTP URL, not a filesystem path.

5. [x] **49.5 — Two self-inflicted faults, both caught by running the thing.**
       The import-insertion helper skipped `check-versions` because its guard
       tested for the string `paths.mjs`, which the comment I had just written
       contained. And in `gen-llms` the insertion landed **inside a template
       literal** — the llms.txt content that teaches consumers which CSS to
       import — because the regex matched an `import` line in generated output.
       That would have shipped a stray line into a user-facing artifact. Both
       found by executing the scripts, not by reading the diff; the build went
       red on the second one.

6. [x] **49.6 — `--update` was all-or-nothing, and that caused a bad diff.**
       Accepting the four intended homepage baselines rewrote **all 40**,
       silently restaging 14 unrelated 1440px shots that differed only by
       sub-budget antialiasing noise. Those were restored by hand, and
       `visual-regression` now takes `--only=<substring>`, proved by running it
       with a non-matching filter and confirming it wrote nothing.

       The four homepage baselines were accepted only after the growth was
       **attributed exactly**: the density cluster goes 32px → 73px, and the
       document grows 41px — the same 41px the PNGs grew (5029 → 5070), so the
       whole delta is that one cluster and nothing else moved.

**Exit:** the re-scan is clean — 0 raw-valued spacing in live markup, 0
hardcoded hex, 1 inline grid remaining and documented as deliberate, and no
script deriving a path that `paths.mjs` already exports.

## Slice 57 — Owner input: the Ive design principles, installed (2026-08-19)

Owner asked HOW to apply the Jony Ive principles — skill, or prompt? Answer:
**doctrine + skill, split by cadence** — and not a prompt, because pasted
principles last one conversation and vanish at the next context clear.

1. [x] **57.1 — Doctrine: Objective §4, "Design the decision, not the screen."**
       The every-wake distillation lives where every add/remove is already
       tested — ROADMAP's Objective — as a FOURTH principle beside the owner's
       three. Deliberately not a rewrite: the existing three already encode
       subtraction (§1), less-for-more (§2) and the design language (§3); what
       Ive adds that was missing is purpose-before-interface, hierarchy
       (what is this / look at / do), and meaning-not-mechanism state text.
       Accept/refuse/rethink tests included, same shape as §1-§3.

2. [x] **57.2 — Skill: `/design-grill <screen>`** — the on-demand deep version:
       measured inputs first (primary-action count, hierarchy scan, element
       census, state language, chrome ratio), then the ten questions each
       carrying its consequence, then a verdict per element. Project-local
       (`.claude/skills/design-grill/`), so it knows this project's
       instruments and its rules bind it: measure before judging, verdict per
       element, refusals recorded, cost-to-remove bounds any removal.

3. [x] **57.3 — The filter was tested before being installed, and the codebase
       passes its most mechanical question.** Measured across all 19 pattern
       screens: **19 of 19 have at most one visually primary action in any
       state.** The two apparent violations dissolve on inspection — wizard's
       Next/Submit swap (never both visible) and master-detail's Edit/Save,
       where Save is inside the edit dialog. Recorded as the baseline the
       filter will be judged against: a screen that later fails it has
       REGRESSED, not merely disagreed with taste.

## Slice 63 — Standardize sweep: finishing last sweep's partial review (2026-08-20)

Dispatched by the counter at 4/4. Established axes (inline flex/grid, raw
spacing, hardcoded hex, `paths.mjs` adoption) all clean — same result as
Slice 60, no new instances.

1. [x] **63.1 — The `gate-report.mjs` review from Slice 60 was incomplete, and
       is finished here.** That sweep reviewed three scripts
       (`check-layout`, `check-pseudo-locale`, `check-target-size`) and judged
       them legitimately outside `gate-report.mjs` for collecting
       heterogeneous finding shapes. It did not enumerate the rest — six more
       scripts also call `process.exit(1)` without the shared module, and
       three of those hadn't been looked at before.

       Read all six. They split into two genuinely different reasons to stay
       outside `gate-report.mjs`, both worth recording so a third sweep does
       not re-litigate either:

       - **Heterogeneous multi-finding gates** (the Slice 60 category):
         `check-formatting` (Intl reproduction + ISO/CLDR divergence, two
         unrelated checks in one `failures` array) and `check-versions` — same
         shape as the three already reviewed.
       - **Single-condition guards inside build utilities, not verification
         gates**: `cut-version-snapshot` (CLI arg validation),
         `resolve-chrome` (can't find a Chrome binary), `scope-search-index`
         (index came back empty), `highlight-code` (three independent
         build-correctness assertions, not accumulated claims), and
         `check-published` (fail-fast on the first of two sequential checks,
         not accumulate-then-report). `gate-report.mjs`'s contract is
         "collect many claims, print all failures, exit once" — forcing that
         shape onto a single argv guard would be decoration, not
         consolidation.

       No code changed — this is the review itself being completed, which is
       the deliverable. `axe-audit` was also on the unconverted list;
       unreviewed until now, it collects one entry per (page, width, axe
       violation) — heterogeneous by construction, same category as
       `check-layout`.

2. [x] **63.2 — Re-verified the design-grill baseline (57.3) after this
       session's new patterns.** Measured again across all 19 pattern
       screens, including `object-page` and `value-help` which didn't exist
       when the baseline was first recorded: **still 19/19 at most one
       visually primary action**, same two legitimate exceptions
       (`master-detail`'s Save-inside-its-dialog, `wizard`'s Next/Submit
       swap). Nothing regressed the filter while building against it.

**Exit:** clean re-scan on every established axis; the `gate-report.mjs`
adoption question is now fully answered rather than partially answered twice.

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

1. [ ] **109.1 — regroup the sidebar (and the 104.1 tile index) from 3
       groups to the catalogue's 5 job families**: Enter & find / Work one
       record / Enter & correct data / Decide & clear queues / Monitor,
       report & output. Fixes a real reader problem: "review & approve"
       currently holds the detail family (`record-detail`, `object-page`,
       `master-detail`), which are not review screens. **Accept:** sidebar
       groups match the catalogue; no URL changes; 104.1 inherits the
       grouping; check-page-shape/sidebar assertions still green; verified
       live both themes.
2. [ ] **109.2 — rename `invoice-list` → `list-report` (industry name),
       with redirect.** The page is and always was the generic list screen;
       the invoice is sample data. **Accept:** new slug, old URL redirects
       (the redirect-stub mechanism check-links already understands),
       sidebar + tile + all internal links updated, llms.txt regenerated.
3. [ ] **109.3 — quality bar, sequenced not sprayed**: run the queued
       102.2 (object-page) and 102.3 (editable-grid) grills FIRST, extract
       the per-section bar they produce (states depth, data-contract
       realism, keyboard walkthrough), then sweep the other 18 pages
       against it — the 94.10 fix-the-recipe move. 101.4-101.7 get written
       against that bar from day one. **Accept:** the bar exists as a
       written checklist in `.roundtable/` after the two grills; the sweep
       is its own later item with per-page verdicts.
4. [ ] **109.4 — `field-editor` membership question.** A technique more
       than a screen; if the 102.x-derived bar finds the page thin, fold
       into `detail-form`/`editable-grid` + redirect. Decided by evidence
       from 109.3, not taste. Refusing to fold is a valid outcome.

Still owner-blocked inside this catalogue: **role home / overview page**
(row 3) — open since 99.1: is `app-launch` your "landing page", or do you
want a role home with live content (my open items, KPIs)? The catalogue
reserves the row either way.

## Slice 108 — P0: object-page sticky bleed-through, z-index scale, tab-vs-anchor clarity (2026-08-22)

Owner report (screenshot of `/patterns/object-page` mid-scroll, dark theme):
*"bug on object page — scrolling can see content behind... Cascade Layers
System -- pls define a clear rule so no confusion... navigation thru tab."*
Reproduced live before touching anything; all three trace back to real,
measured causes, not the same bug three ways.

1. [x] **108.1 — content visible behind the sticky bar while scrolling.**
       **Done 2026-08-22.** Root cause, measured: `.bo-app-shell__main`
       (every docs page's scroll container) carries `padding-block-start:
       var(--bo-space-6)`; a sticky child's `top: 0` pins BELOW that
       padding, leaving an uncovered `--bo-space-6` band where a
       scrolled-past table `<th>` was fully visible. The textbook fix
       (negative margin + matching padding, so the box extends into the
       gap) measured as a NO-OP — `.op-sticky` is a direct flex item, and
       Chrome does not fold a flex item's margin into its sticky offset
       the way block flow does. `inset-block-start: calc(-1 *
       var(--bo-space-6))` is what actually closes it — verified 0px gap
       at every scroll depth tested, both themes, both 1440 and 390.
       Compounding second cause: the Line items table has no height
       constraint of its own, so its sticky `<thead>` resolves against the
       SAME scrolling ancestor as the page header, and at the collision
       point `--bo-z-sticky-header` (1100) beat the page's own `z-index: 2`
       — an arbitrary number with no relation to the framework's stacking
       scale. New token `--bo-z-sticky-page: 1150` (tokens/z-index.css)
       fixes the collision generally: page-level chrome now always wins
       over a component nested in it, loses only to `--bo-z-dropdown` and
       `--bo-z-toast`. object-page.astro was the only pattern page with
       page-level sticky CSS, so the fix is scoped there; the token is
       shipped framework-wide for the next one. Verified live both themes,
       1440 + 390, full core + docs builds green.
2. [x] **108.2 — "Cascade Layers System" rule, so this stops being
       confusable.** **Done 2026-08-22.** The report named `@layer` for
       what was actually a z-index/stacking bug — a real, reasonable
       conflation: `/concepts/cascade` (titled "The cascade contract")
       documented `@layer` order in full and said NOTHING about
       `z-index`, whose only existing statement anywhere was a code
       comment in tokens/z-index.css. New section on that page, explicit
       about the two being different mechanisms (`@layer` decides which
       RULE wins on one element; `z-index` decides what PAINTS OVER what
       between different elements) — with the z-index scale rendered as a
       table **generated from the shipped token file** (`import.meta.glob`,
       same mechanism `base/palettes` already uses — never hand-typed,
       so it cannot drift the way the "32 pairs" / "70 kB" numbers did),
       plus the rule for where a new tier belongs. Not added to the DSA
       scoring rubric: 101.3's stop rule holds — that apparatus is
       maintenance-only until a component scores well and is plainly bad
       or vice versa, and a documented rule is what "no confusion" asked
       for, not a new scored dimension. The already-queued **102.2**
       (`/design-grill` on object-page) inherits this rule as something to
       check when it runs; not duplicated here.
3. [x] **108.3 — "navigation thru tab."** **Done 2026-08-22, verified
       working, not a functional bug.** Drove real Tab/Enter key
       sequences: activating an anchor-bar link scrolls correctly and
       keyboard Tab afterward reliably resumes from the activated
       section's DOM position (confirmed by checking the actual NEXT stop
       reached, not just `document.activeElement`, which reports `BODY`
       here as an expected quirk — Chrome's "sequential focus navigation
       starting point" for a non-focusable fragment target doesn't update
       that property, but genuinely does resume Tab order correctly).
       **What WAS a real gap**: the anchor bar is visually
       indistinguishable from the framework's real `.bo-tabs` (same
       segmented-pill look, one "current"), but behaves completely
       differently — no `role="tab"`, no arrow-key movement, every section
       stays mounted and visible, Tab visits it like any link. Added that
       distinction explicitly to the page's own Anatomy section, linking
       the real tabs component so a reader isn't left assuming ARIA-tab
       semantics that don't apply here.

## Slice 107 — Owner ask: button icon-only / text-only / icon+text (2026-08-22)

Owner: *"button with icon only, text only and icon & text."* Measured
before building anything: icon-only (`--icon`) and text-only were already
documented on `/components/button`; **icon+text had never been
demonstrated anywhere in the docs**, despite composing for free —
`.bo-btn` is already `inline-flex` with a gap, so a plain `.bo-icon`
beside text just works. Zero new CSS (Objective §2).

1. [x] **107.1 — document the missing third shape.** **Done 2026-08-22.**
       New demo section on `/components/button` showing all three shapes
       side by side (Approve/Ship with icon+text, a `--icon`-only settings
       button, plain text), plus an ApiTable note. **Two claims caught and
       corrected before shipping, not asserted from memory:** a first draft
       quoted a specific VoiceOver utterance ("check mark, Approve") this
       project has no tool to verify (RESUME.md's own standing note) — cut
       for an accessibility-tree measurement actually taken live instead: an
       unhidden `.bo-icon` changes NOTHING in Chrome's computed accessible
       name here (the mask has no text content to announce), and on an
       `aria-label`led icon-only button neither does the icon's hidden
       state (the label overrides the whole subtree regardless) — `aria-
       hidden="true"` is kept everywhere as the icon component's own
       documented default, not because measurement requires it. Verified
       live: both themes, 390px, plain + DOCS_BASE builds, all 22 gates.

## Slice 106 — P0: leaving the docs shell for the landing page silently failed (2026-08-22)

Owner report while dispatching a local Podman deploy: *"issue: navigation
between landing page and docs."* Reproduced live before touching anything.

**Root cause.** The docs shell boosts every link by default
(`hx-boost="true"` on `<body>`, `hx-select="#main-content > *"`). The
landing page (`/`) uses a completely different layout on purpose (its own
navbar, no sidebar, no `#main-content` — the 30.5 precedent) and was never
meant to be part of the boosted swap. Clicking the brand link or the
version-snapshot banner's "Switch to the latest docs" link therefore
boosted an AJAX request whose response had nothing matching
`#main-content > *` to select — htmx still updated the URL and
`<title>` (from the response), but left the CURRENT page's stale content on
screen. A reader clicking "busy-office-ui" from any docs page saw the URL
bar say `/` while the docs sidebar and the previous page's content stayed
exactly as they were — indistinguishable from the click doing nothing.

1. [x] **106.1 — both links to `/` opt out of boost.** **Done 2026-08-22.**
       `hx-boost="false"` on the navbar brand link and the version-banner
       link, same precedent already used for `#toc-nav`: a link leaving this
       shell entirely should do a normal navigation, not rely on the
       destination adopting a target id it has no reason to carry. Verified
       live (real click, both plain and DOCS_BASE builds): URL, `<title>`,
       AND rendered content (`main.landing` present, sidebar gone) all
       agree after the click.
2. [x] **106.2 — red-proved gate so this cannot regress silently.** Added a
       landing-navigation probe to `check-boost.mjs` — the opposite
       assertion of its existing PROBES (must find `boosted === false`, not
       `true`) plus a content check. **Red-proved before trusting it**:
       reverted the fix, watched the new probe fail with the exact message
       a future regression would print, restored the fix, watched it pass.
       Opportunistic same-file fix: `check-boost.mjs` carried the same dead
       `docsRoot`-and-friends import pattern the sweep found and fixed in
       `check-forced-colors.mjs` yesterday — removed here too (`join`,
       `dirname`, `fileURLToPath` were never used by any live code path).

## Slice 105 — Standardize sweep findings deferred with reason (2026-08-21)

From the counter-fired sweep (ultracode fan-out: 6 finders + 6 adversarial
verifiers, 19 of 20 findings confirmed real, 15 fixed in-wake). One finding
was too large to fix safely in the same wake:

1. [ ] **105.1 — one popover-positioning helper for dropdown / combobox /
       context-menu.** The anchor-under-invoker math (4px viewport clamp +
       flip-above-when-no-room) is implemented three times, and the copies
       have already drifted — the scroll-follow fix was built twice with
       different mechanisms, and `combobox.position()` never resets
       `insetInlineStart` the way dropdown's does, so a listbox that once
       flipped near the inline edge can keep a stale offset. Verified real
       by an adversarial pass (all three files read, drift confirmed).
       Deferred, not rushed: it is shipped geometry across three widgets and
       needs live verification of each (open/flip/scroll/RTL, both themes)
       plus behavior tests — a full wake of its own, not the tail of a
       sweep. **Accept:** one exported helper in `utils/`, all three
       behaviors call it, the two drifted mechanisms reconciled with the
       chosen one's reason recorded, each widget verified live at 1440+390
       incl. the flip case and scroll-follow, tests cover the clamp and
       flip branches, and the combobox stale-offset defect is red-proved
       fixed (reproduce first, then watch the helper kill it).

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

1. [ ] **104.1 — build the `/patterns/` tile index, generated.** An
       instance of the app-launch pattern: `bo-widget-grid` tiles grouped
       under the three existing workflow headings, each tile carrying the
       pattern's name, its opener's who-uses-it line, complexity badge, and
       components-used badges — all **extracted at build from the pattern
       pages**, never hand-written. Homepage's three "Patterns" links point
       at the index. **Accept:** the index renders one tile per pattern page
       that exists, with a gate asserting exactly that (red-proved both
       directions: a pattern page missing from the index, and an index tile
       whose page doesn't exist); tile copy is extraction, not authorship;
       zero new CSS classes; sidebar unchanged; verified live both themes,
       1440 + 390. **Owner add-on (2026-08-21): the simple→complex
       progression must be legible** — within each workflow group, tiles
       order by complexity ascending (1 → 4), so each group reads as a
       ladder whose first tile is its entry point. Derived from the same
       extracted badge, so the ordering cannot drift from the pages.

3. [ ] **104.3 — define the complexity scale, THEN audit the ladder**
       (owner add-on, 2026-08-21: "ensure comprehensive patterns (simple to
       complex)" — and the owner's follow-up grill of the distribution,
       which found the ground truth missing). Counted this wake: all 20
       pages carry exactly one badge (the 21st file, `rf/goods-receipt-rf`,
       is a documented iframe fixture, gate-exempt); hand-typed distribution
       1×4 / 2×7 / 3×8 / 4×1. **But the grill showed that number is a count
       of opinions, not a property of screens:** the 1–4 scale is defined
       nowhere (the page-shape gate only asserts a badge exists), and the
       badge anti-correlates with every extractable measure — `approval` is
       a 3 with the surface's MINIMUM component count (2, zero behavior
       inits) while `login` is a 1 with three; `master-detail` and
       `field-editor` (both 2) out-build five of the eight 3s on components
       and inits. Plausibly the badge measures *conceptual* weight (approval
       is a state machine with permissions), but nothing records that
       intent, which is the 94.12 two-standards defect in the making.
       **Accept, in order:** (a) a written definition of each level, each
       anchored to an observable property and naming a page that sits there
       and why — the 94.7 recipe; conceptual weight is admissible if the
       definition says what observable earns it; (b) the 20 badges re-read
       against the definition, corrections applied on the pages; (c) only
       then the per-group ladder audit — entry rung and top rung per group,
       every "missing rung" through the 99.4 front door (grill need first;
       refusing is valid — "that's the component page's job, link it" fixes
       index copy, not the pattern set). The provisional per-group reading
       (capture & edit spans 2–4 with no rung-1; review & approve 1–3;
       overview & shell 1–2) is recorded as INPUT to (c), not a finding —
       it may flip under the definition. 101.4–101.7 count toward
       comprehensiveness and are not re-litigated. 104.1's
       order-by-complexity add-on inherits (b): the ordering is only as
       good as the badge it extracts, so if 104.1 ships first it ships with
       the badges as-are and re-sorts for free when (b) lands.

2. [ ] **104.2 — preview images on the tiles. OWNER CALL after 104.1.**
       The proposal's honest fork: text+badges first (zero drift), vs
       build-time screenshots (feasible via the existing browser-harness
       chokepoint, but 20 pages × 2 themes per build costs minutes + MBs,
       and a dense ERP screen at tile size is mostly grey noise). Hand-drawn
       CSS miniatures are refused outright — hand-written artefacts
       describing generated surfaces are what the docs doctrine forbids.
       **Accept:** the owner picks (a) keep text tiles / (b) add generated
       screenshots, and the choice is recorded here with its reason.

4. [ ] **104.4 — complexity filter chips on the index, gated behind 104.3.**
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

3. [~] **99.3 — the command bar: document what we already run.**
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

4. [ ] **99.4 — missing components discovered along the way go through the
       front door.** The owner's own instruction, recorded as a gate on this
       slice: grill the need first (Objective §1/§2 — could existing
       primitives compose it?), then score it on the six DSA dimensions with
       cited evidence, then document it with the wrong-choice clause
       `check:wrong-choice` now requires. **Refusing a component is an
       expected outcome**, not a failure of the slice.

## Slice 103 — Standardize: the dist-walking chokepoint regrew (2026-08-21)

Dispatched by the counter at 4/4. **`dist-pages.mjs` was extracted on
2026-08-18 to end exactly one defect — four gates each walking `dist` with
their own copy of the exclusion set, giving the project two different answers
to "how many pages does this have?" (82 and 90). Three days later there were
SIX forks and four answers: 101, 93, 91, 89.**

Migrated all six to the chokepoint: `check-boost`, `check-links`,
`check-live-regions`, `check-search`, `scope-search-index`, `highlight-code`.
Three of them carried a hand-copied HALF of the exclusion set — `_astro`/
`pagefind` or `/v/`, never both, never the redirect stubs — which is the
precise shape the helper exists to prevent. `check-live-regions` was written
the same day and had no exclusions at all.

**Semantic equivalence checked per script, before and after**, so the sweep is
not "it still exits 0": links reported the identical 8902 internal links,
live-regions the identical 2 unhidden / 2 hidden, boost the identical 0
failures and 4 probes, search the identical 9 assertions, scope-search-index
the identical 508 regions across 89 pages, highlight-code 204 blocks — which
reconciles independently against scope-search-index's 204 code samples. Only
the page counts moved, 101 -> 93, which was the point.

The real win is inherited rather than written: every one of the six now gets
`distPages`' fail-loud guard, which throws when `dist` is empty instead of
letting a gate print a cheerful zero and exit 0.

1. [x] **103.1 — six forks folded back into `dist-pages.mjs`.** Done
       2026-08-21. `check-links` keeps its exception *inside* the chokepoint
       via `{ skipRedirects: false }` — its documented job includes redirect
       stub destinations, after two live 404s from base-blind redirects.

2. [ ] **103.2 — a gate over the gates, so this cannot regrow a third time.**
       Extraction did not hold on its own: nothing stopped a new script from
       writing its own walker, and nothing noticed for three days. The
       chokepoint needs an enforcer, not a convention. **Accept:** a check that
       fails when any `apps/docs/scripts/*.mjs` other than `dist-pages.mjs`
       enumerates `dist` itself, red-proved by adding a fork and watching it go
       red. Classify it honestly — recognising "walks dist" from source is
       `@heuristic`, so it ships `--self-test` per `check:selftests`. If it
       cannot be made to fail reliably, say so and keep the convention rather
       than shipping ceremony (the 94.11 lesson).

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

2. [ ] **102.2 — `/design-grill` on `/patterns/object-page`, comprehensive.**
       The owner asks for depth here specifically, and 99.2 already settled
       that object page is the long-record detail screen and must stay. So
       this grill is not "should it exist" but "is it good": score it on the
       six DSA dimensions with cited evidence like a component, then grill
       the screen as a whole — anchor navigation, the sticky action bar,
       what happens at 390px, print, and the states table. **Accept:** a
       scored report with a verdict per weakness — fix / accept-with-reason
       / refuse — and every "fix" queued as a numbered item with its own
       Accept.

3. [ ] **102.3 — `/design-grill` on `/patterns/editable-grid`.** The screen
       the owner has now flagged twice (see 97.2, the validation-UX ask that
       came with a screenshot of this page). Grill it as the hardest data
       screen the framework ships: in-cell validation and whether the message
       shifts rows while typing (measure it), keyboard traversal across a
       row, what a partial save does, and how it degrades without JS.
       **Accept:** same shape as 102.2 — scored, cited, verdict per weakness,
       fixes queued individually. Where it overlaps 97.2, this grill supplies
       the measurement and 97.2 keeps the cross-surface verdict.

3a. [ ] **102.7 — check the Data input / Forms family.** Owner ask,
       2026-08-21. **The interesting part is that the rubric already cleared
       it**: Slice 94 batch 2 scored these six components 95-100% and
       triggered no grill. So this is not a re-score — re-running a measure
       that returned "fine" will return "fine" again. The job is to ask what
       the six dimensions **do not** measure.

       Candidates, from what the rubric provably cannot see: whether the field
       matrix matches how an ERP clerk actually fills a form (tab order
       through a real row, not per-component focus rings); what happens on a
       server round-trip with values kept and errors wired — the case 97.1
       just proved the docs had been teaching wrongly; required-vs-optional
       marking; units, currency and number entry under a non-English locale;
       and what a genuinely long form does at 390px.

       **Accept:** a report in `.roundtable/` that names, for each weakness,
       whether the DSA rubric could ever have caught it — because a pattern of
       "no" is itself a finding about the rubric, and feeds 101.3's stop rule.
       Verdict per weakness: fix / accept-with-reason / refuse, fixes queued
       individually. "The family is genuinely sound and here is what the score
       missed anyway" is a valid outcome.

4. [ ] **102.4 — reconcile the standing wake prompt with reality. OWNER CALL.**
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

5. [ ] **102.5 — make the publish request cheap to say yes to.** Twelve
       restatements of "publish 0.3.0" have changed nothing, and the reason is
       now clear: publishing is owner-triggered by design, so the loop has been
       queueing an item it can never close. Restating it a thirteenth time is
       not work. **Accept:** one artefact the owner can act on in a minute —
       what shipped since 0.1.1 in consumer terms (not commit terms), what is
       breaking, the exact click-path to cut the Release, and a stated
       yes/no on whether 0.2.0 should be skipped rather than published late.
       Then the roadmap item becomes "owner-blocked, awaiting release",
       counted once, not restated.

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

1. [ ] **101.1 — publish 0.3.0, or record why not. Eleventh restatement.**
       Tagged at 06:00 today and pushed; the registry still serves **0.1.1**.
       There are now TWO unshipped layers: 0.3.0's 83 entries, plus **five
       more** stacked on top of the tag (scrim token, Money currency
       placement, the badge page-overflow P0, the mono token, `data-table`'s
       `min-inline-size`). Publishing is owner-triggered through Trusted
       Publishing — `git push` the tag, then publish a GitHub Release — and a
       wake cannot do it (npm here is unauthenticated by design).
       **Accept:** either it lands on the registry, or this item records the
       owner's decision to hold and the reason, so it stops being restated
       every grill as though nobody had decided.

4. [ ] **101.4 — Inbox / worklist.** The one screen an ERP user opens first
       and the framework does not have. `approval` is ONE approver's queue for
       ONE document type; an inbox is cross-type and cross-process —
       approvals, exceptions, assigned tasks, failed jobs — in one list with a
       "why is this here" per row. **Accept:** the pattern recipe's six parts,
       plus the two things that make it an inbox rather than a list: the row
       must say *why it is yours* (assigned / awaiting your approval /
       exception), and the states table must cover the empty case that is a
       success ("nothing needs you") distinctly from the filtered-empty case.

5. [ ] **101.5 — Notification.** `alert` and `toast` cover things that happen
       WHILE you watch; the ERP case is the opposite — a posting run finished
       twenty minutes ago. **Accept:** a persistent, readable, per-item
       dismissible surface with an explicit unread contract; states for empty,
       unread-count, and an item whose underlying record no longer exists.
       Grill first whether this is a screen, a dropdown off the navbar, or
       both — and whether it composes from `alert` + `dropdown` + `data-table`
       rather than needing anything new (Objective §2 says try that first).

6. [ ] **101.6 — Report.** Distinct from `reporting-dashboard`, which
       MONITORS. A report is RUN — parameters, then read, print or export.
       **Accept:** the parameter/run boundary in the data contract; states for
       not-yet-run, running, empty result, and too-many-rows; and a real print
       story, because the framework has strong `@media print` rules and
       nothing that exercises them end to end. The 30.4b windowed list is
       related and stays owner-deferred — do not silently pull it in.

7. [ ] **101.7 — Output form.** The printed artefact an ERP emits: PO,
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

3. [ ] **101.3 — give the scoring apparatus a stop rule.** Slice 94 produced a
       rubric, 39 scored components, three gates, a shared rule module, a
       retirement note and a 23-page ratchet — and each step generated its own
       follow-up (94.7 → 94.9/94.10 → 94.12 → 94.14, and 94.11 spawned by
       94.6). That is a system that grows by being used. It is now complete
       enough to stop investing in. **Accept:** a written stop rule — what
       would justify *another* rubric change (a component that scores well and
       is plainly bad, or vice versa), and what explicitly does not (a
       dimension reading uniformly, which is now a known and documented
       property). Until that trigger fires, scoring work is maintenance of the
       23-page ratchet only, and the queue belongs to Slices 97/99/100, which
       are what the owner actually asked for.

## Slice 100 — Owner wishlist: drag & drop list (2026-08-21)

Owner: *"drag & drop list."*

**Triaged as GRILL-FIRST, not build-first — and the owner's own Slice 99
instruction says so ("grill the need of it first").** Recorded here with what
is already true, so the grill starts from facts.

**What exists today.** `.bo-ordered-list__actions` ships a per-row reorder
group — ↑ ↓ ✕ buttons — and they are deliberately *inert markup*: "wire the
reorder/remove in your app or HTMX". So the framework already has a reorder
affordance, and it is **keyboard-accessible by construction** because it is
buttons. Separately, `file-dropzone.ts` does implement drag-and-drop, but for
*files* onto an `<input type="file">` — a native, well-supported case with a
click fallback the platform provides.

**The question the grill has to answer** is not "can we build it" but whether
dragging earns its place beside a working button path:

- **Drag-and-drop is the classic inaccessible interaction.** Pointer-only by
  default; no keyboard equivalent unless one is built; screen-reader support
  needs explicit live-region narration of position ("moved to 3 of 7");
  touch conflicts with scrolling. Every one of those is a real cost this
  framework's standing rules would force us to pay in full.
- **The honest ceiling:** if it ships, dragging can only ever be an
  *enhancement over* the buttons, never the only path — the same shape as
  every other behavior here (`initMoneyField()` optional, tree-table readable
  server-rendered). A drag implementation that replaces the buttons would fail
  the two-channel rule outright.
- **Where is the ERP demand?** Reordering line items, approval routes, saved
  view columns are the plausible cases. Are any of them frequent enough, and
  painful enough with ↑↓, to justify the mechanism?

1. [x] **100.1 — grill the need before any code.** **Done 2026-08-21. Verdict:
       REFUSE.** Report: `.roundtable/grill-drag-drop-2026-08-21.md`. Checked
       every plausible ERP reorder candidate against what actually ships:
       line items add/remove only, no reorder at all; approval routes render
       as `bo-timeline` — a fixed history, not a route being configured;
       no saved-view/column-order screen exists. **The only reorderable
       thing in the entire framework is `bo-ordered-list__actions`'s own
       demo, at 3 items** — there is no screen and no row count where
       dragging would win, because nothing reorderable at scale exists yet.
       Keyboard/SR equivalent checked concretely: `aria-grabbed`/
       `aria-dropeffect` (ARIA's own answer) were deprecated in ARIA 1.1 for
       being unreliably implemented — zero hits in this codebase or any
       dependency — so a real build would mean hand-rolling and permanently
       maintaining a second interaction model (pick-up/move/drop + live
       announcements) alongside the pointer one, for a cost the two-channel
       rule already avoids: the existing ↑↓ buttons deliver the same end
       state today. Touch/scroll conflict is solvable only by adding a
       dedicated grab handle (`touch-action: none`, scoped) — confirmed
       zero `touch-action` declarations exist anywhere in the shipped CSS,
       so this problem has never been solved here even once. Recorded but
       explicitly NOT queued: if "moving an item far" is ever a measured
       pain, the cheaper fix is jump controls (move to top/bottom) added to
       the existing `__actions`, not drag — inventing that fix now, with no
       screen showing the pain, would repeat the same mistake as building
       drag itself.

## Slice 98 — Standardize: the two wrong-choice gates were one rule, written twice (2026-08-21)

Dispatched by the counter at 4/4. The drift was **one wake old and mine**:
94.10 added `check-wrong-choice.mjs` and 94.12 taught `check-dsa-scores.mjs`
to assert agreement with it — and the second copied the first's detector
regex byte-for-byte and re-declared its EXEMPT list as a hardcoded `Set`,
under a comment reading *"Kept in step with check-wrong-choice.mjs's own
EXEMPT map"*. A promise a human has to keep is drift with a date on it.

**Worse than the usual duplication, and worth naming why.** These two gates
assert an *equivalence* between each other. If their rules diverged, the
cross-check would compare two different questions — and still pass. A green
gate that has stopped measuring what it claims is the exact failure this
project treats as worse than no gate at all.

Both now import `wrong-choice-rule.mjs`: one `EXEMPT` map, one
`hasWrongChoiceClause()`. Identical shape to why `gate-report.mjs` exists.

**Behaviour-preserving, and proved so rather than assumed:** both gates
report the same numbers after the refactor as before (14 carry / 23
outstanding / 3 exempt; 312 assertions over 39 scored), and **both
red-proofs were re-run** — a page outside TODO/EXEMPT missing its clause, and
a `content` score disagreeing with the page — each still naming the failure
and exiting 1. Refactoring a gate's core logic and then trusting its green is
how a dead detector gets made.

**Clean pass on the established axes:** raw hex outside an at-rule is only
`tabs.css`'s nine mask-alpha `#000` (reconciled for the **sixth** time now —
they are the alpha channel of a `linear-gradient` mask, not theme colour, and
the file says so); the Demo-conversion census is exactly 19, matching 91.3's
record; and one shared line across all docs gates, a `console.error` print
loop in `check-links` and `check-notes`, both legitimately outside
`gate-report` per Slice 63.1's review. One print line is not worth a module.

## Slice 97 — Owner wishlist: validation check UX/UI (2026-08-21)

Owner asked for a look at the validation experience, with a screenshot of
`/patterns/editable-grid`: a QTY cell reading 450, red border, and
*"Exceeds on-hand (200)"* beneath it.

**Two things were measured before writing this entry, and they point in
opposite directions.**

**Verified GOOD — do not re-litigate.** The two-channel contract holds
everywhere: **zero** invalid controls across the whole built site lack either
`aria-describedby` or an adjacent message. The screenshot's own markup carries
`aria-invalid="true"`, `aria-describedby`, and a real text message — the red
border is the colour half, the revealed message is the non-colour half, and
`aria-invalid` is the programmatic one. The field styling changing *only*
colour (border + label) is therefore not a two-channel defect, because the
message reveal is the visible non-colour change. Recorded so a grill does not
"find" it.

**Verified BAD — and the framework already knows the rule it is breaking.**
`form-field.css` states the contract itself: `role="alert"` *"if it appears
dynamically"*. Measured across the built site: **8 of 8** `role="alert"`
elements are present at page load and not hidden — `alerts`, `combobox`,
`form`, `quantity`, `bulk-actions`, `editable-grid`, `staging`,
`validation-summary`. Every one is a demo of an error state, so every one is
an assertive live region that exists before the user has done anything.

1. [x] **97.1 — `role="alert"` on messages that are present at load.** An
       assertive live region is for content that ARRIVES. Present at parse
       time it is unreliable (screen readers commonly do not announce regions
       that already exist when the page is read) and, where it does fire, it
       interrupts. The docs are the recipe consumers copy, so this teaches the
       wrong shape for the most common ERP case of all: a server re-rendering
       a form with errors after a failed POST.

       The nuance that makes this a decision rather than a find-and-replace:
       after that POST the error genuinely IS new information, but it arrives
       as a **page load**, not as a DOM mutation, so a live region is the
       wrong mechanism — focus management and a summary the user lands on is
       the right one, which is what `/patterns/validation-summary` already
       exists for.

       **Accept:** state the rule in one place (server-rendered-at-load vs
       inserted-after-load, what each uses); every demo that renders a static
       error drops `role="alert"` or gains a comment saying why it keeps it;
       the count of unhidden `role="alert"` present at load falls to only
       those that are genuinely injected; and the claim is executable — a
       check that fails if a `role="alert"` ships in the built HTML without
       either `hidden` or a documented exception.

       **Done 2026-08-21. The cause was not eight slips — it was two rules.**
       Four statements of the rule shipped and they disagreed in a specific
       way: `alert.css` and the alerts page picked the role by **severity**
       ("role=alert for errors"); `form-field.css` and the accessibility table
       picked it by **arrival** ("if dynamic"). Severity is the right answer to
       the *second* question — assertive or polite, once something does arrive
       — and it was being used to answer the first. So this is recorded as a
       reconciliation, not "two pages were wrong".

       The rule now lives in one place,
       `/concepts/accessibility#live-regions`: (1) does it arrive after load?
       no → no live region at all; yes → (2) error → `role="alert"`, else
       `role="status"`. All four statements point at it.

       **Measured, built artifact: 10 `role="alert"` → 4; unhidden 8 → 2.**
       Four field-level messages dropped the role (`aria-invalid` +
       `aria-describedby` already reach a screen reader); the alerts severity
       gallery and validation-summary's document-level strip dropped it; two
       result banners KEEP it with the reason stated at the markup, because in
       a real screen they arrive by swap and that is what a consumer copies.
       `check:live-regions` is in the build chain, red-proved three ways
       (unhidden alert on a non-exception page; a stale EXCEPTIONS entry; and a
       control confirming a `<pre>` code sample is correctly ignored).

       Swept for the same defect in the polite variant and found **none**: all
       four unhidden `role="status"` are legitimate — two empty `copy-toast`
       regions that exist before injection, two `aria-busy` skeletons. No
       follow-up item, deliberately; there is nothing to queue.

2. [x] **97.2 — grill validation as ONE experience, not three surfaces.**
       **Done 2026-08-21. Verdict: it IS one design — the grid reuses
       `.bo-form-field` verbatim — with two navigational seams, queued as
       97.3/97.4.** Report: `.roundtable/grill-validation-2026-08-21.md`.
       Measured live with real keys: an in-cell message costs **+22px per
       line** and shifts every row below by the same; before the first blur
       typing an invalid value shifts nothing (`:user-invalid` correctly
       unmatched while `checkValidity()` is already false); after the first
       invalid blur it toggles per keystroke, so the row flips ±22px exactly
       at validity transitions — accepted with reason (reserving the space
       costs every dense grid row 22px permanently). Summary verified live:
       submit intercepted, focus lands on the box, links `#field-id`, click
       focuses the field — field-targeting subsumes row-targeting since focus
       scrolls the row into view. Wording agrees in structure across all
       three surfaces; the field rule exists only by example. Two instrument
       failures caught before quoting (a triple-click concatenating number
       values; a +40-vs-+22 disagreement that was column-width wrap, not a
       second mechanism).

3. [x] **97.3 — the per-row vs document-level validation boundary is stated
       nowhere.** **Done 2026-08-21.** The boundary is now stated on both
       pages: editable-grid's Data contract section says per-row failure needs
       no summary and names the document-level submit as the summary's job;
       validation-summary's opener carries it as its wrong-choice clause
       (**Not for per-row saves**), which moved the PATTERN_TODO ratchet
       15 → 14 (patterns carrying 5 → 6). Both pages' Related now link each
       other. The grid's invalid-cell input has `id="line-1-qty"` in the live
       demo AND the copyable sample, with a comment saying why the id matters
       (summary links are built from it). Verified in the rendered DOM (id
       appears exactly once outside `<pre>`, clause + cross-links present,
       summary behavior unregressed live), both themes via the site's own
       picker, no horizontal overflow at 390px, and the DOCS_BASE build is
       green — the first build attempt failed usefully when check:links
       flagged a literal `href="#id"` inside the new sample comment (the
       comment was reworded; the gate did its job on rendered text). The grid's own contract (`PATCH …/lines/:lineId`, 422 → that
       row) makes a summary ceremony for per-row saves — correct, keep. But a
       document-level submit that fails multiple rows is exactly
       `/patterns/validation-summary`'s job, and neither page names the
       boundary or links the other ("validation-summary" appears in
       editable-grid's rendered body only via the sidebar nav; Related has six
       links, none the summary). **Accept:** one sentence on each page naming
       when the other takes over; each page's Related links the other; the
       grid's copyable invalid-cell input gains an `id` (today a summary link
       for it renders `href="#"` — the behavior builds `'#' + field.id` from
       an input that has `aria-label`/`aria-describedby` but no id).

4. [x] **97.4 — state the field-message wording rule once.** **Done
       2026-08-21.** Stated in the form page's Fields caption — the element's
       home, directly beside the mechanism contract and 97.1's live-region
       pointer: *name the violated constraint and include the datum the user
       needs to act, never a bare "Invalid value"* — citing both shipped
       examples ("Unknown cost center code" on the page itself, the grid's
       "Exceeds on-hand (200)" linked), and noting the screen-level voices
       (summary heading, document strip) differ by design with each stated on
       its own page. Rendered exactly once, both links verified, plain +
       DOCS_BASE builds green. Not a gate, per the item's own terms. "Exceeds on-hand
       (200)" and "Unknown cost center code" agree by example — a terse
       statement of the violated constraint carrying the datum needed to act —
       but no page states the rule, so the next message has nothing to follow.
       The summary heading (GOV.UK "There is a problem") and the document
       strip's "say what is still possible" are each stated on their page;
       field messages are the odd one out. **Accept:** the rule stated in ONE
       place (beside the live-region rule 97.1 centralised in
       /concepts/accessibility, or on the form page), with both shipped
       examples cited; explicitly NOT a gate — message quality is semantic,
       the 94.11 shape.
       The owner's ask is broader than the bug above. Validation currently
       appears in three places with three shapes: `.bo-form-field` (message
       under a labelled control), the editable grid (message inside a table
       cell, growing the row), and `/patterns/validation-summary` (a list at
       the top of the screen). Whether those are one design with three
       renderings or three designs that merely coexist has never been asked.

       **Questions to answer, each with evidence:** does an in-cell message
       shift the rows below it while the user types, and by how much
       (measure it)? When a row fails and the user has scrolled away, what
       brings them back — and does anything today? Is the summary's link
       target the field or the row? Do the three agree on wording ("Exceeds
       on-hand (200)" is a consequence; is that the house voice everywhere)?

       **Accept:** a grill report in `.roundtable/` with a verdict per
       surface — keep / align / replace — each backed by a measurement or a
       quoted rule, not taste; every "align" becomes a numbered item with its
       own Accept. Refusing to unify is a valid outcome if the three contexts
       genuinely differ, but it has to be argued.

## Slice 96 — Owner wishlist: currency on the right of the amount (2026-08-21)

Owner: *"Money basic — option for currency on the right."*

**Triaged ACCEPT, and the Objective changes the shape of the answer.** The ask
is real and not cosmetic: currency placement is a locale convention, not a
preference. `de-DE` and `fr-FR` write `1.234,56 €` with the symbol trailing,
`en-US` writes `$1,234.56` leading, and an ERP sold into both cannot pick one.
This framework already takes locale seriously enough to gate pseudo-locale
expansion in CI, so a field that can only render one of the two conventions is
a genuine gap.

**But it should not be an "option", and that is the less-for-more test
(§2) doing real work.** A modifier — `.bo-money--currency-end` — would be a
second way to say something the markup already says. The joint is currently
hard-coded (`__currency` always kills its END border and radius, `__amount`
always its START), which is the only reason DOM order does not already work.
Derive the joint from **position** instead and the component simply renders
whichever order it is given, with no new class, no new API surface, and no
decision for the consumer to get wrong.

**Two properties that make position-derived the correct answer, not merely the
tidier one:**

- **Tab order stays correct by construction.** The obvious CSS-only trick —
  `order` on the flex children — would reverse the visual order while leaving
  DOM order alone, so focus would jump right-to-left against the rendering.
  That is a WCAG 1.3.2 / 2.4.3 defect, and it is exactly the kind this
  framework refuses elsewhere.
- **No behavior change is needed.** `initMoneyField()` resolves its pair with
  `closest('.bo-money')` + `querySelector('.bo-money__amount')`, which is
  already order-independent — verified in `money-field.ts:52-55`, not assumed.

1. [x] **96.1 — DONE 2026-08-21. derive the money joint from DOM order.**
       Measured against every Accept criterion rather than eyeballed. In BOTH
       orders, at **1440px and 390px**: no double border at the seam
       (`border-inline-end: 0px` on the leader, `1px` on the trailer), gap
       exactly **0px**, outer corners 6px and inner corners 0px, equal
       heights, and `domOrderMatchesVisual: true`. `api.json` gains **no
       modifier** — `variants: []`, still the same three classes.
       `initMoneyField()` verified working with the select LAST: switching to
       JPY drove `step` 0.01 → 1 and losslessly reformatted 1250.00 → 1250.

       Focus ring observed, not inferred — but only after three failed
       attempts, which is worth recording. Programmatic `.focus()` never sets
       `:focus-visible`, and synthetic clicks did not reach the page (the
       screenshot space is 1456px against a 1280px viewport). What worked was
       JS-focus followed by a **real** key event, which flips Chrome into
       keyboard modality: the focused half then reports
       `solid 2px @2px` with the sibling at `none`, so the ring is
       per-element and uncut. **Stated precisely: this was observed on the
       LEADING element** — the one whose end border is dropped, i.e. the half
       that could have shown a cut ring. The trailing select keeps its full
       border and is strictly less at risk, but Tab would not advance focus in
       this harness, so it was not directly observed. Replace the
       unconditional radius/border rules with position-dependent ones
       (`:first-child` / `:last-child`), so `select` then `input` renders
       `[ USD | 1250.00 ]` and `input` then `select` renders
       `[ 1250.00 | USD ]`, both as one joined control.

       **Accept:** both orders render as a single control with one shared
       edge, verified by measuring the seam in a browser (adjacent borders
       must not double) in **both themes** and at 390px; focus ring stays
       per-element and uncut on each half in each order; tab order matches
       visual order in both; `initMoneyField()` still updates precision with
       the select in either position; **no new class ships** — confirm the
       generated `api.json` gains no `--currency-end` modifier. The docs page
       gains one demo of the trailing form naming the locale reason, and the
       CHANGELOG entry says this is a Fixed/Added that requires no markup
       change from existing consumers.

2. [x] **96.2 — DONE 2026-08-21. Verdict: the mirrors SHOULD diverge, and the reason is measured. decide whether `.bo-quantity` gets the same treatment.**
       Accept allowed either outcome; the data picked the second. Placement
       was measured with `Intl` across en-US, de-DE, fr-FR, ja-JP, ar-EG,
       pt-BR, he-IL and sv-SE: **currency splits 3 leading / 5 trailing**,
       which is what justified 96.1 — but **the unit trails in 8 of 8**,
       including both RTL locales (`٥ كغم`, `5 ק״ג` still put the value
       first). There is no `kg 5` convention to support, so supporting one
       would be surface with no caller. The reason now lives in
       `quantity.css` so a future sweep does not re-open it.

       Also recorded there: nothing breaks if a consumer writes the select
       first anyway. Quantity's joint keys off `+` adjacency, so an unexpected
       order yields two separate rounded controls rather than a mis-drawn
       joint — it fails soft, which is why it needs no guard.

       **The measurement's first run was wrong and nearly went into this
       entry.** The placement detector used `/^\d/`, so Arabic-Indic digits
       did not count as digits and `ar-EG` came back LEADING for BOTH
       currency and unit — the opposite of the truth for the unit, and it
       would have made the two cases look identical. Fixed with `\p{Nd}` and
       by stripping RTL marks. Its
       button-less `( qty | unit )` joint is the exact same construction
       (Slice 81 built it as a deliberate mirror of Money's), and unit
       placement has the same locale question — `5 kg` vs some locales' `kg
       5`. **Accept:** either apply the identical position-derived rule and
       say so, or record why the unit's position is fixed where Money's is
       not. Do NOT leave the two mirrors diverging silently, which is what
       Slice 81 built them explicitly to avoid.

## Slice 95 — Owner wishlist: device-fitness and ERP-coverage scoring (2026-08-21)

Two asks, triaged together because both extend the scoring work and both
turn out to hinge on the same question: **is the number derived from a fact
the repo already holds, or is it a new judgment?** 95.1 is the first; 95.2 is
the second, and that is why they get different shapes.

1. [x] **95.1 — PARTLY DONE 2026-08-21: the RF half shipped; the touch half is re-scoped and re-queued as 95.3, with the reason. Device fitness: mobile / tablet / RF scanner, SURFACED not
       **The RF half — done, and the gap was worse than the item said.**
       `rf-essentials` is named on four docs pages and **the list of what is
       actually in it appeared on none of them**, so the owner's exact
       question — *"just need components that required"* — could not be
       answered from the docs at all. The profile has encoded that answer
       since 59.2 and nobody could read it.

       The 12-component list now renders on `/patterns/goods-receipt`, where
       the profile is explained, **generated** from
       `packages/core/scripts/rf-components.mjs` — extracted from
       `build-rf-essentials.mjs` so one array both compiles the bundle and
       renders the page. The line says a missing component is a scope
       statement, not a gap, which is the owner's own framing.

       **The single-source guarantee is red-proved, not asserted:** adding
       `tree/tree` to the array moved the bundle to 13 components AND the page
       data to 13; restoring returned both to 12.

       **95.3 — the touch half, re-scoped and honest.** Accept originally said
       touch status should come from `check:target-size`. Building it revealed
       why that is not a simple wiring job: that gate measures **instances on
       a page**, reporting things like `bo-tag-input__remove 16x16 (nearest
       91px)`. Turning instance findings into a per-component verdict is an
       inference across contexts, not a fact to surface. A source-scan
       alternative was tried and abandoned in the same wake — it conflated
       `em` sizes (which DO scale with density) with fixed ones, matched
       non-interactive parts, and double-counted `form`'s five stylesheets.
       **Accept for 95.3:** either make `check:target-size` emit its findings
       as data and map class → component via `api.json` (stating that the
       verdict is per instance, aggregated), or record that touch fitness is
       a screen property rather than a component one and drop it. Do not ship
       a per-component touch claim derived from a heuristic.

       Two mistakes worth recording. An `import` placed AFTER a statement in
       Astro frontmatter fails the build with three different misleading
       errors ("Unexpected .", "Unterminated string literal", each pointing at
       an unrelated line) — moving it up with the other imports fixed it. And
       the list first shipped with `docs-list` instead of the established
       `docs-list-bare`, so `<ul>` markers painted into the flex row and
       collided with the text; **caught by looking at the render**, not by any
       gate, and the correct composition was already in use on five pattern
       pages.
       re-scored.** Owner: score components for mobile+tablet and for RF
       scanner, noting RF needs only the components a scanner function
       actually uses, not all of them.

       **Do not add two dimensions to the DSA rubric.** 94.4 established the
       rubric works and that `Fit` is the dimension carrying real signal;
       diluting seven dimensions into nine — where the two new ones would read
       3/3 for almost everything — reproduces exactly the flattening 94.4 was
       raised about. It would also make them *judgments*, when they are
       already **facts this repo gates**:

       - **RF membership is declared**, not opinion: `RF_COMPONENTS` in
         `scripts/build-rf-essentials.mjs` lists the 12 components in the
         profile, and `check:rf-floor` already proves every feature they use
         is guarded at the Chrome/WebView 108 floor (59.2/59.3). The owner's
         "only the components required" is therefore *already modelled* — the
         gap is that a reader of `/components/dialog` cannot see that dialog
         is NOT in the RF profile.
       - **Touch fitness is already measured**: `check:target-size` runs all
         three densities and reports which controls conform via the WCAG 2.5.8
         spacing exception rather than a 24px floor.
       - **Narrow-width fitness is already measured**: `check:pseudo` runs 14
         pages × 2 widths at compact density with text expanded ≥23%.

       **Accept:** a generated per-component line — same rule as `ApiTable` /
       `DsaScore`, never hand-typed — stating (a) in the RF profile: yes/no,
       sourced from `RF_COMPONENTS` so it cannot drift, and (b) touch-target
       status at spacious density, sourced from `check:target-size` output.
       An honest "not in the RF profile" is the useful answer for most
       components and must read as a scope statement, not a failing grade.
       **Refused as part of this:** inventing a mobile/tablet *score*. The
       framework is density- and container-driven with no device breakpoints;
       a per-device grade would imply a device-specific design that does not
       exist and that Objective §2 exists to prevent.

3. [x] **95.3 — DONE 2026-08-21. Verdict: touch fitness IS a screen property; the per-component claim is dropped, and the docs already said so. touch fitness: emit it from the gate, or drop the
       **The gate's own output settles it.** In one run, `bo-checkbox 16x16`
       appears **three times with nearest = 185px, 32px and 33px**, and
       `bo-data-table__sort-btn` three times at 78px, 812px and 812px. Same
       component, same size, three different conformance margins — because
       the margin depends on what else is on that screen. WCAG 2.5.8's
       spacing exception is itself *defined* in terms of neighbours ("no
       other target's centre within 24px"), so a per-component claim would
       not merely be imprecise, it would misrepresent the criterion.

       **And `/concepts/density` already documents it correctly**, including
       the decisive sentence: *"If you pack controls closer than 24px between
       centres, you break that, and the framework cannot guarantee it for
       markup it did not author."* So the per-component surface 95.1 nearly
       built would have **contradicted a page we already ship** — which is
       the strongest possible argument for the drop.

       **One real defect found while confirming this.** That same passage
       quoted "measured: 32-191px to the nearest neighbour" — a hand-typed
       measurement that had drifted: today's run reaches **812px**. Replaced
       with a citation of `check:target-size` rather than a corrected number,
       because the upper bound tells a reader nothing (only the minimum
       clearance bears on conformance) and any specific figure can only rot
       again. Verified live in both themes.

 claim.**
       Queued properly here (roadmap 101.2). 95.1's Accept said touch status
       should come from `check:target-size`; building it showed that gate
       measures **instances on a page** — `bo-tag-input__remove 16x16
       (nearest 91px)` — so a per-component verdict is an inference across
       contexts, not a fact to surface. A source-scan alternative was tried
       and abandoned in the same wake: it conflated `em` sizes (which DO
       scale with density) with fixed ones, matched non-interactive parts,
       and double-counted `form`'s five stylesheets.

       **Accept:** either make `check:target-size` emit its findings as data
       and map class → component via `api.json`, stating plainly that the
       verdict is per instance and aggregated; or record that touch fitness
       is a SCREEN property rather than a component one and drop the
       per-component claim. **Do not ship a per-component touch claim derived
       from a heuristic** — that is the shape 94.11 disproved.

2. [x] **95.2 — ERP coverage: benchmark JOBS, not component catalogues.**
       **DONE 2026-08-21**, run together with 99.1 as one report:
       `.roundtable/coverage-erp-jobs-2026-08-21.md` — they are the same
       question asked twice, 95.2 in general and 99.1 with the owner's own
       answer as input. No percentage, as Accept required.

       **Finding: the gaps are SHAPES, not domains.** Order-to-cash,
       hire-to-retire and the rest recompose from screens we already have —
       a sales order is a list, a detail, an approval and a line grid, and so
       is a purchase order. Documenting them would re-photograph existing
       screens with different column headings. Those are marked
       *composable, do not build* in the report so a future wake does not
       read the coverage table as a to-do list.

       What no recomposition reaches is five screen shapes — command bar,
       inbox, notification, report, output form — and **all five were named
       by the owner**, which is the strongest validation the coverage method
       could have got.
       Owner asked directly whether this is possible and whether it makes
       sense to benchmark. **Possible: yes. As a component-catalogue
       comparison: no — that one actively fights the Objective.**

       A coverage score against SAP Fiori's or Ant Design's component
       inventory structurally emits "you are missing X, Y, Z" and becomes a
       component-adding engine, which is the precise failure Objective §1 and
       §2 are written to refuse. It would also flatter competitors' taxonomy:
       this framework deliberately ships one component with many settings
       where others ship five, so a catalogue diff would report false gaps
       (`.bo-input--numeric` IS the fourth numeric family member — roadmap 77).

       The version that works measures **whether a user can finish an ERP
       job** with what ships. That is checkable, it is the question the owner
       is actually asking ("what is missing to add in future roadmap"), and
       **the 19 pattern pages are already a partial answer** — each documents
       a screen, its data contract and its states. Coverage then reads: which
       ERP jobs have a pattern, which have components but no pattern, and
       which have neither.

       **Accept:** a job list drawn from a real ERP process inventory
       (procure-to-pay, order-to-cash, record-to-report, hire-to-retire, plus
       warehouse/RF execution), each marked *pattern exists* / *composable
       from documented components but undocumented as a screen* / *genuinely
       absent*; the report lands in `.roundtable/` and every "genuinely
       absent" entry is graded against the Objective before it becomes a
       queued item — refusing is a valid and expected outcome. **Explicitly
       not Accept:** a percentage. A coverage number invites maximising it,
       and the honest deliverable here is a ranked list with reasons.

       **Sequencing:** run this AFTER Slice 94 finishes scoring the remaining
       families. Coverage asks what is missing; that judgment is better made
       once every component that exists has been looked at, and 94 is four
       families from done.

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

   [ ] **94.8 (original text) — write the missing "when this is the wrong choice" guidance**
       for the six components 94.7 named. Each page gains one sentence naming
       a context where it is not the right answer and what to use instead —
       the shape `data-table` (24 contrastive statements) and `combobox` (7)
       already have. **Accept:** each of the six re-scores to `content: 3`
       with a citation quoting the new sentence; the sentence names a real
       alternative that exists in this framework, not a hypothetical.
       Cheap per page, and it is the kind of guidance a first-time user needs
       most — the six are currently silent on it.

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

"Show the score in the document of each component so we know whether we
need to improve it in the future." Built generated, not hand-typed —
a score written into 40 pages would drift the first time one is
re-taken, so it follows the same rule as `ApiTable`/`ClassRef`.

**93.1 — the mechanism.** `apps/docs/src/data/dsa-scores.json` is the
source of truth (per-dimension score + citation + `improve` list);
`DsaScore.astro` renders it as a "Design-system alignment" section
after the generated API tables. Wired into the three scored pages.
Re-scoring is now a JSON edit; 92.6's remaining batches only add JSON
entries rather than touching pages.

**Two judgment calls, recorded rather than left implicit:**
- An **unscored component renders an honest "not yet scored" line**,
  not nothing — absence should read as "not done yet", not as an
  omission. 3 of 40 are scored today.
- **`na` dimensions shrink the denominator.** Amount is a display span
  with no interaction story, so it scores 17/18, not 17/21 — verified
  live that its Interaction row reads `n/a` and the denominator is 18.

**Consumer-visible by consequence** — the docs site is public, so these
are now published quality scores. Judged defensible (citations make
them read as confidence; the known gaps are all small literals), and
flagged to the owner with the offer to move them behind an
internal-only page instead — cheap now, expensive after a publish.

Verified live, both themes: money 95% (20/21), quantity 95% (20/21),
amount 94% (17/18), each with its per-rule evidence table and
Known-gaps line.

## Slice 92 — Owner direction: the design system takes the wheel (2026-08-21)

Owner: update the design system with a per-field-type design guide;
reusability stays a priority but an unsuitable design damages UX — and
add a scoring system measuring how much each component's design ALIGNS
with the design system. Clarified mid-build: the score is an alignment
measure, distinct from the Slice 37 worth rubric.

**92.1 — Objective §3 precedence amendment (owner call).** Reusability
decides what SHIPS; suitability decides what a screen USES; on
conflict, suitability wins, and the resolution is always the suitable
REUSABLE primitive from the matrix — never a one-off.

**92.2 — the field matrix**, on `/concepts/design-language`: date /
number / money / quantity × standalone form / read-mostly / entry grid
/ display, every cell a setting of the four primitives, with the
two-axis generator stated (the screen's job picks the chrome; the
qualifier's mutability picks joined-vs-split). Pointer added from the
inline-editing chooser. Verified live.

**92.3 — two scoring instruments, clarified and shipped.** (a) The
Slice 37 WORTH rubric stays for keep/improve/merge/deprecate, extended
with a fifth dimension — **Fit**, /15 — the dimension that couldn't see
steppers being wrong in grids. (b) NEW: the **Design-System Alignment
score (DSA)** — the owner's ask — seven dimensions = the six
design-language rules + Fit, 0-3 each with a checkable citation, N/A
leaves the denominator, reported as %. Instrument described on
`/concepts/design-language` ("Scoring alignment"); scores live in
`.roundtable/` and are re-taken when a design changes. Pilot on the
numeric family: money 95%, quantity 95%, amount 94% — the family is
on-direction; deductions are three uncommented raw dimension literals
and two `em` affix sizes.

**Queued from the pilot:**
- **92.4 — Amount adoption in under-using screens. SHIPPED 2026-08-21.**
  invoice-list: all 14 rows adopt Amount (muted `$` affix + muted
  fraction, digits stacked — verified by computed affix-vs-value colors,
  dark theme, screenshot). po-app: a `moneyHtml()` helper beside
  `money()` (same text content, so `check:po-app`'s 13 assertions pass
  untouched) adopted at 6 display sites — the PO list column, the
  detail read-only `<dl>`, spend line rows and tone-carrying subtotals,
  the grand total (`--strong` replacing the hand `<strong>`), and the
  dashboard widget. Verified live on both containers; the earlier
  "1 occurrence" scare was `grep -c` counting LINES on single-line
  minified HTML — reconciled to 14 with `grep -o | wc -l` before
  trusting. **Two honest exceptions, recorded not skipped silently:**
  editable-grid's computed totals stay plain text — `initTableSum`
  writes `textContent` and formatting is the consumer's job per
  Amount's own CSS-first contract (the consumer recipe is listening to
  the sum and rendering Amount themselves); and po-app's two prose
  mentions (the approval-dialog sentence, the budget parenthetical)
  stay `bo-u-tabular` — Amount's own opener scopes it to scanned
  columns, not running text.
- **92.5 — the raw-literal alignment items**: comment or tokenize
  money's 9rem cap, quantity's 3rem/12rem floors and raw 1px;
  consider a token step for amount's 0.875em affixes. Accept: DSA
  re-score of the family reaches 100% or each remaining literal
  carries its intrinsic-dimension comment.
- **92.6 — full-surface DSA scoring in batches**, alongside the worth
  rubric's reopened 37.2 (now on /15).

## Slice 91 — Standardize sweep: the conventions Slices 84-90 established, applied site-wide (2026-08-21)

Dispatched by the overdue counter (4/4). The recent grills established
three conventions page by page (Demo one-string, Markup-last, the
affordance/stepper doctrine); this sweep censused the REST of the site
against them.

**Fixed this round:**
- **91.1** — one Markup-last violation site-wide: `byline.astro` had its
  "In context" demo after Markup. Moved. Re-scan across all component
  pages: clean.
- **91.2** — the last steppers outside the Quantity page:
  `field-editor.astro`'s Minimum-order row (an SM30 read-mostly
  correction screen — exactly where the doctrine says steppers don't
  belong). Removed; the seamless input + unit text remain. Re-scan
  across docs + po-app: clean.

**Queued honestly, not silently dropped — 91.3, the Demo-conversion
backlog:** 19 component pages still hand-write demo markup with no
`Demo` import (census: alerts 3, breadcrumb 2, approval-workflow 5,
dialog 4, dashboard 6, dropdown 4, byline 5, inline-editing 4, navbar
2, data-table 14, pagination 3, filters 4, stepper 3, table-toolbar 2,
offcanvas 3, tag-input 4, tree 3, sidebar-nav 3, tabs 4 — ~78 demo
sections). Far too large for one sweep round; conversion continues
opportunistically as pages get touched (the Forms/Combobox precedent),
or as dedicated Continue items if the owner wants it batched. Note:
some sections are deliberate exceptions per the Combobox precedent
(synthetic snapshots must NOT become copyable code) — each conversion
needs that judgment, which is why this isn't a mechanical regex pass.

**Exit:** both fixable axes re-scanned clean; the big axis recorded
with its full census; verified live (byline order, zero steppers
served).

## Slice 90 — /design-grill: the three editing designs (2026-08-21)

Owner ask: grill the editable design across standalone field / data
table / editable table for simplicity and context-fit. Full report:
`.roundtable/design-grill-editing-designs-2026-08-21.md`. Verdict on
the three-way split itself: KEEP — bordered form for entry, seamless +
row Save/Cancel for read-mostly correction, WYSIWYG grid for entry
that must look like the read view; each design's reason is the
affordance rule the design-language page already states. The failures
were execution: **90.1** editable-grid mixed the designs inside single
demos (seamless inputs beside bordered selects — the boxed-USD/naked-
number oddity from the owner's screenshot); every non-WYSIWYG section
is now bordered, WYSIWYG stays fully seamless as its deliberate
variant. **90.2** six stepper buttons in dense entry rows contradicted
Slice 88's own fresh doctrine; removed — qty cells collapse to the
joined ( qty | unit ). **90.3** no chooser existed across the four
pages; "Choosing the editing design" added to /components/
inline-editing (job → design → why, plus the independent save-timing
axis). All verified live including the bordered-vs-seamless computed
split on one page load.

## Slice 89 — Owner screenshot report: two shipped defects in the dirty row-edit row (2026-08-21)

Owner posted a screenshot of the editable-grid "Money & unit cells"
section in a dirty state showing a clipped amount ("1250.") and a bare
dark band under Save/Cancel. Both reproduced live, root-caused, and
fixed in framework CSS — with CHANGELOG entries.

**89.1 — the band: `display: flex` on a `<td>`.**
`.bo-data-table__row-edit-actions` used flex for its badge/button
layout, which destroys table-cell behavior: the base
`height: var(--bo-density-row-height)` became a FIXED height, so when
the Item cell wrapped to two lines the actions cell stopped short of
the row and the container's background showed through beneath it —
invisible on a normal row (both transparent), glaring on the dirty
tint. Measured before fixing: td 40px inside a 59px row, the band probe
hitting bare `TR`. Fixed by returning it to a real table cell:
end-aligned inline flow + `> * + *` sibling margins reproduce the same
layout. Verified after: `display: table-cell`, td fills the row exactly
(80/80), paints the tint, both themes.

**89.2 — the clip: `.bo-money__amount` had a max width but no MIN.**
Under column pressure (the actions cell appearing) the amount input
shrank below its own digits — measured 64px against 79px of content,
rendering "1250.00" as "1250." while the DOM value stayed intact. Money
digits must never truncate: a `min-inline-size: 6rem` floor now forces
the table to widen instead. Verified after: 97px ≥ 96px content,
`clipped: false`, full value visible. The reformat logic itself was
checked and cleared first (USD→JPY→USD round-trips 1250.00 → 1250 →
1250.00 losslessly) — the defect was purely layout. The white sliver in
the owner's screenshot did not reproduce and is consistent with
browser text selection on a focused field; noted, not chased.

## Slice 88 — Owner wishlist: split the table-column demos into value + qualifier columns (2026-08-21)

Owner: the "In a table column" demos on Money and Quantity "don't make
sense — can we split columns for amount and currency instead". The
instinct matches the framework's own family rule: in a line table the
currency/unit is normally FIXED per row, and fixed qualifier → plain
input, no widget — the joined control crammed into one cell was
over-applying the FORM recipe to a table.

**88.1 — both demos rewritten as split columns.** Money: Line item |
Amount (plain `.bo-input--numeric`, `step` server-rendered per that
row's currency — 0.01 for USD, 1 for JPY) | Currency (a `__col--code`
column). Quantity: Item | Qty (just the input — no unit-select, no
steppers; `step`/`inputmode` per the row's unit) | Unit. Captions state
the boundary explicitly: the joined control is the form shape and
belongs in a cell only when the user must change a row's currency/unit
inline; steppers belong on touch screens, not dense line grids.
Verified live: split markers present, ALL old joined-in-cell markup
absent from the served pages, light theme visually + dark theme by
computed tokens (canvas/surface/border-control).

## Slice 87 — /design-grill: the Combobox page (2026-08-21)

Next Data-input member in the owner's walk. Full report:
`.roundtable/design-grill-combobox-2026-08-21.md`. Same shape as the
Forms grill: **87.1** — four hand-written recipe demos converted to
`Demo`, killing two live write-twice duplications (Basic vs the
`markup` const; Form integration vs `formMarkup`, whose widget half now
lives once with only the validation script kept as code). Verified
post-conversion with a REAL interaction: typing "log" opens and filters
the list to one option. **87.2** — Markup moved 6/11 → last with the
page script. **87.3** — the synthetic active-option snapshot kept
hand-written ON PURPOSE (readonly + forced aria-expanded + static
positioning — copyable code would teach a broken recipe), with a source
comment so a future sweep doesn't "fix" it.

## Slice 86 — /design-grill: the Forms page ("Data Input - forms", clarified by "next") (2026-08-21)

The 85.0 wishlist note resolved to its natural reading: grill the Forms
page, the remaining Data-input member after the Money/Quantity/Amount
passes. Full report: `.roundtable/design-grill-forms-2026-08-21.md`.

**86.1 — the page had no `Demo` component at all.** Six hand-written
live demos with ZERO copyable code, plus a separately hand-maintained
canonical-recipe string duplicating the error field — the exact
"never write the preview and code twice" violation the house recipe
warns about, on the page a first-time user most likely reads first.
All six sections converted to `Demo` (one string → preview + code);
the Markup section stays code-only, which IS the house pattern
(checked against quantity/money before assuming). Verified live:
`bo-form-row` occurrences doubled in the served page, error styling
intact on the danger token in both themes.

**86.2 — Markup moved 5/7 → last**, matching every family page.
**86.3 — the mechanism-named first heading** ("error styling is pure
CSS via :has()") retitled "Fields — label, hint, error"; the :has()
fact and the ARIA half now live in a caption (the section previously
had none — the only one on the page without).

Checked and cleared: the Amount recipe (aligned in 77.4), both ApiTable
notes, Related links, the opener.

## Slice 85 — Owner wishlist: joined ( qty | unit ) becomes Quantity's Basic (2026-08-21)

Two wishlist notes, triaged mid-wake:

**85.1 — "Quantity — Without buttons ( qty | unit ) joined → should be
basic, rearrange" — shipped.** The joined form is now the page's Basic
section (and the lead of the Markup sample); the stepper form demoted to
"With stepper buttons — touch & warehouse" as the opt-in affordance.
Opener reworded to match: "a real `type="number"` input, optionally
joined to a unit select and optionally flanked by stepper buttons" —
the buttons no longer define the component, they extend it. This
completes the arc of Slices 80/81: buttons optional → joined form
exists → joined form IS the default story. Verified live: section
order, opener, and Markup-sample ordering all confirmed against the
container.

**85.0 — "Data Input - forms" — AWAITING OWNER CLARIFICATION.** Too
terse to build from; recorded rather than guessed (the 30.0
precedent). Plausible readings: (a) review/grill the Forms page in the
Data input group; (b) something about form composition the owner will
elaborate; (c) a heading for the Quantity note that followed it. If (c),
nothing is owed.

## Slice 84 — wake triage-noticing: Slices 71-81 shipped no CHANGELOG entries (2026-08-21)

Loop re-armed after a pause; first wake found every open item
owner-blocked, both counters fresh — and one real gap noticed, not
manufactured: `git log --since` on `CHANGELOG.md` was EMPTY for the
entire 71-81 stretch, while those slices shipped genuine publishable
surface: two new behaviors (`initStickyCols`, `initContextMenu`), three
new attributes (`data-tone`, `data-tone-text`, `data-sticky-cols`,
`data-context-menu`), a utility (`.bo-u-text-nowrap`), and observable
rendering fixes (quantity's UA-chrome absorption, the hover ring, the
tabular inversion, the joined unit). The next `npm publish` would have
shipped all of it silently — against the project's own policy (every
release is a real version bump with CHANGELOG entries).

**84.1 — eight entries written into Unreleased**, house style, each with
roadmap provenance. Every claim spot-checked against CURRENT source
before landing (a CHANGELOG claim is load-bearing): two anomalies
surfaced and reconciled rather than trusted — a `data-sticky-cols="1"`
grep hit turned out to be the comment explaining that value's removal
(the prose naming a removal is supposed to), and a tabular-figures zero
turned out to be a too-short grep window (the declaration is present at
`quantity.css:41`). The 78.1 entry carries an explicit **visible
change** callout since every existing consumer's quantity inputs gain
the token box they were always meant to have.

**Exit:** Unreleased now covers the full 71-81 surface; nothing ships
silently at the next publish.

## Slice 83 — /design-grill: the "Data input" and "Values" groups (2026-08-21)

Group-level grill after 76.2's taxonomy fix: judge both sidebar groups
as wholes. Full report:
`.roundtable/design-grill-input-values-groups-2026-08-21.md`.

**Census:** all 8 Data-input members are editable controls (anatomy-first
ordering, the Money/Quantity pair adjacent) — keep. Values' Amount and
Key-value facts verified display-only (kv's `input` mentions are
anti-pattern warnings, checked not assumed) — keep.

**83.1 — Date sat undifferentiated as a current peer; it's deprecated.**
`.bo-date` scored 1/12 in the surface review, and its page is an honest
deprecation notice — but the sidebar presented "Date" mid-list as a
current Values member. Fixed with the precedented parenthetical label
style ("Goods receipt (RF scanner)"): now **"Date (deprecated)"**, moved
LAST in the group. Removing the entry was refused — the page-shape gate
requires it, and hiding a deprecation defeats the page's purpose.
Checked the same defect doesn't exist elsewhere: icon.astro's
"Deprecated" is a glyph section inside a live component, not a
deprecated page. Also refused: a date-entry demo in Data input — the
one-sentence answer (native `type="date"`, nothing to add) already has
a home one click away on the annotated entry's own page. Verified live:
label renders, order is Amount → Key-value facts → Date.

## Slice 82 — Owner ask: redundancy review across Amount/Quantity/Money docs (2026-08-20)

Six slices of rapid additions to these three pages (76-81) made
accretion the expected failure mode — the same fact layered into a
caption, a section, a note, and a code comment by different edits. All
three pages read in full; every repeated fact judged deliberate-parallel
vs. accidental-accretion. Full report:
`.roundtable/docs-review-numeric-redundancy-2026-08-20.md`.

**Kept as deliberate parallels:** the family-rule paragraph ×3
(byte-identical by design), the affordance clause ×2 (same-purpose
crossover sections on sibling pages), the "no allowlist" affix notes
(each about its own component's part).

**Cut — four accretions, ~23 lines, zero facts lost:**
- **82.1** — the currency-decimals table existed TWICE: Money's complete
  reference (tied to shipped `currencyDecimals`) and a mini-table Amount
  had grown in its Precision section — with a *different* external
  authority link (Wikipedia vs. iso.org). Cut Amount's table+link; the
  "precision is app data" point stays, now linking Money's reference as
  the single home.
- **82.2** — "the read-only counterpart is Amount" was told FOUR times on
  the Money page (opener, the 76.1 section, ApiTable note #3, a trailing
  comment inside the Markup sample). The section is canonical; the note
  and sample comment — both predating the section — cut. Opener's
  one-line lede stays.
- **82.3** — the optional-buttons story was told three overlapping times
  on Quantity (Basic caption, joined caption, ApiTable note).
  Consolidated: joined section canonical; Basic caption shrunk to the JS
  requirement + a one-line pointer; note tightened to spec facts.

**Checked and cleared, not cut:** "no `--decimals`" on both Amount and
Quantity (different surfaces — display formatting vs. input `step`);
precision-follows-select's three one-clause cross-refs on Quantity (each
load-bearing where it sits); Money's JS-optional note's plain-input
sentence (unique po-app evidence).

**Exit:** ApiTable notes 154 → 153, all gates green, every cut verified
absent (and every canonical home verified present) against the live
container.

## Slice 81 — Owner ask: Quantity basic as ( qty | unit ), joined like Money (2026-08-20)

Follow-on from the Slice 80 grill: with the steppers now optional, the
owner asked for Quantity's basic form to render as ( qty | unit ) — the
Money field's joined shape, mirrored. Before this, the joined look
didn't exist on Quantity at all: the unit-select sat a `space-2` gap
away from the input, while Money butt-joints its two controls.

**81.1 — the joint, shipped.** Two CSS rules, scoped to the button-less
case (`:not(:has(.bo-quantity__step))`): the input drops its end radii
and end border, the select drops its start radii and gap — same joint
convention as `money.css` (the second element keeps its full border to
carry the shared edge, so focus rings stay per-element and uncut). With
steppers present the `+` button sits between input and select, so the
gap deliberately stays; the static text `__unit` span is deliberately
never boxed — it's an annotation, not a control, and boxing it would
invent an input-group addon for no gain. New "Without buttons —
( qty | unit ), joined" demo right after Basic.

Live-verified, both themes (computed, not just screenshots): input
6px/0px radii with a 0-width end border, select 0px/6px with zero
margin — the exact mirror of Money's measurements; precision still
follows the select (kg → each flipped `step` 0.01 → 1 with the value
kept losslessly); the buttons-present composition still shows its 8px
gap. One `stamp-readme` size-drift catch on the way (76 kB min now).

**Exit:** the editable pair now shares one joined-control idiom in both
directions — ( currency | amount ) and ( qty | unit ).

## Slice 80 — /design-grill: Quantity's +/− buttons — optional after all (2026-08-20)

Owner questions: why aren't the buttons optional (they feel wrong on
desktop, fine on tablet), and should the Money field get steppers too.
Full report: `.roundtable/design-grill-quantity-buttons-2026-08-20.md`.

**80.1 — the buttons were always optional in markup; the CSS punished
omitting them.** They're separate elements, the behavior tolerates their
absence, and the input steps natively — but `.bo-quantity__input`'s
unconditional `border-radius: 0` (the butt-joint treatment for sitting
between buttons) left a button-less composition with square corners,
verified live by injection. Fixed keyed off reality:
`.bo-quantity:not(:has(.bo-quantity__step)) .bo-quantity__input`
restores `--bo-radius-md` and zeroes the −1px overlap margins — the
absence of the buttons IS the setting, no new modifier (principle 2).
Verified live post-fix: 6px radii, margin 0, both themes (dark
confirmed via body's computed canvas token).

**80.2 — the real desktop complaint was tab stops.** Measured live: 3
tab stops per field (minus → input → plus); a ten-row grid cost 30 tabs
instead of 10 — while <kbd>↑</kbd>/<kbd>↓</kbd> on the native input
already steps with zero JS, making the buttons pure keyboard
redundancy. Fixed: `tabindex="-1"` on all 32 step buttons across the
quantity page (22), editable-grid (6), field-editor (2), and the
behavior's markup-contract comment (2). Keyboard equivalence is native,
buttons stay clickable/touchable. Verified live: exactly 1 tab stop per
field. Documented in the Basic caption and a new ApiTable note: buttons
are the pointer/touch affordance; omit them for desktop-first forms;
the unit-select and precision table still work without them.

**80.3 — steppers for Money: refused.** Amounts are typed, not nudged —
there is no ERP "one more cent" action the way there is a "one more
unit" action on a count; a Money stepper would be zero-scenario surface
and a second way to change a value typing already changes (principle
2's refuse test). Slice 79 drew the same boundary from the JS side. If
a tick-stepped price ever genuinely appears, `.bo-quantity` with a
currency in the label already composes it — the mechanism needs no
second home.

**Exit:** both fixes shipped and live-verified (injection-tested for
the CSS, counted for the tab stops, both themes); one refusal recorded;
core + docs builds green.

## Slice 79 — /design-grill: Quantity & Money — do they need JS? (2026-08-20)

Owner-requested architecture grill: justify the two behaviors'
JS against no-JS, server-side (htmx), and external-package alternatives.
Full report: `.roundtable/design-grill-quantity-money-js-2026-08-20.md`.

**Verdicts:** Quantity's stepping stays client-side (native input works
JS-free — typing/arrows/validation; the buttons are the touch/warehouse
affordance, and a server round-trip per +1 click is indefensible
latency); boundary-disable sync stays (not expressible in CSS,
progressive enhancement over native clamping); Money's precision JS
stays as the default (the `step` attribute is presentation state,
zero-latency, works on static pages; the ISO table is the already-
settled Slice 18 named exception — cited, not re-litigated); moving the
behaviors to an external package is **refused** — they are already
per-file tree-shakable opt-ins (2.4k/2.4k–5.0k unminified), and po-app
is the live proof of optionality: it imports NEITHER behavior, capturing
every amount as a plain fixed-currency `.bo-input--numeric`, exactly
what the family decision tree prescribes.

**79.1 — the gap the question exposed: Money's page never answered it.**
Quantity documents its no-JS story ("without it the buttons are inert,
but the input itself still works"); Money had no equivalent. Added one
ApiTable note stating all three tiers: JS optional; htmx apps can skip
`initMoneyField()` and re-render the input with the new `step` on
currency change (`hx-get` on the select) — same outcome, server-owned;
single-currency forms need neither. Verified rendering live.

**79.2 — a rendered ApiTable note claimed `.bo-quantity--display`
exists.** The page's own "Read-only display" section says that modifier
was removed before it reached a release (grill 2026-08-19) — yet the
ApiTable's last note still described it as "the read-only form", and a
dead `display` const carried markup for the nonexistent class. Neither
gate could catch it: `check-markup` verifies rendered markup (the const
never rendered) and the notes gate checks that notes render as prose,
not that their claims are true. Both deleted; verified live that the
only surviving `--display` mention is the section's legitimate "there
is no..." explanation (per the removal-verification doctrine: the prose
explaining a removal is supposed to name it).

**79.3 — one stale "Money field" Related label** on the quantity page,
the 78.2 rename's follow-through. Now "Money".

**Exit:** architecture verdicts recorded (3 keep, 1 refuse), the
documentation gap the owner's question exposed is closed, one shipped
false claim removed; docs build green, all fixes verified against the
live container.

## Slice 78 — /design-grill: the numeric family's DOCS — and a shipped UA-chrome defect (2026-08-20)

Owner-requested angles: demo arrangement (simple → complex), sidebar
naming ("Money field" vs bare "Quantity"), and "look & feel of display
and input also different." The third angle surfaced the biggest real
find of all three family grills. Full report:
`.roundtable/design-grill-numeric-docs-2026-08-20.md`. All four
findings fixed in the same pass and live-verified.

**78.1 — `.bo-quantity__input` was shipping on UA-default browser
chrome.** Nothing in the framework drew its box: `quantity.css` gives it
flex/alignment only, the reset gives inputs only `font`/`color`. Measured
live against Money's amount at the same theme and density: `2px inset`
UA border vs. the token `1px solid`, Chrome's own `rgb(59,59,59)` dark
background vs. `--bo-color-bg-surface`, `2px` UA padding vs. `12px` —
height matched only by accident of flex-stretch. Census showed 15 call
sites across docs + po-app in THREE drifted class compositions,
including 3 "seamless" quantity cells whose `--bo-input-border:
transparent` custom property had no consumer, leaving the UA inset
visible on supposedly-borderless cells. **Fixed by absorption, not a
markup demand:** `input.css`'s base + `::placeholder`/`:disabled`/
`[aria-invalid]` selectors now include `.bo-quantity__input` — one CSS
change repairs all 15 call sites and all three compositions as-is, no
Breaking markup-contract change. `quantity.css`'s later overrides
(radius 0, centering, −1px overlap) win by source order — verified
live in both themes, including the previously-broken base-less seamless
cells on `/patterns/editable-grid` now rendering the proper transparent
seamless contract.

**78.2 — sidebar "Money field" → "Money"** (label + H1 + title). The
"field" suffix carried no consistent meaning — Quantity is equally a
field without it, and inside a group named "Data input" the suffix is
redundant with the group. Prose references to "the Money field"
elsewhere stay as natural descriptive text.

**78.3 — Amount's crossover section moved 9th → 4th.** Each family page
has a "when you want the sibling" section; Money had it 2nd, Quantity
3rd, Amount buried it 9th of 12. Now right after Amount's three basic
money-display demos, matching the convention on the other two pages.

**78.4 — the display-vs-input visual split stated as intentional.** One
clause added to both crossover captions: a bordered box says "you can
type here," plain text says "this is a fact" — the two are meant to look
unrelated. **Refused:** a paired display+input showcase demo per page —
the clause plus existing demos carry it; that would be addition where a
sentence suffices.

**Exit:** all four fixed and live-verified (both themes for the CSS
fix, computed styles not screenshots); core + docs builds green.

## Slice 77 — /design-grill: the numeric family, incl. "Number" (2026-08-20)

Requested as `/design-grill flow: Amount vs. Quantity vs. Money vs.
Number` — the Slice 76 consistency treatment extended to the fourth
member the request names. **"Number" is not a component**: it is
`.bo-input--numeric` (`form/input.css:83`), and that fact is the thread
every finding hangs off. Full report:
`.roundtable/design-grill-numeric-family-2026-08-20.md`. All four
surfaces measured live (computed styles, both themes), not read from
source alone. All four findings fixed in the same pass — each was small
and unambiguous.

**77.1 — Quantity's input had the family's one real rendering defect.**
`.bo-quantity__input` was the only numeric surface rendering
proportional figures — the `tabular-nums` declaration sat on
`.bo-quantity__step` instead: the +/− buttons, which display no digits.
Confirmed live before fixing (computed `normal` on the input,
`tabular-nums` on the button — exactly inverted) and after (now
inverted back to intent; the dead `__step` copy removed per
subtraction). `text-align: center` examined and KEPT — the one
deliberate alignment divergence in the family; the value sits between
its −/+ operators. Comment added in `quantity.css` recording both
decisions.

**77.2 — `amount.astro`'s editable-money section was stale, contradicting
its own page.** Written 2026-08-14 (`01a6bad`), two days before
`.bo-money` shipped (`d8b81d8`), never reconciled: the page's opener said
"capturing is Money's job" while the section presented a plain input as
THE answer for editable money, never mentioning `.bo-money`. Reworded to
state both branches — currency selectable → `.bo-money`; currency fixed
→ plain `.bo-input--numeric` with the currency in the label — with the
Money field linked. The demo itself was already the correct fixed-
currency case and stays.

**77.3 — the family rule named three members; four exist.** The shared
"rule for this family" paragraph (byte-identical across all three pages,
verified by md5 before and after) named one display + two entry
components while the docs themselves use a third entry path in four
places (`form`, `amount`, `tabs`, `inline-editing`). Extended by one
sentence naming plain `.bo-input--numeric` as the entry path when the
value is neither a selectable currency nor a steppable count — still
byte-identical on all three pages after the edit.

**77.4 — `form.astro`'s Amount field taught a third, divergent recipe.**
Type-less input, formatted value `4,208.00`, no currency in the label —
different from the family pages' own recipe. Aligned: `Amount (USD)`,
`type="number"`, `step="0.01"`, unformatted value.

**Refused: a `.bo-number` component.** Nothing to build —
`.bo-input--numeric` already is the fourth member; naming it in the docs
closed the gap for free (principle 2: no second way to do something that
already works).

**Exit:** all four findings fixed and live-verified (fix 1's computed
styles re-checked in dark theme with the theme confirmed via `body`'s
computed background, not assumed from the toggle); core + docs builds
green; one refusal recorded.

## Slice 76 — /design-grill: Amount vs. Quantity consistency (2026-08-20)

Requested as `/design-grill flow:Amount Quantity` — clarified with the
user first, since neither name is a journey step; this grills consistency
between two components, not a flow's handoffs (flow mode as shipped in
75.2 doesn't fit every two-name request). Full report:
`.roundtable/design-grill-amount-quantity-consistency-2026-08-20.md`.

**Corrected the pairing before grilling it:** `.bo-amount` is read-only
display, `.bo-quantity` is an editable input — not structural siblings.
The real editable pair is Money/Quantity, with Amount as the shared
read-only display both hand off to. Already documented correctly (all
three pages carry an identical cross-linking paragraph) — not a finding,
a clarification.

**Kept, verified rather than assumed:** the decimal-precision plumbing
(`setInputDecimals`/`decimalsOverride`) is genuinely shared between Money
and Quantity — the "decimal-input util" merge Objective principle 2
already cites. Quantity's stepper buttons (Money has none) are a
domain-justified difference, not neglect — verified live that boundary
disabling is real (`element.disabled`, not a screenshot): `min=0` truly
disables `−`, `max=10` truly disables `+`.

**Item 76.1 — Money field's docs are measurably thinner than
Quantity's.** 5 sections vs. Quantity's 11; three gaps read as genuinely
missing rather than domain-justified: no "Read-only display — use
Amount" section (Quantity has this exact section; Money's shared family
paragraph makes the same claim but never demonstrates it), no "in a
table column" demo (a common ERP shape for money — line items — that
Quantity already demos), no large-target/density-variant demo (despite
`money.css` sizing with density like every other control, same as
`quantity.css` states explicitly). **Accept:** `money.astro` gains the
same three sections, matching Quantity's coverage; page-shape and
`data-hooks` gates stay green; live-verified both themes.

**Shipped 2026-08-20.** All three sections added to `money.astro`, same
order as `quantity.astro`'s own (Read-only display right after Basic;
In a table column and Large-target variant before Markup). "In a table
column" demonstrates the actual point that motivated the finding —
independent per-row currency (a USD line and a JPY line each reformat
to their own precision, never shared table-wide state). Docs build
green (`data-hooks` 56 documented unchanged, `check-markup` 52486 uses
verified, up from 52457); live-verified in a `--no-cache` Podman
rebuild, both themes — the read-only Amount cross-reference, the
table-column demo, and the spacious-density variant all render
correctly and match Quantity's equivalent sections' shape.

**Item 76.2 — sidebar taxonomy splits the editable pair across two
groups, contradicting the family's own stated rule.** Quantity (editable)
sits in "Values" next to read-only Amount/Date/Key-value-facts; Money
(equally editable) sits in "Data input" next to Forms/Combobox/Tag-input.
Two genuinely defensible fixes, not a typo: **(a)** move Quantity into
"Data input" next to Money (groups by editability — matches how a
consumer actually searches, "let someone type X"), or **(b)** move Money
into "Values" next to Amount/Quantity (groups by domain family, matching
the shared cross-link paragraph). Leaning (a) — "Data input" is the
stronger existing group and the family relationship is already fully
cross-linked in prose regardless of sidebar placement — but this is an
owner call, not built in this grill.

**Shipped 2026-08-20 — owner picked (a).** Moved Quantity from "Values"
into "Data input", right after Money field
(`apps/docs/src/layouts/Gallery.astro`). "Values" drops to 3 items
(Amount, Date, Key-value facts) — still coherent, within the file's own
stated 3-10 items/group range, no forced merge needed. Group counts are
computed from array length via `SidebarNav.astro`, not hand-typed, so
no separate count update was needed or risked going stale. Docs build
green; live-verified in a `--no-cache` Podman rebuild, both themes —
confirmed "Data input" now shows 8 with Quantity positioned right after
Money, and "Values" genuinely shows only 3 (expanded and read, not just
trusted the badge number).

**Exit:** 76.1 and 76.2 both shipped; the sidebar now groups the
editable pair together, matching how a consumer actually searches for
"let someone type X."

## Slice 75 — Owner ask: apply the full Jony Ive design document (2026-08-20)

Triaged from chat: owner shared a fuller written version of the Ive
principles than what installed as Slice 57/58 and asked how to apply it.
Checked first, before building anything — most of the document was
**already installed**: §4's payroll example, the what-is-this/what-
should-I-look-at/what-should-I-do hierarchy, the `Processing Status: 04`
refusal, and the full ten-question filter (`/design-grill`, already run
across all 19 pattern screens) all predate this ask. Mapped the document
against what exists and found three genuine gaps, all three closed this
wake — not a new skill, since one already existed and covers most of the
ground.

**75.1 — the journey principle, folded into `ROADMAP.md` Objective §4.**
The document's §4 ("design the whole experience, not individual
screens") wasn't captured: the existing Ive principle judged one screen's
decision, not a decision's place in Request → Validation → Exception →
Resolution → Approval → Execution → Confirmation. Added Accept/Refuse/
Rethink tests for the journey shape directly to §4 rather than creating
a fifth principle — a screen's decision was already required to exist;
this adds that its exits must land the user at the next one with context
intact. Precedent cited: po-app's edit → 302 → record-with-new-values,
and the mass-change 422 that re-renders in place instead of losing the
user's selection.

**75.2 — flow mode added to `/design-grill`.** New trigger form,
`/design-grill flow:<a> > <b> > <c>`, grills a JOURNEY instead of a
screen — per-handoff measured inputs (context survival, entry honesty,
exit clarity, failure return path, focus across the seam) and seven flow
questions (F1-F7) replacing the ten where they don't apply. Verdicts are
per-seam (keep / fix-handoff / merge-steps / split-journey), same
evidence discipline as the existing per-element verdicts. Not yet run
against a real journey — that's a future Objective/Continue dispatch,
this wake only shipped the capability.

**75.3 — new docs page, `/concepts/design-language`.** The document's §9
table (hierarchy/typography/colour/spacing/interaction/content) existed
only as enforced behavior scattered across many files, never as a single
consumer-facing statement of philosophy — the gap between "internal
discipline" and the "more than a Tailwind alternative" positioning the
owner's document closes with. New page states the six rules with a link
from each to where the framework actually enforces it (contrast gates,
the accessibility model, `data-row-edit`, concurrency handling), plus the
subtraction method and the ten-question filter, in the docs' own voice.
Sidebar entry added first in Core Concepts. Full docs build green
including the `DOCS_BASE` base-path build (new internal links checked
against the Pages-deployed path, not just the base-less local one — the
CLAUDE.md-documented trap). Live-verified in a `--no-cache` Podman
rebuild, both themes.

**Exit:** all three gaps closed; the full Ive document is now either
already-enforced (most of it) or captured in `ROADMAP.md`/the skill/the
docs (the three genuine additions). No new skill created — `/design-grill`
already existed and only needed the flow-mode extension.

## Slice 74 — Standardize sweep: sticky-cols' redundant "1" case (2026-08-20)

Dispatched by the counter (5/4 Continue rounds since the last Standardize
sweep — overdue). Scanned the data-table CSS/JS/docs added across Slices
71-73 for divergence: inline styles (found none new — the one inline
`style` this session's demos added matches this file's own pre-existing
pattern for one-off demo widths, not drift), hardcoded color values
(none — `git diff` over every CSS change confirmed every color is a
token), duplicated business logic (none), and the "which N gets which
attribute value" family of new selectors (`data-sticky-cols`,
`data-tone`, `data-context-menu`) for overlap with each other or with
existing mechanisms.

**Found one real instance:** `data-sticky-cols="1"` (Slice 72.1) and the
pre-existing `.bo-data-table--sticky-col` modifier class do the exact
same thing for the one-frozen-column case — two ways to reach an
identical result, the shape principle 2 explicitly refuses. Checked
before removing: `data-sticky-cols="1"` had zero references anywhere in
docs, examples, or prose — dead, redundant surface since the moment it
shipped, not something anyone was relying on.

**Consolidated**: removed the `"1"` case from all three CSS selector
groups (position/z-index, header z-index — the `inset-inline-start: 0`
rule stays attribute-value-agnostic since it's harmless without
`position: sticky` alongside it), updated `initStickyCols()`'s doc
comment and the docs page's `ApiTable` note to say `data-sticky-cols=
"2|3"` and point at `--sticky-col` for the single-column case explicitly.
Full core + docs build green after the change (no gate needed updating —
this was a pure CSS-selector consolidation, not a new pattern).

**Round check**: re-scanned for the same drift shape elsewhere
(`data-tone`, `data-context-menu`) — clean, no other instance found.
Regression-verified live in a `--no-cache` Podman rebuild: the
`data-sticky-cols="2"` demo still measures correctly post-change
(`position: sticky` on columns 1-2 via `getComputedStyle`, column 3
`static`, column 2's `insetInlineStart` still the measured `52px` from
`initStickyCols()` — checked on `<td>`, not `<th>`, since header cells
are ALSO `position: sticky` from the unrelated sticky-header-row rule
and would have given a false pass).

**Exit:** clean re-scan, nothing left to consolidate.

## Slice 73 — Owner ask: grill a right-click column-header context menu (2026-08-20)

Triaged from chat: "selectable columns, right-click for action (sorting,
filtering, hide column, set sticky column, etc) — what should be in this
framework, or should be server side." Not a build ask on its own — graded
against Objective principles 1-3 first, per-action rather than as one
bundled feature, since "a right-click menu" bundles four things with four
different answers.

**Accept — the menu chrome itself.** Positioning, focus, `role="menu"`,
arrow-key nav, Escape/outside-click dismiss is exactly the kind of hard
problem this framework already solves for the toolbar's Columns picker
(`.bo-dropdown__menu` + `popover`). A right-click menu is the SAME
primitive, triggered by `contextmenu` instead of `click`, positioned at
the cursor — "one general mechanism, a new trigger event," not a new
component (principle 2 Accept shape). The menu's items call sort/hide/
sticky toggles that already exist; no new framework logic, only wiring.

**Refuse — filter logic in the framework.** Per-column filtering (which
operators, what UI per data type, client vs. server query) is workflow/
domain logic — principle 3's refuse test exactly ("framework does
visuals, you do the data"), the same reasoning `data-tone`'s condition
logic already follows. The framework's job stops at giving the header a
place to put a filter trigger; the filter form is the consumer's.

**Rethink — "set sticky" as framework-owned RUNTIME state.** Different in
kind from sort/hide, not degree: which columns are frozen, for which
user, persisted how, is exactly the state-ownership `DESIGN.md` already
refused when it refused a full interactive grid. `data-sticky-cols`
(Slice 72.1) stays a declarative attribute the server or a line of
consumer JS sets — a "Freeze this column" menu item is legitimate as
consumer JS toggling that attribute, not new framework state.

**Item 73.1 — build the menu chrome, wired to sort/hide (the two
mechanisms that don't need a Rethink).** `data-context-menu` on
`.bo-data-table th`, reusing the existing popover/dropdown primitive,
opened on `contextmenu` at cursor position instead of the trigger
button's position. Items: Sort ascending/descending (calls the existing
`aria-sort` toggle contract), Hide column (calls the existing
`data-col-toggle` mechanism). No filter item (refused above); "Freeze
this column" documented as a wiring example, not shipped as a menu item
by default (the state-ownership question stays the consumer's).
**Accept:** new behavior (`initColumnMenu()` or folded into
`initDropdowns()` if the popover primitive already generalizes far
enough — check before adding a new export), menu keyboard-navigable and
dismissible, right-clicking a header doesn't ALSO trigger the browser's
native context menu, works with `initDataTables()`/`initTableToolbar()`
already on the page without double-triggering. Live-verified 1440 + 390,
light + dark, in the bind-mounted Podman container. `check:contrast` and
`check:rtl` (menu positioning) unaffected or explicitly re-verified.

**73.1 shipped 2026-08-20.** New behavior `initContextMenu()` (24th) —
checked first whether `initDropdowns()` already generalized far enough
(it doesn't: its `position()` anchors to a `[popovertarget]` invoker's
rect, and a right-click has no such invoker). New file, ~30 lines: one
`contextmenu` listener, `preventDefault()`, `showPopover()`, position at
`e.clientX/Y` clamped to viewport — reuses `.bo-dropdown__menu` CSS
unchanged (zero new CSS) and `initDropdowns()`'s existing item-click-to-
close (keyed off DOM structure, works regardless of how the menu opened).
New "Right-click column menu" demo, wired to real `data-col-toggle` (not
a mock) plus static Sort items (same "your code" contract the page's own
sort button already carries).

**A real bug caught live, not trusted from the markup**: the demo's
first version placed the `.bo-dropdown__menu` divs as siblings AFTER the
closing `</table>` and `.bo-data-table-container` div — the natural place
to author them. Right-clicking opened the menu fine, but unchecking "Show
column" did nothing: `data-col-toggle`'s `applyColToggle()` looks up its
container via `checkbox.closest('.bo-data-table-container')`, which
returns null when the checkbox isn't a DESCENDANT of that container —
confirmed via `getComputedStyle`/DOM inspection, not assumed from a
clean-looking demo. Fixed by nesting the menu divs inside the container,
re-verified live: `cellsHidden` flips `[true, true]`, column genuinely
disappears. Documented the trap in the page's own prose so a real
consumer doesn't repeat it. A second false-negative hit during
verification itself — a backgrounded Podman rebuild raced a "container is
running" poll that checked the OLD container before `podman rm -f` had
run; re-verified only once the actual rebuild task's completion
notification landed.

Live-verified 1440px, light + dark, in a `--no-cache` Podman rebuild:
context menu opens at the cursor (not a fixed corner), native browser
context menu suppressed, "Show column" genuinely hides/restores the
column, both themes checked independently (not just toggled via JS —
learned from Slice 72's stale-screenshot artifact to navigate fresh
between theme checks). 390px not independently re-verified (same
browser-resize tool limitation as Slices 70.1/72); low risk, no new
media query. `check:contrast`/`check:rtl` unaffected (zero new CSS).

**73.2 — hover ring, a bug found by the owner asking a question, not by
this page's own review.** Chat asked whether a striped or toned row's
hover state would even be visible. Checked rather than guessed:
`getComputedStyle` before/after a real hover confirmed `--bo-color-bg-
hover` and `--bo-color-bg-muted` are the IDENTICAL token in both themes
(`packages/core/src/css/tokens/color.css:18,108`, deliberately — the
comment there explains hover needs to be opaque, same as muted) — so a
striped even row's hover produces a verified ZERO change in fill. A
`data-tone` cell has the same symptom for a different cause: its own
`--bo-cell-bg` always wins over the row's, by design (Slice 71.1).

Offered two fixes with different blast radius — a token-level change
(fixes every surface using both tokens, but 35+ contrast pairs ride on
`--bo-color-bg-hover`) or a table-scoped one. **Owner chose table-scoped.**
Shipped: `tr:hover { outline: ... solid var(--bo-color-border-strong);
outline-offset: -1px; }` — `outline`, not `box-shadow`, specifically so
it composes with the state/tone accent bars (which already own
`box-shadow`) instead of overriding them; row-scoped so it draws one
rectangle around the hovered row rather than per-cell borders. Verified
live: `outline` goes from `none` to `1px solid` on genuine `:hover`
(`element.matches(':hover')` checked, not assumed), confirmed visually in
a screenshot, both themes. No token touched, `check:contrast` unaffected.
`--bo-color-bg-hover`/`-muted`'s shared-token design stays as documented
— logged as the underlying cause for a future wake if the owner ever
wants the systemic fix instead.

**73.3 — plain nowrap utility, shipped 2026-08-20.** Owner asked for
"text-wrap or nowrap by column or by table." Checked first: wrapping is
already the free default (`white-space: normal`, no class needed); the
only existing nowrap-shaped utility is `.bo-u-text-truncate`, which
ALSO clips + ellipsizes — not a plain "stay on one line, let the table
grow" option. Shipped `.bo-u-text-nowrap { white-space: nowrap; }` — one
declaration. Because `white-space` is an inherited property, the SAME
class answers both halves of the ask for free: on one `<td>`/`<th>` it's
column-scoped, on the `<table>` itself every cell inherits it — no
separate "by column" vs "by table" mechanism needed, confirmed by
placing it on the `<table>` in the demo and checking `getComputedStyle`
on a body cell. New demo on `/components/data-table` right after the
truncate example. Live-verified (dark theme; `scrollWidth === clientWidth`
confirmed the cell genuinely grew rather than silently clipping).

**73.4 — resizable columns, grilled, not built.** Owner asked, then
clarified: opt-in (on/off), matching how every other advanced behavior
here works (`data-grid-nav`, `data-row-edit`). Graded against what this
framework has already refused: `DESIGN.md` refuses "a grid engine of our
own — virtual scroll, column virtualisation, cell editing," reasoning
that owning it "would double" the framework's complexity, and redirects
genuinely spreadsheet-like screens to a documented AG Grid recipe.
Resizing isn't literally on that refused list, but shares its shape
(drag-driven, stateful) and collides directly with the deliberate
auto-width default (72.3) — a resized column has to stop auto-sizing to
content, for that one column only, which needs a mechanism to hold.

Not refused, not accepted — **needs owner scoping before Accept
criteria can be written**, same treatment 30.4b already got:
1. **Persistence** — session-only (simplest, lost on reload) or does a
   resize need to survive a reload? If it does, WHERE it lives (cookie,
   localStorage, server round-trip) is a framework-vs-consumer boundary
   question, not a CSS one.
2. **Keyboard equivalent** — drag-to-resize is mouse-only by
   construction; WCAG needs an operable alternative, the same reason
   `initDataGrid()` exists as a separate opt-in over the plain table.

Recommendation given: likely build-worthy once scoped (a bounded,
well-precedented pattern, not the refused "grid engine" itself) — but
not speculatively, pending an answer to question 1 specifically.

**Exit:** 73.1, 73.2, 73.3 shipped and verified; 73.4 grilled and queued
pending owner scoping (question 1); the filter-logic refusal and
sticky-as-runtime-state rethink from the original grill stand unbuilt,
as scoped.

## Slice 72 — Owner wishlist: multi-sticky columns, tone text, width/font (2026-08-20)

Triaged from chat, five asks against `/components/data-table`:

**72.1 — Multiple frozen columns.** `--sticky-col` only ever froze the
first column (its offset is always 0, no measurement needed). Freezing 2
or 3 needs each earlier column's actual rendered width — `table-layout`
is auto by default, so nothing knows that in advance. Shipped
`data-sticky-cols="1|2|3"` + `initStickyCols()` (new behavior, 23rd):
measures the header row, writes `--bo-sticky-w-1`/`-w-2` on the
`<table>`, CSS positions columns 2/3 via `calc()`, a `ResizeObserver`
keeps it live across container-query breakpoints and column-visibility
toggles. Capped at 3 — freezing more is a column-chooser problem, not a
reason to keep growing this selector list. New "Multiple frozen columns"
demo (reuses the existing 50-column fixture). `--sticky-col` untouched —
one frozen column stays the zero-JS answer.

**72.2 — `data-tone` text color.** Opt-in via `data-tone-text` alongside
`data-tone`, not automatic — forcing text color on every toned cell would
fight a value that's already bold or already colored by something else.
Uses the exact `-text`/`-subtle` token pairs already gated in
`check-contrast`'s `PAIRS` (badge/alert use the same pairs) — zero new
contrast surface, `check:contrast` passed unmodified.

**72.3 — Auto column width + ellipsis.** Answered mostly by reading the
code, not building: `table-layout` is never set to `fixed`, so the
browser's own column-sizing already does "fit the contents" for free.
The ellipsis half (`.bo-u-text-truncate`) already shipped and is already
dogfooded in po-app's Vendor column. New "Column width & long content"
doc section written to explain the pairing — and the FIRST draft of that
section was wrong: `max-inline-size` directly on the `<td>` is silently
ignored under `table-layout: auto` unless the row is already under width
pressure, a documented trap in this project's own `CLAUDE.md`
("max-inline-size on a table cell — table layout ignores it"). Caught by
screenshotting the demo and actually reading it, not by trusting the
markup — the Vendor cell rendered at full width despite the cap. Fixed by
moving the cap to an inner `<span>` (the standard, pressure-independent
pattern); re-verified live and it now genuinely clips to "Stark
Components Inte…". Noted honestly in the docs prose: po-app's own Vendor
column uses the weaker (table-pressure-dependent) form — tracked as a
follow-up, not silently fixed in the same pass.

**72.4 — Font styling (bold/normal) utility — refused.** A subtotal/
grand-total row already uses a real `<strong>` (see "Grouped rows +
subtotals"), which is simpler and gives a screen reader real semantics a
utility class wouldn't. A `bo-u-font-bold`-style class would be a second
way to do something native HTML already does — refused per principle 1
(this framework ships "semantic components, not utility soup") and
principle 2 (no second way to do something that already works).
Documented the refusal and the reasoning directly on the page rather than
just declining silently.

Full core build green after each change (`check:contrast`,
`check:composited`, `check:rtl`, `check:motion`, `check:package`,
`check:rf-floor`, `stamp-readme.mjs`). Docs gates green (`data-hooks`
55 documented, up from 52; `check-markup` 51594 uses verified). Verified
live in a `--no-cache` Podman rebuild of `bo-docs-run`: multi-sticky
columns hold through a horizontal scroll (confirmed both columns stay
fixed and opaque while the rest scrolls under, both themes); the ellipsis
fix confirmed genuinely clipping post-fix, both themes. One real
browser-tool artifact hit and caught during this verification: a
JS-toggled `data-theme` attribute produced a stale screenshot that still
showed dark after switching to light — computed `background-color`
proved the page WAS light; a fresh navigation instead of a JS toggle
produced a correct screenshot. Not a framework bug — a tooling quirk,
confirmed by an independent check before being ruled out.

**Exit:** 72.1-72.4 shipped/documented/refused as above. **72.5 — po-app's
Vendor-column truncation upgrade, closed 2026-08-20.** Dispatched as this
wake's Continue item (no P0, no counter due, no queued item with Accept
criteria — but a real, already-self-tracked follow-up beats manufacturing
a new Explore search). Both occurrences (`/pos` list, `/spend`) moved the
`max-inline-size` cap from the bare `<td>` onto an inner `<span>`, matching
the docs page's own corrected recipe — the `/pos` row keeps `data-col=
"vendor"` on the `<td>` itself (required for `initTableToolbar()`'s hide
toggle, which sets `hidden` on the element carrying that attribute, not
on the header). `check:po-app` 13/13 unchanged; live-verified in a
`--no-cache` Podman rebuild — `getComputedStyle` confirmed the span's
`white-space`/`max-inline-size`, and the column-hide checkbox still
correctly hides the `<td>` (not just the inner span) post-change.
Initial verification only covered `/pos` in light theme; a second pass
closed the gap explicitly — `/spend` checked too, and dark theme
confirmed by `body`'s computed `background-color` (`rgb(15,17,21)`,
the dark canvas token) rather than a JS-toggled screenshot alone, since
`data-theme` doesn't persist across a po-app navigation the way it does
on the docs site. All four combinations (`/pos`/`/spend` × light/dark)
verified.

## Slice 71 — Owner ask: server-controlled conditional cell tone (2026-08-20)

Triaged from chat: owner asked to advance "30.0" naming selective editable
cells, coloring, per-type data format, amount + currency column, total and
subtotal. Checked against `ROADMAP.md` before scoping — **four of the five
were already shipped**, and the real `30.0` (Slice 30, `ROADMAP.md:4116`) is
a different, still-open item (docs overview/sidebar ambiguity), unrelated to
tables; `RESUME.md` had been carrying a stale description of it (fixed in
this commit).

**Already shipped, confirmed by reading the code, not assumed:**
- Selective editable cell (mixed types per row) — "Advanced editable table"
  (2026-08-16): text/select/date/checkbox/tag-input via `data-row-edit`.
- Data format per column — same item: money (currency+precision), quantity
  stepper, native date, all typed per field.
- Amount + currency column — money component composes currency + amount as
  real separate fields.
- Total + subtotal — `/components/data-table` "Grouped rows + subtotals":
  per-group subtotal rows and a grand-total row, proven live in po-app's
  "Spend by cost center" screen.

**Genuinely new:** value-conditional cell coloring. Asked to scope it
(`AskUserQuestion`) — owner wants it **server-controlled**, condition
decided by the server, not fixed to "negative amount" or any one rule. This
is exactly principle 3's shape ("framework does visuals, you do the data") —
refuse baking a business rule (negative-red, threshold, category) into the
framework; ship a general attribute the server sets per any condition it
computes.

**Item 71.1 — `data-tone` attribute on data-table cells.** `data-tone=
"danger|warning|success"` on any `<td>` sets that cell's own `--bo-cell-bg`
(the same custom property row-state already paints through) to the matching
`-subtle` token, plus an inline-start inset box-shadow accent in the solid
tone color — the same two-channel shape (`color + non-color cue`) row-state
already uses, applied per-cell instead of per-row. Reuses existing tokens
(`--bo-color-danger-subtle`/`-success-subtle`/`-warning-subtle`, already
shipped in `tokens/color.css`) — **zero new tokens, zero JS**, pure CSS
attribute selector so it works on plain server-rendered HTML or an htmx
swap with no behavior needing to run.

Accept: `data-tone` documented on `/components/data-table` with a demo
showing a server deciding tone per cell (caption states explicitly "the
server decides the condition — a negative amount, a threshold, a business
rule — the framework only paints the result," per principle 3); composes
correctly with existing row states (a dirty+danger cell doesn't produce a
broken double-tint — cell-level `--bo-cell-bg` naturally wins over the
row's since it's set closer to the painted element); AA contrast verified
both themes for all three tones; live-verified light + dark in the
bind-mounted Podman container; existing gates stay green.

**Shipped 2026-08-20.** `packages/core/src/css/components/data-table/
data-table.css`: three attribute-selector rules
(`td[data-tone="danger|warning|success"]`), reusing `--bo-state-error-bg`/
`--bo-color-warning-subtle`/`--bo-color-success-subtle` and matching the
existing row-state's exact shape — no new token declared, no JS. New
`forced-colors` block matches the row-state one (border swap-in, same as
every other tinted state on this page). `check:contrast` passed
unmodified — these background tokens (and default cell text over them)
were already covered by the row-state work, so no new `PAIRS` entry was
needed (checked, not assumed).

New "Conditional cell tone" section on `/components/data-table`: a
3-row/3-column demo (Budget vs. Balance per cost centre) showing all three
tones with the negative-balance cell captioned to show the tone repeats a
meaning already in the text (the minus sign), not the only channel. Also
composes-with-row-state note. `data-hooks` gate: 52 documented (was 51).
`check-markup`: 51478 class/attribute uses verified (was 51463). Both
green. Full core build green (`check:contrast`, `check:composited`,
`check:rtl`, `check:motion`, `check:package`, `check:rf-floor`) after a
`stamp-readme.mjs` re-run (bundle size shifted by the new rules).

Verified live in a `--no-cache` Podman rebuild of `bo-docs-run`: both
tones render correctly with visible accent bars in **dark and light**
theme, text stays legible over every subtle background. **390px not
independently re-verified** — the browser tool's window resize did not
propagate to the tab viewport (same limitation hit in Slice 70.1). Risk is
low: the new rules are plain attribute-selector background/box-shadow with
no media query and no interaction with the page's one width-dependent rule
(`@container` auto-compaction only touches padding/font-size, not
`--bo-cell-bg`), so there is no plausible width-dependent failure mode
here.

**Item 71.2 — dogfooded `data-tone` in po-app's own "Spend by cost
center" screen (2026-08-20).** Not a docs-only feature: `spendScreen()`
already computed a budget percentage server-side for its `<progress>` bar
tone (danger ≥90%, warning ≥75%) but the meaning stopped at the group
header — the subtotal cell itself carried no signal. Reused the exact
same `pct` already computed (zero new business logic) to set
`data-tone="danger"`/`"warning"` on the subtotal `<td>`, plus an inline
"— over budget threshold" text cue on the danger case (the two-channel
requirement the docs page itself states). `check:po-app` unchanged at
13/13. Verified live in a `--no-cache` Podman rebuild: all three seeded
cost centres are genuinely over budget (134%/448%/330% consumed), so all
three subtotals show danger correctly — confirmed against the actual
percentages, not assumed from a passing gate. Both themes checked; the
tone composes cleanly with the existing progress-bar signal rather than
duplicating or fighting it. This is real-consumer validation of 71.1, not
a new framework surface — `examples/po-app/server.mjs` only.

**Exit:** 71.1 and 71.2 both shipped and verified; the "overview/sidebar"
half of the real 30.0 (Slice 30) remains open, unrelated, and unblocked
by this.

## Slice 70 — Objective grill: the po-app dogfood streak (2026-08-20)

Dispatched ahead of the formal 3/3 counter (2/3 at dispatch), same
justification as Slice 69's early Standardize dispatch: four consecutive
wakes (three Explore + one Standardize) had gone into `examples/po-app`
with no critical review, and a fifth feature was under consideration.
Full report: `.roundtable/grill-po-app-streak-2026-08-20.md`.

**Finding:** Slices 66/67/68 each pass principles 1-3 cleanly (zero
`packages/core` changes across all four commits; the cost-centre picker
reused by 3 independent forms; `parsePoFields` consolidation caught its
own duplication within a wake). Principle 4 catches a real composition
defect: the Pending-PO detail screen shows two simultaneous
visually-primary actions — `Save changes` (`server.mjs:717`, the
field-editor table's own footer) and `Approve…` (`server.mjs:788`, below
Documents) — both plain `.bo-btn`, both visible at once. Breaks the
2026-08-19 measured bar (18/19 screens ≤1 primary; the wizard's
Next/Submit pair is the sole exception and even that is never both
visible). Each button matches its own documented pattern in isolation;
the violation is po-app composing two independently-correct patterns onto
one screen, not a framework defect.

**Item 70.1 — gate `Approve…` visibility off the row-edit table's own
dirty state. Shipped 2026-08-20.** Hide/disable the `Approve…` cluster
while the Order table has `data-any-dirty` set (the state po-app already
tracks at `server.mjs:715,727-732`) so at most one primary action is
visible at a time, matching the wizard precedent exactly. App-level
composition fix in `examples/po-app/server.mjs` (an `id="approve-cluster"`
on the existing `bo-cluster`, toggled by the same `sync()` that already
drives the dirty badge); no `packages/core` change.
**Accept:** verified live in a freshly-built (`--no-cache`) bind-mounted
Podman container on `PO-88214` (Pending) — clean load shows both `Save
changes` and `Approve…`; typing into Amount hides `Approve…`, leaving
only `Save changes`; Cancel restores `Approve…`. Confirmed in both light
and dark theme (`data-theme` toggle) at 1440px. **390px not independently
re-verified this wake** — the browser tool's window resize did not
propagate to the tab's viewport after two attempts (`innerWidth` stayed
1440), so per the diagnosing-bugs discipline this is stated rather than
silently skipped. Low risk: the fix is a JS `hidden`-attribute toggle on
markup already responsive-verified at 390px in Slice 68, with no new CSS.
`check:po-app` 13/13 unchanged.

**Also refused this wake:** a cancel/delete-PO route — no dead link or
dogfooding gap surfaced it (real ERP convention voids via a status
transition, not a hard delete), and a fifth feature on an already
two-decision screen would add a third; refused per principles 1 and 4,
not built speculatively.

**Exit:** report written, one actionable item queued above (not built
this wake — Objective is a review dispatch, item 70.1 is a normal build
item for the next Continue/Standardize pass), verdict is Rethink-not-
refuse on the streak itself: the loop pattern is healthy, the screen
composition needs one fix.

## Slice 69 — Standardize: po-app's own three-Explore-wake drift (2026-08-20)

Dispatched by rule 2's "drift flagged... spotted during triage" clause,
ahead of the round counter (Standardize was 3/4, not yet overdue) —
spotted while orienting for this wake, reading back over the last three
Explore spikes' combined diff.

1. [x] **69.1 — `/pos/new` and `/pos/:id/edit`'s field validation was two
       identical copies.** The field-editor spike (68.1) duplicated the
       PO-creation spike's (67.1) rules word for word — same field
       extraction, same three error messages, same cost-centre existence
       check, byte-for-byte. Extracted into one `parsePoFields(form)`,
       used by both POST handlers. Re-scanned the rest of the file for the
       same shape of drift afterward: the remaining repetition (one line
       of `aria-invalid`/`aria-describedby` per field — 7 occurrences,
       each a genuinely different field id; three dialogs' own close-
       button boilerplate; three separately-shaped "already decided"
       guards serving different response conventions — batch partial-
       failure vs. single-request precondition-failed) is the framework's
       normal per-field/per-dialog shape, not copy-paste drift, and was
       left alone rather than forced into false uniformity.

**Exit:** clean re-scan after the one real consolidation — no second
round needed. `check:po-app` 13/13 unchanged (behavior identical, only the
validation's SOURCE consolidated). Verified live via the real Podman
container build, both themes, both the creation and edit 422 paths.

## Slice 68 — Explore: record editing dogfooded in po-app (2026-08-20)

Dispatched by rule 6 — backlog still empty of anything not owner-blocked
(third consecutive wake in this state). Continuing the dogfood-loop
fallback in a fresh isolated worktree. Full report:
`.roundtable/explore-po-edit-2026-08-20.md`.

1. [x] **68.1 — `po-app` had no way to fix a mistake on a record at all.**
       A Pending PO could be approved, rejected, or bulk-recosted, but a
       typo'd vendor name or wrong amount had no correction path — not
       even delete-and-recreate (no delete route exists). Applied
       `/patterns/field-editor`'s shape (one row per field, one Save) to
       the PO detail screen's Order fieldset, gated to Pending only — same
       "already decided needs a reversal" rule `mass-change` already
       established, now server-side-enforced on this path too (409 if the
       record was decided between page load and submit, not just hidden
       client-side). `POST /pos/:id/edit` matches field-editor's own
       contract: 422 keeps values, marks only the bad field; success
       redirects to the record. The shared cost-centre picker (66.1, then
       67.2) reused a third time, zero new picker code.

2. [x] **68.2 — Three new checks added to `check-po-app.mjs`**: the 422
       field-preservation path, the success-and-persist path, and the
       already-decided 409 guard. **Caught a real bug in the new success
       check's own first version**: `fetch()`'s default
       `redirect: 'follow'` silently followed the 302 and reported the
       FOLLOWED response's 200 as the edit's own status — the exact
       mistake already avoided one check earlier in the same file (the
       `/pos/new` success check), missed on the very next similar check
       anyway. Fixed with `redirect: 'manual'`, same as its neighbor.

**Exit:** graduated — landed directly in `examples/po-app` and
`apps/docs/scripts/check-po-app.mjs` (no `packages/core` changes, no
framework CHANGELOG entry). Verified live: edit→save→redirect→persisted,
edit-with-bad-field→422 values preserved, edit-already-decided→409
confirmed unchanged via a separate GET, both themes. `check:po-app` 13/13
(10 pre-existing + 3 new).

## Slice 67 — Explore: PO creation dogfooded in po-app, a dead link fixed (2026-08-20)

Dispatched by rule 6 — backlog still empty of anything not owner-blocked
(same state as Slice 66). Continuing the dogfood-loop fallback in a fresh
isolated worktree. Full report:
`.roundtable/explore-po-create-2026-08-20.md`.

1. [x] **67.1 — `/pos/new` was a genuine dead link, shipped in the
       reference app.** The empty state's own primary action pointed at a
       route that 404'd — confirmed live, `curl` returned 404. Unreachable
       in ordinary use: the empty state never fires with 30 seeded
       records, so nobody had ever actually clicked it. Built the real
       screen: `/patterns/detail-form`'s shape (fieldset + `bo-form-row`),
       scoped to the fields `po-app`'s data model actually has (Vendor,
       Cost centre, Amount — no line items; the `pos` records never
       modeled them, and inventing that scope now would be a second
       spike). Server-side validation matches detail-form's own documented
       contract: 422 re-renders the SAME form with values preserved and
       `aria-invalid` on only the bad field(s); success redirects to the
       new record. Added a PERSISTENT "New purchase order" button to the
       list header — the dead empty-state link was the only path to this
       route before.

2. [x] **67.2 — The cost-centre picker (66.1's dogfood spike) refactored
       into a shared helper.** `costCenterPickerTrigger`/
       `costCenterPickerHtml`, parameterized by target field id via
       `data-cc-target` (captured at click time, so any number of triggers
       on one page work without the dialog needing to know about them in
       advance). The mass-change dialog's own inline copy removed — one
       dialog + one wiring script now, not two. Verified live: both the
       new creation form and the existing mass-change dialog fill their
       own field correctly from the same shared picker.

3. [x] **67.3 — Three new checks added to `check-po-app.mjs`** (Slice
       26.1's gate): the 422 field-preservation path, the success-and-
       redirect path, and the picker's server-side search narrowing.
       `/pos/new` added to the gate's own axe sweep. **One of the new
       checks caught a real bug in its own first version**: comparing
       `/pos`'s row count before/after creating a record — `/pos` only
       ever renders page 1 (`PAGE_SIZE = 10`), so with 30+ records already
       seeded the count was 10 both times regardless of whether anything
       was added. Ran it once, watched it report a false failure against
       genuinely-working code, diagnosed the cap, switched to checking the
       new record's own row id appears on page 1 — the same base-rate
       discipline applied to a brand-new test, not just to app code.

**Exit:** graduated — landed directly in `examples/po-app` and
`apps/docs/scripts/check-po-app.mjs` (no `packages/core` changes, no
framework CHANGELOG entry). Verified live: full create/reject/success
flow, both themes, `check:po-app` 10/10 (7 pre-existing + 3 new),
axe-clean across the new route.

## Slice 66 — Explore: value-help dogfooded in po-app, backlog empty (2026-08-20)

Dispatched by rule 6 — backlog genuinely empty of anything not owner-blocked
(52.3, 37.2/37.3, 30.0, 30.4b, the 0.2.0 release, VoiceOver/NVDA/AT runtime
evidence — all OWNER CALL / AWAITING CLARIFICATION / NEEDS-RUNTIME; Turbo's
own trigger condition isn't met). Ideas backlog already exhausted
(2026-08-14) — per its own documented fallback, extended `examples/po-app`
and felt where it fights. Full report:
`.roundtable/explore-value-help-po-app-2026-08-20.md`.

1. [x] **66.1 — `/patterns/value-help` dogfooded for real in `po-app`'s
       mass-change flow.** Spiked in an isolated worktree
       (`explore/value-help-po-app`), graduated. A real `COST_CENTERS`
       catalog (didn't exist before — every "CC-nnnn" in the app was an ad-hoc
       string literal), a server-side `/cost-centers?q=` search endpoint
       (debounced, matching the docs' own "a real picker asks the server"
       half the static demo doesn't test), and the picker composed as a
       SECOND modal opened from inside an already-open one — a stacking
       case the docs demo never has to handle. Verified live: native
       `<dialog>` stacking, per-dialog focus trap, and fill/close/refocus
       all work with **zero framework changes**. `mass-change`'s validation
       upgraded from format-only regex to real existence-checking, closing
       a real gap (a well-formed but nonexistent code used to silently
       "succeed").

2. [x] **66.2 — Found and fixed a real, pre-existing bug in `po-app` while
       dogfooding.** `/pos/mass-change`'s 422 response put its OOB alert
       block BEFORE the main `tbody` swap content — the ONE response in the
       file shaped that way; both success paths already put main content
       first. After that response, `#po-rows` vanished from the DOM
       entirely (checked directly: `document.querySelectorAll('tbody').length
       === 0`), not eyeballed. Confirmed NOT caused by this spike:
       reproduced on a clean, unmodified checkout running standalone before
       touching anything. Fixed by reordering to match the working shape;
       re-verified in both the live `node` process and the real
       containerized (Podman, tarball-installed) build, both themes.
       Nobody had tried a well-formed-but-wrong cost centre through a live
       browser before — the base-rate rule, again: the first real use of an
       untested path found it broken.

**Exit:** graduated, not discarded — landed directly in `examples/po-app`
(no `packages/core` changes, so no framework CHANGELOG entry). Verified
live via the real Podman container build, both themes, the full flow.

## Slice 65 — Standardize: two framework bugs the design-grill sweep queued (2026-08-20)

Dispatched by the counter at 4/4 (OVERDUE). Both queued items (58.3, 58.4)
were explicitly framed when found as needing this treatment — a considered
fix plus every call-site verified, not a same-wake patch — so this sweep
resolved them directly rather than scanning for new drift first.

1. [x] **58.3 landed.** `.bo-stepper__label` swapped `white-space: nowrap`
       + `text-overflow: ellipsis` for `overflow-wrap: anywhere` (no
       `white-space` override, so the browser wraps naturally first and
       only breaks mid-word as a last resort). A squeezed label now wraps
       to a second line instead of silently dropping characters — no
       silent content loss, the same principle this project applies
       everywhere else (two-channel state, calendar reasons, etc.).
       Verified at the exact measured repro (558px container, 4 steps):
       `scrollWidth === clientWidth` on every label, zero clipping. All 4
       call sites checked live (`wizard`, `approval`, the `stepper`
       component page, `container-queries` — prose-only, no live instance)
       plus the existing 480px hide-labels tier re-verified untouched.
       Both themes.

       **Re-scan for the same drift class**: grepped every component CSS
       file for `text-overflow: ellipsis` — stepper was the only user, and
       it's fixed. Clean.

2. [x] **58.4 landed.** `setDirty(row, false)` in `row-edit.ts` now checks
       `hasInvalidCell(row)` (any `[aria-invalid="true"]` descendant) before
       deciding what to leave on `data-row-state`: `"error"` if one
       survives, cleared entirely otherwise. Fixes Cancel (restores a field
       to its original — possibly still-invalid — value) and Save
       (baselines optimistically before any async confirmation) uniformly,
       since both funnel through the same function. Verified all three
       paths live: Cancel on an invalid row → `data-row-state="error"`,
       value restored to 450, message still visible, tint visible in both
       themes; Cancel on a **valid** row (regression check) → state clears
       to `null` as before; Save on a still-invalid row → `"error"` persists
       (correct — nothing confirmed the fix yet). All 5 real call sites
       (`detail-form`, `editable-grid`, `field-editor`, `inline-editing`,
       `data-table`) spot-checked live, no regression.

       **Re-scan for the same drift class**: grepped every other behavior
       for `removeAttribute` calls near a competing state — none share
       `data-row-state`'s shape (one attribute serving three meanings:
       dirty/warning/error) combined with an externally-set validation
       signal. `row-edit.ts` was the only instance. Clean.

**Exit:** both queued items landed, both re-scanned for further instances of
their own drift class, both scans clean — no third round needed. `npm run
build` gates green (stylelint, claims, page-shape, link-check, markup, axe
90 pages x 2 widths zero violations), verified live in both themes.

## Slice 64 — from the Objective grill, Slices 51-63 (2026-08-20)

Full findings: `.roundtable/grill-objective-slices51-63-2026-08-20.md`. Base
corrected before measuring: the first pass used the wrong (superseded) prior
grill as the diff base, caught before any number was trusted, per the
project's own base-rate rule — no measurement was quoted from the wrong base.

**No new items triaged — this window has nothing to correct.** Ten commits
landed (51.1, 53.2, 53.3, Standardize sweep 63, design-grill batch 1 / 58.1)
and every one of them either shrank framework surface without breaking a
call site (53.2, four icon glyphs deprecated in place), was scored and
REFUSED as new component surface (53.3 — NET −2 for a new component, +1 for
a bare recipe, both short of the +4 bar; accepted only once anchored to a
real composition inside `record-detail`), was pure audit with zero code
changes (Standardize 63), or found and fixed a real content bug instead of
shipping ornament (58.1's `PO-4021`/`PO-88213` mismatch). Framework class
count held flat at 189 across the whole window. Checked, not assumed: 53.3's
accepted diff table is confirmed live at `record-detail.astro:113-123`, not
just scored on paper. Continue the FIFO backlog: 58.1 batch 2
(settings-admin, approval, staging) is next.

## Slice 62 — from the Objective grill, Slices 56-61 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices56-61-2026-08-19.md`.

1. [x] **62.1 — The dispatcher was running LIFO, not FIFO, and it cost real
       value.** Nine consecutive Continue dispatches (19:10-23:01 today) each
       picked a just-triaged item; five older open items — including `53.2`
       (grill `icon`), queued with the explicit note that its removal window
       closes at the 0.2.0 publish — sat untouched the whole time. Cause:
       LOOPS.md's rule 4 said "the current in-progress slice's queue,"
       undefined anywhere, and in practice meant "whichever slice triage just
       created" — which, because triage inserts near the top of the file and
       every wake reads top-to-bottom, made the queue a stack.

       **Fixed directly in LOOPS.md** (process change, Step 1's own rule: edit
       on sight, don't queue). Rule 4 and Continue's Input line now both name
       the OLDEST open item across the whole backlog, with `RESUME.md` as the
       one legitimate override for a slice genuinely mid-build — with a
       warning to verify RESUME.md is actually current before trusting it,
       since it had gone stale itself (below).

       Demonstrated, not just asserted: applying the new rule to the current
       backlog surfaces `51.1` as the next dispatch target — exactly the item
       the grill found starved, once the two older-numbered but owner-blocked
       items (`30.0`, `37.2/37.3`) are set aside.

2. [x] **62.2 — `RESUME.md` had gone stale, and it was the SAME failure mode
       one level up.** Its "Slice 48" open question had already been resolved
       and shipped (48.4, then the whole object-page pattern) without the file
       being updated — stale state trusted instead of checked, the identical
       root cause as 62.1. Corrected: the resolved question moved to a
       "resolved, not re-litigated" section, the 37.1 rubric note updated to
       say Slice 53's NEED/COST rubric superseded it, and 52.3 added as a
       genuine owner-blocked item (not starved — the loop cannot decide it).

3. [x] **62.3 — Recorded, no action: this window shipped zero framework CSS.**
       Docs, one gate, and its own Standardize conversion — read together with
       62.1 as the same cause, not a second problem. Expected to self-correct
       once the FIFO fix lets `53.2` and `58.1` surface.

4. [x] **62.4 — Recorded: npm still serves 0.1.1, tenth consecutive grill.**

## Slice 61 — Owner wishlist: a generic, fixed review-screen contract (2026-08-19)

Owner asked two things: is the "review" pattern generic rather than
PO/Invoice-specific, and is there a *fixed* way to do it so a backend team
follows a contract instead of choosing UI. Grilled before building:
`.roundtable/grill-generic-review-pattern-2026-08-19.md`.

**Premise correction, stated plainly.** There is no page named "review"; the
closest three are `record-detail`, `object-page`, `approval`, and they differ
**on purpose** — short record / long record / decision-in-progress are three
different interactions, not one screen under three names. `record-detail`'s
own opener already says the genericity the owner is asking for: *"This example
is a purchase order; the shape is the same for an invoice, a change request,
or a leave request."* Measured: `approval.astro` uses 9 distinct `bo-*`
classes, all generic components, none named after a document type. The
coupling that exists is worked-example data (CLAUDE.md's own demo-first
recipe), not structural.

**The second ask is the real finding.** Comparing anatomy across all three
surfaces a skeleton they already converged on independently — Identity
(status/title) → Facts (kv) → History (timeline/audit) → Action — which is
stronger evidence than one person designing it top-down.

1. [x] **61.1 — Write the anatomy contract as its own concept page, not a new
       pattern.** Four regions, which component fills each, and — the part
       that actually removes a decision — **which of the three patterns to use,
       decided by two questions**: is the record short or long (→
       `record-detail` or `object-page`), and is the current moment itself a
       decision to make (→ `approval`). That is the "backend doesn't need to
       think" outcome: the choice to eliminate is *which pattern*, not *what a
       pattern looks like*.

       Accept: each of `record-detail`, `object-page`, `approval` gets a
       one-line cross-reference in its own Anatomy section pointing at the
       contract page. Zero new components, zero new CSS.

       **Landed 2026-08-19.** `/concepts/review-anatomy` — the four regions
       (Identity/Facts/History/Action), which component fills each, and the
       two-question decision (is the moment itself a decision → approval;
       otherwise short vs long record → record-detail vs object-page). Each of
       the three patterns cross-links back.

       **Two claimed table cells were wrong before the page shipped, caught by
       reading the anatomy prose rather than recalling it.** Facts for
       `approval` is "Record summary" (amount, vendor, cost centre), not
       "compact, above the queue" as first drafted; Action for `record-detail`
       is the feed input, verified present in the live markup before being
       claimed. Verifying every cell against the source it describes is the
       same discipline as red-proving a gate, applied to a comparison table.

       Zero new components, zero new CSS, as the Accept required — both tables
       use `.bo-data-table` + `.bo-data-table-container`, which the layout gate
       caught missing on first build (5px overflow at 390) before it shipped.

       Verified live at 1440/390, both themes. Every gate green, axe 90 pages x
       2 widths zero violations. Seven visual baselines shifted from the new
       sidebar entry — six by ~104px (a row nudged down), one
       (`concepts/density`) by the full sidebar height because that page's own
       matrix shot happens to run long enough to touch it; confirmed by
       screenshot that the page's own content never moved before accepting.

2. [x] **61.2 — Refused: merge the three into one pattern.** Would undo the
       reason `object-page` exists — Slice 52 built its scroll-collapse
       specifically because a short-record layout breaks once content is long
       enough to need in-page navigation. A contract loose enough to fit all
       three as one page would be too vague to save anyone a decision, which
       is the actual bar (Objective §3).

3. [x] **61.3 — Refused: a new `bo-review` component.** Every region across
       all three is already `.bo-widget` / `.bo-kv` / `.bo-timeline` /
       `.bo-badge` / `.bo-form-actions` — the same refusal already made for
       value-help and object-page, for the same reason.

## Slice 59 — Owner wishlist: RF-scanner browser floor + a smaller-screen profile (2026-08-19)

Owner asked for (a) an RF-scanner component supporting 5-6-year-old devices,
studied to find the right floor, and (b) that support separated for smaller
screens. Researched before building — three parallel agents (device
landscape, CSS floor audit, JS floor audit), spot-checked against source
before trusting any number. Full study:
`.roundtable/rf-scanner-floor-study-2026-08-19.md`.

**What already exists — nothing to rebuild.** The scanning mechanics shipped
in Slice 6: `initScanInput()` (zero new CSS) and `.bo-quantity` +
`data-density="spacious"`, composed in `/patterns/goods-receipt`. This slice is
about the FLOOR and the PROFILE, not the interaction.

**The literal ask — "a component… separated" — is refused as phrased.** A
forked RF component/theme fails the Objective's own §2 (refuse a second way to
do something that already works) and §3 (nothing ships for one screen). What
the research actually supports is narrower: not a new component, but a
**derived, lower-floor build profile of the existing source** — the same shape
as the per-component dist files that already exist, one more build target from
one source tree, so it cannot drift the way a hand-maintained fork would.

1. [x] **59.1 — Recommended floor: Chrome/WebView 108, stated at MEDIUM
       confidence, not asserted as fact.** Every RF vendor's "Enterprise
       Browser" (Zebra, Honeywell, Ivanti Velocity) renders through the
       device's Android System WebView — it is the real floor, not a bundled
       engine. 108 is defensible because it's cleared by any device patched at
       all in ~3.5 years and still includes container queries + `:has()`
       (105/106), the two features a density-aware framework needs.

       **Stated honestly**: a fully patch-frozen, Play-blocked fleet sits at
       the factory image (WebView 61-83) — unquantifiable, and out of scope
       for any modern-CSS framework, not a floor this project can chase.
       Accept: this number and its confidence level are published on the docs
       page the profile ships on, not silently assumed.

       **Landed 2026-08-19.** A "RF scanners and other older handheld devices"
       section on `/getting-started/installation` — the same page that already
       states the framework's general floor, so the two live beside each
       other. States the number, the confidence level, and the pessimistic
       case (Play-blocked/patch-frozen fleets sit at the factory image and are
       out of scope) in the same words as the study. Points to
       `/patterns/goods-receipt` for the scanning interaction itself, which
       needs no profile — it's Chrome-80-safe today.

       No hand-typed floor: the 108 is a researched *target*, not a claim
       about this framework's own shipped CSS, so `check:floor` (which forbids
       hand-typing THIS project's floor) correctly did not fire. Verified live
       at 1440/390, both themes.

2. [x] **59.2 — `rf-essentials` build profile, targeting 108.** — landed
       2026-08-20. `scripts/build-rf-essentials.mjs`: a PostCSS pass over
       tokens, reset, button, form/*, quantity, badge, alert, data-table,
       state, kv — autoprefixed against `chrome >= 108, and_chr >= 108`
       specifically (the main bundle stays at 119+; two separate
       browserslist targets from one source tree, not a fork).

       **The item's own scoping was checked against BCD before trusting
       it, and it was wrong about two of the three "needs a fallback"
       claims.** `:has()` and `@container` are both Chrome 105 — WITHIN
       108 — so data-table's row-select highlight and density switch need
       nothing. Checked precisely which features in the actual RF-relevant
       subset exceed 108: only three — `:user-invalid` (119, in
       `form-field.css`), `color-mix()` (111, in `badge.css`), and
       `subgrid` (117, in `kv.css`, not named in the original scoping at
       all). `form-field.css` already had a documented `:is()`
       forgiving-list fallback from before this slice — nothing to build.
       Added real `@supports` progressive-enhancement fallbacks to
       `badge.css` (flat `--bo-color-border-default` below 111, the hued
       `color-mix()` boundary above it) and `kv.css` (an own two-column
       `grid-template-columns` below 117, `subgrid` above it) — source-
       level fixes, so every consumer benefits, not just this profile.
       Verified live in a real browser: badge borders still hue-matched
       per variant, `--type` chips still borderless, `.bo-kv--rows` still
       aligned — both themes.

       Registered as a known bundle in `check-rtl.mjs` (it re-exports the
       select-chevron flip already documented for `form.css`) and excluded
       from that gate's flip-site COUNT the same way `index.css`/`nav.css`
       are — a re-export isn't a new site.

       Wired into `packages/core`'s `npm run build` (after `build:floor`).
       Accept met: one PostCSS build target, output verified — not
       claimed — clean at 108 (59.3, below).

3. [x] **59.3 — A floor-verification gate for the profile, same technique as
       `derive-floor.mjs` in reverse.** — landed 2026-08-20.
       `scripts/check-rf-floor.mjs`: parses the built `rf-essentials.css`
       (postcss AST, not a grep) and fails on any use of a feature above
       Chrome 108 that isn't guarded by an `@supports` ancestor or a
       forgiving `:is()`/`:where()` selector list.

       **A naive substring scan (derive-floor's own technique, tried
       first) produced exactly the false positives derive-floor doesn't
       have to worry about**: it flagged all three guarded features as
       violations, because it can't tell "mentioned" from "mentioned
       inside a guard that makes the browser skip it." Parsing instead of
       grepping is the actual content of "in reverse" — not just inverting
       the pass/fail direction.

       **Red-proving this gate found two real bugs in the gate itself**,
       both caught by injecting an unguarded `color-mix()` into the real
       profile source and confirming the gate's own reported violations —
       not by trusting a green run:
       - `earliestChrome(compatOf(f.path))` passed the WHOLE multi-browser
         BCD support object where a single browser's entries were expected
         — every feature silently came back "not over the limit," so the
         gate always passed, including against the injected violation.
         Missing `.chrome`.
       - Once that was fixed, the gate correctly caught the injection but
         ALSO flagged the legitimate, already-guarded `:user-invalid` use
         as a violation: the forgiving-list check used a `[^)]*` regex,
         which breaks the moment the wrapper contains ITS OWN nested
         parens — exactly what `form-field.css`'s real
         `:is(...:has([aria-invalid="true"]), ...:has(...:user-invalid...))`
         does. Replaced with a real paren-depth scan.

       `findViolations` is the ONE function both the real run and
       `--self-test` call, on purpose — a first draft duplicated the walk
       logic between them and the two silently drifted, which is part of
       why the first bug went unnoticed by its own self-test. `--self-test`
       now covers the nested-paren shape specifically, not just a flat
       case. Final red-proof: injected `color-mix()` → gate failed with the
       exact file:line; reverted → gate passed clean.

4. [x] **59.4 — The "smaller screen" half of the ask, answered as a demo, not a
       fork.** — landed 2026-08-20. A 360×640 isolated document,
       `/patterns/rf/goods-receipt-rf/`, styled by ONLY
       `assets/rf-essentials.min.css` (never the framework's main bundle —
       that would prove nothing about the profile), embedded via
       `<iframe>` from `/patterns/goods-receipt`. Reuses the SAME
       scan-to-receive markup as the full page — factored into a shared
       `ScanToReceive.astro` component, so the two demos can't drift the
       way two hand-typed copies would.

       **Building this for real found two things the profile's own scoping
       had missed, exactly the value a real consumer is supposed to
       provide.** `.bo-visually-hidden` (the scan-status live region's
       class, used by `goods-receipt`'s OWN existing markup) lived in
       `primitives/`, which 59.2's component list never imported — the
       announcement rendered as ordinary VISIBLE text instead of being
       screen-reader-only, caught by actually looking at the rendered page,
       not by a gate. Added `primitives/visually-hidden.css` to the
       profile's imports (rebuilt, re-verified against 59.3's gate — still
       clean). Separately, the isolated page itself needed a real `<h1>`
       and a named `<main>` landmark — `axe-audit.mjs` flagged both, plus a
       `landmark-unique` violation once fixed, because the sweep scans INTO
       same-origin iframes: the RF page's own `<main>` and the parent
       `/patterns/goods-receipt` page's `#main-content` land in one
       accessibility tree when embedded together, so the child's landmark
       needed its own `aria-label` to stay distinct.

       New pattern-page-shape gate exemption, documented with a reason:
       `check-page-shape.mjs`'s `RELATED_EXEMPT` now includes
       `patterns/rf/goods-receipt-rf.astro` — the opposite reason
       index.astro/404.astro are exempt (they have their own navigation;
       this page deliberately has none, because a reader never lands on it
       directly).

       Verified live at 1440/390 (the outer page) and 360×640 (the
       embedded iframe, matched exactly to the RF viewport), both themes,
       the scan interaction driven for real (typed a barcode, pressed
       Enter) rather than assumed. `npm run build` gates green in both
       `packages/core` and `apps/docs` (page-shape, claims, link-check,
       markup, calendar-grid, data-hooks, learning-path, components-used,
       boost, notes, 59.3's floor gate), stylelint clean, axe 91 pages x 2
       widths zero violations.

       **Slice 59 is done — 59.1 through 59.4 all landed.**

## Slice 58 — Owner ask: run /design-grill across the screens (2026-08-19)

Owner: *"why don't put /design-grill in the plan as well"* — agreed; installing
the filter (Slice 57) without scheduling its use would make it shelf-ware.

1. [x] **58.1 — /design-grill sweep, worst-suspect first, in batches of 3-4.**
       — landed 2026-08-20, all 5 batches / 19 of 19 patterns.
       Order chosen by where decoration and mechanism-language hide, not
       alphabetically: **reporting-dashboard, app-launch, record-detail** first
       (dashboards accumulate ornament; launchers accumulate icons; long detail
       pages accumulate fields), then settings-admin, approval, staging, then
       the rest of the 19.

       **Batch 1 landed 2026-08-20** — reporting-dashboard, app-launch,
       record-detail. Reports:
       `.roundtable/design-grill-{reporting-dashboard,app-launch,record-detail}-2026-08-20.md`.

       **record-detail had a real content bug, found and fixed, not just
       flagged.** A record identified as `PO-88213` in its own breadcrumb
       called itself `#4021` in its own feed card — `4021` is the numeric
       suffix of the cost centre, `CC-4021`, three lines below in the same
       file. Present in **two** places; the second (an audit-trail entry
       reading "raised PO-4021") was missed by the first grep and caught only
       by looking at the *rendered* screenshot after the first fix — the same
       "verify against what renders, not the diff" rule CLAUDE.md already
       states. Both fixed; verified live that every ID on the page now reads
       consistently.

       **All three openers named WHAT the screen composes, never WHO uses it
       or WHAT DECISION it serves** — the one finding common to the whole
       batch, and the clearest instance yet of Objective §4. Reworded to the
       "Who uses it / what done looks like" phrasing the strongest patterns
       (`record-detail`'s own edit, `object-page`, `value-help`) already use.

       **reporting-dashboard**: the stat-tile row — the actual status — sat
       BEHIND the filter bar in reading order, so a reader scrolled past a
       search box before reaching the first number; reordered, stats first.
       The "Overdue" stat's delta read `unchanged` with no comparison basis,
       contradicting the page's own Anatomy claim that every tile states one
       ("vs last quarter" / "vs plan"); given one.

       **app-launch**: the States table described a `count` badge capability
       `AppTile.astro` does not implement — confirmed live, zero count badges
       exist anywhere on the rendered page, and the component's own doc
       comment calls its three marks (icon/initials/svg) *"the three marks a
       real launcher actually needs."* Reworded to say plainly that a count
       is a fourth kind this component does not ship, not a state it already
       handles.

       **Two explicit "all keep" verdicts recorded, not searched past**: zero
       primary actions on both `reporting-dashboard` and `app-launch` is
       correct, not a defect — an informational screen and a pure-navigation
       launcher have no commitment to make. The dashboard's good/bad delta
       glyphs (an extra ⚠ on the bad one, not colour alone) were credited as
       two-channel done correctly, not silently passed over.

       Verified live at 1440/390, both themes. Every gate green, axe 90 pages
       x 2 widths zero violations. Four `app-launch` visual baselines
       accepted after attributing the growth (+38px at 1440, +117px at 390)
       to the deliberate opener and States-table text added.

       **Batch 2 landed 2026-08-20** — settings-admin, approval, staging.
       Reports:
       `.roundtable/design-grill-{settings-admin,approval,staging}-2026-08-20.md`.
       Width caveat: `resize_window` would not hold 1440/390 this wake (stuck
       at ~606px regardless of the requested size — an automation-tooling
       fault, not a page defect); shared primitives were already proven at
       true 1440/390 in batch 1 with zero CSS changes since, and the one
       width-sensitive finding below was measured directly on the DOM
       (`scrollWidth`/`clientWidth`), not eyeballed from a screenshot.

       **A real, measured clipping bug in the shared `stepper` component,
       queued rather than hot-fixed.** At a `.bo-stepper` container width of
       558px — comfortably above the component's own 480px/30rem threshold
       where it deliberately hides labels — two of four step labels still
       overflow: "Line items" needs 66px, has 64px; "Approvers" (the CURRENT
       step) needs 68px, has 64px. `flex: 1` splits width evenly regardless
       of how much text each label needs, so any 4+-step wizard can hit
       this at a mid-range width. Not patched here: `text-overflow:
       ellipsis` is deliberate CSS, markers stay legible, and a real fix
       (a second container-query tier, or an audit of every `.bo-stepper`
       call site) deserves a dedicated Standardize pass, not a one-off. New
       item: **58.3 — Standardize the `stepper` component's label-clipping
       gap at mid-range container widths** (Accept: every existing
       `.bo-stepper` call site checked at its own container width; the
       528-568px band specifically, since that's where this was measured;
       fix doesn't regress the existing 480px hide-labels tier).

       **settings-admin and approval both had Anatomy/States sections
       promising elements their own live demo never shows** — the third and
       fourth instance of the shape `app-launch` had in batch 1. settings-
       admin's "Danger zone" and States' "Destructive action" row describe a
       confirm-dialog flow that doesn't exist anywhere on the page, despite
       the Data contract already specifying the endpoint
       (`POST /settings/:section/reset`). approval's Anatomy names a "Record
       summary," "Decision cluster" (Approve/Reject), and "Dialog" that the
       live demo never renders — the queue section is prose-only, pointing
       to `invoice-list` for the shared bulk-approve table but nothing for
       the Dialog, which is unique to this pattern. Reworded rather than
       built: added an explicit "not in this demo" note plus a live pointer
       to where the shape actually exists (approval → `record-detail` for
       the summary shape, `master-detail` for the dialog shape; settings-
       admin → this page's own Data contract section, named in prose since
       this docs shell has no heading-anchor IDs to link to — checked first,
       confirmed no page site-wide has one, so a `#data-contract` href would
       have shipped a dead link).

       **staging graded all-keep — the strongest page in this batch, and now
       the reference example for the opener-reword triage**: it already uses
       the "Who uses it / How often / What done looks like" format the other
       two were missing. Its "no ok tint" choice, two-channel row verdicts,
       and named-count Apply button are all stated with their own reasoning
       in the page's copy, not left for a reader to infer — credited, not
       searched past for something to flag.

       Verified live (bind-mounted container), `npm run build` gates green
       (page-shape, claims, link-check 8525 links, markup, calendar-grid,
       data-hooks, learning-path, components-used, boost, notes), stylelint
       clean, axe 90 pages x 2 widths zero violations.

       **Batch 3 landed 2026-08-20** — bulk-actions, detail-form,
       editable-grid, field-editor (alphabetical, no more worst-suspect
       signal to rank by). Reports:
       `.roundtable/design-grill-{bulk-actions,detail-form,editable-grid,field-editor}-2026-08-20.md`.

       **Two "all keep" verdicts** — `bulk-actions` and `field-editor` — both
       already used the Who/What-done opener format and had every Anatomy
       claim checked against the live page with nothing found wrong.
       `field-editor`'s "why one Save, not per-row" argument cites a
       measured regression from an earlier version of the same page (a
       button 228px from the field it saves, in an actions column taking
       37% of the table) — reasoning from this project's own history, not a
       hypothetical.

       **Two more instances of Anatomy claiming what the live demo doesn't
       show** — `bulk-actions`' "Selection"/"Toolbar action" items (no
       checkboxes or toolbar rendered before Anatomy; pointed to
       `invoice-list`, verified live there first) and `detail-form`'s "Line
       items" claim (said the nested table has editable-grid's per-row dirty
       state; it's actually a plain table with no `data-row-edit` at all —
       pointed to `editable-grid` instead of building the real thing here).
       `detail-form`'s sticky-action-bar claim was checked against
       `form-section.css` directly and confirmed accurate, not just assumed.

       **A real, measured framework bug in `initRowEdit()`'s Cancel
       handling, found operating the live `editable-grid` demo, not by
       reading source.** A row with a still-invalid cell
       (`aria-invalid="true"`, "Exceeds on-hand") loses its
       `data-row-state` entirely on Cancel — even when Cancel restores the
       field to its ORIGINAL, still-invalid value. Confirmed by direct DOM
       read after the click: `{rowState: null, qtyValue: "450",
       ariaInvalid: "true", messageStillThere: true}`. The cell-level signal
       survives; the row-level tint the States table promises does not — the
       two channels fall out of sync exactly when a user opens a
       pre-existing error and cancels out without fixing it. Not patched
       here (state-machine code three other patterns compose against);
       queued as 58.4.

       Also fixed: `editable-grid`'s missing Who/What-done opener (the
       "what, not who" gap this whole sweep keeps finding).

       Verified live (bind-mounted container, direct DOM interaction for
       the Cancel-state finding, not just a screenshot), `npm run build`
       gates green (page-shape, claims, link-check 8525 links, markup,
       calendar-grid, data-hooks, learning-path, components-used, boost,
       notes), stylelint clean, axe 90 pages x 2 widths zero violations.

       **Batch 4 landed 2026-08-20** — filter-panel, goods-receipt,
       invoice-list, login. Reports:
       `.roundtable/design-grill-{filter-panel,goods-receipt,invoice-list,login}-2026-08-20.md`.

       **One suspected defect checked against an existing gate and
       retracted before being written up** — `filter-panel`'s live form
       controls (unselected) appeared to contradict its "Applied filters"
       chip row (claiming Status: Pending / CC-4021 / Overdue active).
       Checked `check-claims.mjs`'s own `filter panel` check first: it
       proves the trigger-count behavior with real clicks
       (`/\(2\)/` against the live label after checking 2 boxes), so the
       interactive behavior is real; the static chip row is a deliberately
       separate illustration, not a claim the form above is pre-filled.
       Not a bug.

       **Two more instances of Anatomy claiming what the demo doesn't
       show** — `filter-panel`'s "The list" (this page is scoped to the
       filter bar itself; pointed to `invoice-list`) and, more
       substantially, `goods-receipt`'s "Expected vs received list" and
       "Confirm bar." The live scan demo is a flat append-only log (no
       ordered-quantity column, no running count, no post/confirm button
       anywhere) — checked by curl on the rendered page and by operating
       the scan interaction directly (typed a barcode, pressed Enter,
       confirmed the log row and refocus behavior work as documented).
       Reworded both Anatomy items rather than building a full
       expected-lines receiving screen, which would be a second pattern's
       worth of new markup for a claim this demo doesn't need to make.

       **`invoice-list` graded all-keep** — the third reference-quality
       page in the sweep (with `staging` and `field-editor`): a real
       measured regression anchors its keyboard-walkthrough argument
       ("thirty-two presses from row 30, which is what this page measured
       before the form was added"), bulk-action button types were checked
       live against the stated safety rule, and every Scaling-notes claim
       is a citation, not an opinion. One literal-reading nit (Footer's
       "rows-per-page + pagination" vs live pagination-only) considered and
       set aside as over-literal, not manufactured into a finding.

       Also fixed: `goods-receipt`'s opener (explained the RF-scanner input
       modality but never who/what-done) and `login`'s (a milder instance
       of the same gap — reworded for sweep consistency even though the
       gap was near-tautological for a login screen).

       Verified live (bind-mounted container; the scan interaction operated
       directly, not just read from source), `npm run build` gates green
       (page-shape, claims, link-check 8525 links, markup, calendar-grid,
       data-hooks, learning-path, components-used, boost, notes), stylelint
       clean, axe 90 pages x 2 widths zero violations.

       **Batch 5 landed 2026-08-20 — 19 of 19, the sweep is complete.**
       master-detail, object-page, validation-summary, value-help, wizard.
       Reports:
       `.roundtable/design-grill-{master-detail,object-page,validation-summary,value-help,wizard}-2026-08-20.md`.

       **A real self-contradiction found and fixed in `master-detail`**: its
       Anatomy claimed `data-row-state="selected"` as a two-channel
       selection tint, while the SAME page's own prose, a few lines below
       the live demo, explicitly says the opposite — "the framework ships
       no tint for it... there is no `data-row-state="selected"` to reach
       for." Checked the live markup to settle it: only `aria-selected` is
       ever set. The Anatomy item was flatly wrong and the page's own prose
       was right; fixed to match.

       **A real capability-overclaim found in `wizard`, caught by reading
       `wizard.ts` directly rather than trusting the docs prose.** Anatomy
       said "completed steps are navigable"; `initWizard()` only wires
       Back/Next, and the step markers are plain `<span>`s, not buttons —
       there is no click-to-jump anywhere in the shipped behavior. Reworded
       to name the real gap rather than removing the claim outright, since
       a reader planning a wizard needs to know this needs building, not
       that the Anatomy item itself is wrong. Not implemented this wake —
       a real feature (markup contract change: markers become buttons, plus
       the accessibility care every other interactive element here gets),
       not a same-wake docs patch, and outside this batch's accuracy-only
       Accept criteria.

       **Three of five graded all-keep** — `object-page`, `validation-
       summary`, `value-help` — each backed by real `check-claims.mjs`
       coverage (gated, not eyeballed) for its most load-bearing runtime
       claims. `object-page` in particular already contains its own
       self-correcting regression story in a code comment (a scroll-margin
       value first sized wrong, overshot ~110px, caught by the project's
       own "anchor bar follows the reader" claim, and fixed with the story
       kept) — the grill's job was already done by the page's own build
       history.

       Also fixed: `wizard` and `validation-summary`'s missing Who/What-
       done openers, the last two patterns in the whole sweep with this
       gap.

       Verified live (bind-mounted container, both themes), `npm run build`
       gates green (page-shape, claims, link-check 8525 links, markup,
       calendar-grid, data-hooks, learning-path, components-used, boost,
       notes), stylelint clean, axe 90 pages x 2 widths zero violations.

       **Sweep totals across 5 batches, 19/19 patterns**: 2 real bugs found
       and fixed on the spot (record-detail's PO-ID mismatch, master-
       detail's Anatomy self-contradiction); 2 real framework bugs found,
       queued, and later landed via a dedicated Standardize sweep (58.3
       stepper clipping, 58.4 row-edit error-state desync); 1 capability-
       overclaim found by reading source rather than docs (wizard); every
       pattern's opener now states who uses it and what done looks like;
       6 patterns graded all-keep outright (staging, field-editor,
       invoice-list, object-page, validation-summary, value-help). Item
       closed — 58.1 is done.

       Accept, per screen: the skill's own contract — measured inputs
       (primary-action count, hierarchy scan, element census, state language,
       chrome ratio), the ten questions with evidence, a verdict per element,
       report in `.roundtable/`, actionables triaged with Accept criteria.
       **"All keep" is a valid verdict** and is recorded — the 19/19
       primary-action baseline predicts several clean passes. Removals are
       bounded by cost-to-remove (45.5); anything already published waits for
       the deprecation path.

       One batch per wake at most — a grill that shares a wake with build work
       gets rushed, and rushed verdicts are taste, not evidence.

2. [x] **58.3 — Standardize the `stepper` component's label-clipping gap at
       mid-range container widths.** — landed 2026-08-20 (Slice 65). Found
       during 58.1 batch 2's `approval`
       grill: at a `.bo-stepper` container width of 558px (above the
       component's own 480px/30rem "hide labels" threshold), two of four
       step labels still overflow by 2-4px and get ellipsis-truncated,
       including the CURRENT step's own label. Measured directly
       (`scrollWidth`/`clientWidth`), not eyeballed. Accept: every existing
       `.bo-stepper` call site checked at its own container width, the
       528-568px band specifically since that's where this was measured;
       the fix doesn't regress the existing 480px hide-labels tier; verified
       live, both themes.

3. [x] **58.4 — `initRowEdit()`'s Cancel clears `data-row-state` without
       checking for a surviving `aria-invalid` cell.** — landed 2026-08-20
       (Slice 65). Found during 58.1
       batch 3's `editable-grid` grill, by operating the live demo, not
       reading source: a row with a still-invalid cell restores to its
       ORIGINAL (still-invalid) value on Cancel, yet loses its row-level
       error/dirty tint entirely — measured via direct DOM read after the
       click: `{rowState: null, qtyValue: "450", ariaInvalid: "true",
       messageStillThere: true}`. The cell-level signal (border + message)
       survives; the row-level one (the "two channels" the States tables of
       three patterns — `editable-grid`, `field-editor`, `detail-form` — all
       promise) does not. Accept: `setDirty(false)` (or its caller) checks
       the row for any remaining `[aria-invalid="true"]` cell before
       clearing `data-row-state`, restoring `"error"` instead of `null` when
       one exists; a small reproduction (invalid cell → edit → Cancel) added
       as a behavior test; verified live that the row-level tint survives
       Cancel exactly when the underlying error does. Not a same-wake patch
       — `row-edit.ts` is composed by `editable-grid`, `field-editor`, and
       `detail-form`'s own line-items table, so the fix needs the same
       multi-call-site verification 58.3 requires.

## Slice 60 — Standardize sweep: one gate hand-rolled its own exit contract (2026-08-19)

Dispatched by the counter at 4/4.

1. [x] **60.1 — `check-data-hooks.mjs` (56.1) hand-rolled collect/print/exit
       instead of using `gate-report.mjs`.** That module exists specifically to
       stop two copies of this contract drifting — its own docstring: "one
       moved to `process.exitCode`, one left on `process.exit`, or a future
       third gate copies whichever it happened to find." A fourth gate landing
       with its own copy, one wake after the module's own warning, was worth
       fixing immediately rather than letting a second drift point form.

       Converted to `gate()` + `assertScanned()`. Per-hook-per-page checks (680
       of them) replace the old per-tag scan, which is a more honest coverage
       number than "89 pages" — it says how many (attribute, page) pairs were
       actually verified. Re-red-proved on the same historical bug
       (`data-dialog-close`) after conversion: still names the hook and the
       page, still fails the build.

2. [x] **60.2 — Reviewed, not converted: `check-layout`, `check-pseudo-locale`,
       `check-target-size`.** All three `process.exit(1)` outside
       `gate-report.mjs`, but each collects HETEROGENEOUS finding shapes
       (overflow / spacing / underline in one array, custom-formatted per
       kind) rather than uniform `check(claim, pass)` pairs. Converting is a
       bigger, riskier refactor than one round warrants — recorded so the next
       sweep does not re-flag them as unexamined.

**Exit:** clean re-scan on every established axis (inline flex/grid, raw
spacing, hardcoded hex, path re-derivation, shell-class-in-code) plus the new
one this round found (gate exit-contract duplication).

## Slice 56 — from the Objective grill, Slices 52-55 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices52-55-2026-08-19.md`.

1. [x] **56.1 — Gate that every `data-*` hook in the docs is one the framework
       documents.** — landed 2026-08-19 `data-dialog-close` was invented in Slice 31, extended in
       45.2 and removed in 53.1 — a hook `initDialogs` never implemented and
       `api.json` never listed, leaving **three dead buttons** in a shipped
       pattern for over a day.

       **What it survived is the point.** 46.2 built `check:components-used`
       for exactly this defect class — documentation disagreeing with its own
       demo — and missed it, because that gate compares *components listed*
       against *components rendered*, and never asks whether what is rendered
       **works**. The drawer also had a claim, and the claim tested **Escape**,
       so it passed throughout: **a claim that exercises the adjacent path is
       worse than no claim**, because it converts an untested control into an
       apparently tested one.

       Accept: a gate collects every `data-[a-z-]+` attribute used in built docs
       markup and fails on any not present in `api.json`'s `dataAttrs` or
       `behaviors.json`'s hooks. Allow an explicit, commented exception list for
       demo-local hooks (`data-vh-pick`, `data-anchor-collapse` and similar) —
       the list is the point, since adding to it is a decision someone makes.
       Red-prove by re-introducing `data-dialog-close`. `@exact`.

       **Landed 2026-08-19.** `check:data-hooks`, wired into the build: 51
       documented hooks, 16 commented exceptions (docs chrome + demo-local
       wiring), `data-astro-*`/`data-pagefind-*` exempt by prefix. Red-proved by
       re-introducing `data-dialog-close` into the built page — it names the
       hook and the page.

       **The gate's own first enumeration was wrong, and the error designed the
       gate.** Matching `\s(data-…)` over raw HTML reported a phantom
       `data-table` hook on 7 pages — 116 matches, all PROSE ("the data-table
       component" has whitespace before `data-`). Attributes are extracted from
       within tag bounds only; escaped markup in code samples is text and never
       matches. The 46.1 base rate, holding on the instrument built in its name.

2. [x] **56.2 — Write the removal-assertion rule into CLAUDE.md.** — landed 2026-08-19 Three edits
       in one session asserted `'string' not in source` while the explanatory
       comment written by that same edit contained the string — the `paths.mjs`
       guard (49), the shell class in `anchor-nav` (50), and
       `data-dialog-close` (53.1). One of them wrote an import into a template
       literal that would have shipped in a user-facing artifact.

       Accept: one short rule — **when verifying a removal, assert on the parsed
       or structural form (the attribute, the identifier, the code with comments
       stripped), never on raw text**, because the prose explaining a removal
       legitimately names the thing removed. Keep it to a few lines; CLAUDE.md
       is already long.

3. [x] **56.3 — Recorded, no action: the surface went DOWN for the first time**
       (191 → 189), and the mechanism is worth remembering more than the number:
       removal cost was **zero only because 0.2.0 has not published**. Free
       removals are perishable.

4. [x] **56.4 — Recorded, no action: four of six defects this window were the
       loop's own recent work**, all caught before any release, two by
       instruments rather than review. Healthy, with H3 as the exception that
       produced 56.1.

## Slice 55 — Standardize sweep: two decisions that had each been written twice (2026-08-19)

Dispatched by the counter at 4/4. Multi-round; exit is a clean re-scan.

1. [x] **55.1 — The month date-maths, extracted.** `/components/calendar` and
       `/patterns/detail-form` each generated a month, and they had already
       started to diverge — the same offset spelled two ways:

       ```
       (first.getUTCDay() - weekStart + 7) % 7      // calendar
       (first.getUTCDay() + 6) % 7                  // detail-form
       ```

       Those agree **only while `weekStart` is Monday**. The second is the first
       with the setting folded in and forgotten, which is exactly how a
       Sunday-first grid would come out silently wrong — the failure 54.2 had
       just built a gate for.

       Now `apps/docs/src/lib/month-grid.ts`. Only the DATE MATHS is shared; the
       cells stay in the pages, because they genuinely differ (plain spans vs
       disabled submit buttons carrying a delivery date). UTC throughout, with
       the reason recorded: `new Date(2026, 8, 1)` is local time, and west of UTC
       `toISOString()` then reports the previous day — a calendar correct in
       London and off by one in New York.

       Verified against the rendered artefact, not the diff: the delivery grid
       still renders 30 buttons + 5 outside cells, 9 disabled, same selected and
       holiday dates as before the change, and `check:calendar-grid` still reads
       285 cells across 8 calendars.

2. [x] **55.2 — "What this page actually renders", extracted.**
       `check-components-used` and `component-scores` each spelled out the same
       two-part decision: start at the first `<section class="demo">`, and strip
       `<pre>`. Both halves have been got wrong before — a whole-page count
       reported `offcanvas` in 17 of 17 screens when the true figure is 1
       (the shell's own mobile nav is a `.bo-offcanvas`), and counting code
       samples would let a page claim any component by printing it.

       Now `demoRegion()` in `dist-pages.mjs`. Output-neutral, checked row by
       row: `sidebar-nav` still scores `—` rather than 0, `offcanvas` still 1
       rather than 17.

       **`check-learning-path` deliberately keeps its own** and says so: that
       gate judges whether a result appears before code, so it needs the region
       WITH the `<pre>` blocks in place. Recorded so the next sweep does not
       "finish the job".

3. [x] **55.3 — A build-tooling trap worth writing down.** An `import` placed
       after other statements in Astro frontmatter fails the build with
       `Unexpected ")"` pointing at a **blank line** — the position is
       meaningless. Imports go with the other imports. Cost two rebuilds to
       localise because the error location is a lie.

**Exit:** clean re-scan — date maths in one file, demo-region extraction in one
file, 0 inline flex/grid, 0 raw spacing, 0 hardcoded hex in live markup, and no
script deriving a path `paths.mjs` exports.

## Slice 54 — P0 + wishlist from the owner (2026-08-19)

1. [x] **54.1 — P0 (owner report + screenshot): scrolled content showed through
       above the sidebar search field.** — fixed 2026-08-19

       **Cause, measured:** `.docs-searchbtn-wrap` is `position: sticky` with
       `inset-block-start: 0`, and **that sticks to the PADDING box, not the
       scrollport.** The rail carries `padding-block-start: 8px`, so an 8px strip
       sat above the stuck field with scrolled links passing visibly through it.
       Measured before: scrollport top 53, sticky top 61, 4 sample points in the
       strip painting non-field content.

       **A first fix did not work and the measurement said so.** Pulling the box
       up with a negative `margin-block-start` changes where it sits in flow but
       not where it sticks — when stuck, `inset-block-start: 0` still pins to the
       padding edge. The gap stayed at exactly 8px. The offset itself has to be
       negative: `inset-block-start: calc(-1 * var(--bo-space-2))`, with the
       padding added back so the field keeps its spacing.

       After: sticky top 53 = scrollport top, gap 0, **zero** painted points in
       the strip. Claim 78 asserts it at both widths and is red-proved by
       restoring `inset-block-start: 0` — which reproduces the report exactly
       (gap 8, 4 leaked points).

       Docs-only: the sticky element is a docs class. The framework's rail
       padding is correct; the docs' use of it was not.

2. [x] **54.2 — Calendar: Sunday-first as well as Monday-first.** — landed 2026-08-19
       The shipped calendar hard-codes a Monday-first grid (`Mo Tu We Th Fr Sa
       Su` in the `thead`, and `/patterns/detail-form` generates its month the
       same way). Monday-first is ISO-8601 and correct for most of Europe and
       Asia; **Sunday-first is standard in the US, Canada, Japan, and much of
       Latin America** — an ERP shipped to a US buyer with a Monday-first
       delivery calendar is simply wrong for them.

       Accept: week start is a setting, not a fork — one component, many
       settings. Prefer a `data-*` attribute on `.bo-calendar` over a second
       component or a modifier class per start day. The **header row and the
       day cells must move together** — a grid whose header says Sunday while
       the cells start Monday is off by one for every date, and it is silent.
       An executable claim asserts, for both settings, that each day cell's
       `datetime` falls under the correct weekday column. Verified at 1440 and
       390, both themes.

       Note the docs' own generator in `detail-form` builds a Monday-first grid
       in frontmatter; it must follow the same setting or the two disagree.

       **Landed 2026-08-19, and the answer was to REFUSE the setting.** The
       component needed no change: its CSS contains **no positional rule** — no
       `nth-child`, and "closed" is a per-cell attribute the consumer sets, not
       a column. A `data-week-start` attribute would style nothing, and would be
       public API we could never remove. Week start decides which DATE sits in
       which cell, which happens where the month is generated.

       What shipped instead: `/components/calendar` now demonstrates both, from
       **one generator**, and states the rule and the reason. `detail-form`
       states which convention its own grid uses and why.

       **The real deliverable is `check:calendar-grid`, wired into the build.**
       It reads every cell's `datetime` back and compares it against the column
       heading above it — 285 dated cells across 8 calendars. This class of
       error is invisible: the grid still looks like a calendar, the styling is
       right, every other gate passes, and a reader copying it ships a screen
       that puts Tuesday's delivery under Monday. Same shape as the `LINE-1`
       row-label bug in CLAUDE.md.

       Red-proved twice — once by rewriting a single cell's date (it names that
       cell), and once by injecting an off-by-one into the generator's week-start
       maths, which turns the **build** red across a whole month. The existing
       hand-written months were checked by it and were correct: 0 misplaced.

3. [x] **54.3 — Grill Amount & Quantity: display vs input.** — landed 2026-08-19
       Both are "Values" components and both currently document a **display**
       form, with entry deferred to native inputs (`.bo-amount` has no
       `--input`; `.bo-date` said the same before it was deprecated). But
       `.bo-quantity` DOES ship an input (`.bo-quantity__input` with steppers),
       and `.bo-money` ships a currency select plus an amount input. So the
       family is inconsistent: three components, three different answers to
       "does this handle entry?".

       Accept: grill them on the NEED/COST rubric (Slice 53) and answer one
       question explicitly — **what is the framework's rule for value entry?**
       Either every value type gets a documented native-input recipe and no
       component, or the ones with real entry affordances (stepper, currency
       pairing) are the rule and Amount is the exception that needs one.
       Whatever the answer, it goes on all three pages in the same words.
       Refusing to add an Amount input is a valid outcome and must be recorded
       with the reason.

       **Landed 2026-08-19.** Report:
       `.roundtable/grill-values-family-2026-08-19.md`.

       **The premise in this item was wrong, and that is worth recording.** It
       said "three components, three different answers to *does this handle
       entry?*". Reading the pages instead of the class lists, the rule already
       existed and each page already stated it: Money says "the read-only
       counterpart is Amount"; Quantity says "a count field, not a currency one
       — see Amount for money"; and they cross-link both ways. There was no
       inconsistency to fix.

       **The real defect was two ways to display a count.**
       `.bo-quantity--display` existed to display a count and **zero screens
       used it** — every screen that shows one uses `.bo-amount` + `__unit`. Its
       own source comment named the motive: "closing the asymmetry with Amount".
       That is a symmetry argument, not a demand argument. Meanwhile the docs
       recommended it, so documentation and practice disagreed — the 46.2 defect
       class. Scored **NET −3**.

       **Removed outright rather than deprecated, because cost-to-remove was
       genuinely 0 and only briefly.** Verified two ways: `npm view` reports
       only `0.1.0, 0.1.1` published, and the class is absent from `v0.1.1` —
       it lived only in the tagged-but-unpublished `v0.2.0`. No consumer can
       have it. **The moment 0.2.0 reaches the registry this becomes a
       next-major job**, so the free window was now.

       **The Amount input was refused**, as the Accept allowed: the editable
       counterpart already exists and is called Money. Adding `.bo-amount--input`
       would be a second way to do one thing — exactly what this grill removed.

       The rule is now on Amount, Money and Quantity in the same words.

## Slice 53 — Owner input: grill components on need vs cost (2026-08-19)

Owner ask, twice: *grill each component on why we should and should not have it
— ease of work, simplicity, performance — benchmark the score to decide what to
do next. Also find what ERP needs that we do not ship.*

Instrument + scores: `.roundtable/component-need-cost-rubric-2026-08-19.md`.
Measured half is re-runnable: `node apps/docs/scripts/component-scores.mjs`.

**Why the old rubric had to change.** Slice 37 scored what a component is
*worth* (Demand / Composition / Contracts / Evidence) and never stated the case
*against* keeping it. **A score that only measures value can only ever say
"keep".** The new one is symmetric — NEED (demand, correctness absorbed, effort
saved, consistency) minus COST (already composable, payload bytes, runtime,
surface) — 4 axes each, so neither side can outweigh the other by construction.

It reproduced 45.3's independent decision to deprecate `.bo-date` (NET −3) and
the controls land +3/+4, so it discriminates.

1. [x] **53.1 — Build the Value-help (F4) pattern.** — landed 2026-08-19. The benchmark's own answer to
       "what next".** A searchable dialog for picking one master-data record out
       of thousands — the single most-used interaction in ERP data entry.
       `combobox` handles a short list; picking a material from 40,000 needs
       search + filters + a table + paging.

       **Zero new components**: `dialog` + `filters` + `data-table` +
       `pagination` all ship. Building it as a component would be the largest,
       most specific thing in the framework — refuse that.

       It is also the highest-leverage docs work available: **one pattern moves
       six components off "keep, watch"** by giving `dialog`, `filters`,
       `pagination`, `combobox`, `state` and `skeleton` the screen demand they
       currently lack. Accept: full pattern recipe; zero new CSS or a recorded
       reason; executable claims for search-filter-select and for focus return
       to the field that opened it.

       **Landed 2026-08-19.** `/patterns/value-help` ships with the full recipe.
       **Zero new components and zero new CSS** — dialog, filter bar, data table,
       state and pagination, exactly as the benchmark predicted.

       Three claims: searching narrows the results and the count follows;
       filtering to nothing shows the **filtered** empty (a different message
       from "no data exists") with the table hidden rather than a bare header
       row; and picking fills the field, closes the dialog and puts focus back
       **in the field**.

       **Building it exposed an invented attribute — older than first credited.**
       `git log -S` puts its introduction in **Slice 31 (2026-08-18)** with two
       dead buttons (Cancel, Save); 45.2 added the third (the drawer ×); 53.1
       removed all three. The commit message for 53.1 credits 45.2 alone and is
       wrong about that. `data-dialog-close` is an attribute this project
       invented: `initDialogs` implements opening, Escape, backdrop
       dismiss and the focus trap, and **nothing else**, and the documented API
       is `data-dialog-trigger` / `data-dismissible` / `data-state`. So
       `/patterns/master-detail`'s drawer had **three dead buttons** — ×, Cancel
       and Save — from the day it shipped. Its claim tested Escape, which is
       exactly why nobody noticed.

       The fix is the native mechanism the docs' own app shell was already
       using: `<form method="dialog">`. Claim 82 clicks the button, and is
       red-proved by putting the dead hook back.

       **Focus does not return by itself.** Closing a modal from a click inside
       it leaves focus on `<body>` — measured, twice: once when the invented hook
       failed, and again after switching to the native close. The pick path
       restores focus explicitly, and the claim asserts the FIELD rather than
       "not body", which would have passed on almost anything.

2. [x] **53.2 — Grill `icon`'s 12 variants. The only NET-negative live
       component.** Third-largest component at **4633 bytes with 25 classes** —
       bigger than `dashboard` — used by **one** screen. The axis to move is
       **surface, not demand**: do not put icons in more screens to justify 25
       classes. Accept: decide whether the variant list should be a documented
       convention rather than a shipped enum, with the bytes and class count
       re-measured after. Removal of any shipped class is bounded by 45.5.

       **Landed 2026-08-19, and one of my own earlier notes was wrong.** This
       item was queued with the claim that "any removal is free only until
       0.2.0 publishes" — checked before acting, and that was false for THIS
       component specifically: `git show v0.1.1` confirms all 12 glyph classes
       were already published. Unlike `.bo-quantity--display` (54.3), there
       was never a free-removal window here; the deprecation path (`.bo-date`,
       45.3) is the only one available, and that is what shipped.

       **Split 8 active / 4 deprecated, by measured pattern-screen demand.**
       `--doc`, `--invoice`, `--cart`, `--check-circle`, `--truck`, `--box`,
       `--chart`, `--grid` are rendered in `/patterns/app-launch`.
       `--settings`, `--barcode`, `--building`, `--user` render in zero pattern
       screens — only this component's own showcase used them. Deprecated in
       source with the same marker style as `.bo-date`, and in the docs page:
       a separate "Deprecated" section, visually distinct via the shipped
       `.bo-u-text-muted` utility (not an invented inline `opacity` — verified
       live that icons dim correctly, since the mask paints with
       `currentColor` and inherits the muted text color; measured contrast
       7.56:1, clear of both the 3:1 non-text and 4.5:1 text thresholds).

       **Bytes and class count are UNCHANGED — stated plainly, not hidden.**
       Deprecation doesn't remove shipped CSS; the 25-class, 4633-byte numbers
       from the original NET −1 score stand until the next major. What changed
       is that the docs no longer imply all 12 earned their place equally, and
       a CHANGELOG entry plus a named replacement exist for when removal
       becomes possible.

       **Found and fixed a real, already-shipped defect while reading the
       source for this item.** The docs page had `<section class="demo">
       <section class="demo">` — a stray duplicate opening tag, live in the
       built HTML this whole time, confirmed via `grep` on `dist/` before and
       after the fix. Unrelated to the grill; caught because the fix required
       reading the exact section this bug was inside.

3. [x] **53.3 — Queue Change/audit diff, the one component-shaped ERP gap.** — landed 2026-08-20
       Change documents are a legal requirement in ERP. `timeline` shows *that*
       something happened; nothing shows *what changed*. Genuinely new surface:
       old/new value pairs, add/remove/modify states, and two-channel without
       relying on red/green. Accept: score it on the NEED/COST rubric BEFORE
       building — it must clear NET ≥ +4 with citations, like anything else.

       **Scored first, per the Accept.** Full report:
       `.roundtable/grill-change-diff-2026-08-20.md`. Neither candidate
       reached NET ≥ +4, and that is stated rather than rounded up: a new
       `bo-change-diff` component scored **−2** (trivially composable, C1=3 —
       shipping it anyway would be pure surface over an already-solved
       problem, refused on the same Objective §2 test as object-page and
       value-help). A documented recipe with no real composition scored
       **+1** — short, because a recipe demonstrated nowhere is speculative
       (N1=0).

       **What actually shipped: the recipe, with a real composition, not a
       standalone demo.** `record-detail`'s own audit trail already had the
       right slot (`.bo-audit__detail`, `grid-column: 2`, accepts arbitrary
       content) and the right worked example — its own third entry, a
       partial receipt, is exactly a multi-field change with no structured
       expression. Its vague prose ("received 5 of 8 monitor arms") is now a
       real `.bo-data-table` (Field / Old / New / a badge reading
       Added/Removed/Modified) nested in that slot. **Zero new CSS, zero new
       classes** — `.bo-data-table`, `.bo-badge`, `.bo-u-tabular` all ship
       already. Two-channel by construction: the badge's TEXT carries the
       meaning, same rule as Amount's `--negative` and the calendar's
       `data-day="closed"`.

       Cross-referenced from `/concepts/review-anatomy`'s History row, which
       already existed and already named this exact region — stating plainly
       that this is a scored convention, not a shipped surface, and pointing
       at `record-detail` for the worked composition rather than duplicating
       it.

       Verified live at 1440/390, both themes — including a direct screenshot
       of the diff table at 390, not just an overflow-gate pass. Every gate
       green, axe 90 pages x 2 widths zero violations, 40 visual shots
       (unaffected — neither touched page is in the visual-regression
       matrix).

4. [x] **53.4 — Refused, with reasons recorded so they are not re-proposed.**
       Field-help tooltips (hover-only fails touch and keyboard; the accessible
       answer is `bo-form-field__hint`, which ships), toast/transient
       confirmations (`alert` + a live region already covers the accessible
       case), and kanban / org-chart / permission-matrix (each is one screen in
       one module, not a framework primitive — high surface, near-zero reuse).

5. [x] **53.5 — Recorded: `file-upload` and `tree-table` scored +4 on ZERO
       demand, and that is not a fault.** Both absorb genuinely hard correctness
       — drag-and-drop with a real file input, hierarchical rows with an
       expand/collapse contract. Their 0 is reading (b), *a screen we have not
       written*, not (a) *unneeded*. **Do not chase demand for them**; 53.1 is
       the screen that fixes this class of gap.

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

3. [ ] **52.3 — The name. OWNER CALL, with the trade-off measured.**
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

Full findings: `.roundtable/grill-objective-slices45-50-2026-08-19.md`.

1. [x] **51.1 — The loop's telemetry cannot see a refusal.** — landed 2026-08-19
       `ROADMAP.md` carries 41 mentions of refuse/Refuse; the loop log carries
       **zero** rows with outcome `refused`, across 49 iterations today. Not
       because nothing was refused — **Slice 48 refused a `bo-object-page`
       component** against the Objective's own accept/refuse/rethink test, and
       50.3 refused two consolidations with reasons recorded. Both landed under
       a different outcome, because the refusal happened *inside* an item that
       also shipped something.

       So a query against `loops.db` for "how often does this project refuse?"
       returns 0, and that is false. The outcome vocabulary was tightened in
       41.2 exactly so outcomes would be queryable; this is the same defect one
       level up, and it is the "a number you report is load-bearing" rule
       applied to the loop's own telemetry.

       Severity is capped by the storage doctrine: the refusals ARE recorded, in
       ROADMAP prose, which is the source of truth. Only the queryable mirror is
       blind.

       Accept: a refusal made inside a landed item is countable — either a
       second field on the iteration record, or a rule that a refusal gets its
       own row. Do NOT widen the six-outcome vocabulary to do it; that
       vocabulary is enforced by `check:loop-vocab` and 41.2 rejected "shipped"
       for being ambiguous. Whatever lands must be **rebuildable from the
       markdown**, per the storage doctrine, and `rebuild_from_log.py` must
       still reproduce the mirror. Red-prove it: a refusal recorded today must
       show up in a query that currently returns 0.

       **Landed 2026-08-19.** `record_iteration.py --also-refused "<text>"`
       (repeatable) inserts a SECOND row for a refusal decided inside the
       item — same timestamp and commit, `loop="Meta"`, `mode="refusal"`,
       `outcome="refused"`. The six-outcome vocabulary is untouched; `refused`
       already existed, this just gives it a place to attach when it isn't the
       item's own headline outcome.

       **`loop="Meta"`, not the parent item's loop, and that was deliberate.**
       Both dispatcher counters in `dispatch_status.py` sum rows where
       `loop=="Continue"`; recording the refusal under the same loop as its
       parent would have counted one round of work as two toward the
       Standardize/Objective thresholds — the identical silent-drift shape
       already found twice this project (SOURCE_SKIP_DIRS, the outcome
       vocabulary itself). Verified, not assumed: after a test insert with
       `--also-refused` twice, `loop='Continue'` rows for that item stayed at
       1 and `loop='Meta'` rows were 2.

       Rebuildable, per the storage doctrine: the extra row is an ordinary log
       line, parsed the same way as any other by `parse_log_line`; a full
       `rebuild_from_log.py` round-trip reproduced it exactly, and
       `dispatch_status.py`'s counters were unchanged before/after (1/4, 0/3).

       **Red-proved on the actual defect**, not a synthetic one: `SELECT
       COUNT(*) FROM iterations WHERE outcome='refused'` read 0 immediately
       before this item's own commit, and the refusal this fix itself made —
       widening the OUTCOMES vocabulary was ruled out by the item's own
       Accept, a second Meta row used instead — is what the query now returns.

2. [x] **51.2 — Flat surface + heavy verification: NO action, deliberately.**
       191 classes / 73 CSS files / 39 components, unchanged for four grills,
       measured identically at both commits. Effort ran ~10:1 instruments to
       framework (+857/−22 vs +82/−1 lines). That is the Objective working, not
       stalling — and inventing framework work to change a ratio would be the
       wrong response to a measurement. Recorded so the next grill does not
       re-open it as if it were new.

3. [x] **51.3 — npm still serves 0.1.1, verified from the registry.** Eighth
       consecutive grill. `npm view @busy-office/ui version` → `0.1.1`; local is
       `0.2.0`. The published package still contains the WCAG failure fixed in
       43.1. Owner-triggered; npm here is unauthenticated. **With the backlog
       otherwise empty of anything not owner-gated, this is the
       highest-value action available to the project, and the loop cannot do
       it.**

## Slice 50 — Standardize sweep: how pages carry layout, and one behaviour that knew too much (2026-08-19)

Dispatched by the counter at 4/4. Objective is ALSO overdue at 3/3, and rule 2
outranks rule 3 — it fires next wake.

1. [x] **50.1 — Two spellings for "page-layout CSS on a pattern page".**
       `/patterns/object-page` used a scoped `<style>` block;
       `/patterns/master-detail` used a **212-character** style attribute, the
       longest in the docs, with the reasoning buried in a JSX comment above
       markup a reader is meant to skim. Same decision, two spellings. The
       layout is now `.md-split` in a scoped block, and the reasoning lives with
       the rule it explains. Verified layout-neutral by measurement: identical
       columns, gap, padding, box size and child positions in all four contexts.

       **The other 16 long inline styles were deliberately left.** They are
       small per-element tweaks (60-145 chars), not page layout, and converting
       them would be exactly the bulk edit this repo has been burned by. The
       outlier was the finding; the rest is not drift.

2. [x] **50.2 — `initAnchorNav` was the only behaviour that knew a shell class
       name, and it was mine, from yesterday.** It listened on
       `.bo-app-shell__main` plus the window — so an object page scrolling
       inside anything else (a dialog, an offcanvas, a consumer's own layout)
       would silently stop updating. `initDropdowns` had already solved this the
       general way in 0.2.0: scroll does not bubble, but it DOES reach a
       **capture-phase** listener on `document` from any scrolling ancestor.

       Now `document.addEventListener('scroll', syncAll, true)`. Smaller, and
       strictly more general — the Objective's "small & general over specific",
       applied to code I had just written.

       **Proved both ways, in a container that is not the shell:**

       | listener setup | spy after scrolling | |
       |---|---|---|
       | capture (new) | `#general` → `#approvals` | follows |
       | shell + window (pre-sweep) | `#general` → `#general` | **dead** |

       The pre-sweep setup was injected back into the built page to get that
       second row, and the injection was confirmed present before the result was
       believed — a first attempt grepped a bundle that does not exist (Astro
       inlines this module into the page HTML) and produced a green-looking
       result that meant nothing.

3. [x] **50.3 — Left alone, with the reason recorded.** `dialog.ts` spells its
       install guard `delegationInstalled` where 17 others use `installed`; that
       is cosmetic and has no failure mode. `data-table`, `data-grid` and
       `saved-views` take `root: ParentNode = document` instead of a guard —
       a different contract (re-runnable per subtree after a swap), not drift.

**Exit:** clean scan — 0 inline flex/grid, 0 raw spacing and 0 hardcoded hex in
live markup; no behaviour naming a shell class in code; no script deriving a
path `paths.mjs` exports.

## Slice 48 — Owner input: the SAP Object Page floorplan (2026-08-19)

Raised by the owner mid-wake: *"do you know SAP object page?"* Triaged here
rather than built — the ask is a **new floorplan**, which is a scope decision,
not a wake-sized item. Queued with the decision logged rather than waited on
(LOOPS.md: a loop never stalls on a human call).

**What it is.** The Fiori-elements detail floorplan for a single business
object, and the canonical ERP screen — the "detail" half of the list-report →
object-page pair. Anatomy: a sticky **object header** (title, subtitle, key
facts/KPIs, status, global actions), an **anchor bar** of section links that
scroll-spies as the reader moves, stacked **sections/facets** of forms, tables
and charts, and a **footer action bar** carrying the primary action and draft
state.

**What we ship against it — measured across all 39 components, not assumed:**

| region | have it? | from |
|---|---|---|
| sections / facets | yes | `.bo-widget`, `.bo-form-section` |
| key facts strip | yes | `.bo-kv`, `.bo-chip`, `.bo-badge` |
| in-page section switching | partial | `.bo-tabs--vertical` — tabs, not scroll-spy |
| multi-step / draft | partial | `.bo-stepper` |
| **sticky object header** | **no** | — |
| **anchor bar with scroll-spy** | **no** | — |
| ~~page-level footer action bar~~ | **YES — I was wrong** | `.bo-form-actions` (see 48.1) |

`position: sticky` appears in exactly two shipped files (`data-table` headers,
`form-section`), so the sticky-region work is genuinely absent rather than
merely unnamed.

**The Objective test, before any CSS is written.** Most of this floorplan is
composable from what ships; the honest gap is **two** primitives.

- **Refuse** a `bo-object-page` component. A floorplan is a PATTERN — a screen
  assembled from primitives — and shipping it as a component would be the
  largest, most specific thing in the framework, straight against the Objective.
- **Accept** at most two new primitives, and only where a pattern page proves
  each is not composable: an anchor/section nav that scroll-spies, and a
  page-level action bar. Both are general — any long detail screen wants them —
  rather than SAP-specific.
- **Rethink** if the anchor bar turns out to be `.bo-tabs--vertical` plus
  scroll-spy behaviour, which is the likely answer. Then it is a BEHAVIOR on an
  existing component, not a new component, and the slice shrinks accordingly.

**Accept:** `/patterns/object-page` exists and follows the pattern recipe in
full (opener / live screen / anatomy / data contract / states / components used
+ complexity). It is composed from shipped primitives wherever possible, and
every genuinely new primitive carries a recorded reason why composition failed.
The scroll-spy and any sticky behaviour are asserted by executable claims — "the
anchor bar follows the reader" is exactly the runtime prose CLAUDE.md requires
to be executable, and it fails silently (the page still renders and scrolls).
Verified at 1440 and 390, both themes.

**OWNER CALL LOGGED, not blocking:** is the target the whole floorplan, or one
*piece* of it — most likely the anchor bar? The cheap version is the anchor bar
on the existing `/patterns/record-detail`; the expensive version is the full
screen. Defaulting to **neither until answered**: this stays queued behind the
open 45.x items rather than jumping the queue on the strength of a question.

---

**SPIKED 2026-08-19 (Explore, rule 6 — backlog empty). The scope question
dissolves.** Full report: `.roundtable/explore-object-page-2026-08-19.md`.
Isolated worktree, nothing merged.

**The cheap version IS the whole thing.** The floorplan composes from shipped
primitives with **zero new CSS**; the only new thing is one ~20-line scroll-spy
behavior. Verified live at 1440 and 390 in both themes: correct section on load,
correct after a jump, no overlap, zero page overflow.

1. [x] **48.1 — My gap table above was wrong: `.bo-form-actions` already IS the
       sticky page-level action bar.** It is `position: sticky`,
       `inset-block-end: 0`, print-suppressed, and sets
       `scroll-padding-block-end: 6rem` so focus never lands under it.
       `detail-form`'s own anatomy names it; I wrote "no" from an impression and
       one grep would have shown otherwise. The row is struck through above.
       Accept: no work — recorded so the next reader does not inherit the error.

2. [x] **48.2 — Build `/patterns/object-page` from primitives + `initAnchorNav()`.**
       The anchor bar is `.bo-sidebar-nav` **unmodified** — it already styles
       `[aria-current="page"]`, which is exactly the active marker. The object
       header is `.bo-widget` + `.bo-kv` + `.bo-badge` + `.bo-amount` inside one
       sticky wrapper.

       **The predicted "rethink" was right about the shape and wrong about the
       reason.** It is a behavior, not a component — but it is NOT
       `.bo-tabs--vertical`: tabs HIDE the panels they are not showing, and an
       object page is one continuous scroll where every section stays present.

       Accept: full pattern recipe (opener / screen / anatomy / data contract /
       states / components used + complexity); zero new CSS or a recorded reason
       why composition failed; `initAnchorNav()` documented like every other
       behavior; executable claims for the spy AND the sticky stack, red-proved.
       Verified at 1440 and 390, both themes.

       **Landed 2026-08-19.** `/patterns/object-page` ships with the full recipe.
       `initAnchorNav()` is a real behavior in core (initCount 21 → 22), exported
       from `@busy-office/ui/js` and registered in `behaviors.json`.

       **Framework CSS added: none.** The page carries four page-level layout
       declarations and nothing else — the sticky wrapper, the one-line
       scrollable bar, and `scroll-margin-block-start` on the sections.

       Seven claims, 65 → 72, each red-proved against the real bug:
       - the bar follows the reader (breaks when the wrapper goes static),
       - header and bar stay **stuck AND stacked**,
       - labels stay inside their fixed-height control,
       - print drops the action bar and keeps every section.

       **One claim could not fail and was rewritten.** The first stack assertion
       was `nav.top >= header.bottom`, which is true in ordinary document flow —
       a static wrapper passed it. It now also requires the header to still be
       on screen near the top, which fails BOTH ways it can break: chrome
       scrolling away, and two stickies pinned to the same offset.

       **And one red-proof took three attempts, which was the useful part.**
       Removing `flex-wrap: nowrap` did NOT reproduce the spill — with wrapping
       allowed the items move to a second line and each keeps its natural width,
       so no text wraps. `.bo-pagination` is `display: flex` with no
       `flex-wrap`, so its default nowrap is what makes items SHRINK and the
       text wrap inside a fixed-height control. The injection that reproduces it
       removes `overflow-x` and `white-space: nowrap` while LEAVING the default
       — and it goes red at 390 only, which is correct.

3. [x] **48.3 — Two findings the build item must not re-derive.** — applied
       (a) **Two sticky regions collide.** Header and bar each at
       `inset-block-start: 0` both pin to the SAME offset — measured 77px at
       1440, 181px at 390, overlapping in all four contexts. One sticky WRAPPER
       around both, not two sticky elements. Invisible until measured.
       (b) **`IntersectionObserver` + `rootMargin` is the wrong spy.** It worked
       at 1440 and marked the WRONG section at 390, with nothing current on load
       at any width — the margins guess at viewport shape. Measuring against the
       bar's own bottom edge is viewport-independent and was correct in all four.

4. [x] **48.4 — RESOLVED 2026-08-19: horizontal, one line, scrollable.**
       `.bo-sidebar-nav` is a *sidebar*, so used as an anchor bar it stacks
       vertically; the Fiori idiom is horizontal. A horizontal bar means
       `.bo-cluster` + links, which loses the `[aria-current="page"]` styling
       sidebar-nav gives for free. Deliberately unresolved — the spike stopped
       rather than guessing. Accept: decide with a rendered comparison, not in
       prose.

       **Decided by rendering four variants at 1440 and 390, both themes.**

       | variant | verdict |
       |---|---|
       | A — vertical `.bo-sidebar-nav` | **148px of links at every width.** At 390, with the ~181px sticky header, that is over 40% of the viewport before any content. |
       | B — horizontal `.bo-pagination`, wrapping | **Labels spill their own box.** `.bo-pagination__btn` takes `--bo-density-control-height`, a FIXED 36px; a two-line label renders 38px of text inside it. Measured 2px of spill on two of four links at 390. |
       | C — `.bo-cluster` + `.bo-chip` | **Rejected on measurement.** The `aria-current` chip is byte-identical to a plain one — `rgb(243,244,246)`, weight 400 — in BOTH themes. No active styling ships, so it fails two-channel without new CSS. |
       | **D — horizontal `.bo-pagination`, one line + `overflow-x: auto`** | **Chosen.** 36px at both widths, zero spill, and `[aria-current="page"]` already gives weight 600 plus accent colour, correct in both themes. |

       Cost of D: three page-level declarations (`flex-wrap: nowrap`,
       `overflow-x: auto`, `white-space: nowrap` on the links). **No framework
       CSS and no widened API.** It also becomes a scrollable region, so it takes
       `tabindex="0"` — the same rule `.bo-data-table-container` follows.

       **B is the finding worth keeping.** Its failure is invisible to a height
       measurement: the control's height is fixed by the density token, so a
       wrapped label cannot grow its box and spills instead. Every per-button
       height read 36px while the render was visibly broken. Only the TEXT box
       against the BUTTON box showed it — CLAUDE.md's "measure the box that
       carries the constraint", in a new shape.

## Slice 47 — Standardize sweep: the widths we verify at (2026-08-19)

1. [x] **47.1 — `[1440, 390]` was one decision stored five times.** — landed
       axe-audit, visual-regression, check-po-app, check-pseudo-locale and one
       sweep in check-claims each hand-copied the pair, and the REASON for it
       was written down in only one of them. Same shape as `paths.mjs` and
       `SOURCE_SKIP_DIRS`: silent drift, because nothing compares the five.
       Now `scripts/viewports.mjs` — `WIDTHS`, plus `DESKTOP_WIDTH` for the
       three gates that set a desktop viewport and never sweep (a different
       decision, kept separate deliberately).

       Verified by PERTURBATION rather than by reading the diff: setting
       `NARROW_WIDTH = 377` renamed 20 visual shots, which proves the constant
       actually drives the gates instead of sitting unused.

2. [x] **47.2 — that perturbation exposed a gate that could not fail.** — landed
       `visual-regression` treated a MISSING baseline as `update || !exists` —
       it wrote the shot and counted it as ok. Every shot name encodes page,
       theme and width, so any drift in a name silently re-baselined the whole
       matrix and still printed "visual regression passed". The 377 probe wrote
       20 baselines into the repo and reported 40 shots checked, passing.

       The file already refused to baseline an HTTP error page for exactly this
       reason ("a stale dist baselined 404s"); the missing-baseline case had the
       same shape and no guard. A new shot is now a failure with instructions,
       accepted deliberately via `--update`.

       Red-proved: the identical perturbation now yields 20 loud failures and
       writes zero baselines, while the real matrix stays green.

       **This is the fourth instrument-that-cannot-fail found by 46.1's rule,
       and the first found by perturbing a constant rather than injecting CSS.**
       Worth keeping as a technique: change an input the gate depends on and
       confirm the OUTPUT changes.

## Slice 46 — from the Objective grill, Slices 37/38/44 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices37-38-44-2026-08-19.md`.

1. [x] **46.1 — A first-draft instrument is wrong. Design around the base rate.**
       Six new or reworked instruments in this window; **zero correct on first
       run** — and a seventh went wrong while writing the grill that counted
       them. Two previous grills recorded this as a discipline problem and
       changed nothing. Three grills of evidence say it is a **base rate**, not
       a lapse.

       All six were caught before landing, by three moves that already exist:
       red-proof with a **verified** injection, share one implementation between
       gate and test, and treat an implausible number as an instrument defect.
       What is missing is stating the assumption they follow from.

       Accept: CLAUDE.md says plainly that an instrument's **first output is not
       evidence** — the adversarial check runs *before* the number is used, not
       after it looks wrong. Concrete and short: what would make this wrong, try
       that first; a 0%, a 100%, or an identical value across many inputs is a
       defect until proven otherwise; reconcile against something independent
       before quoting. No new gate — this is the rule the existing gates already
       imply.

       **Landed 2026-08-19** in CLAUDE.md, above the load-bearing-number rule it
       generalises. Four tests, each traced to an instrument that actually died:
       ask what would make it wrong and try that first; treat 0%, 100% or an
       identical value across many inputs as a defect until proven otherwise;
       reconcile against something independent before quoting; and **derive names
       from the generated source rather than a convention** — page slugs are not
       class names (`alerts` → `bo-alert`, `button` → `bo-btn`, `dashboard` →
       `bo-widget`), which is exactly what made the prose-drift measurement wrong
       twice.

2. [x] **46.2 — 11 of 16 pattern pages claim components they never render.**
       "Components used" carries a complexity badge and reads as *this screen is
       built from these*. On 11 pages it lists components — 20 in total —
       that the page never renders: `invoice-list` claims `pagination`,
       `master-detail` claims `offcanvas`, `settings-admin` claims `dialog`, and
       so on. Every existing gate passes, because each page is individually
       valid; the defect is **documentation disagreeing with its own demo**.

       Accept: each of the 20 is resolved one of two ways — the screen renders
       it (which is 45.2's job for `pagination` and `offcanvas`), or the claim
       comes off the list. Where a pattern legitimately references a component
       in its **data contract** without demoing it, say so in the row rather
       than silently listing it. Then a gate: a component listed under
       "Components used" must appear in the page's rendered markup, matched via
       `api.json` blocks — **not** the page slug, which is what made this
       measurement wrong twice (`alerts`→`bo-alert`, `button`→`bo-btn`,
       `dashboard`→`bo-widget`). Red-proved both ways.

       **Landed 2026-08-19.** **18 unrendered claims removed** across 10 pages,
       so the docs stop overstating themselves today rather than after the
       screens are built. `check:components-used` now enforces it: a component
       listed under "Components used" must appear in the page's rendered markup.
       Red-proved by re-adding `pagination` to `invoice-list` and watching the
       gate name it.

       **The measurement was wrong three times before it was right** — the base
       rate 46.1 had just been written about, demonstrated immediately:
       - **43 claims** — counted every `/components/` link, including Related
         footers and prose asides.
       - **16 of 16 pages** — a 100% rate, which 46.1 says to distrust: it used
         the page SLUG as the class name, so `alerts`→`bo-alert`,
         `button`→`bo-btn`, `dashboard`→`bo-widget` all read as missing.
       - **20 claims** — matched exact blocks only, so `filter-panel` rendering
         `.bo-dropdown__menu` counted as not rendering `dropdown`.
       - **18** — blocks *and* their parts, names from `api.json`. Believed only
         after it independently reproduced the two pages the 37.2 pilot had found
         by hand, and after four rows were verified by direct grep.

       `pagination` and `offcanvas` stay off the lists until **45.2** renders
       them; the gate makes that ordering enforceable rather than remembered.

## Slice 45 — surface review, batch 1 outcomes (2026-08-19)

Scores and citations: `.roundtable/surface-scores-batch1-2026-08-19.md`.
Ran as a **pilot** because 37.2 is gated on rubric sign-off that has not come —
nine rows risked instead of fifty-five.

1. [x] **45.1 — Three shipped JS behaviors have no executable claim.**
       `tree` and `tree-table` ship expand/collapse behavior asserted in **prose
       only**; the review's Evidence column found it on its first batch. This is
       the cheapest gap in the framework: the behavior exists, the contract is
       documented, and nothing executes it.

       Accept: a claim per behavior driving REAL events (the 35.1 lesson — a tab
       demo can look right and work exactly once), each red-proved by breaking
       the behavior. `data-tree-level` rendering is already static-checked, so
       the claims cover the INTERACTION: expanding reveals children, collapsing
       hides them, and the control's `aria-expanded` follows.

       **Landed 2026-08-19 — and this item's own number was wrong.** Measured:
       **only 5 of 21 behaviors have any claim coverage**, so sixteen ship with
       none, not three. `tree` was wrong too — it has no behavior at all, it is
       CSS-only; `initTreeTable` is the one that exists.

       Three claims added (41 → 44), each driving REAL clicks and each
       red-proved by breaking the behavior in source with the injection verified
       in `dist`:
       - **tree-table** — collapsing hides its children and flips
         `aria-expanded`. Broken (`hidden = false`): 4 rows before and after.
       - **quantity** — the stepper steps and will not pass its own `min`.
         Broken (`step = 0`): the value never moves.
       - **alert** — dismiss removes exactly one alert.

       **The alerts page claimed dismissal it never demonstrated:** it said
       "dismiss buttons work via `initAlerts()`" while rendering **no dismiss
       button anywhere**. A live dismissible alert was added, so the sentence is
       demonstrable as well as asserted.

       **Two injection errors while red-proving**, both caught by checking `dist`
       rather than the diff: the first quantity patch hit `syncButtons`' copy of
       the step lookup instead of the click handler's, and the alerts claim
       pointed at `/components/alert/` when the slug is `alerts`.

6. [x] **45.6 — Sixteen behaviors still ship with no executable claim.** — CLOSED 2026-08-19
       The corrected figure from 45.1: 5 of 21 covered. Uncovered include
       `combobox`, `data-grid`, `wizard`, `saved-views`, `scan-input`,
       `tag-input`, `file-dropzone`, `load-more`, `money-field`, `table-sum`,
       `table-toolbar`, `collapsible-card`, `validation-summary`.

       Accept: claims in batches, each driving real events and each red-proved
       with the injection verified in `dist` — the two ways it went wrong in
       45.1. Where a behavior has **no live demo to drive**, that is the finding:
       add the demo first, as the alerts page needed. Prioritise the ones whose
       failure is silent.

       **Batch 1 landed 2026-08-19 — 7 claims, 48 -> 55.** Chosen by HOW they
       fail, not by what was uncovered: every one of these looks correct to a
       human reviewing the demo.

       - `combobox` ×3 — typing opens and filters the listbox; ArrowDown moves
         `aria-activedescendant` onto a REAL option id; Enter commits that
         option and closes. The middle one is the silent case: drift there is
         invisible on screen and mutes the control for a screen reader.
       - `scan-input` ×1 — the terminator clears the field, KEEPS focus, and
         announces the code in the polite region. If clearing regresses, the
         next barcode concatenates onto the last one, in a warehouse, silently.
       - `validation-summary` ×2 — an invalid submit reveals the summary ABOVE
         the fields with `role="alert"`, and an entry moves focus to the field
         it names. A list of errors that focuses nothing looks fine.
       - `collapsible-card` ×1 — both channels move together. Red-proved in
         BOTH directions: breaking `aria-expanded` and breaking `dataset.state`
         each turn it red, which is the only way a two-channel claim is worth
         anything.

       **Two instrument failures on the way, per the 46.1 base rate.** A bare
       `.bo-combobox__option` selector spanned every combobox demo on the page
       (15 options, three `null` values from other instances) and looked like a
       filtering bug. And the first red-proof of the collapsible claim PASSED —
       the injection renamed `data-state`, which appears **zero** times in that
       bundle because the behavior writes `dataset.state`. The claim was
       unproven, not passing falsely; verifying the injection is what caught it.

       **Batch 2 landed 2026-08-19 — 3 claims, 56 -> 59.**

       - `wizard` — the stepper mark and the visible panel are two views of ONE
         step index, and focus follows. Red-proved three ways: dropping the
         `aria-current` setter, leaving every panel visible, and removing the
         focus call each turn it red independently.
       - `saved-views` — **the dangerous one.** Applying a view must fill the
         filter bar AND mark exactly that chip. If it marks the chip without
         filling the bar, the screen says "Overdue" while showing everything,
         and nothing about that looks broken.
       - `tag-input` — removing a tag drops its VALUE, not just its chip. A chip
         that vanishes while its value survives submits data the user deleted.

       **`dropdown` and `table-sum` were on the uncovered list and were never
       uncovered.** The dropdown scroll-anchor claim (0.2.0) and the
       editable-grid Cancel claim already drive them; the hook-matching that
       produced the list reported `initDropdowns` as 0 of 9. That is the THIRD
       disagreement from that measurement, which is why no coverage percentage
       appears anywhere in this slice.

       **Two of three new instruments were wrong on first run — the base rate
       held.** Both reported a product bug that did not exist: the wizard probe
       read `querySelector('[data-wizard-panel]')` on a page with FOUR panels,
       so the legend never changed; the saved-views probe read the first of
       THREE `.bo-filter-bar` forms and dispatched `popstate`, a code path no
       user takes (the views are real links). The product was correct both
       times.

       Also worth recording: the wizard behavior is an **inline minified module
       in the page HTML**, not a bundle — four greps through `dist/_astro`
       found nothing while the claim passed. Red-proving forced that discovery;
       a claim that had merely gone green would have left it unknown.

       **Batch 3 landed 2026-08-19 — 5 claims, 59 -> 65. ITEM CLOSED: all 21
       init behaviours now carry an executable claim.**

       - `money-field` ×2 — switching currency reformats to that currency's
         precision (JPY 0, BHD 3), and the reformat is **LOSSLESS**. The second
         is the one that matters: silently rounding money is invisible on screen
         and wrong in the ledger.
       - `file-dropzone` ×1 — a dropped file lands on the INPUT, not merely
         lights up the zone. If the highlight works and the assignment does not,
         the user sees a successful-looking drop and submits nothing.
       - `load-more` ×2 — one bubbling `bo:table-load-more` per click, and the
         append comes from the page's own consumer. Maximally silent: the
         framework appends nothing either way, so a dead event looks identical.

       **The lossless claim was weak when first written and was strengthened
       before red-proving.** `Number(value) === 1250.5678` is also satisfied by
       a behavior that does NOTHING, so alone it could not tell lossless from
       no-op. Requiring `step` to have moved to the JPY precision proves the
       reformat ran *and* kept the digits. Red-proved by injecting a `toFixed`
       rounding — only that claim went red.

       **The last gap was found by reconciliation, not by the detector.** All 21
       init behaviours were checked against HAND-VERIFIED selectors, which
       surfaced `initLoadMore` as genuinely uncovered — the hook matcher had
       counted it as covered via the static `.bo-pagination` markup 45.2 added.
       Fourth disagreement from that measurement, and the reason this slice
       never published a coverage percentage.

       **One claim went red against correct code and was the claim's fault.**
       The first `load-more` version asserted the row count stayed put, on the
       reasoning that the behavior appends nothing. Rows went 2 -> 4, because
       the demo page wires its own listener — which is the documented split
       working exactly as described. The claim now asserts both halves
       separately, and they are independent: renaming the event breaks the
       dispatch claim while the consumer claim still holds.

       **A coverage PERCENTAGE is deliberately not recorded.** Two attempts to
       measure it disagreed in opposite directions — matching behavior hooks
       counted `initLoadMore` as covered via the static `bo-pagination` markup
       added in 45.2, and restricting to unique hooks called `initTableSum`
       uncovered while the editable-grid claim drives `[data-sum-of]`. Per the
       load-bearing-number rule, the deliverable here is claims, not a statistic.

2. [x] **45.2 — Two patterns promise behaviour no screen shows.** — landed 2026-08-19
       `/patterns/master-detail` says the panel "becomes a full-width drawer over
       the list" below the shell breakpoint and links to `offcanvas` — no screen
       renders one. `invoice-list`, the flagship list, does not paginate, which
       is implausible for an ERP invoice list and is why `pagination` measures
       zero demand.

       Both are findings about the SCREENS, not the components — rubric reading
       (c), a screen quietly doing without something it should use.

       Accept: master-detail renders a real drawer at narrow width, verified at
       390; invoice-list paginates. Neither adds framework CSS — both components
       already ship. If either turns out to be wrong for the screen, record that
       instead and fix the prose that promises it.

       **Landed 2026-08-19.** `invoice-list` paginates: a `.bo-pagination` in the
       table FOOTER, which is where placement is load-bearing — `data-table.css`
       already hides `__toolbar, __footer` in print, so the page's print prose is
       true by construction rather than by a second rule. `master-detail` renders
       a real `.bo-offcanvas--end` drawer; `initDialogs()` already ran there, so
       no new wiring and no new framework CSS. Both `pagination` and `offcanvas`
       are back on their "Components used" lists, now kept honest by 46.2's gate.

       **The prose was wrong, not the component — corrected, per the Accept's own
       escape clause.** The page promised a "full-width drawer"; `.bo-offcanvas`
       is `min(18rem, 85vw)`, which is 288px at a 390 viewport. That cap is
       deliberate and worth stating: a sliver of the list stays visible so the
       user keeps their place. The page now says that, and a 48th claim asserts
       the cap (`width < viewport`), red-proved by forcing `100vw` into the built
       CSS — exactly one claim went red.

       **A probe artifact nearly became a finding (46.1 in force).** Measuring the
       drawer's right edge on a 250ms timer returned 395 light / 399 dark at a
       390 viewport — an impossible *theme* difference that was really the
       `translate: 100% 0` slide-in sampled mid-flight. Sampling until the rect
       stopped moving gave 288px flush-right in all four contexts. The claim
       measures WIDTH, which is stable through the slide; the reason is a comment
       in `check-claims.mjs` so the next person does not re-derive it.

       **Note (46.2, 2026-08-19):** both claims have been REMOVED from those
       pages' "Components used" lists, so the docs no longer overstate what they
       show. When this item renders them, the entries go back — and
       `check:components-used` now enforces that they cannot be listed again
       without being rendered.

3. [x] **45.3 — `.bo-date` scores 1 of 12: merge and deprecate.** — landed 2026-08-19
       `display: inline-flex`, a `gap`, `tabular-nums` and a muted span — a
       `.bo-cluster` with two utilities. No forced-colors rule, not
       density-aware, no claim, no behavior, no screen. The one real decision in
       it is `--overdue`, whose two-channel contract (the word "Overdue" must be
       in the text) is genuine and belongs somewhere.

       Accept: the overdue guidance moves to `/components/amount`, which already
       documents exactly that pattern for negative amounts; `.bo-date` gets a
       **Deprecated** CHANGELOG entry and a docs page naming the replacement.
       **Removal at the next major, not now** — it is in the published 0.1.1.

       **Landed 2026-08-19.** The overdue guidance is on `/components/amount`
       under "The same contract for dates", framed as a rule about VALUES rather
       than about a date widget — which is why it belongs beside `--negative`
       instead of in a component of its own. `.bo-date` carries a deprecation
       notice naming the replacement, the source CSS carries the same note, and
       the CHANGELOG has an **Unreleased / Deprecated** entry.

       The replacement is `.bo-cluster` + `.bo-u-tabular` + a
       `.bo-badge--danger` carrying the word "Overdue". That is better than what
       it replaces, not merely smaller: the two-channel contract becomes
       **structural** — the badge holds the word — instead of a rule a consumer
       has to remember and a reviewer has to catch.

       **Not a breaking change and not a deletion**: the classes still ship and
       still work. Removal waits for the next major because 0.x is published.
       Verified live at 1440 and 390 in both themes; every gate green, axe zero
       violations, 40 visual shots unchanged.

4. [x] **45.4 — `calendar` has zero demand, and that is my doing.** — landed 2026-08-19
       Shipped 2026-08-17 with strong Composition, Contracts and Evidence scores
       (9 of 12) and used by **no screen** — only its own component page. A
       component demonstrated but never used in a pattern is documentation, not
       evidence that it earns its place.

       Accept: it appears in a screen where the marks matter — delivery
       scheduling or goods receipt — or the review records it as dead weight and
       says so. Not a new pattern page for its own sake; only if the screen is
       one a back-office user genuinely sits in front of.

       **Landed 2026-08-19 — used, not removed.** `/patterns/detail-form` now
       has a **requested delivery date** calendar. That screen was chosen over a
       new page on purpose: the Accept forbids a pattern page for the
       component's own sake, and a buyer editing a PO is already someone who
       picks a delivery date. No new screen, no new CSS.

       **The marks had to be load-bearing or this would have been decoration.**
       The dock is shut at weekends and closed for a company shutdown on the
       7th, so those days are `<button disabled>` — the constraint is enforced
       by the CONTROL, not by a validation message afterwards, and each carries
       a visually-hidden reason because a greyed-out day tells a screen-reader
       user nothing. The page keeps the plain `<input type="date">` for *order
       date* directly above it, which makes the distinction concrete: a native
       picker is right when every day is valid; the calendar earns its place
       only where a *set* of days is not on offer.

       The month is GENERATED from its own dates in frontmatter, never
       hand-typed — 35 cells whose label and submitted value must agree is
       exactly where this repo has produced rows labelled with another row's
       name. Verified against the RENDERED page: 30 in-month cells + 5 outside,
       9 disabled (8 weekend + 1 shutdown), every label matching its own value
       and mark.

       Claim 56 asserts all of it, red-proved three ways — removing one
       `disabled`, stripping one visually-hidden reason, and mislabelling one
       cell each turn it red. `check:target-size` passes: day cells are 32px,
       clear of WCAG 2.5.8's 24px floor.

       **Rescored in `surface-scores-batch1`: D0 → D2, 9 → 11, improve →
       keep.** D2 not D3 — one screen, not the eighteen `data-table` earns.

5. [x] **45.5 — Add a "cost to remove" column before batch 2.** — landed 2026-08-19
       The rubric scores what a component is worth but not what removing it
       costs a consumer already using it. `date` scored 1 and is still bounded by
       the deprecation rule because it is published. Accept: the column exists
       and batch 2 uses it; batch 1 is not rescored.

       **Landed 2026-08-19.** The column is **not** a fifth dimension and does
       not enter the /12 total. Making it additive would mix two different
       questions — *is this good?* and *can we get rid of it?* — into one
       number, would let "hard to remove" silently inflate a weak component, and
       would force batch 1 to be rescored, which this item's own Accept forbids.
       It is a separate column that constrains which **outcomes** are available:
       cost 0-1 allows Deprecate/Merge, cost 2 allows Deprecate only with a
       documented reachable replacement, cost 3 allows Keep/Improve only.

       That last rule is the point of the column: **a low score is never on its
       own a reason to remove something.** `date` scored 1 and was still bounded
       by the deprecation rule — the score was not deciding the outcome, and the
       rubric did not admit it.

       Measured rather than judged: published-tag membership via
       `git ls-tree v0.1.1`, and screen usage counted INSIDE the demo region.
       That second detail matters — a naive whole-page count reported `offcanvas`
       in 17 of 17 screens, because the docs shell's own mobile nav IS a
       `.bo-offcanvas`. The real figure is 1. Same chrome trap that produced four
       dead detectors in 39.2, caught this time by the number being implausible.

       Two worked examples are included so the column can be seen to
       discriminate (`date` 1, `data-table` 3) — not a backfill of batch 1.

## Slice 44 — from the Objective grill, Slices 39/42/43 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices39-42-43-2026-08-19.md`.

1. [x] **44.1 — A number quoted to the owner is load-bearing.**
       Thirteen detectors in three slices could not fail. Twelve cost time; one
       cost accuracy — *"only 1 of 18 learning-path pages shows anything
       working"* went into a summary to the owner and the real figure is
       **16 of 18**. The owner cannot check a number like that without redoing
       the work, so it is only ever caught by the person who made it.

       Accept: written into CLAUDE.md next to the red-proof discipline — before
       a measured claim goes into a summary, it is checked the way a gate is:
       does the measurement discriminate, and what would make it wrong? A
       plausible zero, an implausibly round number, or an identical value across
       many inputs is treated as a defect in the instrument until shown
       otherwise. Cheap, and it is the difference between a wasted wake and a
       false report.

       **Landed 2026-08-19** in CLAUDE.md beside the red-proof discipline, with
       the four concrete tests that would have caught the dead detectors: ask
       what would make it wrong; treat a suspiciously tidy number as an
       instrument defect; reconcile against an independent count; state what the
       number does not cover. Scoped explicitly to ad-hoc measurements — a
       number a gate already asserts is red-proved by construction.

2. [x] **44.2 — Gate the rendered result of a STATE, not just token pairs.**
       43.1's WCAG failure shipped in the **initial commit** and survived
       **43 slices and 31 axe sweeps**, because the gate suite is organised
       around properties — the contrast of a token pair, the presence of a rule
       — and not around *what a state actually renders*. `check:contrast` cannot
       model `opacity`, so a dimmed table was never in scope.

       Accept: enumerate the visual STATES the framework ships (`data-loading`,
       `data-row-state`, `aria-busy`, `disabled`, `[hidden]` reveals,
       `forced-colors`) and assert the composited result of each — the claim
       added in 43.1 is the shape, generalised. Where a state cannot be measured
       this way, say so and say why. The test of success is that reintroducing
       0.6 fails, which it now does, and that the OTHER states are covered too.

       **Landed 2026-08-19** as `check:composited`, in the core build. Every
       `opacity` below 1 in the shipped CSS must be registered with a decision —
       **aa** (the user reads it, so composited contrast must meet 4.5:1, and a
       claim asserts it live) or **exempt** with the reason. An unregistered
       dimming state fails the build, which is what the initial commit's 0.6
       would have hit on day one.

       **The distinction that made 43.1 a bug is now written down:** WCAG 1.4.3
       exempts *inactive* components. A disabled control is inactive — measured,
       a disabled primary button drops **5.47:1 → 2.15:1** composited and is
       compliant by that exemption. A table marked `aria-busy` is **not**
       inactive; the user keeps reading it.

       7 dimming declarations, all registered: 2 AA-asserted, 5 exempt.

       **The gate initially missed four of them.** It parsed values with
       `parseFloat`, so `opacity: var(--bo-state-disabled-opacity)` came back
       `NaN` and was skipped — every disabled control in the framework. A gate
       written to catch the states nothing was measuring managed to not measure
       four of them. Now any value that is not exactly `1` counts.

## Slice 43 — P0 found while doing 39.3 (2026-08-19)

1. [x] **43.1 — P0: `data-loading` dimmed shipped text below AA.**
       `.bo-data-table[data-loading="true"]` (and `[aria-busy="true"]`) dimmed
       the whole table with `opacity: 0.6`. Opacity composites TEXT as well as
       background, and on the light canvas the header colour landed at
       **3.28:1** against a 4.5:1 requirement — a serious WCAG 1.4.3 failure in
       a shipped component, in the state a table spends every swap in.

       **Why it stayed hidden.** Body text composited to 4.61:1 and both
       dark-theme colours passed, so only the lighter `th` colour was under
       water — a partial failure that survives a glance. `check:contrast`
       computes token PAIRS and cannot model opacity, so it was never in scope.
       The axe sweep did not flag the existing loading table on
       `/components/data-table` either; it only fired once 39.3 added a second
       instance, which is what surfaced it.

       Fixed at **0.75 → 4.84:1** with margin. The dim is one channel of three —
       `aria-busy` announces the state and `pointer-events: none` enforces it —
       so a slightly weaker dim costs far less than unreadable text.

       Gated by an executable claim (41 total) that composites the real
       computed colours in **both themes** and asserts ≥4.5:1. Red-proved by
       restoring 0.6: the claim reports 3.28:1 and fails.

## Slice 42 — from the Objective grill, Slices 39-41 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices39-41-2026-08-19.md`.

1. [x] **42.1 — A heuristic gate must be able to demonstrate it can fail.**
       Three detectors in this window could not fail, and 39.2 alone produced
       **four in a row** that passed 18/18 while measuring nothing. The pattern
       that caught them is already in the tree — `check-learning-path` and
       `check-loop-vocab` ship a `--self-test` or an explicit "input absent, NOT
       verified" path — but it is ad hoc.

       Accept: gates whose signal is a **heuristic** (a position, a pattern, a
       count of a thing that might be chrome) carry a `--self-test` that runs the
       detector against synthetic inputs it must classify correctly, and fails if
       it cannot tell them apart. Gates that check an exact fact — a file exists,
       a version matches — are explicitly exempt, and the exemption is stated so
       nobody adds ceremony to a `readdir`. Written into CLAUDE.md next to the
       red-proof discipline it extends.

       **Landed 2026-08-19.** All **23 gates classified — 7 `@heuristic`, 16
       `@exact`** — each with a one-line reason in its own header, so the
       judgement sits where the next reader is. `check:selftests` fails on an
       untagged gate and prints the heuristic gates that still owe a self-test.

       **The meta-gate failed its own rule on the first run.** It matched the
       string `--self-test`, and all 7 heuristic gates passed — because the tag
       text says "Carries --self-test". The gate written to catch detectors that
       cannot fail was, for one run, a detector that could not fail. It now
       requires the `process.argv` branch.

       **Debt stated rather than hidden:** 5 heuristic gates still owe a
       self-test. The meta-gate REPORTS rather than fails on those, deliberately
       — failing the build for pre-existing debt would only encourage
       mislabelling them `@exact` to get green. `check-notes` was retrofitted
       here to prove the shape generalises beyond `check-learning-path`.

3. [x] **42.3 — Burn down the five heuristic gates that owe a self-test.**
       `check-boost`, `check-floor`, `check-forced-colors`, `check-loop-vocab`,
       `check-markup`. `check-notes` and `check-learning-path` are done and show
       the shape: extract the classifier into a function, drive it with inputs it
       must sort correctly, exit non-zero if it cannot.

       Accept: each gains a `--self-test` exercising the case its detector could
       plausibly miss — for `check-markup` that is the consumed-`<` bug that once
       hid one of six injected rows. When the list reaches zero, `check:selftests`
       stops reporting and starts failing on a missing self-test.

       **Landed 2026-08-19. All 7 heuristic gates self-test; the meta-gate now
       FAILS on a missing one** rather than reporting it — the debt reached zero,
       so the rule is enforced.

       Proved by breaking each gate's REAL detector in turn and confirming all
       seven go red: LAYOUT stops matching `display:grid`, the floor literal
       stops matching two browsers, `CLASS_RE` stops finding `bo-*`, the outcome
       extractor returns nothing, `classifyNote` returns clean, the bare-text
       regex consumes its `<` again, the preview index is pinned to 0.

       **Three of the five self-tests were worthless when first written, and the
       red-proof is the only reason that is known:**

       - `check-markup`, `check-loop-vocab` and `check-notes` each tested a
         **COPY** of the detector. Breaking the gate's real regex left the copy
         happily green. All three now share one exported implementation between
         gate and test, so breaking one breaks the other.
       - Even after sharing, `check-markup`'s fixture still passed with the bug
         reintroduced: it put a `<th>` between the two offending rows, so both
         matched anyway. The consumed-`<` bug only loses a match when one row's
         stray text ends **exactly** at the `<` opening the next. Fixture
         corrected; it now reports 1 of 2 with the bug and 2 of 2 without.

       A self-test that tests a copy is the same defect one level up as the
       detector that cannot fail. Writing the rule did not prevent it — running
       the proof did.

2. [x] **42.2 — Close the picking gap the date-picker refusal left open.**
       The refusal was right about the widget and wrong about the job. The
       native input picks but cannot mark; `.bo-calendar` marks but nothing
       documents picking from it — so a user choosing a delivery date around a
       plant shutdown gets two controls that each do half.

       **It is already half-built:** `calendar.css` ships
       `a.bo-calendar__day` and `button.bo-calendar__day` with hover and pointer
       affordances (lines 127-134) and **no page uses them**. An undocumented
       interactive affordance is the worst of the three states.

       Accept: document picking from the calendar as a **pattern**, not a new
       component — days as real links or submit buttons in a form, so it works
       without JS and the server owns which dates are selectable; state plainly
       when to use the native input instead (most of the time); keyboard
       behaviour is whatever real links/buttons already give, with **no roving
       tabindex and no new ARIA**. If that turns out to need a JS widget, the
       answer is to say so and stop — not to build one quietly.

       **Landed 2026-08-19. Zero new CSS** — the recipe uses the
       `button.bo-calendar__day` rules that shipped unused in 40.3.

       Each day is a real `<button type="submit" name="date" value="ISO">` inside
       a plain `<form method="get">`. Clicking one puts the date in the URL with
       **scripting doing nothing**; the server renders unavailable days
       `disabled`, so the rule that blocks a plant shutdown lives where the works
       calendar already lives. No roving `tabindex`, no ARIA, no widget.

       **Measured live, and it corrected my own prose:** 31 days, 11 disabled,
       **20 tab stops** — not the "roughly thirty" I had written, because
       disabled buttons are not focusable. The page states the measured number
       and says plainly that a native input is one tab stop.

       Two contradictions removed: the opener said "not a date picker" and a
       later section said "the browser owns picking a date". What is still
       refused is the *widget* — a scripted popup with its own ARIA and
       month-navigation model — and the page now argues that instead, with the
       test stated: nothing in the recipe needs it.

       Claim added (39 total), red-proved both ways: days rendered as spans, and
       blocked days rendered enabled. The first version **crashed** on a null
       instead of failing the claim; guarded, so a picker that only looks
       pickable reports a named failure rather than killing the gate.

## Slice 41 — from the Objective grill, Slices 31-40 (2026-08-19)

Full findings: `.roundtable/grill-objective-slices31-40-2026-08-19.md`.

1. [x] **41.1 — Make dispatcher starvation a number, not a discovery.**
       Three rules have now starved because an always-true condition sat above a
       counter, and **each was found by hand** — the last one after **ten
       slices**. The instances are fixed; the blind spot is not.

       Accept: a script reports, per counter-triggered rule (Standardize,
       Objective), how many qualifying events have accumulated and how long since
       it last fired — read from `.roundtable/loop-log.md`, which already records
       every dispatch. It runs in the wake, prints one line per rule, and says
       plainly when a rule is overdue. Not a gate: this is information for the
       dispatcher, and failing a build over it would be the wrong lever. Verified
       against the known history — it must report the ten-slice Objective gap
       from the log alone.

       **Landed 2026-08-19.** `scripts/loops/dispatch_status.py`, wired into
       LOOPS.md as **Step 0b**, before the dispatch decision. Not a gate.

       **The first version FAILED its own historical replay.** It reported
       **16** slices including "10" and "17", because a free-text scan for
       `NN.N` reads **"10.3%"** and **"17 screens"** as slice numbers. Anchored
       to the item's leading token and restricted to `Continue` rows (a Roadmap
       triage row plans a slice, it does not close one), it reproduces the known
       **10 — `[27, 30, 32, 33, 34, 36, 37, 38, 39, 40]`**. The instrument built
       to catch instrument-blindness was itself wrong on first run.

2. [x] **41.2 — Stop the loop log saying "shipped" for work nobody can install.**
       Every iteration in Slices 31-40 is recorded as `shipped`, and the registry
       has served **0.1.1** throughout. Four consecutive grills have recorded
       that gap, and the log's own vocabulary hides it.

       Accept: `record_iteration.py` distinguishes committed-to-git from
       released, or the outcome vocabulary gains a term that does. Existing rows
       are NOT rewritten — they record what was believed at the time, and
       rewriting history would erase the finding. Cheap, and it makes the
       release gap visible in the place decisions are made.

       **Landed 2026-08-19.** `--outcome` now takes one of **landed · released ·
       logged · triaged · refused · reverted**, and **"shipped" is rejected**
       with the reason. Unknown values are rejected too, so the vocabulary
       cannot grow a synonym by accident. Documented beside the command in
       CLAUDE.md and LOOPS.md. **368 historical rows untouched.**

## Slice 40 — icons, SVG, date picker, filter popup (owner wishlist, 2026-08-19)
5. [x] **40.5 — `ApiTable` notes render as HTML, and a note produced a SERIOUS
       a11y violation.** Writing `A day may be a <span>, an <a> or a <button>`
       as a note put real elements inside the notes `<ul>`, which axe flagged as
       `list` (serious) — non-`<li>` children of a list. Caught only because the
       axe sweep runs on every page; nothing about writing a note warns you.

       Accept: either notes are escaped (the safe default — a note is prose, not
       markup) or the component states that it takes HTML and a gate rejects
       block-level tags in a note. Red-proved either way, and the existing note
       arrays are checked for other instances.

       **Landed 2026-08-19 as the gate, not the escape.** Measured first:
       **`<code>` appears 208 times across 150 notes**, balanced, so escaping
       wholesale would break the legitimate use that `set:html` exists for.
       `check:notes` instead asserts that a note renders as PROSE — inline
       formatting allowed, interactive and structural elements never.

       **Diagnosed the original bug rather than guessing at it.** The unclosed
       `<a>` triggers the parser's adoption-agency algorithm, which HOISTS an
       `<a>` out of its `<li>` to sit as a direct child of the `<ul>` — measured
       in the DOM as `[LI, LI, LI, A]`. That is why axe reported a serious
       `list` violation several steps from the note that caused it.

       **Found one more, already shipped:** `/components/tag-input` wrote
       `` `<button>`s `` — backticks are not escaping — putting a real focusable
       button mid-sentence. axe never complained, because a stray button is
       valid HTML; it simply is not what the author wrote. Fixed.

       **Two of my own errors, both caught by insisting on a red proof:**
       - A source-level version of the check reported **six false positives**
         immediately: notes are assembled from Astro expressions
         (`<a href={base + '/x'}>`), so the source is not HTML and cannot be
         parsed as such. The gate runs on BUILT output, where the question is
         well posed.
       - My first hoisting detector was **dead code**: hoisting happens at parse
         time, so the built file still reads `<li>…<a>…</li>` and a text search
         for a stray sibling can never fire. It passed against a deliberately
         broken note. Replaced with a per-note tag-balance check, which catches
         the CAUSE statically and names the sentence; axe still covers the
         parsed result.


Four asks. **Measured before answering**, because the first one has a number that
decides it.

### The icon question, answered with arithmetic

12 icons ship today. In the minified stylesheet they are **7,898 bytes — 10.3% of
the entire framework** (76.9 kB), averaging 658 bytes each because every icon is
an inlined SVG data URI in a `mask-image`.

**A 200-icon "full list" would add ~129 kB minified — nearly twice the size of
the whole framework.** Icons would become the majority of what we ship, to
compete with Lucide and Heroicons, which are better maintained and already free.
That fails "less for more" on the arithmetic alone, so a full set is **refused**.

But the ask underneath it is real: 12 icons is not enough for an ERP, and today
the only escape hatch is a comment in `icon.css` telling you to write your own
`mask-image`. So the answer is a mechanism, not a catalogue.

1. [x] **40.1 — Any icon, one line: `--bo-icon-src`.**
       Make `.bo-icon` take its glyph from a custom property, so a consumer
       points it at any SVG — Lucide, Heroicons, their own brand mark — and gets
       the framework's sizing, colour, density and forced-colors handling for
       free. The 12 shipped icons become *defaults expressed in the same
       mechanism*, not a privileged list.

       Accept: one new custom property, **zero new classes per icon**; the 12
       existing icons still render identically (compare built CSS before/after);
       a documented one-line recipe for Lucide/Heroicons that is executed, not
       asserted; the "deliberately absent" list gains an entry explaining why
       there is no icon catalogue and what to use instead. Cost line stated.

       **Landed 2026-08-19, and it made the framework SMALLER.** Cost: **1 custom
       property, 0 new classes, 0 behaviors** — and **75 kB -> 71 kB minified**,
       a 4 kB / 5.3% reduction. The saving was not the goal and is worth stating:
       autoprefixer had been emitting `-webkit-mask-image` AND `mask-image` per
       icon, duplicating the entire inlined SVG data URI twelve times. With the
       URI held once in a custom property, only the base rule carries the
       prefixed pair. The more general answer is also the cheaper one.

       Verified live in the container at 1440 and 390 in both themes: 28 icons,
       zero unmasked. Claim added (37 total) that a **consumer-authored** glyph
       — one this repo does not ship — paints via `--bo-icon-src` with no new
       class, in `currentColor`, sized to the font. Red-proved.

       **Nearly shipped on a stale artifact.** Three probes reported the
       mechanism did not work, and I was about to conclude the premise was
       wrong. The container was serving `colors.rqbUZGoN.css` while the build had
       produced `colors.DaAtBaZv.css` — `podman build` output had been sent to
       /dev/null, so a cached image was serving the OLD stylesheet. Comparing the
       served asset hash against the built one is what caught it.

2. [x] **40.2 — SVG: say where it EARNS its place, and where it does not.**
       Owner asked about SVG for avatars and app-launch tiles, and for use-case
       suggestions.

       **My first suggestion is a refusal**, because it is the cheapest win:
       an initials avatar needs no SVG at all — it is a `<span>` with a
       background token and two letters, which is text that scales, translates,
       and is selectable. Generating an SVG for it would be strictly worse.

       Where SVG genuinely earns it: **empty-state and error illustrations**
       (a screen with nothing in it is where ERPs feel most broken), and
       **deterministic identicons** where a vendor has no logo. Both are
       decorative, so both must be `aria-hidden` with the meaning carried in
       text — the two-channel rule.

       Accept: a written recommendation per use case with the refusals first;
       anything built ships as **one mechanism**, not a set of assets; nothing
       lands that a `<span>` and a token already do.

       **Landed 2026-08-19. Nothing was built, because all three named cases
       already ship** — verified rather than assumed:

       - **Initials avatar** — `.bo-avatar` already does it with two letters,
         em-sized, `aria-hidden` by contract. Measured: square box, no `<svg>`
         or `<img>` involved. An SVG here would be strictly worse (text scales,
         translates, is selectable).
       - **App-launch tile** — `AppTile` already has an inline `svg` slot,
         documented in its own header as "the per-tenant extension slot.
         Nothing needs shipping."
       - **Vendor identicon / logo** — a plain `<img>` inside `.bo-avatar`.
         Measured live: a multi-colour SVG data URI fills the disc exactly and
         is clipped round (`overflow: hidden` via the existing `:has(img)` rule).

       **The one thing genuinely missing was a sentence, not a component:**
       `--bo-icon-src` is a **mask**, so it discards the artwork's colours — that
       is what makes it themable, and it means a multi-colour mark *cannot* go
       through it. Nobody had written that down, so "use `--bo-icon-src` for
       our logo" was a mistake waiting to happen. `/components/icon` now carries
       a four-row routing table and the refusal.

       **Refused and recorded in the deliberately-absent table: an illustration
       set.** Empty states are where an ERP feels most broken, and the fix is a
       clear sentence plus the action that resolves it — not a drawing that must
       be redrawn per tenant brand, translated for nothing, and downloaded on a
       warehouse tablet.

3. [x] **40.3 — Date picker: multi-month, with marked dates.**
       The ask: 1- and 3-month views, and highlighting holidays or
       company-specific dates. This is the most genuinely ERP-shaped item in the
       list — period-end, shipment windows and payment terms all need "which
       days are special".

       **The hard question to settle FIRST, before any markup:** the framework
       ships `date` today as a native `<input type="date">`, which is used by
       **zero** of the 17 shipped screens (see `surface-baseline.md`). A custom
       calendar is a large, accessibility-heavy widget — the exact kind of thing
       DESIGN.md's "deliberately absent" table exists to keep out. It has to be
       justified against the native control, not assumed.

       Accept: state what the native input cannot do (it cannot mark a date, and
       cannot show two months); prove the marking requirement is real by naming
       the ERP cases; and if it is built, it is **one component with settings**
       (months=1|3, marked dates supplied as data) with full keyboard support
       per the APG and an executable claim per interaction. Refusing, and
       documenting the native input plus a marked-date legend instead, is a
       valid outcome.

       **Landed 2026-08-19 — and the picker was refused, the calendar built.**

       **Measured what the native input cannot do**, rather than asserting it:
       its only constraints are `min`, `max` and `step`, which describe a
       **range**. An ERP calendar is a **set** — eight public holidays, a
       two-week shutdown, the last working day of each period — and there is no
       attribute or API for that. That is the real gap; "it looks plain" is not.

       So the split is deliberate: **the browser owns picking a date, `.bo-calendar`
       owns showing which dates matter.** Entry stays on the native input, which
       is already localized, keyboard-accessible and native on a phone — building
       a popup picker would have replaced a good control with a large
       accessibility-heavy one, which is what the deliberately-absent table
       exists to prevent.

       **Cost: 1 component, 11 selectors, 0 behaviors, 71 -> 73 kB minified.**
       A real `<table>`, so row/column semantics, `scope` and `caption` come
       free and a screen reader says "Tuesday, 12" with no ARIA of ours. Marked
       days use `data-day` (app state per render, like `data-row-state`), each
       pairing a shape with its colour — hatch for non-working, dot for holiday,
       outline for today — and each writing its meaning as visually-hidden text.
       **Verified live: 0 marked days without text.**

       **"1 month or 3" is repetition, not a setting.** Three
       `.bo-calendar__month` in one `.bo-calendar`; measured side-by-side at 1440
       and stacked at 390, no page overflow. There is no `months` option to learn.

       Found on the way: `npm run new:component` offered a group that does not
       exist (`Data display`) and omitted three that do — its list had drifted
       from the sidebar since the 2026-08-16 IA pass, so the documented way to
       add a component rejected every valid answer. Now derived from
       Gallery.astro, and it cannot drift again.

4. [x] **40.4 — Advanced filter popup.**
       Today `.bo-filter-bar` is a row of controls. The ask is the pattern where
       filters live behind a trigger, with applied filters shown as chips.

       **`.bo-chip` already exists and already renders applied filters** on
       `/components/filters` — so this may be composition (popover + the
       existing bar + chips) rather than a component. Check that before
       building anything.

       Accept: an explicit answer to "is this a new component or a pattern
       page?" with the composition written out; if it is a pattern, it lands as
       one; the popover must be dismissible by Escape and return focus to its
       trigger, proven by an executable claim, not asserted.

       **Landed 2026-08-19 as a PATTERN. Zero new CSS, zero new behaviors.**
       `/patterns/filter-panel` = the filter bar (the two controls in constant
       use) + a `[popover]` dropdown in its existing `data-multiselect` variant
       per group + chips for what is applied. Every piece already shipped; the
       ask was a screen, not a component.

       The popover requirement was already met by the platform, not by us: the
       menu is a native `[popover]`, so Escape, light-dismiss and focus return
       are the browser's. Claim added (38 total) driving REAL clicks and a real
       Escape.

       **Two test-quality lessons, both mine:**
       - The first version used `element.click()`, which does not move focus, so
         it asked whether focus returned to a trigger that had never held it —
         and reported a failure against behaviour that works.
       - The first red-proof was GREEN: removing `data-multiselect` from the
         menu changed nothing, because the count is driven by the TRIGGER's
         `data-multiselect-label` (dropdown.ts:41) and close-on-select only
         gates `.bo-dropdown__item` buttons, not label-wrapped checkboxes.
         Re-proved against the attribute that actually drives it.

## Slice 39 — the docs must make the first impression (owner wishlist, 2026-08-18)

Owner: *"Your first screen — only code, which does not create the first
impression. It should be result first, then if they want to see, they can look
for the code. Can it be tabs: html | source code? Any better idea let me know.
The document should make the first impression. Make user feel that it is not
difficult to learn. Make it a flawless journey to walk through."*

**Measured, and the complaint is exact:**
`/getting-started/first-screen` contains **10 code blocks and 0 live demos**.
The page whose job is to show a newcomer what they get shows them source only.

1. [x] **39.1 — Result first on the tutorial path.**
       `Demo.astro` already renders a live preview AND its copyable code from
       ONE string, and every component page uses it. The tutorial does not.
       This is composition, not new machinery.

       **On the tabs suggestion — grilled, and my recommendation is not tabs,
       for this page.** shadcn and Tailwind do use Preview/Code tabs, so the
       idea has good precedent, and it is the right shape on a REFERENCE page
       where the reader already knows what the thing is and wants one or the
       other. A tutorial is the opposite case: its whole job is to teach the
       MAPPING between the markup and the result, and a tab hides one half of
       the pair the reader is trying to connect. It also costs a click for the
       code-first reader and takes the code out of Ctrl+F.

       Proposed instead: **result, then its code, directly beneath** — Demo's
       existing behaviour, which is also what the docs-IA comparison (2026-08-16)
       already concluded for component pages. Owner may overrule; if tabs are
       wanted, they must keep the code findable (rendered, not lazily mounted).

       Accept: the first thing on the page is a rendered screen, not a `<pre>`;
       every step shows its result; the page still teaches in order; verified at
       1440 and 390 in both themes.

       **Landed 2026-08-19.** The page opens with the finished screen, live —
       composed from the SAME strings steps 2 and 3 teach, so it cannot promise
       a screen the steps do not build. Steps 2 and 3 are now `<Demo>` (preview
       + its code). Step 1 stays code-only and says why: it is a whole document,
       and after it the page is an empty shell. Executable claim added (36 total)
       asserting the result precedes the first `<pre>` AND that the hero is
       genuinely live — red-proved by switching the behaviors off.

       **Rendering it exposed three real defects that months of prose had hidden:**

       - **The documented filter-bar markup does not produce a filter bar.**
         `.bo-input`/`.bo-select` default to `inline-size: 100%`, so in a
         wrapping `.bo-filter-bar` every control claimed a full row and the
         "bar" rendered as a vertical stack. `/components/filters` had been
         compensating with an inline `style` on each control — the consumer
         writing markup the component should own. Fixed in the framework:
         `.bo-filter-bar :is(.bo-input, .bo-select) { inline-size: auto }`.
         **Cost: 1 selector, 0 classes, 0 behaviors**, and 4 inline styles
         deleted from the docs page.
       - **A live sample turns illustrative hrefs into real links.**
         `href="/invoices/INV-1"` was fine inside `<pre>` and a broken link once
         rendered; the link gate caught it. Now `#` with the record URL
         explained in prose, matching every other rendered demo on the site.
       - **Rendering the same markup twice duplicates LANDMARKS.** Two
         `role="search"` regions and two `<nav aria-label="Pagination">` with
         identical names — axe's `landmark-unique`, and a real problem for
         anyone navigating by landmark. Fixed by renaming landmark names in the
         preview copy only, as a rule rather than per-element after the
         hand-patched first attempt shipped a second violation immediately
         behind the first.

2. [x] **39.2 — Make "flawless journey" checkable rather than a feeling.**
       "Not difficult to learn" is not gate-able as written, so it gets proxies
       that are:

       - **Result before source.** A build gate: on every `getting-started/` and
         `concepts/` page, a rendered demo appears before the first `<pre>`.
         This is the owner's complaint generalised, so it cannot come back.
       - **No dead ends.** Every page on the learning path names its next step.
       - **Nothing unexplained on arrival.** The first screen a newcomer sees
         must not use a term the docs have not defined yet.

       Accept: the first two are gates with red-proofs; the third is a walk of
       the path recorded in `.roundtable/`, listing every term introduced before
       it is defined. A finding of "none" is only credible if the walk is
       written down.

       **Landed 2026-08-19.** `check:learning-path` ships both gates, each
       red-proved against the built site; the walk is
       `.roundtable/learning-path-walk-2026-08-19.md`.

       **Three real jargon gaps found and fixed** — `density`, `token` and
       `two-channel` were all used on the first pages a newcomer opens with no
       link to their explanation. Installation's opener now names tokens and
       density with links; the AI-assistants page states the two-channel rule and
       links the accessibility model.

       **The term check was built as a GATE and then removed.** Every scoping
       over-enforced — page-wide it demanded a link from a passing mention of
       "density" in a changelog, and the honest version needs the sidebar's page
       ORDER, which would bake docs IA into a build gate. Accept had asked for a
       walk, not a gate; the walk is what shipped. A human read beat a machine
       rule here.

       **Four detectors were wrong before one worked**, all passing 18/18 while
       measuring nothing: `class="demo"` (every section has it), first `bo-*`
       after `<main` (the `<main>` tag itself matches), first non-chrome `bo-*`
       (the shell's own mobile menu button, identical offset 536 on all 18
       pages), and any non-utility `bo-*` (counted Related-footer badges as
       results). Only `.demo-pair__preview` discriminates. The gate now ships
       `--self-test`, which runs it against code-first, result-first and
       code-only synthetic pages and fails if it cannot tell them apart.

3. [x] **39.3 — Only 1 of 18 learning-path pages shows anything working.**
       The gate found it while guarding one page: `/getting-started/first-screen`
       is the only page on the path that uses a live `Demo`. The other 17 explain
       with prose and code and never show the thing.

       **Not a blanket fix.** Several are correctly code-first —
       `/getting-started/installation` opens with `npm i` because installation IS
       a command; `/concepts/cascade` opens with CSS because the subject IS CSS.

       Accept: go page by page and answer one question — *is there a result this
       page could show that would replace a paragraph?* Where yes, use `Demo`
       (preview and code from one string). Where no, record why, so the next
       sweep does not re-ask. A page count is not the goal; a reader who can see
       what the framework does before reading about it is.

       **Landed 2026-08-19 — and the title of this item was WRONG.**

       **16 of 18 pages already render something live.** The "1 of 18" came from
       counting uses of the `Demo` *component*, which only `first-screen` had;
       every other page hand-builds its live examples inline. I conflated "uses
       Demo" with "shows anything working" and reported the alarming version.
       Only **`/getting-started/htmx`** and **`/getting-started/installation`**
       rendered nothing at all.

       **Getting to that number took three broken detectors**, which is the same
       failure the last two grills named: searching built HTML for
       `class="bo-` finds nothing, because `highlight-code.mjs` splits every
       token into `<span>`s — so the literal never survives. Measured against
       page SOURCE instead, where the raw strings live.

       **One real conversion.** `/getting-started/htmx` now opens with a live
       `data-loading="true"` table — dimmed and non-interactive, which a reader
       can click to confirm — instead of opening with a stylesheet import. Step
       4 keeps the recipe and points at it.

       **Recorded refusals, so the next sweep does not re-ask:**
       - `installation` — its code is a whole `<!doctype html>` document and a
         set of shell commands. Nothing to render inline, and `npm i` is not
         improved by a preview.
       - `concurrency`, `js-behaviors` — the code is a request contract and a JS
         call. Rendering it shows a form of hidden inputs, or nothing.
       - `troubleshooting` — already renders, via two `<iframe srcdoc>` demos
         that deliberately isolate the cascade. Not a gap.
       - `accessibility`, `density`, `permissions`, `i18n` — all already render
         live examples inline (4, 5, 4 and 2 elements). Converting them to
         `Demo` would pair each with its code, which is a real improvement but a
         different item from "shows anything working".

       **The gate caught a perverse incentive in itself.** Adding the demo made
       `check:learning-path` fail htmx, because a page with previews must lead
       with one and step 1 is legitimately a stylesheet import — i.e. the rule
       punished *adding* a demo to a code-first page. Resolved the way the owner
       asked rather than by weakening the rule: the page now opens with the
       result and the steps follow.

## Slice 38 — is the browser floor too new? (owner wishlist, 2026-08-18)

Owner: *"browser support version is too new? shall we consider to reduce to
support more device?"*

A fair question to ask of ERP specifically. Back-office users are exactly the
population on managed corporate fleets, locked SOEs and kiosk terminals, so a
floor that is fine for a consumer product can be disqualifying here.

**Measured now, before deciding anything.** Modern features in the shipped CSS:

| feature | uses | |
|---|--:|---|
| `@layer` | 60 | the cascade contract — this IS the framework's API |
| `mask-image` | 45 | the tab overflow fade (30.1) |
| `:has()` | 27 | interactive reveals, already documented fail-closed |
| `:user-invalid` | 13 | form validation timing |
| `:is()` / `:where()` | 14 | selector hygiene, trivially rewritable |
| `@container` | 6 | density/layout response — a core promise |
| `popover` | 3 | dropdown/menu layering |
| `color-mix()` | 1 | |
| `subgrid` | 1 | |
| `accent-color` | 1 | |

1. [x] **38.1 — Derive the floor instead of asserting it.**
       Today it is hand-written prose — **`Chrome/Edge 119 · Firefox 128 ·
       Safari 17.4`, repeated in 8 places** (index, installation, troubleshooting,
       README x2, DESIGN.md, gen-llms, plus versioned snapshots) and computed
       from nothing. Nobody can check it, and two things already look wrong:

       - **It may be too LOW to be honest.** `mask-image` unprefixed is believed
         to land later than Chrome 119, and it is used 45 times. If so the
         framework does not actually work at its own stated floor — the opposite
         of the owner's concern, and worse, because it is a promise we fail.
       - **It may be too HIGH to be useful.** Nothing obvious explains Firefox
         **128** or Safari **17.4** specifically; `popover` is the newest thing
         here and lands earlier than both. A floor set by guesswork costs reach
         for nothing.

       Accept: a script computes the floor from the shipped CSS against a
       **citable** compat dataset (e.g. `@mdn/browser-compat-data`), the answer
       lives in ONE generated place that every page and README reads, and a gate
       fails the build if the declared floor is below what the CSS actually
       requires. Version numbers are never typed by hand again.

       **Landed 2026-08-18 — and the headline is that the floor was RIGHT.**
       `derive-floor.mjs` reproduces `Chrome/Edge 119 · Firefox 128 · Safari 17.4`
       exactly, from 18 detected features against `@mdn/browser-compat-data@8.0.11`.
       Both of my triage alarms were wrong, and both were caught by measuring:

       - **"mask-image needs Chrome 120."** True of the unprefixed property, and
         irrelevant: autoprefixer emits `-webkit-` alongside every real
         declaration. Verified in the BUILT css — the only unprefixed-without-
         fallback hit was a `.my-icon` example inside a comment. The first
         version of the script ignored prefixes and reported Chrome **136**
         (`print-color-adjust`), which should have been implausible enough to
         check before it was believed.
       - **"Nothing needs Firefox 128."** Wrong, and the correction is the most
         useful thing here: `content: "↕" / ""` — the empty ALT that stops a
         decorative glyph being announced — needs exactly FF 128, and is used 8
         times. It was missing from the probe list, so the script confidently
         reported a floor three versions too low. The tool's stated limitation
         ("a feature nobody probed does not raise the floor") is real, and this
         is what it looks like.

       Also corrected a modelling error: not every modern feature is a
       requirement. `scrollbar-color` lands in Safari **26.2**, and tabs.css says
       in as many words that it is "NOT relied on as the affordance". Letting a
       cosmetic hint set the floor would advertise a browser that barely exists.
       Features are now tiered **core / degrades / polish**, and `floor.json`
       publishes two numbers: the floor (119 · 128 · 17.4) and full fidelity
       (121 · 128 · 26.2), where every enhancement also paints.

       Now generated everywhere: 3 docs pages import `floor.json`; README x2 and
       DESIGN.md are stamped; `gen-llms` reads it. `check:floor` fails the build
       on any hand-typed literal outside a generated region (red-proved).
       ROADMAP and the grills are exempt — they record what was believed, and
       rewriting history would erase the finding.

       **What this buys 38.2:** the levers are now named. Chrome is set by
       `:user-invalid`; Firefox and Safari by `content` alt-text. Lowering the
       floor means giving up one of those, both of which are accessibility
       features with known fallbacks.

2. [x] **38.2 — Decide, per feature, what the floor is worth.**
       Only answerable once 38.1 says which feature sets each number. For each
       one that raises the floor: how much reach it costs, what it buys, and
       whether a fallback exists.

       **The refuse test is explicit, because the obvious way to lower a floor is
       the one thing this framework must not do.** "Modern CSS instead of a
       runtime" is the product; buying reach with a JS polyfill would trade the
       whole pitch for it. Legitimate moves are: drop the feature, replace it
       with an older equivalent, or ship a documented **fail-closed** fallback —
       the pattern `:has()` reveals already use, where the degraded path is
       server-set `aria-invalid` and still works.

       Accept: a per-feature verdict with its reach cost cited, not estimated;
       any lowered floor proven by actually rendering at it, not by reading a
       table; and if the answer is "the floor stays", that is recorded as a
       decision with its reason rather than left as an open question.

       **Decided 2026-08-19: THE FLOOR STAYS.** Cited from
       `caniuse-lite@1.0.30001809` via browserslist, now computed in
       `derive-floor.mjs` and published on `/getting-started/installation`.

       | scenario | reach | gain |
       |---|--:|--:|
       | current floor (119 · 128 · 17.4) | **80.20%** | — |
       | drop `content` alt-text | 80.57% | +0.37 |
       | drop `:user-invalid` | 80.74% | +0.54 |
       | drop `popover` | 80.20% | **+0.00** — not the binding constraint |
       | drop BOTH accessibility features | 81.11% | +0.91 |
       | **`@layer` ceiling** (99 · 97 · 15.4) | **84.16%** | +3.96 |

       **The decisive number is the ceiling.** `@layer` IS this framework's API,
       so no version of it can reach past 84.16%. The entire distance between
       what ships and the best a framework of this shape could do is **3.96
       points** — and the two accessibility features cost **0.91** of that.

       Giving up the empty `alt` on decorative glyphs (a screen reader would
       announce "↕") and `:user-invalid` validation styling, to gain 0.91 points
       of reach, is a bad trade in any product and a worse one in ERP, where the
       users sit on managed fleets that are updated rather than ancient.

       **The refuse test held without being needed:** no polyfill was
       considered, because "modern CSS instead of a runtime" is the product.

       **The instrument was wrong first, and the rule written yesterday caught
       it.** The obvious query reported **27.29%** — browserslist's `chrome` and
       `safari` ids are DESKTOP ONLY, omitting 53 points of mobile traffic. An
       implausible number treated as an instrument defect, per 44.1, rather than
       published.

## Slice 37 — score the surface for real ERP fit (owner wishlist, 2026-08-18)

Owner: *"review and give the score for the existing components/patterns which is
best fit for ERP for real use case. If score is low, grill — can it be better?
should we remove it or need replacement? Run through each."*

39 component pages, 16 pattern pages, 38 CSS components. This is the Objective
charter applied systematically to what already shipped, instead of only to each
new proposal — the charter has always been able to refuse an addition, and has
never once been pointed at the existing surface.

**The failure mode to design against is a scored list that is really just
opinion.** This repo has spent five slices on exactly that class of defect, so
every score must cite something checkable or it does not count.

1. [x] **37.1 — Agree the rubric and publish the measured baseline.**
       Four dimensions, 0-3 each, each requiring a citation:

       - **Demand** — which of the 17 shipped screens (16 pattern pages + the
         `examples/po-app` reference) actually use it. Counted, not judged.
       - **Composition** — could it be built from primitives already shipped?
         (less-for-more: a component that is three existing parts in a trench
         coat scores low however nice it looks.)
       - **Contracts** — does it honour density, two-channel state, RTL, print,
         forced-colors, and target size? Each is already gate-measurable.
       - **Evidence** — is its documented behaviour covered by an executable
         claim or a gate, or is it only asserted in prose?

       **Baseline already measured (2026-08-18), and it is the reason this is
       worth doing:** six components are used by **zero** of the 17 screens —
       `date`, `offcanvas`, `pagination`, `skeleton`, `tree`, `tree-table`.

       That count is a *lead, not a verdict*, and the leads point both ways:
       `offcanvas` is LINKED from master-detail as the answer for narrow
       screens but never actually used in one, and a `pagination` unused by
       `invoice-list` says something about the invoice-list pattern rather than
       about pagination. Stated plainly because "unused therefore delete" is the
       exact wrong conclusion to draw mechanically.

       Accept: the rubric is written down before any component is scored (so it
       cannot be fitted to a conclusion), the usage measurement is a script in
       `scripts/` and not a one-off shell line, and the baseline table is
       committed.

       **Landed 2026-08-18.** `.roundtable/surface-review-rubric.md` (four
       dimensions, 0-3, one rule: every score cites something checkable) and
       `.roundtable/surface-baseline.md`, generated by
       `scripts/surface-signals.mjs` — 38 components x 7 measured columns.

       **The measurement was wrong twice before it was right**, which is the
       argument for it being a script rather than a shell line:

       - First run reported **zero usage for everything**, because a `find` over
         a path that does not exist (`apps/po-app`; it is `examples/po-app`)
         poisoned the file list. Caught only because `bo-data-table` is
         obviously used.
       - Second run "improved" matters by counting every block in a component's
         `api.json` entry — which groups by DOCS PAGE. That credited `offcanvas`
         with `bo-sidebar-nav`'s usage and moved it out of the zero list, in the
         wrong direction for a signal whose whole job is to be suspicious. Fixed
         with an ownership rule: a block belongs to the directory whose name
         matches it, else to the one defining it. Reconciled against an
         independent count (data-table 17, badge 17, sidebar-nav 1).

       **Zero-usage components: 6 of 38** — `date`, `offcanvas`, `pagination`,
       `skeleton`, `tree`, `tree-table`. Recorded with the three readings a zero
       can have, only one of which points at removal.

       Deliberately NOT gated: the baseline is a point-in-time input to a
       review, not a contract, and gating it would make every component change
       drag a report update behind it.

       **Open for the owner before 37.2 runs:** the weights and the outcome set.
       Correcting the rubric after 55 rows are scored means scoring them twice.

2. [x] **37.2 — COMPONENT SCORING COMPLETE 2026-08-21 (Slice 94, batches 1-7). Score every component and pattern, in batches, with citations.**
       **39 of 39 documented components scored**, each with seven cited
       dimensions rendered on its own page. Distribution
       `{80%:3, 83%:1, 87%:1, 90%:1, 93%:5, 94%:1, 95%:8, 100%:19}`. The
       PATTERN half of this item is not done — 19 pattern screens remain
       unscored, and whether the same seven dimensions even fit a screen
       rather than a component is an open question, not an assumption.
       Original text follows.
       Roughly 8-10 per round so each gets real attention. Every row carries its
       four scores, the citation behind each, and one of four outcomes:
       **keep** · **improve** (queue a specific item) · **merge** (into which,
       and why that is less surface) · **deprecate**.

       **Removal is a breaking change and the package is published.** 0.1.1 is
       live and 0.2.0 is tagged, so "remove it" cannot mean deleting a class in a
       minor. It means: a CHANGELOG Deprecated entry, the docs page saying what
       to use instead, and the class removed at the next major. Anything else
       breaks a consumer silently, which is the thing this framework claims not
       to do.

3. [x] **37.3 — DONE 2026-08-21, and running it found the clause was false. Feed the results back.**
       Report: `.roundtable/scorecard-feedback-loop-2026-08-21.md`.

       **Six of seventeen below-3 dimensions had no follow-up.** Four
       (`avatar`, `dashboard`, `kbd`, `prose`) carried no `improve` entry at
       all for their `typography: 2`, and two pointed at "roadmap 92.5" and
       "roadmap 94.1" — neither of which has ever been a numbered item. Those
       six were published on component pages as a 2/3 with nothing behind
       them.

       Fixed three ways: **94.13** created for the six raw font-sizes with
       Accept criteria that force a decision rather than a tokenisation; every
       `improve` entry now **names its dimension** (`"typography — …"`), which
       makes the score↔follow-up link checkable and tells a reader which rule
       a gap belongs to; and `check-dsa-scores.mjs` now asserts the
       **reciprocal** of yesterday's rule — no dimension below 3 without an
       entry naming it. Red-proved by recreating this exact defect.

       Clause 2 (deprecations): one, `date`, and its migration note is already
       on the page, in the CHANGELOG and in the CSS header. Nothing owed.
       Clause 3 (keeps): five recorded in the report so a future sweep does
       not re-open them — `tabs`' mask alpha (judged four times now), print
       hex, em letter-spacing, the two feature pages, and `hierarchy: na`.
       Original text follows. Every "improve" becomes a queued item
       with its own Accept criteria; every "deprecate" gets its migration note;
       every "keep" is recorded so the next sweep doesn't re-litigate it. The
       report lands in `.roundtable/` like the other grills.

## Slice 36 — vertical tabs (owner wishlist, 2026-08-18)

Resolves the "horizontal tabs" note from 30.0: the ask is a **vertical** tab
list — the left-rail shape ERP settings screens use.

1. [x] **36.1 — `.bo-tabs--vertical`, one setting rather than a component.**
       The list is `display: flex`, so vertical is a direction change plus the
       panel sitting beside it. A modifier, not a second component.

       **Three costs, checked before queueing rather than during:**
       - **Keyboard.** `initTabs()` handles ArrowLeft/ArrowRight only
         (`tabs.ts:105`). The APG drives a vertical tablist with
         **ArrowUp/ArrowDown** and requires `aria-orientation="vertical"`.
         Shipping the CSS alone gives a rail a keyboard user cannot drive in
         the direction it points.
       - **The overflow fade.** 30.1b's mask fades the INLINE edges. A vertical
         rail overflows on the BLOCK axis, so the fade must follow the
         orientation or it dims the wrong edges.
       - **Narrow screens.** A left rail has nowhere to sit below the shell
         breakpoint; it becomes the horizontal strip — the container-query
         question `.bo-sidebar-nav` already answers.

       Accept: `aria-orientation` set by the behavior, not asked of the
       consumer; Up/Down drive vertical, Left/Right still drive horizontal; the
       fade follows the axis; collapses to horizontal when narrow; **an
       executable claim per direction**, because 35.1 just proved a tab demo can
       look right and work exactly once. Cost line stated on landing.

       **Landed 2026-08-18.** Cost: **1 new public class** (`.bo-tabs--vertical`),
       15 selectors, 0 new behaviors — `initTabs()` gained orientation-awareness
       rather than a second entry point. Bundle 73 -> 75 kB min (11.8 -> 12.0 kB
       gzipped). Orientation is read from the RENDERED flex-direction, not the
       class, which is what makes the narrow collapse carry the keyboard axis and
       the fade axis with it for free. Four executable claims (35 total): Up/Down
       drive the rail and Left/Right do not, Left/Right still drive the strip and
       Up/Down do not, the rail genuinely scrolls with a block-axis fade, and the
       collapsed rail goes back to Left/Right. Live-verified in the container at
       1440 and 390 in both themes.

       **Found during, not after:** the rail did NOT scroll on the first build —
       `align-content` only distributes spare space, so a flex line taller than
       its box overflows instead of being clipped, and `overflow-y: auto` had
       nothing to scroll. Measured 0px of scrollable height while the page claimed
       it scrolled: the same shape as 30.1's three-tab demo that could never
       overflow. Fixed with `max-block-size: 100%` and gated by a claim.

## Slice 35 — P0: tabs worked exactly once (owner report, 2026-08-18)

1. [x] **35.1 — Every tab owns its panel; two mechanisms added** (2026-08-18).

       **Root cause.** The 9-tab overflow demo I added in 30.1 gave every tab
       `aria-controls="ov-p"` — one shared panel. `initTabs()` loops the tabs
       setting `panel.hidden = !selected`, so with nine tabs naming one panel
       the LAST in DOM order decides, and it is unselected. Reproduced: on load
       the panel is visible; after any click `panelHidden: true`. It worked
       exactly once because the server-rendered markup starts visible.

       **Why it shipped.** I built that demo to prove the strip *overflows* and
       measured scroll, fade and keyboard focus — and never clicked a tab. The
       claim I wrote asserted the things I was thinking about, so it passed.
       Every class was real and every attribute value legal, so `bo-check-markup`
       was silent; the ARIA is individually valid and only the RELATIONSHIP is
       wrong, so axe was silent too.

       **Two mechanisms, deliberately independent.**
       - *Structure*: `bo-check-markup` now fails when tabs in one tablist share
         a panel id — it ships to consumers, who can make the identical mistake.
         Red-proved: reintroducing it fails the build with "9 tabs in one
         tablist share 1 panel id(s): ov-p-0".
       - *Behaviour*: `check:claims` (now **31**) clicks tabs 1, 3 and 9 and
         asserts each reveals its own panel with exactly one visible.

       The pair matters: a static check proves the markup is shaped right, a
       runtime claim proves the thing actually works, and they fail
       independently. Either alone would have missed some version of this.

## Slice 34 — field editor: per-row save is the wrong idiom (owner report, 2026-08-18)

Owner: "save button in the wrong place… looks like AI slop". Correct, and the
placement is the symptom rather than the fault.

**Measured on `/patterns/field-editor` at 1440:** the Save button sits **228px
from the field it saves**, in an actions column **340px wide — 37% of the
926px table** — that is empty until a row goes dirty. Wider viewports separate
them further, which is what the owner's screenshot shows.

**Root cause: I applied M1 to a screen that is not M1.** Row-swap inline edit is
the idiom for a table of RECORDS — each row is independently saveable, so a
per-row Save belongs to it. A field editor's rows are the FIELDS OF ONE RECORD.
Per-field save means six round-trips for one logical edit and a Cancel that
undoes one field of a change the user thinks of as whole. Checked the boundary
rather than assuming: `/patterns/editable-grid` (9 record rows) and
`/components/inline-editing` (3) use per-row save **correctly**; only this page
misapplies it, so the group is one page, not a cluster.

**Proposed, per the owner's two options plus a third:**

- **Default — form-level save (recommended).** One Save/Cancel for the record in
  a footer; per-row dirty marking stays (the band already works); one request.
  Drops the actions column entirely, recovering 37% of the table width and
  removing the 228px separation by removing the control that was separated.
- **Variant — live save.** `data-row-edit="live"` **already ships**: each
  committed change saves immediately, no buttons at all. Right for settings-style
  screens where fields are independent and there is nothing to cancel as a set.
  Needs per-field success/failure feedback, which is the honest cost.
- **Rejected — move the buttons into the value cell.** The cheap fix. It puts the
  control next to the field and keeps the model that caused the problem: six
  round-trips, and a per-field Cancel.

1. [x] **34.1 — Rebuild `/patterns/field-editor` around form-level save.**
       Accept: no per-row action column; one Save/Cancel for the record; dirty
       fields still marked individually; **0 new selectors** as before; the page
       states when to use live save instead and links the variant; the executable
       claim is updated (it currently asserts per-row Save/Cancel appear).

2. [x] **34.2 — Write the distinction into DESIGN.md's four-pattern table.**
       M1's row says "config and lookup tables, master-data upkeep — the SM30
       case", which is what let a single-record form look like M1. Accept: M1
       states it is for a table of RECORDS, and that a list of one record's
       FIELDS is a form — with the pointer to whichever save model 34.1 lands on.
       This is the line that would have prevented the mistake.

## Slice 33 — using this framework from ANOTHER repo, with AI (owner question, 2026-08-18)

Owner asked how to improve AI comprehension and prevent slop when building an
ERP in a different project with this framework. Slice 32 built the machinery;
this slice is about it actually reaching that repo, which is a different problem
— everything so far is discoverable only by someone already reading these docs.

**What already ships and is usable from outside today:** `llms.txt` (20.5 kB,
now including "Deliberately absent"), `api.json` with attribute values,
`bo-check-markup` as a package bin, the generated per-component ClassRef and
ApiTable, and the behaviors manifest.

**The gap: none of it is wired up for them.** A consumer must know llms.txt
exists, know to feed it to their assistant, know the checker exists, and know to
put it in their build. Each is a step where the default is "does not happen".

1. [x] **33.1 — `/getting-started/ai-assistants` ships the paste-in block**
       (2026-08-18) — **65 lines, generated**, under the ~60-line intent once
       wrapping is counted: where `llms.txt` lives, `npx bo-check-markup` as the
       verification step, the four maintenance patterns as the decision frame,
       the deliberately-absent list, and the rules a linter cannot enforce.

       Generated from DESIGN.md's two tables plus the markup rules, not
       restated — a hand-written snippet is stale the first time a refusal
       changes, and a stale instruction file is **worse than none**, because it
       teaches an assistant something the checker then rejects. The rules moved
       out of `gen-llms.mjs` into `src/data/markup-rules.mjs` so `llms.txt` and
       this page read one source; that was the choice between sharing them and
       restating them, and restating is how drift starts.

       Red-proved the guard: deleting the M3 row from DESIGN.md **fails the
       build** naming the counts (`absent=8, patterns=3`) rather than shipping a
       snippet silently missing a pattern.

       Measured and fixed one thing on the way: the block scrolled **1035px
       sideways** at 1440 before wrapping — unacceptable for something meant to
       be read here and pasted into a file a human opens later. Wrapped at 78
       columns; horizontal overflow is now 0.

2. [x] **33.2 — Say how to wire the checker into a consumer build.** The tool
       exists and nothing tells anyone to run it. Accept: the troubleshooting
       or installation page shows the npm script and a CI step; states that it
       needs BUILT html (it reads rendered output, not templates); and states
       the honest limitation — it validates classes and framework attribute
       VALUES, not whether the markup means anything.

       **Landed 2026-08-18** on `/getting-started/installation` — the setup page,
       not troubleshooting: troubleshooting is where you go once something is
       already broken, and the point of this is to catch it before that. npm
       script + CI step, the built-HTML requirement stated (with the answer for
       server-rendered stacks, which have no HTML until they render), and the
       limitation stated as "a spell-checker, not a reviewer". Troubleshooting
       links across to it.

       **Two gates came out of writing it**, both for things nothing verified:

       - `check:package` — the page tells consumers to run `npx bo-check-markup`,
         which works only if the `bin`, its script and `dist/api.json` all survive
         packing. `files` is a hand-maintained allow-list, and narrowing it is a
         normal-looking edit that breaks nothing here and everything downstream.
         Asks npm what it would actually pack. Red-proved both ways.
       - **anchor verification in `check-links`** — fragments were STRIPPED before
         checking, so 30 cross-page fragment links and every same-page anchor were
         unverified. Found by writing a dead `#check-your-markup-in-ci` link into
         troubleshooting and only catching it by hand. Immediately found 2 real
         dead links in `/patterns/master-detail` (rows 2 and 3 pointed at panels
         that never existed). Also tightened `resolveFile` to require a FILE:
         `access` succeeds on a directory, so a link to a page with no emitted
         `index.html` had been passing.


3. [x] **33.3 — Measured, and it found two real gaps** (2026-08-18) — taken
       BEFORE 33.1/33.2 on purpose: the measurement decides whether more
       machinery is worth building, and this project has twice built on an
       unmeasured hypothesis.

       **Method, with its limitation stated.** I have worked in this repo for
       many wakes and cannot unknow it, so this cannot measure a naive agent's
       error rate. What it CAN measure rigorously is whether `llms.txt` is
       sufficient on its own: build a realistic PO-list screen using only that
       file as framework input, then run `bo-check-markup` and record every
       place the file left me guessing.

       **Result: exactly one machine-detectable error** — an invented
       `data-row-state="approved"`. The cause was predicted before the build
       started: `llms.txt` published `data attrs: data-row-state` and **no
       values**, so 32.1's work reached `api.json` and the rendered `ApiTable`
       but never the artefact a consumer's assistant actually reads. Twelve
       components listed attributes; **zero** listed values.

       **And one error the checker structurally cannot catch.** `llms.txt`'s
       "Rules your markup must follow" never said a scrollable region must be
       keyboard-reachable — its only mention of `tabindex` concerned
       `initTabs()`. A fresh agent building a table from it ships
       `scrollable-region-focusable`, which is not a class or a value, so no
       markup linter can infer it. I only avoided it from repo knowledge, which
       is exactly the contamination this method exposes.

       Both fixed in the generator, then **re-measured**: values now publish as
       `data-row-state="dirty|error|warning"`, the rule is stated, and the same
       screen passes clean. Also noted, not yet fixed: `data-bo-overflow-watched`
       (internal bookkeeping) and the truncated `bo-cb-opt-` prefix are
       published as if they were consumer hooks — noise in the machine surface.


## Slice 31 — DESIGN.md's own four-pattern table is wrong (2026-08-18)

Found by checking the docs for **promises never fulfilled** — the method that
turned up the missing AG Grid recipe. DESIGN.md's "Data maintenance: four
patterns, no grid" table is the project's answer to "how do I let users maintain
this data", and two of its four rows are wrong.

1. [x] **31.1 — M3's status line corrected** (2026-08-18) — DESIGN.md said mass change was "Absent, queued as 25.2"; it shipped 2026-08-17 and the row now says so and links to `/patterns/bulk-actions`, the po-app flow and the two `check:po-app` assertions. DESIGN.md says mass change is
       "**Absent.** Queued as roadmap 25.2". It **shipped 2026-08-17**:
       ROADMAP 25.2 is ticked, it is documented on `/patterns/bulk-actions`,
       and `check:po-app` asserts it twice (an invalid target returns 422 and
       changes nothing). A reader deciding how to maintain data is being told
       the honest answer to the grid request does not exist yet.
       Accept: the row states what ships and links to it.

2. [x] **31.2 — M2 master-detail documented** (2026-08-18) —
       `/patterns/master-detail`, the six gated sections, and the
       panel-vs-dialog-vs-page-vs-inline decision table, since choosing wrong is
       the actual failure mode. DESIGN.md's row now links to it.
       **Pass condition met: 0 framework CSS changed, and all 34 classes
       verified present in the shipped CSS.**

       Live verification earned its place three times over. (1) My first
       measurement said the grid was `display: block` — I had queried
       `.bo-app-shell__main` and matched the DOCS shell, because the page is
       itself inside one. (2) Scoped correctly, it showed `0px 292px` at 390:
       the master list **collapsed to 2px** while the panel took the width,
       flatly contradicting my own prose about degrading to a drawer. Fixed
       with an auto-stacking track. (3) The embedded `.bo-app-shell` forced a
       900px box of dead space, because the shell is `100dvh` by design — the
       demo is a plain bordered grid now, 261px at 1440.

       And one invented API caught by inspection rather than by a gate: I wrote
       `data-row-state="selected"`, which does not exist — the framework styles
       `dirty`, `error` and `warning` only. The prose had promised a highlight
       that would never appear. Removed, and the page now states plainly that
       "currently open" is application state with no framework tint, and that
       `aria-current` carries the announcement regardless. **My class check
       catches invented CLASSES but not invented ATTRIBUTE VALUES** — worth
       knowing.

  Original text: Its own row admits it:
       "composable today, **not yet documented as one named pattern**" — and
       DESIGN.md calls M2 "**most master-data maintenance in practice**", so the
       most common case is the only one without a page. Verified the gap rather
       than trusting the note: `/patterns/record-detail` mentions dialog, side
       panel, offcanvas and drawer **zero times** — it documents the record
       FRAME, not the row-opens-a-record interaction.
       Accept: a pattern page carrying the six gated sections, composing
       `.bo-dialog`/offcanvas + the record frame + row-edit with **0 new
       selectors** as the pass condition; it must say when to use a dialog
       versus a side panel versus a full page, since choosing wrong is the
       actual failure mode; and the DESIGN.md row links to it.

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

0. [ ] **30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).**
       Recorded here so they are not lost in chat. Both have two readings that
       lead to materially different work, so neither is buildable as written.
       - *"check out overview. the sidebar menu."* — either (a) review the docs'
         OWN landing page and nav, or (b) a new ERP pattern page: an
         overview/dashboard screen with a module sidebar. (b) is a slice of
         work; (a) is a review.
       - *"horizontal tabs"* — **ANSWERED 2026-08-18: vertical tabs** (reading
         (a)). Queued as 36.1; this half of 30.0 is closed.

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

5. [ ] **30.4b — Windowed list: server chunks, client releases (W4).**
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
       scope before build.

## Slice 29 — owner bug report (2026-08-18)

1. [x] **29.1 — P0: dropdown locked to the viewport on scroll** (2026-08-18) —
       reported by the owner mid-release with a screenshot showing the filters
       "Save view" menu floating over unrelated content. Triaged P0 per the
       dispatcher (a bug jumps the queue) and fixed before publishing rather
       than shipping a known-broken control.

       Root cause: `.bo-dropdown__menu` is a popover in the top layer at
       `position: fixed`, positioned by `initDropdowns()` in VIEWPORT
       coordinates — and `position()` ran once, on the `toggle` open event.
       Scrolling moved the trigger and left the menu behind. **Measured: the
       menu's top stayed at 720px while its trigger's bottom travelled 844 ->
       594.** Resize was unhandled for the same reason.

       Fix: reposition on scroll and resize while a menu is open, listeners
       attached only for that window. Scroll is captured, because the trigger
       usually sits inside a scrolling container (the app shell's main region)
       and a non-capturing window listener never sees it. **Cost line: 0
       selectors, 0 CSS; +2 listeners, live only while open.**

       Red-proved twice over. The first repro was WRONG and passed identically
       with and without the fix — it set `scrollTop` and read the rectangles in
       the same synchronous block, before the scroll event had dispatched.
       Corrected, it separates them. `check:claims` is now **25**, and the case
       scrolls TWICE on purpose: with the bug present one of the two movements
       happened to land 6px from correct, which a single-scroll assertion would
       have reported as a pass.

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

Both items come from `.roundtable/grill-objective-slices23-25-2026-08-17.md`.
Neither is a defect in shipped code; both are gaps in how far verification
reaches.

1. [x] **26.1 — Reference app smoke-gated** (2026-08-17) — `check:po-app`
       boots the app on a free port (no container) and verifies **7**
       behaviours the docs assert plus axe over 6 routes x 2 widths.
       **Measured cost: 11.9s**, not the +30-60s I estimated in the grill —
       the estimate assumed a container boot the gate turned out not to need.
       Both halves red-proved: removing the invalid-target guard fails the
       behaviour half, removing a row checkbox's `aria-label` fails the axe
       half. **Cost line (24.R2): 0 selectors, 0 CSS, 0 behaviors; +1 env var
       (`PORT`, default unchanged) so the gate needs no fixed port.**
       Original text: `examples/po-app` is what
       24.R1 requires work to be exercised in and what four docs pages cite as
       the working implementation, and **nothing tests it**. Measured this
       wake: axe over 6 routes x 2 widths is clean today, and several
       documented po-app behaviours (the disabled apply button at zero
       applicable rows, "an invalid value changes nothing at all", href-based
       filter removal surviving the back button) were verified by hand and are
       not repeatable. Accept: CI boots the po-app, asserts those behaviours
       end-to-end, and runs axe over its routes; the added cost is stated and
       measured against the 288s budget (estimate +30-60s); red-proved.
2. [x] **26.2 — CI-reach rule written into CLAUDE.md** (2026-08-18) — new
       section "A gate that only runs in CI is not known to work": CI's full
       checkout is the most permissive environment the build sees, so verify a
       new gate in the **narrowest context that must run it**. Two consequences
       stated outright — a gate that cannot run must fail loudly rather than
       skip quietly, and a gate needing a human to start something is not a
       gate.

       Followed the rule on the way out rather than only writing it: rebuilt
       the po-app image (the narrowest context — it copies only `packages/`,
       so `DESIGN.md` genuinely is not there) and confirmed the core gates are
       portable today. It passes, and says so honestly: "DESIGN.md count NOT
       CHECKED (file absent)".

       Also folded this session's four new red-proof traps into the
       red-proving section, since each one produced a green "red test": an
       injected element that renders 0x0 (axe skips it), an injection landing
       inside an HTML comment, grepping a source spelling against minified
       output, and — the measurement counterpart — reading overflow off a box
       that shrink-wraps its own content, which reports zero forever.
       Original text: Twice in one session
       a gate was green in CI and wrong elsewhere: `check:rtl`'s DESIGN.md
       assertion broke the po-app image build (that context copies only
       `packages/`), and the axe sweep drifted red for a week because it
       needed a hand-started container. Accept: CLAUDE.md's gate-discipline
       section states that CI's full checkout is the most permissive
       environment the build sees, so a gate that only ever runs there is not
       known to be portable — verify a new gate in the narrowest context that
       must run it.

**DEFERRED (27.6b):** the review's four top-level tabs (Docs / Components /
Patterns / Reference). Without them 14 group summaries are always on screen,
which is why the nav lands at ~1100px rather than the 600-900px the review
estimated. Tabs would also let the "Patterns:" prefix go, buying back ~70px of
label width. (That prefix is no longer load-bearing for P3-2 — 27.8 fixed the
clipped label at the framework level, so long labels wrap instead of spilling
whatever the group names are.) Not queued yet:
it is a second IA change on top of one just shipped, and worth living with the
collapsible version first.

**DEFERRED, with a trigger (not a queue item):** extracting the document
identity line into a component. It is the one composed shape that is pure
repeated markup with no app-specific logic, so the charter's "lets a consumer
delete code" test arguably fails for it. Both current uses are ours, and the
reusability rule needs >=2 *independent* compositions. **Revisit on a third
use, or the first consumer report of copying it** — recorded so this stays a
trigger rather than a mood.

## Slice 25 — carried forward (2026-08-17 reconciliation)

Two pieces of work were accepted during Slice 24 but never given a
checkbox, which made them invisible to the dispatcher — recorded as real
items now rather than left as prose.

1. [x] **25.1 — M1-M4 doctrine in DESIGN.md** (2026-08-17) — new
       "Data maintenance: four patterns, no grid" section: a table naming all
       four, what each is for, and its real status (M1 ships, M2 composable
       but unnamed, M3 absent → 25.2, M4 shipped as 24.3). Every claim in it
       verified against the tree, not asserted. **Cost line (24.R2): docs
       only, 0 selectors, 0 CSS, 0 behaviors; +6 lines in check-rtl.**
       Found while writing it: DESIGN.md still said logical properties had
       "the one physical exception" months after there were five — stale
       because **nothing read DESIGN.md**. Corrected, and `check:rtl` now
       asserts the count appears there too, so the third copy of that number
       cannot drift again (red-proved). Original text:
       Accepted as doctrine in Slice 24 (row-swap inline edit /
       master-detail / mass change / Excel round-trip) and referenced from
       `/patterns/staging`, but DESIGN.md still does not answer "how do I
       maintain data here", which is why the grid question keeps recurring.
       Accept: DESIGN.md names all four, says which ship today (M1 largely
       does; M4 landed as 24.3) and which do not (M2 master-detail, M3 mass
       change), and links the patterns that implement them. Docs-only.
2. [x] **25.2 — M3 mass change** (2026-08-17) — documented on
       `/patterns/bulk-actions` as a second action on the SAME contract;
       po-app carries a working cost-centre mass change. **Cost line (24.R2):
       0 new selectors, 0 new CSS, 0 new behaviors** — `formaction` re-points
       the existing form's checked ids at a second endpoint and the dialog's
       field joins it via `form="po-bulk"`, so there is one selection and no
       duplicate state. Rule that came out of building it: **validate the
       OPERATION before touching a row** — a bad target value is the whole
       request being wrong, so it returns 422 with a document-level message
       and changes nothing, rather than N identical row errors. No-op rows
       ("already on CC-9002") are reported rather than counted as changed,
       because a count including no-ops lies about what happened.
       **This closes M1-M4** — all four data-maintenance patterns now ship or
       are documented as composable. Original text:
       genuinely absent pattern from M1-M4, and the honest answer to
       "update 200 records" that people reach for cell editing to solve.
       Accept: extends the existing selection + bulk-action contract rather
       than adding a component; one validated operation instead of N
       hand-edits; po-app carries it; live-verified.

**OPEN OWNER DECISION (unchanged, carried from Slice 24):** autosave
reverses `/concepts/concurrency`'s published "nothing auto-saves"
guarantee and leaves 409-during-autosave undefined. Silence leaves the
current guarantee standing.

**MILESTONE DONE:** the overdue **Objective** pass ran 2026-08-17 covering
Slices 23-25 —
`.roundtable/grill-objective-slices23-25-2026-08-17.md`. It found **no defect
in what those three slices shipped**; both real findings are about
*verification reach* rather than code, and are queued as Slice 26 below.
Precedence note for the dispatcher: rule 5 (backlog empty → Explore) fires on
the same wake a slice closes, so it will starve rule 6 forever unless the
milestone is taken first. It was overdue by three slices before anyone noticed.

## Slice 24 — triaged from "ROADMAP DIRECTION v1.2" (external review, 2026-08-17)

An outside reviewer submitted a direction document (transactional-core
depth, anti-Fiori reasoning, a data-maintenance decomposition, and process
rules). Reviewed against the Objective and against **what actually
ships** — that second half mattered: roughly half the proposed items were
already built, and three contradicted shipped, gated decisions. Triage
outcome below. Verified against the tree, not assumed.

### Closed on arrival — already shipped

- **v1.2 item 7 (empty / loading / error states) — DONE, no work.**
  `.bo-skeleton` + `.bo-state` + `/components/state-patterns` ship, and
  both empty variants (first-run vs filters-exclude-everything) were
  verified live in `examples/po-app` on 2026-08-17.
- **v1.2 item 6 (formatting contract) — substantially DONE.** `.bo-amount`
  already sets `tabular-nums`; `money` / `date` / `quantity` components and
  `money-field.ts` ship. Residual is a docs-only task, queued as 24.5.
- **v1.2 item 3 (field-first validation) — the field-first half is DONE.**
  `/patterns/validation-summary` + `initValidationSummary()` ship. Only the
  document-level message strip is new; queued as 24.4.
- **v1.2 M1 (row-swap inline edit) — substantially DONE.** `row-edit.ts`,
  `/components/inline-editing`, `/patterns/editable-grid`, plus
  `data-row-state="dirty"` and `.bo-data-table__row-edit-actions`.

### REFUSED, with reasons

- **B3's "no RTL until a consumer needs it" — REFUSED.** Contradicts
  shipped reality: the stylesheet is logical throughout, five flip sites
  are documented, and `check:rtl` gates it in CI as of 2026-08-17.
  Adopting this non-goal means deleting working, gated functionality.
  The rest of B3 (no client-side routing, no data layer, no i18n engine,
  no command palette) is accepted and already consistent with DESIGN.md.
- **New components `.bo-value-help` and `.bo-staging-table` — REFUSED as
  named.** Fails *less-for-more*'s refuse test ("any second way to do
  something that already works"): entity selection is `.bo-combobox`, and
  per-row batch results are `/patterns/bulk-actions`. The *capabilities*
  behind both are accepted — as extensions, below.
- **v1.2 item 3's "badge that scrolls to the first error" — REFUSED.**
  `initValidationSummary()` deliberately focuses the SUMMARY first, citing
  WCAG/GOV.UK precedent so a screen-reader user hears the overview before
  being dropped into a field. The proposal reverses a considered
  accessibility decision; the shipped behaviour stands.
- **v1.2 R1 as written ("live in a production screen") — REFUSED, rewritten
  as 24.R1.** This project has no production screens; as written the rule
  halts the roadmap permanently.

### OWNER DECISION required — not queued as work

- **v1.2 item 2 (autosave / draft contract).** `/concepts/concurrency`
  states plainly: "Nothing polls, nothing auto-saves, nothing reloads
  underneath the user." Autosave is defensible but *reverses a published
  guarantee*, and it collides with the optimistic-concurrency policy — what
  a 409 version conflict means mid-autosave is undefined. Needs an explicit
  call before any work; silence leaves the current no-autosave guarantee
  standing.

### Accepted and queued

1. [x] **24.1 — Query-token filtering, as a pattern not a component.** (2026-08-17) — shipped in po-app + documented on `/patterns/invoice-list`. **Cost line (24.R2): 0 new selectors, 0 new behaviors, 0 new CSS** — active tokens are the existing `.bo-chip`/`.bo-chip__remove`, removal is a plain `<a href>` carrying `q` minus that token, and the server owns parsing. Verified: `status:Pending vendor:Stark` → 1 row, dropping the status token → 6, unknown key `ref:99` stays free text rather than becoming a token that matches nothing. Original text: A
       single search field taking `status:open vendor:acme`, server-parsed,
       with active tokens rendered as existing `.bo-chip`s and cleared
       individually. Chosen first: highest leverage per unit of new debt of
       anything in v1.2 — **zero new components**, it extends the filter
       bar that `saved-views.ts` already syncs to the URL, and it completes
       the filter work started 2026-08-17. Accept: documented on a real
       list pattern with the parse contract stated server-side, active
       tokens removable, live-verified both themes/widths, no new CSS
       component and no new behavior unless the docs prove one is needed.
2. [x] **24.2 — Combobox: recents-first + rich result rows + browse escape
       hatch** (2026-08-17). **Cost line (24.R2): 4 new selectors
       (`__option-code`, `__option-label`, `__option-meta`, `__group`), 1 new
       opt-in attribute (`data-open-on-focus`), ~14 lines of behavior, 0 new
       behaviors.** Building it found and fixed a real interaction bug:
       focus-to-open was impossible because `.focus()` scrolls the field into
       view and that scroll hit the close-on-scroll handler, so the list
       opened and instantly closed — worse under `scroll-behavior: smooth`.
       Scroll now FOLLOWS the focused field and only closes once it leaves the
       viewport, which is a better answer to list-drift than closing was. Also
       hardened the same handler: `Node.contains()` throws on a non-Node
       target, which was silently aborting it. jsdom never scrolls, so no unit
       test could have caught either — live verification did. 7 tests added
       (103 → 110). Original text:
       hatch.** The genuinely-new half of v1.2 item 1. ERP selection is
       Zipfian, so showing the ~20 repeat values before any keystroke is
       the real win. Accept: recents render before typing from
       server-supplied markup (no client store), option rows carry ID +
       name + one context column without breaking the existing
       `aria-activedescendant` contract, browse is a plain link not a
       modal, combobox behavior tests stay green.
3. [x] **24.3 — Staging / batch-result view** (2026-08-17) — sibling page
       `/patterns/staging`, po-app carries a working
       paste→validate→apply flow at `/import`. **Cost line (24.R2): 1 new
       `data-row-state` value (`warning`), 0 new selectors, 0 new behaviors,
       0 new JS.** `warning` SHARES the `dirty` declarations rather than
       duplicating them — two meanings, one visual treatment, no chance of
       drifting apart. Refused a third `ok` tint: a row with nothing wrong is
       a normal row, and a third colour would make the two that need
       attention harder to find. Verified live: a 4-row mixed batch reports
       "1 ready, 1 to check, 2 cannot import", apply lands 2 and leaves both
       error rows on screen. Original text:
       genuinely-new half of v1.2 item 8, and what M4 (Excel round-trip)
       depends on. Adds tri-state per row (ok / warning / error) and an
       "apply valid rows" action to the existing pattern. Accept: extends
       `/patterns/bulk-actions` or a sibling page reusing its data
       contract, the TRANSIENT-state rule holds, po-app carries a working
       upload→validate→apply flow, live-verified.
4. [x] **24.4 — Document-level message strip** (2026-08-17) — documented on
       `/patterns/validation-summary` (the page that already owns how errors
       reach the user), and exercised in po-app's import screen. **Cost line
       (24.R2): 0 new selectors, 0 new CSS, 0 new behaviors** — it is
       `.bo-alert` placed in the document header, which is the whole point.
       Ships the TEST that keeps it narrow: if the user can fix it by
       changing a value on this screen it is a field error (even a
       server-only one like "vendor is blocked"); if it is a condition of the
       document or system it is a strip. Explicitly refuses a message centre,
       and says a strip needing scroll or filters means the screen should be
       split. Original text:
       not about any one field ("posting period closed"). Accept: composes
       `.bo-alert`; explicitly does NOT become a message centre, and the
       page says why field-first stays the contract.
5. [x] **24.5 — Formatting contract docs** (2026-08-17) — two sections on
       `/concepts/i18n`, every string produced by RUNNING Intl. **Cost line
       (24.R2): 0 new selectors, 0 new CSS, 0 new behaviors; one new
       browser-free gate (`check:formatting`, milliseconds).** Executing it
       instead of writing it found three real traps: `th-TH` resolves to the
       **Buddhist calendar**, so 2026 renders as 2569 in audit timestamps
       (`-u-ca-gregory` fixes it); `en-SG` gives SGD a bare `$` while USD gets
       `US$`, so a multi-currency column needs
       `currencyDisplay: "code"`; and **ISO 4217 minor units diverge from
       CLDR display digits for 7 codes** (IQD, IDR, HUF, COP, PKR, MMK, LAK),
       so deriving an input's `step` from `Intl` silently truncates cents. The
       framework's `currencyDecimals()` follows ISO on purpose and is
       CORRECT — the gate now watches that divergence so it stays a
       documented list rather than a surprise. Original text:
       `Intl` formatting against the existing `data-currency`/UoM slots.
       Docs-only; no new API.
6. [x] **24.6 — Document frame** (2026-08-17) — scoped by MEASUREMENT, and
       the gap was real, so this did not collapse to a refusal. Before:
       `/patterns/record-detail`'s header was **127px at 1440 and 331px at
       390** — most of a phone viewport before any content — against v1.2's
       80px target, and `/patterns/detail-form` had **no identity region at
       all**, so nothing said which purchase order you were editing. After: an
       identity line measuring **36px / 68px** on record-detail and **24px /
       53px** on detail-form, all inside the budget, and the facts strip fell
       331px → 277px at phone width because Status had been duplicated in both
       places. **Cost line (24.R2): 0 new selectors, 0 new CSS, 0 new
       behaviors** — a split `.bo-cluster` holding the type badge, the record
       number and a status badge. A dedicated document-header component was
       REFUSED: it would be a second way to do what a cluster already does.
       Budget and the no-duplicate-status rule are gated (claims 18 → 22).
       Original text:
       v1.2 item 4 wants a compact document shape (identity + status in one
       line, <80px chrome, actions fixed). `/patterns/record-detail` and
       `/patterns/detail-form` may already be it. Accept: either a measured
       gap that justifies a new shape, or a recorded refusal saying the
       existing patterns cover it.

### Accepted framing and process (no build work)

- **M1–M4 data-maintenance decomposition — ACCEPTED as doctrine.** The
  strongest content in v1.2: it dissolves "we need a grid" into row-swap
  edit / master-detail / mass-change / Excel round-trip. M2 (master-detail)
  and M3 (mass change: select N, set field X) are genuinely absent and feed
  24.3; M1 largely ships. To be written into DESIGN.md as the answer to
  "how do I maintain data here", so the grid question stops recurring.
- **B1 / B2 boundaries — ACCEPTED.** One token-themed AG Grid recipe and a
  tokens→ECharts theme generator, documented, never owned. Matches the
  existing non-goals discipline and is correct economics.
- **24.R1 (rewritten one-in rule) — ACCEPTED.** No new component starts
  until the previous one is exercised end-to-end in `examples/po-app`. That
  is the dogfood discipline that has produced nearly every real defect
  found on 2026-08-17, stated as a rule.
- **24.R2 (cost line per slice) — ACCEPTED.** Every item states its debt up
  front: selectors added, JS lines, new behaviors. The Objective tests value
  but not cost; this closes that gap.

**Note on the guiding filter.** v1.2 proposes its own two-part filter
(removes a decision from every transactional screen; survives with
near-zero JS). Compatible with the Objective but not identical — the
Objective also requires surviving ≥2 independent compositions. The
Objective remains the gate; v1.2's filter is supporting rationale, so the
project does not run two competing tests.

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

Triaged 2026-08-16 (user: "well structure framework document - pls compare
with other CSS framework... make the user like to use it, easy to
navigate"). Full comparison: `.roundtable/docs-ia-comparison-2026-08-16.md`.
Fetched Tailwind, shadcn/ui, Bootstrap, Pico CSS, DaisyUI live; found 6 of 8
well-regarded patterns already in place (search, quantified landing pitch,
live interactive hero, ≤2-level nesting, philosophy/how split, install-to-
result flow) and two real gaps.

1. [x] **Demo-first, spec-last on every component page** — `ClassRef` moved
       from right after the opener to immediately before `ApiTable`, across
       all 24 pages (mechanical, content untouched); CLAUDE.md skeleton,
       `check-page-shape.mjs`, and `new-component.mjs` updated so new pages
       follow the corrected order by default. Zero exceptions across the 4
       frameworks studied that have a component catalog — this was the
       single highest-ranked finding.
2. [x] **Sidebar regrouped by task** (DaisyUI-style: Actions / Data input /
       Data display / Feedback / Navigation & layout) — replaces one flat
       22-item "Components" list plus an inconsistent 3-item "Data display"
       side-group.
3. [x] **Found + fixed while verifying**: button loading state's whole-
       element `opacity: 0.7` dropped white-on-accent text to ~3.24:1
       (axe color-contrast, serious). Removed — the documented contract
       already relies on the consumer's text change ("Saving…") as the
       visible signal, so the dimming was decorative, not load-bearing.

**Verified**: both link checks, axe zero (56 pages × 2 widths), 32 visual
baselines, 57 tests, stylelint, live both themes.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Triaged 2026-08-16 (user: "after research anything to triage the docs or add
to components that may need for ERP"). Researched SAP Fiori, IBM Carbon, Ant
Design/Pro, Salesforce Lightning (dedicated enterprise/ERP systems, distinct
comparison set from Slice 16's marketing-framework pass). Full findings +
one correction to the research agent's claims:
`.roundtable/erp-gaps-2026-08-16.md`.

1. [x] **Segmented control** (`.bo-segmented`) — appears in Carbon (Content
       Switcher), Ant (Segmented), Fiori (Segmented Button); real scenario:
       My Approvals / Team Approvals toggle, report-range switcher. Built:
       native radio-group under the hood (visually-hidden but focusable
       inputs, `:checked`/`:focus-visible` moved onto the label sibling so
       the ring traces the visible segment) — zero JS, keyboard arrow-nav
       and "n of m" free from the platform. Scaffolded via `new-component.mjs`,
       which needed a real fix first: it still searched for the pre-Slice-16
       flat `'Components'` sidebar section (silent drift since that slice) —
       added a required `--group=` flag naming one of the 5 task groups.
       **Bug found by actually clicking it, not just reading the code**:
       demo markup gave inputs `.bo-visually-hidden` but forgot
       `.bo-segmented__input`, so the state-selector CSS never matched —
       fixed across all 9 markup instances (3 demos + canonical + template).
2. [x] **File upload** — Carbon/Ant/Salesforce; scenario: attach a signed
       goods-receipt PDF or vendor contract to a record.
       **Done 2026-08-16**: `.bo-file-input` styles the native
       `&lt;input type="file"&gt;` (only `::file-selector-button` is
       CSS-restylable — the rest stays honest UA rendering, not fought).
       `.bo-file-dropzone` composes a bigger label-wrapped drag target;
       `.bo-file-list` styles consumer-rendered selected-file rows. One
       small opt-in behavior, `initFileDropzone()` — drag-over highlight +
       forwarding a drop anywhere in the box (not just the tiny native
       input) into `input.files`, dispatching a real `change` event so
       existing listeners see it exactly like a dialog pick. No custom file
       list, upload, or progress shipped — same "framework does visuals,
       you do the data" split as every other field component; pairs with
       the existing Progress component for an in-flight upload.
       Verified live: synthetic dragover/drop cycle confirmed
       `data-dragover` sets/clears correctly, `input.files` populates with
       the real dropped File, and `change` fires — not just read from the
       code. Both link checks, axe zero (58 pages), 32 baselines (verified
       stable across 2 independent re-runs after last wake's harness-race
       lesson), 57 tests, stylelint, live both themes.
3. [x] **Tag/chip (token) input** — Fiori Token/MultiInput, Ant, Carbon;
       scenario: multi-tag cost centers on a record, multiple approval-
       routing recipients.
       **Done 2026-08-16**: `.bo-tag-input` (real JS, same class as
       Combobox — no native element covers this). `initTagInput()`: Enter
       dispatches `bo:tag-add` with the typed text and clears the field
       (you validate/dedupe and append the actual chip); a remove-button
       click or Backspace-on-empty deletes the framework's OWN rendered
       chip and dispatches `bo:tag-remove` — deterministic, so the
       framework can own it, unlike addition. Keyboard access to remove
       buttons is plain Tab order (real `&lt;button&gt;`s), no reimplemented
       roving-tabindex.
       **Real bug caught by the test I wrote, not by reading the code**:
       `removeTag()` read `tag.textContent` for the removed value, which
       also picked up the remove button's own "×" label
       (`"CC-4021\n  ×"` instead of `"CC-4021"`) — fixed by cloning the
       tag and stripping the button before reading text. **Second bug
       caught live** (not by the code): `outline: none` on the field,
       intended to defer to the container's `:focus-within` border tint,
       actually removed the ONLY visible focus indicator from the
       focused element itself — a border-color change on a container is
       not a substitute for the element's own ring. Removed the override
       before it ever shipped; the plain global `:focus-visible` rule
       (same as every other input) is what actually renders now.
       Verified live: typed-and-Enter add, duplicate rejection, Backspace
       removal, and remove-button click all confirmed via real
       interaction in the browser, not just DOM assertions. 61 tests (was
       57), both link checks, axe zero (59 pages), 32 baselines (one
       harness capture flake — the same documented class as before —
       resolved by 5 consecutive clean re-runs), live both themes.
4. [x] **Standalone Avatar — PROMOTED (owner call 2026-08-16)**:
       `.bo-avatar` shipped (initials/photo disc, em-sized — no size
       modifiers by design, forced-colors border) + `.bo-avatar-stack`
       for the approval-chain scenario that motivated it; Byline now
       COMPOSES it (markup adds .bo-avatar next to .bo-byline__avatar —
       the old class stays as the flex-layout marker; **Breaking**
       CHANGELOG entry per the freeze policy). Docs page with
       stack/assignee-column demos; all composition sites updated
       (byline, approval-workflow, settings-admin); gates green,
       live-verified both themes/widths; one richtext-page capture
       flake resolved by the documented 5-consecutive-clean protocol.

**Not queued** (weak evidence or already covered, see the roundtable doc for
detail): tooltip/popover, comment/activity feed, master-detail split view,
signature capture, permission matrices, org-chart, kanban, calendar/
scheduling, audit-diff viewer, rating, notification center. **Saved views /
variant management** was flagged by the research as a gap but is already
shipped (`initSavedViews()`, documented on Filters) — corrected before
queuing, not taken on faith. **Date input** was also flagged and also
already fully covered (live-demoed on `/components/date`) — same correction.

**Verified** (item 1): both link checks, axe zero (57 pages), 32 visual
baselines, 57 tests, stylelint, live in both themes — click-toggle, real
keyboard arrow-navigation between radios, focus ring on the correct element,
disabled-segment state.

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

Triaged 2026-08-16 (3-item wishlist + attachment showing Tailwind-style
50-950 numbered ramps for mauve/olive/mist/taupe). Queued BEHIND Slice
21's remaining hardening (grill findings outrank new features).
Ground truth: the raw palette tier ALREADY uses numbered scales
(`--bo-palette-gray-50…900` etc., 80 tokens, explicitly not-API per the
versioning policy) — item 1 formalizes and extends what exists rather
than inventing a parallel system. Objective tests applied per item; one
engine-shaped sub-ask refused with the reason.

1. [x] **Pantone-style scale system — 24 general-purpose ranges**
       (attachment; scope RAISED by the owner 2026-08-16: "not limited
       to mauve/olive/mist/taupe — make it general purpose, 24 ranges,
       grouped as palettes for reusability"). Ship 24 hue ranges × 11
       steps (50-950) = 264 scale tokens as the raw palette tier:
       **5 neutrals** (gray, slate, zinc, stone, taupe), **3 muted**
       (mauve, olive, mist), **16 chromatic** (red, orange, amber,
       yellow, lime, green, emerald, teal, cyan, sky, blue, indigo,
       violet, purple, fuchsia, rose). 264 hand-picked hexes is not
       maintainable — GENERATE the ramps from a seed config via a build
       script (OKLCH ramp math: perceptually-uniform lightness stops
       shared across all hues, so the same step number carries the same
       weight in every range — that consistency is what makes
       step-aliasing reliable), output committed as
       `tokens/scales.css`, regenerated + drift-gated like every other
       artifact. Brand presets and the base semantic tokens re-express
       as ALIASES to named steps ("can define alias but should be
       align" — identity and scale can't drift apart). Docs: a
       generated "Colors" ramp-grid reference (24 rows × 11 swatches,
       the attachment's shape) separate from the semantic "Tokens"
       page. Raw tier REMAINS not-API (documented); the contrast gate
       keeps gating the semantic tier — steps inherit gating through
       aliases. Accept: 24 × 11 generated + gated; shared lightness
       stops verified (same step ≈ same contrast behavior across
       hues); presets are step aliases (parse assertions extended to
       resolve them); ramp-grid page generated from the shipped
       artifact; gates green; live both themes.
       **Spec finalized 2026-08-16 (owner agreed)** — two tiers:
       (a) **Core scales** in the default bundle — only the ~8 ranges
       the semantic tokens and presets actually alias (gray, slate,
       stone, mauve, olive, mist + the status-hue parents), so every
       shipped byte is load-bearing; (b) **Extended scales** as an
       opt-in import (`@busy-office/ui/css/scales`, the motion/htmx
       pattern) carrying the remaining chromatic ranges; the Colors
       reference shows ALL 24 ramps, marking core vs extended.
       **Plus (owner ask): grill the color/scales/tokens docs for
       PRESENTATION** — compare-first (how Tailwind, Radix Colors, and
       Carbon present color systems: ramp grids, copy-to-clipboard
       hexes, usage guidance placement, scales-vs-semantic separation),
       apply to our three pages (Colors ramp grid / Palettes / Tokens),
       then a dedicated presentation-focused adversarial pass on the
       BUILT pages before calling the item done. **Also (owner ask,
       2026-08-16): grill /base/palettes for ERP-usefulness and
       REDESIGN it** — the per-palette token tables may serve the
       framework author more than the ERP builder, whose actual jobs
       are: pick a preset, verify it's AA, copy the import line.
       **Wake-1 progress (2026-08-16)**: generator + wiring SHIPPED —
       `generate-scales.mjs` emits core (10 ranges, default bundle) /
       extended (14 ranges, opt-in `@busy-office/ui/css/scales`,
       5.8 kB standalone) / `dist/scales.json` (+ `./scales` export);
       20 ranges seed from the Tailwind v3.4 palette, the muted quartet
       OKLCH-generated on gray's measured lightness ladder; the old
       partial palette block removed from color.css (hexes now
       generator-owned, single source); reference assert verifies all
       42 in-src palette references resolve to CORE steps (an
       extended-tier reference from the default bundle fails the
       build); --check drift gate wired into the build. **One real
       fail-open caught by test:visual and fixed**: check-contrast read
       only color.css, so semantic aliases into scales.css silently
       dropped per-component pair rows from contrast.json — the scan
       now reads both files; component pages back to zero visual diff,
       landing baselines regenerated for the legitimate bundle-stat
       change (10.2 → 10.8 kB gz with core scales). Compare-first
       research DONE (`.roundtable/color-docs-presentation-2026-08-16
       .md` — 5 adopted choices from Tailwind/Radix/Carbon). **Wake-2 progress**: preset re-aliasing SHIPPED — all five
       presets are now pure step aliases with locally-defined steps
       (self-contained; indigo aligned with ZERO snaps — its hexes were
       already exact steps; the muted quartet snapped to its generated
       ramps, three just-under-4.5 light accents stepped 600→700 and
       strong→800, gate fully green at 32 pairs × 2 themes × 5
       presets); the palettes page parser now ENFORCES alignment (a raw
       hex or unresolvable alias fails the build) and displays each
       hex's step name; baselines unchanged (verified). **Wake-3
       progress (2026-08-16)**: wireframes approved via artifact; two
       owner decisions locked — (a) step count stays 11 (19-by-50
       considered, owner confirmed 11 after the perf/surface
       comparison), (b) preset LINEUP replaced: the sample five give
       way to six ERP-profile presets — graphite (slate monochrome),
       cobalt (enterprise blue), navy (deep blue: 900/950 light
       accents, 300/200 dark), forest (green; dark solid stepped
       600→700 for white-text AA), indigo (unchanged), violet
       (analytics). Core tier re-cut to 9 ranges (semantic five +
       slate/indigo/violet); muted quartet demoted to extended RANGES
       (no longer presets — all within the unreleased cycle, so no
       breaking entry). Gate green 32 pairs × 2 themes × 6 presets;
       94 tests; docs build + links green; palettes page auto-picked
       up the six (live-verified 1440/390 light/dark); landing
       baselines regenerated for the legitimate bundle-stat restamp,
       stability ×2. **Wakes 4-5 (2026-08-16): DONE** — the three docs
       pages shipped per approved wireframes (Colors 24×11 grid with
       derived-honest role bands + step→consumer tooltips + click-to-
       copy; /base/tokens semantic table with per-theme resolution and
       per-swatch anchor cross-links; /base/palettes ERP-first cards
       with the default-teal baseline card); presentation grill run (3
       seats, 24 findings, 6 P1 — all P1s closed same-wake:
       `.roundtable/grill-slice22-color-docs.md`). Item CLOSED.
2. [x] **Rich text area — chrome, NOT an engine** (Objective-scoped).
       **DONE 2026-08-16 (wake 6)**: `.bo-richtext` chrome shipped
       (container/toolbar/divider/content, focus-within ring,
       density-aware sizing, --readonly/--disabled two-channel states)
       + `.bo-prose` for stored rich content (headings/lists/quote/
       code/hr + bordered lite table); zero framework JS — the docs
       demo wires native contenteditable via a six-line consumer
       snippet (live-verified: toolbar Bold click toggles markup in
       the running page); engine refusal reasoned on the page;
       ProseMirror-shape mounting recipe + server-side sanitization
       warning; gates green (68 kB stamped), baselines regenerated for
       the sidebar row, stability ×2. Remaining spec text below for
       the record:
       The editor ENGINE is refused per simplicity/less-for-more:
       contenteditable engines (undo stacks, sanitization, selection
       models) are dedicated-library territory, and shipping one would
       be the least-simple surface in the codebase. What ships — the
       same "ready, not coupled" stance as htmx: `.bo-richtext`
       (container + toolbar + content-area chrome: focus ring, density,
       dark, disabled/readonly states) styling a native
       `contenteditable` for the light case, plus a documented
       integration recipe for a real editor library, and prose styles
       for rendered rich content (`.bo-prose`-style: headings, lists,
       tables inside content). Accept: chrome demos live (native
       contenteditable working with the toolbar posting intent events
       consumers implement); the engine-refusal reasoning stated on the
       page; integration recipe with one named library shape; gates
       green.
3. [x] **WYSIWYG editable table — display-identical click-to-edit**
       **DONE 2026-08-16 (wake 7), via the Objective's lean path**: NOT
       a display↔editor swap engine — the existing `--seamless` SETTING
       widened to the remaining cell types (`.bo-select--seamless` with
       hover/focus chevron reveal incl. dark URIs,
       `.bo-tag-input--seamless`; checkbox already display-identical),
       so at rest the grid is pixel-comparable to a read-only table
       while every control stays REAL — keyboard/AT semantics never
       change between modes (no "Enter to edit" needed: focus IS edit).
       Zero JS change — bo:cell-change/dirty/row-save/live compose
       unchanged, exactly as Accept required. New WYSIWYG section on
       /patterns/editable-grid (demo + keyboard path + two-channel
       statement), live-verified 1440/390 light/dark incl. hover
       reveal. If the OTHER reading was intended (a table inside the
       rich-text editor), that is already served by item 2's .bo-prose
       tables — say so and a dedicated note gets added. Original spec
       below for the record:
       [INTERPRETATION — flag to correct]: read as "cells render as
       plain display text until activated" — a view↔edit mode on top of
       the existing editable-table stack (seamless inputs already
       *look* flat; this adds a true display mode: text-only rendering,
       click/Enter a cell to swap in its editor, commit on
       blur/Escape-cancel, composing row-edit's dirty/save machinery
       rather than a parallel grid). If the intent was instead "a table
       INSIDE the rich-text editor" (item 2 adjacency), say so — that
       lands as a `.bo-prose` table style + editor-integration note,
       much smaller. Accept (current reading): display mode
       pixel-comparable to a plain data-table; keyboard path stated
       (Enter to edit, Esc to cancel); composes bo:cell-change/row-save
       unchanged; tests; live-verified.

**Slice 22 follow-ups (from the sign-off grill, queued)**:
4. [x] **Stylelint naming gate — CLOSED as grill-finding CORRECTION**
       (2026-08-16): the gate already existed — packages/core/
       .stylelintrc.json (bo-BEM selector pattern + --bo-* property
       pattern, htmx/reset overrides) and CI runs lint:css in ci.yml
       AND publish.yml; the grill seat's find pattern couldn't match a
       dotfile and reported a false negative. Real sliver fixed: the
       local build chain now runs lint:css too (local = CI). Correction
       appended to the grill report.
5a. [x] **Toolbar idiom consolidation — REFUSED with reason
       (2026-08-16, Objective: simplicity for consumers)**: the
       framework's part contract is that every `__part` works with its
       own class alone; requiring `.bo-cluster` beside a part class
       pushes composition burden into every consumer's markup to save
       four internal flex declarations. Resolution went the OTHER way:
       richtext's toolbar (the outlier, unreleased) reverted to
       self-sufficient; `.bo-data-table__toolbar` unchanged; the
       duplication of one flex recipe across two parts is accepted as
       the cost of the contract. No Breaking change needed.
5. [x] **`.bo-prose` packaging — DONE 2026-08-16**: extracted to its
       own `prose` component (file, granular dist, docs page in Data
       display; richtext page keeps a pointer section); class names
       unchanged, non-breaking per the pre-1.0 dist-placement policy;
       print rules stay in print/index.css; live-verified both
       themes/widths incl. prose-inside-richtext still styled.
       Original: **`.bo-prose` packaging** — cross-cutting surface parked in the
       richtext component file (granular importers must pull editor
       chrome to get prose styles). Waits for a deliberate dist-layout
       pass (dist placement is explicitly not API until v1.0). Accept:
       prose importable standalone; api.json placement matches; no
       breaking entry needed pre-v1.0.

6. [x] **PO app: adopt Slice 22 surfaces** — DONE 2026-08-16 (container-verified: hostile-note check green incl. the content-leak fix, both themes/widths, tarball-only APIs). (graduated from the
       2026-08-16 dogfood Explore — spiked in a worktree, verified
       end-to-end, discarded per playbook; re-apply on main). Add to
       examples/po-app: brand-cobalt via the documented placement rule,
       and a rich-text approval note in the approve dialog (documented
       light-case wiring, hx-vals POST, server-side allowlist that
       drops script/style CONTENT, timeline renders the note as
       .bo-prose). Spike evidence: preset + note flow worked from the
       TARBALL with only documented APIs; hostile note (script tag +
       img onerror) stored safely once the sanitizer dropped element
       content. Accept: flow works live in the container; hostile-note
       check passes; only documented APIs used; screenshots both
       themes/widths.

7. [x] **Key-value facts (`.bo-kv`)** — DONE 2026-08-16 (page + --rows variant; record-detail facts card; po-app migrated off readonly inputs, container-verified; struck clauses recorded below). — graduated from the 2026-08-16
       Explore spike (worktree, discarded per playbook; screenshots
       prove the shape). The record-header staple (Vendor · Cost
       center · Terms · Total) has no primitive today: the homepage
       hand-rolls dt/dd with custom styles, and detail screens abuse
       readonly `.bo-input`s for non-editable display data. Ship a
       native `<dl class="bo-kv">` (div-wrapped dt/dd pairs):
       responsive auto-fit grid, density-aware values, muted uppercase
       labels, `.bo-u-tabular` for numeric facts; badges/times compose
       inside dd. Spike verified 1440 (4-col) + 390 (stacked), both
       themes. Accept: component page per the recipe; record-detail
       gains the facts card; po-app facts adopt it (its Vendor/Amount
       readonly inputs were the real abuse); gates green; live-verified.
       STRUCK with reasons (2026-08-16, per the strike-don't-overwrite
       rule): "detail-form migrates" — no readonly-input abuse exists
       there (the graduation note over-claimed); "homepage migrates" —
       the landing's .meta dl is deliberate marketing design with its
       own sub-line typography; forcing the component there changes a
       designed page for zero user benefit (Objective: refuse).

**Bug (owner report, 2026-08-16): pages render unstyled until
refresh — CLOSED, root-caused and fixed.** First diagnosis (transient
CDN skew) was falsified by the owner's second sighting; the real
mechanism is deterministic and BROWSER-side: Pages serves HTML with
cache-control: max-age=600, every deploy renames the hashed /_astro
CSS and deletes the old names, so any page whose HTML the browser
cached before the latest deploy requests deleted CSS and renders
half-styled; refresh revalidates and heals. Smoking gun (Evidence):
colors.Cm6zY1ab.css — referenced by the live HTML one hour earlier —
returned 404 after the next deploy while the current HTML referenced
new hashes. Fix shipped in pages.yml: each deploy carries the PREVIOUS
generation of /_astro forward (cache restore → union without
overwrite → save fresh-only), so one-deploy-stale HTML always
resolves; older HTML is past max-age and revalidates anyway. The
push-batching operating rule stays as defense in depth. **VERIFIED on
the first protected deploy (2026-08-16)**: the new generation shipped
(colors.Drfmq2Zm.css) while the previous generation's hashes —
including one the new HTML no longer references — still serve 200.
Failure class closed on Pages. **REOPENED for a second leg
(owner screenshot, localhost:8081) and closed same-wake**: the local
nginx served NO Cache-Control, so the browser cached HTML
heuristically; every docs rebuild renames the hashed CSS, and the
heuristically-cached HTML pinned dead stylesheet URLs until a hard
refresh — same class, different cache layer. Fix: nginx now sends
no-cache on HTML (revalidate every load; ETags make it cheap) and
immutable/1y on /_astro (content-hashed). Verified live. Residual: a
load during the seconds a rebuild is writing dist can still catch a
half-written tree, but it now self-heals on the next NORMAL load — no
hard refresh, no pinning. **THIRD LEG — the reproducible core (owner
report: recurs after refresh + navigate-away-and-back, Safari AND
Chrome) — root-caused and fixed**: the docs shell navigates with
hx-boost swapping only #main-content, and Astro INLINES small page
styles into <head> — so every boosted sidebar navigation delivered the
colors grid markup without its styles (repro loop: 30/30 broken on
link-click arrival, 0/30 on direct loads). Fix: htmx head-support
extension merges the incoming page's head on boosted swaps —
dynamically imported after window.htmx exists (a static import hoists
above the assignment and throws, proven by pageerror capture). Repro
loop after fix: 0/30; boosted 7-hop tour incl. the exact
away-and-back path: all pages styled, zero page errors. The two
caching legs were real defects but not this bug's core. **FOURTH PASS
— owner root-cause doc (`colorscalesrootcause.md`) adopted, and it was
right where I was incomplete**: head-support fixed the merge but left
page LAYOUT depending on a runtime merge that can silently not run.
Adopted its recommended fix — `inlineStylesheets: 'never'` (page CSS
ships as <link> in the shared bundles, which boosted swaps leave in
place by construction, killing the class on every page, not just
colors) — plus its hardening: (a) registration race closed by loading
htmx and head-support as SIDE-EFFECT module imports in dependency
order (synchronous, no async gap); (b) new build gate
`check-boost.mjs` = static scan (no layout-bearing inline <style> in
any page head; the doc's exact 1911/1637-char blocks were what it
caught) + LIVE boosted-click probes asserting computed layout.
Red-first discipline found two of my own defects while building it:
the probe raced pushState (false green), and a bound-but-unused htmx
import was TREE-SHAKEN so htmx never loaded at all — caught by the
gate's "navigation was NOT boosted" assertion. Repro loop 0/30, gate
wired into `npm run build`.

8. [x] **Keyboard chip (`.bo-kbd`) + shortcuts-help pattern** — DONE 2026-08-16 (own recipe page; pattern page with live "?" wiring incl. the input guard, verified: ? opens / field-typed ? ignored / Esc closes / case preserved; trigger wrapped in cluster after a stretch find). —
       graduated from the 2026-08-16 Explore spike (static spike
       against the built dist, both themes verified). The gap: the
       framework GENERATES keymap.json and ships keyboard-first
       behaviors, but an app has no way to render shortcuts — no kbd
       styling anywhere (grep-verified). Ship: `.bo-kbd` (~12-line
       keycap chip: mono, bordered, bottom-weighted) + a
       "Keyboard help" pattern page composing .bo-dialog +
       .bo-kv--rows (near-pure composition). Spike finding to honor:
       `.bo-kv dt` uppercases key labels ("Esc"→"ESC") — the kbd chip
       must reset text-transform so case-sensitive keys read
       correctly. Accept: component-recipe page for kbd (or fold into
       an existing base page with ClassRef coverage — decide against
       the page-shape gate); pattern page with the dialog demo wired
       to "?" via app-code snippet; forced-colors story (border
       survives); gates green; live-verified both themes/widths.

**Owner tokens-page review (2026-08-16) — ADOPTED, all six items.**
Two real bugs: (1) duplicate `<main id="main-content">` was a RUNTIME
artifact — `hx-select="#main-content"` + innerHTML nested the incoming
main inside the existing one on every boosted swap (invalid duplicate
id, doubled landmark, doubled 24px padding); fixed by selecting the
incoming main's CHILDREN. (2) Phantom second scrollbar: the
`.bo-visually-hidden` primitive is `position: absolute` and the shell's
scrollers were `position: static`, so hidden captions resolved against
<body>, escaped the scroller and stretched the document to 4025px in a
740px viewport — fixed in the SHELL (`position: relative` on
`__main`/`__sidebar`), which closes it for every page, per the review's
own reasoning. Layout: reading measure capped on PROSE elements rather
than the grid column (capping the column squeezed pattern pages' full
app-screen demos — deviation from the review, verified); TOC stagger
traced to the sticky threshold pinning the rail 16px below the h1 from
first paint (`inset-block-start: 0`, measured 77 = 77). Contrast
tables: live specimens render each certified pair as itself (a
mis-wired token now LOOKS wrong), the dead 70-identical-badge column
became the highest level MET (AAA / AA / AA Large — all three values
occur), summary line above each table. Owner follow-ups same wake:
group tables share one fixed column grid (measured identical rails
across all five), and the step reference moved to its own line with
the redundant "same in both themes" text dropped.

**Owner layout-primitives review (2026-08-16) — ADOPTED (7 of 8
items), one refused, one factual correction.** Page rewritten to the
suggested arrangement: "Choosing one" decision table first, then
Stack / Cluster / Grid each with a live demo AND copyable code
(three of four sections previously had no code at all — the docs
contract every other page follows), modifiers actually demonstrated
(--tight/--loose side by side; --split as the toolbar shape; --end as
the dialog footer), app shell gains a live miniature above its markup,
a new "Composing them" payoff section (shell > stack > split cluster >
card grid), and a Knobs table with defaults PARSED from the shipped
primitive CSS (asserted, never hand-typed). Both undocumented gotchas
written up: auto-fill (not auto-fit — a lone card keeps its column
width, deliberate so an emptied dashboard doesn't reflow into one
giant card) and the min(--bo-grid-min, 100%) overflow floor that makes
the knob safe to set aggressively. Long headings shortened (they ARE
the TOC); Related gains Container queries + Density. **Factual count
bug real but subtler than reported**: the "4 primitives" prose was
GENERATED from api.primitives — it counted visually-hidden as a layout
primitive; the count now excludes it (and the shell), so it reads 3
and still can't drift. **Correction to the review**: .bo-visually-
hidden IS already documented on /base/utilities (its claim of absence
is wrong); the page now cross-links there instead of describing it.
**REFUSED — renaming .bo-visually-hidden to bo-u-visually-hidden**:
documented class names are semver API and it is PUBLISHED; a rename
costs every consumer a migration to buy cosmetic prefix consistency,
and "visually-hidden" is the conventional name people search for. The
naming exception is documented rather than fixed.

**P0 — CI red for five commits (2026-08-16), CLOSED, green at
3d2f64c.** Three distinct defects in gates I added, each found only by
CI because I verified them the easy way: (1) hardcoded macOS Chrome
path — the gate couldn't launch in Actions (fixed: resolve-chrome.mjs,
candidate list, fails loudly rather than skipping); (2) the overflow
step ran before the docs build, scandir'ing a dist that didn't exist
(moved after; script now prints "run npm run build first" instead of a
stack); (3) CI builds with DOCS_BASE=/busy-office-ui, so a base-less
harness 404'd every asset — which broke check-boost's clicks and would
have made check-overflow FAIL OPEN on CSS-less pages (fixed: shared
base-aware serve-dist.mjs). Two rules added to LOOPS: verify a browser
gate against a DOCS_BASE build, and watch CI after any push touching a
gate. Root lesson: a gate verified only in the environment it was
written in is not a gate.

**P0 (owner test report, 2026-08-16) — combobox: 5 confirmed bugs,
FIXED same wake.** A live-interaction audit of a SHIPPED component
found the module registered only four listeners, and every defect
traced to what was missing from that list. All five reproduced as
failing tests first, then fixed: (1) **Enter with the list open but
nothing active submitted the enclosing form** — clearing the user's
typed filter in exactly the filter-bar shape the docs recommend; now
swallowed, and commits the sole match when only one remains.
(2) **No focusout handling** — the popover stayed open over unrelated
content after Tab with a stale active option; now closes and clears.
(3) **The open list did not follow its input on scroll** (measured 404px
adrift); now closes on scroll — re-anchoring needs CSS anchor
positioning, which is below the browser floor. (4) **Clicking an option
dropped focus to `<body>`**; now refocuses the input per APG.
(5) **`aria-disabled` options were fully selectable**; now skipped by
the arrows and rejected by Enter and click. Plus options with no `id`
no longer yield `aria-activedescendant=""`. 99 tests (was 94); all four
behavioural fixes re-verified in a real browser. Docs corrected where
the report showed them over-claiming (popover placement is NOT
anchoring; `aria-expanded` resyncs on the `toggle` event, so assert
after a task), keyboard reference table added with the negative rows,
and the Basic demo — which had NO accessible name and is the snippet
people copy — now carries a real label.

**Queued from the same report** (documentation depth, not defects):
9. [x] **Combobox page depth — DONE 2026-08-17**: form-integration
       section (a live `data-name` demo whose hidden input carries
       CC-1180 while the field shows the label, plus the focusout
       "must match" validation the page previously only told you to
       write), field-states section, filtering-semantics callout
       (single substring, not token-based, not accent-folded — with the
       override recipe), async/server-driven options recipe (debounce,
       out-of-order guard, loading and error rows), keyboard reference
       (shipped last wake). Original: **Combobox page depth** — Form integration section (hidden input
       carrying the machine value + commit-time "must match" validation;
       the page currently says "persist it" and ships no code), States
       section (disabled/read-only/required/invalid/loading), async
       server-driven options recipe, filtering-semantics callout (single
       substring, not token-based, not accent-folded), content
       guidelines, when-to-use decision table, live no-matches demo,
       testing snippet with the toggle-timing caveat.
10. [x] **Combobox features — Objective-tested one by one, 2026-08-17.**
       ACCEPTED and shipped (4): `data-name` → generated hidden input
       (without it a combobox cannot participate in a plain form POST —
       a core ERP requirement); browse-after-commit via select-on-focus
       (the report's biggest usability hole: the committed text filtered
       the list to the one row you already had); a `role="status"` live
       region announcing result counts and "No results" (APG names it,
       and the project's two-channel rule demands it); pointer/keyboard
       active-option sync (hover and aria-selected could highlight
       different rows, so Enter committed the row the mouse was NOT
       over). All red-first, 103 tests, verified live.
       DEFERRED (2): accent folding behind a flag, option grouping —
       real but unproven demand; the filtering-semantics section now
       documents the limit and ships the override recipe.
       REFUSED (3): match highlighting (mutating option text to wrap
       `<mark>` risks the data-value/text contract for a visual
       nicety); a clear button (app code — one button beside the field;
       select-on-focus already covers recovery); wrap-around and
       PageUp/PageDown (APG-defensible as-is — documented as a
       deliberate choice in the keyboard table instead of coded).
       Original: **Combobox features worth adding** (ranked by the report):
       browse-after-commit (the single biggest usability hole — the
       committed text filters the list to one row), form value via
       `data-name` → hidden input, result-count live region, accent
       folding behind a flag, match highlighting, clear button,
       pointer/keyboard active-option sync, option grouping. Each is a
       separate Objective test — several may be refused as app code.

## Slice 23 — docs IA & depth (owner review, 2026-08-16)

Triaged from `busyofficeuidocsreview.md` (69-page crawl with word counts
and a verdict per page). The review is the most useful input this
project has received on structure; it is also ~3 phases of work. Triage
applies the Objective per item rather than accepting wholesale.

**Accepted, high value, queued in order:**
1. [x] **P1 — tokens live in five places — DONE 2026-08-16.** Split
       by AUDIENCE as the review prescribed: /concepts/tokens is now
       the single prose home (four tiers, unit doctrine, role/contrast
       guarantees) and the generated tables moved to a new
       /reference/tokens titled "Token reference" — no two pages share
       a title. /base/tokens redirects there (published links keep
       working); every inbound link retargeted BY INTENT (values and
       contrast → reference; concept → concepts). Sidebar: Base styles
       loses the duplicate, Reference gains it. Verified live both
       themes/widths, gates green incl. a DOCS_BASE build. Original:
       **P1 — tokens live in five places.** Merge by AUDIENCE, not
       topic: prose ("four tiers, unit doctrine, density aliases")
       into ONE Foundations page; the generated tables into Reference.
       Two pages literally titled "Design tokens" is the clearest
       possible signal. Accept: one prose page, one reference page, no
       duplicate titles, every inbound link retargeted, gates green.
2. [x] **P6 inversion — DONE 2026-08-16.** The assembled list screen
       left /components/data-table (which now points at the pattern in
       one line) and the detail-form screen left /components/form (which
       keeps a MINIMAL fieldset + action-bar demo — those classes are
       genuinely form components and would otherwise be undemoed). Both
       destination patterns grew the review's §5 template:
       invoice-list gained screen intent, anatomy, data contract (the
       HTMX request/response boundary), 8 states incl. the two DIFFERENT
       empties and partial bulk failure, keyboard walkthrough, print
       behaviour, scaling notes, components-used with a complexity
       badge; detail-form gained the same with a conflict/409 state and
       the read-only-role rule (render facts, not disabled inputs).
       invoice-list is the EXEMPLAR for item 3's template rollout.
       Original: **P6 inversion — component pages own components,
       patterns own screens.** Move "The full list screen, assembled" from
       /components/data-table into /patterns/invoice-list, and the
       detail-form section from /components/form into
       /patterns/detail-form. Accept: each pattern grows an anatomy +
       data contract; the component pages shed the screen prose.
3. [x] **Pattern template — DONE 2026-08-16.** All 12 pattern pages
       now carry Anatomy / Data contract / States / Components used,
       written per-screen (not boilerplate): approval gains the
       already-decided 409 path and the delegation-audit note;
       goods-receipt the offline scan queue and over-receipt tolerance;
       wizard partial persistence and double-submit; validation-summary
       the server-only-error case; app-launch the counts-may-lag rule;
       settings-admin the read-only-role and danger-zone rules;
       record-detail the stale-decision failure mode;
       reporting-dashboard per-widget independence. Gate: check-page-
       shape now enforces those four sections on every pattern page
       (red-first: 44 failures across 11 pages before the fill).
       Keyboard help moved to /reference/keyboard (it is a lookup
       table, not a screen) with a redirect. Template documented in
       CLAUDE.md. Original: **Pattern template (§5) applied to the ten
       thin patterns.**
       The review's highest-value item: anatomy, full markup, data
       contract, states, keyboard walkthrough, print behaviour,
       scaling notes, components-used. editable-grid is the model.
       Accept: template documented in CLAUDE.md + a page-shape gate
       extension so a thin pattern fails the build.
4. [x] **P7 miscategorised nav entries — DONE 2026-08-17**: Combobox
       Actions→Data input, Badge Feedback→Data display, Keyboard key
       Navigation→Data display; Keyboard help had already moved to
       Reference. Dialog stays under Navigation & layout — that group
       IS the review's "screen structure", so the entry was already
       where the review wanted it, under a different label. Original:
       **P7 miscategorised nav entries** (Badge→Data display,
       Dialog→overlays/screen structure, Combobox→Forms & input,
       Keyboard help→Reference). Cheap, no content change.
5. [x] **P8 — split /components/nav — DONE 2026-08-17.** The review
       called it the least documentation per unit of surface on the
       site: five components at ~110 words each. The four CSS files
       were ALREADY separate — only the directory bundled them — so the
       split is real, not cosmetic: breadcrumb / navbar / sidebar-nav /
       offcanvas each now have their own component directory, dist
       file, generated API table and docs page, each with content the
       old page had no room for (navbar: the environment-badge guard
       against approving in a test system; sidebar-nav: why a container
       query beats a media query for a rail inside a split view;
       offcanvas: which side to use and why, plus the RTL note;
       breadcrumb: keep trails under four levels). /components/nav
       redirects to sidebar-nav, inbound links retargeted, dist
       placement change noted in the CHANGELOG (not API pre-1.0).
       Verified live: redirect lands, drawer still opens after the
       split. Original: **P8 — split /components/nav** (breadcrumb, navbar, sidebar
       shell, drawers): 5 components at ~110 words each, the least
       documentation per unit of surface on the site.
6. [x] **Split data-table and js-behaviors — DONE 2026-08-17, SLICE 23
       COMPLETE.** The 1,820-word data-table page ("nobody reads 1,800
       words to find the sort attribute") is now three: the TABLE
       itself (structure, sort, select, states, grouping, alignment,
       measured performance), **Inline editing** (seamless cells, dirty
       state, Save/Cancel, the events you persist with — pointing at
       the editable-grid PATTERN for the assembled screen), and
       **Toolbar & grid navigation** (the two opt-in behaviors). Each
       is a separate opt-in decision with separate JS and separate
       risk, exactly as the review argued. js-behaviors keeps the
       narrative (init-once, delegation, import paths) and its
       generated event table moved to /reference/events — look-up
       material out of a read-once page. Verified live: the moved
       demos still work (dirty badge fires on the new page, toolbar and
       grid-nav present, 10 events listed). Original: **Split
       /components/data-table** (1,820 w) into table /
       inline editing / toolbar-columns-export, and
       /concepts/js-behaviors into narrative + generated event index.
7. [x] **ERP foundations gaps — DONE 2026-08-17.** Four pages, each
       written against what the framework ACTUALLY does (claims
       verified in source before writing, and the RTL claim
       smoke-tested live: dir=rtl mirrors with zero overflow).
       **Permissions & read-only** — the omit / disable / read-only
       decision table with the "never disabled inputs for display"
       rule and the server-decides-UI-reflects boundary; closes the
       review's most damning find ("permission" appeared zero times
       across 69 pages). **Concurrency & conflicts** — optimistic
       version checks over pessimistic locks (locks outlive the tab
       that took them), the 409 reload-or-overwrite contract, per-row
       conflict isolation, and what initRowEdit already tracks.
       **Internationalization** — RTL by logical properties (with the
       three explicit flips named), the never-parse-your-numbers
       boundary, string expansion at compact density, and timezone
       policy for audit trails. **Performance at scale** — the
       measured numbers incl. 4x-throttle, the row/column decisions
       they imply, and why no virtualiser (it costs find-in-page,
       native scrolling, print fidelity and SR row counts). Original:
       **Foundations gaps that are ERP-specific and genuinely absent**
       — i18n/RTL/string expansion, permissions & read-only,
       concurrency & conflicts, performance at scale. The review is
       right that "permission" appearing zero times across 69 pages is
       conspicuous for an ERP framework.
8. [x] **`Related` on 100% of pages + a "not in scope" list — DONE
       2026-08-17.** Gated, red-first: the check found exactly 6 pages
       without an onward path (five of the six Getting-started pages
       and the class index — the reader's earliest journey), each given
       real links rather than filler. check-page-shape now fails the
       build for any docs page lacking a Related footer (68 pages
       carry one; index and 404 exempt with their own navigation). New
       /getting-started/scope page states what ships and what does NOT
       with the reason and the alternative for each refusal (charts,
       rich-text engine, virtualised table, JS framework, kanban/page
       builders, icon set, state management) plus how a refusal
       reopens. Original: **`Related` on 100% of pages** + a "not in scope" list (the
       review's point that deciding-and-saying-so is itself a
       completeness signal).

**Rethink (accept the problem, not the prescription):**
- **Amount + Quantity merge.** The duplication is real (three pages
  restate the "editable X is a plain input" caveat), but they are
  separate components with separate APIs and separate generated
  tables; merging pages would fight the one-page-per-component
  contract the review itself calls the site's moat. Do the DEDUPE
  (state the caveat once, link to it) without the merge.
- **Avatar + Byline merge.** Avatar was promoted to a standalone
  primitive by owner call THIS session; merging its page one day
  later would thrash. Revisit after real adopter feedback.
- **Full five-section IA rewrite (§3).** Right direction, but a
  wholesale re-nav in one move breaks every inbound link and every
  version snapshot. Land it as items 1-6 above, then re-evaluate
  whether the remaining delta is worth a redirect table.

**Refused (with reason):**
- **Charts & sparklines component.** Out of scope per the Objective —
  a CSS-first framework shipping a chart engine is the least-simple
  surface imaginable, and "bring your own library" without tokens
  guidance is not a component. ACCEPTED SUBSTITUTE: a short
  Foundations note giving chart authors the categorical palette,
  axis/grid ink tokens, and the dark-mode + contrast rules (item 7's
  neighbourhood, ~1 page, no engine).
- **Command palette (⌘K) as a shipped component.** The docs site has
  one; the framework does not, and it is a composite widget with a
  large keyboard/focus surface serving no named adopter requirement
  yet. Document the docs-site recipe if asked.

**Explore (dogfood) 2026-08-17 — the new doctrine tested against the
reference app, and it caught a REAL defect in our own guidance.**
Spiked a viewer role and a two-tab conflict into examples/po-app in a
worktree (discarded; nothing merged from it). Permissions doctrine
held: a viewer gets key-value facts and no approve control, an editor
gets inputs — omit-not-disable works exactly as written. **The
concurrency page was WRONG in practice**: htmx discards non-2xx
responses by default, so the 409-with-re-rendered-record pattern we
published was a SILENT no-op — verified in the browser: no banner, the
dialog left open, the record quietly unapproved, and the only trace a
console error. Adding an `htmx:beforeSwap` opt-in for 409 made the
banner appear. Fixed on main same wake: the concurrency page now
carries the opt-in as a prominent warning, and /getting-started/htmx
gained an "expected non-2xx responses" section covering 409 and 422
(the validation-summary path has the same hazard). Lesson recorded:
guidance that has never been run is a hypothesis — dogfood it.

**Explore 2026-08-17 (second) — documented-claims gate, GRADUATED.**
Follow-on from the dogfood find: turned five load-bearing doc claims
into live assertions (Cancel reverts derived totals; data-loading
blocks interaction; the skip link lands after the 264-swatch grid;
read-only rich text stays keyboard-reachable; "?" opens the shortcuts
dialog but never while typing). All five hold — but the FIRST version
of the probe reported a false failure because it dispatched a
synthetic keydown on `document`, which no delegated handler matches;
fixed to drive real key events, and that lesson is now in the file's
header and CLAUDE.md. Red-proved (removed a tabindex → gate failed with
the exact reason), wired into CI as `check:claims`. Cheap to extend:
one entry per behavioural claim. Not yet covered: the 422 swap claim
added last wake — it needs a server that returns 422, so it belongs in
a po-app harness; recorded as the next dogfood target rather than
asserted.

**Dogfood 2026-08-17 (422 verification) — the claim held, and a SECOND
gap surfaced.** The 422 guidance added two wakes ago was still
unverified, so the reference app grew a real rejection flow: a reason
is required, an empty one returns 422 with the form re-rendered, values
kept, error wired via aria-describedby, dialog left open. Verified in
the browser end-to-end (the beforeSwap opt-in is now in po-app's shell
for 409 AND 422). **New finding**: one validating endpoint answers in
TWO places — the 422 lands in the form the user is looking at, the
success has to update something else (a timeline outside the dialog).
Without an out-of-band swap the success response replaced the dialog
body with a timeline and the real timeline never changed: the action
appeared to do nothing. Fixed in po-app with `hx-swap-oob` and
documented on /patterns/validation-summary as "Two swap targets, one
endpoint". Pattern holding: every dogfood round so far has found a
real defect in guidance that read fine on the page.

**Explore 2026-08-17 (third) — pseudo-locale gate, GRADUATED.** Tested
the i18n page's own claim ("headers wrap, they do not truncate";
"buttons size to content") by expanding every visible string ~35% with
accents at COMPACT density — the combination that page names as the
first to break. Result: eight text-dense pages at 1440 and 390, zero
clipped elements, zero horizontal overflow. The claim is now measured,
and the i18n page says so instead of asserting it. Graduated as
check-pseudo-locale.mjs in CI. **Red-proving it took three attempts and
that is the finding worth keeping**: the first injection targeted a
selector the page did not use, the second put max-inline-size on a
table cell (auto AND fixed table layout ignore it), and only the third
— a badge — actually clipped. Two of my three "proofs" would have
shipped a detector that could not fail. Recorded in the script header.
**And the gate paid for itself within the hour**: CI (Linux fonts, wider
than macOS) failed on /patterns/invoice-list at 390px where my machine
passed — a REAL framework defect, not gate noise. `.bo-cluster`
children inherit `min-width: auto`, so a `.bo-chip` with a long label
would not shrink and pushed the shell sideways. Fixed in the primitive
(cluster children may shrink) plus a chip width cap with ellipsis;
reproduced locally at +60% expansion first, verified at 0px overflow
after. The environment sensitivity is a feature here — CI's fonts are
a second opinion my laptop cannot give.

**Standardize 2026-08-17 (post-gate sweep).** The cluster fix was one
instance of a CLASS — flex children that cannot shrink or wrap — so the
sweep ran the pseudo-locale expansion across ALL 88 pages at phone
width rather than the gate's eight. Found exactly one more:
`.bo-segmented` could not wrap, so translated labels overflowed.
Fixed (options wrap, group caps at 100%; verified normal labels still
sit on one row, so today's rendering is unchanged). Re-sweep: 0
overflows across 88 pages at +60% text. The gate's page list grew from
8 to 14 in response — a hand-picked list only guards the pages someone
thought of — and the per-word expansion factor rose to 55% because
pages heavy in short words diluted the page-level ratio below the
German case the gate claims to model. Gate boilerplate: already shared
(serve-dist + resolve-chrome across all four browser gates), nothing
left to consolidate.

**Explore 2026-08-17 (fourth) — the print layer executed.** Print is
billed as an ERP differentiator and had never been run. Emulated print
media and asserted the contract: headers repeat (table-header-group),
rows never split, app chrome and toolbars drop, prose tables inherit
the same treatment, a real PDF renders. Seven of eight held. The
eighth was a DOCS defect: two pages claimed print "forces status
colors so a badge survives a monochrome printer" — badges actually
print as black text in a black border with NO background (badge.css,
deliberately), so `print-color-adjust: exact` on `.bo-badge` in
print/index.css was dead code forcing a colour that had already been
removed. Corrected both claims (badges survive as OUTLINES, and the
status word carries the meaning — the two-channel rule paying off on
paper), dropped .bo-badge from the rule, and kept it for timeline and
stepper markers where the fill genuinely is the signal (verified: the
marker keeps rgb(240,253,244) under print emulation). Five print
assertions added to check-claims (now 10), red-proved by giving the
badge a print background and confirming the injection landed in the
built CSS first.

**Explore 2026-08-17 (fifth) — WCAG 1.4.12 executed, gate GRADUATED.**
The docs claim "heights are minimums, text-spacing-safe" but nobody had
applied the actual user override (line-height 1.5, letter-spacing
0.12em, word-spacing 0.16em, paragraph spacing 2em). Applied it to all
88 pages at both widths and compact density. Raw result: 40 findings —
but the probe could not tell "clips anyway" from "clips BECAUSE of the
override", and 35 were pre-existing ellipsis truncation in nav and
stepper labels (a design choice, not a 1.4.12 failure). Added a
before/after baseline; five genuine failures remained, two of them
SELF-INFLICTED the previous day: the `.bo-chip` ellipsis added to fix
horizontal overflow itself lost text under spacing. Fixes: chip and
file-name WRAP instead of truncating (a truncated file name —
"vendor-signature.jpg" vs "vendor-signature-final.jpg" — is its own
bug), `.bo-avatar` clips only when it holds a photo so initials are
never cut, palette import rows wrap. Re-sweep: 0 content loss across 88
pages. Graduated as check-text-spacing.mjs in CI; the accessibility
page now says the criterion is CI-verified instead of asserting it.

**Optimize 2026-08-17 — CI duration regressed 3.5min → 7.6min; fixed.**
Five straight gate-adding rounds had a cost nobody was watching, which
is exactly what the metric rule exists for. Measured before touching
anything: the two full-site sweeps were 168s + 177s of a ~390s total,
and between them loaded every page FOUR times. Merged into one
`check-layout.mjs` that loads each page three times (390 serves both
stresses) with a 4-tab pool: **345s → 74s, a 4.7× improvement**, with
both halves red-proved independently. Note the red-proof itself
corrected a wrong assumption: removing the cluster-shrink fix did NOT
trip the overflow half, because that bug only appears under text
EXPANSION — it belongs to check-pseudo. A gate suite is only as
trustworthy as knowing which gate owns which failure.

**Explore 2026-08-17 (sixth) — bulk actions spiked; GRADUATED as a
pattern.** The owner docs review listed "Bulk actions (select 200 rows,
apply, report partial failure)" as its #2 missing pattern, and our own
invoice-list States table already promises it ("re-render the failed
rows and summarise"). Spiked it in the reference app (worktree,
discarded): two real ERP rules — a second approver required over a
limit, and an already-decided PO cannot be re-approved. Result: the
promise is expressible with **zero new CSS** — an out-of-band summary
alert, `data-row-state="error"` per failed row, and the reason as a
badge in WORDS beside the status (two-channel, so the tint is never the
only signal). Verified live: "1 approved, 1 could not be", two error
rows, reasons legible.

**One rule the spike discovered**: partial-failure state must be
TRANSIENT. The first version never cleared `bulkError`, so a row kept
showing "needs a second approver" after someone else had approved it —
the list lied. Clearing it at the start of each action fixed it
(verified: 1 error row, then 0 on the next action). That rule belongs
in the pattern.

11. [x] **Bulk actions pattern** (2026-08-17) — page shipped at
       `/patterns/bulk-actions` with all four gated sections plus the
       TRANSIENT-state rule and keyboard path; po-app carries the working
       partial-failure implementation. Building it against the reference
       app found **three defects the page itself surfaced**, all fixed
       here: (a) `.bo-badge--danger` on an error row was byte-identical
       to the row tint (measured rgb(254,242,242) light / rgb(58,29,29)
       dark, 0px border) so the pill vanished — badges now carry an
       unconditional boundary derived from their own fg, generalising
       what print and forced-colors already did; (b) the axe sweep had
       drifted red unnoticed (a demo `<main>` nested in the page's own
       main, a demo section that had lost its `<h2>`) because it needed a
       hand-started container — it self-serves and is a CI gate now;
       (c) the docs container image had been unbuildable since
       check-boost landed (no Chrome in the build stage). Original text:
       build the page from the spike:
       anatomy (selection → toolbar action → per-row result), data
       contract (POST ids, response = rows + OOB summary), states
       (all-succeed, partial, all-fail, nothing-selected, no-permission,
       stale selection), the TRANSIENT-state rule, keyboard path, and
       the components-used badge. Accept: page passes the pattern gate,
       po-app carries the working implementation, live-verified both
       themes/widths.

13. [x] **Return path from a selection to the bulk toolbar** (2026-08-17) — graduated
       from the 2026-08-17 keyboard-walkthrough execution, which measured
       the real cost: the bulk toolbar sits above the table, so
       `Shift`+`Tab` back to it is one press per row checkbox passed plus
       two (sort header, select-all) — three from row 1, thirty-two from
       row 30. Docs now state this honestly; the ergonomic gap itself is
       untriaged. **Objective test first, and refusing is a valid
       outcome**: *simplicity* — is a second focus mechanism worth it when
       the browser already offers one path? *less-for-more* — could an
       existing primitive carry it (the `.bo-data-table-container` is
       already a tab stop; the skip-link pattern already exists on
       `/base/colors` for the 264-swatch grid, and this is the same shape
       of problem)? *reusability* — the same "act on what you selected"
       return path applies to any long selectable list, not just
       invoices. Candidate answers, cheapest first: reuse the existing
       skip-link pattern; move the toolbar below the table on long lists;
       a documented `accesskey`. **Do not** invent a roving-tabindex or
       focus-stealing behaviour — the invoice-list page already commits
       to keeping screen-reader table browse mode, and this must not
       reopen that. Accept: either a shipped mechanism that makes a
       measured, gated claim true, or a recorded refusal naming which
       Objective test it failed and why the docs note is sufficient.

       **Objective verdict: all three listed candidates REFUSED; a fourth,
       unlisted answer ACCEPTED.** Skip-link — refused: it solves *bypass*,
       not *return*, and a link placed before the table is unreachable from
       row 30, which is the whole problem. Toolbar-below-on-long-lists —
       refused: it relocates the asymmetry to selections near the top and
       adds a "how long is long" decision the consumer must make (fails
       Simplicity's refuse test). `accesskey` — refused: conflicts with
       browser and AT shortcuts, no discoverability, platform-dependent; a
       second way to do something, which Less-for-more refuses outright.

       **Shipped instead: native implicit form submission.** Wrap the rows
       AND the bulk buttons in one `<form>` and `Enter` from any row
       checkbox runs the bulk action — zero presses, from row 1 or row 30.
       Accepts on all three tests: it lets the consumer *delete* code
       (`hx-include` goes away, no focus mechanism is invented), it is a
       native element behaviour rather than a new option, and it applies to
       any selectable list. Focus stays put — verified. Two contracts came
       out of building it, both gated: only the SAFE action is
       `type="submit"` (implicit submission fires the first submit button,
       which must never be destructive), and each row checkbox needs an
       `id` or htmx's post-swap focus restoration drops the user on
       `<body>`. Also found: `hx-boost` intercepts form submits, so a
       server-less demo form on a boosted page needs `hx-boost="false"`.
       Docs guidance changed from "hx-include or a plain form" (presented
       as equals) to preferring the form, with the reason.

**RTL is gated now (2026-08-17, Explore graduation).** The i18n page's
"logical throughout, three places flipped" claim was prose; executing it
found two real defects (a motion utility with a logical name and a physical
body; tree-table missing the glyph flip its sibling tree had) and the count
was wrong — it is five. `check:rtl` runs in the core build and refuses any
physical box property plus any new unflipped direction-sensitive construct.
**Still NOT covered, and deliberately not claimed anywhere:** RTL is
verified structurally (does the stylesheet mirror) and spot-checked live,
but no gate walks every page in `dir="rtl"` the way the layout sweep walks
every page at 390. If an RTL screenshot sweep is ever wanted, note that it
is a THIRD full-site browser pass — weigh it against the CI budget above,
which is the reason the layout/pseudo/axe merge was refused.

**Graduated, not shipped: density-aware control boxes (2026-08-17).**
Executing SC 2.5.8 found `.bo-checkbox`, `.bo-radio` and
`.bo-tag-input__remove` are a hard-coded `1rem` in all three density tiers —
density moves rows and type, never the control box. That is not a
conformance failure (the spacing exception carries it, now CI-gated) and the
docs state the real contract, so nothing is broken. But it IS a gap in the
density model's own story: "density as a first-class dimension" that does not
reach the controls. **Objective test before any work**: *simplicity* — does a
consumer delete anything, or is this just a bigger checkbox? *less-for-more* —
one density-aware sizing token vs per-component overrides. *reusability* —
does it serve the warehouse/tablet archetype `spacious` exists for, which is
the strongest argument in favour. **Refusing is valid**: native controls
rendered via `accent-color` do not scale cleanly, and forcing 24px+ boxes at
compact density may fight the dense-table archetype that is the framework's
core case. Accept: either shipped density-aware sizing that keeps the
contrast/target gates green and is live-verified in all three tiers, or a
recorded refusal naming which test it failed.

**Claim-execution seam status (2026-08-17).** The dogfood/claim-execution
loop has been the main source of work while the backlog sits on the single
owner-gated item, and it has been productive: htmx 409 discard, the
two-swap-target gap, a false print claim, five WCAG 1.4.12 failures, two
false keyboard-walkthrough steps, an RTL animation contradicting its own
name, tree-table's missing RTL flip, a forced-colors list drifted to 10 of
15, an inert filter bar, and `.bo-btn`/`.bo-badge`/`.bo-chip` underlining
controls on all 89 pages. **The reduced-motion pass (this wake) was the
first to find nothing** — the claim was simply true.

Executed and now gated: concurrency 409/422, print, WCAG text spacing,
pseudo-locale expansion, keyboard walkthroughs, RTL logical properties,
forced-colors, reduced-motion, bulk partial-failure, empty states,
control-anchor underlines. **Not yet executed:** the pattern-page States
tables beyond empty (loading / error / permission / conflict), density
claims, and the ACR's per-criterion verdicts — though several of those now
rest on gates above. **Blocked, not exhaustible by this loop:** item 12,
which needs owner hardware.

If the next one or two Explore passes also come back clean, treat that as
the seam being worked out rather than as a reason to hunt smaller targets,
and say so plainly per the steady-state rule in LOOPS.md.

**CI budget (2026-08-17).** `ci-total-s` and `ci-axe-step-s` are tracked
metrics now. They exist because the axe gate landed at 178s and pushed CI
2m50s -> 5m55s, and nothing noticed for three wakes — no metric watched
the number the dispatcher's rule 4 is supposed to fire on. Current: 230s
total (docs build 19s, claims 12s, pseudo 36s, layout 80s, axe 56s).
Residual candidate, deliberately NOT taken: layout + pseudo + axe each
load the same ~85 pages separately, so merging them into one pass could
save 60-80s. Refused for now — unlike the overflow+spacing merge (same
property class, same viewport configs, genuinely duplicate loads), these
three measure different things at different configs, and coupling them
would trade clarity and independent failure reporting for time that is
no longer the constraint. Revisit only if CI passes ~5min again.

**RELEASE-READY: 0.2.0 (recommendation, 2026-08-16 reconciliation
pass — publishing stays owner-triggered).** The Unreleased cycle is
complete and coherent: Slices 18–22 shipped and grilled, follow-ups
1–7 closed, backlog empty. Version: **0.2.0** (pre-1.0 minor; the
cycle carries two Breaking entries — initRowEdit select/checkbox
contract, Avatar promotion — both listed with migration lines).
CHANGELOG coverage audited this pass (two gaps found and fixed: the
24-range scale system and .bo-kv had no entries). Release checklist
when the owner triggers: (1) version bump + `npm publish` (owner);
(2) cut the docs snapshot — `node apps/docs/scripts/
cut-version-snapshot.mjs 0.2.0`, rebuild plain, commit both;
(3) verify the published tarball with the po-app Devi test (its
Dockerfile packs from source — swap to the registry tarball for the
one-off check). All gates green at head; bundle 70 kB min /
11.5 kB gz stamped.

**OWNER DECISION WANTED (moved out of the closed item 3 where it was
buried — sign-off grill process finding)**: item 3 was built as
"display-identical click-to-edit cells" (widened `--seamless`). If you
instead meant **a table inside the rich-text editor**, that need is
already served by item 2's `.bo-prose` tables — say so and a dedicated
editor-integration note gets added. Silence = the shipped reading
stands.

**Accept-drift note (sign-off grill, 2026-08-16)**: item 3's original
Accept clauses "Enter to edit, Esc to cancel" and "tests" were
superseded by the seamless reading in the same commit that shipped it —
recorded here explicitly rather than only in the rewrite: "Enter/Esc"
is struck because focus IS edit on a real control (no mode to enter or
leave); "tests" resolves as the visual-regression matrix now INCLUDING
/patterns/editable-grid/ and /components/richtext/ (the item's claims
are pixel claims; the pixel harness is the right test seam for a
CSS-only change). Process rule going forward: strike Accept clauses
with a reason, never overwrite them with narrative.

**Open question (from the Slice 22 color-docs grill, 2026-08-16)**:
dark mode never remaps `--bo-color-danger-solid`/`danger-strong`, so a
dark `bo-btn--danger` *darkens* on hover (red-600 → red-700) — inverted
against every other dark hover. Needs a deliberate decision with
contrast measurement (red-500 under white text fails 4.5, so the naive
remap is not available); surfaced by adding the two rows to the tokens
table, where the pairing is now visible.

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
