import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFolderOpen, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { listLibrary, saveToLibrary, removeFromLibrary, LibraryEntry } from "../../lib/libraryStorage";
import { getToken } from "../../api/auth";
import { listCharacters, saveCharacter, deleteCharacter, getCharacter } from "../../api/characters";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";
import { getCharSheetFromLS, removeCharSheetFromLS, saveCharSheetInLS } from "../../charSheets/root/infrastructure/lsDbService";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCharSheet, charSheet } = useCharSheetStorage();

  const [entries, setEntries] = useState<LibraryEntry[]>(() => listLibrary());
  const [serverMode, setServerMode] = useState<boolean>(() => !!getToken());
  const [nextOffset, setNextOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(() => listLibrary().length);
  const [characterLimit, setCharacterLimit] = useState<number | null>(null);
  const pageSize = 20;

  useEffect(() => {
    if (serverMode) {
      listCharacters({ limit: pageSize, offset: 0 }).then((res) => {
        if (res && res.characters) {
          setEntries(res.characters.map((c: any) => ({
            id: c.id,
            name: c.name,
            preset: c.preset,
            createdAt: c.created_at,
            updatedAt: c.updated_at || c.created_at,
          })));
          setNextOffset(res.offset + res.characters.length);
          setHasMore(res.offset + res.characters.length < res.total);
          setTotalCount(res.total);
          setCharacterLimit(res.characterLimit ?? null);
        }
      }).catch(() => setEntries([]));
    } else {
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
    }
  }, []);

  function onSaveCurrent() {
    if (serverMode) {
      saveCharacter({ name: charSheet.profile.name, preset: charSheet.preset, data: charSheet }).then((res) => {
        if (res && res.character) {
          const entry = {
            id: res.character.id,
            name: res.character.name,
            preset: res.character.preset,
            createdAt: res.character.created_at,
            updatedAt: res.character.updated_at || res.character.created_at,
          };
          setEntries((prev) => {
            const existed = prev.some((item) => item.id === entry.id);
            setTotalCount((count) => count + (existed ? 0 : 1));
            return [entry, ...prev.filter((item) => item.id !== entry.id)];
          });
        }
      });
    } else {
      saveToLibrary(charSheet);
      saveCharSheetInLS(charSheet);
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
    }
  }

  function onLoad(id: string) {
    if (serverMode) {
      getCharacter(id).then((res) => {
        if (res?.character?.data) {
          setCharSheet(res.character.data);
          navigate("/charsheet");
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
      deleteCharacter(id).then(() => {
        setEntries((prev) => prev.filter((p) => p.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      });
    } else {
      removeFromLibrary(id);
      removeCharSheetFromLS(id);
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
    }
  }

  function onLoadMore() {
    if (!serverMode || !hasMore) return;

    listCharacters({ limit: pageSize, offset: nextOffset }).then((res) => {
      if (res && res.characters) {
        const nextEntries = res.characters.map((c: any) => ({
          id: c.id,
          name: c.name,
          preset: c.preset,
          createdAt: c.created_at,
          updatedAt: c.updated_at || c.created_at,
        }));
        setEntries((prev) => [...prev, ...nextEntries]);
        setNextOffset(res.offset + res.characters.length);
        setHasMore(res.offset + res.characters.length < res.total);
        setTotalCount(res.total);
        setCharacterLimit(res.characterLimit ?? null);
      }
    });
  }

  const activeSheetId = charSheet.sheetId;
  const limitText = characterLimit === null ? t("library.unlimited") : characterLimit;
  const isAtLimit = characterLimit !== null && totalCount >= characterLimit;

  return (
    <div className="library-page">
      <h2 className="library-header">{t("library.header")}</h2>
      <p className="library-desc">{t("library.description")}</p>

      <div className="tw-mb-6 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
        <button className="btn-modern btn-modern-primary" onClick={onSaveCurrent} disabled={serverMode && isAtLimit}>
          <FontAwesomeIcon icon={faSave} />
          <span>{t("library.save-current")}</span>
        </button>
        <div className={`tw-text-sm ${isAtLimit ? "tw-text-red-400" : "tw-text-gray-400"}`}>
          {t("library.character-count", { count: totalCount, limit: limitText })}
        </div>
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

      {serverMode && hasMore && (
        <div className="tw-mt-6">
          <button className="btn-modern" onClick={onLoadMore}>
            <span>Load more</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CharacterLibraryPage;
