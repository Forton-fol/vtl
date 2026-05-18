import * as R from "ramda";
import { useStore } from "../../root/services/store";
import { SettingsService } from "../application/ports";

export function useSettings(): SettingsService {
  return R.pick(
    [
      "settings",
      "setSiteTheme",
      "setBackgroundColor",
      "setCharsheetBackColor",
      "setCharsheetBackImage",
      "setCharsheetBackMode",
      "setCharsheetTextColor",
      "setSidebarColor",
      "setSidebarTextColor",
      "setCharsheetBorderVisible",
      "setCharsheetFontSize",
      "setCharsheetBackOpacity",
      "setBackgroundImage",
      "setSidebarOpacity",
      "setShowSpecializations",
    ],
    useStore()
  );
}
