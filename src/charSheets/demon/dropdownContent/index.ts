import { demonKnowledgesRu } from "./resources/knowledges";
import { demonBackgroundsRu } from "./resources/backgrounds";
import { demonHousesRu, demonFactionsRu } from "./resources/housesAndFactions";
import { Options, DropdownOptions } from "../../root/domain";
import { StateStore } from "../../root/services/store";

// простые архетипы для nature/demeanor
const archetypeOptions: Options = [
  "Архетип",
  "Авангардист",
  "Бунтарь",
  "Воин",
  "Ребенок",
  "Творец",
  "Святой",
  "Отшельник",
];

export function getDropdownOptions(language: string): DropdownOptions {
  return {
    archetypeOptions,
    backgroundOptions: demonBackgroundsRu as Options,
    houseOptions: demonHousesRu as Options,
    factionOptions: demonFactionsRu as Options,
    loreOptions: demonKnowledgesRu as Options,
  };
}

export function useDropdownOptions() {
  const options = getDropdownOptions("ru");
  return {
    backgroundOptions: options.backgroundOptions,
    loreOptions: options.loreOptions,
  };
}

export function translateDropdownOptions(
  _store: StateStore,
  _prevLanguage: string,
  _lng: string
): void {
  // Demon currently only supports Russian dropdown options.
  // No translation needed.
}
