import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { StatusService } from "../../../generic/application/ports";
import { RangeInput2 } from "../../../generic/uiPrimitives";

interface ParadoxSectionProps extends StatusService {
  className?: string;
  linkQnP?: boolean;
}

export const ParadoxSection = memo(function ParadoxSection(
  props: ParadoxSectionProps,
) {
  const { t } = useTranslation();
  const { state, setState, className, linkQnP } = props;

  const onClick = useCallback(
    (value: number) => {
      setState("paradox", value);
      if (linkQnP) {
        setState("quintessence", 20 - value);
      }
    },
    [setState, linkQnP]
  );

  return (
    <fieldset
      className={classnames("ParadoxSection", className)}
      aria-label={t("charsheet.status.paradox")}
    >
      <RangeInput2
        max={20}
        name="paradox"
        value={state.paradox}
        dataContext={"paradox"}
        onClick={onClick}
        className="tw-mb-2"
        multiplier={1.3}
        splitEvery={10}
      />
    </fieldset>
  );
});
