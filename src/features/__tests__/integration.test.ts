import { describe, it, expect } from 'vitest';
import {
  getInitialGameState,
  computeGameState,
  upgradeBuilding,
  updateMilestones,
} from '../kingdom/gameRules';
import { parseRawCsv, processTransactions } from '../ledger/parseCsv';
import { generateExportData } from '../ledger/exportCsv';
import { determineEnding } from '../kingdom/ending';
import { SAMPLE_EXPENSES_CSV } from '../../data/sampleExpenses';

describe('End-to-End User Journey: The Inheritance of Ashes', () => {
  it('walks through the entire chapter journey from title to victory with chore execution', async () => {
    // 1. Initial State (Prologue)
    let state = getInitialGameState();
    expect(state.stats).toEqual({ food: 42, defence: 40, publicTrust: 45, treasury: 35 });
    expect(state.sealsAvailable).toBe(0);

    // 2. Council Decisions: Secure Frontier & Welcome Renji
    state = computeGameState('frontier', 'welcome', state.upgradedBuildings, state.milestones);
    expect(state.stats.defence).toBe(40 + 20 + 8); // 68
    expect(state.relationships.daigo).toBe(65 + 8 - 10); // 63
    expect(state.relationships.renji).toBe(20 + 25); // 45

    // 3. Settlement: No seals yet, cannot upgrade buildings
    const attemptNoSeals = upgradeBuilding(state, 'granary');
    expect(attemptNoSeals.success).toBe(false);
    expect(attemptNoSeals.reason).toContain('No Stewardship Seals available');

    // 4. Open Steward's Ledger: Load sample CSV
    const parsed = await parseRawCsv(SAMPLE_EXPENSES_CSV);
    expect(parsed.rawRows.length).toBe(14);
    expect(parsed.isAmbiguous).toBe(false);

    // Seal 1: Ledger Opened
    state = updateMilestones(state, { imported: true });
    expect(state.sealsEarned).toBe(1);
    expect(state.sealsAvailable).toBe(1);

    // 5. Categorisation pass completes
    const transactions = processTransactions(parsed.rawRows, parsed.detectedMapping);
    expect(transactions.length).toBe(14);

    // Seal 2: Accounts Ordered
    state = updateMilestones(state, { categorised: true });
    expect(state.sealsEarned).toBe(2);
    expect(state.sealsAvailable).toBe(2);

    // 6. Review step: Handle duplicate & review uncertain item
    // Mark one Coffee House duplicate as exclude
    const coffeeDups = transactions.filter((t) => t.isDuplicate);
    expect(coffeeDups.length).toBe(2);
    coffeeDups[1].duplicateDecision = 'exclude';
    coffeeDups[0].duplicateDecision = 'keep';

    // Mark unknown online payment as reviewed
    const onlinePayment = transactions.find((t) => t.category === 'Other / Needs Review');
    expect(onlinePayment).toBeDefined();
    if (onlinePayment) {
      onlinePayment.category = 'Shopping';
      onlinePayment.categoryReviewed = true;
    }

    // 7. Export reviewed CSV: Generates clean data without excluded duplicate
    const exportedRows = generateExportData(transactions);
    expect(exportedRows.length).toBe(13); // 1 duplicate excluded
    expect(exportedRows[0]['Final Category']).toBeDefined();

    // Seal 3: Ledger Settled & Exported
    state = updateMilestones(state, { reviewedAndExported: true });
    expect(state.sealsEarned).toBe(3);
    expect(state.sealsAvailable).toBe(3);

    // 8. Settlement Upgrades: Spend all 3 seals on Granary, Watchtower, and Marketplace
    const up1 = upgradeBuilding(state, 'granary');
    expect(up1.success).toBe(true);
    state = up1.state;
    expect(state.sealsAvailable).toBe(2);
    expect(state.stats.food).toBe(42 - 5 + 14); // 51
    expect(state.stats.publicTrust).toBe(45 - 2 + 4); // 47

    const up2 = upgradeBuilding(state, 'watchtower');
    expect(up2.success).toBe(true);
    state = up2.state;
    expect(state.sealsAvailable).toBe(1);
    expect(state.stats.defence).toBe(68 + 14); // 82

    const up3 = upgradeBuilding(state, 'marketplace');
    expect(up3.success).toBe(true);
    state = up3.state;
    expect(state.sealsAvailable).toBe(0);
    expect(state.stats.treasury).toBe(35 - 8 + 10); // 37
    expect(state.stats.publicTrust).toBe(47 + 3); // 50

    // Cannot upgrade building twice
    const upRepeat = upgradeBuilding(state, 'granary');
    expect(upRepeat.success).toBe(false);

    // 9. Northern Pass Resolution
    const ending = determineEnding(
      state.stats,
      state.relationships,
      state.firstCouncilChoice,
      state.renjiChoice
    );
    expect(ending.tier).toBe('dawn');
    expect(ending.title).toBe('The Dawn of a New Era');
    expect(ending.readinessScore).toBe(61);
    expect(ending.characterReactions.daigo).toBeDefined();
    expect(ending.characterReactions.aki).toBeDefined();
    expect(ending.characterReactions.renji).toBeDefined();
  });

  it('proves A Costly Victory ending is reached on balanced compromise path', () => {
    // Frontier (+20 Def, -5 Food, -2 Trust, -8 Treasury)
    // Refuse Renji (-5 Def, +10 Daigo, -25 Renji)
    // 3 ledger chore upgrades
    const state = computeGameState('frontier', 'refuse', ['granary', 'watchtower', 'marketplace'], {
      imported: true,
      categorised: true,
      reviewedAndExported: true,
    });

    const ending = determineEnding(
      state.stats,
      state.relationships,
      state.firstCouncilChoice,
      state.renjiChoice
    );

    expect(ending.tier).toBe('costly');
    expect(ending.title).toBe('A Costly Victory');
    expect(ending.readinessScore).toBeGreaterThanOrEqual(45);
    expect(ending.readinessScore).toBeLessThan(60);
  });

  it('proves the Ashen March ending is reached on neglected path', () => {
    // Villages (+20 Food, -5 Def, +8 Trust, -8 Treasury)
    // Refuse Renji (-5 Def, +10 Daigo, -25 Renji)
    // 0 ledger chore upgrades
    const state = computeGameState('villages', 'refuse', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    const ending = determineEnding(
      state.stats,
      state.relationships,
      state.firstCouncilChoice,
      state.renjiChoice
    );

    expect(ending.tier).toBe('ashen');
    expect(ending.title).toBe('The Ashen March');
    expect(ending.readinessScore).toBe(42);
  });
});
