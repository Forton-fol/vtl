import React, { useCallback, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/cjs/Form";
import classnames from "classnames";

import { RangeInput2 } from "../../../generic/uiPrimitives/RangeInput2";
import { HTRVirtuesService } from "../../application/ports";

import "./ConvictionSection.css";

interface ConvictionSectionProps extends HTRVirtuesService {
  className?: string;
}

export function ConvictionSection(props: ConvictionSectionProps): JSX.Element {
  const { t } = useTranslation();
  const {
    className,
    state,
    setConviction,
    setConvictionPool,
  } = props;

  const conviction = (state as any).conviction || 0;
  const convictionPool = (state as any).convictionPool || 0;

  const onConvictionChange = useCallback(
    (value: number) => setConviction(value),
    [setConviction]
  );

  const onConvictionPoolChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10) || 0;
      setConvictionPool(Math.min(100, Math.max(0, value)));
    },
    [setConvictionPool]
  );

  return (
    <div className={classnames("ConvictionSection", className)}>
      <div className="tw-flex tw-items-center tw-gap-4">
        <span className="tw-w-32 tw-font-medium">
          {t("charsheet.htr.conviction.rating", "Убеждённость")}
        </span>
        <RangeInput2
          max={10}
          value={conviction}
          dataContext={null}
          onClick={onConvictionChange}
          name="conviction-rating"
        />
      </div>
    </div>
  );
}
