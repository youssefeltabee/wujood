"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-score-high/15 border-score-high/30 text-score-high",
  error: "bg-score-low/15 border-score-low/30 text-score-low",
  warning: "bg-score-mid/15 border-score-mid/30 text-score-mid",
  info: "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan",
};

const variantIcons: Record<ToastVariant, string> = {
  success: "M5 13l4 4L19 7",
  error: "M6 18L18 6M6 6l12 12",
  warning: "M12 9v4m0 4h.01",
  info: "M12 16v-4m0-4h.01",
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info", duration: number = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onRemove]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-rise backdrop-blur-sm min-w-[280px] max-w-[420px]",
        variantStyles[item.variant]
      )}
      role="alert"
    >
      <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d={variantIcons[item.variant]} />
      </svg>
      <p className="flex-1">{item.message}</p>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export { ToastProvider, useToast };
export type { ToastVariant };
