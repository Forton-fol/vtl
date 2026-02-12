import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { Subheader, RangeInput2 } from "../../generic/uiPrimitives";
import {
  HealthSection,
  MeritsSection,
  FlawsSection,
  WillSection,
  ExperienceSection,
} from "../../generic/uiSections";
import {
  useMeritsNFlaws,
  useStatus,
  useHealth,
} from "../../generic/services/storageAdapter";
import { DemonStatusService } from "../application/ports";

interface StatusSectionProps extends DemonStatusService {
  className?: string;
}

export function StatusSection(props: StatusSectionProps): JSX.Element {
  const { className, state, setFaithRating, setFaithPool, setTormentPermanent, setTormentTemporary } = props;
  const { t } = useTranslation();

  const meritsNFlawsService = useMeritsNFlaws();
  const statusService = useStatus();
  const healthService = useHealth();

  return (
    <div className={classnames("StatusSection tw-flex tw-gap-x-4", className)}>
      {/* Column 1: Faith + Torment + Willpower */}
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2">
          {t("charsheet.demon.faith", "Вера")}
        </Subheader>
        <div className="tw-mb-4">
          <fieldset aria-label={t("charsheet.demon.faith-rating", "Рейтинг Веры")}>
            <RangeInput2
              max={10}
              name="faithRating"
              value={state.faithRating}
              dataContext="rating"
              onClick={(value: number) => setFaithRating(value)}
              className="tw-h-6"
              multiplier={1.3}
            />
          </fieldset>
          <fieldset aria-label={t("charsheet.demon.faith-pool", "Пул Веры")}>
            <RangeInput2
              max={10}
              name="faithPool"
              value={state.faithPool}
              dataContext="pool"
              onClick={(value: number) => setFaithPool(value)}
              className="tw-h-6"
              variant="square"
              multiplier={1.3}
            />
          </fieldset>
        </div>

        <Subheader className="tw-mb-2">
          {t("charsheet.demon.torment", "Мука")}
        </Subheader>
        <div className="tw-mb-4">
          <div className="tw-text-xs tw-text-center tw-mb-1">
            {t("charsheet.demon.torment-permanent", "Постоянная")}
          </div>
          <fieldset aria-label={t("charsheet.demon.torment-permanent", "Постоянная Мука")}>
            <RangeInput2
              max={10}
              name="tormentPermanent"
              value={state.tormentPermanent}
              dataContext="permanent"
              onClick={(value: number) => setTormentPermanent(value)}
              className="tw-h-6"
              multiplier={1.3}
            />
          </fieldset>
          <div className="tw-text-xs tw-text-center tw-mb-1 tw-mt-1">
            {t("charsheet.demon.torment-temporary", "Временная")}
          </div>
          <fieldset aria-label={t("charsheet.demon.torment-temporary", "Временная Мука")}>
            <RangeInput2
              max={10}
              name="tormentTemporary"
              value={state.tormentTemporary}
              dataContext="temporary"
              onClick={(value: number) => setTormentTemporary(value)}
              className="tw-h-6"
              variant="square"
              multiplier={1.3}
            />
          </fieldset>
        </div>

        <Subheader className="tw-mb-2">
          {t("charsheet.status.willpower")}
        </Subheader>
        <WillSection className="tw-mb-4" {...statusService} />

        <Subheader className="tw-mb-2">
          {t("charsheet.status.experience")}
        </Subheader>
        <ExperienceSection {...statusService} />
      </div>

      {/* Column 2: Health */}
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2">
          {t("charsheet.status.health")}
        </Subheader>
        <HealthSection className="tw-mb-6 print:tw-mb-2" {...healthService} />
      </div>

      {/* Column 3: Merits & Flaws */}
      <div className="tw-flex-1">
        <Subheader className="tw-mb-2">
          {t("charsheet.status.merits")}
        </Subheader>
        <MeritsSection className="tw-mb-4" {...meritsNFlawsService} />

        <Subheader className="tw-mb-2">
          {t("charsheet.status.flaws")}
        </Subheader>
        <FlawsSection {...meritsNFlawsService} />
      </div>
    </div>
  );
}
