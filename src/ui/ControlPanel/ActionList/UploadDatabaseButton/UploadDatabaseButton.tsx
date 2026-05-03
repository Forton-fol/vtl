import React, { ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { readTextFile } from "../../../../lib/fileUtils";
import { strToCharSheet } from "../../../../charSheets/root/infrastructure/dbLoader";
import {
  CharSheetStorageService,
  ErrorDescriptionService,
} from "../../../../charSheets/root/application/ports";
import { generateSheetId } from "../../../../lib/miscUtils";

function uploadDatabaseFile(inputRef: React.RefObject<HTMLInputElement>): void {
  const input = inputRef.current;
  if (input) {
    input.value = "";
    input.click();
  }
}

interface UploadDatabaseButtonProps
  extends ErrorDescriptionService,
    CharSheetStorageService {
  className?: string;
}

export function UploadDatabaseButton(
  props: UploadDatabaseButtonProps,
): JSX.Element {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const { setErrorDescription, setCharSheet, className } = props;

  function onUploadFileSelected(evt: ChangeEvent<HTMLInputElement>): void {
    readTextFile(evt)
      .then((databaseStr) => {
        try {
          if (typeof databaseStr !== "string") {
            return;
          }

          const cs = strToCharSheet(databaseStr);
          cs.sheetId = generateSheetId(); // uploaded file gets a fresh unique ID
          setCharSheet(cs);
        } catch (error) {
          setErrorDescription({
            title: t("errors.error-on-file-loading"),
            text: t("errors.check-developer-console"),
          });
          console.error(t("errors.error-on-file-loading"), databaseStr, error);
        }
      })
      .catch((error) => {
        setErrorDescription({
          title: t("errors.error-on-file-loading"),
          text: t("errors.check-developer-console"),
        });
        console.error(t("errors.error-on-file-loading"), error);
      });
  }

  return (
    <button
      type="button"
      onClick={() => uploadDatabaseFile(inputRef)}
      className="nav-item-btn"
      id="uploadDatabaseButton"
      title={t("actionMenu.open-database")}
    >
      <input
        ref={inputRef}
        type="file"
        className="tw-hidden"
        tabIndex={-1}
        aria-labelledby="uploadDatabaseButton"
        onChange={onUploadFileSelected}
      />
      <FontAwesomeIcon icon={faUpload} />
      <span>{t("actionMenu.open-database")}</span>
    </button>
  );
}
