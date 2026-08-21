# Grill: validation as ONE experience (97.2) — 2026-08-21

The owner's ask (Slice 97): validation appears in three places — `.bo-form-field`
(message under a labelled control), the editable grid (message inside a table
cell), and `/patterns/validation-summary` (a list at the top). One design with
three renderings, or three designs that coexist? Every claim below was measured
live against the built site (nginx bind-mount on :8091, dist at HEAD), driven
with real keys and clicks, not read from source.

## Verdict up front

**It is one design — the grid literally reuses the form-field mechanism — with
two seams that are misaligned, both navigational, neither structural.** No
surface needs replacing. Two aligns queued (97.3, 97.4).

| Surface | Verdict | Ground |
|---|---|---|
| `.bo-form-field` | **keep** | single reveal mechanism; the other two build on it |
| editable-grid in-cell | **keep mechanism, align the return path** (97.3) | it *is* `.bo-form-field`; but the page never names the summary as the multi-row story |
| validation-summary | **keep** | full contract verified live, links focus the field |
| wording | **accept-with-reason + state the rule once** (97.4) | examples agree in structure; the rule exists only by example |

## Q1 — does an in-cell message shift the rows below, and by how much?

**Yes: +22px per one-line message, and everything below moves by exactly that.**
Measured on `/patterns/editable-grid`'s invalid QTY cell: row 74.5px with the
message, 52.5px without (toggling `aria-invalid`); tbody grows by the same 22px
(18px message line at `--bo-font-size-xs` + 4px flex gap). Identical mechanism
and identical 22px on a plain form field (`/components/form`, content 83 → 61px)
— which is the proof the grid is the *same* design, not a second one.

**The mid-typing behaviour, measured with real keys** (a `max="200"` constraint
added to the demo input so native validity drives it):

- Typing an exceeding value **before first blur**: no reveal, no shift
  (`checkValidity() === false` while `:user-invalid` stays unmatched — the
  platform holds the message back until the user is done, by design).
- On blur: reveal (+shift).
- **After the first invalid blur, `:user-invalid` toggles per keystroke**: 450 →
  150 → 450 while focused flipped the row 92.5 → 52.5 → 92.5. So the row DOES
  jump while the user types, but only in the correct-the-error phase, exactly at
  validity transitions — which is when the user must see the message change.
  Reserving the space instead (visibility, not display) would cost every grid
  row 22px permanently, which is the wrong trade for a dense ERP grid.
  **Accept-with-reason.**

**Wrap risk, found by accident and then verified:** the 92.5 above is +40, not
+22 — in that run the QTY column had sized to 160px and the message wrapped to
two lines. In the shipped demo the column is 226px and the message fits on one;
toggling the message does not change any column width (measured: 226/226/226/72
both ways). The honest general claim is **+22px per message line**, and a long
message in a narrow column doubles it.

## Q2 — a row fails and the user has scrolled away: what brings them back?

**Today: nothing on the page, and the page doesn't say where the answer lives.**
`/patterns/editable-grid` has no `[data-validation-summary]`, and the string
"validation-summary" appears in its rendered body only via the sidebar nav —
not in prose, not in Related (checked both rendered DOM and source; Related
lists six links, none of them the summary pattern).

**Half of that is correct and should be kept**: the grid's own data contract is
per-row (`PATCH /po/:id/lines/:lineId`, 422 → that row re-rendered with cell
errors). Failure follows a per-row action, so the failing row is the row the
user just acted on — a summary would be ceremony there. The gap is the
**document-level submit** (post/approve the whole PO, server rejects rows 3 and
17): that is precisely `/patterns/validation-summary`'s job (its links focus
fields, and focus scrolls the row into view, so field-targeting subsumes
row-targeting), and neither page names the boundary or links the other.
→ **97.3**.

One latent copy-paste gap found on the way: the grid's invalid-cell sample input
carries `aria-label` and `aria-describedby` but no `id` — as copied, a summary
link for it renders `href="#"` (the behavior's `a.href = '#' + field.id`). The
JS click-to-focus still works; the href half doesn't. Folded into 97.3.

## Q3 — is the summary's link target the field or the row?

**The field, verified live, not read from source.** A real click on submit:
the behavior intercepted it, unhid the box, moved focus to the box
(`document.activeElement === box`), rendered `#vs-vendor` / `#vs-amount` /
`#vs-email` with label text, and a real click on the first link put focus on
`INPUT#vs-vendor`. Field is the right target for a grid too — focusing an
in-cell input scrolls its row into view, and the row is never itself focusable.

## Q4 — do the three surfaces agree on wording?

Collected every visible message: "Exceeds on-hand (200)" (grid), "Unknown cost
center code" (form), "There is a problem" (summary heading), and the
document-level strip's full sentence naming what is still possible.

**They agree in structure and diverge only where the job differs.** Both
field messages are terse constraint-statements carrying the datum needed to act
(the limit; the fact the code is unknown). The summary heading is GOV.UK's
deliberate, documented voice. The document strip's rule ("say what is still
possible") is stated on its page. What's missing is that the **field-message
rule exists only by example** — nowhere does the recipe say what a field
message should sound like, so the next consumer (or the next docs page) has
nothing to follow. → **97.4**: state it once, beside the live-region rule 97.1
already centralised. Not a gate — "the message names the violated constraint"
is semantic, exactly the shape 94.11 proved unmechanisable.

## Instrument failures owned (per the base-rate rule)

- First mid-typing run reported 92.5/92.5/92.5 for valid and invalid values —
  triple-click selection on a `type=number` input concatenated values
  ("450150"). Re-driven with `select()`; the flip is real.
- The +40 vs +22 disagreement between two runs of the "same" measurement was
  chased before quoting either: column-width artifact (above), not a second
  mechanism.

## Queued

- **97.3** — name the per-row vs document-level boundary on both pages, link
  each to the other, and give the grid's copyable invalid input an `id`.
- **97.4** — state the field-message wording rule once.
