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
  not in `routes.json`;
- the `Modules` field disagrees with `examples/erp-suite/_shell.mjs` MODULES
  once 394.9 has closed.

    python3 scripts/loops/milestone.py              # fields, problems, and the verdict if ACTIVE
    python3 scripts/loops/milestone.py --simulate FILE
    python3 scripts/loops/milestone.py --compare    # rule M vs simulate_rule_m.py over the live M1 slices
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
from _common import ROOT  # noqa: E402

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


TAG_SEGMENT = re.compile(r"^(?:milestone=M\d+|track=defect)(?: (?:milestone=M\d+|track=defect))*$")


def row_tags(item_text):
    """The tags in a loop-log row: a ` · `-separated segment made ONLY of
    `milestone=Mn` / `track=defect` tokens (393.5 writes it). A search over the
    free text would read a row that merely DESCRIBES the tags as tagged."""
    tags = {"milestone": None, "defect": False}
    for seg in item_text.split(" · "):
        seg = seg.strip()
        if TAG_SEGMENT.match(seg):
            for tok in seg.split():
                if tok == "track=defect":
                    tags["defect"] = True
                else:
                    tags["milestone"] = tok.split("=", 1)[1]
    return tags


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
        if t["milestone"] == mid:
            k += 1
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
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return set(data.get("routes", data))


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


def verdict(text, archive_text="", rows=(), cloud=False, routes="load", hold_count=None,
            shell_ids=None):
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
    other_phase = [it["id"] for it in mine if it["phase"] == exit_phase and it["id"] != exit_id]

    def hold_of(it):
        k = gs.blocked_kind(it)
        if k:
            return k
        if cloud and it["browser"]:
            return "browser"
        if it["id"] == exit_id and other_phase:
            return "dependency"
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
    held = {k: [it["id"] for it in by_age(mine) if hold_of(it) == k]
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
        owner_ends = [t for t in term if t["owner"]]
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
            stalled = [f"{t['id']} ({hold_of(t) or 'held'})" for t in term if not t["owner"]]
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

    if dispatch:
        route = (f"route {dispatch['route']}" if dispatch["route"]
                 else "no Route: — rule 4's playbook, Continue build")
        rule_m = f"{dispatch['id']} — {dispatch['title']} [{route}] ({reason})"
    elif over:
        rule_m = f"none — {reason}"
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
            "lines": lines, "direction": direction}


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
            if it["route"] == "owner" and it["id"] not in keep_open and not it["after_open"]:
                text = _close(text, it["id"])
                order.append(f"({it['id']})")
                closed_now = True
        if closed_now:
            continue
        v = verdict(text, routes=routes, hold_count=0, shell_ids={"home"})
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


def _close(text, iid):
    rx = re.compile(r"^(\d+\.\s*)\[ \](\s*\*\*" + gs.PREFIX + re.escape(iid) + r"\b)", re.M)
    new, n = rx.subn(r"\1[x]\2", text, count=1)
    if n != 1:
        raise Refuse(f"simulate: could not close {iid}")
    return new


def paste_m1(text, mid="M1"):
    """The pasted slices the simulators read: the `## Milestone <mid>` section and
    every `## Slice N` section carrying a `Milestone: <mid>` line."""
    secs = re.split(r"(?m)^(?=## )", text)
    keep = [s for s in secs if s.startswith(f"## Milestone {mid}")
            or (s.startswith("## Slice ") and re.search(rf"^[ \t]+Milestone: {mid} ", s, re.M))]
    return "# Roadmap (pasted)\n\n" + "".join(keep)


def compare_with_reference(pasted, sim_path=SIM):
    """(ours, theirs) over the same pasted text. Any refusal on either side is
    raised as Refuse naming the side, never as an unnamed traceback."""
    import subprocess
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(pasted)
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
    return ours, theirs


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
       After: 9.2
2. [ ] **9.2 — second.**
       Milestone: M1 · Phase: 1
       Route: design
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
       After: 9.3
2. [ ] **9.2 — free.**
       Milestone: M1 · Phase: 1
       Route: design
3. [ ] **9.3 — the owner decides.**
       Milestone: M1 · Phase: 1
       Route: owner
       After: 9.2
4. [ ] **9.4 — waits on two.**
       Milestone: M1 · Phase: 2
       Route: build
       After: 9.1, 9.5
5. [ ] **9.5 — free, older than it looks.**
       Milestone: M1 · Phase: 2
       Route: mechanical
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
    text = gs._read(gs.ROADMAP)
    if "--compare" in sys.argv:
        try:
            ours, theirs = compare_with_reference(paste_m1(text))
        except Refuse as e:
            print(f"compare: REFUSED — {e}", file=sys.stderr)
            return 1
        print("rule M:            ", " ".join(ours))
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
