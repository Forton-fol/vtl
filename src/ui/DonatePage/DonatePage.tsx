import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faHeart,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { faPatreon, faTelegram } from "@fortawesome/free-brands-svg-icons";

export function DonatePage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <section className="contact-page__hero">
        <div className="contact-page__eyebrow">
          <FontAwesomeIcon icon={faNewspaper} />
          <span>{t("donate.eyebrow")}</span>
        </div>
        <h1>{t("donate.title")}</h1>
        <p>{t("donate.description")}</p>
      </section>

      <section className="contact-page__grid" aria-label={t("donate.header")}>
        <a
          href="https://t.me/wodlist"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card contact-card--primary"
        >
          <span className="contact-card__icon">
            <FontAwesomeIcon icon={faTelegram} />
          </span>
          <span className="contact-card__content">
            <span className="contact-card__label">{t("donate.telegramLabel")}</span>
            <span className="contact-card__title">{t("donate.telegramTitle")}</span>
            <span className="contact-card__text">{t("donate.telegramText")}</span>
          </span>
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="contact-card__arrow"
          />
        </a>

        <a
          href="https://www.patreon.com/c/Hosferatu?vanity=user"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span className="contact-card__icon">
            <FontAwesomeIcon icon={faPatreon} />
          </span>
          <span className="contact-card__content">
            <span className="contact-card__label">{t("donate.patreonLabel")}</span>
            <span className="contact-card__title">{t("donate.patreonTitle")}</span>
            <span className="contact-card__text">{t("donate.patreonText")}</span>
          </span>
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="contact-card__arrow"
          />
        </a>
      </section>

      <p className="contact-page__note">
        <FontAwesomeIcon icon={faHeart} />
        <span>{t("donate.note")}</span>
      </p>
    </div>
  );
}

export default DonatePage;
