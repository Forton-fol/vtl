import React, {
  useState,
  PropsWithChildren,
  useEffect,
  useReducer,
  useMemo,
  useContext,
} from "react";
import * as R from "ramda";

import { CharSheet, ErrorDescription } from "../domain";
import {
  getCharSheetFromLS,
  saveCharSheetInLS,
} from "../infrastructure/lsDbService";
import { strToCharSheet } from "../infrastructure/dbLoader";
import {
  CombinedRootService,
  ErrorDescriptionService,
} from "../application/ports";
import { CombinedGenericService } from "../../generic/application/ports";
import { CombinedCtDService } from "../../ctd/application/ports";
import { CombinedVtMService } from "../../vtm/application/ports";
import { CombinedMiscService } from "../../misc/application/ports";
import { miscActions } from "../../misc/services/actions";
import { genericActions } from "../../generic/services/actions";
import { vtmActions } from "../../vtm/services/actions";
import { ctdActions } from "../../ctd/services/actions";
import { hh2Actions } from "../../hh2/services/actions";
import { CombinedHH2Service } from "../../hh2/application/ports";
import { CombinedMtAService } from "../../mta/application/ports";
import { mtaActions } from "../../mta/services/actions";

import { initialCharSheet } from "./initialValues";
import { getLimits } from "./getLimits";
import { CompositeReducer } from "./CompositeReducer";
import { rootActions } from "./actions";

type TakeActions<Reducer> = Reducer extends CompositeReducer<any, infer T>
  ? T
  : never;

type TakeActionPairs<R extends { type: string; props: any }> = R extends unknown
  ? [R["type"], R["props"]]
  : never;

type MergeTuples<T extends { type: string; props: any }> = {
  [key in TakeActionPairs<T> as key[0]]: (...rest: key[1]) => void;
};

export interface StateStore
  extends CombinedRootService,
    CombinedGenericService,
    CombinedCtDService,
    CombinedVtMService,
    CombinedMiscService,
    CombinedHH2Service,
    CombinedMtAService,
    ErrorDescriptionService {}

// @ts-ignore
const StoreContext = React.createContext<StateStore>({
  ...initialCharSheet,
  errorDescription: null,
  limits: { bloodPerTurnLimit: 1, bloodpool: 20, parameterLimit: 5 },
});
export const useStore = () => useContext(StoreContext);

interface ProviderProps {}

const reducer = new CompositeReducer<CharSheet>()
  .assign(rootActions)
  .assign(miscActions)
  .assign(genericActions)
  .assign(vtmActions)
  .assign(ctdActions)
  .assign(hh2Actions)
  .assign(mtaActions);

export const Provider: React.FC<PropsWithChildren<ProviderProps>> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  const [charSheet, dispatch] = useReducer(reducer.reduce, initialCharSheet);

  const limits = useMemo(() => {
    return getLimits(charSheet);
  }, [charSheet.preset, charSheet.profile.generation]);

  useEffect(() => {
    dispatch({
      type: "setState",
      props: ["bloodPerTurn", String(limits.bloodPerTurnLimit)],
    });
  }, [limits.bloodPerTurnLimit]);

  useEffect(() => {
    saveCharSheetInLS(charSheet);
  }, [charSheet]);

  const [errorDescription, setErrorDescription] =
    useState<ErrorDescription | null>(null);

  const functions = useMemo(() => {
    return Object.keys(reducer.actionMap).reduce(
      (acc, el) => {
        // @ts-ignore
        acc[el] = function (...rest: any[]) {
          // @ts-ignore
          dispatch({ type: el, props: [...rest] });
        };
        return acc;
      },
      {} as MergeTuples<TakeActions<typeof reducer>>,
    );
  }, [dispatch]);

  if (!initialized) {
    setInitialized(true);
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const queryString =
        hash && hash.indexOf("?") >= 0
          ? hash.substring(hash.indexOf("?"))
          : typeof window !== "undefined"
          ? window.location.search
          : "";
      const params = new URLSearchParams(queryString);
      const shared = params.get("shared");
      const sharedUrl = params.get("sharedUrl") || params.get("fileUrl");

      if (shared) {
        try {
          let s = shared.replace(/-/g, "+").replace(/_/g, "/");
          while (s.length % 4 !== 0) s += "=";
          const decoded = decodeURIComponent(escape(atob(s)));
          const cs = strToCharSheet(decoded);
          functions.setCharSheet(cs);
        } catch (err) {
          console.error("Failed to parse shared charsheet", err);
          setErrorDescription({
            title: "Error loading shared character",
            text: "Unable to parse shared character data",
          });
        }
      } else if (sharedUrl) {
        fetch(sharedUrl)
          .then((resp) => resp.text())
          .then((text) => {
            try {
              const cs = strToCharSheet(text);
              functions.setCharSheet(cs);
            } catch (err) {
              console.error("Failed to parse downloaded charsheet", err);
              setErrorDescription({
                title: "Error loading shared character",
                text: "Unable to parse downloaded character data",
              });
            }
          })
          .catch((err) => {
            console.error("Failed to fetch shared charsheet", err);
            setErrorDescription({
              title: "Error loading shared character",
              text: "Unable to download shared character data",
            });
          });
      } else {
        const cs = getCharSheetFromLS();
        if (cs !== null) {
          functions.setCharSheet(cs);
        }
      }
    } catch (err) {
      console.error("Error while checking shared URL params", err);
      const cs = getCharSheetFromLS();
      if (cs !== null) {
        functions.setCharSheet(cs);
      }
    }
  }

  const value: StateStore = {
    ...charSheet,
    ...functions,

    limits,

    charSheet,
    errorDescription,
    setErrorDescription,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
