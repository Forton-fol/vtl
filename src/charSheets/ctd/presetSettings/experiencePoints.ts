import * as R from "ramda";

import { CharSheet } from "../../root/domain";
import { attributesConfig } from "../../generic/presetSettings";
import {
  ExperiencePointsConfig,
  extractAttributeValues,
  extractAbilityValues,
  extractWillpowerValue,
} from "../../generic/presetSettings/experiencePointCommons";
import { abilitiesConfig } from "./abilitiesConfig";

function extractGlamourValue(cs: CharSheet): number[] {
  return [cs.state.glamourRating];
}

function extractArtValues(cs: CharSheet): number[] {
  return R.pluck("value", cs.arts);
}

function extractRealmValues(cs: CharSheet): number[] {
  return R.values(cs.realms) as number[];
}

/**
 * Changeling the Dreaming V20 Experience Costs:
 *
 * Атрибут:           Текущее значение × 4
 * Новая способность: 3
 * Способность:       Текущий уровень × 2
 * Новое Искусство:   7
 * Искусство:         Текущий уровень × 4
 * Новое Королевство:  5
 * Королевство:       Текущий уровень × 3
 * Воля:              Текущее значение × 2
 * Гламур:            Текущее значение × 2
 */
export const experiencePointsConfig: ExperiencePointsConfig = {
  list: [
    {
      name: "xp-attribute",
      multiplier: 4,
      extractValues: extractAttributeValues(attributesConfig),
    },
    {
      name: "xp-new-ability",
      multiplier: 2,
      isNew: true,
      flatCost: 3,
      extractValues: extractAbilityValues(abilitiesConfig),
    },
    {
      name: "xp-ability",
      multiplier: 2,
      extractValues: extractAbilityValues(abilitiesConfig),
    },
    {
      name: "xp-new-art",
      multiplier: 4,
      isNew: true,
      flatCost: 7,
      extractValues: extractArtValues,
    },
    {
      name: "xp-art",
      multiplier: 4,
      extractValues: extractArtValues,
    },
    {
      name: "xp-new-realm",
      multiplier: 3,
      isNew: true,
      flatCost: 5,
      extractValues: extractRealmValues,
    },
    {
      name: "xp-realm",
      multiplier: 3,
      extractValues: extractRealmValues,
    },
    {
      name: "xp-willpower",
      multiplier: 2,
      extractValues: extractWillpowerValue,
    },
    {
      name: "xp-glamour",
      multiplier: 2,
      extractValues: extractGlamourValue,
    },
  ],
};
