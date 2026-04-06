import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { StatusService } from "../../../generic/application/ports";
import { RangeInput2 } from "../../../generic/uiPrimitives";

interface QuintessenceSectionProps extends StatusService {
  className?: string;
  linkQnP?: boolean;
}

export const QuintessenceSection = memo(function QuintessenceSection(
  props: QuintessenceSectionProps,
) {
  const { t } = useTranslation();
  const { state, setState, className, linkQnP } = props;

  const onClick = useCallback(
    (value: number) => {
      setState("quintessence", value);
      if (linkQnP) {
        setState("paradox", 20 - value);
      }
    },
    [setState, linkQnP]
  );

  return (
    <fieldset
      className={classnames("QuintessenceSection", className)}
      aria-label={t("charsheet.status.quintessence")}
    >
      <RangeInput2
        max={20}
        name="quintessence"
        value={state.quintessence}
        dataContext={"quintessence"}
        onClick={onClick}
        className="tw-mb-2"
        multiplier={1.3}
        splitEvery={10}
      />
    </fieldset>
  );
});
