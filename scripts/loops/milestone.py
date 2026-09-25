#!/usr/bin/env python3
"""Milestone fields and rule M: code computes the milestone's next item
(roadmap 393.4).

A milestone is a `## Milestone Mn` section of ROADMAP.md whose FIRST fenced
block holds its fields, one `Key: value` per line. The owner edits them; the
loop never does. Text after `#` on a field line is a comment, so the
`# (O…)` hints next to an unfilled value do not read as the value.

While a milestone is ACTIVE, `dispatch_status.py` imports this and prints the
`milestone`, `rule M`, `interleave`, `skipped`, `blocked`, `direction`,
`budget` and `reconcile` lines. With no ACTIVE milestone it prints nothing and
exits as before, so its output is byte-identical to what it printed before
this file existed. A non-ACTIVE milestone's field problems are reported by
this script's own CLI, never by dispatch_status: the owner fills a DRAFT over
several edits, and nothing dispatches from it meanwhile.

Rule M (the prompt's §4, Step 2 rule 4): the oldest open numbered item tagged
`Milestone: Mn` that no owner marker, open `After:` target, held `Parked:`
line or (on a cloud wake, `--cloud`) `NEEDS-BROWSER` holds, by slice then item
number. When none is free, the open `After:` chains are walked to their ends:
- every end owner-blocked → "blocked by the owner"; the planner does not run
  and rule 4 is restricted to `Track: defect` (the ends are named);
- an end that is free (outside the milestone) → rule M dispatches the oldest
  such end, because the milestone is waiting on it;
- otherwise the milestone is stalled (parked or browser ends): rule 4 runs,
  and only when rule 4 has nothing either is it `DIRECTION GAP D1`.
`DIRECTION GAP D2` is no open milestone item while the exit item is not
closed. D3/D4 and the once-per-24h limit are 393.7's.

`Precedence: interleave 1/N track=defect`: once the log shows N-1 M1 dispatch
rows since the last defect row, the dispatch goes to the oldest dispatchable
`Track: defect` item; with none dispatchable it stays with rule M and the
count is not reset. A row's tags are its own ` · `-separated segment made only
of `milestone=Mn` / `track=defect` tokens (393.5 writes it); prose that merely
mentions a token is not a tag. `Precedence: after <id>` puts rule M below rule
4 until `<id>` closes; the pick is still printed as the fallback.

Routes (393.6): an item's `Route:` names a key of `scripts/loops/routes.json`,
hand-written from the prompt's §5 table. The table itself is checked (see
route_problems). The rule M line prints the route's loop and modes, the tier
and model it runs on, and its effort. **A tier the owner set to `none` runs on
`top`, and the line says so.** That is §5 and owner decision O14, and it
supersedes 393.6's Accept, which says such a tier is refused. What IS refused
is a tier outside the fixed set top, balanced, fast or `Planner`: a
vocabulary check on the table, not a check against the `Tiers` values.

REFUSES — exits non-zero and prints no verdict — when:
- a `Milestone` heading is malformed or duplicated, or an item is tagged with a
  milestone that has no section (these could hide an ACTIVE milestone, so they
  refuse whatever the status);
- more than one milestone is ACTIVE;
- the ACTIVE milestone has a missing, blank, unfilled (`OWNER`, `TBD`, …) or
  unknown field value, a `Precedence: after` id that resolves nowhere, or
  failing fixtures (the self-test runs on every ACTIVE read);
- the markers do not reconcile or an `After:` target does not resolve
  (generate_status.parse_roadmap);
- an item in the ACTIVE milestone is un-numbered, has no `Route:`, or has one
  not in `routes.json`; or routes.json itself is malformed;
- the `Modules` field disagrees with `examples/erp-suite/_shell.mjs` MODULES
  once 394.9 has closed.

    python3 scripts/loops/milestone.py              # fields, problems, and the verdict if ACTIVE
    python3 scripts/loops/milestone.py --simulate FILE
    python3 scripts/loops/milestone.py --compare    # rule M vs simulate_rule_m.py over the live M1 slices
    python3 scripts/loops/milestone.py --check-commit <sha>   # the planner's output contract (393.7)
    python3 scripts/loops/milestone.py --self-test

@heuristic — the verdict rests on recognising field values and markers in
prose-adjacent markdown; `--self-test` shows each refusal and each rule firing.
"""
import datetime
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_status as gs  # noqa: E402
from _common import ROOT, TAG_SEGMENT, tags_of  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROUTES = os.path.join(HERE, "routes.json")
SHELL = os.path.join(ROOT, "examples", "erp-suite", "_shell.mjs")
HOLDS = os.path.join(ROOT, ".roundtable", "hold-wakes.jsonl")
SIM = os.path.join(ROOT, ".roundtable", "milestone-m1-2026-09-25", "simulate_rule_m.py")

FIELDS = ("Status", "App", "Modules", "Devices", "Precedence", "Rules-2-3", "Dispatcher",
          "Tiers", "Planner", "Direction-drift", "Budget", "Stop")
STOPS = {"HALT", "foreign-commit", "budget", "2-wakes-no-progress-on-one-item",
         "2-wakes-plan-only", "one-way-door"}
BUDGET_KEYS = ("m0-wakes", "wakes", "agents/wake", "workflow-wall", "experimental",
               "resume-lines", "direction-items")
# 393.4's Accept: the exit item waits while any OTHER open item of this phase
# exists — Phase 2 items filed during the milestone are not in its After: list.
EXIT_ITEM = {"M1": ("397.2", "2")}
# Which item's close starts the Modules reconcile (394.9 moves the module list
# into _shell.mjs; before that the two are allowed to differ).
MODULES_FROM = {"M1": "394.9"}

PLACEHOLDER = re.compile(r"\b(?:OWNER|owner|Owner|TBD|TODO)\b|\?\?\?|___")
ANY_MS_HEAD = re.compile(r"^#{1,6}[ \t]*Milestone\b.*$", re.M)
TAG_LINE = re.compile(r"^[ \t]+Milestone: (M\d+) ", re.M)
VALID = {
    "Precedence": re.compile(r"^(preempt|interleave 1/([2-9]|[1-9]\d+) track=defect|after \d+\.\d+[a-z]?)$"),
    "Rules-2-3": re.compile(r"^(normal|scoped|suspended)$"),
    "Dispatcher": re.compile(r"^(local|local\+auditor|both)$"),
    "Planner": re.compile(r"^(top|balanced|fast)$"),
    "Direction-drift": re.compile(r"^(off|N=\d+ X=\d+)$"),
    "App": re.compile(r"^\S+ (yes|no)$"),
}


class Refuse(Exception):
    """A milestone input this code will not decide on."""


def _parts(value, sep=" · "):
    return [p.strip() for p in value.split(sep) if p.strip()]


def _date_ok(s):
    try:
        datetime.date.fromisoformat(s)
        return True
    except ValueError:
        return False


def _check_value(key, value):
    """None when the value is well formed; else the reason."""
    if key == "Status":
        m = re.match(r"^(DRAFT|ACTIVE (\S+)|PAUSED (\S+) \S.*|CLOSED (\S+))$", value)
        date = m and (m.group(2) or m.group(3) or m.group(4))
        if not m or (m.group(1) != "DRAFT" and not _date_ok(date)):
            return f"`Status: {value}` is not DRAFT, ACTIVE <date>, PAUSED <date> <reason> or CLOSED <date>"
        return None
    if key in VALID:
        return None if VALID[key].match(value) else f"`{key}: {value}` is not one of the allowed forms"
    if key == "Tiers":
        got = {}
        for p in _parts(value):
            m = re.match(r"^(top|balanced|fast)=(\S+)$", p)
            if not m:
                return f"`Tiers` part `{p}` is not `top|balanced|fast=<model>`"
            if m.group(1) in got:
                return f"`Tiers` names `{m.group(1)}` twice"
            got[m.group(1)] = m.group(2)
        if set(got) != {"top", "balanced", "fast"}:
            return "`Tiers` must name top, balanced and fast exactly once each"
        if got["top"] == "none":
            return "`Tiers: top` cannot be none"
        return None
    if key == "Budget":
        seen = set()
        for p in _parts(value):
            m = re.match(r"^(\S+) (\d+)(m?)$", p)
            if not m or m.group(1) not in BUDGET_KEYS or bool(m.group(3)) != (m.group(1) == "workflow-wall"):
                return f"`Budget` part `{p}` is not `<{'|'.join(BUDGET_KEYS)}> <n>` (workflow-wall in minutes, `<n>m`)"
            if m.group(1) in seen:
                return f"`Budget` names `{m.group(1)}` twice"
            seen.add(m.group(1))
        missing = [k for k in BUDGET_KEYS if k not in seen]
        return f"`Budget` lacks {', '.join(missing)}" if missing else None
    if key == "Stop":
        bad = [s for s in _parts(value, " | ") if s not in STOPS]
        return f"`Stop` names unknown stop(s): {', '.join(bad)}" if bad else None
    if key == "Modules":
        bad = [p for p in _parts(value) if not re.match(r"^[a-z0-9-]+=[a-z0-9-]+:\S.*$", p)]
        return f"`Modules` entries must be `<dir-id>=<facet>:<Label>`: {', '.join(bad)}" if bad else None
    if key == "Devices":
        bad = [p for p in _parts(value) if not re.match(r"^(desktop|phone|rugged-rf)( (yes|no))?$", p)]
        return f"`Devices` parts must be desktop, phone or rugged-rf (optionally yes|no): {', '.join(bad)}" if bad else None
    return f"unknown field `{key}`"


def parse_milestones(text):
    """({id: {'fields', 'problems', 'unfilled', 'status'}}, structural problems).

    A structural problem (a malformed or duplicated heading, or a tag naming no
    section) could hide an ACTIVE milestone, so every caller refuses on it. A
    field problem belongs to one milestone and only refuses while it is ACTIVE."""
    out, structural = {}, []
    heads = list(gs.MILESTONE_HEAD.finditer(text))
    parsed_at = {m.start() for m in heads}
    for h in ANY_MS_HEAD.finditer(text):
        if h.start() not in parsed_at:
            structural.append(f"heading `{h.group(0).strip()}` is not `## Milestone Mn — …`")
    for m in heads:
        mid = m.group(1)
        if mid in out:
            structural.append(f"`## Milestone {mid}` appears twice")
            continue
        rest = text[m.end():]
        stop = re.search(r"^## ", rest, re.M)
        sect = rest[: stop.start()] if stop else rest
        fence = re.search(r"^```\n(.*?)^```", sect, re.M | re.S)
        fields, problems, unfilled = {}, [], []
        if not fence:
            problems.append(f"`## Milestone {mid}` has no fenced field block")
        else:
            for line in fence.group(1).splitlines():
                line = line.split("#", 1)[0].rstrip()
                if not line.strip():
                    continue
                km = re.match(r"^([A-Za-z0-9-]+):\s*(.*)$", line)
                if not km:
                    problems.append(f"`{line.strip()}` is not a `Key: value` line")
                    continue
                key, value = km.group(1), km.group(2).strip()
                if key in fields:
                    problems.append(f"`{key}` appears twice")
                fields[key] = value
            for key in FIELDS:
                if key not in fields:
                    problems.append(f"`{key}` is missing")
            for key, value in fields.items():
                if key not in FIELDS:
                    problems.append(f"unknown field `{key}`")
                elif not value:
                    problems.append(f"`{key}` is blank")
                elif PLACEHOLDER.search(value):
                    unfilled.append(key)
                else:
                    why = _check_value(key, value)
                    if why:
                        problems.append(why)
        status = fields.get("Status", "").split(" ")[0].upper()
        out[mid] = {"fields": fields, "problems": problems, "unfilled": unfilled, "status": status}
    orphans = sorted({t for t in TAG_LINE.findall(text) if t not in out})
    if orphans:
        structural.append(f"items are tagged with milestone(s) that have no `## Milestone` section: {', '.join(orphans)}")
    return out, structural


