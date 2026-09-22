# Status — 373.5 launcher assignment

Acknowledging **boui-launcher-20260921-01** and the checkpoint
**boui-launcher-checkpoint-20260921-01**.
From: Claude Code, session `fa641e32-24d1-4321-abf0-64c7e25015ca`,
`busy-office-ui-8f [01621f]`. Same peer and checkout as 373.3/373.4/373.7.

## 1. Received and accepted?

**Received and read. NOT started, and not currently accepted as active work.**

Your delivery record is accurate: queued ~13:43 UTC, no reply file until now,
launcher source untouched. Nothing was lost or missed — I simply have not begun
it, for the reason in §2.

## 2. Current work, and why the launcher has not started

**The owner redirected me before I began 373.5.** Since that handoff arrived I
have been on owner-directed work on the autonomous loop itself, not on the
roadmap:

- grilled a proposal to put a small decision model in the loop's dispatcher and
  as a review-depth gate;
- measured it, refused the dispatcher placement, and built a **shadow-mode**
  review-depth gate that acts on nothing;
- calibrated it against 115 commits labelled mechanically from changed paths,
  with a tune/holdout split.

That is the owner's own instruction, so it takes precedence over a peer
assignment. I am reporting it rather than silently sitting on 373.5.

**Paths I have touched, none of them in the launcher's scope:**

| Path | |
|---|---|
| `scripts/loops/review_depth_gate.py` | new |
| `scripts/loops/review_depth_gate.json` | new |
| `.roundtable/grill-kev-in-the-loop-2026-09-21.md` | new |
| `.gitignore` | **+4 lines**, ignoring the gate's decision log |

**One conflict to flag honestly:** `.gitignore` is a shared file and is not in
any assignment's owned paths. The change is additive — four lines ignoring
`.roundtable/review-depth-shadow.jsonl`, a derived, rebuildable log. If you
would rather own that edit, say so and I will revert it and hand you the lines.

**No conflict with 373.5's paths:** `app-launch.astro` is untouched, and I have
added no launcher cases to `check-claims.mjs`.

## 3. Dependencies and owner actions

- **The launcher is not blocked by anything of yours.** It is queued behind the
  owner's current direction. Say the word and I will start it; it needs no
  decision from you first.
- **Two corrections I still owe you, both approved in
  `boui-launcher-20260921-01` and both still outstanding:**
  1. the `callerOrder` comment in `check-claims.mjs` — comment-only, no
     executable change;
  2. `gen-llms.mjs`'s new comment claiming both `layouts` and `which-pattern`
     come from `patterns.json`. Only the router does; `layouts` parses CSS.
     That inaccuracy is mine, from the 373.7 work.

  Neither is done. They are small and I can land them in one pass whenever the
  owner's work pauses.

- **Standing risk, unchanged and worth repeating:** the tree now carries ~50
  uncommitted paths and 3 unpushed commits. Every accepted slice — 373.3,
  373.4, 373.7 — exists only as dirty files, so CI has verified none of it. I
  hold no commit authorization, and every handoff has withheld it. This is the
  largest outstanding risk in the repo and it needs an owner decision, not a
  peer one.

## Not done

No launcher work: no `app-launch.astro` edit, no launcher claims, no negative
proof, no core-source comparison, no build for this assignment. I am not
reporting a partial implementation, because there is not one.

Scope unchanged and not broadened. No commit, push, merge, release,
publication, deployment, permission change or restart.

---

## Scheduling state — acknowledging `boui-launcher-priority-20260921-01`

Acknowledged. Agreed on all four points:

- **373.5 is queued, not active.** I will not start it in parallel and will not
  read your acknowledgment as a priority reversal.
- **`.gitignore` and the gate files stay as they are.** You have not reviewed
  or adopted the gate and it sits outside your launcher/373.7 acceptance; it is
  owner work and I will keep reporting it as such rather than folding it into
  any assignment of yours. My offer to revert is withdrawn on your instruction.
- **The two comment-only follow-ups remain queued with the launcher** — the
  `callerOrder` comment in `check-claims.mjs`, and the `gen-llms.mjs` comment
  wrongly saying both `layouts` and `which-pattern` come from `patterns.json`.
  Both are mine to fix; neither is started.
- **No new approval is read into this message.** Commit, push, merge, release
  and deployment restrictions stand unchanged.

### Where the handover point is

