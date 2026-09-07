# Explore spike — the board screen kind (roadmap 300.2, issue #2), 2026-09-07

**The question the item asks, verbatim:** does the spike answer whether the
keyboard contract and the live-region announcement can be decided **once** in a
component, or whether they are screen decisions that differ per board?

**The answer, measured:** the two halves separate, and not where issue #2
assumed. The keyboard contract is *mostly* decidable once and the announcement
is not decidable at all — **4 of the 5 things one generic core could not know
are announcement strings**, and the fifth changes the key map.

---

## 0. The premise, re-checked at `HEAD` before the wake was spent on it

CLAUDE.md: *when the item's premise is itself a measurement from an earlier
wake, re-checking it is part of the criterion.* Both commands, with their
output:

```
node -e "const a=require('./packages/core/dist/api.json');
         const n=Object.keys(a.components);
         console.log(n.length, n.filter(x=>/board|column|kanban|swim/i.test(x)))"
  # 40 [ 'dashboard' ]

ls packages/core/src/css/components | wc -l        # 40
```

Reproduces. 40 components, the only board-ish name is `dashboard`, which is a
widget grid.

**The first instrument that answered this was wrong, on schedule.**
`Object.keys(api.json)` reads **10** — the file's *top-level* keys
(`generated`, `components`, `primitives`, …), not its components. It was caught
by the number being too tidy to be true against a hand count of 40 CSS
directories, not by review. The correct accessor is `api.json.components`.

## 1. Method

Write **one** generic core — keyboard move plus announcer — and apply it
**unchanged** to two independent board compositions whose *policies* differ.
Whatever the core has to be handed is, by construction, a thing that cannot be
decided once. Count those, and classify each as presentation or policy.

- **Board A — approval queue.** Columns `Submitted` → `In review` → `Approved`.
  Movement is forward-only, one step. Position inside a column is meaningless.
- **Board B — service jobs.** Columns `Backlog`, `Scheduled`, `Done`. Movement
  is free in both directions. Position inside a column **is** priority.

Both are built from shipped primitives only — `bo-widget-grid`, `bo-widget`,
`role="list"`/`role="listitem"`, and a `role="status" aria-live="polite"`
`bo-visually-hidden` node — i.e. exactly the composition issue #2 reports
having written.

Driven with **real key events** (`page.keyboard.down('Control')` +
`page.keyboard.press(...)`), never `el.click()` or a synthetic `keydown` —
ENVIRONMENT.md's trusted-dispatch trap, which measured that the two paths order
listeners differently.

**Red-proof:** every run is paired with a **control** in which the core is
loaded but never initialised. If the probe were driving nothing, the live and
control runs would agree. They do not — see §3.

## 2. What the core needed to be told: 5 parameters, both boards identical

`Object.keys(opts)` captured at init, per board:

```
Board A: ['positionMeaningful','canMove','announceMove','announceRefusal','announceReorder']
Board B: ['positionMeaningful','canMove','announceMove','announceRefusal','announceReorder']
```

| parameter | kind | why it cannot be decided once |
|---|---|---|
| `canMove(card, from, to)` | **policy** | which transitions are legal is the screen's workflow. A is forward-only; B is unrestricted. |
| `announceMove` | **policy** | the domain noun ("Request" / "Job") **and which facts matter**: A announces the destination; B announces destination **and position**, because position is priority. |
| `announceRefusal` | **policy** | the refusal *reason* is the workflow rule, in the screen's words. |
| `announceReorder` | **policy** | same, for the within-column axis. |
| `positionMeaningful` | **policy, and it changes the KEY MAP** | `Ctrl+ArrowUp/Down` is a live key on B and inert on A. What the user must learn differs per screen. |

**What the core kept, needing no parameter for any of it** — this is the half
that *is* decidable once:

- roving tabindex across all cards (one tab stop for the whole board);
- `ArrowLeft`/`ArrowRight` traversal between columns, clamped at the ends;
- `preventDefault` on the keys it claims;
- the DOM reparent, and **focus following the moved card** rather than being
  lost to `<body>`;
- writing into a `[data-board-status]` node.

## 3. Readings

Live run (core initialised) against control (core loaded, never initialised):

| step | reading | live | control |
|---|---|---|---|
| A: two legal `Ctrl+ArrowRight` | approvals columns | `submitted[REQ-2] review[REQ-3] approved[REQ-1]` | `submitted[REQ-1,REQ-2] review[REQ-3] approved[]` |
| A: same | status text | `Request REQ-1 moved to Approved.` | `""` |
| A: illegal `Ctrl+ArrowLeft` (backwards) | approvals columns | **unchanged** | unchanged |
| A: same | status text | `Request REQ-1 cannot skip to In review. Approvals move one step forward.` | `""` |
| B: `Ctrl+ArrowRight`, then `Ctrl+ArrowDown` | jobs columns | `backlog[JOB-3,JOB-2] scheduled[JOB-1] done[]` | `backlog[JOB-1,JOB-2,JOB-3] scheduled[] done[]` |
| B: same | status text | `Job JOB-2 now priority 2 of 2 in Backlog.` | `""` |
| both | focus after a move | the moved card (`REQ-1`, then `JOB-2`) | the card focused by the probe |
| both | `pageerror` / console errors | none | none |

