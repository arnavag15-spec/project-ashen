import Papa from 'papaparse';
import { Transaction } from './ledgerTypes';

export interface ExportOptions {
  filename?: string;
}

export function generateExportData(transactions: Transaction[]): Record<string, string>[] {
  // Only exclude rows where duplicateDecision === 'exclude'
  const rowsToExport = transactions.filter((tx) => tx.duplicateDecision !== 'exclude');

  return rowsToExport.map((tx) => {
    // Preserve all original columns
    const exportedRow: Record<string, string> = { ...tx.original };

    // Append metadata columns
    exportedRow['Final Category'] = tx.category;
    exportedRow['Review Status'] = tx.categoryReviewed ? 'Reviewed' : 'Unreviewed';
    exportedRow['Confidence Level'] = tx.confidence;
    exportedRow['Potential Duplicate'] = tx.isDuplicate ? 'Yes' : 'No';
    exportedRow['Duplicate Decision'] = tx.duplicateDecision || (tx.isDuplicate ? 'Keep (Default)' : 'N/A');

    return exportedRow;
  });
}

export function exportTransactionsToCsv(
  transactions: Transaction[],
  options: ExportOptions = {}
): { totalCount: number; exportedCount: number; excludedCount: number; filename: string } {
  const filename = options.filename || `ashen_crown_reviewed_expenses_${new Date().toISOString().slice(0, 10)}.csv`;
  const exportRows = generateExportData(transactions);
  const csvString = Papa.unparse(exportRows, { quotes: true });

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  const excludedCount = transactions.filter((tx) => tx.duplicateDecision === 'exclude').length;

  return {
    totalCount: transactions.length,
    exportedCount: exportRows.length,
    excludedCount,
    filename,
  };
}
