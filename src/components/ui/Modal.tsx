"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}

function Modal({ open, onClose, title, size = "md", className, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handler = () => {
      if (!el.open) onClose();
    };
    el.addEventListener("close", handler);
    return () => el.removeEventListener("close", handler);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "w-full rounded-2xl bg-bg-surface text-text-primary backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        "open:animate-breathe-in",
        "max-h-[85vh] overflow-y-auto",
        "p-0 border border-border-subtle shadow-2xl",
        sizes[size],
        className
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <div className="p-6">
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
Modal.displayName = "Modal";

export { Modal };
export type { ModalProps };
