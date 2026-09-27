#!/usr/bin/env python3
"""The in-flight protocol: workflows under a limit, one by default (roadmap 393.2, 417.1).

On 2026-09-25, 6 of 10 /loop wakes found a background Workflow still running
and could only hold, and nothing in the repo said so: a 3-hour workflow was
invisible to the hand-off. This keeps ONE structured line under RESUME.md's
`## In flight` heading while a workflow runs:

  wf=<id> item=<id> started=<UTC ISO> cap=<minutes> session=<id> out=<path> paths=<globs>

  open    --wf ID --item ID --cap MIN --session ID --out PATH --paths GLOBS [--started ISO]
          writes the line; exit 1 at the limit (DEFAULT_LIMIT, 1 today; `--limit N`
          overrides), for a repeated wf, or when `paths` (comma-separated globs) may
          touch an open line's. 417.1: overlap is judged conservatively.
  status  exit 0: room to dispatch (open lines are printed) · 3: at the limit ·
          4: any line past its cap · 
          5: the section holds something that does not parse, or RESUME.md
          cannot be read (398.2). Exit 5 is a STOP, never "nothing in flight".
  hold    status, and when the line is under its cap also append one row to
          .roundtable/hold-wakes.jsonl; same exits as status. This is the whole
          of a hold wake: guard, hold, schedule the next wake, stop.
  close   removes the line; with several open, `--wf ID` (exit 2 without); exit 1 if none.

Why exit 5 exists (roadmap 398.2): the 2026-09-26 re-score fed `status` five
malformed lines (a trailing space, a space in `paths`, fields reordered,
`cap=60m`, a bullet prefix). All five read "nothing in flight", exit 0, so a
wake would have dispatched over a live workflow. A missing RESUME.md crashed
with exit 1, which Step 0 does not define. Every non-blank line in the section
must now parse, trailing whitespace aside; anything else is refused by name.

What a wake does with exit 4 (the cap): stop the workflow (TaskStop), keep its
partial output at `out`, record `--outcome logged` naming what did not finish,
then `close`. That part is the dispatcher's, not this script's: a script cannot
stop a Claude Code task.

@exact — string and time comparisons; `--self-test` exercises every exit.
"""
import datetime as dt
import fnmatch
import json
import os
import re
import sys
import tempfile

# The repo root comes from this file's own path, not the caller's cwd (398.2).
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RESUME = '.roundtable/RESUME.md'
HOLDS = '.roundtable/hold-wakes.jsonl'
HEADING = '## In flight'
LINE_RE = re.compile(r'wf=\S+ item=\S+ started=(\S+) cap=(\d+) session=\S+ out=\S+ paths=\S+')
UNPARSED = 5
# How many workflows may run at once. 1 until 417.2-417.5 make parallel work safe (the
# design note, section 7); raise it there, not per call. `--limit N` overrides for tests.
DEFAULT_LIMIT = 1


class Unparsed(Exception):
    """The in-flight state cannot be read: exit 5, a STOP (398.2)."""


def now_utc():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0)


def section_bounds(text):
    """(start, end) of the body under '## In flight', or None."""
    m = re.search(r'^## In flight\s*$', text, re.M)
    if not m:
        return None
    start = m.end() + 1
    n = re.search(r'^## ', text[start:], re.M)
    return start, (start + n.start() if n else len(text))


def lines_in(text):
    """Every in-flight line's match, in file order; [] when the section is absent or blank.

    Raises Unparsed when the section holds anything else: a line that is not
    exactly the protocol's form (trailing whitespace aside), a `started` that is
    not a timezone-aware ISO time, or two lines with the same `wf` (417.1: more
    than one line is allowed now, so a repeated id is what "two lines" used to be)."""
    b = section_bounds(text)
    if not b:
        return []
    out, seen = [], set()
    for l in (l.rstrip() for l in text[b[0]:b[1]].split('\n') if l.strip()):
        m = LINE_RE.fullmatch(l)
        if not m:
            raise Unparsed(f'the line under {HEADING} does not parse (expected: '
                           'wf=… item=… started=… cap=<minutes> session=… out=… paths=…, '
                           'single spaces, no bullet): ' + l)
        try:
            started = dt.datetime.fromisoformat(m.group(1).replace('Z', '+00:00'))
        except ValueError:
            raise Unparsed(f'started={m.group(1)} is not an ISO time: ' + l)
        if started.tzinfo is None:
            raise Unparsed(f'started={m.group(1)} has no timezone (write it in UTC with a Z): ' + l)
        wf = re.match(r'wf=(\S+)', l).group(1)
        if wf in seen:
            raise Unparsed(f'wf={wf} appears twice under {HEADING}: ' + l)
        seen.add(wf)
        out.append(m)
    return out


