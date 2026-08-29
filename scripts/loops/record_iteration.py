#!/usr/bin/env python3
"""Record one loop iteration: append the human line to loop-log.md AND insert
the derived row into loops.db. The markdown stays the source of truth.

Usage:
  python3 scripts/loops/record_iteration.py \
      --loop Continue --mode build --item "ERP Amount field" \
      --outcome landed [--commit <sha>] [--no-log]

--commit defaults to the current git HEAD short sha. --no-log inserts the DB
row without touching the markdown (used by rebuild).

OUTCOME VOCABULARY (roadmap 41.2). "shipped" is rejected because it was doing
two jobs and hiding the difference: every iteration in Slices 31-40 was recorded
as shipped while the registry served 0.1.1 throughout, so four consecutive
Objective grills had to keep rediscovering that none of it had reached a user.
The log is where prioritisation happens; it should not require an npm lookup to
read honestly.

    landed    committed to git, gates green — the normal outcome
    released  in a published artifact a consumer can install
    logged    a decision or plan recorded, no code
    triaged   input turned into roadmap items
    refused   considered and declined, with the reason recorded
    reverted  shipped then withdrawn

Historical rows are left alone. They record what was believed when written, and
rewriting them would erase the very finding that motivated this.

REFUSALS INSIDE A LANDED ITEM (roadmap 51.1/62.1). A refusal that happens
*inside* an item whose overall outcome is "landed" or "triaged" was invisible
to a query for outcome=refused — ROADMAP.md carried 41 mentions of "refuse" and
the mirror had zero refused rows. --also-refused adds a SECOND row: same
timestamp and commit, loop="Meta" (precedented: 2026-08-13's design rows),
mode="refusal", outcome="refused", item=<what was refused, one line>.

loop="Meta" is deliberate, not incidental: both dispatch counters in
dispatch_status.py sum rows where loop=="Continue", so recording the refusal
under the SAME loop as its parent item would double-count one round of work as
two toward the Standardize/Objective thresholds — the identical silent-drift
shape this project has been bitten by before. Repeatable: pass --also-refused
more than once for more than one refusal in the same item.
"""
import argparse
import datetime
import os
import subprocess
import sys

from _common import LOG, SEP, connect

OUTCOMES = {"landed", "released", "logged", "triaged", "refused", "reverted"}


