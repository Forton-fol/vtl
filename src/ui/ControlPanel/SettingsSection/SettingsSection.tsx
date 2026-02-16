import React, { ChangeEvent, useState } from "react";
import Form from "react-bootstrap/cjs/Form";
import Button from "react-bootstrap/cjs/Button";
import { useTranslation } from "react-i18next";

import { initialSettings } from "../../../charSheets/misc/services/initialValues";
import { useSettings } from "../../../charSheets/misc/services/storageAdapter";
import { getAutoSaveEnabled, setAutoSaveEnabled } from "../../../lib/libraryStorage";

interface SettingsSectionProps {}

export function SettingsSection(props: SettingsSectionProps): JSX.Element {
  const { t } = useTranslation();
  const {
    settings,
    setBackgroundColor,
    setCharsheetBackMode,
    setCharsheetBackColor,
    setCharsheetBackImage,
    setCharsheetTextColor,
    setSidebarColor,
    setSidebarTextColor,
    setCharsheetBorderVisible,
    setCharsheetFontSize,
    setCharsheetBackOpacity,
    setBackgroundImage,
    setSidebarOpacity,
  } = useSettings();

  const [autoSave, setAutoSave] = useState(() => getAutoSaveEnabled());

  function handleAutoSaveToggle(checked: boolean) {
    setAutoSave(checked);
    setAutoSaveEnabled(checked);
  }

  function readImage(event: ChangeEvent<HTMLInputElement>): void {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = readerEvent.target?.result;
      if (typeof imageData === "string") {
        setCharsheetBackImage(imageData);
      }
    };
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function readSiteBackgroundImage(event: ChangeEvent<HTMLInputElement>): void {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = readerEvent.target?.result;
      if (typeof imageData === "string") {
        setBackgroundImage(imageData);
      }
    };
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  return (
    <div className="SettingsSection" style={{ color: '#c8d6e5' }}>
      {/* Auto-save toggle */}
      <div className="tw-m-4">
        <Form.Check
          type="checkbox"
          id="autosave-toggle"
          label={t("visual-settings.autosave-enabled")}
          checked={autoSave}
          onChange={(e) => handleAutoSaveToggle(e.target.checked)}
        />
      </div>

      <div className="tw-m-4">
        <label className="tw-mr-4">
          <span className="tw-mr-4">
            {t("visual-settings.background-color")}
          </span>
          <input
            type="color"
            className="background-color-input"
            value={settings.backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </label>
      </div>

      {/* Site background image */}
      <div className="tw-m-4">
        <h3 className="tw-text-lg tw-mb-4">
          {t("visual-settings.site-background-image")}
        </h3>
        <label className="tw-block tw-mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={readSiteBackgroundImage}
          />
        </label>
        {settings.backgroundImage && (
          <Button
            className="custom-btn-bg-color"
            onClick={() => setBackgroundImage("")}
          >
            {t("visual-settings.remove-site-background-image")}
          </Button>
        )}
      </div>
      <div className="tw-m-4">
        <h3 className="tw-text-lg tw-mb-4">
          {t("visual-settings.charsheet-background-mode")}
        </h3>
        <Form.Check
          type="radio"
          id="charsheet-none"
          name="charsheet-back-mode"
          className="tw-mb-4"
          label={t("visual-settings.charsheet-none")}
          checked={settings.charsheetBackMode === "charsheet-none"}
          onChange={(e) => setCharsheetBackMode("charsheet-none")}
        />
        <Form.Check
          type="radio"
          id="charsheet-color"
          name="charsheet-back-mode"
          className="tw-mb-2"
          label={t("visual-settings.charsheet-color")}
          checked={settings.charsheetBackMode === "charsheet-color"}
          onChange={(e) => setCharsheetBackMode("charsheet-color")}
        />
        <fieldset className="tw-border-2 tw-border-solid tw-border-gray-600 tw-px-6 tw-py-4 tw-mb-4">
          <label className="tw-mr-4">
            <span className="tw-mr-4">
              {t("visual-settings.charsheet-background-color")}
            </span>
            <input
              type="color"
              className="charsheet-background-color-input"
              value={settings.charsheetBackColor}
              onChange={(e) => setCharsheetBackColor(e.target.value)}
              disabled={settings.charsheetBackMode !== "charsheet-color"}
            />
          </label>
        </fieldset>
        <Form.Check
          type="radio"
          id="charsheet-image"
          name="charsheet-back-mode"
          className="tw-mb-2"
          label={t("visual-settings.charsheet-image")}
          checked={settings.charsheetBackMode === "charsheet-image"}
          onChange={(e) => setCharsheetBackMode("charsheet-image")}
        />
        <fieldset className="tw-border-2 tw-border-solid tw-border-gray-600 tw-px-6 tw-py-4">
          <div className="tw-mb-8">
            <label>
              <span className="tw-mr-4">
                {t("visual-settings.charsheet-background-image")}
              </span>
              <input
                type="file"
                className="charsheet-background-image-input"
                onChange={readImage}
                disabled={settings.charsheetBackMode !== "charsheet-image"}
              />
            </label>
          </div>
          <div>
            <Button
              className="back-image-to-default custom-btn-bg-color"
              onClick={() =>
                setCharsheetBackImage(initialSettings.charsheetBackImage_v2)
              }
              disabled={settings.charsheetBackMode !== "charsheet-image"}
            >
              {t("visual-settings.to-default-background-image")}
            </Button>
          </div>
        </fieldset>
      </div>

      {/* Text color */}
      <div className="tw-m-4">
        <label className="tw-mr-4">
          <span className="tw-mr-4">
            {t("visual-settings.charsheet-text-color")}
          </span>
          <input
            type="color"
            value={settings.charsheetTextColor || "#000000"}
            onChange={(e) => setCharsheetTextColor(e.target.value)}
          />
        </label>
      </div>

      {/* Sidebar colors */}
      <div className="tw-m-4">
        <h3 className="tw-text-lg tw-mb-4">
          {t("visual-settings.sidebar-settings")}
        </h3>
        <label className="tw-block tw-mb-4">
          <span className="tw-mr-4">
            {t("visual-settings.sidebar-color")}
          </span>
          <input
            type="color"
            value={settings.sidebarColor || "#e5e7eb"}
            onChange={(e) => setSidebarColor(e.target.value)}
          />
        </label>
        <label className="tw-block tw-mb-4">
          <span className="tw-mr-4">
            {t("visual-settings.sidebar-text-color")}
          </span>
          <input
            type="color"
            value={settings.sidebarTextColor || "#111827"}
            onChange={(e) => setSidebarTextColor(e.target.value)}
          />
        </label>
        <label className="tw-block tw-mb-2">
          <span className="tw-mr-4">
            {t("visual-settings.sidebar-opacity")}: {settings.sidebarOpacity ?? 100}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={settings.sidebarOpacity ?? 100}
          onChange={(e) => setSidebarOpacity(Number(e.target.value))}
          className="tw-w-full"
        />
      </div>

      {/* Border toggle */}
      <div className="tw-m-4">
        <Form.Check
          type="checkbox"
          id="charsheet-border-visible"
          label={t("visual-settings.charsheet-border-visible")}
          checked={settings.charsheetBorderVisible !== false}
          onChange={(e) => setCharsheetBorderVisible(e.target.checked)}
        />
      </div>

      {/* Font size slider */}
      <div className="tw-m-4">
        <label className="tw-block tw-mb-2">
          <span className="tw-mr-4">
            {t("visual-settings.charsheet-font-size")}: {settings.charsheetFontSize ?? 100}%
          </span>
        </label>
        <input
          type="range"
          min={50}
          max={150}
          step={5}
          value={settings.charsheetFontSize ?? 100}
          onChange={(e) => setCharsheetFontSize(Number(e.target.value))}
          className="tw-w-full"
        />
      </div>

      {/* Background opacity slider */}
      <div className="tw-m-4">
        <label className="tw-block tw-mb-2">
          <span className="tw-mr-4">
            {t("visual-settings.charsheet-back-opacity")}: {settings.charsheetBackOpacity ?? 100}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={settings.charsheetBackOpacity ?? 100}
          onChange={(e) => setCharsheetBackOpacity(Number(e.target.value))}
          className="tw-w-full"
        />
      </div>
    </div>
  );
}
