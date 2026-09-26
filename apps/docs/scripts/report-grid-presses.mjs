/**
 * The grid-press corpus sweep behind 375.9's figure, committed (roadmap 377.13).
 *
 * 375.9 made a data-table's error message stop resizing anything on focus or
 * blur, so a press on a control below or beside the grid is never lost to a
 * layout jump between mousedown and mouseup. Its DONE note quotes a corpus
 * figure, "0 of 4944 presses lost (baseline control lost 92 of 358)", taken by
 * a script that lived only in session scratch. This is that script, with its
 * in-page measurement kept verbatim and its plumbing made repo-relative.
 *
 * For every `.bo-data-table-container` on every built page, it focuses every
 * invalid field: the real ones, plus injected ones in each table context,
 * with a short and a six-line message, scrolled to the centre and the end. It
 * reads where the message paints (a 20 x 8 hit-test grid), then drives a
 * TRUSTED press (mouse down, 20ms, up at the target's centre) on every nearby
 * interactive control, while the field has focus. A press is lost when its
 * click does not land on the control it started on.
 *
 *   npm run report:grid-presses -w docs                        both widths
 *   npm run report:grid-presses -w docs -- --width <px> --shard 0/4 --out f.json
 *   npm run report:grid-presses -w docs -- --no-anchor         simulate a browser
 *        without anchor positioning (387.1; see no-anchor.mjs)
 *   npm run report:grid-presses -w docs -- --counterfactual    re-inject the
 *        pre-375.9 toggled reserve; presses MUST be lost, or the sweep cannot fail
 *
 * It prints two counts because the old figure mixed them. `presses` counts
 * every hittable press; `focused` counts only presses on targets whose field
 * really took focus. 375.9's baseline "92 of 358" reconciles exactly with the
 * focused count of its baseline runs (220 + 138). Its "0 of 4944" matches no
 * surviving run under either count; the nearest is 4,727 (377.13).
 *
 * A report, not a gate: it is slow (thousands of trusted presses), and
 * check:claims already holds 375.9's specific cases. It walks `distPages` plus
 * `suitePages` (the ERP screens the docs sweeps skip), never `dist/v`.
 */
