#!/usr/bin/env python3
"""The in-flight protocol: one workflow at a time (roadmap 393.2).

On 2026-09-25, 6 of 10 /loop wakes found a background Workflow still running
and could only hold, and nothing in the repo said so: a 3-hour workflow was
invisible to the hand-off. This keeps ONE structured line under RESUME.md's
`## In flight` heading while a workflow runs:

  wf=<id> item=<id> started=<UTC ISO> cap=<minutes> session=<id> out=<path> paths=<globs>

  open    --wf ID --item ID --cap MIN --session ID --out PATH --paths GLOBS [--started ISO]
          writes the line; exit 1 if one already exists (one workflow at a time).
  status  exit 0: no line · 3: a line under its cap · 4: a line past its cap.
  hold    status, and when the line is under its cap also append one row to
          .roundtable/hold-wakes.jsonl; same exits as status. This is the whole
          of a hold wake: guard, hold, schedule the next wake, stop.
  close   removes the line; exit 1 if there was none.

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

RESUME = '.roundtable/RESUME.md'
HOLDS = '.roundtable/hold-wakes.jsonl'
HEADING = '## In flight'
LINE_RE = re.compile(r'^wf=\S+ item=\S+ started=(\S+) cap=(\d+) session=\S+ out=\S+ paths=\S+$', re.M)


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
    b = section_bounds(text)
    if not b:
        return None
    m = LINE_RE.search(text[b[0]:b[1]])
    return m


def read(root):
    with open(os.path.join(root, RESUME), encoding='utf-8') as f:
        return f.read()


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
    body = text[b[0]:b[1]].replace(m.group(0) + '\n', '', 1)
    write(root, text[:b[0]] + body + text[b[1]:])
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
    bad = []
    with tempfile.TemporaryDirectory() as root:
        os.makedirs(os.path.join(root, '.roundtable'))
        write(root, '# Resume\n\nintro\n\n## GOAL\n\ngoal text\n')
        def expect(name, got, want):
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
    if bad:
        print('inflight --self-test FAILED:\n  ' + '\n  '.join(bad), file=sys.stderr)
        return 1
    print('inflight --self-test: 11 cases behave (status 0/3/4, open, refused second open, hold row, close, reopen)')
    return 0


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        sys.exit(self_test())
    root = os.getcwd()
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if cmd == 'open':
        code, msg = cmd_open(root, parse(sys.argv[2:]))
    elif cmd == 'close':
        code, msg = cmd_close(root)
    elif cmd == 'hold':
        code, msg = cmd_hold(root)
    else:
        code, msg = status(root)
    print(msg)
    sys.exit(code)
