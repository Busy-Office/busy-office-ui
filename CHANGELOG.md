# Changelog

Pre-1.0: minor versions may include breaking changes; each is listed here.
Per the versioning policy (docs → Theming guide): semantic tokens, documented class
names, and `data-*`/ARIA contracts are the public API. **Per-component dist file
placement is explicitly NOT API until v1.0** — import granular files at your own
pin.


## Unreleased

### Changed

- **A dismissed toast now leaves instead of vanishing, and the stack closes
  its own gap** (roadmap 200.5). `.bo-toast` gains a `[data-state="closing"]`
  exit — `bo-toast-out`, `--bo-motion-duration-fast` on
  `--bo-motion-easing-standard` — that fades the toast and collapses its
  `block-size`/`padding-block` to zero, and `initAlerts()` holds the node for
  exactly that long before removing it. The collapse is what bounds the
  reflow: the toasts above travel by exactly the dismissed toast's own box
  and one `row-gap` (measured live: 68px = 60 + 8), continuously, and the
  removal itself moves nothing (0.06px). All of it inside
  `.bo-toast-region`, which is `position: fixed`, so nothing behind it
  re-lays out.

  **`initAlerts()`'s contract changes for toasts only, and that is the
  compatibility question worth naming rather than asserting.** An inline
  `.bo-alert` is removed synchronously, exactly as before — it sits in the
  document flow, where a collapse would move the page under the reader.
  A `.bo-toast` is now removed on a timer, so code that clicks a dismiss
  button and reads the DOM in the same tick will still find the toast,
  carrying `data-state="closing"`. **Not listed as Breaking**, with the
  reasoning: the hold is read back off the computed `animation-duration`, and
  when that is 0 the removal stays synchronous — which is every case where a
  consumer could have been relying on the old timing without also having
  opted into the animation, including `prefers-reduced-motion` and loading
  the JS without the CSS. No selector, custom property, markup or ARIA
  contract moves.

  There is deliberately **no auto-dismiss timer**, and the docs now say so as
  a position rather than leaving it implicit: the framework never removes a
  toast the reader did not dismiss, because it cannot know whether they have
  read it. Consumers who add one still own WCAG 2.2.1 — ≥5s, pause on
  hover/focus, never on a toast carrying the only route to an action.

  `prefers-reduced-motion` zeroes both directions through the shared token
  (entrance reads `0s`, dismissal is same-tick). Travel is on the block axis,
  so nothing mirrors under RTL.

- **The data-table bulk-actions bar now arrives instead of snapping in**
  (roadmap 200.4). Selecting the first row fades and lifts
  `.bo-data-table__bulk-actions` into place over `--bo-motion-duration-base`
  with `--bo-motion-easing-standard`, via `@starting-style` on the same
  `[data-any-selected="true"]` / `:has(:checked)` selector pair that already
  revealed it — so both the JS-driven and the zero-JS reveal get it, verified
  live on each.

  **Entrance only, by construction rather than by a zeroed duration:** the
  `transition` is declared on the visible rule, never on the hidden base rule,
  so the hide direction reads an after-change style that declares no transition
  and stays exactly as instant as before. There is deliberately no
  `display … allow-discrete` here — what that buys is holding the box rendered
  through a fade-out, and there is no fade-out.

  **Not breaking**, with the reasoning rather than the assertion: it adds three
  declarations to one existing rule, and the settled values are the identity
  values (`opacity: 1`, `translate: 0 0`), so a consumer's resting rendering is
  unchanged, no selector, custom property or markup contract moves, and any
  `transition` a consumer declared themselves still wins by the same cascade.

  Travel is on the block axis, so nothing mirrors under RTL — measured in both
  writing directions rather than assumed, both reading an identical `0px -4px`
  start. Wrap behaviour at 390px is unchanged: the settled geometry of the bar
  and its buttons is identical to the pre-change rendering, and the comparator
  that says so was red-proved by forcing a wrap it does not have today.
  `prefers-reduced-motion` zeroes it for free through the shared token.

- **Tab and segmented-control selection now eases instead of snapping**
  (roadmap 200.3). `.bo-tabs__tab` transitions `color`, `background-color` and
  `border-color`; `.bo-segmented__option` transitions `color`,
  `background-color` and `box-shadow` — both at the existing
  `--bo-motion-duration-fast` / `--bo-motion-easing-standard`, so no new tokens
  and `prefers-reduced-motion` zeroes them for free.

  **Not breaking**, and the reasoning rather than the assertion: this adds a
  `transition` to two rules and changes no resting value, no selector, no
  custom property and no markup contract, so a consumer's settled rendering is
  byte-identical and any `transition` they had declared themselves still wins
  by the same cascade it won by before.

  Colour only — deliberately no panel slide and no sliding-pill indicator: tab
  content is not spatially ordered, so a slide implies an adjacency that isn't
  there, and a pill's geometry breaks under wrapped, RTL or translated labels.
  Verified live that the tab strip's block-size is unchanged at the transition's
  start frame, mid-flight and settled, and that both components go instant under
  `forced-colors: active`, where the selection indicator is the only channel
  left.

## 0.6.0 (2026-08-29)

### Fixed

- **Two custom-property typos silently deleted the declaration that named
  them.** An unresolvable `var()` is neither a syntax error nor a no-op — it
  makes the whole declaration invalid at computed-value time, so the property
  falls back to its inherited or initial value and nothing warns. Both were
  measured in a real browser against the built site, not read off the source.
  - **The RF scan flash painted nothing at all.** `scan.css` reached for
    `var(--bo-motion-ease)`, which is defined nowhere; the defined token is
    `--bo-motion-easing-standard`. Computed `animation-name` on
    `body[data-scan-result]::after` read `none`, leaving the overlay at its
    declared `opacity: 0` — so the component's entire visible verdict, the
    accepted/rejected wash a picker sees in peripheral vision, was invisible
    for every user *not* in reduced motion (the reduced-motion branch sets its
    own static `opacity: 0.2` and was unaffected). Now `bo-scan-flash / 0.6s /
    cubic-bezier(0.4, 0, 0.2, 1)`, with the deliberate 600ms literal unchanged.
  - **A combobox's option code was not monospace.** `combobox.css` reached for
    `var(--bo-font-family-mono)`; the defined token is `--bo-font-mono`, which
    six other components spell correctly. `.bo-combobox__option-code` rendered
    in the body sans-serif stack, byte-identical to `document.body`'s computed
    `font-family`, losing the column alignment the tabular figures are for.

### Added

- **Dialog exit motion.** `.bo-dialog` and its backdrop only ever animated
  open; dismissal was an instant cut, disconnected from the entrance's own
  fade/translate/scale. Now closes with the identical `@starting-style` +
  `transition-behavior: allow-discrete` recipe `.bo-offcanvas` already
  shipped (143.4) — same tokens, same shape, nothing new invented. Escape,
  backdrop click, the close button, and a programmatic close all complete
  synchronously regardless of whether the animation runs or finishes;
  verified with real clicks (not synthetic DOM events) via
  `check:claims`, which caught its own harness bug along the way — an
  in-page `.click()` doesn't carry Chromium's click-to-focus activation, so
  the first version of the focus-restore check failed on every run for a
  reason that had nothing to do with the CSS.

- **Restrained, pointer-only button press feedback.** `.bo-btn:active` now
  gets a 1px `translateY` under `(hover: hover) and (pointer: fine)` — never
  `scale`, which would open a seam in a joined `.bo-btn-group`. Keyboard
  activation (Space/Enter) shows no artificial press transform, only the
  existing focus feedback; `prefers-reduced-motion: reduce` removes the
  displacement entirely rather than just skipping its animation. The
  device-capability media query alone wasn't enough to tell mouse from
  keyboard apart — a real keyboard Space press satisfied `(hover: hover)
  and (pointer: fine)` on desktop exactly as a mouse click does, and
  produced the identical transform until `:not(:focus-visible)` was added
  to separate them (buttons don't get a focus ring from a mouse click, only
  from keyboard/programmatic focus).

- **`check:token-refs`** — a build gate asserting that every `var(--bo-…)` in
  the shipped CSS names a property something actually defines. It reads both
  definition sites (CSS declarations *and* the three tokens shipped behaviours
  set at runtime via `setProperty`), and deliberately does not fail a reference
  carrying a fallback, since `var(--bo-grid-min, 16rem)` is a consumer-override
  hook that is undefined by design. It was red on the untouched tree, which is
  what makes it a gate rather than ceremony.

- **The validation summary handed you a link that did nothing.** A `required`
  control inside a container the framework hides — an inactive
  `[role=tabpanel][hidden]`, a closed `<details>`, a collapsed
  `.bo-widget__collapse` — is still constraint-validated, so it blocks submit
  and `initValidationSummary()` correctly lists it. Following that entry then
  did nothing at all: `.focus()` is a no-op on a subtree the browser does not
  render. Measured against the shipped `dist/` — `document.activeElement` stayed
  unchanged and the container stayed shut. The collapsed-card case failed
  differently and worse: focus succeeded into a 0px `overflow: hidden`
  container, so focus moved somewhere the user could not see. The summary now
  opens whatever is hiding the field first, by pressing that container's own
  control, so `aria-selected` / `aria-expanded` stay correct rather than
  drifting out of step with what is on screen.

- **A combobox in Money's currency slot ballooned to 180px** (owner report,
  "why is currency field too long?"). `inline-size: auto` is right for a
  `<select>`, which shrink-wraps to its widest option — every select on the
  page measured 74–78px. A combobox is a `<div>` wrapping an `<input>` and
  neither shrink-wraps, so the slot rendered **2.4× the selects and wider than
  the amount field it belongs to**. The slot holds an ISO 4217 code — three
  letters, always — so its size is now a property of the slot rather than of
  whichever control sits in it, exposed as `--bo-money-currency-size` because
  unit-of-measure reuses the same slot with longer codes. Measured after:
  88px. The demo's `placeholder="Type to search…"` went with it, since it
  cannot fit a three-letter field and `aria-label` already names the control.

- **`.bo-form-actions` read as a hole punched through a card** (owner report,
  "object page — there is footer gap?"). The sticky bar is canvas-coloured
  (`#f9fafb`) with no shadow, and on an object page it floats over a
  surface-coloured card (`#ffffff`) — so instead of a bar above the record it
  looked like a gap showing the page behind. Measured: 44px of the
  document-flow timeline sat behind it mid-scroll with `box-shadow: none`. It
  now carries the new `--bo-shadow-up`. The fix is elevation rather than a
  background change because the bar is correct on a full-screen form, where
  canvas IS the page; repainting twelve working screens to fix one wrong
  reading would have been the wrong trade. `border-block-start` remains the
  geometry channel, so the bar keeps an edge under forced-colors, which drops
  shadows.

### Changed

