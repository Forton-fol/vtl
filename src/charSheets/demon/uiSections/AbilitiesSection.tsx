import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { AbilitiesService, AbilitiesExtensionService } from "../../generic/application/ports";
import { LimitService } from "../../../charSheets/root/application/ports";
import { AbilitiesSection as GenericAbilitiesSection } from "../../generic/uiSections/AbilitiesSection";
import { AbilitiesConfig } from "../../../charSheets/root/domain";

interface AbilitiesSectionProps extends AbilitiesService, AbilitiesExtensionService, LimitService {
  className?: string;
}

export function AbilitiesSection(props: AbilitiesSectionProps): JSX.Element {
  const { t } = useTranslation();
  const { className, limits, ...abilitiesProps } = props;

  const abilitiesConfig: AbilitiesConfig = [
    {
      header: "talents",
      items: [
        "alertness",
        "athletics",
        "awareness",
        "brawl",
        "dodge",
        "empathy",
        "expression",
        "intimidation",
        "intuition",
        "leadership",
        "streetwise",
        "subterfuge",
      ],
      extension: "talent" as const,
    },
    {
      header: "skills",
      items: [
        "animalken",
        "crafts",
        "demolitions",
        "drive",
        "etiquette",
        "firearms",
        "melee",
        "performance",
        "security",
        "stealth",
        "survival",
        "technology",
      ],
      extension: "skill" as const,
    },
    {
      header: "knowledges",
      items: [
        "academics",
        "computer",
        "finance",
        "investigation",
        "law",
        "linguistics",
        "medicine",
        "occult",
        "politics",
        "religion",
        "research",
        "science",
      ],
      extension: "knowledge" as const,
    },
  ];

  return (
    <div className={classnames("AbilitiesSection", className)}>
      <GenericAbilitiesSection
        {...abilitiesProps}
        abilitiesConfig={abilitiesConfig}
        limits={limits}
      />
    </div>
  );
}
