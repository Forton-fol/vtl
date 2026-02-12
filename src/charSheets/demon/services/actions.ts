import { applyRange, mutateObj } from "../../../lib/miscUtils";
import { CharSheet } from "../../root/domain";
import { getLimits } from "../../root/services/public";
import { CombinedDemonService } from "../application/ports";

type ServiceToActions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => void ? K : never]: (
    state: CharSheet,
    args: T[K] extends (...args: infer P) => void ? P : never
  ) => CharSheet;
};

export const demonActions: ServiceToActions<CombinedDemonService> = {
  // Lores
  addLore(state: CharSheet): CharSheet {
    return mutateObj(state, "lores", [...state.lores, { name: "", value: 0 }]);
  },

  removeLore(state: CharSheet, [index]: [number]): CharSheet {
    return mutateObj(
      state,
      "lores",
      state.lores.filter((_, i) => i !== index)
    );
  },

  setLoreName(state: CharSheet, [index, name]: [number, string]): CharSheet {
    const newLores = state.lores.map((lore, i) =>
      i === index ? { ...lore, name } : lore
    );
    return mutateObj(state, "lores", newLores);
  },

  setLoreValue(state: CharSheet, [index, value]: [number, number]): CharSheet {
    const limits = getLimits(state);
    const newLores = state.lores.map((lore, i) =>
      i === index
        ? { ...lore, value: applyRange(0, limits.parameterLimit, value) }
        : lore
    );
    return mutateObj(state, "lores", newLores);
  },

  // Faith
  setFaithRating(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, faithRating: applyRange(0, 10, value) };
    return mutateObj(state, "state", newState);
  },

  setFaithPool(state: CharSheet, [value]: [number]): CharSheet {
    const newState = { ...state.state, faithPool: applyRange(0, 10, value) };
    return mutateObj(state, "state", newState);
  },

  // Torment
  setTormentPermanent(state: CharSheet, [value]: [number]): CharSheet {
    const newState = {
      ...state.state,
      tormentPermanent: applyRange(0, 10, value),
    };
    return mutateObj(state, "state", newState);
  },

  setTormentTemporary(state: CharSheet, [value]: [number]): CharSheet {
    const newState = {
      ...state.state,
      tormentTemporary: applyRange(0, 10, value),
    };
    return mutateObj(state, "state", newState);
  },
};
