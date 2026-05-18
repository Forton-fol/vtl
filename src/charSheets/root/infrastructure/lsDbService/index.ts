import { LS_KEY } from "../../../../constants";
import { CharSheet } from "../../domain/charSheet";
import { charSheetToJson, strToCharSheet } from "../dbLoader";

/** localStorage key for a specific sheet */
function sheetLsKey(sheetId: string): string {
  return `${LS_KEY}_sheet_${sheetId}`;
}

/** Key that remembers which sheetId is currently active */
const ACTIVE_SHEET_KEY = `${LS_KEY}_active_sheet`;

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Unable to read localStorage", key, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Unable to write localStorage", key, error);
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Unable to remove localStorage item", key, error);
  }
}

export function getActiveSheetId(): string | null {
  if (typeof window === 'undefined') return null;
  return safeGetItem(ACTIVE_SHEET_KEY);
}

export function setActiveSheetId(sheetId: string): void {
  if (typeof window === 'undefined') return;
  safeSetItem(ACTIVE_SHEET_KEY, sheetId);
}

export function saveCharSheetInLS(charSheet: CharSheet): void {
  if (typeof window === 'undefined') return;
  const id = charSheet.sheetId;
  if (!id) return; // no sheetId — cannot save

  const serverDbForJson = charSheetToJson(charSheet);
  safeSetItem(sheetLsKey(id), JSON.stringify(serverDbForJson));
  setActiveSheetId(id);
}

export function getCharSheetFromLS(sheetId?: string): CharSheet | null {
  if (typeof window === 'undefined') return null;

  const id = sheetId || getActiveSheetId();
  if (!id) {
    // fallback: try legacy single-key storage
    return getCharSheetFromLSLegacy();
  }

  const str = safeGetItem(sheetLsKey(id));
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
  const str = safeGetItem(LS_KEY);
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
    const str = safeGetItem(sheetLsKey(activeId));
    if (str !== null) return str;
  }
  return safeGetItem(LS_KEY);
}

export function clearSavedCharSheetStorage(): void {
  if (typeof window === 'undefined') return;
  const activeId = getActiveSheetId();
  if (activeId) {
    safeRemoveItem(sheetLsKey(activeId));
    safeRemoveItem(ACTIVE_SHEET_KEY);
  }
  safeRemoveItem(LS_KEY);
}

export function removeCharSheetFromLS(sheetId: string): void {
  if (typeof window === 'undefined') return;
  safeRemoveItem(sheetLsKey(sheetId));
}
