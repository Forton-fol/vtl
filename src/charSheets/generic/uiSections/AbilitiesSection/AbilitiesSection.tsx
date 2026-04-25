import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { Subheader } from "../../uiPrimitives/Subheader";
import { RangeInput2 } from "../../uiPrimitives/RangeInput2";
import { SpecializationPicker } from "../../uiPrimitives/SpecializationPicker/SpecializationPicker";
import { usePreset } from "../../../root/services/storageAdapter";
import {
  Abilities,
  AbilitiesConfig,
  AbilitiesExtensionValue,
  Limits,
} from "../../../root/domain";
import {
  AbilitiesExtensionService,
  AbilitiesService,
  SpecializationsService,
} from "../../application/ports";

interface AbilitiesSectionProps
  extends AbilitiesService,
    AbilitiesExtensionService,
    SpecializationsService {
  limits: Limits;
  abilitiesConfig: AbilitiesConfig;
  className?: string;
}

export const AbilitiesSection = memo(function AbilitiesSection(
  props: AbilitiesSectionProps
) {
  const { t } = useTranslation();
  const { preset } = usePreset();
  const {
    className,
    abilities,
    setAbility,
    limits,
    abilitiesExtension,
    setAbilityExtensionName,
    setAbilityExtensionValue,
    abilitiesConfig,
    specializations,
    setSpecialization,
  } = props;

  const setValue = useCallback(
    function setValue(value: number, ability: keyof Abilities) {
      setAbility(ability, value);
    },
    [setAbility]
  );

  const setExtensionValue = useCallback(
    function setExtensionValue(
      value: number,
      abilityName: AbilitiesExtensionValue
    ) {
      setAbilityExtensionValue(abilityName, value);
    },
    [setAbilityExtensionValue]
  );

  const getLabel = useCallback(
    function getLabel(key: string) {
      const baseKey = `charsheet.abilities.${key}`;
      if (preset !== "vampire_v5") {
        return t(baseKey);
      }

      const v5Key = `charsheet.v5.abilities.${key}`;
      const translated = t(v5Key);
      return translated === v5Key ? t(baseKey) : translated;
    },
    [preset, t]
  );

  return (
    <div
      className={classnames("AbilitiesSection tw-flex tw-gap-x-4", className)}
    >
      {abilitiesConfig.map(({ header, items, extension }) => (
        <div className="tw-flex-1" key={header}>
          <Subheader className="print:tw-hidden">
            {getLabel(header)}
          </Subheader>
          {items.map((ability) => (
            <div
              role="group"
              className="stat-container tw-flex-wrap"
              key={ability}
              aria-labelledby={`ability.label.${ability}`}
            >
              <label
                className="stat-container-label"
                id={`ability.label.${ability}`}
              >
                {getLabel(ability)}
              </label>
              <RangeInput2
                max={limits.parameterLimit}
                name={`ability.${ability}`}
                value={abilities[ability]}
                dataContext={ability}
                onClick={setValue}
                className="tw-ml-4"
              />
              <SpecializationPicker
                statKey={ability}
                value={abilities[ability]}
                specialization={specializations[ability]}
                onSetSpecialization={setSpecialization}
              />
            </div>
          ))}
          <div role="group" className="stat-container">
            <input
              aria-label={t(`charsheet.abilities.extension-${extension}`, {
                id: 1,
              })}
              style={{ boxShadow: "0 1px 0 #333333" }}
              className="stat-container-input tw-flex-1
                  tw-w-6
                  tw-bg-transparent tw-border-none hover:tw-outline
                  hover:tw-outline-1 hover:tw-outline-red-600"
              value={abilitiesExtension[`${extension}Name1`]}
              onChange={(e) =>
                setAbilityExtensionName(`${extension}Name1`, e.target.value)
              }
            />
            <RangeInput2
              max={limits.parameterLimit}
              name={`ability.${extension}.1`}
              value={abilitiesExtension[`${extension}Value1`]}
              dataContext={`${extension}Value1`}
              onClick={setExtensionValue}
              className="tw-ml-4"
            />
          </div>
          <div role="group" className="stat-container">
            <input
              aria-label={t(`charsheet.abilities.extension-${extension}`, {
                id: 2,
              })}
              style={{ boxShadow: "0 1px 0 #333333" }}
              className="stat-container-input tw-flex-1
                  tw-w-6
                  tw-bg-transparent tw-border-none hover:tw-outline
                  hover:tw-outline-1 hover:tw-outline-red-600"
              value={abilitiesExtension[`${extension}Name2`]}
              onChange={(e) =>
                setAbilityExtensionName(`${extension}Name2`, e.target.value)
              }
            />
            <RangeInput2
              max={limits.parameterLimit}
              name={`ability.${extension}.2`}
              value={abilitiesExtension[`${extension}Value2`]}
              dataContext={`${extension}Value2`}
              onClick={setExtensionValue}
              className="tw-ml-4"
            />
          </div>
        </div>
      ))}
    </div>
  );
});
