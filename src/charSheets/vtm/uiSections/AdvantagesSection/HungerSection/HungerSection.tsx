import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { RangeInput2 } from "../../../../generic/uiPrimitives";
import { StatusService } from "../../../../generic/application/ports";
import { Limits } from "../../../../../charSheets/root/domain";

interface HungerSectionProps extends StatusService {
  limits: Limits;
  className?: string;
}

export const HungerSection = memo(function HungerSection(
  props: HungerSectionProps
) {
  const { t } = useTranslation();
  const { className, state, setState, limits } = props;

  const onHungerChange = useCallback(
    (value: number) => {
      setState("hunger", value);
    },
    [setState]
  );

  return (
    <fieldset
      className={classnames("HungerSection", className)}
      aria-label={t("charsheet.status.hunger", "Hunger")}
    >
      <legend className="tw-text-sm tw-font-semibold tw-mb-1">
        {t("charsheet.status.hunger", "Hunger")}
      </legend>
      <RangeInput2
        max={5}
        name="hunger"
        value={state.hunger || 0}
        dataContext={"hunger"}
        onClick={onHungerChange}
        variant="square"
        splitEvery={5}
      />
    </fieldset>
  );
});
