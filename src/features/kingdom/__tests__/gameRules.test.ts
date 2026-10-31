import { describe, it, expect } from 'vitest';
import {
  getInitialGameState,
  computeGameState,
  upgradeBuilding,
  updateMilestones,
  clamp,
  INITIAL_STATS,
  INITIAL_RELATIONSHIPS,
} from '../gameRules';
import { calculateReadiness, determineEnding } from '../ending';

describe('1. Initial Game State & Clamping', () => {
  it('initialises kingdom stats and relationships exactly as specified', () => {
    const state = getInitialGameState();
    expect(state.stats).toEqual({
      food: 42,
      defence: 40,
      publicTrust: 45,
      treasury: 35,
    });
    expect(state.relationships).toEqual({
      daigo: 65,
      aki: 60,
      renji: 20,
    });
    expect(state.sealsEarned).toBe(0);
    expect(state.sealsAvailable).toBe(0);
    expect(state.upgradedBuildings).toEqual([]);
  });

  it('clamps values strictly to [0, 100]', () => {
    expect(clamp(-15)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(45.4)).toBe(45);
    expect(clamp(89.6)).toBe(90);
  });
});

describe('2. Council Choices & Anti-Farming Idempotency', () => {
  it('applies Secure Frontier effects correctly', () => {
    const state = computeGameState('frontier', null, [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    expect(state.stats.defence).toBe(INITIAL_STATS.defence + 20); // 40 + 20 = 60
    expect(state.stats.food).toBe(INITIAL_STATS.food - 5); // 42 - 5 = 37
    expect(state.stats.publicTrust).toBe(INITIAL_STATS.publicTrust - 2); // 45 - 2 = 43
    expect(state.stats.treasury).toBe(INITIAL_STATS.treasury - 8); // 35 - 8 = 27

    expect(state.relationships.daigo).toBe(INITIAL_RELATIONSHIPS.daigo + 8); // 65 + 8 = 73
    expect(state.relationships.aki).toBe(INITIAL_RELATIONSHIPS.aki - 3); // 60 - 3 = 57
  });

  it('applies Protect Villages effects correctly', () => {
    const state = computeGameState('villages', null, [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    expect(state.stats.food).toBe(INITIAL_STATS.food + 20); // 42 + 20 = 62
    expect(state.stats.defence).toBe(INITIAL_STATS.defence - 5); // 40 - 5 = 35
    expect(state.stats.publicTrust).toBe(INITIAL_STATS.publicTrust + 8); // 45 + 8 = 53
    expect(state.stats.treasury).toBe(INITIAL_STATS.treasury - 8); // 35 - 8 = 27

    expect(state.relationships.aki).toBe(INITIAL_RELATIONSHIPS.aki + 8); // 60 + 8 = 68
    expect(state.relationships.daigo).toBe(INITIAL_RELATIONSHIPS.daigo - 3); // 65 - 3 = 62
  });

  it('applies Welcome Renji effects correctly', () => {
    const state = computeGameState(null, 'welcome', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    expect(state.stats.defence).toBe(INITIAL_STATS.defence + 8); // 40 + 8 = 48
    expect(state.relationships.renji).toBe(INITIAL_RELATIONSHIPS.renji + 25); // 20 + 25 = 45
    expect(state.relationships.daigo).toBe(INITIAL_RELATIONSHIPS.daigo - 10); // 65 - 10 = 55
  });

  it('applies Refuse Renji effects correctly', () => {
    const state = computeGameState(null, 'refuse', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    expect(state.stats.defence).toBe(INITIAL_STATS.defence - 5); // 40 - 5 = 35
    expect(state.relationships.daigo).toBe(INITIAL_RELATIONSHIPS.daigo + 10); // 65 + 10 = 75
    expect(state.relationships.renji).toBe(clamp(INITIAL_RELATIONSHIPS.renji - 25)); // 20 - 25 = 0 (clamped)
  });

  it('guarantees idempotency: toggling choices does not accumulate or farm stats', () => {
    const state1 = computeGameState('frontier', 'welcome', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });
    // Calling it again with same inputs gives identical result
    const state2 = computeGameState('frontier', 'welcome', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    expect(state1.stats).toEqual(state2.stats);
    expect(state1.relationships).toEqual(state2.relationships);
  });
});

describe('3. Stewardship Seals & Building Upgrades', () => {
  it('awards at most 3 seals from milestones and avoids duplicate awards', () => {
    let state = getInitialGameState();

    // Award Milestone 1
    state = updateMilestones(state, { imported: true });
    expect(state.sealsEarned).toBe(1);
    expect(state.sealsAvailable).toBe(1);

    // Calling Milestone 1 again does not double-award
    state = updateMilestones(state, { imported: true });
    expect(state.sealsEarned).toBe(1);

    // Award Milestone 2 & 3
    state = updateMilestones(state, { categorised: true, reviewedAndExported: true });
    expect(state.sealsEarned).toBe(3);
    expect(state.sealsAvailable).toBe(3);
  });

  it('upgrades buildings one time each and deducts available seals', () => {
    let state = getInitialGameState();
    state = updateMilestones(state, { imported: true, categorised: true, reviewedAndExported: true });
    expect(state.sealsAvailable).toBe(3);

    // Upgrade Granary: Food +14, Trust +4
    const res1 = upgradeBuilding(state, 'granary');
    expect(res1.success).toBe(true);
    state = res1.state;
    expect(state.stats.food).toBe(INITIAL_STATS.food + 14); // 42 + 14 = 56
    expect(state.stats.publicTrust).toBe(INITIAL_STATS.publicTrust + 4); // 45 + 4 = 49
    expect(state.sealsAvailable).toBe(2);
    expect(state.upgradedBuildings).toContain('granary');

    // Attempting to upgrade Granary a second time fails
    const resDuplicate = upgradeBuilding(state, 'granary');
    expect(resDuplicate.success).toBe(false);
    expect(resDuplicate.reason).toContain('already upgraded');

    // Upgrade Watchtower: Def +14
    const res2 = upgradeBuilding(state, 'watchtower');
    expect(res2.success).toBe(true);
    state = res2.state;
    expect(state.stats.defence).toBe(INITIAL_STATS.defence + 14); // 40 + 14 = 54
    expect(state.sealsAvailable).toBe(1);

    // Upgrade Marketplace: Treasury +10, Trust +3
    const res3 = upgradeBuilding(state, 'marketplace');
    expect(res3.success).toBe(true);
    state = res3.state;
    expect(state.stats.treasury).toBe(INITIAL_STATS.treasury + 10); // 35 + 10 = 45
    expect(state.sealsAvailable).toBe(0);

    // Upgrading without seals fails
    const resNoSeals = upgradeBuilding(state, 'watchtower');
    expect(resNoSeals.success).toBe(false);
  });
});

describe('4. Readiness Score & Ending Reachability', () => {
  it('correctly calculates readiness formula: round(0.4*Def + 0.25*Food + 0.2*Trust + 0.15*Treasury)', () => {
    // Initial stats: Def 40, Food 42, Trust 45, Treasury 35
    // 0.40 * 40 = 16.0
    // 0.25 * 42 = 10.5
    // 0.20 * 45 = 9.0
    // 0.15 * 35 = 5.25
    // Total = 40.75 => round = 41
    const { score } = calculateReadiness(INITIAL_STATS);
    expect(score).toBe(41);
  });

  it('reaches Tier 1: The Dawn of a New Era (score >= 60)', () => {
    // Frontier (+20 Def, -5 Food, -2 Trust, -8 Treasury)
    // Welcome Renji (+8 Def)
    // All 3 building upgrades: Granary (+14 Food, +4 Trust), Watchtower (+14 Def), Marketplace (+10 Treasury, +3 Trust)
    const state = computeGameState('frontier', 'welcome', ['granary', 'watchtower', 'marketplace'], {
      imported: true,
      categorised: true,
      reviewedAndExported: true,
    });

    const ending = determineEnding(state.stats, state.relationships, 'frontier', 'welcome');
    expect(ending.readinessScore).toBeGreaterThanOrEqual(60);
    expect(ending.tier).toBe('dawn');
    expect(ending.title).toBe('The Dawn of a New Era');
  });

  it('reaches Tier 2: A Costly Victory (score 45 to 59)', () => {
    // Frontier + Refuse Renji + All 3 buildings
    const state = computeGameState('frontier', 'refuse', ['granary', 'watchtower', 'marketplace'], {
      imported: true,
      categorised: true,
      reviewedAndExported: true,
    });

    const ending = determineEnding(state.stats, state.relationships, 'frontier', 'refuse');
    expect(ending.readinessScore).toBeGreaterThanOrEqual(45);
    expect(ending.readinessScore).toBeLessThan(60);
    expect(ending.tier).toBe('costly');
    expect(ending.title).toBe('A Costly Victory');
  });

  it('reaches Tier 3: The Ashen March (score < 45)', () => {
    // Villages + Refuse Renji + 0 building upgrades
    const state = computeGameState('villages', 'refuse', [], {
      imported: false,
      categorised: false,
      reviewedAndExported: false,
    });

    const ending = determineEnding(state.stats, state.relationships, 'villages', 'refuse');
    expect(ending.readinessScore).toBeLessThan(45);
    expect(ending.tier).toBe('ashen');
    expect(ending.title).toBe('The Ashen March');
  });
});
