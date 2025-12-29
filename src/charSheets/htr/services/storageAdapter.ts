import * as R from "ramda";

import { useStore } from "../../root/services/store";
import { EdgesService, HTRVirtuesService } from "../application/ports";

export function useEdges(): EdgesService {
  return R.pick(
    [
      "edges",
      "addEdge",
      "removeEdge",
      "setEdgeName",
      "setEdgeCreed",
      "setEdgeLevel",
      "setEdgeTrigger",
    ],
    useStore()
  );
}

export function useHTRVirtues(): HTRVirtuesService {
  return R.pick(
    [
      "state",
      "setMercyBase",
      "setMercyTemp",
      "setVisionBase",
      "setVisionTemp",
      "setZealBase",
      "setZealTemp",
      "setConviction",
      "setConvictionPool",
    ],
    useStore()
  );
}
