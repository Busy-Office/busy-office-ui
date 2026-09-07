/* Canned data for the future-ERP home screen prototype — one object per role.
   In production every one of these lists is a server query; the shape of each
   row is the design decision, the values are placeholders.

   The row shape is the same for every role, and that is deliberate:
     id · type · title · amount? · state · blocker? · who can clear it · next actor · due · actions
   A queue row is the readiness panel collapsed to one line. */

window.HOME_DATA = (() => {
  const P = (initials, name) => ({ initials, name });
  const YOU = P('RK', 'You');
  const TOFT = P('FT', 'F. Toft · Finance');
  const BAUER = P('MB', 'M. Bauer · Requester');
  const TAN = P('JT', 'J. Tan · Picker');
  const LIND = P('AL', 'A. Lind · AP');

  return {
    approver: {
      label: 'Approver',
      user: 'R. Køhler',
      role: 'Cost-centre owner · CC-4021',
      density: 'compact',
      home: 'Approvals',
      sort: ['Yours first', 'closes soonest', 'then waiting on others'],
      stats: [
        { label: 'Waiting on you', value: 5, q: 'next:me' },
        { label: 'Waiting on others', value: 2, q: 'next:other' },
        { label: 'Period 08/2026 closes in', value: '4 h', q: 'due:today' }
      ],
      rows: [
        { id: 'PO-88213', type: 'PO', title: 'Nobody Ltd — bearing housings', amount: 3322.40, state: 'submitted',
          next: YOU, due: 'Closes in 4 h', age: '2 d', actions: ['approve', 'reject'] },
        { id: 'PO-88212', type: 'PO', title: 'Stark Components — sealing ring sets', amount: 18685.95, state: 'submitted',
          blocker: '3-way match variance 2.1% — within tolerance, needs a note', severity: 'warning', who: 'You can clear this',
          next: YOU, due: 'Closes in 4 h', age: '1 d', actions: ['approve', 'reject'] },
        { id: 'INV-10237', type: 'Invoice', title: 'Umbrella Freight — August freight', amount: 15636.05, state: 'submitted',
          next: YOU, due: '—', age: '5 h', actions: ['approve', 'reject'] },
        { id: 'PO-88216', type: 'PO', title: 'Umbrella Freight — pallet wrap', amount: 6088.31, state: 'submitted',
          next: YOU, due: '—', age: '1 d', actions: ['approve', 'reject'] },
        { id: 'INV-10239', type: 'Invoice', title: 'Acme Supply Co. — July consumables', amount: 4498.20, state: 'submitted',
          next: YOU, due: '—', age: '3 h', actions: ['approve', 'reject'] },
        { id: 'PO-88214', type: 'PO', title: 'Acme Supply Co. — mounting brackets', amount: 15636.05, state: 'submitted',
          blocker: 'Exceeds your $15,000 limit — escalated', severity: 'blocker', who: 'Needs Finance',
          next: TOFT, due: 'Closes in 4 h', age: '3 d', actions: ['nudge'] },
        { id: 'INV-10240', type: 'Invoice', title: 'Initech GmbH — tooling', amount: 20287.16, state: 'submitted',
          blocker: 'Cost centre CC-9900 is closed for posting', severity: 'blocker', who: 'Requester must recode',
          next: BAUER, due: '—', age: '4 d', actions: ['nudge'] }
      ],
      commands: [
        { label: 'Approve everything waiting on you with no blocker', hint: '5 documents', kind: 'action', run: 'approve-clear' },
        { label: 'Show only what closes today', hint: 'due:today', kind: 'view', q: 'due:today' },
        { label: 'Show what is waiting on others', hint: 'next:other', kind: 'view', q: 'next:other' },
        { label: 'Delegate approvals while out of office', kind: 'action' }
      ]
    },

    ap: {
      label: 'AP clerk',
      user: 'A. Lind',
      role: 'Accounts payable',
      density: 'compact',
      home: 'Invoice entry',
      sort: ['Exceptions first', 'then ready to post', 'closes soonest within each'],
      stats: [
        { label: 'Exceptions', value: 4, q: 'state:exception' },
        { label: 'Ready to post', value: 14, q: 'state:ready' },
        { label: 'Period 08/2026 closes in', value: '4 h', q: 'due:today' }
      ],
      rows: [
        { id: 'INV-10241', type: 'Invoice', title: 'Stark Components — sealing ring sets', amount: 3280.00, state: 'exception',
          blocker: '3-way match failed — invoiced 400 PC, received 320 PC', severity: 'blocker', who: 'You can short-pay or hold',
          next: YOU, due: 'Closes in 4 h', age: '2 h', actions: ['short-pay', 'hold'] },
        { id: 'INV-10243', type: 'Invoice', title: 'Acme Supply Co. — no PO reference', amount: 1240.00, state: 'exception',
          blocker: 'No purchase order on the invoice', severity: 'blocker', who: 'You can match it to a PO',
          next: YOU, due: '—', age: '1 d', actions: ['match'] },
        { id: 'INV-10244', type: 'Invoice', title: 'Globex Industrial — possible duplicate of INV-10199', amount: 8742.37, state: 'exception',
          blocker: 'Same vendor, amount and date as INV-10199 (posted 2026-07-30)', severity: 'blocker', who: 'You can compare and reject',
          next: YOU, due: '—', age: '3 h', actions: ['compare', 'reject'] },
        { id: 'INV-10245', type: 'Invoice', title: 'Initech GmbH — tooling', amount: 20287.16, state: 'exception',
          blocker: 'Cost centre CC-9900 is closed for posting', severity: 'blocker', who: 'You can recode',
          next: YOU, due: 'Closes in 4 h', age: '30 min', actions: ['recode'] },
        { id: 'BATCH', type: 'Batch', title: '14 invoices matched and ready to post', amount: 96412.80, state: 'ready',
          next: YOU, due: 'Closes in 4 h', age: '—', actions: ['post-batch'], expandable: 14 }
      ],
      commands: [
        { label: 'Post the 14 ready invoices to period 08/2026', hint: 'irreversible without credit note', kind: 'action', run: 'post-batch' },
        { label: 'Enter a new invoice', hint: 'N', kind: 'action' },
        { label: 'Show unmatched invoices', hint: 'match:failed', kind: 'view', q: 'match:failed' },
        { label: 'Vendors on payment block', hint: 'block:payment', kind: 'view', q: 'block:payment' }
      ]
    },

    controller: {
      label: 'Finance controller',
      user: 'F. Toft',
      role: 'Finance · period close owner',
      density: 'compact',
      home: 'Period close',
      sort: ['Blocks close first', 'then your decisions', 'then stalled work'],
      stats: [
        { label: 'Blocking close', value: 3, q: 'blocks:close' },
        { label: 'Your decisions', value: 2, q: 'next:me' },
        { label: 'Period 08/2026 closes in', value: '4 h', q: 'due:today' }
      ],
      rows: [
        { id: 'CLOSE-08', type: 'Close', title: 'Accruals not posted — 3 vendors without August invoice', state: 'exception',
          blocker: 'Close cannot run with open accruals', severity: 'blocker', who: 'AP must post or accrue',
          next: LIND, due: 'Closes in 4 h', age: '—', actions: ['nudge', 'open'] },
        { id: 'CC-2205', type: 'Budget', title: 'Logistics — 104% of period budget', state: 'exception',
          blocker: 'Overrun must be approved or reclassified before close', severity: 'blocker', who: 'You decide',
          next: YOU, due: 'Closes in 4 h', age: '1 d', actions: ['approve-overrun', 'reclass'] },
        { id: 'RECON-08', type: 'Close', title: 'Bank reconciliation — 12% complete', state: 'exception',
          blocker: '41 unmatched lines', severity: 'blocker', who: 'Treasury',
          next: P('SN', 'S. Novak · Treasury'), due: 'Closes in 4 h', age: '—', actions: ['nudge', 'open'] },
        { id: 'PO-88214', type: 'PO', title: 'Acme Supply Co. — escalated: exceeds requester limit', amount: 15636.05, state: 'submitted',
          next: YOU, due: 'Closes in 4 h', age: '3 d', actions: ['approve', 'reject'] },
        { id: 'PO-88219', type: 'PO', title: 'Stark Components — escalated: new vendor terms', amount: 42100.00, state: 'submitted',
          next: YOU, due: '—', age: '6 h', actions: ['approve', 'reject'] },
        { id: 'STALLED', type: 'Approvals', title: '7 documents waiting more than 3 days', amount: 118240.55, state: 'submitted',
          blocker: 'Oldest: INV-10240, 4 days at requester', severity: 'warning', who: 'Various approvers',
          next: P('··', '5 people'), due: '—', age: '3–6 d', actions: ['nudge-all', 'open'], expandable: 7 }
      ],
      commands: [
        { label: 'What is blocking close?', hint: 'explain', kind: 'explain', about: 'CLOSE-08' },
        { label: 'Nudge every stalled approver', hint: '5 people', kind: 'action', run: 'nudge-all' },
        { label: 'Show escalations waiting on you', hint: 'next:me type:escalation', kind: 'view', q: 'next:me' },
        { label: 'Spend by cost centre vs last period', hint: 'report', kind: 'screen' }
      ]
    },

    warehouse: {
      label: 'Warehouse lead',
      user: 'D. Okafor',
      role: 'Warehouse 0210 · shift 2',
      density: 'spacious',
      home: 'Shift',
      sort: ['Exceptions first', 'then tasks due this shift', 'oldest within each'],
      stats: [
        { label: 'Exceptions', value: 4, q: 'state:exception' },
        { label: 'Open tasks', value: 49, q: 'state:task' },
        { label: 'Shift ends in', value: '3 h 20', q: 'due:shift' }
      ],
      rows: [
        { id: 'GR-88213', type: 'Receipt', title: 'Short delivery — 21 of 24 PC bearing housings', state: 'exception',
          blocker: 'Line cannot close until the shortfall has a reason code', severity: 'blocker', who: 'You can accept short or reject',
          next: YOU, due: 'Truck leaves 14:30', age: '12 min', actions: ['accept-short', 'reject'] },
        { id: 'B-11-03', type: 'Bin', title: 'Count variance −4 DRM hydraulic fluid', state: 'exception',
          blocker: 'Bin blocked for picking until recounted', severity: 'blocker', who: 'You can assign a recount',
          next: YOU, due: '—', age: '40 min', actions: ['recount'] },
        { id: 'PL-4471', type: 'Pick', title: 'Stalled 40 min at line 3 of 4', state: 'task',
          blocker: 'Picker has not scanned since 13:12', severity: 'warning', who: 'You can reassign',
          next: TAN, due: 'Wave closes 15:00', age: '40 min', actions: ['reassign', 'nudge'] },
        { id: 'SKU-90233', type: 'Material', title: 'Mounting bracket — 60 PC received, no bin assigned', state: 'exception',
          blocker: 'Stock is in receiving, not pickable', severity: 'warning', who: 'You can assign a bin',
          next: YOU, due: '—', age: '1 h', actions: ['assign-bin'] },
        { id: 'TASKS-GR', type: 'Receipts', title: '12 deliveries due this shift', state: 'task', next: P('··', '3 receivers'), due: 'By 18:00', age: '—', actions: ['open'], expandable: 12 },
        { id: 'TASKS-PK', type: 'Picks', title: '34 pick lists in wave 2', state: 'task', next: P('··', '6 pickers'), due: 'Wave closes 15:00', age: '—', actions: ['open'], expandable: 34 },
        { id: 'TASKS-CT', type: 'Counts', title: '3 cycle counts scheduled', state: 'task', next: YOU, due: 'By 18:00', age: '—', actions: ['open'], expandable: 3 }
      ],
      commands: [
        { label: 'Where is SKU-88213?', hint: 'explain', kind: 'explain', about: 'SKU-88213' },
        { label: 'Reassign PL-4471 to the nearest free picker', hint: 'J. Tan → ?', kind: 'action', run: 'reassign' },
        { label: 'Show everything blocked in aisle B', hint: 'bin:B-* state:blocked', kind: 'view', q: 'bin:B-* state:blocked' },
        { label: 'Start a cycle count', hint: 'scan a bin', kind: 'action' }
      ]
    },

    /* Screens the palette can jump to — the same list for every role, filtered
       by what the role can actually open. */
    screens: [
      { label: 'Purchase orders', path: '/pos', roles: ['approver', 'ap', 'controller'] },
      { label: 'Invoices', path: '/invoices', roles: ['approver', 'ap', 'controller'] },
      { label: 'Inbox', path: '/inbox', roles: ['approver', 'ap', 'controller'] },
      { label: 'Period close', path: '/close', roles: ['controller'] },
      { label: 'Spend', path: '/spend', roles: ['controller', 'approver'] },
      { label: 'Cost centres', path: '/cost-centers', roles: ['controller', 'ap'] },
      { label: 'Goods receipt', path: '/receive', roles: ['warehouse', 'ap'] },
      { label: 'Movements', path: '/movements', roles: ['warehouse', 'controller'] },
      { label: 'Stock counts', path: '/counts', roles: ['warehouse'] }
    ],

    /* "Why?" answers. Structured, not prose — each is rendered into framework
       components, and each names what it was derived from. That provenance
       line is the whole difference between an explanation and an assertion. */
    explain: {
      'PO-88214': {
        title: 'Why is PO-88214 with Finance?',
        facts: [['Amount', '$15,636.05'], ['Your limit', '$15,000.00 on CC-4021'], ['Rule', 'AR-12 · over-limit routes to Finance'], ['Escalated', '2026-08-11 09:14 by you']],
        timeline: [
          { title: 'Submitted', meta: 'M. Bauer · 2026-08-08 16:02', state: 'done' },
          { title: 'Cost-centre owner', meta: 'You · escalated 2026-08-11 09:14', state: 'done' },
          { title: 'Finance review', meta: 'F. Toft · waiting 3 days', state: 'current' },
          { title: 'Post to ledger', state: 'pending' }],
        from: 'Approval rule AR-12, cost-centre master CC-4021, document audit trail'
      },
      'INV-10241': {
        title: 'Why did INV-10241 fail 3-way match?',
        facts: [['Ordered', '400 PC · PO-88212'], ['Received', '320 PC · GR-88209, 2026-08-09'], ['Invoiced', '400 PC · INV-10241'], ['Gap', '80 PC · $656.00 over receipt']],
        from: 'PO-88212 line 20, goods receipt GR-88209, invoice INV-10241',
        options: 'Short-pay to 320 PC, or hold until the remaining 80 PC are received.'
      },
      'INV-10244': {
        title: 'Why is INV-10244 flagged as a duplicate?',
        facts: [['This invoice', 'Globex · $8,742.37 · dated 2026-07-28'], ['Matches', 'INV-10199 · Globex · $8,742.37 · dated 2026-07-28'], ['INV-10199 status', 'Posted 2026-07-30, paid 2026-08-05'], ['Difference', 'Vendor reference only: GX-4471 vs GX-4471-R']],
        from: 'Duplicate rule DUP-3 (vendor + amount + date within 7 days), invoice register',
        options: 'The -R suffix usually means a re-issue. Compare line items before rejecting.'
      },
      'CLOSE-08': {
        title: 'What is blocking period close?',
        facts: [['Accruals', '3 vendors without an August invoice — Stark, Umbrella, Initech'], ['Budget', 'CC-2205 at 104%, needs approval or reclass'], ['Reconciliation', '41 unmatched bank lines'], ['Approvals', '7 stalled, but stalled approvals do not block close']],
        from: 'Close checklist CL-08/2026, accrual report, budget ledger, bank reconciliation',
        options: 'Three blockers, three owners. Nudge AP and Treasury; the budget decision is yours.'
      },
      'SKU-88213': {
        title: 'Where is SKU-88213?',
        facts: [['A-04-12', '96 PC · pickable'], ['Receiving', '21 PC · GR-88213, short delivery open'], ['In transit', '24 PC · PL-4471, line 1 picked'], ['Reserved', '120 PC across 3 open orders']],
        from: 'Stock ledger warehouse 0210, open receipts, open pick lists',
        options: 'Scan a bin to see its count.'
      },
      'PL-4471': {
        title: 'Why is PL-4471 stalled?',
        facts: [['Last scan', '13:12 · line 2 of 4 · B-11-03'], ['Line 3', 'B-11-03 — the bin is blocked for a count variance'], ['Picker', 'J. Tan, no other open task'], ['Wave', 'Closes 15:00, 3 other lists depend on this one']],
        from: 'Scan log, bin status B-11-03, wave plan W2',
        options: 'The picker is waiting on a blocked bin, not idle. Clear the recount first, or reassign line 3 to an alternate bin.'
      }
    }
  };
})();
