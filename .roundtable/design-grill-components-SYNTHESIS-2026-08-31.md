# Design grill — full component sweep, synthesis (2026-08-31)

All 39 component CSS directories under `packages/core/src/css/components/`
(40 components counting Skeleton and State separately — they share one docs
page, `state-patterns.astro`) were design-grilled live against the docs site
(`bo-docs-review`, podman, `:8081`) using the `design-grill` skill's
methodology (Step 1 name-the-decision, Step 2 measured inputs, Step 3 the ten
questions, Step 4 verdicts), at 1440px light and 390px dark, via
`chrome-devtools-mcp`. Six batches, findings in
`.roundtable/design-grill-components-batch{1..6}-2026-08-31.md`.

## Full verdict list (40 of 40)

| # | Component | Verdict | Batch |
|---|---|---|---|
| 1 | Alert | pass | 1 |
| 2 | Amount | pass | 1 |
| 3 | Approval workflow | pass | 1 |
| 4 | Avatar | pass | 1 |
| 5 | Badge | pass | 1 |
| 6 | Breadcrumb | pass | 1 |
| 7 | Button | pass | 1 |
| 8 | Byline | pass | 2 |
| 9 | Calendar | pass | 2 |
| 10 | Combobox | pass | 2 |
| 11 | Dashboard | pass | 2 |
| 12 | Data table | pass | 2 |
| 13 | **Date** | **fail — real defect** | 2 |
| 14 | Dialog | pass | 2 |
| 15 | Dropdown | pass | 3 |
| 16 | File upload | pass | 3 |
| 17 | Filters | pass | 3 |
| 18 | Form | pass | 3 |
| 19 | Icon | pass | 3 |
| 20 | Kbd | pass | 3 |
| 21 | Key-value facts | pass — original "fail" was refuted 2026-09-02, see §2 | 3 |
| 22 | Money | pass | 4 |
| 23 | Navbar | pass | 4 |
| 24 | Offcanvas | pass | 4 |
| 25 | Ordered list | pass | 4 |
| 26 | Pagination | pass | 4 |
| 27 | Progress | pass | 4 |
| 28 | Prose | pass | 4 |
| 29 | Quantity | pass | 5 |
| 30 | Rich text | pass | 5 |
| 31 | Scan feedback | pass, minor cosmetic nit | 5 |
| 32 | Segmented control | pass | 5 |
| 33 | Sidebar navigation | pass | 5 |
| 34 | Skeleton | pass | 5 |
| 35 | State | pass | 5 |
| 36 | Stepper | pass | 6 |
| 37 | Tabs | pass | 6 |
| 38 | Tag input | pass | 6 |
| 39 | Tree | pass | 6 |
| 40 | Tree table | pass | 6 |

**39 of 40 pass outright (updated 2026-09-02: Key-value facts' "fail" was an
instrument artifact, refuted on re-verification — see §2), 1 passes with a
cosmetic nit not worth a roadmap item on its own (Scan feedback), 1 carried a
real, reproducible defect (Date), now fixed — see ROADMAP.md Slice 226.**

## Prioritized cross-cutting findings

### 1. Date's deprecation-notice mobile layout doesn't reflow (real bug, highest priority)

