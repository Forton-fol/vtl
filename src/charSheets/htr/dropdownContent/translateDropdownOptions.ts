import { StateStore } from "../../root/services/store";
import {
  archetypeOptionsRu,
  archetypeOptionsEn,
  creedOptionsRu,
  creedOptionsEn,
} from "./resources/optionsSources";

function translateValue(
  value: string,
  fromOptions: string[],
  toOptions: string[]
): string {
  const index = fromOptions.indexOf(value);
  if (index !== -1 && index < toOptions.length) {
    return toOptions[index];
  }
  return value;
}

export function translateDropdownOptions(
  store: StateStore,
  prevLanguage: string,
  lng: string
): void {
  const { profile, setProfileItem } = store;

  const fromArchetypes = prevLanguage === "ru" ? archetypeOptionsRu : archetypeOptionsEn;
  const toArchetypes = lng === "ru" ? archetypeOptionsRu : archetypeOptionsEn;

  const fromCreeds = prevLanguage === "ru" ? creedOptionsRu : creedOptionsEn;
  const toCreeds = lng === "ru" ? creedOptionsRu : creedOptionsEn;

  // Translate nature
  if (profile.nature) {
    const translated = translateValue(profile.nature, fromArchetypes, toArchetypes);
    if (translated !== profile.nature) {
      setProfileItem("nature", translated);
    }
  }

  // Translate demeanor
  if (profile.demeanor) {
    const translated = translateValue(profile.demeanor, fromArchetypes, toArchetypes);
    if (translated !== profile.demeanor) {
      setProfileItem("demeanor", translated);
    }
  }

  // Translate creed
  if ((profile as any).creed) {
    const translated = translateValue((profile as any).creed, fromCreeds, toCreeds);
    if (translated !== (profile as any).creed) {
      setProfileItem("creed" as any, translated);
    }
  }
}
