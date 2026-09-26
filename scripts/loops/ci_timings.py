#!/usr/bin/env python3
"""Where CI's time goes, read from real runs (roadmap 377.9), and what
"build once, pass dist to the shards" (375.6) could do to it.

    python3 scripts/loops/ci_timings.py [N]      # N recent green push runs on main, default 8

375.6 was refused on a LOCAL reading: core and docs built in 6s + 7s on a
warm machine, so the duplicated build work came out at "about 8%" of the
~14.7 machine-minutes ci.yml quoted. 377.9 asked for the figure from the
runners themselves. Per run, from `gh api repos/<repo>/actions/runs/<id>/jobs`:
- machine time, the sum of the job durations, and wall time, first job start
  to last job end;
- `npm ci`, the core build and the docs build, summed across every job;
- the two bounds that decide 375.6. Both are identities over the measured
  steps, not predictions:
  - **machine saved at most** = every shard's builds, minus the one docs build
    a build-once job still runs, before any artifact transfer is paid;
  - **wall clock at least** = that build job's time to finish (the core job's
    setup and `npm ci`, a core build and a docs build) plus the slowest shard
    with its builds removed. Transfer only adds to it.

The step classifier recognises names, so it RECONCILES against the source:
ci.yml's own `Build core` and `Build docs` step lines, multiplied by the jobs
they run in, must equal what was classified in each run, or it refuses.

@exact: sums and differences over API timestamps, reconciled against ci.yml.
`--self-test` covers the classifier and both bounds.
"""
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPO = "Busy-Office/busy-office-ui"
CI = ROOT / ".github/workflows/ci.yml"


def kind(step):
    n = step.lower()
    if n == "run npm ci":
        return "npm ci"
    if n.startswith("build core"):
        return "core"
    if n.startswith("build docs"):
        return "docs"
    return "other"


