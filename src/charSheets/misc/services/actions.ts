import { CharsheetBackMode } from "../../misc/domain";
import { mutateObj } from "../../../lib/miscUtils";
import { CombinedMiscService } from "../application/ports";
import { ServiceToActions } from "../../root/services/public";
import { CharSheet } from "../../root/domain";

export const miscActions: ServiceToActions<CombinedMiscService> = {
  setBackgroundColor(state: CharSheet, [backgroundColor]: [string]): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "backgroundColor", backgroundColor)
    );
  },
  setCharsheetBackColor(
    state: CharSheet,
    [charsheetBackColor]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetBackColor", charsheetBackColor)
    );
  },
  setCharsheetBackImage(
    state: CharSheet,
    [charsheetBackImage_v2]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetBackImage_v2", charsheetBackImage_v2)
    );
  },
  setCharsheetBackMode(
    state: CharSheet,
    [charsheetBackMode]: [CharsheetBackMode]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetBackMode", charsheetBackMode)
    );
  },
  setCharsheetTextColor(
    state: CharSheet,
    [color]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetTextColor", color)
    );
  },
  setSidebarColor(
    state: CharSheet,
    [color]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "sidebarColor", color)
    );
  },
  setSidebarTextColor(
    state: CharSheet,
    [color]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "sidebarTextColor", color)
    );
  },
  setCharsheetBorderVisible(
    state: CharSheet,
    [visible]: [boolean]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetBorderVisible", visible)
    );
  },
  setCharsheetFontSize(
    state: CharSheet,
    [size]: [number]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetFontSize", size)
    );
  },
  setCharsheetBackOpacity(
    state: CharSheet,
    [opacity]: [number]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "charsheetBackOpacity", opacity)
    );
  },
  setBackgroundImage(
    state: CharSheet,
    [image]: [string]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "backgroundImage", image)
    );
  },
  setSidebarOpacity(
    state: CharSheet,
    [opacity]: [number]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "sidebarOpacity", opacity)
    );
  },
  setShowSpecializations(
    state: CharSheet,
    [visible]: [boolean]
  ): CharSheet {
    return mutateObj(
      state,
      "settings",
      mutateObj(state.settings, "showSpecializations", visible)
    );
  },
};
