/**
 * Gate: the formatted strings printed on /concepts/i18n are what Intl
 * actually produces, and the divergence that page documents is still exactly
 * the divergence that exists.
 *
 * The page shows worked SG/TH output and states that the framework's
 * ISO-4217 `currencyDecimals()` disagrees with ICU's display digits for a
 * NAMED list of currencies. Both halves are facts about the platform, which
 * means an ICU/Node upgrade can silently make the page wrong — the same
 * failure mode as any other unexecuted claim, just with a slower fuse.
 *
 * No browser: pure Intl, so this costs milliseconds in CI.
  *
 * @exact — runs a formatter and compares output. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
const failures = [];

/* ---- 1. the exact strings the page prints ---- */
const D = new Date('2026-08-17');
const EXPECTED = [
  ['en-SG SGD', new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(1234567.5), '$1,234,567.50'],
  ['en-SG USD', new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'USD' }).format(1234.5), 'US$1,234.50'],
  ['en-SG SGD code', new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', currencyDisplay: 'code' }).format(1234.5), 'SGD 1,234.50'],
  ['th-TH THB', new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(1234567.5), '฿1,234,567.50'],
  ['th-TH date (buddhist default)', new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(D), '17 ส.ค. 2569'],
  ['th-TH date (gregory)', new Intl.DateTimeFormat('th-TH-u-ca-gregory', { dateStyle: 'medium' }).format(D), '17 ส.ค. 2026'],
  ['th-TH thai numerals', new Intl.NumberFormat('th-TH-u-nu-thai', { style: 'currency', currency: 'THB' }).format(1234.5), '฿๑,๒๓๔.๕๐'],
];
for (const [what, got, want] of EXPECTED) {
  // Intl uses U+00A0/U+202F around symbols in some locales; compare on the
  // normalised form so a whitespace-class change is not reported as a
  // content change.
  const norm = (s) => s.replace(/[  ]/g, ' ');
  if (norm(got) !== norm(want)) failures.push(`${what}: page says "${want}", Intl now produces "${got}"`);
}

/* ---- 2. the documented ISO-vs-CLDR divergence list ---- */
const DOCUMENTED_DIVERGENCE = ['IQD', 'IDR', 'HUF', 'COP', 'PKR', 'MMK', 'LAK'];
// Subpath without the extension: the export map maps ./js/behaviors/* to
// dist/js/behaviors/*.js, and it is ESM, so this is an import not a require.
const { currencyDecimals } = await import('@busy-office/ui/js/behaviors/money-field');

// Codes worth checking: everything the framework treats as an exception plus
// the majors and the region's currencies.
const CODES = [
  'USD', 'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'TRY', 'ZAR', 'BRL', 'MXN',
  'SGD', 'THB', 'JPY', 'CNY', 'INR', 'IDR', 'MYR', 'PHP', 'VND', 'KRW', 'TWD', 'HKD',
  'PKR', 'BDT', 'MMK', 'LAK', 'KHR', 'HUF', 'COP', 'CLP', 'ISK', 'UGX',
  'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND', 'CLF',
];
const found = [];
for (const code of CODES) {
  let icu;
  try {
    icu = new Intl.NumberFormat('en', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits;
  } catch {
    continue; // ICU does not know this code in this runtime
  }
  if (currencyDecimals(code) !== icu) found.push(code);
}
const extra = found.filter((c) => !DOCUMENTED_DIVERGENCE.includes(c));
const gone = DOCUMENTED_DIVERGENCE.filter((c) => !found.includes(c));
if (extra.length) {
  failures.push(
    `ISO-vs-CLDR divergence: ${extra.join(', ')} now differ too — add them to the list on /concepts/i18n ` +
      `and decide deliberately whether currencyDecimals() should change (it follows ISO minor units on purpose).`,
  );
}
if (gone.length) {
  failures.push(
    `ISO-vs-CLDR divergence: ${gone.join(', ')} no longer differ — /concepts/i18n names them and would be overstating the problem.`,
  );
}

if (failures.length) {
  console.error(`formatting check FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(
  `formatting check passed — ${EXPECTED.length} documented Intl outputs reproduce exactly, ` +
    `and the ISO-vs-CLDR precision divergence is still exactly the ${DOCUMENTED_DIVERGENCE.length} documented codes`,
);
