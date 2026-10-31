import { Category, Confidence } from './ledgerTypes';

interface CategoryRule {
  category: Category;
  highPriorityKeywords: string[];
  mediumPriorityKeywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Income & Refunds',
    highPriorityKeywords: [
      'salary',
      'wages',
      'payroll',
      'stipend',
      'refund',
      'reimbursement',
      'interest received',
      'cashback',
      'dividend',
    ],
    mediumPriorityKeywords: [
      'credit interest',
      'bonus',
      'payout',
      'inward remittance',
      'reversal',
    ],
  },
  {
    category: 'Transfers',
    highPriorityKeywords: [
      'upi transfer',
      'bank transfer',
      'self transfer',
      'transfer to',
      'transfer from',
      'neft',
      'rtgs',
      'imps',
      'wire transfer',
      'to savings',
      'from savings',
    ],
    mediumPriorityKeywords: [
      'fund transfer',
      'p2p',
      'inter account',
      'internal transfer',
    ],
  },
  {
    category: 'Food & Groceries',
    highPriorityKeywords: [
      'grocery',
      'supermarket',
      'green basket',
      'fresh mart',
      'restaurant',
      'cafe',
      'coffee house',
      'coffee',
      'food delivery',
      'bakery',
      'swiggy',
      'zomato',
      'mcdonald',
      'starbucks',
      'subway',
      'dominos',
      'pizza',
      'burger',
      'bistro',
      'kitchen',
      'market',
      'fruits',
      'vegetables',
      'provisions',
    ],
    mediumPriorityKeywords: [
      'dining',
      'sweets',
      'tea',
      'eats',
      'tiffin',
      'snacks',
      'beverage',
    ],
  },
  {
    category: 'Transport',
    highPriorityKeywords: [
      'quickride',
      'metro rail',
      'metro',
      'fuel',
      'petrol',
      'diesel',
      'taxi',
      'cab',
      'uber',
      'ola',
      'bus',
      'train',
      'irctc',
      'railway',
      'airline',
      'flight',
      'parking',
      'toll',
      'fastag',
    ],
    mediumPriorityKeywords: [
      'ride',
      'transit',
      'airways',
      'aviation',
      'commute',
      'transport',
    ],
  },
  {
    category: 'Shopping',
    highPriorityKeywords: [
      'northstar apparel',
      'apparel',
      'clothing',
      'online store',
      'retail',
      'amazon',
      'flipkart',
      'myntra',
      'zara',
      'h&m',
      'electronics',
      'fashion',
      'shoes',
      'departmental store',
    ],
    mediumPriorityKeywords: [
      'store',
      'shop',
      'mall',
      'boutique',
      'wear',
      'outfit',
      'market',
    ],
  },
  {
    category: 'Bills & Utilities',
    highPriorityKeywords: [
      'broadband',
      'monthly broadband',
      'electricity',
      'water bill',
      'gas bill',
      'internet',
      'phone recharge',
      'mobile recharge',
      'utility',
      'airtel',
      'jio',
      'vodafone',
      'tata power',
      'bescom',
      'cylinder',
    ],
    mediumPriorityKeywords: [
      'bill',
      'recharge',
      'power',
      'energy',
      'telecom',
      'postpaid',
      'prepaid',
    ],
  },
  {
    category: 'Education',
    highPriorityKeywords: [
      'bookstore',
      'university',
      'college',
      'tuition',
      'course',
      'school fee',
      'stationery',
      'udemy',
      'coursera',
      'textbooks',
      'academy',
    ],
    mediumPriorityKeywords: [
      'training',
      'education',
      'library',
      'books',
      'exam',
      'institute',
    ],
  },
  {
    category: 'Health',
    highPriorityKeywords: [
      'pharmacy',
      'hospital',
      'clinic',
      'medical',
      'dentist',
      'dental',
      'doctor',
      'diagnostic',
      'healthcare',
      'apollo',
      'chemist',
      'medicals',
    ],
    mediumPriorityKeywords: [
      'health',
      'pathology',
      'lab',
      'wellness',
      'medicine',
      'physio',
    ],
  },
  {
    category: 'Entertainment',
    highPriorityKeywords: [
      'streamflix',
      'netflix',
      'cinema',
      'movie',
      'streaming',
      'music subscription',
      'game purchase',
      'spotify',
      'theatre',
      'pvr',
      'inox',
      'playstation',
      'steam games',
      'disney',
      'prime video',
    ],
    mediumPriorityKeywords: [
      'amusement',
      'games',
      'gaming',
      'concert',
      'tickets',
      'show',
    ],
  },
];

export function categorizeTransaction(
  description: string,
  existingCategory?: string | null,
  amount?: number | null
): { category: Category; confidence: Confidence } {
  // If an existing category is in the CSV and matches our known categories
  if (existingCategory) {
    const cleanExisting = existingCategory.trim().toLowerCase();
    for (const rule of CATEGORY_RULES) {
      if (rule.category.toLowerCase() === cleanExisting) {
        return { category: rule.category, confidence: 'high' };
      }
    }
  }

  const text = (description || '').toLowerCase();

  // Check high priority keywords first
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.highPriorityKeywords) {
      if (text.includes(kw)) {
        return { category: rule.category, confidence: 'high' };
      }
    }
  }

  // Check medium priority keywords
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.mediumPriorityKeywords) {
      if (text.includes(kw)) {
        return { category: rule.category, confidence: 'medium' };
      }
    }
  }

  // If amount is positive and contains words like 'refund' or 'credit'
  if (amount && amount > 0 && (text.includes('refund') || text.includes('credit'))) {
    return { category: 'Income & Refunds', confidence: 'medium' };
  }

  // Default fallback for unmatched entries
  return {
    category: 'Other / Needs Review',
    confidence: 'low',
  };
}
