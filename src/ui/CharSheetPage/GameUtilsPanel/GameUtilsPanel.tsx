import React from "react";
import Accordion from "react-bootstrap/cjs/Accordion";
import Card from "react-bootstrap/cjs/Card";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { AccordionToggle } from "../../../uiLib/AccordionToggle";
import { useExternalPresetProps } from "../../../charSheets";
import { usePreset } from "../../../charSheets/root/services/storageAdapter";
import { getRandomizerConfig } from "../../../charSheets/generic/randomizer";

import { FreebiePointsPanel } from "./FreebiePointsPanel/FreebiePointsPanel";
import { ExperiencePointsPanel } from "./ExperiencePointsPanel";
import { RandomizerPanel } from "./RandomizerPanel";
// import { FreebiePointsPanel } from "./FreebiePointsPanel";

interface GameUtilsPanelProps {
  className?: string;
}

export function GameUtilsPanel(props: GameUtilsPanelProps): JSX.Element | null {
  const { t } = useTranslation();
  const { CheckList, freebiePointsConfig, experiencePointsConfig } = useExternalPresetProps();
  const { preset } = usePreset();
  const randomizerConfig = getRandomizerConfig(preset);

  const { className } = props;

  if (CheckList === undefined && freebiePointsConfig === undefined && experiencePointsConfig === undefined && !randomizerConfig) {
    return null;
  }

  return (
    <aside
      className={classnames(
        "GameUtilsPanel tw-flex-grow-0 tw-flex-shrink-0 print:tw-hidden",
        className,
      )}
    >
      <Accordion className="tw-sticky tw-top-0 GameUtilsPanel__accordion">
        {CheckList && (
          <Card className="GameUtilsPanel__card">
            <AccordionToggle
              ariaId="checklist-toggle"
              eventKey="0"
              title={t("checklist.header")}
              ariaControls="checklist-panel"
            />
            <Accordion.Collapse
              id="checklist-panel"
              eventKey="0"
              className="GameUtilsPanel__collapse"
              role="region"
              aria-labelledby="checklist-toggle"
            >
              <div className="tw-max-w-sm">
                <CheckList />
              </div>
            </Accordion.Collapse>
          </Card>
        )}
        {freebiePointsConfig && (
          <Card className="GameUtilsPanel__card">
            <AccordionToggle
              ariaId="freebie-points-toggle"
              eventKey="1"
              title={t("freebiePoints.header")}
              ariaControls="freebie-points-panel"
            />
            <Accordion.Collapse
              id="freebie-points-panel"
              eventKey="1"
              className="GameUtilsPanel__collapse"
              role="region"
              aria-labelledby="freebie-points-toggle"
            >
              <FreebiePointsPanel freebiePointsConfig={freebiePointsConfig} />
            </Accordion.Collapse>
          </Card>
        )}
        {experiencePointsConfig && (
          <Card className="GameUtilsPanel__card">
            <AccordionToggle
              ariaId="experience-points-toggle"
              eventKey="2"
              title={t("experiencePoints.header")}
              ariaControls="experience-points-panel"
            />
            <Accordion.Collapse
              id="experience-points-panel"
              eventKey="2"
              className="GameUtilsPanel__collapse"
              role="region"
              aria-labelledby="experience-points-toggle"
            >
              <ExperiencePointsPanel experiencePointsConfig={experiencePointsConfig} />
            </Accordion.Collapse>
          </Card>
        )}
        {randomizerConfig && (
          <Card className="GameUtilsPanel__card">
            <AccordionToggle
              ariaId="randomizer-toggle"
              eventKey="3"
              title={t("randomizer.header")}
              ariaControls="randomizer-panel"
            />
            <Accordion.Collapse
              id="randomizer-panel"
              eventKey="3"
              className="GameUtilsPanel__collapse"
              role="region"
              aria-labelledby="randomizer-toggle"
            >
              <RandomizerPanel />
            </Accordion.Collapse>
          </Card>
        )}
      </Accordion>
    </aside>
  );
}
