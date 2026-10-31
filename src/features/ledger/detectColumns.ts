import { ColumnMapping } from './ledgerTypes';

const DATE_PATTERNS = [
  /^date$/i,
  /^transaction\s*date$/i,
  /^posting\s*date$/i,
  /^value\s*date$/i,
  /^txn\s*date$/i,
  /date/i,
];

const DESCRIPTION_PATTERNS = [
  /^description$/i,
  /^details$/i,
  /^narration$/i,
  /^merchant$/i,
  /^payee$/i,
  /^particulars$/i,
  /^name$/i,
  /^transaction\s*details$/i,
  /description/i,
  /narration/i,
  /particulars/i,
];

const AMOUNT_PATTERNS = [
  /^amount$/i,
  /^transaction\s*amount$/i,
  /^value$/i,
  /^txn\s*amount$/i,
  /^net\s*amount$/i,
  /amount/i,
];

const DEBIT_PATTERNS = [
  /^debit$/i,
  /^withdrawal$/i,
  /^spent$/i,
  /^outflow$/i,
  /^dr$/i,
  /^debit\s*amount$/i,
  /withdrawal/i,
];

const CREDIT_PATTERNS = [
  /^credit$/i,
  /^deposit$/i,
  /^received$/i,
  /^inflow$/i,
  /^cr$/i,
  /^credit\s*amount$/i,
  /deposit/i,
];

const CATEGORY_PATTERNS = [
  /^category$/i,
  /^type$/i,
  /^expense\s*type$/i,
  /category/i,
];

function findBestMatch(headers: string[], patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = headers.find(h => pattern.test(h.trim()));
    if (match) return match;
  }
  return null;
}

export function detectColumns(headers: string[]): {
  mapping: ColumnMapping;
  isAmbiguous: boolean;
} {
  const trimmed = headers.map(h => h.trim());

  const date = findBestMatch(trimmed, DATE_PATTERNS);
  const description = findBestMatch(trimmed, DESCRIPTION_PATTERNS);
  const debit = findBestMatch(trimmed, DEBIT_PATTERNS);
  const credit = findBestMatch(trimmed, CREDIT_PATTERNS);
  
  // If distinct debit & credit are found, amount can be null
  let amount: string | null = null;
  if (!debit || !credit) {
    amount = findBestMatch(trimmed, AMOUNT_PATTERNS);
  }

  const category = findBestMatch(trimmed, CATEGORY_PATTERNS);

  const mapping: ColumnMapping = {
    date,
    description,
    amount,
    debit,
    credit,
    category,
  };

  // Usable description is required AND either (amount) OR (debit AND credit)
  const hasDescription = Boolean(mapping.description);
  const hasAmount = Boolean(mapping.amount) || (Boolean(mapping.debit) && Boolean(mapping.credit));

  const isAmbiguous = !hasDescription || !hasAmount;

  return { mapping, isAmbiguous };
}
