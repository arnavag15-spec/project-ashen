import React from 'react';
import { Screen } from '../types/navigation';
import { 
  Shield, 
  Wheat, 
  Users, 
  Coins, 
  Scroll, 
  Compass, 
  MapPin, 
  Castle, 
  Lock,
  Sparkles
} from 'lucide-react';

interface AppShellProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  children: React.ReactNode;
  stats?: {
    food: number;
    defence: number;
    publicTrust: number;
    treasury: number;
  };
  seals?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScreen,
  onNavigate,
  children,
  stats = { food: 42, defence: 40, publicTrust: 45, treasury: 35 },
  seals = 0,
}) => {
  const screens: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'prologue', label: 'Prologue', icon: <Scroll className="w-4 h-4" /> },
    { id: 'council', label: 'Council', icon: <Users className="w-4 h-4" /> },
    { id: 'settlement', label: 'Settlement', icon: <Castle className="w-4 h-4" /> },
    { id: 'ledger', label: "Steward's Ledger", icon: <Compass className="w-4 h-4" /> },
    { id: 'ending', label: 'Northern Pass', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-parchment-200">
      {/* Top Atmospheric Banner */}
      <header className="border-b border-ink-800 bg-ink-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Title & Chapter badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded border border-bronze-500/50 bg-ink-950 flex items-center justify-center text-bronze-400 shadow-inner">
                <Castle className="w-5 h-5 text-bronze-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-parchment-100">
                    PROJECT ASHEN CROWN
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-bronze-900/30 border border-bronze-700/40 text-bronze-300 font-medium">
                    Arahama Province
                  </span>
                </div>
                <p className="text-xs text-parchment-400 font-sans tracking-wide">
                  Chapter I: The Inheritance of Ashes
                </p>
              </div>
            </div>

            {/* Kingdom Stats Preview & Seals */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-sans">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ink-850 border border-ink-700/60" title="Food Security">
                <Wheat className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-parchment-400">Food:</span>
                <span className="font-semibold text-parchment-100">{stats.food}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ink-850 border border-ink-700/60" title="Defence">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-parchment-400">Def:</span>
                <span className="font-semibold text-parchment-100">{stats.defence}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ink-850 border border-ink-700/60" title="Public Trust">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-parchment-400">Trust:</span>
                <span className="font-semibold text-parchment-100">{stats.publicTrust}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ink-850 border border-ink-700/60" title="Treasury">
                <Coins className="w-3.5 h-3.5 text-bronze-400" />
                <span className="text-parchment-400">Treasury:</span>
                <span className="font-semibold text-parchment-100">{stats.treasury}</span>
              </div>

              {/* Stewardship Seals */}
              <div className="flex items-center space-x-1 px-3 py-1 rounded bg-bronze-950/70 border border-bronze-600/60 text-bronze-300 shadow-sm" title="Stewardship Seals (Earned via Ledger tasks)">
                <Sparkles className="w-3.5 h-3.5 text-bronze-400" />
                <span className="font-semibold text-xs tracking-wider">{seals}/3 Seals</span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="mt-3 sm:mt-4 pt-2 border-t border-ink-800/80 flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            {screens.map((screen) => {
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => onNavigate(screen.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-bronze-500 ${
                    isActive
                      ? 'bg-bronze-500/20 text-bronze-300 border border-bronze-500/50'
                      : 'text-parchment-400 hover:text-parchment-200 hover:bg-ink-800 border border-transparent'
                  }`}
                >
                  {screen.icon}
                  <span>{screen.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-800/80 bg-ink-950 py-4 text-xs text-parchment-400 font-sans">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-bronze-400/80" />
            <span>Client-side security: Expense data is processed entirely in your browser and never uploaded.</span>
          </div>
          <div>Project Ashen Crown • Hackathon MVP</div>
        </div>
      </footer>
    </div>
  );
};
