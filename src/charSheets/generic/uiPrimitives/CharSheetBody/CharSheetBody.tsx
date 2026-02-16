import React, { PropsWithChildren, useEffect, useState } from "react";
import classnames from "classnames";

import "./CharSheetBody.css";
import { Settings } from "../../../misc/domain";
import { useSettings } from "../../../misc/services/storageAdapter";
import { loadImage, IDB_MARKER } from "../../../../lib/imageStorage";

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

export function CharSheetBody(props: PropsWithChildren<CharSheetBodyProps>) {
  const { settings } = useSettings();
  const { children, className } = props;
  const [sheetBgUrl, setSheetBgUrl] = useState<string>("none");

  useEffect(() => {
    if (settings.charsheetBackMode !== "charsheet-image") {
      setSheetBgUrl("none");
      return;
    }
    if (settings.charsheetBackImage_v2 === IDB_MARKER) {
      loadImage("sheet_bg").then((data) => {
        setSheetBgUrl(data ? `url(${data})` : "none");
      });
    } else if (settings.charsheetBackImage_v2) {
      setSheetBgUrl(`url(${settings.charsheetBackImage_v2})`);
    } else {
      setSheetBgUrl("none");
    }
  }, [settings.charsheetBackMode, settings.charsheetBackImage_v2]);

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
        backgroundImage: sheetBgUrl,
        color: settings.charsheetTextColor || "#000000",
        opacity,
        fontSize: `${fontSize}rem`,
      }}
    >
      {children}
    </div>
  );
}
