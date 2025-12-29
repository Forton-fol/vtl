import { attributesConfig } from "../generic/presetSettings";
import { Preset } from "../types";

import { CharSheet } from "./CharSheet";
import { profileConfig } from "./presetSettings/profileConfig";
import { abilitiesConfig } from "./presetSettings/abilitiesConfig";
import { freebiePointsConfig } from "./presetSettings/freebiePoints";
import { getDropdownOptions } from "./dropdownContent";
import { translateDropdownOptions } from "./dropdownContent/translateDropdownOptions";

export const HTR: Preset = {
  displayName: "HTR",
  attributesConfig,
  profileConfig,
  abilitiesConfig,

  CharSheet,
  freebiePointsConfig,
  getDropdownOptions,
  translateDropdownOptions,
};
