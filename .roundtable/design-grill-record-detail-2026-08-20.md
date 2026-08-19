# Design grill — /patterns/record-detail (2026-08-20)

Batch 1 of the /design-grill sweep (roadmap 58.1). Measured live,
bind-mounted container, 1440 + 390, both themes.

## Step 1 — the decision

Same shape as the other two in this batch: the opener states composition and
genericity ("generic to any ERP … the shape is the same for an invoice, a
change request, or a leave request") but not who is looking or what they
decide. Recorded as the third instance of the same pattern-wide gap —
addressed once, for the batch, in the triage rather than three separate
prose rewrites.

## Findings — two real defects, found and fixed, not just flagged

**A record identified as PO-88213 in its own breadcrumb and identity line
called itself "#4021" in its own feed card — the exact "plausible but wrong
identifier" bug class CLAUDE.md already warns about, and it was live in
production docs.** `4021` is the numeric suffix of the cost centre,
`CC-4021`, three lines below in the same file — a copy/adjacency error, not a
typo of a similar-looking number. Confirmed present in **two** places, not
one: the feed card's own badge (`Purchase Order #4021`) and, missed by the
first grep because it has no `#`, the audit trail's first entry ("R. Vance
raised **PO-4021**"). Caught the second only by looking at the *rendered*
screenshot after fixing the first — reading the diff would not have caught
it, matching this project's own rule that a bulk edit is verified against
what it renders.

Fixed both, to `#88213` / `PO-88213` respectively — the card's number now
matches the sibling Goods-Receipt card's own convention (`Type` + `#` +
short number, as in `Goods Receipt #GR-88`). Verified live: `grep` for every
`PO-`/`#`-prefixed number on the rendered page returns only `88213` for this
record, plus the unrelated `GR-88`.

**The live-screen section had no `<h2>` title, unlike every sibling
pattern.** `object-page`, `value-help`, and `app-launch` all open their live
screen with `<h2>The screen</h2>`; this one jumped straight from the
breadcrumb into content, so a reader navigating by heading landed on "Status"
and "Audit trail" — two sub-labels — with nothing announcing what they're
subsections *of*. Checked `check-page-shape.mjs` before touching heading
structure: it asserts specific headings (`Anatomy`, `Data contract`,
`States`, `Components used`) but nothing about the live-screen section's own
title, so adding one was safe. Fixed: `<h2>The screen</h2>` now opens it,
matching the other three patterns.

## What's already strong, credited rather than searched-past

- The **identity-line comment carries real measurement**: *"36px at 1440 (one
  row) and 68px at 390, where the actions wrap to a second row — both inside
  the 80px budget."* This is Objective §6 (details taken as seriously as the
  big picture) done correctly — a specific number, not a vibe.
- **Status is deliberately not repeated** between the identity line and the
  facts strip, stated and followed.
- Zero primary buttons (Print/Copy are both secondary) — correct for a
  read-mostly screen, same reasoning as the other two greenlit findings this
  batch.
- The trailing "Add record" composer is the empty state doubling as the
  create form — no separate empty-state message needed.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Feed card ID (`#4021`) | **fixed** | wrong identifier, matched the cost centre by adjacency — a real content bug |
| Audit trail entry ID (`PO-4021`) | **fixed** | the same bug, a second instance the first grep missed |
| Live-screen section heading | **fixed** | added `<h2>The screen</h2>`, matching every sibling pattern |
| Opener | **reword (batch-level)** | same "what, not who" gap as the other two in this batch — addressed once in the triage |
| Identity line | **keep** | measured, documented, status not duplicated |
| Zero primary actions | **keep** | correct for a read-mostly screen |
| Composer-as-empty-state | **keep** | no separate empty message needed |

## Recommendation

Both defects were factual, not judgment calls — fixed directly rather than
merely recommended, verified live and re-screenshotted after the second
fix surfaced. The opener rewording is batched with the other two screens
in this sweep, triaged as 58.2.
