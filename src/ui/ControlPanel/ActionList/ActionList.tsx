import React from "react";

import {
  useCharSheetStorage,
  useErrorDescription,
} from "../../../charSheets/root/services/storageAdapter";

import { UploadDatabaseButton } from "./UploadDatabaseButton";
import { DownloadDatabaseButton } from "./DownloadDatabaseButton";
import { CreateDatabaseButton } from "./CreateDatabaseButton";
import { ExportPdfButton } from "./ExportPdfButton";
import { LangButton } from "./LangButton";
import { FullscreenButton } from "./FullscreenButton";
import { AuthSection } from "../AuthSection/AuthSection";

interface ActionListProps {
  className?: string;
  mobile?: boolean;
}

export function ActionList(props: ActionListProps): JSX.Element {
  const { mobile } = props;

  const errorDescriptionService = useErrorDescription();
  const charSheetStorageService = useCharSheetStorage();

  return (
    <div className={mobile ? "action-list-mobile" : "action-list-desktop"}>
      <UploadDatabaseButton
        className="action-item"
        {...errorDescriptionService}
        {...charSheetStorageService}
      />
      <DownloadDatabaseButton
        className="action-item"
        {...charSheetStorageService}
      />
      <CreateDatabaseButton
        className="action-item"
        {...charSheetStorageService}
      />
      <ExportPdfButton className="action-item" />
      <div className="action-item">
        <AuthSection />
      </div>
      {globalThis.GLOBAL_DEFAULT_LANG === "ru" && (
        <>
          <LangButton className="action-item" lang="ru" />
          <LangButton className="action-item" lang="en" />
        </>
      )}
      <FullscreenButton className="action-item" />
    </div>
  );
}
