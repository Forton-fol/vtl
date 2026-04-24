import React, { useMemo, useState } from "react";
import classnames from "classnames";
import Button from "react-bootstrap/cjs/Button";
import * as R from "ramda";
import { useTranslation } from "react-i18next";

import { useCharSheetStorage } from "../../../../charSheets/root/services/storageAdapter";
import { CharSheet } from "../../../../charSheets/root/domain";
import {
  ExperiencePointsConfig,
  ExperiencePointItem,
  calcXpCostForItem,
} from "../../../../charSheets/generic/presetSettings/experiencePointCommons";

interface ExperiencePointsPanelProps {
  experiencePointsConfig: ExperiencePointsConfig;
  className?: string;
}

type FilledXpItem = {
  name: string;
  multiplier: number;
  isNew?: boolean;
  flatCost?: number;
  cost: number;
};

function formatNumber(num: number): string {
  return num === 0 ? "0" : num > 0 ? `+${num}` : String(num);
}

export function ExperiencePointsPanel(
  props: ExperiencePointsPanelProps,
): JSX.Element {
  const { className, experiencePointsConfig } = props;
  const { t } = useTranslation();

  const { charSheet, setCharSheet } = useCharSheetStorage();

  const [prevCharSheet, setPrevCharSheet] = useState<CharSheet | undefined>(
    undefined,
  );
  const [totalXp, setTotalXp] = useState<number>(0);

  const xpStatus = useMemo<{
    totalXp: number;
    items: FilledXpItem[];
    totalSpent: number;
    remaining: number;
  }>(() => {
    if (prevCharSheet === undefined) {
      return {
        totalXp,
        items: [],
        totalSpent: 0,
        remaining: totalXp,
      };
    }

    const items: FilledXpItem[] = experiencePointsConfig.list.map((item) => {
      const prevValues = item.extractValues(prevCharSheet);
      const currentValues = item.extractValues(charSheet);
      const cost = calcXpCostForItem(item, prevValues, currentValues);
      return {
        name: item.name,
        multiplier: item.multiplier,
        isNew: item.isNew,
        flatCost: item.flatCost,
        cost,
      };
    });

    const totalSpent = R.sum(items.map((el) => el.cost));

    return {
      totalXp,
      items,
      totalSpent,
      remaining: totalXp - totalSpent,
    };
  }, [prevCharSheet, experiencePointsConfig, charSheet, totalXp]);

  return (
    <div
      className={classnames(
        "ExperiencePointsPanel tw-max-w-sm tw-mx-5 tw-my-3",
        className,
      )}
    >
      {/* XP input */}
      <div className="tw-mb-4 tw-flex tw-items-center tw-gap-2">
        <label className="tw-text-sm tw-font-semibold tw-whitespace-nowrap">
          {t("experiencePoints.totalXp")}:
        </label>
        <input
          type="number"
          min={0}
          className="tw-w-20 tw-border tw-border-gray-400 tw-rounded tw-px-2 tw-py-1 tw-text-sm"
          value={totalXp}
          onChange={(e) => setTotalXp(Math.max(0, Number(e.target.value) || 0))}
          disabled={prevCharSheet !== undefined}
        />
      </div>

      <Button
        className="custom-btn-bg-color tw-mx-auto tw-block disabled:tw-cursor-not-allowed tw-mb-4"
        onClick={() => setPrevCharSheet(charSheet)}
        disabled={prevCharSheet !== undefined || totalXp <= 0}
      >
        {t("experiencePoints.beginXpAssignment")}
      </Button>

      {/* Reference cost table (always shown) */}
      <div className="tw-mb-4">
        <h4 className="tw-text-sm tw-font-semibold tw-mb-2">
          {t("experiencePoints.costTable")}
        </h4>
        <div className="tw-max-h-72 tw-overflow-y-auto">
          <table className="tw-w-full tw-text-xs tw-border-collapse">
            <thead>
              <tr className="tw-border-b tw-border-gray-400">
                <th className="tw-text-left tw-py-1 tw-pr-4">
                  {t("experiencePoints.trait")}
                </th>
                <th className="tw-text-right tw-py-1">
                  {t("experiencePoints.cost")}
                </th>
              </tr>
            </thead>
            <tbody>
              {experiencePointsConfig.list.map((item) => (
                <tr
                  key={item.name}
                  className="tw-border-b tw-border-gray-200"
                >
                  <td className="tw-py-1 tw-pr-4">
                    {t(`experiencePoints.${item.name}`)}
                  </td>
                  <td className="tw-py-1 tw-text-right tw-whitespace-nowrap">
                    {item.isNew && item.flatCost !== undefined
                      ? String(item.flatCost)
                      : t("experiencePoints.currentTimesN", {
                          n: item.multiplier,
                        })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spending tracker (only when active) */}
      {prevCharSheet && (
        <div>
          <p className="tw-mb-4 tw-text-sm">
            {t("experiencePoints.description")}
          </p>
          <div className="tw-w-60 tw-mx-auto tw-mb-4">
            <div className="tw-font-semibold">
              {t("experiencePoints.totalXp")}
              <span className="tw-float-right">{xpStatus.totalXp}</span>
            </div>

            <div className="tw-my-2 tw-border-b-2 tw-border-gray-600 tw-border-solid" />

            <ul className="tw-text-sm">
              {xpStatus.items
                .filter((el) => el.cost > 0)
                .map((el) => (
                  <li key={el.name}>
                    <span>
                      {t(`experiencePoints.${el.name}`)}
                    </span>
                    <span className="tw-float-right">
                      -{el.cost}
                    </span>
                  </li>
                ))}
            </ul>

            <div className="tw-my-2 tw-border-b-2 tw-border-gray-600 tw-border-solid" />

            <div
              className={classnames("tw-font-semibold", {
                "tw-text-red-600": xpStatus.remaining < 0,
                "tw-text-green-700": xpStatus.remaining >= 0,
              })}
            >
              {t("experiencePoints.remaining")}
              <span className="tw-float-right">
                {xpStatus.remaining}
              </span>
            </div>
          </div>

          <div className="tw-flex tw-justify-around">
            <Button
              className="custom-btn-bg-color tw-w-32 tw-flex-0"
              onClick={() => {
                setCharSheet(prevCharSheet);
                setPrevCharSheet(undefined);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="custom-btn-bg-color tw-w-32 tw-flex-0"
              onClick={() => {
                setTotalXp(Math.max(0, xpStatus.remaining));
                setPrevCharSheet(undefined);
              }}
            >
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
