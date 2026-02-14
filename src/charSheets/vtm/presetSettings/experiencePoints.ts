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

function extractDisciplineValues(cs: CharSheet): number[] {
  return R.pluck("value", cs.disciplines);
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
      name: "xp-new-discipline",
      multiplier: 7,
      isNew: true,
      flatCost: 10,
      extractValues: extractDisciplineValues,
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
      extractValues: extractDisciplineValues,
    },
    {
      name: "xp-other-discipline",
      multiplier: 7,
      extractValues: extractDisciplineValues,
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
