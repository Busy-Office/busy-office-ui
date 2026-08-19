# Design grill — /patterns/settings-admin (2026-08-20)

Batch 2 of the /design-grill sweep (roadmap 58.1). Measured live, bind-mounted
container, light + dark. Width note: the session's `resize_window` tool would
not hold 1440/390 this wake (it settled at a fixed ~606px regardless of the
requested size — an automation-tooling fault, not a page issue); the shared
primitives used here (tabs, data-table, badges, form-section) were already
verified live at true 1440/390 in batch 1 with zero CSS changes since (the
Objective grill run earlier this wake confirmed the class count held at 189).
Content and structure findings below don't depend on the exact width.

## Step 1 — the decision

Same gap as every screen in batch 1: the opener says what's composed
("`.bo-tabs`... `.bo-form-section`... nothing new to learn") but never who
sits in front of it or what decision it serves. Recorded once, batched into
the same triage as the rest — not a new finding, the fourth instance of it.

## Findings

**The Anatomy section describes a "Danger zone" that does not exist anywhere
on the live page.** Anatomy item 4: *"Danger zone — destructive settings
visually separated, each behind a confirm dialog."* Checked live across all
three tabs (General, Users, Notifications): there is no destructive action
anywhere — no delete-workspace, no remove-user, no reset-to-defaults control.
The States table's own "Destructive action" row promises the same thing
("confirm dialog naming the exact consequence... object name typed for
irreversible ones") and it also has nothing live to point at. This is the
same shape of gap `app-launch` had (a States row describing a capability the
component doesn't implement) — but here it's the page's own Anatomy, not a
shared component's contract, so the fix is smaller: either build one
destructive control into the demo (workspace deletion is the obvious
candidate — every real admin screen has one) or say plainly that Danger zone
is documented as a recommended anatomy element, not one this demo shows.

**The Users tab has no row actions.** It's the one section demonstrating
user administration, and every row is read-only: name, role, status, nothing
to change either. An "admin" screen that cannot deactivate or re-role a user
is incomplete as a *demonstration* of the pattern, even though nothing here
is factually wrong. Milder than the Danger-zone gap — recorded, not
necessarily actionable on its own.

## What's already strong

- **Read-only mode's answer is exactly right and already cross-linked**: the
  States table sends non-admins to the [key-value](/components/kv) facts
  view rather than inventing a disabled-form variant — reuses a shipped
  component instead of a new state.
- **"There is no separate switch component"** is stated directly in the
  opener with the reasoning (a labeled checkbox already covers it) — this is
  the Objective's own "one component, many settings" principle explained in
  the user-facing copy, not just enforced silently.
- Zero decoration: every element (tabs, checkboxes, table) carries real
  state or real data, nothing ornamental.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **reword (batch-level)** | same "what, not who" gap as the rest of this batch |
| Danger zone / destructive action | **build or reword** | Anatomy + States both promise it; live demo has nothing — pick one |
| Users tab row actions | **note** | milder incompleteness; not blocking |
| Read-only → key-value facts | **keep** | reuses a shipped component correctly |
| "No switch component" framing | **keep** | the Objective's own principle stated in user-facing copy |
| Tabs / form sections / checkboxes | **keep** | zero decoration, all state-carrying |

## Recommendation

One real gap worth fixing: either add a destructive action to the demo
(workspace deletion, behind a confirm dialog — the obvious, honest choice
since the page already claims this territory) or soften Anatomy/States to
stop promising a control this page doesn't show. Triaged as 58.2, alongside
the opener reword.
