# Design grill — /patterns/invoice-list (2026-08-20)

Batch 4 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"Who uses it: AP clerks, all day — the screen they
live in. What 'done' looks like: find the invoices that need action, act on
them in bulk, and never lose your place."* Not a finding.

## Findings

**None that rise to a defect.** One nit considered and set aside: Anatomy's
Footer item names "rows-per-page + pagination, or a load-more button" as
the two options, and the live demo shows pagination with no rows-per-page
selector. Read literally that's a partial match — but the item's own
"pick one and keep it (see Scaling)" framing reads as describing the
pagination-vs-load-more choice, not mandating a page-size control as a
second required element. Checked the Scaling section: it discusses exactly
that choice (pagination for "clerks cite 'page 3'", load-more for
scanning) and never separately argues for a rows-per-page control. Left
alone rather than manufacturing a finding from an overly literal reading.

## What's already strong — this is the most evidence-dense pattern page in
## the sweep so far

- **A real measured regression anchors the keyboard-walkthrough argument**:
  *"thirty-two presses from row 30, which is what this page measured before
  the form was added"* — not a hypothetical cost, a number from this
  project's own history, for exactly why rows and bulk buttons share one
  `<form>`.
- **Only the safe bulk action is `type="submit"`**, checked live: Approve
  is `type="submit"`, Reject is `type="button"` — so native implicit
  submission (Enter from any row) can never reach the destructive action.
  Same discipline `bulk-actions` states, verified independently here.
- **The filter-token design explicitly rejects the "safer-seeming"
  alternative**: an unrecognized `key:value` token stays free text rather
  than silently matching nothing, because a vendor genuinely named
  `ref:99` must remain findable — cites the exact scenario, not a vague
  "edge cases" hand-wave.
- **Scaling notes carry real numbers, not guidance**: render costs "1k →
  20k, including a 4× CPU throttle," ~5k rows as the pagination threshold,
  German labels measured at "~35% longer." Every claim in this section is a
  citation, not an opinion.
- **Print behavior is demonstrated with an instruction to verify it**
  ("Print the page to see it — no print-specific markup required") rather
  than merely asserted.
- **`aria-sort="ascending"` is live on the Invoice # header** — checked;
  matches the Anatomy claim exactly.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done |
| Anatomy "Footer" (pagination vs rows-per-page) | **keep** | literal-reading nit, set aside — the item describes a choice, not two required elements |
| Bulk-action button types | **keep** | verified live, matches the stated safety rule |
| Filter-token design | **keep** | named scenario, not a hand-wave |
| Scaling notes | **keep** | every number is a citation |
| `aria-sort` on sorted header | **keep** | verified live |

## Recommendation

All-keep. Alongside `staging` and `field-editor`, the third reference-
quality page found in this sweep. No reword, no removal, no new surface.
