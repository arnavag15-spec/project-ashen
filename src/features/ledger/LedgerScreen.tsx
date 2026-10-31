import React, { useState, useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Settings2,
  Check,
  Award
} from 'lucide-react';
import { Transaction, ColumnMapping } from './ledgerTypes';
import { parseRawCsv, processTransactions, RawParseOutput } from './parseCsv';
import { exportTransactionsToCsv } from './exportCsv';
import { SAMPLE_EXPENSES_CSV } from '../../data/sampleExpenses';
import { ImportMapping } from './ImportMapping';
import { TransactionTable } from './TransactionTable';
import { LedgerMilestones } from '../kingdom/gameTypes';

interface LedgerScreenProps {
  onReturnToSettlement: () => void;
  onMilestoneUpdate: (milestones: {
    imported?: boolean;
    categorised?: boolean;
    reviewedAndExported?: boolean;
  }) => void;
  milestones?: LedgerMilestones;
}

export const LedgerScreen: React.FC<LedgerScreenProps> = ({ 
  onReturnToSettlement,
  onMilestoneUpdate,
  milestones = { imported: false, categorised: false, reviewedAndExported: false }
}) => {
  const [rawParseOutput, setRawParseOutput] = useState<RawParseOutput | null>(null);
  const [confirmedMapping, setConfirmedMapping] = useState<ColumnMapping | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [sourceName, setSourceName] = useState<string>('');
  const [isSampleData, setIsSampleData] = useState<boolean>(false);
  const [isExported, setIsExported] = useState<boolean>(false);
  const [exportStats, setExportStats] = useState<{ total: number; exported: number; excluded: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Raw CSV Loading (either File or string)
  const handleLoadCsv = async (content: File | string, filename: string, isDemo: boolean = false) => {
    try {
      setErrorMessage(null);
      setIsExported(false);
      setExportStats(null);
      
      const parsed = await parseRawCsv(content);

      if (parsed.rawRows.length === 0) {
        setErrorMessage('The selected file contains no readable transaction rows.');
        return;
      }

      setSourceName(filename);
      setIsSampleData(isDemo);
      setRawParseOutput(parsed);

      if (parsed.isAmbiguous) {
        setIsMappingModalOpen(true);
      } else {
        setConfirmedMapping(parsed.detectedMapping);
        const processed = processTransactions(parsed.rawRows, parsed.detectedMapping);
        setTransactions(processed);
        setIsMappingModalOpen(false);

        // Award Seal 1 (Imported) and Seal 2 (Categorised)
        onMilestoneUpdate({ imported: true, categorised: true });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to parse CSV file. Please ensure it is a valid CSV format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLoadCsv(file, file.name, false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      handleLoadCsv(file, file.name, false);
    } else if (file) {
      setErrorMessage('Please upload a file with the .csv extension.');
    }
  };

  const handleLoadSample = () => {
    handleLoadCsv(SAMPLE_EXPENSES_CSV, 'Ashen_Crown_Sample_Expenses.csv (Sample)', true);
  };

  const handleApplyMapping = (mapping: ColumnMapping) => {
    if (!rawParseOutput) return;
    setConfirmedMapping(mapping);
    const processed = processTransactions(rawParseOutput.rawRows, mapping);
    setTransactions(processed);
    setIsMappingModalOpen(false);

    // Award Seal 1 & Seal 2
    onMilestoneUpdate({ imported: true, categorised: true });
  };

  const handleUpdateCategory = (id: string, newCategory: any) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              category: newCategory,
              categoryReviewed: true,
            }
          : tx
      )
    );
  };

  const handleUpdateDuplicateDecision = (id: string, decision: 'keep' | 'exclude') => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              duplicateDecision: decision,
            }
          : tx
      )
    );
  };

  const handleConfirmAllReviewed = () => {
    setTransactions((prev) =>
      prev.map((tx) => ({
        ...tx,
        categoryReviewed: true,
      }))
    );
  };

  const handleKeepAllDuplicates = () => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.isDuplicate && tx.duplicateDecision === null
          ? { ...tx, duplicateDecision: 'keep' }
          : tx
      )
    );
  };

  const handleClearLedger = () => {
    setTransactions([]);
    setRawParseOutput(null);
    setConfirmedMapping(null);
    setIsMappingModalOpen(false);
    setSourceName('');
    setIsSampleData(false);
    setIsExported(false);
    setExportStats(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Review status calculations
  const pendingNeedsReviewCount = transactions.filter(
    (tx) => !tx.categoryReviewed && (tx.confidence === 'low' || tx.category === 'Other / Needs Review')
  ).length;

  const pendingDuplicatesCount = transactions.filter(
    (tx) => tx.isDuplicate && tx.duplicateDecision === null
  ).length;

  const isReviewSettled = transactions.length > 0 && pendingNeedsReviewCount === 0 && pendingDuplicatesCount === 0;

  const handleExport = () => {
    if (transactions.length === 0) return;
    const result = exportTransactionsToCsv(transactions, {
      filename: isSampleData
        ? 'ashen_crown_sample_reviewed.csv'
        : `cleaned_${sourceName.replace('.csv', '')}_reviewed.csv`,
    });

    setIsExported(true);
    setExportStats({
      total: result.totalCount,
      exported: result.exportedCount,
      excluded: result.excludedCount,
    });

    // Check if review is settled; if so, award Seal 3!
    if (isReviewSettled) {
      onMilestoneUpdate({ reviewedAndExported: true });
    }
  };

  // When review settles and user has already exported, trigger Seal 3 automatically
  useEffect(() => {
    if (isExported && isReviewSettled && !milestones.reviewedAndExported) {
      onMilestoneUpdate({ reviewedAndExported: true });
    }
  }, [isExported, isReviewSettled, milestones.reviewedAndExported, onMilestoneUpdate]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header & Return Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-serif uppercase tracking-widest text-bronze-400">
              The Steward's Ledger
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-bronze-900/40 border border-bronze-600/50 text-bronze-300 font-mono">
              In-Browser Chore Execution
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
            Personal Expense Stewardship
          </h2>
          <p className="text-xs sm:text-sm text-parchment-400 mt-1">
            Lady Aki presents your digital records. Reviewing and exporting them awards Stewardship Seals to rebuild the province.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {transactions.length > 0 && (
            <button
              onClick={handleClearLedger}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-ink-850 hover:bg-vermilion-950/60 border border-ink-700 hover:border-vermilion-700/60 text-parchment-400 hover:text-vermilion-300 text-xs transition-colors"
              title="Clear all active ledger transactions from browser memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Ledger</span>
            </button>
          )}
          <button
            onClick={onReturnToSettlement}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-ink-850 hover:bg-ink-800 border border-ink-700 text-parchment-200 text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-bronze-400" />
            <span>Return to Settlement</span>
          </button>
        </div>
      </div>

      {/* Narrative & Privacy Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-ink-900 border border-ink-700/70 flex items-start space-x-3 text-xs text-parchment-300">
          <Lock className="w-4 h-4 text-bronze-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-parchment-100">
              Browser-Only Privacy Disclosure
            </p>
            <p className="text-parchment-400 leading-relaxed text-[11px]">
              Your expense CSV is processed strictly in your local browser window. Transactions are never uploaded, stored, or sent to external servers or AI APIs. Your original file remains untouched.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-ink-900 border border-ink-700/70 flex items-start space-x-3 text-xs text-parchment-300">
          <Sparkles className="w-4 h-4 text-bronze-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-parchment-100">
              Economy Separation Principle
            </p>
            <p className="text-parchment-400 leading-relaxed text-[11px]">
              Your personal spending figures never convert into kingdom gold, grain, or troops. Only the completion of your chore milestones awards fictional Stewardship Seals to commission provincial repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-4 rounded bg-vermilion-950/50 border border-vermilion-800/80 text-vermilion-200 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-vermilion-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-vermilion-400 hover:text-vermilion-200 font-bold px-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Column Mapping Modal / Panel */}
      {isMappingModalOpen && rawParseOutput && (
        <ImportMapping
          headers={rawParseOutput.headers}
          initialMapping={rawParseOutput.detectedMapping}
          onConfirm={handleApplyMapping}
          onCancel={transactions.length > 0 ? () => setIsMappingModalOpen(false) : undefined}
        />
      )}

      {/* Milestone Progress Status Bar */}
      <div className="p-4 rounded-lg border border-bronze-600/30 bg-ink-900/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-bronze-400" />
            <span className="font-serif font-bold text-xs sm:text-sm text-parchment-100">
              Chore Milestones & Stewardship Seals
            </span>
          </div>
          <span className="text-xs font-mono text-bronze-300">
            {Number(milestones.imported) + Number(milestones.categorised) + Number(milestones.reviewedAndExported)} / 3 Seals Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Milestone 1 */}
          <div className={`p-3 rounded border flex items-center justify-between ${
            milestones.imported
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              : 'bg-ink-950 border-ink-800 text-parchment-400'
          }`}>
            <div>
              <span className="font-bold block font-serif">Seal 1: Ledger Opened</span>
              <span className="text-[11px] opacity-80">Import CSV or sample file</span>
            </div>
            {milestones.imported ? (
              <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center text-emerald-300">
                <Check className="w-3 h-3" />
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-parchment-500 font-mono">Pending</span>
            )}
          </div>

          {/* Milestone 2 */}
          <div className={`p-3 rounded border flex items-center justify-between ${
            milestones.categorised
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              : 'bg-ink-950 border-ink-800 text-parchment-400'
          }`}>
            <div>
              <span className="font-bold block font-serif">Seal 2: Accounts Ordered</span>
              <span className="text-[11px] opacity-80">Automatic categorisation pass</span>
            </div>
            {milestones.categorised ? (
              <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center text-emerald-300">
                <Check className="w-3 h-3" />
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-parchment-500 font-mono">Pending</span>
            )}
          </div>

          {/* Milestone 3 */}
          <div className={`p-3 rounded border flex items-center justify-between ${
            milestones.reviewedAndExported
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              : isReviewSettled && isExported
              ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
              : 'bg-ink-950 border-ink-800 text-parchment-400'
          }`}>
            <div>
              <span className="font-bold block font-serif">Seal 3: Ledger Settled</span>
              <span className="text-[11px] opacity-80">
                {milestones.reviewedAndExported
                  ? 'Reviewed & Exported'
                  : isReviewSettled
                  ? 'Review settled! Export to claim'
                  : `${pendingNeedsReviewCount} reviews, ${pendingDuplicatesCount} dups left`}
              </span>
            </div>
            {milestones.reviewedAndExported ? (
              <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center text-emerald-300">
                <Check className="w-3 h-3" />
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-parchment-500 font-mono">Pending</span>
            )}
          </div>
        </div>
      </div>

      {/* Upload Zone (When No Transactions Loaded) */}
      {transactions.length === 0 && !isMappingModalOpen && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-10 sm:p-14 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
            isDragging
              ? 'border-bronze-400 bg-bronze-950/20'
              : 'border-ink-700 bg-ink-900/60 hover:bg-ink-900/80'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-bronze-400 shadow-md">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-parchment-100">
              Upload Expense CSV
            </h3>
            <p className="text-xs sm:text-sm text-parchment-400 max-w-sm mt-1">
              Drag and drop your bank or credit card export here, or select a file locally.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer px-5 py-2.5 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md">
              <span>Choose CSV File</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleLoadSample}
              className="px-4 py-2.5 rounded bg-ink-850 hover:bg-ink-800 border border-ink-700 text-parchment-200 text-xs sm:text-sm font-serif font-semibold transition-colors"
            >
              Try Sample Ledger (Demo Data)
            </button>
          </div>

          <p className="text-[11px] text-parchment-500 max-w-md pt-2">
            Auto-detects Date, Description, Amount (or separate Debit/Credit). Quotes, commas, and currency signs handled automatically.
          </p>
        </div>
      )}

      {/* Active Transactions Workspace */}
      {transactions.length > 0 && !isMappingModalOpen && (
        <div className="space-y-6">
          {/* Active File Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg bg-ink-900 border border-ink-800">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-5 h-5 text-bronze-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-sm text-parchment-100">
                    {sourceName}
                  </span>
                  {isSampleData && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 border border-amber-700/60 text-amber-300 font-mono">
                      Fictional Sample Ledger
                    </span>
                  )}
                </div>
                <span className="text-xs text-parchment-400">
                  {transactions.length} rows loaded into browser memory
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {rawParseOutput && (
                <button
                  type="button"
                  onClick={() => setIsMappingModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-ink-850 hover:bg-ink-800 border border-ink-700 text-parchment-300 text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5 text-bronze-400" />
                  <span>Adjust Column Mapping</span>
                </button>
              )}

              {pendingNeedsReviewCount === 0 && (
                <button
                  type="button"
                  onClick={handleConfirmAllReviewed}
                  className="px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confirm All Categories</span>
                </button>
              )}

              {pendingDuplicatesCount > 0 && (
                <button
                  type="button"
                  onClick={handleKeepAllDuplicates}
                  className="px-3 py-1.5 rounded bg-ink-850 hover:bg-ink-800 border border-ink-700 text-parchment-300 text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <span>Keep All Duplicates</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs tracking-wide shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Cleaned CSV</span>
              </button>
            </div>
          </div>

          {/* Export Success Notification */}
          {isExported && exportStats && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="block text-emerald-100 font-serif">
                    Reviewed CSV successfully downloaded to your device!
                  </strong>
                  <span className="text-emerald-300/80 text-xs">
                    {exportStats.exported} rows exported. {exportStats.excluded} duplicate rows excluded. Original columns preserved.
                    {milestones.reviewedAndExported && ' Stewardship Seal 3 awarded!'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs"
                >
                  Download Again
                </button>
                <button
                  type="button"
                  onClick={onReturnToSettlement}
                  className="px-3 py-1 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs"
                >
                  Return to Settlement
                </button>
              </div>
            </div>
          )}

          {/* Main Transaction Review Table */}
          <TransactionTable
            transactions={transactions}
            onUpdateCategory={handleUpdateCategory}
            onUpdateDuplicateDecision={handleUpdateDuplicateDecision}
            onConfirmAllReviewed={handleConfirmAllReviewed}
          />
        </div>
      )}
    </div>
  );
};