def wf_of(m):
    return re.match(r'wf=(\S+)', m.group(0)).group(1)


def paths_of(m):
    return re.search(r'paths=(\S+)', m.group(0)).group(1).split(',')


def _stem(g):
    """A glob's fixed directory prefix: 'a/b/**' and 'a/b/*.css' both stem to 'a/b'."""
    parts = []
    for seg in g.strip('/').split('/'):
        if any(c in seg for c in '*?['):
            break
        parts.append(seg)
    return '/'.join(parts)


def overlap(a, b):
    """True when two comma-separated path-glob lists may touch the same file.

    Conservative on purpose: a false "overlap" costs a serial run, a false
    "disjoint" costs a conflicted landing. Two globs overlap when either matches
    the other as text, or one's fixed prefix contains the other's."""
    for x in a:
        for y in b:
            if fnmatch.fnmatch(x, y) or fnmatch.fnmatch(y, x):
                return True
            sx, sy = _stem(x), _stem(y)
            if sx == sy or sx.startswith(sy + '/') or sy.startswith(sx + '/'):
                return True
            if not sx or not sy:
                return True   # a glob with no fixed prefix can match anywhere
    return False


def read(root):
    try:
        with open(os.path.join(root, RESUME), encoding='utf-8') as f:
            return f.read()
    except OSError as e:
        raise Unparsed(f'cannot read {os.path.join(root, RESUME)} ({e.strerror})')


def write(root, text):
    with open(os.path.join(root, RESUME), 'w', encoding='utf-8') as f:
        f.write(text)


def _mins(m, at):
    started = dt.datetime.fromisoformat(m.group(1).replace('Z', '+00:00'))
    return ((at or now_utc()) - started).total_seconds() / 60


def status(root, at=None, limit=DEFAULT_LIMIT):
    """0: room to dispatch (lines may be open, each is printed) · 3: at the limit ·
    4: a line is past its cap · 5: unreadable."""
    ms = lines_in(read(root))
    if not ms:
        return 0, 'inflight: nothing in flight'
    past = [m for m in ms if _mins(m, at) >= int(m.group(2))]
    if past:
        return 4, ('inflight: PAST CAP — stop the workflow, keep `out`, record logged, close it: '
                   + ' | '.join(f'{_mins(m, at):.0f}/{m.group(2)} min {m.group(0)}' for m in past))
    listing = ' | '.join(f'{_mins(m, at):.0f}/{m.group(2)} min {m.group(0)}' for m in ms)
    if len(ms) >= limit:
        return 3, f'inflight: IN FLIGHT {len(ms)}/{limit} — hold (dispatch nothing): {listing}'
    return 0, (f'inflight: {len(ms)}/{limit} in flight, room for {limit - len(ms)} more '
               f'(open refuses overlapping paths): {listing}')


def cmd_open(root, a, limit=DEFAULT_LIMIT):
    text = read(root)
    ms = lines_in(text)
    if len(ms) >= limit:
        return 1, f'inflight: {len(ms)}/{limit} in flight — at the limit. ' + ' | '.join(m.group(0) for m in ms)
    started = a.get('started') or now_utc().isoformat().replace('+00:00', 'Z')
    for k in ('wf', 'item', 'cap', 'session', 'out', 'paths'):
        if not a.get(k) or re.search(r'\s', a[k]):
            return 2, f'inflight: --{k} is required and may not contain spaces'
    if any(wf_of(m) == a['wf'] for m in ms):
        return 1, f"inflight: wf={a['wf']} is already open"
    mine = a['paths'].split(',')
    for m in ms:
        if overlap(mine, paths_of(m)):
            return 1, f"inflight: paths={a['paths']} overlap an open line — run serially: " + m.group(0)
    line = f"wf={a['wf']} item={a['item']} started={started} cap={int(a['cap'])} session={a['session']} out={a['out']} paths={a['paths']}"
    b = section_bounds(text)
    if b:
        text = text[:b[0]] + line + '\n' + text[b[0]:]
    else:
        # the heading goes directly under the file's title block, before the first ## section
        first = re.search(r'^## ', text, re.M)
        at = first.start() if first else len(text)
        text = text[:at] + HEADING + '\n' + line + '\n\n' + text[at:]
    write(root, text)
    return 0, 'inflight: opened ' + line


