# Design grill — the Forms page (2026-08-21)

Owner wishlist named "Data Input - forms"; "next" confirmed proceeding
with the natural reading — grill the Forms page, the remaining Data-input
member after the Money/Quantity/Amount sequence. Docs grill, same
discipline as the family passes: judged against the house conventions the
other component pages follow.

## Finding 1 — no `<Demo>` anywhere on the page (fix, the big one)

Every other component page renders each demo's preview AND its copyable
code from ONE string via the `Demo` component — the house recipe says so
explicitly ("never write the preview and code twice"). The Forms page —
the page a first-time user most likely reads first — hand-wrote all six
demos as live markup with **no copyable code at all**, and separately
hand-maintained the one canonical field recipe as a string, duplicating
the cost-center error field (in sync today, drift-risk by construction —
the exact failure mode the recipe warns about, and the same shape as the
mixed live-markup/template-literal files CLAUDE.md says to treat
carefully).

**Fixed: all six demo sections converted to `Demo`** — Fields row,
Required & disabled, Density, Seamless, Sections & action bar, Choices —
each preview + copyable code now from one string. The Markup section
stays code-only (that IS the house pattern for Markup sections; checked
against quantity/money before assuming). Verified live: `bo-form-row`
occurrences doubled in the served page (each string renders once as
preview, once as code), error styling still applies (danger-token border
in both themes), density row still contrasts 28px vs 44px controls.

## Finding 2 — "Markup" wasn't last (fix, arrangement)

The canonical-recipe section sat 5th of 7, with Sections & action bar and
Choices trailing it. Every family page puts Markup last before the
generated tables. Moved: order is now Fields → Required & disabled →
Density → Seamless → Sections & action bar → Choices → Markup. Verified
live.

## Finding 3 — the first heading named the mechanism (fix, reword)

"Fields (error styling is pure CSS via `:has()`)" — a heading carrying an
implementation detail, on the section that also had NO caption (the only
one on the page without). Ive rule: meaning, not mechanism. Retitled
**"Fields — label, hint, error"**; the `:has()` fact moved into a new
one-line caption together with the ARIA half ("both halves are the
contract"), which previously lived only in a code comment.

## Checked and cleared

- The Amount field's recipe — already aligned in 77.4 (`Amount (USD)`,
  `type="number"`, unformatted value). ✓
- ApiTable notes — two, both genuine gotchas, no caption repeats. ✓
- Related links — accessibility model / first screen / login pattern, all
  live. ✓
- Opener — meaning-first, correct. ✓

## Verdict summary

| Element | Verdict | Why |
|---|---|---|
| Six hand-written demos, zero copyable code | **fix** (Demo conversion) | the house "one string" recipe; drift-risk on the duplicated error field |
| Markup section at 5/7 | **move** last | every family page's convention |
| Mechanism-named first heading, caption-less | **reword** | meaning over mechanism; the ARIA half now stated in prose, not a comment |
| Opener, notes, Related, Amount recipe | keep | checked, already right |
