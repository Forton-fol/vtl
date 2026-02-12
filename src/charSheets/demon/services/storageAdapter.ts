import * as R from "ramda";

import { useStore } from "../../root/services/store";
import { LoresService, DemonStatusService } from "../application/ports";

export function useLores(): LoresService {
  return R.pick(
    ["lores", "addLore", "removeLore", "setLoreName", "setLoreValue"],
    useStore()
  );
}

export function useDemonStatus(): DemonStatusService {
  return R.pick(
    [
      "state",
      "setFaithRating",
      "setFaithPool",
      "setTormentPermanent",
      "setTormentTemporary",
    ],
    useStore()
  );
}
