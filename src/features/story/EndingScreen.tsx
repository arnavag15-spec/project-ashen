import React from 'react';
import { 
  Swords, 
  RotateCcw, 
  Award, 
  Shield, 
  Wheat, 
  Users, 
  Coins,
  CheckCircle2,
  AlertTriangle,
  Skull
} from 'lucide-react';
import { GameState } from '../kingdom/gameTypes';
import { determineEnding } from '../kingdom/ending';

interface EndingScreenProps {
  onPlayAgain: () => void;
  gameState: GameState;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onPlayAgain, gameState }) => {
  const ending = determineEnding(
    gameState.stats,
    gameState.relationships,
    gameState.firstCouncilChoice,
    gameState.renjiChoice
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Climax Hero Card */}
      <div className="rounded-lg border border-bronze-600/40 bg-ink-900/90 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex items-center space-x-2 text-bronze-400 text-xs font-serif tracking-widest uppercase">
          <Swords className="w-4 h-4 text-bronze-400" />
          <span>Scene 5 • Confrontation at the Northern Pass</span>
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
            Battle Resolution • Chapter I
          </h2>
          <p className="text-xs sm:text-sm text-parchment-400 mt-1">
            War horns echo down the pine-clad ravines as the northern vanguard meets your lines.
          </p>
        </div>

        {/* Dynamic Ending Tier Banner */}
        <div
          className={`p-6 rounded-lg border space-y-3 ${
            ending.tier === 'dawn'
              ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-100'
              : ending.tier === 'costly'
              ? 'bg-amber-950/40 border-amber-600/70 text-amber-100'
              : 'bg-vermilion-950/40 border-vermilion-600/70 text-vermilion-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {ending.tier === 'dawn' ? (
                <Award className="w-7 h-7 text-emerald-400" />
              ) : ending.tier === 'costly' ? (
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              ) : (
                <Skull className="w-7 h-7 text-vermilion-400" />
              )}
              <div>
                <span className="text-[11px] font-serif uppercase tracking-widest block opacity-75">
                  Outcome Tier
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {ending.title}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-mono font-bold">
                {ending.readinessScore}
              </span>
              <span className="text-xs opacity-75 font-mono">/100 Readiness</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium italic border-t border-current/20 pt-2">
            “{ending.tagline}”
          </p>

          <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-sans">
            {ending.explanation}
          </p>
        </div>

        {/* Cinematic Prose Narration */}
        <div className="p-5 rounded-lg border border-ink-800 bg-ink-950/70 space-y-2">
          <span className="text-xs font-serif uppercase tracking-widest text-bronze-400 block">
            Battlefield Chronicles
          </span>
          <p className="text-xs sm:text-sm text-parchment-300 leading-relaxed font-sans italic">
            {ending.cinematicText}
          </p>
        </div>

        {/* Character Reactions */}
        <div className="space-y-3">
          <span className="text-xs font-serif uppercase tracking-widest text-bronze-400 block">
            Retainers' Verdict
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded border border-ink-800 bg-ink-950/80 space-y-1">
              <div className="flex items-center justify-between text-parchment-200 font-serif font-bold">
                <span>Lord Daigo</span>
                <span className="text-[10px] text-parchment-400 font-sans">Loyalty: {gameState.relationships.daigo}</span>
              </div>
              <p className="text-parchment-300 italic text-[11px]">{ending.characterReactions.daigo}</p>
            </div>

            <div className="p-3.5 rounded border border-ink-800 bg-ink-950/80 space-y-1">
              <div className="flex items-center justify-between text-parchment-200 font-serif font-bold">
                <span>Lady Aki</span>
                <span className="text-[10px] text-parchment-400 font-sans">Confidence: {gameState.relationships.aki}</span>
              </div>
              <p className="text-parchment-300 italic text-[11px]">{ending.characterReactions.aki}</p>
            </div>

            <div className="p-3.5 rounded border border-ink-800 bg-ink-950/80 space-y-1">
              <div className="flex items-center justify-between text-parchment-200 font-serif font-bold">
                <span>Lord Renji</span>
                <span className="text-[10px] text-parchment-400 font-sans">Trust: {gameState.relationships.renji}</span>
              </div>
              <p className="text-parchment-300 italic text-[11px]">{ending.characterReactions.renji}</p>
            </div>
          </div>
        </div>

        {/* Readiness Formula Breakdown Diagnostic */}
        <div className="p-4 rounded border border-ink-800 bg-ink-950/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-parchment-200">
            <span>Readiness Score Formula Breakdown</span>
            <span className="text-[11px] text-parchment-400 font-mono">
              round(0.40*Def + 0.25*Food + 0.20*Trust + 0.15*Treasury)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-ink-900 border border-ink-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-blue-400">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold">Defence (40%)</span>
              </div>
              <div className="font-mono text-parchment-100">
                {gameState.stats.defence} &times; 0.4 = <strong>{ending.breakdown.defenceWeight}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded bg-ink-900 border border-ink-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-500">
                <Wheat className="w-3.5 h-3.5" />
                <span className="font-semibold">Food (25%)</span>
              </div>
              <div className="font-mono text-parchment-100">
                {gameState.stats.food} &times; 0.25 = <strong>{ending.breakdown.foodWeight}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded bg-ink-900 border border-ink-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Users className="w-3.5 h-3.5" />
                <span className="font-semibold">Trust (20%)</span>
              </div>
              <div className="font-mono text-parchment-100">
                {gameState.stats.publicTrust} &times; 0.2 = <strong>{ending.breakdown.trustWeight}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded bg-ink-900 border border-ink-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-bronze-400">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-semibold">Treasury (15%)</span>
              </div>
              <div className="font-mono text-parchment-100">
                {gameState.stats.treasury} &times; 0.15 = <strong>{ending.breakdown.treasuryWeight}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Reset / Play Chapter Again */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-ink-800">
          <span className="text-xs text-parchment-400 italic">
            End of Chapter I. Reset to explore alternative council decisions and settlement paths.
          </span>
          <button
            onClick={onPlayAgain}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded bg-bronze-600 hover:bg-bronze-500 text-ink-950 font-serif font-bold text-xs sm:text-sm tracking-wide transition-all shadow focus:outline-none focus:ring-2 focus:ring-bronze-400"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Chapter Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
