import { Edges } from "../domain";
import { State } from "../../root/domain";

export interface CombinedHTRService extends EdgesService, HTRVirtuesService {}

export interface EdgesService {
  edges: Edges;
  addEdge(): void;
  removeEdge(index: number): void;
  setEdgeName(index: number, name: string): void;
  setEdgeCreed(index: number, creed: string): void;
  setEdgeLevel(index: number, level: number): void;
  setEdgeTrigger(index: number, trigger: string): void;
}

export interface HTRVirtuesService {
  state: State;
  setMercyBase(value: number): void;
  setMercyTemp(value: number): void;
  setVisionBase(value: number): void;
  setVisionTemp(value: number): void;
  setZealBase(value: number): void;
  setZealTemp(value: number): void;
  setConviction(value: number): void;
  setConvictionPool(value: number): void;
}
