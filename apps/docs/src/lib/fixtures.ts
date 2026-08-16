// Shared demo data for docs pages.
//
// The same invoice rows were pasted into three component pages by the
// data-table split (Standardize 2026-08-17) and drift between them is
// invisible until a reader notices two pages disagreeing about the same
// invoice. One fixture, imported where needed; take a slice for shorter
// demos rather than writing a second copy.
export type InvoiceRow = {
  no: string;
  vendor: string;
  cc: string;
  amount: string;
  status: string;
  tone: 'warning' | 'success' | 'danger';
};

export const invoiceRows: InvoiceRow[] = [
  { no: 'INV-10234', vendor: 'Acme Supply Co.', cc: 'CC-4021', amount: '$4,208.00', status: 'Pending', tone: 'warning' },
  { no: 'INV-10235', vendor: 'Globex Industrial', cc: 'CC-4021', amount: '$18,940.50', status: 'Approved', tone: 'success' },
  { no: 'INV-10236', vendor: 'Initech GmbH', cc: 'CC-1180', amount: '$730.25', status: 'Rejected', tone: 'danger' },
  { no: 'INV-10237', vendor: 'Umbrella Logistics', cc: 'CC-2205', amount: '$2,110.00', status: 'Pending', tone: 'warning' },
  { no: 'INV-10238', vendor: 'Stark Components', cc: 'CC-1180', amount: '$56,000.00', status: 'Approved', tone: 'success' },
];
