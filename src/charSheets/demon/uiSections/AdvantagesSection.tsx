import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { useLimits } from "../../../charSheets/root/services/storageAdapter";
import { Subheader } from "../../generic/uiPrimitives";
import {
  BackgroundsSection,
} from "../../generic/uiSections";
import {
  useBackgrounds,
  useVirtues,
} from "../../generic/services/storageAdapter";
import { Options } from "../../root/domain";
import { useLores } from "../services/storageAdapter";
import { DemonVirtuesSection } from "./DemonVirtuesSection";
import { LoresSection } from "./LoresSection";

interface AdvantagesSectionProps {
  backgroundOptions?: Options;
  loreOptions?: Options;
  className?: string;
}

export function AdvantagesSection(props: AdvantagesSectionProps): JSX.Element {
  const { className, backgroundOptions, loreOptions } = props;
  const { t } = useTranslation();

  const { limits } = useLimits();
  const loresService = useLores();
  const backgroundsService = useBackgrounds();
  const virtuesService = useVirtues();

  return (
    <div
      className={classnames("AdvantagesSection tw-flex tw-gap-x-4", className)}
    >
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
          {t("charsheet.demon.lores", "Знания")}
        </Subheader>
        <LoresSection
          limits={limits}
          loreOptions={loreOptions}
          {...loresService}
        />
      </div>
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2 print:tw-hidden">
          {t("charsheet.advantages.virtues")}
        </Subheader>
        <DemonVirtuesSection {...virtuesService} />
      </div>
    </div>
  );
}
