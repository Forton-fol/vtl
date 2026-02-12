import {
  CommonProfile,
  CommonState,
  NameStringArray,
} from "../../generic/domain";

export interface DemonProfile extends CommonProfile {
  nature: string;
  demeanor: string;
  concept: string;
  house: string;
  faction: string;
  visage: string;
}

export interface DemonState extends CommonState {
  // Вера (Faith) — рейтинг и пул
  faithRating: number;
  faithPool: number;
  // Мука (Torment) — постоянная и временная
  tormentPermanent: number;
  tormentTemporary: number;
}

export type DemonBackgrounds = NameStringArray;
export type Lores = NameStringArray;
