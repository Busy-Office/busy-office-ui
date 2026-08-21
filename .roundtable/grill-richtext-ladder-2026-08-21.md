# Grill — rich text, simple to advanced

2026-08-21. Delivers **102.1**, an owner ask: *"Grill Rich text — Simple to
Advance."* The framing asks the question the page did not: what is the LADDER,
and which rung does an ERP screen actually need?

## Verdict

**The ladder already exists, all five rungs, and needs no new component.** That
is the outcome 102.1's Accept named as valid and preferred, and it is what the
measurement supports.

**But the page never told you which rung you were on**, and that is a real
defect rather than a quibble: a reader landing on `/components/richtext` got no
signal that most ERP free-text should never be rich text at all. Fixed in this
slice; details below.

## The ladder, measured

| Rung | Job | What it costs |
|---|---|---|
| 0 | plain multi-line note | `textarea.bo-input` — **one class, no component** |
| 1 | display a stored rich value | `.bo-prose` — one class, native elements |
| 2 | a rich field that is currently locked | `.bo-richtext--readonly` / `--disabled` |
| 3 | light editing: bold / italic / lists | `.bo-richtext` + toolbar + native `execCommand`, **zero framework JS** |
| 4 | real editing: undo, schema, sanitize | same chrome, engine mounted into `__content` |

Rung 0 is the one worth naming, because it is invisible from the richtext page
and it is where most ERP notes belong. `form/input.css` styles
`textarea.bo-input` directly, and `approval-workflow.css` says so in a comment
rather than duplicating anything: its composer is *"plain `.bo-input`… this
component is only the layout"*. The framework got this right and never said so
out loud in the place a reader would look.

Rungs 1 and 2 look like duplicates and are not. `.bo-prose` displays *content*;
`.bo-richtext--readonly` is a *field* that happens to be locked — muted
background, "you cannot edit this right now". Different questions, different
answers. `prose.css` records that it was extracted from richtext deliberately
(2026-08-16) so display-only consumers avoid the editor chrome.

## Rung 3 works, and the page's own caveat is demonstrably true

Tested live rather than read: selected "hello" in the Basic demo, fired the Bold
button. Result — `<p><b>hello</b> world</p>`, and `aria-pressed` moved
`false` → `true` on the button.

So the light case is genuinely functional with zero framework JS, and the
`aria-pressed` sync the page claims is real.

More usefully, **the browser produced `<b>`, not `<strong>`** — which is
precisely the caveat the page warns about two sections later ("bold may come
back as `<b>`, `<strong>`, or a styled span… write your sanitizer allowlist
against all the variants"). The warning is not defensive boilerplate; it
reproduced on the first try, in the first browser tried.

## The defect: no rung was named, and the gate already knew

`richtext` was sitting in `check:wrong-choice`'s TODO list, and its DSA
`content` dimension scored **2** with an improve entry reading *"write the
wrong-choice clause the recipe requires"*. Two independent records already said
the page did not tell a reader when NOT to use it. The owner's ask and the
project's own ratchet pointed at the same line.

Fixed by writing the clause, which moved **all four records at once** — the
opener, `check:wrong-choice`'s TODO (23 → 22 outstanding, 14 → 15 carrying),
the `content` score (2 → 3), and the improve entry (cleared). That interlock is
the 94.12 design working exactly as intended: one action, no record able to
drift from another.

The clause says: an ordinary note field is `textarea.bo-input`; rich text
commits you to sanitizing, storing and printing HTML forever; and a value that
is *already* rich is displayed with `.bo-prose`, not a disabled editor.

## A finding I am NOT calling a defect

`.bo-prose` renders on exactly **two** built pages, and both are component docs
(`/components/prose`, `/components/richtext`). **Zero of the 20 pattern screens
use it** — `record-detail`'s audit trail is `bo-audit__detail`, plain text.
Measured on the built artifact and reconciled against the source.

`prose.css`'s header claims its uses are *"richtext `__content`, record detail,
comment threads, printed notes"*. Only the first is true today.

**Counter-argument, and it is why this is not queued as a fix:** `bo-prose`
ships for *consumers*, whose ERP will have stored rich text; docs usage is not
the measure of a display component's worth. Manufacturing a pattern screen just
to exercise it would be building for the metric. What is fair to say is
narrower: **the bottom rung of the ladder has never been exercised against a
real screen in this repo**, so if it is wrong, nothing here would find out. That
is worth knowing when Inbox / Notification / Report (101.4-101.6) are built —
any of the three is a natural first real consumer.

## What this does NOT cover

Rung 4 was read, not run: no ProseMirror engine was mounted to verify the
documented `removeAttribute('contenteditable')` / `removeAttribute('role')`
recipe actually yields a working editor. That needs a dependency the framework
deliberately does not ship, so it stays a documented recipe rather than a
verified claim — and the page should not be read as promising more than that.

Sanitization is asserted, not tested: the page says "SANITIZE ON THE SERVER"
and there is no server here to check.