def budget_of(fields):
    b = {}
    for p in _parts(fields.get("Budget", "")):
        m = re.match(r"^(\S+) (\d+)m?$", p)
        if m:
            b[m.group(1)] = int(m.group(2))
    return b


def row_tags(item_text):
    """The tags of a loop-log row, from the text after its mode field (what
    dispatch_status.rows() keeps): the segment just before the outcome, and only
    when it is made of known `key=value` tokens alone — the same reading as
    _common.parse_log_line (393.5). Prose that MENTIONS a token, or a tag-shaped
    segment anywhere else in the item, is not a tag. Keys are the mirror's
    column names (milestone, track, route, tier, model, agent, skill, first_try,
    trigger), plus `defect` as a bool."""
    segs = [s.strip() for s in item_text.split(" · ")]
    tags = tags_of(segs[-3]) if len(segs) >= 4 and TAG_SEGMENT.match(segs[-3]) else tags_of("")
    tags["defect"] = tags["track"] == "defect"
    return tags


def row_subject(item_text):
    """The item id a row leads with (`393.7 — …`), or ''."""
    m = re.match(r"\s*(\d+\.\d+[a-z]?)\b", item_text)
    return m.group(1) if m else ""


def row_outcome(item_text):
    segs = [s.strip() for s in item_text.split(" · ")]
    return segs[-2] if len(segs) >= 2 else ""


def m1_rows_since_defect(rows, mid):
    """`milestone=<mid>` dispatch rows since the last defect row. Untagged rows
    and Meta (refusal) rows are neither, so they neither count nor reset."""
    k = 0
    for r in reversed(rows):
        if r["loop"] == "Meta":
            continue
        t = row_tags(r["item"])
        if t["defect"]:
            break
        if t["milestone"] == mid and t["route"] != "planner":
            k += 1   # a planner run is not a milestone dispatch for the interleave
    return k


def wakes_used(rows, mid, since):
    """Distinct dispatch WAKES tagged `milestone=<mid>` on or after the ACTIVE
    date: one wake may record several rows (same minute, same commit)."""
    seen = set()
    for r in rows:
        if r["loop"] == "Meta" or row_tags(r["item"])["milestone"] != mid:
            continue
        if since and r["at"][:10] < since:
            continue
        sha = r["item"].rsplit(" · ", 1)[-1].strip()
        seen.add((r["at"], sha))
    return len(seen)


def load_routes(path=ROUTES):
    """routes.json's `routes` table, or None when the file does not exist. Any
    JSON, shape or duplicate-key problem is a Refuse, never a traceback: a
    traceback loses the whole dispatch report (393.6's verification)."""
    if not os.path.exists(path):
        return None

    def no_dupes(pairs):
        keys = [k for k, _ in pairs]
        dup = sorted({k for k in keys if keys.count(k) > 1})
        if dup:
            raise Refuse(f"routes.json names {', '.join(dup)} twice")
        return dict(pairs)
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f, object_pairs_hook=no_dupes)
        table = data["routes"]
    except (ValueError, KeyError, TypeError) as e:
        raise Refuse(f"routes.json is not a readable route table: {e!r}")
    if not isinstance(table, dict):
        raise Refuse("routes.json's `routes` is not a table")
    return table


TIERS = ("top", "balanced", "fast")
ROUTE_FIELDS = ("loop", "mode", "tier", "effort", "skills", "critic", "returns", "never", "handup")


def route_problems(table):
    """Malformed entries in a routes table (393.6). Every route id has the shape
    the `Route:` marker and the `route=` tag need. Every dispatched route names:
    a recorded loop (or none, for read-only gathering that records no row), its
    modes, a tier among top, balanced, fast or `Planner` (the field), a
    non-empty effort and critic, a list of skills, and a hand-up whose chain
    ends at the planner or the owner."""
    import record_iteration
    from _common import TAG_VALUES
    out = []
    for rid, r in table.items():
        if not re.fullmatch(TAG_VALUES["route"], rid):
            out.append(f"route id {rid!r} is not `[a-z][a-z0-9-]*`")
        if not isinstance(r, dict):
            out.append(f"route {rid} is not a table")
            continue
        missing = [f for f in ROUTE_FIELDS if f not in r]
        if missing:
            out.append(f"route {rid} lacks {', '.join(missing)}")
            continue
        if rid == "owner":
            continue
        if not isinstance(r["mode"], list) or not all(isinstance(m, str) and re.fullmatch(r"[\w-]+", m) for m in r["mode"]):
            out.append(f"route {rid}'s mode must be a list of `[\\w-]+` words")
        elif r["loop"] is None and r["mode"]:
            out.append(f"route {rid} names modes but no loop")
        elif r["loop"] is not None and (r["loop"] not in record_iteration.LOOPS or not r["mode"]):
            out.append(f"route {rid}'s loop {r['loop']!r} is not a recorded loop with at least one mode")
        if r["tier"] not in TIERS + ("Planner",):
            out.append(f"route {rid}'s tier {r['tier']!r} is not top, balanced, fast or Planner")
        for f in ("effort", "critic"):
            if not isinstance(r[f], str) or not r[f].strip():
                out.append(f"route {rid}'s {f} is empty")
        if not isinstance(r["skills"], list) or not r["skills"]:
            out.append(f"route {rid} names no skills")
        seen, cur = [rid], r["handup"]
        while cur not in ("planner", "owner"):
            if cur not in table or cur in seen:
                out.append(f"route {rid}'s hand-up chain {' → '.join(seen + [str(cur)])} does not reach the planner or the owner")
                break
            seen.append(cur)
            cur = table[cur].get("handup")
    return out


def tiers_of(fields):
    return dict(p.split("=", 1) for p in _parts(fields.get("Tiers", "")) if "=" in p)


def route_model(table, rid, fields):
    """(tier, model, note) a route runs on under this milestone's `Tiers`. A
    tier the owner set to `none` runs on `top` — the prompt's §5 and owner
    decision O14, which supersede the Accept's "refuses" for that case. The
    table check has already confined the tier to top/balanced/fast/Planner, and
    `Tiers` must name all three, so the lookup below cannot miss."""
    tier = table[rid]["tier"]
    if tier == "Planner":
        tier = fields["Planner"]
    tiers = tiers_of(fields)
    assert tier in tiers, (rid, tier)
    if tiers[tier] == "none":
        return "top", tiers["top"], f" (tier {tier} is none → top)"
    return tier, tiers[tier], ""


def shell_module_ids(path=SHELL):
    """MODULES ids from _shell.mjs, reconciled against a raw count of its
    entries so a quote-style change cannot drop one silently."""
    src = open(path, encoding="utf-8").read()
    block = re.search(r"export const MODULES = \[(.*?)\n\];", src, re.S)
    if not block:
        raise Refuse(f"cannot find `export const MODULES = [...]` in {path}")
    live = "\n".join(l for l in block.group(1).splitlines() if not l.strip().startswith("//"))
    entries = len(re.findall(r"^\s*\{", live, re.M))
    ids = re.findall(r"\bid:\s*['\"]([^'\"]+)['\"]", live)
    if len(ids) != entries:
        raise Refuse(f"_shell.mjs MODULES has {entries} entries but {len(ids)} ids parsed")
    return set(ids)


def _active_date(fields):
    m = re.match(r"^ACTIVE (\S+)$", fields.get("Status", ""))
    return m.group(1) if m else ""


# --- the item lint (393.7): tier 0, code only ---------------------------------
# An instrument is how the Accept will be checked: a backticked command, file,
# selector or gate (not a quoted marker line), or a measuring verb as a whole
# word. Generic stems (`run`, `check`, `test`, `count…`, `diff…`) matched 73-98%
# of random windows of prose, so they are not instruments (393.7's verification).
# Measured on history before shipping, and weak there — see 393.7's DONE note —
# so it gates only milestone picks and planner output.
INSTRUMENT = re.compile(
    r"`(?!(?:Milestone|Route|After|Parked|Track|Status):)[^`\n]+`"
    r"|\b(?:measured?|measures|measuring|counted|grep|replay(?:ed|s)?|red-prove[sd]?|red-proof|"
    r"screenshots?|asserts?|asserted|numstat|self-test|axe|npm run|npm test|claims? case|quote[sd]?)\b"
    r"|\bcheck:[a-z][a-z-]+")
# The Accept is a LABEL at the start of a line or of a sentence — `**Accept —`,
# `- **Accept:**`, `*Accept*:`, `Accept:` — never the word inside a title or a
# quotation ("Accept, refuse or rethink", "… no Accept.").
ACCEPT_LABEL = re.compile(r"(?m)(?:^[ \t]*(?:[-*][ \t]+)?|[.;][ \t]+)\*{0,2}Accept\b\*{0,2}[ \t]*(?:—|:)")
MARKER_LINE = re.compile(r"^[ \t]*(?:After|Parked|Milestone|Route|Track):", re.I)


def accept_block(body, start):
    """The Accept block from its label to the end of its own bullet or sub-list:
    the first later line at or left of the label line's indent that starts a
    bullet or a marker ends it."""
    lines = body[start:].split("\n")
    line_start = body.rfind("\n", 0, start) + 1
    indent = len(body[line_start:start]) - len(body[line_start:start].lstrip())
    out = [lines[0]]
    for line in lines[1:]:
        if line.strip():
            ind = len(line) - len(line.lstrip())
            if ind <= indent and (line.lstrip().startswith(("- ", "* ")) or MARKER_LINE.match(line)):
                break
        out.append(line)
    return "\n".join(out)


def common_accept(text, slice_id, item_id=""):
    """A slice preamble's `common Accept` paragraph, which module items inherit
    ("the slice's common Accept holds") — empty for an id the preamble says it
    does not apply to."""
    sec = re.search(rf"^## Slice {re.escape(str(slice_id))}\b.*?(?=^\d+\.\s*\[|^## )", text, re.M | re.S)
    ca = re.search(r"common Accept.*", sec.group(0), re.S) if sec else None
    if not ca:
        return ""
    excl = re.search(r"does not apply to (.*?)\.(?:\s|$)", ca.group(0), re.S)   # ids carry dots
    if item_id and excl and re.search(rf"(?<![\d.]){re.escape(item_id)}(?![\d])", excl.group(1)):
        return ""
    return ca.group(0)


def item_lint(item, text="", routes=None, require_route=False):
    """Why an item is not executable as written, or []: no Accept label; an
    Accept block naming no instrument (an inherited common Accept counts); and,
    when a route is required, a missing or unknown `Route:`."""
    body = item["body"]
    m = ACCEPT_LABEL.search(body)
    reasons = []
    if not m:
        reasons.append("no Accept")
    else:
        acc = accept_block(body, m.start())
        if re.search(r"common Accept holds", acc):
            acc += " " + common_accept(text, item["slice"], item.get("id", ""))
        if not INSTRUMENT.search(acc):
            reasons.append("its Accept names no instrument")
    if require_route:
        if not item["route"]:
            reasons.append("no Route:")
        elif routes is not None and item["route"] not in routes:
            reasons.append(f"Route: {item['route']} is not in routes.json")
    return reasons


