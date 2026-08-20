# Docs review — Amount / Quantity / Money: redundancy pass (2026-08-20)

Owner-requested review of the three family pages for redundant content.
After six slices of rapid additions to these pages (76-81), accretion was
the expected failure mode — the same fact layered into a caption, a
section, a note, and a code comment by different edits. All three pages
read in full; every repeated fact judged deliberate-parallel vs.
accidental-accretion.

## Kept — deliberate parallels (repetition BY design)

- **The family-rule paragraph ×3** — byte-identical on all three pages on
  purpose (md5-checked in Slice 77); each page's reader needs the decision
  tree locally.
- **The affordance clause ×2** ("a bordered box says 'you can type here'…")
  on Money's and Quantity's crossover sections — same-purpose sections on
  sibling pages, parallel structure.
- **The "no allowlist" affix note** on Amount (`__currency`) and Quantity
  (`__unit`) — parallel spec notes, each about its own component's part.

## Cut — accidental accretion (four fixes)

**1. The currency-decimals table existed twice.** Money carries the
complete built-in reference (tied to the shipped `currencyDecimals`);
Amount's Precision section had grown its own mini-table of the same facts
— with a *different* external authority link (Wikipedia vs. Money's
iso.org). Two tables of the same domain data on sibling pages is drift
waiting to happen. Cut Amount's table and external link; its "precision
is app data, no `--decimals` modifier" point stays, now linking to
Money's reference as the single home.

**2. "The read-only counterpart is Amount" was told FOUR times on the
Money page.** The opener's last sentence, the full "Read-only display —
use Amount" section (76.1), ApiTable note #3, and a trailing comment
inside the Markup sample. The section is the canonical home; the note
and the code-sample comment (both of which predate the section) cut. The
opener's one-line pointer stays — that's a lede, not a duplicate.

**3. The optional-buttons story was told three times on the Quantity
page**, with heavy overlap: the Basic caption (7 lines), the joined
section's caption, and an ApiTable note — all three narrating omission,
rounded corners, tab stops, and the unit-select surviving. Consolidated:
the joined section stays canonical for the omit story; the Basic caption
shrinks to the JS requirement + a one-line pointer ("cost no tab stops —
and a desktop-first form can omit them entirely, next section"); the
note tightens to the spec facts (tabindex, one tab stop, the joined
shape) without re-narrating.

**4. (folded into 2)** — the Markup sample's trailing crossover comment.

## Not cut — checked and cleared

- "No `--decimals` modifier" appears on both Amount and Quantity — but
  about different surfaces (display formatting vs. input `step`); each
  page needs its own statement.
- Precision-follows-the-select appears in four spots on Quantity — one
  canonical section plus three one-clause cross-references, each
  load-bearing where it sits (e.g. the joined demo must say omitting
  buttons doesn't break the select).
- Money's JS-optional note ends with the plain-input sentence that
  overlaps the family paragraph — kept for its unique po-app evidence.

## Net effect

Amount −12 lines (table + link), Money −3 (note + comment), Quantity −8
(caption + note overlap): ~23 lines of duplicate telling removed, zero
facts lost — every cut fact still has exactly one home, cross-linked.
ApiTable notes 154 → 153. All gates green.
