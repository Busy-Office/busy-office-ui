# Objective grill — Slices 37, 94, 95

2026-08-21. Fired by the counter at 3/3. Material: the DSA scoring work
(37/94), the device-fitness surfacing (95), and the 92 commits of this
session.

## The headline, measured

**78% of everything this session added to the shipped source is commentary.**
Across `packages/core/src`, 284 comment lines against 78 lines of code.

Comments are stripped from the minified bundle — proved repeatedly this
session via the README size-stamp check — so more than three quarters of the
work done on the *product* produced **zero bytes for a consumer**.

That is not the same as zero value, and the grill should not pretend it is.
The commentary exists because sweeps kept re-deriving the same conclusions:
`tabs`'s nine `#000` mask-alpha values were reconciled **six separate times**
before a comment stopped it. Explaining a decision once is cheaper than
re-deriving it six times. But it is *internal* value — maintenance, not
capability — and the Objective's tests are about what a consumer can delete or
do. None of these lines pass those tests, because none of them are addressed
to a consumer at all.

**And it was largely self-inflicted.** The `spacing` dimension of our own
rubric asks that "every intrinsic literal carries its reason". So the
framework spent a session writing prose to satisfy a measure we wrote, and
then the same rubric scored itself clean — the "self-clearing debt marker"
94.7 already documented. What 94.7 did not have was the price tag. It is 284
lines.

## The compounding fact

Real consumer-facing work **did** ship into the repo this session — five
CHANGELOG entries: the `--bo-color-scrim` token, currency-on-either-side for
Money, the badge page-overflow fix (a P0), `--bo-font-size-mono-inline`, and
`data-table`'s `min-inline-size`.

**None of it has reached a consumer.** `v0.3.0` was tagged at 06:00 today;
the registry still serves **0.1.1**. So there are now *two* unshipped layers:
0.3.0's 83 entries, and five more stacked on top of a tag that has not been
published.

Put beside the headline, that is the finding: **the framework spent a session
improving its own legibility while its actual improvements sat unpublished.**
Both halves are defensible in isolation. Together they describe a loop
optimising the thing it can see.

## A correction to my own framing, before it becomes the record

The first cut of this grill classified the last 25 iterations by keyword and
reported "12 of 25 were docs/meta versus 6 framework". **That was overstated.**
Counting files actually changed gives 34 in shipped framework source against
48 in docs pages/data — far more balanced. The keyword classifier was reading
words like "gate" and "score" in commit summaries that also carried framework
fixes.

The comment-versus-code measurement is the one that survived reconciliation,
and it is the one this grill rests on. Recorded because a grill that quotes
its own first number without checking it is the failure this project has
logged more than any other.

## A bookkeeping defect the grill found in itself

**95.3 does not exist.** Last wake's entry says the touch half of device
fitness was "re-scoped and re-queued as 95.3" — and it was written as *prose
inside a closed item*, never as a numbered open item. It appears four times in
`ROADMAP.md` and **zero** times as `[ ] **95.3`. The dispatcher enumerates
unchecked numbered items, so it would never have been picked up.

That is worse than forgetting to queue it, because the record *claims* it is
queued. Same shape as the 22-row `content` drift 94.12 found: two accounts of
the same fact, disagreeing.

## Verdict against the three principles

- **§1 Simplicity** — held for consumers. Every shipped change this session
  either removed a decision (Money's currency placement needs no modifier) or
  fixed a defect. Nothing added a caveat list.
- **§2 Less for more** — held, and enforced. Refusals this session were real
  and recorded: a `--currency-end` modifier, a mobile/tablet score, a relative
  type tier for five unrelated ratios, `overflow-wrap: anywhere` on badge, a
  per-component touch claim from a heuristic, and the literal-comment gate
  that could not fail.
- **§3 Reusability** — held. `--bo-color-scrim` has two callers,
  `--bo-font-size-mono-inline` has three and resolved a 0.85-vs-0.9
  disagreement. Neither shipped for one screen.

The principles are not the problem. **What the loop chose to spend its time
on is the question**, and the owner has already answered it — Slice 99 asks
for realistic ERP screens, and Slice 100 for a drag-and-drop grill. Those are
consumer-facing. The scoring apparatus is now complete enough to stop
investing in.

## Queued

- **101.1** — publish, or record why not. Restated for the eleventh time.
- **101.2** — 95.3 queued properly as a numbered item.
- **101.3** — a stop rule for the scoring apparatus, so it stops generating
  its own follow-ups.
