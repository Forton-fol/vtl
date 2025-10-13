import React, { ChangeEvent, useCallback } from "react";
import classnames from "classnames";
import { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

import { RangeInput2 } from "../RangeInput2";
import wikiMap from "../../../../ui/Wiki/wikiMap";
import CustomDotEditor from "../../../../ui/Wiki/CustomDotEditor";
import { useStore } from "../../../../charSheets/root/services/store";
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
      const candidate = page || fallback;
      // If candidate already looks like a full URL, use it directly.
      const url = /^https?:\/\//i.test(candidate)
        ? candidate
        : `${base}${encodeURIComponent(candidate)}`;

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

  const { charSheet } = useStore();
  const [editorState, setEditorState] = React.useState<{
    show: boolean;
    section?: string;
    itemIndex?: number;
    dotIndex?: number;
  }>({ show: false });

  function openCustomOrWiki(name: string, valueIndex: number, event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    // for dots 6..10 (values >=6) allow custom attachments
    if (valueIndex >= 6) {
      const sec = sectionItemName;
      const item = String(event.currentTarget.dataset["data-context"] || event.currentTarget.getAttribute("data-context") || event.currentTarget.dataset["context"] || "0");
      // the RangeInput2 passes dataContext prop via data-attribute 'data-index' only, but we also have dataContext prop on RangeInput2 mapping; here NameNumberSection passes dataContext=index
      const itemIndex = (event.currentTarget && (event.currentTarget as any).dataset && (event.currentTarget as any).dataset["context"]) ? Number((event.currentTarget as any).dataset["context"]) : undefined;
      // try to read stored custom dot
      const stored = (charSheet as any).customDotData?.[sec]?.[String(itemIndex ?? 0)]?.[String(valueIndex)];
      if (stored) {
        if (stored.kind === "link") {
          const url = /^https?:\/\//i.test(stored.content) ? stored.content : `https://${stored.content}`;
          const w = 900;
          const h = 700;
          const left = window.screenX + (window.innerWidth - w) / 2;
          const top = window.screenY + (window.innerHeight - h) / 2;
          const features = `toolbar=0,location=0,status=0,menubar=0,width=${w},height=${h},left=${left},top=${top}`;
          const popup = window.open(url, '_blank', features);
          if (!popup) window.location.href = url;
          return;
        }
        // text: open editor to view/edit
        setEditorState({ show: true, section: sec, itemIndex: itemIndex ?? 0, dotIndex: valueIndex });
        return;
      }
      // no stored custom: open editor to create one
      setEditorState({ show: true, section: sec, itemIndex: itemIndex ?? 0, dotIndex: valueIndex });
      return;
    }
    // fallback to wiki behavior for values <6
    openWikiFor(name, valueIndex, event);
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
            onContext={(v, ctx, ev) => openCustomOrWiki(name, v, ev)}
            className="tw-flex-grow tw-mt-2 print:tw-mt-1"
          />
        </div>
      ))}
      <CustomDotEditor
        show={!!editorState.show}
        onHide={() => setEditorState({ show: false })}
        sectionKey={editorState.section || sectionItemName}
        itemIndex={editorState.itemIndex ?? 0}
        dotIndex={editorState.dotIndex ?? 6}
      />
      <div className="tw-text-center tw-mt-4 print:tw-hidden">
        <AddEntityButton title={addItemMsg} onClick={addItem} />
      </div>
    </div>
  );
}
