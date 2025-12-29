import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useBackgrounds } from "../../../generic/services/storageAdapter";
import { NameNumberSection } from "../../../generic/uiPrimitives/NameNumberSection";
import { EdgesService } from "../../application/ports";
import { EdgesSection } from "../EdgesSection";
import { backgroundOptionsRu, backgroundOptionsEn } from "../../dropdownContent/resources/optionsSources";

interface AdvantagesSectionProps extends EdgesService {
  className?: string;
}

export function AdvantagesSection(props: AdvantagesSectionProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const { className, ...edgesProps } = props;

  const backgroundsService = useBackgrounds();
  const backgroundOptions = i18n.language === "ru" ? backgroundOptionsRu : backgroundOptionsEn;

  return (
    <div className={classnames("AdvantagesSection", className)}>
      <div className="tw-flex tw-gap-x-6">
        {/* Грани (Edges) */}
        <div className="tw-flex-1" style={{ flexGrow: 2 }}>
          <h4 className="tw-font-bold tw-mb-2">
            {t("charsheet.htr.advantages.edges", "Грани")}
          </h4>
          <EdgesSection {...edgesProps} />
        </div>

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
      </div>
    </div>
  );
}
