import React, { Component } from "react";
import Button from "react-bootstrap/cjs/Button";

import { LS_KEY } from "../../constants";
import { str2File, makeFileName } from "../../lib/fileUtils";
import {
  clearSavedCharSheetStorage,
  getSavedCharSheetString,
} from "../../charSheets/root/infrastructure/lsDbService";

interface ErrorBoundryProps {
  children: React.ReactNode;
}
interface ErrorBoundryState {
  hasError: boolean;
  seconds: number;
  startTimeMillis: number;
  errorText: string;
}

export class ErrorBoundry extends Component<
  ErrorBoundryProps,
  ErrorBoundryState
> {
  reloadTimeoutId: NodeJS.Timeout | undefined;
  secondsIntevalId: NodeJS.Timeout | undefined;

  constructor(props: ErrorBoundryProps) {
    super(props);
    this.state = {
      hasError: false,
      seconds: 0,
      startTimeMillis: 0,
      errorText: "",
    };
  }

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundryState> {
    return {
      hasError: true,
      startTimeMillis: Date.now(),
      errorText: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown): void {
    console.error("Unhandled render error", error);
    this.setState({
      hasError: true,
      startTimeMillis: Date.now(),
      errorText: error instanceof Error ? error.message : String(error),
    });
    this.reloadTimeoutId = setTimeout(() => window.location.reload(), 30000);
    this.secondsIntevalId = setInterval(() => {
      this.setState((prevState) => ({
        seconds: Math.round((Date.now() - prevState.startTimeMillis) / 1000),
      }));
    }, 100);
  }

  componentWillUnmount(): void {
    clearTimeout(this.reloadTimeoutId);
    clearInterval(this.secondsIntevalId);
  }

  render(): JSX.Element | React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="tw-m-8">
          <div>
            <p>
              Поймана ошибка, страница перезагрузится автоматически через 30
              секунд (прошло {this.state.seconds} секунд).
            </p>
            <p>
              Если после перезагрузки страница снова падает с ошибкой, значит
              проблема с листом персонажа, хранящимся в памяти браузера.
            </p>
            <p>Попробуйте сделать перезагрузку с очисткой памяти.</p>
            <p>
              Чтобы не потерять данные можно скачать лист персонажа и попытаться
              его исправить вручную.
            </p>
          </div>
          {this.state.errorText && (
            <pre className="tw-whitespace-pre-wrap tw-bg-slate-100 tw-p-3 tw-rounded">
              {this.state.errorText}
            </pre>
          )}
          <br />
          <Button
            className="tw-mr-8 custom-btn-bg-color"
            onClick={() => window.location.reload()}
          >
            Принудительная перезагрузка
          </Button>
          <Button
            className="tw-mr-8 custom-btn-bg-color"
            onClick={() => {
              clearSavedCharSheetStorage();
              window.location.reload();
            }}
          >
            Очистка памяти и принудительная перезагрузка
          </Button>
          <Button
            className="custom-btn-bg-color"
            onClick={() =>
              str2File(
                getSavedCharSheetString(),
                makeFileName("vtm_broken_charsheet", "txt", new Date()),
              )
            }
          >
            Скачать лист персонажа из памяти
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
