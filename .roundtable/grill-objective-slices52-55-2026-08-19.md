# Objective grill — Slices 52-55 (2026-08-19)

Dispatched by rule 3 at 3/3. Evidence gate: **≥2 independent sources** for
`Evidence`, else `Hypothesis`. Every claim carries its counter-evidence.

Window: owner wishlist (Object Page name / scroll effect / design grill), a
P0 from an owner screenshot, the calendar week-start ask, the Values grill, the
value-help pattern, and a Standardize sweep.

---

## H1 — The surface went DOWN for the first time
**Seat: Chair · WORKING · MEDIUM · Evidence**

Counted identically at both ends of the window, from committed source:

```
then: 191 classes      now: 189 classes
```

Two classes removed (`.bo-quantity--display`, `.bo-quantity__value`), none
added — across a window that shipped **two new pattern pages** (object-page,
value-help), a scroll-collapse behaviour, and a new gate.

The mechanism matters more than the number: 54.3 found the removal cost was
**genuinely zero** — `npm view` reports only `0.1.0, 0.1.1` published and the
class is absent from `v0.1.1`, so no consumer could have it — and that window
closes the moment 0.2.0 publishes. **Free removals are perishable**, and this is
the first time the project has spent one.

**Counter-evidence:** two classes is not a trend. The effort split still runs
heavily toward instruments and docs (framework `+55/−19`, gates `+341/−6`, docs
`+570/−53`), so this is a single deliberate deletion inside a window that mostly
built elsewhere, not a shrinking framework.

---

## H2 — Four of six defects this window were the loop's own recent work
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

| defect | provenance | found by |
|---|---|---|
| three dead `data-dialog-close` buttons | **self** (Slice 31, extended 45.2) | building value-help on the same component |
| anchor jump landing on the section ABOVE the one clicked | **self** (52.2, same session) | an existing claim |
| header oscillating at the collapse threshold | **self** (52.2, same session) | a probe that was dead twice first |
| `.bo-quantity--display` — built for naming symmetry, used by nothing | **self** (earlier slice) | the NEED/COST rubric |
| `.bo-widget__collapse` never collapsing to zero | **pre-existing framework** | driving the element from scroll |
| scrolled content leaking above the sticky search field | **pre-existing docs**, owner-reported | the owner, with a screenshot |

**The healthy reading, and it is well supported:** every self-inflicted defect
was caught in the same session or the next, none reached a release, and two were
caught by instruments rather than by review — `check:markup` failed a spike
build for an invented class, and the anchor claim went red on the landing bug the
moment the collapse landed. That is an immune system working.

**The uncomfortable reading:** the loop is now substantially engaged in
correcting itself, and H3 shows one case where the immune system had already
been pointed at exactly this defect class and still missed it.

---

## H3 — An invented API survived the sweep built for its own defect class
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · actionable**

`data-dialog-close` is an attribute **this project invented and never
implemented**. `initDialogs` handles opening, Escape, backdrop dismiss and the
focus trap — and nothing else. The documented API is `data-dialog-trigger`,
`data-dismissible`, `data-state`.

Lifetime, from `git log -S`:

```
f7e43a7  2026-08-18  Slice 31   introduced 2 dead buttons (Cancel, Save)
32b069d  2026-08-19  Slice 45.2 added a third (the drawer ×)
299b343  2026-08-19  Slice 53.1 removed all three
```

**What it survived is the finding.** Slice 46.2 built `check:components-used`
specifically for "documentation disagreeing with its own demo" — and a button
that does nothing is exactly that. It did not catch this, because it checks
*which components a page **lists*** against *what the page **renders***. It never
asks whether what is rendered **works**.

Worse, the drawer had a claim, and the claim tested **Escape**. It passed
throughout, giving positive assurance about a dialog whose three buttons were
dead. **A claim that exercises the adjacent path is worse than no claim**: it
converts an untested control into an apparently tested one.

**Counter-evidence:** the native mechanism was never far away — the docs' own
app shell has used `<form method="dialog">` for its nav close the whole time. So
this was not a missing capability, only an unchecked invention, which is the
cheapest kind of defect to prevent.

→ **Fed back as 56.1**, and it is mechanically checkable: every `data-*` hook
used in docs markup must be one `api.json` or `behaviors.json` documents.

---

## H4 — A repeated self-inflicted tooling error, three times in one session
**Seat: Skeptic (Rex) · process · MEDIUM · Evidence**

Three separate edits asserted `assert 'some-string' not in source` where the
**explanatory comment being written in that same edit contained the string**:

1. the `paths.mjs` adoption guard (Slice 49),
2. removing the shell class name from `anchor-nav` (Slice 50),
3. removing `data-dialog-close` from value-help (Slice 53.1).

Each cost a rebuild and, in one case, wrote an import into a template literal
that would have shipped in a user-facing artifact.

The pattern is precise enough to state as a rule: **when verifying a removal,
assert on the parsed or structural form — the attribute, the identifier, the
code with comments stripped — never on the raw text**, because the prose
explaining the removal legitimately names the thing removed.

**Counter-evidence:** every instance was caught immediately by the assertion
itself failing. The cost is minutes, not correctness. It earns MEDIUM, not HIGH.

---

## H5 — npm serves 0.1.1. Ninth consecutive grill.
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

```
npm view @busy-office/ui version  ->  0.1.1
local packages/core/package.json  ->  0.2.0
```

Unchanged, and this window sharpened the cost: the free-removal window in H1
exists **only until 0.2.0 publishes**. Every class shipped in the meantime that
turns out to be dead weight becomes a next-major problem instead of a deletion.
Publishing is owner-triggered; npm here is unauthenticated.

---

## Feeding back into triage

- **H3 → 56.1**: gate that every `data-*` hook in docs markup is a documented
  one. It would have caught `data-dialog-close` the day it appeared.
- **H4 → 56.2**: write the removal-assertion rule into CLAUDE.md.
- **H1, H2 → no new work.** Recorded so the next grill does not re-open them.
- **H5 → restated.** Still the highest-value action available, still not the
  loop's to take.
