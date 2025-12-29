import React, { ChangeEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/cjs/Form";
import classnames from "classnames";

import { RangeInput2 } from "../../../generic/uiPrimitives/RangeInput2";
import { EdgesService } from "../../application/ports";
import { 
  edgeOptionsRu, 
  edgeOptionsEn,
  creedByEdgeRu,
  creedByEdgeEn,
  edgePowerNamesRu,
  edgePowerNamesEn,
} from "../../dropdownContent/resources/optionsSources";

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
    setEdgeEdge,
    setEdgeName,
    setEdgeCreed,
    setEdgeLevel,
    setEdgeTrigger,
  } = props;

  const isRu = i18n.language === "ru";
  const edgeOptions = isRu ? edgeOptionsRu : edgeOptionsEn;
  const creedByEdge = isRu ? creedByEdgeRu : creedByEdgeEn;
  const edgePowerNames = isRu ? edgePowerNamesRu : edgePowerNamesEn;

  // Получить кредо по выбранной грани
  const getCreedOptions = (edge: string): string[] => {
    if (!edge) return [];
    return creedByEdge[edge] || [];
  };

  // Получить названия способностей по кредо
  const getEdgePowerOptions = (creed: string): string[] => {
    if (!creed) return [];
    return edgePowerNames[creed] || [];
  };

  const onEdgeChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      setEdgeEdge(index, e.target.value);
    },
    [setEdgeEdge]
  );

  const onCreedChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      setEdgeCreed(index, e.target.value);
    },
    [setEdgeCreed]
  );

  const onNameChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      setEdgeName(index, e.target.value);
    },
    [setEdgeName]
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
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.edge", "Грань")}</th>
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.creed", "Кредо")}</th>
            <th className="tw-text-left tw-pb-2">{t("charsheet.htr.edges.power", "Способность")}</th>
            <th className="tw-text-center tw-pb-2">{t("charsheet.htr.edges.level", "Уровень")}</th>
            <th className="tw-w-8"></th>
          </tr>
        </thead>
        <tbody>
          {edges.map((edgeItem, index) => (
            <tr key={index} className="tw-border-b tw-border-gray-200">
              {/* Грань */}
              <td className="tw-py-1 tw-pr-2">
                <Form.Select
                  size="sm"
                  value={edgeItem.edge || ""}
                  onChange={onEdgeChange(index)}
                >
                  <option value="">{t("charsheet.htr.edges.selectEdge", "Выберите грань")}</option>
                  {edgeOptions.map((edge) => (
                    <option key={edge} value={edge}>
                      {edge}
                    </option>
                  ))}
                </Form.Select>
              </td>
              {/* Кредо */}
              <td className="tw-py-1 tw-pr-2">
                <Form.Select
                  size="sm"
                  value={edgeItem.creed}
                  onChange={onCreedChange(index)}
                  disabled={!edgeItem.edge}
                >
                  <option value="">{t("charsheet.htr.edges.selectCreed", "Выберите кредо")}</option>
                  {getCreedOptions(edgeItem.edge || "").map((creed) => (
                    <option key={creed} value={creed}>
                      {creed}
                    </option>
                  ))}
                </Form.Select>
              </td>
              {/* Способность */}
              <td className="tw-py-1 tw-pr-2">
                <Form.Select
                  size="sm"
                  value={edgeItem.name}
                  onChange={onNameChange(index)}
                  disabled={!edgeItem.creed}
                >
                  <option value="">{t("charsheet.htr.edges.selectPower", "Выберите способность")}</option>
                  {getEdgePowerOptions(edgeItem.creed).map((power) => (
                    <option key={power} value={power}>
                      {power}
                    </option>
                  ))}
                </Form.Select>
              </td>
              {/* Уровень */}
              <td className="tw-py-1 tw-pr-2 tw-text-center">
                <RangeInput2
                  max={5}
                  value={edgeItem.level}
                  dataContext={index}
                  onClick={onLevelChange}
                  name={`edge-level-${index}`}
                />
              </td>
              <td className="tw-py-1">
                <button
                  type="button"
                  className="tw-text-red-500 tw-text-sm hover:tw-text-red-700"
                  onClick={() => removeEdge(index)}
                  title={t("charsheet.htr.edges.remove", "Удалить")}
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
      >
        + {t("charsheet.htr.edges.add", "Добавить грань")}
      </button>
    </div>
  );
}
