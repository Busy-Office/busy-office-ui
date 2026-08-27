# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-27 18:00, HEAD `44c995b`. Working tree clean. 157.3
landed and is committed.

## ⚠ THIS WAS A CLOUD WAKE — NOTHING WAS VISUALLY VERIFIED

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark. Say so rather than implying otherwise: **`/components/data-table` gained a
new `#markers` section that no human or screenshot has looked at.** The
automated sweeps that *did* run cover the properties (`check:layout` — no
overflow at 390 or 150% zoom; `test:axe` — 127 pages x 2 widths, zero
violations; `check:scroll`, `check:forced-colors`, `check:target-size`), and
they assert properties, not pixels: a section that renders *ugly* rather than
*broken* would pass all of them.

**The one thing worth a human eye next time there is a container:** the new
marker table on `/components/data-table` at 390px, both themes. It is a
three-column table inside `.bo-data-table-container` with prose in every cell,
which is the shape most likely to look cramped without technically overflowing.

The CSS half of the wake does not carry this risk and was measured properly: it
is a rule REMOVAL, and its effect was read as a **computed style in a real
browser** (headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/
chrome`, `CHROME_PATH` set), before and after, in both text directions.

**Chromium is available in cloud wakes** and every browser gate runs from it —
set `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `npm ci`
is needed first; the container starts with no `node_modules`.

## THE DISPATCHER IS OVERDUE ON BOTH COUNTERS — read this before Step 2

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     3 / 3 slices            OVERDUE  [151, 153, 157]
```

Both crossed on this wake's own iteration. Rules 2 and 3 sit **above** the
queued-build-item rule precisely so this cannot be skipped for another build
item — that ordering exists because these two counters starved for ten slices
before anyone noticed. The next wake dispatches **Standardize** (rule 2 is
first), and the wake after that should reach Objective unless another Continue
round intervenes.

## What landed this wake (157.3)

The guideline the owner asked for — *"pls also write the clear guideline. when
to show it"* — is `#markers` on `/components/data-table`: a table of what each
marker MEANS, then one row shows at most one leading edge, a cell tone is never
an edge, and a merely-negative value gets no marker.

**Writing it found that 157.2 was not finished.** `[dir="rtl"]
td[data-tone="success"]` survived the cell-edge removal — it was a *standalone*
rule while danger and warning were grouped into the row selectors the edit
rewrote, so it was not where the edit was looking. An RTL reader got a green 3px
edge on a success cell that an LTR reader never saw, in one tone of three, for
one day inside the Unreleased window. **Never published** — 0.5.0 predates
157.2.

Three things from it worth carrying forward:

- **A per-file allowlist cannot see a stale rule inside an allowed file.**
  `check:rtl` passed on the injected bug — confirmed by injecting it, not
  assumed. The rule is stated per MARKER, so it is now asserted per marker in
  `check:claims` (computed shadow, all three tones + a row state, both
  directions). Red-proved on both halves.
- **The injection was confirmed in the DOM, not by grep.** Grepping the built
  CSS for the selector found *nothing* while the claim's own reading showed
  `x: -3` — the minified-spelling trap CLAUDE.md already records, hit again.
- **Prose gets checked like a number.** A drafted sentence said a row both dirty
  and rejected shows "rejected — the blocking state wins". `row-edit.ts:122`
  says the opposite: `setDirty` writes `dirty` over `error` while the user
  types, and restores `error` on going clean if a cell is still `aria-invalid`
  (58.4). The page states the shipped behaviour instead.

**A cost was recorded rather than hidden.** 158.1 named `/components/data-table`
the site's longest page (4,429 words) hours before this wake made it longer:
**+337 reader-facing words**, +57 on `/components/inline-editing`. ~200 of them
are the guideline table. The stale "bar on the leading edge" section was
*replaced*, not appended to (−347 words), because 157.2 had falsified most of
it. **This is live input for 158.1's verdict on that page** — the honest reading
is that it is longer *and* less wrong. Do not let 158.1 quote 4,429 as current.

**A derived number was caught wearing a measurement's clothes.** The first
metric recorded this wake was `4429 + 337 = 4766`, arithmetic on a baseline
produced by an instrument this wake never ran. It was removed and replaced with
the delta actually measured. Same doctrine as the instruments rule, applied to
a number that had already been written down.

## Still open, and why

- **158.1 / 158.2** — the prose-length verdicts. 158.1 is next in line by age
  after Standardize and Objective clear.
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

## Standing owner instruction (2026-08-27)

**No external product is named in any document in this repo.** Describe the
mechanism instead ("a high-traffic market-data site", "an open-source ERP
desk"), or cite the standard when a finding is normative. Enforced by
`check:vendor-names` in `check:repo` — it is a denylist and therefore catches
regrowth, not every conceivable name, so the judgement is still yours.
