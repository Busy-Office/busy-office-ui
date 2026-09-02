# Design grill — components batch 3: dropdown, file-upload, filters, form, icon, kbd, kv (2026-08-31)

Third batch of the full component-by-component sweep (39 components total,
see `design-grill-components-batch1-2026-08-31.md` and `-batch2-2026-08-31.md`
for the first 14 and the methodology). Measured live against the
Podman-served docs container at `:8081` (`bo-docs-review`), 1440px light +
390px dark per page, via `chrome-devtools-mcp`. Theme forced with
`document.documentElement.setAttribute('data-theme', …)` via `evaluate_script`
— confirmed applied before each screenshot.

## Summary verdict

6 of 7 **pass** outright. **Key-value facts** carries one real documentation
accuracy defect: its own prose claim does not match its measured breakpoint
behavior at this project's own standard mobile width.

### Dropdown *(`/components/dropdown`)*

**Step 1 — the decision:** open a native-`[popover]`-backed menu that is
never clipped by scrolling containers (top layer) — with an explicit
wrong-choice clause routing 2-3 always-visible options to Segmented control
instead.

**Step 2 — measured inputs:** 4 sections (data-table row menu escaping a
scroll container, multi-select with real checkboxes, items with icon+trailing
shortcut, markup). 0 primary actions in the base demo (menu trigger is
secondary-weight by design). Alignment: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 5 | Self-explanatory? | Yes — states *why* `[popover]` matters (top-layer, no z-index fights) rather than just "use this" |
| 6 | Complexity hidden? | Yes — `initDropdowns()` handles anchoring/close-on-select; markup stays declarative |
| 7 | Decoration? | No |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 4 demo sections | keep | data-table escape, multi-select, icon+shortcut are distinct real shapes |
| Wrong-choice clause (2-3 options → Segmented) | keep | precise, links the alternative |

---

### File upload *(`/components/file-upload`)*

