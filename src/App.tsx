import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// eslint-disable-next-line import/order
import DocumentTitle from "react-document-title";

import "./i18n";

import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";

import "./App.css";

import { useTranslation } from "react-i18next";

import { ErrorNotification } from "./uiLib/ErrorNotification";
import { CharSheetPage } from "./ui/CharSheetPage";
import { CharacterLibraryPage } from "./ui/CharLibraryPage/CharacterLibraryPage";
import { DonatePage } from "./ui/DonatePage/DonatePage";
import { EncyclopediaPage } from "./ui/EncyclopediaPage";
import { ControlPanel } from "./ui/ControlPanel";
import { CURRENT_VERSION } from "./constants";
import { useInternalPresetProps } from "./charSheets";
import { useSettings } from "./charSheets/misc/services/storageAdapter";
import { loadImage, IDB_MARKER } from "./lib/imageStorage";

function App(): JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { displayName } = useInternalPresetProps();

  useEffect(() => {
    document.body.style.backgroundColor = settings.backgroundColor;

    function applyBg(url: string) {
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundRepeat = "no-repeat";
    }
    function clearBg() {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundRepeat = "";
    }

    if (settings.backgroundImage === IDB_MARKER) {
      // Load from IndexedDB
      loadImage("site_bg").then((data) => {
        if (data) applyBg(data); else clearBg();
      });
    } else if (settings.backgroundImage) {
      // Legacy: direct data URL stored in settings
      applyBg(settings.backgroundImage);
    } else {
      clearBg();
    }

    return () => {
      document.body.style.backgroundColor = "white";
      clearBg();
    };
  }, [settings]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <DocumentTitle
      title={t("about.defaultPageTitle", {
        type: displayName,
        version: CURRENT_VERSION,
      })}
    >
      <div className="app-root">
        {/* TOP NAVIGATION BAR */}
        <header className="top-navbar print:tw-hidden">
          <div className="navbar-inner">
            {/* Logo / Brand */}
            <div className="navbar-brand">
              <span className="brand-icon">⚔</span>
              <span className="brand-text">VTM CharSheet</span>
              <span className="brand-version">v{CURRENT_VERSION}</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="navbar-links desktop-only">
              <ControlPanel
                onNavigate={() => setMobileMenuOpen(false)}
                onSettingsToggle={() => setSettingsOpen(!settingsOpen)}
                settingsOpen={settingsOpen}
              />
            </nav>

            {/* Mobile hamburger */}
            <button
              className="mobile-hamburger mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className={`hamburger-icon ${mobileMenuOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="mobile-dropdown">
              <ControlPanel
                onNavigate={() => setMobileMenuOpen(false)}
                onSettingsToggle={() => setSettingsOpen(!settingsOpen)}
                settingsOpen={settingsOpen}
                mobile
              />
            </div>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main className="main-content-area">
          <Routes>
            <Route path="/charsheet" element={<CharSheetPage />} />
            <Route path="/library" element={<CharacterLibraryPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/" element={<CharSheetPage />} />
          </Routes>
        </main>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <ErrorNotification />
      </div>
    </DocumentTitle>
  );
}

export default App;
