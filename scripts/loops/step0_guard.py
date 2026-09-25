#!/usr/bin/env python3
"""Step 0 guard: may this wake dispatch at all? (roadmap 393.1)

Owner decision O1 (2026-09-25): ONE dispatcher. Two dispatchers were live on
2026-09-25 (the local /loop and two revived cloud sessions) and collided three
times in one day (LOOPS.md Step 0c, collisions 6-8). "Accept collisions"
(162.1) is reversed while Milestone M1 runs; this script is how a wake knows.

Run it FIRST at Step 0, before any other read, and AGAIN just before the
wake's first commit. Exit 0 means continue. Any other exit means STOP: do not
write, commit or push; print the message and hand off.

  3  .roundtable/HALT exists — the owner's emergency stop for EVERY wake.
     Its first line is printed.
  4  this checkout is not the dispatcher named in .roundtable/DISPATCHER.
     A cloud session's checkout root is never the owner's, so every cloud
     wake stops here — whoever sends it the wake prompt.
  5  origin/main carries a commit whose author the topology does not allow
     (a second dispatcher is live). The shas are printed for the hand-off.
  2  the guard itself could not read its inputs — a guard that cannot run
     must fail loudly, never pass quietly.

@exact — file existence, path equality and author equality; the self-test
still exercises every exit on scratch repositories, because a guard that has
never been seen to stop proves nothing.
"""
import os
import subprocess
import sys
import tempfile

DISPATCHER = '.roundtable/DISPATCHER'
HALT = '.roundtable/HALT'


def git(*args, cwd=None):
    return subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True)


def read_topology(root):
    path = os.path.join(root, DISPATCHER)
    fields = {}
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.split('#', 1)[0].strip()
            if ':' in line:
                k, v = line.split(':', 1)
                fields.setdefault(k.strip(), []).append(v.strip())
    if not fields.get('root') or not fields.get('author'):
        raise ValueError(f'{DISPATCHER} must name at least one root: and one author:')
    return fields


def check(cwd='.', fetch=True):
    top = git('rev-parse', '--show-toplevel', cwd=cwd)
    if top.returncode != 0:
        return 2, 'step0_guard: not inside a git checkout — cannot decide, so STOP.'
    root = os.path.realpath(top.stdout.strip())

    halt = os.path.join(root, HALT)
    if os.path.exists(halt):
        with open(halt, encoding='utf-8') as f:
            first = (f.readline().strip() or '(empty HALT file)')
        return 3, f'step0_guard: HALT — {first}'

    try:
        topo = read_topology(root)
    except (OSError, ValueError) as e:
        return 2, f'step0_guard: cannot read the topology ({e}) — STOP.'
    allowed_roots = {os.path.realpath(r) for r in topo['root']}
    if root not in allowed_roots:
        return 4, (f'step0_guard: this checkout ({root}) is not the dispatcher named in '
                   f'{DISPATCHER} ({", ".join(sorted(allowed_roots))}). One dispatcher '
                   f'(owner decision O1, 2026-09-25): STOP without writing, committing or pushing.')

    if fetch:
        f = git('fetch', '-q', 'origin', 'main', cwd=root)
        if f.returncode != 0:
            return 2, f'step0_guard: git fetch failed ({f.stderr.strip()}) — cannot see foreign commits, so STOP.'
    log = git('log', 'HEAD..origin/main', '--format=%h\t%an <%ae>\t%ai\t%s', cwd=root)
    if log.returncode != 0:
        return 2, f'step0_guard: git log HEAD..origin/main failed ({log.stderr.strip()}) — STOP.'
    allowed_authors = set(topo['author'])
    foreign = [l for l in log.stdout.splitlines() if l and l.split('\t')[1] not in allowed_authors]
    if foreign:
        return 5, ('step0_guard: origin/main has commits from a writer outside the topology — a second '
                   'dispatcher is live. STOP and record these in the hand-off:\n  ' + '\n  '.join(foreign))
    return 0, f'step0_guard: ok — {root} is the dispatcher; no HALT; no foreign commits upstream.'


def self_test():
    """Every exit, on scratch repositories. Fails loudly if any case misfires."""
    bad = []
    with tempfile.TemporaryDirectory() as tmp:
        tmp = os.path.realpath(tmp)
        remote = os.path.join(tmp, 'remote.git')
        local = os.path.join(tmp, 'local')
        other = os.path.join(tmp, 'cloud')
        git('init', '-q', '--bare', '-b', 'main', remote)
        git('clone', '-q', remote, local)
        os.makedirs(os.path.join(local, '.roundtable'))
        with open(os.path.join(local, DISPATCHER), 'w') as f:
            f.write(f'root: {local}\nauthor: Owner <owner@example.com>\n')
        env = ['-c', 'user.name=Owner', '-c', 'user.email=owner@example.com']
        git('add', '.', cwd=local); git(*env, 'commit', '-q', '-m', 'init', cwd=local)
        git('push', '-q', 'origin', 'HEAD:main', cwd=local)
        git('clone', '-q', remote, other)

        def expect(name, want, **kw):
            code, msg = check(**kw)
            if code != want:
                bad.append(f'{name}: expected exit {want}, got {code} ({msg})')

        expect('clean local checkout passes', 0, cwd=local)
        expect('a different checkout (a cloud session) stops', 4, cwd=other)
        with open(os.path.join(local, HALT), 'w') as f:
            f.write('owner stop for the test\n')
        expect('HALT stops even the dispatcher', 3, cwd=local)
        os.remove(os.path.join(local, HALT))
        # a foreign writer pushes from the other checkout
        with open(os.path.join(other, 'x.txt'), 'w') as f:
            f.write('x')
        git('add', '.', cwd=other)
        git('-c', 'user.name=Claude', '-c', 'user.email=noreply@anthropic.com', 'commit', '-q', '-m', 'cloud wake', cwd=other)
        git('push', '-q', 'origin', 'HEAD:main', cwd=other)
        expect('a foreign commit upstream stops the dispatcher', 5, cwd=local)
        # the owner's own upstream commit is allowed
        git('pull', '-q', '--ff-only', 'origin', 'main', cwd=local)
        with open(os.path.join(other, 'y.txt'), 'w') as f:
            f.write('y')
        git('add', '.', cwd=other)
        git('-c', 'user.name=Owner', '-c', 'user.email=owner@example.com', 'commit', '-q', '-m', 'owner', cwd=other)
        git('push', '-q', 'origin', 'HEAD:main', cwd=other)
        expect("the topology's own author upstream passes", 0, cwd=local)
        os.remove(os.path.join(local, DISPATCHER))
        expect('a missing topology stops loudly', 2, cwd=local)
    if bad:
        print('step0_guard --self-test FAILED:\n  ' + '\n  '.join(bad), file=sys.stderr)
        return 1
    print('step0_guard --self-test: 6 cases (pass, cloud checkout, HALT, foreign commit, allowed author, missing topology) behave')
    return 0


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        sys.exit(self_test())
    code, msg = check(fetch='--no-fetch' not in sys.argv)
    print(msg, file=sys.stderr if code else sys.stdout)
    sys.exit(code)
