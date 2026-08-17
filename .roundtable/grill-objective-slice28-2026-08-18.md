# Objective grill — Slice 28 at slice close (2026-08-18)

Dispatched by rule 5, which fired correctly for the first time since the
ordering fix earlier tonight. Slice 28 was the three findings the previous
grill queued from Slices 26-27: CI over budget (F2), undocumented label
overflow (F3), no published-site gate (F5).

Evidence gate: ≥2 independent sources for `Evidence`, otherwise `Hypothesis`.

---

## What held up

All three items were red-proved, and two found real bugs in themselves before
shipping. 28.3's published-site gate filed a reachable 404 under "unreachable"
— it would have stayed silent through exactly the four-commit staleness it was
written for — and that only surfaced because it was run against the real site
instead of the local harness, where every failure was a dead port. 28.2's first
demo rendered a 51px rail with a 1px label, demonstrating nothing.

CI came down 330s → 257s with **coverage identical** — no sampling, nothing
dropped — because the win was three gates reloading pages to change viewport,
not doing too much work.

Notably, the previous grill's *guessed* levers were both wrong (it named the
axe sweep and the visual suite; the layout sweep was the biggest and the visual
suite does not run in CI at all). Guessing would have optimised a gate that
costs nothing. Measurement is now the item's stated Accept criterion.

---

## G1 — The roadmap contains zero dispatchable work
**Seat: Chair · process · HIGH · Evidence**

Every unchecked item in `ROADMAP.md` — all four — is undispatchable:

| item | why it cannot be dispatched |
|---|---|
| VoiceOver verbalization | NEEDS-RUNTIME, owner hardware |
| NVDA | NEEDS-RUNTIME, Windows-only |
| AT runtime evidence | NEEDS-RUNTIME, owner hardware |
| Turbo | conditional — "adopt if the workspace grows past ~2 packages"; it has not |

There is also **no 1.0 definition, milestone, or statement of what "done"
looks like** anywhere in the plan.

The consequence is structural, not a mood: from here the dispatcher can only
reach Standardize (every 4th round), Objective (at slice close) and Explore
(backlog empty). All three generate work *about the project*. The loop system
will therefore keep producing self-referential improvement indefinitely, and it
will look healthy the whole time — green gates, honest commits, real findings —
because each individual piece of work is genuinely good.

**The Objective charter is a filter, not a direction.** Simplicity /
less-for-more / reusability tell you what to *refuse*; they cannot tell you
what to build. A loop system is structurally incapable of choosing a product
direction, which makes this an owner call rather than a backlog item.

**[HUMAN CALL]** Recommended default, with its cost: **ship 0.2.0 first (G2),
then choose direction from real adopter feedback rather than from this room.**
Cost: a release takes owner action, and feedback takes time to arrive. The
alternative — pick a direction now — risks building the next twelve components
for nobody, which is precisely what the charter's "less for more" exists to
prevent.

Candidate directions, if the owner would rather choose than wait:

1. **Adoption / DX** — a starter template, a copy-paste ERP screen kit, a
   migration note from Bootstrap-era markup. Highest leverage if the bet is
   "the CSS is done, the barrier is starting".
2. **Depth on data maintenance** — M2 master-detail and M4 Excel round-trip
   from the v1.2 direction doc are still only partly done.
3. **The autosave decision** (below) — the one genuine *product* question
   already in the plan.
4. **1.0 hardening** — define what 1.0 means, then close the gap to it.

---

## G2 — 64 unreleased CHANGELOG entries against a published 0.1.1
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-triggered**

Two independent sources: `CHANGELOG.md`'s Unreleased section (64 bullets) and
`npm view @busy-office/ui version` (0.1.1, unchanged).

Everything in Slices 24-28 — query-token filtering, staging, the mass-change
pattern, four placeholder-only accessible names, the 1.46:1 search contrast,
icons vanishing from printed pages, the nav-label spill — is shipped, gated,
and **in nobody's `node_modules`**.

This is the previous grill's F5 one level up. That finding was "the published
*site* is stale"; it was fixed, and the *package* is still four slices behind.
As Devi, `npm install @busy-office/ui` today gets me the version with the
accessibility defects that were fixed two days ago.

**[HUMAN CALL]** Publishing is owner-triggered by policy. The work is done: 64
entries, contract-shape changes already marked Breaking per the freeze-audit
correction.

---

## G3 — Retiring my own F1: the ratio was the wrong metric
**Seat: Skeptic (Rex) · WORKING · MEDIUM · Evidence**

The previous grill found a verification-to-product ratio of 25:1 and deferred
it with an explicit trigger: "revisit if the next window pushes past ~30:1".

The trigger fired, and then some. Framework CSS growth across the last 45
commits is **+25 lines total, and exactly zero in two of the three 15-commit
windows** — the denominator has gone to zero, so the ratio is now infinite and
therefore meaningless.

**The honest conclusion is that the metric was wrong, not that the situation is
30× worse.** Zero CSS growth is not a defect: the charter explicitly wants a
framework that fixes ten defects without adding public API, and 38 components
covering the documented scope is a plausible definition of "enough". A ratio
that treats "added no CSS" as failure would push toward adding CSS for its own
sake, which is the opposite of the charter.

What the ratio was gesturing at is real, but it is G1 and G2: *is there
dispatchable product work, and has any of it reached a user?* Those are
answerable and actionable. The ratio is retired rather than escalated.

---

## Feeding back into triage

Nothing buildable is queued, because nothing buildable exists — and inventing
an item to keep the loop busy is the failure this grill is warning about.

Recorded in `ROADMAP.md`:

- **G1** → an explicit "no dispatchable work" state with the four candidate
  directions, marked owner call.
- **G2** → 0.2.0 release readiness stated with its evidence.
- **G3** → F1 retired, with the reasoning, so it is not re-raised as new.

Next wake, with the backlog empty, rule 6 dispatches **Explore** — which is the
correct response to an empty backlog, and worth naming: an Explore spike is a
*proposal*, not a direction, and it graduates only through triage.
