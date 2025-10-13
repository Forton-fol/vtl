import React, { ChangeEvent, useCallback } from "react";
import classnames from "classnames";
import { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

import { RangeInput2 } from "../RangeInput2";
import wikiMap from "../../../../ui/Wiki/wikiMap";
import { SelectButton } from "../SelectButton";
import { RemoveEntityButton } from "../RemoveEntityButton";
import { AddEntityButton } from "../AddEntityButton";
import { Options } from "../../../root/domain";

interface NameNumberSectionProps {
  items: {
    name: string;
    value: number;
  }[];
  addItem: () => void;
  removeItem: (index: number) => void;
  setItemName: (index: number, name: string) => void;
  setItemValue: (index: number, value: number) => void;
  addItemMsg: string;
  removeItemMsg: string;
  sectionItemName: string;
  max: number;
  className?: string;
  options?: Options;
  selectOptionMsg?: string;
  nameLabel?: ParseKeys;
}

export function NameNumberSection(props: NameNumberSectionProps): JSX.Element {
  const {
    items,
    addItem,
    removeItem,
    setItemName,
    setItemValue,
    addItemMsg,
    removeItemMsg,
    className,
    sectionItemName,
    options,
    selectOptionMsg,
    nameLabel,
    max,
  } = props;

  const { t } = useTranslation();

  const onNameChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setItemName(index, value);
    };

  const setValue = useCallback(
    function setValue(value: number, index: number) {
      setItemValue(index, value);
    },
    [setItemValue]
  );

  function openWikiFor(name: string, valueIndex: number, event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
      if (!name) return;
      const base = "https://wod.fandom.com/ru/wiki/";

      // try exact match in the map
      const entry = wikiMap[name];
      let page: string | undefined;

      if (Array.isArray(entry)) {
        // pick by index, fallback to last entry
        page = entry[valueIndex] ?? entry[entry.length - 1];
      } else if (typeof entry === "string") {
        page = entry;
      }

      // fallback: sanitize name to a page-like string
      const fallback = name.replace(/\s+/g, "_");
      const pageToOpen = encodeURIComponent(page || fallback);
      const url = `${base}${pageToOpen}`;

      // Open a centered popup window. If popup blocked, fallback to new tab.
      const w = 900;
      const h = 700;
      const left = window.screenX + (window.innerWidth - w) / 2;
      const top = window.screenY + (window.innerHeight - h) / 2;
      const features = `toolbar=0,location=0,status=0,menubar=0,width=${w},height=${h},left=${left},top=${top}`;
      const popup = window.open(url, '_blank', features);
      if (!popup) {
        // fallback: open in same tab if popups blocked
        window.location.href = url;
      }
    }

  return (
    <div className={classnames("NameNumberSection", className)}>
      {items.map(({ name, value }, index) => (
        <div
          className="tw-mb-3 print:tw-mb-1"
          key={`${sectionItemName}.${index}`}
          role="group"
          aria-labelledby={`${sectionItemName}.label.${index}`}
        >
          <div className="tw-flex">
            <input
              className="tw-bg-transparent tw-flex-1 tw-text-sm
                  tw-outline-1 tw-outline
                  tw-outline-slate-700 hover:tw-outline-red-600
                  print:tw-outline-transparent"
              value={name}
              id={`${sectionItemName}.label.${index}`}
              onChange={onNameChange(index)}
              aria-label={
                nameLabel
                  ? (t(nameLabel, { index: index + 1 }) as string)
                  : undefined
              }
            />
            {options && (
              <SelectButton
                options={options}
                className="print:tw-hidden tw-ml-2"
                onChange={(value) => setItemName(index, value)}
                selectOptionMsg={selectOptionMsg}
              />
            )}
            <RemoveEntityButton
              className="tw-ml-2"
              title={removeItemMsg}
              onClick={() => removeItem(index)}
            />
          </div>
          <RangeInput2
            max={max}
            name={`${sectionItemName}.${index}`}
            value={value}
            dataContext={index}
            onClick={setValue}
            onContext={(v, ctx, ev) => openWikiFor(name, v, ev)}
            className="tw-flex-grow tw-mt-2 print:tw-mt-1"
          />
        </div>
      ))}
      <div className="tw-text-center tw-mt-4 print:tw-hidden">
        <AddEntityButton title={addItemMsg} onClick={addItem} />
      </div>
    </div>
  );
}
