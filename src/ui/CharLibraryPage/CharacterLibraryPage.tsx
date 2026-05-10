import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFolderOpen, faTrash, faStar, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { listLibrary, saveToLibrary, removeFromLibrary, LibraryEntry } from "../../lib/libraryStorage";
import { getToken } from "../../api/auth";
import { listCharacters, saveCharacter, deleteCharacter, getCharacter } from "../../api/characters";
import { useCharSheetStorage } from "../../charSheets/root/services/storageAdapter";
import { getCharSheetFromLS, removeCharSheetFromLS, saveCharSheetInLS } from "../../charSheets/root/infrastructure/lsDbService";
import { useToast } from "../../uiLib/ToastNotification";
import { CharSheet } from "../../charSheets/root/domain";

export function CharacterLibraryPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCharSheet, charSheet } = useCharSheetStorage();
  const toast = useToast();

  const serverMode = !!getToken();
  const [entries, setEntries] = useState<LibraryEntry[]>(() => listLibrary());
  const [nextOffset, setNextOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(() => listLibrary().length);
  const [characterLimit, setCharacterLimit] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedItem, setDeletedItem] = useState<{ entry: LibraryEntry; sheet: CharSheet } | null>(null);
  const pageSize = 20;

  const visibleEntries = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return entries;
    }
    return entries.filter((entry) => {
      return [entry.name, entry.preset, entry.id].some((value) =>
        value.toLowerCase().includes(normalized),
      );
    });
  }, [entries, searchQuery]);

  function mapServerEntries(characters: any[]): LibraryEntry[] {
    return characters.map((c: any) => ({
      id: c.id,
      name: c.name,
      preset: c.preset,
      createdAt: c.created_at,
      updatedAt: c.updated_at || c.created_at,
    }));
  }

  async function loadServerPage(offset: number) {
    setLoading(true);
    try {
      const res = await listCharacters({ limit: pageSize, offset });
      if (res && res.characters) {
        const nextEntries = mapServerEntries(res.characters);
        setEntries((prev) => (offset === 0 ? nextEntries : [...prev, ...nextEntries]));
        setNextOffset(res.offset + res.characters.length);
        setHasMore(res.offset + res.characters.length < res.total);
        setTotalCount(res.total);
        setCharacterLimit(res.characterLimit ?? null);
        setError(null);
      } else {
        setEntries([]);
        setHasMore(false);
        setTotalCount(0);
        setError(t("library.fetchError") || "Не удалось загрузить библиотеку");
      }
    } catch (err) {
      console.error("Library load error", err);
      setError(t("library.fetchError") || "Не удалось загрузить библиотеку");
      toast.notify({
        title: "Library error",
        message: "Failed to load library entries.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (serverMode) {
      loadServerPage(0);
    } else {
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
      setHasMore(false);
      setCharacterLimit(null);
      setError(null);
    }
  }, [serverMode]);

  async function onSaveCurrent() {
    if (serverMode) {
      setLoading(true);
      try {
        const res = await saveCharacter({ name: charSheet.profile.name || "", preset: charSheet.preset || "", data: charSheet });
        if (res && res.character) {
          const entry = mapServerEntries([res.character])[0];
          setEntries((prev) => {
            const existed = prev.some((item) => item.id === entry.id);
            if (!existed) {
              setTotalCount((count) => count + 1);
            }
            return [entry, ...prev.filter((item) => item.id !== entry.id)];
          });
          toast.notify({
            title: t("library.saveSuccess") || "Saved",
            message: t("library.saveSuccessMessage") || "Character saved to server library.",
            type: "success",
          });
        } else {
          throw new Error("Server save result invalid");
        }
      } catch (err) {
        console.error("Save current character error", err);
        toast.notify({
          title: "Save failed",
          message: "Unable to save character.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      saveToLibrary(charSheet);
      saveCharSheetInLS(charSheet);
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
      toast.notify({
        title: t("library.savedLocal") || "Saved locally",
        message: t("library.savedLocalMessage") || "Character saved to local library.",
        type: "success",
      });
    }
  }

  function onLoad(id: string) {
    if (serverMode) {
      getCharacter(id).then((res) => {
        if (res?.character?.data) {
          setCharSheet(res.character.data);
          navigate("/charsheet");
        } else {
          toast.notify({
            title: "Load failed",
            message: "Unable to open character from server.",
            type: "error",
          });
        }
      }).catch((err) => {
        console.error("Library load entry error", err);
        toast.notify({
          title: "Load failed",
          message: "Unable to open character from server.",
          type: "error",
        });
      });
    } else {
      const cs = getCharSheetFromLS(id);
      if (cs) {
        setCharSheet(cs);
        navigate("/charsheet");
      } else {
        toast.notify({
          title: "Load failed",
      message: "Unable to open character from local storage.",
          type: "error",
        });
      }
    }
  }

  function undoDelete() {
    if (!deletedItem) return;
    saveCharSheetInLS(deletedItem.sheet);
    saveToLibrary(deletedItem.sheet);
    setEntries(listLibrary());
    setTotalCount(listLibrary().length);
    toast.notify({
      title: "Restored",
      message: "Character has been restored to your library.",
      type: "success",
    });
    setDeletedItem(null);
  }

  async function onDelete(id: string) {
    if (serverMode) {
      if (!window.confirm("Delete this item from the server library?")) {
        return;
      }
      try {
        await deleteCharacter(id);
        setEntries((prev) => prev.filter((p) => p.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        toast.notify({
          title: t("library.deleted") || "Deleted",
          message: t("library.deletedMessage") || "Character deleted from server library.",
          type: "warning",
        });
      } catch (err) {
        console.error("Delete library entry error", err);
        toast.notify({
          title: "Delete failed",
          message: "Unable to delete character.",
          type: "error",
        });
      }
    } else {
      const sheet = getCharSheetFromLS(id);
      const entry = entries.find((item) => item.id === id);
      if (sheet && entry) {
        setDeletedItem({ entry, sheet });
      }
      removeFromLibrary(id);
      removeCharSheetFromLS(id);
      setEntries(listLibrary());
      setTotalCount(listLibrary().length);
      toast.notify({
        title: "Deleted",
        message: "Character removed from local library.",
        type: "warning",
        actionLabel: "Undo",
        onAction: undoDelete,
      });
    }
  }

  function onLoadMore() {
    if (!serverMode || !hasMore || loading) return;
    loadServerPage(nextOffset);
  }

  const activeSheetId = charSheet.sheetId;
  const limitText = characterLimit === null ? t("library.unlimited") : characterLimit;
  const isAtLimit = characterLimit !== null && totalCount >= characterLimit;

  return (
    <div className="library-page">
      <h2 className="library-header">{t("library.header")}</h2>
      <p className="library-desc">{t("library.description")}</p>

      <div className="tw-mb-6 tw-flex tw-flex-col tw-gap-3 md:tw-flex-row md:tw-items-center md:tw-justify-between">
        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
          <button
            className="btn-modern btn-modern-primary"
            onClick={onSaveCurrent}
            disabled={(serverMode && isAtLimit) || loading}
          >
            <FontAwesomeIcon icon={faSave} />
            <span>{t("library.save-current")}</span>
          </button>
          <div className={`tw-text-sm ${isAtLimit ? "tw-text-red-400" : "tw-text-gray-400"}`}>
            {t("library.character-count", { count: totalCount, limit: limitText })}
          </div>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2 tw-w-full md:tw-w-auto">
          <label className="tw-relative tw-flex tw-items-center tw-w-full md:tw-w-80">
            <FontAwesomeIcon icon={faSearch} className="tw-absolute tw-left-3 tw-text-gray-400" />
            <input
              className="tw-w-full tw-pl-10 tw-pr-10 tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-600 tw-bg-gray-800 tw-text-white tw-text-sm"
              placeholder="Search by name, preset or id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="tw-absolute tw-right-2 tw-text-gray-400 hover:tw-text-white"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="tw-mb-4 tw-rounded-lg tw-border tw-border-red-600 tw-bg-red-950/70 tw-p-4 tw-text-sm tw-text-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="tw-mb-4 tw-text-sm tw-text-gray-300">Loading library...</div>
      )}

      {visibleEntries.length === 0 ? (
        <div className="library-empty">
          {searchQuery
            ? "No entries match your search."
            : t("library.no-entries")}
        </div>
      ) : (
        <div className="library-grid">
          {visibleEntries.map((entry) => (
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
          <button className="btn-modern" onClick={onLoadMore} disabled={loading}>
            <span>Load more</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CharacterLibraryPage;