**Step 1 — the decision:** attach real files via the platform's native
`<input type="file">` picker — explicitly not a re-implemented OS file
dialog (a second callout distinguishes "open from machine" vs. "open from
system" vs. "save," routing the latter two to value-help/output-form/dialog).

**Step 2 — measured inputs:** 5 sections (basic, multi+restricted-types,
camera capture, dropzone opt-in, selected-file list). Selected-file list's
remove control is an icon (×) + red color — two-channel. Alignment: **100%
(18/18)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 4 | Every element purposeful? | Yes — even the second "looking for a save panel?" callout earns its place by preventing a real, predictable misuse (there is no browser save panel to give) |
| 7 | Decoration? | No — remove control's × + red confirmed at both 1440 and 390 |
| 9 | Context preserved? | Yes — file list persists selection; remove is per-row, not a full reset |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 5 demo sections | keep | basic/multi/capture/dropzone/list are non-overlapping real ERP attachment shapes |
| "Save panel" callout | keep | forecloses a real, common wrong expectation before the reader forms it |

---

### Filters *(`/components/filters`)*

**Step 1 — the decision:** a filter bar + applied-filter chips for when a
user can have *several* filters active and lose track of them — explicitly
not for one or two fields (routes to a plain search input in the table
toolbar instead).

**Step 2 — measured inputs:** 2 chip rows in the primary demo: the bar's
applied chips (removable, teal, with `aria-label` naming the filter) and a
separate multi-select-sourced row showing base (`Overdue only`, grey/inactive)
vs. `--active` (teal) chip contrast. At 390 the chips wrap onto their own row
rather than clipping or forcing horizontal scroll — confirmed in screenshot.
Alignment: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 2 | Primary action obvious? | N/A — filtering is the record set itself, not a single CTA; correctly has none |
| 6 | Complexity hidden? | Yes — "filtering itself is your code" stated plainly, no fake client-side filter JS shipped |
| 7 | Decoration? | No — active vs. inactive chip color pairs with a real state difference (applied vs. available) |
| 9 | Context preserved? | Yes — chip removal doesn't reset the whole bar |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Bar + chips + multi-select demo | keep | shows the full loop (dropdown → chip → matching rows) in one page |
| Base vs. `--active` chip contrast | keep | correctly two-channel (color + position: active chips carry the ×, available ones don't) |

---

### Form *(`/components/form`)*

**Step 1 — the decision:** this page is explicitly EXEMPT from the
wrong-choice-clause gate (`wrong-choice-rule.mjs:27` — "the entry-context
anchor the field matrix points at — the thing others are the wrong choice
VERSUS"), and confirmed: no top-level "Not for…" clause exists, and that is
correct per CLAUDE.md's own doctrine (forcing one where none is true produces
filler). Not a defect.

**Step 2 — measured inputs:** 16 `<h2>` sections — largest page in this
batch. Read every heading: fields/hint/error, dates, required/disabled,
density (compact/comfortable/spacious), seamless inline-edit, grouped numeric
input, sections+action bar, dependent selects (HTMX), label-start sections,
choices, mobile input-attribute recipe, markup. No section duplicates
another. **Sections & action bar** demo: single visually-primary "Save
vendor" beside one secondary "Cancel" — one primary action even in the
"four actions at phone width" stress demo (Delete/Save as draft/Cancel
wrap to 2 rows at 390, "Submit for approval" stays the sole primary, last in
reading + thumb order). The page also documents a real, dated regression
fix (2026-08-23, action bar silently clipping the first button at 390,
"found by building a real screen out of shipped CSS, not by a gate") —
an honest post-mortem left in the docs rather than scrubbed. Alignment:
**100% (18/18)** (a `28/36/44px` density-row-height mention in prose is not
a score — verified by reading it in context before treating it as one).

| # | Question | Answer |
|---|---|---|
| 2 | Primary action obvious? | Yes — verified live in the 4-action wrap demo, one primary throughout |
| 3 | Anything removable? | No — each of 16 sections is a distinct real form shape |
| 8 | States understandable? | Yes — error state pairs a red border with a message naming the actual violated constraint ("Unknown cost center code"), not a generic "Invalid" |
| 9 | Context preserved? | Yes — dependent selects (HTMX) and dirty-state handling are pointed at the detail-form pattern for the full contract |
| 10 | Built from zero today? | Yes — the documented 2026-08-23 fix is evidence of active maintenance, not just initial care |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 16 sections | keep, all of them | each maps to a distinct real ERP field/section shape |
| Exemption from wrong-choice clause | keep, correctly | Form is the anchor other pages route TO, not FROM — the EXEMPT reason is accurate |
| 2026-08-23 regression note | keep | honest history of a real shipped bug and its fix, useful precedent for future action-bar work |

---

### Icon *(`/components/icon`)*

**Step 1 — the decision:** CSS-rendered `currentColor` glyphs for a small,
deliberately limited ERP set — explicitly not as the sole label for a
domain-specific meaning ("post goods issue" needs words; "accounts payable"
has no glyph at all and should use an initials badge instead).

**Step 2 — measured inputs:** 12-glyph "The set," a **Deprecated (4)** section
with an honest disclosure ("No pattern screen in these docs renders any of
these four — only this showcase did"), themable/sizes/context/custom-icon/
own-artwork sections. At 390 the icon grid reflows to 2-per-row without
clipping. Alignment: **100% (15/15)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 5 | Self-explanatory? | Yes — the wrong-choice clause gives three escalating failure cases (convention exists → needs aria-label; domain-specific → needs words; no glyph exists → use letters), not just one rule |
| 7 | Decoration? | No — icons are correctly `aria-hidden` where paired with text, confirmed live |
| 8 | States understandable? | Yes — the Deprecated section states plainly why (zero real usage), not vaguely |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 12-glyph set + Deprecated(4) | keep | honest reach-based deprecation disclosure, matches the doctrine's zero-reach-is-not-automatically-a-defect stance by stating actual usage |
| Wrong-choice clause's 3-case structure | keep | precise escalation, not a single blanket rule |

---

### Kbd (Keyboard key) *(`/components/kbd`)*

**Step 1 — the decision:** a keycap chip for the native `<kbd>` element,
case-preserved, for shortcut hints — explicitly not a label for an on-screen
control (that's a button).

**Step 2 — measured inputs:** 2 sections (inline hint in running text,
shortcut list composed with Key-value facts). Combo keys are separate chips
joined by a plain `+`. Alignment: **100% (15/15)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 4 | Every element purposeful? | Yes — even the weighted-bottom-edge styling detail is stated as functional ("what makes it read as a key"), not decorative |
| 7 | Decoration? | No |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 2 demo sections | keep | inline + composed-list are the only two real placements for this component |
| Wrong-choice clause | keep | precise, links to Button as the actual answer for on-screen labels |

---

### Key-value facts *(`/components/kv`)*

**Step 1 — the decision:** labeled facts as a real `<dl>` for a record
header — explicitly not for editable values (routes to Form or the
seamless inline-edit pattern instead).

**Step 2 — measured inputs:** primary demo has a 6-fact grid (Vendor, Cost
center, Payment terms, Total, Requested, Status), `Total` right-aligned with
`.bo-u-tabular`, `Status` composes a `bo-badge`. Alignment: **100% (15/15)**.

**Fix-worthy finding, measured not assumed:** the prose beneath the primary
demo states *"Columns pack to the space (`auto-fit`): four across a detail
header, a single stack at phone width — no breakpoints to manage."*
Measured live at 390px (this project's own standard mobile verification
width, both in dark and light): `getComputedStyle` on `.bo-kv` reports
`grid-template-columns: 201px 201px` — **two columns, not a single stack** —
confirmed visually in the screenshot (Vendor/Cost center paired, Payment
terms/Total paired). Traced to the source:
`packages/core/src/css/components/kv/kv.css:8` —
`grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr))`, i.e. 176px
minimum column width. At a 390px viewport the content area comfortably fits
two 176px+ columns, so `auto-fit` mathematically cannot single-stack until
the container drops below roughly 352px (an older/smaller phone, not this
project's 390px standard).

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 5 | Self-explanatory? | **No** — the stated behavior ("a single stack at phone width") does not match what the shipped grid does at the width this project treats as "phone" |
| 7 | Decoration? | No |
| 10 | Built from zero today? | Yes — the grid mechanism itself is fine; only the prose describing it is wrong |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| `auto-fit`/`minmax(11rem,1fr)` grid | keep | responsive-by-construction is the right mechanism; no breakpoints to maintain |
| "a single stack at phone width" claim | **reword** | measured false at 390px — replace with the accurate behavior, e.g. "packs 2-up at typical phone widths, stacking fully only below ~350px" — or lower `minmax()`'s floor if single-stack-at-390 was the actual intended design and the CSS is what's wrong, not the prose. Which side is "correct" (the claim or the CSS) is a product call, not this grill's to make — but they currently disagree and only one can be true. |

## What this batch found

One actionable defect (Key-value facts' phone-width claim vs. measured
grid behavior) against six clean passes. Positive pattern worth noting:
**Form**'s dated, undisguised regression note (2026-08-23 action-bar clipping
fix) — leaving a found-and-fixed bug in the docs, rather than smoothing over
that it ever shipped broken, is the same content-honesty bar Combobox set in
batch 2.
