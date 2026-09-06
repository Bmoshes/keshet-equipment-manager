import type { EquipmentItem, Loan } from "@/lib/types";
import { formatDate, loanDuration } from "@/lib/utils";
import { BoxIcon, ClockIcon } from "@/components/ui/Icons";

export function MyEquipment({ equipment, loans, employeeId, onReturn }: { equipment: EquipmentItem[]; loans: Loan[]; employeeId: string; onReturn: (id: string) => void }) {
  const activeLoans = loans.filter((loan) => loan.status === "active" && loan.employeeId === employeeId);
  return (
    <section className="surface overflow-hidden border-brand-100/80">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5"><div><p className="eyebrow">אחריות אישית</p><h2 className="mt-1 text-xl font-extrabold">הציוד שלי</h2></div>{activeLoans.length > 0 && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-inset ring-brand-600/10">{activeLoans.length} {activeLoans.length === 1 ? "פריט" : "פריטים"}</span>}</div>
      {activeLoans.length > 0 ? <div className="divide-y divide-slate-100">{activeLoans.map((loan) => {
        const item = equipment.find((entry) => entry.id === loan.equipmentId);
        if (!item) return null;
        return <article key={loan.id} className="flex flex-col gap-4 p-4 transition hover:bg-brand-50/25 sm:flex-row sm:items-center sm:p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><BoxIcon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="font-extrabold">{item.name}</h3><p className="mt-1 font-mono text-xs font-semibold text-slate-400" dir="ltr">{item.assetTag}</p></div><div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600"><ClockIcon className="h-4 w-4 text-brand-600" /><span className="font-semibold">מושאל {loanDuration(loan.borrowedAt)}</span><span className="hidden text-slate-300 sm:inline">•</span><span className="hidden text-xs text-slate-400 sm:inline">{formatDate(loan.borrowedAt)}</span></div><button className="secondary-button sm:min-w-24" onClick={() => onReturn(item.id)}>החזר</button></article>;
      })}</div> : <div className="grid min-h-48 place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><BoxIcon /></span><h3 className="mt-4 font-extrabold">אין אצלך ציוד כרגע</h3><p className="mt-1 text-sm text-slate-500">פריט שתשאל יופיע כאן באופן מיידי.</p></div></div>}
    </section>
  );
}
