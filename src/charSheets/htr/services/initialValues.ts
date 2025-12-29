import { HTRProfile, HTRState, Edges, HTRAbilities } from "../domain";

export const initialHTRProfile: HTRProfile = {
  name: "",
  player: "",
  chronicle: "",
  nature: "",
  demeanor: "",
  concept: "",
  creed: "",
  startingVirtue: "",
  startingConviction: "",
};

export const initialHTRState: HTRState = {
  willpowerRating: 3,
  willpowerPool: 0,
  experience: "",
  mercyBase: 0,
  mercyTemp: 0,
  visionBase: 0,
  visionTemp: 0,
  zealBase: 0,
  zealTemp: 0,
  conviction: 0,
  convictionPool: 0,
};

export const initialEdges: Edges = [];

export const initialHTRAbilities: HTRAbilities = {
  // Common abilities
  alertness: 0,
  athletics: 0,
  brawl: 0,
  empathy: 0,
  expression: 0,
  intimidation: 0,
  leadership: 0,
  streetwise: 0,
  subterfuge: 0,
  awareness: 0,
  animalken: 0,
  crafts: 0,
  drive: 0,
  etiquette: 0,
  firearms: 0,
  melee: 0,
  performance: 0,
  stealth: 0,
  survival: 0,
  larceny: 0,
  academics: 0,
  computer: 0,
  finance: 0,
  investigation: 0,
  law: 0,
  medicine: 0,
  occult: 0,
  politics: 0,
  science: 0,
  technology: 0,
  // HTR-specific abilities
  dodge: 0,
  intuition: 0,
  cunning: 0,
  security: 0,
  fencing: 0,
  demolitions: 0,
  bureaucracy: 0,
  linguistics: 0,
  research: 0,
};
