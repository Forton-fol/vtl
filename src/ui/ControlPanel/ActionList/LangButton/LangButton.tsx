import React from "react";
import { useTranslation } from "react-i18next";

import { i18n } from "../../../../i18n";
import enImgUrl from "../../../../../images/en.svg";
import ruImgUrl from "../../../../../images/ru.svg";

interface LangButtonProps {
  lang: "ru" | "en";
  className?: string;
}

export function LangButton(props: LangButtonProps) {
  const { t } = useTranslation();
  const { lang, className } = props;

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(lang)}
      className="nav-item-btn"
      title={t(`actionMenu.lang-${lang}`)}
    >
      <img
        className="tw-w-4 tw-inline"
        src={lang === "en" ? enImgUrl : ruImgUrl}
        alt=""
      />
      <span>{t(`actionMenu.lang-${lang}`)}</span>
    </button>
  );
}