import { writeFile } from 'node:fs/promises';
import { launchDocsBrowser } from './browser-harness.mjs';
import { simulateNoAnchor } from './no-anchor.mjs';
import { serveDist } from './serve-dist.mjs';
import { distPages, suitePages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';
import { WIDTHS, DESKTOP_WIDTH } from './viewports.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const widths = argv.includes('--width') ? [Number(opt('--width'))] : WIDTHS;
const heightFor = (w) => (w === DESKTOP_WIDTH ? 900 : 844);
const doPress = !argv.includes('--no-press');
const MSGS = opt('--msgs', 'six,short').split(',');
const BLOCKS = opt('--blocks', 'center,end').split(',');
const MAXC = Number(opt('--maxc', '14'));
const [shI, shN] = opt('--shard', '0/1').split('/').map(Number);
const out = opt('--out', null);
// The reserve 375.9 removed: it appeared on focus and vanished on blur, so the
// mousedown that blurs the cell moved everything below the table.
const TOGGLED_RESERVE = `.bo-data-table-container:has(.bo-form-field:focus-within .bo-form-field__message)
  { padding-block-end: calc(6lh + var(--bo-space-4)) !important; }`;
const counterfactual = argv.includes('--counterfactual');
const noAnchor = argv.includes('--no-anchor');

// The docs pages AND the suite's screens: 375.9's corpus covered both.
const corpus = [...await distPages(DIST), ...(argv.includes('--no-suite') ? [] : await suitePages(DIST))];
let pages = corpus.filter((p) => p.html.includes('bo-data-table-container')).map((p) => p.url);
if (argv.includes('--pages')) { const want = opt('--pages').split(','); pages = pages.filter((p) => want.some((w) => p.includes(w))); }
pages = pages.filter((_, i) => i % shN === shI);
if (!pages.length) { console.error('report-grid-presses: no pages with a data-table container in this shard'); process.exit(1); }

const SHORT = 'Exceeds on-hand (200)';
const SIX = 'Quantity exceeds the on-hand balance of 200 at warehouse WH-01 bin A-04-2, and the open reservation for sales order SO-44871 holds a further 120 against the same bin; reduce the quantity, split the line across bins A-04-2 and A-05-1, or raise a transfer order from WH-02 before posting this goods issue, because posting now would drive the bin negative and block the period close.';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();

// ---- in-page helpers (installed once per page) ----
function installHelpers(SIX, SHORT) {
  const EDIT = 'tbody :is(input:not([type="checkbox"], [type="radio"], [type="hidden"]), select, textarea)';
  const FOCUSABLE = 'input:not([type="hidden"]), select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
  const INTERACTIVE = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])';
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.getClientRects().length > 0; };
  const desc = (el) => el ? (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label').slice(0, 30)}]` : '') + (el.textContent ? ` "${el.textContent.trim().slice(0, 24)}"` : '')) : 'null';
  window.__probe = { targets: [], restore: null, log: [] };

  // Enumerate targets for all containers. Each target = { ci, kind, make() -> {field, control, msg} , undo() }.
  window.__enumTargets = () => {
    const ctrs = [...document.querySelectorAll('.bo-data-table-container')];
    const list = [];
    ctrs.forEach((c, ci) => {
      if (!c.getClientRects().length || !c.querySelector('tbody td')) return;
      // native invalid fields
      c.querySelectorAll('.bo-data-table .bo-form-field').forEach((f, fi) => {
        const m = f.querySelector('.bo-form-field__message');
        if (m && m.textContent.trim()) list.push({ ci, kind: 'native', fi });
      });
      const edit = [...c.querySelectorAll(EDIT)].filter(visible);
      if (edit.length) {
        list.push({ ci, kind: 'inj-first-edit' });
        if (edit.length > 1) list.push({ ci, kind: 'inj-last-edit' });
      } else {
        list.push({ ci, kind: 'inj-ro-lastrow-lastcell' });
        list.push({ ci, kind: 'inj-ro-lastrow-firstcell' });
      }
    });
    window.__probe.targets = list;
    return list.map((t) => `${t.ci}:${t.kind}`);
  };

  window.__make = (ti, msgText) => {
    const t = window.__probe.targets[ti];
    const c = document.querySelectorAll('.bo-data-table-container')[t.ci];
    let field, control, msg, undo = () => {};
    if (t.kind === 'native') {
      field = c.querySelectorAll('.bo-data-table .bo-form-field')[t.fi];
      msg = field.querySelector('.bo-form-field__message');
      control = field.querySelector(FOCUSABLE);
    } else if (t.kind.startsWith('inj-first-edit') || t.kind.startsWith('inj-last-edit')) {
      const edit = [...c.querySelectorAll(EDIT)].filter(visible);
      control = t.kind === 'inj-first-edit' ? edit[0] : edit[edit.length - 1];
      const inField = control.closest('.bo-form-field');
      const hadInvalid = control.getAttribute('aria-invalid');
      control.setAttribute('aria-invalid', 'true');
      if (inField && inField.querySelector('.bo-form-field__message')) {
        field = inField; msg = inField.querySelector('.bo-form-field__message');
        const old = msg.textContent; msg.textContent = msgText;
        undo = () => { msg.textContent = old; if (hadInvalid == null) control.removeAttribute('aria-invalid'); else control.setAttribute('aria-invalid', hadInvalid); };
      } else if (inField) {
        field = inField; msg = document.createElement('span'); msg.className = 'bo-form-field__message'; msg.textContent = msgText; inField.appendChild(msg);
        undo = () => { msg.remove(); if (hadInvalid == null) control.removeAttribute('aria-invalid'); else control.setAttribute('aria-invalid', hadInvalid); };
      } else {
        const parent = control.parentNode, next = control.nextSibling;
        field = document.createElement('div'); field.className = 'bo-form-field'; field.style.marginBlockEnd = '0';
        parent.insertBefore(field, control); field.appendChild(control);
        msg = document.createElement('span'); msg.className = 'bo-form-field__message'; msg.textContent = msgText; field.appendChild(msg);
        undo = () => { parent.insertBefore(control, next); field.remove(); if (hadInvalid == null) control.removeAttribute('aria-invalid'); else control.setAttribute('aria-invalid', hadInvalid); };
      }
    } else {
      const rows = [...c.querySelectorAll('tbody tr')].filter(visible);
      const row = rows[rows.length - 1];
      const cells = [...row.children].filter(visible);
      const td = t.kind === 'inj-ro-lastrow-lastcell' ? cells[cells.length - 1] : cells[0];
      field = document.createElement('div'); field.className = 'bo-form-field'; field.style.marginBlockEnd = '0';
      control = document.createElement('input'); control.className = 'bo-input'; control.setAttribute('aria-invalid', 'true'); control.setAttribute('aria-label', 'probe'); control.value = '450';
      msg = document.createElement('span'); msg.className = 'bo-form-field__message'; msg.textContent = msgText;
      field.append(control, msg); td.appendChild(field);
      undo = () => field.remove();
    }
    window.__probe.cur = { field, control, msg, undo, c };
    return !!(field && control && msg);
  };

  window.__scroll = (block) => { const { control } = window.__probe.cur; control.scrollIntoView({ block, inline: 'nearest' }); };
  window.__focus = () => { const { control } = window.__probe.cur; control.focus({ preventScroll: true }); return document.activeElement === control; };

  window.__read = () => {
    const { field, control, msg, c } = window.__probe.cur;
    const cs = getComputedStyle(msg);
    const b = msg.getBoundingClientRect();
    // paint probe: restore pointer-events for the probe only
    msg.setAttribute('data-probe-msg', '');
    const st = document.createElement('style'); st.textContent = '[data-probe-msg], [data-probe-msg] * { pointer-events: auto !important }'; document.head.appendChild(st);
    let hit = 0, tot = 0, off = 0; const coveredBy = {};
    for (let yi = 0; yi < 20; yi++) for (let xi = 0; xi < 8; xi++) {
      const x = b.left + 3 + (b.width - 6) * xi / 7, y = b.top + 3 + (b.height - 6) * yi / 19; tot++;
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) { off++; continue; }
      const e = document.elementFromPoint(x, y);
      if (e && (e === msg || msg.contains(e))) hit++; else { const k = desc(e).slice(0, 60); coveredBy[k] = (coveredBy[k] || 0) + 1; }
    }
    st.remove(); msg.removeAttribute('data-probe-msg');
    // fixed-containing-block / stacking ancestors of the message
    const anc = [];
    for (let a = msg.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const s = getComputedStyle(a);
      const cbFixed = s.transform !== 'none' || s.filter !== 'none' || s.perspective !== 'none' || /paint|layout|strict|content/.test(s.contain) || /transform|filter/.test(s.willChange) || (s.backdropFilter && s.backdropFilter !== 'none') || s.containerType === 'size';
      const sc = (s.position !== 'static' && s.zIndex !== 'auto') || s.position === 'sticky' || s.position === 'fixed' || s.isolation === 'isolate' || parseFloat(s.opacity) < 1;
      if (cbFixed || (sc && s.zIndex !== 'auto')) anc.push(`${desc(a).slice(0, 40)}{${cbFixed ? 'CB-FIXED ' : ''}pos:${s.position} z:${s.zIndex}}`);
    }
    const fr = field.getBoundingClientRect(), cr = c.getBoundingClientRect();
    return {
      focused: document.activeElement === control,
      pos: cs.position, pe: cs.pointerEvents, display: cs.display,
      msg: { l: Math.round(b.left), t: Math.round(b.top), r: Math.round(b.right), b: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) },
      field: { l: Math.round(fr.left), t: Math.round(fr.top), r: Math.round(fr.right), b: Math.round(fr.bottom) },
      ctr: { t: Math.round(cr.top), b: Math.round(cr.bottom), padEnd: parseFloat(getComputedStyle(c).paddingBlockEnd) },
      below: b.top >= fr.bottom - 1, above: b.bottom <= fr.top + 1,
      textOverflow: msg.scrollWidth > msg.clientWidth + 1 || msg.scrollHeight > msg.clientHeight + 1,
      hit, tot, off, coveredBy, anc: anc.slice(0, 6),
      nestedFields: field.querySelectorAll('.bo-form-field').length + (field.parentElement.closest('.bo-form-field') ? 1 : 0),
      vw: innerWidth, vh: innerHeight,
    };
  };

  // press candidates near the focused field/message
  window.__candidates = (max) => {
    const { field, control, msg, c } = window.__probe.cur;
    const fr = field.getBoundingClientRect(), mr = msg.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const R = { l: cr.left - 8, r: Math.max(cr.right, mr.right) + 8, t: Math.min(fr.top - 120, mr.top), b: Math.max(mr.bottom, cr.bottom) + 160 };
    const els = [...document.querySelectorAll(INTERACTIVE)].filter((e) => e !== control && !msg.contains(e) && !e.contains(control) && visible(e) && !e.disabled);
    const cand = [];
    for (const e of els) {
      const r = e.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < R.l || x > R.r || y < R.t || y > R.b) continue;
      if (x < 1 || y < 1 || x > innerWidth - 1 || y > innerHeight - 1) continue;
      const d = Math.hypot(Math.max(mr.left - x, 0, x - mr.right), Math.max(mr.top - y, 0, y - mr.bottom));
      cand.push({ e, d });
    }
    cand.sort((a, b) => a.d - b.d);
    window.__probe.cands = cand.slice(0, max).map((x) => x.e);
    return window.__probe.cands.map(desc);
  };
  window.__prepPress = (k) => {
    const e = window.__probe.cands[k];
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const top = document.elementFromPoint(x, y);
    const hittable = !!top && (top === e || e.contains(top) || (top.tagName === 'LABEL' && top.control === e));
    window.__probe.ev = [];
    if (!window.__probe.listening) {
      window.__probe.listening = true;
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
        window.addEventListener(type, (ev) => {
          window.__probe.ev.push({ type, inCand: !!window.__probe.curCand && (window.__probe.curCand === ev.target || window.__probe.curCand.contains(ev.target)), t: desc(ev.target).slice(0, 50) });
          if (type === 'click') ev.preventDefault();
          ev.stopImmediatePropagation();
        }, true);
      }
      // stop form submits / navigation fallbacks
      window.addEventListener('submit', (ev) => ev.preventDefault(), true);
    }
    window.__probe.curCand = e;
    window.__probe.rectBefore = { t: r.top, l: r.left };
    return { x, y, hittable, top: desc(top).slice(0, 60) };
  };
  window.__afterDown = () => { const r = window.__probe.curCand.getBoundingClientRect(); return Math.round(Math.hypot(r.top - window.__probe.rectBefore.t, r.left - window.__probe.rectBefore.l)); };
  window.__pressResult = () => {
    const ev = window.__probe.ev;
    const click = ev.find((x) => x.type === 'click');
    const down = ev.find((x) => x.type === 'mousedown'), up = ev.find((x) => x.type === 'mouseup');
    return { clickInCand: !!click && click.inCand, downIn: !!down && down.inCand, upIn: !!up && up.inCand, click: click?.t ?? null, isSelect: window.__probe.curCand.tagName === 'SELECT' };
  };
  window.__undo = () => { window.__probe.cur?.undo(); document.activeElement?.blur?.(); };
}

