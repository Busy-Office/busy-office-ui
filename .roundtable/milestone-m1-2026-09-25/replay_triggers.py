#!/usr/bin/env python3
"""Replay rule D's triggers (roadmap 393.7, prompt §7) on history, through proxies.

Run from the busy-office-ui repo root:

    python3 <path>/replay_triggers.py [--rev <sha>] [--n 10] [--json out.json]

READ-ONLY. Every repo file is read with `git show <rev>:<path>` (or at a
per-date commit reachable from <rev>); nothing in the repo is written. The
repo's own parsers (scripts/loops/_common.py parse_log_line,
generate_status.py parse_roadmap / oldest_dispatchable) are imported FROM <rev>,
in memory, via a meta-path importer — so a dirty working tree does not change
the result, no __pycache__ is written, and a later run at the same --rev
reproduces it.

Proxies (no milestone was ever ACTIVE, no row carries milestone=M1):
  D1  per calendar date, ROADMAP.md at the last commit on that date, parsed by
      parse_roadmap(text, archive_text); fires when oldest_dispatchable() is None.
  D2  0 by construction — no `## Milestone M1` before the first commit that adds it.
  D3  executor rows = Continue rows; walk in FILE order; fire at a Continue row
      when >=2 of the last 3 Continue rows (incl. it) ended triaged|logged.
  D4  landings = Continue rows, outcome landed (or legacy shipped/fixed/committed),
      sha resolves; share = packages/core/src lines / all lines over the last N.
"""
import argparse
import datetime as dt
import importlib.abc
import importlib.util
import json
import os
import re
import statistics
import subprocess
import sys

sys.dont_write_bytecode = True

LOG_PATH = ".roundtable/loop-log.md"
FRAMEWORK = "packages/core/src/"
TRIAGE_OUTCOMES = {"triaged", "logged"}
LANDED_WORDS = {"landed", "shipped", "fixed", "committed"}
# The idle-row greps. SPECIFIED is the one the caller named; WIDER is an extra,
# labelled check added because SPECIFIED matched no genuine idle row.
SPECIFIED = re.compile(r"rule 8|nothing dispatchable|halt", re.I)
WIDER = re.compile(r"no dispatch|nothing to dispatch|backlog (?:still |fully |genuinely )?(?:dry|empty)"
                   r"|backlog\+seed list empty|empty backlog|idle wake", re.I)
DAY = dt.timedelta(hours=24)


def git(*args, check=True):
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {r.stderr.strip()}")
    return r


def show(rev, path):
    r = git("show", f"{rev}:{path}", check=False)
    return r.stdout if r.returncode == 0 else None


