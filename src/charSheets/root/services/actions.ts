import { CharSheet, PresetName } from "../domain";
import { mutateObj } from "../../../lib/miscUtils";
import { CombinedRootService } from "../application/ports";

import { ServiceToActions } from "./types";

export const rootActions: ServiceToActions<CombinedRootService> = {
  setCharSheet(state: CharSheet, [newState]: [CharSheet]): CharSheet {
    return {
      ...newState,
    };
  },

  setPreset(state: CharSheet, [preset]: [PresetName]): CharSheet {
    return mutateObj(state, "preset", preset);
  },
  setCustomDot(
    state: CharSheet,
    [sectionKey, itemIndex, dotIndex, payload]: [string, number | string, number | string, { kind: "link" | "text"; content: string }]
  ): CharSheet {
    const sec = String(sectionKey);
    const item = String(itemIndex);
    const dot = String(dotIndex);
    const existing = state.customDotData || {};
    const section = existing[sec] ? { ...existing[sec] } : {};
    section[item] = { ...(section[item] || {}), [dot]: payload } as any;
    const next = { ...existing, [sec]: section } as any;
    return mutateObj(state, "customDotData", next);
  },
};
