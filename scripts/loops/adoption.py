#!/usr/bin/env python3
"""The adoption reading (roadmap 377.7): every channel that can show whether
anyone but the owner uses this package, each with its WINDOW and what it cannot
see. `record_metric.py --adoption` records it; an Objective grill quotes it in
its thesis section (LOOPS.md §6).

Why each reading has the shape it has, from the Slice 381 grill that asked for
this instrument and the Slice 401 grill that took the reading by hand:
- **Non-publish-day npm downloads.** In the month to 2026-09-24, 86.5% of
  `@busy-office/ui`'s 989 downloads fell on the three publish days. Every spike
  is a publish day (the registry's `time` field), so publish days are mirrors
  and bots. What is left is the reading.
- **Each reading's window.** npm's newest computed day lags about two days
  behind today. A "last-week" figure taken on a publish day reads a week that
  does not contain it.
- **Current-version downloads.** 5 of 16 in one week were the current 0.8.0.
  The rest were old versions, which usually means a crawler walking history.
- **jsDelivr hits to `dist/*`.** Every jsDelivr hit so far was a README,
  `package.json` or a script, so nobody loaded the CSS from the CDN. The total
  hides that; the `dist/` figure shows it.
- **GitHub traffic.** It was the only channel above zero, and it is
  CI-dominated: 239 of 367 clones fell on one CI-heavy day.

A channel that cannot be read is REPORTED with its error, never recorded as 0.
A zero that means "unread" would look exactly like a reading.

@exact — sums and set membership over API responses. `--self-test` exercises
the pure parts (publish-day exclusion, dist/ filtering, the owner filter); the
network is the only thing it cannot test.
"""
import json
import statistics
import subprocess
import sys
import urllib.request

PACKAGES = {"ui": "@busy-office/ui", "create-ui": "@busy-office/create-ui"}
REPO = "Busy-Office/busy-office-ui"
# The owner's own accounts. Their issues and stars are not adoption.
OWNER_LOGINS = {"ThePFMind", "Busy-Office"}

# What no channel here can see. A grill quotes these with the reading.
BLIND = [
    "docs-site readership: GitHub Pages exposes no analytics this repo can query",
    "installs through private registries or proxies, which never reach npm's counter",
    "how much of npm's non-publish count is CI, mirrors, or the first user's own "
    "registry fetch (busy-office-erp's render.py reads registry.npmjs.org)",
    "GitHub traffic beyond its fixed 14-day window, and who the unique visitors are",
    "use that vendors a copied dist/ with no network fetch at all",
]


def publish_days(time_map):
    """YYYY-MM-DD of every version publish, from a registry `time` object."""
    return {v[:10] for k, v in time_map.items() if k not in ("created", "modified")}


def non_publish(daily, pdays):
    """(sum, days, median/day) over the days NOT in `pdays`. `daily` is npm's
    range list of {day, downloads}."""
    kept = [d["downloads"] for d in daily if d["day"] not in pdays]
    return sum(kept), len(kept), (statistics.median(kept) if kept else 0)


def dist_hits(files):
    """Hits to files under /dist/ in one version's jsDelivr file stats."""
    return sum(f["hits"]["total"] for f in files if f.get("name", "").startswith("/dist/"))


def non_owner(logins):
    """Logins that are neither the owner's nor a bot's."""
    return [l for l in logins if l not in OWNER_LOGINS and not l.endswith("[bot]")]


