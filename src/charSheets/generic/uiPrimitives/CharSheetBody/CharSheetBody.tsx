import React, { PropsWithChildren } from "react";
import classnames from "classnames";

import "./CharSheetBody.css";
import { Settings } from "../../../misc/domain";
import { useSettings } from "../../../misc/services/storageAdapter";

interface CharSheetBodyProps {
  className?: string;
}

function getBgColor(settings: Settings): string {
  const { charsheetBackMode, charsheetBackColor } = settings;
  if (charsheetBackMode === "charsheet-color") {
    return charsheetBackColor;
  }
  return "transparent";
}

function getBgImage(settings: Settings): string {
  const { charsheetBackMode, charsheetBackImage_v2 } = settings;
  if (charsheetBackMode === "charsheet-image") {
    return `url(${charsheetBackImage_v2})`;
  }
  return "none";
}

export function CharSheetBody(props: PropsWithChildren<CharSheetBodyProps>) {
  const { settings } = useSettings();
  const { children, className } = props;

  const opacity = (settings.charsheetBackOpacity ?? 100) / 100;
  const fontSize = (settings.charsheetFontSize ?? 100) / 100;
  const borderHidden = settings.charsheetBorderVisible === false;

  return (
    <div
      className={classnames(
        "CharSheetBody tw-relative charsheet-page",
        className,
        { "charsheet-no-border": borderHidden }
      )}
      style={{
        backgroundColor: getBgColor(settings),
        backgroundImage: getBgImage(settings),
        color: settings.charsheetTextColor || "#000000",
        opacity,
        fontSize: `${fontSize}rem`,
      }}
    >
      {children}
    </div>
  );
}
