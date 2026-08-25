# Grill: does a comment/chat thread earn a component? — 2026-08-25 (roadmap 144.2)

**Ask (owner):** "add components — for comment/chat."

**Verdict: refused as a component, accepted as one modifier.** The framework
already shipped four fifths of a comment thread. The fifth was a real,
measured defect, and it is now fixed.

## What the survey found before any CSS was written

The roadmap entry for 144.2 set the test: *what does a comment thread have that
`bo-timeline` and `bo-audit` do not?* — author identity, relative time,
threading, and an unsent draft. Three of those four were already shipped, and
one of them was shipped **for this exact purpose**:

| Need | Already ships | Evidence it was meant for this |
| --- | --- | --- |
| The ordered list | `.bo-audit`, `__entry`, `__time`, `__detail` | — |
| Author + time line | `.bo-byline` | Its own first comment: "for a record header, **a comment**, a feed item, an audit note" |
| The face | `.bo-avatar`, `.bo-byline__avatar` | — |
| The unsent draft | `.bo-composer`, `__body`, `__actions` | Its own comment: "how a new `.bo-audit` entry gets written". Its docs demo placeholder is literally `Add a comment…` and its button says **Comment**. Its `@media print` rule calls it "an empty **comment-input** form". |

Threading was the only genuinely absent item, and it is refused on its own
merits below.

## The test: build one from shipped CSS and let the gate referee

Rather than argue it, a thread was built into `p2p/purchase-order` — the ERP
suite enforces **zero CSS of its own**, so the instrument decides. It passed:
22 screens, zero local CSS, zero axe violations, no sideways scroll at 390.

So the composition works. But a passing gate is not a rendered screen, and
measuring the render is what found the defect.

## The one thing that did not compose — measured, not inferred

Rendered on a real screen at 1440, comparing against an independent reference
(the same `.bo-prose` markup outside the list):

```
comment body inside .bo-audit__detail   12px   secondary ink
the byline introducing it               13px
the timestamp                           12px
the same .bo-prose outside the list     14px
a .bo-data-table cell, for scale        13px
```

**The message was smaller than its own byline, and smaller than a table cell.**
That is backwards: the metadata outranked the content it introduced.

The cause is not a bug in `.bo-audit__detail` — `font-size: xs` and secondary
ink are *correct* for "changed status to Approved". The cause is that an audit
line and a comment are two different kinds of entry sharing one container.

> **First reading was from a bad instrument.** The initial run compared the
> comment body against "the first long paragraph outside the audit list" — which
> picked up `Blocked · price variance $1,240.00 over…`, itself small print. It
> reported 12px vs 12px, i.e. *no defect*. The reference had to come from
> outside the small-print family entirely before the gap appeared. Base rate
> holds: the first output of a new measurement was wrong.

## The fix: a setting, not a second component

```css
.bo-audit--discussion { font-size: inherit; }
.bo-audit--discussion .bo-audit__detail {
  font-size: inherit;
  color: var(--bo-color-text-primary);
}
```

Two rules. Everything else — the time column, the byline, the avatar, the
composer — is already shared.

**Injection-checked**, not assumed: with the class the body renders 14px and
primary ink; removing the class *in the same page, in the same run* returns it
to 12px and secondary. The plain audit trail elsewhere on the docs page still
measures 12px, so nothing regressed. Final hierarchy is body 14 > byline 13 >
time 12 — content on top, which is the whole point.

## What was refused, and why

- **A `bo-comment` / `bo-chat` component.** It would re-express the list, the
  author line, the avatar and the composer that already ship, to add one
  type-size decision. That fails the Objective on all three counts —
  simplicity, less-for-more, reusability.
- **Threading (replies to replies).** An ERP discussion hangs off a *record*
  and is read in one order; the record is the thread. Nesting buys ambiguity
  about which reply a decision belongs to, on the surface where that question
  matters most.
- **Chat bubbles — left/right alignment, tails, "mine vs theirs".** That is a
  messaging-app shape. The people in an ERP thread are colleagues acting in
  *roles*, which is what `.bo-byline`'s `name · role` already carries; splitting
  them into two sides says the wrong thing about the conversation.
- Consistent with the earlier refusal of Frappe's row-level heart/comment icons
  and its Assign/Attachments/Tags/Share rail as collaboration chrome
  (`erp-suite-gaps.md:749`). This grill refuses the *social* shape and accepts
  the *record-note* one, which is the distinction that was implicit there.

## Two findings that are NOT fixed here

1. **Discoverability — the owner asked for something that already existed.**
   That is the finding. `.bo-composer` is documented only on
   `/components/approval-workflow`, and nothing in its name says "comment".
   Someone looking for a comment surface has no path to it. The `--discussion`
   section added today gives the word a home on that page, but a person who
   never opens "approval workflow" still will not find it.

2. **`approval-workflow.css` is a domain name housing three shape-general
   components.** `bo-timeline` (an ordered chain of events with state),
   `bo-audit` (an immutable trail) and `bo-composer` (a write surface) are none
   of them about approval. Slice 109 settled that *patterns* are named for their
   shape and not their domain; the same argument applies to components, and this
   file is the counter-example. Splitting or renaming it changes documented
   class names and per-component dist paths, so it is a **breaking change and an
   owner call** — recorded, not acted on.

Both are the same defect wearing two hats, and (2) is the cause of (1).
