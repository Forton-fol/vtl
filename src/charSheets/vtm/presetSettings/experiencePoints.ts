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
import { clanDisciplineMap } from "./clanDisciplines";

function extractDisciplineValues(cs: CharSheet): number[] {
  return R.pluck("value", cs.disciplines);
}

function extractClanDisciplineValues(cs: CharSheet): number[] {
  const clanDiscs = new Set(clanDisciplineMap[cs.profile.clan] ?? []);
  return cs.disciplines
    .filter((d) => clanDiscs.has(d.name))
    .map((d) => d.value);
}

function extractOtherDisciplineValues(cs: CharSheet): number[] {
  const clanDiscs = new Set(clanDisciplineMap[cs.profile.clan] ?? []);
  return cs.disciplines
    .filter((d) => !clanDiscs.has(d.name))
    .map((d) => d.value);
}

function extractDisciplinePathValues(cs: CharSheet): number[] {
  return R.pluck("value", cs.disciplinePaths);
}

function extractVirtueValues(cs: CharSheet): number[] {
  return [
    cs.virtues.conscience,
    cs.virtues.self_control,
    cs.virtues.courage,
  ];
}

function extractHumanityValue(cs: CharSheet): number[] {
  return [cs.state.humanity];
}

/**
 * Vampire: The Masquerade V20 Experience Costs:
 *
 * Новая Способность:                              3
 * Новый Путь (Некромантия или Тауматургия):       7
 * Новая Дисциплина:                               10
 * Атрибут:                                        Текущий рейтинг × 4
 * Способность:                                    Текущий рейтинг × 2
 * Клановая Дисциплина:                            Текущий рейтинг × 5
 * Другая Дисциплина:                              Текущий рейтинг × 7
 * Вторичный путь (Некромантия/Тауматургия):       Текущий рейтинг × 4
 * Добродетель:                                    Текущий рейтинг × 2
 * Человечность:                                   Текущий рейтинг × 2
 * Сила воли:                                      Текущий рейтинг
 */
export const experiencePointsConfig: ExperiencePointsConfig = {
  list: [
    {
      name: "xp-new-ability",
      multiplier: 2,
      isNew: true,
      flatCost: 3,
      extractValues: extractAbilityValues(abilitiesConfig),
    },
    {
      name: "xp-new-path",
      multiplier: 4,
      isNew: true,
      flatCost: 7,
      extractValues: extractDisciplinePathValues,
    },
    {
      name: "xp-new-clan-discipline",
      multiplier: 5,
      isNew: true,
      flatCost: 10,
      extractValues: extractClanDisciplineValues,
    },
    {
      name: "xp-new-other-discipline",
      multiplier: 7,
      isNew: true,
      flatCost: 10,
      extractValues: extractOtherDisciplineValues,
    },
    {
      name: "xp-attribute",
      multiplier: 4,
      extractValues: extractAttributeValues(attributesConfig),
    },
    {
      name: "xp-ability",
      multiplier: 2,
      extractValues: extractAbilityValues(abilitiesConfig),
    },
    {
      name: "xp-clan-discipline",
      multiplier: 5,
      extractValues: extractClanDisciplineValues,
    },
    {
      name: "xp-other-discipline",
      multiplier: 7,
      extractValues: extractOtherDisciplineValues,
    },
    {
      name: "xp-secondary-path",
      multiplier: 4,
      extractValues: extractDisciplinePathValues,
    },
    {
      name: "xp-virtue",
      multiplier: 2,
      extractValues: extractVirtueValues,
    },
    {
      name: "xp-humanity",
      multiplier: 2,
      extractValues: extractHumanityValue,
    },
    {
      name: "xp-willpower-vtm",
      multiplier: 1,
      extractValues: extractWillpowerValue,
    },
  ],
};
