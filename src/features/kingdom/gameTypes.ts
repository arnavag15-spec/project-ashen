export interface KingdomStats {
  food: number;
  defence: number;
  publicTrust: number;
  treasury: number;
}

export interface Relationships {
  daigo: number;
  aki: number;
  renji: number;
}

export type FirstCouncilChoice = 'frontier' | 'villages';
export type RenjiChoice = 'welcome' | 'refuse';
export type BuildingId = 'granary' | 'watchtower' | 'marketplace';

export interface BuildingInfo {
  id: BuildingId;
  name: string;
  tier: number;
  isUpgraded: boolean;
  costSeals: number;
  description: string;
  upgradeDescription: string;
  statEffects: Partial<KingdomStats>;
}

export interface LedgerMilestones {
  imported: boolean;
  categorised: boolean;
  reviewedAndExported: boolean;
}

export type EndingTier = 'dawn' | 'costly' | 'ashen';

export interface EndingResult {
  tier: EndingTier;
  title: string;
  tagline: string;
  readinessScore: number;
  breakdown: {
    defenceWeight: number;
    foodWeight: number;
    trustWeight: number;
    treasuryWeight: number;
  };
  explanation: string;
  cinematicText: string;
  characterReactions: {
    daigo: string;
    aki: string;
    renji: string;
  };
}

export interface GameState {
  stats: KingdomStats;
  relationships: Relationships;
  firstCouncilChoice: FirstCouncilChoice | null;
  renjiChoice: RenjiChoice | null;
  upgradedBuildings: BuildingId[];
  milestones: LedgerMilestones;
  sealsEarned: number;
  sealsSpent: number;
  sealsAvailable: number;
}
