import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/cjs/Modal";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/cjs/Form";
import { useTranslation } from "react-i18next";

import { useStore } from "../../charSheets/root/services/store";

interface Props {
  show: boolean;
  onHide(): void;
  sectionKey: string;
  itemIndex: number;
  dotIndex: number;
}

export default function CustomDotEditor(props: Props) {
  const { show, onHide, sectionKey, itemIndex, dotIndex } = props;
  const { t } = useTranslation();
  const { charSheet, setCustomDot } = useStore();

  const [kind, setKind] = useState<"link" | "text">("link");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!show) return;
    const sec = sectionKey;
    const it = String(itemIndex);
    const d = String(dotIndex);
    const payload = (charSheet as any).customDotData?.[sec]?.[it]?.[d];
    if (payload) {
      setKind(payload.kind || "link");
      setContent(payload.content || "");
    } else {
      setKind("link");
      setContent("");
    }
  }, [show, sectionKey, itemIndex, dotIndex, charSheet]);

  function save() {
    setCustomDot(sectionKey, itemIndex, dotIndex, { kind, content });
    onHide();
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {String(
            t("wiki.custom-dot-editor-title", {
              section: sectionKey,
              item: itemIndex + 1,
              dot: dotIndex,
            } as any)
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Check
              type="radio"
              id="kind-link"
              label={t("wiki.custom-dot-kind-link", "Ссылка")}
              name="custom-dot-kind"
              checked={kind === "link"}
              onChange={() => setKind("link")}
            />
            <Form.Check
              type="radio"
              id="kind-text"
              label={t("wiki.custom-dot-kind-text", "Текст")}
              name="custom-dot-kind"
              checked={kind === "text"}
              onChange={() => setKind("text")}
            />
          </Form.Group>

          {kind === "link" ? (
            <Form.Group className="tw-mt-3">
              <Form.Label>{t("wiki.custom-dot-link-label", "URL")}</Form.Label>
              <Form.Control
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://"
              />
            </Form.Group>
          ) : (
            <Form.Group className="tw-mt-3">
              <Form.Label>{t("wiki.custom-dot-text-label", "Текст")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          {t("common.cancel", "Отмена")}
        </Button>
        <Button variant="outline-primary" onClick={save}>
          {t("common.save", "Запомнить")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
