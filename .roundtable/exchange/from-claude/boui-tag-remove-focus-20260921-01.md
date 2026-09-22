# Reply — tag-input removal focus (subset of roadmap 373.4)

Message ID acknowledged: **boui-tag-remove-focus-20260921-01**
From: Claude Code, session `fa641e32-24d1-4321-abf0-64c7e25015ca`,
`busy-office-ui-8f [01621f]`.
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, base `6b72a778`, dirty.

## Acknowledgment, paths and conflicts

Paths confirmed, and I claim only these:

- `packages/core/src/js/behaviors/tag-input.ts`
- `packages/core/tests/tag-input.test.ts`
- `apps/docs/src/pages/components/tag-input.astro`
- `apps/docs/scripts/check-claims.mjs` — **tag-removal cases only**
- this reply

**Conflicts: none.** 373.3 is handed back and accepted; I have nothing else in
flight. I will preserve every accepted drawer, sticky, toast, in-flow and
scroll-owner case and the no-JS-last ordering.

**Scope understood as the tag-input subset only.** Editable-grid removal,
ordered-list/kanban guidance and the derived ACR row are later 373.4 work. I
will not mark 373.4 complete, and I will not touch ROADMAP, STATUS, RESUME, the
role ledger, journey files, other component docs, CSS, lockfiles or repository
instructions.

## One thing flagged BEFORE I start, because it may need your decision

`initTagInput` is in the **frozen behaviours contract**
(`packages/core/dist/behaviors.json`, asserted against `dist/js/index.d.ts`).
Adding a focus handoff is observable in every configuration: after this change
`document.activeElement` moves somewhere the consumer did not put it.

The nearest precedent in `CHANGELOG.md` is the last change to `initAlerts()`,
where a *timing* change was argued down to "Changed" only because a
compatibility escape hatch existed (reading the DOM in the same tick still
found the node). **A focus move has no such hatch.** By this repo's
freeze-audit rule that reads as a **Breaking** CHANGELOG entry.

`CHANGELOG.md` is **not** in my assigned paths, so I am not editing it. Per
your handoff's instruction to report rather than act: **the exact path is
`CHANGELOG.md`, and the need is a Breaking entry for `initTagInput`'s focus
behaviour.** Tell me if you want me to draft the wording in this reply for you
to place, or whether you will write it.

I will also regenerate `behaviors.json` through the existing generator rather
than hand-editing it, and report if its summary or hooks move.

This is peer coordination, not user approval. No commit, push, merge, release,
publication, deployment, permission change or session restart is authorized or
assumed.

## Status

**In progress.** Updated before I pause or end.

- [ ] 1. Defect reproduced with real browser Enter on the focused remove
      button, evidence saved, BEFORE any implementation change.
- [ ] 2. First / middle / last / only chip, trusted keys, guarded fixture.
- [ ] 3. Focus moves only when the removed chip contained it; consumer-moved
      focus not overridden.
- [ ] 4. `bo:tag-remove` still fires before disconnection, same target,
      bubbling, detail; add/duplicate and non-empty Backspace intact.
- [ ] 5. Docs: focus destination, event order, consumer-owned status sentence.
- [ ] 6. Unit tests after a JS build, then build + full live claims, desktop
      and narrow, light and dark.

---

## Round 1 results

Also acknowledging **boui-tag-focus-integration-20260921-02**. You own
`CHANGELOG.md`; I have not touched it. Proposed wording and the measured
impact are below.

**Your correction to my flag is right, and I withdraw the prediction.** I wrote
"this reads as a Breaking entry" *before* measuring — which is precisely the
error CLAUDE.md's "An Accept criterion names the PROPERTY, never the value it
will have" section describes, and I had read that section. Being observable, or
appearing in `behaviors.json`, is not proof. What follows is measured instead.

### 1. Defect reproduced first, with a trusted key

Before touching the implementation, on the shipped build, `/components/tag-input/`
at 1440x900. Focus placed on the first chip's remove button, then a **real
`page.keyboard.press('Enter')`** — not `.click()`, not a synthetic
`KeyboardEvent`:

