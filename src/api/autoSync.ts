import { getToken } from "./auth";
import { saveCharacter, listCharacters } from "./characters";
import { CharSheet } from "../charSheets/root/domain";

const SYNC_DEBOUNCE_MS = 3000; // 3 seconds after last change
const ACTIVE_CHAR_KEY = "vtm_active_char_id";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isSyncing = false;
let lastSyncedJson = "";

type SyncStatusListener = (status: SyncStatus) => void;

export type SyncStatus = "idle" | "saving" | "saved" | "error";

let statusListeners: SyncStatusListener[] = [];

function notifyStatus(status: SyncStatus) {
  statusListeners.forEach((fn) => fn(status));
}

export function onSyncStatus(listener: SyncStatusListener): () => void {
  statusListeners.push(listener);
  return () => {
    statusListeners = statusListeners.filter((fn) => fn !== listener);
  };
}

export function getActiveCharId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_CHAR_KEY);
}

export function setActiveCharId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_CHAR_KEY, id);
}

export function clearActiveCharId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_CHAR_KEY);
}

async function doSave(charSheet: CharSheet): Promise<void> {
  if (isSyncing) return;
  const token = getToken();
  if (!token) return;

  const json = JSON.stringify(charSheet);
  if (json === lastSyncedJson) return; // nothing changed

  isSyncing = true;
  notifyStatus("saving");

  try {
    const activeId = getActiveCharId();
    const payload: any = {
      name: charSheet.profile?.name || "",
      preset: charSheet.preset || "",
      data: charSheet,
    };
    if (activeId) {
      payload.id = activeId;
    }

    const res = await saveCharacter(payload);

    if (res && res.character) {
      lastSyncedJson = json;
      if (!activeId && res.character.id) {
        setActiveCharId(res.character.id);
      }
      notifyStatus("saved");
    } else {
      notifyStatus("error");
    }
  } catch (err) {
    console.error("Auto-sync save error", err);
    notifyStatus("error");
  } finally {
    isSyncing = false;
  }
}

export function scheduleSave(charSheet: CharSheet): void {
  const token = getToken();
  if (!token) return;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    doSave(charSheet);
  }, SYNC_DEBOUNCE_MS);
}

export async function loadFromServer(
  setCharSheet: (cs: CharSheet) => void,
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await listCharacters();
    if (res && res.characters && res.characters.length > 0) {
      const latest = res.characters[0]; // already sorted by created_at DESC
      if (latest.data) {
        setActiveCharId(latest.id);
        lastSyncedJson = JSON.stringify(latest.data);
        setCharSheet(latest.data);
        return true;
      }
    }
  } catch (err) {
    console.error("Auto-sync load error", err);
  }
  return false;
}
