import * as R from "ramda";

import { randomInteger } from "../../../lib/miscUtils";
import {
  AbilitiesConfig,
  Abilities,
  Attributes,
  AttributesConfig,
  CharSheet,
  DropdownOptions,
  FreebiePointItem,
  FreebiePointsConfig,
  PresetName,
} from "../../root/domain";
import { Virtues } from "../domain";
import { RandomizerPresetConfig } from "./types";
import {
  extractCost,
  flattenOptions,
  pickRandom,
  shuffle,
} from "./randomUtils";
import { randomizerConfigs } from "./presetConfigs";
import { getLimits } from "../../root/services/getLimits";

const MAX_FLAW_POINTS = 7;

interface SpendableCategory {
  name: string;
  multiplier: number;
  canSpend: (sheet: CharSheet) => boolean;
  spend: (sheet: CharSheet) => CharSheet;
}

/**
 * Randomly spend freebie points on a character.
 * 1. Pick random flaws (up to MAX_FLAW_POINTS worth)
 * 2. Pick random merits (paid from freebie pool)
 * 3. Spend remaining points on stat improvements
 */
export function randomizeFreebiePoints(
  baseSheet: CharSheet,
  preset: PresetName,
  freebiePointsConfig: FreebiePointsConfig,
  attributesConfig: AttributesConfig,
  abilitiesConfig: AbilitiesConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  const config = randomizerConfigs[preset];
  if (!config) return baseSheet;

  let sheet = { ...baseSheet };
  let availablePoints = freebiePointsConfig.initialPoints;

  // 1. Add random flaws (gaining extra freebie points)
  const flawResult = addRandomFlaws(sheet, dropdownOptions, MAX_FLAW_POINTS);
  sheet = flawResult.sheet;
  availablePoints += flawResult.flawPoints;

  // 2. Add random merits (spending freebie points)
  const meritResult = addRandomMerits(sheet, dropdownOptions, availablePoints);
  sheet = meritResult.sheet;
  availablePoints -= meritResult.meritPoints;

  // 3. Spend remaining points on random stat improvements
  sheet = spendRemainingPoints(
    sheet,
    availablePoints,
    freebiePointsConfig,
    config,
    attributesConfig,
    abilitiesConfig,
    dropdownOptions,
  );

  return sheet;
}

// ── Flaws ──

function addRandomFlaws(
  sheet: CharSheet,
  dropdownOptions: DropdownOptions | undefined,
  maxFlawPoints: number,
): { sheet: CharSheet; flawPoints: number } {
  const flawOptions = flattenOptions(dropdownOptions?.["flawOptions"]);
  if (flawOptions.length === 0) {
    return { sheet, flawPoints: 0 };
  }

  const shuffledFlaws = shuffle(flawOptions);
  let totalFlawPoints = 0;
  const selectedFlaws: string[] = [...sheet.flaws];

  for (const flaw of shuffledFlaws) {
    const cost = extractCost(flaw);
    if (cost <= 0) continue;
    if (totalFlawPoints + cost > maxFlawPoints) continue;
    if (selectedFlaws.includes(flaw)) continue;

    selectedFlaws.push(flaw);
    totalFlawPoints += cost;

    // Random chance to stop adding flaws (50% per flaw after first)
    if (selectedFlaws.length > sheet.flaws.length + 1 && randomInteger(0, 1) === 0) {
      break;
    }
  }

  return {
    sheet: { ...sheet, flaws: selectedFlaws },
    flawPoints: totalFlawPoints,
  };
}

// ── Merits ──

function addRandomMerits(
  sheet: CharSheet,
  dropdownOptions: DropdownOptions | undefined,
  maxSpend: number,
): { sheet: CharSheet; meritPoints: number } {
  const meritOptions = flattenOptions(dropdownOptions?.["meritOptions"]);
  if (meritOptions.length === 0) {
    return { sheet, meritPoints: 0 };
  }

  const shuffledMerits = shuffle(meritOptions);
  let totalMeritCost = 0;
  const selectedMerits: string[] = [...sheet.merits];

  // Spend at most half of available points on merits
  const meritBudget = Math.floor(maxSpend / 2);

  for (const merit of shuffledMerits) {
    const cost = extractCost(merit);
    if (cost <= 0) continue;
    if (totalMeritCost + cost > meritBudget) continue;
    if (selectedMerits.includes(merit)) continue;

    selectedMerits.push(merit);
    totalMeritCost += cost;

    // Random chance to stop adding merits
    if (selectedMerits.length > sheet.merits.length + 1 && randomInteger(0, 1) === 0) {
      break;
    }
  }

  return {
    sheet: { ...sheet, merits: selectedMerits },
    meritPoints: totalMeritCost,
  };
}

// ── Spend remaining freebie points ──