def _get(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def _gh(*args):
    r = subprocess.run(["gh", "api", *args], capture_output=True, text=True, timeout=60)
    if r.returncode:
        raise RuntimeError(r.stderr.strip().splitlines()[-1] if r.stderr.strip() else f"gh exited {r.returncode}")
    return json.loads(r.stdout)


def readings():
    """([{name, value, unit, window, source}], [channel: error]).
    Every channel is attempted; one failing never zeroes another."""
    out, errors = [], []

    def add(name, value, unit, window, source):
        out.append({"name": name, "value": value, "unit": unit, "window": window, "source": source})

    for slug, pkg in PACKAGES.items():
        enc = pkg.replace("/", "%2F")
        try:
            meta = _get(f"https://registry.npmjs.org/{enc}")
            pdays = publish_days(meta["time"])
            rng = _get(f"https://api.npmjs.org/downloads/range/last-month/{pkg}")
            win = f"npm range {rng['start']}..{rng['end']} (npm's newest computed day)"
            total = sum(d["downloads"] for d in rng["downloads"])
            s, n, med = non_publish(rng["downloads"], pdays)
            add(f"adoption-npm-{slug}-month", total, "downloads", win, "api.npmjs.org range/last-month")
            add(f"adoption-npm-{slug}-nonpublish", s, "downloads",
                f"{win}; {n} non-publish day(s), median {med:g}/day; publish days excluded: "
                f"{', '.join(sorted(d for d in pdays if rng['start'] <= d <= rng['end'])) or 'none'}",
                "api.npmjs.org range/last-month minus registry time")
            latest = meta["dist-tags"]["latest"]
            vers = _get(f"https://api.npmjs.org/versions/{enc}/last-week")["downloads"]
            published = meta["time"].get(latest, "")[:10]
            # A current version published after npm's newest computed day reads 0
            # because the window predates it, not because nobody fetched it.
            late = f"; {latest} was published {published}, after this window ends, so it cannot show yet" \
                if published > rng["end"] else ""
            add(f"adoption-npm-{slug}-current-week", vers.get(latest, 0), "downloads",
                f"npm versions last-week (ending {rng['end']}); current {latest}; all versions {sum(vers.values())}{late}",
                "api.npmjs.org versions/last-week")
        except Exception as e:  # noqa: BLE001 — reported, never zeroed
            errors.append(f"npm {pkg}: {e}")
        try:
            stats = _get(f"https://data.jsdelivr.com/v1/stats/packages/npm/{pkg}?period=month")
            days = sorted(stats["hits"]["dates"])
            jwin = f"jsDelivr period=month {days[0]}..{days[-1]}" if days else "jsDelivr period=month"
            add(f"adoption-jsdelivr-{slug}-month", stats["hits"]["total"], "hits", jwin, "data.jsdelivr.com stats")
            dist = 0
            for v in _get(f"https://data.jsdelivr.com/v1/stats/packages/npm/{pkg}/versions?period=month"):
                if v["hits"]["total"]:
                    dist += dist_hits(_get(f"https://data.jsdelivr.com/v1/stats/packages/npm/{pkg}@{v['version']}/files?period=month"))
            add(f"adoption-jsdelivr-{slug}-dist-month", dist, "hits", f"{jwin}; files under /dist/ only",
                "data.jsdelivr.com per-version file stats")
        except Exception as e:  # noqa: BLE001
            errors.append(f"jsDelivr {pkg}: {e}")

    try:
        repo = _gh(f"repos/{REPO}")
        at = f"GitHub at read time ({repo.get('pushed_at', '?')} last push)"
        add("adoption-github-stars", repo["stargazers_count"], "count", at, "gh api repos")
        add("adoption-github-forks", repo["forks_count"], "count", at, "gh api repos")
        add("adoption-github-watchers", repo["subscribers_count"], "count", at, "gh api repos")
        items = _gh(f"repos/{REPO}/issues?state=all&per_page=100")
        issues = [i["user"]["login"] for i in items if "pull_request" not in i]
        prs = [i["user"]["login"] for i in items if "pull_request" in i]
        add("adoption-github-nonowner-issues", len(non_owner(issues)), "count",
            f"{at}; {len(issues)} issue(s) in all, newest 100 items read", "gh api issues")
        add("adoption-github-nonowner-prs", len(non_owner(prs)), "count",
            f"{at}; {len(prs)} PR(s) in all, newest 100 items read", "gh api issues")
        q = _gh("graphql", "-f", "query={repository(owner:\"%s\",name:\"%s\"){discussions{totalCount}}}" % tuple(REPO.split("/")))
        add("adoption-github-discussions", q["data"]["repository"]["discussions"]["totalCount"], "count", at, "gh api graphql")
    except Exception as e:  # noqa: BLE001
        errors.append(f"GitHub repo signals: {e}")
    try:
        for kind in ("views", "clones"):
            t = _gh(f"repos/{REPO}/traffic/{kind}")
            series = t.get(kind, [])
            span = f"{series[0]['timestamp'][:10]}..{series[-1]['timestamp'][:10]}" if series else "empty"
            peak = max(series, key=lambda x: x["count"]) if series else None
            note = f"; peak {peak['count']} on {peak['timestamp'][:10]}" if peak else ""
            add(f"adoption-github-{kind}-14d", t["count"], "count", f"GitHub traffic 14 days {span}{note}", f"gh api traffic/{kind}")
            add(f"adoption-github-{kind}-uniques-14d", t["uniques"], "count", f"GitHub traffic 14 days {span}", f"gh api traffic/{kind}")
    except Exception as e:  # noqa: BLE001
        errors.append(f"GitHub traffic (needs push access): {e}")
    return out, errors


def self_test():
    bad = []
    t = {"created": "2026-08-12T00:00:00Z", "modified": "2026-09-26T00:00:00Z",
         "0.8.0": "2026-09-06T13:40:56Z", "0.7.0": "2026-08-30T12:27:40Z"}
    if publish_days(t) != {"2026-09-06", "2026-08-30"}:
        bad.append(f"publish_days read created/modified or missed a version: {publish_days(t)}")
    daily = [{"day": "2026-08-29", "downloads": 230}, {"day": "2026-08-30", "downloads": 443},
             {"day": "2026-08-31", "downloads": 20}, {"day": "2026-09-01", "downloads": 6},
             {"day": "2026-09-06", "downloads": 182}, {"day": "2026-09-07", "downloads": 3}]
    s, n, med = non_publish(daily, {"2026-08-30", "2026-09-06"})
    if (s, n, med) != (259, 4, 13):
        bad.append(f"non_publish kept a publish day or dropped another: {(s, n, med)}")
    if non_publish(daily, set())[0] != 884:
        bad.append("non_publish with no publish days should keep every day")
    files = [{"name": "/README.md", "hits": {"total": 10}}, {"name": "/package.json", "hits": {"total": 3}},
             {"name": "/dist/css/index.min.css", "hits": {"total": 4}}, {"name": "/distinct.txt", "hits": {"total": 9}}]
    if dist_hits(files) != 4:
        bad.append(f"dist_hits counted a non-dist file (a /distinct.txt prefix trap): {dist_hits(files)}")
    if non_owner(["ThePFMind", "dependabot[bot]", "someone", "Busy-Office"]) != ["someone"]:
        bad.append("non_owner let the owner or a bot through")
    if bad:
        print("adoption --self-test FAILED:\n  " + "\n  ".join(bad), file=sys.stderr)
        return 1
    print("adoption --self-test: 5 cases behave (publish-day exclusion both ways, the /dist/ prefix, the owner and bot filter)")
    return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(self_test())
    rows, errs = readings()
    for r in rows:
        print(f"{r['name']:40} {r['value']:>8g} {r['unit']:<10} {r['window']}")
    for e in errs:
        print(f"NOT READ — {e}")
    sys.exit(1 if errs and not rows else 0)
