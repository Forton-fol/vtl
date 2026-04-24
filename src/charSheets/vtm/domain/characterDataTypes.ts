import {
  CommonProfile,
  CommonState,
  NameStringArray,
} from "../../generic/domain";

export interface VtMProfile extends CommonProfile {
  nature: string;
  age: string;
  sex: string;
  demeanor: string;
  concept: string;
  clan: string;
  generation: string;
  sire: string;
}

export interface VtMState extends CommonState {
  // path
  humanity: number;
  pathName: string;
  bearingName: string;
  bearingModifier: string;
  // bloodpool
  bloodpool: number;
  bloodPerTurn: string;
  // other
  weakness: string;
  // V5 specific
  hunger?: number;
}

// Advantages
export type Disciplines = {
  name: string;
  value: number;
  subtitles?: string[];
}[];
export type DisciplinePaths = NameStringArray;
export type Rituals = {
  name: string;
  level: string;
}[];
