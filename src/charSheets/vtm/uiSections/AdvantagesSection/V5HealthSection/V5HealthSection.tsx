import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { RangeInput2 } from "../../../../generic/uiPrimitives";
import { HealthService } from "../../../../generic/application/ports";
import { Limits } from "../../../../../charSheets/root/domain";

import "./V5HealthSection.css";

interface V5HealthSectionProps extends HealthService {
  limits: Limits;
  className?: string;
}

export const V5HealthSection = memo(function V5HealthSection(
  props: V5HealthSectionProps
) {
  const { t } = useTranslation();
  const { className, health, addBruiseBox, removeBruiseBox } = props;

  const onHealthChange = (value: number) => {
    const currentValue = health.bruiseBoxes?.length || 0;
    const delta = value - currentValue;

    if (delta > 0) {
      for (let index = 0; index < delta; index += 1) {
        addBruiseBox();
      }
    }

    if (delta < 0) {
      for (let index = 0; index < Math.abs(delta); index += 1) {
        removeBruiseBox();
      }
    }
  };

  return (
    <fieldset
      className={classnames("V5HealthSection", className)}
      aria-label={t("charsheet.status.health")}
    >
      <legend className="tw-text-sm tw-font-semibold tw-mb-1">
        {t("charsheet.status.health")}
      </legend>
      <div className="V5HealthSection__container">
        <RangeInput2
          max={10}
          name="health"
          value={health.bruiseBoxes?.length || 0}
          dataContext={"health"}
          onClick={onHealthChange}
          variant="square"
          multiplier={1.2}
        />
      </div>
    </fieldset>
  );
});
