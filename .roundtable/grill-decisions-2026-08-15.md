# Decisions grill — 2026-08-15 judgment calls

The day's code got two adversarial passes (cloud ultrareview, panel
sign-off grill); this third pass targeted the **decision record itself**
— the freeze program's legitimacy and the won't-build/scope-limit
verdicts, none of which had been challenged. Two red-team seats; every
hit was applied same-session.

## Seat 1 — the freeze program

- **HIGH, upheld: circular graduation.** The addendum's own hold
  criterion was *external* usage pressure; the "second consumers" were
  same-author, same-day, purpose-built po-app screens. One of three
  graduation rounds produced real pressure (the appended-rows column
  gap); the scan round was pure confirmation. The criterion had quietly
  swapped from "external" to "second call site."
- **HIGH, upheld: "frozen" bound nothing.** Behaviors frozen by the
  01:27 audit were modified at 10:43 under a "fix" label — including an
  observable contract-semantics change (`initWizard()` install-once →
  re-runnable). Multiselect was frozen 32 minutes after its last
  contract-adjacent change. Nothing mechanical diffs frozen shapes.
- **MEDIUM, upheld: items 11/12 incoherent.** Item 12 refused po-app as
  an adopter ("built by this project's own team") while item 11 accepted
  it as freeze-closing evidence, with no principled line drawn.

**Outcome — applied**: terminal claim downgraded everywhere to *"stable
against internal usage; freeze provisional until the item-12 independent
adopter"*, with a standing rule that contract-shape changes to stable
behaviors before then require a CHANGELOG **Breaking** entry, not a fix
note. Item 11 regraded 🟡 Provisional, and the 11/12 line is now drawn
explicitly (12 = market validation, 11 = contract robustness; 11's final
grade waits on 12's adopter). The per-item audit machinery was
explicitly upheld — only the guarantee language overreached.

## Seat 2 — the won't-build verdicts

- **HIGH: virtualization verdict overreached its evidence** (one
  machine, one engine, no throttling — "measured, not guessed" measured
  the wrong population). **Answered with the missing evidence rather
  than a retreat**: re-measured under 4× CPU throttling (approximating
  older corporate hardware) — interactions stay <700 ms even at 20k
  rows; initial render is the real pain (~3.8 s at 20k throttled). The
  won't-build stands, now evidence-backed across throttle levels; the
  docs table carries the throttled rows, the "one-time hitch" phrasing
  was corrected to per-toggle, and a published re-open condition
  replaces permanence (interaction costs breaching ~1 s at row counts a
  deployment genuinely cannot paginate).
- **MEDIUM, upheld: tree claimed "BOM explorers" while shipping their
  easier neighbor.** Real BOM workflows are selection-shaped (pick,
  check, drag) — exactly what the TreeView note concedes isn't shipped.
  Fixed: the opener no longer claims BOM explorers; the TreeView note
  now names the BOM picker as the case that needs the heavier pattern.
- **LOW-MEDIUM, upheld: indeterminate→Skeleton guidance had a gap** for
  determinate flows that lose their value mid-stream. Fixed: documented
  the "keep the bar at last value, let the text say 'stalled at 93%'"
  pattern — never swap components mid-flow.
- **MEDIUM, upheld: adapters "resolved" was partly a relabel** — copied
  assets had no version/upgrade story. Fixed: installation now
  recommends a versioned vendor path (`/vendor/busy-office-ui@0.1.0/`);
  the fuller update-path answer folds into versioned-docs at 1.0, and
  the ROADMAP entry says so instead of claiming full resolution.
- **Grouped-rows close: stands** — the rowgroup-SR weakness was already
  acknowledged in the shipped docs with a mitigation; the bar was
  stated, not lowered.

## Net

The grill overturned language, not architecture: every structural
decision survived, but three terminal claims ("frozen," "measured,"
"resolved") were written stronger than their evidence and are now sized
to it — one of them by *collecting the missing evidence* instead of
softening the claim.
