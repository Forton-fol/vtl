import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { RangeInput2 } from "../../../../generic/uiPrimitives";
import { StatusService } from "../../../../generic/application/ports";

import "./V5WillSection.css";

interface V5WillSectionProps extends StatusService {
  className?: string;
}

export const V5WillSection = memo(function V5WillSection(
  props: V5WillSectionProps
) {
  const { t } = useTranslation();
  const { className, state, setState } = props;

  const onWillChange = (value: number) => {
    setState("willpowerRating", value);
  };

  return (
    <fieldset
      className={classnames("V5WillSection", className)}
      aria-label={t("charsheet.status.willpower")}
    >
      <legend className="tw-text-sm tw-font-semibold tw-mb-1">
        {t("charsheet.status.willpower")}
      </legend>
      <div className="V5WillSection__container">
        <RangeInput2
          max={10}
          name="willpower"
          value={state.willpowerRating || 0}
          dataContext={"willpower"}
          onClick={onWillChange}
          variant="square"
          multiplier={1.2}
        />
      </div>
    </fieldset>
  );
});
