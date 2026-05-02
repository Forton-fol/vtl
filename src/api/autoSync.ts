import { getToken } from "./auth";
import { saveCharacter, listCharacters, getCharacter } from "./characters";
import { CharSheet } from "../charSheets/root/domain";

const SYNC_DEBOUNCE_MS = 3000; // 3 seconds after last change
const SERVER_ID_PREFIX = "vtm_server_id_"; // per-sheetId server mapping

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isSyncing = false;
let lastSyncedJson = "";
let lastSyncedSheetId = "";

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

/** Get server-side character ID mapped to a specific sheetId */
function getServerIdForSheet(sheetId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SERVER_ID_PREFIX + sheetId);
}

/** Store server-side character ID for a specific sheetId */
function setServerIdForSheet(sheetId: string, serverId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SERVER_ID_PREFIX + sheetId, serverId);
}

async function doSave(charSheet: CharSheet): Promise<void> {
  if (isSyncing) return;
  const token = getToken();
  if (!token) return;
  const sheetId = charSheet.sheetId;
  if (!sheetId) return;

  const json = JSON.stringify(charSheet);
  // Skip if nothing changed for this exact sheet
  if (json === lastSyncedJson && sheetId === lastSyncedSheetId) return;

  isSyncing = true;
  notifyStatus("saving");

  try {
    const serverId = getServerIdForSheet(sheetId);
    const payload: any = {
      name: charSheet.profile?.name || "",
      preset: charSheet.preset || "",
      data: charSheet,
    };
    if (serverId) {
      payload.id = serverId; // update existing server record
    }

    const res = await saveCharacter(payload);

    if (res && res.character) {
      lastSyncedJson = json;
      lastSyncedSheetId = sheetId;
      // Remember the server-side ID for this sheetId
      if (res.character.id) {
        setServerIdForSheet(sheetId, res.character.id);
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
    const res = await listCharacters({ limit: 1 });
    if (res && res.characters && res.characters.length > 0) {
      const latestMeta = res.characters[0]; // sorted by updated_at DESC
      const detail = await getCharacter(latestMeta.id);
      const latest = detail?.character;
      if (latest?.data) {
        // Map server ID to sheetId if available
        const sheetId = latest.data.sheetId;
        if (sheetId && latest.id) {
          setServerIdForSheet(sheetId, latest.id);
        }
        lastSyncedJson = JSON.stringify(latest.data);
        lastSyncedSheetId = sheetId || "";
        setCharSheet(latest.data);
        return true;
      }
    }
  } catch (err) {
    console.error("Auto-sync load error", err);
  }
  return false;
}
