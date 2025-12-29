import {
  CommonProfile,
  CommonState,
  NameStringArray,
} from "../../generic/domain";

export interface HTRProfile extends CommonProfile {
  nature: string;
  demeanor: string; // Маска
  concept: string;
  creed: string; // Кредо
  startingVirtue: string; // Нач. Добродетель
  startingConviction: string; // Нач. Убеждённость
}

export interface HTRState extends CommonState {
  // Добродетели (Virtues)
  mercyBase: number; // Милосердие
  mercyTemp: number;
  visionBase: number; // Прозрение
  visionTemp: number;
  zealBase: number; // Рвение
  zealTemp: number;
  // Убеждённость (Conviction)
  conviction: number;
  convictionPool: number; // временный пул до 100
}

// Грани (Edges)
export interface Edge {
  name: string;
  creed: string;
  level: number;
  trigger: string;
}

export type Edges = Edge[];

// Дополнение (Backgrounds) - используем стандартный NameStringArray
export type HTRBackgrounds = NameStringArray;
