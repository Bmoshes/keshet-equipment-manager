"use client";

import { useEffect } from "react";
import { CheckIcon, CloseIcon, AlertIcon } from "./Icons";

export function Alert({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  const success = type === "success";
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <div role={success ? "status" : "alert"} aria-live={success ? "polite" : "assertive"} className={`fixed bottom-5 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-lift ${success ? "border-emerald-200 text-emerald-900" : "border-red-200 text-red-900"}`} style={{ animation: "scale-in 180ms ease-out" }}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${success ? "bg-emerald-100" : "bg-red-100"}`}>{success ? <CheckIcon className="h-5 w-5" /> : <AlertIcon className="h-5 w-5" />}</span>
      <p className="flex-1 text-sm font-bold">{message}</p>
      <button onClick={onClose} aria-label="סגירת הודעה" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5"><CloseIcon className="h-4 w-4" /></button>
    </div>
  );
}