- **The leading edge now means exactly one thing: the ROW.** `td[data-tone]`
  cells keep their tint but lose the `inset 3px` bar they used to share with
  `tr[data-row-state]`. One visual was doing two jobs — an edge on an amount
  cell was indistinguishable from the marker meaning "this row is in a state",
  and a dirty row holding a danger cell rendered two 3px edges that meant
  different things. The attribute is unchanged, so no markup moves.
  Consequences worth knowing: a toned cell's non-colour channel is now the
  adjacent text/`aria-label` the doctrine already required — and under
  `forced-colors`, where the UA drops the tint, that text is the ONLY channel,
  so it is no longer optional in practice. The `data-tone` half of the RTL
  flip site and its forced-colors fallback went with the bar; DESIGN.md's
  flip-site count stays at six because the row stripe is still a flip site.
  That last sentence was **not true when it was written** and is now asserted
  rather than claimed: the RTL rule for `td[data-tone="success"]` was a
  standalone rule while danger and warning were grouped into the row selectors
  being rewritten, so it survived the edit and gave an RTL reader a green 3px
  edge on a success cell for one day inside this Unreleased window (never
  published). `check:rtl` keys its allowlist by FILE and could not see it;
  a `check:claims` case now asserts the computed shadow per marker, in both
  directions, and was red-proved against both halves.

- **A dirty row no longer says it four times.** `initRowEdit()`'s documented
  row-action markup drops the visible `Unsaved` badge and makes Save/Cancel
  icon-only. The row already carried the state on two visual channels — an
  amber tint and a 3px inset leading edge, the latter surviving
  `forced-colors` as a real border — and the buttons appearing at all said it
  again. **Not a breaking change**: `data-row-state` is a data attribute and
  invisible to assistive tech, so the badge was the only thing announcing
  "unsaved"; that meaning moved onto the Save button's accessible name
  (`Save <row> — unsaved changes`), which exists only while the row is dirty.
  The behavior still drives an optional `[data-row-edit-dirty]` badge if a
  consumer renders one, so existing markup keeps working unchanged.

### Added

- `.bo-icon--save` and `.bo-icon--close` — the pair the icon-only row actions
  need. `check-circle` was the obvious reuse and is deliberately refused for
  save: a tick on an ERP line reads as *approve*, a separate and consequential
  action this framework ships a whole approval-workflow for, and two controls
  one keystroke apart must not be able to trade meanings. Both hand-drawn on
  the same 24-grid and stroke weight as their neighbours, so no third-party
  attribution applies.

- `reveal(el)` — open every container that is hiding an element, so it can
  actually be focused and seen. Handles a closed `<details>`, an inactive
  `[role=tabpanel][hidden]` and a collapsed `.bo-widget__collapse`, and reveals
  by pressing each container's own control so the behavior that owns that state
  keeps its ARIA correct. `initValidationSummary()` is currently the only
  caller — exported on the same footing as `trapFocus`, because the problem it
  solves belongs to any in-page link that lands on a field the user cannot see,
  not to the summary specifically. Deliberately does not touch containers
  the framework did not define — stripping `hidden` off app markup whose
  meaning it cannot know is a worse failure than not revealing.

- `--bo-shadow-up` — an upward elevation shadow, mirroring `--bo-shadow-md`.
  Every other shadow token points down, which assumes the elevated thing sits
  on top of what follows it; a bar stuck to the bottom of the viewport is the
  opposite case, and its downward shadow falls on nothing.

- `data-visibility="external"` on `.bo-composer` / `.bo-audit__entry`, and
  `data-state="resolved"` on a `--discussion` entry — the two things a thread
  people ACT on needs that a thread people only read does not. External marks a
  comment that leaves the building, with the edge on the **composer** as well
  as the posted entry: every ERP measured against puts this on a tab pair above
  an otherwise identical box, so the surface you look at while typing never
  says where the words go. Internal is the default, because forgetting the hook
  should fail toward "stayed in", not "broadcast". The edge is geometry and
  survives forced-colors; the audience badge is the author's to write.
  **A visible "Resolved" marker is required** — measured under
  `forced-colors: active`, both inks repaint to the same black, so the marker
  is that state's only non-colour channel. Grill:
  `.roundtable/grill-collaboration-comments-2026-08-25.md`.

- `.bo-audit--discussion` — turns the audit trail into a comment thread. The
  owner asked for a comment/chat component; the measurement said the framework
  already ships four fifths of one (`.bo-audit` is the list, `.bo-byline` the
  author line — its own docs already named "a comment" as a use — `.bo-avatar`
  the face, `.bo-composer` the write surface, placeholder "Add a comment…").
  The one part that did NOT compose was type size: `.bo-audit__detail` is `xs`
  secondary ink, correct for "changed status to Approved" and wrong for a
  message, so a composed thread rendered its body at **12px under a 13px
  byline** — metadata outranking the content. The modifier returns the detail
  to body size and primary ink (measured 12→14px, secondary→primary, reverting
  when the class is removed). A separate `bo-comment` component was refused:
  see `.roundtable/grill-comment-thread-2026-08-25.md`.

### Deprecated

- `.bo-richtext__divider` — use `.bo-richtext__group` instead. The divider was
  a decorative `<span>`: it drew a separator the eye could read while the
  toolbar remained a single `role="group"`, so a screen-reader user heard one
  undifferentiated run of buttons. `__group` is a real named group that draws
  the same separator from the boundary between groups, and it wraps as a unit.
  The class still ships and still works; removal is a next-major change.

- **Fixed** (`data-table`): a `<tfoot>` totals row now separates itself from
  the rows it sums — a 2px rule above and semibold figures. It was
  byte-identical to a body cell (same background, same weight, no border,
  measured), so on a receivables ageing screen "Total outstanding" sat in the
  same visual register as a customer. Two channels, neither colour alone. All
  six `<tfoot>` uses in the docs are totals or sums and every one wants it.

- **Fixed** (`data-table`): a grouped column header now centres over its span.
  A `th[colspan]` heading numeric columns inherited their `end` alignment, so
  the group's label sat over its LAST column — measured at 229px off centre,
  reading as a label for that one column rather than the group. `thead` only:
  a `th[colspan]` in the body is a row-group heading and belongs at the start.

- **Fixed** (`stack`): `.bo-stack > *` no longer shrinks. A stack distributes
  rhythm, not space, and without this the loss was silent: a flex item that is
  itself a scroll container has an automatic minimum size of ZERO, so putting
  `bo-stack` on a height-constrained element — `.bo-app-shell__main`, the
  composition a reader reaches for when sections run together — collapsed a
  table container to `clientHeight 0` against `scrollHeight 200`. A header row
  and no data, reported by no gate. A stack that does not fit now overflows its
  scroller visibly instead. Costs nothing existing: measured across 3346 stack
  children at two widths, zero heights changed.

- **Added** (`data-table`): `.bo-data-table__cell-link` — the link in the cell
  that names a row's record becomes a **full-cell target** instead of a strip
  of text. Every ERP list has such a row and the framework had no answer that
  survives a touch screen: a plain `<a>` in a cell is inline, so its hit area
  is its LINE BOX — **18px** at spacious density for a label that fits one
  line. That *conforms* to WCAG 2.5.8 via the spacing exception, so no gate
  flags it; the bar it misses is a gloved thumb's. That is easy to miss, because a label
  that *wraps* measures 42px and looks fine. The part takes the cell's own
  vertical padding rather than sitting inside it, lifting the same link to
  **48px** with nothing moving on screen. Styling the link as a button also
  works and costs more than it looks: the padding pushes the next column 44px
  past a 320px container. Documented with a demo and a claims case that
  asserts both halves — with the part every link clears 44px, without it the
  single-line rows fall under 24px.

- **Added** (`segmented`): `.bo-segmented__option` now has a `gap`, so a
  second child — a saved view's count, an icon — sits beside the label instead
  of against it. An option with a single text run has one flex item, so this
  cannot affect existing usage: measured before shipping, it changed the width
  of zero options across every page of the docs site. The count itself needs
  no new surface — muted tabular text, the same treatment
  `.bo-data-table__selection-count` already ships. Not a badge: a badge is a
  status chip, and at compact density it renders 24px tall inside a 24px
  segment.

- **Fixed** (`data-table`): a **grouped (multi-row) column header** now sticks
  correctly. Every `thead th` was `position: sticky; inset-block-start: 0` —
  right for one header row, silently wrong for two: both rows pinned to the
  same offset, so the second landed on top of the first. Measured on a real
  three-way-match screen, the group cell and the sub cell beneath it occupied
  the identical box, which means the group label ("Quantity", "Unit price")
  was not merely overlapped but invisible for as long as the reader scrolled.
  Header rows 2 and 3 now offset by `--bo-density-row-height`, the same token
  that sets the row height, so the offset is exact at every density instead of
  a guessed number. Capped at three rows, the same call `data-sticky-cols`
  makes. **No new class or modifier** — a second header row simply works.
  Documented with a demo and a claims case that drives the scroll.

- **Fixed** (`form`): `.bo-form-actions` now wraps. A bar of three or more
  buttons overflowed the START edge at phone width — `justify-content` is
  `flex-end`, so the row grows leftward — and the shell's scroll container
  clipped the first button away entirely (234px of it, measured). No overflow
  check anywhere caught it, here or in the docs, because content overflowing
  the start edge never reaches `scrollWidth`; the docs' own bars carry two
  short buttons and fit. Found by building a real ERP screen out of shipped
  CSS only. A claims case now measures each button against the bar's own box
  at 390.

- **Fixed** (`form`): a button in `.bo-form-actions` whose label is longer
  than the bar now wraps instead of spilling past its edge — `flex-wrap`
  cannot help a single item with no line to fall to. Third instance of one
  rule after `.bo-btn-group--bar` and `.bo-state__actions`, each citing WCAG
  1.4.12: a button label is content, and clipping content is what 1.4.12
  forbids. Whether these three consolidate into dropping `.bo-btn`'s global
  `white-space: nowrap` is a separate, unanswered question.

## 0.5.0 (2026-08-23)

- **Added** (`data-table`): `.bo-data-table__col--tertiary` completes the
  **column priority ladder** — unmarked columns always show, `--tertiary`
  (nice-to-have context) drops below 40rem of container width,
  `--secondary` below 30rem. One class on the cells; the existing named
  `bo-table` container query does the work, so no JS and no new
  mechanism. Data a tier drops must stay reachable through the row's
  detail view (the canonical reflow rule); the column chooser composes
  one-way and deliberately does not restore a priority-hidden column.

- **Fixed** (`data-table`): column priority no longer depends on density.
  `--secondary` hiding was scoped inside the auto-compaction block, so any
  table that set `data-density` explicitly — `compact` is the common ERP
  choice, and the framework's own list-report screen does it — silently
  got NO reflow at phone width while the docs said the column "hides
  itself". Density (how tight the rows are) and priority (what still fits)
  are independent settings now. Found by the ladder's own live claims case
  measuring the shipped list-report page.

