import React, { useState } from "react";
import Accordion from "react-bootstrap/cjs/Accordion";
import Card from "react-bootstrap/cjs/Card";
import Dropdown from "react-bootstrap/cjs/Dropdown";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { AccordionToggle } from "../../uiLib/AccordionToggle";

import { PageNav } from "./PageNav";
import { ActionList } from "./ActionList";
import { SettingsSection } from "./SettingsSection";
import { SyncIndicator } from "./SyncIndicator";
import "./ControlPanel.css";

interface ControlPanelProps {
  className?: string;
  onNavigate?: () => void;
}

export function ControlPanel(props: ControlPanelProps): JSX.Element {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(true);

  const { className, onNavigate } = props;

  return (
    <div
      className={classnames(
        "ControlPanel tw-flex tw-flex-col tw-h-full",
        className,
      )}
    >
      {showContent && <PageNav className="tw-flex-col tw-mb-8" onNavigate={onNavigate} />}
      {showContent && <SyncIndicator />}

      {showContent && (
        <Accordion as="aside" defaultActiveKey="0">
          <Card style={{ backgroundColor: "inherit", color: "inherit" }}>
            <AccordionToggle
              ariaId="actionMenu-toggle"
              eventKey="0"
              title={t("actionMenu.header")}
              ariaControls="actionMenu-panel"
            />
            <Accordion.Collapse
              id="actionMenu-panel"
              eventKey="0"
              style={{ backgroundColor: "inherit", color: "inherit" }}
              role="region"
              aria-labelledby="actionMenu-toggle"
            >
              <ActionList />
            </Accordion.Collapse>
          </Card>
          <Card style={{ backgroundColor: "inherit", color: "inherit" }}>
            <AccordionToggle
              ariaId="visualSettings-toggle"
              eventKey="1"
              title={t("visual-settings.header")}
              ariaControls="visualSettings-panel"
            />
            <Accordion.Collapse
              id="visualSettings-panel"
              eventKey="1"
              style={{ backgroundColor: "inherit", color: "inherit" }}
              role="region"
              aria-labelledby="visualSettings-toggle"
            >
              <SettingsSection />
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )}
      <div className="tw-flex-1"></div>
      <Dropdown.Item
        as="button"
        type="button"
        aria-label={t(
          showContent ? "buttons.hide-panel" : "buttons.show-panel",
        )}
        onClick={() => setShowContent((prevState) => !prevState)}
        className="tw-py-3 tw-px-6 tw-text-lg tw-flex tw-justify-end tw-items-center tw-h-16"
      >
        {showContent && (
          <span className="tw-mr-4">{t("buttons.hide-panel")}</span>
        )}
        <FontAwesomeIcon
          className="tw-max-h-[1.25rem]"
          icon={showContent ? faChevronLeft : faChevronRight}
        />
      </Dropdown.Item>
    </div>
  );
}
