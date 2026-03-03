import * as R from "ramda";

import { randomInteger } from "../../../lib/miscUtils";
import {
  Abilities,
  AbilitiesConfig,
  Attributes,
  AttributesConfig,
  CharSheet,
  DropdownOptions,
  PresetName,
} from "../../root/domain";
import { Virtues } from "../domain";
import { RandomizerPresetConfig, AdvantageRandomConfig, RandomizerSettings, DEFAULT_RANDOMIZER_SETTINGS } from "./types";
import {
  distributeDots,
  flattenOptions,
  pickRandom,
  pickRandomOption,
  randomizePriorities,
  shuffle,
} from "./randomUtils";
import { randomizerConfigs } from "./presetConfigs";
import { getClanDisciplines } from "./clanDisciplines";
import { getClanRecommendation, ClanBuildRecommendation } from "./clanRecommendations";
import { randomName, randomAge } from "./randomNames";

/**
 * Fully randomize a character sheet based on the preset's creation rules.
 * Returns a new CharSheet with all base creation values set.
 */
export function randomizeCharacter(
  baseSheet: CharSheet,
  preset: PresetName,
  attributesConfig: AttributesConfig,
  abilitiesConfig: AbilitiesConfig,
  dropdownOptions: DropdownOptions | undefined,
  settings: RandomizerSettings = DEFAULT_RANDOMIZER_SETTINGS,
): CharSheet {
  const config = randomizerConfigs[preset];
  if (!config) {
    console.warn(`No randomizer config for preset: ${preset}`);
    return baseSheet;
  }

  let sheet = { ...baseSheet };

  // 1. Randomize profile fields from dropdowns
  sheet = randomizeProfile(sheet, config, dropdownOptions);

  // Get clan recommendation after profile is set (so we know the clan)
  const clanRec = getClanRecommendation(sheet.profile.clan ?? "");

  // 2. Randomize attributes (priority distribution)
  sheet = randomizeAttributes(sheet, config, attributesConfig, settings, clanRec);

  // 3. Apply zero-attribute rules (Nosferatu Appearance=0, etc.)
  if (clanRec?.zeroAttributes) {
    const attributes = { ...sheet.attributes };
    for (const attr of clanRec.zeroAttributes) {
      (attributes as any)[attr] = 0;
    }
    sheet = { ...sheet, attributes };
  }

  // 4. Randomize abilities (priority distribution with dot limit)
  sheet = randomizeAbilities(sheet, config, abilitiesConfig, settings, clanRec);

  // 5. Randomize backgrounds (with clan bias)
  sheet = randomizeBackgrounds(sheet, config, dropdownOptions, clanRec);

  // 6. Randomize virtues (if applicable)
  sheet = randomizeVirtues(sheet, config);

  // 7. Randomize preset-specific advantages
  sheet = randomizeAdvantages(sheet, config, dropdownOptions);

  // 8. Calculate derived values
  sheet = calculateDerived(sheet, config);

  return sheet;
}

/**
 * Get randomizer config for a preset (or undefined if not supported).
 */
export function getRandomizerConfig(
  preset: PresetName,
): RandomizerPresetConfig | undefined {
  return randomizerConfigs[preset];
}

// ── Profile ──

function randomizeProfile(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  const profile = { ...sheet.profile };

  // Random name (all presets have CommonProfile.name)
  profile.name = randomName();

  // Random age (only for presets that have the field)
  if (config.hasAge) {
    (profile as any).age = randomAge(sheet.preset);
  }

  // Randomize dropdown-based profile fields
  if (dropdownOptions) {
    for (const { field, optionsKey } of config.profileDropdowns) {
      const options = dropdownOptions[optionsKey];
      if (options) {
        const value = pickRandomOption(options);
        if (value) {
          (profile as any)[field] = value;
        }
      }
    }
  }

  return { ...sheet, profile };
}

// ── Attributes ──

/**
 * Resolve priority order for groups (attribute or ability).
 * @param mode - "random" | "clanRecommended" | explicit order
 * @param clanOrder - clan-recommended order (e.g. ["physical","social","mental"])
 * @param groupHeaders - actual group headers from config
 * @param dotAmounts - dot amounts sorted desc (e.g. [7,5,3])
 */
