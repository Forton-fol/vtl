import { CharSheet } from "../../root/domain";
import { mutateObj } from "../../../lib/miscUtils";
import { CombinedHTRService } from "../application/ports";
import { Edge } from "../domain";

type ServiceToActions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => void ? K : never]: (
    state: CharSheet,
    args: T[K] extends (...args: infer P) => void ? P : never
  ) => CharSheet;
};

export const htrActions: ServiceToActions<CombinedHTRService> = {
  // Edges
  addEdge(state: CharSheet): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdge: Edge = { name: "", creed: "", level: 0, trigger: "" };
    return mutateObj(state, "edges" as any, [...edges, newEdge]);
  },

  removeEdge(state: CharSheet, [index]: [number]): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdges = edges.filter((_, i) => i !== index);
    return mutateObj(state, "edges" as any, newEdges);
  },

  setEdgeName(state: CharSheet, [index, name]: [number, string]): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdges = edges.map((edge, i) =>
      i === index ? { ...edge, name } : edge
    );
    return mutateObj(state, "edges" as any, newEdges);
  },

  setEdgeCreed(state: CharSheet, [index, creed]: [number, string]): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdges = edges.map((edge, i) =>
      i === index ? { ...edge, creed } : edge
    );
    return mutateObj(state, "edges" as any, newEdges);
  },

  setEdgeLevel(state: CharSheet, [index, level]: [number, number]): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdges = edges.map((edge, i) =>
      i === index ? { ...edge, level } : edge
    );
    return mutateObj(state, "edges" as any, newEdges);
  },

  setEdgeTrigger(state: CharSheet, [index, trigger]: [number, string]): CharSheet {
    const edges = ((state as any).edges || []) as Edge[];
    const newEdges = edges.map((edge, i) =>
      i === index ? { ...edge, trigger } : edge
    );
    return mutateObj(state, "edges" as any, newEdges);
  },

  // Virtues
  setMercyBase(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, mercyBase: value };
    return mutateObj(state, "state", newState);
  },

  setMercyTemp(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, mercyTemp: value };
    return mutateObj(state, "state", newState);
  },

  setVisionBase(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, visionBase: value };
    return mutateObj(state, "state", newState);
  },

  setVisionTemp(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, visionTemp: value };
    return mutateObj(state, "state", newState);
  },

  setZealBase(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, zealBase: value };
    return mutateObj(state, "state", newState);
  },

  setZealTemp(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, zealTemp: value };
    return mutateObj(state, "state", newState);
  },

  setConviction(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, conviction: value };
    return mutateObj(state, "state", newState);
  },

  setConvictionPool(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, convictionPool: value };
    return mutateObj(state, "state", newState);
  },
};
