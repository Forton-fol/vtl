import { LS_KEY } from "../../../../constants";
import { CharSheet } from "../../domain/charSheet";
import { charSheetToJson, strToCharSheet } from "../dbLoader";

/** localStorage key for a specific sheet */
function sheetLsKey(sheetId: string): string {
  return `${LS_KEY}_sheet_${sheetId}`;
}

/** Key that remembers which sheetId is currently active */
const ACTIVE_SHEET_KEY = `${LS_KEY}_active_sheet`;

export function getActiveSheetId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_SHEET_KEY);
}

export function setActiveSheetId(sheetId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_SHEET_KEY, sheetId);
}

export function saveCharSheetInLS(charSheet: CharSheet): void {
  if (typeof window === 'undefined') return;
  const id = charSheet.sheetId;
  if (!id) return; // no sheetId — cannot save

  const serverDbForJson = charSheetToJson(charSheet);
  localStorage.setItem(sheetLsKey(id), JSON.stringify(serverDbForJson));
  setActiveSheetId(id);
}

export function getCharSheetFromLS(sheetId?: string): CharSheet | null {
  if (typeof window === 'undefined') return null;

  const id = sheetId || getActiveSheetId();
  if (!id) {
    // fallback: try legacy single-key storage
    return getCharSheetFromLSLegacy();
  }

  const str = localStorage.getItem(sheetLsKey(id));
  if (str === null) {
    // if requested specific id not found, try legacy
    if (!sheetId) return getCharSheetFromLSLegacy();
    return null;
  }
  try {
    const cs = strToCharSheet(str);
    cs.sheetId = id;
    return cs;
  } catch (error) {
    console.log("Ошибка разбора данных из local storage", id, error);
  }
  return null;
}

/** Read from old single-key format for backward compatibility */
function getCharSheetFromLSLegacy(): CharSheet | null {
  const str = localStorage.getItem(LS_KEY);
  if (str === null) return null;
  try {
    return strToCharSheet(str);
  } catch (error) {
    console.log("Ошибка разбора данных из legacy local storage", error);
  }
  return null;
}

export function getSavedCharSheetString(): string | null {
  if (typeof window === 'undefined') return null;
  const activeId = getActiveSheetId();
  if (activeId) {
    const str = localStorage.getItem(sheetLsKey(activeId));
    if (str !== null) return str;
  }
  return localStorage.getItem(LS_KEY);
}

export function clearSavedCharSheetStorage(): void {
  if (typeof window === 'undefined') return;
  const activeId = getActiveSheetId();
  if (activeId) {
    localStorage.removeItem(sheetLsKey(activeId));
    localStorage.removeItem(ACTIVE_SHEET_KEY);
  }
  localStorage.removeItem(LS_KEY);
}

export function removeCharSheetFromLS(sheetId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(sheetLsKey(sheetId));
}
