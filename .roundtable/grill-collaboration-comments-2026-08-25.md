# Grill: a comment section for collaborating on a document — 2026-08-25 (roadmap 144.3)

**Ask (owner, clarifying 144.2):** *"I refer to comment section for user to
comment on document or approval workflow (so they can collaborate)."*

This is a materially different ask from the one 144.2 answered.
`.bo-audit--discussion` gives a thread you can **read**. Collaboration means
people **acting on each other's comments** — and the survey below says the
framework had none of the surfaces that requires.

## Survey first (the discipline that caught 144.2)

Against `api.json`, 265 classes:

| Collaboration primitive | Already ships |
| --- | --- |
| @mention | **NONE** |
| resolve / unresolve | **NONE** |
| internal vs external visibility | **NONE** |
| anchor / quote a line | only `bo-icon--quote` |
| unread / new | **NONE** |

> **Reconciled before being believed.** Five `NONE`s in a row is exactly the
> shape of a dead detector, so the same query was pointed at things known to
> exist: it returned `bo-audit--discussion` (added twenty minutes earlier),
> `bo-composer`, `bo-byline`, and 87 modifiers. The instrument works; the
> absences are real. Last round the same survey step is what stopped a
> component being built on top of one that already existed.

## Grilling the four candidates — each one attacked before it was accepted

### 1. Internal vs external visibility — **ACCEPTED**, and the strongest

*Attack: "is this a CSS concern at all? Routing is the app's job."* The routing
is. The **signal that prevents the mistake** is not, and two-channel state
signalling is this framework's entire thesis. Collaboration on an ERP document
has exactly one catastrophic mistake — an internal remark leaving the building.
"We can go to 12% margin, push them" is normal to a colleague and a disaster to
the vendor.

*Attack: "a badge would do."* It would not. A badge on a **posted** entry is a
label applied after the fact; the mistake happens at **compose** time. The
surface has to say where the words go *while they are being typed*.

*Attack: "does every ERP need it?"* Purchasing, sales and support all do; a GL
close does not — and simply never sets the attribute. Internal is the default,
so it costs nothing when unused.

**Beating the reference, not copying it** (owner's standing rule). Odoo, SAP
and Salesforce all use a small tab pair *above* an otherwise identical box.
That is the floor. Its flaw is structural: the thing you look at while typing
is the one thing that never tells you the destination, so a mis-click is a
broadcast. Here the **surface itself** carries it — the composer is visibly a
different object — and the posted entry keeps the mark permanently, so "which
of these left the building?" is answerable at a glance instead of by opening
each one.

**Safe default, deliberately chosen.** Internal is the absence of the
attribute. Forgetting the hook then means *a message that should have gone out
stayed in* — someone chases it. The reverse is unrecoverable. The dangerous
direction is the one you have to type.

### 2. Resolved / unresolved — **ACCEPTED**, cheaply

*Attack, and it is a good one: "the document's own state machine resolves
things. If the PO is approved, the discussion is over."* True for a
single-approver document. It fails the moment a rejection carries three
separate objections, or a change order is negotiated over a week: **the
document has one state, a discussion has N.** That gap is the whole case, and
it is narrow — so this earns a `data-state` value on an existing entry, not new
structure.

Resolved reverts the one thing `--discussion` changed, returning the comment to
the audit trail's treatment — because that is what a settled comment now is,
history. Only a discussion resolves; an audit entry is immutable by definition,
and the selector is scoped to say so.

### 3. @mentions — **DEFERRED**, weakest CSS claim

The autocomplete is a combobox the framework already has. What is genuinely
missing is an inline token for a person. But the framework has already ruled
that *an ERP does not put a document reference inside prose — it puts it in a
structured surface*; a person mention is the one reference that is inherently
grammatical ("@J. Kim can you confirm"), so it is not obviously covered by that
rule and not obviously exempt from it either. Unresolved tension, small payoff,
no screen demanding it yet. Left alone rather than guessed at.

### 4. Anchoring a comment to a line or field — **DEFERRED**, wrong scale

Real, and correctly structured rather than written into prose. But done
properly it is a two-way link between a comment and a row, plus a highlight,
plus scroll-into-view — **behaviour and a screen, i.e. a pattern**, not a
component modifier. Recorded as the next thing to look at if a suite screen
demands it.

## What shipped

```css
.bo-composer[data-visibility='external'],
.bo-audit__entry[data-visibility='external'] { /* 3× border, warning-strong */ }

.bo-audit--discussion .bo-audit__entry[data-state='resolved'] .bo-audit__detail
  { color: var(--bo-color-text-secondary); }
```

Injection-checked in a real browser, not assumed: entry edge 3px, composer edge
3px, and **0px the moment the attribute is removed in the same run**. Resolved
ink `rgb(55,65,81)` against live `rgb(17,24,39)`. `data-visibility` self-registers
in `api.json` from the selector, so the data-hooks gate went 71 → 72 documented
with nothing hand-maintained. A new contrast pairing
(`warning-strong` on `bg-surface`, 3:1 non-text, SC 1.4.11) was declared to the
gate per the recipe — 36 pairs × 2 themes green.

## The measurement corrected the design

Running the same probe under `forced-colors: active` — the way the existing
forced-colors gate does it, via CDP — returned:

```
external edge      3px   →  3px    geometry survives, as claimed
resolved ink       rgb(55,65,81)  →  rgb(0,0,0)
live ink           rgb(17,24,39)  →  rgb(0,0,0)
```

So **the resolved state has no signal whatsoever under forced colors** — the
two inks repaint to the same black. The external edge is geometry and survives;
resolved had no non-colour channel of its own. The first draft of the page
presented the marker as required for external and merely sensible for resolved.
That was wrong, and both the CSS comment and the page now say the "Resolved"
marker is **required**, because without it the modifier is colour-only, which
this framework does not ship.

Worth noting how this went: the forced-colors probe was added to *confirm a
claim already written on the page*, and it ended up changing what the page is
allowed to claim.

## Reinforces the open owner call from 144.2

A surface for *collaborating on any document* is now filed under
`approval-workflow.css`, a domain name that already houses three shape-general
components (`bo-timeline`, `bo-audit`, `bo-composer`). This round adds a fourth
concern that has nothing to do with approval. Slice 109 settled that patterns
are named for shape and not domain; this file is the component-side
counter-example, and it is getting worse rather than better. Splitting it
changes documented class names and per-component dist paths, so it stays a
**breaking change and an owner call** — but the cost of not making it is now
visible: the owner asked for a comment component twice, and both times the
answer was inside a file named for approvals.
