"""replay.py <script> [--old] — for each of the 18 known stale sites
(measure-346.1 §3) run the check at that commit and say whether the site's
line is printed, and under which number. --old also passes the old spelling."""
import subprocess, sys, re
SITES = [('ccb7d3ce',812,'five write-ups'),('71b44721',1470,'31 commits'),('ba527917',428,'50 checked'),
 ('ef27a35a',1332,'two false positives'),('623c98d9',5274,'THREE rows lack a qualifying terminal page'),
 ('b7317ff9',444,'231.2 twice and landed once'),('b7317ff9',458,"at least three wakes' work"),
 ('26d464fe',699,'3 ms'),('26d464fe',671,'select-all 3 ms'),('3d35a79e',318,'three commits'),
 ('11503760',612,'4,676'),('11503760',536,'7.2%'),('5ce62916',5428,'4 of 15'),('a4a3ffb5',541,'2,184'),
 ('a4a3ffb5',543,'4,272'),('a4a3ffb5',543,'32 pointer lines'),('7d46218d',1410,'4,429'),('ee826a4b',342,'6 lists')]
OOS = [('534c4593',1110,None),('411a6663',592,None)]
script = sys.argv[1]; old = '--old' in sys.argv
repo = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip()
cache = {}
def listed(c, extra=()):
    key = (c, extra)
    if key not in cache:
        args = [sys.executable, script, '--commit', c]
        for e in extra: args += ['--old', e]
        r = subprocess.run(args, capture_output=True, text=True, cwd=repo)
        if r.returncode == 2: print('ERR', c, r.stderr[:300]); sys.exit(2)
        got, num = {}, None
        for l in r.stdout.split('\n'):
            m = re.match(r'  "([^"]+)" \(', l)
            if m: num = m.group(1)
            m = re.match(r'\s+L(\d+): ', l)
            if m: got.setdefault(int(m.group(1)), []).append(num)
        cache[key] = got
    return cache[key]
hit = 0
for c, ln, sp in SITES + OOS:
    g = listed(c, (sp,) if (old and sp) else ())
    ok = ln in g; hit += ok
    print(f'{c} L{ln:<5} {sp or "(out of sample)"[:40]:<44} {"LISTED via " + ",".join(g[ln]) if ok else "-"}')
print(f'{hit} of {len(SITES)+len(OOS)} listed ({"with --old" if old else "diff alone"})')