- **Added** (`scan`, RF): the scan-result flash — `data-scan-flash` on a
  `[data-scan-input]` field paints a ~600ms viewport wash on capture
  (`body[data-scan-result="ok"]`), and the exported
  `flashScanResult('error', reason)` paints your validation's verdict,
  announcing the reason through the existing `data-scan-status` live
  region. Two-channel by construction; reduced-motion gets a static wash,
  forced-colors a Highlight frame (proven under emulation, not assumed);
  the overlay is pointer-inert and sits below toasts. Ships in the
  `rf-essentials` profile, which now carries a build-failing **40 kB
  size budget** (currently 35.3). Capture is not validity: the framework
  never decides whether a scanned code is right — it paints the moment.

- **Added** (`button`): `.bo-btn-group--bar` — the RF exception bar. The
  joined group stretches to a full-width row of EQUAL flex slots (a
  gloved thumb aims at position, so positions must not shift with label
  length); long labels WRAP taller in place rather than clipping (a
  label is content — WCAG 1.4.12 vetoed the ellipsizing first draft).
  Height comes from `data-density="spacious"`; docking is one consumer
  line. Intent-named buttons, never F-key numbers.

- **Fixed** (`grouped-number`, three defects found dogfooding 0.4.0 into
  po-app on the day of release — the reference app drove them out within
  hours): (1) focusing a grouped input swapped the display to the raw
  value AFTER the pointer gesture had built a selection, so
  select-and-retype APPENDED instead of replacing, and the concatenation
  then parsed to an empty hidden value (a 422 on a form that looked
  fine). Focus now selects the raw value — also the amount-field
  convention spreadsheets and AutoNumeric follow. (2) A form reset (a
  row-edit Cancel is a `type="reset"` button) restored the visible input
  to its raw ungrouped attribute default and wiped the JS-created hidden
  input to empty; grouped inputs now re-sync from `defaultValue` after
  the reset applies, restoring both the grouped display and the raw
  submission value. (3) The first version of that resync dispatched an
  `input` event, which re-marked row-edit's just-cleared dirty row —
  reset resync is now SILENT, matching the native reset it follows
  (a native reset never fires `input`); covered by a composition test
  running both behaviors together.

## 0.4.0 (2026-08-23)

- **Fixed** (`data-table`, RTL): the row-state stripe and the `data-tone`
  cell bar never flipped for right-to-left documents. `box-shadow`'s
  x-offset is physical and has no logical form, so `inset 3px 0 0` rendered
  byte-identically under `dir="rtl"` and left the marker on the row's
  TRAILING edge — while the same marker's own `forced-colors` fallback used
  logical `border-inline-start` and did flip, so the two channels disagreed
  about which edge means "start". Now flips (`inset -3px 0 0` under RTL) and
  is registered as the framework's sixth documented flip site. `check:rtl`
  gained an inset-`box-shadow` detector so this class of bug cannot recur:
  it was previously invisible to that gate, because a `box-shadow` is not a
  physical box *property*.

- **Added** (`money`, `quantity`, forms): `initGroupedNumber()` +
  `data-grouped` — thousands-separator display for numeric inputs,
  formatted **on blur, never while typing** (the pattern real accounting
  software ships; live reformatting was refused with the evidence — caret
  jumps, locale decimal bugs, screen-reader announcement churn). One
  behavior serves Money amounts, Quantity counts and plain numeric
  inputs. At init the input's `type="number"` becomes
  `type="text" inputmode="decimal"` and its `name` moves to a generated
  hidden input that always submits the RAW number — the server never
  parses a grouped string. Grouping is `Intl.NumberFormat`-driven via
  `data-locale` (falling back to the document `lang`): `en-IN` correctly
  renders `12,34,567.50`, which an every-3-digits rule cannot. Typing is
  parsed locale-aware (a comma decimal under `de-DE` works; a lone dot is
  always a decimal mark, never grouping — the classic trap). The lossless
  contract holds: pad/trim only, a value the precision cannot represent
  keeps its own decimals. Quantity's steppers and Money's currency-change
  reformat both operate on the machine value of a grouped input. Without
  JS the field stays a native number input — correct, just ungrouped.

## 0.3.0 (2026-08-23)

> **Upgrading from 0.1.1? Read the 0.2.0 section below as well.** 0.2.0 was
> tagged and CHANGELOG'd on 2026-08-18 but never reached the registry — the
> published versions are `0.1.0` and `0.1.1` only. 0.3.0 is therefore the first
> release carrying 0.2.0's 65 entries, and they land on you together with this
> section. Nothing is skipped; the version number is.
>
> The `v0.3.0` tag was originally cut 2026-08-21 and re-cut 2026-08-23 before
> first publish to pick up everything below — it never reached the registry in
> between, so no published artifact changed meaning.

- **Added** (`data-table`): `initWindowedList()` — server-chunked windowing
  for very long tables (the 50,000-row ledger case). The server sends
  `<tbody data-chunk-id data-chunk-offset>` fragments; the behavior evicts
  far-off-screen chunks to spacer rows (bounded DOM), re-requests them on
  scroll-back via `bo:table-load-more`, preserves scroll position across
  swaps, and reapplies row selection through the existing hidden-input
  contract. `aria-rowcount`/`aria-rowindex` reflect server totals, not DOM
  position. Composes with `initDataTables()` and `initLoadMore()`; without
  JS the table is simply the ordinary paginated list.

- **Added** (`form-section`): `--label-start` modifier — labels sit at the
  inline start of each row instead of above the control, for dense
  single-column detail forms. Not combinable with `.bo-form-row` (the two
  answer "how do I lay out several fields" two different ways — the docs
  say which to reach for when).

- **Added** (`alert`): `--elevated` modifier — shadow + raised surface +
  radius for alerts presented as cards in a static list (a notification
  center). Split from `.bo-toast` deliberately: toast's entrance animation
  announces content that just arrived, which is wrong for a list already
  on the page at load.

- **Fixed** (`state`): `.bo-state__actions` now wraps and centers its
  buttons. Every prior consumer had exactly one action, so a two-button
  error page overflowed a 390px viewport instead of wrapping — latent
  since the component shipped.

- **Fixed** (`segmented`): the visually-hidden radio inputs all collapsed
  to the identical 1×1 coordinate — a `position: absolute` flex child with
  no inset properties resolves its static position as if it were the
  container's sole item, so hit-targets and target-size measurement were
  wrong for every option but one. The input now stays in normal flex flow
  (`position: static`), giving each its real slot beside its label.

- **Changed** (`dropdown`, `combobox`, `context-menu`): the three menus now
  share one popover-positioning helper instead of three hand-rolled copies
  — same flip/clamp behavior everywhere, no API change.

- **Added** (tokens): `--bo-font-size-mono-inline` — the size for monospace
  text set *inline* in running prose (`.bo-kbd`, `.bo-prose code`,
  `.bo-data-table__col--code`). A mono face renders optically larger than the
  sans at the same nominal size, so inline mono needs a fraction of its HOST,
  which no absolute scale step can express: the same `<code>` sits inside an
  h2, inside compact table text, and inside body copy.

  **Visible change:** `.bo-kbd` was 0.85em where the other two were 0.9em —
  one optical correction written as two numbers. It now matches them, which
  measures as 1px in each dimension at both densities. Mono that is sized as
  *meta* text is deliberately untouched (`approval-workflow` timestamps and
  `ordered-list` codes keep their absolute steps, because there the size
  carries hierarchy rather than correcting a mismatch).

- **Added** (`money`): the currency may now sit on either side of the amount,
  and there is **no new class** for it — the joint is derived from DOM order.
  Write the `select` before the `input` for `[ USD | 1250.00 ]` (en-US), or
  after it for `[ 1250.00 | EUR ]` (de-DE writes `1.234,56 €`). Currency
  placement is a locale convention, not a preference, so both had to be
  reachable; a `--currency-end` modifier would have been a second way to say
  what the markup already says, and one that can disagree with it.

  Deliberately not `order` on the flex children, which is the shorter trick:
  it reverses visual order while leaving DOM order alone, so focus would
  travel against the rendering (WCAG 1.3.2 / 2.4.3). No markup change is
  needed for existing consumers — currency-first renders exactly as before —
  and `initMoneyField()` is untouched, since it already resolved its pair by
  query rather than by position.

- **Fixed** (`badge`): a long label could push the whole PAGE sideways.
  `.bo-badge` carried `white-space: nowrap` with no width cap, so a status
  label that could not break grew the badge past its parent — measured 373px
  wide against a 390px shell on `/patterns/record-detail`, i.e. 24px of
  horizontal page overflow at phone width. It now caps at
  `max-inline-size: 100%` and wraps normally: a multi-word label breaks at its
  space, a single word never splits. Where a table wants the old behaviour for
  one column, `.bo-u-text-nowrap` (73.3) still opts into it.

  Deliberately **not** `overflow-wrap: anywhere`, which `.bo-chip` uses for the
  same shape: `anywhere` also collapses min-content width to one character, and
  in a narrow table cell that split single words — 14 of 20 badges on
  `/patterns/invoice-list` @390 rendered "Approv/ed", "Pend/ing". A chip sits in
  a flex-wrap row with room; a badge sits in a cell that takes every inch.

- **Added** (tokens): `--bo-color-scrim`, the wash behind a modal `<dialog>` or
  off-canvas panel. `.bo-dialog::backdrop` and `.bo-offcanvas::backdrop` — the
  framework's only two `::backdrop` rules — each carried the same
  `rgb(0 0 0 / 0.4)` literal inline, so the one colour a consumer might most
  want to tune was the one colour with no token. Deliberately NOT remapped for
  dark, unlike `--bo-state-*-overlay`: those tint a surface and must invert to
  stay visible on it, whereas a scrim pushes the whole page back, and a white
  scrim in dark mode would lift the background toward the panel. Pure refactor
  — the computed backdrop is `rgba(0, 0, 0, 0.4)` in both themes, unchanged.

- **Fixed** (`data-table`): `.bo-data-table-container` now sets
  `min-inline-size: 0`. As a flex/grid item its `min-width` defaulted to `auto`
  — "never shrink below your own min-content width" — which for a scroll
  container is self-defeating: it would grow past its parent and push the page
  instead of scrolling its table internally. Three containers on
  `/patterns/record-detail` computed `auto` inside a flex parent. Latent rather
  than observed (the badge above was the actual overflow), fixed on its own
  merits.

- **Added** (`button`, `dropdown`): `.bo-btn-group` joins a toolbar of
  independent actions — composes `.bo-btn`, no new component. Border-collapse
  via negative margin, so each button keeps its OWN border
  (`:focus-visible`/`:disabled`/forced-colors all still resolve per-button);
  only the shared edge disappears. Distinct from `.bo-segmented` (radios, one
  active choice) — a button group is buttons that each fire on their own.
  Dropdown menus now animate open/close (opacity + scale, `@starting-style`,
  the standard 150ms token), honouring `prefers-reduced-motion: reduce`
  (instant, no transition). Floor: Firefox 129 / Safari 17.5 for the motion;
  below that the menu still opens and closes, just without the fade.

- **Added** (utilities): `.bo-u-print-exact` — forces
  `print-color-adjust: exact` in print media only (screen is untouched).
  Browsers lighten fills by default when printing, which silently breaks a
  barcode's contrast enough that it stops scanning. For barcodes, QR codes,
  logos, charts, and legend swatches in a printed document.

