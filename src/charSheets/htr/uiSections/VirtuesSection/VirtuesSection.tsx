import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { RangeInput2 } from "../../../generic/uiPrimitives/RangeInput2";
import { HTRVirtuesService } from "../../application/ports";

import "./VirtuesSection.css";

interface VirtuesSectionProps extends HTRVirtuesService {
  className?: string;
}

export function VirtuesSection(props: VirtuesSectionProps): JSX.Element {
  const { t } = useTranslation();
  const {
    className,
    state,
    setMercyBase,
    setMercyTemp,
    setVisionBase,
    setVisionTemp,
    setZealBase,
    setZealTemp,
  } = props;

  const onMercyBaseChange = useCallback(
    (value: number) => setMercyBase(value),
    [setMercyBase]
  );

  const onMercyTempChange = useCallback(
    (value: number) => setMercyTemp(value),
    [setMercyTemp]
  );

  const onVisionBaseChange = useCallback(
    (value: number) => setVisionBase(value),
    [setVisionBase]
  );

  const onVisionTempChange = useCallback(
    (value: number) => setVisionTemp(value),
    [setVisionTemp]
  );

  const onZealBaseChange = useCallback(
    (value: number) => setZealBase(value),
    [setZealBase]
  );

  const onZealTempChange = useCallback(
    (value: number) => setZealTemp(value),
    [setZealTemp]
  );

  const mercyBase = (state as any).mercyBase || 0;
  const mercyTemp = (state as any).mercyTemp || 0;
  const visionBase = (state as any).visionBase || 0;
  const visionTemp = (state as any).visionTemp || 0;
  const zealBase = (state as any).zealBase || 0;
  const zealTemp = (state as any).zealTemp || 0;

  return (
    <div className={classnames("VirtuesSection", className)}>
      <div className="tw-space-y-3">
        {/* Милосердие (Mercy) */}
        <div className="tw-flex tw-items-center tw-gap-4">
          <span className="tw-w-28 tw-font-medium">
            {t("charsheet.htr.virtues.mercy", "Милосердие")}
          </span>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.base", "Базовое")}
            </span>
            <RangeInput2
              max={5}
              value={mercyBase}
              dataContext={null}
              onClick={onMercyBaseChange}
              name="mercy-base"
            />
          </div>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.temp", "Временное")}
            </span>
            <RangeInput2
              max={5}
              value={mercyTemp}
              dataContext={null}
              onClick={onMercyTempChange}
              name="mercy-temp"
              variant="square"
            />
          </div>
        </div>

        {/* Прозрение (Vision) */}
        <div className="tw-flex tw-items-center tw-gap-4">
          <span className="tw-w-28 tw-font-medium">
            {t("charsheet.htr.virtues.vision", "Прозрение")}
          </span>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.base", "Базовое")}
            </span>
            <RangeInput2
              max={5}
              value={visionBase}
              dataContext={null}
              onClick={onVisionBaseChange}
              name="vision-base"
            />
          </div>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.temp", "Временное")}
            </span>
            <RangeInput2
              max={5}
              value={visionTemp}
              dataContext={null}
              onClick={onVisionTempChange}
              name="vision-temp"
              variant="square"
            />
          </div>
        </div>

        {/* Рвение (Zeal) */}
        <div className="tw-flex tw-items-center tw-gap-4">
          <span className="tw-w-28 tw-font-medium">
            {t("charsheet.htr.virtues.zeal", "Рвение")}
          </span>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.base", "Базовое")}
            </span>
            <RangeInput2
              max={5}
              value={zealBase}
              dataContext={null}
              onClick={onZealBaseChange}
              name="zeal-base"
            />
          </div>
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-gray-500">
              {t("charsheet.htr.virtues.temp", "Временное")}
            </span>
            <RangeInput2
              max={5}
              value={zealTemp}
              dataContext={null}
              onClick={onZealTempChange}
              name="zeal-temp"
              variant="square"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