The refusal path is exercised, not assumed: the illegal move leaves the DOM
untouched **and** writes a refusal string.

**One thing the readings show about the probe rather than the framework, said
plainly:** Board A's single `announceRefusal` string says *"cannot skip to In
review"* for what was actually a **backwards** move. One string is covering two
different refusal causes. That is not a probe bug to fix — it is the finding one
level down: *which refusals are worth distinguishing* is itself a screen
decision, and a component that owned the string could not make it.

**Instrument caveat, measured:** in `page.accessibility.snapshot()` the
`role="status"` node's own `name` is `""` and the announcement surfaces as a
child `StaticText`. A future gate asserting on the status node's accessible
*name* would read empty and look like a failure. Assert on the subtree.

**A probe defect that changed no reading, and this was measured rather than
argued.** The first run used a non-existent class (`bo-u-visually-hidden`), so
the status node rendered visible. Re-running with the real `bo-visually-hidden`
produced **identical** DOM order, status text, focus and accessibility roles —
so none of the four readings depends on the node's visibility.

## 4. What the framework already has, and what it does not

| the issue's named gap | measured state at `HEAD` |
|---|---|
| keyboard move affordance | **Nothing to reuse.** `grep -rn 'insertBefore\|moveRow\|reorder\|drag' packages/core/src/js/` returns only `file-dropzone.ts`, which is OS **file** drag, not element reordering. Zero move semantics ship. |
| the *navigation* half of it | `data-grid.ts` implements the APG grid pattern — roving tabindex, two-axis arrows, clamping — and is **welded to `<table>`**: it binds `.bo-data-table[data-grid-nav]` and builds its matrix with `querySelectorAll('tr')`. Not reusable for a board as shipped. |
| drop-target styling | **One precedent**, `.bo-file-dropzone[data-dragover="true"]` in `file-upload.css`, welded to file upload. Note the keyboard-first answer needs none: with a keyboard move there is no hovering pointer, so the "drop target" is wherever focus already is. |
| the announcement | **Three different contracts, no shared utility.** `scan-input.ts` writes into a consumer-supplied `[data-scan-status]`; `data-table.ts` *upgrades* a consumer-supplied count node by adding `aria-live="polite"` if absent; `table-sum.ts` only documents that the consumer should build one and writes nothing. `packages/core/src/js/utils/` holds `decimal-input`, `focus-trap`, `popover-position`, `reveal` — no announcer. |

## 5. Verdict

**Refuse the component. The layout half is already served and the policy half
must stay with the consumer.**

Against the Objective, test by test:

- **Principle 3, refuse test** — *"Refuse when it embeds app/domain decisions —
  data, workflow, policy stay with the consumer."* Four of the five parameters
  are workflow or domain vocabulary. A component that owned them would fail
  this outright; a component that did not own them is not the component the
  issue is asking for.
- **Principle 2, refuse test** — *"Refuse … any second way to do something that
  already works."* The reporter's `bo-widget` + `bo-widget-grid` composition
  renders today. A `bo-board` column shell would be a second way to do the
  layout half.
- **Principle 3, accept test** — *"survives ≥2 real, independent
  compositions."* The residue (roving tabindex + arrow traversal + focus
  follows the move) genuinely did survive both boards unchanged. That is real
  evidence, and it is what §6 examines.

**What the issue asked for that cannot be delivered:** *"the keyboard contract
and the live-region announcement decided once."* The second half is not
achievable — the framework can own the *plumbing* of an announcement (a status
node written to at the right moment) but never its content, and content is the
whole accessibility value.

## 6. The one generalisation considered, and refused — with its reopen condition

The measured residue is **two-axis roving-tabindex navigation over a set of
elements that is not a `<table>`**. `data-grid.ts` already implements exactly
this and could be lifted out of `<table>`.

**Refused today, on a base rate.** Extracting it serves exactly **one**
candidate consumer — a board that does not exist. The obvious second consumer
was checked and is not one: `bo-calendar` is the framework's only other 2-D grid
of cells, it ships **no** behavior (`ls packages/core/src/js/behaviors/ | grep
-i calendar` → nothing), and its docs page **deliberately refuses** the model —
*"No roving `tabindex`, no `aria-*` from us, no widget: real buttons in a real
table already give keyboard operation"* (`apps/docs/src/pages/components/calendar.astro:176`).
So the one place that looked like a second consumer is a recorded decision
against it. Principle 3's *"nothing ships for one screen"* refuses the
extraction now.

**What would reopen it:** a second *real* non-table surface that wants two-axis
roving navigation. One hypothetical board is not it.

## 7. Reproducing this

The probe was **not committed** — it is a throwaway that drives `setContent`
against `packages/core/dist/css/index.css`, and the repo's practice is to record
the method rather than carry the script. The core it exercised, verbatim, is the
`initBoard` in §2: a `keydown` listener on the board root that (a) roves
tabindex, (b) traverses columns on bare arrows, (c) on `Ctrl+Arrow` horizontal
consults `canMove` then reparents and announces, (d) on `Ctrl+Arrow` vertical
returns early unless `positionMeaningful`, then reorders and announces. Two
`initBoard` calls with the policies in §1, `launchDocsBrowser()` from
`apps/docs/scripts/browser-harness.mjs`, and a second identical run with the
two `initBoard` calls omitted as the control.
