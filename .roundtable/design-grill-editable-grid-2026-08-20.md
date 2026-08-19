# Design grill — /patterns/editable-grid (2026-08-20)

Batch 3 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container (both themes), plus direct DOM
interaction — this page is heavily interactive (five wired behaviors), and
the significant finding below only surfaces by actually operating the
controls, not by reading source or a screenshot.

## Step 1 — the decision

**Was missing — the "what, not who" gap this sweep keeps finding.** The
opener led with *"Line-item entry — a PO, an invoice, a pick list —
composed entirely from existing pieces, presented as a graded path"* —
composition and scope, never who's doing the entry or what "done" looks
like. Reworded: *"Who uses it: whoever enters or corrects line items — a
buyer building a PO, a warehouse clerk keying a pick list. What 'done'
looks like: every row either saved or still marked unsaved, never silently
dropped."*

## Findings

**A real, measured inconsistency in `initRowEdit()`'s Cancel handling —
found by operating the live demo, not by reading source.** The "Medium"
demo's first row starts with an invalid Qty cell (`aria-invalid="true"`,
"Exceeds on-hand (200)") but no `data-row-state` on the `<tr>` — the States
table's own claim that a cell error ships "with the row tinted" isn't true
of this row until it's touched. That's a milder, cosmetic gap. The real
finding is what happens next:

1. Typed a new Qty value → row correctly goes `data-row-state="dirty"`.
2. Clicked **Cancel** → `resetField()` correctly restores the input to its
   original value, **450 — which was never valid in the first place**
   (still "exceeds on-hand"). Checked via direct DOM read:
   `{rowState: null, qtyValue: "450", ariaInvalid: "true",
   messageStillThere: true}`.

Cancel removes `data-row-state` unconditionally (`row-edit.ts`'s `setDirty`
has no awareness of any remaining `aria-invalid` cell in the row), but
restores the field to a value that is — by the row's own still-present
`aria-invalid` and message — **still invalid**. The result: the cell-level
signal (red border, message) correctly survives Cancel, but the row-level
signal (left-border tint, the "two channels" the States table promises)
disappears, even though nothing about the underlying problem was resolved.
Two channels that are supposed to agree fall out of sync specifically at
the moment a user cancels out of fixing a pre-existing error — which is a
real, plausible action (a clerk opens the row, decides not to fix it right
now, clicks Cancel).

**Not patched here.** This is the framework's actual state-machine
behavior (`row-edit.ts`), not a docs-only mismatch, and deserves a
considered fix (should `setDirty(false)` check for surviving
`[aria-invalid="true"]` cells before clearing `data-row-state`? should
Cancel re-derive row state from cell validity rather than assuming clean?)
rather than a same-wake patch to state-machine code three other patterns
compose against. Queued as **58.4**.

## What's already strong

- **The graded-path structure itself is unusually disciplined**: Simple →
  Medium → Money/unit → Advanced → WYSIWYG → Save-per-change → Full
  picture, each explicitly stating what's NEW versus the prior tier and
  reusing markup rather than restarting it.
- **`data-grid-nav` is explicitly NOT used, with the reasoning stated**:
  roving-tabindex fights rapid sequential entry, and the page names the
  trade-off rather than silently picking one model.
- **Tag-input restoration on Cancel is explicit, unprompted plumbing**: the
  page states outright that chips are consumer-rendered so the framework
  can't restore them, and shows the exact `bo:row-cancel` listener that
  does — the same category of honesty as the framework's own docs about
  what it does and doesn't own.
- **Announcement discipline (committed change, not per keystroke)** is
  argued with the actual accessibility reasoning (a screen reader shouldn't
  get a queue of per-keystroke totals) and cites its own origin ("grill
  E4").

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **fixed** | added Who/What-done framing |
| Cancel + surviving cell error (row-state desync) | **queue (58.4)** | real, measured framework inconsistency; needs considered state-machine work, not a same-wake patch |
| Initial demo row's missing `data-row-state="error"` | **note, not fixed** | milder cosmetic gap, same root cause as 58.4 — fixing the state machine makes this consistent for free |
| Graded-path structure | **keep** | disciplined, each tier states its delta |
| `data-grid-nav` deliberately omitted | **keep** | trade-off stated, not silent |
| Tag-input Cancel restoration | **keep** | explicit ownership boundary, shown not just claimed |
| Announcement discipline | **keep** | reasoned, cites its own origin |

## Recommendation

Opener fixed. One real framework-level finding, queued (58.4) rather than
patched — same discipline as 58.3's stepper-clipping queue last wake.
