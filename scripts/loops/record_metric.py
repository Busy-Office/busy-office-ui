#!/usr/bin/env python3
"""Record one metric sample: append to loop-metrics.jsonl AND insert into
loops.db. The jsonl file is the source of truth; the DB is the mirror.

Usage:
  python3 scripts/loops/record_metric.py --name bundle-gz-kb --value 7.0 --unit kB

THERE IS DELIBERATELY NO `--direction`, AND DO NOT ADD ONE (roadmap 324.1,
2026-09-08). Two reasons, both measured. Shape: direction is constant per NAME,
so a per-sample field is one fact stored in every sample and free to disagree
with itself, and no sample already recorded could ever carry it. Substance:
supplying it makes rule 5 fire on `bundle-gz-kb` -- four consecutive day-pair
rises, 7.2 -> 15.1 kB -- and that verdict is wrong, because the same wakes
recorded `components` at the SAME timestamps and per-component cost FELL
(0.400 -> 0.384 -> 0.355 kB; 0.378 live). A rise with no denominator is growth.
Nor can the unit stand in: `count` is carried by 14 names spanning both
directions, and `axe-violations` changed unit mid-series (`pages` -> `count`).

So: the reader supplies the direction, and `dispatch_status.py` prints movement
rather than a verdict. When a name has a real threshold, gate it -- `check:size`
budgets the bundle at 16.7 kB gz, which is rule 5's budget clause and the
instrument that actually answers "is this a problem?".

`bundle-gz-kb` -- THE ONE NAME CARRYING A DEFINITION, because it is the only one
rule 5 can currently act on (roadmap 324.2, 2026-09-08). All figures below are
snapshots; every command that produced one is named, so re-run rather than quote.

  artifact     packages/core/dist/css/index.min.css, gzipped
  command      npm run build -w @busy-office/ui   ->   check:size prints
               `css/index.min.css   1 file(s)   15.10 /  16.7 kB gz`
               That is value / BUDGET. Record the left number.
  environment  any -- measured, not assumed; the drift bound is below.

  DO NOT READ THE FIGURE OFF EITHER README. `stamp-readme.mjs` deliberately
  keeps an existing in-tolerance string instead of re-stamping (so a rebuild
  elsewhere does not produce a no-op diff), so the published number lags the
  artifact by up to its `GZIP_TOLERANCE_KB = 0.3`. It does today: the READMEs
  say 15.0 and check:size says 15.10 -- 98 bytes apart, each correct by its own
  contract, and only one of them live. A sample read off the README is stale by
  an unknown amount inside that band.

  WHAT DELTA MEANS ANYTHING. Rule 5 pairs the LAST reading of each distinct day
  (307.1), so the moves it reads are the day-pair ones. All four to date are
  +2.4, +1.2, +0.9 and +3.4 kB -- 3x to 11.3x the 0.3 kB band. The band has
  never been the binding constraint. 324.2's own headline said the opposite
  ("its noise floor is wider than three of its four historical moves") and it
  does not reproduce under any pairing: day-pair 0 of 4 below the band,
  sample-to-sample 5 of 10, within-day 5 of 6 -- and the last two are moves
  rule 5 never reads. So: a day-pair move at or above 0.3 kB is readable, and
  every historical one clears it several times over.

  CROSS-ENVIRONMENT DRIFT IS UNDER 0.1 kB -- measured once, and stated as a
  BOUND because the stamp's own rounding is what limits it. Tree `a9403f42` was
  stamped `92 kB minified (15.0 kB gzipped)` by a wake on the owner's machine
  (author-tz +0800); the same source rebuilt in a cloud container (+0000, node
  22.22.2, zlib 1.3.1) gives 93,785 minified bytes and 15,334 gzip bytes =
  14.975 kB, which prints the same 15.0. The CSS toolchain is version-identical
  to that commit's own lockfile (cssnano 7.1.9, postcss 8.5.26, and four more,
  each compared), so the minifier is not a confound and gzip is the only
  variable. The other environment's exact byte count is unrecoverable -- only
  the rounded stamp survives -- so the claim is |drift| < 0.1 kB at n=1, under
  a third of the band, not a drift measurement of 0.

  THEREFORE the name is NOT retired and is NOT re-pointed at the deterministic
  minified byte count, both of which 324.2 offered as satisfying outcomes. It
  is not noise-limited. What it lacks is a DENOMINATOR (324.1 above), and the
  size question it looks like it is asking is already answered by check:size's
  budget, which prints its tightest headroom in bytes on every run.

  The 11 samples are 9 at +0800 and 2 at +0000 (`git blame --line-porcelain --
  .roundtable/loop-metrics.jsonl`, the method 164.2 established), so the series
  IS cross-environment: 324.2's own shrink branch -- "a series taken entirely
  at one offset has no cross-environment problem at all" -- is dead, and the
  bound above is what replaces it.
"""
import argparse
import datetime
import json

from _common import METRICS, connect


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--value", required=True, type=float)
    ap.add_argument("--unit", default=None)
    ap.add_argument("--no-log", action="store_true")
    args = ap.parse_args()

    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    row = {"ts": ts, "name": args.name, "value": args.value, "unit": args.unit}

    if not args.no_log:
        with open(METRICS, "a", encoding="utf-8") as f:
            f.write(json.dumps(row) + "\n")

    conn = connect()
    conn.execute(
        "INSERT INTO metrics (ts, name, value, unit) VALUES (?, ?, ?, ?)",
        (ts, args.name, args.value, args.unit),
    )
    conn.commit()
    conn.close()
    print(f"recorded metric: {ts} · {args.name}={args.value}{args.unit or ''}")


if __name__ == "__main__":
    main()
