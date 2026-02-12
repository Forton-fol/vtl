import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import ListGroup from "react-bootstrap/cjs/ListGroup";
import { useTranslation } from "react-i18next";
import { listLibrary, saveToLibrary, removeFromLibrary, LibraryEntry } from "../../lib/libraryStorage";
import { getToken } from "../../api/auth";
import { listCharacters, saveCharacter, deleteCharacter } from "../../api/characters";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";
import { getCharSheetFromLS, removeCharSheetFromLS } from "../../charSheets/root/infrastructure/lsDbService";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const { setCharSheet, charSheet } = useCharSheetStorage();

  const [entries, setEntries] = useState<LibraryEntry[]>(() => listLibrary());
  const [serverMode, setServerMode] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    if (serverMode) {
      listCharacters().then((res) => {
        if (res && res.characters) {
          setEntries(res.characters.map((c: any) => ({
            id: c.id,
            name: c.name,
            preset: c.preset,
            createdAt: c.created_at,
            updatedAt: c.updated_at || c.created_at,
          })));
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
          setEntries((prev) => [{
            id: res.character.id,
            name: res.character.name,
            preset: res.character.preset,
            createdAt: res.character.created_at,
            updatedAt: res.character.updated_at || res.character.created_at,
          }, ...prev]);
        }
      });
    } else {
      saveToLibrary(charSheet);
      setEntries(listLibrary());
    }
  }

  function onLoad(id: string) {
    if (serverMode) {
      // server mode: fetch from server entries (which include data)
      listCharacters().then((res) => {
        if (res && res.characters) {
          const c = res.characters.find((el: any) => el.id === id);
          if (c && c.data) setCharSheet(c.data);
        }
      });
    } else {
      // local mode: load from localStorage by sheetId
      const cs = getCharSheetFromLS(id);
      if (cs) {
        setCharSheet(cs);
      }
    }
  }

  function onDelete(id: string) {
    if (serverMode) {
      deleteCharacter(id).then(() => setEntries((prev) => prev.filter((p) => p.id !== id)));
    } else {
      removeFromLibrary(id);
      removeCharSheetFromLS(id);
      setEntries(listLibrary());
    }
  }

  const activeSheetId = charSheet.sheetId;

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
            style={entry.id === activeSheetId ? { borderLeft: "3px solid #337ab7" } : {}}
          >
            <div>
              <div className="tw-font-semibold">
                {entry.name || entry.id}
                {entry.id === activeSheetId && " ✦"}
              </div>
              <div className="tw-text-sm tw-text-gray-600">
                {entry.preset} — {new Date(entry.createdAt).toLocaleString()}
              </div>
              <div className="tw-text-xs tw-text-gray-400">
                ID: {entry.id}
              </div>
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
