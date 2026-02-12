import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// eslint-disable-next-line import/order
import DocumentTitle from "react-document-title";

import "./i18n";

import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";

// import logo from './logo.svg';
import "./App.css";

// import { Settings } from "luxon";

import { useTranslation } from "react-i18next";

// import { defaultLang } from "./i18nResources";

// import { Header } from "./ui/Header";
import { ErrorNotification } from "./uiLib/ErrorNotification";
import { CharSheetPage } from "./ui/CharSheetPage";
import { CharacterLibraryPage } from "./ui/CharLibraryPage/CharacterLibraryPage";
import { AboutPage } from "./ui/AboutPage";
import { ControlPanel } from "./ui/ControlPanel";
import { CURRENT_VERSION } from "./constants";
import { useInternalPresetProps } from "./charSheets";
import { useSettings } from "./charSheets/misc/services/storageAdapter";

function App(): JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { displayName } = useInternalPresetProps();

  useEffect(() => {
    document.body.style.backgroundColor = settings.backgroundColor;
    if (settings.backgroundImage) {
      document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundRepeat = "no-repeat";
    } else {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundRepeat = "";
    }

    return () => {
      document.body.style.backgroundColor = "white";
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundRepeat = "";
    };
  }, [settings]);

  return (
    <DocumentTitle
      title={t("about.defaultPageTitle", {
        type: displayName,
        version: CURRENT_VERSION,
      })}
    >
      <div className="app" style={{ height: "100vh", overflow: "hidden" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div
            className="print:tw-hidden"
            style={{
              flexGrow: 0,
              flexShrink: 0,
              maxWidth: "24rem",
              overflowY: "auto",
              backgroundColor: settings.sidebarColor || "#e5e7eb",
              color: settings.sidebarTextColor || "#111827",
              opacity: (settings.sidebarOpacity ?? 100) / 100,
            }}
          >
            <ControlPanel />
          </div>
          <div style={{ flexGrow: 1, width: "100%", overflowY: "auto" }}>
            <Routes>
              <Route path="/charsheet" element={<CharSheetPage />} />
              <Route path="/library" element={<CharacterLibraryPage />} />
              <Route path="/" element={<CharSheetPage />} />
            </Routes>
          </div>
        </div>
        <ErrorNotification />
      </div>
    </DocumentTitle>
  );
}

export default App;
