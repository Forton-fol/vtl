import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faTimes,
  faMoon,
  faSun,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import { PageNav } from "./PageNav";
import { ActionList } from "./ActionList";
import { SettingsSection } from "./SettingsSection";
import { SyncIndicator } from "./SyncIndicator";
import "./ControlPanel.css";
import { SiteTheme } from "../../charSheets/misc/domain";
import { useSettings } from "../../charSheets/misc/services/storageAdapter";

interface ControlPanelProps {
  className?: string;
  onNavigate?: () => void;
  onSettingsToggle?: () => void;
  settingsOpen?: boolean;
  mobile?: boolean;
}

export function ControlPanel(props: ControlPanelProps): JSX.Element {
  const { t } = useTranslation();
  const { className, onNavigate, onSettingsToggle, settingsOpen, mobile } = props;
  const { settings, setSiteTheme } = useSettings();

  const themes: Array<{ value: SiteTheme; label: string; icon: typeof faSun }> = [
    { value: "light", label: "Светлая", icon: faSun },
    { value: "neutral", label: "Нейтрал", icon: faCircleHalfStroke },
    { value: "dark", label: "Темная", icon: faMoon },
  ];

  function renderThemeSwitch() {
    return (
      <div className="theme-switcher" role="group" aria-label="Тема сайта">
        {themes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            className={`theme-switcher__button ${
              settings.siteTheme === theme.value ? "active" : ""
            }`}
            onClick={() => setSiteTheme(theme.value)}
            title={theme.label}
            aria-label={theme.label}
            aria-pressed={settings.siteTheme === theme.value}
          >
            <FontAwesomeIcon icon={theme.icon} />
          </button>
        ))}
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="control-panel-mobile">
        <PageNav onNavigate={onNavigate} mobile />
        <div className="mobile-divider" />
        {renderThemeSwitch()}
        <div className="mobile-divider" />
        <ActionList mobile />
        <div className="mobile-divider" />
        <SyncIndicator />
        <button
          className="nav-item-btn tw-w-full tw-justify-center tw-mt-2"
          onClick={onSettingsToggle}
        >
          <FontAwesomeIcon icon={settingsOpen ? faTimes : faCog} />
          <span>{t("visual-settings.header")}</span>
        </button>
        {settingsOpen && (
          <div className="settings-dropdown-panel" style={{ position: 'static', width: '100%', marginTop: '0.5rem' }}>
            <SettingsSection />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="control-panel-desktop">
      <PageNav onNavigate={onNavigate} />
      <div className="nav-divider" />
      {renderThemeSwitch()}
      <div className="nav-divider" />
      <ActionList />
      <div className="nav-divider" />
      <SyncIndicator />
      <button
        className="nav-item-btn"
        onClick={onSettingsToggle}
        title={t("visual-settings.header")}
      >
        <FontAwesomeIcon icon={settingsOpen ? faTimes : faCog} />
      </button>
      {settingsOpen && (
        <div className="settings-dropdown-panel">
          <SettingsSection />
        </div>
      )}
    </div>
  );
}
