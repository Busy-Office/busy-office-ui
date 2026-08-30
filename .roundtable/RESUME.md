# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-30 (**cloud** wake — rule 6 → **Polish**, round 2 on
`component/sidebar-nav`). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, unchanged
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed** — `217.1`, `217.2`, `217.3`, `216.1`,
`182.1`, `176.1`, `176.2`, `171.1`, `101.3`, `94.11`, `184.1`, `186.2` — are
historical references to this wake's work and to what it cites, not claims they
are open. The four genuinely open are **`112.3`, `112.4`, `211.1`, AT runtime**.
This wake changed none of them.

## NOT lapped this wake, and that was checked rather than assumed

Step 0 fetched `origin/main` at `913dfbf` — the previous wake's own tip — and the
re-fetch Step 0c mandates before the first commit returned the same sha. The
previous hand-off's lapping (37 slices, a whole dispatch discarded) did not
recur. **Its suggestion still stands and is still only a suggestion:** a long
cloud wake should re-fetch mid-wake, not only before the first commit. Nothing
mandates it, and this loop may not decide that.

## What landed this wake

**Slice 217 — Polish round 2 on `component/sidebar-nav`. NOT a no-op.**

- **217.1 — a cite that was EXACT when written and decayed two days later.**
  `fit` read *"the shell rail; po-app uses it at **6 sites** …"*.

  ```
  git log -S 'po-app uses it at 6 sites' -- apps/docs/src/data/dsa-scores.json
  #  37a1143a  2026-08-21T06:16:30+08:00
  git show 37a1143a:examples/po-app/server.mjs | grep -c 'bo-sidebar-nav'   # 6  <- EXACT when written
  grep -c 'bo-sidebar-nav' examples/po-app/server.mjs                       # 8  <- today
  ```

  po-app grew two screens on 2026-08-22 (`40a18f1e` /inbox 6→7, `b5a3081b`
  movements 7→8). Published stale for **eight days**; the entry is stamped
  `"scored": "2026-08-23"`, the day after it stopped being true.

  **This is a different defect class from 216.1, and that is the point.** 216.1's
  cite was wrong on the day it was written, so re-reading the file it describes
  catches it. This one was right when written and was falsified by a change
  **somewhere else entirely** — a new screen in the reference app, which nobody
  reviewing `sidebar-nav` would think to open. No wrong moment to catch, only an
  expiry nobody watches.

  **Score does not move, no blind re-score owed** — six usages becoming eight is
  *more* placement, so `fit: 3` was and stays right; `scored` stays 2026-08-23.
  Same call as 216.1. **The fix removes the quantity rather than refreshing it**,
  because a refreshed count decays on the next dogfooded screen. Every element of
  the replacement verified present FIRST (1 `<nav class="bo-sidebar-nav`,
  `page()` at server.mjs:105, the nesting at offcanvas.astro:20), then verified in
  the BUILT html: `uses it at 6 sites` → **0** across all of `apps/docs/dist`, new
  sentence renders **1**.

  The surface's other five cites reconciled clean, each against the shipped
  artifact. One caveat recorded rather than promoted to a defect: `typography`'s
  *"same basis as combobox/form"* holds as a BASIS claim (`combobox.css:124` is
  0.05em, `form-section.css:19` is 0.03em, both uppercase micro-headings) and not
  as a value claim; rewriting a defensible sentence to pre-empt a misreading is
  the busywork §3b refuses.

