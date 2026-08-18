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
4a. [ ] **27.3b — Reference tables marked at generation time, so demo tables
       can be ignored.** The residual half of P2-2. ClassRef/ApiTable would
       carry an explicit keep-marker, letting `scope-search-index.mjs` ignore
       demo-fixture tables without taking the reference tables with them.
       Accept: demo table cells stop appearing in excerpts AND `bo-data-table`
       still finds the class index in the top 3 — both measured, since fixing
       one by breaking the other is what this item exists to avoid. Low
       priority: excerpt noise is cosmetic next to the rest of Slice 27.

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

## Slice 30 — owner wishlist, triaged (2026-08-18)

Grill: `.roundtable/grill-wishlist-2026-08-18.md`. Four requests; **two turned
out to be already-built-but-unproven rather than missing**, and the fourth was
already decided against in DESIGN.md — but the alternative that decision
promised was never written.

1. [ ] **30.1 — Prove and afford scrollable tabs (W1, rethink).**
       `.bo-tabs__list` already sets `overflow-x: auto` and its CSS claims
       "8-10 tabs in a narrow container scroll rather than clip" — but the docs
       demo has **3 tabs and measures scrollWidth === clientWidth === 342 at
       390px**, so the behaviour has never been shown or tested, and there is
       no fade, no snap, and nothing scrolls the selected tab into view.
       **REFUSED: a "slider tabs" component** — the scroll container is one
       existing declaration. Accept: a demo that actually overflows; a visible
       overflow affordance; keyboard arrow navigation cannot move focus to an
       off-screen tab; an executable `check:claims` case, since this asserts
       runtime behaviour. **Cost line target: 0 components, <=1 selector.**
       **[OWNER ANSWERED -> DECIDED: no arrow buttons.]** Grilled four options.
       Do-nothing is why the item exists. An edge fade/shadow needs a cover
       colour, and the tab list sits on **canvas** in the docs but on
       **surface** inside a card (measured: `#f9fafb`/`#0f1115` vs
       `#ffffff`/`#1a1d23`) — any hardcoded default is wrong in one of the two.
       Arrow buttons are the strongest *discoverability*, but the deciding
       question is who is **harmed** without them: touch swipes, keyboard gets
       arrow-key nav with native scroll-into-view, and a wheel-mouse user needs
       a control they can operate — which a persistent, draggable scrollbar
       already is. So arrows add discoverability, not capability, at the cost of
       markup + JS + ARIA + the component-shaped addition this item refused.
       Chosen: `scrollbar-color` (1 declaration, 0 selectors, no colour
       assumption, themable), with arrows documented as a two-button recipe a
       consumer can add.

2. [ ] **30.2 — Typed field editor pattern (W2).** One row per field, each a
       different type (Name/DOB/Age/Amount/Qty) — the SM30 master-data case and
       the best single screen for showing every typed input at once.
       **REFUSED: a new component.** It composes `.bo-kv` + M1 row-swap
       (`initRowEdit()`) + `.bo-amount`/`.bo-date`/`.bo-quantity`/`.bo-input`.
       Accept: documented as a pattern with **0 new selectors as the pass
       condition** — if it cannot be built from existing primitives, that is
       itself the finding and the item returns for rethink. Expect it to surface
       real alignment/baseline/density bugs, which is a reason to do it.

3. [ ] **30.3 — 50-column stress case (W3).** Not a feature: `.bo-data-table`
       already ships h-scroll + sticky header + sticky first column, so this
       **tests claims already made**. Accept: a 10x50 demo; the sticky-column
       boundary holds under horizontal scroll; far columns are keyboard
       reachable; SC 2.5.8 holds in dense header cells; the layout gate's
       150%-zoom pass stays green. **Must also carry column-chooser/saved-view
       guidance** — 50 visible columns is usually a symptom, and shipping a
       beautiful 50-column demo without saying so quietly endorses the
       anti-pattern.

4. [ ] **30.4a — Large-list recipe page.** The decision page DESIGN.md
       promised and nobody wrote: when to server-page, when to load-more, when
       to reach for a real grid, and the token-themed AG Grid setup for the
       residual cases. **Verified missing** — no docs page mentions AG Grid.
       Small, ships value immediately, and is the honest answer for most
       screens. Do this first.

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

1. [ ] **OWNER CALL — 0.2.0 release.** **64 unreleased CHANGELOG entries**
       against a published **0.1.1** (`npm view` confirms). Slices 24-28 —
       query tokens, staging, mass change, four placeholder-only accessible
       names, the 1.46:1 search contrast, icons vanishing in print, the
       nav-label spill — are shipped, gated, and in nobody's `node_modules`.
       `npm install @busy-office/ui` today still gets the accessibility defects
       fixed two days ago. This is the previous grill's F5 one level up: the
       stale *site* was fixed, the stale *package* was not. Publishing is
       owner-triggered by policy; the work itself is done.

2. [ ] **OWNER CALL — direction.** Recommended default: **ship 0.2.0 first,
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
