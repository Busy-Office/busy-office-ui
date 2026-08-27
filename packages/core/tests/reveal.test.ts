import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

/**
 * The live claims check (`check-claims.mjs`) drives the real page with the
 * behaviors installed. These cover the branch it cannot reach: markup whose
 * owning behavior was never initialised, where pressing the trigger does
 * nothing and `reveal` has to notice that and fall back.
 *
 * That branch exists because the first version of this fix assumed the press
 * landed. It did not — the tabs delegation matches `.bo-tabs__tab[role=tab]`,
 * so a panel whose tab lacks the class was never activated, and `reveal`
 * reported success while the field stayed hidden.
 */
describe('reveal', () => {
  it('opens a closed <details> so its field can be focused', () => {
    html`
      <details id="d"><summary>More</summary><input id="f" /></details>
    `;
    ui.reveal(document.getElementById('f')!);
    expect((document.getElementById('d') as HTMLDetailsElement).open).toBe(true);
  });

  it('falls back when a tab panel has no tab pointing at it', () => {
    html`<div role="tabpanel" id="p" hidden><input id="f" /></div>`;
    ui.reveal(document.getElementById('f')!);
    expect(document.getElementById('p')!.hasAttribute('hidden')).toBe(false);
  });

  it('falls back — and fixes aria — when the tab behavior is not installed', () => {
    // No initTabs(): clicking the tab does nothing, so the press cannot work.
    html`
      <div role="tablist">
        <button role="tab" id="t" aria-controls="p" aria-selected="false">Terms</button>
      </div>
      <div role="tabpanel" id="p" hidden><input id="f" /></div>
    `;
    ui.reveal(document.getElementById('f')!);
    expect(document.getElementById('p')!.hasAttribute('hidden')).toBe(false);
    // Revealed but still announced as unselected would be a worse bug than the
    // one being fixed: visible to sighted users, absent to a screen reader.
    expect(document.getElementById('t')!.getAttribute('aria-selected')).toBe('true');
  });

  it('falls back — and fixes aria — when the collapse behavior is not installed', () => {
    html`
      <button data-collapse-trigger aria-expanded="false" aria-controls="c">Notes</button>
      <div class="bo-widget__collapse" id="c" data-state="closed"><input id="f" /></div>
    `;
    ui.reveal(document.getElementById('f')!);
    expect(document.getElementById('c')!.dataset.state).toBe('open');
    expect(
      document.querySelector('[data-collapse-trigger]')!.getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('defers to the installed behavior rather than writing state itself', () => {
    ui.initCollapsibleCards();
    html`
      <button data-collapse-trigger aria-expanded="false" aria-controls="c">Notes</button>
      <div class="bo-widget__collapse" id="c" data-state="closed"><input id="f" /></div>
    `;
    ui.reveal(document.getElementById('f')!);
    expect(document.getElementById('c')!.dataset.state).toBe('open');
    expect(
      document.querySelector('[data-collapse-trigger]')!.getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('does nothing to an element that is already visible', () => {
    html`<div id="wrap"><input id="f" /></div>`;
    const before = document.getElementById('wrap')!.outerHTML;
    ui.reveal(document.getElementById('f')!);
    expect(document.getElementById('wrap')!.outerHTML).toBe(before);
  });

  it('opens an OUTER container as well as the inner one', () => {
    html`
      <details id="outer"><summary>Outer</summary>
        <div class="bo-widget__collapse" id="inner" data-state="closed"><input id="f" /></div>
      </details>
    `;
    ui.reveal(document.getElementById('f')!);
    expect((document.getElementById('outer') as HTMLDetailsElement).open).toBe(true);
    expect(document.getElementById('inner')!.dataset.state).toBe('open');
  });
});
