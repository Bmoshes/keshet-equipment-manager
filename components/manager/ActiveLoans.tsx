"use client";

import { useCallback, useState } from "react";
import type { EquipmentItem, Loan, User } from "@/lib/types";
import { formatDate, loanDuration, loanDurationDays } from "@/lib/utils";
import { ClockIcon } from "@/components/ui/Icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ActiveLoans({ equipment, loans, users, onReturn }: { equipment: EquipmentItem[]; loans: Loan[]; users: User[]; onReturn: (id: string) => void }) {
  const activeLoans = loans.filter((loan) => loan.status === "active").sort((a, b) => a.borrowedAt.localeCompare(b.borrowedAt));
  const [pendingEquipmentId, setPendingEquipmentId] = useState<string | null>(null);
  const pendingLoan = activeLoans.find((loan) => loan.equipmentId === pendingEquipmentId);
  const pendingItem = equipment.find((item) => item.id === pendingEquipmentId);
  const pendingEmployee = users.find((user) => user.id === pendingLoan?.employeeId);
  const closeConfirmation = useCallback(() => setPendingEquipmentId(null), []);
  const confirmReturn = () => {
    if (pendingEquipmentId) onReturn(pendingEquipmentId);
    closeConfirmation();
  };
  return (
    <section id="active-loans" className="surface scroll-mt-24 overflow-hidden">
      <div className="flex items-end justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5"><div><p className="eyebrow">מעקב שוטף</p><h2 className="mt-1 text-xl font-extrabold">השאלות פעילות</h2></div><div className="text-left"><p className="text-sm font-bold text-ink">{activeLoans.length} השאלות</p><p className="hidden text-xs text-slate-400 sm:block">מהוותיקה לחדשה</p></div></div>
      {activeLoans.length > 0 ? <><div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[760px] text-right"><thead><tr className="bg-slate-50 text-xs font-bold text-slate-500"><th className="px-5 py-3">ציוד</th><th className="px-5 py-3">עובד</th><th className="px-5 py-3">תאריך השאלה</th><th className="px-5 py-3">משך</th><th className="px-5 py-3"><span className="sr-only">פעולה</span></th></tr></thead><tbody className="divide-y divide-slate-100">{activeLoans.map((loan) => {
        const item = equipment.find((entry) => entry.id === loan.equipmentId);
        const employee = users.find((user) => user.id === loan.employeeId);
        if (!item || !employee) return null;
        const isLong = loanDurationDays(loan.borrowedAt) > 7;
        const initials = employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
        return <tr key={loan.id} className="text-sm transition hover:bg-slate-50/80"><td className="px-5 py-4"><p className="font-extrabold">{item.name}</p><p className="mt-0.5 font-mono text-xs text-slate-400" dir="ltr">{item.assetTag}</p></td><td className="px-5 py-4"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700">{initials}</span><span className="font-semibold">{employee.name}</span></div></td><td className="px-5 py-4 text-slate-500">{formatDate(loan.borrowedAt)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold ${isLong ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}><ClockIcon className="h-4 w-4" />מושאל {loanDuration(loan.borrowedAt)}</span></td><td className="px-5 py-4 text-left"><button className="secondary-button" onClick={() => setPendingEquipmentId(item.id)}>סמן כהוחזר</button></td></tr>;
      })}</tbody></table></div><div className="divide-y divide-slate-100 sm:hidden">{activeLoans.map((loan) => {
        const item = equipment.find((entry) => entry.id === loan.equipmentId);
        const employee = users.find((user) => user.id === loan.employeeId);
        if (!item || !employee) return null;
        const isLong = loanDurationDays(loan.borrowedAt) > 7;
        return <article key={loan.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold">{item.name}</h3><p className="mt-0.5 font-mono text-xs font-semibold text-slate-400" dir="ltr">{item.assetTag}</p></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${isLong ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}><ClockIcon className="h-3.5 w-3.5" />{loanDuration(loan.borrowedAt)}</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-400">אצל</p><p className="mt-0.5 font-bold">{employee.name}</p></div><div><p className="text-xs text-slate-400">הושאל בתאריך</p><p className="mt-0.5 font-semibold text-slate-600">{formatDate(loan.borrowedAt)}</p></div></div><button className="secondary-button mt-4 w-full" onClick={() => setPendingEquipmentId(item.id)}>סמן כהוחזר</button></article>;
      })}</div></> : <div className="p-10 text-center"><p className="font-bold">אין השאלות פעילות</p><p className="mt-1 text-sm text-slate-500">כל הציוד חזר למלאי.</p></div>}
      <ConfirmDialog open={Boolean(pendingEquipmentId)} title="סימון פריט כהוחזר" description={`האם לסגור את ההשאלה של ${pendingItem?.name ?? "הפריט"} עבור ${pendingEmployee?.name ?? "העובד"}? הפריט יחזור מיידית למלאי הזמין.`} confirmLabel="כן, סמן כהוחזר" onConfirm={confirmReturn} onCancel={closeConfirmation} />
    </section>
  );
}
