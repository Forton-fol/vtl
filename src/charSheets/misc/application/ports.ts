import { CharsheetBackMode, Settings, SiteTheme } from "../domain";

export interface CombinedMiscService extends SettingsService {}

export interface SettingsService {
  settings: Settings;
  setSiteTheme(theme: SiteTheme): void;
  setBackgroundColor(backgroundColor: string): void;
  setCharsheetBackColor(charsheetBackColor: string): void;
  setCharsheetBackImage(charsheetBackImage: string): void;
  setCharsheetBackMode(charsheetBackMode: CharsheetBackMode): void;
  setCharsheetTextColor(color: string): void;
  setSidebarColor(color: string): void;
  setSidebarTextColor(color: string): void;
  setCharsheetBorderVisible(visible: boolean): void;
  setCharsheetFontSize(size: number): void;
  setCharsheetBackOpacity(opacity: number): void;
  setBackgroundImage(image: string): void;
  setSidebarOpacity(opacity: number): void;
  setShowSpecializations(visible: boolean): void;
}
