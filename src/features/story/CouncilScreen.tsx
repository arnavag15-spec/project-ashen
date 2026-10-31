import React from 'react';
import { Shield, Wheat, ArrowRight, CheckCircle2, UserCheck, UserX } from 'lucide-react';
import { FirstCouncilChoice, RenjiChoice, Relationships } from '../kingdom/gameTypes';

interface CouncilScreenProps {
  firstChoice: FirstCouncilChoice | null;
  renjiChoice: RenjiChoice | null;
  onSelectFirstChoice: (choice: FirstCouncilChoice) => void;
  onSelectRenjiChoice: (choice: RenjiChoice) => void;
  onProceedToSettlement: () => void;
  relationships: Relationships;
}

export const CouncilScreen: React.FC<CouncilScreenProps> = ({
  firstChoice,
  renjiChoice,
  onSelectFirstChoice,
  onSelectRenjiChoice,
  onProceedToSettlement,
  relationships,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Scene Header */}
      <div className="border-b border-ink-800 pb-4">
        <span className="text-xs font-serif uppercase tracking-widest text-bronze-400 block mb-1">
          Scene 2 & 3 • The War Council
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
          Chamber of the War Council
        </h2>
        <p className="text-xs sm:text-sm text-parchment-400 mt-1 font-sans">
          Your two chief retainers argue under flickering lanterns. The northern army mobilises, and emergency orders must be dispatched.
        </p>
      </div>

      {/* Retainer Dialogue Snippets with Dynamic Relationship Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-ink-800 bg-ink-900/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-parchment-200 text-sm">Lord Daigo</span>
            <span className="text-xs text-parchment-400">
              Veteran Commander • Loyalty: <strong className="text-parchment-200">{relationships.daigo}</strong>/100
            </span>
          </div>
          <p className="text-xs text-parchment-300 italic border-l-2 border-blue-400/60 pl-3 py-0.5">
            “If the watchtowers fall at the mountain passes, neither granaries nor town halls will save us. We must garrison the ramparts immediately.”
          </p>
        </div>

        <div className="p-4 rounded border border-ink-800 bg-ink-900/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-parchment-200 text-sm">Lady Aki</span>
            <span className="text-xs text-parchment-400">
              Royal Steward • Confidence: <strong className="text-parchment-200">{relationships.aki}</strong>/100
            </span>
          </div>
          <p className="text-xs text-parchment-300 italic border-l-2 border-emerald-400/60 pl-3 py-0.5">
            “Soldiers cannot march on empty bellies, my Lord. If we starve our tenant farmers, the province collapses from within before an arrow is fired.”
          </p>
        </div>
      </div>

      {/* Decision 1: Frontier vs Villages */}
      <div className="space-y-3">
        <h3 className="font-serif text-base sm:text-lg font-semibold text-parchment-100 flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-bronze-900 border border-bronze-500 text-xs flex items-center justify-center text-bronze-300">1</span>
          <span>Strategic Focus: Frontier Defence or Food Security</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelectFirstChoice('frontier')}
            className={`p-4 rounded text-left transition-all border ${
              firstChoice === 'frontier'
                ? 'bg-ink-850 border-bronze-400 shadow-md ring-1 ring-bronze-400'
                : 'bg-ink-900/60 border-ink-800 hover:border-ink-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-sm text-parchment-100 flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Secure the Frontier</span>
              </span>
              {firstChoice === 'frontier' && <CheckCircle2 className="w-4 h-4 text-bronze-400" />}
            </div>
            <p className="text-xs text-parchment-400 mb-2">
              Repair mountain fortifications and post veteran sentries.
            </p>
            <div className="text-[11px] text-bronze-300 font-mono">
              +20 Defence, -5 Food, -2 Trust, -8 Treasury • Daigo +8, Aki -3
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectFirstChoice('villages')}
            className={`p-4 rounded text-left transition-all border ${
              firstChoice === 'villages'
                ? 'bg-ink-850 border-bronze-400 shadow-md ring-1 ring-bronze-400'
                : 'bg-ink-900/60 border-ink-800 hover:border-ink-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-sm text-parchment-100 flex items-center space-x-1.5">
                <Wheat className="w-4 h-4 text-emerald-400" />
                <span>Protect the Villages</span>
              </span>
              {firstChoice === 'villages' && <CheckCircle2 className="w-4 h-4 text-bronze-400" />}
            </div>
            <p className="text-xs text-parchment-400 mb-2">
              Restore valley granaries and reinforce irrigation canals.
            </p>
            <div className="text-[11px] text-bronze-300 font-mono">
              +20 Food, -5 Defence, +8 Trust, -8 Treasury • Aki +8, Daigo -3
            </div>
          </button>
        </div>
      </div>

      {/* Decision 2: The Exile Renji */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-parchment-100 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-bronze-900 border border-bronze-500 text-xs flex items-center justify-center text-bronze-300">2</span>
            <span>The Exile: Lord Renji Returns</span>
          </h3>
          <span className="text-xs text-parchment-400">
            Renji Trust: <strong className="text-parchment-200">{relationships.renji}</strong>/100
          </span>
        </div>
        <p className="text-xs text-parchment-400">
          Renji, exiled years ago by your late father, arrives at dusk claiming to hold battle plans of the northern army. Daigo demands his arrest; Aki urges pragmatism.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelectRenjiChoice('welcome')}
            className={`p-4 rounded text-left transition-all border ${
              renjiChoice === 'welcome'
                ? 'bg-ink-850 border-bronze-400 shadow-md ring-1 ring-bronze-400'
                : 'bg-ink-900/60 border-ink-800 hover:border-ink-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-sm text-parchment-100 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Welcome Renji</span>
              </span>
              {renjiChoice === 'welcome' && <CheckCircle2 className="w-4 h-4 text-bronze-400" />}
            </div>
            <p className="text-xs text-parchment-400 mb-2">
              Receive his intelligence and northern scouts advantage. Daigo is angered.
            </p>
            <div className="text-[11px] text-bronze-300 font-mono">
              +8 Defence • Renji Trust +25, Daigo -10
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectRenjiChoice('refuse')}
            className={`p-4 rounded text-left transition-all border ${
              renjiChoice === 'refuse'
                ? 'bg-ink-850 border-bronze-400 shadow-md ring-1 ring-bronze-400'
                : 'bg-ink-900/60 border-ink-800 hover:border-ink-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-sm text-parchment-100 flex items-center space-x-1.5">
                <UserX className="w-4 h-4 text-vermilion-400" />
                <span>Turn Renji Away</span>
              </span>
              {renjiChoice === 'refuse' && <CheckCircle2 className="w-4 h-4 text-bronze-400" />}
            </div>
            <p className="text-xs text-parchment-400 mb-2">
              Uphold your late father's decree. Daigo approves, but crucial enemy insights are lost.
            </p>
            <div className="text-[11px] text-bronze-300 font-mono">
              -5 Defence • Daigo +10, Renji -25
            </div>
          </button>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="pt-4 border-t border-ink-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <span className="text-xs text-parchment-400">
          {firstChoice && renjiChoice
            ? 'Council deliberations concluded. Ready to oversee the settlement.'
            : 'Select decisions above or proceed with preliminary orders.'}
        </span>
        <button
          onClick={onProceedToSettlement}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-bronze-400"
        >
          <span>Proceed to Settlement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
