# Objective grill — Slices 23, 24, 25 (2026-08-17)

**Why now.** Objective has run at every slice close since Slice 7; the last was
Slice 22 (2026-08-16). Slices 23, 24 and 25 all closed without one — rule 6 was
preempted twice by the 4-tick Standardize rule and once by rule 5's
backlog-empty→Explore, which fires on the same wake a slice closes and would
starve rule 6 indefinitely. Three slices overdue.

**Method.** Self-grill, not a panel: agents are out of scope this session, so
there are no independent seats and this report claims none. Every finding below
was **measured before being written** — the discipline that matters more than
seat count, and the one this project has been burned by skipping (a prior grill
false-negative claimed `.stylelintrc.json` was absent when it shipped).

Labels follow the charter's evidence gate: **Evidence** = measured in-repo or
executed; **Hypothesis** = reasoned, not measured.

---

## A. Cost-line honesty — PASS (Evidence)

Slice 24 introduced the 24.R2 rule that every item states its debt. I recorded
"0 new selectors" on five of seven items. That is falsifiable, so it was tested:

| Point | Component selectors in source |
|---|---|
| Slice 23 close (`bb4ece7`) | 213 |
| Slice 24 close (`d37958f`) | 217 |
| HEAD (Slice 25 closed) | 217 |

+4 across Slice 24, which is exactly the four combobox parts declared in 24.2
(`__option-code`, `__option-label`, `__option-meta`, `__group`). Slice 25 added
none. **The cost lines were accurate.** Recording this as a pass rather than
hunting for a problem: the discipline held, and saying so is the honest result.

## B. The reference app is ungated — HIGH (Evidence)

`examples/po-app` is the "Devi test" consumer, it is what 24.R1 requires work to
be exercised in, and the docs now point at it as the working implementation of
query tokens (24.1), staging (24.3), the document-level strip (24.4) and mass
change (25.2). **Nothing tests it.** Measured this wake:

- Axe, 6 routes x 2 widths, first ever run: **clean** (`{}`). Good news, and
  entirely unprotected — it can regress on any commit without a signal.
- Claims the docs make about po-app behaviour that no gate executes: the
  disabled apply button at zero applicable rows, "an invalid value changes
  nothing at all", "removing a filter needs no JavaScript and works with the
  back button". Each was verified by hand this session; none is repeatable.

This is the same failure shape the claims gate was built for, one layer out:
prose asserting behaviour, verified once, never again.

**Recommendation:** a po-app smoke gate — boot the server, assert a handful of
end-to-end behaviours, run axe over its routes. Estimated **+30-60s CI** against
a 288s budget whose stated revisit threshold is ~5min, so it fits but is not
free. Queued rather than built here: Objective's job is to feed triage, not to
ship.

## C. Composed shapes vs the "delete code" test — MEDIUM (Evidence + Hypothesis)

Slices 24-25 repeatedly REFUSED new components in favour of documented
compositions: the identity line, query tokens, mass change, the document strip.
The charter's simplicity test accepts a change "when it lets a consumer *delete*
code". A documented composition lets them delete nothing — it tells them what to
write. Worth grilling honestly rather than assuming the refusals were free.

Measured consumer-side cost in po-app:

| Shape | Consumer code | What that code IS |
|---|---|---|
| Query tokens | 13 lines | which keys are tokens, how they match — app business rules |
| Staging validation | 16 lines | the actual import rules — app business rules |
| Mass change | 44 lines | which statuses may be re-costed, no-op detection — app business rules |
| **Identity line** | **~10 lines of markup, zero logic** | **pure repeated markup** |

**Verdict: three of four refusals are correct and one is questionable.** Token
parsing, staging validation and mass-change rules are business logic no CSS
framework can own — pushing them to the app is right, and a component would only
have wrapped them badly. The identity line is different: it is pure markup with
no app-specific logic, repeated verbatim, and every consumer document screen
would rewrite it. That is the one place the "delete code" test arguably fails.

**Recommendation: do not extract yet.** The reusability rule needs >=2
*independent* compositions and both current uses are ours (record-detail,
detail-form). **Trigger to revisit: a third use, or the first consumer report of
copying it.** Recorded so the decision is a trigger rather than a mood.

## D. Meta-finding — CI is the most permissive environment, not the strictest

Twice this session a gate was green in CI and wrong elsewhere: `check:rtl`'s
DESIGN.md assertion broke the po-app image build (that context copies only
`packages/`), and the axe sweep had drifted red for a week because it needed a
hand-started container. CI has the full checkout and the most tooling; a gate
that only ever runs there is not known to be portable. This belongs in
CLAUDE.md's gate-discipline section, next to the existing red-proof rule.

---

## Scored summary

| # | Finding | Severity | Action |
|---|---|---|---|
| A | Cost lines accurate (213→217 = declared 4) | PASS | none |
| B | Reference app ungated, though currently axe-clean | HIGH | queue a smoke gate (+30-60s CI) |
| C | Identity line is repeated markup with no logic | MEDIUM | do not extract; revisit on a third use |
| D | A gate green only in CI is not known to be portable | MEDIUM | write into CLAUDE.md |

**Not found:** no defect in what Slices 23-25 shipped. Three slices of output
held up under measurement, which is itself the most useful thing this pass can
report — and the reason B and D (both about *verification reach*, not about the
code) are the whole yield.