def cmd_close(root, a=None):
    text = read(root)
    ms = lines_in(text)
    if not ms:
        return 1, 'inflight: nothing to close'
    wf = (a or {}).get('wf')
    if wf:
        pick = [m for m in ms if wf_of(m) == wf]
        if not pick:
            return 1, f'inflight: no open line has wf={wf}'
    elif len(ms) == 1:
        pick = ms
    else:
        return 2, f'inflight: {len(ms)} lines are open; say which with --wf ID'
    b = section_bounds(text)
    kept = [l for l in text[b[0]:b[1]].split('\n') if l.rstrip() != pick[0].group(0)]
    write(root, text[:b[0]] + '\n'.join(kept) + text[b[1]:])
    return 0, 'inflight: closed ' + pick[0].group(0)


def cmd_hold(root, limit=DEFAULT_LIMIT):
    code, msg = status(root, limit=limit)
    if code == 3:
        ts = now_utc().isoformat().replace('+00:00', 'Z')
        with open(os.path.join(root, HOLDS), 'a', encoding='utf-8') as f:
            for m in lines_in(read(root)):
                f.write(json.dumps({'ts': ts, 'line': m.group(0)}) + '\n')
    return code, msg


def parse(argv):
    a, i = {}, 0
    while i < len(argv):
        if argv[i].startswith('--') and i + 1 < len(argv):
            a[argv[i][2:]] = argv[i + 1]; i += 2
        else:
            i += 1
    return a


