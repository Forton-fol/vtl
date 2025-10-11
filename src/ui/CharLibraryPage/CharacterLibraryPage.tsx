import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import ListGroup from "react-bootstrap/cjs/ListGroup";
import { useTranslation } from "react-i18next";
import { listLibrary, saveToLibrary, removeFromLibrary } from "../../lib/libraryStorage";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const { setCharSheet, charSheet } = useCharSheetStorage();

  const [entries, setEntries] = useState(() => listLibrary());

  useEffect(() => {
    setEntries(listLibrary());
  }, []);

  function onSaveCurrent() {
    const entry = saveToLibrary(charSheet);
    setEntries((prev) => [entry, ...prev]);
  }

  function onLoad(id: string) {
    const e = listLibrary().find((el) => el.id === id);
    if (e) {
      setCharSheet(e.raw);
    }
  }

  function onDelete(id: string) {
    removeFromLibrary(id);
    setEntries(listLibrary());
  }

  return (
    <div className="tw-p-6">
      <h2>{t("library.header")}</h2>
      <p className="tw-mb-4">{t("library.description")}</p>

      <div className="tw-mb-4">
        <Button variant="outline-primary" onClick={onSaveCurrent}>
          {t("library.save-current")}
        </Button>
      </div>

      <ListGroup>
        {entries.length === 0 && (
          <ListGroup.Item>{t("library.no-entries")}</ListGroup.Item>
        )}
        {entries.map((entry) => (
          <ListGroup.Item
            key={entry.id}
            className="tw-flex tw-justify-between tw-items-center"
          >
            <div>
              <div className="tw-font-semibold">{entry.name || entry.id}</div>
              <div className="tw-text-sm tw-text-gray-600">{entry.preset} — {new Date(entry.createdAt).toLocaleString()}</div>
            </div>
            <div className="tw-flex tw-gap-2">
              <Button size="sm" variant="outline-success" onClick={() => onLoad(entry.id)}>
                {t("library.load")}
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(entry.id)}>
                {t("library.delete")}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CharacterLibraryPage;