def check_planner_commit(sha, routes="load", cap=None, milestone_only=False):
    """The planner's output contract (393.7, the prompt's §7), on the ROADMAP.md
    a commit writes: every item it ADDS or CHANGES must carry an Accept naming
    an instrument and a `Route:` in routes.json; every `After:` must resolve; an
    added item must be numbered and its id not already open; and a direction
    review adds at most `cap` items. `milestone_only` limits it to items tagged
    with a milestone — the check a non-planner Roadmap row gets while a
    milestone is ACTIVE. Returns the problems."""
    import subprocess

    def show(rev, path):
        out = subprocess.run(["git", "-C", ROOT, "show", f"{rev}:{path}"], capture_output=True, text=True)
        return out.stdout if out.returncode == 0 else None
    new, old = show(sha, "ROADMAP.md"), show(f"{sha}^", "ROADMAP.md")
    if new is None or old is None:
        return [f"cannot read ROADMAP.md at {sha} and its parent"]
    try:
        items = gs.parse_roadmap(new, show(sha, "ROADMAP-archive.md") or "")
    except SystemExit as e:
        return [f"ROADMAP.md at {sha} does not parse: {e}"]
    if routes == "load":
        routes = load_routes()
    return added_item_problems(items, new, old, routes, cap=cap, milestone_only=milestone_only)


def added_item_problems(items, new_text, old_text, routes, cap=None, milestone_only=False):
    """The contract over what `new_text` adds to or changes in `old_text`."""
    try:
        old_items = {it["id"]: it["body"] for it in gs.parse_roadmap(old_text) if it["id"]}
    except SystemExit:
        old_items = {}
    before = gs.all_item_ids(old_text)
    problems, added = [], 0
    ids = [it["id"] for it in items if it["id"]]
    for dup in sorted({i for i in ids if ids.count(i) > 1}):
        problems.append(f"{dup}: two open items share this id")
    old_named = {it["title"] for it in gs.parse_roadmap(old_text) if not it["id"]} if old_items else set()
    for it in items:
        if milestone_only and not it["milestone"]:
            continue
        if not it["id"]:
            if it["title"] not in old_named:
                problems.append(f"{it['title'][:40]}: an added item needs a number")
            continue
        is_new = it["id"] not in before
        changed = it["id"] in old_items and old_items[it["id"]] != it["body"]
        if not (is_new or changed):
            continue
        added += is_new
        problems += [f"{it['id']}: {r}" for r in item_lint(it, new_text, routes, require_route=True)]
    if cap is not None and added > cap:
        problems.append(f"the review adds {added} items; `direction-items` allows {cap}")
    return problems


def verdict(text, archive_text="", rows=(), cloud=False, routes="load", hold_count=None,
            shell_ids=None, now=None):
    """The dispatch verdict for the ACTIVE milestone, as a dict, or None when no
    milestone is ACTIVE. Raises Refuse on any input it will not decide on."""
    ms, structural = parse_milestones(text)
    if structural:
        raise Refuse("; ".join(structural))
    active = [mid for mid, m in ms.items() if m["status"] == "ACTIVE"]
    if len(active) > 1:
        raise Refuse(f"{len(active)} milestones are ACTIVE ({', '.join(active)}); one at a time")
    if not active:
        return None
    mid = active[0]
    m = ms[mid]
    bad = [f"{mid}: {p}" for p in m["problems"]]
    if m["unfilled"]:
        bad.append(f"{mid} is ACTIVE with unfilled field(s): {', '.join(m['unfilled'])}")
    if bad:
        raise Refuse("; ".join(bad))
    try:
        items = gs.parse_roadmap(text, archive_text)
    except SystemExit as e:
        raise Refuse(str(e))

    if routes == "load":
        routes = load_routes()
    mine = [it for it in items if it["milestone"] == mid]
    unnumbered = [it["title"][:40] for it in mine if not it["id"]]
    if unnumbered:
        raise Refuse(f"un-numbered {mid} item(s) have no age to rank by: {'; '.join(unnumbered)}")
    if routes is None:
        raise Refuse(f"{mid} is ACTIVE and scripts/loops/routes.json does not exist (393.6 writes it)")
    if isinstance(routes, dict):
        bad = route_problems(routes)
        if bad:
            raise Refuse("routes.json: " + "; ".join(bad))
    no_route = [it["id"] for it in mine if not it["route"]]
    bad_route = [f"{it['id']} ({it['route']})" for it in mine if it["route"] and it["route"] not in routes]
    if no_route or bad_route:
        raise Refuse("; ".join(filter(None, [
            f"open {mid} item(s) with no `Route:`: {', '.join(no_route)}" if no_route else "",
            f"open {mid} item(s) with a route not in routes.json: {', '.join(bad_route)}" if bad_route else "",
        ])))

    ids = gs.all_item_ids(archive_text)
    ids.update({k: v for k, v in gs.all_item_ids(text).items() if ids.get(k) != "open"})
    prec = m["fields"]["Precedence"]
    gate_id = prec.split(" ", 1)[1] if prec.startswith("after ") else None
    if gate_id and gate_id not in ids:
        raise Refuse(f"`Precedence: after {gate_id}` names no item in ROADMAP.md or ROADMAP-archive.md")

    modules = "pending " + MODULES_FROM.get(mid, "-")
    gate = MODULES_FROM.get(mid)
    if gate and ids.get(gate) == "closed":
        want = {p.split("=", 1)[0] for p in _parts(m["fields"]["Modules"])}
        have = shell_ids if shell_ids is not None else shell_module_ids()
        if want != have:
            raise Refuse(f"`Modules` names {sorted(want)} but _shell.mjs MODULES holds {sorted(have)}")
        modules = f"ok ({len(want)} = _shell.mjs MODULES)"

    byid = {it["id"]: it for it in items if it["id"]}
    exit_id, exit_phase = EXIT_ITEM.get(mid, (None, None))
    # The item lint (393.7), cached, and the items whose one sharpen bounce is
    # spent: a sharpen row's item text leads with the id it sharpened.
    lint_cache = {}

    def lint_of(it):
        if it["id"] not in lint_cache:
            lint_cache[it["id"]] = item_lint(it, text)
        return lint_cache[it["id"]]
    bounced = {row_subject(r["item"]) for r in rows
               if r["loop"] != "Meta" and row_tags(r["item"])["trigger"] == "sharpen"}
    other_phase = [it["id"] for it in mine if it["phase"] == exit_phase and it["id"] != exit_id]

    def hold_of(it):
        k = gs.blocked_kind(it)
        if k:
            return k
        if cloud and it["browser"]:
            return "browser"
        if it["id"] == exit_id and other_phase:
            return "dependency"
        if it["milestone"] == mid and it["id"] in bounced and lint_of(it):
            return "owner"   # failed the lint after its one sharpen (§7): the owner decides
        return ""

    def waits_on(it):
        return list(it["after_open"]) + (other_phase if it["id"] == exit_id else [])

    def ends(it, seen=None):
        """The open items at the far end of `it`'s dependency chains."""
        seen = seen if seen is not None else set()
        if it["id"] in seen:
            return set()
        seen.add(it["id"])
        if hold_of(it) != "dependency" or it["owner"]:
            return {it["id"]}
        out = set()
        for t in waits_on(it):
            out |= ends(byid[t], seen) if t in byid else set()
        return out

    by_age = lambda lst: sorted(lst, key=lambda it: gs._id_key(it["id"]))  # noqa: E731
    free = by_age([it for it in mine if not hold_of(it)])
    pick = free[0] if free else None
    held = {k: [it["id"] + (" (lint, after its one sharpen)" if k == "owner" and not it["owner"] else "")
                for it in by_age(mine) if hold_of(it) == k]
            for k in ("owner", "dependency", "parked", "browser")}
    outside = by_age([it for it in items if it["id"] and it["milestone"] != mid and not hold_of(it)])

    lines = {}
    dispatch, reason, rule4, direction = pick, "the oldest dispatchable item", None, "ok"
    if not mine:
        exit_closed = ids.get(exit_id) == "closed"
        direction = (f"{mid}'s exit item {exit_id} is closed and no item is open — the owner decides CLOSED"
                     if exit_closed else f"DIRECTION GAP D2 — {mid} has no open items")
        rule4 = outside[0] if outside else None
    elif pick is None:
        terminal = set()
        for it in mine:
            terminal |= ends(it)
        term = by_age([byid[t] for t in terminal if t in byid])
        owner_ends = [t for t in term if hold_of(t) == "owner"]
        free_ends = [t for t in term if not hold_of(t)]
        if free_ends:
            dispatch, reason = free_ends[0], (f"{mid} waits on it: every {mid} item is held, and this "
                                             f"chain end is free")
        elif term and len(owner_ends) == len(term):
            direction = (f"blocked by the owner — every open {mid} item waits on an owner decision: "
                         f"{', '.join(t['id'] for t in owner_ends)}; rule D does not run, and rule 4 is "
                         "restricted to Track: defect")
            defects = [it for it in outside if it["track"] == "defect"]
            rule4 = defects[0] if defects else None
        else:
            stalled = [f"{t['id']} ({hold_of(t) or 'held'})" for t in term if hold_of(t) != "owner"]
            rule4 = outside[0] if outside else None
            direction = (f"stalled on {', '.join(stalled)} — rule 4 runs" if rule4 else
                         f"DIRECTION GAP D1 — nothing is dispatchable: {mid} is stalled on "
                         f"{', '.join(stalled)} and rule 4 has no item")

    if gate_id and ids.get(gate_id) != "closed":
        rule4 = outside[0] if outside else None
        lines["interleave"] = f"off (Precedence: after {gate_id}, still open)"
        if dispatch:
            reason = f"below rule 4 until {gate_id} closes — the fallback when rule 4 has nothing"
        if direction.startswith("DIRECTION GAP") and rule4:
            direction = f"ok — rule 4 runs first under Precedence: after {gate_id}"
    elif prec.startswith("interleave"):
        n = int(re.search(r"1/(\d+)", prec).group(1))
        k = m1_rows_since_defect(rows, mid)
        defects = by_age([it for it in items if it["track"] == "defect" and it["id"] and not hold_of(it)])
        if k >= n - 1 and defects and dispatch is not None:
            dispatch, reason = defects[0], f"interleave: {k} {mid} dispatch row(s) since the last defect row"
            lines["interleave"] = f"{k}/{n - 1} → this dispatch goes to defect {defects[0]['id']}"
        elif k >= n - 1 and dispatch is not None:
            lines["interleave"] = (f"{k}/{n - 1} → due, but no Track: defect item is dispatchable; "
                                   "rule M keeps it, count not reset")
        else:
            lines["interleave"] = f"{k}/{n - 1} {mid} dispatch row(s) since the last defect row → rule M"
    else:
        lines["interleave"] = "off (Precedence: preempt)"

    bud = budget_of(m["fields"])
    stops = set(_parts(m["fields"]["Stop"], " | "))
    used = wakes_used(rows, mid, _active_date(m["fields"]))
    holds = hold_count if hold_count is not None else _count_holds()
    over = "budget" in stops and "wakes" in bud and used >= bud["wakes"]
    if over:
        dispatch, reason, rule4 = None, f"STOP (budget): {used} of {bud['wakes']} {mid} wakes used", None

    # --- rule D (393.7): the triggers, in precedence order, then the limits ---
    # The 24 h window compares naive local stamps, which is sound while one
    # dispatcher writes the log (`Dispatcher: local`, owner decision O1); a
    # second clock would need the writer offset LOOPS.md Step 0c describes.
    rule_d, notes = None, []
    gate_open = bool(gate_id and ids.get(gate_id) != "closed")
    diverted = bool(dispatch and pick and dispatch["id"] != pick["id"] and dispatch.get("track") == "defect")
    chain_end = bool(dispatch and pick is None)
    if not over and not (gate_open and rule4):
        now_ = now or datetime.datetime.now()
        tagged = [(r, row_tags(r["item"])) for r in rows if r["loop"] != "Meta"]

        def planning(r, t):
            return t["route"] == "planner" or (r["loop"] == "Roadmap" and r.get("mode") in ("plan", "direction"))
        firing = []
        if pick and dispatch is pick and lint_of(pick):
            # Never dispatched while it fails; one bounce, then it is held for the owner (hold_of).
            firing.append(("sharpen", f"{pick['id']} fails the item lint: {'; '.join(lint_of(pick))}", pick))
        if direction.startswith("DIRECTION GAP D2"):
            firing.append(("D2", direction.split(" — ", 1)[-1], None))
        if direction.startswith("DIRECTION GAP D1"):
            firing.append(("D1", direction.split(" — ", 1)[-1], None))
        owner_blocked = direction.startswith("blocked by the owner")
        mine_rows = [(r, t) for r, t in tagged if t["milestone"] == mid]
        if not (owner_blocked or chain_end or diverted):
            # §7: "if M1's open items are all owner- or dependency-blocked, the
            # planner does not run"; a chain end or a defect interleave is progress.
            execs = [r for r, t in mine_rows if not planning(r, t)][-3:]
            if len(execs) == 3 and sum(row_outcome(r["item"]) in ("triaged", "logged") for r in execs) >= 2:
                firing.append(("D3", f"2 or more of the last 3 {mid} executor rows ended triaged or logged", None))
            else:
                picks = [(r, t) for r, t in mine_rows][-3:]
                if len(picks) == 3 and sum(t["trigger"] == "sharpen" for _, t in picks) >= 2:
                    firing.append(("D3", f"2 or more of the last 3 {mid} picks failed the item lint", None))
            dm = re.match(r"^N=(\d+) X=(\d+)$", m["fields"].get("Direction-drift", "off"))
            if dm:
                landed = [r for r, t in mine_rows if not planning(r, t) and row_outcome(r["item"]) == "landed"]
                share, why = framework_share(landed, int(dm.group(1)))
                if share is None:
                    notes.append(f"D4 could not be computed: {why}")
                elif share * 100 < int(dm.group(2)):
                    firing.append(("D4", f"framework-path share {share:.0%} of the last {dm.group(1)} landings "
                                         f"is below {dm.group(2)}%", None))

        def last_of(trigger):
            return next((r for r, t in reversed(tagged) if t["trigger"] == trigger), None)
        for trig, why, subject in firing:
            if trig != "sharpen":
                last = last_of(trig)
                if trig == "D1" and last is not None and row_outcome(last["item"]) == "logged":
                    later = [r for r, t in tagged if r["at"] > last["at"] and t["milestone"] == mid and not planning(r, t)]
                    if not later:
                        notes.append(f"the last D1 review ({last['at']}) filed nothing, so this one falls through "
                                     "to rules 5-8")
                        continue
                if last is not None and now_ - datetime.datetime.strptime(last["at"], "%Y-%m-%d %H:%M") < datetime.timedelta(hours=24):
                    notes.append(f"{trig} was reviewed at {last['at']}: once per 24 h")
                    continue
            rule_d = {"trigger": trig, "why": why, "item": subject}
            break
        # A wake is plan-only when every row it wrote is a planner row; the stop
        # needs two such wakes in a row (a Roadmap triage row is not a planner run).
        wakes = []
        for r, t in tagged:
            key = (r["at"], r["item"].rsplit(" · ", 1)[-1])
            if wakes and wakes[-1][0] == key:
                wakes[-1][1] = wakes[-1][1] and t["route"] == "planner"
            else:
                wakes.append([key, t["route"] == "planner"])
        if "2-wakes-plan-only" in stops and len(wakes) >= 2 and wakes[-1][1] and wakes[-2][1]:
            rule_d = None
            dispatch, reason = None, "STOP (2-wakes-plan-only): the last two wakes only planned — halt with a PushNotification"
            over = True
            notes.append("rule D does not run at the plan-only stop")
        elif rule_d:
            if rule_d["trigger"] == "sharpen":
                direction = (f"DIRECTION GAP sharpen — {rule_d['why']}; the planner sharpens it this wake, "
                             "it is not dispatched")
            else:
                direction = f"DIRECTION GAP {rule_d['trigger']} — {rule_d['why']}"
            if dispatch is not None:
                reason = f"held: rule D ({rule_d['trigger']}) takes this wake"
                dispatch = None
    # Printed contract: `DIRECTION GAP` means "run the planner now", so a gap
    # rule D does not act on this wake is never printed as one (393.7's verification).
    if rule_d is None and direction.startswith("DIRECTION GAP"):
        direction = "held — " + direction[len("DIRECTION GAP "):]
    if notes:
        direction += " · " + " · ".join(notes)

    if dispatch:
        if not dispatch["route"]:
            route = "no Route: — rule 4's playbook, Continue build"
        elif isinstance(routes, dict) and dispatch["route"] not in routes:
            raise Refuse(f"the dispatched item {dispatch['id']} names route {dispatch['route']!r}, "
                         "which is not in routes.json")
        elif isinstance(routes, dict) and dispatch["route"] != "owner":
            tier, model, note = route_model(routes, dispatch["route"], m["fields"])
            r = routes[dispatch["route"]]
            how = f"{r['loop']} {'|'.join(r['mode'])}" if r["loop"] else "read-only gathering"
            route = f"route {dispatch['route']} · {how} · {tier} → {model}{note} · effort {r['effort']}"
        else:
            route = f"route {dispatch['route']}"
        rule_m = f"{dispatch['id']} — {dispatch['title']} [{route}] ({reason})"
    elif over:
        rule_m = f"none — {reason}"
    elif rule_d:
        rule_m = (f"none — rule D ({rule_d['trigger']}) runs the planner route this wake"
                  + (f" on {rule_d['item']['id']}" if rule_d["item"] else ""))
    else:
        rule_m = "none — see direction" + (f"; rule 4 then: {rule4['id']}" if rule4 else "")
    wake_item = dispatch["id"] if dispatch and not (gate_id and ids.get(gate_id) != "closed") else (
        rule4["id"] if rule4 else None)
    skipped = next((it for it in outside if it["id"] != wake_item), None)

    raw = {k: 0 for k in gs.MARKER_KINDS}
    for mm in gs.MARKER_RAW.finditer(text):
        raw[mm.group(1).capitalize()] += 1

    lines.update({
        "milestone": f"{mid} {m['fields']['Status']} · {len(mine)} open · {len(free)} dispatchable",
        "rule M": rule_m,
        "skipped": f"{skipped['id']} — {skipped['title']}" if skipped else "none",
        "blocked": " · ".join(f"{k}: {' '.join(v)}" for k, v in held.items() if v) or "none",
        "direction": direction,
        "budget": " · ".join([f"wakes {used}/{bud.get('wakes', '?')}" + ("" if "budget" in stops else " (no budget stop)"),
                              f"hold-wakes {holds}"]
                             + [f"{k} {bud[k]}{'m' if k == 'workflow-wall' else ''}"
                                for k in BUDGET_KEYS if k in bud and k != "wakes"]),
        "reconcile": ("markers " + " ".join(f"{k}={raw[k]}" for k in gs.MARKER_KINDS)
                      + " parsed = raw · After targets resolve · modules " + modules),
    })
    return {"milestone": mid, "dispatch": dispatch, "pick": pick, "rule4": rule4,
            "lines": lines, "direction": direction, "rule_d": rule_d}


