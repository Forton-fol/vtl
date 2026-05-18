import { SiteTheme } from "../domain";

export interface ThemeVisualSettings {
  backgroundColor: string;
  charsheetBackColor: string;
  charsheetTextColor: string;
  sidebarColor: string;
  sidebarTextColor: string;
}

export const themeVisualSettings: Record<SiteTheme, ThemeVisualSettings> = {
  dark: {
    backgroundColor: "#050708",
    charsheetBackColor: "#070a0c",
    charsheetTextColor: "#d8d0c5",
    sidebarColor: "#080b0d",
    sidebarTextColor: "#d8d0c5",
  },
  light: {
    backgroundColor: "#d8bd87",
    charsheetBackColor: "#ead8b2",
    charsheetTextColor: "#2f2418",
    sidebarColor: "#ead8b2",
    sidebarTextColor: "#2f2418",
  },
  neutral: {
    backgroundColor: "#efede8",
    charsheetBackColor: "#fbfaf7",
    charsheetTextColor: "#252422",
    sidebarColor: "#fbfaf7",
    sidebarTextColor: "#252422",
  },
};

export function getThemeVisualSettings(theme: SiteTheme): ThemeVisualSettings {
  return themeVisualSettings[theme] || themeVisualSettings.neutral;
}
