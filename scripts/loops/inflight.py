#!/usr/bin/env python3
"""The in-flight protocol: one workflow at a time (roadmap 393.2).

On 2026-09-25, 6 of 10 /loop wakes found a background Workflow still running
and could only hold, and nothing in the repo said so: a 3-hour workflow was
invisible to the hand-off. This keeps ONE structured line under RESUME.md's
`## In flight` heading while a workflow runs:

  wf=<id> item=<id> started=<UTC ISO> cap=<minutes> session=<id> out=<path> paths=<globs>

  open    --wf ID --item ID --cap MIN --session ID --out PATH --paths GLOBS [--started ISO]
          writes the line; exit 1 if one already exists (one workflow at a time).
  status  exit 0: no line · 3: a line under its cap · 4: a line past its cap ·
          5: the section holds something that does not parse, or RESUME.md
          cannot be read (398.2). Exit 5 is a STOP, never "nothing in flight".
  hold    status, and when the line is under its cap also append one row to
          .roundtable/hold-wakes.jsonl; same exits as status. This is the whole
          of a hold wake: guard, hold, schedule the next wake, stop.
  close   removes the line; exit 1 if there was none.

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


def current(text):
    """The in-flight line's match; None when the section is absent or blank.

    Raises Unparsed when the section holds anything else: a line that is not
    exactly the protocol's form (trailing whitespace aside), more than one line,
    or a `started` that is not a timezone-aware ISO time."""
    b = section_bounds(text)
    if not b:
        return None
    lines = [l.rstrip() for l in text[b[0]:b[1]].split('\n') if l.strip()]
    if not lines:
        return None
    if len(lines) > 1:
        raise Unparsed(f'{len(lines)} lines under {HEADING}; the protocol allows one: ' + ' | '.join(lines))
    m = LINE_RE.fullmatch(lines[0])
    if not m:
        raise Unparsed(f'the line under {HEADING} does not parse (expected: '
                       'wf=… item=… started=… cap=<minutes> session=… out=… paths=…, '
                       'single spaces, no bullet): ' + lines[0])
    try:
        started = dt.datetime.fromisoformat(m.group(1).replace('Z', '+00:00'))
    except ValueError:
        raise Unparsed(f'started={m.group(1)} is not an ISO time: ' + lines[0])
    if started.tzinfo is None:
        raise Unparsed(f'started={m.group(1)} has no timezone (write it in UTC with a Z): ' + lines[0])
    return m


def read(root):
    try:
        with open(os.path.join(root, RESUME), encoding='utf-8') as f:
            return f.read()
    except OSError as e:
        raise Unparsed(f'cannot read {os.path.join(root, RESUME)} ({e.strerror})')


def write(root, text):
    with open(os.path.join(root, RESUME), 'w', encoding='utf-8') as f:
        f.write(text)


def status(root, at=None):
    text = read(root)
    m = current(text)
    if not m:
        return 0, 'inflight: nothing in flight'
    started = dt.datetime.fromisoformat(m.group(1).replace('Z', '+00:00'))
    cap = int(m.group(2))
    mins = ((at or now_utc()) - started).total_seconds() / 60
    line = m.group(0)
    if mins < cap:
        return 3, f'inflight: IN FLIGHT {mins:.0f}/{cap} min — hold (dispatch nothing): {line}'
    return 4, f'inflight: PAST CAP {mins:.0f}/{cap} min — stop the workflow, keep `out`, record logged, close: {line}'


def cmd_open(root, a):
    text = read(root)
    if current(text):
        return 1, 'inflight: a workflow is already in flight — one at a time. ' + current(text).group(0)
    started = a.get('started') or now_utc().isoformat().replace('+00:00', 'Z')
    for k in ('wf', 'item', 'cap', 'session', 'out', 'paths'):
        if not a.get(k) or re.search(r'\s', a[k]):
            return 2, f'inflight: --{k} is required and may not contain spaces'
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


def cmd_close(root):
    text = read(root)
    m = current(text)
    if not m:
        return 1, 'inflight: nothing to close'
    b = section_bounds(text)
    kept = [l for l in text[b[0]:b[1]].split('\n') if l.rstrip() != m.group(0)]
    write(root, text[:b[0]] + '\n'.join(kept) + text[b[1]:])
    return 0, 'inflight: closed ' + m.group(0)


def cmd_hold(root):
    code, msg = status(root)
    if code == 3:
        m = current(read(root))
        row = {'ts': now_utc().isoformat().replace('+00:00', 'Z'), 'line': m.group(0)}
        with open(os.path.join(root, HOLDS), 'a', encoding='utf-8') as f:
            f.write(json.dumps(row) + '\n')
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
            ('two lines', good + '\n' + good.replace('wf_z', 'wf_w'), UNPARSED),
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
        os.remove(os.path.join(root, RESUME))
        expect('a missing RESUME.md', run(root, 'status'), UNPARSED)
    if not os.path.exists(os.path.join(ROOT, 'scripts', 'loops', 'inflight.py')):
        bad.append(f'ROOT does not resolve to the repo: {ROOT}')
    if bad:
        print('inflight --self-test FAILED:\n  ' + '\n  '.join(bad), file=sys.stderr)
        return 1
    print(f'inflight --self-test: {checked[0]} cases behave (status 0/3/4/5, open, refused second open, '
          'hold row, close, reopen; 398.2: the five malformed lines, two lines, bad started, '
          'hold/open/close over an unparsed line, a missing RESUME.md, the root)')
    return 0


def run(root, cmd, argv=()):
    """One command; an unreadable in-flight state is exit 5 for every command."""
    try:
        if cmd == 'open':
            return cmd_open(root, parse(list(argv)))
        if cmd == 'close':
            return cmd_close(root)
        if cmd == 'hold':
            return cmd_hold(root)
        return status(root)
    except Unparsed as e:
        return UNPARSED, f'inflight: STOP — {e}. Fix it by hand; dispatch nothing until it parses.'


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        sys.exit(self_test())
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    code, msg = run(ROOT, cmd, sys.argv[2:])
    print(msg)
    sys.exit(code)
