import { attributesConfig } from "../generic/presetSettings";
import { Preset } from "../types";

import { CharSheet } from "./CharSheet";
import { abilitiesConfig } from "./presetSettings/abilitiesConfig";
import { profileConfig } from "./presetSettings/profileConfig";
import { freebiePointsConfig } from "../htr/presetSettings/freebiePoints";
import { getDropdownOptions, translateDropdownOptions } from "./dropdownContent";

export const Demon: Preset = {
  displayName: "Демон: Падшие",
  profileConfig,
  attributesConfig,
  abilitiesConfig,
  freebiePointsConfig,
  CharSheet,
  getDropdownOptions,
  translateDropdownOptions,
};

export default Demon;
