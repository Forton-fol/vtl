import { Settings } from "../domain";

import { defaultBackgroundUrl } from "./defaultBackground";

export { defaultBackgroundUrl } from "./defaultBackground";

// no character data
export const initialSettings: Settings = {
  backgroundColor: "#ababab",
  charsheetBackColor: "#ffffff",
  charsheetBackImage_v2: defaultBackgroundUrl,
  charsheetBackMode: "charsheet-image",
  // new customization
  charsheetTextColor: "#000000",
  sidebarColor: "#e5e7eb",
  sidebarTextColor: "#111827",
  charsheetBorderVisible: true,
  charsheetFontSize: 100,
  charsheetBackOpacity: 100,
  backgroundImage: "",
  sidebarOpacity: 100,
};