- **Added** (tokens): `--bo-z-sticky-page` (1150) — the z-index a PAGE's own
  sticky chrome needs to stay above an embedded table's sticky `<thead>`
  (`--bo-z-sticky-header`, 1100). An object-page-style screen with a table
  scrolling under the same ancestor as the page header could let the table's
  header win that fight and bleed through the page chrome.

- **Added** (tokens): `--bo-density-auto-control-height` / `--bo-density-auto-row-height`
  — the two literals `data-table`'s narrow-container auto-compaction used to
  hide inline in a `@container` query, now named and findable beside the
  density tiers they relate to. No rendered change (verified: identical
  computed heights before and after).

- **Fixed** (`data-grid`): `Enter` on a focused cell could target a
  `:disabled` control inside it and silently do nothing. The grid's focusable
  selector now excludes disabled controls, matching the framework's own
  focus-trap behavior; `[tabindex]` stays unfiltered on purpose (a
  programmatically-focused `tabindex="-1"` descendant is the two-level-grid
  pattern).

- **Fixed** (`quantity`, table sums): `data-decimals=""` was two different
  things depending on which behavior read it — table-sum's own inline parser
  treated the empty string as `0` and forced integer totals, while every
  other consumer of the attribute already treated `''` as "not supplied."
  Both now share one parser; `data-decimals=""` falls through to the
  step-derived width everywhere. Also: the quantity stepper no longer
  quantizes a fractional value to an integer when `step="any"` — it falls
  back to the value's own decimal places instead of treating "no precision
  info" as zero precision.

- **Fixed** (accessibility guidance): the framework's own comments and docs
  stated the `role="alert"` rule two different — and contradictory — ways
  (severity in one place, arrival in another). Arrival is correct: content
  already in the parsed HTML has not changed, so a live region on it
  typically announces nothing and can interrupt where it does fire. The rule
  now lives in one place (`/concepts/accessibility#live-regions`) and every
  statement points at it; built docs pages that were shipping an unearned
  `role="alert"` on static content had it removed.

- **Changed** (`htmx` integration): the flash-on-update animation
  (`.htmx-settling`) now uses the framework's standard easing token instead
  of a literal `ease-out` — the same curve every other entrance animation in
  the framework already uses (dialog/toast/offcanvas).

