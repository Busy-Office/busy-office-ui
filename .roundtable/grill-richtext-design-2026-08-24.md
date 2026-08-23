# Grill — rich text, the DESIGN

2026-08-24. Owner ask, verbatim: *"/components/richtext - grill the design.
(ref to dropbox text editor or notation -- suggestion for change. what is
needed for ERP)"* — read as Dropbox Paper and Notion.

**This is a different axis from the two grills already on file, which is why
it is not a re-run.** 102.1 asked *which rung* (`.roundtable/grill-richtext-
ladder-2026-08-21.md` — five rungs, ladder complete, no new component). 113
asked *which commands* (the reference toolbar split across rung 3 / rung 4).
Neither asked whether the editor's **shape** is right. That is this one.

## Verdict

**The bordered-field shape is correct and I am refusing the headline
suggestion** — a Notion-style chromeless block editor is the wrong floor for
ERP, for a reason that decides most of what follows. **But three things are
genuinely below the floor, all confirmed live**, and the page has started
arguing with itself.

The sharpest finding is not a missing feature. It is that **`.bo-richtext`
is the only control in the form family that does not show it is invalid.**

## The one structural difference that decides everything

Paper and Notion edit a **document**. `.bo-richtext` is a **field in a form**.
Everything the references do differently follows from that, and so does every
refusal below:

| | Notion / Paper | An ERP rich-text field |
|---|---|---|
| The record | the document *is* the record | one of ~14 fields on a record |
| Saving | autosave, no boundary | dirty/clean, OK/Cancel, a save that can fail |
| Validity | nothing to validate | required, length-capped, server-rejectable |
| Lock | sharing permissions | posting period closed, workflow state |
| The reader | a human, in the app | a print form, an EDI export, a report writer, a PDF dunning letter |
| The writer | an author, for hours | a clerk, for eight seconds, between scans |
| Storage | proprietary block tree | HTML in a column another system parses |

The last two rows are the ones that matter most and get discussed least.

**The value leaves the app.** A Notion page is rendered by Notion forever. An
ERP note gets printed onto a delivery document, exported, and re-parsed by
software nobody in this conversation controls. That argues for a **small,
stable, printable subset** — *fewer* commands, not more. Any design move that
increases expressiveness is a cost paid at every downstream boundary.

**The writer is not an author.** Notion's affordances — slash menus, block
handles, drag-to-reorder — amortise over hours in a document. A warehouse
clerk typing *"pallet 2 damp on one corner"* never reaches that amortisation.
Optimising this field the way Notion optimises a page is optimising for a user
who does not exist here.

So: **the box, the border and the persistent toolbar stay.** A borderless
editor inside a 14-field form loses its extent (where does the field end?) and
its state (is this locked? invalid?), which is the entire job of the chrome.
Notion has no chrome because it has no neighbours.

## Three things genuinely below the floor — all confirmed live

Measured in the container on `:8091` with a real browser, not read off the
CSS. The probe constructed the states rather than trusting the stylesheet,
because a stylesheet is not evidence of what renders.

### 1. The field never shows it is invalid — and every sibling does

`.bo-form-field:has([aria-invalid="true"])` reddens `.bo-input` and
`.bo-select`. `.bo-richtext` **is not in that selector list**, and
`richtext.css` has no `[aria-invalid]` rule of its own.

Constructed both states side by side and read the computed border:

| control, `aria-invalid="true"` | border colour | |
|---|---|---|
| `.bo-input` | `rgb(220, 38, 38)` | = `--bo-state-error-color` ✅ |
| `.bo-richtext` | `rgb(107, 114, 128)` | ❌ |
| `.bo-richtext`, **no error at all** | `rgb(107, 114, 128)` | **identical** |

The label reddens and the message appears, so the field is not *silent* — but
the control itself is indistinguishable from a valid one. On a form where the
user scans for red boxes, this is the box that never turns red.

There is a second-order cause worth naming: `.bo-input` and `.bo-select` are
retintable because they route their border through `--bo-input-border` /
`--bo-select-border`. `.bo-richtext` hard-codes
`var(--bo-color-border-control)`, so **a consumer cannot fix this from the
outside either.** Fixing the convention fixes the state.

### 2. The editor toolbar prints

