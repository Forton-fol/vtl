import { LS_KEY } from "../constants";
import { CharSheet } from "../charSheets/root/domain";

export interface LibraryEntry {
  id: string;
  name: string;
  preset: string;
  createdAt: string; // ISO
  raw: any;
}

const LIB_KEY = `${LS_KEY}_library`;

function readLibrary(): LibraryEntry[] {
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
  localStorage.setItem(LIB_KEY, JSON.stringify(entries));
}

export function listLibrary(): LibraryEntry[] {
  return readLibrary();
}

export function saveToLibrary(charSheet: CharSheet) {
  const entries = readLibrary();
  const id = `${charSheet.preset}_${charSheet.profile.name}_${Date.now()}`;
  const entry: LibraryEntry = {
    id,
    name: charSheet.profile.name || "",
    preset: charSheet.preset || "",
    createdAt: new Date().toISOString(),
    raw: charSheet,
  };
  entries.unshift(entry);
  writeLibrary(entries);
  return entry;
}

export function removeFromLibrary(id: string) {
  const entries = readLibrary().filter((e) => e.id !== id);
  writeLibrary(entries);
}

export function getLibraryEntry(id: string): LibraryEntry | undefined {
  return readLibrary().find((e) => e.id === id);
}
