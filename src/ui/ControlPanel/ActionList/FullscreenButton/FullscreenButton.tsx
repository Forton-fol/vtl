import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

interface FullscreenButtonProps {
  className?: string;
}

export function FullscreenButton(props: FullscreenButtonProps) {
  const { t } = useTranslation();
  const { className } = props;

  function onClick() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="nav-item-btn"
      title={t("actionMenu.fullscreen-toggle")}
    >
      <FontAwesomeIcon icon={faExpand} />
    </button>
  );
}