def _t(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def summarise(jobs):
    """One run's readings from its jobs (the API's shape: name, started_at,
    completed_at, steps[name, started_at, completed_at])."""
    out = {"machine": 0.0, "npm ci": 0.0, "core": 0.0, "docs": 0.0, "builds": 0}
    starts, ends, shards, core_job = [], [], [], None
    for j in jobs:
        dur = (_t(j["completed_at"]) - _t(j["started_at"])).total_seconds()
        out["machine"] += dur
        starts.append(_t(j["started_at"]))
        ends.append(_t(j["completed_at"]))
        per = {"npm ci": 0.0, "core": 0.0, "docs": 0.0, "pre": 0.0}
        seen_build = False
        for s in j["steps"]:
            if not (s.get("started_at") and s.get("completed_at")):
                continue
            d = (_t(s["completed_at"]) - _t(s["started_at"])).total_seconds()
            k = kind(s["name"])
            if k != "other":
                per[k] += d
                out[k] += d
                if k in ("core", "docs"):
                    out["builds"] += 1
                    seen_build = True
            if not seen_build or k in ("core", "docs"):
                per["pre"] += d  # everything up to and including the builds
        (shards if per["docs"] else [None]).append({"dur": dur, **per})
        if not per["docs"] and per["core"]:
            core_job = per
    shards = [s for s in shards if s]
    out["wall"] = (max(ends) - min(starts)).total_seconds()
    docs_once = out["docs"] / len(shards) if shards else 0.0
    out["saved_at_most"] = sum(s["core"] + s["docs"] for s in shards) - docs_once
    build_job = (core_job["pre"] if core_job else 0.0) + docs_once
    out["wall_at_least"] = build_job + max((s["dur"] - s["core"] - s["docs"] for s in shards), default=0.0)
    return out


def expected_builds():
    """Build steps ci.yml declares: each `name: Build core|docs` line times the
    jobs it runs in (the docs-gates matrix size for the lines under it)."""
    src = CI.read_text()
    gates_at = src.index("\n  docs-gates:")
    shards = len(re.findall(r"^\s+- name: .+\n\s+run: ", src[gates_at:src.index("\n    steps:", gates_at)], re.M))
    n = 0
    for m in re.finditer(r"^\s+- name: Build (core|docs)\b", src, re.M):
        n += shards if m.start() > gates_at else 1
    return n, shards


def gh(path):
    r = subprocess.run(["gh", "api", path], capture_output=True, text=True, timeout=60)
    if r.returncode:
        raise SystemExit(f"ci_timings: gh api {path} failed: {r.stderr.strip()}")
    return json.loads(r.stdout)


def self_test():
    def job(name, t0, steps):
        at, st = t0, []
        for n, d in steps:
            st.append({"name": n, "started_at": f"2026-09-26T00:{at // 60:02d}:{at % 60:02d}Z",
                       "completed_at": f"2026-09-26T00:{(at + d) // 60:02d}:{(at + d) % 60:02d}Z"})
            at += d
        return {"name": name, "started_at": st[0]["started_at"], "completed_at": st[-1]["completed_at"], "steps": st}
    jobs = [job("core", 0, [("Set up job", 5), ("Run npm ci", 10), ("Build core (CSS dist + TS)", 10), ("Docs container builds", 60)]),
            job("a", 0, [("Set up job", 5), ("Run npm ci", 5), ("Build core (CSS dist + TS)", 10), ("Build docs gallery", 30), ("a", 200)]),
            job("b", 0, [("Set up job", 5), ("Run npm ci", 5), ("Build core (CSS dist + TS)", 10), ("Build docs gallery", 30), ("b", 100)])]
    s = summarise(jobs)
    bad = []
    if (s["npm ci"], s["core"], s["docs"], s["builds"]) != (20, 30, 60, 5):
        bad.append(f"classifier: {s}")
    if s["saved_at_most"] != 50:  # (10+30)+(10+30) - 30
        bad.append(f"saved_at_most should be 50, got {s['saved_at_most']}")
    if s["wall_at_least"] != 265:  # core job to its build (25) + one docs build (30) + slowest shard without builds (210)
        bad.append(f"wall_at_least should be 265, got {s['wall_at_least']}")
    if s["wall"] != 250:
        bad.append(f"wall should be 250, got {s['wall']}")
    if (kind("Build docs gallery at the Pages base path (incl. dist link check)"), kind("Build core (CSS dist + TS)"),
            kind("Run npm ci --omit=dev"), kind("Docs container builds")) != ("docs", "core", "other", "other"):
        bad.append("kind() matched too loosely or too tightly")
    if bad:
        print("ci_timings --self-test FAILED:\n  " + "\n  ".join(bad), file=sys.stderr)
        return 1
    print("ci_timings --self-test: 5 cases behave (classifier sums, both bounds, wall, name matching)")
    return 0


def main():
    if "--self-test" in sys.argv:
        return self_test()
    n = int(next((a for a in sys.argv[1:] if a.isdigit()), 8))
    want, shards = expected_builds()
    runs = [r for r in gh(f"repos/{REPO}/actions/workflows/ci.yml/runs?branch=main&status=success&event=push&per_page={n}")["workflow_runs"]][:n]
    if len(runs) < 3:
        raise SystemExit(f"ci_timings: {len(runs)} green push run(s) found; 377.9 needs at least 3")
    print(f"ci.yml declares {want} build step(s) per run ({shards} docs-gates shard(s)); {len(runs)} green push run(s) on main\n")
    print(f"{'run':>12} {'sha':8} {'machine':>8} {'wall':>6} {'npm ci':>8} {'builds':>13} {'saved<=':>8} {'wall>=':>7}")
    agg = []
    for r in runs:
        s = summarise(gh(f"repos/{REPO}/actions/runs/{r['id']}/jobs?per_page=50")["jobs"])
        if s["builds"] != want:
            raise SystemExit(f"ci_timings: run {r['id']} has {s['builds']} build step(s) classified, ci.yml declares {want}. "
                             "A step was renamed or the matrix changed; fix kind() before quoting anything.")
        b = s["core"] + s["docs"]
        print(f"{r['id']:>12} {r['head_sha'][:8]} {s['machine'] / 60:7.1f}m {s['wall'] / 60:5.1f}m "
              f"{s['npm ci']:4.0f}s {s['npm ci'] / s['machine']:4.1%} {b:4.0f}s {b / s['machine']:5.1%} "
              f"{s['saved_at_most'] / 60:6.1f}m {s['wall_at_least'] / 60:6.1f}m")
        agg.append(s)
    lo = lambda k: min(a[k] for a in agg)
    hi = lambda k: max(a[k] for a in agg)
    print(f"\nbuild steps: {min(a['core'] + a['docs'] for a in agg) / 60:.1f}-{max(a['core'] + a['docs'] for a in agg) / 60:.1f} machine-min per run, "
          f"{min((a['core'] + a['docs']) / a['machine'] for a in agg):.1%}-{max((a['core'] + a['docs']) / a['machine'] for a in agg):.1%} of it; "
          f"npm ci {min(a['npm ci'] / a['machine'] for a in agg):.1%}-{max(a['npm ci'] / a['machine'] for a in agg):.1%}")
    print(f"build once: saves at most {lo('saved_at_most') / 60:.1f}-{hi('saved_at_most') / 60:.1f} machine-min before transfer; "
          f"wall clock at least {lo('wall_at_least') / 60:.1f}-{hi('wall_at_least') / 60:.1f} min against {lo('wall') / 60:.1f}-{hi('wall') / 60:.1f} today")
    return 0


if __name__ == "__main__":
    sys.exit(main())
