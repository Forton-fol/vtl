import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useBackgrounds } from "../../../generic/services/storageAdapter";
import { useStatus } from "../../../generic/services/storageAdapter";
import { WillSection } from "../../../generic/uiSections/WillSection";
import { NameNumberSection } from "../../../generic/uiPrimitives/NameNumberSection";
import { HTRVirtuesService } from "../../application/ports";
import { ConvictionSection } from "../ConvictionSection";
import { backgroundOptionsRu, backgroundOptionsEn } from "../../dropdownContent/resources/optionsSources";

interface StatusSectionProps extends HTRVirtuesService {
  className?: string;
}

export function StatusSection(props: StatusSectionProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const { className, ...virtuesProps } = props;

  const statusService = useStatus();
  const backgroundsService = useBackgrounds();
  const backgroundOptions = i18n.language === "ru" ? backgroundOptionsRu : backgroundOptionsEn;

  return (
    <div className={classnames("StatusSection", className)}>
      <div className="tw-flex tw-gap-x-6">
        {/* Дополнение (Backgrounds) */}
        <div className="tw-flex-1">
          <h4 className="tw-font-bold tw-mb-2">
            {t("charsheet.advantages.backgrounds", "Дополнение")}
          </h4>
          <NameNumberSection
            items={backgroundsService.backgrounds}
            addItem={backgroundsService.addBackground}
            removeItem={backgroundsService.removeBackground}
            setItemName={backgroundsService.setBackgroundName}
            setItemValue={backgroundsService.setBackgroundValue}
            addItemMsg={t("charsheet.advantages.add-background")}
            removeItemMsg={t("charsheet.advantages.remove-background")}
            sectionItemName="background"
            max={5}
            options={backgroundOptions}
            selectOptionMsg={t("charsheet.advantages.select-background")}
          />
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