function resolvePriorities(
  mode: "random" | "clanRecommended" | readonly string[],
  clanOrder: readonly string[] | undefined,
  groupHeaders: string[],
  dotAmounts: readonly number[],
): number[] {
  if (mode === "random" || (mode === "clanRecommended" && !clanOrder)) {
    return randomizePriorities(dotAmounts);
  }

  const order = mode === "clanRecommended" ? clanOrder! : mode;

  // Map each group to its priority index in the recommended order
  // Groups not in the order get random placement at the end
  const sorted = [...dotAmounts].sort((a, b) => b - a); // ensure desc
  const result = new Array<number>(groupHeaders.length).fill(0);
  const used = new Set<number>();

  for (const rec of order) {
    const groupIdx = groupHeaders.findIndex(
      (h) => h.toLowerCase() === rec.toLowerCase(),
    );
    if (groupIdx === -1 || used.has(groupIdx)) continue;

    // Assign the next highest dot amount
    const dotIdx = [...sorted].findIndex(
      (_, i) => !Array.from(used).some((u) => result[u] === sorted[i]),
    );
    // Find next unused dot amount
    let assignedDots = sorted[0];
    for (let i = 0; i < sorted.length; i++) {
      const taken = Array.from(used).map((u) => result[u]);
      if (!taken.includes(sorted[i])) {
        assignedDots = sorted[i];
        break;
      }
    }
    result[groupIdx] = assignedDots;
    used.add(groupIdx);
  }

  // Fill remaining groups with remaining dot values
  const assignedDots = Array.from(used).map((u) => result[u]);
  const remainingDots = sorted.filter((d) => {
    const idx = assignedDots.indexOf(d);
    if (idx !== -1) {
      assignedDots.splice(idx, 1);
      return false;
    }
    return true;
  });

  const remainingGroups = groupHeaders
    .map((_, i) => i)
    .filter((i) => !used.has(i));

  const shuffledRemaining = shuffle(remainingDots);
  remainingGroups.forEach((groupIdx, i) => {
    result[groupIdx] = shuffledRemaining[i] ?? 0;
  });

  return result;
}

function randomizeAttributes(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
  attributesConfig: AttributesConfig,
  settings: RandomizerSettings,
  clanRec: ClanBuildRecommendation | undefined,
): CharSheet {
  const groupHeaders = attributesConfig.map((g) => g.header);
  const priorities = resolvePriorities(
    settings.attributePriority,
    clanRec?.attributePriority,
    groupHeaders,
    config.expectedAttributeDots,
  );

  const attributes = { ...sheet.attributes };
  const focusAttrs = settings.useClanFocus && clanRec?.focusAttributes
    ? clanRec.focusAttributes
    : undefined;

  attributesConfig.forEach((group, groupIdx) => {
    const totalDots = priorities[groupIdx];
    const count = group.items.length;
    const extraDots = distributeDots(count, totalDots, 0, 4);

    // If clan focus is active, give focus attributes a boost within their group
    if (focusAttrs) {
      const focusIndices = group.items
        .map((attr, i) => (focusAttrs.includes(attr) ? i : -1))
        .filter((i) => i !== -1);

      if (focusIndices.length > 0) {
        // Try to shift dots towards focus attributes
        for (let attempt = 0; attempt < totalDots * 2; attempt++) {
          const fromIdx = randomInteger(0, count - 1);
          const toIdx = pickRandom(focusIndices);
          if (
            fromIdx !== toIdx &&
            !focusAttrs.includes(group.items[fromIdx]) &&
            extraDots[fromIdx] > 0 &&
            extraDots[toIdx] < 4
          ) {
            extraDots[fromIdx]--;
            extraDots[toIdx]++;
          }
        }
      }
    }

    group.items.forEach((attr, i) => {
      (attributes as any)[attr] = 1 + extraDots[i];
    });
  });

  return { ...sheet, attributes };
}

// ── Abilities ──

function randomizeAbilities(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
  abilitiesConfig: AbilitiesConfig,
  settings: RandomizerSettings,
  clanRec: ClanBuildRecommendation | undefined,
): CharSheet {
  const groupHeaders = abilitiesConfig.map((g) => g.header);
  const priorities = resolvePriorities(
    settings.abilityPriority,
    clanRec?.abilityPriority,
    groupHeaders,
    config.expectedAbilityDots,
  );

  const abilities = { ...sheet.abilities };
  const limit = config.abilityLimit;

  abilitiesConfig.forEach((group, groupIdx) => {
    const totalDots = priorities[groupIdx];
    const count = group.items.length;
    const dots = distributeDots(count, totalDots, 0, limit);

    group.items.forEach((ability, i) => {
      (abilities as any)[ability] = dots[i];
    });
  });

  return { ...sheet, abilities };
}

// ── Backgrounds ──

function randomizeBackgrounds(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
  dropdownOptions: DropdownOptions | undefined,
  clanRec: ClanBuildRecommendation | undefined,
): CharSheet {
  const totalDots = config.expectedBackgroundDots;
  if (totalDots <= 0) return sheet;

  const backgroundNames = flattenOptions(
    dropdownOptions?.["backgroundOptions"],
  );

  const numBackgrounds = randomInteger(1, Math.min(totalDots, 5));

  let chosen: string[];
  if (backgroundNames.length > 0) {
    // If clan has preferred backgrounds, bias selection: pick ~half from preferred
    const preferred = clanRec?.preferredBackgrounds;
    if (preferred && preferred.length > 0) {
      const prefMatches = backgroundNames.filter((name) =>
        preferred.some((p) => name.toLowerCase().includes(p.toLowerCase())),
      );
      const rest = backgroundNames.filter((name) => !prefMatches.includes(name));

      // Pick 1..ceil(numBackgrounds/2) from preferred (if available), rest random
      const numFromPreferred = Math.min(
        prefMatches.length,
        Math.max(1, Math.ceil(numBackgrounds / 2)),
      );
      const prefPicks = shuffle(prefMatches).slice(0, numFromPreferred);
      const numFromRest = numBackgrounds - prefPicks.length;
      const restPicks = shuffle(rest).slice(0, numFromRest);
      chosen = shuffle([...prefPicks, ...restPicks]);
    } else {
      chosen = shuffle(backgroundNames).slice(0, numBackgrounds);
    }
  } else {
    chosen = Array.from({ length: numBackgrounds }, (_, i) => `Background ${i + 1}`);
  }

  const dots = distributeDots(chosen.length, totalDots, 1, 5);

  const backgrounds = chosen.map((name, i) => ({
    name,
    value: dots[i],
  }));

  return { ...sheet, backgrounds };
}

