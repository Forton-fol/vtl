import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { Subheader } from "../../uiPrimitives/Subheader";
import { RangeInput2 } from "../../uiPrimitives/RangeInput2";
import { SpecializationPicker } from "../../uiPrimitives/SpecializationPicker/SpecializationPicker";
import { Attributes, AttributesConfig, Limits } from "../../../root/domain";
import { AttributesService, SpecializationsService } from "../../application/ports";
import "./AttributeSection.css";

interface AttributeSectionProps extends AttributesService, SpecializationsService {
  limits: Limits;
  attributesConfig: AttributesConfig;
  className?: string;
}

export const AttributeSection = memo(function AttributeSection(
  props: AttributeSectionProps,
) {
  const { t } = useTranslation();
  const {
    className,
    attributes,
    setAttribute,
    limits,
    attributesConfig,
    specializations,
    setSpecialization,
  } = props;

  const setValue = useCallback(
    function setValue(value: number, attribute: keyof Attributes) {
      setAttribute(attribute, value);
    },
    [setAttribute],
  );

  return (
    <div
      className={classnames("AttributeSection tw-flex tw-gap-x-4", className)}
    >
      {attributesConfig.map(({ header, items }) => (
        <div className="tw-flex-1" key={header}>
          <Subheader className="print:tw-hidden">
            {t(`charsheet.attributes.${header}`)}
          </Subheader>
          {items.map((attribute) => (
            <div
              role="group"
              className="stat-container tw-flex-wrap"
              key={attribute}
              aria-labelledby={`attribute.label.${attribute}`}
            >
              <label
                className="stat-container-label"
                id={`attribute.label.${attribute}`}
              >
                {t(`charsheet.attributes.${attribute}`)}
              </label>
              <RangeInput2
                max={limits.parameterLimit}
                name={`attribute.${attribute}`}
                value={attributes[attribute]}
                dataContext={attribute}
                onClick={setValue}
                className="tw-ml-4"
              />
              <SpecializationPicker
                statKey={attribute}
                value={attributes[attribute]}
                specialization={specializations[attribute]}
                onSetSpecialization={setSpecialization}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});
