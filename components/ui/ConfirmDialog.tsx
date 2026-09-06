"use client";

import { useEffect, useRef } from "react";
import { AlertIcon, CloseIcon } from "./Icons";
import { trapFocus } from "./focus-utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" className="dialog-panel max-w-md" onKeyDown={trapFocus}>
        <button className="icon-button absolute left-4 top-4" onClick={onCancel} aria-label="סגירת חלון"><CloseIcon /></button>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><AlertIcon /></span>
        <h2 id="confirm-title" className="mt-5 text-xl font-extrabold text-ink">{title}</h2>
        <p id="confirm-description" className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelButtonRef} className="secondary-button" onClick={onCancel}>ביטול</button>
          <button className="primary-button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
