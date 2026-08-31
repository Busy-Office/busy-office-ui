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

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, was 3
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

**The open set moved 3 → 4, and the new one is the first dispatchable build
item in the backlog since 112.5 closed.** That is the headline for the next
wake: rule 4 is no longer empty.

## What landed this wake

**Dispatched Polish (rule 6)** — rules 1-5 all found nothing, and rule 5 was
answered from its instrument rather than from the file (see below).

**Slice 231.1 — LANDED, a NO-OP, and recorded as one.** §3b's reconciliation of
`component/alerts` came back clean on all four arms, so no fix was manufactured.
`badge`'s round-2 precedent: `rounds` 1→2, `dry` stays 0, `scored` stays
2026-08-23, no blind re-score owed because nothing in the published artefact
changed.

- All **40** `dsa-scores.json` entries render on a built page (40 entries → 39
  pages; `alert`→`alerts`, `skeleton`+`state`→`state-patterns`). **Zero**
  `Not yet scored` — 176.1's defect has not recurred — and zero `NaN`.
- **17 of 17** cited literals present across the seven re-queued surfaces with
  DSA entries. `dashboard`'s `3rem` "exactly one caller" holds at **exactly 1**
  comment-stripped, against 2 raw occurrences.
- **6 of 6** rubric dimensions on **40 of 40** entries — `DsaScore.astro` would
  publish `NaN%` for a missing key with nothing throwing, so that path was
  reconciled rather than assumed.

**Slice 231.2 — FILED OPEN, not fixed.** `bo-alert--elevated` is published twice
on `/components/alerts`, both times inside the generated `ClassRef`/`ApiTable`,
and explained nowhere on any page; its three call sites are all the notification
screen, so Objective §3's "≥2 real, independent compositions" is the real
question. Left to a Continue round because 101.3's stop rule confines Polish to
the existing ratchet.

- **Red-proved by discrimination inside one page**: `--success` 5, `--warning` 5,
  `--danger` 3, `--elevated` 2. The demoed variants separate from the undemoed
  one under the same instrument, in the same document.
- **Base rate 17 of 89 variants across 4 of 40 components** — neither 0 nor
  100%, so not 94.11 ceremony. **16 of the 17 carry a recorded reason** and that
  is what took the work: 14 icon glyphs are covered by icon's own `fit` cite
  (*"an example of the mechanism rather than a catalogue"*), and the two
  `--seamless` are scoped in prose on `/patterns/editable-grid`.
- **No gate proposed** — the residual predicate is 1 of 89.

**An instrument error was caught mid-round and it had inverted a verdict.** The
variant sweep first ran against page *source* and dismissed icon's glyphs as a
false positive, reasoning that `icon.astro:39` builds the classes by regex. Run
against the **built** page it is not a false positive: the page renders **12 of
26**. That 12 reproduces, independently and from a different artefact, the same
12 that icon's Polish round 2 caught hard-coded as a divisor (ROADMAP 227) —
two instruments, one number. Believing the source grep would have thrown away
the finding's entire base rate.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   0 / 4 Continue rounds   since 2026-08-31 13:03   ok
Objective     2 / 3 slices            since 2026-08-31 02:50   ok  [229, 230]
Optimize      0 wake-date(s) newer    since 2026-08-31 08:41   ok
```

**Re-run it rather than trusting this snapshot** — it was read at Step 0b, and a
`Polish` row moves none of the three counters (Polish closes no slice, per
161.4, and feeds no Continue count).

**How rules 1-6 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | counter **0 / 4**, and **no drift flagged** — last wake spent that trigger |
| 3 Objective | **2 / 3**, `[229, 230]` — one more closed slice arms a grill |
| 4 build item | **nothing dispatchable at the time**; 231.2 was filed later in the wake and IS dispatchable next time |
| 5 Optimize | **not evaluable** — see below; reported as such, not as clear |
| 6 Polish | **fired** |

## ⚠ Rule 5 has one live metric and twelve stale ones — do not read `bundle-gz-kb`

`dispatch_status.py`'s rule-5 line says `ok` (not STALE), and that is correct but
narrow: it reflects `axe-violations`, the only name with a comparable pair newer
than 2026-08-20 — `0.0@08-29`, `0.0@08-30`, `0.0@08-31`, flat.

**The other 12 multi-sample names' newest pairs are all 2026-08-16→19.** In
particular `bundle-gz-kb` reads `10.8 → 11.6 → 11.7`, which *looks* exactly like
rule 5's "regressed on two consecutive runs" trigger and is **12+ days stale**.
That is the dead-instrument answer `LOOPS.md` rule 5 warns about, and it is
written here because the shape is genuinely tempting. Recorded as **not
evaluable**; do not quote it as current.

## Direction

**No new input arrived** — no open GitHub issues, no owner message since the last
wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The three-wake run of "every open item is owner- or hardware-blocked" ends
here, from inside the loop rather than from the owner.** 231.2 is a real,
measured, dispatchable build item, and it is explicitly **neither owner-blocked
nor browser-blocked**: the elevated rendering already ships on
`/patterns/notification`, so the options (demo it / refuse it / record it as a
named exception) are markup and prose, verifiable in a cloud wake through
`docs:build`, `check:claims`, `check:layout`, `test:axe` and `check:repo`. A
screenshot would be a nice-to-have, not the evidence. **Rule 4 will pick it
next wake** — it is the newest item, but every older open item is blocked, so
"oldest still-open" resolves to it as the oldest *dispatchable* one; if a future
wake reads rule 4 strictly as oldest-regardless, it will land on 112.3 and stop
again.

The three pre-existing items are unchanged and still not ours:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — 5 briefs; `.roundtable/pilot-112/` holds README + SEALED-PICKS.md and **no `briefs.md`** |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**No sweep is due and the closed-history share was NOT re-measured** — third
consecutive deferral, and the previous hand-off named the trigger: *if a wake
needs this share a third time, that is the signal to commit the script.* This
wake did not need it (rule 4 walked 4 open items, not thousands of lines), so it
is deferred rather than measured. `ROADMAP.md` is at **2,448** lines, up from
2,291; the growth is Slice 231 itself. **Say "deferred", not "31.6%"** — that
figure is from two wakes ago.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed only
`ROADMAP.md` and `.roundtable/polish-state.md` — no CSS, no markup, no rendered
output — so nothing in it rests on a rendered image.
