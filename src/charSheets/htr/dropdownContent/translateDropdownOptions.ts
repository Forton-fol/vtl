import { StateStore } from "../../root/services/store";
import {
  archetypeOptionsRu,
  archetypeOptionsEn,
  edgeOptionsRu,
  edgeOptionsEn,
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

  const fromEdges = prevLanguage === "ru" ? edgeOptionsRu : edgeOptionsEn;
  const toEdges = lng === "ru" ? edgeOptionsRu : edgeOptionsEn;

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

  // Translate starting virtue (edge)
  if ((profile as any).startingVirtue) {
    const translated = translateValue((profile as any).startingVirtue, fromEdges, toEdges);
    if (translated !== (profile as any).startingVirtue) {
      setProfileItem("startingVirtue" as any, translated);
    }
  }
}
