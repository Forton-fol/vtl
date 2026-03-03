import React, { useCallback, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { useCharSheetStorage } from "../../../../charSheets/root/services/storageAdapter";
import { usePreset } from "../../../../charSheets/root/services/storageAdapter";
import { useInternalPresetProps, useExternalPresetProps } from "../../../../charSheets";
import {
  randomizeCharacter,
  randomizeFreebiePoints,
  DEFAULT_RANDOMIZER_SETTINGS,
} from "../../../../charSheets/generic/randomizer";
import type { RandomizerSettings, PriorityMode } from "../../../../charSheets/generic/randomizer";
import { CharSheet, OptionGroup } from "../../../../charSheets/root/domain";

interface RandomizerPanelProps {
  className?: string;
}

export function RandomizerPanel(props: RandomizerPanelProps): JSX.Element {
  const { className } = props;
  const { t } = useTranslation();

  const { charSheet, setCharSheet } = useCharSheetStorage();
  const { preset } = usePreset();
  const { attributesConfig, abilitiesConfig, dropdownOptions } =
    useInternalPresetProps();
  const { freebiePointsConfig } = useExternalPresetProps();

  // ── Randomizer Settings ──
  const [attrPriorityMode, setAttrPriorityMode] = useState<string>("clanRecommended");
  const [abilPriorityMode, setAbilPriorityMode] = useState<string>("clanRecommended");
  const [useClanFocus, setUseClanFocus] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const randomizerSettings = useMemo<RandomizerSettings>(() => {
    const parseMode = (mode: string): PriorityMode => {
      if (mode === "random" || mode === "clanRecommended") return mode;
      // Custom priority order encoded as "physical,social,mental"
      return mode.split(",");
    };
    return {
      attributePriority: parseMode(attrPriorityMode),
      abilityPriority: parseMode(abilPriorityMode),
      useClanFocus,
    };
  }, [attrPriorityMode, abilPriorityMode, useClanFocus]);

  // Stores the character sheet state before freebie points were applied,
  // so re-randomizing freebie points starts from scratch instead of stacking.
  const preFreebieSheetRef = useRef<CharSheet | null>(null);

  // Clan filter: which group names are enabled for randomization
  const clanOptionGroups: OptionGroup[] | null = useMemo(() => {
    const opts = dropdownOptions?.["clanOptions"];
    if (!opts || opts.length === 0) return null;
    if (typeof opts[0] === "string") return null;
    return opts as OptionGroup[];
  }, [dropdownOptions]);

  const [enabledClanGroups, setEnabledClanGroups] = useState<Set<string>>(
    () => new Set(clanOptionGroups?.map((g) => g.groupName) ?? []),
  );

  // Keep enabledClanGroups in sync when clanOptionGroups change (e.g. preset switch)
  const prevClanGroupsRef = useRef(clanOptionGroups);
  if (clanOptionGroups !== prevClanGroupsRef.current) {
    prevClanGroupsRef.current = clanOptionGroups;
    if (clanOptionGroups) {
      setEnabledClanGroups(new Set(clanOptionGroups.map((g) => g.groupName)));
    }
  }

  const toggleClanGroup = useCallback((groupName: string) => {
    setEnabledClanGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  }, []);

  const allClanGroupsSelected =
    clanOptionGroups != null &&
    clanOptionGroups.every((g) => enabledClanGroups.has(g.groupName));

  const noClanGroupsSelected =
    clanOptionGroups != null &&
    clanOptionGroups.every((g) => !enabledClanGroups.has(g.groupName));

  const toggleAllClanGroups = useCallback(() => {
    if (!clanOptionGroups) return;
    if (allClanGroupsSelected) {
      setEnabledClanGroups(new Set());
    } else {
      setEnabledClanGroups(new Set(clanOptionGroups.map((g) => g.groupName)));
    }
  }, [clanOptionGroups, allClanGroupsSelected]);

  // Build filtered dropdown options that only include enabled clan groups
  const filteredDropdownOptions = useMemo(() => {
    if (!dropdownOptions || !clanOptionGroups) return dropdownOptions;
    const filteredClans = clanOptionGroups.filter((g) =>
      enabledClanGroups.has(g.groupName),
    );
    return { ...dropdownOptions, clanOptions: filteredClans };
  }, [dropdownOptions, clanOptionGroups, enabledClanGroups]);

  const handleRandomCharacter = useCallback(() => {
    // Clear the saved base — the whole character is being re-randomized
    preFreebieSheetRef.current = null;

    const newSheet = randomizeCharacter(
      charSheet,
      preset,
      attributesConfig,
      abilitiesConfig,
      filteredDropdownOptions,
      randomizerSettings,
    );
    setCharSheet(newSheet);
  }, [charSheet, preset, attributesConfig, abilitiesConfig, filteredDropdownOptions, randomizerSettings, setCharSheet]);

  const handleRandomFreebiePoints = useCallback(() => {
    if (!freebiePointsConfig) return;

    // On first freebie randomization, save the current sheet as the base.
    // On subsequent calls, reuse the saved base so points don't stack.
    if (!preFreebieSheetRef.current) {
      preFreebieSheetRef.current = charSheet;
    }

    const newSheet = randomizeFreebiePoints(
      preFreebieSheetRef.current,
      preset,
      freebiePointsConfig,
      attributesConfig,
      abilitiesConfig,
      filteredDropdownOptions,
    );
    setCharSheet(newSheet);
  }, [
    charSheet,
    preset,
    freebiePointsConfig,
    attributesConfig,
    abilitiesConfig,
    filteredDropdownOptions,
    setCharSheet,
  ]);

  return (
    <div
      className={classnames(
        "RandomizerPanel tw-max-w-sm tw-mx-5 tw-my-3",
        className,
      )}
    >
      <p className="tw-mb-4 tw-text-sm tw-text-gray-600">
        {t("randomizer.description")}
      </p>

      {/* Settings toggle */}
      <div className="tw-mb-4">
        <button
          type="button"
          className="tw-text-sm tw-font-semibold tw-text-blue-600 hover:tw-underline tw-bg-transparent tw-border-0 tw-cursor-pointer tw-p-0"
          onClick={() => setShowSettings((v) => !v)}
        >
          {t("randomizer.settings")} {showSettings ? "▲" : "▼"}
        </button>

        {showSettings && (
          <div className="tw-mt-2 tw-space-y-3 tw-border tw-border-gray-300 tw-rounded tw-p-3">
            {/* Attribute priority */}
            <div>
              <label className="tw-text-xs tw-font-semibold tw-block tw-mb-1">
                {t("randomizer.attributePriority")}
              </label>
              <select
                className="tw-w-full tw-text-xs tw-border tw-border-gray-400 tw-rounded tw-px-2 tw-py-1"
                value={attrPriorityMode}
                onChange={(e) => setAttrPriorityMode(e.target.value)}
              >
                <option value="clanRecommended">{t("randomizer.priorityClanRecommended")}</option>
                <option value="random">{t("randomizer.priorityRandom")}</option>
                <option value="physical,social,mental">{t("randomizer.priorityPhysical")} → {t("randomizer.prioritySocial")} → {t("randomizer.priorityMental")}</option>
                <option value="physical,mental,social">{t("randomizer.priorityPhysical")} → {t("randomizer.priorityMental")} → {t("randomizer.prioritySocial")}</option>
                <option value="social,physical,mental">{t("randomizer.prioritySocial")} → {t("randomizer.priorityPhysical")} → {t("randomizer.priorityMental")}</option>
                <option value="social,mental,physical">{t("randomizer.prioritySocial")} → {t("randomizer.priorityMental")} → {t("randomizer.priorityPhysical")}</option>
                <option value="mental,physical,social">{t("randomizer.priorityMental")} → {t("randomizer.priorityPhysical")} → {t("randomizer.prioritySocial")}</option>
                <option value="mental,social,physical">{t("randomizer.priorityMental")} → {t("randomizer.prioritySocial")} → {t("randomizer.priorityPhysical")}</option>
              </select>
            </div>

            {/* Ability priority */}
            <div>
              <label className="tw-text-xs tw-font-semibold tw-block tw-mb-1">
                {t("randomizer.abilityPriority")}
              </label>
              <select
                className="tw-w-full tw-text-xs tw-border tw-border-gray-400 tw-rounded tw-px-2 tw-py-1"
                value={abilPriorityMode}
                onChange={(e) => setAbilPriorityMode(e.target.value)}
              >
                <option value="clanRecommended">{t("randomizer.priorityClanRecommended")}</option>
                <option value="random">{t("randomizer.priorityRandom")}</option>
                <option value="talents,skills,knowledges">{t("randomizer.priorityTalents")} → {t("randomizer.prioritySkills")} → {t("randomizer.priorityKnowledges")}</option>
                <option value="talents,knowledges,skills">{t("randomizer.priorityTalents")} → {t("randomizer.priorityKnowledges")} → {t("randomizer.prioritySkills")}</option>
                <option value="skills,talents,knowledges">{t("randomizer.prioritySkills")} → {t("randomizer.priorityTalents")} → {t("randomizer.priorityKnowledges")}</option>
                <option value="skills,knowledges,talents">{t("randomizer.prioritySkills")} → {t("randomizer.priorityKnowledges")} → {t("randomizer.priorityTalents")}</option>
                <option value="knowledges,talents,skills">{t("randomizer.priorityKnowledges")} → {t("randomizer.priorityTalents")} → {t("randomizer.prioritySkills")}</option>
                <option value="knowledges,skills,talents">{t("randomizer.priorityKnowledges")} → {t("randomizer.prioritySkills")} → {t("randomizer.priorityTalents")}</option>
              </select>
            </div>

            {/* Clan focus toggle */}
            <label className="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-cursor-pointer">
              <input
                type="checkbox"
                checked={useClanFocus}
                onChange={(e) => setUseClanFocus(e.target.checked)}
              />
              <span>
                {t("randomizer.useClanFocus")}
                <span className="tw-text-gray-400 tw-ml-1">
                  — {t("randomizer.useClanFocusHint")}
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {clanOptionGroups && clanOptionGroups.length > 0 && (
        <div className="tw-mb-4">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
            <span className="tw-text-sm tw-font-semibold">
              {t("randomizer.clanFilter")}
            </span>
            <button
              type="button"
              className="tw-text-xs tw-text-blue-600 hover:tw-underline tw-bg-transparent tw-border-0 tw-cursor-pointer tw-p-0"
              onClick={toggleAllClanGroups}
            >
              {allClanGroupsSelected
                ? t("randomizer.deselectAll")
                : t("randomizer.selectAll")}
            </button>
          </div>
          <div className="tw-space-y-1 tw-max-h-48 tw-overflow-y-auto tw-border tw-border-gray-300 tw-rounded tw-p-2">
            {clanOptionGroups.map((group) => (
              <label
                key={group.groupName}
                className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={enabledClanGroups.has(group.groupName)}
                  onChange={() => toggleClanGroup(group.groupName)}
                />
                <span>
                  {group.groupName}{" "}
                  <span className="tw-text-gray-400">({group.arr.length})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button
        className="custom-btn-bg-color tw-mx-auto tw-block tw-mb-3 tw-w-full"
        onClick={handleRandomCharacter}
        disabled={clanOptionGroups != null && noClanGroupsSelected}
      >
        {t("randomizer.randomCharacter")}
      </Button>

      {freebiePointsConfig && (
        <Button
          className="custom-btn-bg-color tw-mx-auto tw-block tw-w-full"
          onClick={handleRandomFreebiePoints}
        >
          {t("randomizer.randomFreebiePoints")}
        </Button>
      )}
    </div>
  );
}
