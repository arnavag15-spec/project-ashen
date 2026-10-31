import { Transaction } from './ledgerTypes';

/**
 * Normalises a string for conservative comparison:
 * Trims whitespace, removes non-alphanumeric chars (except basic punctuation), and converts to lowercase.
 */
function normaliseDescription(desc: string): string {
  return (desc || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Identifies duplicate groups by matching normalised date + amount + description.
 * If date is missing on a transaction, it is not flagged as a duplicate.
 */
export function markPotentialDuplicates(transactions: Transaction[]): Transaction[] {
  // Map of group key to list of transaction IDs
  const groups = new Map<string, string[]>();

  for (const tx of transactions) {
    // If no date or no amount, skip automatic duplicate detection
    if (!tx.date || tx.amount === null || isNaN(tx.amount)) {
      continue;
    }

    const normDate = tx.date.trim();
    // Normalize amount to 2 decimal places to avoid float representation quirks
    const normAmount = Math.abs(tx.amount).toFixed(2);
    const normDesc = normaliseDescription(tx.description);

    if (!normDate || !normDesc) continue;

    const groupKey = `${normDate}|${normAmount}|${normDesc}`;
    const existing = groups.get(groupKey) || [];
    existing.push(tx.id);
    groups.set(groupKey, existing);
  }

  // Second pass: mark isDuplicate and assign group key
  return transactions.map((tx) => {
    if (!tx.date || tx.amount === null || isNaN(tx.amount)) {
      return {
        ...tx,
        isDuplicate: false,
        duplicateGroupKey: null,
        duplicateOfId: null,
      };
    }

    const normDate = tx.date.trim();
    const normAmount = Math.abs(tx.amount).toFixed(2);
    const normDesc = normaliseDescription(tx.description);
    const groupKey = `${normDate}|${normAmount}|${normDesc}`;
    const group = groups.get(groupKey);

    if (group && group.length > 1) {
      // Find the first occurrence in the group as the master
      const masterId = group[0];
      const isSecondOrLater = tx.id !== masterId;

      return {
        ...tx,
        isDuplicate: true,
        duplicateGroupKey: groupKey,
        duplicateOfId: isSecondOrLater ? masterId : null,
      };
    }

    return {
      ...tx,
      isDuplicate: false,
      duplicateGroupKey: null,
      duplicateOfId: null,
    };
  });
}
