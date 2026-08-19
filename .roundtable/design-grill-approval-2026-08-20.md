# Design grill — /patterns/approval (2026-08-20)

Batch 2 of the /design-grill sweep (roadmap 58.1). Measured live, bind-mounted
container, light + dark. Same width caveat as this batch's other two reports:
`resize_window` held at ~606px regardless of the requested size this wake;
shared primitives (stepper, timeline, audit, data-table) were already proven
at true 1440/390 in earlier grills with no CSS change since — except the one
finding below, which is a container-query threshold measured directly via
`getBoundingClientRect`/`scrollWidth`, not eyeballed from a screenshot.

## Step 1 — the decision

Same "what, not who" gap as the rest of the batch — the opener names the
composed pieces (stepper, timeline, queue, audit) and the two-channel state
rule, never who is approving or what "done" looks like for them. Batched
into the same triage as the other three.

## Findings

**A real, measured clipping bug in the shared `stepper` component — not this
page alone.** At a `.bo-stepper` container width of 558px (comfortably above
the component's own 480px/30rem threshold where it deliberately hides labels
entirely), two of four step labels still overflow their allotted space and
get ellipsis-truncated: "Line items" needs 66px, has 64px (`scrollWidth:66,
clientWidth:64`); "Approvers" — the CURRENT step, the one thing this wizard
most wants a reader to know they're on — needs 68px, has 64px. Both measured
directly on the live DOM, not inferred from a screenshot.

`stepper.css`'s own container query assumes "above 480px, full labels fit" —
true for a 2-3 step wizard, false for this 4-step one, because `flex: 1`
splits width evenly across steps and connectors regardless of how much text
each label actually needs. This is a framework component gap (affects every
page that embeds `.bo-stepper` with 4+ steps at a mid-range container width),
not specific to this pattern.

**Not fixed on the spot — recorded as measured, not treated as
batch-1-severity.** Unlike the `record-detail` ID mismatch (wrong content,
shown to every reader, zero graceful fallback), this already degrades
gracefully: `text-overflow: ellipsis` is explicit, deliberate CSS, and the
step number/checkmark markers stay fully legible regardless. A user who saw
the full label seconds earlier (or hovers) isn't misled, just mildly
inconvenienced. Queued rather than hot-fixed, because a real fix (a second
container-query tier trading label font-size for room, or auditing every
`.bo-stepper` call site for step count) deserves its own Standardize-sweep
pass across every page that uses the component, not a one-off patch scoped
to this pattern.

**Anatomy names three elements this live page never demonstrates: "Record
summary," "Decision cluster" (Approve/Reject), and "Dialog."** Checked live:
the "Approval queue" section is pure prose — *"the queue is the standard
selectable data table with bulk Approve/Reject... nothing new to learn"* —
with no visible Approve/Reject buttons or dialog anywhere on the page. This
is the same shape as `settings-admin`'s Danger-zone gap in this same batch:
Anatomy over-promises relative to the demo. Milder here, because the missing
pieces are explicitly pointed elsewhere (bulk approve/reject *is* shown on
`/patterns/invoice-list`) rather than simply absent with no pointer — but the
Dialog (the one interaction unique to THIS pattern, not shared with
invoice-list) has no pointer anywhere.

## What's already strong

- **Two-channel state, checked and correct on every timeline/stepper entry**:
  every `data-state` carries both a visible glyph (`aria-hidden`) and
  programmatic text (`.bo-visually-hidden` / `aria-current`) — stated as the
  rule in the opener and followed without exception across all 8 timeline/
  stepper steps checked.
- **The audit trail is append-only and reads that way**: every entry names
  actor, timestamp, and (where relevant) a quoted reason — no edit/delete
  affordance anywhere, correct for a compliance record.
- **`role="list"` on every `<ol>`** — a real accessibility fix (list-style:
  none strips list semantics in some AT) stated in the markup's own comment,
  not silently done.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **reword (batch-level)** | same "what, not who" gap as the rest of this batch |
| Stepper label clipping (558px, 4-step) | **queue for Standardize** | real, measured (2-4px overflow), framework-level, gracefully degraded — not a hot-fix |
| Anatomy "Decision cluster" / "Dialog" | **reword or link** | not demonstrated live and, unlike the queue, has no pointer elsewhere |
| Anatomy "Record summary" | **reword** | not demonstrated; milder, same class |
| Two-channel state (timeline + stepper) | **keep** | checked on every entry, no exceptions found |
| Audit trail (append-only) | **keep** | correct for a compliance record |
| `role="list"` restoration | **keep** | a real, documented AT fix |

## Recommendation

One framework-level finding (stepper label clipping at mid-range widths) —
queued rather than patched here, for a dedicated Standardize pass across
every `.bo-stepper` call site. Two prose findings (Anatomy naming elements
the demo doesn't show) batched into 58.2 with the rest.
