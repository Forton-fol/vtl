import React from "react";
import "./PageNav.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll, faBookOpen, faDollarSign, faBook } from "@fortawesome/free-solid-svg-icons";

interface PageNavProps {
  className?: string;
  onNavigate?: () => void;
  mobile?: boolean;
}

export function PageNav(props: PageNavProps): JSX.Element {
  const { onNavigate, mobile } = props;
  const { t } = useTranslation();

  return (
    <nav className={mobile ? "page-nav-mobile" : "page-nav-desktop"}>
      <NavLink
        to="/charsheet"
        className={({ isActive }) =>
          `nav-item-btn ${isActive ? "active" : ""}`
        }
        onClick={onNavigate}
      >
        <FontAwesomeIcon icon={faScroll} />
        <span>{t("charsheet.charsheet")}</span>
      </NavLink>
      <NavLink
        to="/library"
        className={({ isActive }) =>
          `nav-item-btn ${isActive ? "active" : ""}`
        }
        onClick={onNavigate}
      >
        <FontAwesomeIcon icon={faBookOpen} />
        <span>{t("library.header")}</span>
      </NavLink>
      <NavLink
        to="/donate"
        className={({ isActive }) =>
          `nav-item-btn ${isActive ? "active" : ""}`
        }
        onClick={onNavigate}
      >
        <FontAwesomeIcon icon={faDollarSign} />
        <span>{t("donate.header")}</span>
      </NavLink>
      <NavLink
        to="/encyclopedia"
        className={({ isActive }) =>
          `nav-item-btn ${isActive ? "active" : ""}`
        }
        onClick={onNavigate}
      >
        <FontAwesomeIcon icon={faBook} />
        <span>Энциклопедия WoD</span>
      </NavLink>
    </nav>
  );
}
