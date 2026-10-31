import React, { useState, useMemo } from 'react';
import { 
  Transaction, 
  Category, 
  ALL_CATEGORIES, 
  FilterType 
} from './ledgerTypes';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdateCategory: (id: string, newCategory: Category) => void;
  onUpdateDuplicateDecision: (id: string, decision: 'keep' | 'exclude') => void;
  onConfirmAllReviewed?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onUpdateCategory,
  onUpdateDuplicateDecision,
  onConfirmAllReviewed,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Counts for filter tabs
  const counts = useMemo(() => {
    let needsReview = 0;
    let duplicates = 0;
    let reviewed = 0;
    let excluded = 0;

    for (const tx of transactions) {
      if (tx.duplicateDecision === 'exclude') {
        excluded++;
      }
      if (tx.isDuplicate) {
        duplicates++;
      }
      if (tx.categoryReviewed) {
        reviewed++;
      } else if (tx.confidence === 'low' || tx.category === 'Other / Needs Review') {
        needsReview++;
      }
    }

    return {
      all: transactions.length,
      needsReview,
      duplicates,
      reviewed,
      excluded,
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    switch (filter) {
      case 'needs_review':
        return transactions.filter(
          (tx) => !tx.categoryReviewed && (tx.confidence === 'low' || tx.category === 'Other / Needs Review')
        );
      case 'duplicates':
        return transactions.filter((tx) => tx.isDuplicate);
      case 'reviewed':
        return transactions.filter((tx) => tx.categoryReviewed);
      case 'excluded':
        return transactions.filter((tx) => tx.duplicateDecision === 'exclude');
      case 'all':
      default:
        return transactions;
    }
  }, [transactions, filter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentRows = filteredTransactions.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Summary Stat Chips & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-ink-900/90 p-4 rounded-lg border border-ink-800">
        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-bronze-600/30 text-bronze-300 border border-bronze-500/50'
                : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-800'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => handleFilterChange('needs_review')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              filter === 'needs_review'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-600/50'
                : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-800'
            }`}
          >
            {counts.needsReview > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            <span>Needs Review ({counts.needsReview})</span>
          </button>
          <button
            onClick={() => handleFilterChange('duplicates')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              filter === 'duplicates'
                ? 'bg-vermilion-950/60 text-vermilion-300 border border-vermilion-600/50'
                : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-800'
            }`}
          >
            {counts.duplicates > 0 && <span className="w-1.5 h-1.5 rounded-full bg-vermilion-400" />}
            <span>Possible Duplicates ({counts.duplicates})</span>
          </button>
          <button
            onClick={() => handleFilterChange('reviewed')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === 'reviewed'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/50'
                : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-800'
            }`}
          >
            Reviewed ({counts.reviewed})
          </button>
          {counts.excluded > 0 && (
            <button
              onClick={() => handleFilterChange('excluded')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filter === 'excluded'
                  ? 'bg-ink-800 text-vermilion-300 border border-vermilion-700/50'
                  : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-800'
              }`}
            >
              Excluded ({counts.excluded})
            </button>
          )}
        </div>

        {/* Quick Batch Action if needed */}
        {counts.needsReview === 0 && onConfirmAllReviewed && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 self-end md:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>All categories confirmed</span>
          </div>
        )}
      </div>

      {/* Main Responsive Table */}
      <div className="rounded-lg border border-ink-800 bg-ink-900/60 overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-950 border-b border-ink-800 text-parchment-400 font-serif uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 min-w-[200px]">Assigned Category</th>
                <th className="py-3 px-3 text-center">Confidence</th>
                <th className="py-3 px-3 text-center min-w-[160px]">Duplicate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/60">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-parchment-400 font-sans">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                currentRows.map((tx, idx) => {
                  const globalIndex = startIndex + idx + 1;
                  const isExcluded = tx.duplicateDecision === 'exclude';
                  const isExpense = tx.direction === 'expense' || (tx.amount !== null && tx.amount < 0);
                  const isIncome = tx.direction === 'income' || (tx.amount !== null && tx.amount > 0);

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-ink-850/70 transition-colors ${
                        isExcluded ? 'opacity-40 bg-ink-950/40 line-through' : ''
                      } ${tx.isDuplicate && !isExcluded ? 'bg-vermilion-950/15' : ''}`}
                    >
                      {/* Row Index */}
                      <td className="py-3 px-3 text-center text-parchment-500 font-mono text-[11px]">
                        {globalIndex}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-parchment-300 font-mono whitespace-nowrap">
                        {tx.date || <span className="text-parchment-500 italic">None</span>}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 font-medium text-parchment-200 max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right font-mono font-semibold whitespace-nowrap">
                        {tx.amount !== null ? (
                          <span
                            className={
                              isExpense
                                ? 'text-parchment-200'
                                : isIncome
                                ? 'text-emerald-400'
                                : 'text-parchment-300'
                            }
                          >
                            {tx.amount < 0 ? `-${Math.abs(tx.amount).toFixed(2)}` : tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : '0.00'}
                          </span>
                        ) : (
                          <span className="text-parchment-500 font-sans text-[11px]">{tx.rawAmount || '0.00'}</span>
                        )}
                      </td>

                      {/* Category Selection Dropdown */}
                      <td className="py-2 px-3">
                        <select
                          value={tx.category}
                          onChange={(e) => onUpdateCategory(tx.id, e.target.value as Category)}
                          className={`w-full py-1.5 px-2 rounded bg-ink-950 border text-xs focus:outline-none focus:ring-1 focus:ring-bronze-400 ${
                            tx.category === 'Other / Needs Review' && !tx.categoryReviewed
                              ? 'border-amber-600/70 text-amber-200 bg-amber-950/20'
                              : 'border-ink-700 text-parchment-200'
                          }`}
                        >
                          {ALL_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Confidence / Review Status Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {tx.categoryReviewed ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[10px]">
                            <Check className="w-3 h-3" />
                            <span>Reviewed</span>
                          </span>
                        ) : tx.confidence === 'high' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-ink-800 text-parchment-300 text-[10px] border border-ink-700">
                            High Auto
                          </span>
                        ) : tx.confidence === 'medium' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-ink-800 text-amber-300 text-[10px] border border-amber-800/40">
                            Medium
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Review Needed</span>
                          </span>
                        )}
                      </td>

                      {/* Duplicate Flags & Explicit Keep/Exclude */}
                      <td className="py-2 px-3 text-center">
                        {tx.isDuplicate ? (
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => onUpdateDuplicateDecision(tx.id, 'keep')}
                              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                                tx.duplicateDecision === 'keep' || tx.duplicateDecision === null
                                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600 shadow-sm'
                                  : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-700'
                              }`}
                              title="Keep this transaction in export"
                            >
                              Keep
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateDuplicateDecision(tx.id, 'exclude')}
                              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                                tx.duplicateDecision === 'exclude'
                                  ? 'bg-vermilion-900/70 text-vermilion-200 border border-vermilion-600 shadow-sm'
                                  : 'bg-ink-850 text-parchment-400 hover:text-parchment-200 border border-ink-700'
                              }`}
                              title="Exclude this duplicate candidate from export"
                            >
                              Exclude
                            </button>
                          </div>
                        ) : (
                          <span className="text-parchment-500 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredTransactions.length > 0 && (
          <div className="p-3 bg-ink-950 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-parchment-400">
            <div>
              Showing <strong className="text-parchment-200">{startIndex + 1}</strong> to{' '}
              <strong className="text-parchment-200">
                {Math.min(startIndex + pageSize, filteredTransactions.length)}
              </strong>{' '}
              of <strong className="text-parchment-200">{filteredTransactions.length}</strong> transactions
              {filter !== 'all' && ` (filtered from ${transactions.length} total)`}
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                className={`p-1.5 rounded border border-ink-700 flex items-center justify-center transition-colors ${
                  safePage <= 1
                    ? 'opacity-40 cursor-not-allowed bg-ink-900 text-parchment-500'
                    : 'bg-ink-850 hover:bg-ink-800 text-parchment-200'
                }`}
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono text-[11px]">
                Page {safePage} of {totalPages}
              </span>

              <button
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className={`p-1.5 rounded border border-ink-700 flex items-center justify-center transition-colors ${
                  safePage >= totalPages
                    ? 'opacity-40 cursor-not-allowed bg-ink-900 text-parchment-500'
                    : 'bg-ink-850 hover:bg-ink-800 text-parchment-200'
                }`}
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
