"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { EquipmentCategory, NewEquipmentInput, ServiceResult } from "@/lib/types";
import { categoryLabels } from "@/lib/utils";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";
import { trapFocus } from "@/components/ui/focus-utils";

interface AddEquipmentDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewEquipmentInput) => ServiceResult;
}

const emptyForm: NewEquipmentInput = { name: "", assetTag: "", category: "laptop", status: "available" };
const categories: EquipmentCategory[] = ["laptop", "monitor", "projector", "recording"];

export function AddEquipmentDrawer({ open, onClose, onSubmit }: AddEquipmentDrawerProps) {
  const [form, setForm] = useState<NewEquipmentInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewEquipmentInput, string>>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => nameInputRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const closeAndReset = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof NewEquipmentInput, string>> = {};
    if (!form.name.trim()) nextErrors.name = "יש להזין שם לפריט.";
    if (!form.assetTag.trim()) nextErrors.assetTag = "יש להזין מספר נכס.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = onSubmit({ ...form, name: form.name.trim(), assetTag: form.assetTag.trim().toLocaleUpperCase("en-US") });
    if (!result.ok) {
      if (result.message.includes("מספר הנכס")) setErrors({ assetTag: result.message });
      return;
    }
    closeAndReset();
  };

  if (!open) return null;

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeAndReset()}>
      <aside role="dialog" aria-modal="true" aria-labelledby={titleId} className="drawer-panel" onKeyDown={trapFocus}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div><p className="eyebrow">ניהול מלאי</p><h2 id={titleId} className="mt-1 text-2xl font-black text-ink">הוספת פריט חדש</h2><p className="mt-2 text-sm text-slate-500">הפריט יתווסף מיידית למלאי המשותף.</p></div>
          <button className="icon-button shrink-0" onClick={closeAndReset} aria-label="סגירת חלונית"><CloseIcon /></button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} noValidate>
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
            <label className="field-label">שם הפריט<span className="text-red-500" aria-hidden="true">*</span>
              <input ref={nameInputRef} value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setErrors({ ...errors, name: undefined }); }} className={`field-input ${errors.name ? "field-input-error" : ""}`} placeholder="לדוגמה: MacBook Pro 14״" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            </label>
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}

            <label className="field-label">מספר נכס<span className="text-red-500" aria-hidden="true">*</span>
              <input value={form.assetTag} onChange={(event) => { setForm({ ...form, assetTag: event.target.value.toLocaleUpperCase("en-US") }); setErrors({ ...errors, assetTag: undefined }); }} className={`field-input font-mono uppercase ${errors.assetTag ? "field-input-error" : ""}`} placeholder="KES-LT-053" dir="ltr" aria-invalid={Boolean(errors.assetTag)} aria-describedby={errors.assetTag ? "asset-error" : "asset-help"} />
            </label>
            <p id="asset-help" className="field-help">מזהה ארגוני ייחודי שיופיע על הפריט.</p>
            {errors.assetTag && <p id="asset-error" className="field-error">{errors.assetTag}</p>}

            <label className="field-label">קטגוריה
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as EquipmentCategory })} className="field-input">
                {categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
            </label>

            <fieldset><legend className="field-label">סטטוס התחלתי</legend><div className="mt-2 grid grid-cols-2 gap-3">
              <label className={`status-choice ${form.status === "available" ? "status-choice-active" : ""}`}><input className="sr-only" type="radio" name="status" value="available" checked={form.status === "available"} onChange={() => setForm({ ...form, status: "available" })} /><span className="h-2 w-2 rounded-full bg-emerald-500" /><span><strong className="block text-sm">זמין</strong><span className="text-xs text-slate-500">ניתן להשאלה</span></span></label>
              <label className={`status-choice ${form.status === "unavailable" ? "status-choice-active" : ""}`}><input className="sr-only" type="radio" name="status" value="unavailable" checked={form.status === "unavailable"} onChange={() => setForm({ ...form, status: "unavailable" })} /><span className="h-2 w-2 rounded-full bg-slate-400" /><span><strong className="block text-sm">לא זמין</strong><span className="text-xs text-slate-500">דורש טיפול</span></span></label>
            </div></fieldset>
          </div>
          <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-7"><div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" className="secondary-button flex-1" onClick={closeAndReset}>ביטול</button><button type="submit" className="primary-button flex-1"><PlusIcon className="h-4 w-4" />הוסף למלאי</button></div></div>
        </form>
      </aside>
    </div>
  );
}
