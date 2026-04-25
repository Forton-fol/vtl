import { PresetName } from "../../root/domain";
import { RandomizerPresetConfig } from "./types";

/**
 * Randomizer configs for each supported game line.
 * Only presets with configs here will show the randomizer buttons.
 */
export const randomizerConfigs: Partial<
  Record<PresetName, RandomizerPresetConfig>
> = {
  // ── Vampire: The Masquerade V20 ──
  vampire_v20: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    hasAge: true,
    virtuesConfig: {
      expectedTotal: 7, // 3 base (1+1+1) + 4 extra dots
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "disciplines",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "disciplineOptions",
        useClanDisciplines: true,
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
      { type: "random", target: "bloodpool", min: 1, max: 10 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "clan", optionsKey: "clanOptions" },
    ],
  },

  // ── Vampire: The Dark Ages V20 ──
  vampire_da_v20: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    hasAge: true,
    virtuesConfig: {
      expectedTotal: 7,
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "disciplines",
        type: "nameValue",
        expectedDots: 4,
        maxPerItem: 4,
        optionsKey: "disciplineOptions",
        useClanDisciplines: true,
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
      { type: "random", target: "bloodpool", min: 1, max: 10 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "clan", optionsKey: "clanOptions" },
    ],
  },

  // ── Vampire: The Masquerade Revised (V3) ──
  vampire_v3_revised: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    hasAge: true,
    virtuesConfig: {
      expectedTotal: 7,
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "disciplines",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "disciplineOptions",
        useClanDisciplines: true,
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
      { type: "random", target: "bloodpool", min: 1, max: 10 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "clan", optionsKey: "clanOptions" },
    ],
  },

  // ── Vampire: The Masquerade V5 ──
  vampire_v5: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    hasAge: true,
    virtuesConfig: {
      expectedTotal: 7,
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "disciplines",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "disciplineOptions",
        useClanDisciplines: true,
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
      { type: "random", target: "bloodpool", min: 1, max: 10 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "clan", optionsKey: "clanOptions" },
    ],
  },

  // ── Changeling: The Dreaming V20 ──
  changeling_v20: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    virtuesConfig: null, // CtD doesn't use standard virtues
    advantages: [
      {
        charSheetKey: "arts",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "artOptions",
      },
      {
        charSheetKey: "realms",
        type: "fixed",
        expectedDots: 5,
        maxPerItem: 5,
        fixedKeys: ["actor", "fae", "nature", "prop", "scene", "time"],
      },
    ],
    derivedValues: [
      { type: "fixed", target: "willpowerRating", value: 4 },
      { type: "fixed", target: "glamourRating", value: 4 },
      { type: "fixed", target: "banalityRating", value: 3 },
    ],
    profileDropdowns: [
      { field: "primaryLegacy", optionsKey: "legacyOptions" },
      { field: "secondaryLegacy", optionsKey: "legacyOptions" },
      { field: "house", optionsKey: "houseOptions" },
      { field: "seeming", optionsKey: "seemingOptions" },
      { field: "kith", optionsKey: "kithOptions" },
      { field: "court", optionsKey: "courtOptions" },
    ],
  },

  // ── Hunter: The Reckoning (Hunters Hunted 2) ──
  hunter_v20: {
    expectedAttributeDots: [6, 4, 3],
    expectedAbilityDots: [11, 7, 4],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    hasAge: true,
    virtuesConfig: {
      expectedTotal: 7,
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "numinaAndOtherTraits",
        type: "nameValue",
        expectedDots: 4,
        maxPerItem: 3,
        optionsKey: "numinaOptions",
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
    ],
  },

  // ── Mage: The Ascension V20 ──
  mage_v20: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 7,
    hasAge: true,
    virtuesConfig: null,
    advantages: [
      {
        charSheetKey: "spheres",
        type: "fixed",
        expectedDots: 6,
        maxPerItem: 1, // limited by arete which starts at 1
        fixedKeys: [
          "correspondence",
          "entropy",
          "forces",
          "life",
          "matter",
          "mind",
          "prime",
          "spirit",
          "time",
        ],
      },
    ],
    derivedValues: [
      { type: "fixed", target: "arete", value: 1 },
      { type: "fixed", target: "willpowerRating", value: 5 },
      { type: "fixed", target: "paradox", value: 0 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "essence", optionsKey: "essenceOptions" },
      { field: "affiliation", optionsKey: "affiliationOptions" },
      { field: "sect", optionsKey: "sectOptions" },
    ],
  },

  // ── Hunter: The Reckoning ──
  hunter_reckoning: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    virtuesConfig: null, // HTR uses mercy/vision/zeal, not standard virtues
    advantages: [
      {
        charSheetKey: "edges",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "edgeOptions",
      },
    ],
    derivedValues: [
      { type: "fixed", target: "willpowerRating", value: 3 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "creed", optionsKey: "creedOptions" },
    ],
  },

  // ── Demon: The Fallen ──
  demon_the_fallen: {
    expectedAttributeDots: [7, 5, 3],
    expectedAbilityDots: [13, 9, 5],
    abilityLimit: 3,
    expectedBackgroundDots: 5,
    virtuesConfig: {
      expectedTotal: 7,
      minPerVirtue: 1,
      maxPerVirtue: 5,
    },
    advantages: [
      {
        charSheetKey: "lores",
        type: "nameValue",
        expectedDots: 3,
        maxPerItem: 3,
        optionsKey: "loreOptions",
      },
    ],
    derivedValues: [
      { type: "conscience_selfcontrol_as_humanity" },
      { type: "virtue_courage_as_willpower" },
      { type: "fixed", target: "faithRating", value: 3 },
      { type: "fixed", target: "tormentPermanent", value: 0 },
    ],
    profileDropdowns: [
      { field: "nature", optionsKey: "archetypeOptions" },
      { field: "demeanor", optionsKey: "archetypeOptions" },
      { field: "concept", optionsKey: "conceptOptions" },
      { field: "house", optionsKey: "houseOptions" },
      { field: "faction", optionsKey: "factionOptions" },
    ],
  },
};
