# Design grill — /patterns/reporting-dashboard (2026-08-20)

Batch 1 of the /design-grill sweep (roadmap 58.1). Measured live, bind-mounted
container, 1440 + 390, both themes (light shown; dark checked for parity —
see gate results, no theme-specific finding).

## Step 1 — the decision

The page's own opener never says. It lists what's composed ("breadcrumb,
filter bar + saved views, a stat-tile row, a widget grid…") but not **who**
sits in front of it or **what decision** it serves — unlike `record-detail`,
`object-page`, `value-help`, all of which open with "Who uses it / what done
looks like." **This is finding #1**, per the skill's own instruction that
disagreement between the opener and a stated decision is material.

My best answer, inferred rather than stated by the page: *a manager checking
whether this period's AP activity is on track and where the exceptions are.*

## Step 2 — measured inputs

Scoped to the live-screen sections only (before the Anatomy heading) —
first attempt scoped to every `.demo` on the page and over-counted badges
7-for-3, because the States/Data-contract tables use badges too; corrected
before trusting the number.

```
primary buttons:  0 of 1 (the one button is ghost — the collapse toggle)
badges:           3 (Pending/Approved/Rejected — text + colour, two-channel)
chips:            3 (2 saved views + "View all →")
stat tiles:       3
data tables:      1 (3 rows)
audit entries:    2
```

Hierarchy, DOM order: breadcrumb → filter bar + saved-view chips → stat
tiles → widget grid. At 390 this means the reader scrolls **past the search
box and two filter chips** before reaching the first status number.

## Step 3 — the ten questions, only where the answer is not simply "keep"

**Q5 — does the interface explain itself?** No, for one tile. The Anatomy
section states its own contract: *"Stat tiles — one number, its delta, and
the comparison basis spelled out."* Two of three keep that promise (`+12% vs
last quarter`, `+8% vs plan`); the third does not — `Overdue: 17, unchanged`
names no comparison basis at all. Unchanged since when? Since last week,
last quarter, since the filter was applied? The page's own stated rule is
broken by its own content.

**Q2 — is the primary action obvious?** N/A honestly — there isn't one, and
that's *not* a defect. A reporting dashboard's job is to inform, and the
closest thing to an action (`View all →`) is correctly a chip, not a
button, because it's navigation, not a commitment. Recorded as measured
rather than invented into a finding.

**Q7 — decoration with no state?** No. Checked specifically: the "bad" delta
carries an *extra visible glyph* (⚠) the "good" one does not — a genuine
non-colour channel on top of the colour, not colour alone. **Keep, and worth
crediting**: this is the two-channel contract done correctly, the same rule
this project applies everywhere else (Amount's `--negative`, the calendar's
`data-day="closed"`).

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener paragraph | **reword** | states composition, not the decision the screen serves — the one thing Objective §4 asks first |
| Filter bar + saved views (position) | **demote** | sits ahead of the stat tiles in DOM order, so status — the thing worth looking at first — is scrolled past an interaction control, sharpest at 390 |
| "Overdue" stat delta | **reword** | no comparison basis, contradicting the page's own Anatomy claim for all three tiles |
| "Open invoices" / "Total spend" deltas | **keep** | comparison basis stated, two-channel (glyph + colour + hidden text) done correctly |
| Zero primary actions | **keep** | correct for an informational screen; recorded as measured, not treated as a defect needing an invented CTA |
| Saved-view chips (active state) | **keep** | fill + border differ, not colour alone; `aria-current="page"` present |
| Notes card / collapse | **keep** | reuses the shipped collapsible-card behaviour, no new surface |
| Widget grid / container queries | **keep** | anatomy's own stated reason (widgets respond to their box) is real and demonstrated |

## Recommendation

Two small, citation-backed changes — reword the opener, reorder filters
below (or beside, de-emphasized from) the stat row, fix the Overdue delta's
comparison basis. No removal, no new surface. Triaged as 58.2.
