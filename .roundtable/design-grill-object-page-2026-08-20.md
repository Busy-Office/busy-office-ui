# Design grill — /patterns/object-page (2026-08-20)

Batch 5 of the /design-grill sweep (roadmap 58.1) — final batch. Measured
live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"Who uses it: whoever owns one record end to end — a
buyer opening a PO, an approver checking it before signing; many times a
day, one object at a time. What 'done' looks like: the reader can see the
object's status without scrolling, reach any section in one click, and act
on it from anywhere on the page."* Not a finding.

## Findings

**None.** This page was built via a dedicated Explore spike (roadmap
48.1-48.4, 52.1-52.2) rather than assembled for a docs pass, and it shows —
every Anatomy claim traces to a specific, cited measurement rather than a
general description:

- **The sticky-wrapper math is a real number, not a guess**: *"measured
  77px at 1440, 181px at 390"* for the header+anchor-bar overlap.
- **The anchor-bar `scroll-margin-block-start` value has its own regression
  story**: sized for the collapsed header (7rem) specifically because that
  is the state that exists after any jump — the page states it was FIRST
  sized for the expanded header (12rem) and overshot by ~110px, landing the
  reader on the wrong section, "caught by the existing 'anchor bar follows
  the reader' claim the moment the collapse landed." A real bug, found by
  the project's own claim, fixed, and the story kept in the comment.
- **The action-bar buttons are plain `type="button"` with no wrapping
  `<form>`** — checked whether this contradicts the Data contract's "POST
  the whole object" claim: it doesn't, because the page never claims these
  specific demo buttons post anything; the contract describes the real
  endpoint shape, and a `type="button"` here is the honest choice for a
  static demo (a `type="submit"` with no form to submit would imply
  functionality that isn't there).
- **Checked against `check-claims.mjs`**: three separate runtime promises
  for this page are gated (header collapse, anchor-bar tracking, focus/
  scroll behavior) — not left as prose.

## What's already strong

- **The "one sticky wrapper, not two" decision is argued from a real CSS
  fact**: two sticky elements both at `inset-block-start: 0` pin to the
  SAME offset and overlap — not a style preference, a layout consequence.
- **`.md-split`-style page CSS lives in a scoped `<style>` block with its
  own reasoning comment**, same discipline `master-detail` uses — not a
  212-character inline style burying the "why."
- **Print behavior is a stated State**, not an afterthought: sticky chrome
  and the action bar drop, sections print in document order.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done |
| Sticky-wrapper overlap math | **keep** | a real measured number, cited |
| Anchor scroll-margin (7rem, not 12rem) | **keep** | traces a real regression this project found and fixed in itself |
| Action-bar buttons (`type="button"`, no form) | **keep** | correct for a static demo; doesn't contradict the Data contract's real-endpoint claim |
| Runtime promises (collapse, anchor tracking) | **keep** | gated by check-claims.mjs, not just described |

## Recommendation

All-keep. No reword, no removal, no new surface — this page's own build
history (an Explore spike with a self-corrected regression) already did the
grill's job before the grill arrived.