function spendRemainingPoints(
  sheet: CharSheet,
  availablePoints: number,
  freebiePointsConfig: FreebiePointsConfig,
  config: RandomizerPresetConfig,
  attributesConfig: AttributesConfig,
  abilitiesConfig: AbilitiesConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  const limits = getLimits(sheet);
  const paramLimit = limits.parameterLimit;

  // Build list of spendable categories based on what the freebie config supports
  const categories = buildSpendableCategories(
    freebiePointsConfig,
    config,
    attributesConfig,
    abilitiesConfig,
    dropdownOptions,
    paramLimit,
  );

  let remaining = availablePoints;
  let attempts = 0;
  const maxAttempts = 500;

  while (remaining > 0 && attempts < maxAttempts) {
    attempts++;

    // Filter categories that still have room and we can afford
    const affordable = categories.filter(
      (cat) => cat.multiplier <= remaining && cat.canSpend(sheet),
    );

    if (affordable.length === 0) break;

    // Pick a random category
    const cat = pickRandom(affordable);

    // Spend one point in that category
    sheet = cat.spend(sheet);
    remaining -= cat.multiplier;
  }

  return sheet;
}

function buildSpendableCategories(
  freebiePointsConfig: FreebiePointsConfig,
  config: RandomizerPresetConfig,
  attributesConfig: AttributesConfig,
  abilitiesConfig: AbilitiesConfig,
  dropdownOptions: DropdownOptions | undefined,
  paramLimit: number,
): SpendableCategory[] {
  const categories: SpendableCategory[] = [];

  for (const item of freebiePointsConfig.list) {
    switch (item.name) {
      case "attribute":
        categories.push(
          ...buildAttributeCategories(
            item.multiplier,
            attributesConfig,
            paramLimit,
          ),
        );
        break;

      case "ability":
        categories.push(
          ...buildAbilityCategories(
            item.multiplier,
            abilitiesConfig,
            paramLimit,
          ),
        );
        break;

      case "discipline":
        categories.push(
          buildNameValueCategory(
            "disciplines",
            item.multiplier,
            paramLimit,
            dropdownOptions,
            "disciplineOptions",
          ),
        );
        break;

      case "background":
        categories.push(
          buildNameValueCategory(
            "backgrounds",
            item.multiplier,
            paramLimit,
            dropdownOptions,
            "backgroundOptions",
          ),
        );
        break;

      case "virtue":
        categories.push(buildVirtueCategory(item.multiplier));
        break;

      case "willpower":
        // Push willpower 3 times total for ~3x selection bias
        categories.push(buildWillpowerCategory(item.multiplier));
        categories.push(buildWillpowerCategory(item.multiplier));
        categories.push(buildWillpowerCategory(item.multiplier));
        break;

      case "humanity":
        categories.push(buildHumanityCategory(item.multiplier));
        break;

      case "art":
        categories.push(
          buildNameValueCategory(
            "arts",
            item.multiplier,
            paramLimit,
            dropdownOptions,
            "artOptions",
          ),
        );
        break;

      case "realm":
        categories.push(buildFixedKeyCategory("realms", item.multiplier, 5));
        break;

      case "glamour":
        categories.push({
          name: "glamour",
          multiplier: item.multiplier,
          canSpend: (s) => s.state.glamourRating < 10,
          spend: (s) => ({
            ...s,
            state: { ...s.state, glamourRating: s.state.glamourRating + 1 },
          }),
        });
        break;

      case "numina":
        categories.push(
          buildNameValueCategory(
            "numinaAndOtherTraits",
            item.multiplier,
            paramLimit,
            dropdownOptions,
            "numinaOptions",
          ),
        );
        break;

      case "road":
        categories.push({
          name: "road",
          multiplier: item.multiplier,
          canSpend: (s) => (s.state as any).roadValue < 10,
          spend: (s) => ({
            ...s,
            state: {
              ...s.state,
              roadValue: ((s.state as any).roadValue || 0) + 1,
            },
          }),
        });
        break;

      case "spheres":
        categories.push(buildFixedKeyCategory("spheres", item.multiplier, 5));
        break;

      case "arete":
        categories.push({
          name: "arete",
          multiplier: item.multiplier,
          canSpend: (s) => s.state.arete < 3,
          spend: (s) => ({
            ...s,
            state: { ...s.state, arete: s.state.arete + 1 },
          }),
        });
        break;

      case "quintessence":
        categories.push({
          name: "quintessence",
          multiplier: item.multiplier,
          canSpend: (s) => s.state.quintessence < 10,
          spend: (s) => ({
            ...s,
            state: { ...s.state, quintessence: s.state.quintessence + 1 },
          }),
        });
        break;

      case "edges":
        categories.push(
          buildNameValueCategory(
            "edges",
            item.multiplier,
            paramLimit,
            dropdownOptions,
            "edgeOptions",
          ),
        );
        break;
    }
  }

  return categories;
}

