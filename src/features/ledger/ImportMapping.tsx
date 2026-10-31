import React, { useState } from 'react';
import { ColumnMapping } from './ledgerTypes';
import { Settings2, ArrowRight, AlertCircle } from 'lucide-react';

interface ImportMappingProps {
  headers: string[];
  initialMapping: ColumnMapping;
  onConfirm: (mapping: ColumnMapping) => void;
  onCancel?: () => void;
}

export const ImportMapping: React.FC<ImportMappingProps> = ({
  headers,
  initialMapping,
  onConfirm,
  onCancel,
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping);
  const [useSeparateDebitCredit, setUseSeparateDebitCredit] = useState<boolean>(
    Boolean(initialMapping.debit && initialMapping.credit)
  );

  const hasDescription = Boolean(mapping.description);
  const hasAmount = useSeparateDebitCredit
    ? Boolean(mapping.debit && mapping.credit)
    : Boolean(mapping.amount);

  const isValid = hasDescription && hasAmount;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      ...mapping,
      amount: useSeparateDebitCredit ? null : mapping.amount,
      debit: useSeparateDebitCredit ? mapping.debit : null,
      credit: useSeparateDebitCredit ? mapping.credit : null,
    });
  };

  return (
    <div className="p-6 rounded-lg border border-bronze-600/40 bg-ink-900 shadow-xl space-y-5 animate-fadeIn">
      <div className="flex items-center space-x-2 text-bronze-400">
        <Settings2 className="w-5 h-5" />
        <h3 className="font-serif font-bold text-lg text-parchment-100">
          Confirm Column Mapping
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-parchment-400">
        We detected your CSV headers. Please verify or adjust the column assignments below so your expenses can be categorised accurately.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Description Column (Required) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-parchment-200 block">
            Description / Payee <span className="text-vermilion-400">*</span>
          </label>
          <select
            value={mapping.description || ''}
            onChange={(e) => setMapping({ ...mapping, description: e.target.value || null })}
            className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
          >
            <option value="">-- Select Column --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Date Column (Optional) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-parchment-200 block">
            Date <span className="text-parchment-500 text-[11px] font-normal">(Optional)</span>
          </label>
          <select
            value={mapping.date || ''}
            onChange={(e) => setMapping({ ...mapping, date: e.target.value || null })}
            className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
          >
            <option value="">-- None / Skip --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Format Toggle */}
        <div className="sm:col-span-2 pt-2 border-t border-ink-800 flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-parchment-300 cursor-pointer">
            <input
              type="radio"
              name="amountFormat"
              checked={!useSeparateDebitCredit}
              onChange={() => setUseSeparateDebitCredit(false)}
              className="accent-bronze-500"
            />
            <span>Single Amount Column (positive/negative)</span>
          </label>
          <label className="flex items-center space-x-2 text-parchment-300 cursor-pointer">
            <input
              type="radio"
              name="amountFormat"
              checked={useSeparateDebitCredit}
              onChange={() => setUseSeparateDebitCredit(true)}
              className="accent-bronze-500"
            />
            <span>Separate Debit & Credit Columns</span>
          </label>
        </div>

        {/* Amount Columns */}
        {!useSeparateDebitCredit ? (
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-parchment-200 block">
              Amount Column <span className="text-vermilion-400">*</span>
            </label>
            <select
              value={mapping.amount || ''}
              onChange={(e) => setMapping({ ...mapping, amount: e.target.value || null })}
              className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
            >
              <option value="">-- Select Column --</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="font-semibold text-parchment-200 block">
                Debit / Outflow Column <span className="text-vermilion-400">*</span>
              </label>
              <select
                value={mapping.debit || ''}
                onChange={(e) => setMapping({ ...mapping, debit: e.target.value || null })}
                className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-parchment-200 block">
                Credit / Inflow Column <span className="text-vermilion-400">*</span>
              </label>
              <select
                value={mapping.credit || ''}
                onChange={(e) => setMapping({ ...mapping, credit: e.target.value || null })}
                className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Existing Category Column (Optional) */}
        <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-ink-800">
          <label className="font-semibold text-parchment-200 block">
            Existing Category / Type <span className="text-parchment-500 text-[11px] font-normal">(Optional)</span>
          </label>
          <select
            value={mapping.category || ''}
            onChange={(e) => setMapping({ ...mapping, category: e.target.value || null })}
            className="w-full px-3 py-2 rounded bg-ink-950 border border-ink-700 text-parchment-200 focus:outline-none focus:ring-1 focus:ring-bronze-400"
          >
            <option value="">-- None / Auto-Categorise All --</option>
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isValid && (
        <div className="p-3 rounded bg-vermilion-950/40 border border-vermilion-800/60 text-vermilion-300 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Please map Description and Amount (or Debit + Credit) before proceeding.</span>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-ink-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-ink-850 hover:bg-ink-800 text-parchment-300 text-xs font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={!isValid}
          onClick={handleConfirm}
          className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded font-serif font-bold text-xs sm:text-sm tracking-wide transition-all ${
            isValid
              ? 'bg-bronze-600 hover:bg-bronze-500 text-ink-950 shadow-md cursor-pointer'
              : 'bg-ink-800 text-parchment-500 cursor-not-allowed'
          }`}
        >
          <span>Apply Mapping & Process</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
