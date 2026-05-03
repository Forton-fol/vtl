import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faHardHat } from "@fortawesome/free-solid-svg-icons";

export function DonatePage(): JSX.Element {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-[60vh] tw-text-center tw-p-8">
      <FontAwesomeIcon
        icon={faDollarSign}
        className="tw-text-6xl tw-text-yellow-500 tw-mb-6"
      />
      <h1 className="tw-text-3xl tw-font-bold tw-mb-4">
        Поддержать проект на Patreon
      </h1>
      <p className="tw-mb-6 tw-text-lg tw-text-gray-300">
        Если вам нравится VTM CharSheet, вы можете поддержать развитие проекта на Patreon.
      </p>
      <a
        href="https://www.patreon.com/c/Hosferatu?vanity=user"
        target="_blank"
        rel="noopener noreferrer"
        className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-xl tw-bg-yellow-500 tw-px-6 tw-py-3 tw-text-black tw-font-semibold tw-shadow-lg hover:tw-bg-yellow-400"
      >
        <FontAwesomeIcon icon={faHardHat} className="tw-text-xl" />
        Перейти на Patreon
      </a>
    </div>
  );
}

export default DonatePage;