def framework_share(landed_rows, n):
    """(share, why): lines under packages/core/src over all lines changed across
    the commits of the last `n` landed executor rows. (None, why) when it cannot
    be computed — fewer than `n` landings, or a sha that does not resolve — and
    the caller says so rather than going quiet (393.7's verification)."""
    import subprocess
    shas = [r["item"].rsplit(" · ", 1)[-1].strip() for r in landed_rows][-n:]
    if len(shas) < n:
        return None, f"only {len(shas)} landed row(s), fewer than N={n}"
    total = fw = 0
    for sha in shas:
        out = subprocess.run(["git", "-C", ROOT, "show", "--numstat", "--format=", f"{sha}^{{commit}}"],
                             capture_output=True, text=True)
        if out.returncode != 0:
            return None, f"commit {sha} does not resolve"
        for line in out.stdout.splitlines():
            parts = line.split("\t")
            if len(parts) == 3 and parts[0].isdigit():
                n_ = int(parts[0]) + int(parts[1])
                total += n_
                fw += n_ if parts[2].startswith("packages/core/src/") else 0
    return (fw / total, "") if total else (None, "the landings changed no lines")


def _count_holds():
    try:
        with open(HOLDS, encoding="utf-8") as f:
            return sum(1 for line in f if line.strip())
    except FileNotFoundError:
        return 0


ORDER = ("milestone", "rule M", "interleave", "skipped", "blocked", "direction", "budget", "reconcile")


def status_lines(rows=(), cloud=False):
    """The lines dispatch_status.py prints; [] when no milestone is ACTIVE.
    While one is ACTIVE the fixtures run first, the way rebuild_from_log.py
    runs its parser's self-test on every rebuild: a verdict from code whose own
    fixtures fail is not given."""
    text = gs._read(gs.ROADMAP)
    ms, structural = parse_milestones(text)
    if structural:
        raise Refuse("; ".join(structural))
    if not any(m["status"] == "ACTIVE" for m in ms.values()):
        return []
    failed = _fixtures()
    if failed:
        raise Refuse("milestone.py's own fixtures fail: " + "; ".join(failed))
    v = verdict(text, gs._read(gs.ARCHIVE), rows=rows, cloud=cloud)
    return [f"  {k:<13} {v['lines'][k]}" for k in ORDER]


# --- simulation: rule M run to exhaustion, for comparing with simulate_rule_m.py

