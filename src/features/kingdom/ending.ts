import { KingdomStats, Relationships, FirstCouncilChoice, RenjiChoice, EndingResult, EndingTier } from './gameTypes';

/**
 * Calculates invasion readiness based on the transparent weighted formula:
 * readiness = round(0.40 * Defence + 0.25 * Food + 0.20 * Trust + 0.15 * Treasury)
 */
export function calculateReadiness(stats: KingdomStats): {
  score: number;
  breakdown: {
    defenceWeight: number;
    foodWeight: number;
    trustWeight: number;
    treasuryWeight: number;
  };
} {
  const defenceWeight = Number((0.40 * stats.defence).toFixed(2));
  const foodWeight = Number((0.25 * stats.food).toFixed(2));
  const trustWeight = Number((0.20 * stats.publicTrust).toFixed(2));
  const treasuryWeight = Number((0.15 * stats.treasury).toFixed(2));

  const total = defenceWeight + foodWeight + trustWeight + treasuryWeight;
  const score = Math.round(total);

  return {
    score,
    breakdown: {
      defenceWeight,
      foodWeight,
      trustWeight,
      treasuryWeight,
    },
  };
}

/**
 * Determines the narrative ending, character reactions, and diagnostic explanation.
 */
export function determineEnding(
  stats: KingdomStats,
  relationships: Relationships,
  firstChoice: FirstCouncilChoice | null,
  renjiChoice: RenjiChoice | null
): EndingResult {
  const { score, breakdown } = calculateReadiness(stats);

  let tier: EndingTier;
  let title: string;
  let tagline: string;
  let explanation: string;
  let cinematicText: string;

  if (score >= 60) {
    tier = 'dawn';
    title = 'The Dawn of a New Era';
    tagline = 'The northern vanguard is shattered. Arahama stands united and sovereign.';
    explanation = `With an exceptional readiness score of ${score}/100, provincial fortifications withstood the siege while granaries and public morale sustained the defenders.`;
    cinematicText =
      'As dawn crests over the smoking northern ridges, the invading banners pull back in disarray. Your battle line held firmly at the river narrows. The retainers assemble at your pavilion, lowering their helms in deep reverence. For the first time since your father fell, the province of Arahama breathes with resolute hope.';
  } else if (score >= 45) {
    tier = 'costly';
    title = 'A Costly Victory';
    tagline = 'The enemy is turned back, but the province bleeds from the ordeal.';
    explanation = `With a readiness score of ${score}/100, the northern host was repelled, but critical shortages in supplies, fortifications, or coin left the realm deeply strained.`;
    cinematicText =
      'The enemy army retreats back into the mist of the high passes, unable to breach your inner lines. Yet the victory is bitter: outer hamlets lie smoldering, field hospitals overflow with wounded retainers, and winter reserves are stretched to the brink. You have bought time, but Chapter II will begin under heavy trial.';
  } else {
    tier = 'ashen';
    title = 'The Ashen March';
    tagline = 'The defensive perimeter shatters. Harun orders an agonizing retreat.';
    explanation = `With a readiness score of ${score}/100, defences buckled under the initial assault. Discontent and low rations crippled the army's ability to resist.`;
    cinematicText =
      'A horn blasts through the freezing fog as northern spearmen overrun the crest. Your garrison, starved of supplies and unfortified against siege engines, breaks in disorder. Daigo and Aki escort you south along the river road amidst lines of fleeing villagers. The ancestral seat is lost, but your house survives in exile to fight another day.';
  }

  // Dynamic character reactions
  let daigoReaction = '';
  if (relationships.daigo >= 65) {
    daigoReaction = '“Lord Harun, your resolve honours your ancestors. Arahama’s warriors will follow your banner anywhere.”';
  } else if (relationships.daigo >= 50) {
    daigoReaction = '“The line held, though not without friction. We must instill tighter military discipline before they return.”';
  } else {
    daigoReaction = '“Our traditions were compromised, and our veterans paid in blood. We must re-examine our priorities.”';
  }

  let akiReaction = '';
  if (relationships.aki >= 60) {
    akiReaction = '“The storehouses held and the common folk stayed loyal to your name. Good stewardship saved us today, my Lord.”';
  } else {
    akiReaction = '“The cost on our villagers is grave. We must rebuild granaries and community trust if we are to survive the coming winter.”';
  }

  let renjiReaction = '';
  if (renjiChoice === 'welcome') {
    renjiReaction =
      relationships.renji >= 40
        ? '“My scouts delivered the pass before their vanguard could flank you. My debt to Arahama is settled.”'
        : '“You made use of my intelligence, young lord. Perhaps there is room for an exile in this court after all.”';
  } else {
    renjiReaction = 'Renji watched from the southern ridgeline as an exile, his warnings unheeded by the council.';
  }

  return {
    tier,
    title,
    tagline,
    readinessScore: score,
    breakdown,
    explanation,
    cinematicText,
    characterReactions: {
      daigo: daigoReaction,
      aki: akiReaction,
      renji: renjiReaction,
    },
  };
}
