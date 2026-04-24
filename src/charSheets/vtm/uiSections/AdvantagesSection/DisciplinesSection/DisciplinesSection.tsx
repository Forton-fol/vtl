import React, { memo, useCallback } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/cjs/Form";

import { LimitService } from "../../../../../charSheets/root/application/ports";
import { RangeInput2 } from "../../../../generic/uiPrimitives";
import { OptionGroup } from "../../../../../charSheets/root/domain";
import { DisciplinesService } from "../../../application/ports";

interface DisciplinesSectionProps extends DisciplinesService, LimitService {
  disciplineOptions?: OptionGroup[];
  className?: string;
}

export const DisciplinesSection = memo(function DisciplinesSection(
  props: DisciplinesSectionProps
) {
  const { t } = useTranslation();
  const {
    className,
    disciplines,
    addDiscipline,
    removeDiscipline,
    setDisciplineName,
    setDisciplineValue,
    setDisciplineSubtitle,
    disciplineOptions,
    limits,
  } = props;

  const onNameChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDisciplineName(index, e.target.value);
    },
    [setDisciplineName]
  );

  const onLevelChange = useCallback(
    (value: number, index: number) => {
      setDisciplineValue(index, value);
    },
    [setDisciplineValue]
  );

  const onSubtitleChange = useCallback(
    (disciplineIndex: number, subtitleIndex: number) => 
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisciplineSubtitle(disciplineIndex, subtitleIndex, e.target.value);
      },
    [setDisciplineSubtitle]
  );

  const getCreedName = (disciplineName: string): string => {
    if (!disciplineName || !disciplineOptions) {
      return "-";
    }

    const group = disciplineOptions.find((item) =>
      item.arr.includes(disciplineName)
    );

    return group?.groupName ?? "-";
  };

  return (
    <div className={classnames("DisciplinesSection", className)}>
      <table className="tw-w-full tw-border-collapse">
        <thead>
          <tr className="tw-text-sm tw-font-bold">
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.creed", "Кредо")}</th>
            <th className="tw-text-left tw-pb-2">{t("charsheet.advantages.disciplines")}</th>
            <th className="tw-text-center tw-pb-2">{t("charsheet.htr.edges.level", "Уровень")}</th>
            <th className="tw-w-8"></th>
          </tr>
        </thead>
        <tbody>
          {disciplines.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="tw-border-b tw-border-gray-200">
                <td className="tw-py-1 tw-pr-2 tw-text-sm">{getCreedName(item.name)}</td>
                <td className="tw-py-1 tw-pr-2">
                  <Form.Select
                    size="sm"
                    value={item.name || ""}
                    onChange={onNameChange(index)}
                  >
                    <option value="">{t("charsheet.advantages.select-discipline")}</option>
                    {disciplineOptions?.map((group) => (
                      <optgroup key={group.groupName} label={group.groupName}>
                        {group.arr.map((discipline) => (
                          <option key={discipline} value={discipline}>
                            {discipline}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>
                </td>
                <td className="tw-py-1 tw-pr-2 tw-text-center">
                  <RangeInput2
                    max={limits.parameterLimit}
                    value={item.value}
                    dataContext={index}
                    onClick={onLevelChange}
                    name={`discipline-level-${index}`}
                  />
                </td>
                <td className="tw-py-1">
                  <button
                    type="button"
                    className="tw-text-red-500 tw-text-sm hover:tw-text-red-700"
                    onClick={() => removeDiscipline(index)}
                    title={t("charsheet.advantages.remove-discipline")}
                  >
                    x
                  </button>
                </td>
              </tr>
              {item.value > 0 && (
                <tr className="tw-bg-gray-50 tw-border-b tw-border-gray-200">
                  <td colSpan={4} className="tw-py-2 tw-px-2">
                    <div className="tw-grid tw-grid-cols-1 tw-gap-2">
                      {Array.from({ length: item.value }).map((_, subtitleIndex) => (
                        <div key={subtitleIndex} className="tw-flex tw-items-center tw-gap-2">
                          <label className="tw-text-xs tw-text-gray-600 tw-min-w-max">
                            {t("charsheet.advantages.specialization", "Специализация")} {subtitleIndex + 1}:
                          </label>
                          <input
                            type="text"
                            className="tw-flex-1 tw-px-2 tw-py-1 tw-border tw-border-gray-300 tw-rounded tw-text-sm"
                            value={item.subtitles?.[subtitleIndex] || ""}
                            onChange={onSubtitleChange(index, subtitleIndex)}
                            placeholder={t("charsheet.advantages.enter-subtitle", "Введите подзаголовок")}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="tw-mt-2 tw-text-blue-500 tw-text-sm hover:tw-text-blue-700"
        onClick={addDiscipline}
      >
        + {t("charsheet.advantages.add-discipline")}
      </button>
    </div>
  );
});
