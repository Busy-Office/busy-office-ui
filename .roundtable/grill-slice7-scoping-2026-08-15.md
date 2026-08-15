# Objective review — Slice 7 scoping (device coverage, component tiers, patterns gallery)

**2026-08-15.** Dispatched at the user's request ("let's do the Objective review"),
after first checking whether `/round-table` was actually the right instrument —
it's a market/feasibility tool ("is this product the right bet"), not a design tool.
The correct instrument for "how should we scope these components" is the
project-local panel defined in this file's sibling, `PANEL.md` — same four seats
used for the Slice 1-4 grills, redirected at ROADMAP.md's three still-open Slice 7
items (2, 3, 5), which have been blocked on exactly this review since 2026-08-14.

Findings made against the live rendered site (`podman build --no-cache` +
`podman run`, `localhost:8081`) and the shipped source, per PANEL.md rule 1. Full
per-seat transcripts are in the session log; this is the chair's synthesis.

## Question 1 — Device/platform coverage (Web / Mobile app / RF / Tablet-Bento)

**Unanimous across all four seats: build option (a) — audit and document how
density + container queries already cover these archetypes — not option (b),
dedicated device-specific component variants.**

- **Consumer (Devi)**: no device/platform nav axis exists anywhere in the docs;
  density + container queries are already proven live on data-table and
  dashboard. RF is the one archetype with real shipped groundwork
  (`data-scan-input` + `/patterns/goods-receipt`), and it needed a genuine new
  *input mode*, not a layout variant.
- **Platform (Kofi)**: the mechanism is a pure token remap (`density.css`) plus a
  named `@container` registry — Tablet-Bento is just `bo-widget-grid` at a
  different breakpoint, zero new surface. The one place this ISN'T free: if
  "RF"/"Mobile app" implies non-hover, touch-target-first interaction, that's a
  genuine audit gap, not a container-query one.
- **Auditor (Ines)**: `initScanInput()` is a clean keyboard-wedge pattern, but as
  shipped it has **no live-region announcement** — a screen-reader/low-vision RF
  user gets no non-visual confirmation a scan registered. Real, fixable gap
  independent of the device-coverage question. Tablet/Bento has zero precedent
  to audit (no launcher pattern exists yet) — folds into Question 3's App Launch
  item, not a separate device variant.
- **Skeptic (Rex)**: found no rendered page where the current mechanism visibly
  breaks for any device archetype. Building dedicated variants now would
  contradict the framework's own "one component, many settings" pitch with zero
  evidenced need.

**Verdict: WORKING, MEDIUM.** Two concrete, immediately buildable actions fell out
of this (see ROADMAP.md Slice 9 below); the broader "is RF/Mobile/Tablet a real
target market" question is a genuine **[HUMAN CALL]** — the panel's shared
recommendation is to document the coverage regardless, since the cost is low
(verification-only, like the Slice 7 RTL audit) and the value doesn't depend on
the answer.

## Question 2 — Simple → Advanced component tiers

**Unanimous: this was never one roadmap item — it's four unrelated asks wearing
one label. Two are docs-only fixes ready now; two need a cited ERP use case
before any design starts.**

- **Table tiering**: already correctly implemented (`initDataTables()` vs. opt-in
  `initDataGrid()`, one CSS shape, JS-behavior split only — Platform confirmed no
  second CSS tier exists). All four seats: this is a **docs-framing gap**, not a
  code gap.
- **Card tiering**: `.bo-widget` (`packages/core/src/css/components/dashboard/`)
  is already a fully capable card primitive — header/collapse/band/badge
  composition — but has **zero discoverability as "Card"**: no sidebar entry, no
  page alias, filed only under "Dashboard." All four seats independently hit
  this same finding. **Docs/naming fix, not a new component.**
- **Filter Control "advanced"**: `.bo-filters`/`.bo-filter-bar` already exist;
  no seat found a concrete ERP scenario for "advanced" (saved views, multi-
  condition builders) beyond what's shipped. **Not ready — defer until a real
  scenario is named.**
- **Process Bar**: genuinely distinct from `.bo-stepper` (discrete named steps
  vs. continuous fill) and genuinely greenfield (Platform/Auditor confirmed zero
  existing `progressbar`/meter surface anywhere in shipped CSS or docs) — but
  every seat independently flagged it as speculative without a named use case
  (import job progress? budget consumption?). **Not ready — defer.**

**Verdict: WORKING, MEDIUM as a bucket; split into 4 tracked items** (see
ROADMAP.md Slice 9 below) — table and card tiering are Continue-dispatchable now,
filter and process-bar stay parked pending a real scenario.

## Question 3 — Patterns gallery expansion

**Convergent: of ~10 proposed archetypes, most either already exist under a
different name or have no testable Accept criterion. Two are real, scopable,
and worth building now.**

- **Already covered, don't rebuild as new** (Skeptic cross-checked all 10 against
  the 9 already-shipped pattern pages): Dashboard/Report overlaps
  `/patterns/reporting-dashboard`; App Style 1/2 overlaps
  `/patterns/settings-admin`; Output Form overlaps `/patterns/invoice-list` and
  possibly `/patterns/validation-summary`.
- **No testable Accept criterion — cut/defer**: "Boardroom" and "App Style 1/2"
  (as a distinct ask from settings-admin) are vague labels, not scoped work —
  Skeptic's framing: "a roadmap item without a testable Accept criterion is not
  real work, it's a wish." Consumer independently recommended cutting Boardroom
  and Bento UI first as having no screen-#40-shaped need.
- **Real, scopable, worth building**:
  - **Login** — every seat flagged this as the highest-value gap. Auditor:
    highest-stakes candidate (authentication, error-recovery, lockout
    messaging) and it 404s today. Consumer: "every app needs an entry screen,
    and nothing in the current set is composed into one."
  - **App Launch** — already has a concrete, evidenced Accept criterion from the
    2026-08-15 reference note in ROADMAP.md item 5 (icon-grid launcher,
    categorized Favourites section, folders/stacks, filter-tab row) — Skeptic:
    "the one sub-item actually ready to queue." Also closes Question 1's
    Tablet-Bento precedent gap in the same piece of work.

**Verdict: WORKING, MEDIUM.** Build Login and App Launch now as their own
scoped items; close out the reporting-dashboard/settings-admin/invoice-list
overlap explicitly (mark satisfied, not missing); defer/cut Boardroom and
undifferentiated "App Style" until each gets a concrete referenced shape the
way App Launch got one. **[HUMAN CALL]**: overall gallery prioritization beyond
these two remains the product owner's call.

## What changed as a result

Fed back into ROADMAP.md as re-prioritization, not vibes (LOOPS.md Objective
step 3) — see the new **Slice 9** section: six concrete, individually-scoped
items replacing the three blocked Slice 7 entries, four of them immediately
Continue-dispatchable (Card discoverability fix, table-tiering docs, `bo:scan`
live-region fix, device/platform coverage audit) and two new pattern pages
(Login, App Launch) queued behind them. Slice 7 items 2/3/5 are now closed as
"superseded by Slice 9's scoped breakdown," not left open.

Two **[HUMAN CALL]** items remain genuinely open and are called out as such in
Slice 9, not silently resolved: whether RF/Mobile/Tablet is a real target market
worth more than the documentation pass, and gallery prioritization beyond
Login/App Launch.
