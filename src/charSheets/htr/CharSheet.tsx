import React from "react";
import { useTranslation } from "react-i18next";

import { useLimits } from "../../charSheets/root/services/storageAdapter";
import {
  useOtherTraits,
  useCharHistory,
  useAlliesAndContacts,
  usePossessions,
  useAppearance,
  useNotes,
  useMeritsNFlaws,
  useHealth,
} from "../generic/services/storageAdapter";
import { CharSheetBody, SectionHeader } from "../generic/uiPrimitives";
import {
  AlliesAndContactsSection,
  AppearanceDescriptionSection,
  CharacterImageSection,
  CharHistorySection,
  CharSheetStarter,
  GoalsSection,
  NotesSection,
  OtherTraitsSection,
  PossessionsSection,
  MeritsSection,
  FlawsSection,
  HealthSection,
} from "../generic/uiSections";

import { useEdges, useHTRVirtues } from "./services/storageAdapter";
import { AdvantagesSection } from "./uiSections/AdvantagesSection";
import { StatusSection } from "./uiSections/StatusSection";

interface CharSheetProps {}

export function CharSheet(props: CharSheetProps): JSX.Element {
  const { t } = useTranslation();

  const otherTraitsService = useOtherTraits();
  const historyService = useCharHistory();
  const { limits } = useLimits();
  const alliesAndContactsService = useAlliesAndContacts();
  const possessionsService = usePossessions();
  const appearanceService = useAppearance();
  const notesService = useNotes();
  const meritsNFlawsService = useMeritsNFlaws();
  const healthService = useHealth();

  const edgesService = useEdges();
  const virtuesService = useHTRVirtues();

  return (
    <>
      <CharSheetBody>
        <CharSheetStarter />
        <SectionHeader className="tw-mb-3">
          {t("charsheet.advantages.header")}
        </SectionHeader>
        <AdvantagesSection className="tw-mb-3" {...edgesService} {...virtuesService} />

        <SectionHeader className="tw-mb-3">
          {t("charsheet.status.header")}
        </SectionHeader>
        <StatusSection className="tw-mb-3" {...virtuesService} />
      </CharSheetBody>

      <CharSheetBody>
        <div className="tw-flex tw-gap-x-4 tw-mb-6">
          <div className="tw-flex-1">
            <SectionHeader className="tw-mb-3">
              {t("charsheet.status.health")}
            </SectionHeader>
            <HealthSection {...healthService} />
          </div>

          <div className="tw-flex-1">
            <SectionHeader className="tw-mb-3">
              {t("charsheet.status.merits")}
            </SectionHeader>
            <MeritsSection {...meritsNFlawsService} />
            <SectionHeader className="tw-mb-3 tw-mt-3">
              {t("charsheet.status.flaws")}
            </SectionHeader>
            <FlawsSection {...meritsNFlawsService} />
          </div>
        </div>

        <div className="tw-flex tw-gap-x-4 tw-mb-6">
          <div className="tw-flex-1">
            <SectionHeader className="tw-mb-3">
              {t("charsheet.advantages.otherTraits")}
            </SectionHeader>
            <OtherTraitsSection limits={limits} {...otherTraitsService} />
          </div>

          <div className="tw-flex-1" style={{ flexGrow: 2 }}>
            <SectionHeader className="tw-mb-3">
              {t("charsheet.charHistory")}
            </SectionHeader>
            <CharHistorySection className="tw-mb-6" {...historyService} />

            <SectionHeader className="tw-mb-3">
              {t("charsheet.goals")}
            </SectionHeader>
            <GoalsSection className="tw-mb-6" {...historyService} />
          </div>
        </div>

        <div className="tw-flex tw-gap-x-4 tw-mb-6">
          <div className="tw-flex-1">
            <SectionHeader className="tw-mb-3">
              {t("charsheet.alliesAndContacts")}
            </SectionHeader>
            <AlliesAndContactsSection {...alliesAndContactsService} />
          </div>

          <div className="tw-flex-1">
            <SectionHeader className="tw-mb-3">
              {t("charsheet.possessions")}
            </SectionHeader>
            <PossessionsSection {...possessionsService} />
          </div>
        </div>
      </CharSheetBody>

      <CharSheetBody>
        <SectionHeader className="tw-mb-3">
          {t("charsheet.appearanceDescription")}
        </SectionHeader>
        <div className="tw-flex tw-gap-x-4 tw-mb-6">
          <div className="tw-flex-1">
            <CharacterImageSection {...appearanceService} />
          </div>

          <div className="tw-flex-1" style={{ flexGrow: 2 }}>
            <AppearanceDescriptionSection {...appearanceService} />
          </div>
        </div>

        <SectionHeader className="tw-mb-3">
          {t("charsheet.notes")}
        </SectionHeader>
        <NotesSection {...notesService} />
      </CharSheetBody>
    </>
  );
}