def simulate(text, routes, keep_open=("394.16",)):
    """Dispatch order when every dispatched item closes in one dispatch, and the
    owner closes each owner-routed item as soon as its own After: targets have
    closed (simulate_rule_m.py's policy), with Status forced ACTIVE and
    Precedence forced preempt — the comparison is of rule M alone."""
    text = re.sub(r"^Status: .*$", "Status: ACTIVE 2026-09-25", text, count=1, flags=re.M)
    text = re.sub(r"^Precedence: .*$", "Precedence: preempt", text, count=1, flags=re.M)
    text = re.sub(r"^([A-Za-z][\w-]*: )(.*)$",
                  lambda mm: mm.group(1) + _filled(mm.group(1)) if PLACEHOLDER.search(mm.group(2).split("#")[0])
                  else mm.group(0), text, flags=re.M)
    order = []
    for _ in range(500):
        items = gs.parse_roadmap(text)
        closed_now = False
        for it in items:
            # the owner closes an owner-blocked item once it is ready — routed to the
            # owner, or held by an owner marker in its prose (389.6's BLOCKED ON)
            if (it["route"] == "owner" or it["owner"]) and it["id"] not in keep_open and not it["after_open"]:
                text = _close(text, it["id"])
                order.append(f"({it['id']})")
                closed_now = True
        if closed_now:
            continue
        v = verdict(text, routes=routes, hold_count=0, shell_ids={"home"})
        if v and v.get("rule_d") and v["rule_d"]["trigger"] == "sharpen":
            # The planner sharpens the pick (393.7); model it as fixed, marked <id>.
            iid = v["rule_d"]["item"]["id"]
            order.append(f"<{iid}>")
            text = _sharpen(text, iid)
            continue
        if not v or not v["dispatch"]:
            break
        order.append(v["dispatch"]["id"])
        text = _close(text, v["dispatch"]["id"])
    return order


def _filled(key):
    return {
        "App: ": "busy-office-erp yes", "Modules: ": "home=home:Home",
        "Devices: ": "desktop · phone", "Tiers: ": "top=opus · balanced=none · fast=none",
        "Budget: ": "m0-wakes 12 · wakes 999 · agents/wake 8 · workflow-wall 90m · experimental 2 · resume-lines 120 · direction-items 5",
    }.get(key, "x")


def _sharpen(text, iid):
    """Append an Accept that names an instrument to item `iid`'s body."""
    heads = {m.start(): m for m in gs.ITEM.finditer(text)}
    for st, en in gs.item_spans(text):
        m = heads.get(st)
        if m and f"{m.group(1)}{m.group(2) or ''}" == iid:
            body = text[st:en].rstrip("\n")
            return text[:st] + body + "\n       - **Accept:** `sharpened-by-the-planner` passes.\n\n" + text[en:].lstrip("\n")
    raise Refuse(f"simulate: could not sharpen {iid}")


def _close(text, iid):
    rx = re.compile(r"^(\d+\.\s*)\[ \](\s*\*\*" + gs.PREFIX + re.escape(iid) + r"\b)", re.M)
    new, n = rx.subn(r"\1[x]\2", text, count=1)
    if n != 1:
        raise Refuse(f"simulate: could not close {iid}")
    return new


def paste_m1(text, mid="M1"):
    """The pasted slices the simulators read: the `## Milestone <mid>` section,
    then for every `## Slice N` carrying a `Milestone: <mid>` line, its heading
    and only the items tagged with it. Since 393.9 folded items live in slices
    that also hold untagged items (defect, parked, owner), which the reference
    simulator cannot read (it requires a `Route:` on every item it sees)."""
    secs = re.split(r"(?m)^(?=## )", text)
    out = ["# Roadmap (pasted)\n\n"]
    for s in secs:
        if s.startswith(f"## Milestone {mid}"):
            out.append(s)
            continue
        if not (s.startswith("## Slice ") and re.search(rf"^[ \t]+Milestone: {mid} ", s, re.M)):
            continue
        starts = [m.start() for m in gs.ANY_ITEM.finditer(s)]
        out.append(s[: starts[0]] if starts else s)   # the heading and preamble (a common Accept lives there)
        for i, st in enumerate(starts):
            block = s[st:starts[i + 1] if i + 1 < len(starts) else len(s)]
            if re.search(rf"^[ \t]+Milestone: {mid} ", block, re.M):
                out.append(block.rstrip("\n") + "\n")
        out.append("\n")
    pasted = "".join(out)
    # An `After:` target outside the paste (249.7 waits on the owner's 249.10) is
    # stubbed as an owner-routed item: both simulators then model it the same
    # way — the owner closes it once it is ready — instead of the reference
    # treating it as closed and rule M refusing it as unresolved.
    have = set(re.findall(r"^\d+\.\s*\[[ xX]\]\s*\*\*(?:[A-Z][A-Z0-9]*\s*·\s*)?(\d+\.\d+[a-z]?)", pasted, re.M))
    wanted = sorted({t for line in re.findall(r"^[ \t]+After: (.+)$", pasted, re.M) for t in line.split(", ")} - have)
    open_ids = gs.all_item_ids(text)
    stubs = [f"1. [ ] **{t} — outside the milestone, stubbed for the simulators.**\n       Route: owner\n"
             for t in wanted if open_ids.get(t) == "open"]
    return pasted + ("## Slice 0 — stubs\n\n" + "".join(stubs) if stubs else "")


def compare_with_reference(pasted, sim_path=SIM):
    """(ours, theirs) over the same pasted text. Any refusal on either side is
    raised as Refuse naming the side, never as an unnamed traceback."""
    import subprocess
    import tempfile
    # The reference models an owner decision only as `Route: owner`; give it the
    # prose-owner-blocked items that way too, so both model the same queue.
    ref = pasted
    try:
        for it in gs.parse_roadmap(pasted):
            if it["owner"] and it["route"] and it["route"] != "owner":
                rx = re.compile(r"(^\d+\.\s*\[ \]\s*\*\*(?:[A-Z][A-Z0-9]*\s*·\s*)?" + re.escape(it["id"])
                                + r"\b.*?^[ \t]+Route: )" + re.escape(it["route"]) + r"$", re.M | re.S)
                ref, n = rx.subn(r"\g<1>owner", ref, count=1)
                if n != 1:
                    raise Refuse(f"compare: could not re-route {it['id']} for the reference")
    except SystemExit as e:
        raise Refuse(f"compare: the paste does not parse: {e}")
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(ref)
        path = f.name
    try:
        out = subprocess.run([sys.executable, sim_path, path], capture_output=True, text=True)
        if out.returncode != 0 or "dispatch order:" not in out.stdout:
            raise Refuse(f"simulate_rule_m.py failed: {(out.stderr or out.stdout).strip()[-300:]}")
        theirs = out.stdout.split("dispatch order:")[1].split("\n")[0].split()
    finally:
        os.unlink(path)
    try:
        ours = simulate(pasted, ROUTES_FX)
    except SystemExit as e:
        raise Refuse(f"rule M's simulation refused: {e}")
    # The reference simulator does not model the item lint (393.7): compare the
    # dispatch order with rule M's sharpen bounces, marked <id>, set aside.
    return [x for x in ours if not x.startswith("<")], theirs


# --- fixtures ----------------------------------------------------------------

HEAD = """# Roadmap

## Milestone M1 — fixture

```
Status: {status}
App: busy-office-erp yes                 # (O5) a comment that must not be read
Modules: home=home:Home
Devices: desktop · phone
Precedence: {prec}
Rules-2-3: scoped
Dispatcher: local
Tiers: top=opus · balanced=none · fast=none
Planner: top
Direction-drift: off
Budget: m0-wakes 12 · wakes {wakes} · agents/wake 8 · workflow-wall 90m · experimental 2 · resume-lines 120 · direction-items 5
Stop: HALT | foreign-commit | budget
```

## Slice 9 — fixture

"""

BODY = """1. [ ] **9.1 — first.**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept:** `check-x` passes.
       After: 9.2
2. [ ] **9.2 — second.**
       Milestone: M1 · Phase: 1
       Route: design
       - **Accept:** `check-x` passes.
3. [ ] **9.3 — owner.**
       Milestone: M1 · Phase: 1
       Route: owner
4. [ ] **9.4 — a defect.**
       Track: defect
5. [ ] **9.5 — outside, free.**
"""


def _fx(status="ACTIVE 2026-09-25", prec="interleave 1/3 track=defect", wakes=40, body=BODY):
    return HEAD.format(status=status, prec=prec, wakes=wakes) + body


ROUTES_FX = {"build", "design", "mechanical", "collect", "research", "planner", "owner"}

# A fixed route table for the fixtures: the shape of routes.json, with values
# the fixtures pin. Independent of the reviewed file on purpose.
_R = dict(effort="high", skills=["x"], critic="J2", returns="r", never="n", handup_when=None)
ROUTES_TABLE_FX = {
    "build": dict(_R, loop="Continue", mode=["build"], tier="top", handup="planner"),
    "design": dict(_R, loop="Continue", mode=["layout"], tier="top", effort="xhigh", handup="planner"),
    "mechanical": dict(_R, loop="Continue", mode=["build"], tier="balanced", effort="medium", handup="build"),
    "collect": dict(_R, loop=None, mode=[], tier="fast", effort="low", handup="build"),
    "research": dict(_R, loop="Continue", mode=["brief"], tier="top", handup="planner"),
    "planner": dict(_R, loop="Roadmap", mode=["plan", "direction"], tier="Planner", effort="xhigh", handup="owner"),
    "owner": dict(loop=None, mode=[], tier=None, effort=None, skills=[], critic=None, returns=None,
                  never="is dispatched", handup=None, handup_when=None),
}


def _row(tags, at="2026-09-25 10:00", sha=None, loop="Continue"):
    sha = sha or f"s{abs(hash((tags, at))) % 10**6}"
    return {"loop": loop, "at": at, "item": f"x · {tags} · landed · {sha}" if tags else f"x · landed · {sha}"}


def _rows(*tags):
    return [_row(t, at=f"2026-09-25 10:{i:02d}") for i, t in enumerate(tags)]


