import { describe, it, expect } from 'vitest';
import { detectColumns } from '../detectColumns';
import { parseAmount, processTransactions, parseRawCsv } from '../parseCsv';
import { categorizeTransaction } from '../categorize';
import { markPotentialDuplicates } from '../findDuplicates';
import { generateExportData } from '../exportCsv';
import { Transaction, ColumnMapping } from '../ledgerTypes';
import { SAMPLE_EXPENSES_CSV } from '../../../data/sampleExpenses';

describe('A. Header & Column Detection', () => {
  it('detects standard single amount headers', () => {
    const headers = ['Date', 'Description', 'Amount'];
    const { mapping, isAmbiguous } = detectColumns(headers);
    expect(isAmbiguous).toBe(false);
    expect(mapping.date).toBe('Date');
    expect(mapping.description).toBe('Description');
    expect(mapping.amount).toBe('Amount');
  });

  it('detects case-insensitive variants and synonyms', () => {
    const headers = ['transaction date', 'merchant', 'value', 'type'];
    const { mapping, isAmbiguous } = detectColumns(headers);
    expect(isAmbiguous).toBe(false);
    expect(mapping.date).toBe('transaction date');
    expect(mapping.description).toBe('merchant');
    expect(mapping.amount).toBe('value');
    expect(mapping.category).toBe('type');
  });

  it('detects separate debit and credit columns', () => {
    const headers = ['Posting Date', 'Narration', 'Withdrawal', 'Deposit'];
    const { mapping, isAmbiguous } = detectColumns(headers);
    expect(isAmbiguous).toBe(false);
    expect(mapping.debit).toBe('Withdrawal');
    expect(mapping.credit).toBe('Deposit');
  });

  it('marks ambiguous if description or amount is missing', () => {
    const headers = ['Date', 'City', 'Score'];
    const { isAmbiguous } = detectColumns(headers);
    expect(isAmbiguous).toBe(true);
  });

  it('allows optional date header without marking ambiguous', () => {
    const headers = ['Description', 'Amount'];
    const { mapping, isAmbiguous } = detectColumns(headers);
    expect(isAmbiguous).toBe(false);
    expect(mapping.date).toBeNull();
    expect(mapping.description).toBe('Description');
  });
});

describe('B. Amount Parsing & Normalisation', () => {
  it('parses negative floats and positive floats', () => {
    expect(parseAmount('-1240.00')).toEqual({ amount: -1240.0, direction: 'expense' });
    expect(parseAmount('32000.00')).toEqual({ amount: 32000.0, direction: 'income' });
  });

  it('parses currency symbols, commas, and whitespace', () => {
    expect(parseAmount('$1,234.50')).toEqual({ amount: 1234.5, direction: 'income' });
    expect(parseAmount('-₹1,240.00')).toEqual({ amount: -1240.0, direction: 'expense' });
  });

  it('parses accounting parentheses notation as negative', () => {
    expect(parseAmount('(750.25)')).toEqual({ amount: -750.25, direction: 'expense' });
  });

  it('parses CR and DR notations', () => {
    expect(parseAmount('500.00 CR')).toEqual({ amount: 500.0, direction: 'income' });
    expect(parseAmount('250.00 DR')).toEqual({ amount: -250.0, direction: 'expense' });
  });
});

describe('C. Categorisation Rules & Confidence', () => {
  it('categorises Food & Groceries with high confidence', () => {
    const res = categorizeTransaction('Green Basket Grocers');
    expect(res.category).toBe('Food & Groceries');
    expect(res.confidence).toBe('high');
  });

  it('categorises Transport with high confidence', () => {
    const res = categorizeTransaction('Metro Rail Recharge');
    expect(res.category).toBe('Transport');
    expect(res.confidence).toBe('high');
  });

  it('categorises Utilities & Broadband with high confidence', () => {
    const res = categorizeTransaction('Monthly Broadband');
    expect(res.category).toBe('Bills & Utilities');
    expect(res.confidence).toBe('high');
  });

  it('categorises Education with high confidence', () => {
    const res = categorizeTransaction('University Bookstore');
    expect(res.category).toBe('Education');
    expect(res.confidence).toBe('high');
  });

  it('categorises Health with high confidence', () => {
    const res = categorizeTransaction('City Care Pharmacy');
    expect(res.category).toBe('Health');
    expect(res.confidence).toBe('high');
  });

  it('categorises Entertainment with high confidence', () => {
    const res = categorizeTransaction('StreamFlix Subscription');
    expect(res.category).toBe('Entertainment');
    expect(res.confidence).toBe('high');
  });

  it('categorises Salary Credit as Income & Refunds', () => {
    const res = categorizeTransaction('Salary Credit', null, 32000);
    expect(res.category).toBe('Income & Refunds');
    expect(res.confidence).toBe('high');
  });

  it('categorises Transfers with high confidence', () => {
    const res = categorizeTransaction('UPI Transfer to Savings');
    expect(res.category).toBe('Transfers');
    expect(res.confidence).toBe('high');
  });

  it('falls back to Other / Needs Review with low confidence for unknown transactions', () => {
    const res = categorizeTransaction('ONLINE PAYMENT 884721');
    expect(res.category).toBe('Other / Needs Review');
    expect(res.confidence).toBe('low');
  });
});

