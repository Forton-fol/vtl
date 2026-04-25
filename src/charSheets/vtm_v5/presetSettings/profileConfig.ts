import { ProfileConfig } from "../../root/domain";

export const profileConfig: ProfileConfig = [
  ["name", "chronicle", "sire"],
  [
    {
      name: "concept",
      optionsName: "conceptOptions",
    },
    "age",
    "sex",
  ],
  [
    "player",
    {
      name: "clan",
      optionsName: "clanOptions",
    },
    {
      name: "generation",
      optionsName: "generationOptions",
    },
  ],
];