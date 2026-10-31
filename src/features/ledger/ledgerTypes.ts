export type Category =
  | 'Food & Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Education'
  | 'Health'
  | 'Entertainment'
  | 'Income & Refunds'
  | 'Transfers'
  | 'Other / Needs Review';

export const ALL_CATEGORIES: Category[] = [
  'Food & Groceries',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Education',
  'Health',
  'Entertainment',
  'Income & Refunds',
  'Transfers',
  'Other / Needs Review',
];

export type Confidence = 'high' | 'medium' | 'low';
export type Direction = 'expense' | 'income' | 'unknown';
export type DuplicateDecision = 'keep' | 'exclude' | null;

export interface Transaction {
  id: string;
  originalIndex: number;
  original: Record<string, string>;
  date: string | null;
  description: string;
  amount: number | null;
  rawAmount: string;
  direction: Direction;
  category: Category;
  confidence: Confidence;
  categoryReviewed: boolean;
  isDuplicate: boolean;
  duplicateGroupKey: string | null;
  duplicateOfId: string | null;
  duplicateDecision: DuplicateDecision;
}

export interface ColumnMapping {
  date: string | null;
  description: string | null;
  amount: string | null;
  debit: string | null;
  credit: string | null;
  category: string | null;
}

export interface ParseResult {
  headers: string[];
  rawRows: Record<string, string>[];
  detectedMapping: ColumnMapping;
  isMappingAmbiguous: boolean;
}

export type FilterType = 'all' | 'needs_review' | 'duplicates' | 'reviewed' | 'excluded';
