import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import Button from "react-bootstrap/cjs/Button";

import { StatusService } from "../../../../generic/application/ports";
import { Limits } from "../../../../../charSheets/root/domain";
import { V5TrackInput } from "../V5TrackInput";

import "./V5HealthSection.css";

interface V5HealthSectionProps extends StatusService {
  limits: Limits;
  className?: string;
}

export const V5HealthSection = memo(function V5HealthSection(
  props: V5HealthSectionProps
) {
  const { t } = useTranslation();
  const { className, state, setState } = props;

  const boxes = state.v5HealthBoxes || [];

  const updateBoxes = (nextBoxes: number[]) => {
    setState("v5HealthBoxes", nextBoxes);
  };

  return (
    <fieldset
      className={classnames("V5HealthSection", className)}
      aria-label={t("charsheet.status.health")}
    >
      <legend className="tw-text-sm tw-font-semibold tw-mb-1">
        {t("charsheet.status.health")}
      </legend>
      <div className="V5HealthSection__toolbar print:tw-hidden">
        <Button
          size="sm"
          variant="outline-secondary"
          className="V5HealthSection__button"
          onClick={() => updateBoxes([...boxes, 0])}
          disabled={boxes.length >= 10}
          title={t("common.add")}
        >
          +
        </Button>
        <Button
          size="sm"
          variant="outline-secondary"
          className="V5HealthSection__button"
          onClick={() => updateBoxes(boxes.slice(0, -1))}
          disabled={boxes.length === 0}
          title={t("common.remove")}
        >
          -
        </Button>
      </div>
      <div className="V5HealthSection__container">
        <V5TrackInput
          name="health"
          boxes={boxes}
          onChange={(index, value) => {
            const nextBoxes = [...boxes];
            nextBoxes[index] = value;
            updateBoxes(nextBoxes);
          }}
        />
      </div>
    </fieldset>
  );
});
