# Research: dense numeric UI, and an open-source ERP desk — 2026-08-26

Owner wishlist: study two external references — a high-traffic public
market-data site and an open-source ERP's desk UI — for *"what is good to bring
into this project"*. Triaged into **Slice 149**.

**Sources are deliberately not named here, by owner instruction (2026-08-27):
no external product is named in this repo's documents.** That costs a little
reproducibility and is the owner's call; what matters below is the mechanism and
the verdict, both of which stand on their own. Where a finding is normative it
cites the standard, which is the durable citation anyway.

## What was actually read, and how much to trust it

| Source | How it was read | Confidence |
| --- | --- | --- |
| Market-data listing + a detail page | Both fetched directly; then re-verified by a 105-agent adversarial research run | High for the listing, **low for the detail page** — see below |
| An open-source ERP desk UI | 42 stylesheet modules read from source | High — primary, and more precise than clicking a demo |
| That ERP's hosted demo | Would not log in; a second host 404'd | None — no evidence obtained |
| A suggested demo repo | Inspected, **not run** — a bare fork, 1 commit, no demo tooling of its own | n/a |

Standing up a database, app server, queue and workers to obtain evidence
available more precisely from source stylesheets is 20-60 minutes spent to learn
less.

## The finding that mattered was a correction to this project's own first answer

The initial recommendation was to **build** a value-against-threshold display.
The evidence looked strong — four suite screens express one, each inventing its
own:

| screen | the pair | how it is expressed today |
| --- | --- | --- |
| `prod/capacity` | load vs available | ad-hoc `bucket()` → three tone buckets |
| `inv/stock-on-hand` | on-hand vs reorder point | ad-hoc `short = t < rop` boolean |
| `crm/account` | open exposure vs credit limit | two unrelated `bo-kv` rows |
| `crm/accounts` | the same, as a status | a `Credit hold` badge |

Then the obvious question — *does this already exist?* — found **`bo-progress`**.
It styles the native `<progress>` element, so value/max semantics and the
progressbar role come from the platform. It has `--warning` and `--danger`
variants whose own source comment says they are for *"threshold states
(approaching / over budget)"*.

It is used on **1 of 27** suite screens.

**So the gap is adoption, not coverage.** That is a different class from any of
the 21 the suite has produced: every previous one was *"the framework cannot
express this"*. This is the first *"it can, and the screen did it by hand
anyway"* — which the instrument was never built to detect. Recording that blind
spot is worth more than the four conversions it implies.

## The one finding that could not have come from reading markup

**WCAG 2.2 SC 2.2.2 (Level A) has two bullets with deliberately different
thresholds.** Moving, blinking and scrolling trigger the requirement only after
five seconds. **Auto-updating information triggers from the first tick** — there
is no grace period for numbers. W3C's own worked example of content that needs a
control is a stock ticker, so the "essential" carve-out does not cover an
ordinary live cell. Related: ARIA's roles for this content (`marquee`, `timer`)
default to `aria-live="off"`, so a live amount should be silent by default and
carry `aria-atomic="true"` when it does announce, or a composite value gets read
as its changed fragment.

Measured against this project's own pattern pages:

| pattern | documents auto-update | offers pause/stop/frequency |
| --- | --- | --- |
| `job-monitor` | `hx-trigger="every 30s"` | **no** |
| `inbox` | polling | **no** |
| `notification` | polling | **no** |
| `record-detail` | polling | **no** |

Four of four. And `components/state-patterns` **already cites** *Pause, Stop,
Hide* by name, answering it correctly for skeleton animation with the
five-second threshold quoted — so the criterion was known and applied to the
bullet that has a grace period, not to the one that does not.

`axe` cannot catch this: *"is there a control for this updating region"* is not
a DOM-inspectable property. A gap in what the gates can see, not a gate that
broke. Queued as **149.4**, P0.

## What did NOT survive verification

The adversarial pass could not confirm the market-data **detail page's** ranges,
stat tiles, tabs or converters from primary sources — those regions are
client-hydrated, and the only sources describing them were third-party clone
tutorials. Sparkline columns, sticky rank/name columns and tick-flash colouring
failed the same way.

This matters for **149.2** (the positional `low ——•—— high` range). A direct
page fetch is one observation; it did not survive adversarial checking. 149.2 was
already refused-pending-a-second-ERP-use, so nothing changes operationally — but
the external citation should not be leaned on. The idea stands or falls on
whether a second ERP screen needs it.

## Mechanisms confirmed, and already covered here

- **Bounded pagination with the window stated in words** — a fixed page size,
  a real URL per page, and a footer saying which slice of what total. Verified
  first-hand. Already covered: `.bo-pagination__info`, canonical markup
  `1–25 of 312`.
- **Breakpoint-driven column-count reduction of the same DOM** (3 → 2 → 1),
  with sticky positioning and internal scroll containers switched off at the
  mobile tier and regions re-ordered independent of source order. Same regions,
  no separate mobile page — which is this framework's existing approach.
- **Group-by with counts** (from the ERP desk) — closes: `/patterns/filter-panel`
  already has a section headed *"Why the count on the trigger matters"*.

Nearly every desk mechanism in the ERP reference has an equivalent here already:
status indicators (`bo-badge` + `data-tone`, and two-channel where the reference
is colour-only), workflow (`approval-workflow`), timeline and comments
(`bo-timeline`, `bo-composer`), global search (`/patterns/command-bar`), number
cards (`bo-stat`), kanban and tags (`/patterns/kanban`, `bo-chip`).

## Refused, with reasons

- **Sparklines / row trend.** Direct precedent: the `prod/capacity` heatmap was
  refused for the same reason. No `bo-scale` utility ships, and this is data-viz.
- **Column chooser, and its cap.** The reference bounds user column choice at
  8-of-12 metrics with vendor presets, and the *cap* is the better half of the
  idea. But a cap is only meaningful if there is a chooser, and the chooser is
  refused: `__col--secondary`/`--tertiary` is the better ERP answer, where the
  designer ranks importance once instead of every user configuring a personal
  view.
- **Number abbreviation** (`1.56T`). The reference can abbreviate because market
  cap needs no precision. An ERP amount is auditable; abbreviating an invoice
  total is a defect dressed as a feature.
- **Gantt charts, onboarding tours, product tours.** App concerns, not
  CSS-framework ones.

## Where this framework already beats the reference

The market-data site signals gain and loss with **colour alone**, on the most
important number on the page — a WCAG 1.4.1 failure. The ERP desk's status dots
do the same. This framework has forbidden that from the start; every state
signal is two-channel.

Recorded here as evidence for the owner's *references are floors* rule, and
deliberately kept out of the published docs (**149.3**) — a docs page is not the
place to score a third party, and the claim would perish the moment they fix it.

## A probe that was wrong first — third instance that day

The initial desk-UI sweep searched component class **names** and reported
`workflow`, `comment`, `kanban` and `indicator` as MISSING. All four exist here
under different names. A naming-derived probe over a framework that names things
well is a detector that cannot pass; unchecked it would have produced a
confident list of seven gaps, none real. The same instinct is what caught the
`bo-progress` error one step later.