# ---------------------------------------------------------------- import at rev
class RevImporter(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    """Serve scripts/loops/<name>.py from `git show <rev>:…`, in memory."""

    def __init__(self, rev, root):
        self.rev, self.root = rev, root
        names = git("ls-tree", "--name-only", rev, "scripts/loops/").stdout.split()
        self.mods = {os.path.basename(n)[:-3]: n for n in names if n.endswith(".py")}

    def find_spec(self, name, path=None, target=None):
        if name in self.mods:
            return importlib.util.spec_from_loader(name, self, origin=f"{self.rev}:{self.mods[name]}")
        return None

    def create_module(self, spec):
        return None

    def exec_module(self, module):
        rel = self.mods[module.__name__]
        module.__file__ = os.path.join(self.root, rel)  # _common derives ROOT from it
        src = show(self.rev, rel)
        exec(compile(src, f"{self.rev}:{rel}", "exec"), module.__dict__)


def load_parsers(rev, root):
    for n in ("_common", "generate_status", "rebuild_from_log", "record_iteration", "dispatch_status"):
        sys.modules.pop(n, None)
    sys.meta_path.insert(0, RevImporter(rev, root))
    import _common  # noqa: E402
    import generate_status  # noqa: E402
    return _common, generate_status


# ---------------------------------------------------------------- helpers
def ts_of(row):
    try:
        return dt.datetime.strptime(row["ts"], "%Y-%m-%d %H:%M")
    except (ValueError, TypeError):
        return None


def first_word(outcome):
    if not outcome:
        return ""
    return re.sub(r"[^a-z]", "", outcome.strip().split()[0].lower())


def collapse_24h(events):
    """events: [(datetime|None, payload)] in file order. Keep one per 24 h:
    an event is kept when no KEPT event lies in the 24 h before it. A stamp that
    runs backwards (the log mixes clocks) is within 24 h and so suppressed."""
    kept, last = [], None
    for t, p in events:
        if t is None:
            continue
        if last is None or t - last >= DAY:
            kept.append((t, p))
            last = t
    return kept


def pct(n, d):
    return f"{n}/{d} ({100.0 * n / d:.1f}%)" if d else f"{n}/0 (n/a)"


# ---------------------------------------------------------------- D1
ID_AFTER = re.compile(r"after\**\s*:\s*\**\s*\d+\.\d+[a-z]?\b", re.I)


def d1_at(gs, commit, bypass_reconcile=False):
    """One D1 evaluation of ROADMAP.md at `commit`. Returns a dict.

    bypass_reconcile is the SECONDARY pass only: parse_roadmap with the
    own-line marker reconcile suppressed. It is used only on commits the strict
    pass refused, and only reported beside the refused lines and a check that
    none of them names an item id (i.e. none was a real `After:` hold)."""
    text = show(commit, "ROADMAP.md") if commit else None
    if text is None:
        return {"status": "unparseable", "reason": "no ROADMAP.md at that commit"}
    arch = show(commit, "ROADMAP-archive.md") or ""
    rec = {"archive": bool(arch),
           "alt_open_boxes": len(re.findall(r"^\s*[-*+]\s*\[ \]", text, re.M))}
    saved = gs.reconcile_markers
    if bypass_reconcile:
        gs.reconcile_markers = lambda _t, _p: None
    try:
        items = gs.parse_roadmap(text, arch)
    except SystemExit as e:
        rec.update(status="unparseable", reason=" ".join(str(e).split())[:300])
        raw = [m.group(0) for m in re.finditer(r"^.*$", text, re.M)
               if gs.MARKER_RAW.match(m.group(0))]
        rec["raw_marker_lines"] = [l.strip()[:90] for l in raw]
        rec["raw_marker_lines_with_item_id"] = sum(1 for l in raw if ID_AFTER.search(l))
        return rec
    finally:
        gs.reconcile_markers = saved
    pick = gs.oldest_dispatchable(items)
    kinds = {}
    for it in items:
        k = gs.blocked_kind(it) or ("free-named" if not it["id"] else "free")
        kinds[k] = kinds.get(k, 0) + 1
    rec.update(
        status="fires" if pick is None else "quiet",
        open=len(items), numbered=sum(1 for it in items if it["id"]), kinds=kinds,
        pick=(f"{pick['id']} — {pick['title']}" if pick else None),
        blocked=[(it["id"] or it["title"][:40], gs.blocked_kind(it) or "free-named")
                 for it in items] if pick is None else None,
    )
    if pick is None:
        # why it fires: every open item held, or only unnumbered items are free
        rec["fire_kind"] = ("free-named-only" if kinds.get("free-named") else
                            "no-open-items" if not items else "all-held")
    else:  # red-proof the pick: it must be an OPEN checkbox line in that text
        pat = re.compile(r"^\d+\.\s*\[ \]\s*\*\*(?:[A-Z][A-Z0-9]*\s*·\s*)?"
                         + re.escape(pick["id"]) + r"\b", re.M)
        rec["pick_line_found"] = bool(pat.search(text))
    return rec


def replay_d1_per_row(gs, rows):
    """SUPPLEMENT (not the specified proxy): D1 at every log row's OWN commit —
    the backlog as the next wake would find it — so a backlog that empties and
    refills inside one day is seen. Cached by the (ROADMAP, archive) blob pair."""
    cache, out = {}, []
    for i, r in enumerate(rows):
        sha = r["commit_sha"]
        if not sha:
            continue
        # resolve to a full commit id first: a 7-char id can be ambiguous with a blob
        sha = git("rev-parse", "--verify", "--quiet", f"{sha}^{{commit}}", check=False).stdout.strip()
        if not sha:
            continue
        b = git("rev-parse", "--verify", "--quiet", f"{sha}:ROADMAP.md", check=False).stdout.strip()
        if not b:
            continue
        a = git("rev-parse", "--verify", "--quiet", f"{sha}:ROADMAP-archive.md", check=False).stdout.strip()
        key = (b, a)
        if key not in cache:
            res = d1_at(gs, sha)
            if res["status"] == "unparseable" and "raw_marker_lines" in res:
                sec = d1_at(gs, sha, bypass_reconcile=True)
                res["secondary_status"] = sec["status"]
                res["secondary_fire_kind"] = sec.get("fire_kind")
                res["secondary_safe"] = res["raw_marker_lines_with_item_id"] == 0
            cache[key] = res
        out.append((i, cache[key]))
    return out, len(cache)


def replay_d1(rev, gs, rows):
    dates = sorted({r["ts"][:10] for r in rows if ts_of(r)})
    d0 = dt.date.fromisoformat(dates[0])
    d1 = dt.date.fromisoformat(dates[-1])
    out = []
    day = d0
    while day <= d1:
        ds = day.isoformat()
        commit = git("rev-list", "-1", f"--before={ds} 23:59", rev).stdout.strip()
        rec = {"date": ds, "commit": commit[:10]}
        rec.update(d1_at(gs, commit))
        if rec["status"] == "unparseable" and "raw_marker_lines" in rec:
            sec = d1_at(gs, commit, bypass_reconcile=True)
            rec["secondary"] = {k: sec.get(k) for k in ("status", "open", "numbered", "kinds", "pick",
                                                         "blocked", "fire_kind", "pick_line_found", "reason")}
        rec["log_rows"] = sum(1 for r in rows if r["ts"][:10] == ds)
        rec["specified_rows"] = [r["item"][:120] for r in rows
                                 if r["ts"][:10] == ds and SPECIFIED.search(r["item"] or "")]
        rec["wider_rows"] = sum(1 for r in rows if r["ts"][:10] == ds
                                and WIDER.search(" ".join(filter(None, [r["item"], r["outcome"]]))))
        out.append(rec)
        day += dt.timedelta(days=1)
    return out


# ---------------------------------------------------------------- D3
def d3_windows(rows, is_exec, outcome_ok):
    """[(row_index, window_rows, count, fires)] at every executor row, in FILE order."""
    last, res = [], []
    for i, r in enumerate(rows):
        if not is_exec(r):
            continue
        last = (last + [r])[-3:]
        n = sum(1 for x in last if outcome_ok(x))
        res.append((i, list(last), n, n >= 2))
    return res


def replay_d3(rows, variant="Continue"):
    if variant == "Continue":
        is_exec = lambda r: r["loop"] == "Continue"  # noqa: E731
    else:  # sensitivity only: every loop except Meta
        is_exec = lambda r: r["loop"] != "Meta"  # noqa: E731
    exact = lambda r: (r["outcome"] or "") in TRIAGE_OUTCOMES  # noqa: E731
    w = d3_windows(rows, is_exec, exact)
    fires = [x for x in w if x[3]]
    exec_dates = {rows[i]["ts"][:10] for i, *_ in w}
    fire_dates = {rows[i]["ts"][:10] for i, _, _, f in w if f}
    collapsed = collapse_24h([(ts_of(rows[i]), i) for i, _, _, f in w if f])
    word = lambda r: first_word(r["outcome"]) in TRIAGE_OUTCOMES  # noqa: E731
    return {
        "variant": variant,
        "exec_rows": len(w),
        "exec_rows_triaged_or_logged": sum(1 for r in rows if is_exec(r) and exact(r)),
        "exec_rows_first_word_triaged_or_logged": sum(1 for r in rows if is_exec(r) and word(r)),
        "fires": len(fires),
        "max_count_in_any_window": max((n for _, _, n, _ in w), default=0),
        "dates_with_exec": len(exec_dates),
        "dates_with_fire": len(fire_dates),
        "fires_collapsed_24h": len(collapsed),
        "_windows": w,
    }


# ---------------------------------------------------------------- D4
def numstat(sha):
    r = git("show", "--numstat", "--format=", sha, check=False)
    allf = fw = binary = 0
    for line in r.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) != 3:
            continue
        a, d, path = parts
        if a == "-" or d == "-":
            binary += 1
            continue
        if "=>" in path:  # rename: take the destination path
            m = re.match(r"^(.*)\{(.*) => (.*)\}(.*)$", path)
            path = (m.group(1) + m.group(3) + m.group(4)).replace("//", "/") if m else path.split(" => ")[-1]
        n = int(a) + int(d)
        allf += n
        if path.startswith(FRAMEWORK):
            fw += n
    return allf, fw, binary


