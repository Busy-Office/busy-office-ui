# DSA batch 2 — Data input (2026-08-21)

| component | Hier | Typo | Colour | Spacing | Inter | Content | Fit | DSA |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| `file-upload` | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **100%** |
| `richtext` | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **100%** |
| `form` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |
| `combobox` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |
| `filters` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |
| `tag-input` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |

No component hit the grill trigger. Zero raw hex across the entire
family. The two 100%s earn it the same way: **both are honest about
what they do NOT own** — `file-upload` states which parts of a file
input CSS can never theme; `richtext` documents that it is chrome, not
an engine, and that `execCommand` is deprecated. Naming a limitation
scores where hiding one would not.

## The cross-family finding: Spacing is the systemic deduction

Eleven components scored across two batches. **Spacing is 2 on eight of
them, and it is the ONLY dimension that has ever scored below 3.**
Every instance is the same shape: an intrinsic, correct dimension
literal (a chevron box, a chip padding, a listbox max-height, an
action-bar clearance) written raw and left uncommented.

That is not eleven small defects — it is one habit, and it should be
fixed as one thing rather than nagged per component. Two candidate
resolutions, for the owner:

1. **Comment each in place**, stating why the number is intrinsic
   (a chevron sized in `em` tracks its text; a 6rem clearance is the
   action bar's own height). Cheapest, keeps the literals.
2. **Add a token tier for intrinsic control dimensions** so these stop
   being literals at all. Larger, and risks a token for every one-off.

Recommendation: (1). These numbers are genuinely intrinsic — tokenizing
a chevron's `1em` would add indirection without adding meaning. The
score is telling us the *reasoning* is missing, not the token.
Broadened as **94.2** (supersedes the per-component halves of 92.5 and
94.1's spacing clause).

## Instrument check

Scores cluster 90-100%, which invites the "is this discriminating?"
question the project's own doctrine demands. Evidence it is: it
separated `data-table` (90) from `pagination` (100) in batch 1, and it
surfaced two structural findings a per-component pass would have missed
(the print-block hex reconciliation; `inline-editing`/`table-toolbar`
not being components at all). High scores are also the expected result
for a surface that has been grilled against these exact rules for weeks
— the instrument is confirming that, not flattering it. The Spacing
pattern above is the clearest proof it discriminates: one dimension,
consistently, for one real reason.