// ── Category builders ──

function buildAttributeCategories(
  multiplier: number,
  attributesConfig: AttributesConfig,
  paramLimit: number,
): SpendableCategory[] {
  const allAttrs = attributesConfig.flatMap((g) => g.items);
  return allAttrs.map((attr) => ({
    name: `attribute_${attr}`,
    multiplier,
    canSpend: (s: CharSheet) => (s.attributes as any)[attr] < paramLimit,
    spend: (s: CharSheet) => ({
      ...s,
      attributes: {
        ...s.attributes,
        [attr]: (s.attributes as any)[attr] + 1,
      },
    }),
  }));
}

function buildAbilityCategories(
  multiplier: number,
  abilitiesConfig: AbilitiesConfig,
  paramLimit: number,
): SpendableCategory[] {
  const allAbilities = abilitiesConfig.flatMap((g) => g.items);
  return allAbilities.map((ability) => ({
    name: `ability_${ability}`,
    multiplier,
    canSpend: (s: CharSheet) => (s.abilities as any)[ability] < paramLimit,
    spend: (s: CharSheet) => ({
      ...s,
      abilities: {
        ...s.abilities,
        [ability]: (s.abilities as any)[ability] + 1,
      },
    }),
  }));
}

function buildVirtueCategory(multiplier: number): SpendableCategory {
  const virtueKeys: (keyof Virtues)[] = [
    "conscience",
    "self_control",
    "courage",
  ];
  return {
    name: "virtue",
    multiplier,
    canSpend: (s) => virtueKeys.some((v) => s.virtues[v] < 5),
    spend: (s) => {
      const upgradeable = virtueKeys.filter((v) => s.virtues[v] < 5);
      if (upgradeable.length === 0) return s;
      const v = pickRandom(upgradeable);
      return {
        ...s,
        virtues: { ...s.virtues, [v]: s.virtues[v] + 1 },
      };
    },
  };
}

function buildWillpowerCategory(multiplier: number): SpendableCategory {
  return {
    name: "willpower",
    multiplier,
    canSpend: (s) => s.state.willpowerRating < 10,
    spend: (s) => ({
      ...s,
      state: {
        ...s.state,
        willpowerRating: s.state.willpowerRating + 1,
      },
    }),
  };
}

function buildHumanityCategory(multiplier: number): SpendableCategory {
  return {
    name: "humanity",
    multiplier,
    canSpend: (s) => s.state.humanity < 10,
    spend: (s) => ({
      ...s,
      state: { ...s.state, humanity: s.state.humanity + 1 },
    }),
  };
}

function buildNameValueCategory(
  charSheetKey: string,
  multiplier: number,
  paramLimit: number,
  dropdownOptions: DropdownOptions | undefined,
  optionsKey: string,
): SpendableCategory {
  return {
    name: charSheetKey,
    multiplier,
    canSpend: () => true,
    spend: (s) => {
      const existing: { name: string; value: number }[] =
        (s as any)[charSheetKey] || [];

      // Try to upgrade an existing item first
      const upgradeable = existing.filter((item) => item.value < paramLimit);
      if (upgradeable.length > 0 && randomInteger(0, 2) > 0) {
        const idx = existing.indexOf(pickRandom(upgradeable));
        const updated = [...existing];
        updated[idx] = { ...updated[idx], value: updated[idx].value + 1 };
        return { ...s, [charSheetKey]: updated };
      }

      // Otherwise add a new item
      const allOptions = flattenOptions(dropdownOptions?.[optionsKey]);
      const usedNames = existing.map((e) => e.name);
      const available = allOptions.filter((o) => !usedNames.includes(o));
      const name =
        available.length > 0
          ? pickRandom(available)
          : `${charSheetKey} ${existing.length + 1}`;
      return {
        ...s,
        [charSheetKey]: [...existing, { name, value: 1 }],
      };
    },
  };
}

function buildFixedKeyCategory(
  charSheetKey: string,
  multiplier: number,
  maxPerKey: number,
): SpendableCategory {
  return {
    name: charSheetKey,
    multiplier,
    canSpend: (s) => {
      const obj = (s as any)[charSheetKey];
      if (!obj) return false;
      return Object.values(obj).some((v) => (v as number) < maxPerKey);
    },
    spend: (s) => {
      const obj = { ...(s as any)[charSheetKey] };
      const upgradeable = Object.keys(obj).filter(
        (k) => obj[k] < maxPerKey,
      );
      if (upgradeable.length === 0) return s;
      const key = pickRandom(upgradeable);
      obj[key] = obj[key] + 1;
      return { ...s, [charSheetKey]: obj };
    },
  };
}
