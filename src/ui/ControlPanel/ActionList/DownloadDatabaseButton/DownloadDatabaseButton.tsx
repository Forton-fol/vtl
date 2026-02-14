import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import { json2File, makeFileName } from "../../../../lib/fileUtils";
import { charSheetToJson } from "../../../../charSheets/root/infrastructure/dbLoader";
import { CharSheetStorageService } from "../../../../charSheets/root/application/ports";

interface DownloadDatabaseButtonProps extends CharSheetStorageService {
  className?: string;
}

export function DownloadDatabaseButton(
  props: DownloadDatabaseButtonProps,
): JSX.Element {
  const { t } = useTranslation();
  const { charSheet, className } = props;

  function downloadDatabaseAsFile(): void {
    json2File(
      charSheetToJson(charSheet),
      makeFileName(
        charSheet.preset + "_" + charSheet.profile.name,
        "json",
        new Date(),
      ),
    );
  }

  return (
    <button
      type="button"
      onClick={() => downloadDatabaseAsFile()}
      className="nav-item-btn"
      title={t("actionMenu.save-database")}
    >
      <FontAwesomeIcon icon={faDownload} />
      <span>{t("actionMenu.save-database")}</span>
    </button>
  );
}
