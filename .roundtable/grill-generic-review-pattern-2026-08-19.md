# Grill — a generic "review" pattern (2026-08-19)

Owner wishlist: *"review pattern — should it be generic instead of specific
like PO or Invoice, but layout that can be used for those purposes"* and
*"think about possible pattern… a fixed way to do so backend doesn't need to
think much for UI, just follow — grill the idea."*

Two distinct asks. (1) Is the existing review-type screen already generic, or
does it need to be? (2) Should there be a **fixed contract** — a schema a
backend fills in without making UI decisions?

---

## Finding: there is no page named "review", and that's the first thing worth stating

Searched all 19 patterns; the closest by function are three, not one:
`record-detail`, `object-page`, `approval`. **They already differ on purpose,
not by accident** — this matters for the answer to "should there be one".

| pattern | what it's actually for | object-coupling |
|---|---|---|
| `record-detail` | a SHORT record, one scroll, feed-style | already generic *by written intent*: "This example is a purchase order; the shape is the same for an invoice, a change request, or a leave request" |
| `object-page` | a LONG record needing in-page navigation | 2 mentions of PO — incidental example data, not structural |
| `approval` | the decision moment itself — stepper + queue + audit | 3 mentions — same |

**`record-detail` already says the thing the owner is asking for**, in its own
opening sentence. The other two use "PO-88213" as the worked example the way
every pattern here does (CLAUDE.md's own recipe: demo-first, a concrete
object, never lorem) — that is not the same as being PO-specific. Measured:
9 distinct `bo-*` classes in `approval.astro`, all generic components
(`bo-stepper`, `bo-timeline`, `bo-data-table`, `bo-audit`) — none named after
a document type.

**So finding #1 is a correction to the premise, stated the way this project
states them**: the genericity the owner is asking for mostly already exists.
What's missing is that it's *implicit* — stated once, in one pattern's opener
— rather than a named, cross-referenced contract.

---

## The second ask is the real one: a FIXED contract

This is the sharper and more valuable question. Read against this project's
own doctrine, it is **Objective §4** — design the decision, not the screen —
applied one level up: instead of one screen, design the *shape every review
screen takes*, so a backend team fills in data and never chooses layout.

### What the three candidates already agree on, measured

Comparing anatomy sections across all three:

```
record-detail: breadcrumb → record cards → status timeline → audit feed
object-page:   sticky header (title+status+facts) → anchor bar → sections → action bar
approval:      stepper → status timeline → queue → audit trail
```

**The common skeleton, present in all three under different names:**

1. **Identity** — what object, what its current status is (badge, title)
2. **Facts** — a small fixed set of key-value pairs
3. **The record/history** — timeline, feed, or audit trail (same primitive,
   `.bo-timeline`/`.bo-audit`, in all three)
4. **Action** — what can be done next, and by whom

That is a real, already-converged contract — three teams (in effect, three
slices of this project) arrived at the same four regions independently,
which is stronger evidence than one person designing it top-down.

### What a fixed contract would need to NOT do, per this project's Objective

- **Refuse a new component.** Same test as the value-help and object-page
  decisions: everything above is `.bo-widget`, `.bo-kv`, `.bo-timeline`,
  `.bo-badge`, `.bo-form-actions` — composition, not a `bo-review-screen`
  component. A "fixed way" does not mean a new tag; it means a documented
  **order and set of slots**.
- **Refuse forcing three different interactions into one shape.** `object-page`
  exists *because* a short-record layout (`record-detail`) doesn't work when
  the content is long enough to need in-page navigation. Collapsing them
  would undo the reason `object-page` was built (chrome ratio, scroll-collapse
  — Slice 52). The fixed contract has to be a **family with one shared
  vocabulary**, not one page.
- **The genuine risk**: a contract loose enough to fit all three is at risk of
  being too vague to save a backend team any decisions — which is the actual
  bar for "does this earn its place" (Objective §3: reusability).

---

## Recommendation

**Not a new pattern page. A named ANATOMY CONTRACT, documented once, that the
existing three patterns cite instead of each re-deriving their own anatomy
language.** Concretely:

1. Write the four-region contract (Identity / Facts / History / Action) as
   its own short concept page — `/concepts/review-anatomy` or similar —
   stating which component fills each region and why (the same table this
   grill already produced).
2. Each of `record-detail`, `object-page`, `approval` gets a one-line
   cross-reference in its own Anatomy section: *"follows the review anatomy
   contract — see X for the other two shapes."*
3. State explicitly, on that new page, **which decision picks which of the
   three**: record length (short → `record-detail`, long → `object-page`) and
   whether the current moment IS a decision to make (→ `approval`). That
   answers "which one do I use" without a human re-deriving it per screen —
   which is the actual "backend doesn't need to think" outcome the owner
   asked for; the decision that needs eliminating is *which pattern*, not
   *what a pattern looks like*.

This is small, additive, and passes the Objective's own tests: it's one
general mechanism (the contract) replacing three independent explanations
(§2), and it is validated by three independent compositions that already
exist rather than invented for one screen (§3).

**Refused**: merging the three into one pattern page. **Refused**: a new
`bo-review` component. **Accepted, pending triage**: the anatomy-contract
concept page and the cross-references.
