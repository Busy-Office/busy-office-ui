"""window.py <script> <end-rev> [N] — run a check_correction_sites version over the
last N ROADMAP.md commits reachable from <end-rev>; print reports and printed site lines."""
import subprocess, sys, re, json, os
script, end = sys.argv[1], sys.argv[2]
N = int(sys.argv[3]) if len(sys.argv) > 3 else 150
repo = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip()
cs = subprocess.run(['git', '-C', repo, 'log', '--no-merges', '--format=%h', end, '--', 'ROADMAP.md'],
                    capture_output=True, text=True).stdout.split()[:N]
reports = lines = 0; out = {}
for c in cs:
    r = subprocess.run([sys.executable, script, '--commit', c], capture_output=True, text=True, cwd=repo)
    if r.returncode == 2 or r.returncode not in (0, 1):
        print('ERR', c, r.stderr[:200]); continue
    site = [l for l in r.stdout.split('\n') if re.match(r'\s+L\d+: ', l)]
    if r.returncode == 1:
        reports += 1; lines += len(site); out[c] = r.stdout
print(f'{len(cs)} commits ({cs[-1]}..{cs[0]}): {reports} reports, {lines} printed site lines')
json.dump(out, open(sys.argv[4] if len(sys.argv) > 4 else os.devnull, 'w'), indent=1)