def replay_d4(rows, rev, n_window, reachable_only=False):
    """Landings whose sha RESOLVES (the definition). A resolving sha that is not
    an ancestor of <rev> — a commit orphaned by a rebase — is kept but counted,
    because a fresh clone or a gc will not have it; reachable_only drops them."""
    landings, dropped_nosha, dropped_unres, prefix_only = [], [], [], 0
    unreachable = []
    cache = {}
    for i, r in enumerate(rows):
        if r["loop"] != "Continue" or first_word(r["outcome"]) not in LANDED_WORDS:
            continue
        if (r["outcome"] or "").strip().lower() not in LANDED_WORDS:
            prefix_only += 1
        sha = r["commit_sha"]
        if not sha:
            dropped_nosha.append(i)
            continue
        if sha not in cache:
            ok = git("rev-parse", "--verify", "--quiet", f"{sha}^{{commit}}", check=False)
            full = ok.stdout.strip() if ok.returncode == 0 else None
            reach = bool(full) and git("merge-base", "--is-ancestor", full, rev, check=False).returncode == 0
            cache[sha] = (full, reach, numstat(full) if full else None)
        full, reach, ns = cache[sha]
        if not full:
            dropped_unres.append(i)
            continue
        if not reach:
            unreachable.append(i)
            if reachable_only:
                dropped_unres.append(i)
                continue
        landings.append({"row": i, "ts": ts_of(r), "sha": sha, "full": full, "all": ns[0], "fw": ns[1], "bin": ns[2],
                         "item": r["item"]})
    replay_d4.unreachable = unreachable
    shas = [l["sha"] for l in landings]
    dup_rows = sum(1 for l in landings if shas.count(l["sha"]) > 1)
    windows = []
    for k in range(n_window - 1, len(landings)):
        w = landings[k - n_window + 1:k + 1]
        a = sum(x["all"] for x in w)
        f = sum(x["fw"] for x in w)
        windows.append({"end": k, "ts": landings[k]["ts"], "all": a, "fw": f,
                        "share": (f / a) if a else None})
    return landings, windows, dropped_nosha, dropped_unres, prefix_only, dup_rows


