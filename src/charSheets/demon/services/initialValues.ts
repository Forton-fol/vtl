import { DemonProfile, DemonState, Lores } from "../domain";
import { DemonAbilities } from "../domain/abilities";
import {
  initialCommonAbilities,
  initialCommonState,
  initialCommonProfile,
} from "../../generic/services/initialValues";

export const initialDemonProfile: DemonProfile = {
  ...initialCommonProfile,
  nature: "",
  demeanor: "",
  concept: "",
  house: "",
  faction: "",
  visage: "",
};

export const initialDemonState: DemonState = {
  ...initialCommonState,
  faithRating: 0,
  faithPool: 0,
  tormentPermanent: 0,
  tormentTemporary: 0,
};

export const initialDemonAbilities: DemonAbilities = {
  ...initialCommonAbilities,
  dodge: 0,
  intuition: 0,
  demolitions: 0,
  security: 0,
  linguistics: 0,
  religion: 0,
  research: 0,
};

export const initialLores: Lores = [];
