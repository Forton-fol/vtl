import { Lores } from "../domain";
import { State } from "../../root/domain";

export interface CombinedDemonService extends LoresService, DemonStatusService {}

export interface LoresService {
  lores: Lores;
  addLore(): void;
  removeLore(index: number): void;
  setLoreName(index: number, name: string): void;
  setLoreValue(index: number, value: number): void;
}

export interface DemonStatusService {
  state: State;
  setFaithRating(value: number): void;
  setFaithPool(value: number): void;
  setTormentPermanent(value: number): void;
  setTormentTemporary(value: number): void;
}
