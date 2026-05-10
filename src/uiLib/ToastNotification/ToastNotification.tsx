import React, { createContext, useCallback, useContext, useMemo, useState, PropsWithChildren } from "react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastOptions {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  notify: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function getUniqueId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: PropsWithChildren<{}>) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (options: ToastOptions) => {
      const id = getUniqueId();
      const toast: ToastMessage = {
        id,
        type: options.type ?? "info",
        title: options.title,
        message: options.message,
        actionLabel: options.actionLabel,
        onAction: options.onAction,
      };
      setToasts((prev) => [toast, ...prev]);
      const duration = options.duration ?? 5000;
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, duration);
    },
    [],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="tw-fixed tw-top-4 tw-right-4 tw-z-[2000] tw-flex tw-flex-col tw-gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`tw-max-w-sm tw-min-w-[18rem] tw-rounded-2xl tw-border tw-border-gray-700 tw-shadow-xl tw-p-4 tw-ring-1 tw-ring-white/10 tw-text-white ${
              toast.type === "success"
                ? "tw-border-emerald-500 tw-bg-emerald-950/95"
                : toast.type === "warning"
                ? "tw-border-amber-500 tw-bg-amber-950/95"
                : toast.type === "error"
                ? "tw-border-red-500 tw-bg-red-950/95"
                : "tw-border-sky-500 tw-bg-sky-950/95"
            }`}
          >
            <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
              <div className="tw-flex tw-flex-col tw-gap-1">
                <strong className="tw-block tw-text-sm tw-font-semibold">{toast.title}</strong>
                <p className="tw-text-xs tw-text-slate-200">{toast.message}</p>
              </div>
              <button
                type="button"
                className="tw-text-slate-300 hover:tw-text-white"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
            {toast.actionLabel && toast.onAction && (
              <div className="tw-mt-3 tw-flex tw-justify-end">
                <button
                  type="button"
                  className="btn-modern btn-modern-ghost tw-text-xs tw-uppercase"
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                >
                  {toast.actionLabel}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
