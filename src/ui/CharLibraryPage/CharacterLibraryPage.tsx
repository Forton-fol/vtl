import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFolderOpen, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { listLibrary, saveToLibrary, removeFromLibrary, LibraryEntry } from "../../lib/libraryStorage";
import { getToken } from "../../api/auth";
import { listCharacters, saveCharacter, deleteCharacter } from "../../api/characters";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";
import { getCharSheetFromLS, removeCharSheetFromLS } from "../../charSheets/root/infrastructure/lsDbService";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      listCharacters().then((res) => {
        if (res && res.characters) {
          const c = res.characters.find((el: any) => el.id === id);
          if (c && c.data) {
            setCharSheet(c.data);
            navigate("/charsheet");
          }
        }
      });
    } else {
      const cs = getCharSheetFromLS(id);
      if (cs) {
        setCharSheet(cs);
        navigate("/charsheet");
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
    <div className="library-page">
      <h2 className="library-header">{t("library.header")}</h2>
      <p className="library-desc">{t("library.description")}</p>

      <div className="tw-mb-6">
        <button className="btn-modern btn-modern-primary" onClick={onSaveCurrent}>
          <FontAwesomeIcon icon={faSave} />
          <span>{t("library.save-current")}</span>
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="library-empty">
          {t("library.no-entries")}
        </div>
      ) : (
        <div className="library-grid">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`library-card ${entry.id === activeSheetId ? "is-active" : ""}`}
            >
              <div className="library-card-name">
                {entry.name || entry.id}
                {entry.id === activeSheetId && (
                  <FontAwesomeIcon icon={faStar} className="tw-ml-2 tw-text-yellow-500" style={{ fontSize: '0.75rem' }} />
                )}
              </div>
              <div className="library-card-preset">
                {entry.preset} — {new Date(entry.createdAt).toLocaleString()}
              </div>
              <div className="library-card-id">
                ID: {entry.id}
              </div>
              <div className="library-card-actions">
                <button className="btn-modern btn-modern-success" onClick={() => onLoad(entry.id)}>
                  <FontAwesomeIcon icon={faFolderOpen} />
                  <span>{t("library.load")}</span>
                </button>
                <button className="btn-modern btn-modern-danger" onClick={() => onDelete(entry.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                  <span>{t("library.delete")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterLibraryPage;