- **Fixed** (`initAnchorNav`): jumping to a section could land its own
  heading a few pixels under the page's sticky chrome. The collapsed sticky
  header's height genuinely differs by viewport width (content wraps
  differently), so no single fixed `scroll-margin-block-start` constant could
  cover every width. The behavior now measures the real collapsed height live
  and exposes it as `--bo-anchor-landing-offset` (same shape as
  `sticky-cols`'s `--bo-sticky-w-1`), with a fixed fallback for the no-JS
  case.

- **Fixed** (`data-table`): `.bo-data-table__row-edit-actions` was
  `display: flex` on a `<td>`, which destroys table-cell behavior and
  turns the base row height into a FIXED height — whenever a sibling
  cell wrapped to two lines, the actions cell stopped short of the row
  and a bare band of the container's background showed through beneath
  it (invisible on a normal row, glaring on a dirty/tinted one). Now a
  real table cell again: end-aligned inline flow + sibling margins
  reproduce the same layout. (owner screenshot report, 2026-08-21)

- **Fixed** (`money`): `.bo-money__amount` had a max width but no MIN —
  under column pressure (a row-edit actions cell appearing) it shrank
  below its own digits and silently clipped "1250.00" to "1250.".
  Money digits must never truncate: a 6rem floor now forces the table
  to widen instead. (same report)

- **Added** (`data-table`): `data-tone="danger|warning|success"` on any
  `<td>` tints that one cell — subtle background plus an inset accent, the
  same two-channel shape row-state uses, per-cell. The server decides the
  condition (a negative balance, a threshold, any rule); the framework only
  paints it. Opt-in `data-tone-text` alongside it also tints the text with
  the matching `-text` token. CSS-only, works on server-rendered HTML and
  htmx swaps with no behavior running. Forced-colors swaps the accent to a
  real border, same as row-state. (roadmap 71.1, 72.2)

- **Added** (`data-table`): `data-sticky-cols="2|3"` + `initStickyCols()`
  freeze the first two or three columns. The behavior measures the header
  row, writes `--bo-sticky-w-1/-w-2` on the `<table>`, and keeps offsets
  live via `ResizeObserver` — needed because `table-layout` is auto, so
  column widths aren't known until rendered. ONE frozen column stays the
  zero-JS `.bo-data-table--sticky-col`; `data-sticky-cols="1"` is
  deliberately not a value (it would duplicate the modifier). (72.1, 74)

- **Added** (`dropdown`): `initContextMenu()` + `data-context-menu="menu-id"`
  open an existing `.bo-dropdown__menu` popover at the cursor on
  right-click (native context menu suppressed). Positioning only — menu
  items wire to mechanisms that already exist (`data-col-toggle`,
  `aria-sort` controls); the menu markup must live inside the same
  container as what it targets, same as any `data-col-toggle`. (73.1)

- **Fixed** (`data-table`): hovered rows now draw a 1px outline ring in
  addition to the fill change — previously a striped even row showed ZERO
  visible hover (the hover and stripe fills are the same token by design,
  for sticky-cell opacity) and a `data-tone` cell never reflected row
  hover at all (its own `--bo-cell-bg` wins, by design). The ring is a
  channel independent of fill, so hover survives both. (73.2)

- **Added** (utilities): `.bo-u-text-nowrap` — plain `white-space: nowrap`
  with no clipping (distinct from `.bo-u-text-truncate`, which commits to
  a width and ellipsizes). Inherited: on a `<table>` it applies table-wide,
  on one cell it's column-scoped. (73.3)

- **Fixed** (`quantity`): the input now renders tabular figures — the
  `font-variant-numeric` declaration sat on the digit-less +/− buttons
  instead of the element showing the number, exactly inverted from
  intent. (77.1)

- **Fixed** (`quantity`): `.bo-quantity__input` shipped with NO framework
  box styling — the browser drew its border (2px inset), background (UA
  dark gray, not a token), and padding (2px), differing across browsers
  and off-token in both themes; 15 call sites had drifted into three
  class compositions, including "seamless" cells whose transparent border
  had nothing consuming it. Now absorbed into `.bo-input`'s own selectors
  (base, `::placeholder`, `:disabled`, `[aria-invalid]`), repairing every
  existing call site with zero markup changes. **Visible change:**
  quantity inputs gain the token border, surface background, and standard
  inline padding they were always meant to have. (78.1)

- **Added** (`quantity`): the +/− step buttons are officially optional —
  a button-less field keeps its rounded corners
  (`:not(:has(.bo-quantity__step))`), and with a `__unit-select` it joins
  into one ( qty | unit ) control, the mirror of Money's
  ( currency | amount ) joint. Documented markup now carries
  `tabindex="-1"` on the step buttons: ↑/↓ on the input already steps
  natively, so each field costs one tab stop instead of three; existing
  markup without it keeps working unchanged. (80.1, 81.1)

- **Fixed** (`.bo-stepper__label`): a squeezed mid-range container silently
  dropped characters. `text-overflow: ellipsis` truncated labels even above the
  component's own 480px "hide labels" threshold — measured at a 558px
  container with 4 steps, "Line items" and "Approvers" (the CURRENT step)
  both clipped by 2-4px (`scrollWidth` vs `clientWidth`). Now
  `overflow-wrap: anywhere` with no forced `white-space: nowrap`: a squeezed
  label wraps to a second line instead of losing text. Found during the
  `/design-grill` sweep's `approval` grill (roadmap 58.3).

- **Fixed** (`initRowEdit()`): Cancel could clear a row's error tint while the
  row was still genuinely invalid. A row with `[aria-invalid="true"]` on one
  cell restores to its ORIGINAL — still-invalid — value on Cancel, but
  `setDirty(false)` removed `data-row-state` unconditionally, dropping the
  row-level signal (tint + border) while the cell-level one (border +
  message) survived untouched. Same gap on Save, which baselines optimistically
  before any async confirmation. `setDirty(false)` now checks for a surviving
  `[aria-invalid="true"]` cell first and sets `data-row-state="error"` instead
  of clearing it when one exists. Found operating the live `editable-grid`
  demo during the `/design-grill` sweep (roadmap 58.4).

- **Deprecated** (`.bo-icon--settings`, `.bo-icon--barcode`, `.bo-icon--building`,
  `.bo-icon--user`): zero pattern screens in these docs render any of the four —
  only the icon component's own showcase page did. Use
  `--bo-icon-src: url("data:image/svg+xml,…")` directly instead (the mechanism
  every named glyph is already just one value of — see `/components/icon`,
  "Any icon you like"). The other 8 glyphs (`--doc`, `--invoice`, `--cart`,
  `--check-circle`, `--truck`, `--box`, `--chart`, `--grid`) are demonstrated in
  a real screen (`/patterns/app-launch`) and are unaffected.

  **Not a breaking change:** the classes still ship and still work; removal is
  a next-major change, since 0.x is published (roadmap 53.2).


- **Fixed** (docs): dialog close buttons that did nothing. `/patterns/master-detail`
  carried an invented `data-dialog-close` attribute on its ×, Cancel and Save
  buttons — a hook `initDialogs` never implemented and the API never documented,
  so all three were dead from the day they shipped. The drawer's claim tested
  Escape, which is why it went unnoticed. They are native
  `<form method="dialog">` submits now, which is what the docs' own app shell
  had been using all along. Guarded by a claim that clicks the button.


- **Removed** (`.bo-quantity--display`, `.bo-quantity__value`): a read-only
  variant that existed to mirror this component's name rather than to meet a
  need. **Zero screens used it** — every screen that shows a count uses
  `.bo-amount` with `__unit`, which already aligns and tabulates every numeric
  value in a column. Its own source comment gave the reason it was built:
  "closing the asymmetry with Amount".

  **Not a breaking change:** it was never published. `npm view @busy-office/ui
  versions` reports `0.1.0, 0.1.1`, and the class is absent from `v0.1.1` — it
  existed only in the tagged-but-unpublished `v0.2.0`. Removing it now costs no
  consumer anything; removing it after 0.2.0 reached the registry would have
  been a next-major job for a class nobody asked for (grill 2026-08-19).

  The family rule is now stated in the same words on Amount, Money and
  Quantity: **displaying a value is Amount's job; capturing one is Money's
  (currency) or Quantity's (count).**


- **Fixed** (`.bo-widget__collapse`): a closed collapsible card did not collapse
  to zero — it stopped at the inner padding. Measured
  `grid-template-rows: 32px` computed while the element reported `data-state
  ="closed"`, because a bare `0fr` track has an `auto` MINIMUM and so cannot
  shrink below the child's min-content height; `min-block-size: 0` does not help,
  since padding is not content. Now `minmax(0, 0fr)`. Found while driving the
  same element from scroll on `/patterns/object-page` (roadmap 52.2).

- **Added** (`initAnchorNav`): opt-in scroll-collapse. With
  `[data-anchor-collapse]` on an element sharing a parent with the nav, the
  behavior closes it past a scroll offset and reopens it near the top. It ships
  **no CSS** — the target is a `.bo-widget__collapse`, whose transition already
  runs on `--bo-motion-duration-slow` and therefore zeroes under
  `prefers-reduced-motion`.


- **Deprecated** (`.bo-date`): use a `.bo-cluster` with `.bo-u-tabular` and, for
  the overdue case, a `.bo-badge bo-badge--danger` carrying the word "Overdue".

  ```html
  <span class="bo-cluster">
    <span class="bo-u-tabular">Aug 10, 2026</span>
    <span class="bo-badge bo-badge--danger">Overdue by 4 days</span>
  </span>
  ```

  `.bo-date` is `display: inline-flex`, a `gap`, `tabular-nums` and a muted
  span — a cluster and two utilities. It ships no forced-colors rule, is not
  density-aware, carries no behavior or executable claim, and no screen in the
  docs uses it; a surface review scored it 1 of 12, the lowest in the framework
  (roadmap 45.3). The one decision it carried that was worth keeping — overdue
  is **two-channel**, so the word must be in the text, colour only adds hue —
  now lives on `/components/amount`, which documents the same contract for
  negative values. It is a rule about values, not about a date widget.

  **Not a breaking change.** The classes still ship and still work; removal is a
  next-major change, since 0.x is published and consumers may be using them.

## 0.2.0 (2026-08-18) — tagged, never published

> This version exists as a git tag and the entries below, but was never
> published to npm. Its changes shipped to consumers in **0.3.0**. Kept as an
> accurate record of what was cut on that date rather than folded upward.

- **Fixed** (`.bo-dropdown`): an open menu stayed nailed to the viewport while
  the page scrolled, drifting away from the control that opened it (owner bug
  report, 2026-08-18). The menu is `position: fixed` in the top layer with
  viewport coordinates written by `initDropdowns()`, and those were written
  once, on open — measured on the filters page, the menu's top stayed at 720px
  while its trigger's bottom travelled from 844px to 594px. It now repositions
  on scroll and on resize, which was equally unhandled. Scroll is captured
  because the trigger usually sits in a scrolling container rather than the
  window. Listeners are attached only while a menu is open. Guarded by a
  `check:claims` case that scrolls twice, since with the bug present a single
  scroll landed within 6px of correct and would have read as a pass.

- **Fixed** (`.bo-sidebar-nav`): a nav label wider than the rail spilled past
  it and, because the rail is `overflow-x: auto`, put a horizontal scrollbar
  inside the navigation — measured at 15.7px of spill for a 32-character label
  in a 223px rail. `.bo-sidebar-nav__link` no longer sets `white-space: nowrap`;
  long labels wrap instead. **Behaviour change for consumers with labels longer
  than their rail**: such a link now occupies two lines rather than producing a
  scrollbar. Wrapping is the right degradation for a nav — an ellipsis hides
  the part of a name that distinguishes it, and a scrollbar makes the reader
  drag to finish reading a link. The icon-rail mode is unaffected: its labels
  are visually hidden, and that pattern's own `nowrap` is untouched.

- **Fixed** (`.bo-icon`): icons vanished when printed. They are a mask painted
  with `background-color`, and a UA drops backgrounds on paper unless told the
  colour is content, so every icon left an empty box behind. A `@media print`
  rule now sets `print-color-adjust: exact`. Confirmed in a real print preview
  rather than by computed style alone: the launcher rendered to PDF at
  `printBackground: false` shows every glyph, and neutralising the rule makes
  all five mask icons disappear while badge and inline-`<svg>` marks still
  print. Guarded by a `check:claims` assertion.

- **Fixed** (docs): four documented form controls had no accessible name of
  their own — three `.bo-tag-input__field` and the combobox value-help input,
  all relying on `placeholder`. Fixed in the copy-paste markup so adopters do
  not inherit it. The accessibility sweep now rejects placeholder-only names, a
  rule axe cannot express because `placeholder` feeds the accessible-name
  computation.

- **Fixed** (docs search): the index covered whole page bodies, so every result
  excerpt began with the app shell ("busy-office-ui Menu Pattern: …") and raw
  HTML from code samples surfaced as prose. `<main>` is now the indexed body,
  the shell and TOC are excluded, and a post-build step excludes 169 code
  samples and 67 demo previews. Demo table cells remain indexed on purpose:
  they share a class with the generated reference tables, and excluding both
  made class names like `bo-data-table` unfindable. Gated by `check:search`.

- Added (gate): `check:vendor-contrast` measures the contrast of RENDERED
  third-party UI, which the token-pair gate structurally cannot see. It was
  `check:contrast` passing on the very page where vendored Pagefind CSS
  rendered at 1.46:1 that motivated it; reinstating that CSS now fails the new
  gate in dark while the token gate still passes.

- **Fixed** (docs site): the landing page ignored BOTH persisted preferences —
  a dark-mode reader clicking the logo got a light page with no way to recover,
  and `bo-density` was ignored too (the static `data-density="compact"` merely
  matched the default). It now runs the same blocking inline theme/density
  script as the docs shell. The hero switchers remain deliberately scoped to
  the demo card, but initialise from the page's resolved values so they no
  longer contradict it.

- **Fixed** (docs site, WCAG 1.4.3): the docs ran TWO Pagefind instances and
  only the Cmd-K one was themed — the sidebar box inherited Pagefind's stock
  `#393939` and rendered result text at **1.46:1 in dark**. Consolidated to a
  single instance reached from a sidebar button, a mobile header button and
  Cmd/Ctrl-K: dark result text is now **14.51:1**. Also fixes search being
  entirely unreachable on mobile (both instances measured 0x0 at 420px), the
  shortcut badge colliding with Pagefind's Clear button, the search box
  scrolling 681px out of view, and two indexes loading per page. The shortcut
  hint is a real element now, so it reads "Ctrl K" off macOS.

- Added (gate): `check:po-app` — the reference app is verified in CI for the
  first time. Boots `examples/po-app` on a free port and asserts seven
  behaviours the docs cite it for (href-only filter removal, unknown token keys
  staying free text, an invalid mass-change target changing nothing, staging's
  disabled Apply, apply-and-keep-errors, bulk partial failure) plus axe over
  six routes at two widths. 11.9s. `examples/po-app` honours a `PORT` env var;
  default unchanged.

- Added (docs + reference app): **mass change** (M3) on
  `/patterns/bulk-actions` — select N rows, set one field, in one validated
  operation. No new component: `formaction` re-points the existing bulk form's
  checked ids at a second endpoint, and the dialog's field joins that form.
  Ships the rule that a bad target value is a document-level 422 changing
  nothing, not N identical row errors. Completes the four data-maintenance
  patterns now named in DESIGN.md.
- **Fixed** (build): `check:rtl`'s DESIGN.md assertion broke the po-app
  container image, which copies only `packages/`. The check now reports
  loudly that it was skipped when the file is absent instead of failing —
  CI has the full checkout and still enforces it.

- Added (docs): the **document frame** — a compact identity line (type badge,
  record number, status, actions) on `/patterns/record-detail` and
  `/patterns/detail-form`, composed from a split `.bo-cluster` with no new
  CSS. Measured at 36px/68px and 24px/53px against an 80px chrome budget that
  is now gated, and Status no longer appears in both the identity line and the
  facts strip (which cost 54px at phone width). `detail-form` previously had
  no identity region at all.

- Added (docs + gate): worked SG/TH formatting examples and an
  "entry precision is not display precision" section on `/concepts/i18n`,
  with every string produced by running `Intl`. A new browser-free gate
  (`check:formatting`) reproduces those strings and watches the ISO-4217
  vs CLDR minor-unit divergence (currently IQD, IDR, HUF, COP, PKR, MMK,
  LAK), so an ICU upgrade cannot silently make the page wrong. No API
  change: `currencyDecimals()` follows ISO minor units by design, which is
  the correct authority for what a user may type.

- Added (docs): the **document-level message strip** on
  `/patterns/validation-summary` — for messages about no field at all
  ("posting period closed"), with the test that keeps them rare and the
  explicit refusal to grow a message centre. No new component: it is
  `.bo-alert` in the document header. The reference app's import screen
  demonstrates one (a batch total exceeding the period budget), enforced
  server-side as well as by the disabled button.

- Added: `data-row-state="warning"` on data-table rows — a row that is valid
  but qualified, for staging and batch-result views. It shares the `dirty`
  state's declarations (same amber treatment, different meaning) rather than
  duplicating them. There is deliberately no `ok` state: a row with nothing
  wrong is a normal row, and its confirmation is a success badge.
- Added: **staging / batch-result pattern** (`/patterns/staging`) — the
  landing place for bulk data before it becomes records: validate every row,
  show all three outcomes, then apply only what can be applied and leave the
  rest on screen. What the Excel round-trip needs from the web side.

- **Fixed**: `.bo-widget` did not reset `text-decoration`, so a launchpad
  tile — a widget on an `<a>` — wore the browser's link underline. Same gap
  already fixed on `.bo-btn`/`.bo-badge`/`.bo-chip`; found because the
  app-launch pattern carried six hand-written `text-decoration: none`
  workarounds, and a repeated workaround is the missing framework rule. The
  underline gate now covers `bo-widget` too.

- Added (combobox value help): rich result rows —
  `.bo-combobox__option-code` / `__option-label` / `__option-meta` — plus
  `.bo-combobox__group` headings and `data-open-on-focus`, which shows
  server-supplied recents before any keystroke. The LABEL part is what
  commits to the field; plain-text options behave exactly as before. All
  three parts are inside the option, so the existing filter matches on code,
  name or context alike.
- **Fixed** (combobox): scrolling now REPOSITIONS an open list under its
  focused field instead of closing it, closing only once the field leaves
  the viewport. Closing on any scroll made focus-to-open impossible —
  focusing an off-screen field scrolls it, and that scroll closed the list
  focus had just opened.
- **Fixed** (combobox): the scroll handler called `Node.contains()` on an
  event target that is not always a Node, which throws and silently aborted
  the handler.

- **Fixed** (docs correctness): /concepts/density claimed "No density tier
  takes an interactive target below 1.5rem (24px)" and called spacious
  "44px targets". Both were false — `.bo-checkbox`, `.bo-radio` and
  `.bo-tag-input__remove` are a hard-coded 1rem in ALL three tiers and the
  data-table sort button is 18px tall. No accessibility failure: WCAG 2.5.8
  is met through its spacing exception, which is now what the docs say, plus
  the consequence for adopters (crowd controls closer than 24px between
  centres and you break it).
- Added: `check:target-size` runs the real SC 2.5.8 test in CI — a 24px
  circle centred on every undersized control must reach no other target —
  across seven control-dense pages in all three densities.
- Added (ACR): four criteria the project had CI evidence for but never
  reported — 1.4.10 Reflow, 1.4.12 Text Spacing, 2.4.11 Focus Not Obscured,
  2.5.8 Target Size. The report was understating verified conformance.

- Added (gates, no behaviour change): `check:motion` refuses any shipped
  animation that uses a literal duration without a
  `prefers-reduced-motion` override, and the documented-claims gate now
  executes the reduced-motion promise under emulation. The claim
  ("reduced-motion zeroing on all animations") was verified TRUE when
  executed — this keeps the next animation added from becoming the first
  exception.

- **Fixed**: `.bo-btn`, `.bo-badge` and `.bo-chip` never reset
  `text-decoration`, so any of them used on an `<a>` wore the browser's link
  underline inside the pill. This hit every page of the docs site — the
  Related footer is chips — plus the landing page's own two CTAs. Six other
  components that expect to be anchors (navbar, sidebar-nav, pagination,
  breadcrumb, dropdown, tree) already did this; the three that are only
  SOMETIMES a link were the ones that slipped. Content links are unaffected
  and still underline. The layout sweep now gates it.

- Added (reference app): the PO list's filter bar actually filters. It
  submitted `q`/`status` and the server read neither, so Apply was a silent
  no-op — which also meant the "filters exclude everything" empty state
  could never occur and had never been built. Both empties now ship and are
  deliberately different: first-run offers "New purchase order", filtered
  offers "Clear filters" and says how many records are hidden.

- Added (generated docs surface): `api.json` now records `forcedColors` per
  component, and /concepts/accessibility renders its Windows High Contrast
  component list from it. The hand-written list had drifted to 10 of 15
  while still claiming to be exhaustive. A new gate
  (`check:forced-colors`) verifies every shipped `@media (forced-colors:
  active)` rule still matches real markup and still changes something under
  CDP emulation, measured against a control run.

- **Fixed** (RTL): `.bo-motion-slide-in-inline-start` had a logical NAME and
  a physical implementation (`transform: translateX(-0.5rem)`), so in a
  right-to-left document it slid in from the wrong edge — the opposite of
  what its own name promises. `.bo-tree-table`'s disclosure chevron was
  missing the `[dir="rtl"]` glyph flip that `.bo-tree` already carried, so
  it pointed the wrong way in RTL. Both fixed, and a new build gate
  (`check:rtl`) now refuses any physical box property in the shipped CSS
  and any new direction-sensitive construct — transform, background-position
  keyword, or a chevron glyph in `content` — that lacks a flip.

- **Changed** (guidance): a bulk-action list should wrap its rows AND its
  bulk buttons in one `<form>` rather than putting `hx-include` on the
  button. Both POST the same ids, but only the form gets native implicit
  submission, so <kbd>Enter</kbd> from any row checkbox runs the bulk
  action — measured against the alternative at 32 keypresses from row 30.
  Two contracts ship with it, both gated: make only the SAFE action
  `type="submit"` (implicit submission fires the first submit button, and
  it must never be a destructive one), and give each row checkbox an `id`
  so htmx restores focus after the swap instead of dropping the user on
  `<body>`. Docs and the reference app updated; no API change.

- Added: **bulk actions pattern** (`/patterns/bulk-actions`) — selection
  → toolbar action → per-row result, with the data contract (rows plus an
  out-of-band summary in one response), all six states including partial
  failure, and the rule that per-row failure reasons are TRANSIENT and
  must be cleared before each action or the list starts lying about the
  record. No new components.

- **Fixed**: `.bo-badge` had no boundary of its own, so a badge whose
  subtle fill matched the surface behind it disappeared as a shape and
  left only its word — measurably so for a danger badge on an
  `[data-row-state="error"]` row, where fill and row tint were the same
  colour in both themes. Every badge now carries a 1px border derived
  from its own foreground (`--bo-badge-border`, overridable per
  variant; the solid `--type` chip opts out). Print and forced-colors
  already added a border for the same reason — this makes it
  unconditional. Badges grow 2px in each axis.

- **Fixed** (WCAG 1.4.12 Text Spacing): `.bo-chip` and
  `.bo-file-list__name` truncated with an ellipsis and lost text under a
  user spacing override — both now wrap instead; `.bo-avatar` clips
  only when it contains a photo, so initials are never cut. Verified on
  every page at two widths by a new CI gate.

- Removed: a dead `print-color-adjust: exact` rule targeting
  `.bo-badge` — badges deliberately print as black text in a black
  border with no background, so the rule forced a colour that had
  already been removed. Timeline and stepper markers keep it, where the
  fill is the signal. No visual change.

- **Fixed**: `.bo-segmented` options now wrap instead of pushing the
  page sideways — 2-5 translated labels ("Meine Genehmigungen")
  overflowed a phone-width shell. Normal-length labels still render on
  one row; the fix only engages when the group would not fit.

- **Fixed**: `.bo-cluster` children could refuse to shrink (flex items
  default to `min-width: auto`), so a child with nowrap content — a
  `.bo-chip` carrying a long or translated label — pushed the page
  sideways at narrow widths instead of wrapping. Cluster children may
  now shrink, and `.bo-chip` caps at 100% with an ellipsis. Found by a
  new CI gate that expands every string ~35% and forces compact
  density.

- Changed (dist placement — explicitly NOT API until v1.0): the `nav`
  component directory split into four real components —
  `breadcrumb`, `navbar`, `sidebar-nav`, `offcanvas`. Class names are
  unchanged; granular importers of `dist/css/components/nav/*` must
  update their paths, and each now has its own docs page and generated
  API table. `/components/nav` redirects to `/components/sidebar-nav`.

- Added (combobox): `data-name` on the widget root mirrors each
  committed option's `data-value` into a generated hidden input, so a
  plain form POST carries the machine value rather than the display
  label; focusing a committed field selects its text so typing browses
  the full list again; a visually-hidden `role="status"` region
  announces result counts and "No results"; pointer movement syncs the
  active option with the keyboard's.

- **Fixed** (combobox, from an owner test report): Enter with the list
  open but no active option no longer submits the surrounding form (it
  commits the sole match, or does nothing); focus leaving the widget
  now closes the list and clears `aria-activedescendant`; the list
  closes on scroll instead of drifting away from its field; clicking an
  option keeps focus on the input (was dropping to `<body>`);
  `aria-disabled` options are skipped by the arrows and rejected by
  Enter/click; options without an `id` get one minted so
  `aria-activedescendant` is never an empty string.

- Added: Keyboard key (`.bo-kbd`) — a keycap chip for the native
  `<kbd>` element (weighted bottom edge, mono, case-preserving even
  under uppercasing containers) + the "Keyboard help" pattern: the "?"
  shortcuts dialog composed from Dialog + Key-value facts + the chip,
  with the four-line app wiring (and its don't-steal-"?"-from-inputs
  guard) shown, deliberately not shipped as a behavior.

- Added: the 24-range scale system — `--bo-palette-<range>-<step>` raw
  tokens, 11 steps (50–950) per range, generated in OKLCH on a shared
  lightness ladder (generator drift-gated). Two tiers: 9 core ranges in
  the default bundle (semantic five + slate/indigo/violet), 15 extended
  ranges via the opt-in `@busy-office/ui/css/scales` module; manifest
  exported as `@busy-office/ui/scales`. The raw tier is explicitly NOT
  semver API (values may retune in any release); the semantic tier is
  the stable contract. Docs: /base/colors grid (click-to-copy,
  derived-honest role bands, per-swatch consumer tooltips), /base/tokens
  (per-theme resolution, step cross-links), /base/palettes (ERP-first
  preset cards).

- Added: Key-value facts (`.bo-kv` + `--rows`) — record-header facts as
  a native description list: responsive auto-fit grid, density-aware
  values, tabular-numeric alignment, badges/times compose in `dd`.
  Replaces the readonly-input-as-display-data anti-pattern (the docs
  page states why).

- Changed (not breaking — dist placement is not API pre-1.0):
  `.bo-prose` extracted from the richtext component into its own
  `prose` component (own docs page, own granular dist file) — display-
  only consumers import prose without the editor chrome. Class names
  and behavior unchanged.

- **Breaking** + Added: `.bo-avatar` promoted from Byline's `__avatar`
  part (owner call) — a standalone initials/photo disc plus
  `.bo-avatar-stack` for approval chains, em-sized, forced-colors
  border. Byline now COMPOSES it: markup that carried only
  `.bo-byline__avatar` must add `.bo-avatar`
  (`class="bo-avatar bo-byline__avatar"`) — the old class remains as
  the byline's flex-layout marker but no longer paints the disc.

- Changed: dark-mode `--bo-color-border-control` steps gray-500 →
  gray-400 — on dark muted/hover fills the control border can be the
  ONLY affordance (seamless cells) and gray-500 measured 2.97:1;
  surfaced by two new contrast-gate pairs (border-control on
  bg-hover/bg-muted at 3:1). Dark inputs/selects get slightly lighter
  borders.

- Added: `.bo-btn[aria-pressed="true"]` pressed style (bg-selected +
  accent-text, contrast-gated) — toggle buttons (formatting toolbars)
  now have a visible + programmatic ON state.

- Added: WYSIWYG (display-identical) editable-grid mode — the
  `--seamless` setting now covers every cell type:
  `.bo-select--seamless` (chevron/border appear on hover/focus) and
  `.bo-tag-input--seamless` join `.bo-input--seamless`. Controls stay
  real in both "modes", so keyboard/AT semantics never change; all
  row-edit machinery composes unchanged.

- Added: Rich text chrome (`.bo-richtext` — container, toolbar,
  content area, `--readonly`/`--disabled`) and `.bo-prose` (rendered
  rich content: headings, lists, blockquote, code, lite tables).
  Deliberately NO editing engine — the docs show the native
  contenteditable light case (six consumer lines) and the
  mount-a-real-editor recipe; sanitize stored HTML server-side.

- Added: Tree table (`.bo-tree-table` on a `.bo-data-table` +
  `initTreeTable()`) — hierarchical rows (BOM explosion, account
  rollups): expand/collapse via disclosure buttons on a PLAIN table,
  deliberately not `role="treegrid"` (ADR in `.roundtable/` — native
  SR table browse mode wins for read-mostly hierarchy). 12 indent
  levels; collapse spans tbody boundaries; a toggle with no deeper
  rows is inert (the chevron never lies); nested collapsed state
  preserved on re-expand; `bo:tree-toggle` dispatched
  (row/level/expanded — the fetch-on-expand and expand-all hook).

- Added: six ERP brand palettes — `@busy-office/ui/css/brand-graphite`
  (monochrome slate), `brand-cobalt` (enterprise blue), `brand-navy`
  (deep conservative blue), `brand-forest` (green), `brand-indigo`,
  `brand-violet` — each gated through the full 32-pair AA contrast
  check in both themes; a generated Palettes reference page documents
  every swatch/token/hex from the shipped CSS. (The muted quartet —
  mauve/olive/mist/taupe — briefly existed as presets within this
  unreleased cycle; they remain available as extended scale RANGES,
  owner lineup decision 2026-08-16.)

- Docs/meta: build-time syntax highlighting on every docs code block
  (token-mapped to gated core pairs, none-left-behind build gate);
  versioned docs snapshots with a header version switcher, frozen-docs
  banner, and a release-flow gate (a versions.json entry without a
  committed snapshot fails the build); docs sidebar regrouped
  (learning-path order, workflow-grouped patterns, adjacency pairs).

- **Breaking** (contract shape of a stable behavior, per the freeze
  policy): `initRowEdit()` now tracks, resets, and baselines `<select>`
  elements in editable rows, not just inputs/textareas. If your
  `data-row-edit` rows already contain selects, Cancel now restores them
  to their default selection (previously untouched) and re-fires
  `change` on a genuinely-reset select so dependent behaviors re-derive;
  Save now baselines their selection. A select `change` also marks the
  row dirty. Needed so money (currency) and quantity (unit) selects
  compose into editable rows with correct Cancel/Save semantics.
  Extended in the same release: checkboxes/radios reset to
  `defaultChecked` and baseline symmetrically; Cancel announces every
  genuinely-restored field with a real bubbling `input` event (realtime
  listeners — auto-sum, custom subtotal math — must see values revert,
  or a cancelled edit leaves totals stale). Save/Cancel now move focus
  to the row's first usable field before hiding themselves when the
  activated button held focus — previously keyboard focus silently
  dropped to `<body>` mid-table on every save/cancel (WCAG 2.4.3,
  grill find).

- Added: `initRowEdit()` advanced-table surface (Slice 18): a
  `bo:cell-change` event on every committed cell edit (rowId / field /
  value — the realtime feed for custom subtotal math), a
  `bo:row-cancel` event after native fields restore (the hook for
  restoring consumer-rendered cell content like tag-input chips), tag
  events (`bo:tag-add`/`bo:tag-remove`) marking their row dirty, and a
  second save model: `data-row-edit="live"` dispatches `bo:row-save` on
  every committed change and re-baselines — no Save/Cancel buttons
  (batch mode unchanged, still the default). Hardened by the Slice 18
  close-out grill: live saves are microtask-deferred and coalesced per
  row per tick (so same-tick money/unit reformats land before the save
  reads the row, and a row removed in the same tick is never saved or
  mutated), and a mid-Cancel restore can never trigger a save or dirty
  state (the select-reset change previously turned Cancel into a Save
  of the abandoned values).

- Added: `initTableSum()` — declarative realtime column totals: any
  element with `data-sum-of="<field>"` inside a table live-updates to
  the sum of tbody fields with that `name`; decimals from the widest
  step among summed inputs, `data-decimals` overriding. The auto-sum
  half of Slice 18's subtotal contract (a deliberate, documented
  exception to "you do the data"; the custom-math half is
  `bo:cell-change`).

