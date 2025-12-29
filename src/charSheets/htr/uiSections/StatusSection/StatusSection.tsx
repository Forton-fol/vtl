import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useStatus } from "../../../generic/services/storageAdapter";
import { WillSection } from "../../../generic/uiSections/WillSection";
import { HTRVirtuesService } from "../../application/ports";
import { VirtuesSection } from "../VirtuesSection";
import { ConvictionSection } from "../ConvictionSection";

interface StatusSectionProps extends HTRVirtuesService {
  className?: string;
}

export function StatusSection(props: StatusSectionProps): JSX.Element {
  const { t } = useTranslation();
  const { className, ...virtuesProps } = props;

  const statusService = useStatus();

  return (
    <div className={classnames("StatusSection", className)}>
      <div className="tw-flex tw-gap-x-6">
        {/* Добродетели (Virtues) */}
        <div className="tw-flex-1">
          <h4 className="tw-font-bold tw-mb-2">
            {t("charsheet.htr.status.virtues", "Добродетели")}
          </h4>
          <VirtuesSection {...virtuesProps} />
        </div>

        {/* Убеждённость и другое */}
        <div className="tw-flex-1">
          <h4 className="tw-font-bold tw-mb-2">
            {t("charsheet.htr.status.conviction", "Убеждённость")}
          </h4>
          <ConvictionSection {...virtuesProps} />

          <div className="tw-mt-4">
            <h4 className="tw-font-bold tw-mb-2">
              {t("charsheet.status.willpower", "Сила Воли")}
            </h4>
            <WillSection {...statusService} />
          </div>
        </div>
      </div>
    </div>
  );
}
