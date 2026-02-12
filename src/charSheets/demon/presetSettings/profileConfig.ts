import { ProfileConfig } from "../../root/domain";

export const profileConfig: ProfileConfig = [
  ["name", "player", "chronicle"],
  [
    {
      name: "nature",
      optionsName: "archetypeOptions",
    },
    {
      name: "demeanor",
      optionsName: "archetypeOptions",
    },
    "concept",
  ],
  [
    {
      name: "house",
      optionsName: "houseOptions",
    },
    {
      name: "faction",
      optionsName: "factionOptions",
    },
    "visage",
  ],
];