describe('D. Duplicate Detection', () => {
  const dummyTx = (id: string, date: string | null, desc: string, amount: number): Transaction => ({
    id,
    originalIndex: 0,
    original: { Date: date || '', Description: desc, Amount: String(amount) },
    date,
    description: desc,
    amount,
    rawAmount: String(amount),
    direction: amount < 0 ? 'expense' : 'income',
    category: 'Food & Groceries',
    confidence: 'high',
    categoryReviewed: true,
    isDuplicate: false,
    duplicateGroupKey: null,
    duplicateOfId: null,
    duplicateDecision: null,
  });

  it('flags conservative exact duplicates with same date, amount, and description', () => {
    const txs = [
      dummyTx('1', '2026-10-02', 'Coffee House MG Road', -180.0),
      dummyTx('2', '2026-10-02', 'Coffee House MG Road', -180.0),
      dummyTx('3', '2026-10-04', 'Coffee House MG Road', -180.0), // Different date
    ];

    const result = markPotentialDuplicates(txs);
    expect(result[0].isDuplicate).toBe(true);
    expect(result[1].isDuplicate).toBe(true);
    expect(result[2].isDuplicate).toBe(false); // different date is not a duplicate!
  });

  it('skips duplicate flagging if date column is missing', () => {
    const txs = [
      dummyTx('1', null, 'Coffee House MG Road', -180.0),
      dummyTx('2', null, 'Coffee House MG Road', -180.0),
    ];

    const result = markPotentialDuplicates(txs);
    expect(result[0].isDuplicate).toBe(false);
    expect(result[1].isDuplicate).toBe(false);
  });
});

describe('E. Export & Cleaned Filtering', () => {
  it('omits only explicitly excluded duplicate rows and appends metadata', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        originalIndex: 0,
        original: { Date: '2026-10-02', Description: 'Coffee House', Amount: '-180.00' },
        date: '2026-10-02',
        description: 'Coffee House',
        amount: -180,
        rawAmount: '-180.00',
        direction: 'expense',
        category: 'Food & Groceries',
        confidence: 'high',
        categoryReviewed: true,
        isDuplicate: true,
        duplicateGroupKey: 'grp1',
        duplicateOfId: null,
        duplicateDecision: 'keep',
      },
      {
        id: '2',
        originalIndex: 1,
        original: { Date: '2026-10-02', Description: 'Coffee House', Amount: '-180.00' },
        date: '2026-10-02',
        description: 'Coffee House',
        amount: -180,
        rawAmount: '-180.00',
        direction: 'expense',
        category: 'Food & Groceries',
        confidence: 'high',
        categoryReviewed: true,
        isDuplicate: true,
        duplicateGroupKey: 'grp1',
        duplicateOfId: '1',
        duplicateDecision: 'exclude', // User explicitly excluded
      },
    ];

    const exported = generateExportData(transactions);
    expect(exported.length).toBe(1);
    expect(exported[0].Description).toBe('Coffee House');
    expect(exported[0]['Final Category']).toBe('Food & Groceries');
    expect(exported[0]['Review Status']).toBe('Reviewed');
    expect(exported[0]['Potential Duplicate']).toBe('Yes');
  });
});

describe('F. End-to-End Processing of Sample CSV', () => {
  it('correctly processes the 14-row sample CSV with 1 duplicate pair and 1 unknown item', async () => {
    const parsed = await parseRawCsv(SAMPLE_EXPENSES_CSV);
    expect(parsed.rawRows.length).toBe(14);
    expect(parsed.isAmbiguous).toBe(false);

    const transactions = processTransactions(parsed.rawRows, parsed.detectedMapping);
    expect(transactions.length).toBe(14);

    // Rows 3 and 4 are Coffee House duplicates on 2026-10-02
    const coffeeDups = transactions.filter((t) => t.description.includes('Coffee House'));
    expect(coffeeDups.length).toBe(2);
    expect(coffeeDups[0].isDuplicate).toBe(true);
    expect(coffeeDups[1].isDuplicate).toBe(true);

    // Row ONLINE PAYMENT 884721 has low confidence
    const onlinePayment = transactions.find((t) => t.description.includes('ONLINE PAYMENT'));
    expect(onlinePayment).toBeDefined();
    expect(onlinePayment?.category).toBe('Other / Needs Review');
    expect(onlinePayment?.confidence).toBe('low');
  });

  it('handles 5,000 rows without memory or performance failure', () => {
    const largeRows: Record<string, string>[] = [];
    for (let i = 0; i < 5000; i++) {
      largeRows.push({
        Date: '2026-10-01',
        Description: `Merchant #${i}`,
        Amount: `-${(i + 1).toFixed(2)}`,
      });
    }

    const mapping: ColumnMapping = {
      date: 'Date',
      description: 'Description',
      amount: 'Amount',
      debit: null,
      credit: null,
      category: null,
    };

    const startTime = performance.now();
    const result = processTransactions(largeRows, mapping);
    const duration = performance.now() - startTime;

    expect(result.length).toBe(5000);
    // 5000 rows should process in well under 1000ms
    expect(duration).toBeLessThan(1000);
  });
});