def _fixtures():
    """Every fixture case; returns the failures (empty when all behave)."""
    bad = []

    def expect(name, ok):
        if not ok:
            bad.append(name)

    def refuses(name, text, why, **kw):
        try:
            verdict(text, routes=kw.pop("routes", ROUTES_FX), hold_count=0, **kw)
        except Refuse as e:
            if why not in str(e):
                bad.append(f"{name} (refused, but: {e})")
            return
        bad.append(name + " (it was accepted)")

    def run(text, **kw):
        try:
            return verdict(text, routes=kw.pop("routes", ROUTES_FX), hold_count=0, **kw)
        except Refuse as e:
            bad.append(f"a positive fixture was refused: {e}")
            return {"dispatch": None, "pick": None, "rule4": None, "lines": {k: "" for k in ORDER}, "direction": ""}

    did = lambda v: v["dispatch"]["id"] if v["dispatch"] else None  # noqa: E731

    # fields, comments and the structural refusals
    ms, _ = parse_milestones(_fx())
    expect("a `# (O…)` comment is not read as the value", ms["M1"]["fields"]["App"] == "busy-office-erp yes")
    expect("a DRAFT with OWNER values is not active and not refused",
           run(_fx(status="DRAFT").replace("App: busy-office-erp yes", "App: OWNER")) is None)
    expect("a PAUSED milestone is not active: no verdict",
           run(_fx(status="PAUSED 2026-09-25 after a Stop")) is None)
    expect("a DRAFT with a malformed value is not refused by the verdict (the CLI reports it)",
           run(_fx(status="DRAFT").replace("Rules-2-3: scoped", "Rules-2-3: scopd")) is None)
    for name, old, new, why in (
        ("an OWNER value", "App: busy-office-erp yes", "App: OWNER", "unfilled field(s): App"),
        ("a TBD value", "App: busy-office-erp yes", "App: TBD", "unfilled field(s): App"),
        ("a lowercase owner value", "Devices: desktop · phone", "Devices: owner", "unfilled field(s): Devices"),
        ("an unknown Rules-2-3", "Rules-2-3: scoped", "Rules-2-3: sometimes", "Rules-2-3"),
        ("an unknown field", "Planner: top", "Planner: top\nColour: blue", "unknown field `Colour`"),
        ("a missing field", "Planner: top\n", "", "`Planner` is missing"),
        ("a duplicated field", "Planner: top", "Planner: top\nPlanner: fast", "`Planner` appears twice"),
        ("ACTIVE with no date", "Status: ACTIVE 2026-09-25", "Status: ACTIVE", "is not DRAFT, ACTIVE <date>"),
        ("ACTIVE with an impossible date", "Status: ACTIVE 2026-09-25", "Status: ACTIVE 2026-19-45", "is not DRAFT, ACTIVE <date>"),
        ("interleave 1/1", "interleave 1/3", "interleave 1/1", "Precedence"),
        ("interleave 1/01", "interleave 1/3", "interleave 1/01", "Precedence"),
        ("Tiers top=none", "top=opus", "top=none", "cannot be none"),
        ("Tiers naming a tier twice", "fast=none", "fast=none · fast=haiku", "names `fast` twice"),
        ("an unknown Stop", "Stop: HALT | foreign-commit | budget", "Stop: HALT | coffee", "unknown stop(s): coffee"),
        ("a malformed Modules entry", "Modules: home=home:Home", "Modules: Home", "Modules"),
        ("a malformed Devices part", "Devices: desktop · phone", "Devices: tablet", "Devices"),
        ("a malformed App", "App: busy-office-erp yes", "App: busy-office-erp maybe", "App"),
        ("a Budget without the workflow-wall unit", "workflow-wall 90m", "workflow-wall 90", "Budget"),
        ("a Budget naming a key twice", "experimental 2", "experimental 2 · experimental 3", "names `experimental` twice"),
    ):
        refuses(f"an ACTIVE milestone with {name} refuses", _fx().replace(old, new, 1), why)
    two = _fx() + "\n## Milestone M2 — another\n\n```\n" + re.search(r"```\n(.*?)```", _fx(), re.S).group(1) + "```\n"
    refuses("two ACTIVE milestones refuse", two, "2 milestones are ACTIVE")
    refuses("a duplicated milestone section refuses",
            _fx() + "\n## Milestone M1 — again\n\n```\nStatus: DRAFT\n```\n", "appears twice")
    refuses("a malformed milestone heading refuses, whatever its status",
            _fx().replace("## Milestone M1 — fixture", "## Milestone  M1 — fixture"), "is not `## Milestone Mn")
    refuses("a tag naming no milestone section refuses",
            _fx(status="DRAFT").replace("Milestone: M1 · Phase: 1\n       Route: design", "Milestone: M7 · Phase: 1\n       Route: design"),
            "no `## Milestone` section: M7")
    refuses("a marker that does not reconcile refuses", _fx().replace("       After: 9.2", "       after: 9.2"),
            "do not reconcile")
    refuses("an unresolved After: target refuses", _fx().replace("After: 9.2", "After: 8.8"), "8.8 is no item")
    refuses("an M1 item with no Route: refuses", _fx().replace("       Route: design\n", ""), "no `Route:`: 9.2")
    refuses("a route not in routes.json refuses", _fx().replace("Route: design", "Route: layout"),
            "not in routes.json: 9.2 (layout)")
    refuses("an ACTIVE milestone with no routes.json refuses", _fx(), "routes.json does not exist", routes=None)
    refuses("an un-numbered M1 item refuses",
            _fx(body=BODY + "6. [ ] **A named item.**\n       Milestone: M1 · Phase: 1\n       Route: build\n"),
            "un-numbered M1 item")
    refuses("a Precedence gate that names no item refuses", _fx(prec="after 99.9"), "names no item")

    # rule M and the holds
    v = run(_fx())
    expect("an open After: holds its item, and rule M picks the target", did(v) == "9.2" and "9.1" in v["lines"]["blocked"])
    v = run(_fx(body=BODY.replace("2. [ ] **9.2 — second.**", "2. [ ] **9.2 — second.** NEEDS-BROWSER")), cloud=True)
    expect("a cloud wake holds NEEDS-BROWSER; a local wake does not",
           "browser: 9.2" in v["lines"]["blocked"]
           and did(run(_fx(body=BODY.replace("2. [ ] **9.2 — second.**", "2. [ ] **9.2 — second.** NEEDS-BROWSER")))) == "9.2")
    exitfx = _fx(body=BODY.replace("After: 9.2", "After: 9.3") + "6. [ ] **9.6 — the exit.**\n       Milestone: M1 · Phase: 3\n       Route: build\n")
    EXIT_ITEM["M1"] = ("9.6", "1")
    try:
        v = run(exitfx)
        expect("the exit item waits while another open item of its phase exists",
               "9.6" in v["lines"]["blocked"] and did(v) == "9.2")
    finally:
        EXIT_ITEM["M1"] = ("397.2", "2")

    # interleave
    two_def = BODY.replace("4. [ ] **9.4 — a defect.**\n       Track: defect\n",
                           "4. [ ] **9.4 — a defect, held.**\n       Track: defect\n       After: 9.5\n"
                           "7. [ ] **9.7 — a defect, free.**\n       Track: defect\n"
                           "8. [ ] **9.8 — a younger defect, free.**\n       Track: defect\n")
    v = run(_fx(body=two_def), rows=_rows("milestone=M1", "milestone=M1"))
    expect("interleave 1/3: the 3rd dispatch goes to the oldest DISPATCHABLE defect item (not a held one, not a younger one)",
           did(v) == "9.7")
    v = run(_fx(), rows=_rows("milestone=M1"))
    expect("interleave 1/3: the 2nd dispatch stays with rule M", did(v) == "9.2")
    v = run(_fx(prec="interleave 1/2 track=defect"), rows=_rows("milestone=M1"))
    expect("interleave 1/2: the 2nd dispatch goes to the defect item", did(v) == "9.4")
    v = run(_fx(prec="interleave 1/4 track=defect"), rows=_rows("milestone=M1", "milestone=M1"))
    expect("interleave 1/4: the 3rd dispatch stays with rule M", did(v) == "9.2")
    v = run(_fx(), rows=_rows("milestone=M1", "milestone=M1", "milestone=M1", "milestone=M1"))
    expect("interleave past N-1 (the count ran on while no defect was free) still sends the next to defect", did(v) == "9.4")
    v = run(_fx(), rows=_rows("milestone=M1", "milestone=M1", "track=defect", "milestone=M1"))
    expect("a defect row resets the interleave count", did(v) == "9.2" and v["lines"]["interleave"].startswith("1/2"))
    v = run(_fx(), rows=_rows("milestone=M1", "", "milestone=M1"))
    expect("untagged rows neither count nor break the interleave", did(v) == "9.4")
    v = run(_fx(), rows=_rows("milestone=M1") + [_row("milestone=M1", at="2026-09-25 11:00", loop="Meta")])
    expect("a Meta (refusal) row is not a dispatch and does not count", did(v) == "9.2")
    v = run(_fx(), rows=_rows("milestone=M1") + [{"loop": "Continue", "at": "2026-09-25 11:00",
                                                  "item": "393.5 — writes milestone=M1 and track=defect into the row · landed · abc"}])
    expect("a row that only DESCRIBES the tags is not tagged", v["lines"]["interleave"].startswith("1/2"))
    held_def = BODY.replace("4. [ ] **9.4 — a defect.**\n       Track: defect\n",
                            "4. [ ] **9.4 — a defect.**\n       Track: defect\n       After: 9.5\n")
    v = run(_fx(body=held_def), rows=_rows("milestone=M1", "milestone=M1"))
    expect("with the only defect item held the dispatch stays with rule M, count not reset",
           did(v) == "9.2" and "count not reset" in v["lines"]["interleave"])
    v = run(_fx(prec="preempt"), rows=_rows("milestone=M1", "milestone=M1"))
    expect("preempt never interleaves", did(v) == "9.2")

    # direction and the fall-throughs
    allowner = _fx(body=BODY.replace("Route: build", "Route: owner").replace("Route: design", "Route: owner"))
    v = run(allowner)
    expect("every M1 chain ends at the owner: falls through, names the ends, rule D does not run, rule 4 restricted to defect",
           v["dispatch"] is None and "blocked by the owner" in v["direction"] and "9.2" in v["direction"]
           and "DIRECTION GAP" not in v["direction"] and v["rule4"] and v["rule4"]["id"] == "9.4")
    chain_free = _fx(body=BODY.replace("       Route: design\n", "       Route: design\n       After: 9.5\n")
                     .replace("Route: owner", "Route: build\n       After: 9.5"))
    v = run(chain_free)
    expect("a chain ending at a free item outside M1 dispatches that item, not 'blocked by the owner'",
           did(v) == "9.5" and "blocked by the owner" not in v["direction"])
    chain_parked = chain_free.replace("5. [ ] **9.5 — outside, free.**", "5. [ ] **9.5 — outside, parked.**\n       Parked: M1 — r — revisit: x")
    v = run(chain_parked)
    expect("a chain ending at a parked item is a stall, and rule 4 runs when it has an item",
           v["dispatch"] is None and v["direction"].startswith("stalled on 9.5") and v["rule4"]["id"] == "9.4")
    v = run(chain_parked.replace("4. [ ] **9.4 — a defect.**\n       Track: defect\n", ""))
    expect("a stall with nothing for rule 4 either is DIRECTION GAP D1", v["direction"].startswith("DIRECTION GAP D1"))
    empty = _fx(body="4. [ ] **9.4 — a defect.**\n       Track: defect\n5. [ ] **9.5 — outside, free.**\n")
    v = run(empty)
    expect("no open M1 item and no closed exit item prints DIRECTION GAP D2", v["direction"].startswith("DIRECTION GAP D2"))
    v = run(_fx(prec="after 9.5"))
    expect("Precedence after <open id>: rule 4 first, rule M's pick printed as the fallback",
           did(v) == "9.2" and "below rule 4" in v["lines"]["rule M"] and v["rule4"]["id"] == "9.4"
           and v["lines"]["skipped"].startswith("9.5"))
    v = run(_fx(prec="after 9.5").replace("5. [ ] **9.5", "5. [x] **9.5"))
    expect("Precedence after <closed id>: rule M runs normally", did(v) == "9.2" and "below rule 4" not in v["lines"]["rule M"])

    # budget and skipped
    v = run(_fx(wakes=2), rows=_rows("milestone=M1", "milestone=M1"))
    expect("the wakes budget stops rule M", v["dispatch"] is None and "STOP (budget)" in v["lines"]["rule M"])
    same_wake = [_row("milestone=M1", at="2026-09-25 10:00", sha="aaa"), _row("milestone=M1", at="2026-09-25 10:00", sha="aaa")]
    v = run(_fx(wakes=2, prec="preempt"), rows=same_wake)
    expect("two rows from one wake count as one wake", did(v) == "9.2" and "wakes 1/2" in v["lines"]["budget"])
    v = run(_fx(wakes=2), rows=[_row("milestone=M1", at="2026-09-20 10:00"), _row("milestone=M1", at="2026-09-20 11:00")])
    expect("rows before the ACTIVE date do not count", did(v) is not None and "wakes 0/2" in v["lines"]["budget"])
    v = run(_fx(wakes=2).replace("Stop: HALT | foreign-commit | budget", "Stop: HALT | foreign-commit"),
            rows=_rows("milestone=M1", "milestone=M1"))
    expect("without `budget` in Stop the wakes count does not stop rule M", did(v) is not None)
    v = run(_fx())
    expect("skipped names the oldest dispatchable item outside M1", v["lines"]["skipped"].startswith("9.4"))
    v = run(_fx(), rows=_rows("milestone=M1", "milestone=M1"))
    expect("skipped never names the item this wake dispatches", did(v) == "9.4" and v["lines"]["skipped"].startswith("9.5"))

    # routes.json (393.6). The LIVE table is checked only for its shape: a
    # legitimate edit to the reviewed table must not stop every ACTIVE dispatch
    # (393.6's verification). Behaviour runs on a FIXED table defined here.
    live = load_routes()
    if live is None:
        bad.append("scripts/loops/routes.json is missing")
    else:
        expect("the committed routes.json is well formed", route_problems(live) == [])
    table = json.loads(json.dumps(ROUTES_TABLE_FX))
    expect("the fixture table is well formed", route_problems(table) == [])
    v = run(_fx(), routes=table)
    expect("rule M's line names the route's loop, modes, tier, model and effort",
           "route design · Continue layout · top → opus · effort xhigh" in v["lines"]["rule M"])
    v = run(_fx().replace("Route: design", "Route: mechanical"), routes=table)
    expect("a tier the owner set to none runs on top, and the line says so",
           "top → opus (tier balanced is none → top)" in v["lines"]["rule M"])
    for planner, tiers, want in (
        ("top", "top=opus · balanced=none · fast=none", "top → opus · effort xhigh"),
        ("balanced", "top=opus · balanced=none · fast=none", "top → opus (tier balanced is none → top)"),
        ("fast", "top=opus · balanced=none · fast=haiku", "fast → haiku · effort xhigh"),
    ):
        fx = (_fx().replace("Route: design", "Route: planner").replace("Planner: top", f"Planner: {planner}")
              .replace("Tiers: top=opus · balanced=none · fast=none", f"Tiers: {tiers}"))
        v = run(fx, routes=table)
        expect(f"the planner route runs on the Planner field's tier ({planner})",
               f"route planner · Roadmap plan|direction · {want}" in v["lines"]["rule M"])
    for name, mutate, why in (
        ("a tier outside the fixed set", lambda t: t["design"].update(tier="ultra"), "tier 'ultra' is not top"),
        ("a loop that is not recorded", lambda t: t["design"].update(loop="Layout"), "is not a recorded loop"),
        ("a hand-up to no route", lambda t: t["build"].update(handup="nobody"), "does not reach the planner"),
        ("a hand-up cycle", lambda t: (t["build"].update(handup="mechanical"), t["mechanical"].update(handup="build")),
         "does not reach the planner"),
        ("a missing field", lambda t: t["design"].pop("critic"), "route design lacks critic"),
        ("an empty effort", lambda t: t["design"].update(effort=""), "route design's effort is empty"),
        ("a mode given as a string", lambda t: t["design"].update(mode="layout"), "mode must be a list"),
        ("a route id with an underscore", lambda t: t.update(fast_path=dict(t["build"])), "'fast_path' is not"),
    ):
        broken = json.loads(json.dumps(ROUTES_TABLE_FX))
        mutate(broken)
        refuses(f"a routes table with {name} refuses", _fx(), why, routes=broken)
    refuses("a dispatched item outside M1 whose route is not in the table refuses",
            _fx(body=BODY.replace("4. [ ] **9.4 — a defect.**\n       Track: defect\n",
                                  "4. [ ] **9.4 — a defect.**\n       Track: defect\n       Route: bogus\n")),
            "names route 'bogus'", routes=table, rows=_rows("milestone=M1", "milestone=M1"))

    # rule D (393.7): the item lint, the triggers, and the limits. Every run goes
    # through rd(), which also asserts the printed contract: a direction line
    # says `DIRECTION GAP` only when rule D acts on it this wake.
    NOW = datetime.datetime(2026, 9, 30, 12, 0)

    def rrow(tags, outcome="landed", at="2026-09-30 10:00", loop="Continue", sha=None, subject="x"):
        sha = sha or f"d{abs(hash((tags, outcome, at, subject))) % 10**6}"
        mode = "plan" if loop == "Roadmap" else "build"
        return {"loop": loop, "at": at, "mode": mode,
                "item": f"{subject} · {tags} · {outcome} · {sha}" if tags else f"{subject} · {outcome} · {sha}"}

    def rd(text, rows=(), **kw):
        v = run(text, rows=list(rows), now=NOW, **kw)
        if v.get("rule_d") is None and v["direction"].startswith("DIRECTION GAP"):
            bad.append(f"printed DIRECTION GAP with no rule D run: {v['direction'][:80]}")
        return v

    def planner(trigger, at, subject="x", outcome="triaged"):
        return rrow(f"milestone=M1 route=planner trigger={trigger}", outcome, at, loop="Roadmap", subject=subject)
    P = "preempt"
    noacc = _fx(prec=P).replace("Route: design\n       - **Accept:** `check-x` passes.\n", "Route: design\n")
    v = rd(noacc)
    expect("a pick with no Accept is sharpened, not dispatched",
           v["dispatch"] is None and v["rule_d"] and v["rule_d"]["trigger"] == "sharpen"
           and "9.2 fails the item lint: no Accept" in v["direction"])
    v = rd(noacc.replace("2. [ ] **9.2 — second.**", "2. [ ] **9.2 — Accept, refuse or rethink the grid.**"))
    expect("the word Accept in a title is not an Accept label", v["rule_d"] and "no Accept" in v["direction"])
    v = rd(_fx(prec=P).replace("Route: design\n       - **Accept:** `check-x` passes.\n",
                               "Route: design\n       - **Accept:** the layout looks different to the owner.\n"))
    expect("ordinary words (different, count…) are not an instrument",
           v["rule_d"] and "its Accept names no instrument" in v["direction"])
    inherit = (_fx(prec=P).replace("## Slice 9 — fixture\n\n",
               "## Slice 9 — fixture\n\n**The common Accept for the module items.** It does not apply to 9.7. "
               "Each is red-proved.\n\n")
               .replace("Route: design\n       - **Accept:** `check-x` passes.\n",
                        "Route: design\n       - **Accept:** the slice's common Accept holds.\n"))
    v = rd(inherit)
    expect("an inherited common Accept that names an instrument passes the lint", did(v) == "9.2")
    v = rd(inherit.replace("It does not apply to 9.7.", "It does not apply to 9.2."))
    expect("an item the common Accept excludes does not inherit it", v["rule_d"] and v["rule_d"]["trigger"] == "sharpen")
    v = rd(noacc, [planner("sharpen", "2026-09-30 11:00", subject="9.77 — another item")])
    expect("sharpen has no 24 h limit: another item's recent bounce does not let this pick through",
           v["dispatch"] is None and v["rule_d"] and v["rule_d"]["trigger"] == "sharpen")
    bounced = noacc + "6. [ ] **9.6 — a later free item.**\n       Milestone: M1 · Phase: 1\n       Route: build\n       - **Accept:** `check-y` passes.\n"
    v = rd(bounced, [planner("sharpen", "2026-09-28 11:00", subject="9.2 — second")])
    expect("after its one bounce a still-failing item is held for the owner, and the next pick is dispatched",
           did(v) == "9.6" and "9.2 (lint, after its one sharpen)" in v["lines"]["blocked"])
    v = rd(noacc, [planner("sharpen", "2026-09-28 11:00", subject="9.2 — second")])
    expect("a failing item after its bounce is never dispatched, even when nothing else is free",
           v["dispatch"] is None or did(v) != "9.2")
    three = [rrow("milestone=M1", "logged", "2026-09-30 08:00"), rrow("milestone=M1", "landed", "2026-09-30 09:00"),
             rrow("milestone=M1", "triaged", "2026-09-30 10:00")]
    v = rd(_fx(prec=P), three)
    expect("D3: 2 of the last 3 executor rows triaged or logged takes the wake",
           v["dispatch"] is None and v["rule_d"]["trigger"] == "D3" and "rule D (D3)" in v["lines"]["rule M"])
    v = rd(_fx(prec=P), [rrow("milestone=M1", "logged", "2026-09-30 08:00"), rrow("milestone=M1", "landed", "2026-09-30 09:00"),
                         rrow("milestone=M1", "landed", "2026-09-30 10:00")])
    expect("D3 does not fire on 1 of 3", did(v) == "9.2" and v["rule_d"] is None)
    v = rd(_fx(prec=P), [rrow("milestone=M1", "logged", "2026-09-30 08:00"),
                         planner("D1", "2026-09-30 09:00", outcome="logged"), rrow("milestone=M1", "landed", "2026-09-30 10:00"),
                         rrow("milestone=M1", "landed", "2026-09-30 10:30")])
    expect("a planner row is not an executor row for D3", v["rule_d"] is None and did(v) == "9.2")
    sharp = [planner("sharpen", "2026-09-29 08:00", subject="9.8 — a"), rrow("milestone=M1", "landed", "2026-09-29 09:00"),
             planner("sharpen", "2026-09-29 10:00", subject="9.9 — b")]
    v = rd(_fx(prec=P), sharp)
    expect("D3: 2 of the last 3 picks failed the lint", v["rule_d"] and v["rule_d"]["trigger"] == "D3"
           and "failed the item lint" in v["direction"])
    v = rd(_fx(prec=P), three + [planner("D3", "2026-09-30 11:00")])
    expect("once per 24 h: a D3 reviewed 1 h ago does not fire, and rule M dispatches",
           did(v) == "9.2" and "D3 was reviewed at 2026-09-30 11:00: once per 24 h" in v["direction"])
    v = rd(_fx(prec=P), [planner("D3", "2026-09-29 10:00")] + three)
    expect("after 24 h the trigger fires again", v["rule_d"] and v["rule_d"]["trigger"] == "D3")
    allowner = _fx(prec=P, body=BODY.replace("Route: build", "Route: owner").replace("Route: design", "Route: owner"))
    v = rd(allowner, three)
    expect("D3 does not run when every M1 item waits on the owner (§7)",
           v["rule_d"] is None and v["direction"].startswith("blocked by the owner"))
    v = rd(_fx(prec="after 9.5"), three)
    expect("rule D does not run while Precedence: after keeps rule 4 first", v["rule_d"] is None)
    v = rd(_fx(), [rrow("milestone=M1", "logged", "2026-09-30 08:00"), rrow("milestone=M1", "triaged", "2026-09-30 09:00"),
                   rrow("milestone=M1", "landed", "2026-09-30 10:00")])
    expect("a due defect interleave is not displaced by D3", did(v) == "9.4" and v["rule_d"] is None)
    real_share = globals()["framework_share"]
    try:
        globals()["framework_share"] = lambda rows, n: (0.05, "")
        v = rd(_fx(prec=P).replace("Direction-drift: off", "Direction-drift: N=3 X=20"))
        expect("D4 fires below X when Direction-drift is set",
               v["rule_d"] and v["rule_d"]["trigger"] == "D4" and "5% of the last 3" in v["direction"])
        v = rd(_fx(prec=P))
        expect("D4 never fires while Direction-drift is off", v["rule_d"] is None)
        globals()["framework_share"] = lambda rows, n: (0.5, "")
        v = rd(_fx(prec=P).replace("Direction-drift: off", "Direction-drift: N=3 X=20"))
        expect("D4 does not fire at or above X", v["rule_d"] is None and did(v) == "9.2")
        globals()["framework_share"] = lambda rows, n: (None, "commit deadbee does not resolve")
        v = rd(_fx(prec=P).replace("Direction-drift: off", "Direction-drift: N=3 X=20"))
        expect("D4 that cannot be computed says so", "D4 could not be computed: commit deadbee" in v["direction"])
    finally:
        globals()["framework_share"] = real_share
    stall = _fx(prec=P, body=BODY.replace("       Route: build\n       - **Accept:** `check-x` passes.\n       After: 9.2\n",
                                          "       Route: build\n       - **Accept:** `check-x` passes.\n       Parked: M1 — r — revisit: x\n")
                .replace("2. [ ] **9.2 — second.**\n       Milestone: M1 · Phase: 1\n       Route: design\n       - **Accept:** `check-x` passes.\n", "")
                .replace("4. [ ] **9.4 — a defect.**\n       Track: defect\n", "")
                .replace("5. [ ] **9.5 — outside, free.**\n", ""))
    v = rd(stall)
    expect("D1 fires when nothing at all is dispatchable", v["rule_d"] and v["rule_d"]["trigger"] == "D1")
    v = rd(stall, [planner("D3", "2026-09-30 11:00")])
    expect("the 24 h limit is per trigger: a recent D3 does not hold D1", v["rule_d"] and v["rule_d"]["trigger"] == "D1")
    v = rd(stall, [planner("D1", "2026-09-28 10:00", outcome="logged")])
    expect("a second empty D1 review falls through to rules 5-8, and is printed as held",
           v["rule_d"] is None and "falls through to rules 5-8" in v["direction"] and v["direction"].startswith("held"))
    v = rd(stall, [planner("D1", "2026-09-28 10:00", outcome="triaged")])
    expect("a D1 review that filed items does not make the next one fall through",
           v["rule_d"] and v["rule_d"]["trigger"] == "D1")
    v = rd(stall, [planner("D1", "2026-09-30 11:00")])
    expect("a suppressed D1 is printed as held, not as a gap", v["rule_d"] is None and v["direction"].startswith("held — D1"))
    stop = _fx(prec=P).replace("Stop: HALT | foreign-commit | budget", "Stop: HALT | foreign-commit | budget | 2-wakes-plan-only")
    v = rd(stop, [planner("D3", "2026-09-29 10:00"), planner("sharpen", "2026-09-29 11:00", subject="9.8 — a")])
    expect("two consecutive plan-only wakes halt the loop", v["dispatch"] is None and "STOP (2-wakes-plan-only)" in v["lines"]["rule M"])
    v = rd(stop, [rrow("milestone=M1", "landed", "2026-09-29 09:00"), planner("D3", "2026-09-29 10:00")])
    expect("one plan-only wake does not halt", did(v) == "9.2" and "STOP" not in v["lines"]["rule M"])
    v = rd(stop, [planner("D3", "2026-09-29 08:00"), rrow("milestone=M1", "landed", "2026-09-29 09:00"),
                  planner("D2", "2026-09-29 10:00")])
    expect("plan, build, plan does not halt", "STOP" not in v["lines"]["rule M"])
    v = rd(stop, [rrow("milestone=M1", "landed", "2026-09-29 09:00", loop="Roadmap"),
                  rrow("milestone=M1", "landed", "2026-09-29 10:00", loop="Roadmap")])
    expect("Roadmap triage rows that are not planner runs do not halt", "STOP" not in v["lines"]["rule M"])
    v = rd(stop.replace("Stop: HALT | foreign-commit | budget | 2-wakes-plan-only", "Stop: HALT | foreign-commit | budget"),
           [planner("D3", "2026-09-29 10:00"), planner("sharpen", "2026-09-29 11:00", subject="9.8 — a")])
    expect("without 2-wakes-plan-only in Stop there is no halt", "STOP" not in v["lines"]["rule M"])
    # the planner's output contract, on texts (its git wrapper is red-proved in the DONE note)
    base = _fx(prec=P)
    add = base + "6. [ ] **9.6 — filed by the planner.**\n       Milestone: M1 · Phase: 1\n       Route: build\n       - **Accept:** `check-y` passes.\n"

    def contract(new, old=base, cap=None, mo=False):
        try:
            return added_item_problems(gs.parse_roadmap(new), new, old, ROUTES_FX, cap=cap, milestone_only=mo)
        except SystemExit as e:
            return [str(e)]
    expect("a well-formed planner item passes the output check", contract(add) == [])
    for name, new, why in (
        ("no Accept", add.replace("       - **Accept:** `check-y` passes.\n", ""), "9.6: no Accept"),
        ("an unknown Route", add.replace("       Route: build\n       - **Accept:** `check-y`", "       Route: layout\n       - **Accept:** `check-y`"),
         "9.6: Route: layout is not in routes.json"),
        ("no Route", add.replace("       Route: build\n       - **Accept:** `check-y`", "       - **Accept:** `check-y`"), "9.6: no Route:"),
        ("an unresolved After:", add.replace("`check-y` passes.\n", "`check-y` passes.\n       After: 9.99\n"), "9.99"),
        ("an edit that breaks an existing item", base.replace("Route: design\n       - **Accept:** `check-x` passes.\n", "Route: design\n"),
         "9.2: no Accept"),
        ("a duplicated open id", add + "7. [ ] **9.6 — a second 9.6.**\n       Route: build\n       - **Accept:** `c` passes.\n",
         "9.6: two open items share this id"),
        ("an unnumbered item", add + "8. [ ] **a planner item with no number.**\n", "an added item needs a number"),
    ):
        expect(f"a planner commit with {name} fails the output check", any(why in g for g in contract(new)))
    two = add + "7. [ ] **9.7 — another.**\n       Milestone: M1 · Phase: 1\n       Route: build\n       - **Accept:** `check-z` passes.\n"
    expect("a review over its direction-items cap fails", any("allows 1" in g for g in contract(two, cap=1)))
    expect("the cap is not exceeded at the cap", contract(two, cap=2) == [])
    outside = base + "6. [ ] **9.6 — a defect filed by triage.**\n       Track: defect\n"
    expect("a non-planner check covers only milestone items", contract(outside, mo=True) == [])

    # modules reconcile once the gate item has closed
    MODULES_FROM["M1"] = "9.5"
    try:
        closed = _fx().replace("5. [ ] **9.5", "5. [x] **9.5")
        refuses("Modules disagreeing with _shell.mjs refuses once the gate item closed", closed,
                "_shell.mjs MODULES holds", shell_ids={"home", "o2c"})
        v = run(closed, shell_ids={"home"})
        expect("Modules agreeing with _shell.mjs passes", v["lines"]["reconcile"].endswith("ok (1 = _shell.mjs MODULES)"))
    finally:
        MODULES_FROM["M1"] = "394.9"

    # the reference simulator, over a synthetic pasted file (hermetic; --compare runs the live slices)
    sim = HEAD.format(status="DRAFT", prec="preempt", wakes=99).replace("App: busy-office-erp yes", "App: OWNER") + SIM_BODY
    if os.path.exists(SIM):
        try:
            ours, theirs = compare_with_reference(sim)
            want = ["9.2", "(9.3)", "9.1", "9.5", "9.4"]
            expect(f"rule M's simulated order equals simulate_rule_m.py's and the hand-derived order on the "
                   f"synthetic slices (ours {ours} / theirs {theirs} / by hand {want})",
                   ours == theirs == want)
        except Refuse as e:
            bad.append(f"the simulator comparison could not run: {e}")
    else:
        bad.append(f"the reference simulator is missing: {SIM}")
    return bad


