# Objective grill — Slices 26 & 27 at slice close (2026-08-18)

Dispatched by rule 5 (a slice closed since the last Objective ran). Two slices
closed: **26** (verification reach) and **27** (the eight items triaged from the
owner QA review). Evidence gate: a conclusion needs ≥2 independent sources to be
`Evidence`, otherwise `Hypothesis`.

Measured against the real artefacts — git history, `packages/core/dist/api.json`,
the GitHub Actions timing API, and the rendered pages — not against memory of
what was built.

---

## What held up

**The Objective's "less for more" test is passing, measurably.** Ten items
across two slices — a QA review with three blocking defects, plus two
verification-gap items — cost **25 inserted lines of framework CSS and 1
deleted** (`icon.css`, `sidebar-nav.css`). Nothing was added to the public API
that a consumer must learn.

Three refusals were recorded rather than quietly skipped, which is the behaviour
the charter asks for: growing `.bo-icon` into an app-icon library (27.7),
factoring the seven sweep-style gate reporters (Standardize), and the sub-1000px
sidebar target that was reported as **not met** rather than rounded to met
(27.6).

The generated-docs pipeline absorbed a framework change with no manual step:
`.bo-sidebar-nav__label` gained a top-level rule in 27.8 and is present in
`api.json`'s `classes` and `parts` without anyone touching a docs page.

---

## F1 — The verification-to-product ratio is structural, and accelerating
**Seat: Skeptic (Rex) · WORKING · HIGH · Evidence (structural) / Hypothesis (harmful)**

Two independent windows of git history:

| Window | framework CSS | gate/script code | ratio |
|---|---|---|---|
| last 30 commits | +25 | +629 | 25 : 1 |
| the 30 before that | +108 | +743 | 7 : 1 |

So this is not an artefact of two atypical slices — it is the shape of the
project, and the ratio has more than tripled between windows.

**Counter-evidence, stated because it is strong.** Low CSS growth is the
*stated goal*, not a symptom: a maturing framework that adds almost no CSS while
fixing ten defects is the charter working. Gate code is a one-time investment
that compounds across every future change. The CSS figure also understates
product work by omitting docs source (+392 lines this slice), which is the
artefact consumers actually read. And both slices were, by construction, a
defect-fix slice and a verification-gap slice — neither was feature work.

**Verdict:** `Evidence` that the ratio is structural; `Hypothesis` that it is
harmful. Do **not** act on the ratio itself — acting on it would mean writing
fewer gates, which is the wrong lesson. Act instead on its measurable price,
which is F2.

---

## F2 — CI is 15% over its own stated budget, rising, and untracked
**Seat: Platform (Kofi) · FUNCTION · MEDIUM · Evidence**

Two independent sources: the Actions timing API, and the budget named in
`ROADMAP.md:360`.

| commit | CI wall time |
|---|---|
| 35c38eb (27.6) | 318s |
| 162553b (Standardize) | 330s |
| c02f663 (27.7) | 328s |
| effe7a9 (27.8) | 330s |

Against the **288s budget** that item 26.1 measured itself against. CI is
~15% over and drifting up.

The sharper finding is not the number, it is that **nobody could have seen it**.
Dispatcher rule 4 fires on "a tracked metric regressed" — but CI wall time was
never recorded through `record_metric.py`, so the router has been structurally
blind to the one number that bounds every future gate. A budget that is stated
once in prose and never measured again is not a budget.

**Recommended:** record `ci-wall-time` every wake, and queue an Optimize item
with a target of ≤288s. The two plausible levers, both to be measured before
being believed: the axe sweep (82 pages × 2 widths) and the 40-shot visual
suite, either of which could sample on commits that touch no CSS.

---

## F3 — Devi cannot learn the new label behaviour from the page she reads
**Seat: Consumer (Devi) · WORKING · MEDIUM · Evidence**

27.8 changed `.bo-sidebar-nav__link` so a label longer than the rail wraps
instead of spilling. That is in the CHANGELOG. But
`/components/sidebar-nav` mentions the icon-rail collapse **four times** and
says nothing about label overflow at all — and Devi, per her seat definition,
reads the component page, never the CHANGELOG.

As Devi, building screen #40 with a long app name: I cannot tell from the docs
whether my label will wrap, truncate, or scroll, so I will guess and pad my
labels defensively.

**Accept:** the sidebar-nav page states what happens to a label longer than the
rail, with a demo showing one wrapping. One paragraph and one demo; no new
CSS.

---

## F4 — A dispatcher rule that can never fire is a gate that can never fail
**Seat: Chair · process · HIGH · Evidence · FIXED THIS WAKE**

Rules 5 and 6 both matched whenever a slice closed, because closing a slice is
exactly what empties the backlog. Top-to-bottom evaluation therefore chose
Explore every time, and the milestone trigger could not fire — ever.

It had already bitten once: the previous Objective entry in the loop log reads
"Overdue slice-close grill of Slices 23-25 (rule 6 starved by…)". It was
diagnosed then and **worked around rather than fixed**, so Slices 26 and 27 were
queued to be skipped the same way.

This is the red-proof discipline (`CLAUDE.md`) applied to process instead of
code: the project already knows that a gate nobody has watched fail is not
trustworthy. The same is true of a routing rule. Fixed in `LOOPS.md` this wake,
with the reasoning written beside it so it does not get "tidied" back.

**Generalisation worth carrying:** when a rule is diagnosed as unreachable, fix
the rule in the same wake. A recorded workaround reads like a fix in the log and
is not one.

---

## F5 — None of this has reached a user
**Seat: Auditor (Ines) · FUNCTION · HIGH · Evidence · owner-blocked**

Slice 27 fixed real accessibility defects — four placeholder-only accessible
names, a search widget at 1.46:1 in dark, icons vanishing from printed pages.
Every one is verified, gated, and **not deployed**: `actions/deploy-pages` has
returned 503 on five consecutive commits and the published site is four commits
behind at 27.6.

Stated plainly because the grill's job is to say it: the depth of verification
in Slices 26-27 buys nothing until delivery works. A project this careful about
whether a gate can run in the narrowest context has no measurement at all of
whether its published artefact matches HEAD.

**Recommended (beyond the owner action already triaged):** a post-deploy check
that fetches the published site and asserts a marker from the current build, so
"the site is stale" becomes a gate result rather than something noticed by
accident while investigating something else.

---

## Feeding back into triage

Queued into `ROADMAP.md` this wake:

- **F2** → Optimize item: record `ci-wall-time` per wake; bring CI to ≤288s.
- **F3** → Continue item: document label overflow on `/components/sidebar-nav`.
- **F5** → Continue item: gate that the published site matches HEAD.

Not queued: **F1**. The ratio is real and worth watching, but the corrective
action it suggests — write fewer gates — is the wrong lesson, and its measurable
cost is already captured by F2. Recorded as a standing observation, to be
revisited if the next window pushes past ~30:1.
