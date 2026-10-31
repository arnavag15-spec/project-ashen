import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { Screen } from './types/navigation';
import { PrologueScreen } from './features/story/PrologueScreen';
import { CouncilScreen } from './features/story/CouncilScreen';
import { SettlementScreen } from './features/kingdom/SettlementScreen';
import { LedgerScreen } from './features/ledger/LedgerScreen';
import { EndingScreen } from './features/story/EndingScreen';
import {
  GameState,
  FirstCouncilChoice,
  RenjiChoice,
  BuildingId,
} from './features/kingdom/gameTypes';
import {
  getInitialGameState,
  computeGameState,
  upgradeBuilding,
  updateMilestones,
} from './features/kingdom/gameRules';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('prologue');
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [ledgerResetKey, setLedgerResetKey] = useState<number>(0);

  // Choice 1: Secure Frontier vs. Protect Villages
  const handleSelectFirstChoice = (choice: FirstCouncilChoice) => {
    setGameState((prev) =>
      computeGameState(choice, prev.renjiChoice, prev.upgradedBuildings, prev.milestones)
    );
  };

  // Choice 2: Welcome Renji vs. Refuse Renji
  const handleSelectRenjiChoice = (choice: RenjiChoice) => {
    setGameState((prev) =>
      computeGameState(prev.firstCouncilChoice, choice, prev.upgradedBuildings, prev.milestones)
    );
  };

  // Upgrades a building with an available Stewardship Seal
  const handleUpgradeBuilding = (buildingId: BuildingId) => {
    setGameState((prev) => {
      const res = upgradeBuilding(prev, buildingId);
      return res.success ? res.state : prev;
    });
  };

  // Updates ledger milestone progress and awards seals without duplication
  const handleMilestoneUpdate = (milestones: {
    imported?: boolean;
    categorised?: boolean;
    reviewedAndExported?: boolean;
  }) => {
    setGameState((prev) => updateMilestones(prev, milestones));
  };

  // Reset entire session back to initial state
  const handleReset = () => {
    setGameState(getInitialGameState());
    setLedgerResetKey((k) => k + 1);
    setCurrentScreen('prologue');
  };

  return (
    <AppShell
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      stats={gameState.stats}
      seals={gameState.sealsAvailable}
    >
      {currentScreen === 'prologue' && (
        <PrologueScreen onStartCouncil={() => setCurrentScreen('council')} />
      )}

      {currentScreen === 'council' && (
        <CouncilScreen
          firstChoice={gameState.firstCouncilChoice}
          renjiChoice={gameState.renjiChoice}
          onSelectFirstChoice={handleSelectFirstChoice}
          onSelectRenjiChoice={handleSelectRenjiChoice}
          onProceedToSettlement={() => setCurrentScreen('settlement')}
          relationships={gameState.relationships}
        />
      )}

      {currentScreen === 'settlement' && (
        <SettlementScreen
          onOpenLedger={() => setCurrentScreen('ledger')}
          onGoToEnding={() => setCurrentScreen('ending')}
          sealsAvailable={gameState.sealsAvailable}
          upgradedBuildings={gameState.upgradedBuildings}
          onUpgradeBuilding={handleUpgradeBuilding}
          firstChoice={gameState.firstCouncilChoice}
          renjiChoice={gameState.renjiChoice}
        />
      )}

      {currentScreen === 'ledger' && (
        <LedgerScreen
          key={ledgerResetKey}
          onReturnToSettlement={() => setCurrentScreen('settlement')}
          onMilestoneUpdate={handleMilestoneUpdate}
          milestones={gameState.milestones}
        />
      )}

      {currentScreen === 'ending' && (
        <EndingScreen onPlayAgain={handleReset} gameState={gameState} />
      )}
    </AppShell>
  );
}

export default App;
