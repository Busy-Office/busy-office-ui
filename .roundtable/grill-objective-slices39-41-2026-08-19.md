# Objective grill — Slices 39-41 (2026-08-19)

Dispatched by rule 3 at **exactly** its threshold (3/3), by the counter report
41.1 shipped two days ago. The previous grill ran ten slices late. That
difference is finding H3.

Evidence gate: ≥2 independent sources for `Evidence`, else `Hypothesis`.
Measured against git, `api.json` and the loop log.

---

## H1 — The framework stopped growing; the proof around it grew instead
**Seat: Chair · WORKING · HIGH · Evidence**

| | across 39-41 |
|---|---|
| framework CSS + JS | **+200 / −27 lines** |
| public classes | **248**, unchanged |
| components | **39**, unchanged |
| gate scripts | 21 → **23** |
| executable claims | **34** |
| deliberately-absent entries | **10** |
| bundle | 71 → 73 kB (the calendar) |

Three slices produced **one** new component and **two** new gates. Everything
else was documentation, refusal, or verification.

That is the charter working, not stalling: two of the four Slice-40 asks were
answered by refusing the literal request and shipping the smaller thing under
it, and Slice 39 shipped no framework code at all. But it is worth naming
plainly, because a project that only ever adds gates is also a project that has
stopped shipping — and H5 is where that tension actually bites.

---

## H2 — The dominant failure mode is a detector that cannot fail
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

Counted across the 12 iterations in this window:

- **3 detectors that could not fail**
- **3 wrong measurements**
- **2 stale artifacts**
- **1 gate built then removed for over-enforcing**

The extreme case is 39.2, where **four consecutive detectors passed 18/18 while
measuring nothing**. The third reported the *identical byte offset (536) on all
eighteen pages* — the docs shell's own mobile-menu button — and that
implausible uniformity is what exposed it. Not a review. Not a gate. A number
that was too tidy.

The countermeasure has emerged on its own rather than by decree: **3 of 23 gates
now ship either a `--self-test` or an explicit "input absent, NOT verified"
path** (`check-learning-path`, `check-loop-vocab`, `check-rtl`). The learning-path
self-test runs the detector against code-first, result-first and code-only
synthetic pages and fails if it cannot tell them apart.

That is the right shape and it should stop being ad hoc.

→ **Fed back as 42.1:** a gate that asserts something subtle must be able to
demonstrate it can fail. Not every gate — one that counts files does not need
it — but any gate whose signal is a heuristic.

---

## H3 — The dispatcher fix worked immediately, and is now choosing the work
**Seat: Chair · process · HIGH · Evidence**

41.1 shipped `dispatch_status.py` on 2026-08-19. Since then, **two consecutive
wakes were chosen by the tool rather than by me noticing**:

| wake | report said | dispatched |
|---|---|---|
| 05:15 | `Standardize 4/4 OVERDUE` | Standardize |
| this one | `Objective 3/3 OVERDUE` | Objective |

The contrast is the evidence: the *previous* Objective grill ran after **ten**
slices, and every earlier instance of this bug was found by hand, twice with a
paragraph in LOOPS.md admitting it had been found before and worked around.

A counter that reports itself is the difference between a rule and a habit.

---

## H4 — npm still serves 0.1.1 — fifth consecutive grill
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

Registry **0.1.1**; repo **0.2.0**, tagged and CI-green.

What changed since the last grill is only that the gap is now *visible where
decisions are made*: 41.2 rejected the word "shipped", and the last four
iterations are recorded as **`landed`** against 137 historical `shipped` rows.
The log no longer flatters itself.

That is not progress on the gap. It is progress on being honest about it.

---

## H5 — The date-picker refusal probably under-delivered
**Seat: Consumer (Devi) · FUNCTION · MEDIUM · Evidence · SELF-CRITICAL**

Four owner asks in Slice 40, four answered by refusing the literal request:

| ask | answer | did the owner get what they needed? |
|---|---|---|
| icon "full list" | `--bo-icon-src` mechanism | **Yes — more.** Any icon, and the bundle shrank |
| advanced filter popup | pattern page, 0 new CSS | **Yes.** Composition of shipped parts |
| SVG for avatar / app tiles | nothing built | **Yes.** All three cases already shipped |
| **advanced date picker** | `.bo-calendar` display | **Probably not** |

The owner asked for *"advance date picker 3 months, 1 month (highlight date like
holiday, or company specific date)"*. I shipped a component that **marks** dates
and refused the **picking**, on the argument that the native input is good and a
custom calendar widget is a large accessibility surface.

That argument still holds. What does not hold is the conclusion, because the two
halves do not compose: the native input can pick but cannot mark; `.bo-calendar`
can mark but nothing documents picking from it. A user whose actual job is
*"choose a delivery date, and the plant shutdown must be visible"* is handed two
controls that each do half.

**And it is already half-built.** `calendar.css` ships
`a.bo-calendar__day` and `button.bo-calendar__day` rules with hover and pointer
affordances — measured, lines 127-134 — and **zero** documentation uses them.
The interactive affordance exists and is undocumented, which is the worst of the
three possible states.

This is the honest version of "refusing is a valid outcome": it is valid, and it
still has to be checked against the job the user was doing. I checked it against
the framework's principles and not against the user's task.

→ **Fed back as 42.2.**

---

## Feeding back into triage

- **H5** → 42.2, the highest-value item here: close the picker gap the refusal
  left open, using the interactive affordance the CSS already ships.
- **H2** → 42.1: make "can this gate fail?" a stated expectation for
  heuristic gates.
- **H3** → recorded as held up. No action; the fix is working.
- **H4** → re-stated, owner-blocked, not re-queued.
- **H1** → recorded. Watch it: three slices, one component. If the next grill
  says the same, the question stops being "is the charter working" and becomes
  "is anything being built".
