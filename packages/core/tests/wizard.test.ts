import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initWizard', () => {
  function wizard(): HTMLElement {
    html`
      <div data-wizard data-wizard-current="0">
        <ol class="bo-stepper" role="list">
          <li class="bo-stepper__step" aria-current="step">One</li>
          <li class="bo-stepper__step">Two</li>
          <li class="bo-stepper__step">Three</li>
        </ol>
        <div data-wizard-panel>Panel one</div>
        <div data-wizard-panel hidden>Panel two</div>
        <div data-wizard-panel hidden>Panel three</div>
        <button type="button" data-wizard-back>Back</button>
        <button type="button" data-wizard-next>Next</button>
        <button type="submit" data-wizard-submit hidden>Submit</button>
      </div>
    `;
    ui.initWizard();
    return document.querySelector('[data-wizard]')!;
  }

  it('starts on step 0: back disabled, only the first panel visible', () => {
    const root = wizard();
    expect(root.querySelector('[data-wizard-back]')!.hasAttribute('disabled')).toBe(true);
    const panels = root.querySelectorAll('[data-wizard-panel]');
    expect((panels[0] as HTMLElement).hidden).toBe(false);
    expect((panels[1] as HTMLElement).hidden).toBe(true);
  });

  it('Next advances the panel, updates the stepper, and moves focus to the new panel', () => {
    const root = wizard();
    const steps = root.querySelectorAll('.bo-stepper__step');
    root.querySelector<HTMLElement>('[data-wizard-next]')!.click();
    const panels = root.querySelectorAll('[data-wizard-panel]');
    expect((panels[0] as HTMLElement).hidden).toBe(true);
    expect((panels[1] as HTMLElement).hidden).toBe(false);
    expect(steps[0].getAttribute('data-state')).toBe('done');
    expect(steps[1].getAttribute('aria-current')).toBe('step');
    expect(steps[0].hasAttribute('aria-current')).toBe(false);
    expect(document.activeElement).toBe(panels[1]);
  });

  it('Back retreats a step; Next on the last panel reveals Submit instead', () => {
    const root = wizard();
    const next = root.querySelector<HTMLElement>('[data-wizard-next]')!;
    next.click(); // -> step 1
    next.click(); // -> step 2 (last)
    expect(next.hidden).toBe(true);
    expect(root.querySelector('[data-wizard-submit]')!.hidden).toBe(false);
    root.querySelector<HTMLElement>('[data-wizard-back]')!.click(); // -> step 1
    expect(root.querySelectorAll('[data-wizard-panel]')[1].hasAttribute('hidden')).toBe(false);
    expect(next.hidden).toBe(false);
  });
});
