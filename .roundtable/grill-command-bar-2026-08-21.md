# Grill — the command bar: promote it, or compose it?

2026-08-21. Delivers the decisive half of **99.3**, and satisfies the gate the
owner put on **99.4**: grill the need *before* any code.

The question is not "is a command bar useful" — the coverage report already
ranked it **build**, and one has been in daily use in this repo since the docs
shell was written. The question is what, if anything, `packages/core` should
gain because of it.

## Verdict

**Do not promote the docs implementation. Do not add a `bo-command-bar`. Do not
add a `bo-dialog--palette` modifier either.** A command bar is
`bo-dialog` + `bo-combobox` + `bo-kbd`, and the framework already ships all
three. The pattern gets documented as a screen; the framework gains nothing.

This is a **refusal on all three counts**, which Objective §2 lists as a valid
outcome and 99.4 names explicitly as an expected one.

## The measurement that decides it

Not "it's small". The docs palette is **the wrong shape**, and the framework
already contains the right one.

Both measured in one live session, same page, same DOM — the docs palette
opened with a real query returning 5 results, and the shipped combobox on the
same page arrowed once:

| Contract | shipped `bo-combobox` | docs command palette |
|---|---|---|
| `role="combobox"` on the input | yes | **none** |
| `aria-expanded` | `true` | **none** |
| `aria-controls` → listbox | `demo-cb-list` | **none** |
| `aria-autocomplete` | `list` | **none** |
| `role="listbox"` present | yes | **no** |
| `role="option"` on results | 15 | **0** |
| `aria-activedescendant` after ArrowDown | `demo-cb-opt-1` | **none** |
| `aria-selected` on the active option | `CC-1180 — Warehouse` | **none** |
| any live region for the result count | — | **none** |

The palette moves raw DOM focus between five `<a>` elements. A screen-reader
user types, five results appear, and **nothing announces that anything
happened**. The framework answers this exact question correctly one component
over.

So promoting the docs implementation would ship a **second, worse answer to a
question the framework already answers** — the precise thing Objective §1
refuses. That is a stronger reason to refuse than size, and it survives the
obvious counter ("but we could fix the ARIA on the way in"): fixing it *is*
`bo-combobox`.

## The CSS, measured

`.docs-cmdk` has **10** non-custom-property declarations.

- **7 are already in `.bo-dialog`** — `inline-size`, `padding`, `border`,
  `border-radius`, `background`, `color`, `box-shadow`. Duplicated, not needed.
- **6 more** are `--pagefind-ui-*` mappings. Docs-only by construction; they
  cannot generalise to an ERP whose results come from its own backend.
- **3 are genuinely new**: `margin-block-start: 12vh`, `margin-inline: auto`,
  `overflow: hidden` — i.e. *top-anchor the dialog instead of centring it*.

Does top-anchoring earn a `--palette` modifier? **No.** Swept the tree: it is
used by **exactly one** dialog, the docs' own. Objective §3 — nothing ships for
one screen. If a second top-anchored dialog ever appears, the modifier costs
three declarations and can be added then, with two callers to justify it.

## What is actually missing, and where it belongs

Stripping the pagefind coupling, the docs behaviour is: ⌘K toggles, focus and
select the input on open, Arrow keys move through results, Enter follows,
backdrop click closes, the hint renders `⌘K` on Mac and `Ctrl K` elsewhere,
and if the search index fails to load the trigger removes itself rather than
opening an empty box.

Every one of those except the first is already `bo-dialog` or `bo-combobox`.
What is left is the **global shortcut binding** — and that is a page-level
decision, not a component one: which key, which element, and whether the app
already owns ⌘K for something else. It stays the consumer's four lines, shown
in the pattern's markup rather than hidden in a behaviour.

The graceful-degradation move is worth naming in the pattern page as a rule,
because it is the non-obvious part and it generalises: **if the result source
cannot load, remove the trigger.** A command bar that opens onto nothing is
worse than no command bar.

## A defect found on the way

`.docs-cmdk::backdrop` hardcodes `rgb(0 0 0 / 0.45)`. `--bo-color-scrim` was
added this session for exactly this and `.bo-dialog::backdrop` already consumes
it. Docs chrome, not shipped source, so it reaches no consumer — but it is a
token with a caller it missed, and it disappears anyway if the docs palette is
ever rebuilt on `bo-dialog`.

## What this does NOT cover

The comparison is of the **ARIA and keyboard contract**, measured in one
browser. It is not a screen-reader test with a real AT — that remains
owner-blocked (roadmap 15) — and "has the right roles" is not the same claim as
"announces well in JAWS". It is, however, exactly the property that decides
promotion, because the shipped component holds the contract and the candidate
does not.

Nor does it claim the docs palette is unusable. It works, by pointer and by
keyboard, for sighted users; it has been used daily. It is unfit **to be
promoted as the framework's answer**, which is a different and narrower claim.

## Queued from this grill

- **99.3a** — document `/patterns/command-bar` as a composition, with the ⌘K
  binding and the remove-the-trigger-on-failure rule in its markup.
- **99.3b** — docs debt, low priority: rebuild the docs palette on
  `bo-combobox` + `bo-dialog`, or record why PagefindUI's owned DOM makes that
  impractical. Its `::backdrop` picks up `--bo-color-scrim` when it happens.
