import React from 'react';
import { 
  Building2, 
  Shield, 
  Wheat, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Swords, 
  CheckCircle2, 
  Lock,
  MessageSquare
} from 'lucide-react';
import { BuildingId } from './gameTypes';
import { FirstCouncilChoice, RenjiChoice } from './gameTypes';

interface SettlementScreenProps {
  onOpenLedger: () => void;
  onGoToEnding: () => void;
  sealsAvailable: number;
  upgradedBuildings: BuildingId[];
  onUpgradeBuilding: (id: BuildingId) => void;
  firstChoice?: FirstCouncilChoice | null;
  renjiChoice?: RenjiChoice | null;
}

export const SettlementScreen: React.FC<SettlementScreenProps> = ({
  onOpenLedger,
  onGoToEnding,
  sealsAvailable,
  upgradedBuildings,
  onUpgradeBuilding,
  firstChoice = null,
  renjiChoice = null,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Settlement Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ink-800 pb-4">
        <div>
          <span className="text-xs font-serif uppercase tracking-widest text-bronze-400 block mb-1">
            Scene 4 • Province Settlement
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
            The Capital of Arahama
          </h2>
          <p className="text-xs sm:text-sm text-parchment-400 mt-1 font-sans">
            Oversee repairs to key civic and military structures before the northern host arrives.
          </p>
        </div>

        {/* Seal Status Pill */}
        <div className="p-3 rounded border border-bronze-600/40 bg-ink-900 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-bronze-900/60 border border-bronze-500/60 flex items-center justify-center text-bronze-300">
            <Sparkles className="w-4 h-4 text-bronze-400" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-parchment-100">
              {sealsAvailable} Stewardship {sealsAvailable === 1 ? 'Seal' : 'Seals'} Ready
            </div>
            <div className="text-[11px] text-parchment-400">
              {upgradedBuildings.length}/3 buildings upgraded
            </div>
          </div>
        </div>
      </div>

      {/* Reactive Retainer Advisory Box */}
      <div className="p-4 rounded-lg bg-ink-900/90 border border-ink-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-serif font-bold text-bronze-400 uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-bronze-400" />
          <span>Council Retainers' Reports</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-ink-950/80 border border-ink-800/80">
            <span className="font-serif font-bold text-parchment-200 block mb-1">Lord Daigo</span>
            <p className="text-parchment-300 italic text-[11px]">
              {firstChoice === 'frontier'
                ? '“Sentries are dug in along the crest road. The frontier is alert, though supplies remain thin.”'
                : '“With priority given to the farmers, the pass remains lightly held. We must make every arrow count.”'}
            </p>
          </div>
          <div className="p-3 rounded bg-ink-950/80 border border-ink-800/80">
            <span className="font-serif font-bold text-parchment-200 block mb-1">Lady Aki</span>
            <p className="text-parchment-300 italic text-[11px]">
              {firstChoice === 'villages'
                ? '“Valley granaries and irrigation ditches are restored. The villagers pray for your victory.”'
                : '“The villagers fear winter shortages, but they understand the fortress must stand first.”'}
            </p>
          </div>
        </div>
        {renjiChoice === 'welcome' && (
          <div className="p-2.5 rounded bg-ink-950/60 border border-ink-800/60 text-xs">
            <span className="font-serif font-semibold text-parchment-300">Renji's Northern Intelligence: </span>
            <span className="text-parchment-400 italic text-[11px]">
              “The northern army plans to force the central river pass at dawn. Fortify the watchtowers or granaries before daybreak.”
            </span>
          </div>
        )}
      </div>

      {/* Narrative Chore Prompt */}
      <div className="p-4 sm:p-5 rounded-lg border border-bronze-600/30 bg-gradient-to-r from-ink-900 to-ink-950 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-bronze-400" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-parchment-100">
              The Steward's Ledger
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-parchment-300 max-w-2xl">
            Each ledger milestone (Import, Categorisation pass, Duplicate review & Export) awards 1 Stewardship Seal. Spend seals below to commission provincial infrastructure.
          </p>
        </div>
        <button
          onClick={onOpenLedger}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs sm:text-sm tracking-wide transition-all shadow focus:outline-none focus:ring-2 focus:ring-bronze-400 whitespace-nowrap"
        >
          <span>Open Steward's Ledger</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Buildings Grid */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-parchment-200">
          Settlement Infrastructure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Building 1: Granary */}
          {(() => {
            const isUpgraded = upgradedBuildings.includes('granary');
            const canUpgrade = !isUpgraded && sealsAvailable > 0;
            return (
              <div
                className={`p-5 rounded border transition-colors flex flex-col justify-between space-y-4 ${
                  isUpgraded
                    ? 'border-emerald-700/60 bg-ink-900/90'
                    : 'border-ink-800 bg-ink-900/90 hover:border-ink-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded bg-ink-950 border border-ink-800 flex items-center justify-center text-amber-400">
                      <Wheat className="w-5 h-5" />
                    </div>
                    {isUpgraded ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Upgraded</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink-800 text-parchment-400">
                        Base Tier
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-parchment-100">
                    Highland Granary
                  </h4>
                  <p className="text-xs text-parchment-400 leading-relaxed">
                    Reinforced timber storehouses for autumn grain, ensuring army rations and public morale.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-ink-800">
                  <div className="text-xs text-bronze-300 font-mono">
                    Effect: +14 Food Security, +4 Public Trust
                  </div>
                  {isUpgraded ? (
                    <div className="w-full py-2 px-3 rounded text-xs font-serif font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canUpgrade}
                      onClick={() => onUpgradeBuilding('granary')}
                      className={`w-full py-2 px-3 rounded text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        canUpgrade
                          ? 'bg-bronze-600 hover:bg-bronze-500 text-ink-950 shadow cursor-pointer'
                          : 'bg-ink-950 text-parchment-500 border border-ink-800 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{sealsAvailable > 0 ? 'Upgrade (1 Seal)' : 'Requires 1 Seal'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Building 2: Watchtower */}
          {(() => {
            const isUpgraded = upgradedBuildings.includes('watchtower');
            const canUpgrade = !isUpgraded && sealsAvailable > 0;
            return (
              <div
                className={`p-5 rounded border transition-colors flex flex-col justify-between space-y-4 ${
                  isUpgraded
                    ? 'border-emerald-700/60 bg-ink-900/90'
                    : 'border-ink-800 bg-ink-900/90 hover:border-ink-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded bg-ink-950 border border-ink-800 flex items-center justify-center text-blue-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    {isUpgraded ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Upgraded</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink-800 text-parchment-400">
                        Base Tier
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-parchment-100">
                    Crest Watchtower
                  </h4>
                  <p className="text-xs text-parchment-400 leading-relaxed">
                    Signal beacons and fortified archery platforms overlooking northern valley passes.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-ink-800">
                  <div className="text-xs text-bronze-300 font-mono">
                    Effect: +14 Defence Readiness
                  </div>
                  {isUpgraded ? (
                    <div className="w-full py-2 px-3 rounded text-xs font-serif font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canUpgrade}
                      onClick={() => onUpgradeBuilding('watchtower')}
                      className={`w-full py-2 px-3 rounded text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        canUpgrade
                          ? 'bg-bronze-600 hover:bg-bronze-500 text-ink-950 shadow cursor-pointer'
                          : 'bg-ink-950 text-parchment-500 border border-ink-800 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{sealsAvailable > 0 ? 'Upgrade (1 Seal)' : 'Requires 1 Seal'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Building 3: Marketplace */}
          {(() => {
            const isUpgraded = upgradedBuildings.includes('marketplace');
            const canUpgrade = !isUpgraded && sealsAvailable > 0;
            return (
              <div
                className={`p-5 rounded border transition-colors flex flex-col justify-between space-y-4 ${
                  isUpgraded
                    ? 'border-emerald-700/60 bg-ink-900/90'
                    : 'border-ink-800 bg-ink-900/90 hover:border-ink-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded bg-ink-950 border border-ink-800 flex items-center justify-center text-emerald-400">
                      <Coins className="w-5 h-5" />
                    </div>
                    {isUpgraded ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Upgraded</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink-800 text-parchment-400">
                        Base Tier
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-parchment-100">
                    River Marketplace
                  </h4>
                  <p className="text-xs text-parchment-400 leading-relaxed">
                    Caravan stalls and smithies, generating coin for administrative provisions and tax vitality.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-ink-800">
                  <div className="text-xs text-bronze-300 font-mono">
                    Effect: +10 Treasury, +3 Public Trust
                  </div>
                  {isUpgraded ? (
                    <div className="w-full py-2 px-3 rounded text-xs font-serif font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canUpgrade}
                      onClick={() => onUpgradeBuilding('marketplace')}
                      className={`w-full py-2 px-3 rounded text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        canUpgrade
                          ? 'bg-bronze-600 hover:bg-bronze-500 text-ink-950 shadow cursor-pointer'
                          : 'bg-ink-950 text-parchment-500 border border-ink-800 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{sealsAvailable > 0 ? 'Upgrade (1 Seal)' : 'Requires 1 Seal'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Advance to Battle */}
      <div className="pt-4 border-t border-ink-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <span className="text-xs text-parchment-400">
          Ready to face the northern army? Your accumulated defences and provisions will decide the fate of Arahama.
        </span>
        <button
          onClick={onGoToEnding}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-vermilion-700 hover:bg-vermilion-600 text-parchment-100 font-serif font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg hover:shadow-vermilion-700/20 focus:outline-none focus:ring-2 focus:ring-vermilion-400"
        >
          <Swords className="w-4 h-4" />
          <span>March to the Northern Pass</span>
        </button>
      </div>
    </div>
  );
};
