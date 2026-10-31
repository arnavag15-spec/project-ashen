import {
  KingdomStats,
  Relationships,
  FirstCouncilChoice,
  RenjiChoice,
  BuildingId,
  LedgerMilestones,
  GameState,
  BuildingInfo,
} from './gameTypes';

export const INITIAL_STATS: KingdomStats = {
  food: 42,
  defence: 40,
  publicTrust: 45,
  treasury: 35,
};

export const INITIAL_RELATIONSHIPS: Relationships = {
  daigo: 65,
  aki: 60,
  renji: 20,
};

export const INITIAL_MILESTONES: LedgerMilestones = {
  imported: false,
  categorised: false,
  reviewedAndExported: false,
};

export const BUILDINGS: Record<BuildingId, Omit<BuildingInfo, 'isUpgraded'>> = {
  granary: {
    id: 'granary',
    name: 'Highland Granary',
    tier: 1,
    costSeals: 1,
    description: 'Fortified grain silos sustaining rations and farmer morale during protracted sieges.',
    upgradeDescription: '+14 Food Security, +4 Public Trust',
    statEffects: { food: 14, publicTrust: 4 },
  },
  watchtower: {
    id: 'watchtower',
    name: 'Crest Watchtower',
    tier: 1,
    costSeals: 1,
    description: 'Elevated timber watchpost commanding northern mountain passes with beacon signals.',
    upgradeDescription: '+14 Defence Readiness',
    statEffects: { defence: 14 },
  },
  marketplace: {
    id: 'marketplace',
    name: 'River Marketplace',
    tier: 1,
    costSeals: 1,
    description: 'Caravan trading grounds sustaining administrative cashflow and civilian vitality.',
    upgradeDescription: '+10 Treasury, +3 Public Trust',
    statEffects: { treasury: 10, publicTrust: 3 },
  },
};

/**
 * Clamps any numeric value strictly to [0, 100].
 */
export function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Deterministically calculates the current state from base values, choices, and building upgrades.
 * This guarantees idempotency: choices cannot be farmed and stats never drift.
 */
export function computeGameState(
  firstCouncilChoice: FirstCouncilChoice | null,
  renjiChoice: RenjiChoice | null,
  upgradedBuildings: BuildingId[],
  milestones: LedgerMilestones
): GameState {
  let food = INITIAL_STATS.food;
  let defence = INITIAL_STATS.defence;
  let publicTrust = INITIAL_STATS.publicTrust;
  let treasury = INITIAL_STATS.treasury;

  let daigo = INITIAL_RELATIONSHIPS.daigo;
  let aki = INITIAL_RELATIONSHIPS.aki;
  let renji = INITIAL_RELATIONSHIPS.renji;

  // Apply Choice 1: Frontier vs. Villages
  if (firstCouncilChoice === 'frontier') {
    food -= 5;
    defence += 20;
    publicTrust -= 2;
    treasury -= 8;
    daigo += 8;
    aki -= 3;
  } else if (firstCouncilChoice === 'villages') {
    food += 20;
    defence -= 5;
    publicTrust += 8;
    treasury -= 8;
    aki += 8;
    daigo -= 3;
  }

  // Apply Choice 2: Welcome Renji vs. Refuse Renji
  if (renjiChoice === 'welcome') {
    defence += 8;
    renji += 25;
    daigo -= 10;
  } else if (renjiChoice === 'refuse') {
    defence -= 5;
    daigo += 10;
    renji -= 25;
  }

  // Deduplicate building upgrades to ensure each building is upgraded at most once
  const uniqueBuildings = Array.from(new Set(upgradedBuildings));

  // Apply Building Upgrades
  for (const bId of uniqueBuildings) {
    const building = BUILDINGS[bId];
    if (building) {
      if (building.statEffects.food) food += building.statEffects.food;
      if (building.statEffects.defence) defence += building.statEffects.defence;
      if (building.statEffects.publicTrust) publicTrust += building.statEffects.publicTrust;
      if (building.statEffects.treasury) treasury += building.statEffects.treasury;
    }
  }

  // Calculate Seals
  let sealsEarned = 0;
  if (milestones.imported) sealsEarned += 1;
  if (milestones.categorised) sealsEarned += 1;
  if (milestones.reviewedAndExported) sealsEarned += 1;
  sealsEarned = Math.min(3, Math.max(0, sealsEarned));

  const sealsSpent = uniqueBuildings.length;
  const sealsAvailable = Math.max(0, sealsEarned - sealsSpent);

  return {
    stats: {
      food: clamp(food),
      defence: clamp(defence),
      publicTrust: clamp(publicTrust),
      treasury: clamp(treasury),
    },
    relationships: {
      daigo: clamp(daigo),
      aki: clamp(aki),
      renji: clamp(renji),
    },
    firstCouncilChoice,
    renjiChoice,
    upgradedBuildings: uniqueBuildings,
    milestones,
    sealsEarned,
    sealsSpent,
    sealsAvailable,
  };
}

/**
 * Returns initial clean GameState.
 */
export function getInitialGameState(): GameState {
  return computeGameState(null, null, [], INITIAL_MILESTONES);
}

/**
 * Upgrades a building if seals are available and it is not already upgraded.
 */
export function upgradeBuilding(
  currentState: GameState,
  buildingId: BuildingId
): { success: boolean; state: GameState; reason?: string } {
  if (currentState.upgradedBuildings.includes(buildingId)) {
    return { success: false, state: currentState, reason: 'Building already upgraded in this chapter.' };
  }

  if (currentState.sealsAvailable < 1) {
    return { success: false, state: currentState, reason: 'No Stewardship Seals available.' };
  }

  const newUpgrades = [...currentState.upgradedBuildings, buildingId];
  const newState = computeGameState(
    currentState.firstCouncilChoice,
    currentState.renjiChoice,
    newUpgrades,
    currentState.milestones
  );

  return { success: true, state: newState };
}

/**
 * Updates ledger milestones and awards corresponding seals without duplication.
 */
export function updateMilestones(
  currentState: GameState,
  newMilestones: Partial<LedgerMilestones>
): GameState {
  const merged: LedgerMilestones = {
    imported: Boolean(currentState.milestones.imported || newMilestones.imported),
    categorised: Boolean(currentState.milestones.categorised || newMilestones.categorised),
    reviewedAndExported: Boolean(
      currentState.milestones.reviewedAndExported || newMilestones.reviewedAndExported
    ),
  };

  return computeGameState(
    currentState.firstCouncilChoice,
    currentState.renjiChoice,
    currentState.upgradedBuildings,
    merged
  );
}