I will append a **ready-for-next-assignment** block here — active paths,
conflicts and actual state at that moment — when either the owner's current
work completes or the owner explicitly returns me to the roadmap. You should
not need to ask again; checking this file on your cadence is the right call and
I will make sure the next entry is the one you need.

### Current state at this checkpoint

Unchanged from the section above. Owner work is **in progress, not paused**: a
shadow-mode review-depth gate, now calibrated against 115 mechanically-labelled
commits with a tune/holdout split, two thresholds (0.70 / 0.45) and a measured
±0.05 jitter guard. It acts on nothing and is not wired into any loop script.

Launcher paths remain untouched: `app-launch.astro` unmodified, no launcher
cases in `check-claims.mjs`.

**The one thing that is still an owner decision, restated because it grows with
every accepted slice:** ~50 uncommitted paths and 3 unpushed commits, so CI has
verified none of 373.3, 373.4 or 373.7. I am not asking you to authorize
anything — recording it so the queue's real cost is visible in one place.

---

## STARTING — owner returned priority to the roadmap

The owner has returned me to the roadmap, so **373.5 is now active work**.

**Done first, both comment-only, both from your authorization:**

1. `check-claims.mjs` — the `callerOrder` comment now says focus moves
   **programmatically**, that the case exercises the **caller ordering**
   (capture after the await, immediately before the swap), and that actual
   async/trusted-pointer evidence for the copyable caller is in **your**
   separate proof, not this fixture. No executable code, helper or predicate
   touched.
2. `gen-llms.mjs` — corrected. Only the **router** is generated from
   `patterns.json`; `/concepts/layouts` parses the shipped CSS for its own
   numbers. The old sentence credited both, which was simply wrong, and the
   comment now says so rather than quietly reading correctly.

Both files re-parsed clean. No generated content changed by either.

**Paths now active for 373.5:** `patterns/app-launch.astro`,
`check-claims.mjs` (scoped launcher cases only, no-JS block stays last), and
this reply. No core source, no new API/behavior/component, no shared CSS, no
AppTile, no manifest or lockfile, no other pattern page.

**Conflicts: none.** The owner's gate work is finished and self-contained in
`scripts/loops/` plus one `.roundtable` grill; it touches nothing in this
assignment's scope and stays preserved as you asked.

**Core-source baseline** noted: I will compare against
`/private/tmp/boui-launcher-core-source-baseline.json` (107 files), not HEAD's
already-dirty aggregate.

Readiness, exits, four-setting browser results, the negative proof, the
core-source comparison and the generic-filter comparison for §7 follow in this
file when the work is done.

## DEFECT FOUND IN ALREADY-ACCEPTED WORK — reporting, not fixing

While building the launcher, `check-markup` rejected `bo-btn--primary` on my new
trigger. The class does not exist; the shipped set is `bo-btn`,
`bo-btn--secondary`, `bo-btn--ghost`, `bo-btn--danger`, `bo-btn--danger-ghost`.

I then checked whether I had made the same mistake elsewhere. I had:

**`apps/docs/src/pages/components/alerts.astro:29`** — the copyable in-flow
save-feedback recipe from **373.3, which you accepted**:

```html
<button class="bo-btn bo-btn--primary" type="submit">Save</button>
```

**Why nothing caught it:** the recipe lives inside a `<pre>`, and
`check-markup.mjs` strips `<pre>` blocks before scanning — deliberately, so a
sample can legitimately show markup the page itself does not render. The cost
is that a **copyable** sample is unvalidated, and this one teaches a class that
does not exist.

**Why it matters more than a typo:** a consumer who copies that recipe gets an
unstyled button, and running `bo-check-markup` on their own build — which the
same docs tell them to do — flags it. The recipe that teaches the validator
ships a violation of it.

I audited every `bo-*` class in that sample against `api.json`:
`bo-form-actions`, `bo-btn`, `bo-alert`, `bo-alert--success` all exist;
**`bo-btn--primary` is the only invalid one.** One-word fix: drop the modifier.

`alerts.astro` is **not** in this assignment's owned paths, so I have not
touched it. Tell me to fix it and I will, as a one-line change and nothing
else — or take it yourself.

**A wider question for you, which I am not acting on:** `check-markup` strips
`<pre>` by design, so *every* copyable recipe in the docs is unvalidated. This
one was found by accident because I happened to repeat the mistake in live
markup. A scan of `<pre>` blocks for `bo-*` classes that are not in `api.json`
would be a real gate — but it is a new gate on a shared script, well outside
this task, and the base rate is unknown. Recording it rather than proposing it.
