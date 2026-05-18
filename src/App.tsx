import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

import "./i18n";

import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";

import "./App.css";

import { useTranslation } from "react-i18next";

import { ErrorNotification } from "./uiLib/ErrorNotification";
import { ControlPanel } from "./ui/ControlPanel";
import { CURRENT_VERSION } from "./constants";
import { usePresetLoader, useInternalPresetProps } from "./charSheets";
import { useSettings } from "./charSheets/misc/services/storageAdapter";
import { loadImage, IDB_MARKER } from "./lib/imageStorage";

const CharSheetPage = lazy(() => import("./ui/CharSheetPage/CharSheetPage"));
const CharacterLibraryPage = lazy(
  () => import("./ui/CharLibraryPage/CharacterLibraryPage"),
);
const DonatePage = lazy(() => import("./ui/DonatePage/DonatePage"));
const EncyclopediaPage = lazy(() => import("./ui/EncyclopediaPage/EncyclopediaPage"));
const DarkPackPage = lazy(() => import("./ui/DarkPackPage"));

function AppContent(): JSX.Element {
  const { t } = useTranslation();
  const { displayName } = useInternalPresetProps();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkPackFooterCollapsed, setDarkPackFooterCollapsed] = useState(
    () => {
      try {
        return (
          typeof window !== "undefined" &&
          localStorage.getItem("dark-pack-footer-collapsed") === "1"
        );
      } catch {
        return false;
      }
    },
  );

  function toggleDarkPackFooter() {
    setDarkPackFooterCollapsed((collapsed) => {
      const next = !collapsed;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("dark-pack-footer-collapsed", next ? "1" : "0");
        } catch {}
      }
      return next;
    });
  }

  useEffect(() => {
    document.title = t("about.defaultPageTitle", {
      type: displayName,
      version: CURRENT_VERSION,
    });
  }, [displayName, t]);

  return (
    <div className="app-root">
      {/* TOP NAVIGATION BAR */}
      <header className="top-navbar print:tw-hidden">
        <div className="navbar-inner">
          {/* Logo / Brand */}
          <div className="navbar-brand">
            <span className="brand-icon" aria-hidden="true">✦</span>
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
        <Suspense fallback={<div className="tw-p-8 tw-text-center">Загрузка...</div>}>
          <Routes>
            <Route path="/charsheet" element={<CharSheetPage />} />
            <Route path="/library" element={<CharacterLibraryPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/dark-pack" element={<DarkPackPage />} />
            <Route path="/" element={<CharSheetPage />} />
          </Routes>
        </Suspense>
      </main>

      <footer
        className={`dark-pack-footer print:tw-hidden ${
          darkPackFooterCollapsed ? "dark-pack-footer--collapsed" : ""
        }`}
      >
        <div className="dark-pack-footer__content">
          <img
            className="dark-pack-footer__logo"
            src="/dark-pack-logo.png"
            alt="Dark Pack logo"
          />
          <div className="dark-pack-footer__text">
            <p className="dark-pack-footer__title">
              {t("darkPack.footerTitle")}
            </p>
            {!darkPackFooterCollapsed && (
              <>
                <p>{t("darkPack.legalNotice")}</p>
                <p>{t("darkPack.unofficialNotice")}</p>
                <p>
                  <Link className="dark-pack-footer__link" to="/dark-pack">
                    {t("darkPack.footerLink")}
                  </Link>
                  {" · "}
                  <a
                    className="dark-pack-footer__link"
                    href="https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("darkPack.footerOfficialLink")}
                  </a>
                </p>
              </>
            )}
          </div>
          <button
            className="dark-pack-footer__toggle"
            type="button"
            onClick={toggleDarkPackFooter}
            aria-expanded={!darkPackFooterCollapsed}
            aria-label={
              darkPackFooterCollapsed
                ? t("darkPack.footerExpand")
                : t("darkPack.footerCollapse")
            }
            title={
              darkPackFooterCollapsed
                ? t("darkPack.footerExpand")
                : t("darkPack.footerCollapse")
            }
          >
            <span aria-hidden="true">
              {darkPackFooterCollapsed ? "^" : "v"}
            </span>
          </button>
        </div>
      </footer>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <ErrorNotification />
    </div>
  );
}

function App(): JSX.Element {
  const { settings, setSiteTheme } = useSettings();
  const presetLoaded = usePresetLoader();

  useEffect(() => {
    if (!settings.siteTheme) {
      setSiteTheme("neutral");
    }
  }, [settings.siteTheme, setSiteTheme]);

  useEffect(() => {
    document.body.dataset.theme = settings.siteTheme || "neutral";
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
      loadImage("site_bg").then((data) => {
        if (data) applyBg(data); else clearBg();
      });
    } else if (settings.backgroundImage) {
      applyBg(settings.backgroundImage);
    } else {
      clearBg();
    }

    return () => {
      delete document.body.dataset.theme;
      document.body.style.backgroundColor = "white";
      clearBg();
    };
  }, [settings]);

  if (!presetLoaded) {
    return (
      <div className="app-root tw-flex tw-items-center tw-justify-center min-h-screen">
        <div className="tw-text-lg tw-font-semibold">Загрузка приложения...</div>
      </div>
    );
  }

  return <AppContent />;
}

export default App;