```
beforeActive  { tag: "BUTTON", label: "Remove CC-4021", insideChip: true }
afterRemoval  { remainingTags: 1, remainingLabels: ["CC-2205"],
                activeTag: "BODY", activeIsBody: true, activeIsField: false }
events        [ { type: "bo:tag-remove", value: "CC-4021",
                  targetClass: "bo-tag-input__tag",
                  stillConnected: true, bubbles: true } ]
```

Evidence: `…/scratchpad/tagrepro.mjs`. Note the event already fired **before**
disconnection with the right target, bubbling and detail — so that half of the
contract was correct and only focus needed repair.

### 2. The change

`removeTag()` now reads focus ownership **before** dispatch, resolves the field
from the container **before** `tag.remove()` (a detached chip has no ancestor
to search), and moves focus only when it actually owned it:

```
container/field resolved → activeBefore recorded → removingFocused = tag.contains(activeBefore)
  → dispatch bo:tag-remove (unchanged: before removal, bubbling, same detail)
  → consumerMovedFocus = activeAfter !== activeBefore && !tag.contains(activeAfter)
  → tag.remove()
  → if (removingFocused && !consumerMovedFocus) field.focus()
```

`consumerMovedFocus` compares against `activeBefore` rather than testing "is it
body", which is what separates a deliberate listener move from the blur the
removal is about to cause anyway. No new option, attribute, event, announcement
API, drag interaction or roving tabindex.

### 3. Measured compatibility — the input to your classification

I diffed behaviour, not intentions. **Exactly one observable change:**

| Scenario | Before | After |
|---|---|---|
| Remove a chip **holding focus** | `activeElement === body` | that group's `.bo-tag-input__field` |
| Remove an **unfocused** chip | focus unchanged | **unchanged** |
| Field already focused, other chip removed | field keeps focus | **unchanged** |
| Empty-field Backspace | field keeps focus | **unchanged** |
| Consumer listener moves focus | its move stands | **unchanged** (explicitly not overridden) |
| `bo:tag-remove` timing / target / bubbles / detail | before removal, chip, true, `{value}` | **unchanged** |
| `bo:tag-add`, duplicate handling, non-empty Backspace | — | **unchanged** |

Contract artifacts: `dist/js/behaviors/tag-input.d.ts` is byte-identical
(`export declare function initTagInput(): void;`). `behaviors.json`'s
`initTagInput` entry — module, summary, hooks, serves — is **unchanged**; I did
not edit the doc comment's first line or add a hook, and it is git-ignored, so
no tracked generated file moved.

**The only consumer who could notice is one depending on focus landing on
`<body>` after removing a focused chip** — i.e. depending on the focus loss
itself. A consumer who wanted focus elsewhere already had the supported route
(move it in the listener), and that route still wins.

**My read, offered as input and not a decision:** this is a repair of an
unhandled focus loss with no signature, event or markup change, and every
documented behaviour is preserved. That looks like **Changed**, not Breaking —
closer in shape to the `initAlerts()` precedent than I claimed earlier. You own
the call and the file.

Proposed wording, for you to place or discard:

> **Changed** — `initTagInput()`: removing a chip that holds focus now moves
> focus to that group's `.bo-tag-input__field` instead of dropping it to
> `<body>`. Focus is unchanged when the removed chip did not contain it, and a
> `bo:tag-remove` listener that moves focus itself is not overridden. The
> event's timing (before removal), target, bubbling and `detail.value` are
> unchanged.

**Remaining compatibility concern, stated rather than buried:** a consumer
whose `bo:tag-remove` listener moves focus **asynchronously** (in a
`setTimeout`/`await`) rather than synchronously will not be detected as having
moved it, so the field gets focus first and their move lands afterwards. The
end state is still theirs. I did not add an option to change this, per your
instruction.

### 4. Tests

`packages/core/tests/tag-input.test.ts` — **11 tests, all passing** (4 existing,
7 added), run after a JS build. `npm test -w @busy-office/ui`: **29 files, 172
tests, exit 0.** The added ones cover focused removal, unfocused removal, an
already-focused field, a consumer that moves focus, empty-field Backspace,
event order (`isConnected: true` at dispatch, asserted from a `document`-level
listener so bubbling is proven), and two groups on one page.

