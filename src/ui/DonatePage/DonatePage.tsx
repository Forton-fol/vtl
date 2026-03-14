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
        Серёже на спортзал
      </h1>
      <div className="tw-flex tw-items-center tw-gap-2 tw-mt-6 tw-text-gray-400">
        <FontAwesomeIcon icon={faHardHat} className="tw-text-xl tw-text-yellow-600" />
        <span className="tw-text-lg tw-italic">В процессе разработки</span>
      </div>
    </div>
  );
}
