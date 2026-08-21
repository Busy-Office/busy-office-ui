# Objective grill — Slices 95, 97, 99

2026-08-21, second grill of the day. Fired by the counter at 3/3. Material: the
device-fitness/coverage work (95), the live-region reconciliation (97), and the
command-bar refusal plus pattern page (99).

Evidence gate per LOOPS.md: a conclusion needs **≥2 independent sources** to be
`Evidence`, otherwise `Hypothesis`. Every claim below carries its
counter-evidence.

## 1. The instruction driving these wakes has been wrong for days — `Evidence`

The standing wake prompt says, verbatim:

> *Slice 94 is the active queued work: score the next unscored sidebar family
> on the **seven** DSA dimensions…*

Both halves are false, and have been for many wakes.

- **There is no next unscored family.** 39 of 39 components in `api.json` carry
  a score. Zero unscored.
- **The rubric has six dimensions, not seven.** `hierarchy` was retired.

Three independent sources agree: `dsa-scores.json`'s `rubric.dimensions`
(6 entries); the dimension labels actually rendered into a built page
(`/components/badge` → typography, colour, spacing, interaction, content, fit);
and `check:dsa-scores`, which passes with *39 scored, 39 requested by a page*.

**Why this is the headline and not a footnote.** Every wake, the dispatcher
read that instruction, found the work it named already complete, and silently
substituted the roadmap's real priorities. The substitution was *correct* — 97
and 99 were better uses of the wake than re-scoring finished work — but nobody
was told. So the owner's standing instruction and the project's state have
disagreed, unflagged, for days.

That is the single defect this project has recorded more often than any other,
now appearing at the level of the instructions themselves: two accounts of the
same fact, disagreeing, with nothing forcing them to reconcile. The same shape
produced the 22-row `content` drift (94.12), the phantom item 95.3 that was
referenced four times and never existed, and the four contradictory live-region
statements fixed this morning (97.1).

**Counter-evidence.** The prompt is not load-bearing in practice — the
dispatcher reads `ROADMAP.md` fresh each wake and ranked correctly every time,
so no wrong work was done because of it. One could argue a stale prompt that is
routinely overridden costs nothing. The reply is that the override was invisible:
a reader of the prompt would believe scoring is what has been happening, and it
has not been for days.

**Action:** 102.4 below. This one needs the owner, because only they can change
the standing prompt.

## 2. The publish gap is now structural, not a slip — `Evidence`

Registry serves **0.1.1**. Local is **0.3.0**. Both `v0.2.0` and `v0.3.0` are
tagged. Five more `Unreleased` entries sit on top of `0.3.0`.

The strongest evidence is that the project has already written the finding down
itself: `CHANGELOG.md` line 259 reads

> `## 0.2.0 (2026-08-18) — tagged, never published`

A release header that documents its own non-delivery is not a slip; it is a
process that has stopped working and been annotated rather than fixed. This is
the **twelfth** restatement of the publish item.

**Counter-evidence, and it is real:** publishing is owner-triggered by design
(Trusted Publishing via OIDC on a GitHub Release; npm is unauthenticated
locally on purpose). The loop *cannot* publish. So this is not the loop failing
to act — it is the loop repeatedly queueing an item only the owner can close,
which is why restating it a twelfth time changes nothing.

**That reframes the item.** "Publish 0.3.0" is not work; it is a request. What
the loop *can* own is making the request cheap to say yes to — and it has not
done that either. See 102.5.

## 3. The framework surface has stopped moving — `Evidence`, and it is good news

Since the last grill, **100% of net added lines in `packages/core/src` are
commentary**: +10 comment lines, **+0 code**, across exactly two files
(`alert.css`, `form-field.css`), both comment rewrites.

The first instrument said "1 comment, 14 code" — a line-prefix classifier, which
undercounts because this codebase does not prefix comment continuation lines
with `*`. Corrected by stripping comments properly. Recorded because it is the
same base rate this project keeps hitting: the first output of a new measurement
was wrong, again.

Last grill made "78% commentary" an indictment. **This one should not.** The
difference is what the loop did with the rest of its time: it refused three
additions with measurement (no `bo-command-bar`, no promotion, no
`bo-dialog--palette`), fixed a real a11y defect in the recipe consumers copy,
and documented a screen using only components that already ship. Objective §2
lists refusing as a valid outcome; three refusals in three slices is the
principle working, not the loop idling.

The useful consequence is the one nobody has drawn: **nothing is in flight that
could destabilise a release.** The framework has been surface-stable for a full
session. That is the strongest argument for publishing that has existed so far,
and it is an argument, not a restatement.

**Counter-evidence:** surface-stable can also mean the loop is avoiding the
harder queued work — 101.4-101.7 (Inbox, Notification, Report, Output form) are
four screens the coverage report ranked *build*, and none has started. Two of
three slices this window were docs or refusals. That reading is available and
should not be dismissed; the tiebreaker is that 99.3's refusal was *itself* the
gate the owner asked for on 99.4, so it was queued work, not avoidance.

## 4. A gate misreports its own count — `Evidence`, minor

`check:dsa-scores` prints *"312 scored component(s) verified"*. There are **39**.
312 is its assertion count; the noun is wrong. Harmless to correctness — every
assertion still runs — but this project has a written rule that a number it
reports is load-bearing, and a gate that overstates its own coverage by 8× is
the exact thing that rule exists for. The same defect appeared in
`check:live-regions` this wake and was caught and fixed before commit, which is
how it was recognised here.

## Verdict against the three principles

- **§1 Simplicity — held, and enforced twice.** 97.1 collapsed four
  contradictory statements of the live-region rule into one. 99.3 refused a
  component that would have been a second, worse answer to a question
  `bo-combobox` already answers.
- **§2 Less for more — held.** Three refusals, each with a measurement behind
  it rather than taste. Net framework surface added this window: zero.
- **§3 Reusability — not exercised.** Nothing new shipped, so nothing was
  tested against it. Neutral, not a pass.

**The principles are not the problem, for the second grill running.** What the
last grill said — *the loop optimises what it can see* — has partly resolved:
the loop did move off the scoring apparatus and onto the owner's ERP screens,
which is what 101 asked for. Evidence of the change: slices 97 and 99 both came
from owner-facing queues.

What has *not* resolved is the other half: **the loop still cannot make anything
reach a consumer, and it has stopped saying so plainly.** Two tagged releases,
zero published, twelve restatements. The honest summary of this session is that
the framework got better and no user got anything.

## Queued

- **102.4** — reconcile the standing wake prompt with reality (owner-blocked).
- **102.5** — make the publish request cheap to say yes to.
- **102.6** — fix `check:dsa-scores`'s reported noun.
