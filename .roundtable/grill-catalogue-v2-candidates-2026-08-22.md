# Grill: the five v2 candidates (owner approved, 2026-08-22)

Owner: *"let's include per your recommendation — grill the idea.
simplicity & maintainability & easy for AI to understand."* The three
owner criteria join the front-door rubric (compose-first, Objective
§1-§3) for every candidate. On AI-legibility one mechanism does most of
the work and already exists: every pattern page is generated-from-shipped,
enters `llms.txt`, and follows the fixed recipe skeleton — an AI reading
the docs gets the same six sections in the same order on every screen. A
candidate scores well on that criterion by USING the recipe, and badly by
needing exceptions to it.

## Verdicts, one line each

| Candidate | Verdict | One-line reason |
|---|---|---|
| role-home | **BUILD** (after inbox) | composes 100%; 2-of-3 industry systems ship it first-class |
| job monitor | **BUILD** | composes 100%; the admin's daily screen nothing covers |
| schedule screen | **BUILD, low priority** | composes from shipped `bo-calendar`; single-source demand |
| kanban board | **REFUSE**, re-open condition recorded | single-source; without drag it collapses into a grouped list we have |
| period-close cockpit | **REFUSE (recomposes)** | an inbox scoped to close tasks + a progress bar; nothing new |

## 1. role-home — BUILD

**Compose check**: header (`bo-navbar` region) + `bo-widget-grid` of
role cards — "my open items" (count + link into the inbox), "my KPIs"
(`bo-kv` + `bo-amount`), "recent documents" (links). Every piece ships;
expected new CSS: **zero**.

- **Simplicity**: one screen, one job ("what needs me, at a glance"),
  no new interaction model — links out to screens that already exist.
- **Maintainability**: zero new CSS/JS surface; the page is composition
  only, so framework changes flow through automatically.
- **AI-legibility**: pure recipe instance; an AI can generate a role home
  from the pattern page by swapping widget contents.
- **Sequencing confirmed**: after 101.4 (inbox) — the "my open items"
  card is a filtered view OF the inbox, and building the summary before
  the thing it summarises would invent the inbox's contract twice
  (maintainability criterion, applied).

## 2. job monitor / batch-run history — BUILD

**Compose check**: `bo-data-table` (job list: name, schedule, last run,
next run) + `bo-badge` status (two-channel: word + tone) + `bo-progress`
for a running job + `record-detail`'s shape for one run's log/history.
Expected new CSS: **zero**. The interesting part is the DATA CONTRACT —
polling/refresh semantics for a screen whose rows change on their own —
which is documentation the framework's HTMX story already supports
(`hx-trigger="every 30s"` is on the landing page).

- **Simplicity**: a list screen + a detail screen, both shapes we ship.
- **Maintainability**: the risk is scope creep toward a scheduler UI
  (cron editors, dependency graphs) — the Accept must scope to MONITOR:
  view, retry, cancel; authoring schedules is the ERP's admin module.
- **AI-legibility**: recipe instance; the states table (running, failed,
  stalled, never-ran) is exactly what an AI needs enumerated.

## 3. schedule screen — BUILD, LOW PRIORITY

**Compose check**: `bo-calendar` (shipped, with day-marking and
no-JS date-pick already documented) + a day-detail list + the swap
contract between them. Zero new CSS expected.

- **Simplicity / maintainability**: cheap — the component page already
  demos month grids; the pattern adds the screen assembly and states.
- **Honest demand note**: single-source (Odoo Calendar); no consumer has
  asked. It ranks BELOW the four 101.x builds and the two above. If the
  queue never reaches it, that is the queue working, not a failure.

## 4. kanban board — REFUSE, with re-open condition

The grill that decided it: **what is a kanban without drag?** The 100.1
refusal stands (drag is the classic inaccessible interaction; a working
button path must exist regardless, and ARIA's own drag properties are
deprecated). A keyboard-accessible kanban is cards in status lanes where
moving a card is a per-card action (menu/dropdown) — which is
functionally **a grouped list with a status field**, i.e. `list-report`
grouped by status, or `bulk-actions` for mass moves. The lanes buy
visual adjacency at the cost of:

- **Simplicity**: a second way to present what list-report presents.
- **Maintainability**: a new layout family (lane overflow, card density,
  lane-length imbalance at 390px) for one presentation.
- **AI-legibility**: worst of the five — an AI must learn when a screen
  is a "board" vs a "list", a distinction even the industry doesn't
  agree on (Odoo first-class; Fiori and Dynamics absent).
- **Evidence**: single-source. Odoo's kanban earns its keep through
  drag — exactly the part we'd refuse.

**Re-open condition** (recorded so this is a decision, not a mood): a
real consumer asks for stage-visualisation with measured evidence that
grouped list-report fails their users, OR a second major ERP system
promotes a board floorplan to first-class.

## 5. period-close cockpit — REFUSE (recomposes)

The close checklist = tasks with owner, status, dependency order, and a
period progress indicator. Mapped to shipped shapes: the task list is the
**inbox scoped to close tasks** (101.4's cross-type worklist, filtered);
per-task detail is `record-detail`; sign-off is `approval`; "period 7 is
82% closed" is `bo-progress` + `bo-kv` on a role-home card. SAP sells a
Closing Cockpit as a PRODUCT — but its UI decomposes into exactly these
screens. Documenting a separate pattern would re-photograph four screens
we have (95.2's rule).

**Re-open condition**: dependency semantics ("task 12 blocked by task 9")
turn out to need a visual the list cannot carry — that is the one part
recomposition doesn't obviously cover, and it is also the part that would
need real consumer evidence to design against.

## Resulting queue order (build items)

1. 101.4 inbox → 101.5 notification → 101.6 report → 101.7 output form
   (unchanged — still first)
2. **110.1 role-home** (immediately after inbox)
3. **110.2 job monitor**
4. **110.3 schedule screen** (low priority, may never be reached)
5. kanban + close cockpit: refused above, re-open conditions recorded.