SIM_BODY = """1. [ ] **9.1 — waits on the owner's decision.**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept:** `check-x` passes.
       After: 9.3
2. [ ] **9.2 — free.**
       Milestone: M1 · Phase: 1
       Route: design
       - **Accept:** `check-x` passes.
3. [ ] **9.3 — the owner decides.**
       Milestone: M1 · Phase: 1
       Route: owner
       After: 9.2
4. [ ] **9.4 — waits on two.**
       Milestone: M1 · Phase: 2
       Route: build
       - **Accept:** `check-x` passes.
       After: 9.1, 9.5
5. [ ] **9.5 — free, older than it looks.**
       Milestone: M1 · Phase: 2
       Route: mechanical
       - **Accept:** `check-x` passes.
"""


def self_test():
    failed = _fixtures()
    if failed:
        print("milestone --self-test FAILED:\n  " + "\n  ".join(failed), file=sys.stderr)
        return 1
    print("milestone --self-test: every fixture behaves (field forms and the structural refusals, the "
          "holds, interleave for oldest/dispatchable/N/reset/untagged rows, the owner fall-through and "
          "chain ends, stall vs D1, D2, Precedence after open/closed, the budget by wake and date, "
          "skipped, the Modules reconcile, and the reference simulator)")
    return 0


