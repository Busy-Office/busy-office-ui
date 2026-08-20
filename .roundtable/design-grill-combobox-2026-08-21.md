# Design grill — the Combobox page (2026-08-21)

Next Data-input member in the owner's walk (after Forms). Same docs
grill discipline.

## Finding 1 — mixed Demo usage, and the write-twice defect already live (fix)

One section used `Demo` (Value help) while four recipe sections
hand-wrote live markup with no copyable code — and the same widget
markup existed twice TODAY: Basic's live markup duplicated the `markup`
const; Form integration's live markup duplicated `formMarkup`'s widget
half. Converted Basic, In-a-filter-bar, Form integration, and Field
states to `Demo` (one string → preview + code); `formMarkup` split so
the recipe lives once in the Demo and only the focusout-validation
script remains as a separate code block. Verified live post-conversion
with a REAL interaction, not just rendering: typing "log" into the
Basic combobox opens the list (`aria-expanded=true`, `:popover-open`)
and filters to exactly "CC-2205 — Logistics" — the Demo move didn't
break the behavior.

## Finding 2 — Markup sat 6/11 (fix)

Five demo sections trailed it. Moved last (with the page-level script),
matching the house convention. Verified live in the served heading
order.

## Finding 3 — the synthetic snapshot must NOT become a Demo (deliberate exception, recorded)

"What the open list looks like — active option" is a fake: readonly
input, forced `aria-expanded="true"`, static-positioned listbox — it
exists only to make active-option styling visible without interacting.
Offering that as copyable code would teach a broken recipe. Kept
hand-written with a source comment stating exactly why, so a future
consistency sweep doesn't "fix" it.

## Checked and cleared

Opener (names the single-vs-multi split), the seven ApiTable notes (all
gotchas, no caption repeats), Related links, the keyboard-reference
table, the honest caveats (closes-on-scroll, async recipe's
out-of-order guard).

| Element | Verdict |
|---|---|
| Four hand-written recipe demos + duplicated widget markup | fix — Demo conversion, duplication removed |
| Markup at 6/11 | move last |
| Synthetic snapshot | keep hand-written — deliberate, now commented |
| Opener, notes, keyboard table, caveats | keep |
