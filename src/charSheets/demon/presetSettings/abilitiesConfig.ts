import { AbilitiesConfig } from "../../root/domain";
import { DemonAbilities } from "../domain/abilities";

type AbilitiesT = keyof DemonAbilities;

export const talentsArr: AbilitiesT[] = [
  "alertness",
  "athletics",
  "awareness",
  "brawl",
  "dodge",
  "empathy",
  "expression",
  "intimidation",
  "intuition",
  "leadership",
  "streetwise",
  "subterfuge",
];

export const skillsArr: AbilitiesT[] = [
  "animalken",
  "crafts",
  "demolitions",
  "drive",
  "etiquette",
  "firearms",
  "melee",
  "performance",
  "security",
  "stealth",
  "survival",
  "technology",
];

export const knowledgesArr: AbilitiesT[] = [
  "academics",
  "computer",
  "finance",
  "investigation",
  "law",
  "linguistics",
  "medicine",
  "occult",
  "politics",
  "religion",
  "research",
  "science",
];

export const abilitiesConfig: AbilitiesConfig = [
  {
    header: "talents",
    items: talentsArr,
    extension: "talent",
  },
  {
    header: "skills",
    items: skillsArr,
    extension: "skill",
  },
  {
    header: "knowledges",
    items: knowledgesArr,
    extension: "knowledge",
  },
];