// ── Virtues ──

function randomizeVirtues(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
): CharSheet {
  if (!config.virtuesConfig) return sheet;

  const { expectedTotal, minPerVirtue, maxPerVirtue } = config.virtuesConfig;
  // expectedTotal includes base (3 base = 1+1+1). We distribute expectedTotal total,
  // with each virtue having min=minPerVirtue, max=maxPerVirtue
  const dots = distributeDots(3, expectedTotal, minPerVirtue, maxPerVirtue);

  const virtues: Virtues = {
    conscience: dots[0],
    self_control: dots[1],
    courage: dots[2],
  };

  return { ...sheet, virtues };
}

// ── Advantages (disciplines, arts, spheres, etc.) ──

function randomizeAdvantages(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  for (const adv of config.advantages) {
    sheet = randomizeSingleAdvantage(sheet, adv, dropdownOptions);
  }
  return sheet;
}

function randomizeSingleAdvantage(
  sheet: CharSheet,
  adv: AdvantageRandomConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  if (adv.type === "fixed" && adv.fixedKeys) {
    return randomizeFixedAdvantage(sheet, adv);
  }
  return randomizeNameValueAdvantage(sheet, adv, dropdownOptions);
}

function randomizeFixedAdvantage(
  sheet: CharSheet,
  adv: AdvantageRandomConfig,
): CharSheet {
  const keys = adv.fixedKeys!;
  const dots = distributeDots(keys.length, adv.expectedDots, 0, adv.maxPerItem);
  const obj = { ...(sheet as any)[adv.charSheetKey] };

  keys.forEach((key, i) => {
    obj[key] = dots[i];
  });

  return { ...sheet, [adv.charSheetKey]: obj };
}

function randomizeNameValueAdvantage(
  sheet: CharSheet,
  adv: AdvantageRandomConfig,
  dropdownOptions: DropdownOptions | undefined,
): CharSheet {
  const totalDots = adv.expectedDots;
  if (totalDots <= 0) return sheet;

  // If useClanDisciplines is set, pick from clan-specific disciplines
  if (adv.useClanDisciplines && sheet.profile.clan) {
    const clanDisc = getClanDisciplines(
      sheet.profile.clan,
      dropdownOptions?.[adv.optionsKey ?? ""],
    );
    if (clanDisc && clanDisc.length > 0) {
      // Randomly pick 1..3 clan disciplines (not necessarily all of them)
      const numPicked = randomInteger(1, Math.min(clanDisc.length, totalDots));
      const picked = shuffle(clanDisc).slice(0, numPicked);
      const dots = distributeDots(numPicked, totalDots, 1, adv.maxPerItem);
      const items = picked.map((name, i) => ({ name, value: dots[i] }));
      return { ...sheet, [adv.charSheetKey]: items };
    }
  }

  const optionNames = adv.optionsKey
    ? flattenOptions(dropdownOptions?.[adv.optionsKey])
    : [];

  // Pick 1..totalDots unique names
  const numItems = randomInteger(1, Math.min(totalDots, 3));
  const shuffledNames =
    optionNames.length > 0
      ? shuffle(optionNames).slice(0, numItems)
      : Array.from({ length: numItems }, (_, i) => `${adv.charSheetKey} ${i + 1}`);

  const dots = distributeDots(numItems, totalDots, 1, adv.maxPerItem);

  const items = shuffledNames.map((name, i) => ({
    name,
    value: dots[i],
  }));

  return { ...sheet, [adv.charSheetKey]: items };
}

// ── Derived Values ──

function calculateDerived(
  sheet: CharSheet,
  config: RandomizerPresetConfig,
): CharSheet {
  const state = { ...sheet.state };

  for (const dv of config.derivedValues) {
    switch (dv.type) {
      case "conscience_selfcontrol_as_humanity":
        state.humanity = sheet.virtues.conscience + sheet.virtues.self_control;
        break;

      case "virtue_courage_as_willpower":
        state.willpowerRating = sheet.virtues.courage;
        break;

      case "fixed":
        (state as any)[dv.target] = dv.value;
        break;

      case "random":
        (state as any)[dv.target] = randomInteger(dv.min, dv.max);
        break;
    }
  }

  return { ...sheet, state };
}
