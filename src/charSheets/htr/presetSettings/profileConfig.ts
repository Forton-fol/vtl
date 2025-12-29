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
      name: "creed",
      optionsName: "creedOptions",
    },
    {
      name: "startingVirtue",
      optionsName: "startingVirtueOptions",
    },
    "startingConviction",
  ],
];
