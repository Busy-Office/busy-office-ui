import { page } from '../_shell.mjs';

/* An opportunity DOES have a chain — but it is a forecast, not a history.
   The stepper's "you are here" points at a stage that can go BACKWARDS,
   which no document flow in this suite can do: a deal in Negotiation can
   fall back to Proposal. bo-stepper carries it because the stages are
   ordered and named; what it must not imply is that the later ones have
   been earned. */
export const render = () =>
  page({
    title: 'OPP-2201',
    moduleId: 'crm',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'CRM', href: '/crm/accounts.html' },
      { label: 'Opportunities', href: '/crm/opportunities.html' },
      { label: 'OPP-2201' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">OPP-2201 · Deck refit 2027</h1>
        <span class="bo-badge bo-badge--warning">Proposal</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Account</dt><dd><a href="/crm/account.html">Halden Marine AS</a></dd></div>
          <div><dt>Owner</dt><dd>P. Sandberg</dd></div>
          <div><dt>Expected close</dt><dd><span class="bo-u-tabular">2026-11-28</span></dd></div>
          <div><dt>Value</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">420,000<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Probability</dt><dd><span class="bo-u-tabular">60%</span></dd></div>
          <div><dt>Weighted</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">252,000<span class="bo-amount__fraction">.00</span></span></span></dd></div>
        </dl>
      </div>
    </header>

    <h2>Stage</h2>
    <p class="bo-u-text-muted">A forecast, not a history — a deal can move
    back a stage, which is why nothing here is marked done.</p>
    <ol class="bo-stepper">
      <li class="bo-stepper__step" data-state="done">
        <span class="bo-stepper__marker" aria-hidden="true">✓</span>
        <span class="bo-stepper__label">Discovery</span>
      </li>
      <li class="bo-stepper__step" data-state="done">
        <span class="bo-stepper__marker" aria-hidden="true">✓</span>
        <span class="bo-stepper__label">Qualification</span>
      </li>
      <li class="bo-stepper__step" data-state="current" aria-current="step">
        <span class="bo-stepper__marker" aria-hidden="true">●</span>
        <span class="bo-stepper__label">Proposal</span>
      </li>
      <li class="bo-stepper__step" data-state="pending">
        <span class="bo-stepper__marker" aria-hidden="true">○</span>
        <span class="bo-stepper__label">Negotiation</span>
      </li>
      <li class="bo-stepper__step" data-state="pending">
        <span class="bo-stepper__marker" aria-hidden="true">○</span>
        <span class="bo-stepper__label">Closed</span>
      </li>
    </ol>

    <h2>Activity</h2>
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Site visit — Bergen yard</p>
        <p class="bo-timeline__meta">2026-08-04 · P. Sandberg · scope confirmed for 3 decks</p>
      </li>
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Proposal sent — rev B</p>
        <p class="bo-timeline__meta">2026-08-19 · includes coated deck plate at 2026 pricing</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Awaiting their board <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Decision expected week 44</p>
      </li>
    </ol>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Advance to Negotiation</button>
      <button class="bo-btn bo-btn--secondary" type="button">Log activity</button>
      <button class="bo-btn bo-btn--ghost" type="button">Mark lost</button>
    </div>
`,
  });
