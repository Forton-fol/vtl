import React, { ChangeEvent, memo, useCallback } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/cjs/Form";

import { LimitService } from "../../../../../charSheets/root/application/ports";
import {
  NameNumberSection,
  RangeInput2,
  SelectButton,
} from "../../../../generic/uiPrimitives";
import { AddEntityButton } from "../../../../generic/uiPrimitives/AddEntityButton/AddEntityButton";
import { RemoveEntityButton } from "../../../../generic/uiPrimitives/RemoveEntityButton/RemoveEntityButton";
import { OptionGroup, Options } from "../../../../../charSheets/root/domain";
import { DisciplinesService } from "../../../application/ports";

interface DisciplinesSectionProps extends DisciplinesService, LimitService {
  disciplineOptions?: OptionGroup[];
  className?: string;
  isV5?: boolean;
}

function flattenOptions(options?: Options): string[] {
  if (!options) return [];
  if (!Array.isArray(options) || options.length === 0) return [];
  if (typeof options[0] === "string") return options as string[];

  return (options as OptionGroup[]).flatMap((group) => group.arr);
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
    isV5 = false,
  } = props;

  const flatDisciplineOptions = flattenOptions(disciplineOptions);

  const onDisciplineNameChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setDisciplineName(index, e.target.value);
    },
    [setDisciplineName]
  );

  const onDisciplineValueChange = useCallback(
    (value: number, index: number) => {
      setDisciplineValue(index, value);
    },
    [setDisciplineValue]
  );

  const onSubtitleChange = useCallback(
    (disciplineIndex: number, subtitleIndex: number) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        setDisciplineSubtitle(disciplineIndex, subtitleIndex, e.target.value);
      },
    [setDisciplineSubtitle]
  );

  if (isV5) {
    return (
      <div className={classnames("DisciplinesSection", className)}>
        {disciplines.map((discipline, index) => {
          const subtitles = discipline.subtitles || [];

          return (
            <div
              className="tw-mb-4 print:tw-mb-2"
              key={`discipline.${index}`}
              role="group"
              aria-labelledby={`discipline.label.${index}`}
            >
              <div className="tw-flex tw-items-start">
                <div className="tw-flex-1">
                  <div className="tw-flex">
                    <input
                      className="tw-bg-transparent tw-flex-1 tw-text-sm tw-outline-1 tw-outline tw-outline-slate-700 hover:tw-outline-red-600 print:tw-outline-transparent"
                      value={discipline.name}
                      id={`discipline.label.${index}`}
                      onChange={onDisciplineNameChange(index)}
                      aria-label={t("charsheet.advantages.discipline-label") as string}
                    />
                    {disciplineOptions && (
                      <SelectButton
                        options={disciplineOptions}
                        className="print:tw-hidden tw-ml-2"
                        onChange={(value) => setDisciplineName(index, value)}
                        selectOptionMsg={t("charsheet.advantages.select-discipline")}
                      />
                    )}
                    <RemoveEntityButton
                      className="tw-ml-2"
                      title={t("charsheet.advantages.remove-discipline")}
                      onClick={() => removeDiscipline(index)}
                    />
                  </div>
                  <RangeInput2
                    max={limits.parameterLimit}
                    name={`discipline.${index}`}
                    value={discipline.value}
                    dataContext={index}
                    onClick={onDisciplineValueChange}
                    className="tw-flex-grow tw-mt-2 print:tw-mt-1"
                  />
                </div>
              </div>

              {discipline.value > 0 && (
                <div className="tw-mt-2 tw-grid tw-gap-1">
                  {Array.from({ length: discipline.value }, (_, subtitleIndex) => (
                    <div
                      key={`discipline.${index}.subtitle.${subtitleIndex}`}
                      className="tw-grid tw-grid-cols-[2rem_minmax(0,1fr)] tw-items-center tw-gap-2"
                    >
                      <div className="tw-text-xs tw-text-center tw-text-slate-700">
                        {subtitleIndex + 1}
                      </div>
                      <Form.Control
                        size="sm"
                        type="text"
                        list={`discipline-powers-${index}`}
                        placeholder={t("charsheet.v5.discipline-power-placeholder", {
                          index: subtitleIndex + 1,
                          defaultValue: `Способность ${subtitleIndex + 1}`,
                        }) as string}
                        value={subtitles[subtitleIndex] || ""}
                        onChange={onSubtitleChange(index, subtitleIndex)}
                      />
                    </div>
                  ))}
                  {flatDisciplineOptions.length > 0 && (
                    <datalist id={`discipline-powers-${index}`}>
                      {flatDisciplineOptions.map((option) => (
                        <option key={`${discipline.name}.${option}`} value={option} />
                      ))}
                    </datalist>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="tw-text-center tw-mt-4 print:tw-hidden">
          <AddEntityButton
            title={t("charsheet.advantages.add-discipline")}
            onClick={addDiscipline}
          />
        </div>
      </div>
    );
  }

  return (
    <NameNumberSection
      sectionItemName="discipline"
      className={classnames("DisciplinesSection", className)}
      addItem={addDiscipline}
      items={disciplines}
      removeItem={removeDiscipline}
      setItemName={setDisciplineName}
      setItemValue={setDisciplineValue}
      addItemMsg={t("charsheet.advantages.add-discipline")}
      removeItemMsg={t("charsheet.advantages.remove-discipline")}
      options={disciplineOptions}
      selectOptionMsg={t("charsheet.advantages.select-discipline")}
      nameLabel="charsheet.advantages.discipline-label"
      max={limits.parameterLimit}
    />
  );
});
