import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncStatus, onSyncStatus } from "../../../api/autoSync";
import { getToken } from "../../../api/auth";

export function SyncIndicator(): JSX.Element {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [authenticated, setAuthenticated] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    const unsubscribe = onSyncStatus(setStatus);

    function handleStorage() {
      setAuthenticated(!!getToken());
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  let text = "Sync idle";
  let statusClass = "tw-text-gray-300";

  if (!authenticated) {
    text = "Sync disabled";
  } else if (status === "saving") {
    text = "Saving...";
    statusClass = "tw-text-sky-300";
  } else if (status === "saved") {
    text = "Saved";
    statusClass = "tw-text-emerald-300";
  } else if (status === "error") {
    text = "Sync error";
    statusClass = "tw-text-red-300";
  }

  return (
    <div className={`sync-indicator tw-text-xs ${statusClass}`}>
      {text}
    </div>
  );
}
