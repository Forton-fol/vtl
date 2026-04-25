import { attributesConfig } from "../generic/presetSettings";
import { Preset } from "../types";

import { CheckList } from "../vtm/checkListUi";
import { freebiePointsConfig } from "../vtm/presetSettings/freebiePoints";
import { experiencePointsConfig } from "../vtm/presetSettings/experiencePoints";
import { abilitiesConfig } from "./presetSettings/abilitiesConfig";
import { attributesConfig } from "./presetSettings/attributesConfig";
import { profileConfig } from "./presetSettings/profileConfig";
import { CharSheet } from "./CharSheet";
import { getDropdownOptions } from "../vtm/dropdownContent";
import { translateDropdownOptions } from "../vtm/dropdownContent/translateDropdownOptions";

export const VtM_v5: Preset = {
  displayName: "VtM V5",
  profileConfig,
  attributesConfig,
  abilitiesConfig,
  freebiePointsConfig,
  experiencePointsConfig,
  CheckList,
  CharSheet,
  getDropdownOptions,
  translateDropdownOptions,
};