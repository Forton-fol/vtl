import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import ListGroup from "react-bootstrap/cjs/ListGroup";
import { useTranslation } from "react-i18next";
import { listLibrary, saveToLibrary, removeFromLibrary } from "../../lib/libraryStorage";
import { getToken } from "../../api/auth";
import { listCharacters, saveCharacter, deleteCharacter } from "../../api/characters";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const { setCharSheet, charSheet } = useCharSheetStorage();

  const [entries, setEntries] = useState(() => listLibrary());
  const [serverMode, setServerMode] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    if (serverMode) {
      listCharacters().then((res) => {
        if (res && res.characters) {
          setEntries(res.characters.map((c: any) => ({ id: c.id, name: c.name, preset: c.preset, createdAt: c.created_at, raw: c.data })));
        }
      }).catch(() => setEntries([]));
    } else {
      setEntries(listLibrary());
    }
  }, []);

  function onSaveCurrent() {
    if (serverMode) {
      saveCharacter({ name: charSheet.profile.name, preset: charSheet.preset, data: charSheet }).then((res) => {
        if (res && res.character) {
          setEntries((prev) => [{ id: res.character.id, name: res.character.name, preset: res.character.preset, createdAt: res.character.created_at, raw: res.character.data }, ...prev]);
        }
      });
    } else {
      const entry = saveToLibrary(charSheet);
      setEntries((prev) => [entry, ...prev]);
    }
  }

  function onLoad(id: string) {
    if (serverMode) {
      const e = entries.find((el) => el.id === id);
      if (e) setCharSheet(e.raw);
    } else {
      const e = listLibrary().find((el) => el.id === id);
      if (e) setCharSheet(e.raw);
    }
  }

  function onDelete(id: string) {
    if (serverMode) {
      deleteCharacter(id).then(() => setEntries((prev) => prev.filter((p) => p.id !== id)));
    } else {
      removeFromLibrary(id);
      setEntries(listLibrary());
    }
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
