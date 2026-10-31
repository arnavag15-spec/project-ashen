import Papa from 'papaparse';
import { Transaction, ColumnMapping, Direction } from './ledgerTypes';
import { detectColumns } from './detectColumns';
import { categorizeTransaction } from './categorize';
import { markPotentialDuplicates } from './findDuplicates';

/**
 * Parses a numeric amount string robustly.
 * Handles:
 * - Currency symbols ($, ₹, €, £, ¥)
 * - Thousand separator commas (1,234.50)
 * - Negative in parentheses: (124.50) => -124.50
 * - Trailing minus: 124.50- => -124.50
 * - CR / DR notations: 500 CR => +500, 500 DR => -500
 */
export function parseAmount(raw: string | undefined | null): {
  amount: number | null;
  direction: Direction;
} {
  if (!raw || typeof raw !== 'string') {
    return { amount: null, direction: 'unknown' };
  }

  let str = raw.trim();
  if (!str) return { amount: null, direction: 'unknown' };

  let isNegative = false;
  let isCredit = false;
  let isDebit = false;

  // Check CR / DR suffixes or prefixes
  if (/\bcr\b/i.test(str)) {
    isCredit = true;
    str = str.replace(/\bcr\b/gi, '');
  } else if (/\bdr\b/i.test(str)) {
    isDebit = true;
    str = str.replace(/\bdr\b/gi, '');
  }

  // Parentheses notation: (100.00) => negative
  if (/^\(.*\)$/.test(str)) {
    isNegative = true;
    str = str.slice(1, -1);
  }

  // Leading or trailing minus
  if (str.startsWith('-')) {
    isNegative = true;
    str = str.slice(1);
  } else if (str.endsWith('-')) {
    isNegative = true;
    str = str.slice(0, -1);
  } else if (str.startsWith('+')) {
    str = str.slice(1);
  }

  // Remove commas, currency symbols, and extra spaces
  const cleanStr = str.replace(/[$,₹,€,£,¥,\s]/g, '').trim();
  const num = parseFloat(cleanStr);

  if (isNaN(num)) {
    return { amount: null, direction: 'unknown' };
  }

  let finalAmount = num;
  if (isNegative || isDebit) {
    finalAmount = -Math.abs(num);
  } else if (isCredit) {
    finalAmount = Math.abs(num);
  }

  const direction: Direction =
    finalAmount < 0 ? 'expense' : finalAmount > 0 ? 'income' : 'unknown';

  return { amount: finalAmount, direction };
}

export interface RawParseOutput {
  headers: string[];
  rawRows: Record<string, string>[];
  detectedMapping: ColumnMapping;
  isAmbiguous: boolean;
}

/**
 * Parses raw CSV content (text or File) into rows and headers.
 */
export function parseRawCsv(fileOrText: File | string): Promise<RawParseOutput> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(fileOrText as any, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rawRows = (results.data || []).filter((row) =>
          Object.values(row).some((val) => val && String(val).trim() !== '')
        );

        const { mapping, isAmbiguous } = detectColumns(headers);

        resolve({
          headers,
          rawRows,
          detectedMapping: mapping,
          isAmbiguous,
        });
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * Transforms raw rows into typed Transactions based on confirmed column mapping.
 */
export function processTransactions(
  rawRows: Record<string, string>[],
  mapping: ColumnMapping
): Transaction[] {
  const transactions: Transaction[] = rawRows.map((row, index) => {
    const id = `tx_${index + 1}_${Math.random().toString(36).substring(2, 7)}`;
    const date = mapping.date ? row[mapping.date]?.trim() || null : null;
    const description = mapping.description ? row[mapping.description]?.trim() || '' : '';
    const existingCategory = mapping.category ? row[mapping.category]?.trim() : null;

    let parsedAmount: number | null = null;
    let direction: Direction = 'unknown';
    let rawAmount = '';

    if (mapping.amount && row[mapping.amount] !== undefined) {
      rawAmount = row[mapping.amount];
      const parsed = parseAmount(rawAmount);
      parsedAmount = parsed.amount;
      direction = parsed.direction;
    } else if (mapping.debit && mapping.credit) {
      const debitRaw = row[mapping.debit];
      const creditRaw = row[mapping.credit];
      const debitParsed = parseAmount(debitRaw);
      const creditParsed = parseAmount(creditRaw);

      if (debitParsed.amount !== null && Math.abs(debitParsed.amount) > 0) {
        parsedAmount = -Math.abs(debitParsed.amount);
        direction = 'expense';
        rawAmount = debitRaw;
      } else if (creditParsed.amount !== null && Math.abs(creditParsed.amount) > 0) {
        parsedAmount = Math.abs(creditParsed.amount);
        direction = 'income';
        rawAmount = creditRaw;
      } else {
        parsedAmount = 0;
        direction = 'unknown';
        rawAmount = '0';
      }
    }

    const { category, confidence } = categorizeTransaction(
      description,
      existingCategory,
      parsedAmount
    );

    return {
      id,
      originalIndex: index,
      original: row,
      date,
      description,
      amount: parsedAmount,
      rawAmount,
      direction,
      category,
      confidence,
      categoryReviewed: confidence === 'high',
      isDuplicate: false,
      duplicateGroupKey: null,
      duplicateOfId: null,
      duplicateDecision: null,
    };
  });

  return markPotentialDuplicates(transactions);
}
