import React from "react";
import "./AdvantagesSection.css";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useLimits } from "../../../../charSheets/root/services/storageAdapter";
import { Subheader } from "../../../generic/uiPrimitives";
import {
  BackgroundsSection,
  VirtuesSection,
} from "../../../generic/uiSections";
import { useDisciplines } from "../../services/storageAdapter";
import {
  useBackgrounds,
  useStatus,
  useVirtues,
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
  isV5?: boolean;
}

export function AdvantagesSection(props: AdvantagesSectionProps): JSX.Element {
  const { className, backgroundOptions, disciplineOptions, isV5 = false } = props;
  const { t } = useTranslation();

  const { limits } = useLimits();
  const disciplinesService = useDisciplines();
  const backgroundsService = useBackgrounds();
  const virtuesService = useVirtues();
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
          isV5={isV5}
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
        {isV5 ? (
          <>
            <div className="tw-flex tw-gap-2 tw-mb-3">
              <div className="tw-flex-1">
                <V5HealthSection limits={limits} {...statusService} />
              </div>
              <div className="tw-flex-1">
                <V5WillSection {...statusService} />
              </div>
            </div>
            <HungerSection limits={limits} {...statusService} />
          </>
        ) : (
          <VirtuesSection {...virtuesService} />
        )}
      </div>
    </div>
  );
}
