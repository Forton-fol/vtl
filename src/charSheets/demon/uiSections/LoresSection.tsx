import React, { memo } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { LimitService } from "../../../charSheets/root/application/ports";
import { NameNumberSection } from "../../generic/uiPrimitives";
import { Options } from "../../root/domain";
import { LoresService } from "../application/ports";

interface LoresSectionProps extends LoresService, LimitService {
  loreOptions?: Options;
  className?: string;
}

export const LoresSection = memo(function LoresSection(
  props: LoresSectionProps
) {
  const { t } = useTranslation();
  const {
    className,
    lores,
    addLore,
    removeLore,
    setLoreName,
    setLoreValue,
    loreOptions,
    limits,
  } = props;

  return (
    <NameNumberSection
      sectionItemName="lore"
      className={classnames("LoresSection", className)}
      addItem={addLore}
      items={lores}
      removeItem={removeLore}
      setItemName={setLoreName}
      setItemValue={setLoreValue}
      addItemMsg={t("charsheet.advantages.add-lore", "Добавить знание")}
      removeItemMsg={t("charsheet.advantages.remove-lore", "Удалить знание")}
      options={loreOptions}
      selectOptionMsg={t("charsheet.advantages.select-lore", "Выбрать знание")}
      max={limits.parameterLimit}
    />
  );
});
