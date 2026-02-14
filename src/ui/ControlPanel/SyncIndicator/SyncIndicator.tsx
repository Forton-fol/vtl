import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncStatus, onSyncStatus } from "../../../api/autoSync";
import { getToken } from "../../../api/auth";

export function SyncIndicator(): JSX.Element | null {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());

  useEffect(() => {
    setLoggedIn(!!getToken());
  });

  useEffect(() => {
    const unsubscribe = onSyncStatus((s) => {
      setStatus(s);
      if (s === "saved") {
        setTimeout(() => setStatus("idle"), 2000);
      }
    });
    return unsubscribe;
  }, []);

  if (!loggedIn) return null;

  const labels: Record<SyncStatus, string> = {
    idle: "",
    saving: t("sync.saving"),
    saved: t("sync.saved"),
    error: t("sync.error"),
  };

  const icons: Record<SyncStatus, string> = {
    idle: "",
    saving: "⏳",
    saved: "✅",
    error: "❌",
  };

  if (status === "idle") return null;

  return (
    <div className={`sync-indicator ${status}`}>
      <span>{icons[status]}</span>
      <span>{labels[status]}</span>
    </div>
  );
}