- Added: Money field (`.bo-money` + `initMoneyField()`) — a currency
  select linked to an amount input; changing currency re-derives the
  input's `step`/decimals from a built-in ISO 4217 minor-units table
  (exceptions only, everything else 2) and reformats the value
  **losslessly only** (pads/trims zeros, never rounds — hardened by the
  Slice 18 close-out grill: a value that doesn't fit the new precision
  keeps its digits and surfaces via native step mismatch; values beyond
  MAX_SAFE_INTEGER are left alone), dispatching a real `input` event on
  an applied reformat. `data-decimals` on the selected
  option or container overrides the table. `currencyDecimals()` exported.
  A deliberate, documented exception to "your app owns the data" —
  built-in but always overridable.

- Added: Quantity read-only display (`.bo-quantity--display` with
  `__value` + `__unit`) and an interactive unit select
  (`select.bo-quantity__unit-select`): changing unit re-derives
  `step`/decimals from a built-in common-ERP unit table with the same
  `data-decimals` override contract and the same lossless-only
  reformat. **Unknown units leave the field's precision entirely
  alone** (hardened by the grill — real master-data UOM codes are
  rarely the table's exact strings, and an unknown unit must never
  rewrite a value; `unitDecimals()` returns `undefined` for them).

- Added: Tag input (`.bo-tag-input`) — multi-value entry for cost centers,
  approval-routing recipients. Real JS (no native element covers this,
  same class as Combobox): `initTagInput()` dispatches `bo:tag-add` on
  Enter (you validate/dedupe and render the chip) and owns removal
  directly (`bo:tag-remove` + deletes its own rendered chip) on a
  remove-button click or Backspace-in-an-empty-field.

