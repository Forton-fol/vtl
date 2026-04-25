import React from "react";
import DocumentTitle from "react-document-title";
import Card from "react-bootstrap/cjs/Card";
import { useTranslation } from "react-i18next";

import { ExternalLink } from "../../uiLib/ExternalLink";
import { UnorderedList } from "../../uiLib/UnorderedList";

export function DarkPackPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <DocumentTitle title={t("darkPack.header")}>
      <main
        className="tw-mx-auto tw-my-4"
        style={{
          width: "46rem",
          maxWidth: "calc(100% - 2rem)",
        }}
      >
        <Card>
          <Card.Body>
            <div className="tw-flex tw-flex-col tw-gap-4">
              <div className="tw-flex tw-flex-col tw-gap-4 lg:tw-flex-row lg:tw-items-start">
                <img
                  src="/dark-pack-logo.png"
                  alt="Dark Pack logo"
                  style={{ width: "12rem", maxWidth: "100%" }}
                />
                <div>
                  <h1 className="tw-text-lg tw-mb-3">{t("darkPack.header")}</h1>
                  <p>{t("darkPack.subtitle")}</p>
                  <p>{t("darkPack.intro")}</p>
                  <p>
                    <ExternalLink href="https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement">
                      {t("darkPack.officialAgreement")}
                    </ExternalLink>
                  </p>
                </div>
              </div>

              <section>
                <h2 className="tw-text-lg tw-mb-3">
                  {t("darkPack.legalNoticeLabel")}
                </h2>
                <Card className="tw-bg-slate-50">
                  <Card.Body>
                    <p className="tw-mb-0 tw-break-words">
                      {t("darkPack.legalNotice")}
                    </p>
                  </Card.Body>
                </Card>
              </section>

              <section>
                <h2 className="tw-text-lg tw-mb-3">
                  {t("darkPack.unofficialLabel")}
                </h2>
                <Card className="tw-bg-slate-50">
                  <Card.Body>
                    <p className="tw-mb-0">{t("darkPack.unofficialNotice")}</p>
                  </Card.Body>
                </Card>
              </section>

              <section>
                <h2 className="tw-text-lg tw-mb-3">
                  {t("darkPack.complianceListTitle")}
                </h2>
                <UnorderedList>
                  <li>{t("darkPack.compliancePoint1")}</li>
                  <li>{t("darkPack.compliancePoint2")}</li>
                  <li>{t("darkPack.compliancePoint3")}</li>
                  <li>{t("darkPack.compliancePoint4")}</li>
                </UnorderedList>
              </section>
            </div>
          </Card.Body>
        </Card>
      </main>
    </DocumentTitle>
  );
}