async function sweep(width) {
  const height = heightFor(width);
  const results = [];
  for (const rel of pages) {
    const url = `http://localhost:${port}${base}${rel}`;
    const p = await browser.newPage();
    await p.setViewport({ width, height });
    const noAnchorStats = noAnchor ? await simulateNoAnchor(p) : null;
    try {
      await p.goto(url, { waitUntil: 'load', timeout: 60000 });
      if (counterfactual) await p.addStyleTag({ content: TOGGLED_RESERVE });
      await p.evaluate(installHelpers, SIX, SHORT);
      const tlist = await p.evaluate(() => window.__enumTargets());
      for (let ti = 0; ti < tlist.length; ti++) {
        const [ciS, kind] = tlist[ti].split(':');
        for (const [msgName, msgText] of kind === 'native' ? [['native', null]] : [['six', SIX], ['short', SHORT]].filter(([n]) => MSGS.includes(n))) {
          for (const block of BLOCKS) {
            const ok = await p.evaluate((ti, m) => window.__make(ti, m), ti, msgText ?? undefined).catch((e) => String(e));
            if (ok !== true) { results.push({ page: rel, ti, ci: +ciS, kind, msgName, block, error: 'make failed ' + ok }); continue; }
            await p.evaluate((b) => window.__scroll(b), block);
            await sleep(60);
            const focused = await p.evaluate(() => window.__focus());
            await sleep(180);
            const read = await p.evaluate(() => window.__read());
            const rec = { page: rel, ti, ci: +ciS, kind, msgName, block, focusedOk: focused, ...read, presses: [] };
            // presses: centre only, and only the six-line message (the tallest overlay) or a native one
            if (doPress && block === 'center' && (msgName === 'six' || msgName === 'native')) {
              const names = await p.evaluate((m) => window.__candidates(m), kind === 'native' ? 40 : MAXC);
              for (let k = 0; k < names.length; k++) {
                await p.evaluate(() => window.__focus());
                await sleep(120);
                const pre = await p.evaluate((k) => window.__prepPress(k), k);
                if (!pre.hittable) { rec.presses.push({ cand: names[k], skipped: 'not hittable', top: pre.top }); continue; }
                await p.mouse.move(pre.x, pre.y);
                await p.mouse.down();
                await sleep(20);
                const shift = await p.evaluate(() => window.__afterDown());
                await sleep(40);
                await p.mouse.up();
                await sleep(80);
                const res = await p.evaluate(() => window.__pressResult());
                const landed = res.clickInCand || (res.isSelect && res.downIn && res.upIn);
                rec.presses.push({ cand: names[k], landed, shift, ...res });
              }
            }
            results.push(rec);
            await p.evaluate(() => window.__undo());
            await sleep(30);
          }
        }
      }
    } catch (e) {
      results.push({ page: rel, error: String(e).slice(0, 300) });
    }
    if (noAnchorStats && (noAnchorStats.passedThrough || !noAnchorStats.rewritten)) {
      results.push({ page: rel, error: `--no-anchor did not apply: ${JSON.stringify(noAnchorStats)}` });
    }
    await p.close();
  }
  return results;
}

const all = {};
let anyLost = 0;
for (const w of widths) {
  const results = await sweep(w);
  all[w] = results;
  const recs = results.filter((r) => !r.error);
  const ok = recs.filter((r) => r.focusedOk);
  const pr = recs.flatMap((r) => r.presses.filter((x) => !x.skipped));
  const prOk = ok.flatMap((r) => r.presses.filter((x) => !x.skipped));
  const lost = pr.filter((x) => !x.landed).length;
  anyLost += lost;
  console.log(`${w}x${heightFor(w)}${counterfactual ? ' COUNTERFACTUAL' : ''}${noAnchor ? ' NO-ANCHOR' : ''}: pages ${new Set(recs.map((r) => r.page)).size}, ` +
    `targets ${recs.length} (focused ${ok.length}), errors ${results.length - recs.length}, ` +
    `presses ${pr.length} lost ${lost} | focused-only presses ${prOk.length} lost ${prOk.filter((x) => !x.landed).length}`);
}
await browser.close();
server.close();
if (out) await writeFile(out, JSON.stringify(all, null, 1));
if (counterfactual && !anyLost) {
  console.error('report-grid-presses: the counterfactual lost NO press, so this sweep cannot fail — the instrument is broken');
  process.exit(1);
}
