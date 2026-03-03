import {
  AbilitiesConfig,
  AttributesConfig,
  FreebiePointsConfig,
  PresetName,
  ProfileConfig,
} from "../../root/domain";

/**
 * Configuration for how to randomize a specific preset's advantages
 * (disciplines, arts, spheres, numina, edges, lores, etc.)
 */
export interface AdvantageRandomConfig {
  /** Key in CharSheet (e.g. "disciplines", "arts", "spheres") */
  charSheetKey: string;
  /** How the advantage is stored: "nameValue" for NameStringArray, "fixed" for fixed-key objects */
  type: "nameValue" | "fixed";
  /** Total dots to distribute */
  expectedDots: number;
  /** Max dots per single advantage */
  maxPerItem: number;
  /** Dropdown options key for names (for nameValue type) */
  optionsKey?: string;
  /** Fixed keys to distribute among (for fixed type, e.g. spheres/realms) */
  fixedKeys?: string[];
  /** If true, pick disciplines based on the character's clan instead of all options */
  useClanDisciplines?: boolean;
}

/**
 * Configuration for derived values that are computed from other stats.
 */
export type DerivedValueConfig =
  | { type: "formula"; target: string; formula: "conscience+selfcontrol" | "courage" }
  | { type: "fixed"; target: string; value: number }
  | { type: "random"; target: string; min: number; max: number }
  | { type: "virtue_courage_as_willpower" }
  | { type: "conscience_selfcontrol_as_humanity" };

/**
 * User-facing randomizer settings to control attribute/ability priority.
 * "clanRecommended" = use clan-specific recommended order.
 * Custom array = explicit ordering like ["physical","social","mental"].
 */
export type PriorityMode = "random" | "clanRecommended" | readonly string[];

/**
 * Settings that control how the randomizer distributes stats.
 */
export interface RandomizerSettings {
  /** How to assign attribute group priorities (default: "clanRecommended") */
  attributePriority: PriorityMode;
  /** How to assign ability group priorities (default: "clanRecommended") */
  abilityPriority: PriorityMode;
  /** Whether to apply clan-specific attribute focus (default: true) */
  useClanFocus: boolean;
}

export const DEFAULT_RANDOMIZER_SETTINGS: RandomizerSettings = {
  attributePriority: "clanRecommended",
  abilityPriority: "clanRecommended",
  useClanFocus: true,
};

/**
 * Complete randomizer configuration for a game line.
 */
export interface RandomizerPresetConfig {
  /** Expected attribute dot distribution sorted desc (e.g. [7,5,3]) */
  expectedAttributeDots: readonly number[];
  /** Expected ability dot distribution sorted desc (e.g. [13,9,5]) */
  expectedAbilityDots: readonly number[];
  /** Max dots per single ability at creation */
  abilityLimit: number;
  /** Total background dots to distribute */
  expectedBackgroundDots: number;
  /** Virtues config (null if preset doesn't use standard virtues) */
  virtuesConfig: {
    /** Total virtue dots including base (e.g. 7 means 4 more on top of 3 base) */
    expectedTotal: number;
    minPerVirtue: number;
    maxPerVirtue: number;
  } | null;
  /** Preset-specific advantage configs */
  advantages: AdvantageRandomConfig[];
  /** Derived value computations */
  derivedValues: DerivedValueConfig[];
  /** Profile fields that should be randomized from dropdowns */
  profileDropdowns: { field: string; optionsKey: string }[];
  /** Whether this preset's profile has an "age" field */
  hasAge?: boolean;
}