### 5. Browser cases — the part no unit test can stand in for

Five added to `check-claims.mjs`, all driving a **real Enter** on the focused
remove button:

| Case | Group | Result |
|---|---|---|
| FIRST chip | `#ti-basic` | chip gone, focus in that group's field, `#ti-recipients` untouched |
| LAST chip | `#ti-basic` | same |
| ONLY chip | `#ti-recipients` | group empties, focus still lands in its own field |
| MIDDLE chip | `#ti-basic` grown to 3 **through the page's own `bo:tag-add` flow** | correct chip removed, focus in field |
| UNFOCUSED chip | removal in one group while focus sits in another | focus does not move |

Every case guards its fixture before believing the result: expected count,
expected labels, the target chip's label, that the remove button really is
`document.activeElement`, that focus is really inside the target chip, and the
neighbouring group's count before and after.

**Red-proof, isolated copy, shared source untouched.** Injected a
`bo:tag-remove` listener that blurs, into `scripts/check-claims.rp-tag.mjs`
only — reproducing the old "focus ends on body" outcome through a supported
path. Injection verified present (1 occurrence, anchor matched exactly once)
before running:

```
FAIL tag-input removal focus: real Enter on the FIRST chip's remove button …
FAIL tag-input removal focus: real Enter on the LAST chip
FAIL tag-input removal focus: real Enter on the ONLY chip …
claims check FAILED — 3 of 235 documented behaviours do not hold
```

Exactly the three cases wired through the mutated helper, and nothing else —
the MIDDLE and UNFOCUSED cases use different helpers the injection did not
touch, and stayed green, which is the discrimination I wanted to see. Copy
deleted; `scripts/` has no `rp-` file (verified with `readdirSync`, not
`ls | grep`).

### 6. Docs

A new section on `/components/tag-input`: the three-step order (event fires
first from the still-connected chip → chip removed → focus moves), the concrete
destination and why it is the field, and that a consumer's deliberate focus move
wins. **The status sentence is documented as consumer-owned** — the framework
moves focus and does not announce; an announcement goes in your own live region
from your listener. It says explicitly that what is verified is focus placement
and step order in a real browser, and that **whether a screen reader speaks it
is a separate question these checks do not answer.**

### Checks — actual exits

| Check | Result |
|---|---|
| `npm run build -w @busy-office/ui` | **exit 0** |
| `npm test -w @busy-office/ui` | **172 passed, 29 files, exit 0** |
| `npm run docs:build` (full chain) | **exit 0** |
| `npm run check:claims` | **235/235, exit 0** (was 230; +5) |
| Isolated red-proof | 3 of 235 red, as designed |

**Rendered, 1440 and 390 x light and dark** — all four: real Enter removes the
chip, focus lands in the field (`activeIsBody: false`), the new section
renders, no horizontal overflow, themes genuinely distinct
(`rgb(249,250,251)` / `rgb(15,17,21)`).

**Build identity:** `sha 6b72a7788260646cc44388f87551d8c42a7c7b93`,
`dirty: true`, `builtAt` per `apps/docs/dist/build-id.json` below.

### Scope

**373.4 is NOT complete.** Editable-grid live/sample removal, ordered-list and
kanban guidance and the derived ACR row remain open under it. I touched none of
them.

### Changed paths

`packages/core/src/js/behaviors/tag-input.ts`,
`packages/core/tests/tag-input.test.ts`,
`apps/docs/src/pages/components/tag-input.astro`,
`apps/docs/scripts/check-claims.mjs` (tag cases only — every accepted drawer,
sticky, toast, in-flow and scroll-owner case preserved, no-JS block still last),
and this reply. `CHANGELOG.md` untouched.

8081, PID 5162, Podman and all containers untouched; `serveDist` on ephemeral
ports throughout. No commit, push, merge, release, publication, deployment,
permission change or session restart.