def d4_summary(windows, thresholds=(10, 20, 30)):
    shares = [w["share"] for w in windows if w["share"] is not None]
    s = {"windows": len(windows), "undefined": len(windows) - len(shares)}
    if shares:
        s.update(min=min(shares), median=statistics.median(shares), max=max(shares),
                 distinct=len(set(round(x, 6) for x in shares)))
    for x in thresholds:
        below = [w for w in windows if w["share"] is not None and w["share"] < x / 100]
        s[f"below_{x}"] = len(below)
        s[f"below_{x}_dates"] = len({w["ts"].date() for w in below if w["ts"]})
        s[f"below_{x}_collapsed_24h"] = len(collapse_24h([(w["ts"], w["end"]) for w in below]))
    return s


# ---------------------------------------------------------------- main
def main():
    # Run from anywhere: every git call below is relative to the repo root,
    # found from this script's own location (393.7's verification).
    os.chdir(subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True,
                            cwd=os.path.dirname(os.path.abspath(__file__))).stdout.strip())
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--rev", default="HEAD")
    ap.add_argument("--n", type=int, default=10, help="D4 window (landings)")
    ap.add_argument("--json", help="write the full replay here")
    args = ap.parse_args()

    root = git("rev-parse", "--show-toplevel").stdout.strip()
    rev = git("rev-parse", "--verify", f"{args.rev}^{{commit}}").stdout.strip()
    common, gs = load_parsers(rev, root)
    log = show(rev, LOG_PATH)
    raw_lines = [l for l in log.splitlines() if l.startswith("- ")]
    rows = [r for r in (common.parse_log_line(l) for l in log.splitlines()) if r]
    if len(rows) != len(raw_lines):  # reconcile against the source, not against ourselves
        raise SystemExit(f"parsed {len(rows)} rows but the log has {len(raw_lines)} '- ' lines")
    backwards = sum(1 for a, b in zip(rows, rows[1:]) if ts_of(a) and ts_of(b) and ts_of(b) < ts_of(a))
    print(f"rev {rev[:10]} · loop-log rows {len(rows)} (= {len(raw_lines)} '- ' lines) · "
          f"first {rows[0]['ts']} · last {rows[-1]['ts']} · stamps that run backwards in file order: {backwards}")
    print(f"parsers imported from {rev[:10]}:scripts/loops (in memory) · git --before uses local TZ "
          f"{dt.datetime.now().astimezone().strftime('%z')}")

    # D1
    d1 = replay_d1(rev, gs, rows)
    fires = [d for d in d1 if d["status"] == "fires"]
    unp = [d for d in d1 if d["status"] == "unparseable"]
    quiet = [d for d in d1 if d["status"] == "quiet"]
    print("\n== D1 no task (per date, ROADMAP.md at the last commit that day)")
    print(f"dates checked {len(d1)} · D1 fires {len(fires)} · quiet {len(quiet)} · unparseable {len(unp)} · "
          f"dates with no log row {sum(1 for d in d1 if not d['log_rows'])}")
    fk = {}
    for d in fires:
        fk[d["fire_kind"]] = fk.get(d["fire_kind"], 0) + 1
    print(f"fires by kind: {fk}  (all-held = every open item owner/dependency/parked; "
          f"free-named-only = the only free items are unnumbered, which oldest_dispatchable cannot rank)")
    print(f"picks re-found as an open checkbox line in that day's text: "
          f"{sum(1 for d in quiet if d.get('pick_line_found'))}/{len(quiet)}")

    def line(d):
        if d["status"] == "quiet":
            return (f"open={d['open']} numbered={d['numbered']} kinds={d['kinds']} "
                    f"pick={d['pick'][:70]!r}")
        if d["status"] == "fires":
            return (f"[{d['fire_kind']}] open={d['open']} numbered={d['numbered']} kinds={d['kinds']} "
                    f"blocked={d['blocked']}")
        return d.get("reason", "")[:150]

    for d in d1:
        print(f"  {d['date']} {d['commit']} rows={d['log_rows']:>3} {d['status']:<11} "
              f"alt-boxes={d.get('alt_open_boxes')} spec-grep={len(d['specified_rows'])} "
              f"wider-grep={d['wider_rows']} · {line(d)}")
        if "raw_marker_lines" in d:
            print(f"      refused lines ({len(d['raw_marker_lines'])}, naming an item id: "
                  f"{d['raw_marker_lines_with_item_id']}): {d['raw_marker_lines']}")
            print(f"      SECONDARY (marker reconcile suppressed): {d['secondary']['status']} · {line(d['secondary'])}")
    sec = [d["secondary"] for d in unp if "secondary" in d]
    safe = sum(1 for d in unp if "secondary" in d and d["raw_marker_lines_with_item_id"] == 0)
    print(f"SECONDARY over the {len(unp)} unparseable dates: re-read {len(sec)} "
          f"(refused lines naming an item id on {len(sec) - safe} of them) · fires "
          f"{sum(1 for s in sec if s['status'] == 'fires')} · quiet {sum(1 for s in sec if s['status'] == 'quiet')} · "
          f"still unparseable {sum(1 for s in sec if s['status'] == 'unparseable')}")
    spec_total = sum(len(d["specified_rows"]) for d in d1)
    spec_dates = [d["date"] for d in d1 if d["specified_rows"]]
    wider_dates = [d["date"] for d in d1 if d["wider_rows"]]
    print(f"specified grep (rule 8|nothing dispatchable|halt, item text): {spec_total} rows on "
          f"{len(spec_dates)} dates {spec_dates}")
    for d in d1:
        for s in d["specified_rows"]:
            print(f"    {d['date']}: {s}")
    print(f"wider idle grep (not specified; item+outcome): {sum(d['wider_rows'] for d in d1)} rows on "
          f"{len(wider_dates)} dates {wider_dates}")
    # intra-day cross-check: D1 at the commit each matched row names (not end of day)
    print("D1 at each grep-matched row's OWN commit (one line per distinct sha):")
    seen = set()
    for r in rows:
        txt = " ".join(filter(None, [r["item"], r["outcome"]]))
        if not (SPECIFIED.search(r["item"] or "") or WIDER.search(txt)):
            continue
        sha = r["commit_sha"]
        full = git("rev-parse", "--verify", "--quiet", f"{sha}^{{commit}}", check=False).stdout.strip() if sha else ""
        key = full or f"nosha-{r['ts']}"
        if key in seen:
            continue
        seen.add(key)
        n_same = sum(1 for x in rows if x["commit_sha"] == sha) if sha else 1
        res = d1_at(gs, full) if full else {"status": "unparseable", "reason": "sha does not resolve"}
        if res["status"] == "unparseable" and "raw_marker_lines" in res:
            sec = d1_at(gs, full, bypass_reconcile=True)
            res["reason"] = (f"unparseable; SECONDARY {sec['status']} · {line(sec)} "
                             f"(refused lines naming an id: {res['raw_marker_lines_with_item_id']})")
        print(f"  {r['ts']} {r['loop']:<8} sha={sha} (rows citing it {n_same}) -> {res['status']} · "
              f"{line(res) if res['status'] != 'unparseable' else res.get('reason', '')[:200]} "
              f"· row: {r['item'][:70]!r}")

    # SUPPLEMENT: per-row resolution
    per_row, n_versions = replay_d1_per_row(gs, rows)
    print("\nSUPPLEMENT (not the specified proxy) — D1 at every log row's own commit "
          f"({len(per_row)} rows with a resolving sha; {n_versions} distinct ROADMAP/archive versions parsed)")

    def st(res, secondary):
        if res["status"] == "unparseable" and secondary and res.get("secondary_safe"):
            return res["secondary_status"], res.get("secondary_fire_kind")
        return res["status"], res.get("fire_kind")

    for secondary in (False, True):
        lab = "strict" if not secondary else "with SECONDARY for refused versions"
        c, kinds, fire_dates, held_dates, held_ev, any_ev = {}, {}, set(), set(), [], []
        for i, res in per_row:
            s_, k_ = st(res, secondary)
            c[s_] = c.get(s_, 0) + 1
            if s_ == "fires":
                kinds[k_] = kinds.get(k_, 0) + 1
                fire_dates.add(rows[i]["ts"][:10])
                any_ev.append((ts_of(rows[i]), i))
                if k_ == "all-held":
                    held_dates.add(rows[i]["ts"][:10])
                    held_ev.append((ts_of(rows[i]), i))
        row_dates = {rows[i]["ts"][:10] for i, _ in per_row}
        print(f"  [{lab}] rows by status {c} · fires by kind {kinds}")
        print(f"    dates with >=1 firing row: {len(fire_dates)}/{len(row_dates)} {sorted(fire_dates)}")
        print(f"    dates with >=1 ALL-HELD firing row: {len(held_dates)}/{len(row_dates)} {sorted(held_dates)}")
        print(f"    collapsed once/24h: any kind {len(collapse_24h(any_ev))} · all-held {len(collapse_24h(held_ev))}")

    # D2
    first = git("log", "--reverse", "-S", "## Milestone M1", "--format=%h %ad %s", "--date=iso",
                rev, "--", "ROADMAP.md").stdout.strip().splitlines()
    print("\n== D2 milestone empty: 0 by construction")
    print(f"first commit adding '## Milestone M1' to ROADMAP.md: {first[0] if first else 'NONE'}")

    # D3
    print("\n== D3 unclear direction (executor = Continue; FILE order; >=2 of last 3 triaged|logged)")
    d3 = replay_d3(rows, "Continue")
    for k, v in d3.items():
        if not k.startswith("_"):
            print(f"  {k}: {v}")
    print(f"  fraction: {pct(d3['fires'], d3['exec_rows'])} · dates with a firing: "
          f"{pct(d3['dates_with_fire'], d3['dates_with_exec'])}")
    print("  every Continue row ending triaged|logged, with its 3-row window:")
    for i, win, n, f in d3["_windows"]:
        if (rows[i]["outcome"] or "") in TRIAGE_OUTCOMES:
            print(f"    at row {i} ({rows[i]['ts']}): count={n} fires={f}")
            for x in win:
                print(f"      {x['ts']} · {x['outcome']} · {x['item'][:80]}")
    s = replay_d3(rows, "non-Meta")
    print("  SENSITIVITY (not the defined proxy): executor = every loop except Meta")
    print(f"    exec rows {s['exec_rows']} · triaged|logged {s['exec_rows_triaged_or_logged']} · fires "
          f"{pct(s['fires'], s['exec_rows'])} · dates {pct(s['dates_with_fire'], s['dates_with_exec'])} · "
          f"collapsed 24h {s['fires_collapsed_24h']}")
    # red-proof of the instrument: flip two adjacent Continue rows to `logged`
    idx = [i for i, r in enumerate(rows) if r["loop"] == "Continue"]
    a, b = idx[100], idx[101]
    inj = [dict(r) for r in rows]
    inj[a]["outcome"] = inj[b]["outcome"] = "logged"
    ri = replay_d3(inj, "Continue")
    print(f"  red-proof: flipping Continue rows {a},{b} ({rows[a]['ts']}, {rows[b]['ts']}) to logged -> "
          f"fires {ri['fires']} (expect 2: at row {b} and the next Continue row), collapsed {ri['fires_collapsed_24h']}")

    # D4
    print(f"\n== D4 drift (landings = Continue landed|shipped|fixed|committed with a resolving sha; N={args.n})")
    landings, windows, nosha, unres, prefix_only, dup_rows = replay_d4(rows, rev, args.n)
    cand = len(landings) + len(nosha) + len(unres)
    unreach = list(replay_d4.unreachable)
    print(f"  landing rows {cand} (of which {prefix_only} matched only by first word, e.g. 'shipped abc: …') · "
          f"used {len(landings)} · dropped no-sha {len(nosha)} · dropped sha-does-not-resolve {len(unres)} · "
          f"kept but NOT reachable from rev (rebase orphans) {len(unreach)} · "
          f"rows sharing a sha with another landing row {dup_rows}")
    for i in nosha + unres:
        print(f"    dropped row {i}: {rows[i]['ts']} sha={rows[i]['commit_sha']} · {rows[i]['item'][:70]}")
    for i in unreach:
        print(f"    unreachable row {i}: {rows[i]['ts']} sha={rows[i]['commit_sha']} · {rows[i]['item'][:70]}")
    tot_a = sum(l["all"] for l in landings)
    tot_f = sum(l["fw"] for l in landings)
    print(f"  all landings: {tot_f}/{tot_a} framework lines ({100 * tot_f / tot_a:.1f}%) · "
          f"landings with 0 changed lines {sum(1 for l in landings if l['all'] == 0)} · "
          f"landings with 0 framework lines {sum(1 for l in landings if l['fw'] == 0)}")
    sm = d4_summary(windows)
    print(f"  windows {sm['windows']} (undefined {sm['undefined']}) · share min {sm['min']:.3f} · "
          f"median {sm['median']:.3f} · max {sm['max']:.3f} · distinct values {sm['distinct']}")
    for x in (10, 20, 30):
        print(f"  below {x}%: {pct(sm[f'below_{x}'], sm['windows'])} windows · on "
              f"{sm[f'below_{x}_dates']} dates · collapsed once/24h {sm[f'below_{x}_collapsed_24h']}")
    l2, w2, _, u2, _, _ = replay_d4(rows, rev, args.n, reachable_only=True)
    s2 = d4_summary(w2)
    print(f"  VARIANT reachable-only (drops the {len(unreach)} rebase orphans; what a fresh clone reproduces): "
          f"landings {len(l2)} · windows {s2['windows']} · min {s2['min']:.3f} median {s2['median']:.3f} "
          f"max {s2['max']:.3f} · below 10/20/30%: {s2['below_10']}/{s2['below_20']}/{s2['below_30']} · "
          f"collapsed 24h {s2['below_10_collapsed_24h']}/{s2['below_20_collapsed_24h']}/{s2['below_30_collapsed_24h']}")
    zero_windows = sum(1 for w in windows if w["fw"] == 0)
    print(f"  windows with 0 framework lines in all {args.n} landings: {zero_windows}")
    # red-proof: recompute one window by hand, from a fresh git call per sha
    k = len(windows) // 2
    w = windows[k]
    lw = landings[w["end"] - args.n + 1:w["end"] + 1]
    print(f"  red-proof window #{k} (ends {w['ts']}): stored share {w['share']:.4f} = {w['fw']}/{w['all']}")
    ha = hf = 0
    for l in lw:
        # an independent reading: `git diff --numstat <sha>^ <sha>` (the root commit is never a landing)
        out = git("diff", "--numstat", f"{l['full']}^", l["full"]).stdout
        a_ = f_ = 0
        for line in out.splitlines():
            p = line.split("\t")
            if len(p) == 3 and p[0] != "-":
                a_ += int(p[0]) + int(p[1])
                f_ += int(p[0]) + int(p[1]) if p[2].startswith(FRAMEWORK) else 0
        ha, hf = ha + a_, hf + f_
        print(f"    {l['ts']} {l['sha']:<10} all={a_:>6} fw={f_:>6} · {l['item'][:60]}")
    print(f"    hand total {hf}/{ha} = {hf / ha:.4f} (git diff sha^ sha; no rename resolution in the hand pass)")
    # the same independent reading over EVERY landing, not one window
    mism, merges = [], 0
    for l in landings:
        if len(git("rev-list", "--parents", "-n1", l["full"]).stdout.split()) > 2:
            merges += 1
        out = git("diff", "--numstat", f"{l['full']}^", l["full"]).stdout
        a_ = f_ = 0
        for line in out.splitlines():
            p = line.split("\t")
            if len(p) == 3 and p[0] != "-":
                a_ += int(p[0]) + int(p[1])
                f_ += int(p[0]) + int(p[1]) if p[2].startswith(FRAMEWORK) else 0
        if (a_, f_) != (l["all"], l["fw"]):
            mism.append((l["sha"], l["all"], a_, l["fw"], f_))
    print(f"  cross-check over all {len(landings)} landings with `git diff --numstat sha^ sha`: "
          f"{len(mism)} disagree · merge commits among landings {merges}")
    for m in mism[:10]:
        print(f"    {m[0]}: show all={m[1]} diff all={m[2]} · show fw={m[3]} diff fw={m[4]}")

    if args.json:
        dump = {"rev": rev, "d1": d1, "d2_first_commit": first[0] if first else None,
                "d3": {k: v for k, v in d3.items() if not k.startswith("_")},
                "d3_nonmeta": {k: v for k, v in s.items() if not k.startswith("_")},
                "d4_summary": sm,
                "d1_per_row": [{"row": i, "ts": rows[i]["ts"], "loop": rows[i]["loop"],
                                "outcome": rows[i]["outcome"], "sha": rows[i]["commit_sha"],
                                "item": rows[i]["item"][:140], "status": res["status"],
                                "fire_kind": res.get("fire_kind"), "blocked": res.get("blocked"),
                                "pick": res.get("pick"),
                                "secondary_status": res.get("secondary_status"),
                                "secondary_safe": res.get("secondary_safe"),
                                "reason": (res.get("reason") or "")[:200]}
                               for i, res in per_row],
                "d4_windows": [{**w, "ts": w["ts"].isoformat() if w["ts"] else None} for w in windows],
                "d4_landings": [{**l, "ts": l["ts"].isoformat() if l["ts"] else None} for l in landings]}
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump(dump, fh, indent=1, default=str)
        print(f"\nwrote {args.json}")


if __name__ == "__main__":
    main()