def main():
    if "--self-test" in sys.argv:
        return self_test()
    if "--simulate" in sys.argv:
        path = sys.argv[sys.argv.index("--simulate") + 1]
        print("dispatch order:", " ".join(simulate(open(path, encoding="utf-8").read(), ROUTES_FX)))
        return 0
    if "--check-commit" in sys.argv:
        sha = sys.argv[sys.argv.index("--check-commit") + 1]
        problems = check_planner_commit(sha)
        print("\n".join(problems) if problems else f"{sha}: every item it adds or changes meets the planner's output contract")
        return 1 if problems else 0
    text = gs._read(gs.ROADMAP)
    if "--compare" in sys.argv:
        try:
            ours, theirs = compare_with_reference(paste_m1(text))
        except Refuse as e:
            print(f"compare: REFUSED — {e}", file=sys.stderr)
            return 1
        print("rule M:            ", " ".join(ours))
        sharp = [x for x in simulate(paste_m1(text), ROUTES_FX) if x.startswith("<")]
        print("sharpened first:   ", " ".join(sharp) or "none")
        print("simulate_rule_m.py:", " ".join(theirs))
        print("IDENTICAL" if ours == theirs else "DIFFER", f"({len(ours)} / {len(theirs)} entries)")
        return 0 if ours == theirs else 1
    ms, structural = parse_milestones(text)
    for s in structural:
        print(f"STRUCTURAL: {s}")
    for mid, m in ms.items():
        print(f"{mid}: {m['fields'].get('Status', '?')}"
              + (f" · unfilled: {', '.join(m['unfilled'])}" if m["unfilled"] else "")
              + (f" · PROBLEMS: {'; '.join(m['problems'])}" if m["problems"] else ""))
    try:
        lines = status_lines(rows=_log_rows(), cloud="--cloud" in sys.argv)
    except Refuse as e:
        print(f"milestone: REFUSED — {e}", file=sys.stderr)
        return 1
    print("\n".join(lines) if lines else "no milestone is ACTIVE — rule M does not run")
    return 1 if structural or any(m["problems"] for m in ms.values()) else 0


def _log_rows():
    import dispatch_status
    return dispatch_status.rows()


if __name__ == "__main__":
    sys.exit(main())
