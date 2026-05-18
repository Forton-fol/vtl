export type Version = string;

export type CharsheetBackMode =
  | "charsheet-image"
  | "charsheet-none"
  | "charsheet-color";

export type SiteTheme = "dark" | "light" | "neutral";

export interface Settings {
  siteTheme?: SiteTheme;
  backgroundColor: string;
  charsheetBackColor: string;
  charsheetBackImage_v2: string;
  charsheetBackMode: CharsheetBackMode;
  // new customization
  charsheetTextColor: string;
  sidebarColor: string;
  sidebarTextColor: string;
  charsheetBorderVisible: boolean;
  charsheetFontSize: number;
  charsheetBackOpacity: number;
  backgroundImage: string;
  sidebarOpacity: number;
  showSpecializations: boolean;
}