- **217.2 — the class measured, and the gate refused for a second reason.**
  6 of **240** cites carry a bare count. Four exact (`navbar` 3→3, `dialog`
  13→13, `offcanvas` 1→1, `tabs` 2→2), `sidebar-nav` stale, and
  `breadcrumb · fit`'s denominator says "2 of **19** pattern screens" against
  **39** today (numerator still 2). **Not** a uniform predicate, so unlike 94.11
  a detector here would distinguish — refused anyway on 101.3, **and** because
  the class is not writable in the shape the other cite-checkers take: they ask
  *is this string in that file*, this needs *does this number still equal a count
  over a different tree*, which would require the cite to carry its own command.
  That is a rubric change, not ratchet maintenance.

  **`breadcrumb` is filed, not fixed** — one round, one surface. It is NOT a
  queue entry (not in `polish-state.md`; rule 6 reads only `rounds` and `dry`),
  but it gives the next Polish round the thing no round since 176.1 has had: **a
  pick with a measured reason instead of an unbroken `content: 3` tie.**

- **217.3 — rule 5 un-staled.** It read `STALE` at Step 0b for a second
  consecutive wake; the previous hand-off named recording a metric as the fix and
  then recorded none. `axe-violations` measured from this wake's own `test:axe`
  run and recorded.

**Instrument correction worth carrying:** the pick measurement's first reading
used `--before=2026-08-23T23:59:59` with **no offset**, read in the container's
UTC against `+0800` commits, so it cut eight hours late — `icon` read 3 commits
+43 (truly 4/+113) and `calendar` read **0/0**, i.e. "did not move at all", when it
had moved twice. The tell was not a tidy number: the base commit it resolved to
was stamped a day AFTER the boundary asked for. Pin the offset on any
`--before`/`--since` in this repo.

## Cloud-wake limits, stated rather than implied

No Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. One rendered change ships — the `fit` row of `/components/sidebar-nav`'s
alignment table carries different text. No element, class, style or CSS file
changed; the whole diff under `apps/docs/src` is one JSON string. `check:layout`,
`test:axe`, `check:claims` and the rest of the cloud list swept green and the
corrected cite was verified in the BUILT html. **That is what ran; it is not the
same as having looked at the page.**

**`polish_requeue.py` cannot run on a fresh container before a build** — it dies
with `FileNotFoundError: packages/core/dist/api.json`. Recorded as a shape, not
filed: the traceback names the missing file, so it fails loudly rather than
skipping quietly. `npm run build -w @busy-office/ui` first is the whole fix.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures.

```
python3 scripts/loops/dispatch_status.py
```

Rules as this wake read them, each from its own source: rule 1 clear (no open P0;
GitHub intake **0 open issues**, `totalCount: 0`), rule 2 `Standardize 0 / 4 ok`,
rule 3 `Objective 0 / 3 ok`, **rule 4 nothing dispatchable**, **rule 5 STALE at
Step 0b — reported as un-evaluable, then un-staled by 217.3**, **rule 6 fired**.

**Rule 4's four items, with the KIND of blocked per 186.2** — re-read from each
item's own text this wake:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| `211.1` vendor htmx into `examples/po-app` | owner-blocked — a product call |
| AT runtime evidence | hardware-blocked — owner hardware |

**None of the four is browser-blocked**, so this is not the mis-sort 186.2 warns
about.

**A Polish round is again the likely next dispatch**, and for the first time
since 176.1 it has a stated pick: **`breadcrumb · fit`'s stale denominator**
(217.2). Note also that the productive arm continues to earn its place — the
citation reconciliation has now found a real defect on **4 of 5** surfaces where
it has been run (`scan` 176.1, `state-patterns` 182.1, `data-table` 216.1,
`sidebar-nav` 217.1; `badge` remains the clean one). Run that arm first.

## Direction

**`211.1` remains the owner's call and this wake did not touch it.** The standing
correction holds: the docs teach no CDN wiring at all, so the question is whether
to ADD teaching, not to preserve it.

**`175.4` gained no new evidence this wake** — no collision occurred. Its inputs
are unchanged since the previous hand-off, which is itself worth knowing: the
lapping there was one observation, not a rate.

**Still unacted, now three wakes older:** 177's observation that a grill's roadmap
slice pays for its text twice.

**Standing three unchanged** (112.3, 112.4, AT runtime).
