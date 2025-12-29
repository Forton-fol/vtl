import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { EdgesService, HTRVirtuesService } from "../../application/ports";
import { EdgesSection } from "../EdgesSection";
import { VirtuesSection } from "../VirtuesSection";

interface AdvantagesSectionProps extends EdgesService, HTRVirtuesService {
  className?: string;
}

export function AdvantagesSection(props: AdvantagesSectionProps): JSX.Element {
  const { t } = useTranslation();
  const {
    className,
    edges,
    addEdge,
    removeEdge,
    setEdgeEdge,
    setEdgeName,
    setEdgeCreed,
    setEdgeLevel,
    setEdgeTrigger,
    ...virtuesProps
  } = props;

  const edgesProps = { edges, addEdge, removeEdge, setEdgeEdge, setEdgeName, setEdgeCreed, setEdgeLevel, setEdgeTrigger };

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

        {/* Добродетели (Virtues) */}
        <div className="tw-flex-1">
          <h4 className="tw-font-bold tw-mb-2">
            {t("charsheet.htr.status.virtues", "Добродетели")}
          </h4>
          <VirtuesSection {...virtuesProps} />
        </div>
      </div>
    </div>
  );
}
