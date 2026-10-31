import React from 'react';
import { ArrowRight, Flame, ShieldAlert, Award } from 'lucide-react';

interface PrologueScreenProps {
  onStartCouncil: () => void;
}

export const PrologueScreen: React.FC<PrologueScreenProps> = ({ onStartCouncil }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Atmosphere Banner */}
      <div className="relative rounded-lg border border-bronze-600/30 bg-ink-900/80 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-bronze-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-vermilion-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-bronze-500/30 bg-bronze-950/40 text-bronze-400 text-xs tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Prologue • The Inheritance of Ashes</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl text-parchment-100 font-bold leading-tight">
            “A lord is dead. A province is divided. And a young heir must decide what is worth saving.”
          </h2>

          <p className="text-sm sm:text-base text-parchment-300 leading-relaxed font-sans">
            You return to the mountain stronghold of <strong className="text-parchment-100 font-serif">Arahama</strong> following your father’s passing. The ancestral seat stands worn by years of ceaseless border skirmishes. The provincial treasury sits drained, granaries are low, and northern scouts report war banners gathering along the jagged mountain passes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-xs sm:text-sm">
            <div className="flex items-start space-x-3 p-3 rounded bg-ink-950/60 border border-ink-800">
              <ShieldAlert className="w-5 h-5 text-vermilion-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-parchment-200 block font-serif">Imminent Invasion</span>
                <span className="text-parchment-400">The northern army will cross the pass within weeks. Preparation is vital.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded bg-ink-950/60 border border-ink-800">
              <Award className="w-5 h-5 text-bronze-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-parchment-200 block font-serif">The Steward's Ledger</span>
                <span className="text-parchment-400">Complete real digital expense chores to earn Stewardship Seals and restore the realm.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onStartCouncil}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-bronze-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-bronze-400"
            >
              <span>Convene the Council</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-parchment-400 italic self-center">
              Your retainers await in the council chamber.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