Print an ERP record detail containing a note and the gray toolbar strip prints
with it — `B I | • List 1. List` on the paper.

Emulated print media and read the computed styles: `.bo-richtext__toolbar` is
`display: flex`, its buttons are `display: flex`. The framework's own
precedent is right there in `print/index.css` — `dialog` and `[popover]` are
`display: none !important` because top-layer chrome never prints. A toolbar is
the same category: a control, not content.

A consumer *could* hand-add `.bo-u-print-hidden` to every toolbar, but
`richtext.css` already rejects that shape in its own comment — *"every `__part`
works with its own class alone; requiring `.bo-cluster` in consumer markup to
save four declarations inverted that contract."* Same inversion.

### 3. An empty field says nothing — and the obvious fix is a trap

The canonical markup in the Markup section ships an **empty** content div. A
contenteditable has no `placeholder` attribute, and the framework ships no CSS
for one, so a consumer following the canonical markup renders an empty box
with no hint that it is a field, is rich, or takes anything.

This is Notion's single best affordance ("Type '/' for commands") and it is a
real floor we are under.

**The three-line fix does not work, and I tested it before proposing it.**
`.bo-richtext__content:empty::before { content: attr(data-placeholder) }`:

| state | DOM | placeholder |
|---|---|---|
| pristine | `""` | `"Add a note…"` ✅ |
| type "x" | `x` | none ✅ *(correct)* |
| type, then delete | `<br>` | **none** ❌ |
| `<p></p>` — what execCommand and the docs' own demos produce | `<p></p>` | **none** ❌ |

`:empty` stops matching the moment the browser leaves a `<br>` behind, which
it does after the first type-then-delete. The placeholder works **exactly
once**, on first paint, then silently never returns.

This is not fixable in CSS, and the reason is worth stating in the docs
because consumers will hit it: **emptiness is a property of text content, and
CSS selectors cannot read text content.** The honest design is a styling hook
the framework ships plus one line of consumer wiring — which is precisely this
component's existing stance, not an exception to it:

```css
/* framework */
.bo-richtext__content[data-empty]::before {
  content: attr(data-placeholder);
  color: var(--bo-color-text-muted);
  pointer-events: none;   /* the caret must land in the text, not the hint */
}
```
```js
/* consumer — one line, same shape as the execCommand wiring already documented */
const sync = (el) => el.toggleAttribute('data-empty', !el.textContent.trim());
```

## The page has started arguing with itself

The opener says most ERP free-text should be a `textarea.bo-input`, and that
rich text *"commits you to sanitizing, storing and printing HTML forever."*
Two sections later, **Advanced** demonstrates fifteen buttons including
left/center/right alignment and indent/outdent — on a field labelled *"Return
instructions."*

Alignment and indentation in a stored ERP note are exactly the cost the opener
warns about: they are markup that must now survive the sanitizer, the export
and the print form, in exchange for centring text nobody asked to centre.

**This is not a defect I am fixing behind the owner's back** — those buttons
exist because 113 asked for them, from a reference screenshot, and they were
built correctly. What the grill can say is that the page now teaches the
opposite of what it preaches, and that the framing is the cheap fix: Advanced
should read as *"everything native gives you, and why you want less"*, not as
the recommended step up.

## Where the toolbar's labels are actually wrong

Not "add icons" — the honest answer is narrower, and the owner's stated
preference (*"why don't we use icon on button as well? easy to spot"*) points
at a real problem with the wrong remedy applied wholesale.

`.bo-icon` exists and works: a masked inline-SVG data URI painted with
`currentColor`, 1em square so it tracks density automatically, zero JS and zero
font files. `app-frame` uses it eleven times. **The richtext toolbar uses it
zero times** — the one surface in the framework that is literally a row of
icon-shaped actions is the holdout.

But the twelve shipped glyphs are all domain nouns — barcode, box, building,
cart, chart, check-circle, doc, grid, invoice, settings, truck, user. **There
is no formatting glyph in the set**, so this costs ~4 new one-line mask rules,
not zero.

And a wholesale swap would be wrong anyway:

- **Keep as letterforms:** **B**, *I*, ~~S~~. A bold "B" is the near-universal
  bold affordance — Word, Docs, and Paper's own floating toolbar all use
  letterforms here. An icon would be worse.
