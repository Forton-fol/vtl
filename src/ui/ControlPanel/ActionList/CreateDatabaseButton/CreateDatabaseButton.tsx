import React, { FormEvent, useState } from "react";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/cjs/Modal";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/cjs/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { initialCharSheet } from "../../../../charSheets/root/services/initialValues";
import { CharSheetStorageService } from "../../../../charSheets/root/application/ports";
import { generateSheetId } from "../../../../lib/miscUtils";

interface CreateDatabaseButtonProps extends CharSheetStorageService {
  className?: string;
}

export function CreateDatabaseButton(props: CreateDatabaseButtonProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const { setCharSheet, className } = props;

  function setEmptyCharSheet() {
    const newSheet = R.clone(initialCharSheet);
    newSheet.sheetId = generateSheetId(); // каждый новый лист получает уникальный ID
    setCharSheet(newSheet);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmptyCharSheet();
    setShowModal(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="nav-item-btn"
        title={t("actionMenu.create-database")}
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>{t("actionMenu.create-database")}</span>
      </button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {t("actionMenu.create-database-modal-title")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{t("actionMenu.create-database-modal-text")}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button variant="outline-primary" type="submit">
              {t("common.confirm")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
