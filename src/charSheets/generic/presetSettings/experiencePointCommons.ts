import * as R from "ramda";

import { CharSheet } from "../../root/domain";
import { AttributesConfig, AbilitiesConfig } from "../../root/domain";

/**
 * Experience Points cost calculation helpers.
 *
 * XP cost to raise a trait from level `prev` to level `current` is:
 *   sum( level * multiplier ) for level = prev .. current-1
 *
 * For "new" traits (from 0), there's a flat cost instead.
 */

export type ExperiencePointItem = {
  /** Translation key for display */
  name: string;
  /** Multiplier: cost = currentLevel × multiplier */
  multiplier: number;
  /** Whether this is a "new trait" row (flat cost) */
  isNew?: boolean;
  /** Flat cost for acquiring a new trait (first dot) */
  flatCost?: number;
  /**
   * Extracts individual trait values as an array from the char sheet.
   * For per-level XP cost calculation.
   */
  extractValues: (charSheet: CharSheet) => number[];
};

export type ExperiencePointsConfig = {
  list: ExperiencePointItem[];
};

/**
 * Calculate total XP cost for raising traits from prev values to current values.
 * For each trait: cost = sum( level * multiplier ) for level = prevValue .. currentValue-1
 * For "new" items: each trait that went from 0 to >0 costs flatCost.
 */
export function calcXpCostForItem(
  item: ExperiencePointItem,
  prevValues: number[],
  currentValues: number[],
): number {
  let totalCost = 0;

  if (item.isNew && item.flatCost !== undefined) {
    // Count how many traits were raised from 0 to something — flat cost only
    for (let i = 0; i < currentValues.length; i++) {
      const prev = prevValues[i] ?? 0;
      const curr = currentValues[i] ?? 0;
      if (prev === 0 && curr > 0) {
        totalCost += item.flatCost;
      }
    }
  } else {
    // Regular upgrade: cost = sum(level * multiplier) for each level gained
    // Level 0→1 costs 0 here (covered by flat cost in the corresponding "new" entry)
    for (let i = 0; i < Math.max(prevValues.length, currentValues.length); i++) {
      const prev = prevValues[i] ?? 0;
      const curr = currentValues[i] ?? 0;
      if (curr > prev) {
        for (let lvl = prev; lvl < curr; lvl++) {
          totalCost += lvl * item.multiplier;
        }
      }
    }
  }

  return totalCost;
}

// ── Extractor helpers ──────────────────────────────────────────

export function extractAttributeValues(
  attributesConfig: AttributesConfig,
): (cs: CharSheet) => number[] {
  return (cs: CharSheet) =>
    R.flatten(attributesConfig.map((group) => R.props(group.items, cs.attributes)));
}

export function extractAbilityValues(
  abilitiesConfig: AbilitiesConfig,
): (cs: CharSheet) => number[] {
  return (cs: CharSheet) => {
    const mainValues = R.flatten(
      abilitiesConfig.map((group) => R.props(group.items, cs.abilities)),
    );
    const ext = cs.abilitiesExtension;
    const extValues = [
      ext.talentValue1,
      ext.talentValue2,
      ext.skillValue1,
      ext.skillValue2,
      ext.knowledgeValue1,
      ext.knowledgeValue2,
    ];
    return [...mainValues, ...extValues];
  };
}

export function extractBackgroundValues(cs: CharSheet): number[] {
  return R.pluck("value", cs.backgrounds);
}

export function extractWillpowerValue(cs: CharSheet): number[] {
  return [cs.state.willpowerRating];
}
