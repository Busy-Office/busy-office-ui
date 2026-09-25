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
import re
import subprocess
import sys

from _common import LOG, ROOT, SEP, connect, parse_log_line

OUTCOMES = {"landed", "released", "logged", "triaged", "refused", "reverted"}

# The loop names (roadmap 393.5). One closed set, stated once, here; the log's
# own history is the floor it was taken from. Counted on 2026-09-25 over 1,804
# rows: Continue 676, Meta 579, Roadmap 172, Standardize 169, Objective 112,
# Explore 57, Polish 35, Optimize 3, Gauntlet 1 — plus Research, which
# LOOPS.md's table names and no row has used yet. Meta is not a loop in that
# table; it is the label every --also-refused row is written under (579 Meta
# rows, 574 of them `Meta · refusal`),
# so a set taken from the table alone would reject the recorder's own output.
# Re-count before changing:
#   python3 -c "import re,collections;print(collections.Counter(m.group(1) for l in open('.roundtable/loop-log.md') for m in [re.match(r'^- \S+ \S+ · ([\w-]+) · ',l)] if m))"
LOOPS = {"Continue", "Standardize", "Polish", "Research", "Optimize", "Explore",
         "Objective", "Gauntlet", "Roadmap", "Meta"}


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
    ap.add_argument("--milestone", default=None, metavar="Mn",
                    help="tag the row as milestone work (roadmap 393.5): written into "
                         "the loop-log row, where dispatch_status.py counts it")
    ap.add_argument("--track", default=None, choices=["defect"],
                    help="tag the row as defect-track work (the interleave counts it)")
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
    if args.loop not in LOOPS:
        raise SystemExit(
            f'record_iteration: unknown loop "{args.loop}".\n'
            f'  Use one of: {", ".join(sorted(LOOPS))}\n'
            "  A new loop is a LOOPS.md change first, then this set (roadmap 393.5)."
        )
    if args.milestone is not None:
        if not re.fullmatch(r"M[1-9]\d*", args.milestone):
            raise SystemExit(f'record_iteration: --milestone must look like M1, not "{args.milestone}"')
        # A tag naming no milestone is counted by nothing: rules 2, 3 and M
        # compare it with the ACTIVE milestone's id (393.5's verification).
        with open(os.path.join(ROOT, "ROADMAP.md"), encoding="utf-8") as f:
            if not re.search(rf"^## Milestone {args.milestone}\b", f.read(), re.M):
                raise SystemExit(
                    f'record_iteration: --milestone {args.milestone} names no `## Milestone '
                    f'{args.milestone}` section in ROADMAP.md, so no counter would ever read the tag.'
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

    # The tags go into the ROW, as their own segment before the outcome, because
    # dispatch_status.py reads the log, not loops.db: rules 2 and 3 under
    # `Rules-2-3: scoped`, and rule M's interleave, count from the row (393.5).
    # A refusal row is not a dispatch, so it carries no tags.
    tags = " ".join(t for t in (f"milestone={args.milestone}" if args.milestone else "",
                                 f"track={args.track}" if args.track else "") if t)
    rows = [(ts, args.loop, args.mode, args.item, args.outcome, commit, tags)]
    for text in args.also_refused:
        rows.append((ts, "Meta", "refusal", text, "refused", commit, ""))

    # Build every line first and READ IT BACK before writing anything: a row the
    # parser reads differently from what is about to go into loops.db (an item
    # ending in " ·", or whose last segment is tag-shaped) would leave the log
    # and the mirror disagreeing with no warning — and the counters follow the
    # log (393.5's verification). Refuse instead.
    lines = []
    for r_ts, r_loop, r_mode, r_item, r_outcome, r_commit, r_tags in rows:
        line = SEP.join(["- " + r_ts, r_loop, r_mode or "-", r_item]
                        + ([r_tags] if r_tags else []) + [r_outcome, r_commit or "-"])
        back = parse_log_line(line)
        want = {"ts": r_ts, "loop": r_loop, "mode": r_mode or "-", "item": r_item, "outcome": r_outcome,
                "commit_sha": r_commit or None,
                "milestone": args.milestone if r_tags else None,
                "track": args.track if r_tags else None}
        got = {k: back.get(k) if back else None for k in want}
        if got != want:
            diff = ", ".join(f"{k}: wrote {want[k]!r}, reads back {got[k]!r}" for k in want if got[k] != want[k])
            raise SystemExit(
                "record_iteration: this row would not read back as written, so nothing was recorded.\n"
                f"  {diff}\n  Reword the item (it must not end in \"{SEP.strip()}\" or with a tag-shaped segment)."
            )
        lines.append(line)

    if not args.no_log:
        with open(LOG, "a", encoding="utf-8") as f:
            for line in lines:
                f.write(line + "\n")

    conn = connect()
    for r_ts, r_loop, r_mode, r_item, r_outcome, r_commit, r_tags in rows:
        conn.execute(
            "INSERT INTO iterations (ts, loop, mode, item, outcome, commit_sha, milestone, track) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (r_ts, r_loop, r_mode, r_item, r_outcome, r_commit,
             args.milestone if r_tags else None, args.track if r_tags else None),
        )
    conn.commit()
    conn.close()
    print(f"recorded: {ts} · {args.loop} · {args.mode} · {args.item} · {args.outcome}")
    for text in args.also_refused:
        print(f"  + refused: {text}")

    # dispatch-region-words is SAMPLED here, on every Standardize row (roadmap
    # 353.2): from the instrument, with the commit in the row. It used to be
    # taken by hand in two conventions 56 words apart, and no sample said which
    # commit it described. Three guards from the Slice 384 grill: it runs BEFORE
    # STATUS.md is regenerated (so the committed STATUS is not one sample
    # behind); it honours --no-log (which promises not to touch the files); and
    # it samples only when the recorded commit is HEAD, because rule 5 orders
    # samples by time and an older commit recorded later would become the day's
    # reading. Best-effort: a failure warns and never fails the recording.
    if args.loop == "Standardize" and not args.no_log:
        head = head_sha()
        if commit and head and not head.startswith(commit[:7]) and not commit.startswith(head[:7]):
            print(f"  (dispatch-region-words not sampled: the recorded commit {commit} is not HEAD {head})",
                  file=sys.stderr)
        else:
            rlp = os.path.join(os.path.dirname(__file__), "report_loop_prose.py")
            try:
                r = subprocess.run([sys.executable, rlp, "--record", commit or "HEAD"],
                                   capture_output=True, text=True,
                                   cwd=os.path.join(os.path.dirname(__file__), "..", ".."))
                if r.returncode == 0:
                    print(f"  {r.stdout.strip()}")
                else:
                    print(f"  (warning: dispatch-region-words not recorded: {(r.stderr or r.stdout).strip()})",
                          file=sys.stderr)
            except Exception as exc:  # noqa: BLE001 - deliberately broad, see above
                print(f"  (warning: dispatch-region-words not recorded: {exc})", file=sys.stderr)

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
            # The generator's own reason, not just its exit status: a refusal
            # names the malformed marker, and dropping it left the next wake a
            # stale file and no clue why (393.3's verification).
            reason = getattr(exc, "stderr", None) or getattr(exc, "stdout", None)
            if reason:
                text = reason.decode("utf-8", "replace") if isinstance(reason, bytes) else reason
                for line in text.strip().splitlines():
                    print(f"    {line}", file=sys.stderr)

    # RESUME.md's own checks run HERE, not in `check:repo` (roadmap 169.4).
    # The ORIGINAL reason is now false and is recorded as such rather than
    # quietly left standing: `.roundtable/**` used to sit in CI's paths-ignore,
    # so a commit touching only it was never built and a CI-run gate reading
    # RESUME.md was a silent hole. There is no paths-ignore any more (removed
    # 2026-09-07, roadmap 312.1/312.2 — ci.yml says so twice in comments), so
    # that argument no longer supports anything. The placement still stands on
    # its second reason, which was always the stronger one: they are
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

    # A FOURTH advisory check, and like the third below it can only run once
    # the commit exists (roadmap 346.1). Did a correction to ROADMAP.md reach
    # every copy of the number? At least 13 of the 59 superseding commits the
    # 346.1 census found left one standing. It reads the RECORDED commit, not
    # HEAD: a wake that records an earlier item with --commit would otherwise
    # never have that item checked (Slice 381). REPORTED on the slice-id
    # check's rule: it cannot tell a quotation from a stale copy.
    sites = os.path.join(os.path.dirname(__file__), "check_correction_sites.py")
    try:
        r = subprocess.run([sys.executable, sites, "--commit", commit or "HEAD"],
                           capture_output=True, text=True,
                           cwd=os.path.join(os.path.dirname(__file__), "..", ".."))
        if r.returncode == 1:
            print("  (correction-site check REPORTED — see below)", file=sys.stderr)
            print((r.stdout or "") + (r.stderr or ""), file=sys.stderr)
        elif r.returncode != 0:
            print(f"  (warning: correction-site check could not run: {(r.stderr or '').strip()})",
                  file=sys.stderr)
    except Exception as exc:  # noqa: BLE001 - same reason as above
        print(f"  (warning: correction-site check could not run: {exc})", file=sys.stderr)

    # A THIRD advisory check, and it runs from here for a reason the other two
    # do not have: it can only work AFTER the commit (roadmap 283.2).
    #
    # `--stamp` digests the working tree at the end of a Polish round. If the
    # round then edits that surface's source again before committing, the stamp
    # describes a tree no commit carries and the surface re-queues forever on a
    # constant. `data-table` and `pagination` both died that way on 2026-09-05
    # and neither was noticed for a day. Nothing can catch it at stamp time --
    # the offending edit has not happened yet -- and by the next wake's step 0
    # it reads as an ordinary re-queue. This is the first moment the evidence
    # exists: the commit is made, so the stamp either reproduces in it or does
    # not. REPORTED, not FAILED, on the slice-id check's rule: it names rows
    # worth re-stamping and cannot tell a mid-round stamp from a legitimately
    # backfilled one on its own.
    #
    # Guarded on `api.json` because the slug -> css-dir map is READ, never
    # guessed, and a wake that never built core does not have it. Without this
    # the script's (correct, actionable) refusal exits 1 and would be rendered
    # as a stamp report on every such wake -- a check crying wolf about its own
    # missing input is how a real report gets trained away.
    verify = os.path.join(os.path.dirname(__file__), "polish_requeue.py")
    api = os.path.join(
        os.path.dirname(__file__), "..", "..", "packages", "core", "dist", "api.json"
    )
    if not os.path.exists(api):
        return
    try:
        r = subprocess.run(
            [sys.executable, verify, "--verify-stamps"],
            capture_output=True, text=True,
        )
        if r.returncode == 1:
            print("  (polish stamp verification REPORTED — see below)", file=sys.stderr)
            print((r.stdout or "") + (r.stderr or ""), file=sys.stderr)
    except Exception as exc:  # noqa: BLE001 - same reason as above
        print(f"  (warning: polish stamp verification could not run: {exc})", file=sys.stderr)


if __name__ == "__main__":
    main()
