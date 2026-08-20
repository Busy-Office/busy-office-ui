# Design grill — Quantity's +/− buttons: why not optional? And steppers for Money? (2026-08-20)

Owner questions: (1) why are the +/− buttons not optional — they feel wrong
for desktop, fine for tablet; (2) should the Money field (screenshot
attached: `EUR | 1208.00`) get something similar?

## Finding 1 — the buttons were ALWAYS optional in markup; the CSS punished omitting them (fix)

The buttons are separate elements, the behavior tolerates their absence
(`syncButtons` iterates an empty list; the unit-select precision handler
doesn't touch them), and the input works natively without any JS. But
nothing ever said so, and one thing actively broke: `.bo-quantity__input`
carried an unconditional `border-radius: 0` — the butt-joint treatment for
sitting between buttons — so a button-less composition rendered **square
corners**. Verified live by injecting one: `border-start-start-radius: 0px`
on all corners.

**Fixed in CSS, keyed off reality rather than convention:**
`.bo-quantity:not(:has(.bo-quantity__step)) .bo-quantity__input` restores
`--bo-radius-md` and zeroes the −1px overlap margins. The markup's implicit
promise (buttons are separate, therefore omittable) is now honored — no new
modifier, the absence of the buttons IS the setting (principle 2).

## Finding 2 — the real desktop cost was tab stops, and it's now gone (fix)

Measured live: each quantity field was **3 tab stops** (minus → input →
plus). A ten-line-item desktop grid: 30 tabs instead of 10. And the buttons
are pure redundancy for keyboard users — <kbd>↑</kbd>/<kbd>↓</kbd> on a
native `type="number"` input steps without any JS at all.

**Fixed: `tabindex="-1"` on every step button** — 32 buttons across the
quantity page (22), editable-grid (6), field-editor (2), and the behavior's
own markup-contract comment (2). Keyboard equivalence is native (arrows +
typing on the input), so this meets WCAG operability; the buttons remain
fully clickable/touchable and screen-reader reachable in browse mode.
This is the honest answer to "not good for desktop": the buttons were never
the problem — their tab stops were. With one tab stop per field, the
buttons are free on desktop and essential on touch.

Documented both in the Basic caption and a new ApiTable note: buttons are
the pointer/touch affordance; omit them for desktop-first forms; the
unit-select and precision table still work.

## Finding 3 — steppers for the Money field: REFUSE

The pictured field captures an amount like `1208.00`. Nobody nudges an
invoice amount by a cent — amounts are typed (or pasted), not stepped;
there is no ERP "one more cent" action the way there is a "one more unit"
action on a count. A stepper on Money would be surface serving no real
scenario (principle 2's refuse test verbatim: "a modifier/part that serves
exactly one scenario" — here, zero scenarios) and a second way to change a
value that typing already changes. Slice 79 recorded the same boundary
from the JS side: stepping is what makes a count a count; Money's JS is
precision-following, not stepping. If a genuine stepped-money case ever
appears (a price adjusted in fixed ticks — a trading UI, not ERP), it can
compose `.bo-quantity` with a currency in the label — the mechanism
already exists; it does not need a second home.

## Verdict summary

| # | Element | Verdict | Why |
|---|---|---|---|
| 1 | Unconditional `border-radius: 0` on `__input` | **fix** | punished the omission the markup always allowed; `:has()` keys the joint off the buttons actually being present |
| 2 | Step buttons in the tab order | **fix** (`tabindex="-1"` ×32) | 3 tab stops per field, redundant with native arrow keys — the real desktop complaint |
| 3 | Buttons themselves | keep | the pointer/touch affordance; now documented as optional |
| 4 | Steppers on Money | **refuse** | amounts are typed, not nudged; zero-scenario surface; compose Quantity if a tick-stepped price ever genuinely appears |
