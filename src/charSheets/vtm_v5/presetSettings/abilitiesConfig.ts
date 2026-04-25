import { Abilities, AbilitiesConfig } from "../../root/domain";

type AbilitiesT = keyof Abilities;

export const physicalAbilitiesArr: AbilitiesT[] = [
  "athletics",
  "drive",
  "larceny",
  "survival",
  "brawl",
  "crafts",
  "stealth",
  "firearms",
  "melee",
];

export const socialAbilitiesArr: AbilitiesT[] = [
  "intimidation",
  "performance",
  "leadership",
  "animalken",
  "empathy",
  "expression",
  "streetwise",
  "subterfuge",
  "etiquette",
];

export const mentalAbilitiesArr: AbilitiesT[] = [
  "academics",
  "science",
  "medicine",
  "awareness",
  "occult",
  "politics",
  "investigation",
  "technology",
  "finance",
];

export const abilitiesConfig: AbilitiesConfig = [
  {
    header: "physical",
    items: physicalAbilitiesArr,
    extension: "talent",
  },
  {
    header: "social",
    items: socialAbilitiesArr,
    extension: "skill",
  },
  {
    header: "mental",
    items: mentalAbilitiesArr,
    extension: "knowledge",
  },
];