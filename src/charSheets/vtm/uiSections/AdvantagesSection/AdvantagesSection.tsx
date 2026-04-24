import React from "react";
import "./AdvantagesSection.css";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useLimits } from "../../../../charSheets/root/services/storageAdapter";
import { Subheader } from "../../../generic/uiPrimitives";
import {
  BackgroundsSection,
} from "../../../generic/uiSections";
import { useDisciplines } from "../../services/storageAdapter";
import {
  useBackgrounds,
  useHealth,
  useStatus,
} from "../../../generic/services/storageAdapter";
import { OptionGroup, Options } from "../../../root/domain";

import { DisciplinesSection } from "./DisciplinesSection";
import { HungerSection } from "./HungerSection";
import { V5HealthSection } from "./V5HealthSection";
import { V5WillSection } from "./V5WillSection";

interface AdvantagesSectionProps {
  backgroundOptions?: Options;
  disciplineOptions?: OptionGroup[];
  className?: string;
}

export function AdvantagesSection(props: AdvantagesSectionProps): JSX.Element {
  const { className, backgroundOptions, disciplineOptions } = props;
  const { t } = useTranslation();

  const { limits } = useLimits();
  const disciplinesService = useDisciplines();
  const backgroundsService = useBackgrounds();
  const healthService = useHealth();
  const statusService = useStatus();

  return (
    <div
      className={classnames("AdvantagesSection tw-flex tw-gap-x-4", className)}
    >
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2 print:tw-hidden">
          {t("charsheet.advantages.disciplines")}
        </Subheader>
        <DisciplinesSection
          limits={limits}
          disciplineOptions={disciplineOptions}
          {...disciplinesService}
        />
      </div>
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2 print:tw-hidden">
          {t("charsheet.advantages.backgrounds")}
        </Subheader>
        <BackgroundsSection
          limits={limits}
          backgroundOptions={backgroundOptions}
          {...backgroundsService}
        />
      </div>
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2 print:tw-hidden">
          {t("charsheet.advantages.virtues")}
        </Subheader>
        
        {/* Health and Will - side by side */}
        <div className="tw-flex tw-gap-2 tw-mb-3">
          {/* Health - vertical points */}
          <div className="tw-flex-1">
            <V5HealthSection 
              limits={limits} 
              {...healthService}
              {...statusService}
            />
          </div>

          {/* Willpower - vertical points */}
          <div className="tw-flex-1">
            <V5WillSection {...statusService} />
          </div>
        </div>

        {/* Hunger - below Health and Will */}
        <HungerSection limits={limits} {...statusService} />
      </div>
    </div>
  );
}