- **Genuinely broken, replace:** `<-` and `->` for outdent/indent (ASCII
  arrows), `"` for blockquote (a bare quote character).
- **Untranslatable, replace:** `Left`, `Center`, `Right`, `Clear`, `• List`,
  `1. List`. These are English words in a framework that ships RTL support and
  a pseudo-locale gate. A German or Arabic consumer gets an English toolbar.

## What an ERP actually needs — the answer to the question

### The field's command set, and nothing else

**Bold, italic, bulleted list, numbered list, link.** Five. That set covers
every real ERP note this repo demonstrates — delivery notes, approval
comments, return instructions, dunning text — and every one of the five
survives a sanitizer allowlist, an export and a print form without argument.

Everything above that line is expressiveness the downstream boundary pays for.

### Two things ERP needs that Paper and Notion do not have

References are floors. These are the two places the floor is *below* us, and
they are where the component could be better than the references rather than
catching up to them:

**1. A document reference, not a URL link.** The single highest-value rich
feature in an ERP note is *"see PO-88213"* becoming a real link to that record.
Notion has @-mentions for people and pages; ERP's equivalent is a **document
reference**, and it is the one rich-text feature a clerk would actually use
daily. `createLink` prompting for a URL — what the page wires today — is the
generic-web answer to an ERP-specific need. The framework already ships
`combobox`, which is the value-help surface this would compose with; the note
field is arguably its most natural consumer and has never been wired to it.

**2. A length budget measured in STORED HTML.** ERP long-text columns have
limits, and rich text spends them on markup the user cannot see: a 200-word
note with heavy formatting can blow a 1000-character column while looking
short. Neither Notion nor Paper has any concept of this, because neither
stores into someone else's schema. **The framework ships no character counter
at all** (confirmed — nothing in `form/*.css`), so this is a hole in the form
family generally, not only here. The ERP-correct version counts the *stored
HTML*, not the visible text, and that distinction is the whole point.

### What ERP does NOT need from the references

- **Slash menu** — amortises over hours; a clerk spends seconds. Refuse.
- **Block handles / drag-to-reorder** — a note is not a document outline.
  Refuse.
- **Floating selection toolbar** — genuinely good in a document, worse in a
  field: a persistent toolbar advertises *"this field is rich"* before the
  user selects anything, which is the discoverability a form needs and a
  document does not. Refuse, and the reason is a real design argument rather
  than a cost dodge.
- **Markdown input rules** (`- `, `1. `, `## `) — the one Notion affordance
  worth taking, and the honest note is that it is what would let the toolbar
  *shrink* rather than grow: a keyboard-bound clerk never reaches for a
  button. List rules are rung-3 achievable in a few lines of consumer JS;
  inline `**bold**` really does need an engine. **Rethink, as a documented
  recipe** — consistent with "chrome, not an engine."

## Objective test

- **Accept** — invalid state (a state signal missing from one control that
  every sibling has), print (a control that prints), placeholder (one CSS hook
  plus a documented line). All three are small, general, and reusable beyond
  richtext: the border-token change fixes a convention gap, and a counter, if
  built, belongs to the whole form family.
- **Refuse** — chromeless editor, slash menu, block handles, floating toolbar.
  Each is a document affordance imported into a form.
- **Rethink** — the Advanced framing (it contradicts the opener), the toolbar
  labels (partial icon swap, not wholesale), markdown list rules as a recipe,
  and the two ERP-specific ideas (document reference, stored-HTML counter),
  which are real proposals needing a decision rather than a build.

## What this does NOT cover

- **No engine was mounted.** Rung 4 stays read-not-run, exactly as the 102.1
  grill left it, and this grill does not upgrade that claim.
- **The document-reference and counter proposals are unbuilt and unmeasured.**
  I am asserting they are the right ERP shape, not that they work; neither has
  a line of code. The 99.4 front door applies before either becomes surface.
- **The five-command recommendation is a judgement, not a measurement.** It is
  argued from the demos in this repo and the downstream-boundary cost, not
  from usage data, which does not exist here.
- **"Notation" was read as Notion.** If the owner meant a different product,
  the reference read in section 2 is the part to re-run; the three confirmed
  defects stand regardless of what the references do.
