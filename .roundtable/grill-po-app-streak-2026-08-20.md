# Objective grill — the po-app dogfood streak (Slices 66-69, 2026-08-20)

Four consecutive wakes went into `examples/po-app` (three Explore spikes +
one Standardize) with no critical review between them — a genuine pattern,
not a coincidence, and worth checking against the Objective before a fifth
feature (cancel/delete PO) gets built on momentum alone.

## What shipped, in one line each

- **66 — value-help**: shared cost-centre picker (`costCenterPickerTrigger`/
  `costCenterPickerHtml`), parameterized by `data-cc-target`, first used on
  the mass-change form. Found and fixed a real OOB-ordering bug.
- **67 — PO creation**: `/pos/new`, reused the picker (2nd consumer), fixed
  a real dead link, made "New purchase order" persistent nav.
- **68 — record editing**: PO detail becomes a `field-editor`-shaped
  `data-row-edit` table when Pending; reused the picker (3rd consumer);
  server-side 409 guard, not just a client-side gate. Caught a real
  `fetch()` redirect-following bug in its own test.
- **69 — Standardize**: `parsePoFields()` — 67 and 68 had each written the
  same vendor/cc/amount validation independently; consolidated to one
  function, re-scanned, found no further drift.

## Against the four principles

**1. Simplicity.** Zero `packages/core` changes across all four commits
(`git log --stat -- packages/core` confirms it). Every feature composed
from primitives that already existed — `data-row-edit`, `bo-dialog`,
`bo-data-table`, the picker pattern itself. That's the strongest possible
Accept signal: the framework didn't need to grow to carry three new
screens, meaning it was already sufficiently expressive. **Pass.**

**2. Less for more.** The picker is a genuinely general mechanism (one
helper, parameterized by target field, not per-form copies) reused by
*three independent forms* — exceeds the "≥2 real compositions" bar in
principle 3 on its own. `parsePoFields` replacing two copies is exactly
the "two surfaces growing toward each other" Rethink case, caught the wake
after it appeared, not left to rot. **Pass**, and the Standardize dispatch
itself is evidence the loop is enforcing this correctly.

**3. Reusability.** Same picker evidence applies. Nothing in these four
slices embeds app-only logic into framework code — `COST_CENTERS`,
`parsePoFields`, and the validation rules all live in `server.mjs` (the
consumer), never `packages/core`. **Pass.**

**4. Design the decision, not the screen.** This is where the streak
produced a real finding, not a clean pass.

The Pending-PO detail screen (`detailScreen()` in `server.mjs`) now renders
**two simultaneous visually-primary actions** when a record is Pending:

- `<button class="bo-btn" type="submit">Save changes</button>`
  (`server.mjs:717`, inside the `field-editor` table's own footer)
- `<button class="bo-btn" data-dialog-trigger="approve-dlg">Approve…</button>`
  (`server.mjs:788`, in a `bo-cluster` below the Documents fieldset)

Both are plain `.bo-btn` — no `--secondary`/`--ghost`/`--sm` modifier — so
both read as primary at once. ROADMAP.md's own measured precedent
(2026-08-19) is "18 of 19 pattern screens have ≤1 visually primary action;
the wizard's Next/Submit pair is the sole exception, and even that one is
**never both visible**." The PO detail screen breaks that bar: editing and
approving are both visible together the whole time a Pending record is
open.

Each button is individually correct — `Save changes` matches the
documented `/patterns/field-editor` shape exactly (`Save vendor` is plain
`bo-btn` there too, with nothing else competing on that page), and
`Approve…` matches the approval-workflow pattern. The violation is a
**composition** problem specific to po-app, not a framework defect: two
independently-correct single-decision patterns were placed on one screen,
and the result is two decisions sharing a page — precisely the shape
principle 4's Rethink test names ("it is usually two decisions sharing one
page, and the fix is a split, not a bigger toolbar").

## Verdict: Rethink (not refuse) — one fix, no framework work

The dogfood-loop pattern itself is healthy: three Explore spikes composed
from existing primitives with zero new framework surface, and the one real
duplication that appeared was caught and consolidated within a wake. The
loop is not drifting.

The screen composition is not. Fix, queued as Slice 70 below: gate the
`Approve…` cluster's visibility off the row-edit table's own
`data-any-dirty` state po-app already tracks (`server.mjs:715,727-732`) —
hide/disable Approve while a Pending record has unsaved edits, matching
the wizard precedent's "never both visible" bar with zero new mechanism.
This is app-level composition, not a framework change, consistent with
principle 3 ("framework does visuals, you do the data/workflow").

**On a fifth po-app feature (cancel/delete PO):** real ERP systems void
POs via a status transition, not a hard delete, and no NEED has surfaced
for it — no dead link, no gap flagged by dogfooding an existing pattern,
just an idea I generated while reasoning about scope. Per principle 1's
Refuse test ("it would be useful" is never sufficient on its own) and
principle 4 (a fifth feature on this same screen would be a THIRD
decision), this is refused for now. If a real gap surfaces later (a
pattern page documents void/cancel and po-app never dogfoods it), that's
a legitimate future Explore brief — not this one.

## Also refused this wake

- A hard-delete route for POs — no documented pattern demonstrates it, no
  gap found by dogfooding, and ERP convention favors a status transition;
  refused per principles 1 and 4 above rather than built speculatively.
