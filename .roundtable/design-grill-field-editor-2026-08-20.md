# Design grill — /patterns/field-editor (2026-08-20)

Batch 3 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct, in prose form rather than the bolded Who/How-often/
What-done labels** — *"A back-office user opens one record and corrects a
handful of fields... They do it a few times a week, not all day, and
'done' means the whole record committed once."* Names user, frequency, and
completion criterion in one sentence. Not a finding; the bolded-label
format is a consistency nicety, not a substance gap, so left as-is rather
than reformatted for its own sake.

## Findings

**None.** Checked every Anatomy claim against the live page:

- **"Field column — a `<th scope="row">`, not a `<td>`"** — confirmed in
  the rendered markup on all six rows.
- **"Seamless variants on *every* field, including money and quantity"** —
  checked: `bo-select--seamless`, `bo-money` fields inside seamless
  wrapping, `bo-quantity` — all six rows use the seamless treatment
  consistently, none reads as a boxed outlier next to the others.
- **"Hint text... never as placeholder text"** — confirmed: every field has
  a `<span class="bo-u-text-muted">` under the field name in the `<th>`,
  zero placeholder-as-label usage anywhere on the page.
- **Row actions (dirty badge, Save/Cancel)** — wired via `initRowEdit()`,
  same shared behavior as `editable-grid`'s.

**The "why one Save and not one per row" argument is the most concrete
anti-decoration reasoning found in the sweep**: it cites a measured
regression from an earlier version of this exact page — *"a button sitting
228px from the field it saves in an actions column taking 37% of the
table"* — not a hypothetical designers avoid, a number from this project's
own history. This is Objective §3 (small & general, compose don't
duplicate) and §7 (no decoration) both argued from evidence in the page's
own copy.

**The one-field-per-request data contract is reasoned, not just
specified**: *"a whole-record PUT makes two people editing two different
fields overwrite each other, and it is exactly the case this screen exists
for."* Ties the wire contract back to the same real user (a back-office
admin, working alongside others) the opener names.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/how-often/what-done in prose |
| `<th scope="row">` for field labels | **keep** | verified live, all 6 rows |
| Seamless on every field type | **keep** | verified live, none reads as an outlier |
| Hint text placement | **keep** | zero placeholder-as-label found |
| "Why one Save, not per-row" | **keep** | reasoned from a measured regression in this project's own history |
| One-field-per-request contract | **keep** | reasoned from the actual concurrent-editor scenario |

## Recommendation

All-keep, alongside `staging` — the second reference-quality page found in
this sweep. No prose reword, no removal, no new surface.