`/components/date`'s `.bo-alert--warning` deprecation box uses
`flex-direction: row; flex-wrap: nowrap` across 3 sibling `<p>` elements.
Measured live at 390px: column widths of 168px/134px/99px instead of
stacking — the only info box in the framework observed not to reflow at
phone width. Positive pattern in the same box worth keeping: replacement-
first framing (bold "Deprecated," own surface-review score cited, "Use this
instead" shown before any deprecated demo) — fix the CSS, keep the copy
structure. **Next step:** find the deprecation-notice markup/CSS (likely a
one-off `flex` rule rather than the framework's standard responsive alert
pattern) and make it match every other alert box's stacking behavior at
narrow width.

### 2. Key-value facts — CORRECTED 2026-09-02: not a defect, an instrument artifact

**This finding does not survive re-verification and is refuted.** The claim
below ("renders 2 columns at 390px, `201px 201px`") was re-measured with a
viewport confirmed true via `window.innerWidth === 390` (screenshotted as
proof): `.bo-kv` renders exactly **1 column, 308px wide** — matching the docs
claim exactly. The original measurement's `emulate({viewport: …})` call did
not actually reach 390px, despite that batch believing it had already fixed
the `resize_page` 500px-floor bug earlier batches hit. At an effective width
near 500px, `minmax(11rem,1fr)` legitimately produces 2 columns — correct
behavior at that width, mislabeled as "phone width." Filed as this project's
own doctrine names it: *an instrument's first output is not evidence* — this
took a second, verified measurement to catch. No code or docs change made.
See ROADMAP.md Slice 226, item 2, for the full re-verification.

Original (refuted) text, kept for the record: "The page claims 'a single
stack at phone width.' Measured live at 390px: renders 2 columns
(`getComputedStyle` confirms `201px 201px`). Traced to `kv.css:8`'s
`minmax(11rem,1fr)` grid track, which mathematically cannot single-stack
until roughly 352px container width."

### 3. Amount/Money/Quantity's "rule for this family" box is a verbatim 3-way duplicate — no sync mechanism

`amount.astro:134`, `money.astro:188`, `quantity.astro:168` carry the
identical routing paragraph, character-for-character. Verdict: **by design,
not a defect** — a reader can land on any of the three pages first and needs
the same cross-reference regardless of entry point, the same pattern the
"Related" footers already use across pattern pages. Note this took two
batches to settle: batch 1 flagged it unconfirmed, batch 4 (grilling Money)
compared it against the *wrong* paragraph on Amount's page and reported it
"refuted," batch 5 (grilling Quantity) checked against source directly and
found all three identical. **Next step:** add a one-line HTML comment at
each of the three sites (`<!-- kept in sync with amount.astro / money.astro
/ quantity.astro -->`) so a future edit to one doesn't silently drift from
the other two — nothing currently enforces the three staying identical.

### 4. CLAUDE.md's reach-report note on Ordered list is stale

CLAUDE.md's "reach report" (the `bo-*` composition-count sweep) lists
`bo-ordered-list` as "NOT EXAMINED... carries no wrong-choice clause." Live-
checked in batch 4: it now has one ("Not once each item needs more than one
attribute…") and it's a correct, sharp clause. This isn't a component defect
— the component is fine — but the standing note in CLAUDE.md is now
inaccurate and could mislead a future reach-report re-run into treating it
as still-unexamined. **Next step:** update or remove that line in CLAUDE.md
the next time the reach report is regenerated.

### 5. Scan feedback's demo placeholder clips at 390px (cosmetic, not roadmap-worthy alone)

The demo input's placeholder text (`Try 4006381333931, then REJECT-1`) clips
at 390px with no ellipsis/fade. It's placeholder copy, not real content, so
this doesn't fail any of the ten questions on its own. **Next step:**
shorten the placeholder string if anyone is in `scan.astro` for another
reason — not worth a standalone roadmap item.

## Overall verdict

**Removal-first / less-for-more is holding across the framework.** Of 40
components, zero verdicts were `remove` or forced `reword` on a live element
— every component's demo set stayed proportional to what it does (Tree
table, flagged in advance as the framework's most structurally complex
component per its own ADR, still showed only 2 columns and 4-5 rows per
demo). Every component that should have a wrong-choice clause has one, and
every one checked is a real, testable line rather than a vague disclaimer —
including the two components (Prose, Scan's validation-vs-capture split)
correctly exempted from that requirement for stated reasons already on
record.

The two real defects found are both **measurement/documentation-accuracy
failures, not design-restraint failures**: a box that doesn't reflow (Date)
and a claim that doesn't match the CSS it describes (Key-value facts). This
matches this project's own standing pattern named repeatedly in CLAUDE.md —
"claims that assert runtime behavior must be executable," "a red-proof that
comes back green is a defect in the injection until proven otherwise" — the
framework's actual CSS/JS surface is disciplined; where it slips is in prose
claims about that surface going unverified against a live render. Both
defects here were caught by exactly the discipline CLAUDE.md already
prescribes: measuring the rendered/computed result at 390px instead of
trusting what the page says about itself.
