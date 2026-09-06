# Round log

One row per critic round, appended and never rewritten — a later wake needs to
see what was tried and why a verdict landed, not a tidied summary. `LOOPS.md`
§7 step 3 is what writes here.

The two rounds the owner-supplied contribution carried are **not** imported:
both were recorded as `builder self-check (NOT blind)`, against an artifact
that does not exist in this tree, and a self-graded round is what §7 step 2
refuses. They stay in the contribution folder as history, not precedent.

| Round | Artifact | Class | Critic | Verdict | Fixes taken |
|---|---|---|---|---|---|
| 1 | `gauntlet-a/index.html` (list-report recreation) | A | fresh-context agent, blind | **FAIL** | Invented two classes (`bo-segmented__label`, `bo-u-text-end` — both confirmed independently by `check-markup`); radios not `bo-visually-hidden` so they rendered bare; no sort caret (needs a real `bo-data-table__sort-btn`); amount left-aligned and flat, no `bo-amount`; badges single-channel; four inline styles restating framework values |
| 2 | same | A | fresh-context agent, blind (no sight of round 1) | **FAIL** | 8 of 10 criteria pass. `data-density="compact"` was on `<body>`; the reference scopes it per-form. Proved by pixel search: primary button 126×36 → 120×28, whole page below y=146 shifted exactly 4px (19.27% diff at offset 0 → **2.28% at −4**). Two controls dead without JS that are live in the reference (`Clear` not `type="reset"`, `Views` not wired to a popover) |
| 3 | same | A | fresh-context agent, blind (no sight of rounds 1–2) | **FAIL — budget exhausted** | 8 of 10 pass; criteria 1 and 9 fail. Primary button now measures 126×36, matching the reference exactly. Remaining: Invoice #/Cost center not in `bo-data-table__col--code` (ink extent 61→66px and 47→53px, the tell that identified it); `.bo-stack`'s uniform 16px gap gives 64/46/44 where the reference is 60/50/40; segmented radios carry no `value`, so the GET form submits `?view=on`; the `bo-pagination` footer is absent |

## Verdict on the artifact: FAIL at budget, gap reported, bar not moved

Three rounds, three fresh blind critics, none of which saw the build or each
other. The artifact converged — round 1 failed on **six** substantive defects
including two invented classes, round 3 fails on **four** fine-grained ones —
but it did not reach the bar, and `LOOPS.md` §7 step 5 says to stop and report
rather than lower it. Recorded as `refused` per that step. The remaining gap is
carried as its own roadmap item.

## What the exercise proved about the FRAMEWORK, which is the point

**Every remaining defect is a class the framework already ships and the
recreation failed to use** — `bo-data-table__col--code`, `--tertiary`,
`--secondary`, `bo-u-text-truncate`, `bo-pagination`, a `value` on a radio.
Not one is a gap in the framework's expressive range. A Class A recreation
exists to ask whether the framework can reproduce its own reference exactly,
and the answer is yes; the recreation was the weak half, which is the outcome
that makes the loop worth running.

## What it proved about the LOOP

**The blind critic can fail the builder, three times, on evidence the builder
did not volunteer.** That was the named failure mode in 296.1 — *"a blind
critic that cannot fail the builder"* — and it did not occur. Two rounds
produced findings the builder had no idea about (the 4px stack offset; the
mono-column ink extent), each measured in pixels rather than asserted.

The framework's own `check-markup` independently confirmed round 1's invented
classes and even suggested the right names. **The builder had not run it before
submitting** — the gate existed and would have caught both in seconds. Worth
carrying: run the repo's own gates on a gauntlet artifact *before* spending a
critic round on it.
