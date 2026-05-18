import { Settings } from "../domain";

import { defaultBackgroundUrl } from "./defaultBackground";
import { getThemeVisualSettings } from "./themes";

export { defaultBackgroundUrl } from "./defaultBackground";

// no character data
const initialTheme = "neutral";
const initialThemeSettings = getThemeVisualSettings(initialTheme);

export const initialSettings: Settings = {
  siteTheme: initialTheme,
  backgroundColor: initialThemeSettings.backgroundColor,
  charsheetBackColor: initialThemeSettings.charsheetBackColor,
  charsheetBackImage_v2: defaultBackgroundUrl,
  charsheetBackMode: "charsheet-color",
  // new customization
  charsheetTextColor: initialThemeSettings.charsheetTextColor,
  sidebarColor: initialThemeSettings.sidebarColor,
  sidebarTextColor: initialThemeSettings.sidebarTextColor,
  charsheetBorderVisible: true,
  charsheetFontSize: 100,
  charsheetBackOpacity: 100,
  backgroundImage: "",
  sidebarOpacity: 100,
  showSpecializations: true,
};