def self_test():
    bad, checked = [], [1]  # the ROOT check below counts as one
    with tempfile.TemporaryDirectory() as root:
        os.makedirs(os.path.join(root, '.roundtable'))
        write(root, '# Resume\n\nintro\n\n## GOAL\n\ngoal text\n')
        def expect(name, got, want):
            checked[0] += 1
            if got[0] != want:
                bad.append(f'{name}: expected {want}, got {got}')
        expect('status with no line', status(root), 0)
        expect('close with no line', cmd_close(root), 1)
        args = dict(wf='wf_x', item='393.2', cap='2', session='s1', out='/tmp/o', paths='a/*')
        expect('open', cmd_open(root, args), 0)
        if '## In flight\nwf=wf_x' not in read(root) or read(root).index('## In flight') > read(root).index('## GOAL'):
            bad.append('open did not place the line under a new ## In flight heading before ## GOAL')
        expect('second open refused', cmd_open(root, args), 1)
        expect('status under cap', status(root), 3)
        expect('status past a 2-minute cap', status(root, at=now_utc() + dt.timedelta(minutes=3)), 4)
        expect('hold under cap', cmd_hold(root), 3)
        with open(os.path.join(root, HOLDS)) as f:
            if sum(1 for _ in f) != 1:
                bad.append('hold did not append exactly one row')
        expect('close', cmd_close(root), 0)
        expect('status after close', status(root), 0)
        expect('reopen after close', cmd_open(root, {**args, 'wf': 'wf_y'}), 0)

        # 398.2 — the re-score's five malformed lines, then every other state
        # that cannot be read. None of them may read as "nothing in flight".
        z = now_utc().isoformat().replace('+00:00', 'Z')
        good = f'wf=wf_z item=398.2 started={z} cap=60 session=s1 out=/tmp/o paths=a/*'
        cases = [
            ('a trailing space parses', good + '  ', 3),
            ('a space in paths', good.replace('paths=a/*', 'paths=a/* b/*'), UNPARSED),
            ('fields reordered', good.replace('wf=wf_z item=398.2', 'item=398.2 wf=wf_z'), UNPARSED),
            ('cap=60m', good.replace('cap=60 ', 'cap=60m '), UNPARSED),
            ('a bullet prefix', '- ' + good, UNPARSED),
            ('two lines at a limit of 1 hold', good + '\n' + good.replace('wf_z', 'wf_w'), 3),
            ('the same wf twice', good + '\n' + good, UNPARSED),
            ('started with no timezone', good.replace(z, z[:-1]), UNPARSED),
            ('started not a time', good.replace(z, 'yesterday'), UNPARSED),
        ]
        for name, body, want in cases:
            write(root, f'# Resume\n\n## In flight\n{body}\n\n## Uncommitted\n')
            expect(name, run(root, 'status'), want)
        rows = sum(1 for _ in open(os.path.join(root, HOLDS)))
        expect('hold on an unparsed line', run(root, 'hold'), UNPARSED)
        if sum(1 for _ in open(os.path.join(root, HOLDS))) != rows:
            bad.append('hold appended a row for a line it could not parse')
        expect('open over an unparsed line', run(root, 'open', ['--wf', 'wf_q', '--item', 'x', '--cap', '5',
                                                              '--session', 's', '--out', 'o', '--paths', 'p']), UNPARSED)
        expect('close over an unparsed line', run(root, 'close'), UNPARSED)
        write(root, f'# Resume\n\n## In flight\n{good}  \n\n## Uncommitted\n')
        expect('close removes a line with trailing whitespace', run(root, 'close'), 0)
        expect('status after that close', run(root, 'status'), 0)
        # 417.1 — several lines: a limit above 1, disjoint paths, overlap refused.
        write(root, '# Resume\n\n## In flight\n\n## Uncommitted\n')
        base = dict(item='417.1', cap='60', session='s1', out='/tmp/o')
        L = ['--limit', '3']
        def op(wf, paths, extra=()):
            return run(root, 'open', ['--wf', wf, '--item', base['item'], '--cap', base['cap'], '--session', 's1',
                                      '--out', '/tmp/o', '--paths', paths, *L, *extra])
        expect('first of three opens', op('wf_a', 'packages/core/**'), 0)
        expect('a disjoint second opens', op('wf_b', 'apps/docs/src/**'), 0)
        expect('status with room says 0', run(root, 'status', L), 0)
        expect('an overlapping third is refused (nested glob)', op('wf_c', 'packages/core/src/css/*.css'), 1)
        expect('an overlapping third is refused (same file)', op('wf_c', 'apps/docs/src/pages/x.astro'), 1)
        expect('a wf id already open is refused', op('wf_a', 'scripts/loops/*.py'), 1)
        expect('a glob with no fixed prefix overlaps everything', op('wf_c', '**/*.css'), 1)
        expect('a disjoint third opens', op('wf_c', 'scripts/loops/*.py'), 0)
        expect('a fourth is refused at the limit', op('wf_d', 'docs/x/*'), 1)
        expect('status at the limit holds', run(root, 'status', L), 3)
        rows = sum(1 for _ in open(os.path.join(root, HOLDS)))
        expect('hold at the limit', run(root, 'hold', L), 3)
        if sum(1 for _ in open(os.path.join(root, HOLDS))) != rows + 3:
            bad.append('hold at the limit did not append one row per open line')
        expect('close with several open needs --wf', run(root, 'close'), 2)
        expect('close of an unknown wf', run(root, 'close', ['--wf', 'wf_zz']), 1)
        expect('close one by id', run(root, 'close', ['--wf', 'wf_b']), 0)
        if 'wf=wf_a' not in read(root) or 'wf=wf_c' not in read(root) or 'wf=wf_b' in read(root):
            bad.append('close --wf removed the wrong line')
        expect('status with two open and a limit of 3', run(root, 'status', L), 0)
        write(root, '# Resume\n\n## In flight\n' + good + '\nwf=wf_bad item=x\n\n## Uncommitted\n')
        expect('a malformed line among good ones is still a STOP', run(root, 'status', L), UNPARSED)
        old = (now_utc() - dt.timedelta(minutes=90)).isoformat().replace('+00:00', 'Z')
        write(root, '# Resume\n\n## In flight\n' + good + '\n'
              + f'wf=wf_old item=x started={old} cap=60 session=s1 out=/tmp/o paths=q/*\n\n## Uncommitted\n')
        expect('one line past its cap among fresh ones is exit 4', run(root, 'status', L), 4)

        os.remove(os.path.join(root, RESUME))
        expect('a missing RESUME.md', run(root, 'status'), UNPARSED)
    if not os.path.exists(os.path.join(ROOT, 'scripts', 'loops', 'inflight.py')):
        bad.append(f'ROOT does not resolve to the repo: {ROOT}')
    if bad:
        print('inflight --self-test FAILED:\n  ' + '\n  '.join(bad), file=sys.stderr)
        return 1
    print(f'inflight --self-test: {checked[0]} cases behave (status 0/3/4/5, open, refused second open, '
          'hold row, close, reopen; 398.2: the five malformed lines, two lines, bad started, '
          'hold/open/close over an unparsed line, a missing RESUME.md, the root; 417.1: three lines, overlap refused, limit, close by id, one bad or late line among good ones)')
    return 0


def run(root, cmd, argv=()):
    """One command; an unreadable in-flight state is exit 5 for every command."""
    a = parse(list(argv))
    limit = int(a.get('limit', DEFAULT_LIMIT))
    try:
        if cmd == 'open':
            return cmd_open(root, a, limit)
        if cmd == 'close':
            return cmd_close(root, a)
        if cmd == 'hold':
            return cmd_hold(root, limit)
        return status(root, limit=limit)
    except Unparsed as e:
        return UNPARSED, f'inflight: STOP — {e}. Fix it by hand; dispatch nothing until it parses.'


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        sys.exit(self_test())
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    code, msg = run(ROOT, cmd, sys.argv[2:])
    print(msg)
    sys.exit(code)