- Added: File upload (`.bo-file-input`, `.bo-file-dropzone`, `.bo-file-list`)
  — styled native `<input type="file">` via `::file-selector-button`, a
  bigger drag-target composition, and consumer-rendered selected-file row
  styling. Optional `initFileDropzone()` behavior adds drag-over
  highlighting and forwards a drop anywhere in the zone into the input's
  FileList (dispatching a real `change` event).

- Added: Segmented control (`.bo-segmented`) — a toggle between 2-5
  mutually exclusive views (My approvals / Team approvals, report-range
  switcher), built on real radio inputs (zero JS, native keyboard
  arrow-navigation and group semantics).

- Added: a generated Accessibility Conformance Report (`dist/acr.json`,
  `@busy-office/ui/acr`, rendered at `/reference/acr`) -- 16 WCAG 2.2 A/AA
  criteria with verdicts and remarks assembled from the same evidence the
  other build gates already produce (contrast, keyboard map, event/ARIA
  coverage, a forced-colors source scan). Gated: a remark citing a
  nonexistent component fails the build.

- Fixed: combobox `commit()` now dispatches a real `input` event (in
  addition to `bo:combobox-select`), so committing an option composes with
  any generic form-field listener — e.g. `data-row-edit`'s dirty tracking,
  which previously never saw a combobox-in-a-cell commit. Guarded against
  re-triggering the combobox's own filter listener.

- Docs/meta: per-behavior keyboard support is now generated, gated API
  documentation (`dist/keymap.json`, `@busy-office/ui/keymap`) rendered as a
  table on the JS behaviors page; the docs site gained a skip-to-content link.

- Fixed (forced-colors): three states whose only visible channel was a
  background now survive Windows High Contrast — skeleton bars render as
  outlined boxes instead of vanishing, the combobox active option repaints
  with `SelectedItem`/`SelectedItemText`, and the stepper's current marker
  gains a `CanvasText` ring (done/pending already differed by glyph).
  CDP-emulation verified.

- Fixed: the library no longer ships `color-scheme: light dark` on `:root` —
  a CSS-only page with no `data-theme` under a dark OS got a light page with
  dark native scrollbars/form chrome/date pickers (mixed mode). Default is
  now `light`; `[data-theme="dark"]` still switches to `dark`. Apps that
  want the pre-paint gap to honor a dark preference add
  `<meta name="color-scheme" content="light dark">` themselves (the docs
  site does). This was also the root cause of the long-mystified "solid
  square checkbox" in automated screenshots.

- Fixed: combobox input↔listbox resolution now prefers the shared
  `.bo-combobox` container over document-wide id lookup, so two widgets left
  with identical ids by a duplicated partial-swap fragment stay
  self-contained instead of widget #2 silently driving widget #1. The
  documented `aria-controls` contract is unchanged; the document-wide lookup
  remains as fallback. (Objective-review find; regression test added.)

- Docs/meta: `bo:*` intent-event payloads are now generated, versioned API
  (`dist/events.json`, `@busy-office/ui/events`, two-way parity gate);
  README claims (size/behaviors/events) are stamped from dist behind a
  build gate — the hand-written "37 kB" claim is corrected to the generated
  56 kB min / 9.3 kB gz.

## 0.1.1 (2026-08-15)

Metadata-only patch — no CSS/JS changes.

- Fixed: `repository` URL in package metadata pointed at a nonexistent repo
  (`ThePFMind/…`); corrected to `Busy-Office/busy-office-ui`, so the npm
  package page's Repository link resolves.
- Added: `.github/workflows/publish.yml` — releases now publish via npm
  Trusted Publishing (OIDC, provenance attestation). Owner-triggered as
  before: publishing a GitHub Release with tag `v<version>` is the trigger.

## 0.1.0 (2026-08-15)

**First published release** — `@busy-office/ui@0.1.0` on npm (public,
`busy-office` org), published by the owner after the session's freeze
audits, three review passes, and the registry-install smoke test
(93.9 kB tarball, dist-only, 16 behaviors, brand preset, icon set all
verified present from the registry). Pre-1.0 semver: minors may still
break, per the policy above. Everything below was developed unreleased
and ships in this version.

