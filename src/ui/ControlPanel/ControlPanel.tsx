import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { PageNav } from "./PageNav";
import { ActionList } from "./ActionList";
import { SettingsSection } from "./SettingsSection";
import { SyncIndicator } from "./SyncIndicator";
import "./ControlPanel.css";

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

  if (mobile) {
    return (
      <div className="control-panel-mobile">
        <PageNav onNavigate={onNavigate} mobile />
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
