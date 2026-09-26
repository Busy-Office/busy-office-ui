"""mutate.py — apply each mutation to a COPY of the check placed beside it in
scripts/loops (so it resolves the repository from its own path), run that
copy's --self-test, report survivors. The tracked file is only read: an
interrupted run leaves an untracked _mutant_*.py behind, never a mutated
check."""
import subprocess, sys, os, shutil
src = 'scripts/loops/check_correction_sites.py'
mut = 'scripts/loops/_mutant_check_correction_sites.py'
orig = open(src).read()
M = {
 'M1 drop commit-message path': ("for m in NOT_N.finditer(message if M_NOT_N.search(message) else ''):", "for m in NOT_N.finditer(''):"),
 'M2 drop struck path': ("        for m in STRUCK.finditer(A):", "        for m in STRUCK.finditer(''):"),
 'M3 drop quoted path': ("            for q in QUOTED.findall(clean(line)):", "            for q in []:"),
 'M4 drop annotation path': ("        for m in NOT_N.finditer(flat):", "        for m in NOT_N.finditer(''):"),
 'M5 drop replaced path': ("            if tag != 'replace' or i2 - i1 > 3 or j2 - j1 > 3:", "            if True:"),
 'M6 ignore --old': ("        rows += [(n, o, '--old', 0, set()) for n in nums[:1]]", "        pass"),
 'M7 unbounded strike': (r"STRUCK = re.compile(r'~~(?:(?!~~)(?!\n[ \t]*\n).)+?~~', re.S)", r"STRUCK = re.compile(r'~~(?:(?!~~).)+?~~', re.S)"),
 'M8 no strike masking in occurrences': ("    masked = STRUCK.sub(lambda m: re.sub(r'[^\\n]', ' ', m.group(0)), text)", "    masked = text"),
 'M9 no unit filter': ("                             if unit & h[3]), key=lambda t: -t[0])", "                             ), key=lambda t: -t[0])"),
 'M10 unitless small lists all': ("            shown, hidden = [], len(hits)\n", "            shown, hidden = hits, 0\n"),
 'M11 sign kept': (".strip('.,;:').lstrip('+')", ".strip('.,;:')"),
 'M12 exit 0 always': ("          'claim is fine, a restatement of the old value is a missed site.')", "          'claim is fine, a restatement of the old value is a missed site.'); return 0"),
 'M13 m_unit first match': ("        if w0 + mm.end() == m.end():", "        if True:"),
 'M14 no word<->digit': ("    return [t, other] if other else [t]", "    return [t]"),
 'M15 distinctive never': ("    return len(re.sub(r'\\D', '', t)) >= 4 or bool(re.search(r'[,.%]', t))", "    return False"),
 'M16 written lines not skipped': ("        if ln in skip_lines:\n            continue", "        if False:\n            continue"),
 'M17 crash exits 1': ("        print(f'check_correction_sites: could not run: {e!r}', file=sys.stderr)\n        sys.exit(2)", "        print(f'check_correction_sites: could not run: {e!r}', file=sys.stderr)\n        sys.exit(1)"),
 'M18 --old phrase from display window': ("                     any(a <= m.start() and m.end() <= b for a, b in spans)))", "                     any(phrase in s[max(0, m.start() - 90):m.end() + 90] for _ in [0]) if phrase else False))"),
 'M19 unit not cut at punctuation': ("    head = PUNCT.split(text[:80], 1)[0]", "    head = text[:80]"),
 'M20 no stemming': ("    return w[:-1] if len(w) > 3 and w.endswith('s') and not w.endswith('ss') else w", "    return w"),
}
surv = []
try:
    for name, (a, b) in M.items():
        n = orig.count(a)
        if n != 1:
            print(f'{name}: INJECTION MATCHED {n} TIMES — not applied'); surv.append(name + ' (not applied)'); continue
        open(mut, 'w').write(orig.replace(a, b))
        r = subprocess.run([sys.executable, mut, '--self-test'], capture_output=True, text=True)
        killed = r.returncode != 0
        print(f'{name}: {"killed" if killed else "SURVIVED"}  {r.stdout.strip().splitlines()[-1][:90] if r.stdout.strip() else r.stderr.strip()[-90:]}')
        if not killed: surv.append(name)
finally:
    if os.path.exists(mut):
        os.remove(mut)
print(f'{len(M) - len(surv)} of {len(M)} killed; survivors: {surv}')