### Breaking (pre-release churn)
- **Prefix renamed `eof-` → `bo-`** (classes, custom properties, layer names,
  container names, keyframes). "eof" was a placeholder ("Enterprise/Office
  Framework") that read as End-Of-File; `bo-` matches the busy-office brand and
  is shorter in dense markup. Historical documents (.roundtable/, older CHANGELOG
  entries) intentionally keep the old spelling.
- `.eof-data-table__footer` moved from `pagination.css` to `data-table.css` (its
  namespace owner). Pagination-only importers must also import the data-table file
  to style the footer.
- Dropdown rebuilt from `<details>` disclosure to native `[popover]` (top layer);
  markup contract changed — see the Dropdown docs page.
- `initDialogs()` no longer accepts a root argument (delegation made it a no-op).
- Firefox floor raised 121 → 128 (`content` alt-text syntax).

### Fixed (consumer-gauntlet findings, examples/po-app)
- `./package.json` added to the exports map (`require.resolve` from consumers
  failed with ERR_PACKAGE_PATH_NOT_EXPORTED).
- Canonical table recipe now shows `name`/`value` on row checkboxes so
  selections are actually POSTable via `hx-include` or a form.

### Added
- Behaviors manifest (`dist/behaviors.json`, `./behaviors-manifest` export):
  the JS API surface — exports, contracts, DOM hooks — generated from source and
  asserted against `dist/js/index.d.ts`; drives llms.txt and the landing count
  (closes the CSS-true-but-not-JS-true gap).
- Contrast coverage guard: build fails if a component pairs text on a background
  token (incl. via `--bo-cell-bg` indirection) not in the checked PAIRS list.
- Slices 1–3: tokens/density/dark theme, primitives, button, badge, forms
  (fields/sections/inline edit), dense data table (selection/pagination/filters/
  saved views), tabs, dropdown, alerts/toasts, navigation (sidebar/off-canvas),
  dialog, dashboard (widgets/stat tiles), approval timeline, audit trail, stepper.
- JS behaviors (delegation, call-once): dialogs, data tables (+`refreshDataTable`),
  tabs, dropdowns, alerts.
- Build rule: every `@container` query is named (enforced at build time).
- **Slice 4 — Records & approval**: byline, ordered list (mono/`--plain`/
  editable rows), record-type badge, small & danger-ghost button variants,
  widget band footer; `.bo-composer` for approval-thread comments.
- **Slice 5 — Docs UX + ERP data-entry**: Amount field (`.bo-amount`); Cmd/Ctrl+K
  command palette; opt-in Motion module (8 reduced-motion-safe animations);
  the `new:component` scaffold generator + page-shape build gate (gate 7).
- **Slice 6 — Component depth + a11y hardening**: Skeleton/State (empty/error)
  components; ARIA-grid keyboard nav (opt-in `initDataGrid()`/`refreshDataGrid`
  on `.bo-data-table`); Quantity field (`.bo-quantity`, opt-in `initQuantity()`);
  Breadcrumb (`.bo-breadcrumb`); Multi-step wizard (opt-in `initWizard()`);
  Saved-view URL persistence (opt-in `initSavedViews()`); RF-scanner scan-input
  (opt-in `initScanInput()`, `bo:scan` event); `forced-colors` (Windows High
  Contrast Mode) fallbacks on button/badge/dialog/offcanvas/data-table.
- **Slice 7 — docs IA + polish**: Date field (`.bo-date`, display-only, mirrors
  Amount/Quantity); inline validation summary (opt-in `initValidationSummary()`);
  first real theme preset (`@busy-office/ui/css/brand-indigo`) with its own
  contrast-gate validation; "Data display" docs grouping.

- **Slice 8 — editable table, multi-select dropdown, searchable dropdown**:
  multi-row inline edit (`data-row-edit` + opt-in `initRowEdit()`) —
  per-row dirty state (reuses the error-row visual channel, amber instead
  of red) with Save/Cancel, `bo:row-save` event for the consumer to
  persist. Multi-select dropdown (`data-multiselect` on
  `.bo-dropdown__menu` + real checkbox items) — stays open across
  selections, trigger label reflects a live selection count, no new init
  function (folded into `initDropdowns()`). Combobox (`.bo-combobox` +
  opt-in `initCombobox()`) — WAI-ARIA APG combobox pattern, single-select
  list autocomplete with a top-layer `[popover]` listbox, `bo:combobox-
  select` event on commit.

- **Slice 9 (in progress) — Objective-review scoping follow-ups**: `bo:scan`
  live-region announcement — opt-in `aria-describedby` + `data-scan-status`
  markup contract, `initScanInput()` announces "Scanned {value}" on each
  scan for screen-reader/low-vision RF users; fully backward compatible.
  Data-table toolbar — column visibility + export (`initTableToolbar()`):
  `data-col-toggle` checkboxes (composed with the existing multi-select
  dropdown) show/hide matching `data-col` cells; `data-table-export`
  dispatches `bo:table-export {format}` for the consumer to persist. Zero
  new CSS. Load-more pagination (`initLoadMore()`): `[data-table-load-more]`
  dispatches `bo:table-load-more` on click, or on scroll-into-view with
  `data-load-more-auto` — consumer fetches/appends; zero new CSS. Login
  and App Launch pattern pages (both zero new CSS). Nine ultrareview
  findings fixed in one batch (see that commit for the list). Grouped
  rows + subtotals documented as a composition (no component needed —
  proven in po-app's `/spend`). `.bo-progress` — styled NATIVE
  `<progress>` (platform value/max + progressbar role, zero JS/ARIA),
  base + `--warning`/`--danger` tones, three new 3:1 fill-on-track
  contrast pairs (which caught a latent dark-theme `warning-strong`
  token gap, now remapped). `.bo-tree` — hierarchy navigation on native
  `<details>/<summary>` (zero JS/ARIA), explicitly navigation rather
  than an APG TreeView.

- **Slice 11 — CSS icon set**: `.bo-icon` — mask-image data-URI glyphs
  painted by `currentColor` (themable, zero JS/fonts/requests, `1em`
  density-tracking); 12 original ERP glyphs; explicit forced-colors
  opt-out (mask icons otherwise vanish); App Launch upgraded from
  initials to icons. Deliberately not a library — one-line extension
  documented, inline `fill="currentColor"` SVG equally first-class.

### API freeze audit (2026-08-15)

Prompted by the 1.0 exit checklist's own finding — the public API had never
had a deliberate "diff the surface, decide what's still churning" pass; this
is that pass. Result: 21 components / 165 CSS classes / 56 semantic color
tokens / 12 JS behaviors reviewed. **No renames, no removals — additive
only** since the `eof-`→`bo-` rename above (the one real breaking change
this project has made). Per-item calls on everything added in Slices 6-7
(the newest, least battle-tested surface):

- **Stable, freeze now**: Quantity (`.bo-quantity`, `initQuantity()`) and
  Date (`.bo-date`) — both deliberately mirror Amount's already-stable
  shape, already used in 2+ real docs/pattern pages each, no open design
  questions.
- **Stable, freeze now**: ARIA-grid (`initDataGrid()`), Wizard
  (`initWizard()`), Saved-views (`initSavedViews()`) — each is additive
  (opt-in, doesn't change `initDataTables()`'s existing contract), verified
  against real DOM (not just jsdom) during their own build rounds.
- **Freeze the mechanism, not the specific values**: theme presets
  (`src/css/brand/*.css`) — the FILE FORMAT and build/validation wiring are
  stable (proven this session, reusable for any future hue), but the one
  shipped preset (`brand-indigo`) is a demonstration, not a commitment to
  keep exactly that hue forever — presets are additive opt-in files, so this
  is low-risk regardless.
- **Hold one more cycle before hard-freezing**: `initScanInput()` (`bo:scan`
  event name, `data-scan-terminator` attribute) and `initValidationSummary()`
  (`data-validation-summary`/`data-validation-summary-box` attributes) — both
  are only proven on ONE real pattern page each so far (goods-receipt,
  validation-summary). The *shape* (document-delegation, same as every other
  behavior) is consistent with the frozen set, but the specific attribute/
  event names have had zero real-world usage pressure yet. Recommendation:
  treat as stable-but-not-yet-guaranteed for one more slice; revisit at the
  next freeze pass or before 1.0, whichever comes first.
- **Explicitly NOT API** (per the existing versioning policy, restated here
  for the audit's completeness): per-component dist file paths, the raw
  palette tier (`--bo-palette-*`), component-internal custom properties
  (`--bo-btn-*` etc.).

No code changed by this audit — it's a documentation/decision pass. If a
1.0 push happens before `initScanInput`/`initValidationSummary` get a real
second consumer, that's an acceptable risk to accept explicitly, not a
blocker — noting it here so it's a deliberate choice, not an oversight.

### API freeze audit — addendum (2026-08-15, post-Slices 8-9)

The first audit's own revisit condition fired: it held two items "pending
a second real consumer; revisit at the next freeze pass," and Slices 8-9
shipped both a second consumer for one of them and a batch of new surface
(4 behaviors, 1 component, several attribute contracts) the audit never
covered. Per-item calls, same honesty bar as the original:

- **Graduated to frozen**: `initValidationSummary()` — the condition was
  met exactly as stated: the Login pattern (`/patterns/login`) is now a
  second real consumer of the `data-validation-summary`/
  `data-validation-summary-box` contract, exercised live during its own
  build round. The attribute names survived a second composition without
  needing changes; freeze them.
- **Still held, one more cycle**: `initScanInput()` — goods-receipt
  remains its only real consumer. The contract was *hardened* since the
  first audit (the `data-scan-status` live-region addition, and the
  multi-ID `aria-describedby` fix from the ultrareview) — both additive,
  neither breaking — but hardening under review pressure is not the same
  as a second consumer exercising it. Same recommendation as before,
  unchanged.
- **Stable, freeze now**: multi-select dropdown (`data-multiselect`,
  `data-multiselect-label`, `data-multiselect-count`) — already TWO real
  consumers (the dropdown page's cost-center picker and the data-table
  toolbar's Columns menu), and the contract survived an ultrareview
  finding (icon-children triggers) with an additive fix.
- **Stable, freeze now**: `initRowEdit()` (`data-row-edit`,
  `data-row-state="dirty"`, `bo:row-save`) — deliberately reuses the
  already-frozen error-row-state channel, and the "behavior tracks
  intent, consumer persists" event split is now the established pattern
  across four behaviors; the shape has real precedent pressure even
  where the consumer count is one.
- **Freeze the mechanism, hold the names one cycle**: `initTableToolbar()`
  (`data-col-toggle`/`data-col`, `bo:table-export`) and `initLoadMore()`
  (`data-table-load-more`, `data-load-more-auto`, `bo:table-load-more`)
  — both mirror the frozen intent-event split, but each has exactly one
  docs demo and zero external usage pressure; same "stable-but-not-yet-
  guaranteed" bucket `initScanInput` sits in, same revisit condition.
- **Stable, freeze now**: `.bo-combobox` + `initCombobox()`
  (`bo:combobox-select`, `data-value`, `data-bo-open` is internal) — the
  markup contract is the WAI-ARIA APG combobox pattern, i.e. externally
  specified rather than invented here; the framework-specific surface is
  small and mirrors the dropdown's popover mechanics. `data-bo-open` is
  explicitly INTERNAL state, not API — consumers must not style or read
  it (restated under "Explicitly NOT API").

Net: 16 behaviors, 13 frozen, 3 held (`initScanInput`,
`initTableToolbar`, `initLoadMore`) on the same explicit, dated revisit
condition. No code changed by this addendum.

**Second revisit (2026-08-15, later the same day)**: po-app's PO list
became a real second consumer of BOTH `initTableToolbar` and
`initLoadMore` (columns toggle + export + load-more against a 30-row
paged dataset) — and the usage pressure did exactly what the hold
existed for: it surfaced a contract gap (rows appended after a column
was hidden came back visible) whose fix was already shipped in the
re-runnable init (re-call `initTableToolbar()` after appending, now
documented in the JSDoc and the data-table docs as the same re-call
convention as `initDataTables()`). With the gap found, documented, and
verified live, **both graduate to frozen**. And in the same round,
po-app gained a Receive screen (`/receive` — scan a PO number, receipt
logged, unknown POs toast a warning) as `initScanInput`'s second real
consumer, exercising the full contract including the `data-scan-status`
live region (verified live: "Scanned PO-88210" announced, input cleared,
next scan immediate). **`initScanInput` graduates too.**

**Terminal claim, corrected by the decisions grill (same day)**: 16 of 16
behaviors are **stable against internal usage** — every contract survived
at least two in-repo compositions, with the holds released by real (if
in-house) usage pressure. Calling that "frozen" overreached on two
counts the grill caught: the hold criterion was stated as *external*
usage pressure and po-app is not external; and behaviors frozen by the
morning audit were modified the same afternoon under a "fix" label
(including an observable contract-semantics change: `initWizard()`
install-once → re-runnable). So: **the freeze is provisional until the
1.0-checklist item-12 independent adopter exercises the API. Until
then, any contract-shape change to a stable behavior requires a
CHANGELOG "Breaking" entry — not a fix note.** The per-item audit
machinery stands; only the guarantee language was wrong.

### Design reviews
- `.roundtable/grill-2026-08-11.md` (slice 1), `grill-2026-08-12.md` (slice 2),
  `grill-2026-08-12-slice3.md` (slice 3) — findings, gates, and fix outcomes.