def head_sha():
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], text=True
        ).strip()
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--loop", required=True)
    ap.add_argument("--mode", default=None)
    ap.add_argument("--item", required=True)
    ap.add_argument("--outcome", required=True)
    ap.add_argument("--commit", default=None)
    ap.add_argument("--no-log", action="store_true",
                    help="insert the DB row only; don't append to loop-log.md")
    ap.add_argument("--also-refused", action="append", default=[],
                    metavar="TEXT",
                    help="record a refusal that happened inside this item, as "
                         "its own queryable row (loop=Meta, outcome=refused). "
                         "Repeatable.")
    args = ap.parse_args()

    # Naive local wall-clock, DELIBERATELY (roadmap 164.2, decided 2026-08-28).
    # Two dispatchers write this log from two clocks (+0800 and +0000), so a row
    # is ambiguous by eight hours on its face and 3 of 1013 adjacent pairs read
    # backwards. Adding `%z` was refused: `dispatch_status.py`'s ROW regex
    # rejects such a row outright, and the file's own line order is already
    # chronological at 1014 of 1014 once each stamp is read through the blame
    # offset of the commit that wrote it. Which clock wrote a row is recovered
    # by `git blame`, exactly. Full reasoning: LOOPS.md Step 0c.
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    if args.outcome == "shipped":
        raise SystemExit(
            'record_iteration: "shipped" is ambiguous — it meant both "committed" and\n'
            '  "a user can install it", and the second was never true while npm served\n'
            '  0.1.1. Use "landed" (committed, gates green) or "released" (published).'
        )
    if args.outcome not in OUTCOMES:
        raise SystemExit(
            f'record_iteration: unknown outcome "{args.outcome}".\n'
            f'  Use one of: {", ".join(sorted(OUTCOMES))}'
        )
    for text in args.also_refused:
        if SEP in text:
            raise SystemExit(
                f'record_iteration: --also-refused text contains "{SEP.strip()}", '
                "the log line separator — it would corrupt the markdown row.\n"
                f"  offending text: {text!r}"
            )
    commit = args.commit or head_sha()

    rows = [(ts, args.loop, args.mode, args.item, args.outcome, commit)]
    for text in args.also_refused:
        rows.append((ts, "Meta", "refusal", text, "refused", commit))

    if not args.no_log:
        with open(LOG, "a", encoding="utf-8") as f:
            for r_ts, r_loop, r_mode, r_item, r_outcome, r_commit in rows:
                line = SEP.join(["- " + r_ts, r_loop, r_mode or "-",
                                 r_item, r_outcome, r_commit or "-"])
                f.write(line + "\n")

    conn = connect()
    for r_ts, r_loop, r_mode, r_item, r_outcome, r_commit in rows:
        conn.execute(
            "INSERT INTO iterations (ts, loop, mode, item, outcome, commit_sha) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (r_ts, r_loop, r_mode, r_item, r_outcome, r_commit),
        )
    conn.commit()
    conn.close()
    print(f"recorded: {ts} · {args.loop} · {args.mode} · {args.item} · {args.outcome}")
    for text in args.also_refused:
        print(f"  + refused: {text}")

    # Regenerate STATUS.md (roadmap 110.5) so it can never drift from what was
    # just recorded. Best-effort: a failure here must not fail the recording
    # itself, which is the operation that actually matters.
    for name, label in (
        ("generate_status.py", "STATUS.md"),
        # The .roundtable index is derived the same way and regenerated here for
        # the same reason: a findings list that is refreshed by hand is a
        # findings list that is wrong.
        ("generate_roundtable_index.py", ".roundtable/INDEX.md"),
    ):
        try:
            gen = os.path.join(os.path.dirname(__file__), name)
            subprocess.run([sys.executable, gen], check=True, capture_output=True)
        except Exception as exc:  # noqa: BLE001 - deliberately broad, see above
            print(f"  (warning: {label} regeneration failed: {exc})", file=sys.stderr)

    # RESUME.md's own checks run HERE, not in `check:repo` (roadmap 169.4).
    # `.roundtable/**` is in CI's paths-ignore, so a commit touching only it is
    # never built — which made a CI-run gate reading RESUME.md a silent hole:
    # it could break and go unbuilt, surfacing on whatever landed next. They are
    # loop hygiene about the loop's own workspace, so they belong on the loop's
    # own path, which runs every time a wake records an iteration. Advisory here
    # by the same rule as the generators above: neither may fail the recording,
    # which is the operation that actually matters.
    #
    # The trade both share, stated rather than implied: nothing rejects a commit
    # that breaks the charter or leaves the hand-off's slice ids stale.
    # The verb is per-check and is not cosmetic. The charter check FAILS: its
    # assertions are rules that either hold or do not. The slice-id check
    # REPORTS: a non-zero exit means it found ids worth re-reading, and it says
    # outright it cannot tell a stale claim from a historical reference. Calling
    # that a failure would train the reader to ignore it. LOOPS.md line 66 quotes
    # the charter's string verbatim, so it is reproduced exactly here.
    for script, name, verb in (
        # Does RESUME.md stay inside its charter and keep pointing at the
        # durable file? (roadmap 169.3/175.2)
        ("check-resume-charter.mjs", "RESUME.md charter check", "FAILED"),
        # Does RESUME.md name a slice id ROADMAP.md records as closed?
        # (roadmap 186.1 — the stale blocked-set dispatcher rule 4 reads)
        ("check-resume-slice-ids.mjs", "RESUME.md slice-id reconciliation", "REPORTED"),
    ):
        path = os.path.join(
            os.path.dirname(__file__), "..", "..", "apps", "docs", "scripts", script
        )
        try:
            r = subprocess.run(["node", path], capture_output=True, text=True)
            if r.returncode != 0:
                print(f"  ({name} {verb} — see below)", file=sys.stderr)
                print((r.stdout or "") + (r.stderr or ""), file=sys.stderr)
        except Exception as exc:  # noqa: BLE001 - same reason as above
            print(f"  (warning: {name} could not run: {exc})", file=sys.stderr)


if __name__ == "__main__":
    main()
