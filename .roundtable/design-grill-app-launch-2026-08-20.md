# Design grill — /patterns/app-launch (2026-08-20)

Batch 1 of the /design-grill sweep (roadmap 58.1). Measured live,
bind-mounted container, 1440 + 390, both themes.

## Step 1 — the decision

Partially stated, unlike `reporting-dashboard`: *"the icon-grid launcher an
ERP user lands on before picking an app."* That names the decision (which
app to open) even without the "Who uses it / what done looks like" heading
format the strongest patterns use. Not a finding on its own — recorded as
the milder version of the same gap, worth a one-line tighten, not a rewrite.

## Step 2 — measured inputs

```
primary buttons:   0 of 1
tiles:             13 (4 favourites, 4 finance shown + 3 logistics hidden
                    behind the tab, 2 folders)
icons:             8
badge/initials:    9 (AP/AR marks + the 7 folder-preview badges)
tabs:              2
count badge anywhere on a tile: NONE (checked live, not assumed)
```

## Findings

**A States row describes a capability that does not exist anywhere in the
component.** The States table says: *"Loading — tiles render immediately;
only the counts show skeletons,"* and *"Counts unavailable — drop the badge
silently."* `AppTile.astro`'s own contract, read directly, offers exactly
three mark kinds — `icon`, `initials`, an `<svg>` slot — and its own comment
calls that *"the three marks a real launcher actually needs."* There is no
`count` prop, no badge overlay, nothing to skeleton. Confirmed live: zero
tiles anywhere on the rendered page carry a count. This isn't the
prose-describes-a-future-implementation house style (established as fine in
the reporting-dashboard grill) — it's a states table naming a UI element
that contradicts the component's own documented, closed set of three.

**Everything else here is well-built, and worth crediting rather than
searching for more to flag:**
- The AP/AR initials fallback has a recorded reason (a real QA finding:
  Payables and Invoices used to share the same glyph) — this is Objective §5
  done right, a decision that explains itself in the source.
- The folder tile's badge preview is correctly `aria-hidden`, so the
  accessible name stays "Finance apps" rather than reading out four
  meaningless two-letter codes.
- Zero primary actions is correct for a launcher, same reasoning as the
  dashboard grill — every tile *is* the action; inventing a "Go" button
  would be redundant.
- No decoration found under Q7: every icon, badge, and svg carries the
  tile's identity, none is ornamental.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **reword (minor)** | names the decision already; tighten to the "Who uses it" phrasing the stronger patterns use, for consistency, not correctness |
| States — "counts" rows | **reword** | describes a capability `AppTile` does not implement; either state it as a future extension explicitly, or remove until a `count` prop exists |
| Favourites / category tiles | **keep** | icon/initials/svg selection is deliberate and documented from a real prior defect |
| Folder tiles | **keep** | correct accessible-name handling, single navigation, no hover-expand trap |
| Category tabs | **keep** | ordinary `.bo-tabs`, no new surface |
| Zero primary actions | **keep** | correct for a launcher — every tile is the action |

## Recommendation

One documentation fix (the States/counts mismatch), one optional wording
tighten. No removal, no new surface. Triaged as 58.2 alongside the
reporting-dashboard finding.
