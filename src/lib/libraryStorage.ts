import { LS_KEY } from "../constants";
import { CharSheet } from "../charSheets/root/domain";
import { generateSheetId } from "./miscUtils";

export interface LibraryEntry {
  id: string;        // === sheetId (unique, never changes)
  name: string;
  preset: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const LIB_KEY = `${LS_KEY}_library`;

function readLibrary(): LibraryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(LIB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LibraryEntry[];
  } catch (e) {
    console.error("Failed to read library", e);
    return [];
  }
}

function writeLibrary(entries: LibraryEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIB_KEY, JSON.stringify(entries));
}

export function listLibrary(): LibraryEntry[] {
  return readLibrary();
}

/**
 * Ensure a library entry exists for the given charSheet.
 * If charSheet has no sheetId, one is generated and assigned.
 * Returns the (possibly updated) charSheet with sheetId guaranteed.
 */
export function ensureInLibrary(charSheet: CharSheet): CharSheet {
  if (!charSheet.sheetId) {
    charSheet = { ...charSheet, sheetId: generateSheetId() };
  }
  const id = charSheet.sheetId!;
  const entries = readLibrary();
  const existing = entries.find((e) => e.id === id);

  if (existing) {
    // update metadata
    existing.name = charSheet.profile.name || "";
    existing.preset = charSheet.preset || "";
    existing.updatedAt = new Date().toISOString();
    writeLibrary(entries);
  } else {
    // create new entry
    const entry: LibraryEntry = {
      id,
      name: charSheet.profile.name || "",
      preset: charSheet.preset || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    entries.unshift(entry);
    writeLibrary(entries);
  }
  return charSheet;
}

/** Save current charSheet to library (used for explicit "save to library" action). */
export function saveToLibrary(charSheet: CharSheet): LibraryEntry {
  const cs = ensureInLibrary(charSheet);
  const entries = readLibrary();
  return entries.find((e) => e.id === cs.sheetId)!;
}

export function removeFromLibrary(id: string) {
  const entries = readLibrary().filter((e) => e.id !== id);
  writeLibrary(entries);
}

export function getLibraryEntry(id: string): LibraryEntry | undefined {
  return readLibrary().find((e) => e.id === id);
}

/** Update just metadata (name/preset) for an existing entry */
export function updateLibraryMeta(sheetId: string, name: string, preset: string) {
  const entries = readLibrary();
  const entry = entries.find((e) => e.id === sheetId);
  if (entry) {
    entry.name = name;
    entry.preset = preset;
    entry.updatedAt = new Date().toISOString();
    writeLibrary(entries);
  }
}
