import React, { ChangeEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/cjs/Form";
import classnames from "classnames";

import { RangeInput2 } from "../../../generic/uiPrimitives/RangeInput2";
import { EdgesService } from "../../application/ports";
import { edgeCreedOptionsRu, edgeCreedOptionsEn } from "../../dropdownContent/resources/optionsSources";

import "./EdgesSection.css";

interface EdgesSectionProps extends EdgesService {
  className?: string;
}

export function EdgesSection(props: EdgesSectionProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const {
    className,
    edges,
    addEdge,
    removeEdge,
    setEdgeName,
    setEdgeCreed,
    setEdgeLevel,
    setEdgeTrigger,
  } = props;

  const creedOptions = i18n.language === "ru" ? edgeCreedOptionsRu : edgeCreedOptionsEn;

  const onNameChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setEdgeName(index, e.target.value);
    },
    [setEdgeName]
  );

  const onCreedChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      setEdgeCreed(index, e.target.value);
    },
    [setEdgeCreed]
  );

  const onTriggerChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setEdgeTrigger(index, e.target.value);
    },
    [setEdgeTrigger]
  );

  const onLevelChange = useCallback(
    (value: number, index: number) => {
      setEdgeLevel(index, value);
    },
    [setEdgeLevel]
  );

  return (
    <div className={classnames("EdgesSection", className)}>
      <table className="tw-w-full tw-border-collapse">
        <thead>
          <tr className="tw-text-sm tw-font-bold">
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.name", "Название")}</th>
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.creed", "Кредо")}</th>
            <th className="tw-text-center tw-pb-2">{t("charsheet.htr.edges.level", "Уровень")}</th>
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.trigger", "Триггер")}</th>
            <th className="tw-w-8"></th>
          </tr>
        </thead>
        <tbody>
          {edges.map((edge, index) => (
            <tr key={index} className="tw-border-b tw-border-gray-200">
              <td className="tw-py-1 tw-pr-2">
                <Form.Control
                  type="text"
                  size="sm"
                  value={edge.name}
                  onChange={onNameChange(index)}
                  placeholder={t("charsheet.htr.edges.namePlaceholder", "Название грани")}
                />
              </td>
              <td className="tw-py-1 tw-pr-2">
                <Form.Select
                  size="sm"
                  value={edge.creed}
                  onChange={onCreedChange(index)}
                >
                  <option value="">{t("charsheet.htr.edges.selectCreed", "Выберите кредо")}</option>
                  {creedOptions.map((creed) => (
                    <option key={creed} value={creed}>
                      {creed}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td className="tw-py-1 tw-pr-2 tw-text-center">
                <RangeInput2
                  max={5}
                  value={edge.level}
                  dataContext={index}
                  onClick={onLevelChange}
                  name={`edge-level-${index}`}
                />
              </td>
              <td className="tw-py-1 tw-pr-2">
                <Form.Control
                  type="text"
                  size="sm"
                  value={edge.trigger}
                  onChange={onTriggerChange(index)}
                  placeholder={t("charsheet.htr.edges.triggerPlaceholder", "Триггер")}
                />
              </td>
              <td className="tw-py-1">
                <button
                  type="button"
                  className="tw-text-red-500 tw-text-sm hover:tw-text-red-700"
                  onClick={() => removeEdge(index)}
                  title={t("charsheet.htr.edges.remove", "Удалить грань")}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="tw-mt-2 tw-text-blue-500 tw-text-sm hover:tw-text-blue-700"
        onClick={addEdge}
        title={t("charsheet.htr.edges.add", "Добавить грань")}
      >
        + {t("charsheet.htr.edges.add", "Добавить грань")}
      </button>
    </div>
  );
}
