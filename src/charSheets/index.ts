import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import { usePreset } from "../charSheets/root/services/storageAdapter";
import { useStore } from "../charSheets/root/services/store";

import { PresetName, InternalPresetProps, presetList } from "./root/domain";
import { ExternalPresetProps, Preset } from "./types";

type PresetSupportInfo = {
  displayName: string;
  hasCharSheet: boolean;
  hasDropdownOptions: boolean;
  hasCheckList: boolean;
  hasFreebiePoints: boolean;
};

const presetSupportInfo: Record<PresetName, PresetSupportInfo> = {
  vampire_v20: {
    displayName: "VtM V20",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  changeling_v20: {
    displayName: "Changeling the Dreaming",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  hunter_v20: {
    displayName: "Hunter the Reckoning",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  vampire_da_v20: {
    displayName: "VTM Dark Ages",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  vampire_v3_revised: {
    displayName: "VTM V3 Revised",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  vampire_v5: {
    displayName: "VTM V5",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  mage_v20: {
    displayName: "Mage the Ascension",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  hunter_reckoning: {
    displayName: "Hunter Reckoning",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
  demon_the_fallen: {
    displayName: "Demon the Fallen",
    hasCharSheet: true,
    hasDropdownOptions: true,
    hasCheckList: true,
    hasFreebiePoints: true,
  },
};

const presetCache: Partial<Record<PresetName, Preset>> = {};

const presetLoaders: Record<PresetName, () => Promise<Preset>> = {
  vampire_v20: () => import("./vtm").then((mod) => mod.VtM),
  changeling_v20: () => import("./ctd").then((mod) => mod.CtD),
  hunter_v20: () => import("./hh2").then((mod) => mod.HH2),
  vampire_da_v20: () => import("./vtda").then((mod) => mod.VtDA),
  vampire_v3_revised: () => import("./vtm_v3").then((mod) => mod.VtM_v3),
  vampire_v5: () => import("./vtm_v5").then((mod) => mod.VtM_v5),
  mage_v20: () => import("./mta").then((mod) => mod.MtA),
  hunter_reckoning: () => import("./htr").then((mod) => mod.HTR),
  demon_the_fallen: () => import("./demon").then((mod) => mod.Demon),
};

function getPresetSync(preset: PresetName): Preset | undefined {
  return presetCache[preset];
}

function preloadPreset(preset: PresetName): Promise<Preset> {
  const cached = getPresetSync(preset);
  if (cached) {
    return Promise.resolve(cached);
  }

  const loader = presetLoaders[preset];
  if (!loader) {
    return Promise.reject(new Error(`Unsupported preset: ${preset}`));
  }

  return loader().then((presetData) => {
    presetCache[preset] = presetData;
    return presetData;
  });
}

export function usePresetLoader(): boolean {
  const { preset } = usePreset();
  const cached = getPresetSync(preset);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (cached) {
      return;
    }

    let active = true;
    preloadPreset(preset).then(() => {
      if (active) {
        setRefresh((value) => value + 1);
      }
    });

    return () => {
      active = false;
    };
  }, [cached, preset]);

  return cached !== undefined;
}

export function useExternalPresetProps(): ExternalPresetProps {
  const { preset } = usePreset();
  const presetData = getPresetSync(preset);

  if (!presetData) {
    throw new Error(`Preset ${preset} is not loaded yet`);
  }

  return R.pick(
    ["CharSheet", "CheckList", "freebiePointsConfig", "experiencePointsConfig"],
    presetData,
  );
}

export function useInternalPresetProps(): InternalPresetProps {
  const { preset } = usePreset();
  const {
    i18n: { language },
  } = useTranslation();

  const presetData = getPresetSync(preset);
  if (!presetData) {
    throw new Error(`Preset ${preset} is not loaded yet`);
  }

  return useMemo(() => {
    const {
      displayName,
      profileConfig,
      attributesConfig,
      abilitiesConfig,
      getDropdownOptions,
    } = presetData;

    return {
      displayName,
      profileConfig,
      attributesConfig,
      abilitiesConfig,
      dropdownOptions: getDropdownOptions?.(language),
    };
  }, [language, presetData]);
}

export function useTranslateDropdownOptions(): void {
  const { i18n } = useTranslation();
  const store = useStore();
  const { preset } = usePreset();

  useEffect(() => {
    const cb = (lng: string): void => {
      const presetData = getPresetSync(preset);
      if (!presetData) {
        return;
      }

      const { translateDropdownOptions } = presetData;
      if (translateDropdownOptions !== undefined) {
        translateDropdownOptions(store, i18n.language, lng);
      }
    };

    i18n.on("languageChanged", cb);
    return () => {
      i18n.off("languageChanged", cb);
    };
  }, [i18n, preset, store]);
}

export function usePresetList(): PresetSupportInfo[] {
  return useMemo(
    () => presetList.map((preset) => presetSupportInfo[preset]),
    [],
  );
}
