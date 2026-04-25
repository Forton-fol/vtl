import { ruTranslation } from "../ruTranslation";

import { profile } from "./charsheet_profile";
import { attributes } from "./charsheet_attributes";
import { abilities } from "./charsheet_abilities";
import { advantages } from "./charsheet_advantages";
import { status } from "./charsheet_status";
import { checklist } from "./checklist";
import { freebiePoints } from "./freebiePoints";
import { experiencePoints } from "./experiencePoints";
import { actionMenu } from "./actionMenu";
import { about } from "./about";
import { darkPack } from "./darkPack";
import { instruction } from "./instruction";
import { register } from "./register";
import { library } from "./library";
import { charsheet_htr } from "./charsheet_htr";
import { v5 } from "./charsheet_v5";

type TranslationInfo = typeof ruTranslation;

export const enTranslation: TranslationInfo = {
  about,
  darkPack,
  checklist,
  freebiePoints,
  experiencePoints,
  randomizer: {
    header: "Randomizer",
    description: "Generate a random character following the rules of the current game line, or randomly spend freebie points.",
    randomCharacter: "Random Character",
    randomFreebiePoints: "Random Freebie Points",
    clanFilter: "Clans to randomize",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    settings: "Settings",
    attributePriority: "Attribute priority",
    abilityPriority: "Ability priority",
    priorityClanRecommended: "Clan recommended",
    priorityRandom: "Full random",
    priorityPhysical: "Physical",
    prioritySocial: "Social",
    priorityMental: "Mental",
    priorityTalents: "Talents",
    prioritySkills: "Skills",
    priorityKnowledges: "Knowledges",
    useClanFocus: "Clan attribute focus",
    useClanFocusHint: "More dots in clan-recommended attributes",
  },
  actionMenu,
  instruction,
  library,
  donate: {
    header: "Donate",
  },
  register,
  buttons: {
    "hide-panel": "Hide panel",
    "show-panel": "Show panel",
    "export-pdf": "Export PDF",
    "generating-pdf": "Generating PDF...",
  },
  errors: {
    "error-on-file-loading": "Error on file loading",
    "check-developer-console": "Check developer console",
  },
  sync: {
    saving: "Saving...",
    saved: "Saved",
    error: "Sync error",
  },
  "visual-settings": {
    header: "Visual Settings",
    "background-color": "Background color",
    "charsheet-background-mode": "Character sheet background",
    "charsheet-background-color": "Character sheet background color",
    "charsheet-background-image": "Character sheet background image",
    "to-default-background-image": "Image by default",

    "charsheet-image": "Image",
    "charsheet-none": "No background",
    "charsheet-color": "Color",

    "charsheet-text-color": "Sheet text color",
    "sidebar-settings": "Sidebar settings",
    "sidebar-color": "Sidebar color",
    "sidebar-text-color": "Sidebar text color",
    "charsheet-border-visible": "Show sheet border",
    "charsheet-font-size": "Font size",
    "charsheet-back-opacity": "Sheet opacity",
    "site-background-image": "Site background image",
    "remove-site-background-image": "Remove background image",
    "sidebar-opacity": "Sidebar opacity",
    "autosave-enabled": "Auto-save",
    "show-specializations": "Show specializations (4+ dots)",
    "recommended-size-site": "Recommended: 1920×1080 px, JPG/PNG/GIF",
    "recommended-size-sheet": "Recommended: 800×1200 px, JPG/PNG/GIF",
  },
  charsheet: {
    emptyName: "Nameless character",
    charsheet: "Character Sheet",
    "type-select": "Character sheet type",
    preset: {
      vampire_v20: "Vampire: The Masquerade. V20",
      vampire_da_v20: "Vampire: The Dark Ages. V20",
      changeling_v20: "Changeling: The Dreaming. V20",
      hunter_v20: "The Hunters Hunted II. V20",
      vampire_v3_revised: "Vampire: The Masquerade. V3 Revised",
      vampire_v5: "Vampire: The Masquerade. V5",
      mage_v20: "Mage: The Ascension. V20",
      hunter_reckoning: "Hunter: The Reckoning",
      demon_the_fallen: "Demon: The Fallen",
    },
    htr: charsheet_htr,
    profile,
    attributes,
    abilities,
    v5,
    advantages,
    status,
    notes: "Notes",
    goals: "Goals",
    charHistory: "History",
    appearanceDescription: "Appearance Description",
    characterImage: "Character Image",
    uploadCharacterImage: "Upload Character Image",
    alliesAndContacts: "Allies and Contacts",
    possessions: "Possessions",
  },
  common: {
    to: "to",
    ok: "OK",
    cancel: "Cancel",
    confirm: "Confirm",
    add: "Add",
    create: "Create",
    rename: "Rename",
    remove: "Remove",
    replace: "Replace",
    on: "on",
    "set-item-before": "Before '{0}'",
    "set-item-as-last": "To end",
  },
  // "overview": {
  //   'consistency-problem-detected': "Detected base corruption during consistency check. Please contact developer to fix problems.",
  //   'consistency-is-ok': 'Base consistency is ok.',
  // },
  // "instruction-tab": {
  //   'actions-n-possibilities': 'Actions and possibilities',
  //   'video': 'Video',
  // },
  // "utils": {
  //   "close-page-warning": "Be sure you save your data. After page closing all unsaved data will be lost.",
  //   "new-base-warning": "Are you sure about creating new database? All unsaved changes in current database will be lost.",
  //   "base-file-loading-error": "Base file loading error."
  // },
  // "log-viewer": {
  //   "page": "Page",
  //   "date": "Date",
  //   "user": "User",
  //   "action": "Action",
  //   "params": "Parameters",
  // },
};
