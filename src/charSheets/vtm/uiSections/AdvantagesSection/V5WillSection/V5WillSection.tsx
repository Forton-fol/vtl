import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import Button from "react-bootstrap/cjs/Button";

import { StatusService } from "../../../../generic/application/ports";
import { V5TrackInput } from "../V5TrackInput";

import "./V5WillSection.css";

interface V5WillSectionProps extends StatusService {
  className?: string;
}

export const V5WillSection = memo(function V5WillSection(
  props: V5WillSectionProps
) {
  const { t } = useTranslation();
  const { className, state, setState } = props;

  const boxes =
    state.willpowerBoxes && state.willpowerBoxes.length > 0
      ? state.willpowerBoxes
      : Array.from({ length: state.willpowerRating || 0 }, () => 0);

  const updateBoxes = (nextBoxes: number[]) => {
    setState("willpowerBoxes", nextBoxes);
  };

  return (
    <fieldset
      className={classnames("V5WillSection", className)}
      aria-label={t("charsheet.status.willpower")}
    >
      <legend className="tw-text-sm tw-font-semibold tw-mb-1">
        {t("charsheet.status.willpower")}
      </legend>
      <div className="V5WillSection__toolbar print:tw-hidden">
        <Button
          size="sm"
          variant="outline-secondary"
          className="V5WillSection__button"
          onClick={() => updateBoxes([...boxes, 0])}
          disabled={boxes.length >= 10}
          title={t("common.add")}
        >
          +
        </Button>
        <Button
          size="sm"
          variant="outline-secondary"
          className="V5WillSection__button"
          onClick={() => updateBoxes(boxes.slice(0, -1))}
          disabled={boxes.length === 0}
          title={t("common.remove")}
        >
          -
        </Button>
      </div>
      <div className="V5WillSection__container">
        <V5TrackInput
          name="willpower"
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
