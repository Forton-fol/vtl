import React, { memo } from "react";
import classnames from "classnames";

import { VirtuesService } from "../../generic/application/ports";
import { Virtues } from "../../generic/domain";
import { RangeInput2 } from "../../generic/uiPrimitives";

interface DemonVirtuesSectionProps extends VirtuesService {
  className?: string;
}

const virtuesArr: (keyof Virtues)[] = ["conscience", "self_control", "courage"];

const demonVirtueLabels: Record<keyof Virtues, string> = {
  conscience: "Совесть",
  self_control: "Убеждённость",
  courage: "Мужество",
};

export const DemonVirtuesSection = memo(function DemonVirtuesSection(
  props: DemonVirtuesSectionProps
) {
  const { className, setVirtue, virtues } = props;

  return (
    <div className={classnames("VirtuesSection", className)}>
      {virtuesArr.map((item, index) => (
        <div
          role="group"
          key={item}
          className={classnames("tw-text-sm tw-text-center print:tw-mb-0", {
            "tw-mb-2": index + 1 !== virtuesArr.length,
          })}
          aria-labelledby={`virtue.label.${item}`}
        >
          <label id={`virtue.label.${item}`} className="tw-mb-1">
            {demonVirtueLabels[item]}
          </label>
          <RangeInput2
            max={5}
            name={`virtue.${item}`}
            value={virtues[item]}
            dataContext={item}
            onClick={(value: number) => setVirtue(item, value)}
            className="tw-flex-grow"
          />
        </div>
      ))}
    </div>
  );
});
